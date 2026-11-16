#!/usr/bin/env python3
"""Verify dense PC counter geometry, real focus, dragging and saved empty slots."""
import importlib.util
import json
import os
from pathlib import Path
import subprocess
import tempfile
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'work/multi-counter'
def module(name,path):
 spec=importlib.util.spec_from_file_location(name,ROOT/path)
 result=importlib.util.module_from_spec(spec);spec.loader.exec_module(result);return result
phone=module('phone','scripts/test-godot-phone.py')
service=module('service','scripts/test-watch-service-web.py')
WRITE='''async input=>{const db=await new Promise(r=>{const q=indexedDB.open('/userfs');q.onsuccess=()=>r(q.result)});await new Promise((r,j)=>{const tx=db.transaction('FILE_DATA','readwrite');tx.objectStore('FILE_DATA').put({timestamp:new Date(),mode:33206,contents:new TextEncoder().encode(JSON.stringify(input.state))},input.key);tx.oncomplete=r;tx.onerror=j});db.close()}'''

def main():
 os.chdir(ROOT);OUT.mkdir(parents=True,exist_ok=True)
 prefix=os.environ.get('MULTI_COUNTER_CAPTURE_PREFIX','')
 with tempfile.TemporaryDirectory(prefix='strict-multi-') as td:
  subprocess.run(['godot','--headless','--path','godot','--script','res://tests/strict_multi_counter_fixture.gd'],env={**os.environ,'XDG_DATA_HOME':td},check=True,capture_output=True,timeout=40)
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--mute-audio'])
  page=browser.new_page(viewport={'width':1920,'height':1080});errors=[]
  # Unload the engine before replacing its isolated save. A neutral HTML
  # document declares the real favicon, unlike the plain-text license page.
  icon=json.loads((ROOT/'play-godot/release.json').read_text())['engine']+'.icon.png'
  page.route('**/__strict_fixture__',lambda route:route.fulfill(status=200,content_type='text/html',body='<!doctype html><link rel="icon" href="/'+icon+'"><title>Fixture</title>'))
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('console',lambda m:errors.append(m.text+' '+str(m.location.get('url',''))) if m.type=='error' and 'browser metadata' not in m.text else None)
  def status():return page.evaluate('OrbitalTouch.state')
  def saved():return page.evaluate(service.READ_SAVE)['state']
  def start():
   page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=120000)
   page.evaluate('orbitalTouchSend(JSON.stringify({type:"start"}))')
   phone.wait(page,'!s.title&&!s.busy',timeout=30000);page.wait_for_timeout(1200)
  def snap(name):
   page.mouse.move(1900,1060);page.screenshot(path=str(OUT/(prefix+name+'.png')))
  def transform():
   # The responsive HUD spans the window; the unscaled physical bell measures
   # the live artwork scale independently of that decorative header.
   key=phone.locate(page,'接客铃');sx=key['width']/95;sy=key['height']/77
   return key['x']-413.5*sx,key['y']-527.5*sy,sx,sy
  def geometry(rows):
   ox,oy,sx,sy=transform();rects=[]
   extra_x=page.viewport_size['width']/sx-1671;extra_y=page.viewport_size['height']/sy-941
   for row in rows:
    hit=phone.locate(page,'@strict_table_'+row['uid'])
    box=(hit['x']-hit['width']/2,hit['y']-hit['height']/2,hit['x']+hit['width']/2,hit['y']+hit['height']/2)
    assert box[0]>=ox+470*sx-1 and box[2]<=ox+(1174+extra_x)*sx+1,(row,box,ox+(1186+extra_x)*sx)
    assert box[1]>=oy+451*sy-1 and box[3]<=oy+(745+extra_y)*sy+1,(row,box)
    for old in rects:assert box[2]<=old[0] or old[2]<=box[0] or box[3]<=old[1] or old[3]<=box[1],(box,old)
    rects.append(box)
  page.goto('http://127.0.0.1:4174/');start()
  first=phone.locate(page,'@StrictTradeAction_0');page.mouse.click(first['x'],first['y'])
  phone.wait(page,'!s.busy&&s.has_save',timeout=30000)
  row=None
  for _ in range(60):
   row=page.evaluate(service.READ_SAVE)
   if row:break
   page.wait_for_timeout(150)
  assert row
  viewports=[(1920,1080),(1778,974),(1440,900)]
  for name,count in [('user',7),('maximum',16),('seven-hole',15)]:
   fixture=json.loads((OUT/(name+'.json')).read_text())
   page.set_viewport_size({'width':1920,'height':1080})
   page.goto('http://127.0.0.1:4174/__strict_fixture__')
   page.evaluate(WRITE,{'key':row['key'],'state':fixture})
   page.goto('http://127.0.0.1:4174/');start();snap(name+'-arrival-1920')
   rows=status()['table_items'];assert len(rows)==count,(name,rows)
   geometry(rows)
   before=saved()
   for item in rows:
    hit=phone.locate(page,'@strict_table_'+item['uid']);page.mouse.click(hit['x'],hit['y'])
    phone.wait(page,'s.dialogue_uid=='+json.dumps(item['uid']),timeout=10000)
   assert saved()['cash']==before['cash'] and saved()['ap']==before['ap']
   hit=phone.locate(page,'@strict_table_'+fixture['trade']['session']['focus']);page.mouse.click(hit['x'],hit['y']);page.wait_for_timeout(1200)
   for width,height in viewports:
    page.set_viewport_size({'width':width,'height':height});page.wait_for_timeout(500)
    geometry(status()['table_items']);snap(name+'-'+str(width))
   print('PASS visible, separated and focusable originals',name,count,flush=True)
   if name=='seven-hole':
    page.set_viewport_size({'width':1920,'height':910});page.wait_for_timeout(500)
    incoming=[it for it in status()['table_items'] if it['direction']=='buy'];moving=incoming[4]['uid']
    assert saved()['trade']['session']['table_positions'][incoming[-1]['uid']]==[1264,508]
    source=phone.locate(page,'@strict_table_'+moving);ox,oy,sx,sy=transform()
    extra_x=page.viewport_size['width']/sx-1671;extra_y=page.viewport_size['height']/sy-941
    tx,ty=ox+(423+(940-423)*(763+extra_x)/763)*sx,oy+(501+extra_y*.18)*sy
    page.mouse.move(source['x'],source['y']);page.mouse.down();page.wait_for_timeout(180)
    for step in range(1,16):page.mouse.move(source['x']+(tx-source['x'])*step/15,source['y']+(ty-source['y'])*step/15);page.wait_for_timeout(60)
    page.mouse.up();page.wait_for_timeout(1000)
    for _ in range(40):
     if saved()['trade']['session']['table_positions'][moving]==[1104,508]:break
     page.wait_for_timeout(150)
    assert saved()['trade']['session']['table_positions'][moving]==[1104,508]
    assert saved()['cash']==before['cash'] and saved()['ap']==before['ap']
    snap('dragged');page.reload();start()
    assert saved()['trade']['session']['table_positions'][moving]==[1104,508]
    geometry(status()['table_items']);snap('reloaded')
    print('PASS drag into empty slot and reload preserve position, cash and AP',flush=True)
  assert not errors,errors
  (OUT/'browser-results.json').write_text(json.dumps({'passed':True,'errors':errors,'viewports':viewports,'counts':[7,16,15]},indent=2)+'\n')
  browser.close()
if __name__=='__main__':main()
