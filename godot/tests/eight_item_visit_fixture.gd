extends SceneTree
func _initialize() -> void:
 var seed := ""
 for i in 10000:
  var candidate := "EIGHT-VISIT-%d" % i
  if TradeSession.goods_count(candidate,"eight-browser-visit")==8: seed=candidate;break
 var s := Model.create(seed)
 s.cash=100000;s.ap=100
 s.trade={"id":"eight-browser-visit","npcId":"CHR-004","kind":"buy","item":Model.new_item(s,"WCH-001",{"owner":"npc","sourceVerified":true,"authentic":true,"working":true}),"price":30,"rounds":0,"locked":false,"evidenceUsed":[],"line":"八件旧货"}
 s=CounterDialogue.begin(s)
 if TradeSession.session(s).goods.size()!=8: quit(1);return
 if preload("res://tests/fixture_output.gd").write_json("res://../work/eight-item-visit/fixture.json",s)!=OK: quit(1);return
 quit()
