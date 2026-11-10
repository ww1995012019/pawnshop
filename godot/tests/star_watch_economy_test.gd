extends SceneTree
const Commerce=preload("res://scripts/model/commerce.gd")
var failures:=0
func _initialize():call_deferred("run")
func check(ok: bool,message: String):
 print("STAR ","PASS " if ok else "FAIL ",message)
 if not ok:failures+=1
func visit(s: Dictionary,id: String,npc:="CHR-009") -> Dictionary:
 s.trade={"id":id,"npcId":npc,"kind":"sell","item":null,"price":0,"rounds":0,"locked":false,"evidenceUsed":[]}
 return CounterDialogue.begin(s)
func run():
 var s=Model.create("STAR-ECONOMY");s.ap=20;s.cash=1000
 var top=Model.new_item(s,"WCH-033",{"condition":1.0,"working":true,"authentic":true,"sourceVerified":true});Model.put_in(s,top)
 # Reprice a saved real inspection: a catalogue update must not reuse old money facts.
 var definition=GameData.def("WCH-033");var price=definition.value;definition.value=780
 var old_revision=Model.appraisal_revision(top);definition.value=price
 top.evidence=["TOL-001"];top.inspectionFacts={"TOL-001":{"appraisalRevision":old_revision,"appraisalValue":780}}
 check(Model.estimate(top).count==0,"old lower-price appraisal is stale after Star catalogue repricing")
 top.evidence=[];top.inspectionFacts={}
 var fresh=visit(s.duplicate(true),"collector-fresh")
 var initial:float=TradeSession.session(fresh).cash
 check(initial>float(GameData.def("WCH-033").value) and initial>12000,"collector can fund at least one top-priced watch")
 var old=Model.create("STAR-ECONOMY");old.npcTrade={"CHR-009":{"cash":200,"owned":[]}}
 old=visit(old,"collector-existing")
 var old_base:float=800+Model.fnv(String(old.seed)+"CHR-009")%1000
 check(is_equal_approx(TradeSession.session(old).cash,initial-old_base+200),"one-time collector adjustment preserves previously spent funds")
 TradeSession.session(old).cash-=1000;TradeSession.persist_holdings(old)
 var retained:float=TradeSession.session(old).cash
 old=Model.finish_trade(old,"结束接待");old=visit(old,"collector-return")
 check(is_equal_approx(TradeSession.session(old).cash,retained),"revisiting never refills the collector wallet")
 var ordinary=visit(Model.create("STAR-ECONOMY"),"ordinary","CHR-004")
 check(TradeSession.session(ordinary).cash==800+Model.fnv(String(ordinary.seed)+"CHR-004")%1000,"ordinary buyer cash follows the existing budget rule")
 fresh=Commerce.reduce(fresh,{"type":"SELECT_TRADE","uid":top.uid})
 var before_cash:float=fresh.cash;var before_ap:float=fresh.ap
 var quoted:float=fresh.trade.price
 check(quoted>5000,"collector's real offer reflects the high-end price level")
 fresh=Commerce.reduce(fresh,CounterDialogue.action_for(fresh,"ACCEPT"))
 check(fresh.trade.locked and fresh.cash==before_cash,"expensive original can be agreed without premature payment")
 fresh=Commerce.reduce(fresh,CounterDialogue.action_for(fresh,"DELIVER"))
 check(fresh.cash==before_cash+quoted and fresh.ap==before_ap-1 and Model.find_inventory(fresh,top.uid)==null,"high-priced watch actually settles once with normal ownership and AP accounting")
 print("STAR failures=",failures);quit(1 if failures else 0)
