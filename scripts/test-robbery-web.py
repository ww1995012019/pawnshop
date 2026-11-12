"""Exercise marked-original recovery and a saved closed day through real browser taps."""
import importlib.util,json,os,shutil,subprocess,tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('service',ROOT/'scripts/test-watch-service-web.py')
service=importlib.util.module_from_spec(spec);spec.loader.exec_module(service)
with tempfile.TemporaryDirectory(prefix='robbery-fixture-') as saves:
 subprocess.run(['godot','--headless','--path',str(ROOT/'godot'),'--script','res://tests/robbery_web_fixture.gd'],env={**os.environ,'XDG_DATA_HOME':saves},check=True,capture_output=True,timeout=30)
fixtures=json.loads((ROOT/'work/robbery/fixtures.json').read_text())
WRITE='''async input=>{const db=await new Promise(r=>{const q=indexedDB.open('/userfs');q.onsuccess=()=>r(q.result)});await new Promise((r,j)=>{const tx=db.transaction('FILE_DATA','readwrite');tx.objectStore('FILE_DATA').put({timestamp:new Date(),mode:33206,contents:new TextEncoder().encode(JSON.stringify(input.state))},input.key);tx.oncomplete=r;tx.onerror=j});db.close()}'''
with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 for width,height in [(1440,900),(568,320),(390,844)]:
  mobile=width<1000
  ctx=browser.new_context(viewport={'width':width,'height':height},has_touch=mobile,is_mobile=mobile,device_scale_factor=1)
  page=ctx.new_page();errors=[]
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('console',lambda m:errors.append(m.text) if 'SCRIPT ERROR' in m.text or 'SHADER ERROR' in m.text else None)
  def cmd(data):page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))',data)
  def wait(condition):service.phone.wait(page,condition,timeout=30000)
  def click(label):
   hit=service.phone.locate(page,label)
   assert hit['found'] and not hit['disabled'],hit
   for _ in range(12):
    if 60<hit['y']<height-40:break
    page.mouse.move(width*.75,height*.65)
    page.mouse.wheel(0,300 if hit['y']>=height-40 else -300)
    page.wait_for_timeout(150)
    hit=service.phone.locate(page,label)
   assert 0<hit['x']<width and 0<hit['y']<height,hit
   (page.touchscreen.tap if mobile else page.mouse.click)(hit['x'],hit['y'])
   page.wait_for_timeout(250)
  page.goto('http://127.0.0.1:4174/');page.wait_for_function('OrbitalTouch?.state?.ready',timeout=120000)
  cmd({'type':'start'});wait('!s.title&&!s.busy')
  cmd({'type':'arrive'});wait('s.has_save&&!s.busy')
  row=page.evaluate(service.READ_SAVE);assert row
  def install(state):
   page.goto('http://127.0.0.1:4174/godot-license.txt')
   page.evaluate(WRITE,{'key':row['key'],'state':state})
   page.goto('http://127.0.0.1:4174/');page.wait_for_function('OrbitalTouch?.state?.ready&&OrbitalTouch.state.has_save',timeout=120000)
   cmd({'type':'start'});wait('!s.title&&!s.busy')
  install(fixtures['fence']);wait('s.dialogue')
  page.screenshot(path=str(ROOT/f'work/robbery/{width}-marked-original.png'))
  if height>width:
   click('更多');wait('s.blocked');click('@mobile_alarm_button')
  else:click('@alarm_button')
  wait('s.blocked')
  click('报警并追回');wait('!s.trade&&!s.busy&&!s.blocked')
  recovered=page.evaluate(service.READ_SAVE)['state']
  assert recovered['cash']==fixtures['fence']['cash'],recovered['cash']
  uid=fixtures['fence']['nightCrime']['cases'][0]['items'][0]['uid']
  assert len([it for it in recovered['inventory'] if it['uid']==uid])==1
  assert recovered['nightCrime']['cases'][0]['arrested']
  install(fixtures['closed'])
  cmd({'type':'page','page':'report'});wait('s.workspace==="report"')
  click('迎接第 7 天');wait('s.day===7&&!s.busy')
  reopened=page.evaluate(service.READ_SAVE)['state']
  assert reopened['cash']==fixtures['closed']['cash']<0
  assert len([r for r in reopened['ledger'] if r['kind']=='repair-expense'])==1
  page.reload();page.wait_for_function('OrbitalTouch?.state?.ready&&OrbitalTouch.state.has_save',timeout=120000)
  cmd({'type':'start'});wait('s.day===7&&!s.title&&!s.busy')
  reloaded=page.evaluate(service.READ_SAVE)['state']
  assert reloaded['cash']==reopened['cash']
  assert not errors,errors[:5]
  print('PASS browser robbery alarm, original recovery, closed-day debt and reload',width,height,flush=True)
  ctx.close()
 browser.close()
