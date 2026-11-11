#!/usr/bin/env python3
"""Real finger scrolling, tap cancellation, scroll-thumb dragging and optical tools."""
import importlib.util
import json
import os
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('phone', ROOT/'scripts/test-godot-phone.py')
phone = importlib.util.module_from_spec(spec)
spec.loader.exec_module(phone)

def main():
    out=ROOT/'work/mobile-gestures-browser';out.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        # These drag paths are measured on the landscape workbench. Native
        # portrait transactions/navigation are covered in test-portrait-web.py.
        for portrait in [False]:
            label='portrait' if portrait else 'landscape'
            context=browser.new_context(viewport={'width':390 if portrait else 844,'height':844 if portrait else 390},has_touch=True,is_mobile=True,device_scale_factor=2)
            page=context.new_page();errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda m:errors.append(m.text) if 'SCRIPT ERROR' in m.text else None)
            def command(d):page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))',d)
            def locate(text):
                page.evaluate('window.__orbitalLocated=null');command({'type':'locate','text':text})
                page.wait_for_function('window.__orbitalLocated!==null')
                return page.evaluate('window.__orbitalLocated')
            def physical(x,y):return (x,y)
            def tap(text):
                found=locate(text);assert found['found'] and not found['disabled'],found
                page.touchscreen.tap(*physical(found['x'],found['y']));page.wait_for_timeout(200)
            def drag(points,held_screenshots=None):
                cdp=context.new_cdp_session(page)
                x,y=physical(*points[0]);cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
                page.wait_for_timeout(80)
                if held_screenshots:page.screenshot(path=str(out/f'{label}-{held_screenshots}-start.png'))
                for point in points[1:]:
                    x,y=physical(*point);cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y}]});page.wait_for_timeout(40)
                if held_screenshots:page.screenshot(path=str(out/f'{label}-{held_screenshots}-end.png'))
                cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});cdp.detach();page.wait_for_timeout(550)
            try:
                page.goto('http://127.0.0.1:4174/')
                page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=90000)
                command({'type':'start'});phone.wait(page,'!s.title&&!s.busy')
                command({'type':'settings'});phone.wait(page,'s.blocked');tap('全图鉴 · 全部手表')
                first=locate('北辰 N01');assert first['found'],first
                page.screenshot(path=str(out/f'{label}-scroll-before.png'))
                drag([(first['x'],first['y']+25-i*12) for i in range(9)])
                after=locate('北辰 N01')
                assert after['y'] < first['y']-30,(label,'button swallowed the swipe',first,after)
                assert not locate('返回全部手表')['found'],'swipe accidentally activated a catalogue card'
                page.screenshot(path=str(out/f'{label}-scroll-after.png'))
                # Ordinary taps must still work after a scroll beginning on a card.
                definitions=json.loads((ROOT/'godot/data/game_data.json').read_text())['itemDefs']
                chosen=None
                for definition in definitions:
                    found=locate(definition['name'])
                    if found['found'] and 150<found['y']<260:
                        chosen=definition['name'];break
                assert chosen,'no visible catalogue card after scrolling'
                tap(chosen);assert locate('返回全部手表')['found'],'tap after scrolling did not open reference'
                tap('返回全部手表')
                # Drag the real scroll thumb back towards the top, not a mouse wheel.
                before_thumb=locate('北辰 N01')
                drag([(623,190+i*8) for i in range(10)])
                thumb=locate('北辰 N01')
                assert abs(thumb['y']-before_thumb['y'])>15,(label,'scroll thumb did not move',before_thumb,thumb)
                command({'type':'close'});phone.wait(page,'!s.blocked')
                command({'type':'page','page':'inspect'});phone.wait(page,"s.workspace==='inspect'")
                for tool,pin,count in [('TOL-001','定位并固定标识',1),('TOL-002','定位并固定编号',2)]:
                    command({'type':'tool','tool':tool})
                    page.wait_for_function('t=>OrbitalTouch.state.inspection_current===t&&!OrbitalTouch.state.inspection_busy',arg=tool)
                    drag([(360+i*16,155+i*4) for i in range(11)],tool)
                    tap(pin)
                    page.wait_for_function('n=>OrbitalTouch.state.appraisal?.count>=n',arg=count,timeout=12000)
                assert not errors,errors
                print(label,'real swipe over cards, cancelled click, tap, scroll thumb, lens/UV drag and pinned observations PASS',flush=True)
            except Exception:
                page.screenshot(path=str(out/f'{label}-failure.png'));print(label,'FAIL',page.evaluate('OrbitalTouch.state'),flush=True);raise
            finally:context.close()
        browser.close()

if __name__=='__main__':main()
