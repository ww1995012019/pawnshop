extends SceneTree
## Run with a real renderer (e.g. DISPLAY=:91 godot --path godot --script ...).
## Identical mosaics must conceal both mark variants; lens clipping must not leak.
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
	print("LOGO RENDER ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1
func capture(viewport: SubViewport) -> Image:
	await process_frame
	await RenderingServer.frame_post_draw
	return viewport.get_texture().get_image()
func same(a: Color, b: Color) -> bool:
	return Vector4(a.r-b.r, a.g-b.g, a.b-b.b, a.a-b.a).length() < .015
func run() -> void:
	if DisplayServer.get_name() == "headless":
		print("LOGO RENDER SKIP requires a real rendering display")
		quit()
		return
	var kit = load("res://scripts/app/ui_kit.gd")
	kit.ensure()
	var game = root.get_node("Game")
	game.new_game("LOGO-RENDER")
	var viewport := SubViewport.new()
	viewport.size = Vector2i(512, 256)
	viewport.world_2d = World2D.new()
	viewport.render_target_update_mode = SubViewport.UPDATE_ALWAYS
	root.add_child(viewport)
	for index in 33:
		var model := "WCH-%03d" % (index + 1)
		game.state = Model.create("LOGO-RENDER-" + model)
		game.state.inventory.clear()
		var sprites: Array = []
		var uids: Array = []
		for variant in 2:
			var it = Model.new_item(game.state, model)
			it.watch.logo_variant = variant
			Model.put_in(game.state, it)
			uids.append(it.uid)
			var sprite = load("res://scripts/world/item_sprite.gd").new()
			sprite.setup(model, it.uid, 238.08)
			sprite.position = Vector2(128 + 256*variant, 128)
			viewport.add_child(sprite)
			sprites.append(sprite)
		var masked := await capture(viewport)
		var indistinguishable := true
		for y in range(89, 120):
			for x in range(105, 152):
				if not same(masked.get_pixel(x,y), masked.get_pixel(x+256,y)):
					indistinguishable = false
		check(indistinguishable, model + " mosaic conceals authentic versus altered mark shape")
		for sprite in sprites:
			sprite.mat.set_shader_parameter("lens_pos", sprite.logo_world_position())
			sprite.mat.set_shader_parameter("lens_r", 12.0)
		var lens := await capture(viewport)
		var outside_unchanged := true
		var revealed_pixels := 0
		for y in range(89, 120):
			for x in range(105, 152):
				var distance := Vector2(x+.5,y+.5).distance_to(Vector2(128,104))
				for variant in 2:
					var changed := not same(lens.get_pixel(x+256*variant,y), masked.get_pixel(x+256*variant,y))
					if distance > 13 and changed: outside_unchanged = false
					if distance < 9 and changed: revealed_pixels += 1
		check(outside_unchanged and revealed_pixels > 20, model + " lens reveals mark only inside its circle")
		for sprite in sprites: sprite.mat.set_shader_parameter("lens_r", 0.0)
		var removed := await capture(viewport)
		check(removed.get_data() == masked.get_data(), model + " removing lens restores complete mosaic")
		for uid in uids:
			game.state = Model.reduce(game.state, {"type":"CHECK", "uid":uid, "tool":"TOL-001"})
		var observed := await capture(viewport)
		var distinct := 0
		for y in range(89, 120):
			for x in range(105, 152):
				if not same(observed.get_pixel(x,y),observed.get_pixel(x+256,y)): distinct += 1
		check(distinct > 0, model + " completed observation exposes distinct actual marks")
		# Render the catalogue icon at exactly the same placement/crop as the
		# authentic body. Its clear source remains unchanged by physical masking.
		for sprite in sprites: sprite.visible = false
		var reference := Sprite2D.new()
		reference.texture = kit.item_icon(model)
		reference.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		reference.position = Vector2(128,128)
		viewport.add_child(reference)
		var catalogue := await capture(viewport)
		var clear_matches := true
		for y in range(89, 120):
			for x in range(105, 152):
				if not same(catalogue.get_pixel(x,y),observed.get_pixel(x,y)): clear_matches = false
		check(clear_matches, model + " catalogue mark stays clear and matches observed original")
		reference.free()
		for sprite in sprites: sprite.free()
	viewport.queue_free()
	for player in root.find_children("*", "AudioStreamPlayer", true, false):
		player.stop()
		player.stream = null
	await process_frame
	print("LOGO RENDER failures=", failures)
	quit(1 if failures else 0)
