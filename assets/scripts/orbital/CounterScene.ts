import {Color,EventTouch,Graphics,Input,Label,Node,Tween,UIOpacity,UITransform,Vec2,Vec3,tween} from 'cc';
import type {OrbitalHost} from './ui-types';
import type {OrbitalItem} from './types';
import {counterGoods,canHandleItem,isPrototype,prototypeReading} from './PropMechanics';
import {InteractiveProps} from './InteractiveProps';
import {getDef} from './data';
import {estimate} from './model';

/** Real inventory on a scene rack and a physical work mat; no inventory copies are created. */
export class CounterScene {
 private held='';
 private offset=0;
 private drag:{node:Node;ghost:Node|null;id:number|null;origin:Vec2;slot:{x:number;y:number;size:number};dx:number;dy:number;moved:boolean;uid:string}|null=null;
 constructor(private readonly h:OrbitalHost,readonly props:InteractiveProps,private readonly sound:(key:string)=>void){}
 get focused():boolean{return !!this.held;}
 release():void{this.cancelDrag();this.held='';}
 reset():void{this.release();this.offset=0;}
 private resolve(uid:string):OrbitalItem|undefined{return canHandleItem(this.h.state,uid)?this.h.state.inventory.find(i=>i.uid===uid):undefined;}
 private available(uid:string):boolean{return !this.h.busy&&!!this.resolve(uid)&&!this.h.ui.root.children.some(n=>n.name==='modal-overlay'&&n.activeInHierarchy);}
 update():void{if(this.drag&&!this.available(this.drag.uid))this.cancelDrag();}
 draw(parent:Node,focusOnly=false):boolean {
  this.cancelDrag();
  if(this.h.state.trade)return false;
  const item=this.resolve(this.held);if(this.held&&!item)this.held='';
  if(item){this.workbench(parent,item);return true;}
  if(!focusOnly)this.rack(parent);return false;
 }
 /** Goods currently standing in the cabinet page; the painted shelf shows the rest. */
 rackUids():string[]{
  if(this.h.state.trade||this.held)return [];
  const items=counterGoods(this.h.state),offset=Math.min(this.offset,Math.max(0,Math.floor((items.length-1)/3)*3));
  return items.slice(offset,offset+3).map(i=>i.uid);
 }
 /** Take an original from the back shelf onto the work mat. */
 take(uid:string):void{this.pick(uid);}
 private pick(uid:string):void {if(!this.available(uid))return;this.held=uid;this.h.selected=uid;this.sound('drop');this.h.render();}
 private rack(p:Node):void {
  const ui=this.h.ui,phone=ui.phone,items=counterGoods(this.h.state),left=phone?32:250,top=phone?168:176,width=phone?716:880,floor=phone?420:482;
  const g=ui.container(p,left,top,width,350,'physical-display-cabinet').addComponent<Graphics>(Graphics);
  g.fillColor=new Color('#08101248');g.roundRect(0,-(floor-top+10),width,floor-top,10);g.fill();
  g.strokeColor=new Color('#907B5C99');g.lineWidth=5;g.moveTo(2,-20);g.lineTo(2,-(floor-top+16));g.lineTo(width-2,-(floor-top+16));g.lineTo(width-2,-20);g.stroke();
  for(const x of [14,width-14]){g.fillColor=new Color('#B49764');g.circle(x,-(floor-top+9),4);g.fill();}
  ui.texturePanel(p,left-8,floor,width+16,30,{skin:'rail',name:'cabinet-wood-shelf'});
  ui.label(p,phone?'陈列工作柜 · 点按拿取':'陈列工作柜 · 点按或拖出实物',left+120,phone?128:126,width-240,108,{size:phone?30:25,bold:true,color:'#ECD7B6',align:'center',verticalAlign:'center',wrap:false});
  this.offset=Math.min(this.offset,Math.max(0,Math.floor((items.length-1)/3)*3));
  const slots=items.slice(this.offset,this.offset+3),size=phone?216:264,step=width/3;
  slots.forEach((item,i)=>{
   const x=left+i*step+(step-size)/2,foot=item.defId==='ITM-001'?430:item.defId==='ITM-003'?486:474,y=floor-foot*size/480;
   const node=ui.container(p,x,y,size,size,`scene-display-${item.uid}`);
   const view=this.props.create(node,item,0,0,size);if(!view)ui.object(node,item.defId,0,0,size,size,{repaired:item.repaired});
   ui.bindDraggable(node,()=>this.available(item.uid));
   // Hover lifts the original off the shelf a little, pivoting on its foot.
   const lift=(on:boolean)=>{
    if(this.drag?.node===node||this.h.prefs.reducedMotion)return;
    const k=on?1.05:1;Tween.stopAllByTarget(node);
    tween<Node>(node).to(on?.14:.18,{scale:new Vec3(k,k,1),position:new Vec3(x-(k-1)*size/2,-(y-(k-1)*size-(on?8:0)),0)},{easing:on?'backOut':'quadOut'}).start();
   };
   node.on(Node.EventType.MOUSE_ENTER,()=>{if(this.available(item.uid))lift(true);});
   node.on(Node.EventType.MOUSE_LEAVE,()=>lift(false));
   Object.assign(node,{__action:()=>this.pick(item.uid),__enabled:true});
   ui.label(p,getDef(item.defId).name,left+i*step+6,floor+36,step-12,42,{size:phone?27:23,color:'#F3E1C3',align:'center',verticalAlign:'center',wrap:false});
   const value=estimate(item);ui.label(p,`估值 ${value.low}–${value.high} Cr`,left+i*step+6,floor+78,step-12,32,{size:phone?23:17,color:'#AEBBB4',align:'center',verticalAlign:'center',wrap:false});
   node.on(Node.EventType.TOUCH_START,(e:EventTouch)=>{if(this.drag||!this.available(item.uid))return;e.propagationStopped=true;Tween.stopAllByTarget(node);node.setScale(1,1,1);this.drag={node,ghost:null,id:e.getID(),origin:e.getUILocation().clone(),slot:{x,y,size},dx:0,dy:0,moved:false,uid:item.uid};});
   node.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{
    const d=this.drag;if(!d||d.node!==node||d.id!==e.getID())return;e.propagationStopped=true;if(!this.available(item.uid)){this.cancelDrag();return;}
    const point=e.getUILocation();d.dx=point.x-d.origin.x;d.dy=d.origin.y-point.y;
    if(Math.abs(d.dx)+Math.abs(d.dy)>18)d.moved=true;
    if(d.moved){
     if(!d.ghost){d.ghost=ui.container(p,x,y,size,size,'held-scene-origin');const mark=d.ghost.addComponent<Graphics>(Graphics);mark.strokeColor=new Color('#E0B57788');mark.lineWidth=2;mark.ellipse(size/2,-size*.92,size*.36,10);mark.stroke();this.sound('drop');}
     node.setPosition(Math.max(left-30,Math.min(left+width-size+30,x+d.dx)),-Math.max(140,Math.min(610,y+d.dy)));node.angle=Math.max(-5,Math.min(5,d.dx*.02));

    }
   });
   const finish=(e:EventTouch)=>{const d=this.drag;if(!d||d.node!==node||d.id!==e.getID())return;e.propagationStopped=true;const released=e.getEventCode()===Input.EventType.TOUCH_END,use=released&&(!d.moved||(d.dy>30&&d.slot.y+d.dy>floor-130));this.cancelDrag();if(use)this.pick(item.uid);};
   node.on(Node.EventType.TOUCH_END,finish);node.on(Node.EventType.TOUCH_CANCEL,finish);
  });
  if(!slots.length)ui.label(p,'工作柜空了。可去后仓整理库存，或接待来客收货。',left+30,top+90,width-60,180,{size:phone?32:25,color:'#C3CEC3',align:'center'});
  if(items.length>3){
   const prev=this.h.button(p,'‹',left,phone?128:126,108,108,()=>{this.offset=Math.max(0,this.offset-3);this.h.render();},{disabled:this.offset===0,name:'cabinet-prev',tone:'quiet',size:38});
   const next=this.h.button(p,'›',left+width-108,phone?128:126,108,108,()=>{this.offset+=3;this.h.render();},{disabled:this.offset+3>=items.length,name:'cabinet-next',tone:'quiet',size:38});
   // Keep the arrows physically beside the shelf; the broadcast begins below the phone rack.
   void prev;void next;
  }
 }
 private workbench(p:Node,item:OrbitalItem):void {
  const ui=this.h.ui,phone=ui.phone;
  // A shallow counter mat receives the object, rather than replacing the shop with a modal.
  const bed=ui.texturePanel(p,148,606,878,140,{skin:'rail',name:'physical-counter-workmat'}),g=bed.addComponent<Graphics>(Graphics);
  g.strokeColor=new Color('#D5B37C66');g.lineWidth=2;for(const x of [20,848]){g.moveTo(x,-16);g.lineTo(x,-112);g.stroke();}
  const caption=ui.paperSlip(p,46,166,242,76,{name:'physical-item-name',torn:true});
  ui.label(caption,getDef(item.defId).name,18,0,206,76,{size:phone?31:27,bold:true,color:'#302619',verticalAlign:'center',wrap:false});
  const panel=ui.texturePanel(p,1080,142,496,622,{skin:'socket',name:'counter-observation-terminal'});
  ui.label(panel,'原物检视',22,14,452,64,{size:phone?36:29,bold:true,color:'#EAD3A9',verticalAlign:'center',wrap:false});
  ui.label(panel,'直接操作左侧部件',22,82,452,48,{size:phone?28:22,color:'#90C4BD',verticalAlign:'center',wrap:false});
  const status=ui.label(panel,'',22,144,452,132,{size:phone?29:23,lineHeight:phone?39:34,color:'#E7E5D6',wrap:true,overflow:'clamp'}).getComponent<Label>(Label)!;
  const fee=ui.label(panel,'',22,278,452,42,{size:phone?27:21,color:'#DEB878',verticalAlign:'center',wrap:false}).getComponent<Label>(Label)!;
  let record:Node;
  const refresh=()=>{
   const current=this.resolve(item.uid);if(!current)return;
   const reading=prototypeReading(current,this.props.states.get(item.uid));status.string=reading.hint;
   const paid=current.inspectedPaid||this.h.state.upgrades.lamp,recorded=!!reading.tool&&current.evidence.includes(reading.tool);
   fee.string=recorded?'这条物证已保存 · 免费复看':paid?'记录本件后续观察不耗 AP':'首次记录本件消耗 1 AP';
   const enabled=reading.ready&&!!reading.tool&&this.h.state.phase==='open'&&(paid||this.h.state.ap>=1);
   if(record){ui.setButtonEnabled(record,enabled);Object.assign(record,{__enabled:enabled});}
  };
  const view=this.props.create(p,item,230,118,620,{interactive:true,allowed:()=>!this.h.busy&&!!this.resolve(item.uid),onChange:refresh,onSound:this.sound});
  if(!view)ui.object(p,item.defId,330,230,440,440,{repaired:item.repaired});
  else if(!this.h.prefs.reducedMotion){const scale=620/480;view.node.setScale(scale*.92,scale*.92,1);tween<Node>(view.node).to(.24,{scale:new Vec3(scale,scale,1)},{easing:'cubicOut'}).start();}
  record=this.h.button(panel,'记录观察',22,phone?282:330,452,108,()=>{const current=this.resolve(item.uid);if(!current)return;const r=prototypeReading(current,this.props.states.get(item.uid));if(r.ready&&r.tool)this.h.dispatch({type:'CHECK',uid:item.uid,tool:r.tool});},{tone:'gold',size:phone?34:26,name:'counter-record-observation',disabled:true});
  this.h.button(panel,'放上鉴定台',22,phone?396:450,452,phone?108:72,()=>{if(this.resolve(item.uid))this.h.navigate('inspect',item.uid);},{tone:'quiet',size:phone?32:25,name:'counter-inspect-original'});
  this.h.button(panel,'放回陈列柜',22,phone?510:534,452,phone?108:72,()=>{this.release();this.sound('drop');this.h.render();},{tone:'quiet',size:phone?32:25,name:'counter-return-original'});
  if(phone){status.node.setPosition(22,-132);status.node.getComponent<UITransform>(UITransform)!.setContentSize(452,110);fee.node.setPosition(22,-246);fee.node.getComponent<UITransform>(UITransform)!.setContentSize(452,32);}
  refresh();
 }
 cancelDrag():void {
  const d=this.drag;this.drag=null;if(!d)return;
  if(d.node.isValid){Tween.stopAllByTarget(d.node);d.node.setScale(1,1,1);d.node.setPosition(d.slot.x,-d.slot.y);d.node.angle=0;const opacity=d.node.getComponent<UIOpacity>(UIOpacity);if(opacity)opacity.opacity=255;}
  if(d.ghost?.isValid){d.ghost.removeFromParent();d.ghost.destroy();}
 }
}
