"""Play the built Web game on a touch phone using only the in-scene controls."""
import argparse
import os
import shutil
from pathlib import Path
from playwright.sync_api import sync_playwright, expect

PHONES = [(844, 390), (932, 430), (740, 360), (667, 375), (568, 320)]


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


def locate(page, text):
    """Find a visible in-game button by its label or tooltip (CSS pixels)."""
    page.evaluate("t => { window.__orbitalLocated = null; window.orbitalTouchSend(JSON.stringify({type:'locate', text:t})); }", text)
    page.wait_for_function("window.__orbitalLocated !== null")
    found = page.evaluate("window.__orbitalLocated")
    assert found['found'], f'No visible in-game button for {text!r}'
    return found


def tap(page, text):
    target = locate(page, text)
    assert not target['disabled'], f'{text!r} is disabled'
    page.touchscreen.tap(target['x'], target['y'])
    return target


def state(page, expression):
    return page.evaluate(f"window.OrbitalTouch.state.{expression}")


def wait(page, condition, timeout=15000):
    page.wait_for_function(f"(() => {{ const s = window.OrbitalTouch.state; return {condition}; }})()", timeout=timeout)


def assert_full_screen(page, width, height):
    # Resize/render callbacks can span several frames on a busy software GPU.
    page.wait_for_function("""([width,height]) => {
        const element=document.getElementById('canvas'), rect=element.getBoundingClientRect();
        return Math.abs(rect.width-width)<=1 && Math.abs(rect.height-height)<=1 &&
            Math.abs(element.width-rect.width*devicePixelRatio)<=1 &&
            Math.abs(element.height-rect.height*devicePixelRatio)<=1;
    }""", arg=[width,height], timeout=6000)
    assert page.locator('#touch-nav').count() == 0, 'Phones must not show a separate Web toolbar'
    canvas = page.locator('#canvas').bounding_box()
    assert canvas['x'] == 0 and canvas['y'] == 0, 'The game canvas must start at the screen corner'
    assert abs(canvas['width'] - width) <= 1 and abs(canvas['height'] - height) <= 1, 'The game must fill the whole phone screen'
    pixels = page.evaluate('({width:canvas.width,height:canvas.height,ratio:devicePixelRatio})')
    assert abs(pixels['width'] - canvas['width'] * pixels['ratio']) <= 1, 'Canvas pixel width does not match the display'
    assert abs(pixels['height'] - canvas['height'] * pixels['ratio']) <= 1, 'Canvas pixel height does not match the display'


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
            # Upright phones use native portrait UI and unrotated touch coordinates.
            page.wait_for_function("window.OrbitalTouch?.state?.ready", timeout=90000)
            assert downloads, "Portrait entry must start loading the game at once"
            assert page.locator('#phone-guide').count() == 0, 'Phones must not show a rotate prompt'
            assert not page.evaluate("window.OrbitalTouch.turned()"), 'Portrait UI must remain upright'
            pixels = page.evaluate('({width:canvas.width,height:canvas.height,ratio:devicePixelRatio})')
            assert pixels['width'] == 390 * pixels['ratio'] and pixels['height'] == 844 * pixels['ratio'], 'Upright phones render a portrait canvas'
            box = page.locator('#canvas').bounding_box()
            assert abs(box['width'] - 390) <= 1 and abs(box['height'] - 844) <= 1, 'The portrait game must fill the upright screen'
            page.wait_for_timeout(800)
            page.screenshot(path=str(args.screenshots / '01-portrait-counter.png'))
            target = locate(page, '营业')
            page.touchscreen.tap(target['x'], target['y'])
            wait(page, "!s.title && !s.busy")
            if args.portrait_only:
                print("PHONE native portrait start and direct touch coordinates pass")
                return
            page.reload()
            page.wait_for_function("window.OrbitalTouch?.state?.ready", timeout=90000)
            page.set_viewport_size({"width":844,"height":390})
            page.wait_for_function("!window.OrbitalTouch.turned()")
            assert_full_screen(page, 844, 390)
            page.wait_for_timeout(800)
            tap(page, '营业')
            wait(page, "!s.title && !s.busy")
            page.screenshot(path=str(args.screenshots / '02-landscape-counter.png'))

            # The counter's own fixtures drive the day: bell, instruments, drawers.
            # The till's own button is only a few millimetres tall on a phone: a
            # finger landing just above it must still press it.
            small = locate(page, '接待下一位来客')
            assert small['height'] < 24, f"Expected a small till button, got {small['height']:.0f} CSS px"
            page.touchscreen.tap(small['x'], small['y'] - small['height'] / 2 - 8)
            wait(page, "s.trade && !s.busy")
            price = state(page, 'price')
            assert locate(page, '接受')['label'].endswith(f'{price} Cr'), 'The quote console must show the asking price'
            page.evaluate("window.orbitalTouchSend(JSON.stringify({type:'quote', value:1}))")
            wait(page, "s.offer === 1")
            page.screenshot(path=str(args.screenshots / '03-trade.png'))
            tap(page, '鉴定仪')
            wait(page, "s.workspace === 'inspect'")
            page.wait_for_timeout(500)
            fill = workbench_width_fraction(page)
            assert fill >= 0.82, f'Landscape workspace is too small: {fill:.1%} of screen width'
            page.screenshot(path=str(args.screenshots / '04-inspection.png'))
            for width, height in PHONES[1:]:
                page.set_viewport_size({'width': width, 'height': height})
                page.wait_for_timeout(350)
                assert_full_screen(page, width, height)
                fill = workbench_width_fraction(page)
                assert fill >= 0.82, f'{width}px phone workspace is too small: {fill:.1%} of screen width'
                page.screenshot(path=str(args.screenshots / f'05-inspection-{width}.png'))
            page.set_viewport_size({'width': 844, 'height': 390})
            page.wait_for_timeout(350)
            uid = state(page, 'inspection_uid')
            page.set_viewport_size({'width': 390, 'height': 844})
            page.wait_for_function("!window.OrbitalTouch.turned() && canvas.width < canvas.height")
            page.set_viewport_size({'width': 844, 'height': 390})
            page.wait_for_function("!window.OrbitalTouch.turned()")
            wait(page, f"s.workspace === 'inspect' && s.inspection_uid === {uid!r}")
            page.wait_for_timeout(350)
            tap(page, '收起')
            wait(page, "s.workspace === ''")
            assert state(page, 'trade') and state(page, 'offer') == 1, 'Closing a drawer must keep the visitor and draft'

            tap(page, '维修工作台')
            wait(page, "s.workspace === 'repair'")
            page.wait_for_timeout(500)
            repair_uid = state(page, 'repair_uid')
            page.screenshot(path=str(args.screenshots / '06-repair.png'))
            tap(page, '去鉴定')
            wait(page, f"s.workspace === 'inspect' && s.inspection_uid === {repair_uid!r}", 10000)
            tap(page, '收起')
            wait(page, "s.workspace === ''")

            tap(page, '送客')
            wait(page, "!s.trade && !s.busy")
            tap(page, '仓储 · 隔离柜')
            wait(page, "s.workspace === 'warehouse'")
            page.wait_for_timeout(600)
            page.touchscreen.tap(116, 126)
            wait(page, "s.warehouse_can_rotate", 10000)
            rotated = state(page, 'warehouse_rotated')
            ap = state(page, 'ap')
            page.screenshot(path=str(args.screenshots / '07-warehouse.png'))
            tap(page, '旋转方向')
            wait(page, f"s.warehouse_rotated !== {str(rotated).lower()}")
            assert state(page, 'ap') == ap, 'Rotating stock must not spend AP'
            touch_drag(context, page, [(420, y) for y in range(300, 139, -10)])
            assert state(page, 'workspace') == 'warehouse', 'Swiping empty cells must not close the drawer'
            tap(page, '收起')
            wait(page, "s.workspace === ''")
            assert not errors, 'Browser/Godot errors: ' + '\n'.join(errors[:10])
            print("PHONE full-screen counter, in-scene controls, drawers and rotation pass")
        finally:
            browser.close()


if __name__ == "__main__":
    main()
