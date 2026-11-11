extends SceneTree
## Real container geometry: dialogs, order density, and narrow stock details.
var failures := 0
func _initialize() -> void: call_deferred("run")
func frames() -> void:
	for i in 14: await process_frame
func check(ok: bool, message: String) -> void:
	print("MOBILE DENSITY ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func run() -> void:
	var game = root.get_node("Game")
	game.new_game("MOBILE-DENSITY")
	game.prefs.sound = false
	game.prefs.reduced_motion = true
	root.size = Vector2i(390,844)
	var shell = load("res://main.tscn").instantiate()
	shell.phone_override = true
	root.add_child(shell)
	await frames()
	shell._close_title()
	for dimensions in [Vector2i(390,844),Vector2i(320,568),Vector2i(844,390),Vector2i(568,320)]:
		game.new_game("MOBILE-DENSITY")
		root.size = dimensions
		await frames()
		shell.open_settings()
		await frames()
		var sheet: Control = shell.modal_layer.find_child("ModalSheet",true,false)
		var bounds: Rect2 = shell.safe_area().grow(1)
		check(bounds.encloses(sheet.get_global_rect()),"settings stays on screen at " + str(dimensions))
		var sc: ScrollContainer = sheet.find_children("*","ScrollContainer",true,false)[0]
		check(not sc.get_h_scroll_bar().visible,"settings never needs horizontal scrolling at " + str(dimensions))
		var content: Control = sc.get_child(0)
		check(content.size.x <= sc.size.x + 1,"settings switches and percentages fit at " + str(dimensions))
		shell.close_top_modal()
		await frames()
		for open_dialog in [shell.open_people,shell.open_help,shell.open_watch_catalogue,shell.open_night_report]:
			open_dialog.call()
			await frames()
			sheet = shell.modal_layer.find_child("ModalSheet",true,false)
			check(bounds.encloses(sheet.get_global_rect()),"secondary dialog stays on screen at " + str(dimensions))
			var vertical_scrolls := 0
			for nested in sheet.find_children("*","ScrollContainer",true,false):
				if nested.vertical_scroll_mode != ScrollContainer.SCROLL_MODE_DISABLED: vertical_scrolls += 1
			check(vertical_scrolls == 1,"secondary dialog has one vertical scroll owner")
			shell.close_top_modal()
			await frames()
		game.state.ledger.append({"id":"density-ledger","day":1,"kind":"purchase","label":"收购一件带有较长名称的手表与完整来源记录","amount":-123456,"cost":0})
		load("res://scripts/ui/campaign_ledger.gd").open(shell)
		await frames()
		sheet = shell.modal_layer.find_child("ModalSheet",true,false)
		check(bounds.encloses(sheet.get_global_rect()),"total ledger with real entries stays within phone width")
		shell.close_top_modal()
		await frames()
		shell.go("orders")
		await frames()
		var page = shell.active_shell().page
		var list: Control = page.cols.open
		var viewport: Control = page.scrollers.open
		var complete := 0
		for row in list.get_children():
			if viewport.get_global_rect().grow(1).encloses(row.get_global_rect()): complete += 1
		if complete < mini(3,list.get_child_count()):
			print("ORDER GEOMETRY ",dimensions," viewport=",viewport.get_global_rect()," rows=",list.get_children().map(func(row): return row.get_global_rect()))
		check(complete >= mini(3,list.get_child_count()),"at least three complete order summaries at " + str(dimensions) + " (got %d)" % complete)
		var first: Control = list.get_child(0)
		check(first.size.y <= 88,"order summary fits a compact row")
		var toggle: Button = first.find_child("OrderSummary",true,false)
		check(toggle != null,"order details have an explicit expand control")
		if toggle != null:
			toggle.button_pressed = true
			await frames()
			var actions := first.find_children("*","Button",true,false)
			var accept: Button
			for action in actions:
				if action.text == "接取订单": accept = action
			check(accept != null and accept.is_visible_in_tree(),"expanded order reveals real acceptance action")
			if accept != null:
				var count: int = page.counts.active
				accept.pressed.emit()
				await frames()
				check(page.counts.active == count+1 and page.selected_status == "active","acceptance preserves order behavior")
			toggle = page.cols.active.get_child(0).find_child("OrderSummary",true,false)
			check(toggle != null and toggle.button_pressed,"accepted order details stay expanded for delivery")
		if dimensions == Vector2i(390,844):
			page._select_status("open")
			root.size = Vector2i(568,320)
			await frames()
			check(page.cols.open.get_child(0).size.y <= 60,"open portrait order list becomes compact after rotating to small landscape")
			check(page.expanded_orders.size() > 0,"rotation preserves expanded-order selection")
			root.size = dimensions
			await frames()
		shell.close_workspace()
		await frames()
		shell.go("warehouse")
		await frames()
		page = shell.active_shell().page
		page.select(game.state.inventory[0].uid)
		await frames()
		var detail_scroll: ScrollContainer = page.detail_panel.get_child(0)
		check(page.detail.get_combined_minimum_size().x <= detail_scroll.size.x + 1,"warehouse details fit without clipped right edge at " + str(dimensions))
		var rotate: Button
		for key in page.detail.find_children("*","Button",true,false):
			if key.text == "旋转方向": rotate = key
		check(rotate != null and detail_scroll.get_global_rect().grow(1).encloses(rotate.get_global_rect()),"warehouse rotation is reachable without scrolling past the full item file")
		for key in page.detail.find_children("*","Button",true,false):
			if key.text.contains("展开物品档案"):
				key.button_pressed = true
				break
		await frames()
		check(page.detail.get_combined_minimum_size().x <= detail_scroll.size.x + 1,"expanded warehouse file also fits the phone width")
		for label in page.detail.find_children("*","Label",true,false):
			if label.text.begins_with("保管凭单"):
				check(detail_scroll.get_global_rect().intersects(label.get_global_rect()),"expanding the item file reveals its heading immediately")
		shell.close_workspace()
		await frames()
	shell.queue_free()
	await frames()
	quit(1 if failures else 0)
