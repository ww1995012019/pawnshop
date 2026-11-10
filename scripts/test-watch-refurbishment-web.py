#!/usr/bin/env python3
"""Independent exterior jobs, case pause/resume and physical truth through real input."""
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import time
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
def module(name,path):
 spec=importlib.util.spec_from_file_location(name,path);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
service=module('service',ROOT/'scripts/test-watch-service-web.py')
phone=service.phone

def main():
 out=ROOT/'work/independent-refurb/browser';out.mkdir(parents=True,exist_ok=True)
 with tempfile.TemporaryDirectory() as saves:
  subprocess.run([os.environ.get('GODOT_BIN','godot'),'--headless','--path',str(ROOT/'godot'),'--script','res://tests/watch_refurbishment_fixture.gd'],env={**os.environ,'XDG_DATA_HOME':saves},check=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,timeout=30)
 fixture=json.loads((ROOT/'work/independent-refurb/fixture.json').read_text())
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  for mobile,width,height in [(False,1440,900),(True,844,390)]:
   label='phone' if mobile else 'desktop'
   context=browser.new_context(viewport={'width':width,'height':height},has_touch=mobile,is_mobile=mobile,device_scale_factor=2 if mobile else 1)
   page=context.new_page();errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.on('console',lambda m:errors.append(m.text) if 'SCRIPT ERROR' in m.text or 'SHADER ERROR' in m.text else None)
   def cmd(data):page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))',data)
   def status():return page.evaluate('OrbitalTouch.state')
   def snap(name):page.screenshot(path=str(out/f'{label}-{name}.png'))
   def click(text):
    for attempt in range(12):
     target=phone.locate(page,text)
     if height*.16 < target['y'] < height*.87:break
     x=width*.87
     if mobile:
      a,b=(height*.73,height*.37) if target['y']>=height*.87 else (height*.37,height*.73)
      phone.touch_drag(context,page,[(x,a),(x,(a+b)/2),(x,b)])
     else:
      page.mouse.move(x,height*.58);page.mouse.wheel(0,300 if target['y']>=height*.87 else -300)
     page.wait_for_timeout(180)
    assert not target['disabled'],(text,status())
    if mobile:page.touchscreen.tap(target['x'],target['y'])
    else:page.mouse.click(target['x'],target['y'])
    print(label,'click',text,flush=True)
   try:
    page.goto('http://127.0.0.1:4174/')
    page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=90000)
    cmd({'type':'start'});phone.wait(page,'!s.title && !s.busy')
    cmd({'type':'page','page':'repair'});phone.wait(page,"s.workspace==='repair'")
    page.wait_for_timeout(600)
    row=page.evaluate(service.READ_SAVE)
    assert row,'initial save must exist'
    page.evaluate('''async input=>{const db=await new Promise(r=>{const q=indexedDB.open('/userfs');q.onsuccess=()=>r(q.result)});await new Promise((r,j)=>{const tx=db.transaction('FILE_DATA','readwrite');tx.objectStore('FILE_DATA').put({timestamp:new Date(),mode:33206,contents:new TextEncoder().encode(JSON.stringify(input.state))},input.key);tx.oncomplete=r;tx.onerror=j});db.close()}''',{'key':row['key'],'state':fixture})
    page.reload();page.wait_for_function('window.OrbitalTouch?.state?.ready && OrbitalTouch.state.has_save',timeout=90000)
    cmd({'type':'start'});phone.wait(page,'!s.title && !s.busy')
    cmd({'type':'page','page':'repair'});phone.wait(page,"s.workspace==='repair'")
    uid=status()['repair_uid'];before_ap=status()['ap']
    click('独立翻新');phone.wait(page,"s.repair_mode==='refurb'")
    for job,title in [('case','更换表壳'),('strap','更换表带'),('blow','吹除浮灰'),('polish','表壳抛光'),('clean','擦拭清洁')]:
     click(title);phone.wait(page,f"s.repair_task==='refurb_{job}'")
     for attempt in range(35):
      state=status()
      if job in state['refurb_done']:break
      assert not state['repair_reason'],state
      prior=state['repair_animation']
      if attempt%2:
       target=state['repair_targets'][0]
       if mobile:page.touchscreen.tap(target['x'],target['y'])
       else:page.mouse.click(target['x'],target['y'])
       print(label,'contact',target['label'],flush=True)
      else:click(state['repair_action'])
      if job=='case' and attempt==0:
       page.wait_for_timeout(200);snap('case-start')
       click('收起');phone.wait(page,"s.workspace===''")
       cmd({'type':'page','page':'repair'});phone.wait(page,"s.workspace==='repair' && s.repair_mode==='refurb' && s.repair_task==='refurb_case'")
       assert status()['ap']==before_ap,'pausing must not charge unfinished work'
      page.wait_for_function('''old=>{const s=OrbitalTouch.state,a=s.repair_animation;return s.refurb_done.includes(old.job)||a?.complete||a?.phase==='idle'&&a.step>old.step}''',arg={'job':job,'step':prior['step']},timeout=15000)
      if attempt==1:snap(job+'-contact')
     else:raise AssertionError(('unbounded job',job,status()))
     snap(job+'-finished')
     print(label,job,'PASS',flush=True)
    deadline=time.monotonic()+15
    while True:
     row=page.evaluate(service.READ_SAVE)
     persisted=next((it for it in row['state']['inventory'] if it['uid']==uid),{}) if row else {}
     if len(persisted.get('refurbishment',{}).get('done',[]))==5:break
     assert time.monotonic()<deadline,'completed refurbishment did not reach persistent storage'
     page.wait_for_timeout(150)
    saved=next(it for it in row['state']['inventory'] if it['uid']==uid)
    original=next(it for it in fixture['inventory'] if it['uid']==uid)
    assert not saved['working'] and not saved['authentic'] and saved['watch']==original['watch']
    assert saved['condition']>original['condition'] and saved['condition']<=.95
    assert abs(status()['ap']-(before_ap-2.4))<.00001,'each job charges its own cost exactly once'
    assert set(saved['refurbishment']['done'])=={'case','strap','blow','polish','clean'}
    if mobile:
     page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(400)
     page.set_viewport_size({'width':844,'height':390});page.wait_for_timeout(500)
     assert status()['repair_uid']==uid and len(status()['refurb_done'])==5
     snap('rotated')
    assert not errors,errors
    print(label,'independent jobs, case resume, single charges and unchanged movement/authenticity PASS',flush=True)
   except Exception:
    snap('failure');print(status(),flush=True);raise
   finally:context.close()
  browser.close()
if __name__=='__main__':main()
