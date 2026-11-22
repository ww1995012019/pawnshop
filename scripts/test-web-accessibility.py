#!/usr/bin/env python3
"""Play the opening, settings and a cash transaction using named Web controls."""
import argparse
import importlib.util
import os
from pathlib import Path
import re
import shutil

from playwright.sync_api import expect, sync_playwright

spec = importlib.util.spec_from_file_location("phone", Path(__file__).with_name("test-godot-phone.py"))
phone = importlib.util.module_from_spec(spec)
spec.loader.exec_module(phone)


def load_game(page, url):
    errors = []
    page.on("pageerror", lambda error: errors.append(str(error)))
    page.on("console", lambda message: errors.append(message.text) if
            "SCRIPT ERROR" in message.text or "SHADER ERROR" in message.text else None)
    page.goto(url)
    page.wait_for_function("window.OrbitalTouch?.state.ready", timeout=90000)
    page.wait_for_function("!document.getElementById('loader')")
    expect(page.get_by_role("button", name="开门营业 · 21 天经营", exact=True)).to_have_count(1)
    return errors


def play_with_reader(browser, url):
    ctx = browser.new_context(viewport={"width": 1280, "height": 720}, reduced_motion="reduce")
    page = ctx.new_page()
    errors = load_game(page, url)
    cdp = ctx.new_cdp_session(page)
    cdp.send("Accessibility.enable")
    tree = cdp.send("Accessibility.getFullAXTree")["nodes"]
    buttons = {n.get("name", {}).get("value") for n in tree if not n.get("ignored") and n.get("role", {}).get("value") == "button"}
    assert {"开门营业 · 21 天经营", "开新店 · 90 天故事", "检验说明书", "玩法说明", "设置"} <= buttons
    entry = page.get_by_role("button", name="文字操作", exact=True)
    entry.focus()
    page.keyboard.press("Enter")
    guide_key = page.get_by_role("button", name="检验说明书", exact=True)
    guide_key.click()
    guide = page.get_by_role("dialog", name="检验说明书", exact=True)
    expect(guide).to_be_visible()
    expect(guide).to_contain_text("空秤归零")
    catalogue = guide.get_by_role("button", name="浏览全部手表图鉴")
    catalogue.click()
    index = page.get_by_role("dialog", name=re.compile("全图鉴"))
    index.get_by_role("button", name="关闭", exact=True).click()
    expect(catalogue).to_be_focused()
    guide.get_by_role("button", name="关闭", exact=True).click()
    expect(guide_key).to_be_focused()
    start = page.get_by_role("button", name="开门营业 · 21 天经营", exact=True)
    settings = page.get_by_role("button", name="设置", exact=True)
    settings.click()
    dialog = page.get_by_role("dialog", name="设置", exact=True)
    expect(dialog).to_be_visible()
    expect(start).to_have_count(0)
    motion = dialog.get_by_role("button", name="减少动态效果", exact=True)
    expect(motion).to_have_attribute("aria-pressed", "true")
    motion.click()
    expect(motion).to_have_attribute("aria-pressed", "false")
    motion.click()
    expect(motion).to_have_attribute("aria-pressed", "true")
    volume = dialog.get_by_role("slider", name="音乐", exact=True)
    volume.focus()
    page.keyboard.press("ArrowLeft")
    dialog.get_by_role("button", name="关闭", exact=True).click()
    expect(settings).to_be_focused()
    settings.click()
    expect(dialog.get_by_role("slider", name="音乐", exact=True)).to_have_value("55")
    page.keyboard.press("Escape")
    expect(settings).to_be_focused()
    start.click()
    phone.wait(page, "!s.title && !s.busy")
    bell = page.get_by_role("button", name=re.compile("接客铃|接待下一位来客"))
    bell.first.click()
    phone.wait(page, "s.trade && !s.busy")
    page.wait_for_function("document.getElementById('reader-panel').contains(document.activeElement)")
    more = page.get_by_role("button", name=re.compile("更多.*北辰 N01"))
    more.click()
    expect(page.get_by_role("dialog", name="更多操作")).to_be_visible()
    page.keyboard.press("Escape")
    expect(more).to_be_focused()
    expect(page.get_by_role("button", name=re.compile(r"按此价锁定.*北辰 N01.*\d+ Cr"))).to_be_visible()
    page.get_by_role("button", name=re.compile("议价.*北辰 N01")).first.click()
    price = page.get_by_role("spinbutton", name="我的报价（Cr）", exact=True)
    expect(price).to_be_visible()
    price.fill("57")
    page.get_by_role("button", name=re.compile("^出价")).click()
    phone.wait(page, "s.locked")
    assert page.evaluate("OrbitalTouch.state.price") == 57
    page.get_by_role("button", name=re.compile("支付.*57")).first.click()
    phone.wait(page, "s.cash === 1143 && !s.busy")
    expect(page.get_by_role("status").filter(has_text="1143")).to_have_count(1)
    assert not errors, errors
    ctx.close()


def check_touch_keyboard(browser, url):
    ctx = browser.new_context(viewport={"width": 844, "height": 390}, has_touch=True, is_mobile=True)
    page = ctx.new_page()
    errors = load_game(page, url)
    phone.tap(page, "开门营业")
    phone.wait(page, "!s.title && !s.busy")
    phone.tap(page, "@landscape_primary")
    phone.wait(page, "s.trade && !s.busy")
    phone.tap(page, "@landscape_primary")
    phone.wait(page, "s.blocked")
    # The SpinBox editor lies between the two inner step buttons.
    minus, plus = phone.locate(page, "@quote_step_-1"), phone.locate(page, "@quote_step_1")
    page.touchscreen.tap((minus["x"] + plus["x"]) / 2, minus["y"])
    editor = page.locator("input:focus")
    expect(editor).to_have_accessible_name("我的报价（Cr）")
    expect(editor).to_have_attribute("inputmode", "numeric")
    expect(page.get_by_role("spinbutton", name="我的报价（Cr）")).to_have_count(0)
    editor.fill("57")
    editor.press("Enter")
    page.wait_for_function("document.activeElement === document.getElementById('canvas')")
    page.keyboard.press("Escape")
    phone.wait(page, "!s.blocked")
    assert not errors, errors
    ctx.close()


def check_phone_reader(browser, url):
    ctx = browser.new_context(viewport={"width": 390, "height": 844}, has_touch=True,
                              is_mobile=True, reduced_motion="reduce")
    page = ctx.new_page()
    errors = load_game(page, url)
    entry = page.get_by_role("button", name="文字操作", exact=True)
    expect(entry).to_be_in_viewport()
    assert entry.bounding_box()["width"] >= 44
    entry.tap()
    bounds = page.locator("#reader-panel").bounding_box()
    assert bounds["height"] > bounds["width"]
    page.get_by_role("button", name="开门营业 · 21 天经营", exact=True).click()
    phone.wait(page, "!s.title && !s.busy")
    page.get_by_role("button", name=re.compile("接客铃|接待下一位来客")).first.click()
    phone.wait(page, "s.trade && !s.busy")
    page.get_by_role("button", name=re.compile("议价")).first.click()
    phone.wait(page, "s.blocked")
    offer = page.get_by_role("button", name=re.compile(r"^出价 (\d+) Cr$"))
    initial = int(re.search(r"\d+", offer.text_content()).group())
    amount = page.get_by_role("spinbutton", name="我的报价（Cr）")
    expect(amount).to_have_value(str(initial))
    page.get_by_role("button", name="+5", exact=True).click()
    expect(amount).to_have_value(str(initial + 5))
    amount.fill("57")
    page.get_by_role("button", name="出价 57 Cr", exact=True).click()
    phone.wait(page, "s.locked")
    page.get_by_role("button", name=re.compile("支付 57 Cr")).click()
    phone.wait(page, "s.cash === 1143 && !s.busy")
    page.get_by_role("button", name="上笔回执", exact=True).click()
    receipt = page.get_by_role("dialog", name=re.compile("回执|凭据"))
    for printed in ["No.0001", "北辰 N01", "57 Cr"]:
        expect(receipt).to_contain_text(printed)
    receipt.get_by_role("button", name="收起回执", exact=True).click()
    expect(page.get_by_role("button", name="上笔回执", exact=True)).to_be_focused()
    assert not errors, errors
    ctx.close()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("url", nargs="?", default="http://127.0.0.1:4174/")
    url = parser.parse_args().url
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get("CHROMIUM_EXECUTABLE") or shutil.which("chromium"),
            args=["--no-sandbox", "--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader",
                  "--force-renderer-accessibility"])
        play_with_reader(browser, url)
        check_touch_keyboard(browser, url)
        check_phone_reader(browser, url)
        browser.close()
    print("PASS named Web controls, document and menu focus, live prices, checkout, filed receipt and phone keyboard")
