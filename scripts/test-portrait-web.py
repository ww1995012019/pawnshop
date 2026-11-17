#!/usr/bin/env python3
"""Upright phones use the landscape canvas and physical touch coordinates."""
import argparse
import os
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]


def shell_checks(browser):
    """Exercise the actual shell without requiring an exported engine."""
    for dpr in [1, 2, 3]:
        context = browser.new_context(viewport={'width':390,'height':844}, device_scale_factor=dpr, is_mobile=True, has_touch=True)
        page = context.new_page()
        page.set_content('<meta name="viewport" content="width=device-width,initial-scale=1"><canvas id="canvas"></canvas>')
        page.add_style_tag(path=str(ROOT/'godot/web/web-ui.css'))
        page.evaluate('''() => {
          window.fullscreenRequests=0; window.orientationRequests=[];
          canvas.addEventListener('wheel',e=>{window.nativeWheel=[e.deltaX,e.deltaY];});
          document.documentElement.requestFullscreen=async()=>{fullscreenRequests++;};
          screen.orientation.lock=async value=>{orientationRequests.push(value);};
        }''')
        page.add_script_tag(path=str(ROOT/'godot/web/web-ui.js'))
        assert page.evaluate('OrbitalTouch.turned()'), 'Upright phone must rotate a landscape canvas'
        assert page.evaluate('[canvas.width,canvas.height]') == [844*dpr,390*dpr]
        assert page.evaluate('({w:canvas.getBoundingClientRect().width,h:canvas.getBoundingClientRect().height})') == {'w':844,'h':390}
        box = page.locator('#canvas').bounding_box()
        assert abs(box['width']-390)<1 and abs(box['height']-844)<1, box
        page.evaluate('''() => {
          window.events=[]; window.placements=[];
          orbitalTouchPlace=(x,y)=>{placements.push([x,y]);orbitalPlacedX=x+3;orbitalPlacedY=y+4;};
          for(const type of ['touchstart','touchmove','touchend']) canvas.addEventListener(type,e=>events.push([type,...Array.from(e.changedTouches,t=>[t.clientX,t.clientY]) ]));
        }''')
        page.touchscreen.tap(100,200)
        assert page.evaluate('placements') == [[200,290]]
        page.wait_for_function('fullscreenRequests===1 && orientationRequests.length===1')
        assert page.evaluate('orientationRequests') == ['landscape']
        assert page.evaluate('OrbitalTouch.toPhysical(...OrbitalTouch.toCanvas(100,200))') == [100,200]
        page.evaluate("canvas.addEventListener('wheel',e=>{window.wheel=[e.clientX,e.clientY,e.deltaX,e.deltaY];e.preventDefault();},{passive:false})")
        page.mouse.move(100,200)
        page.mouse.wheel(10,20)
        page.wait_for_function('window.wheel')
        assert page.evaluate('wheel') == page.evaluate('[200,290,nativeWheel[1],-nativeWheel[0]]'), page.evaluate('wheel')
        assert page.evaluate('events') == [['touchstart',[203,294]],['touchend',[203,294]]]
        page.evaluate("document.querySelector('body > div').style.padding='11px 22px 33px 44px';dispatchEvent(new Event('resize'))")
        assert page.evaluate('OrbitalTouch.safeInsets') == [11,22,33,44], 'Insets must rotate into canvas space'
        # A fullscreen/resize during a finger must retain the same mapping until release.
        cdp=context.new_cdp_session(page)
        cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':100,'y':200}]})
        assert page.evaluate('fullscreenRequests') == 1, 'Fullscreen waits for the engine release'
        page.set_viewport_size({'width':844,'height':390})
        assert page.evaluate('OrbitalTouch.turned()'), 'Active finger retains the presentation transform'
        cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':110,'y':220}]})
        cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
        page.wait_for_function('!OrbitalTouch.turned()')
        events=page.evaluate('events')
        assert events[-1] == ['touchend',[223,284]], events
        assert page.evaluate('[canvas.width,canvas.height]') == [844*dpr,390*dpr]
        cdp.detach()
        context.close()
    context=browser.new_context(viewport={'width':390,'height':844},has_touch=False)
    page=context.new_page()
    page.set_content('<canvas id="canvas"></canvas>')
    page.add_script_tag(path=str(ROOT/'godot/web/web-ui.js'))
    assert not page.evaluate('OrbitalTouch.turned()'), 'Narrow desktop retains desktop orientation'
    context.close()
    print('PASS shell physical taps, drag/release resize, DPR 1/2/3, rotated safe insets and desktop',flush=True)


def main():
    parser=argparse.ArgumentParser()
    parser.add_argument('url',nargs='?',default='http://127.0.0.1:4174/')
    parser.add_argument('--shell-only',action='store_true')
    args=parser.parse_args()
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium'),headless=True,args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        shell_checks(browser)
        if not args.shell_only:
            import importlib.util
            spec=importlib.util.spec_from_file_location('phone_checks',ROOT/'scripts/test-godot-phone.py')
            phone=importlib.util.module_from_spec(spec)
            spec.loader.exec_module(phone)
            context=browser.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
            page=context.new_page()
            errors=[]
            page.on('pageerror',lambda err: errors.append(str(err)))
            page.goto(args.url)
            page.wait_for_function('OrbitalTouch?.state?.ready',timeout=120000)
            phone.assert_full_screen(page,390,844)
            print('UPRIGHT game ready; starting physical counter taps',flush=True)
            phone.tap(page,'开门营业')
            phone.wait(page,'!s.title&&!s.busy')
            phone.tap(page,'接待下一位来客')
            phone.wait(page,'s.trade&&!s.busy')
            print('UPRIGHT physical start and visitor arrival pass',flush=True)
            page.wait_for_timeout(1000)
            phone.tap(page,'鉴定仪')
            phone.wait(page,"s.workspace==='inspect'")
            page.wait_for_timeout(600)
            uid=phone.state(page,'inspection_uid')
            print('UPRIGHT physical inspection entry pass; checking close and reopen',flush=True)
            phone.tap(page,'@workspace_close')
            phone.wait(page,"s.workspace===''")
            phone.tap(page,'鉴定仪')
            phone.wait(page,f"s.workspace==='inspect'&&s.inspection_uid==={uid!r}")
            print('UPRIGHT physical close/reopen pass; checking rotation',flush=True)
            page.set_viewport_size({'width':844,'height':390})
            phone.assert_full_screen(page,844,390)
            phone.wait(page,f"s.workspace==='inspect'&&s.inspection_uid==={uid!r}")
            assert not errors,errors
            print('PASS upright physical counter/workspace taps and selection across rotation',flush=True)
            context.close()
        browser.close()

if __name__=='__main__': main()
