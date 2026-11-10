extends SceneTree
var failures:=0
func _initialize(): call_deferred("run")
func frames():
 for i in 8: await process_frame
func check(ok,label):
 print("DIALOGUE UI ","PASS " if ok else "FAIL ",label)
 if not ok: failures+=1
func action(game: Node,type: String) -> void:
 var s: Dictionary=game.state
 var version=TradeSession.summary(s).version
 game.dispatch({"type":type,"tradeId":s.trade.id,"uid":TradeSession.session(s).focus,"version":version,"batch":"counter-"+str(version)})
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
 var remembered=game.item(uid)
 remembered.evidence=["TOL-001"]
 page.chosen_evidence="TOL-001"
 var other_uid: String=game.state.inventory[1].uid
 page._stock_clicked(other_uid,true,null);await frames()
 check(page.chosen_evidence=="","switching originals clears hidden evidence selection")
 page._stock_clicked(uid,true,null);await frames()
 var line=CounterDialogue.current(game.state)
 if line.status in ["ready","counter"]:
  action(game,"ACCEPT");await frames()
  var bridge=load("res://scripts/app/web_touch.gd").new();root.add_child(bridge);bridge.setup(shell)
  check(bridge.snapshot().locked==game.state.trade.locked,"touch status reflects ordinary dialogue price lock")
  bridge.queue_free()
  for key in page.actions.get_children(): check(page.terminal.get_global_rect().encloses(key.get_global_rect()),"dialogue action stays inside original quotation device")
  page._stock_clicked(other_uid,true,null);await frames()
  action(game,"DELIVER");await frames()
  var handed=page.get("handover_history")
  check(handed is Array and handed.size()==1 and handed[0].uid==uid and handed[0].direction=="sell","handover moves the agreed original rather than the currently unconfirmed watch")
  check(game.state.trade!=null and is_instance_valid(page.customer) and not page.customer.walking,"checkout keeps same NPC physically at counter")
 game.dispatch({"type":"COUNTER_NEXT"});await frames()
 var offered=Model.trade_item(game.state)
 if offered!=null:
  shell.go("inspect",offered.uid);await frames();shell.close_workspace();await frames()
  check(not shell.modal_open() and CounterDialogue.active(game.state),"inspection returns to normal conversation without reopening a list")
 var se=TradeSession.session(game.state)
 se.cash=5000;se.want_count=6
 var stock=game.state.inventory.filter(func(lot):return lot.owner=="shop")[0]
 page._stock_clicked(stock.uid,true,null);await frames();action(game,"ACCEPT");await frames()
 action(game,"COUNTER_NEXT");await frames()
 var funded=CounterDialogue.current(game.state)
 if not funded.is_empty() and funded.direction=="buy":
  game.state.cash=0
  funded.context.price=1
  CounterDialogue._reply(game.state,funded)
  page._refresh();await frames()
  var allowed=false
  for key in page.actions.get_children():
   if String(key.text).begins_with("接受 "): allowed=not key.disabled
  check(allowed and page.dial.max_value>1,"ordinary price controls allow net-funded purchase without raw cash")
 check(page.find_child("dialogue_put_aside",true,false)!=null,"ordinary dialogue provides a put-aside response")
 shell.queue_free();await frames();print("DIALOGUE UI failures=",failures);quit(1 if failures else 0)
