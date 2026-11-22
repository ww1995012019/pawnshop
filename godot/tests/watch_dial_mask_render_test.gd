extends SceneTree
## Compares the actual rendered, unobserved watch with its underlying painting.

var failures := 0

func _initialize() -> void:
	call_deferred("run")

func capture(view: SubViewport) -> Image:
	await process_frame
	await RenderingServer.frame_post_draw
	return view.get_texture().get_image()

func check(ok: bool, message: String) -> void:
	print("DIAL MASK ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1

func run() -> void:
	if DisplayServer.get_name() == "headless":
		print("DIAL MASK SKIP requires a rendering display")
		quit()
		return
	load("res://scripts/app/ui_kit.gd").ensure()
	var game = root.get_node("Game")
	game.new_game("BENCH-PAINT-RENDER")
	game.prefs.reduced_motion = true
	var view := SubViewport.new()
	view.size = Vector2i(512,256)
	view.world_2d = World2D.new()
	view.render_target_update_mode = SubViewport.UPDATE_ALWAYS
	root.add_child(view)
	for id in ["WCH-001","WCH-002","WCH-020","WCH-075"]:
		var base: Image = load("res://scripts/ui/watch_workbench_texture.gd")._paint(id,false)
		var reference := Sprite2D.new()
		reference.texture = ImageTexture.create_from_image(base)
		reference.position = Vector2(384,128)
		reference.texture_filter = CanvasItem.TEXTURE_FILTER_LINEAR
		view.add_child(reference)
		for variant in [0,1]:
			var it := Model.new_item(game.state,id,{"owner":"npc","authentic":variant==0})
			it.watch.logo_variant = variant
			if variant == 1 and id == "WCH-075": WatchForgery.apply(it,"logo")
			Model.put_in(game.state,it)
			var watch = load("res://scripts/world/item_sprite.gd").new()
			watch.setup(id,it.uid,238.08,false,true)
			watch.position = Vector2(128,128)
			view.add_child(watch)
			var hidden := await capture(view)
			var differs := 0
			for y in range(87,121):
				for x in range(103,153):
					var a := hidden.get_pixel(x,y)
					var b := hidden.get_pixel(x+256,y)
					if Vector3(a.r-b.r,a.g-b.g,a.b-b.b).length() > .018: differs += 1
			check(differs == 0,"%s variant %d shows the original dial and hands before observation (%d wrong pixels)" % [id,variant,differs])
			watch.mat.set_shader_parameter("lens_pos",watch.logo_world_position())
			watch.mat.set_shader_parameter("lens_r",45.0)
			var exposed := await capture(view)
			check(exposed.get_region(Rect2i(104,88,48,32)).get_data() != hidden.get_region(Rect2i(104,88,48,32)).get_data(), "%s variant %d reveals its mark under the lens" % [id,variant])
			watch.free()
		reference.free()
	view.free()
	quit(1 if failures else 0)
