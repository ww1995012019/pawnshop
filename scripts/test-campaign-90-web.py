#!/usr/bin/env python3
"""Play story90 on desktop and landscape touch, retaining the same store to day 91."""

import argparse
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import time
from urllib.parse import urljoin

from playwright.sync_api import Error, sync_playwright


ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location("service", ROOT / "scripts/test-watch-service-web.py")
service = importlib.util.module_from_spec(spec)
spec.loader.exec_module(service)
phone = service.phone

WRITE_SAVE = """async ({key, state}) => {
    const db = await new Promise((resolve, reject) => {
        const request = indexedDB.open('/userfs');
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
    try {
        await new Promise((resolve, reject) => {
            const tx = db.transaction('FILE_DATA', 'readwrite');
            const contents = new TextEncoder().encode(JSON.stringify(state));
            tx.objectStore('FILE_DATA').put({timestamp: new Date(), mode: 33206, contents}, key);
            tx.oncomplete = resolve;
            tx.onerror = () => reject(tx.error);
        });
    } finally { db.close(); }
}"""


def native_fixture(directory, operation, saved=None, day=None):
    with tempfile.TemporaryDirectory(dir=directory, prefix=f"{operation}-") as temp:
        temp = Path(temp)
        output = temp / "output.json"
        command = [os.environ.get("GODOT_BIN", "godot"), "--headless", "--path", str(ROOT / "godot"),
                   "--script", "res://tests/campaign_90_browser_fixture.gd", "--", operation, str(output)]
        if saved is not None:
            source = temp / "browser-save.json"
            source.write_text(json.dumps(saved, ensure_ascii=False), encoding="utf-8")
            command += [str(source), str(day)]
        result = subprocess.run(command, env={**os.environ, "XDG_DATA_HOME": str(temp)},
                                stdout=subprocess.PIPE, stderr=subprocess.STDOUT, text=True, timeout=180)
        assert result.returncode == 0 and "SCRIPT ERROR" not in result.stdout, result.stdout
        return json.loads(output.read_text(encoding="utf-8"))


def run_journey(context, url, output, fixtures, opening, mobile, screenshots, max_fps):
    device = "phone" if mobile else "desktop"
    buy_original = not mobile
    page = context.new_page()
    width, height = page.viewport_size["width"], page.viewport_size["height"]
    fixture_url = urljoin(url, "__campaign_fixture__")
    page.route(fixture_url, lambda route: route.fulfill(
        content_type="text/html", body='<!doctype html><link rel="icon" href="data:,"><title>Isolated fixture</title>'))
    if max_fps:
        def pace_rendering(route):
            # Use the stock engine's frame cap on resource-constrained test hosts.
            response = route.fetch()
            prefix, marker, rest = response.text().partition("const GODOT_CONFIG = ")
            encoded, delimiter, suffix = rest.partition(";\n")
            config = json.loads(encoded)
            config["args"] += ["--max-fps", str(max_fps)]
            route.fulfill(response=response, body=prefix + marker + json.dumps(config) + delimiter + suffix)
        page.route(url, pace_rendering)
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.on("console", lambda msg: errors.append(msg.text)
            if "SCRIPT ERROR" in msg.text or msg.type == "error" and "browser metadata" not in msg.text else None)

    def state():
        return page.evaluate("window.OrbitalTouch?.state")

    def wait(condition):
        phone.wait(page, condition, timeout=45000)

    def locate(label):
        # The bridge reports native control bounds. Actions use browser input.
        page.evaluate("""label => {
            window.__orbitalLocated = null;
            orbitalTouchSend(JSON.stringify({type: 'locate', text: label}));
        }""", label)
        page.wait_for_function("window.__orbitalLocated !== null")
        return page.evaluate("window.__orbitalLocated")

    def wait_for_control(label):
        deadline = time.monotonic() + 45
        while time.monotonic() < deadline:
            target = locate(label)
            if target["found"]:
                return target
            page.wait_for_timeout(250)
        raise AssertionError(("Expected native control did not appear", label, state()))

    def click(label, scroll_bottom=None):
        bottom = min(height - 8, scroll_bottom) if scroll_bottom is not None else height - 8
        for _ in range(12):
            target = locate(label)
            assert target["found"] and not target["disabled"], (label, target, state())
            x, y = target["x"], target["y"]
            if 8 < x < width - 8 and 8 < y < bottom:
                if mobile:
                    page.touchscreen.tap(x, y)
                else:
                    page.mouse.click(x, y)
                return
            assert scroll_bottom is not None and y >= bottom, (label, target)
            if mobile:
                phone.touch_drag(context, page, [(width * .5, height * (.72 - i * .051)) for i in range(9)])
            else:
                page.mouse.move(width * .55, height * .55)
                page.mouse.wheel(0, 420)
                page.wait_for_timeout(130)
        raise AssertionError(("Control remains outside the visible sheet", label, target))

    def saved(predicate):
        # IndexedDB can trail the visible state when the Web renderer is underscheduled.
        deadline = time.monotonic() + 75
        last = None
        while time.monotonic() < deadline:
            record = page.evaluate(service.READ_SAVE)
            if record and predicate(record["state"]):
                return record
            if record:
                last = {key: record["state"][key] for key in ("day", "phase", "cash", "cursor")}
            page.wait_for_timeout(250)
        raise AssertionError(("Expected state did not reach WebFS", last, state()))

    def saved_day(day, phase="open"):
        return saved(lambda s: s["day"] == day and s["phase"] == phase)["state"]

    def snap(name):
        if not screenshots and name != "failure":
            return
        try:
            timeout = 45000 if name == "day-22-letter" else 15000
            page.screenshot(path=str(output / f"{device}-{name}.png"), scale="css", timeout=timeout)
        except Error as error:
            print(f"{device} capture {name} skipped ({error.message.splitlines()[0]})", flush=True)

    def start(has_save):
        page.wait_for_function("window.OrbitalTouch?.state?.ready", timeout=150000)
        wait(f"s.title && s.has_save === {str(has_save).lower()}")
        entry = "继续营业" if has_save else "开门营业"
        if not has_save and locate("@start_campaign_90")["found"]:
            entry = "@start_campaign_90"
        click(entry)
        wait("!s.title && !s.busy && !s.blocked")
        return entry

    def load(key, replacement):
        # Unmount the engine before replacing its save on this fresh origin.
        page.goto(fixture_url)
        page.evaluate(WRITE_SAVE, {"key": key, "state": replacement})
        page.goto(url)
        start(True)

    def ring():
        click("@landscape_primary" if mobile else "接客铃")
        wait("s.trade && !s.busy")

    def send_off():
        day = state()["day"]
        if mobile:
            click("@landscape_more")
            wait("s.blocked")
            click("送客")
        else:
            click("@QuickSendOff")
        wait("!s.trade && !s.busy && !s.blocked")
        return saved(lambda s: s["day"] == day and s["trade"] is None and s["cursor"] == 1)["state"]

    def open_report():
        if mobile:
            click("@landscape_nav_tasks")
            wait("s.blocked")
            click("营业账本 / 打烊")
        else:
            click("日结打烊")
        wait("s.workspace === 'report' && !s.blocked && !s.busy")

    def check_day_charges(current, day, rent=0):
        rows = [row for row in current["ledger"] if row["day"] == day]
        assert sum(row["kind"] == "rent" for row in rows) == bool(rent), rows
        assert sum(row["kind"] == "electricity" for row in rows) == 1, rows
        assert sum(row["kind"] == "cleaning" for row in rows) == 1, rows
        assert sum(row["amount"] for row in rows if row["kind"] == "rent") == -rent, rows

    def settle(day, rent=0, *, persist=True):
        before = state()
        open_report()
        if rent:
            click("请房东上门收租")
            wait("s.trade && !s.busy && !s.workspace")
            rent_action = "@landscape_primary" if mobile else "@StrictTradeAction_0"
            assert f"{rent} Cr" in locate(rent_action)["label"]
            click(rent_action)
            wait(f"s.cash === {before['cash'] - rent} && !s.busy")
            click(rent_action)
            wait("!s.trade && !s.busy")
            open_report()
        click("打烊结算")
        wait("s.blocked || s.notice.startsWith('日结完成')")
        if state()["blocked"]:
            click("确认提前打烊")
        wait("s.notice.startsWith('日结完成')")
        if not persist:
            live = state()
            assert live["day"] == day and live["cash"] == before["cash"] - 16
            return live
        closed = saved_day(day, "report")
        report = closed["report"]
        assert report["day"] == day and report["settlementRent"] == 0, report
        assert closed["cash"] == before["cash"] - rent - report["costs"]["total"], report
        check_day_charges(closed, day, rent)
        return closed

    def next_day(closed, *, persist=True):
        day = closed["day"] + 1
        click(f"迎接第 {day} 天")
        wait(f"s.day === {day} && !s.workspace && !s.busy")
        fresh = saved_day(day) if persist else state()
        assert fresh["cash"] == closed["cash"] and fresh["ap"] == 12
        return fresh

    def choose(day, beat, choice):
        if not state()["blocked"]:
            click("@campaign_story_ticket")
            wait("s.blocked")
        before = saved_day(day)
        assert beat not in before["campaignStory"]["decisions"], before["campaignStory"]
        click(f"@campaign_choice_{choice}", scroll_bottom=height - 12 if mobile else None)
        wait("!s.blocked && !s.workspace")
        after = saved(lambda s: s["campaignStory"]["decisions"].get(beat, {}).get("choiceId") == choice)["state"]
        decision = after["campaignStory"]["decisions"][beat]
        assert decision["day"] == day, decision
        for field in ("cash", "ap", "cursor", "ledger", "inventory", "trade"):
            assert before[field] == after[field], (beat, field)
        return decision

    def reload_day(day, phase="open"):
        page.reload()
        start(True)
        return saved_day(day, phase)

    def jump_to(day, previous):
        replacement = native_fixture(fixtures, "advance", previous, day)
        assert replacement["ledger"][:len(previous["ledger"])] == previous["ledger"]
        assert replacement["campaignStory"]["opening"] == previous["campaignStory"]["opening"]
        load(save_key, replacement)
        return saved_day(day)

    def check_original(current):
        receipts = [receipt for receipt in current["shopJournal"]["receipts"]
                    if not receipt["historical"] and any(entry["uid"] == original and entry["direction"] == "acquisition"
                                                         for entry in receipt["entries"])]
        inventory = [item for item in current["inventory"] if item["uid"] == original and item["owner"] == "shop"]
        assert len(inventory) == len(receipts) == int(buy_original), (original, receipts, inventory)
        assert current["campaignStory"]["opening"]["uid"] == original
        assert current["campaignStory"]["opening"]["receiptId"] == (receipts[0]["id"] if buy_original else "")
        if buy_original:
            assert inventory[0]["defId"] == "WCH-001" and "TOL-001" in inventory[0]["evidence"]
        assert all(item["uid"] != contrast for item in current["inventory"])

    try:
        page.goto(url)
        if start(False) == "开门营业":
            ring()  # The ordinary title entry waits for a business action before writing its save.
        native_opening = saved(lambda s: s.get("campaignLife", {}).get("mode") == "story90")
        save_key = native_opening["key"]
        assert native_opening["state"]["cash"] == 1200 and native_opening["state"]["ap"] == 12
        print(f"{device} title entered story90 and saved its opening balance", flush=True)
        load(save_key, opening)
        phone.assert_full_screen(page, width, height)

        day_one = saved_day(1)
        assert day_one["campaignLife"]["mode"] == "story90" and day_one["cash"] == 1200 and day_one["ap"] == 12
        assert not locate("@campaign_story_ticket")["found"]
        ring()
        arrival = saved(lambda s: (s["trade"] or {}).get("npcId") == "CHR-004")["state"]
        offered = arrival["trade"]["session"]["goods"]
        assert [(item["defId"], item["working"]) for item in offered] == [("WCH-001", False), ("WCH-002", True)]
        assert offered[1]["sourceVerified"], offered[1]
        original, contrast = (item["uid"] for item in offered)
        assert original != contrast and not {original, contrast}.intersection(item["uid"] for item in day_one["inventory"])
        assert [item["uid"] for item in state()["table_items"]] == [original, contrast]
        assert "夜班" in state()["dialogue_line"], state()["dialogue_line"]
        snap("day-01-first-visitor")

        focus = "@landscape_item_" if mobile else "@quick_focus_"
        for uid in (contrast, original):
            click(focus + uid)
            wait(f"s.dialogue_uid === {json.dumps(uid)} && !s.busy")
        click("@landscape_TOL-001" if mobile else "@quick_inspect_" + original)
        wait(f"s.workspace === 'inspect' && s.inspection_uid === {json.dumps(original)}")
        if not mobile:
            click("放大镜")
        wait("s.inspection_current === 'TOL-001' && !s.inspection_busy")
        click("定位并固定标识")
        wait("s.appraisal.count === 1")
        assert state()["ap"] == 11 and state()["cash"] == day_one["cash"]
        snap("day-01-lens-evidence")
        click("@workspace_close")
        wait("!s.workspace && !s.busy")

        if buy_original:
            price = next(row["context"]["price"] for row in state()["trade_session"]["lines"] if row["uid"] == original)
            click("@quick_select_" + original)
            wait("s.trade_session.buy_count === 1")
            assert state()["cash"] == day_one["cash"] and state()["ap"] == 11
            click("@QuickCheckout")
            wait(f"s.cash === {day_one['cash'] - price} && s.ap === 10 && !s.busy")
        check_original(send_off())
        next_day(settle(1))

        click("@campaign_story_ticket")
        wait("s.blocked")
        snap("day-02-letter")
        click("@modal_close")
        wait("!s.blocked && !s.workspace")
        assert "CW-02" not in saved_day(2)["campaignStory"]["decisions"]
        ring()
        ticket = locate("@campaign_story_ticket")
        assert not ticket["found"] or ticket["disabled"], ticket
        send_off()
        early_choice = choose(2, "CW-02", "note" if buy_original else "leave")
        assert reload_day(2)["campaignStory"]["decisions"]["CW-02"] == early_choice
        for day in range(2, 7):
            next_day(settle(day, persist=False), persist=False)
        current = next_day(settle(7, 450))
        for day in range(2, 7):
            check_day_charges(current, day)
        print(f"{device} reached day 8 with the first rent and the day-two decision saved", flush=True)

        jump_to(20, current)
        next_day(settle(20))
        stage = settle(21, 545)
        stage_checkpoint = stage["campaignLife"]["checkpoints"]["21"]
        assert stage_checkpoint["report"]["cash"] == stage["cash"] and stage_checkpoint["day"] == 21
        assert "outcome" not in stage and not locate("查看结局")["found"]
        assert not locate("保留店铺，继续经营")["found"]
        snap("day-21-stage-report")
        day_22 = next_day(stage)
        assert day_22["campaignLife"]["checkpoints"]["21"] == stage_checkpoint
        check_original(day_22)

        click("@campaign_story_ticket")
        wait("s.blocked")
        snap("day-22-letter")
        inspect = locate("@campaign_navigation_inspect")
        assert (inspect["found"] and not inspect.get("disabled", True)) == buy_original, inspect
        history = locate("@campaign_navigation_history")
        assert (history["found"] and not history.get("disabled", True)) == buy_original, history
        if buy_original:
            assert inspect["width"] >= 96 and history["width"] >= 96, (inspect, history)
            click("@campaign_navigation_history")
            wait_for_control("@shop_plan_history")
            click("@modal_close")
            wait("!s.blocked && !s.workspace")
            click("@campaign_story_ticket")
            wait("s.blocked")
            click("@campaign_navigation_inspect")
            wait(f"s.workspace === 'inspect' && !s.blocked && s.inspection_uid === {json.dumps(original)}")
            click("@workspace_close")
            wait("!s.workspace && !s.blocked && !s.busy")
        middle_choice = choose(22, "CW-22", "note" if buy_original else "leave")
        current = reload_day(22)
        assert current["campaignStory"]["decisions"]["CW-22"] == middle_choice
        assert current["cash"] == day_22["cash"] and current["ledger"] == day_22["ledger"]
        print(f"{device} reloaded the day-22 decision and kept the day-21 report", flush=True)

        jump_to(84, current)
        late_rent = settle(84, 900)
        snap("day-84-rent-report")
        current = next_day(late_rent)
        jump_to(90, current)
        click("@campaign_story_ticket")
        wait("s.blocked")
        public = locate("@campaign_choice_public")
        assert not public["found"] or public["disabled"], public
        final_choice = choose(90, "CW-89", "shop" if buy_original else "station")
        ending = settle(90)
        final_checkpoint = ending["campaignLife"]["checkpoints"]["90"]
        assert final_checkpoint["day"] == 90 and final_checkpoint["report"]["cash"] == ending["cash"]
        assert final_checkpoint["outcome"] == ending["outcome"]
        assert final_checkpoint["storyFinal"] == ending["campaignStory"]["final"]
        assert final_checkpoint["storyFinal"]["destination"] == final_choice["choiceId"]
        assert set(ending["campaignLife"]["checkpoints"]) == {"21", "90"}
        assert not locate("迎接第 91 天")["found"]
        snap("day-90-final-report")
        click("查看结局")
        wait_for_control("新开一家店")
        assert state()["cash"] == ending["cash"]
        frame = state()["workspace_rect"]
        # The mobile status area sits between the scroll body and the frame edge.
        scroll_bottom = frame["y"] + frame["height"] - (70 if mobile else 20)
        click("@continue_campaign", scroll_bottom=scroll_bottom)
        wait("s.day === 91 && !s.workspace && !s.busy")
        current = reload_day(91)
        assert current["campaignLife"]["mode"] == "endless"
        assert current["campaignLife"]["checkpoints"] == ending["campaignLife"]["checkpoints"]
        assert current["campaignStory"]["final"] == final_checkpoint["storyFinal"]
        assert current["cash"] == ending["cash"] and current["ledger"] == ending["ledger"]
        assert current["cash"] == 1200 + sum(row["amount"] for row in current["ledger"])
        expected_choices = {"CW-02": early_choice, "CW-22": middle_choice, "CW-89": final_choice}
        assert current["campaignStory"]["decisions"] == expected_choices
        check_original(current)
        open_report()
        rent = locate("请房东上门收租")
        assert rent["found"] and not rent["disabled"], rent
        snap("day-91-rent-and-retained-report")
        assert not errors, errors
        print(f"PASS {device} {width}×{height} {current['seed']} {original} "
              f"{'purchased' if buy_original else 'declined'} at D1, choices and unchanged reports through D91", flush=True)
        return {"device": device, "viewport": [width, height], "seed": current["seed"], "opening_uid": original,
                "purchased": buy_original, "choices": {beat: row["choiceId"] for beat, row in expected_choices.items()},
                "checkpoint_cash": {day: item["report"]["cash"] for day, item in current["campaignLife"]["checkpoints"].items()},
                "day91_cash": current["cash"]}
    except Exception:
        snap("failure")
        print(device, "failure state:", state(), "console errors:", errors, flush=True)
        raise


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url", nargs="?", default="http://127.0.0.1:4174/")
    parser.add_argument("--output", type=Path, default=ROOT / "work/campaign-90/browser")
    parser.add_argument("--device", choices=("desktop", "phone", "both"), default="both")
    parser.add_argument("--no-screenshots", action="store_true")
    parser.add_argument("--max-fps", type=int, default=0, help="Cap Godot rendering on a shared test host")
    args = parser.parse_args()
    args.output.mkdir(parents=True, exist_ok=True)
    results = []
    with tempfile.TemporaryDirectory(prefix="campaign-90-browser-") as fixtures, sync_playwright() as playwright:
        opening = native_fixture(fixtures, "opening")
        browser = playwright.chromium.launch(executable_path=os.environ.get("CHROMIUM_EXECUTABLE") or shutil.which("chromium"),
                                             args=["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader",
                                                   "--enable-unsafe-swiftshader", "--mute-audio"])
        try:
            for device, width, height in (("desktop", 1440, 900), ("phone", 844, 390)):
                if args.device not in ("both", device):
                    continue
                mobile = device == "phone"
                context = browser.new_context(viewport={"width": width, "height": height}, has_touch=mobile,
                                              is_mobile=mobile, device_scale_factor=2 if mobile else 1)
                try:
                    results.append(run_journey(context, args.url, args.output, fixtures, opening, mobile,
                                               not args.no_screenshots, args.max_fps))
                finally:
                    context.close()
        finally:
            browser.close()
    (args.output / "browser-results.json").write_text(json.dumps(results, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


if __name__ == "__main__":
    main()
