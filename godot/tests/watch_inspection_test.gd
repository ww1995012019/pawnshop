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
		var original = page.item
		var start: Vector2 = original.position
		check(not page._scale_place(), "placement requires empty tare")
		check(not page._scale_record(), "empty scale cannot record")
		check(page._scale_tare(), "empty scale can tare")
		check(page._scale_place(), "touch placement puts current item on pan")
		check(page.item == original and page.scale_occupied, "same item occupies scale")
		check(not page._scale_place() and not page._scale_tare(), "occupied scale cannot place twice or tare")
		check(not page._scale_record(), "unsettled scale cannot record")
		await create_timer(0.65).timeout
		check(not page.scale_stable and not page._scale_record(), "reduced motion still waits for stable reading")
		await create_timer(0.7).timeout
		check(page.scale_stable, "reading settles between one and one and a half seconds")
		var mass: float = page.scale_reading
		check(page._scale_record(), "stable reading can record")
		check(game.item(page.it_uid).evidence.has("TOL-005"), "recorded stable scale evidence")
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
		page.optical_fixed = true
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
	check(Model.estimate(game.item(page.it_uid)).count == 1 and Model.displayed_clue(game.item(page.it_uid),"TOL-005") == unchanged_reading, "same mass can refresh stale appraisal after a condition change")
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
