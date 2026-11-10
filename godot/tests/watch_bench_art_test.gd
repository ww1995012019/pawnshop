extends SceneTree

var failures := 0
var artifact_script

func _initialize() -> void:
	call_deferred("run")

func check(ok: bool, label: String) -> void:
	print("WATCH BENCH ART ", "PASS " if ok else "FAIL ", label)
	if not ok:
		failures += 1

func item(movement := "quartz", caseback := "screw") -> Dictionary:
	return {"uid":"BENCH-TEST", "defId":"WCH-001", "working":false, "watch":{"serial":"ORB-3417"}, "service":{"profile":{"movement":movement, "caseback":caseback}, "opened":false, "faults":[{"kind":"battery" if movement == "quartz" else "movement_part", "resolved":false, "internal":true}]}}

func bench(it: Dictionary, task: String, saved: Dictionary = {}):
	var art = artifact_script.new()
	root.add_child(art)
	art.size = Vector2(600, 460)
	art.configure(it, task, saved)
	art.set_process(false)
	return art

func finish_action(art) -> void:
	for n in range(180):
		if art.progress_snapshot().phase == "idle" or art.progress_snapshot().complete:
			return
		art._process(0.05)
	check(false, "action resolves within bounded animation time")

func finish_task(art) -> void:
	for n in range(40):
		if art.progress_snapshot().complete:
			return
		art.advance()
		finish_action(art)
	check(false, "task resolves with bounded physical actions")

func same_state(a, b) -> bool:
	if (a is float or a is int) and (b is float or b is int): return absf(float(a) - float(b)) < 0.0001
	if a is Dictionary and b is Dictionary:
		if a.size() != b.size(): return false
		for key in a:
			if not b.has(key) or not same_state(a[key], b[key]): return false
		return true
	if a is Array and b is Array:
		if a.size() != b.size(): return false
		for n in range(a.size()):
			if not same_state(a[n], b[n]): return false
		return true
	return a == b

func run() -> void:
	check(ResourceLoader.exists("res://scripts/ui/watch_bench_art.gd"), "native animated workbench component exists")
	if failures:
		quit(1)
		return
	artifact_script = load("res://scripts/ui/watch_bench_art.gd")
	var game = root.get_node("Game")
	game.prefs.sound = false
	game.prefs.reduced_motion = false
	# Pen tracing ends away from the action's initial contact point.
	var tracing = bench(item(), "forge_serial")
	tracing._state.step = 1
	tracing.advance()
	tracing._state.phase = "act"
	tracing._state.elapsed = tracing._phase_duration() - 0.00001
	tracing._animate()
	var before: Vector2 = tracing._v(tracing._state.tool.position)
	tracing._process(0.00002)
	var after: Vector2 = tracing._v(tracing._state.tool.position)
	check(before.distance_to(after) < 0.1, "serial pen stays continuous when lifting off its final ink stroke")
	tracing.queue_free()
	var original := item()
	var immutable := JSON.stringify(original)
	var art = bench(original, "replace")
	var emissions := {"progress":[], "done":0}
	art.progressed.connect(func(p): emissions.progress.append(p))
	art.completed.connect(func(): emissions.done += 1)
	check(not art.action_text().is_empty() and not art.hint_text().is_empty(), "physical current action and instruction are accessible")
	check(art.stage_working_rect().size.x > 300, "responsive native stage exposes usable drawing bounds")
	art.advance()
	check(art.progress_snapshot().phase != "idle" and emissions.done == 0, "advance starts contact animation without premature completion")
	var step := int(art.progress_snapshot().step)
	art.advance()
	check(int(art.progress_snapshot().step) == step, "repeated activation cannot skip an active animation")
	art._process(0.31)
	var mid: Dictionary = art.progress_snapshot()
	var json_mid: Dictionary = JSON.parse_string(JSON.stringify(mid))
	var restored = bench(original, "replace", json_mid)
	check(same_state(restored.progress_snapshot(), json_mid), "JSON restore preserves in-flight phase, elapsed time, tool and part positions")
	art._process(0.12)
	restored._process(0.12)
	check(same_state(art.progress_snapshot(), restored.progress_snapshot()), "restored operation resumes the identical physical trajectory")
	finish_action(art)
	check(int(art.progress_snapshot().step) == step + 1, "one completed action advances one safe assembly node")
	finish_task(art)
	check(emissions.done == 1 and bool(emissions.progress[-1].complete), "complete is persisted before a single completion signal")
	art.advance()
	art._process(10.0)
	check(emissions.done == 1, "finished work cannot emit duplicate completion")
	check(JSON.stringify(original) == immutable, "visual work never mutates the live watch or service model")
	var restored_done = bench(original, "replace", art.progress_snapshot())
	var repeated := {"done":0}
	restored_done.completed.connect(func(): repeated.done += 1)
	restored_done.advance()
	check(repeated.done == 0, "restoring a completed operation does not recommit it")
	art.queue_free()
	restored.queue_free()
	restored_done.queue_free()

	var lifted = bench(item(), "open")
	lifted.advance()
	finish_action(lifted)
	lifted.advance()
	finish_action(lifted)
	check(lifted.progress_snapshot().opened, "releasing caseback immediately marks unsafe opened work")
	var lift_target: Dictionary = lifted.interaction_targets()[0]
	check(lifted.hint_text().contains("拖动后盖") and lifted.hint_text().contains("后盖格"), "cover transfer explains the gesture and named destination before input")
	var recovery := {"text":""}
	lifted.progressed.connect(func(_progress): recovery.text = lifted.hint_text())
	var pickup := InputEventMouseButton.new()
	pickup.button_index = MOUSE_BUTTON_LEFT
	pickup.pressed = true
	pickup.position = lift_target.position
	lifted._gui_input(pickup)
	var misplaced := InputEventMouseMotion.new()
	misplaced.position = Vector2(20, 20)
	lifted._gui_input(misplaced)
	var bad_drop := InputEventMouseButton.new()
	bad_drop.button_index = MOUSE_BUTTON_LEFT
	bad_drop.pressed = false
	bad_drop.position = Vector2(20, 20)
	lifted._gui_input(bad_drop)
	check(lifted.progress_snapshot().phase == "idle" and lifted.progress_snapshot().parts.cover == [248.0,227.0], "misplaced dragged cover remains safely at its original seat")
	check(lifted.hint_text().contains("后盖格"), "misplaced cover recovery identifies its actual compartment instead of an unnamed drop point")
	check(recovery.text.contains("还未放入") and recovery.text.contains("后盖格"), "misplaced part immediately refreshes the visible page instruction")
	lifted.advance()
	lifted._process(0.86)
	var floating: Dictionary = lifted.progress_snapshot()
	check(floating.parts.cover != [248.0,227.0] and floating.parts.cover != [510.0,150.0], "cover physically lifts and travels through intermediate positions")
	var floating_copy = bench(item(), "open", JSON.parse_string(JSON.stringify(floating)))
	check(same_state(floating_copy.progress_snapshot(), floating), "interrupted lifted part restores its exact position and tool contact")
	finish_action(lifted)
	finish_action(floating_copy)
	check(lifted.progress_snapshot().parts.cover == floating_copy.progress_snapshot().parts.cover, "restored lifted cover safely reaches the identical tray compartment")
	lifted.queue_free()
	floating_copy.queue_free()

	var paths := {}
	for back in ["screw", "snap", "bolts"]:
		var opener = bench(item("mechanical", back), "open")
		paths[back] = opener.action_plan_signature()
		finish_task(opener)
		check(opener.progress_snapshot().parts.cover == [510.0, 150.0], "%s cover is retained in the parts tray" % back)
		opener.queue_free()
	check(paths.screw != paths.snap and paths.snap != paths.bolts and paths.screw != paths.bolts, "three caseback structures use distinct tools and release paths")
	var quartz = bench(item("quartz"), "test")
	var mechanical = bench(item("mechanical"), "test")
	check(quartz.action_plan_signature() != mechanical.action_plan_signature(), "quartz test never uses mechanical regulator actions")
	quartz.queue_free()
	mechanical.queue_free()

	for task in ["open", "wash", "replace", "assemble", "test", "forge_logo", "forge_serial", "forge_weight"]:
		for movement in ["quartz", "mechanical"]:
			var control = bench(item(movement, "bolts"), task)
			var count := {"done":0}
			control.completed.connect(func(): count.done += 1)
			finish_task(control)
			check(control.progress_snapshot().complete and count.done == 1, "%s / %s has a complete physical interaction path" % [task, movement])
			if task.begins_with("forge_"):
				check(not String(control.progress_snapshot().get("trace", "")).is_empty(), "%s retains its observable physical trace" % task)
			control.queue_free()

	var external_item := item()
	external_item.service.faults = [{"kind":"missing_link", "internal":false, "resolved":false}]
	var external = bench(external_item, "replace")
	check(not external.action_plan_signature().contains("safe_quartz") and external.action_plan_signature().contains("place_link"), "external missing link uses a spring-bar and matching link path")
	finish_task(external)
	check(not external.progress_snapshot().get("opened", true), "external link work does not invent an opened case")
	external.queue_free()
	var mixed_item := item()
	mixed_item.service.faults.append({"kind":"missing_link", "internal":false, "resolved":false})
	mixed_item.service.faults.append({"kind":"missing_fixing", "internal":true, "resolved":false})
	var mixed = bench(mixed_item, "replace")
	check(mixed.action_plan_signature().contains("place_replacement") and mixed.action_plan_signature().contains("place_fixing") and mixed.action_plan_signature().contains("place_link"), "mixed faults animate each real replacement rather than resolve unseen parts")
	finish_task(mixed)
	check(mixed.progress_snapshot().opened, "mixed internal replacement keeps case open for later assembly")
	mixed.queue_free()

	var square_item := item()
	square_item.defId = "WCH-007"
	var square = bench(square_item, "forge_logo")
	check(square.has_method("appearance_signature"), "procedural closeup exposes the selected model silhouette and palette")
	if square.has_method("appearance_signature"):
		check(square.appearance_signature().case_shape == "square" and square.appearance_signature().strap == "leather", "square leather model retains its original physical silhouette")
		var rubber_item := item()
		rubber_item.defId = "WCH-005"
		square.configure(rubber_item, "forge_logo", {})
		check(square.appearance_signature().strap == "rubber" and square.appearance_signature().strap_color == "273236", "rubber diver retains its own strap material and exact model palette")
		var luxury_item := item()
		luxury_item.defId = "WCH-033"
		square.configure(luxury_item, "forge_logo", {})
		check(square.appearance_signature().case_color == "bda064", "luxury model retains its gold case rather than a universal steel case")
	square.queue_free()

	var opening_weight = bench(item("quartz", "screw"), "forge_weight")
	opening_weight.advance()
	finish_action(opening_weight)
	opening_weight.advance()
	finish_action(opening_weight)
	var opened_progress: Dictionary = opening_weight.progress_snapshot()
	var reopened_item := item("quartz", "screw")
	reopened_item.service.opened = true
	var resumed_weight = bench(reopened_item, "forge_weight", JSON.parse_string(JSON.stringify(opened_progress)))
	check(resumed_weight.action_plan_signature() == opening_weight.action_plan_signature(), "forgery plan remains immutable when persisted item now reports an opened cover")
	check(resumed_weight.action_text() == opening_weight.action_text(), "reload resumes the same next part action after shared opening")
	finish_task(resumed_weight)
	check(resumed_weight.progress_snapshot().ballast_set and not resumed_weight.progress_snapshot().opened, "resumed shared opening still places ballast and safely closes the actual cover")
	check(resumed_weight.action_plan_signature().contains("move_to_scale") and resumed_weight.progress_snapshot().get("watch_on_scale", false), "weight check physically transfers the assembled watch onto a native scale pan")
	opening_weight.queue_free()
	resumed_weight.queue_free()
	var moving_watch = bench(item(), "forge_weight")
	for n in range(20):
		if moving_watch.interaction_targets()[0].id == "move_to_scale": break
		moving_watch.advance()
		finish_action(moving_watch)
	moving_watch.advance()
	moving_watch._process(0.91)
	var scale_mid: Dictionary = moving_watch.progress_snapshot()
	check(scale_mid.parts.watch != [248.0,227.0] and scale_mid.parts.watch != [248.0,237.0], "same assembled watch visibly lifts between holder and scale pan")
	var scale_copy = bench(item(), "forge_weight", JSON.parse_string(JSON.stringify(scale_mid)))
	check(same_state(scale_copy.progress_snapshot(), scale_mid), "scale placement restores watch, pan, tool and lift geometry in flight")
	finish_task(moving_watch)
	finish_task(scale_copy)
	check(scale_copy.progress_snapshot().parts.watch == moving_watch.progress_snapshot().parts.watch and scale_copy.progress_snapshot().scale == 1.0, "restored watch lands on identical pan coordinates before its gram reading settles")
	moving_watch.queue_free()
	scale_copy.queue_free()
	var no_oil = bench(item("mechanical"), "assemble")
	check(not no_oil.action_plan_signature().contains("oil_"), "unrelated mechanical assembly does not oil healthy bearings")
	no_oil.queue_free()
	var washed_item := item("mechanical")
	washed_item.service.done = ["wash"]
	var oiled = bench(washed_item, "assemble")
	check(oiled.action_plan_signature().contains("oil_0"), "washed mechanical parts receive the required point lubrication")
	oiled.queue_free()
	var diagnosed = bench(item("quartz"), "open")
	check(diagnosed.action_plan_signature().ends_with("inspect_quartz"), "internal diagnosis follows an actual probe check after removing the cover")
	diagnosed.queue_free()

	var pointer = bench(item(), "open")
	var targets: Array = pointer.interaction_targets()
	check(not targets.is_empty() and pointer.get_rect().size.x > 0, "pointer targets are exposed in local coordinates")
	var target: Dictionary = targets[0]
	var press := InputEventMouseButton.new()
	press.button_index = MOUSE_BUTTON_LEFT
	press.pressed = true
	press.position = target.position
	pointer._gui_input(press)
	var release := InputEventMouseButton.new()
	release.button_index = MOUSE_BUTTON_LEFT
	release.pressed = false
	release.position = target.position
	pointer._gui_input(release)
	check(pointer.progress_snapshot().phase != "idle", "real pointer contact starts the same native physical action")
	pointer._process(0.28)
	var before_resize: Dictionary = pointer.progress_snapshot()
	pointer.size = Vector2(320, 260)
	check(pointer.progress_snapshot() == before_resize, "phone resize keeps exact physical state")
	for t in pointer.interaction_targets():
		check(Rect2(Vector2.ZERO,pointer.size).has_point(t.position), "phone hit targets remain inside the mat")
	pointer.queue_free()

	var physical: Dictionary = Model.new_item(game.state,"WCH-001",{"authentic":false})
	var privacy = bench(physical,"forge_logo")
	if not privacy.has_method("mark_visibility"):
		check(false,"workbench respects main's observation-bound mark masking")
	else:
		check(privacy.mark_visibility() == "hidden","unobserved repair mark stays concealed")
		physical.evidence.append("TOL-001")
		Model.record_inspection(physical,"TOL-001")
		privacy.configure(physical,"forge_logo",{})
		check(privacy.mark_visibility() == "observed","current observation reveals the physical mark")
		WatchForgery.apply(physical,"logo")
		privacy.configure(physical,"forge_logo",{})
		check(privacy.mark_visibility() == "hidden","repainting requires a new observation after merge")
	privacy.queue_free()
	var weighing = bench(item(), "forge_weight")
	for n in range(30):
		if weighing.interaction_targets()[0].id == "move_to_scale": break
		weighing.advance()
		finish_action(weighing)
	check(weighing.hint_text().contains("点按手表") and not weighing.hint_text().contains("拖动"), "placing a watch onto the nearby scale uses an explicit tap instead of overlapping drag markers")
	weighing.queue_free()

	game.prefs.reduced_motion = true
	var reduced = bench(item("mechanical", "snap"), "forge_weight")
	var done_count := {"done":0}
	reduced.completed.connect(func(): done_count.done += 1)
	reduced.advance()
	check(not reduced.progress_snapshot().complete and reduced.progress_snapshot().phase != "idle", "reduced motion still preserves required contact and result states")
	finish_task(reduced)
	check(done_count.done == 1 and reduced.progress_snapshot().parts.cover == [248.0, 227.0], "reduced motion restores cover and completes ballast placement once")
	reduced.queue_free()
	await process_frame
	print("WATCH BENCH ART failures=", failures)
	quit(1 if failures else 0)
