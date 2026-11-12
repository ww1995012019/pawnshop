extends SceneTree
## Validate the actual imported catalogue textures, not just source filenames.
var failures := 0
func _initialize() -> void:
	call_deferred("run_check")
func check(ok: bool, message: String) -> void:
	if not ok:
		push_error(message)
		failures += 1
func run_check() -> void:
	var data = load("res://scripts/model/game_data.gd")
	var kit = load("res://scripts/app/ui_kit.gd")
	data.ensure()
	kit.ensure()
	var ids: Array = data.items.keys()
	var seen := {}
	for id in ids:
		var previous: Image
		for back in [false, true]:
			var cell: Dictionary = kit.item_cell(id, back)
			var tex: Texture2D = kit.tex("res://assets/atlas/%s.png" % cell.key)
			var rect: Rect2i = cell.region
			check(Rect2i(Vector2i.ZERO, tex.get_size()).encloses(rect), "%s art extends outside its atlas" % id)
			var face: Image = kit.watch_cell_image(id,back).get_region(Rect2i(8,8,238,238))
			var bounds := face.get_used_rect()
			check(bounds.size.x > 40 and bounds.size.y > 30, "%s has missing or tiny artwork" % id)
			check(bounds.position.x >= 3 and bounds.position.y >= 3 and bounds.end.x <= face.get_width() - 3 and bounds.end.y <= face.get_height() - 3, "%s has a clipped sprite or neighboring cell fragment" % id)
			var signature: String = cell.key + ":" + str(cell.region)
			check(not seen.has(signature), "%s borrows another catalogue cell" % id)
			seen[signature] = true
			if back:
				check(face.get_data() != previous.get_data(), "%s back face duplicates its front" % id)
			else:
				previous = face
	print("Item art: ", ids.size(), " catalogue items / ", seen.size(), " faces; failures=", failures)
	quit(1 if failures > 0 else 0)
