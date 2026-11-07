import {
  assetManager, BlockInputEvents, Button, Color, EventTouch, Font, Graphics,
  ImageAsset, Label, Mask, Node, Rect, resources, Size, Sprite, SpriteFrame, Texture2D,
  Tween, tween, UIOpacity, UITransform, Vec2, Vec3,
} from 'cc';
import {
  GameUI, type UIAssets, type UIColour, type ButtonTone, type ButtonOptions,
  type PanelOptions, type LabelOptions, type ImageOptions, type PortraitOptions,
  type ModalOptions, type ModalHandle, type PaperOptions, type UIIcon,
} from '../ui/GameUI';
import type { ToolId } from './types';
import {PointerCursor,type PointerBindingOptions} from './PointerCursor';

export const ORBITAL_PALETTE = {
  background: '#0B1118', deep: '#0D151C', panel: '#101B24F5', raised: '#243039',
  cyan: '#86C7C5', orange: '#E0A16C', purple: '#AB9AB9', text: '#ECE7D9',
  muted: '#A0ACA9', line: '#737B795C', danger: '#C58879', green: '#98BDB0',
};
export type NpcMood = 'neutral'|'focused'|'question'|'happy'|'reject'|'tired';
const MOOD_ART:Record<Exclude<NpcMood,'neutral'>,string>={
  focused:'orbital-characters-focused',question:'orbital-characters-question',
  happy:'orbital-characters-happy',reject:'orbital-characters-reject',tired:'orbital-characters-tired',
};
const P0_ITEMS = [1,2,3,9,10,11,17,18,19,25,26,27,33,34,35,41,42,43,48,49,50,55,56,57];
const ORBITAL_ART = [
  'orbital-counter','orbital-workbench','orbital-warehouse',
  'orbital-items-front','orbital-items-back','orbital-characters','hands','orbital-ui-surfaces','orbital-tools',
];
interface OrbitalButton {
  component:Button; visual:Node; ink:Graphics; edge:Graphics; skin:Node|null; text:Label; width:number;height:number;
  tone:ButtonTone;hovered:boolean;pressed:boolean;focused:boolean;selected:boolean;disabled:boolean;
}
export interface ObjectOptions extends ImageOptions {back?:boolean;opened?:boolean;repaired?:boolean;damaged?:boolean}
export type OrbitalSurface = 'glass'|'strip'|'socket'|'rail';
export interface OrbitalSurfaceOptions extends PanelOptions {skin?:OrbitalSurface;materialOpacity?:number}

/** Smoked glass and worn instrument controls, rendered entirely with native Creator UI. */
export class OrbitalUI extends GameUI {
  readonly pointer:PointerCursor;
  private readonly orbitalRemoteRoot:string;
  private readonly orbitalStandalone:boolean;
  private readonly orbitalExt:'png'|'webp';
  private readonly orbitalCrops=new Map<string,SpriteFrame>();
  private readonly orbitalSlices=new Map<string,SpriteFrame>();
  private readonly orbitalButtons=new WeakMap<Node,OrbitalButton>();
  private readonly orbitalMoods=new Map<string,NpcMood>();
  private readonly missingMoodAssets=new Set<string>();
  private orbitalFocus:Node|null=null;
  private orbitalToastRoot:Node|null=null;

  constructor(root:Node,assets:UIAssets={}) {
    super(root,assets);
    this.pointer=new PointerCursor(root);
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

  bindPointer(node:Node,options:PointerBindingOptions={}):()=>void{return this.pointer.bind(node,options);}
  bindDraggable(node:Node,enabled:()=>boolean=()=>true):()=>void {
    return this.pointer.bind(node,{cursor:'grab',draggable:true,disabled:()=>!enabled()});
  }
  resetPointer():void{this.pointer.reset();}
  override clear(parent:Node):void{this.pointer.clearSubtree(parent);super.clear(parent);}

  override label(parent:Node,text:string,x:number,y:number,width:number,height:number,options:LabelOptions={}):Node {
    const size=options.size??21;
    // A compact row must not shrink merely because paragraph leading exceeds its box.
    // Leave explicit paragraph/wrapping choices and the caller's top/centre anchor intact.
    const singleLine=options.wrap===false||(!text.includes('\n')&&height<size*1.8&&options.wrap!==true&&options.overflow!=='resize');
    const node=super.label(parent,text,x,y,width,height,{
      color:ORBITAL_PALETTE.text,size,bold:size>=27,
      lineHeight:singleLine?size:Math.round(size*1.4),wrap:!singleLine,...options,
    });
    if(!this.font)node.getComponent<Label>(Label)!.fontFamily='Orbital Sans SC, Noto Sans CJK SC, sans-serif';
    return node;
  }

  /** Align mixed font sizes to one alphabetic baseline in the pinned Creator 3.8.8 web engine. */
  baselineLabel(parent:Node,text:string,x:number,baseline:number,width:number,options:LabelOptions={}):Node {
    const size=options.size??21;
    // ttf text-processing TOP origin: fontSize * (1 - BASELINE_RATIO / 2),
    // where 3.8.8 web pins BASELINE_RATIO=.26 and getBaselineOffset()=0.
    return this.label(parent,text,x,baseline-size*.87,width,Math.ceil(size*1.3),{
      ...options,size,lineHeight:size,wrap:false,overflow:'clamp',verticalAlign:'top',
    });
  }

  override panel(parent:Node,x:number,y:number,width:number,height:number,options:PanelOptions={}):Node {
    return this.orbitalPanel(parent,x,y,width,height,options);
  }

  /** Native nine-sliced instrument casing. All coordinates remain logical canvas pixels. */
  texturePanel(parent:Node,x:number,y:number,width:number,height:number,options:OrbitalSurfaceOptions={}):Node {
    const skin=options.skin??'glass',fill=color(options.fill??ORBITAL_PALETTE.panel);
    // Text surfaces are a stable reading plane. The scene remains visible around them,
    // rather than moving bright scenery through every line of body copy.
    fill.a=Math.max(fill.a,skin==='socket'?232:246);
    const limits:Record<OrbitalSurface,number>={glass:.22,strip:.17,socket:.58,rail:.32};
    return this.orbitalPanel(parent,x,y,width,height,{...options,fill},skin,Math.min(options.materialOpacity??limits[skin],limits[skin]));
  }
  rail(parent:Node,x:number,y:number,width:number,height:number,options:PanelOptions={}):Node {
    return this.texturePanel(parent,x,y,width,height,{name:'console-rail',fill:'#0A1118B8',...options,skin:'rail',materialOpacity:.80});
  }

  private orbitalPanel(parent:Node,x:number,y:number,width:number,height:number,options:PanelOptions={},skin?:OrbitalSurface,materialOpacity?:number):Node {
    const node=this.container(parent,x,y,width,height,options.name??'tech-panel');
    const g=node.addComponent<Graphics>(Graphics);
    const radius=Math.max(0,options.radius??4);
    const cut=Math.min(radius,width/5,height/4);
    const decorated=(options.lineWidth??1)>0&&width>=120&&height>=44;
    if(options.shadow){g.fillColor=color('#00000070');polygon(g,3,-5,width,height,cut);g.fill();}
    // Plain panels deliberately have no automatic metal skin; texture is explicit.
    g.fillColor=color(options.fill??ORBITAL_PALETTE.panel);polygon(g,0,0,width,height,cut);g.fill();
    if(skin)this.orbitalSkin(node,skin,0,0,width,height,materialOpacity??.2);
    if((options.lineWidth??1)>0){
      const rim=this.container(node,0,0,width,height,'instrument-rim').addComponent<Graphics>(Graphics);
      rim.lineWidth=Math.min(1.2,options.lineWidth??.8);
      const edge=color(options.stroke??ORBITAL_PALETTE.line);
      // Explicit accents still work, but a whole window never becomes an emissive frame.
      if(decorated)edge.a=Math.min(edge.a,85);
      rim.strokeColor=edge;polygon(rim,.6,-.6,width-1.2,height-1.2,cut);rim.stroke();
      if(decorated&&width>=190&&height>=100){
        rim.lineWidth=.8;rim.strokeColor=color('#EDE0C621');
        rim.moveTo(13,-2);rim.lineTo(width-13,-2);rim.stroke();
        rim.strokeColor=color('#03070CB0');rim.moveTo(7,-height+2);rim.lineTo(width-7,-height+2);rim.stroke();
      }
    }
    alpha(node,options.opacity);return node;
  }

  override button(parent:Node,text:string,x:number,y:number,width:number,height:number,onClick:(event?:EventTouch)=>void,options:ButtonOptions={}):Node {
    const node=this.container(parent,x,y,width,height,options.name??`button-${text}`);
    const visual=this.container(node,0,0,width,height,'tech-button-surface');
    const ink=visual.addComponent<Graphics>(Graphics);
    const tone=options.tone??'green';
    const skin=tone==='gold'&&width>=65&&height>=30?this.orbitalSkin(visual,'amber',0,0,width,height,.94):null;
    const edge=this.container(visual,0,0,width,height,'control-edge').addComponent<Graphics>(Graphics);
    const textSize=options.size??19,padding=Math.min(12,Math.round(width*.12));
    const labelNode=this.label(visual,text,padding,0,Math.max(1,width-padding*2),height,{size:textSize,lineHeight:textSize,bold:tone==='gold',align:'center',verticalAlign:'center',wrap:false});
    const component=node.addComponent<Button>(Button);component.transition=Button.Transition.NONE;component.interactable=!options.disabled;
    const view:OrbitalButton={component,visual,ink,edge,skin,text:labelNode.getComponent<Label>(Label)!,width,height,tone,hovered:false,pressed:false,focused:options.focused??false,selected:options.selected??false,disabled:options.disabled??false};
    this.orbitalButtons.set(node,view);this.orbitalDrawButton(view);
    this.pointer.bind(node,{cursor:'pointer',disabled:()=>view.disabled});
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
    Object.assign(node,{__enabled:enabled});
    view.disabled=!enabled;view.component.interactable=enabled;view.pressed=false;
    if(!enabled){view.hovered=false;view.focused=false;if(this.orbitalFocus===node)this.orbitalFocus=null;}
    this.orbitalPress(view,false);this.orbitalDrawButton(view);
    this.pointer.refresh();
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
    this.pointer.reset();
    if(this.orbitalToastRoot?.isValid){this.clear(this.orbitalToastRoot);this.orbitalToastRoot.active=false;}
    const overlay=this.panel(this.root,0,0,1600,900,{name:'modal-overlay',fill:'#070D1666',lineWidth:0,radius:0});
    overlay.addComponent<BlockInputEvents>(BlockInputEvents);
    const surface=this.texturePanel(overlay,(1600-width)/2,(900-height)/2,width,height,{name:'modal-surface',fill:'#0B141CEB',stroke:'#8A847350',lineWidth:1,radius:5,shadow:true,materialOpacity:.66});
    this.label(surface,'◆',29,24,18,25,{size:11,color:ORBITAL_PALETTE.orange,verticalAlign:'center'});
    this.label(surface,title,53,20,width-150,39,{size:27,bold:true});
    this.label(surface,'ORBITAL EXCHANGE / OPERATIONS',31,65,width-108,18,{size:10,color:'#A49E8C'});
    this.line(surface,31,88,width-31,88,'#D3C7AA28');
    const body=this.container(surface,30,96,width-60,height-123,'modal-body');
    let closed=false,released=false;
    const release=()=>{
      if(released)return;released=true;closed=true;
      if(this.orbitalToastRoot?.isValid){this.clear(this.orbitalToastRoot);this.orbitalToastRoot.active=!this.orbitalHasModal(overlay);}
      options.onClose?.();
    };
    // Esc and confirmed actions can remove the overlay directly. Both paths use
    // the same one-time release as close(), without a counter that can go stale.
    overlay.on(Node.EventType.PARENT_CHANGED,()=>{if(overlay.parent!==this.root)release();});
    overlay.once(Node.EventType.NODE_DESTROYED,release);
    overlay.on(Node.EventType.ACTIVE_IN_HIERARCHY_CHANGED,()=>{
      if(this.orbitalToastRoot?.isValid)this.orbitalToastRoot.active=!this.orbitalHasModal();
    });
    // The veil and dialog leave together. Fading only the surface left a
    // near-black veil above a newly drawn scene and its departing customer.
    const close=()=>{if(closed)return;closed=true;this.animateOut(overlay,()=>{
      if(overlay.isValid){overlay.removeFromParent();overlay.destroy();}
      release();
    });};
    if(!options.disableClose)this.button(surface,'×',width-70,17,44,44,close,{tone:'quiet',size:30});
    this.animateIn(overlay);return{overlay,body,close};
  }

  override animateIn(node:Node,delay=0):void {
    const opacity=node.getComponent<UIOpacity>(UIOpacity)??node.addComponent<UIOpacity>(UIOpacity);
    Tween.stopAllByTarget(node);Tween.stopAllByTarget(opacity);
    if(this.reducedMotion){opacity.opacity=255;return;}
    // Keep dialogs readable from their very first frame, including when the
    // software renderer has not advanced TweenSystem's initial tick yet.
    // The interactive geometry stays fixed during the subtle power-up.
    opacity.opacity=224;tween<UIOpacity>(opacity).delay(delay).to(.2,{opacity:255},{easing:'quadOut'}).start();
  }
  override animateOut(node:Node,completed:()=>void,duration=.16):void {
    if(!node.isValid||this.reducedMotion){completed();return;}
    const opacity=node.getComponent<UIOpacity>(UIOpacity)??node.addComponent<UIOpacity>(UIOpacity);
    Tween.stopAllByTarget(node);Tween.stopAllByTarget(opacity);
    tween<UIOpacity>(opacity).to(duration,{opacity:0}).call(completed).start();
  }

  override toast(message:string,tone:'info'|'success'|'error'='info'):Node {
    if(!this.orbitalToastRoot?.isValid)this.orbitalToastRoot=this.container(this.root,0,0,1600,900,'orbital-notifications');
    // One quiet notification slot in the reserved gap below the HUD. Repeated
    // actions replace the message instead of stacking across the customer's face.
    this.clear(this.orbitalToastRoot);
    this.orbitalToastRoot.active=!this.orbitalHasModal();
    this.orbitalToastRoot.setSiblingIndex(this.root.children.length-1);
    const width=Math.min(1120,Math.max(320,message.length*15+48));
    const tint=tone==='error'?ORBITAL_PALETTE.danger:tone==='success'?ORBITAL_PALETTE.green:ORBITAL_PALETTE.cyan;
    const node=this.panel(this.orbitalToastRoot,(1600-width)/2,98,width,28,{name:'toast',fill:'#0B151DF7',lineWidth:0,radius:3});
    this.line(node,0,3,0,25,tint,2);
    this.label(node,message,15,0,width-30,28,{size:15,lineHeight:15,color:ORBITAL_PALETTE.text,align:'center',verticalAlign:'center',wrap:false});
    const opacity=node.getComponent<UIOpacity>(UIOpacity)??node.addComponent<UIOpacity>(UIOpacity);
    opacity.opacity=this.reducedMotion?255:0;const sequence=tween<UIOpacity>(opacity);
    if(!this.reducedMotion)sequence.to(.1,{opacity:255});
    sequence.delay(1.8).to(this.reducedMotion?0:.16,{opacity:0}).call(()=>{if(node.isValid){node.removeFromParent();node.destroy();}}).start();
    return node;
  }

  private orbitalHasModal(exclude?:Node):boolean {
    return this.root.children.some(node=>node!==exclude&&node.isValid&&node.name==='modal-overlay'&&node.activeInHierarchy);
  }

  override progress(parent:Node,value:number,x:number,y:number,width:number,height=8,tint:UIColour=ORBITAL_PALETTE.cyan):Node {
    const node=this.panel(parent,x,y,width,height,{fill:'#0B1520',lineWidth:0,radius:2});
    if(value>0)this.panel(node,0,0,width*Math.min(1,value),height,{fill:tint,lineWidth:0,radius:2});return node;
  }
  override paper(parent:Node,x:number,y:number,width:number,height:number,options:PaperOptions={}):Node {
    return this.panel(parent,x,y,width,height,{name:options.name??'terminal-ticket',fill:options.tint??'#101A22F5',stroke:'#9E9A8030',radius:3,opacity:options.opacity});
  }
  override dialogueFrame(parent:Node,x:number,y:number,width:number,height:number):Node {
    return this.panel(parent,x,y,width,height,{name:'terminal-dialogue',fill:'#101A22F7',stroke:'#9E9A8030',radius:3});
  }
  override cabinetCell(parent:Node,slot:number,x:number,y:number,width:number,height:number):Node {
    return this.texturePanel(parent,x,y,width,height,{name:`storage-cell-${slot}`,fill:'#0B11186B',stroke:'#69706B40',radius:3,skin:'socket',materialOpacity:.72});
  }

  techPanel(parent:Node,x:number,y:number,width:number,height:number,title='',accent:UIColour=ORBITAL_PALETTE.cyan):Node {
    const node=this.texturePanel(parent,x,y,width,height,{fill:'#0D182162',stroke:'#7B807440',radius:4,materialOpacity:.59});
    if(title){
      this.label(node,'◆',18,17,11,16,{size:7,color:accent,verticalAlign:'center'});
      this.label(node,title,33,14,width-53,25,{size:16,color:'#DFDDCD',bold:false,verticalAlign:'center',wrap:false});
      this.line(node,19,45,width-19,45,'#D9CCAD24',.8);
    }
    return node;
  }
  statusChip(parent:Node,text:string,x:number,y:number,width:number,height=30,accent:UIColour=ORBITAL_PALETTE.cyan):Node {
    const node=this.container(parent,x,y,width,height,'instrument-status');
    const g=node.addComponent<Graphics>(Graphics);g.fillColor=color('#0B151DEF');g.rect(0,-height,width,height);g.fill();
    const marker=color(accent);marker.a=Math.min(marker.a,185);g.fillColor=marker;g.rect(0,-height*.64,2,Math.max(6,height*.28));g.fill();
    this.label(node,text,9,0,width-15,height,{size:Math.min(14,height*.55),color:accent,align:'left',verticalAlign:'center',wrap:false});return node;
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
    const key=options.back||options.opened?'orbital-items-back':'orbital-items-front';
    const source=index>=0?this.orbitalCrop(key,index,6,4,.035):undefined;
    const node=this.frame(parent,source,x,y,width,height,{name:`item-${itemId}`,fit:'contain',...options});
    const short=Math.min(width,height);
    // The illustrated fronts/backs already carry material wear. A universal crack across
    // the image would also cut through light projections, plants and empty space.
    if(options.repaired){
      const picture=node.getChildByName('sprite'),bounds=picture?.getComponent<UITransform>(UITransform);
      const drawW=bounds?.width??width,drawH=bounds?.height??height,detail=Math.min(drawW,drawH);
      if(detail>=80){
        const px=(picture?.position.x??0)+drawW*.56,py=-(picture?.position.y??0)+drawH*.57;
        const w=drawW*.065,h=drawH*.025;
        const layer=this.container(node,px,py,w,h,'repair-patch');layer.angle=-9;
        const g=layer.addComponent<Graphics>(Graphics);
        g.fillColor=color('#858B7CCB');g.roundRect(0,-h,w,h,Math.min(1.4,h*.2));g.fill();
        g.strokeColor=color('#C9C5AA85');g.lineWidth=.7;g.roundRect(0,-h,w,h,Math.min(1.4,h*.2));g.stroke();
        g.fillColor=color('#33454A');g.circle(w*.15,-h*.5,detail*.0018);g.circle(w*.85,-h*.5,detail*.0018);g.fill();
      }
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

  /** Full-proportion customer behind the worktop, clipped only by the counter aperture. */
  customer(parent:Node,npc:number|string,x:number,y:number,width:number,height:number,options:PortraitOptions={}):Node {
    const index=typeof npc==='number'?npc:Number(npc.replace(/^CHR-/i,''))-1;
    const npcId=`CHR-${String(index+1).padStart(3,'0')}`;
    const mood=this.orbitalMoods.get(npcId)??'neutral';
    const requested=mood==='neutral'?'orbital-characters':MOOD_ART[mood];
    const atlas=this.frames.has(requested)?requested:'orbital-characters';
    const source=index>=0&&index<5?this.orbitalCrop(atlas,index,5,1,.012):undefined;
    const node=this.container(parent,x,y,width,height,options.name??`customer-${npc}`);
    node.addComponent<Mask>(Mask).type=Mask.Type.GRAPHICS_RECT;
    const naturalHeight=source?width*source.rect.height/source.rect.width:width*724/(2172/5);
    this.frame(node,source,0,0,width,naturalHeight,{name:`customer-art-${npc}`,fit:'contain',tint:options.tint});
    alpha(node,options.opacity);return node;
  }

  /** Records presentation state; redrawing the portrait selects a matching pose atlas. */
  setMood(npcId:string,mood:NpcMood):void{this.orbitalMoods.set(npcId.toUpperCase(),mood);}
  getMoodDiagnostics():{moods:Record<string,NpcMood>;missingAssets:string[]}{
    return{moods:Object.fromEntries(this.orbitalMoods),missingAssets:[...this.missingMoodAssets]};
  }

  /** Six devices have distinct silhouettes, rather than six recoloured circles. */
  toolIcon(parent:Node,tool:ToolId|string,x:number,y:number,width:number,height=width):Node {
    const index=Number(String(tool).slice(-3))-1;
    const source=index>=0&&index<6?this.orbitalCrop('orbital-tools',index,3,2,.025):undefined;
    if(source)return this.frame(parent,source,x,y,width,height,{name:`tool-art-${tool}`,fit:'contain'});
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
      green:{accent:'#B4D8D1',fill:'#20353CF5',hover:'#2D4B53'},
      gold:{accent:'#F4D9B1',fill:'#674027F2',hover:'#8D542EF2'},
      quiet:{accent:'#D3D8D1',fill:'#1B2932F2',hover:'#2D404A'},
      danger:{accent:'#D5A395',fill:'#392D2DF2',hover:'#4B3434'},
    };
    const tone=tones[view.tone],g=view.ink,rim=view.edge,w=view.width,h=view.height;
    g.clear();rim.clear();
    const main=view.tone==='gold';
    if(main){g.fillColor=color('#030609B0');polygon(g,0,-3,w,h,5);g.fill();}
    g.fillColor=color(view.disabled?'#152027E8':view.pressed?'#101C24':view.hovered||view.selected?tone.hover:tone.fill);
    polygon(g,0,0,w,h,4);g.fill();
    if(view.skin){
      const amount=view.disabled?.22:main?(view.pressed?.72:1):view.selected?.70:view.hovered?.59:view.tone==='quiet'?.33:.47;
      alpha(view.skin,amount);
      const sprite=view.skin.getChildByName('instrument-slice')?.getComponent<Sprite>(Sprite);
      if(sprite)sprite.color=color(view.disabled?'#7D898B':view.pressed?'#B6B1A4':'#FFFFFF');
    }
    // The bevel, status and focus marks have distinct roles and brightness levels.
    rim.lineWidth=1;
    if(main){
      rim.strokeColor=color(view.disabled?'#70635444':view.pressed?'#21170DA0':'#F5CA9188');
      rim.moveTo(10,-5);rim.lineTo(w-10,-5);rim.stroke();
      rim.strokeColor=color('#0A0A0D9C');rim.moveTo(7,-h+3);rim.lineTo(w-7,-h+3);rim.stroke();
    }else{
      rim.strokeColor=color(view.disabled?'#69777C48':view.selected?'#B39A73A8':view.hovered?'#A6B9B4B8':'#72838A85');
      polygon(rim,.6,-.6,w-1.2,h-1.2,3);rim.stroke();
      rim.strokeColor=color(view.disabled?'#02070A50':'#02070A9A');
      rim.moveTo(3,-h+2);rim.lineTo(w-3,-h+2);rim.stroke();
    }
    if(view.selected&&!view.disabled){
      rim.fillColor=color('#CF9C67');rim.rect(10,-h+2,w-20,2);rim.fill();
      rim.fillColor=color('#EDC18C');rim.rect(4,-h*.66,2,h*.32);rim.fill();
    }
    if(view.focused&&!view.disabled){
      rim.strokeColor=color('#E7DBC5C9');rim.lineWidth=1.5;
      for(const [xx,yy,dx,dy]of [[3,-3,1,-1],[w-3,-3,-1,-1],[3,-h+3,1,1],[w-3,-h+3,-1,1]]){
        rim.moveTo(xx+dx*8,yy);rim.lineTo(xx,yy);rim.lineTo(xx,yy+dy*7);rim.stroke();
      }
    }
    view.text.color=color(view.disabled?'#6E7A7D':main?'#F8E5C6':view.selected?'#F1DEBC':tone.accent);
  }
  private orbitalPress(view:OrbitalButton,pressed:boolean):void {
    const opacity=view.visual.getComponent<UIOpacity>(UIOpacity)??view.visual.addComponent<UIOpacity>(UIOpacity);
    Tween.stopAllByTarget(opacity);
    Tween.stopAllByTarget(view.visual);
    if(this.reducedMotion){opacity.opacity=255;view.visual.setPosition(0,0);return;}
    // Only the painted keycap moves; the button's input rectangle stays pinned.
    tween<Node>(view.visual).to(pressed?.04:.09,{position:new Vec3(0,pressed?-2:0,0)},{easing:'quadOut'}).start();
    tween<UIOpacity>(opacity).to(pressed?.055:.12,{opacity:pressed?232:255},{easing:'quadOut'}).start();
  }
  private orbitalSkin(parent:Node,kind:OrbitalSurface|'amber'|'graphite',x:number,y:number,width:number,height:number,opacity=1):Node|null {
    const atlas=this.frames.get('orbital-ui-surfaces');if(!atlas)return null;
    const indices:Record<OrbitalSurface|'amber'|'graphite',number>={glass:0,strip:1,amber:2,graphite:3,socket:4,rail:5};
    const index=indices[kind],cellW=atlas.rect.width/3,cellH=atlas.rect.height/2;
    const cap=(kind==='strip'||kind==='rail'?64:80)*cellW/512;
    const key=`skin:${kind}:${cellW}:${cellH}`;
    let frame=this.orbitalSlices.get(key);
    if(!frame){
      frame=makeFrame(atlas.texture,{x:atlas.rect.x+(index%3)*cellW,y:atlas.rect.y+Math.floor(index/3)*cellH,w:cellW,h:cellH});
      frame.insetLeft=cap;frame.insetRight=cap;frame.insetTop=cap;frame.insetBottom=cap;
      this.orbitalSlices.set(key,frame);
    }
    const button=kind==='amber'||kind==='graphite';
    const scale=Math.max(.01,Math.min((button?.145:.22)*512/cellW,width/(cap*2+1),height/(cap*2+1)));
    const node=this.container(parent,x,y,width,height,`material-${kind}`);
    const picture=this.container(node,0,0,width/scale,height/scale,'instrument-slice');picture.setScale(scale,scale,1);
    const sprite=picture.addComponent<Sprite>(Sprite);sprite.type=Sprite.Type.SLICED;sprite.sizeMode=Sprite.SizeMode.CUSTOM;sprite.spriteFrame=frame;
    alpha(node,opacity);return node;
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
