#!/usr/bin/env python3
"""Capture real counter edge states and desktop sizes with isolated browser saves."""
import importlib.util,json,sys,os,subprocess,tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1];sys.path.insert(0,str(root/'scripts'))
def mod(n,p):
 s=importlib.util.spec_from_file_location(n,root/p);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
phone=mod('phone','scripts/test-godot-phone.py');service=mod('service','scripts/test-watch-service-web.py')
out=root/'work/strict-reference';errors=[]
with tempfile.TemporaryDirectory(prefix='strict-states-') as td:
 subprocess.run(['godot','--headless','--path',str(root/'godot'),'--script','res://tests/strict_reference_fixture.gd'],env={**os.environ,'XDG_DATA_HOME':td},stdout=subprocess.PIPE,stderr=subprocess.STDOUT,check=True,timeout=40)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--mute-audio'])
 page=b.new_page(viewport={'width':1920,'height':1080});page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('console',lambda msg:errors.append(msg.text) if msg.type=='error' and 'browser metadata' not in msg.text else None)
 def cmd(d):page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))',d)
 def start():
  page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=120000);cmd({'type':'start'});page.wait_for_timeout(250);phone.wait(page,'!s.title&&!s.busy',timeout=30000);page.wait_for_timeout(1000)
 page.goto(os.environ.get('STRICT_COUNTER_URL','http://127.0.0.1:4174/'));start();key=phone.locate(page,'@StrictTradeAction_0');page.mouse.click(key['x'],key['y']);page.wait_for_timeout(250);phone.wait(page,'!s.busy',timeout=30000);page.wait_for_timeout(1000)
 row=page.evaluate(service.READ_SAVE)
 for _ in range(80):
  if row:break
  page.wait_for_timeout(150);row=page.evaluate(service.READ_SAVE)
 assert row,page.evaluate('OrbitalTouch.state')
 for name in ['main','closed','merchant','landlord']:
  state=json.loads((out/('fixture.json' if name=='main' else 'fixture-'+name+'.json')).read_text())
  page.evaluate('''async input=>{const db=await new Promise(r=>{const q=indexedDB.open('/userfs');q.onsuccess=()=>r(q.result)});await new Promise((r,j)=>{const tx=db.transaction('FILE_DATA','readwrite');tx.objectStore('FILE_DATA').put({timestamp:new Date(),mode:33206,contents:new TextEncoder().encode(JSON.stringify(input.state))},input.key);tx.oncomplete=r;tx.onerror=j});db.close()}''',{'key':row['key'],'state':state})
  page.reload();start();page.mouse.move(1900,1060);page.screenshot(path=str(out/(name+'.png')))
  s=page.evaluate('OrbitalTouch.state');assert not s.get('workspace')
  if name=='main':
   uid=next(r['uid'] for r in s['table_items'] if r['direction']=='sell' and r['price']==95);k=phone.locate(page,'@strict_table_'+uid);page.mouse.move(k['x'],k['y']);page.wait_for_timeout(200);page.screenshot(path=str(out/'main-reference.png'))
  if name=='closed':
   key=phone.locate(page,'声音');page.mouse.click(key['x'],key['y']);page.wait_for_timeout(400);page.screenshot(path=str(out/'closed-muted.png'))
  if name=='merchant':assert page.evaluate(service.READ_SAVE)['state']['trade']['kind']=='merchant',s
  if name=='landlord':assert page.evaluate(service.READ_SAVE)['state']['trade']['kind']=='landlord',s
  print('PASS captured',name,flush=True)
 page.set_viewport_size({'width':1440,'height':900});page.wait_for_timeout(600);page.screenshot(path=str(out/'desktop-1440.png'))
 page.set_viewport_size({'width':2560,'height':1440});page.wait_for_timeout(600);page.screenshot(path=str(out/'desktop-2560.png'))
 assert not errors,errors
 (out/'state-browser-results.json').write_text(json.dumps({'passed':True,'errors':errors,'states':['main','closed','muted','merchant','landlord'],'viewports':[[1920,1080],[1440,900],[2560,1440]]},indent=2)+'\n')
 b.close()
