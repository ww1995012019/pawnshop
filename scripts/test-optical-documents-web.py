#!/usr/bin/env python3
"""Real WebGL colour, pointer ownership and non-modal paper regression.

The optional --record-red records the old pack's failures without asserting them,
for diagnosis. Fixture generation completes before Chromium is launched.
"""
import argparse
import importlib.util
import io
import json
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
            for view,width,height,mobile in ([('portrait',390,844,True)] if args.phone_only else [('landscape',844,390,True)] if args.landscape_only else [('desktop',1440,900,False)] if args.desktop_only else [('desktop',1440,900,False),('landscape',844,390,True),('portrait',390,844,True)]):
                context=browser.new_context(viewport={'width':width,'height':height},has_touch=True,is_mobile=mobile,device_scale_factor=2 if mobile else 1)
                # Install before Godot binds WebGL methods; this is test-side only.
                context.add_init_script('('+PROBE+')()')
                page=context.new_page();errors=[]
                page.on('pageerror',lambda e:errors.append(str(e)))
                page.on('console',lambda m:errors.append(m.text) if any(e in m.text for e in ['SCRIPT ERROR','SHADER ERROR','Error compiling shader']) else None)
                def cmd(data):page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))',data)
                def loc(text):
                    page.evaluate('window.__orbitalLocated=null');cmd({'type':'locate','text':text});page.wait_for_function('window.__orbitalLocated!==null');return page.evaluate('__orbitalLocated')
                def physical(x,y):return (width-y,x) if mobile and height>width else (x,y)
                def move(x,y):
                    (page.touchscreen.tap if mobile else page.mouse.move)(*physical(x,y))
                def click(text):
                    r=loc(text);assert r['found'] and not r['disabled'],(text,r)
                    (page.touchscreen.tap if mobile else page.mouse.click)(*physical(r['x'],r['y']));page.wait_for_timeout(350);return r
                def snap(name):
                    data=page.screenshot(path=str(args.output/f'{view}-{name}.png'))
                    return Image.open(io.BytesIO(data)).convert('RGB')
                def boot():page.goto('http://127.0.0.1:4174/');page.wait_for_function('OrbitalTouch?.state?.ready',timeout=90000)
                boot();cmd({'type':'start'});page.wait_for_function('!OrbitalTouch.state.title && !OrbitalTouch.state.busy');cmd({'type':'arrive'});page.wait_for_timeout(1500)
                row=page.evaluate(service.READ_SAVE);assert row
                for model in (['WCH-020'] if mobile else fixtures):
                    page.goto('http://127.0.0.1:4174/godot-license.txt');page.evaluate(WRITE_SAVE,{'key':row['key'],'state':fixtures[model]});boot()
                    page.wait_for_function('OrbitalTouch.state.has_save');cmd({'type':'start'});page.wait_for_function('!OrbitalTouch.state.title && !OrbitalTouch.state.busy');cmd({'type':'page','page':'inspect'});page.wait_for_function("OrbitalTouch.state.workspace==='inspect'")
                    page.wait_for_function('([uid,title])=>OrbitalTouch.state.inspection_uid===uid && OrbitalTouch.state.detail_title===title',arg=[fixtures[model]['inventory'][0]['uid'],names[model]]);print(view,model,page.evaluate('OrbitalTouch.state.detail_title'),flush=True)
                    assert page.evaluate('OrbitalTouch.state.notice_owned && OrbitalTouch.state.notice_visible'),'wanted fixture must be owned and open'
                    cmd({'type':'tool','tool':'TOL-001'});page.wait_for_function("OrbitalTouch.state.inspection_current==='TOL-001' && !OrbitalTouch.state.inspection_busy")
                    # Park outside the watch while preserving the selected tool's layout.
                    button=loc('定位并固定标识');move(button['x']+90,button['y']-160);page.wait_for_timeout(300)
                    if not mobile:
                        source=snap(model+'-source');click('定位并固定标识');move(button['x']+160,button['y']-160);page.wait_for_timeout(300);lens=snap(model+'-lens')
                        # Interior below the masked source-logo band, away from rim and glass sheen.
                        # Derive the center from the fixed bench geometry and use matching
                        # source coordinates under 2.2x GPU magnification.
                        unit=button['width']/523.0;cx=button['x'];cy=button['y']-354*unit
                        comparisons=[]
                        for dx,dy in [(-47,58),(-37,58),(-27,58),(27,58),(43,58)]:
                            sx=round(cx+dx*unit/2.2);sy=round(cy+dy*unit/2.2)
                            lx=round(cx+dx*unit);ly=round(cy+dy*unit)
                            a=source.getpixel((sx,sy));b=lens.getpixel((lx,ly));comparisons.append({'source':a,'lens':b,'source_xy':[sx,sy],'lens_xy':[lx,ly]})
                        saturated=sum(min(r['lens'])>=250 for r in comparisons)
                        source_saturated=sum(min(r['source'])>=250 for r in comparisons)
                        error=statistics.median(sum(abs(a-b) for a,b in zip(r['source'],r['lens']))/3 for r in comparisons)
                        report[model]={'samples':comparisons,'median_channel_error':error,'saturated':saturated}
                        check(saturated<=source_saturated and error<28,f'{model} magnified dial retains source colour (error={error:.1f}, white={saturated}/5)')
                        if model!='WCH-020':continue
                        click('解除固定')
                    else:
                        click('定位并固定标识');page.wait_for_function('OrbitalTouch.state.appraisal.count===1',timeout=15000);page.wait_for_timeout(3200);snap(model+'-touch-lens');click('解除固定')
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
                    click('@document_close');cmd({'type':'tool','tool':'TOL-002'});page.wait_for_function("OrbitalTouch.state.inspection_current==='TOL-002' && !OrbitalTouch.state.inspection_busy")
                    before=page.evaluate('OrbitalTouch.state.ap');cmd({'type':'manual'});page.wait_for_timeout(350)
                    close=loc('@document_close');unit=close['width']/44
                    move(close['x']-200*unit,close['y']+180*unit);page.wait_for_timeout(1100)
                    check(page.evaluate('OrbitalTouch.state.appraisal.count')==1 and page.evaluate('OrbitalTouch.state.ap')==before,f'{view} paper hover does not collect hidden UV evidence or AP')
                    snap('paper-owns-pointer');click('@document_close');click('定位并固定编号');page.wait_for_function('n=>OrbitalTouch.state.appraisal.count===n',arg=2,timeout=15000)
                    check(True,f'{view} observation resumes outside paper and explicit pin works')
                check(not errors,view+' no shader/script/browser errors '+str(errors[:3]));context.close()
        finally:browser.close()
    report['failures']=failures;(args.output/'results.json').write_text(json.dumps(report,indent=2))
    if failures and not args.record_red:raise AssertionError(failures)

if __name__=='__main__':main()
