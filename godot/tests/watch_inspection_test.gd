extends SceneTree
var failures := 0
func _initialize(): call_deferred("run")
func check(ok: bool, label: String):
	print("WATCH INSPECT ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1
func labels_contain(node: Node, fragment: String) -> bool:
	for label in node.find_children("*", "Label", true, false):
		if label.text.contains(fragment): return true
	return false
func check_finding_clear(page, title: String):
	var active = page.shell
	var card: Rect2 = page.finding_panel.get_rect()
	var watch_transform: Transform2D = active.get_viewport().get_canvas_transform()*page.item.body.global_transform
	var watch_bounds: Rect2 = watch_transform*Rect2(-page.item.tex_size()*.5,page.item.tex_size())
	var target: Vector2 = active.world_to_ui(page._optical_target())
	var radius: float = absf(active.world_to_ui(page._optical_target()+Vector2(page.lens_ring.radius*page.lens.scale.x,0)).x-target.x)
	var lens_bounds := Rect2(target-Vector2.ONE*radius,Vector2.ONE*radius*2)
	check(not card.intersects(watch_bounds) and not card.intersects(lens_bounds) and not card.intersects(page.optical_pin_button.get_rect()),title+" keeps the result outside the complete watch, centered lens and pin button")
func run():
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await process_frame
	shell._close_title()
	game.new_game("WATCH-INSPECT")
	game.state = Model.reduce(game.state, {"type":"ARRIVE"})
	shell.go("inspect")
	await process_frame
	var page = shell.active_shell().page
	check(page.tool_buttons.keys().size() == 3 and not page.tool_buttons.has("SPEC"), "only three physical tools")
	page._set_tool("TOL-003")
	check(page.tool == "", "removed instrument cannot open")
	page._set_tool("TOL-005")
	await process_frame
	await process_frame
	if not page.has_method("_scale_place"):
		check(false, "physical scale placement and guards exist")
	else:
		var initial_range := Model.estimate(game.item(page.it_uid))
		var original = page.item
		var start: Vector2 = original.position
		check(not page._scale_place(), "placement requires empty tare")
		check(not page._scale_record(), "empty scale cannot record")
		check(page._scale_tare(), "empty scale can tare")
		check(page._scale_place(), "touch placement puts current item on pan")
		check(page.item == original and page.scale_occupied, "same item occupies scale")
		check(page.bench_body.find_children("*","Button",true,false).all(func(button):return button.text!="取回手表"),"scale has no redundant return-watch button")
		check(page._scale_place() and page.scale_occupied and not page.scale_stable,"place action can restart weighing the same original")
		check(page._scale_tare() and not page.scale_occupied and page.item==original,"tare automatically clears the same original before zeroing")
		if page.scale_occupied: page._scale_remove()
		page._scale_tare();page._scale_place()
		check(not page._scale_record(), "unsettled scale cannot record")
		await create_timer(0.65).timeout
		check(not page.scale_stable and not page._scale_record(), "reduced motion still waits for stable reading")
		await create_timer(0.7).timeout
		check(page.scale_stable, "reading settles between one and one and a half seconds")
		var mass: float = page.scale_reading
		check(game.item(page.it_uid).evidence.has("TOL-005"), "stable reading automatically records without a button")
		check(page.bench_body.find_children("*","Button",true,false).all(func(button): return button.text != "记录克数"), "scale has no manual record button")
		check(game.item(page.it_uid).evidence.has("TOL-005"), "recorded stable scale evidence")
		var current_range := Model.estimate(game.item(page.it_uid))
		var expected_range := "%s–%s → %s–%s Cr" % [Model.jnum(initial_range.low),Model.jnum(initial_range.high),Model.jnum(current_range.low),Model.jnum(current_range.high)]
		check(page.finding_panel.visible and page.finding_label.text.contains(expected_range) and page.finding_label.text.contains(Model.displayed_clue(game.item(page.it_uid),"TOL-005")), "mat displays actual finding and before/after range")
		check(is_equal_approx(page.finding_panel.modulate.a,1.0) and not page.finding_tween, "reduced motion displays the full finding immediately")
		var latest: Dictionary = shell.get_meta("latest_inspection",{})
		check(latest.get("uid")==page.it_uid and latest.get("tool")=="TOL-005", "quote attribution identifies exact watch and tool")
		page._scale_record()
		check(is_same(latest,shell.get_meta("latest_inspection",{})), "duplicate stable reading does not reissue attribution")
		var after_auto: float = game.state.ap
		await create_timer(0.3).timeout
		check(game.state.ap==after_auto,"stable item does not repeatedly charge AP")
		page._scale_remove()
		check(not page.scale_occupied and page.item == original and page.item.position.is_equal_approx(start), "return restores same physical item")
		page._scale_place()
		await create_timer(1.3).timeout
		check(is_equal_approx(page.scale_reading, mass), "repeat weighing preserves instance mass")
		var before_repair: String = Model.displayed_clue(game.item(page.it_uid), "TOL-005")
		var repaired_item: Dictionary = game.item(page.it_uid)
		repaired_item.watch.part_mass = 4.2
		repaired_item.watch.missing_part = "内侧固定部件"
		WatchRules.restore_parts(repaired_item)
		page.on_changed({},game.state,{"type":"WORKSPACE_RESUME"})
		check(not page.finding_panel.visible, "returning from repair clears the old local result for the same watch")
		page._refresh_info()
		check(labels_contain(page.info, before_repair), "repair preserves previous recorded mass in evidence panel")
		var ap_before: float = game.state.ap
		await create_timer(1.3).timeout
		page._scale_record()
		check(Model.displayed_clue(game.item(page.it_uid), "TOL-005") == WatchRules.reading(game.item(page.it_uid), "TOL-005"), "stable remeasurement updates recorded mass after repair")
		check(is_equal_approx(game.state.ap, ap_before), "remeasurement uses no extra AP")
		page._set_tool("TOL-002")
		check(not page.scale_occupied and page.item.draggable, "switching tools returns occupied item")
		check(page.item.reveal.text == load("res://scripts/model/watch_rules.gd").serial(game.item(page.it_uid)), "UV shows actual instance serial")
		page._set_tool("TOL-001")
		check(is_zero_approx(float(page.item.reveal.material.get_shader_parameter("uv_r"))), "serial hidden after UV closes")
		page.optical_pin_button.pressed.emit()
		page.optical_position = page.item.logo_world_position()
		await create_timer(1.0).timeout
		check(game.item(page.it_uid).evidence.has("TOL-001"), "loupe records observation at actual instance logo")
		var pose: Vector2 = page.item.position
		var active = shell.active_shell()
		active.open_watch_manual(game.item(page.it_uid).defId)
		await process_frame
		check(not active.modal_open() and shell.root_ui.find_child("inspection_guide",true,false).visible and page.tool == "TOL-001", "guide opens above current inspection without blocking tools")
		shell.root_ui.find_child("inspection_guide",true,false).close_document()
		await process_frame
		check(page.item.position.is_equal_approx(pose) and page.optical_fixed, "manual preserves item pose and fixed lens")
	for price_tool in ["TOL-001", "TOL-002", "TOL-005"]:
		game.dispatch({"type":"CHECK", "uid":page.it_uid, "tool":price_tool})
	var unchanged_reading := Model.displayed_clue(game.item(page.it_uid), "TOL-005")
	game.item(page.it_uid).condition = 0.77
	page._set_tool("TOL-005")
	page._scale_tare()
	page._scale_place()
	await create_timer(1.3).timeout
	page._scale_record()
	check(Model.estimate(game.item(page.it_uid)).count == 3 and Model.estimate(game.item(page.it_uid)).conditionCurrent and Model.displayed_clue(game.item(page.it_uid),"TOL-005") == unchanged_reading, "one same-mass recheck refreshes wear while preserving all physical channels")
	shell.close_workspace()
	root.size = Vector2i(844,390)
	shell.phone_override = true
	await process_frame
	shell._fit()
	for i in 8: await process_frame
	shell.go("inspect")
	for i in 8: await process_frame
	page = shell.active_shell().page
	for id in ["TOL-001","TOL-002"]:
		page._set_tool(id)
		for i in 4: await process_frame
		var key: Button = page.optical_pin_button
		var css_height: float = key.size.y*shell.active_shell().touch_scale()
		check(css_height>=43.99 and page.mat_rect.encloses(key.get_rect()), "%s mat pin fits and spans at least 44 CSS pixels (%.1f)" % [id,css_height])
		check(key.text==("固定镜片" if id=="TOL-001" else "固定紫外灯") and key.size.x>=key.get_combined_minimum_size().x, "short caption fits optical action")
		key.pressed.emit()
		check(page.optical_pinned and key.text=="解除固定" and page.optical_position.is_equal_approx(page._optical_target()), "pin centers on the physical feature")
		key.pressed.emit()
		check(not page.optical_pinned, "second press releases the instrument")
	page._set_tool("TOL-001")
	for i in 4: await process_frame
	game.prefs.reduced_motion = false
	page._show_finding("放大镜 · 可见标识：五角星下有一条短横。边缘有使用磨痕。",{"low":5,"high":109},{"low":18,"high":71})
	check(page.finding_label.text.ends_with("5–109 → 5–109 Cr"), "range animation starts at true pre-inspection endpoints")
	await create_timer(.15).timeout
	check(not page.finding_label.text.ends_with("→ 5–109 Cr") and not page.finding_label.text.ends_with("→ 18–71 Cr"), "the visible endpoints interpolate during the transition")
	await create_timer(.35).timeout
	check(page.finding_label.text.ends_with("5–109 → 18–71 Cr"), "the range animation lands on the actual quote")
	check(page.mat_rect.encloses(page.finding_panel.get_rect()) and page.finding_panel.size.y<page.mat_rect.size.y*.65 and page.finding_panel.get_global_rect().encloses(page.finding_label.get_global_rect()), "wrapped finding and both ranges fit a compact mat card")
	check(page.finding_label.size.y>=page.finding_label.get_line_height()*2,"the card gives both lines visible height")
	check_finding_clear(page,"844×390")
	page._show_finding("电子秤",{"low":18,"high":71},{"low":18,"high":71})
	check(not page.finding_tween and page.finding_label.text.ends_with("18–71 → 18–71 Cr"), "unchanged range renders exact endpoints immediately")
	game.prefs.reduced_motion = true
	page._show_finding("电子秤",{"low":18,"high":71},{"low":5,"high":109})
	check(not page.finding_tween and page.finding_label.text.ends_with("18–71 → 5–109 Cr"), "reduced motion immediately shows an actual widening")
	shell.close_workspace()
	for dimensions in [Vector2i(667,375),Vector2i(568,320),Vector2i(390,844)]:
		root.size=dimensions
		for i in 8: await process_frame
		shell._fit()
		shell.go("inspect")
		for i in 8: await process_frame
		page=shell.active_shell().page
		page._set_tool("TOL-001")
		for i in 4: await process_frame
		page._show_finding("放大镜 · 可见标识：五角星下有一条短横。边缘有使用磨痕。",{"low":5,"high":109},{"low":18,"high":71})
		for i in 6: await process_frame
		var result: Rect2 = page.compact_finding.get_global_rect()
		check(page.compact_finding.is_visible_in_tree() and not page.finding_panel.visible and page.bench_scroll.get_global_rect().encloses(result), "%s keeps the complete compact reading in the existing instructions" % str(dimensions))
		check(page.compact_finding.text=="估价 5–109 → 18–71 Cr\n五角星下有一条短横。边缘有使用磨痕。", "compact reading keeps the actual ranges and physical marks")
		check(not result.intersects(page.mat_rect) and not result.intersects(page.optical_pin_button.get_global_rect()) and not result.intersects(page.find_child("inspection_actions",true,false).get_global_rect()), "compact finding leaves the mat and action rows accessible")
		page._set_tool("TOL-002")
		check(not page.compact_finding.visible,"switching tools restores instructions at compact widths")
		shell.close_workspace()
		for i in 8: await process_frame
	root.size=Vector2i(1440,900)
	shell.phone_override=false
	for i in 8: await process_frame
	shell._fit()
	shell.go("inspect")
	for i in 8: await process_frame
	page=shell.active_shell().page
	page._set_tool("TOL-001")
	for i in 4: await process_frame
	page._show_finding("放大镜 · 可见标识：五角星下有一条短横。边缘有使用磨痕。",{"low":5,"high":109},{"low":18,"high":71})
	check_finding_clear(page,"1440×900")
	print("WATCH INSPECT failures=", failures)
	for player in root.find_children("*", "AudioStreamPlayer", true, false):
		player.stop()
		player.stream = null
	for player in root.find_children("*", "AudioStreamPlayer2D", true, false):
		player.stop()
		player.stream = null
	await process_frame
	shell.queue_free()
	await create_timer(0.1).timeout
	quit(1 if failures else 0)
