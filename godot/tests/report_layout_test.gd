extends SceneTree
## The ledger should use its drawer and keep amounts clear of its scroll rail.
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	print("LEDGER LAYOUT ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func settle() -> void:
	for i in 10: await process_frame
func run() -> void:
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	game.new_game("LEDGER-LAYOUT")
	for i in 40:
		game.state.ledger.append({"id": "layout-%d" % i, "day": 1, "kind": "purchase", "label": "收购 星冕 X06 典藏", "amount": -12345 - i, "cost": 0})
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await settle()
	shell._close_title()
	shell.go("report")
	await settle()
	var active = shell.active_shell()
	var page = active.page
	shell.workspace_container.stretch = false
	for logical_size in [Vector2(1600, 900), Vector2(1600, 600)]:
		var viewport: SubViewport = active.get_viewport()
		viewport.size_2d_override = Vector2i(logical_size)
		viewport.size = Vector2i(logical_size)
		await settle()
		page.relayout()
		await settle()
		var area: Rect2 = active.content_rect()
		check(area.encloses(page.sheet.get_rect()), "ledger stays inside drawer at " + str(logical_size))
		check(page.sheet.size.x >= area.size.x * 0.95 and page.sheet.size.y >= area.size.y * 0.95, "ledger uses available drawer area at " + str(logical_size))
		var scroll: ScrollContainer = page.body.find_children("*", "ScrollContainer", true, false)[0]
		check(scroll.get_v_scroll_bar().visible, "long ledger can scroll")
		var amount: Label = scroll.find_children("*", "HBoxContainer", true, false)[0].get_child(1)
		var gap := scroll.get_v_scroll_bar().get_global_rect().position.x - amount.get_global_rect().end.x
		check(gap >= 20, "amount has at least 20px before scroll rail (got %.1f)" % gap)
		if logical_size.y == 900:
			check(scroll.size.y >= 400, "desktop ledger displays more than a short fixed-height strip")
		var before: Dictionary = game.state.duplicate(true)
		scroll.scroll_vertical = 100
		await settle()
		check(game.state == before, "scrolling does not change transactions or settlement")
	shell.queue_free()
	await settle()
	for player in root.find_children("*", "AudioStreamPlayer", true, false):
		player.stop()
		player.stream = null
	await process_frame
	print("LEDGER LAYOUT failures=", failures)
	quit(1 if failures else 0)
