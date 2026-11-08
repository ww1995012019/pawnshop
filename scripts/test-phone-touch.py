"""Native touch acceptance. Requires Python Playwright and a Chromium executable.

Run after build: PHONE_URL=http://localhost:4174/play/ python scripts/test-phone-touch.py
"""
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

URL = os.environ.get('PHONE_URL', 'http://localhost:4174/play/')
PHONE_UA = 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.6 Mobile/15E148 Safari/604.1'
OUT = Path(os.environ.get('PHONE_ARTIFACTS', '/workspace/scratch/mobile-audit'))
OUT.mkdir(parents=True, exist_ok=True)


def control(page, name):
    return page.evaluate('(n)=>window.__ORBITAL__.controls().find(c=>c.name===n)', name)


def tap(page, name, width, height):
    c = control(page, name)
    assert c, f'Control missing: {name}'
    scale = min(width / 1600, height / 900)
    x = (width - 1600 * scale) / 2 + (c['x'] + c['w'] / 2) * scale
    y = (height - 900 * scale) / 2 + (c['y'] + c['h'] / 2) * scale
    page.touchscreen.tap(x, y)
    page.wait_for_timeout(250)


def state(page):
    return page.evaluate('window.__ORBITAL__.snapshot()')


def idle(page):
    page.wait_for_function('!window.__ORBITAL__.diagnostics().busy', timeout=15000)


def check_targets(page, width, height):
    scale = min(width / 1600, height / 900)
    for c in page.evaluate('window.__ORBITAL__.controls()'):
        assert min(c['w'], c['h']) * scale >= 44, f'{width}: small target {c}'
        assert c['x'] >= -1 and c['y'] >= -1 and c['x'] + c['w'] <= 1601 and c['y'] + c['h'] <= 901, f'Outside canvas: {c}'


def check_pawn(browser):
    """Isolated, valid saved-game fixture; only the setup uses the debug snapshot."""
    page = browser.new_page(viewport={'width': 667, 'height': 375},
                            screen={'width': 667, 'height': 375},
                            is_mobile=True, has_touch=True, user_agent=PHONE_UA)
    page.goto(URL)
    page.wait_for_function('window.__ORBITAL__', timeout=120000)
    fixture = state(page)
    pawn = fixture['inventory'][0]
    uid = pawn['uid']
    pawn.update(owner='pawn', location='pawn', sealed=True, pawnDay=1, pawnPrincipal=40, cost=40)
    fixture['cash'] = 1100
    page.evaluate("s=>localStorage.setItem('orbital-save-v3',JSON.stringify(s))", fixture)
    page.reload()
    page.wait_for_function('window.__ORBITAL__', timeout=120000)
    page.evaluate('(uid)=>window.__ORBITAL__.open("warehouse",uid)', uid)
    tap(page, 'phone-cargo-details', 667, 375)
    tap(page, 'button-赎回原物', 667, 375)
    check_targets(page, 667, 375)
    page.screenshot(path=str(OUT / 'after-pawn-redemption-confirm.png'))
    before = state(page)
    tap(page, 'button-返回', 667, 375)
    assert state(page) == before
    tap(page, 'phone-cargo-details', 667, 375)
    tap(page, 'button-赎回原物', 667, 375)
    tap(page, 'button-确认执行', 667, 375)
    after = state(page)
    assert abs(after['cash'] - before['cash'] - 43.2) < 1e-8
    assert not any(i['uid'] == uid for i in after['inventory']), 'Redemption must return the pawn original to the customer'
    page.close()
    print('Pawn redemption: cancellation preserves state; confirmation receives principal + 8% fee and returns exact original.', flush=True)


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM', '/usr/bin/chromium'),
                                    headless=True, args=['--no-sandbox', '--enable-unsafe-swiftshader'])
        for width, height in [(667, 375), (844, 390)]:
            page = browser.new_page(viewport={'width': width, 'height': height},
                                    screen={'width': width, 'height': height},
                                    is_mobile=True, has_touch=True, device_scale_factor=1 if width == 667 else 2, user_agent=PHONE_UA)
            page.set_default_timeout(15000)
            errors = []
            page.on('pageerror', lambda e: errors.append(str(e)))
            page.goto(URL)
            page.wait_for_function('window.__ORBITAL__', timeout=120000)
            print(f'{width}: loaded', flush=True)
            page.evaluate("localStorage.setItem('orbital-tutorial-v1','done'); localStorage.setItem('orbital-phone-help-v1','seen')")
            tap(page, 'title-start', width, height)
            page.wait_for_function('!window.__ORBITAL__.diagnostics().busy')
            print(f'{width}: started', flush=True)
            scale = min(width / 1600, height / 900)
            for name in ['button-01 柜台', 'button-02 鉴定', 'button-接待下一位来客']:
                c = control(page, name)
                assert c and min(c['w'], c['h']) * scale >= 44, f'{width}: {name} below 44px: {c}'
            tap(page, 'button-02 鉴定', width, height)
            print(f'{width}: inspection', flush=True)
            assert page.evaluate('window.__ORBITAL__.diagnostics().page') == 'inspect'
            for name in ['button-旋转 R', 'button-翻到背面 F', 'phone-tool-actions']:
                c = control(page, name)
                assert c and min(c['w'], c['h']) * scale >= 44, f'{width}: {name} below 44px: {c}'
            page.screenshot(path=str(OUT / f'after-{width}-inspect.png'))
            if width == 667:
                # An open instrument must remain above navigation even after it redraws the game.
                tap(page, 'tool-target-TOL-002', width, height)
                tap(page, 'phone-tool-actions', width, height)
                check_targets(page, width, height)
                tap(page, 'phone-uv-back', width, height)
                tap(page, 'button-01 柜台', width, height)
                assert page.evaluate('window.__ORBITAL__.diagnostics().page') == 'inspect', 'UV redraw exposed background navigation over modal'
                tap(page, 'phone-tool-return', width, height)
                # Start a customer-original repair order using actual page controls.
                tap(page, 'button-05 订单', width, height)
                tap(page, 'phone-take-order', width, height)
                original = next(o['uid'] for o in state(page)['orders'] if o['id'] == 'ORD-001')
                tap(page, 'button-03 维修', width, height)
                for _ in range(2):
                    tap(page, 'phone-stock-next', width, height)
                tap(page, f'phone-item-{original}', width, height)
                tap(page, 'button-到鉴定台诊断', width, height)
                ap = state(page)['ap']
                for tool in range(1, 7):
                    tap(page, f'tool-target-TOL-00{tool}', width, height)
                    tap(page, 'phone-tool-actions', width, height)
                    if tool == 1:
                        for mark in range(3):
                            tap(page, f'phone-mark-{mark}', width, height)
                    elif tool == 2:
                        tap(page, 'phone-uv-back', width, height)
                        for _ in range(3):
                            tap(page, 'phone-uv-scan', width, height)
                    elif tool == 3:
                        for peak, times in enumerate([2, 4, 6]):
                            for _ in range(times):
                                tap(page, f'spectrum-{peak}-plus', width, height)
                    elif tool == 4:
                        for pole in range(2):
                            tap(page, f'phone-probe-{pole}', width, height)
                    elif tool == 5:
                        tap(page, 'phone-tare', width, height)
                        tap(page, 'phone-weight-10', width, height)
                        tap(page, 'phone-weight-20', width, height)
                    else:
                        for _ in range(5):
                            tap(page, 'phone-load-plus', width, height)
                    check_targets(page, width, height)
                    if tool == 3:
                        page.screenshot(path=str(OUT / 'after-tool-spectrum.png'))
                    tap(page, 'phone-tool-record', width, height)
                    idle(page)
                    item = next(i for i in state(page)['inventory'] if i['uid'] == original)
                    assert f'TOL-00{tool}' in item['evidence'], (tool, state(page)['notice'])
                    assert state(page)['ap'] == ap - 1, 'Only first inspection should spend AP'
                tap(page, 'button-03 维修', width, height)
                before = state(page)
                tap(page, 'phone-materials', width, height)
                tap(page, 'phone-buy-MAT-002', width, height)
                assert state(page)['materials']['MAT-002'] == before['materials']['MAT-002'] + 1
                assert state(page)['cash'] < before['cash']
                tap(page, 'button-01 柜台', width, height)
                assert page.evaluate('window.__ORBITAL__.diagnostics().page') == 'repair', 'Purchase redraw exposed background navigation'
                page.screenshot(path=str(OUT / 'after-materials.png'))
                tap(page, 'button-关闭', width, height)
                for stage in range(3):
                    tap(page, 'phone-repair-step', width, height)
                    assert state(page)['repairProgress'][original] == stage + 1
                tap(page, 'phone-repair-confirm', width, height)
                assert next(i for i in state(page)['inventory'] if i['uid'] == original)['repaired']
                page.screenshot(path=str(OUT / 'after-repair.png'))
                tap(page, 'button-05 订单', width, height)
                tap(page, 'phone-order-select', width, height)
                tap(page, f'phone-item-{original}', width, height)
                tap(page, 'phone-order-deliver', width, height)
                before = state(page)
                tap(page, 'button-返回', width, height)
                assert state(page) == before, 'Cancelling order preview changed state'
                tap(page, 'phone-order-deliver', width, height)
                tap(page, 'button-确认执行', width, height)
                idle(page)
                after = state(page)
                assert next(o for o in after['orders'] if o['id'] == 'ORD-001')['status'] == 'done'
                assert after['cash'] == before['cash'] + 50
                assert not any(i['uid'] == original for i in after['inventory'])
                assert any(i['uid'] == 'item-1' for i in after['inventory']), 'Customer order must not consume same-model shop stock'
                page.screenshot(path=str(OUT / 'after-order-receipt.png'))
                # Counter, quote locking, handoff, warehouse and cancellation.
                tap(page, 'button-01 柜台', width, height)
                tap(page, 'button-接待下一位来客', width, height)
                idle(page)
                trade = state(page)['trade']
                assert trade and trade['item']
                uid = trade['item']['uid']
                tap(page, 'button-商量报价', width, height)
                check_targets(page, width, height)
                tap(page, 'phone-offer-minus', width, height)
                # Focus the real Cocos numeric EditBox and submit a typed quote.
                scale = min(width / 1600, height / 900)
                page.touchscreen.tap((width - 1600 * scale) / 2 + 500 * scale,
                                     (height - 900 * scale) / 2 + 308 * scale)
                price_input = page.locator('input:visible')
                price_input.fill(str(max(1, trade['price'] - 11)))
                price_input.press('Enter')
                page.wait_for_timeout(200)
                page.screenshot(path=str(OUT / 'after-negotiation.png'))
                tap(page, 'phone-offer-submit', width, height)
                idle(page)
                if not state(page)['trade']['locked']:
                    tap(page, 'button-接受当前报价', width, height)
                before = state(page)
                assert before['trade']['locked']
                tap(page, 'button-确认钱货交割', width, height)
                idle(page)
                after = state(page)
                assert after['trade'] is None and uid in [i['uid'] for i in after['inventory']]
                assert after['cash'] == before['cash'] - before['trade']['price']
                tap(page, 'button-04 仓储', width, height)
                check_targets(page, width, height)
                tap(page, 'button-扫描当前物件', width, height)
                assert uid in state(page)['scanned']
                page.screenshot(path=str(OUT / 'after-warehouse.png'))
                tap(page, 'button-移动仓位 / 旋转', width, height)
                check_targets(page, width, height)
                tap(page, 'phone-cell-6-3', width, height)
                moved = next(i for i in state(page)['inventory'] if i['uid'] == uid)
                assert (moved['x'], moved['y']) == (6, 3)
                tap(page, 'phone-cargo-details', width, height)
                tap(page, 'button-退回来源方…', width, height)
                before = state(page)
                tap(page, 'button-返回', width, height)
                assert state(page) == before
                tap(page, 'button-菜单', width, height)
                tap(page, 'phone-menu-3', width, height)
                tap(page, 'preference-largeText', width, height)
                tap(page, 'preference-reducedMotion', width, height)
                check_targets(page, width, height)
                page.screenshot(path=str(OUT / 'after-settings-large-text.png'))
                assert page.evaluate("JSON.parse(localStorage.getItem('orbital-prefs-v3')).largeText")
                tap(page, 'button-06 日结', width, height)
                before = state(page)
                tap(page, 'button-返回', width, height)
                assert state(page) == before
                tap(page, 'button-06 日结', width, height)
                tap(page, 'button-确认执行', width, height)
                idle(page)
                assert state(page)['phase'] == 'report'
                page.screenshot(path=str(OUT / 'after-report.png'))
                tap(page, 'phone-next-day', width, height)
                idle(page)
                assert state(page)['day'] == 2 and state(page)['ap'] == 12
                tap(page, 'button-03 维修', width, height)
                tap(page, 'button-组装维护套组…', width, height)
                before = state(page)
                for _ in range(3):
                    tap(page, 'phone-craft-stage', width, height)
                assert state(page)['ap'] == before['ap'], 'Craft staging must not consume AP or stock'
                tap(page, 'phone-craft-confirm', width, height)
                idle(page)
                after = state(page)
                assert not any(i['defId'] in ['ITM-026', 'ITM-027'] for i in after['inventory'])
                assert any(i['defId'] == 'BND-001' for i in after['inventory'])
                assert after['ap'] == before['ap'] - 2
                print('Native six-instrument, repair, exact-original order, trade, stock, cancellation and next-day workflows passed.', flush=True)
            assert not errors, errors
            page.close()
        for name, width, height, mobile in [('desktop', 1440, 900, False), ('portrait', 390, 844, True)]:
            page = browser.new_page(viewport={'width': width, 'height': height},
                                    screen={'width': width, 'height': height},
                                    is_mobile=mobile, has_touch=mobile,
                                    **({'user_agent': PHONE_UA} if mobile else {}))
            page.goto(URL)
            page.wait_for_function('window.__ORBITAL__', timeout=120000)
            page.evaluate("window.__ORBITAL__.open('inspect')")
            page.wait_for_timeout(600)
            page.screenshot(path=str(OUT / f'after-{name}-inspect.png'))
            if mobile:
                before = page.evaluate('window.__ORBITAL__.diagnostics().object')
                bounds = before['bounds']
                scale = 390 / 900
                lx = (844 - 1600 * scale) / 2 + (bounds['x'] + bounds['width'] / 2) * scale
                ly = (bounds['y'] + bounds['height'] / 2) * scale
                session = page.context.new_cdp_session(page)
                session.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': 390-ly, 'y': lx}]})
                session.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': 390-ly, 'y': lx+80*scale}]})
                session.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
                page.wait_for_timeout(200)
                after = page.evaluate('window.__ORBITAL__.diagnostics().object')
                assert abs(after['x'] - before['x'] - 80) < 2, 'Rotated touch drag lost its grab offset'
                c = control(page, 'button-04 仓储')
                scale = 390 / 900
                landscape_x = (844 - 1600 * scale) / 2 + (c['x'] + c['w'] / 2) * scale
                landscape_y = (c['y'] + c['h'] / 2) * scale
                page.touchscreen.tap(390 - landscape_y, landscape_x)
                page.wait_for_timeout(400)
                assert page.evaluate('window.__ORBITAL__.diagnostics().page') == 'warehouse', 'Portrait rotation lost touch coordinates'
                page.screenshot(path=str(OUT / 'after-portrait-warehouse.png'))
                page.set_viewport_size({'width': 844, 'height': 390})
                page.wait_for_timeout(800)
                tap(page, 'button-02 鉴定', 844, 390)
                assert page.evaluate('window.__ORBITAL__.diagnostics().page') == 'inspect', 'Touch failed after rotating back to landscape'
            else:
                c = control(page, 'button-04 仓储')
                assert c['w'] == 130 and c['h'] == 62, 'Desktop unexpectedly switched to phone layout'
            page.close()
        check_pawn(browser)
        browser.close()
    print('Phone touch targets and native navigation passed at 667×375 and 844×390.')


if __name__ == "__main__":
    main()
