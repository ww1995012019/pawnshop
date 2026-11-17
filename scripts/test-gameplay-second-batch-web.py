#!/usr/bin/env python3
"""Use real desktop/touch controls against isolated second-batch saves."""
import argparse
import importlib.util
import json
import os
from pathlib import Path
import shutil
import subprocess
import sys
import tempfile
import time
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('service', ROOT/'scripts/test-watch-service-web.py')
service = importlib.util.module_from_spec(spec)
spec.loader.exec_module(service)
phone = service.phone
WRITE_SAVE = """async input=>{
 const db=await new Promise(r=>{const q=indexedDB.open('/userfs');q.onsuccess=()=>r(q.result)});
 await new Promise((r,j)=>{const tx=db.transaction('FILE_DATA','readwrite');
 tx.objectStore('FILE_DATA').put({timestamp:new Date(),mode:33206,contents:new TextEncoder().encode(JSON.stringify(input.state))},input.key);
 tx.oncomplete=r;tx.onerror=j});db.close();} """


READ_EXACT = """async key=>{
 const db=await new Promise(r=>{const q=indexedDB.open('/userfs');q.onsuccess=()=>r(q.result)});
 try { const row=await new Promise(r=>{const q=db.transaction('FILE_DATA').objectStore('FILE_DATA').get(key);q.onsuccess=()=>r(q.result)});
 return row?{key,state:JSON.parse(new TextDecoder().decode(row.contents))}:null; } finally {db.close();}
}"""


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--phone-only', action='store_true')
    parser.add_argument('--desktop-only', action='store_true')
    modes = parser.add_mutually_exclusive_group()
    modes.add_argument('--quote-only', action='store_true')
    modes.add_argument('--followup-only', action='store_true')
    parser.add_argument('--reuse-fixtures', action='store_true')
    args = parser.parse_args()
    out = ROOT/'work/gameplay-second-batch/browser'
    out.mkdir(parents=True, exist_ok=True)
    if not args.reuse_fixtures:
        with tempfile.TemporaryDirectory(prefix='gameplay-second-fixtures-') as saves:
            result = subprocess.run(['godot','--headless','--path',str(ROOT/'godot'),
                '--script','res://tests/second_batch_browser_fixture.gd'],
                env={**os.environ,'XDG_DATA_HOME':saves,'XDG_CACHE_HOME':'/tmp/pawnshop-final-cache'},
                capture_output=True,text=True,timeout=45)
            assert result.returncode==0 and 'SECOND BATCH FIXTURES PASS' in result.stdout, result.stdout+result.stderr
    fixtures = json.loads((ROOT/'work/gameplay-second-batch/fixtures.json').read_text())
    # A quote scenario and a physical-work scenario replace different saves.
    # Keep their WebFS lifetimes separate rather than carrying a prior engine's
    # asynchronous synchronization across injected fixture boundaries.
    if not args.quote_only and not args.followup_only:
        platform = ['--phone-only'] if args.phone_only else ['--desktop-only'] if args.desktop_only else []
        for mode in ['--quote-only','--followup-only']:
            subprocess.run([sys.executable,str(Path(__file__).resolve()),'--reuse-fixtures',mode,*platform],check=True)
        return
    cases = [(True,844,390)] if args.phone_only else [(False,1440,900)] if args.desktop_only else [(False,1440,900),(True,844,390)]
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=shutil.which('chromium'),args=[
            '--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        for mobile,width,height in cases:
            label = 'phone' if mobile else 'desktop'
            context = browser.new_context(viewport={'width':width,'height':height},
                has_touch=mobile,is_mobile=mobile,device_scale_factor=2 if mobile else 1)
            # The plain-text page used while replacing this isolated save has
            # no icon declaration. Keep its browser-generated fallback request
            # separate from the game's content-addressed favicon and assets.
            context.route('**/favicon.ico',lambda route: route.fulfill(status=204,body=''))
            page = context.new_page()
            errors = []
            active_step = ['boot']
            save_key = [None]
            page.on('pageerror', lambda e: errors.append(str(e)))
            def console_message(message):
                if message.type=='error' and 'browser metadata' not in message.text or 'SCRIPT ERROR' in message.text:
                    errors.append(active_step[0]+': '+message.text)
                    print(label,'ENGINE ERROR during',active_step[0],message.text,flush=True)
            page.on('console',console_message)
            def command(data): page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))',data)
            def state(): return page.evaluate('OrbitalTouch.state')
            def screenshot(name): page.screenshot(path=str(out/f'{label}-{name}.png'))
            def tap(text):
                active_step[0] = text
                # Opening a management panel is deferred until its previous
                # modal closes. Observe the actual target before the general
                # phone locator can try a navigation fallback.
                deadline = time.monotonic()+15
                while True:
                    page.evaluate("t=>{window.__orbitalLocated=null;orbitalTouchSend(JSON.stringify({type:'locate',text:t}))}",text)
                    page.wait_for_function('window.__orbitalLocated!==null')
                    if page.evaluate('__orbitalLocated.found'): break
                    assert time.monotonic()<deadline, 'Expected control did not appear: '+text
                    page.wait_for_timeout(50)
                for attempt in range(16):
                    target = phone.locate(page,text)
                    if 4 < target['x'] < width-4 and 4 < target['y'] < height-4: break
                    direction = 1 if target['y']>=height-4 else -1
                    page.mouse.move(width*.75,height*.6)
                    page.mouse.wheel(0,direction*320)
                    page.wait_for_timeout(150)
                assert not target['disabled'] and 0<target['x']<width and 0<target['y']<height,(text,target)
                (page.touchscreen.tap if mobile else page.mouse.click)(target['x'],target['y'])
                page.wait_for_timeout(250)
            def saved(predicate, timeout=20):
                deadline = time.monotonic()+timeout
                while True:
                    row = page.evaluate(READ_EXACT,save_key[0]) if save_key[0] else page.evaluate(service.READ_SAVE)
                    if row and predicate(row['state']): return row
                    if time.monotonic()>=deadline:
                        (out/f'{label}-failed-persistence.json').write_text(json.dumps({'step':active_step[0],'key':save_key[0],'lastSave':row},ensure_ascii=False,indent=2))
                        raise AssertionError('Expected saved result was not persisted')
                    page.wait_for_timeout(100)
            def load_fixture(case, key):
                active_step[0] = 'loading-'+case
                page.goto('http://127.0.0.1:4174/godot-license.txt')
                page.evaluate(WRITE_SAVE,{'key':key,'state':fixtures[case]})
                page.goto('http://127.0.0.1:4174/')
                page.wait_for_function('window.OrbitalTouch?.state?.ready && OrbitalTouch.state.has_save',timeout=120000)
                tap('继续营业')
                phone.wait(page,'!s.title && !s.busy')
            try:
                page.goto('http://127.0.0.1:4174/')
                page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=120000)
                command({'type':'start'})
                phone.wait(page,'!s.title && !s.busy')
                command({'type':'arrive'})
                phone.wait(page,'s.has_save && !s.busy')
                key = saved(lambda s: True)['key']
                save_key[0] = key
                if not args.followup_only:
                    load_fixture('quote',key)
                    job = next(c for c in fixtures['quote']['serviceContracts']['entries'] if c['uid'])
                    identity = job['id']
                    if mobile:
                        tap('@landscape_nav_tasks')
                        tap('经营计划')
                    else:
                        tap('@strict_utility_plan')
                    tap('@shop_plan_contracts')
                    screenshot('quote-default-standard')
                    for band in ['premium','standard','goodwill']:
                        tap('@service_quote_'+band+'_'+identity)
                        screenshot('quote-'+band)
                    tap('@service_quote_submit_'+identity)
                    row = saved(lambda s: any(c['id']==identity and c['status']=='approved' for c in s['serviceContracts']['entries']))
                    approved = next(c for c in row['state']['serviceContracts']['entries'] if c['id']==identity)
                    assert approved['quoteTerms']['band']=='goodwill' and approved['quoteTerms']['trust']==2
                    assert approved['quote']==int(job['budget']*.75)
                    assert row['state']['cash']==fixtures['quote']['cash'] and row['state']['ap']==fixtures['quote']['ap']
                    screenshot('quote-approved')
                    print(label,'PASS physical quote presets and approval, no cash/AP charged',flush=True)
                    if args.quote_only:
                        assert not errors,errors
                        continue

                load_fixture('evidence',key)
                command({'type':'page','page':'inspect'})
                phone.wait(page,"s.workspace==='inspect' && s.appraisal.count===2")
                screenshot('only-logo-stale')
                tap('放大镜')
                page.wait_for_function("OrbitalTouch.state.inspection_current==='TOL-001' && !OrbitalTouch.state.inspection_busy")
                tap('定位并固定标识')
                phone.wait(page,'s.appraisal.count===3')
                uid = fixtures['evidence']['inventory'][0]['uid']
                row = saved(lambda s: any(it['uid']==uid and it['inspectionFacts']['TOL-001']['appraisalObservation'].get('trace') for it in s['inventory']))
                original = next(it for it in row['state']['inventory'] if it['uid']==uid)
                old = fixtures['evidence']['inventory'][0]
                assert original['inspectionFacts']['TOL-002']==old['inspectionFacts']['TOL-002']
                assert original['inspectionFacts']['TOL-005']==old['inspectionFacts']['TOL-005']
                assert row['state']['ap']==fixtures['evidence']['ap']
                screenshot('single-free-recheck')
                print(label,'PASS only loupe rechecked, UV/weight snapshots retained and no AP charged',flush=True)

                load_fixture('ending',key)
                command({'type':'page','page':'report'})
                phone.wait(page,"s.workspace==='report'")
                screenshot('actual-repair-assessment')
                tap('@continue_campaign')
                phone.wait(page,'s.day===22 && !s.busy')
                row = saved(lambda s: s['day']==22 and s.get('campaignLife',{}).get('endless'))
                first = row['state']['campaignLife']['assessments'][0]
                assert first['outcome']=='可信赖维修店'
                assert first['evaluation']==fixtures['ending']['report']['evaluation']
                assert row['state']['cash']==fixtures['ending']['cash']
                screenshot('retained-assessment-day22')
                assert not errors,errors
                print(label,'PASS actual repairs override merchant relation, frozen assessment continues to day22',flush=True)
            except Exception:
                screenshot('FAILED')
                (out/f'{label}-failure-state.json').write_text(json.dumps(state(),ensure_ascii=False,indent=2))
                raise
            finally:
                context.close()
        browser.close()


if __name__=='__main__': main()
