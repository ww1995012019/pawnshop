#!/usr/bin/env python3
"""Real in-scene landlord arrival/payment on desktop, landscape and portrait."""
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("service", ROOT / "scripts/test-watch-service-web.py")
service = importlib.util.module_from_spec(spec)
spec.loader.exec_module(service)
phone = service.phone
WRITE_SAVE = """async input => {
 const db=await new Promise(r=>{const q=indexedDB.open('/userfs');q.onsuccess=()=>r(q.result)});
 await new Promise((r,j)=>{const tx=db.transaction('FILE_DATA','readwrite');tx.objectStore('FILE_DATA').put({timestamp:new Date(),mode:33206,contents:new TextEncoder().encode(JSON.stringify(input.state))},input.key);tx.oncomplete=r;tx.onerror=j});db.close();
}"""

def main():
    out = ROOT / "work/npc-gameplay/browser"
    out.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as saves:
        subprocess.run([os.environ.get("GODOT_BIN", "godot"), "--headless", "--path", str(ROOT / "godot"),
                        "--script", "res://tests/npc_gameplay_fixture.gd"],
                       env={**os.environ, "XDG_DATA_HOME": saves}, check=True,
                       stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=30)
    fixture = json.loads((ROOT / "work/npc-gameplay/rent-fixture.json").read_text())
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=shutil.which("chromium"), args=["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
        for label, width, height in [("desktop", 1440, 900), ("phone", 844, 390), ("portrait", 390, 844)]:
            context = browser.new_context(viewport={"width": width, "height": height}, has_touch=True,
                                          is_mobile=label != "desktop", device_scale_factor=1)
            page = context.new_page()
            errors = []
            page.on("pageerror", lambda e: errors.append(str(e)))
            page.on("console", lambda m: errors.append(m.text) if "SCRIPT ERROR" in m.text or "SHADER ERROR" in m.text else None)
            def command(data):
                page.evaluate("d=>orbitalTouchSend(JSON.stringify(d))", data)
            def tap(text):
                target = phone.locate(page, text)
                assert not target["disabled"] and 0 < target["x"] < width and 0 < target["y"] < height, (text, target)
                page.touchscreen.tap(target["x"], target["y"])
                page.wait_for_timeout(200)
            try:
                page.goto("http://127.0.0.1:4174/")
                page.wait_for_function("window.OrbitalTouch?.state?.ready", timeout=90000)
                command({"type": "start"})
                phone.wait(page, "!s.title && !s.busy")
                command({"type":"arrive"})
                phone.wait(page, "s.has_save")
                page.wait_for_timeout(1500)
                saved = page.evaluate(service.READ_SAVE)
                assert saved
                page.goto("http://127.0.0.1:4174/godot-license.txt")
                page.evaluate(WRITE_SAVE, {"key": saved["key"], "state": fixture})
                page.goto("http://127.0.0.1:4174/")
                page.wait_for_function("window.OrbitalTouch?.state?.ready && OrbitalTouch.state.has_save", timeout=90000)
                command({"type": "start"})
                phone.wait(page, "!s.title && !s.busy && !s.trade")
                tap("接待下一位来客" if label == "portrait" else "接客铃")
                phone.wait(page, "s.trade && !s.busy && s.visitor === '梁叔'", timeout=20000)
                assert phone.state(page, "cash") == 2000
                page.screenshot(path=str(out / f"{label}-landlord-arrival.png"))
                tap("缴纳本期租金")
                phone.wait(page, "s.cash === 1550 && s.trade")
                assert phone.state(page, "ap") == 0
                page.mouse.move(width - 3, height - 3)
                page.wait_for_timeout(600)
                page.screenshot(path=str(out / f"{label}-rent-receipt.png"))
                page.wait_for_timeout(1600)
                saved = page.evaluate(service.READ_SAVE)["state"]
                assert len([x for x in saved["ledger"] if x["kind"] == "rent" and x["day"] == 7]) == 1
                tap("收好回执")
                phone.wait(page, "!s.trade && !s.busy", timeout=20000)
                assert phone.state(page, "cash") == 1550
                assert not errors, errors[:8]
                print(label, "PASS landlord arrives, explicitly collects once at zero AP and leaves", flush=True)
            finally:
                context.close()
        browser.close()

if __name__ == "__main__":
    main()
