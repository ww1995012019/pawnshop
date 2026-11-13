extends Node
## Shared title-bar dragging for root and embedded native Control windows.
var window: Control
var handle: Control
var area: Callable
var begin_drag: Callable
var dragging := false
var moved := false
var grab_offset := Vector2.ZERO

func setup(target: Control, title_bar: Control, bounds: Callable, on_begin := Callable()) -> void:
	window = target
	handle = title_bar
	area = bounds
	begin_drag = on_begin
	window.set_meta("window_drag", self)
	handle.mouse_filter = Control.MOUSE_FILTER_STOP
	handle.mouse_default_cursor_shape = Control.CURSOR_CAN_DROP
	handle.gui_input.connect(_header_input)
	handle.resized.connect(reposition.call_deferred)

func _parent_pointer(point: Vector2) -> Vector2:
	return window.get_parent().get_global_transform_with_canvas().affine_inverse() * point

func _header_input(event: InputEvent) -> void:
	if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT:
		if event.pressed:
			# GUI event positions are local to the title bar. Capture the pointer
			# before settling any opening animation that can change its transform.
			var pointer: Vector2 = handle.get_global_transform_with_canvas() * event.position
			if begin_drag.is_valid(): begin_drag.call()
			grab_offset = _parent_pointer(pointer) - window.position
			dragging = true
			handle.mouse_default_cursor_shape = Control.CURSOR_DRAG
		else:
			_stop()
		handle.accept_event()

func _input(event: InputEvent) -> void:
	if not dragging or not is_instance_valid(window): return
	if not window.is_visible_in_tree():
		_stop()
		return
	if event is InputEventMouseMotion:
		moved = true
		window.position = _clamped(_parent_pointer(event.position) - grab_offset)
		get_viewport().set_input_as_handled()
	elif event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and not event.pressed:
		_stop()
		get_viewport().set_input_as_handled()

func _process(_delta: float) -> void:
	# A release can be consumed outside an embedded viewport or on a GUI key.
	if dragging and (not window.is_visible_in_tree() or not Input.is_mouse_button_pressed(MOUSE_BUTTON_LEFT)):
		_stop()

func _stop() -> void:
	dragging = false
	if is_instance_valid(handle): handle.mouse_default_cursor_shape = Control.CURSOR_CAN_DROP

func _clamped(point: Vector2) -> Vector2:
	var bounds: Rect2 = area.call()
	var parent_transform: Transform2D = window.get_parent().get_global_transform_with_canvas().affine_inverse()
	var title_rect: Rect2 = (parent_transform * handle.get_global_transform_with_canvas()) * Rect2(Vector2.ZERO,handle.size)
	var offset := title_rect.position - window.position
	# Large windows may move aside; retain enough title bar to drag them back.
	var visible_width := minf(240.0, title_rect.size.x)
	var left := bounds.position.x - offset.x - title_rect.size.x + visible_width
	var right := bounds.end.x - offset.x - visible_width
	var top := bounds.position.y - offset.y
	var bottom := maxf(top,bounds.end.y - offset.y - title_rect.size.y)
	return Vector2(clampf(point.x,minf(left,right),maxf(left,right)),clampf(point.y,top,bottom))

func reposition() -> void:
	if not is_instance_valid(window) or not window.is_inside_tree(): return
	var bounds: Rect2 = area.call()
	var point := window.position if moved or dragging else bounds.position + ((bounds.size-window.size*window.scale)*0.5).floor()
	window.position = _clamped(point)
