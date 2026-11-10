extends SceneTree
const Commerce=preload("res://scripts/model/commerce.gd")
var failures:=0
func _initialize(): call_deferred("run")
func check(ok: bool,label: String):
 print("TABLE ","PASS " if ok else "FAIL ",label)
 if not ok: failures+=1
func run():
 var s=Model.create("TABLE-GOODS");s.ap=20;s.cash=5000
 s=Commerce.reduce(s,{"type":"ARRIVE"})
 var se=TradeSession.session(s)
 while se.goods.size()<3: se.goods.append(Model.new_item(s,"WCH-002",{"owner":"npc","sourceVerified":true,"working":true}))
 s=CounterDialogue.begin(s);se=TradeSession.session(s);se.cash=5000;se.want_count=6
 check(se.lines.filter(func(line):return line.direction=="buy" and line.included).size()==3,"all three NPC originals are presented on arrival without next-item cycling")
 var first: String=s.inventory[0].uid;var second: String=s.inventory[1].uid
 for it in s.inventory: it.sourceVerified=true;it.working=true;it.authentic=true;it.condition=0.9
 s=Commerce.reduce(s,{"type":"SELECT_TRADE","uid":first})
 var old_rounds=TradeSession.row(s,first).context.rounds
 s=Commerce.reduce(s,{"type":"SELECT_TRADE","uid":second})
 check(TradeSession.row(s,first).included and TradeSession.row(s,second).included,"placing a second player original retains the first unconfirmed original on the desk")
 var cash=s.cash;var ap=s.ap
 s=Commerce.reduce(s,{"type":"COUNTER_FOCUS","tradeId":s.trade.id,"uid":first})
 check(TradeSession.session(s).focus==first and TradeSession.row(s,first).context.rounds==old_rounds and s.cash==cash and s.ap==ap,"clicking a displayed original focuses its old quote without charging or negotiation")
 s=Commerce.reduce(s,CounterDialogue.action_for(s,"COUNTER_CANCEL"))
 check(not TradeSession.row(s,first).included and TradeSession.row(s,second).included,"taking one player original back leaves the other originals presented")
 s=Commerce.reduce(s,{"type":"COUNTER_FOCUS","tradeId":s.trade.id,"uid":second})
 s=Commerce.reduce(s,{"type":"COUNTER_MOVE","tradeId":s.trade.id,"uid":second,"position":[900,610]})
 var restored: Dictionary=JSON.parse_string(JSON.stringify(s));restored=CounterDialogue.begin(restored)
 check(TradeSession.session(restored).get("table_positions",{}).get(second,[0,0])[0]==936 and TradeSession.session(restored).table_positions[second][1]==610 and TradeSession.row(restored,second).included and not TradeSession.row(restored,first).included,"reload preserves presented originals and physical placement without resurrecting removed goods")
 for i in 5:
  var extra=Model.new_item(restored,"WCH-002",{"sourceVerified":true,"working":true,"condition":0.9,"authentic":true});Model.put_in(restored,extra)
  restored=Commerce.reduce(restored,{"type":"SELECT_TRADE","uid":extra.uid})
 var focused_before: String=TradeSession.session(restored).focus
 restored=Commerce.reduce(restored,{"type":"SELECT_TRADE","uid":first})
 check(TradeSession.session(restored).focus==focused_before and not TradeSession.row(restored,first).included,"full desk cannot focus an excluded seventh proposal after re-add is refused")
 var placement=Model.create("DESK-REINTRODUCE");placement=Commerce.reduce(placement,{"type":"ARRIVE"})
 for lot in placement.inventory: lot.sourceVerified=true;lot.working=true;lot.authentic=true;lot.condition=0.9
 var a_uid: String=placement.inventory[0].uid;var b_uid: String=placement.inventory[1].uid
 placement=Commerce.reduce(placement,{"type":"SELECT_TRADE","uid":a_uid})
 placement=Commerce.reduce(placement,CounterDialogue.action_for(placement,"COUNTER_CANCEL"))
 placement=Commerce.reduce(placement,{"type":"SELECT_TRADE","uid":b_uid})
 placement=Commerce.reduce(placement,{"type":"SELECT_TRADE","uid":a_uid})
 var positions=TradeSession.session(placement).table_positions
 check(absf(float(positions[a_uid][0])-float(positions[b_uid][0]))>=102,"reintroduced original receives a free slot after another original reused its previous slot")
 placement=Commerce.reduce(placement,{"type":"COUNTER_MOVE","tradeId":placement.trade.id,"uid":a_uid,"position":[774,610]})
 positions=TradeSession.session(placement).table_positions
 check(absf(float(positions[a_uid][0])-float(positions[b_uid][0]))>=102,"dropping between occupied positions settles into a separate usable desk slot")
 print("TABLE failures=",failures);quit(1 if failures else 0)
