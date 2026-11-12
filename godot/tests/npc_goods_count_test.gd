extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
 if not ok: push_error(label);failures+=1
func run() -> void:
 var trade_script=load("res://scripts/model/trade_session.gd")
 if not trade_script.has_method("goods_count"):
  check(false,"weighted NPC quantity sampler must exist");quit(1);return
 var bins: Array[int]=[0,0,0,0,0,0,0,0,0]
 var empty := 0
 for i in 100000:
  var id := "visit-%d" % i
  var n: int=trade_script.goods_count("COUNT-DISTRIBUTION",id,false)
  check(n>=1 and n<=8,"seller quantity bounds")
  if n<1 or n>8: quit(1);return
  bins[n]+=1
  check(n==trade_script.goods_count("COUNT-DISTRIBUTION",id,false),"reload stable quantity")
  var optional: int=trade_script.goods_count("COUNT-DISTRIBUTION",id,true)
  if optional==0: empty+=1
  check(optional>=0 and optional<=8,"optional goods bounds")
 for n in range(1,8): check(bins[n]>bins[n+1],"strictly decreasing quantity frequency")
 var expected := [0,40,24,14,9,6,4,2,1]
 for n in range(1,9): check(absf(float(bins[n])/1000.0-expected[n])<0.8,"quantity weight %d" % n)
 check(empty>24000 and empty<26000,"procurement retains 25 percent empty chance")
 for direction in ["buy","sell"]:
  var s := Model.create("COUNT-EIGHT")
  s.cash=100000;s.ap=20;s.inventory=[]
  s.trade={"id":"eight-visit","npcId":"CHR-004","kind":"sell","item":null,"price":0,"rounds":0,"locked":false,"evidenceUsed":[],"line":""}
  TradeSession.ensure(s)
  var se := TradeSession.session(s)
  se.lines=[];se.goods=[];se.cash=100000;se.want_count=8
  var uids: Array=[]
  for i in 9:
   var lot := Model.new_item(s,"WCH-001",{"owner":"npc" if direction=="buy" else "shop","working":true,"authentic":true,"sourceVerified":true})
   if direction=="buy": se.goods.append(lot)
   else: s.inventory.append(lot)
   uids.append(lot.uid)
  for i in 8:
   s=TradeSession.reduce(s,{"type":"TRADE_ADD","tradeId":s.trade.id,"uid":uids[i],"direction":direction})
  check(TradeSession.session(s).lines.size()==8,"all eight originals can be selected: "+direction)
  s=TradeSession.reduce(s,{"type":"TRADE_ADD","tradeId":s.trade.id,"uid":uids[8],"direction":direction})
  check(TradeSession.session(s).lines.size()==8,"ninth original is refused: "+direction)
  var slots: Array=CounterDialogue._table_slots(direction,8)
  check(slots.size()==8,"eight table slots: "+direction)
  for slot in slots: check(Rect2(670,480,640,180).has_point(slot),"eight originals stay within table")
  for line in TradeSession.session(s).lines:
   var lot=TradeSession.item(s,line.uid)
   var terms=Model.trade_terms(s,line.context,lot)
   line.context.price=terms.floor if direction=="buy" else terms.ceiling
   line.status="ready"
  for i in 8: s=TradeSession.reduce(s,{"type":"TRADE_CONFIRM","tradeId":s.trade.id,"uid":uids[i]})
  var summary:=TradeSession.summary(s)
  check(summary.buy_count+summary.sell_count==8,"all eight original quotes can be confirmed")
  var ap: float=s.ap
  s=TradeSession.reduce(s,{"type":"TRADE_CHECKOUT","tradeId":s.trade.id,"version":summary.version,"batch":"eight-items"})
  check(TradeSession.session(s).completed.has("eight-items") and s.ap==ap-1,"eight originals settle atomically for one AP")
 var display := Model.create("EIGHT-COMPACT-HIT")
 display.trade={"id":"eight-hit","npcId":"CHR-004","kind":"buy","item":Model.new_item(display,"WCH-001"),"price":30,"rounds":0,"locked":false,"evidenceUsed":[],"line":""}
 TradeSession.ensure(display)
 var se:=TradeSession.session(display)
 se.goods=[];se.lines=[]
 for i in 8: se.goods.append(Model.new_item(display,"WCH-001",{"owner":"npc"}))
 display=CounterDialogue.begin(display)
 root.get_node("Game").state=display
 var kit=load("res://scripts/app/ui_kit.gd");kit.ensure()
 var table=load("res://scripts/world/counter_table.gd").new()
 root.add_child(table)
 table.presentation_rect=Rect2(0,0,80,30)
 table.sync(display)
 for uid in table.sprites:
  var sprite=table.sprites[uid]
  check(table.hit_test(sprite.body.global_position)==uid,"compact table selects tapped original instead of overlapping neighbor")
 table.free()
 print("NPC COUNT bins=",bins," empty=",empty," failures=",failures)
 quit(1 if failures else 0)
