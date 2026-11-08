extends Node
## Accessible Web controls delegate to the desk and reducer; no second ruleset.
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
			state.phase == "open" and state.cursor < Model.daily_visit_limit() and state.ap >= 1,
		"offer": shell.page.dial.value, "min": shell.page.dial.min_value, "max": shell.page.dial.max_value}
	if trade != null:
		var buy: bool = trade.kind == "buy"
		result.merge({"price": trade.price, "buy": buy, "locked": trade.locked,
			"item": GameData.def(lot.defId).name if lot != null else "请先在仓储选货",
			"visitor": GameData.npc(trade.npcId).name, "has_item": lot != null,
			"projected_cash": state.cash + (-float(trade.price) if buy else float(trade.price)),
			"can_accept": lot != null and not trade.locked and state.ap >= 1 and (not buy or state.cash >= trade.price),
			"can_deliver": trade.locked and state.ap >= 1 and (not buy or state.cash >= trade.price)})
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
		if active.page_name == "inspect" and id is String and GameData.tool_ids.has(id):
			active.page._set_tool(id)
		return
	if kind == "flip":
		var active = shell.active_shell()
		if active.page_name == "inspect" and active.page.item != null:
			active.page.item.flip()
		elif not shell.workspace_open() and shell.page.mat_item != null:
			shell.page.mat_item.flip()
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
