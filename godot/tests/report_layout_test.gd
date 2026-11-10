extends SceneTree
## The ledger should use its drawer and keep amounts clear of its scroll rail.
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	print("LEDGER LAYOUT ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func settle() -> void:
	for i in 10: await process_frame
func all_text(node: Node) -> String:
	var result := ""
	for label in node.find_children("*", "Label", true, false): result += label.text + "\n"
	return result
func run() -> void:
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	game.new_game("LEDGER-LAYOUT")
	var costs = load("res://scripts/model/store_costs.gd")
	check(costs.has_method("usage_quote"), "shared upcoming usage quote exists")
	if costs.has_method("usage_quote"):
		var preview := Model.create("USAGE-PREVIEW")
		check(costs.usage_quote(preview,"uv",0.5) == 0.5, "normal next-use quote is half a credit")
		for device in preview.storeCosts.devices:
			if device.type == "uv": device.status = "maintenance"
		check(costs.usage_quote(preview,"uv",0.5) == 0.6, "maintenance next-use quote includes the shared multiplier")
		costs.record(preview,"uv","preview-match",0.5)
		check(costs.quote(preview).details.usage[0].cents == 60, "upcoming quote equals recorded use")
		for device in preview.storeCosts.devices:
			if device.type == "uv": device.status = "broken"
		check(costs.usage_quote(preview,"uv",0.5) == 0, "unavailable device has no payable usage preview")
		preview.storeCosts.fromDay = 2
		check(costs.usage_quote(preview,"scale",0.5) == 0, "legacy day does not promise new usage charges")
	for i in 40:
		game.state.ledger.append({"id": "layout-%d" % i, "day": 1, "kind": "purchase", "label": "收购 星冕 X06 典藏", "amount": -12345 - i, "cost": 0})
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await settle()
	shell._close_title()
	shell.toast("离开柜台前的旧提示")
	shell.go("report")
	await settle()
	var active = shell.active_shell()
	var page = active.page
	check(shell.toast_box.get_child_count() == 0, "entering report clears stale global notices")
	check(all_text(page).contains("预计电费") and all_text(page).contains("固定清洁费") and all_text(page).contains("支付后现金"), "forecast names electricity, cleaning and cash after fees")
	var breakdown: Button = page.find_child("electricity_details_toggle", true, false)
	check(breakdown != null, "electricity detail has a touch-accessible expand button")
	if breakdown != null:
		breakdown.pressed.emit()
		await settle()
		check(all_text(page).contains("店面基础照明组") and all_text(page).contains("正常"), "expanded detail names device quantity and status")
		breakdown.pressed.emit()
		await settle()
	game.dispatch({"type":"SETTLE"})
	await settle()
	check(active.toast_box.get_child_count() == 0, "settlement does not create a global overlay")
	check(all_text(page).contains("日结完成") and all_text(page).contains("店铺电费") and all_text(page).contains("店铺清洁费"), "settled receipt and inline result show new fees")
	shell.workspace_container.stretch = false
	for logical_size in [Vector2(1600, 900), Vector2(1600, 600), Vector2(1160, 600), Vector2(600, 900)]:
		var viewport: SubViewport = active.get_viewport()
		viewport.size_2d_override = Vector2i(logical_size)
		viewport.size = Vector2i(logical_size)
		await settle()
		page.relayout()
		await settle()
		var totals_grid: GridContainer = page.totals_panel.find_children("*", "GridContainer", true, false)[0]
		for index in range(0, totals_grid.get_child_count(), 2):
			check(totals_grid.get_child(index).size.x >= 140, "fee captions retain a readable column instead of one-character wrapping")
		var area: Rect2 = active.content_rect()
		check(area.encloses(page.sheet.get_rect()), "ledger stays inside drawer at " + str(logical_size))
		check(page.sheet.size.x >= area.size.x * 0.95 and page.sheet.size.y >= area.size.y * 0.95, "ledger uses available drawer area at " + str(logical_size))
		var scroll: ScrollContainer = page.body.find_children("*", "ScrollContainer", true, false)[0]
		check(scroll.get_v_scroll_bar().visible, "long ledger can scroll")
		var amount: Label = scroll.find_children("*", "HBoxContainer", true, false)[0].get_child(1)
		var gap := scroll.get_v_scroll_bar().get_global_rect().position.x - amount.get_global_rect().end.x
		check(gap >= 20, "amount has at least 20px before scroll rail (got %.1f)" % gap)
		if logical_size.y == 900 and logical_size.x >= 880:
			check(scroll.size.y >= 400, "desktop ledger displays more than a short fixed-height strip")
		page.find_child("electricity_details_toggle", true, false).pressed.emit()
		active.toast("日结完成：电费 14 Cr，清洁费 8 Cr，租金 0 Cr；本次支付 22 Cr。".repeat(3))
		await settle()
		var status: Label = page.find_child("report_status", true, false)
		check(status != null and status.is_visible_in_tree(), "report keeps inline status visible at " + str(logical_size))
		var controls: Array = page.find_children("*", "Button", true, false)
		for button in controls:
			if button.text.begins_with("迎接第"):
				for notice in active.toast_box.get_children():
					check(not button.get_global_rect().intersects(notice.get_global_rect()), "notice never overlaps next-day button at " + str(logical_size))
				if status != null:
					check(not button.get_global_rect().intersects(status.get_global_rect()), "inline status stays clear of next-day button at " + str(logical_size))
		if status != null:
			check(page.sheet.get_global_rect().size.x >= status.get_global_rect().size.x, "wrapped status fits ledger width")
		var before: Dictionary = game.state.duplicate(true)
		scroll.scroll_vertical = 100
		await settle()
		check(game.state == before, "scrolling does not change transactions or settlement")
		var outer: ScrollContainer = page.sheet.get_child(0)
		outer.scroll_vertical = 10000
		await settle()
		for button in controls:
			if button.text.begins_with("迎接第") and status != null:
				check(not button.get_global_rect().intersects(status.get_global_rect()), "scrolled expanded receipt keeps status clear of next-day button")
		page.find_child("electricity_details_toggle", true, false).pressed.emit()
		outer.scroll_vertical = 0
		await settle()
	game.state.day = 3
	game.state.report.day = 3
	page._refresh()
	await settle()
	for logical_size in [Vector2i(1600,900),Vector2i(1600,600),Vector2i(1160,600),Vector2i(600,900)]:
		active.get_viewport().size_2d_override = logical_size
		active.get_viewport().size = logical_size
		page.relayout()
		await settle()
		var status: Label = page.find_child("report_status", true, false)
		check(active.content_rect().encloses(page.sheet.get_rect()), "day-three upgrade cards stay in the drawer at " + str(logical_size))
		for button in page.find_children("*", "Button", true, false):
			check(not status.get_global_rect().intersects(button.get_global_rect()), "day-three status stays clear of upgrade and next-day controls")
	check(all_text(page).contains("次日起用电 +1 Cr/日"), "work lamp discloses ongoing fee and next-day activation")
	# Historical reports have no immutable costs snapshot; their 20 Cr remains legacy.
	game.state.report.erase("costs")
	game.state.report.maintenance = 20
	page._refresh()
	await settle()
	check(all_text(page).contains("旧版能源维护"), "historical maintenance stays explicitly legacy")
	game.state = Model.create("POWERED-UI")
	var owned: Dictionary = game.state.inventory[0]
	for key in game.state.materials: game.state.materials[key] = 100
	for device in game.state.storeCosts.devices:
		if device.type in ["uv", "scale", "repair_tester"]: device.status = "broken"
	shell.go("inspect", owned.uid)
	await settle()
	page = shell.active_shell().page
	check(page.tool_buttons["TOL-002"].disabled and page.tool_buttons["TOL-005"].disabled and not page.tool_buttons["TOL-001"].disabled, "stopped UV/scale disable tool selectors while manual lens stays available")
	page._set_tool("TOL-001")
	check(not all_text(page).contains("本次预计电费 +"), "manual lens does not promise a powered use charge")
	page._set_tool("")
	page._set_tool("TOL-002")
	check(page.tool == "", "keyboard-equivalent selection cannot activate stopped UV")
	check(all_text(page).contains("停机维修"), "inspection shows equipment outage reason without hover")
	for device in game.state.storeCosts.devices:
		if device.type == "uv": device.status = "maintenance"
	page._refresh_info()
	page._set_tool("TOL-002")
	check(all_text(page).contains("本次预计电费 +0.6 Cr"), "active UV shows upcoming use cost including maintenance")
	var before_frames: Dictionary = game.state.duplicate(true)
	for i in 4: page._process(0.01)
	check(game.state == before_frames, "cost preview refreshes never record metered use")
	for device in game.state.storeCosts.devices:
		if device.type == "uv": device.status = "broken"
	shell.go("repair", owned.uid)
	await settle()
	page = shell.active_shell().page
	page.open_forgery("serial")
	await settle()
	check(page.action_button.disabled and page.art.interaction_targets().is_empty() and page.instruction.text.contains("停机维修"), "powered serial forging disables button and physical targets with reason")
	page.open_forgery("weight")
	await settle()
	check(page.action_button.disabled and page.art.interaction_targets().is_empty(), "powered weight forging disables physical targets")
	page.open_forgery("logo")
	await settle()
	check(not page.action_button.disabled and not page.art.interaction_targets().is_empty(), "manual logo operation remains available")
	check(not page.instruction.text.contains("本次预计电费 +"), "manual forgery does not display powered stage fee")
	owned = game.item(owned.uid)
	owned.service.tasks = ["test"]
	owned.service.done = []
	page.open_service()
	await settle()
	check(page.task == "test" and page.action_button.disabled and page.art.interaction_targets().is_empty(), "stopped tester disables repair stage and physical targets")
	# The same availability policy applies to the quote, order and scan terminals.
	shell.close_workspace()
	game.state = Model.create("ORBITAL-P0")
	game.state = Model.reduce(game.state, {"type":"ARRIVE"})
	for device in game.state.storeCosts.devices:
		if device.type == "quote_terminal": device.status = "broken"
	shell.go("counter")
	await settle()
	page = shell.page
	check(page.offer_button.disabled and not page.dial.enabled, "stopped quote terminal disables offer and price dial")
	var accept_disabled := false
	for button in page.actions.get_children():
		if button.text.begins_with("接受 "): accept_disabled = button.disabled
	check(accept_disabled and page.scr.line3.text.contains("停机维修"), "stopped quote terminal disables acceptance and displays reason")
	game.state.trade = null
	for device in game.state.storeCosts.devices:
		if device.type == "scanner": device.status = "broken"
	shell.go("warehouse", game.state.inventory[0].uid)
	await settle()
	page = shell.active_shell().page
	var prices_disabled := true
	var scan_disabled := false
	for button in page.detail.find_children("*", "Button", true, false):
		if button.text.begins_with("挂牌 "): prices_disabled = prices_disabled and button.disabled
		if button.text == "安检扫描": scan_disabled = button.disabled
	check(prices_disabled and scan_disabled and all_text(page).contains("停机维修"), "stopped quote/scanner devices disable listing and scanning with visible reasons")
	game.state = Model.create("ORBITAL-P0")
	game.dispatch({"type":"TAKE_ORDER", "id":Model.available_orders(game.state)[0].id})
	var commission: Dictionary = game.state.orders[0]
	var original = game.item(commission.get("uid", ""))
	original.condition = 1.0
	original.working = true
	original.repaired = true
	original.evidence = ["TOL-001", "TOL-002"]
	for device in game.state.storeCosts.devices:
		if device.type == "order_terminal": device.status = "broken"
	shell.go("orders")
	await settle()
	page = shell.active_shell().page
	var take_disabled := false
	var deliver_disabled := false
	for button in page.find_children("*", "Button", true, false):
		if button.text == "接取订单": take_disabled = button.disabled
		if button.text == "交付（1 AP）": deliver_disabled = button.disabled
	check(take_disabled and deliver_disabled and all_text(page).contains("停机维修"), "stopped order terminal disables acceptance and qualified delivery with visible reason")
	shell.queue_free()
	await settle()
	for player in root.find_children("*", "AudioStreamPlayer", true, false):
		player.stop()
		player.stream = null
	await process_frame
	print("LEDGER LAYOUT failures=", failures)
	quit(1 if failures else 0)
