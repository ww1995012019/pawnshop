"""Exercise warehouse expansion, permanent slots and reload through real browser input."""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import time
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('service', ROOT/'scripts/test-watch-service-web.py')
service = importlib.util.module_from_spec(spec)
spec.loader.exec_module(service)
WRITE = '''async input => {
 const db=await new Promise((resolve,reject)=>{const q=indexedDB.open('/userfs');q.onsuccess=()=>resolve(q.result);q.onerror=()=>reject(q.error)});
 await new Promise((resolve,reject)=>{const tx=db.transaction('FILE_DATA','readwrite');tx.objectStore('FILE_DATA').put({timestamp:new Date(),mode:33206,contents:new TextEncoder().encode(JSON.stringify(input.state))},input.key);tx.oncomplete=resolve;tx.onerror=reject});db.close();
}'''

def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('url', nargs='?', default='http://127.0.0.1:4174/')
    parser.add_argument('--desktop-only',action='store_true')
    parser.add_argument('--portrait-only',action='store_true')
    parser.add_argument('--layout-only',action='store_true',help='Check visible cabinet controls without settling an upgrade')
    args=parser.parse_args()
    output=ROOT/'work/warehouse-expansion'
    fixture={}
    if not args.layout_only:
        with tempfile.TemporaryDirectory(prefix='warehouse-browser-') as saves:
            subprocess.run(['godot','--headless','--path',str(ROOT/'godot'),'--script','res://tests/warehouse_browser_fixture.gd'],env={**os.environ,'XDG_DATA_HOME':saves},check=True,capture_output=True,timeout=30)
        fixture=json.loads((output/'fixture.json').read_text())
    else:output=output/'layout'
    output.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        for width,height,mobile in [(1440,900,False),(844,390,True),(390,844,True)]:
            if args.desktop_only and mobile:continue
            if args.portrait_only and width>height:continue
            print('START browser warehouse',width,height,flush=True)
            context=browser.new_context(viewport={'width':width,'height':height},has_touch=mobile,is_mobile=mobile,device_scale_factor=2 if mobile else 1)
            page=context.new_page();errors=[]
            page.on('pageerror',lambda error:errors.append(str(error)))
            page.on('console',lambda msg:errors.append(msg.text) if 'SCRIPT ERROR' in msg.text or 'Failed to save IDB' in msg.text or 'Already syncing' in msg.text else None)
            def cmd(data):page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))',data)
            def wait(condition):service.phone.wait(page,condition,timeout=30000)
            def saved_when(predicate):
                deadline=time.monotonic()+60
                while time.monotonic()<deadline:
                    row=page.evaluate(service.READ_SAVE)
                    if row and predicate(row['state']):return row['state']
                    page.wait_for_timeout(250)
                page.screenshot(path=str(output/f'{width}-persistence-failure.png'))
                raise AssertionError(f'Browser save did not reach the expected persisted state: cash={row["state"].get("cash")}, storage={row["state"].get("storageExpansion")}, live={page.evaluate("OrbitalTouch.state")}, errors={errors}')
            def click(label):
                deadline=time.monotonic()+20
                while True:
                    try:
                        hit=service.phone.locate(page,label)
                        if not hit.get('disabled',False):break
                    except AssertionError:
                        pass
                    if time.monotonic()>deadline:
                        page.screenshot(path=str(output/f'{width}-failure.png'))
                        raise AssertionError(f'In-game control did not become available: {label}')
                    page.wait_for_timeout(200)
                print('CLICK',width,label,hit['x'],hit['y'],flush=True)
                assert hit['found'] and not hit.get('disabled',False),hit
                assert 0<hit['x']<width and 0<hit['y']<height,hit
                if mobile:page.touchscreen.tap(hit['x'],hit['y'])
                else:
                    page.mouse.move(hit['x'],hit['y'])
                    page.wait_for_timeout(250)
                    page.mouse.down();page.wait_for_timeout(200)
                    page.mouse.up()
                page.wait_for_timeout(1000)
            page.goto(args.url)
            page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=120000)
            cmd({'type':'start'});wait('!s.title&&!s.busy')
            if args.layout_only:
                cmd({'type':'page','page':'warehouse'});wait('s.workspace==="warehouse"')
                for label in ['@warehouse_expand','@cabinet_warehouse','@cabinet_materials','@cabinet_isolation','@cabinet_pawn']:
                    hit=service.phone.locate(page,label)
                    assert hit['width']>=(40 if mobile else 30),hit
                for label in ['@cabinet_materials','@cabinet_isolation','@cabinet_pawn','@cabinet_warehouse']:
                    click(label)
                click('@cabinet_materials')
                page.screenshot(path=str(output/f'{width}-materials.png'))
                click('@warehouse_expand');click('@modal_close')
                assert not errors,errors
                print('PASS browser readable cabinet controls and expansion entry',width,height,flush=True)
                context.close();continue
            cmd({'type':'arrive'});wait('s.has_save&&!s.busy')
            row=page.evaluate(service.READ_SAVE);assert row
            page.goto(args.url+'godot-license.txt')
            page.evaluate(WRITE,{'key':row['key'],'state':fixture})
            page.goto(args.url)
            page.wait_for_function('window.OrbitalTouch?.state?.ready&&OrbitalTouch.state.has_save',timeout=120000)
            cmd({'type':'start'});wait('!s.title&&!s.busy')
            cmd({'type':'page','page':'warehouse'});wait('s.workspace==="warehouse"')
            click('@cabinet_materials')
            page.screenshot(path=str(output/f'{width}-materials.png'))
            click('@cabinet_warehouse');click('@warehouse_expand')
            for index,steps in [(0,2),(1,3)]:
                click('@expansion_watch_'+str(index))
                for _ in range(steps):page.keyboard.press('ArrowDown');page.wait_for_timeout(400)
                page.keyboard.press('Enter');page.wait_for_timeout(1000)
            click('@confirm_expansion')
            page.screenshot(path=str(output/f'{width}-confirmation.png'))
            click('确认交付并扩仓');wait('s.cash===4800')
            wait('!s.blocked')
            page.wait_for_timeout(400)
            paid=saved_when(lambda s:s['cash']==4800 and s['storageExpansion']['level']==1)
            assert paid['storageExpansion']['columns']==20 and paid['storageExpansion']['displayCapacity']==32,paid['storageExpansion']
            assert len(paid['inventory'])==22 and paid['cash']==4800
            page.screenshot(path=str(output/f'{width}-expanded.png'))
            click('@cabinet_pawn');click('@buy_pawn_slots');wait('s.cash===4795')
            page.wait_for_timeout(400)
            owned=saved_when(lambda s:s['cash']==4795 and s['storageExpansion']['pawnCapacity']==21)
            assert owned['storageExpansion']['pawnCapacity']==21 and owned['cash']==4795
            page.reload();page.wait_for_function('window.OrbitalTouch?.state?.ready&&OrbitalTouch.state.has_save',timeout=120000)
            cmd({'type':'start'});wait('!s.title&&!s.busy')
            reloaded=page.evaluate(service.READ_SAVE)['state']
            assert reloaded['storageExpansion']['columns']==20 and reloaded['storageExpansion']['pawnCapacity']==21 and reloaded['cash']==4795
            assert not errors,errors
            print('PASS browser warehouse upgrade, consumed watches, permanent slots and reload',width,height,flush=True)
            context.close()
        browser.close()

if __name__=='__main__':main()
