extends SceneTree
var failures := 0
var shell
func _initialize() -> void: call_deferred("run")
func frames() -> void:
	for i in 12: await process_frame
func check(ok: bool, text: String) -> void:
	print("MERCHANT COMPACT ", "PASS " if ok else "FAIL ", text)
	if not ok: failures += 1
func keyed(key: String, node: Node = null) -> Button:
	if node == null: node = shell.modal_layer
	if node is Button and not node.is_queued_for_deletion() and node.get_meta("merchant_focus", "") == key: return node
	for child in node.get_children():
		var found := keyed(key, child)
		if found: return found
	return null
func scrolls(node: Node) -> int:
	var result := 1 if node is ScrollContainer else 0
	for child in node.get_children(): result += scrolls(child)
	return result
func run() -> void:
	var game = root.get_node("Game")
	game.prefs.sound = false
	game.prefs.reduced_motion = true
	game.state = Model.create("COMPACT-MERCHANT")
	game.state.cursor = 4
	game.dispatch({"type":"ARRIVE"})
	shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	for window in [Vector2i(1440,900), Vector2i(844,390), Vector2i(390,844)]:
		game.state.trade.stock["MAT-002"] = 20
		game.state.cash = 10000
		root.size = window
		await frames()
		shell.page._merchant_shop()
		await frames()
		check(keyed("category:materials") != null and keyed("category:rare") != null and keyed("category:watches") != null, "horizontal merchant categories at " + str(window))
		check(scrolls(shell.modal_layer) == 1, "one popup scroll at " + str(window))
		var card := keyed("material:MAT-001")
		check(card != null and card.custom_minimum_size.x <= 80 and card.custom_minimum_size.y <= 88, "compact material cards at " + str(window))
		var sheet = shell.modal_layer.find_child("ModalSheet", true, false)
		if window == Vector2i(1440,900):
			check(sheet.size.y < 620, "desktop material popup shrinks to content")
		var buy := keyed("buy:MAT-001")
		check(buy != null and sheet.get_global_rect().encloses(buy.get_global_rect()) and root.get_visible_rect().encloses(buy.get_global_rect()), "material action stays inside sheet at " + str(window))
		keyed("material:MAT-002").pressed.emit()
		await frames()
		var selected_buy := keyed("buy:MAT-002")
		selected_buy.grab_focus()
		selected_buy.pressed.emit()
		await frames()
		check(keyed("buy:MAT-002").has_focus(), "selected material purchase preserves focus at " + str(window))
		for key in ["qty:minus","qty:plus","buy:MAT-002","sell:MAT-002"]:
			var action := keyed(key)
			check(root.get_visible_rect().encloses(action.get_global_rect()), "reachable " + key + " at " + str(window))
			var expected_width := 40.0 if key.begins_with("qty:") else 110.0
			check(action.size.x >= expected_width and action.size.y >= 36, "usable button bounds " + key + " at " + str(window))
			var font: Font = action.get_theme_font("font")
			var text_width := font.get_string_size(action.text, HORIZONTAL_ALIGNMENT_LEFT, -1, action.get_theme_font_size("font_size")).x
			check(action.size.x >= text_width + 8, "visible action text " + key + " at " + str(window))
		var tab := keyed("category:watches")
		if tab:
			tab.pressed.emit()
			await frames()
			if window == Vector2i(1440,900):
				check(sheet.size.y < 620, "desktop watch popup shrinks to content")
			var item: Dictionary = game.state.inventory[-1]
			var count: int = game.state.inventory.size()
			var cash: float = game.state.cash
			var selection := keyed("item:" + item.uid)
			check(selection != null, "physical watch selection available")
			if selection:
				selection.pressed.emit()
				await frames()
				check(game.state.inventory.size() == count and game.state.cash == cash, "watch selection never sells")
				var sale := keyed("sell-item:" + item.uid)
				check(sale != null and root.get_visible_rect().encloses(sale.get_global_rect()), "watch sale has a separate reachable action")
				if sale:
					var font: Font = sale.get_theme_font("font")
					var width := font.get_string_size(sale.text, HORIZONTAL_ALIGNMENT_LEFT, -1, sale.get_theme_font_size("font_size")).x
					check(sale.size.x >= maxf(200,width + 8) and sale.size.y >= 36, "watch sell label has usable button bounds")
				if sale and window == Vector2i(390,844):
					var ap: float = game.state.ap
					sale.pressed.emit()
					await frames()
					check(game.state.inventory.size() == count - 1 and game.state.cash > cash and game.state.ap == ap - 1, "explicit sale transfers selected UID exactly once")
				check(scrolls(shell.modal_layer) == 1, "watch grid has no nested scroll")
		if window == Vector2i(1440,900):
			var rare = game.state.trade.rare
			game.state.trade.rare = null
			keyed("category:rare").pressed.emit()
			await frames()
			check(sheet.size.y < 300, "empty rare category has a short popup")
			game.state.trade.rare = rare
		shell.close_top_modal()
		await frames()
	shell.queue_free()
	await frames()
	quit(1 if failures else 0)
