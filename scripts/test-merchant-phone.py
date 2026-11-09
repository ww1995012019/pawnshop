"""Play a full merchant visit on a touch phone using only in-scene controls."""
import argparse
import importlib.util
import os
import shutil
from pathlib import Path

from playwright.sync_api import sync_playwright

_spec = importlib.util.spec_from_file_location("phone", Path(__file__).with_name("test-godot-phone.py"))
phone = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(phone)
tap, locate, state, wait = phone.tap, phone.locate, phone.state, phone.wait


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("url", nargs="?", default="http://127.0.0.1:4174/")
    parser.add_argument("--screenshots", type=Path, default=Path("work/merchant-phone"))
    args = parser.parse_args()
    args.screenshots.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get("CHROMIUM_EXECUTABLE") or shutil.which("chromium"),
            args=["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
        try:
            context = browser.new_context(viewport={"width": 844, "height": 390}, device_scale_factor=2,
                                          has_touch=True, is_mobile=True)
            page = context.new_page()
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.on("console", lambda message: errors.append(message.text) if
                    (message.type == "error" or "SCRIPT ERROR" in message.text) and
                    "browser metadata to extension" not in message.text else None)
            page.goto(args.url)
            page.wait_for_function("window.OrbitalTouch?.state?.ready", timeout=90000)
            page.wait_for_timeout(800)
            tap(page, '营业')
            wait(page, "!s.title && !s.busy")
            for _ in range(4):
                tap(page, '接客铃')
                wait(page, "s.trade && !s.busy")
                assert not state(page, 'merchant'), "Tutorial customers should arrive first"
                tap(page, '送客')
                wait(page, "!s.trade && !s.busy")
            tap(page, '接客铃')
            wait(page, "s.merchant && !s.busy")
            page.screenshot(path=str(args.screenshots / 'merchant-visitor.png'))
            cash_at_arrival = state(page, 'cash')
            tap(page, '维修工作台')
            wait(page, "s.workspace === 'repair'")
            page.evaluate("window.orbitalTouchSend(JSON.stringify({type:'merchant_buy', id:'MAT-001'}))")
            page.wait_for_timeout(350)
            assert state(page, 'cash') == cash_at_arrival, 'A workspace must block counter purchases'
            tap(page, '收起')
            wait(page, "s.workspace === ''")

            tap(page, '查看商品')
            page.wait_for_timeout(500)
            good = page.evaluate('OrbitalTouch.state.merchant_goods[0]')
            before = {'cash': state(page, 'cash'), 'owned': good['owned']}
            target = locate(page, f"购买 {good['name']}")
            assert target['width'] >= 44 and target['height'] >= 18, 'Merchant goods need a usable touch target'
            for bought in range(1, 4):
                tap(page, f"购买 {good['name']}")
                page.wait_for_function('(cash) => OrbitalTouch.state.cash === cash', arg=before['cash'] - 8 * bought)
            assert page.evaluate('OrbitalTouch.state.merchant_goods[0].owned') == before['owned'] + 3
            page.screenshot(path=str(args.screenshots / 'merchant.png'))
            tap(page, '关闭')
            wait(page, "!s.blocked")
            page.wait_for_timeout(1500)
            page.reload()
            page.wait_for_function("window.OrbitalTouch?.state?.ready && OrbitalTouch.state.has_save", timeout=90000)
            page.wait_for_timeout(800)
            tap(page, '继续营业')
            wait(page, "s.merchant && !s.title && !s.busy")
            assert page.evaluate('OrbitalTouch.state.merchant_goods[0].owned') == before['owned'] + 3, 'Reload must retain the purchased supplies'
            assert page.evaluate('OrbitalTouch.state.merchant_goods[0].available') == 2, 'Reload must not refresh merchant stock'
            tap(page, '送客')
            wait(page, "!s.trade && !s.busy")

            tap(page, '仓储 · 隔离柜')
            wait(page, "s.workspace === 'warehouse'")
            page.wait_for_timeout(600)
            page.touchscreen.tap(116, 126)
            wait(page, "!!s.forge_uid", 10000)
            before_ap = state(page, 'ap')
            # The printed custody card makes the action list scroll on phones.
            # Locate reports geometry even for a control clipped by its scroller.
            page.mouse.move(690, 250)
            page.mouse.wheel(0, 900)
            page.wait_for_timeout(400)
            forge_target = locate(page, '伪装造假')
            assert 60 < forge_target['y'] < 330, 'Forgery control must be reachable by scrolling'
            tap(page, '伪装造假')
            page.wait_for_timeout(400)
            tap(page, '重描标识')
            page.wait_for_timeout(400)
            tap(page, '确认重描标识')
            wait(page, "s.forge_done === true", 10000)
            assert state(page, 'ap') == before_ap - 1
            page.screenshot(path=str(args.screenshots / 'forgery.png'))
            assert not errors, 'Browser/Godot errors: ' + '\n'.join(errors[:10])
            print('PHONE MERCHANT in-scene visit, purchase, departure and forgery pass')
        finally:
            browser.close()


if __name__ == '__main__':
    main()
