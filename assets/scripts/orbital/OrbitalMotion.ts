import {Color,Graphics,Mask,Node,Tween,UIOpacity,Vec3} from 'cc';
import type {OrbitalUI} from './OrbitalUI';

export interface OrbitalPoint {x:number;y:number}
export interface OrbitalRect extends OrbitalPoint {width?:number;height?:number}
interface Task {kind:string;elapsed:number;duration:number;ended:boolean;alive:()=>boolean;frame:(p:number)=>void;complete:()=>void;resolve:()=>void}
interface Tracked {node:Node;kind:string}
interface Particle {node:Node;x:number;y:number;phase:number;speed:number}
const C={cyan:'#6EE0DE',orange:'#DB8A52',purple:'#9A81CC',white:'#E4EBE7',muted:'#AAB6BD',dark:'#10161F'};
const clamp=(n:number):number=>Math.max(0,Math.min(1,n));
const smooth=(n:number):number=>n*n*(3-2*n);
const ease=(n:number):number=>1-Math.pow(1-n,3);
const TAU=Math.PI*2;

/** Presentation only. No animation callback changes game money, AP, or ownership. */
export class OrbitalMotion {
  reducedMotion=false;
  private readonly layer:Node;
  private readonly tasks:Task[]=[];
  private readonly tracked:Tracked[]=[];
  private readonly moving=new Set<Node>();
  private ambient:Node|null=null;
  private ambientParent:Node|null=null;
  private actor:Node|null=null;
  private actorBase=new Vec3();
  private actorAngle=0;
  private particles:Particle[]=[];
  private lights:Node[]=[];
  private clock=0;
  private disposed=false;

  constructor(private readonly ui:OrbitalUI,private readonly root:Node){
    this.layer=ui.container(root,0,0,1600,900,'orbital-motion-overlay');
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
      task.frame(p);if(p>=1)this.end(task,false);
    }
    this.updateAmbient();
  }
  finish():void {for(const task of [...this.tasks])this.end(task,true);}
  dispose():void {
    if(this.disposed)return;this.finish();this.clearAmbient();
    for(const child of [...this.layer.children])this.drop(child);
    this.drop(this.layer);this.tracked.length=0;this.moving.clear();this.disposed=true;
  }
  snapshot():{phase:string;activeCount:number;busy:boolean;nodes:{id:string;kind:string;x:number;y:number;opacity:number}[];ambientClock:number}{
    const origin=this.root.worldPosition;
    const nodes=this.tracked.filter(t=>t.node.isValid).map(t=>{
      const p=t.node.worldPosition;return {id:t.node.uuid,kind:t.kind,x:p.x-origin.x,y:origin.y-p.y,opacity:t.node.getComponent<UIOpacity>(UIOpacity)?.opacity??255};
    });
    if(this.actor?.isValid){const p=this.actor.worldPosition;nodes.push({id:this.actor.uuid,kind:'npc-breath',x:p.x-origin.x,y:origin.y-p.y,opacity:255});}
    return {phase:this.tasks[this.tasks.length-1]?.kind??'idle',activeCount:this.tasks.length,busy:!!this.tasks.length,nodes,ambientClock:this.clock};
  }

  bindAmbient(binding:{parent:Node;actor?:Node|null;area?:OrbitalRect}):void {
    this.actor=binding.actor?.isValid?binding.actor:null;
    if(this.actor){this.actorBase=this.actor.position.clone();this.actorAngle=this.actor.angle;}
    if(this.ambientParent===binding.parent&&this.ambient?.isValid&&this.ambient.parent===binding.parent)return;
    this.clearAmbient();if(!binding.parent.isValid)return;
    this.ambientParent=binding.parent;
    this.ambient=this.ui.container(binding.parent,0,0,1600,900,'orbital-atmosphere');
    const area={x:binding.area?.x??230,y:binding.area?.y??140,width:binding.area?.width??960,height:binding.area?.height??560};
    for(let i=0;i<16;i++){
      const x=area.x+((i*197+17)%997)/997*area.width;
      const y=area.y+((i*131+59)%991)/991*area.height;
      const n=this.ui.container(this.ambient,x,y,4,4,'station-dust');const g=n.addComponent<Graphics>(Graphics);
      g.fillColor=this.color(i%4===0?'#DB8A5288':'#B3D1D05A');g.circle(0,0,i%4===0?1.8:1.1);g.fill();
      this.particles.push({node:n,x,y,phase:i*1.53,speed:.23+(i%4)*.05});
    }
    for(let i=0;i<3;i++){
      const n=this.ui.container(this.ambient,area.x+70+i*area.width*.37,area.y+12,80,3,'station-status-light');
      const g=n.addComponent<Graphics>(Graphics);g.fillColor=this.color(i===1?'#DB8A524D':'#6EE0DE3D');g.roundRect(0,-3,80,3,1.5);g.fill();this.lights.push(n);
    }
  }

  sceneEntry():Promise<void>{
    this.top();
    const hatch=this.ui.panel(this.layer,0,0,1600,900,{fill:'#101822',stroke:'#365866',radius:0,name:'station-opening-hatch'});
    const g=hatch.addComponent<Graphics>(Graphics);
    for(let y=25;y<900;y+=72){g.strokeColor=this.color('#263D4C');g.lineWidth=2;g.moveTo(0,-y);g.lineTo(1600,-y);g.stroke();}
    g.strokeColor=this.color(C.orange);g.lineWidth=5;g.moveTo(785,0);g.lineTo(785,-900);g.stroke();
    g.strokeColor=this.color(C.cyan);g.lineWidth=2;g.moveTo(805,0);g.lineTo(805,-900);g.stroke();
    this.ui.label(hatch,'轨道旧货局',410,335,780,86,{size:62,color:C.cyan,align:'center',bold:true});
    this.ui.label(hatch,'回环九号 · 下层旧港',410,439,780,44,{size:25,color:C.muted,align:'center'});
    this.ui.label(hatch,'舱门气压平衡完成',410,507,780,32,{size:18,color:C.orange,align:'center'});
    this.track(hatch,'station-hatch');
    return this.run('scene-entry',1.05,()=>hatch.isValid,p=>{
      const e=ease(clamp((p-.12)/.88));hatch.setPosition(0,980*e);this.opacity(hatch).opacity=Math.round(255*(1-Math.max(0,p-.8)/.2));
    },()=>this.drop(hatch));
  }
  enter(actor:Node):Promise<void>{
    if(!actor.isValid)return Promise.resolve();
    const dest=actor.position.clone(),scale=actor.scale.clone(),angle=actor.angle;
    this.moving.add(actor);this.track(actor,'npc-walk-in');
    return this.run('npc-enter',.82,()=>actor.isValid,p=>{
      const e=ease(p);actor.setPosition(dest.x-260*(1-e),dest.y-25*(1-e)+Math.sin(p*Math.PI*8)*4*(1-p),dest.z);
      actor.setScale(scale.x*(.96+.04*e),scale.y*(.96+.04*e),scale.z);actor.angle=angle+Math.sin(p*Math.PI*8)*1.4*(1-p);
      this.opacity(actor).opacity=Math.round(255*Math.min(1,p*3.3));
    },()=>{
      if(actor.isValid){actor.setPosition(dest);actor.setScale(scale);actor.angle=angle;this.opacity(actor).opacity=255;if(this.actor===actor){this.actorBase=dest.clone();this.actorAngle=angle;}}
      this.moving.delete(actor);this.untrack(actor);
    });
  }
  exit(npcId:string):Promise<void>{
    this.top();const actor=this.ui.portrait(this.layer,npcId,500,180,360,540);this.track(actor,'npc-walk-out');
    return this.run('npc-exit',.82,()=>actor.isValid,p=>{
      const e=smooth(p);actor.setPosition(500-850*e,-180-25*e+Math.sin(p*Math.PI*8)*4);actor.angle=Math.sin(p*Math.PI*8)*1.2;
      this.opacity(actor).opacity=Math.round(255*(1-Math.max(0,p-.58)/.42));
    },()=>this.drop(actor));
  }

  handoff(itemId:string,from:OrbitalPoint,to:OrbitalPoint,onPlaced?:()=>void):Promise<void>{
    this.top();const size=170,side=to.x>=from.x?'right':'left',handWidth=216,handHeight=198;
    const shadow=this.ui.container(this.layer,from.x,from.y+61,180,20,'object-contact-shadow');const sg=shadow.addComponent<Graphics>(Graphics);
    sg.fillColor=this.color('#06101999');sg.ellipse(0,0,65,10);sg.fill();
    const handWindow=this.ui.container(this.layer,0,0,1600,800,'handoff-safe-window');handWindow.addComponent<Mask>(Mask).type=Mask.Type.GRAPHICS_RECT;
    const hand=this.ui.container(handWindow,0,0,handWidth,handHeight,'orbital-handoff-glove');
    const open=this.ui.hand(hand,side==='right'?'right_open':'left_open',0,0,handWidth,handHeight);
    const grip=this.ui.hand(hand,side==='right'?'right_grip':'left_grip',0,0,handWidth,handHeight);
    const object=this.ui.item(this.layer,itemId,from.x-size/2,from.y-size/2,size,size);
    this.track(object,'handoff-object');this.track(hand,`hand-${side}-open`);this.track(shadow,'contact-shadow');
    const rest={x:side==='right'?Math.max(from.x,to.x)+100:Math.min(from.x,to.x)-100,y:880};
    return this.run('handoff',1.02,()=>object.isValid,p=>{
      const t=clamp((p-.14)/.65),e=smooth(t);const x=from.x+(to.x-from.x)*e,y=from.y+(to.y-from.y)*e-Math.sin(t*Math.PI)*72;
      object.setPosition(x-size/2,-y+size/2);object.angle=Math.sin(t*Math.PI)*6;object.setScale(1+.06*Math.sin(t*Math.PI),1+.06*Math.sin(t*Math.PI),1);
      shadow.setPosition(x,-from.y-(to.y-from.y)*e-61);shadow.setScale(1-.32*Math.sin(t*Math.PI),1,1);
      const contact={x:x+(side==='right'?size*.15:-size*.15),y:y+size*.17};const reach=smooth(clamp(p/.16)),retreat=smooth(clamp((p-.82)/.18));
      let px=rest.x+(contact.x-rest.x)*reach,py=rest.y+(contact.y-rest.y)*reach;px+=(rest.x-px)*retreat;py+=(rest.y-py)*retreat;
      hand.setPosition(px-handWidth*(side==='right'?.36:.64),-py+handHeight*.42);
      const gripping=p>=.13&&p<.82;open.active=!gripping;grip.active=gripping;
      const record=this.tracked.find(r=>r.node===hand);if(record)record.kind=`hand-${side}-${gripping?'grip':'open'}`;
      this.opacity(hand).opacity=Math.round(255*Math.min(1,p*9)*(1-Math.max(0,p-.91)/.09));
    },()=>{onPlaced?.();this.drop(object);this.drop(shadow);this.drop(hand);this.drop(handWindow);});
  }

  async deal(amount:number,itemId?:string):Promise<void>{
    this.top();const wallet={x:775,y:65},counter={x:880,y:570};const from=amount>=0?counter:wallet,to=amount>=0?wallet:counter;
    const tokens:Node[]=[];
    for(let i=0;i<6;i++){const n=this.token(from.x,from.y);tokens.push(n);this.track(n,'credit-token');}
    const value=this.ui.label(this.layer,`${amount>0?'+':''}${amount.toFixed(amount%1?2:0)} Cr`,650,455,420,65,{size:40,color:amount>=0?C.cyan:C.orange,align:'center',bold:true});this.track(value,'cash-value');
    const cash=this.run('credit-transfer',1.08,()=>value.isValid,p=>{
      tokens.forEach((n,i)=>{const t=clamp((p-i*.035)/.72),e=smooth(t);n.setPosition(from.x+(to.x-from.x)*e+Math.sin(t*Math.PI)*(i-2.5)*19,-from.y-(to.y-from.y)*e+Math.sin(t*Math.PI)*58);n.angle=t*180;this.opacity(n).opacity=Math.round(255*(1-Math.max(0,t-.9)/.1));});
      value.setPosition(650,-455+ease(p)*90);this.opacity(value).opacity=Math.round(255*Math.min(1,p*6)*(1-Math.max(0,p-.72)/.28));
    },()=>{tokens.forEach(n=>this.drop(n));this.drop(value);});
    const jobs=[cash,this.receipt(amount)];
    if(itemId)jobs.push(this.handoff(itemId,counter,amount>=0?{x:610,y:460}:{x:1110,y:390}));
    await Promise.all(jobs);
  }

  effect(kind:string,parent:Node,rect:OrbitalRect={x:440,y:195,width:620,height:390}):Promise<void>{
    const width=rect.width??620,height=rect.height??390;
    const node=this.ui.container(parent,rect.x,rect.y,width,height,`effect-${kind}`);const g=node.addComponent<Graphics>(Graphics);
    this.track(node,kind);
    const labelText:Record<string,string>={magnify:'侧光与焦距',uv:'紫外显影',spectrum:'光谱峰对齐',probe:'双触点回路',scale:'微重力称量',pulse:'脉冲负载验证',repair:'接合 · 复测',scan:'来源与容器扫描',stamp:'证据已记录',day:'营业日交接',upgrade:'设备升级完成',assemble:'组件兼容性验证'};
    const accent=kind==='uv'?C.purple:['repair','pulse','day','upgrade'].includes(kind)?C.orange:C.cyan;
    const label=this.ui.label(node,labelText[kind]??'操作完成',0,height+4,width,30,{size:18,color:accent,align:'center'});
    const duration=['repair','assemble','upgrade'].includes(kind)?1.2:kind==='day'?1.15:1.03;
    return this.run(kind,duration,()=>parent.isValid&&node.isValid,p=>{
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
      this.opacity(label).opacity=Math.round(180+Math.sin(p*TAU)*60);
    },()=>this.drop(node));
  }

  private drawMagnify(g:Graphics,w:number,h:number,p:number):void {
    const x=w*(.12+.76*smooth(p)),y=-h*(.47+.07*Math.sin(p*Math.PI));
    g.fillColor=this.color('#6EE0DE12');g.moveTo(x-125,-h*.12);g.lineTo(x+120,-h*.88);g.lineTo(x-30,-h*.88);g.close();g.fill();
    g.fillColor=this.color('#BDE5DD15');g.circle(x,y,59);g.fill();g.strokeColor=this.color(C.cyan);g.lineWidth=4;g.circle(x,y,59);g.stroke();
    g.strokeColor=this.color('#304D5E');g.lineWidth=15;g.moveTo(x+40,y-42);g.lineTo(x+84,y-91);g.stroke();g.strokeColor=this.color(C.orange);g.lineWidth=3;g.moveTo(x+40,y-42);g.lineTo(x+84,y-91);g.stroke();
    g.strokeColor=this.color('#D9EFDEAA');g.lineWidth=1;g.moveTo(x-12,y);g.lineTo(x+12,y);g.moveTo(x,y-12);g.lineTo(x,y+12);g.stroke();this.corners(g,w,h,C.cyan);
  }
  private drawUV(g:Graphics,w:number,h:number,p:number):void {
    const x=w*(.07+.86*smooth(p));g.fillColor=this.color('#9A81CC22');g.rect(Math.max(0,x-65),-h,130,h);g.fill();
    g.strokeColor=this.color(C.purple);g.lineWidth=3;g.moveTo(x,-8);g.lineTo(x,-h+8);g.stroke();
    for(let i=0;i<5;i++){const xx=w*(.23+i*.12),yy=-h*(.35+.06*(i%2));if(xx>x+35)continue;
      g.strokeColor=this.color('#CFB4F4');g.lineWidth=1.5;g.arc(xx,yy,18+i*3,.2,Math.PI*1.6,false);g.stroke();
      for(let j=0;j<4;j++){g.moveTo(xx-20+j*8,yy-h*.18);g.lineTo(xx-20+j*8,yy-h*.18-22-(j%2)*10);g.stroke();}}
    this.corners(g,w,h,C.purple);
  }
  private drawSpectrum(g:Graphics,w:number,h:number,p:number):void {
    const base=-h*.78;g.fillColor=this.color('#10161FD9');g.roundRect(w*.12,-h*.88,w*.76,h*.7,8);g.fill();
    g.strokeColor=this.color('#385161');g.lineWidth=1;for(let i=0;i<6;i++){const y=-h*(.24+i*.105);g.moveTo(w*.15,y);g.lineTo(w*.85,y);g.stroke();}
    [C.cyan,C.orange,C.purple].forEach((c,i)=>{
      const peak=w*(.31+i*.19)+Math.sin((1-p)*2.6+i)*w*.08*(1-p);
      g.strokeColor=this.color(c);g.lineWidth=2.5;
      for(let n=0;n<=120;n++){const x=w*.15+n/120*w*.7,y=base+Math.exp(-Math.pow((x-peak)/(w*.036),2))*h*(.32+i*.055);if(n===0)g.moveTo(x,y);else g.lineTo(x,y);}g.stroke();
      g.strokeColor=this.color(c+'66');g.lineWidth=1;const target=w*(.31+i*.19);for(let y=-h*.23;y>base;y-=13){g.moveTo(target,y);g.lineTo(target,y-6);g.stroke();}
    });
    const sx=w*(.15+.7*p);g.strokeColor=this.color('#E4EBE788');g.lineWidth=1;g.moveTo(sx,-h*.2);g.lineTo(sx,base);g.stroke();
  }
  private drawProbe(g:Graphics,w:number,h:number,p:number):void {
    const length=clamp(p*3.2);[0,1].forEach(i=>{
      const a={x:w*(i===0?.12:.88),y:-h*.91},b={x:w*(i===0?.39:.65),y:-h*.46};
      const c={x:(a.x+b.x)/2,y:-h*.98};const curve=(t:number):OrbitalPoint=>({x:(1-t)*(1-t)*a.x+2*(1-t)*t*c.x+t*t*b.x,y:(1-t)*(1-t)*a.y+2*(1-t)*t*c.y+t*t*b.y});
      g.strokeColor=this.color(i?C.orange:C.cyan);g.lineWidth=4;g.moveTo(a.x,a.y);for(let n=1;n<=30;n++){const q=curve(n/30*length);g.lineTo(q.x,q.y);}g.stroke();
      const tip=curve(length);g.fillColor=this.color('#D1DEE0');g.circle(tip.x,tip.y,6);g.fill();
      for(let j=0;j<3;j++){const t=(p*2.4+j*.3)%1;if(t>length)continue;const q=curve(t);g.fillColor=this.color('#EBF4DD');g.circle(q.x,q.y,3.5);g.fill();}
      g.strokeColor=this.color('#E4EBE7');g.lineWidth=2;g.circle(b.x,b.y,12);g.stroke();
    });
    if(p>.32){g.fillColor=this.color('#10161FD9');g.roundRect(w*.71,-h*.28,w*.27,h*.21,4);g.fill();g.strokeColor=this.color(C.cyan);g.lineWidth=2;
      for(let n=0;n<65;n++){const x=w*(.73+n/65*.23),y=-h*.18+Math.sin(n*.32-p*TAU*3)*h*.045;if(n===0)g.moveTo(x,y);else g.lineTo(x,y);}g.stroke();}
  }
  private drawScale(g:Graphics,w:number,h:number,p:number):void {
    const cx=w*.5,cy=-h*.6,settle=Math.sin(p*TAU*3)*(1-p)*.21,span=w*.28;
    g.fillColor=this.color('#10161FE6');g.roundRect(w*.15,-h*.92,w*.7,h*.27,9);g.fill();g.strokeColor=this.color('#718899');g.lineWidth=7;g.moveTo(cx,-h*.82);g.lineTo(cx,cy+h*.08);g.stroke();
    const left={x:cx-span,y:cy+Math.sin(settle)*span},right={x:cx+span,y:cy-Math.sin(settle)*span};
    g.strokeColor=this.color(C.cyan);g.lineWidth=5;g.moveTo(left.x,left.y);g.lineTo(right.x,right.y);g.stroke();
    [left,right].forEach((q,i)=>{g.strokeColor=this.color('#AAB6BD');g.lineWidth=2;g.moveTo(q.x,q.y);g.lineTo(q.x-38,q.y-h*.18);g.moveTo(q.x,q.y);g.lineTo(q.x+38,q.y-h*.18);g.stroke();g.strokeColor=this.color(i?C.orange:C.cyan);g.lineWidth=4;g.moveTo(q.x-45,q.y-h*.18);g.lineTo(q.x+45,q.y-h*.18);g.stroke();});
    g.fillColor=this.color('#DB8A52');g.roundRect(right.x-18,right.y-h*.18,36,29,3);g.fill();
    g.strokeColor=this.color(p>.7?C.cyan:C.orange);g.lineWidth=3;g.arc(cx,-h*.79,25,0,Math.PI,false);g.stroke();g.moveTo(cx,-h*.79);g.lineTo(cx+Math.sin(settle*4)*22,-h*.79+22);g.stroke();
  }
  private drawPulse(g:Graphics,w:number,h:number,p:number):void {
    g.fillColor=this.color('#10161FDF');g.roundRect(w*.1,-h*.88,w*.8,h*.7,8);g.fill();
    g.strokeColor=this.color('#345363');g.lineWidth=1;for(let x=w*.13;x<w*.88;x+=w*.06){g.moveTo(x,-h*.23);g.lineTo(x,-h*.82);g.stroke();}
    const scan=w*(.14+.72*p);g.fillColor=this.color('#DB8A5214');g.rect(w*.13,-h*.82,Math.max(1,scan-w*.13),h*.57);g.fill();
    g.strokeColor=this.color(C.orange);g.lineWidth=3;for(let n=0;n<=120;n++){const x=w*.14+n/120*w*.72,t=n/120*5-p*2;const sq=(Math.sin(t*TAU)>.3?1:0);const y=-h*(.69-.29*sq);if(n===0)g.moveTo(x,y);else g.lineTo(x,y);}g.stroke();
    g.strokeColor=this.color(C.cyan);g.lineWidth=2;for(let n=0;n<=120;n++){const x=w*.14+n/120*w*.72,y=-h*.73+Math.sin(n*.23-p*TAU*2)*h*.045*(1-p*.5);if(n===0)g.moveTo(x,y);else g.lineTo(x,y);}g.stroke();
    g.strokeColor=this.color('#E4EBE7');g.lineWidth=1;g.moveTo(scan,-h*.21);g.lineTo(scan,-h*.82);g.stroke();
  }
  private drawScanner(g:Graphics,w:number,h:number,p:number):void {
    this.corners(g,w,h,C.cyan);const y=-h*(.08+.84*smooth(p));
    g.fillColor=this.color('#6EE0DE13');g.rect(12,y-42,w-24,84);g.fill();g.strokeColor=this.color(C.cyan);g.lineWidth=3;g.moveTo(8,y);g.lineTo(w-8,y);g.stroke();
    for(let i=0;i<8;i++){g.fillColor=this.color(i/8<p?C.cyan:'#36505C');g.rect(w*.25+i*w*.062,-h*.97,w*.045,6);g.fill();}
    if(p>.72){g.strokeColor=this.color(C.cyan);g.lineWidth=5;g.moveTo(w*.43,-h*.43);g.lineTo(w*.49,-h*.51);g.lineTo(w*.6,-h*.32);g.stroke();}
  }
  private drawRepair(g:Graphics,w:number,h:number,p:number,assemble:boolean):void {
    const cx=w*.5,cy=-h*.5,t=smooth(clamp(p/.68));
    if(assemble){for(let i=0;i<4;i++){
      const a=i*Math.PI/2+.4,x=cx+Math.cos(a)*w*.3*(1-t),y=cy+Math.sin(a)*h*.3*(1-t);
      g.fillColor=this.color(i%2?'#7F96A7':'#365462');g.roundRect(x-22,y-15,44,30,4);g.fill();g.strokeColor=this.color(C.cyan);g.lineWidth=2;g.roundRect(x-22,y-15,44,30,4);g.stroke();
    }}
    const x=w*(.28+.44*t),y=-h*(.5+.06*Math.sin(t*Math.PI*2));
    g.strokeColor=this.color('#566F7E');g.lineWidth=9;g.moveTo(w*.17,-h*.9);g.lineTo(x,y);g.stroke();g.strokeColor=this.color(C.orange);g.lineWidth=3;g.moveTo(w*.17,-h*.9);g.lineTo(x,y);g.stroke();
    g.fillColor=this.color('#F4D99C');g.circle(x,y,5+Math.sin(p*TAU*7)*2);g.fill();
    for(let i=0;i<13;i++){const a=i*2.4+p*6,r=(8+(i%5)*8)*(1+.5*Math.sin(p*TAU*5+i));g.strokeColor=this.color(i%3===0?'#F6E0AD':C.orange);g.lineWidth=i%3===0?2:1;g.moveTo(x+Math.cos(a)*r*.35,y+Math.sin(a)*r*.35);g.lineTo(x+Math.cos(a)*r,y+Math.sin(a)*r);g.stroke();}
    g.strokeColor=this.color(C.cyan);g.lineWidth=3;g.moveTo(w*.28,-h*.5);g.lineTo(x,y);g.stroke();
    if(p>.72){g.strokeColor=this.color('#6EE0DEAA');g.lineWidth=2;g.circle(cx,cy,35+80*ease((p-.72)/.28));g.stroke();}
  }
  private drawUpgrade(g:Graphics,w:number,h:number,p:number):void {
    const e=ease(p),cx=w*.5,cy=-h*.5;g.fillColor=this.color('#10161FCF');g.roundRect(0,-h,w,h,10);g.fill();
    for(let i=0;i<3;i++){const yy=-h*(.28+i*.22);g.strokeColor=this.color(i===2?C.orange:C.cyan);g.lineWidth=3;g.moveTo(w*.2,yy);g.lineTo(w*(.2+.6*clamp((p-i*.12)/.5)),yy);g.stroke();}
    g.strokeColor=this.color('#DB8A5280');g.lineWidth=4;g.circle(cx,cy,Math.max(10,h*.35*e));g.stroke();g.strokeColor=this.color(C.cyan);g.lineWidth=5;g.moveTo(cx-30,cy+15);g.lineTo(cx,cy+45);g.lineTo(cx+45,cy-15);g.stroke();
  }
  private drawStamp(g:Graphics,w:number,h:number,p:number):void {
    const cx=w*.5,cy=-h*.48,s=1.4-.4*ease(clamp(p/.23)),ww=Math.min(265,w*.65)*s,hh=92*s;
    g.strokeColor=this.color(C.cyan);g.lineWidth=3;g.roundRect(cx-ww/2,cy-hh/2,ww,hh,5);g.stroke();
    g.lineWidth=1;g.roundRect(cx-ww/2+9,cy-hh/2+9,ww-18,hh-18,3);g.stroke();
    g.lineWidth=5;g.moveTo(cx-38,cy+1);g.lineTo(cx-8,cy-24);g.lineTo(cx+42,cy+31);g.stroke();
  }
  private drawDay(g:Graphics,node:Node,w:number,h:number,p:number):void {
    const alpha=p<.22?p/.22:p>.75?(1-p)/.25:1;this.opacity(node).opacity=Math.round(255*alpha);
    g.fillColor=this.color('#10161FF0');g.rect(0,-h,w,h);g.fill();g.strokeColor=this.color(C.orange);g.lineWidth=3;g.moveTo(0,-h*.36);g.lineTo(w,-h*.36);g.moveTo(0,-h*.66);g.lineTo(w,-h*.66);g.stroke();
    const scan=w*clamp((p-.1)/.8);g.fillColor=this.color('#6EE0DE1F');g.rect(scan-30,-h,60,h);g.fill();
    for(let i=0;i<7;i++){g.fillColor=this.color(i/7<p?C.orange:'#324852');g.rect(w*.25+i*w*.075,-h*.53,w*.05,13);g.fill();}
  }
  private corners(g:Graphics,w:number,h:number,color:string):void {
    g.strokeColor=this.color(color+'99');g.lineWidth=1.5;
    [[0,0,1,1],[w,0,-1,1],[0,-h,1,-1],[w,-h,-1,-1]].forEach(([x,y,sx,sy])=>{g.moveTo(x+sx*23,y);g.lineTo(x,y);g.lineTo(x,y-sy*23);g.stroke();});
  }

  private receipt(amount:number):Promise<void>{
    const n=this.ui.panel(this.layer,1245,150,270,208,{fill:'#142C38',stroke:C.cyan,radius:4,name:'orbital-transaction-receipt'});
    this.ui.label(n,'轨道旧货局 · 交易回执',16,14,238,28,{size:18,color:C.cyan,align:'center'});
    this.ui.line(n,15,56,255,56,'#6EE0DE55',1);
    this.ui.label(n,`${amount>=0?'销售入账':'采购支出'}\n${amount>0?'+':''}${amount.toFixed(amount%1?2:0)} Cr`,19,72,232,78,{size:27,color:C.white,align:'center'});
    const seal=this.ui.panel(n,137,157,113,36,{fill:'#DB8A521C',stroke:C.orange,radius:2,name:'transaction-confirmation'});
    this.ui.label(seal,'已结算',6,3,101,30,{size:21,color:C.orange,align:'center'});
    this.track(n,'receipt-print');
    return this.run('receipt-print',1.24,()=>n.isValid,p=>{
      n.setPosition(1245,-150+120*(1-ease(clamp(p/.35))));this.opacity(n).opacity=Math.round(255*Math.min(1,p*6)*(1-Math.max(0,p-.86)/.14));
      const s=ease(clamp((p-.4)/.16));seal.setScale(1.35-.35*s,1.35-.35*s,1);this.opacity(seal).opacity=Math.round(255*s);
    },()=>this.drop(n));
  }
  private token(x:number,y:number):Node {
    const n=this.ui.container(this.layer,x,y,22,22,'credit-token');const g=n.addComponent<Graphics>(Graphics);
    g.fillColor=this.color('#173D47');g.roundRect(-11,-11,22,22,4);g.fill();g.strokeColor=this.color(C.cyan);g.lineWidth=2;g.roundRect(-11,-11,22,22,4);g.stroke();
    g.strokeColor=this.color(C.orange);g.moveTo(-4,-4);g.lineTo(4,-4);g.moveTo(-4,4);g.lineTo(4,4);g.stroke();return n;
  }
  private run(kind:string,duration:number,alive:()=>boolean,frame:(p:number)=>void,complete:()=>void):Promise<void>{
    if(this.disposed){complete();return Promise.resolve();}
    let resolvePromise:()=>void=()=>{};const promise=new Promise<void>(resolve=>{resolvePromise=resolve;});
    const t:Task={kind,duration:Math.max(.01,duration),elapsed:0,ended:false,alive,frame,complete,resolve:resolvePromise};this.tasks.push(t);
    if(this.reducedMotion)this.end(t,true);else if(alive())frame(0);else this.end(t,false);return promise;
  }
  private end(task:Task,toEnd:boolean):void {
    if(task.ended)return;task.ended=true;if(toEnd&&task.alive())task.frame(1);
    try{task.complete();}finally{const i=this.tasks.indexOf(task);if(i>=0)this.tasks.splice(i,1);task.resolve();}
  }
  private top():void {if(this.layer.isValid)this.layer.setSiblingIndex(this.root.children.length-1);}
  private track(node:Node,kind:string):void {this.tracked.push({node,kind});}
  private untrack(node:Node):void {for(let i=this.tracked.length-1;i>=0;i--)if(this.tracked[i].node===node)this.tracked.splice(i,1);}
  private opacity(node:Node):UIOpacity {return node.getComponent<UIOpacity>(UIOpacity)??node.addComponent<UIOpacity>(UIOpacity);}
  private color(v:string):Color {return new Color().fromHEX(v);}
  private drop(node:Node):void {this.untrack(node);if(!node.isValid)return;this.stop(node);node.removeFromParent();node.destroy();}
  private stop(node:Node):void {Tween.stopAllByTarget(node);const o=node.getComponent<UIOpacity>(UIOpacity);if(o)Tween.stopAllByTarget(o);for(const c of node.children)this.stop(c);}
  private clearAmbient():void {if(this.ambient?.isValid)this.drop(this.ambient);this.ambient=null;this.ambientParent=null;this.particles=[];this.lights=[];}
  private updateAmbient():void {
    if(this.actor?.isValid&&!this.moving.has(this.actor)){this.actor.setPosition(this.actorBase.x,this.actorBase.y+(this.reducedMotion?0:Math.sin(this.clock*1.7)*1.2),this.actorBase.z);this.actor.angle=this.actorAngle+(this.reducedMotion?0:Math.sin(this.clock)*.22);}
    for(const p of this.particles){if(!p.node.isValid)continue;p.node.active=!this.reducedMotion;if(!this.reducedMotion){p.node.setPosition(p.x+Math.sin(this.clock*p.speed+p.phase)*14,-p.y+Math.cos(this.clock*p.speed*.7+p.phase)*18);this.opacity(p.node).opacity=Math.round(80+Math.sin(this.clock*.5+p.phase)*55);}}
    this.lights.forEach((n,i)=>{if(n.isValid)this.opacity(n).opacity=this.reducedMotion?175:Math.round(180+Math.sin(this.clock*.65+i*1.7)*50);});
  }
}
