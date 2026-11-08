class_name PawnItem
extends Node2D
## A physical object on the counter: picked up with inertia and tilt, casts a
## lifting shadow, lands with squash, dust and sound, and flips over.

signal dropped
signal flipped(back: bool)

var body: Sprite2D
var shadow: Sprite2D
var mat: ShaderMaterial
var serial: Label
var front: CanvasTexture
var back_tex: CanvasTexture
var back := false
var dragging := false
var grab := Vector2.ZERO
var target := Vector2.ZERO
var vel := Vector2.ZERO
var lift := 0.0
var lift_target := 0.0
var hover := 0.0
var bounds := Rect2(560, 700, 900, 170)
var display_scale := 0.72
var busy := false

func _init() -> void:
	front = Util.lit("res://assets/items/itm011_front.png", "res://assets/items/itm011_front_n.png", 0.55, 0.7)
	back_tex = Util.lit("res://assets/items/itm011_back.png", "res://assets/items/itm011_back_n.png", 0.55, 0.7)
	shadow = Sprite2D.new()
	shadow.texture = Util.radial(256, 0.35)
	shadow.modulate = Color(0, 0, 0, 0.62)
	shadow.material = Util.unshaded()
	add_child(shadow)
	body = Sprite2D.new()
	body.texture = front
	mat = ShaderMaterial.new()
	mat.shader = load("res://shaders/item.gdshader")
	body.material = mat
	body.scale = Vector2.ONE * display_scale
	add_child(body)
	# Old registry number under the new paint; only the UV wand shows it.
	serial = Label.new()
	serial.text = "HX-0417 · 回环港务登记"
	serial.add_theme_font_override("font", load("res://assets/fonts/orbital-mono.ttf"))
	serial.add_theme_font_size_override("font_size", 30)
	serial.add_theme_color_override("font_color", Color(0.55, 1.0, 0.82))
	serial.add_theme_color_override("font_outline_color", Color(0.2, 1.0, 0.7, 0.5))
	serial.add_theme_constant_override("outline_size", 6)
	var rm := ShaderMaterial.new()
	rm.shader = load("res://shaders/reveal.gdshader")
	serial.material = rm
	serial.position = Vector2(-150, 30)
	serial.rotation = -0.12
	serial.visible = false
	body.add_child(serial)

func tex_size() -> Vector2:
	return (front.diffuse_texture as Texture2D).get_size()

func contains(global_point: Vector2) -> bool:
	var p := body.to_local(global_point)
	var s := tex_size() * 0.42
	return absf(p.x) < s.x and absf(p.y) < s.y

## Global position of a point given in the item's texture UV.
func uv_global(uv: Vector2) -> Vector2:
	return body.to_global((uv - Vector2(0.5, 0.5)) * tex_size())

func serial_center() -> Vector2:
	return serial.get_global_transform() * (serial.size * 0.5)

func begin_drag(global_point: Vector2) -> void:
	if busy:
		return
	dragging = true
	grab = position - get_parent().to_local(global_point)
	lift_target = 34.0
	target = position

func drag_to(global_point: Vector2) -> void:
	if dragging:
		target = get_parent().to_local(global_point) + grab
		target.x = clampf(target.x, bounds.position.x, bounds.end.x)
		target.y = clampf(target.y, bounds.position.y, bounds.end.y)

func end_drag() -> void:
	if not dragging:
		return
	dragging = false
	land()

func land(height := 0.0) -> void:
	lift_target = 0.0
	if height > 0.0:
		lift = height
	var tw := create_tween()
	tw.tween_property(self, "lift", 0.0, 0.16).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)
	tw.tween_callback(func(): dropped.emit())
	tw.tween_property(body, "scale", Vector2(1.07, 0.9) * display_scale, 0.06)
	tw.tween_property(body, "scale", Vector2.ONE * display_scale, 0.22).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)

func flip() -> void:
	if busy:
		return
	busy = true
	var tw := create_tween()
	tw.tween_property(self, "lift", 40.0, 0.12).set_trans(Tween.TRANS_SINE)
	tw.parallel().tween_property(body, "scale:x", 0.0, 0.14).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN)
	tw.tween_callback(func():
		back = not back
		body.texture = back_tex if back else front
		mat.set_shader_parameter("back_face", 1.0 if back else 0.0)
		serial.visible = back
		flipped.emit(back))
	tw.tween_property(body, "scale:x", display_scale, 0.2).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tw.tween_callback(func():
		busy = false
		land())

func _process(delta: float) -> void:
	if dragging:
		var prev := position
		position = position.lerp(target, 1.0 - exp(-delta * 16.0))
		vel = (position - prev) / maxf(delta, 0.0001)
		lift = lerpf(lift, lift_target, 1.0 - exp(-delta * 14.0))
	else:
		vel = vel.lerp(Vector2.ZERO, 1.0 - exp(-delta * 10.0))
	body.rotation = lerpf(body.rotation, clampf(vel.x * 0.00045, -0.22, 0.22), 1.0 - exp(-delta * 12.0))
	body.position = Vector2(0, -lift)
	var h := clampf(lift / 60.0, 0.0, 1.0)
	shadow.position = Vector2(lift * 0.35, tex_size().y * 0.3 * display_scale)
	shadow.scale = Vector2(tex_size().x * display_scale / 256.0 * (1.15 + h * 0.25), 0.34 * (1.0 + h * 0.2))
	shadow.modulate.a = 0.6 * (1.0 - h * 0.55)
	mat.set_shader_parameter("hover", hover)
