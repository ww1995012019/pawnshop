extends Node2D
## Workbench-only animations. The existing object stays on the mat; actions
## move its real sprite, selected original pixels, and a small physical fixture.

const SUPPORTED := ["open", "extract", "flow", "fill", "compare", "close", "heat", "unfold", "switch", "light", "insert", "align", "slide", "press", "lift", "balance", "bend", "release", "rotate", "spin", "cycle", "lock", "magnet", "flip", "pull", "growth", "seal", "cover", "connect", "signal", "pulse", "attach", "swing", "load", "inspect", "scan", "breath", "walk", "position", "weight", "stamp", "focus", "audio", "wipe"]

var actor: ItemSprite
var definition: Dictionary = {}
var actions: Array = []
var details: Dictionary = {}
var pieces := {}
var used_slots := {}
var step := -1
var cue := ""
var phase := 0.0
var active := false
var resting := false
var anchored := false
var show_result := false
var result_working := true
var result_active := false
var result_phase := 0.0
var flip_origin := false
var flip_applied := false

func setup(subject: ItemSprite, data: Dictionary) -> void:
	actor = subject
	definition = data
	actions = data.get("actions", ["inspect", "position", "scan"])
	details = data.get("details", {})
	name = "specific_motion"
	z_index = 80
	texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	material = Util.unshaded()

func start(index: int) -> void:
	step = index
	cue = String(actions[index])
	phase = 0.0
	active = true
	resting = false
	show_result = false
	result_active = false
	flip_origin = actor.back
	flip_applied = false
	var part_data = definition.get("parts", {}).get(str(index), {})
	if not actor.back and not pieces.has(index):
		if part_data is Array:
			for part in part_data:
				_create_part(index, part)
		elif part_data is Dictionary and not part_data.is_empty():
			_create_part(index, part_data)
	sample(0.0)

func _create_part(index: int, part_data: Dictionary) -> void:
	var slot := -1
	for candidate in 3:
		if not used_slots.has(candidate) and (not part_data.has("polygon") or candidate < 2):
			slot = candidate
			break
	if slot < 0:
		return
	var whole := actor.body.region_rect
	var sprite: Node2D
	if part_data.has("polygon"):
		var vertices: Array = part_data.polygon
		if vertices.size() != 16:
			return
		var low := Vector2.ONE
		var high := Vector2.ZERO
		for point in vertices:
			var v := Vector2(float(point[0]), float(point[1]))
			low = low.min(v)
			high = high.max(v)
		var center := (low + high) * 0.5
		if part_data.has("pivot"):
			center = Vector2(float(part_data.pivot[0]), float(part_data.pivot[1]))
		var polygon := Polygon2D.new()
		polygon.texture = actor.body.texture
		polygon.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		var points := PackedVector2Array()
		var uvs := PackedVector2Array()
		for point in vertices:
			var v := Vector2(float(point[0]), float(point[1]))
			points.append((v - center) * whole.size)
			uvs.append(whole.position + v * whole.size)
		polygon.polygon = points
		polygon.uv = uvs
		polygon.position = (center - Vector2(0.5, 0.5)) * whole.size
		actor.mat.set_shader_parameter("inspection_mask_%d" % slot, Vector4(low.x, low.y, high.x - low.x, high.y - low.y))
		for i in 8:
			var a: Array = vertices[i * 2]
			var b: Array = vertices[i * 2 + 1]
			actor.mat.set_shader_parameter("inspection_poly_%d_%s" % [slot, ["a", "b", "c", "d", "e", "f", "g", "h"][i]], Vector4(a[0], a[1], b[0], b[1]))
		actor.mat.set_shader_parameter("inspection_poly_%d_on" % slot, 1.0)
		sprite = polygon
	else:
		var v: Array = part_data.rect
		var r := Rect2(float(v[0]), float(v[1]), float(v[2]), float(v[3]))
		var px := Rect2(r.position * whole.size, r.size * whole.size)
		var cropped := Sprite2D.new()
		cropped.texture = actor.body.texture
		cropped.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		cropped.region_enabled = true
		cropped.region_rect = Rect2(whole.position + px.position, px.size)
		cropped.position = px.get_center() - whole.size * 0.5
		actor.mat.set_shader_parameter("inspection_mask_%d" % slot, Vector4(r.position.x, r.position.y, r.size.x, r.size.y))
		actor.mat.set_shader_parameter("inspection_mask_%d_on" % slot, 1.0)
		sprite = cropped
	sprite.z_index = 5 + slot
	actor.body.add_child(sprite)
	used_slots[slot] = true
	if not pieces.has(index):
		pieces[index] = []
	pieces[index].append({"sprite": sprite, "base": sprite.position, "data": part_data, "slot": slot})

func sample(value: float) -> void:
	if not is_instance_valid(actor):
		return
	phase = clampf(value, 0.0, 1.0)
	var wave := sin(phase * PI)
	var smooth := phase * phase * (3.0 - 2.0 * phase)
	var pivot := actor.motion_pivot
	var y := 18.0 if anchored else 0.0
	pivot.position = Vector2.ZERO
	pivot.rotation = 0.0
	pivot.scale = Vector2.ONE
	pivot.modulate = Color.WHITE
	match cue:
		"magnet":
			pivot.position.y = lerpf(y, 18.0, smooth) if actor.def_id == "ITM-081" else -14.0 * smooth
		"release":
			var release_amount := smooth * (0.48 if show_result and not result_working else 1.0)
			pivot.position.y = lerpf(y, 0.0, release_amount) if anchored else -9.0 * wave
			if show_result and not result_working:
				pivot.position.x = 4.0 * sin(phase * TAU * 5.0) * wave
		"open", "close", "rotate", "unfold", "spin", "cycle", "swing", "bend", "flip":
			pivot.position = Vector2(3.0 * wave, y - 4.0 * wave)
			pivot.rotation = -0.075 * wave if cue in ["open", "unfold", "bend"] else 0.085 * wave
		"press", "lock", "seal", "cover", "stamp":
			pivot.position.y = y + 8.0 * wave
			pivot.scale = Vector2(1.0 + 0.025 * wave, 1.0 - 0.035 * wave)
		"lift", "growth", "walk":
			pivot.position = Vector2(5.0 * sin(phase * TAU), y - 18.0 * wave)
			pivot.rotation = 0.045 * sin(phase * TAU)
		"heat", "light", "switch", "pulse":
			pivot.position.y = y - 4.0 * wave
			pivot.scale = Vector2.ONE * (1.0 + 0.025 * wave)
			pivot.modulate = Color(1.0, 0.96 + 0.04 * wave, 0.91 + 0.09 * wave)
		_:
			pivot.position = Vector2(7.0 * wave, y - 5.0 * wave)
			pivot.rotation = 0.035 * sin(phase * TAU)
	if cue == "flip":
		pivot.scale.x = 1.0 if flip_origin else maxf(0.03, absf(1.0 - phase * 2.0))
		if phase >= 0.5 and not flip_applied and not flip_origin:
			actor.back = true
			actor._apply_face()
			actor.flipped.emit(actor.back)
			flip_applied = true
	if show_result and not result_working and cue != "release":
		pivot.position.x += 4.0 * sin(phase * TAU * 5.0) * wave
		pivot.rotation += 0.025 * sin(phase * TAU * 4.0) * wave
	for p in pieces.get(step, []):
		var part_data: Dictionary = p.data
		var offset: Array = part_data.get("offset", [0, 0])
		var amount := 1.0 - smooth if part_data.get("reverse", false) else smooth
		p.sprite.position = p.base + Vector2(float(offset[0]), float(offset[1])) * actor.body.region_rect.size * amount
		p.sprite.rotation = float(part_data.get("angle", 0.0)) * amount
	queue_redraw()

func finish(hold_pose := false) -> void:
	sample(1.0 if not hold_pose or cue in ["flip", "magnet", "release"] else 0.65)
	if cue == "magnet" and actor.def_id == "ITM-081":
		anchored = true
	elif cue == "release":
		anchored = false
	if not hold_pose:
		actor.motion_pivot.position = Vector2(0, 18 if anchored else (9 if cue == "release" and show_result and not result_working else 0))
		actor.motion_pivot.rotation = 0.0
		actor.motion_pivot.scale = Vector2.ONE
		actor.motion_pivot.modulate = Color.WHITE
	_remove_part(step, true)
	active = false
	resting = hold_pose
	queue_redraw()

func reveal_result(working: bool) -> void:
	result_working = working
	show_result = true
	result_active = true
	result_phase = 0.0
	queue_redraw()

## Result effects are based on the recorded evidence, never the hidden item
## state during preparation. This also keeps retests faithful to their result.
func result_appearance() -> Dictionary:
	var mode: String = GameData.inspection_profile(actor.def_id).get("mode", "motion")
	var faulty := show_result and not result_working
	var fault_effect := String(definition.get("result_effect", ""))
	var weak_left := faulty and mode == "magnet" and actor.def_id != "ITM-081"
	var light_opacity := 0.38
	if faulty and fault_effect == "dim":
		light_opacity = 0.16
	elif faulty and fault_effect == "flicker":
		light_opacity = 0.12 if not result_active or sin(result_phase * TAU * 3.0) < 0.0 else 0.34
	return {
		"mode": mode,
		"fault_effect": fault_effect,
		"color": Color("69b5ff") if faulty and fault_effect == "blue" else Color("f4d99a"),
		"light_opacity": light_opacity,
		"uneven": faulty and fault_effect == "blue",
		"intermittent": faulty and (mode in ["signal", "thermal"] or fault_effect == "flicker"),
		"left_strength": 0.25 if weak_left else 1.0,
		"right_strength": 0.25 if faulty and mode == "magnet" else 1.0,
	}

func sample_result(value: float) -> void:
	if not is_instance_valid(actor):
		return
	result_phase = clampf(value, 0.0, 1.0)
	var wave := sin(result_phase * PI)
	var pivot := actor.motion_pivot
	if result_working:
		pivot.position = Vector2(0, (18.0 if anchored else 0.0) - 5.0 * wave)
		pivot.rotation = 0.0
	else:
		var base_y := 18.0 if anchored else (9.0 if cue == "release" else 0.0)
		pivot.position = Vector2(6.0 * sin(result_phase * TAU * 3.0) * wave, base_y + 3.0 * sin(result_phase * TAU * 2.0) * wave)
		pivot.rotation = 0.035 * sin(result_phase * TAU * 3.0) * wave
	queue_redraw()

func finish_result() -> void:
	if not is_instance_valid(actor):
		return
	result_active = false
	actor.motion_pivot.position = Vector2(0, 18 if anchored else (9 if cue == "release" and not result_working else 0))
	actor.motion_pivot.rotation = 0.0
	actor.motion_pivot.scale = Vector2.ONE
	actor.motion_pivot.modulate = Color.WHITE
	queue_redraw()

func _remove_part(index: int, only_reverse := false) -> void:
	var remaining := []
	for p in pieces.get(index, []):
		if only_reverse and not p.data.get("reverse", false):
			remaining.append(p)
			continue
		var parameter := "inspection_poly_%d_on" if p.data.has("polygon") else "inspection_mask_%d_on"
		actor.mat.set_shader_parameter(parameter % int(p.slot), 0.0)
		if is_instance_valid(p.sprite):
			p.sprite.visible = false
			p.sprite.queue_free()
		used_slots.erase(p.slot)
	if remaining.is_empty():
		pieces.erase(index)
	else:
		pieces[index] = remaining

func cancel() -> void:
	if not is_instance_valid(actor):
		return
	if active and cue == "flip" and flip_applied:
		actor.back = flip_origin
		actor._apply_face()
		actor.flipped.emit(actor.back)
	for index in pieces.keys():
		_remove_part(index)
	actor.mat.set_shader_parameter("inspection_mask_0_on", 0.0)
	actor.mat.set_shader_parameter("inspection_mask_1_on", 0.0)
	actor.mat.set_shader_parameter("inspection_mask_2_on", 0.0)
	actor.mat.set_shader_parameter("inspection_poly_0_on", 0.0)
	actor.mat.set_shader_parameter("inspection_poly_1_on", 0.0)
	actor.motion_pivot.position = Vector2.ZERO
	actor.motion_pivot.rotation = 0.0
	actor.motion_pivot.scale = Vector2.ONE
	actor.motion_pivot.modulate = Color.WHITE
	active = false
	resting = false
	anchored = false
	result_active = false
	show_result = false
	queue_redraw()

func _draw() -> void:
	if not is_instance_valid(actor):
		return
	var extent := actor.tex_size() * actor.display_scale
	var w := minf(extent.x * 0.46, 145.0)
	var h := minf(extent.y * 0.46, 145.0)
	var teal := Color("e6a477") if show_result and not result_working else Color("78d8cf")
	var gold := Color("d9876c") if show_result and not result_working else Color("e1b16e")
	var dark := Color("354c4b")
	var appearance := result_appearance()
	var p := result_phase if result_active else (0.35 if show_result else phase)
	if actor.def_id == "ITM-081" and (anchored or ((active or show_result) and cue in ["magnet", "release"])):
		# A real plate sits beneath the boots or rotor, in the same world as it.
		draw_rect(Rect2(-w * 0.75, h + 8, w * 1.5, 14), Color("485a58"))
		draw_rect(Rect2(-w * 0.75, h + 8, w * 1.5, 3), Color("a3aea1"))
		for i in 4:
			draw_rect(Rect2(-w * 0.55 + i * w * 0.35, h + 18, 7, 3), Color("293b3a"))
	if not active and not show_result and not resting:
		return
	match cue:
		"magnet", "release":
			if actor.def_id == "ITM-081":
				var strength := p if cue == "magnet" else 1.0 - p
				for side in 2:
					for i in 2:
						var x := (-0.48 + side * 0.6 + i * 0.18) * w
						draw_line(Vector2(x, h + 8 - 20 * strength), Vector2(x, h + 8), Color(teal, 0.2 + strength * 0.75), 3.0)
			else:
				draw_arc(Vector2.ZERO, minf(w, h) * 0.52, PI * 0.12, PI * 0.88, 16, teal, 3.0)
		"flow", "breath":
			var start := Vector2(w * 0.55, h * 0.08)
			var end := Vector2(w + 20, h * 0.65)
			draw_line(start, Vector2(end.x, start.y), dark, 9.0)
			draw_line(Vector2(end.x, start.y), end, dark, 9.0)
			draw_line(start, Vector2(end.x, start.y), teal, 3.0)
			for i in 4:
				var q := fposmod(p * 2.0 + float(i) / 4.0, 1.0)
				draw_rect(Rect2(end.x - 3, start.y + (end.y - start.y) * q, 6, 7), Color("78d8ef", 0.85))
		"fill":
			# A test nozzle lowers over the tray and adds visible droplets.
			var nozzle := Vector2(-w * 0.35, -h * 0.70)
			draw_line(nozzle + Vector2(-35, -18), nozzle, dark, 10.0)
			draw_rect(Rect2(nozzle - Vector2(6, 4), Vector2(12, 9)), gold)
			for i in 4:
				var drop := fposmod(p * 2.0 + float(i) / 4.0, 1.0)
				draw_rect(Rect2(nozzle.x - 3, nozzle.y + drop * h * 0.9, 6, 8), Color("78d8ef", 0.9))
		"compare":
			var left := Vector2(-w * 0.35, h * 0.22)
			var right := Vector2(w * 0.35, h * 0.22)
			draw_circle(left, 14, Color("d5e5a1", 0.45))
			draw_circle(right, 14 + 4 * sin(p * TAU), Color("d5e5a1", 0.45))
			draw_line(left + Vector2(0, 20), right + Vector2(0, 20), gold, 3.0)
		"heat":
			for i in 3:
				var x := -w * 0.38 + i * w * 0.38
				var rise := fposmod(p + float(i) * 0.27, 1.0)
				draw_line(Vector2(x, -h * 0.65 - rise * 18), Vector2(x + 5, -h * 0.65 - rise * 18 - 14), Color(gold, 1.0 - rise * 0.6), 4.0)
				draw_rect(Rect2(x - 5, h * 0.60, 12, 5), Color("f5a855", 0.7))
		"light", "focus", "align", "inspect", "scan":
			var x := lerpf(-w * 0.55, w * 0.55, p)
			draw_line(Vector2(x, -h * 0.7), Vector2(x, h * 0.7), Color(teal, 0.7), 3.0)
			draw_arc(Vector2(x, 0), 22, 0, TAU, 24, gold, 3.0)
			draw_line(Vector2(x - 30, 0), Vector2(x - 18, 0), gold, 3.0)
			draw_line(Vector2(x + 18, 0), Vector2(x + 30, 0), gold, 3.0)
		"signal", "pulse", "switch":
			var origin := Vector2(-w * 0.62, h * 0.52)
			var points := PackedVector2Array()
			for i in 28:
				var x := float(i) / 27.0
				points.append(origin + Vector2(x * w * 1.24, sin((x * 2.5 - p * 1.8) * TAU) * 10.0))
			draw_polyline(points, teal, 3.0)
		"audio":
			for i in 3:
				draw_arc(Vector2(w * 0.35, 0), 25 + i * 18 + p * 10, -0.8, 0.8, 20, Color(gold, 0.85 - i * 0.2), 3.0)
		"growth":
			for i in 3:
				var x := -w * 0.45 + i * w * 0.45
				draw_line(Vector2(x, h * 0.45), Vector2(x + 5 * sin(p * TAU + i), h * 0.1), Color("a7df86"), 4.0)
		"weight", "balance", "load":
			var left := Vector2(-w * 0.7, h * 0.7)
			draw_rect(Rect2(left, Vector2(w * 1.4, 10)), dark)
			draw_rect(Rect2(left, Vector2(w * 1.4 * p, 10)), gold)
		"press", "lock", "seal", "cover", "stamp":
			var y := -h - 12 + 25 * sin(p * PI)
			draw_rect(Rect2(-18, y - 24, 36, 24), Color("806547"))
			draw_rect(Rect2(-24, y - 4, 48, 9), gold)
		"connect", "attach":
			var end := Vector2(w * (1.15 - p * 0.35), -h * 0.08)
			draw_line(Vector2(w * 1.25, -h * 0.5), end, dark, 8.0)
			draw_line(Vector2(w * 1.25, -h * 0.5), end, gold, 3.0)
			draw_rect(Rect2(end - Vector2(5, 7), Vector2(10, 14)), teal)
		"insert", "extract", "slide", "pull", "position":
			var x := lerpf(w * 0.95, w * 0.55, p) if cue in ["insert", "position"] else lerpf(w * 0.55, w * 0.95, p)
			draw_rect(Rect2(x, -14, 24, 28), Color("9b8c6a"))
			draw_rect(Rect2(x + 4, -9, 16, 18), Color("d2c3a0"))
		"wipe":
			var x := lerpf(-w * 0.55, w * 0.55, p)
			draw_line(Vector2(x, -h * 0.35), Vector2(x + 22, h * 0.18), Color("e1d4b7"), 8.0)
		"open", "close", "unfold":
			var direction := -1.0 if cue == "close" else 1.0
			var x := w * (0.65 + direction * 0.18 * p)
			var y := -h * (0.50 + direction * 0.18 * p)
			draw_line(Vector2(w * 0.6, -h * 0.34), Vector2(x, y), gold, 4.0)
			draw_circle(Vector2(x, y), 6, dark)
			draw_circle(Vector2(x, y), 3, gold)
		"rotate", "spin", "cycle":
			var radius := minf(w, h) * 0.70
			var angle := p * TAU * (2.0 if cue == "spin" else 0.65)
			draw_arc(Vector2.ZERO, radius, angle, angle + PI * 0.55, 18, Color(gold, 0.8), 4.0)
			draw_circle(Vector2(cos(angle), sin(angle)) * radius, 5, teal)
		"swing", "bend":
			var pivot := Vector2(-w * 0.65, -h * 0.35)
			var tip := pivot + Vector2(35, 32 * sin(p * TAU))
			draw_line(pivot, tip, gold, 5.0)
			draw_circle(pivot, 6, dark)
			draw_circle(tip, 5, teal)
		"lift", "walk":
			for i in 3:
				var x := (-0.55 + i * 0.55) * w
				var trail := 8.0 + 13.0 * fposmod(p + i * 0.3, 1.0)
				draw_line(Vector2(x, h * 0.80), Vector2(x, h * 0.80 + trail), Color(teal, 0.65), 3.0)
		"flip":
			draw_arc(Vector2.ZERO, minf(w, h) * 0.70, -PI * 0.85, -PI * 0.85 + p * PI * 1.3, 20, gold, 3.0)
		_:
			var angle := -PI * 0.7 + p * PI * 1.4
			draw_arc(Vector2.ZERO, minf(w, h) * 0.8, -PI * 0.7, angle, 32, gold, 4.0)
			draw_circle(Vector2(cos(angle), sin(angle)) * minf(w, h) * 0.8, 5, teal)
	# Draw item mechanisms in the item's own coordinate system, including its
	# actual scale, lift, rotation and flip. Fixtures remain mat-relative.
	var body_to_here := get_global_transform().affine_inverse() * actor.body.get_global_transform()
	draw_set_transform_matrix(body_to_here)
	var detail_phase := 1.0 if show_result and String(details.get(str(step), "")) == "flywheel" else p
	_draw_detail(String(details.get(str(step), "")), actor.tex_size().x * 0.46, actor.tex_size().y * 0.46, detail_phase, gold, teal)
	draw_set_transform_matrix(Transform2D.IDENTITY)
	if show_result:
		_draw_result_effect(appearance, w, h, p)

## The result describes what was measured, even when the last operation was
## a button press or a scale reading rather than the relevant physical effect.
func _draw_result_effect(appearance: Dictionary, w: float, h: float, p: float) -> void:
	var faulty := not result_working
	var kind := String(appearance.fault_effect) if faulty else ""
	var aqua := Color("82d9dc")
	var amber := Color("eab875")
	var warning := Color("e6a477")
	match String(appearance.mode):
		"optical":
			var col: Color = appearance.color
			var center := Vector2(w * 0.62, h * 0.20)
			var opacity: float = appearance.light_opacity
			if kind == "jam":
				for i in 3:
					draw_rect(Rect2(center + Vector2(-20 + i * 15, -8), Vector2(10, 16)), Color(amber, 0.35 if i == 2 else 0.75), false, 2.0)
			else:
				draw_circle(center, 23 if kind == "blue" else 25, Color(col, opacity))
				draw_circle(center + Vector2(17, 8) if kind in ["blue", "split"] else center, 10, Color(col, minf(opacity + 0.18, 0.7)))
				if kind == "split":
					draw_arc(center + Vector2(11, 0), 23, 0, TAU, 24, Color("9bd5ef", 0.65), 2.0)
		"flow":
			var base := Vector2(w * 0.67, h * 0.35)
			if kind == "high":
				draw_line(base + Vector2(0, -35), base + Vector2(0, 20), aqua, 3.0)
				draw_line(base + Vector2(-8, -3), base + Vector2(8, -3), amber, 3.0)
				draw_circle(base + Vector2(0, -19), 5, warning)
			else:
				draw_line(base + Vector2(-16, -20), base + Vector2(12, -20), Color("354c4b"), 8.0)
				for i in 4:
					if kind == "low" and i % 2 == 1:
						continue
					var speed := 0.5 if kind == "slow" else 1.5
					var drop := fposmod(p * speed + float(i) / 4.0, 1.0)
					draw_rect(Rect2(base + Vector2(9, -17 + drop * 43), Vector2(6, 7)), aqua)
				if kind == "leak":
					draw_rect(Rect2(base + Vector2(-12, -5 + fposmod(p * 55.0, 24.0)), Vector2(5, 7)), aqua)
		"signal":
			var origin := Vector2(-w * 0.50, h * 0.72)
			var previous := origin
			for i in range(1, 29):
				var x := float(i) / 28.0
				var amplitude := 14.0 if kind == "high" else 8.0
				if kind == "drop":
					amplitude *= 1.0 - x * 0.8
				var shift := 5.0 * x if kind == "drift" else 0.0
				var jump := 9.0 if kind == "jump" and i > 14 else 0.0
				var point := origin + Vector2(x * w, sin((x * 2.0 - p) * TAU) * amplitude + shift + jump)
				if not (faulty and kind in ["", "gap"] and i >= 12 and i <= 17):
					draw_line(previous, point, warning if faulty else aqua, 3.0)
				previous = point
		"thermal":
			for i in 3:
				var x := (-0.32 + i * 0.32) * w
				var strength := 0.35 if faulty and ((kind == "uneven" and i == 1) or (kind == "drop" and i == 2)) else 1.0
				if kind == "flicker" and (not result_active or sin(p * TAU * 3.0 + i) < 0.0):
					strength = 0.25
				var rise := fposmod(p + float(i) * 0.24, 1.0)
				draw_line(Vector2(x, -h * 0.64 - rise * 10), Vector2(x + 5, -h * 0.64 - rise * 10 - 16 * strength), Color(amber, 0.35 + 0.6 * strength), 4.0)
			if kind in ["leak", "rise"]:
				draw_line(Vector2(w * 0.55, -h * 0.15), Vector2(w * 0.72, -h * 0.30), warning, 4.0)
		"magnet":
			for side in 2:
				var strength: float = appearance.left_strength if side == 0 else appearance.right_strength
				var x := (-0.33 + side * 0.66) * w
				for i in 2:
					var px := x + (i - 0.5) * 12
					draw_line(Vector2(px, h * 0.78 - 25 * strength), Vector2(px, h * 0.78), Color(aqua, 0.25 + 0.65 * strength), 3.0)
		"growth":
			for i in 3:
				var x := (-0.24 + i * 0.24) * w
				var length := 12.0 if faulty else 26.0
				draw_line(Vector2(x, h * 0.44), Vector2(x + 6 * sin(p * TAU + i), h * 0.44 - length), Color("aadf89"), 4.0)
		"motion":
			var center := Vector2(w * 0.62, -h * 0.42)
			draw_arc(center, 14, 0, TAU, 20, Color(amber, 0.7), 2.0)
			var displacement := Vector2(7, 4) if faulty else Vector2.ZERO
			draw_circle(center + displacement, 4, warning if faulty else aqua)

## Item-specific moving details are drawn over the original pixel art. Their
## coordinates refer to the sprite itself, so they follow the item on the mat.
func _item_point(uv: Vector2, w: float, h: float) -> Vector2:
	return Vector2((uv.x - 0.5) * w / 0.46, (uv.y - 0.5) * h / 0.46)

func _draw_detail(kind: String, w: float, h: float, p: float, gold: Color, teal: Color) -> void:
	var angle := p * TAU
	match kind:
		"gyro_ring":
			var center := _item_point(Vector2(0.50, 0.43), w, h)
			var points := PackedVector2Array()
			var tilt := 0.20 * sin(angle)
			for i in 33:
				var a := TAU * i / 32.0
				var point := Vector2(cos(a) * w * 0.80, sin(a) * h * 0.34).rotated(tilt)
				points.append(center + point)
			draw_polyline(points, Color("e3b969", 0.9), 4.0)
		"gyro_rotor", "gyro_axis":
			var center := _item_point(Vector2(0.50, 0.43), w, h)
			if kind == "gyro_axis" and show_result and not result_working:
				center += Vector2(w * 0.08 * sin(angle), h * 0.04 * sin(angle))
			for i in 3:
				var a := angle * 2.0 + TAU * i / 3.0
				var inner := center + Vector2(cos(a) * w * 0.08, sin(a) * h * 0.08)
				var outer := center + Vector2(cos(a) * w * 0.26, sin(a) * h * 0.26)
				draw_line(inner, outer, Color("9bd3ff", 0.85), 3.0)
			draw_circle(center, 4, gold)
		"flywheel":
			var center := _item_point(Vector2(0.51, 0.43), w, h)
			var turns := 1.0 - (1.0 - p) * (1.0 - p) if step == 2 else p
			for i in 4:
				var a := turns * TAU * 2.0 + TAU * i / 4.0
				var start := center + Vector2(cos(a), sin(a)) * w * 0.20
				var end := center + Vector2(cos(a), sin(a)) * w * 0.48
				draw_line(start, end, Color("b7ab8d", 0.8), 5.0)
		"weather_rotor":
			var center := _item_point(Vector2(0.33, 0.13), w, h)
			for i in 3:
				var a := angle * 2.0 + TAU * i / 3.0
				var end := center + Vector2(cos(a) * w * 0.14, sin(a) * h * 0.075)
				draw_line(center, end, Color("806c56"), 4.0)
				draw_circle(end, 6, Color("aab3a3"))
		"crank":
			var center := _item_point(Vector2(0.77, 0.57), w, h)
			var end := center + Vector2(cos(angle), sin(angle)) * w * 0.17
			draw_line(center, end, Color("8c7655"), 7.0)
			draw_circle(center, 6, Color("d1bb89"))
			draw_circle(end, 7, Color("b88143"))
		"drone_wings":
			for side in 2:
				var center := _item_point(Vector2(0.34 if side == 0 else 0.73, 0.22 if side == 0 else 0.31), w, h)
				var spread := 0.20 + 0.10 * sin(angle * 2.0 + side * 0.6)
				draw_arc(center, w * spread, PI * 1.08, TAU * 0.94, 16, Color("f0d6a1", 0.8), 3.0)
		"walker_unfold", "walker_legs":
			if kind == "walker_legs":
				_draw_detail("test_pipe", w, h, p, gold, teal)
			for i in 6:
				var side := i / 3
				var column := i % 3
				var x := 0.24 + column * 0.21 + side * 0.045
				var hip_y := 0.54 + side * 0.06
				var leg_phase := angle * 1.5 + PI * ((column + side) % 2)
				var extension := p if kind == "walker_unfold" else 1.0
				var stride := 0.05 * sin(leg_phase) if kind == "walker_legs" else 0.0
				var lift := 0.04 * maxf(0.0, sin(leg_phase)) if kind == "walker_legs" else 0.0
				var hip := _item_point(Vector2(x, hip_y), w, h)
				var knee := _item_point(Vector2(x + stride * 0.6, hip_y + 0.06 + 0.05 * extension), w, h)
				var foot := _item_point(Vector2(x + stride, hip_y + 0.08 + 0.15 * extension - lift), w, h)
				draw_line(hip, knee, Color("716d63"), 7.0)
				draw_line(knee, foot, Color("b8ad95"), 7.0)
				draw_rect(Rect2(foot - Vector2(7, 2), Vector2(14, 6)), Color("dba054"))
		"test_pipe":
			var start := _item_point(Vector2(0.14, 0.82), w, h)
			var end := _item_point(Vector2(0.87, 0.82), w, h)
			draw_line(start, end, Color("536b69", 0.85), 15.0)
			draw_line(start + Vector2(0, -4), end + Vector2(0, -4), Color("a2b6ac", 0.8), 3.0)
		"coffee_cup":
			var center := _item_point(Vector2(0.48, 0.68), w, h)
			draw_arc(center, w * 0.20, PI * 0.08 + angle * 0.4, PI * 0.85 + angle * 0.4, 16, Color("d9c7a8", 0.85), 4.0)
		"pendulum":
			var pivot := _item_point(Vector2(0.50, 0.59), w, h)
			var end := _item_point(Vector2(0.50 + 0.08 * sin(angle * 2.0), 0.74), w, h)
			draw_line(pivot, end, Color("d0ad6d", 0.9), 4.0)
			draw_circle(end, 8, Color("b28c60", 0.9))
		"needle":
			var x := _item_point(Vector2(0.23, 0.0), w, h).x
			var y := _item_point(Vector2(0.0, 0.52 + 0.06 * (0.5 + 0.5 * sin(angle * 4.0))), w, h).y
			draw_line(Vector2(x, y - 16), Vector2(x, y + 14), Color("d8dbcd"), 3.0)
			draw_circle(Vector2(x, y + 14), 3, gold)
