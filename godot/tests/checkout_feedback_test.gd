extends SceneTree
var failures := 0

func _initialize():
	call_deferred("run")

func check(ok: bool, description: String) -> void:
	print("CHECKOUT ", "PASS " if ok else "FAIL ", description)
	if not ok: failures += 1

func frames():
	for i in 6: await process_frame

func check_stamp(paper: Control, layout_name: String) -> void:
	var stamp: Control = paper.get_meta("stamp_room").get_child(0)
	var bounds: Rect2 = paper.get_global_transform()*Rect2(Vector2.ZERO,paper.size)
	var ink: Rect2 = stamp.get_global_transform()*Rect2(Vector2.ZERO,stamp.size)
	check(bounds.encloses(ink),layout_name+" stamped ink stays inside paper after first layout")

func check_tab(tab: Button, shell, layout_name: String) -> void:
	var font := tab.get_theme_font("font")
	var label_width := font.get_string_size(tab.text,HORIZONTAL_ALIGNMENT_LEFT,-1,tab.get_theme_font_size("font_size")).x
	var padding := tab.get_theme_stylebox("normal").get_minimum_size().x
	check(tab.size.x>=label_width+padding and tab.size.y*shell.touch_scale()>=44,layout_name+" shows full caption with a 44 CSS pixel tap target")
	var notice: Control = shell.toast_box.get_child(0)
	check(notice.visible and not tab.get_global_rect().intersects(notice.get_global_rect()),layout_name+" receipt has a slot outside the live settlement notice")
	var mat: Rect2 = shell.page.get_node("PortraitCounter/LandscapeCounter").mat
	check(not tab.get_global_rect().intersects(mat),layout_name+" receipt clears the watch surface")
	for control in shell.page.get_node("PortraitCounter/LandscapeCounter").find_children("*","Button",true,false):
		if control.is_visible_in_tree() and control.size!=Vector2.ZERO:
			check(not tab.get_global_rect().intersects(control.get_global_rect()),layout_name+" clears "+str(control.name))

func run():
	root.size = Vector2i(844,390)
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	game.new_game("CHECKOUT-FEEDBACK")
	game.dispatch({"type":"ARRIVE"})
	var shell = load("res://main.tscn").instantiate()
	shell.phone_override = true
	root.add_child(shell)
	await frames()
	shell._close_title()
	await frames()
	var desk = shell.page
	var cash: float = game.state.cash
	var stock: int = game.state.inventory.size()
	var uid: String = TradeSession.session(game.state).focus
	game.dispatch(CounterDialogue.action_for(game.state,"ACCEPT"))
	await frames()
	check(desk.counter_table.sprites[uid].has_node("LockedLot"),"lock tag belongs to the agreed original")
	check(game.state.cash==cash and game.state.inventory.size()==stock and not desk.has_node("settlement_cash"),"price lock does not imply payment")
	game.dispatch(CounterDialogue.action_for(game.state,"COUNTER_CANCEL"))
	await frames()
	check(not desk.counter_table.sprites[uid].has_node("LockedLot"),"unlock clears the original's tag")
	game.dispatch(CounterDialogue.action_for(game.state,"ACCEPT"))
	game.dispatch(CounterDialogue.action_for(game.state,"DELIVER"))
	await frames()
	check(desk.get_node("settlement_cash").text=="现金 "+desk._signed(game.state.cash-cash)+" Cr","HUD note shows actual signed cash change")
	check(desk.get_node("settlement_stock").text=="库存 +1 件","stock note counts the transferred original")
	var receipt = desk.filed_receipt
	var tab = desk.receipt_tab
	check(is_instance_valid(receipt) and receipt.visible,"mobile prints a receipt even with reduced motion")
	shell.toast("批次交割完成，双方已经确认本次结算金额，库存和现金已经更新。")
	await frames()
	check_stamp(receipt,"mobile")
	check_tab(tab,shell,"expanded")
	await create_timer(1.3).timeout
	check(not receipt.visible and tab.visible,"receipt files to its edge tab")
	check_tab(tab,shell,"collapsed")
	root.size = Vector2i(600,320)
	await frames()
	shell.toast("批次交割完成，双方已经确认本次结算金额，库存和现金已经更新。")
	await frames()
	check_tab(tab,shell,"600px landscape")
	root.size = Vector2i(844,390)
	await frames()
	var balance: float = game.state.cash
	var entries: int = game.state.ledger.size()
	tab.pressed.emit()
	check(receipt.visible and entries==game.state.ledger.size() and game.state.cash==balance,"rereading only reopens paper")
	tab.pressed.emit()
	check(not receipt.visible,"edge tab dismisses reread paper")
	desk.workspace_state_changed(true)
	check(not tab.visible,"counter receipt yields to workspaces")
	desk.workspace_state_changed(false)
	check(tab.visible and not receipt.visible,"return restores only the filed tab")
	game.dispatch(CounterDialogue.action_for(game.state,"TRADE_END"))
	await create_timer(3.3).timeout
	game.dispatch({"type":"ARRIVE"})
	await create_timer(2.4).timeout
	check(game.state.trade!=null and desk.filed_receipt==receipt and not receipt.visible and tab.visible,"next visitor preserves the previous receipt collapsed")
	game.state.phase = "report"
	game.state.report = {"day":game.state.day}
	game.state.trade = null
	var prior_day: int = game.state.day
	game.dispatch({"type":"NEXT"})
	check(game.state.day==prior_day+1 and desk.filed_receipt==receipt and not receipt.visible,"next day keeps the previous dated receipt filed")
	shell.go("counter")
	await frames()
	desk = shell.page
	check(is_instance_valid(desk.filed_receipt) and not desk.filed_receipt.visible and shell.counter_receipt.day==prior_day,"counter recreation restores a collapsed receipt with its original date")
	# Give a real mixed batch equal valid prices so both signed deltas are zero.
	game.state = preload("res://tests/strict_multi_counter_fixture.gd").build(false)
	shell.go("counter")
	await frames()
	desk = shell.page
	var session := TradeSession.session(game.state)
	var incoming: Dictionary = session.goods[4]
	var outgoing: Dictionary = game.state.inventory[10]
	for lot in [incoming,outgoing]:
		game.dispatch({"type":"COUNTER_FOCUS","tradeId":game.state.trade.id,"uid":lot.uid})
		var line := TradeSession.row(game.state,lot.uid)
		line.context.price=120
		game.dispatch(CounterDialogue.action_for(game.state,"ACCEPT"))
	var totals := TradeSession.summary(game.state)
	check(totals.sell_count==1 and totals.buy_count==1 and totals.net==0,"one original locked on each side")
	balance = game.state.cash
	stock = game.state.inventory.size()
	game.dispatch(CounterDialogue.action_for(game.state,"DELIVER"))
	await frames()
	check(game.state.inventory.size()==stock and game.state.cash==balance and Model.find_inventory(game.state,incoming.uid)!=null and Model.find_inventory(game.state,outgoing.uid)==null,"mixed checkout exchanges both originals at zero net")
	check(desk.get_node("settlement_stock").text=="库存 0 件" and desk.get_node("settlement_cash").text=="现金 0 Cr","even swaps show both zero changes")
	check(shell.counter_receipt.stock==0 and shell.counter_receipt.cash==0,"the next checkout replaces the previous receipt")
	var saved: Dictionary = shell.counter_receipt.duplicate(true)
	game.new_game("CHECKOUT-FEEDBACK")
	await frames()
	check(shell.counter_receipt.is_empty() and not is_instance_valid(shell.page.filed_receipt),"a new save with the same seed has no previous receipt")
	shell.phone_override = false
	root.size = Vector2i(1440,900)
	await frames()
	shell.page._print_receipt(saved,false)
	await frames()
	check_stamp(shell.page.get_node("trade_receipt"),"desktop")
	shell.queue_free()
	await frames()
	print("CHECKOUT failures=",failures)
	quit(1 if failures else 0)
