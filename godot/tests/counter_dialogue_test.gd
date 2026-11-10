extends SceneTree
const Commerce=preload("res://scripts/model/commerce.gd")
var failures:=0
func _initialize(): call_deferred("run")
func check(ok,label):
 print("DIALOGUE ","PASS " if ok else "FAIL ",label)
 if not ok: failures+=1
func run():
 var s=Model.create("NATURAL-DIALOGUE");s.ap=12;s.cash=5000
 s=Commerce.reduce(s,{"type":"ARRIVE"})
 check(CounterDialogue.active(s),"ordinary arrival automatically enables natural multi-item conversation")
 var id: String=s.trade.id
 var first: String=Model.trade_item(s).uid
 check(s.trade.kind=="buy" and s.trade.line.contains(GameData.def(Model.trade_item(s).defId).name),"NPC's first lot and asking price are already in normal conversation")
 TradeSession.session(s).cash=5000;TradeSession.session(s).want_count=6
 for it in s.inventory: it.working=true;it.authentic=true;it.sourceVerified=true;it.condition=0.9
 s=Commerce.reduce(s,{"type":"ACCEPT"})
 check(s.trade.locked and TradeSession.summary(s).buy_count==1,"normal accept remembers NPC lot without another trade UI")
 var uid: String=s.inventory[0].uid
 s=Commerce.reduce(s,{"type":"SELECT_TRADE","uid":uid})
 check(s.trade.kind=="sell" and Model.trade_item(s).uid==uid and CounterDialogue.current(s).status in ["ready","counter"],"presenting shop stock immediately elicits buyer response")
 s=Commerce.reduce(s,{"type":"ACCEPT"})
 var second: String=s.inventory[1].uid
 s=Commerce.reduce(s,{"type":"SELECT_TRADE","uid":second})
 s=Commerce.reduce(s,{"type":"ACCEPT"})
 var totals=TradeSession.summary(s)
 check(totals.sell_count==2 and totals.buy_count==1,"different recommendations and NPC's lot are remembered through ordinary dialogue")
 var ap=s.ap;var cash=s.cash
 s=Commerce.reduce(s,{"type":"DELIVER","tradeId":id})
 check(s.trade!=null and s.trade.id==id and s.ap==ap-1 and s.cash==cash+totals.net,"normal deliver settles agreed originals once and keeps same NPC")
 check(Model.find_inventory(s,first)!=null and Model.find_inventory(s,uid)==null and Model.find_inventory(s,second)==null,"bidirectional settlement transfers exact originals")
 var again=Commerce.reduce(s,{"type":"DELIVER","tradeId":id})
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
 print("DIALOGUE failures=",failures);quit(1 if failures else 0)
