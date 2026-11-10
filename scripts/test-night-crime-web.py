#!/usr/bin/env python3
"""Real insurance, next-morning acknowledgement/reload and late police controls."""
import importlib.util,json,os,shutil,subprocess,tempfile,time
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
def module(name,file):
    spec=importlib.util.spec_from_file_location(name,ROOT/'scripts'/file);m=importlib.util.module_from_spec(spec);spec.loader.exec_module(m);return m
phone=module('night_phone','test-godot-phone.py')
service=module('night_service','test-watch-service-web.py')
WRITE_SAVE="""async input=>{const db=await new Promise(r=>{const q=indexedDB.open('/userfs');q.onsuccess=()=>r(q.result)});try{await new Promise((r,j)=>{const tx=db.transaction('FILE_DATA','readwrite');tx.objectStore('FILE_DATA').put({timestamp:new Date(),mode:33206,contents:new TextEncoder().encode(JSON.stringify(input.state))},input.key);tx.oncomplete=r;tx.onerror=j})}finally{db.close()}}"""
def main():
    output=ROOT/'work/night-crime/web';output.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='night-web-fixture-') as saves:
        subprocess.run([os.environ.get('GODOT_BIN','godot'),'--headless','--path',str(ROOT/'godot'),'--script','res://tests/night_crime_fixture.gd'],env={**os.environ,'XDG_DATA_HOME':saves},check=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,timeout=90)
    fixture=json.loads((ROOT/'work/night-crime/browser-fixture.json').read_text());meta=fixture['meta']
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        try:
            for label,width,height,mobile in [('desktop',1440,900,False),('landscape',844,390,True),('portrait',390,844,True)]:
                if os.environ.get('NIGHT_WEB_VIEW') and label not in os.environ['NIGHT_WEB_VIEW'].split(','):continue
                context=browser.new_context(viewport={'width':width,'height':height},has_touch=mobile,is_mobile=mobile,device_scale_factor=2 if mobile else 1)
                page=context.new_page();errors=[]
                page.on('pageerror',lambda e:errors.append(str(e)))
                page.on('console',lambda m:errors.append(m.text) if 'SCRIPT ERROR' in m.text else None)
                cw,ch=(height,width) if label=='portrait' else (width,height)
                def physical(x,y):return (width-y,x) if label=='portrait' else (x,y)
                def cmd(d):page.evaluate('(d)=>orbitalTouchSend(JSON.stringify(d))',d)
                def snap(name):page.screenshot(path=str(output/f'{label}-{name}.png'))
                def saved(predicate=lambda s:True):
                    end=time.monotonic()+20
                    while time.monotonic()<end:
                        row=page.evaluate(service.READ_SAVE)
                        if row and predicate(row['state']):return row
                        page.wait_for_timeout(150)
                    raise AssertionError('Expected night state not persisted in WebFS')
                def click(text):
                    def find():
                        page.evaluate('window.__orbitalLocated=null');cmd({'type':'locate','text':text});page.wait_for_function('window.__orbitalLocated!==null');return page.evaluate('window.__orbitalLocated')
                    r=find()
                    for _ in range(14):
                        if r['found'] and ch*.12<r['y']<ch*.82:break
                        direction=1 if not r['found'] or r.get('y',ch)>ch*.82 else -1
                        if mobile:phone.touch_drag(context,page,[physical(cw*.85,ch*((.70 if direction>0 else .30)-direction*i*.045)) for i in range(9)])
                        else:page.mouse.move(cw*.85,ch*.65);page.mouse.wheel(0,direction*300)
                        page.wait_for_timeout(250);r=find()
                    assert r['found'] and not r['disabled'],(text,r)
                    x,y=physical(r['x'],r['y']);assert 0<x<width and 0<y<height,(text,r)
                    print(label,'click',text,round(x),round(y),flush=True)
                    if mobile:page.touchscreen.tap(x,y)
                    else:page.mouse.click(x,y)
                    page.wait_for_timeout(300)
                def boot():
                    page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=90000);cmd({'type':'start'});phone.wait(page,'!s.title && !s.busy')
                def load_state(state):
                    row=saved();page.evaluate(WRITE_SAVE,{'key':row['key'],'state':state});page.reload();boot()
                    page.wait_for_function('(e)=>OrbitalTouch.state.day===e.day && OrbitalTouch.state.ap===e.ap && OrbitalTouch.state.cash===e.cash',arg={k:state[k] for k in ('day','ap','cash')},timeout=20000)
                try:
                    page.goto('http://127.0.0.1:4174/');boot();cmd({'type':'page','page':'repair'});phone.wait(page,"s.workspace==='repair'");saved()
                    load_state(fixture['before_insurance']);cmd({'type':'page','page':'report'});phone.wait(page,"s.workspace==='report'")
                    click(meta.get('buyButton','购买今晚保险'))
                    initial=fixture['before_insurance']['cash']
                    saved(lambda s:s['cash']==initial-meta['premium']);snap('insured')
                    click('打烊结算');saved(lambda s:s['phase']=='report')
                    click(f"迎接第 {meta['openDay']} 天");phone.wait(page,f"s.day==={meta['openDay']} && s.blocked",timeout=20000)
                    loss=saved(lambda s:all(uid not in [it['uid'] for it in s['inventory']] for uid in meta['lossUIDs']))['state']
                    assert loss['cash']==initial-meta['premium']-meta['closingFee']+meta['payout'],loss['cash']
                    snap('morning-losses');click(meta.get('ackButton','已核对失窃记录'));phone.wait(page,'!s.blocked')
                    acknowledged=saved(lambda s:not s['nightCrime']['reportOpen'] and all(m['acknowledged'] for m in s['nightCrime']['mornings']))['state'];cash=acknowledged['cash'];crime=acknowledged['nightCrime']
                    page.reload();boot();phone.wait(page,'!s.blocked');after=saved()['state']
                    assert after['cash']==cash and after['nightCrime']==crime,'reload changed acknowledged losses/payment'
                    cmd({'type':'page','page':'report'});phone.wait(page,"s.workspace==='report'");click(meta.get('historyButton','失窃与案件记录'));snap('reopened-history')
                    cmd({'type':'close'});page.wait_for_timeout(200)
                    load_state(fixture['inspection_pending']);assert page.evaluate('OrbitalTouch.state.ap')==0
                    click(meta.get('inspectionButton','接待查货警察'));phone.wait(page,'s.trade && !s.busy')
                    click(meta.get('resolveButton','配合查货'));saved(lambda s:s['trade'] is None);assert page.evaluate('OrbitalTouch.state.ap')==0
                    snap('inspection-zero-ap');assert not errors,errors
                    print(label,'insurance/losses/ack/reload/history/late inspection PASS',flush=True)
                except Exception:
                    snap('failure');raise
                finally:context.close()
        finally:browser.close()
if __name__=='__main__':main()
