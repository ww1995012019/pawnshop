import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {resolve} from 'node:path';
const out=resolve('.cache/content-v15-tests');mkdirSync(out,{recursive:true});
const compile=spawnSync(process.execPath,['node_modules/typescript/bin/tsc','--strict','--target','ES2019','--module','commonjs','--moduleResolution','node','--skipLibCheck','--outDir',out,'assets/scripts/orbital/model.ts','assets/scripts/orbital/ItemArt.ts'],{stdio:'inherit'});
if(compile.status)process.exit(compile.status);
const require=createRequire(import.meta.url),g=require(resolve(out,'model.js')),market=require(resolve(out,'Market.js')),neg=require(resolve(out,'Negotiation.js')),conversation=require(resolve(out,'NpcConversation.js')),readings=require(resolve(out,'ItemReadings.js'));
assert.equal(g.itemDefs.length,56);assert.equal(g.npcs.length,9);assert.equal(g.orderDefs.length,32);
const added=g.itemDefs.filter(d=>Number(d.id.slice(4))>=81);
assert.equal(added.length,20);assert.equal(new Set(added.map(d=>d.name)).size,20);
assert.ok(added.every(d=>d.art.front==='orbital-annex-front'&&d.art.back==='orbital-annex-back'&&d.art.columns===5&&d.art.rows===5));
assert.equal(new Set(added.map(d=>d.art.index)).size,20);
assert.ok(added.every(d=>d.description.length>20&&d.defect.length>10&&d.tools.length>=2&&d.tools.every(t=>d.clues[t])));
for(const seed of ['PORT-A','PORT-B','PORT-C']){
 const state=g.createOrbital(seed),ids=new Set(),visitors=new Set();
 for(let day=1;day<=21;day++)for(let slot=0;slot<6;slot++){
  visitors.add(market.marketNpcId(state,day,slot));
  if(slot%2===0)ids.add(market.marketStock(state,day,slot).defId);
 }
 assert.equal(ids.size,56,'all actual goods fit the twenty-one-day supply schedule');
 for(const npc of g.npcs.filter(n=>n.id!=='CHR-001'))assert.ok(visitors.has(npc.id),`${npc.name} must actually visit`);
}
const template=g.createOrbital().inventory[0];
const medical={...template,defId:'ITM-088',owner:'shop',working:true,authentic:true,condition:.8};
assert.equal(neg.saleEligibility(medical,'CHR-006'),null);
assert.ok(neg.saleEligibility({...medical,working:false},'CHR-006'),'nurse refuses nonworking medical equipment');
assert.ok(neg.saleEligibility({...medical,authentic:false},'CHR-006'),'nurse requires genuine goods');
assert.ok(neg.saleEligibility({...medical,condition:.6},'CHR-006'),'nurse requires 65% condition');
assert.ok(neg.saleEligibility({...medical,defId:'ITM-099'},'CHR-006'),'nurse does not buy unrelated collectibles');
assert.equal(neg.saleEligibility({...medical,defId:'ITM-099'},'CHR-009'),null);
assert.ok(neg.saleEligibility({...medical,defId:'ITM-099',authentic:false},'CHR-009'));
let buyer=g.createOrbital('NURSE-HANDOFF');buyer.inventory=[{...medical,uid:'item-1'}];
buyer.trade={id:'trade-7',npcId:'CHR-006',kind:'sell',item:null,price:0,rounds:0,locked:false,evidenceUsed:[],line:''};buyer.nextId=8;
buyer=g.reduceOrbital(buyer,{type:'SELECT_TRADE',uid:'item-1'});assert.equal(buyer.trade.selectedUid,'item-1');
buyer=g.reduceOrbital(buyer,{type:'OFFER',price:1});assert.ok(buyer.trade.locked);
buyer.inventory[0].working=false;
const rejected=g.reduceOrbital(buyer,{type:'DELIVER',tradeId:buyer.trade.id});
assert.equal(rejected.cash,buyer.cash);assert.equal(rejected.inventory.length,1,'last-minute bad medical equipment cannot be handed off');
for(const npc of g.npcs){assert.ok(npc.bio?.length>35&&npc.desire?.length>10);if(npc.id!=='CHR-001')assert.ok(npc.voice.arrival.length>=2&&npc.voice.counter.length>=2&&npc.voice.agreed.length>=2);}
for(const npc of g.npcs.filter(n=>n.voice)){
 const s=g.createOrbital('VOICE-A');assert.equal(conversation.npcDialogue(s,npc.id,'arrival',''),conversation.npcDialogue(s,npc.id,'arrival',''));
 assert.ok(new Set(Array.from({length:8},(_,i)=>conversation.npcDialogue({...s,day:i+1},npc.id,'arrival',''))).size>1,'visits vary dialogue without rerolling on render');
 assert.match(conversation.npcDialogue(s,npc.id,'counter','',123),/123/);
}
for(const def of added)for(const tool of def.tools)assert.ok(readings.getItemClue({...template,defId:def.id},tool).includes(def.clues[tool]),'new evidence identifies the actual model-specific inspection point');
for(const def of added.filter(d=>d.recipeId)){
 const recipe=g.getRecipe(def.recipeId);assert.equal(recipe.itemId,def.id);assert.equal(recipe.steps.length,3);
 let s=g.createOrbital('NEW-REPAIR-'+def.id);
 const item={...s.inventory[0],uid:`item-${s.nextId++}`,defId:def.id,owner:'shop',condition:.55,working:false,inspectedPaid:false,evidence:[],repaired:false,x:7,y:3};
 s.inventory.push(item);
 for(const tool of def.tools)s=g.reduceOrbital(s,{type:'CHECK',uid:item.uid,tool});
 for(const [id,n] of Object.entries(recipe.materials))s.materials[id]=n;
 for(let stage=0;stage<3;stage++)s=g.reduceOrbital(s,{type:'REPAIR_STEP',uid:item.uid,stage});
 s=g.reduceOrbital(s,{type:'REPAIR',uid:item.uid,recipeId:recipe.id});
 assert.ok(g.findItem(s,item.uid).working&&g.findItem(s,item.uid).repaired);
 assert.ok(g.parseOrbital(g.serializeOrbital(s)));
}
for(const count of [12,24]){
 const old=g.createOrbital('OLD-'+count);old.orders=old.orders.slice(0,count);delete old.events;old.orders[0].status='done';
 const restored=g.parseOrbital(old);assert.ok(restored);assert.equal(restored.orders.length,32);assert.equal(restored.orders[0].status,'done');assert.deepEqual(restored.events,[]);
 assert.deepEqual(restored.inventory,old.inventory,'legacy originals and physical facts stay intact');
}
console.log('Content v15: 20 goods, 4 visitors, 8 repairs/orders, supply reachability, customer rules and old saves passed.');
