const assert=require('node:assert/strict'),path=require('node:path');
const g=require(path.join(process.argv[2],'model.js')),n=require(path.join(process.argv[2],'Negotiation.js'));
let checks=0;function ok(v,msg){assert.ok(v,msg);checks++;}
const a=(s,type,args={})=>g.reduceOrbital(s,{type,...args});
function buyer(seed='BOUNDS'){let s=g.createOrbital(seed);s=a(s,'ARRIVE');s=a(s,'REFUSE');s=a(s,'ARRIVE');return s;}
function select(s,id='ITM-002'){return a(s,'SELECT_TRADE',{uid:s.inventory.find(i=>i.defId===id).uid});}
let s=select(buyer()),cash=s.cash,uid=s.trade.selectedUid;
s=a(s,'OFFER',{price:9999999});ok(!s.trade.locked&&s.trade.rounds===0,'out-of-range offer is rejected without exhausting patience');
ok(s.trade.price<100,'huge offer cannot poison the counterquote');s=a(s,'ACCEPT');s=a(s,'DELIVER',{tradeId:s.trade.id});ok(s.cash-cash<100&&s.cash>cash,'accept after a rejected extreme quote only sells at the bounded NPC offer');
s=a(g.createOrbital('LOWBALL'),'ARRIVE');let floor=n.tradeTerms(s,s.trade,s.trade.item).floor;
s=a(s,'OFFER',{price:1});ok(!s.trade.locked&&s.trade.price>=floor,'one-Cr offer never drags seller below its floor');
s=a(s,'OFFER',{price:1});ok(s.trade===null&&s.cursor===1,'repeated insulting lowballs make seller leave');ok(s.cash===1200&&s.ap===12,'walking away leaves cash and AP unchanged');
s=select(buyer());let ceiling=n.tradeTerms(s,s.trade,n.tradeItem(s)).ceiling;
for(let i=0;i<3&&s.trade;i++){s=a(s,'OFFER',{price:90});if(s.trade)ok(s.trade.price<=ceiling,'all buyer counterquotes obey budget');}
ok(s.trade===null,'three rejected offers end the meeting');
s=select(buyer());uid=s.trade.selectedUid;s=a(s,'CHECK',{uid,tool:'TOL-001'});s=a(s,'OFFER',{price:70,evidence:'TOL-001'});let rounds=s.trade?.rounds;
s=select(s,'ITM-003');ok(s.trade.evidenceUsed.length===0&&s.trade.rounds===rounds,'switching goods clears old evidence but preserves spent patience');
s=a(s,'SELECT_TRADE',{uid:s.trade.selectedUid});ok(s.trade.rounds===rounds,'reselecting cannot reset patience');
s=a(g.createOrbital('NO-AP'),'ARRIVE');s.ap=0;s=a(s,'ACCEPT');ok(!s.trade.locked,'zero AP cannot lock an unfulfillable deal');s=a(s,'REFUSE');s=a(s,'SETTLE');ok(s.phase==='report','zero AP trade can be cancelled and settled');
s=a(g.createOrbital('WALLET'),'ARRIVE');s.cash=20;s=a(s,'OFFER',{price:100});ok(!s.trade.locked&&s.trade.rounds===0,'offers above player cash do not commit or spend a round');
s=select(buyer());s=a(s,'ACCEPT');let saved=JSON.parse(g.serializeOrbital(s));saved.trade.price=9999999;let restored=g.parseOrbital(saved);ok(restored&&restored.cash===s.cash&&!restored.trade.locked&&restored.trade.price<100,'legacy poisoned quotes are migrated without erasing progress');
saved.trade.price=0;restored=g.parseOrbital(saved);ok(restored&&!restored.trade.locked&&restored.trade.price>0,'zero-price edited quote cannot restore as a locked free trade');
s=select(buyer());s=a(s,'ACCEPT');const tid=s.trade.id;s=a(s,'DELIVER',{tradeId:tid});cash=s.cash;s=a(s,'DELIVER',{tradeId:tid});ok(s.cash===cash,'stale delivery is idempotent');
s=buyer('NEEDS');s.trade.npcId='CHR-003';s=a(s,'SELECT_TRADE',{uid:s.inventory.find(i=>i.defId==='ITM-001').uid});ok(!s.trade.selectedUid,'station buyer rejects broken equipment');
s=select(buyer('COMMIT'));s=a(s,'ACCEPT');s.inventory.find(i=>i.uid===s.trade.selectedUid).sealed=true;cash=s.cash;s=a(s,'DELIVER',{tradeId:s.trade.id});ok(s.cash===cash&&!!s.trade,'final commit rechecks sealed status');
for(const seed of ['ORBITAL-P0','DECK-B','DECK-C'])for(let day=1;day<=21;day++)for(let cursor=0;cursor<6;cursor+=2){
 let visit=g.createOrbital(seed);visit.day=day;visit.cursor=cursor;visit=a(visit,'ARRIVE');
 ok(n.priceAgreed(visit,visit.trade,visit.trade.item),'every generated seller honors its own opening ask');
 const restored=g.parseOrbital(g.serializeOrbital(visit));ok(restored&&restored.trade.price===visit.trade.price,'refresh does not change a legitimate opening offer');
}
for(const price of [-1,0,1.5,NaN,Infinity,9999999]){s=select(buyer());const original=g.serializeOrbital(s.trade);s=a(s,'OFFER',{price});ok(g.serializeOrbital(s.trade)===original,'invalid amount cannot alter the quote or spend patience');}
console.log(`Negotiation: ${checks} checks passed`);
