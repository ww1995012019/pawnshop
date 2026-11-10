#!/usr/bin/env python3
"""Ordinary counter conversation: no trade gateway, consecutive lots and a staying NPC."""
import importlib.util,json,os,shutil,subprocess,tempfile,time,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('service',ROOT/'scripts/test-watch-service-web.py');service=importlib.util.module_from_spec(spec);spec.loader.exec_module(service)
phone=service.phone

def main():
 out=ROOT/'work/natural-dialogue/browser';out.mkdir(parents=True,exist_ok=True)
 with tempfile.TemporaryDirectory() as saves:
  subprocess.run([os.environ.get('GODOT_BIN','godot'),'--headless','--path',str(ROOT/'godot'),'--script','res://tests/multi_item_trade_fixture.gd'],env={**os.environ,'XDG_DATA_HOME':saves},check=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,timeout=30)
 fixture=json.loads((ROOT/'work/multi-item-trade/fixture.json').read_text())
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  cases=[(True,844,390)] if '--phone-only' in sys.argv else [(False,1440,900),(True,844,390)]
  for mobile,width,height in cases:
   label='phone' if mobile else 'desktop';context=browser.new_context(viewport={'width':width,'height':height},has_touch=mobile,is_mobile=mobile,device_scale_factor=2 if mobile else 1)
   page=context.new_page();errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.on('console',lambda m:errors.append(m.text) if 'SCRIPT ERROR' in m.text else None)
   def cmd(data):page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))',data)
   def state():return page.evaluate('OrbitalTouch.state')
   def tap(text):
    page.wait_for_timeout(180);target=phone.locate(page,text)
    assert not target['disabled'] and 0<target['x']<width and 0<target['y']<height,(text,target,state())
    if mobile:page.touchscreen.tap(target['x'],target['y'])
    else:page.mouse.click(target['x'],target['y'])
    page.wait_for_timeout(200);print(label,'tap',text,flush=True)
   def snap(name):page.screenshot(path=str(out/f'{label}-{name}.png'))
   try:
    page.goto('http://127.0.0.1:4174/');page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=90000)
    cmd({'type':'start'});phone.wait(page,'!s.title && !s.busy')
    cmd({'type':'arrive'});phone.wait(page,'!s.busy && s.has_save')
    row=page.evaluate(service.READ_SAVE);assert row
    page.evaluate('''async input=>{const db=await new Promise(r=>{const q=indexedDB.open('/userfs');q.onsuccess=()=>r(q.result)});await new Promise((r,j)=>{const tx=db.transaction('FILE_DATA','readwrite');tx.objectStore('FILE_DATA').put({timestamp:new Date(),mode:33206,contents:new TextEncoder().encode(JSON.stringify(input.state))},input.key);tx.oncomplete=r;tx.onerror=j});db.close()}''',{'key':row['key'],'state':fixture})
    page.reload();page.wait_for_function('window.OrbitalTouch?.state?.ready && OrbitalTouch.state.has_save',timeout=90000)
    cmd({'type':'start'});phone.wait(page,'!s.title && !s.busy && s.dialogue')
    assert not state()['blocked'],'natural counter has no trade modal'
    before=state();snap('normal-arrival')
    for lot in fixture['inventory']:
     tap('@stock_recommend_'+lot['uid']);phone.wait(page,"s.dialogue_uid==='"+lot['uid']+"'")
     assert not state()['blocked'] and lot['defId'].split('-')[0]=='WCH'
     assert Game_name(lot['defId']) in state()['dialogue_line']
     tap('接受 ');phone.wait(page,'s.locked')
    assert state()['trade_session']['sell_count']==3
    tap('@dialogue_next_goods');phone.wait(page,'s.buy && s.has_item && !s.locked')
    offered=state()['dialogue_uid'];tap('拿去鉴定');phone.wait(page,"s.workspace==='inspect'")
    assert state()['inspection_uid']==offered
    cmd({'type':'tool','tool':'TOL-001'});phone.wait(page,"s.inspection_current==='TOL-001' && !s.inspection_busy")
    tap('定位并固定标识');page.wait_for_function('OrbitalTouch.state.appraisal?.count>=1')
    tap('回柜台');phone.wait(page,"s.workspace==='' && !s.blocked && s.dialogue")
    assert state()['trade_session']['sell_count']==3
    tap('接受 ');phone.wait(page,'s.locked')
    summary=state()['trade_session'];assert summary['sell_count']==3 and summary['buy_count']==1
    before_ap=state()['ap'];before_cash=state()['cash'];snap('normal-agreement')
    tap('谈妥的 4 件一起交割');phone.wait(page,'!s.busy && s.dialogue',timeout=15000)
    assert state()['ap']==before_ap-1 and state()['cash']==before_cash+summary['net']
    assert not state()['blocked'] and state()['visitor']==before['visitor']
    snap('same-person-continues')
    deadline=time.time()+12
    while time.time()<deadline:
     saved=page.evaluate(service.READ_SAVE)
     if saved and saved['state']['trade']['session']['completed']:break
     page.wait_for_timeout(200)
    else:raise AssertionError('counter deal not saved')
    page.reload();page.wait_for_function('window.OrbitalTouch?.state?.ready && OrbitalTouch.state.has_save',timeout=90000)
    cmd({'type':'start'});phone.wait(page,'!s.title && !s.busy && s.dialogue')
    assert not state()['blocked'] and state()['ap']==before_ap-1
    snap('saved-conversation')
    tap('送客');phone.wait(page,'!s.busy && s.can_arrive',timeout=15000)
    assert 'dialogue' not in state() and not errors,errors
    print(label,'NATURAL conversation, immediate recommendations, both directions, inspection, checkout/stay/reload pass',flush=True)
   except Exception:snap('failure');raise
   finally:context.close()
  browser.close()
def Game_name(id):return {'WCH-001':'北辰','WCH-003':'北辰','WCH-004':'海舷'}[id]
if __name__=='__main__':main()
