import {getDef,itemDefs,npcs} from './data';
import type {OrbitalItem,OrbitalState} from './types';

type MarketState=Pick<OrbitalState,'seed'|'day'|'cursor'>;
export interface MarketStock {
  defId:string;condition:number;working:boolean;authentic:boolean;sourceVerified:boolean;
  source:string;price:number;lotId?:string;
}
export interface StockPreview {defId:string;source:string;priceBand:[number,number]}
export const dailyVisitLimit=(_s?:MarketState):number=>6;
function hash(text:string):number {
  let n=2166136261;for(let i=0;i<text.length;i++){n^=text.charCodeAt(i);n=Math.imul(n,16777619);}
  return n>>>0;
}
function shuffled(seed:string,cycle:number):string[] {
  const ids=itemDefs.map(d=>d.id);let n=hash(`${seed}/stock-v1/${cycle}`);
  for(let i=ids.length-1;i>0;i--){n=(Math.imul(n,1664525)+1013904223)>>>0;const j=n%(i+1);[ids[i],ids[j]]=[ids[j],ids[i]];}
  return ids;
}
function seededId(s:MarketState,day:number,slot:number):string {
  const index=day<=3?day-1:(day-4)*3+Math.floor(slot/2);
  const cycle=Math.floor(index/itemDefs.length)+(day<=3?100:0);
  return shuffled(s.seed,cycle)[index%itemDefs.length];
}
export function marketStock(s:MarketState,day=s.day,slot=s.cursor):MarketStock {
  const opening=[['ITM-011','ITM-001'],['ITM-009','ITM-010'],['ITM-049','ITM-050']];
  if(day<=3&&slot<4){
    const defId=opening[day-1][Math.floor(slot/2)],def=getDef(defId),unverified=day===3&&slot===0;
    return{defId,condition:slot===0?.65:.8,working:slot!==0,authentic:!(day===2&&slot===2),sourceVerified:!unverified,
      source:unverified?'封签批次与旧港注销清单待比对':'供货人登记回执 / 旧港回收批次',price:Math.round(def.value*(slot===0?.42:.7))};
  }
  const defId=seededId(s,day,slot),def=getDef(defId),key=`${s.seed}/${day}/${slot}/physical-v1`;
  const draw=(tag:string)=>hash(key+'/'+tag)/4294967296;
  const condition=Math.round((.45+draw('wear')*.5)*100)/100;
  const working=draw('working')>=.35,authentic=draw('authentic')>=.2,sourceVerified=draw('source')>=.28;
  const origins=['港务退役设备清单','拾荒船舱回收批次','维修工备件清库','居民搬舱转让回执'];
  const origin=origins[Math.floor(draw('origin')*origins.length)];
  const lotId=`MKT-${hash(s.seed).toString(16).toUpperCase().padStart(8,'0')}-${day}-${slot}`;
  // The asking price reflects the seller's claim, not the still-hidden physical truth.
  const price=Math.max(1,Math.round(def.value*(.48+draw('ask')*.27)));
  return{defId,condition,working,authentic,sourceVerified,source:`${origin} / ${sourceVerified?'回执已核对':'回执待补证'} · ${lotId}`,price,lotId};
}
export function stockPreview(s:MarketState,day=s.day,slot=s.cursor):StockPreview {
  const stock=marketStock(s,day,slot),value=getDef(stock.defId).value;
  return{defId:stock.defId,source:stock.source,priceBand:[Math.round(value*.4),Math.round(value*.8)]};
}
export function marketNpcId(s:MarketState,day=s.day,slot=s.cursor):string {
  if(day<=3&&slot<4)return ['CHR-004','CHR-002','CHR-005','CHR-003'][slot];
  const visitors=npcs.filter(n=>n.id!=='CHR-001');
  return visitors[hash(`${s.seed}/${day}/${slot}/visitor`)%visitors.length].id;
}
export function stockItemOptions(stock:MarketStock):Partial<OrbitalItem> {
  const {defId:_,price:__,...physical}=stock;return physical;
}
