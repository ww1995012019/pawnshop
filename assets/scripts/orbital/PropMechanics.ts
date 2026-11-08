import type {OrbitalItem,OrbitalState,ToolId} from './types';

export const PROTOTYPE_IDS=['ITM-001','ITM-002','ITM-003'] as const;
export interface PrototypeState {open:boolean;extracted:boolean;power:boolean;dial:number;leaves:[number,number,number]}
export type PrototypeAction={type:'open'}|{type:'extract'}|{type:'power'}|{type:'dial';value:number}|{type:'leaf';index:number};
const clamp=(value:number,fallback=.4)=>Number.isFinite(value)?Math.max(0,Math.min(1,value)):fallback;
export function initialPrototype():PrototypeState{return{open:false,extracted:false,power:false,dial:.4,leaves:[0,0,0]};}
export function isPrototype(id:string):boolean{return (PROTOTYPE_IDS as readonly string[]).includes(id);}

/** Inspection posture is deliberately separate from ownership, faults and repair state. */
export function updatePrototype(id:string,prior:PrototypeState,action:PrototypeAction):PrototypeState {
 const s:PrototypeState={...prior,leaves:[...prior.leaves]};
 if(id==='ITM-001'){
  if(action.type==='open'&&(!s.open||!s.extracted))s.open=!s.open;
  if(action.type==='extract'&&s.open)s.extracted=!s.extracted;
 }else if(id==='ITM-002'){
  if(action.type==='open')s.open=!s.open;
  if(action.type==='extract'&&s.open&&!s.power)s.extracted=!s.extracted;
  if(action.type==='power')s.power=!s.power;
  if(action.type==='dial')s.dial=clamp(action.value,s.dial);
 }else if(id==='ITM-003'){
  if(action.type==='power')s.power=!s.power;
  if(action.type==='leaf'&&Number.isInteger(action.index)&&action.index>=0&&action.index<3)s.leaves[action.index]=s.leaves[action.index]>.5?0:1;
 }
 return s;
}
export function prototypeReading(item:OrbitalItem,s:PrototypeState):{hint:string;tool:ToolId|null;ready:boolean} {
 if(item.defId==='ITM-001')return{tool:'TOL-001',ready:s.open&&s.extracted,hint:!s.open?'旋开上盖，再把里面的滤芯抽出来。':!s.extracted?'握住滤芯向上拖出，露出内侧接缝。':!item.working&&!item.repaired?'滤芯接缝有裂痕，壳内仍留着湿痕。可记录观察。':'滤层与接缝已经露出，可记录当前实物的观察。'};
 if(item.defId==='ITM-002'){
  const ready=s.open&&s.extracted&&s.power&&s.dial>=.65&&s.dial<=.85;
  return{tool:'TOL-006',ready,hint:!s.open?'打开杯盖，再把下沿的加热座抽开。':!s.extracted?'把加热座下沿向外拖出，露出线圈。':!s.power?'按下杯底开关通电，再把旋钮调到 65–85%。':!item.working&&!item.repaired?'加热回路断续，温升不稳定。调到 65–85% 后记录。':ready?'温升进入采样区。可记录本件负载读数。':`当前负载 ${Math.round(s.dial*100)}%，转动旋钮调至 65–85%。`};
 }
 if(item.defId==='ITM-003'){
  const opened=s.leaves.filter(n=>n>.5).length;
  return{tool:'TOL-003',ready:opened===3&&s.power,hint:opened<3?`直接拨开三片灯叶 · 已展开 ${opened}/3。`:!s.power?'三片灯叶已展开，按底座开关观察照射光斑。':!item.working&&!item.repaired?'灯叶光斑不均，需结合谱线判断老化。可记录。':'灯叶与照射光斑已稳定，可记录谱线观察。'};
 }
 return{tool:null,ready:false,hint:'这件旧物可以拿到鉴定台，使用相应仪器检视。'};
}

export function canHandleItem(s:OrbitalState,uid:string):boolean {
 const item=s.inventory.find(i=>i.uid===uid);
 return !!item&&item.owner==='shop'&&!item.orderId&&!item.sealed&&(item.location==='warehouse'||item.location==='display')&&s.trade?.selectedUid!==uid;
}
/** The rack is an alternate view of real stock; putting it there does not list it for sale. */
export function counterGoods(s:OrbitalState):OrbitalItem[]{
 const priority=(it:OrbitalItem)=>{const i=(PROTOTYPE_IDS as readonly string[]).indexOf(it.defId);return i<0?10:i;};
 return s.inventory.filter(it=>canHandleItem(s,it.uid)).sort((a,b)=>priority(a)-priority(b));
}
export class PropStateStore {
 private states=new Map<string,PrototypeState>();
 get(uid:string):PrototypeState {let s=this.states.get(uid);if(!s){s=initialPrototype();this.states.set(uid,s);}return s;}
 apply(uid:string,id:string,action:PrototypeAction):PrototypeState {const next=updatePrototype(id,this.get(uid),action);this.states.set(uid,next);return next;}
 clear():void{this.states.clear();}
}
