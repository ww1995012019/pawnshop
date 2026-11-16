extends SceneTree
## Real pointer input must expose nearby actions and carry a visible original.
var failures := 0

func _initialize(): call_deferred("run")

func frames(count := 10):
	for i in count: await process_frame

func check(ok: bool, message: String):
	print("WAREHOUSE INTERACTIONS ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1

func button_with_text(node: Node, text: String) -> Button:
	for button in node.find_children("*", "Button", true, false):
		if button.text == text and not button.is_queued_for_deletion(): return button
	return null

func point(viewport: Viewport, at: Vector2, button: int, pressed: bool):
	if pressed:
		var hover := InputEventMouseMotion.new()
		hover.position = at; hover.global_position = at
		viewport.push_input(hover, true)
		await frames(2)
	var event := InputEventMouseButton.new()
	event.position = at; event.global_position = at
	event.button_index = button; event.pressed = pressed
	event.button_mask = MOUSE_BUTTON_MASK_LEFT if pressed and button == MOUSE_BUTTON_LEFT else 0
	viewport.push_input(event, true)
	await frames(3)

func motion(viewport: Viewport, at: Vector2):
	var event := InputEventMouseMotion.new()
	event.position = at; event.global_position = at
	event.button_mask = MOUSE_BUTTON_MASK_LEFT
	viewport.push_input(event, true)
	await frames(3)

func unclipped_at(control: Control, at: Vector2) -> bool:
	if not control.is_visible_in_tree() or not control.get_global_rect().has_point(at): return false
	var parent := control.get_parent()
	while parent != null:
		if parent is Control and parent.clip_contents and not parent.get_global_rect().has_point(at): return false
		parent = parent.get_parent()
	return true

func menu(page) -> Control:
	return page.find_child("WarehouseItemMenu", true, false)

func run():
	root.size = Vector2i(1440, 900)
	var game = root.get_node("Game")
	game.new_game("WAREHOUSE-INTERACTIONS")
	game.prefs.sound = false; game.prefs.reduced_motion = true
	game.state.inventory = []; game.state.trade = null
	game.state.storageExpansion = WarehouseExpansion.default_state(1)
	var original := Model.new_item(game.state, "WCH-002", {"owner":"shop", "sourceVerified":true, "evidence":["TOL-001", "TOL-002"]})
	Model.put_in(game.state, original)
	var unverified := Model.new_item(game.state, "WCH-008", {"owner":"shop", "sourceVerified":false})
	Model.put_in(game.state, unverified)
	unverified.x=8
	var displayed := Model.new_item(game.state, "WCH-007", {"owner":"shop", "location":"display", "sourceVerified":true, "evidence":["TOL-001", "TOL-002"]})
	game.state.inventory.append(displayed)
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell); await frames(16); shell._close_title()
	shell.go("warehouse"); await frames(16)
	var page = shell.active_shell().page
	var viewport: Viewport = page.get_viewport()
	var start: Vector2 = page.grid.get_global_transform_with_canvas() * ((Vector2(original.x, original.y) + Vector2(0.5, 0.5)) * page.cell_size)
	await point(viewport, start, MOUSE_BUTTON_LEFT, true)
	await point(viewport, start, MOUSE_BUTTON_LEFT, false)
	check(button_with_text(page.detail, "上架陈列") == null, "desktop receipt does not pin the action controls")
	await point(viewport, start, MOUSE_BUTTON_RIGHT, true)
	await point(viewport, start, MOUSE_BUTTON_RIGHT, false)
	var popup := menu(page)
	check(popup != null and popup.is_visible_in_tree(), "right-click opens the watch action menu")
	if popup != null:
		check(page.selected == original.uid, "menu selects the clicked original")
		check(popup.get_global_rect().grow(24).has_point(start), "menu appears next to the clicked watch")
		check(page.get_viewport_rect().encloses(popup.get_global_rect()), "menu fits the workspace viewport")
		var shelf := button_with_text(popup, "上架陈列")
		check(shelf != null and not shelf.disabled, "verified original retains its eligible shelf action")
		var other_at:Vector2=page.grid.get_global_transform_with_canvas()*((Vector2(unverified.x,unverified.y)+Vector2(0.5,0.5))*page.cell_size)
		await point(viewport,other_at,MOUSE_BUTTON_RIGHT,true)
		await point(viewport,other_at,MOUSE_BUTTON_RIGHT,false)
		check(menu(page)!=null and page.selected==unverified.uid,"right-clicking another watch retargets the open menu")
		if menu(page)==null:
			page.open_item_menu(original.uid,start)
			await frames()
		var escape := InputEventKey.new(); escape.keycode = KEY_ESCAPE; escape.pressed = true
		Input.parse_input_event(escape)
		# Embedded viewports can receive the same physical key after the root.
		viewport.push_input(escape,true)
		await frames()
		check(shell.workspace_open(),"Escape leaves the warehouse open after dismissing its menu")
		if not shell.workspace_open():
			shell.queue_free(); await frames(); quit(1); return
		check(menu(page) == null or not menu(page).is_visible_in_tree(), "Escape dismisses the menu")
	# Preview must still be visible when crossing into the display cabinet.
	await point(viewport, start, MOUSE_BUTTON_LEFT, true)
	await motion(viewport, start + Vector2(18, 8))
	var outside: Vector2 = page.display_grid.get_child(1).get_global_rect().get_center()
	await motion(viewport, outside)
	var ghost: TextureRect = page.grid.ghost
	check(ghost != null and ghost.texture != null, "drag carries the actual watch image")
	if ghost != null:
		check(ghost.modulate.a > 0.2 and ghost.modulate.a < 1.0, "drag image is translucent")
		check(unclipped_at(ghost, ghost.get_global_rect().get_center()), "watch preview remains visible outside warehouse clipping")
		check(ghost.get_global_rect().grow(16).has_point(outside), "watch preview follows the cursor across cabinets")
	await point(viewport, outside, MOUSE_BUTTON_LEFT, false)
	check(game.item(original.uid).location == "display", "cross-cabinet drop still shelves the same original")
	check(page.grid.ghost == null, "drop clears the watch preview")
	# Cabinet originals use the same nearby menu and the correct UID.
	var slot = page.display_grid.get_child(0)
	var slot_uid: String = slot.uid
	var slot_at: Vector2 = slot.get_global_rect().get_center()
	await point(viewport, slot_at, MOUSE_BUTTON_RIGHT, true)
	await point(viewport, slot_at, MOUSE_BUTTON_RIGHT, false)
	popup = menu(page)
	check(popup != null and page.selected == slot_uid, "display watch right-click targets that original")
	if popup != null:
		var unshelf:=button_with_text(popup,"下架")
		check(unshelf!=null and not unshelf.disabled,"display menu exposes its own unshelve action")
		if unshelf!=null:
			unshelf.pressed.emit()
			await frames()
			check(game.item(slot_uid).location=="warehouse","menu action moves the targeted original")
			check(menu(page)==null,"choosing an action dismisses the menu")
		page.open_item_menu(unverified.uid,page.shell.content_rect().end-Vector2(2,2))
		await frames()
		popup=menu(page)
		check(page.get_viewport_rect().encloses(popup.get_global_rect()),"menu near the bottom-right edge stays on screen")
		var scroller:ScrollContainer=popup.find_child("ItemActionScroll",true,false)
		scroller.scroll_vertical=100000
		await frames()
		var last:=button_with_text(popup,"主动归还原主")
		check(last!=null and unclipped_at(last,last.get_global_rect().get_center()),"scrolling reaches the last menu action")
		check(not scroller.get_h_scroll_bar().visible,"context actions need no horizontal scrolling")
		var outside_at: Vector2 = page.cabinet_buttons.materials.get_global_rect().get_center()
		await point(viewport, outside_at, MOUSE_BUTTON_LEFT, true)
		await point(viewport, outside_at, MOUSE_BUTTON_LEFT, false)
		check(menu(page) == null or not menu(page).is_visible_in_tree(), "clicking outside dismisses the menu")
	# Rotation during a drag remains a rotation, never a context menu.
	var stock = game.item(unverified.uid)
	start = page.grid.get_global_transform_with_canvas() * ((Vector2(stock.x, stock.y) + Vector2(0.5, 0.5)) * page.cell_size)
	await point(viewport, start, MOUSE_BUTTON_RIGHT, true)
	await point(viewport, start, MOUSE_BUTTON_RIGHT, false)
	popup = menu(page)
	if popup != null:
		var shelf := button_with_text(popup, "上架陈列")
		check(shelf != null and shelf.disabled, "context menu keeps unverified originals off the shelf")
		await point(viewport, Vector2(20, 20), MOUSE_BUTTON_LEFT, true)
		await point(viewport, Vector2(20, 20), MOUSE_BUTTON_LEFT, false)
	var before: Dictionary = game.item(unverified.uid).duplicate(true)
	await point(viewport, start, MOUSE_BUTTON_LEFT, true)
	await motion(viewport, start + Vector2(18, 8))
	var was_rotated: bool = page.grid.drag_rot
	await point(viewport, start + Vector2(18, 8), MOUSE_BUTTON_RIGHT, true)
	check(page.grid.drag_rot != was_rotated and menu(page) == null, "right-click during a drag rotates without opening a menu")
	await motion(viewport, Vector2(20, 20))
	await point(viewport, Vector2(20, 20), MOUSE_BUTTON_LEFT, false)
	stock = game.item(unverified.uid)
	check(stock.x == before.x and stock.y == before.y and stock.rotated == before.rotated, "invalid drop preserves original placement and orientation")
	check(page.grid.ghost == null, "invalid drop also clears the watch preview")
	# Hidden cabinet slots retain old rectangles after switching to materials.
	for i in 9:
		var isolated:=Model.new_item(game.state,"WCH-001",{"owner":"shop","location":"isolation"})
		game.state.inventory.append(isolated)
	page.switch_cabinet("isolation"); await frames()
	var hidden_at:Vector2=page.cabinet_grid.get_child(8).get_global_rect().get_center()
	page.switch_cabinet("materials"); await frames()
	page.open_item_menu(displayed.uid,page.display_grid.get_child(0).get_global_rect().get_center())
	await frames()
	check(not menu(page).get_global_rect().has_point(hidden_at),"hidden-cabinet fixture exposes an uncovered material slot")
	await point(viewport,hidden_at,MOUSE_BUTTON_RIGHT,true)
	await point(viewport,hidden_at,MOUSE_BUTTON_RIGHT,false)
	check(menu(page)==null and page.selected==displayed.uid,"material slots cannot retarget a menu to a hidden cabinet original")
	shell.queue_free(); await frames()
	print("WAREHOUSE INTERACTIONS failures=", failures)
	quit(1 if failures else 0)
