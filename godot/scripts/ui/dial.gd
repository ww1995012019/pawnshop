class_name Dial
extends Control
## A machined dial: drag up/down or scroll to change a value; clicks as it turns.

signal changed(value: int)
var value := 100
var min_value := 1
var max_value := 300
var step := 1
var enabled := true
var _drag := false
var _start_y := 0.0
var _start_v := 0

func _init() -> void:
	custom_minimum_size = Vector2(150, 150)
	mouse_default_cursor_shape = Control.CURSOR_VSIZE

func _gui_input(e: InputEvent) -> void:
	if not enabled:
		return
	if e is InputEventMouseButton:
		var mb := e as InputEventMouseButton
		if mb.button_index == MOUSE_BUTTON_LEFT:
			_drag = mb.pressed
			_start_y = mb.position.y
			_start_v = value
		elif mb.pressed and mb.button_index == MOUSE_BUTTON_WHEEL_UP:
			set_value(value + 5)
		elif mb.pressed and mb.button_index == MOUSE_BUTTON_WHEEL_DOWN:
			set_value(value - 5)
		accept_event()
	elif e is InputEventMouseMotion and _drag:
		set_value(_start_v + int(round((_start_y - (e as InputEventMouseMotion).position.y) / 3.0)) * step)
		accept_event()

func set_value(v: int, emit := true) -> void:
	v = clampi(v, min_value, max_value)
	if v != value:
		value = v
		queue_redraw()
		if emit:
			changed.emit(v)

func _draw() -> void:
	var c := size * 0.5
	var r := minf(size.x, size.y) * 0.5 - 14
	var t := float(value - min_value) / maxf(1.0, float(max_value - min_value))
	var ang := lerpf(-2.35, 2.35, t) - PI * 0.5
	draw_circle(c + Vector2(0, 5), r + 8, Color(0, 0, 0, 0.5))
	draw_circle(c, r + 8, Color("23292c"))
	for i in 29:
		var a := lerpf(-2.35, 2.35, i / 28.0) - PI * 0.5
		var big := i % 7 == 0
		var lit := i / 28.0 <= t
		draw_line(c + Vector2(cos(a), sin(a)) * (r + 2), c + Vector2(cos(a), sin(a)) * (r + (12 if big else 8)), (Color("ffb35c") if lit else Color("5d6762")) if enabled else Color("3a4240"), 2.0 if big else 1.2)
	draw_circle(c, r - 4, Color("4a5458"))
	draw_circle(c, (r - 4) * 0.86, Color("2f373a"))
	for i in 18:
		var g := ang + TAU * i / 18.0
		draw_line(c + Vector2(cos(g), sin(g)) * (r - 4) * 0.86, c + Vector2(cos(g), sin(g)) * (r - 4), Color("1d2326"), 2.0)
	draw_arc(c, (r - 4) * 0.78, PI * 1.1, PI * 1.6, 16, Color(1, 1, 1, 0.12), 6.0)
	draw_line(c + Vector2(cos(ang), sin(ang)) * r * 0.2, c + Vector2(cos(ang), sin(ang)) * r * 0.74, Color("ffb35c") if enabled else Color("6a6f6c"), 6.0)
	draw_circle(c, 8, Color("8b939a"))
