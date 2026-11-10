#!/usr/bin/env python3
"""Exercise real three-tool appraisal and physical-forgery UI on desktop/phone."""
import importlib.util
import os
from pathlib import Path
import shutil
import time
from playwright.sync_api import sync_playwright

spec = importlib.util.spec_from_file_location('phone', Path(__file__).with_name('test-godot-phone.py'))
phone = importlib.util.module_from_spec(spec)
spec.loader.exec_module(phone)


def main():
    out = Path('work/watch-appraisal-browser')
    out.mkdir(parents=True, exist_ok=True)
    with sync_playwright() as p:
        browser = p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium'), args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        try:
            for width,height in ([(844,390)] if os.environ.get('APPRAISAL_PHONE_ONLY') else [(1600,900)] if os.environ.get('APPRAISAL_DESKTOP_ONLY') else [(1600,900),(844,390)]):
                mobile = width < 1000
                context = browser.new_context(viewport={'width':390,'height':844} if mobile else {'width':width,'height':height}, has_touch=mobile,is_mobile=mobile,device_scale_factor=2 if mobile else 1)
                page = context.new_page()
                errors = []
                page.on('console', lambda msg: errors.append(msg.text) if (msg.type=='error' or 'SCRIPT ERROR' in msg.text) and 'browser metadata to extension' not in msg.text else None)
                page.on('pageerror',lambda error:errors.append(str(error)))
                page.goto('http://127.0.0.1:4174/')
                if mobile: page.set_viewport_size({'width':width,'height':height})
                page.wait_for_function('OrbitalTouch?.state?.ready && !document.getElementById("loader")',timeout=90000)
                def cmd(data): page.evaluate('(data)=>orbitalTouchSend(JSON.stringify(data))',data)
                def click(text):
                    target = phone.locate(page,text)
                    assert not target['disabled'],text+' is disabled'
                    (page.touchscreen.tap if mobile else page.mouse.click)(target['x'],target['y'])
                def snapshot(tag):
                    page.mouse.move(width-2,height-2)
                    page.screenshot(path=str(out/f'{width}-{tag}.png'))
                def appraisal(count):
                    try:
                        page.wait_for_function('(n)=>OrbitalTouch.state.appraisal?.count===n',arg=count,timeout=15000)
                    except Exception:
                        print('Appraisal failure state:',page.evaluate('OrbitalTouch.state'),flush=True)
                        snapshot('failed-appraisal')
                        saved = page.evaluate("""async()=>{
                            const db=await new Promise(resolve=>{const r=indexedDB.open('/userfs');r.onsuccess=()=>resolve(r.result)});
                            try {
                                const rows=await new Promise(resolve=>{const r=db.transaction('FILE_DATA').objectStore('FILE_DATA').getAll();r.onsuccess=()=>resolve(r.result)});
                                const keys=await new Promise(resolve=>{const r=db.transaction('FILE_DATA').objectStore('FILE_DATA').getAllKeys();r.onsuccess=()=>resolve(r.result)});
                                return rows.map((row,i)=>{try {const state=JSON.parse(new TextDecoder().decode(row.contents));return {key:keys[i],timestamp:row.timestamp,item:state.inventory?.[0]}}catch(_){return {key:keys[i]}}});
                            }finally{db.close()}
                        }""")
                        import json
                        Path('work/failed-appraisal-save.json').write_text(json.dumps(saved,ensure_ascii=False,default=str))
                        print('Saved file keys:',[row['key'] for row in saved],flush=True)
                        raise
                    return page.evaluate('OrbitalTouch.state.appraisal')
                def inspect_all():
                    cmd({'type':'tool','tool':'TOL-001'})
                    page.wait_for_function("OrbitalTouch.state.inspection_current==='TOL-001' && !OrbitalTouch.state.inspection_busy")
                    click('定位并固定标识');first=appraisal(1)
                    snapshot('one-tool')
                    cmd({'type':'tool','tool':'TOL-002'})
                    page.wait_for_function("OrbitalTouch.state.inspection_current==='TOL-002' && !OrbitalTouch.state.inspection_busy")
                    click('定位并固定编号');second=appraisal(2)
                    assert second['low']>=first['low'] and second['high']<=first['high']
                    snapshot('two-tools')
                    cmd({'type':'tool','tool':'TOL-005'});page.wait_for_function("OrbitalTouch.state.inspection_current==='TOL-005'")
                    click('空秤归零');click('放到秤上')
                    page.wait_for_function('OrbitalTouch.state.scale_stable',timeout=10000)
                    final=appraisal(3)
                    assert not final['exact'] and final['low'] < final['high']
                    assert second['low']<=final['low']<final['high']<=second['high']
                    snapshot('three-tools')
                    return (final['low'],final['high'])
                cmd({'type':'start'});phone.wait(page,'!s.title && !s.busy')
                cmd({'type':'page','page':'inspect'});phone.wait(page,"s.workspace==='inspect'")
                assert appraisal(0)['exact'] is False
                reference = inspect_all()
                if mobile:
                    for _ in range(2): phone.touch_drag(context,page,[(width*.85,height*.60),(width*.85,height*.48),(width*.85,height*.35)])
                    snapshot('inspection-records-scrolled')
                    for _ in range(2): phone.touch_drag(context,page,[(width*.85,height*.35),(width*.85,height*.48),(width*.85,height*.60)])

                uid=page.evaluate('OrbitalTouch.state.inspection_uid')
                cmd({'type':'page','page':'warehouse'});phone.wait(page,"s.workspace==='warehouse'")
                for _ in range(8):
                    target=phone.locate(page,'送到修表台 · 加工')
                    # A visible node can still lie below its ScrollContainer clip.
                    if height*.16<target['y']<height*.72:break
                    page.mouse.move(width*.74,height*.62)
                    page.mouse.wheel(0,500 if target['y']>=height*.72 else -500)
                    page.wait_for_timeout(200)
                print('Forgery navigation target:',phone.locate(page,'送到修表台 · 加工'),flush=True)
                click('送到修表台 · 加工')
                try:phone.wait(page,"s.workspace==='repair' && s.repair_mode==='forge'")
                except Exception:
                    print('Forgery navigation state:',page.evaluate('OrbitalTouch.state'),flush=True)
                    snapshot('failed-forgery-navigation')
                    raise
                snapshot('forgery-options')
                before_ap=page.evaluate('OrbitalTouch.state.ap')
                for _ in range(30):
                    current=page.evaluate('OrbitalTouch.state')
                    if current.get('forge_done'):break
                    click(current['repair_action'])
                    step=current['repair_animation']['step']
                    page.wait_for_function("step=>{const a=OrbitalTouch.state.repair_animation;return a.complete || a.phase==='idle'&&a.step>step}",arg=step)
                page.wait_for_function('(ap)=>OrbitalTouch.state.ap===ap-1',arg=before_ap)
                assert page.evaluate('OrbitalTouch.state.forge_done') is True
                snapshot('forgery-physical-complete')
                cmd({'type':'page','page':'inspect'});phone.wait(page,"s.workspace==='inspect'")
                assert page.evaluate('OrbitalTouch.state.inspection_uid')==uid
                assert appraisal(0)['exact'] is False
                snapshot('stale-after-forgery')
                assert inspect_all()==reference,'cosmetic forgery changed true reference value'
                assert page.evaluate('OrbitalTouch.state.detail_lines.join("\\n")').find('重描漆层')>=0
                # Wait for the actual WebFS save, rather than relying on CPU-dependent timing.
                persisted_script = """async uid => {
                    const info = (await indexedDB.databases()).find(db => db.name === '/userfs');
                    if (!info) return false;
                    const db = await new Promise((resolve,reject) => {const request=indexedDB.open(info.name); request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)});
                    try {
                        const rows = await new Promise((resolve,reject) => {const request=db.transaction('FILE_DATA','readonly').objectStore('FILE_DATA').getAll();request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error)});
                        for (const row of rows) {
                            if (!row.contents) continue;
                            try {
                                const state=JSON.parse(new TextDecoder().decode(row.contents));
                                const item=state.inventory?.find(item=>item.uid===uid);
                                const facts=item?.inspectionFacts;
                                if (!item?.forgery?.methods?.logo || !facts?.['TOL-001']?.tampered) continue;
                                const revisions=['TOL-001','TOL-002','TOL-005'].map(tool=>facts[tool]?.appraisalRevision);
                                if (revisions[0] && revisions.every(value=>value===revisions[0])) return true;
                            } catch (_) {}
                        }
                        return false;
                    } finally {db.close();}
                }"""
                deadline=time.monotonic()+15
                while not page.evaluate(persisted_script,uid):
                    assert time.monotonic()<deadline, "latest three-tool appraisal did not reach WebFS persistence"
                    page.wait_for_timeout(150)
                page.reload()
                page.wait_for_function('OrbitalTouch?.state?.ready && OrbitalTouch.state.has_save',timeout=90000)
                page.wait_for_timeout(800);click('继续营业');phone.wait(page,'!s.title && !s.busy')
                cmd({'type':'page','page':'inspect'});phone.wait(page,"s.workspace==='inspect'")
                assert (appraisal(3)['low'],appraisal(3)['high'])==reference,'recorded appraisal lost on reload'
                assert not errors,errors[:8]
                print(width,'progressive range appraisal, concrete forge, stale recheck and saved result pass',flush=True)
                context.close()
        finally:browser.close()

if __name__=='__main__': main()
