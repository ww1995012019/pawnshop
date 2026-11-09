extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	print("WATCH MANUAL ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func text_in(node: Node) -> String:
	var out := ""
	if node is Label or node is Button: out += node.text + "\n"
	for child in node.get_children(): out += text_in(child)
	return out
func run() -> void:
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	game.new_game("WATCH-MANUAL")
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await process_frame
	await process_frame
	shell._close_title()
	check(shell.has_method("open_watch_manual"), "manual available from main counter")
	if shell.has_method("open_watch_manual"):
		var before := JSON.stringify(game.state)
		shell.open_watch_manual(GameData.item_list[0].id)
		await process_frame
		await process_frame
		check(shell.modal_open(), "reference manual opens as an independent sheet")
		var text := text_in(shell.modal_layer)
		check(text.contains("编号") and text.contains("重量") and text.contains("logo"), "manual provides all three reference standards")
		check(not text.contains("分类："), "internal category is not shown")
		check(JSON.stringify(game.state) == before, "reading the manual is free and records no evidence")
		shell.close_top_modal()
		await process_frame
		check(not shell.modal_open(), "closing manual restores the counter")
	shell.queue_free()
	await process_frame
	print("WATCH MANUAL failures=", failures)
	for player in root.find_children("*", "AudioStreamPlayer", true, false):
		player.stop()
		player.stream = null
	await process_frame
	quit(1 if failures else 0)
