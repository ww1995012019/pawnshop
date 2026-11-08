extends SceneTree
## GUI and world cursor behavior; use an isolated XDG_DATA_HOME when running.
var shell
var failures := 0
var down := false
func _initialize() -> void: call_deferred('run')
func check(ok: bool, label: String) -> void:
	print(('PASS ' if ok else 'FAIL ') + label + ' shape=' + str(Input.get_current_cursor_shape()))
	if not ok: failures += 1
func move(p: Vector2) -> void:
	var event := InputEventMouseMotion.new()
	event.position = root.get_final_transform() * p
	event.global_position = event.position
	event.button_mask = MOUSE_BUTTON_MASK_LEFT if down else 0
	Input.parse_input_event(event)
	await process_frame
	await process_frame
func left(p: Vector2, pressed: bool) -> void:
	down = pressed
	var event := InputEventMouseButton.new()
	event.position = root.get_final_transform() * p
	event.global_position = event.position
	event.button_index = MOUSE_BUTTON_LEFT
	event.button_mask = MOUSE_BUTTON_MASK_LEFT if down else 0
	event.pressed = pressed
	Input.parse_input_event(event)
	await process_frame
	await process_frame
func run() -> void:
	var game = root.get_node('Game')
	game.prefs.reduced_motion = true
	shell = load('res://main.tscn').instantiate()
	root.add_child(shell)
	await process_frame
	shell._close_title()
	game.new_game('ORBITAL-P0')
	await create_timer(0.3).timeout
	var p = shell.page
	var bell: Vector2 = shell.world_to_ui(p.bell.global_position + Vector2(0,-26))
	await move(bell)
	check(Input.get_current_cursor_shape() == Input.CURSOR_POINTING_HAND, 'bell hover')
	var button: Button = shell.nav_buttons.orders
	await move(button.get_global_rect().get_center())
	check(Input.get_current_cursor_shape() == Input.CURSOR_POINTING_HAND, 'button hover')
	var disabled: Button = p.stock_grid.get_child(19)
	await move(disabled.get_global_rect().get_center())
	check(Input.get_current_cursor_shape() != Input.CURSOR_POINTING_HAND, 'disabled button is not clickable')
	game.state = Model.reduce(game.state, {'type':'ARRIVE'})
	shell.go('counter')
	await create_timer(0.3).timeout
	p = shell.page
	var pos: Vector2 = shell.world_to_ui(p.mat_item.global_position)
	await move(pos)
	check(Input.get_current_cursor_shape() == Input.CURSOR_CAN_DROP, 'item hover')
	await left(pos,true)
	await move(pos + Vector2(25,0))
	check(Input.get_current_cursor_shape() == Input.CURSOR_DRAG, 'dragging item')
	var nav: Vector2 = shell.nav_buttons.orders.get_global_rect().get_center()
	await move(nav)
	check(Input.get_current_cursor_shape() == Input.CURSOR_DRAG, 'world drag stays closed over UI')
	await left(nav,false)
	check(not p.mat_item.dragging, 'drag ends when release is over UI')
	var panel_point: Vector2 = p.terminal.get_global_rect().position + Vector2(10,10)
	await move(panel_point)
	check(Input.get_current_cursor_shape() == Input.CURSOR_ARROW, 'ordinary panel returns to arrow')
	var field := LineEdit.new()
	field.position = Vector2(880, 320)
	field.size = Vector2(200, 52)
	shell.root_ui.add_child(field)
	await process_frame
	pos = shell.world_to_ui(p.mat_item.global_position)
	await move(pos)
	await left(pos,true)
	var field_point: Vector2 = field.get_global_rect().get_center()
	await move(field_point)
	check(Input.get_current_cursor_shape() == Input.CURSOR_DRAG, 'world drag stays closed over text input')
	await left(field_point,false)
	await move(field_point)
	check(Input.get_current_cursor_shape() == Input.CURSOR_IBEAM, 'text input restores text cursor')
	field.queue_free()
	await process_frame
	shell.go('inspect')
	await create_timer(0.2).timeout
	p = shell.page
	check(p.world_cursor_shape(p.item.global_position) == Input.CURSOR_CAN_DROP, 'inspection item is draggable')
	p._set_tool('TOL-001')
	await move(shell.world_to_ui(p.item.global_position))
	check(Input.get_current_cursor_shape() == Input.CURSOR_CROSS, 'magnifier uses crosshair')
	shell.go('warehouse')
	await create_timer(0.2).timeout
	p = shell.page
	var it = game.state.inventory[0]
	var grid_point: Vector2 = p.grid.global_position + Vector2(it.x + 0.5,it.y + 0.5)*p.CELL
	await move(grid_point)
	check(Input.get_current_cursor_shape() == Input.CURSOR_CAN_DROP, 'stock cell hover')
	await left(grid_point, true)
	await move(grid_point + Vector2(12, 0))
	check(Input.get_current_cursor_shape() == Input.CURSOR_DRAG, 'stock cell drag')
	await left(grid_point + Vector2(12, 0), false)
	await process_frame
	var empty_point: Vector2 = p.grid.global_position + Vector2(9.5,5.5)*p.CELL
	await move(empty_point)
	check(Input.get_current_cursor_shape() == Input.CURSOR_ARROW, 'empty cell hover')
	shell.open_help()
	await create_timer(0.2).timeout
	await move(grid_point)
	check(Input.get_current_cursor_shape() != Input.CURSOR_CAN_DROP, 'modal hides underlying cursor')
	print('failures=', failures)
	quit(1 if failures else 0)
