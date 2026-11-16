#!/usr/bin/env python3
"""Verify nearby watch menus and visible drag images with actual Chromium input."""
import argparse
import importlib.util
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import time

from PIL import Image, ImageChops
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("warehouse", ROOT / "scripts/test-warehouse-expansion-web.py")
warehouse = importlib.util.module_from_spec(spec)
spec.loader.exec_module(warehouse)


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url", nargs="?", default="http://127.0.0.1:4174/")
    args = parser.parse_args()
    output = ROOT / "work/warehouse-interactions/browser"
    output.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="warehouse-pointer-fixture-") as saves:
        subprocess.run(["godot", "--headless", "--path", str(ROOT / "godot"), "--script", "res://tests/warehouse_browser_fixture.gd"],
                       env={**os.environ, "XDG_DATA_HOME": saves}, capture_output=True, check=True, timeout=30)
    fixture = json.loads((ROOT / "work/warehouse-expansion/fixture.json").read_text())
    for item in fixture["inventory"]:
        item["sourceVerified"] = True
    with sync_playwright() as playwright:
        browser = playwright.chromium.launch(executable_path=os.environ.get("CHROMIUM_EXECUTABLE") or shutil.which("chromium"),
                    args=["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
        for width, height in [(1440, 900), (1160, 700)]:
            context = browser.new_context(viewport={"width": width, "height": height}, device_scale_factor=1)
            page = context.new_page()
            errors = []
            page.on("pageerror", lambda error: errors.append(str(error)))
            page.on("console", lambda msg: errors.append(msg.text) if "SCRIPT ERROR" in msg.text else None)

            def command(data):
                page.evaluate("data => orbitalTouchSend(JSON.stringify(data))", data)

            def wait(condition):
                warehouse.service.phone.wait(page, condition, timeout=30000)

            def locate(label):
                page.evaluate("text => {window.__orbitalLocated=null;orbitalTouchSend(JSON.stringify({type:'locate',text}));}", label)
                page.wait_for_function("window.__orbitalLocated !== null")
                return page.evaluate("window.__orbitalLocated")

            def saved_location(uid, location):
                deadline = time.monotonic() + 30
                while time.monotonic() < deadline:
                    row = page.evaluate(warehouse.service.READ_SAVE)
                    if row and any(item["uid"] == uid and item["location"] == location for item in row["state"]["inventory"]):
                        return
                    page.wait_for_timeout(150)
                page.screenshot(path=str(output / f"{width}-failed-drop.png"))
                raise AssertionError(f"{uid} did not reach {location}; errors={errors}")

            def target():
                return page.evaluate("OrbitalTouch.state.warehouse_targets[0]")

            def center(rect):
                return rect["x"] + rect["width"] / 2, rect["y"] + rect["height"] / 2

            print(f"START warehouse pointer checks {width}x{height}", flush=True)
            page.goto(args.url)
            page.wait_for_function("window.OrbitalTouch?.state?.ready", timeout=120000)
            command({"type": "start"}); wait("!s.title&&!s.busy")
            command({"type": "arrive"}); wait("s.has_save&&!s.busy")
            row = page.evaluate(warehouse.service.READ_SAVE)
            assert row
            page.goto(args.url + "godot-license.txt")
            page.evaluate(warehouse.WRITE, {"key": row["key"], "state": fixture})
            page.goto(args.url)
            page.wait_for_function("window.OrbitalTouch?.state?.ready&&OrbitalTouch.state.has_save", timeout=120000)
            command({"type": "start"}); wait("!s.title&&!s.busy")
            command({"type": "page", "page": "warehouse"}); wait('s.workspace==="warehouse"')
            page.wait_for_timeout(500)
            original = target()
            x, y = center(original)
            page.mouse.click(x, y)
            page.wait_for_timeout(150)
            assert not locate("上架陈列")["found"], "desktop actions must only appear on demand"
            page.mouse.click(x, y, button="right")
            page.wait_for_timeout(250)
            page.screenshot(path=str(output / f"{width}-context-menu.png"))
            shelf = locate("上架陈列")
            assert shelf["found"] and not shelf["disabled"], shelf
            assert 0 < shelf["x"] < width and 0 < shelf["y"] < height, shelf
            page.mouse.click(shelf["x"], shelf["y"])
            saved_location(original["uid"], "display")
            assert not locate("旋转方向")["found"], "choosing an action closes the menu"
            print(f"PASS {width}: real right-click opens menu; real left-click shelves the correct original", flush=True)

            original = target()
            x, y = center(original)
            workspace = page.evaluate("OrbitalTouch.state.workspace_rect")
            display = {"x": (workspace["x"] + original["x"]) / 2, "y": y}
            before = Image.open(io.BytesIO(page.screenshot())).convert("RGB")
            page.mouse.move(x, y)
            page.mouse.down()
            page.mouse.move(x + 18, y + 8, steps=5)
            page.mouse.move(display["x"], display["y"], steps=16)
            page.wait_for_timeout(200)
            dragging = Image.open(io.BytesIO(page.screenshot(path=str(output / f"{width}-drag-watch.png")))).convert("RGB")
            region = (int(display["x"] - 45), int(display["y"] - 65), int(display["x"] + 45), int(display["y"] + 65))
            difference = ImageChops.difference(before.crop(region), dragging.crop(region))
            changed = sum(max(pixel) > 20 for pixel in difference.get_flattened_data())
            assert changed > 100, f"watch image disappeared outside warehouse; changed pixels={changed}"
            page.mouse.up()
            saved_location(original["uid"], "display")
            print(f"PASS {width}: watch image remains visible across cabinets ({changed} pixels); drop persists", flush=True)

            original = target()
            page.mouse.click(*center(original), button="right")
            page.wait_for_timeout(180)
            assert locate("旋转方向")["found"]
            page.keyboard.press("Escape")
            page.wait_for_timeout(180)
            assert not locate("旋转方向")["found"]
            assert page.evaluate('OrbitalTouch.state.workspace === "warehouse"'), "Escape must dismiss the menu before closing the drawer"
            assert not errors, errors
            context.close()
        browser.close()


if __name__ == "__main__":
    main()
