extends SceneTree
## Actual modal selection and batch dispatch, not a duplicate transaction model.
var failures := 0
var shell

func _initialize() -> void: call_deferred("run")
func frames() -> void:
	for i in 10: await process_frame
func check(ok: bool, message: String) -> void:
	print("MATERIAL GRID ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func keyed(key: String, node: Node = null) -> Button:
	if node == null: node = shell.modal_layer
	if node is Button and not node.is_queued_for_deletion() and node.get_meta("merchant_focus", "") == key: return node
	for child in node.get_children():
		var found := keyed(key, child)
		if found != null: return found
	return null
func refresh() -> void:
	shell.page._populate_merchant(shell.modal_layer.find_child("merchant_contents", true, false))
	await frames()
func run() -> void:
	var game = root.get_node("Game")
	game.prefs.sound = false
	game.prefs.reduced_motion = true
	game.state = Model.create("MATERIAL-GRID")
	game.state.cursor = 4
	game.dispatch({"type": "ARRIVE"})
	shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	shell.page._merchant_shop()
	await frames()
	var card := keyed("material:MAT-002")
	check(card != null, "materials are selectable cards")
	if card == null:
		shell.queue_free()
		await frames()
		quit(1)
		return
	var cash: float = game.state.cash
	var owned: float = game.state.materials["MAT-002"]
	var ap: float = game.state.ap
	card.pressed.emit()
	await frames()
	check(game.state.cash == cash, "selection does not spend cash")
	keyed("qty:plus").pressed.emit()
	await frames()
	var buy := keyed("buy:MAT-002")
	check(buy != null and not buy.disabled and buy.text.contains("20 Cr"), "batch purchase shows the two-patch total")
	buy.grab_focus()
	buy.pressed.emit()
	await frames()
	check(game.state.cash == cash - 20 and game.state.materials["MAT-002"] == owned + 2 and game.state.trade.stock["MAT-002"] == 3, "batch buy transfers exactly two and deducts stock")
	buy = keyed("buy:MAT-002")
	check(buy != null and buy.has_focus() and buy.text.contains("20 Cr"), "refresh retains selection quantity and keyboard focus")
	keyed("sell:MAT-002").pressed.emit()
	await frames()
	check(game.state.cash == cash - 10 and game.state.materials["MAT-002"] == owned and game.state.ap == ap, "batch sell uses recovery price and no material trade consumes AP")
	game.state.cash = 0
	await refresh()
	check(keyed("buy:MAT-002").disabled, "no cash disables purchase")
	game.state.cash = 1000
	game.state.trade.stock["MAT-002"] = 1
	game.state.materials["MAT-002"] = 1
	await refresh()
	check(keyed("buy:MAT-002").disabled and keyed("sell:MAT-002").disabled, "one-unit stock cannot satisfy a two-unit batch")
	keyed("qty:minus").pressed.emit()
	await frames()
	check(not keyed("buy:MAT-002").disabled and not keyed("sell:MAT-002").disabled, "smaller quantity restores valid actions")
	keyed("qty:minus").pressed.emit()
	check(keyed("qty:minus").disabled, "quantity never drops below one")
	var contents = shell.modal_layer.find_child("merchant_contents", true, false)
	contents.set_meta("material_quantity", 100)
	await refresh()
	check(keyed("qty:plus").disabled and keyed("buy:MAT-002").text.contains("990 Cr"), "quantity respects the reducer's 99-unit transaction limit")
	for window in [Vector2i(1440,900), Vector2i(844,390), Vector2i(390,844)]:
		shell.close_top_modal()
		root.size = window
		await frames()
		shell.page._merchant_shop()
		await frames()
		var all_fit := true
		for material in GameData.materials:
			var item := keyed("material:" + material.id)
			all_fit = all_fit and item != null
			if item != null:
				all_fit = all_fit and item.get_global_rect().position.x >= 0 and item.get_global_rect().end.x <= root.get_visible_rect().size.x + 1
		if not all_fit:
			var node: Node = keyed("material:MAT-001")
			while node is Control:
				print("LAYOUT ", node.name, " rect=", node.get_global_rect(), " min=", node.get_combined_minimum_size())
				node = node.get_parent()
		check(all_fit, "all material cards fit horizontally at " + str(window))
		var first := keyed("material:MAT-001")
		var second := keyed("material:MAT-002")
		check(is_equal_approx(first.global_position.y, second.global_position.y), "materials remain horizontally browsable at " + str(window))
		var purchase := keyed("buy:MAT-001")
		var clip = shell.modal_layer.find_child("ModalSheet", true, false)
		check(clip.get_global_rect().encloses(purchase.get_global_rect()), "primary purchase is visible without scrolling at " + str(window))
	shell.close_top_modal()
	await frames()
	game.dispatch({"type": "REFUSE"})
	shell.page._merchant_shop()
	check(not shell.modal_open(), "departed merchant has no stale controls")
	shell.queue_free()
	await frames()
	print("MATERIAL GRID failures=", failures)
	quit(1 if failures else 0)
