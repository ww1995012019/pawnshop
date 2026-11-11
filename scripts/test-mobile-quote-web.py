"""Exercise the phone quote using touch controls and the engine's Web keyboard."""
import importlib.util,re,shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
spec=importlib.util.spec_from_file_location('phone',Path(__file__).with_name('test-godot-phone.py'));phone=importlib.util.module_from_spec(spec);spec.loader.exec_module(phone)
out=Path('work/landscape-density');out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 c=b.new_context(viewport={'width':844,'height':390},has_touch=True,is_mobile=True,device_scale_factor=2)
 page=c.new_page();errors=[]
 page.on('console',lambda m: errors.append(m.text) if 'SCRIPT ERROR' in m.text else None)
 def raw(t):
  page.evaluate("t=>{window.__orbitalLocated=null;orbitalTouchSend(JSON.stringify({type:'locate',text:t}))}",t)
  page.wait_for_function('window.__orbitalLocated!==null');return page.evaluate('__orbitalLocated')
 def tap(t):
  v=raw(t);assert v['found'] and not v['disabled'],v;page.touchscreen.tap(v['x'],v['y']);return v
 def shot(name):page.screenshot(path=str(out/name),scale='css')
 page.goto('http://127.0.0.1:4174/');page.wait_for_function('OrbitalTouch?.state?.ready',timeout=120000)
 tap('开门营业');phone.wait(page,'!s.title&&!s.busy');tap('@landscape_primary');phone.wait(page,'s.trade&&!s.busy')
 page.wait_for_timeout(500);shot('counter.png')
 primary=raw('@landscape_primary');assert 32<=primary['height']<=36,primary
 tap('@landscape_primary');phone.wait(page,'s.blocked');page.wait_for_timeout(300)
 before=int(re.search(r'\d+',raw('出价')['label'])[0])
 step=tap('@quote_step_5');assert step['height']<=36,step
 page.wait_for_timeout(200);assert str(before+5) in raw('出价')['label']
 right=raw('@quote_step_1')
 page.touchscreen.tap(right['x']-right['width']/2-7,right['y']-7);page.wait_for_timeout(200);assert str(before+6) in raw('出价')['label']
 page.touchscreen.tap(right['x']-right['width']/2-7,right['y']+7);page.wait_for_timeout(200);assert str(before+5) in raw('出价')['label']
 tap('@quote_step_-1');page.wait_for_timeout(200);assert str(before+4) in raw('出价')['label']
 left=raw('@quote_step_-1');right=raw('@quote_step_1')
 page.touchscreen.tap((left['x']+right['x'])/2,left['y'])
 page.wait_for_function("document.activeElement?.tagName==='INPUT'&&!document.activeElement.disabled",timeout=10000)
 editor=page.locator('input:enabled');editor.fill(str(before+12));editor.press('Enter')
 page.wait_for_timeout(300);assert str(before+12) in raw('出价')['label']
 shot('quote.png');tap('@modal_close');phone.wait(page,'!s.blocked');tap('@landscape_primary');phone.wait(page,'s.blocked')
 page.wait_for_timeout(250);assert str(before+12) in raw('出价')['label']
 old_line=page.evaluate('OrbitalTouch.state.dialogue_line');tap('出价');phone.wait(page,'!s.blocked');page.wait_for_function('line=>OrbitalTouch.state.dialogue_line!==line',arg=old_line);assert page.evaluate('OrbitalTouch.state.offer')==before+12
 tap('@landscape_more');phone.wait(page,'s.blocked');page.wait_for_timeout(250);shot('actions.png')
 close=raw('@modal_close');assert close['width']<=80 and close['height']<=36,close
 tap('@modal_close');phone.wait(page,'!s.blocked');tap('@landscape_nav_settings');phone.wait(page,'s.blocked');page.wait_for_timeout(300);shot('settings.png')
 for text in ['声音','减少动态效果','切换全屏','全图鉴','新开一家店']:
  v=raw(text);assert v['found'] and v['height']<=36 and v['y']+v['height']/2<390,(text,v)
 assert not errors,errors
 print('PASS touch +/- quote, numeric keyboard entry, retained draft, actual offer submission, compact settings and close button')
 c.close();b.close()
