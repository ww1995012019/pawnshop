"""Native acceptance for the full-viewport counter and three layered originals.
COUNTER_URL=http://localhost:4175/ python scripts/test-live-counter.py
"""
import importlib.util
import json
import mimetypes
import os
from pathlib import Path
import subprocess
import tempfile
from urllib.parse import unquote,urlparse
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
URL=os.environ.get('COUNTER_URL','http://localhost:4175/')
OUT=Path(os.environ.get('COUNTER_ARTIFACTS','/workspace/scratch/counter-v17'))
spec=importlib.util.spec_from_file_location('counter_phone',ROOT/'scripts/test-phone-touch.py')
phone=importlib.util.module_from_spec(spec);spec.loader.exec_module(phone)

def bundle(path):
    code=r'''
import {readFile} from 'node:fs/promises';import {resolve} from 'node:path';import {build} from 'esbuild';
const entry=(await readFile('web/entry.ts','utf8')).replace('__ART_EXT__','png');
const observe=`
import {UITransform as CTransform,Label as CLabel,Component as CComponent} from 'cc';
globalThis.__COUNTER_ACCEPTANCE__=()=>{
 const scene=director.getScene(),visit=(n,path='')=>[{name:n.name,path:path+'/'+n.name,x:n.position.x,y:-n.position.y,angle:n.angle,active:n.activeInHierarchy,text:n.getComponent(CLabel)?.string||'',width:n.getComponent(CTransform)?.width,height:n.getComponent(CTransform)?.height},...n.children.flatMap(c=>visit(c,path+'/'+n.name))];
 const viewport=director.root?.mainWindow?.width;
 return {nodes:scene?visit(scene).filter(n=>n.active):[]};
};`;
await build({stdin:{contents:entry+observe,resolveDir:resolve('web'),loader:'ts'},bundle:true,format:'esm',platform:'browser',target:'es2020',minify:true,alias:{cc:resolve('.cache/cocos/runtime/cc.js')},outfile:process.argv[2],tsconfig:resolve('tsconfig.web.json'),define:{'process.env.NODE_ENV':'"production"'}});
'''
    subprocess.run(['node','--input-type=module','-',str(path)],input=code,text=True,cwd=ROOT,check=True)

def context(browser,source,width=667,height=375,reduced=False):
    c=browser.new_context(viewport={'width':width,'height':height},screen={'width':width,'height':height},is_mobile=width<1000,has_touch=width<1000,**({'user_agent':phone.PHONE_UA} if width<1000 else {}))
    c.route(URL,lambda r:r.fulfill(path=str(ROOT/'web/index.html'),content_type='text/html'))
    c.route('**/game.js*',lambda r:r.fulfill(path=str(source),content_type='text/javascript'))
    def resource(r):
        rel=unquote(urlparse(r.request.url).path).split('/resources/',1)[-1];p=(ROOT/'assets/resources'/rel).resolve()
        if p.is_relative_to(ROOT/'assets/resources') and p.is_file():r.fulfill(path=str(p),content_type=mimetypes.guess_type(p)[0] or 'application/octet-stream')
        else:r.continue_()
    c.route('**/resources/**',resource)
    c.add_init_script("localStorage.setItem('orbital-phone-help-v1','seen');localStorage.setItem('orbital-tutorial-v1','done');localStorage.setItem('orbital-prefs-v3',JSON.stringify("+json.dumps({'sound':False,'reducedMotion':reduced,'largeText':False})+"))")
    return c

def nodes(page):return page.evaluate('window.__COUNTER_ACCEPTANCE__().nodes')
def diag(page):return page.evaluate('window.__ORBITAL__.diagnostics()')
def state(page):return phone.state(page)
def assembly(page,uid):return next(x for x in diag(page)['props'] if x['uid']==uid)
def part(page,uid,key):return next(n for n in nodes(page) if f'/live-prop-{uid}/' in n['path'] and n['name']==f'prop-part-{key}')
def tap(page,name,width=667,height=375):
    c=phone.control(page,name)
    assert c,f'Missing {name}; visible {[n["name"] for n in page.evaluate("window.__ORBITAL__.controls()")]} '
    scale=min(width/1600,height/900);x=(width-1600*scale)/2+(c['x']+c['w']/2)*scale;y=(height-900*scale)/2+(c['y']+c['h']/2)*scale
    if width<1000:page.touchscreen.tap(x,y)
    else:page.mouse.click(x,y)
    page.wait_for_timeout(280)

def start(c):
    page=c.new_page();page.goto(URL);page.wait_for_function('window.__ORBITAL__&&window.__COUNTER_ACCEPTANCE__',timeout=120000)
    tap(page,'title-start',page.viewport_size['width'],page.viewport_size['height']);phone.idle(page);return page

def engine_touch(page,kind,contact_id,name='',dx=0,dy=0):
    # Synthetic two-contact regression through Cocos DOM listeners; native CDP drives primary gestures above/below.
    page.evaluate(r'''({kind,id,name,dx,dy})=>{
      const canvas=document.getElementById('GameCanvas');window.__regressionTouches??={};
      if(kind==='touchstart'){
        const c=window.__ORBITAL__.controls().find(c=>c.name===name),s=375/900;
        window.__regressionTouches[id]={identifier:id,target:canvas,clientX:(667-1600*s)/2+(c.x+c.w/2)*s,clientY:(c.y+c.h/2)*s,radiusX:1,radiusY:1,rotationAngle:0,force:.5};
      }
      const t=window.__regressionTouches[id];t.clientX+=dx;t.clientY+=dy;
      const changed=[new Touch(t)];if(kind==='touchend'||kind==='touchcancel')delete window.__regressionTouches[id];
      const touches=Object.values(window.__regressionTouches).map(p=>new Touch(p));
      canvas.dispatchEvent(new TouchEvent(kind,{bubbles:true,cancelable:true,touches,targetTouches:touches,changedTouches:changed}));
    }''',{'kind':kind,'id':contact_id,'name':name,'dx':dx,'dy':dy})
    page.wait_for_timeout(100)

def close_menu(page):
    assert any(n['name']=='modal-overlay' for n in nodes(page)), 'Second contact did not open Menu'
    page.keyboard.press('Escape');page.wait_for_timeout(150)
    assert not any(n['name']=='modal-overlay' for n in nodes(page))

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    with tempfile.TemporaryDirectory(prefix='live-counter-') as temp,sync_playwright() as p:
        source=Path(temp)/'game.js';bundle(source)
        browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
        c=context(browser,source);page=start(c);errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
        initial=state(page);ids={i['defId']:i['uid'] for i in initial['inventory']}
        assert all(phone.control(page,'scene-display-'+ids[x]) for x in ['ITM-001','ITM-002','ITM-003'])
        phone.check_targets(page,667,375)
        page.screenshot(path=str(OUT/'counter-phone.png'))
        # A canceled real finger drag leaves the same inventory and rack, without opening a workpad.
        uid=ids['ITM-001'];card=phone.control(page,'scene-display-'+uid);s=min(667/1600,375/900)
        x=(card['x']+card['w']/2)*s;y=(card['y']+card['h']/2)*s
        session=c.new_cdp_session(page)
        session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
        session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+20,'y':y+55}]})
        page.wait_for_timeout(80)
        assert any(n['name']=='held-scene-origin' for n in nodes(page)), 'Touch move never lifted the actual rack object'
        session.send('Input.dispatchTouchEvent',{'type':'touchCancel','touchPoints':[]})
        page.wait_for_timeout(100)
        assert state(page)==initial and not diag(page)['counterFocus']
        assert not any(n['name']=='held-scene-origin' for n in nodes(page))
        # Dropping that original onto the work mat opens it once; the source really follows the finger.
        session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
        for dy in [15,40,70]:
            session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x+10,'y':y+dy}]})
            page.wait_for_timeout(40)
        lifted=next(n for n in nodes(page) if n['name']=='scene-display-'+uid)
        assert lifted['y']>card['y']+60, 'The actual prop did not follow the finger'
        session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
        page.wait_for_timeout(300)
        assert diag(page)['counterFocus'] and state(page)==initial
        assert not any(n['name']=='held-scene-origin' for n in nodes(page))
        print('Rack originals, large targets, native drag cancellation and drop passed.',flush=True)
        # WATER: same cap and cartridge move independently, then normal CHECK charges once.
        assert diag(page)['counterFocus'],'Native rack pick did not open the workpad'
        before=state(page);closed=part(page,uid,'cap')
        tap(page,f'prop-{uid}-cap');opened=part(page,uid,'cap')
        assert assembly(page,uid)['open'] and opened['y']<closed['y']-20
        target=phone.control(page,f'prop-{uid}-filter');s=min(667/1600,375/900)
        x=(target['x']+target['w']/2)*s;y=(target['y']+target['h']/2)*s
        # OS cancel is distinct from releasing outside the moving component.
        session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
        session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y-60}]})
        page.wait_for_timeout(80)
        session.send('Input.dispatchTouchEvent',{'type':'touchCancel','touchPoints':[]});page.wait_for_timeout(250)
        assert not assembly(page,uid)['extracted'] and state(page)==before
        session.send('Input.dispatchTouchEvent',{'type':'touchStart','touchPoints':[{'x':x,'y':y}]})
        for dy in [10,25,40,60]:
            session.send('Input.dispatchTouchEvent',{'type':'touchMove','touchPoints':[{'x':x,'y':y-dy}]})
            page.wait_for_timeout(60)
        session.send('Input.dispatchTouchEvent',{'type':'touchEnd','touchPoints':[]})
        page.wait_for_timeout(300)
        assert assembly(page,uid)['extracted'], 'Normal out-of-target release discarded the lifted filter'
        assert part(page,uid,'filter')['x']<230
        assert state(page)==before
        page.screenshot(path=str(OUT/'water-open.png'))
        tap(page,'counter-record-observation');after=state(page)
        assert after['ap']==before['ap']-1 and after['cash']==before['cash'] and len(after['inventory'])==len(before['inventory'])
        assert 'TOL-001' in next(i for i in after['inventory'] if i['uid']==uid)['evidence']
        tap(page,'counter-record-observation');assert state(page)['ap']==after['ap']
        tap(page,'counter-inspect-original');assert diag(page)['selected']==uid and assembly(page,uid)['extracted']
        page.screenshot(path=str(OUT/'water-inspection.png'))
        tap(page,'button-01 柜台');tap(page,'counter-return-original');assert not diag(page)['counterFocus']
        engine_touch(page,'touchstart',79,'scene-display-'+uid)
        engine_touch(page,'touchstart',80,'button-菜单');engine_touch(page,'touchend',80)
        engine_touch(page,'touchend',79);assert not diag(page)['counterFocus']
        close_menu(page)
        # MUG: lid, detachable heater and dial are real independent pieces.
        uid=ids['ITM-002'];tap(page,'scene-display-'+uid);before=state(page)
        engine_touch(page,'touchstart',77,f'prop-{uid}-dial')
        engine_touch(page,'touchstart',78,'button-菜单');engine_touch(page,'touchend',78)
        prior=assembly(page,uid)
        engine_touch(page,'touchmove',77,dx=50);engine_touch(page,'touchend',77)
        assert assembly(page,uid)==prior and state(page)==before
        close_menu(page)
        tap(page,f'prop-{uid}-lid');tap(page,f'prop-{uid}-heater');assert assembly(page,uid)['open'] and assembly(page,uid)['extracted']
        tap(page,f'prop-{uid}-power');tap(page,f'prop-{uid}-dial');tap(page,f'prop-{uid}-dial')
        assert .65<=assembly(page,uid)['dial']<=.85 and assembly(page,uid)['power']
        assert state(page)==before
        phone.check_targets(page,667,375)
        page.screenshot(path=str(OUT/'mug-heating.png'))
        tap(page,'counter-record-observation');assert state(page)['ap']==before['ap']-1
        tap(page,'counter-return-original')
        # LAMP: each independently hinged panel opens; power changes the live light cone.
        uid=ids['ITM-003'];tap(page,'scene-display-'+uid);before=state(page);closed=part(page,uid,'leaf-0')
        for i in range(3):tap(page,f'prop-{uid}-leaf-{i}')
        tap(page,f'prop-{uid}-power')
        assert assembly(page,uid)['leaves']==[1,1,1] and assembly(page,uid)['power']
        assert part(page,uid,'leaf-0')['angle']>closed['angle']+20
        assert state(page)==before
        phone.check_targets(page,667,375)
        page.screenshot(path=str(OUT/'lamp-open.png'))
        tap(page,'counter-record-observation');assert state(page)['ap']==before['ap']-1
        page.keyboard.press('Escape');page.wait_for_timeout(200)
        # Explicit return is always available, even if Escape follows the game's pause convention.
        if diag(page)['page']=='settings':tap(page,'button-01 柜台')
        if diag(page)['counterFocus']:tap(page,'counter-return-original')
        assert state(page)['cash']==initial['cash'] and len(state(page)['inventory'])==len(initial['inventory'])
        assert not errors,errors;c.close()
        for width,height in [(1920,910),(844,390)]:
            c=context(browser,source,width,height);page=start(c)
            page.screenshot(path=str(OUT/f'counter-{width}.png'))
            b=diag(page)['viewport'];background=next(n for n in nodes(page) if n['name']=='full-viewport-scene')
            assert background['width']>=b['width']-.1 and background['height']>=b['height']-.1
            if width<1000:phone.check_targets(page,width,height)
            else:
                before=state(page);uid=next(i['uid'] for i in before['inventory'] if i['defId']=='ITM-001')
                card=phone.control(page,'scene-display-'+uid);s=min(width/1600,height/900)
                x=(width-1600*s)/2+(card['x']+card['w']/2)*s;y=(height-900*s)/2+(card['y']+card['h']/2)*s
                page.mouse.move(x,y);page.mouse.down();page.mouse.move(x+25,y+120,steps=8);page.mouse.up();page.wait_for_timeout(300)
                assert diag(page)['counterFocus'] and state(page)==before
                tap(page,'counter-return-original',width,height)
            c.close()
        # Reduced motion keeps every part functional and all preparation free.
        c=context(browser,source,reduced=True);page=start(c);uid=ids['ITM-001'];before=state(page)
        tap(page,'scene-display-'+uid);tap(page,f'prop-{uid}-cap');tap(page,f'prop-{uid}-filter')
        assert assembly(page,uid)['extracted'] and state(page)==before
        c.close();browser.close()
    print('Native three-prop counter: independent parts, real UID, exact AP, return/inspection, full-scene bounds and reduced motion passed.',flush=True)
if __name__=='__main__':main()
