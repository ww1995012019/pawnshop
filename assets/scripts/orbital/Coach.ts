import {BlockInputEvents,Color,Graphics,Node,UIOpacity,UITransform,Vec3,sys} from 'cc';
import type {OrbitalUI} from './OrbitalUI';
import type {OrbitalState,PageId} from './types';

export interface CoachRect {x:number;y:number;width:number;height:number}
/** What the coach needs from the game; it never changes game state itself. */
export interface CoachHost {
  ui:OrbitalUI;
  state():OrbitalState;
  page():PageId;
  busy():boolean;
  blocked():boolean; // a modal or title screen is open
  button(parent:Node,text:string,x:number,y:number,w:number,h:number,fn:()=>void,options?:{tone?:'gold'|'quiet'|'green';size?:number;name?:string}):Node;
  reducedMotion():boolean;
}
export interface CoachStep {
  id:string;
  title:string;
  text:string;
  /** Node name to spotlight; omitted = centred card with no hole. */
  target?:string;
  /** Pages on which the step is shown; on other pages the coach waits. */
  pages?:PageId[];
  /** Advance automatically once true (the player performs the action through the hole). */
  until?:(s:OrbitalState,page:PageId)=>boolean;
  /** Skip the step when it no longer applies (e.g. the customer already left). */
  skip?:(s:OrbitalState,page:PageId)=>boolean;
  /** Wider spotlight padding for large areas. */
  pad?:number;
}

const DONE_KEY='orbital-tutorial-v1',TIPS_KEY='orbital-tips-v1';
const W=1600,H=900;

/**
 * Coach marks: dims the screen except one target, shows a speech card with an arrow,
 * and either waits for the player to act through the spotlight or offers “下一步”.
 */
export class Coach {
  private steps:CoachStep[]=[];
  private index=-1;
  private overlay:Node|null=null;
  private glow:Graphics|null=null;
  private hole:CoachRect|null=null;
  private lastKey='';
  private clock=0;
  private poll=0;
  private onFinish:(()=>void)|null=null;
  private persist=false;

  constructor(private readonly h:CoachHost){}

  get active():boolean{return this.index>=0;}
  static tutorialDone():boolean{try{return !!sys.localStorage.getItem(DONE_KEY);}catch{return true;}}
  static resetTutorial():void{try{sys.localStorage.removeItem(DONE_KEY);sys.localStorage.removeItem(TIPS_KEY);}catch{/* storage unavailable */}}
  static tipSeen(id:string):boolean{try{return (JSON.parse(sys.localStorage.getItem(TIPS_KEY)||'[]') as string[]).includes(id);}catch{return true;}}
  static markTip(id:string):void{try{const seen=JSON.parse(sys.localStorage.getItem(TIPS_KEY)||'[]') as string[];if(!seen.includes(id)){seen.push(id);sys.localStorage.setItem(TIPS_KEY,JSON.stringify(seen));}}catch{/* storage unavailable */}}

  /** Run a sequence. `persist` marks the main tutorial as done when it ends or is skipped. */
  start(steps:CoachStep[],options:{persist?:boolean;onFinish?:()=>void}={}):void{
    this.stop(false);this.steps=steps;this.index=0;this.persist=!!options.persist;this.onFinish=options.onFinish??null;this.lastKey='';this.refresh();
  }
  stop(completed=true):void{
    const was=this.active;this.index=-1;this.steps=[];this.drop();
    if(was&&completed&&this.persist){try{sys.localStorage.setItem(DONE_KEY,'done');}catch{/* storage unavailable */}}
    if(was){const done=this.onFinish;this.onFinish=null;done?.();}
  }
  /** Re-evaluate after any render or state change. */
  refresh():void{
    if(!this.active)return;
    const s=this.h.state(),page=this.h.page();
    // Auto-advance through steps that are already satisfied or no longer apply.
    for(let guard=0;guard<this.steps.length&&this.active;guard++){
      const step=this.steps[this.index];
      if(step.skip?.(s,page)||step.until?.(s,page)){this.advance(false);continue;}
      break;
    }
    if(!this.active)return;
    const step=this.steps[this.index];
    const hidden=this.h.blocked()||this.h.busy()||(step.pages&&!step.pages.includes(page));
    const rect=hidden?null:step.target?this.find(step.target):null;
    if(hidden||(step.target&&!rect)){this.drop();this.lastKey='';return;}
    const key=`${this.index}:${rect?`${Math.round(rect.x)},${Math.round(rect.y)},${Math.round(rect.width)},${Math.round(rect.height)}`:'c'}`;
    if(key===this.lastKey&&this.overlay?.isValid){this.overlay.setSiblingIndex(this.overlay.parent!.children.length-1);return;}
    this.lastKey=key;this.draw(step,rect);
  }
  update(dt:number):void{
    if(!this.active)return;
    this.clock+=dt;this.poll+=dt;
    if(this.poll>.25){this.poll=0;this.refresh();}
    if(this.glow?.isValid&&this.hole&&!this.h.reducedMotion()){
      const g=this.glow,r=this.hole,a=Math.round(110+90*Math.sin(this.clock*4));g.clear();
      g.strokeColor=new Color(240,165,94,a);g.lineWidth=6;g.roundRect(r.x-4,-(r.y+r.height+4),r.width+8,r.height+8,12);g.stroke();
      g.strokeColor=new Color(255,214,160,255);g.lineWidth=2.5;g.roundRect(r.x,-(r.y+r.height),r.width,r.height,9);g.stroke();
    }
  }

  private advance(redraw=true):void{
    this.index++;
    if(this.index>=this.steps.length){this.stop(true);return;}
    this.lastKey='';if(redraw)this.refresh();
  }
  private find(name:string):CoachRect|null{
    const node=this.search(this.h.ui.root,name);if(!node||!node.activeInHierarchy)return null;
    const t=node.getComponent<UITransform>(UITransform);if(!t)return null;
    const a=t.anchorPoint,lo=t.convertToWorldSpaceAR(new Vec3(-a.x*t.width,-a.y*t.height)),hi=t.convertToWorldSpaceAR(new Vec3((1-a.x)*t.width,(1-a.y)*t.height));
    return{x:lo.x+W/2,y:H/2-hi.y,width:hi.x-lo.x,height:hi.y-lo.y};
  }
  private search(n:Node,name:string):Node|null{
    if(n.name===name&&n!==this.overlay)return n;
    for(const c of n.children){if(c===this.overlay)continue;const f=this.search(c,name);if(f)return f;}
    return null;
  }
  private drop():void{if(this.overlay?.isValid){this.h.ui.clear(this.overlay);this.overlay.removeFromParent();this.overlay.destroy();}this.overlay=null;this.glow=null;this.hole=null;}

  private draw(step:CoachStep,target:CoachRect|null):void{
    this.drop();
    const ui=this.h.ui,root=ui.root,o=ui.container(root,0,0,W,H,'coach-overlay');this.overlay=o;
    const pad=step.pad??10;
    const hole=target?{x:Math.max(0,target.x-pad),y:Math.max(0,target.y-pad),width:Math.min(W,target.width+pad*2),height:Math.min(H,target.height+pad*2)}:null;
    this.hole=hole;
    // Dim everything except the spotlight; each band swallows input.
    const bands:CoachRect[]=hole?[
      {x:0,y:0,width:W,height:hole.y},{x:0,y:hole.y+hole.height,width:W,height:H-hole.y-hole.height},
      {x:0,y:hole.y,width:hole.x,height:hole.height},{x:hole.x+hole.width,y:hole.y,width:W-hole.x-hole.width,height:hole.height},
    ]:[{x:0,y:0,width:W,height:H}];
    for(const b of bands){if(b.width<=0||b.height<=0)continue;const n=ui.container(o,b.x,b.y,b.width,b.height,'coach-dim');const g=n.addComponent<Graphics>(Graphics);g.fillColor=new Color(2,5,9,175);g.rect(0,-b.height,b.width,b.height);g.fill();n.addComponent<BlockInputEvents>(BlockInputEvents);}
    // Info steps also cover the hole so the player reads before acting.
    if(hole&&!step.until){const n=ui.container(o,hole.x,hole.y,hole.width,hole.height,'coach-hole-lock');n.addComponent<BlockInputEvents>(BlockInputEvents);}
    if(hole){this.glow=ui.container(o,0,0,W,H,'coach-spotlight').addComponent<Graphics>(Graphics);this.update(0);}
    // Speech card.
    const bw=500,lines=Math.ceil(step.text.length/24)+step.text.split('\n').length-1,bh=Math.max(178,96+lines*27+(step.until?20:52));
    let bx=(W-bw)/2,by=(H-bh)/2,side:'up'|'down'|'left'|'right'|'none'='none';
    if(hole){
      const cx=hole.x+hole.width/2;
      // Prefer below/above, then beside; for very large spotlights accept covering the dock.
      if(hole.y+hole.height+bh+30<H-90){by=hole.y+hole.height+24;side='up';}
      else if(hole.y-bh-24>96){by=hole.y-bh-24;side='down';}
      else if(hole.x-bw-30>10){bx=hole.x-bw-28;by=Math.max(100,Math.min(H-bh-100,hole.y+hole.height/2-bh/2));side='right';}
      else if(hole.x+hole.width+bw+30<W-10){bx=hole.x+hole.width+28;by=Math.max(100,Math.min(H-bh-100,hole.y+hole.height/2-bh/2));side='left';}
      else if(hole.y+hole.height+bh+20<H-6){by=hole.y+hole.height+18;side='up';}
      else {by=Math.max(8,hole.y-bh-18);side='down';}
      if(side==='up'||side==='down')bx=Math.max(16,Math.min(W-bw-16,cx-bw/2));
      bx=Math.max(16,Math.min(W-bw-16,bx));by=Math.max(8,Math.min(H-bh-8,by));
    }
    const card=ui.texturePanel(o,bx,by,bw,bh,{skin:'socket',name:'coach-card'});card.addComponent<BlockInputEvents>(BlockInputEvents);
    const arrow=ui.container(o,0,0,W,H,'coach-arrow').addComponent<Graphics>(Graphics);
    if(hole&&side!=='none'){
      const cx=Math.max(bx+30,Math.min(bx+bw-30,hole.x+hole.width/2)),cy=Math.max(by+30,Math.min(by+bh-30,hole.y+hole.height/2));
      arrow.fillColor=new Color('#E0A16C');
      if(side==='up'){arrow.moveTo(cx-14,-by);arrow.lineTo(cx,-(by-18));arrow.lineTo(cx+14,-by);}
      else if(side==='down'){arrow.moveTo(cx-14,-(by+bh));arrow.lineTo(cx,-(by+bh+18));arrow.lineTo(cx+14,-(by+bh));}
      else if(side==='right'){arrow.moveTo(bx+bw,-(cy-14));arrow.lineTo(bx+bw+18,-cy);arrow.lineTo(bx+bw,-(cy+14));}
      else {arrow.moveTo(bx,-(cy-14));arrow.lineTo(bx-18,-cy);arrow.lineTo(bx,-(cy+14));}
      arrow.close();arrow.fill();
    }
    ui.hudIcon(card,step.until?'next':'tip',20,18,40,40);
    ui.label(card,step.title,70,18,bw-150,40,{size:22,bold:true,color:'#FFE0B0',verticalAlign:'center',wrap:false});
    const main=this.steps.length>1;
    if(main)ui.label(card,`${this.index+1}/${this.steps.length}`,bw-84,18,64,40,{size:16,mono:true,color:'#9BA6A4',align:'right',verticalAlign:'center',wrap:false});
    ui.label(card,step.text,24,66,bw-48,bh-66-(step.until?44:62),{size:18,lineHeight:27,color:'#ECE7DA',wrap:true,overflow:'shrink'});
    if(step.until){
      ui.label(card,'▶ 照提示操作即可继续',24,bh-42,bw-160,26,{size:15,color:'#8BEDE6',verticalAlign:'center',wrap:false});
      if(main)this.h.button(card,'跳过引导',bw-128,bh-50,108,36,()=>this.stop(true),{tone:'quiet',size:15,name:'coach-skip'});
    }else{
      if(main)this.h.button(card,'跳过引导',20,bh-62,130,44,()=>this.stop(true),{tone:'quiet',size:16,name:'coach-skip'});
      const last=this.index===this.steps.length-1;
      this.h.button(card,last?(main?'开始营业':'知道了'):'下一步',bw-170,bh-62,150,44,()=>this.advance(),{tone:'gold',size:18,name:'coach-next'});
    }
    if(!this.h.reducedMotion()){
      const op=card.addComponent<UIOpacity>(UIOpacity);op.opacity=0;
      const from=card.position.clone();card.setPosition(from.x,from.y-10);
      let t=0;const tick=(dt:number)=>{t+=dt;const p=Math.min(1,t/.22);op.opacity=Math.round(255*p);card.setPosition(from.x,from.y-10*(1-p*p*(3-2*p)));};
      // Lightweight fade driven by update(); stops when complete or the card is gone.
      const stepFn=(dt:number)=>{if(!card.isValid||t>=.22)return false;tick(dt);return true;};
      this.fades.push(stepFn);
    }
    o.setSiblingIndex(root.children.length-1);
  }
  private fades:((dt:number)=>boolean)[]=[];
  /** Drive card fade-ins (called from update via the host). */
  animate(dt:number):void{this.fades=this.fades.filter(f=>f(dt));}
}
