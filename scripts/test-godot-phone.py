"""Exercise the built Web UI with a real touch-enabled Chromium context."""
import argparse
import os
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright, expect


def workbench_width_fraction(page):
    """Measure the drawn drawer's top border in the actual WebGL canvas."""
    return page.evaluate("""() => {
      const source = document.querySelector('#canvas');
      const copy = document.createElement('canvas');
      copy.width = source.width; copy.height = source.height;
      const ctx = copy.getContext('2d', {willReadFrequently: true});
      ctx.drawImage(source, 0, 0);
      const data = ctx.getImageData(0, 0, copy.width, copy.height).data;
      let longest = 0;
      for (let y = 0; y < copy.height / 3; y++) {
        let run = 0;
        for (let x = 0; x < copy.width; x++) {
          const i = (y * copy.width + x) * 4;
          if (data[i] === 156 && data[i+1] === 128 && data[i+2] === 100) {
            longest = Math.max(longest, ++run);
          } else run = 0;
        }
      }
      return longest / copy.width;
    }""")


def storage_pixels(page):
    """Sample the storage grid as rendered, at CSS-pixel resolution."""
    return page.evaluate("""() => {
      const source = document.querySelector('#canvas');
      const copy = document.createElement('canvas');
      copy.width = source.clientWidth; copy.height = source.clientHeight;
      const ctx = copy.getContext('2d', {willReadFrequently: true});
      ctx.drawImage(source, 0, 0, copy.width, copy.height);
      const data = ctx.getImageData(125, 82, 325, 190).data;
      const samples = [];
      for (let y = 0; y < 190; y += 4) for (let x = 0; x < 325; x += 4) {
        const i = (y * 325 + x) * 4;
        samples.push((data[i] << 16) | (data[i+1] << 8) | data[i+2]);
      }
      return samples;
    }""")


def apart(a, b):
    """True when two boxes do not overlap (toolbar beside or below the canvas)."""
    return (a['x'] + a['width'] <= b['x'] + 1 or b['x'] + b['width'] <= a['x'] + 1 or
            a['y'] + a['height'] <= b['y'] + 1 or b['y'] + b['height'] <= a['y'] + 1)


def touch_drag(context, page, points):
    cdp = context.new_cdp_session(page)
    x, y = points[0]
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchStart', 'touchPoints': [{'x': x, 'y': y}]})
    for x, y in points[1:]:
        cdp.send('Input.dispatchTouchEvent', {'type': 'touchMove', 'touchPoints': [{'x': x, 'y': y}]})
        page.wait_for_timeout(40)
    cdp.send('Input.dispatchTouchEvent', {'type': 'touchEnd', 'touchPoints': []})
    page.wait_for_timeout(500)


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
            page.wait_for_timeout(500)
            fill = workbench_width_fraction(page)
            assert fill >= 0.82, f'Landscape workspace is too small: {fill:.1%} of screen width'
            page.locator('#touch-detail-open').tap()
            detail_title = page.evaluate('window.OrbitalTouch.state.detail_title')
            expect(page.locator('#touch-detail-title')).to_have_text(detail_title)
            assert page.locator('#touch-detail-lines p').count() > 0, 'Phone inspection details must be readable'
            assert page.locator('#touch-detail-lines p').first.evaluate('(p) => parseFloat(getComputedStyle(p).fontSize)') >= 14
            page.screenshot(path=str(args.screenshots / '04-inspection-details.png'))
            page.locator('#touch-detail-close').tap()
            selector = page.locator('#touch-tools select')
            available = page.evaluate('window.OrbitalTouch.state.inspection_tools')
            for tool in ('TOL-004', 'TOL-006'):
                assert selector.locator(f'option[value="{tool}"]').is_disabled() == (tool not in available), 'Phone selector must match the item’s applicable tests'
            ap_before_test = page.evaluate('window.OrbitalTouch.state.ap')
            selector.select_option('SPEC')
            page.wait_for_function("window.OrbitalTouch.state.inspection_current === 'SPEC' && !!window.OrbitalTouch.state.specific_next")
            for width, height in [(667, 375), (568, 320)]:
                page.set_viewport_size({'width': width, 'height': height})
                page.wait_for_timeout(350)
                assert page.locator('#touch-nav').bounding_box()['height'] <= 64, 'Specific-test controls should not occupy two rows on a phone'
                for control in page.locator('#touch-nav button:visible, #touch-nav select:visible').all():
                    box = control.bounding_box()
                    assert box['x'] >= 0 and box['x'] + box['width'] <= width, 'Specific-test control must stay reachable on small phones'
            page.set_viewport_size({'width': 844, 'height': 390})
            page.wait_for_timeout(350)
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
            assert apart(canvas, toolbar), 'Phone toolbar covers the instrument controls'
            assert apart(canvas, tools), 'Instrument picker must share the reserved toolbar area'
            assert page.evaluate("document.getElementById('touch-nav').classList.contains('rail')"), 'A wide phone should use the side rail'
            assert canvas['height'] >= 389, 'The side rail must give the shop the full screen height'
            pixels = page.evaluate('({width:canvas.width,height:canvas.height,ratio:devicePixelRatio})')
            assert abs(pixels['width'] - canvas['width'] * pixels['ratio']) <= 1, 'Canvas pixel width does not match the display'
            assert abs(pixels['height'] - canvas['height'] * pixels['ratio']) <= 1, 'Canvas pixel height does not match the display'
            page.screenshot(path=str(args.screenshots / '04-unobstructed-inspection.png'))
            for width, height in [(932, 430), (740, 360), (667, 375), (568, 320)]:
                page.set_viewport_size({'width': width, 'height': height})
                page.wait_for_timeout(350)
                canvas = page.locator('#canvas').bounding_box()
                toolbar = page.locator('#touch-nav').bounding_box()
                assert apart(canvas, toolbar), 'Small-phone toolbar covers the game'
                fill = workbench_width_fraction(page)
                assert fill >= 0.82, f'{width}px phone workspace is too small: {fill:.1%} of screen width'
                for control in page.locator('#touch-nav button:visible, #touch-nav select:visible').all():
                    box = control.bounding_box()
                    assert box['x'] >= 0 and box['x'] + box['width'] <= width, 'Phone control extends outside the screen'
                    assert box['width'] >= 44 and box['height'] >= 44, 'Small-phone target is too small'
                page.screenshot(path=str(args.screenshots / f'05-inspection-{width}.png'))
            focused_uid = page.evaluate('window.OrbitalTouch.state.specific_uid')
            page.set_viewport_size({'width': 375, 'height': 667})
            expect(page.get_by_role('heading', name='横过来，柜台更好操作')).to_be_visible()
            page.set_viewport_size({'width': 844, 'height': 390})
            expect(page.get_by_role('heading', name='横过来，柜台更好操作')).not_to_be_visible()
            page.wait_for_function("(uid) => window.OrbitalTouch.state.workspace === 'inspect' && window.OrbitalTouch.state.specific_uid === uid", arg=focused_uid)
            page.wait_for_timeout(350)
            assert workbench_width_fraction(page) >= 0.82, 'Returning to landscape restores the compact workspace'
            page.locator('[data-command="page"][data-page="repair"]').tap()
            page.wait_for_function("window.OrbitalTouch.state.workspace === 'repair'")
            page.wait_for_timeout(500)
            repair_uid = page.evaluate('window.OrbitalTouch.state.repair_uid')
            cash = page.evaluate('window.OrbitalTouch.state.cash')
            ap = page.evaluate('window.OrbitalTouch.state.ap')
            page.locator('#repair-supplies-open').tap(timeout=5000)
            expect(page.get_by_role('heading', name='维修材料')).to_be_visible()
            expect(page.locator('#repair-supplies')).to_contain_text('商人上门时才能购买')
            expect(page.locator('#repair-supplies [data-material="MAT-001"]')).to_contain_text('×')
            assert page.locator('#repair-supplies-list button').count() == 0, 'Repair inventory must not offer direct purchases'
            page.evaluate("window.orbitalTouchSend(JSON.stringify({type:'merchant_buy', id:'MAT-001'}))")
            page.evaluate("(uid) => window.orbitalTouchSend(JSON.stringify({type:'buy_repair_material', uid, id:'MAT-001'}))", repair_uid)
            page.wait_for_timeout(350)
            assert page.evaluate('window.OrbitalTouch.state.cash') == cash, 'Materials cannot be purchased without the merchant'
            assert page.evaluate('window.OrbitalTouch.state.ap') == ap, 'Blocked purchases must not consume AP'
            page.locator('#repair-supplies-close').tap()
            page.locator('#touch-detail-open').tap()
            expect(page.locator('#detail-repair')).to_be_disabled()
            page.set_viewport_size({'width': 568, 'height': 320})
            page.wait_for_timeout(350)
            reason = page.locator('#touch-detail-lines p').nth(1)
            expect(reason).to_contain_text('先去鉴定')
            assert reason.bounding_box()['y'] + reason.bounding_box()['height'] <= page.locator('#touch-detail-actions').bounding_box()['y'], 'Repair prerequisite must be visible above the actions on a short screen'
            page.screenshot(path=str(args.screenshots / '05-repair-details.png'))
            page.set_viewport_size({'width': 844, 'height': 390})
            page.locator('#detail-supplies').tap()
            expect(page.get_by_role('heading', name='维修材料')).to_be_visible()
            page.locator('#repair-supplies-close').tap()
            page.locator('#touch-detail-open').tap()
            page.locator('#detail-inspect').tap()
            page.wait_for_function("(uid) => window.OrbitalTouch.state.workspace === 'inspect' && window.OrbitalTouch.state.specific_uid === uid", arg=repair_uid, timeout=10000)
            page.locator('[data-command="page"][data-page="repair"]').tap()
            page.wait_for_function("window.OrbitalTouch.state.workspace === 'repair'")
            page.wait_for_timeout(300)
            canvas = page.locator('#canvas').bounding_box()
            page.screenshot(path=str(args.screenshots / '06-repair-workspace.png'))
            page.touchscreen.tap(canvas['x'] + canvas['width'] * 0.9, canvas['y'] + canvas['height'] * 0.477)
            page.wait_for_function("(uid) => window.OrbitalTouch.state.workspace === 'inspect' && window.OrbitalTouch.state.specific_uid === uid", arg=repair_uid, timeout=10000)
            page.locator('[data-command="page"][data-page="repair"]').tap()
            page.wait_for_function("window.OrbitalTouch.state.workspace === 'repair'")
            page.locator('[data-command="page"][data-page="inspect"]').tap()
            page.wait_for_function("(uid) => window.OrbitalTouch.state.workspace === 'inspect' && window.OrbitalTouch.state.specific_uid === uid", arg=repair_uid)
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
            page.wait_for_timeout(600)
            # Wide phones fit the whole storage panel beside the side rail; a
            # shorter bottom-bar layout still has to scroll to the lower lists.
            page.set_viewport_size({'width': 740, 'height': 400})
            page.wait_for_timeout(600)
            assert not page.evaluate("document.getElementById('touch-nav').classList.contains('rail')")
            page.screenshot(path=str(args.screenshots / '06-warehouse.png'))
            # A prior selection must not capture later swipes on empty cells.
            page.touchscreen.tap(103, 110)
            page.wait_for_timeout(400)
            before_scroll = storage_pixels(page)
            touch_drag(context, page, [(380, y) for y in range(250, 89, -10)])
            after_scroll = storage_pixels(page)
            changed = sum(a != b for a, b in zip(before_scroll, after_scroll)) / len(before_scroll)
            assert changed > 0.10, 'Swiping empty storage cells must reveal the lower storage lists'
            page.screenshot(path=str(args.screenshots / '06-warehouse-scrolled.png'))
            page.locator('#touch-nav [data-command="close"]').tap()
            page.wait_for_function("!window.OrbitalTouch.state.workspace")
            page.locator('#touch-nav [data-command="page"][data-page="warehouse"]').tap()
            page.wait_for_function("window.OrbitalTouch.state.workspace === 'warehouse'")
            page.wait_for_timeout(600)
            touch_drag(context, page, [(103 + i * 10, 110 + i * 6) for i in range(18)])
            page.wait_for_function("window.OrbitalTouch.state.warehouse_can_rotate")
            rotated = page.evaluate('window.OrbitalTouch.state.warehouse_rotated')
            ap = page.evaluate('window.OrbitalTouch.state.ap')
            page.locator('#touch-rotate').tap()
            page.wait_for_function('(old) => window.OrbitalTouch.state.warehouse_rotated !== old', arg=rotated)
            assert page.evaluate('window.OrbitalTouch.state.ap') == ap, 'Rotating stock must not spend AP'
            assert not errors, 'Browser/Godot errors: ' + '\n'.join(errors[:10])
            print("PHONE orientation, large targets, real trade commands and preserved drawer state pass")
        finally:
            browser.close()


if __name__ == "__main__":
    main()
