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
	var first_archive := ShopJournal.latest_receipt(game.state)
	check(int(first_archive.get("serial",0))==1 and shell.counter_receipt.serial==1,"first counter slip has a positive journal-issued number")
	check(is_instance_valid(receipt) and receipt.visible,"mobile prints a receipt even with reduced motion")
	shell.toast("批次交割完成，双方已经确认本次结算金额，库存和现金已经更新。")
	await frames()
	check_stamp(receipt,"mobile")
	check_tab(tab,shell,"expanded")
	await create_timer(1.3).timeout
	check(not receipt.visible and tab.visible,"receipt files to its edge tab")
	check_tab(tab,shell,"collapsed")
	root.size = Vector2i(568,320)
	await frames()
	shell.toast("批次交割完成，双方已经确认本次结算金额，库存和现金已经更新。")
	await frames()
	check_tab(tab,shell,"568px landscape")
	tab.pressed.emit()
	await frames()
	var dock: Control=desk.find_child("landscape_nav_repair",true,false)
	var shown: Rect2=receipt.get_global_transform()*Rect2(Vector2.ZERO,receipt.size)
	check(shown.end.y<=dock.get_global_rect().position.y,"reading the receipt leaves the full 568px navigation bar visible")
	var details: ScrollContainer=receipt.find_child("ReceiptDetails",true,false)
	check(details!=null and not details.get_v_scroll_bar().visible,"a single original fits on the short receipt without scrolling")
	var back := InputEventKey.new()
	back.keycode=KEY_ESCAPE
	back.pressed=true
	shell._input(back)
	check(not receipt.visible,"Escape files the open receipt without leaving the customer")
	if receipt.visible: tab.pressed.emit()
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
	var printed: Array=[]
	for label in desk.filed_receipt.find_children("*","Label",true,false): printed.append(label.text)
	for entry in ShopJournal.latest_receipt(game.state).entries:
		var direction: String="售出" if entry.direction=="sale" else "购入"
		check(printed.any(func(copy):return String(copy).begins_with(direction) and String(copy).contains(entry.name) and String(copy).contains("120")),"mixed receipt shows the direction, public name and price of "+entry.name)
	var first_number: int=shell.counter_receipt.serial
	var next_item=TradeSession.session(game.state).goods[4]
	game.dispatch({"type":"COUNTER_FOCUS","tradeId":game.state.trade.id,"uid":next_item.uid})
	var next_line:=TradeSession.row(game.state,next_item.uid)
	next_line.context.price=maxf(next_line.context.price,Model.trade_terms(game.state,next_line.context,next_item).floor)
	game.dispatch(CounterDialogue.action_for(game.state,"ACCEPT"))
	check(TradeSession.row(game.state,next_item.uid).selected,"second original is ready for a separate checkout")
	var next_checkout:=CounterDialogue.action_for(game.state,"DELIVER")
	game.dispatch(next_checkout)
	await frames()
	var number: int=shell.counter_receipt.serial
	check(number>first_number,"another batch at the same counter gets a distinct number")
	game.dispatch(next_checkout)
	check(ShopJournal.latest_receipt(game.state).get("serial",0)==number,"retrying the same checkout does not issue a new number")
	var legacy: Dictionary=JSON.parse_string(JSON.stringify(game.state))
	for record in legacy.shopJournal.receipts:
		record.erase("serial")
		record.erase("counterKind")
	game.ensure_shop_state(legacy)
	check(int(legacy.shopJournal.receipts.back().get("serial",0))==number,"existing archived receipts receive stable numbers on loading")
	game.state=legacy
	var restored=load("res://main.tscn").instantiate()
	restored.phone_override=true
	root.add_child(restored)
	await frames()
	check(is_instance_valid(restored.page.filed_receipt) and restored.counter_receipt.get("serial",0)==number,"a fresh counter restores the filed paper from the saved journal")
	restored.queue_free()
	await frames()
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
