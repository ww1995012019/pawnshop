extends SceneTree
## The HTML controls must obey the same price and input boundaries as the desk.
var failures := 0
var shell
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	print("TOUCH ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func frame() -> void:
	await process_frame
	await process_frame
func grid_drag(grid, from: Vector2, to: Vector2) -> void:
	var down := InputEventMouseButton.new()
	down.button_index = MOUSE_BUTTON_LEFT
	down.pressed = true
	down.position = from
	grid._gui_input(down)
	var move := InputEventMouseMotion.new()
	move.position = to
	grid._gui_input(move)
	var up := InputEventMouseButton.new()
	up.button_index = MOUSE_BUTTON_LEFT
	up.pressed = false
	up.position = to
	grid._gui_input(up)
func run() -> void:
	if not ResourceLoader.exists("res://scripts/app/web_touch.gd"):
		check(false, "touch commands are available")
		quit(1)
		return
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frame()
	shell._close_title()
	game.new_game("ORBITAL-P0")
	game.state = Model.reduce(game.state, {"type":"ARRIVE"})
	shell.go("counter")
	await frame()
	var bridge = load("res://scripts/app/web_touch.gd").new()
	shell.add_child(bridge)
	bridge.setup(shell)
	var status: Dictionary = bridge.snapshot()
	var visitor_price: int = game.state.trade.price
	var initial_cash: int = game.state.cash
	check(status.price == visitor_price and status.offer == int(visitor_price * 0.8), "visitor price and draft remain distinct")
	check(status.projected_cash == initial_cash - visitor_price, "touch display projects actual purchase price")
	var before: Dictionary = game.state.duplicate(true)
	bridge.command({"type":"quote", "value":145})
	check(shell.page.dial.value == 145 and game.state == before, "editing a draft does not submit an offer or spend money")
	bridge.command({"type":"quote", "value":"invalid"})
	bridge.command({"type":"unknown"})
	check(shell.page.dial.value == 145 and game.state == before, "malformed and unknown commands do nothing")
	var visitor_uid: String = game.state.trade.item.uid
	var stock_uid: String = game.state.inventory[0].uid
	game.focus_uid = stock_uid
	bridge.command({"type":"page", "page":"inspect"})
	await frame()
	check(shell.workspace_shell.page.it_uid == visitor_uid, "counter touch inspection opens the visitor lot rather than stale stock focus")
	shell.go("warehouse", stock_uid)
	await frame()
	bridge.command({"type":"page", "page":"inspect"})
	await frame()
	check(shell.workspace_shell.page.it_uid == stock_uid, "switching an existing workspace preserves deliberate stock selection")
	var inspection = shell.workspace_shell.page
	var inspection_before: Dictionary = game.state.duplicate(true)
	bridge.command({"type":"tool", "tool":"TOL-003"})
	bridge.command({"type":"specific_step", "uid":stock_uid, "index":0})
	check(inspection.tool == "" and game.state == inspection_before, "removed tool and legacy inspection commands cannot reveal evidence or spend AP")
	for id in ["TOL-001", "TOL-002", "TOL-005"]:
		bridge.command({"type":"tool", "tool":id})
		check(inspection.tool == id and bridge.snapshot().inspection_current == id, "touch selects supported physical tool " + id)
	check(bridge.snapshot().inspection_tools == ["TOL-001", "TOL-002", "TOL-005"], "phone exposes exactly the three watch tools")
	bridge.command({"type":"tool", "tool":""})
	check(shell.workspace_shell.page.tool == "", "touch can deselect a tool and return to moving the item")
	bridge.command({"type":"accept"})
	check(not game.state.trade.locked, "equipment drawer blocks background trade commands")
	shell.close_workspace()
	await frame()
	bridge.command({"type":"accept"})
	check(game.state.trade.locked and game.state.cash == initial_cash, "accept locks the actual visitor offer without paying the draft")
	var popup: Array = shell.modal("核对", 420)
	await frame()
	bridge.command({"type":"deliver"})
	check(game.state.cash == initial_cash and game.state.trade != null, "native modal prevents touch delivery")
	popup[1].call()
	await frame()
	bridge.command({"type":"deliver"})
	await frame()
	check(game.state.cash == initial_cash - visitor_price and game.state.trade == null, "touch delivery uses the reducer's atomic transfer")
	game.new_game("ORBITAL-P0")
	var repair_uid: String = game.state.inventory[0].uid
	shell.go("repair", repair_uid)
	await frame()
	var repair_state: Dictionary = bridge.snapshot()
	check(repair_state.get("repair_uid", "") == repair_uid and repair_state.get("repair_materials", []).size() == GameData.materials.size(), "phone repair controls describe the selected item and current supplies")
	check(repair_state.get("detail_title", "") == GameData.def(game.item(repair_uid).defId).name and not repair_state.get("detail_lines", []).is_empty(), "phone can show the selected repair details at readable size")
	var undiscovered := "\n".join(repair_state.get("detail_lines", []))
	check(undiscovered.contains("尚无检验记录") and not undiscovered.contains(Model.fault_label(game.item(repair_uid))), "repair details do not reveal a fault before any evidence is recorded")
	check(String(repair_state.detail_lines[1]).contains("先去鉴定"), "phone shows the reason repair is blocked before the recipe steps")
	var cash_before: float = game.state.cash
	var ap_before: float = game.state.ap
	var quantity_before: float = game.state.materials.get("MAT-001", 0)
	bridge.command({"type":"buy_repair_material", "uid":"stale-item", "id":"MAT-001"})
	bridge.command({"type":"buy_repair_material", "uid":repair_uid, "id":"not-a-material"})
	bridge.command({"type":"buy_repair_material", "uid":repair_uid, "id":"MAT-001"})
	check(game.state.cash == cash_before and game.state.ap == ap_before and game.state.materials.get("MAT-001", 0) == quantity_before, "repair shortcuts cannot buy supplies without a visiting merchant")
	check(repair_state.repair_materials[0].quantity == quantity_before and not repair_state.repair_materials[0].has("available"), "repair shows inventory without a purchase action")
	game.state.cash = 0
	bridge.command({"type":"buy_repair_material", "uid":repair_uid, "id":"MAT-001"})
	check(game.state.cash == 0 and game.state.materials.get("MAT-001", 0) == quantity_before, "a direct repair shortcut cannot add supplies")
	game.state.cash = 100
	var repair_modal: Array = shell.active_shell().modal("确认操作", 420)
	await frame()
	bridge.command({"type":"finish_repair", "uid":repair_uid})
	check(not game.item(repair_uid).repaired, "native modal blocks phone repair actions")
	repair_modal[1].call()
	await frame()
	game.item(repair_uid).evidence.append("TOL-001")
	game.state.repairProgress[repair_uid] = 3
	var recipe: Dictionary = shell.active_shell().page._recipe(game.item(repair_uid))
	for id in recipe.materials:
		game.state.materials[id] = maxi(game.state.materials.get(id, 0), int(recipe.materials[id]))
	var visual_only := "\n".join(bridge.snapshot().get("detail_lines", []))
	check(visual_only.contains(Model.displayed_clue(game.item(repair_uid), "TOL-001")) and not visual_only.contains(Model.fault_label(game.item(repair_uid))), "repair shows only the recorded visual evidence, without revealing an untested fault")
	game.state.phase = "report"
	var closed_state: Dictionary = bridge.snapshot()
	check(not closed_state.get("repair_can_finish", true), "phone disables repair outside business hours")
	bridge.command({"type":"finish_repair", "uid":repair_uid})
	check(not game.item(repair_uid).repaired, "phone cannot repair after business closes")
	game.state.phase = "open"
	check(bridge.snapshot().get("repair_can_finish", false), "phone enables repair only when its actual prerequisites are satisfied")
	bridge.command({"type":"finish_repair", "uid":"stale-item"})
	check(not game.item(repair_uid).repaired, "stale phone repair cannot affect a different item")
	bridge.command({"type":"finish_repair", "uid":repair_uid})
	check(game.item(repair_uid).repaired and game.state.ap == ap_before - 1, "phone confirmation uses the normal repair reducer")
	var completed_detail := "\n".join(bridge.snapshot().get("detail_lines", []))
	check(completed_detail.contains("修复完成") and not completed_detail.contains("不足") and not completed_detail.contains("确认时消耗"), "a completed repair shows success instead of asking for more supplies")
	check(String(bridge.snapshot().detail_lines[1]).contains("修复完成"), "phone shows successful repair before the recipe steps")
	ap_before = game.state.ap
	game.item(repair_uid).x = 5
	game.item(repair_uid).y = 3
	shell.go("warehouse", repair_uid)
	await frame()
	var warehouse_state: Dictionary = bridge.snapshot()
	check(warehouse_state.get("warehouse_uid", "") == repair_uid and warehouse_state.get("warehouse_can_rotate", false), "phone exposes rotation for a selected item with space")
	bridge.command({"type":"rotate_warehouse", "uid":"stale-item"})
	check(not game.item(repair_uid).rotated, "stale phone rotation cannot change a different item")
	bridge.command({"type":"rotate_warehouse", "uid":repair_uid})
	check(game.item(repair_uid).rotated and game.item(repair_uid).x == 5 and game.item(repair_uid).y == 3 and game.state.ap == ap_before, "phone rotates the selected stock in place without spending AP")
	game.state.phase = "report"
	check(not bridge.snapshot().get("warehouse_can_rotate", true), "phone disables stock rotation outside business hours")
	game.state.phase = "open"
	game.item(repair_uid).sealed = true
	check(not bridge.snapshot().get("warehouse_can_rotate", true), "phone disables rotation of sealed stock")
	bridge.command({"type":"rotate_warehouse", "uid":repair_uid})
	check(game.item(repair_uid).rotated, "sealed stock cannot be rotated by a direct phone command")
	game.new_game("ORBITAL-P0")
	game.state.inventory.clear()
	var long_item := Model.new_item(game.state, "WCH-001", {"x": 0, "y": 0})
	game.state.inventory.append(long_item)
	# Tile watches vertically, leaving the source and a horizontal destination.
	for y in [0, 2, 4]:
		for x in 10:
			if (x == 0 and y == 0) or (y == 4 and x in [5, 6]):
				continue
			game.state.inventory.append(Model.new_item(game.state, "WCH-015", {"x": x, "y": y}))
	game.state.inventory.append(Model.new_item(game.state, "WCH-015", {"x": 5, "y": 4, "rotated": true}))

	shell.go("warehouse", long_item.uid)
	await frame()
	check(not Model.can_place(game.state, long_item.uid, 0, 0, true) and Model.can_place(game.state, long_item.uid, 5, 5, true), "full warehouse has room only for the rotated item at a different position")
	bridge.command({"type":"rotate_warehouse", "uid":long_item.uid})
	var prepared: Dictionary = bridge.snapshot()
	check(prepared.get("warehouse_rotation_pending", false) and prepared.get("warehouse_rotated", false) and not game.item(long_item.uid).rotated, "phone can prepare a rotated shape before moving it to another space")
	bridge.command({"type":"rotate_warehouse", "uid":long_item.uid})
	check(not bridge.snapshot().get("warehouse_rotation_pending", true) and not game.item(long_item.uid).rotated, "a second rotation cancels the prepared direction")
	bridge.command({"type":"rotate_warehouse", "uid":long_item.uid})
	var warehouse = shell.active_shell().page
	warehouse.select(game.state.inventory[1].uid)
	check(not bridge.snapshot().get("warehouse_rotation_pending", true) and not game.item(long_item.uid).rotated, "selecting a different item cancels the prepared rotation")
	warehouse.select(long_item.uid)
	bridge.command({"type":"rotate_warehouse", "uid":long_item.uid})
	var grid = warehouse.grid
	grid_drag(grid, Vector2(36, 36), Vector2(108, 36))
	check(not game.item(long_item.uid).rotated and bridge.snapshot().get("warehouse_rotation_pending", false), "an invalid drop preserves the item and prepared direction")
	grid_drag(grid, Vector2(36, 36), Vector2(396, 396))
	var placed = game.item(long_item.uid)
	check(placed.rotated and placed.x == 5 and placed.y == 5, "drag commits the prepared rotation and new position together")
	check(not bridge.snapshot().get("warehouse_rotation_pending", true), "a successful drop clears the prepared rotation")
	print("TOUCH failures=", failures)
	shell.queue_free()
	await frame()
	quit(1 if failures else 0)
