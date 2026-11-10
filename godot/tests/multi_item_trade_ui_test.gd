extends SceneTree
var failures:=0
func _initialize(): call_deferred("run")
func frames():
 for i in 8: await process_frame
func check(ok,label):
 print("MULTI UI ","PASS " if ok else "FAIL ",label)
 if not ok: failures+=1
func run():
 root.size=Vector2i(1440,900)
 var game=root.get_node("Game");game.prefs.sound=false;game.prefs.reduced_motion=true;game.new_game("MULTI-UI")
 game.dispatch({"type":"ARRIVE"})
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
 check(shell.page.find_child("multi_trade_open",true,false)!=null,"ordinary visitor has prominent two-way list entry")
 shell.page.call("_open_trade_list");await frames()
 check(not TradeSession.session(game.state).is_empty(),"opening list creates persistent visitor session")
 check(shell.root_ui.find_child("trade_stock",true,false)!=null and shell.root_ui.find_child("trade_visitor_goods",true,false)!=null,"separate store recommendations and NPC goods")
 var it=game.state.inventory[0]
 game.dispatch({"type":"TRADE_ADD","uid":it.uid,"direction":"sell"});await frames()
 check(shell.root_ui.find_child("trade_line_"+it.uid,true,false)!=null,"each original has its own trade row")
 check(shell.root_ui.find_child("trade_checkout",true,false)!=null and shell.root_ui.find_child("trade_end_visit",true,false)!=null,"checkout is separate from ending visitor")
 check(shell.root_ui.find_child("trade_totals",true,false)!=null,"gross income, cost and net totals have fixed footer")
 shell.queue_free();await frames()
 print("MULTI UI failures=",failures);quit(1 if failures else 0)
