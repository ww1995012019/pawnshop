extends SceneTree
## The HTML controls must obey the same price and input boundaries as the desk.
var failures := 0
var shell
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	print("TOUCH ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func frame() -> void:
	await process_frame
	await process_frame
func run() -> void:
	if not ResourceLoader.exists("res://scripts/app/web_touch.gd"):
		check(false, "touch commands are available")
		quit(1)
		return
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frame()
	shell._close_title()
	game.new_game("ORBITAL-P0")
	game.state = Model.reduce(game.state, {"type":"ARRIVE"})
	shell.go("counter")
	await frame()
	var bridge = load("res://scripts/app/web_touch.gd").new()
	shell.add_child(bridge)
	bridge.setup(shell)
	var status: Dictionary = bridge.snapshot()
	check(status.price == 134 and status.offer == 107, "visitor price and draft remain distinct")
	check(status.projected_cash == 1066, "touch display projects actual purchase price")
	var before: Dictionary = game.state.duplicate(true)
	bridge.command({"type":"quote", "value":145})
	check(shell.page.dial.value == 145 and game.state == before, "editing a draft does not submit an offer or spend money")
	bridge.command({"type":"quote", "value":"invalid"})
	bridge.command({"type":"unknown"})
	check(shell.page.dial.value == 145 and game.state == before, "malformed and unknown commands do nothing")
	var visitor_uid: String = game.state.trade.item.uid
	var stock_uid: String = game.state.inventory[0].uid
	game.focus_uid = stock_uid
	bridge.command({"type":"page", "page":"inspect"})
	await frame()
	check(shell.workspace_shell.page.it_uid == visitor_uid, "counter touch inspection opens the visitor lot rather than stale stock focus")
	shell.go("warehouse", stock_uid)
	await frame()
	bridge.command({"type":"page", "page":"inspect"})
	await frame()
	check(shell.workspace_shell.page.it_uid == stock_uid, "switching an existing workspace preserves deliberate stock selection")
	bridge.command({"type":"tool", "tool":"SPEC"})
	bridge.command({"type":"specific_step", "uid":stock_uid, "index":0})
	bridge.command({"type":"specific_step", "uid":stock_uid, "index":0})
	bridge.command({"type":"specific_step", "uid":stock_uid, "index":0})
	check(shell.workspace_shell.page.specific_step == 1 and not game.item(stock_uid).evidence.has("SPEC"), "duplicate touch commands cannot skip specific inspection steps")
	bridge.command({"type":"specific_step", "uid":visitor_uid, "index":1})
	check(shell.workspace_shell.page.specific_step == 1, "stale touch commands cannot act on a different lot")
	bridge.command({"type":"specific_step", "uid":stock_uid, "index":1})
	check(not game.item(stock_uid).evidence.has("SPEC"), "the result is not recorded before the final operation")
	game.state.ap = 0
	var no_ap: Dictionary = bridge.snapshot()
	check(not no_ap.get("specific_allowed", true) and no_ap.get("specific_reason", "").contains("行动点不足"), "phone shows why the final test cannot run without AP")
	game.item(stock_uid).inspectedPaid = true
	check(bridge.snapshot().get("specific_allowed", false), "phone permits a previously paid item's free test at zero AP")
	game.item(stock_uid).inspectedPaid = false
	game.state.upgrades.lamp = true
	check(bridge.snapshot().get("specific_allowed", false), "phone permits the free-inspection upgrade at zero AP")
	game.state.upgrades.lamp = false
	bridge.command({"type":"specific_step", "uid":stock_uid, "index":2})
	check(not shell.workspace_shell.page.specific_running and not game.item(stock_uid).evidence.has("SPEC"), "a blocked final step does not start or reveal a test")
	game.state.ap = 12
	bridge.command({"type":"specific_step", "uid":stock_uid, "index":2})
	if shell.workspace_shell.page.get("specific_running") == true:
		await create_timer(1.2).timeout
	check(game.item(stock_uid).evidence.has("SPEC"), "distinct touch steps complete the specific inspection")
	bridge.command({"type":"specific_step", "uid":stock_uid, "index":3})
	check(shell.workspace_shell.page.specific_step == 3, "out-of-range touch commands cannot advance a completed test")
	bridge.command({"type":"tool", "tool":""})
	check(shell.workspace_shell.page.tool == "", "touch can deselect a tool and return to moving the item")
	bridge.command({"type":"accept"})
	check(not game.state.trade.locked, "equipment drawer blocks background trade commands")
	shell.close_workspace()
	await frame()
	bridge.command({"type":"accept"})
	check(game.state.trade.locked and game.state.cash == 1200, "accept locks 134 Cr without paying the 145 Cr draft")
	var popup: Array = shell.modal("核对", 420)
	await frame()
	bridge.command({"type":"deliver"})
	check(game.state.cash == 1200 and game.state.trade != null, "native modal prevents touch delivery")
	popup[1].call()
	await frame()
	bridge.command({"type":"deliver"})
	await frame()
	check(game.state.cash == 1066 and game.state.trade == null, "touch delivery uses the reducer's atomic transfer")
	print("TOUCH failures=", failures)
	shell.queue_free()
	await frame()
	quit(1 if failures else 0)
