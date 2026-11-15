extends SceneTree
func _initialize():
 var out=preload("res://tests/fixture_output.gd")
 var s=preload("res://tests/strict_multi_counter_fixture.gd").build(false)
 var se=TradeSession.session(s);se.goods.resize(2)
 var ids=se.goods.map(func(it):return it.uid)
 se.lines=se.lines.filter(func(line):return line.uid in ids)
 for line in se.lines:
  var terms=Model.trade_terms(s,line.context,TradeSession.item(s,line.uid))
  line.context.price=minf(terms.marketCap,ceil(terms.floor*1.5))
 s=CounterDialogue.begin(s)
 if out.write_json("res://../work/quick-trade-list/two.json",s)!=OK:quit(1);return
 se.goods.resize(1);se.lines.resize(1);se.focus=se.goods[0].uid
 s.trade.npcId="CHR-008"
 for line in se.lines:line.context.npcId="CHR-008"
 s=CounterDialogue.begin(s)
 if out.write_json("res://../work/quick-trade-list/one.json",s)!=OK:quit(1);return
 se=TradeSession.session(s);se.goods=[];se.lines=[];se.focus=""
 s=CounterDialogue.begin(s)
 if out.write_json("res://../work/quick-trade-list/empty.json",s)!=OK:quit(1);return
 quit()
