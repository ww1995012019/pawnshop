from playwright.sync_api import sync_playwright
from pathlib import Path
import json
import os
import subprocess
import tempfile
ROOT=Path(__file__).resolve().parents[1]
os.chdir(ROOT)
with tempfile.TemporaryDirectory() as save_dir:
 subprocess.run(["godot","--headless","--path","godot","--script","res://tests/warehouse_browser_fixture.gd"],env={**os.environ,"XDG_DATA_HOME":save_dir},check=True,capture_output=True,timeout=30)
import importlib.util
spec=importlib.util.spec_from_file_location('phone','scripts/test-godot-phone.py'); phone=importlib.util.module_from_spec(spec);spec.loader.exec_module(phone)
out=Path('work/counter-complete');out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--mute-audio'])
 page=b.new_page(viewport={'width':1920,'height':1080});errors=[]
 page.on('console',lambda m:errors.append(m.text) if 'SCRIPT ERROR' in m.text else None)
 page.goto('http://127.0.0.1:4174/')
 page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=120000)
 page.evaluate('orbitalTouchSend(JSON.stringify({type:"start"}))')
 phone.wait(page,'!s.title&&!s.busy',timeout=30000)
 page.wait_for_timeout(2200)
 # Persist initial state before injecting a populated inventory in this test-only browser.
 page.evaluate('orbitalTouchSend(JSON.stringify({type:"arrive"}))');page.wait_for_timeout(3000)
 spec2=importlib.util.spec_from_file_location('service','scripts/test-watch-service-web.py');service=importlib.util.module_from_spec(spec2);spec2.loader.exec_module(service)
 row=page.evaluate(service.READ_SAVE)
 assert row
 fixture=json.loads(Path('work/warehouse-expansion/fixture.json').read_text())
 for item in fixture['inventory']: item['sourceVerified']=True
 page.evaluate("""async input=>{const db=await new Promise(r=>{const q=indexedDB.open('/userfs');q.onsuccess=()=>r(q.result)});await new Promise((r,j)=>{const tx=db.transaction('FILE_DATA','readwrite');tx.objectStore('FILE_DATA').put({timestamp:new Date(),mode:33206,contents:new TextEncoder().encode(JSON.stringify(input.state))},input.key);tx.oncomplete=r;tx.onerror=j});db.close()}""",{'key':row['key'],'state':fixture})
 page.reload();page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=120000)
 page.evaluate('orbitalTouchSend(JSON.stringify({type:"start"}))');phone.wait(page,'!s.title&&!s.busy',timeout=30000);page.wait_for_timeout(2000)
 page.mouse.move(1370,940)
 page.screenshot(path=str(out/'pc-idle.png'))
 print(page.evaluate('OrbitalTouch.state'))
 def click(text):
  loc=phone.locate(page,text);page.mouse.click(loc['x'],loc['y']);page.wait_for_timeout(600)
 def saved(): return page.evaluate(service.READ_SAVE)['state']
 def saved_when(predicate):
  for _ in range(50):
   state=saved()
   if predicate(state): return state
   page.wait_for_timeout(200)
  raise AssertionError('Expected arrangement did not reach durable save')
 def drag(x,y,tx,ty):
  page.mouse.move(x,y);page.mouse.down();page.wait_for_timeout(350)
  for step in range(1,13):
   page.mouse.move(x+(tx-x)*step/12,y+(ty-y)*step/12);page.wait_for_timeout(100)
  page.mouse.up();page.wait_for_timeout(1600)
 uid=fixture['inventory'][0]['uid']
 def point(name):
  loc=phone.locate(page,'@'+name);return loc['x'],loc['y']
 def drag_to(source,target):
  drag(*point(source),*point(target))
 warehouse_uid=[i['uid'] for i in fixture['inventory'] if i['location']=='warehouse'][1]
 drag_to('stock_recommend_'+uid,'stock_recommend_'+warehouse_uid)
 state=saved_when(lambda s:next(i for i in s['inventory'] if i['uid']==uid)['location']=='warehouse')
 assert state['showroomLayout']['warehouse'][uid]==1,state['showroomLayout']
 drag_to('stock_recommend_'+uid,'showroom_empty_display_0')
 state=saved_when(lambda s:next(i for i in s['inventory'] if i['uid']==uid)['location']=='display')
 assert state['showroomLayout']['display'][uid]==0
 drag_to('stock_recommend_'+uid,'stock_recommend_'+fixture['inventory'][1]['uid'])
 state=saved_when(lambda s:s['showroomLayout']['display'].get(uid)==1)
 assert state['cash']==5000 and state['ap']==12
 page.screenshot(path=str(out/'pc-dragged.png'))
 print('PASS real drag: cabinet→counter→cabinet, swap, no cash/AP change',flush=True)
 # Counter world is letterboxed from a 1920x1080 coordinate system.
 page.mouse.click(*point('stock_recommend_'+uid));page.mouse.move(1370,940);page.wait_for_timeout(800)
 page.screenshot(path=str(out/'pc-selected.png'))
 page.mouse.click(1175,725);page.mouse.move(1370,940);page.wait_for_timeout(500)
 page.screenshot(path=str(out/'pc-flipped.png'))
 try:
  click('放大镜 · 查看标识');phone.wait(page,'s.workspace==="inspect"',timeout=10000)
  page.screenshot(path=str(out/'pc-tool.png'))
  page.evaluate('orbitalTouchSend(JSON.stringify({type:"close"}))')
  phone.wait(page,'s.workspace===""',timeout=10000);page.wait_for_timeout(400)
  click('放回原位')
 except Exception as e: raise AssertionError('Interaction failed') from e
 page.reload();page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=120000)
 assert saved()['showroomLayout']['display'][uid]==1
 print('PASS browser reload retained arrangement',flush=True)
 print('ERRORS',errors)
 assert not errors
 b.close()
