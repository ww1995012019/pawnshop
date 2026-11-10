extends SceneTree
var failures := 0
func _initialize(): call_deferred("run")
func settle():
	for i in 8: await process_frame
func check(ok: bool, message: String):
	print("BENCH PERMISSION ","PASS " if ok else "FAIL ",message)
	if not ok: failures += 1
func run():
	var game = root.get_node("Game")
	game.prefs.sound = false
	game.prefs.reduced_motion = true
	game.state = Model.create("WORKBENCH-PERMISSIONS")
	game.state.ap = 12
	for key in game.state.materials: game.state.materials[key] = 100
	var owned: Dictionary = game.state.inventory[0]
	var owned_uid: String = owned.uid
	var order := Model.new_item(game.state,"WCH-001",{"owner":"customer","orderId":"TEST-REPAIR-ORDER","condition":0.55,"working":false})
	Model.put_in(game.state,order)
	var order_uid: String = order.uid
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await settle()
	shell._close_title()
	shell.go("repair",order_uid)
	await settle()
	var page = shell.active_shell().page
	page.open_forgery("logo")
	await settle()
	check(page.mode=="service" and not page.task.begins_with("forge_"),"customer repair orders cannot enter a forgery preview")
	check(not page.mode_buttons.forge.visible,"customer repair order does not display a forgery mode entry")
	page.mode = "forge"
	check(not page._candidates().any(func(it):return it.uid==order_uid),"forgery list excludes customer work orders")
	page.mode = "service"
	page._select(owned_uid)
	page.open_forgery("logo")
	await settle()
	var contact: Dictionary = page.art.interaction_targets()[0]
	game.state.ap = 0
	page._update_guidance()
	var before: Dictionary = page.art.progress_snapshot()
	check(page.action_button.disabled and page.art.interaction_targets().is_empty(),"unavailable work disables both the action button and physical target")
	page.art.advance()
	var down := InputEventMouseButton.new()
	down.button_index = MOUSE_BUTTON_LEFT
	down.pressed = true
	down.position = contact.position
	page.art._gui_input(down)
	down.pressed = false
	page.art._gui_input(down)
	var key := InputEventKey.new()
	key.keycode = KEY_ENTER
	key.pressed = true
	page.art._gui_input(key)
	page.art._process(10)
	check(page.art.progress_snapshot()==before and not game.item(owned_uid).has("forgery"),"blocked button-equivalent, pointer and keyboard inputs cannot play or finish the animation")
	game.state.ap = 12
	for id in WatchForgery.COSTS.logo: game.state.materials[id] = 0
	page._update_guidance()
	page.art.advance()
	page.art._process(10)
	check(page.art.progress_snapshot()==before and page.action_button.disabled,"missing materials also block physical work")
	for id in WatchForgery.COSTS.logo: game.state.materials[id] = 100
	page._update_guidance()
	check(not page.action_button.disabled and not page.art.interaction_targets().is_empty(),"restoring resources enables the same saved operation")
	page.art.advance()
	page.art._process(0.1)
	game.state.ap = 0
	page._update_guidance()
	var paused: Dictionary = page.art.progress_snapshot()
	page.art._process(10)
	check(page.art.progress_snapshot()==paused,"a running operation pauses immediately when permission is lost")
	game.state.ap = 12
	page._update_guidance()
	page.art._process(10)
	check(page.art.progress_snapshot().step==1,"permitted operation resumes from the saved phase rather than restarting")
	page._select(order_uid)
	await settle()
	check(page.mode=="service" and page.it_uid==order_uid,"selecting a repair order while in forgery returns to its repair workflow")
	page._select(owned_uid)
	game.state.trade = {"selectedUid":owned_uid}
	page.open_forgery("logo")
	check(page.mode=="service" and not page.mode_buttons.forge.visible,"stock reserved by a trade cannot expose an unavailable forgery preview")
	game.state.trade = null
	shell.queue_free()
	await settle()
	quit(1 if failures else 0)
