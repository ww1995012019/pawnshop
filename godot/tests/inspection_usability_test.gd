extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	print("INSPECTION UX ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func settle() -> void:
	for i in 8: await process_frame
func check_row(buttons: Array, label: String) -> void:
	var first: Rect2 = buttons[0].get_global_rect()
	for i in buttons.size():
		var rect: Rect2 = buttons[i].get_global_rect()
		check(is_equal_approx(rect.position.y, first.position.y), label + " buttons share one row")
		if i > 0: check(rect.position.x >= buttons[i-1].get_global_rect().end.x + 4, label + " buttons have clear spacing")
	var row: Control = buttons[0].get_parent()
	check(is_equal_approx(buttons[-1].get_global_rect().end.x, row.get_global_rect().end.x), label + " fills the row instead of leaving a blank right side")
func run() -> void:
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	game.new_game("INSPECTION-USABILITY")
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await settle()
	shell._close_title()
	shell.go("inspect")
	await settle()
	var page = shell.active_shell().page
	page._set_tool("TOL-005")
	await settle()
	check_row([page.tare_button, page.place_button, page.record_button, page.remove_button], "scale")
	var actions := []
	for button in page.detail_panel.find_children("*", "Button", true, false):
		if button.text in ["翻面 F", "实物归位", "回柜台", "去维修"]: actions.append(button)
	check(actions.size() == 4, "all four item actions remain available")
	if actions.size() == 4: check_row(actions, "item actions")
	var before_ap: float = game.state.ap
	page._set_tool("TOL-002")
	await settle()
	check(page.item.back, "UV opens on the back without a manual flip")
	check(not game.item(page.it_uid).evidence.has("TOL-002") and game.state.ap == before_ap, "auto orientation never records evidence or spends AP")
	page.flip_item()
	await settle()
	check(not page.item.back, "manual face control remains available after automatic positioning")
	page._set_tool("TOL-002")
	await settle()
	check(page.item.back, "reopening UV selects the back again")
	page._set_tool("TOL-001")
	await settle()
	check(not page.item.back, "magnifier returns to the dial automatically")
	game.prefs.reduced_motion = false
	page._set_tool("TOL-002")
	page._set_tool("TOL-001")
	await create_timer(.85).timeout
	check(page.tool == "TOL-001" and not page.item.back and not page.item.busy, "rapid tool changes finish on the latest requested face")
	shell.queue_free()
	await settle()
	for player in root.find_children("*", "AudioStreamPlayer", true, false):
		player.stop()
		player.stream = null
	await process_frame
	print("INSPECTION UX failures=", failures)
	quit(1 if failures else 0)
