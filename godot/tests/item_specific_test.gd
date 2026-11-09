extends SceneTree

var failures := 0

func _initialize() -> void:
	call_deferred("run")

func check(ok: bool, message: String) -> void:
	print("ITEM CHECK ", "PASS " if ok else "FAIL ", message)
	if not ok:
		failures += 1

func settle() -> void:
	for i in 4:
		await process_frame

func tap(shell, control: Control) -> void:
	var point: Vector2 = root.get_final_transform() * (shell.workspace_container.get_global_rect().position + control.get_global_rect().get_center())
	for down in [true, false]:
		var event := InputEventScreenTouch.new()
		event.index = 0
		event.position = point
		event.pressed = down
		Input.parse_input_event(event)
		await settle()

func run() -> void:
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await settle()
	shell._close_title()
	game.new_game("ORBITAL-P0")
	var shoe: Dictionary = game.state.inventory[0]
	shoe.defId = "ITM-081"
	var shoe_uid: String = shoe.uid
	shoe.evidence = []
	shoe.inspectedPaid = false
	game.focus_uid = shoe.uid
	var path := "res://data/inspection_profiles.json"
	check(FileAccess.file_exists(path), "each item has a specific inspection profile")
	if FileAccess.file_exists(path):
		var profiles = JSON.parse_string(FileAccess.get_file_as_string(path))
		for definition in GameData.item_list + [GameData.def("BND-001")]:
			var profile = profiles.get(definition.id, {})
			check(profile.has("title") and profile.has("normal") and profile.get("steps", []).size() >= 2, definition.name + " has its own concrete inspection steps and result")
	shell.go("inspect")
	await settle()
	var page = shell.active_shell().page
	check(page.tool_buttons["TOL-001"].visible, "magnetic boots retain a shared visual inspection")
	check(not page.tool_buttons["TOL-004"].visible and not page.tool_buttons["TOL-006"].visible, "magnetic boots do not require electrical or voltage testing")
	check(not GameData.applicable_tools("ITM-089").has("TOL-004"), "optical fibre does not use a current probe")
	check(GameData.applicable_tools("ITM-002").has("TOL-004") and GameData.applicable_tools("ITM-002").has("TOL-006"), "a powered mug retains its appropriate electrical tests")
	var special = page.instrument_list.get_node_or_null("specific_check")
	check(special != null and special.text.contains("吸附"), "magnetic boots offer a specific adhesion and release check")
	var before: float = game.state.ap
	var checked: Dictionary = Model.reduce(game.state, {"type": "CHECK", "uid": shoe.uid, "tool": "SPEC"})
	var result = Model.find_item(checked, shoe.uid)
	check(result.evidence.has("SPEC"), "specific inspection records independent evidence on the actual item")
	check(checked.ap == before - 1, "the first specific inspection costs the ordinary one AP")
	if result.evidence.has("SPEC"):
		result.evidence.append("TOL-001")
		check(Model.estimate(result).exact, "specific inspection and relevant visual evidence support a precise valuation")
	page._set_tool("SPEC")
	await settle()
	var rig = page.bench.find_child("specific_rig", true, false)
	check(rig != null, "specific check has an observable test fixture")
	if rig != null:
		check(rig.mode == "magnet", "magnetic boots show the magnetic adhesion fixture")
	page._set_tool("TOL-004")
	check(page.tool == "SPEC", "shortcut or phone command cannot select an inapplicable electrical tool")
	page._advance_specific(2)
	check(page.specific_step == 0 and not game.item(shoe_uid).evidence.has("SPEC"), "steps cannot be skipped")
	var emulate := Input.emulate_mouse_from_touch
	Input.emulate_mouse_from_touch = true
	for i in page.specific_buttons.size():
		await tap(shell, page.specific_buttons[i])
		if i == 2:
			check(page.get("specific_running") == true, "the adhesion test runs and displays a response before it can be recorded")
			if page.get("specific_running") == true:
				await create_timer(0.2).timeout
				check(rig.fraction > 0.0 and rig.fraction < 1.0 and not game.item(shoe_uid).evidence.has("SPEC"), "test fixture animates before evidence is recorded")
				await create_timer(1.0).timeout
				await settle()
				check(page.specific_status.text.contains("吸附力不足"), "the completed test shows the observed adhesion fault")
		check(page.specific_step == i + 1, "touch completes specific step %d" % (i + 1))
		if i < page.specific_buttons.size() - 1:
			check(not game.item(shoe_uid).evidence.has("SPEC") and game.state.ap == before, "incomplete test records no evidence or AP cost")
	Input.emulate_mouse_from_touch = emulate
	check(game.item(shoe_uid).evidence.has("SPEC") and game.state.ap == before - 1, "completed touch test records evidence and spends one AP")
	check(page.specific_status.text.contains("吸附") or page.specific_status.text.contains("锁钩"), "specific result reflects the actual boots and their fault")
	var saved = JSON.parse_string(FileAccess.get_file_as_string("user://orbital-save-v3.json"))
	check(Model.find_item(saved, shoe_uid).evidence.has("SPEC"), "specific evidence survives the normal save path")
	game.dispatch({"type": "CHECK", "uid": shoe_uid, "tool": "TOL-001"})
	check(game.state.ap == before - 1 and Model.estimate(game.item(shoe_uid)).exact, "a second relevant check is free and yields the exact valuation")
	check(Model.relevant_evidence(game.item(shoe_uid), ["SPEC"]).has("SPEC"), "specific evidence is usable in negotiations")
	check(not game.state.inventory[1].evidence.has("SPEC"), "specific evidence belongs to the individual lot")
	var after_ap: float = game.state.ap
	var old_result := Model.item_clue(game.item(shoe_uid), "SPEC")
	game.item(shoe_uid).working = true
	game.item(shoe_uid).repaired = true
	check(Model.item_clue(game.item(shoe_uid), "SPEC") == old_result, "repair does not silently rewrite the previous specific reading")
	page._refresh_info()
	var repair_text := ""
	for label in page.info.find_children("*", "Label", true, false):
		repair_text += label.text + "\n"
	check(repair_text.contains("维修前记录"), "pre-repair results are clearly identified until retested")
	page._set_tool("")
	page._set_tool("SPEC")
	check(not page.specific_buttons[0].disabled and game.state.ap == after_ap, "a completed check can be repeated without charging again")
	for i in page.specific_buttons.size():
		page._advance_specific(i)
		if page.get("specific_running") == true:
			await create_timer(1.2).timeout
	check(game.state.ap == after_ap and Model.item_clue(game.item(shoe_uid), "SPEC").contains("吸附牢靠"), "retesting records the repaired result without charging AP")
	var prior_evidence: Array = game.item(shoe_uid).evidence.duplicate()
	game.item(shoe_uid).evidence = ["TOL-001", "TOL-004"]
	page._refresh_info()
	var previous_text := ""
	for label in page.info.find_children("*", "Label", true, false):
		previous_text += label.text + "\n"
	check(not previous_text.contains("接口回路") and not previous_text.contains("双触点万用探针"), "old boot evidence does not claim an electrical test")
	check(previous_text.contains("旧版") and Model.estimate(game.item(shoe_uid)).exact, "old boot evidence and its valuation remain available as a legacy record")
	game.item(shoe_uid).evidence = prior_evidence
	var untested: Dictionary = game.state.inventory[1]
	untested.evidence = []
	untested.inspectedPaid = false
	game.state.ap = 0
	game.focus_uid = untested.uid
	page._load_item()
	page._set_tool("SPEC")
	page._advance_specific(0)
	page._advance_specific(1)
	page._advance_specific(2)
	check(not page.specific_running and not game.item(untested.uid).evidence.has("SPEC") and page.specific_status.text.contains("行动点不足"), "without AP an unrecorded test cannot reveal or record a result")
	shell.close_workspace()
	game.new_game("ORBITAL-P0")
	game.state.cursor = 1
	game.state = Model.reduce(game.state, {"type": "ARRIVE"})
	shell.go("counter")
	await settle()
	var counter = shell.page
	for key in ["cash", "ap", "risk"]:
		check(counter.status_values[key].horizontal_alignment == HORIZONTAL_ALIGNMENT_CENTER, key + " reading is centered within its column")
	for key in ["help", "sound", "settings"]:
		var button: Button = counter.fixture_buttons[key]
		var group = button.get_node_or_null("content/row")
		check(group != null, key + " icon and text share a centered group")
		if group != null:
			var icon: Control = group.get_node("icon")
			var caption: Control = group.get_node("caption")
			var gap: float = caption.get_global_rect().position.x - icon.get_global_rect().end.x
			check(absf(group.get_global_rect().get_center().x - button.get_global_rect().get_center().x) < 1.5, key + " icon and label are centered together")
			check(gap >= 3 and gap <= 8, key + " icon and label have a small clear gap")
	var sound_icon: TextureRect = counter.fixture_buttons.sound.get_node("content/row/icon")
	var old_texture := sound_icon.texture
	counter.fixture_buttons.sound.pressed.emit()
	check(sound_icon.texture != old_texture, "sound toggle updates the centered icon")
	for npc in GameData.npcs:
		game.state.trade.npcId = npc.id
		counter._refresh()
		counter._say("今天经过这里。 这次采购：" + Model.customer_need(npc.id), false)
		await settle()
		check(counter.bubble.get_global_rect().encloses(counter.footer.get_global_rect()), npc.name + " purchase need stays inside the dialogue")
		check(not counter.bubble_label.text.contains("这次采购"), npc.name + " purchase need is not repeated in the spoken line")
		check(counter.footer.get_line_count() * counter.footer.get_theme_font("font").get_height(counter.footer.get_theme_font_size("font_size")) <= counter.footer.size.y + 1, npc.name + " purchase need fits without being clipped")
		check(counter.footer.position.y - counter.bubble_label.position.y - counter.bubble_label.get_content_height() <= 24, npc.name + " purchase need follows the dialogue without an empty gap")
	print("ITEM CHECK failures=", failures)
	shell.queue_free()
	await settle()
	quit(1 if failures else 0)
