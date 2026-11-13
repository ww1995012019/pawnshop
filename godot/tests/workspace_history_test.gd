extends SceneTree
## Closing a linked workspace returns to its suspended physical page.
var failures := 0
var shell
func _initialize() -> void: call_deferred("run")
func frames() -> void:
	for i in 10: await process_frame
func check(ok: bool, label: String) -> void:
	print("WORKSPACE HISTORY ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1
func escape() -> void:
	var event := InputEventKey.new()
	event.keycode = KEY_ESCAPE
	event.pressed = true
	Input.parse_input_event(event)
	await frames()
	event.pressed = false
	Input.parse_input_event(event)
	await frames()
func button(node: Node, text: String) -> Button:
	for child in node.find_children("*", "Button", true, false):
		if child.text == text: return child
	return null
func run() -> void:
	var game = root.get_node("Game")
	game.prefs.sound = false
	game.prefs.reduced_motion = true
	game.state = Model.create("WORKSPACE-HISTORY")
	game.state.storageExpansion = WarehouseExpansion.default_state(5)
	var lot := Model.new_item(game.state, "WCH-007", {"condition":0.55,"working":true,"sourceVerified":true})
	Model.put_in(game.state, lot)
	var uid: String = lot.uid
	shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	var counter = shell.page
	# Returning a linked warehouse's original cannot leave a ghost on the mat.
	var return_lot := Model.new_item(game.state, "WCH-001", {"owner":"shop","condition":0.9,"sourceVerified":true})
	Model.put_in(game.state, return_lot)
	var return_uid: String = return_lot.uid
	shell.go("inspect", return_uid)
	await frames()
	var return_inspection = shell.active_shell().page
	var removed_sprite = return_inspection.item
	shell.go("warehouse", return_uid)
	await frames()
	check(game.dispatch({"type":"RETURN_ITEM","uid":return_uid}) and game.item(return_uid) == null, "linked warehouse actually returns the inspected original")
	shell.close_workspace()
	await frames()
	check(shell.active_shell().page == return_inspection and not is_instance_valid(removed_sprite) and return_inspection.it_uid != return_uid and game.item(return_inspection.it_uid) != null, "resumed inspection replaces the removed physical item with valid available stock")
	var picker_valid: bool = return_inspection.picker.get_selected_metadata() == return_inspection.it_uid
	for index in return_inspection.picker.item_count:
		picker_valid = picker_valid and return_inspection.picker.get_item_metadata(index) != return_uid
	check(picker_valid, "resumed inspection picker removes the returned original and selects its valid replacement")
	shell.go("counter")
	await frames()
	for dimensions in [Vector2i(1440,900), Vector2i(390,844), Vector2i(844,390)]:
		root.size = dimensions
		shell.phone_override = dimensions.x < 1000
		shell._fit()
		await frames()
		shell.go("warehouse", uid)
		await frames()
		var warehouse_shell = shell.active_shell()
		var warehouse = warehouse_shell.page
		warehouse.select(uid)
		await frames()
		warehouse.grid_scroll.scroll_vertical = 120
		var detail_scroll: ScrollContainer = warehouse.detail_panel.get_child(0)
		detail_scroll.scroll_vertical = 70
		await frames()
		var grid_scroll: int = warehouse.grid_scroll.scroll_vertical
		var detail_position: int = detail_scroll.scroll_vertical
		check(grid_scroll > 0, str(dimensions) + " starts from scrolled expanded storage")
		var origin := button(warehouse, "去维修")
		check(origin != null, "selected warehouse item has repair navigation")
		if origin == null: continue
		origin.grab_focus()
		origin.pressed.emit()
		await frames()
		var repair = shell.active_shell().page
		check(shell.active_shell().page_name == "repair" and repair.it_uid == uid, "linked repair keeps the selected physical item")
		check(is_instance_valid(warehouse) and not warehouse.is_visible_in_tree() and not warehouse.can_process(), "linked navigation suspends the original warehouse instance")
		var cleaning_progress := {}
		if repair.task == "dust":
			var stroke_y := 0.2 if dimensions.x > 1000 else 0.4 if dimensions.y > dimensions.x else 0.6
			repair._wipe_uv(Vector2(0.1,stroke_y), Vector2(0.8,stroke_y))
			cleaning_progress = repair.cleaning.serialize()
			check(repair.cleaning_unsaved, "linked repair has outstanding physical cleaning progress")
		shell.close_workspace()
		await frames()
		if not cleaning_progress.is_empty():
			check(game.item(uid).service.operations.get("dust",{}) == cleaning_progress, "Close saves the outstanding cleaning progress before returning")
		check(shell.workspace_open() and shell.active_shell().page == warehouse, "Close returns to the same warehouse page at " + str(dimensions))
		if shell.workspace_open() and shell.active_shell().page == warehouse:
			check(warehouse.selected == uid and warehouse.grid_scroll.scroll_vertical == grid_scroll and detail_scroll.scroll_vertical == detail_position, "changed repair state preserves warehouse selection and both scroll positions")
			check(warehouse.can_process() and warehouse.is_visible_in_tree(), "return resumes only the restored warehouse")
			var restored_focus: Control = warehouse_shell.get_viewport().gui_get_focus_owner()
			check(restored_focus is Button and restored_focus.text == "去维修", "return restores the originating warehouse action focus")
		shell.go("counter")
		await frames()
		check(not shell.workspace_open() and shell.page == counter, "counter navigation closes the complete workspace history")
	# Escape removes one workspace layer, with popup precedence intact.
	shell.phone_override = false
	root.size = Vector2i(1440,900)
	shell._fit()
	shell.go("warehouse", uid)
	await frames()
	var original = shell.active_shell().page
	shell.go("repair", uid)
	await frames()
	var repair = shell.active_shell().page
	shell.active_shell().go("inspect", uid)
	await frames()
	shell.active_shell().modal("记录", 420)
	await frames()
	await escape()
	check(shell.workspace_open() and shell.active_shell().page_name == "inspect" and not shell.active_shell().modal_open(), "Escape closes the top popup before returning a workspace")
	await escape()
	check(shell.workspace_open() and shell.active_shell().page == repair, "Escape returns inspection to its original repair page exactly once")
	await escape()
	check(shell.workspace_open() and shell.active_shell().page == original, "a second Escape returns repair to the original warehouse")
	await escape()
	check(not shell.workspace_open() and shell.page == counter, "last Escape returns to the persistent counter")
	# Selecting a different item in the current module keeps its old behavior.
	shell.go("warehouse", uid)
	await frames()
	original = shell.active_shell().page
	shell.go("repair", uid)
	await frames()
	var other_uid: String = game.state.inventory[0].uid
	shell.go("repair", other_uid)
	await frames()
	check(shell.active_shell().page.it_uid == other_uid and shell.workspace_history.size() == 1, "same-module navigation selects the requested new item without another history entry")
	shell.close_workspace()
	await frames()
	check(shell.workspace_open() and shell.active_shell().page == original and original.selected == uid, "closing a reselected repair still returns to the original warehouse selection")
	check(game.workbench_item().uid == uid, "restored warehouse selection also restores the physical item used by manuals and tools")
	shell.go("counter")
	await frames()
	# A physical treatment in a linked module updates the original UV label.
	game.item(uid).watch.serial = "XX WRONG 2400 864209"
	shell.go("inspect", uid)
	await frames()
	var inspection = shell.active_shell().page
	inspection._set_tool("TOL-002")
	await frames()
	var physical_item = inspection.item
	physical_item.position += Vector2(29,-14)
	physical_item.target = physical_item.position
	var placed: Vector2 = physical_item.position
	var back: bool = physical_item.back
	var prior_serial: String = physical_item.reveal.text
	shell.go("repair", uid)
	await frames()
	var before_forgery: Dictionary = game.state.duplicate(true)
	WatchForgery.apply(game.item(uid), "serial")
	game.changed.emit(before_forgery, game.state, {"type":"FORGE","uid":uid,"method":"serial"})
	await frames()
	shell.close_workspace()
	await frames()
	check(shell.workspace_open() and shell.active_shell().page == inspection and inspection.item == physical_item, "returning from serial treatment preserves the original inspection and physical item")
	check(prior_serial != WatchRules.serial(game.item(uid)) and physical_item.reveal.text == WatchRules.serial(game.item(uid)), "resumed UV reveal shows the actual current serial treatment")
	check(inspection.tool == "TOL-002" and physical_item.position.is_equal_approx(placed) and physical_item.back == back, "refreshing the UV serial preserves the chosen tool, placement and flipped face")
	shell.go("counter")
	await frames()
	# A mobile close request waits for the current physical segment, then pops.
	shell.phone_override = true
	root.size = Vector2i(844,390)
	shell._fit()
	shell.go("warehouse", uid)
	await frames()
	original = shell.active_shell().page
	shell.go("repair", uid)
	await frames()
	repair = shell.active_shell().page
	repair.open_forgery("logo")
	await frames()
	repair.art.advance()
	repair.art.set_process(false)
	check(not repair.can_close_workspace(), "mobile regression starts with an in-flight physical segment")
	shell.close_workspace()
	check(shell.workspace_close_pending and shell.active_shell().page == repair, "mobile close waits for the active segment")
	repair.art._process(10.0)
	await frames()
	check(shell.workspace_open() and shell.active_shell().page == original and not shell.workspace_close_pending, "mobile delayed close returns to warehouse after its segment")
	shell.go("repair", uid)
	await frames()
	game.new_game("RESET-WORKSPACE-HISTORY")
	await frames()
	check(not shell.workspace_open() and not is_instance_valid(original), "new game discards every suspended workspace")
	print("WORKSPACE HISTORY failures=", failures)
	shell.queue_free()
	await frames()
	quit(1 if failures else 0)
