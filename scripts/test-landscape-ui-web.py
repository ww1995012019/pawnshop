#!/usr/bin/env python3
"""Physical pointer checks for the approved landscape/shared-control fixes."""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile

from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "work/landscape-ui"
spec = importlib.util.spec_from_file_location("ui_service", ROOT / "scripts/test-watch-service-web.py")
service = importlib.util.module_from_spec(spec)
spec.loader.exec_module(service)
WRITE = """async input => {
 const db=await new Promise((r,j)=>{const q=indexedDB.open('/userfs');q.onsuccess=()=>r(q.result);q.onerror=()=>j(q.error)});
 await new Promise((r,j)=>{const tx=db.transaction('FILE_DATA','readwrite'),s=tx.objectStore('FILE_DATA');
 for(const [key,value] of Object.entries(input))s.put({timestamp:new Date(),mode:33206,contents:new TextEncoder().encode(JSON.stringify(value))},key);
 tx.oncomplete=r;tx.onerror=j});db.close();
}"""
READ_PREFS = service.READ_SAVE.replace("orbital-watch-save-v4.json", "orbital-prefs.json")


def run():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--case", choices=("all", "desktop", "wide", "phone", "upright", "idle"), default="all")
    args = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix="landscape-ui-fixture-") as saves:
        subprocess.run(["godot", "--headless", "--path", str(ROOT / "godot"), "--script",
                        "res://tests/landscape_ui_browser_fixture.gd"],
                       env={**os.environ, "XDG_DATA_HOME": saves}, check=True,
                       capture_output=True, text=True, timeout=30)
    fixture = json.loads((OUT / "fixture.json").read_text())
    cases = [("desktop", 1280, 720, False), ("wide", 1720, 800, False),
             ("phone", 844, 390, True), ("upright", 390, 844, True)]
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=shutil.which("chromium"), args=[
            "--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"])
        try:
            for name, width, height, mobile in cases:
                if args.case not in ("all", name) and not (args.case == "idle" and name == "desktop"):
                    continue
                context = browser.new_context(viewport={"width": width, "height": height},
                                              has_touch=True, is_mobile=mobile,
                                              device_scale_factor=2 if mobile else 1)
                page = context.new_page()
                errors = []
                page.on("pageerror", lambda e: errors.append(str(e)))
                page.on("console", lambda m: errors.append(m.text) if "SCRIPT ERROR" in m.text else None)
                def cmd(data):
                    page.evaluate("d=>orbitalTouchSend(JSON.stringify(d))", data)
                def wait(expression):
                    page.wait_for_function("() => { const s=OrbitalTouch.state; return " + expression + "}", timeout=20000)
                def raw(label):
                    page.evaluate("window.__orbitalLocated=null")
                    cmd({"type": "locate", "text": label})
                    page.wait_for_function("window.__orbitalLocated !== null")
                    return page.evaluate("__orbitalLocated")
                def physical(x, y):
                    return page.evaluate("([x,y])=>OrbitalTouch.toPhysical?.(x,y) || [x,y]", [x, y])
                def tap_point(x, y):
                    page.touchscreen.tap(*physical(x, y))
                    page.wait_for_timeout(220)
                def tap(label, dx=0):
                    r = raw(label)
                    assert r["found"] and not r["disabled"], (name, label, r)
                    tap_point(r["x"] + dx, r["y"])
                    return r
                def snap(label):
                    page.screenshot(path=str(OUT / f"{name}-{label}.png"))
                def boot():
                    page.goto("http://127.0.0.1:4174/")
                    page.wait_for_function("window.OrbitalTouch?.state?.ready", timeout=90000)
                    cmd({"type": "start"})
                    wait("!s.title && !s.busy")
                if args.case == "idle":
                    boot()
                    page.wait_for_timeout(600)
                    reads = page.evaluate("""async () => {
                      const original=Object.getOwnPropertyDescriptor(window,'devicePixelRatio');
                      const ratio=devicePixelRatio;let reads=0;
                      Object.defineProperty(window,'devicePixelRatio',{configurable:true,get(){reads++;return ratio}});
                      try {for(let i=0;i<12;i++)await new Promise(requestAnimationFrame);return reads;}
                      finally {if(original)Object.defineProperty(window,'devicePixelRatio',original);else delete window.devicePixelRatio;}
                    }""")
                    assert reads == 0, ("idle desktop must not poll DPR through the bridge", reads)
                    print("PASS idle desktop: no per-frame DPR bridge reads", flush=True)
                    context.close()
                    continue
                # Let WebFS create its directory records before replacing the
                # save in each isolated browser context.
                boot()
                cmd({"type": "arrive"})
                wait("s.trade && !s.busy")
                saved = page.evaluate(service.READ_SAVE)
                assert saved
                save_key = saved["key"]
                page.goto("http://127.0.0.1:4174/godot-license.txt")
                page.evaluate(WRITE, {save_key: fixture,
                                     save_key.replace("orbital-watch-save-v4.json", "orbital-prefs.json"):
                                         {"sound": False, "reduced_motion": True}})
                boot()
                wait("s.day===22 && s.cash===10000")
                if name == "upright":
                    assert page.evaluate("OrbitalTouch.turned()"), "upright phones must use the rotated landscape canvas"
                snap("counter")
                print(name, "utility boundaries", flush=True)
                if not mobile:
                    buttons = [raw("@strict_utility_" + key) for key in ("help", "plan", "sound", "settings")]
                    for r in buttons:
                        assert r["found"] and min(r["width"], r["height"]) >= 43.9, (name, r)
                    for left, right in zip(buttons, buttons[1:]):
                        edge = left["x"] + left["width"] / 2
                        start = right["x"] - right["width"] / 2
                        assert start > edge, (name, "utility overlap", left, right)
                        before = page.evaluate(READ_PREFS)["state"]["sound"]
                        tap_point((edge + start) / 2, left["y"])
                        assert not page.evaluate("OrbitalTouch.state.blocked"), "utility gap must be inactive"
                        assert page.evaluate(READ_PREFS)["state"]["sound"] == before, "gap must not toggle sound"
                    for key in ("help", "plan", "settings"):
                        for edge in ((0, -1, 1) if name == "desktop" else (0,)):
                            r = raw("@strict_utility_" + key)
                            tap("@strict_utility_" + key, edge * (r["width"] / 2 - 1))
                            wait("s.blocked")
                            if key == "settings" and edge == 0:
                                # A modal must own the pointer even directly above the underlying sound key.
                                before = page.evaluate(READ_PREFS)["state"]["sound"]
                                sound = buttons[2]
                                tap_point(sound["x"], sound["y"])
                                assert page.evaluate(READ_PREFS)["state"]["sound"] == before
                                # Existing backdrop dismissal may close this modal.
                                if not page.evaluate("OrbitalTouch.state.blocked"):
                                    tap("@strict_utility_settings")
                                    wait("s.blocked")
                                snap("settings")
                            tap("@modal_close")
                            wait("!s.blocked")
                    for _ in range(2):
                        before = page.evaluate(READ_PREFS)["state"]["sound"]
                        tap("@strict_utility_sound")
                        # WebFS commits preferences asynchronously after the
                        # native callback; wait for the persisted result.
                        for attempt in range(40):
                            after = page.evaluate(READ_PREFS)["state"]["sound"]
                            if after != before: break
                            page.wait_for_timeout(200)
                        snap("sound-toggle-result")
                        assert after != before, ("sound toggle was not persisted", name, before, after)
                        snap("sound-on" if not before else "sound-off")
                else:
                    r = raw("@landscape_nav_settings")
                    assert r["found"] and min(r["width"], r["height"]) >= 43.9, (name, r)
                    tap("@landscape_nav_settings")
                    wait("s.blocked")
                    snap("settings")
                    tap("@modal_close")
                    wait("!s.blocked")
                for destination in ("inspect", "repair", "warehouse", "orders", "report"):
                    print(name, destination, flush=True)
                    cmd({"type": "page", "page": destination})
                    wait("s.workspace==='" + destination + "'")
                    close = raw("@workspace_close")
                    assert close["found"] and close["label"] == "" and min(close["width"], close["height"]) >= 43.9, (name, destination, close)
                    snap(destination)
                    if destination == "inspect":
                        picker = raw("北辰 N01 通勤")
                        if picker["found"]:
                            tap("北辰 N01 通勤")
                            snap("dropdown-open")
                            # The expanded native popup must support reaching its last row.
                            # Native PopupMenu uses arrow traversal; Up from
                            # its first/current row reaches the final item.
                            page.keyboard.press("ArrowUp")
                            page.wait_for_timeout(150)
                            snap("dropdown-last")
                            page.keyboard.press("Enter")
                            last = fixture["inventory"][-1]["uid"]
                            wait("s.inspection_uid===" + json.dumps(last))
                        else:
                            raise AssertionError((name, "inspection picker missing"))
                        # Rotate with a workspace open; retain its selected physical original.
                        if name == "upright":
                            uid = page.evaluate("OrbitalTouch.state.inspection_uid")
                            page.set_viewport_size({"width": 844, "height": 390})
                            page.wait_for_timeout(600)
                            assert not page.evaluate("OrbitalTouch.turned()")
                            assert page.evaluate("OrbitalTouch.state.inspection_uid") == uid
                            page.set_viewport_size({"width": width, "height": height})
                            page.wait_for_timeout(600)
                            assert page.evaluate("OrbitalTouch.turned()")
                            assert page.evaluate("OrbitalTouch.state.inspection_uid") == uid
                    if destination == "report":
                        tap("查货记录")
                        wait("s.blocked")
                        snap("night-records")
                        tap("@modal_close")
                        wait("!s.blocked")
                        assert page.evaluate("OrbitalTouch.state.workspace") == "report", "nested close preserves the ledger"
                    tap("@workspace_close")
                    wait("s.workspace===''")
                assert not errors, (name, errors)
                print("PASS landscape shared UI", name, flush=True)
                context.close()
        finally:
            browser.close()


if __name__ == "__main__":
    run()
