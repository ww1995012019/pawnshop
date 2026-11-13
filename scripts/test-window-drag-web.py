"""Drag native game window title bars using real mouse and touch events."""
import argparse
import importlib.util
from pathlib import Path
import shutil
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT/'work/window-drag'
spec = importlib.util.spec_from_file_location('phone', ROOT/'scripts/test-godot-phone.py')
phone = importlib.util.module_from_spec(spec)
spec.loader.exec_module(phone)

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--portrait-only',action='store_true')
    args=parser.parse_args()
    OUT.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--mute-audio'])
        for width,height in ([(390,844)] if args.portrait_only else [(1440,900),(844,390),(390,844)]):
            mobile=width<1000
            context=browser.new_context(viewport={'width':width,'height':height},has_touch=mobile,is_mobile=mobile,device_scale_factor=2 if mobile else 1)
            page=context.new_page();errors=[]
            page.on('console',lambda m:errors.append(m.text) if 'SCRIPT ERROR' in m.text else None)
            def cmd(data):page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))',data)
            def wait(condition):phone.wait(page,condition,timeout=30000)
            def hit(text):return phone.locate(page,text)
            touch=context.new_cdp_session(page) if mobile else None
            def drag_window(close_text,dx=-50,dy=55):
                before=hit(close_text)
                x,y=before['x']-150,before['y']
                if mobile:
                    touch.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
                else:page.mouse.move(x,y);page.mouse.down()
                page.wait_for_timeout(120)
                for step in range(1,9):
                    target={'x':x+dx*step/8,'y':y+dy*step/8}
                    if mobile:touch.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[target]})
                    else:page.mouse.move(target['x'],target['y'])
                    page.wait_for_timeout(35)
                if mobile:touch.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
                else:page.mouse.up()
                page.wait_for_timeout(450)
                after=hit(close_text)
                assert abs(after['x']-before['x']-dx)<3 and abs(after['y']-before['y']-dy)<3,(width,close_text,before,after,dx,dy)
                return after
            def click(text):
                target=hit(text)
                if mobile:page.touchscreen.tap(target['x'],target['y'])
                else:page.mouse.click(target['x'],target['y'])
                page.wait_for_timeout(400)
            page.goto('http://127.0.0.1:4174/')
            page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=120000)
            cmd({'type':'start'});wait('!s.title&&!s.busy');page.wait_for_timeout(1500)
            before=page.evaluate('({cash:OrbitalTouch.state.cash,ap:OrbitalTouch.state.ap})')
            for name in ['warehouse','inspect','repair','orders','report']:
                cmd({'type':'page','page':name});wait(f's.workspace==="{name}"');page.wait_for_timeout(600)
                close='关闭并返回' if mobile else '收起'
                position=drag_window(close)
                if name=='warehouse':
                    page.screenshot(path=str(OUT/f'{width}-warehouse-moved.png'))
                    cmd({'type':'page','page':'repair'});wait('s.workspace==="repair"');page.wait_for_timeout(400)
                    cmd({'type':'close'});wait('s.workspace==="warehouse"');page.wait_for_timeout(300)
                    restored=hit(close)
                    assert abs(restored['x']-position['x'])<2 and abs(restored['y']-position['y'])<2,'return reset dragged position'
                click(close);wait('s.workspace===""')
            cmd({'type':'settings'});page.wait_for_timeout(650)
            drag_window('@modal_close',-40,40)
            page.screenshot(path=str(OUT/f'{width}-modal-moved.png'))
            click('@modal_close');page.wait_for_timeout(300)
            cmd({'type':'page','page':'repair'});wait('s.workspace==="repair"');page.wait_for_timeout(600)
            try:hit('伪装加工')
            except AssertionError:click('操作实物')
            click('伪装加工')
            try:
                target=hit('选择仿冒目标')
                if not 0<target['y']<height:raise AssertionError('target picker is outside active section')
            except AssertionError:
                click('物品档案')
            click('选择仿冒目标');page.wait_for_timeout(650)
            drag_window('@modal_close',-35,35)
            click('@modal_close')
            cmd({'type':'close'});wait('s.workspace===""')
            after=page.evaluate('({cash:OrbitalTouch.state.cash,ap:OrbitalTouch.state.ap})')
            assert after==before,(before,after)
            assert not errors,errors
            print('PASS movable workspaces, root/embedded modals, Close and return',width,height,flush=True)
            context.close()
        browser.close()

if __name__=='__main__':main()
