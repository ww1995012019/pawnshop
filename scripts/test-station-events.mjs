import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const root=fileURLToPath(new URL('../',import.meta.url));
const out=resolve(root,'.cache/station-events-tests');mkdirSync(out,{recursive:true});
const compile=spawnSync(process.execPath,[resolve(root,'node_modules/typescript/bin/tsc'),'--strict','--target','ES2019','--module','commonjs','--moduleResolution','node','--skipLibCheck','--outDir',out,'assets/scripts/orbital/model.ts'],{cwd:root,stdio:'inherit'});
if(compile.error)throw compile.error;
if(compile.status!==0)process.exit(compile.status??1);
const require=createRequire(import.meta.url),g=require(resolve(out,'model.js'));
const fresh=g.createOrbital('EVENT-TEST');
assert.deepEqual(fresh.events,[],'a new shop keeps an explicit, empty event history');

let passed=0,failed=0;
function test(name,run){try{run();passed++;console.log(`✓ ${name}`);}catch(error){failed++;console.error(`✗ ${name}\n${error.stack}`);}}
const copy=value=>JSON.parse(JSON.stringify(value));
const act=(state,eventId,choiceId)=>g.reduceOrbital(state,{type:'CHOOSE_EVENT',eventId,choiceId});
const choice=(eventId,id)=>g.stationEvents.find(event=>event.id===eventId).choices.find(option=>option.id===id);
function onDay(eventId){
 const state=g.createOrbital('EVENT-TEST');
 state.day=Array.from({length:21},(_,i)=>i+1).find(day=>g.eventForDay(state.seed,day)?.id===eventId);
 assert.ok(state.day,`${eventId} occurs during the campaign`);return state;
}
const economy=state=>({...copy(state),notice:undefined});

test('each seeded campaign offers all 21 events exactly once',()=>{
 assert.equal(g.stationEvents.length,21);
 const first=Array.from({length:21},(_,i)=>g.eventForDay('EVENT-TEST',i+1));
 const second=Array.from({length:21},(_,i)=>g.eventForDay('ANOTHER-SHOP',i+1));
 assert.equal(new Set(first.map(event=>event.id)).size,21);
 assert.deepEqual(first,Array.from({length:21},(_,i)=>g.eventForDay('EVENT-TEST',i+1)));
 assert.notDeepEqual(first.map(event=>event.id),second.map(event=>event.id));
 for(const day of [1,7,14,20,21])assert.equal(first[day-1].id,second[day-1].id,'introduction, rent and anniversary dates stay fixed');
 for(const day of [0,22,-1,1.5,NaN,Infinity])assert.equal(g.eventForDay('EVENT-TEST',day),null);
 const ids=new Set();
 for(const event of first){
  assert.match(event.speakerId,/^CHR-00[2-9]$/);assert.ok(event.title&&event.description);
  assert.ok(event.choices.length>=2&&event.choices.length<=3);
  for(const option of event.choices){
   assert.ok(option.label&&option.costText&&option.rewardText&&option.result);
   assert.ok(!ids.has(option.id),'choice ids distinguish stale event selections');ids.add(option.id);
   for(const [id,n] of Object.entries(option.effects.materials??{})){
    assert.ok(g.materials.some(material=>material.id===id));assert.ok(Number.isSafeInteger(n));
   }
  }
 }
});

test('catalogue effects cannot be mutated by a consumer',()=>{
 const option=choice('EVT-001','EVT-001-repair');
 assert.throws(()=>{option.effects.cash=999;},TypeError);
 assert.throws(()=>{option.effects.materials['MAT-001']=999;},TypeError);
 assert.throws(()=>{option.effects.relations.station=999;},TypeError);
 assert.equal(g.eventAvailability(fresh,option),null);
});

test('a repair choice applies all costs, rewards and one receipt atomically',()=>{
 const previous=copy(fresh),state=act(fresh,'EVT-001','EVT-001-repair');
 assert.equal(state.cash,1235);assert.equal(state.ap,11);assert.equal(state.materials['MAT-001'],1);
 assert.equal(state.risk,11);assert.equal(state.relations.station,33);
 assert.deepEqual(state.events,[{day:1,eventId:'EVT-001',choiceId:'EVT-001-repair'}]);
 assert.equal(state.ledger.length,1);assert.equal(state.ledger[0].kind,'station-event');assert.equal(state.ledger[0].amount,35);
 assert.equal(state.notice,choice('EVT-001','EVT-001-repair').result);
 assert.deepEqual(state.inventory,fresh.inventory);assert.equal(state.cursor,0);assert.equal(state.nextId,fresh.nextId);
 assert.deepEqual(fresh,previous,'selection does not mutate its input');
 assert.ok(g.parseOrbital(g.serializeOrbital(state)),'resolved events save and restore');
});

test('repeat, alternate and restored selections cannot pay twice',()=>{
 const first=act(fresh,'EVT-001','EVT-001-repair');
 for(const optionId of ['EVT-001-repair','EVT-001-donate']){
  assert.deepEqual(act(first,'EVT-001',optionId),first);
  assert.ok(g.eventAvailability(first,choice('EVT-001',optionId)));
 }
 const restored=g.parseOrbital(g.serializeOrbital(first));
 assert.deepEqual(act(restored,'EVT-001','EVT-001-repair'),restored);
});

test('unknown and stale selections leave the shop unchanged',()=>{
 for(const [eventId,optionId] of [['EVT-999','EVT-999-repair'],['EVT-001','missing'],['EVT-002','EVT-002-service']])assert.deepEqual(act(fresh,eventId,optionId),fresh);
 const later={...fresh,day:2};assert.deepEqual(act(later,'EVT-001','EVT-001-repair'),later);
 assert.ok(g.eventAvailability(later,choice('EVT-001','EVT-001-repair')));
});

test('a current trade gates both the UI and reducer without changing a quote',()=>{
 const state=g.reduceOrbital(fresh,{type:'ARRIVE'}),option=choice('EVT-001','EVT-001-repair');
 assert.ok(state.trade);assert.match(g.eventAvailability(state,option),/交易|顾客/);
 assert.deepEqual(economy(act(state,'EVT-001',option.id)),economy(state));
});

test('report and ending phases cannot resolve events',()=>{
 const report=g.reduceOrbital(fresh,{type:'SETTLE'}),option=choice('EVT-001','EVT-001-repair');
 for(const state of [report,{...report,phase:'ending'}]){
  assert.ok(g.eventAvailability(state,option));assert.deepEqual(act(state,'EVT-001',option.id),state);
 }
});

test('insufficient cash cannot buy relations or create history',()=>{
 const state={...fresh,cash:29},option=choice('EVT-001','EVT-001-donate');
 assert.match(g.eventAvailability(state,option),/现金|Cr/);
 assert.deepEqual(economy(act(state,'EVT-001',option.id)),economy(state));
 const enough=act({...state,cash:30},'EVT-001',option.id);
 assert.equal(enough.cash,0);assert.equal(enough.relations.station,35);assert.equal(enough.events.length,1);
});

test('insufficient AP never grants the cash or material part of a choice',()=>{
 const state={...fresh,ap:0},option=choice('EVT-001','EVT-001-repair');
 assert.match(g.eventAvailability(state,option),/行动|AP/);
 assert.deepEqual(economy(act(state,'EVT-001',option.id)),economy(state));
});

test('insufficient materials never deduct AP or pay a repair reward',()=>{
 const state={...fresh,materials:{...fresh.materials,'MAT-001':0}},option=choice('EVT-001','EVT-001-repair');
 assert.match(g.eventAvailability(state,option),/导电纤维|材料/);
 assert.deepEqual(economy(act(state,'EVT-001',option.id)),economy(state));
});

test('material capacity is checked before charging any exchange costs',()=>{
 const state=onDay('EVT-006'),option=choice('EVT-006','EVT-006-exchange');
 state.materials['MAT-001']=99999;state.materials['MAT-003']=1;
 assert.match(g.eventAvailability(state,option),/容量|上限/);
 assert.deepEqual(economy(act(state,'EVT-006',option.id)),economy(state));
 state.materials['MAT-001']=99997;
 assert.equal(g.eventAvailability(state,option),null);
 const exchanged=act(state,'EVT-006',option.id);
 assert.equal(exchanged.materials['MAT-001'],99999);assert.equal(exchanged.materials['MAT-003'],0);
 assert.ok(g.parseOrbital(exchanged),'a full material cabinet remains a valid save');
});

test('cash capacity cannot overflow a valid save',()=>{
 const state={...fresh,cash:1e9},option=choice('EVT-001','EVT-001-repair');
 assert.match(g.eventAvailability(state,option),/现金|上限/);
 assert.deepEqual(economy(act(state,'EVT-001',option.id)),economy(state));
});

test('risk, relations and restored AP remain within their declared bounds',()=>{
 const state={...fresh,risk:0,relations:{...fresh.relations,station:99}};
 const repaired=act(state,'EVT-001','EVT-001-repair');
 assert.equal(repaired.risk,0);assert.equal(repaired.relations.station,100);
 const final=onDay('EVT-021');final.ap=11;final.risk=1;
 const rested=act(final,'EVT-021','EVT-021-rest');
 assert.equal(rested.ap,12);assert.equal(rested.risk,0);assert.ok(g.parseOrbital(rested));
});

test('skipping an event never charges resources or blocks the next day',()=>{
 const settled=g.reduceOrbital(fresh,{type:'SETTLE'});
 assert.equal(settled.phase,'report');assert.equal(settled.cash,1180);assert.equal(settled.ap,12);assert.deepEqual(settled.events,[]);
 const next=g.reduceOrbital(settled,{type:'NEXT'});
 assert.equal(next.day,2);assert.deepEqual(next.events,[]);assert.equal(next.cash,1180);
 const event=g.eventForDay(next.seed,next.day),option=event.choices.find(candidate=>Object.keys(candidate.effects).length===0);
 assert.ok(option,'every event can be acknowledged without taking a paid job');
 const skipped=act(next,event.id,option.id);
 assert.equal(skipped.cash,next.cash);assert.equal(skipped.ap,next.ap);assert.deepEqual(skipped.materials,next.materials);
 assert.deepEqual(skipped.events,[{day:2,eventId:event.id,choiceId:option.id}]);
 assert.equal(g.reduceOrbital(skipped,{type:'ARRIVE'}).trade.npcId,'CHR-004','events do not consume visitor slots');
});

test('old schema 3 saves gain an empty history without altering economic state',()=>{
 const old=copy(fresh);delete old.events;
 const restored=g.parseOrbital(old);assert.ok(restored);assert.deepEqual(restored.events,[]);
 assert.deepEqual(restored,fresh);assert.ok(!Object.hasOwn(old,'events'),'migration leaves its input untouched');
});

test('malformed, future, stale and repeated event histories are rejected',()=>{
 const record={day:1,eventId:'EVT-001',choiceId:'EVT-001-repair'};
 const invalid=[null,{},'event',[null],[{...record,day:0}],[{...record,day:1.2}],[{...record,day:2}],[{...record,eventId:'EVT-999'}],[{...record,choiceId:'missing'}],[record,record],[{...record,eventId:'EVT-002',choiceId:'EVT-002-service'}]];
 for(const events of invalid)assert.equal(g.parseOrbital({...fresh,events}),null,JSON.stringify(events));
 const valid={...fresh,day:3,events:[record]};assert.ok(g.parseOrbital(valid));
 const dayTwo=g.eventForDay(fresh.seed,2),otherSeed=Array.from({length:50},(_,n)=>`OTHER-${n}`).find(seed=>g.eventForDay(seed,2).id!==dayTwo.id);
 assert.ok(otherSeed);
 assert.equal(g.parseOrbital({...fresh,day:2,seed:otherSeed,events:[{day:2,eventId:dayTwo.id,choiceId:dayTwo.choices[0].id}]}),null,'event records belong to their seeded schedule');
});

test('all 21 daily results survive settlement, advancement and saving',()=>{
 let state=g.createOrbital('EVENT-HISTORY');state.cash=10000;
 for(let day=1;day<=21;day++){
  const event=g.eventForDay(state.seed,day),option=event.choices.find(candidate=>Object.keys(candidate.effects).length===0);
  state=act(state,event.id,option.id);assert.equal(state.events.length,day);
  state=g.reduceOrbital(state,{type:'SETTLE'});assert.equal(state.phase,'report');
  state=g.parseOrbital(g.serializeOrbital(state));assert.ok(state);
  state=g.reduceOrbital(state,{type:'NEXT'});
 }
 assert.equal(state.phase,'ending');assert.equal(state.events.length,21);
});

test('12 and 24-order schema 3 saves preserve records, customer originals and locked quotes when expanded to 32',()=>{
 assert.equal(g.orderDefs.length,32,'integration includes the new eight commission definitions');
 for(const length of [12,24]){
  let old=g.reduceOrbital(g.createOrbital('LEGACY-'+length),{type:'TAKE_ORDER',id:'ORD-001'});
  old=g.reduceOrbital(old,{type:'ARRIVE'});old=g.reduceOrbital(old,{type:'ACCEPT'});
  assert.equal(old.trade.locked,true);
  old.orders=old.orders.slice(0,length);old.orders[2].status='done';old.day=10;delete old.events;
  const before=copy(old),restored=g.parseOrbital(old);
  assert.ok(restored);assert.equal(restored.schema,3);assert.equal(restored.orders.length,32);assert.deepEqual(restored.events,[]);
  assert.deepEqual(restored.orders.slice(0,length),before.orders);assert.deepEqual(restored.inventory,before.inventory);
  assert.deepEqual(restored.trade,before.trade);assert.equal(restored.cash,before.cash);assert.equal(restored.nextId,before.nextId);
  assert.equal(restored.orders[0].uid,before.orders[0].uid);
  for(const order of restored.orders.slice(length))assert.equal(order.status,g.getOrder(order.id).dueDay<10?'failed':'available');
  assert.deepEqual(old,before,'legacy migration never alters its input');
 }
});

test('legacy order counts require the exact original prefix rather than arbitrary known IDs',()=>{
 for(const length of [12,24]){
  const old=copy(fresh);old.orders=old.orders.slice(0,length);delete old.events;
  assert.ok(g.parseOrbital(old));
  assert.equal(g.parseOrbital({...old,orders:old.orders.slice(1)}),null,'missing original id is corrupt');
  assert.equal(g.parseOrbital({...old,orders:[...old.orders.slice(1),old.orders[1]]}),null,'duplicate id is corrupt');
  if(g.orderDefs[length])assert.equal(g.parseOrbital({...old,orders:[...old.orders.slice(1),{id:g.orderDefs[length].id,status:'available'}]}),null,'a later commission cannot replace a missing original');
 }
});

console.log(`Station events: ${passed} passed, ${failed} failed.`);process.exitCode=failed?1:0;
