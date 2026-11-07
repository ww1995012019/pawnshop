import {Color,EventKeyboard,EventTouch,Graphics,input,Input,KeyCode,Label,Node,UITransform,Vec3} from 'cc';
import type {OrbitalHost} from './ui-types';
import type {OrbitalItem,OrderDef,PageId,RecipeDef} from './types';
import {getDef,getOrder,materials,recipes,orderDefs,orderEarliest} from './data';
import {canPlace,estimate,findItem,itemValue} from './model';

const C={text:'#E4EBE7',muted:'#AAB6BD',cyan:'#6EE0DE',orange:'#DB8A52',purple:'#9A81CC',line:'#456270',panel:'#101D2BEA',deep:'#0B141EEB',red:'#E38B77'};
const statusText={available:'可接取',active:'进行中',done:'已交付',failed:'已过期'};

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
  constructor(private readonly h:OrbitalHost){input.on(Input.EventType.KEY_DOWN,this.key,this);}
  setPage(page:PageId):void{this.page=page;if(page!=='warehouse')this.scanner=null;}
  draw(page:PageId,parent:Node):void {
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
  dispose():void {input.off(Input.EventType.KEY_DOWN,this.key,this);}
  closeModal():boolean {
    if(!this.modal?.isValid)return false;
    this.modal.removeFromParent();this.modal.destroy();this.modal=null;return true;
  }
  private key(e:EventKeyboard):void {
    if(this.h.busy||this.modal?.isValid)return;
    if(this.page==='warehouse'&&e.keyCode===KeyCode.KEY_R){
      const item=this.item();if(item?.location==='warehouse')this.h.dispatch({type:'MOVE',uid:item.uid,x:item.x,y:item.y,rotated:!item.rotated});
    }
  }
  private text(p:Node,t:string,x:number,y:number,w:number,h:number,size=20,color=C.text,align:'left'|'center'|'right'='left'):Node {
    return this.h.ui.label(p,t,x,y,w,h,{size:size*(this.h.prefs.largeText?1.08:1),color,align});
  }
  private box(p:Node,x:number,y:number,w:number,h:number,accent=C.line,fill=C.panel,name='workspace-panel'):Node {
    return this.h.ui.panel(p,x,y,w,h,{stroke:accent,fill,radius:7,lineWidth:1.3,name});
  }
  private line(p:Node,x:number,y:number,w:number,color=C.line):void {this.h.ui.line(p,x,y,x+w,y,color,1);}
  private item():OrbitalItem|undefined {return findItem(this.h.state,this.h.selected)||this.h.state.inventory[0];}
  private ownership(item:OrbitalItem):string {return item.owner==='customer'?'顾客委修 · 归属锁定':item.owner==='pawn'?'抵押保管 · 禁止出售':'店铺自有';}
  private dims(item:OrbitalItem):[number,number] {const s=getDef(item.defId).size;return item.rotated?[s[1],s[0]]:[s[0],s[1]];}
  private effect(kind:string,at:{x:number;y:number;width?:number;height?:number}):void {if(this.parent?.isValid)this.h.effect(kind,this.parent,at);}
  private button(p:Node,t:string,x:number,y:number,w:number,h:number,fn:()=>void,tone:'gold'|'green'|'danger'|'quiet'='quiet',disabled=false):Node {
    return this.h.button(p,t,x,y,w,h,fn,{tone,disabled,size:19});
  }
  private title(p:Node,kicker:string,title:string,x=40,w=1000):void {
    this.text(p,kicker,x,130,w,22,14,C.cyan);this.text(p,title,x,157,w,40,27);
  }
  private inventoryList(p:Node,x:number,y:number,w:number,h:number,repairOnly=false):void {
    const all=this.h.state.inventory.filter(it=>!repairOnly||it.location!=='pawn');
    const count=Math.max(1,Math.floor(h/83));
    this.inventoryOffset=Math.min(this.inventoryOffset,Math.max(0,all.length-count));
    all.slice(this.inventoryOffset,this.inventoryOffset+count).forEach((it,i)=>{
      const yy=y+i*83,selected=it.uid===this.h.selected;
      const card=this.h.button(p,'',x,yy,w,75,()=>this.h.select(it.uid),{tone:'quiet',selected,name:`select-${it.uid}`});
      this.h.ui.object(card,it.defId,5,3,69,65,{repaired:it.repaired,damaged:!it.working});
      this.text(card,getDef(it.defId).name,82,8,w-92,25,18,selected?C.cyan:C.text);
      this.text(card,it.owner==='customer'?'委修件':it.owner==='pawn'?'抵押品':it.repaired?'已修复':!it.working?'待维修':it.location==='display'?'销售架':'仓库存放',82,42,w-92,22,15,it.owner==='shop'?C.muted:C.purple);
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
    this.box(p,30,205,262,482);this.text(p,'原件托盘',47,218,220,30,21,C.cyan);
    this.inventoryList(p,43,260,236,385,true);
    this.box(p,306,205,848,482,C.line,'#102330C9','repair-workspace');
    this.box(p,1170,130,400,640);
    this.text(p,'维修工单 / 原物修复',1190,146,360,31,22,C.orange);
    if(!item){this.text(p,'从仓库选择物件，或到订单页接取委修单。',353,365,750,80,25,C.muted,'center');return;}
    const def=getDef(item.defId),recipe=recipes.find(r=>r.kind==='repair'&&(r.id===def.recipeId||r.itemId===item.defId));
    const progress=s.repairProgress[item.uid]||0;
    this.text(p,`${def.id} · ${def.name}`,326,219,640,35,24);
    this.text(p,this.ownership(item),326,256,655,27,16,item.owner==='shop'?C.muted:C.purple);
    this.h.ui.object(p,item.defId,525,290,382,260,{back:progress>0,opened:progress>0,repaired:item.repaired,damaged:!item.working});
    this.box(p,334,557,790,104,C.line,'#0A1924E8');
    (recipe?.steps||['检查物件','选择兼容配方','复核条件']).forEach((step,i)=>{
      const xx=350+i*260,active=i===progress;
      this.text(p,`${String(i+1).padStart(2,'0')}  ${progress>i?'✓':active?'●':'○'}`,xx,568,235,25,18,progress>i?C.cyan:active?C.orange:C.muted);
      this.text(p,step,xx,603,235,46,18,active?C.text:C.muted);
    });
    this.text(p,def.name,1190,190,360,40,28);
    this.text(p,item.repaired?'维修已完成，保留本件的编号与来源记录。':item.evidence.length?def.defect:'故障尚未确诊。先在鉴定台观察结构并记录读数，再决定维修工序。',1190,241,360,85,19,C.muted);
    this.line(p,1190,335,360);
    this.text(p,'材料与工时 · 最后确认才扣除',1190,348,360,28,18,C.cyan);
    if(recipe){
      Object.entries(recipe.materials).forEach(([id,q],i)=>{
        const material=materials.find(m=>m.id===id);this.text(p,`${material?.name||id}   ${s.materials[id]||0} / ${q}`,1190,390+i*32,360,28,18,(s.materials[id]||0)>=q?C.text:C.red);
      });
      this.text(p,`工时 ${recipe.ap} AP · 自修无额外工费`,1190,487,360,27,17,C.muted);
      const enough=Object.entries(recipe.materials).every(([id,q])=>(s.materials[id]||0)>=q);
      this.button(p,item.repaired?'本件已修复':'确认维修并复测',1190,533,360,48,()=>{
        this.h.dispatch({type:'REPAIR',uid:item.uid,recipeId:recipe.id});if(findItem(this.h.state,item.uid)?.repaired)this.effect('repair',{x:526,y:280,width:390,height:275});
      },'gold',progress<3||item.repaired||!enough||s.ap<recipe.ap);
      if(!item.repaired&&progress===0){
        this.button(p,'拆开检修盖',596,394,238,60,()=>this.repairStep(item,0),'gold');
        this.text(p,'① 先观察接缝，再取下外壳',415,514,625,29,18,C.orange,'center');
      }else if(!item.repaired&&progress===1)this.replacementInteraction(p,item,recipe);
      else if(!item.repaired&&progress===2)recipe.id==='REC-002'||recipe.id==='REC-005'?this.calibrationInteraction(p,item,recipe):this.weldInteraction(p,item);
      else if(item.repaired){
        this.text(p,'修复标记已写回原物',500,501,465,30,20,C.cyan,'center');
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
    this.text(p,'物件归属、真伪与来源不会因维修自动改变',1190,722,360,33,15,C.muted);
    this.materialShelf(p,30,701,1124);
  }
  private repairStep(item:OrbitalItem,stage:number):void {
    const before=this.h.state.repairProgress[item.uid]||0;
    this.h.dispatch({type:'REPAIR_STEP',uid:item.uid,stage});
    if((this.h.state.repairProgress[item.uid]||0)>before)this.effect(stage===2?'pulse':'repair',{x:525,y:280,width:390,height:280});
  }
  private replacementInteraction(p:Node,item:OrbitalItem,recipe:RecipeDef):void {
    this.box(p,355,306,144,206,C.line,'#122333F0');this.text(p,'替换件托盘',365,318,124,28,17,C.muted,'center');
    const slot=this.box(p,878,360,126,114,C.cyan,'#193C4529','repair-part-slot');
    this.text(slot,'兼容插槽',10,75,106,27,16,C.cyan,'center');
    const sg=slot.addComponent<Graphics>(Graphics);sg.lineWidth=2;sg.strokeColor=new Color(C.cyan);sg.roundRect(28,-59,70,43,6);sg.stroke();
    const part=this.box(p,370,380,112,106,C.orange,'#182D3CF0','replacement-coil');
    const materialId=Object.keys(recipe.materials).find(id=>id!=='MAT-004')||'MAT-003';
    this.h.ui.materialIcon(part,materialId,19,10,74,62);
    this.text(part,'拖入插槽',5,77,102,25,15,C.orange,'center');
    let start=part.position.clone(),moving=false;
    part.on(Node.EventType.TOUCH_START,()=>{if(this.h.busy)return;start=part.position.clone();moving=true;part.setSiblingIndex(p.children.length-1);});
    part.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{if(!moving)return;const d=e.getUIDelta();part.setPosition(part.position.x+d.x,part.position.y+d.y);});
    part.on(Node.EventType.TOUCH_END,(e:EventTouch)=>{if(!moving)return;moving=false;part.setPosition(start);if(slot.getComponent<UITransform>(UITransform)?.hitTest(e.getLocation()))this.repairStep(item,1);else this.h.ui.toast('接口没有对齐，请把替换件拖进右侧青色插槽。');});
    part.on(Node.EventType.TOUCH_CANCEL,()=>{moving=false;part.setPosition(start);});
    this.text(p,'② 拖动兼容零件，插入青色轮廓槽',424,514,622,29,18,C.orange,'center');
    this.button(p,'辅助装入',1010,480,117,37,()=>this.repairStep(item,1),'quiet');
  }
  private weldInteraction(p:Node,item:OrbitalItem):void {
    const layer=this.h.ui.container(p,400,325,690,180,'weld-track');
    const ink=layer.addComponent<Graphics>(Graphics);
    ink.strokeColor=new Color('#DB8A5260');ink.lineWidth=4;ink.moveTo(90,-117);ink.bezierCurveTo(235,-160,330,-15,535,-57);ink.stroke();
    const a=this.box(layer,53,86,76,64,C.orange,'#152D3DF0','weld-start');
    const b=this.box(layer,502,24,76,64,C.cyan,'#152D3DF0','weld-end');
    this.text(a,'供电',0,16,76,32,17,C.orange,'center');this.text(b,'负载',0,16,76,32,17,C.cyan,'center');
    const wire=this.h.ui.container(layer,0,0,690,180,'active-wire').addComponent<Graphics>(Graphics);
    let began=false,travel=0;
    layer.on(Node.EventType.TOUCH_START,(e:EventTouch)=>{began=!!a.getComponent<UITransform>(UITransform)?.hitTest(e.getLocation());travel=0;});
    layer.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{
      if(!began||this.h.busy)return;const d=e.getUIDelta();travel+=Math.abs(d.x)+Math.abs(d.y);
      wire.clear();wire.strokeColor=new Color(C.orange);wire.lineWidth=5;
      const progress=Math.min(1,travel/450);wire.moveTo(90,-117);wire.lineTo(90+445*progress,-117+60*progress);wire.stroke();
      wire.fillColor=new Color('#FFE3A8');wire.circle(90+445*progress,-117+60*progress,6);wire.fill();
    });
    layer.on(Node.EventType.TOUCH_END,(e:EventTouch)=>{if(!began)return;began=false;wire.clear();if(travel>170&&b.getComponent<UITransform>(UITransform)?.hitTest(e.getLocation()))this.repairStep(item,2);else this.h.ui.toast('回路尚未闭合，从橙色供电端拖到青色负载端。');});
    layer.on(Node.EventType.TOUCH_CANCEL,()=>{began=false;wire.clear();});
    this.text(p,'③ 从橙色端拉线至青色端，完成焊接与负载校准',370,514,735,29,18,C.orange,'center');
    this.button(p,'辅助闭合回路',936,480,190,37,()=>this.repairStep(item,2),'quiet');
  }
  private coil(g:Graphics,x:number,y:number,r:number):void {
    g.lineWidth=5;for(let i=0;i<5;i++){g.strokeColor=new Color(i%2?C.orange:'#F1C084');g.ellipse(x-r+i*5,-y,r*.44,r);g.stroke();}
    g.lineWidth=3;g.strokeColor=new Color('#6EE0DE');g.moveTo(x-r,-y);g.lineTo(x-r-12,-y-21);g.stroke();
  }
  private calibrationInteraction(p:Node,item:OrbitalItem,recipe:RecipeDef):void {
    const optical=recipe.id==='REC-002';
    const instrument=this.box(p,825,292,280,183,C.cyan,'#0D2432F0','calibration-instrument');
    const g=instrument.addComponent<Graphics>(Graphics);let offset=optical?30:40;
    const readout=this.text(instrument,optical?'三色标靶对齐':'配重置于误差圈',8,149,264,25,15,C.orange,'center').getComponent<Label>(Label)!;
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
    this.button(p,'← 微调',830,483,104,36,()=>{offset=Math.max(-60,offset-10);paint();},'quiet');
    this.button(p,'微调 →',945,483,104,36,()=>{offset=Math.min(60,offset+10);paint();},'quiet');
    this.button(p,'记录校准',534,476,209,41,()=>Math.abs(offset)<5?this.repairStep(item,2):this.h.ui.toast(optical?'三色轮廓尚未重合，继续逐格微调。':'配重仍偏离中心误差圈，继续调整位置。'),'gold');
    this.text(p,optical?'③ 移动光学标靶，让三色轮廓重合':'③ 微调配重，将橙色砝码置于中心误差圈',370,522,735,27,18,C.orange,'center');
  }
  private materialShelf(p:Node,x:number,y:number,w:number):void {
    this.box(p,x,y,w,70,C.line,'#0D1B28F0');
    materials.forEach((m,i)=>{
      const width=w/6,xx=x+i*width;
      this.h.ui.materialIcon(p,m.id,xx+7,y+4,31,29);
      this.text(p,`${m.name} ×${this.h.state.materials[m.id]||0}`,xx+43,y+7,width-50,25,15,C.text);
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
    this.modal?.removeFromParent();this.modal?.destroy();
    const m=this.h.ui.modal('组装舱门维护套组',{width:1170,height:690,onClose:()=>{this.modal=null;}});this.modal=m.overlay;
    const p=m.body;
    this.text(p,'主料先对齐插槽，再闭合端子；最后确认时统一消耗原件、材料与2 AP。',15,1,1070,45,20,C.muted);
    const slots=[this.box(p,401,94,178,153,C.cyan,'#17303DE0','craft-servo-slot'),this.box(p,670,94,178,153,C.cyan,'#17303DE0','craft-bearing-slot')];
    this.text(slots[0],'伺服器槽',8,115,162,28,17,C.cyan,'center');this.text(slots[1],'注销轴承槽',8,115,162,28,17,C.cyan,'center');
    this.h.ui.line(p,579,160,670,160,C.line,4);
    const labels=['拖入伺服器','拖入注销轴承','连接端子 / 验证限位'];
    const progressLabel=this.text(p,'',15,365,1060,43,23,C.cyan,'center');
    const readyLabel=this.text(p,'',15,415,1060,53,19,C.muted,'center');
    const close=()=>{m.overlay.removeFromParent();m.overlay.destroy();this.modal=null;};
    const confirm=this.button(p,'确认组装并消耗主料',590,502,478,54,()=>{
      if((this.h.state.repairProgress[servo.uid]||0)!==3){this.h.ui.toast('先将两件主料放入插槽并连通端子。');return;}
      close();this.h.dispatch({type:'CRAFT',recipeId:recipe.id});if(!findItem(this.h.state,servo.uid))this.effect('repair',{x:530,y:300,width:380,height:280});
    },'gold');
    this.button(p,'撤回预览',15,502,478,54,close,'quiet');
    const wire=this.h.ui.container(p,385,244,480,98,'craft-terminal-wire').addComponent<Graphics>(Graphics);
    const start=this.box(p,425,267,104,54,C.orange,'#122B3C','craft-positive');this.text(start,'供电端',0,15,104,29,17,C.orange,'center');
    const end=this.box(p,728,267,104,54,C.cyan,'#122B3C','craft-limit');this.text(end,'限位端',0,15,104,29,17,C.cyan,'center');
    let dragging=false,travel=0;
    const terminal=this.h.ui.container(p,400,254,460,84,'craft-terminal-track');
    const refresh=()=>{
      const step=this.h.state.repairProgress[servo.uid]||0;
      progressLabel.getComponent<Label>(Label)!.string=step===3?'✓ 两主料已就位，双向限位验证通过':`步骤 ${step+1}/3 · ${labels[Math.min(2,step)]}`;
      readyLabel.getComponent<Label>(Label)!.string=Object.entries(recipe.materials).map(([id,q])=>`${materials.find(x=>x.id===id)?.name||id} ${this.h.state.materials[id]||0}/${q}`).join('  ·  ')+'  ·  2 AP';
      const affordable=this.h.state.ap>=recipe.ap&&Object.entries(recipe.materials).every(([id,q])=>(this.h.state.materials[id]||0)>=q);
      this.h.ui.setButtonEnabled(confirm,step===3&&affordable);
      wire.clear();if(step>=3){wire.lineWidth=4;wire.strokeColor=new Color(C.cyan);wire.moveTo(92,-51);wire.lineTo(395,-51);wire.stroke();}
    };
    const advance=(stage:number)=>{this.h.dispatch({type:'REPAIR_STEP',uid:servo.uid,stage});refresh();};
    const stageParts=[servo,bearing];
    stageParts.forEach((it,index)=>{
      const completed=(this.h.state.repairProgress[servo.uid]||0)>index;
      const part=this.box(p,completed?401+index*269:15+index*181,completed?94:94,completed?178:167,153,C.orange,'#152D3CF0',`craft-input-${index}`);
      this.h.ui.object(part,it.defId,15,10,137,104,{repaired:it.repaired});this.text(part,index===0?'伺服器':'磁悬轴承',8,116,151,27,17,C.text,'center');
      let origin=part.position.clone(),moving=false;
      part.on(Node.EventType.TOUCH_START,()=>{if(this.h.busy||(this.h.state.repairProgress[servo.uid]||0)!==index)return;origin=part.position.clone();moving=true;part.setSiblingIndex(p.children.length-1);});
      part.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{if(!moving)return;const d=e.getUIDelta();part.setPosition(part.position.x+d.x,part.position.y+d.y);});
      part.on(Node.EventType.TOUCH_END,(e:EventTouch)=>{
        if(!moving)return;moving=false;
        if(slots[index].getComponent<UITransform>(UITransform)?.hitTest(e.getLocation())){part.setPosition(401+index*269,-94);advance(index);}
        else {part.setPosition(origin);this.h.ui.toast('把主料放入同轮廓插槽，匹配后再连接端子。');}
      });
      part.on(Node.EventType.TOUCH_CANCEL,()=>{moving=false;part.setPosition(origin);});
    });
    terminal.on(Node.EventType.TOUCH_START,(e:EventTouch)=>{dragging=(this.h.state.repairProgress[servo.uid]||0)===2&&!!start.getComponent<UITransform>(UITransform)?.hitTest(e.getLocation());travel=0;});
    terminal.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{
      if(!dragging)return;const d=e.getUIDelta();travel+=Math.abs(d.x)+Math.abs(d.y);const t=Math.min(1,travel/300);
      wire.clear();wire.strokeColor=new Color(C.orange);wire.lineWidth=4;wire.moveTo(92,-51);wire.lineTo(92+303*t,-51);wire.stroke();
    });
    terminal.on(Node.EventType.TOUCH_END,(e:EventTouch)=>{if(!dragging)return;dragging=false;if(travel>130&&end.getComponent<UITransform>(UITransform)?.hitTest(e.getLocation()))advance(2);else{refresh();this.h.ui.toast('从供电端连接到限位端，完成双向回路。');}});
    this.button(p,'辅助连接端子',851,268,218,51,()=>{if((this.h.state.repairProgress[servo.uid]||0)===2)advance(2);else this.h.ui.toast('先将两件主料拖入插槽。');},'quiet');
    refresh();
  }

  private warehouse(p:Node):void {
    const s=this.h.state,item=this.item();
    this.title(p,'WAREHOUSE / SCN-003','仓储与安检',40,1010);
    this.box(p,30,205,720,404,C.line,'#0A1923DA');
    this.text(p,`后仓 10 × 6  ·  ${s.inventory.filter(i=>i.location==='warehouse').length} 件在库`,45,205,680,32,18,C.cyan);
    const gx=47,gy=249,cw=68,ch=55;
    const cells:{node:Node;x:number;y:number}[]=[];
    for(let y=0;y<6;y++)for(let x=0;x<10;x++){
      const cell=this.box(p,gx+x*cw,gy+y*ch,cw-4,ch-4,'#3C596A','#11263680',`warehouse-cell-${x}-${y}`);
      this.text(cell,`${x+1}:${y+1}`,4,3,50,15,10,'#78919C');cells.push({node:cell,x,y});
    }
    const preview=this.h.ui.container(p,gx,gy,cw*10,ch*6,'warehouse-preview').addComponent<Graphics>(Graphics);
    s.inventory.filter(it=>it.location==='warehouse').forEach(it=>{
      const [iw,ih]=this.dims(it),xx=gx+it.x*cw,yy=gy+it.y*ch;
      const node=this.box(p,xx,yy,iw*cw-4,ih*ch-4,it.uid===this.h.selected?C.cyan:'#68818A','#102F3CEB',`warehouse-item-${it.uid}`);
      this.h.ui.object(node,it.defId,4,3,iw*cw-12,ih*ch-13,{repaired:it.repaired,damaged:!it.working});
      this.text(node,it.sourceVerified?'✓':it.owner==='customer'?'委':'?',4,4,30,22,15,it.sourceVerified?C.cyan:C.orange);
      let start=new Vec3(),distance=0,drag=false;
      const target=(e:EventTouch)=>cells.find(c=>!!c.node.getComponent<UITransform>(UITransform)?.hitTest(e.getLocation()));
      node.on(Node.EventType.TOUCH_START,()=>{if(this.h.busy)return;drag=true;distance=0;start=node.position.clone();this.h.selected=it.uid;node.setSiblingIndex(p.children.length-1);});
      node.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{
        if(!drag||this.h.busy)return;const d=e.getUIDelta();distance+=Math.abs(d.x)+Math.abs(d.y);node.setPosition(node.position.x+d.x,node.position.y+d.y);
        const cell=target(e);preview.clear();if(!cell)return;
        const valid=canPlace(s,it.uid,cell.x,cell.y,it.rotated);preview.fillColor=new Color(valid?'#6EE0DE44':'#E38B7755');preview.rect(cell.x*cw,-cell.y*ch-ih*ch,iw*cw-3,ih*ch-3);preview.fill();
        if(!valid){preview.strokeColor=new Color(C.red);preview.lineWidth=2;for(let k=0;k<iw*cw;k+=14){preview.moveTo(cell.x*cw+k,-cell.y*ch);preview.lineTo(cell.x*cw+Math.min(iw*cw,k+ih*ch),-cell.y*ch-ih*ch);preview.stroke();}}
      });
      node.on(Node.EventType.TOUCH_END,(e:EventTouch)=>{
        if(!drag)return;drag=false;node.setPosition(start);preview.clear();
        const cell=target(e);if(distance>8&&cell){this.h.dispatch({type:'MOVE',uid:it.uid,x:cell.x,y:cell.y,rotated:it.rotated});}
        else this.h.select(it.uid);
      });
      node.on(Node.EventType.TOUCH_CANCEL,()=>{drag=false;node.setPosition(start);preview.clear();});
    });
    this.text(p,'拖动实物入格 · R 旋转 · 红色斜纹表示重叠或越界',44,588,690,22,15,C.muted);
    this.box(p,30,622,720,149,C.line,'#0B1A27F0');
    this.text(p,'销售陈列架 8 × 3',45,629,690,25,18,C.orange);
    const sale=s.inventory.filter(it=>it.location==='display');
    for(let i=0;i<24;i++){
      const xx=46+(i%8)*86,yy=660+Math.floor(i/8)*35,it=sale[i];
      const cell=this.box(p,xx,yy,81,31,it?.uid===this.h.selected?C.cyan:'#334C5C','#18313A80',`display-slot-${i}`);
      if(it){this.h.ui.object(cell,it.defId,2,1,34,28,{repaired:it.repaired});this.text(cell,`${it.listPrice}`,37,5,40,20,13,C.text);cell.on(Node.EventType.TOUCH_END,()=>!this.h.busy&&this.h.select(it.uid));}
    }
    this.box(p,766,205,318,566,C.line,'#0D1E2DD9');
    this.text(p,'入库扫描区',784,219,280,34,25,C.cyan);
    const scanner=this.box(p,785,269,279,292,C.cyan,'#152C3B90','warehouse-scanner');
    if(item)this.h.ui.object(scanner,item.defId,28,38,225,211,{repaired:item.repaired,damaged:!item.working});
    for(let y=20;y<280;y+=30){this.h.ui.line(scanner,8,y,20,y,'#77C3C577',2);this.h.ui.line(scanner,258,y,270,y,'#77C3C577',2);}
    this.scanner=this.h.ui.container(scanner,0,0,279,292,'scanner-light').addComponent<Graphics>(Graphics);
    this.button(p,'扫描当前物件',785,577,279,45,()=>{if(!item)return;this.h.dispatch({type:'SCAN',uid:item.uid});this.scanUntil=this.clock+1.5;this.effect('scan',{x:800,y:285,width:245,height:250});},'green',!item);
    const scanStatus=item&&s.scanned.includes(item.uid)?'扫描完成 · 可比对来源证据':'未扫描 · 放入货物后启动';
    this.text(p,scanStatus,785,635,279,28,17,C.muted,'center');
    const warn=s.inspection==='pending'?'饶静已到站 · 请处理待核货物':s.inspection==='cleared'?'本次检查已完成 · 回执归档':'预告：第3天进行预约核验';
    this.text(p,warn,785,684,279,66,18,s.inspection==='pending'?C.orange:C.purple,'center');
    this.box(p,1100,130,470,640,C.line,'#101E2DF2');
    this.text(p,'来源与处置',1120,146,425,33,24,C.text);
    if(!item){this.text(p,'点选仓格中的实物',1120,245,425,60,23,C.muted,'center');return;}
    const def=getDef(item.defId),a=estimate(item);
    this.text(p,def.name,1120,196,425,39,29);
    this.text(p,`${this.ownership(item)} · ${def.size[0]}×${def.size[1]} 格`,1120,242,425,28,17,C.purple);
    this.text(p,`估值 ${a.low}–${a.high} Cr`,1120,284,425,33,24,C.orange);
    this.text(p,`来源：${item.source}`,1120,329,425,52,18,C.muted);
    this.text(p,`独立物证 ${item.evidence.length} 项  /  ${item.sourceVerified?'来源已登记':'来源未登记'}`,1120,388,425,29,18,item.sourceVerified?C.cyan:C.orange);
    this.text(p,`${item.sealed?'封签完好':'未封签'} · ${item.repaired?'已修复':item.working?'功能待复核':'功能故障'} · ${item.location==='isolation'?'隔离存放':item.location==='pawn'?'抵押保管':item.location==='display'?'销售架':'普通仓库'}`,1120,431,425,55,18,C.muted);
    const buyer=s.trade?.kind==='sell'&&!s.trade.locked;
    this.button(p,buyer?'推荐给当前顾客':item.location==='display'?'撤回普通仓库':'放上销售架',1120,506,205,44,()=>this.h.dispatch(buyer?{type:'SELECT_TRADE',uid:item.uid}:{type:'DISPLAY',uid:item.uid}),'gold',item.owner!=='shop'||!!buyer&&(!item.sourceVerified||item.location==='isolation'||item.sealed||!!item.orderId));
    this.button(p,'旋转 90°',1340,506,205,44,()=>this.h.dispatch({type:'MOVE',uid:item.uid,x:item.x,y:item.y,rotated:!item.rotated}),'quiet',item.location!=='warehouse');
    this.button(p,'登记并封签',1120,565,205,44,()=>{this.h.dispatch({type:'REGISTER',uid:item.uid});if(findItem(this.h.state,item.uid)?.sourceVerified)this.effect('stamp',{x:1300,y:405});},'green',item.sourceVerified);
    this.button(p,item.location==='isolation'?'移出隔离柜':'隔离待核验',1340,565,205,44,()=>this.h.dispatch({type:'ISOLATE',uid:item.uid}),'quiet');
    this.button(p,'到鉴定台补证',1120,624,205,44,()=>this.h.navigate('inspect',item.uid),'green');
    const relief=s.ledger.some(e=>e.kind==='relief-window'&&e.day===s.day),eligible=relief&&item.owner==='shop'&&!item.orderId&&!item.sealed&&item.sourceVerified&&item.evidence.length>=2&&item.location!=='isolation';
    this.button(p,eligible?'应急清仓…':item.owner==='pawn'?'赎回原物':'退回来源方…',1340,624,205,44,()=>{
      if(eligible)this.confirmDialog('应急清仓',`${def.name} 按估值55%回收，获得 ${Math.floor(itemValue(item)*.55)} Cr，不消耗 AP。\n确认后原物移交，款项与出库同时保存。`,()=>this.h.dispatch({type:'EMERGENCY_SALE',uid:item.uid}));
      else if(item.owner==='pawn')this.h.dispatch({type:'REDEEM',uid:item.uid});
      else this.confirmDialog('退回来源方',`退还 ${def.name} 并移出当前库存。\n已支付采购款不自动返还；本操作不会伪造来源证据。`,()=>this.h.dispatch({type:'RETURN_ITEM',uid:item.uid}));
    },'danger');
    this.text(p,eligible?`应急回收 ${Math.floor(itemValue(item)*.55)} Cr · 55%估值 / 0 AP`:'登记需：扫描 + 2项独立证据 + 35 Cr / 1 AP',1120,471,425,24,15,eligible?C.orange:C.muted);
    this.button(p,'隔离柜 4 × 3',1120,678,204,25,()=>{this.cabinet='isolation';this.h.render();},this.cabinet==='isolation'?'green':'quiet',false);
    this.button(p,'抵押柜 4 × 4',1340,678,205,25,()=>{this.cabinet='pawn';this.h.render();},this.cabinet==='pawn'?'green':'quiet',false);
    const isolated=s.inventory.filter(it=>it.location===this.cabinet);
    for(let i=0;i<(this.cabinet==='pawn'?16:12);i++){
      const xx=1120+(i%4)*105,yy=708+Math.floor(i/4)*17,it=isolated[i];
      const cell=this.box(p,xx,yy,97,15,it?C.purple:'#3C4B64',it?'#62517AA0':'#142333',`${this.cabinet}-slot-${i}`);
      if(it){this.h.ui.object(cell,it.defId,2,0,27,18,{repaired:it.repaired});this.text(cell,it.owner==='pawn'?'抵押':'隔离',33,1,60,16,11,C.text);cell.on(Node.EventType.TOUCH_END,()=>!this.h.busy&&this.h.select(it.uid));}
      else this.text(cell,String(i+1).padStart(2,'0'),8,1,79,16,10,'#6A7F92','center');
    }
  }
  private orders(p:Node):void {
    const s=this.h.state;
    if(!orderDefs.some(o=>o.id===this.orderId))this.orderId=orderDefs[0]?.id||'';
    const order=getOrder(this.orderId),os=s.orders.find(o=>o.id===order.id),status=os?.status||'available';
    this.title(p,'ORDERS / 今日公告与委修','订单与委托',40,850);
    orderDefs.forEach((o,i)=>{
      const x=40+(i%3)*289,y=211+Math.floor(i/3)*135,st=s.orders.find(v=>v.id===o.id)?.status||'available',locked=(orderEarliest[o.id]||1)>s.day;
      const card=this.h.button(p,'',x,y,274,122,()=>{this.orderId=o.id;this.stagedUid='';this.h.render();},{tone:'quiet',selected:o.id===this.orderId,name:`order-${o.id}`});
      this.h.ui.object(card,o.itemId,9,12,78,77,{damaged:o.needsRepair});
      this.text(card,o.name,93,10,173,43,18,o.id===this.orderId?C.cyan:C.text);
      this.text(card,`${o.reward} Cr · D${o.dueDay}到期`,93,60,173,24,15,C.orange);
      this.text(card,locked?`第${orderEarliest[o.id]}天开放`:statusText[st],93,92,173,22,14,st==='done'?C.cyan:locked?C.muted:C.purple);
    });
    this.box(p,928,130,642,640,C.line,'#101E2DF2');
    this.text(p,'订单详情 / 交付预览',948,145,602,29,21,C.cyan);
    this.text(p,order.name,948,189,602,42,29);
    this.text(p,`${order.id}  ·  ${order.customerOwned?'顾客提供原物 · 不占采购现金':'自有货物交付'}  ·  ${order.reward} Cr`,948,240,602,30,17,C.purple);
    this.text(p,order.description,948,284,602,92,18,C.muted);
    this.line(p,948,389,602);
    this.text(p,`要求：${getDef(order.itemId).name}  ·  品相≥${Math.round(order.minCondition*100)}%${order.needsRepair?'  ·  已修复':''}`,948,403,602,36,18);
    const earliest=orderEarliest[order.id]||1,available=status==='available'&&s.day>=earliest;
    if(status==='available'){
      this.button(p,available?'接取订单':`第${earliest}天开放`,948,465,602,54,()=>this.h.dispatch({type:'TAKE_ORDER',id:order.id}),'gold',!available);
      this.text(p,'接取后保留原物归属、材料要求与到期日；确认交付前不会移走库存。',948,546,602,82,19,C.muted);
      this.h.ui.object(p,order.itemId,1105,625,220,120,{damaged:order.needsRepair});
      return;
    }
    if(status==='done'||status==='failed'){
      this.text(p,status==='done'?'已交付 · 凭证归档':'订单已过期',973,486,552,65,34,status==='done'?C.cyan:C.red,'center');
      this.text(p,status==='done'?'报酬、物件与关系已在同一次交付中记录。':'物件不会因订单过期自动消失，可到仓库继续处理。',968,580,560,75,20,C.muted,'center');return;
    }
    const candidates=s.inventory.filter(it=>it.defId===order.itemId);
    const staged=s.inventory.find(it=>it.uid===this.stagedUid);
    this.text(p,'原件与合格库存 · 点击或拖入交付盘',948,452,602,30,18,C.cyan);
    const tray=this.box(p,1080,553,350,111,C.orange,'#233541A0','order-delivery-tray');
    this.text(tray,'交付盘 · 确认前可撤回',10,76,330,29,17,C.orange,'center');
    candidates.slice(0,5).forEach((it,i)=>{
      const x=948+i*119,y=492;
      const card=this.box(p,x,y,109,54,it.uid===this.stagedUid?C.cyan:C.line,'#162F3D',`order-candidate-${it.uid}`);
      this.h.ui.object(card,it.defId,3,2,65,49,{repaired:it.repaired,damaged:!it.working});this.text(card,it.repaired?'修':'原',74,17,27,26,15,it.repaired?C.cyan:C.muted);
      let start=new Vec3(),travel=0;
      card.on(Node.EventType.TOUCH_START,()=>{if(this.h.busy)return;start=card.position.clone();travel=0;card.setSiblingIndex(p.children.length-1);});
      card.on(Node.EventType.TOUCH_MOVE,(e:EventTouch)=>{if(this.h.busy)return;const d=e.getUIDelta();travel+=Math.abs(d.x)+Math.abs(d.y);card.setPosition(card.position.x+d.x,card.position.y+d.y);});
      card.on(Node.EventType.TOUCH_END,(e:EventTouch)=>{card.setPosition(start);if(travel<8||tray.getComponent<UITransform>(UITransform)?.hitTest(e.getLocation())){this.stagedUid=it.uid;this.h.render();}else this.h.ui.toast('把原物拖入橙色交付盘，或点选原物预览。');});
      card.on(Node.EventType.TOUCH_CANCEL,()=>card.setPosition(start));
    });
    if(!candidates.length)this.text(p,'仓库暂无相同型号，先取得原物或接收委修件。',948,494,602,45,18,C.muted);
    if(staged){
      this.h.ui.object(tray,staged.defId,109,6,132,69,{repaired:staged.repaired});
      const reasons=this.orderReasons(order,staged);
      this.text(p,reasons.length?reasons.join(' · '):'✓ 型号、归属、证据和状态符合要求',948,676,602,31,17,reasons.length?C.orange:C.cyan);
      this.button(p,'确认交付并领取报酬',948,720,427,40,()=>{this.h.dispatch({type:'DELIVER_ORDER',id:order.id,uid:staged.uid});this.stagedUid='';if(this.h.state.orders.find(o=>o.id===order.id)?.status==='done')this.effect('stamp',{x:1300,y:450});},'gold',reasons.length>0);
      this.button(p,'撤回',1390,720,160,40,()=>{this.stagedUid='';this.h.render();},'quiet');
    }else{
      this.text(p,'选中原物后会显示具体合格项与缺项。',948,677,602,31,17,C.muted);
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
    this.box(p,30,205,920,566,C.line,'#0D1C29F0');
    const today=s.ledger.filter(x=>x.day===s.day),income=r?.income??today.filter(x=>x.amount>0).reduce((a,b)=>a+b.amount,0),expenses=r?.expenses??-today.filter(x=>x.amount<0).reduce((a,b)=>a+b.amount,0),maintenance=r?.maintenance??20,rent=r?.rent??(s.day%7===0?Math.round(450*Math.pow(1.1,Math.floor((s.day-1)/7))):0);
    this.text(p,'现金流与固定费用',53,223,870,39,26);
    this.text(p,`当前现金 ${s.cash.toLocaleString()} Cr`,53,273,870,37,28,C.cyan);
    const values=[{name:'营业流入',value:income,color:C.cyan},{name:'采购与支出',value:expenses,color:C.orange},{name:'能源维护',value:maintenance,color:'#AC987C'},{name:'本日租金',value:rent,color:C.purple}];
    const max=Math.max(80,...values.map(v=>v.value));
    this.h.ui.line(p,65,559,908,559,C.line,2);
    values.forEach((v,i)=>{
      const x=92+i*207,h=Math.max(3,v.value/max*200);
      this.h.ui.panel(p,x,552-h,117,h,{fill:v.color,stroke:v.color,lineWidth:0,radius:3});
      this.text(p,`${i===0?'+':'−'}${v.value}`,x-20,515-h,157,31,22,v.color,'center');
      this.text(p,v.name,x-35,580,187,28,19,C.muted,'center');
    });
    const net=today.reduce((n,e)=>n+e.amount,0);
    this.text(p,`今日净现金变化  ${net} Cr`,65,641,840,45,30,net>=0?C.cyan:C.orange,'center');
    this.text(p,s.phase==='open'?'打烊将一次结算本日维护与到期租金，推进前会先保存。':'费用与报告已经保存；不因重复打开账本再次扣款。',65,711,840,42,18,C.muted,'center');
    this.box(p,970,130,600,640,C.line,'#101E2DF2');
    this.text(p,'下一日安排',991,147,558,33,24,C.cyan);
    const forecast=s.day===1?'第2日：维修订单与原件归属':s.day===2?'第3日：预约安检与来源核验':s.day%7===6?'明日到期租金，请预留现金':'查看新订单，继续处理货源与维修';
    this.text(p,forecast,991,196,558,58,23,C.text);
    const relief=s.ledger.some(e=>e.kind==='relief-window'&&e.day===s.day);
    this.text(p,`未完成订单 ${s.orders.filter(x=>x.status==='active').length}  ·  关注度 ${s.risk}/100`,991,262,relief?320:558,28,18,C.muted);
    if(relief)this.button(p,'回仓储处理缺口',1320,258,230,35,()=>this.h.navigate('warehouse'),'gold');
    this.line(p,991,304,558);
    this.text(p,'营业流水',991,319,558,31,21,C.orange);
    today.slice(-4).reverse().forEach((entry,i)=>{
      this.text(p,entry.label,994,362+i*39,384,30,16,C.muted);
      this.text(p,`${entry.amount>=0?'+':''}${entry.amount}`,1380,362+i*39,160,30,18,entry.amount>=0?C.cyan:C.orange,'right');
    });
    if(!today.length)this.text(p,'今日还没有已提交交易。',994,362,548,45,18,C.muted);
    this.text(p,s.day<3?'第3日日结开放首个设备升级':'店铺升级 · 固定二选一',991,527,558,29,21,C.purple);
    const upgraded=!!r?.upgraded;
    const options:[string,'lamp'|'shelf',string][]=[['精密工作灯','lamp','鉴定包免AP'],['模组销售架','shelf','合规挂牌价+5%']];
    options.forEach(([name,id,desc],i)=>{
      const xx=991+i*285,disabled=s.phase!=='report'||s.day<3||upgraded||s.upgrades[id]||s.cash<(id==='lamp'?120:160);
      const card=this.h.button(p,'',xx,570,273,95,()=>{this.h.dispatch({type:'UPGRADE',id});if(this.h.state.upgrades[id])this.effect('stamp',{x:xx+130,y:610});},{tone:'quiet',selected:s.upgrades[id],disabled,name:`upgrade-${id}`});
      this.h.ui.toolIcon(card,id==='lamp'?'TOL-001':'TOL-005',10,12,62,63);
      this.text(card,name,83,13,177,29,19,s.upgrades[id]?C.cyan:C.text);this.text(card,s.upgrades[id]?'已安装':`${id==='lamp'?120:160} Cr · ${desc}`,83,51,177,28,15,C.muted);
    });
    if(s.phase==='open')this.button(p,'确认打烊并结算',991,705,558,48,()=>this.confirmDialog('确认结束本日营业',`本日还剩 ${s.ap} AP。\n能源维护 ${maintenance} Cr，租金 ${rent} Cr。\n未完成订单保留到期日；确认后一次扣款并生成报告。`,()=>this.h.dispatch({type:'SETTLE'})),'gold');
    else if(ended)this.button(p,'重新接手当铺',991,705,558,48,()=>this.confirmDialog('重新开始经营','将为新店建立独立经营进度。建议先导出本轮档案。',()=>this.h.resetGame()),'gold');
    else this.button(p,`迎接第 ${s.day+1} 天`,991,705,558,48,()=>this.h.dispatch({type:'NEXT'}),'gold');
  }
  private settings(p:Node):void {
    this.title(p,'SYSTEM / 操作与档案','暂停与设置');
    this.box(p,30,205,990,566,C.line,'#101E2DF4');
    const settings:[keyof typeof this.h.prefs,string,string][]=[['sound','游戏声音','操作、扫描与成交提示音'],['reducedMotion','减少动态','省略位移与装饰动态，保留状态和必要反馈'],['largeText','放大文字','增大主要说明与按钮文字']];
    settings.forEach(([key,title,desc],i)=>{
      const y=236+i*111;this.box(p,53,y,945,94,C.line,'#182C3BF0');
      this.text(p,title,75,y+11,685,32,24);this.text(p,desc,75,y+54,685,30,17,C.muted);
      this.button(p,this.h.prefs[key]?'开启':'关闭',799,y+23,177,48,()=>{this.h.prefs[key]=!this.h.prefs[key];this.h.savePrefs();this.h.render();},this.h.prefs[key]?'green':'quiet');
    });
    this.button(p,'导出经营档案',53,620,294,57,()=>this.h.exportSave(),'green');
    this.button(p,'重新开始…',365,620,294,57,()=>this.confirmDialog('重新开始经营','这会覆盖当前轨道旧货局进度。\n可先取消并导出经营档案。\n旧版灰线旧货铺存档仍保留在独立键中。',()=>this.h.resetGame()),'danger');
    this.button(p,'返回柜台',677,620,321,57,()=>this.h.navigate('counter'),'gold');
    this.text(p,'浏览、工具瞄准与查看证据不消耗行动点。所有扣款在最后确认时提交。',57,714,933,40,19,C.muted);
    this.box(p,1040,130,530,640,C.line,'#101E2DF2');
    this.text(p,'交互方式',1063,147,484,37,26,C.cyan);
    const guide=[['拿取与搬运','鼠标拖动实物；红色格位表示位置冲突。'],['鉴定与证据','使用不同仪器记录独立物证，同件鉴定包只扣一次 AP。'],['维修与拆解','拆盖、插接、闭合回路后统一确认材料与工时。'],['订单与归属','交付盘先预览；顾客原件与抵押保管物不可当自有货出售。'],['扫描与隔离','来源不明时补证或隔离，登记不等于伪造所有权。']];
    guide.forEach(([title,description],i)=>{
      this.text(p,title,1063,211+i*103,484,29,21,i%2?C.orange:C.cyan);
      this.text(p,description,1063,249+i*103,484,57,18,C.muted);
    });
  }
  private confirmDialog(title:string,body:string,confirm:()=>void):void {
    if(this.h.busy)return;
    this.modal?.removeFromParent();this.modal?.destroy();
    const m=this.h.ui.modal(title,{width:970,height:480,onClose:()=>{this.modal=null;}});this.modal=m.overlay;
    this.text(m.body,body,15,15,876,180,23,C.text);
    const close=()=>{m.overlay.removeFromParent();m.overlay.destroy();this.modal=null;};
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
