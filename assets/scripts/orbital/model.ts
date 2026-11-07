import { itemDefs, tools, materials, npcs, recipes, orderDefs, orderEarliest, getDef, getNpc, getRecipe, getOrder } from './data';
import type { OrbitalState, OrbitalItem, OrbitalAction, OrbitalTrade, ToolId, OrderDef, Faction } from './types';
export * from './types';
export { itemDefs, tools, materials, npcs, recipes, orderDefs, orderEarliest, getDef, getNpc, getRecipe, getOrder } from './data';
export const ORBITAL_SAVE_KEY='orbital-save-v3';
export const ORBITAL_RULES=Object.freeze({days:21,ap:12,cash:1200,maintenance:20,firstRent:450,warehouseWidth:10,warehouseHeight:6,display:24});
const clone=<T>(value:T):T=>JSON.parse(JSON.stringify(value)) as T;
const clamp=(n:number,min=0,max=100):number=>Math.max(min,Math.min(max,n));
const validPrice=(n:number):boolean=>Number.isSafeInteger(n)&&n>0&&n<=10000000;
const factions:Faction[]=['station','salvage','merchant'];
const toolIds=tools.map(t=>t.id);
const baseMaterials=():Record<string,number>=>Object.fromEntries(materials.map(m=>[m.id,2]));
const notice=(s:OrbitalState,text:string):OrbitalState=>{s.notice=text;return s;};
const nextId=(s:OrbitalState,prefix:string):string=>`${prefix}-${s.nextId++}`;
const hasAP=(s:OrbitalState,n:number):boolean=>s.ap>=n;
const owns=(it:OrbitalItem):boolean=>it.owner==='shop';
const tradeReserved=(s:OrbitalState,it:OrbitalItem):boolean=>s.trade?.selectedUid===it.uid;
const evidenceCount=(it:OrbitalItem):number=>new Set(it.evidence).size;
function spend(s:OrbitalState,n:number):void{s.ap-=n;}
function ledger(s:OrbitalState,id:string,kind:string,label:string,amount:number,cost=0):boolean {
 if(s.ledger.some(r=>r.id===id))return false;
 s.cash+=amount;s.ledger.push({id,day:s.day,kind,label,amount,cost,transactionId:id});return true;
}
function newItem(s:OrbitalState,id:string,options:Partial<OrbitalItem>={}):OrbitalItem {
 const def=getDef(id);
 return {uid:nextId(s,'item'),defId:id,owner:'shop',condition:.8,working:true,authentic:true,sourceVerified:true,source:'回环九号旧港登记批次',evidence:[],inspectedPaid:false,repaired:false,location:'warehouse',x:0,y:0,rotated:false,listPrice:Math.ceil(def.value*.88),cost:0,sealed:false,...options};
}
function dimensions(it:OrbitalItem,rotated=it.rotated):[number,number] {const [w,h]=getDef(it.defId).size;return rotated?[h,w]:[w,h];}
export function canPlace(s:OrbitalState,uid:string,x:number,y:number,rotated?:boolean):boolean {
 const it=s.inventory.find(i=>i.uid===uid)||s.trade?.item;if(!it||it.uid!==uid)return false;
 if(!Number.isInteger(x)||!Number.isInteger(y))return false;
 const [w,h]=dimensions(it,rotated??it.rotated);if(x<0||y<0||x+w>10||y+h>6)return false;
 return !s.inventory.some(other=>{if(other.uid===uid||other.location!=='warehouse')return false;const [ow,oh]=dimensions(other);return x<other.x+ow&&x+w>other.x&&y<other.y+oh&&y+h>other.y;});
}
function emptyCell(s:OrbitalState,it:OrbitalItem):{x:number;y:number}|null {
 const [w,h]=dimensions(it);
 for(let y=0;y<=6-h;y++)for(let x=0;x<=10-w;x++)if(!s.inventory.some(o=>{if(o.uid===it.uid||o.location!=='warehouse')return false;const [ow,oh]=dimensions(o);return x<o.x+ow&&x+w>o.x&&y<o.y+oh&&y+h>o.y;}))return{x,y};
 return null;
}
function putIn(s:OrbitalState,it:OrbitalItem):boolean {const pos=emptyCell(s,it);if(!pos)return false;it.location='warehouse';it.x=pos.x;it.y=pos.y;s.inventory.push(it);return true;}
export function findItem(s:OrbitalState,uid:string):OrbitalItem|undefined {return s.inventory.find(it=>it.uid===uid)||(s.trade?.item?.uid===uid?s.trade.item:undefined);}
export function itemValue(it:OrbitalItem):number {return Math.max(1,Math.round(getDef(it.defId).value*clamp(it.condition,.35,1)*(it.working?1:.5)*(it.authentic?1:.6)));}
export function estimate(it:OrbitalItem):{low:number;high:number;exact:boolean} {
 const base=getDef(it.defId).value,known=evidenceCount(it);
 // Hidden authenticity and function are not used until independent evidence is collected.
 if(known<2)return{low:Math.round(base*.35*.5*.6),high:Math.round(base),exact:false};
 const relevant=getDef(it.defId).tools.filter(t=>it.evidence.includes(t));
 if(relevant.length<2)return{low:Math.round(base*.3),high:Math.round(base),exact:false};
 const price=itemValue(it);return{low:price,high:price,exact:true};
}
export function availableOrders(s:OrbitalState):OrderDef[] {return orderDefs.filter(d=>(orderEarliest[d.id]||1)<=s.day&&d.dueDay>=s.day&&s.orders.find(o=>o.id===d.id)?.status==='available');}
function finishTrade(s:OrbitalState,text:string):OrbitalState {s.trade=null;s.cursor++;s.tutorial=Math.max(s.tutorial,1);return notice(s,text);}
function marketItemId(day:number,cursor:number):string {
 const opening=[['ITM-011','ITM-001'],['ITM-009','ITM-010'],['ITM-049','ITM-050']];
 if(day<=3)return opening[day-1][Math.floor(cursor/2)];
 return itemDefs[((day-4)*2+Math.floor(cursor/2))%itemDefs.length].id;
}
function inspectionReady(s:OrbitalState):boolean {return s.inventory.filter(it=>it.owner==='shop'&&!it.sourceVerified).every(it=>it.location==='isolation');}
export function createOrbital(seed='ORBITAL-P0'):OrbitalState {
 const s:OrbitalState={schema:3,seed,day:1,ap:12,cash:1200,phase:'open',risk:12,relations:{station:30,salvage:35,merchant:20},inventory:[],trade:null,cursor:0,ledger:[],completedTrades:[],orders:orderDefs.map(d=>({id:d.id,status:'available'})),materials:baseMaterials(),repairProgress:{},scanned:[],inspection:'announced',upgrades:{lamp:false,shelf:false},report:null,notice:'回环九号旧港重新点灯。先接待栗叔，翻面检查巡检蜂，再安排维修和订单。',nextId:1,tutorial:0};
 for(const id of ['ITM-001','ITM-002','ITM-003','ITM-026','ITM-027','ITM-041']) {
  const it=newItem(s,id,{condition:id==='ITM-001'?.55:.85,working:id!=='ITM-001',source:'前任店主移交清单 / 所有权已核对',cost:Math.round(getDef(id).value*.28)});putIn(s,it);
 }
 return s;
}
function validatedTradeItem(s:OrbitalState,t:OrbitalTrade):OrbitalItem|undefined {return t.kind==='sell'?s.inventory.find(it=>it.uid===t.selectedUid):t.item||undefined;}
function orderItemValid(s:OrbitalState,id:string,it:OrbitalItem):string|null {
 const def=getOrder(id),order=s.orders.find(o=>o.id===id);
 if(!order||order.status!=='active')return'请先接取这张订单。';
 if(it.defId!==def.itemId)return'交付物品型号不符，原物保留在库存。';
 if(def.customerOwned&&(it.owner!=='customer'||it.orderId!==id||order.uid!==it.uid))return'委修单必须交还顾客原物，不能拿自有货替换。';
 if(!def.customerOwned&&!owns(it))return'这件物品不属于店铺，不能代替自有货交单。';
 if(it.condition<def.minCondition)return'品相尚未达到订单要求。';
 if(def.needsRepair&&(!it.repaired||!it.working))return'维修与复测尚未完成。';
 if(evidenceCount(it)<2)return'请至少记录两条独立物证后再交付。';
 if(!def.customerOwned&&def.id!=='ORD-011'&&!it.sourceVerified)return'来源尚未核验，不能履约。';
 if(!def.customerOwned&&def.id!=='ORD-011'&&!it.working)return'购买订单要求功能正常的货物，鉴定服务可如实报告故障。';
 return null;
}
export function reduceOrbital(previous:OrbitalState,action:OrbitalAction):OrbitalState {
 const s=clone(previous);
 if(action.type==='NEXT') {
  if(s.phase!=='report')return previous;
  if(s.day>=21||s.outcome){s.phase='ending';return s;}
  s.day++;s.ap=12;s.phase='open';s.cursor=0;s.trade=null;s.report=null;s.scanned=[];
  s.inspection=s.day>=3?'pending':'announced';
  for(const o of s.orders)if((o.status==='available'||o.status==='active')&&getOrder(o.id).dueDay<s.day)o.status='failed';
  // Unredeemed collateral is retained and locked through the three-day term and one grace day.
  for(const it of s.inventory)if(it.owner==='pawn'&&it.pawnDay!==undefined&&s.day>it.pawnDay+4){it.owner='shop';it.sealed=false;it.sourceVerified=true;const pos=emptyCell(s,it);if(pos){it.location='warehouse';it.x=pos.x;it.y=pos.y;}it.pawnPrincipal=undefined;it.pawnDay=undefined;}
  return notice(s,s.day===2?'第2天：阿篁与澄九带来委修预约。到订单页接单，再到维修台换件复测。':s.day===3?'第3天：饶静预约核验。先扫描来源不明货物，再登记或隔离，日结可选择首个升级。':`第${s.day}天开门。核对订单与到期抵押，租金和维护费在日结显示。`);
 }
 if(action.type==='UPGRADE') {
  if(s.phase!=='report'||!s.report)return notice(s,'店铺升级在日结后安排。');
  if(s.day<3)return notice(s,'首个设备升级在第3日日结开放。');
  if(s.report.upgraded||s.upgrades[action.id])return notice(s,'本次升级已经登记，请迎接明天。');
  const cost=action.id==='lamp'?120:160;if(s.cash<cost)return notice(s,`升级需要${cost}Cr，现金不足。`);
  ledger(s,`upgrade-${action.id}`,'upgrade',action.id==='lamp'?'可变焦工作灯升级':'模组陈列架升级',-cost);s.upgrades[action.id]=true;s.report.upgraded=true;s.report.cash=s.cash;
  return notice(s,action.id==='lamp'?'工作灯已换装：新日鉴定首次费用减为0AP。':'陈列架已换装：合法货物的陈列报价提高5%。');
 }
 if(s.phase!=='open')return previous;
 if(action.type==='EMERGENCY_SALE') {
  const window=s.ledger.some(r=>r.kind==='relief-window'&&r.day===s.day);
  if(!window)return notice(s,'限期清仓只在首次结算欠费的救济窗口开放。');
  const due=s.day%7===0?Math.round(450*Math.pow(1.1,Math.floor((s.day-1)/7))):0;
  if(s.cash>=20+due)return notice(s,'维护与租金缺口已补齐，请返回日结，清仓不会继续低价出售。');
  const it=s.inventory.find(i=>i.uid===action.uid);if(!it)return previous;
  if(tradeReserved(s,it)||!owns(it)||it.orderId||!it.sourceVerified||it.sealed||it.location==='isolation')return notice(s,'应急清仓仍不能出售顾客、抵押、预留或来源未核货物。');
  const amount=Math.max(1,Math.floor(itemValue(it)*.55));
  if(!ledger(s,`relief-sale-${it.uid}`,'clearance',`应急清仓 ${getDef(it.defId).name}`,amount,it.cost))return previous;
  s.inventory=s.inventory.filter(i=>i.uid!==it.uid);
  return notice(s,`原物按清仓报价${amount}Cr移交，未消耗AP。${s.cash>=20+due?'欠款已补齐，可以重新结算。':'可继续处理合法自有库存，直到补齐本次欠款。'}`);
 }
 if(action.type==='ARRIVE') {
  if(s.trade)return notice(s,'先完成当前交易，或请客人收好物品。');
  if(s.cursor>=4)return notice(s,'今日四位预约已处理。可以维修、履约或提前打烊。');
  const sell=s.cursor%2===1,npcId=s.cursor===0?'CHR-004':s.cursor===1?'CHR-002':s.cursor===2?'CHR-005':'CHR-003';
  const t:OrbitalTrade={id:nextId(s,'trade'),npcId,kind:sell?'sell':'buy',item:null,price:0,rounds:0,locked:false,evidenceUsed:[],line:sell?'想找一件合规、能用的旧设备，先从你的货架挑一件吧。':getNpc(npcId).line};
  if(!sell){
   const id=marketItemId(s.day,s.cursor),def=getDef(id),unverified=s.day>=3&&s.cursor===0;
   t.item=newItem(s,id,{condition:s.cursor===0?.65:.8,working:s.cursor!==0,authentic:!(s.day===2&&s.cursor===2),sourceVerified:!unverified,source:unverified?'封签批次与旧港注销清单待比对':'供货人登记回执 / 旧港回收批次'});
   t.price=Math.round(def.value*(t.item.working?.7:.42));t.line=s.day===1&&s.cursor===0?'这台折叠巡检蜂从旧航道带回。机臂展开后有点迟，你先看看。':unverified?'这张定位片的持续脉冲和封签不一致，先别放上销售架。':getNpc(npcId).line;
  }
  s.trade=t;return notice(s,sell?'顾客在柜台等候，请从仓储选择自有货物推荐。':'客人把货物放到柜台，先拿到鉴定台观察。');
 }
 if(action.type==='SELECT_TRADE') {
  const t=s.trade,it=s.inventory.find(i=>i.uid===action.uid);if(!t||t.kind!=='sell'||t.locked||!it)return previous;
  if(!owns(it)||it.location==='isolation'||!it.sourceVerified||it.orderId)return notice(s,'受托、隔离、来源未明或订单预留的货物不能出售。');
  t.selectedUid=it.uid;t.price=Math.max(1,Math.round(itemValue(it)*.95));t.line=`${getDef(it.defId).name}看起来合用，请说明检测结果和报价。`;return s;
 }
 if(action.type==='CHECK') {
  const it=findItem(s,action.uid);if(!it||!toolIds.includes(action.tool))return previous;
  if(it.evidence.includes(action.tool))return notice(s,'已取得该工具的证据，免费复看，不重复扣AP。');
  if(!it.inspectedPaid){const cost=s.upgrades.lamp?0:1;if(!hasAP(s,cost))return notice(s,'今日行动点不足，明日可继续，物证不会丢失。');spend(s,cost);it.inspectedPaid=true;}
  it.evidence.push(action.tool);s.tutorial=Math.max(s.tutorial,1);
  const extra=evidenceCount(it)>=2?'已有两条独立物证，可交叉判断估值。':'仍需另一工具的独立物证，不能只凭外观定真伪。';
  return notice(s,`${getDef(it.defId).clues[action.tool]||'工具读数已记录。'} ${extra}`);
 }
 if(action.type==='OFFER') {
  const t=s.trade;if(!t||t.locked||!validatedTradeItem(s,t))return previous;
  if(!validPrice(action.price))return notice(s,'报价必须是有效的正整数。');
  if(t.rounds>=3)return notice(s,'三次有效还价已用完，可以接受当前报价或送客。');
  const it=validatedTradeItem(s,t)!;if(action.evidence&&!it.evidence.includes(action.evidence))return notice(s,'这条证据尚未取得，不能用于报价。');
  if(action.evidence&&!t.evidenceUsed.includes(action.evidence))t.evidenceUsed.push(action.evidence);
  const value=itemValue(it),evidenceBonus=Math.min(.12,t.evidenceUsed.length*.06);
  const acceptable=t.kind==='sell'?action.price<=value*(1.06+evidenceBonus):action.price>=value*(.68-evidenceBonus);
  t.rounds++;if(acceptable){t.price=action.price;t.locked=true;t.line='物证说得通。价格确认，我们按这个数交割。';}
  else{t.price=Math.round((t.price+action.price)/2);t.line=`这个数还有差距，我可以让到${t.price}Cr。`;}
  return notice(s,acceptable?'证据与报价已确认，交割前不会扣款。':'客人递回反报价。还价不消耗额外AP。');
 }
 if(action.type==='ACCEPT') {
  const t=s.trade;if(!t||t.locked)return previous;const it=validatedTradeItem(s,t);if(!it)return notice(s,'请先选定要交易的实物。');
  if(t.kind==='buy'&&s.cash<t.price)return notice(s,`现金不足，还差${t.price-s.cash}Cr。`);
  t.locked=true;t.line='就按票据上的价格。确认交割后钱货同时入账。';return s;
 }
 if(action.type==='DELIVER') {
  const t=s.trade;if(!t||t.id!==action.tradeId||!t.locked||s.completedTrades.includes(action.tradeId))return previous;
  const it=validatedTradeItem(s,t);if(!it)return notice(s,'货物已变化，请重新核对。');
  if(!hasAP(s,1))return notice(s,'交割需要1AP，当前余额不足。');
  if(t.kind==='buy'){
   if(s.cash<t.price)return notice(s,'现金不足，钱货均未变动。');
   const pos=emptyCell(s,it);if(!pos)return notice(s,'后仓没有可容纳该形状的空位，先整理格子。');
   it.owner='shop';it.cost=t.price;it.x=pos.x;it.y=pos.y;it.location='warehouse';s.inventory.push(it);
   ledger(s,t.id,'purchase',`收购 ${getDef(it.defId).name}`,-t.price,t.price);if(!it.sourceVerified)s.risk=clamp(s.risk+12);
  } else {
   if(!owns(it)||it.location==='isolation'||!it.sourceVerified||it.orderId)return notice(s,'货物归属或封存状态变化，不能交割。');
   ledger(s,t.id,'sale',`售出 ${getDef(it.defId).name}`,t.price,it.cost);s.inventory=s.inventory.filter(i=>i.uid!==it.uid);s.relations[getNpc(t.npcId).faction]=clamp(s.relations[getNpc(t.npcId).faction]+2);
  }
  spend(s,1);s.completedTrades.push(t.id);return finishTrade(s,'钱货已交割，回执和物件归属同步保存。');
 }
 if(action.type==='PAWN') {
  const t=s.trade;if(!t||t.kind!=='buy'||!t.item||t.id!==action.tradeId||s.completedTrades.includes(t.id))return previous;
  const it=t.item;if(s.inventory.filter(i=>i.location==='pawn').length>=16)return notice(s,'抵押保管柜16格已满。');if(evidenceCount(it)<2)return notice(s,'抵押前须取得两条独立物证。');
  const appraisal=estimate(it),amount=Math.floor((appraisal.low+appraisal.high)/2*.4);if(!hasAP(s,1)||s.cash<amount)return notice(s,'现金或行动点不足，抵押合同未成立。');
  it.owner='pawn';it.location='pawn';it.pawnDay=s.day;it.pawnPrincipal=amount;it.cost=amount;it.sealed=true;s.inventory.push(it);
  ledger(s,t.id,'pawn-principal',`抵押本金 ${getDef(it.defId).name}`,-amount);spend(s,1);s.completedTrades.push(t.id);return finishTrade(s,`发放${amount}Cr本金。3日赎期加1日宽限，8%服务费；保管物不可出售或拆解。`);
 }
 if(action.type==='REDEEM') {
  const it=s.inventory.find(i=>i.uid===action.uid);if(!it||it.owner!=='pawn'||it.pawnPrincipal===undefined||it.pawnDay===undefined)return previous;
  if(s.day>it.pawnDay+4)return notice(s,'已超过宽限，请先核对抵押到期处理。');
  const principal=it.pawnPrincipal,fee=Math.round(principal*.08*100)/100;
  ledger(s,`redeem-principal-${it.uid}`,'pawn-return',`收回抵押本金 ${getDef(it.defId).name}`,principal);
  ledger(s,`redeem-fee-${it.uid}`,'pawn-fee','抵押服务费',fee);s.inventory=s.inventory.filter(i=>i.uid!==it.uid);return notice(s,`原物归还，本金${principal}Cr及服务费${fee}Cr分账入册。`);
 }
 if(action.type==='REFUSE') {if(!s.trade)return previous;return finishTrade(s,'客人收回物件离开，没有资金或所有权变化。');}
 if(action.type==='MOVE') {
  const it=s.inventory.find(i=>i.uid===action.uid);if(!it)return previous;
  if(tradeReserved(s,it)||it.owner==='pawn'||it.sealed||it.location==='isolation')return notice(s,'当前交易、封存或抵押货物不能移入普通仓格。');
  if(!canPlace(s,it.uid,action.x,action.y,action.rotated))return notice(s,'放置会重叠或越界，货物已回到原位。');
  it.location='warehouse';it.x=action.x;it.y=action.y;it.rotated=action.rotated??it.rotated;return notice(s,'仓格位置已保存。');
 }
 if(action.type==='DISPLAY') {
  const it=s.inventory.find(i=>i.uid===action.uid);if(!it)return previous;
  if(tradeReserved(s,it))return notice(s,'这件实物已在当前报价中，先交割或取消交易。');
  if(it.location==='display'){const pos=emptyCell(s,it);if(!pos)return notice(s,'后仓没有可容纳该形状的空位。');it.location='warehouse';it.x=pos.x;it.y=pos.y;return notice(s,'已从陈列架移回后仓。');}
  if(!owns(it)||it.orderId||it.location==='isolation'||it.sealed)return notice(s,'受托、预留、隔离或封存物品不能上架。');
  if(!it.sourceVerified||evidenceCount(it)<2)return notice(s,'请先取得两条独立物证并核验来源，再上架。');
  if(s.inventory.filter(i=>i.location==='display').length>=24)return notice(s,'24个销售陈列位已满。');
  it.location='display';if(s.upgrades.shelf)it.listPrice=Math.round(itemValue(it)*1.05);return notice(s,'物品与已知证据价签已上架。');
 }
 if(action.type==='PRICE') {const it=s.inventory.find(i=>i.uid===action.uid);if(!it||tradeReserved(s,it)||!owns(it)||it.orderId||!validPrice(action.price))return previous;it.listPrice=action.price;return notice(s,'挂牌价格已保存。');}
 if(action.type==='ISOLATE') {
  const it=s.inventory.find(i=>i.uid===action.uid);if(!it||it.owner==='pawn')return previous;
  if(tradeReserved(s,it))return notice(s,'这件实物正在交易，先交割或取消报价。');
  if(it.location==='isolation') {
   if(!it.sourceVerified)return notice(s,'来源仍未通过核验，不能解除隔离。');
   const pos=emptyCell(s,it);if(!pos)return notice(s,'后仓没有空位。');it.location='warehouse';it.sealed=false;it.x=pos.x;it.y=pos.y;return notice(s,'隔离解除，回到普通后仓。');
  }
  if(s.inventory.filter(i=>i.location==='isolation').length>=12)return notice(s,'4×3隔离柜已满，请先核验或归还现有货物。');
  it.location='isolation';it.sealed=true;
  if(s.inspection==='pending'&&inspectionReady(s))s.inspection='cleared';
  return notice(s,'原物已转入隔离柜，暂停销售；核验可继续。');
 }
 if(action.type==='SCAN') {
  const it=s.inventory.find(i=>i.uid===action.uid);if(!it)return previous;
  if(!s.scanned.includes(it.uid))s.scanned.push(it.uid);
  if(s.day>=3&&inspectionReady(s))s.inspection='cleared';
  return notice(s,it.sourceVerified?'箱号、封签和来源回执一致，扫描记录已保存。':'箱号与来源回执尚未一致。可以隔离、补交登记或主动归还。');
 }
 if(action.type==='REGISTER') {
  const it=s.inventory.find(i=>i.uid===action.uid);if(!it||it.owner==='pawn')return previous;
  if(it.sourceVerified)return notice(s,'来源已登记，不重复收取费用。');
  if(!s.scanned.includes(it.uid)||evidenceCount(it)<2)return notice(s,'先过安检扫描并记录两条独立物证，再提交登记申请。');
  if(s.cash<35||!hasAP(s,1))return notice(s,'登记需要35Cr和1AP，资料与原物保持不变。');
  ledger(s,`register-${it.uid}`,'registration','来源登记手续费',-35);spend(s,1);it.sourceVerified=true;s.risk=clamp(s.risk-6);if(inspectionReady(s))s.inspection='cleared';return notice(s,'公开批次与物证已完成登记比对，原物可解除隔离。');
 }
 if(action.type==='RETURN_ITEM') {
  const it=s.inventory.find(i=>i.uid===action.uid);if(!it||it.owner==='pawn')return previous;
  if(tradeReserved(s,it))return notice(s,'这件实物正在交易，不能同时返还。');
  s.inventory=s.inventory.filter(i=>i.uid!==it.uid);if(it.orderId){const order=s.orders.find(o=>o.id===it.orderId);if(order&&order.status==='active')order.status='failed';}
  if(!it.sourceVerified)s.risk=clamp(s.risk-6);if(inspectionReady(s))s.inspection='cleared';return notice(s,'已打印返还凭证，原物移交。未伪造来源或额外收取报酬。');
 }
 if(action.type==='REPAIR_STEP') {
  const it=s.inventory.find(i=>i.uid===action.uid);if(!it||tradeReserved(s,it)||it.owner==='pawn'||it.location==='isolation'||it.sealed||!it.sourceVerified||it.repaired)return notice(s,'该物件不能开始新的维修工序。');
  const progress=s.repairProgress[it.uid]||0;if(action.stage!==progress||action.stage<0||action.stage>2)return notice(s,'按清洁排故、换件连接、负载复测的顺序操作。');
  s.repairProgress[it.uid]=progress+1;return notice(s,progress===2?'三道工序准备完成，确认后才扣除材料与AP。':'工序位置已记录，材料与AP尚未提交。');
 }
 if(action.type==='REPAIR') {
  const it=s.inventory.find(i=>i.uid===action.uid),r=recipes.find(r=>r.id===action.recipeId);if(!it||!r||r.kind!=='repair')return previous;
  if(it.repaired)return notice(s,'该物件已完成本次修复，不能重复刷价值。');
  if(tradeReserved(s,it)||it.owner==='pawn'||it.location==='isolation'||it.sealed||!it.sourceVerified)return notice(s,'保管、来源未核或隔离货物不能加工。');
  const assigned=getDef(it.defId).recipeId;if(r.itemId!==it.defId&&assigned!==r.id)return notice(s,'配方与实际物件不兼容。');
  if(evidenceCount(it)<1)return notice(s,'先取得故障诊断证据，再开始修复。');
  if((s.repairProgress[it.uid]||0)!==3)return notice(s,'尚未完成三道可见维修工序。');
  if(!hasAP(s,r.ap))return notice(s,`修复需${r.ap}AP，当前不足。`);
  if(Object.entries(r.materials).some(([id,n])=>(s.materials[id]||0)<n))return notice(s,'维修材料不足，请从物资采购补齐；尚未扣料。');
  for(const [id,n]of Object.entries(r.materials))s.materials[id]-=n;
  spend(s,r.ap);it.cost+=Object.entries(r.materials).reduce((n,[id,qty])=>n+(materials.find(m=>m.id===id)?.price||0)*qty,0);it.repaired=true;it.working=true;it.condition=Math.min(r.id==='REC-001'?.9:.95,it.condition+.3);it.listPrice=itemValue(it);s.tutorial=Math.max(s.tutorial,2);
  return notice(s,'修复与负载复测通过。外壳保留维修标记，真伪和来源没有改变。');
 }
 if(action.type==='DISMANTLE') {
  const it=s.inventory.find(i=>i.uid===action.uid);if(!it)return previous;
  if(tradeReserved(s,it)||!owns(it)||it.orderId||it.location==='isolation'||it.sealed||!it.sourceVerified)return notice(s,'受托、抵押、订单占用、来源未核或隔离物品不能拆解。');
  if(evidenceCount(it)<1||!hasAP(s,1))return notice(s,'拆解前需要故障诊断证据和1AP。');
  s.inventory=s.inventory.filter(i=>i.uid!==it.uid);s.materials['MAT-001']=(s.materials['MAT-001']||0)+2;s.materials['MAT-003']=(s.materials['MAT-003']||0)+1;spend(s,1);return notice(s,'原物已不可逆拆解：获得导电纤维×2、标准微线圈×1。');
 }
 if(action.type==='CRAFT') {
  const r=recipes.find(r=>r.id===action.recipeId);if(!r||r.kind!=='craft'||!r.outputId)return previous;
  const servo=s.inventory.find(i=>i.defId===r.itemId&&owns(i)&&!i.orderId&&i.working&&i.sourceVerified&&!tradeReserved(s,i)&&!i.sealed&&i.location!=='isolation');
  const bearing=s.inventory.find(i=>i.defId==='ITM-027'&&owns(i)&&!i.orderId&&i.working&&i.sourceVerified&&!tradeReserved(s,i)&&!i.sealed&&i.location!=='isolation');
  if(!servo||!bearing)return notice(s,'组装需要一台正常伺服器与一只已注销轴承，顾客原物不能作主料。');
  if((s.repairProgress[servo.uid]||0)!==3)return notice(s,'请先将两件主料装入实体槽位并完成端子复测，再提交组装。');
  if(!hasAP(s,r.ap)||Object.entries(r.materials).some(([id,n])=>(s.materials[id]||0)<n))return notice(s,'组装材料或AP不足，主料未消耗。');
  const candidate=newItem(s,r.outputId,{condition:1,working:true,repaired:true,evidence:['TOL-004','TOL-006'],inspectedPaid:true,cost:servo.cost+bearing.cost+Object.entries(r.materials).reduce((n,[id,qty])=>n+(materials.find(m=>m.id===id)?.price||0)*qty,0)});
  const remaining=s.inventory.filter(i=>i.uid!==servo.uid&&i.uid!==bearing.uid);const trial={...s,inventory:remaining};const pos=emptyCell(trial,candidate);if(!pos)return notice(s,'组装成品需要3×2仓位，先整理后仓。');
  s.inventory=remaining;candidate.x=pos.x;candidate.y=pos.y;s.inventory.push(candidate);for(const [id,n]of Object.entries(r.materials))s.materials[id]-=n;spend(s,r.ap);return notice(s,'伺服器与轴承已装入维护框，双向限位测试通过，产出舱门维护套组。');
 }
 if(action.type==='TAKE_ORDER') {
  const def=orderDefs.find(d=>d.id===action.id),o=s.orders.find(o=>o.id===action.id);if(!def||!o||o.status!=='available')return previous;
  if(s.day<(orderEarliest[def.id]||1)||s.day>def.dueDay)return notice(s,'这张预约尚未开始或已经到期。');
  if(def.id==='ORD-011'&&!s.inventory.some(it=>it.defId===def.itemId&&!it.sourceVerified))return notice(s,'没有实际来源争议件，不生成虚假的归还订单。');
  if(def.id==='ORD-004'&&!['ITM-003','ITM-041'].every(id=>s.inventory.some(it=>it.defId===id&&owns(it)&&it.working)))return notice(s,'需要同时持有正常光合灯与健康藻苗罐才能接单。');
  if(def.id==='ORD-003'&&!s.inventory.some(it=>it.defId===def.itemId&&owns(it)&&it.working))return notice(s,'先备好自有正常保温杯，再预约栗叔取货。');
  if(def.customerOwned){const it=newItem(s,def.itemId,{owner:'customer',orderId:def.id,condition:def.needsRepair?.55:.8,working:!def.needsRepair,sourceVerified:true,source:`${def.id} 顾客委修登记 / 禁止销售`,cost:0});if(!putIn(s,it))return notice(s,'后仓缺少保管原物的空间，请先整理。');o.uid=it.uid;}
  o.status='active';return notice(s,def.customerOwned?'已接取委托，顾客原物已入受托保管位；没有支付采购款。':'订单已接取，将合格自有货拖入交付盘预览。');
 }
 if(action.type==='DELIVER_ORDER') {
  const o=s.orders.find(o=>o.id===action.id),it=s.inventory.find(i=>i.uid===action.uid);if(!o||!it||o.status!=='active')return previous;
  if(tradeReserved(s,it))return notice(s,'当前报价已占用该物件，先取消交易再交单。');
  const bad=orderItemValid(s,action.id,it);if(bad)return notice(s,bad);const def=getOrder(action.id);
  if(!hasAP(s,1))return notice(s,'订单交付需要1AP，当前不足。');
  let extra:OrbitalItem|undefined;
  if(def.id==='ORD-004'){extra=s.inventory.find(i=>i.defId==='ITM-041'&&owns(i)&&i.working&&i.sourceVerified&&evidenceCount(i)>=2);if(!extra)return notice(s,'还缺已核验的藻苗罐，两个轮廓必须同时满足后才会交货。');}
  const id=`order-${o.id}`;if(s.ledger.some(e=>e.id===id))return previous;
  ledger(s,id,def.customerOwned?'service':'order',`${def.name} · 交付`,def.reward,it.cost+(extra?.cost||0));s.inventory=s.inventory.filter(i=>i.uid!==it.uid&&i.uid!==extra?.uid);o.status='done';spend(s,1);s.relations[def.faction]=clamp(s.relations[def.faction]+4);
  if(def.id==='ORD-010')s.risk=clamp(s.risk-2);if(def.id==='ORD-011')s.risk=clamp(s.risk-6);return notice(s,`订单盖章：${def.name}，${def.reward}Cr已到账，原物已交还。`);
 }
 if(action.type==='BUY_MATERIAL') {
  const m=materials.find(m=>m.id===action.id);if(!m||!Number.isInteger(action.qty)||action.qty<1||action.qty>99)return previous;
  const cost=m.price*action.qty;if(s.cash<cost)return notice(s,'采购现金不足。');
  ledger(s,nextId(s,'materials'),'materials',`${m.name}×${action.qty}`,-cost);s.materials[m.id]=(s.materials[m.id]||0)+action.qty;return notice(s,'耗材已入工具柜，采购不消耗AP。');
 }
 if(action.type==='SETTLE') {
  if(s.trade)return notice(s,'先交割或送客，再打烊。');
  if(s.day>=3&&s.inspection==='pending'&&!inspectionReady(s))return notice(s,'预约安检尚未完成：把来源待核货物扫描并登记，或放入隔离柜。');
  const due=s.day%7===0?Math.round(450*Math.pow(1.1,Math.floor((s.day-1)/7))):0,maintenance=20;
  const today=s.ledger.filter(r=>r.day===s.day),income=today.filter(r=>r.amount>0&&r.kind!=='pawn-return').reduce((n,r)=>n+r.amount,0),expenses=-today.filter(r=>r.amount<0).reduce((n,r)=>n+r.amount,0);
  if(s.cash<maintenance+due){
   const current=s.ledger.some(r=>r.kind==='relief-window'&&r.day===s.day),used=s.ledger.some(r=>r.kind==='relief-window');
   if(!used){ledger(s,`relief-day-${s.day}`,'relief-window','首次欠费：限期清仓救济窗口',0);return notice(s,`结算暂缓：维护${maintenance}Cr、租金${due}Cr，尚缺${maintenance+due-s.cash}Cr。首次救济已开放，可在仓储应急清仓合法自有货，0AP变现；也可完成维修订单补齐后再结算。`);}
   if(current&&s.inventory.some(it=>owns(it)&&!it.orderId&&it.sourceVerified&&!it.sealed&&it.location!=='isolation'))return notice(s,`本次欠费还差${maintenance+due-s.cash}Cr。清仓窗口仍开放，请到仓储处理合法自有货再结算。`);
   s.phase='ending';s.outcome='限期清仓后仍无力支付店铺费用';return notice(s,'一次限期清仓机会已经提供；本次无法补齐费用，进入可回看的清算。');
  }
  ledger(s,`maintenance-day-${s.day}`,'maintenance','每日能源维护',-maintenance);if(due)ledger(s,`rent-day-${s.day}`,'rent',`第${s.day}天租金`,-due);
  s.report={day:s.day,income,expenses,maintenance,rent:due,cash:s.cash,upgraded:false};s.phase='report';if(s.day===21)s.outcome=s.risk>=60?'高风险转运站':s.relations.merchant>s.relations.salvage?'稀有收藏行':'可信赖维修店';return notice(s,s.day>=3&&!s.upgrades.lamp&&!s.upgrades.shelf?'日结完成。选择工作灯或模组货架作为首个升级，明日能看到变化。':'日结完成，租金与维护收据已归档。');
 }
 return previous;
}

const isRecord=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
const finite=(v:unknown,min:number,max:number):v is number=>typeof v==='number'&&Number.isFinite(v)&&v>=min&&v<=max;
const integer=(v:unknown,min:number,max:number):v is number=>finite(v,min,max)&&Number.isInteger(v);
const text=(v:unknown,max=1000):v is string=>typeof v==='string'&&v.length<=max;
function validItem(value:unknown):value is OrbitalItem {
 if(!isRecord(value))return false;const v=value;
 if(!text(v.uid,100)||!/^item-\d+$/.test(v.uid)||!text(v.defId,20)||(!itemDefs.some(d=>d.id===v.defId)&&v.defId!=='BND-001'))return false;
 if(!['shop','customer','pawn'].includes(String(v.owner))||!['warehouse','display','isolation','pawn'].includes(String(v.location)))return false;
 if(!finite(v.condition,0,1)||!finite(v.cost,0,1e8)||!finite(v.listPrice,1,1e8)||!integer(v.x,0,9)||!integer(v.y,0,5))return false;
 for(const k of ['working','authentic','sourceVerified','inspectedPaid','repaired','rotated','sealed'])if(typeof v[k]!=='boolean')return false;
 if(!text(v.source,2000)||!Array.isArray(v.evidence)||v.evidence.length>6||new Set(v.evidence).size!==v.evidence.length||v.evidence.some(t=>!toolIds.includes(t as ToolId)))return false;
 if(v.orderId!==undefined&&!orderDefs.some(o=>o.id===v.orderId))return false;
 if(v.owner==='pawn'&&(!integer(v.pawnDay,1,21)||!finite(v.pawnPrincipal,0,1e8)||v.location!=='pawn'))return false;
 if(v.owner==='customer'&&(!text(v.orderId)||!orderDefs.some(o=>o.id===v.orderId)))return false;
 if(v.location==='warehouse'){const it=v as unknown as OrbitalItem,[w,h]=dimensions(it);if(it.x+w>10||it.y+h>6)return false;}
 return true;
}
export function serializeOrbital(s:OrbitalState):string {return JSON.stringify(s);}
export function parseOrbital(raw:unknown):OrbitalState|null {
 try{
  const v:unknown=typeof raw==='string'?JSON.parse(raw):raw;if(!isRecord(v)||v.schema!==3)return null;
  if(!text(v.seed,200)||!integer(v.day,1,21)||!integer(v.ap,0,12)||!finite(v.cash,0,1e9)||!integer(v.risk,0,100)||!['open','report','ending'].includes(String(v.phase)))return null;
  if(!isRecord(v.relations)||factions.some(f=>!integer((v.relations as Record<string,unknown>)[f],0,100)))return null;
  if(!Array.isArray(v.inventory)||v.inventory.length>128||!v.inventory.every(validItem)||new Set(v.inventory.map(i=>i.uid)).size!==v.inventory.length)return null;
  const inv=v.inventory as OrbitalItem[];
  if(inv.filter(i=>i.location==='display').length>24||inv.filter(i=>i.location==='isolation').length>12||inv.filter(i=>i.location==='pawn').length>16)return null;
  for(const it of inv)if(it.location==='warehouse'){
   const [w,h]=dimensions(it);if(inv.some(o=>{if(o.uid===it.uid||o.location!=='warehouse')return false;const [ow,oh]=dimensions(o);return it.x<o.x+ow&&it.x+w>o.x&&it.y<o.y+oh&&it.y+h>o.y;}))return null;
  }
  if(!integer(v.cursor,0,4)||!integer(v.nextId,1,1000000)||!integer(v.tutorial,0,100))return null;
  const allocated=inv.map(i=>Number(i.uid.split('-').pop()));if(v.trade&&isRecord(v.trade)){if(text(v.trade.id))allocated.push(Number(v.trade.id.split('-').pop()));if(validItem(v.trade.item))allocated.push(Number(v.trade.item.uid.split('-').pop()));}if(allocated.some(n=>!Number.isFinite(n)||n>=Number(v.nextId)))return null;
  if(!Array.isArray(v.completedTrades)||v.completedTrades.length>5000||v.completedTrades.some(x=>!text(x,100))||new Set(v.completedTrades).size!==v.completedTrades.length)return null;
  if(!Array.isArray(v.ledger)||v.ledger.length>5000||new Set(v.ledger.map(e=>isRecord(e)?e.id:'')).size!==v.ledger.length)return null;
  if(v.ledger.some(e=>!isRecord(e)||!text(e.id,100)||!integer(e.day,1,21)||!text(e.kind,100)||!text(e.label,2000)||!finite(e.amount,-1e8,1e8)||!finite(e.cost,0,1e8)))return null;
  if(!isRecord(v.materials)||materials.some(m=>!integer((v.materials as Record<string,unknown>)[m.id],0,99999)))return null;
  if(!Array.isArray(v.orders)||v.orders.length!==12||new Set(v.orders.map(o=>isRecord(o)?o.id:'')).size!==12||v.orders.some(o=>!isRecord(o)||!orderDefs.some(d=>d.id===o.id)||!['available','active','done','failed'].includes(String(o.status))))return null;
  if(!isRecord(v.repairProgress)||Object.entries(v.repairProgress).some(([key,n])=>!/^item-\d+$/.test(key)||!integer(n,0,3)))return null;
  if(!Array.isArray(v.scanned)||v.scanned.length>128||v.scanned.some(x=>!text(x,100))||!['announced','pending','cleared'].includes(String(v.inspection)))return null;
  if(!isRecord(v.upgrades)||typeof v.upgrades.lamp!=='boolean'||typeof v.upgrades.shelf!=='boolean'||!text(v.notice,5000))return null;
  if(v.trade!==null){
   const t=v.trade;if(!isRecord(t)||!text(t.id,100)||!npcs.some(n=>n.id===t.npcId)||!['buy','sell','pawn'].includes(String(t.kind))||!finite(t.price,0,1e8)||!integer(t.rounds,0,3)||typeof t.locked!=='boolean'||!text(t.line,4000))return null;
   if(t.item!==null&&!validItem(t.item))return null;
   if(!Array.isArray(t.evidenceUsed)||t.evidenceUsed.some(e=>!toolIds.includes(e as ToolId)))return null;
   if(t.selectedUid!==undefined&&!inv.some(i=>i.uid===t.selectedUid))return null;
   if(t.item&&inv.some(i=>i.uid===(t.item as OrbitalItem).uid))return null;
  }
  if(v.report!==null){const r=v.report;if(!isRecord(r)||!integer(r.day,1,21)||!finite(r.income,0,1e9)||!finite(r.expenses,0,1e9)||!finite(r.maintenance,0,1e9)||!finite(r.rent,0,1e9)||!finite(r.cash,0,1e9)||typeof r.upgraded!=='boolean')return null;}
  if(v.phase==='report'&&v.report===null)return null;
  return clone(v as unknown as OrbitalState);
 }catch{return null;}
}
