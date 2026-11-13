"""Exercise linked workspace Close/Escape using actual mouse/touch input."""
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
OUT = ROOT/'work/workspace-return'
spec = importlib.util.spec_from_file_location('warehouse', ROOT/'scripts/test-warehouse-expansion-web.py')
svc = importlib.util.module_from_spec(spec)
spec.loader.exec_module(svc)

def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--desktop-only', action='store_true')
    args = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as saves:
        subprocess.run(['godot','--headless','--path',str(ROOT/'godot'),'--script','res://tests/warehouse_receipt_layout_test.gd','--','--fixture'], env={**os.environ,'XDG_DATA_HOME':saves},check=True,capture_output=True,timeout=60)
    fixture = json.loads((ROOT/'work/warehouse-receipt/fixture.json').read_text())
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--mute-audio'])
        for width,height in ([(1595,860)] if args.desktop_only else [(1595,860),(844,390),(390,844)]):
            mobile = width < 1000
            context = browser.new_context(viewport={'width':width,'height':height},has_touch=mobile,is_mobile=mobile)
            page = context.new_page()
            errors = []
            page.on('console',lambda msg: errors.append(msg.text) if 'SCRIPT ERROR' in msg.text else None)
            def cmd(data): page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))',data)
            def wait(condition): svc.service.phone.wait(page,condition,timeout=30000)
            def click(text):
                hit = svc.service.phone.locate(page,text)
                assert not hit.get('disabled'),hit
                assert 0 < hit['x'] < width and 0 < hit['y'] < height,hit
                if mobile: page.touchscreen.tap(hit['x'],hit['y'])
                else: page.mouse.click(hit['x'],hit['y'])
                page.wait_for_timeout(500)
            page.goto('http://127.0.0.1:4174/')
            page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=120000)
            cmd({'type':'start'});wait('!s.title&&!s.busy');page.wait_for_timeout(1500)
            cmd({'type':'arrive'});page.wait_for_timeout(1200)
            save = page.evaluate(svc.service.READ_SAVE)
            assert save
            page.goto('http://127.0.0.1:4174/godot-license.txt')
            page.evaluate(svc.WRITE,{'key':save['key'],'state':fixture})
            page.goto('http://127.0.0.1:4174/')
            page.wait_for_function('window.OrbitalTouch?.state?.ready&&OrbitalTouch.state.has_save',timeout=120000)
            cmd({'type':'start'});wait('!s.title&&!s.busy');page.wait_for_timeout(1500)
            cmd({'type':'page','page':'warehouse'});wait('s.workspace==="warehouse"');page.wait_for_timeout(600)
            target = next(row for row in page.evaluate('OrbitalTouch.state.warehouse_targets') if row['uid']=='item-8')
            point = (target['x']+target['width']*.5,target['y']+target['height']*.5)
            if mobile: page.touchscreen.tap(*point)
            else: page.mouse.click(*point)
            wait('s.warehouse_uid==="item-8"');page.wait_for_timeout(450)
            if mobile: click('展开物品档案')
            page.screenshot(path=str(OUT/f'{width}-receipt.png'))
            if mobile: click('收起物品档案')
            click('去维修');wait('s.workspace==="repair"&&s.repair_uid==="item-8"')
            page.wait_for_timeout(700)
            if mobile: click('关闭并返回货物抽屉')
            else: click('收起')
            wait('s.workspace==="warehouse"&&s.warehouse_uid==="item-8"')
            page.screenshot(path=str(OUT/f'{width}-returned.png'))
            cmd({'type':'page','page':'inspect'});wait('s.workspace==="inspect"')
            page.wait_for_timeout(450)
            if mobile: cmd({'type':'close'})
            else: page.keyboard.press('Escape')
            wait('s.workspace==="warehouse"&&s.warehouse_uid==="item-8"')
            cmd({'type':'page','page':'counter'});wait('s.workspace===""')
            assert not errors,errors
            print('PASS workspace return and receipt',width,height,flush=True)
            context.close()
        browser.close()

if __name__=='__main__': main()
