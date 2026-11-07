import {Component,Node,Canvas,Camera,UITransform,Layers,Color,Vec2,Vec3,Rect,Size,SpriteFrame,Graphics,Mask,Label,EditBox,UIOpacity,EventTouch,EventMouse,game,input,Input,EventKeyboard,KeyCode,view,ResolutionPolicy,sys,AudioSource,AudioClip,assetManager,resources} from 'cc';
import type {ButtonOptions} from '../ui/GameUI';
import {OrbitalUI,ORBITAL_PALETTE as C} from './OrbitalUI';
import {OrbitalMotion} from './OrbitalMotion';
import {OrbitalPanels} from './OrbitalPanels';
import {itemDefs,tools,orderDefs,npcs,getDef,getNpc,getTool} from './data';
import {createOrbital,reduceOrbital,findItem,estimate,serializeOrbital,parseOrbital} from './model';
import type {OrbitalAction,OrbitalItem,OrbitalPrefs,OrbitalState,PageId,ToolId} from './types';
import type {OrbitalHost} from './ui-types';
import {constrain,type InspectionRect} from './InspectionGeometry';
import {getItemHitBounds} from './ItemHitBounds';

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
  prefs:OrbitalPrefs={sound:false,reducedMotion:false,largeText:false};
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
  private objectDragging=false;
  private focus=-1;
  private focused:Node|null=null;
  private epoch=0;
  private skipNode:Node|null=null;
  private saveFailed=false;
  private audio!:AudioSource;
  private clips=new Map<string,AudioClip>();
  private disposed=false;
  private counterForeground:SpriteFrame|null=null;
  private pointerCleanup:(()=>void)|null=null;
  private pointerCanvas:HTMLCanvasElement|null=null;
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
    const debug={engine:'Cocos Creator 3.8.8',version:'orbital-p0-v9',snapshot:()=>JSON.parse(JSON.stringify(this.state)),controls:()=>this.controls(),diagnostics:()=>({page:this.page,busy:this.busy,tool:this.tool,back:this.back,zoom:this.zoom,selected:this.selected,motion:this.motion.snapshot(),moods:this.ui.getMoodDiagnostics(),object:this.object?{x:this.pose.x,y:this.pose.y,angle:this.object.angle,scale:this.object.scale.x,bounds:this.inspectionEffectRect()}:null}),dispatch:(a:OrbitalAction)=>this.dispatch(a),open:(p:PageId,uid?:string)=>this.navigate(p,uid),reset:(seed='ORBITAL-TUTORIAL')=>{this.skip();this.state=createOrbital(seed);this.selected=this.state.inventory[0]?.uid||'';this.page='counter';this.resetInspection(this.selected);this.drafts.clear();this.save();this.render();},click:(name:string)=>{const n=this.all(this.ui.root).find(x=>x.name===name);const fn=(n as unknown as {__action?:()=>void})?.__action;if(fn){fn();return true;}return false;}};
    (window as unknown as {__ORBITAL__:typeof debug;__GREYLINE__:typeof debug}).__ORBITAL__=debug;(window as unknown as {__GREYLINE__:typeof debug}).__GREYLINE__=debug;
    document.dispatchEvent(new CustomEvent('greyline-ready'));
    void this.play(()=>this.motion.sceneEntry());
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
    this.state=reduceOrbital(before,action);this.save();
    if(action.type==='ARRIVE'&&this.state.trade){this.selected=this.state.trade.item?.uid||this.selected;this.offer=this.state.trade.price;this.chosenEvidence=undefined;this.page='counter';this.resetInspection(this.selected);}
    if(action.type==='SELECT_TRADE'){this.selected=action.uid;this.offer=this.state.trade?.price||0;this.chosenEvidence=undefined;this.page='trade';}
    if(action.type==='CRAFT'){const product=this.state.inventory.find(i=>!before.inventory.some(old=>old.uid===i.uid));if(product){this.selected=product.uid;this.resetInspection(product.uid);}}
    if(before.trade&&!this.state.trade&&['DELIVER','REFUSE','PAWN'].includes(action.type))this.page='counter';
    if(action.type==='SETTLE'&&(this.state.phase==='report'||this.state.phase==='ending'))this.page='report';
    if(action.type==='NEXT'&&this.state.day!==before.day){this.page='counter';this.chosenEvidence=undefined;this.drafts.clear();}
    this.sound(action.type==='DELIVER'||action.type==='DELIVER_ORDER'?'coin':action.type==='CHECK'?'check':'click');
    if(action.type==='REFUSE'&&before.trade)this.ui.setMood(before.trade.npcId,'reject');
    if(action.type==='DELIVER'&&before.trade)this.ui.setMood(before.trade.npcId,'happy');
    this.render();
    const after=this.state;
    if(action.type==='ARRIVE'&&after.trade&&!before.trade){
      const actor=this.actor,it=after.trade.item;this.setCounterVisible(false);
      void this.play(async active=>{if(actor)await this.motion.enter(actor);if(active()&&it)await this.motion.handoff(it.defId,{x:675,y:450},{x:900,y:556},()=>{if(active())this.setCounterVisible(true);},316);if(active())this.setCounterVisible(true);});
    }else if(action.type==='DELIVER'&&before.trade&&!after.trade&&after.completedTrades.includes(before.trade.id)){
      void this.play(async active=>{await this.motion.deal(after.cash-before.cash,oldItem?.defId);if(active())await this.motion.exit(before.trade!.npcId);});
    }else if(action.type==='REFUSE'&&before.trade&&!after.trade){void this.play(()=>this.motion.exit(before.trade!.npcId));}
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
  effect(kind:string,parent:Node,at?:{x:number;y:number;width?:number;height?:number}):void{if(this.busy)return;void this.play(()=>this.motion.effect(kind,parent,at));}
  private async play(run:(active:()=>boolean)=>Promise<void>):Promise<void>{
    const epoch=++this.epoch;this.busy=true;this.ui.pointer.refresh();this.motion.configure({reducedMotion:this.prefs.reducedMotion});
    this.skipNode?.destroy();this.skipNode=this.ui.container(this.ui.root,1210,780,350,22,'skip-animation');
    this.row(this.skipNode,'空格快进 · 结果不会重复结算',0,0,350,22,11,C.muted,'right');this.skipNode.on(Node.EventType.TOUCH_END,()=>this.skip());
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
    const image=this.page==='inspect'||this.page==='repair'?'orbital-workbench':this.page==='warehouse'?'orbital-warehouse':'orbital-counter';
    this.ui.image(this.shell,image,0,0,W,H,{fit:'cover'});
    if(this.page!=='counter'&&this.page!=='trade')this.ui.panel(this.shell,0,106,W,692,{fill:'#07101940',lineWidth:0,radius:0});
    this.content=this.ui.container(this.shell,0,0,W,H,`page-${this.page}`);this.panels.setPage(this.page);
    if(this.state.phase==='ending'&&this.page!=='settings')this.ending();
    else if(this.page==='counter'||this.page==='trade')this.counter();
    else if(this.page==='inspect')this.inspection();
    else this.panels.draw(this.page,this.content);
    const pageContent=this.content;this.chrome=this.ui.container(this.ui.root,0,0,W,H,'persistent-chrome');this.content=this.chrome;this.header();this.footer();for(const n of [...this.dialogueNodes,...this.counterTags])if(n.isValid)n.setParent(this.chrome);this.content=pageContent;
    this.motion.bindAmbient({parent:this.content,actor:this.actor||undefined,area:{x:310,y:160,width:860,height:500}});
  }
  private header():void{
    const s=this.state,p=this.ui.panel(this.content,32,24,1536,56,{fill:'#0A141CEB',stroke:'#A0B0AA35',radius:5,name:'instrument-header'});
    const logo=this.ui.container(p,17,10,39,36,'shop-orbit-mark').addComponent<Graphics>(Graphics);logo.lineWidth=1.3;logo.strokeColor=new Color(C.orange);logo.ellipse(17,-18,17,8);logo.stroke();logo.strokeColor=new Color('#D8D1C0');logo.circle(17,-18,11);logo.stroke();logo.fillColor=new Color(C.orange);logo.circle(34,-17,3);logo.fill();
    this.row(p,'轨道旧货局',72,5,270,46,25,C.text);
    this.row(p,'回环九号 / 下层旧港',277,10,220,36,12,C.muted);
    this.row(p,'营业日',585,4,90,17,10,C.muted);this.row(p,`${String(s.day).padStart(2,'0')} / 21`,585,22,140,29,22,C.text);
    this.row(p,'行动',760,4,110,17,10,C.muted);this.row(p,`${s.ap} / 12 AP`,760,22,145,29,22,C.cyan);
    this.row(p,'可用现金',950,4,150,17,10,C.muted);this.row(p,`${s.cash.toFixed(s.cash%1?2:0)} Cr`,950,22,200,29,22,C.text);
    this.button(p,`站务 · ${s.risk}`,1194,8,155,40,()=>this.stationDetails(),{tone:'quiet',size:15});
    this.button(p,'设置',1370,8,144,40,()=>this.navigate('settings'),{tone:'quiet',size:15});
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
    const nav:[PageId,string][]=[['counter','柜台'],['inspect','鉴定'],['repair','维修'],['warehouse','仓储'],['orders','订单'],['report','日结']];
    const p=this.ui.panel(this.content,400,824,800,56,{fill:'#0A141CF5',stroke:'#A0B0AA40',radius:6,name:'navigation-dock'});
    nav.forEach(([page,title],i)=>this.button(p,`${String(i+1).padStart(2,'0')} ${title}`,8+i*132,6,124,44,()=>this.navigate(page),{tone:'quiet',selected:this.page===page,disabled:page==='inspect'&&!this.currentItem(),size:17}));
    this.row(this.content,this.saveFailed?'存档空间不足':'● 已保存',40,839,260,26,12,this.saveFailed?C.orange:C.muted);
    this.row(this.content,this.page==='inspect'?'拖动 · 滚轮缩放 · R 旋转 · F 翻面':'Esc 返回 · 空格快进动画',1230,839,330,26,11,C.muted,'right');
  }
  private currentItem():OrbitalItem|undefined{return findItem(this.state,this.selected)||this.state.trade?.item||this.state.inventory[0];}
  private counter():void{
    const p=this.content,s=this.state,t=s.trade,it=t?.item||(t?.selectedUid?findItem(s,t.selectedUid):undefined),npc=t?getNpc(t.npcId):getNpc(['CHR-004','CHR-002','CHR-005','CHR-003'][s.cursor%4]);
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
      if(!trading){const tag=this.ui.panel(p,752,730,296,34,{fill:'#0B171EDF',lineWidth:0,radius:3});this.row(tag,getDef(it.defId).name,10,0,276,34,17,C.text,'center');this.counterTags.push(tag);}
    }else if(t?.kind==='sell'){
      this.button(p,'打开仓库 · 为客人挑选旧物',704,620,408,52,()=>this.navigate('warehouse'),{tone:'gold',size:19});
    }
    this.counterLeft();
    const panel=this.ui.texturePanel(p,1172,464,360,300,{materialOpacity:.15,fill:'#0A141BF5',stroke:'#AE9B7748',lineWidth:1,radius:7,name:'counter-terminal'});
    if(t){
      this.row(panel,t.kind==='sell'?'采购商来访':t.kind==='pawn'?'抵押保管申请':'来客报价',24,18,312,23,14,C.muted);
      this.baseline(panel,`${t.price}`,24,100,228,48,C.text);this.baseline(panel,'Cr',278,100,56,20,C.orange);
      if(it){const a=estimate(it);this.row(panel,`估值 ${a.exact?a.low:`${a.low}–${a.high}`} Cr  ·  ${it.evidence.length} 项物证`,24,116,312,25,14,C.muted);}
      if(t.locked){
        this.button(panel,'确认钱货交割',24,160,312,52,()=>this.dispatch({type:'DELIVER',tradeId:t.id}),{tone:'gold',size:20});
        this.row(panel,'价格已锁定 · 交割后结算',24,234,312,28,14,C.muted,'center');
      }else{
        this.button(panel,'拿起实物 · 鉴定',24,160,312,52,()=>it&&this.navigate('inspect',it.uid),{tone:this.page==='trade'?'quiet':'gold',disabled:!it,size:20});
        this.button(panel,this.page==='trade'?'接受当前报价':'商量报价',24,230,198,42,()=>this.page==='trade'?this.dispatch({type:'ACCEPT'}):this.navigate('trade'),{tone:'quiet',disabled:!it,size:17});
        this.button(panel,'更多',234,230,102,42,()=>this.tradeActions(),{tone:'quiet',size:16});
      }
    }else{
      this.row(panel,'今日营业中',24,21,312,36,25,C.text);this.row(panel,`下一位 / ${npc.name}`,24,78,312,27,17,C.muted);
      this.button(panel,'接待下一位来客',24,150,312,54,()=>this.dispatch({type:'ARRIVE'}),{tone:'gold',disabled:s.phase!=='open'||s.ap<1,size:20});
      this.button(panel,'整理后仓',24,230,312,42,()=>this.navigate('warehouse'),{tone:'quiet',size:16});
    }
    if(this.page==='trade'&&t)this.negotiation();
    else{
      const line=t?t.line:s.notice||'回环九号下层港，旧货局今日开门。';
      const dialogue=this.ui.dialogueFrame(p,48,650,560,134);
      this.row(dialogue,t?`${npc.name}  /  ${npc.title}`:'营业广播',22,14,516,28,20,C.orange);
      this.ui.label(dialogue,line,22,52,516,66,{size:18,lineHeight:27,color:C.text,wrap:true,overflow:'clamp'});this.dialogueNodes.push(dialogue);
    }
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
  private counterLeft():void{
    const active=this.state.orders.filter(o=>o.status==='active').length;
    this.button(this.content,`订单夹 · ${active}`,48,116,180,42,()=>this.navigate('orders'),{tone:'quiet',size:17});
  }
  private negotiation():void{
    const t=this.state.trade!;const it=t.item||(t.selectedUid?findItem(this.state,t.selectedUid):undefined);if(!it)return;
    const p=this.ui.texturePanel(this.content,288,642,852,152,{skin:'strip',materialOpacity:.50,fill:'#0A151DF2',stroke:'#AE9B7748',lineWidth:1,radius:5,name:'negotiation-console'});
    this.row(p,getDef(it.defId).name,568,8,265,24,15,C.text,'right');
    if(t.locked){this.baseline(p,'已议定报价',22,38,200,15,C.muted);this.baseline(p,`${t.price} Cr`,22,96,250,34,C.text);this.row(p,'价格已锁定，等待右侧钱货交割。',278,36,550,52,19,C.text);return;}
    this.row(p,'我的还价',20,7,235,24,15,C.muted);
    const quote=this.ui.panel(p,20,36,235,53,{fill:'#243039',stroke:'#DB8A5288',radius:5,name:'quote-evidence-target'});
    const editNode=this.ui.container(quote,8,0,173,53,'native-price-input');
    const priceSize=34*(this.prefs.largeText?1.08:1),priceBaseline=53/2+.37*priceSize;
    const priceLabel=this.ui.label(editNode,String(this.offer),0,0,173,53,{size:priceSize,lineHeight:priceSize,color:C.orange,align:'center',verticalAlign:'center',wrap:false}).getComponent<Label>(Label)!;
    this.ui.bindPointer(editNode,{cursor:'text',disabled:()=>this.busy});
    // Configure before onLoad: an active EditBox creates a multiline DOM field
    // with its default ANY mode before inputMode can be assigned.
    editNode.active=false;
    const edit=editNode.addComponent<EditBox>(EditBox);edit.textLabel=priceLabel;edit.inputMode=EditBox.InputMode.NUMERIC;edit.returnType=EditBox.KeyboardReturnType.DONE;edit.maxLength=7;edit.string=String(this.offer);
    editNode.active=true;
    // EditBox.textLabel resets the native label to TOP; restore the intended single-line alignment afterwards.
    priceLabel.verticalAlign=Label.VerticalAlign.CENTER;priceLabel.lineHeight=priceSize;priceLabel.enableWrapText=false;
    let submit:Node|null=null;
    const updateSubmit=()=>{
      if(!submit?.isValid)return;
      const text=this.offer>0?`提出 ${this.offer} Cr`:'填写有效金额';
      const label=submit.getComponentsInChildren<Label>(Label)[0];if(label)label.string=text;
      submit.name=`button-${text}`;this.ui.setButtonEnabled(submit,t.rounds<3&&this.offer>0);
    };
    const changed=()=>{const value=edit.string.replace(/[\r\n]/g,'');if(value!==edit.string)edit.string=value;const n=Number(value);this.offer=Number.isSafeInteger(n)&&n>0?n:0;updateSubmit();};
    editNode.on(EditBox.EventType.TEXT_CHANGED,changed);editNode.on(EditBox.EventType.EDITING_DID_ENDED,changed);
    quote.on(Node.EventType.MOUSE_WHEEL,(e:EventMouse)=>{const delta=e.getScrollY();if(this.busy||delta===0)return;this.offer=Math.max(1,this.offer+(delta>0?10:-10));edit.string=String(this.offer);updateSubmit();});
    this.baseline(quote,'Cr',182,priceBaseline,45,20,C.orange);
    this.button(p,'−10',20,99,107,44,()=>{this.offer=Math.max(1,this.offer-10);edit.string=String(this.offer);updateSubmit();},{tone:'quiet',size:18});
    this.button(p,'＋10',147,99,107,44,()=>{this.offer+=10;edit.string=String(this.offer);updateSubmit();},{tone:'quiet',size:18});
    submit=this.button(p,`提出 ${this.offer} Cr`,568,99,265,44,()=>this.dispatch({type:'OFFER',price:this.offer,evidence:this.chosenEvidence}),{tone:'gold',disabled:t.rounds>=3,size:18});
    updateSubmit();
    this.row(p,'物证票据 / 拖到左侧支持还价',278,8,278,24,15,C.muted);
    it.evidence.slice(0,3).forEach((id,i)=>{
      const card=this.ui.statusChip(p,getTool(id).short,278+i*187,39,175,46,this.chosenEvidence===id?C.orange:C.cyan);card.name=`evidence-card-${id}`;
      this.drag(card,()=>{this.chosenEvidence=id;this.render();},e=>{if(quote.getComponent<UITransform>(UITransform)!.hitTest(e.getLocation())){this.chosenEvidence=id;this.render();}else this.ui.toast('把证据卡放到左侧报价票据旁。');});
    });
    if(!it.evidence.length)this.row(p,'尚无物证。先拿起实物，看看它留下的痕迹。',278,43,540,36,16,C.muted);
    this.row(p,`本次为第 ${Math.min(3,t.rounds+1)} 次还价 / 最多 3 次`,278,108,272,28,14,C.muted);
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
    this.ui.panel(p,212,102,420,84,{fill:'#0A141BA6',lineWidth:0,radius:4,name:'inspection-title-shade'});
    this.text(p,def.name,220,109,790,42,31,C.text);this.row(p,`${def.id}  /  ${this.back?'背面结构':'正面观察'}`,222,154,620,24,13,C.muted);
    const viewport=this.ui.container(p,INSPECTION_AREA.x,INSPECTION_AREA.y,INSPECTION_AREA.width,INSPECTION_AREA.height,'inspection-viewport');
    viewport.addComponent<Mask>(Mask).type=Mask.Type.GRAPHICS_RECT;
    this.inspectionShadow=this.ui.container(viewport,0,0,1,1,'inspection-object-shadow');this.inspectionShadow.addComponent<Graphics>(Graphics);
    const obj=this.ui.container(viewport,this.pose.x-INSPECTION_AREA.x,this.pose.y-INSPECTION_AREA.y,404,404,'InspectionObject');
    obj.getComponent<UITransform>(UITransform)!.setAnchorPoint(.5,.5);this.object=obj;
    this.ui.object(obj,it.defId,-202,-202,404,404,{back:this.back,damaged:it.condition<.75&&!it.repaired,repaired:it.repaired});
    const hit=getItemHitBounds(it.defId,this.back,404),transform=obj.getComponent<UITransform>(UITransform)!;
    transform.setContentSize(hit.width,hit.height);transform.setAnchorPoint(-hit.x/hit.width,1+hit.y/hit.height);
    this.ui.bindDraggable(obj,()=>!this.busy);
    let pointerStart=new Vec2(),poseStart={x:0,y:0},dragged=false,tracking=false;
    obj.on(Node.EventType.TOUCH_START,(e:EventTouch)=>{
      if(this.busy)return;
      for(let n=e.target as Node|null;n&&n!==obj;n=n.parent)if((n as unknown as {__action?:()=>void}).__action)return;
      pointerStart=e.getUILocation().clone();poseStart={x:this.pose.x,y:this.pose.y};dragged=false;tracking=true;this.pointerCleanup=releaseObject;
    });
    obj.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{
      if(this.busy||!tracking)return;const pointer=e.getUILocation();dragged=dragged||Vec2.distance(pointerStart,pointer)>6;if(!dragged)return;
      this.objectDragging=true;this.pose.x=poseStart.x+pointer.x-pointerStart.x;this.pose.y=poseStart.y-pointer.y+pointerStart.y;this.applyInspectionPose();
    });
    const releaseObject=()=>{tracking=false;this.pointerCleanup=null;this.objectDragging=false;this.applyInspectionPose();};
    obj.on(Node.EventType.TOUCH_END,releaseObject);obj.on(Node.EventType.TOUCH_CANCEL,releaseObject);
    obj.on(Node.EventType.MOUSE_WHEEL,(e:EventMouse)=>{const delta=e.getScrollY();if(!this.busy&&delta!==0)this.changeZoom(delta>0?.08:-.08);});
    this.applyInspectionPose();
    this.zoomOut=this.button(p,'−',420,654,48,40,()=>this.changeZoom(-.1),{tone:'quiet'});
    this.zoomIn=this.button(p,'＋',476,654,48,40,()=>this.changeZoom(.1),{tone:'quiet'});
    this.button(p,'旋转 R',540,654,120,40,()=>{this.pose.angle+=30;this.applyInspectionPose();},{tone:'quiet',size:16});
    this.button(p,this.back?'翻回正面 F':'翻到背面 F',668,654,152,40,()=>{this.back=!this.back;this.render();},{tone:'quiet',size:16});
    this.button(p,'实物归位',828,654,122,40,()=>{this.resetInspection(it.uid);this.render();},{tone:'quiet',size:16});
    this.scaleLabel=this.ui.label(p,'',966,654,98,40,{size:13,color:C.muted,align:'center',verticalAlign:'center',wrap:false}).getComponent<Label>(Label)!;this.updateZoomControls();
    this.toolInteraction(p,it,draft);
    const side=this.ui.texturePanel(p,1252,116,316,672,{materialOpacity:.12,fill:'#0B171EF5',stroke:'#AE9B7748',lineWidth:1,radius:6,name:'evidence-book'});
    this.row(side,'物证册',24,20,268,32,23,C.text);this.row(side,'APPRAISAL / FIELD NOTES',24,57,268,18,9,C.muted);
    const a=estimate(it);this.row(side,`${a.exact?a.low:`${a.low} – ${a.high}`} Cr`,24,92,268,47,34,C.text);
    this.row(side,`参考估值 · ${it.evidence.length} / 6 项物证`,24,147,268,23,13,C.muted);
    tools.forEach((t,i)=>this.ui.panel(side,24+i*46,187,38,4,{fill:it.evidence.includes(t.id)?C.cyan:'#405253',lineWidth:0,radius:2}));
    it.evidence.slice(-3).forEach((tool,i)=>{
      this.ui.toolIcon(side,tool,24,220+i*99,35,35);this.row(side,getTool(tool).name,71,220+i*99,221,25,16,C.text);
      this.ui.label(side,def.clues[tool]||'读数已记录，仍需交叉检验。',24,253+i*99,268,46,{size:14,lineHeight:21,color:C.muted,overflow:'clamp'});
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
    it.evidence.forEach((tool,i)=>{this.row(m.body,getTool(tool).name,18,5+i*85,840,27,20,C.cyan);this.ui.label(m.body,def.clues[tool]||'读数已记录，仍需交叉检验。',18,36+i*85,840,47,{size:17,lineHeight:24,color:C.text,overflow:'clamp'});});
  }

  private draft():Draft{const key=this.selected+'/'+this.tool;let d=this.drafts.get(key);if(!d){d={marks:new Set(),uv:0,peaks:[.1,.1,.1],probe:0,tared:false,weights:new Set(),load:0};this.drafts.set(key,d);}return d;}
  private resetInspection(uid=this.selected):void{this.poseUid=uid;this.pose={...INSPECTION_HOME};this.zoom=1;this.back=false;this.object=null;this.objectDragging=false;}
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
  private finishTool(it:OrbitalItem):void{this.dispatch({type:'CHECK',uid:it.uid,tool:this.tool});}
  private toolInteraction(p:Node,it:OrbitalItem,d:Draft):void{
    const already=it.evidence.includes(this.tool),tool=getTool(this.tool);
    const widget=this.ui.panel(p,212,706,1008,90,{fill:'#0A151CF5',lineWidth:0,radius:3,name:'instrument-readout'});
    this.text(widget,this.tool==='TOL-001'?'侧光观察 / 点击三处接缝疑点，逐一记录痕迹。':tool.instruction,18,3,972,27,15,C.muted);
    if(already){this.baseline(widget,'✓ 证据已保存 · 可以免费复测',18,66,620,20,C.cyan);this.button(widget,'复测读数',795,38,194,42,()=>this.effect(['magnify','uv','spectrum','probe','scale','pulse'][tools.findIndex(t=>t.id===this.tool)],p,this.inspectionEffectRect()),{tone:'quiet'});return;}
    if(this.tool==='TOL-001'){
      const spots=[[.28,.34],[.68,.47],[.5,.73]];
      spots.forEach(([x,y],i)=>{
        const found=d.marks.has(i),n=this.button(this.object!,'',404*(x-.5)-22.5,404*(y-.5)-22.5,45,45,()=>{d.marks.add(i);if(d.marks.size===3)this.finishTool(it);else this.render();},{tone:'quiet',disabled:found,name:`evidence-spot-${i+1}`});
        n.children[0].active=false;const g=this.ui.container(n,0,0,45,45,'side-light-reticle').addComponent<Graphics>(Graphics);
        g.fillColor=new Color(found?'#11252BCC':'#10232BEF');g.circle(22.5,-22.5,18);g.fill();g.lineWidth=1.7;g.strokeColor=new Color(found?C.green:C.orange);
        for(const [x,y,dx,dy]of [[5,-5,1,-1],[40,-5,-1,-1],[5,-40,1,1],[40,-40,-1,1]]){g.moveTo(x+dx*8,y);g.lineTo(x,y);g.lineTo(x,y+dy*8);g.stroke();}
        this.row(n,found?'✓':String(i+1),0,0,45,45,found?22:17,found?C.green:C.orange,'center');

      });
      this.baseline(widget,`点击实物上的三处侧光疑点  ${d.marks.size}/3`,18,66,960,20,C.cyan);
    }else if(this.tool==='TOL-002'){
      const track=this.ui.panel(widget,22,52,572,20,{fill:'#242038',stroke:C.purple,radius:4});
      const slider=this.ui.panel(track,d.uv*520,-10,51,40,{fill:'#9A81CC',stroke:'#E0C8FC',radius:3,name:'UVScanner'});this.row(slider,'UV',0,0,51,40,17,C.background,'center');
      let scanStart=0,scanValue=0,scanning=false;this.ui.bindDraggable(slider,()=>!this.busy&&this.back);
      slider.on(Node.EventType.TOUCH_START,(e:EventTouch)=>{scanStart=e.getUILocation().x;scanValue=d.uv;scanning=true;this.pointerCleanup=()=>{scanning=false;};});
      slider.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{if(this.busy||!this.back||!scanning)return;d.uv=Math.max(0,Math.min(1,scanValue+(e.getUILocation().x-scanStart)/520));slider.setPosition(d.uv*520,10);});
      const finishScan=(e:EventTouch)=>{if(!scanning)return;scanning=false;this.pointerCleanup=null;if(e.getEventCode()!==Input.EventType.TOUCH_END)return;if(!this.back){this.ui.toast('先翻到背面，再扫描旧编号。');return;}if(d.uv>.85)this.finishTool(it);else this.render();};slider.on(Node.EventType.TOUCH_END,finishScan);slider.on(Node.EventType.TOUCH_CANCEL,finishScan);
      this.button(widget,this.back?'扫描旧编号':'先翻至背面',795,38,194,43,()=>{if(!this.back){this.back=true;this.render();}else{d.uv=Math.min(1,d.uv+.34);if(d.uv>.85)this.finishTool(it);else this.render();}},{tone:'green'});
      if(this.back)this.text(this.object!,'旧编号  09 / 覆盖层',-155,58,310,32,19,C.purple,'center');
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
      for(let i=0;i<2;i++){
        const plug=this.ui.panel(widget,23+i*250,47,64,39,{fill:i===0?'#C17D48':'#2D7C80',stroke:i===0?C.orange:C.cyan,radius:5,name:`probe-plug-${i}`});this.row(plug,i===0?'+':'−',0,0,64,39,28,C.text,'center');
        const port=this.ui.panel(this.object!,-135+i*220,40,55,55,{fill:'#102C37',stroke:i===0?C.orange:C.cyan,radius:12,name:`probe-port-${i}`});this.row(port,d.probe&(1<<i)?'✓':'○',0,0,55,55,29,C.cyan,'center');
        this.drag(plug,()=>this.ui.toast(i===0?'将正极探针拖到实物的橙色端口。':'将负极探针拖到实物的青色端口。'),e=>{if(port.getComponent<UITransform>(UITransform)!.hitTest(e.getLocation())){d.probe|=1<<i;this.render();}});
        this.baseline(widget,d.probe&(1<<i)?'已连接':i===0?'拖向正极':'拖向负极',98+i*250,74,140,19,C.muted);
        if(d.probe&(1<<i)){this.ui.line(this.object!,-107.5+i*220,95,-107.5+i*220,132,i===0?C.orange:C.cyan,2);}
      }
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
  private drag(node:Node,click:()=>void,drop:(event:EventTouch)=>void):void{
    let origin=new Vec3(),start=new Vec3(),moved=false,tracking=false,index=0;
    const local=(e:EventTouch)=>{const u=e.getUILocation();return node.parent!.getComponent<UITransform>(UITransform)!.convertToNodeSpaceAR(new Vec3(u.x-W/2,u.y-H/2,0));};
    this.ui.bindDraggable(node,()=>!this.busy);
    const restore=()=>{if(node.isValid){node.setPosition(origin);node.setSiblingIndex(index);}tracking=false;this.pointerCleanup=null;};
    node.on(Node.EventType.TOUCH_START,(e:EventTouch)=>{if(this.busy)return;origin=node.position.clone();start=local(e);moved=false;tracking=true;index=node.getSiblingIndex();this.pointerCleanup=restore;node.setSiblingIndex(node.parent!.children.length-1);});
    node.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{if(this.busy||!tracking)return;const p=local(e),dx=p.x-start.x,dy=p.y-start.y;moved=moved||Math.hypot(dx,dy)>6;if(moved)node.setPosition(origin.x+dx,origin.y+dy);});
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
    return this.all(this.ui.root).filter(n=>(n as unknown as {__action?:()=>void}).__action).map(n=>{
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
    const modal=this.ui.root.children.filter(n=>n.name==='modal-overlay'&&n.active).pop();
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
  private async loadAudio():Promise<void>{for(const key of ['click','coin','check','page','drop'])try{const clip=await new Promise<AudioClip>((resolve,reject)=>{if((window as unknown as {__GREYLINE_WEB__?:boolean}).__GREYLINE_WEB__)assetManager.loadRemote<AudioClip>(`./resources/audio/${key}.wav`,(e,v)=>e?reject(e):resolve(v));else resources.load<AudioClip>(`audio/${key}`,AudioClip,(e,v)=>e?reject(e):resolve(v));});this.clips.set(key,clip);}catch{}}
  private sound(key:string):void{const clip=this.clips.get(key);if(this.prefs.sound&&clip)this.audio.playOneShot(clip,.35);}
  update(dt:number):void{this.motion?.update(dt);this.panels?.update(dt);}
  onDestroy():void{this.cancelPointer();this.pointerCanvas?.removeEventListener('pointerleave',this.cancelPointer);this.pointerCanvas?.removeEventListener('mouseleave',this.cancelPointer);window.removeEventListener('blur',this.cancelPointer);window.removeEventListener('pointercancel',this.cancelPointer);window.removeEventListener('resize',this.cancelPointer);this.disposed=true;this.motion?.dispose();this.panels?.dispose();input.off(Input.EventType.KEY_DOWN,this.onKey,this);}
}
