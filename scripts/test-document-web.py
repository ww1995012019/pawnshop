#!/usr/bin/env python3
"""Exercise floating reference paper and icon catalogue with actual browser input."""
import json
import re
import base64
import os
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright

def run(url='http://127.0.0.1:4174/'):
    output=Path('work/documents-web'); output.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        try:
            context=browser.new_context(viewport={'width':1280,'height':720},has_touch=True)
            page=context.new_page(); errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda m:errors.append(m.text) if 'SCRIPT ERROR' in m.text else None)
            def command(data):page.evaluate('(data)=>orbitalTouchSend(JSON.stringify(data))',data)
            def locate(text):
                page.evaluate('window.__orbitalLocated=null');command({'type':'locate','text':text})
                page.wait_for_function('window.__orbitalLocated !== null')
                result=page.evaluate('window.__orbitalLocated');assert result['found'],text
                return result
            def cursor_style():
                page.wait_for_timeout(200)
                return page.evaluate('getComputedStyle(document.getElementById("canvas")).cursor')
            def assert_diagonal_cursors(close):
                unit=close['width']/44
                right=close['x']+close['width']/2+16*unit
                top=close['y']-close['height']/2-16*unit
                bottom=top+740*unit
                styles=[]
                for name,x,y in [('tr',right+8,top-8),('br',right+8,bottom+8)]:
                    viewport=page.viewport_size
                    x=max(2,min(viewport['width']-2,x));y=max(2,min(viewport['height']-2,y))
                    page.mouse.move(x,y)
                    style=cursor_style()
                    assert 'url(' in style,(name,'resize must use game cursor artwork',style)
                    styles.append(style)
                    encoded=re.search(r'data:image/png;base64,([A-Za-z0-9+/=]+)',style)
                    if encoded:(output/f'cursor-{name}.png').write_bytes(base64.b64decode(encoded.group(1)))
                assert styles[0]!=styles[1],('opposite diagonals must have distinct directional artwork',close,styles)
            def tap(text):
                r=locate(text);page.mouse.click(r['x'],r['y']);page.wait_for_timeout(400)
            page.goto(url);page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=90000)
            command({'type':'start'});page.wait_for_function('!OrbitalTouch.state.title && !OrbitalTouch.state.busy',timeout=15000)
            command({'type':'manual'});page.wait_for_timeout(600)
            original=locate('X');assert not page.evaluate('OrbitalTouch.state.blocked')
            assert_diagonal_cursors(original)
            # Top-right corner: shrink diagonally toward its opposite anchor.
            x=original['x']+original['width']/2+20;y=original['y']-original['height']/2-20
            page.mouse.move(x,y);page.mouse.down();page.mouse.move(x-65,y+70,steps=12);page.mouse.up()
            small=locate('X');assert small['width']<original['width']-2,'top-right corner shrinks paper'
            # Reverse the gesture to enlarge again, then shrink for drag/pinch checks.
            x=small['x']+small['width']/2+20;y=small['y']-small['height']/2-20
            page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+30,y-30,steps=8);page.mouse.up()
            larger=locate('X');assert larger['width']>small['width']+1,'top-right corner enlarges paper'
            small=larger
            # Drag using an empty piece of the header to the left of its action buttons.
            start=(small['x']-small['width']*4,small['y'])
            page.mouse.move(*start);page.mouse.down();page.mouse.move(start[0]-80,start[1]+35,steps=8);page.mouse.up()
            moved=locate('X');assert moved['x']<small['x']-30,'header drags floating paper'
            page.screenshot(path=str(output/'guide-desktop.png'))
            tap('X');command({'type':'manual'});page.wait_for_timeout(400)
            restored=locate('X');assert abs(restored['width']-moved['width'])<2,'reopen preserves zoom'
            # Real two-finger gesture on reference content. Both contacts stay off buttons.
            cdp=context.new_cdp_session(page)
            tx=restored['x']+restored['width']/2+20;ty=restored['y']-restored['height']/2-20
            cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':tx,'y':ty,'id':0}]})
            for step in range(1,7):
                cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':tx-step*4,'y':ty+step*4,'id':0}]});page.wait_for_timeout(30)
            cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});page.wait_for_timeout(300)
            touched=locate('X');assert touched['width']<restored['width']-1,'one finger drags the paper corner'
            restored=touched
            cx=restored['x']-restored['width']*5; cy=restored['y']+restored['height']*3
            before=restored['width']
            for kind,gap in [('touchStart',25),('touchMove',38),('touchMove',50)]:
                cdp.send('Input.dispatchTouchEvent',{'type':kind,'touchPoints':[{'x':cx-gap,'y':cy,'id':0},{'x':cx+gap,'y':cy,'id':1}]});page.wait_for_timeout(100)
            cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});page.wait_for_timeout(300)
            assert locate('X')['width']>before+3,'two-finger pinch scales paper'
            tap('X')
            command({'type':'page','page':'inspect'});page.wait_for_function("OrbitalTouch.state.workspace==='inspect'")
            command({'type':'manual'});page.wait_for_timeout(400)
            assert_diagonal_cursors(locate('X'))
            page.screenshot(path=str(output/'guide-above-workbench.png'))
            tap('X');command({'type':'close'});page.wait_for_timeout(250)
            command({'type':'settings'});page.wait_for_function('OrbitalTouch.state.blocked')
            tap('全图鉴 · 全部手表');page.screenshot(path=str(output/'catalogue-grid.png'))
            tap('北辰 N01');page.screenshot(path=str(output/'catalogue-detail.png'))
            tap('返回全部手表');assert locate('北辰 N01')['found']
            command({'type':'close'});assert not errors,errors
            print('DOCUMENT WEB outer-corner resize, custom diagonals, workbench overlay, touch/pinch/reopen and catalogue pass')
        finally:browser.close()
if __name__=='__main__':
    import sys
    run(sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:4174/')
