class_name Customer
extends Node2D
## A painted half-body portrait rigged by a grid mesh and a vertex shader.
## Moods cross-fade between painted expressions; motion is procedural.

signal arrived
signal left

const MOODS := ["neutral", "focused", "question", "happy", "reject", "tired"]
var size := Vector2(434, 724)
var mat: ShaderMaterial
var current: MeshInstance2D
var incoming: MeshInstance2D
var textures := {}
var normal: Texture2D
var t := 0.0
var talking := 0.0
var look := 0.0           # -1..1, where the visitor looks
var walking := false
var gesture := {"nod": 0.0, "turn": 0.0, "tilt": 0.0, "lean": 0.0, "shrug": 0.0, "flash": 0.0}
var mood := "neutral"

func _init() -> void:
	normal = load("res://assets/chars/chr004_n.png")
	for m in MOODS:
		textures[m] = load("res://assets/chars/chr004_%s.png" % m)
	size = (textures["neutral"] as Texture2D).get_size()
	mat = ShaderMaterial.new()
	mat.shader = load("res://shaders/customer.gdshader")
	mat.set_shader_parameter("size", size)
	var mesh := _grid(size, 10, 22)
	current = _part(mesh, "neutral")
	incoming = _part(mesh, "neutral")
	incoming.modulate.a = 0.0

func _grid(s: Vector2, cols: int, rows: int) -> ArrayMesh:
	var verts := PackedVector2Array()
	var uvs := PackedVector2Array()
	var idx := PackedInt32Array()
	for y in rows + 1:
		for x in cols + 1:
			var uv := Vector2(float(x) / cols, float(y) / rows)
			verts.append(uv * s)
			uvs.append(uv)
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
	return m

func _part(mesh: ArrayMesh, m: String) -> MeshInstance2D:
	var mi := MeshInstance2D.new()
	mi.mesh = mesh
	mi.texture = _tex(m)
	mi.material = mat
	mi.position = Vector2(-size.x * 0.5, -size.y)
	add_child(mi)
	return mi

func _tex(m: String) -> CanvasTexture:
	var c := CanvasTexture.new()
	c.diffuse_texture = textures[m]
	c.normal_texture = normal
	c.specular_color = Color(0.25, 0.22, 0.2)
	c.specular_shininess = 0.35
	return c

## Cross-fade to another painted expression.
func set_mood(m: String) -> void:
	if m == mood or not textures.has(m):
		return
	mood = m
	incoming.texture = _tex(m)
	incoming.modulate.a = 0.0
	var tw := create_tween()
	tw.tween_property(incoming, "modulate:a", 1.0, 0.18)
	tw.tween_callback(func():
		current.texture = incoming.texture
		incoming.modulate.a = 0.0)

func _process(delta: float) -> void:
	t += delta
	talking = maxf(0.0, talking - delta)
	var breath := sin(t * (2.2 if talking > 0.0 else 1.55))
	var talk_nod := sin(t * 11.0) * 1.6 * minf(1.0, talking * 3.0)
	mat.set_shader_parameter("breath", breath)
	mat.set_shader_parameter("head_nod", gesture.nod + talk_nod + sin(t * 0.8) * 0.8)
	mat.set_shader_parameter("head_turn", gesture.turn + look * 7.0)
	mat.set_shader_parameter("head_tilt", gesture.tilt + sin(t * 0.63) * 0.018 + look * 0.03)
	mat.set_shader_parameter("lean", gesture.lean + sin(t * 0.47) * 3.5)
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

## Walk from `from_x` to the current position with a stepping bob, then settle.
func walk_in(from_x: float) -> void:
	var dest := position
	position.x = from_x
	walking = true
	var tw := create_tween()
	tw.tween_method(func(p: float):
		position.x = lerpf(from_x, dest.x, p)
		position.y = dest.y - absf(sin(p * PI * 5.0)) * 16.0 * (1.0 - p * 0.3)
		gesture.lean = (dest.x - from_x) * -0.012 * (1.0 - p)
		rotation = sin(p * PI * 5.0) * 0.012, 0.0, 1.0, 1.25).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
	tw.tween_callback(func():
		rotation = 0.0
		position = dest
		walking = false
		arrived.emit())
	tw.tween_method(func(v): gesture.lean = v, 6.0, 0.0, 0.35).set_trans(Tween.TRANS_BACK)

func walk_out(to_x: float) -> void:
	var start := position
	walking = true
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

## Screen point near the visitor's mouth, for the speech bubble.
func mouth() -> Vector2:
	return to_global(Vector2(size.x * 0.12, -size.y * 0.74))

func hands() -> Vector2:
	return to_global(Vector2(0, -size.y * 0.32))
