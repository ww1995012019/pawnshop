extends SceneTree
var failures := 0
var shell
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	print("PAYMENT ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func frame() -> void:
	await process_frame
	await process_frame
func run() -> void:
	var game = root.get_node("Game")
	game.prefs.reduced_motion = false
	game.prefs.sound = false
	game.new_game("CASH-TRAY")
	game.state = Model.reduce(game.state, {"type": "ARRIVE"})
	shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frame()
	shell._close_title()
	var page = shell.page
	var tray = page.get("cash_tray")
	check(tray != null, "quotation console has a real cash tray")
	game.dispatch({"type": "ACCEPT"})
	await frame()
	if tray != null:
		check(tray.visible, "locked deal displays cash in the empty quotation area")
		check(page.terminal.get_global_rect().encloses(tray.get_global_rect()), "cash stays inside the till")
		check(tray.get_global_rect().position.x > page.terminal.get_global_rect().get_center().x, "cash occupies the marked right side")
	var uid: String = game.state.trade.item.uid
	var ledger_before: int = game.state.ledger.size()
	game.dispatch({"type": "DELIVER", "tradeId": game.state.trade.id})
	var final_cash: float = game.state.cash
	var cash_stable := true
	var overlap := false
	var origin_flash := false
	var start := Time.get_ticks_msec()
	while page.busy and Time.get_ticks_msec() - start < 7000:
		if is_instance_valid(page.customer) and page.customer.walking and is_instance_valid(page.mat_item) and not page.mat_item.is_queued_for_deletion(): overlap = true
		for bill in page.find_children("cash_bill*", "Control", true, false):
			if bill.global_position.length() < 50: origin_flash = true
		cash_stable = cash_stable and game.state.cash == final_cash
		await frame()
	check(cash_stable, "animation does not charge repeatedly")
	check(not page.busy, "transaction animation completes")
	check(not overlap, "customer waits for actual item handover before departing")
	check(not origin_flash, "banknotes never flash at the screen origin")
	check(Model.find_inventory(game.state, uid) != null and game.state.ledger.size() == ledger_before + 1, "one purchase transfers the same watch exactly once")
	if tray != null: check(is_equal_approx(tray.cash, game.state.cash), "cash stack finishes at the actual balance")
	for mode in ["sell", "pawn", "reduced"]:
		await other_trade(mode)
	shell.queue_free()
	await frame()
	for player in root.find_children("*", "AudioStreamPlayer", true, false):
		player.stop()
		player.stream = null
	await process_frame
	print("PAYMENT failures=", failures)
	quit(1 if failures else 0)

func other_trade(mode: String) -> void:
	var game = root.get_node("Game")
	game.prefs.reduced_motion = mode == "reduced"
	game.new_game("PAYMENT-" + mode)
	if mode == "sell": game.state.cursor = 1
	game.state = Model.reduce(game.state, {"type": "ARRIVE"})
	if mode == "sell":
		var stock: Dictionary = game.state.inventory[0]
		stock.condition = 1.0
		stock.working = true
		stock.sourceVerified = true
		game.state = Model.reduce(game.state, {"type": "SELECT_TRADE", "uid": stock.uid})
	if mode == "pawn": game.state.trade.item.evidence = ["TOL-001", "TOL-002", "TOL-005"]
	shell.go("counter")
	await frame()
	var page = shell.page
	var tray = page.get("cash_tray")
	if tray == null: return
	var before_cash: float = game.state.cash
	var before_entries: int = game.state.ledger.size()
	if mode != "pawn": game.dispatch({"type": "ACCEPT"})
	var trade_id: String = game.state.trade.id
	game.dispatch({"type": "PAWN" if mode == "pawn" else "DELIVER", "tradeId": trade_id})
	var overlap := false
	var start := Time.get_ticks_msec()
	while page.busy and Time.get_ticks_msec() - start < 7000:
		if is_instance_valid(page.customer) and page.customer.walking and is_instance_valid(page.mat_item) and not page.mat_item.is_queued_for_deletion(): overlap = true
		if mode == "reduced": check(page.find_children("cash_bill*", "Control", true, false).is_empty(), "reduced motion skips flying notes")
		await frame()
	check(not page.busy and not overlap, mode + " completes handover before departure")
	check(is_equal_approx(tray.cash, game.state.cash), mode + " cash pile reaches saved balance")
	check(game.state.ledger.size() == before_entries + 1, mode + " records exactly one payment")
	check(game.state.cash > before_cash if mode == "sell" else game.state.cash < before_cash, mode + " payment has correct direction")
	if mode == "pawn": check(game.state.inventory.any(func(it): return it.owner == "pawn"), "pawn leaves the original watch in safekeeping")
	tray.set_cash(0.0)
	check(is_zero_approx(tray.cash), "zero balance leaves an empty tray")
	tray.set_cash(game.state.cash)
