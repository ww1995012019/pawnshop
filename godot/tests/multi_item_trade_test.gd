extends SceneTree
const Commerce=preload("res://scripts/model/commerce.gd")
var failures:=0
func _initialize(): call_deferred("run")
func check(ok, label):
 print("MULTI ","PASS " if ok else "FAIL ",label)
 if not ok: failures+=1
func action(s: Dictionary, type: String, extra: Dictionary={}) -> Dictionary:
 return Commerce.reduce(s,{"type":type,"tradeId":s.trade.id if s.get("trade") is Dictionary else ""}.merged(extra,true))
func run():
 var s=Model.create("MULTI")
 s.inventory.clear();s.ap=10;s.cash=500
 var lots=[]
 for i in 3:
  var it=Model.new_item(s,"WCH-001",{"authentic":true,"working":true,"condition":0.9,"sourceVerified":true})
  Model.put_in(s,it);lots.append(it.uid)
 s.trade={"id":"visit-multi","npcId":"CHR-004","kind":"sell","item":null,"price":0,"rounds":0,"locked":false,"evidenceUsed":[],"line":""}
 s=action(s,"TRADE_OPEN")
 var session=TradeSession.session(s)
 session.cash=5000;session.want_count=6
 # deterministic visitor goods fixture, owned canonically by the session.
 session.goods=[]
 for i in 2:
  session.goods.append(Model.new_item(s,"WCH-002",{"owner":"npc","authentic":true,"working":true,"condition":0.8,"sourceVerified":true}))
 var visitor_uids=[session.goods[0].uid,session.goods[1].uid]
 var start_ap=s.ap;var start_cash=s.cash;var cursor=s.cursor
 for uid in lots: s=action(s,"TRADE_ADD",{"uid":uid,"direction":"sell"})
 s=action(s,"TRADE_REVIEW")
 check(TradeSession.session(s).lines.size()==3,"three recommendations create three independent rows")
 for row in TradeSession.session(s).lines: check(row.status=="ready","NPC can accept all matching goods")
 for uid in lots: s=action(s,"TRADE_CONFIRM",{"uid":uid})
 for uid in visitor_uids:
  s=action(s,"TRADE_ADD",{"uid":uid,"direction":"buy"})
  s=action(s,"TRADE_CONFIRM",{"uid":uid})
 var summary=TradeSession.summary(s)
 check(summary.sell_count==3 and summary.buy_count==2 and summary.income>0 and summary.expense>0,"both directions have gross totals")
 var version=summary.version
 var before_inventory=s.inventory.duplicate(true)
 s=action(s,"TRADE_CHECKOUT",{"version":version,"batch":"one"})
 check(s.ap==start_ap-1 and s.cash==start_cash+summary.income-summary.expense,"one AP and net cash for atomic two-way batch")
 check(s.trade!=null and s.cursor==cursor,"batch remains in same visit")
 check(s.inventory.size()==2 and Model.find_inventory(s,visitor_uids[0])!=null and Model.find_inventory(s,lots[0])==null,"exact original items transfer in opposite directions")
 var repeat=action(JSON.parse_string(JSON.stringify(s)),"TRADE_CHECKOUT",{"version":version,"batch":"one"})
 check(repeat.ap==s.ap and repeat.cash==s.cash and repeat.inventory.size()==s.inventory.size(),"duplicate saved batch cannot transfer or charge twice")
 check(s.ledger.filter(func(r):return String(r.id).begins_with("visit-multi/one/")).size()==5,"ledger retains all five gross item records")
 check(TradeSession.session(s).goods.is_empty(),"NPC cannot immediately list freshly purchased goods")
 s=action(s,"TRADE_END")
 check(s.trade==null and s.cursor==cursor+1 and s.npcTrade["CHR-004"].owned.size()==3,"only explicit end advances visit and stores NPC originals")
 # Partial rejection and negotiation isolation.
 var p=Model.create("PARTIAL");p.inventory=[];p.ap=10
 p.trade={"id":"partial","npcId":"CHR-004","kind":"sell","item":null,"price":0,"rounds":0,"locked":false,"evidenceUsed":[],"line":""}
 for i in 3: Model.put_in(p,Model.new_item(p,"WCH-001",{"condition":0.9,"authentic":true,"working":true}))
 p=action(p,"TRADE_OPEN");TradeSession.session(p).cash=5000;TradeSession.session(p).want_count=1
 for it in p.inventory: p=action(p,"TRADE_ADD",{"uid":it.uid,"direction":"sell"})
 p=action(p,"TRADE_REVIEW")
 var lines=TradeSession.session(p).lines
 check(lines[0].status=="ready" and lines[1].status=="rejected" and lines[2].status=="rejected","NPC can accept one and refuse the rest")
 var first_uid=lines[0].uid
 var other_rounds=lines[1].context.rounds
 p=action(p,"TRADE_OFFER",{"uid":first_uid,"price":999999})
 check(TradeSession.session(p).lines[0].context.rounds==0,"invalid price consumes no valid negotiation")
 var offer=Model.trade_terms(p,TradeSession.session(p).lines[0].context,p.inventory[0]).ceiling+1
 p=action(p,"TRADE_OFFER",{"uid":first_uid,"price":offer})
 check(TradeSession.session(p).lines[0].context.rounds==1 and TradeSession.session(p).lines[1].context.rounds==other_rounds,"valid offer affects only its own row")
 p=action(p,"TRADE_REMOVE",{"uid":first_uid})
 p=action(p,"TRADE_ADD",{"uid":first_uid,"direction":"sell"})
 check(TradeSession.row(p,first_uid).context.rounds==1,"remove and re-add preserves negotiation history")
 # Stale version and physical mutations reject an entire checkout.
 p=action(p,"TRADE_REVIEW")
 var ready=TradeSession.session(p).lines.filter(func(r):return r.status=="ready")[0]
 p=action(p,"TRADE_CONFIRM",{"uid":ready.uid})
 var pv=TradeSession.summary(p).version
 var old_cash=p.cash;var old_ap=p.ap;var old_count=p.inventory.size()
 var stale=action(p,"TRADE_CHECKOUT",{"version":pv-1,"batch":"stale"})
 check(stale.cash==old_cash and stale.ap==old_ap and stale.inventory.size()==old_count,"stale batch changes no money, AP or ownership")
 Model.find_inventory(p,ready.uid).condition=0.1
 var dirty=action(p,"TRADE_CHECKOUT",{"version":pv,"batch":"dirty"})
 check(dirty.cash==old_cash and dirty.ap==old_ap and dirty.inventory.size()==old_count,"modified confirmed original rejects complete batch")
 var closed=p.duplicate(true);closed.phase="closed"
 var blocked=action(closed,"TRADE_REVIEW")
 check(blocked.notice.contains("打烊"),"closed actions explain refusal")
 # Same fixture: accept zero under no budget, preserve per-object knowledge after reordering.
 var zero=p.duplicate(true)
 TradeSession.session(zero).cash=0
 for entry in TradeSession.session(zero).lines: entry.selected=false;entry.status="queued"
 zero=action(zero,"TRADE_REVIEW")
 check(TradeSession.session(zero).lines.all(func(r):return r.status in ["rejected","blocked"]),"NPC can refuse every recommendation when budget is insufficient")
 var reordered=action(zero,"TRADE_REORDER",{"uid":first_uid,"shift":-1})
 check(TradeSession.row(reordered,first_uid).context.rounds==1,"reordering never refreshes per-item negotiation history")
 # All-or-nothing packing, zero AP and zero cash checks.
 var packing=Model.create("PACKING");packing.ap=10;packing.cash=10000;packing.inventory=[]
 packing.trade={"id":"packing-visit","npcId":"CHR-004","kind":"sell","item":null,"price":0,"rounds":0,"locked":false,"evidenceUsed":[],"line":""}
 packing=action(packing,"TRADE_OPEN");TradeSession.session(packing).cash=5000
 var purchase=Model.new_item(packing,"WCH-002",{"owner":"npc","condition":0.8,"authentic":true,"working":true})
 TradeSession.session(packing).goods=[purchase]
 packing=action(packing,"TRADE_ADD",{"uid":purchase.uid,"direction":"buy"})
 packing=action(packing,"TRADE_CONFIRM",{"uid":purchase.uid})
 for i in 100:
  if not Model.put_in(packing,Model.new_item(packing,"WCH-001",{"working":true})): break
 var pack_count=packing.inventory.size();var pack_cash=packing.cash
 var full=action(packing,"TRADE_CHECKOUT",{"version":TradeSession.summary(packing).version,"batch":"full"})
 check(full.inventory.size()==pack_count and full.cash==pack_cash and full.ap==packing.ap and full.notice.contains("后仓"),"insufficient final packing rolls back all money, goods and AP")
 var no_ap=packing.duplicate(true);no_ap.ap=0
 var denied=action(no_ap,"TRADE_CHECKOUT",{"version":TradeSession.summary(no_ap).version,"batch":"no-ap"})
 check(denied.cash==no_ap.cash and denied.inventory.size()==pack_count and denied.notice.contains("AP"),"zero AP explains failure and does not move originals")
 var no_cash=packing.duplicate(true);no_cash.cash=0
 var poor=action(no_cash,"TRADE_CHECKOUT",{"version":TradeSession.summary(no_cash).version,"batch":"no-cash"})
 check(poor.cash==0 and poor.ap==no_cash.ap and poor.notice.contains("现金"),"insufficient net funds reject complete batch")
 var focused=action(packing,"TRADE_FOCUS",{"uid":purchase.uid})
 check(Model.find_item(focused,purchase.uid)!=null and Model.trade_item(focused).uid==purchase.uid,"NPC's actual item is reachable by the existing inspection workbench")
 # A checkout belongs to its original visitor, even when another visit has the same list version.
 var next_visit=packing.duplicate(true);next_visit.inventory=[];next_visit.trade.id="different-visit"
 var wrong_visit=action(next_visit,"TRADE_CHECKOUT",{"tradeId":"packing-visit","version":TradeSession.summary(next_visit).version,"batch":"replayed"})
 check(wrong_visit.cash==next_visit.cash and wrong_visit.ap==next_visit.ap and wrong_visit.inventory.is_empty(),"a replay from another visit cannot settle a matching-version list")
 var risky=packing.duplicate(true);risky.inventory=[]
 var risky_lot=TradeSession.session(risky).goods[0];risky_lot.sourceVerified=false
 var risky_row=TradeSession.row(risky,risky_lot.uid);risky_row.fingerprint=TradeSession.fingerprint(risky_lot)
 var before_risk=risky.risk
 var unverified=action(risky,"TRADE_CHECKOUT",{"version":TradeSession.summary(risky).version,"batch":"unverified"})
 check(unverified.risk==minf(100,before_risk+12),"batch purchase preserves existing unverified-source risk")
 # Merchant material payments share the same cash pool as watch recommendations.
 var merchant=Model.create("MATERIAL-POOL");merchant.trade={"id":"material-pool","npcId":"CHR-010","kind":"merchant","stock":{"MAT-001":5},"rare":null,"item":null,"price":0,"rounds":0,"locked":false,"evidenceUsed":[]}
 merchant=action(merchant,"TRADE_OPEN")
 var before_pool=TradeSession.session(merchant).cash
 var material=Commerce.reduce(merchant,{"type":"BUY_MATERIAL","id":"MAT-001","qty":1})
 check(TradeSession.session(material).cash==before_pool+GameData.material("MAT-001").price,"material sale proceeds increase the same NPC cash pool")
 var reward_before=unverified.relations.salvage
 var ended=action(unverified,"TRADE_END")
 check(ended.relations.salvage==minf(100,reward_before+2),"buying-only visit earns one normal relationship reward")
 var funded=packing.duplicate(true);funded.inventory=[];TradeSession.session(funded).cash=0
 var to_sell=Model.new_item(funded,"WCH-001",{"condition":0.8,"working":true,"authentic":true})
 Model.put_in(funded,to_sell)
 funded=action(funded,"TRADE_ADD",{"uid":to_sell.uid,"direction":"sell"})
 funded=action(funded,"TRADE_REVIEW")
 funded=action(funded,"TRADE_CONFIRM",{"uid":to_sell.uid})
 check(TradeSession.row(funded,to_sell.uid).selected,"confirmed purchase can fund an accepted sale in the same atomic batch")
 funded=action(funded,"TRADE_REMOVE",{"uid":purchase.uid})
 check(not TradeSession.row(funded,to_sell.uid).selected and TradeSession.row(funded,to_sell.uid).reason.contains("资金分配"),"removing funding marks the affected sale for explicit reconfirmation")
 print("MULTI failures=",failures)
 quit(1 if failures else 0)
