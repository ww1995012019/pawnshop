extends SceneTree
## Art contract: all 78 physically distinct faces, safe atlas sampling and shared logo marks.
var failures := 0
func _initialize() -> void:
	call_deferred("run_check")
func check(ok: bool, message: String) -> void:
	if not ok:
		push_error(message)
		failures += 1
func run_check() -> void:
	root.get_node("Audio").ambience.stop()
	var kit = load("res://scripts/app/ui_kit.gd")
	var sprite_script = load("res://scripts/world/item_sprite.gd")
	kit.ensure()
	var signatures := {}
	for i in range(78):
		var id := "WCH-%03d" % (i + 1)
		var luxury: bool = GameData.def(id).tier in ["luxury", "ultra"]
		check(not WatchLogo.art(id).get("crest", []).is_empty() if luxury else WatchLogo.art(id).get("crest", []).is_empty(), id + " model tier has the correct gold crest")
		var prior: Image
		for is_back in [false, true]:
			var cell: Dictionary = kit.item_cell(id, is_back)
			check(cell.key == ("watches-back" if is_back else "watches-front"), id + " atlas key")
			var texture: Texture2D = kit.tex("res://assets/atlas/%s.png" % cell.key)
			check(texture.get_size() == Vector2(1280, 4096), "5 × 16 cells of 256px")
			var face := texture.get_image().get_region(Rect2i(cell.region))
			var used := face.get_used_rect()
			check(used.size.y > 200 and used.size.x > 100, id + " recognizable silhouette")
			check(used.position.x >= 3 and used.position.y >= 3 and used.end.x < face.get_width() - 3 and used.end.y < face.get_height() - 3, id + " transparent sampling margin")
			var signature := face.get_data().hex_encode().sha256_text()
			check(not signatures.has(signature), id + " distinct physical art")
			signatures[signature] = true
			if is_back:
				check(face.get_data() != prior.get_data(), id + " distinct reverse")
			else:
				prior = face
			var normal: Image = kit.tex("res://assets/atlas/%s_n.png" % cell.key).get_image()
			var alpha := texture.get_image()
			var offset := Vector2i(i % 5 * 256, i / 5 * 256)
			for y in range(0, 256, 5):
				for x in range(0, 256, 5):
					var p := offset + Vector2i(x, y)
					var n := normal.get_pixelv(p)
					check(is_equal_approx(n.a, alpha.get_pixelv(p).a), id + " normal cutout matches")
					check(absf(n.r - 128.0 / 255.0) < 0.01 and absf(n.g - 128.0 / 255.0) < 0.01 and n.b > 0.99, id + " flat normal")
		var reference := WatchLogo.pixels(id, 0)
		var altered := WatchLogo.pixels(id, 1)
		check(not reference.is_empty() and reference != altered, id + " has observable altered physical mark")
		for pixel in reference + altered:
			check(pixel[0] >= 0 and pixel[0] < 24 and pixel[1] >= 0 and pixel[1] < 16, id + " logo fits same physical field")
		var sprite = sprite_script.new()
		get_root().add_child(sprite)
		sprite.setup(id, "", 300.0)
		check(sprite.body.texture is CanvasTexture, id + " physical logo is part of lit body texture")
		check(sprite.logo_world_position().distance_to(sprite.body.to_global(Vector2(0, -24))) < 0.01, id + " loupe targets actual logo")
		sprite.back = true
		sprite._apply_face()
		check(sprite.body.texture == kit.lit_atlas("watches-back"), id + " back has no front logo overlay")
		sprite.free()
		var variant: CanvasTexture = kit.watch_variant_texture(id)
		var baked := variant.diffuse_texture.get_image()
		var cell_offset := Vector2i(i % 5 * 256, i / 5 * 256)
		var original: Image = kit.tex("res://assets/atlas/watches-front.png").get_image().get_region(Rect2i(cell_offset, Vector2i(256, 256)))
		var difference := 0
		for y in range(256):
			for x in range(256):
				if baked.get_pixel(x, y) != original.get_pixel(x, y):
					difference += 1
					check(Rect2i(104, 88, 48, 32).has_point(Vector2i(x, y)), id + " variant changes only logo pixels")
		check(difference > 0, id + " actual lit body pixels change for variant")
		var changed_pixels := 0
		for point in reference:
			if not altered.has(point): changed_pixels += 4
		for point in altered:
			if not reference.has(point): changed_pixels += 4
		check(difference == changed_pixels, id + " only glyph strokes change; dial paint is untouched")
	var game = root.get_node("Game")
	for v in [0, 1]:
		var actual := {"uid": "art-instance-" + str(v), "defId": "WCH-001", "watch": {"logo_variant": v}}
		game.state.inventory.append(actual)
		var physical = sprite_script.new()
		root.add_child(physical)
		physical.setup(actual.defId, actual.uid, 300.0)
		check(physical.logo_variant == v, "same model renders its own instance mark")
		check(physical.body.get_child_count() == 1, "no independently lit logo patch exists")
		physical.free()
	await process_frame
	print("Watch art: 78 models, 156 faces, shared reference/altered marks; failures=", failures)
	quit(1 if failures else 0)
