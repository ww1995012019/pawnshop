"""Check compact workspaces, complete button outlines, and desktop/phone actions."""
from playwright.sync_api import sync_playwright
from PIL import Image
from pathlib import Path
import shutil,json
ROOT=Path(__file__).resolve().parents[1]
out=ROOT/'work/compact-workspaces';out.mkdir(parents=True,exist_ok=True)
def main():
 with sync_playwright() as p:
  b=p.chromium.launch(executable_path=shutil.which('chromium'),args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--mute-audio'])
  for w,h in [(1595,860),(844,390),(390,844)]:
   ctx=b.new_context(viewport={'width':w,'height':h},has_touch=w<1000,is_mobile=w<1000)
   page=ctx.new_page();errors=[]
   page.on('pageerror',lambda e:errors.append(str(e)))
   page.on('console',lambda m:errors.append(m.text) if 'SCRIPT ERROR' in m.text else None)
   def cmd(d):page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))',d)
   def locate(text):
    page.evaluate('t=>{window.__orbitalLocated=null;orbitalTouchSend(JSON.stringify({type:"locate",text:t}))}',text)
    page.wait_for_function('window.__orbitalLocated!==null')
    hit=page.evaluate('__orbitalLocated');assert hit.get('found'),hit
    return hit
   def click(text):
    hit=locate(text);assert not hit['disabled'],hit
    assert 0<hit['x']<w and 0<hit['y']<h,hit
    if w<1000:page.touchscreen.tap(hit['x'],hit['y'])
    else:page.mouse.click(hit['x'],hit['y'])
    page.wait_for_timeout(700)
   def snap(name):
    page.mouse.move(1,1);page.wait_for_timeout(600);page.screenshot(path=str(out/f'{w}-{name}.png'))
   page.goto('http://127.0.0.1:4174/');page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=120000)
   cmd({'type':'start'});page.wait_for_function('!OrbitalTouch.state.title&&!OrbitalTouch.state.busy');page.wait_for_timeout(1200)
   for target in ['orders','report','warehouse','inspect','repair']:
    if page.evaluate('!!OrbitalTouch.state.workspace'):
     cmd({'type':'close'});page.wait_for_function('!OrbitalTouch.state.workspace')
    cmd({'type':'page','page':target});page.wait_for_function('(t)=>OrbitalTouch.state.workspace===t',arg=target);page.wait_for_timeout(800)
    rect=page.evaluate('OrbitalTouch.state.workspace_rect');assert rect['x']>=-1 and rect['y']>=-1 and rect['x']+rect['width']<=w+1 and rect['y']+rect['height']<=h+1,rect
    snap(target)
    if target=='orders':
     click('进行' if w<500 else '进行中');snap('orders-empty')
     hit=locate('查看可接订单');assert hit['width']>=140,hit
     if w>=1000:
      for state in ['hover','pressed']:
       page.mouse.move(hit['x'],hit['y'])
       if state=='pressed':page.mouse.down()
       page.wait_for_timeout(200);path=out/f'{w}-button-{state}.png';page.screenshot(path=str(path))
       image=Image.open(path).convert('RGB');x=round(hit['x']-hit['width']/2);y=round(hit['y']-hit['height']/2);bw=round(hit['width']);bh=round(hit['height'])
       def gold(px):return px[0]>120 and px[0]>px[1]*1.03 and px[1]>px[2]*1.1
       edges={'left':[(a,c) for a in range(x-1,x+3) for c in range(y+3,y+bh-3)],'right':[(a,c) for a in range(x+bw-3,x+bw+1) for c in range(y+3,y+bh-3)],'top':[(a,c) for a in range(x+3,x+bw-3) for c in range(y-1,y+3)],'bottom':[(a,c) for a in range(x+3,x+bw-3) for c in range(y+bh-3,y+bh+1)]}
       for edge,coords in edges.items():assert sum(gold(image.getpixel(point)) for point in coords)>min(bw,bh)*0.4,(state,edge,hit)
       now=locate('查看可接订单');assert abs(now['width']-hit['width'])<0.5 and abs(now['height']-hit['height'])<0.5,(hit,now)
      page.mouse.up();page.wait_for_timeout(800)
     else:click('查看可接订单')
     page.wait_for_function('OrbitalTouch.state.workspace==="orders"')
    if target=='inspect':
     cmd({'type':'tool','tool':'TOL-005'});page.wait_for_timeout(500);snap('inspect-scale-disabled')
     disabled=locate('放到秤上');assert disabled['disabled'] and disabled['width']>45,disabled
    print('PASS',w,h,target,rect,flush=True)
   assert not errors,errors
   ctx.close()
  b.close()

if __name__=="__main__":main()
