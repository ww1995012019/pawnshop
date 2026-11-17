extends SceneTree
## Shared controls must reach actual windows, including nested workspaces.
var failures := 0
func _initialize() -> void: call_deferred("run")
func frames() -> void:
	for i in 12: await process_frame
func check(ok: bool, message: String) -> void:
	print("LANDSCAPE UI ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func check_close(button: Button, context: String) -> void:
	check(button != null, context + " has a close button")
	if button == null: return
	check(button.text.is_empty() and button.icon != null, context + " shows only the close icon")
	check(button.icon_alignment == HORIZONTAL_ALIGNMENT_CENTER and button.vertical_icon_alignment == VERTICAL_ALIGNMENT_CENTER, context + " centers its close icon")
	var xf := button.get_viewport().get_screen_transform() * button.get_global_transform_with_canvas()
	var rendered := xf.basis_xform(button.size).abs()
	check(rendered.x >= 43.9 and rendered.y >= 43.9, context + " has a real 44-pixel target")
func run() -> void:
	root.size = Vector2i(1920,1080)
	var game = root.get_node("Game")
	game.prefs.sound = false
	game.prefs.reduced_motion = true
	game.new_game("LANDSCAPE-SHARED-UI")
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	for dimensions in [Vector2i(1920,1080),Vector2i(844,390)]:
		shell.phone_override = dimensions.x < 1000
		root.size = dimensions
		shell._fit()
		await frames()
		for destination in ["inspect","repair","warehouse","orders","report"]:
			shell.go(destination)
			await frames()
			check_close(shell.workspace_close, str(dimensions) + " " + destination)
			var active = shell.active_shell()
			var nested: Array = active.modal("嵌套核对",420)
			await frames()
			var close: Button = active.modal_layer.find_child("modal_close",true,false)
			check_close(close, destination + " nested modal")
			if close != null: close.pressed.emit()
			await frames()
			check(shell.workspace_open() and not active.modal_open(), "nested close preserves " + destination)
			shell.workspace_close.pressed.emit()
			await frames()
			check(not shell.workspace_open(), "workspace close returns from " + destination)
		shell.open_night_report()
		await frames()
		var close: Button = shell.modal_layer.find_child("modal_close",true,false)
		check_close(close, "night report")
		if close != null: close.pressed.emit()
		await frames()
		check(not shell.modal_open(), "night report closes once")
	# A subclass must not overwrite the CSS minimum after its factory ran.
	shell.phone_override = false
	root.size = Vector2i(1280,720)
	shell._fit()
	game.state.trade = WantedCases.new_officer_trade(game.state)
	game.dispatch({"type":"ISSUE_WANTED","tradeId":game.state.trade.id})
	await frames()
	check_close(shell.wanted_notice.close_button, "scaled wanted notice")
	shell.queue_free()
	await frames()
	quit(1 if failures else 0)
