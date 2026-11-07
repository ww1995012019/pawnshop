import {
  _decorator, Component, Node, Canvas, Camera, UITransform, Layers, Color,
  Vec2, Vec3, EventTouch, EventMouse, input, Input, EventKeyboard, KeyCode,
  ResolutionPolicy, view, tween, Graphics, AudioSource, AudioClip, resources, Label, UIOpacity, Tween,
  assetManager, sys,
} from 'cc';
import { GameUI } from './ui/GameUI';
import { MotionDirector } from './ui/MotionDirector';
import { itemDefs, npcs, categories, checks, dayStories, commissionParts, getItemDef, getNpc } from './game/data';
import type { Check, Category } from './game/data';
import { createGame, reduce, appraisal, trueValue, remainingMinutes, rentDue, clockLabel, serializeGame, parseSave } from './game/model';
import type { GameState, GameAction, ItemInstance } from './game/model';

const { ccclass } = _decorator;
const SAVE_KEY = 'greyline-save-v2';
const PREFS_KEY = 'greyline-creator-prefs';
const W = 1600, H = 900;
type Panel = 'inventory' | 'inspect' | 'catalog' | 'ledger' | 'commission' | 'settings' | 'closing' | null;
type Prefs = { sound: boolean; reducedMotion: boolean; largeText: boolean };
const colors = { ink:'#2E3024', paper:'#E9D7A8', gold:'#D7B66B', green:'#1C3934', pale:'#EEE3C5', muted:'#BDB391' };

/** The whole game view is rendered by Cocos nodes; HTML only hosts the game canvas. */
@ccclass('CreatorMain')
export class CreatorMain extends Component {
  private state: GameState = createGame();
  private prefs: Prefs = { sound: false, reducedMotion: false, largeText: false };
  private ui!: GameUI;
  private shell!: Node;
  private modalRoot: Node | null = null;
  private panel: Panel = null;
  private selected = '';
  private check: Check = 'condition';
  private inspected = '';
  private offer = 0;
  private probe = 0;
  private compared = false;
  private marks = new Set<number>();
  private object: Node | null = null;
  private objectZoom = 1;
  private plate = false;
  private audio!: AudioSource;
  private clips = new Map<string, AudioClip>();
  private saveFailed = false;
  private motion!:MotionDirector;
  private busy=false;
  private motionEpoch=0;
  private busyHint:Node|null=null;
  private actorNode:Node|null=null;
  private counterItemNode:Node|null=null;
  private lampNode:Node|null=null;
  private inspectBody:Node|null=null;
  private cashLabel:Node|null=null;
  private cashTween:{from:number;to:number;elapsed:number;node:Node}|null=null;
  private poses=new Map<string,{x:number;y:number;angle:number;zoom:number}>();
  private disposed = false;
  private focused:Node|null=null;
  private focusIndex=-1;

  start(): void { void this.boot().catch(error => { console.error('Greyline initialization failed',error); if(this.ui){this.ui.clear(this.shell);this.label(this.shell,'旧货铺暂时未能打开，请刷新重试。',350,390,900,90,32,colors.pale,'center');} }); }

  private async boot(): Promise<void> {
    view.setDesignResolutionSize(W, H, ResolutionPolicy.SHOW_ALL);
    const canvasNode = new Node('GameCanvas');
    canvasNode.layer = Layers.Enum.UI_2D;
    this.node.addChild(canvasNode);
    const canvas = canvasNode.addComponent<Canvas>(Canvas);
    canvasNode.getComponent<UITransform>(UITransform)!.setContentSize(W, H);
    const cameraNode = new Node('UICamera');
    this.node.addChild(cameraNode);
    cameraNode.setPosition(0, 0, 1000);
    const camera = cameraNode.addComponent<Camera>(Camera);
    camera.projection = Camera.ProjectionType.ORTHO;
    camera.orthoHeight = H / 2;
    camera.near = 0.1; camera.far = 2000;
    camera.visibility = Layers.Enum.UI_2D;
    camera.clearFlags = Camera.ClearFlag.SOLID_COLOR;
    camera.clearColor = new Color('#141E19');
    canvas.cameraComponent = camera;
    const root = new Node('GreylineUI');
    root.layer = Layers.Enum.UI_2D;
    canvasNode.addChild(root);
    const rt = root.addComponent<UITransform>(UITransform); rt.setContentSize(W,H); rt.setAnchorPoint(0,1);
    root.setPosition(-W/2,H/2);
    this.audio = this.node.addComponent<AudioSource>(AudioSource);
    this.ui = new GameUI(root);
    this.shell = this.ui.container(root,0,0,W,H,'MainView');
    this.ui.label(this.shell,'正在点亮旧货铺…',500,410,600,60,{size:32,color:colors.gold,align:'center'});
    this.load();
    await this.ui.preload();
    if (this.disposed) return;
    this.motion=new MotionDirector(this.ui);
    this.motion.configure({reducedMotion:this.prefs.reducedMotion});
    this.render();
    void this.playMotion(async()=>this.motion.sceneEntry());
    input.on(Input.EventType.KEY_DOWN, this.onKey, this);
    void this.loadAudio();
    if (typeof window !== 'undefined') {
      const debug = {
        engine: 'Cocos Creator 3.8.8',
        snapshot: () => JSON.parse(JSON.stringify(this.state)),
        dispatch: (action: GameAction) => this.dispatch(action),
        open: (panel: Panel, uid?: string) => { if(uid)this.selected=this.inspected=uid;this.panel=panel;this.render(); },
        reset: (seed='TUTORIAL-001') => {this.skipMotion();this.motion.reset();this.state=createGame(seed);this.panel=null;this.save();this.render();},
        controls: () => this.collectControls(),
        diagnostics: () => ({busy:this.busy,phase:this.state.phase,motion:this.motion.snapshot()}),
        click: (name:string) => this.clickControl(name),
      };
      (window as unknown as { __GREYLINE__: typeof debug }).__GREYLINE__ = debug;
      document.dispatchEvent(new CustomEvent('greyline-ready'));
    }
  }

  private load(): void {
    try {
      const saved = sys.localStorage.getItem(SAVE_KEY) || sys.localStorage.getItem('greyline-save-v1');
      this.state = parseSave(saved) || createGame();
      const prefs = JSON.parse(sys.localStorage.getItem(PREFS_KEY) || sys.localStorage.getItem('greyline-prefs') || '{}');
      this.prefs = { sound: prefs.sound === true, reducedMotion: prefs.reducedMotion === true, largeText: prefs.largeText === true };
      this.selected = this.state.inventory[0]?.uid || '';
    } catch { this.state=createGame(); }
  }
  private save(): void {
    try {sys.localStorage.setItem(SAVE_KEY,serializeGame(this.state));this.saveFailed=false;}
    catch {this.saveFailed=true;}
  }
  private dispatch(action: GameAction): void {
    if(this.busy)return;
    const before=this.state;
    const priorItem=before.trade?.role==='seller'?before.trade.item:before.inventory.find(i=>i.uid===before.trade?.selected);
    this.state=reduce(before,action);
    this.save();
    if(action.type==='ARRIVE')this.offer=this.state.trade?.price||0;
    if(action.type==='START_CHECK'){this.marks.clear();this.probe=0;this.compared=false;}
    if(this.state.phase==='report'||this.state.phase==='ending')this.panel=null;
    this.sound(action.type==='DELIVER'?'coin':action.type==='CHECK_STEP'?'check':action.type==='REFUSE'?'reject':'click');
    this.render();
    const after=this.state;
    if(action.type==='ARRIVE'&&after.trade&&!before.trade){
      const actor=this.actorNode,counter=this.counterItemNode,item=after.trade.item;
      if(counter)this.setOpacity(counter,0);
      void this.playMotion(async active=>{
        if(actor)await this.motion.npcEnter(actor);
        if(active()&&item)await this.motion.handoff(item.defId,{x:558,y:496},{x:804,y:561},{size:192,duration:1.05,label:'轻放在柜台上',kind:'arrive',onPlaced:()=>{if(counter?.isValid)this.setOpacity(counter,255);}});
        if(counter?.isValid)this.setOpacity(counter,255);
      });
    }else if(action.type==='DELIVER'&&before.trade&&!after.trade&&before.cash!==after.cash){
      const npc=getNpc(before.trade.npc),incoming=before.trade.role==='seller';
      this.beginCashCount(before.cash,after.cash);
      void this.playMotion(async active=>{
        await this.motion.deal(after.cash-before.cash,{itemId:priorItem?.defId,from:{x:804,y:561},to:incoming?{x:1020,y:340}:{x:540,y:500}});
        if(active())await this.motion.npcExit(npc.sprite,{x:310,y:202},{x:-330,y:228});
      });
    }else if((action.type==='REFUSE'||action.type==='DISMISS')&&before.trade&&!after.trade){
      const npc=getNpc(before.trade.npc);
      void this.playMotion(async()=>this.motion.npcExit(npc.sprite,{x:310,y:202},{x:-330,y:235}));
    }else if(action.type==='START_CHECK'&&after.inspection&&after.minute>before.minute&&this.inspectBody){
      const mode=action.check==='condition'?'magnify':action.check==='function'?'spectrum':'number';
      const b=this.inspectBody;
      void this.playMotion(async()=>this.motion.scan(b,{x:225,y:92,width:490,height:348},{mode,duration:0.9,label:action.check==='function'?'测试台预热':action.check==='authenticity'?'展开旧站档案':'侧光掠过使用痕迹'}));
    }else if(action.type==='CHECK_STEP'&&before.inspection){
      const now=this.findItem(before.inspection.uid);
      const complete=!!now?.revealed[before.inspection.check];
      void this.playMotion(async()=>this.motion.stamp(complete?'已核验':'已记录',complete?{x:1248,y:290}:{x:1168,y:360},complete?'success':'warning'));
    }else if(action.type==='PLACE'||action.type==='DISPLAY'){
      const it=after.inventory.find(i=>i.uid===action.uid);
      const prior=before.inventory.find(i=>i.uid===action.uid);
      if(it?.displayed&&(!prior?.displayed||prior.displaySlot!==it.displaySlot))void this.playMotion(async()=>this.motion.handoff(it.defId,{x:530,y:420},{x:141+(it.displaySlot||0)*109,y:728},{size:94,duration:0.85,label:'陈列位置已保存',kind:'store'}));
      else if(after.notice)this.ui.toast(after.notice);
    }else if(action.type==='ACCEPT'&&after.trade?.locked&&!before.trade?.locked){
      void this.playMotion(async()=>this.motion.stamp('议价达成',{x:1320,y:471},'success'));
    }else if(action.type==='SETTLE'&&after.phase==='report'&&before.phase!=='report'){
      void this.playMotion(async()=>this.motion.dayTransition(after.day,true));
    }else if(action.type==='NEXT'&&after.day!==before.day){
      void this.playMotion(async()=>this.motion.dayTransition(after.day,false));
    }else if(after.commission==='done'&&before.commission!=='done'){
      this.beginCashCount(before.cash,after.cash);
      void this.playMotion(async()=>this.motion.deal(40,{from:{x:830,y:490},to:{x:736,y:66}}));
    }else if(after.notice!==before.notice&&after.minute===before.minute&&after.cash===before.cash){
      this.ui.toast(after.notice);
    }
  }
  private findItem(uid:string):ItemInstance|undefined {
    return this.state.inventory.find(i=>i.uid===uid)||(this.state.trade?.item?.uid===uid?this.state.trade.item:undefined);
  }
  private setOpacity(node:Node,value:number):void {
    (node.getComponent<UIOpacity>(UIOpacity)||node.addComponent<UIOpacity>(UIOpacity)).opacity=value;
  }
  private async playMotion(run:(active:()=>boolean)=>Promise<void>):Promise<void>{
    const epoch=++this.motionEpoch;
    this.busy=true;
    this.motion.configure({reducedMotion:this.prefs.reducedMotion});
    this.busyHint?.destroy();
    this.busyHint=this.ui.container(this.ui.root,570,867,445,28,'motion-skip');
    this.label(this.busyHint,'点击此处或按空格快进',0,0,445,28,16,colors.gold,'center');
    this.busyHint.on(Node.EventType.TOUCH_END,()=>this.skipMotion());
    try{await run(()=>epoch===this.motionEpoch);}finally{
      if(epoch===this.motionEpoch){this.busy=false;this.busyHint?.removeFromParent();this.busyHint?.destroy();this.busyHint=null;}
      if(this.counterItemNode?.isValid)this.setOpacity(this.counterItemNode,255);
    }
  }
  private skipMotion():void{
    this.motionEpoch++;this.motion?.finish();this.busy=false;
    this.busyHint?.removeFromParent();this.busyHint?.destroy();this.busyHint=null;
    if(this.counterItemNode?.isValid)this.setOpacity(this.counterItemNode,255);
    if(this.cashTween){const n=this.cashTween.node.getComponent<Label>(Label);if(n)n.string=`${this.cashTween.to}票`;this.cashTween=null;}
  }
  private beginCashCount(from:number,to:number):void {
    if(this.prefs.reducedMotion||!this.cashLabel)return;
    this.cashTween={from,to,elapsed:0,node:this.cashLabel};
    this.cashLabel.getComponent<Label>(Label)!.string=`${from}票`;
  }
  private label(parent:Node,text:string,x:number,y:number,w:number,h:number,size=22,color=colors.ink,align:'left'|'center'|'right'='left'):Node {
    return this.ui.label(parent,text,x,y,w,h,{size:size*(this.prefs.largeText?1.12:1),color,align});
  }
  private button(parent:Node,text:string,x:number,y:number,w:number,h:number,fn:()=>void,tone:'gold'|'green'|'danger'|'quiet'='green',disabled=false):Node {
    const invoke=()=>{if(this.busy||disabled)return;this.sound('click');fn();};
    const node=this.ui.button(parent,text,x,y,w,h,invoke,{tone,size:this.prefs.largeText?23:21,disabled});
    (node as unknown as {__action:()=>void;__enabled:boolean}).__action=invoke;
    (node as unknown as {__enabled:boolean}).__enabled=!disabled;
    return node;
  }
  private open(panel:Panel,uid?:string):void {
    if(panel==='closing'&&this.state.phase==='open'){
      this.state=reduce(this.state,{type:'CLOSE'});this.save();
      if(this.state.phase!=='closing'){this.ui.toast(this.state.notice);return;}
    }
    if(uid)this.selected=this.inspected=uid;
    this.panel=panel;
    if(panel==='inspect'){this.objectZoom=this.poses.get(this.inspected)?.zoom||1;this.plate=false;this.marks.clear();this.probe=0;this.compared=false;const progress=this.state.inspection?.uid===this.inspected?this.state.inspection.progress:0;for(let i=0;i<progress;i++)this.marks.add(i);}
    this.sound('page');this.render();
  }
  private closePanel():void {
    if(this.panel==='closing'){this.state=reduce(this.state,{type:'BACK'});this.save();}
    this.panel=null;this.render();
  }
  private render():void {
    if(!this.ui)return;
    if(this.object?.isValid)this.poses.set(this.inspected,{x:this.object.position.x,y:this.object.position.y,angle:this.object.angle,zoom:this.objectZoom});
    this.modalRoot?.removeFromParent();this.modalRoot?.destroy();this.modalRoot=null;this.object=null;this.focused=null;
    this.ui.reducedMotion=this.prefs.reducedMotion;
    this.ui.clear(this.shell);this.actorNode=null;this.counterItemNode=null;this.lampNode=null;this.inspectBody=null;this.cashLabel=null;
    const s=this.state;
    this.ui.image(this.shell,'shop',0,0,W,H,{fit:'cover'});
    this.ui.panel(this.shell,0,0,W,115,{fill:'#11281FB8',stroke:'#977B4350',radius:0});
    this.ui.panel(this.shell,0,670,W,230,{fill:'#142B25D8',stroke:'#977B4370',radius:0});
    this.button(this.shell,'灰线旧货铺',20,10,413,96,()=>this.open('catalog'),'green');
    this.label(this.shell,'旧站台 · 拾物记  /  七日试营业',58,79,340,20,14,colors.gold,'center');
    this.hud('试营业',`第${String(s.day).padStart(2,'0')}天`,454,'watch');
    this.hud('手头现金',`${s.cash}票`,660,'purse');
    this.hud(s.day<=3?'第3天到期':'第7天到期',s.day<=3?'90票':'210票',866,'keys');
    this.hud('店铺信誉',`${s.reputation} / 100`,1072,'seal');
    this.button(this.shell,this.prefs.sound?'声音 开':'声音 关',1290,30,132,56,()=>this.toggle('sound'),'quiet');
    this.button(this.shell,'设置',1430,30,150,56,()=>this.open('settings'),'quiet');
    this.drawWorld();
    this.drawNotice();
    this.drawActions();
    this.label(this.shell,`${clockLabel(s.minute)}  ·  已用 ${s.minute} / 360 分钟`,31,872,520,24,16,colors.muted);
    this.label(this.shell,this.saveFailed?'存档空间不足，请导出备份':'● 自动存档  ·  进度保存在此浏览器',1050,872,520,24,15,colors.muted,'right');
    if(s.phase==='report')this.drawReport();
    else if(s.phase==='ending')this.drawEnding();
    else if(this.panel)this.drawPanel();
    this.motion?.bindAmbient({parent:this.shell,actor:this.actorNode||undefined,lamp:this.lampNode||undefined,area:{x:420,y:135,width:720,height:470}});
  }
  private hud(title:string,value:string,x:number,icon:'watch'|'purse'|'keys'|'seal'):void {
    const tag=this.ui.container(this.shell,x,6,194,100,`hud-${icon}`);
    this.ui.paper(tag,10,5,184,92,{kind:'note'});
    this.ui.icon(tag,icon,-8,29,67,67);
    this.label(tag,title,60,16,125,25,16,'#786748');
    const n=this.label(tag,value,60,44,125,41,28,'#493D25');
    if(icon==='purse')this.cashLabel=n;
  }
  private drawWorld():void {
    const s=this.state,trade=s.trade,npcId=trade?.npc||s.queue[s.cursor];
    if(npcId){
      const npc=getNpc(npcId);
      const active=!!trade;
      this.actorNode=this.ui.portrait(this.shell,npc.sprite,active?310:115,active?202:250,active?310:220,active?465:390);
      const badge=this.ui.container(this.shell,active?276:91,active?585:592,active?338:269,62,'customer-name');
      this.ui.paper(badge,0,0,active?338:269,62,{kind:'note'});
      this.label(badge,npc.name,18,4,active?302:233,31,25,colors.ink,'center');
      this.label(badge,active?npc.title:'有人在门口等候',18,35,active?302:233,20,14,'#806B42','center');
    }
    const visible=s.inventory.filter(x=>x.displayed);
    this.label(this.shell,`店内陈列 ${visible.length}/8`,804,147,315,35,22,colors.pale,'center');
    for(let slot=0;slot<8;slot++){
      const item=visible.find(x=>x.displaySlot===slot),x=772+(slot%4)*101,y=209+Math.floor(slot/4)*128;
      const hot=this.ui.container(this.shell,x,y,96,118,`scene-shelf-${slot}`);
      if(item){
        const art=this.ui.item(hot,item.defId,4,2,88,88);
        this.ui.paper(hot,3,92,90,23,{kind:'note'});
        this.label(hot,`${item.listPrice}票`,7,92,82,23,15,colors.ink,'center');
        art.on(Node.EventType.MOUSE_ENTER,()=>{if(!this.prefs.reducedMotion)tween(art).to(0.16,{scale:new Vec3(1.1,1.1,1)}).start();});
        art.on(Node.EventType.MOUSE_LEAVE,()=>{Tween.stopAllByTarget(art);art.setScale(1,1,1);});
        art.on(Node.EventType.TOUCH_END,()=>{if(!this.busy)this.open('inspect',item.uid);});
      }else{
        const glow=this.ui.panel(hot,2,1,91,111,{fill:'#FFE2B014',stroke:'#D4B66B80',radius:5,opacity:0});
        this.label(glow,'＋',0,36,91,40,28,colors.gold,'center');
        hot.on(Node.EventType.MOUSE_ENTER,()=>this.setOpacity(glow,160));
        hot.on(Node.EventType.MOUSE_LEAVE,()=>this.setOpacity(glow,0));
        hot.on(Node.EventType.TOUCH_END,()=>{if(!this.busy)this.open('inventory');});
      }
    }
    // A separate glow lives over the painted lamp; it is not baked into the backdrop.
    this.lampNode=this.ui.panel(this.shell,695,116,130,88,{fill:'#FFD79F0B',stroke:'#FFD79F00',radius:42});
    if(trade){
      const item=trade.role==='seller'?trade.item:s.inventory.find(i=>i.uid===trade.selected);
      if(item){
        const shadow=this.ui.container(this.shell,679,603,250,30,'counter-shadow');
        const g=shadow.addComponent<Graphics>(Graphics);g.fillColor=new Color('#0B100966');g.ellipse(125,-15,119,13);g.fill();
        this.counterItemNode=this.ui.item(this.shell,item.defId,684,448,240,200);
        this.counterItemNode.on(Node.EventType.TOUCH_END,()=>{if(!this.busy)this.open('inspect',item.uid);});
        this.button(this.shell,'拿起 · 检查实物',634,616,340,48,()=>this.open('inspect',item.uid),'gold');
      }else{
        this.ui.paper(this.shell,660,530,380,78,{kind:'note'});
        this.label(this.shell,'顾客在等一件合适的旧物',680,542,340,48,22,colors.ink,'center');
        this.button(this.shell,'从货架选一件',684,614,330,49,()=>this.open('inventory'),'gold');
      }
    }else{
      this.ui.paper(this.shell,700,553,312,72,{kind:'note'});
      this.label(this.shell,'今日营业中',726,562,260,29,24,colors.ink,'center');
      this.label(this.shell,'轻触架上旧物 · 拿到桌面细看',719,596,274,22,14,'#806B42','center');
    }
  }
  private drawNotice():void {
    const s=this.state,t=s.trade;
    this.ui.image(this.shell,'notice-board',1170,130,408,532,{fit:'stretch'});
    this.ui.paper(this.shell,1200,170,344,450,{kind:'note'});
    this.label(this.shell,t?'当前交易':'今日告示',1220,185,304,42,30,colors.ink,'center');
    if(t) {
      this.label(this.shell,t.role==='seller'?'旧物收购单':'顾客采购单',1222,240,300,34,22);
      this.label(this.shell,`${getNpc(t.npc).name}的报价`,1222,284,300,28,18,'#7B6C4B');
      this.label(this.shell,`${t.price} 票`,1222,318,300,54,42,'#7E4A2B');
      this.label(this.shell,`还价机会 ${3-t.rounds} / 3`,1222,388,300,30,21);
      this.label(this.shell,t.locked?'价格已确认，请完成交割':'先检查实物，再决定出价。',1222,434,300,60,21);
      const selected=t.role==='seller'?t.item:s.inventory.find(i=>i.uid===t.selected);
      if(selected) {
        const a=appraisal(selected,s.market);
        this.label(this.shell,`参考估值 ${this.valueText(a)}`,1222,520,300,60,21,'#5E6B41');
      }
    } else {
      const story=dayStories[Math.min(6,s.day-1)];
      this.label(this.shell,story[0],1224,245,296,54,25,'#654D2D');
      this.label(this.shell,story[1],1224,315,296,126,20);
      this.label(this.shell,'聚落行情',1224,463,290,30,22);
      (Object.keys(categories) as Category[]).forEach((c,i)=>this.label(this.shell,`${categories[c].name}    ${s.market[c]>1?'↑ 偏旺':s.market[c]<1?'↓ 回落':'— 平稳'}`,1224,505+i*33,290,28,18));
    }
  }
  private drawActions():void {
    const s=this.state,t=s.trade;
    const line=t?`${getNpc(t.npc).name}：${t.line}`:s.notice||'旧物的故事，等你亲手翻开。';
    this.ui.dialogueFrame(this.shell,20,680,1560,104);
    this.ui.icon(this.shell,t?'deal':'notes',45,696,69,69);
    this.label(this.shell,line,132,726,1360,42,24,colors.ink);
    if(!t) {
      this.button(this.shell,'招呼顾客  ·  6分钟',30,783,350,65,()=>this.dispatch({type:'ARRIVE'}),'gold',s.phase!=='open'||s.cursor>=s.queue.length||remainingMinutes(s)<6);
      this.button(this.shell,'整理货架',395,783,260,65,()=>this.open('inventory'));
      this.button(this.shell,s.commission==='done'?'社区委托  已完成':'社区委托  +40票',670,783,300,65,()=>this.open('commission'),'green',s.commission==='done');
    } else if(t.locked) {
      this.button(this.shell,'确认交割 · 钱货两清',30,783,450,65,()=>this.dispatch({type:'DELIVER',tradeId:t.id}),'gold');
      this.label(this.shell,'账款与物品在交割时一起保存',505,802,450,38,22,colors.pale);
    } else {
      const it=t.role==='seller'?t.item:s.inventory.find(i=>i.uid===t.selected);
      this.button(this.shell,'检查旧物',30,783,205,65,()=>it&&this.open('inspect',it.uid),'green',!it);
      this.button(this.shell,`接受 ${t.price}票`,250,783,226,65,()=>this.dispatch({type:'ACCEPT'}),'gold',!it);
      this.button(this.shell,'商量报价',491,783,226,65,()=>this.drawOffer(),'green',!it||t.rounds>=3);
      this.button(this.shell,'礼貌送客',732,783,226,65,()=>this.dispatch({type:'REFUSE'}),'quiet');
    }
    ['货架','图鉴','账本'].forEach((name,i)=>this.button(this.shell,name,1005+i*137,783,125,65,()=>this.open((['inventory','catalog','ledger'] as Panel[])[i]),'quiet'));
    this.button(this.shell,'打烊',1427,783,145,65,()=>this.open('closing'),'quiet');
  }
  private drawPanel():void {
    const title:Record<Exclude<Panel,null>,string>={inventory:'库存与陈列',inspect:'旧物鉴定台',catalog:'旧物图鉴',ledger:'经营账本',commission:'社区分拣委托',settings:'暂停与设置',closing:'今天，就到这里吧'};
    const modal=this.ui.modal(title[this.panel!],{width:1510,height:836,onClose:()=>this.closePanel()});
    this.modalRoot=modal.overlay;
    const b=modal.body;
    if(this.panel==='inventory')this.drawInventory(b);
    if(this.panel==='inspect')this.drawInspection(b);
    if(this.panel==='catalog')this.drawCatalog(b);
    if(this.panel==='ledger')this.drawLedger(b);
    if(this.panel==='commission')this.drawCommission(b);
    if(this.panel==='settings')this.drawSettings(b);
    if(this.panel==='closing')this.drawClosing(b);
  }
  private drawInventory(b:Node):void {
    const s=this.state;
    this.label(b,`全部库存 ${s.inventory.length}/12   ·   拖动旧物到陈列格，或点选后摆放`,14,0,1000,35,22,colors.pale);
    for(let i=0;i<12;i++) {
      const item=s.inventory[i],x=14+(i%4)*219,y=48+Math.floor(i/4)*146;
      const card=this.ui.cabinetCell(b,i,x,y,205,134);
      if(item?.uid===this.selected)this.ui.panel(card,3,3,199,128,{fill:'#DFC47920',stroke:'#FFE0A5',radius:4,lineWidth:2});
      if(item) {
        this.ui.item(card,item.defId,38,3,132,90);
        this.label(card,getItemDef(item.defId).name,7,99,191,29,18,colors.pale,'center');
        if(item.displayed)this.label(card,'陈列中',9,8,80,23,13,colors.gold);
        this.draggable(card,()=>{this.selected=item.uid;this.render();},slot=>this.dispatch({type:'PLACE',uid:item.uid,slot}));
      } else this.label(card,'空置',10,48,180,35,22,'#C0AB78','center');
    }
    this.label(b,'店内陈列  ·  拖放换位，格位自动保存',14,500,900,35,23,colors.pale);
    for(let slot=0;slot<8;slot++) {
      const x=14+slot*109,y=550,item=s.inventory.find(v=>v.displayed&&v.displaySlot===slot);
      const n=this.ui.cabinetCell(b,slot,x,y,100,111);
      n.name=`ShelfSlot:${slot}`;
      if(item){this.ui.item(n,item.defId,7,2,86,77);this.label(n,String(slot+1).padStart(2,'0'),6,83,88,20,15,colors.gold,'center');}
      else this.label(n,`＋\n${slot+1}`,8,25,84,70,24,colors.gold,'center');
      n.on(Node.EventType.TOUCH_END,()=>this.selected&&this.dispatch({type:'PLACE',uid:this.selected,slot}));
    }
    const item=s.inventory.find(i=>i.uid===this.selected)||s.inventory[0];
    this.ui.paper(b,920,0,495,688,{kind:'note'});
    if(!item){this.label(b,'库房还是空的，去柜台收一件旧物吧。',950,250,435,110,25);return;}
    this.selected=item.uid;
    this.ui.item(b,item.defId,1043,20,248,210);
    this.label(b,getItemDef(item.defId).name,950,240,435,42,30);
    this.label(b,getItemDef(item.defId).lore,950,295,435,98,21);
    this.label(b,`购入 ${item.cost}票  ·  挂牌 ${item.listPrice}票`,950,405,435,38,23);
    this.button(b,'−10',950,461,96,46,()=>this.dispatch({type:'PRICE',uid:item.uid,price:Math.max(1,item.listPrice-10)}),'quiet');
    this.button(b,'＋10',1062,461,96,46,()=>this.dispatch({type:'PRICE',uid:item.uid,price:item.listPrice+10}),'quiet');
    this.button(b,item.displayed?'撤下陈列':'放上货架',1174,461,208,46,()=>this.dispatch({type:'DISPLAY',uid:item.uid}));
    this.button(b,'拿到鉴定台',950,531,432,55,()=>this.open('inspect',item.uid),'gold');
    if(s.trade?.role==='buyer'&&!s.trade.locked)this.button(b,'推荐给当前顾客',950,601,432,55,()=>{this.panel=null;this.dispatch({type:'SELECT',uid:item.uid} );},'gold');
    else this.button(b,`回收变现 · ${Math.floor(trueValue(item,s.market)*0.35)}票`,950,601,432,55,()=>this.confirmRecycle(item),'quiet',s.recycled>=2);
  }
  private draggable(node:Node,click:()=>void,drop:(slot:number)=>void):void {
    let start=new Vec3(),moved=0;
    node.on(Node.EventType.TOUCH_START,()=>{if(this.busy)return;start=node.position.clone();moved=0;node.setSiblingIndex(node.parent!.children.length-1);});
    node.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{if(this.busy)return;const d=e.getUIDelta();moved+=Math.abs(d.x)+Math.abs(d.y);node.setPosition(node.position.x+d.x,node.position.y+d.y);});
    node.on(Node.EventType.TOUCH_END,(e:EventTouch)=>{
      if(this.busy)return;
      const hit=this.allNodes(this.modalRoot!).find(n=>n.name.startsWith('ShelfSlot:')&&this.hit(n,e.getLocation()));
      node.setPosition(start);
      if(moved>8&&hit)drop(Number(hit.name.split(':')[1]));else click();
    });
    node.on(Node.EventType.TOUCH_CANCEL,()=>node.setPosition(start));
  }
  private drawInspection(b:Node):void {
    const s=this.state,item=s.inventory.find(i=>i.uid===this.inspected)||(s.trade?.item?.uid===this.inspected?s.trade.item:null);
    if(!item){this.label(b,'这件物品已经交给了它的新主人。',50,100,1200,80,30,colors.pale);return;}
    const def=getItemDef(item.defId);
    this.inspectBody=b;
    this.ui.panel(b,10,0,920,690,{fill:'#24453B',stroke:colors.gold,radius:8});
    this.label(b,`${def.id} / ${def.subtitle}`,30,18,870,32,21,colors.gold);
    this.label(b,'拿起 · 拖到工具旁，或点击工具；滚轮缩放，R旋转，F查看铭牌',30,57,860,32,18,colors.pale);
    const object=this.ui.container(b,245,105,450,330,'InspectionObject');
    this.object=object;const pose=this.poses.get(item.uid);if(pose){object.setPosition(pose.x,pose.y);object.angle=pose.angle;}object.setScale(this.objectZoom,this.objectZoom,1);
    this.ui.item(object,item.defId,35,10,380,300);
    object.on(Node.EventType.TOUCH_START,()=>this.sound('drop'));
    object.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{if(this.busy)return;const d=e.getUIDelta();object.setPosition(object.position.x+d.x,object.position.y+d.y);});
    object.on(Node.EventType.TOUCH_END,(e:EventTouch)=>{
      if(this.busy)return;
      const tools=this.allNodes(b).filter(n=>n.name.startsWith('Tool:'));
      const target=tools.find(n=>this.hit(n,e.getLocation()));
      if(target)this.startCheck(item,target.name.split(':')[1] as Check);
    });
    object.on(Node.EventType.MOUSE_WHEEL,(e:EventMouse)=>!this.busy&&this.zoom(e.getScrollY()>0?0.1:-0.1));
    if(this.plate) {
      this.ui.paper(object,65,128,320,114,{kind:'note'});
      this.label(object,'铭牌与来路记录',80,140,290,26,17);
      this.label(object,def.code,80,180,290,42,27,colors.ink,'center');
    }
    const active=s.inspection?.uid===item.uid?s.inspection.check:null;
    if(active==='condition')for(let i=0;i<3;i++) {
      const x=100+((def.sprite*43+i*157)%280),y=45+((def.sprite*21+i*73)%170);
      this.button(object,this.marks.has(i)?'✓':String(i+1),x,y,48,48,()=>{if(!this.marks.has(i)){this.marks.add(i);this.dispatch({type:'CHECK_STEP'});}},'gold',this.marks.has(i));
    }
    this.button(b,'−',155,459,72,44,()=>this.zoom(-0.1),'quiet');
    this.button(b,'旋转',245,459,120,44,()=>object.angle+=15,'quiet');
    this.button(b,this.plate?'查看外观':'查看铭牌',382,459,180,44,()=>{this.plate=!this.plate;this.render();},'quiet');
    this.button(b,'＋',578,459,72,44,()=>this.zoom(0.1),'quiet');
    this.button(b,'归位',666,459,120,44,()=>{this.objectZoom=1;this.poses.delete(item.uid);this.object=null;this.render();},'quiet');
    if(active==='function')this.drawProbe(b,item);
    else if(active==='authenticity')this.drawComparison(b,item);
    else this.label(b,active==='condition'?checks.condition.hint:'检查已完成的项目可以免费复看。证据会影响估值，不会改变物品本身。',35,510,870,46,20,colors.pale);
    (Object.keys(checks) as Check[]).forEach((c,i)=>{
      const done=item.revealed[c];
      const btn=this.button(b,`${['⌕ 放大镜','ϟ 测试器','≡ 编号册'][i]}\n${done?'已验 · 免费复看':`${checks[c].minutes}分钟`}`,30+i*294,590,278,77,()=>this.startCheck(item,c),done?'quiet':'gold',!!s.inspection&&active!==c);
      btn.name=`Tool:${c}`;
    });
    this.ui.paper(b,954,0,465,690,{kind:'note'});
    this.label(b,categories[def.category].name,978,20,416,30,19,'#807347');
    this.label(b,def.name,978,66,416,58,33);
    this.label(b,`参考估值 ${this.valueText(appraisal(item,s.market))}`,978,144,416,46,26,'#56683C');
    (Object.keys(checks) as Check[]).forEach((c,i)=>{
      const text=!item.revealed[c]?'尚未取得证据':c==='condition'?def.appearance.join('；'):c==='function'?def.functionClue[item.function===1?0:1]:item.authenticity===1?def.originalClue:def.alternateClue;
      this.label(b,`${item.revealed[c]?'✓':'○'} ${checks[c].name}`,978,219+i*124,416,33,23);
      this.label(b,text,978,259+i*124,416,72,19,item.revealed[c]?colors.ink:'#8C8264');
    });
    this.button(b,'收好物件 · 返回柜台',978,608,416,55,()=>{this.panel=null;this.render();},'green');
  }
  private startCheck(item:ItemInstance,check:Check):void {
    if(this.busy)return;
    this.check=check;this.probe=0;this.compared=false;
    if(item.revealed[check]){
      const b=this.inspectBody;if(!b)return;
      void this.playMotion(async active=>{
        await this.motion.scan(b,{x:225,y:92,width:490,height:348},{mode:check==='condition'?'magnify':check==='function'?'spectrum':'number',duration:0.9,label:'免费复看 · '+checks[check].name});
        if(active()&&check==='function')await this.motion.waveform(b,{x:690,y:163,width:200,height:143},{healthy:item.function===1,duration:1.2,label:'负载记录'});
      });
      return;
    }
    this.dispatch({type:'START_CHECK',uid:item.uid,check});
  }
  private drawProbe(b:Node,item:ItemInstance):void {
    this.label(b,'功能复测：接通两个测试触点，然后读取负载',35,510,870,28,19,colors.pale);
    for(let i=0;i<2;i++)this.button(b,(this.probe&(1<<i))?'触点已接通':i===0?'接通供电端':'接通负载端',40+i*260,547,244,34,()=>this.connectProbe(i,item),'quiet');
    this.button(b,'读取测试结果',570,547,305,34,()=>this.dispatch({type:'CHECK_STEP'}),'gold',this.probe!==3);
  }
  private connectProbe(index:number,item:ItemInstance):void{
    if(this.busy)return;
    this.probe|=1<<index;this.render();
    const b=this.inspectBody;if(!b)return;
    void this.playMotion(async active=>{
      await this.motion.connect(b,{x:162+index*260,y:548},{x:330+index*218,y:335},{duration:0.65,color:index===0?'#E5AA69':'#7DD2B6'});
      if(active()&&this.probe===3)await this.motion.waveform(b,{x:690,y:163,width:200,height:143},{healthy:item.function===1,duration:1.2,label:'负载波形'});
    });
  }
  private drawComparison(b:Node,item:ItemInstance):void {
    this.label(b,`物件铭牌 ${getItemDef(item.defId).code}  ·  请选择同型号档案`,35,508,870,30,19,colors.pale);
    const code=getItemDef(item.defId).code;
    [code,code.replace(/[0-9]/g,'8')+' / 附录'].forEach((v,i)=>this.button(b,v,40+i*430,549,410,33,()=>{if(i===0)this.dispatch({type:'CHECK_STEP'});else this.ui.toast('型号不一致，换一本档案再比对。');},'quiet'));
  }
  private zoom(delta:number):void {this.objectZoom=Math.max(0.7,Math.min(1.6,this.objectZoom+delta));this.object?.setScale(this.objectZoom,this.objectZoom,1);}
  private drawCatalog(b:Node):void {
    this.label(b,'旧物档案  ·  收购、出售和核验会留下新的记录',16,0,1400,40,24,colors.pale);
    itemDefs.forEach((def,i)=>{
      const x=16+(i%4)*352,y=58+Math.floor(i/4)*205;
      this.ui.paper(b,x,y,336,190,{kind:'note'});
      this.ui.item(b,def.id,x+7,y+10,115,112);
      this.label(b,def.name,x+137,y+16,185,36,23);
      this.label(b,`${def.id} · ${categories[def.category].name}`,x+137,y+62,185,30,16,'#7C704F');
      this.label(b,def.lore,x+14,y+126,308,53,16);
    });
  }
  private drawLedger(b:Node):void {
    const s=this.state;
    this.label(b,`现金 ${s.cash}票   ·   售出 ${s.sold}/12件   ·   信誉 ${s.reputation}/100`,20,0,1400,50,29,colors.pale);
    this.ui.paper(b,20,75,1370,580,{kind:'receipt'});
    ['日期 / 时间','项目','现金变动','成本'].forEach((t,i)=>this.label(b,t,[40,320,1060,1240][i],91,[270,700,170,135][i],35,22));
    const kinds:Record<string,string>={purchase:'收购',sale:'售出',rent:'租金',supplies:'耗材',recycle:'回收',commission:'委托'};
    const rows=s.ledger.slice(-11).reverse();
    rows.forEach((r,i)=>{
      const y=141+i*43;
      this.ui.panel(b,33,y,1345,40,{fill:i%2?'#D9C99C':'#EADBBA',stroke:'#D6C59A00',radius:0});
      this.label(b,`第${r.day}天 · ${r.minute}分`,43,y+5,260,30,19);
      this.label(b,`${kinds[r.kind]||r.kind}  ${r.label}`,320,y+5,710,30,19);
      this.label(b,`${r.amount>0?'+':''}${r.amount}`,1060,y+5,165,30,20,r.amount>=0?'#315E43':'#994B32');
      this.label(b,r.cost==null?'—':`${r.cost}`,1240,y+5,120,30,19);
    });
    if(!rows.length)this.label(b,'账本还是空白，第一笔生意会记在这里。',90,265,1200,70,27,'#867450','center');
  }
  private drawCommission(b:Node):void {
    const s=this.state;
    this.label(b,'把六件回收小物送到合适的分类箱，赚取40票社区报酬。',20,0,1380,45,26,colors.pale);
    this.label(b,'完整委托占用90分钟；开工后可暂停，进度自动保存。',20,52,1380,34,20,colors.gold);
    if(s.commission==='available')this.button(b,'开始社区委托',470,135,480,72,()=>this.dispatch({type:'START_COMMISSION'}),'gold',remainingMinutes(s)<90||!!s.trade);
    commissionParts.forEach((part,i)=>{
      const x=20+(i%3)*465,y=247+Math.floor(i/3)*205,done=s.sorted.includes(i);
      this.ui.panel(b,x,y,443,185,{fill:done?'#71866B':colors.paper,stroke:colors.gold,radius:7});
      this.label(b,done?'✓ 已分类':part.name,x+20,y+17,400,42,27);
      (Object.keys(categories) as Category[]).forEach((c,j)=>this.button(b,categories[c].name,x+12+j*142,y+110,133,48,()=>this.dispatch({type:'SORT',index:i,category:c}),'green',s.commission!=='active'||done));
    });
  }
  private drawSettings(b:Node):void {
    this.label(b,'浏览器直接游玩 · 无需安装',80,20,1260,55,32,colors.pale);
    const opts:[keyof Prefs,string,string][]=[['sound','游戏声音','点击、门铃与交割反馈'],['reducedMotion','减少动态','关闭场景漂浮与界面弹性'],['largeText','放大文字','提高主要界面的字号']];
    opts.forEach(([key,title,desc],i)=>{
      const y=110+i*110;
      this.ui.panel(b,80,y,1260,92,{fill:colors.paper,stroke:colors.gold,radius:8});
      this.label(b,title,107,y+13,780,34,26);
      this.label(b,desc,107,y+51,780,25,18,'#7F7152');
      this.button(b,this.prefs[key]?'开启':'关闭',1120,y+21,180,52,()=>this.toggle(key),this.prefs[key]?'green':'quiet');
    });
    this.button(b,'导出存档备份',80,480,400,62,()=>this.exportSave(),'gold');
    this.button(b,'重新开始七日经营',500,480,400,62,()=>this.confirmReset(),'quiet');
    this.button(b,'返回游戏',920,480,420,62,()=>{this.panel=null;this.render();});
    this.label(b,'操作：拖动旧物 / R旋转 / F查看铭牌 / 滚轮缩放 / Esc返回\n档案存储在当前浏览器中，清理站点数据前请导出备份。',80,584,1260,85,21,colors.pale);
  }
  private drawClosing(b:Node):void {
    const due=rentDue(this.state.day),total=15+due;
    this.label(b,'合上账本前，再看一眼今天的收支。',80,40,1260,70,34,colors.pale,'center');
    this.ui.panel(b,310,155,800,260,{fill:colors.paper,stroke:colors.gold,radius:9});
    [`手头现金           ${this.state.cash} 票`,`每日耗材             −15 票`,`到期租金             −${due} 票`,`结算后现金           ${this.state.cash-total} 票`].forEach((v,i)=>this.label(b,v,360,184+i*53,700,43,i===3?29:25));
    this.label(b,this.state.cash<total?'当前现金不足以结清费用，结算将结束本轮经营。':'尚未交割的交易会取消，物品不会丢失。',200,450,1020,70,24,colors.pale,'center');
    this.button(b,'确认打烊并结算',400,558,620,68,()=>this.dispatch({type:'SETTLE'}),'gold');
  }
  private drawReport():void {
    const s=this.state,r=s.report;if(!r)return;
    const m=this.ui.modal(`第${s.day}天 · 营业札记`,{width:1240,height:790,disableClose:true});this.modalRoot=m.overlay;
    const b=m.body;
    this.ui.paper(b,50,20,1080,430,{kind:'receipt'});
    const rows=[['营业收入',`＋${r.income}票`],['收购支出',`−${r.purchases}票`],['已付固定费用',`−${r.fees}票`],['已实现销售毛利',`${r.gross}票`],['期末现金',`${s.cash}票`]];
    rows.forEach(([k,v],i)=>{this.label(b,k,85,53+i*75,670,50,28);this.label(b,v,770,53+i*75,310,50,30,colors.ink,'right');});
    this.label(b,s.outcome?'七日之约走到了这一页。':'灯光暗下来，旧物的故事留在账本里。',50,480,1080,55,27,colors.pale,'center');
    this.button(b,s.outcome?'翻到故事的最后一页':`迎接第${s.day+1}天`,285,555,610,65,()=>this.dispatch({type:'NEXT'}),'gold');
  }
  private drawEnding():void {
    const s=this.state;
    const win=s.outcome==='win',survive=s.outcome==='survive';
    const m=this.ui.modal(win?'这盏灯，会继续亮着':survive?'小店还在，故事待续':'暂时，把门轻轻带上',{width:1320,height:800,disableClose:true});this.modalRoot=m.overlay;
    const b=m.body;
    this.ui.image(b,'shop',25,20,550,390,{fit:'cover'});
    this.label(b,win?'旧物找到了新家，\n你也一样。':survive?'站台还有来客，\n明天还有机会。':'每一次重新开门，\n都是新的开始。',630,45,580,130,40,colors.pale);
    this.label(b,`经营了${s.day}天，售出${s.sold}件旧物。\n期末现金 ${s.cash}票 / 目标120票\n店铺信誉 ${s.reputation} / 目标40\n累计售出 ${s.sold}件 / 目标12件`,630,220,580,190,26,colors.gold);
    this.button(b,'再开一次店',310,490,620,72,()=>{this.state=createGame(`GREYLINE-${Date.now().toString(36)}`);this.panel=null;this.save();this.render();},'gold');
  }
  private drawOffer():void {
    const t=this.state.trade;if(!t)return;
    const m=this.ui.modal('商量一个合适的价格',{width:930,height:570,onClose:()=>{this.render();}});this.modalRoot?.removeFromParent();this.modalRoot?.destroy();this.modalRoot=m.overlay;
    const b=m.body;this.offer=t.price;
    this.renderOfferValue(b);
    const refresh=()=>this.renderOfferValue(b);
    this.button(b,'−10',80,220,190,65,()=>{this.offer=Math.max(1,this.offer-10);refresh();},'quiet');
    this.button(b,'＋10',580,220,190,65,()=>{this.offer+=10;refresh();},'quiet');
    this.button(b,'递上报价',290,220,270,65,()=>{this.panel=null;this.dispatch({type:'OFFER',price:this.offer});},'gold');
    this.label(b,`还剩${3-t.rounds}轮机会；每轮消耗4分钟。`,80,330,690,65,24,colors.pale,'center');
  }
  private renderOfferValue(b:Node):void {
    const old=b.getChildByName('OfferValue');old?.removeFromParent();old?.destroy();
    const n=this.label(b,`${this.offer} 票`,220,70,410,90,55,colors.pale,'center');n.name='OfferValue';
  }
  private confirmRecycle(item:ItemInstance):void {
    const m=this.ui.modal('确认回收这件旧物',{width:1000,height:600,onClose:()=>this.render()});this.modalRoot?.removeFromParent();this.modalRoot?.destroy();this.modalRoot=m.overlay;
    this.ui.item(m.body,item.defId,40,40,280,260);
    this.label(m.body,`${getItemDef(item.defId).name}\n回收所得 ${Math.floor(trueValue(item,this.state.market)*0.35)}票\n耗时6分钟；回收后无法取回，不增加售出件数。`,360,55,550,200,28,colors.pale);
    this.button(m.body,'确认回收',360,325,500,62,()=>this.dispatch({type:'RECYCLE',uid:item.uid}),'danger');
  }
  private confirmReset():void {
    const m=this.ui.modal('重新开始经营',{width:1000,height:510,onClose:()=>this.render()});this.modalRoot?.removeFromParent();this.modalRoot?.destroy();this.modalRoot=m.overlay;
    this.label(m.body,'这会覆盖当前浏览器的经营进度。\n建议先导出存档备份。',70,45,800,130,30,colors.pale,'center');
    this.button(m.body,'保留当前进度',80,240,350,65,()=>this.render(),'quiet');
    this.button(m.body,'确认重新开始',475,240,350,65,()=>{this.state=createGame();this.panel=null;this.save();this.render();},'danger');
  }
  private toggle(key:keyof Prefs):void {
    this.prefs[key]=!this.prefs[key];
    if(key==='reducedMotion')this.motion.configure({reducedMotion:this.prefs.reducedMotion});
    try{sys.localStorage.setItem(PREFS_KEY,JSON.stringify(this.prefs));}catch{}
    this.render();
    if(key==='sound'&&this.prefs.sound)this.sound('open');
  }
  private async loadAudio():Promise<void> {
    for(const name of ['click','coin','check','page','reject','drop','open']) {
      try {
        const clip=await new Promise<AudioClip>((resolve,reject)=>{
          if(typeof window!=='undefined'&&(window as unknown as {__GREYLINE_WEB__?:boolean}).__GREYLINE_WEB__)assetManager.loadRemote<AudioClip>(`./resources/audio/${name}.wav`,(e,v)=>e?reject(e):resolve(v));
          else resources.load<AudioClip>(`audio/${name}`,AudioClip,(e,v)=>e?reject(e):resolve(v));
        });this.clips.set(name,clip);
      }catch{/* Audio is optional; all necessary feedback is also visual. */}
    }
  }
  private sound(name:string):void {const clip=this.clips.get(name);if(this.prefs.sound&&clip)this.audio.playOneShot(clip,0.45);}
  private exportSave():void {
    if(!sys.isBrowser)return;
    const url=URL.createObjectURL(new Blob([serializeGame(this.state)],{type:'application/json'}));
    const a=document.createElement('a');a.href=url;a.download=`greyline-day-${this.state.day}.json`;a.click();URL.revokeObjectURL(url);
    this.ui.toast('存档备份已导出');
  }
  private valueText(value:unknown):string {
    if(typeof value==='number')return `${value}票`;
    const v=value as Record<string,number|boolean>;
    if(v&&typeof v==='object'&&v.exact)return `${v.price}票`;
    if(v&&typeof v==='object')return `${v.low??v.min??v.center??0}–${v.high??v.max??v.center??0}票`;
    return '待核验';
  }
  private hit(node:Node,p:Vec2):boolean {return !!node.getComponent<UITransform>(UITransform)?.hitTest(p);}
  private allNodes(root:Node):Node[] {return [root,...root.children.flatMap(n=>this.allNodes(n))];}
  private collectControls():{name:string;x:number;y:number;w:number;h:number}[] {
    const root=this.ui['root'] as Node|undefined;
    return this.allNodes(root||this.node).filter(n=>!!(n as unknown as {__action?:()=>void}).__action).map(n=>{
      const r=n.getComponent<UITransform>(UITransform)!.getBoundingBoxToWorld();
      return{name:n.name,x:r.x+W/2,y:H/2-r.y-r.height,w:r.width,h:r.height};
    });
  }
  private clickControl(name:string):boolean {
    const node=this.allNodes(this.node).find(n=>n.name===name&&(n as unknown as {__action?:()=>void}).__action);
    if(!node)return false;(node as unknown as {__action:()=>void}).__action();return true;
  }
  private onKey(e:EventKeyboard):void {
    if(this.busy){if(e.keyCode===KeyCode.SPACE||e.keyCode===KeyCode.ESCAPE)this.skipMotion();return;}
    if(e.keyCode===KeyCode.TAB){
      const buttons=this.allNodes(this.modalRoot||this.shell).filter(n=>(n as unknown as {__enabled?:boolean}).__enabled&&n.activeInHierarchy);
      if(buttons.length){this.focusIndex=(this.focusIndex+1)%buttons.length;this.focused=buttons[this.focusIndex];this.ui.focusButton(this.focused);}
      return;
    }
    if((e.keyCode===KeyCode.ENTER||e.keyCode===KeyCode.SPACE)&&this.focused?.isValid){(this.focused as unknown as {__action:()=>void}).__action();return;}
    if(this.panel==='inspect'&&this.object){const moves:Record<number,[number,number]>={[KeyCode.ARROW_LEFT]:[-12,0],[KeyCode.ARROW_RIGHT]:[12,0],[KeyCode.ARROW_UP]:[0,12],[KeyCode.ARROW_DOWN]:[0,-12]};const delta=moves[e.keyCode];if(delta)this.object.setPosition(this.object.position.x+delta[0],this.object.position.y+delta[1]);}
    if(e.keyCode===KeyCode.ESCAPE){if(this.state.phase==='report'||this.state.phase==='ending')return;this.closePanel();}
    if(this.panel==='inspect'&&e.keyCode===KeyCode.KEY_R&&this.object)this.object.angle+=15;
    if(this.panel==='inspect'&&e.keyCode===KeyCode.KEY_F){this.plate=!this.plate;this.render();}
    if(!this.panel&&e.keyCode===KeyCode.KEY_I)this.open('inventory');
  }
  update(dt:number):void {
    if(!this.ui)return;
    this.motion?.update(dt);
    if(this.cashTween){
      const c=this.cashTween;c.elapsed+=dt;
      if(!c.node.isValid){this.cashTween=null;return;}
      const t=Math.min(1,c.elapsed/0.7),e=1-Math.pow(1-t,3);
      c.node.getComponent<Label>(Label)!.string=`${Math.round(c.from+(c.to-c.from)*e)}票`;
      if(t===1)this.cashTween=null;
    }
  }
  onDestroy():void {this.disposed=true;this.motion?.dispose();input.off(Input.EventType.KEY_DOWN,this.onKey,this);}
}
