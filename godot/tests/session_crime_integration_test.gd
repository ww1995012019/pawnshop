extends "res://tests/night_crime_test.gd"
func batch(s: Dictionary, type: String, extra := {}) -> Dictionary:
 if type=="GRAY_TRADE" and not TradeSession.session(s).is_empty():
  extra=extra.duplicate(true)
  extra.version=TradeSession.summary(s).version
  extra.quote=NightCrime.gray_quote(TradeSession.item(s,extra.uid),extra.price)
 return act(s,type,{"tradeId":s.trade.id}.merged(extra,true))
func checkout(s: Dictionary, id: String) -> Dictionary:
 return batch(s,"TRADE_CHECKOUT",{"version":TradeSession.summary(s).version,"batch":id})
func return_seed() -> String:
 for n in 100000:
  var seed := "LOOP-%d" % n
  if Model.fnv("%s/night/theft/3" % seed)%10000<300 and Model.fnv("%s/fence/return/5" % seed)%100<20 and Model.fnv("%s/police/inspection/6" % seed)%100<8:
   return seed
 return ""
func police_session_stock_test(report_type: String) -> void:
 var state:=find_fence(theft_campaign(false))
 var lost: String=state.trade.item.uid
 var seller: String=state.trade.npcId
 var legal:=Model.new_item(state,"WCH-002",{"sourceVerified":true,"authentic":true,"working":true,"condition":1.0})
 Model.put_in(state,legal)
 state=batch(state,"TRADE_OPEN");TradeSession.session(state).cash=5000;TradeSession.session(state).want_count=6
 state=batch(state,"TRADE_ADD",{"uid":legal.uid,"direction":"sell"});state=batch(state,"TRADE_REVIEW")
 state=batch(state,"TRADE_CONFIRM",{"uid":legal.uid});state=checkout(state,"police-end-legal-sale")
 check(TradeSession.session(state).acquired.any(func(lot):return lot.uid==legal.uid),report_type+" fixture actually completed legal batch sale")
 state=batch(state,"TRADE_FOCUS",{"uid":lost});state=act(state,"CHECK",{"uid":lost,"tool":"TOL-002"})
 var expected_cash: float=state.cash
 var expected_relations: Dictionary=state.relations.duplicate(true)
 if report_type=="REPORT_VISITOR":
  # Existing wanted fixture identifies the real culprit of the generated theft.
  state.police.issued=true;state.police.wanted=[state.nightCrime.cases[0].culprit]
  expected_cash+=WantedCases.profile(state.nightCrime.cases[0].culprit).reward
  expected_relations.station=Model.clampn(expected_relations.station+3)
 var npc_cash: float=TradeSession.session(state).cash
 var cursor: int=state.cursor
 var ap: float=state.ap
 var visit_id: String=state.trade.id
 state=JSON.parse_string(JSON.stringify(state))
 state=batch(state,report_type)
 check(state.trade==null and state.npcTrade[seller].owned.filter(func(lot):return lot.uid==legal.uid).size()==1 and Model.find_inventory(state,legal.uid)==null,report_type+" preserves completed legal sale in one NPC stock holder")
 check(state.npcTrade[seller].owned.all(func(lot):return lot.uid!=lost) and state.inventory.filter(func(lot):return lot.uid==lost).size()==1,report_type+" excludes recovered original from persisted NPC holdings")
 check(state.cursor==cursor+1 and state.cash==expected_cash and state.npcTrade[seller].cash==npc_cash,report_type+" finalization preserves cash pool and advances visitor once")
 check(state.ap==ap and expected_relations.keys().all(func(faction):return float(state.relations[faction])==float(expected_relations[faction])),report_type+" stock finalization adds no action cost or relationship reward")
 var replay:=act(state,report_type,{"tradeId":visit_id})
 check(replay.cash==state.cash and replay.cursor==state.cursor and replay.npcTrade[seller].owned.filter(func(lot):return lot.uid==legal.uid).size()==1,report_type+" replay cannot repeat payment, visitor advance or stock persistence")

func run() -> void:
 var s:=find_fence(theft_campaign(false))
 var uid: String=s.trade.item.uid
 s=batch(s,"TRADE_OPEN")
 var before: float=s.cash
 var risk: float=s.risk
 s=batch(s,"TRADE_CONFIRM",{"uid":uid})
 var blocked:=checkout(s,"unconfirmed")
 check(Model.find_inventory(blocked,uid)==null and blocked.cash==before,"batch cannot purchase unconfirmed gray original")
 s=batch(s,"GRAY_TRADE",{"uid":uid,"confirmed":true,"price":TradeSession.row(s,uid).context.price})
 var quoted: float=TradeSession.row(s,uid).context.price
 var changed:=batch(s,"TRADE_OFFER",{"uid":uid,"price":quoted+1})
 check(TradeSession.row(changed,uid).context.rounds==TradeSession.row(s,uid).context.rounds,"gray consent cannot authorize a different captured quote")
 s=batch(s,"TRADE_CONFIRM",{"uid":uid})
 var second:=Model.new_item(s,"WCH-001",{"owner":"npc","sourceVerified":false,"authentic":true,"working":true,"condition":0.8})
 TradeSession.session(s).goods.append(second)
 s=batch(s,"TRADE_ADD",{"uid":second.uid,"direction":"buy"})
 s=batch(s,"TRADE_CONFIRM",{"uid":second.uid})
 check(not TradeSession.row(s,second.uid).selected,"one gray row consent never authorizes a different batch original")
 s=batch(s,"GRAY_TRADE",{"uid":second.uid,"confirmed":true,"price":TradeSession.row(s,second.uid).context.price})
 s=batch(s,"TRADE_CONFIRM",{"uid":second.uid})
 s=checkout(s,"purchase")
 check(Model.find_inventory(s,uid)!=null and s.nightCrime.cases[0].items[0].holder=="inventory","batch purchase moves tracked original into canonical inventory")
 check(s.risk==mini(100,risk+8),"confirmed gray batch charges eight risk exactly once")
 var repeat:=checkout(s,"purchase")
 check(repeat.cash==s.cash and repeat.risk==s.risk,"replaying batch never repeats payment or gray risk")
 s=batch(s,"TRADE_END")
 check(not s.npcTrade.values().any(func(record):return record.owned.any(func(it):return it.uid==uid)),"purchased original is absent from NPC storage after end")
 # A later ordinary visitor accepts the same original through the batch sale path.
 s.trade={"id":"crime-batch-buyer","npcId":"CHR-004","kind":"sell","item":null,"price":0,"rounds":0,"locked":false,"evidenceUsed":[]}
 s=batch(s,"TRADE_OPEN")
 TradeSession.session(s).cash=5000;TradeSession.session(s).want_count=6
 s=batch(s,"TRADE_ADD",{"uid":uid,"direction":"sell"})
 s=batch(s,"TRADE_REVIEW")
 var line:=TradeSession.row(s,uid)
 check(not line.is_empty(),"gray original can be recommended without laundering source")
 if not line.is_empty():
  s=batch(s,"GRAY_TRADE",{"uid":uid,"confirmed":true,"price":line.context.price})
  s=batch(s,"TRADE_CONFIRM",{"uid":uid})
  s=checkout(s,"sale")
  check(Model.find_inventory(s,uid)==null and s.nightCrime.cases[0].items[0].holder=="buyer","batch sale retains historic tracked handling")
 s=batch(s,"TRADE_END")
 # Wait through natural daily schedules until a real inspector resolves past handling.
 for _day in 16:
  if NightCrime.inspection_pending(s): break
  s=act(close(s),"NEXT")
 s=act(s,"ARRIVE_INSPECTION")
 check(s.trade!=null and s.trade.get("inspectionVisit",false),"later naturally scheduled inspector arrives")
 if s.trade!=null and s.trade.get("inspectionVisit",false):
  var inspector_id: String=s.trade.id
  var refused:=batch(s,"TRADE_OPEN")
  refused=batch(refused,"TRADE_END")
  check(refused.trade!=null and refused.trade.id==inspector_id and TradeSession.session(refused).is_empty(),"batch controls cannot wrap or dismiss inspection")
  s=batch(s,"RESOLVE_INSPECTION")
  check(s.nightCrime.lastInspection.implicated.has(uid) and s.nightCrime.cases[0].items[0].get("liabilityResolved",false),"inspection finds historical batch handling without second inventory confiscation")
 # End an unpurchased fence session, including JSON save/reload.
 s=find_fence(theft_campaign(false));uid=s.trade.item.uid
 s=batch(s,"TRADE_OPEN")
 s=JSON.parse_string(JSON.stringify(s))
 s=batch(s,"TRADE_END")
 check(s.nightCrime.cases[0].items[0].holder=="case" and not s.npcTrade.values().any(func(record):return record.owned.any(func(it):return it.uid==uid)),"unsold fenced UID returns to case exactly once rather than NPC goods")
 # Insurance title survives an insured original purchased through a batch.
 s=find_fence(theft_campaign(true));uid=s.trade.item.uid
 s=batch(s,"TRADE_OPEN")
 s=batch(s,"GRAY_TRADE",{"uid":uid,"confirmed":true,"price":TradeSession.row(s,uid).context.price})
 s=batch(s,"TRADE_CONFIRM",{"uid":uid});s=checkout(s,"insured")
 s=batch(s,"TRADE_END")
 s.trade={"id":"insured-sale","npcId":"CHR-004","kind":"sell","item":null,"price":0,"rounds":0,"locked":false,"evidenceUsed":[]}
 s=batch(s,"TRADE_OPEN");TradeSession.session(s).cash=5000;TradeSession.session(s).want_count=6
 s=batch(s,"TRADE_ADD",{"uid":uid,"direction":"sell"});s=batch(s,"TRADE_REVIEW")
 s=batch(s,"GRAY_TRADE",{"uid":uid,"confirmed":true,"price":TradeSession.row(s,uid).context.price})
 s=batch(s,"TRADE_CONFIRM",{"uid":uid});s=checkout(s,"insured-sale");s=batch(s,"TRADE_END")
 check(s.npcTrade["CHR-004"].owned.filter(func(lot):return lot.uid==uid).size()==1,"sold original has one persistent NPC owner")
 var next_id:=""
 for n in 20:
  next_id="insured-return-%d" % n
  if Model.fnv(String(s.seed)+next_id+"/goods")%4==3: break
 s.trade={"id":next_id,"npcId":"CHR-004","kind":"sell","item":null,"price":0,"rounds":0,"locked":false,"evidenceUsed":[]}
 s=batch(s,"TRADE_OPEN")
 if not TradeSession.session(s).goods.any(func(lot):return lot.uid==uid):
  s=batch(s,"TRADE_END")
  var later_id:=""
  for n in 20:
   later_id=next_id+"-later-"+str(n)
   if Model.fnv(String(s.seed)+later_id+"/goods")%4>0: break
  s.trade={"id":later_id,"npcId":"CHR-004","kind":"sell","item":null,"price":0,"rounds":0,"locked":false,"evidenceUsed":[]}
  s=batch(s,"TRADE_OPEN")
 check(TradeSession.session(s).goods.filter(func(lot):return lot.uid==uid).size()==1 and s.nightCrime.cases[0].items[0].holder=="trade","NPC resale reloads same insured UID into one canonical trade holder")
 # Ending an ordinary NPC resale after reload must retain that NPC's original stock/title.
 var unsold: Dictionary=JSON.parse_string(JSON.stringify(s))
 var title: Dictionary=unsold.nightCrime.cases[0].items[0].duplicate(true)
 unsold=batch(unsold,"TRADE_OPEN") # Reopening the same list must not overwrite its return holder.
 unsold=batch(unsold,"TRADE_END")
 var returned: Dictionary=unsold.nightCrime.cases[0].items[0]
 check(returned.holder=="buyer" and unsold.npcTrade["CHR-004"].owned.filter(func(lot):return lot.uid==uid).size()==1,"reloaded unsold NPC resale returns one original to buyer stock rather than thief case")
 check(returned.paid and returned.payout==title.payout and returned.get("originalLawful",false)==title.get("originalLawful",false) and not returned.resolved,"unsold NPC resale preserves canonical insurer title and unresolved original")
 for n in 10:
  unsold.trade={"id":"insured-unsold-return-%d" % n,"npcId":"CHR-004","kind":"sell","item":null,"price":0,"rounds":0,"locked":false,"evidenceUsed":[]}
  unsold=batch(unsold,"TRADE_OPEN")
  if TradeSession.session(unsold).goods.any(func(lot):return lot.uid==uid): break
  unsold=batch(unsold,"TRADE_END")
 check(TradeSession.session(unsold).get("goods",[]).filter(func(lot):return lot.uid==uid).size()==1 and unsold.nightCrime.cases[0].items[0].holder=="trade","later NPC visit offers the same unsold insured original once")
 unsold=JSON.parse_string(JSON.stringify(unsold))
 if unsold.trade!=null: unsold=batch(unsold,"TRADE_END")
 var copies:=0
 for record in unsold.npcTrade.values(): copies+=record.owned.filter(func(lot):return lot.uid==uid).size()
 check(unsold.nightCrime.cases[0].items[0].holder=="buyer" and copies==1 and Model.find_inventory(unsold,uid)==null,"later reloaded visit end keeps one NPC holder and no inventory or case reassignment")
 NightCrime.arrest(s,s.nightCrime.cases[0].culprit)
 check(Model.find_inventory(s,uid)==null and s.nightCrime.cases[0].items[0].holder=="insurer" and not TradeSession.session(s).goods.any(func(it):return it.uid==uid),"insurer recovers bought original without duplicated live session copy")
 # Premium appearance affects buyer belief, never insurance's true market valuation.
 s=fresh();s.inventory=[]
 var it:=Model.new_item(s,"WCH-001",{"authentic":true,"working":true,"condition":0.9,"sourceVerified":true})
 Model.put_in(s,it)
 var value:=Model.item_value(it)
 var targets:=WatchForgery.compatible_targets(it)
 it.forgery={"version":2,"targetId":targets[-1],"methods":{}}
 WatchForgery.apply(it,"case");WatchForgery.apply(it,"logo");WatchForgery.apply(it,"serial")
 check(WatchForgery.appearance_id(it)!=it.defId and NightCrime.insurance_quote(s).total==value,"premium external appearance cannot inflate insurance true value")
 police_session_stock_test("REPORT_LOST_ITEM")
 police_session_stock_test("REPORT_VISITOR")
 print("SESSION CRIME failures=",failures)
 quit(1 if failures else 0)
