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
                context=browser.new_context(viewport={'width':width,'height':height},has_touch=mobile,is_mobile=mobile)
                page=context.new_page();errors=[]
                page.on('pageerror',lambda e:errors.append(str(e)))
                page.on('console',lambda m:errors.append(m.text) if 'SCRIPT ERROR' in m.text else None)
                def cmd(data):page.evaluate('(d)=>orbitalTouchSend(JSON.stringify(d))',data)
                def click(text):
                    r=phone.locate(page,text);assert r['found'],text
                    if mobile:page.touchscreen.tap(r['x'],r['y'])
                    else:page.mouse.click(r['x'],r['y'])
                page.goto('http://127.0.0.1:4174/')
                page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=90000)
                cmd({'type':'start'});phone.wait(page,'!s.title && !s.busy')
                opening=page.evaluate('OrbitalTouch.state.cash')
                cmd({'type':'page','page':'report'});phone.wait(page,"s.workspace==='report'")
                click('打烊结算')
                page.wait_for_function('(cash)=>OrbitalTouch.state.cash===cash-16',arg=opening,timeout=15000)
                assert phone.locate(page,'清洁费')['found']
                assert phone.locate(page,'电费')['found']
                page.screenshot(path=str(output/(label+'-settled.png')))
                click('迎接第 2 天');phone.wait(page,"s.day===2 && s.workspace===''")
                assert page.evaluate('OrbitalTouch.state.cash')==opening-16
                assert not errors,errors
                print(label,'real input billing and next-day navigation PASS',flush=True)
                context.close()
        finally:browser.close()
if __name__=='__main__':run()
