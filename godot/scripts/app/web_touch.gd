extends Node
## Accessible Web controls delegate to the desk and reducer; no second ruleset.
const Commerce = preload("res://scripts/model/commerce.gd")
var shell
var callback: JavaScriptObject
var place_callback: JavaScriptObject
var window: JavaScriptObject
var elapsed := 0.0
var last_json := ""
var opening_until := 0

func setup(owner_shell: Node) -> void:
	shell = owner_shell
	set_process(OS.has_feature("web"))
	if not OS.has_feature("web"):
		return
	window = JavaScriptBridge.get_interface("window")
	callback = JavaScriptBridge.create_callback(_receive)
	window.orbitalTouchSend = callback
	place_callback = JavaScriptBridge.create_callback(_place)
	window.orbitalTouchPlace = place_callback

func _exit_tree() -> void:
	if window != null:
		window.orbitalTouchSend = null
		window.orbitalTouchPlace = null

## A finger went down at this canvas position (CSS pixels). Answer at once
## where it should land, so a near miss still presses a small button.
func _place(args: Array) -> void:
	if args.size() < 2 or not is_instance_valid(shell):
		return
	var ratio := float(JavaScriptBridge.eval("devicePixelRatio || 1", true))
	var to_canvas: Transform2D = shell.get_viewport().get_screen_transform()
	var landed: Vector2 = to_canvas * shell.place_touch(to_canvas.affine_inverse() * (Vector2(float(args[0]), float(args[1])) * ratio)) / ratio
	window.orbitalPlacedX = landed.x
	window.orbitalPlacedY = landed.y

func _receive(args: Array) -> void:
	if args.is_empty() or not args[0] is String:
		return
	var data = JSON.parse_string(args[0])
	if data is Dictionary:
		command.call_deferred(data)

func _process(delta: float) -> void:
	elapsed += delta
	if elapsed < 0.15:
		return
	elapsed = 0.0
	var data := JSON.stringify(snapshot())
	if data != last_json:
		last_json = data
		JavaScriptBridge.eval("window.OrbitalTouch && window.OrbitalTouch.update(%s);" % data)

func snapshot() -> Dictionary:
	if not is_instance_valid(shell) or shell.page == null:
		return {"ready": false}
	var title_open: bool = is_instance_valid(shell.title) and not shell.title.is_queued_for_deletion()
	var active = shell.active_shell()
	var blocked: bool = shell.modal_open() or active.modal_open()
	var busy: bool = shell.page.busy or Time.get_ticks_msec() < opening_until
	for effect in shell.fx.get_children():
		if effect.get_meta("blocks_shop_input", false) and not effect.is_queued_for_deletion():
			busy = true
	var state := Game.state
	var trade = state.trade
	var lot = Model.trade_item(state) if trade != null else null
	var result := {"ready": true, "title": title_open, "has_save": Game.has_save,
		"cash": state.cash, "ap": state.ap, "day": state.day, "blocked": blocked,
		"busy": busy, "workspace": active.page_name if shell.workspace_open() else "",
		"trade": trade != null, "notice": state.get("notice", ""), "locked": false,
		"can_arrive": not title_open and not blocked and not busy and trade == null and
			NightCrime.can_arrive(state),
		"offer": shell.page.dial.value, "min": shell.page.dial.min_value, "max": shell.page.dial.max_value}
	# Only information printed on the owned paper is exposed to the companion.
	result.notice_owned = WantedCases.has_notice(state)
	result.notice_visible = bool(WantedCases.case_state(state).paper.visible)
	result.wanted_names = []
	if result.notice_owned:
		for id in WantedCases.case_state(state).wanted:
			result.wanted_names.append(WantedCases.profile(id).name)
	result.caught_count = WantedCases.case_state(state).caught.size()
	result.police_visit = trade != null and trade.kind == "police"
	if active.page_name == "inspect":
		var current = Game.item(active.page.it_uid)
		if current != null:
			var definition := GameData.def(current.defId)
			var details := [definition.description, Model.appraisal_text(current), "检验记录 %d 条 · 对照手册判断" % Model.evidence_count(current)]
			for evidence in current.evidence:
				details.append("%s：%s" % [Model.evidence_caption(current, evidence), Model.displayed_clue(current, evidence)])
			result.merge({"detail_title": definition.name, "detail_lines": details, "appraisal":Model.estimate(current),
				"inspection_tools": GameData.applicable_tools(current.defId),
				"inspection_current": active.page.tool, "inspection_uid": current.uid,
				"inspection_busy": is_instance_valid(active.page.item) and active.page.item.busy,
				"scale_stable": active.page.scale_stable,
				"scale_occupied": active.page.scale_occupied})
	elif active.page_name == "repair":
		result.merge(active.page.snapshot())
		var current = Game.item(active.page.it_uid)
		if current != null:
			result.merge({"detail_title":GameData.def(current.defId).name,
				"detail_lines":[active.page.repair_status(current),"修复完成，可重新鉴定。" if current.repaired else String(active.page.snapshot().get("repair_reason",""))]})
		var materials := []
		for material in GameData.materials:
			materials.append({"id":material.id,"name":material.name,"quantity":state.materials.get(material.id,0)})
		result.repair_materials = materials
	elif active.page_name == "warehouse":
		result.merge({"warehouse_uid": active.page.selected,
			"warehouse_rotated": active.page.selected_rotation(),
			"warehouse_rotation_pending": active.page.grid.prepared_uid == active.page.selected and active.page.selected != "",
			"warehouse_can_rotate": active.page.can_rotate_selected()})
	if active.page_name == "warehouse":
		var uid: String = active.page.selected
		var selected = Model.find_inventory(state, uid)
		if selected != null and selected.owner == "shop":
			result.merge({"forge_uid": uid, "forge_name": GameData.def(selected.defId).name,
				"forge_reason": Commerce.forgery_problem(state, selected), "forge_done": selected.has("forgery")})
	if trade != null:
		var buy: bool = trade.kind == "buy"
		var merchant: bool = trade.kind == "merchant"
		result.merge({"price": trade.price, "buy": buy, "locked": trade.locked,
			"item": GameData.def(lot.defId).name if lot != null else "请先在仓储选货",
			"visitor": GameData.npc(trade.npcId).name, "has_item": lot != null,
			"merchant": merchant,
			"projected_cash": state.cash + (-float(trade.price) if buy else float(trade.price)),
			"can_accept": lot != null and not trade.locked and state.ap >= 1 and (not buy or state.cash >= trade.price),
			"can_deliver": trade.locked and state.ap >= 1 and (not buy or state.cash >= trade.price)})
		if merchant:
			var goods := []
			for material in GameData.materials:
				goods.append({"id": material.id, "name": material.name, "price": material.price,
					"available": trade.stock.get(material.id, 0), "owned": state.materials.get(material.id, 0),
					"sellPrice": maxi(1, floori(float(material.price) * 0.5))})
			result.merchant_goods = goods
			var rare = trade.get("rare", null)
			result.merchant_rare = {"name": GameData.def(rare.defId).name, "price": rare.price} if rare is Dictionary and rare.get("available", false) else null
			var sellable := []
			for item in state.inventory:
				if item.owner == "shop" and not item.has("orderId") and not item.sealed and item.location != "isolation" and item.sourceVerified:
					sellable.append({"uid": item.uid, "name": GameData.def(item.defId).name,
						"price": Commerce.recovery_price(state, item)})
			result.merchant_items = sellable
	return result

func command(data: Dictionary) -> void:
	if not is_instance_valid(shell) or shell.page == null:
		return
	var kind = data.get("type", "")
	if not kind is String:
		return
	if kind == "locate":
		_locate(str(data.get("text", "")))
		return
	var status := snapshot()
	if kind == "close":
		var active = shell.active_shell()
		if active.modal_open():
			active.close_top_modal()
		elif shell.modal_open():
			shell.close_top_modal()
		elif shell.workspace_open():
			shell.close_workspace()
		return
	if status.blocked or status.busy:
		return
	if kind == "start":
		if status.title:
			opening_until = Time.get_ticks_msec() + (700 if Game.prefs.reduced_motion else 2300)
			shell._close_title()
			shell.shutter(int(Game.state.day))
		return
	if kind == "settings":
		shell.open_settings()
		return
	if status.title:
		return
	if kind == "page":
		var target = data.get("page", "")
		if target is String and target in ["counter", "inspect", "repair", "warehouse", "orders", "report"]:
			if target in ["inspect", "repair"] and not shell.workspace_open():
				shell.page._open_instrument(target)
			else:
				shell.go(target)
		return
	if kind == "manual":
		var active = shell.active_shell()
		var current = Game.workbench_item()
		active.open_watch_manual(current.defId if current != null else "")
		return
	if kind == "tool":
		var id = data.get("tool", "")
		var active = shell.active_shell()
		if active.page_name == "inspect" and id is String and (id == "" or GameData.tool_ids.has(id)):
			active.page._set_tool(id)
		return

	if kind == "finish_repair":
		var active = shell.active_shell()
		if active.page_name == "repair" and data.get("uid", "") == active.page.it_uid:
			active.page.confirm_repair()
		return
	if kind == "rotate_warehouse":
		var active = shell.active_shell()
		if active.page_name == "warehouse" and data.get("uid", "") == active.page.selected:
			active.page.rotate_selected()
		return
	if kind == "flip":
		var active = shell.active_shell()
		if active.page_name == "inspect" and active.page.item != null:
			active.page.flip_item()
		elif not shell.workspace_open() and shell.page.mat_item != null:
			shell.page.mat_item.flip()
		return
	if kind == "forge":
		var active = shell.active_shell()
		var uid = data.get("uid", null)
		if active.page_name == "warehouse" and uid is String and uid == active.page.selected:
			active.page._open_forgery(uid)
		elif active.page_name == "repair" and uid == active.page.it_uid:
			active.page.open_forgery(String(data.get("method","logo")))
		return
	# Native workspace and modal input boundaries apply to every trade command.
	if shell.workspace_open() or shell.page._scene_blocked():
		return
	var trade = Game.state.trade
	match kind:
		"arrive":
			if status.can_arrive:
				shell.page._ring()
		"quote":
			var value = data.get("value")
			if trade != null and not trade.locked and (value is int or value is float) and is_finite(float(value)):
				shell.page.dial.set_value(int(clampf(float(value), shell.page.dial.min_value, shell.page.dial.max_value)))
		"offer":
			if trade != null and not trade.locked:
				shell.page._offer()
		"accept":
			if status.get("can_accept", false):
				Game.dispatch({"type": "ACCEPT"})
		"deliver":
			if status.get("can_deliver", false):
				Game.dispatch({"type": "DELIVER", "tradeId": trade.id})
		"refuse":
			if trade != null:
				Game.dispatch({"type": "REFUSE"})
		"merchant_buy", "merchant_sell":
			var id = data.get("id", null)
			if trade != null and trade.kind == "merchant" and id is String:
				Game.dispatch({"type": "BUY_MATERIAL" if kind == "merchant_buy" else "SELL_MATERIAL", "id": id, "qty": 1})
		"merchant_rare":
			if trade != null and trade.kind == "merchant":
				Game.dispatch({"type": "BUY_RARE_ITEM"})
		"merchant_item":
			var uid = data.get("uid", null)
			if trade != null and trade.kind == "merchant" and uid is String:
				Game.dispatch({"type": "SELL_MERCHANT_ITEM", "uid": uid})

## Report where an on-screen button is, in CSS pixels, so browser checks can tap
## the real in-scene control instead of a separate Web overlay.
func _locate(text: String) -> void:
	var found: Button = null
	var stack: Array[Node] = [shell]
	while not stack.is_empty():
		var node: Node = stack.pop_front()
		for child in node.get_children():
			stack.append(child)
		if node is Button and text != "" and (node as Button).is_visible_in_tree():
			var b := node as Button
			if b.text == text or (found == null or found.text != text) and (b.text.contains(text) or b.tooltip_text.contains(text)):
				found = b
	var result := {"found": found != null, "text": text}
	if found != null:
		var ratio := float(JavaScriptBridge.eval("devicePixelRatio || 1", true))
		var xf := found.get_viewport().get_screen_transform() * found.get_global_transform_with_canvas()
		var center: Vector2 = xf * (found.size * 0.5)
		var corner: Vector2 = xf * found.size - xf * Vector2.ZERO
		result.merge({"x": center.x / ratio, "y": center.y / ratio, "width": absf(corner.x) / ratio,
			"height": absf(corner.y) / ratio, "disabled": found.disabled, "label": found.text})
	JavaScriptBridge.eval("window.__orbitalLocated = %s;" % JSON.stringify(result))
