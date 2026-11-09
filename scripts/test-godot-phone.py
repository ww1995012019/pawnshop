"""Exercise the built Web UI with a real touch-enabled Chromium context."""
import argparse
import os
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright, expect


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("url", nargs="?", default="http://127.0.0.1:4174/")
    parser.add_argument("--portrait-only", action="store_true")
    parser.add_argument("--screenshots", type=Path, default=Path('work/godot-phone'))
    args = parser.parse_args()
    args.screenshots.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get("CHROMIUM_EXECUTABLE") or shutil.which("chromium"), args=[
            "--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
        try:
            context = browser.new_context(viewport={"width":390,"height":844}, device_scale_factor=2, has_touch=True, is_mobile=True)
            page = context.new_page()
            downloads = []
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.on("console", lambda message: errors.append(message.text) if
                    (message.type == 'error' or 'SCRIPT ERROR' in message.text) and
                    'browser metadata to extension' not in message.text else None)
            page.on("request", lambda request: downloads.append(request.url) if ".wasm" in request.url or ".pck" in request.url else None)
            page.goto(args.url)
            expect(page.get_by_role("heading", name="横过来，柜台更好操作")).to_be_visible(timeout=4000)
            page.screenshot(path=str(args.screenshots / '01-portrait-guide.png'))
            assert not downloads, "Portrait entry must defer the large engine and pack download"
            if args.portrait_only:
                print("PHONE portrait guide passes; engine download is deferred")
                return
            page.set_viewport_size({"width":844,"height":390})
            page.wait_for_function("window.OrbitalTouch?.state?.ready", timeout=90000)
            expect(page.get_by_role("heading", name="横过来，柜台更好操作")).not_to_be_visible()
            page.locator('[data-command="start"]').tap()
            page.wait_for_function("!window.OrbitalTouch.state.title && !window.OrbitalTouch.state.busy")
            page.screenshot(path=str(args.screenshots / '02-landscape-controls.png'))
            for button in page.locator('#touch-nav button:visible').all():
                box = button.bounding_box()
                assert box["width"] >= 44 and box["height"] >= 44, "Touch targets must be at least 44 CSS px"
            page.locator('[data-command="arrive"]').tap()
            page.wait_for_function("window.OrbitalTouch.state.trade && !window.OrbitalTouch.state.busy",timeout=15000)
            price = page.evaluate("window.OrbitalTouch.state.price")
            page.locator('#trade-open').tap()
            expect(page.locator('#trade-accept')).to_contain_text(str(price))
            page.screenshot(path=str(args.screenshots / '03-large-trade-controls.png'))
            page.locator('#trade-offer-input').fill('1')
            page.locator('#trade-offer-input').dispatch_event('change')
            page.wait_for_function("window.OrbitalTouch.state.offer === 1")
            expect(page.locator('#trade-accept')).to_contain_text(str(price))
            page.locator('[data-nudge="1"]').tap()
            page.locator('[data-nudge="1"]').tap()
            page.wait_for_function("window.OrbitalTouch.state.offer === 3")
            page.locator('#trade-offer-input').fill('1')
            page.locator('#trade-offer-input').dispatch_event('change')
            page.wait_for_function("window.OrbitalTouch.state.offer === 1")
            page.locator('#trade-close').tap()
            page.locator('[data-command="page"][data-page="inspect"]').tap()
            page.wait_for_function("window.OrbitalTouch.state.workspace === 'inspect'")
            page.wait_for_timeout(300)
            selector = page.locator('#touch-tools select')
            available = page.evaluate('window.OrbitalTouch.state.inspection_tools')
            for tool in ('TOL-004', 'TOL-006'):
                assert selector.locator(f'option[value="{tool}"]').is_disabled() == (tool not in available), 'Phone selector must match the item’s applicable tests'
            ap_before_test = page.evaluate('window.OrbitalTouch.state.ap')
            selector.select_option('SPEC')
            page.wait_for_function("window.OrbitalTouch.state.inspection_current === 'SPEC' && !!window.OrbitalTouch.state.specific_next")
            page.evaluate("""() => {
              window.__savedTouchState = window.OrbitalTouch.state;
              window.OrbitalTouch.update({...window.__savedTouchState, specific_allowed:false, specific_reason:'行动点不足'});
            }""")
            expect(page.locator('#touch-specific')).to_be_disabled()
            expect(page.locator('#touch-specific')).to_have_text('行动点不足')
            page.evaluate('window.OrbitalTouch.update(window.__savedTouchState)')
            first_step = page.evaluate('window.OrbitalTouch.state.specific_next')
            page.evaluate("""() => {
              const s = window.OrbitalTouch.state;
              const command = JSON.stringify({type:'specific_step', uid:s.specific_uid, index:s.specific_index});
              for (let i = 0; i < 3; i++) window.orbitalTouchSend(command);
            }""")
            page.wait_for_function('(step) => window.OrbitalTouch.state.specific_next !== step', arg=first_step)
            assert page.evaluate('window.OrbitalTouch.state.ap') == ap_before_test, 'Repeated commands must not skip inspection steps'
            steps = [first_step]
            for _ in range(2):
                step = page.evaluate('window.OrbitalTouch.state.specific_next')
                steps.append(step)
                button = page.locator('#touch-specific')
                expect(button).to_be_visible()
                box = button.bounding_box()
                assert box['width'] >= 44 and box['height'] >= 44, 'Specific inspection needs an accessible touch target'
                button.tap()
                page.wait_for_function('(step) => window.OrbitalTouch.state.specific_next !== step', arg=step)
            assert len(set(steps)) == 3, 'The item must have three distinct operations'
            assert page.evaluate('window.OrbitalTouch.state.ap') == ap_before_test - 1, 'Completing a specific test spends one AP'
            expect(page.locator('#touch-specific')).to_be_hidden()
            page.evaluate("window.orbitalTouchSend(JSON.stringify({type:'tool', tool:'TOL-001'}))")
            page.wait_for_function("window.OrbitalTouch.state.inspection_current === 'TOL-001'")
            expect(selector).to_have_value('TOL-001')
            page.evaluate("window.orbitalTouchSend(JSON.stringify({type:'settings'}))")
            page.wait_for_function("window.OrbitalTouch.state.blocked")
            expect(selector).to_be_disabled()
            page.evaluate("window.orbitalTouchSend(JSON.stringify({type:'close'}))")
            page.wait_for_function("!window.OrbitalTouch.state.blocked")
            expect(selector).to_be_enabled()
            selector.select_option('')
            page.wait_for_function("window.OrbitalTouch.state.inspection_current === ''")
            expect(selector).to_have_value('')
            canvas = page.locator('#canvas').bounding_box()
            toolbar = page.locator('#touch-nav').bounding_box()
            tools = page.locator('#touch-tools').bounding_box()
            assert canvas['y'] + canvas['height'] <= toolbar['y'] + 1, 'Phone toolbar covers the instrument controls'
            assert tools['y'] >= toolbar['y'], 'Instrument picker must share the reserved toolbar area'
            pixels = page.evaluate('({width:canvas.width,height:canvas.height,ratio:devicePixelRatio})')
            assert abs(pixels['width'] - canvas['width'] * pixels['ratio']) <= 1, 'Canvas pixel width does not match the display'
            assert abs(pixels['height'] - canvas['height'] * pixels['ratio']) <= 1, 'Canvas pixel height does not match the display'
            page.screenshot(path=str(args.screenshots / '04-unobstructed-inspection.png'))
            for width, height in [(740, 360), (667, 375)]:
                page.set_viewport_size({'width': width, 'height': height})
                page.wait_for_timeout(350)
                canvas = page.locator('#canvas').bounding_box()
                toolbar = page.locator('#touch-nav').bounding_box()
                assert canvas['y'] + canvas['height'] <= toolbar['y'] + 1, 'Small-phone toolbar covers the game'
                for control in page.locator('#touch-nav button:visible, #touch-nav select:visible').all():
                    box = control.bounding_box()
                    assert box['x'] >= 0 and box['x'] + box['width'] <= width, 'Phone control extends outside the screen'
                    assert box['width'] >= 44 and box['height'] >= 44, 'Small-phone target is too small'
                page.screenshot(path=str(args.screenshots / f'05-inspection-{width}.png'))
            page.set_viewport_size({'width': 844, 'height': 390})
            page.locator('[data-command="page"][data-page="repair"]').tap()
            page.wait_for_function("window.OrbitalTouch.state.workspace === 'repair'")
            page.wait_for_timeout(700)
            cash = page.evaluate('window.OrbitalTouch.state.cash')
            ap = page.evaluate('window.OrbitalTouch.state.ap')
            page.evaluate("window.orbitalTouchSend(JSON.stringify({type:'merchant_buy', id:'MAT-001'}))")
            page.wait_for_timeout(350)
            assert page.evaluate('window.OrbitalTouch.state.cash') == cash, 'Materials cannot be purchased without the merchant'
            assert page.evaluate('window.OrbitalTouch.state.ap') == ap, 'Blocked purchases must not consume AP'
            page.locator('[data-command="close"]').tap()
            page.wait_for_function("window.OrbitalTouch.state.workspace === ''")
            assert page.evaluate("window.OrbitalTouch.state.offer") == 1, "Drawer must preserve draft"
            page.set_viewport_size({"width":390,"height":844})
            expect(page.get_by_role("heading", name="横过来，柜台更好操作")).to_be_visible()
            page.set_viewport_size({"width":844,"height":390})
            page.wait_for_function("window.OrbitalTouch.state.offer === 1")
            page.locator('#trade-open').tap()
            page.locator('#touch-trade [data-command="refuse"]').tap()
            page.wait_for_function("!window.OrbitalTouch.state.trade && !window.OrbitalTouch.state.busy",timeout=15000)
            page.locator('[data-command="arrive"]').tap()
            page.wait_for_function("window.OrbitalTouch.state.trade && !window.OrbitalTouch.state.busy",timeout=15000)
            assert not page.evaluate("window.OrbitalTouch.state.has_item"), "Second customer should be waiting for sale goods"
            page.locator('#trade-open').tap()
            expect(page.locator('#trade-price')).to_contain_text('待选货')
            expect(page.locator('#trade-cash')).to_be_hidden()
            expect(page.locator('#trade-offer')).to_be_hidden()
            page.get_by_role('button',name='去仓储选货').tap()
            page.wait_for_function("window.OrbitalTouch.state.workspace === 'warehouse'")
            assert not errors, 'Browser/Godot errors: ' + '\n'.join(errors[:10])
            print("PHONE orientation, large targets, real trade commands and preserved drawer state pass")
        finally:
            browser.close()


if __name__ == "__main__":
    main()
