import {getDef, getNpc} from './data';
import type {OrbitalItem, OrbitalState, OrbitalTrade, ToolId} from './types';

// NPC limits depend on the actual lot and this customer's needs, never on an
// arbitrary number typed into the offer box. These functions are shared by the
// reducer, save migration and presentation, so Accept cannot bypass a refusal.
const hash=(s:string):number=>{let n=2166136261;for(let i=0;i<s.length;i++){n^=s.charCodeAt(i);n=Math.imul(n,16777619);}return n>>>0;};
export function tradeItem(s:OrbitalState,t=s.trade):OrbitalItem|undefined{return t?.kind==='sell'?s.inventory.find(i=>i.uid===t.selectedUid):t?.item||undefined;}
export function relevantEvidence(it:OrbitalItem,used:ToolId[]):ToolId[]{return [...new Set(used)].filter(e=>it.evidence.includes(e)&&getDef(it.defId).tools.includes(e));}
export function customerNeed(npcId:string):string {
 if(npcId==='CHR-002'||npcId==='CHR-004')return '回收零件与旧设备，可收故障品；来源必须清楚';
 if(npcId==='CHR-003')return '站务采购：正品、功能正常、品相至少65%';
 return '整备与收藏：正品、功能正常、品相至少55%';
}
export function saleEligibility(it:OrbitalItem,npcId:string):string|null {
 if(it.owner!=='shop'||it.orderId)return '受托、抵押或订单预留的物品不能出售。';
 if(it.sealed||it.location==='isolation'||!it.sourceVerified)return '先解除封存并核验来源，顾客才会收货。';
 if(npcId==='CHR-003'||npcId==='CHR-005'){
  if(!it.authentic)return '这位顾客要求正品，无法按此采购。可寻找零件回收客。';
  if(!it.working)return '这位顾客要能正常工作的设备，请先维修或换货。';
  if(it.condition<(npcId==='CHR-003'?.65:.55))return '品相未达到这位顾客的采购要求。';
 }
 return null;
}
export function tradeTerms(s:OrbitalState,t:OrbitalTrade,it:OrbitalItem){
 const def=getDef(it.defId),value=Math.max(1,Math.round(def.value*Math.max(.35,Math.min(1,it.condition))*(it.working?1:.5)*(it.authentic?1:.6)));
 const proof=relevantEvidence(it,t.evidenceUsed).length;
 const faction=getNpc(t.npcId).faction,relation=Math.max(0,Math.min(100,s.relations[faction]));
 const variation=(hash(`${s.seed}|${t.id}|${it.uid}|${t.npcId}`)%7-3)/100;
 const marketCap=Math.max(1,Math.min(99999,Math.ceil(def.value*2)));
 const floor=Math.max(1,Math.ceil(value*(.68+variation-Math.min(.09,proof*.03))));
 const ceiling=Math.max(1,Math.floor(value*((faction==='salvage'?.98:1.04)+variation+Math.min(.09,proof*.03)+relation*.0003)));
 const opening=Math.max(1,Math.min(ceiling,Math.floor(value*(.78+variation))));
 return {value,floor,ceiling,opening,marketCap,proof};
}
export function offerBounds(s:OrbitalState,t:OrbitalTrade,it:OrbitalItem){const terms=tradeTerms(s,t,it);return{min:1,max:t.kind==='buy'?Math.min(terms.marketCap,Math.floor(s.cash)):terms.marketCap};}
export function priceAgreed(s:OrbitalState,t:OrbitalTrade,it:OrbitalItem,price=t.price):boolean {
 const terms=tradeTerms(s,t,it);
 return Number.isSafeInteger(price)&&price>=1&&price<=terms.marketCap&&(t.kind==='sell'?price<=terms.ceiling:price>=terms.floor);
}
export function counterPrice(s:OrbitalState,t:OrbitalTrade,it:OrbitalItem):number {
 const terms=tradeTerms(s,t,it),step=Math.max(1,Math.ceil(terms.value*.07));
 return t.kind==='sell'?Math.min(terms.ceiling,Math.max(terms.opening,t.price)+step):Math.max(terms.floor,Math.min(terms.marketCap,t.price)-step);
}
