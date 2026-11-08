import {Color,Graphics,Mask,Node,Tween,UIOpacity,UITransform,Vec3} from 'cc';
import type {OrbitalUI} from './OrbitalUI';
import {createDayShutter} from './DayShutter';

export interface OrbitalPoint {x:number;y:number}
export interface OrbitalRect extends OrbitalPoint {width?:number;height?:number}
export interface OrbitalMotionRegions {contentArea?:OrbitalRect;inspectionArea?:OrbitalRect}
interface Bounds extends OrbitalPoint {width:number;height:number}
interface Task {kind:string;elapsed:number;duration:number;ended:boolean;alive:()=>boolean;frame:(p:number)=>void;complete:()=>void;resolve:()=>void}
interface Tracked {node:Node;kind:string}
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
  private actorScale=new Vec3(1,1,1);
  private actorAngle=0;
  private ambientInk:Graphics|null=null;
  private ambientArea:Bounds={x:310,y:160,width:860,height:500};
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
    if(this.actor){this.actorBase=this.actor.position.clone();this.actorScale=this.actor.scale.clone();this.actorAngle=this.actor.angle;}
    if(!enabled||area.width<=0||area.height<=0)return;
    this.ambient=this.ui.container(binding.parent,area.x,area.y,area.width,area.height,'orbital-atmosphere');
    this.ambient.addComponent<Mask>(Mask).type=Mask.Type.GRAPHICS_RECT;
    // Traffic stays behind the visitor and painted worktop, inside the existing
    // window. The shop lights belong to their illustrated fixtures, not the UI.
    this.ambient.setSiblingIndex(0);this.ambientArea=area;
    this.ambientInk=this.ambient.addComponent<Graphics>(Graphics);
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
    return this.run('npc-enter',.48,()=>this.attached(actor),p=>{
      const walk=clamp(p/.77),e=1-Math.pow(1-walk,2.6),settle=clamp((p-.77)/.23);
      const step=Math.sin(walk*Math.PI*4)*.85*(1-walk);
      actor.setPosition(dest.x-118*(1-e),dest.y-5*(1-e)+step-Math.sin(settle*Math.PI)*.75,dest.z);
      actor.setScale(scale.x*(.972+.028*e),scale.y*(.972+.028*e),scale.z);
      actor.angle=angle+Math.sin(walk*Math.PI*4)*.22*(1-walk);
      this.opacity(actor).opacity=Math.round(255*(.68+.32*clamp(p/.22)));
      const record=this.tracked.find(r=>r.node===actor);if(record)record.kind=p<.77?'npc-approach':'npc-stand-settle';
    },()=>{
      if(actor.isValid){actor.setPosition(dest);actor.setScale(scale);actor.angle=angle;this.opacity(actor).opacity=255;if(this.actor===actor){this.actorBase=dest.clone();this.actorScale=scale.clone();this.actorAngle=angle;}}
      this.moving.delete(actor);this.untrack(actor);
    });
  }
  /** Short body-language beat after the new facial pose has been rendered. */
  react(actor:Node,outcome:'agree'|'counter'|'refuse'):Promise<void>{
    if(this.disposed||!this.attached(actor))return Promise.resolve();
    const origin=actor.position.clone(),scale=actor.scale.clone(),angle=actor.angle;
    this.moving.add(actor);this.track(actor,`npc-react-${outcome}`);
    return this.run(`npc-react-${outcome}`,outcome==='counter'?.44:.38,()=>this.attached(actor),p=>{
      const beat=Math.sin(p*Math.PI),recover=1-p;
      const x=outcome==='agree'?1.5*beat:outcome==='counter'?-4.5*beat:-7*beat;
      const y=outcome==='agree'?-2.6*Math.sin(p*Math.PI*1.25)*recover:-.65*beat;
      actor.setPosition(origin.x+x,origin.y+y,origin.z);
      actor.setScale(scale.x*(1+(outcome==='agree'?.002:-.002)*beat),scale.y*(1-.0025*beat),scale.z);
      actor.angle=angle+(outcome==='agree'?.1:outcome==='counter'?-.16:-.2)*beat;
    },()=>{
      if(actor.isValid){actor.setPosition(origin);actor.setScale(scale);actor.angle=angle;}
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
    return this.run('npc-exit',.42,()=>this.attached(actor),p=>{
      const turn=clamp(p/.16),walk=clamp((p-.14)/.86),e=smooth(walk);
      actor.setPosition(445-region.x-150*e,-138+region.y-4*e+Math.sin(walk*Math.PI*4)*.7*(1-walk));
      actor.setScale(1-.025*e,1-.025*e,1);actor.angle=-.2*Math.sin(turn*Math.PI)*(1-walk);
      this.opacity(actor).opacity=Math.round(255*(1-clamp((p-.58)/.42)));
    },()=>this.drop(aperture));
  }

  handoff(itemId:string,from:OrbitalPoint,to:OrbitalPoint,onPlaced?:()=>void,targetSize=316):Promise<void>{
    if(this.disposed){onPlaced?.();return Promise.resolve();}
    this.top();const size=targetSize,arriving=from.y<500&&to.y>from.y,departing=to.y<500&&to.y<from.y;
    const start={x:from.x,y:arriving?to.y-18:from.y},end={x:to.x,y:departing?from.y-18:to.y};
    const startScale=arriving?.91:1,endScale=departing?.91:1,direction=end.x>=start.x?1:-1;
    const safe=this.intersect(this.contentArea,{x:310,y:108,width:930,height:700});
    const window=this.own(this.ui.container(this.layer,safe.x,safe.y,safe.width,safe.height,'counter-transfer-window'));
    window.addComponent<Mask>(Mask).type=Mask.Type.GRAPHICS_RECT;
    const stage=this.ui.container(window,-safe.x,-safe.y,1600,900,'counter-transfer-screen-space');
    const shadow=this.ui.container(stage,start.x,start.y+size*.475,180,20,'object-contact-shadow');const sg=shadow.addComponent<Graphics>(Graphics);
    sg.fillColor=this.color('#06101988');sg.ellipse(0,0,size*.525,12);sg.fill();
    const object=this.ui.item(stage,itemId,start.x-size/2,start.y-size/2,size,size);
    const contact=this.ui.container(stage,end.x,end.y+size*.475,130,12,'counter-contact-trace').addComponent<Graphics>(Graphics);
    this.track(object,'handoff-prepare');this.track(shadow,'contact-shadow');this.track(contact.node,'counter-contact');
    let placed=false;
    return this.run('handoff',.72,()=>this.attached(object),p=>{
      const sliding=clamp((p-.14)/.52),braking=clamp((p-.66)/.14),settling=clamp((p-.8)/.2),travel=smooth(sliding);
      const overshoot=direction*8;
      const x=p<.14?start.x-direction*5*smooth(p/.14):p<.66?start.x-direction*5+(end.x+overshoot-start.x+direction*5)*travel:p<.8?end.x+overshoot*(1-smooth(braking)):end.x+Math.sin(settling*Math.PI*4)*1.2*(1-settling);
      const perspective=startScale+(endScale-startScale)*travel,foot=start.y+size*startScale*.475+(end.y+size*endScale*.475-start.y-size*startScale*.475)*travel;
      const pressure=p>=.66&&p<.8?Math.sin(braking*Math.PI):0,settle=Math.sin(settling*Math.PI*3)*(1-settling);
      // Rigid metal keeps its silhouette; contact is carried by position and shadow.
      const sx=perspective,sy=perspective;
      const y=foot-size*sy*.475+(p>=.8?settle*.65:0);
      object.setScale(sx,sy,1);object.setPosition(x-size*sx/2,-y+size*sy/2);
      object.angle=p<.66?-direction*Math.sin(sliding*Math.PI)*1.1:p<.8?direction*(1-braking)*.4:direction*settle*.15;
      shadow.setPosition(x,-foot);shadow.setScale(perspective*(1+pressure*.08),perspective*(1-pressure*.15),1);
      this.opacity(shadow).opacity=Math.round(188+pressure*42);
      contact.clear();
      if(p>=.66&&p<.94){
        const alpha=Math.round(75*(1-clamp((p-.66)/.28)));contact.strokeColor=new Color(174,151,105,alpha);contact.lineWidth=1;
        for(let i=0;i<3;i++){contact.moveTo(-18-i*17,-2+i*2);contact.lineTo(-8-i*17,-2+i*2);contact.stroke();}
      }
      const record=this.tracked.find(r=>r.node===object);if(record)record.kind=p<.14?'handoff-prepare':p<.66?'handoff-slide':p<.8?'handoff-brake':'handoff-contact-settle';
    },()=>{try{if(!placed){placed=true;onPlaced?.();}}finally{this.drop(window);}});
  }

  async deal(amount:number,itemId?:string,origin?:{x:number;y:number;size:number}):Promise<void>{
    if(this.disposed)return;
    // Credits stay on the counter terminal. The HUD already contains the committed balance.
    this.top();const wallet={x:1065,y:656},counter={x:origin?.x??900,y:origin?.y??556};const from=amount>=0?counter:wallet,to=amount>=0?wallet:counter;
    const tokens:Node[]=[];
    for(let i=0;i<3;i++){const n=this.own(this.token(from.x,from.y));tokens.push(n);this.track(n,'credit-token');}
    const value=this.own(this.ui.label(this.layer,`${amount>0?'+':''}${amount.toFixed(amount%1?2:0)} Cr`,925,687,230,34,{size:24,color:C.white,align:'center',bold:true}));this.track(value,'cash-value');
    const cash=this.run('credit-transfer',.94,()=>this.attached(value),p=>{
      tokens.forEach((n,i)=>{const t=clamp((p-i*.045)/.76),e=smooth(t);n.setPosition(from.x+(to.x-from.x)*e+Math.sin(t*Math.PI)*(i-1)*10,-from.y-(to.y-from.y)*e+Math.sin(t*Math.PI)*22);n.angle=t*30;this.opacity(n).opacity=Math.round(220*(1-Math.max(0,t-.8)/.2));});
      value.setPosition(925,-687+ease(p)*10);this.opacity(value).opacity=Math.round(255*Math.min(1,p*6)*(1-Math.max(0,p-.72)/.28));
    },()=>{tokens.forEach(n=>this.drop(n));this.drop(value);});
    const jobs=[cash,this.receipt(amount),this.coins(amount,from)];
    if(itemId)jobs.push(this.handoff(itemId,counter,amount>=0?{x:675,y:450}:{x:1120,y:635},undefined,origin?.size??316));
    await Promise.all(jobs);
  }

  /**
   * Local presentation beat. `rect` is the clip region; `focus` (inspection tools) is the
   * object's on-screen box, so instruments are drawn whole around the item instead of
   * being clipped to the item's own bounds. `label` prints on stamps.
   */
  effect(kind:string,parent:Node,rect?:OrbitalRect,focus?:OrbitalRect,label?:string):Promise<void>{
    if(this.disposed||!this.attached(parent))return Promise.resolve();
    const compact=kind==='stamp'||kind==='upgrade';
    const defaults:Bounds=kind==='stamp'?{x:700,y:556,width:180,height:120}:compact?{x:600,y:334,width:360,height:116}:this.inspectionArea;
    let area=this.intersect(this.bounds(rect,defaults),this.contentArea);
    if(parent.name==='page-inspect')area=this.intersect(area,this.inspectionArea);
    if(area.width<8||area.height<8)return Promise.resolve();
    const width=area.width,height=area.height;
    const clip=this.own(this.ui.container(parent,area.x,area.y,width,height,`effect-${kind}-clip`));
    clip.addComponent<Mask>(Mask).type=Mask.Type.GRAPHICS_RECT;
    const node=this.ui.container(clip,0,0,width,height,`effect-${kind}`);const g=node.addComponent<Graphics>(Graphics);
    this.track(node,kind);
    const f=focus?this.bounds(focus,area):{x:area.x+width*.3,y:area.y+height*.2,width:width*.4,height:height*.6};
    // Focus in clip-local coordinates (y down).
    const fx=f.x-area.x,fy=f.y-area.y,fw=Math.max(40,f.width),fh=Math.max(40,f.height);
    let text:Node|null=null;
    if(kind==='stamp'&&label){
      text=this.ui.label(node,label,0,0,width,height,{size:Math.min(26,height*.24),bold:true,color:'#C8452A',align:'center',verticalAlign:'center',wrap:false});
    }
    const durations:Record<string,number>={stamp:.55,assemble:.9,repair:.85,upgrade:.8,scan:1.3,uv:1.05,magnify:1.15,spectrum:1.1,probe:1.0,scale:1.15,pulse:1.0,shine:.7};
    return this.run(kind,durations[kind]??.6,()=>this.attached(parent)&&this.attached(node),p=>{
      g.clear();
      const fade=Math.min(1,p*10)*(1-Math.max(0,p-.86)/.14);
      if(kind==='stamp'){this.drawStamp(g,node,text,width,height,p);return;}
      if(kind==='upgrade')this.drawUpgrade(g,width,height,p);
      else if(kind==='repair'||kind==='assemble'){this.drawRepair(g,width,height,p,kind==='assemble');}
      else if(kind==='shine')this.drawShine(g,fx,fy,fw,fh,p);
      else if(kind==='scale')this.drawScale(g,fx,fy,fw,fh,width,height,p);
      else if(kind==='pulse')this.drawPulse(g,fx,fy,fw,fh,width,height,p);
      else if(kind==='probe')this.drawProbe(g,fx,fy,fw,fh,width,height,p);
      else if(kind==='spectrum')this.drawSpectrum(g,fx,fy,fw,fh,width,height,p);
      else if(kind==='uv')this.drawUV(g,fx,fy,fw,fh,p);
      else if(kind==='scan')this.drawScanner(g,width,height,p);
      else this.drawMagnify(g,fx,fy,fw,fh,width,height,p);
      this.opacity(node).opacity=Math.round(255*fade);
    },()=>this.drop(clip));
  }

  /** Between days the shutter closes first; the title starts with it already closed. */
  dayTransition(day:number,caption:string,opening=false):Promise<void>{
    if(this.disposed||!this.root.isValid)return Promise.resolve();
    const {layer,top,bottom,plate,dayLabel}=createDayShutter(this.ui,this.root,day,caption,{shopSign:opening});
    this.own(layer);
    layer.setSiblingIndex(this.root.children.length-1);
    this.track(plate,'day-shutter');
    return this.run(opening?'day-shutter-opening':'day-shutter',opening?.94:1.7,()=>this.attached(layer),p=>{
      const close=opening?1:ease(clamp(p/.26)),open=smooth(clamp(opening?(p-.12)/.88:(p-.74)/.26));
      const shut=close*(1-open);
      top.setPosition(0,450*(1-shut));bottom.setPosition(0,-450-450*(1-shut));
      const show=opening?1-clamp((p-.08)/.3):clamp((p-.2)/.1)*(1-clamp((p-.72)/.08));
      this.opacity(plate).opacity=Math.round(255*show);
      if(!opening){
        plate.setScale(.92+.08*ease(clamp((p-.2)/.18)),.92+.08*ease(clamp((p-.2)/.18)),1);
        if(dayLabel.isValid)dayLabel.setPosition(0,-22-6*(1-ease(clamp((p-.24)/.2))));
      }
    },()=>this.drop(layer));
  }

  /** Coins fly from a point to the HUD cash meter (or back), with a floating amount. */
  coins(amount:number,from:OrbitalPoint,to:OrbitalPoint={x:1080,y:58}):Promise<void>{
    if(this.disposed||amount===0)return Promise.resolve();
    const layer=this.own(this.ui.container(this.root,0,0,1600,900,'coin-flight'));layer.setSiblingIndex(this.root.children.length-1);
    const a=amount>0?from:to,b=amount>0?to:from,count=Math.min(9,3+Math.floor(Math.abs(amount)/40));
    const tokens:Node[]=[];
    for(let i=0;i<count;i++){const n=this.coin(layer,a.x,a.y);tokens.push(n);}
    const tag=this.ui.label(layer,`${amount>0?'+':'−'}${Math.abs(amount)} Cr`,b.x-110,b.y+30,220,36,{size:26,bold:true,color:amount>0?'#FFD08A':'#FF9A7A',align:'center',verticalAlign:'center',wrap:false});
    this.track(tag,'coin-tag');
    return this.run('coin-flight',1.05,()=>this.attached(layer),p=>{
      tokens.forEach((n,i)=>{
        const t=clamp((p-i*.05)/.62),e=t*t*(3-2*t),arc=Math.sin(t*Math.PI)*(140+i*9);
        const spread=(i-(count-1)/2)*14*(1-t);
        n.setPosition(a.x+(b.x-a.x)*e+spread,-(a.y+(b.y-a.y)*e)+arc);
        n.setScale(1-.35*e,1-.35*e,1);n.angle=t*540;
        this.opacity(n).opacity=t<=0?0:t>=1?0:255;
      });
      const q=clamp((p-.55)/.45);
      tag.setPosition(b.x-110,-(b.y+34)-24*ease(q));this.opacity(tag).opacity=Math.round(255*clamp(q*5)*(1-clamp((q-.7)/.3)));
    },()=>this.drop(layer));
  }

  /** A short floating caption (e.g. "−1 AP") that rises and fades. */
  float(text:string,at:OrbitalPoint,color='#8BEDE6'):Promise<void>{
    if(this.disposed||!this.root.isValid)return Promise.resolve();
    const layer=this.own(this.ui.container(this.root,0,0,1600,900,'float-tag'));layer.setSiblingIndex(this.root.children.length-1);
    const n=this.ui.label(layer,text,at.x-90,at.y,180,30,{size:20,bold:true,color,align:'center',verticalAlign:'center',wrap:false,outline:'#05080B',outlineWidth:2});
    return this.run('float-tag',.9,()=>this.attached(n),p=>{n.setPosition(at.x-90,-at.y-28*ease(p));this.opacity(n).opacity=Math.round(255*clamp(p*6)*(1-clamp((p-.6)/.4)));},()=>this.drop(layer));
  }

  private drawMagnify(g:Graphics,fx:number,fy:number,fw:number,fh:number,w:number,h:number,p:number):void {
    // A loupe sweeps three stops across the item; each stop fires a glint ring.
    const stops=[[.28,.34],[.68,.47],[.5,.73]],seg=p*3,i=Math.min(2,Math.floor(seg)),t=smooth(clamp(seg-i));
    const from=i===0?[-.25,-.1]:stops[i-1],to=stops[i];
    const px=fx+fw*(from[0]+(to[0]-from[0])*smooth(clamp(t*1.6))),py=fy+fh*(from[1]+(to[1]-from[1])*smooth(clamp(t*1.6)));
    const r=Math.min(70,Math.max(44,fw*.17));
    const x=Math.max(r+6,Math.min(w-r-6,px)),y=-Math.max(r+6,Math.min(h-r-6,py));
    // side-light cone from the upper left
    g.fillColor=new Color(255,236,196,26);g.moveTo(0,0);g.lineTo(x-r*.7,y+r*.7);g.lineTo(x+r*.7,y-r*.7);g.lineTo(w*.25,0);g.close();g.fill();
    g.fillColor=new Color(255,240,210,22);g.circle(x,y,r*1.25);g.fill();
    // handle
    g.strokeColor=this.color('#120B06');g.lineWidth=18;g.moveTo(x+r*.68,y-r*.68);g.lineTo(x+r*1.55,y-r*1.55);g.stroke();
    g.strokeColor=this.color('#9A5B2C');g.lineWidth=12;g.moveTo(x+r*.72,y-r*.72);g.lineTo(x+r*1.52,y-r*1.52);g.stroke();
    g.strokeColor=this.color('#E8B47A');g.lineWidth=3;g.moveTo(x+r*.8,y-r*.72);g.lineTo(x+r*1.5,y-r*1.42);g.stroke();
    // glass and rim
    g.fillColor=new Color(190,236,232,40);g.circle(x,y,r);g.fill();
    g.strokeColor=this.color('#120B06');g.lineWidth=10;g.circle(x,y,r);g.stroke();
    g.strokeColor=this.color('#C9CFC8');g.lineWidth=6;g.circle(x,y,r);g.stroke();
    g.strokeColor=this.color('#FFFFFF');g.lineWidth=3;g.arc(x,y,r*.78,Math.PI*.55,Math.PI*.95,false);g.stroke();
    // reticle
    g.strokeColor=new Color(224,161,108,200);g.lineWidth=1.5;g.moveTo(x-r*.3,y);g.lineTo(x+r*.3,y);g.moveTo(x,y-r*.3);g.lineTo(x,y+r*.3);g.stroke();
    // glint at the stop
    const glint=clamp((seg-i-.62)/.38);
    if(glint>0){
      const rr=10+glint*r*.9;g.strokeColor=new Color(240,165,94,Math.round(255*(1-glint)));g.lineWidth=3;g.circle(x,y,rr);g.stroke();
      for(let k=0;k<4;k++){const ang=k*Math.PI/2+.4,d0=r*.25,d1=r*.25+glint*r*.6;g.moveTo(x+Math.cos(ang)*d0,y+Math.sin(ang)*d0);g.lineTo(x+Math.cos(ang)*d1,y+Math.sin(ang)*d1);}g.stroke();
    }
    // stops already found
    for(let k=0;k<3;k++){if(k>i||(k===i&&glint<=0))continue;const sx=fx+fw*stops[k][0],sy=-(fy+fh*stops[k][1]);g.fillColor=this.color('#F0A55E');g.circle(sx,sy,5);g.fill();g.strokeColor=this.color('#FFE2B8');g.lineWidth=1.5;g.circle(sx,sy,9);g.stroke();}
  }
  private drawUV(g:Graphics,fx:number,fy:number,fw:number,fh:number,p:number):void {
    const x=fx-30+(fw+60)*smooth(p),top=-(fy-10),bot=-(fy+fh+10);
    // fluorescence revealed behind the beam (deterministic speckle)
    for(let k=0;k<70;k++){
      const rx=fx+fw*((k*0.618)%1),ry=fy+fh*((k*0.381+0.13)%1);if(rx>x)continue;
      const age=clamp((x-rx)/120);g.fillColor=new Color(196,160,255,Math.round(200*(1-age*.6)));g.circle(rx,-ry,1.6+((k*7)%3));g.fill();
    }
    // serial strip glows once revealed
    const sx=fx+fw*.22,sw=fw*.56,sy=-(fy+fh*.62);
    const reveal=clamp((x-sx)/sw);
    if(reveal>0){g.strokeColor=new Color(226,200,255,Math.round(230*reveal));g.lineWidth=2;g.roundRect(sx,sy-14,sw*reveal,28,4);g.stroke();
      for(let k=0;k<Math.floor(10*reveal);k++){g.fillColor=new Color(240,226,255,220);g.rect(sx+10+k*(sw-20)/10,sy-8,(sw-20)/14,16);}g.fill();}
    // beam: layered glow
    for(const [wd,al] of [[90,18],[50,34],[22,70],[6,200]] as [number,number][]){g.fillColor=new Color(171,128,255,al);g.rect(x-wd/2,bot,wd,top-bot);g.fill();}
    g.strokeColor=this.color('#F2E6FF');g.lineWidth=1.5;g.moveTo(x,top);g.lineTo(x,bot);g.stroke();
    // lamp head at the top of the beam
    g.fillColor=this.color('#1A1424');g.roundRect(x-34,top+6,68,22,6);g.fill();g.fillColor=this.color('#B79BFF');g.roundRect(x-26,top+6,52,6,2);g.fill();
  }
  private drawSpectrum(g:Graphics,fx:number,fy:number,fw:number,fh:number,w:number,h:number,p:number):void {
    // Prism beam from the item to a CRT read-out where three peaks lock to their targets.
    const pw=Math.min(340,w*.4),ph=150,px=w-pw-14,py=-(h-ph-14);
    const ox=fx+fw/2,oy=-(fy+fh/2),beam=clamp(p/.35);
    [[C.cyan,-14],[C.orange,0],[C.purple,14]].forEach(([c,d])=>{g.strokeColor=new Color().fromHEX((c as string)+'AA');g.lineWidth=3;g.moveTo(ox,oy);g.lineTo(ox+(px+20-ox)*beam,oy+(py-ph/2+(d as number)-oy)*beam);g.stroke();});
    g.fillColor=this.color('#020708F0');g.roundRect(px-6,py+6,pw+12,-(ph+12),12);g.fill();
    g.fillColor=this.color('#0A2226');g.roundRect(px,py,pw,-ph,9);g.fill();
    g.fillColor=new Color(160,255,248,14);for(let y=4;y<ph;y+=4){g.rect(px+4,py-y,pw-8,1.2);}g.fill();
    const base=py-ph+22,lock=clamp((p-.45)/.4);
    [C.cyan,C.orange,C.purple].forEach((c,i)=>{
      const target=px+pw*(.22+i*.28),peak=target+(1-ease(lock))*pw*(.18-.12*i)*(i%2?-1:1);
      g.strokeColor=new Color().fromHEX(c+'55');g.lineWidth=1;for(let y=py-10;y>base;y-=10){g.moveTo(target,y);g.lineTo(target,y-5);}g.stroke();
      g.strokeColor=this.color(c);g.lineWidth=2.6;
      for(let n=0;n<=80;n++){const xx=px+10+n/80*(pw-20),yy=base+Math.exp(-Math.pow((xx-peak)/(pw*.035),2))*(ph-50)*(.75+i*.08);if(n===0)g.moveTo(xx,yy);else g.lineTo(xx,yy);}g.stroke();
    });
    if(lock>=1){const k=clamp((p-.85)/.15);g.strokeColor=new Color(134,230,223,Math.round(255*k));g.lineWidth=4;g.moveTo(px+pw-46,py-24);g.lineTo(px+pw-34,py-36);g.lineTo(px+pw-14,py-12);g.stroke();}
  }
  private drawProbe(g:Graphics,fx:number,fy:number,fw:number,fh:number,w:number,h:number,p:number):void {
    // Current arcs between the two terminals, then an oscilloscope trace prints.
    const a={x:fx+fw*.25,y:-(fy+fh*.62)},b={x:fx+fw*.8,y:-(fy+fh*.62)};
    const live=clamp(p/.6);
    for(let k=0;k<2;k++){
      g.strokeColor=k?new Color(134,230,223,220):new Color(240,165,94,160);g.lineWidth=k?2:5;
      const steps=12;g.moveTo(a.x,a.y);
      for(let n=1;n<steps;n++){const t=n/steps;if(t>live)break;const jitter=Math.sin(n*12.7+p*60)*14*(1-Math.abs(t-.5)*1.6);g.lineTo(a.x+(b.x-a.x)*t,a.y+(b.y-a.y)*t+jitter-Math.sin(t*Math.PI)*22);}
      if(live>=1)g.lineTo(b.x,b.y);g.stroke();
    }
    for(const q of [a,b]){g.fillColor=new Color(255,236,200,Math.round(180+70*Math.sin(p*40)));g.circle(q.x,q.y,5+3*Math.abs(Math.sin(p*30)));g.fill();}
    const pw=Math.min(300,w*.36),ph=120,px=w-pw-14,py=-(h-ph-14);
    g.fillColor=this.color('#020708F0');g.roundRect(px-6,py+6,pw+12,-(ph+12),12);g.fill();g.fillColor=this.color('#0A2226');g.roundRect(px,py,pw,-ph,9);g.fill();
    g.strokeColor=new Color(134,230,223,40);g.lineWidth=1;for(let x=px+20;x<px+pw;x+=30){g.moveTo(x,py-8);g.lineTo(x,py-ph+8);}g.stroke();
    const trace=clamp((p-.2)/.7);g.strokeColor=this.color('#8BEDE6');g.lineWidth=2.4;
    for(let n=0;n<=100*trace;n++){const xx=px+10+n/100*(pw-20),yy=py-ph/2+Math.sin(n*.35)*30*Math.exp(-n/120)+(n%23===0?-24:0);if(n===0)g.moveTo(xx,yy);else g.lineTo(xx,yy);}g.stroke();
  }
  private drawScale(g:Graphics,fx:number,fy:number,fw:number,fh:number,w:number,h:number,p:number):void {
    // A balance rises under the item, swings, and settles; the dial needle follows.
    const cx=fx+fw/2,baseY=-(Math.min(h-20,fy+fh+6)),rise=ease(clamp(p/.25));
    const swing=Math.sin(p*TAU*2.4)*(1-p)*.22,span=Math.min(220,fw*.7);
    const yb=baseY+30*rise;
    g.fillColor=this.color('#1C2529');g.roundRect(cx-span-20,yb-6,(span+20)*2,16,6);g.fill();
    g.strokeColor=this.color('#8AA0A4');g.lineWidth=3;g.roundRect(cx-span-20,yb-6,(span+20)*2,16,6);g.stroke();
    const l={x:cx-span,y:yb+18+Math.sin(swing)*span},r={x:cx+span,y:yb+18-Math.sin(swing)*span};
    g.strokeColor=this.color('#6FE0DA');g.lineWidth=5;g.moveTo(l.x,l.y);g.lineTo(r.x,r.y);g.stroke();
    g.fillColor=this.color('#E0A16C');g.circle(cx,yb+18,7);g.fill();
    for(const q of [l,r]){g.strokeColor=this.color('#C8CFC9');g.lineWidth=2;g.moveTo(q.x,q.y);g.lineTo(q.x-26,q.y+22);g.moveTo(q.x,q.y);g.lineTo(q.x+26,q.y+22);g.stroke();g.strokeColor=this.color('#E0A16C');g.lineWidth=4;g.moveTo(q.x-32,q.y+22);g.lineTo(q.x+32,q.y+22);g.stroke();}
    // weights drop onto the right pan
    for(let k=0;k<3;k++){const t=ease(clamp((p-.2-k*.08)/.2));if(t<=0)continue;const wy=r.y+22+8+k*14+(1-t)*120;g.fillColor=this.color(['#C9A15A','#B28648','#E0B86E'][k]);g.roundRect(r.x-14+k*2,wy,28-k*4,12,3);g.fill();}
    // dial
    const dx=fx+fw+40>w-60?fx-60:fx+fw+40,dy=-(fy+40);g.fillColor=this.color('#0A2226');g.circle(dx,dy,34);g.fill();g.strokeColor=this.color('#C8CFC9');g.lineWidth=3;g.circle(dx,dy,34);g.stroke();
    g.strokeColor=this.color(p>.8?'#8BEDE6':'#F0A55E');g.lineWidth=3;g.moveTo(dx,dy);g.lineTo(dx+Math.sin(swing*4)*26,dy+Math.cos(swing*4)*26);g.stroke();
  }
  private drawPulse(g:Graphics,fx:number,fy:number,fw:number,fh:number,w:number,h:number,p:number):void {
    // Clamp jaws close on the item, then pulse rings radiate and the load trace prints.
    const close=ease(clamp(p/.3)),cy=-(fy+fh/2),gap=fw/2+40-30*close,cx=fx+fw/2;
    for(const side of [-1,1]){const x=cx+side*gap;g.fillColor=this.color('#2A1A0E');g.roundRect(x-(side<0?44:0),cy+26,44,-52,6);g.fill();g.strokeColor=this.color('#E0A16C');g.lineWidth=4;g.roundRect(x-(side<0?44:0),cy+26,44,-52,6);g.stroke();
      g.strokeColor=this.color('#E0A16C');g.lineWidth=6;g.moveTo(x,cy+18);g.lineTo(x,cy-18);g.stroke();}
    if(close>=1){for(let k=0;k<3;k++){const t=clamp((p-.3-k*.12)/.45);if(t<=0||t>=1)continue;g.strokeColor=new Color(240,165,94,Math.round(220*(1-t)));g.lineWidth=3;g.circle(cx,cy,30+t*Math.max(fw,fh)*.7);g.stroke();}}
    const pw=Math.min(300,w*.36),ph=110,px=w-pw-14,py=-(h-ph-14);
    g.fillColor=this.color('#020708F0');g.roundRect(px-6,py+6,pw+12,-(ph+12),12);g.fill();g.fillColor=this.color('#0A2226');g.roundRect(px,py,pw,-ph,9);g.fill();
    g.fillColor=new Color(240,165,94,38);g.rect(px+pw*.65,py-ph+8,pw*.2,ph-16);g.fill();
    const trace=clamp((p-.3)/.6);g.strokeColor=this.color('#F0A55E');g.lineWidth=2.6;
    for(let n=0;n<=100*trace;n++){const xx=px+10+n/100*(pw-20),sq=Math.sin(n*.42)>.2?1:0,yy=py-ph+24+sq*48;if(n===0)g.moveTo(xx,yy);else g.lineTo(xx,yy);}g.stroke();
  }
  private drawScanner(g:Graphics,w:number,h:number,p:number):void {
    // Gate scanner: a bright plane sweeps down, a lattice resolves, then a confirmation bar fills.
    const y=-h*(.04+.9*smooth(clamp(p/.75)));
    g.fillColor=new Color(111,224,218,22);for(let gy=-8;gy>y;gy-=18){g.rect(10,gy,w-20,1);}for(let gx=10;gx<w-10;gx+=18){g.rect(gx,y,1,-y-8);}g.fill();
    for(const [hh,al] of [[60,16],[28,36],[10,90]] as [number,number][]){g.fillColor=new Color(111,224,218,al);g.rect(6,y-hh/2,w-12,hh);g.fill();}
    g.strokeColor=this.color('#E4FFFC');g.lineWidth=2;g.moveTo(4,y);g.lineTo(w-4,y);g.stroke();
    this.corners(g,w,h,'#6FE0DA');
    const done=clamp((p-.75)/.25);
    if(done>0){g.fillColor=this.color('#0A2226');g.roundRect(w*.15,-h+30,w*.7,14,7);g.fill();g.fillColor=this.color('#6FE0DA');g.roundRect(w*.15,-h+30,w*.7*done,14,7);g.fill();}
  }
  private drawShine(g:Graphics,fx:number,fy:number,fw:number,fh:number,p:number):void {
    const x=fx-60+(fw+120)*smooth(p);
    for(const [wd,al] of [[70,26],[30,60],[10,140]] as [number,number][]){g.fillColor=new Color(255,250,230,al);g.moveTo(x-wd/2,-fy);g.lineTo(x+wd/2,-fy);g.lineTo(x+wd/2-60,-(fy+fh));g.lineTo(x-wd/2-60,-(fy+fh));g.close();g.fill();}
    for(let k=0;k<5;k++){const t=clamp((p-k*.12)/.5);if(t<=0||t>=1)continue;const sx=fx+fw*((k*.37+.15)%1),sy=-(fy+fh*((k*.53+.2)%1)),r=4+10*Math.sin(t*Math.PI);
      g.fillColor=new Color(255,236,190,Math.round(255*Math.sin(t*Math.PI)));g.moveTo(sx,sy+r);g.lineTo(sx+r*.25,sy+r*.25);g.lineTo(sx+r,sy);g.lineTo(sx+r*.25,sy-r*.25);g.lineTo(sx,sy-r);g.lineTo(sx-r*.25,sy-r*.25);g.lineTo(sx-r,sy);g.lineTo(sx-r*.25,sy+r*.25);g.close();g.fill();}
  }
  private drawRepair(g:Graphics,w:number,h:number,p:number,assemble:boolean):void {
    const approach=ease(clamp(p/.2)),work=clamp((p-.2)/.5),withdraw=ease(clamp((p-.73)/.27));
    const x=w*(.4+.17*work)+(1-approach)*w*.28+withdraw*w*.15,y=-h*(.47+.025*Math.sin(work*Math.PI))-(1-approach)*h*.22-withdraw*h*.2;
    if(p<.92){
      g.strokeColor=this.color('#071018A8');g.lineWidth=15;g.moveTo(x+9,y-5);g.lineTo(x+66,y-66);g.stroke();
      g.strokeColor=this.color('#49616A');g.lineWidth=12;g.moveTo(x+15,y-13);g.lineTo(x+62,y-62);g.stroke();
      g.strokeColor=this.color('#C9CFC8');g.lineWidth=4;g.moveTo(x,y);g.lineTo(x+21,y-22);g.stroke();
      g.strokeColor=this.color('#E0A16C');g.lineWidth=3;g.moveTo(x+28,y-25);g.lineTo(x+50,y-48);g.stroke();
      g.fillColor=this.color('#FFF2D6');g.circle(x+22,y-22,4);g.fill();
    }
    if(p>=.2&&p<.73){
      const hot=Math.max(0,Math.sin(work*Math.PI*6));
      g.fillColor=new Color(255,226,160,Math.round(120+120*hot));g.circle(x,y,6+hot*6);g.fill();
      g.fillColor=new Color(255,250,230,Math.round(200*hot));g.circle(x,y,3);g.fill();
      for(let i=0;i<14;i++){
        const age=(work*2.6+i*.071)%1,a=-.3+i*.42,distance=8+age*58;
        const sx=x+Math.cos(a)*distance,sy=y+Math.sin(a)*distance-age*age*40;
        g.strokeColor=new Color(255,190+i%3*20,110,Math.round((1-age)*220));g.lineWidth=i%3===0?2.2:1.4;
        g.moveTo(sx,sy);g.lineTo(sx-Math.cos(a)*7,sy-Math.sin(a)*7+3);g.stroke();
      }
      if(assemble){g.strokeColor=this.color('#6FE0DA');g.lineWidth=3;g.moveTo(w*.3,-h*.5);g.lineTo(x,y);g.stroke();}
    }
    if(p>.6){const cool=clamp((p-.6)/.4);for(let i=0;i<4;i++){g.fillColor=new Color(190,200,198,Math.round((1-cool)*40));g.circle(w*.56+i*6,-h*.48+cool*40+i*5,6+cool*12);g.fill();}}
  }
  private drawUpgrade(g:Graphics,w:number,h:number,p:number):void {
    const e=ease(p),cx=w*.5,cy=-h*.5;g.fillColor=this.color('#101B22C0');g.roundRect(0,-h,w,h,10);g.fill();
    g.strokeColor=this.color('#E0A16C');g.lineWidth=2;g.roundRect(2,-h+2,w-4,h-4,9);g.stroke();
    for(let i=0;i<3;i++){const yy=-h*(.28+i*.22);g.strokeColor=this.color(i===2?'#F0A55E':'#8BEDE6');g.lineWidth=4;g.moveTo(w*.2,yy);g.lineTo(w*(.2+.6*clamp((p-i*.12)/.5)),yy);g.stroke();}
    g.strokeColor=new Color(240,165,94,200);g.lineWidth=3;g.arc(cx,cy,Math.max(8,Math.min(30,h*.26)*e),0,TAU*e,false);g.stroke();
  }
  private drawStamp(g:Graphics,node:Node,text:Node|null,w:number,h:number,p:number):void {
    // Rubber stamp: hovers in large, slams down, ink ring bursts, then fades.
    const cx=w/2,cy=-h/2,r=Math.min(w,h)*.42;
    const drop=clamp(p/.22),hit=p>=.22,scale=hit?1+Math.max(0,.08*(1-clamp((p-.22)/.12))):1.7-.7*ease(drop);
    node.setScale(scale,scale,1);node.angle=-10;
    const ink=hit?255:Math.round(160*drop);
    g.strokeColor=new Color(200,69,42,ink);g.lineWidth=5;g.circle(cx,cy,r);g.stroke();
    g.lineWidth=2;g.circle(cx,cy,r-9);g.stroke();
    if(!text){g.lineWidth=6;g.moveTo(cx-r*.42,cy);g.lineTo(cx-r*.08,cy-r*.32);g.lineTo(cx+r*.48,cy+r*.34);g.stroke();}
    if(hit){const burst=clamp((p-.22)/.3);g.strokeColor=new Color(200,69,42,Math.round(160*(1-burst)));g.lineWidth=3;g.circle(cx,cy,r+burst*r*.6);g.stroke();
      for(let k=0;k<8;k++){const a=k*Math.PI/4+.2,d=r+6+burst*20;g.fillColor=new Color(200,69,42,Math.round(200*(1-burst)));g.circle(cx+Math.cos(a)*d,cy+Math.sin(a)*d,2.5);g.fill();}}
    this.opacity(node).opacity=Math.round(255*(1-clamp((p-.82)/.18)));
    if(text?.isValid)this.opacity(text).opacity=ink;
  }
  private corners(g:Graphics,w:number,h:number,color:string):void {
    g.strokeColor=this.color(color);g.lineWidth=3;
    [[0,0,1,1],[w,0,-1,1],[0,-h,1,-1],[w,-h,-1,-1]].forEach(([x,y,sx,sy])=>{g.moveTo(x+sx*26,y-sy*3);g.lineTo(x+sx*3,y-sy*3);g.lineTo(x+sx*3,y-sy*26);g.stroke();});
  }
  private coin(parent:Node,x:number,y:number):Node {
    const n=this.ui.container(parent,x,y,1,1,'credit-coin');const g=n.addComponent<Graphics>(Graphics);
    g.fillColor=this.color('#2A1606');g.circle(0,-1,13);g.fill();g.fillColor=this.color('#E8B064');g.circle(0,0,12);g.fill();
    g.fillColor=this.color('#FFE2A8');g.circle(-3,3,6);g.fill();g.strokeColor=this.color('#9A5B2C');g.lineWidth=2;g.circle(0,0,8);g.stroke();
    this.opacity(n).opacity=0;return n;
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
    if(this.actor?.isValid&&!this.moving.has(this.actor)){this.actor.setPosition(this.actorBase);this.actor.setScale(this.actorScale);this.actor.angle=this.actorAngle;}
  }
  private clearAmbient():void {
    this.restoreActor();if(this.ambient?.isValid)this.drop(this.ambient);
    this.ambient=null;this.ambientParent=null;this.ambientKey='';this.actor=null;this.ambientInk=null;
  }
  private updateAmbient():void {
    if(this.ambientParent&&!this.attached(this.ambientParent)){this.clearAmbient();return;}
    if(this.actor&&this.attached(this.actor)&&!this.moving.has(this.actor)){
      const breath=this.reducedMotion?0:Math.sin(this.clock*1.55);
      this.actor.setPosition(this.actorBase.x+(this.reducedMotion?0:Math.sin(this.clock*.53)*.22),this.actorBase.y+breath*.55,this.actorBase.z);
      this.actor.setScale(this.actorScale.x,this.actorScale.y*(1+breath*.0012),this.actorScale.z);this.actor.angle=this.actorAngle;
    }
    const g=this.ambientInk;if(!g?.node.isValid)return;g.clear();if(this.reducedMotion)return;
    const ox=this.ambientArea.x,oy=this.ambientArea.y;
    // Navigation lamps traverse the painted orbital window, behind the resident.
    for(let i=0;i<2;i++){
      const t=((this.clock*(.035+i*.009)+i*.47)%1),x=466+t*520,y=214+i*78+Math.sin(t*Math.PI)*11;
      const alpha=Math.round(Math.min(1,t*8,(1-t)*8)*115);
      g.strokeColor=new Color(112,177,190,Math.round(alpha*.28));g.lineWidth=1;g.moveTo(x-ox-18,-y+oy);g.lineTo(x-ox-4,-y+oy);g.stroke();
      g.fillColor=new Color(140,207,216,alpha);g.ellipse(x-ox,-y+oy,2.6,1.15);g.fill();
      g.fillColor=new Color(211,139,83,Math.round(alpha*.8));g.circle(x-ox-8,-y+oy+2,.9);g.fill();
    }
    // The narrow glow is registered to the existing purple specimen tube.
    const pulse=.5+.5*Math.sin(this.clock*1.8);
    g.fillColor=new Color(153,119,199,Math.round(6+9*pulse));g.ellipse(1134-ox,-280+oy,9,43);g.fill();
  }
}
