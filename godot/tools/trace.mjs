// Record random-but-plausible play traces with the TypeScript reducer, for
// tests/replay.gd to replay against the GDScript port step by step.
// Usage: node godot/tools/trace.mjs [seeds=16] [steps=360]
import {build} from 'esbuild';
import {writeFile,mkdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'../..');
const out=await build({stdin:{contents:`
import * as M from './assets/scripts/orbital/model';
import {tradeTerms} from './assets/scripts/orbital/Negotiation';
import {eventForDay} from './assets/scripts/orbital/StationEvents';
globalThis.__M__={...M,tradeTerms,eventForDay};`,resolveDir:root,loader:'ts'},bundle:true,write:false,format:'iife',platform:'node',logLevel:'error'});
new Function(out.outputFiles[0].text)();
const M=globalThis.__M__;
const seeds=Number(process.argv[2]||16),steps=Number(process.argv[3]||360),bias=Number(process.argv[4]||0),prefix=process.argv[5]||'trace';
const rng=seed=>()=>{seed|=0;seed=seed+0x6D2B79F5|0;let t=Math.imul(seed^seed>>>15,1|seed);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};
const tools=['TOL-001','TOL-002','TOL-003','TOL-004','TOL-005','TOL-006'];
function choose(s,r){
 const pick=a=>a[Math.floor(r()*a.length)];
 if(bias&&s.phase==='open'&&!s.trade&&r()<bias)return{type:'SETTLE'};
 const inv=s.inventory, any=()=>inv.length?pick(inv):null;
 if(s.phase==='report')return r()<.3?{type:'UPGRADE',id:pick(['lamp','shelf'])}:{type:'NEXT'};
 const t=s.trade, roll=r();
 if(t&&roll<.75){
  const it=t.kind==='sell'?inv.find(i=>i.uid===t.selectedUid):t.item;
  const k=r();
  if(t.kind==='sell'&&(!it||k<.25)){const c=any();return c?{type:'SELECT_TRADE',uid:c.uid}:{type:'REFUSE'};}
  if(k<.35&&it)return{type:'CHECK',uid:it.uid,tool:pick(tools)};
  if(k<.65&&it){const terms=M.tradeTerms(s,t,it);const base=t.kind==='sell'?terms.ceiling:terms.floor;const price=Math.max(1,Math.round(base*(.5+r()*0.8)));const ev=r()<.4&&it.evidence.length?pick(it.evidence):undefined;return ev?{type:'OFFER',price,evidence:ev}:{type:'OFFER',price};}
  if(k<.75)return{type:'ACCEPT'};
  if(k<.88)return{type:'DELIVER',tradeId:t.id};
  if(k<.93&&t.kind==='buy')return{type:'PAWN',tradeId:t.id};
  return{type:'REFUSE'};
 }
 const it=any(),k=r();
 if(k<.26)return{type:'ARRIVE'};
 if(k<.33&&it)return{type:'CHECK',uid:it.uid,tool:pick(tools)};
 if(k<.37&&it)return{type:'MOVE',uid:it.uid,x:Math.floor(r()*10),y:Math.floor(r()*6),rotated:r()<.3};
 if(k<.41&&it)return{type:'DISPLAY',uid:it.uid};
 if(k<.43&&it)return{type:'PRICE',uid:it.uid,price:Math.floor(1+r()*600)};
 if(k<.47&&it)return{type:'ISOLATE',uid:it.uid};
 if(k<.51&&it)return{type:'SCAN',uid:it.uid};
 if(k<.55&&it)return{type:'REGISTER',uid:it.uid};
 if(k<.56&&it)return{type:'RETURN_ITEM',uid:it.uid};
 if(k<.63&&it)return{type:'REPAIR_STEP',uid:it.uid,stage:r()<.85?(s.repairProgress[it.uid]||0):Math.floor(r()*3)};
 if(k<.68&&it){const def=M.getDef(it.defId);const rec=M.recipes.find(x=>x.itemId===it.defId)||M.recipes.find(x=>x.id===def.recipeId)||pick(M.recipes);return{type:'REPAIR',uid:it.uid,recipeId:rec.id};}
 if(k<.69&&it)return{type:'DISMANTLE',uid:it.uid};
 if(k<.71)return{type:'CRAFT',recipeId:pick(M.recipes.filter(x=>x.kind==='craft')).id};
 if(k<.76)return{type:'TAKE_ORDER',id:pick(M.orderDefs).id};
 if(k<.81){const o=s.orders.filter(o=>o.status==='active');if(o.length&&it){const ord=pick(o);const match=inv.find(i=>i.defId===M.getOrder(ord.id).itemId)||it;return{type:'DELIVER_ORDER',id:ord.id,uid:match.uid};}}
 if(k<.84)return{type:'BUY_MATERIAL',id:pick(M.materials).id,qty:1+Math.floor(r()*4)};
 if(k<.88){const e=M.eventForDay(s.seed,s.day);if(e)return{type:'CHOOSE_EVENT',eventId:e.id,choiceId:pick(e.choices).id};}
 if(k<.92&&it)return{type:'EMERGENCY_SALE',uid:it.uid};
 if(k<.94&&it)return{type:'REDEEM',uid:it.uid};
 return{type:'SETTLE'};
}
await mkdir(resolve(root,'godot/tests/traces'),{recursive:true});
let total=0;
for(let i=0;i<seeds;i++){
 const seed=i===0&&!bias?'ORBITAL-P0':`${prefix.toUpperCase()}-${i}`,r=rng((bias?5000:1000)+i);
 let s=M.createOrbital(seed);const rows=[{action:null,state:s}];
 for(let k=0;k<steps&&s.phase!=='ending';k++){const a=choose(s,r);s=M.reduceOrbital(s,a);rows.push({action:a,state:s});}
 total+=rows.length;
 await writeFile(resolve(root,`godot/tests/traces/${prefix}-${String(i).padStart(2,'0')}.json`),JSON.stringify({seed,rows}));
 console.log(seed,'steps',rows.length-1,'day',s.day,'phase',s.phase,'cash',s.cash,'inv',s.inventory.length);
}
console.log('total states',total);
