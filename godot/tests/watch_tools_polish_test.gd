extends SceneTree
var failures := 0
var shell
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
	print("TOOLS POLISH ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1
func frames(count := 8) -> void:
	for i in count: await process_frame
func pointer(active, world: Vector2) -> Vector2:
	return root.get_final_transform() * (shell.workspace_container.global_position + active.world_to_ui(world))
func move(active, world: Vector2, held := false) -> void:
	var event := InputEventMouseMotion.new()
	event.position = pointer(active, world)
	event.global_position = event.position
	event.button_mask = MOUSE_BUTTON_MASK_LEFT if held else 0
	Input.parse_input_event(event)
	await frames()
func press(active, world: Vector2, held: bool) -> void:
	var event := InputEventMouseButton.new()
	event.position = pointer(active, world)
	event.global_position = event.position
	event.button_index = MOUSE_BUTTON_LEFT
	event.button_mask = MOUSE_BUTTON_MASK_LEFT if held else 0
	event.pressed = held
	Input.parse_input_event(event)
	await frames()
func touch(active, world: Vector2, held: bool) -> void:
	var event := InputEventScreenTouch.new()
	event.position = pointer(active, world)
	event.index = 0
	event.pressed = held
	Input.parse_input_event(event)
	await frames()
func swipe(active, world: Vector2) -> void:
	var event := InputEventScreenDrag.new()
	event.position = pointer(active, world)
	event.index = 0
	Input.parse_input_event(event)
	await frames()
func run() -> void:
	var game = root.get_node("Game")
	game.new_game("TOOLS-POLISH")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	shell.go("inspect")
	await frames()
	var active = shell.active_shell()
	var page = active.page
	page._set_tool("TOL-001")
	await frames()
	var start: Vector2 = page.lens.global_position
	var empty: Vector2 = active.ui_to_world(page.mat_rect.position + Vector2(20, 20))
	await move(active, empty)
	check(page.lens.global_position.is_equal_approx(start), "ordinary hover leaves magnifier at its resting position")
	await press(active, empty, true)
	await move(active, empty + Vector2(30, 10), true)
	await press(active, empty + Vector2(30, 10), false)
	check(page.lens.global_position.is_equal_approx(start), "pressing empty mat never teleports or drags magnifier")
	var grab: Vector2 = page.lens.to_global(Vector2(35, 20))
	await move(active, grab)
	await press(active, grab, true)
	check(page.lens.global_position.distance_to(start) < 1, "grabbing the lens preserves pointer offset")
	var shift := Vector2(24, -14)
	await move(active, grab + shift, true)
	check(page.lens.global_position.distance_to(start + shift) < 2, "held lens movement follows drag distance")
	await press(active, grab + shift, false)
	var released: Vector2 = page.lens.global_position
	await move(active, grab + shift + Vector2(40, 20))
	check(page.lens.global_position.is_equal_approx(released) and not page.optical_dragging, "release freezes magnifier before later pointer movement")
	var emulation := Input.emulate_mouse_from_touch
	Input.emulate_mouse_from_touch = true
	grab = page.lens.to_global(Vector2(-20, 15))
	await touch(active, grab, true)
	await swipe(active, grab + Vector2(-22, -12))
	check(page.lens.global_position.distance_to(released + Vector2(-22, -12)) < 2, "held touchscreen drag moves the same physical lens with its grab offset")
	await touch(active, grab + Vector2(-22, -12), false)
	released = page.lens.global_position
	await move(active, grab + Vector2(25, 20))
	check(page.lens.global_position.is_equal_approx(released) and not page.optical_dragging, "touch release stops all later magnifier movement")
	Input.emulate_mouse_from_touch = emulation
	var handle: Vector2 = page.lens.to_global(Vector2(155, 155))
	await move(active, handle)
	await press(active, handle, true)
	await move(active, handle + Vector2(-20, 0), true)
	check(page.lens.global_position.distance_to(released + Vector2(-20, 0)) < 2, "real magnifier handle can be held and dragged")
	active.open_settings()
	await frames()
	var blocked: Vector2 = page.lens.global_position
	check(not page.optical_dragging, "opening a modal cancels the current magnifier grab")
	active.close_top_modal()
	await press(active, handle, false)
	await move(active, handle + Vector2(30, 10))
	check(page.lens.global_position.is_equal_approx(blocked), "closing a modal does not revive the previous grab")
	grab = page.lens.to_global(Vector2(20, 0))
	await move(active, grab)
	await press(active, grab, true)
	page.propagate_notification(Node.NOTIFICATION_APPLICATION_FOCUS_OUT)
	await move(active, grab + Vector2(16, 0), true)
	check(not page.optical_dragging and page.lens.global_position.is_equal_approx(blocked), "application focus loss cancels a held magnifier without resuming movement")
	await press(active, grab + Vector2(16, 0), false)
	page._set_tool("TOL-005")
	await frames()
	check(page.scale_pan.has_method("body_rect") and page.scale_pan.has_method("pan_position"), "scale exposes its full housing and real weighing platform")
	if page.scale_pan.has_method("body_rect"):
		var bounds: Rect2 = active.get_viewport().get_canvas_transform() * page.scale_pan.global_transform * page.scale_pan.body_rect()
		check(page.mat_rect.encloses(bounds), "complete electronic scale fits inside its live surface")
		check(page.scale_pan.display_state() == "ZERO REQUIRED", "physical LCD distinguishes an untared scale")
		page._scale_tare()
		check(page.scale_pan.display_state() == "ZERO", "physical LCD shows successful empty tare")
		page._scale_place()
		check(page.scale_pan.display_state() == "SETTLING", "physical LCD distinguishes unsettled weighing")
		await create_timer(1.3).timeout
		check(page.scale_pan.display_state() == "STABLE", "physical LCD shows the stable reading")
		var bottom: Vector2 = page.item.position + Vector2(0, page.item.tex_size().y * page.item.display_scale * .5)
		check(bottom.distance_to(page.scale_pan.to_global(page.scale_pan.pan_position())) < 8, "same actual watch rests on the physical weighing platform")
	active.go("repair")
	await frames()
	page = shell.active_shell().page
	var notice: Rect2 = page.toast_rect()
	check(not notice.intersects(page.instruction.get_global_rect()), "repair status notice has space separate from wrapped instructions")
	check(notice.size.y >= 72, "repair status reserves two readable desktop notice lines")
	check(not notice.intersects(page.mode_bar.get_global_rect()) and not notice.intersects(page.guidance_body.get_child(0).get_global_rect()), "repair notice never covers mode controls or current heading")
	check(not notice.intersects(page.art.get_rect()) and not notice.intersects(page.bench.get_rect()), "repair notice leaves live tools and primary controls clear")
	active = shell.active_shell()
	active.toast("维修工单已保存；当前工序进度、耗材记录和原物状态均已保留，可随时返回继续处理。")
	await frames()
	var feedback: Control = active.toast_box.get_child(active.toast_box.get_child_count()-1)
	check(not feedback.get_global_rect().intersects(page.instruction.get_global_rect()), "actual two-line saved-work notice leaves current instructions readable")
	var lot: Dictionary = game.item(page.it_uid)
	lot.service.tasks = []
	lot.service.done = []
	page._stage_ui()
	page.instruction.text = "本件无需维修。".repeat(18)
	page.queue_relayout()
	await frames()
	check(not page.toast_rect().intersects(page.instruction.get_global_rect()), "long wrapped no-repair guidance reserves separate notice space")
	for dimensions in [Vector2i(844,390),Vector2i(390,844)]:
		shell.close_workspace()
		root.size = dimensions
		shell.phone_override = true
		await frames()
		shell.go("repair",lot.uid)
		await frames()
		active = shell.active_shell()
		page = active.page
		for section in [0,1,2]:
			page.portrait_section = section
			page.relayout()
			await frames()
			notice = page.toast_rect()
			if not active.content_rect().encloses(notice):
				print("TOOLS NOTICE GEOMETRY ",active.content_rect()," notice ",notice," panel ",page.list_panel.get_rect()," landscape ",active.landscape_mode()," grid ",page.list_box.columns," gridmin ",page.list_box.get_combined_minimum_size()," listmin ",page.list_panel.get_combined_minimum_size())
			check(active.content_rect().encloses(notice) and notice.size.y >= 52, "mobile repair tab %d reserves a visible readable notice strip at %s" % [section,dimensions])
			var panel: Control = page.list_panel if section == 0 else page.detail_panel
			check(not notice.intersects(page.instruction.get_global_rect()) if section == 1 else not notice.intersects(panel.get_rect()), "mobile repair tab %d keeps its content clear of status" % section)
	shell.queue_free()
	await frames()
	print("TOOLS POLISH failures=", failures)
	quit(1 if failures else 0)
