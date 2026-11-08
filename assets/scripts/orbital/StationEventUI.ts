import type {OrbitalHost} from './ui-types';
import {getNpc} from './data';
import {stationEvents,eventForDay,eventAvailability} from './StationEvents';
import {PhoneUI} from './PhoneUI';
import {ORBITAL_PALETTE as C} from './OrbitalUI';

export function openStationEvents(h:OrbitalHost):void {
 const event=eventForDay(h.state.seed,h.state.day);if(!event)return;
 const u=new PhoneUI(h),m=u.sheet(`第 ${h.state.day} 天 · ${event.title}`);
 const draw=()=>{
  h.ui.clear(m.body);const record=h.state.events.find(r=>r.day===h.state.day),chosen=record&&event.choices.find(c=>c.id===record.choiceId);
  h.ui.portrait(m.body,event.speakerId,20,0,108,154,{crop:'head'});
  u.text(m.body,`${getNpc(event.speakerId).name}：${event.description}`,148,0,968,164,32);
  u.button(m.body,'事件记录',1140,0,284,()=>{m.close();openStationHistory(h);},{name:'event-history',size:30});
  if(chosen){
   u.row(m.body,`已处理 · ${chosen.label}`,20,194,1404,76,40,C.orange);
   u.text(m.body,chosen.result,20,286,1404,214,38);
   u.button(m.body,'返回营业',20,536,1404,()=>m.close(),{tone:'gold',name:'event-return'});return;
  }
  event.choices.forEach((choice,i)=>{
   const y=176+i*154,reason=eventAvailability(h.state,choice);
   const button=h.button(m.body,'',20,y,1404,144,()=>{
    h.dispatch({type:'CHOOSE_EVENT',eventId:event.id,choiceId:choice.id});draw();
   },{tone:i===0?'gold':'quiet',disabled:!!reason,name:`event-choice-${i}`});
   u.row(button,choice.label,20,4,1364,48,34,reason?C.muted:C.orange);
   u.text(button,`${reason?`${reason} `:''}消耗：${choice.costText}；结果：${choice.rewardText}`,20,52,1364,88,30,reason?C.muted:C.text);
  });
  u.row(m.body,'只在明确选择后提交；离开面板不会自动扣款。',20,630,1404,54,28,C.muted);
 };draw();
}

export function openStationHistory(h:OrbitalHost):void {
 const u=new PhoneUI(h),m=u.sheet('站内事件记录'),records=[...h.state.events].sort((a,b)=>b.day-a.day);let page=0;
 const draw=()=>{
  h.ui.clear(m.body);
  records.slice(page*3,page*3+3).forEach((record,i)=>{
   const event=stationEvents.find(e=>e.id===record.eventId),choice=event?.choices.find(c=>c.id===record.choiceId);if(!event||!choice)return;
   u.row(m.body,`第 ${record.day} 天 · ${event.title}`,20,i*170,1404,64,36,C.orange);
   u.text(m.body,choice.result,20,i*170+66,1404,102,30);
  });
  if(!records.length)u.text(m.body,'还没有已提交的事件记录。\n每天可查看一则站内消息；没有处理的事件不会自动扣款。',20,80,1404,340,38);
  u.button(m.body,'上一页',20,536,440,()=>{page--;draw();},{disabled:page===0,name:'event-history-prev'});
  u.button(m.body,'今日站内消息',504,536,440,()=>{m.close();openStationEvents(h);},{tone:'gold',name:'event-today'});
  u.button(m.body,'下一页',988,536,440,()=>{page++;draw();},{disabled:(page+1)*3>=records.length,name:'event-history-next'});
 };draw();
}
