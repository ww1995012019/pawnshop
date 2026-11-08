import type {Node} from 'cc';
import type {OrbitalHost} from './ui-types';
import type {OrbitalItem,OrderDef,PageId} from './types';
import {getDef,getOrder,getRecipe,materials,recipes,orderDefs,orderEarliest} from './data';
import {canPlace,estimate,findItem} from './model';
import {ordersForGroup,selectedOrderId,type OrderGroup} from './OrderPresentation';
import {PhoneUI} from './PhoneUI';
import {ORBITAL_PALETTE as C} from './OrbitalUI';

interface PhonePanelRules {
  orderReasons(order:OrderDef,item:OrbitalItem):string[];
  companion():OrbitalItem|undefined;
}

/** Large touch presentations of the same reducer actions used by the desktop workspaces. */
export class PhonePanels {
  private readonly ui:PhoneUI;
  private offset=0;
  private lastUid='';
  private group:OrderGroup='current';
  private order='';
  private orderOffset=0;
  private staged='';
  constructor(private readonly h:OrbitalHost,private readonly rules:PhonePanelRules){this.ui=new PhoneUI(h);}
  draw(page:PageId,p:Node):void {
    if(page==='warehouse')this.warehouse(p);
    if(page==='repair')this.repair(p);
    if(page==='orders')this.orders(p);
    if(page==='report')this.report(p);
    if(page==='settings')this.settings(p);
  }
  private item():OrbitalItem|undefined{return findItem(this.h.state,this.h.selected)||this.h.state.inventory[0];}
  private inventory(p:Node):void {
    const items=this.h.state.inventory,index=items.findIndex(it=>it.uid===this.h.selected);
    if(this.lastUid!==this.h.selected){this.offset=Math.max(0,Math.floor(index/3)*3);this.lastUid=this.h.selected;}
    this.offset=Math.min(this.offset,Math.max(0,Math.floor((items.length-1)/3)*3));
    items.slice(this.offset,this.offset+3).forEach((it,i)=>this.ui.itemCard(p,it,24,132+i*174,464,160,()=>this.h.select(it.uid),it.uid===this.h.selected));
    if(!items.length)this.ui.text(p,'仓库暂无货物。\n接待来客，或接取委修订单。',40,180,420,320,36);
    this.ui.button(p,'上一页',24,654,224,()=>{this.offset=Math.max(0,this.offset-3);this.h.render();},{disabled:this.offset===0,name:'phone-stock-prev'});
    this.ui.button(p,'下一页',264,654,224,()=>{this.offset+=3;this.h.render();},{disabled:this.offset+3>=items.length,name:'phone-stock-next'});
  }
  private summary(p:Node,it:OrbitalItem,detail:string):void {
    const panel=this.ui.panel(p,512,132,1064,250);
    const item=this.h.ui.object(panel,it.defId,724,14,330,220,{repaired:it.repaired,damaged:!it.working});item.name='phone-selected-item';
    this.ui.row(panel,getDef(it.defId).name,24,8,680,72,42);
    this.ui.text(panel,detail,24,90,680,150,30);
  }
  private warehouse(p:Node):void {
    this.inventory(p);const it=this.item();if(!it)return;
    const s=this.h.state,a=estimate(it),inStock=s.inventory.some(i=>i.uid===it.uid);
    if(!inStock){
      this.summary(p,it,`柜台来件 · 尚未成交\n估值 ${a.low}–${a.high} Cr · ${it.evidence.length} 项物证\n完成柜台交割后才会进入库存。`);
      this.ui.button(p,'返回柜台完成交易',512,402,1064,()=>this.h.navigate('counter'),{tone:'gold'});
      this.ui.button(p,'继续鉴定这件实物',512,528,1064,()=>this.h.navigate('inspect',it.uid));return;
    }
    this.summary(p,it,`${it.owner==='customer'?'顾客原物':it.owner==='pawn'?'抵押保管':'店铺自有'} · 估值 ${a.low}–${a.high} Cr\n${it.evidence.length} 项物证 · ${it.sourceVerified?'来源已登记':'来源未登记'}\n${it.location==='warehouse'?`仓位 ${it.x+1}, ${it.y+1}`:it.location==='display'?'销售架':it.location==='pawn'?'抵押柜':'隔离柜'}`);
    const buyer=s.trade?.kind==='sell'&&!s.trade.locked;
    this.ui.button(p,'扫描当前物件',512,402,520,()=>this.h.dispatch({type:'SCAN',uid:it.uid}),{tone:'green',disabled:!inStock});
    this.ui.button(p,buyer?'推荐给当前顾客':it.location==='display'?'撤回普通仓库':'放上销售架',1056,402,520,()=>this.h.dispatch(buyer?{type:'SELECT_TRADE',uid:it.uid}:{type:'DISPLAY',uid:it.uid}),{tone:'gold',disabled:!inStock||it.owner!=='shop'||!!buyer&&(!it.sourceVerified||it.location==='isolation'||it.sealed||!!it.orderId)});
    this.ui.button(p,'登记并封签',512,528,520,()=>this.h.dispatch({type:'REGISTER',uid:it.uid}),{disabled:!inStock||it.sourceVerified,name:'phone-register'});
    this.ui.button(p,it.location==='isolation'?'移出隔离柜':'隔离待核验',1056,528,520,()=>this.h.dispatch({type:'ISOLATE',uid:it.uid}),{disabled:!inStock});
    this.ui.button(p,'移动仓位 / 旋转',512,654,520,()=>this.placement(it),{disabled:it.location!=='warehouse'});
    this.ui.button(p,'货物详情 / 更多',1056,654,520,()=>this.cargoDetails(it),{name:'phone-cargo-details'});
  }
  private cargoDetails(it:OrbitalItem):void {
    const m=this.ui.sheet('货物详情与处置'),s=this.h.state;
    this.ui.text(m.body,`${getDef(it.defId).name} · ${it.source}\n${s.scanned.includes(it.uid)?'已经扫描':'尚未扫描'} · ${it.evidence.length} 项物证\n登记条件：扫描、两项独立物证、35 Cr / 1 AP。`,20,8,1410,190,34);
    const action=(text:string,x:number,y:number,fn:()=>void,disabled=false)=>this.ui.button(m.body,text,x,y,688,()=>{m.close();fn();},{disabled});
    action('到鉴定台补证',20,224,()=>this.h.navigate('inspect',it.uid));
    action('来源与物证记录',736,224,()=>this.evidence(it));
    action('查看隔离柜',20,354,()=>this.ui.choose('隔离柜',s.inventory.filter(i=>i.location==='isolation'),it.uid,i=>this.h.select(i.uid)));
    action('查看抵押柜',736,354,()=>this.ui.choose('抵押柜',s.inventory.filter(i=>i.location==='pawn'),it.uid,i=>this.h.select(i.uid)));
    action(it.owner==='pawn'?'赎回原物':'退回来源方…',20,484,()=>{
      if(it.owner==='pawn'){
        const principal=it.pawnPrincipal||0,fee=Math.round(principal*.08*100)/100;
        this.ui.confirm('顾客赎回原物',`收回本金 ${principal} Cr + 服务费 ${fee} Cr。\n共收款 ${Math.round((principal+fee)*100)/100} Cr。\n将 ${getDef(it.defId).name} 归还顾客，并移出抵押柜。`,()=>this.h.dispatch({type:'REDEEM',uid:it.uid}));
      }
      else this.ui.confirm('退回来源方',`退还 ${getDef(it.defId).name} 并移出库存。已支付采购款不自动返还。`,()=>this.h.dispatch({type:'RETURN_ITEM',uid:it.uid}));
    });
    const relief=s.ledger.some(e=>e.kind==='relief-window'&&e.day===s.day);
    action('应急清仓…',736,484,()=>this.ui.confirm('应急清仓','按估值的 55% 回收这一件实物，不消耗 AP。确认后钱货同时交割。',()=>this.h.dispatch({type:'EMERGENCY_SALE',uid:it.uid})),!relief||it.owner!=='shop'||!!it.orderId||it.sealed||!it.sourceVerified||it.evidence.length<2||it.location==='isolation');
  }
  private evidence(it:OrbitalItem):void {
    const m=this.ui.sheet('来源与物证');
    this.ui.text(m.body,`${it.source}\n\n${it.sourceVerified?'来源已登记':'来源尚未登记'} · ${it.evidence.length} 项独立物证\n${getDef(it.defId).description}`,24,12,1400,460,36);
    this.ui.button(m.body,'前往鉴定台查看记录',24,536,1400,()=>{m.close();this.h.navigate('inspect',it.uid);},{tone:'gold'});
  }
  private placement(it:OrbitalItem):void {
    const m=this.ui.sheet('点选空仓位 · 以左上格定位'),s=this.h.state;let rotated=it.rotated;
    const draw=()=>{
      this.h.ui.clear(m.body);
      for(let y=0;y<6;y++)for(let x=0;x<10;x++){
        const valid=canPlace(s,it.uid,x,y,rotated);
        this.ui.button(m.body,it.x===x&&it.y===y?'当前':'',x*110,y*110,108,()=>{m.close();this.h.dispatch({type:'MOVE',uid:it.uid,x,y,rotated});},{selected:it.x===x&&it.y===y,disabled:!valid,name:`phone-cell-${x}-${y}`});
      }
      this.ui.text(m.body,`${getDef(it.defId).name}\n占格 ${getDef(it.defId).size[rotated?1:0]} × ${getDef(it.defId).size[rotated?0:1]}\n灰色格位放不下，或与其他实物重叠。`,1128,20,300,360,32);
      this.ui.button(m.body,'旋转 90°',1128,424,300,()=>{rotated=!rotated;draw();},{name:'phone-cell-rotate'});
      this.ui.button(m.body,'返回',1128,550,300,()=>m.close());
    };draw();
  }
  private repair(p:Node):void {
    this.inventory(p);const it=this.item();if(!it)return;
    const s=this.h.state,def=getDef(it.defId),recipe=recipes.find(r=>r.kind==='repair'&&(r.id===def.recipeId||r.itemId===it.defId)),progress=s.repairProgress[it.uid]||0;
    const needs=recipe?Object.entries(recipe.materials).map(([id,q])=>`${materials.find(m=>m.id===id)?.name} ${it.repaired?`已用 ×${q}`:`${s.materials[id]||0}/${q}`}`).join(' · '):'当前没有匹配的维修配方';
    this.summary(p,it,`${it.repaired?'已修复':`工序 ${Math.min(3,progress)}/3 · ${recipe?.steps[progress]||'等待最终确认'}`}\n${needs}\n${recipe?`${it.repaired?'工时已结算':'最终确认消耗'} ${recipe.ap} AP`:'可鉴定或拆解店铺自有原物'}`);
    const enough=!!recipe&&Object.entries(recipe.materials).every(([id,q])=>(s.materials[id]||0)>=q);
    this.ui.button(p,it.repaired?'已完成维修':recipe?.steps[progress]||'工序已完成',512,402,520,()=>this.h.dispatch({type:'REPAIR_STEP',uid:it.uid,stage:progress}),{tone:'green',disabled:!recipe||progress>=3||it.repaired,name:'phone-repair-step'});
    this.ui.button(p,'确认维修并复测',1056,402,520,()=>{if(recipe)this.h.dispatch({type:'REPAIR',uid:it.uid,recipeId:recipe.id});},{tone:'gold',disabled:!recipe||it.repaired||progress<3||!enough||s.ap<recipe.ap,name:'phone-repair-confirm'});
    this.ui.button(p,'材料箱 / 采购',512,528,520,()=>this.materials(),{name:'phone-materials'});
    this.ui.button(p,'到鉴定台诊断',1056,528,520,()=>this.h.navigate('inspect',it.uid));
    this.ui.button(p,'拆解回收…',512,654,520,()=>this.ui.confirm('拆解回收',`拆解 ${def.name}，消耗 1 AP。实物将转为材料，无法恢复。`,()=>this.h.dispatch({type:'DISMANTLE',uid:it.uid})),{tone:'danger',disabled:it.owner!=='shop'});
    this.ui.button(p,'组装维护套组…',1056,654,520,()=>this.craft());
  }
  private craft():void {
    const recipe=recipes.find(r=>r.kind==='craft');if(!recipe)return;
    const m=this.ui.sheet('组装舱门维护套组');
    const available=(it:OrbitalItem)=>it.owner==='shop'&&!it.orderId&&it.working&&it.sourceVerified&&!it.sealed&&it.location!=='isolation'&&this.h.state.trade?.selectedUid!==it.uid;
    const servo=this.h.state.inventory.find(it=>it.defId===recipe.itemId&&available(it)),bearing=this.h.state.inventory.find(it=>it.defId==='ITM-027'&&available(it));
    if(!servo||!bearing){this.ui.text(m.body,'需要自有、正常且来源已核验的伺服器和注销轴承。顾客原物、隔离件或已被报价占用的货物不能作为主料。',20,24,1400,500,38);return;}
    const draw=()=>{
      this.h.ui.clear(m.body);const s=this.h.state,progress=s.repairProgress[servo.uid]||0;
      const needs=Object.entries(recipe.materials).map(([id,q])=>`${materials.find(m=>m.id===id)?.name} ${s.materials[id]||0}/${q}`).join(' · ');
      this.ui.text(m.body,`主料：${getDef(servo.defId).name} + ${getDef(bearing.defId).name}\n${needs}\n工序 ${progress}/3 · 最后确认时消耗两件主料、材料及 ${recipe.ap} AP。`,20,16,1400,216,36);
      this.ui.button(m.body,['装入伺服器','装入注销轴承','连接端子 / 复测'][progress]||'三道工序已完成',20,262,1404,()=>{this.h.dispatch({type:'REPAIR_STEP',uid:servo.uid,stage:progress});draw();},{disabled:progress>=3,name:'phone-craft-stage',tone:'green'});
      const enough=Object.entries(recipe.materials).every(([id,q])=>(s.materials[id]||0)>=q);
      this.ui.button(m.body,'撤回预览',20,536,688,()=>m.close());
      this.ui.button(m.body,'确认组装并消耗主料',736,536,688,()=>{m.close();this.h.dispatch({type:'CRAFT',recipeId:recipe.id});},{tone:'gold',disabled:progress!==3||!enough||s.ap<recipe.ap,name:'phone-craft-confirm',size:32});
    };draw();
  }
  private materials():void {
    const m=this.ui.sheet('材料箱 / 采购');
    const draw=()=>{
      this.h.ui.clear(m.body);this.ui.row(m.body,`可用现金 ${this.h.state.cash} Cr · 每次购买 1 件`,20,0,1400,70,36,C.orange);
      materials.forEach((mat,i)=>{
        const x=20+(i%2)*716,y=94+Math.floor(i/2)*174;
        this.ui.text(m.body,`${mat.name} · 现有 ${this.h.state.materials[mat.id]||0}\n${mat.price} Cr / 件`,x,y,430,116,32);
        this.ui.button(m.body,'购买',x+456,y,232,()=>{this.h.dispatch({type:'BUY_MATERIAL',id:mat.id,qty:1});draw();},{disabled:this.h.state.cash<mat.price,name:`phone-buy-${mat.id}`});
      });
    };draw();
  }
  private orders(p:Node):void {
    const s=this.h.state,groups:OrderGroup[]=['current','history','upcoming'],names=['当前委托','历史记录','待开放'];
    groups.forEach((g,i)=>this.ui.button(p,names[i],24+i*524,132,504,()=>{this.group=g;this.orderOffset=0;this.staged='';this.h.render();},{selected:this.group===g,name:`order-group-${g}`}));
    const list=ordersForGroup(orderDefs,s.orders,s.day,orderEarliest,this.group),id=selectedOrderId(list,this.order);
    if(id!==this.order)this.staged='';this.order=id;
    this.orderOffset=Math.min(this.orderOffset,Math.max(0,Math.floor((list.length-1)/3)*3));
    list.slice(this.orderOffset,this.orderOffset+3).forEach((o,i)=>{
      const st=s.orders.find(v=>v.id===o.id)?.status||'available';
      const b=this.h.button(p,'',24,254+i*132,464,120,()=>{this.order=o.id;this.staged='';this.h.render();},{selected:o.id===id,name:`order-${o.id}`});
      this.ui.row(b,o.name,20,4,424,58,30);this.ui.row(b,`${st==='done'?'已交付':st==='failed'?'已过期':`第 ${o.dueDay} 天截止`} · ${o.reward} Cr`,20,62,424,50,26,C.orange);
    });
    this.ui.button(p,'上一页',24,654,224,()=>{this.orderOffset=Math.max(0,this.orderOffset-3);this.h.render();},{disabled:this.orderOffset===0});
    this.ui.button(p,'下一页',264,654,224,()=>{this.orderOffset+=3;this.h.render();},{disabled:this.orderOffset+3>=list.length});
    const panel=this.ui.panel(p,512,254,1064,508,'order-clipboard');
    if(!id){this.ui.text(panel,'这里还没有委托。\n可继续接待来客，或查看其他分组。',24,40,1000,300,38);return;}
    const order=getOrder(id),os=s.orders.find(o=>o.id===id),status=os?.status||'available';
    this.ui.row(panel,order.name,24,0,1016,72,40);
    const description=order.description.replace(/REC-\d{3}/g,id=>{try{return getRecipe(id).name;}catch{return '对应工序';}});
    this.ui.text(panel,`${order.reward} Cr · 第 ${order.dueDay} 天截止\n${description}`,24,80,1016,206,30);
    if(status==='available'){
      const earliest=orderEarliest[id]||1;
      this.ui.text(panel,`${order.customerOwned?'顾客原物随单交接':'需准备符合条件的自有货物'} · 品相≥${Math.round(order.minCondition*100)}%${order.needsRepair?' · 已修复':''}`,24,298,1016,82,30,C.muted);
      this.ui.button(panel,s.day>=earliest?'接取订单':`第 ${earliest} 天开放`,24,388,1016,()=>this.h.dispatch({type:'TAKE_ORDER',id}),{tone:'gold',disabled:s.day<earliest,name:'phone-take-order'});return;
    }
    if(status==='done'||status==='failed'){
      this.ui.text(panel,status==='done'?'已交付 · 报酬已入账，凭证已归档。':'委托已过期。原物仍按归属保留，可以前往仓储处理。',24,300,1016,188,36,status==='done'?C.cyan:C.danger);return;
    }
    const item=s.inventory.find(i=>i.uid===this.staged),reasons=item?this.rules.orderReasons(order,item):[];
    this.ui.text(panel,item?`${getDef(item.defId).name} · ${reasons.length?reasons.join('；'):'✓ 交付条件符合'}`:'先选择要交付的原物，确认前不会扣款或移交。',24,298,1016,80,28,reasons.length?C.orange:C.cyan);
    this.ui.button(panel,item?'更换原物':'选择交付原物',24,388,492,()=>this.ui.choose('选择交付原物',s.inventory.filter(i=>i.defId===order.itemId),this.staged,i=>{this.staged=i.uid;this.h.render();}),{name:'phone-order-select'});
    this.ui.button(panel,'预览并确认交付',540,388,500,()=>{if(item)this.delivery(order,item);},{tone:'gold',disabled:!item||reasons.length>0,name:'phone-order-deliver'});
  }
  private delivery(order:OrderDef,item:OrbitalItem):void {
    const companion=order.id==='ORD-004'?this.rules.companion():undefined;
    this.ui.confirm('确认交付原物',`${getDef(item.defId).name}${companion?` + ${getDef(companion.defId).name}`:''}\n${order.name} · 报酬 ${order.reward} Cr · 1 AP\n确认后移交所选原物，报酬同时入账。`,()=>{
      const previous={group:this.group,order:this.order,offset:this.orderOffset,staged:this.staged};
      this.group='history';this.order=order.id;this.orderOffset=0;this.staged='';
      this.h.dispatch({type:'DELIVER_ORDER',id:order.id,uid:item.uid});
      if(this.h.state.orders.find(o=>o.id===order.id)?.status!=='done'){this.group=previous.group;this.order=previous.order;this.orderOffset=previous.offset;this.staged=previous.staged;this.h.render();}
    });
  }
  private report(p:Node):void {
    const s=this.h.state,today=s.ledger.filter(e=>e.day===s.day),net=today.reduce((n,e)=>n+e.amount,0),panel=this.ui.panel(p,24,132,1000,630);
    this.ui.row(panel,`第 ${s.day} 日 · 营业结算`,24,8,952,80,42,C.orange);
    this.ui.row(panel,`可用现金 ${s.cash.toLocaleString()} Cr`,24,106,952,90,52);
    this.ui.row(panel,`今日净变化 ${net>=0?'+':''}${net} Cr`,24,210,952,70,36,net>=0?C.cyan:C.orange);
    const entries=today.slice(-4).reverse();
    entries.forEach((e,i)=>this.ui.row(panel,`${e.label}   ${e.amount>=0?'+':''}${e.amount} Cr`,24,310+i*70,952,64,30,C.muted));
    if(!entries.length)this.ui.text(panel,'今日暂无已入账流水。',24,340,952,100,34,C.muted);
    const upgraded=!!s.report?.upgraded;
    (['lamp','shelf'] as const).forEach((id,i)=>this.ui.button(p,`${id==='lamp'?'精密工作灯 · 120':'模组销售架 · 160'} Cr${s.upgrades[id]?' · 已安装':''}`,1048,132+i*132,528,()=>this.h.dispatch({type:'UPGRADE',id}),{disabled:s.phase!=='report'||s.day<3||upgraded||s.upgrades[id]||s.cash<(id==='lamp'?120:160),name:`upgrade-${id}`,size:30}));
    this.ui.text(p,s.day<3?'第 3 日日结起可改造设备。':'打烊后可改造，每日限选一项。',1068,410,488,160,32,C.muted);
    this.ui.button(p,'导出经营档案',1048,526,528,()=>this.h.exportSave());
    this.ui.button(p,`迎接第 ${s.day+1} 天`,1048,654,528,()=>this.h.dispatch({type:'NEXT'}),{tone:'gold',disabled:s.phase!=='report',name:'phone-next-day'});
  }
  private settings(p:Node):void {
    const names={sound:'游戏声音',reducedMotion:'减少动态',largeText:'放大文字'};
    (Object.keys(names) as (keyof typeof names)[]).forEach((key,i)=>{
      const panel=this.ui.panel(p,24,132+i*174,1552,156,`setting-${key}-strip`),enabled=this.h.prefs[key];
      this.ui.row(panel,names[key],28,0,820,156,42);
      this.ui.button(panel,enabled?'已开启 · 点击关闭':'已关闭 · 点击开启',1016,24,508,()=>{this.h.prefs[key]=!enabled;this.h.savePrefs();},{tone:enabled?'green':'quiet',name:`preference-${key}`,size:32});
    });
    this.ui.button(p,'导出经营档案',24,654,504,()=>this.h.exportSave(),{tone:'green'});
    this.ui.button(p,'重新开始…',548,654,504,()=>this.ui.confirm('重新开始经营','这会覆盖当前游戏进度。需要保留的话，请先返回并导出经营档案。',()=>this.h.resetGame()),{tone:'danger'});
    this.ui.button(p,'返回柜台',1072,654,504,()=>this.h.navigate('counter'),{tone:'gold'});
  }
}
