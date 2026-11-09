extends SceneTree

var failures := 0

func _initialize() -> void:
	call_deferred("run")

func check(ok: bool, message: String) -> void:
	print("ANIMATION ", "PASS " if ok else "FAIL ", message)
	if not ok:
		failures += 1

func settle() -> void:
	for i in 4:
		await process_frame

func run() -> void:
	var path := "res://data/inspection_motion.json"
	check(FileAccess.file_exists(path), "every item has an action animation configuration")
	if FileAccess.file_exists(path):
		var all = JSON.parse_string(FileAccess.get_file_as_string(path))
		var kit = load("res://scripts/app/ui_kit.gd")
		kit.ensure()
		var animator_script = load("res://scripts/world/inspection_motion.gd")
		var item_script = load("res://scripts/world/item_sprite.gd")
		var supported: Array = animator_script.get_script_constant_map().get("SUPPORTED", [])
		for definition in GameData.item_list + [GameData.def("BND-001")]:
			var spec = all.get(definition.id, {})
			check(spec.get("actions", []).size() == 3, definition.name + " has animation for every inspection step")
			if spec.get("actions", []).size() != 3:
				continue
			var subject = item_script.new()
			subject.setup(definition.id, "animation-audit", 300.0)
			root.add_child(subject)
			var animator = animator_script.new()
			animator.setup(subject, spec)
			subject.add_child(animator)
			for i in 3:
				check(supported.has(spec.actions[i]), definition.name + " step %d uses an implemented motion" % (i + 1))
				animator.start(i)
				var before: Transform2D = subject.motion_pivot.transform
				animator.sample(0.5)
				check(not subject.motion_pivot.transform.is_equal_approx(before), definition.name + " step %d moves its actual sprite" % (i + 1))
				animator.finish()
			animator.cancel()
			check(subject.motion_pivot.transform.is_equal_approx(Transform2D.IDENTITY), definition.name + " returns to its original pose when cancelled")
			subject.queue_free()
		check(all.get("ITM-001", {}).get("actions", []) == ["open", "extract", "flow"], "water core has opening, extraction and flow actions")
		check(all.get("ITM-081", {}).get("actions", []) == ["lock", "magnet", "release"], "magnetic boots use locking, attachment and release actions")
		check(all.get("ITM-025", {}).get("details", {}).get("0", "") == "gyro_ring" and all.get("ITM-025", {}).get("details", {}).get("1", "") == "gyro_rotor", "gyroscope ring and rotor have distinct visible mechanisms")
		check(all.get("ITM-065", {}).get("details", {}) == {"0":"walker_unfold", "1":"test_pipe", "2":"walker_legs"}, "crawler separately unfolds its legs, mounts a pipe and walks")
		check(all.get("ITM-092", {}).get("actions", []).slice(1, 3) == ["fill", "flow"], "filling the recovery tray differs from checking the return pipe")
		var drone_parts = all.get("ITM-011", {}).get("parts", {}).get("0", [])
		check(drone_parts is Array and drone_parts.size() == 2 and drone_parts[0].has("polygon") and drone_parts[1].has("polygon"), "drone unfolds two separately shaped wings without cutting its body")
		var drone = item_script.new()
		drone.setup("ITM-011", "drone", 300.0)
		root.add_child(drone)
		var drone_motion = animator_script.new()
		drone_motion.setup(drone, all["ITM-011"])
		drone.add_child(drone_motion)
		drone_motion.start(0)
		check(drone_motion.pieces.get(0, []).size() == 2, "both drone wings are attached as separate sprite pieces")
		if drone_motion.pieces.get(0, []).size() == 2:
			drone_motion.sample(0.7)
			check(drone_motion.pieces[0][0].sprite.rotation < 0 and drone_motion.pieces[0][1].sprite.rotation > 0, "the two wings turn independently around their own hinges")
		drone_motion.cancel()
		check(drone_motion.pieces.is_empty() and float(drone.mat.get_shader_parameter("inspection_poly_0_on")) < 0.5 and float(drone.mat.get_shader_parameter("inspection_poly_1_on")) < 0.5, "cancelling wing motion restores both cutouts")
		drone.queue_free()
		check(not all.get("ITM-087", {}).get("parts", {}).has("0"), "coffee animation does not cut through the machine body")
		var lamp = item_script.new()
		lamp.setup("ITM-003", "lamp", 300.0)
		root.add_child(lamp)
		var lamp_motion = animator_script.new()
		lamp_motion.setup(lamp, all["ITM-003"])
		lamp.add_child(lamp_motion)
		lamp_motion.start(2)
		check(lamp_motion.has_method("result_appearance"), "result animation describes the actual measured effect")
		if lamp_motion.has_method("result_appearance"):
			lamp_motion.reveal_result(true)
			var normal_light: Dictionary = lamp_motion.result_appearance()
			lamp_motion.reveal_result(false)
			var faulty_light: Dictionary = lamp_motion.result_appearance()
			check(normal_light.mode == "optical" and faulty_light.color.b > faulty_light.color.r and faulty_light.uneven, "faulty lamp produces the described uneven blue light")
		lamp_motion.cancel()
		lamp.queue_free()
		for case in [["ITM-042", "dim"], ["ITM-089", "flicker"]]:
			var object = item_script.new()
			object.setup(case[0], "optical", 300.0)
			root.add_child(object)
			var effect = animator_script.new()
			effect.setup(object, all[case[0]])
			object.add_child(effect)
			effect.start(2)
			effect.reveal_result(false)
			if effect.has_method("result_appearance"):
				var look: Dictionary = effect.result_appearance()
				check(look.get("fault_effect", "") == case[1] and not look.uneven, case[0] + " displays its own fault instead of the lamp's blue patch")
				effect.finish_result()
				var fault_opacity: float = effect.result_appearance().get("light_opacity", 1.0)
				effect.reveal_result(true)
				effect.finish_result()
				var normal_opacity: float = effect.result_appearance().get("light_opacity", 0.0)
				check(fault_opacity < normal_opacity, case[0] + " leaves a visibly weaker light when motion is reduced")
			effect.cancel()
			object.queue_free()
		var bearing = item_script.new()
		bearing.setup("ITM-027", "bearing", 300.0)
		root.add_child(bearing)
		var bearing_motion = animator_script.new()
		bearing_motion.setup(bearing, all["ITM-027"])
		bearing.add_child(bearing_motion)
		bearing_motion.start(1)
		bearing_motion.finish()
		check(not bearing_motion.anchored, "the levitating bearing does not acquire the magnetic boots' steel plate")
		bearing_motion.cancel()
		bearing.queue_free()
		var badge = item_script.new()
		badge.setup("ITM-034", "badge", 300.0)
		root.add_child(badge)
		var flip_motion = animator_script.new()
		flip_motion.setup(badge, all["ITM-034"])
		badge.add_child(flip_motion)
		flip_motion.start(0)
		flip_motion.sample(0.65)
		check(badge.back, "turning the badge shows its actual back face")
		flip_motion.cancel()
		check(not badge.back, "cancelling a half-finished flip restores the original face")
		flip_motion.start(0)
		flip_motion.sample(1.0)
		flip_motion.finish()
		flip_motion.cancel()
		check(badge.back, "a completed flip preserves the new face")
		flip_motion.start(0)
		flip_motion.sample(1.0)
		flip_motion.finish()
		check(badge.back, "an item already showing its back is not flipped to its front")
		badge.queue_free()
		var boots = item_script.new()
		boots.setup("ITM-081", "boots", 300.0)
		root.add_child(boots)
		var boot_motion = animator_script.new()
		boot_motion.setup(boots, all["ITM-081"])
		boots.add_child(boot_motion)
		boot_motion.anchored = true
		boot_motion.start(2)
		boot_motion.sample(0.8)
		var normal_release: Transform2D = boots.motion_pivot.transform
		boot_motion.reveal_result(false)
		boot_motion.sample(0.8)
		check(not boots.motion_pivot.transform.is_equal_approx(normal_release), "faulty magnetic boots visibly respond differently when released")
		if boot_motion.has_method("result_appearance"):
			var faulty_boots: Dictionary = boot_motion.result_appearance()
			check(faulty_boots.right_strength < faulty_boots.left_strength, "faulty right boot has a weaker magnetic field than the left")
		boot_motion.cancel()
		check(not boot_motion.anchored, "cancelling magnetic attachment clears the held-plate state")
		boots.queue_free()
		var staged_item = item_script.new()
		staged_item.setup("ITM-001", "parts", 300.0)
		root.add_child(staged_item)
		var staged_motion = animator_script.new()
		var part := {"rect":[0.39,0.02,0.40,0.18], "offset":[0.0,-0.1], "reverse":true}
		staged_motion.setup(staged_item, {"actions":["open","open","open"], "parts":{"0":part,"1":part,"2":part}})
		staged_item.add_child(staged_motion)
		for i in 3:
			staged_motion.start(i)
			check(staged_motion.pieces.has(i), "a returned component leaves a mask slot for step %d" % (i + 1))
			staged_motion.finish()
		staged_motion.cancel()
		staged_item.queue_free()
		var lifted = item_script.new()
		lifted.setup("ITM-001", "lifted", 300.0)
		root.add_child(lifted)
		var current_game = root.get_node("Game")
		current_game.prefs.reduced_motion = true
		lifted.lift = 34.0
		lifted.land()
		lifted.flip()
		await settle()
		check(is_zero_approx(lifted.lift) and lifted.body.scale.is_equal_approx(Vector2.ONE * lifted.display_scale), "instant flip during landing restores the item to the mat")
		lifted.queue_free()
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await settle()
	shell._close_title()
	game.new_game("ORBITAL-P0")
	game.focus_uid = game.state.inventory[0].uid
	shell.go("inspect")
	await settle()
	var page = shell.active_shell().page
	page._set_tool("SPEC")
	await settle()
	var actor = page.item
	var motion = actor.get_node_or_null("specific_motion")
	check(motion != null, "the animation is attached to the actual workbench item")
	var original: Transform2D = actor.body.global_transform
	game.prefs.reduced_motion = false
	page._advance_specific(0)
	await create_timer(0.2).timeout
	check(page.specific_running, "the first operation runs as an animation before the next step")
	check(not actor.body.global_transform.is_equal_approx(original), "the actual item changes pose while the first step plays")
	check(game.state.ap == 12 and not game.item(actor.uid).evidence.has("SPEC"), "preparation animation does not spend AP or record evidence")
	await create_timer(0.8).timeout
	check(page.specific_step == 1 and not page.specific_running, "the next step unlocks after the animation completes")
	page._advance_specific(1)
	await create_timer(0.15).timeout
	page._set_tool("")
	await settle()
	check(not page.specific_running and game.state.ap == 12 and not game.item(actor.uid).evidence.has("SPEC"), "switching tools cancels the animation without charging")
	check(actor.motion_pivot.transform.is_equal_approx(Transform2D.IDENTITY), "cancelling restores the actual item pose")
	check(float(actor.mat.get_shader_parameter("inspection_mask_0_on")) < 0.5 and float(actor.mat.get_shader_parameter("inspection_mask_1_on")) < 0.5 and float(actor.mat.get_shader_parameter("inspection_mask_2_on")) < 0.5, "cancelling restores any moved sprite pieces")
	game.prefs.reduced_motion = true
	page._set_tool("SPEC")
	page._advance_specific(0)
	page._advance_specific(1)
	game.prefs.reduced_motion = false
	page._advance_specific(2)
	await create_timer(1.1).timeout
	check(page.specific_running and game.state.ap == 12 and not game.item(actor.uid).evidence.has("SPEC"), "an unfinished final action has not charged or recorded")
	page._set_tool("")
	check(game.state.ap == 12 and not game.item(actor.uid).evidence.has("SPEC"), "cancelling an unfinished final action preserves AP and evidence")
	game.prefs.reduced_motion = true
	game.state.inventory[0].defId = "ITM-025"
	game.focus_uid = game.state.inventory[0].uid
	page._load_item()
	page._set_tool("SPEC")
	await settle()
	actor = page.item
	var reduced_before: Transform2D = actor.body.global_transform
	page._advance_specific(0)
	await settle()
	check(page.specific_step == 1 and not actor.body.global_transform.is_equal_approx(reduced_before), "reduced motion still leaves a visible completed action")
	page._set_tool("")
	game.prefs.reduced_motion = false
	page.flip_item()
	page._set_tool("SPEC")
	check(page.tool == "", "a new inspection cannot start during a face transition")
	await create_timer(1.0).timeout
	check(page.tool == "SPEC" and not page.item.back, "a queued inspection opens on the front after the face transition")
	page._set_tool("")
	page.item.back = true
	page.item._apply_face()
	page._set_tool("TOL-003")
	var spectrum = page.instrument
	for i in 3:
		page.sliders[i].value = spectrum.targets[i] + spectrum.offset
	page.hold = 0.59
	var ap_before_switch: float = game.state.ap
	page._set_tool("SPEC")
	page._process(0.2)
	check(game.state.ap == ap_before_switch and not game.item(page.it_uid).evidence.has("TOL-003"), "switching to specific inspection freezes the previous instrument before flipping")
	await create_timer(0.5).timeout
	page._set_tool("")
	game.prefs.reduced_motion = true
	page.item.back = true
	page.item._apply_face()
	page._set_tool("SPEC")
	check(page.tool == "SPEC" and not page.item.back and not page.item.busy, "reduced motion shows the front immediately before specific inspection")
	print("ANIMATION failures=", failures)
	shell.queue_free()
	await settle()
	quit(1 if failures else 0)
