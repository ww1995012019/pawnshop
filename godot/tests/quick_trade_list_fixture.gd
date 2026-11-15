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
 var four=preload("res://tests/strict_multi_counter_fixture.gd").build(false)
 var four_session=TradeSession.session(four);four_session.goods.resize(4)
 var four_ids=four_session.goods.map(func(it):return it.uid)
 four_session.lines=four_session.lines.filter(func(line):return line.uid in four_ids)
 four.trade.npcId="CHR-008"
 for line in four_session.lines:line.context.npcId="CHR-008"
 four=CounterDialogue.begin(four)
 if out.write_json("res://../work/quick-trade-list/four.json",four)!=OK:quit(1);return
 var shop=preload("res://tests/strict_multi_counter_fixture.gd").build(false)
 var stock_lines=TradeSession.session(shop).lines.filter(func(line):return line.direction=="sell")
 for line in stock_lines:line.context.price=1
 stock_lines[1].status="rejected";stock_lines[1].selected=false
 if out.write_json("res://../work/quick-trade-list/shop.json",shop)!=OK:quit(1);return
 quit()
