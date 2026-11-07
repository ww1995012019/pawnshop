import {itemDefs} from './data';

export interface ItemArt {key:string;index:number;columns:number;rows:number;inset:number}
const ORIGINAL_ITEMS=[1,2,3,9,10,11,17,18,19,25,26,27,33,34,35,41,42,43,48,49,50,55,56,57];

/** A catalogue ID owns one cell on each face; new goods never borrow an old icon. */
export function getItemArt(itemId:string,back=false):ItemArt|undefined {
  const def=itemDefs.find(d=>d.id===itemId);
  if(!def)return undefined;
  if(def.art)return{key:back?def.art.back:def.art.front,index:def.art.index,columns:def.art.columns,rows:def.art.rows,inset:.035};
  const index=ORIGINAL_ITEMS.indexOf(Number(itemId.replace(/^ITM-/i,'')));
  return index<0?undefined:{key:back?'orbital-items-back':'orbital-items-front',index,columns:6,rows:4,inset:.035};
}
