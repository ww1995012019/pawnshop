extends SceneTree
var failures := 0
func _initialize(): call_deferred("run")
func settle():
	for i in 8: await process_frame
func check(ok: bool, message: String):
	print("CLEANING INPUT ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func drag_cloth(shell, page):
	var active = shell.active_shell()
	var last := Vector2.ZERO
	for i in range(12):
		var uv := Vector2(0.4+i*0.02,0.5)
		last = root.get_final_transform() * (shell.workspace_container.global_position + active.world_to_ui(page.item.uv_global(uv)))
		var motion := InputEventMouseMotion.new()
		motion.position = last
		motion.global_position = last
		motion.button_mask = MOUSE_BUTTON_MASK_LEFT
		Input.parse_input_event(motion)
		if i == 0:
			var down := InputEventMouseButton.new()
			down.button_index = MOUSE_BUTTON_LEFT
			down.pressed = true
			down.position = last
			Input.parse_input_event(down)
		await settle()
	var up := InputEventMouseButton.new()
	up.button_index = MOUSE_BUTTON_LEFT
	up.pressed = false
	up.position = last
	Input.parse_input_event(up)
	await settle()
func run():
	var game = root.get_node("Game")
	game.prefs.sound = false
	game.state = Model.create("SQUARE-CLEANING-INPUT")
	var lot = Model.new_item(game.state,"WCH-007",{"condition":0.55,"working":true,"sourceVerified":true})
	Model.put_in(game.state,lot)
	var uid: String = lot.uid
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await settle()
	shell._close_title()
	shell.go("repair",uid)
	await settle()
	var page = shell.active_shell().page
	for scenario in ["normal","no_ap","forge_open","unverified"]:
		page._save_cleaning()
		var it = game.item(uid)
		it.erase("service")
		it.sourceVerified = scenario != "unverified"
		game.state.ap = 0 if scenario == "no_ap" else 12
		WatchService.ensure(it)
		if scenario == "forge_open":
			it.service.forge_task = "forge_weight"
			it.service.opened = true
		page.open_service()
		page._select(uid)
		await settle()
		await drag_cloth(shell,page)
		if scenario in ["normal","no_ap"]:
			check(page.dirty < 0.99 and page.cloth_uv.distance_to(Vector2(0.62,0.5)) < 0.01, scenario + " square watch cloth follows the real held pointer and removes grime")
			page._save_cleaning()
			var saved: Dictionary = game.item(uid).service.operations.get("dust",{}).duplicate(true)
			check(not saved.is_empty(), scenario + " partial wiping persists")
			page._select(uid)
			await settle()
			check(page.cleaning.serialize() == saved, scenario + " reopening preserves actual partial mask")
			if scenario == "no_ap":
				for y in range(0,65,3): page._wipe_uv(Vector2(-0.05,y/64.0),Vector2(1.05,y/64.0))
				await settle()
				check(page.cleaning.complete() and page.action_button.disabled and page.instruction.text.contains("行动点不足"), "zero AP permits finishing the visible wipe and explains why submission must wait")
				check(game.state.ap == 0 and not game.item(uid).service.done.has("dust"), "cleaning preview never bypasses the atomic AP charge")
				game.state.ap = 1
				page._stage_ui()
				page._primary_action()
				await settle()
				check(is_equal_approx(game.state.ap,0.75) and game.item(uid).service.done.has("dust"), "restored AP submits the saved clean result with one charge")
		else:
			check(is_equal_approx(page.dirty,1.0) and page.cloth_uv.x < 0, scenario + " unavailable watch does not display a frozen cloth")
			check(page.instruction.text.contains("封盖") if scenario == "forge_open" else page.instruction.text.contains("来源"), scenario + " blocking reason is visible beside the work surface")
			if scenario == "forge_open":
				check(page.action_button.text.contains("继续"), "unfinished forgery exposes a direct resume action")
				page._primary_action()
				await settle()
				check(page.mode == "forge" and page.task == "forge_weight", "resume returns to the exact unfinished forgery")
	shell.queue_free()
	await settle()
	quit(1 if failures else 0)
