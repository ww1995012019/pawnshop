import type {OrderState} from './types';

export type OrderGroup='current'|'history'|'upcoming';
interface ListedOrder {id:string;dueDay:number}

/** Group catalogue entries without changing saved order state or catalogue order. */
export function ordersForGroup<T extends ListedOrder>(defs:readonly T[],states:readonly OrderState[],day:number,earliest:Readonly<Record<string,number>>,group:OrderGroup):T[] {
  const status=(id:string)=>states.find(s=>s.id===id)?.status||'available';
  return defs.filter(order=>{
    const state=status(order.id);
    if(state==='done'||state==='failed')return group==='history';
    if(state==='available'&&(earliest[order.id]||1)>day)return group==='upcoming';
    return group==='current';
  }).sort((a,b)=>{
    if(group==='current'){
      const active=Number(status(b.id)==='active')-Number(status(a.id)==='active');
      if(active)return active;
    }
    if(group==='upcoming'){
      const unlock=(earliest[a.id]||1)-(earliest[b.id]||1);
      if(unlock)return unlock;
    }
    return (group==='history'?b.dueDay-a.dueDay:a.dueDay-b.dueDay)||a.id.localeCompare(b.id);
  });
}

export function selectedOrderId(orders:readonly ListedOrder[],preferred:string):string {
  return orders.some(order=>order.id===preferred)?preferred:orders[0]?.id||'';
}
