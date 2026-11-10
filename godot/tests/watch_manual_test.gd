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
		var guide = shell.root_ui.find_child("inspection_guide",true,false)
		check(guide != null and not shell.modal_open(), "reference guide opens as a non-modal paper")
		var text := text_in(guide)
		check(text.contains("编号") and text.contains("重量") and text.contains("logo"), "guide provides all three reference standards")
		check(not text.contains("分类："), "internal item category is not shown")
		check(text.contains("型号档次：低等"), "guide displays current model tier")
		guide.close_document()
		shell.open_watch_catalogue()
		await process_frame
		var cards: Array = shell.modal_layer.find_children("catalogue_model_*","Button",true,false)
		check(cards.size()==33,"catalogue displays all 33 watch icons")
		check(shell.modal_layer.find_child("manual_model",true,false)==null,"no dropdown model selector")
		var last: Button = shell.modal_layer.find_child("catalogue_model_WCH-033",true,false)
		last.pressed.emit()
		await process_frame
		text = text_in(shell.modal_layer)
		check(text.contains("星冕 X06 典藏") and text.contains("型号档次：名贵"), "last model has correct name and tier")
		check(text.contains("XM X06") and text.contains("148.0"), "last model has its own serial and mass")
		check(JSON.stringify(game.state) == before, "reading references is free and records no evidence")
		shell.close_top_modal()
		await process_frame
		check(not shell.modal_open(), "closing catalogue restores counter")
	var added := Model.new_item(game.state, "WCH-033", {"x": 4, "y": 0})
	Model.put_in(game.state, added)
	game.focus_uid = added.uid
	shell.go("warehouse")
	await process_frame
	await process_frame
	var warehouse = shell.workspace_shell.page
	check(text_in(warehouse.detail).contains("型号档次：名贵"), "warehouse detail shows the selected model tier")
	shell.go("inspect")
	await process_frame
	await process_frame
	var inspection = shell.workspace_shell.page
	check(text_in(inspection.info).contains("型号档次：名贵"), "inspection detail shows the selected model tier")
	shell.queue_free()
	await process_frame
	print("WATCH MANUAL failures=", failures)
	for player in root.find_children("*", "AudioStreamPlayer", true, false):
		player.stop()
		player.stream = null
	await process_frame
	quit(1 if failures else 0)
