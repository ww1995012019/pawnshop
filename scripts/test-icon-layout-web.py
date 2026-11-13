"""Check compact icon selection, merchant transfers, and representative page screenshots."""
import argparse,importlib.util,json,os,shutil,subprocess,tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'work/icon-layout';OUT.mkdir(exist_ok=True)
spec=importlib.util.spec_from_file_location('warehouse',ROOT/'scripts/test-warehouse-expansion-web.py');svc=importlib.util.module_from_spec(spec);spec.loader.exec_module(svc)
def main():
 parser=argparse.ArgumentParser();parser.add_argument("--merchant-only",action="store_true");args=parser.parse_args()
 with tempfile.TemporaryDirectory() as saves:
  subprocess.run(['godot','--headless','--path',str(ROOT/'godot'),'--script','res://tests/icon_layout_browser_fixture.gd'],env={**os.environ,'XDG_DATA_HOME':saves},check=True,capture_output=True,timeout=30)
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--mute-audio'])
  for width,height in [(1440,900),(844,390),(390,844)]:
   ctx=browser.new_context(viewport={'width':width,'height':height},has_touch=width<1000,is_mobile=width<1000)
   page=ctx.new_page();errors=[];page.on('console',lambda m: errors.append(m.text) if 'SCRIPT ERROR' in m.text else None)
   def cmd(data):page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))',data)
   def wait(s):svc.service.phone.wait(page,s,timeout=30000)
   def snap(name):page.wait_for_timeout(700);page.screenshot(path=str(OUT/f'{width}-{name}.png'))
   def click(label):
    hit=svc.service.phone.locate(page,label)
    assert not hit.get('disabled'),hit
    assert 0<hit['x']<width and 0<hit['y']<height,hit
    if width<1000:page.touchscreen.tap(hit['x'],hit['y'])
    else:
     page.mouse.move(hit['x'],hit['y']);page.wait_for_timeout(250);page.mouse.down();page.wait_for_timeout(200);page.mouse.up()
    page.wait_for_timeout(450)
   page.goto('http://127.0.0.1:4174/');page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=120000)
   cmd({'type':'start'});wait('!s.title&&!s.busy');cmd({'type':'arrive'});page.wait_for_timeout(1200)
   save=page.evaluate(svc.service.READ_SAVE);assert save
   def load(fixture):
    page.goto('http://127.0.0.1:4174/godot-license.txt');page.evaluate(svc.WRITE,{'key':save['key'],'state':json.loads((OUT/f'{fixture}.json').read_text())})
    page.goto('http://127.0.0.1:4174/');page.wait_for_function('window.OrbitalTouch?.state?.ready&&OrbitalTouch.state.has_save',timeout=120000)
    cmd({'type':'start'});wait('!s.title&&!s.busy');page.wait_for_timeout(600)
   load('merchant');click('查看商品');snap('merchant-materials')
   cash=page.evaluate('OrbitalTouch.state.cash');click('@material_MAT-002')
   assert page.evaluate('OrbitalTouch.state.cash')==cash,'selection spent cash'
   click('购买 陶瓷补片');wait(f's.cash==={cash-10}')
   click('@merchant_tab_watches');snap('merchant-watches')
   state=page.evaluate('OrbitalTouch.state');uid=state['merchant_items'][1]['uid'];quote=state['merchant_items'][1]['price'];before_ap=state['ap'];before_ids={i['uid'] for i in json.loads((OUT/'merchant.json').read_text())['inventory']}
   click('@merchant_watch_'+uid);assert page.evaluate('OrbitalTouch.state.cash')==cash-10
   snap('merchant-selected');click('@merchant_sell_selected');page.wait_for_timeout(1300)
   page.wait_for_function('(uid)=>!OrbitalTouch.state.merchant_items.some(i=>i.uid===uid)',arg=uid,timeout=15000)
   for _ in range(100):
    sold=page.evaluate(svc.service.READ_SAVE)['state']
    if all(i['uid']!=uid for i in sold['inventory']):break
    page.wait_for_timeout(200)
   assert {i['uid'] for i in sold['inventory']}==before_ids-{uid}
   assert sold['cash']==cash-10+quote and sold['ap']==before_ap-1,sold
   page.reload();page.wait_for_function('window.OrbitalTouch?.state?.ready&&OrbitalTouch.state.has_save',timeout=120000)
   cmd({'type':'start'});wait('!s.title&&!s.busy');assert all(i['uid']!=uid for i in page.evaluate(svc.service.READ_SAVE)['state']['inventory'])
   if args.merchant_only:
    assert not errors,errors
    print('PASS merchant icons and transfers',width,height,flush=True);ctx.close();continue
   load('base')
   for target in ['warehouse','inspect','repair','orders','report']:
    for i in range(3):cmd({'type':'close'});page.wait_for_timeout(200)
    cmd({'type':'page','page':target});wait(f's.workspace==="{target}"');snap(target)
   assert not errors,errors
   print('PASS icon layout and merchant persistence',width,height,flush=True);ctx.close()
  browser.close()
if __name__=='__main__':main()
