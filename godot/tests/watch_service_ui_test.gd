extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	print("SERVICE UI ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func settle() -> void:
	for i in 6: await process_frame
func run() -> void:
	var page_script = load("res://scripts/pages/repair_page.gd")
	var preview = page_script.new()
	if not preview.has_method("open_forgery"):
		check(false, "repair bench has an animated forgery mode")
		preview.free()
		quit(1)
		return
	preview.free()
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	game.state = Model.create("SERVICE-UI")
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await settle()
	shell._close_title()
	var lot: Dictionary = game.state.inventory[0]
	lot.condition = 0.55
	lot.erase("service")
	var uid: String = lot.uid
	shell.go("repair", uid)
	await settle()
	var page = shell.active_shell().page
	check(page.it_uid == uid and page.has_method("snapshot"), "bench keeps requested physical identity and accessible status")
	if page.task == "dust":
		page._wipe_uv(Vector2(0.05,0.25),Vector2(0.95,0.25))
		page._save_cleaning()
		var saved: Dictionary = game.item(uid).service.operations.get("dust", {}).duplicate(true)
		page._refresh_info()
		check(page.cleaning.serialize() == saved, "rebuilding materials/details does not reset cleaning")
		shell.close_workspace()
		await settle()
		shell.go("repair", uid)
		await settle()
		page = shell.active_shell().page
		check(page.cleaning.serialize() == saved, "leaving and returning preserves partial cleaning")
	page.open_forgery("logo")
	await settle()
	check(page.mode == "forge" and page.task == "forge_logo", "forgery uses same repair workspace and selected lot")
	check(is_instance_valid(page.art) and page.art.visible, "forgery exposes actual animated work surface")
	var active = shell.active_shell()
	var serial_button: Button
	for button in page.info.find_children("*","Button",true,false):
		if button.text == "伪造紫外编号": serial_button = button
	active.toast("工序完成提示不能遮挡下一个操作")
	await settle()
	var feedback_panel = active.toast_box.get_child(active.toast_box.get_child_count()-1)
	check(feedback_panel.mouse_filter == Control.MOUSE_FILTER_IGNORE and feedback_panel.get_child(0).mouse_filter == Control.MOUSE_FILTER_IGNORE,
		"informational notice and its text cannot capture input intended for another control")
	for notice in active.toast_box.get_children(): notice.queue_free()
	page.open_forgery("logo")
	await settle()
	var serial_selector: Button
	for button in page.info.find_children("*","Button",true,false):
		if button.text == "伪造紫外编号": serial_selector = button
	serial_selector.pressed.emit()
	check(serial_selector.is_inside_tree(),"method selector remains alive until pointer dispatch finishes")
	await settle()
	check(page.task == "forge_serial","physical selector reliably switches the animated method")
	page.open_forgery("logo")
	await settle()
	var truth: Dictionary = game.item(uid).watch.duplicate(true)
	check(not game.item(uid).has("forgery"), "opening visual mode does not commit a fake or charge materials")
	for notice in shell.active_shell().toast_box.get_children(): notice.queue_free()
	await settle()
	game.dispatch({"type":"SERVICE_PROGRESS","uid":uid,"task":"forge_logo","progress":{"task":"forge_logo","version":1}})
	await settle()
	check(shell.active_shell().toast_box.get_child_count() == 0,"saving an animation frame does not redisplay an unchanged notice over the tool")
	page.art.advance()
	page.art._process(0.25)
	page.open_service()
	await settle()
	check(game.item(uid).watch == truth and page.mode == "service", "mode switch does not repair or alter physical truth")
	if page.task == "dust":
		var dust_progress: Dictionary = game.item(uid).service.operations.get("dust",{}).duplicate(true)
		page.art._process(10.0)
		check(not page.art.is_processing() and game.item(uid).service.operations.get("dust",{}) == dust_progress,
			"hidden forging animation cannot overwrite or complete the cleaning task")
	var labels := ""
	for label in page.find_children("*", "Label", true, false): labels += label.text + "\n"
	check(not labels.contains("绿区") and not labels.contains("新线圈") and not labels.contains("三道工序"), "obsolete universal minigames have been removed")
	# WebFS may persist the finished mask just before the separate atomic cost commit.
	var selected: Dictionary = game.item(uid)
	selected.service.tasks = ["dust"]
	selected.service.done = []
	selected.service.operations.dust = {"grid":64,"mask":"00".repeat(64*64),"complete":true}
	page._select(uid)
	await settle()
	check(page.cleaning.complete() and page.task == "dust", "intermediate zero-grime save restores without fabricating task completion")
	page._primary_action()
	await settle()
	check(game.item(uid).service.done.has("dust") and page.task == "", "already-clean restored mask has a usable atomic commit path")
	check(page.item.visible, "finished physical watch stays on the mat instead of leaving an empty work surface")
	shell.queue_free()
	await settle()
	quit(1 if failures else 0)
