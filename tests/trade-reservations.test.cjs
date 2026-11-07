const assert=require('node:assert/strict');
const g=require(process.argv[2]);
let passed=0,failed=0;
function test(name,run){try{run();passed++;console.log(`PASS ${name}`);}catch(error){failed++;console.error(`FAIL ${name}: ${error.message}`);}}
function roundtrip(s,label){const restored=g.parseOrbital(g.serializeOrbital(s));assert.ok(restored,`${label}: normal action must leave a restorable save`);return restored;}
function step(s,type,args={}){return roundtrip(g.reduceOrbital(s,{type,...args}),type);}
const uid=(s,defId)=>s.inventory.find(it=>it.defId===defId).uid;
function inspect(s,itemUid){for(const tool of g.getDef(g.findItem(s,itemUid).defId).tools)s=step(s,'CHECK',{uid:itemUid,tool});return s;}
function nextDay(s){s=step(s,'SETTLE');assert.equal(s.phase,'report');return step(s,'NEXT');}
function pair(){let s=nextDay(g.createOrbital('PAIR-RESERVATION'));s=inspect(s,uid(s,'ITM-003'));s=inspect(s,uid(s,'ITM-041'));return step(s,'TAKE_ORDER',{id:'ORD-004'});}
function reserve(s,itemUid,lock=false){s=step(s,'ARRIVE');s=step(s,'REFUSE');s=step(s,'ARRIVE');s=step(s,'SELECT_TRADE',{uid:itemUid});assert.equal(s.trade.selectedUid,itemUid,'fixture must reserve the physical item');if(lock){s=step(s,'ACCEPT');assert.equal(s.trade.locked,true,'fixture must lock the buyer quote');}return s;}
function expectBlocked(s,itemUid,label,{restorable=true}={}){
 const before={cash:s.cash,ap:s.ap,inventory:g.serializeOrbital(s.inventory),ledger:s.ledger.length};
 const result=g.reduceOrbital(s,{type:'DELIVER_ORDER',id:'ORD-004',uid:itemUid});
 assert.equal(result.orders.find(o=>o.id==='ORD-004').status,'active',`${label}: rejected delivery must retain the active order`);
 assert.equal(result.cash,before.cash,`${label}: rejected delivery must not pay`);
 assert.equal(result.ap,before.ap,`${label}: rejected delivery must not spend AP`);
 assert.equal(g.serializeOrbital(result.inventory),before.inventory,`${label}: rejected delivery must retain all physical items`);
 assert.equal(result.ledger.length,before.ledger,`${label}: rejected delivery must not write a receipt`);
 if(restorable)roundtrip(result,label);
 return result;
}

// Losing the reservation check on either handover item must fail these tests.
for(const part of ['ITM-003','ITM-041'])for(const locked of [false,true])test(`paired order keeps ${locked?'locked':'open'} buyer reservation on ${part} intact`,()=>{
 let s=pair();const selected=uid(s,part),lamp=uid(s,'ITM-003');s=reserve(s,selected,locked);
 s=expectBlocked(s,lamp,'reserved companion');
 assert.equal(s.trade.selectedUid,selected);assert.ok(g.findItem(s,selected),'selectedUid must never point at a consumed handover item');
});
for(const part of ['ITM-003','ITM-041'])test(`paired order rejects isolated ${part}`,()=>{
 let s=pair();s=step(s,'ISOLATE',{uid:uid(s,part)});expectBlocked(s,uid(s,'ITM-003'),'isolated stock');
});
for(const part of ['ITM-003','ITM-041'])test(`paired order rejects unsealed isolation fixture ${part}`,()=>{
 let s=pair();const item=g.findItem(s,uid(s,part));item.location='isolation';item.sealed=false;
 s=roundtrip(s,'unsealed isolation fixture');expectBlocked(s,uid(s,'ITM-003'),'isolated stock without a seal');
});
for(const part of ['ITM-003','ITM-041'])test(`paired order rejects sealed ${part}`,()=>{
 let s=pair();g.findItem(s,uid(s,part)).sealed=true;s=roundtrip(s,'sealed fixture');expectBlocked(s,uid(s,'ITM-003'),'sealed stock');
});
for(const part of ['ITM-003','ITM-041'])test(`paired order rejects ${part} assigned to another order`,()=>{
 // Defensive fixture: the current UI never assigns shop stock to another order.
 let s=pair();g.findItem(s,uid(s,part)).orderId='ORD-003';expectBlocked(s,uid(s,'ITM-003'),'another order owns this reservation',{restorable:false});
});

test('paired order skips a reserved first companion and consumes a later eligible one',()=>{
 let s=pair();const first=uid(s,'ITM-041'),lamp=uid(s,'ITM-003');
 const extra={...g.findItem(s,first),uid:`item-${s.nextId++}`,evidence:[...g.findItem(s,first).evidence],location:'display'};
 s.inventory.push(extra);s=roundtrip(s,'second legal companion fixture');s=reserve(s,first);
 const cash=s.cash,ap=s.ap,tradeId=s.trade.id;s=step(s,'DELIVER_ORDER',{id:'ORD-004',uid:lamp});
 assert.equal(s.cash,cash+g.getOrder('ORD-004').reward);assert.equal(s.ap,ap-1);
 assert.ok(g.findItem(s,first),'reserved first companion must remain');assert.equal(g.findItem(s,extra.uid),undefined,'eligible second companion must leave');
 assert.equal(g.findItem(s,lamp),undefined);assert.equal(s.trade.id,tradeId);assert.equal(s.trade.selectedUid,first);
 const once=g.serializeOrbital(s);s=step(s,'DELIVER_ORDER',{id:'ORD-004',uid:lamp});assert.equal(g.serializeOrbital(s),once,'paired handover pays only once');
});

test('companion condition does not inherit the main item quality target',()=>{
 let s=pair();const algae=uid(s,'ITM-041'),lamp=uid(s,'ITM-003');g.findItem(s,algae).condition=.4;
 s=roundtrip(s,'working companion with worn container fixture');s=step(s,'DELIVER_ORDER',{id:'ORD-004',uid:lamp});
 assert.equal(s.orders.find(o=>o.id==='ORD-004').status,'done','working, verified companion keeps its established eligibility');
 assert.equal(g.findItem(s,algae),undefined);
});

test('ordinary customer repair still delivers its original item with its own orderId',()=>{
 let s=step(g.createOrbital('CUSTOMER-ORIGINAL'),'TAKE_ORDER',{id:'ORD-001'});const original=s.orders.find(o=>o.id==='ORD-001').uid;
 s=inspect(s,original);for(let stage=0;stage<3;stage++)s=step(s,'REPAIR_STEP',{uid:original,stage});
 s=step(s,'REPAIR',{uid:original,recipeId:g.getDef(g.findItem(s,original).defId).recipeId});const cash=s.cash;
 s=step(s,'DELIVER_ORDER',{id:'ORD-001',uid:original});assert.equal(s.orders.find(o=>o.id==='ORD-001').status,'done');
 assert.equal(s.cash,cash+g.getOrder('ORD-001').reward);assert.equal(g.findItem(s,original),undefined);
});

test('source-dispute return accepts its isolated original without charging registration',()=>{
 let s=g.createOrbital('ISOLATED-RETURN');s=nextDay(nextDay(s));s=step(s,'ARRIVE');const original=s.trade.item.uid;
 s=inspect(s,original);s=step(s,'ACCEPT');s=step(s,'DELIVER',{tradeId:s.trade.id});s=step(s,'TAKE_ORDER',{id:'ORD-011'});
 s=step(s,'ISOLATE',{uid:original});assert.equal(g.findItem(s,original).sourceVerified,false);assert.equal(g.findItem(s,original).sealed,true);
 const cash=s.cash;s=step(s,'DELIVER_ORDER',{id:'ORD-011',uid:original});assert.equal(s.orders.find(o=>o.id==='ORD-011').status,'done');
 assert.equal(s.cash,cash+g.getOrder('ORD-011').reward);assert.equal(g.findItem(s,original),undefined);assert.ok(!s.ledger.some(e=>e.kind==='registration'));
});

for(const disputed of [false,true])test(`expired pawn preserves ${disputed?'unverified':'verified'} source facts`,()=>{
 let s=g.createOrbital(`PAWN-SOURCE-${disputed}`);if(disputed)s=nextDay(nextDay(s));s=step(s,'ARRIVE');const original=s.trade.item.uid;
 s=inspect(s,original);const source=s.trade.item.source,authentic=s.trade.item.authentic,condition=s.trade.item.condition,startDay=s.day;
 s=step(s,'PAWN',{tradeId:s.trade.id});while(s.day<startDay+5)s=nextDay(s);
 const item=g.findItem(s,original);assert.equal(item.owner,'shop');assert.equal(item.sourceVerified,!disputed,'expiry changes ownership, never source verification');
 assert.equal(item.source,source);assert.equal(item.authentic,authentic);assert.equal(item.condition,condition);assert.equal(item.sealed,false);
 assert.ok(!s.ledger.some(e=>e.kind==='registration'),'expiry cannot invent a registration receipt');
 if(disputed){const cash=s.cash;s=step(s,'SETTLE');assert.equal(s.phase,'open','unverified expired collateral still requires inspection recovery');assert.equal(s.cash,cash);}
});

console.log(`Trade reservations: ${passed} passed, ${failed} failed.`);
if(failed)process.exitCode=1;
