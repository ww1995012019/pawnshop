extends SceneTree
const Commerce=preload("res://scripts/model/commerce.gd")
func _initialize():
 var out=preload("res://tests/fixture_output.gd")
 for hole in [false,true]:
  var key="seven-hole" if hole else "maximum"
  if out.write_json("res://../work/multi-counter/"+key+".json",build(hole))!=OK:quit(1);return
 var user=build(true)
 var remove=TradeSession.session(user).lines.filter(func(line):return line.direction=="sell").map(func(line):return line.uid)
 for uid in remove:
  user=Commerce.reduce(user,{"type":"COUNTER_FOCUS","tradeId":user.trade.id,"uid":uid})
  user=Commerce.reduce(user,CounterDialogue.action_for(user,"COUNTER_CANCEL"))
 user=Commerce.reduce(user,{"type":"COUNTER_FOCUS","tradeId":user.trade.id,"uid":TradeSession.session(user).goods[1].uid})
 if out.write_json("res://../work/multi-counter/user.json",user)!=OK:quit(1);return
 quit()

static func build(hole: bool) -> Dictionary:
 var s=Model.create("STRICT-MULTI-COUNTER");s.day=26;s.cash=979043;s.ap=12;s.risk=100;s.inventory=[]
 var models=["WCH-001","WCH-007","WCH-059","WCH-010","WCH-008","WCH-004","WCH-002","WCH-005","WCH-013","WCH-014","WCH-015","WCH-020"]
 for i in 33:
  var it=Model.new_item(s,models[i%models.size()],{"condition":.9,"sourceVerified":true,"authentic":true,"working":true})
  if i<5:it.location="display";it.listPrice=[90,123,213,143,107][i];s.inventory.append(it)
  else:Model.put_in(s,it)
 s.trade={"id":"strict-multi","npcId":"CHR-019","kind":"buy","item":null,"price":651,"rounds":0,"locked":false,"evidenceUsed":[],"line":""}
 TradeSession.ensure(s)
 var se=TradeSession.session(s);se.goods=[];se.lines=[];se.focus="";se.cash=500000;se.want_count=8
 var offered=["WCH-057","WCH-072","WCH-008","WCH-072","WCH-016","WCH-005","WCH-072","WCH-058"]
 for id in offered:se.goods.append(Model.new_item(s,id,{"owner":"npc","condition":.9,"sourceVerified":true,"authentic":true,"working":true}))
 se.focus=se.goods[1].uid;s=CounterDialogue.begin(s)
 for i in 8:TradeSession.row(s,se.goods[i].uid).context.price=[140,651,284,657,31,90,370,429][i]
 for i in 8:s=Commerce.reduce(s,{"type":"SELECT_TRADE","uid":s.inventory[i+5].uid})
 se=TradeSession.session(s)
 # This is a real partial checkout: canonical slot 5 becomes empty while slot
 # 7 stays occupied, reproducing the reported far-right occlusion.
 if hole:
  var removed_uid:String=se.goods[5].uid
  var removed_row=TradeSession.row(s,removed_uid)
  removed_row.context.price=maxf(removed_row.context.price,Model.trade_terms(s,removed_row.context,TradeSession.item(s,removed_uid)).floor)
  s=Commerce.reduce(s,{"type":"COUNTER_FOCUS","tradeId":s.trade.id,"uid":removed_uid})
  s=Commerce.reduce(s,CounterDialogue.action_for(s,"ACCEPT"))
  s=Commerce.reduce(s,CounterDialogue.action_for(s,"DELIVER"))
 se=TradeSession.session(s)
 s=Commerce.reduce(s,{"type":"COUNTER_FOCUS","tradeId":s.trade.id,"uid":se.goods[1].uid})
 return s
