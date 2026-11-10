#!/usr/bin/env python3
"""Browse the expanded catalogue through real desktop and portrait touch input."""
import importlib.util
import json
import os
from pathlib import Path
import shutil

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('expansion_phone', ROOT / 'scripts/test-godot-phone.py')
phone = importlib.util.module_from_spec(spec)
spec.loader.exec_module(phone)


def main():
    output = ROOT / 'work/watch-expansion/web'
    output.mkdir(parents=True, exist_ok=True)
    models = json.loads((ROOT / 'godot/data/game_data.json').read_text())['itemDefs']
    rare = [d for d in models if d.get('tier') == 'ultra']
    assert len(models) == 78 and len(rare) == 5
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium'), args=[
            '--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader', '--enable-unsafe-swiftshader'])
        try:
            for label, width, height, mobile in [('desktop', 1440, 900, False), ('portrait', 390, 844, True)]:
                if os.environ.get('WATCH_EXPANSION_VIEW') and label != os.environ['WATCH_EXPANSION_VIEW']:
                    continue
                context = browser.new_context(viewport={'width': width, 'height': height}, has_touch=mobile,
                                              is_mobile=mobile, device_scale_factor=2 if mobile else 1)
                page = context.new_page()
                errors = []
                page.on('pageerror', lambda e: errors.append(str(e)))
                page.on('console', lambda m: errors.append(m.text) if any(marker in m.text for marker in (
                    'SCRIPT ERROR', 'SHADER ERROR', 'Error compiling shader')) else None)
                cw, ch = (height, width) if mobile else (width, height)

                def physical(x, y):
                    return (width-y, x) if mobile else (x, y)

                def command(data):
                    page.evaluate('(d)=>orbitalTouchSend(JSON.stringify(d))', data)

                def locate(text):
                    page.evaluate('window.__orbitalLocated=null')
                    command({'type': 'locate', 'text': text})
                    page.wait_for_function('window.__orbitalLocated!==null')
                    return page.evaluate('window.__orbitalLocated')

                def click(text):
                    result = locate(text)
                    for _ in range(18):
                        if result.get('found') and ch*.13 < result['y'] < ch*.82:
                            break
                        direction = 1 if not result.get('found') or result.get('y', ch) > ch*.82 else -1
                        if mobile:
                            phone.touch_drag(context, page, [physical(cw*.8, ch*((.70 if direction > 0 else .30)-direction*i*.045)) for i in range(9)])
                        else:
                            page.mouse.move(cw*.8, ch*.60)
                            page.mouse.wheel(0, direction*300)
                        page.wait_for_timeout(200)
                        result = locate(text)
                    assert result.get('found') and not result['disabled'], (label, text, result)
                    x, y = physical(result['x'], result['y'])
                    assert 0 < x < width and 0 < y < height, (label, text, result)
                    if mobile:
                        page.touchscreen.tap(x, y)
                    else:
                        page.mouse.click(x, y)
                    page.wait_for_timeout(350)

                try:
                    page.goto('http://127.0.0.1:4174/')
                    page.wait_for_function('window.OrbitalTouch?.state?.ready', timeout=90000)
                    command({'type': 'start'})
                    phone.wait(page, '!s.title && !s.busy')
                    command({'type': 'settings'})
                    phone.wait(page, 's.blocked')
                    click('全图鉴 · 全部手表')
                    for tier, number in [('low', '034'), ('mid', '049'), ('luxury', '064'), ('ultra', '074')]:
                        click('@catalogue_tier_'+tier)
                        assert locate('@catalogue_model_WCH-'+number)['found'], (label, tier)
                    page.screenshot(path=str(output / f'{label}-ultra-grid.png'))
                    for definition in rare:
                        click('@catalogue_model_'+definition['id'])
                        page.screenshot(path=str(output / f"{label}-{definition['id']}.png"))
                        # Reference reading must leave campaign money/AP unchanged.
                        before = {k: page.evaluate('OrbitalTouch.state')[k] for k in ('cash', 'ap', 'day')}
                        page.wait_for_timeout(800)
                        after = {k: page.evaluate('OrbitalTouch.state')[k] for k in before}
                        assert before == after, (label, definition['id'], 'reference mutated campaign')
                        click('@catalogue_back')
                    command({'type': 'close'})
                    page.wait_for_timeout(250)
                    command({'type': 'settings'})
                    phone.wait(page, 's.blocked')
                    click('减少动态效果')
                    click('全图鉴 · 全部手表')
                    click('@catalogue_tier_ultra')
                    click('@catalogue_model_WCH-074')
                    page.screenshot(path=str(output / f'{label}-rare-reduced-motion.png'))
                    command({'type': 'close'})
                    assert not errors, errors
                    print(label, '78-model tier navigation / five rare previews / touch scrolling PASS', flush=True)
                except Exception:
                    page.screenshot(path=str(output / f'{label}-failure.png'))
                    raise
                finally:
                    context.close()
        finally:
            browser.close()


if __name__ == '__main__':
    main()
