"""Review the actual mobile manual, icon inventory, close buttons and dialogue."""
import importlib.util,shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
spec=importlib.util.spec_from_file_location('phone',Path(__file__).with_name('test-godot-phone.py'));phone=importlib.util.module_from_spec(spec);spec.loader.exec_module(phone)
out=Path('work/mobile-stable');out.mkdir(parents=True,exist_ok=True)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 c=b.new_context(viewport={'width':844,'height':390},has_touch=True,is_mobile=True,device_scale_factor=2)
 page=c.new_page();errors=[]
 page.on('console',lambda m:errors.append(m.text) if 'SCRIPT ERROR' in m.text else None)
 def raw(t):
  page.evaluate("t=>{window.__orbitalLocated=null;orbitalTouchSend(JSON.stringify({type:'locate',text:t}))}",t)
  page.wait_for_function('window.__orbitalLocated!==null');return page.evaluate('__orbitalLocated')
 def tap(t):
  v=raw(t);assert v['found'] and not v['disabled'],v;page.touchscreen.tap(v['x'],v['y']);return v
 def shot(name):page.screenshot(path=str(out/name),scale='css')
 page.goto('http://127.0.0.1:4174/');page.wait_for_function('OrbitalTouch?.state?.ready',timeout=120000)
 tap('开门营业');phone.wait(page,'!s.title&&!s.busy');tap('@landscape_primary');phone.wait(page,'s.trade&&!s.busy')
 page.wait_for_timeout(2000);shot('counter-dialogue.png')
 # Scroll within the existing dialogue frame; the desk remains fixed.
 phone.touch_drag(c,page,[(95,y) for y in range(320,260,-6)]);shot('dialogue-scrolled.png')
 title=page.evaluate('OrbitalTouch.state.item');tap('@landscape_goods');phone.wait(page,'s.blocked');page.wait_for_timeout(250)
 tile=raw(title);assert tile['found'] and tile['width']<150 and 80<=tile['height']<=100,tile
 close=raw('@modal_close');assert close['label']=='' and close['width']<=32 and close['height']<=32,close
 shot('goods-icons.png');tap('@modal_close');phone.wait(page,'!s.blocked')
 tap('@landscape_TOL-001');phone.wait(page,"s.workspace==='inspect'");page.wait_for_timeout(350);shot('inspection.png')
 tap('紫外灯');page.wait_for_timeout(250);shot('inspection-uv.png')
 close=raw('关闭');assert close['label']=='' and close['width']<=32,close
 tap('检验说明书');page.wait_for_timeout(350)
 close=raw('@document_close');assert close['width']<=32 and close['height']<=32 and close['x']<844 and close['y']<60,close
 shot('manual.png')
 phone.touch_drag(c,page,[(550,y) for y in range(325,120,-15)]);shot('manual-scrolled.png')
 tap('@document_close');tap('关闭');phone.wait(page,"s.workspace===''")
 page.set_viewport_size({'width':568,'height':320});page.wait_for_timeout(400)
 tap('@landscape_TOL-001');phone.wait(page,"s.workspace==='inspect'");tap('检验说明书');page.wait_for_timeout(300)
 close=raw('@document_close');assert close['width']<=32 and close['x']<568 and close['y']<60,close
 shot('manual-568.png');tap('@document_close');tap('关闭');phone.wait(page,"s.workspace===''")
 assert not errors,errors
 print('PASS icon goods, X-only close, inspection controls, scrollable native-size manual at 844x390 and 568x320, dialogue touch scrolling',flush=True)
 c.close();b.close()
