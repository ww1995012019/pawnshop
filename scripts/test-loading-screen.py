#!/usr/bin/env python3
"""Browser contract for the minimal loading UI, with engine startup held for inspection."""
import json
import os
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
STUB='''window.Engine=class { static getMissingFeatures(){return []} static load(){return new Promise((yes,no)=>{window.completeDownload=yes;window.failDownload=no})} startGame(options){window.engineProgress=options.onProgress;return new Promise(yes=>window.completeStartup=yes)} };'''
def main(url):
    release=json.loads((ROOT/'play-godot/release.json').read_text())
    output=ROOT/'work/loading-minimal';output.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium'),args=['--no-sandbox'])
        try:
            for width,height in [(1280,720),(844,390),(390,844)]:
                context=browser.new_context(viewport={'width':width,'height':height},has_touch=width<900)
                page=context.new_page();errors=[]
                page.on('pageerror',lambda error:errors.append(str(error)))
                page.route('**/'+release['engine']+'.js',lambda route:route.fulfill(body=STUB,content_type='text/javascript'))
                page.goto(url);page.wait_for_function('window.completeStartup && document.querySelector("#loading-name").textContent.length>0')
                assert page.locator('#loader .panel').count()==0
                assert page.locator('#bytes').count()==0
                assert ' MB' not in page.locator('#loader').inner_text()
                metrics=page.evaluate('''()=>{let l=document.querySelector('#loader'),b=document.querySelector('#loading-bottom'),c=document.querySelector('#loading-cast');return {gap:l.clientHeight-b.offsetTop-b.offsetHeight,end:c.offsetTop+c.offsetHeight,bottom:b.offsetTop}}''')
                assert 0<=metrics['gap']<=40,metrics
                assert metrics['end']<metrics['bottom'],metrics
                assert page.locator('#loading-portrait').evaluate('(e)=>getComputedStyle(e).backgroundImage.includes("loading-cast-")')
                first=page.locator('#loading-name').inner_text()
                page.evaluate('OrbitalAssets.onProgress(50,100)')
                assert page.locator('#pct').inner_text()=='47%'
                page.wait_for_timeout(5600)
                assert page.locator('#loading-name').inner_text()!=first,'random queue repeats immediate speaker'
                page.screenshot(path=str(output/f'{width}x{height}.png'))
                page.evaluate('OrbitalAssets.onProgress(100,100);engineProgress(1,1)')
                assert page.locator('#pct').inner_text()=='98%'
                page.evaluate('completeDownload();completeStartup()')
                page.wait_for_selector('#loader',state='detached')
                assert not errors,errors
                context.close()
            context=browser.new_context(reduced_motion='reduce');page=context.new_page()
            page.route('**/'+release['engine']+'.js',lambda route:route.fulfill(body=STUB,content_type='text/javascript'))
            page.goto(url);page.wait_for_function("typeof window.failDownload === 'function'")
            assert page.locator('#loading-portrait').evaluate('(e)=>getComputedStyle(e).animationName')=='none'
            page.evaluate('failDownload(new Error("network interrupted"))')
            page.wait_for_selector('#loader.failed')
            assert page.locator('#retry').is_visible()
            assert not page.locator('#loading-bottom').is_visible()
            context.close()
            print('LOADING UI desktop/landscape/portrait, cast rotation, progress, startup, reduced motion and failure pass')
        finally:browser.close()
if __name__=='__main__':
    import sys
    main(sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:4174/')
