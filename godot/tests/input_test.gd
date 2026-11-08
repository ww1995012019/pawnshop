extends Node
## Synthesised mouse input through the real event path: bell, drag, offer dial.
## godot --path godot -- --inputtest
var shell

## Base-resolution UI point -> window pixels (parse_input_event applies the stretch).
func _win(p: Vector2) -> Vector2:
	return p * (Vector2(DisplayServer.window_get_size()) / get_viewport().get_visible_rect().size)

func _send_button(pos: Vector2, pressed: bool) -> void:
	pos = _win(pos)
	var mb := InputEventMouseButton.new()
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
	mm.button_mask = MOUSE_BUTTON_MASK_LEFT
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
	print("INPUT bell -> trade: ", Game.state.trade != null)
	if shell.page.mat_item == null:
		get_tree().quit()
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
	print("INPUT drag moved: ", shell.page.mat_item.position.distance_to(before) > 100)
	_send_button(it_ui + Vector2(-280, -42), false)
	await get_tree().create_timer(0.5).timeout
	get_tree().quit()
