extends "res://tests/night_crime_ui_test.gd"
func run() -> void:
 var game=root.get_node("Game");game.prefs.reduced_motion=true;game.prefs.sound=false
 game.state=Fixture.fresh("BATCH-RISK-UI")
 var physical:=Model.new_item(game.state,"WCH-002",{"sourceVerified":false,"condition":0.8,"authentic":true,"working":true})
 var uid: String=physical.uid
 game.state.trade={"id":"batch-ui","npcId":"CHR-002","kind":"buy","item":physical,"price":100,"rounds":0,"locked":false,"evidenceUsed":[],"line":"来源待核"}
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
 shell.page.call("_open_trade_list");await frames()
 var before: float=game.state.cash
 await click(button(shell,"确认购买"))
 check(button(shell,"承担风险并锁价")!=null and not TradeSession.row(game.state,uid).selected,"batch confirmation opens explicit gray risk consent before selecting")
 if button(shell,"承担风险并锁价")!=null: await click(button(shell,"承担风险并锁价"))
 check(TradeSession.row(game.state,uid).selected and game.state.cash==before,"batch consent selects captured quote without premature payment")
 var risk: float=game.state.risk
 await click(button(shell,"交割已确认商品 · 1 AP"))
 check(Model.find_inventory(game.state,uid)!=null and game.state.risk==mini(100,risk+8),"native batch checkout transfers gray original and charges risk once")
 # Warehouse recommendation must join the already active session.
 await click(button(shell,"结束接待"))
 game.state.trade={"id":"batch-warehouse","npcId":"CHR-004","kind":"sell","item":null,"price":0,"rounds":0,"locked":false,"evidenceUsed":[],"line":"请推荐商品"}
 game.dispatch({"type":"TRADE_OPEN"})
 shell.go("warehouse",uid);await frames()
 await click(button(shell,"灰色收售"))
 if button(shell,"承担风险并选货")!=null: await click(button(shell,"承担风险并选货"))
 check(not TradeSession.row(game.state,uid).is_empty(),"warehouse gray recommendation joins active batch session")
 await click(button(shell,"结束接待"))
 game.state=Fixture.resale_state();shell.go("counter");await frames()
 var lost_uid: String=game.state.trade.item.uid
 shell.page.call("_open_trade_list");await frames()
 check(button(shell,"失物报警")==null,"batch list does not disclose lost-original report before serial evidence")
 game.dispatch({"type":"CHECK","uid":lost_uid,"tool":"TOL-002"});await frames()
 before=game.state.cash
 await click(button(shell.modal_layer,"失物报警"));await click(button(shell,"核对原编号并报警"));await idle(shell.page)
 check(game.state.trade==null and Model.find_inventory(game.state,lost_uid)!=null and game.state.cash==before,"batch list reports serial-qualified original without purchase or duplication")
 shell.queue_free();await frames()
 print("SESSION CRIME UI failures=",failures);quit(1 if failures else 0)
