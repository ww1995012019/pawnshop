#!/usr/bin/env python3
"""Capture the reported warehouse receipt and empty visitor against cleaned paper."""
import importlib.util,json
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1];OUT=ROOT/'work/quick-trade-list'
def mod(name,path):
 s=importlib.util.spec_from_file_location(name,ROOT/path);m=importlib.util.module_from_spec(s);s.loader.exec_module(m);return m
phone=mod('phone','scripts/test-godot-phone.py');service=mod('service','scripts/test-watch-service-web.py');multi=mod('multi','scripts/test-strict-multi-counter-web.py')
with sync_playwright() as p:
 b=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--mute-audio'])
 page=b.new_page(viewport={'width':1920,'height':1080});errors=[]
 icon=json.loads((ROOT/'play-godot/release.json').read_text())['engine']+'.icon.png'
 page.route('**/__strict_fixture__',lambda r:r.fulfill(status=200,content_type='text/html',body='<link rel="icon" href="/'+icon+'">'))
 page.on('pageerror',lambda e:errors.append(str(e)))
 page.on('console',lambda m:errors.append(m.text) if m.type=='error' and 'browser metadata' not in m.text else None)
 def start():
  page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=120000)
  page.evaluate('orbitalTouchSend(JSON.stringify({type:"start"}))');phone.wait(page,'!s.title&&!s.busy',timeout=30000);page.wait_for_timeout(1200)
 def click(label):
  k=phone.locate(page,label);assert not k['disabled'],(label,k)
  page.mouse.click(k['x'],k['y']);page.wait_for_timeout(500)
 page.goto('http://127.0.0.1:4174/');start();click('@StrictTradeAction_0')
 row=None
 for _ in range(70):
  row=page.evaluate(service.READ_SAVE)
  if row:break
  page.wait_for_timeout(150)
 assert row
 fixture=json.loads((OUT/'empty.json').read_text());fixture['notice']=''
 page.goto('http://127.0.0.1:4174/__strict_fixture__');page.evaluate(multi.WRITE,{'key':row['key'],'state':fixture})
 page.goto('http://127.0.0.1:4174/');start()
 assert page.evaluate('OrbitalTouch.state.table_items.length')==0
 for width,height in [(1920,1080),(1420,800)]:
  page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(500)
  page.mouse.move(0,0);page.screenshot(path=str(OUT/('empty-main-'+str(width)+'.png')))
 page.set_viewport_size({'width':1920,'height':1080});page.wait_for_timeout(400)
 click('@StrictNav_box-archive');phone.wait(page,'s.workspace==="warehouse"&&s.warehouse_targets.length>0',timeout=10000)
 tile=page.evaluate('OrbitalTouch.state.warehouse_targets[0]')
 page.mouse.click(tile['x'],tile['y']);phone.wait(page,'s.warehouse_uid==='+json.dumps(tile['uid']),timeout=10000);page.wait_for_timeout(600)
 for width,height in [(1920,1080),(1420,800)]:
  page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(600)
  page.mouse.move(0,0);page.screenshot(path=str(OUT/('warehouse-selected-'+str(width)+'.png')))
  close=phone.locate(page,'收起');assert 0<close['x']<width and 0<close['y']<height
 assert page.evaluate('OrbitalTouch.state.cash')==fixture['cash'] and page.evaluate('OrbitalTouch.state.ap')==fixture['ap']
 assert not errors,errors
 (OUT/'paper-browser-results.json').write_text(json.dumps({'passed':True,'errors':errors,'states':['empty-visitor','selected-warehouse-receipt'],'viewports':[[1920,1080],[1420,800]],'selected_uid':tile['uid']},indent=2)+'\n')
 print('PASS empty visitor and actual selected warehouse receipt, both PC sizes, money/AP unchanged',flush=True)
 b.close()
