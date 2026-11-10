class_name WatchCleaning
extends RefCounted
## One alpha-clipped mask drives both the shader and the completion counter.
const GRID := 64
const TOLERANCE := 0.02
var pixels := PackedByteArray()
var initial := PackedByteArray()
var weights := PackedFloat32Array()
var initial_total := 0.0
var remaining_total := 0.0

func configure(alpha: Image, seed: String, saved: Dictionary) -> void:
	pixels.resize(GRID * GRID)
	initial.resize(GRID * GRID)
	weights.resize(GRID * GRID)
	initial_total = 0.0
	var draw := seed.hash() & 0x7fffffff
	var stored := PackedByteArray()
	if saved.get("grid", 0) == GRID and saved.get("mask", "") is String and saved.get("mask", "").length() == GRID * GRID * 2:
		stored = String(saved.mask).hex_decode()
	for y in GRID:
		for x in GRID:
			var index := y * GRID + x
			var opacity := 0.0
			for offset in [Vector2(0.25, 0.25), Vector2(0.75, 0.25), Vector2(0.25, 0.75), Vector2(0.75, 0.75)]:
				var sx := clampi(int((x + offset.x) / GRID * alpha.get_width()), 0, alpha.get_width() - 1)
				var sy := clampi(int((y + offset.y) / GRID * alpha.get_height()), 0, alpha.get_height() - 1)
				opacity += alpha.get_pixel(sx, sy).a * 0.25
			weights[index] = opacity if opacity >= 0.15 else 0.0
			draw = (draw * 1103515245 + 12345) & 0x7fffffff
			initial[index] = 175 + (draw % 81) if weights[index] > 0.0 else 0
			pixels[index] = mini(stored[index], initial[index]) if stored.size() == GRID * GRID else initial[index]
			initial_total += initial[index] * weights[index]
	_measure()

func stroke(from_uv: Vector2, to_uv: Vector2, radius := 0.075) -> bool:
	if from_uv.distance_squared_to(to_uv) < 0.000001 or complete():
		return false
	var changed := false
	var start := (from_uv.min(to_uv) - Vector2.ONE * radius) * GRID
	var end := (from_uv.max(to_uv) + Vector2.ONE * radius) * GRID
	for y in range(maxi(0, floori(start.y)), mini(GRID, ceili(end.y))):
		for x in range(maxi(0, floori(start.x)), mini(GRID, ceili(end.x))):
			var i := y * GRID + x
			if pixels[i] == 0: continue
			var uv := (Vector2(x, y) + Vector2(0.5, 0.5)) / GRID
			var distance := uv.distance_to(Geometry2D.get_closest_point_to_segment(uv, from_uv, to_uv))
			var value := roundi(initial[i] * smoothstep(radius * 0.45, radius, distance))
			if value < pixels[i]:
				pixels[i] = value
				changed = true
	if changed: _measure()
	return changed

func _measure() -> void:
	remaining_total = 0.0
	for i in pixels.size(): remaining_total += pixels[i] * weights[i]
	if initial_total <= 0.0 or remaining_total / initial_total <= TOLERANCE:
		pixels.fill(0)
		remaining_total = 0.0

func remaining() -> float:
	return remaining_total / initial_total if initial_total > 0.0 else 0.0

func complete() -> bool:
	return remaining_total == 0.0

func serialize() -> Dictionary:
	return {"grid": GRID, "mask": pixels.hex_encode(), "complete": complete()}

func image() -> Image:
	return Image.create_from_data(GRID, GRID, false, Image.FORMAT_L8, pixels)

func residual_points() -> Array[Vector2]:
	var out: Array[Vector2] = []
	for y in range(2, GRID, 4):
		for x in range(2, GRID, 4):
			if pixels[y * GRID + x] > 30:
				out.append((Vector2(x, y) + Vector2(0.5, 0.5)) / GRID)
	return out
