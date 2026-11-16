#!/usr/bin/env python3
"""Check desktop edge controls with real mouse input after resize and at DPR 2."""
import importlib.util
import json
import os
from pathlib import Path
import shutil
import sys
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'work/loading-comic'


def main(url):
    spec = importlib.util.spec_from_file_location('phone', ROOT / 'scripts/test-godot-phone.py')
    phone = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(phone)
    OUT.mkdir(parents=True, exist_ok=True)
    results, errors = [], []
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium'),
            args=['--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--mute-audio'])
        try:
            for dpr, sizes in [(1, [(2048, 1018), (1920, 900), (2560, 1080), (1440, 900), (1280, 720), (1920, 1080)]),
                               (2, [(1024, 640)])]:
                context = browser.new_context(viewport={'width': sizes[0][0], 'height': sizes[0][1]}, device_scale_factor=dpr)
                page = context.new_page()
                page.on('pageerror', lambda error: errors.append(str(error)))
                page.on('console', lambda msg: errors.append(msg.text) if
                    (msg.type == 'error' or 'SCRIPT ERROR' in msg.text) and 'browser metadata' not in msg.text else None)
                page.goto(url)
                page.wait_for_function('window.OrbitalTouch?.state?.ready && !document.getElementById("loader")', timeout=120000)
                page.evaluate('orbitalTouchSend(JSON.stringify({type:"start"}))')
                phone.wait(page, '!s.title && !s.busy', timeout=30000)
                for width, height in sizes:
                    page.set_viewport_size({'width': width, 'height': height})
                    page.wait_for_timeout(500)
                    phone.assert_full_screen(page, width, height)
                    keys = {key: phone.locate(page, key) for key in ['设置', '@StrictCashLedger', '@StrictNav_sun', '@StrictNav_box-archive', '@StrictNav_gauge-high']}
                    for key, rect in keys.items():
                        assert rect['x']-rect['width']/2 >= -.5 and rect['x']+rect['width']/2 <= width+.5, (key, rect, width)
                        assert rect['y']-rect['height']/2 >= -.5 and rect['y']+rect['height']/2 <= height+.5, (key, rect, height)
                    page.screenshot(path=str(OUT / f'desktop-{width}x{height}-dpr{dpr}.png'))
                    cash, ap = page.evaluate('[OrbitalTouch.state.cash,OrbitalTouch.state.ap]')
                    # Click near the outer edges that were formerly cropped.
                    settings = keys['设置']
                    page.mouse.click(settings['x'], settings['y']-settings['height']*.35)
                    phone.wait(page, 's.blocked')
                    page.keyboard.press('Escape')
                    phone.wait(page, '!s.blocked')
                    storage = keys['@StrictNav_box-archive']
                    page.mouse.click(storage['x'], storage['y']+storage['height']*.35)
                    phone.wait(page, 's.workspace === "warehouse"')
                    page.keyboard.press('Escape')
                    phone.wait(page, '!s.workspace && !s.busy')
                    assert page.evaluate('[OrbitalTouch.state.cash,OrbitalTouch.state.ap]') == [cash, ap]
                    results.append({'width': width, 'height': height, 'dpr': dpr, 'controls': keys, 'mouse_actions': True})
                    print(f'PASS desktop {width}x{height} DPR {dpr}: complete edge controls and actual mouse clicks', flush=True)
                context.close()
            assert not errors, errors
            (OUT / 'desktop-results.json').write_text(json.dumps({'passed': True, 'viewports': results, 'errors': errors}, ensure_ascii=False, indent=2)+'\n')
        finally:
            browser.close()


if __name__ == '__main__':
    main(sys.argv[1] if len(sys.argv)>1 else 'http://127.0.0.1:4174/')
