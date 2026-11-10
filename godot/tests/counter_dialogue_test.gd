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
func run():
 var s=Model.create("NATURAL-DIALOGUE");s.ap=12;s.cash=5000
 s=Commerce.reduce(s,{"type":"ARRIVE"})
 check(CounterDialogue.active(s),"ordinary arrival automatically enables natural multi-item conversation")
 var id: String=s.trade.id
 var first: String=Model.trade_item(s).uid
 check(s.trade.kind=="buy" and s.trade.line.contains(GameData.def(Model.trade_item(s).defId).name),"NPC's first lot and asking price are already in normal conversation")
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
 var bad=Model.new_item(s,"WCH-001",{"sourceVerified":false});Model.put_in(s,bad)
 var rejected=Commerce.reduce(s,{"type":"SELECT_TRADE","uid":bad.uid})
 check(rejected.trade.id==id and rejected.trade.line.contains("来源"),"unavailable recommendation is refused in the same conversation")
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
  var offered=Model.new_item(many,"WCH-001",{"sourceVerified":true,"working":true,"condition":0.9})
  Model.put_in(many,offered);final_uid=offered.uid
  many=Commerce.reduce(many,{"type":"SELECT_TRADE","uid":offered.uid})
 check(TradeSession.session(many).focus==final_uid,"putting rejected proposals aside allows discussing a seventh original")
 print("DIALOGUE failures=",failures);quit(1 if failures else 0)
