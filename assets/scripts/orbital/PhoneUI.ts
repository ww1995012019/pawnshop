import type {Node} from 'cc';
import type {ButtonOptions,ModalHandle} from '../ui/GameUI';
import type {OrbitalHost} from './ui-types';
import type {OrbitalItem} from './types';
import {getDef} from './data';
import {ORBITAL_PALETTE as C} from './OrbitalUI';

/** Phone rectangles stay in the same 1600×900 space as the game and its touch camera. */
export class PhoneUI {
  constructor(private readonly h:Pick<OrbitalHost,'ui'|'button'> & {prefs?:OrbitalHost['prefs']}){}
  text(p:Node,t:string,x:number,y:number,w:number,h:number,size=32,color=C.text):Node {
    return this.h.ui.label(p,t,x,y,w,h,{size:size*(this.h.prefs?.largeText?1.08:1),color,lineHeight:Math.round(size*1.4),wrap:true,overflow:'clamp'});
  }
  row(p:Node,t:string,x:number,y:number,w:number,h=108,size=34,color=C.text):Node {
    return this.h.ui.label(p,t,x,y,w,h,{size:size*(this.h.prefs?.largeText?1.08:1),color,verticalAlign:'center',wrap:false});
  }
  button(p:Node,t:string,x:number,y:number,w:number,fn:()=>void,options:ButtonOptions={}):Node {
    return this.h.button(p,t,x,y,w,108,fn,{size:34,tone:'quiet',...options});
  }
  panel(p:Node,x:number,y:number,w:number,h:number,name='phone-panel'):Node {
    return this.h.ui.texturePanel(p,x,y,w,h,{skin:'socket',name});
  }
  sheet(title:string):ModalHandle{return this.h.ui.modal(title,{width:1520,height:860});}
  confirm(title:string,text:string,confirm:()=>void):void {
    const m=this.sheet(title);let settled=false;
    this.text(m.body,text,24,20,1400,420,38);
    this.button(m.body,'返回',24,536,688,()=>{settled=true;m.close();});
    this.button(m.body,'确认执行',736,536,688,()=>{if(settled)return;settled=true;m.close();confirm();},{tone:'gold'});
  }
  /** Four large cards plus a page turner; no UID is inferred from a visible list index. */
  choose(title:string,items:readonly OrbitalItem[],selected:string,onChoose:(item:OrbitalItem)=>void):void {
    const m=this.sheet(title);let offset=Math.max(0,Math.floor(items.findIndex(i=>i.uid===selected)/4)*4);
    const draw=()=>{
      this.h.ui.clear(m.body);
      items.slice(offset,offset+4).forEach((it,i)=>this.itemCard(m.body,it,16,i*132,1416,120,()=>{m.close();onChoose(it);},it.uid===selected));
      if(!items.length)this.text(m.body,'暂无符合条件的实物。',24,100,1380,200,38);
      this.button(m.body,'上一页',16,540,440,()=>{offset=Math.max(0,offset-4);draw();},{disabled:offset===0,name:'phone-item-prev'});
      this.row(m.body,`${Math.floor(offset/4)+1} / ${Math.max(1,Math.ceil(items.length/4))}`,530,540,390);
      this.button(m.body,'下一页',992,540,440,()=>{offset+=4;draw();},{disabled:offset+4>=items.length,name:'phone-item-next'});
    };draw();
  }
  itemCard(p:Node,it:OrbitalItem,x:number,y:number,w:number,h:number,fn:()=>void,selected=false):Node {
    const b=this.h.button(p,'',x,y,w,h,fn,{selected,tone:'quiet',name:`phone-item-${it.uid}`});
    this.h.ui.object(b,it.defId,12,10,104,h-20,{repaired:it.repaired,damaged:!it.working});
    this.row(b,getDef(it.defId).name,132,8,w-150,56,32);
    const state=it.owner==='customer'?'顾客原物':it.owner==='pawn'?'抵押保管':it.repaired?'已修复':!it.working?'待维修':it.location==='display'?'销售架':'店铺自有';
    this.row(b,`${state} · ${it.evidence.length} 项物证`,132,64,w-150,44,26,C.muted);return b;
  }
}
