extends SceneTree
## Authored pixel colours should survive the default portrait/item shaders.
var failures := 0
func _initialize() -> void: call_deferred("run")
func run() -> void:
	var viewport := SubViewport.new()
	viewport.size = Vector2i(128, 64)
	viewport.world_2d = World2D.new()
	viewport.render_target_update_mode = SubViewport.UPDATE_ALWAYS
	root.add_child(viewport)
	var original := Color8(128, 180, 225)
	var source := Image.create(64, 64, false, Image.FORMAT_RGBA8)
	source.fill(original)
	var texture := ImageTexture.create_from_image(source)
	var names := ["customer", "item"]
	for i in 2:
		var sprite := Sprite2D.new()
		sprite.texture = texture
		sprite.position = Vector2(32+i*64,32)
		var material := ShaderMaterial.new()
		material.shader = load("res://shaders/"+names[i]+".gdshader")
		sprite.material = material
		viewport.add_child(sprite)
	await process_frame
	await RenderingServer.frame_post_draw
	var rendered := viewport.get_texture().get_image()
	for i in 2:
		var actual := rendered.get_pixel(32+i*64,32)
		var delta := Vector3(actual.r-original.r,actual.g-original.g,actual.b-original.b).length()
		var ok := delta < 0.02
		print("COLOR ", "PASS " if ok else "FAIL ", names[i], " default shader preserves source colour; delta=", delta)
		if not ok: failures += 1
	viewport.queue_free()
	await process_frame
	quit(1 if failures else 0)
