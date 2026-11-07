import {
  assetManager, BlockInputEvents, Button, Color, EventTouch, Font, Graphics,
  ImageAsset, Label, Node, Rect, resources, Size, SpriteFrame, Texture2D,
  Tween, tween, UIOpacity, UITransform, Vec2, Vec3,
} from 'cc';
import {
  GameUI, type UIAssets, type UIColour, type ButtonTone, type ButtonOptions,
  type PanelOptions, type LabelOptions, type ImageOptions, type PortraitOptions,
  type ModalOptions, type ModalHandle, type PaperOptions, type UIIcon,
} from '../ui/GameUI';
import type { ToolId } from './types';

export const ORBITAL_PALETTE = {
  background: '#0B111B', deep: '#10161F', panel: '#142331', raised: '#1B303D',
  cyan: '#6EE0DE', orange: '#DB8A52', purple: '#9A81CC', text: '#E4EBE7',
  muted: '#91A9B6', line: '#456373', danger: '#E38C79', green: '#8EC6A7',
};
export type NpcMood = 'neutral'|'focused'|'question'|'happy'|'reject'|'tired';
const MOOD_ART:Record<Exclude<NpcMood,'neutral'>,string>={
  focused:'orbital-characters-focused',question:'orbital-characters-question',
  happy:'orbital-characters-happy',reject:'orbital-characters-reject',tired:'orbital-characters-tired',
};
const P0_ITEMS = [1,2,3,9,10,11,17,18,19,25,26,27,33,34,35,41,42,43,48,49,50,55,56,57];
const ORBITAL_ART = [
  'orbital-counter','orbital-workbench','orbital-warehouse',
  'orbital-items-front','orbital-items-back','orbital-characters','hands',
];
interface OrbitalButton {
  component:Button; visual:Node; ink:Graphics; text:Label; width:number;height:number;
  tone:ButtonTone;hovered:boolean;pressed:boolean;focused:boolean;selected:boolean;disabled:boolean;
}
export interface ObjectOptions extends ImageOptions {back?:boolean;opened?:boolean;repaired?:boolean;damaged?:boolean}

/** Industrial science-fiction native UI; no retained wood, brass or paper skins. */
export class OrbitalUI extends GameUI {
  private readonly orbitalRemoteRoot:string;
  private readonly orbitalStandalone:boolean;
  private readonly orbitalExt:'png'|'webp';
  private readonly orbitalCrops=new Map<string,SpriteFrame>();
  private readonly orbitalButtons=new WeakMap<Node,OrbitalButton>();
  private readonly orbitalMoods=new Map<string,NpcMood>();
  private readonly missingMoodAssets=new Set<string>();
  private orbitalFocus:Node|null=null;
  private orbitalToastRoot:Node|null=null;
  private orbitalToastCount=0;

  constructor(root:Node,assets:UIAssets={}) {
    super(root,assets);
    const host=globalThis as typeof globalThis & {__GREYLINE_WEB__?:boolean;__GREYLINE_ART_EXT__?:string};
    this.orbitalRemoteRoot=(assets.remoteRoot??'./resources').replace(/\/$/,'');
    this.orbitalStandalone=assets.standalone??!!host.__GREYLINE_WEB__;
    this.orbitalExt=host.__GREYLINE_ART_EXT__==='webp'?'webp':'png';
  }

  override async preload():Promise<void> {
    await Promise.all(ORBITAL_ART.map(async key=>{
      if(this.frames.has(key))return;
      this.frames.set(key,await this.orbitalLoad(key));
    }));
    this.missingMoodAssets.clear();
    await Promise.all(Object.values(MOOD_ART).map(async key=>{
      if(this.frames.has(key))return;
      try{this.frames.set(key,await this.orbitalLoad(key));}
      catch(error){
        this.missingMoodAssets.add(key);
        console.warn(`[OrbitalUI] ${key} 未能加载，暂用中性立绘。`,error);
      }
    }));
    if(!this.font&&!this.orbitalStandalone)this.font=await new Promise<Font|null>(resolve=>{
      resources.load<Font>('fonts/orbital-sans',Font,(error,font)=>resolve(error?null:font));
    });
  }
  override async preloadAll():Promise<void>{await this.preload();}

  override label(parent:Node,text:string,x:number,y:number,width:number,height:number,options:LabelOptions={}):Node {
    const node=super.label(parent,text,x,y,width,height,{color:ORBITAL_PALETTE.text,...options});
    if(!this.font)node.getComponent<Label>(Label)!.fontFamily='Orbital Sans SC, Noto Sans CJK SC, sans-serif';
    return node;
  }

  override panel(parent:Node,x:number,y:number,width:number,height:number,options:PanelOptions={}):Node {
    const node=this.container(parent,x,y,width,height,options.name??'tech-panel');
    const g=node.addComponent<Graphics>(Graphics);
    const radius=Math.max(0,options.radius??7);
    const cut=Math.min(radius,width/5,height/4);
    if(options.shadow){g.fillColor=color('#00000065');polygon(g,5,-6,width,height,cut);g.fill();}
    g.fillColor=color(options.fill??ORBITAL_PALETTE.panel);polygon(g,0,0,width,height,cut);g.fill();
    if((options.lineWidth??1)>0){
      g.lineWidth=options.lineWidth??1;g.strokeColor=color(options.stroke??ORBITAL_PALETTE.line);
      polygon(g,.6,-.6,width-1.2,height-1.2,cut);g.stroke();
      if(width>=200&&height>=100){
        g.strokeColor=color('#6EE0DE2B');g.lineWidth=1;
        g.moveTo(14,-7);g.lineTo(Math.min(width-14,74),-7);g.stroke();
        g.moveTo(width-14,-height+7);g.lineTo(Math.max(14,width-74),-height+7);g.stroke();
      }
    }
    alpha(node,options.opacity);return node;
  }

  override button(parent:Node,text:string,x:number,y:number,width:number,height:number,onClick:(event?:EventTouch)=>void,options:ButtonOptions={}):Node {
    const node=this.container(parent,x,y,width,height,options.name??`button-${text}`);
    const visual=this.container(node,0,0,width,height,'tech-button-surface');
    const ink=visual.addComponent<Graphics>(Graphics);
    const labelNode=this.label(visual,text,12,0,width-24,height,{size:options.size??21,bold:true,align:'center',verticalAlign:'center',wrap:false});
    const component=node.addComponent<Button>(Button);component.transition=Button.Transition.NONE;component.interactable=!options.disabled;
    const view:OrbitalButton={component,visual,ink,text:labelNode.getComponent<Label>(Label)!,width,height,tone:options.tone??'green',hovered:false,pressed:false,focused:options.focused??false,selected:options.selected??false,disabled:options.disabled??false};
    this.orbitalButtons.set(node,view);this.orbitalDrawButton(view);
    node.on(Node.EventType.MOUSE_ENTER,()=>{if(view.disabled)return;view.hovered=true;this.orbitalDrawButton(view);});
    node.on(Node.EventType.MOUSE_LEAVE,()=>{view.hovered=false;this.orbitalDrawButton(view);});
    node.on(Node.EventType.TOUCH_START,()=>{if(view.disabled)return;view.pressed=true;this.orbitalPress(view,true);this.orbitalDrawButton(view);});
    const release=()=>{view.pressed=false;this.orbitalPress(view,false);this.orbitalDrawButton(view);};
    node.on(Node.EventType.TOUCH_CANCEL,release);node.on(Node.EventType.TOUCH_END,release);
    node.on(Button.EventType.CLICK,(_button:Button,event?:EventTouch)=>{if(!view.disabled)onClick(event);});
    alpha(node,options.opacity);return node;
  }
  override setButtonEnabled(node:Node,enabled:boolean):void {
    const view=this.orbitalButtons.get(node);if(!view)return;
    view.disabled=!enabled;view.component.interactable=enabled;view.pressed=false;
    if(!enabled){view.hovered=false;view.focused=false;if(this.orbitalFocus===node)this.orbitalFocus=null;}
    this.orbitalPress(view,false);this.orbitalDrawButton(view);
  }
  override setButtonSelected(node:Node,selected:boolean):void {const v=this.orbitalButtons.get(node);if(v){v.selected=selected;this.orbitalDrawButton(v);}}
  override focusButton(node:Node|null):void {
    if(this.orbitalFocus?.isValid){const previous=this.orbitalButtons.get(this.orbitalFocus);if(previous){previous.focused=false;this.orbitalDrawButton(previous);}}
    const view=node?this.orbitalButtons.get(node):undefined;
    this.orbitalFocus=node&&view&&!view.disabled?node:null;
    if(view&&this.orbitalFocus){view.focused=true;this.orbitalDrawButton(view);}
  }

  override modal(title:string,options:ModalOptions={}):ModalHandle {
    const width=options.width??1500,height=options.height??830;
    const overlay=this.panel(this.root,0,0,1600,900,{name:'modal-overlay',fill:'#070D16E8',lineWidth:0,radius:0});
    overlay.addComponent<BlockInputEvents>(BlockInputEvents);
    const surface=this.panel(overlay,(1600-width)/2,(900-height)/2,width,height,{name:'modal-surface',fill:'#101C28FA',stroke:'#5B8292',lineWidth:1.5,radius:12,shadow:true});
    this.panel(surface,1,1,width-2,77,{fill:'#192E3C',stroke:'#00000000',lineWidth:0,radius:10});
    this.panel(surface,25,27,5,27,{fill:ORBITAL_PALETTE.cyan,lineWidth:0,radius:0});
    this.label(surface,title,45,19,width-144,43,{size:29,bold:true});
    this.line(surface,25,77,width-25,77,'#6EE0DE55');
    const body=this.container(surface,30,96,width-60,height-123,'modal-body');
    let closed=false;
    const close=()=>{if(closed)return;closed=true;this.animateOut(surface,()=>{if(overlay.isValid){overlay.removeFromParent();overlay.destroy();}options.onClose?.();});};
    if(!options.disableClose)this.button(surface,'×',width-65,19,39,39,close,{tone:'quiet',size:30});
    this.animateIn(surface);return{overlay,body,close};
  }

  override animateIn(node:Node,delay=0):void {
    const opacity=node.getComponent<UIOpacity>(UIOpacity)??node.addComponent<UIOpacity>(UIOpacity);
    Tween.stopAllByTarget(node);Tween.stopAllByTarget(opacity);
    if(this.reducedMotion){opacity.opacity=255;return;}
    // The interactive geometry stays fixed while the panel powers up.
    opacity.opacity=0;tween<UIOpacity>(opacity).delay(delay).to(.2,{opacity:255},{easing:'quadOut'}).start();
  }
  override animateOut(node:Node,completed:()=>void,duration=.16):void {
    if(!node.isValid||this.reducedMotion){completed();return;}
    const opacity=node.getComponent<UIOpacity>(UIOpacity)??node.addComponent<UIOpacity>(UIOpacity);
    Tween.stopAllByTarget(node);Tween.stopAllByTarget(opacity);
    tween<UIOpacity>(opacity).to(duration,{opacity:0}).call(completed).start();
  }

  override toast(message:string,tone:'info'|'success'|'error'='info'):Node {
    if(!this.orbitalToastRoot?.isValid)this.orbitalToastRoot=this.container(this.root,0,0,1600,900,'orbital-notifications');
    this.orbitalToastRoot.setSiblingIndex(this.root.children.length-1);
    const index=this.orbitalToastCount++,width=Math.min(1130,Math.max(380,message.length*22+70));
    const tint=tone==='error'?ORBITAL_PALETTE.danger:tone==='success'?ORBITAL_PALETTE.green:ORBITAL_PALETTE.cyan;
    const node=this.panel(this.orbitalToastRoot,(1600-width)/2,95+(index%3)*65,width,55,{name:'toast',fill:'#102331FA',stroke:tint,lineWidth:1.6,radius:8,shadow:true});
    this.label(node,message,22,5,width-44,45,{size:21,color:ORBITAL_PALETTE.text,align:'center',verticalAlign:'center'});
    const opacity=node.getComponent<UIOpacity>(UIOpacity)??node.addComponent<UIOpacity>(UIOpacity);
    opacity.opacity=this.reducedMotion?255:0;const sequence=tween<UIOpacity>(opacity);
    if(!this.reducedMotion)sequence.to(.12,{opacity:255});
    sequence.delay(2.7).to(.2,{opacity:0}).call(()=>{if(node.isValid){node.removeFromParent();node.destroy();}this.orbitalToastCount=Math.max(0,this.orbitalToastCount-1);}).start();
    return node;
  }

  override progress(parent:Node,value:number,x:number,y:number,width:number,height=8,tint:UIColour=ORBITAL_PALETTE.cyan):Node {
    const node=this.panel(parent,x,y,width,height,{fill:'#0B1520',lineWidth:0,radius:2});
    if(value>0)this.panel(node,0,0,width*Math.min(1,value),height,{fill:tint,lineWidth:0,radius:2});return node;
  }
  override paper(parent:Node,x:number,y:number,width:number,height:number,options:PaperOptions={}):Node {
    return this.panel(parent,x,y,width,height,{name:options.name??'terminal-ticket',fill:options.tint??'#1B303D',stroke:'#6EE0DE66',radius:5,opacity:options.opacity});
  }
  override dialogueFrame(parent:Node,x:number,y:number,width:number,height:number):Node {
    return this.panel(parent,x,y,width,height,{name:'terminal-dialogue',fill:'#112331F2',stroke:'#6EE0DE60',radius:9});
  }
  override cabinetCell(parent:Node,slot:number,x:number,y:number,width:number,height:number):Node {
    return this.panel(parent,x,y,width,height,{name:`storage-cell-${slot}`,fill:'#142A36D9',stroke:'#577482',radius:4});
  }

  techPanel(parent:Node,x:number,y:number,width:number,height:number,title='',accent:UIColour=ORBITAL_PALETTE.cyan):Node {
    const node=this.panel(parent,x,y,width,height,{fill:'#12232FEF',stroke:'#4A6B7C',radius:8});
    this.panel(node,16,18,3,21,{fill:accent,lineWidth:0,radius:0});
    if(title)this.label(node,title,29,12,width-45,34,{size:22,color:accent,bold:true});return node;
  }
  statusChip(parent:Node,text:string,x:number,y:number,width:number,height=30,accent:UIColour=ORBITAL_PALETTE.cyan):Node {
    const node=this.panel(parent,x,y,width,height,{fill:'#152C3A',stroke:accent,lineWidth:1,radius:3});
    this.label(node,text,7,0,width-14,height,{size:16,color:accent,align:'center',verticalAlign:'center',wrap:false});return node;
  }
  tinyTag(parent:Node,text:string,x:number,y:number,width:number,height=25,accent:UIColour=ORBITAL_PALETTE.muted):Node {
    return this.statusChip(parent,text,x,y,width,height,accent);
  }

  override icon(parent:Node,name:UIIcon,x:number,y:number,width:number,height:number):Node {
    if(name==='inspect')return this.toolIcon(parent,'TOL-001',x,y,width,height);
    const node=this.container(parent,x,y,width,height,`icon-${name}`);
    const art=this.container(node,0,0,100,100,'status-symbol');art.setScale(width/100,height/100,1);
    const g=art.addComponent<Graphics>(Graphics);g.strokeColor=color(ORBITAL_PALETTE.cyan);g.fillColor=color('#23414E');g.lineWidth=3;
    if(name==='watch'){
      g.circle(50,-51,31);g.fill();g.stroke();g.moveTo(50,-30);g.lineTo(50,-51);g.lineTo(67,-60);g.stroke();g.moveTo(42,-14);g.lineTo(58,-14);g.stroke();
    }else if(name==='purse'){
      g.roundRect(12,-77,76,51,5);g.fill();g.stroke();g.strokeColor=color(ORBITAL_PALETTE.orange);g.circle(50,-51,14);g.stroke();g.moveTo(55,-42);g.lineTo(44,-42);g.lineTo(44,-59);g.lineTo(55,-59);g.stroke();g.lineWidth=2;g.strokeColor=color('#93B2BC');g.moveTo(20,-68);g.lineTo(32,-68);g.stroke();
    }else if(name==='keys'){
      g.roundRect(26,-82,48,51,5);g.fill();g.stroke();g.moveTo(36,-31);g.lineTo(36,-23);g.bezierCurveTo(36,-5,64,-5,64,-23);g.lineTo(64,-31);g.stroke();g.fillColor=color(ORBITAL_PALETTE.orange);g.circle(50,-52,6);g.fill();g.rect(47,-68,6,13);g.fill();
    }else if(name==='seal'){
      g.moveTo(22,-14);g.lineTo(78,-14);g.lineTo(78,-56);g.lineTo(50,-87);g.lineTo(22,-56);g.close();g.fill();g.stroke();g.strokeColor=color(ORBITAL_PALETTE.orange);g.moveTo(35,-46);g.lineTo(46,-57);g.lineTo(67,-34);g.stroke();
    }else if(name==='refuse'){
      g.circle(50,-50,31);g.fill();g.stroke();g.strokeColor=color(ORBITAL_PALETTE.orange);g.moveTo(29,-29);g.lineTo(71,-71);g.stroke();
    }else{
      g.roundRect(23,-87,54,74,4);g.fill();g.stroke();g.strokeColor=color(name==='deal'?ORBITAL_PALETTE.orange:ORBITAL_PALETTE.cyan);
      for(let i=0;i<3;i++){g.moveTo(35,-31-i*14);g.lineTo(65,-31-i*14);g.stroke();}
      if(name==='deal'){g.moveTo(36,-69);g.lineTo(46,-78);g.lineTo(63,-60);g.stroke();}
    }
    return node;
  }

  materialIcon(parent:Node,id:string,x:number,y:number,width:number,height=width):Node {
    const node=this.container(parent,x,y,width,height,`material-${id}`);
    const art=this.container(node,0,0,100,100,'material-shape');art.setScale(width/100,height/100,1);
    const g=art.addComponent<Graphics>(Graphics);g.lineWidth=2.4;g.strokeColor=color('#97B6C0');g.fillColor=color('#314C59');
    const index=Number(id.slice(-3));
    if(index===1||index===3){
      g.roundRect(22,-74,56,48,5);g.fill();g.stroke();g.strokeColor=color(index===1?'#C1865B':'#6EB7C8');g.lineWidth=4;
      for(let i=0;i<6;i++){g.ellipse(50,-32-i*7,27,10);g.stroke();}g.moveTo(25,-70);g.bezierCurveTo(8,-92,84,-91,86,-75);g.stroke();
    }else if(index===2){
      g.fillColor=color('#B7BDB3');g.moveTo(16,-31);g.lineTo(57,-22);g.lineTo(83,-50);g.lineTo(69,-77);g.lineTo(30,-82);g.lineTo(18,-63);g.close();g.fill();g.stroke();g.strokeColor=color('#5D7D88');g.moveTo(58,-28);g.lineTo(50,-51);g.lineTo(56,-70);g.stroke();
    }else if(index===4){
      g.fillColor=color('#A8C6C2');g.roundRect(17,-76,66,51,4);g.fill();g.stroke();g.fillColor=color('#DB8A52');g.rect(25,-66,9,29);g.fill();g.strokeColor=color('#30545B');g.lineWidth=2;for(let i=0;i<5;i++){g.moveTo(43+i*6,-38);g.lineTo(43+i*6,-63);g.stroke();}
    }else if(index===5){
      g.fillColor=color('#3D8D9C');g.roundRect(18,-83,26,65,8);g.roundRect(56,-83,26,65,8);g.fill();g.stroke();g.strokeColor=color('#ACDDE2');for(let i=0;i<3;i++){g.moveTo(24,-35-i*13);g.lineTo(35,-35-i*13);g.moveTo(62,-35-i*13);g.lineTo(73,-35-i*13);g.stroke();}
    }else{
      g.fillColor=color('#73A8BE55');g.ellipse(50,-50,34,29);g.fill();g.stroke();g.strokeColor=color('#BBE7E7');g.ellipse(50,-50,23,20);g.stroke();g.moveTo(27,-39);g.lineTo(42,-27);g.stroke();g.moveTo(58,-73);g.lineTo(75,-57);g.stroke();
    }
    return node;
  }

  override item(parent:Node,itemId:string,x:number,y:number,width:number,height:number,options:ImageOptions={}):Node {
    return this.object(parent,itemId,x,y,width,height,options);
  }
  object(parent:Node,itemId:string,x:number,y:number,width:number,height:number,options:ObjectOptions={}):Node {
    if(itemId==='BND-001')return this.maintenanceBundle(parent,x,y,width,height,options);
    const index=P0_ITEMS.indexOf(Number(itemId.replace(/^ITM-/i,'')));
    const key=options.back?'orbital-items-back':'orbital-items-front';
    const source=index>=0?this.orbitalCrop(key,index,6,4,.035):undefined;
    const node=this.frame(parent,source,x,y,width,height,{name:`item-${itemId}`,fit:'contain',...options});
    const short=Math.min(width,height);
    if(options.damaged){
      const layer=this.container(node,0,0,width,height,'physical-damage');const g=layer.addComponent<Graphics>(Graphics);
      g.lineWidth=Math.max(1.5,short*.008);g.strokeColor=color('#0A1424');
      const cx=width*.49,cy=-height*.47;g.moveTo(cx-short*.13,cy+short*.12);g.lineTo(cx-short*.04,cy+short*.035);g.lineTo(cx-short*.065,cy-short*.035);g.lineTo(cx+short*.03,cy-short*.11);g.stroke();
      g.strokeColor=color('#C0D1CE88');g.lineWidth=Math.max(1,short*.003);g.moveTo(cx-short*.12,cy+short*.11);g.lineTo(cx-short*.035,cy+short*.03);g.stroke();
    }
    if(options.opened){
      const layer=this.container(node,width*.19,height*.35,width*.62,height*.38,'exposed-components');const g=layer.addComponent<Graphics>(Graphics);
      const w=width*.62,h=height*.38;
      g.fillColor=color('#0A1119');g.roundRect(0,-h,w,h,Math.min(9,short*.025));g.fill();g.strokeColor=color('#779AA3');g.lineWidth=2;g.roundRect(0,-h,w,h,Math.min(9,short*.025));g.stroke();
      g.fillColor=color('#23534C');g.rect(w*.08,-h*.82,w*.62,h*.65);g.fill();
      g.strokeColor=color('#B78E58');g.lineWidth=Math.max(2,short*.007);
      for(let i=0;i<4;i++){const yy=h*(.25+i*.14);g.moveTo(w*.14,-yy);g.lineTo(w*.34,-yy);g.lineTo(w*.44,-yy-h*.08);g.lineTo(w*.66,-yy-h*.08);g.stroke();}
      g.fillColor=color('#253946');g.roundRect(w*.3,-h*.67,w*.28,h*.38,4);g.fill();
      g.fillColor=color('#6EE0DE');g.circle(w*.8,-h*.31,short*.018);g.fill();
      for(const [sx,sy]of [[.08,.12],[.92,.12],[.08,.88],[.92,.88]]){g.fillColor=color('#A9B5B5');g.circle(w*sx,-h*sy,short*.014);g.fill();g.strokeColor=color('#263843');g.lineWidth=1;g.moveTo(w*sx-short*.007,-h*sy);g.lineTo(w*sx+short*.007,-h*sy);g.stroke();}
    }
    if(options.repaired){
      const layer=this.container(node,width*.51,height*.61,width*.22,height*.13,'repair-patch');layer.angle=-9;
      const g=layer.addComponent<Graphics>(Graphics),w=width*.22,h=height*.13;
      g.fillColor=color('#8CA6A5');g.roundRect(0,-h,w,h,2);g.fill();g.strokeColor=color('#B7D5CF');g.lineWidth=1.5;g.roundRect(0,-h,w,h,2);g.stroke();
      g.fillColor=color('#435F65');g.circle(w*.13,-h*.5,Math.max(1.5,short*.006));g.circle(w*.87,-h*.5,Math.max(1.5,short*.006));g.fill();
      for(let i=0;i<3;i++){g.strokeColor=color('#5B777E');g.moveTo(w*.34+i*w*.12,-h*.25);g.lineTo(w*.28+i*w*.12,-h*.73);g.stroke();}
    }
    return node;
  }

  /** REC-006 visibly joins the actual servo and bearing assets in one wired frame. */
  private maintenanceBundle(parent:Node,x:number,y:number,width:number,height:number,options:ObjectOptions):Node {
    const node=this.container(parent,x,y,width,height,options.name??'item-BND-001');
    const scale=Math.min(width/1000,height/700);
    const art=this.container(node,(width-1000*scale)/2,(height-700*scale)/2,1000,700,'maintenance-assembly');
    art.setScale(scale,scale,1);
    const chassis=this.container(art,0,0,1000,700,'assembly-frame').addComponent<Graphics>(Graphics);
    chassis.fillColor=color('#152630');polygon(chassis,71,-146,855,470,27);chassis.fill();
    chassis.strokeColor=color('#98A9AB');chassis.lineWidth=15;polygon(chassis,71,-146,855,470,27);chassis.stroke();
    chassis.strokeColor=color('#384D58');chassis.lineWidth=8;polygon(chassis,91,-166,815,430,20);chassis.stroke();
    chassis.fillColor=color('#344750');chassis.roundRect(377,-151,246,78,18);chassis.fill();
    chassis.strokeColor=color('#A9B8B7');chassis.lineWidth=11;chassis.roundRect(377,-151,246,78,18);chassis.stroke();
    chassis.fillColor=color('#0C1922');chassis.roundRect(402,-136,196,43,8);chassis.fill();
    chassis.fillColor=color('#263C48');chassis.roundRect(156,-536,688,347,18);chassis.fill();
    chassis.strokeColor=color('#506A76');chassis.lineWidth=2;
    for(let i=0;i<6;i++){const yy=212+i*53;chassis.moveTo(172,-yy);chassis.lineTo(828,-yy);chassis.stroke();}
    // Parts retain their own silhouettes and their real reverse artwork.
    this.object(art,'ITM-026',133,190,435,310,{back:options.back,damaged:options.damaged});
    this.object(art,'ITM-027',535,197,290,290,{back:options.back});
    const bridge=this.container(art,0,0,1000,700,'assembly-interconnect').addComponent<Graphics>(Graphics);
    bridge.strokeColor=color('#0A1118');bridge.lineWidth=20;
    bridge.moveTo(506,-365);bridge.bezierCurveTo(575,-360,512,-504,652,-497);bridge.lineTo(686,-424);bridge.stroke();
    bridge.strokeColor=color('#C17B4D');bridge.lineWidth=10;
    bridge.moveTo(506,-365);bridge.bezierCurveTo(575,-360,512,-504,652,-497);bridge.lineTo(686,-424);bridge.stroke();
    bridge.strokeColor=color('#70BFC8');bridge.lineWidth=8;
    bridge.moveTo(478,-397);bridge.bezierCurveTo(510,-460,430,-530,589,-536);bridge.lineTo(742,-451);bridge.stroke();
    bridge.fillColor=color('#1E3440');bridge.roundRect(235,-587,533,69,10);bridge.fill();
    bridge.strokeColor=color('#94AAAE');bridge.lineWidth=3;bridge.roundRect(235,-587,533,69,10);bridge.stroke();
    for(let i=0;i<6;i++){
      const xx=273+i*73;bridge.fillColor=color('#081821');bridge.roundRect(xx,-571,45,35,3);bridge.fill();
      bridge.fillColor=color('#B18A54');bridge.rect(xx+8,-562,29,15);bridge.fill();
    }
    for(const xx of [91,851]){
      bridge.fillColor=color('#A97748');bridge.roundRect(xx,-559,57,67,8);bridge.fill();
      bridge.strokeColor=color('#DFC09A');bridge.lineWidth=3;bridge.roundRect(xx,-559,57,67,8);bridge.stroke();
    }
    bridge.fillColor=color('#AEC3C0');
    for(const [bx,by]of [[110,184],[885,184],[110,581],[885,581]]){bridge.circle(bx,-by,9);bridge.fill();}
    bridge.fillColor=color('#82CFB2');bridge.roundRect(812,-222,63,29,3);bridge.fill();
    bridge.strokeColor=color('#183F37');bridge.lineWidth=4;bridge.moveTo(825,-209);bridge.lineTo(836,-218);bridge.lineTo(863,-198);bridge.stroke();
    if(options.opened){
      bridge.fillColor=color('#0D1D28');bridge.roundRect(626,-631,186,29,4);bridge.fill();
      bridge.strokeColor=color('#90BAC2');bridge.lineWidth=3;bridge.roundRect(626,-631,186,29,4);bridge.stroke();
      for(let i=0;i<6;i++){bridge.fillColor=color('#B39562');bridge.rect(642+i*26,-625,11,17);bridge.fill();}
    }
    alpha(node,options.opacity);return node;
  }

  override portrait(parent:Node,npc:number|string,x:number,y:number,width:number,height:number,options:PortraitOptions={}):Node {
    const index=typeof npc==='number'?npc:Number(npc.replace(/^CHR-/i,''))-1;
    const npcId=`CHR-${String(index+1).padStart(3,'0')}`;
    const mood=this.orbitalMoods.get(npcId)??'neutral';
    const requested=mood==='neutral'?'orbital-characters':MOOD_ART[mood];
    const atlas=this.frames.has(requested)?requested:'orbital-characters';
    const source=index>=0&&index<5?this.orbitalCrop(atlas,index,5,1,.012,options.crop==='head'?.48:1):undefined;
    return this.frame(parent,source,x,y,width,height,{name:`npc-${npc}`,fit:'contain',...options});
  }

  /** Records presentation state; redrawing the portrait selects a matching pose atlas. */
  setMood(npcId:string,mood:NpcMood):void{this.orbitalMoods.set(npcId.toUpperCase(),mood);}
  getMoodDiagnostics():{moods:Record<string,NpcMood>;missingAssets:string[]}{
    return{moods:Object.fromEntries(this.orbitalMoods),missingAssets:[...this.missingMoodAssets]};
  }

  /** Six devices have distinct silhouettes, rather than six recoloured circles. */
  toolIcon(parent:Node,tool:ToolId|string,x:number,y:number,width:number,height=width):Node {
    const node=this.container(parent,x,y,width,height,`tool-art-${tool}`);
    const ink=this.container(node,0,0,100,100,'tool-outline');ink.setScale(width/100,height/100,1);const g=ink.addComponent<Graphics>(Graphics);
    g.lineWidth=2.8;g.strokeColor=color(ORBITAL_PALETTE.cyan);g.fillColor=color('#294B59');
    const id=Number(String(tool).slice(-3));
    if(id===1){
      g.roundRect(26,-90,19,13,3);g.fill();g.stroke();g.moveTo(36,-76);g.lineTo(48,-50);g.stroke();g.circle(59,-34,21);g.fill();g.stroke();g.lineWidth=1;g.strokeColor=color('#9EDFE56A');g.circle(59,-34,14);g.stroke();g.fillColor=color('#E4F3D155');g.moveTo(47,-49);g.lineTo(18,-68);g.lineTo(65,-79);g.close();g.fill();
    }else if(id===2){
      g.strokeColor=color(ORBITAL_PALETTE.purple);g.roundRect(10,-54,52,24,5);g.fill();g.stroke();g.fillColor=color('#B3A3E1');g.roundRect(59,-58,11,32,2);g.fill();g.fillColor=color('#9A81CC40');g.moveTo(70,-30);g.lineTo(96,-11);g.lineTo(96,-78);g.lineTo(70,-54);g.close();g.fill();g.strokeColor=color('#DBB9EE');g.moveTo(20,-46);g.lineTo(45,-46);g.stroke();
    }else if(id===3){
      g.roundRect(8,-85,84,65,5);g.fill();g.stroke();g.fillColor=color('#0D202B');g.rect(17,-62,66,33);g.fill();g.strokeColor=color('#6EE0DE');g.moveTo(21,-57);g.lineTo(32,-53);g.lineTo(40,-36);g.lineTo(46,-55);g.lineTo(58,-48);g.lineTo(67,-31);g.lineTo(74,-53);g.lineTo(80,-56);g.stroke();g.fillColor=color('#DB8A52');g.circle(27,-74,4);g.circle(42,-74,4);g.fill();
    }else if(id===4){
      g.roundRect(22,-79,45,64,5);g.fill();g.stroke();g.fillColor=color('#0B1F2D');g.rect(29,-47,31,24);g.fill();g.strokeColor=color('#DB8A52');g.moveTo(30,-78);g.bezierCurveTo(8,-98,4,-49,9,-35);g.lineTo(7,-13);g.stroke();g.strokeColor=color('#6EE0DE');g.moveTo(59,-79);g.bezierCurveTo(86,-102,92,-59,90,-42);g.lineTo(94,-17);g.stroke();g.fillColor=color('#D3D9CE');g.circle(45,-64,9);g.fill();g.strokeColor=color('#37515E');g.moveTo(43,-64);g.lineTo(48,-69);g.stroke();
    }else if(id===5){
      g.roundRect(10,-88,80,17,4);g.fill();g.stroke();g.moveTo(50,-71);g.lineTo(50,-43);g.stroke();g.ellipse(50,-31,34,13);g.fill();g.stroke();g.moveTo(18,-31);g.lineTo(25,-44);g.lineTo(75,-44);g.lineTo(82,-31);g.stroke();g.fillColor=color('#6EE0DE');g.rect(39,-84,23,7);g.fill();g.strokeColor=color('#DB8A52');g.moveTo(38,-18);g.lineTo(62,-18);g.moveTo(50,-9);g.lineTo(50,-25);g.stroke();
    }else{
      g.roundRect(9,-86,82,45,5);g.fill();g.stroke();g.fillColor=color('#0C2029');g.rect(16,-68,44,17);g.fill();g.strokeColor=color('#DB8A52');g.moveTo(18,-61);g.lineTo(28,-61);g.lineTo(32,-53);g.lineTo(37,-66);g.lineTo(41,-57);g.lineTo(55,-57);g.stroke();g.strokeColor=color('#6EE0DE');g.moveTo(68,-43);g.bezierCurveTo(88,-32,80,-22,69,-19);g.stroke();g.moveTo(68,-19);g.lineTo(61,-8);g.moveTo(72,-19);g.lineTo(80,-8);g.stroke();g.fillColor=color('#DB8A52');g.circle(75,-64,7);g.fill();
    }
    return node;
  }

  private orbitalDrawButton(view:OrbitalButton):void {
    const tones:Record<ButtonTone,{accent:string;fill:string;hover:string}>={
      green:{accent:'#6EE0DE',fill:'#1C424B',hover:'#285C62'},
      gold:{accent:'#E6A36E',fill:'#5A3825',hover:'#754B31'},
      quiet:{accent:'#7D9CA9',fill:'#1A2A36',hover:'#293E4C'},
      danger:{accent:'#E79B89',fill:'#4C2C32',hover:'#693C40'},
    };
    const tone=tones[view.tone],g=view.ink;g.clear();
    g.fillColor=color(view.disabled?'#17232C':view.pressed?'#0C1D27':view.hovered||view.selected?tone.hover:tone.fill);
    polygon(g,0,0,view.width,view.height,6);g.fill();
    g.strokeColor=color(view.disabled?'#3D515B':view.focused||view.selected?'#C3F3EC':tone.accent);g.lineWidth=view.focused||view.selected?2.4:1.2;
    polygon(g,1,-1,view.width-2,view.height-2,5);g.stroke();
    if(!view.disabled){
      g.strokeColor=color(view.hovered||view.focused?'#A7E5E2':'#83ADB72E');g.lineWidth=1;
      g.moveTo(9,-5);g.lineTo(view.width-13,-5);g.stroke();
      if(view.selected||view.focused){g.fillColor=color(tone.accent);g.rect(5,-view.height+7,3,view.height-14);g.fill();}
    }
    view.text.color=color(view.disabled?'#637B86':view.tone==='quiet'?ORBITAL_PALETTE.text:tone.accent);
  }
  private orbitalPress(view:OrbitalButton,pressed:boolean):void {
    Tween.stopAllByTarget(view.visual);
    if(this.reducedMotion){view.visual.setPosition(0,0);return;}
    tween<Node>(view.visual).to(pressed?.06:.13,{position:new Vec3(0,pressed?-2:0,0)},{easing:'quadOut'}).start();
  }
  private orbitalCrop(key:string,index:number,columns:number,rows:number,inset:number,heightFraction=1):SpriteFrame|undefined {
    const source=this.frames.get(key);if(!source)return undefined;
    const cacheKey=`${key}:${index}:${inset}:${heightFraction}`;const existing=this.orbitalCrops.get(cacheKey);if(existing)return existing;
    const w=source.rect.width/columns,h=source.rect.height/rows;
    const rect={x:source.rect.x+(index%columns)*w+w*inset,y:source.rect.y+Math.floor(index/columns)*h+h*inset,w:w*(1-inset*2),h:h*(heightFraction-inset*2)};
    const frame=makeFrame(source.texture,rect);this.orbitalCrops.set(cacheKey,frame);return frame;
  }
  private async orbitalLoad(key:string):Promise<SpriteFrame> {
    if(!this.orbitalStandalone){
      const bundled=await new Promise<SpriteFrame|null>(resolve=>{try{resources.load<SpriteFrame>(`art/${key}/spriteFrame`,SpriteFrame,(error,frame)=>resolve(error?null:frame));}catch{resolve(null);}});
      if(bundled)return bundled;
    }
    const image=await new Promise<ImageAsset>((resolve,reject)=>assetManager.loadRemote<ImageAsset>(`${this.orbitalRemoteRoot}/art/${key}.${this.orbitalExt}`,(error,value)=>error?reject(new Error(`无法加载轨道旧货局素材 ${key}: ${error.message}`)):resolve(value)));
    const texture=new Texture2D();texture.image=image;return makeFrame(texture,{x:0,y:0,w:image.width,h:image.height});
  }
}
function color(value:UIColour):Color{return typeof value==='string'?new Color().fromHEX(value):value.clone();}
function alpha(node:Node,value?:number):void{if(value!==undefined)(node.getComponent<UIOpacity>(UIOpacity)??node.addComponent<UIOpacity>(UIOpacity)).opacity=Math.round(value<=1?value*255:value);}
function polygon(g:Graphics,x:number,y:number,w:number,h:number,cut:number):void{
  g.moveTo(x+cut,y);g.lineTo(x+w-cut,y);g.lineTo(x+w,y-cut);g.lineTo(x+w,y-h+cut);g.lineTo(x+w-cut,y-h);g.lineTo(x+cut,y-h);g.lineTo(x,y-h+cut);g.lineTo(x,y-cut);g.close();
}
function makeFrame(texture:SpriteFrame['texture'],rect:{x:number;y:number;w:number;h:number}):SpriteFrame{
  const frame=new SpriteFrame();frame.texture=texture;frame.rect=new Rect(rect.x,rect.y,rect.w,rect.h);frame.originalSize=new Size(rect.w,rect.h);frame.offset=new Vec2(0,0);frame.rotated=false;frame.packable=false;return frame;
}
