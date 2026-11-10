extends SceneTree
const Commerce=preload("res://scripts/model/commerce.gd")
var failures:=0
func _initialize(): call_deferred("run")
func check(ok,label):
 print("DIALOGUE ","PASS " if ok else "FAIL ",label)
 if not ok: failures+=1
func verb(s: Dictionary,type: String,extra: Dictionary={}) -> Dictionary:
 var v=TradeSession.summary(s).version
 return Commerce.reduce(s,{"type":type,"tradeId":s.trade.id,"uid":TradeSession.session(s).focus,"version":v,"batch":"counter-"+str(v)}.merged(extra,true))
func offer_fixture(direction: String) -> Dictionary:
 var s=Model.create("SUBMITTED-OFFER");s.ap=12;s.cash=5000
 var lot=Model.new_item(s,"WCH-001",{"owner":"npc","authentic":true,"working":true,"condition":0.9,"sourceVerified":true})
 s.trade={"id":"submitted-offer","npcId":"CHR-004","kind":"buy","item":lot,"price":100,"rounds":0,"locked":false,"evidenceUsed":[],"line":""}
 s=CounterDialogue.begin(s)
 TradeSession.session(s).cash=5000;TradeSession.session(s).want_count=6
 if direction=="sell":
  var stock=Model.new_item(s,"WCH-001",{"authentic":true,"working":true,"condition":0.9,"sourceVerified":true})
  Model.put_in(s,stock)
  s=Commerce.reduce(s,{"type":"SELECT_TRADE","uid":stock.uid})
 return s
func submitted_offer_tests() -> void:
 # Missing confirmation must fail here; agreement itself never transfers the original.
 for direction in ["buy","sell"]:
  var s=offer_fixture(direction)
  var uid: String=TradeSession.session(s).focus
  var price: float=100 if direction=="buy" else 1
  var inventory: Array=s.inventory.duplicate(true)
  var goods: Array=TradeSession.session(s).goods.duplicate(true)
  var cash=s.cash;var ap=s.ap
  var stale_delivery=CounterDialogue.action_for(s,"DELIVER")
  var submitted=CounterDialogue.action_for(s,"OFFER",{"price":price})
  s=Commerce.reduce(s,submitted)
  check(s.trade.locked and CounterDialogue.current(s).selected and CounterDialogue.current(s).status=="confirmed" and s.trade.price==price,"accepted submitted "+direction+" offer immediately locks its exact price")
  check(s.cash==cash and s.ap==ap and s.inventory==inventory and TradeSession.session(s).goods==goods,"agreed "+direction+" offer leaves cash AP and original ownership unchanged")
  var stale=Commerce.reduce(s,stale_delivery)
  check(stale.cash==cash and stale.ap==ap and stale.inventory==inventory,"pre-agreement "+direction+" delivery token cannot settle the new agreement")
  var repeated=Commerce.reduce(s,submitted)
  check(TradeSession.summary(repeated).version==TradeSession.summary(s).version and repeated.trade.price==price,"replayed "+direction+" offer cannot revise the locked agreement")
  var delivery=CounterDialogue.action_for(s,"DELIVER")
  s=Commerce.reduce(s,delivery)
  check(s.ap==ap-1 and s.cash==cash+(-price if direction=="buy" else price) and (Model.find_inventory(s,uid)!=null if direction=="buy" else Model.find_inventory(s,uid)==null),"explicit deliver alone settles accepted "+direction+" offer")
  repeated=Commerce.reduce(s,delivery)
  check(repeated.cash==s.cash and repeated.ap==s.ap and repeated.inventory==s.inventory,"accepted "+direction+" offer delivery cannot settle twice")
 # A valid NPC counter can become ready during judgement but still needs consent.
 var counter=offer_fixture("buy")
 var before=counter.duplicate(true)
 counter=verb(counter,"OFFER",{"price":1})
 check(counter.trade.price>1 and not counter.trade.locked and not CounterDialogue.current(counter).selected and TradeSession.summary(counter).buy_count==0,"different NPC counterprice still requires explicit acceptance")
 var no_delivery=verb(counter,"DELIVER")
 check(no_delivery.cash==before.cash and no_delivery.ap==before.ap and no_delivery.inventory==before.inventory,"unaccepted counteroffer cannot be delivered")
 var accepted=verb(counter,"ACCEPT")
 check(accepted.trade.locked and accepted.trade.price==counter.trade.price and accepted.cash==before.cash and accepted.ap==before.ap,"explicit accept locks a counteroffer without payment")
 for round_index in 2: counter=verb(counter,"OFFER",{"price":1})
 var exhausted=verb(counter,"OFFER",{"price":100})
 check(counter.trade.rounds==3 and exhausted.trade.rounds==3 and not exhausted.trade.locked,"fourth offer cannot bypass the three-round limit into agreement")
 var budget=offer_fixture("sell")
 TradeSession.session(budget).cash=0
 budget=verb(budget,"OFFER",{"price":1})
 check(not budget.trade.locked and TradeSession.summary(budget).sell_count==0,"accepted price cannot bypass the NPC budget guard")
 var reduced=offer_fixture("sell")
 TradeSession.session(reduced).cash=1
 reduced=verb(reduced,"OFFER",{"price":2})
 check(reduced.trade.price==1 and not reduced.trade.locked and TradeSession.summary(reduced).sell_count==0,"budget counterprice does not inherit consent for the submitted price")
 reduced=verb(reduced,"ACCEPT")
 check(reduced.trade.locked and reduced.trade.price==1,"budget counterprice can be accepted explicitly")
 var quantity=offer_fixture("sell")
 TradeSession.session(quantity).want_count=0
 quantity=verb(quantity,"OFFER",{"price":1})
 check(not quantity.trade.locked and TradeSession.summary(quantity).sell_count==0,"accepted price cannot bypass the NPC quantity guard")
 var invalid=offer_fixture("buy")
 var untouched_version=TradeSession.summary(invalid).version
 invalid=verb(invalid,"OFFER",{"price":0})
 check(invalid.trade.rounds==0 and not invalid.trade.locked and TradeSession.summary(invalid).version==untouched_version,"invalid offer neither spends a round nor creates agreement")
 var stale_offer=CounterDialogue.action_for(invalid,"OFFER",{"price":100,"version":untouched_version-1})
 invalid=Commerce.reduce(invalid,stale_offer)
 check(invalid.trade.rounds==0 and not invalid.trade.locked,"stale offer version cannot create agreement")
 stale_offer=CounterDialogue.action_for(invalid,"OFFER",{"price":100,"uid":"another-original"})
 invalid=Commerce.reduce(invalid,stale_offer)
 check(invalid.trade.rounds==0 and not invalid.trade.locked,"offer for a different original cannot create agreement")
func run():
 submitted_offer_tests()
 var s=Model.create("NATURAL-DIALOGUE");s.ap=12;s.cash=5000
 s=Commerce.reduce(s,{"type":"ARRIVE"})
 check(CounterDialogue.active(s),"ordinary arrival automatically enables natural multi-item conversation")
 var id: String=s.trade.id
 var first: String=Model.trade_item(s).uid
 check(s.trade.kind=="buy" and CounterDialogue.table_items(s).any(func(shown):return shown.uid==first and shown.price==s.trade.price),"NPC originals and asking prices are already on the desk at arrival")
 TradeSession.session(s).cash=5000;TradeSession.session(s).want_count=6
 for it in s.inventory: it.working=true;it.authentic=true;it.sourceVerified=true;it.condition=0.9
 s=verb(s,"ACCEPT")
 check(s.trade.locked and TradeSession.summary(s).buy_count==1,"normal accept remembers NPC lot without another trade UI")
 var uid: String=s.inventory[0].uid
 s=Commerce.reduce(s,{"type":"SELECT_TRADE","uid":uid})
 check(s.trade.kind=="sell" and Model.trade_item(s).uid==uid and CounterDialogue.current(s).status in ["ready","counter"],"presenting shop stock immediately elicits buyer response")
 s=verb(s,"ACCEPT")
 var second: String=s.inventory[1].uid
 s=Commerce.reduce(s,{"type":"SELECT_TRADE","uid":second})
 s=verb(s,"ACCEPT")
 var totals=TradeSession.summary(s)
 check(totals.sell_count==2 and totals.buy_count==1,"different recommendations and NPC's lot are remembered through ordinary dialogue")
 var ap=s.ap;var cash=s.cash
 var delivery={"type":"DELIVER","tradeId":id,"version":TradeSession.summary(s).version,"batch":"counter-"+str(TradeSession.summary(s).version)}
 s=Commerce.reduce(s,delivery)
 check(s.trade!=null and s.trade.id==id and s.ap==ap-1 and s.cash==cash+totals.net,"normal deliver settles agreed originals once and keeps same NPC")
 check(Model.find_inventory(s,first)!=null and Model.find_inventory(s,uid)==null and Model.find_inventory(s,second)==null,"bidirectional settlement transfers exact originals")
 var again=Commerce.reduce(s,delivery)
 check(again.ap==s.ap and again.cash==s.cash,"repeated normal delivery cannot duplicate charges or goods")
 var bad=Model.new_item(s,"WCH-001",{"sourceVerified":true,"sealed":true});Model.put_in(s,bad)
 var rejected=Commerce.reduce(s,{"type":"SELECT_TRADE","uid":bad.uid})
 check(rejected.trade.id==id and rejected.trade.line.contains(TradeSession._stock_problem(s,bad,"sell")),"unavailable recommendation is refused in the same conversation")
 var ended=Commerce.reduce(s,{"type":"REFUSE"})
 check(ended.trade==null and ended.cursor==s.cursor+1,"explicit send-off is the only normal visit end")
 var old=Model.create("OLD-LIST");old=Model.reduce(old,{"type":"ARRIVE"});TradeSession.ensure(old)
 var old_uid: String=Model.trade_item(old).uid
 old=Commerce.reduce(old,{"type":"DIALOGUE_RESUME"})
 check(CounterDialogue.active(old) and Model.trade_item(old).uid==old_uid,"already saved list session resumes as ordinary conversation")
 # A deferred old payment must not settle a later agreement from the same visitor.
 var another: String=s.inventory.filter(func(it):return it.owner=="shop")[0].uid
 s=Commerce.reduce(s,{"type":"SELECT_TRADE","uid":another})
 s=verb(s,"ACCEPT")
 var still_cash=s.cash;var still_ap=s.ap
 var replay=Commerce.reduce(s,delivery)
 check(replay.ap==still_ap and replay.cash==still_cash and TradeSession.summary(replay).sell_count==1,"old delivery token cannot pay for a later agreement")
 var locked_price=s.trade.price
 var locked=verb(s,"OFFER",{"price":locked_price+1})
 check(locked.trade.locked and locked.trade.price==locked_price and TradeSession.summary(locked).sell_count==1,"locked quote cannot be silently unconfirmed by a late offer")
 # Agreed NPC lots remain reachable to cancel without a management screen.
 var revisit=Model.create("REVISIT");revisit.ap=12;revisit.cash=5000;revisit=Commerce.reduce(revisit,{"type":"ARRIVE"})
 var npc_first: String=Model.trade_item(revisit).uid
 TradeSession.session(revisit).goods.append(Model.new_item(revisit,"WCH-002",{"owner":"npc","working":true,"sourceVerified":true}))
 revisit=verb(revisit,"ACCEPT")
 for hop in TradeSession.session(revisit).goods.size()+1:
  revisit=verb(revisit,"COUNTER_NEXT")
  if TradeSession.session(revisit).focus==npc_first and revisit.trade.locked: break
 check(TradeSession.session(revisit).focus==npc_first and revisit.trade.locked,"ordinary next-lot response can revisit an agreed NPC original")
 revisit=verb(revisit,"COUNTER_CANCEL")
 check(TradeSession.summary(revisit).buy_count==0,"putting an agreed lot aside frees its funds")
 var many=Model.create("MANY-REFUSALS");many=Commerce.reduce(many,{"type":"ARRIVE"});many.inventory=[];TradeSession.session(many).want_count=0
 var final_uid=""
 for i in 7:
  if i>0: many=verb(many,"COUNTER_CANCEL")
  var offered=Model.new_item(many,"WCH-001",{"sourceVerified":true,"working":true,"condition":0.9})
  Model.put_in(many,offered);final_uid=offered.uid
  many=Commerce.reduce(many,{"type":"SELECT_TRADE","uid":offered.uid})
 check(TradeSession.session(many).focus==final_uid,"taking rejected originals back frees the desk for a seventh original")
 # Legacy pawn contract consumes the focused original while retaining other NPC goods.
 var pawn=Model.create("DIALOGUE-PAWN");pawn.ap=12;pawn.cash=5000;pawn=Commerce.reduce(pawn,{"type":"ARRIVE"})
 var pledged=Model.trade_item(pawn);var pledge_uid: String=pledged.uid
 pledged.evidence=["TOL-001","TOL-002"]
 var spare=Model.new_item(pawn,"WCH-002",{"owner":"npc","sourceVerified":true})
 TradeSession.session(pawn).goods.append(spare)
 var npc_id: String=pawn.trade.npcId
 var unknown: Dictionary=pawn.duplicate(true);unknown.day=3
 Model.trade_item(unknown).sourceVerified=false
 var blocked_pawn=verb(unknown,"PAWN")
 check(blocked_pawn.trade!=null and blocked_pawn.cash==unknown.cash and blocked_pawn.notice.contains("来源"),"unverified natural pawn requires provenance consent with no payment")
 var tracked: Dictionary=pawn.duplicate(true)
 Model.trade_item(tracked).crimeCaseId="NIGHT-OLD-CASE"
 var blocked_case=verb(tracked,"PAWN")
 check(blocked_case.trade!=null and blocked_case.cash==tracked.cash and blocked_case.notice.contains("案件"),"case original cannot enter pawn through an ordinary NPC visit")
 pawn=verb(pawn,"PAWN")
 check(pawn.trade==null and Model.find_inventory(pawn,pledge_uid)!=null and Model.find_inventory(pawn,pledge_uid).owner=="pawn","ordinary pawn contract transfers focused canonical original")
 check(pawn.npcTrade[npc_id].owned.filter(func(lot):return lot.uid==spare.uid).size()==1 and not pawn.npcTrade[npc_id].owned.any(func(lot):return lot.uid==pledge_uid),"pawn visit retains other NPC stock once without duplicating pledged original")
 print("DIALOGUE failures=",failures);quit(1 if failures else 0)
