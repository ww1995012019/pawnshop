extends SceneTree
## Exercise the actual counter, merchant panel, repair panel and warehouse actions.

var failures := 0
var shell

func _initialize() -> void:
	call_deferred("run")

func check(condition: bool, message: String) -> void:
	print("COMMERCE UI ", "PASS " if condition else "FAIL ", message)
	if not condition:
		failures += 1

func frame() -> void:
	await process_frame
	await process_frame

func button_with_text(root_node: Node, needle: String) -> Button:
	if root_node is Button and String(root_node.text).contains(needle) and not root_node.is_queued_for_deletion():
		return root_node
	for child in root_node.get_children():
		var found := button_with_text(child, needle)
		if found != null:
			return found
	return null

func run() -> void:
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	game.state = Model.create("UI-MERCHANT")
	game.state.cursor = 4
	var commerce = load("res://scripts/model/commerce.gd")
	game.state = commerce.reduce(game.state, {"type": "ARRIVE"})
	shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frame()
	shell._close_title()
	await frame()
	var home = shell.page
	var open_shop := button_with_text(home.actions, "查看商品")
	check(open_shop != null and not open_shop.disabled, "the visiting merchant exposes a shop action on the counter")
	if open_shop != null:
		open_shop.pressed.emit()
		await frame()
		check(shell.modal_open(), "opening the merchant shows the goods panel")
		var buy := button_with_text(shell.modal_layer, "购买 导电纤维")
		check(buy != null and not buy.disabled, "basic repair materials can be bought from the merchant panel")
		if buy != null:
			var before_cash: float = game.state.cash
			var before_stock: float = game.state.materials["MAT-001"]
			buy.grab_focus()
			check(buy.has_focus(), "the merchant purchase control accepts keyboard focus")
			buy.pressed.emit()
			await frame()
			check(game.state.cash == before_cash - 8 and game.state.materials["MAT-001"] == before_stock + 1,
				"the merchant panel performs the real material transaction")
			var refreshed := button_with_text(shell.modal_layer, "购买 导电纤维")
			check(refreshed != null and refreshed.has_focus(), "merchant purchase retains keyboard focus after the panel updates")
		shell.close_top_modal()
		await frame()
	game.dispatch({"type": "REFUSE"})
	await frame()
	shell.go("repair")
	await frame()
	var repair = shell.workspace_shell.page
	check(button_with_text(repair.info, "+1 ·") == null, "the repair bench has no always-available purchase buttons")
	shell.go("warehouse", game.state.inventory[0].uid)
	await frame()
	var warehouse = shell.workspace_shell.page
	var forge := button_with_text(warehouse.detail, "伪装造假")
	check(forge != null, "the warehouse exposes forgery on eligible owned goods")
	if forge != null:
		check(not forge.disabled, "forgery is actionable when the player has materials and AP")
	print("COMMERCE UI failures=", failures)
	shell.queue_free()
	await frame()
	quit(1 if failures else 0)
