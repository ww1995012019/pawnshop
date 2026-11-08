class_name Knob
extends Control
## A machined dial: drag up/down (or scroll) to set the counter-offer in 5 Cr steps.

signal changed(value: int)
var value := 100
var min_value := 20
var max_value := 300
var enabled := true
var mono: Font
var _drag := false
var _start_y := 0.0
var _start_v := 0
var _spin := 0.0

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
	elif e is InputEventMouseMotion and _drag:
		set_value(_start_v + int(round((_start_y - (e as InputEventMouseMotion).position.y) / 6.0)) * 5)

func set_value(v: int) -> void:
	v = clampi(v, min_value, max_value)
	if v != value:
		_spin += (v - value) * 0.02
		value = v
		changed.emit(v)
		queue_redraw()

func angle() -> float:
	return lerpf(-2.35, 2.35, float(value - min_value) / float(max_value - min_value))

func _process(delta: float) -> void:
	_spin = lerpf(_spin, 0.0, 1.0 - exp(-delta * 10.0))
	queue_redraw()

func _draw() -> void:
	var c := Vector2(76, 75)
	var r := 58.0
	draw_circle(c + Vector2(0, 6), r + 6, Color(0, 0, 0, 0.5))
	draw_circle(c, r + 6, Color("23292c"))
	for i in 29:
		var a := lerpf(-2.35, 2.35, i / 28.0) - PI * 0.5
		var big := i % 7 == 0
		var p0 := c + Vector2(cos(a), sin(a)) * (r + 8)
		var p1 := c + Vector2(cos(a), sin(a)) * (r + (18 if big else 13))
		draw_line(p0, p1, Color("c9a46a") if big else Color("6f7871"), 2.0 if big else 1.2)
	draw_circle(c, r, Color("4a5458"))
	draw_circle(c, r * 0.86, Color("2f373a"))
	var a2 := angle() - PI * 0.5
	for i in 18:
		var g := a2 + TAU * i / 18.0
		draw_line(c + Vector2(cos(g), sin(g)) * r * 0.86, c + Vector2(cos(g), sin(g)) * r, Color("1d2326"), 2.0)
	draw_arc(c, r * 0.8, PI * 1.1, PI * 1.6, 16, Color(1, 1, 1, 0.12), 6.0)
	draw_line(c + Vector2(cos(a2), sin(a2)) * r * 0.25, c + Vector2(cos(a2), sin(a2)) * r * 0.8, Color("ffb35c"), 6.0)
	draw_circle(c, 9, Color("8b939a"))
	var col := Color("ffc27a") if enabled else Color("6a6f6c")
	draw_string(get_theme_default_font(), Vector2(170, 40), "我的出价", HORIZONTAL_ALIGNMENT_LEFT, -1, 22, Color("a9b8b3"))
	if mono:
		draw_string(mono, Vector2(170, 104), "%d Cr" % value, HORIZONTAL_ALIGNMENT_LEFT, -1, 56, col)
	draw_string(get_theme_default_font(), Vector2(170, 136), "上下拖动旋钮 · 滚轮微调", HORIZONTAL_ALIGNMENT_LEFT, -1, 16, Color("6f7d7f"))
