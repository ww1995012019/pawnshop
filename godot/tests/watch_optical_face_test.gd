extends SceneTree
var failures := 0
func _initialize(): call_deferred("run")
func check(ok: bool, label: String):
	print("WATCH FACE ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1
func run():
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await process_frame
	shell._close_title()
	game.new_game("WATCH-FACE")
	game.state = Model.reduce(game.state, {"type":"ARRIVE"})
	shell.go("inspect")
	await process_frame
	var page = shell.active_shell().page
	page._set_tool("TOL-002")
	await process_frame
	await process_frame
	check(page.item.back, "UV automatically presents the back")
	page.flip_item()
	page.optical_fixed = true
	page.optical_position = page.item.reveal_center()
	await create_timer(1.0).timeout
	check(not game.item(page.it_uid).evidence.has("TOL-002"), "front face cannot auto-record hidden serial")
	check(is_zero_approx(float(page.item.reveal.material.get_shader_parameter("uv_r"))), "front face hides UV serial even under lamp")
	page._record()
	check(not game.item(page.it_uid).evidence.has("TOL-002"), "direct record rejects wrong UV face")
	page.flip_item()
	page.optical_position = page.item.reveal_center()
	await create_timer(.3).timeout
	check(page.progress > .1, "back UV starts observing visible serial")
	game.prefs.reduced_motion = false
	page.flip_item()
	page._record()
	check(not game.item(page.it_uid).evidence.has("TOL-002"), "animated flip cannot record serial mid-turn")
	check(is_zero_approx(page.progress), "flip immediately clears UV progress")
	check(is_zero_approx(float(page.item.reveal.material.get_shader_parameter("uv_r"))), "flip immediately hides serial")
	await create_timer(1.0).timeout
	check(not game.item(page.it_uid).evidence.has("TOL-002") and is_zero_approx(page.progress), "fixed UV cannot finish after turning away")
	game.prefs.reduced_motion = true
	page.flip_item()
	page.optical_position = page.item.reveal_center()
	await create_timer(1.0).timeout
	check(game.item(page.it_uid).evidence.has("TOL-002"), "back serial records after fresh full observation")
	page._set_tool("TOL-001")
	check(not page.item.back, "magnifier automatically presents the dial")
	page.flip_item()
	page.optical_fixed = true
	page.optical_position = page.item.logo_world_position()
	await create_timer(1.0).timeout
	check(not game.item(page.it_uid).evidence.has("TOL-001"), "back face cannot auto-record hidden dial logo")
	page._record()
	check(not game.item(page.it_uid).evidence.has("TOL-001"), "direct record rejects wrong logo face")
	page.flip_item()
	page.optical_position = page.item.logo_world_position()
	await create_timer(.3).timeout
	check(page.progress > .1, "front lens starts observing visible logo")
	page.flip_item()
	check(is_zero_approx(page.progress), "flip immediately clears lens progress")
	await create_timer(1.0).timeout
	check(not game.item(page.it_uid).evidence.has("TOL-001") and is_zero_approx(page.progress), "fixed lens cannot finish after turning away")
	page.flip_item()
	page.optical_position = page.item.logo_world_position()
	await create_timer(1.0).timeout
	check(game.item(page.it_uid).evidence.has("TOL-001"), "front logo records after fresh full observation")
	for player in root.find_children("*", "AudioStreamPlayer", true, false):
		player.stop()
		player.stream = null
	shell.queue_free()
	await create_timer(.1).timeout
	print("WATCH FACE failures=",failures)
	quit(1 if failures else 0)
