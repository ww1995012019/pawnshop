class_name ServiceBell
extends Node2D
## Brass counter bell, drawn in code: the dome rocks and rings when struck.

signal rung
var shake := 0.0
var waves: Array[float] = []
var radius := 44.0
var enabled := true

func hit_test(global_point: Vector2) -> bool:
	return to_local(global_point).distance_to(Vector2(0, -26)) < radius

func strike() -> void:
	shake = 0.7
	waves.append(0.0)
	var tw := create_tween()
	tw.tween_property(self, "scale", Vector2(1.06, 0.88), 0.05)
	tw.tween_property(self, "scale", Vector2.ONE, 0.25).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	rung.emit()

func _process(delta: float) -> void:
	shake = maxf(0.0, shake - delta)
	for i in waves.size():
		waves[i] += delta
	waves = waves.filter(func(w): return w < 0.8)
	queue_redraw()

func _draw() -> void:
	var a := sin(shake * 60.0) * shake * 0.25
	draw_set_transform(Vector2.ZERO, a, Vector2.ONE)
	_ellipse(Vector2(3, 3), Vector2(52, 12), Color(0, 0, 0, 0.45))
	_ellipse(Vector2.ZERO, Vector2(48, 12), Color("2a221c"))
	_ellipse(Vector2(0, -4), Vector2(48, 11), Color("5a4027"))
	_ellipse(Vector2(0, -6), Vector2(46, 9), Color("a37a43"))
	_dome(40.0, 62.0, Color("6e4a22"))
	_dome(38.0, 60.0, Color("a3712f"))
	_dome(33.0, 56.0, Color("c9913f"))
	_dome(23.0, 50.0, Color("e2ae5a"))
	_ellipse(Vector2(-13, -34), Vector2(6, 12), Color(1, 0.95, 0.82, 0.85))
	draw_rect(Rect2(-4, -66, 8, 12), Color("4a3520"))
	_ellipse(Vector2(0, -68), Vector2(11, 5), Color("b88a45"))
	_ellipse(Vector2(0, -70), Vector2(9, 4), Color("f0c878"))
	draw_set_transform(Vector2.ZERO, 0, Vector2.ONE)
	for w in waves:
		var r := 30.0 + w * 140.0
		draw_arc(Vector2(0, -50), r, PI * 1.15, PI * 1.85, 24, Color(1, 0.84, 0.58, (1.0 - w / 0.8) * 0.8), 3.0)

func _dome(r: float, h: float, c: Color) -> void:
	var pts := PackedVector2Array()
	for i in 25:
		var t := float(i) / 24.0
		var ang := PI * t
		pts.append(Vector2(-cos(ang) * r, -6.0 - sin(ang) * h * (0.9 + 0.1 * sin(ang))))
	draw_colored_polygon(pts, c)

func _ellipse(c: Vector2, r: Vector2, col: Color) -> void:
	var pts := PackedVector2Array()
	for i in 32:
		var ang := TAU * i / 32.0
		pts.append(c + Vector2(cos(ang) * r.x, sin(ang) * r.y))
	draw_colored_polygon(pts, col)
