"""Eight real NPC originals remain visible and focusable on desktop and touch."""
import importlib.util,json,os,shutil,subprocess,tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('service',ROOT/'scripts/test-watch-service-web.py')
service=importlib.util.module_from_spec(spec);spec.loader.exec_module(service)
with tempfile.TemporaryDirectory() as saves:
 subprocess.run(['godot','--headless','--path',str(ROOT/'godot'),'--script','res://tests/eight_item_visit_fixture.gd'],env={**os.environ,'XDG_DATA_HOME':saves},check=True,capture_output=True,timeout=30)
fixture=json.loads((ROOT/'work/eight-item-visit/fixture.json').read_text())
WRITE='''async input=>{const db=await new Promise(r=>{const q=indexedDB.open('/userfs');q.onsuccess=()=>r(q.result)});await new Promise((r,j)=>{const tx=db.transaction('FILE_DATA','readwrite');tx.objectStore('FILE_DATA').put({timestamp:new Date(),mode:33206,contents:new TextEncoder().encode(JSON.stringify(input.state))},input.key);tx.oncomplete=r;tx.onerror=j});db.close()}'''
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for width,height in ([(390,844)] if os.environ.get("EIGHT_PORTRAIT_ONLY") else [(1440,900),(844,390),(568,320),(390,844)]):
  mobile=width<1000
  ctx=browser.new_context(viewport={'width':width,'height':height},has_touch=mobile,is_mobile=mobile,device_scale_factor=1)
  page=ctx.new_page();errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('console',lambda m:errors.append(m.text) if 'SCRIPT ERROR' in m.text or 'SHADER ERROR' in m.text else None)
  def cmd(data):page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))',data)
  page.goto('http://127.0.0.1:4174/');page.wait_for_function('OrbitalTouch?.state?.ready',timeout=120000)
  cmd({'type':'start'});service.phone.wait(page,'!s.title&&!s.busy')
  cmd({'type':'arrive'});service.phone.wait(page,'s.has_save&&!s.busy')
  row=page.evaluate(service.READ_SAVE);assert row
  page.goto('http://127.0.0.1:4174/godot-license.txt')
  page.evaluate(WRITE,{'key':row['key'],'state':fixture})
  page.goto('http://127.0.0.1:4174/');page.wait_for_function('OrbitalTouch?.state?.ready&&OrbitalTouch.state.has_save',timeout=120000)
  cmd({'type':'start'});service.phone.wait(page,'!s.title&&!s.busy&&s.dialogue')
  rows=page.evaluate('OrbitalTouch.state.table_items');assert len(rows)==8
  portrait=height>width
  if portrait:
   hit=service.phone.locate(page,'货物 · 8 件')
   assert hit['found'] and not hit['disabled'],hit
   page.touchscreen.tap(hit['x'],hit['y']);service.phone.wait(page,'s.blocked')
  centers=set()
  for row in rows:
   hit=service.phone.locate(page,('@table_good_' if portrait else '@desk_original_')+row['uid'])
   assert hit['found'] and 0<hit['x']<width and 0<hit['y']<height,hit
   centers.add((round(hit['x'],1),round(hit['y'],1)))
   if not portrait:
    (page.touchscreen.tap if mobile else page.mouse.click)(hit['x'],hit['y'])
    service.phone.wait(page,'s.dialogue_uid=='+json.dumps(row['uid']))
  assert len(centers)==8,centers
  if portrait:
   last=service.phone.locate(page,'@table_good_'+rows[-1]['uid'])
   page.touchscreen.tap(last['x'],last['y'])
   service.phone.wait(page,'!s.blocked&&s.dialogue_uid=='+json.dumps(rows[-1]['uid']))
  page.screenshot(path=str(ROOT/f'work/eight-item-visit/{width}-eight-originals.png'))
  assert not errors,errors[:5]
  print('PASS eight visible distinct originals',width,height,flush=True)
  ctx.close()
 browser.close()
