class_name ItemSprite
extends Node2D
## A physical object in the room: normal-mapped atlas art lit by the scene,
## picked up with inertia and tilt, a lifting contact shadow, a landing squash,
## flipping to its back, and hidden layers that only instruments reveal.

signal dropped
signal flipped(back: bool)
signal flip_finished(back: bool)

var def_id := ""
var uid := ""
var body: Sprite2D
var motion_pivot: Node2D
var shadow: Sprite2D
var mat: ShaderMaterial
var reveal: Label
var back := false
var dragging := false
var grab := Vector2.ZERO
var target := Vector2.ZERO
var vel := Vector2.ZERO
var lift := 0.0
var lift_target := 0.0
var hover := 0.0
var bounds := Rect2(-10000, -10000, 20000, 20000)
var display_scale := 1.0
var busy := false
var draggable := true
var land_tween: Tween
var logo_variant := 0

## height: on-screen height in px for the front face.
func setup(id: String, item_uid := "", height := 300.0, start_back := false) -> void:
	def_id = id
	uid = item_uid
	back = start_back
	shadow = Sprite2D.new()
	shadow.texture = Util.radial(256, 0.35)
	shadow.modulate = Color(0, 0, 0, 0.6)
	shadow.material = Util.unshaded()
	add_child(shadow)
	body = Sprite2D.new()
	body.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	body.region_enabled = true
	mat = ShaderMaterial.new()
	mat.shader = load("res://shaders/item.gdshader")
	body.material = mat
	motion_pivot = Node2D.new()
	motion_pivot.name = "motion_pivot"
	add_child(motion_pivot)
	motion_pivot.add_child(body)
	_apply_face()
	display_scale = height / body.region_rect.size.y
	body.scale = Vector2.ONE * display_scale
	reveal = Label.new()
	reveal.add_theme_font_override("font", UIKit.mono)
	reveal.add_theme_font_size_override("font_size", 26)
	reveal.add_theme_color_override("font_color", Color(0.55, 1.0, 0.82))
	reveal.add_theme_color_override("font_outline_color", Color(0.2, 1.0, 0.7, 0.5))
	reveal.add_theme_constant_override("outline_size", 6)
	var rm := ShaderMaterial.new()
	rm.shader = load("res://shaders/reveal.gdshader")
	reveal.material = rm
	reveal.rotation = -0.1
	reveal.visible = false
	body.add_child(reveal)

func _apply_face() -> void:
	var cell := UIKit.item_cell(def_id, back)
	body.texture = UIKit.lit_atlas(cell.key)
	body.region_rect = cell.region
	var asz: Vector2 = UIKit.tex("res://assets/atlas/%s.png" % cell.key).get_size()
	var it = Game.item(uid) if not uid.is_empty() else null
	logo_variant = WatchRules.logo_variant(it) if it != null else 0
	if not back and logo_variant != 0:
		body.texture = UIKit.watch_variant_texture(def_id)
		body.region_rect = Rect2(8.96, 8.96, 238.08, 238.08)
		asz = Vector2(256, 256)
	var r: Rect2 = body.region_rect
	mat.set_shader_parameter("region", Vector4(r.position.x / asz.x, r.position.y / asz.y, r.size.x / asz.x, r.size.y / asz.y))
	mat.set_shader_parameter("back_face", 1.0 if back else 0.0)

func logo_world_position() -> Vector2:
	return body.to_global(Vector2(0, -24))

func set_reveal(text: String, at_uv: Vector2) -> void:
	reveal.text = text
	reveal.reset_size()
	reveal.position = (at_uv - Vector2(0.5, 0.5)) * tex_size() - reveal.size * 0.5
	reveal.visible = true

func tex_size() -> Vector2:
	return body.region_rect.size

func contains(global_point: Vector2) -> bool:
	var p := body.to_local(global_point)
	var s := tex_size() * 0.44
	return absf(p.x) < s.x and absf(p.y) < s.y

func uv_global(uv: Vector2) -> Vector2:
	return body.to_global((uv - Vector2(0.5, 0.5)) * tex_size())

func reveal_center() -> Vector2:
	return reveal.get_global_transform() * (reveal.size * 0.5)

func begin_drag(global_point: Vector2) -> void:
	if busy or not draggable:
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
	if dragging:
		dragging = false
		land()

func land(height := 0.0) -> void:
	lift_target = 0.0
	if height > 0.0:
		lift = height
	if land_tween != null and land_tween.is_valid():
		land_tween.kill()
	var tw := create_tween()
	land_tween = tw
	tw.tween_property(self, "lift", 0.0, 0.16).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)
	tw.tween_callback(func(): dropped.emit())
	tw.tween_property(body, "scale", Vector2(1.07, 0.9) * display_scale, 0.06)
	tw.tween_property(body, "scale", Vector2.ONE * display_scale, 0.22).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)

func flip() -> void:
	if busy:
		return
	if dragging:
		end_drag()
	if land_tween != null and land_tween.is_valid():
		land_tween.kill()
	if Game.prefs.reduced_motion:
		lift = 0.0
		lift_target = 0.0
		body.position = Vector2.ZERO
		body.scale = Vector2.ONE * display_scale
		back = not back
		_apply_face()
		flipped.emit(back)
		flip_finished.emit(back)
		return
	busy = true
	var tw := create_tween()
	tw.tween_property(self, "lift", 40.0, 0.12).set_trans(Tween.TRANS_SINE)
	tw.parallel().tween_property(body, "scale:x", 0.0, 0.14).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN)
	tw.tween_callback(func():
		back = not back
		_apply_face()
		flipped.emit(back))
	tw.tween_property(body, "scale:x", display_scale, 0.2).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tw.tween_callback(func():
		busy = false
		land()
		flip_finished.emit(back))

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
	var foot := tex_size() * display_scale
	shadow.position = Vector2(lift * 0.35, foot.y * 0.36)
	shadow.scale = Vector2(foot.x / 256.0 * (1.05 + h * 0.25), foot.x / 256.0 * 0.2 * (1.0 + h * 0.2))
	shadow.modulate.a = 0.6 * (1.0 - h * 0.55)
	mat.set_shader_parameter("hover", hover)
