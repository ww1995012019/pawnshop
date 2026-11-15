#!/usr/bin/env python3
"""Check the authored comic view with real Chromium input and durable saves."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'work/strict-reference'
def module(name, path):
    spec = importlib.util.spec_from_file_location(name, ROOT / path)
    loaded = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(loaded)
    return loaded
phone = module('phone', 'scripts/test-godot-phone.py')
service = module('service', 'scripts/test-watch-service-web.py')


def main():
    os.chdir(ROOT)
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='strict-reference-') as saves:
        subprocess.run(['godot', '--headless', '--path', 'godot', '--script',
                        'res://tests/strict_reference_fixture.gd'],
                       env={**os.environ, 'XDG_DATA_HOME': saves}, check=True,
                       stdout=subprocess.PIPE, stderr=subprocess.STDOUT, timeout=30)
    fixture = json.loads((OUT / 'fixture.json').read_text())
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path='/usr/bin/chromium', args=[
            '--no-sandbox', '--use-gl=angle', '--use-angle=swiftshader',
            '--enable-unsafe-swiftshader', '--mute-audio'])
        page = browser.new_page(viewport={'width': 1920, 'height': 1080})
        errors = []
        page.on('pageerror', lambda e: errors.append(str(e)))
        page.on('console', lambda msg: errors.append(msg.text) if 'SCRIPT ERROR' in msg.text or msg.type=='error' and 'browser metadata' not in msg.text else None)
        def cmd(data): page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))', data)
        def status(): return page.evaluate('OrbitalTouch.state')
        def saved(): return page.evaluate(service.READ_SAVE)['state']
        def settle():
            page.wait_for_timeout(250)
            phone.wait(page, '!s.busy', timeout=20000)
            page.wait_for_timeout(1000)
        def click(label):
            key = phone.locate(page, label)
            assert not key['disabled'], (label, key)
            page.mouse.click(key['x'], key['y']); settle()
        def drag(source, target):
            x,y=source;tx,ty=target
            page.mouse.move(x,y);page.mouse.down();page.wait_for_timeout(180)
            for step in range(1,16):
                page.mouse.move(x+(tx-x)*step/15,y+(ty-y)*step/15)
                page.wait_for_timeout(65)
            page.wait_for_timeout(180)
            page.mouse.up();settle()
        def snap(name):
            page.mouse.move(1900, 1060)
            page.screenshot(path=str(OUT / (name + '.png')))
        def close():
            cmd({'type': 'close'}); page.wait_for_timeout(450)
            phone.wait(page,'!s.blocked&&!s.busy&&s.workspace===""',timeout=20000)
            page.wait_for_timeout(250)
        page.goto('http://127.0.0.1:4174/')
        page.wait_for_function('window.OrbitalTouch?.state?.ready', timeout=120000)
        cmd({'type': 'start'}); settle(); cmd({'type': 'arrive'}); settle()
        row = page.evaluate(service.READ_SAVE)
        for _ in range(30):
            if row: break
            page.wait_for_timeout(200); row=page.evaluate(service.READ_SAVE)
        assert row, (status(), errors)
        page.evaluate('''async input=>{
            const db=await new Promise(r=>{const q=indexedDB.open('/userfs');q.onsuccess=()=>r(q.result)});
            await new Promise((r,j)=>{const tx=db.transaction('FILE_DATA','readwrite');
            tx.objectStore('FILE_DATA').put({timestamp:new Date(),mode:33206,
            contents:new TextEncoder().encode(JSON.stringify(input.state))},input.key);
            tx.oncomplete=r;tx.onerror=j});db.close()}''', {'key': row['key'], 'state': fixture})
        page.reload(); page.wait_for_function('window.OrbitalTouch?.state?.ready', timeout=120000)
        cmd({'type': 'start'}); settle(); page.wait_for_timeout(900)
        snap('main')
        # Match the source's hover on the shop's 95 Cr original without changing
        # focus/price or dispatching a transaction.
        hover_uid=next(row['uid'] for row in status()['table_items'] if row['direction']=='sell' and row['price']==95)
        hover=phone.locate(page,'@strict_table_'+hover_uid)
        page.mouse.move(hover['x'],hover['y']);page.wait_for_timeout(250)
        page.screenshot(path=str(OUT/'main-reference.png'))
        page.mouse.move(1900,1060)
        original = status()
        uid = original['trade_session']['focus']
        table_key = '@strict_table_' + uid
        key = phone.locate(page, table_key)
        page.mouse.click(key['x'], key['y'], button='right'); settle(); snap('flipped')
        page.mouse.click(key['x'], key['y'], button='right'); settle()
        start=phone.locate(page,table_key)
        drag((start['x'],start['y']),(start['x']+80,start['y']))
        moved_watch=phone.locate(page,table_key)
        assert moved_watch['x']>start['x']+10,(start,moved_watch)
        assert uid in saved()['trade']['session']['table_positions']
        snap('table-moved')
        # Actual tool entry and the remaining page/navigation routes.
        for key, workspace in [('@quick_inspect_'+uid, 'inspect'),
                               ('@StrictNav_box-archive', 'warehouse'),
                               ('@StrictNav_screwdriver-wrench', 'repair'),
                               ('@StrictOrders', 'orders'), ('@StrictNav_sun', 'report')]:
            click(key); phone.wait(page, 's.workspace===' + json.dumps(workspace), timeout=15000)
            snap(workspace); print('PASS workspace',workspace,flush=True); close(); phone.wait(page, 's.workspace===""', timeout=10000)
        for label, name in [('@StrictPeople', 'people'), ('@StrictCashLedger', 'ledger'),
                            ('手册', 'handbook'), ('设置', 'settings')]:
            click(label); snap(name); close()
        # Enter a price without Enter, then click the real offer button.
        click('@quick_offer_'+uid)
        page.keyboard.press('Control+a'); page.keyboard.type('173')
        snap('quote-editable')
        page.keyboard.press('Control+a'); snap('quote-selected')
        click('@QuickOfferSubmit')
        se = status()['trade_session']
        line = next(r for r in se['lines'] if r['uid'] == uid)
        assert line['context']['price'] == 173 and line['status'] == 'confirmed', line
        assert saved()['cash'] == fixture['cash'] and saved()['ap'] == fixture['ap']
        snap('agreed')
        click('@QuickCheckout'); settle()
        after = saved()
        assert after['cash'] == fixture['cash'] - 173 and after['ap'] == fixture['ap'] - 1
        assert len([it for it in after['inventory'] if it['uid'] == uid]) == 1
        print('PASS typed quote, single payment, one AP and exact UID transfer', flush=True)
        click('送客'); phone.wait(page, '!s.trade&&!s.busy', timeout=20000)
        before = saved()
        display_uid = fixture['inventory'][0]['uid']
        warehouse_uid = fixture['inventory'][5]['uid']
        def point(uid):
            v = phone.locate(page, '@strict_stock_' + uid)
            return v['x'], v['y']
        drag(point(display_uid), point(warehouse_uid))
        moved = saved()
        for _ in range(40):
            if next(it for it in moved['inventory'] if it['uid']==display_uid)['location']=='warehouse':break
            page.wait_for_timeout(150);moved=saved()
        snap('dragged')
        assert next(it for it in moved['inventory'] if it['uid']==display_uid)['location']=='warehouse', (status(),moved.get('notice'),a if 'a' in locals() else None)
        # Same cabinet swap must update both durable slots and rendered positions.
        warehouse_uid = fixture['inventory'][6]['uid']
        a = point(display_uid); b = point(warehouse_uid)
        drag(a,b)
        moved = saved()
        assert abs(point(display_uid)[0]-b[0]) < 2 and abs(point(warehouse_uid)[0]-a[0]) < 2, (a,b,point(display_uid),point(warehouse_uid),moved['showroomLayout'])
        assert moved['cash']==before['cash'] and moved['ap']==before['ap']
        click('@strict_stock_'+display_uid);snap('own-original')
        selected = saved()
        assert selected['counterPreviewUid']==display_uid
        click('放大镜 · 查看标识');phone.wait(page,'s.workspace==="inspect"',timeout=10000)
        close();phone.wait(page,'s.workspace===""&&!s.busy',timeout=10000)
        click('放回原位')
        # Browser filesystem sync is asynchronous; check the rendered original
        # disappears as well as the durable state, rather than assuming a delay.
        for _ in range(40):
            if saved()['counterPreviewUid']=='':break
            page.wait_for_timeout(150)
        snap('returned')
        assert saved()['counterPreviewUid']=='',status()
        layout=saved()['showroomLayout']
        page.reload();page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=120000)
        cmd({'type':'start'});settle()
        assert saved()['showroomLayout']==layout
        snap('idle')
        print('PASS cabinet drag, same-cabinet swap, own-item tool entry and reload persistence',flush=True)
        assert not errors, errors
        (OUT/'browser-results.json').write_text(json.dumps({'errors':errors,'passed':True,
            'viewport':[1920,1080],'cash':saved()['cash'],'ap':saved()['ap']},indent=2)+'\n')
        print('PASS screenshots for counter and all main workspaces; no script errors',flush=True)
        browser.close()
if __name__ == '__main__': main()
