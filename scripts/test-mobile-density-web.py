"""Phone UI density: real canvas, touch expansion, dialogs, and rotation."""
import importlib.util
import os
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright

spec=importlib.util.spec_from_file_location('phone',Path(__file__).with_name('test-godot-phone.py'))
phone=importlib.util.module_from_spec(spec);spec.loader.exec_module(phone)
out=Path('work/mobile-ui/browser');out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
    browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
    context=browser.new_context(viewport={'width':844,'height':390},has_touch=True,is_mobile=True,device_scale_factor=1)
    page=context.new_page();errors=[]
    page.on('console',lambda m:errors.append(m.text) if 'SCRIPT ERROR' in m.text or m.type=='error' else None)
    page.on('pageerror',lambda e:errors.append(str(e)))
    def command(kind,**values): page.evaluate('(d)=>orbitalTouchSend(JSON.stringify(d))',dict(type=kind,**values))
    def shot(name):
        page.wait_for_timeout(450);page.screenshot(path=str(out/(name+'.png')),scale='css')
    def locate(text):
        page.evaluate("t=>{window.__orbitalLocated=null;orbitalTouchSend(JSON.stringify({type:'locate',text:t}))}",text)
        page.wait_for_function('window.__orbitalLocated!==null');return page.evaluate('__orbitalLocated')
    def tap(text):
        target=locate(text);assert target['found'] and not target['disabled'],target
        width,height=page.viewport_size.values()
        assert 0<=target['x']<=width and 0<=target['y']<=height,target
        page.touchscreen.tap(target['x'],target['y']);page.wait_for_timeout(350)
        return target
    def close():
        command('close');page.wait_for_timeout(400)
    page.goto('http://127.0.0.1:4174/')
    page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=120000)
    command('start');page.wait_for_function('!OrbitalTouch.state.title&&!OrbitalTouch.state.busy',timeout=30000)
    for width,height in [(844,390),(390,844),(568,320),(320,568)]:
        page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(600)
        command('page',page='orders');page.wait_for_function("OrbitalTouch.state.workspace==='orders'")
        shot(f'orders-{width}')
        row=tap('@OrderSummary');assert row['height']<=65,row
        shot(f'order-expanded-{width}')
        if width==390:
            page.set_viewport_size({'width':568,'height':320});page.wait_for_timeout(500)
            assert locate('@OrderSummary')['height']<=55,'Order summaries must compact when rotating an open sheet'
            shot('orders-rotated')
            page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(500)
        close()
        command('settings');page.wait_for_function('OrbitalTouch.state.blocked')
        close_key=locate('@modal_close');assert close_key['found'] and 0<close_key['x']<width and 0<close_key['y']<height,close_key
        shot(f'settings-{width}')
        if width==390:
            tap('声音')
            page.set_viewport_size({'width':568,'height':320});page.wait_for_timeout(500)
            close_key=locate('@modal_close');assert 0<close_key['y']<320 and 0<close_key['x']<568,close_key
            shot('settings-rotated')
            page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(500)
        if width in (844,390):
            # On short phones the settings list may need a deliberate swipe.
            target=locate('全图鉴')
            if target['y']>height-30:
                phone.touch_drag(context,page,[(width//2,y) for y in range(height-50,80,-20)])
            tap('全图鉴');shot(f'catalogue-{width}')
            tap('@catalogue_group_ultra');shot(f'catalogue-filtered-{width}')
        close()
        for target in ['warehouse','report']:
            command('page',page=target);page.wait_for_function('(t)=>OrbitalTouch.state.workspace===t',arg=target)
            if target=='warehouse':
                goods=page.evaluate('OrbitalTouch.state.warehouse_targets')
                if goods:
                    good=goods[0]
                    page.touchscreen.tap(good['x']+good['width']/2,good['y']+good['height']/2)
                    page.wait_for_function('(uid)=>OrbitalTouch.state.warehouse_uid===uid',arg=good['uid'])
                    shot(f'warehouse-actions-{width}')
                    tap('展开物品档案')
            shot(f'{target}-{width}');close()
    assert not errors,errors[:12]
    browser.close()
    print('PASS phone density, real touch expansion, settings rotation, catalogue filtering and management screens at four phone sizes')
