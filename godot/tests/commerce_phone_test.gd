extends SceneTree
## The phone bridge must expose and authorize the same merchant transactions.

var failures := 0

func _initialize() -> void:
	call_deferred("run")

func check(condition: bool, message: String) -> void:
	print("COMMERCE PHONE ", "PASS " if condition else "FAIL ", message)
	if not condition:
		failures += 1

func frame() -> void:
	await process_frame
	await process_frame

func run() -> void:
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	game.state = Model.create("PHONE-MERCHANT")
	game.state.cursor = 4
	var commerce = load("res://scripts/model/commerce.gd")
	game.state = commerce.reduce(game.state, {"type": "ARRIVE"})
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frame()
	shell._close_title()
	await frame()
	var bridge = load("res://scripts/app/web_touch.gd").new()
	shell.add_child(bridge)
	bridge.setup(shell)
	var status: Dictionary = bridge.snapshot()
	check(status.get("merchant", false) and status.get("merchant_goods", []).size() == GameData.materials.size(),
		"the phone can distinguish a merchant and see all basic and task-specific supplies")
	var before_cash: float = game.state.cash
	var before_owned: float = game.state.materials["MAT-001"]
	bridge.command({"type": "merchant_buy", "id": "MAT-001"})
	check(game.state.cash == before_cash - 8 and game.state.materials["MAT-001"] == before_owned + 1,
		"a phone purchase updates actual cash and material inventory")
	var repair_uid: String = game.state.inventory[0].uid
	shell.go("repair", repair_uid)
	await frame()
	before_cash = game.state.cash
	var during_repair: float = game.state.materials["MAT-001"]
	bridge.command({"type": "buy_repair_material", "uid": repair_uid, "id": "MAT-001"})
	bridge.command({"type": "merchant_buy", "id": "MAT-001"})
	check(game.state.cash == before_cash and game.state.materials["MAT-001"] == during_repair,
		"even during a visit, repair shortcuts cannot bypass the counter")
	shell.close_workspace()
	await frame()
	before_cash = game.state.cash
	var modal: Array = shell.modal("核对", 420)
	await frame()
	bridge.command({"type": "merchant_sell", "id": "MAT-001"})
	check(game.state.cash == before_cash, "a native modal blocks phone merchant transactions")
	modal[1].call()
	await frame()
	bridge.command({"type": "merchant_sell", "id": "MAT-001"})
	check(game.state.cash == before_cash + 4, "the phone can sell surplus material")
	game.dispatch({"type": "REFUSE"})
	before_cash = game.state.cash
	bridge.command({"type": "merchant_buy", "id": "MAT-001"})
	check(game.state.cash == before_cash, "stale phone commands cannot buy after the merchant leaves")
	var deadline := Time.get_ticks_msec() + 5000
	while shell.page.busy and Time.get_ticks_msec() < deadline:
		await process_frame
	var uid: String = game.state.inventory[0].uid
	shell.go("warehouse", uid)
	await frame()
	status = bridge.snapshot()
	check(status.get("forge_uid", "") == uid and status.get("forge_reason", "missing") == "",
		"the selected eligible warehouse item exposes a phone forgery action")
	var before_ap: float = game.state.ap
	bridge.command({"type": "forge", "uid": uid})
	await frame()
	check(not Model.find_inventory(game.state, uid).has("forgery") and game.state.ap == before_ap and shell.active_shell().page_name == "repair" and shell.active_shell().page.mode == "forge",
		"a phone forgery command opens physical work without silently committing or charging")
	print("COMMERCE PHONE failures=", failures)
	shell.queue_free()
	await frame()
	quit(1 if failures else 0)
