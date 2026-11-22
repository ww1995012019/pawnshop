#!/usr/bin/env python3
"""Real mouse/touch day-end billing and report navigation regression."""
import importlib.util, os, shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
spec=importlib.util.spec_from_file_location('phone',Path(__file__).with_name('test-godot-phone.py'))
phone=importlib.util.module_from_spec(spec);spec.loader.exec_module(phone)
def run():
    output=Path('work/store-costs-web');output.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        try:
            for label,width,height,mobile in [('desktop',1280,720,False),('landscape',844,390,True),('portrait',390,844,True)]:
                if os.environ.get('COST_WEB_VIEW') and label!=os.environ['COST_WEB_VIEW']:continue
                context=browser.new_context(viewport={'width':width,'height':height},has_touch=mobile,is_mobile=mobile)
                page=context.new_page();errors=[]
                rotated=label=='portrait'
                cw,ch=(height,width) if rotated else (width,height)
                def physical(x,y):return (width-y,x) if rotated else (x,y)
                page.on('pageerror',lambda e:errors.append(str(e)))
                page.on('console',lambda m:errors.append(m.text) if 'SCRIPT ERROR' in m.text else None)
                def cmd(data):page.evaluate('(d)=>orbitalTouchSend(JSON.stringify(d))',data)
                def click(text):
                    def find():
                        page.evaluate('window.__orbitalLocated=null');cmd({'type':'locate','text':text})
                        page.wait_for_function('window.__orbitalLocated!==null')
                        return page.evaluate('window.__orbitalLocated')
                    # The report action is pinned at the bottom. Its complete
                    # target must already be in view, including after consent.
                    r=find()
                    assert r['found'] and r['y']-r['height']/2 >= 0 and r['y']+r['height']/2 <= ch,text
                    assert not r['disabled'],text
                    print(label,'click',text,round(r['x']),round(r['y']),flush=True)
                    if mobile:page.touchscreen.tap(*physical(r['x'],r['y']))
                    else:page.mouse.click(r['x'],r['y'])
                page.goto(os.environ.get('COST_WEB_URL','http://127.0.0.1:4174/'))
                page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=90000)
                cmd({'type':'start'});phone.wait(page,'!s.title && !s.busy')
                opening=page.evaluate('OrbitalTouch.state.cash')
                cmd({'type':'page','page':'report'});phone.wait(page,"s.workspace==='report'")
                page.screenshot(path=str(output/(label+'-before.png')))
                click('打烊结算')
                phone.wait(page, 's.blocked')
                click('确认提前打烊')
                try:page.wait_for_function('(cash)=>OrbitalTouch.state.cash===cash-16',arg=opening,timeout=15000)
                except Exception:
                    page.screenshot(path=str(output/(label+'-failure.png')))
                    print(label,page.evaluate('OrbitalTouch.state'),flush=True)
                    raise
                notice=page.evaluate('OrbitalTouch.state.notice')
                assert '电费 8 Cr' in notice and '清洁费 8 Cr' in notice,notice
                page.screenshot(path=str(output/(label+'-settled.png')))
                click('迎接第 2 天');phone.wait(page,"s.day===2 && s.workspace===''")
                assert page.evaluate('OrbitalTouch.state.cash')==opening-16
                assert not errors,errors
                print(label,'real input billing and next-day navigation PASS',flush=True)
                context.close()
        finally:browser.close()
if __name__=='__main__':run()
