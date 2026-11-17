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
	return active.get_viewport().get_screen_transform()*active.world_to_ui(world)
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
func click_root(control: Control) -> void:
	var at: Vector2 = root.get_final_transform()*control.get_global_rect().get_center()
	var motion := InputEventMouseMotion.new()
	motion.position = at
	Input.parse_input_event(motion)
	for held in [true,false]:
		var event := InputEventMouseButton.new()
		event.position = at
		event.button_index = MOUSE_BUTTON_LEFT
		event.pressed = held
		Input.parse_input_event(event)
		await frames(3)
func check_portrait_inspection_actions(active,page) -> void:
	var manual: Button = page.get_node("watch_manual")
	var records: Button = page.get_node("portrait_records")
	var budget: float = page.mat_rect.size.x-32
	check(manual.size.x >= minf(150,budget*.54) and records.size.x >= minf(130,budget*.46),"portrait independent guide/records controls retain explicit readable widths")
	check(records.get_global_rect().end.x+7.5 <= manual.get_global_rect().position.x,"portrait independent actions keep an eight-pixel gap")
	for key in [manual,records]:
		var caption: float = key.get_theme_font("font").get_string_size(key.text,HORIZONTAL_ALIGNMENT_LEFT,-1,key.get_theme_font_size("font_size")).x
		check(key.size.x >= caption+12,"portrait action caption fits its actual button")
	var at: Vector2 = active.ui_to_world(manual.get_global_rect().get_center())
	await move(active,at)
	await press(active,at,true)
	await press(active,at,false)
	var guide = shell.root_ui.find_child("inspection_guide",false,false)
	check(guide != null and guide.is_visible_in_tree(),"actual portrait guide click opens its visible non-modal paper")
	if guide != null and guide.visible: await click_root(guide.close_button)
	at = active.ui_to_world(records.get_global_rect().get_center())
	await move(active,at)
	await press(active,at,true)
	await press(active,at,false)
	check(active.modal_open(),"actual portrait records click opens the records sheet")
	active.close_top_modal()
	await frames()
func check_scale_console(active, page, label: String) -> void:
	var bounds: Rect2 = active.get_viewport().get_canvas_transform()*page.scale_pan.global_transform*page.scale_pan.body_rect()
	var watch_rect: Rect2 = page.item.body.get_global_transform_with_canvas()*Rect2(-page.item.tex_size()*.5,page.item.tex_size())
	if active.portrait_mode(): check(watch_rect.size.y >= 60,label+" scale watch retains a visible inspection footprint")
	check(page.mat_rect.encloses(watch_rect),label+" complete watch stays inside the scale work surface")
	check(watch_rect.end.y <= active.world_to_ui(page.scale_pan.to_global(page.scale_pan.pan_position())).y+1,label+" empty-scale watch fits fully above the physical pan")
	check(page.item.bounds.size.x > 0 and page.item.bounds.size.y > 0,label+" fitted scale watch keeps valid mouse drag bounds")
	check_portrait_scale_watch_clear(active,page,label+" empty")
	for key in [page.tare_button,page.place_button]:
		check(bounds.encloses(key.get_global_rect()),label+" real scale button sits inside the physical housing")
		check(key.get_global_rect().size.y >= 43,label+" scale button remains a finger-sized target")
		if not key.disabled: check(shell._keyboard_controls().has(key),label+" scale button remains in keyboard focus order")
	check(bounds.encloses(page.scale_label.get_global_rect()),label+" actual LCD reading sits inside the housing")
	check(page.bench_body.find_children("*","Button",true,false).is_empty(),label+" instruction strip has no duplicate scale buttons")
	check(not page.bench_body.is_ancestor_of(page.scale_label),label+" instruction strip has no duplicate LCD readout")
	var physical_key: Vector2 = page.tare_button.get_global_rect().get_center()
	page.position.y += 9
	await frames(2)
	check(page.tare_button.get_global_rect().get_center().distance_to(physical_key) < 1,label+" instrument key stays on its housing during page presentation movement")
	page.position.y -= 9
	await frames(2)
	check(not page.tared and page.place_button.disabled,label+" untared instrument disables its real placement key")
	var ap_before: float = root.get_node("Game").state.ap
	var before_uid: String = page.it_uid
	var original = page.item
	var at: Vector2 = active.ui_to_world(page.tare_button.get_global_rect().get_center())
	await move(active,at)
	await press(active,at,true)
	await press(active,at,false)
	check(page.tared and not page.scale_occupied and not page.place_button.disabled,label+" physical TARE key zeros the empty scale")
	check(shell._keyboard_controls().has(page.place_button),label+" enabled scale placement joins keyboard focus order")
	page.place_button.grab_focus()
	for pressed in [true,false]:
		var event := InputEventKey.new()
		event.keycode = KEY_SPACE
		event.pressed = pressed
		Input.parse_input_event(event)
		await frames(2)
	check(page.scale_occupied and page.item == original and page.it_uid == before_uid,label+" keyboard placement moves the same original onto the pan")
	check(not page.scale_stable and not page._scale_record(),label+" physical placement cannot record an unsettled reading")
	check(root.get_node("Game").state.ap == ap_before,label+" tare and intermediate placement spend no AP")
	var emulation := Input.emulate_mouse_from_touch
	Input.emulate_mouse_from_touch = true
	at = active.ui_to_world(page.tare_button.get_global_rect().get_center())
	await touch(active,at,true)
	await touch(active,at,false)
	check(page.tared and not page.scale_occupied and page.item == original,label+" touch TARE clears the same watch before zeroing")
	at = active.ui_to_world(page.place_button.get_global_rect().get_center())
	await touch(active,at,true)
	await touch(active,at,false)
	check(page.scale_occupied and page.item == original,label+" touch placement uses the integrated physical key")
	await create_timer(.35).timeout
	check_portrait_scale_watch_clear(active,page,label+" loaded")
	Input.emulate_mouse_from_touch = emulation
	page._scale_remove()
	page._set_tool("TOL-005")
	await frames()
func check_portrait_scale_watch_clear(active,page,label: String) -> void:
	if not active.portrait_mode(): return
	var art: Rect2 = page.item.body.get_global_transform_with_canvas()*Rect2(-page.item.tex_size()*.5,page.item.tex_size())
	for name in ["watch_manual","portrait_records"]:
		var button: Rect2 = page.get_node(name).get_global_rect()
		if art.intersects(button): print("TOOLS SCALE OVERLAP ",label," art=",art," button=",name," ",button," mat=",page.mat_rect)
		check(not art.intersects(button),label+" whole watch art remains clear of "+name)
	check(art.size.y >= 60 and page.mat_rect.encloses(art),label+" complete portrait watch remains readable inside the mat")
	check(page.item.bounds.size.x > 0 and page.item.bounds.size.y > 0,label+" portrait watch retains positive drag bounds")
func check_short_portrait_actions(active,page) -> void:
	var game = root.get_node("Game")
	game.state.day = 29
	game.state.phase = "open"
	game.ensure_shop_state(game.state)
	page._set_tool("TOL-005")
	await frames()
	print("TOOLS SHORT ACTUAL content=",active.content_rect()," bench=",page.bench.get_rect()," detail=",page.detail_panel.get_rect())
	check(active.content_rect().encloses(page.detail_panel.get_rect()),"short portrait details use only their real remaining viewport")
	var scroll := page.find_child("inspection_detail_scroll",true,false) as ScrollContainer
	check(scroll != null,"short portrait details have their own native scrolling surface")
	if scroll == null: return
	check(page._power_copy("TOL-005").contains("+0.5"),"short portrait uses the real current-day electricity explanation")
	var instructions: ScrollContainer = page.bench_scroll
	check(instructions.vertical_scroll_mode == ScrollContainer.SCROLL_MODE_AUTO,"short portrait explanation has its own local scroll")
	var copy: String = page.bench_body.get_child(1).text
	var instruction_at: Vector2 = active.ui_to_world(instructions.get_global_rect().get_center())
	await move(active,instruction_at)
	for i in 24:
		var wheel := InputEventMouseButton.new()
		wheel.position = pointer(active,instruction_at)
		wheel.button_index = MOUSE_BUTTON_WHEEL_DOWN
		wheel.pressed = true
		Input.parse_input_event(wheel)
		await frames(2)
	check(instructions.scroll_vertical > 0 and page.bench_body.get_child(1).text == copy,"real instruction scroll preserves the complete electricity explanation")
	root.size = Vector2i(390,844)
	await frames()
	check(instructions.vertical_scroll_mode == ScrollContainer.SCROLL_MODE_DISABLED,"long portrait restores the complete unscrolled explanation panel")
	root.size = Vector2i(844,390)
	await frames()
	check(instructions.vertical_scroll_mode == ScrollContainer.SCROLL_MODE_AUTO and scroll.vertical_scroll_mode == ScrollContainer.SCROLL_MODE_DISABLED,"rotation restores the existing landscape scroll modes")
	root.size = Vector2i(390,640)
	await frames()
	check_portrait_scale_watch_clear(active,page,"short portrait after rotation")
	var action: Button
	for key in page.find_child("inspection_actions",true,false).get_children():
		if key.get_meta("desktop_caption") == "去维修": action = key
	check(scroll.follow_focus,"portrait detail scrolling follows keyboard focus")
	check(scroll.size.y <= active.content_rect().end.y-scroll.global_position.y+1,"detail scroll range uses the actual visible height")
	action.grab_focus()
	await frames()
	check(scroll.scroll_vertical > 0,"keyboard focus reveals the final portrait action")
	scroll.scroll_vertical = 0
	await frames()
	var at: Vector2 = active.ui_to_world(scroll.get_global_rect().get_center())
	await move(active,at)
	for i in 24:
		var wheel := InputEventMouseButton.new()
		wheel.position = pointer(active,at)
		wheel.button_index = MOUSE_BUTTON_WHEEL_DOWN
		wheel.pressed = true
		Input.parse_input_event(wheel)
		await frames(2)
	check(scroll.scroll_vertical > 0,"real wheel input scrolls the short portrait details")
	var visible: Rect2 = action.get_global_rect().intersection(scroll.get_global_rect())
	check(visible.has_area(),"final portrait repair action has a real visible click region after scrolling")
	at = active.ui_to_world(visible.get_center())
	await move(active,at)
	var hovered = active.get_viewport().gui_get_hovered_control()
	if hovered != action: print("TOOLS SHORT HOVER target=",action.text," actual=",hovered.text if hovered is Button else hovered," projected=",pointer(active,at))
	check(hovered == action,"scrolled final action receives the actual pointer hit")
	await press(active,at,true)
	await press(active,at,false)
	await create_timer(.2).timeout
	if shell.active_shell().page_name != "repair":
		print("TOOLS SHORT CLICK action=",action.get_global_rect()," visible=",visible," scroll=",scroll.get_global_rect()," value=",scroll.scroll_vertical," disabled=",action.disabled," hovered=",active.get_viewport().gui_get_hovered_control()," page=",shell.active_shell().page_name," modal=",active.modal_open()," item_busy=",page.item.busy)
	check(shell.active_shell().page_name == "repair","real click on the scrolled final action opens repair")
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
	await check_scale_console(active,page,"desktop")
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
		active.go("inspect",lot.uid)
		await frames()
		active = shell.active_shell()
		page = active.page
		page._set_tool("TOL-005")
		await frames()
		await check_scale_console(active,page,str(dimensions))
		if active.portrait_mode():
			await check_portrait_inspection_actions(active,page)
			root.size = Vector2i(320,844)
			await frames()
			await check_portrait_inspection_actions(active,page)
			for compact in [Vector2i(320,844),Vector2i(390,640),Vector2i(320,640)]:
				root.size = compact
				await frames()
				check_portrait_scale_watch_clear(active,page,str(compact))
				print("TOOLS SCALE COMPACT ",compact," content=",active.content_rect()," mat=",page.mat_rect," bench=",page.bench.get_rect()," detail=",page.detail_panel.get_rect())
			root.size = Vector2i(844,390)
			await frames()
			root.size = Vector2i(390,844)
			await frames()
			check(page.get_node("watch_manual").size.x >= 150 and page.get_node("portrait_records").size.x >= 130,"rotation back to portrait restores full independent action widths")
			check_portrait_scale_watch_clear(active,page,"rotation back")
			root.size = Vector2i(390,640)
			await frames()
			await check_short_portrait_actions(active,page)
	shell.queue_free()
	await frames()
	print("TOOLS POLISH failures=", failures)
	quit(1 if failures else 0)
