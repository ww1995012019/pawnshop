import {Color,Graphics,Mask,Node,Rect,Size,Sprite,SpriteFrame,Tween,UIOpacity,UITransform,Vec2,Vec3} from 'cc';
import type {OrbitalUI} from './OrbitalUI';

export interface OrbitalPoint {x:number;y:number}
export interface OrbitalRect extends OrbitalPoint {width?:number;height?:number}
export interface OrbitalMotionRegions {contentArea?:OrbitalRect;inspectionArea?:OrbitalRect}
interface Bounds extends OrbitalPoint {width:number;height:number}
interface Task {kind:string;elapsed:number;duration:number;ended:boolean;alive:()=>boolean;frame:(p:number)=>void;complete:()=>void;resolve:()=>void}
interface Tracked {node:Node;kind:string}
interface Particle {node:Node;x:number;y:number;phase:number;speed:number}
const C={cyan:'#76BABB',orange:'#C38A4D',purple:'#998CA8',white:'#D6D2C7',muted:'#9CABA9',dark:'#101B22'};
const clamp=(n:number):number=>Math.max(0,Math.min(1,n));
const smooth=(n:number):number=>n*n*(3-2*n);
const ease=(n:number):number=>1-Math.pow(1-n,3);
const TAU=Math.PI*2;

/** Presentation only. No animation callback changes game money, AP, or ownership. */
export class OrbitalMotion {
  reducedMotion=false;
  private readonly layer:Node;
  private readonly aperture:Node;
  private readonly tasks:Task[]=[];
  private readonly tracked:Tracked[]=[];
  private readonly owned=new Set<Node>();
  private readonly moving=new Set<Node>();
  private ambient:Node|null=null;
  private ambientParent:Node|null=null;
  private actor:Node|null=null;
  private actorBase=new Vec3();
  private actorAngle=0;
  private particles:Particle[]=[];
  private ambientKey='';
  private contentArea:Bounds={x:24,y:108,width:1552,height:700};
  private inspectionArea:Bounds={x:244,y:216,width:992,height:366};
  private clock=0;
  private disposed=false;

  constructor(private readonly ui:OrbitalUI,private readonly root:Node){
    const a=this.contentArea;
    this.aperture=ui.container(root,a.x,a.y,a.width,a.height,'orbital-motion-workspace');
    this.aperture.addComponent<Mask>(Mask).type=Mask.Type.GRAPHICS_RECT;
    // Preserve the public screen-coordinate API inside a clipped content viewport.
    this.layer=ui.container(this.aperture,-a.x,-a.y,1600,900,'orbital-motion-overlay');
    this.aperture.active=false;
  }
  setRegions(regions:OrbitalMotionRegions):void {
    if(this.disposed)return;
    const content=this.bounds(regions.contentArea,this.contentArea),inspection=this.bounds(regions.inspectionArea,this.inspectionArea);
    if(JSON.stringify(content)===JSON.stringify(this.contentArea)&&JSON.stringify(inspection)===JSON.stringify(this.inspectionArea))return;
    this.finish();this.contentArea=content;this.inspectionArea=inspection;
    this.aperture.setPosition(content.x,-content.y);
    this.aperture.getComponent<UITransform>(UITransform)!.setContentSize(content.width,content.height);
    this.layer.setPosition(-content.x,content.y);
  }
  configure(settings:{reducedMotion:boolean}):void {
    this.reducedMotion=settings.reducedMotion;
    if(this.reducedMotion)this.finish();
  }
  update(dt:number):void {
    if(this.disposed)return;
    // Clamp only exceptional pauses. At low frame rates animation still progresses.
    const delta=Math.max(0,Math.min(.25,dt));this.clock+=delta;
    for(const task of [...this.tasks]){
      if(task.ended)continue;
      if(!task.alive()){this.end(task,false);continue;}
      task.elapsed+=delta;const p=this.reducedMotion?1:clamp(task.elapsed/task.duration);
      try{task.frame(p);if(p>=1)this.end(task,false);}
      catch(error){console.warn('[OrbitalMotion] Presentation frame stopped.',error);this.end(task,false);}
    }
    this.updateAmbient();
  }
  finish():void {
    for(const task of [...this.tasks])this.end(task,true);
    // Also remove orphan wrappers whose scene was detached before its next frame.
    for(const node of [...this.owned])this.drop(node);
    this.moving.clear();this.restoreActor();
    if(this.aperture.isValid)this.aperture.active=false;
  }
  dispose():void {
    if(this.disposed)return;this.disposed=true;this.finish();this.clearAmbient();
    this.drop(this.aperture);this.tracked.length=0;this.moving.clear();
  }
  snapshot():{phase:string;activeCount:number;busy:boolean;nodes:{id:string;kind:string;x:number;y:number;opacity:number}[];ambientClock:number}{
    const origin=this.root.worldPosition;
    const nodes=this.tracked.filter(t=>this.attached(t.node)).map(t=>{
      const p=t.node.worldPosition;return {id:t.node.uuid,kind:t.kind,x:p.x-origin.x,y:origin.y-p.y,opacity:t.node.getComponent<UIOpacity>(UIOpacity)?.opacity??255};
    });
    if(this.actor&&this.attached(this.actor)){const p=this.actor.worldPosition;nodes.push({id:this.actor.uuid,kind:'npc-breath',x:p.x-origin.x,y:origin.y-p.y,opacity:255});}
    return {phase:this.tasks[this.tasks.length-1]?.kind??'idle',activeCount:this.tasks.length,busy:!!this.tasks.length,nodes,ambientClock:this.clock};
  }

  bindAmbient(binding:{parent:Node;actor?:Node|null;area?:OrbitalRect;enabled?:boolean}):void {
    if(this.disposed)return;
    const enabled=binding.enabled??/^page-(counter|trade)$/.test(binding.parent.name);
    const actor=enabled&&binding.actor?.isValid?binding.actor:null;
    const area=this.intersect(this.bounds(binding.area,{x:390,y:165,width:790,height:390}),this.contentArea);
    const key=`${enabled}:${area.x}:${area.y}:${area.width}:${area.height}`;
    if(this.ambientParent===binding.parent&&this.actor===actor&&this.ambientKey===key&&(!enabled||this.ambient?.isValid))return;
    // A redraw invalidates old scene-bound animation, even before deferred destroy runs.
    if(this.ambientParent&&this.ambientParent!==binding.parent)this.finish();
    this.clearAmbient();if(!this.attached(binding.parent))return;
    this.ambientParent=binding.parent;this.ambientKey=key;this.actor=actor;
    if(this.actor){this.actorBase=this.actor.position.clone();this.actorAngle=this.actor.angle;}
    if(!enabled||area.width<=0||area.height<=0)return;
    this.ambient=this.ui.container(binding.parent,area.x,area.y,area.width,area.height,'orbital-atmosphere');
    this.ambient.addComponent<Mask>(Mask).type=Mask.Type.GRAPHICS_RECT;
    // Only a few dim motes in the shop; instruments and management pages stay still.
    for(let i=0;i<4;i++){
      const x=18+((i*197+117)%997)/997*Math.max(0,area.width-36);
      const y=18+((i*131+159)%991)/991*Math.max(0,area.height-36);
      const n=this.ui.container(this.ambient,x,y,3,3,'station-dust');const g=n.addComponent<Graphics>(Graphics);
      g.fillColor=this.color('#C7C5AC44');g.circle(0,0,1);g.fill();
      this.particles.push({node:n,x,y,phase:i*1.53,speed:.14+i*.02});
    }
  }

  sceneEntry():Promise<void>{
    if(this.disposed||!this.root.isValid)return Promise.resolve();
    // The opening is the only full-screen presentation; its entire layer is temporary.
    const entry=this.own(this.ui.container(this.root,0,0,1600,900,'orbital-opening-overlay'));
    entry.addComponent<Mask>(Mask).type=Mask.Type.GRAPHICS_RECT;
    const hatch=this.ui.panel(entry,0,0,1600,900,{fill:'#121B20',stroke:'#48504E',radius:0,name:'station-opening-hatch'});
    const g=hatch.addComponent<Graphics>(Graphics);
    for(let y=25;y<900;y+=72){g.strokeColor=this.color('#293631');g.lineWidth=2;g.moveTo(0,-y);g.lineTo(1600,-y);g.stroke();}
    g.strokeColor=this.color(C.orange);g.lineWidth=5;g.moveTo(785,0);g.lineTo(785,-900);g.stroke();
    g.strokeColor=this.color(C.muted);g.lineWidth=2;g.moveTo(805,0);g.lineTo(805,-900);g.stroke();
    this.ui.label(hatch,'轨道旧货局',410,335,780,86,{size:62,color:C.white,align:'center',bold:true});
    this.ui.label(hatch,'回环九号 · 下层旧港',410,439,780,44,{size:25,color:C.muted,align:'center'});
    this.ui.label(hatch,'舱门气压平衡完成',410,507,780,32,{size:18,color:C.orange,align:'center'});
    entry.setSiblingIndex(this.root.children.length-1);
    this.track(hatch,'station-hatch');
    return this.run('scene-entry',1.05,()=>this.attached(hatch),p=>{
      const e=ease(clamp((p-.12)/.88));hatch.setPosition(0,980*e);this.opacity(hatch).opacity=Math.round(255*(1-Math.max(0,p-.8)/.2));
    },()=>this.drop(entry));
  }
  enter(actor:Node):Promise<void>{
    if(this.disposed||!this.attached(actor))return Promise.resolve();
    const dest=this.actor===actor?this.actorBase.clone():actor.position.clone(),scale=actor.scale.clone(),angle=this.actor===actor?this.actorAngle:actor.angle;
    this.moving.add(actor);this.track(actor,'npc-walk-in');
    return this.run('npc-enter',.68,()=>this.attached(actor),p=>{
      const e=ease(p);actor.setPosition(dest.x-105*(1-e),dest.y-4*(1-e)+Math.sin(p*Math.PI*6)*1.6*(1-p),dest.z);
      actor.setScale(scale.x*(.96+.04*e),scale.y*(.96+.04*e),scale.z);actor.angle=angle+Math.sin(p*Math.PI*8)*1.4*(1-p);
      this.opacity(actor).opacity=Math.round(255*Math.min(1,p*3.3));
    },()=>{
      if(actor.isValid){actor.setPosition(dest);actor.setScale(scale);actor.angle=angle;this.opacity(actor).opacity=255;if(this.actor===actor){this.actorBase=dest.clone();this.actorAngle=angle;}}
      this.moving.delete(actor);this.untrack(actor);
    });
  }
  exit(npcId:string):Promise<void>{
    if(this.disposed)return Promise.resolve();
    this.top();
    // The transient exit lives above the scene, so keep the same worktop occlusion as the resident customer.
    const region=this.intersect(this.contentArea,{x:330,y:108,width:720,height:457});
    const aperture=this.own(this.ui.container(this.layer,region.x,region.y,region.width,region.height,'customer-exit-aperture'));
    aperture.addComponent<Mask>(Mask).type=Mask.Type.GRAPHICS_RECT;
    const actor=this.ui.customer(aperture,npcId,445-region.x,138-region.y,460,440);this.track(actor,'npc-walk-out');
    return this.run('npc-exit',.68,()=>this.attached(actor),p=>{
      const e=smooth(p);actor.setPosition(445-region.x-180*e,-138+region.y-3*e+Math.sin(p*Math.PI*6)*1.6);actor.angle=Math.sin(p*Math.PI*6)*.45;
      this.opacity(actor).opacity=Math.round(255*(1-Math.max(0,p-.35)/.65));
    },()=>this.drop(aperture));
  }

  handoff(itemId:string,from:OrbitalPoint,to:OrbitalPoint,onPlaced?:()=>void,targetSize=316):Promise<void>{
    if(this.disposed){onPlaced?.();return Promise.resolve();}
    this.top();const size=targetSize,startScale=to.y>from.y&&from.y<500?.82:1,endScale=to.y<from.y?.82:1,side=to.x>=from.x?'right':'left',handWidth=216,handHeight=198;
    const safe=this.intersect(this.contentArea,{x:310,y:108,width:930,height:700});
    const handWindow=this.own(this.ui.container(this.layer,safe.x,safe.y,safe.width,safe.height,'handoff-safe-window'));
    handWindow.addComponent<Mask>(Mask).type=Mask.Type.GRAPHICS_RECT;
    const stage=this.ui.container(handWindow,-safe.x,-safe.y,1600,900,'handoff-screen-space');
    const shadow=this.ui.container(stage,from.x,from.y+size*.475,180,20,'object-contact-shadow');const sg=shadow.addComponent<Graphics>(Graphics);
    sg.fillColor=this.color('#06101988');sg.ellipse(0,0,size*.525,12);sg.fill();
    const hand=this.ui.container(stage,0,0,handWidth,handHeight,'orbital-handoff-glove');
    const open=this.ui.hand(hand,side==='right'?'right_open':'left_open',0,0,handWidth,handHeight);
    const grip=this.ui.hand(hand,side==='right'?'right_grip':'left_grip',0,0,handWidth,handHeight);
    // Reuse the actual cloth at the atlas wrist cut. No painted rectangle or new art asset.
    const sleeveFrame=this.sleeveFrame(grip,side);
    const sleeveWidth=handWidth*.34;
    const sleeve=sleeveFrame?this.sleeve(stage,sleeveFrame,sleeveWidth,'handoff-forearm','#B8B19A'):null;
    const cuff=sleeveFrame?this.sleeve(stage,sleeveFrame,sleeveWidth,'handoff-cuff-join','#D4CBB3'):null;
    // The overlap is behind the original cuff, so the atlas cut cannot open a gap.
    if(sleeve)sleeve.setSiblingIndex(stage.children.indexOf(hand));
    if(cuff)cuff.setSiblingIndex(stage.children.indexOf(hand));
    const object=this.ui.item(stage,itemId,from.x-size/2,from.y-size/2,size,size);
    this.track(object,'handoff-object');this.track(hand,`hand-${side}-open`);this.track(shadow,'contact-shadow');
    if(sleeve)this.track(sleeve,'handoff-forearm');
    const rest={x:side==='right'?Math.min(1160,Math.max(from.x,to.x)+90):Math.max(390,Math.min(from.x,to.x)-90),y:815};
    return this.run('handoff',.94,()=>this.attached(object),p=>{
      const t=clamp((p-.16)/.64),e=smooth(t),lift=Math.sin(t*Math.PI)*42;
      const x=from.x+(to.x-from.x)*e,groundY=from.y+(to.y-from.y)*e,y=groundY-lift;
      const perspective=startScale+(endScale-startScale)*e;object.setScale(perspective,perspective,1);object.setPosition(x-size*perspective/2,-y+size*perspective/2);object.angle=Math.sin(t*Math.PI)*2;
      // Hand contact follows the lifted item; its shadow follows the same projected ground point.
      shadow.setPosition(x,-groundY-size*.475);shadow.setScale(perspective*(1-lift/150),perspective*(1-lift/210),1);
      this.opacity(shadow).opacity=Math.round(210-lift*1.7);
      const contact={x:x+(side==='right'?size*perspective*.15:-size*perspective*.15),y:y+size*perspective*.17};const reach=smooth(clamp(p/.16)),retreat=smooth(clamp((p-.82)/.18));
      let px=rest.x+(contact.x-rest.x)*reach,py=rest.y+(contact.y-rest.y)*reach;px+=(rest.x-px)*retreat;py+=(rest.y-py)*retreat;
      hand.setPosition(px-handWidth*(side==='right'?.36:.64),-py+handHeight*.42);
      if(sleeve&&cuff){
        const wrist={x:hand.position.x+handWidth*(side==='right'?.806:.191),y:-hand.position.y+handHeight*.968};
        cuff.setPosition(wrist.x,-wrist.y+13);cuff.angle=hand.angle;
        cuff.getComponent<UITransform>(UITransform)!.setContentSize(sleeveWidth,40);
        const join={x:wrist.x,y:wrist.y+14};
        const endX=Math.min(safe.x+safe.width-44,Math.max(join.x+130,1125));
        const dx=endX-join.x,dy=Math.max(50,safe.y+safe.height+64-join.y),length=Math.hypot(dx,dy),overlap=28;
        sleeve.setPosition(join.x-dx/length*overlap,-join.y+dy/length*overlap);
        sleeve.angle=Math.atan2(dx,dy)*180/Math.PI;
        sleeve.getComponent<UITransform>(UITransform)!.setContentSize(sleeveWidth*1.02,length+overlap+40);
      }
      const gripping=p>=.14&&p<.82;open.active=!gripping;grip.active=gripping;
      const record=this.tracked.find(r=>r.node===hand);if(record)record.kind=`hand-${side}-${gripping?'grip':'open'}`;
      const alpha=Math.round(255*Math.min(1,p*9)*(1-Math.max(0,p-.91)/.09));
      this.opacity(hand).opacity=alpha;if(sleeve)this.opacity(sleeve).opacity=alpha;if(cuff)this.opacity(cuff).opacity=alpha;
    },()=>{try{onPlaced?.();}finally{this.drop(handWindow);sleeveFrame?.destroy();}});
  }

  async deal(amount:number,itemId?:string):Promise<void>{
    if(this.disposed)return;
    // Credits stay on the counter terminal. The HUD already contains the committed balance.
    this.top();const wallet={x:1065,y:656},counter={x:900,y:556};const from=amount>=0?counter:wallet,to=amount>=0?wallet:counter;
    const tokens:Node[]=[];
    for(let i=0;i<3;i++){const n=this.own(this.token(from.x,from.y));tokens.push(n);this.track(n,'credit-token');}
    const value=this.own(this.ui.label(this.layer,`${amount>0?'+':''}${amount.toFixed(amount%1?2:0)} Cr`,925,687,230,34,{size:24,color:C.white,align:'center',bold:true}));this.track(value,'cash-value');
    const cash=this.run('credit-transfer',.94,()=>this.attached(value),p=>{
      tokens.forEach((n,i)=>{const t=clamp((p-i*.045)/.76),e=smooth(t);n.setPosition(from.x+(to.x-from.x)*e+Math.sin(t*Math.PI)*(i-1)*10,-from.y-(to.y-from.y)*e+Math.sin(t*Math.PI)*22);n.angle=t*30;this.opacity(n).opacity=Math.round(220*(1-Math.max(0,t-.8)/.2));});
      value.setPosition(925,-687+ease(p)*10);this.opacity(value).opacity=Math.round(255*Math.min(1,p*6)*(1-Math.max(0,p-.72)/.28));
    },()=>{tokens.forEach(n=>this.drop(n));this.drop(value);});
    const jobs=[cash,this.receipt(amount)];
    if(itemId)jobs.push(this.handoff(itemId,counter,amount>=0?{x:675,y:450}:{x:1120,y:635}));
    await Promise.all(jobs);
  }

  effect(kind:string,parent:Node,rect?:OrbitalRect):Promise<void>{
    if(this.disposed||!this.attached(parent))return Promise.resolve();
    const compact=kind==='stamp'||kind==='day'||kind==='upgrade';
    const defaults:Bounds=kind==='stamp'?{x:700,y:556,width:160,height:58}:compact?{x:600,y:334,width:360,height:116}:this.inspectionArea;
    let area=this.intersect(this.bounds(rect,defaults),this.contentArea);
    if(parent.name==='page-inspect')area=this.intersect(area,this.inspectionArea);
    // A clipped effect has no input listeners; the underlying controls remain the input owners.
    if(area.width<8||area.height<8)return Promise.resolve();
    const width=area.width,height=area.height;
    const clip=this.own(this.ui.container(parent,area.x,area.y,width,height,`effect-${kind}-clip`));
    clip.addComponent<Mask>(Mask).type=Mask.Type.GRAPHICS_RECT;
    const node=this.ui.container(clip,0,0,width,height,`effect-${kind}`);const g=node.addComponent<Graphics>(Graphics);
    this.track(node,kind);
    // The business panel owns action/readout text. Effects add no competing floating captions.
    const duration=kind==='stamp'?.42:['repair','assemble','upgrade'].includes(kind)?.88:kind==='day'?.72:.82;
    return this.run(kind,duration,()=>this.attached(parent)&&this.attached(node),p=>{
      g.clear();
      if(kind==='stamp'){this.drawStamp(g,width,height,p);}
      else if(kind==='day'){this.drawDay(g,node,width,height,p);}
      else if(kind==='upgrade'){this.drawUpgrade(g,width,height,p);}
      else if(kind==='repair'||kind==='assemble'){this.drawRepair(g,width,height,p,kind==='assemble');}
      else if(kind==='scale'){this.drawScale(g,width,height,p);}
      else if(kind==='pulse'){this.drawPulse(g,width,height,p);}
      else if(kind==='probe'){this.drawProbe(g,width,height,p);}
      else if(kind==='spectrum'){this.drawSpectrum(g,width,height,p);}
      else if(kind==='uv'){this.drawUV(g,width,height,p);}
      else if(kind==='scan'){this.drawScanner(g,width,height,p);}
      else this.drawMagnify(g,width,height,p);
      this.opacity(node).opacity=Math.round(220*Math.min(1,p*8)*(1-Math.max(0,p-.78)/.22));
    },()=>this.drop(clip));
  }

  private drawMagnify(g:Graphics,w:number,h:number,p:number):void {
    const x=w*(.12+.76*smooth(p)),y=-h*(.47+.07*Math.sin(p*Math.PI));
    g.fillColor=this.color('#D6D2C70D');g.moveTo(x-125,-h*.12);g.lineTo(x+120,-h*.88);g.lineTo(x-30,-h*.88);g.close();g.fill();
    g.fillColor=this.color('#D6D2C710');g.circle(x,y,59);g.fill();g.strokeColor=this.color(C.white);g.lineWidth=3;g.circle(x,y,59);g.stroke();
    g.strokeColor=this.color('#304D5E');g.lineWidth=15;g.moveTo(x+40,y-42);g.lineTo(x+84,y-91);g.stroke();g.strokeColor=this.color(C.orange);g.lineWidth=3;g.moveTo(x+40,y-42);g.lineTo(x+84,y-91);g.stroke();
    g.strokeColor=this.color('#D9EFDEAA');g.lineWidth=1;g.moveTo(x-12,y);g.lineTo(x+12,y);g.moveTo(x,y-12);g.lineTo(x,y+12);g.stroke();
  }
  private drawUV(g:Graphics,w:number,h:number,p:number):void {
    const x=w*(.07+.86*smooth(p));g.fillColor=this.color('#998CA81A');g.rect(Math.max(0,x-65),-h,130,h);g.fill();
    g.strokeColor=this.color(C.purple);g.lineWidth=3;g.moveTo(x,-8);g.lineTo(x,-h+8);g.stroke();
    for(let i=0;i<5;i++){const xx=w*(.23+i*.12),yy=-h*(.35+.06*(i%2));if(xx>x+35)continue;
      g.strokeColor=this.color('#B8ABC5');g.lineWidth=1.5;g.arc(xx,yy,18+i*3,.2,Math.PI*1.6,false);g.stroke();
      for(let j=0;j<4;j++){g.moveTo(xx-20+j*8,yy-h*.18);g.lineTo(xx-20+j*8,yy-h*.18-22-(j%2)*10);g.stroke();}}
  }
  private drawSpectrum(g:Graphics,w:number,h:number,p:number):void {
    const base=-h*.78;g.fillColor=this.color('#101B226B');g.roundRect(w*.12,-h*.88,w*.76,h*.7,8);g.fill();
    g.strokeColor=this.color('#385161');g.lineWidth=1;for(let i=0;i<6;i++){const y=-h*(.24+i*.105);g.moveTo(w*.15,y);g.lineTo(w*.85,y);g.stroke();}
    [C.cyan,C.orange,C.purple].forEach((c,i)=>{
      const peak=w*(.31+i*.19)+Math.sin((1-p)*2.6+i)*w*.08*(1-p);
      g.strokeColor=this.color(c);g.lineWidth=2.5;
      for(let n=0;n<=120;n++){const x=w*.15+n/120*w*.7,y=base+Math.exp(-Math.pow((x-peak)/(w*.036),2))*h*(.32+i*.055);if(n===0)g.moveTo(x,y);else g.lineTo(x,y);}g.stroke();
      g.strokeColor=this.color(c+'66');g.lineWidth=1;const target=w*(.31+i*.19);for(let y=-h*.23;y>base;y-=13){g.moveTo(target,y);g.lineTo(target,y-6);g.stroke();}
    });
    const sx=w*(.15+.7*p);g.strokeColor=this.color('#D6D2C780');g.lineWidth=1;g.moveTo(sx,-h*.2);g.lineTo(sx,base);g.stroke();
  }
  private drawProbe(g:Graphics,w:number,h:number,p:number):void {
    // Physical terminals belong to the transformed object. This effect only
    // displays the sampled current, so it cannot invent a second pair of pins.
    g.fillColor=this.color('#101B22D0');g.roundRect(w*.66,-h*.27,w*.32,h*.21,4);g.fill();
    g.strokeColor=this.color(C.cyan);g.lineWidth=1.8;
    for(let n=0;n<65;n++){const x=w*(.68+n/65*.27),y=-h*.165+Math.sin(n*.32-p*TAU*3)*h*.043;if(n===0)g.moveTo(x,y);else g.lineTo(x,y);}g.stroke();
    g.fillColor=this.color(C.orange);g.circle(w*.685,-h*.24,2);g.fill();
  }
  private drawScale(g:Graphics,w:number,h:number,p:number):void {
    const cx=w*.5,cy=-h*.6,settle=Math.sin(p*TAU*3)*(1-p)*.21,span=w*.28;
    g.fillColor=this.color('#101B22E6');g.roundRect(w*.15,-h*.92,w*.7,h*.27,9);g.fill();g.strokeColor=this.color('#718899');g.lineWidth=7;g.moveTo(cx,-h*.82);g.lineTo(cx,cy+h*.08);g.stroke();
    const left={x:cx-span,y:cy+Math.sin(settle)*span},right={x:cx+span,y:cy-Math.sin(settle)*span};
    g.strokeColor=this.color(C.cyan);g.lineWidth=5;g.moveTo(left.x,left.y);g.lineTo(right.x,right.y);g.stroke();
    [left,right].forEach((q,i)=>{g.strokeColor=this.color('#AAB6BD');g.lineWidth=2;g.moveTo(q.x,q.y);g.lineTo(q.x-38,q.y-h*.18);g.moveTo(q.x,q.y);g.lineTo(q.x+38,q.y-h*.18);g.stroke();g.strokeColor=this.color(i?C.orange:C.cyan);g.lineWidth=4;g.moveTo(q.x-45,q.y-h*.18);g.lineTo(q.x+45,q.y-h*.18);g.stroke();});
    g.fillColor=this.color('#C38A4D');g.roundRect(right.x-18,right.y-h*.18,36,29,3);g.fill();
    g.strokeColor=this.color(p>.7?C.cyan:C.orange);g.lineWidth=3;g.arc(cx,-h*.79,25,0,Math.PI,false);g.stroke();g.moveTo(cx,-h*.79);g.lineTo(cx+Math.sin(settle*4)*22,-h*.79+22);g.stroke();
  }
  private drawPulse(g:Graphics,w:number,h:number,p:number):void {
    g.fillColor=this.color('#101B226B');g.roundRect(w*.1,-h*.88,w*.8,h*.7,8);g.fill();
    g.strokeColor=this.color('#345363');g.lineWidth=1;for(let x=w*.13;x<w*.88;x+=w*.06){g.moveTo(x,-h*.23);g.lineTo(x,-h*.82);g.stroke();}
    const scan=w*(.14+.72*p);g.fillColor=this.color('#C38A4D10');g.rect(w*.13,-h*.82,Math.max(1,scan-w*.13),h*.57);g.fill();
    g.strokeColor=this.color(C.orange);g.lineWidth=3;for(let n=0;n<=120;n++){const x=w*.14+n/120*w*.72,t=n/120*5-p*2;const sq=(Math.sin(t*TAU)>.3?1:0);const y=-h*(.69-.29*sq);if(n===0)g.moveTo(x,y);else g.lineTo(x,y);}g.stroke();
    g.strokeColor=this.color(C.cyan);g.lineWidth=2;for(let n=0;n<=120;n++){const x=w*.14+n/120*w*.72,y=-h*.73+Math.sin(n*.23-p*TAU*2)*h*.045*(1-p*.5);if(n===0)g.moveTo(x,y);else g.lineTo(x,y);}g.stroke();
    g.strokeColor=this.color('#D6D2C7');g.lineWidth=1;g.moveTo(scan,-h*.21);g.lineTo(scan,-h*.82);g.stroke();
  }
  private drawScanner(g:Graphics,w:number,h:number,p:number):void {
    this.corners(g,w,h,C.cyan);const y=-h*(.08+.84*smooth(p));
    g.fillColor=this.color('#76BABB0C');g.rect(12,y-42,w-24,84);g.fill();g.strokeColor=this.color(C.cyan);g.lineWidth=3;g.moveTo(8,y);g.lineTo(w-8,y);g.stroke();
    for(let i=0;i<8;i++){g.fillColor=this.color(i/8<p?C.cyan:'#36505C');g.rect(w*.25+i*w*.062,-h*.97,w*.045,6);g.fill();}
    // A scan records observations; it must not imply a cleared/legitimate source.
    if(p>.72){for(let i=0;i<3;i++){g.strokeColor=this.color('#76BABB99');g.lineWidth=2;g.moveTo(w*.72,-h*(.25+i*.045));g.lineTo(w*.82,-h*(.25+i*.045));g.stroke();}}
  }
  private drawRepair(g:Graphics,w:number,h:number,p:number,assemble:boolean):void {
    const cx=w*.5,cy=-h*.5,t=smooth(clamp(p/.68));
    if(assemble){for(let i=0;i<4;i++){
      const a=i*Math.PI/2+.4,x=cx+Math.cos(a)*w*.3*(1-t),y=cy+Math.sin(a)*h*.3*(1-t);
      g.fillColor=this.color(i%2?'#7F96A7':'#365462');g.roundRect(x-22,y-15,44,30,4);g.fill();g.strokeColor=this.color(C.muted);g.lineWidth=2;g.roundRect(x-22,y-15,44,30,4);g.stroke();
    }}
    const x=w*(.28+.44*t),y=-h*(.5+.06*Math.sin(t*Math.PI*2));
    g.strokeColor=this.color('#566F7E');g.lineWidth=9;g.moveTo(w*.17,-h*.9);g.lineTo(x,y);g.stroke();g.strokeColor=this.color(C.orange);g.lineWidth=3;g.moveTo(w*.17,-h*.9);g.lineTo(x,y);g.stroke();
    g.fillColor=this.color('#F4D99C');g.circle(x,y,5+Math.sin(p*TAU*7)*2);g.fill();
    for(let i=0;i<5;i++){const a=i*2.4+p*3,r=(5+(i%3)*5)*(1+.25*Math.sin(p*TAU*3+i));g.strokeColor=this.color(i%3===0?'#F6E0ADAA':'#C38A4D99');g.lineWidth=1;g.moveTo(x+Math.cos(a)*r*.35,y+Math.sin(a)*r*.35);g.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);g.stroke();}
    g.strokeColor=this.color(C.white);g.lineWidth=2;g.moveTo(w*.28,-h*.5);g.lineTo(x,y);g.stroke();
    if(p>.72){g.strokeColor=this.color('#D6D2C770');g.lineWidth=1.5;g.arc(x,y,20+8*ease((p-.72)/.28),.15,Math.PI*1.5,false);g.stroke();}
  }
  private drawUpgrade(g:Graphics,w:number,h:number,p:number):void {
    const e=ease(p),cx=w*.5,cy=-h*.5;g.fillColor=this.color('#101B2288');g.roundRect(0,-h,w,h,8);g.fill();
    for(let i=0;i<3;i++){const yy=-h*(.28+i*.22);g.strokeColor=this.color(i===2?C.orange:C.muted);g.lineWidth=3;g.moveTo(w*.2,yy);g.lineTo(w*(.2+.6*clamp((p-i*.12)/.5)),yy);g.stroke();}
    g.strokeColor=this.color('#C38A4D70');g.lineWidth=2;g.arc(cx,cy,Math.max(8,Math.min(26,h*.24)*e),0,TAU*.8,false);g.stroke();
  }
  private drawStamp(g:Graphics,w:number,h:number,p:number):void {
    const cx=w*.5,cy=-h*.48,s=1.06-.06*ease(clamp(p/.25)),r=Math.min(15,w*.12,h*.26)*s;
    g.strokeColor=this.color('#C38A4DBB');g.lineWidth=1.5;g.circle(cx,cy,r);g.stroke();
    g.lineWidth=2;g.moveTo(cx-r*.5,cy);g.lineTo(cx-r*.1,cy-r*.35);g.lineTo(cx+r*.55,cy+r*.4);g.stroke();
  }
  private drawDay(g:Graphics,node:Node,w:number,h:number,p:number):void {
    const alpha=p<.22?p/.22:p>.75?(1-p)/.25:1;this.opacity(node).opacity=Math.round(255*alpha);
    g.fillColor=this.color('#101B22B8');g.roundRect(0,-h,w,h,8);g.fill();g.strokeColor=this.color('#C38A4D88');g.lineWidth=1;g.moveTo(w*.16,-h*.28);g.lineTo(w*.84,-h*.28);g.stroke();
    const scan=w*clamp((p-.1)/.8);g.fillColor=this.color('#C38A4D0D');g.rect(scan-30,-h,60,h);g.fill();
    for(let i=0;i<7;i++){g.fillColor=this.color(i/7<p?C.orange:'#324852');g.rect(w*.25+i*w*.075,-h*.53,w*.05,13);g.fill();}
  }
  private corners(g:Graphics,w:number,h:number,color:string):void {
    g.strokeColor=this.color(color+'99');g.lineWidth=1.5;
    [[0,0,1,1],[w,0,-1,1],[0,-h,1,-1],[w,-h,-1,-1]].forEach(([x,y,sx,sy])=>{g.moveTo(x+sx*23,y);g.lineTo(x,y);g.lineTo(x,y-sy*23);g.stroke();});
  }

  private receipt(amount:number):Promise<void>{
    const n=this.own(this.ui.panel(this.layer,395,638,245,86,{fill:'#202A2EE8',stroke:'#807A6660',radius:3,name:'orbital-transaction-receipt'}));
    this.ui.label(n,'交易回执  /  已结算',13,10,219,21,{size:13,color:C.muted,align:'center'});
    this.ui.label(n,`${amount>=0?'入账':'支出'}  ${amount>0?'+':''}${amount.toFixed(amount%1?2:0)} Cr`,13,38,219,33,{size:23,color:C.white,align:'center'});
    this.track(n,'receipt-print');
    return this.run('receipt-print',1.04,()=>this.attached(n),p=>{
      n.setPosition(395,-638-10*(1-ease(clamp(p/.3))));this.opacity(n).opacity=Math.round(235*Math.min(1,p*6)*(1-Math.max(0,p-.78)/.22));
    },()=>this.drop(n));
  }
  private sleeveFrame(hand:Node,side:'right'|'left'):SpriteFrame|null {
    const find=(node:Node):SpriteFrame|null=>{
      const frame=node.getComponent<Sprite>(Sprite)?.spriteFrame;if(frame)return frame;
      for(const child of node.children){const found=find(child);if(found)return found;}return null;
    };
    const source=find(hand);if(!source)return null;
    const r=source.rect,w=Math.max(1,Math.round(r.width*.34)),h=Math.max(1,Math.round(r.height*.067));
    const x=Math.round(r.width*(side==='right'?.636:.021)),y=Math.round(r.height*.902);
    const frame=new SpriteFrame();
    frame.reset({texture:source.texture,rect:new Rect(r.x+x,r.y+y,Math.min(w,r.width-x),Math.min(h,r.height-y)),originalSize:new Size(w,h),offset:new Vec2(0,0)});
    return frame;
  }
  private sleeve(parent:Node,frame:SpriteFrame,width:number,name:string,tint:string):Node {
    const node=this.ui.container(parent,0,0,width,1,name);
    node.getComponent<UITransform>(UITransform)!.setAnchorPoint(.5,1);
    const sprite=node.addComponent<Sprite>(Sprite);sprite.sizeMode=Sprite.SizeMode.CUSTOM;sprite.spriteFrame=frame;sprite.color=this.color(tint);
    return node;
  }
  private token(x:number,y:number):Node {
    const n=this.ui.container(this.layer,x,y,22,22,'credit-token');const g=n.addComponent<Graphics>(Graphics);
    g.fillColor=this.color('#302C23');g.roundRect(-11,-11,22,22,4);g.fill();g.strokeColor=this.color(C.orange);g.lineWidth=1.5;g.roundRect(-11,-11,22,22,4);g.stroke();
    g.strokeColor=this.color(C.white);g.moveTo(-4,-4);g.lineTo(4,-4);g.moveTo(-4,4);g.lineTo(4,4);g.stroke();return n;
  }
  private run(kind:string,duration:number,alive:()=>boolean,frame:(p:number)=>void,complete:()=>void):Promise<void>{
    if(this.disposed){complete();return Promise.resolve();}
    let resolvePromise:()=>void=()=>{};const promise=new Promise<void>(resolve=>{resolvePromise=resolve;});
    const t:Task={kind,duration:Math.max(.01,duration),elapsed:0,ended:false,alive,frame,complete,resolve:resolvePromise};this.tasks.push(t);
    if(this.reducedMotion)this.end(t,true);
    else if(alive()){try{frame(0);}catch(error){console.warn('[OrbitalMotion] Presentation could not start.',error);this.end(t,false);}}
    else this.end(t,false);
    return promise;
  }
  private end(task:Task,toEnd:boolean):void {
    if(task.ended)return;task.ended=true;
    try{if(toEnd&&task.alive())task.frame(1);}
    catch(error){console.warn('[OrbitalMotion] Presentation fast-forward stopped.',error);}
    finally{
      try{task.complete();}
      catch(error){console.warn('[OrbitalMotion] Presentation cleanup stopped.',error);}
      finally{
        const i=this.tasks.indexOf(task);if(i>=0)this.tasks.splice(i,1);task.resolve();
        if(!this.tasks.length&&this.aperture.isValid)this.aperture.active=false;
      }
    }
  }
  private bounds(input:OrbitalRect|undefined,fallback:Bounds):Bounds {
    const finite=(n:number|undefined,v:number):number=>typeof n==='number'&&Number.isFinite(n)?n:v;
    const x=finite(input?.x,fallback.x),y=finite(input?.y,fallback.y),w=finite(input?.width,fallback.width),h=finite(input?.height,fallback.height);
    return {x:x+Math.min(0,w),y:y+Math.min(0,h),width:Math.abs(w),height:Math.abs(h)};
  }
  private intersect(a:Bounds,b:Bounds):Bounds {
    const x=Math.max(a.x,b.x),y=Math.max(a.y,b.y);
    return {x,y,width:Math.max(0,Math.min(a.x+a.width,b.x+b.width)-x),height:Math.max(0,Math.min(a.y+a.height,b.y+b.height)-y)};
  }
  private attached(node:Node):boolean {
    if(!node.isValid||!this.root.isValid)return false;
    let current:Node|null=node;while(current){if(current===this.root)return true;current=current.parent;}
    return false;
  }
  private own(node:Node):Node {this.owned.add(node);return node;}
  private top():void {
    if(!this.aperture.isValid)return;this.aperture.active=true;
    const siblings=this.root.children,chrome=siblings.find(n=>n.name==='persistent-chrome');
    const index=chrome?siblings.indexOf(chrome)-(siblings.indexOf(this.aperture)<siblings.indexOf(chrome)?1:0):siblings.length-1;
    this.aperture.setSiblingIndex(Math.max(0,index));
  }
  private track(node:Node,kind:string):void {this.untrack(node);this.tracked.push({node,kind});}
  private untrack(node:Node):void {for(let i=this.tracked.length-1;i>=0;i--)if(this.tracked[i].node===node)this.tracked.splice(i,1);}
  private opacity(node:Node):UIOpacity {return node.getComponent<UIOpacity>(UIOpacity)??node.addComponent<UIOpacity>(UIOpacity);}
  private color(v:string):Color {return new Color().fromHEX(v);}
  private drop(node:Node):void {
    const forget=(n:Node):void=>{this.untrack(n);this.owned.delete(n);this.moving.delete(n);for(const child of n.children)forget(child);};
    forget(node);if(!node.isValid)return;this.stop(node);node.removeFromParent();node.destroy();
  }
  private stop(node:Node):void {Tween.stopAllByTarget(node);const o=node.getComponent<UIOpacity>(UIOpacity);if(o)Tween.stopAllByTarget(o);for(const c of node.children)this.stop(c);}
  private restoreActor():void {
    if(this.actor?.isValid&&!this.moving.has(this.actor)){this.actor.setPosition(this.actorBase);this.actor.angle=this.actorAngle;}
  }
  private clearAmbient():void {
    this.restoreActor();if(this.ambient?.isValid)this.drop(this.ambient);
    this.ambient=null;this.ambientParent=null;this.ambientKey='';this.actor=null;this.particles=[];
  }
  private updateAmbient():void {
    if(this.ambientParent&&!this.attached(this.ambientParent)){this.clearAmbient();return;}
    if(this.actor&&this.attached(this.actor)&&!this.moving.has(this.actor)){this.actor.setPosition(this.actorBase.x,this.actorBase.y+(this.reducedMotion?0:Math.sin(this.clock*1.7)*.65),this.actorBase.z);this.actor.angle=this.actorAngle+(this.reducedMotion?0:Math.sin(this.clock)*.12);}
    for(const p of this.particles){if(!p.node.isValid)continue;p.node.active=!this.reducedMotion;if(!this.reducedMotion){p.node.setPosition(p.x+Math.sin(this.clock*p.speed+p.phase)*5,-p.y+Math.cos(this.clock*p.speed*.7+p.phase)*6);this.opacity(p.node).opacity=Math.round(65+Math.sin(this.clock*.4+p.phase)*20);}}
  }
}
