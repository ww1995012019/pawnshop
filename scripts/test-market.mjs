import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';

const out=resolve('.cache/market-tests');mkdirSync(out,{recursive:true});
const compile=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--strict','--target','ES2019','--module','commonjs','--moduleResolution','node','--skipLibCheck','--outDir',out,'assets/scripts/orbital/model.ts'],{stdio:'inherit'});
if(compile.status)process.exit(compile.status);
const require=createRequire(import.meta.url),g=require(resolve(out,'model.js'));
assert.equal(g.itemDefs.length,56,'market expansion adds twenty more distinct goods');
assert.equal(g.orderDefs.length,32,'orders continue after the three-day tutorial');
const market=require(resolve(out,'Market.js')),readings=require(resolve(out,'ItemReadings.js'));
const state=g.createOrbital('MARKET-A');
assert.equal(market.dailyVisitLimit(state),6,'six visitors can arrive each day');
const expansion=g.itemDefs.filter(d=>Number(d.id.slice(4))>=61&&Number(d.id.slice(4))<=72);
assert.equal(new Set(expansion.map(d=>d.name)).size,12);
assert.equal(new Set(expansion.map(d=>d.art.index)).size,12);
assert.ok(expansion.every(d=>d.art.front==='orbital-expansion-front'&&d.art.back==='orbital-expansion-back'&&d.art.columns===4&&d.art.rows===3));
const opening=[['ITM-011','ITM-001'],['ITM-009','ITM-010'],['ITM-049','ITM-050']];
for(let day=1;day<=3;day++)for(let n=0;n<2;n++){
 const stock=market.marketStock(state,day,n*2);
 assert.equal(stock.defId,opening[day-1][n]);
 assert.equal(stock.condition,n===0?.65:.8);
 assert.equal(stock.working,n!==0);
 assert.equal(stock.authentic,!(day===2&&n===1));
 assert.equal(stock.sourceVerified,!(day===3&&n===0));
 assert.equal(stock.lotId,undefined,'opening physical instances retain their legacy identity');
}
const collect=s=>Array.from({length:21},(_,d)=>[0,2,4].map(slot=>market.marketStock(s,d+1,slot))).flat();
const deck=collect(state),other=collect(g.createOrbital('MARKET-B'));
assert.equal(new Set(deck.map(d=>d.defId)).size,56,'twenty-one-day supply covers every real good');
assert.notDeepEqual(deck,other,'different seeds produce different supplies and conditions');
assert.deepEqual(deck,collect(state),'seeded supplies are stable across repeated calls');
assert.ok(new Set(deck.map(d=>d.condition)).size>3&&deck.some(d=>!d.working)&&deck.some(d=>d.working));
assert.ok(deck.some(d=>!d.authentic)&&deck.some(d=>!d.sourceVerified));
const unchanged=g.serializeOrbital(state);
const preview=market.stockPreview(state,4,0),actual=market.marketStock(state,4,0);
assert.equal(preview.defId,actual.defId);assert.equal(preview.source,actual.source);
assert.deepEqual(Object.keys(preview).sort(),['defId','priceBand','source'],'public forecast does not expose hidden physical states');
assert.equal(g.serializeOrbital(state),unchanged,'preview does not allocate ids or consume state');
let current={...state,day:4,cursor:0};current=g.reduceOrbital(current,{type:'ARRIVE'});
assert.equal(current.trade.item.defId,preview.defId);
assert.equal(current.trade.item.condition,actual.condition);
assert.equal(current.trade.item.authentic,actual.authentic);
const restored=g.parseOrbital(g.serializeOrbital(current));assert.ok(restored);
assert.deepEqual(restored.trade.item,current.trade.item,'existing instances are not rerolled on load');
for(let i=0;i<6;i++){
 let visit=g.reduceOrbital({...state,cursor:i},{type:'ARRIVE'});
 assert.ok(visit.trade,`visitor ${i+1} arrives`);
}
assert.equal(g.reduceOrbital({...state,cursor:6},{type:'ARRIVE'}).trade,null);
assert.ok(g.parseOrbital({...state,cursor:6}));assert.equal(g.parseOrbital({...state,cursor:7}),null);
const old=JSON.parse(unchanged);old.day=10;old.orders=old.orders.slice(0,12);old.orders[0].status='done';
const migrated=g.parseOrbital(old);assert.ok(migrated);assert.equal(migrated.orders.length,32);
assert.equal(migrated.orders[0].status,'done');
assert.ok(migrated.orders.filter(o=>Number(o.id.slice(4))>12&&g.getOrder(o.id).dueDay<10).every(o=>o.status==='failed'),'newly migrated expired work stays expired');
assert.equal(g.parseOrbital({...old,orders:old.orders.slice(1)}),null,'missing original order is corrupt');
assert.equal(g.parseOrbital({...old,orders:[...old.orders.slice(1),old.orders[1]]}),null,'duplicate original order is corrupt');
const bad=JSON.parse(g.serializeOrbital(current));bad.trade.item.lotId='../invalid';assert.equal(g.parseOrbital(bad),null);
const future=g.orderDefs.filter(d=>Number(d.id.slice(4))>12);
assert.ok(future.every(d=>g.orderEarliest[d.id]>=4&&d.dueDay<=21&&d.dueDay>=g.orderEarliest[d.id]));
assert.ok(new Set(future.map(d=>g.orderEarliest[d.id])).size>=6,'new commissions unlock in staggered waves');
assert.ok(future.every(d=>g.getDef(d.itemId).id===d.itemId));
for(const def of future){
 let job=g.createOrbital('COMMISSION-'+def.id);job.day=g.orderEarliest[def.id];
 if(!def.customerOwned){
  job.inventory.push({...current.trade.item,uid:`item-${job.nextId++}`,defId:def.itemId,owner:'shop',location:'warehouse',x:7,y:3,condition:.85,working:true,sourceVerified:true,evidence:[],inspectedPaid:false,repaired:false,sealed:false,cost:200});
 }
 job=g.reduceOrbital(job,{type:'TAKE_ORDER',id:def.id});
 const original=job.inventory.find(it=>def.customerOwned?it.orderId===def.id:it.defId===def.itemId);
 assert.ok(original,'every new commission has a deliverable physical original or shop-owned supply');
 const uid=original.uid;
 for(const tool of g.getDef(def.itemId).tools)job=g.reduceOrbital(job,{type:'CHECK',uid,tool});
 if(def.needsRepair){
  const recipe=g.getRecipe(g.getDef(def.itemId).recipeId);
  for(const [id,qty] of Object.entries(recipe.materials))job.materials[id]=qty;
  for(let stage=0;stage<3;stage++)job=g.reduceOrbital(job,{type:'REPAIR_STEP',uid,stage});
  job=g.reduceOrbital(job,{type:'REPAIR',uid,recipeId:recipe.id});
  assert.equal(g.findItem(job,uid).working,true,'recipe restores the actual commissioned object');
 }
 const before=job.cash;job=g.reduceOrbital(job,{type:'DELIVER_ORDER',id:def.id,uid});
 assert.equal(job.orders.find(o=>o.id===def.id).status,'done',`new commission ${def.id} can be completed at unlock`);
 assert.equal(job.cash,before+def.reward);assert.equal(g.findItem(job,uid),undefined);
 assert.ok(g.parseOrbital(g.serializeOrbital(job)),'fulfilled new commission roundtrips');
}
const repairDefs=expansion.filter(d=>d.recipeId);
assert.ok(repairDefs.length>=4&&repairDefs.length<=6);
for(const d of repairDefs){const r=g.getRecipe(d.recipeId);assert.equal(r.itemId,d.id);assert.equal(r.kind,'repair');assert.equal(r.steps.length,3);}
for(const d of g.itemDefs.filter(d=>d.recipeId)){
 const r=g.getRecipe(d.recipeId);
 assert.equal(r.kind,'repair',`${d.name} points to its own repair recipe, not a component's assembly recipe`);
 assert.equal(r.itemId,d.id,`${d.name} must not borrow another model's repair steps`);
 let work=g.createOrbital('REPAIR-'+d.id);
 const original={...work.inventory[0],uid:`item-${work.nextId++}`,defId:d.id,condition:.55,working:false,evidence:[],inspectedPaid:false,repaired:false,x:7,y:3};
 work.inventory.push(original);
 for(const tool of d.tools)work=g.reduceOrbital(work,{type:'CHECK',uid:original.uid,tool});
 for(const [id,qty] of Object.entries(r.materials))work.materials[id]=qty;
 for(let stage=0;stage<3;stage++)work=g.reduceOrbital(work,{type:'REPAIR_STEP',uid:original.uid,stage});
 work=g.reduceOrbital(work,{type:'REPAIR',uid:original.uid,recipeId:r.id});
 assert.ok(g.findItem(work,original.uid).repaired&&g.findItem(work,original.uid).working,`${d.name} repairs using its exact model recipe`);
 assert.ok(Object.keys(r.materials).every(id=>work.materials[id]===0),'model-specific repair consumes the declared physical materials once');
}
assert.match(g.getRecipe(g.getDef('ITM-011').recipeId).steps.join(' '),/机臂|旋翼/,'drone repair handles its real flight hardware');
assert.doesNotMatch(g.getRecipe(g.getDef('ITM-011').recipeId).steps.join(' '),/滑盖|腕式/);
const template=current.trade.item;
const genuine={...template,authentic:true,working:true,condition:.94,repaired:false};
const replica={...genuine,authentic:false};
assert.match(readings.getItemMark(genuine),/一致|原始/);assert.match(readings.getItemMark(replica),/重叠|复制/);
assert.notEqual(readings.getItemClue(genuine,'TOL-002'),readings.getItemClue(replica,'TOL-002'));
const broken={...genuine,working:false};
assert.notEqual(readings.getItemClue(genuine,'TOL-006'),readings.getItemClue(broken,'TOL-006'));
for(const d of g.itemDefs)assert.doesNotMatch(readings.getItemClue({...broken,defId:d.id},'TOL-006'),/编号重叠|假章|仿品|复制|伪件/,'a genuine broken object must not inherit a counterfeit fault description');
for(const physical of [genuine,broken,replica]){
 const oldItem={...physical,lotId:undefined,defId:'ITM-009'};
 const before=JSON.stringify(oldItem);
 assert.match(readings.getItemMark(oldItem),oldItem.authentic?/原始.*一致/:/重叠|复制/,'unbatched objects show their actual authenticity');
 assert.match(readings.getItemClue(oldItem,'TOL-006'),oldItem.working?/响应稳定/:/异常响应/,'unbatched objects show their actual functionality');
 assert.doesNotMatch(readings.getItemClue(oldItem,'TOL-006'),/编号重叠|复制/,'mechanical faults do not invent an authenticity failure');
 assert.match(readings.getItemFaultLabel(oldItem),oldItem.working?/正常|恢复/:/像差|重校/,'workbench summary reads the physical object rather than static defect copy');
 assert.equal(JSON.stringify(oldItem),before,'updated readings preserve old physical state, source and evidence');
}
const oldVerified={...genuine,lotId:undefined,sourceVerified:true};
const oldUnverified={...oldVerified,sourceVerified:false};
assert.match(readings.getItemClue(oldVerified,'TOL-002'),/回执可交叉核对/);
assert.match(readings.getItemClue(oldUnverified,'TOL-002'),/仍需补证/);
assert.notEqual(readings.getItemClue({...oldVerified,condition:.4},'TOL-001'),readings.getItemClue({...oldVerified,condition:.95},'TOL-001'),'unbatched wear follows saved condition');
console.log('Market content, deterministic stock, readings and save migration: passed.');
