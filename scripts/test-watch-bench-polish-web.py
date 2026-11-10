#!/usr/bin/env python3
"""One oval bench: real front/cover pixels and desktop/phone hardware contact input.

Generate watch_bench_polish_fixture.gd before starting this browser-only check.
"""
import importlib.util
import json
import os
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('bench_service',ROOT/'scripts/test-watch-service-web.py')
service=importlib.util.module_from_spec(spec);spec.loader.exec_module(service)
WRITE_SAVE="""async input=>{const db=await new Promise((r,j)=>{const q=indexedDB.open('/userfs');q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error)});try{await new Promise((r,j)=>{const tx=db.transaction('FILE_DATA','readwrite');tx.objectStore('FILE_DATA').put({timestamp:new Date(),mode:33206,contents:new TextEncoder().encode(JSON.stringify(input.state))},input.key);tx.oncomplete=r;tx.onerror=()=>j(tx.error)})}finally{db.close()}}"""
def main():
 fixture=json.loads((ROOT/'work/watch-expansion/task-3-fixture.json').read_text())
 item=fixture['inventory'][0];assert item['defId']=='WCH-075'
 title=next(d['name'] for d in json.loads((ROOT/'godot/data/game_data.json').read_text())['itemDefs'] if d['id']==item['defId'])
 output=ROOT/'work/watch-expansion/bench-polish-web';output.mkdir(exist_ok=True)
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  try:
   for label,width,height,mobile in [('desktop',1440,900,False),('phone',844,390,True)]:
    context=browser.new_context(viewport={'width':width,'height':height},has_touch=mobile,is_mobile=mobile,device_scale_factor=2 if mobile else 1)
    page=context.new_page();errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('console',lambda m:errors.append(m.text) if any(s in m.text for s in ['SCRIPT ERROR','SHADER ERROR','Error compiling shader']) else None)
    def cmd(data):page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))',data)
    def state():return page.evaluate('OrbitalTouch.state')
    def boot():
     page.goto('http://127.0.0.1:4174/');page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=90000)
     cmd({'type':'start'});page.wait_for_function('!OrbitalTouch.state.title && !OrbitalTouch.state.busy')
    def click(text):
     found=service.phone.locate(page,text);assert found['found'] and not found['disabled'],(text,found)
     (page.touchscreen.tap if mobile else page.mouse.click)(found['x'],found['y']);page.wait_for_timeout(300)
    def snap(name):page.screenshot(path=str(output/f'{label}-{name}.png'))
    try:
     boot();cmd({"type":"arrive"});page.wait_for_timeout(1500)
     row=page.evaluate(service.READ_SAVE);assert row
     # Unload the app before changing WebFS, preventing a live autosave race.
     page.goto('http://127.0.0.1:4174/godot-license.txt')
     page.evaluate(WRITE_SAVE,{'key':row['key'],'state':fixture})
     boot();cmd({'type':'page','page':'repair'})
     page.wait_for_function('([uid,title])=>OrbitalTouch.state.repair_uid===uid && OrbitalTouch.state.detail_title===title',arg=[item['uid'],title])
     assert state()['repair_task']=='open',state()
     click('伪装加工');page.wait_for_function("OrbitalTouch.state.repair_task==='forge_logo'")
     snap('oval-front')
     click('维修保养');page.wait_for_function("OrbitalTouch.state.repair_task==='open'")
     snap('oval-cover-seated')
     for expected in ['safe_mechanical','unscrew_cover','lift_cover']:
      current=state();assert current['repair_uid']==item['uid'] and current['detail_title']==title,current
      assert not current['repair_reason'],current
      target=current['repair_targets'][0];assert target['id']==expected,target
      (page.touchscreen.tap if mobile else page.mouse.click)(target['x'],target['y'])
      page.wait_for_timeout(550)
      if expected=='safe_mechanical':snap('oval-crown-contact')
      if expected=='unscrew_cover':
       page.wait_for_function("OrbitalTouch.state.repair_animation.phase==='act'",timeout=6000)
       snap('oval-opener-contact')
      page.wait_for_function('step=>OrbitalTouch.state.repair_animation.phase===\'idle\' && OrbitalTouch.state.repair_animation.step>step',arg=current['repair_animation']['step'],timeout=12000)
     snap('oval-cover-detached')
     assert state()['repair_animation']['parts']['cover']==[510,150]
     assert not errors,errors
     print(label,title,item['uid'],'front/seated cover/crown/opener/detached cover and real hardware input PASS',flush=True)
    except Exception:
     snap('failure');print(label,'FAIL',state(),flush=True);raise
    finally:context.close()
  finally:browser.close()
if __name__=='__main__':main()
