import type {ItemDef,OrbitalState} from './types';
import {dailyVisitLimit,stockPreview,type StockPreview} from './Market';

export function cataloguePage(defs:readonly ItemDef[],requested:number,pageSize=6):{items:ItemDef[];page:number;pages:number} {
  const size=Number.isInteger(pageSize)&&pageSize>0?pageSize:6;
  const pages=Math.max(1,Math.ceil(defs.length/size));
  const page=Math.max(0,Math.min(pages-1,Number.isFinite(requested)?Math.floor(requested):0));
  return{items:defs.slice(page*size,(page+1)*size),page,pages};
}

/** Only announced model/source/market range. Instance readings stay at the workbench. */
export function remainingStock(s:Pick<OrbitalState,'seed'|'day'|'cursor'> & {trade:unknown}):{slot:number;stock:StockPreview}[] {
  const first=s.cursor+(s.trade?1:0),result:{slot:number;stock:StockPreview}[]=[];
  for(let slot=first;slot<dailyVisitLimit(s);slot++)if(slot%2===0)result.push({slot,stock:stockPreview(s,s.day,slot)});
  return result;
}
