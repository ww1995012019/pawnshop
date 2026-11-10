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
	page.optical_pin_button.pressed.emit()
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
	check(page.item.mat.get_shader_parameter("logo_hidden") == 1.0, "unobserved physical logo remains mosaicked")
	page._set_tool("TOL-001")
	check(page.item.mat.get_shader_parameter("logo_hidden") == 1.0, "selecting magnifier alone does not unlock logo")
	check(not page.item.back, "magnifier automatically presents the dial")
	page.flip_item()
	page.optical_pin_button.pressed.emit()
	page.optical_position = page.item.logo_world_position()
	await create_timer(1.0).timeout
	check(not game.item(page.it_uid).evidence.has("TOL-001"), "back face cannot auto-record hidden dial logo")
	page._record()
	check(not game.item(page.it_uid).evidence.has("TOL-001"), "direct record rejects wrong logo face")
	page.flip_item()
	page.optical_position = page.item.logo_world_position()
	await create_timer(.3).timeout
	check(page.progress > .1, "front lens starts observing visible logo")
	check(float(page.item.mat.get_shader_parameter("lens_r")) > 0.0, "active dial magnifier reveals actual texture within lens")
	check(page.item.mat.get_shader_parameter("logo_hidden") == 1.0, "partial observation keeps logo masked outside lens")
	page.flip_item()
	check(is_zero_approx(page.progress), "flip immediately clears lens progress")
	check(is_zero_approx(float(page.item.mat.get_shader_parameter("lens_r"))), "flip immediately clears magnifier reveal")
	await create_timer(1.0).timeout
	check(not game.item(page.it_uid).evidence.has("TOL-001") and is_zero_approx(page.progress), "fixed lens cannot finish after turning away")
	page.flip_item()
	page.optical_position = page.item.logo_world_position()
	await create_timer(1.0).timeout
	check(game.item(page.it_uid).evidence.has("TOL-001"), "front logo records after fresh full observation")
	await process_frame
	page._set_tool("")
	check(page.item.mat.get_shader_parameter("logo_hidden") == 0.0, "successful observation permanently reveals this physical logo")
	var inspected_uid: String = page.it_uid
	game.save()
	game.state = JSON.parse_string(FileAccess.get_file_as_string(game.SAVE_PATH))
	page._load_item()
	check(page.it_uid == inspected_uid and page.item.mat.get_shader_parameter("logo_hidden") == 0.0, "saved current logo evidence preserves reveal")
	var other = Model.new_item(game.state, game.item(inspected_uid).defId)
	Model.put_in(game.state, other)
	var other_sprite = load("res://scripts/world/item_sprite.gd").new()
	other_sprite.setup(other.defId, other.uid, 300.0)
	root.add_child(other_sprite)
	check(other_sprite.mat.get_shader_parameter("logo_hidden") == 1.0, "another instance of same model remains masked")
	other_sprite.queue_free()
	# Old saves recorded the broader appraisal fingerprint, before logoRevision.
	game.item(inspected_uid).inspectionFacts["TOL-001"].erase("logoRevision")
	var inspected = game.item(inspected_uid)
	WatchRules.restore_parts(inspected)
	inspected.condition = .95 if inspected.condition < .9 else .8
	await process_frame
	check(page.item.mat.get_shader_parameter("logo_hidden") == 0.0, "repair preserves observed logo from legacy saved snapshot")
	for method in ["serial", "weight"]:
		WatchForgery.apply(game.item(inspected_uid), method)
		await process_frame
		check(page.item.mat.get_shader_parameter("logo_hidden") == 0.0, method + " treatment preserves observed logo")
	game.state = Model.reduce(game.state, {"type":"CHECK","uid":inspected_uid,"tool":"TOL-001"})
	check(game.item(inspected_uid).inspectionFacts["TOL-001"].has("logoRevision"), "new loupe snapshot stores logo-specific revision")
	WatchForgery.apply(game.item(inspected_uid), "logo")
	await process_frame
	check(page.item.mat.get_shader_parameter("logo_hidden") == 0.0, "player sees their own painted logo immediately")
	check(game.item(inspected_uid).inspectionFacts["TOL-001"].logoRevision != Model.logo_revision(game.item(inspected_uid)), "own paint still invalidates prior inspection revision")
	check(game.item(inspected_uid).evidence.has("TOL-001"), "stale recorded evidence is retained for retest")
	for player in root.find_children("*", "AudioStreamPlayer", true, false):
		player.stop()
		player.stream = null
	shell.queue_free()
	await create_timer(.1).timeout
	print("WATCH FACE failures=",failures)
	quit(1 if failures else 0)
