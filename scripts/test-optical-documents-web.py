#!/usr/bin/env python3
"""Real WebGL colour, pointer ownership and non-modal paper regression.

The optional --record-red records the old pack's failures without asserting them,
for diagnosis. Fixture generation completes before Chromium is launched.
"""
import argparse
import importlib.util
import io
import json
import math
import os
from pathlib import Path
import shutil
import statistics
import subprocess
import tempfile
from PIL import Image
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
spec = importlib.util.spec_from_file_location('optical_service', ROOT/'scripts/test-watch-service-web.py')
service = importlib.util.module_from_spec(spec)
spec.loader.exec_module(service)
WRITE_SAVE = """async input=>{const db=await new Promise(r=>{const q=indexedDB.open('/userfs');q.onsuccess=()=>r(q.result)});await new Promise((r,j)=>{const tx=db.transaction('FILE_DATA','readwrite');tx.objectStore('FILE_DATA').put({timestamp:new Date(),mode:33206,contents:new TextEncoder().encode(JSON.stringify(input.state))},input.key);tx.oncomplete=r;tx.onerror=j});db.close()}"""
PROBE = """()=>{
 window.opticalProbe={reads:0,mips:0,frames:[],last:0};
 const dpr=devicePixelRatio;
 Object.defineProperty(window,'devicePixelRatio',{configurable:true,get(){opticalProbe.reads++;return dpr}});
 for(const cls of [WebGLRenderingContext,WebGL2RenderingContext]){
  const original=cls.prototype.generateMipmap;
  cls.prototype.generateMipmap=function(...args){opticalProbe.mips++;return original.apply(this,args)};
 }
 function tick(t){if(opticalProbe.last)opticalProbe.frames.push(t-opticalProbe.last);opticalProbe.last=t;requestAnimationFrame(tick)}
 requestAnimationFrame(tick);
}"""


IDLE_SAMPLE = """async () => {
 const result={settled:false,warmup:[],samples:[],reads:null,frames:0};
 let active=true,timer;
 // Sampling in a task after rAF includes the engine's callbacks for that
 // rendered frame, regardless of whether our probe registered first.
 const frame=()=>new Promise(resolve=>requestAnimationFrame(()=>setTimeout(resolve,0)));
 const deadline=new Promise(resolve=>{timer=setTimeout(()=>{
  active=false;result.error='idle sampling exceeded 45 seconds';resolve(result);
 },45000)});
 const run=async()=>{
  opticalProbe.reads=0;
  let previous=0,quiet=0;
  for(let i=0;i<30 && active;i++){
   await frame();if(!active)return result;
   const total=opticalProbe.reads,delta=total-previous;previous=total;
   result.warmup.push(delta);quiet=delta===0?quiet+1:0;
   if(i+1>=6 && quiet>=3){result.settled=true;break}
  }
  if(!result.settled){result.error='paper did not become read-free within 30 rendered frames';return result}
  opticalProbe.reads=0;previous=0;
  for(let i=0;i<8 && active;i++){
   await frame();if(!active)return result;
   const total=opticalProbe.reads;result.samples.push(total-previous);previous=total;
  }
  result.reads=opticalProbe.reads;result.frames=result.samples.length;
  return result;
 };
 const measured=await Promise.race([run(),deadline]);
 active=false;clearTimeout(timer);return measured;
}"""


def main():
    parser=argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--record-red',action='store_true')
    parser.add_argument('--phone-only',action='store_true')
    parser.add_argument('--desktop-only',action='store_true')
    parser.add_argument('--landscape-only',action='store_true')
    parser.add_argument('--colour-only',action='store_true',help='Check measured desktop lens colours without the paper/idle scenarios')
    parser.add_argument('--output',type=Path,default=ROOT/'work/watch-expansion/optical/web')
    args=parser.parse_args();args.output.mkdir(parents=True,exist_ok=True)
    (ROOT/'work/watch-expansion/optical').mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='optical-fixture-') as saves:
        subprocess.run([os.environ.get('GODOT_BIN','godot'),'--headless','--path',str(ROOT/'godot'),'--script','res://tests/optical_document_fixture.gd'],env={**os.environ,'XDG_DATA_HOME':saves},check=True,stdout=subprocess.PIPE,stderr=subprocess.STDOUT,timeout=30)
    fixtures=json.loads((ROOT/'work/watch-expansion/optical/fixtures.json').read_text())
    names={d['id']:d['name'] for d in json.loads((ROOT/'godot/data/game_data.json').read_text())['itemDefs']}
    failures=[];report={}
    def check(ok,message):
        print(('PASS ' if ok else 'FAIL ')+message,flush=True)
        if not ok:failures.append(message)
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM_EXECUTABLE') or shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        try:
            for view,width,height,mobile in ([('desktop',1440,900,False)] if args.colour_only else [('portrait',390,844,True)] if args.phone_only else [('landscape',844,390,True)] if args.landscape_only else [('desktop',1440,900,False)] if args.desktop_only else [('desktop',1440,900,False),('landscape',844,390,True),('portrait',390,844,True)]):
                context=browser.new_context(viewport={'width':width,'height':height},has_touch=True,is_mobile=mobile,device_scale_factor=2 if mobile else 1)
                # Install before Godot binds WebGL methods; this is test-side only.
                context.add_init_script('('+PROBE+')()')
                page=context.new_page();errors=[]
                page.on('pageerror',lambda e:errors.append(str(e)))
                page.on('console',lambda m:errors.append(m.text) if any(e in m.text for e in ['SCRIPT ERROR','SHADER ERROR','Error compiling shader']) else None)
                def cmd(data):page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))',data)
                def loc(text):
                    page.evaluate('window.__orbitalLocated=null');cmd({'type':'locate','text':text});wait('window.__orbitalLocated!==null');return page.evaluate('__orbitalLocated')
                # Bridge geometry uses the effective landscape canvas; touches
                # use the physical screen even when an upright phone is rotated.
                def physical(x,y):return page.evaluate('([x,y])=>OrbitalTouch.toPhysical(x,y)',[x,y])
                def move(x,y):
                    # Hover must not activate document contents on a phone.
                    # Real finger gestures use the explicit CDP touch path.
                    page.mouse.move(*physical(x,y))
                def click(text):
                    r=loc(text);assert r['found'] and not r['disabled'],(text,r)
                    (page.touchscreen.tap if mobile else page.mouse.click)(*physical(r['x'],r['y']));page.wait_for_timeout(350);return r
                def wait_wanted_visible(expected):
                    # The real document owns input. Its visible close key is
                    # authoritative for this gesture fixture, not a saved pref.
                    for attempt in range(20):
                        hit=loc('@wanted_close')
                        if bool(hit['found'])==expected:return
                        page.wait_for_timeout(150)
                    raise AssertionError(('wanted document visibility',expected,hit,page.evaluate('OrbitalTouch.state')))
                phase={'name':'boot'}
                def progress(name):
                    phase['name']=name
                    print(view+' '+name,flush=True)
                def wait(condition,**options):
                    try:return page.wait_for_function(condition,**options)
                    except Exception:
                        name=phase['name'].replace(' ','-')
                        try:
                            snap('wait-timeout-'+name)
                            print('OPTICAL WAIT TIMEOUT',json.dumps({'phase':phase['name'],'condition':condition,'state':page.evaluate('OrbitalTouch.state')}),flush=True)
                        except Exception as diagnostic_error:print('OPTICAL TIMEOUT DIAGNOSTIC ERROR',str(diagnostic_error),flush=True)
                        raise
                def snap(name):
                    data=page.screenshot(path=str(args.output/f'{view}-{name}.png'))
                    return Image.open(io.BytesIO(data)).convert('RGB')
                def lens_geometry():
                    # Geometry uses framebuffer pixels; image samples and input
                    # use CSS pixels, with the context's known DPR.
                    page.wait_for_timeout(220)
                    row=page.evaluate('OrbitalTouch.state.inspection_lens')
                    assert row and 'handle_x' in row,row
                    ratio=2 if mobile else 1
                    return {k:(v/ratio if isinstance(v,(int,float)) and not isinstance(v,bool) else v) for k,v in row.items()}
                def drag_lens_to(destination):
                    geometry=lens_geometry()
                    start=(geometry['handle_x'],geometry['handle_y'])
                    finish=(start[0]+destination[0]-geometry['x'],start[1]+destination[1]-geometry['y'])
                    page.mouse.move(*physical(*start));page.mouse.down()
                    page.mouse.move(*physical(*finish),steps=8);page.mouse.up()
                    return lens_geometry()
                def check_lens_drag():
                    # Companion geometry is in framebuffer pixels; native phone
                    # input uses those same upright axes after DPR conversion.
                    ratio=2 if mobile else 1
                    lens=lens_geometry
                    def unchanged(a,b):return math.hypot(a['x']-b['x'],a['y']-b['y'])<1.5
                    initial=lens();mat=page.evaluate('OrbitalTouch.state.inspection_mat')
                    blank=(mat['x']/ratio+8,mat['y']/ratio+8)
                    move(*blank)
                    hovered=lens()
                    check(unchanged(initial,hovered),f'{view} ordinary hover never moves the magnifier')
                    (page.touchscreen.tap if mobile else page.mouse.click)(*physical(*blank))
                    check(unchanged(initial,lens()),f'{view} blank-mat press never teleports the magnifier')
                    start=(initial['handle_x'],initial['handle_y']);delta=(18,-8)
                    finish=(start[0]+delta[0],start[1]+delta[1])
                    if mobile:
                        cdp=context.new_cdp_session(page)
                        x,y=physical(*start);cdp.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y,'id':0}]})
                    else:
                        page.mouse.move(*physical(*start));page.mouse.down()
                    check(unchanged(initial,lens()),f'{view} handle grab preserves its pointer offset')
                    if mobile:
                        x,y=physical(*finish);cdp.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y,'id':0}]})
                    else:page.mouse.move(*physical(*finish),steps=5)
                    held=lens()
                    drag_ok=math.hypot(held['x']-initial['x']-delta[0],held['y']-initial['y']-delta[1])<2.5 and held['dragging']
                    if not drag_ok:
                        print('LENS DRAG GEOMETRY',json.dumps({'view':view,'initial':initial,'held':held,'expected':{'x':initial['x']+delta[0],'y':initial['y']+delta[1]},'mat':mat,'css_delta':delta}),flush=True)
                    check(drag_ok,f'{view} held real handle drag moves the lens')
                    if mobile:cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
                    else:page.mouse.up()
                    released=lens();move(start[0]-20,start[1]-25)
                    check(unchanged(released,lens()),f'{view} release freezes the lens during later pointer movement')
                    snap('physical-lens-drag')
                def settle_phone_view():
                    # Command-based fixture startup has no user gesture. Match
                    # a player's first touch before measuring controls, since
                    # landscape touch-up may enter fullscreen and resize.
                    page.touchscreen.tap(2,height-2)
                    previous=None
                    for attempt in range(12):
                        page.wait_for_timeout(200)
                        geometry=page.evaluate('''()=>{const r=document.querySelector('#canvas').getBoundingClientRect();return {fullscreen:!!document.fullscreenElement,hidden:document.hidden,width:innerWidth,height:innerHeight,canvas:{x:r.x,y:r.y,width:r.width,height:r.height}}}''')
                        if geometry==previous:
                            print('PHONE VIEW READY',json.dumps(geometry),flush=True)
                            return
                        previous=geometry
                    raise AssertionError(('phone fullscreen/layout did not settle',previous))
                def boot():page.goto('http://127.0.0.1:4174/');wait('OrbitalTouch?.state?.ready',timeout=90000)
                boot();cmd({'type':'start'});wait('!OrbitalTouch.state.title && !OrbitalTouch.state.busy');cmd({'type':'arrive'});page.wait_for_timeout(1500)
                row=page.evaluate(service.READ_SAVE);assert row
                for model in (['WCH-020'] if mobile else fixtures):
                    page.goto('http://127.0.0.1:4174/godot-license.txt');page.evaluate(WRITE_SAVE,{'key':row['key'],'state':fixtures[model]});boot()
                    wait('OrbitalTouch.state.has_save');cmd({'type':'start'});wait('!OrbitalTouch.state.title && !OrbitalTouch.state.busy')
                    assert page.evaluate('OrbitalTouch.state.notice_owned && OrbitalTouch.state.notice_visible'),'wanted fixture must be owned and open'
                    if mobile:
                        # Close the existing paper before opening a new drawer;
                        # a newly appended overlay can cover its visible key.
                        settle_phone_view()
                        page.wait_for_timeout(600)
                        close_hit=click('@wanted_close')
                        try:wait_wanted_visible(False)
                        except Exception:
                            snap('wanted-close-failure')
                            print('WANTED CLOSE FAILURE',json.dumps({'hit':close_hit,'state':page.evaluate('OrbitalTouch.state'),'document':page.evaluate('({hidden:document.hidden,visibility:document.visibilityState,fullscreen:!!document.fullscreenElement})'),'close_still_visible':loc('@wanted_close')}),flush=True)
                            raise
                        progress('paper closed')
                        if page.evaluate('OrbitalTouch.state.notice_visible'):
                            print('WANTED VISIBILITY DIAGNOSTIC: close key hidden while saved visibility still true',flush=True)
                    cmd({'type':'page','page':'inspect'});wait("OrbitalTouch.state.workspace==='inspect'")
                    wait('([uid,title])=>OrbitalTouch.state.inspection_uid===uid && OrbitalTouch.state.detail_title===title',arg=[fixtures[model]['inventory'][0]['uid'],names[model]]);print(view,model,page.evaluate('OrbitalTouch.state.detail_title'),flush=True)
                    progress('inspect opened')
                    cmd({'type':'tool','tool':'TOL-001'});wait("OrbitalTouch.state.inspection_current==='TOL-001' && !OrbitalTouch.state.inspection_busy")
                    button=loc('定位并固定标识')
                    if not mobile:
                        # Move the actual held handle away before taking the
                        # unmagnified reference. Hovering no longer parks it.
                        geometry=lens_geometry();mat=page.evaluate('OrbitalTouch.state.inspection_mat')
                        parked=drag_lens_to((mat['x']+geometry['radius']*1.08,mat['y']+geometry['radius']*1.08))
                        # The wanted paper owns this pointer location and hides
                        # the unpinned loupe, keeping every source sample clear
                        # even in a narrow mat that limits the parking distance.
                        paper_close=loc('@wanted_close');paper_unit=paper_close['width']/44.0
                        move(paper_close['x']-100*paper_unit,paper_close['y']+100*paper_unit)
                        page.wait_for_timeout(300);source=snap(model+'-source')
                        click('定位并固定标识');geometry=lens_geometry();lens=snap(model+'-lens')
                        # Interior below the masked source-logo band, away from rim and glass sheen.
                        # Use the actual pinned centre/radius and matching source
                        # coordinates under the shader's 2.2x magnification.
                        unit=geometry['radius']/128.0;cx=geometry['x'];cy=geometry['y']
                        comparisons=[]
                        for dx,dy in [(-47,58),(-37,58),(-27,58),(27,58),(43,58)]:
                            sx=round(cx+dx*unit/2.2);sy=round(cy+dy*unit/2.2)
                            lx=round(cx+dx*unit);ly=round(cy+dy*unit)
                            a=source.getpixel((sx,sy));b=lens.getpixel((lx,ly));comparisons.append({'source':a,'lens':b,'source_xy':[sx,sy],'lens_xy':[lx,ly]})
                        saturated=sum(min(r['lens'])>=250 for r in comparisons)
                        source_saturated=sum(min(r['source'])>=250 for r in comparisons)
                        error=statistics.median(sum(abs(a-b) for a,b in zip(r['source'],r['lens']))/3 for r in comparisons)
                        report[model]={'samples':comparisons,'median_channel_error':error,'saturated':saturated,'pinned_geometry':geometry,'parked_geometry':parked}
                        check(saturated<=source_saturated and error<28,f'{model} magnified dial retains source colour (error={error:.1f}, white={saturated}/5)')
                        if args.colour_only or model!='WCH-020':continue
                        click('解除固定')
                    else:
                        click('定位并固定标识');wait('OrbitalTouch.state.appraisal.count===1',timeout=15000);progress('pin observed');page.wait_for_timeout(3200);snap(model+'-touch-lens');click('解除固定')
                    check_lens_drag()
                    progress('drag checked')
                    if mobile:
                        # Restore the owned/open wanted fixture through its real
                        # inventory control before paper and idle regressions.
                        cmd({'type':'page','page':'warehouse'});wait("OrbitalTouch.state.workspace==='warehouse'")
                        for attempt in range(2):
                            if loc('@wanted_close')['found']:break
                            click('@wanted_inventory')
                        wait_wanted_visible(True)
                        progress('paper restored')
                        # Return to the suspended inspector rather than append
                        # another overlay above the newly opened wanted paper.
                        cmd({'type':'close'});wait("OrbitalTouch.state.workspace==='inspect'");progress('history returned')
                        cmd({'type':'tool','tool':'TOL-001'});wait("OrbitalTouch.state.inspection_current==='TOL-001' && !OrbitalTouch.state.inspection_busy")
                        button=loc('定位并固定标识')
                    # Measure each paper while it stays open; do not depend on FPS.
                    for mode in ['wanted','closed','manual']:
                        if mode=='closed':click('@wanted_close')
                        if mode=='manual':cmd({'type':'manual'})
                        page.evaluate('opticalProbe.reads=0;opticalProbe.mips=0;opticalProbe.frames=[]')
                        idle=page.evaluate(IDLE_SAMPLE)
                        page.evaluate('opticalProbe.reads=0;opticalProbe.mips=0;opticalProbe.frames=[]')
                        for i in range(12):move(button['x']-35+i*6,button['y']-240);page.wait_for_timeout(20)
                        if mobile:
                            cdp=context.new_cdp_session(page)
                            path=[physical(button['x']-35+i*6,button['y']-210) for i in range(12)]
                            for i,(x,y) in enumerate(path):
                                cdp.send('Input.dispatchTouchEvent',{'type':'touchStart' if i==0 else 'touchMove','touchPoints':[{'x':x,'y':y,'id':0}]});page.wait_for_timeout(25)
                            cdp.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
                        data=page.evaluate('({reads:opticalProbe.reads,mips:opticalProbe.mips,frames:opticalProbe.frames})');data['idle_reads']=idle['reads'];data['idle_frames']=idle['frames'];data['idle_settled']=idle['settled'];data['idle_warmup']=idle['warmup'];data['idle_samples']=idle['samples'];data['idle_error']=idle.get('error','');report[view+'-'+mode]=data
                        print(view,mode,'warmup',data['idle_warmup'],'idle DPR',data['idle_reads'],'/',data['idle_frames'],'input DPR reads',data['reads'],'mip calls',data['mips'],'frames',len(data['frames']),flush=True)
                        check(data['idle_settled'] and data['idle_frames']==8 and data['idle_reads']==0,f'{view} idle {mode} avoids per-frame DPR bridge reads')
                        snap(mode+'-moving')
                    # Guide remains non-modal; pointer over its content cannot earn
                    # a new UV record or usage charge at a stale nested coordinate.
                    click('@document_close');cmd({'type':'tool','tool':'TOL-002'});wait("OrbitalTouch.state.inspection_current==='TOL-002' && !OrbitalTouch.state.inspection_busy")
                    before=page.evaluate('OrbitalTouch.state.ap');cmd({'type':'manual'});page.wait_for_timeout(350)
                    close=loc('@document_close');unit=close['width']/44
                    move(close['x']-200*unit,close['y']+180*unit);page.wait_for_timeout(1100)
                    check(not page.evaluate('OrbitalTouch.state.blocked') and page.evaluate('OrbitalTouch.state.appraisal.count')==1 and page.evaluate('OrbitalTouch.state.ap')==before,f'{view} non-modal paper hover does not collect hidden UV evidence or AP')
                    snap('paper-owns-pointer');click('@document_close');click('定位并固定编号');wait('n=>OrbitalTouch.state.appraisal.count===n',arg=2,timeout=15000)
                    check(True,f'{view} observation resumes outside paper and explicit pin works')
                check(not errors,view+' no shader/script/browser errors '+str(errors[:3]));context.close()
        finally:browser.close()
    report['failures']=failures;(args.output/'results.json').write_text(json.dumps(report,indent=2))
    if failures and not args.record_red:raise AssertionError(failures)

if __name__=='__main__':main()
