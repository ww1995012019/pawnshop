#!/usr/bin/env python3
"""Native portrait UI, touch trading, records, navigation and orientation regression."""
from playwright.sync_api import sync_playwright
import os
import shutil
import argparse
from pathlib import Path

parser=argparse.ArgumentParser()
parser.add_argument("url",nargs="?",default="http://127.0.0.1:4174/")
args=parser.parse_args()
OUT=Path(__file__).resolve().parents[1]/"work/portrait-web"
OUT.mkdir(parents=True,exist_ok=True)

def wait(page, test):
 page.wait_for_function('(s => '+test+')(window.OrbitalTouch?.state)',timeout=120000)
def locate(page, text):
 page.evaluate("t=>{window.__orbitalLocated=null;window.orbitalTouchSend(JSON.stringify({type:'locate',text:t}));}",text)
 page.wait_for_function('window.__orbitalLocated!==null')
 target=page.evaluate('window.__orbitalLocated')
 assert target['found'],target
 assert not target['disabled'],target
 return target

def tap(page,text):
 target=locate(page,text)
 assert 0<target['x']<page.viewport_size['width'] and 0<target['y']<page.viewport_size['height'],target
 page.touchscreen.tap(target['x'],target['y'])
 page.wait_for_timeout(400)
 return target

with sync_playwright() as p:
 browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium'),headless=True,args=['--no-sandbox'])
 context=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=1,is_mobile=True,has_touch=True)
 page=context.new_page()
 errors=[]
 page.on('pageerror',lambda err: errors.append(str(err)))
 page.on('console',lambda msg: errors.append(msg.text) if msg.type=='error' else None)
 page.goto(args.url)
 wait(page,'s?.ready')
 tap(page,'开门营业')
 wait(page,'!s.title&&!s.busy')
 page.wait_for_timeout(800)
 tap(page,'接待下一位来客')
 wait(page,'s.trade&&!s.busy')
 page.wait_for_timeout(5000)
 page.screenshot(path=str(OUT/'trade.png'))
 for width,height in [(320,568),(360,640),(390,844),(430,932)]:
  page.set_viewport_size({'width':width,'height':height})
  page.wait_for_timeout(500)
  for caption in ['开始议价','更多','鉴定工具','查看完整对话']:
   target=locate(page,caption)
   assert 0<target['y']<height and 0<target['x']<width,(caption,width,height,target)
  page.screenshot(path=str(OUT/f'fixed-{width}.png'))
 page.set_viewport_size({'width':390,'height':844})
 page.wait_for_timeout(500)
 # The fixed counter must not move under wheel or finger swipes.
 before=locate(page,'开始议价')
 page.mouse.move(8,340)
 page.mouse.wheel(0,400)
 cdp=context.new_cdp_session(page)
 cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':8,'y':420}]})
 for y in [390,360,330,300]:
  cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':8,'y':y}]})
  page.wait_for_timeout(40)
 cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
 cdp.detach()
 after=locate(page,'开始议价')
 assert abs(after['y']-before['y'])<1,(before,after)
 tap(page,'查看完整对话')
 wait(page,'s.blocked')
 close=tap(page,'@modal_close')
 assert close['height']>=44
 wait(page,'!s.blocked')
 cash=page.evaluate('window.OrbitalTouch.state.cash')
 begin=tap(page,'开始议价')
 assert begin['height']>=44,begin
 wait(page,'s.blocked')
 page.screenshot(path=str(OUT/'negotiation.png'))
 tap(page,'@modal_close')
 wait(page,'!s.blocked')
 assert page.evaluate('window.OrbitalTouch.state.cash')==cash
 page.touchscreen.tap(195,380)
 wait(page,'s.blocked')
 page.screenshot(path=str(OUT/'item-details.png'))
 tap(page,'@modal_close')
 wait(page,'!s.blocked')
 tap(page,'鉴定工具')
 wait(page,'s.blocked')
 page.screenshot(path=str(OUT/'tools.png'))
 tap(page,'放大镜')
 wait(page,"s.workspace==='inspect'&&s.inspection_current==='TOL-001'")
 tap(page,'关闭')
 wait(page,"s.workspace===''")
 tap(page,'开始议价')
 wait(page,'s.blocked')
 tap(page,'出价 ')
 wait(page,'!s.busy&&!s.blocked')
 if not page.evaluate('window.OrbitalTouch.state.locked'):
  tap(page,'开始议价')
  wait(page,'s.blocked')
  tap(page,'接受 ')
  wait(page,'s.locked&&!s.blocked')
 before=page.evaluate('window.OrbitalTouch.state.cash')
 tap(page,'确认交割')
 wait(page,f's.cash!={before}&&!s.busy')
 print('PASS fixed counter, dialogue/tool/quote sheets and explicit close buttons',flush=True)
 print('PASS touch arrival, quote, accept and delivery; cash',before,'->',page.evaluate('window.OrbitalTouch.state.cash'),flush=True)
 for name in ['inspect','warehouse','repair','orders','report']:
  page.evaluate("name=>window.orbitalTouchSend(JSON.stringify({type:'page',page:name}))",name)
  wait(page,f's.workspace=="{name}"')
  page.wait_for_timeout(900)
  page.screenshot(path=str(OUT/f'{name}.png'))
  if name=='inspect':
   tap(page,'检验记录')
   wait(page,'s.blocked')
   page.screenshot(path=str(OUT/'records.png'))
   tap(page,'@modal_close')
   wait(page,'!s.blocked')
  tap(page,'关闭')
  wait(page,'s.workspace==""')
 print('PASS five portrait workspaces and return',flush=True)
 page.set_viewport_size({'width':320,'height':568})
 page.wait_for_timeout(1000)
 page.screenshot(path=str(OUT/'short.png'))
 dock=locate(page,'事务')
 assert dock['y']<568 and dock['height']>=44,dock
 print('PASS 320x568 fixed navigation',flush=True)
 page.set_viewport_size({'width':1440,'height':900})
 page.wait_for_timeout(1800)
 page.screenshot(path=str(OUT/'desktop.png'))
 assert page.evaluate('getComputedStyle(canvas).transform')=='none'
 print('PASS desktop orientation restored',flush=True)
 assert not errors,errors
 print('PASS browser console has no errors',flush=True)
 browser.close()
