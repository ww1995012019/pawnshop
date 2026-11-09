extends SceneTree
var shell
var failures := 0
func _initialize(): call_deferred("run")
func check(ok: bool, label: String):
	print("GEOMETRY ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1
func pointer(active, world: Vector2) -> Vector2:
	return root.get_final_transform() * (shell.workspace_container.get_global_rect().position + active.world_to_ui(world))
func move(active, world: Vector2, held := false):
	var event := InputEventMouseMotion.new()
	event.position = pointer(active,world)
	event.global_position = event.position
	event.button_mask = MOUSE_BUTTON_MASK_LEFT if held else 0
	Input.parse_input_event(event)
	await process_frame
	await process_frame
func button(active, world: Vector2, pressed: bool):
	var event := InputEventMouseButton.new()
	event.position = pointer(active,world)
	event.global_position = event.position
	event.button_index = MOUSE_BUTTON_LEFT
	event.button_mask = MOUSE_BUTTON_MASK_LEFT if pressed else 0
	event.pressed = pressed
	Input.parse_input_event(event)
	await process_frame
	await process_frame
func run():
	DirAccess.make_dir_recursive_absolute("/tmp/pawn-v3-tools")
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await process_frame
	shell._close_title()
	game.new_game("ORBITAL-P0")
	game.state = Model.reduce(game.state,{"type":"ARRIVE"})
	shell.go("counter")
	shell.go("inspect")
	await process_frame
	var active = shell.active_shell()
	var page = active.page
	for tool in GameData.tools:
		page._set_tool(tool.id)
		await create_timer(0.8).timeout
		if DisplayServer.get_name() != "headless":
			await RenderingServer.frame_post_draw
			root.get_texture().get_image().save_png("/tmp/pawn-v3-tools/"+tool.id+".png")
		if tool.id == "TOL-004":
			for i in page.probes.size():
				var tip: Vector2 = active.world_to_ui(page.probes[i].tip())
				check(tip.x > page.instrument_panel.get_rect().end.x+30 and tip.x < page.detail_panel.position.x-30 and tip.y < page.bench.position.y-30,"probe %d can be grabbed clear of panels (%s)" % [i,tip])
			for i in page.probes.size():
				var from: Vector2 = page.probes[i].tip()
				var target: Vector2 = page.ports[i].position
				await move(active,from)
				await button(active,from,true)
				await move(active,target,true)
				await button(active,target,false)
				check(page.probes[i].attached,"real pointer attaches probe %d" % i)
			await create_timer(1.2).timeout
			check(game.trade_item().evidence.has("TOL-004"),"both connected probes record real circuit evidence")
		if tool.id == "TOL-005":
			check(page.bench.get_rect().end.x <= page.detail_panel.position.x-8, "scale weights fit beside detail panel")
			var last_weight: Button
			for control in page.bench.find_children("*","Button",true,false):
				if control.text == "100g": last_weight = control
			var world: Vector2 = active.get_viewport().get_canvas_transform().affine_inverse() * last_weight.get_global_rect().get_center()
			await move(active,world)
			await button(active,world,true)
			await button(active,world,false)
			check(page.weights.get(5,0) == 100,"last scale weight is reachable through the actual drawer")
	active.go("repair")
	await process_frame
	page = active.page
	game.state.repairProgress[page.it_uid] = 1
	page._stage_ui()
	await create_timer(0.2).timeout
	var from: Vector2 = page.part.position
	var target: Vector2 = page.slot.position
	await move(active, from)
	await button(active, from, true)
	await move(active, target, true)
	await create_timer(0.25).timeout
	await button(active, target, false)
	check(int(game.state.repairProgress[page.it_uid]) == 2, "real pointer seats the replacement part inside the repair surface")
	print("GEOMETRY failures=",failures)
	shell.queue_free()
	await process_frame
	quit(1 if failures else 0)
