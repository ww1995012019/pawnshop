"""v15 native content/people/event acceptance against a running production build."""
import importlib.util
import os
from pathlib import Path
from playwright.sync_api import sync_playwright

spec = importlib.util.spec_from_file_location('phone_acceptance', Path(__file__).with_name('test-phone-touch.py'))
phone = importlib.util.module_from_spec(spec)
spec.loader.exec_module(phone)
URL = os.environ.get('PHONE_URL', 'http://localhost:4175/')
OUT = Path(os.environ.get('CONTENT_ARTIFACTS', '/workspace/scratch/content-v15'))
OUT.mkdir(parents=True, exist_ok=True)


def page_for(browser, width=667, height=375):
    page = browser.new_page(viewport={'width': width, 'height': height},
                            screen={'width': width, 'height': height},
                            is_mobile=True, has_touch=True, user_agent=phone.PHONE_UA)
    page.add_init_script("localStorage.setItem('orbital-phone-help-v1','seen'); localStorage.setItem('orbital-prefs-v3',JSON.stringify({sound:false,reducedMotion:true,largeText:false}))")
    page.goto(URL)
    page.wait_for_function('window.__ORBITAL__', timeout=120000)
    page.set_default_timeout(15000)
    return page


def visitor_seed(npc):
    for i in range(1000):
        seed = f'NPC-VISIT-{i}'
        value = 2166136261
        for c in f'{seed}/4/0/visitor':
            value = ((value ^ ord(c)) * 16777619) & 0xffffffff
        if value % 8 + 2 == npc:
            return seed
    raise AssertionError('No deterministic visitor seed')


def main():
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM', '/usr/bin/chromium'),
                                    headless=True, args=['--no-sandbox', '--enable-unsafe-swiftshader'])
        page = page_for(browser)
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.screenshot(path=str(OUT / 'v15-opening-phone.png'))
        phone.tap(page, 'title-start', 667, 375)
        phone.idle(page)
        phone.tap(page, 'button-菜单', 667, 375)
        phone.tap(page, 'phone-menu-7', 667, 375)
        phone.check_targets(page, 667, 375)
        page.screenshot(path=str(OUT / 'v15-daily-event.png'))
        before = phone.state(page)
        phone.tap(page, 'button-04 仓储', 667, 375)
        assert page.evaluate('window.__ORBITAL__.diagnostics().page') == 'counter', 'Event sheet exposed background navigation'
        phone.tap(page, 'event-choice-0', 667, 375)
        after = phone.state(page)
        assert after['cash'] == before['cash'] + 35 and after['ap'] == before['ap'] - 1
        assert after['materials']['MAT-001'] == before['materials']['MAT-001'] - 1
        assert len(after['events']) == 1
        page.screenshot(path=str(OUT / 'v15-event-result.png'))
        phone.tap(page, 'event-history', 667, 375)
        phone.tap(page, 'event-today', 667, 375)
        assert phone.control(page, 'event-return')
        assert phone.state(page) == after, 'Reopening an event must not pay it twice'
        phone.tap(page, 'event-return', 667, 375)
        page.reload()
        page.wait_for_function('window.__ORBITAL__', timeout=120000)
        phone.tap(page, 'title-start', 667, 375)
        phone.idle(page)
        assert phone.state(page)['events'] == after['events']
        phone.tap(page, 'button-菜单', 667, 375)
        phone.tap(page, 'phone-menu-6', 667, 375)
        phone.tap(page, 'people-next', 667, 375)
        phone.tap(page, 'people-select-CHR-006', 667, 375)
        phone.check_targets(page, 667, 375)
        page.screenshot(path=str(OUT / 'v15-nurse-profile.png'))
        phone.tap(page, 'people-needs', 667, 375)
        page.screenshot(path=str(OUT / 'v15-nurse-procurement.png'))
        phone.tap(page, 'people-select-CHR-008', 667, 375)
        page.screenshot(path=str(OUT / 'v15-gardener-profile.png'))
        phone.tap(page, 'people-next', 667, 375)
        phone.tap(page, 'people-select-CHR-009', 667, 375)
        page.screenshot(path=str(OUT / 'v15-collector-profile.png'))
        phone.tap(page, 'button-关闭', 667, 375)
        phone.tap(page, 'button-菜单', 667, 375)
        phone.tap(page, 'phone-menu-0', 667, 375)
        for _ in range(12):
            phone.tap(page, 'button-图鉴下一页', 667, 375)
        phone.tap(page, 'button-图鉴-ITM-081', 667, 375)
        phone.check_targets(page, 667, 375)
        page.screenshot(path=str(OUT / 'v15-new-item-catalogue.png'))
        phone.tap(page, 'button-图鉴翻面', 667, 375)
        page.screenshot(path=str(OUT / 'v15-new-item-reverse.png'))
        assert not errors, errors
        fixture = phone.state(page)
        fixture['inventory'] = [fixture['inventory'][0]]
        fixture['inventory'][0].update(defId='ITM-081', x=0, y=0, condition=.6, working=False, evidence=[], inspectedPaid=False, repaired=False)
        page.evaluate("s=>localStorage.setItem('orbital-save-v3',JSON.stringify(s))", fixture)
        page.reload()
        page.wait_for_function('window.__ORBITAL__', timeout=120000)
        page.evaluate("window.__ORBITAL__.open('inspect','item-1')")
        page.screenshot(path=str(OUT / 'v15-magnetic-boots-front.png'))
        phone.tap(page, 'button-翻到背面 F', 667, 375)
        page.screenshot(path=str(OUT / 'v15-magnetic-boots-back.png'))
        page.close()
        for npc in range(6, 10):
            page = page_for(browser)
            fixture = phone.state(page)
            fixture.update(seed=visitor_seed(npc), day=4, cursor=0)
            for order in fixture['orders'][:3]:
                order['status'] = 'failed'
            page.evaluate("s=>localStorage.setItem('orbital-save-v3',JSON.stringify(s))", fixture)
            page.reload()
            page.wait_for_function('window.__ORBITAL__', timeout=120000)
            phone.tap(page, 'title-start', 667, 375)
            phone.idle(page)
            phone.tap(page, 'button-接待下一位来客', 667, 375)
            phone.idle(page)
            assert phone.state(page)['trade']['npcId'] == f'CHR-{npc:03d}'
            page.screenshot(path=str(OUT / f'v15-visitor-{npc}.png'))
            phone.tap(page, 'phone-dialogue', 667, 375)
            assert phone.control(page, f'people-select-CHR-{npc:03d}')
            page.close()
        browser.close()
    print('v15 native browser: event costs/results/reload, people/profile/needs, new front/back goods and all four real visitors passed.')


if __name__ == '__main__':
    main()
