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
func touch(active, world: Vector2, pressed: bool):
	var event := InputEventScreenTouch.new()
	event.position = pointer(active, world)
	event.index = 0
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
	# Exercise both electrical instruments on a powered item that actually uses them.
	game.state.trade.item.defId = "ITM-002"
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
	var candidates: Array = page._candidates()
	check(candidates.size() >= 2, "repair list has two selectable items")
	if candidates.size() >= 2:
		var previous_emulation := Input.emulate_mouse_from_touch
		Input.emulate_mouse_from_touch = true
		for index in [1, 0]:
			var choice: Button = page.list_box.get_child(index)
			var choice_point: Vector2 = active.ui_to_world(choice.get_global_rect().get_center())
			await touch(active, choice_point, true)
			await touch(active, choice_point, false)
			await process_frame
			check(page.it_uid == candidates[index].uid, "touch selects repair item %d" % index)
		Input.emulate_mouse_from_touch = previous_emulation
	# Buying supplies should not rebuild the active cleaning stage and erase
	# grime already removed from the item.
	page.mask.set_pixel(32, 32, Color.BLACK)
	page.dirty = 0.5
	var old_trade = game.state.trade
	var old_cursor: int = game.state.cursor
	game.state.trade = null
	game.state.cursor = 4
	var commerce = load("res://scripts/model/commerce.gd")
	game.state = commerce.reduce(game.state, {"type": "ARRIVE"})
	var materials_before: int = int(game.state.materials.get("MAT-001", 0))
	game.dispatch({"type": "BUY_MATERIAL", "id": "MAT-001", "qty": 1})
	await process_frame
	await process_frame
	check(page.mask.get_pixel(32, 32).r < 0.1 and is_equal_approx(page.dirty, 0.5), "buying supplies preserves cleaning progress")
	var updated_quantity := false
	for control in page.info.find_children("*", "Label", true, false):
		if control.text.begins_with("导电纤维 ×%d" % (materials_before + 1)):
			updated_quantity = true
	check(updated_quantity, "supply count refreshes after purchase")
	game.state.trade = old_trade
	game.state.cursor = old_cursor
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
	var load_key: Button
	for control in page.bench.find_children("*", "Button", true, false):
		if control.text.contains("负载复测"): load_key = control
	var load_point: Vector2 = active.ui_to_world(load_key.get_global_rect().get_center())
	var emulation := Input.emulate_mouse_from_touch
	Input.emulate_mouse_from_touch = true
	await touch(active, load_point, true)
	check(page.test_hold, "touch holds the load-test button")
	page.test_value = 0.8
	await touch(active, load_point, false)
	await process_frame
	check(int(game.state.repairProgress[page.it_uid]) == 3 and page.stage == 3, "touch release completes the load-test stage")
	Input.emulate_mouse_from_touch = emulation
	# A sharper drawer must still route the same real pointer input after the
	# display resolution changes, without resetting the item or the tool.
	active.go("inspect")
	await process_frame
	page = active.page
	page._set_tool("TOL-005")
	await create_timer(0.2).timeout
	if not shell.has_method("_set_workspace_render_scale"):
		check(false, "drawer render resolution follows the display")
	else:
		var uid: String = page.it_uid
		for render_scale in [0.75, 1.0, 1.75]:
			shell._set_workspace_render_scale(render_scale)
			await create_timer(0.15).timeout
			var viewport: SubViewport = active.get_viewport()
			check(viewport.get_visible_rect().size == Vector2(1600, 900), "logical drawer layout remains stable at %s×" % render_scale)
			check(viewport.size == Vector2i(roundi(1600 * render_scale), roundi(900 * render_scale)), "drawer raster follows %s× display resolution" % render_scale)
			check(page.it_uid == uid and page.tool == "TOL-005", "resizing preserves the selected lot and instrument")
			var last_weight: Button
			for control in page.bench.find_children("*", "Button", true, false):
				if control.text == "100g": last_weight = control
			var was_on: bool = page.weights.has(5)
			var world: Vector2 = active.get_viewport().get_canvas_transform().affine_inverse() * last_weight.get_global_rect().get_center()
			await move(active, world)
			await button(active, world, true)
			await button(active, world, false)
			check(page.weights.has(5) != was_on, "scale weight stays clickable at %s×" % render_scale)
	print("GEOMETRY failures=",failures)
	shell.queue_free()
	await process_frame
	quit(1 if failures else 0)
