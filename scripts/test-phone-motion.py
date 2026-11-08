"""Real Cocos regression for the initialization shutter and phone action feedback.

Uses an observation-only private bundle; does not modify the production build or game state.
MOTION_URL=http://localhost:4175/ python scripts/test-phone-motion.py
Set MOTION_VIDEO=1 to also record raw video (requires Playwright FFmpeg).
"""
import importlib.util
import json
import mimetypes
import os
from pathlib import Path
import tempfile
from urllib.parse import unquote, urlparse
from playwright.sync_api import sync_playwright

ROOT = Path(__file__).resolve().parents[1]
URL = os.environ.get('MOTION_URL', 'http://localhost:4175/')
OUT = Path(os.environ.get('MOTION_ARTIFACTS', '/workspace/scratch/phone-motion-v16'))
CASE = os.environ.get('MOTION_CASE', 'all')

def module(name, file):
    spec = importlib.util.spec_from_file_location(name, Path(__file__).with_name(file))
    result = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(result)
    return result

phone = module('phone_touch', 'test-phone-touch.py')
observe = module('motion_observe', 'test-shutter-opening.py')

def context_for(browser, bundle, reduced=False, width=667, height=375, video=False):
    context = browser.new_context(viewport={'width': width, 'height': height},
        screen={'width': width, 'height': height}, is_mobile=True, has_touch=True,
        user_agent=phone.PHONE_UA,
        **({'record_video_dir': str(OUT / 'video'), 'record_video_size': {'width': width, 'height': height}} if video and os.environ.get('MOTION_VIDEO')=='1' else {}))
    context.route(URL, lambda r: r.fulfill(path=str(ROOT / 'web/index.html'), content_type='text/html'))
    context.route('**/game.js*', lambda r: r.fulfill(path=str(bundle), content_type='text/javascript'))
    def resource(route):
        relative = unquote(urlparse(route.request.url).path).split('/resources/', 1)[-1]
        path = (ROOT / 'assets/resources' / relative).resolve()
        if path.is_relative_to(ROOT / 'assets/resources') and path.is_file():
            route.fulfill(path=str(path), content_type=mimetypes.guess_type(path)[0] or 'application/octet-stream')
        else:
            route.continue_()
    context.route('**/resources/**', resource)
    context.add_init_script("localStorage.setItem('orbital-phone-help-v1','seen');localStorage.setItem('orbital-tutorial-v1','done');localStorage.setItem('orbital-prefs-v3',JSON.stringify(" + json.dumps({'sound':False,'reducedMotion':reduced,'largeText':False}) + "))")
    return context

def ready(context):
    page = context.new_page()
    page.goto(URL)
    page.wait_for_function('window.__ORBITAL__ && window.__SHUTTER_ACCEPTANCE__', timeout=120000)
    phone.tap(page, 'title-start', 667, 375)
    phone.idle(page)
    return page

def motion(page):
    return page.evaluate('window.__ORBITAL__.diagnostics().motion')

def tool_feedback(browser, bundle):
    context = context_for(browser, bundle, video=True)
    page = ready(context)
    page.evaluate("window.__ORBITAL__.open('inspect')")
    cases = [('TOL-001','phone-mark-0','magnify'),('TOL-002','phone-uv-scan','uv'),
             ('TOL-003','spectrum-0-plus','spectrum'),('TOL-004','phone-probe-0','probe'),
             ('TOL-005','phone-tare','scale'),('TOL-006','phone-load-plus','pulse')]
    for tool, action, kind in cases:
        phone.tap(page, 'tool-target-'+tool, 667, 375)
        phone.tap(page, 'phone-tool-actions', 667, 375)
        before = phone.state(page)
        assert any(n['name']=='phone-instrument-preview' for n in observe.nodes(page)), 'Phone tools need the current physical item in a live preview'
        if tool=='TOL-002':
            phone.tap(page, 'phone-uv-back', 667, 375)
        observe.tap(page, action, 667, 375, True)
        page.wait_for_timeout(130)
        phone.check_targets(page, 667, 375)
        assert any(n['kind']==kind for n in motion(page)['nodes']), f'{tool}: preparing an instrument produced no {kind} feedback'
        assert phone.state(page)==before, 'Instrument preparation must not charge AP or change economic state'
        early_motion=motion(page)
        page.evaluate('window.__SHUTTER_PAUSE__(true)')
        first=page.screenshot(path=str(OUT / f'{kind}-early.png'))
        page.evaluate('window.__SHUTTER_PAUSE__(false)')
        page.wait_for_timeout(240)
        page.evaluate('window.__SHUTTER_PAUSE__(true)')
        second=page.screenshot(path=str(OUT / f'{kind}-late.png'))
        page.evaluate('window.__SHUTTER_PAUSE__(false)')
        late_motion=motion(page)
        (OUT/f'{kind}-frames.json').write_text(json.dumps({'early':early_motion,'late':late_motion},indent=2))
        assert first!=second, f'{tool}: instrument feedback did not progress between frames; clocks {early_motion["ambientClock"]} / {late_motion["ambientClock"]}'
        phone.tap(page, 'phone-tool-return', 667, 375)
        page.wait_for_timeout(300)
        assert motion(page)['activeCount']==0, 'Closing an instrument must clean up its local feedback'
    context.close()
    print('Six phone instruments: visible changing frames, safe preparation, large controls and cleanup passed.', flush=True)

def transfer(browser, bundle):
    context = context_for(browser, bundle, video=True)
    page = ready(context)
    observe.tap(page, 'button-接待下一位来客', 667, 375, True)
    observed=page.wait_for_function("(()=>{const n=window.__ORBITAL__.diagnostics().motion.nodes.find(n=>n.kind==='handoff-contact-settle');if(n){window.__SHUTTER_PAUSE__(true);return n;}return false;})()", timeout=15000, polling=10)
    node=observed.json_value()
    page.screenshot(path=str(OUT / 'phone-handoff.png'))
    assert abs(node['x']+158-380)<28 and abs(node['y']+158-410)<28, f'Phone handoff still uses desktop coordinates: {node}'
    page.evaluate('window.__SHUTTER_PAUSE__(false)')
    phone.idle(page)
    page.evaluate("window.__ORBITAL__.dispatch({type:'REFUSE'})")
    page.wait_for_timeout(90)
    assert any(n['kind']=='npc-walk-out' and n['x']<160 for n in motion(page)['nodes']), 'Phone customer exits from the desktop location'
    page.screenshot(path=str(OUT / 'phone-exit.png'))
    phone.idle(page)
    context.close()
    print('Phone arrival/transfer/exit align with the real left-hand counter.', flush=True)

def repair(browser, bundle):
    context = context_for(browser, bundle)
    page = ready(context)
    fixture=phone.state(page)
    fixture['inventory']=[fixture['inventory'][0]]
    fixture['inventory'][0].update(defId='ITM-081',x=0,y=0,condition=.6,working=False,repaired=False,evidence=[])
    uid=fixture['inventory'][0]['uid']
    page.evaluate("s=>localStorage.setItem('orbital-save-v3',JSON.stringify(s))",fixture)
    page.reload()
    page.wait_for_function('window.__ORBITAL__', timeout=120000)
    page.evaluate("uid=>window.__ORBITAL__.open('repair',uid)",uid)
    before=phone.state(page)
    for i,kind in enumerate(['magnify','assemble','probe']):
        observe.tap(page,'phone-repair-step',667,375,True)
        page.wait_for_timeout(320)
        assert any(n['kind']==kind and n['x']>1100 for n in motion(page)['nodes']), f'Repair stage {i+1} has no feedback on the actual phone item'
        after=phone.state(page)
        assert after['ap']==before['ap'] and after['cash']==before['cash'] and after['materials']==before['materials']
        assert after['repairProgress'][uid]==i+1
        page.evaluate('window.__SHUTTER_PAUSE__(true)')
        page.screenshot(path=str(OUT / f'phone-repair-{i}.png'))
        page.evaluate('window.__SHUTTER_PAUSE__(false)')
        page.wait_for_timeout(1050)
    context.close()
    print('Phone repair preparations animate on the selected original without early charges.', flush=True)

def loader(browser, bundle):
    for width,height in [(667,375),(844,390),(1600,900)]:
        context=context_for(browser,bundle,width=width,height=height)
        context.add_init_script("localStorage.setItem('orbital-save-v3',JSON.stringify({schema:3,day:6}))")
        context.route('**/game.js*',lambda r:r.fulfill(body='',content_type='text/javascript'))
        page=context.new_page()
        page.goto(URL)
        page.wait_for_timeout(160)
        page.screenshot(path=str(OUT / f'loading-{width}.png'))
        assert page.locator('#loading-day').count(), 'Initial HTML still shows the blue loader instead of the date shutter'
        assert page.locator('#loading-day').inner_text()=='第 6 天'
        assert 'radial-gradient' not in page.locator('#loading').evaluate('(e)=>getComputedStyle(e).backgroundImage')
        assert page.locator('#loading').evaluate('(e)=>e.scrollWidth<=innerWidth && e.scrollHeight<=innerHeight')
        assert page.locator('#loading-retry').is_hidden()
        context.route('**/game.js*',lambda r:r.abort())
        page.reload()
        page.wait_for_timeout(120)
        # Module-load failures expose a usable retry, preserving the shutter composition.
        assert page.locator('#loading-retry').is_visible()
        assert page.locator('#loading-retry').bounding_box()['height']>=44
        context.close()
    print('Initialization shutter, saved date, responsive layout and module-error retry passed.', flush=True)

def transaction(browser,bundle):
    context=context_for(browser,bundle,video=True)
    page=ready(context)
    phone.tap(page,'button-接待下一位来客',667,375)
    phone.idle(page)
    phone.tap(page,'button-商量报价',667,375)
    phone.tap(page,'button-接受当前报价',667,375)
    before=phone.state(page)
    assert before['trade']['locked']
    observe.tap(page,'button-确认钱货交割',667,375,True)
    page.wait_for_timeout(240)
    current=motion(page)
    assert any(n['text']=='−1 AP' and '/float-tag/' in n['path'] for n in observe.nodes(page)), 'New AP feedback was cleared during workspace rebinding'
    assert any(n['kind']=='receipt-print' and n['x']<180 for n in current['nodes']), 'Phone receipt must be printed on the left counter'
    assert any(n['kind']=='credit-token' for n in current['nodes'])
    page.evaluate('window.__SHUTTER_PAUSE__(true)')
    page.screenshot(path=str(OUT/'phone-transaction.png'))
    page.evaluate('window.__SHUTTER_PAUSE__(false)')
    phone.idle(page)
    after=phone.state(page)
    assert after['cash']==before['cash']-before['trade']['price']
    assert after['ap']==before['ap']-1 and after['trade'] is None
    assert before['trade']['item']['uid'] in [i['uid'] for i in after['inventory']]
    assert motion(page)['activeCount']==0
    context.close()
    print('Phone transaction prints a receipt, moves credit tokens and commits exactly one original/cash/AP transfer.',flush=True)

def reduced_motion(browser,bundle):
    context=context_for(browser,bundle,reduced=True)
    page=ready(context)
    page.evaluate("window.__ORBITAL__.open('inspect')")
    phone.tap(page,'phone-tool-actions',667,375)
    before=phone.state(page)
    phone.tap(page,'phone-mark-0',667,375)
    assert motion(page)['activeCount']==0, 'Reduced motion must keep the instrument response immediate'
    assert phone.state(page)==before
    phone.check_targets(page,667,375)
    page.screenshot(path=str(OUT/'reduced-motion.png'))
    context.close()
    print('Reduced motion keeps feedback readable and applies no extra charges.',flush=True)

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    failures=[]
    with tempfile.TemporaryDirectory(prefix='phone-motion-') as temp,sync_playwright() as p:
        bundle=Path(temp)/'game.js'
        observe.private_bundle(bundle)
        browser=p.chromium.launch(executable_path=os.environ.get('CHROMIUM','/usr/bin/chromium'),headless=True,args=['--no-sandbox','--enable-unsafe-swiftshader'])
        for name,fn in [('loader',loader),('transfer',transfer),('instruments',tool_feedback),('repair',repair),('transaction',transaction),('reduced',reduced_motion)]:
            if CASE not in ('all',name):continue
            try:fn(browser,bundle)
            except Exception as e:
                failures.append(f'{name}: {e}')
                print('FAIL',failures[-1],flush=True)
            finally:
                for context in list(browser.contexts):context.close()
        browser.close()
    assert not failures,'\n'.join(failures)

if __name__=='__main__':main()
