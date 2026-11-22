extends SceneTree
## Exercise the real drawers at the released desktop and landscape phone sizes.

var failures := 0

func _initialize() -> void:
	call_deferred("run")

func frames() -> void:
	for i in 12:
		await process_frame

func check(value: bool, message: String) -> void:
	print("MANAGEMENT ", "PASS " if value else "FAIL ", message)
	if not value:
		failures += 1

func button(root_node: Node, caption: String) -> Button:
	for control in root_node.find_children("*", "Button", true, false):
		if control.is_visible_in_tree() and control.text.contains(caption):
			return control
	return null

func labels(root_node: Node) -> String:
	var result := ""
	for label in root_node.find_children("*", "Label", true, false):
		if label.is_visible_in_tree():
			result += label.text + "\n"
	return result

func run() -> void:
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	for dimensions in [Vector2i(1280, 800), Vector2i(568, 320), Vector2i(844, 390)]:
		root.size = dimensions
		var mobile: bool = dimensions.x < 1000
		game.new_game("MANAGEMENT", "story90")
		var shell = load("res://main.tscn").instantiate()
		shell.phone_override = mobile
		root.add_child(shell)
		await frames()
		shell._close_title()
		await frames()
		var orders: Array = Model.available_orders(game.state)
		game.dispatch({"type": "TAKE_ORDER", "id": orders[0].id})
		await frames()
		if not mobile:
			var desk = shell.page.strict_view
			check(desk.order_count.text.contains("可接 3") and desk.order_count.text.contains("进行中 1"), "counter distinguishes available and active jobs")
			check(desk.stock_count.text.contains("自有 6") and desk.stock_count.text.contains("受托 1"), "counter distinguishes shop stock and held originals")
			var order_entry: Button = desk.find_child("StrictOrders", true, false)
			check(order_entry.accessibility_name == "委托订单 · " + desk.order_count.text, "commission entry announces its current counts")
			var stock_entry: Button = desk.find_child("StrictStockEntry", true, false)
			check(stock_entry != null and stock_entry.accessibility_name.contains(desk.stock_count.text), "stock entry announces current ownership counts")
		shell.go("warehouse")
		await frames()
		var warehouse = shell.active_shell().page
		var original: Dictionary = game.state.inventory[0]
		if mobile:
			var picker: Button = warehouse.find_child("warehouse_pick_" + original.uid, true, false)
			var adjacent: Button = warehouse.find_child("warehouse_pick_" + game.state.inventory[1].uid, true, false)
			check(picker != null and adjacent != null and picker.is_visible_in_tree() and picker.size.y >= 44 and adjacent.size.y >= 44, "%s has named finger-sized rows for adjacent originals" % dimensions)
			if adjacent != null:
				adjacent.pressed.emit()
				await frames()
				check(warehouse.selected == game.state.inventory[1].uid, "picking a row selects that precise original")
		warehouse.select(original.uid)
		await frames()
		warehouse.switch_cabinet("isolation")
		await frames()
		check(warehouse.selected == "" and button(warehouse.detail, "去鉴定") == null, "empty cabinet clears previous watch actions")
		warehouse.switch_cabinet("warehouse")
		warehouse.select(original.uid)
		game.dispatch({"type":"MOVE", "uid":original.uid, "x":7, "y":3, "rotated":true})
		await frames()
		if not mobile:
			var tile = warehouse.grid.tiles[original.uid]
			var picture: TextureRect = tile.find_child("StockImage", true, false)
			check(labels(warehouse.detail).contains("占格 2×1"), "desktop receipt uses the saved dimensions after a move")
			check(picture != null and is_equal_approx(absf(picture.rotation), PI / 2), "watch picture turns with its horizontal footprint")
		shell.close_workspace()
		await frames()
		shell.go("report")
		await frames()
		var report = shell.active_shell().page
		var summary := labels(report.footer)
		check(summary.contains("16 Cr") and summary.contains("1184 Cr") and summary.contains("6 位") and summary.contains("12 AP"), "%s anchored closing summary has charge, balance, remaining visitors and AP" % dimensions)
		var close := button(report.footer, "打烊")
		if close != null:
			close.pressed.emit()
			await frames()
		var confirm := button(shell, "确认提前打烊")
		check(confirm != null and game.state.phase == "open" and game.state.cash == 1200, "early closing waits for consent without charging")
		if confirm != null:
			button(shell, "取消").pressed.emit()
			await frames()
			check(game.state.phase == "open" and game.state.cash == 1200, "cancel leaves the day playable")
			button(report.footer, "打烊").pressed.emit()
			await frames()
			button(shell, "确认提前打烊").pressed.emit()
			await frames()
		check(game.state.phase == "report" and game.state.cash == 1184, "confirmed close charges once")
		var closing_ledger: Array = game.state.ledger.duplicate(true)
		shell.close_workspace()
		await frames()
		shell.go("warehouse", original.uid)
		await frames()
		warehouse = shell.active_shell().page
		if not mobile: warehouse.open_item_menu(original.uid, warehouse.grid.get_global_rect().get_center())
		await frames()
		var source = warehouse.detail if mobile else warehouse.item_menu
		var reprice := button(source, "挂牌 +10")
		check(reprice != null and reprice.disabled, "closed shop exposes read-only stock")
		shell.close_workspace()
		await frames()
		shell.go("report")
		await frames()
		report = shell.active_shell().page
		check(button(report.footer, "打烊结算") == null and game.state.ledger == closing_ledger, "reopening the settled bill never charges twice")
		var next := button(report.footer, "迎接第 2 天")
		if next != null:
			next.pressed.emit()
			await frames()
		check(game.state.day == 2 and game.state.phase == "open" and game.state.cash == 1184, "next day preserves the settled balance")
		game.state.cursor = Model.daily_visit_limit(game.state)
		shell.go("report")
		await frames()
		button(shell.active_shell().page.footer, "打烊结算").pressed.emit()
		await frames()
		check(game.state.phase == "report" and not shell.modal_open(), "closing after the last visitor goes straight to the receipt")
		shell.queue_free()
		await frames()
	print("MANAGEMENT failures=", failures)
	quit(1 if failures else 0)
