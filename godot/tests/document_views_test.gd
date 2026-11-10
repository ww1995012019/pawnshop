extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	print("DOCUMENTS ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func frames() -> void:
	for i in 5: await process_frame
func run() -> void:
	var game = root.get_node("Game")
	game.prefs.sound = false
	game.prefs.reduced_motion = true
	game.new_game("DOCUMENT-VIEWS")
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	var before := JSON.stringify(game.state)
	shell.open_watch_manual("WCH-001")
	await frames()
	var guide = shell.root_ui.find_child("inspection_guide", true, false)
	check(guide != null, "inspection guide opens as floating paper")
	check(not shell.modal_open(), "guide leaves workbench interactive")
	if guide != null:
		check(guide.find_child("document_resize",true,false)==null,"paper has no resize button")
		check(guide.header.get_child_count()==2,"paper header contains only title and close")
		check(guide.find_children("document_corner_*","Control",true,false).size()==4,"all four paper corners are draggable resize targets")
		for corner in [Vector2.ZERO,Vector2(1,0),Vector2(0,1),Vector2.ONE]:
			guide.set_document_zoom(0.6)
			guide.move_document(Vector2(500,200))
			var anchor: Vector2 = guide.position+guide.size*guide.scale*(Vector2.ONE-corner)
			var pointer: Vector2 = guide.position+guide.size*guide.scale*corner
			guide._begin_corner_resize(corner,pointer)
			guide._resize_to(pointer-(corner*2.0-Vector2.ONE)*guide.logical_size*0.1)
			check(is_equal_approx(guide.scale.x,0.5),"corner gesture continuously scales the document")
			check((guide.position+guide.size*guide.scale*(Vector2.ONE-corner)).distance_to(anchor)<1,"corner gesture keeps opposite corner fixed")
			guide.resizing = false
		guide.set_document_zoom(1.0)
		var old_scale: Vector2 = guide.scale
		guide.set_document_zoom(0.65)
		check(guide.scale != old_scale, "paper can be scaled")
		guide.move_document(Vector2(-500,-500))
		check(guide.position.x >= 8 and guide.position.y >= 8, "paper cannot be lost offscreen")
		guide.find_child("document_close",true,false).pressed.emit()
		check(not guide.visible, "paper can be manually closed")
		shell.open_watch_manual("WCH-001")
		await frames()
		check(guide.visible and is_equal_approx(guide.scale.x,0.65), "reopening preserves paper zoom")
	check(JSON.stringify(game.state)==before, "guide never changes evidence or cash")
	check(shell.has_method("open_watch_catalogue"), "settings catalogue has a dedicated route")
	if shell.has_method("open_watch_catalogue"):
		shell.open_watch_catalogue()
		await frames()
		var cards: Array = shell.modal_layer.find_children("catalogue_model_*","Button",true,false)
		check(cards.size()==GameData.item_list.size(), "catalogue lays out every watch as an icon card")
		check(shell.modal_layer.find_child("manual_model",true,false)==null,"catalogue uses no model dropdown")
		var star_tab = shell.modal_layer.find_child("catalogue_group_star",true,false)
		check(star_tab != null,"Star has a direct standalone catalogue category")
		if star_tab != null:
			star_tab.pressed.emit()
			await frames()
			var star_cards = shell.modal_layer.find_children("catalogue_model_*","Button",true,false).filter(func(c): return c.is_visible_in_tree())
			check(star_cards.size()==6,"Star category displays its six models only")
			check(star_cards.all(func(c):return c.text.contains("星冕") and c.text.contains("Cr")),"Star cards show series name and catalogue price")
			shell.modal_layer.find_child("catalogue_group_all",true,false).pressed.emit()
			await frames()
		if not cards.is_empty():
			cards[-1].pressed.emit()
			await frames()
			check(shell.modal_layer.find_child("catalogue_back",true,false)!=null,"model detail offers return to icon grid")
		shell.close_top_modal()
	game.state.trade = WantedCases.new_officer_trade(game.state)
	game.dispatch({"type":"ISSUE_WANTED","tradeId":game.state.trade.id})
	await frames()
	var paper = shell.wanted_notice
	paper.set_document_zoom(0.7)
	await frames()
	check(is_equal_approx(float(game.state.police.paper.scale),0.7) and is_equal_approx(paper.scale.x,0.7),"wanted zoom persists despite synchronous state refresh")
	paper.move_document(Vector2(170,100))
	check(paper.position.distance_to(Vector2(170,100))<1,"wanted move survives geometry save refresh")
	var rect: Rect2 = shell.page.toast_rect()
	check(rect.end.y <= 124, "counter notification stays above portrait window")
	check(shell.page.cash_tray.mouse_filter != Control.MOUSE_FILTER_IGNORE,"cash stack is clickable")
	if guide != null: guide.close_document()
	paper.close_document()
	await frames()
	var cash_point: Vector2 = root.get_final_transform() * shell.page.cash_tray.get_global_rect().get_center()
	for pressed in [true,false]:
		var event := InputEventMouseButton.new()
		event.position = cash_point
		event.global_position = cash_point
		event.button_index = MOUSE_BUTTON_LEFT
		event.pressed = pressed
		Input.parse_input_event(event)
		await frames()
	check(shell.modal_open() and shell.modal_layer.find_child("ledger_cash",true,false)!=null,"real cash stack click opens campaign ledger")
	shell.close_top_modal()
	shell.queue_free()
	await frames()
	for player in root.find_children("*","AudioStreamPlayer",true,false): player.stop();player.stream=null
	print("DOCUMENTS failures=",failures)
	quit(1 if failures else 0)
