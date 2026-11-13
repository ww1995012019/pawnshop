extends SceneTree
## Receipt metadata must use the paper width and marks must stay with the watch.
var failures := 0

func _initialize(): call_deferred("run")

func frames():
	for i in 14: await process_frame

func check(ok: bool, message: String):
	print("WAREHOUSE RECEIPT ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1

func label_start(node: Node, prefix: String) -> Label:
	for child in node.get_children():
		if child is Label and child.text.begins_with(prefix): return child
		var found := label_start(child, prefix)
		if found != null: return found
	return null

func receipt_geometry(page, context: String):
	var receipt_id := label_start(page.detail, "保管凭单 / ")
	check(receipt_id != null, context + " exposes the original custody receipt")
	if receipt_id == null: return
	var record: Control = receipt_id.get_parent()
	var pictures := record.find_children("*", "TextureRect", true, false)
	check(not pictures.is_empty(), context + " retains the watch image")
	if pictures.is_empty(): return
	var picture: TextureRect = pictures[0]
	var bounds := picture.get_global_rect()
	print("WAREHOUSE RECEIPT geometry ", context, " paper=", record.size, " image=", picture.size, " title_row=", picture.get_parent().size)
	check(bounds.size.y <= 128, context + " watch image cannot stretch down the metadata column")
	check(picture.get_parent().size.y <= 144, context + " title and image form a compact receipt header")
	for prefix in ["型号档次：", "店铺自有", "品相 "]:
		var field := label_start(record, prefix)
		check(field != null and field.size.x >= record.size.x * 0.9, context + " gives " + prefix + " the paper width")
		if field != null: check(field.get_line_count() <= 2, context + " keeps " + prefix + " readable without a narrow text tower")
	var crest: Control = picture.get_node_or_null("item_decoration/tier_crest")
	if crest != null:
		check(crest.get_global_rect().get_center().distance_to(Vector2(bounds.end.x, bounds.position.y)) <= 24, context + " crown stays beside the watch upper corner")
	var modified: Control = picture.get_node_or_null("item_decoration/modified_badge")
	check(modified != null and modified.get_global_rect().get_center().distance_to(Vector2(bounds.position.x, bounds.end.y)) <= 40, context + " modification mark stays beside the watch lower corner")
	var scroller: ScrollContainer = page.detail_panel.get_child(0)
	check(not scroller.get_h_scroll_bar().visible, context + " receipt has no horizontal overflow")

func run():
	root.size = Vector2i(1595, 860)
	var game = root.get_node("Game")
	game.new_game("WAREHOUSE-RECEIPT")
	game.prefs.sound = false
	game.prefs.reduced_motion = true
	game.state.inventory = []
	game.state.storageExpansion = WarehouseExpansion.default_state(5)
	var plain := Model.new_item(game.state, "WCH-002", {"owner":"shop", "working":true, "sourceVerified":true, "condition":0.92, "listPrice":321})
	WatchForgery.apply(plain, "serial")
	Model.put_in(game.state, plain)
	var luxury := Model.new_item(game.state, "WCH-008", {"owner":"shop", "working":true, "sourceVerified":true, "condition":0.92, "listPrice":4567})
	luxury.forgery = {"targetId":"WCH-033", "methods":{}}
	check(WatchForgery.compatible(luxury, "WCH-033"), "luxury case fixture uses a compatible mechanical original")
	WatchForgery.apply(luxury, "case")
	Model.put_in(game.state, luxury)
	if OS.get_cmdline_user_args().has("--fixture"):
		if preload("res://tests/fixture_output.gd").write_json("res://../work/warehouse-receipt/fixture.json", game.state) != OK:
			quit(1); return
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	shell.go("warehouse", luxury.uid)
	await frames()
	var page = shell.active_shell().page
	shell.workspace_container.stretch = false
	for dimensions in [Vector2i(1440, 800), Vector2i(1160, 700)]:
		var viewport: SubViewport = shell.active_shell().get_viewport()
		viewport.size_2d_override = dimensions
		viewport.size = dimensions
		await frames()
		page.relayout()
		await frames()
		for it in [plain, luxury]:
			page.select(it.uid)
			await frames()
			receipt_geometry(page, "desktop %s %s" % [dimensions, it.defId])
	# Rebuilt records must not discard a suspended workspace's scroll positions.
	for location in ["display", "isolation"]:
		for index in 120:
			var stored := Model.new_item(game.state, "WCH-001", {"owner":"shop", "location":location})
			game.state.inventory.append(stored)
	page._refresh()
	await frames()
	var detail_scroll: ScrollContainer = page.detail_panel.get_child(0)
	for scroller in [page.grid_scroll, page.display_scroll, detail_scroll]: scroller.scroll_vertical = 90
	await frames()
	check(page.grid_scroll.scroll_vertical == 90 and page.display_scroll.scroll_vertical == 90 and detail_scroll.scroll_vertical == 90, "scroll fixture reaches grid, display and receipt records")
	var previous: Dictionary = game.state.duplicate(true)
	game.item(luxury.uid).condition = 0.96
	page.on_changed(previous, game.state, {"type":"WORKSPACE_RESUME"})
	await frames()
	for scroller in [page.grid_scroll, page.display_scroll, detail_scroll]:
		check(scroller.scroll_vertical == 90, "changed-state workspace resume preserves " + String(scroller.name) + " scroll")
	check(page.selected == luxury.uid and label_start(page.detail, "品相 ").text.contains("96%"), "resume refreshes the repaired original while retaining selection")
	page.switch_cabinet("isolation")
	await frames()
	page.cabinet_scroll.scroll_vertical = 90
	await frames()
	check(page.cabinet_scroll.scroll_vertical == 90, "scroll fixture reaches isolation records")
	previous = game.state.duplicate(true)
	game.item(luxury.uid).condition = 0.97
	page.on_changed(previous, game.state, {"type":"WORKSPACE_RESUME"})
	await frames()
	check(page.cabinet_scroll.scroll_vertical == 90, "changed-state workspace resume preserves cabinet scroll")
	for dimensions in [Vector2i(844, 390), Vector2i(390, 844)]:
		shell.close_workspace()
		root.size = dimensions
		shell.phone_override = true
		await frames()
		shell._fit()
		await frames()
		shell.go("warehouse", luxury.uid)
		await frames()
		page = shell.active_shell().page
		var preview: Button
		for button in page.detail.find_children("*", "Button", true, false):
			if button.text.contains("展开物品档案"): preview = button; break
		check(preview != null, "mobile receipt retains its expand control")
		if preview != null:
			preview.button_pressed = true
			await frames()
			receipt_geometry(page, "expanded mobile %s" % dimensions)
	shell.queue_free()
	await frames()
	print("WAREHOUSE RECEIPT failures=", failures)
	quit(1 if failures else 0)
