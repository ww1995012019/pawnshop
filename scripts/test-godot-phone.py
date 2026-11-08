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
            context = browser.new_context(viewport={"width":390,"height":844}, has_touch=True, is_mobile=True)
            page = context.new_page()
            downloads = []
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
            print("PHONE orientation, large targets, real trade commands and preserved drawer state pass")
        finally:
            browser.close()


if __name__ == "__main__":
    main()
