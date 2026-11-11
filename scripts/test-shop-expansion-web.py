"""Exercise the planning sheets through real phone touches and desktop controls."""
import importlib.util,json,shutil
from pathlib import Path
from playwright.sync_api import sync_playwright
root=Path(__file__).resolve().parents[1];out=root/'work/shop-expansion/browser';out.mkdir(parents=True,exist_ok=True)
spec=importlib.util.spec_from_file_location('phone',root/'scripts/test-godot-phone.py');phone=importlib.util.module_from_spec(spec);spec.loader.exec_module(phone)
with sync_playwright() as p:
 b=p.chromium.launch(executable_path=shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
 c=b.new_context(viewport={'width':844,'height':390},is_mobile=True,has_touch=True,device_scale_factor=2);page=c.new_page();errors=[]
 page.on('console',lambda m:errors.append(m.text) if 'SCRIPT ERROR' in m.text or 'SHADER ERROR' in m.text else None)
 def tap(text):
  page.evaluate("t=>{window.__orbitalLocated=null;orbitalTouchSend(JSON.stringify({type:'locate',text:t}))}",text)
  page.wait_for_function('window.__orbitalLocated!==null')
  hit=page.evaluate('__orbitalLocated');assert hit['found'] and not hit['disabled'],hit
  assert 0<hit['y']<page.viewport_size['height'],hit
  page.touchscreen.tap(hit['x'],hit['y']);page.wait_for_timeout(150)
 page.goto('http://127.0.0.1:4174/');page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=120000)
 page.evaluate('orbitalTouchSend(JSON.stringify({type:"start"}))');phone.wait(page,'!s.title&&!s.busy');print('READY plan Web regression',flush=True)
 for width,height in [(844,390),(568,320),(390,844),(1280,800)]:
  page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(1000)
  if width>=1000: tap('经营')
  else:
   tap('事务');page.wait_for_timeout(400);tap('经营计划')
  page.wait_for_timeout(600);phone.wait(page,'s.blocked')
  for section in ['overview','contracts','bulk','customers','history','upgrades']:
   tap('@shop_plan_'+section);page.wait_for_timeout(400)
   page.screenshot(timeout=15000,path=str(out/f'{width}-{section}.png'),scale='css')
  tap('@modal_close');phone.wait(page,'!s.blocked')
  print('PASS plan tabs real touch',width,height,flush=True)
 assert not errors,errors[:12]
 b.close()
