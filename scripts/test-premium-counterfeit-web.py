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
 out=ROOT/'work/premium-counterfeit/browser';out.mkdir(parents=True,exist_ok=True)
 with tempfile.TemporaryDirectory() as saves:
  subprocess.run([os.environ.get('GODOT_BIN','godot'),'--headless','--path',str(ROOT/'godot'),'--script','res://tests/premium_counterfeit_fixture.gd'],env={**os.environ,'XDG_DATA_HOME':saves},check=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,timeout=30)
 fixture=json.loads((ROOT/'work/premium-counterfeit/fixture.json').read_text())
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
    click('伪装加工');phone.wait(page,"s.repair_mode==='forge'")
    click('选择仿冒目标');page.wait_for_timeout(250)
    click('星冕 X06');phone.wait(page,"s.forge_target==='WCH-033'")
    assert status()['ap']==before_ap
    snap('selected-target')
    for job,title in [('logo','重描标识'),('case','改装目标外壳'),('serial','伪造紫外编号'),('weight','配重校准')]:
     click(title);phone.wait(page,f"s.repair_task==='forge_{job}'")
     paid=before_ap-['logo','case','serial','weight'].index(job)-1
     for attempt in range(40):
      state=status()
      if state['ap']==paid:break
      assert not state['repair_reason'],state
      previous=state['repair_animation']
      click(state['repair_action'])
      page.wait_for_function("step=>{const a=OrbitalTouch.state.repair_animation;return OrbitalTouch.state.repair_reason || a.complete || a.phase==='idle'&&a.step>step}",arg=previous['step'],timeout=20000)
     assert status()['ap']==paid,(job,status())
     snap(job+'-complete')
    assert status()['forge_similarity']==100,status()
    # Durable save, close/reload and reopen the same original item.
    deadline=time.time()+12
    while time.time()<deadline:
     saved=page.evaluate(service.READ_SAVE)
     if saved and saved['state']['inventory'][0].get('forgery',{}).get('methods',{}).get('weight'):break
     page.wait_for_timeout(200)
    else:raise AssertionError('completed work not durably saved')
    item=saved['state']['inventory'][0]
    assert item['defId']=='WCH-023' and item['forgery']['targetId']=='WCH-033'
    page.reload();page.wait_for_function('window.OrbitalTouch?.state?.ready && OrbitalTouch.state.has_save',timeout=90000)
    cmd({'type':'start'});phone.wait(page,'!s.title && !s.busy')
    cmd({'type':'page','page':'repair'});phone.wait(page,"s.workspace==='repair'")
    click('伪装加工');phone.wait(page,"s.repair_mode==='forge'")
    assert status()['forge_target']=='WCH-033' and status()['forge_similarity']==100
    snap('restored')
    assert not errors,errors
    print(label,'PREMIUM counterfeit four independent jobs, cost, physical match and reload pass',flush=True)
   finally:context.close()
  browser.close()
if __name__=='__main__':main()
