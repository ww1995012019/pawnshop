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
 print("SESSION CRIME failures=",failures)
 quit(1 if failures else 0)
