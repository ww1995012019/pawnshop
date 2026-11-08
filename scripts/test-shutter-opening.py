"""Real-engine acceptance for the shared opening/day shutter, without changing dist/.

SHUTTER_URL=http://localhost:4175/ python scripts/test-shutter-opening.py
The private bundle exposes native scene labels only for this browser session.
"""
import mimetypes
import os
from pathlib import Path
import subprocess
import tempfile
from urllib.parse import unquote, urlparse

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
URL = os.environ.get('SHUTTER_URL', 'http://localhost:4175/')
OUT = Path(os.environ.get('SHUTTER_ARTIFACTS', '/workspace/scratch/shutter-opening'))
PHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1'


def private_bundle(destination):
    # Use the production entry and real Cocos engine. Only observation is added.
    script = r'''
import {readFile} from 'node:fs/promises';
import {resolve} from 'node:path';
import {build} from 'esbuild';
const root=process.cwd();
const entry=(await readFile('web/entry.ts','utf8')).replace('__ART_EXT__','png');
const observe=`
import {Label as AcceptanceLabel,UIOpacity as AcceptanceOpacity} from 'cc';
globalThis.__SHUTTER_PAUSE__=paused=>paused?director.pause():director.resume();
globalThis.__SHUTTER_ACCEPTANCE__=()=>{
  const scene=director.getScene();
  const visit=(n,path='')=>[{name:n.name,path:path+'/'+n.name,x:n.position.x,y:n.position.y,
    text:n.getComponent(AcceptanceLabel)?.string||'',active:n.activeInHierarchy,
    opacity:n.getComponent(AcceptanceOpacity)?.opacity??255},
    ...n.children.flatMap(c=>visit(c,path+'/'+n.name))];
  return scene?visit(scene):[];
};`;
await build({stdin:{contents:entry+observe,resolveDir:resolve('web'),sourcefile:'entry.ts',loader:'ts'},
  bundle:true,format:'esm',platform:'browser',target:'es2020',minify:true,
  alias:{cc:resolve('.cache/cocos/runtime/cc.js')},outfile:process.argv[2],
  tsconfig:resolve('tsconfig.web.json'),define:{'process.env.NODE_ENV':'"production"'}});
'''
    subprocess.run(['node', '--input-type=module', '-', str(destination)], input=script, text=True, cwd=ROOT, check=True)


def nodes(page):
    return page.evaluate('window.__SHUTTER_ACCEPTANCE__().filter(n=>n.active)')


def state(page):
    return page.evaluate('window.__ORBITAL__.snapshot()')


def tap(page, name, width, height, phone):
    control = page.evaluate('(n)=>window.__ORBITAL__.controls().find(c=>c.name===n)', name)
    assert control, f'Missing control: {name}'
    scale = min(width / 1600, height / 900)
    x = (width - 1600 * scale) / 2 + (control['x'] + control['w'] / 2) * scale
    y = (height - 900 * scale) / 2 + (control['y'] + control['h'] / 2) * scale
    if phone:
        page.touchscreen.tap(x, y)
    else:
        page.mouse.click(x, y)


def title_checks(page, day, width, height, phone):
    scene = nodes(page)
    title = [n for n in scene if '/title-screen/' in n['path']]
    for name in ['shutter-top', 'shutter-bottom', 'shutter-day-plate']:
        assert any(n['name'] == name for n in title), f'Opening is missing the shared {name}'
    assert any(n['text'] == f'第 {day} 天' and '/shutter-day-plate/' in n['path'] for n in title), 'Date plate must display the saved day'
    controls = page.evaluate('window.__ORBITAL__.controls().filter(c=>c.name.startsWith("title-"))')
    assert {c['name'] for c in controls} == {'title-start', 'title-new', 'title-help', 'title-settings'}
    for c in controls:
        assert c['x'] >= 0 and c['y'] >= 0 and c['x'] + c['w'] <= 1601 and c['y'] + c['h'] <= 901, c
        if phone:
            assert min(c['w'], c['h']) >= 108 - .01, c
            assert min(c['w'], c['h']) * min(width / 1600, height / 900) >= 44, c
    for i, a in enumerate(controls):
        for b in controls[i + 1:]:
            assert a['x'] + a['w'] <= b['x'] or b['x'] + b['w'] <= a['x'] or a['y'] + a['h'] <= b['y'] or b['y'] + b['h'] <= a['y'], (a, b)


def main():
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='orbital-shutter-') as temp, sync_playwright() as p:
        bundle = Path(temp) / 'game.js'
        private_bundle(bundle)
        browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM', '/usr/bin/chromium'), headless=True,
                                    args=['--no-sandbox', '--enable-unsafe-swiftshader'])
        for width, height, phone in [(1600, 900, False), (667, 375, True), (844, 390, True)]:
            context = browser.new_context(viewport={'width': width, 'height': height}, screen={'width': width, 'height': height},
                                          is_mobile=phone, has_touch=phone, user_agent=PHONE_UA if phone else None)
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
            page.goto(URL)
            page.wait_for_function('window.__ORBITAL__ && window.__SHUTTER_ACCEPTANCE__', timeout=120000)
            fixture = state(page)
            fixture['day'] = 6
            page.evaluate('s=>{localStorage.setItem("orbital-save-v3",JSON.stringify(s));localStorage.setItem("orbital-tutorial-v1","done");localStorage.setItem("orbital-phone-help-v1","seen")}', fixture)
            page.reload()
            page.wait_for_function('window.__ORBITAL__', timeout=120000)
            page.wait_for_timeout(350)
            title_checks(page, 6, width, height, phone)
            page.screenshot(path=str(OUT / f'opening-{width}.png'))
            before = state(page)
            tap(page, 'title-new', width, height, phone)
            assert state(page) == before, 'New shop must wait for confirmation'
            tap(page, 'button-返回', width, height, phone)
            page.wait_for_function('!window.__SHUTTER_ACCEPTANCE__().some(n=>n.active && n.name === "modal-overlay")')
            assert state(page) == before and page.evaluate('window.__ORBITAL__.title()'), 'Cancel must preserve the shop and title'
            tap(page, 'title-help', width, height, phone)
            assert any(n['text'] == '经营手册' for n in nodes(page)), 'Title help must open the manual'
            if phone:
                tap(page, 'manual-phone-return', width, height, phone)
            else:
                page.keyboard.press('Escape')
            page.wait_for_function('!window.__SHUTTER_ACCEPTANCE__().some(n=>n.active && n.name === "modal-overlay")')
            tap(page, 'title-settings', width, height, phone)
            assert page.evaluate('window.__ORBITAL__.diagnostics().page') == 'settings'
            assert state(page) == before and not page.evaluate('window.__ORBITAL__.title()')
            page.reload()
            page.wait_for_function('window.__ORBITAL__', timeout=120000)
            page.wait_for_timeout(350)
            if phone:
                tap(page, 'title-start', width, height, phone)
            else:
                page.keyboard.press('Enter')
            page.wait_for_function('window.__ORBITAL__.diagnostics().motion.phase === "day-shutter-opening" && window.__SHUTTER_ACCEPTANCE__().some(n=>n.active && n.name === "shutter-top")')
            page.keyboard.press('Escape')
            page.wait_for_function('!window.__ORBITAL__.diagnostics().busy')
            assert page.evaluate('window.__ORBITAL__.diagnostics().motion.activeCount') == 0, 'Skip must release opening motion'
            page.evaluate('window.__ORBITAL__.dispatch({type:"SETTLE"})')
            page.wait_for_function('!window.__ORBITAL__.diagnostics().motion.busy')
            page.evaluate('window.__ORBITAL__.dispatch({type:"NEXT"})')
            page.wait_for_function('''() => {
                if(window.__ORBITAL__.diagnostics().motion.phase !== "day-shutter")return false;
                const scene=window.__SHUTTER_ACCEPTANCE__();
                if(!scene.some(n=>n.active && n.name === "shutter-day-plate" && n.opacity === 255))return false;
                window.__SHUTTER_PAUSE__(true);return true;
            }''')
            assert any(n['text'] == '第 7 天' and '/shutter-day-plate/' in n['path'] for n in nodes(page))
            page.screenshot(path=str(OUT / f'day-change-{width}.png'))
            page.evaluate('window.__SHUTTER_PAUSE__(false)')
            page.wait_for_function('!window.__ORBITAL__.diagnostics().busy')
            page.evaluate('localStorage.setItem("orbital-prefs-v3",JSON.stringify({sound:false,reducedMotion:true,largeText:false}))')
            page.reload()
            page.wait_for_function('window.__ORBITAL__', timeout=120000)
            tap(page, 'title-start', width, height, phone)
            page.wait_for_function('!window.__ORBITAL__.diagnostics().busy')
            assert not page.evaluate('window.__ORBITAL__.title()')
            assert page.evaluate('window.__ORBITAL__.diagnostics().motion.activeCount') == 0
            if phone:
                page.evaluate('localStorage.removeItem("orbital-save-v3");localStorage.removeItem("orbital-phone-help-v1")')
                page.reload()
                page.wait_for_function('window.__ORBITAL__', timeout=120000)
                tap(page, 'title-start', width, height, phone)
                assert any(n['text'] == '经营手册' for n in nodes(page)), 'First phone start must retain its manual'
            assert not errors, errors
            context.close()
            print(f'{width}: saved day, title controls, help/settings, confirmation cancellation, matching opening, skip, day change and reduced motion passed', flush=True)
        browser.close()


if __name__ == '__main__':
    main()
