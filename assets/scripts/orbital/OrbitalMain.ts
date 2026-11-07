import {Component,Node,Canvas,Camera,UITransform,Layers,Color,Vec2,Vec3,Graphics,Label,EditBox,UIOpacity,EventTouch,EventMouse,input,Input,EventKeyboard,KeyCode,view,ResolutionPolicy,sys,AudioSource,AudioClip,assetManager,resources} from 'cc';
import type {ButtonOptions} from '../ui/GameUI';
import {OrbitalUI,ORBITAL_PALETTE as C} from './OrbitalUI';
import {OrbitalMotion} from './OrbitalMotion';
import {OrbitalPanels} from './OrbitalPanels';
import {itemDefs,tools,orderDefs,npcs,getDef,getNpc,getTool} from './data';
import {createOrbital,reduceOrbital,findItem,estimate,serializeOrbital,parseOrbital} from './model';
import type {OrbitalAction,OrbitalItem,OrbitalPrefs,OrbitalState,PageId,ToolId} from './types';
import type {OrbitalHost} from './ui-types';

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
  private motion!:OrbitalMotion;
  private panels!:OrbitalPanels;
  private page:PageId='counter';
  private tool:ToolId='TOL-001';
  private object:Node|null=null;
  private actor:Node|null=null;
  private counterObject:Node|null=null;
  private back=false;
  private zoom=1;
  private offer=0;
  private chosenEvidence:ToolId|undefined;
  private drafts=new Map<string,Draft>();
  private pose={x:430,y:225,angle:0};
  private focus=-1;
  private focused:Node|null=null;
  private epoch=0;
  private skipNode:Node|null=null;
  private saveFailed=false;
  private audio!:AudioSource;
  private clips=new Map<string,AudioClip>();
  private disposed=false;

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
    this.motion=new OrbitalMotion(this.ui,root);this.panels=new OrbitalPanels(this);this.render();
    input.on(Input.EventType.KEY_DOWN,this.onKey,this);void this.loadAudio();
    const debug={engine:'Cocos Creator 3.8.8',version:'orbital-p0-v3',snapshot:()=>JSON.parse(JSON.stringify(this.state)),controls:()=>this.controls(),diagnostics:()=>({page:this.page,busy:this.busy,tool:this.tool,back:this.back,zoom:this.zoom,selected:this.selected,motion:this.motion.snapshot(),moods:this.ui.getMoodDiagnostics(),object:this.object?{x:this.object.position.x,y:this.object.position.y,angle:this.object.angle}:null}),dispatch:(a:OrbitalAction)=>this.dispatch(a),open:(p:PageId,uid?:string)=>this.navigate(p,uid),reset:(seed='ORBITAL-TUTORIAL')=>{this.skip();this.state=createOrbital(seed);this.selected=this.state.inventory[0]?.uid||'';this.page='counter';this.drafts.clear();this.save();this.render();},click:(name:string)=>{const n=this.all(this.shell).find(x=>x.name===name);const fn=(n as unknown as {__action?:()=>void})?.__action;if(fn){fn();return true;}return false;}};
    (window as unknown as {__ORBITAL__:typeof debug;__GREYLINE__:typeof debug}).__ORBITAL__=debug;(window as unknown as {__GREYLINE__:typeof debug}).__GREYLINE__=debug;
    document.dispatchEvent(new CustomEvent('greyline-ready'));
    void this.play(()=>this.motion.sceneEntry());
  }
  private save():void{try{sys.localStorage.setItem(SAVE,serializeOrbital(this.state));this.saveFailed=false;}catch{this.saveFailed=true;}}
  savePrefs():void{try{sys.localStorage.setItem(PREFS,JSON.stringify(this.prefs));}catch{}this.motion.configure({reducedMotion:this.prefs.reducedMotion});this.render();}
  resetGame():void{this.skip();this.state=createOrbital();this.page='counter';this.selected=this.state.inventory[0]?.uid||'';this.drafts.clear();this.save();this.render();}
  exportSave():void{const url=URL.createObjectURL(new Blob([serializeOrbital(this.state)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download=`orbital-day-${this.state.day}.json`;a.click();URL.revokeObjectURL(url);this.ui.toast('经营档案已导出。');}
  select(uid:string):void{this.selected=uid;this.render();}
  navigate(page:PageId,uid?:string):void{
    if(this.busy)return;
    if(uid&&uid!==this.selected){this.selected=uid;this.back=false;this.zoom=1;this.pose={x:430,y:225,angle:0};}
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
    if(action.type==='ARRIVE'&&this.state.trade){this.selected=this.state.trade.item?.uid||this.selected;this.offer=this.state.trade.price;this.chosenEvidence=undefined;this.page='counter';this.back=false;this.zoom=1;this.pose={x:430,y:225,angle:0};}
    if(action.type==='SELECT_TRADE'){this.selected=action.uid;this.offer=this.state.trade?.price||0;this.chosenEvidence=undefined;this.page='trade';}
    if(action.type==='SETTLE'&&(this.state.phase==='report'||this.state.phase==='ending'))this.page='report';
    if(action.type==='NEXT'&&this.state.day!==before.day){this.page='counter';this.chosenEvidence=undefined;this.drafts.clear();}
    this.sound(action.type==='DELIVER'||action.type==='DELIVER_ORDER'?'coin':action.type==='CHECK'?'check':'click');
    if(action.type==='REFUSE'&&before.trade)this.ui.setMood(before.trade.npcId,'reject');
    if(action.type==='DELIVER'&&before.trade)this.ui.setMood(before.trade.npcId,'happy');
    this.render();
    const after=this.state;
    if(action.type==='ARRIVE'&&after.trade&&!before.trade){
      const actor=this.actor,obj=this.counterObject,it=after.trade.item;this.opacity(obj,0);
      void this.play(async active=>{if(actor)await this.motion.enter(actor);if(active()&&it)await this.motion.handoff(it.defId,{x:690,y:460},{x:800,y:565},()=>this.opacity(obj,255));this.opacity(obj,255);});
    }else if(action.type==='DELIVER'&&before.trade&&!after.trade&&after.completedTrades.includes(before.trade.id)){
      void this.play(async active=>{await this.motion.deal(after.cash-before.cash,oldItem?.defId);if(active())await this.motion.exit(before.trade!.npcId);});
    }else if(action.type==='REFUSE'&&before.trade&&!after.trade){void this.play(()=>this.motion.exit(before.trade!.npcId));}
    else if(action.type==='CHECK'&&after.ap<=before.ap&&findItem(after,action.uid)?.evidence.includes(action.tool)){
      const effect=['magnify','uv','spectrum','probe','scale','pulse'][tools.findIndex(t=>t.id===action.tool)];this.effect(effect,this.content,{x:370,y:200,width:700,height:390});
    }else if(action.type==='REPAIR'&&findItem(after,action.uid)?.repaired&&!findItem(before,action.uid)?.repaired)this.effect('repair',this.content,{x:480,y:260,width:500,height:350});
    else if(action.type==='CRAFT'&&after.inventory.length!==before.inventory.length)this.effect('assemble',this.content,{x:470,y:250,width:500,height:350});
    else if(action.type==='SCAN'&&after.scanned.length>before.scanned.length)this.effect('scan',this.content,{x:1060,y:220,width:280,height:430});
    else if(action.type==='SETTLE'&&after.phase==='report'&&before.phase!=='report')this.effect('day',this.content);
    else if(action.type==='NEXT'&&after.day!==before.day)this.effect('day',this.content);
    else if(action.type==='UPGRADE'&&!before.upgrades[action.id]&&after.upgrades[action.id])this.effect('upgrade',this.content);
    else if(action.type==='DELIVER_ORDER'&&after.cash!==before.cash)void this.play(()=>this.motion.deal(after.cash-before.cash));
    else if(action.type==='DISPLAY'||action.type==='MOVE'){
      const it=findItem(after,action.uid),prior=findItem(before,action.uid);
      if(it&&prior&&(it.x!==prior.x||it.y!==prior.y||it.location!==prior.location)){
        if(this.page==='warehouse')this.effect('stamp',this.content,{x:680,y:560,width:220,height:100});
      }else if(after.notice)this.ui.toast(after.notice);
    }else if(after.notice&&after.notice!==before.notice)this.ui.toast(after.notice);
  }
  effect(kind:string,parent:Node,at?:{x:number;y:number;width?:number;height?:number}):void{if(this.busy)return;void this.play(()=>this.motion.effect(kind,parent,at));}
  private async play(run:(active:()=>boolean)=>Promise<void>):Promise<void>{
    const epoch=++this.epoch;this.busy=true;this.motion.configure({reducedMotion:this.prefs.reducedMotion});
    this.skipNode?.destroy();this.skipNode=this.ui.container(this.ui.root,580,773,440,25,'skip-animation');
    this.text(this.skipNode,'空格快进 · 已提交的结果不会重复结算',0,0,440,25,15,C.muted,'center');this.skipNode.on(Node.EventType.TOUCH_END,()=>this.skip());
    try{await run(()=>epoch===this.epoch);}finally{if(epoch===this.epoch){this.busy=false;this.skipNode?.removeFromParent();this.skipNode?.destroy();this.skipNode=null;}this.opacity(this.counterObject,255);}
  }
  private skip():void{this.epoch++;this.motion?.finish();this.busy=false;this.skipNode?.removeFromParent();this.skipNode?.destroy();this.skipNode=null;this.opacity(this.counterObject,255);}
  private opacity(node:Node|null,value:number):void{if(node?.isValid)(node.getComponent<UIOpacity>(UIOpacity)||node.addComponent<UIOpacity>(UIOpacity)).opacity=value;}
  button(parent:Node,text:string,x:number,y:number,w:number,h:number,fn:()=>void,options:ButtonOptions={}):Node{
    const invoke=()=>{if(this.busy||options.disabled)return;this.sound('click');fn();};
    const n=this.ui.button(parent,text,x,y,w,h,invoke,{...options,size:(options.size||20)*(this.prefs.largeText?1.08:1)});
    Object.assign(n,{__action:invoke,__enabled:!options.disabled});return n;
  }
  private text(p:Node,t:string,x:number,y:number,w:number,h:number,size=21,color:string=C.text,align:'left'|'center'|'right'='left'):Node{return this.ui.label(p,t,x,y,w,h,{size:size*(this.prefs.largeText?1.08:1),color,align});}
  render():void{
    if(!this.ui||!this.motion)return;
    if(this.object?.isValid)this.pose={x:this.object.position.x,y:-this.object.position.y,angle:this.object.angle};
    this.ui.clear(this.shell);this.object=null;this.actor=null;this.counterObject=null;this.focused=null;
    this.ui.reducedMotion=this.prefs.reducedMotion;
    const image=this.page==='inspect'||this.page==='repair'?'orbital-workbench':this.page==='warehouse'?'orbital-warehouse':'orbital-counter';
    this.ui.image(this.shell,image,0,0,W,H,{fit:'cover'});
    if(this.page!=='counter'&&this.page!=='trade')this.ui.panel(this.shell,0,116,W,672,{fill:'#08131DD2',lineWidth:0,radius:0});
    this.content=this.ui.container(this.shell,0,0,W,H,`page-${this.page}`);this.header();this.panels.setPage(this.page);
    if(this.state.phase==='ending'&&this.page!=='settings')this.ending();
    else if(this.page==='counter'||this.page==='trade')this.counter();
    else if(this.page==='inspect')this.inspection();
    else this.panels.draw(this.page,this.content);
    this.footer();
    this.motion.bindAmbient({parent:this.content,actor:this.actor||undefined,area:{x:310,y:160,width:860,height:500}});
  }
  private header():void{
    const s=this.state;
    this.ui.panel(this.content,22,16,1556,96,{fill:'#0B1824F5',stroke:'#608594',radius:10});
    this.text(this.content,'轨道旧货局',43,31,290,40,32,C.cyan);
    this.text(this.content,'ORBITAL EXCHANGE  /  回环九号',45,77,310,20,12,C.muted);
    this.hud('经营日',String(s.day).padStart(2,'0')+' / 21',365,C.text);
    this.hud('行动点',`${s.ap} / 12 AP`,536,C.cyan);
    this.hud('可用现金',`${s.cash.toFixed(s.cash%1?2:0)} Cr`,727,C.cyan);
    this.hud('租金到期',`${7-((s.day-1)%7)}日 · ${Math.round(450*Math.pow(1.1,Math.floor((s.day-1)/7)))} Cr`,940,C.orange);
    this.hud('站务关注',`${s.risk} / 100`,1164,s.risk>=30?C.orange:C.purple);
    this.button(this.content,'设置',1430,40,125,48,()=>this.navigate('settings'),{tone:'quiet'});
  }
  private hud(title:string,value:string,x:number,color:string):void{this.text(this.content,title,x,29,204,25,15,C.muted);this.text(this.content,value,x,61,214,37,25,color);}
  private footer():void{
    const s=this.state;this.ui.panel(this.content,22,804,1556,77,{fill:'#0B1824F7',stroke:'#587F90',radius:9});
    const nav:[PageId,string][]=[['counter','柜台'],['inspect','鉴定'],['repair','维修'],['warehouse','仓储'],['orders','订单'],['report','日结']];
    nav.forEach(([p,t],i)=>this.button(this.content,`${String(i+1).padStart(2,'0')} ${t}`,38+i*152,820,138,46,()=>this.navigate(p),{tone:this.page===p?'green':'quiet',selected:this.page===p,disabled:p==='inspect'&&!this.currentItem()}));
    const active=s.orders.filter(o=>o.status==='active').length;
    this.text(this.content,`订单 ${active}    /    货物 ${s.inventory.length}    /    ${this.saveFailed?'存档空间不足':'● 自动存档'}`,985,823,440,26,16,C.muted);
    this.text(this.content,`${TITLES[this.page]}  ·  R旋转 / F翻面 / Esc返回`,985,852,540,20,12,C.muted);
  }
  private currentItem():OrbitalItem|undefined{return findItem(this.state,this.selected)||this.state.trade?.item||this.state.inventory[0];}
  private counter():void{
    const p=this.content,s=this.state,t=s.trade,it=t?.item||(t?.selectedUid?findItem(s,t.selectedUid):undefined),npc=t?getNpc(t.npcId):getNpc(['CHR-004','CHR-002','CHR-005','CHR-003'][s.cursor%4]);
    this.shopFixtures();
    this.ui.setMood(npc.id,t?(t.locked?'happy':t.rounds>=2?'reject':t.rounds>0?'question':it&&it.evidence.length>0?'focused':'neutral'):s.day>=3?'tired':'neutral');
    this.actor=this.ui.portrait(p,npc.id,500,180,360,540);
    this.ui.statusChip(p,t?npc.title:`下一位来客 · ${npc.name}`,477,139,410,34,t?C.cyan:C.orange);
    if(it){
      const trading=this.page==='trade',ix=trading?925:684,iy=trading?305:457;
      const sh=this.ui.container(p,ix,iy+193,230,20,'counter-shadow');const g=sh.addComponent<Graphics>(Graphics);g.fillColor=new Color('#030A0DBB');g.ellipse(115,-8,105,10);g.fill();
      this.counterObject=this.ui.object(p,it.defId,ix,iy,232,216,{damaged:it.condition<.75&&!it.repaired,repaired:it.repaired});
      this.counterObject.on(Node.EventType.TOUCH_END,()=>this.navigate('inspect',it.uid));
      this.ui.statusChip(p,getDef(it.defId).name,trading?894:626,trading?524:664,trading?296:350,31,C.text);
    }else if(t?.kind==='sell'){
      this.ui.panel(p,645,480,315,150,{fill:'#122B36DD',stroke:C.cyan,radius:8});this.text(p,'顾客正在寻找一件旧物',667,510,270,35,23,C.cyan,'center');
      this.button(p,'打开仓库挑选',674,559,252,46,()=>this.navigate('warehouse'),{tone:'gold'});
    }else{
      this.text(p,'把旧物的下一程，留在这里。',420,593,670,55,30,C.text,'center');
      this.button(p,'接待下一位来客',620,662,320,54,()=>this.dispatch({type:'ARRIVE'}),{tone:'gold',disabled:s.phase!=='open'||s.ap<1});
    }
    this.counterLeft();
    const panel=this.ui.techPanel(p,1230,132,348,642,t?'当前交易':'营业终端',C.cyan);
    if(t){
      this.text(panel,t.kind==='sell'?'顾客采购 / 推荐旧物':t.kind==='pawn'?'抵押保管申请':'收购报价',22,61,302,33,21,C.muted);
      this.text(panel,`${t.price} Cr`,22,111,302,59,43,C.orange);
      if(it){const a=estimate(it);this.text(panel,`估值 ${a.exact?a.low:`${a.low} – ${a.high}`} Cr`,22,185,302,37,22);this.text(panel,`已取得 ${it.evidence.length} 项证据`,22,234,302,30,18,C.muted);}
      this.ui.line(panel,22,282,326,282,'#5F809459');
      if(t.locked)this.button(panel,'确认钱货交割',22,313,302,60,()=>this.dispatch({type:'DELIVER',tradeId:t.id}),{tone:'gold'});
      else{
        this.button(panel,'拿起实物 · 鉴定',22,313,302,57,()=>it&&this.navigate('inspect',it.uid),{disabled:!it});
        this.button(panel,this.page==='trade'?'接受当前报价':'商量报价',22,384,302,57,()=>this.page==='trade'?this.dispatch({type:'ACCEPT'}):this.navigate('trade'),{tone:'gold',disabled:!it});
        this.button(panel,'礼貌拒绝',22,454,143,46,()=>this.dispatch({type:'REFUSE'}),{tone:'quiet'});
        this.button(panel,'抵押合同',180,454,144,46,()=>this.pawnContract(),{tone:'quiet',disabled:t.kind==='sell'||!it});
      }
      this.text(panel,`有效还价 ${t.rounds} / 3\n成交前不扣款；未知项目不会替你判真伪。`,22,535,302,76,17,C.muted);
    }else{
      this.text(panel,'营业准备就绪',22,73,302,40,26,C.cyan);
      this.text(panel,`今日可用 ${s.ap} 行动点\n鉴定包 1 AP · 每单交割 1 AP\n维修 1–2 AP · 浏览与翻面免费`,22,132,302,110,20,C.text);
      this.text(panel,`站务署 ${s.relations.station}\n拾荒互助会 ${s.relations.salvage}\n旧轨商盟 ${s.relations.merchant}`,22,279,302,115,21,C.muted);
      this.button(panel,'查看今日订单',22,444,302,54,()=>this.navigate('orders'));
      this.button(panel,'整理后仓与来源',22,510,302,54,()=>this.navigate('warehouse'),{tone:'quiet'});
    }
    if(this.page==='trade'&&t)this.negotiation();
    else{
      const line=t?t.line:s.notice||'回环九号下层港，旧货局今日开门。';
      this.ui.dialogueFrame(p,310,709,875,65);this.ui.label(p,`${t?npc.name:'营业广播'}  /  ${line}`,329,717,834,53,{size:20,lineHeight:26,color:C.text,overflow:'clamp'});
    }
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
      n.on(Node.EventType.TOUCH_END,()=>this.navigate('inspect',it.uid));
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
    const p=this.content,s=this.state,left=this.ui.techPanel(p,22,132,267,343,'今日订单',C.cyan);
    const os=s.orders.filter(o=>o.status==='active').slice(0,3);
    if(!os.length){this.text(left,'还没有接取订单。\n先查看公告，再决定\n保留或处理手里的货。',22,67,225,110,19,C.muted);this.button(left,'打开订单夹',22,226,220,47,()=>this.navigate('orders'),{tone:'quiet'});}
    os.forEach((o,i)=>{const d=orderDefs.find(x=>x.id===o.id);if(!d)return;this.ui.item(left,d.itemId,15,64+i*82,67,67);this.text(left,d.name,92,66+i*82,151,27,18);this.text(left,`${d.reward} Cr · 第${d.dueDay}天`,92,99+i*82,151,24,14,C.orange);});
    const radio=this.ui.techPanel(p,22,494,267,280,s.day===3?'站务预告':'站内广播',s.day===3?C.orange:C.purple);
    const news=s.day===1?'第一天 · 学会看见证据\n栗叔带来一台巡检蜂。\n取证后再决定报价。':s.day===2?'第二天 · 维修比碰运气稳\n澄九留下了委修终端。\n修好再交付，零件别装错。':'第三天 · 来源同样重要\n饶静预约了仓储核查。\n先扫描，再补证或隔离。';
    this.text(radio,news,22,63,225,152,19,C.text);
    this.ui.statusChip(radio,s.inspection==='cleared'?'本批核查已通过':s.day>=3?'预约核查 · 无实时倒计时':'每件鉴定包只扣一次AP',16,232,234,29,s.inspection==='cleared'?C.green:C.orange);
  }
  private negotiation():void{
    const t=this.state.trade!;const it=t.item||(t.selectedUid?findItem(this.state,t.selectedUid):undefined);if(!it)return;
    const p=this.ui.techPanel(this.content,310,559,875,215,'把证据放在报价旁',C.orange);
    const quote=this.ui.panel(p,23,62,235,65,{fill:'#243039',stroke:'#DB8A5288',radius:5,name:'quote-evidence-target'});
    const editNode=this.ui.container(quote,8,3,173,58,'native-price-input');
    const priceLabel=this.ui.label(editNode,String(this.offer),0,0,173,58,{size:40,color:C.orange,align:'center',verticalAlign:'center'}).getComponent<Label>(Label)!;
    const edit=editNode.addComponent<EditBox>(EditBox);edit.textLabel=priceLabel;edit.string=String(this.offer);edit.inputMode=EditBox.InputMode.NUMERIC;edit.maxLength=7;
    const changed=()=>{const n=Number(edit.string);this.offer=Number.isSafeInteger(n)&&n>0?n:0;};
    editNode.on(EditBox.EventType.TEXT_CHANGED,changed);editNode.on(EditBox.EventType.EDITING_DID_ENDED,changed);
    quote.on(Node.EventType.MOUSE_WHEEL,(e:EventMouse)=>{if(this.busy)return;this.offer=Math.max(1,this.offer+(e.getScrollY()>0?10:-10));edit.string=String(this.offer);});
    this.text(quote,'Cr',182,21,45,36,24,C.orange);
    this.button(p,'−10',23,142,105,45,()=>{this.offer=Math.max(1,this.offer-10);this.render();},{tone:'quiet'});
    this.button(p,'＋10',147,142,105,45,()=>{this.offer+=10;this.render();},{tone:'quiet'});
    this.button(p,'递上报价',627,142,222,45,()=>this.dispatch({type:'OFFER',price:this.offer,evidence:this.chosenEvidence}),{tone:'gold',disabled:t.rounds>=3});
    this.text(p,'拖动证据卡支持报价 · 右侧接受报价后再交割',278,66,570,29,17,C.muted);
    it.evidence.slice(0,3).forEach((id,i)=>{
      const card=this.ui.statusChip(p,getTool(id).short,280+i*187,105,175,40,this.chosenEvidence===id?C.orange:C.cyan);card.name=`evidence-card-${id}`;
      this.drag(card,()=>{this.chosenEvidence=id;this.render();},e=>{if(quote.getComponent<UITransform>(UITransform)!.hitTest(e.getLocation())){this.chosenEvidence=id;this.render();}else this.ui.toast('把证据卡放到左侧报价票据旁。');});
    });
    if(!it.evidence.length)this.text(p,'还没有物证。先去鉴定台看看实物。',282,109,540,45,20,C.muted);
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
    const def=getDef(it.defId),draft=this.draft();
    const left=this.ui.techPanel(p,22,132,268,642,'鉴定工具架');
    tools.forEach((t,i)=>{
      this.ui.toolIcon(left,t.id,16,60+i*84,50,53);
      this.button(left,`${t.short}${it.evidence.includes(t.id)?'  ✓':''}`,74,59+i*84,177,55,()=>{this.tool=t.id;this.render();},{selected:this.tool===t.id,tone:this.tool===t.id?'green':'quiet',size:17});
    });
    this.text(left,it.inspectedPaid?'该件后续取证免费':'鉴定包 1 AP · 工具不重复扣点',18,590,238,30,14,C.muted);
    this.ui.techPanel(p,310,132,875,642,`${def.id} / ${def.name}`,C.cyan);
    this.text(p,this.back?'背面 / 关键结构':'正面 / 外观观察',337,188,410,30,18,C.muted);
    const obj=this.ui.container(p,this.pose.x,this.pose.y,600,390,'InspectionObject');this.object=obj;obj.angle=this.pose.angle;obj.setScale(this.zoom,this.zoom,1);
    this.ui.object(obj,it.defId,66,10,468,362,{back:this.back,damaged:it.condition<.75&&!it.repaired,repaired:it.repaired});
    obj.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{if(this.busy)return;const d=e.getUIDelta();obj.setPosition(obj.position.x+d.x,obj.position.y+d.y);});
    const releaseObject=(e:EventTouch)=>{
      if(this.busy)return;
      const target=this.all(left).find(n=>n.name.startsWith('tool-target-')&&n.getComponent<UITransform>(UITransform)?.hitTest(e.getLocation()));
      if(target){this.tool=target.name.slice(12) as ToolId;obj.setPosition(430,-225);this.pose={x:430,y:225,angle:obj.angle};this.render();}
      else if(obj.isValid)obj.setPosition(Math.max(318,Math.min(620,obj.position.x)),Math.max(-350,Math.min(-175,obj.position.y)));
    };
    obj.on(Node.EventType.TOUCH_END,releaseObject);obj.on(Node.EventType.TOUCH_CANCEL,releaseObject);
    obj.on(Node.EventType.MOUSE_WHEEL,(e:EventMouse)=>{if(!this.busy){this.zoom=Math.max(.65,Math.min(1.35,this.zoom+(e.getScrollY()>0?.08:-.08)));obj.setScale(this.zoom,this.zoom,1);}});
    // The whole native button is the drop target; its art stays an independent child.
    for(const n of this.all(left)){if(n.name.startsWith('button-')){const t=tools.find(t=>n.name.includes(t.short));if(t)n.name=`tool-target-${t.id}`;}}
    this.button(p,'−',335,604,60,39,()=>this.changeZoom(-.1),{tone:'quiet'});
    this.button(p,'＋',405,604,60,39,()=>this.changeZoom(.1),{tone:'quiet'});
    this.button(p,'旋转 R',482,604,146,39,()=>{this.pose.angle+=30;if(this.object)this.object.angle=this.pose.angle;},{tone:'quiet'});
    this.button(p,this.back?'翻回正面 F':'翻到背面 F',642,604,192,39,()=>{this.back=!this.back;this.render();},{tone:'quiet'});
    this.button(p,'实物归位',851,604,142,39,()=>{this.object=null;this.zoom=1;this.pose={x:430,y:225,angle:0};this.render();},{tone:'quiet'});
    this.toolInteraction(p,it,draft);
    const side=this.ui.techPanel(p,1206,132,372,642,'证据与估值');
    const a=estimate(it);this.text(side,`${a.exact?a.low:`${a.low} – ${a.high}`} Cr`,21,63,330,53,32,C.orange);
    this.text(side,`证据 ${it.evidence.length} / 6 · 至少两条独立物证`,21,125,330,32,16,C.muted);
    it.evidence.slice(0,5).forEach((tool,i)=>{
      this.ui.statusChip(side,getTool(tool).name,20,175+i*68,331,27,C.cyan);
      this.text(side,def.clues[tool]||'读数已记录，仍需交叉检验。',23,206+i*68,324,34,15,C.muted);
    });
    if(!it.evidence.length)this.text(side,'从外观、材料与功能取得证据。\n工具读数不同，不能用外观\n替代来源或功能核验。',23,190,324,115,20,C.muted);
    this.button(side,'保存证据 · 返回柜台',21,568,330,51,()=>this.navigate('counter'),{tone:'gold'});
  }
  private draft():Draft{const key=this.selected+'/'+this.tool;let d=this.drafts.get(key);if(!d){d={marks:new Set(),uv:0,peaks:[.1,.1,.1],probe:0,tared:false,weights:new Set(),load:0};this.drafts.set(key,d);}return d;}
  private changeZoom(n:number):void{this.zoom=Math.max(.65,Math.min(1.35,this.zoom+n));this.object?.setScale(this.zoom,this.zoom,1);}
  private finishTool(it:OrbitalItem):void{this.dispatch({type:'CHECK',uid:it.uid,tool:this.tool});}
  private toolInteraction(p:Node,it:OrbitalItem,d:Draft):void{
    const already=it.evidence.includes(this.tool),tool=getTool(this.tool);
    const widget=this.ui.panel(p,329,656,838,100,{fill:'#0A1723F5',stroke:this.tool==='TOL-002'?C.purple:C.cyan,radius:6});
    this.text(widget,tool.instruction,15,9,809,29,17,C.muted);
    if(already){this.text(widget,'✓ 证据已保存 · 可以免费复测',16,54,505,29,22,C.cyan);this.button(widget,'复测读数',625,46,194,42,()=>this.effect(['magnify','uv','spectrum','probe','scale','pulse'][tools.findIndex(t=>t.id===this.tool)],p,{x:430,y:230,width:610,height:350}),{tone:'quiet'});return;}
    if(this.tool==='TOL-001'){
      const spots=[[.28,.34],[.68,.47],[.5,.73]];
      spots.forEach(([x,y],i)=>{const n=this.button(this.object!,d.marks.has(i)?'✓':'+',600*x,390*y,45,45,()=>{d.marks.add(i);if(d.marks.size===3)this.finishTool(it);else this.render();},{tone:'green',size:28,disabled:d.marks.has(i)});n.name=`evidence-spot-${i+1}`;});
      this.text(widget,`点击实物上的三处侧光疑点  ${d.marks.size}/3`,17,53,790,30,22,C.cyan);
    }else if(this.tool==='TOL-002'){
      const track=this.ui.panel(widget,22,52,572,20,{fill:'#242038',stroke:C.purple,radius:4});
      const slider=this.ui.panel(track,d.uv*520,-10,51,40,{fill:'#9A81CC',stroke:'#E0C8FC',radius:3,name:'UVScanner'});this.text(slider,'UV',0,7,51,30,17,C.background,'center');
      slider.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{if(this.busy||!this.back)return;d.uv=Math.max(0,Math.min(1,d.uv+e.getUIDelta().x/520));slider.setPosition(d.uv*520,10);});
      slider.on(Node.EventType.TOUCH_END,()=>{if(!this.back){this.ui.toast('先翻到背面，再扫描旧编号。');return;}if(d.uv>.85)this.finishTool(it);else this.render();});
      this.button(widget,this.back?'扫描旧编号':'先翻至背面',625,45,194,43,()=>{if(!this.back){this.back=true;this.render();}else{d.uv=Math.min(1,d.uv+.34);if(d.uv>.85)this.finishTool(it);else this.render();}},{tone:'green'});
      if(this.back)this.text(this.object!,'旧编号  09 / 覆盖层',155,225,310,32,19,C.purple,'center');
    }else if(this.tool==='TOL-003'){
      const targets=[.25,.55,.75];
      targets.forEach((target,i)=>{
        const base=18+i*204;this.text(widget,['青峰','橙峰','紫峰'][i],base,51,52,28,17,[C.cyan,C.orange,C.purple][i]);
        this.button(widget,'−',base+56,45,40,39,()=>{d.peaks[i]=Math.max(0,d.peaks[i]-.1);this.render();},{tone:'quiet',name:`spectrum-${i}-minus`});
        this.text(widget,`${d.peaks[i].toFixed(1)}`,base+102,53,49,26,17,C.text,'center');
        this.button(widget,'＋',base+153,45,40,39,()=>{d.peaks[i]=Math.min(1,d.peaks[i]+.1);this.render();},{tone:'quiet',name:`spectrum-${i}-plus`});
        const g=this.ui.container(p,474+i*142,260,130,250,'spectrum-peak').addComponent<Graphics>(Graphics);g.strokeColor=new Color([C.cyan,C.orange,C.purple][i]);g.lineWidth=3;g.moveTo(0,-210);g.lineTo(32,-210);g.lineTo(65,-210+target*180);g.lineTo(98,-210);g.lineTo(130,-210);g.stroke();g.strokeColor=new Color('#FFFFFF66');g.moveTo(0,-210);g.lineTo(32,-210);g.lineTo(65,-210+d.peaks[i]*180);g.lineTo(98,-210);g.lineTo(130,-210);g.stroke();
      });
      this.button(widget,'固定谱线',643,45,175,42,()=>this.finishTool(it),{disabled:!targets.every((n,i)=>Math.abs(d.peaks[i]-n)<.07)});
    }else if(this.tool==='TOL-004'){
      for(let i=0;i<2;i++){
        const plug=this.ui.panel(widget,23+i*250,47,64,39,{fill:i===0?'#C17D48':'#2D7C80',stroke:i===0?C.orange:C.cyan,radius:5,name:`probe-plug-${i}`});this.text(plug,i===0?'+':'−',0,1,64,37,28,C.text,'center');
        const port=this.ui.panel(p,580+i*275,425,55,55,{fill:'#102C37',stroke:i===0?C.orange:C.cyan,radius:12,name:`probe-port-${i}`});this.text(port,d.probe&(1<<i)?'✓':'○',0,2,55,49,29,C.cyan,'center');
        this.drag(plug,()=>{d.probe|=1<<i;this.render();},e=>{if(port.getComponent<UITransform>(UITransform)!.hitTest(e.getLocation())){d.probe|=1<<i;this.render();}});
        this.text(widget,d.probe&(1<<i)?'已连接':i===0?'拖向正极':'拖向负极',98+i*250,53,140,29,19,C.muted);
        if(d.probe&(1<<i)){this.ui.line(p,385+i*250,710,608+i*275,452,i===0?C.orange:C.cyan,3);}
      }
      this.button(widget,'读取回路',624,46,195,41,()=>this.finishTool(it),{disabled:d.probe!==3});
    }else if(this.tool==='TOL-005'){
      const target=[30,60,70][getDef(it.defId).sprite%3],sum=[...d.weights].reduce((a,n)=>a+n,0);
      this.text(widget,d.tared?`参考质量 ${target}g / 砝码 ${sum}g`:'先将空秤校零，再把砝码放上秤盘',18,51,392,31,20,C.cyan);
      if(!d.tared)this.button(widget,'空秤校零',623,45,196,42,()=>{d.tared=true;this.render();});
      else{
        [10,20,50].forEach((n,i)=>this.button(widget,`${d.weights.has(n)?'✓ ':''}${n}g`,419+i*85,46,77,40,()=>{if(d.weights.has(n))d.weights.delete(n);else d.weights.add(n);this.render();},{tone:d.weights.has(n)?'green':'quiet'}));
        this.button(widget,'平衡采证',683,46,136,40,()=>this.finishTool(it),{disabled:sum!==target});
      }
      const scale=this.ui.container(p,554,479,400,79,'balance-instrument');const g=scale.addComponent<Graphics>(Graphics);g.lineWidth=4;g.strokeColor=new Color(C.cyan);g.moveTo(200,0);g.lineTo(200,-73);g.moveTo(110,-73);g.lineTo(290,-73);g.stroke();const tilt=Math.max(-18,Math.min(18,(sum-target)*.4));g.moveTo(30,-20+tilt);g.lineTo(370,-20-tilt);g.stroke();g.strokeColor=new Color(C.orange);g.roundRect(25,-43+tilt,90,21,4);g.stroke();g.roundRect(285,-43-tilt,90,21,4);g.stroke();
    }else{
      this.text(widget,`负载 ${Math.round(d.load*100)}% / 安全采样区 65–85%`,18,52,400,30,20,C.cyan);
      const track=this.ui.panel(widget,427,60,200,6,{fill:'#284B56',lineWidth:0});const knob=this.ui.panel(track,d.load*180,-14,22,33,{fill:C.orange,lineWidth:0,radius:3,name:'pulse-load'});
      knob.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{if(this.busy)return;d.load=Math.max(0,Math.min(1,d.load+e.getUIDelta().x/180));knob.setPosition(d.load*180,14);});knob.on(Node.EventType.TOUCH_END,()=>this.render());
      this.button(widget,'增载',643,46,70,40,()=>{d.load=Math.min(1,d.load+.15);this.render();},{tone:'quiet',size:18});
      this.button(widget,'通电采样',722,46,97,40,()=>this.finishTool(it),{disabled:d.load<.65||d.load>.85,size:17});
    }
  }
  private drag(node:Node,click:()=>void,drop:(event:EventTouch)=>void):void{
    let origin=new Vec3(),moved=0;
    node.on(Node.EventType.TOUCH_START,()=>{if(this.busy)return;origin=node.position.clone();moved=0;node.setSiblingIndex(node.parent!.children.length-1);});
    node.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{if(this.busy)return;const d=e.getUIDelta();moved+=Math.abs(d.x)+Math.abs(d.y);node.setPosition(node.position.x+d.x,node.position.y+d.y);});
    node.on(Node.EventType.TOUCH_END,(e:EventTouch)=>{if(this.busy)return;node.setPosition(origin);if(moved>8)drop(e);else click();});node.on(Node.EventType.TOUCH_CANCEL,()=>node.setPosition(origin));
  }
  private confirmClosing():void{
    const m=this.ui.modal('结束今天的营业',{width:900,height:520});
    this.text(m.body,`剩余 ${this.state.ap} AP · 现金 ${this.state.cash} Cr\n能源维护 20 Cr${this.state.day%7===0?'，本日租金450 Cr':''}\n未完成的订单与保管货物会延续至次日。`,45,35,740,160,28);
    this.button(m.body,'继续营业',45,260,330,55,()=>m.close(),{tone:'quiet'});
    this.button(m.body,'打烊并结算',405,260,330,55,()=>{m.close();this.dispatch({type:'SETTLE'});},{tone:'gold'});
  }
  private controls():{name:string;x:number;y:number;w:number;h:number}[]{return this.all(this.ui.root).filter(n=>(n as unknown as {__action?:()=>void}).__action).map(n=>{const r=n.getComponent<UITransform>(UITransform)!.getBoundingBoxToWorld();return{name:n.name,x:r.x+W/2,y:H/2-r.y-r.height,w:r.width,h:r.height};});}
  private all(n:Node):Node[]{return[n,...n.children.flatMap(x=>this.all(x))];}
  private onKey(e:EventKeyboard):void{
    if(typeof document!=='undefined'&&['INPUT','TEXTAREA'].includes(document.activeElement?.tagName||''))return;
    if(this.busy){if(e.keyCode===KeyCode.SPACE||e.keyCode===KeyCode.ESCAPE)this.skip();return;}
    if(e.keyCode===KeyCode.TAB){const btns=this.all(this.shell).filter(n=>(n as unknown as {__enabled?:boolean}).__enabled);if(btns.length){this.focus=(this.focus+1)%btns.length;this.focused=btns[this.focus];this.ui.focusButton(this.focused);}return;}
    if((e.keyCode===KeyCode.ENTER||e.keyCode===KeyCode.SPACE)&&this.focused?.isValid){(this.focused as unknown as {__action:()=>void}).__action();return;}
    if(e.keyCode===KeyCode.ESCAPE){
      if(this.panels.closeModal())return;
      const modal=this.ui.root.children.filter(n=>n.name==='modal-overlay').pop();if(modal){this.ui.clear(modal);modal.removeFromParent();modal.destroy();return;}
      this.navigate(this.page==='counter'?'settings':'counter');return;
    }
    if(this.page==='inspect'){
      if(e.keyCode===KeyCode.KEY_F){this.back=!this.back;this.render();}
      if(e.keyCode===KeyCode.KEY_R&&this.object){this.pose.angle=this.object.angle+30;this.object.angle=this.pose.angle;}
      if(e.keyCode>=KeyCode.DIGIT_1&&e.keyCode<=KeyCode.DIGIT_6){this.tool=tools[e.keyCode-KeyCode.DIGIT_1].id;this.render();}
      const d:Record<number,[number,number]>={[KeyCode.ARROW_LEFT]:[-12,0],[KeyCode.ARROW_RIGHT]:[12,0],[KeyCode.ARROW_UP]:[0,12],[KeyCode.ARROW_DOWN]:[0,-12]};const shift=d[e.keyCode];if(shift&&this.object)this.object.setPosition(this.object.position.x+shift[0],this.object.position.y+shift[1]);
    }
  }
  private async loadAudio():Promise<void>{for(const key of ['click','coin','check','page','drop'])try{const clip=await new Promise<AudioClip>((resolve,reject)=>{if((window as unknown as {__GREYLINE_WEB__?:boolean}).__GREYLINE_WEB__)assetManager.loadRemote<AudioClip>(`./resources/audio/${key}.wav`,(e,v)=>e?reject(e):resolve(v));else resources.load<AudioClip>(`audio/${key}`,AudioClip,(e,v)=>e?reject(e):resolve(v));});this.clips.set(key,clip);}catch{}}
  private sound(key:string):void{const clip=this.clips.get(key);if(this.prefs.sound&&clip)this.audio.playOneShot(clip,.35);}
  update(dt:number):void{this.motion?.update(dt);this.panels?.update(dt);}
  onDestroy():void{this.disposed=true;this.motion?.dispose();this.panels?.dispose();input.off(Input.EventType.KEY_DOWN,this.onKey,this);}
}
