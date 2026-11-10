#!/usr/bin/env python3
"""Real desktop/touch input through persistent service and three animated forgeries."""
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
spec = importlib.util.spec_from_file_location('phone', ROOT/'scripts/test-godot-phone.py')
phone = importlib.util.module_from_spec(spec)
spec.loader.exec_module(phone)
READ_SAVE = """async () => {
 const db=await new Promise((resolve,reject)=>{const r=indexedDB.open('/userfs');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
 try {
  if(!db.objectStoreNames.contains('FILE_DATA'))return null;
  const store=db.transaction('FILE_DATA').objectStore('FILE_DATA');
  const [keys,rows]=await Promise.all([new Promise(r=>{const q=store.getAllKeys();q.onsuccess=()=>r(q.result)}),new Promise(r=>{const q=store.getAll();q.onsuccess=()=>r(q.result)})]);
  for(let i=0;i<keys.length;i++)if(String(keys[i]).endsWith('orbital-watch-save-v4.json'))return {key:keys[i],state:JSON.parse(new TextDecoder().decode(rows[i].contents))};
  return null;
 }finally{db.close()}
}"""

def prepare_fixture():
    """Generate a normal save using the real rules without touching personal saves."""
    (ROOT/'work/watch-repair').mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='watch-service-fixture-') as saves:
        subprocess.run([os.environ.get('GODOT_BIN','godot'),'--headless','--path',str(ROOT/'godot'),
                        '--script','res://tests/watch_service_fixture.gd'],
                       env={**os.environ,'XDG_DATA_HOME':saves},check=True,
                       stdout=subprocess.PIPE,stderr=subprocess.STDOUT,text=True,timeout=30)
    return json.loads((ROOT/'work/watch-repair/browser-fixture.json').read_text())


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('url',nargs='?',default='http://127.0.0.1:4174/')
    parser.add_argument('--output',type=Path,default=ROOT/'work/watch-repair/browser')
    parser.add_argument('--phone-only',action='store_true')
    parser.add_argument('--desktop-only',action='store_true')
    parser.add_argument('--cleaning-only',action='store_true')
    parser.add_argument('--forgery-only',action='store_true')
    parser.add_argument('--mechanical-only',action='store_true')
    args=parser.parse_args()
    fixture=prepare_fixture()
    args.output.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        for mobile,width,height in ([(True,844,390)] if args.phone_only else [(False,1440,900)] if args.desktop_only else [(False,1440,900),(True,844,390)]):
            label='phone' if mobile else 'desktop'
            context=browser.new_context(viewport={'width':width,'height':height},has_touch=mobile,is_mobile=mobile,device_scale_factor=2 if mobile else 1,record_video_dir=str(args.output/label),record_video_size={'width':width,'height':height})
            page=context.new_page()
            errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda msg:errors.append(msg.text) if 'SCRIPT ERROR' in msg.text or msg.type=='error' and 'browser metadata' not in msg.text else None)
            def cmd(data): page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))',data)
            def snap(name): page.screenshot(path=str(args.output/f'{label}-{name}.png'))
            def status(): return page.evaluate('OrbitalTouch.state')
            def click(text):
                found=phone.locate(page,text)
                for _ in range(8):
                    if height*.16 < found['y'] < height*.86:break
                    x=min(width*.91,max(width*.72,found['x']))
                    page.mouse.move(x,height*.58)
                    page.mouse.wheel(0,350 if found['y']>=height*.86 else -350)
                    page.wait_for_timeout(150)
                    found=phone.locate(page,text)
                assert not found['disabled'],(text,status())
                print(label,'click',text,round(found['x']),round(found['y']),flush=True)
                if mobile:page.touchscreen.tap(found['x'],found['y'])
                else:page.mouse.click(found['x'],found['y'])
            def saved(predicate,timeout=15):
                deadline=time.monotonic()+timeout
                while time.monotonic()<deadline:
                    row=page.evaluate(READ_SAVE)
                    if row and predicate(row['state']):return row
                    page.wait_for_timeout(100)
                raise AssertionError('service progress did not reach WebFS')
            def sweep(partial=False):
                box=status()['repair_object']
                assert box and box['height']>60,box
                xs=[box['x']+box['width']*.08,box['x']+box['width']*.92]
                ys=[box['y']+box['height']*(.08+i*.045) for i in range(20 if not partial else 5)]
                points=[(box['x']+box['width']*.5,ys[0])]
                for i,y in enumerate(ys):points.extend([(xs[i%2],y),(xs[(i+1)%2],y)])
                if mobile:phone.touch_drag(context,page,points)
                else:
                    page.mouse.move(*points[0]);page.mouse.down()
                    for x,y in points[1:]:page.mouse.move(x,y);page.wait_for_timeout(20)
                    page.mouse.up()
                page.wait_for_timeout(450)
            def run_task_job(name):
                for attempt in range(100):
                    s=status();task=s.get('repair_task','')
                    if not task:
                        print(label,name,'completed',flush=True)
                        return
                    assert not s.get('repair_reason'),s
                    if task=='dust':sweep();continue
                    prior=s['repair_animation']
                    assert s.get('repair_targets'),s
                    target=s['repair_targets'][0]
                    # Every other action uses the real part contact target.
                    if attempt%2==0:
                        transfer=abs(target['drop_x']-target['x'])+abs(target['drop_y']-target['y'])>4
                        if transfer:
                            points=[(target['x']+(target['drop_x']-target['x'])*i/8,target['y']+(target['drop_y']-target['y'])*i/8) for i in range(9)]
                            if mobile:phone.touch_drag(context,page,points)
                            else:
                                page.mouse.move(*points[0]);page.mouse.down()
                                for x,y in points[1:]:page.mouse.move(x,y);page.wait_for_timeout(30)
                                page.mouse.up()
                        elif mobile:page.touchscreen.tap(target['x'],target['y'])
                        else:page.mouse.click(target['x'],target['y'])
                    else:click(s['repair_action'])
                    page.wait_for_timeout(220)
                    if attempt<2:snap(f'{name}-{task}-contact-{attempt}')
                    page.wait_for_function("""old=>{const s=OrbitalTouch.state,a=s.repair_animation;return s.repair_task!==old.task || a?.complete || a?.phase==='idle'&&a.step>old.step}""",arg={'task':task,'step':prior['step']},timeout=12000)
                    if status().get('repair_animation',{}).get('complete'):
                        page.wait_for_function('task=>OrbitalTouch.state.repair_task!==task',arg=task,timeout=5000)
                raise AssertionError(('unbounded work order',status()))
            try:
                page.goto(args.url)
                page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=90000)
                cmd({'type':'start'});phone.wait(page,'!s.title && !s.busy')
                cmd({'type':'page','page':'repair'});phone.wait(page,"s.workspace==='repair'")
                row=saved(lambda s:True)
                page.evaluate("""async input=>{const db=await new Promise(r=>{const q=indexedDB.open('/userfs');q.onsuccess=()=>r(q.result)});try{await new Promise((r,j)=>{const tx=db.transaction('FILE_DATA','readwrite');tx.objectStore('FILE_DATA').put({timestamp:new Date(),mode:33206,contents:new TextEncoder().encode(JSON.stringify(input.state))},input.key);tx.oncomplete=r;tx.onerror=j})}finally{db.close()}}""",{'key':row['key'],'state':fixture})
                page.reload();page.wait_for_function('window.OrbitalTouch?.state?.ready && OrbitalTouch.state.has_save',timeout=90000)
                cmd({'type':'start'});phone.wait(page,'!s.title && !s.busy')
                cmd({'type':'page','page':'repair'});phone.wait(page,"s.workspace==='repair'")
                if args.mechanical_only:
                    definitions=json.loads((ROOT/'godot/data/game_data.json').read_text())['itemDefs']
                    selected=fixture['inventory'][2]
                    selected_name=next(d['name'] for d in definitions if d['id']==selected['defId'])
                    click(selected_name);phone.wait(page,"s.repair_task==='open'")
                    run_task_job('mechanical');snap('mechanical-finished')
                    assert not errors,errors
                    print(label,'real mechanical cleaning/oiling/calibration/closure PASS',flush=True)
                    continue
                if args.forgery_only:
                    definitions=json.loads((ROOT/'godot/data/game_data.json').read_text())['itemDefs']
                    forged=fixture['inventory'][3]
                    forged_name=next(d['name'] for d in definitions if d['id']==forged['defId'])
                    click(forged_name)
                if not args.forgery_only:
                    before=status()['repair_grime']
                    box=status()['repair_object']
                    x,y=box['x']+box['width']*.5,box['y']+box['height']*.5
                    if mobile:
                        touch=context.new_cdp_session(page)
                        touch.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
                    else:
                        page.mouse.move(x,y);page.mouse.down()
                    page.wait_for_timeout(200)
                    contact=status()['repair_grime']
                    page.wait_for_timeout(700)
                    polished=status()['repair_grime']
                    assert polished < contact < before,('held cloth stopped fading grime',before,contact,polished)
                    snap('cloth-contact-fade')
                    if mobile:
                        touch.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]});touch.detach()
                    else:page.mouse.up()
                    page.wait_for_timeout(200)
                    released=status()['repair_grime']
                    page.wait_for_timeout(400)
                    assert status()['repair_grime']==released,'cloth keeps wiping after release'
                    sweep(partial=True)
                    after=status()['repair_grime'];assert 0<after<before,(before,after)
                    snap('cleaning-partial')
                    uid=status()['repair_uid']
                    saved(lambda s:bool(next(it for it in s['inventory'] if it['uid']==uid)['service']['operations'].get('dust',{})))
                    click('收起');phone.wait(page,"s.workspace===''")
                    cmd({'type':'page','page':'repair'});phone.wait(page,"s.workspace==='repair'")
                    assert abs(status()['repair_grime']-after)<.001,'page navigation reset cleaning'
                    page.reload();page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=90000)
                    cmd({'type':'start'});phone.wait(page,'!s.title && !s.busy')
                    cmd({'type':'page','page':'repair'});phone.wait(page,"s.workspace==='repair'")
                    assert abs(status()['repair_grime']-after)<.001,'reload reset cleaning'
                    run_task_job('cleaning');snap('cleaning-finished')
                    if args.cleaning_only:
                        assert not errors,errors
                        print(label,'continuous cloth fade, release, partial/page/reload and cleaning completion PASS',flush=True)
                        continue
                    click('北辰 N02 日历');phone.wait(page,"s.repair_task==='open'")
                    run_task_job('quartz');snap('quartz-finished')
                    if not mobile:
                        mechanical=fixture['inventory'][2]
                        definitions=json.loads((ROOT/'godot/data/game_data.json').read_text())['itemDefs']
                        mechanical_name=next(d['name'] for d in definitions if d['id']==mechanical['defId'])
                        click(mechanical_name);phone.wait(page,"s.repair_task==='open'")
                        run_task_job('mechanical');snap('mechanical-finished')
                definitions=json.loads((ROOT/'godot/data/game_data.json').read_text())['itemDefs']
                forged=fixture['inventory'][3];forged_name=next(d['name'] for d in definitions if d['id']==forged['defId'])
                click(forged_name)
                click('伪装加工');phone.wait(page,"s.repair_mode==='forge'")
                truth=forged['watch'];ap_before=status()['ap']
                for method,title in [('logo','重描标识'),('serial','伪造紫外编号'),('weight','配重掩盖缺件')]:
                    click(title);phone.wait(page,f"s.repair_task==='forge_{method}'")
                    # completed forgery remains on its last frame and is blocked from a repeat.
                    for attempt in range(30):
                        s=status()
                        if s.get('repair_reason') and s['repair_animation'].get('complete'):break
                        assert not s.get('repair_reason'),s
                        prior=s['repair_animation'];click(s['repair_action'])
                        page.wait_for_timeout(250)
                        if attempt==1:snap(f'forge-{method}-contact')
                        page.wait_for_function("""step=>{const a=OrbitalTouch.state.repair_animation;return a?.complete||a?.phase==='idle'&&a.step>step}""",arg=prior['step'],timeout=12000)
                    else:raise AssertionError(('forgery did not finish',method,status()))
                    snap(f'forge-{method}-finished')
                final=saved(lambda s:len(next(it for it in s['inventory'] if it['uid']==forged['uid']).get('forgery',{}).get('methods',{}))==3)['state']
                result=next(it for it in final['inventory'] if it['uid']==forged['uid'])
                assert result['watch']==truth and not result['working'] and not result['authentic'],'forgery changed physical truth'
                assert status()['ap']==ap_before-3,'forgery charged more than once'
                if mobile:
                    page.set_viewport_size({'width':667,'height':375});page.wait_for_timeout(500);snap('small-phone-forgery')
                    page.set_viewport_size({'width':390,'height':844});page.wait_for_timeout(250)
                    page.set_viewport_size({'width':844,'height':390});page.wait_for_timeout(500)
                    assert status()['repair_uid']==forged['uid'],'rotation changed physical identity'
                assert not errors,errors
                scope='all three physical forgeries' if args.forgery_only else 'cleaning partial/page/reload, real quartz'+('/mechanical' if not mobile else '')+' repair, all three physical forgeries'
                print(label,scope,'PASS',flush=True)
            except Exception:
                snap('failure');print(label,'FAIL status:',status(),flush=True)
                raise
            finally:context.close()
        browser.close()

if __name__=='__main__':main()
