class_name Customer
extends Node2D
## A painted half-body portrait rigged by a grid mesh and a vertex shader.
## Moods cross-fade between painted expressions; motion is procedural.

signal arrived
signal left

var npc_id := "CHR-004"
var size := Vector2(434, 724)
var mat: ShaderMaterial
var current: MeshInstance2D
var incoming: MeshInstance2D
var t := 0.0
var talking := 0.0
var look := 0.0
var walking := false
var gesture := {"nod": 0.0, "turn": 0.0, "tilt": 0.0, "lean": 0.0, "shrug": 0.0, "flash": 0.0}
var mood := "neutral"
static var _mesh_cache := {}

func setup(id: String, start_mood := "neutral") -> void:
	npc_id = id
	mood = start_mood
	mat = ShaderMaterial.new()
	mat.shader = load("res://shaders/customer.gdshader")
	var cell := UIKit.npc_cell(id, mood)
	size = (cell.region as Rect2).size
	mat.set_shader_parameter("size", size)
	current = _part(cell)
	incoming = _part(cell)
	incoming.modulate.a = 0.0

func _mesh_for(cell: Dictionary) -> ArrayMesh:
	var atlas: Texture2D = UIKit.tex("res://assets/atlas/%s.png" % cell.key)
	var r: Rect2 = cell.region
	var asz := atlas.get_size()
	var uv0 := r.position / asz
	var uv1 := r.end / asz
	var key := "%s:%s:%s" % [cell.key, r, size]
	mat.set_shader_parameter("region", Vector4(uv0.x, uv0.y, uv1.x - uv0.x, uv1.y - uv0.y))
	if _mesh_cache.has(key):
		return _mesh_cache[key]
	var cols := 10
	var rows := 22
	var verts := PackedVector2Array()
	var uvs := PackedVector2Array()
	var idx := PackedInt32Array()
	for y in rows + 1:
		for x in cols + 1:
			var f := Vector2(float(x) / cols, float(y) / rows)
			verts.append(f * size)
			uvs.append(uv0 + (uv1 - uv0) * f)
	for y in rows:
		for x in cols:
			var i := y * (cols + 1) + x
			idx.append_array([i, i + 1, i + cols + 1, i + 1, i + cols + 2, i + cols + 1])
	var arrays := []
	arrays.resize(Mesh.ARRAY_MAX)
	arrays[Mesh.ARRAY_VERTEX] = verts
	arrays[Mesh.ARRAY_TEX_UV] = uvs
	arrays[Mesh.ARRAY_INDEX] = idx
	var m := ArrayMesh.new()
	m.add_surface_from_arrays(Mesh.PRIMITIVE_TRIANGLES, arrays)
	_mesh_cache[key] = m
	return m

func _part(cell: Dictionary) -> MeshInstance2D:
	var mi := MeshInstance2D.new()
	mi.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	mi.mesh = _mesh_for(cell)
	mi.texture = UIKit.lit_atlas(cell.key)
	mi.material = mat
	mi.position = Vector2(-size.x * 0.5, -size.y)
	add_child(mi)
	return mi

## Cross-fade to another painted expression (when this resident has one).
func set_mood(m: String) -> void:
	if m == mood:
		return
	mood = m
	var cell := UIKit.npc_cell(npc_id, m)
	incoming.mesh = _mesh_for(cell)
	incoming.texture = UIKit.lit_atlas(cell.key)
	incoming.modulate.a = 0.0
	var tw := create_tween()
	tw.tween_property(incoming, "modulate:a", 1.0, 0.18)
	tw.tween_callback(func():
		current.mesh = incoming.mesh
		current.texture = incoming.texture
		incoming.modulate.a = 0.0)

func _process(delta: float) -> void:
	t += delta
	talking = maxf(0.0, talking - delta)
	var still: bool = Game.prefs.reduced_motion
	var breath := 0.0 if still else sin(t * (2.2 if talking > 0.0 else 1.55))
	var talk_nod := 0.0 if still else sin(t * 11.0) * 1.6 * minf(1.0, talking * 3.0)
	mat.set_shader_parameter("breath", breath)
	mat.set_shader_parameter("head_nod", gesture.nod + talk_nod + (0.0 if still else sin(t * 0.8) * 0.8))
	mat.set_shader_parameter("head_turn", gesture.turn + look * 3.0)
	mat.set_shader_parameter("head_tilt", gesture.tilt + (0.0 if still else sin(t * 0.63) * 0.018) + look * 0.03)
	mat.set_shader_parameter("lean", gesture.lean + (0.0 if still else sin(t * 0.47) * 3.5))
	mat.set_shader_parameter("shrug", gesture.shrug)
	mat.set_shader_parameter("flash", gesture.flash)

func say(seconds: float) -> void:
	talking = seconds

func nod() -> void:
	var tw := create_tween()
	for i in 2:
		tw.tween_method(func(v): gesture.nod = v, 0.0, 11.0, 0.14).set_trans(Tween.TRANS_SINE)
		tw.tween_method(func(v): gesture.nod = v, 11.0, 0.0, 0.18).set_trans(Tween.TRANS_SINE)

func shake_head() -> void:
	var tw := create_tween()
	for v in [12.0, -12.0, 9.0, -6.0, 0.0]:
		tw.tween_method(func(x): gesture.turn = x; gesture.tilt = x * -0.004, gesture.turn, v, 0.11).set_trans(Tween.TRANS_SINE)

func lean_back() -> void:
	var tw := create_tween()
	tw.tween_method(func(v): gesture.lean = v, gesture.lean, -16.0, 0.22).set_trans(Tween.TRANS_BACK)
	tw.tween_interval(0.6)
	tw.tween_method(func(v): gesture.lean = v, -16.0, 0.0, 0.5).set_trans(Tween.TRANS_SINE)

func lean_in() -> void:
	var tw := create_tween()
	tw.tween_method(func(v): gesture.lean = v; gesture.nod = v * 0.4, 0.0, 14.0, 0.25).set_trans(Tween.TRANS_SINE)
	tw.tween_interval(0.7)
	tw.tween_method(func(v): gesture.lean = v; gesture.nod = v * 0.4, 14.0, 0.0, 0.45).set_trans(Tween.TRANS_SINE)

func cheer() -> void:
	var tw := create_tween()
	tw.tween_method(func(v): gesture.shrug = v; gesture.flash = v / 10.0, 0.0, 10.0, 0.12)
	tw.tween_method(func(v): gesture.shrug = v; gesture.flash = v / 10.0, 10.0, 0.0, 0.35).set_trans(Tween.TRANS_BOUNCE)
	nod()

func walk_in(from_x: float) -> void:
	var dest := position
	position.x = from_x
	walking = true
	if Game.prefs.reduced_motion:
		position = dest
		walking = false
		arrived.emit.call_deferred()
		return
	var tw := create_tween()
	tw.tween_method(func(p: float):
		position.x = lerpf(from_x, dest.x, p)
		position.y = dest.y - absf(sin(p * PI * 5.0)) * 16.0 * (1.0 - p * 0.3)
		gesture.lean = (dest.x - from_x) * -0.012 * (1.0 - p)
		rotation = sin(p * PI * 5.0) * 0.012, 0.0, 1.0, 1.2).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
	tw.tween_callback(func():
		rotation = 0.0
		position = dest
		walking = false
		arrived.emit())
	tw.tween_method(func(v): gesture.lean = v, 6.0, 0.0, 0.35).set_trans(Tween.TRANS_BACK)

func walk_out(to_x: float) -> void:
	var start := position
	walking = true
	if Game.prefs.reduced_motion:
		left.emit.call_deferred()
		return
	var tw := create_tween()
	tw.tween_method(func(p: float):
		position.x = lerpf(start.x, to_x, p)
		position.y = start.y - absf(sin(p * PI * 5.0)) * 16.0
		gesture.lean = (to_x - start.x) * -0.01 * minf(1.0, p * 4.0)
		rotation = sin(p * PI * 5.0) * 0.012
		modulate.a = 1.0 - smoothstep(0.75, 1.0, p), 0.0, 1.0, 1.3).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN)
	tw.tween_callback(func():
		walking = false
		left.emit())

func mouth() -> Vector2:
	return to_global(Vector2(size.x * 0.12, -size.y * 0.74))

func hands() -> Vector2:
	return to_global(Vector2(0, -size.y * 0.32))
