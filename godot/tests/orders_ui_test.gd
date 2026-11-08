extends SceneTree

func _initialize() -> void:
	call_deferred("run_check")

func check(condition: bool, message: String) -> void:
	if not condition:
		push_error(message)
		quit(1)
		assert(condition, message)

func find_button(node: Node, caption: String) -> Button:
	for child in node.get_children():
		if child is Button and child.text == caption:
			return child
		var found := find_button(child, caption)
		if found != null:
			return found
	return null

func find_picker(node: Node) -> OptionButton:
	for child in node.get_children():
		if child is OptionButton:
			return child
		var found := find_picker(child)
		if found != null:
			return found
	return null

func run_check() -> void:
	var game = root.get_node("Game")
	game.new_game("ORBITAL-P0")
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await process_frame
	shell._close_title()
	shell.go("orders")
	await process_frame
	var page = shell.page
	check(page.counts.open > 0, "open orders missing")
	check(page.counts.active == 0, "active should start empty")
	check(page.scrollers.open.visible and not page.scrollers.active.visible, "only selected list should show")
	var accept := find_button(page.cols.open, "接取订单")
	check(accept != null, "accept button missing")
	accept.pressed.emit()
	await process_frame
	check(page.counts.active == 1, "accept should add active order")
	check(page.selected_status == "active", "accept should reveal active tab")
	check(page.scrollers.active.visible and not page.scrollers.open.visible, "active list visibility wrong")
	check(page.tabs.active.text.ends_with("01"), "tab count not updated")
	var commission: Dictionary = game.state.orders[0]
	var it = game.item(commission.get("uid", ""))
	check(it != null, "commission original missing")
	var deliver := find_button(page.cols.active, "交付（1 AP）")
	check(deliver != null and deliver.disabled, "unqualified delivery should be disabled")
	it.condition = 1.0
	it.working = true
	it.repaired = true
	it.evidence = ["TOL-001", "TOL-002"]
	page._refresh()
	var picker := find_picker(page.cols.active)
	for i in picker.item_count:
		if picker.get_item_metadata(i) == it.uid:
			picker.select(i)
			picker.item_selected.emit(i)
	deliver = find_button(page.cols.active, "交付（1 AP）")
	check(not deliver.disabled, "qualified original should be deliverable")
	var old_ap: float = game.state.ap
	deliver.pressed.emit()
	await process_frame
	check(page.counts.active == 0 and page.counts.closed == 1, "delivery should move commission to history")
	check(game.state.ap == old_ap - 1, "delivery should spend exactly one AP")
	page._select_status("closed")
	check(page.counts.closed == 1, "closed should include delivery")
	page._select_status("active")
	check(find_button(page.cols.active, "查看可接订单") != null, "empty state lacks action")
	find_button(page.cols.active, "查看可接订单").pressed.emit()
	check(page.selected_status == "open", "empty state action did not switch")
	print("Orders tabs: counts, accept, selection and empty action passed")
	quit(0)
