"""Native Cocos viewport and real-input acceptance, without writing dist/ or play/.

VIEWPORT_URL=http://localhost:4175/ python scripts/test-responsive-viewport.py
VIEWPORT_PRIVATE_INTEGRATION=1 temporarily wires the adapter into a v16 Main.
"""
import json
import mimetypes
import os
from pathlib import Path
import subprocess
import tempfile
from urllib.parse import unquote, urlparse

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
URL = os.environ.get('VIEWPORT_URL', 'http://localhost:4175/')
OUT = Path(os.environ.get('VIEWPORT_ARTIFACTS', '/workspace/scratch/viewport-v17'))
PHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1'


def private_bundle(destination):
    script = r'''
import {readFile} from 'node:fs/promises';
import {existsSync} from 'node:fs';
import {resolve} from 'node:path';
import {build} from 'esbuild';
const root=process.cwd();
const entry=(await readFile('web/entry.ts','utf8')).replace('__ART_EXT__','png');
const adapter=existsSync('assets/scripts/orbital/ResponsiveViewport.ts');
const observe=`
import {view as acceptanceView,Camera as AcceptanceCamera,UITransform as AcceptanceTransform,Vec3 as AcceptanceVec3} from 'cc';
${adapter?`import {configureViewport as acceptanceConfigure,viewportBounds as acceptanceBounds,bindResponsiveViewport as acceptanceBind,toggleBrowserFullscreen as acceptanceFullscreen} from '../assets/scripts/orbital/ResponsiveViewport';`:''}
globalThis.__VIEWPORT_ACCEPTANCE__=()=>{
  const scene=director.getScene();
  const all=n=>[n,...n.children.flatMap(all)];
  const list=scene?all(scene):[];
  const root=list.find(n=>n.name==='OrbitalUI');
  const camera=list.find(n=>n.name==='OrbitalCamera')?.getComponent(AcceptanceCamera);
  const size=acceptanceView.getCanvasSize(),visible=acceptanceView.getVisibleSize(),viewport=acceptanceView.getViewportRect();
  const rect=document.getElementById('GameCanvas').getBoundingClientRect();
  return {size:{width:size.width,height:size.height},visible:{width:visible.width,height:visible.height},
    viewport:{x:viewport.x,y:viewport.y,width:viewport.width,height:viewport.height},
    scale:{x:acceptanceView.getScaleX(),y:acceptanceView.getScaleY()},
    rect:{x:rect.x,y:rect.y,width:rect.width,height:rect.height},
    root:root?{x:root.position.x,y:root.position.y}:null,orthoHeight:camera?.orthoHeight,
    modals:list.filter(n=>n.name==='modal-overlay'&&n.activeInHierarchy).length,
    bounds:${adapter?'acceptanceBounds()':'null'}};
};
${adapter?`globalThis.__VIEWPORT_CONFIGURE__=acceptanceConfigure;
globalThis.__VIEWPORT_FULLSCREEN__=acceptanceFullscreen;
globalThis.__VIEWPORT_RESIZE_COUNT__=0;
globalThis.__VIEWPORT_UNBIND__=acceptanceBind(()=>globalThis.__VIEWPORT_RESIZE_COUNT__++);`:''}
`;
const plugins=process.env.VIEWPORT_PRIVATE_INTEGRATION==='1'?[{name:'private-viewport-integration',setup(b){
  b.onLoad({filter:/\/OrbitalMain\.ts$/},async args=>{
    let source=await readFile(args.path,'utf8');
    if(!source.includes('configureViewport')){
      source=`import {configureViewport,bindResponsiveViewport} from './ResponsiveViewport';\n`+source;
      source=source.replace('view.setDesignResolutionSize(W,H,ResolutionPolicy.SHOW_ALL);','configureViewport();');
      source=source.replace('this.ui=new OrbitalUI(root);','bindResponsiveViewport(()=>{});this.ui=new OrbitalUI(root);');
    }
    return{contents:source,loader:'ts'};
  });
}}]:[];
await build({stdin:{contents:entry+observe,resolveDir:resolve('web'),sourcefile:'entry.ts',loader:'ts'},
  bundle:true,format:'esm',platform:'browser',target:'es2020',minify:true,plugins,
  alias:{cc:resolve('.cache/cocos/runtime/cc.js')},outfile:process.argv[2],
  tsconfig:resolve('tsconfig.web.json'),define:{'process.env.NODE_ENV':'"production"'}});
'''
    subprocess.run(['node', '--input-type=module', '-', str(destination)], input=script, text=True, cwd=ROOT, check=True)


def metrics(page):
    return page.evaluate('window.__VIEWPORT_ACCEPTANCE__()')


def assert_full_viewport(page, width, height):
    m = metrics(page)
    for key, wanted in [('x', 0), ('y', 0), ('width', width), ('height', height)]:
        assert abs(m['rect'][key] - wanted) < 1.1, f'Canvas fails to cover browser: {m}'
    assert abs(m['viewport']['x']) < 1 and abs(m['viewport']['y']) < 1, f'Render viewport is letterboxed: {m}'
    for key in ['width', 'height']:
        assert abs(m['viewport'][key] - m['size'][key]) < 1, f'Render viewport is letterboxed: {m}'
    assert m['visible']['width'] >= 1599.99 and m['visible']['height'] >= 899.99, f'Legacy controls are cropped: {m}'
    assert abs(m['scale']['x'] - m['scale']['y']) < .0001, f'Content is stretched: {m}'
    assert m['root'] == {'x': -800, 'y': 450}, f'Legacy root must stay centered: {m}'
    assert abs(m['orthoHeight'] - m['visible']['height'] / 2) < .01, f'Canvas camera is out of sync: {m}'
    b = m['bounds']
    assert b and abs(b['x'] + b['width'] / 2 - 800) < .01 and abs(b['y'] + b['height'] / 2 - 450) < .01, m
    assert abs(b['width'] - m['visible']['width']) < .01 and abs(b['height'] - m['visible']['height']) < .01, m
    expected = {
        (1920, 910): (-149.45054945, 0, 1898.9010989, 900),
        (1920, 1080): (0, 0, 1600, 900),
        (2560, 1080): (-266.66666667, 0, 2133.3333333, 900),
        (1280, 1024): (0, -190, 1600, 1280),
        (667, 375): (-.4, 0, 1600.8, 900),
        (844, 390): (-173.84615385, 0, 1947.6923077, 900),
        (390, 844): (-173.84615385, 0, 1947.6923077, 900),
    }[(width, height)]
    for key, want in zip(['x', 'y', 'width', 'height'], expected):
        assert abs(b[key] - want) < .01, (m, expected)
    return m


def tap_control(page, name, width, height, phone):
    page.wait_for_function('!window.__ORBITAL__.diagnostics().busy')
    control = page.evaluate('(n)=>window.__ORBITAL__.controls().find(c=>c.name===n)', name)
    assert control, f'Missing control {name}'
    rotated = phone and width < height
    logical_width, logical_height = (height, width) if rotated else (width, height)
    scale = min(logical_width / 1600, logical_height / 900)
    x = (logical_width - 1600 * scale) / 2 + (control['x'] + control['w'] / 2) * scale
    y = (logical_height - 900 * scale) / 2 + (control['y'] + control['h'] / 2) * scale
    if rotated:
        x, y = width - y, x
    assert 0 <= x <= width and 0 <= y <= height, (control, x, y)
    if phone:
        page.touchscreen.tap(x, y)
    else:
        page.mouse.click(x, y)


def exercise_controls(page, width, height, phone):
    tap_control(page, 'title-help', width, height, phone)
    if phone:
        page.wait_for_function('window.__ORBITAL__.controls().some(c=>c.name==="manual-phone-return")')
        tap_control(page, 'manual-phone-return', width, height, phone)
    else:
        page.keyboard.press('Escape')
    page.wait_for_function('window.__VIEWPORT_ACCEPTANCE__().modals===0')
    tap_control(page, 'title-settings', width, height, phone)
    page.wait_for_function('window.__ORBITAL__.diagnostics().page==="settings"')
    assert not page.evaluate('window.__ORBITAL__.title()')


def exercise_navigation(page, width, height, phone):
    tap_control(page, 'button-03 维修', width, height, phone)
    page.wait_for_function('window.__ORBITAL__.diagnostics().page==="repair"')
    tap_control(page, 'button-01 柜台', width, height, phone)
    page.wait_for_function('window.__ORBITAL__.diagnostics().page==="counter"')


def fullscreen_checks(page):
    # A DOM button supplies a real trusted gesture to the browser API.
    page.evaluate('''() => {
        const button=document.createElement('button');button.id='acceptance-fullscreen';
        button.style.cssText='position:fixed;z-index:1000;left:0;top:0;width:100px;height:50px';
        button.textContent='Fullscreen';button.onclick=()=>window.__VIEWPORT_FULLSCREEN__().then(v=>window.__VIEWPORT_FULLSCREEN_RESULT__=v);
        document.body.append(button);
    }''')
    page.locator('#acceptance-fullscreen').click()
    page.wait_for_function('window.__VIEWPORT_FULLSCREEN_RESULT__===true && !!document.fullscreenElement')
    page.evaluate('window.__VIEWPORT_FULLSCREEN_RESULT__=null')
    page.locator('#acceptance-fullscreen').click()
    page.wait_for_function('window.__VIEWPORT_FULLSCREEN_RESULT__===true && !document.fullscreenElement')
    # Unsupported and rejected API paths must resolve false and leave no pending retries.
    results = page.evaluate('''async () => {
        const original=document.documentElement.requestFullscreen;
        document.documentElement.requestFullscreen=undefined;
        const unsupported=await window.__VIEWPORT_FULLSCREEN__();
        document.documentElement.requestFullscreen=()=>Promise.reject(new Error('denied for acceptance'));
        const rejected=await window.__VIEWPORT_FULLSCREEN__();
        document.documentElement.requestFullscreen=original;
        document.getElementById('acceptance-fullscreen').remove();
        return {unsupported,rejected};
    }''')
    assert results == {'unsupported': False, 'rejected': False}, results


def native_fullscreen_controls(page, width, height, phone):
    for enter in [True, False]:
        if phone:
            tap_control(page, 'button-菜单', width, height, phone)
            tap_control(page, 'phone-menu-8', width, height, phone)
        else:
            name=page.evaluate('window.__ORBITAL__.controls().find(c=>c.name==="button-全屏显示"||c.name==="button-退出全屏").name')
            tap_control(page, name, width, height, phone)
        page.wait_for_function('(enter)=>!!document.fullscreenElement===enter', arg=enter)
        page.wait_for_timeout(150)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='orbital-viewport-') as temp, sync_playwright() as p:
        bundle = Path(temp) / 'game.js'
        private_bundle(bundle)
        browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM', '/usr/bin/chromium'), headless=True,
                                    args=['--no-sandbox', '--enable-unsafe-swiftshader'])
        all_metrics = []
        for width, height, phone in [(1920, 910, False), (1920, 1080, False), (2560, 1080, False),
                                     (1280, 1024, False), (667, 375, True), (844, 390, True), (390, 844, True)]:
            context = browser.new_context(viewport={'width': width, 'height': height}, screen={'width': width, 'height': height},
                                          is_mobile=phone, has_touch=phone, device_scale_factor=2 if phone else 1,
                                          user_agent=PHONE_UA if phone else None)
            context.route('**/game.js*', lambda route: route.fulfill(path=str(bundle), content_type='text/javascript'))

            def resource(route):
                relative = unquote(urlparse(route.request.url).path).split('/resources/', 1)[-1]
                path = (ROOT / 'assets/resources' / relative).resolve()
                if path.is_relative_to(ROOT / 'assets/resources') and path.is_file():
                    route.fulfill(path=str(path), content_type=mimetypes.guess_type(path)[0] or 'application/octet-stream')
                else:
                    route.continue_()

            context.route('**/resources/**', resource)
            page = context.new_page()
            errors = []
            page.on('pageerror', lambda error: errors.append(str(error)))
            page.add_init_script('''localStorage.setItem("orbital-tutorial-v1","done");
                localStorage.setItem("orbital-phone-help-v1","seen");
                localStorage.setItem("orbital-tips-v1",JSON.stringify(['tip-repair','tip-warehouse','tip-orders','tip-report']))''')
            page.goto(URL)
            page.wait_for_function('window.__ORBITAL__ && window.__VIEWPORT_ACCEPTANCE__', timeout=120000)
            page.wait_for_timeout(250)
            try:
                m = assert_full_viewport(page, width, height)
            except AssertionError:
                page.screenshot(path=str(OUT / f'failure-{width}x{height}.png'))
                raise
            all_metrics.append({'width': width, 'height': height, 'phone': phone, **m})
            page.screenshot(path=str(OUT / f'viewport-{width}x{height}.png'))
            exercise_controls(page, width, height, phone)
            if (width, height) in [(1920,910),(667,375)]:
                native_fullscreen_controls(page,width,height,phone)
            exercise_navigation(page, width, height, phone)
            # Same page crosses both policy branches. A repeated configure must not recurse.
            if (width, height) == (1920, 910):
                fullscreen_checks(page)
                page.evaluate('for(let i=0;i<100;i++)window.__VIEWPORT_CONFIGURE__()')
                assert page.evaluate('window.__VIEWPORT_RESIZE_COUNT__') < 20
                for new_width, new_height in [(1280, 1024), (2560, 1080), (1920, 910)]:
                    page.set_viewport_size({'width': new_width, 'height': new_height})
                    page.wait_for_timeout(300)
                    assert_full_viewport(page, new_width, new_height)
                    exercise_navigation(page, new_width, new_height, phone)
                assert page.evaluate('window.__VIEWPORT_RESIZE_COUNT__') < 30
                count = page.evaluate('window.__VIEWPORT_RESIZE_COUNT__')
                page.evaluate('window.__VIEWPORT_UNBIND__();window.__VIEWPORT_UNBIND__()')
                page.set_viewport_size({'width': 2560, 'height': 1080})
                page.wait_for_timeout(300)
                assert page.evaluate('window.__VIEWPORT_RESIZE_COUNT__') == count, 'Disposed resize binding still fired'
                assert_full_viewport(page, 2560, 1080)
                page.set_viewport_size({'width': width, 'height': height})
                page.reload()
                page.wait_for_function('window.__ORBITAL__', timeout=120000)
                exercise_controls(page, width, height, phone)
            if (width, height) == (390, 844):
                # Cocos rotates portrait once; direct taps still reach the centered UI.
                for new_width, new_height in [(844, 390), (390, 844)]:
                    page.set_viewport_size({'width': new_width, 'height': new_height})
                    page.wait_for_timeout(350)
                    assert_full_viewport(page, new_width, new_height)
                    exercise_navigation(page, new_width, new_height, phone)
                page.reload()
                page.wait_for_function('window.__ORBITAL__', timeout=120000)
                exercise_controls(page, width, height, phone)
            assert not errors, errors
            context.close()
            print(f'{width}x{height}: full render viewport, complete legacy controls and native input passed', flush=True)
        browser.close()
        (OUT / 'metrics.json').write_text(json.dumps(all_metrics, ensure_ascii=False, indent=2))


if __name__ == '__main__':
    main()
