"""Exercise the actual mobile Web release through a full merchant visit."""
import argparse
import os
import shutil
from pathlib import Path

from playwright.sync_api import expect, sync_playwright


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
            page.on("console", lambda message: errors.append(message.text) if message.type == "error" and
                    "browser metadata to extension" not in message.text else None)
            page.goto(args.url)
            page.wait_for_function("window.OrbitalTouch?.state?.ready", timeout=90000)
            page.locator('[data-command="start"]').tap()
            page.wait_for_function("!OrbitalTouch.state.title && !OrbitalTouch.state.busy", timeout=15000)
            for _ in range(4):
                page.locator('[data-command="arrive"]').tap()
                page.wait_for_function("OrbitalTouch.state.trade && !OrbitalTouch.state.busy", timeout=15000)
                assert not page.evaluate("OrbitalTouch.state.merchant === true"), "Tutorial customers should arrive first"
                page.locator('#trade-open').tap()
                page.locator('#touch-trade [data-command="refuse"]').tap()
                page.wait_for_function("!OrbitalTouch.state.trade && !OrbitalTouch.state.busy", timeout=15000)
            page.locator('[data-command="arrive"]').tap()
            page.wait_for_function("OrbitalTouch.state.merchant && !OrbitalTouch.state.busy", timeout=15000)
            expect(page.locator('#trade-open')).to_have_text('商人')
            page.screenshot(path=str(args.screenshots / 'merchant-visitor.png'))
            page.locator('#trade-open').tap()
            expect(page.locator('#touch-merchant')).to_be_visible()
            goods = page.locator('#touch-merchant [data-action="merchant_buy"][data-id="MAT-001"]')
            expect(goods).to_be_visible()
            before = page.evaluate('({cash: OrbitalTouch.state.cash, owned: OrbitalTouch.state.merchant_goods[0].owned})')
            goods.tap()
            page.wait_for_function('(cash) => OrbitalTouch.state.cash === cash - 8', arg=before['cash'])
            assert page.evaluate('OrbitalTouch.state.merchant_goods[0].owned') == before['owned'] + 1
            goods.focus()
            page.keyboard.press('Enter')
            page.wait_for_function('(cash) => OrbitalTouch.state.cash === cash - 16', arg=before['cash'])
            expect(goods).to_be_focused()
            page.keyboard.press('Enter')
            page.wait_for_function('(cash) => OrbitalTouch.state.cash === cash - 24', arg=before['cash'])
            for control in page.locator('#touch-merchant button:visible').all():
                box = control.bounding_box()
                assert box['width'] >= 44 and box['height'] >= 44, 'Merchant touch targets must be at least 44 CSS px'
            page.screenshot(path=str(args.screenshots / 'merchant.png'))
            page.set_viewport_size({'width': 667, 'height': 375})
            for control in page.locator('#touch-merchant button:visible').all():
                box = control.bounding_box()
                assert box['width'] >= 44 and box['height'] >= 44 and box['x'] >= 0 and box['x'] + box['width'] <= 667, 'Merchant controls must fit a small landscape screen'
            page.set_viewport_size({'width': 844, 'height': 390})
            page.locator('#merchant-close').tap()
            expect(page.locator('#touch-merchant')).not_to_be_visible()
            page.locator('#trade-open').tap()
            page.wait_for_timeout(1500)
            page.reload()
            page.wait_for_function("window.OrbitalTouch?.state?.ready && OrbitalTouch.state.has_save", timeout=90000)
            page.locator('[data-command="start"]').tap()
            page.wait_for_function("OrbitalTouch.state.merchant && !OrbitalTouch.state.title && !OrbitalTouch.state.busy", timeout=15000)
            assert page.evaluate('OrbitalTouch.state.merchant_goods[0].owned') == before['owned'] + 3, 'Reload must retain the purchased supplies'
            assert page.evaluate('OrbitalTouch.state.merchant_goods[0].available') == 2, 'Reload must not refresh merchant stock'
            page.locator('#trade-open').tap()
            page.locator('#merchant-leave').tap()
            page.wait_for_function("!OrbitalTouch.state.trade && !OrbitalTouch.state.busy", timeout=15000)
            page.locator('#touch-nav [data-command="page"][data-page="warehouse"]').tap()
            page.wait_for_function("OrbitalTouch.state.workspace === 'warehouse'")
            canvas = page.locator('#canvas').bounding_box()
            page.touchscreen.tap(canvas['x'] + canvas['width'] * 0.283, canvas['y'] + canvas['height'] * 0.254)
            page.wait_for_function("!!OrbitalTouch.state.forge_uid", timeout=10000)
            expect(page.locator('#touch-forge')).to_be_enabled()
            page.locator('#touch-forge').tap()
            expect(page.locator('#touch-forge-dialog')).to_be_visible()
            before_ap = page.evaluate('OrbitalTouch.state.ap')
            page.locator('#forge-confirm').tap()
            page.wait_for_function('OrbitalTouch.state.forge_done === true', timeout=10000)
            assert page.evaluate('OrbitalTouch.state.ap') == before_ap - 1
            expect(page.locator('#touch-forge')).to_be_disabled()
            page.screenshot(path=str(args.screenshots / 'forgery.png'))
            assert not errors, 'Browser/Godot errors: ' + '\n'.join(errors[:10])
            print('PHONE MERCHANT actual visit, purchase, departure and forgery pass')
        finally:
            browser.close()


if __name__ == '__main__':
    main()
