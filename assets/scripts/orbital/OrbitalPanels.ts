import {Canvas,Color,EventKeyboard,EventTouch,game,Graphics,input,Input,KeyCode,Label,Node,UIOpacity,UITransform,Vec2,Vec3,view} from 'cc';
import type {OrbitalHost} from './ui-types';
import type {OrbitalItem,OrderDef,PageId,RecipeDef} from './types';
import {getDef,getOrder,materials,recipes,orderDefs,orderEarliest} from './data';
import {canPlace,estimate,findItem,itemValue} from './model';

const C={text:'#D6D2C7',muted:'#9BA6A4',cyan:'#76BABB',orange:'#C38A4D',purple:'#AEA4B4',line:'#737C7350',panel:'#101B22B8',deep:'#0B141CD9',red:'#D18D77'};
const statusText={available:'可接取',active:'进行中',done:'已交付',failed:'已过期'};
interface DragFrame {event:EventTouch;raw:Vec3;point:Vec3;origin:Vec3;moved:boolean;distance:number}
interface DragOptions {
  bounds?:{left:number;top:number;right:number;bottom:number};
  movable?:boolean;
  enabled?:()=>boolean;
  accept?:(event:EventTouch)=>boolean;
  start?:(frame:DragFrame)=>void;
  move?:(frame:DragFrame)=>void;
  end:(frame:DragFrame)=>void;
  cancel?:()=>void;
}

/** Workspaces share a persistent host; they never commit money outside the reducer. */
export class OrbitalPanels {
  private page:PageId='repair';
  private parent:Node|null=null;
  private clock=0;
  private orderId='ORD-001';
  private stagedUid='';
  private scanner:Graphics|null=null;
  private scanUntil=0;
  private inventoryOffset=0;
  private modal:Node|null=null;
  private cabinet:'isolation'|'pawn'='isolation';
  private dragCancel:(()=>void)|null=null;
  private dragCanvas:HTMLCanvasElement|null=null;
  private readonly cancelFromWindow=()=>this.cancelDrag();
  private readonly visibilityChanged=()=>{if(document.hidden)this.cancelDrag();};
  constructor(private readonly h:OrbitalHost){
    input.on(Input.EventType.KEY_DOWN,this.key,this);
    if(typeof window!=='undefined'){
      window.addEventListener('pointercancel',this.cancelFromWindow,true);window.addEventListener('touchcancel',this.cancelFromWindow,true);
      window.addEventListener('blur',this.cancelFromWindow);window.addEventListener('resize',this.cancelFromWindow);
      document.addEventListener('visibilitychange',this.visibilityChanged);
    }
    this.dragCanvas=game.canvas;
    this.dragCanvas?.addEventListener('pointerleave',this.cancelFromWindow);this.dragCanvas?.addEventListener('mouseleave',this.cancelFromWindow);
  }
  setPage(page:PageId):void{if(page!==this.page)this.cancelDrag();this.page=page;if(page!=='warehouse')this.scanner=null;}
  draw(page:PageId,parent:Node):void {
    this.cancelDrag();
    this.page=page;this.parent=parent;this.scanner=null;
    if(page==='repair')this.repair(parent);
    if(page==='warehouse')this.warehouse(parent);
    if(page==='orders')this.orders(parent);
    if(page==='report')this.report(parent);
    if(page==='settings')this.settings(parent);
  }
  update(dt:number):void {
    this.clock+=Math.min(.1,dt);
    if(this.scanner?.node.isValid){
      this.scanner.clear();
      if(!this.h.prefs.reducedMotion&&this.clock<this.scanUntil){
        const y=30+((this.clock*220)%245);
        this.scanner.fillColor=new Color('#6EE0DE1B');this.scanner.rect(12,-y,252,24);this.scanner.fill();
        this.scanner.strokeColor=new Color(C.cyan);this.scanner.lineWidth=3;
        this.scanner.moveTo(12,-y);this.scanner.lineTo(264,-y);this.scanner.stroke();
      }
    }
  }
  dispose():void {
    this.cancelDrag();input.off(Input.EventType.KEY_DOWN,this.key,this);
    this.dragCanvas?.removeEventListener('pointerleave',this.cancelFromWindow);this.dragCanvas?.removeEventListener('mouseleave',this.cancelFromWindow);this.dragCanvas=null;
    if(typeof window!=='undefined'){
      window.removeEventListener('pointercancel',this.cancelFromWindow,true);window.removeEventListener('touchcancel',this.cancelFromWindow,true);
      window.removeEventListener('blur',this.cancelFromWindow);window.removeEventListener('resize',this.cancelFromWindow);
      document.removeEventListener('visibilitychange',this.visibilityChanged);
    }
  }
  closeModal():boolean {
    this.cancelDrag();
    const overlay=this.modal;this.modal=null;
    if(!overlay?.isValid)return false;
    overlay.removeFromParent();if(overlay.isValid)overlay.destroy();return true;
  }
  private key(e:EventKeyboard):void {
    if(this.h.busy||this.modal?.isValid||this.dragCancel)return;
    if(this.page==='warehouse'&&e.keyCode===KeyCode.KEY_R){
      const item=this.item();if(item?.location==='warehouse')this.h.dispatch({type:'MOVE',uid:item.uid,x:item.x,y:item.y,rotated:!item.rotated});
    }
  }
  private text(p:Node,t:string,x:number,y:number,w:number,h:number,size=20,color=C.text,align:'left'|'center'|'right'='left'):Node {
    return this.h.ui.label(p,t,x,y,w,h,{size:size*(this.h.prefs.largeText?1.08:1),color,align});
  }
  private row(p:Node,t:string,x:number,y:number,w:number,h:number,size=20,color=C.text,align:'left'|'center'|'right'='left'):Node {
    const fontSize=size*(this.h.prefs.largeText?1.08:1);
    return this.h.ui.label(p,t,x,y,w,h,{size:fontSize,lineHeight:fontSize,color,align,verticalAlign:'center',wrap:false});
  }
  private paragraph(p:Node,t:string,x:number,y:number,w:number,h:number,size=18,color=C.muted):Node {
    const fontSize=size*(this.h.prefs.largeText?1.08:1);
    return this.h.ui.label(p,t,x,y,w,h,{size:fontSize,lineHeight:Math.ceil(fontSize*1.4),color,verticalAlign:'top',wrap:true});
  }
  private baseline(p:Node,t:string,x:number,y:number,w:number,size=20,color=C.text,align:'left'|'center'|'right'='left'):Node {
    return this.h.ui.baselineLabel(p,t,x,y,w,{size:size*(this.h.prefs.largeText?1.08:1),color,align});
  }
  private box(p:Node,x:number,y:number,w:number,h:number,accent=C.line,fill=C.panel,name='workspace-panel'):Node {
    return this.h.ui.panel(p,x,y,w,h,{stroke:accent,fill,radius:3,lineWidth:.8,name});
  }
  private line(p:Node,x:number,y:number,w:number,color=C.line):void {this.h.ui.line(p,x,y,x+w,y,color,1);}
  private item():OrbitalItem|undefined {return findItem(this.h.state,this.h.selected)||this.h.state.inventory[0];}
  private ownership(item:OrbitalItem):string {return item.owner==='customer'?'顾客委修 · 归属锁定':item.owner==='pawn'?'抵押保管 · 禁止出售':'店铺自有';}
  private dims(item:OrbitalItem):[number,number] {const s=getDef(item.defId).size;return item.rotated?[s[1],s[0]]:[s[0],s[1]];}
  private effect(kind:string,at:{x:number;y:number;width?:number;height?:number}):void {if(this.parent?.isValid)this.h.effect(kind,this.parent,at);}
  private dragWithin(node:Node,raw:Vec3,bounds:{left:number;top:number;right:number;bottom:number}):void {
    const size=node.getComponent<UITransform>(UITransform)!.contentSize;
    const width=size.width*Math.abs(node.scale.x),height=size.height*Math.abs(node.scale.y);
    const x=Math.max(bounds.left,Math.min(bounds.right-width,raw.x));
    const y=Math.max(bounds.top,Math.min(bounds.bottom-height,-raw.y));
    node.setPosition(x,-y,raw.z);
  }
  private cancelDrag():void {const cancel=this.dragCancel;this.dragCancel=null;cancel?.();}
  private dragAvailable(node:Node):boolean {
    if(this.h.busy||!node.isValid||!node.activeInHierarchy)return false;
    const within=(parent:Node)=>{for(let current:Node|null=node;current;current=current.parent)if(current===parent)return true;return false;};
    if(!within(this.h.ui.root))return false;
    const modal=[...this.h.ui.root.children].reverse().find(child=>child.name==='modal-overlay'&&child.isValid&&child.activeInHierarchy);
    return !modal||within(modal);
  }
  private pointerLocal(parent:Node,event:EventTouch):Vec3 {
    const point=event.getLocation();let canvas:Canvas|null=null;
    for(let node:Node|null=this.h.ui.root;node&&!canvas;node=node.parent)canvas=node.getComponent<Canvas>(Canvas);
    const root=this.h.ui.root.getComponent<UITransform>(UITransform)!;
    const ui=event.getUILocation();
    const world=canvas?.cameraComponent?.screenToWorld(new Vec3(point.x,point.y,0))||root.convertToWorldSpaceAR(new Vec3(ui.x,ui.y-root.height,0));
    return parent.getComponent<UITransform>(UITransform)!.convertToNodeSpaceAR(world);
  }
  /** Keep the original grab point, even while the visible card is clamped. */
  private dragGesture(node:Node,options:DragOptions):void {
    let tracking=false,touchId:number|null=null,parent:Node|null=null,origin=new Vec3(),press=new Vec3(),screen=new Vec2(),distance=0,siblings:Node[]=[];
    const restore=()=>{
      if(node.isValid&&node.parent===parent){node.setPosition(origin);if(options.movable!==false)this.dragOpacity(node,false);}
      // Restore the complete pre-drag order, including a raised warehouse preview.
      if(parent?.isValid)siblings.forEach((sibling,index)=>{if(sibling.isValid&&sibling.parent===parent)sibling.setSiblingIndex(index);});
    };
    const cancel=()=>{if(!tracking)return;tracking=false;restore();options.cancel?.();};
    const frame=(event:EventTouch):DragFrame=>{
      const point=this.pointerLocal(parent!,event),location=event.getLocation();
      distance=Math.max(distance,Math.hypot(location.x-screen.x,location.y-screen.y)/Math.max(1,view.getDevicePixelRatio()));
      return{event,point,origin:origin.clone(),raw:new Vec3(origin.x+point.x-press.x,origin.y+point.y-press.y,origin.z),moved:distance>=6,distance};
    };
    const finish=(event:EventTouch,cancelled:boolean)=>{
      if(!tracking||event.getID()!==touchId)return;
      // Creator 3.8.8 rewrites event.type to TOUCH_CANCEL when release misses
      // the clamped card. Its original event code still distinguishes a real
      // release from OS/browser cancellation; only the former may commit.
      const released=!cancelled||event.getEventCode()===Input.EventType.TOUCH_END;
      const inside=!!this.h.ui.root.getComponent<UITransform>(UITransform)?.hitTest(event.getLocation());
      const final=frame(event);tracking=false;if(this.dragCancel===cancel)this.dragCancel=null;restore();
      if(released&&inside&&this.dragAvailable(node)&&node.parent===parent)options.end(final);else options.cancel?.();
    };
    if(options.movable!==false)this.h.ui.bindDraggable(node,()=>this.dragAvailable(node)&&options.enabled?.()!==false);
    node.on(Node.EventType.TOUCH_START,(event:EventTouch)=>{
      if(!this.dragAvailable(node)||!node.parent||options.enabled?.()===false||options.accept?.(event)===false)return;
      this.cancelDrag();parent=node.parent;origin=node.position.clone();press=this.pointerLocal(parent,event);screen=event.getLocation().clone();distance=0;touchId=event.getID();siblings=parent.children.slice();tracking=true;this.dragCancel=cancel;
      options.start?.(frame(event));
      if(options.movable!==false){this.dragOpacity(node,true);node.setSiblingIndex(parent.children.length-1);}
    });
    node.on(Node.EventType.TOUCH_MOVE,(event:EventTouch)=>{
      if(!tracking||event.getID()!==touchId)return;if(!this.dragAvailable(node)){this.cancelDrag();return;}
      const current=frame(event);
      if(current.moved&&options.movable!==false){if(options.bounds)this.dragWithin(node,current.raw,options.bounds);else node.setPosition(current.raw);}
      options.move?.(current);
    });
    node.on(Node.EventType.TOUCH_END,(event:EventTouch)=>finish(event,false));
    node.on(Node.EventType.TOUCH_CANCEL,(event:EventTouch)=>finish(event,true));
    node.on(Node.EventType.NODE_DESTROYED,()=>{if(tracking&&this.dragCancel===cancel)this.cancelDrag();});
  }
  private dragOpacity(node:Node,dragging:boolean):void {
    const opacity=node.getComponent<UIOpacity>(UIOpacity)||node.addComponent<UIOpacity>(UIOpacity);opacity.opacity=dragging?205:255;
  }
  private repairHint(p:Node,t:string,color=C.text):void {
    this.h.ui.panel(p,466,588,516,19,{fill:'#0B151DEE',lineWidth:0,radius:3,name:'repair-action-caption'});
    this.row(p,t,478,588,492,19,14,color,'center');
  }
  private button(p:Node,t:string,x:number,y:number,w:number,h:number,fn:()=>void,tone:'gold'|'green'|'danger'|'quiet'='quiet',disabled=false):Node {
    return this.h.button(p,t,x,y,w,h,fn,{tone,disabled,size:19});
  }
  private title(p:Node,kicker:string,title:string,x=40,w=1000):void {
    this.row(p,kicker,x,130,w,22,12,C.muted);this.row(p,title,x,157,w,40,29);
  }
  private inventoryList(p:Node,x:number,y:number,w:number,h:number,repairOnly=false):void {
    const all=this.h.state.inventory.filter(it=>!repairOnly||it.location!=='pawn');
    const count=Math.max(1,Math.floor(h/83));
    this.inventoryOffset=Math.min(this.inventoryOffset,Math.max(0,all.length-count));
    all.slice(this.inventoryOffset,this.inventoryOffset+count).forEach((it,i)=>{
      const yy=y+i*83,selected=it.uid===this.h.selected;
      const card=this.h.button(p,'',x,yy,w,75,()=>this.h.select(it.uid),{tone:'quiet',selected,name:`select-${it.uid}`});
      this.h.ui.object(card,it.defId,5,3,69,65,{repaired:it.repaired,damaged:!it.working});
      this.row(card,getDef(it.defId).name,82,8,w-92,25,18,selected?C.cyan:C.text);
      this.row(card,it.owner==='customer'?'委修件':it.owner==='pawn'?'抵押品':it.repaired?'已修复':!it.working?'待维修':it.location==='display'?'销售架':'仓库存放',82,42,w-92,22,15,it.owner==='shop'?C.muted:C.purple);
    });
    if(!all.length)this.text(p,'暂无可用物件',x+12,y+45,w-24,45,18,C.muted,'center');
    if(all.length>count){
      this.button(p,'↑',x,y+h-2,w/2-4,31,()=>{this.inventoryOffset=Math.max(0,this.inventoryOffset-1);this.h.render();});
      this.button(p,'↓',x+w/2+4,y+h-2,w/2-4,31,()=>{this.inventoryOffset=Math.min(all.length-count,this.inventoryOffset+1);this.h.render();});
    }
  }
  private repair(p:Node):void {
    const s=this.h.state,item=this.item();
    this.title(p,'WORKBENCH / SCN-002','维修与拆解');
    this.h.ui.texturePanel(p,30,205,262,482,{skin:'socket',fill:'#10181988',stroke:'#7D827452',materialOpacity:.64,name:'repair-parts-rack'});
    this.row(p,'原件托盘',47,218,220,30,20,C.text);
    this.inventoryList(p,43,260,236,385,true);
    this.h.ui.panel(p,306,205,848,482,{fill:'#0D171B24',lineWidth:0,name:'repair-workspace'});
    this.h.ui.texturePanel(p,1170,130,400,640,{skin:'glass',fill:'#10191DD4',stroke:C.line,materialOpacity:.46,name:'repair-job-sheet'});
    this.row(p,'REPAIR DOCKET / 原物修复',1190,146,360,31,15,C.orange);
    if(!item){this.text(p,'从仓库选择物件，或到订单页接取委修单。',353,365,750,80,25,C.muted,'center');return;}
    const def=getDef(item.defId),recipe=recipes.find(r=>r.kind==='repair'&&(r.id===def.recipeId||r.itemId===item.defId));
    const progress=s.repairProgress[item.uid]||0;
    this.h.ui.texturePanel(p,326,218,480,67,{skin:'strip',fill:'#0C151CC2',lineWidth:0,materialOpacity:.24,name:'repair-object-label'});
    this.row(p,`${def.id} · ${def.name}`,341,222,450,31,23);
    this.row(p,this.ownership(item),341,257,450,23,14,item.owner==='shop'?C.muted:C.purple);
    this.h.ui.object(p,item.defId,466,256,516,336,{back:progress>0,repaired:item.repaired,damaged:!item.working});
    this.h.ui.texturePanel(p,334,610,790,65,{skin:'strip',fill:'#0A141BD4',stroke:'#7D82742D',materialOpacity:.37,name:'repair-process-rail'});
    this.line(p,357,630,721,'#81887748');
    (recipe?.steps||['检查物件','选择兼容配方','复核条件']).forEach((step,i)=>{
      const xx=350+i*260,active=i===progress;
      this.h.ui.panel(p,xx,617,42,23,{fill:'#101A20',lineWidth:0,radius:2});
      this.row(p,String(i+1).padStart(2,'0'),xx,617,23,23,12,progress>i?C.cyan:active?C.orange:C.muted);
      this.row(p,progress>i?'✓':active?'●':'',xx+29,617,20,23,11,progress>i?C.cyan:C.orange,'center');
      this.row(p,step,xx,644,235,26,16,active?C.text:C.muted);
    });
    this.row(p,def.name,1190,190,360,40,28);
    this.paragraph(p,item.repaired?'维修完成，编号与来源记录已保留。':item.evidence.length?def.defect:'故障尚未确诊。先在鉴定台观察结构并记录读数，再决定维修工序。',1190,241,360,85,19,C.muted);
    this.line(p,1190,335,360);
    this.row(p,'材料与工时 / 最后确认时扣除',1190,348,360,28,16,C.orange);
    if(recipe){
      Object.entries(recipe.materials).forEach(([id,q],i)=>{
        const material=materials.find(m=>m.id===id),color=(s.materials[id]||0)>=q?C.text:C.red;
        this.baseline(p,material?.name||id,1190,410+i*32,238,18,color);
        this.baseline(p,`${s.materials[id]||0} / ${q}`,1438,410+i*32,112,18,color,'right');
      });
      this.row(p,`工时 ${recipe.ap} AP · 自修无额外工费`,1190,487,360,27,17,C.muted);
      const enough=Object.entries(recipe.materials).every(([id,q])=>(s.materials[id]||0)>=q);
      this.button(p,item.repaired?'本件已修复':'确认维修并复测',1190,533,360,48,()=>{
        this.h.dispatch({type:'REPAIR',uid:item.uid,recipeId:recipe.id});if(findItem(this.h.state,item.uid)?.repaired)this.effect('repair',{x:526,y:280,width:390,height:275});
      },'gold',progress<3||item.repaired||!enough||s.ap<recipe.ap);
      if(!item.repaired&&progress===0){
        this.h.ui.line(p,865,346,902,346,'#C38A4D80',1);
        this.button(p,'拆开检修盖',902,320,190,52,()=>this.repairStep(item,0),'gold');
        this.repairHint(p,'01 / 观察接缝，取下检修盖');
      }else if(!item.repaired&&progress===1)this.replacementInteraction(p,item,recipe);
      else if(!item.repaired&&progress===2)recipe.id==='REC-002'||recipe.id==='REC-005'?this.calibrationInteraction(p,item,recipe):this.weldInteraction(p,item);
      else if(item.repaired){
        this.repairHint(p,'修复标记已写回原物',C.cyan);
        this.drawWave(p,936,330,180,118,true);
      }
    }else{
      this.text(p,'当前没有匹配的维修配方。\n可以记录证据后作为原件保留，或拆解回收材料。',1190,390,360,120,19,C.muted);
      this.button(p,'前往鉴定台',1190,533,360,48,()=>this.h.navigate('inspect',item.uid),'green');
    }
    this.button(p,'查看证据 / 诊断',1190,598,173,45,()=>this.h.navigate('inspect',item.uid),'green');
    this.button(p,'拆解回收…',1378,598,172,45,()=>this.confirmDismantle(item),'danger',item.owner!=='shop');
    const craft=recipes.find(r=>r.kind==='craft');
    if(craft)this.button(p,'组装维护套组…',1190,659,360,47,()=>this.confirmCraft(craft),'quiet');
    this.paragraph(p,'物件归属、真伪与来源不会因维修自动改变',1190,718,360,40,15,C.muted);
    this.materialShelf(p,30,701,1124);
  }
  private repairStep(item:OrbitalItem,stage:number):void {
    const before=this.h.state.repairProgress[item.uid]||0;
    this.h.dispatch({type:'REPAIR_STEP',uid:item.uid,stage});
    if((this.h.state.repairProgress[item.uid]||0)>before)this.effect(stage===2?'pulse':'repair',{x:525,y:280,width:390,height:280});
  }
  private replacementInteraction(p:Node,item:OrbitalItem,recipe:RecipeDef):void {
    this.h.ui.texturePanel(p,355,306,144,206,{skin:'socket',fill:'#141C20B8',stroke:'#777F7150',materialOpacity:.80,name:'replacement-parts-tray'});this.row(p,'替换件托盘',365,318,124,28,15,C.muted,'center');
    const slot=this.h.ui.texturePanel(p,878,360,126,114,{skin:'socket',fill:'#0C181E88',stroke:C.cyan,materialOpacity:.77,name:'repair-part-slot'});
    this.row(slot,'兼容插槽',10,75,106,27,16,C.cyan,'center');
    const sg=this.h.ui.container(slot,0,0,126,114,'replacement-socket-outline').addComponent<Graphics>(Graphics);sg.lineWidth=2;sg.strokeColor=new Color(C.cyan);sg.roundRect(28,-59,70,43,6);sg.stroke();
    const part=this.h.ui.texturePanel(p,370,380,112,106,{skin:'socket',fill:'#273036E8',stroke:'#C38A4D90',materialOpacity:.57,name:'replacement-coil'});
    const materialId=Object.keys(recipe.materials).find(id=>id!=='MAT-004')||'MAT-003';
    this.h.ui.materialIcon(part,materialId,19,10,74,62);
    this.row(part,'拖入插槽',5,77,102,25,15,C.orange,'center');
    this.dragGesture(part,{
      bounds:{left:350,top:300,right:1128,bottom:555},
      end:({event,moved})=>{if(moved&&slot.getComponent<UITransform>(UITransform)?.hitTest(event.getLocation()))this.repairStep(item,1);else if(moved)this.h.ui.toast('接口没有对齐，请把替换件拖进右侧青色插槽。');},
    });
    this.repairHint(p,'02 / 将兼容零件拖入右侧接口');
    this.button(p,'辅助装入',1010,480,117,37,()=>this.repairStep(item,1),'quiet');
  }
  private weldInteraction(p:Node,item:OrbitalItem):void {
    const layer=this.h.ui.container(p,400,325,690,180,'weld-track');
    const ink=layer.addComponent<Graphics>(Graphics);
    ink.strokeColor=new Color('#DB8A5260');ink.lineWidth=4;ink.moveTo(90,-117);ink.bezierCurveTo(235,-160,330,-15,535,-57);ink.stroke();
    const a=this.box(layer,53,86,76,64,C.orange,'#152D3DF0','weld-start');
    const b=this.box(layer,502,24,76,64,C.cyan,'#152D3DF0','weld-end');
    this.h.ui.bindDraggable(a,()=>this.dragAvailable(layer));
    this.text(a,'供电',0,16,76,32,17,C.orange,'center');this.text(b,'负载',0,16,76,32,17,C.cyan,'center');
    const wire=this.h.ui.container(layer,0,0,690,180,'active-wire').addComponent<Graphics>(Graphics);
    this.dragGesture(layer,{
      movable:false,accept:event=>!!a.getComponent<UITransform>(UITransform)?.hitTest(event.getLocation()),
      move:({event})=>{
        const point=this.pointerLocal(layer,event),x=Math.max(0,Math.min(690,point.x)),y=Math.max(-180,Math.min(0,point.y));
        wire.clear();wire.strokeColor=new Color(C.orange);wire.lineWidth=5;wire.moveTo(90,-117);wire.lineTo(x,y);wire.stroke();
        wire.fillColor=new Color('#FFE3A8');wire.circle(x,y,6);wire.fill();
      },
      end:({event,moved})=>{wire.clear();if(moved&&b.getComponent<UITransform>(UITransform)?.hitTest(event.getLocation()))this.repairStep(item,2);else this.h.ui.toast('回路尚未闭合，从橙色供电端拖到青色负载端。');},
      cancel:()=>{if(wire.isValid)wire.clear();},
    });
    this.repairHint(p,'03 / 由供电端接至负载端，闭合回路');
    this.button(p,'辅助闭合回路',936,480,190,37,()=>this.repairStep(item,2),'quiet');
  }
  private coil(g:Graphics,x:number,y:number,r:number):void {
    g.lineWidth=5;for(let i=0;i<5;i++){g.strokeColor=new Color(i%2?C.orange:'#F1C084');g.ellipse(x-r+i*5,-y,r*.44,r);g.stroke();}
    g.lineWidth=3;g.strokeColor=new Color('#6EE0DE');g.moveTo(x-r,-y);g.lineTo(x-r-12,-y-21);g.stroke();
  }
  private calibrationInteraction(p:Node,item:OrbitalItem,recipe:RecipeDef):void {
    const optical=recipe.id==='REC-002';
    const instrument=this.h.ui.texturePanel(p,900,305,280,183,{skin:'socket',fill:'#0C171CEB',stroke:'#738C8055',materialOpacity:.84,name:'calibration-instrument'});instrument.setScale(.8,.8,1);
    const g=this.h.ui.container(instrument,0,0,280,183,'calibration-readout').addComponent<Graphics>(Graphics);let offset=optical?30:40;
    const readout=this.row(instrument,optical?'三色标靶对齐':'配重置于误差圈',8,149,264,25,18,C.orange,'center').getComponent<Label>(Label)!;
    const paint=()=>{
      g.clear();g.strokeColor=new Color('#536C7D');g.lineWidth=1;
      for(let x=18;x<270;x+=20){g.moveTo(x,-25);g.lineTo(x,-132);g.stroke();}
      for(let y=25;y<140;y+=20){g.moveTo(17,-y);g.lineTo(267,-y);g.stroke();}
      if(optical){
        ['#E38B77','#79D6AB','#7CB9F3'].forEach((color,i)=>{
          const d=(i-1)*offset;g.lineWidth=3;g.strokeColor=new Color(color);
          g.moveTo(78+d,-46);g.lineTo(199+d,-46);g.lineTo(199+d,-115);g.lineTo(78+d,-115);g.close();g.stroke();
        });
      }else{
        g.strokeColor=new Color(C.cyan);g.lineWidth=2;g.circle(140,-79,53);g.stroke();
        g.strokeColor=new Color('#6EE0DE66');g.circle(140,-79,13);g.stroke();
        g.fillColor=new Color(C.orange);g.roundRect(125+offset,-93,30,28,4);g.fill();
        g.strokeColor=new Color(C.text);g.moveTo(140,-17);g.lineTo(140,-143);g.stroke();
      }
      readout.color=new Color(Math.abs(offset)<5?C.cyan:C.orange);
    };
    paint();
    this.button(p,'← 微调',900,469,104,36,()=>{offset=Math.max(-60,offset-10);paint();},'quiet');
    this.button(p,'微调 →',1015,469,104,36,()=>{offset=Math.min(60,offset+10);paint();},'quiet');
    this.button(p,'记录校准',900,516,219,36,()=>Math.abs(offset)<5?this.repairStep(item,2):this.h.ui.toast(optical?'三色轮廓尚未重合，继续逐格微调。':'配重仍偏离中心误差圈，继续调整位置。'),'gold');
    this.repairHint(p,optical?'03 / 逐格微调，让三色轮廓重合':'03 / 微调配重，将砝码置于中心误差圈');
  }
  private materialShelf(p:Node,x:number,y:number,w:number):void {
    this.h.ui.rail(p,x,y,w,70,{fill:'#10191DC9',stroke:'#8B86704A',name:'repair-material-rail'});
    materials.forEach((m,i)=>{
      const width=w/6,xx=x+i*width;
      if(i)this.h.ui.line(p,xx,y+9,xx,y+59,'#7D807145',1);
      this.h.ui.materialIcon(p,m.id,xx+7,y+4,31,29);
      this.baseline(p,m.name,xx+43,y+24,width-98,15,C.text);
      this.baseline(p,`×${this.h.state.materials[m.id]||0}`,xx+width-53,y+24,43,14,C.text,'right');
      this.button(p,`补货 ${m.price} Cr`,xx+9,y+36,width-18,28,()=>this.h.dispatch({type:'BUY_MATERIAL',id:m.id,qty:1}),'quiet');
    });
  }
  private confirmDismantle(item:OrbitalItem):void {
    this.confirmDialog('拆解并回收材料',`${getDef(item.defId).name} 将从库存移除。\n回收导电纤维与标准微线圈；不保留完整原物。\n此操作不可逆，顾客委修件与抵押品不能拆解。`,()=>{this.h.dispatch({type:'DISMANTLE',uid:item.uid});if(!findItem(this.h.state,item.uid))this.effect('repair',{x:530,y:300,width:370,height:270});});
  }
  private confirmCraft(recipe:RecipeDef):void {
    if(this.h.busy)return;
    const s=this.h.state;
    const servo=s.inventory.find(it=>it.defId===recipe.itemId&&it.owner==='shop'&&!it.orderId&&it.working&&!it.sealed&&it.location!=='isolation');
    const bearing=s.inventory.find(it=>it.defId==='ITM-027'&&it.owner==='shop'&&!it.orderId&&it.working&&!it.sealed&&it.location!=='isolation');
    if(!servo||!bearing){this.h.ui.toast('组装需要自有正常伺服器与已注销轴承，委修原件、封存件不可作主料。');return;}
    this.closeModal();
    const m=this.h.ui.modal('组装舱门维护套组',{width:1170,height:690,onClose:()=>{this.modal=null;}});this.modal=m.overlay;
    const p=m.body;
    this.paragraph(p,'主料先对齐插槽，再闭合端子；最后确认时统一消耗原件、材料与2 AP。',15,1,1070,45,20,C.muted);
    const slots=[this.box(p,401,94,178,153,C.cyan,'#17303DE0','craft-servo-slot'),this.box(p,670,94,178,153,C.cyan,'#17303DE0','craft-bearing-slot')];
    this.row(p,'01 / 伺服器槽',401,64,178,24,14,C.muted,'center');this.row(p,'02 / 注销轴承槽',670,64,178,24,14,C.muted,'center');
    this.row(p,'主料托盘',15,64,347,24,14,C.muted);
    this.h.ui.line(p,579,160,670,160,C.line,2);
    const labels=['拖入伺服器','拖入注销轴承','连接端子 / 验证限位'];
    const progressLabel=this.row(p,'',15,365,1060,43,23,C.cyan,'center');
    const readyLabel=this.row(p,'',15,415,1060,53,19,C.muted,'center');
    const close=()=>{this.cancelDrag();const overlay=m.overlay;this.modal=null;if(!overlay.isValid)return;overlay.removeFromParent();if(overlay.isValid)overlay.destroy();};
    const confirm=this.button(p,'确认组装并消耗主料',590,502,478,54,()=>{
      if((this.h.state.repairProgress[servo.uid]||0)!==3){this.h.ui.toast('先将两件主料放入插槽并连通端子。');return;}
      close();this.h.dispatch({type:'CRAFT',recipeId:recipe.id});if(!findItem(this.h.state,servo.uid))this.effect('repair',{x:530,y:300,width:380,height:280});
    },'gold');
    this.button(p,'撤回预览',15,502,478,54,close,'quiet');
    const wire=this.h.ui.container(p,385,244,480,98,'craft-terminal-wire').addComponent<Graphics>(Graphics);
    const start=this.box(p,425,267,104,54,C.orange,'#122B3C','craft-positive');const startLabel=this.row(start,'供电端',0,0,104,54,17,C.orange,'center').getComponent<Label>(Label)!;
    const end=this.box(p,728,267,104,54,C.cyan,'#122B3C','craft-limit');const endLabel=this.row(end,'限位端',0,0,104,54,17,C.cyan,'center').getComponent<Label>(Label)!;
    const partNodes:Node[]=[],partLabels:Label[]=[];
    const terminal=this.h.ui.container(p,400,254,460,84,'craft-terminal-track');
    const refresh=()=>{
      const step=this.h.state.repairProgress[servo.uid]||0;
      progressLabel.getComponent<Label>(Label)!.string=step===3?'✓ 两主料已就位，双向限位验证通过':`步骤 ${step+1}/3 · ${labels[Math.min(2,step)]}`;
      readyLabel.getComponent<Label>(Label)!.string=Object.entries(recipe.materials).map(([id,q])=>`${materials.find(x=>x.id===id)?.name||id} ${this.h.state.materials[id]||0}/${q}`).join('  ·  ')+'  ·  2 AP';
      const affordable=this.h.state.ap>=recipe.ap&&Object.entries(recipe.materials).every(([id,q])=>(this.h.state.materials[id]||0)>=q);
      this.h.ui.setButtonEnabled(confirm,step===3&&affordable);
      this.h.ui.setButtonEnabled(auxiliary,step===2);
      startLabel.color=new Color(step===2?C.orange:step===3?C.cyan:C.muted);endLabel.color=new Color(step>=2?C.cyan:C.muted);
      partNodes.forEach((part,index)=>{
        const completed=step>index,active=step===index;
        if(completed)part.setPosition(401+index*269,-94);
        partLabels[index].string=`${index===0?'伺服器':'磁悬轴承'}${completed?' · 已就位':''}`;
        partLabels[index].color=new Color(completed?C.cyan:active?C.text:C.muted);
        const opacity=part.getComponent<UIOpacity>(UIOpacity)||part.addComponent<UIOpacity>(UIOpacity);opacity.opacity=completed?235:active?255:190;
      });
      wire.clear();if(step>=3){wire.lineWidth=4;wire.strokeColor=new Color(C.cyan);wire.moveTo(92,-51);wire.lineTo(395,-51);wire.stroke();}
    };
    const advance=(stage:number)=>{this.h.dispatch({type:'REPAIR_STEP',uid:servo.uid,stage});refresh();};
    const stageParts=[servo,bearing];
    stageParts.forEach((it,index)=>{
      const completed=(this.h.state.repairProgress[servo.uid]||0)>index;
      const part=this.box(p,completed?401+index*269:15+index*181,94,178,153,C.orange,'#152D3CF0',`craft-input-${index}`);
      this.h.ui.object(part,it.defId,21,10,137,104,{repaired:it.repaired});partNodes.push(part);partLabels.push(this.row(part,index===0?'伺服器':'磁悬轴承',8,116,162,27,16,C.text,'center').getComponent<Label>(Label)!);
      this.dragGesture(part,{
        bounds:{left:15,top:90,right:1069,bottom:340},enabled:()=>(this.h.state.repairProgress[servo.uid]||0)===index,
        end:({event,moved})=>{
          if(moved&&slots[index].getComponent<UITransform>(UITransform)?.hitTest(event.getLocation())){part.setPosition(401+index*269,-94);advance(index);}
          else if(moved)this.h.ui.toast('把主料放入同轮廓插槽，匹配后再连接端子。');
          refresh();
        },cancel:()=>{if(p.isValid)refresh();},
      });
    });
    this.h.ui.bindDraggable(start,()=>this.dragAvailable(terminal)&&(this.h.state.repairProgress[servo.uid]||0)===2);
    this.dragGesture(terminal,{
      movable:false,accept:event=>(this.h.state.repairProgress[servo.uid]||0)===2&&!!start.getComponent<UITransform>(UITransform)?.hitTest(event.getLocation()),
      move:({event})=>{
        const point=this.pointerLocal(wire.node,event),x=Math.max(0,Math.min(480,point.x)),y=Math.max(-98,Math.min(0,point.y));
        wire.clear();wire.strokeColor=new Color(C.orange);wire.lineWidth=4;wire.moveTo(92,-51);wire.lineTo(x,y);wire.stroke();
      },
      end:({event,moved})=>{if(moved&&end.getComponent<UITransform>(UITransform)?.hitTest(event.getLocation()))advance(2);else{refresh();this.h.ui.toast('从供电端连接到限位端，完成双向回路。');}},
      cancel:()=>{if(p.isValid)refresh();},
    });
    const auxiliary=this.button(p,'辅助连接端子',851,268,218,51,()=>{if((this.h.state.repairProgress[servo.uid]||0)===2)advance(2);else this.h.ui.toast('先将两件主料拖入插槽。');},'quiet');
    refresh();
  }

  private warehouse(p:Node):void {
    const s=this.h.state,item=this.item();
    const inStock=!!item&&s.inventory.some(stored=>stored.uid===item.uid);
    this.title(p,'WAREHOUSE / SCN-003','仓储与安检',40,1010);
    this.h.ui.panel(p,30,205,720,404,{fill:'#091315A3',stroke:'#7D82743B',radius:3,lineWidth:.8,name:'warehouse-rack'});
    this.baseline(p,`后仓 / 10 × 6`,47,228,400,18,C.text);
    this.baseline(p,`${s.inventory.filter(i=>i.location==='warehouse').length} 件在库`,540,228,187,14,C.muted,'right');
    const gx=47,gy=249,cw=68,ch=55;
    const grid=this.h.ui.panel(p,gx,gy,cw*10,ch*6,{fill:'#111B21D6',lineWidth:0,radius:0,name:'warehouse-grid-bed'});
    const gridInk=this.h.ui.container(p,gx,gy,cw*10,ch*6,'warehouse-grid-lines').addComponent<Graphics>(Graphics);
    gridInk.fillColor=new Color(112,137,144,122);
    for(let x=0;x<=10;x++){gridInk.rect(Math.min(cw*10-1,x*cw),-ch*6,1,ch*6);gridInk.fill();}
    for(let y=0;y<=6;y++){gridInk.rect(0,-Math.min(ch*6,y*ch+1),cw*10,1);gridInk.fill();}
    [0,4,9].forEach(x=>this.text(p,String(x+1).padStart(2,'0'),gx+x*cw,235,50,14,9,'#B0B1A960','center'));
    [0,2,5].forEach(y=>this.text(p,String.fromCharCode(65+y),32,gy+y*ch+17,12,15,9,'#B0B1A960','center'));
    for(let y=0;y<6;y++)for(let x=0;x<10;x++){
      this.h.ui.container(p,gx+x*cw,gy+y*ch,cw-4,ch-4,`warehouse-cell-${x}-${y}`);
    }
    const preview=this.h.ui.container(p,gx,gy,cw*10,ch*6,'warehouse-preview').addComponent<Graphics>(Graphics);
    s.inventory.filter(it=>it.location==='warehouse').forEach(it=>{
      const [iw,ih]=this.dims(it),xx=gx+it.x*cw,yy=gy+it.y*ch;
      const node=this.box(p,xx,yy,iw*cw-4,ih*ch-4,it.uid===this.h.selected?C.orange:'#8D968559',it.uid===this.h.selected?'#203438C9':'#141F22A6',`warehouse-item-${it.uid}`);
      this.h.ui.object(node,it.defId,4,3,iw*cw-12,ih*ch-13,{repaired:it.repaired,damaged:!it.working});
      this.row(node,it.sourceVerified?'✓':it.owner==='customer'?'委':'?',3,3,20,18,12,it.sourceVerified?C.cyan:C.orange,'center');
      const target=(raw:Vec3)=>({x:Math.round((raw.x-gx)/cw),y:Math.round((-raw.y-gy)/ch)});
      const inGrid=(event:EventTouch)=>!!grid.getComponent<UITransform>(UITransform)?.hitTest(event.getLocation());
      const drawPreview=(x:number,y:number,outside=false)=>{
        preview.clear();const valid=!outside&&canPlace(s,it.uid,x,y,it.rotated),px=Math.max(0,x*cw),py=Math.max(0,y*ch),pw=Math.min(cw*10-1,(x+iw)*cw-3)-px,ph=Math.min(ch*6-1,(y+ih)*ch-3)-py;
        if(pw<=0||ph<=0)return;
        preview.fillColor=valid?new Color(118,186,187,85):new Color(209,141,119,105);preview.rect(px,-py-ph,pw,ph);preview.fill();
        preview.fillColor=valid?new Color(118,186,187,240):new Color(209,141,119,240);
        for(const [rx,ry,rw,rh]of [[px,-py-2,pw,2],[px,-py-ph,pw,2],[px,-py-ph,2,ph],[px+pw-2,-py-ph,2,ph]]){preview.rect(rx,ry,rw,rh);preview.fill();}
        if(!valid){preview.strokeColor=new Color(209,141,119,220);preview.lineWidth=2;for(let k=-ph;k<pw;k+=14){const from=Math.max(0,-k),to=Math.min(ph,pw-k);if(to<=from)continue;preview.moveTo(px+k+from,-py-from);preview.lineTo(px+k+to,-py-to);preview.stroke();}}
      };
      this.dragGesture(node,{
        bounds:{left:gx,top:gy,right:gx+cw*10,bottom:gy+ch*6},
        start:()=>{this.h.selected=it.uid;preview.node.setSiblingIndex(p.children.length-1);drawPreview(it.x,it.y);},
        move:({event,raw,moved})=>{if(!moved)return;const cell=target(raw);drawPreview(cell.x,cell.y,!inGrid(event));},
        end:({event,raw,moved})=>{
          preview.clear();
          if(moved){if(inGrid(event)){const cell=target(raw);this.h.dispatch({type:'MOVE',uid:it.uid,x:cell.x,y:cell.y,rotated:it.rotated});}}
          else this.h.select(it.uid);
        },
        cancel:()=>{if(preview.isValid)preview.clear();},
      });
    });
    this.row(p,'拖动实物入格 · R 旋转 · 红色斜纹表示重叠或越界',47,588,680,22,15,C.muted);
    this.h.ui.rail(p,30,622,720,149,{fill:'#121A1CA8',stroke:'#8B86704A',name:'warehouse-sales-rack'});
    this.row(p,'销售陈列 / 8 × 3',47,629,680,25,16,C.orange);
    const sale=s.inventory.filter(it=>it.location==='display');
    for(let i=0;i<24;i++){
      const xx=46+(i%8)*86,yy=660+Math.floor(i/8)*35,it=sale[i];
      const cell=this.h.ui.panel(p,xx,yy,81,31,{stroke:it?.uid===this.h.selected?C.cyan:it?'#9E9C805A':'#8F97842B',fill:it?'#223036AD':'#0C151C38',radius:2,lineWidth:.7,name:`display-slot-${i}`});
      if(it){this.h.ui.object(cell,it.defId,2,1,34,28,{repaired:it.repaired});this.row(cell,`${it.listPrice}`,37,0,40,31,13,C.text,'right');this.h.ui.bindPointer(cell,{cursor:'pointer',disabled:()=>this.h.busy});cell.on(Node.EventType.TOUCH_END,()=>!this.h.busy&&this.h.select(it.uid));}
    }
    this.h.ui.texturePanel(p,766,205,318,566,{skin:'glass',fill:'#0C171BBB',stroke:'#7D82743D',materialOpacity:.29,name:'warehouse-security-station'});
    this.row(p,'CARGO SCANNER / 03',785,216,279,22,12,C.muted);
    this.row(p,item&&!inStock?'柜台来件 · 尚未入库':'入库扫描仪',785,239,279,29,item&&!inStock?19:22,C.text);
    const scanner=this.h.ui.texturePanel(p,785,278,279,283,{skin:'socket',fill:'#1420248A',stroke:'#84938468',materialOpacity:.88,name:'warehouse-scanner'});
    if(item)this.h.ui.object(scanner,item.defId,28,38,225,211,{repaired:item.repaired,damaged:!item.working});
    for(let y=20;y<280;y+=30){this.h.ui.line(scanner,8,y,20,y,'#77C3C577',2);this.h.ui.line(scanner,258,y,270,y,'#77C3C577',2);}
    this.scanner=this.h.ui.container(scanner,0,0,279,292,'scanner-light').addComponent<Graphics>(Graphics);
    this.button(p,'扫描当前物件',785,577,279,45,()=>{if(!item||!inStock)return;this.h.dispatch({type:'SCAN',uid:item.uid});this.scanUntil=this.clock+1.5;this.effect('scan',{x:800,y:285,width:245,height:250});},'green',!item||!inStock);
    const scanStatus=item&&!inStock?'柜台来件 · 入库后可扫描':item&&s.scanned.includes(item.uid)?'扫描完成 · 可比对来源证据':'未扫描 · 放入货物后启动';
    this.row(p,scanStatus,785,635,279,28,17,C.muted,'center');
    const warn=s.inspection==='pending'?'饶静已到站 · 请处理待核货物':s.inspection==='cleared'?'本次检查已完成 · 回执归档':'预告：第3天进行预约核验';
    this.line(p,785,674,279,'#8B86704A');
    this.paragraph(p,warn,785,692,279,54,16,s.inspection==='pending'?C.orange:C.muted);
    this.h.ui.texturePanel(p,1100,130,470,640,{skin:'glass',fill:'#10191DD4',stroke:C.line,materialOpacity:.39,name:'warehouse-cargo-file'});
    this.row(p,'CARGO FILE / 来源与处置',1120,146,425,33,15,C.orange);
    if(!item){this.text(p,'点选仓格中的实物',1120,245,425,60,23,C.muted,'center');return;}
    const def=getDef(item.defId),a=estimate(item);
    this.row(p,def.name,1120,196,425,39,29);
    this.row(p,inStock?this.ownership(item):'柜台来件 · 尚未成交',1120,242,286,28,16,C.muted);
    this.row(p,`${def.size[0]}×${def.size[1]} 格`,1418,242,127,28,16,C.muted,'right');
    this.row(p,`估值 ${a.low}–${a.high} Cr`,1120,284,425,33,24,C.orange);
    this.paragraph(p,'来源',1120,329,50,52,18,C.muted);
    this.paragraph(p,item.source,1180,329,365,52,18,C.muted);
    this.row(p,'独立物证',1120,388,90,29,17,item.sourceVerified?C.cyan:C.orange);
    this.row(p,`${item.evidence.length} 项`,1216,388,62,29,17,item.sourceVerified?C.cyan:C.orange,'right');
    this.row(p,item.sourceVerified?'来源已登记':'来源未登记',1340,388,205,29,17,item.sourceVerified?C.cyan:C.orange,'right');
    this.row(p,!inStock?'尚未入库 · 返回柜台完成交易':`${item.sealed?'封签完好':'未封签'} · ${item.repaired?'已修复':item.working?'功能待复核':'功能故障'} · ${item.location==='isolation'?'隔离存放':item.location==='pawn'?'抵押保管':item.location==='display'?'销售架':'普通仓库'}`,1120,431,425,30,17,C.muted);
    const buyer=s.trade?.kind==='sell'&&!s.trade.locked;
    this.button(p,buyer?'推荐给当前顾客':item.location==='display'?'撤回普通仓库':'放上销售架',1120,506,205,44,()=>this.h.dispatch(buyer?{type:'SELECT_TRADE',uid:item.uid}:{type:'DISPLAY',uid:item.uid}),'gold',!inStock||item.owner!=='shop'||!!buyer&&(!item.sourceVerified||item.location==='isolation'||item.sealed||!!item.orderId));
    this.button(p,'旋转 90°',1340,506,205,44,()=>this.h.dispatch({type:'MOVE',uid:item.uid,x:item.x,y:item.y,rotated:!item.rotated}),'quiet',!inStock||item.location!=='warehouse');
    this.button(p,'登记并封签',1120,565,205,44,()=>{this.h.dispatch({type:'REGISTER',uid:item.uid});if(findItem(this.h.state,item.uid)?.sourceVerified)this.effect('stamp',{x:1300,y:405});},'green',!inStock||item.sourceVerified);
    this.button(p,item.location==='isolation'?'移出隔离柜':'隔离待核验',1340,565,205,44,()=>this.h.dispatch({type:'ISOLATE',uid:item.uid}),'quiet',!inStock);
    this.button(p,'到鉴定台补证',1120,624,205,44,()=>this.h.navigate('inspect',item.uid),'green');
    const relief=s.ledger.some(e=>e.kind==='relief-window'&&e.day===s.day),eligible=relief&&item.owner==='shop'&&!item.orderId&&!item.sealed&&item.sourceVerified&&item.evidence.length>=2&&item.location!=='isolation';
    this.button(p,eligible?'应急清仓…':item.owner==='pawn'?'赎回原物':'退回来源方…',1340,624,205,44,()=>{
      if(eligible)this.confirmDialog('应急清仓',`${def.name} 按估值55%回收，获得 ${Math.floor(itemValue(item)*.55)} Cr，不消耗 AP。\n确认后原物移交，款项与出库同时保存。`,()=>this.h.dispatch({type:'EMERGENCY_SALE',uid:item.uid}));
      else if(item.owner==='pawn')this.h.dispatch({type:'REDEEM',uid:item.uid});
      else this.confirmDialog('退回来源方',`退还 ${def.name} 并移出当前库存。\n已支付采购款不自动返还；本操作不会伪造来源证据。`,()=>this.h.dispatch({type:'RETURN_ITEM',uid:item.uid}));
    },'danger',!inStock);
    this.row(p,eligible?`应急回收 ${Math.floor(itemValue(item)*.55)} Cr · 55%估值 / 0 AP`:'登记需：扫描 + 2项独立证据 + 35 Cr / 1 AP',1120,471,425,24,14,eligible?C.orange:C.muted);
    this.button(p,'隔离柜 4 × 3',1120,678,204,25,()=>{this.cabinet='isolation';this.h.render();},this.cabinet==='isolation'?'green':'quiet',false);
    this.button(p,'抵押柜 4 × 4',1340,678,205,25,()=>{this.cabinet='pawn';this.h.render();},this.cabinet==='pawn'?'green':'quiet',false);
    const isolated=s.inventory.filter(it=>it.location===this.cabinet);
    for(let i=0;i<(this.cabinet==='pawn'?16:12);i++){
      const xx=1120+(i%4)*105,yy=708+Math.floor(i/4)*17,it=isolated[i];
      const cell=this.h.ui.panel(p,xx,yy,97,15,{stroke:it?.uid===this.h.selected?C.cyan:it?'#AEA4B464':'#7D82742D',fill:it?'#3A3945AB':'#10191D38',radius:1,lineWidth:.6,name:`${this.cabinet}-slot-${i}`});
      if(it){this.h.ui.object(cell,it.defId,2,0,27,18,{repaired:it.repaired});this.row(cell,it.owner==='pawn'?'抵押':'隔离',33,0,60,15,10,C.text);this.h.ui.bindPointer(cell,{cursor:'pointer',disabled:()=>this.h.busy});cell.on(Node.EventType.TOUCH_END,()=>!this.h.busy&&this.h.select(it.uid));}
    }
  }
  private orders(p:Node):void {
    const s=this.h.state;
    if(!orderDefs.some(o=>o.id===this.orderId))this.orderId=orderDefs[0]?.id||'';
    const order=getOrder(this.orderId),os=s.orders.find(o=>o.id===order.id),status=os?.status||'available';
    this.title(p,'ORDERS / 今日公告与委修','订单与委托',40,850);
    orderDefs.forEach((o,i)=>{
      const x=40+(i%3)*289,y=211+Math.floor(i/3)*135,st=s.orders.find(v=>v.id===o.id)?.status||'available',locked=(orderEarliest[o.id]||1)>s.day,selected=o.id===this.orderId;
      const card=this.h.button(p,'',x,y,274,122,()=>{this.orderId=o.id;this.stagedUid='';this.h.render();},{tone:'quiet',selected,name:`order-${o.id}`});
      this.h.ui.texturePanel(card,0,0,274,122,{skin:'strip',fill:selected?'#1A2A30E6':'#101A22D6',lineWidth:0,materialOpacity:.55,name:'order-card-backing'}).setSiblingIndex(0);
      this.h.ui.line(card,12,30,262,30,selected?'#76BABB88':'#B2AC872F',.7);
      this.row(card,o.id.replace('ORD-','NO. '),12,7,100,18,10,selected?C.cyan:C.muted);
      this.row(card,`D${String(o.dueDay).padStart(2,'0')} 截止`,155,7,107,18,10,C.muted,'right');
      this.h.ui.object(card,o.itemId,9,37,74,74,{damaged:o.needsRepair});
      this.paragraph(card,o.name,91,35,171,44,16,selected?C.text:C.muted);
      this.baseline(card,`${o.reward} Cr`,91,103,86,17,selected?C.orange:C.text);
      this.baseline(card,locked?`D${orderEarliest[o.id]} 开放`:statusText[st],179,103,83,12,st==='done'?C.cyan:locked?C.muted:selected?C.cyan:C.muted,'right');
    });
    this.h.ui.texturePanel(p,928,130,642,314,{skin:'glass',fill:'#10191DD6',stroke:C.line,materialOpacity:.43,name:'order-manifest'});
    this.h.ui.texturePanel(p,928,457,642,313,{skin:'socket',fill:'#10191D55',stroke:'#7D82743B',materialOpacity:.39,name:'order-handover-station'});
    this.row(p,'DELIVERY MANIFEST / 订单详情',948,145,602,29,14,C.orange);
    this.row(p,order.name,948,189,602,42,29);
    this.baseline(p,`${order.id}  /  ${order.customerOwned?'顾客委修原物':'店铺自有货物'}  /  D${String(order.dueDay).padStart(2,'0')} 截止`,948,264,410,15,C.muted);
    this.baseline(p,`${order.reward} Cr`,1365,264,185,25,C.orange,'right');
    this.paragraph(p,order.description.replace(/；\s*/g,'；\n'),948,284,602,92,18,'#BCC1B7');
    this.line(p,948,389,602);
    this.row(p,`要求：${getDef(order.itemId).name}`,948,403,310,30,17);
    this.row(p,`品相≥${Math.round(order.minCondition*100)}%${order.needsRepair?' · 已修复':''}`,1274,403,276,30,17,C.text,'right');
    const earliest=orderEarliest[order.id]||1,available=status==='available'&&s.day>=earliest;
    if(status==='available'){
      this.row(p,'原物交接 / ITEM PREVIEW',948,466,400,22,11,C.muted);
      this.h.ui.object(p,order.itemId,1028,484,345,184,{damaged:order.needsRepair});
      this.row(p,order.customerOwned?'原件随委托移交':'需匹配合规库存',1365,527,175,52,17,C.text,'center');
      this.row(p,'接取后保留归属、材料要求与到期日；交付前可预览。',948,666,602,24,15,C.muted);
      this.button(p,available?'接取订单':`第${earliest}天开放`,948,707,602,47,()=>this.h.dispatch({type:'TAKE_ORDER',id:order.id}),'gold',!available);
      return;
    }
    if(status==='done'||status==='failed'){
      this.h.ui.object(p,order.itemId,967,479,240,228,{damaged:order.needsRepair});
      this.text(p,status==='done'?'已交付':'订单已过期',1225,505,305,50,29,status==='done'?C.cyan:C.red);
      this.text(p,status==='done'?'凭证已归档\n报酬、物件与关系已在交付时记录。':'物件仍在库存\n可到仓库继续处理。',1225,572,305,107,18,C.muted);return;
    }
    const candidates=s.inventory.filter(it=>it.defId===order.itemId);
    const staged=s.inventory.find(it=>it.uid===this.stagedUid);
    this.row(p,'原件与合格库存 / 点击或拖入交付盘',948,452,602,30,15,C.muted);
    const tray=this.h.ui.texturePanel(p,1080,553,350,111,{skin:'socket',fill:'#182326D2',stroke:'#C38A4D8F',materialOpacity:.90,name:'order-delivery-tray'});
    this.row(tray,'交付盘 / 确认前可撤回',10,82,330,24,14,C.orange,'center');
    const dropGlow=this.h.ui.container(tray,3,3,344,105,'order-drop-guide').addComponent<Graphics>(Graphics);
    candidates.slice(0,5).forEach((it,i)=>{
      const x=948+i*119,y=492;
      const card=this.h.ui.texturePanel(p,x,y,109,54,{skin:'socket',fill:'#1C292DD1',stroke:it.uid===this.stagedUid?C.cyan:C.line,materialOpacity:.60,name:`order-candidate-${it.uid}`});
      this.h.ui.object(card,it.defId,3,2,65,49,{repaired:it.repaired,damaged:!it.working});this.row(card,it.uid===this.stagedUid?'盘':it.repaired?'修':'原',74,0,27,54,15,it.uid===this.stagedUid||it.repaired?C.cyan:C.muted,'center');
      const guide=(hovered:boolean)=>{dropGlow.clear();dropGlow.strokeColor=new Color(hovered?C.cyan:C.orange);dropGlow.lineWidth=2;dropGlow.rect(0,-105,344,105);dropGlow.stroke();};
      this.dragGesture(card,{
        bounds:{left:948,top:492,right:1550,bottom:664},start:()=>guide(false),
        move:({event})=>guide(!!tray.getComponent<UITransform>(UITransform)?.hitTest(event.getLocation())),
        end:({event,moved})=>{dropGlow.clear();if(!moved||tray.getComponent<UITransform>(UITransform)?.hitTest(event.getLocation())){this.stagedUid=it.uid;this.h.render();}else this.h.ui.toast('把原物拖入橙色交付盘，或点选原物预览。');},
        cancel:()=>{if(dropGlow.isValid)dropGlow.clear();},
      });
    });
    if(!candidates.length)this.text(p,'仓库暂无相同型号，先取得原物或接收委修件。',948,494,602,45,18,C.muted);
    if(staged){
      this.h.ui.object(tray,staged.defId,76,0,198,82,{repaired:staged.repaired});
      const reasons=this.orderReasons(order,staged);
      this.paragraph(p,reasons.length?reasons.join(' · '):'✓ 型号、归属、证据和状态符合要求',948,669,602,43,15,reasons.length?C.orange:C.cyan);
      this.button(p,'确认交付并领取报酬',948,720,427,40,()=>{this.h.dispatch({type:'DELIVER_ORDER',id:order.id,uid:staged.uid});this.stagedUid='';if(this.h.state.orders.find(o=>o.id===order.id)?.status==='done')this.effect('stamp',{x:1300,y:450});},'gold',reasons.length>0);
      this.button(p,'撤回',1390,720,160,40,()=>{this.stagedUid='';this.h.render();},'quiet');
    }else{
      this.row(p,'选中原物后会显示具体合格项与缺项。',948,677,602,31,17,C.muted);
      this.button(p,'到仓库选择物件',948,720,292,40,()=>this.h.navigate('warehouse'),'green');
      if(os?.uid)this.button(p,'处理委修原物',1257,720,293,40,()=>this.h.navigate('repair',os.uid!),'gold');
    }
  }
  private orderReasons(order:OrderDef,item:OrbitalItem):string[] {
    const reasons:string[]=[];
    if(item.defId!==order.itemId)reasons.push('型号不一致');
    if(item.owner==='customer'&&item.orderId!==order.id)reasons.push('属于其他委修单');
    if(item.owner==='pawn')reasons.push('抵押保管品不可交付');
    if(item.condition<order.minCondition)reasons.push('品相不足');
    if(order.needsRepair&&!item.repaired)reasons.push('尚未完成维修');
    if(order.needsRepair&&!item.working)reasons.push('功能未恢复');
    if(order.customerOwned&&(item.owner!=='customer'||item.orderId!==order.id))reasons.push('必须交还本单委修原物');
    if(!order.customerOwned&&(item.owner!=='shop'||!item.sourceVerified))reasons.push('需自有且来源已登记的货物');
    if(item.evidence.length<2)reasons.push('需两项独立物证');
    if(order.id==='ORD-004'&&!this.h.state.inventory.some(it=>it.defId==='ITM-041'&&it.owner==='shop'&&it.working&&it.sourceVerified&&it.evidence.length>=2))reasons.push('缺已核验的健康藻苗罐');
    return reasons;
  }
  private report(p:Node):void {
    const s=this.h.state,r=s.report,ended=s.phase==='ending';
    this.title(p,'DAILY LEDGER / 每次提交均可追溯',ended?'经营阶段结束':`第 ${String(s.day).padStart(2,'0')} 日 · 营业结算`);
    this.h.ui.texturePanel(p,30,205,920,566,{skin:'glass',fill:'#10191DCF',stroke:'#8B86704A',materialOpacity:.33,name:'daily-navigation-ledger'});
    const today=s.ledger.filter(x=>x.day===s.day),income=r?.income??today.filter(x=>x.amount>0).reduce((a,b)=>a+b.amount,0),expenses=r?.expenses??-today.filter(x=>x.amount<0).reduce((a,b)=>a+b.amount,0),maintenance=r?.maintenance??20,rent=r?.rent??(s.day%7===0?Math.round(450*Math.pow(1.1,Math.floor((s.day-1)/7))):0);
    this.baseline(p,'现金流与固定费用',53,248,650,22);
    this.baseline(p,`LOG / D${String(s.day).padStart(2,'0')}`,735,248,187,12,C.muted,'right');
    this.row(p,'可用现金 / AVAILABLE CREDIT',53,270,560,22,12,C.muted);
    this.baseline(p,s.cash.toLocaleString(),53,347,655,46,C.text);
    this.baseline(p,'Cr',753,347,169,25,C.orange,'right');
    this.line(p,53,371,869,'#8B867043');
    const values=[{name:'营业流入',value:income,color:C.cyan},{name:'采购与支出',value:expenses,color:C.orange},{name:'能源维护',value:maintenance,color:'#AC987C'},{name:'本日租金',value:rent,color:C.purple}];
    const max=Math.max(80,...values.map(v=>v.value));
    this.h.ui.line(p,65,559,908,559,'#8B86705C',1);
    values.forEach((v,i)=>{
      const x=92+i*207,h=Math.max(3,v.value/max*132);
      this.h.ui.panel(p,x,552-h,117,h,{fill:`${v.color}90`,lineWidth:0,radius:1});
      this.h.ui.line(p,x,552-h,x+117,552-h,v.color,2);
      this.text(p,`${i===0?'+':'−'}${v.value}`,x-20,515-h,157,31,22,C.text,'center');
      this.text(p,v.name,x-35,576,187,25,16,C.muted,'center');
    });
    const net=today.reduce((n,e)=>n+e.amount,0);
    this.line(p,53,626,869,'#8B867043');
    this.baseline(p,'今日净现金变化',53,675,320,18,C.muted);
    this.baseline(p,`${net>=0?'+':''}${net} Cr`,391,675,531,33,net>=0?C.cyan:C.orange,'right');
    this.row(p,s.phase==='open'?'打烊时统一结算维护与到期租金。':'费用与本日记录已保存。',53,718,869,27,16,C.muted);
    this.h.ui.texturePanel(p,970,130,600,640,{skin:'glass',fill:'#10191DD4',stroke:C.line,materialOpacity:.42,name:'daily-captains-log'});
    this.row(p,'NEXT SHIFT / 下一日安排',991,147,558,33,15,C.orange);
    const forecast=s.day===1?'第2日：维修订单与原件归属':s.day===2?'第3日：预约安检与来源核验':s.day%7===6?'明日到期租金，请预留现金':'查看新订单，继续处理货源与维修';
    this.paragraph(p,forecast,991,196,558,58,23,C.text);
    const relief=s.ledger.some(e=>e.kind==='relief-window'&&e.day===s.day);
    this.text(p,`未完成订单 ${s.orders.filter(x=>x.status==='active').length}  ·  关注度 ${s.risk}/100`,991,262,relief?320:558,28,18,C.muted);
    if(relief)this.button(p,'回仓储处理缺口',1320,258,230,35,()=>this.h.navigate('warehouse'),'gold');
    this.line(p,991,304,558);
    this.row(p,'营业流水 / TRANSACTIONS',991,319,558,31,15,C.muted);
    today.slice(-4).reverse().forEach((entry,i)=>{
      this.baseline(p,entry.label,991,385+i*39,384,16,C.muted);
      this.baseline(p,`${entry.amount>=0?'+':''}${entry.amount}`,1380,385+i*39,169,18,entry.amount>=0?C.cyan:C.orange,'right');
      this.line(p,991,397+i*39,558,'#8B867026');
    });
    if(!today.length)this.row(p,'今日还没有已提交交易。',991,362,558,45,18,C.muted);
    this.row(p,s.day<3?'设备改造 / 第3日日结开放':'设备改造 / 本日限选一项',991,527,558,29,15,C.muted);
    const upgraded=!!r?.upgraded;
    const options:[string,'lamp'|'shelf',string][]=[['精密工作灯','lamp','鉴定包免AP'],['模组销售架','shelf','合规挂牌价+5%']];
    options.forEach(([name,id,desc],i)=>{
      const xx=991+i*285,disabled=s.phase!=='report'||s.day<3||upgraded||s.upgrades[id]||s.cash<(id==='lamp'?120:160);
      const card=this.h.button(p,'',xx,570,273,95,()=>{this.h.dispatch({type:'UPGRADE',id});if(this.h.state.upgrades[id])this.effect('stamp',{x:xx+130,y:610});},{tone:'quiet',selected:s.upgrades[id],disabled,name:`upgrade-${id}`});
      this.h.ui.panel(card,0,0,273,95,{fill:s.upgrades[id]?'#1A2A30F0':'#101A22F0',lineWidth:0,radius:3,name:'upgrade-card-backing'}).setSiblingIndex(0);
      const icon=this.h.ui.toolIcon(card,id==='lamp'?'TOL-001':'TOL-005',10,12,62,63);
      if(disabled&&!s.upgrades[id])(icon.getComponent<UIOpacity>(UIOpacity)||icon.addComponent<UIOpacity>(UIOpacity)).opacity=160;
      this.row(card,name,83,8,177,27,18,s.upgrades[id]?C.cyan:disabled?C.muted:C.text);
      this.row(card,desc,83,38,177,21,13,C.muted);
      this.baseline(card,s.upgrades[id]?'已安装':`${id==='lamp'?120:160} Cr`,83,82,70,13,s.upgrades[id]?C.cyan:disabled?C.muted:C.orange);
      const status=s.upgrades[id]?'':s.day<3?'第3日开放':s.phase!=='report'?'打烊后可选':upgraded?'今日已改造':s.cash<(id==='lamp'?120:160)?'资金不足':'可安装';
      this.baseline(card,status,157,82,103,12,disabled?C.muted:C.cyan,'right');
    });
    if(s.phase==='open')this.button(p,'确认打烊并结算',991,705,558,48,()=>this.confirmDialog('确认结束本日营业',`本日还剩 ${s.ap} AP。\n能源维护 ${maintenance} Cr，租金 ${rent} Cr。\n未完成订单保留到期日；确认后一次扣款并生成报告。`,()=>this.h.dispatch({type:'SETTLE'})),'gold');
    else if(ended)this.button(p,'重新接手当铺',991,705,558,48,()=>this.confirmDialog('重新开始经营','将为新店建立独立经营进度。建议先导出本轮档案。',()=>this.h.resetGame()),'gold');
    else this.button(p,`迎接第 ${s.day+1} 天`,991,705,558,48,()=>this.h.dispatch({type:'NEXT'}),'gold');
  }
  private settings(p:Node):void {
    this.title(p,'SYSTEM / 操作与档案','暂停与设置');
    this.h.ui.panel(p,53,205,945,34,{fill:'#0B151DEE',lineWidth:0,radius:3,name:'settings-preferences-caption'});
    this.row(p,'操作偏好 / CONSOLE PREFERENCES',53,211,930,23,12,C.muted);
    const settings:[keyof typeof this.h.prefs,string,string][]=[['sound','游戏声音','操作、扫描与成交提示音'],['reducedMotion','减少动态','省略位移与装饰动态，保留状态和必要反馈'],['largeText','放大文字','增大主要说明与按钮文字']];
    settings.forEach(([key,title,desc],i)=>{
      const y=249+i*111;
      this.h.ui.texturePanel(p,53,y,945,88,{skin:'strip',fill:'#10191DD4',stroke:'#8B86703A',materialOpacity:.37,name:`setting-${key}-strip`});
      this.baseline(p,String(i+1).padStart(2,'0'),71,y+45,36,12,C.muted);
      this.baseline(p,title,119,y+45,633,23);this.baseline(p,desc,119,y+69,633,16,C.muted);
      this.button(p,this.h.prefs[key]?'开启':'关闭',799,y+23,177,48,()=>{this.h.prefs[key]=!this.h.prefs[key];this.h.savePrefs();this.h.render();},this.h.prefs[key]?'green':'quiet');
    });
    this.line(p,53,602,945,'#8B86706B');
    this.button(p,'导出经营档案',53,620,294,57,()=>this.h.exportSave(),'green');
    this.button(p,'重新开始…',365,620,294,57,()=>this.confirmDialog('重新开始经营','这会覆盖当前轨道旧货局进度。\n可先取消并导出经营档案。\n旧版灰线旧货铺存档仍保留在独立键中。',()=>this.h.resetGame()),'danger');
    this.button(p,'返回柜台',677,620,321,57,()=>this.h.navigate('counter'),'gold');
    this.h.ui.texturePanel(p,53,700,945,71,{skin:'strip',fill:'#10191DCB',lineWidth:0,materialOpacity:.25,name:'settings-console-note'});
    this.paragraph(p,'浏览、工具瞄准与查看证据不消耗行动点。所有扣款在最后确认时提交。',72,716,907,39,16,C.muted);
    this.h.ui.texturePanel(p,1040,130,530,640,{skin:'glass',fill:'#10191DD4',stroke:C.line,materialOpacity:.36,name:'settings-field-manual'});
    this.row(p,'FIELD MANUAL / 操作指引',1063,147,484,37,16,C.orange);
    const guide=[['拿取与搬运','鼠标拖动实物；红色格位表示位置冲突。'],['鉴定与证据','使用不同仪器记录独立物证，同件鉴定包只扣一次 AP。'],['维修与拆解','拆盖、插接、闭合回路后统一确认材料与工时。'],['订单与归属','交付盘先预览；顾客原件与抵押保管物不可当自有货出售。'],['扫描与隔离','来源不明时补证或隔离，登记不等于伪造所有权。']];
    guide.forEach(([title,description],i)=>{
      this.baseline(p,String(i+1).padStart(2,'0'),1063,234+i*103,32,11,C.muted);
      this.baseline(p,title,1111,234+i*103,436,20,C.text);
      this.paragraph(p,description,1111,249+i*103,436,57,17,C.muted);
      if(i<guide.length-1)this.line(p,1111,304+i*103,436,'#8B86702F');
    });
  }
  private confirmDialog(title:string,body:string,confirm:()=>void):void {
    if(this.h.busy)return;
    this.closeModal();
    const m=this.h.ui.modal(title,{width:970,height:480,onClose:()=>{this.modal=null;}});this.modal=m.overlay;
    this.text(m.body,body,15,15,876,180,23,C.text);
    const close=()=>{const overlay=m.overlay;this.modal=null;if(!overlay.isValid)return;overlay.removeFromParent();if(overlay.isValid)overlay.destroy();};
    this.button(m.body,'取消',16,231,405,56,close,'quiet');
    this.button(m.body,'确认执行',453,231,405,56,()=>{close();confirm();},'gold');
  }
  private drawWave(p:Node,x:number,y:number,w:number,h:number,healthy:boolean):void {
    const n=this.box(p,x,y,w,h,C.line,'#0B222EF0');const g=n.addComponent<Graphics>(Graphics);
    g.strokeColor=new Color(healthy?C.cyan:C.orange);g.lineWidth=2;
    for(let xx=9;xx<w-9;xx+=3){const yy=h/2+Math.sin(xx*.1)*h*.22;if(xx===9)g.moveTo(xx,-yy);else g.lineTo(xx,-yy);}g.stroke();
    this.text(n,'复测稳定',8,h-27,w-16,23,15,C.cyan,'center');
  }
}
