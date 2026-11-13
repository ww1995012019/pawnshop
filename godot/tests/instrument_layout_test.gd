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
	# Exercise the three physical watch instruments.
	game.state.trade.item.defId = "WCH-002"
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
		if tool.id == "TOL-005":
			check(page.bench.get_rect().end.x <= page.detail_panel.position.x-8, "scale controls fit beside detail panel")
			for key in [page.tare_button, page.place_button]:
				var world: Vector2 = active.ui_to_world(key.get_global_rect().get_center())
				await move(active, world)
				await button(active, world, true)
				await button(active, world, false)
			check(page.tared and page.scale_occupied, "real pointer tares empty scale and places the actual watch")
			check(not page.scale_stable and not game.item(page.it_uid).evidence.has("TOL-005"), "real placement cannot record an unsettled reading")
			await create_timer(1.3).timeout
			check(game.trade_item().evidence.has("TOL-005"), "real placement automatically saves stable mass without another click")

	active.go("repair")
	await process_frame
	await process_frame
	active = shell.active_shell()
	page = active.page
	for i in 8: await process_frame
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
	# Buying supplies refreshes the paper without rebuilding physical work.
	var cleaned = page.cleaning.serialize()
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
	check(page.cleaning.serialize() == cleaned, "buying supplies preserves the physical cleaning mask")
	var updated_quantity := false
	for control in page.info.find_children("*", "Label", true, false):
		if control.name == "MAT-001" and control.text == "×%d" % (materials_before + 1):
			updated_quantity = true
	check(updated_quantity, "supply count refreshes after purchase")
	game.state.trade = old_trade
	game.state.cursor = old_cursor
	game.item(page.it_uid).service.tasks = ["open","assemble","test"]
	game.item(page.it_uid).service.done = []
	page._stage_ui()
	await create_timer(0.2).timeout
	var action_target: Dictionary = page.art.interaction_targets()[0]
	var point: Vector2 = active.ui_to_world(page.art.global_position + action_target.position)
	await move(active,point)
	await button(active,point,true)
	await button(active,point,false)
	for i in 100: page.art._process(0.03)
	await process_frame
	check(page.art.progress_snapshot().step >= 1, "real pointer operates the actual cover tool at its target")
	var old_step: int = page.art.progress_snapshot().step
	var load_point: Vector2 = active.ui_to_world(page.action_button.get_global_rect().get_center())
	var emulation := Input.emulate_mouse_from_touch
	Input.emulate_mouse_from_touch = true
	await touch(active,load_point,true)
	await touch(active,load_point,false)
	for i in 100: page.art._process(0.03)
	check(page.art.progress_snapshot().step > old_step, "touch equivalent animates the next physical operation")
	Input.emulate_mouse_from_touch = emulation
	# A sharper drawer must still route the same real pointer input after the
	# display resolution changes, without resetting the item or the tool.
	active.go("inspect")
	await process_frame
	active = shell.active_shell()
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
			check(viewport.get_visible_rect().size == Vector2(1440, 800), "compact logical drawer layout remains stable at %s×" % render_scale)
			check(viewport.size == Vector2i(roundi(1440 * render_scale), roundi(800 * render_scale)), "drawer raster follows %s× display resolution" % render_scale)
			check(page.it_uid == uid and page.tool == "TOL-005", "resizing preserves the selected lot and instrument")
			if page.scale_occupied: page._scale_remove()
			page.tared = false
			page._scale_controls()
			var world: Vector2 = active.ui_to_world(page.tare_button.get_global_rect().get_center())
			await move(active, world)
			await button(active, world, true)
			await button(active, world, false)
			check(page.tared, "physical scale tare remains clickable at %s×" % render_scale)

	print("GEOMETRY failures=",failures)
	shell.queue_free()
	await process_frame
	quit(1 if failures else 0)
