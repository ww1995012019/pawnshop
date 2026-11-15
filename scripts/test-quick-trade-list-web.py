#!/usr/bin/env python3
"""Actual PC row selection, quote, inspection, one-AP batch checkout and overflow."""
import importlib.util,json,os,subprocess,tempfile
from pathlib import Path
from playwright.sync_api import sync_playwright
ROOT=Path(__file__).resolve().parents[1]
OUT=ROOT/'work/quick-trade-list'
def module(name,path):
 spec=importlib.util.spec_from_file_location(name,ROOT/path)
 mod=importlib.util.module_from_spec(spec);spec.loader.exec_module(mod);return mod
phone=module('phone','scripts/test-godot-phone.py')
service=module('service','scripts/test-watch-service-web.py')
multi=module('multi','scripts/test-strict-multi-counter-web.py')
def main():
 os.chdir(ROOT);OUT.mkdir(parents=True,exist_ok=True)
 with tempfile.TemporaryDirectory(prefix='quick-list-') as td:
  for name in ['quick_trade_list_fixture','strict_multi_counter_fixture','strict_reference_fixture']:
   subprocess.run(['godot','--headless','--path','godot','--script','res://tests/'+name+'.gd'],env={**os.environ,'XDG_DATA_HOME':td},check=True,capture_output=True,timeout=40)
 with sync_playwright() as p:
  browser=p.chromium.launch(executable_path='/usr/bin/chromium',args=['--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--mute-audio'])
  page=browser.new_page(viewport={'width':1920,'height':1080});errors=[]
  icon=json.loads((ROOT/'play-godot/release.json').read_text())['engine']+'.icon.png'
  page.route('**/__strict_fixture__',lambda route:route.fulfill(status=200,content_type='text/html',body='<!doctype html><link rel="icon" href="/'+icon+'"><title>Fixture</title>'))
  page.on('pageerror',lambda e:errors.append(str(e)))
  page.on('console',lambda m:errors.append(m.text) if m.type=='error' and 'browser metadata' not in m.text else None)
  def state():return page.evaluate('OrbitalTouch.state')
  def saved():return page.evaluate(service.READ_SAVE)['state']
  def start():
   page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=120000)
   page.evaluate('orbitalTouchSend(JSON.stringify({type:"start"}))')
   phone.wait(page,'!s.title&&!s.busy',timeout=30000);page.wait_for_timeout(1000)
  def click(label):
   k=phone.locate(page,label);assert not k['disabled'],(label,k)
   page.mouse.click(k['x'],k['y']);page.wait_for_timeout(250);phone.wait(page,'!s.busy',timeout=30000);page.wait_for_timeout(350)
  def snap(name):
   page.mouse.move(1919,1079)
   if name in ['two-selected','two-agreed','batch-complete']:page.wait_for_timeout(4200)
   page.screenshot(path=str(OUT/(name+'.png')))
  page.goto('http://127.0.0.1:4174/');start();click('@StrictTradeAction_0')
  record=None
  for _ in range(60):
   record=page.evaluate(service.READ_SAVE)
   if record:break
   page.wait_for_timeout(100)
  assert record
  def load(path):
   data=json.loads(path.read_text());data['notice']='';page.goto('http://127.0.0.1:4174/__strict_fixture__')
   page.evaluate(multi.WRITE,{'key':record['key'],'state':data})
   page.goto('http://127.0.0.1:4174/');start();return data
  fixture=load(OUT/'two.json');ids=[it['uid'] for it in fixture['trade']['session']['goods']]
  snap('two-arrival')
  for uid in ids:click('@quick_select_'+uid)
  phone.wait(page,'s.trade_session.lines.filter(r=>r.selected).length===2',timeout=10000)
  for _ in range(50):
   s=saved()
   if len([r for r in s['trade']['session']['lines'] if r['selected']])==2:break
   page.wait_for_timeout(150)
  lines=s['trade']['session']['lines'];assert len([r for r in lines if r['selected']])==2
  assert s['cash']==fixture['cash'] and s['ap']==fixture['ap'];snap('two-selected')
  click('@quick_select_'+ids[0]);click('@quick_offer_'+ids[0]);snap('quote-editable')
  agreed=next(r['context']['price'] for r in lines if r['uid']==ids[0])+5
  page.keyboard.press('Control+a');page.keyboard.type(str(int(agreed)));snap('quote-typed')
  click('@QuickOfferSubmit')
  phone.wait(page,'s.trade_session.lines.filter(r=>r.selected).length===2',timeout=10000)
  assert next(r for r in state()['trade_session']['lines'] if r['uid']==ids[0])['context']['price']==agreed
  snap('two-agreed');click('@quick_inspect_'+ids[1]);phone.wait(page,'s.workspace==="inspect"',timeout=10000);snap('inspect')
  page.evaluate('orbitalTouchSend(JSON.stringify({type:"close"}))');phone.wait(page,'s.workspace===""&&!s.busy',timeout=10000);page.wait_for_timeout(600)
  assert state()['dialogue_uid']==ids[1]
  before=saved();due=sum(r['context']['price'] for r in before['trade']['session']['lines'] if r['selected'])
  click('@QuickCheckout');phone.wait(page,'!s.busy',timeout=30000)
  for _ in range(50):
   after=saved()
   if after['ap']==before['ap']-1:break
   page.wait_for_timeout(150)
  assert after['cash']==before['cash']-due and after['ap']==before['ap']-1
  assert len([it for it in after['inventory'] if it['uid'] in ids])==2
  snap('batch-complete')
  page.reload();start();assert saved()['cash']==after['cash'] and saved()['ap']==after['ap']
  print('PASS two selections, cancel, typed row negotiation, exact-UID inspection and one-AP checkout/reload',flush=True)
  for name,path,count in [('four',OUT/'four.json',4),('one',OUT/'one.json',1),('empty',OUT/'empty.json',0),('maximum',ROOT/'work/multi-counter/maximum.json',16),('seven-hole',ROOT/'work/multi-counter/seven-hole.json',15)]:
   load(path);assert len(state()['table_items'])==count;snap(name+'-1920')
   if count>8:
    last=state()['table_items'][-1]['uid'];click('@strict_table_'+last)
    target=phone.locate(page,'@quick_select_'+last)
    assert 175<target['y']<690,target
    assert state()['dialogue_uid']==last;snap(name+'-focused-bottom')
   for w,h in [(1778,974),(1440,900)]:
    page.set_viewport_size({'width':w,'height':h});page.wait_for_timeout(500)
    checkout=phone.locate(page,'@QuickCheckout');orders=phone.locate(page,'@StrictOrders')
    assert checkout['x']+checkout['width']/2<=w and orders['y']+orders['height']/2<=h
    snap(name+'-'+str(w))
   page.set_viewport_size({'width':1920,'height':1080});page.wait_for_timeout(300)
   print('PASS list/table focus and desktop layouts',name,count,flush=True)
  fixture=load(OUT/'shop.json')
  own=[r['uid'] for r in fixture['trade']['session']['lines'] if r['direction']=='sell']
  first,rejected,other=own[:3]
  before=saved();position=before['trade']['session']['table_positions'][first]
  for uid in [other,first]:
   click('@strict_table_'+uid);click('@quick_select_'+uid)
  phone.wait(page,'s.trade_session.lines.filter(r=>r.selected).length===2',timeout=10000)
  click('@quick_select_'+first)
  phone.wait(page,'s.trade_session.lines.filter(r=>r.selected).length===1',timeout=10000)
  assert len(state()['table_items'])==16
  for _ in range(50):
   current=saved()['trade']['session']
   if len([r for r in current['lines'] if r['selected']])==1:break
   page.wait_for_timeout(150)
  assert current['table_positions'][first]==position
  snap('shop-unselected')
  click('@strict_table_'+rejected);click('@quick_more_'+rejected);snap('shop-more')
  click('收回本件')
  phone.wait(page,'s.table_items.length===15',timeout=10000)
  assert not any(r['uid']==rejected for r in state()['table_items'])
  assert next(r for r in state()['trade_session']['lines'] if r['uid']==other)['selected']
  assert state()['cash']==before['cash'] and state()['ap']==before['ap']
  snap('shop-withdrawn')
  print('PASS shop unselect retains table slot and explicit withdrawal frees full eight-item presentation',flush=True)
  for name in ['closed','merchant','landlord']:
   load(ROOT/'work/strict-reference'/('fixture-'+name+'.json'))
   assert not state()['workspace'];snap(name)
   if name!='closed':assert saved()['trade']['kind']==name
   print('PASS fallback',name,flush=True)
  assert not errors,errors
  (OUT/'browser-results.json').write_text(json.dumps({'passed':True,'errors':errors,'batch_ap':1,'originals':ids,'paid':due,'counts':[0,1,2,4,15,16],'viewports':[[1920,1080],[1778,974],[1440,900]]},indent=2)+'\n')
  browser.close()
if __name__=='__main__':main()
