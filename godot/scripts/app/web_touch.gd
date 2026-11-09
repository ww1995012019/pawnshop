extends Node
## Accessible Web controls delegate to the desk and reducer; no second ruleset.
const Commerce = preload("res://scripts/model/commerce.gd")
var shell
var callback: JavaScriptObject
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

func _exit_tree() -> void:
	if window != null:
		window.orbitalTouchSend = null

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
			state.phase == "open" and state.cursor < Model.daily_visit_limit() and (state.ap >= 1 or Commerce.merchant_due(state)),
		"offer": shell.page.dial.value, "min": shell.page.dial.min_value, "max": shell.page.dial.max_value}
	if active.page_name == "inspect":
		var current = Game.item(active.page.it_uid)
		if current != null:
			var profile := GameData.inspection_profile(current.defId)
			var definition := GameData.def(current.defId)
			var description: String = profile.get("description", definition.description)
			if description.contains("→"):
				description = description.split("。")[0] + "。"
			var estimate := Model.estimate(current)
			var details := ["品相 %s · 物证 %d 条" % [UIKit.pct(current.condition), Model.evidence_count(current)], description,
				"参考估值：%s" % (UIKit.money(estimate.low) if estimate.exact else "%s–%s Cr" % [Model.jnum(estimate.low), Model.jnum(estimate.high)])]
			for evidence in current.evidence:
				details.append("%s：%s" % [Model.evidence_caption(current, evidence), Model.displayed_clue(current, evidence)])
			var step: int = active.page.specific_step
			var steps: Array = profile.get("steps", [])
			var can_pay: bool = current.inspectedPaid or state.upgrades.lamp or Model.has_ap(state, 1.0)
			var needs_ap: bool = step == steps.size() - 1 and not can_pay
			var status_text: String = active.page.specific_status.text if is_instance_valid(active.page.specific_status) else ""
			result.merge({"detail_title": definition.name, "detail_lines": details,
				"inspection_tools": GameData.applicable_tools(current.defId),
				"inspection_title": profile.get("title", "专属检测"),
				"inspection_current": active.page.tool,
				"inspection_busy": is_instance_valid(active.page.item) and active.page.item.busy,
				"specific_uid": current.uid, "specific_index": step,
				"specific_allowed": not needs_ap and not active.page.specific_running,
				"specific_reason": "行动点不足" if needs_ap else "",
				"specific_feedback": status_text,
				"specific_next": steps[step] if active.page.tool == "SPEC" and step < steps.size() else ""})
	elif active.page_name == "repair":
		var materials := []
		for material in GameData.materials:
			materials.append({"id": material.id, "name": material.name,
				"quantity": state.materials.get(material.id, 0)})
		var current = Game.item(active.page.it_uid)
		var title := "维修工作台"
		var details := ["请选择一件待修物品。"]
		var can_finish := false
		if current != null:
			title = GameData.def(current.defId).name
			details = [active.page.repair_status(current)]
			var recipe: Dictionary = active.page._recipe(current)
			if not recipe.is_empty():
				var progress := int(state.repairProgress.get(current.uid, 0))
				if current.repaired:
					details.append("修复完成，可重新鉴定。")
				else:
					var reason: String = active.page._repair_block(current, recipe)
					if reason != "":
						details.append(reason)
					can_finish = progress == 3 and reason == ""
				details.append(recipe.name)
				for i in 3:
					details.append(("✓ " if i < progress else "· ") + String(recipe.steps[i]))
				if not current.repaired:
					var needed := []
					for id in recipe.materials:
						needed.append("%s ×%s（有 %s）" % [GameData.material(id).name, Model.jnum(recipe.materials[id]), Model.jnum(state.materials.get(id, 0))])
					details.append("材料：" + "、".join(needed))
					details.append("确认时消耗 %s AP" % Model.jnum(recipe.ap))
		result.merge({"detail_title": title, "detail_lines": details, "repair_can_finish": can_finish,
			"repair_uid": active.page.it_uid, "repair_materials": materials})
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
						"price": maxf(1, floor(Model.item_value(item) * 0.6))})
			result.merchant_items = sellable
	return result

func command(data: Dictionary) -> void:
	if not is_instance_valid(shell) or shell.page == null:
		return
	var kind = data.get("type", "")
	if not kind is String:
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
	if kind == "tool":
		var id = data.get("tool", "")
		var active = shell.active_shell()
		if active.page_name == "inspect" and id is String and (id == "" or GameData.tool_ids.has(id)):
			active.page._set_tool(id)
		return
	if kind == "specific_step":
		var active = shell.active_shell()
		var index = data.get("index", null)
		if active.page_name == "inspect" and active.page.tool == "SPEC" and data.get("uid", "") == active.page.it_uid and (index is int or index is float) and is_finite(float(index)) and float(index) == floor(float(index)):
			active.page._advance_specific(int(index))
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
			Game.dispatch({"type": "FORGE", "uid": uid})
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
