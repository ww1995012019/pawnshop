import {Component,Node,BlockInputEvents,Canvas,Camera,UITransform,Layers,Color,Vec2,Vec3,Rect,Size,SpriteFrame,Graphics,Mask,Label,EditBox,UIOpacity,EventTouch,EventMouse,game,input,Input,EventKeyboard,KeyCode,view,ResolutionPolicy,sys,AudioSource,AudioClip,assetManager,resources} from 'cc';
import type {ButtonOptions} from '../ui/GameUI';
import {OrbitalUI,ORBITAL_PALETTE as C,PAPER_INK as INK,type HudIcon} from './OrbitalUI';
import {OrbitalMotion} from './OrbitalMotion';
import {OrbitalPanels} from './OrbitalPanels';
import {itemDefs,tools,orderDefs,npcs,getDef,getNpc,getTool} from './data';
import {createOrbital,reduceOrbital,findItem,estimate,serializeOrbital,parseOrbital} from './model';
import type {OrbitalAction,OrbitalItem,OrbitalPrefs,OrbitalState,PageId,ToolId} from './types';
import type {OrbitalHost} from './ui-types';
import {constrain,type InspectionRect} from './InspectionGeometry';
import {getItemHitBounds} from './ItemHitBounds';
import {InspectionFeedback} from './InspectionFeedback';
import {GamePresentation} from './GamePresentation';
import {customerNeed,offerBounds} from './Negotiation';
import {getItemClue,getItemMark} from './ItemReadings';
import {dailyVisitLimit,marketNpcId} from './Market';
import {openGoodsHandbook} from './GoodsHandbook';

const INSPECTION_AREA:InspectionRect={x:212,y:200,width:1008,height:440};
const INSPECTION_LOCAL:InspectionRect={x:-202,y:-202,width:404,height:404};
const INSPECTION_HOME={x:716,y:420,angle:0};
const W=1600,H=900,SAVE='orbital-save-v3',PREFS='orbital-prefs-v3';
const TITLES:Record<PageId,string>={counter:'营业主柜台',inspect:'实物鉴定工作台',repair:'维修与拆解台',warehouse:'仓库与安检',trade:'议价与成交',orders:'订单与委托',report:'日结与租金',settings:'暂停与设置'};
type Draft={marks:Set<number>;uv:number;peaks:number[];probe:number;tared:boolean;weights:Set<number>;load:number};

/** Shared component for the Creator scene and the real-engine browser entry. */
export class OrbitalMain extends Component implements OrbitalHost {
  ui!:OrbitalUI;
  state:OrbitalState=createOrbital();
  selected='';
  prefs:OrbitalPrefs={sound:true,reducedMotion:false,largeText:false};
  busy=false;
  private shell!:Node;
  private content!:Node;
  private chrome:Node|null=null;
  private dialogueNodes:Node[]=[];
  private motion!:OrbitalMotion;
  private panels!:OrbitalPanels;
  private page:PageId='counter';
  private tool:ToolId='TOL-001';
  private object:Node|null=null;
  private actor:Node|null=null;
  private counterObject:Node|null=null;
  private counterShadow:Node|null=null;
  private counterTags:Node[]=[];
  private back=false;
  private zoom=1;
  private scaleLabel:Label|null=null;
  private zoomIn:Node|null=null;
  private zoomOut:Node|null=null;
  private offer=0;
  private chosenEvidence:ToolId|undefined;
  private drafts=new Map<string,Draft>();
  private pose={...INSPECTION_HOME};
  private poseUid='';
  private inspectionShadow:Node|null=null;
  private inspectionFx:InspectionFeedback|null=null;
  private objectDragging=false;
  private focus=-1;
  private focused:Node|null=null;
  private epoch=0;
  private skipNode:Node|null=null;
  private saveFailed=false;
  private audio!:AudioSource;
  private clips=new Map<string,AudioClip>();
  private ambience:AudioSource|null=null;
  private readonly presentation=new GamePresentation();
  private disposed=false;
  private counterForeground:SpriteFrame|null=null;
  private pointerCleanup:(()=>void)|null=null;
  private pointerCanvas:HTMLCanvasElement|null=null;
  private titleScreen:Node|null=null;
  private readonly cancelPointer=()=>{const cleanup=this.pointerCleanup;this.pointerCleanup=null;cleanup?.();this.ui?.resetPointer();};

  start():void{void this.boot().catch(error=>{console.error('Orbital game initialization failed',error);const el=document.getElementById('load-status');if(el)el.textContent='空间站载入失败，请刷新重试。';});}
  private async boot():Promise<void>{
    view.setDesignResolutionSize(W,H,ResolutionPolicy.SHOW_ALL);
    const canvasNode=new Node('OrbitalCanvas');canvasNode.layer=Layers.Enum.UI_2D;this.node.addChild(canvasNode);
    const canvas=canvasNode.addComponent<Canvas>(Canvas);canvasNode.getComponent<UITransform>(UITransform)!.setContentSize(W,H);
    const cameraNode=new Node('OrbitalCamera');this.node.addChild(cameraNode);cameraNode.setPosition(0,0,1000);
    const camera=cameraNode.addComponent<Camera>(Camera);camera.projection=Camera.ProjectionType.ORTHO;camera.orthoHeight=H/2;camera.near=.1;camera.far=2000;camera.visibility=Layers.Enum.UI_2D;camera.clearFlags=Camera.ClearFlag.SOLID_COLOR;camera.clearColor=new Color(C.background);canvas.cameraComponent=camera;
    const root=new Node('OrbitalUI');root.layer=Layers.Enum.UI_2D;canvasNode.addChild(root);const rt=root.addComponent<UITransform>(UITransform);rt.setContentSize(W,H);rt.setAnchorPoint(0,1);root.setPosition(-W/2,H/2);
    this.ui=new OrbitalUI(root);this.shell=this.ui.container(root,0,0,W,H,'OrbitalView');this.audio=this.node.addComponent<AudioSource>(AudioSource);
    try{this.state=parseOrbital(sys.localStorage.getItem(SAVE))||createOrbital();this.prefs={...this.prefs,...JSON.parse(sys.localStorage.getItem(PREFS)||'{}')};}catch{this.state=createOrbital();}
    this.selected=this.state.inventory[0]?.uid||'';
    await this.ui.preload();if(this.disposed)return;
    this.motion=new OrbitalMotion(this.ui,root);this.motion.setRegions({contentArea:{x:24,y:108,width:1552,height:700},inspectionArea:INSPECTION_AREA});this.panels=new OrbitalPanels(this);this.render();
    input.on(Input.EventType.KEY_DOWN,this.onKey,this);void this.loadAudio();
    this.pointerCanvas=game.canvas;this.pointerCanvas?.addEventListener('pointerleave',this.cancelPointer);this.pointerCanvas?.addEventListener('mouseleave',this.cancelPointer);
    window.addEventListener('blur',this.cancelPointer);window.addEventListener('pointercancel',this.cancelPointer);window.addEventListener('resize',this.cancelPointer);
    const debug={engine:'Cocos Creator 3.8.8',version:'orbital-p0-v12',start:()=>this.startFromTitle(false),title:()=>!!this.titleScreen?.isValid,snapshot:()=>JSON.parse(JSON.stringify(this.state)),controls:()=>this.controls(),diagnostics:()=>({page:this.page,busy:this.busy,tool:this.tool,back:this.back,zoom:this.zoom,selected:this.selected,motion:this.motion.snapshot(),moods:this.ui.getMoodDiagnostics(),object:this.object?{x:this.pose.x,y:this.pose.y,angle:this.object.angle,scale:this.object.scale.x,bounds:this.inspectionEffectRect()}:null}),dispatch:(a:OrbitalAction)=>{this.dismissTitle();this.dispatch(a);},open:(p:PageId,uid?:string)=>{this.dismissTitle();this.navigate(p,uid);},reset:(seed='ORBITAL-TUTORIAL')=>{this.dismissTitle();this.skip();this.state=createOrbital(seed);this.selected=this.state.inventory[0]?.uid||'';this.page='counter';this.resetInspection(this.selected);this.drafts.clear();this.save();this.render();},click:(name:string)=>{const n=this.all(this.ui.root).find(x=>x.name===name);const fn=(n as unknown as {__action?:()=>void})?.__action;if(fn){fn();return true;}return false;}};
    (window as unknown as {__ORBITAL__:typeof debug;__GREYLINE__:typeof debug}).__ORBITAL__=debug;(window as unknown as {__GREYLINE__:typeof debug}).__GREYLINE__=debug;
    document.dispatchEvent(new CustomEvent('greyline-ready'));
    this.showTitle();
  }
  /** Title screen over the live counter scene: continue, new shop or settings. */
  private showTitle():void{
    const s=this.state,progress=s.day>1||s.ledger.length>0||s.completedTrades.length>0||!!s.trade;
    const o=this.ui.container(this.ui.root,0,0,W,H,'title-screen');this.titleScreen=o;
    if(this.chrome?.isValid)this.chrome.active=false;if(this.content?.isValid)this.content.active=false;
    o.addComponent<BlockInputEvents>(BlockInputEvents);
    const veil=this.ui.container(o,0,0,W,H,'title-veil').addComponent<Graphics>(Graphics);
    for(let i=0;i<40;i++){veil.fillColor=new Color(2,5,9,Math.round(240-i*4.6));veil.rect(i*40,-H,40,H);veil.fill();}
    veil.fillColor=new Color(0,0,0,150);veil.rect(0,-H,W,120);veil.fill();veil.rect(0,-120,W,120);veil.fill();
    const mark=this.ui.container(o,118,150,120,120,'title-emblem').addComponent<Graphics>(Graphics);
    mark.fillColor=new Color('#120B06');mark.circle(60,-60,58);mark.fill();mark.fillColor=new Color('#2A1A0E');mark.circle(60,-60,50);mark.fill();
    mark.lineWidth=5;mark.strokeColor=new Color('#E8A86A');mark.ellipse(60,-60,54,20);mark.stroke();
    mark.lineWidth=4;mark.strokeColor=new Color('#F2E6CC');mark.circle(60,-60,28);mark.stroke();
    mark.fillColor=new Color('#FFC98F');mark.circle(110,-52,9);mark.fill();
    this.ui.label(o,'轨道旧货局',112,282,820,110,{size:92,bold:true,color:'#F8EDD6',verticalAlign:'center',wrap:false,outline:'#1A0E05',outlineWidth:4,glow:'#E0893A70'});
    this.ui.label(o,'回环九号 · 下层旧港的空间站当铺',118,392,800,36,{size:26,color:'#C9C2B2',verticalAlign:'center',wrap:false});
    this.ui.label(o,'每件旧物，都有下一程。',118,434,800,32,{size:20,color:C.orange,verticalAlign:'center',wrap:false});
    const start=this.button(o,progress?`继续营业 · 第 ${s.day} 天`:'开门营业',118,500,400,68,()=>this.startFromTitle(true),{tone:'gold',size:24,name:'title-start'});
    this.button(o,'新开一家店',118,584,400,58,()=>{
      if(!progress){this.startFromTitle(true);return;}
      const m=this.ui.modal('新开一家店',{width:760,height:420});
      this.text(m.body,'当前进度会被新店覆盖。\n需要保留的话，先在设置里导出经营档案。',24,20,640,110,22,C.text);
      this.button(m.body,'返回',24,190,310,58,()=>m.close(),{tone:'quiet'});
      this.button(m.body,'确认新开',356,190,310,58,()=>{m.close();this.resetGame();this.startFromTitle(true);},{tone:'danger'});
    },{tone:'quiet',size:20,name:'title-new'});
    this.button(o,'设置',118,656,400,58,()=>{this.dismissTitle();this.navigate('settings');},{tone:'quiet',size:20,name:'title-settings'});
    this.ui.label(o,'Enter 开始',W-260,H-58,220,28,{size:15,color:C.muted,align:'right',verticalAlign:'center',wrap:false});
    this.ui.label(o,'orbital-p0-v12 · Cocos Creator 3.8.8',40,H-58,500,28,{size:13,color:'#6F7A78',verticalAlign:'center',wrap:false});
    this.focused=start;this.ui.focusButton(start);
    this.ui.animateIn(o);
  }
  private dismissTitle():void{
    const o=this.titleScreen;this.titleScreen=null;
    if(!o?.isValid)return;
    this.ui.clear(o);o.removeFromParent();o.destroy();
    this.focus=-1;this.focused=null;this.render();
  }
  private startFromTitle(animate:boolean):void{
    if(!this.titleScreen?.isValid)return;
    this.dismissTitle();this.sound('open');
    if(animate)void this.play(()=>this.motion.sceneEntry());
  }
  private save():void{try{sys.localStorage.setItem(SAVE,serializeOrbital(this.state));this.saveFailed=false;}catch{this.saveFailed=true;}}
  savePrefs():void{try{sys.localStorage.setItem(PREFS,JSON.stringify(this.prefs));}catch{}this.motion.configure({reducedMotion:this.prefs.reducedMotion});this.render();}
  resetGame():void{this.skip();this.state=createOrbital();this.page='counter';this.selected=this.state.inventory[0]?.uid||'';this.resetInspection(this.selected);this.drafts.clear();this.save();this.render();}
  exportSave():void{const url=URL.createObjectURL(new Blob([serializeOrbital(this.state)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`orbital-day-${this.state.day}.json`;a.click();URL.revokeObjectURL(url);this.ui.toast('经营档案已导出。');}
  select(uid:string):void{if(uid!==this.selected)this.resetInspection(uid);this.selected=uid;this.render();}
  navigate(page:PageId,uid?:string):void{
    if(this.busy)return;
    if(uid&&uid!==this.selected){this.resetInspection(uid);this.selected=uid;}
    if(page==='report'&&this.state.phase==='open'){
      this.confirmClosing();return;
    }
    this.page=page;this.focus=-1;this.focused=null;if(page==='trade')this.offer=this.state.trade?.price||0;
    this.sound('page');this.render();
  }
  dispatch(action:OrbitalAction):void{
    if(this.busy)return;
    const before=this.state,oldItem=before.trade?.item||(before.trade?.selectedUid?findItem(before,before.trade.selectedUid):null);
    const counterOrigin=this.counterObject?.isValid?{x:this.counterObject.position.x+210,y:-this.counterObject.position.y+158,size:316}:undefined;
    this.state=reduceOrbital(before,action);this.save();
    if(action.type==='ARRIVE'&&this.state.trade){this.selected=this.state.trade.item?.uid||this.selected;this.offer=this.state.trade.price;this.chosenEvidence=undefined;this.page='counter';this.resetInspection(this.selected);}
    if(action.type==='SELECT_TRADE'&&this.state.trade?.selectedUid===action.uid){this.selected=action.uid;this.offer=this.state.trade.price;this.chosenEvidence=undefined;this.page='trade';}
    if(action.type==='OFFER'&&this.state.trade&&this.state.trade.rounds>=(before.trade?.rounds||0))this.offer=this.state.trade.price;
    if(action.type==='CRAFT'){const product=this.state.inventory.find(i=>!before.inventory.some(old=>old.uid===i.uid));if(product){this.selected=product.uid;this.resetInspection(product.uid);}}
    if(before.trade&&!this.state.trade&&['DELIVER','REFUSE','PAWN','OFFER'].includes(action.type))this.page='counter';
    if(action.type==='SETTLE'&&(this.state.phase==='report'||this.state.phase==='ending'))this.page='report';
    if(action.type==='NEXT'&&this.state.day!==before.day){this.page='counter';this.chosenEvidence=undefined;this.drafts.clear();}
    this.sound(action.type==='DELIVER'||action.type==='DELIVER_ORDER'?'coin':action.type==='CHECK'?'check':action.type==='REFUSE'?'reject':action.type==='ARRIVE'?'open':action.type==='REPAIR_STEP'?'drop':'click');
    if(action.type==='REFUSE'&&before.trade)this.ui.setMood(before.trade.npcId,'reject');
    if(action.type==='DELIVER'&&before.trade)this.ui.setMood(before.trade.npcId,'happy');
    this.render();
    const after=this.state;
    if(action.type==='ARRIVE'&&after.trade&&!before.trade){
      const actor=this.actor,it=after.trade.item;this.setCounterVisible(false);
      void this.play(async active=>{if(actor)await this.motion.enter(actor);if(active()&&it)await this.motion.handoff(it.defId,{x:675,y:450},{x:900,y:556},()=>{if(active()){this.setCounterVisible(true);this.sound('drop');}},316);if(active())this.setCounterVisible(true);});
    }else if(action.type==='DELIVER'&&before.trade&&!after.trade&&after.completedTrades.includes(before.trade.id)){
      void this.play(async active=>{await this.motion.deal(after.cash-before.cash,oldItem?.defId,counterOrigin);if(active())await this.motion.exit(before.trade!.npcId);});
    }else if(action.type==='OFFER'&&after.trade&&before.trade&&after.trade.rounds>before.trade.rounds&&this.actor){
      const actor=this.actor;void this.motion.react(actor,after.trade.locked?'agree':after.trade.rounds>=2?'refuse':'counter');
    }else if((action.type==='REFUSE'||action.type==='OFFER')&&before.trade&&!after.trade){this.ui.setMood(before.trade.npcId,'reject');this.sound('reject');void this.play(()=>this.motion.exit(before.trade!.npcId));}
    else if(action.type==='CHECK'&&after.ap<=before.ap&&findItem(after,action.uid)?.evidence.includes(action.tool)){
      const effect=['magnify','uv','spectrum','probe','scale','pulse'][tools.findIndex(t=>t.id===action.tool)];this.effect(effect,this.content,this.inspectionEffectRect());
    }else if(action.type==='REPAIR'&&findItem(after,action.uid)?.repaired&&!findItem(before,action.uid)?.repaired)this.effect('repair',this.content,{x:480,y:260,width:500,height:350});
    else if(action.type==='CRAFT'&&after.inventory.length!==before.inventory.length)this.effect('assemble',this.content,{x:470,y:250,width:500,height:350});
    else if(action.type==='SCAN'&&after.scanned.length>before.scanned.length)this.effect('scan',this.content,{x:785,y:278,width:279,height:283});
    else if(action.type==='SETTLE'&&after.phase==='report'&&before.phase!=='report')this.effect('day',this.content);
    else if(action.type==='NEXT'&&after.day!==before.day)this.effect('day',this.content);
    else if(action.type==='UPGRADE'&&!before.upgrades[action.id]&&after.upgrades[action.id])this.effect('upgrade',this.content);
    else if(action.type==='DELIVER_ORDER'&&after.cash!==before.cash){this.effect('stamp',this.content,{x:1230,y:600,width:230,height:64});this.ui.toast(`委托报酬已入账 +${after.cash-before.cash} Cr`,'success');}
    else if(action.type==='DISPLAY'||action.type==='MOVE'){
      const it=findItem(after,action.uid),prior=findItem(before,action.uid);
      if(it&&prior&&(it.x!==prior.x||it.y!==prior.y||it.location!==prior.location)){
        if(this.page==='warehouse')this.effect('stamp',this.content,{x:680,y:560,width:220,height:100});
      }else if(after.notice)this.ui.toast(after.notice);
    }else if(after.notice&&after.notice!==before.notice)this.ui.toast(after.notice);
  }
  effect(kind:string,parent:Node,at?:{x:number;y:number;width?:number;height?:number}):void{
    if(this.busy)return;
    // Local instrument beats are interruptible and do not freeze navigation.
    if(this.motion.snapshot().nodes.some(n=>n.kind===kind))return;
    void this.motion.effect(kind,parent,at);
  }
  private async play(run:(active:()=>boolean)=>Promise<void>):Promise<void>{
    const epoch=++this.epoch;this.busy=true;this.ui.pointer.refresh();this.motion.configure({reducedMotion:this.prefs.reducedMotion});
    this.skipNode?.destroy();this.skipNode=this.ui.container(this.ui.root,1250,770,320,26,'skip-animation');
    this.row(this.skipNode,'空格 · 跳过动画',0,0,320,26,14,C.text,'right');this.skipNode.on(Node.EventType.TOUCH_END,()=>this.skip());
    try{await run(()=>epoch===this.epoch);}finally{if(epoch===this.epoch){this.busy=false;this.ui.pointer.refresh();this.skipNode?.removeFromParent();this.skipNode?.destroy();this.skipNode=null;this.setCounterVisible(true);}}
  }
  private skip():void{this.epoch++;this.motion?.finish();this.busy=false;this.ui.pointer.refresh();this.skipNode?.removeFromParent();this.skipNode?.destroy();this.skipNode=null;this.setCounterVisible(true);}
  private setCounterVisible(visible:boolean):void{for(const n of [this.counterObject,this.counterShadow,...this.counterTags])this.opacity(n,visible?255:0);}
  private opacity(node:Node|null,value:number):void{if(node?.isValid)(node.getComponent<UIOpacity>(UIOpacity)||node.addComponent<UIOpacity>(UIOpacity)).opacity=value;}
  button(parent:Node,text:string,x:number,y:number,w:number,h:number,fn:()=>void,options:ButtonOptions={}):Node{
    let n:Node;
    const invoke=()=>{if(this.busy||(n as unknown as {__enabled?:boolean}).__enabled===false)return;this.sound('click');fn();};
    n=this.ui.button(parent,text,x,y,w,h,invoke,{...options,size:(options.size||20)*(this.prefs.largeText?1.08:1)});
    Object.assign(n,{__action:invoke,__enabled:!options.disabled});this.ui.bindPointer(n,{cursor:'pointer',disabled:()=>this.busy||(n as unknown as {__enabled?:boolean}).__enabled===false});return n;
  }
  private text(p:Node,t:string,x:number,y:number,w:number,h:number,size=21,color:string=C.text,align:'left'|'center'|'right'='left'):Node{return this.ui.label(p,t,x,y,w,h,{size:size*(this.prefs.largeText?1.08:1),color,align});}
  private baseline(p:Node,t:string,x:number,y:number,w:number,size=21,color:string=C.text,align:'left'|'center'|'right'='left'):Node{return this.ui.baselineLabel(p,t,x,y,w,{size:size*(this.prefs.largeText?1.08:1),color,align});}
  private row(p:Node,t:string,x:number,y:number,w:number,h:number,size=21,color:string=C.text,align:'left'|'center'|'right'='left'):Node{const fontSize=size*(this.prefs.largeText?1.08:1);return this.ui.label(p,t,x,y,w,h,{size:fontSize,lineHeight:fontSize,color,align,verticalAlign:'center',wrap:false});}
  render():void{
    if(!this.ui||!this.motion)return;
    if(this.busy)this.skip();
    if(this.chrome?.isValid){this.chrome.removeFromParent();this.chrome.destroy();}this.chrome=null;this.dialogueNodes=[];
        this.cancelPointer();this.ui.clear(this.shell);this.objectDragging=false;this.object=null;this.inspectionShadow=null;this.scaleLabel=null;this.zoomIn=null;this.zoomOut=null;this.actor=null;this.counterObject=null;this.counterShadow=null;this.counterTags=[];this.focused=null;
    this.ui.reducedMotion=this.prefs.reducedMotion;
    this.presentation.reducedMotion=this.prefs.reducedMotion;
    if(!this.prefs.sound)this.ambience?.stop();
    const image=this.page==='inspect'||this.page==='repair'?'orbital-workbench':this.page==='warehouse'?'orbital-warehouse':'orbital-counter';
    this.ui.image(this.shell,image,0,0,W,H,{fit:'cover'});
    if(this.page!=='counter'&&this.page!=='trade')this.ui.panel(this.shell,0,106,W,692,{fill:'#07101940',lineWidth:0,radius:0});
    this.content=this.ui.container(this.shell,0,0,W,H,`page-${this.page}`);this.panels.setPage(this.page);
    if(this.state.phase==='ending'&&this.page!=='settings')this.ending();
    else if(this.page==='counter'||this.page==='trade')this.counter();
    else if(this.page==='inspect')this.inspection();
    else this.panels.draw(this.page,this.content);
    const pageContent=this.content;this.chrome=this.ui.container(this.ui.root,0,0,W,H,'persistent-chrome');this.content=this.chrome;this.header();this.footer();for(const n of [...this.dialogueNodes,...this.counterTags])if(n.isValid)n.setParent(this.chrome);this.content=pageContent;
    // The title shows only the painted shop; page UI and HUD return when play starts.
    if(this.titleScreen?.isValid){this.titleScreen.setSiblingIndex(this.ui.root.children.length-1);this.chrome.active=false;pageContent.active=false;}
    this.motion.bindAmbient({parent:this.content,actor:this.actor||undefined,area:{x:310,y:160,width:860,height:500}});
  }
  private header():void{
    const s=this.state,p=this.content;
    const plate=this.ui.texturePanel(p,20,12,330,76,{skin:'rail',name:'shop-nameplate'});
    const logo=this.ui.container(plate,18,14,48,48,'shop-orbit-mark').addComponent<Graphics>(Graphics);
    logo.fillColor=new Color('#120B06');logo.circle(24,-24,24);logo.fill();
    logo.fillColor=new Color('#2A1A0E');logo.circle(24,-24,20);logo.fill();
    logo.lineWidth=2.6;logo.strokeColor=new Color('#E8A86A');logo.ellipse(24,-24,21,8);logo.stroke();
    logo.lineWidth=2;logo.strokeColor=new Color('#F2E6CC');logo.circle(24,-24,11);logo.stroke();
    logo.fillColor=new Color('#FFC98F');logo.circle(44,-21,4);logo.fill();
    this.ui.label(plate,'轨道旧货局',78,8,240,38,{size:27,bold:true,color:'#F6EBD4',verticalAlign:'center',wrap:false,outline:'#05080B',outlineWidth:2});
    this.row(plate,'回环九号 · 下层旧港',80,42,236,16,12,'#B9B2A2');
    // Resource gauges: icon, small caption and a mono read-out, like a cockpit strip.
    const g=this.ui.texturePanel(p,436,12,736,76,{skin:'rail',name:'player-resource-hud'});
    const caption=(t:string,x:number)=>this.ui.label(g,t,x,14,110,16,{size:12,color:C.muted,verticalAlign:'center',wrap:false});
    const sep=(x:number)=>{this.ui.line(g,x,16,x,60,'#00000090',2);this.ui.line(g,x+2,16,x+2,60,'#FFFFFF1A',1);};
    this.ui.hudIcon(g,'day',18,14,48,48);caption('营业日',74);
    this.ui.label(g,String(s.day).padStart(2,'0'),74,30,44,32,{size:28,mono:true,color:'#F6EBD4',verticalAlign:'center',wrap:false});
    this.ui.label(g,'/21',118,36,48,24,{size:16,mono:true,color:C.muted,verticalAlign:'center',wrap:false});
    sep(178);
    this.ui.hudIcon(g,'energy',192,14,48,48);caption('行动点',246);
    const cells=this.ui.container(g,246,34,210,24,'ap-cells').addComponent<Graphics>(Graphics);
    cells.fillColor=new Color('#05090B');cells.roundRect(-4,-25,206,26,4);cells.fill();
    for(let i=0;i<12;i++){
      // Three banks of four cells read as a battery rather than a barcode.
      const x=i*16+Math.floor(i/4)*4-2,lit=i<s.ap;
      cells.fillColor=new Color(lit?'#7FE6E0':'#1C2E32');cells.roundRect(x,-21,11,18,2);cells.fill();
      if(lit){cells.fillColor=new Color('#E4FFFC90');cells.rect(x+2,-19,7,3);cells.fill();}
    }
    for(let i=0;i<12;i++)this.ui.container(g,244+i*16+Math.floor(i/4)*4,34,11,24,`ap-cell-${i}`);
    this.ui.label(g,`${s.ap}/12`,452,30,72,32,{size:22,mono:true,color:'#8BEDE6',glow:'#4FD6CF88',verticalAlign:'center',wrap:false});
    sep(528);
    this.ui.hudIcon(g,'credits',542,12,52,52);caption('现金 Cr',600);
    this.ui.label(g,s.cash.toFixed(s.cash%1?2:0),600,28,122,36,{size:28,mono:true,color:'#FFCB8E',glow:'#E0893A88',verticalAlign:'center',wrap:false,overflow:'shrink'});
    // Round instrument keys on the right; captions appear on hover.
    const key=(icon:HudIcon,x:number,tip:string,fn:()=>void,name:string)=>{
      const b=this.button(p,'',x,18,64,64,fn,{tone:'quiet',name});this.ui.attachIcon(b,icon,40);this.ui.tooltip(b,tip);return b;
    };
    key('handbook',1222,'货物图鉴',()=>openGoodsHandbook(this),'button-货物图鉴');
    const station=key('alert',1310,`站务 · 关注度 ${s.risk}/100`,()=>this.stationDetails(),'button-站务');
    this.ui.badge(station,String(s.risk),58,6,s.risk>=60?C.danger:C.orange);
    key(this.prefs.sound?'soundOn':'soundOff',1398,this.prefs.sound?'声音：开':'声音：关',()=>{this.prefs.sound=!this.prefs.sound;this.savePrefs();this.sound('check');},'button-切换声音');
    key('settings',1486,'设置',()=>this.navigate('settings'),'button-设置');
  }
  private stationDetails():void{
    const s=this.state,m=this.ui.modal('站务与经营记录',{width:680,height:440});
    this.text(m.body,`下一次租金：${7-((s.day-1)%7)} 天后
应付租金：${Math.round(450*Math.pow(1.1,Math.floor((s.day-1)/7)))} Cr
站务关注：${s.risk} / 100
现有货物：${s.inventory.length} 件 · 在办委托：${s.orders.filter(o=>o.status==='active').length} 张`,26,12,560,175,23,C.text);
    this.button(m.body,'查看经营日结',26,205,560,48,()=>{m.close();this.navigate('report');},{tone:'quiet',size:18});
  }
  private footer():void{
    const nav:[PageId,string,HudIcon][]=[['counter','柜台','counter'],['inspect','鉴定','inspect'],['repair','维修','repair'],['warehouse','仓储','warehouse'],['orders','订单','orders'],['report','日结','report']];
    const p=this.ui.texturePanel(this.content,372,806,856,88,{skin:'rail',name:'navigation-dock'});
    const active=this.state.orders.filter(o=>o.status==='active').length;
    nav.forEach(([page,title,icon],i)=>{
      const selected=this.page===page||(page==='counter'&&this.page==='trade');
      const control=this.button(p,'',16+i*138,13,130,62,()=>this.navigate(page),{tone:'quiet',selected,disabled:page==='inspect'&&!this.currentItem(),name:`button-${String(i+1).padStart(2,'0')} ${title}`});
      const face=control.getChildByName('tech-button-surface')||control;
      this.ui.hudIcon(face,icon,12,9,44,44);
      this.ui.label(face,title,60,0,62,62,{size:20,color:selected?'#FFE0B0':'#E4DFD2',verticalAlign:'center',wrap:false,outline:'#05080BC0',outlineWidth:1});
      if(page==='orders'&&active>0)this.ui.badge(control,String(active),124,6);
    });
    if(this.saveFailed){const warn=this.ui.texturePanel(this.content,24,826,300,52,{skin:'strip',name:'save-warning'});this.ui.hudIcon(warn,'alert',14,10,32,32);this.row(warn,'存档空间不足，请导出档案',54,0,236,52,15,C.orange);}
  }
  private currentItem():OrbitalItem|undefined{return findItem(this.state,this.selected)||this.state.trade?.item||this.state.inventory[0];}
  private counter():void{
    const p=this.content,s=this.state,t=s.trade,it=t?.item||(t?.selectedUid?findItem(s,t.selectedUid):undefined),npc=t?getNpc(t.npcId):getNpc(marketNpcId(s));
    this.shopFixtures();
    this.ui.setMood(npc.id,t?(t.locked?'happy':t.rounds>=2?'reject':t.rounds>0?'question':it&&it.evidence.length>0?'focused':'neutral'):s.day>=3?'tired':'neutral');
    this.actor=t?this.ui.customer(p,npc.id,445,138,460,440):null;
    // Reuse the original painted foreground so the visitor stands behind the actual counter.
    if(!this.counterForeground){
      const source=this.ui.frames.get('orbital-counter');
      if(source){const r=source.rect,y=r.height*565/H;this.counterForeground=new SpriteFrame();this.counterForeground.reset({texture:source.texture,rect:new Rect(r.x,r.y+y,r.width,r.height-y),originalSize:new Size(r.width,r.height-y),offset:new Vec2(0,0)});}
    }
    this.ui.frame(p,this.counterForeground||undefined,0,565,W,335,{fit:'stretch',name:'painted-counter-foreground'});
    if(it){
      const trading=this.page==='trade',ix=690,iy=trading?358:398;
      const sh=this.ui.container(p,ix+30,iy+298,360,25,'counter-shadow');this.counterShadow=sh;const g=sh.addComponent<Graphics>(Graphics);g.fillColor=new Color('#030A0D99');g.ellipse(180,-10,166,12);g.fill();
      this.counterObject=this.ui.object(p,it.defId,ix,iy,420,316,{damaged:it.condition<.75&&!it.repaired,repaired:it.repaired});
      this.counterObject.on(Node.EventType.TOUCH_END,()=>this.navigate('inspect',it.uid));this.ui.bindPointer(this.counterObject,{cursor:'pointer',disabled:()=>this.busy});
      if(!trading){
        // A thermal price tag tied to the goods, rather than a UI caption bar.
        const name=getDef(it.defId).name,tw=Math.max(170,name.length*22+64);
        const tag=this.ui.paperSlip(p,900-tw/2,726,tw,44,{name:'counter-item-tag',torn:false,angle:-1.5});
        const hole=tag.addComponent<Graphics>(Graphics);hole.fillColor=new Color('#3A2E22');hole.circle(18,-22,5);hole.fill();
        hole.strokeColor=new Color('#B9A27C');hole.lineWidth=2;hole.moveTo(18,-22);hole.lineTo(-6,-6);hole.stroke();
        this.ui.label(tag,name,32,0,tw-44,44,{size:19,bold:true,color:INK.text,align:'center',verticalAlign:'center',wrap:false});
        this.counterTags.push(tag);
      }
    }else if(t?.kind==='sell'){
      this.button(p,'打开仓库 · 为客人挑选旧物',704,620,408,56,()=>this.navigate('warehouse'),{tone:'gold',size:20});
    }
    // Counter terminal: a physical till with a CRT read-out and brass keys.
    const panel=this.ui.texturePanel(p,1156,448,388,320,{skin:'socket',name:'counter-terminal'});
    const scr=this.ui.screen(panel,18,18,352,132,'terminal-screen');
    const glowText=(t:string,x:number,y:number,w:number,h:number,size:number,colour:string,glow:string,mono=false,align:'left'|'right'|'center'='left')=>
      this.ui.label(scr,t,x,y,w,h,{size:size*(this.prefs.largeText?1.06:1),color:colour,glow,mono,align,verticalAlign:'center',wrap:false});
    if(t){
      glowText(t.kind==='sell'?'采购商来访 · 出价':t.kind==='pawn'?'抵押保管申请':'来客报价',22,14,300,22,15,'#86E6DF','#3FC9C180');
      glowText(`${t.price}`,22,38,250,58,52,'#FFCB8E','#FF9A4AAA',true);
      glowText('Cr',270,52,60,40,22,'#FFCB8E','#FF9A4A80',true,'right');
      if(it){const a=estimate(it);glowText(`估值 ${a.exact?a.low:`${a.low}–${a.high}`} Cr · ${it.evidence.length} 项物证`,22,98,310,22,15,'#86E6DF','#3FC9C160');}
      if(t.locked){
        this.button(panel,'确认钱货交割',18,166,352,58,()=>this.dispatch({type:'DELIVER',tradeId:t.id}),{tone:'gold',disabled:s.ap<1,size:21});
        this.button(panel,'取消本次交易',18,238,352,52,()=>this.dispatch({type:'REFUSE'}),{tone:'quiet',size:17});
      }else{
        this.button(panel,'拿起实物 · 鉴定',18,166,352,58,()=>it&&this.navigate('inspect',it.uid),{tone:this.page==='trade'?'quiet':'gold',disabled:!it,size:21});
        this.button(panel,this.page==='trade'?'接受当前报价':'商量报价',18,238,232,52,()=>this.page==='trade'?this.dispatch({type:'ACCEPT'}):this.navigate('trade'),{tone:this.page==='trade'?'green':'quiet',disabled:!it||s.ap<1,size:18});
        this.button(panel,'更多',262,238,108,52,()=>this.tradeActions(),{tone:'quiet',size:17});
      }
    }else{
      const closed=s.cursor>=dailyVisitLimit(s);
      glowText(closed?'今日预约已结束':'今日营业中',22,22,310,42,30,'#FFCB8E','#FF9A4AAA');
      glowText(closed?'整理、履约后可以打烊':`下一位：${npc.name}`,22,72,230,26,17,'#86E6DF','#3FC9C170');
      glowText(`${Math.min(s.cursor+1,dailyVisitLimit(s))}/${dailyVisitLimit(s)}`,250,72,82,26,18,'#86E6DF','#3FC9C170',true,'right');
      this.button(panel,closed?'六位预约已处理':'接待下一位来客',18,166,352,58,()=>this.dispatch({type:'ARRIVE'}),{tone:'gold',disabled:closed||s.phase!=='open'||s.ap<1,size:21});
      this.button(panel,'整理后仓',18,238,352,52,()=>this.navigate('warehouse'),{tone:'quiet',size:17});
    }
    if(this.page==='trade'&&t)this.negotiation();
    else{
      const line=t?t.line:s.notice||'回环九号下层港，旧货局今日开门。';
      const dialogue=this.speechBox(p,36,654,612,136,t?npc.name:'营业广播',t?npc.title:'回环九号');
      const speech=this.ui.label(dialogue,line,28,36,556,70,{size:20,lineHeight:30,color:'#F2ECDD',wrap:true,overflow:'clamp'}).getComponent<Label>(Label)!;
      const hint=this.ui.label(dialogue,'',360,104,226,20,{size:12,color:C.muted,align:'right',wrap:false}).getComponent<Label>(Label)!;
      this.presentation.speak(speech,line,`${t?.id||`broadcast-${s.day}-${s.cursor}`}:${line}`,hint);
      dialogue.on(Node.EventType.TOUCH_END,()=>this.presentation.reveal());this.ui.bindPointer(dialogue,{cursor:'pointer'});this.dialogueNodes.push(dialogue);
    }
  }
  /** Visual-novel style dialogue box with a brass name plate riveted on its upper edge. */
  private speechBox(p:Node,x:number,y:number,w:number,h:number,name:string,title:string):Node{
    const box=this.ui.texturePanel(p,x,y,w,h,{skin:'glass',name:'terminal-dialogue'});
    const plateW=Math.max(170,name.length*24+title.length*14+70);
    const plate=this.ui.texturePanel(box,20,-26,plateW,42,{skin:'amber',name:'speaker-plate'});
    this.ui.label(plate,name,18,0,name.length*24+8,42,{size:21,bold:true,color:'#FFF1D8',verticalAlign:'center',wrap:false,outline:'#3A1C0A',outlineWidth:2});
    this.ui.label(plate,title,30+name.length*24,0,plateW-40-name.length*24,42,{size:14,color:'#FBE2C0',verticalAlign:'center',wrap:false,outline:'#3A1C0A',outlineWidth:1});
    return box;
  }
  private tradeActions():void{
    const t=this.state.trade;if(!t)return;const m=this.ui.modal('交易处理',{width:620,height:390});
    this.button(m.body,'礼貌拒绝',20,24,520,54,()=>{m.close();this.dispatch({type:'REFUSE'});},{tone:'quiet',size:20});
    this.button(m.body,'抵押合同',20,102,520,54,()=>{m.close();this.pawnContract();},{tone:'quiet',disabled:t.kind==='sell'||!t.item,size:20});
    this.row(m.body,`已还价 ${t.rounds} 次 · 最多可还价 3 次`,20,183,520,30,15,C.muted,'center');
  }

  private shopFixtures():void{
    const p=this.content,s=this.state,goods=s.inventory.filter(i=>i.location==='display');
    if(s.upgrades.shelf){
      const rack=this.ui.panel(p,973,193,234,364,{fill:'#152E3C99',stroke:C.cyan,radius:5,name:'upgraded-display-rack'});
      for(let y=109;y<360;y+=112)this.ui.line(rack,8,y,226,y,C.cyan,4);
      this.ui.statusChip(p,'模组陈列架 / 已换装',974,158,232,28,C.cyan);
    }
    goods.slice(0,9).forEach((it,i)=>{
      const x=978+(i%3)*75,y=210+Math.floor(i/3)*112;
      const n=this.ui.object(p,it.defId,x,y,72,78,{repaired:it.repaired});n.name=`scene-display-${it.uid}`;
      n.on(Node.EventType.TOUCH_END,()=>this.navigate('inspect',it.uid));this.ui.bindPointer(n,{cursor:'pointer',disabled:()=>this.busy});
      this.ui.tinyTag(p,`${it.listPrice} Cr`,x,y+79,72,22,C.orange);
    });
    if(s.upgrades.lamp){
      const lamp=this.ui.container(p,310,184,200,110,'upgraded-inspection-lamp');const g=lamp.addComponent<Graphics>(Graphics);
      g.strokeColor=new Color('#7F9EA5');g.lineWidth=9;g.moveTo(0,-80);g.lineTo(40,-14);g.lineTo(122,-14);g.stroke();
      g.fillColor=new Color('#263E4B');g.roundRect(107,-34,80,35,8);g.fill();g.fillColor=new Color(C.cyan);g.roundRect(113,-34,68,8,2);g.fill();
      g.fillColor=new Color('#6EE0DE14');g.moveTo(114,-34);g.lineTo(75,-365);g.lineTo(315,-365);g.lineTo(180,-34);g.close();g.fill();
      this.ui.statusChip(p,'变焦灯 / 已升级',312,296,187,27,C.cyan);
    }
  }
  private ending():void{
    const p=this.ui.techPanel(this.content,280,177,1040,560,'回环九号 / 经营回顾',C.orange),s=this.state;
    this.text(p,s.outcome||'这一段航程，已经留在档案里。',35,83,970,65,36,C.cyan,'center');
    this.text(p,`经营 ${s.day} 天 · 完成 ${s.completedTrades.length} 笔钱货交易\n履约 ${s.orders.filter(o=>o.status==='done').length} 张订单 · 期末现金 ${s.cash} Cr\n站务关注 ${s.risk} / 100 · 货物和每笔流水均可导出回看`,90,195,860,150,25,C.text,'center');
    this.button(p,'导出经营档案',100,405,390,61,()=>this.exportSave(),{tone:'quiet'});
    this.button(p,'重新开店',550,405,390,61,()=>this.navigate('settings'),{tone:'gold'});
  }
  private negotiation():void{
    const t=this.state.trade!;const it=t.item||(t.selectedUid?findItem(this.state,t.selectedUid):undefined);if(!it)return;
    const bounds=offerBounds(this.state,t,it),relevant=it.evidence.filter(id=>getDef(it.defId).tools.includes(id));
    // Customer side: what they said, what they want and how much patience is left.
    const npc=getNpc(t.npcId),speech=this.speechBox(this.content,36,168,392,330,npc.name,npc.title);
    const speechLabel=this.ui.label(speech,t.line,26,34,340,120,{size:19,lineHeight:29,color:'#F2ECDD',wrap:true,overflow:'clamp'}).getComponent<Label>(Label)!;
    this.presentation.speak(speechLabel,t.line,`${t.id}:${t.line}`);speech.on(Node.EventType.TOUCH_END,()=>this.presentation.reveal());this.ui.bindPointer(speech,{cursor:'pointer'});
    this.ui.line(speech,26,166,366,166,'#E0A16C40',1);
    this.row(speech,t.kind==='sell'?'采购需求':'供货人态度',26,180,200,24,15,C.orange);
    this.ui.label(speech,t.kind==='sell'?customerNeed(t.npcId):'实物估价，心里有底价。\n拿出相关物证，可以支持合理还价。',26,210,340,62,{size:16,lineHeight:24,color:C.text,wrap:true,overflow:'clamp'});
    this.row(speech,'耐心',26,280,60,30,15,C.muted);
    const left=3-t.rounds,pips=this.ui.container(speech,84,284,140,22,'patience-pips').addComponent<Graphics>(Graphics);
    for(let i=0;i<3;i++){pips.fillColor=new Color(i<left?(left===1?'#E07B5A':'#F0A55E'):'#2C3A40');pips.roundRect(i*44,-20,36,16,4);pips.fill();}
    this.ui.label(speech,`${left}/3`,236,280,60,30,{size:18,mono:true,color:left===1?C.danger:C.orange,verticalAlign:'center',wrap:false});
    // Negotiation desk: price read-out, nudge keys, evidence tickets, submit key.
    const p=this.ui.texturePanel(this.content,452,628,688,170,{skin:'socket',name:'negotiation-console'});
    const quote=this.ui.screen(p,18,18,236,88,'quote-evidence-target');
    this.ui.label(quote,t.locked?'已议定':'我的还价',16,8,200,20,{size:14,color:'#86E6DF',glow:'#3FC9C170',verticalAlign:'center',wrap:false});
    if(t.locked){
      this.ui.label(quote,`${t.price}`,16,28,160,52,{size:40,mono:true,color:'#FFCB8E',glow:'#FF9A4AAA',verticalAlign:'center',wrap:false});
      this.ui.label(quote,'Cr',170,40,50,34,{size:20,mono:true,color:'#FFCB8E',align:'right',verticalAlign:'center',wrap:false});
      this.ui.hudIcon(p,'lock',284,30,52,52);
      this.text(p,'价格已锁定。\n在右侧终端确认钱货交割。',350,26,320,80,19,C.text);
      this.row(p,getDef(it.defId).name,284,120,386,32,16,C.muted);
      return;
    }
    const editNode=this.ui.container(quote,10,26,170,56,'native-price-input');
    const priceSize=40*(this.prefs.largeText?1.06:1);
    const priceLabel=this.ui.label(editNode,String(this.offer),0,0,170,56,{size:priceSize,lineHeight:priceSize,mono:true,color:'#FFCB8E',glow:'#FF9A4AAA',align:'center',verticalAlign:'center',wrap:false}).getComponent<Label>(Label)!;
    this.ui.bindPointer(editNode,{cursor:'text',disabled:()=>this.busy});
    // Configure before onLoad: an active EditBox creates a multiline DOM field
    // with its default ANY mode before inputMode can be assigned.
    editNode.active=false;
    const edit=editNode.addComponent<EditBox>(EditBox);edit.textLabel=priceLabel;edit.inputMode=EditBox.InputMode.NUMERIC;edit.returnType=EditBox.KeyboardReturnType.DONE;edit.maxLength=7;edit.string=String(this.offer);
    edit.maxLength=5;editNode.active=true;
    // EditBox.textLabel resets the native label to TOP; restore the intended single-line alignment afterwards.
    priceLabel.verticalAlign=Label.VerticalAlign.CENTER;priceLabel.lineHeight=priceSize;priceLabel.enableWrapText=false;
    this.ui.label(quote,'Cr',178,40,46,34,{size:20,mono:true,color:'#FFCB8E',glow:'#FF9A4A80',align:'right',verticalAlign:'center',wrap:false});
    let submit:Node|null=null;
    const updateSubmit=()=>{
      if(!submit?.isValid)return;
      const valid=this.offer>=bounds.min&&this.offer<=bounds.max;
      const text=valid?`提出 ${this.offer} Cr`:bounds.max<1?'现金不足，先送客':`可填 1–${bounds.max} Cr`;
      const label=submit.getComponentsInChildren<Label>(Label)[0];if(label)label.string=text;
      submit.name=`button-${text}`;this.ui.setButtonEnabled(submit,t.rounds<3&&valid&&this.state.ap>=1);
    };
    const changed=()=>{const value=edit.string.replace(/[\r\n]/g,'');if(value!==edit.string)edit.string=value;const n=Number(value);this.offer=Number.isSafeInteger(n)&&n>0?n:0;updateSubmit();};
    editNode.on(EditBox.EventType.TEXT_CHANGED,changed);editNode.on(EditBox.EventType.EDITING_DID_ENDED,changed);
    quote.on(Node.EventType.MOUSE_WHEEL,(e:EventMouse)=>{const delta=e.getScrollY();if(this.busy||delta===0)return;this.offer=Math.max(1,Math.min(bounds.max,this.offer+(delta>0?10:-10)));edit.string=String(this.offer);updateSubmit();});
    const minus=this.button(p,'',18,114,112,42,()=>{this.offer=Math.max(1,this.offer-10);edit.string=String(this.offer);updateSubmit();},{tone:'quiet',name:'button-−10'});
    this.ui.attachIcon(minus,'minus',22,-22);this.ui.label(minus.getChildByName('tech-button-surface')||minus,'10',58,0,44,42,{size:18,mono:true,color:'#ECE7DA',verticalAlign:'center',wrap:false});
    const plus=this.button(p,'',142,114,112,42,()=>{this.offer=Math.min(bounds.max,this.offer+10);edit.string=String(this.offer);updateSubmit();},{tone:'quiet',name:'button-＋10'});
    this.ui.attachIcon(plus,'plus',22,-22);this.ui.label(plus.getChildByName('tech-button-surface')||plus,'10',58,0,44,42,{size:18,mono:true,color:'#ECE7DA',verticalAlign:'center',wrap:false});
    this.row(p,'物证小票 · 拖到报价屏',274,18,250,24,14,C.muted);
    this.row(p,getDef(it.defId).name,470,18,200,24,14,C.text,'right');
    relevant.slice(0,3).forEach((id,i)=>{
      const chosen=this.chosenEvidence===id;
      const card=this.ui.paperSlip(p,274+i*134,48,124,58,{name:`evidence-card-${id}`,torn:true,angle:chosen?0:(i-1)*1.5});
      this.ui.toolIcon(card,id,6,6,40,40);
      this.ui.label(card,getTool(id).short,48,4,70,44,{size:16,bold:true,color:chosen?INK.rust:INK.text,verticalAlign:'center',wrap:false});
      if(chosen){const g=this.ui.container(card,0,0,124,58,'evidence-chosen-rim').addComponent<Graphics>(Graphics);g.strokeColor=new Color('#C0582A');g.lineWidth=3;g.rect(1.5,-50.5,121,49);g.stroke();}
      this.drag(card,()=>{this.chosenEvidence=id;this.render();},e=>{if(quote.getComponent<UITransform>(UITransform)!.hitTest(e.getLocation())){this.chosenEvidence=id;this.render();}else this.ui.toast('把物证小票放到报价屏上。');});
    });
    if(!relevant.length)this.ui.label(p,'还没有相关物证。\n先去鉴定台取得这件实物的痕迹。',274,46,396,62,{size:16,lineHeight:24,color:C.muted,wrap:true});
    submit=this.button(p,`提出 ${this.offer} Cr`,274,114,282,42,()=>this.dispatch({type:'OFFER',price:this.offer,evidence:this.chosenEvidence}),{tone:'gold',disabled:t.rounds>=3,size:18});
    updateSubmit();
    this.ui.label(p,`第 ${Math.min(3,t.rounds+1)}/3 轮`,566,114,104,42,{size:16,mono:false,color:C.muted,align:'center',verticalAlign:'center',wrap:false});
  }
  private pawnContract():void{
    const t=this.state.trade;if(!t)return;
    const it=t.item;if(!it)return;const a=estimate(it),principal=Math.floor((a.low+a.high)/2*.4);
    const m=this.ui.modal('抵押保管合同',{width:900,height:540});
    this.ui.item(m.body,it.defId,20,20,235,220);
    this.text(m.body,`本金 ${principal} Cr\n3 日赎期 + 1 日宽限\n服务费 8% · 本金与费用分开记账\n保管期间不得出售、维修或拆解`,285,23,510,190,24);
    this.button(m.body,'签署并支付本金',285,269,450,59,()=>{m.close();this.dispatch({type:'PAWN',tradeId:t.id});},{tone:'gold'});
  }
  private inspection():void{
    const p=this.content,it=this.currentItem();if(!it){this.text(p,'先从柜台或仓库选择一件实物。',400,350,800,80,32,C.text,'center');return;}this.selected=it.uid;
    if(this.poseUid!==it.uid)this.resetInspection(it.uid);
    const def=getDef(it.defId),draft=this.draft();
    const left=this.ui.container(p,32,152,148,616,'inspection-tools');
    this.row(left,'鉴定仪器',0,-30,148,25,13,C.muted);
    tools.forEach((t,i)=>{
      const button=this.button(left,'',0,i*94,148,80,()=>{this.tool=t.id;this.render();},{selected:this.tool===t.id,tone:'quiet',name:`tool-target-${t.id}`});
      this.ui.toolIcon(button,t.id,8,10,58,58);this.row(button,t.short,77,15,65,28,17,this.tool===t.id?C.text:C.muted);this.row(button,it.evidence.includes(t.id)?'已存证':'待取证',77,44,65,22,11,it.evidence.includes(t.id)?C.green:C.muted);
    });
    const head=this.ui.texturePanel(p,206,104,Math.min(560,Math.max(300,def.name.length*34+150)),78,{skin:'strip',name:'inspection-title-plate'});
    this.ui.label(head,def.name,22,8,520,40,{size:30,bold:true,color:'#F6EBD4',verticalAlign:'center',wrap:false,outline:'#05080B',outlineWidth:2});
    this.row(head,this.back?'背面结构':'正面观察',24,48,300,22,14,C.cyan);
    const viewport=this.ui.container(p,INSPECTION_AREA.x,INSPECTION_AREA.y,INSPECTION_AREA.width,INSPECTION_AREA.height,'inspection-viewport');
    viewport.addComponent<Mask>(Mask).type=Mask.Type.GRAPHICS_RECT;
    this.inspectionShadow=this.ui.container(viewport,0,0,1,1,'inspection-object-shadow');this.inspectionShadow.addComponent<Graphics>(Graphics);
    const obj=this.ui.container(viewport,this.pose.x-INSPECTION_AREA.x,this.pose.y-INSPECTION_AREA.y,404,404,'InspectionObject');
    obj.getComponent<UITransform>(UITransform)!.setAnchorPoint(.5,.5);this.object=obj;
    const inspectionArt=this.ui.object(obj,it.defId,-202,-202,404,404,{back:this.back,damaged:it.condition<.75&&!it.repaired,repaired:it.repaired});inspectionArt.name='inspection-item-art';
    const hit=getItemHitBounds(it.defId,this.back,404),transform=obj.getComponent<UITransform>(UITransform)!;
    transform.setContentSize(hit.width,hit.height);transform.setAnchorPoint(-hit.x/hit.width,1+hit.y/hit.height);
    this.ui.bindDraggable(obj,()=>!this.busy);
    let pointerStart=new Vec2(),poseStart={x:0,y:0},dragged=false,tracking=false;
    obj.on(Node.EventType.TOUCH_START,(e:EventTouch)=>{
      if(this.busy)return;
      for(let n=e.target as Node|null;n&&n!==obj;n=n.parent)if((n as unknown as {__action?:()=>void}).__action)return;
      pointerStart=e.getUILocation().clone();poseStart={x:this.pose.x,y:this.pose.y};dragged=false;tracking=true;this.pointerCleanup=releaseObject;
      this.objectDragging=true;this.inspectionFx?.grab(true);this.applyInspectionPose();
    });
    obj.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{
      if(this.busy||!tracking)return;const pointer=e.getUILocation();dragged=dragged||Vec2.distance(pointerStart,pointer)>6;if(!dragged)return;
      this.objectDragging=true;this.pose.x=poseStart.x+pointer.x-pointerStart.x;this.pose.y=poseStart.y-pointer.y+pointerStart.y;this.applyInspectionPose();
    });
    const releaseObject=()=>{tracking=false;this.pointerCleanup=null;this.objectDragging=false;this.inspectionFx?.grab(false);this.applyInspectionPose();};
    obj.on(Node.EventType.TOUCH_END,releaseObject);obj.on(Node.EventType.TOUCH_CANCEL,releaseObject);
    obj.on(Node.EventType.MOUSE_WHEEL,(e:EventMouse)=>{const delta=e.getScrollY();if(!this.busy&&delta!==0)this.changeZoom(delta>0?.08:-.08);});
    this.applyInspectionPose();
    this.inspectionFx??=new InspectionFeedback(this.ui);this.inspectionFx.reducedMotion=this.prefs.reducedMotion;this.inspectionFx.bind(p,inspectionArt,this.inspectionShadow);
    this.zoomOut=this.button(p,'−',420,654,48,40,()=>this.changeZoom(-.1),{tone:'quiet'});
    this.zoomIn=this.button(p,'＋',476,654,48,40,()=>this.changeZoom(.1),{tone:'quiet'});
    this.button(p,'旋转 R',540,654,120,40,()=>{this.pose.angle+=30;this.applyInspectionPose();},{tone:'quiet',size:16});
    this.button(p,this.back?'翻回正面 F':'翻到背面 F',668,654,152,40,()=>{this.back=!this.back;this.render();},{tone:'quiet',size:16});
    this.button(p,'实物归位',828,654,122,40,()=>{this.resetInspection(it.uid);this.render();},{tone:'quiet',size:16});
    this.scaleLabel=this.ui.label(p,'',966,654,98,40,{size:13,color:C.muted,align:'center',verticalAlign:'center',wrap:false}).getComponent<Label>(Label)!;this.updateZoomControls();
    this.toolInteraction(p,it,draft);
    const side=this.ui.texturePanel(p,1252,112,316,680,{skin:'socket',name:'evidence-book'});
    this.ui.label(side,'物证册',24,18,268,34,{size:24,bold:true,color:'#F6EBD4',verticalAlign:'center',wrap:false});
    const a=estimate(it),est=this.ui.screen(side,18,60,280,104,'estimate-screen');
    this.ui.label(est,'参考估值',16,10,140,20,{size:14,color:'#86E6DF',glow:'#3FC9C170',verticalAlign:'center',wrap:false});
    this.ui.label(est,`${it.evidence.length}/6 物证`,140,10,124,20,{size:14,mono:true,color:'#86E6DF',align:'right',verticalAlign:'center',wrap:false});
    this.ui.label(est,`${a.exact?a.low:`${a.low}–${a.high}`} Cr`,16,36,252,52,{size:32,mono:true,color:'#FFCB8E',glow:'#FF9A4AAA',verticalAlign:'center',wrap:false,overflow:'shrink'});
    tools.forEach((t,i)=>this.ui.panel(side,24+i*46,187,38,4,{fill:it.evidence.includes(t.id)?C.cyan:'#405253',lineWidth:0,radius:2}));
    it.evidence.slice(-3).forEach((tool,i)=>{
      this.ui.toolIcon(side,tool,24,220+i*99,35,35);this.row(side,getTool(tool).name,71,220+i*99,221,25,16,C.text);
      this.ui.label(side,getItemClue(it,tool),24,253+i*99,268,46,{size:14,lineHeight:21,color:C.muted,overflow:'clamp'});
      if(i<2)this.ui.line(side,24,308+i*99,292,308+i*99,'#D2CAB323');
    });
    if(!it.evidence.length){this.ui.toolIcon(side,this.tool,88,241,140,140);this.row(side,'从一处痕迹开始',24,403,268,32,21,C.text,'center');this.ui.label(side,`选择左侧仪器，按照桌边提示操作。
外观、材料与功能，都会留下证据。`,24,454,268,67,{size:15,lineHeight:24,color:C.muted,align:'center',overflow:'clamp'});}
    if(it.evidence.length>3)this.button(side,'查看全部物证',24,537,268,36,()=>this.allEvidence(it),{tone:'quiet',size:14});
    else this.row(side,it.inspectedPaid?'本件后续取证免费':'首次鉴定消耗 1 AP',24,540,268,27,13,C.muted,'center');
    this.button(side,'保存证据 · 返回柜台',24,594,268,52,()=>this.navigate('counter'),{tone:'gold',size:18});
  }
  private allEvidence(it:OrbitalItem):void{
    const m=this.ui.modal('完整物证记录',{width:940,height:720}),def=getDef(it.defId);
    it.evidence.forEach((tool,i)=>{this.row(m.body,getTool(tool).name,18,5+i*85,840,27,20,C.cyan);this.ui.label(m.body,getItemClue(it,tool),18,36+i*85,840,47,{size:17,lineHeight:24,color:C.text,overflow:'clamp'});});
  }

  private draft():Draft{const key=this.selected+'/'+this.tool;let d=this.drafts.get(key);if(!d){d={marks:new Set(),uv:0,peaks:[.1,.1,.1],probe:0,tared:false,weights:new Set(),load:0};this.drafts.set(key,d);}return d;}
  updateInspectionFeedback(dt:number):void{this.inspectionFx?.update(dt);}
  disposeInspectionFeedback():void{this.inspectionFx?.clear();this.inspectionFx=null;}
  private resetInspection(uid=this.selected):void{this.inspectionFx?.clear();this.poseUid=uid;this.pose={...INSPECTION_HOME};this.zoom=1;this.back=false;this.object=null;this.objectDragging=false;}
  private inspectionLocalBounds():InspectionRect{const it=this.currentItem();return it?getItemHitBounds(it.defId,this.back,404):INSPECTION_LOCAL;}
  private inspectionPlacement(){return constrain({...this.pose,zoom:this.zoom},this.inspectionLocalBounds(),INSPECTION_AREA,{minZoom:.45,maxZoom:1.35,padding:8,defaults:{...INSPECTION_HOME,zoom:1}});}
  private inspectionEffectRect(){return this.inspectionPlacement().aabb;}
  private applyInspectionPose():void{
    const fit=this.inspectionPlacement();this.pose={x:fit.pose.x,y:fit.pose.y,angle:fit.pose.angle};this.zoom=fit.pose.zoom;
    if(this.object?.isValid){this.object.setPosition(this.pose.x-INSPECTION_AREA.x,-(this.pose.y-INSPECTION_AREA.y));this.object.angle=this.pose.angle;this.object.setScale(fit.pose.zoom,fit.pose.zoom,1);}
    if(this.inspectionShadow?.isValid){const {aabb}=fit,g=this.inspectionShadow.getComponent<Graphics>(Graphics)!;const radius=Math.min(aabb.width*.36,210)*(this.objectDragging?.72:1);this.inspectionShadow.setPosition(aabb.x+aabb.width/2-INSPECTION_AREA.x,-Math.min(INSPECTION_AREA.height-10,aabb.y+aabb.height-INSPECTION_AREA.y-9));g.clear();g.fillColor=new Color(this.objectDragging?'#02080B29':'#02080B61');g.ellipse(0,0,radius,Math.max(5,Math.min(13,radius*.06)));g.fill();}
    this.updateZoomControls();
  }
  private updateZoomControls():void{
    const max=constrain({...this.pose,zoom:1.35},this.inspectionLocalBounds(),INSPECTION_AREA,{minZoom:.45,maxZoom:1.35,padding:8}).pose.zoom;
    for(const [node,enabled]of [[this.zoomIn,this.zoom<max-.005],[this.zoomOut,this.zoom>.455]] as const)if(node?.isValid){this.ui.setButtonEnabled(node,enabled);Object.assign(node,{__enabled:enabled});}
    if(this.scaleLabel?.isValid)this.scaleLabel.string=`${this.zoom.toFixed(1)}×`;
  }
  private changeZoom(n:number):void{this.zoom=Math.max(.45,Math.min(1.35,this.zoom+n));this.applyInspectionPose();}
  private finishTool(it:OrbitalItem):void{
    const tool=this.tool,point=this.object&&this.inspectionFx?this.inspectionFx.point(this.object):{x:this.pose.x,y:this.pose.y},had=it.evidence.includes(tool);
    this.dispatch({type:'CHECK',uid:it.uid,tool});
    if(!had&&findItem(this.state,it.uid)?.evidence.includes(tool))this.inspectionFx?.contact(point,C.cyan,{x:1295+tools.findIndex(t=>t.id===tool)*46,y:305});
  }
  private toolInteraction(p:Node,it:OrbitalItem,d:Draft):void{
    const already=it.evidence.includes(this.tool),tool=getTool(this.tool);
    const widget=this.ui.texturePanel(p,212,706,1008,90,{skin:'strip',materialOpacity:.32,fill:'#0A151CF5',stroke:'#6D8F8B70',lineWidth:1,radius:3,name:'instrument-readout'});
    this.ui.line(widget,0,12,0,78,this.tool==='TOL-002'?C.purple:this.tool==='TOL-006'?C.orange:C.cyan,3);
    this.text(widget,this.tool==='TOL-001'?'侧光观察 / 点击三处接缝疑点，逐一记录痕迹。':tool.instruction,18,3,972,27,15,C.muted);
    if(already){
      if(this.tool==='TOL-004')this.probeInteraction(widget,d,true);
      this.baseline(widget,'✓ 证据已保存 · 可以免费复测',18,66,620,20,C.cyan);this.button(widget,'复测读数',795,38,194,42,()=>this.effect(['magnify','uv','spectrum','probe','scale','pulse'][tools.findIndex(t=>t.id===this.tool)],p,this.inspectionEffectRect()),{tone:'quiet'});return;
    }
    if(this.tool==='TOL-001'){
      const spots=[[.28,.34],[.68,.47],[.5,.73]];
      spots.forEach(([x,y],i)=>{
        let n:Node;const found=d.marks.has(i);n=this.button(this.object!,'',404*(x-.5)-22.5,404*(y-.5)-22.5,45,45,()=>{const at=this.inspectionFx?.point(n);d.marks.add(i);if(d.marks.size===3)this.finishTool(it);else this.render();if(at)this.inspectionFx?.contact(at,C.orange);},{tone:'quiet',disabled:found,name:`evidence-spot-${i+1}`});
        n.children[0].active=false;const g=this.ui.container(n,0,0,45,45,'side-light-reticle').addComponent<Graphics>(Graphics);
        g.fillColor=new Color(found?'#11252BCC':'#10232BEF');g.circle(22.5,-22.5,18);g.fill();g.lineWidth=1.7;g.strokeColor=new Color(found?C.green:C.orange);
        for(const [x,y,dx,dy]of [[5,-5,1,-1],[40,-5,-1,-1],[5,-40,1,1],[40,-40,-1,1]]){g.moveTo(x+dx*8,y);g.lineTo(x,y);g.lineTo(x,y+dy*8);g.stroke();}
        this.row(n,found?'✓':String(i+1),0,0,45,45,found?22:17,found?C.green:C.orange,'center');

      });
      this.baseline(widget,`点击实物上的三处侧光疑点  ${d.marks.size}/3`,18,66,960,20,C.cyan);
    }else if(this.tool==='TOL-002'){
      this.inspectionFx?.uv(this.object!,()=>d.uv,()=>this.back);
      const track=this.ui.panel(widget,22,52,572,20,{fill:'#242038',stroke:C.purple,radius:4});
      const slider=this.ui.panel(track,d.uv*520,-10,51,40,{fill:'#9A81CC',stroke:'#E0C8FC',radius:3,name:'UVScanner'});this.row(slider,'UV',0,0,51,40,17,C.background,'center');
      let scanStart=0,scanValue=0,scanning=false;this.ui.bindDraggable(slider,()=>!this.busy&&this.back);
      slider.on(Node.EventType.TOUCH_START,(e:EventTouch)=>{scanStart=e.getUILocation().x;scanValue=d.uv;scanning=true;this.pointerCleanup=()=>{scanning=false;};});
      slider.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{if(this.busy||!this.back||!scanning)return;d.uv=Math.max(0,Math.min(1,scanValue+(e.getUILocation().x-scanStart)/520));slider.setPosition(d.uv*520,10);});
      const finishScan=(e:EventTouch)=>{if(!scanning)return;scanning=false;this.pointerCleanup=null;if(e.getEventCode()!==Input.EventType.TOUCH_END)return;if(!this.back){this.ui.toast('先翻到背面，再扫描旧编号。');return;}if(d.uv>.85)this.finishTool(it);else this.render();};slider.on(Node.EventType.TOUCH_END,finishScan);slider.on(Node.EventType.TOUCH_CANCEL,finishScan);
      this.button(widget,this.back?'扫描旧编号':'先翻至背面',795,38,194,43,()=>{if(!this.back){this.back=true;this.render();}else{d.uv=Math.min(1,d.uv+.34);if(d.uv>.85)this.finishTool(it);else this.render();}},{tone:'green'});
      if(this.back)this.text(this.object!,getItemMark(it),-155,58,310,32,19,C.purple,'center');
    }else if(this.tool==='TOL-003'){
      const targets=[.25,.55,.75];
      targets.forEach((target,i)=>{
        const base=18+i*204;this.baseline(widget,['青峰','橙峰','紫峰'][i],base,72,52,17,[C.cyan,C.orange,C.purple][i]);
        this.button(widget,'−',base+56,45,40,39,()=>{d.peaks[i]=Math.max(0,d.peaks[i]-.1);this.render();},{tone:'quiet',name:`spectrum-${i}-minus`});
        this.baseline(widget,`${d.peaks[i].toFixed(1)}`,base+102,72,49,17,C.text,'center');
        this.button(widget,'＋',base+153,45,40,39,()=>{d.peaks[i]=Math.min(1,d.peaks[i]+.1);this.render();},{tone:'quiet',name:`spectrum-${i}-plus`});
        const g=this.ui.container(this.object!,-195+i*130,-130,120,250,'spectrum-peak').addComponent<Graphics>(Graphics);g.strokeColor=new Color([C.cyan,C.orange,C.purple][i]);g.lineWidth=3;g.moveTo(0,-210);g.lineTo(32,-210);g.lineTo(65,-210+target*180);g.lineTo(98,-210);g.lineTo(130,-210);g.stroke();g.strokeColor=new Color('#FFFFFF66');g.moveTo(0,-210);g.lineTo(32,-210);g.lineTo(65,-210+d.peaks[i]*180);g.lineTo(98,-210);g.lineTo(130,-210);g.stroke();
      });
      this.button(widget,'固定谱线',795,38,194,42,()=>this.finishTool(it),{disabled:!targets.every((n,i)=>Math.abs(d.peaks[i]-n)<.07)});
    }else if(this.tool==='TOL-004'){
      this.probeInteraction(widget,d);
      this.button(widget,'读取回路',795,38,194,42,()=>this.finishTool(it),{disabled:d.probe!==3});
    }else if(this.tool==='TOL-005'){
      const target=[30,60,70][getDef(it.defId).sprite%3],sum=[...d.weights].reduce((a,n)=>a+n,0);
      this.baseline(widget,d.tared?`参考质量 ${target}g / 砝码 ${sum}g`:'先将空秤校零，再把砝码放上秤盘',18,74,392,20,C.cyan);
      if(!d.tared)this.button(widget,'空秤校零',795,38,194,42,()=>{d.tared=true;this.render();});
      else{
        [10,20,50].forEach((n,i)=>this.button(widget,`${d.weights.has(n)?'✓ ':''}${n}g`,419+i*85,46,77,40,()=>{if(d.weights.has(n))d.weights.delete(n);else d.weights.add(n);this.render();},{tone:d.weights.has(n)?'green':'quiet'}));
        this.button(widget,'平衡采证',795,38,194,42,()=>this.finishTool(it),{disabled:sum!==target});
      }
      const scale=this.ui.container(p,554,479,400,79,'balance-instrument');const g=scale.addComponent<Graphics>(Graphics);g.lineWidth=4;g.strokeColor=new Color(C.cyan);g.moveTo(200,0);g.lineTo(200,-73);g.moveTo(110,-73);g.lineTo(290,-73);g.stroke();const tilt=Math.max(-18,Math.min(18,(sum-target)*.4));g.moveTo(30,-20+tilt);g.lineTo(370,-20-tilt);g.stroke();g.strokeColor=new Color(C.orange);g.roundRect(25,-43+tilt,90,21,4);g.stroke();g.roundRect(285,-43-tilt,90,21,4);g.stroke();
    }else{
      this.baseline(widget,`负载 ${Math.round(d.load*100)}% / 安全采样区 65–85%`,18,74,400,20,C.cyan);
      const track=this.ui.panel(widget,427,60,200,6,{fill:'#284B56',lineWidth:0});const knob=this.ui.panel(track,d.load*180,-14,22,33,{fill:C.orange,lineWidth:0,radius:3,name:'pulse-load'});
      let loadStart=0,loadValue=0,loading=false;this.ui.bindDraggable(knob,()=>!this.busy);
      knob.on(Node.EventType.TOUCH_START,(e:EventTouch)=>{loadStart=e.getUILocation().x;loadValue=d.load;loading=true;this.pointerCleanup=()=>{loading=false;};});
      knob.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{if(this.busy||!loading)return;d.load=Math.max(0,Math.min(1,loadValue+(e.getUILocation().x-loadStart)/180));knob.setPosition(d.load*180,14);});const finishLoad=(e:EventTouch)=>{if(!loading)return;loading=false;this.pointerCleanup=null;if(e.getEventCode()===Input.EventType.TOUCH_END)this.render();};knob.on(Node.EventType.TOUCH_END,finishLoad);knob.on(Node.EventType.TOUCH_CANCEL,finishLoad);
      this.button(widget,'增载',643,46,70,40,()=>{d.load=Math.min(1,d.load+.15);this.render();},{tone:'quiet',size:18});
      this.button(widget,'通电采样',795,38,194,42,()=>this.finishTool(it),{disabled:d.load<.65||d.load>.85,size:17});
    }
  }
  private probeInteraction(widget:Node,d:Draft,readOnly=false):void {
    if(!this.object||!this.inspectionFx)return;
    for(let i=0;i<2;i++){
      const color=i===0?C.orange:C.cyan,connected=()=>readOnly||!!(d.probe&(1<<i));
      const port=this.ui.panel(this.object,-135+i*220,40,55,55,{fill:'#0B1922D9',stroke:color,radius:12,name:`probe-port-${i}`});
      this.row(port,connected()?'●':i===0?'+':'−',0,0,55,55,connected()?24:29,connected()?C.green:color,'center');
      if(readOnly){
        this.inspectionFx.cable(()=>this.inspectionFx!.point(widget,55+i*250,0),()=>this.inspectionFx!.point(port),()=>true,color);continue;
      }
      const plug=this.ui.panel(widget,23+i*250,47,64,39,{fill:i===0?'#71503A':'#234C53',stroke:color,radius:5,name:`probe-plug-${i}`});
      this.ui.line(plug,7,7,57,7,'#D8D8C487',1);this.row(plug,i===0?'+':'−',0,0,64,39,28,C.text,'center');
      const origin=this.inspectionFx.point(plug);
      this.inspectionFx.cable(()=>origin,()=>this.inspectionFx!.point(connected()?port:plug),connected,color);
      this.drag(plug,()=>this.ui.toast(i===0?'将正极探针拖到实物的橙色端口。':'将负极探针拖到实物的青色端口。'),e=>{
        if(port.getComponent<UITransform>(UITransform)!.hitTest(e.getLocation())){
          const at=this.inspectionFx!.point(port);d.probe|=1<<i;this.render();this.inspectionFx?.contact(at,color);
        }
      },()=>this.inspectionFx?.refresh());
      this.baseline(widget,connected()?'已插接':i===0?'拖向正极':'拖向负极',98+i*250,74,140,19,connected()?C.cyan:C.muted);
    }
  }
  private drag(node:Node,click:()=>void,drop:(event:EventTouch)=>void,onMove?:()=>void):void{
    let origin=new Vec3(),start=new Vec3(),moved=false,tracking=false,index=0;
    const local=(e:EventTouch)=>{const u=e.getUILocation();return node.parent!.getComponent<UITransform>(UITransform)!.convertToNodeSpaceAR(new Vec3(u.x-W/2,u.y-H/2,0));};
    this.ui.bindDraggable(node,()=>!this.busy);
    const restore=()=>{if(node.isValid){node.setPosition(origin);node.setSiblingIndex(index);}tracking=false;this.pointerCleanup=null;onMove?.();};
    node.on(Node.EventType.TOUCH_START,(e:EventTouch)=>{if(this.busy)return;origin=node.position.clone();start=local(e);moved=false;tracking=true;index=node.getSiblingIndex();this.pointerCleanup=restore;node.setSiblingIndex(node.parent!.children.length-1);});
    node.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{if(this.busy||!tracking)return;const p=local(e),dx=p.x-start.x,dy=p.y-start.y;moved=moved||Math.hypot(dx,dy)>6;if(moved)node.setPosition(origin.x+dx,origin.y+dy);onMove?.();});
    const finish=(e:EventTouch)=>{if(!tracking)return;restore();if(!this.busy&&e.getEventCode()===Input.EventType.TOUCH_END){if(moved)drop(e);else click();}};
    node.on(Node.EventType.TOUCH_END,finish);node.on(Node.EventType.TOUCH_CANCEL,finish);
  }
  private confirmClosing():void{
    const m=this.ui.modal('结束今天的营业',{width:900,height:520});
    this.text(m.body,`剩余 ${this.state.ap} AP · 现金 ${this.state.cash} Cr\n能源维护 20 Cr${this.state.day%7===0?'，本日租金450 Cr':''}\n未完成的订单与保管货物会延续至次日。`,45,35,740,160,28);
    this.button(m.body,'继续营业',45,260,330,55,()=>m.close(),{tone:'quiet'});
    this.button(m.body,'打烊并结算',405,260,330,55,()=>{m.close();this.dispatch({type:'SETTLE'});},{tone:'gold'});
  }
  private controls():{name:string;x:number;y:number;w:number;h:number}[]{
    return this.all(this.ui.root).filter(n=>n.activeInHierarchy&&(n as unknown as {__action?:()=>void}).__action).map(n=>{
      // UITransform.getBoundingBoxToWorld also includes decorative children such as long rules.
      // Report the button's own touch rectangle, rather than their combined visual bounds.
      const t=n.getComponent<UITransform>(UITransform)!,{width,height}=t.contentSize,a=t.anchorPoint;
      const lo=t.convertToWorldSpaceAR(new Vec3(-a.x*width,-a.y*height)),hi=t.convertToWorldSpaceAR(new Vec3((1-a.x)*width,(1-a.y)*height));
      return{name:n.name,x:lo.x+W/2,y:H/2-hi.y,w:hi.x-lo.x,h:hi.y-lo.y};
    });
  }
  private all(n:Node):Node[]{return[n,...n.children.flatMap(x=>this.all(x))];}
  private onKey(e:EventKeyboard):void{
    if(typeof document!=='undefined'&&['INPUT','TEXTAREA'].includes(document.activeElement?.tagName||''))return;
    if(this.busy){if(e.keyCode===KeyCode.SPACE||e.keyCode===KeyCode.ESCAPE)this.skip();return;}
    const dialog=this.ui.root.children.filter(n=>n.name==='modal-overlay'&&n.active).pop();
    const modal=dialog||(this.titleScreen?.isValid?this.titleScreen:undefined);
    if(!dialog&&modal&&e.keyCode===KeyCode.ESCAPE)return;
    if(modal&&this.focused&&!this.all(modal).includes(this.focused)){this.focus=-1;this.focused=null;}
    if(e.keyCode===KeyCode.TAB){const btns=this.all(modal||this.ui.root).filter(n=>(n as unknown as {__enabled?:boolean}).__enabled);if(btns.length){this.focus=(this.focus+1)%btns.length;this.focused=btns[this.focus];this.ui.focusButton(this.focused);}return;}
    if((e.keyCode===KeyCode.ENTER||e.keyCode===KeyCode.SPACE)&&this.focused?.isValid&&(!modal||this.all(modal).includes(this.focused))){(this.focused as unknown as {__action:()=>void}).__action();return;}
    if(e.keyCode===KeyCode.ESCAPE){
      if(this.panels.closeModal()){this.focus=-1;this.focused=null;return;}
      const modal=this.ui.root.children.filter(n=>n.name==='modal-overlay').pop();if(modal){this.ui.clear(modal);modal.removeFromParent();modal.destroy();this.focus=-1;this.focused=null;return;}
      this.navigate(this.page==='counter'?'settings':'counter');return;
    }
    if(modal)return;
    if(this.page==='inspect'){
      if(e.keyCode===KeyCode.KEY_F){this.back=!this.back;this.render();}
      if(e.keyCode===KeyCode.KEY_R&&this.object){this.pose.angle+=30;this.applyInspectionPose();}
      if(e.keyCode>=KeyCode.DIGIT_1&&e.keyCode<=KeyCode.DIGIT_6){this.tool=tools[e.keyCode-KeyCode.DIGIT_1].id;this.render();}
      const d:Record<number,[number,number]>={[KeyCode.ARROW_LEFT]:[-12,0],[KeyCode.ARROW_RIGHT]:[12,0],[KeyCode.ARROW_UP]:[0,12],[KeyCode.ARROW_DOWN]:[0,-12]};const shift=d[e.keyCode];if(shift&&this.object){this.pose.x+=shift[0];this.pose.y-=shift[1];this.applyInspectionPose();}
    }
  }
  private async loadAudio():Promise<void>{
    await Promise.all(['click','coin','check','page','drop','open','reject','ambient_loop'].map(async key=>{try{
      const clip=await new Promise<AudioClip>((resolve,reject)=>{if((window as unknown as {__GREYLINE_WEB__?:boolean}).__GREYLINE_WEB__)assetManager.loadRemote<AudioClip>(`./resources/audio/${key}.wav`,(e,v)=>e?reject(e):resolve(v));else resources.load<AudioClip>(`audio/${key}`,AudioClip,(e,v)=>e?reject(e):resolve(v));});
      if(!this.disposed)this.clips.set(key,clip);
    }catch{}}));
  }
  private sound(key:string):void{
    if(!this.prefs.sound||this.disposed)return;
    const clip=this.clips.get(key);if(clip)this.audio.playOneShot(clip,key==='drop'?.42:.3);
    // Start the station bed from a real player gesture, respecting browser audio policy.
    const ambient=this.clips.get('ambient_loop');
    if(ambient){if(!this.ambience){this.ambience=this.node.addComponent<AudioSource>(AudioSource);this.ambience.clip=ambient;this.ambience.loop=true;this.ambience.volume=.075;}if(!this.ambience.playing)this.ambience.play();}
  }
  update(dt:number):void{this.motion?.update(dt);this.panels?.update(dt);this.presentation.update(dt);this.updateInspectionFeedback(dt);}
  onDestroy():void{this.cancelPointer();this.pointerCanvas?.removeEventListener('pointerleave',this.cancelPointer);this.pointerCanvas?.removeEventListener('mouseleave',this.cancelPointer);window.removeEventListener('blur',this.cancelPointer);window.removeEventListener('pointercancel',this.cancelPointer);window.removeEventListener('resize',this.cancelPointer);this.disposed=true;this.ambience?.stop();this.presentation.dispose();this.disposeInspectionFeedback();this.motion?.dispose();this.panels?.dispose();input.off(Input.EventType.KEY_DOWN,this.onKey,this);}
}
