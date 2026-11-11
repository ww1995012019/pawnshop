extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func frames() -> void:
	for i in 12: await process_frame
func check(ok: bool, text: String) -> void:
	print("RENT UI ", "PASS " if ok else "FAIL ", text)
	if not ok: failures += 1
func button(node: Node, text: String) -> Button:
	if node is Button and node.text.contains(text) and not node.is_queued_for_deletion(): return node
	for child in node.get_children():
		var found := button(child,text)
		if found != null: return found
	return null
func run() -> void:
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	game.state = Model.create("RENT-UI")
	game.state.day = 7
	game.state.cash = 2000
	game.state.inspection = "cleared"
	NightCrime.ensure_day(game.state)
	game.state.nightCrime.days["7"].inspection = false
	game.state.nightCrime.days["7"].inspectionDone = true
	game.dispatch({"type":"CALL_LANDLORD"})
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	await frames()
	var pay := button(shell.page.actions,"缴纳本期租金")
	check(pay != null and not pay.disabled, "visiting landlord exposes explicit payment control")
	check(shell.page.customer != null and shell.page.customer.npc_id == "CHR-034", "landlord has a physical counter portrait")
	if pay != null:
		pay.pressed.emit()
		await frames()
		check(game.state.cash == 1550 and button(shell.page.actions,"回执") != null, "payment produces an in-person receipt without auto-departure")
		shell.go("report")
		await frames()
		check(button(shell.workspace_shell.page,"请房东") == null, "paid rent does not request another collection")
	shell.queue_free()
	await frames()
	game.state = Model.create("RENT-RAISE-FUNDS")
	game.state.day = 14
	game.state.cash = 1
	game.state.ap = 0
	game.state.inspection = "cleared"
	NightCrime.ensure_day(game.state)
	game.state.nightCrime.days["14"].inspection = false
	game.state.nightCrime.days["14"].inspectionDone = true
	game.dispatch({"type":"CALL_LANDLORD"})
	game.dispatch({"type":"LANDLORD_LATER","tradeId":game.state.trade.id})
	shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	shell.go("warehouse",game.state.inventory[0].uid)
	await frames()
	var clear_stock := button(shell.workspace_shell.page,"应急清仓")
	check(clear_stock != null and not clear_stock.disabled, "landlord fundraising exposes legal stock clearance at zero AP")
	shell.queue_free()
	await frames()
	print("RENT UI failures=",failures)
	quit(1 if failures else 0)
