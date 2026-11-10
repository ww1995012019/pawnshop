extends SceneTree
var failures:=0
func _initialize(): call_deferred("run")
func frames():
 for i in 8: await process_frame
func check(ok,label):
 print("DIALOGUE UI ","PASS " if ok else "FAIL ",label)
 if not ok: failures+=1
func run():
 root.size=Vector2i(1440,900)
 var game=root.get_node("Game");game.prefs.sound=false;game.prefs.reduced_motion=true;game.new_game("NATURAL-UI")
 game.dispatch({"type":"ARRIVE"})
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
 var page=shell.page
 check(not shell.modal_open() and page.find_child("multi_trade_open",true,false)==null,"arrival has no list gateway or trade modal")
 check(page.offer_panel.visible and page.offer_button!=null,"original quotation console is immediately interactive")
 check(page.find_child("dialogue_next_goods",true,false)!=null,"NPC's next offered item is an ordinary dialogue response")
 TradeSession.session(game.state).cash=5000;TradeSession.session(game.state).want_count=6
 var uid: String=game.state.inventory[0].uid
 page._stock_clicked(uid,true,null);await frames()
 check(not shell.modal_open() and game.state.trade.selectedUid==uid,"clicking stock speaks directly to NPC without opening another flow")
 check(page.bubble_label.text.contains(GameData.def(game.item(uid).defId).name),"NPC responds to the presented original in the existing speech bubble")
 var line=CounterDialogue.current(game.state)
 if line.status in ["ready","counter"]:
  game.dispatch({"type":"ACCEPT"});await frames()
  for key in page.actions.get_children(): check(page.terminal.get_global_rect().encloses(key.get_global_rect()),"dialogue action stays inside original quotation device")
  game.dispatch({"type":"DELIVER","tradeId":game.state.trade.id});await frames()
  check(game.state.trade!=null and is_instance_valid(page.customer) and not page.customer.walking,"checkout keeps same NPC physically at counter")
 game.dispatch({"type":"COUNTER_NEXT"});await frames()
 var offered=Model.trade_item(game.state)
 if offered!=null:
  shell.go("inspect",offered.uid);await frames();shell.close_workspace();await frames()
  check(not shell.modal_open() and CounterDialogue.active(game.state),"inspection returns to normal conversation without reopening a list")
 shell.queue_free();await frames();print("DIALOGUE UI failures=",failures);quit(1 if failures else 0)
