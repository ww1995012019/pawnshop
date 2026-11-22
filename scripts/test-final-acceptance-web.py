#!/usr/bin/env python3
"""Fresh first-day inspection, purchase, close, reload and next-day journey."""
import importlib.util
import json
from pathlib import Path
import shutil
import time
from playwright.sync_api import sync_playwright

ROOT=Path(__file__).resolve().parents[1]
spec=importlib.util.spec_from_file_location('service',ROOT/'scripts/test-watch-service-web.py')
service=importlib.util.module_from_spec(spec);spec.loader.exec_module(service)
OUT=ROOT/'work/final-acceptance/screenshots'

def main():
    OUT.mkdir(parents=True,exist_ok=True)
    with sync_playwright() as p:
        browser=p.chromium.launch(executable_path=shutil.which('chromium'),args=[
            '--no-sandbox','--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader'])
        context=browser.new_context(viewport={'width':1440,'height':900})
        page=context.new_page();errors=[];steps=[]
        page.on('pageerror',lambda e:errors.append(str(e)))
        page.on('console',lambda m:errors.append(m.text) if m.type=='error' and 'browser metadata' not in m.text or 'SCRIPT ERROR' in m.text else None)
        def command(data):page.evaluate('d=>orbitalTouchSend(JSON.stringify(d))',data)
        def state():return page.evaluate('OrbitalTouch.state')
        def wait(condition):page.wait_for_function('()=>{const s=OrbitalTouch.state;return '+condition+'}',timeout=30000)
        def locate(label):
            page.evaluate("t=>{window.__orbitalLocated=null;orbitalTouchSend(JSON.stringify({type:'locate',text:t}))}",label)
            page.wait_for_function('window.__orbitalLocated!==null')
            return page.evaluate('__orbitalLocated')
        def click(label):
            deadline=time.monotonic()+15
            while True:
                found=locate(label)
                if found.get('found') and 70<found['y']<850:break
                if found.get('found'):
                    page.mouse.move(max(60,min(1380,found['x'])),550)
                    page.mouse.wheel(0,320 if found['y']>=850 else -320)
                assert time.monotonic()<deadline,('missing visible control',label,state())
                page.wait_for_timeout(50)
            assert not found['disabled'],(label,found)
            assert 0<found['x']<1440 and 0<found['y']<900,(label,found)
            page.mouse.click(found['x'],found['y']);page.wait_for_timeout(180)
        def capture(name):
            page.screenshot(path=str(OUT/(name+'.png')))
            steps.append({'step':name,'state':state()})
            (OUT.parent/'journey.json').write_text(json.dumps(steps,ensure_ascii=False,indent=2))
            print('CAPTURE',name,flush=True)
        def saved(predicate):
            deadline=time.monotonic()+20
            while True:
                row=page.evaluate(service.READ_SAVE)
                if row and predicate(row['state']):return row['state']
                assert time.monotonic()<deadline,('save did not settle',row)
                page.wait_for_timeout(100)
        try:
            page.goto('http://127.0.0.1:4174/')
            page.wait_for_function('window.OrbitalTouch?.state?.ready',timeout=120000)
            capture('01-new-game')
            click('开门营业');wait('!s.title&&!s.busy')
            click('接客铃');wait('s.trade&&!s.busy')
            capture('02-first-visitor')
            before=state();uid=before['trade_session']['goods'][0]['uid']
            second_uid=before['trade_session']['goods'][1]['uid']
            assert not locate('@quick_inspect_'+second_uid).get('found')
            click('@quick_focus_'+second_uid)
            wait("s.dialogue_uid==="+json.dumps(second_uid))
            assert locate('@quick_inspect_'+second_uid).get('found')
            click('@quick_focus_'+uid)
            click('@quick_inspect_'+uid);wait("s.workspace==='inspect'&&s.inspection_uid==="+json.dumps(uid))
            click('放大镜');wait("s.inspection_current==='TOL-001'&&!s.inspection_busy")
            click('定位并固定标识');wait('s.appraisal.count===1')
            assert state()['ap']==before['ap']-1 and state()['cash']==before['cash']
            capture('03-recorded-evidence')
            click('@workspace_close');wait("s.workspace===''")
            price=next(r['context']['price'] for r in state()['trade_session']['lines'] if r['uid']==uid)
            click('@quick_select_'+uid)
            if state()['blocked']:click('承担风险并锁价')
            wait('s.trade_session.buy_count===1')
            agreed=state();capture('04-confirmed-purchase')
            assert locate('@QuickCheckout')['label'] == f'支付 {price:g} Cr · 1 件'
            click('@QuickCheckout')
            wait('s.cash==='+str(agreed['cash']-price)+'&&s.ap==='+str(agreed['ap']-1)+'&&!s.busy')
            paid=saved(lambda s:any(it['uid']==uid and it['owner']=='shop' for it in s['inventory']))
            assert len([r for r in paid['ledger'] if r['kind']=='purchase' and (r.get('uid')==uid or r['id'].endswith('/'+uid))])==1
            capture('05-paid-original-retained')
            click('@QuickSendOff');wait('!s.trade&&!s.busy')
            command({'type':'page','page':'report'});wait("s.workspace==='report'")
            click('打烊结算')
            wait("s.blocked || s.notice.startsWith('日结完成')")
            if state()['blocked']:click('确认提前打烊')
            wait("s.notice.startsWith('日结完成')")
            closed=saved(lambda s:s['phase']=='report' and s['report']['day']==1)
            assert closed['cash']==paid['cash']-closed['report']['costs']['total']
            capture('06-day-one-report')
            page.reload();page.wait_for_function('window.OrbitalTouch?.state?.ready&&OrbitalTouch.state.has_save',timeout=120000)
            click('继续营业');wait('!s.title&&!s.busy')
            assert state()['cash']==closed['cash']
            command({'type':'page','page':'report'});wait("s.workspace==='report'")
            capture('07-reloaded-report')
            next_day=locate('迎接第 2 天')
            assert next_day['found'] and not next_day['disabled'],next_day
            assert next_day['y']+next_day['height']/2<900,next_day
            page.mouse.click(next_day['x'],next_day['y'])
            wait('s.day===2&&!s.busy')
            assert state()['cash']==closed['cash'] and state()['ap']==12
            final=saved(lambda s:s['day']==2)
            assert any(it['uid']==uid for it in final['inventory'])
            assert len([r for r in final['ledger'] if r['kind']=='purchase' and (r.get('uid')==uid or r['id'].endswith('/'+uid))])==1
            capture('08-next-day')
            assert not errors,errors
            print('PASS actual first-day inspection/purchase/delivery/report/reload/day2; original UID, one charge and AP verified',flush=True)
        except Exception:
            capture('FAILED')
            (OUT.parent/'journey-errors.json').write_text(json.dumps(errors,ensure_ascii=False,indent=2))
            raise
        finally:context.close();browser.close()

if __name__=='__main__':main()
