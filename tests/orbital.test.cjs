const assert=require('node:assert/strict');
const g=require(process.argv[2]);
let checks=0;const check=(v,m)=>{checks++;assert.ok(v,m);};const action=(s,type,args={})=>g.reduceOrbital(s,{type,...args});
const id=(s,def)=>s.inventory.find(it=>it.defId===def).uid;
function inspect(s,uid,toolList){for(const tool of toolList||g.getDef(g.findItem(s,uid).defId).tools)s=action(s,'CHECK',{uid,tool});return s;}
function repair(s,uid){const it=g.findItem(s,uid),r=g.getRecipe(g.getDef(it.defId).recipeId);for(let stage=0;stage<3;stage++)s=action(s,'REPAIR_STEP',{uid,stage});return action(s,'REPAIR',{uid,recipeId:r.id});}
function trade(s){s=action(s,'ARRIVE');if(s.trade.kind==='sell'){const it=s.inventory.find(it=>it.owner==='shop'&&it.sourceVerified&&it.location!=='isolation'&&!it.orderId);if(!it)return action(s,'REFUSE');s=action(s,'SELECT_TRADE',{uid:it.uid});}s=action(s,'ACCEPT');return action(s,'DELIVER',{tradeId:s.trade.id});}
let s=g.createOrbital('TEST');check(s.schema===3&&s.cash===1200&&s.ap===12&&s.day===1,'Design economy starts with 1200Cr and 12AP');
check(g.itemDefs.length===24&&g.tools.length===6&&g.materials.length===6&&g.npcs.length===5&&g.orderDefs.length===12,'P0 content counts');
check(g.itemDefs.every(d=>d.id.startsWith('ITM-')&&d.tools.length>=2),'P0 items have independent tool evidence');
check(g.serializeOrbital(s)===g.serializeOrbital(g.createOrbital('TEST')),'Deterministic initial data');
check(g.parseOrbital(g.serializeOrbital(s))!==null,'Fresh save roundtrips');
const base=g.serializeOrbital(s);s=action(s,'ARRIVE');check(g.serializeOrbital(g.createOrbital('TEST'))===base,'Reducer is immutable');
check(s.trade.npcId==='CHR-004'&&s.trade.item.defId==='ITM-011','Captain brings the actual P0 inspection drone');
const uid=s.trade.item.uid;const honest=g.estimate(s.trade.item);let counterfeit=JSON.parse(JSON.stringify(s.trade.item));counterfeit.authentic=false;counterfeit.working=true;
check(JSON.stringify(honest)===JSON.stringify(g.estimate(counterfeit)),'Unknown estimate never leaks hidden authenticity or functionality');
s=action(s,'CHECK',{uid,tool:'TOL-001'});check(s.ap===11&&s.trade.item.evidence.length===1,'First tool reserves one appraisal AP');
const spent=s.ap;s=inspect(s,uid,g.tools.map(t=>t.id));check(s.ap===spent&&s.trade.item.evidence.length===6,'All six tool interactions share one appraisal package');
s=action(s,'CHECK',{uid,tool:'TOL-001'});check(s.ap===spent,'Reinspection is free');
check(g.estimate(s.trade.item).exact,'Two independent relevant tools narrow the estimate');
s=action(s,'OFFER',{price:50,evidence:'TOL-001'});check(s.trade.evidenceUsed.includes('TOL-001'),'Price explanation records actual evidence card');
s=action(s,'ACCEPT');const tid=s.trade.id,price=s.trade.price,beforeCash=s.cash;s=action(s,'DELIVER',{tradeId:tid});check(s.cash===beforeCash-price&&s.inventory.some(i=>i.uid===uid)&&s.ap===10,'Atomic purchase changes cash ownership and AP together');
let once=g.serializeOrbital(s);s=action(s,'DELIVER',{tradeId:tid});check(g.serializeOrbital(s)===once,'Stale delivery is idempotent');
check(s.ledger.filter(r=>r.id===tid).length===1,'One physical delivery has one ledger entry');
check(g.parseOrbital(g.serializeOrbital(s))?.inventory.some(i=>i.uid===uid),'Refresh during presentation restores committed item');
// Multi-cell moves have collision/rotation semantics rather than fixed cards.
let water=id(s,'ITM-001');const beforeXY=JSON.stringify(g.findItem(s,water));s=action(s,'MOVE',{uid:water,x:9,y:5,rotated:true});check(JSON.stringify(g.findItem(s,water))===beforeXY,'Rotated out-of-bounds drop leaves item intact');
const occupant=s.inventory.find(i=>i.uid!==water&&i.location==='warehouse');s=action(s,'MOVE',{uid:water,x:occupant.x,y:occupant.y});check(JSON.stringify(g.findItem(s,water))===beforeXY,'Occupied drop cannot overlap inventory');
s=action(s,'MOVE',{uid:water,x:7,y:4,rotated:true});check(g.findItem(s,water).rotated&&g.findItem(s,water).x===7,'Free multi-cell rotation is saved');
// Repair preview does not spend. The commit must have diagnosis and every stage.
s=inspect(s,water,['TOL-001','TOL-004']);const ap=s.ap,mats=JSON.stringify(s.materials),cash=s.cash;
s=action(s,'REPAIR',{uid:water,recipeId:'REC-001'});check(s.ap===ap&&JSON.stringify(s.materials)===mats,'Incomplete repair cannot consume AP or material');
s=action(s,'REPAIR_STEP',{uid:water,stage:2});check(!s.repairProgress[water],'Repair stages cannot be skipped');
s=repair(s,water);check(g.findItem(s,water).working&&g.findItem(s,water).repaired&&s.ap===ap-1&&s.cash===cash,'Repair commits once, keeps ownership and has no invented labor fee');
once=g.serializeOrbital(s);s=action(s,'REPAIR',{uid:water,recipeId:'REC-001'});check(g.findItem(s,water).condition===g.parseOrbital(once).inventory.find(i=>i.uid===water).condition&&s.ap===ap-1,'Repaired item cannot repeatedly gain value');
// Customer ownership must survive every pane and forbid sale/disassembly.
s=action(s,'TAKE_ORDER',{id:'ORD-001'});const o=s.orders.find(o=>o.id==='ORD-001'),customer=g.findItem(s,o.uid);check(customer.owner==='customer'&&customer.orderId==='ORD-001','Accepting a repair order creates the actual customer-owned item');
let n=s.inventory.length;s=action(s,'DISMANTLE',{uid:customer.uid});check(s.inventory.length===n,'Customer property cannot be scrapped');s=action(s,'DISPLAY',{uid:customer.uid});check(g.findItem(s,customer.uid).location!=='display','Customer property cannot be sold');
s=action(s,'DELIVER_ORDER',{id:'ORD-001',uid:water});check(s.orders.find(o=>o.id==='ORD-001').status==='active','Self-owned lookalike cannot substitute a customer original');
s=inspect(s,customer.uid,['TOL-001','TOL-004']);s.materials['MAT-002']=2;s.materials['MAT-004']=1; // Explicit fixture restock for atomic commit boundary.
s=repair(s,customer.uid);const pay=s.cash;s=action(s,'DELIVER_ORDER',{id:'ORD-001',uid:customer.uid});check(s.cash===pay+50&&s.orders.find(o=>o.id==='ORD-001').status==='done'&&!g.findItem(s,customer.uid),'Repaired original leaves inventory only when order pays');
const paid=s.cash;s=action(s,'DELIVER_ORDER',{id:'ORD-001',uid:customer.uid});check(s.cash===paid,'Order cannot reward twice');
// Assembly consumes actual main parts, not only a recipe title.
let c=g.createOrbital('CRAFT');const count=c.inventory.length;const servoUID=id(c,'ITM-026');for(let stage=0;stage<3;stage++)c=action(c,'REPAIR_STEP',{uid:servoUID,stage});c=action(c,'CRAFT',{recipeId:'REC-006'});check(c.inventory.length===count-1&&c.inventory.some(i=>i.defId==='BND-001')&&!c.inventory.some(i=>i.defId==='ITM-026'||i.defId==='ITM-027'),'Assembly consumes servo and bearing and produces one visible maintenance bundle');
const craftAP=c.ap;c=action(c,'CRAFT',{recipeId:'REC-006'});check(c.ap===craftAP,'Repeated assembly cannot generate free products');
// A complete, separate three-day route includes 12 real transactions and a customer repair.
let route=g.createOrbital('THREE-DAYS');
for(let day=1;day<=3;day++){
 check(route.day===day,'Day route remains synchronized');
 if(day===2){route=action(route,'TAKE_ORDER',{id:'ORD-002'});const order=route.orders.find(o=>o.id==='ORD-002');route=inspect(route,order.uid,['TOL-004','TOL-001']);route=repair(route,order.uid);route=action(route,'DELIVER_ORDER',{id:'ORD-002',uid:order.uid});check(route.orders.find(o=>o.id==='ORD-002').status==='done','Day two has a complete repair and service payment');}
 for(let i=0;i<4;i++)route=trade(route);
 check(route.cursor===4,'Four scheduled transactions finish per day');
 if(day===3){const disputed=route.inventory.find(it=>!it.sourceVerified);check(!!disputed,'Day three delivers an actual source-disputed batch');route=action(route,'SCAN',{uid:disputed.uid});check(route.scanned.includes(disputed.uid)&&!g.findItem(route,disputed.uid).sourceVerified,'Scan records a discrepancy without faking registration');route=action(route,'ISOLATE',{uid:disputed.uid});check(g.findItem(route,disputed.uid).location==='isolation'&&route.inspection==='cleared','Quarantine is a valid visible inspection recovery path');}
 route=action(route,'SETTLE');check(route.phase==='report'&&route.report.maintenance===20,'Daily report settles exactly twenty maintenance credits');
 if(day===3){const balance=route.cash;route=action(route,'UPGRADE',{id:'lamp'});check(route.upgrades.lamp&&route.cash===balance-120,'Third-day upgrade changes saved equipment and pays exact cost');const upgradedCash=route.cash;route=action(route,'UPGRADE',{id:'shelf'});check(!route.upgrades.shelf&&route.cash===upgradedCash,'One report cannot buy both fixed upgrade choices');}
 else route=action(route,'NEXT');
 check(g.parseOrbital(g.serializeOrbital(route))!==null,'Every route save roundtrips');
}
// Registered source requires both scan and evidence, exactly once.
let r=g.createOrbital('REGISTER');r.day=3;r=action(r,'ARRIVE');r=action(r,'ACCEPT');r=action(r,'DELIVER',{tradeId:r.trade.id});let riskItem=r.inventory.find(it=>!it.sourceVerified);r=action(r,'REGISTER',{uid:riskItem.uid});check(!g.findItem(r,riskItem.uid).sourceVerified,'Registration cannot skip scan and source evidence');r=inspect(r,riskItem.uid,['TOL-003','TOL-004']);r=action(r,'SCAN',{uid:riskItem.uid});let regCash=r.cash,regAP=r.ap;r=action(r,'REGISTER',{uid:riskItem.uid});check(r.cash===regCash-35&&r.ap===regAP-1&&g.findItem(r,riskItem.uid).sourceVerified,'Registration has a single explicit 35Cr and one AP cost');regCash=r.cash;r=action(r,'REGISTER',{uid:riskItem.uid});check(r.cash===regCash,'Re-registering cannot charge twice');
// Pawn principal is separate from service revenue and collateral ownership stays locked.
let p=g.createOrbital('PAWN');p=action(p,'ARRIVE');let pawnUID=p.trade.item.uid;p=inspect(p,pawnUID);const principal=Math.floor(g.estimate(p.trade.item).low*.4),old=p.cash;p=action(p,'PAWN',{tradeId:p.trade.id});check(p.cash===old-principal&&g.findItem(p,pawnUID).owner==='pawn','Pawn lends forty percent and locks collateral ownership');p=action(p,'DISMANTLE',{uid:pawnUID});check(g.findItem(p,pawnUID).owner==='pawn','Pawn collateral cannot be dismantled');p=action(p,'REDEEM',{uid:pawnUID});check(!g.findItem(p,pawnUID)&&p.ledger.some(x=>x.kind==='pawn-return')&&p.ledger.some(x=>x.kind==='pawn-fee'),'Redemption returns actual collateral and separates principal from fee');
// An uncertain appraisal still uses the same interval-midpoint preview as the contract.
let uncertainPawn=g.createOrbital('UNCERTAIN-PAWN');uncertainPawn=action(uncertainPawn,'ARRIVE');const uncertainUID=uncertainPawn.trade.item.uid;uncertainPawn=inspect(uncertainPawn,uncertainUID,['TOL-002','TOL-005']);const uncertainEstimate=g.estimate(uncertainPawn.trade.item),previewPrincipal=Math.floor((uncertainEstimate.low+uncertainEstimate.high)/2*.4),uncertainCash=uncertainPawn.cash;check(!uncertainEstimate.exact&&uncertainEstimate.low<uncertainEstimate.high,'Two unrelated tool records leave an honest appraisal interval');uncertainPawn=action(uncertainPawn,'PAWN',{tradeId:uncertainPawn.trade.id});check(uncertainPawn.cash===uncertainCash-previewPrincipal&&g.findItem(uncertainPawn,uncertainUID).pawnPrincipal===previewPrincipal,'Uncertain pawn pays exactly forty percent of the preview interval midpoint');
// A buyer's selected physical item stays reserved until that transaction ends.
let held=g.createOrbital('RESERVE');held=action(held,'ARRIVE');held=action(held,'REFUSE');held=action(held,'ARRIVE');const heldUID=id(held,'ITM-002');held=inspect(held,heldUID);held=action(held,'SELECT_TRADE',{uid:heldUID});const heldCount=held.inventory.length;held=action(held,'DISMANTLE',{uid:heldUID});check(held.inventory.length===heldCount&&g.parseOrbital(g.serializeOrbital(held))!==null,'A sale-reserved item cannot be dismantled from another page');held=action(held,'RETURN_ITEM',{uid:heldUID});check(g.findItem(held,heldUID)!==undefined,'Sale-reserved item cannot be simultaneously returned');
// Lease charges are periodic and collateral expiry cannot create overlapping warehouse cells.
let lease=g.createOrbital('LEASE');lease.day=7;lease.cash=2000;lease=action(lease,'SETTLE');check(lease.report.rent===450&&lease.cash===1530,'Day seven pays 450 rent plus 20 maintenance exactly once');let leaseCash=lease.cash;lease=action(lease,'SETTLE');check(lease.cash===leaseCash,'Repeated day settlement cannot pay twice');
lease=action(lease,'NEXT');lease.day=14;lease.cash=2000;lease=action(lease,'SETTLE');check(lease.report.rent===495,'Second lease cycle uses the declared escalating rent');
let ending=g.createOrbital('END');ending.day=21;ending.cash=2000;ending=action(ending,'SETTLE');check(ending.report.rent===545&&typeof ending.outcome==='string','Day twenty-one settles final rent and chooses an evidence-based business route');ending=action(ending,'NEXT');check(ending.phase==='ending','Final report enters a durable ending instead of a twenty-second day');
let expiry=g.createOrbital('EXPIRY');expiry=action(expiry,'ARRIVE');const collateral=expiry.trade.item.uid;expiry=inspect(expiry,collateral);expiry=action(expiry,'PAWN',{tradeId:expiry.trade.id});expiry.day=5;expiry=action(expiry,'SETTLE');expiry=action(expiry,'NEXT');check(g.findItem(expiry,collateral).owner==='shop'&&g.parseOrbital(g.serializeOrbital(expiry))!==null,'Expired collateral finds a collision-free owned warehouse position');
let late=g.createOrbital('LATE');late=action(late,'TAKE_ORDER',{id:'ORD-001'});const lateUID=late.orders.find(o=>o.id==='ORD-001').uid;late=action(late,'SETTLE');late=action(late,'NEXT');check(late.orders.find(o=>o.id==='ORD-001').status==='failed'&&g.findItem(late,lateUID).owner==='customer','Expired customer order retains original ownership without awarding a fee');
const lateCash=late.cash;late=action(late,'RETURN_ITEM',{uid:lateUID});check(!g.findItem(late,lateUID)&&late.cash===lateCash,'Overdue original can be returned without invented penalties or payment');
// A first insolvency preserves play and opens a finite, real-inventory clearance path.
let relief=g.createOrbital('RELIEF');relief.cash=0;relief.ap=0;relief=action(relief,'SETTLE');check(relief.phase==='open'&&relief.ledger.some(r=>r.kind==='relief-window')&&relief.cash===0,'First debt opens a zero-AP rescue without granting invented money');
const reliefItem=relief.inventory.find(i=>i.defId==='ITM-026'),reliefValue=Math.floor(g.itemValue(reliefItem)*.55);relief=action(relief,'EMERGENCY_SALE',{uid:reliefItem.uid});check(relief.cash===reliefValue&&!g.findItem(relief,reliefItem.uid)&&relief.ap===0,'Rescue sells one actual owned item at an explicit clearance value with no AP soft lock');let reliefBalance=relief.cash;relief=action(relief,'EMERGENCY_SALE',{uid:reliefItem.uid});check(relief.cash===reliefBalance,'Clearance cannot pay twice for the same physical item');relief=action(relief,'SETTLE');check(relief.phase==='report'&&relief.cash===reliefBalance-20,'Rescued shop returns to the normal day report');relief=action(relief,'NEXT');relief.cash=0;relief=action(relief,'SETTLE');check(relief.phase==='ending','Emergency credit window cannot be farmed every day');
// Save validation must not silently accept corrupted economic/state data.
for(const mutation of [v=>v.cash=NaN,v=>v.ap=13,v=>v.inventory[0].defId='ITM-999',v=>v.inventory.push(v.inventory[0]),v=>v.orders[0].status='invented',v=>v.materials['MAT-001']=-1]){const bad=JSON.parse(base);mutation(bad);check(g.parseOrbital(bad)===null,'Corrupt save rejected');}
check(g.parseOrbital('{broken')===null&&g.parseOrbital({schema:2})===null,'Broken JSON and legacy schema do not overwrite orbital progress');
console.log(`Orbital P0 model: ${checks} checks passed`);
