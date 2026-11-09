extends SceneTree
## Persistent in-shop workspaces: state/physical identity and layered input.
var failures: Array[String] = []
var shell
func _initialize() -> void:
	call_deferred("audit")
func check(ok: bool, message: String) -> void:
	print("WORKSPACE ", "PASS " if ok else "FAIL ", message)
	if not ok:
		failures.append(message)
func frame() -> void:
	await process_frame
	await process_frame
func key_press(code: Key, shift := false) -> void:
	var event := InputEventKey.new()
	event.keycode = code
	event.shift_pressed = shift
	event.pressed = true
	Input.parse_input_event(event)
	await frame()
	event.pressed = false
	Input.parse_input_event(event)
	await frame()
func key_escape() -> void:
	await key_press(KEY_ESCAPE)
func click(point: Vector2) -> void:
	var pos := root.get_final_transform() * point
	var mm := InputEventMouseMotion.new()
	mm.position = pos
	Input.parse_input_event(mm)
	await frame()
	for pressed in [true, false]:
		var mb := InputEventMouseButton.new()
		mb.button_index = MOUSE_BUTTON_LEFT
		mb.pressed = pressed
		mb.position = pos
		mb.global_position = pos
		Input.parse_input_event(mb)
		await frame()
func audit() -> void:
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frame()
	shell._close_title()
	game.new_game("ORBITAL-P0")
	var repair_uid: String = game.state.inventory[2].uid
	game.focus_uid = repair_uid
	shell.go("repair", repair_uid)
	await frame()
	var repair_page = shell.active_shell().page
	check(repair_page.it_uid == repair_uid, "Repair opens with the requested repairable item selected")
	var repair_labels := ""
	for label in repair_page.info.find_children("*", "Label", true, false):
		repair_labels += label.text + "\n"
	check(repair_labels.contains("尚无检验记录") and not repair_labels.contains(Model.fault_label(game.item(repair_uid))), "Repair does not show a hidden functional result before inspection")
	var to_inspect: Button = null
	for control in repair_page.info.find_children("*", "Button", true, false):
		if control.text == "去鉴定":
			to_inspect = control
			break
	check(to_inspect != null and not to_inspect.disabled, "Repair offers a usable route to inspect the selected item")
	if to_inspect != null:
		var before_ap: float = game.state.ap
		to_inspect.pressed.emit()
		await frame()
		check(shell.active_shell().page_name == "inspect" and shell.active_shell().page.it_uid == repair_uid, "Going to inspection preserves the selected physical item")
		check(game.state.ap == before_ap and game.item(repair_uid).evidence.is_empty(), "Changing benches does not spend AP or create evidence")
	var assembly_uid: String = game.state.inventory[3].uid
	shell.go("repair", assembly_uid)
	await frame()
	var assembly_page = shell.active_shell().page
	var assembly_inspect: Button = null
	for control in assembly_page.info.find_children("*", "Button", true, false):
		if control.text == "去鉴定":
			assembly_inspect = control
			break
	check(assembly_page.it_uid == assembly_uid and assembly_inspect != null, "Assembly-only items also offer a route to inspection")
	if assembly_inspect != null:
		assembly_inspect.pressed.emit()
		await frame()
		check(shell.active_shell().page_name == "inspect" and shell.active_shell().page.it_uid == assembly_uid, "Assembly item stays selected when going to inspection")
	shell.go("counter")
	await frame()
	game.state = Model.reduce(game.state, {"type":"ARRIVE"})
	shell.go("counter")
	await frame()
	var home = shell.page
	var visitor = home.customer
	var lot = home.mat_item
	home.dial.set_value(137)
	var position_before: Vector2 = lot.position
	var cursor_before: int = game.state.cursor
	# Keep a GUI dial captured while opening equipment with the keyboard.
	var dial_point: Vector2 = home.dial.get_global_rect().get_center()
	var down := InputEventMouseButton.new()
	down.button_index = MOUSE_BUTTON_LEFT
	down.pressed = true
	down.position = root.get_final_transform() * dial_point
	Input.parse_input_event(down)
	await frame()
	var origin: Button = home.fixture_buttons.inspect
	origin.grab_focus()
	shell.go("inspect")
	await frame()
	check(shell.page == home and is_instance_valid(visitor), "Opening inspection keeps the live home and visitor")
	if not shell.has_method("workspace_open"):
		check(false, "Equipment opens an in-scene workspace")
		quit(1)
		return
	check(shell.workspace_open() and shell.workspace_shell.page_name == "inspect", "Inspection runs in the work drawer")
	var captured := InputEventMouseMotion.new()
	captured.button_mask = MOUSE_BUTTON_MASK_LEFT
	captured.position = root.get_final_transform() * (dial_point - Vector2(0,60))
	Input.parse_input_event(captured)
	await frame()
	check(home.dial.value == 137, "Opening a drawer cancels a captured quote drag")
	down.pressed = false
	down.position = captured.position
	Input.parse_input_event(down)
	await frame()
	check(not shell.workspace_shell.hud.visible and not shell.workspace_shell.nav.visible, "Work drawer suppresses duplicate navigation")
	var inspection = shell.workspace_shell.page
	var viewport: Viewport = shell.workspace_shell.get_viewport()
	await key_press(KEY_TAB)
	check(viewport.gui_get_focus_owner() == inspection.tool_buttons["TOL-001"], "Tab reaches the first inspection instrument")
	check(root.gui_get_focus_owner() == null, "Entering the embedded viewport releases root Close focus")
	if viewport.gui_get_focus_owner() == inspection.tool_buttons["TOL-001"]:
		await key_press(KEY_ENTER)
	check(shell.workspace_open() and inspection.tool == "TOL-001", "Enter activates the focused embedded instrument exactly once")
	await key_press(KEY_TAB, true)
	check(root.gui_get_focus_owner() == shell.workspace_close and viewport.gui_get_focus_owner() == null, "Shift+Tab bridges back to Close and clears embedded focus")
	await key_press(KEY_TAB)
	var reached_controls := viewport.gui_get_focus_owner() != null
	check(reached_controls, "Tab reaches controls inside the equipment drawer")
	var cycled_to_close := false
	for index in 40:
		await key_press(KEY_TAB)
		if root.gui_get_focus_owner() == shell.workspace_close:
			cycled_to_close = true
			break
	check(cycled_to_close and viewport.gui_get_focus_owner() == null, "Forward Tab cycles through the drawer back to Close")
	await key_press(KEY_TAB)
	# A click outside the sheet cannot ring the service bell or drag the home lot.
	await click(Vector2(70, 550))
	check(game.state.cursor == cursor_before and lot.position == position_before, "Drawer blocks background input")
	var before_modal = game.state.duplicate(true)
	var prior_focus: Control = viewport.gui_get_focus_owner()
	var m: Array = shell.workspace_shell.modal("检验记录", 420)
	await frame()
	var popup: Control = shell.workspace_shell.modal_layer.get_child(0)
	check(viewport.gui_get_focus_owner() != null and popup.is_ancestor_of(viewport.gui_get_focus_owner()) and root.gui_get_focus_owner() == null, "Embedded modal takes exclusive keyboard focus")
	await key_press(KEY_TAB)
	await key_press(KEY_TAB, true)
	check(viewport.gui_get_focus_owner() != null and popup.is_ancestor_of(viewport.gui_get_focus_owner()), "Tab and Shift+Tab stay inside an embedded modal")
	var popup_focus: Control = viewport.gui_get_focus_owner()
	var nested: Array = shell.workspace_shell.modal("确认检验记录", 420)
	await frame()
	var top_popup: Control = shell.workspace_shell.modal_layer.get_child(1)
	await key_press(KEY_TAB)
	await key_press(KEY_TAB, true)
	check(viewport.gui_get_focus_owner() != null and top_popup.is_ancestor_of(viewport.gui_get_focus_owner()), "Nested embedded popup traps both Tab directions")
	if viewport.gui_get_focus_owner() != null and top_popup.is_ancestor_of(viewport.gui_get_focus_owner()):
		await key_press(KEY_ENTER)
	check(shell.workspace_open() and shell.workspace_shell.modal_layer.get_child_count() == 1 and viewport.gui_get_focus_owner() == popup_focus, "Enter closes only the nested popup and restores the first popup")
	if shell.workspace_shell.modal_layer.get_child_count() > 1:
		nested[1].call()
		await frame()
	if viewport.gui_get_focus_owner() != null and popup.is_ancestor_of(viewport.gui_get_focus_owner()):
		await key_press(KEY_ENTER)
	check(shell.workspace_open() and not shell.workspace_shell.modal_open(), "Enter closes the focused embedded popup without closing the drawer")
	if shell.workspace_shell.modal_open():
		m[1].call()
		await frame()
	check(game.state == before_modal and inspection.tool == "TOL-001", "Modal Enter does not trigger a background action or dispatch")
	check(viewport.gui_get_focus_owner() == prior_focus, "Closing the embedded popup restores its previous control")
	var root_modal: Array = shell.modal("店内提示", 420)
	await frame()
	check(viewport.gui_get_focus_owner() == null and shell.modal_layer.get_child(0).is_ancestor_of(root.gui_get_focus_owner()), "A root modal over the drawer clears embedded focus")
	await key_press(KEY_TAB, true)
	await key_press(KEY_ENTER)
	check(shell.workspace_open() and not shell.modal_open() and game.state == before_modal, "Root modal traps Enter without touching the drawer or game")
	check(viewport.gui_get_focus_owner() == prior_focus and root.gui_get_focus_owner() == null, "Closing a root popup restores embedded focus exclusively")
	m = shell.workspace_shell.modal("检验记录", 420)
	await frame()
	await key_escape()
	check(shell.workspace_open() and not shell.workspace_shell.modal_open(), "Escape dismisses only the top popup")
	await key_escape()
	check(not shell.workspace_open(), "Escape closes the work drawer")
	check(root.gui_get_focus_owner() == origin, "Closing the drawer restores the originating fixture")
	check(shell.page == home and home.customer == visitor and home.mat_item == lot, "Returning retains the same physical customer and lot")
	check(home.dial.value == 137 and lot.position == position_before, "Returning retains quote and object position")
	for name in ["repair", "warehouse", "orders", "report"]:
		var saved_trade = game.state.trade
		if name == "report":
			game.state.trade = null # The settlement action is disabled with a visitor.
		shell.go(name)
		await frame()
		check(shell.workspace_open() and shell.workspace_shell.page_name == name, name + " opens in the same shop")
		await key_press(KEY_TAB)
		check(shell.workspace_shell.get_viewport().gui_get_focus_owner() != null and root.gui_get_focus_owner() == null, name + " controls are keyboard reachable")
		shell.go("counter")
		await frame()
		check(shell.page == home and not shell.workspace_open(), name + " returns to the original counter")
		game.state.trade = saved_trade
	# A signal from an embedded page must update rather than recreate the home.
	shell.go("inspect")
	await frame()
	check(game.dispatch({"type":"CHECK", "uid":lot.uid, "tool":"TOL-001"}), "Inspection publishes a real game update")
	await frame()
	shell.go("counter")
	await frame()
	check(shell.page == home and home.dial.value == 137, "Shared game notifications do not reset the home quote")
	print("WORKSPACE failures=", failures.size())
	shell.queue_free()
	await frame()
	quit(1 if not failures.is_empty() else 0)
