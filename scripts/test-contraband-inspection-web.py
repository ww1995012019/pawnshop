#!/usr/bin/env python3
"""Real preparation, isolation and explicit inspection on three screen sizes."""
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
spec = importlib.util.spec_from_file_location('npc_web', ROOT/'scripts/test-npc-gameplay-web.py')
helper = importlib.util.module_from_spec(spec)
spec.loader.exec_module(helper)
phone, service = helper.phone, helper.service

def main():
    out = ROOT/'work/inspection/browser'
    out.mkdir(parents=True, exist_ok=True)
    with tempfile.TemporaryDirectory() as saves:
        result = subprocess.run([os.environ.get('GODOT_BIN','godot'),'--headless','--path',str(ROOT/'godot'),
                                 '--script','res://tests/contraband_inspection_fixture.gd'],
                                env={**os.environ,'XDG_DATA_HOME':saves},stdout=subprocess.PIPE,stderr=subprocess.STDOUT,timeout=60)
        assert result.returncode == 0, result.stdout.decode()
    fixture = json.loads((ROOT/'work/inspection/browser-fixture.json').read_text())
    hidden, isolated, found, fake = [it['uid'] for it in fixture['inventory']]
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        for label,width,height in [('desktop',1440,900),('landscape',844,390),('portrait',390,844)]:
            if os.environ.get('INSPECTION_WEB_VIEW') and label not in os.environ['INSPECTION_WEB_VIEW'].split(','):
                continue
            context = browser.new_context(viewport={'width':width,'height':height},has_touch=True,is_mobile=label!='desktop',device_scale_factor=1)
            page = context.new_page()
            errors = []
            page.on('pageerror',lambda e: errors.append(str(e)))
            page.on('console',lambda m: errors.append(m.text) if 'SCRIPT ERROR' in m.text else None)
            def command(data): page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))',data)
            def tap(text):
                low = height*.55 if label=='portrait' and text=='放入隔离柜' else 8
                high = height*.82 if label=='portrait' and text=='放入隔离柜' else height-12
                for _ in range(15):
                    target = phone.locate(page,text)
                    if target['found'] and low < target['y'] < high: break
                    direction = 1 if not target['found'] or target.get('y',height)>high else -1
                    if label=='desktop':
                        page.mouse.move(width*.8,height*.6)
                        page.mouse.wheel(0,direction*220)
                    else:
                        # Short drags stay inside the warehouse's lower pane.
                        # Pause before release so inertia cannot skip the target.
                        start = .72 if direction>0 else .62
                        points = [(width*.75,height*(start-direction*i*.01)) for i in range(9)]
                        phone.touch_drag(context,page,points+[points[-1]]*15)
                    page.wait_for_timeout(250)
                assert target['found'] and not target['disabled'],(text,target)
                assert 0<target['x']<width and low<target['y']<high,(text,target)
                page.touchscreen.tap(target['x'],target['y'])
                page.wait_for_timeout(300)
            def saved(predicate=lambda s:True):
                deadline=time.monotonic()+20
                while time.monotonic()<deadline:
                    row=page.evaluate(service.READ_SAVE)
                    if row and predicate(row['state']): return row
                    page.wait_for_timeout(200)
                raise AssertionError('save did not reach expected inspection state')
            def boot():
                page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=90000)
                command({'type':'start'})
                phone.wait(page,'!s.title && !s.busy')
            try:
                page.goto('http://127.0.0.1:4174/'); boot()
                command({'type':'arrive'}); phone.wait(page,'s.has_save')
                page.wait_for_timeout(1600)
                key=saved()['key']
                page.goto('http://127.0.0.1:4174/godot-license.txt')
                page.evaluate(helper.WRITE_SAVE,{'key':key,'state':fixture})
                page.goto('http://127.0.0.1:4174/'); boot()
                phone.wait(page,'s.trade && s.cash===200 && s.ap===0')
                page.screenshot(path=str(out/f'{label}-waiting.png'))
                tap('先整理物品')
                phone.wait(page,"s.workspace==='warehouse'")
                pending=saved(lambda s:s['trade'].get('inspectionPrepared',False))['state']
                assert pending['cash']==200 and len(pending['inventory'])==4
                target=next(t for t in page.evaluate('OrbitalTouch.state.warehouse_targets') if t['uid']==hidden)
                page.touchscreen.tap(target['x']+target['width']*.5,target['y']+target['height']*.5)
                phone.wait(page,f's.warehouse_uid==={json.dumps(hidden)}')
                tap('放入隔离柜')
                saved(lambda s:next(i for i in s['inventory'] if i['uid']==hidden)['location']=='isolation')
                tap('关闭')
                phone.wait(page,"s.workspace===''")
                tap('整理好了，开始检查')
                receipt=saved(lambda s:s['trade'] is None and s['cash']==170)['state']
                assert receipt['ap']==0
                assert {i['uid'] for i in receipt['inventory']}=={hidden,isolated,fake}
                assert receipt['nightCrime']['lastInspection']['fineDue']==30
                assert receipt['nightCrime']['lastInspection']['finePaid']==30
                page.screenshot(path=str(out/f'{label}-inspected.png'))
                page.reload();boot()
                persisted=saved()['state']
                assert persisted['cash']==170 and persisted['nightCrime']['lastInspection']==receipt['nightCrime']['lastInspection']
                assert not errors,errors
                print(label,'PASS preparation waits, isolation excludes stolen stock, explicit search fines30 once at zero AP, reload stable',flush=True)
            except Exception:
                page.screenshot(path=str(out/f'{label}-failure.png'))
                raise
            finally: context.close()
        browser.close()

if __name__=='__main__': main()
