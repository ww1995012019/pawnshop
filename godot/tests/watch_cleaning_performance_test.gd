extends SceneTree
var failures := 0
func _initialize(): call_deferred("run")
func frames():
	for i in 8: await process_frame
func check(ok: bool, label: String):
	print("CLEANING PERFORMANCE ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1
static func fixture() -> Dictionary:
	var state: Dictionary = load("res://tests/merchant_snapshot_performance_test.gd").fixture()
	state.trade = null
	state.inventory[0].condition = 0.6
	state.inventory[0].erase("service")
	return state
func run():
	var game = root.get_node("Game")
	game.prefs.sound = false
	game.prefs.reduced_motion = true
	game.state = fixture()
	var uid: String = game.state.inventory[0].uid
	if OS.get_cmdline_user_args().has("--fixture"):
		preload("res://tests/fixture_output.gd").write_json("res://../work/cleaning-performance/fixture.json",game.state)
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	shell.go("repair",uid)
	await frames()
	var page = shell.active_shell().page
	var original_slot: WeakRef = weakref(shell.page.stock_grid.get_child(0))
	var down := InputEventMouseButton.new()
	down.button_index = MOUSE_BUTTON_LEFT
	down.pressed = true
	Input.parse_input_event(down)
	await frames()
	page._wipe_uv(Vector2(0.4,0.4),Vector2(0.6,0.6),0.016)
	var before: Dictionary = game.item(uid).service.operations.get("dust",{}).duplicate(true)
	page.scrubbing = true
	page._process(0.41)
	check(page.dirty < 1.0 and page.cleaning_unsaved, "held wiping updates the visible mask without serializing the entire game")
	check(game.item(uid).service.operations.get("dust",{}) == before, "periodic timer leaves the continuous stroke uninterrupted")
	var up := InputEventMouseButton.new()
	up.button_index = MOUSE_BUTTON_LEFT
	up.pressed = false
	Input.parse_input_event(up)
	page._process(0.016)
	await frames()
	check(not page.scrubbing and not page.cleaning_unsaved and game.item(uid).service.operations.get("dust",{}) == page.cleaning.serialize(), "releasing the pointer persists the exact partial mask")
	check(is_instance_valid(original_slot.get_ref()), "progress checkpoints keep existing counter inventory controls")
	page._wipe_uv(Vector2(0.4,0.3),Vector2(0.6,0.3),0.016)
	page.scrubbing = true
	var bridge = load("res://scripts/app/web_touch.gd").new()
	root.add_child(bridge)
	bridge.setup(shell)
	bridge._visibility_changed([true])
	check(not page.scrubbing and not page.cleaning_unsaved and game.item(uid).service.operations.get("dust",{}) == page.cleaning.serialize(), "backgrounding flushes an unfinished stroke before pausing")
	bridge._visibility_changed([false])
	page._wipe_uv(Vector2(0.4,0.7),Vector2(0.6,0.7),0.016)
	var expected: Dictionary = page.cleaning.serialize()
	shell.close_workspace()
	await frames()
	check(game.item(uid).service.operations.get("dust",{}) == expected, "closing a workspace preserves the latest unreleased progress")
	shell.go("repair",uid)
	await frames()
	check(shell.active_shell().page.cleaning.serialize() == expected, "reopening restores the saved mask exactly")
	var first_repair = shell.active_shell().page
	shell.go("inspect",uid)
	await frames()
	shell.go("repair",uid)
	await frames()
	var second_repair = shell.active_shell().page
	second_repair._wipe_uv(Vector2(0.3,0.2),Vector2(0.7,0.2),0.016)
	second_repair._save_cleaning()
	expected = second_repair.cleaning.serialize()
	shell.close_workspace()
	await frames()
	shell.close_workspace()
	await frames()
	check(shell.active_shell().page == first_repair and first_repair.cleaning.serialize() == expected, "returning through nested workspaces uses the latest mask for the same watch")
	shell.queue_free()
	bridge.queue_free()
	await frames()
	quit(1 if failures else 0)
