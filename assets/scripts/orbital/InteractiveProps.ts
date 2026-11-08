import {Color,EventTouch,Graphics,Input,Node,Rect,Size,Sprite,SpriteFrame,UITransform,Vec2,Vec3} from 'cc';
import type {OrbitalUI} from './OrbitalUI';
import type {OrbitalItem} from './types';
import {isPrototype,PropStateStore,type PrototypeAction} from './PropMechanics';

interface LiveOptions {interactive?:boolean;allowed?:()=>boolean;onChange?:()=>void;onSound?:(key:string)=>void}
interface Part {node:Node;image:Node;x:number;y:number;angle?:number}
interface Hot {node:Node;key:string;cx:number;cy:number;action:()=>void}
const mix=(a:number,b:number,t:number)=>a+(b-a)*t;
const clamp=(v:number)=>Math.max(0,Math.min(1,v));
const attached=(n:Node,root:Node):boolean=>{for(let p:Node|null=n;p;p=p.parent)if(p===root)return true;return false;};

/** Shared per-UID mechanical posture; artwork is twelve independent transparent components. */
export class InteractiveProps {
 readonly states=new PropStateStore();
 private frames=new Map<number,SpriteFrame>();
 private views:LivePropView[]=[];
 constructor(readonly ui:OrbitalUI,private readonly reduced:()=>boolean){}
 create(parent:Node,item:OrbitalItem,x:number,y:number,size:number,options:LiveOptions={}):LivePropView|null {
  if(!isPrototype(item.defId))return null;
  const view=new LivePropView(this,parent,item,x,y,size,options);this.views.push(view);return view;
 }
 frame(index:number):SpriteFrame|undefined {
  const known=this.frames.get(index);if(known)return known;
  const source=this.ui.frames.get('orbital-prop-parts');if(!source)return undefined;
  const w=source.rect.width/4,h=source.rect.height/3,frame=new SpriteFrame();
  frame.reset({texture:source.texture,rect:new Rect(source.rect.x+(index%4)*w,source.rect.y+Math.floor(index/4)*h,w,h),originalSize:new Size(w,h),offset:new Vec2(0,0)});
  this.frames.set(index,frame);return frame;
 }
 update(dt:number):void {
  this.views=this.views.filter(v=>{const live=v.node.isValid&&attached(v.node,this.ui.root);if(!live)v.cancel();return live;});
  for(const view of this.views)view.update(dt,this.reduced());
 }
 cancel():void{for(const v of this.views)v.cancel();}
 reset():void{this.cancel();this.states.clear();}
 dispose():void {this.cancel();this.views=[];for(const f of this.frames.values())f.destroy();this.frames.clear();}
 snapshot():{uid:string;open:boolean;extracted:boolean;power:boolean;dial:number;leaves:number[]}[]{
  const seen=new Set<string>();return this.views.filter(v=>v.node.isValid&&attached(v.node,this.ui.root)&&!seen.has(v.item.uid)&&!!seen.add(v.item.uid)).map(v=>({uid:v.item.uid,...this.states.get(v.item.uid),leaves:[...this.states.get(v.item.uid).leaves]}));
 }
}

export class LivePropView {
 readonly node:Node;
 private parts=new Map<string,Part>();
 private hot:Hot[]=[];
 private ink:Graphics;
 private shadow:Graphics;
 private front:Graphics;
 private current:{open:number;extracted:number;power:number;dial:number;leaves:number[]};
 private clock=0;
 private hovering='';
 private drag:{key:string;id:number|null;start:Vec3;value:number;moved:boolean}|null=null;
 private lift:number|null=null;
 private onChange:()=>void;
 private available():boolean {
  return this.node.activeInHierarchy&&this.options.allowed?.()!==false&&!this.owner.ui.root.children.some(n=>n.name==='modal-overlay'&&n.activeInHierarchy);
 }
 constructor(private readonly owner:InteractiveProps,parent:Node,readonly item:OrbitalItem,x:number,y:number,size:number,private readonly options:LiveOptions){
  const ui=owner.ui,s=owner.states.get(item.uid);this.current={open:+s.open,extracted:+s.extracted,power:+s.power,dial:s.dial,leaves:[...s.leaves]};
  this.node=ui.container(parent,x,y,480,480,`live-prop-${item.uid}`);this.node.setScale(size/480,size/480,1);
  this.shadow=ui.container(this.node,0,0,480,480,'prop-contact-shadow').addComponent<Graphics>(Graphics);
  this.ink=ui.container(this.node,0,0,480,480,'prop-inner-light').addComponent<Graphics>(Graphics);
  this.onChange=options.onChange||(()=>{});
  if(item.defId==='ITM-001')this.water();else if(item.defId==='ITM-002')this.mug();else this.lamp();
  this.front=ui.container(this.node,0,0,480,480,'prop-contact-light').addComponent<Graphics>(Graphics);
  this.update(0,true);
 }
 private part(key:string,index:number,x:number,y:number,size:number,pivot?:{x:number;y:number}):Part {
  const ui=this.owner.ui,node=ui.container(this.node,x,y,1,1,`prop-part-${key}`);
  const px=pivot?.x??256,py=pivot?.y??256;
  const image=ui.frame(node,this.owner.frame(index),-px/512*size,-py/512*size,size,size,{fit:'contain',name:`prop-art-${key}`});
  const p={node,image,x,y};this.parts.set(key,p);return p;
 }
 private water():void {
  // Cap seat and cavity centre follow the source-art attachment landmarks.
  this.part('filter',2,239,290,262);
  this.part('body',0,240,290,320);
  this.part('connector',3,324,226,102);
  this.part('cap',1,239,126,240);
  this.target('cap',239,64,()=>this.act({type:'open'}));
  this.target('filter',239,290,()=>this.act({type:'extract'}));
 }
 private mug():void {
  this.part('heater',6,194,414,190);
  this.part('body',4,238,276,360);
  this.part('dial',7,263,354,86);
  this.part('lid',5,195,101,272);
  this.target('lid',195,102,()=>this.act({type:'open'}));
  this.target('dial',263,338,()=>{const s=this.owner.states.get(this.item.uid);this.act({type:'dial',value:s.dial>=.85?.2:Math.min(.85,s.dial+.15)});});
  this.target('heater',128,448,()=>this.act({type:'extract'}));
  this.target('power',273,448,()=>this.act({type:'power'}));
 }
 private lamp():void {
  this.part('leaf-0',9,211,309,260,{x:353.06,y:460.88});
  this.part('leaf-1',10,240,291,260,{x:254.09,y:460.91});
  this.part('leaf-2',11,269,309,260,{x:155.66,y:460.88});
  this.part('base',8,240,380,240);
  for(let i=0;i<3;i++)this.target(`leaf-${i}`,240,180,()=>this.act({type:'leaf',index:i}));
  this.target('power',240,434,()=>this.act({type:'power'}));
 }
 private act(action:PrototypeAction):void {
  if(!this.available())return;
  const before=this.owner.states.get(this.item.uid);
  if(action.type==='extract'&&!before.open)this.owner.ui.toast('先打开上盖，再取出内部部件。');
  else if(action.type==='open'&&this.item.defId==='ITM-001'&&before.open&&before.extracted)this.owner.ui.toast('先把同一根滤芯推回，再合上上盖。');
  else if(action.type==='extract'&&this.item.defId==='ITM-002'&&before.power)this.owner.ui.toast('先关闭底座电源，再移动加热座。');
  this.owner.states.apply(this.item.uid,this.item.defId,action);this.options.onSound?.(action.type==='power'?'check':'drop');this.onChange();
 }
 private target(key:string,cx:number,cy:number,fn:()=>void):void {
  if(!this.options.interactive)return;
  const ui=this.owner.ui,node=ui.container(this.node,cx-64,cy-64,128,128,`prop-${this.item.uid}-${key}`);
  const invoke=()=>{if(this.available())fn();};
  Object.assign(node,{__action:invoke,__enabled:true});
  node.on(Node.EventType.MOUSE_ENTER,()=>{this.hovering=key;});node.on(Node.EventType.MOUSE_LEAVE,()=>{if(this.hovering===key)this.hovering='';});
  node.on(Node.EventType.TOUCH_START,(e:EventTouch)=>{
   e.propagationStopped=true;if(this.drag||!this.available())return;
   const p=e.getUILocation(),s=this.owner.states.get(this.item.uid);this.drag={key,id:e.getID(),start:new Vec3(p.x,p.y),value:key==='dial'?s.dial:+s.extracted,moved:false};this.hovering=key;
  });
  node.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{
   e.propagationStopped=true;const d=this.drag;if(!d||d.key!==key||d.id!==e.getID())return;
   if(!this.available()){this.cancel();return;}
   const p=e.getUILocation(),scale=Math.max(.1,this.node.worldScale.x),dx=(p.x-d.start.x)/scale,dy=(p.y-d.start.y)/scale;
   if(Math.abs(dx)+Math.abs(dy)>10)d.moved=true;
   if(key==='dial'&&d.moved){this.owner.states.apply(this.item.uid,this.item.defId,{type:'dial',value:d.value+dx/190});this.onChange();}
   if((key==='filter'||key==='heater')&&this.owner.states.get(this.item.uid).open&&d.moved)this.lift=clamp(d.value+(key==='heater'?-dx:dy)/110);
  });
  const finish=(e:EventTouch,cancelled:boolean)=>{
   e.propagationStopped=true;const d=this.drag;if(!d||d.key!==key||d.id!==e.getID())return;
   // A moving target can leave the finger; Cocos rewrites that normal release to CANCEL.
   const released=!cancelled||(d.moved&&['filter','heater','dial'].includes(key)&&e.getEventCode()===Input.EventType.TOUCH_END);
   if(!released||!this.available()){this.cancel();return;}
   this.drag=null;
   if((key==='filter'||key==='heater')&&d.moved&&this.lift!==null){const extracted=this.owner.states.get(this.item.uid).extracted;if((this.lift>.5)!==extracted)this.act({type:'extract'});}
   else if(!d.moved||key!=='dial')invoke();
   this.lift=null;this.hovering='';
  };
  node.on(Node.EventType.TOUCH_END,(e:EventTouch)=>finish(e,false));
  node.on(Node.EventType.TOUCH_CANCEL,(e:EventTouch)=>finish(e,true));
  ui.bindPointer(node,{cursor:key==='filter'||key==='heater'||key==='dial'?'grab':'pointer',disabled:()=>!this.available(),draggable:key==='filter'||key==='heater'||key==='dial'});
  this.hot.push({node,key,cx,cy,action:invoke});
 }
 cancel():void {this.drag=null;this.lift=null;this.hovering='';}
 private updateTargets():void {
  const state=this.owner.states.get(this.item.uid),size=this.owner.ui.phone?Math.max(128,108/Math.max(.1,this.node.worldScale.x)):112;
  const nextClosed=state.leaves.findIndex(v=>v<.5);
  for(const hot of this.hot){
   let x=hot.cx,y=hot.cy;
   if(hot.key==='cap'){x+=this.current.open*56;y-=this.current.open*45;}
   if(hot.key==='filter'){x-=this.current.extracted*118;y-=this.current.extracted*70;}
   if(hot.key==='lid'){x+=this.current.open*92;y-=this.current.open*12;}
   if(hot.key==='heater'){x-=this.current.extracted*90;y+=this.current.extracted*12;}
   if(hot.key==='power'){x-=this.current.extracted*90;y+=this.current.extracted*12;}
   if(hot.key.startsWith('leaf-')){
    const index=Number(hot.key.slice(-1)),p=this.parts.get(hot.key)!;const a=p.node.angle*Math.PI/180;
    const dx=index===0?-49.5:index===2?50:1,dy=-104;
    x=p.x+Math.cos(a)*dx+Math.sin(a)*dy;y=p.y-Math.sin(a)*dx+Math.cos(a)*dy;
    hot.node.active=state.leaves[index]>.5||index===nextClosed;
   }
   hot.node.setPosition(x-size/2,-y+size/2);hot.node.getComponent<UITransform>(UITransform)!.setContentSize(size,size);
   Object.assign(hot.node,{__enabled:this.available()});
  }
 }
 update(dt:number,reducedMotion:boolean):void {
  if(!this.node.isValid)return;
  if(this.drag&&!this.available())this.cancel();
  this.clock+=Math.min(.1,dt);const target=this.owner.states.get(this.item.uid),t=reducedMotion?1:Math.min(1,dt*13);
  this.current.open=mix(this.current.open,+target.open,t);this.current.extracted=mix(this.current.extracted,this.lift??+target.extracted,t);this.current.power=mix(this.current.power,+target.power,t);this.current.dial=mix(this.current.dial,target.dial,t);
  for(let i=0;i<3;i++)this.current.leaves[i]=mix(this.current.leaves[i],target.leaves[i],t);
  const move=(key:string,dx:number,dy:number,angle=0)=>{const p=this.parts.get(key);if(p){p.node.setPosition(p.x+dx,-p.y-dy);p.node.angle=angle;}};
  if(this.item.defId==='ITM-001'){
   move('cap',this.current.open*56,-this.current.open*45,-this.current.open*12);
   move('filter',-this.current.extracted*118,-this.current.extracted*70,-this.current.extracted*7);
   const filter=this.parts.get('filter')!.node;filter.setSiblingIndex(this.current.extracted>.03?this.parts.get('body')!.node.getSiblingIndex()+1:2);
  }else if(this.item.defId==='ITM-002'){
   move('lid',this.current.open*92,-this.current.open*12,-this.current.open*18);move('dial',0,0,45-this.current.dial*240);move('heater',-this.current.extracted*90,this.current.extracted*12);
   const heater=this.parts.get('heater')!;heater.node.setSiblingIndex(this.current.extracted>.03?this.parts.get('body')!.node.getSiblingIndex()+1:2);
   const sprite=heater.image.getChildByName('sprite')?.getComponent<Sprite>(Sprite);if(sprite)sprite.color=this.current.power>.1&&this.item.working?new Color(255,255,255):new Color(120,137,147);
  }else{
   move('leaf-0',0,0,-28+40*this.current.leaves[0]);move('leaf-1',0,-14*this.current.leaves[1],0);move('leaf-2',0,0,28-40*this.current.leaves[2]);
   for(let i=0;i<3;i++){const p=this.parts.get(`leaf-${i}`)!;const sprite=p.image.getChildByName('sprite')?.getComponent<Sprite>(Sprite);if(sprite){const bright=this.current.power>.1&&this.current.leaves[i]>.5&&this.item.working;const value=bright?255:142;sprite.color=new Color(value,value,bright?255:130,255);}}
  }
  this.paint(reducedMotion);this.updateTargets();
 }
 private paint(reduced:boolean):void {
  const g=this.ink,f=this.front,shadow=this.shadow,s=this.current;g.clear();f.clear();shadow.clear();
  shadow.fillColor=new Color('#02070878');shadow.ellipse(240,-(this.item.defId==='ITM-001'?432:480),128,16);shadow.fill();
  if(this.item.defId==='ITM-001'){
   if(s.extracted<.8){g.fillColor=new Color(83,189,199,Math.round(25*(1-s.extracted)));g.roundRect(195,-398,90,180,22);g.fill();g.strokeColor=new Color('#8AD8D655');g.lineWidth=2;const yy=236+(reduced?0:Math.sin(this.clock*2)*3);g.moveTo(200,-yy);g.lineTo(280,-yy);g.stroke();}
   if(s.extracted>.3&&!this.item.working&&!this.item.repaired){const x=239-s.extracted*118,y=290-s.extracted*70;f.strokeColor=new Color('#9F4931');f.lineWidth=2;f.moveTo(x-12,-y+56);f.lineTo(x+7,-y+31);f.lineTo(x-3,-y+8);f.lineTo(x+14,-y-16);f.stroke();}
  }else if(this.item.defId==='ITM-002'){
   if(s.extracted>.05){g.strokeColor=new Color('#100D0B');g.lineWidth=8;g.moveTo(196,-424);g.bezierCurveTo(180,-462,118,-467,194-s.extracted*90,-434-s.extracted*12);g.stroke();g.strokeColor=new Color('#B7854E');g.lineWidth=3;g.stroke();}
   const heat=this.item.working?s.power:0,x=194-s.extracted*90,y=402+s.extracted*12;f.fillColor=new Color(239,139,55,Math.round(65*heat));f.ellipse(x,-y,68,24);f.fill();
   if(heat>.2&&s.open>.5)for(let i=0;i<3;i++){const phase=reduced?.5:(this.clock*.55+i*.29)%1,x=181+i*18+Math.sin(phase*6)*8;g.strokeColor=new Color(225,231,211,Math.round((1-phase)*95*heat));g.lineWidth=3;g.moveTo(x,-148-phase*35);g.bezierCurveTo(x-13,-170-phase*45,x+15,-183-phase*49,x,-202-phase*55);g.stroke();}
  }else if(this.item.defId==='ITM-003'&&s.power>.05&&this.item.working){
   const opened=s.leaves.reduce((a,n)=>a+n,0)/3;g.fillColor=new Color(151,217,82,Math.round(s.power*opened*28));g.moveTo(220,-300);g.lineTo(100,-468);g.lineTo(380,-468);g.lineTo(260,-300);g.close();g.fill();g.fillColor=new Color(178,232,115,Math.round(s.power*opened*55));g.ellipse(240,-468,132,18);g.fill();
  }
  if(this.hovering){const hot=this.hot.find(h=>h.key===this.hovering);if(hot){const x=hot.node.position.x+hot.node.getComponent<UITransform>(UITransform)!.width/2,y=-hot.node.position.y+hot.node.getComponent<UITransform>(UITransform)!.height/2;f.strokeColor=new Color('#F5D29B99');f.lineWidth=2;f.circle(x,-y,22);f.stroke();}}
 }
}
