#!/usr/bin/env python3
"""Real WebGL police lifecycle with ordinary persisted visits and full animation."""
import importlib.util,json,os,shutil,subprocess,tempfile,sys
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('service',ROOT/'scripts/test-watch-service-web.py');service=importlib.util.module_from_spec(spec);spec.loader.exec_module(service)
phone=service.phone
WRITE_SAVE='''async input=>{const db=await new Promise(r=>{const q=indexedDB.open('/userfs');q.onsuccess=()=>r(q.result)});await new Promise((r,j)=>{const tx=db.transaction('FILE_DATA','readwrite');tx.objectStore('FILE_DATA').put({timestamp:new Date(),mode:33206,contents:new TextEncoder().encode(JSON.stringify(input.state))},input.key);tx.oncomplete=r;tx.onerror=j});db.close()}'''
def main():
 out=ROOT/'work/watch-expansion/counter-lifecycle-browser';out.mkdir(parents=True,exist_ok=True)
 with tempfile.TemporaryDirectory() as saves:
  subprocess.run([os.environ.get('GODOT_BIN','godot'),'--headless','--path',str(ROOT/'godot'),'--script','res://tests/counter_lifecycle_fixture.gd'],env={**os.environ,'XDG_DATA_HOME':saves},check=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,timeout=30)
 fixtures=json.loads((ROOT/'work/watch-expansion/counter-lifecycle-fixture.json').read_text())
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path=shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
  cases=[(True,844,390)] if '--phone-only' in sys.argv else [(False,1440,900)] if '--red' in sys.argv else [(False,1440,900),(True,844,390)]
  for mobile,width,height in cases:
   for case in (['arrest'] if '--red' in sys.argv else os.environ.get('COUNTER_WEB_CASES','arrest,false_report,capacity,forgery,pending').split(',')):
    label=('phone' if mobile else 'desktop')+'-'+case
    context=browser.new_context(viewport={'width':width,'height':height},has_touch=mobile,is_mobile=mobile,device_scale_factor=2 if mobile else 1)
    page=context.new_page();errors=[]
    page.on('pageerror',lambda e:errors.append(str(e)))
    page.on('console',lambda m:errors.append(m.text) if any(x in m.text for x in ['SCRIPT ERROR','SHADER ERROR','USER ERROR']) else None)
    def cmd(data):page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))',data)
    def state():return page.evaluate('OrbitalTouch.state')
    def tap(text):
     target=phone.locate(page,text)
     for attempt in range(10):
      half_w=target['width']/2;half_h=target['height']/2
      if 4<target['x']-half_w and target['x']+half_w<width-4 and 4<target['y']-half_h and target['y']+half_h<height-4:break
      assert state()['blocked'],('counter control outside viewport',text,target)
      direction=1 if target['y']>=height*.82 else -1
      if mobile:phone.touch_drag(context,page,[(width*.85,height*((.70 if direction>0 else .30)-direction*i*.045)) for i in range(9)])
      else:page.mouse.move(width*.85,height*.65);page.mouse.wheel(0,direction*300)
      page.wait_for_timeout(250);target=phone.locate(page,text)
     half_w=target['width']/2;half_h=target['height']/2
     assert not target['disabled'] and 0<target['x']-half_w and target['x']+half_w<width and 0<target['y']-half_h and target['y']+half_h<height,(text,target,state())
     print(label,'tap',text,target['x'],target['y'],'size',target['width'],target['height'],flush=True)
     if mobile:page.touchscreen.tap(target['x'],target['y'])
     else:page.mouse.click(target['x'],target['y'])
     page.wait_for_timeout(300)
    try:
     page.goto('http://127.0.0.1:4174/');page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=90000)
     cmd({'type':'start'});phone.wait(page,'!s.title && !s.busy')
     cmd({'type':'arrive'});phone.wait(page,'!s.busy && s.has_save')
     row=page.evaluate(service.READ_SAVE);assert row
     page.goto('http://127.0.0.1:4174/godot-license.txt')
     page.evaluate(WRITE_SAVE,{'key':row['key'],'state':fixtures[case]})
     page.goto('http://127.0.0.1:4174/');page.wait_for_function('window.OrbitalTouch?.state?.ready && OrbitalTouch.state.has_save',timeout=90000)
     cmd({'type':'start'});phone.wait(page,'!s.title && (s.trade || !s.busy)' if case in ['capacity','forgery'] else '!s.title && !s.busy && s.trade')
     if state()['notice_visible']:tap('@wanted_close')
     before=state();page.screenshot(path=str(out/f'{label}-before.png'))
     if case in ['capacity','forgery']:
      phone.wait(page,'!s.busy && !s.trade',timeout=15000)
      after=state();assert after['ap']==fixtures[case]['ap'] and after['cash']==fixtures[case]['cash']
      saved=page.evaluate(service.READ_SAVE)['state']
      assert all(any(it['uid']==old['uid'] for it in saved['inventory']) for old in fixtures[case]['inventory'])
      page.screenshot(path=str(out/f'{label}-departed.png'));assert not errors,errors
      print(label,'PASS terminal refusal automatic departure preserving originals AP cash',flush=True)
      continue
     if case=='pending':
      page.wait_for_timeout(4500);assert state()['trade'] and state()['trade_session']['buy_count']==1
      assert state()['ap']==before['ap'] and state()['cash']==before['cash'] and not errors
      print(label,'PASS undelivered agreement holds visitor',flush=True);continue
     if not mobile:
      choice=phone.locate(page,'@dialogue_put_aside');page.mouse.move(choice['x'],choice['y']-55)
      page.wait_for_timeout(900);page.screenshot(path=str(out/f'{label}-dialogue-hover.png'))
      assert not state()['blocked']
     tap('@alarm_button');phone.wait(page,'s.blocked');page.wait_for_timeout(700);tap('@confirm_alarm')
     phone.wait(page,'!s.blocked && !s.trade')
     page.wait_for_timeout(1600);page.screenshot(path=str(out/f'{label}-patrol.png'))
     page.wait_for_timeout(7500)
     print(label,'errors',errors,'state',state(),flush=True)
     assert not errors,errors
     phone.wait(page,'!s.busy && !s.trade && s.can_arrive')
     after=state();assert after['ap']==before['ap']
     assert after['caught_count']==before['caught_count']+(case=='arrest')
     if case=='arrest':assert after['cash']>before['cash'] and not after['notice_owned']
     else:assert after['cash']==before['cash']-60 and after['notice_owned']
     cmd({'type':'arrive'});phone.wait(page,'!s.busy && s.trade',timeout=15000)
     page.wait_for_timeout(2000);assert not errors,errors
     page.screenshot(path=str(out/f'{label}-next-visitor.png'))
     print(label,'PASS arrest/false-report then next visitor',flush=True)
    finally:context.close()
  browser.close()
if __name__=='__main__':main()
