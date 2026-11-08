extends Node
## Synthesised mouse input through the real event path: bell, drag, offer dial.
## godot --path godot -- --inputtest
var shell
var failures: Array[String] = []
var mouse_down := false

func check(ok: bool, description: String) -> void:
	print("INPUT ", "PASS " if ok else "FAIL ", description)
	if not ok:
		failures.append(description)

func click_button(button: Button) -> void:
	if button == null:
		check(false, "Required action button exists")
		return
	var center := button.get_global_rect().get_center()
	if button.get_viewport() != get_viewport():
		center += shell.workspace_container.get_global_rect().position
	_send_motion(center)
	await get_tree().process_frame
	_send_button(center, true)
	await get_tree().process_frame
	_send_button(center, false)
	await get_tree().create_timer(0.4).timeout

func find_action(prefix: String) -> Button:
	for child in shell.page.actions.get_children():
		if child is Button and child.text.begins_with(prefix):
			return child
	return null

## Base-resolution UI point -> window pixels (parse_input_event applies the stretch).
func _win(p: Vector2) -> Vector2:
	return get_viewport().get_final_transform() * p

func _send_button(pos: Vector2, pressed: bool) -> void:
	pos = _win(pos)
	mouse_down = pressed
	var mb := InputEventMouseButton.new()
	mb.button_mask = MOUSE_BUTTON_MASK_LEFT if pressed else 0
	mb.button_index = MOUSE_BUTTON_LEFT
	mb.pressed = pressed
	mb.position = pos
	mb.global_position = pos
	Input.parse_input_event(mb)

func _send_motion(pos: Vector2) -> void:
	pos = _win(pos)
	var mm := InputEventMouseMotion.new()
	mm.position = pos
	mm.global_position = pos
	mm.button_mask = MOUSE_BUTTON_MASK_LEFT if mouse_down else 0
	Input.parse_input_event(mm)

func run(s) -> void:
	shell = s
	Game.new_game("ORBITAL-P0")
	await get_tree().create_timer(1.0).timeout
	var bell_ui: Vector2 = shell.world_to_ui(shell.page.bell.global_position + Vector2(0, -26))
	_send_motion(bell_ui)
	await get_tree().process_frame
	var h := get_viewport().gui_get_hovered_control()
	print("INPUT hovered: ", h, " ", h.get_path() if h else "")
	_send_button(bell_ui, true)
	_send_button(bell_ui, false)
	await get_tree().create_timer(3.5).timeout
	check(Game.state.trade != null, "Bell click opens a trade")
	if shell.page.mat_item == null:
		check(false, "Trade has a draggable item")
		get_tree().quit(1)
		return
	var it_ui: Vector2 = shell.world_to_ui(shell.page.mat_item.global_position)
	var before: Vector2 = shell.page.mat_item.position
	_send_motion(it_ui)
	await get_tree().process_frame
	_send_button(it_ui, true)
	for i in 15:
		_send_motion(it_ui + Vector2(-20 * i, -3 * i))
		await get_tree().process_frame
	await get_tree().create_timer(0.3).timeout
	check(shell.page.mat_item.position.distance_to(before) > 100, "Real pointer drag moves the item")
	_send_button(it_ui + Vector2(-280, -42), false)
	await get_tree().create_timer(0.5).timeout
	var old_value: int = shell.page.dial.value
	var wheel := InputEventMouseButton.new()
	wheel.button_index = MOUSE_BUTTON_WHEEL_UP
	wheel.pressed = true
	wheel.position = _win(shell.page.dial.get_global_rect().get_center())
	wheel.global_position = wheel.position
	Input.parse_input_event(wheel)
	await get_tree().process_frame
	# A complete wheel gesture releases GUI mouse focus before later clicks.
	wheel.pressed = false
	Input.parse_input_event(wheel)
	await get_tree().process_frame
	var quote: int = shell.page.dial.value
	check(quote == mini(old_value + 5, shell.page.dial.max_value), "Wheel changes quote")
	var offer := find_action("出价")
	check(offer != null and offer.text.contains(str(quote)), "Offer button shows the chosen quote")
	await click_button(shell.page.fixture_buttons.inspect)
	check(shell.workspace_open() and shell.workspace_shell.page_name == "inspect", "Inspection equipment opens its drawer")
	await click_button(shell.workspace_close)
	check(shell.page_name == "counter" and shell.page.dial.value == quote, "Returning preserves the chosen quote")
	await click_button(find_action("接受 " + UIKit.money(Game.state.trade.price)))
	check(Game.state.trade != null and Game.state.trade.locked, "Accept button locks the price")
	var cash_before: float = Game.state.cash
	await click_button(find_action(("支付 " if Game.state.trade.kind == "buy" else "收款 ") + UIKit.money(Game.state.trade.price) + " 并交割"))
	check(Game.state.trade == null and Game.state.cash != cash_before, "Delivery button completes the transaction")
	await get_tree().create_timer(4.0).timeout
	await click_button(shell.page.fixture_buttons.orders)
	check(shell.workspace_open() and shell.workspace_shell.page_name == "orders", "CRT equipment opens orders")
	await click_button(shell.workspace_close)
	await click_button(shell.page.fixture_buttons.report)
	check(shell.workspace_open() and shell.workspace_shell.page_name == "report", "Counter ledger opens daily accounts")
	get_tree().quit(1 if not failures.is_empty() else 0)
