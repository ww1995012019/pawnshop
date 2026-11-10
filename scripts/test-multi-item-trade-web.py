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
 out=ROOT/'work/multi-item-trade/browser';out.mkdir(parents=True,exist_ok=True)
 with tempfile.TemporaryDirectory() as saves:
  subprocess.run([os.environ.get('GODOT_BIN','godot'),'--headless','--path',str(ROOT/'godot'),'--script','res://tests/multi_item_trade_fixture.gd'],env={**os.environ,'XDG_DATA_HOME':saves},check=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,timeout=30)
 fixture=json.loads((ROOT/'work/multi-item-trade/fixture.json').read_text())
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
     x=max(20,min(width-20,target["x"]))
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
    click('多件买卖清单');page.wait_for_timeout(400)
    before_ap=status()['ap'];before_cash=status()['cash']
    for title in ['推荐 北辰 N01','推荐 北辰 N03','推荐 海舷 H01']:
     click(title);page.wait_for_timeout(150)
    for title in ['购买 北辰 N02','购买 海舷 H02']:
     click(title);page.wait_for_timeout(150)
    click('请 NPC 看看推荐清单');page.wait_for_timeout(250)
    snapshot=status()['trade_session']
    assert len(snapshot['lines'])==5,snapshot
    # Confirm using each original's actual in-scene button.
    for row in snapshot['lines']:
     assert row['status'] in ['ready','counter'],row
     click('@trade_confirm_'+row['uid']);page.wait_for_timeout(180)
    summary=status()['trade_session']
    assert summary['sell_count']==3 and summary['buy_count']==2,summary
    snap('confirmed-two-directions')
    click('交割已确认商品');page.wait_for_timeout(700)
    state=status()
    assert state['ap']==before_ap-1 and state['cash']==before_cash+summary['net'],state
    assert all(row['status']=='done' for row in state['trade_session']['lines']),state
    snap('batch-complete')
    # Reload preserves completed originals, cash and the still-active visit.
    deadline=time.time()+12
    while time.time()<deadline:
     saved=page.evaluate(service.READ_SAVE)
     if saved and saved['state']['trade']['session']['completed']:break
     page.wait_for_timeout(200)
    else:raise AssertionError('batch not durably saved')
    assert len(saved['state']['inventory'])==2 and len(saved['state']['ledger'])>=5
    page.reload();page.wait_for_function('window.OrbitalTouch?.state?.ready && OrbitalTouch.state.has_save',timeout=90000)
    cmd({'type':'start'});phone.wait(page,'!s.title && !s.busy')
    click('多件买卖清单');page.wait_for_timeout(400)
    assert status()['trade_session']['sell_count']==0 and status()['ap']==before_ap-1
    snap('reloaded-visit')
    click('结束接待');page.wait_for_timeout(1700)
    assert 'trade_session' not in status(),status()
    assert not errors,errors
    print(label,'MULTI real recommendation, both directions, independent confirmations, atomic batch and reload pass',flush=True)
   finally:context.close()
  browser.close()
if __name__=='__main__':main()
