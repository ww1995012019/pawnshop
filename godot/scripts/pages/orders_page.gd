extends Page
## Orders board: open requests, active commissions with a delivery tray, and
## the history. Validity text comes straight from the rules.

var cols := {}
var counts := {}
var tabs := {}
var scrollers := {}
var selected_status := "open"
var board: PanelContainer
var status_note: Label
var expanded_orders := {}
const STATUS_LABELS := {"open": "可接订单", "active": "进行中", "closed": "已结束"}

func scene_name() -> String:
	return "warehouse"

func hint_text() -> String:
	var closed := Model.business_hours_problem(Game.state)
	if closed != "": return closed
	return "接取订单后，从库存挑选合格原物交付（1 AP）；委修单必须交还顾客原物。"

func enter() -> void:
	board = UIKit.plate()
	board.minimum_size_changed.connect(queue_relayout)
	add_child(board)
	var surface := UIKit.vbox(6 if shell.mobile_mode() else 16)
	board.add_child(surface)
	if not shell.mobile_mode(): surface.add_child(UIKit.module_header("委托终端", "接单 · 备货 · 交付", "ORDERS / 登记簿"))
	var tab_row := UIKit.hbox(10)
	surface.add_child(tab_row)
	for status in ["open", "active", "closed"]:
		var key: String = status
		var tab := UIKit.button("", "secondary", Vector2(0 if shell.portrait_mode() else 210, 50 if shell.portrait_mode() else 56), 15 if shell.portrait_mode() else 22)
		tab.pressed.connect(func(): _select_status(key))
		if shell.mobile_mode():
			tab.custom_minimum_size = Vector2(0,36 if shell.landscape_mode() else 44)
			tab.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		tab_row.add_child(tab)
		tabs[key] = tab
	surface.add_child(UIKit.rule())
	status_note = UIKit.label("", 19, UIKit.MUTED, false, true)
	surface.add_child(status_note)
	for key in ["open", "active", "closed"]:
		var sc := ScrollContainer.new()
		sc.size_flags_vertical = Control.SIZE_EXPAND_FILL
		sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
		sc.follow_focus = true
		var list := UIKit.grid(2, 6 if shell.mobile_mode() else 16)
		list.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		sc.add_child(list)
		surface.add_child(sc)
		cols[key] = list
		scrollers[key] = sc
	_refresh()
	relayout()

## Notices sit in the board's header row, right of the tabs.
func toast_rect() -> Rect2:
	if not is_instance_valid(board):
		return Rect2()
	return Rect2(board.position.x + 760, board.position.y + 70, minf(640.0, board.size.x - 800), 150)

func relayout() -> void:
	if not is_instance_valid(board):
		return
	var r: Rect2 = shell.content_rect()
	var width := minf(1640.0, r.size.x)
	board.position = Vector2(r.position.x + (r.size.x - width) * 0.5, r.position.y)
	board.size = Vector2(width, r.size.y)
	for key in cols:
		cols[key].columns = 2 if width >= 1200.0 and counts.get(key, 0) > 0 else 1
		if shell.mobile_mode():
			tabs[key].custom_minimum_size.y = 36 if shell.landscape_mode() else 44
			for card in cols[key].get_children():
				var summary: Button = card.find_child("OrderSummary",true,false)
				if summary == null: continue
				summary.custom_minimum_size.y = 42 if shell.landscape_mode() else 58
				var title: Label = summary.get_child(0).get_child(0)
				title.add_theme_font_size_override("font_size",14 if shell.landscape_mode() else 16)

func _select_status(key: String) -> void:
	var status_changed := selected_status != key
	selected_status = key
	for status in scrollers:
		scrollers[status].visible = status == key
		var tab: Button = tabs[status]
		tab.add_theme_stylebox_override("normal", UIKit.key_style("primary" if status == key else "secondary", "normal"))
		tab.add_theme_color_override("font_color", UIKit.AMBER if status == key else UIKit.TEXT)
	status_note.text = {
		"open": "选择委托接单，再准备符合要求的原物。",
		"active": "逐项核对品相与维修要求，交付消耗 1 行动点。",
		"closed": "查看已交付和已过期的委托记录。"
	}[key]
	var terminal_problem := StoreCosts.device_problem(Game.state, "order_terminal")
	if terminal_problem != "": status_note.text = terminal_problem
	var closed := Model.business_hours_problem(Game.state)
	if closed != "": status_note.text = "已打烊 · 不能接单或交付。请收起终端，先开始下一营业日。" if Game.state.phase != "ending" else closed
	status_note.add_theme_color_override("font_color",UIKit.AMBER if closed != "" else UIKit.MUTED)
	status_note.visible = not shell.mobile_mode() or terminal_problem != "" or closed != ""
	if status_changed:
		tabs[key].call_deferred("grab_focus")

func _empty_state(key: String) -> void:
	var panel := UIKit.plate(UIKit.inset_style(28))
	panel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var content := UIKit.vbox(14)
	panel.add_child(content)
	content.add_child(UIKit.label({"open": "今天暂时没有可接的委托", "active": "还没有进行中的委托", "closed": "还没有已结束的委托"}[key], 26, UIKit.TEXT))
	content.add_child(UIKit.label({"open": "先整理库存、完成维修，新的委托会随营业日出现。", "active": "从可接订单中挑选一项，接单后可在这里核验并交付。", "closed": "委托交付或到期后，会在这里保留记录。"}[key], 21, UIKit.MUTED, false, true))
	var next := UIKit.button("查看可接订单" if key != "open" else "整理仓储", "primary", Vector2(240, 54), 22)
	next.size_flags_horizontal = Control.SIZE_SHRINK_BEGIN
	next.pressed.connect(func():
		if key == "open":
			shell.go("warehouse")
		else:
			_select_status("open"))
	content.add_child(next)
	cols[key].add_child(panel)

const FACTION := {"station": ["站务", Color("2f5f74")], "salvage": ["拾荒", Color("7a4a1e")], "merchant": ["商会", Color("5b3d6e")]}
const INK_SOFT := Color("6b5a40")

## Each commission is a pinned paper work ticket in dark ink.
func _card(def: Dictionary) -> VBoxContainer:
	if shell.mobile_mode(): return _mobile_card(def)
	var card := UIKit.plate(UIKit.paper_style(22))
	card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	# A slight, stable tilt per ticket so the board reads as pinned paper.
	card.pivot_offset = Vector2(300, 20)
	card.rotation = (Model.fnv(String(def.id)) % 7 - 3) * 0.0016
	var pin := Pin.new()
	pin.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var v := UIKit.vbox(10)
	card.add_child(v)
	var strip := UIKit.hbox(8)
	var fac: Array = FACTION.get(def.faction, ["委托", INK_SOFT])
	var badge := PanelContainer.new()
	badge.add_theme_stylebox_override("panel", UIKit.box(fac[1], Color.TRANSPARENT, 3, 0, 4, 0))
	var bl := UIKit.label(" %s委托 " % fac[0], 15, Color("f3e8d2"))
	badge.add_child(bl)
	strip.add_child(badge)
	strip.add_child(UIKit.spacer(false))
	strip.add_child(UIKit.label("No.%s" % String(def.id).get_slice("-", 1), 15, INK_SOFT, true))
	v.add_child(strip)
	var head := UIKit.hbox(14)
	var frame := UIKit.plate(UIKit.skin("socket", "xs", 6.0))
	var pic := TextureRect.new()
	pic.texture = UIKit.item_icon(def.itemId)
	pic.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	pic.custom_minimum_size = Vector2(54,64) if shell.portrait_mode() else Vector2(84,84)
	pic.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	pic.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	frame.add_child(pic)
	head.add_child(frame)
	var hv := UIKit.vbox(4)
	hv.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hv.add_child(UIKit.label(def.name, 26, UIKit.INK, false, true))
	var meta: BoxContainer = UIKit.vbox(4) if shell.portrait_mode() else UIKit.hbox(14)
	meta.add_child(UIKit.label("报酬 " + UIKit.money(def.reward), 22, UIKit.RUST, true))
	meta.add_child(UIKit.label("第 %s 天前交付" % Model.jnum(Model.order_due(Game.state,def.id)), 18, INK_SOFT))
	hv.add_child(meta)
	head.add_child(hv)
	v.add_child(head)
	v.add_child(_dashes())
	v.add_child(UIKit.label("委托事项", 15, INK_SOFT, true))
	var brief := UIKit.label(_readable(String(def.description)), 19, UIKit.INK, false, true)
	brief.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	v.add_child(brief)
	var req := "需要：%s · 品相≥%s%s%s" % [GameData.def(def.itemId).name, UIKit.pct(def.minCondition), " · 须修复" if def.needsRepair else "", " · 顾客原物" if def.get("customerOwned", false) else ""]
	v.add_child(UIKit.label(req, 17, INK_SOFT, false, true))
	card.add_child(pin)
	card.set_meta("v", v)
	return v

## Keep the actual order actions intact; only their presentation is folded.
func _mobile_card(def: Dictionary) -> VBoxContainer:
	var card := UIKit.plate(UIKit.paper_style(6))
	card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var stack := UIKit.vbox(4)
	card.add_child(stack)
	var summary := UIKit.button("", "secondary", Vector2(0,42 if shell.landscape_mode() else 58),16)
	summary.name = "OrderSummary"
	summary.toggle_mode = true
	summary.button_pressed = expanded_orders.get(def.id,false)
	# A flat summary avoids another metal frame inside the paper ticket.
	for state in ["normal","hover","pressed","disabled"]:
		summary.add_theme_stylebox_override(state,UIKit.box(Color(0.3,0.2,0.1,0.08) if state=="pressed" else Color.TRANSPARENT,Color.TRANSPARENT,0,0,3,0))
	stack.add_child(summary)
	var caption := UIKit.vbox(2)
	caption.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	caption.offset_left = 4
	caption.offset_right = -4
	caption.offset_top = 3
	caption.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var title := UIKit.label(def.name,16,UIKit.INK)
	title.clip_text = true
	title.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	title.mouse_filter = Control.MOUSE_FILTER_IGNORE
	caption.add_child(title)
	var order = Model._order_state(Game.state,def.id)
	var status: String = "可接" if order == null else {"active":"进行中","done":"已交付","failed":"已失效"}.get(order.status,"可接")
	var meta := UIKit.label("%s · %s · 第%d天前    %s" % [status,UIKit.money(def.reward),int(Model.order_due(Game.state,def.id)),"收起" if summary.button_pressed else "展开"],13,UIKit.RUST)
	meta.clip_text = true
	meta.mouse_filter = Control.MOUSE_FILTER_IGNORE
	caption.add_child(meta)
	summary.add_child(caption)
	var details := UIKit.vbox(6)
	details.visible = summary.button_pressed
	stack.add_child(details)
	details.add_child(UIKit.label(_readable(String(def.description)),16,UIKit.INK,false,true))
	details.add_child(UIKit.label("需要：%s · 品相≥%s%s%s" % [GameData.def(def.itemId).name,UIKit.pct(def.minCondition)," · 须修复" if def.needsRepair else ""," · 顾客原物" if def.get("customerOwned",false) else ""],14,INK_SOFT,false,true))
	summary.toggled.connect(func(open: bool):
		expanded_orders[def.id] = open
		details.visible = open
		meta.text = "%s · %s · 第%d天前    %s" % [status,UIKit.money(def.reward),int(Model.order_due(Game.state,def.id)),"收起" if open else "展开"])
	# _refresh adds action controls here, then moves them into folded details.
	card.set_meta("mobile_details",details)
	return stack

func _dashes() -> Label:
	var l := UIKit.label("- ".repeat(90), 13, Color("b3a283"))
	l.clip_text = true
	return l

## A brass pin at the ticket's top centre (drawn, so it ignores layout).
class Pin extends Control:
	func _ready() -> void:
		set_anchors_preset(Control.PRESET_FULL_RECT)
	func _draw() -> void:
		var c := Vector2(size.x * 0.5, -4)
		draw_circle(c + Vector2(2, 3), 9, Color(0, 0, 0, 0.35))
		draw_circle(c, 9, Color("8a5a2b"))
		draw_circle(c, 6, Color("d39a55"))
		draw_circle(c + Vector2(-2, -2), 2.5, Color("ffe1b0"))

## Order briefs reference recipes by internal id (REC-001); show their names.
func _readable(text: String) -> String:
	var re := RegEx.create_from_string("REC-\\d{3}")
	for m in re.search_all(text):
		var r := GameData.recipe(m.get_string())
		text = text.replace(m.get_string(), "「%s」" % r.name if not r.is_empty() else "对应工序")
	return text

func _hours_blocked() -> bool:
	var reason := Model.business_hours_problem(Game.state)
	if reason == "": return false
	shell.toast(reason)
	shell.hint(reason)
	return true

func _take_order(id: String) -> void:
	if _hours_blocked(): return
	expanded_orders[id] = true
	Game.dispatch({"type":"TAKE_ORDER","id":id})
	var order = Model._order_state(Game.state,id)
	if order != null and order.status == "active": _select_status("active")

func _refresh() -> void:
	for k in cols:
		UIKit.clear(cols[k])
	var s := Game.state
	var terminal_problem := StoreCosts.device_problem(s, "order_terminal")
	for def in Model.available_orders(s):
		var v := _card(def)
		var closed: bool = s.phase != "open"
		var b := UIKit.button("已打烊 · 不能接单" if closed else "接取订单", "secondary" if closed else "primary", Vector2(0, 56), 22)
		b.disabled = terminal_problem != ""
		var id: String = def.id
		b.pressed.connect(func(): _take_order(id))
		v.add_child(b)
		cols.open.add_child(v.get_parent())
	for o in s.orders:
		var def := GameData.order(o.id)
		if o.status == "active":
			var v := _card(def)
			var opt := UIKit.option_button()
			var cands := []
			for it in s.inventory:
				if it.defId == def.itemId:
					cands.append(it)
			for i in cands.size():
				var it: Dictionary = cands[i]
				opt.add_item("%s · 品相 %s · 物证 %d%s" % [GameData.def(it.defId).name, UIKit.pct(it.condition), Model.evidence_count(it), " · 顾客原物" if it.owner == "customer" else ""])
				opt.set_item_metadata(i, it.uid)
			# A commission belongs to its original object. Do not default to an
			# unrelated shop-owned copy when both happen to share the same model.
			for i in cands.size():
				if cands[i].uid == o.get("uid", ""):
					opt.select(i)
					break
			var why := UIKit.label("", 18, UIKit.RUST, false, true)
			var b := UIKit.button("交付（1 AP）", "good", Vector2(0, 56), 22)
			var check := func():
				var closed := Model.business_hours_problem(Game.state)
				b.text = "已打烊 · 不能交付" if closed != "" else "交付（1 AP）"
				if closed != "":
					why.text = closed
					b.disabled = false
					return
				if terminal_problem != "":
					why.text = terminal_problem
					b.disabled = true
					opt.disabled = true
					return
				if opt.item_count == 0:
					why.text = "库存里还没有这件货。"
					b.disabled = true
					return
				var it = Game.item(opt.get_item_metadata(opt.selected))
				var bad = Model.order_item_valid(Game.state, def.id, it)
				if bad == null and not Model.has_ap(Game.state,1): bad = "行动点不足：交付订单需要 1 AP。"
				why.text = bad if bad != null else "可以交付。"
				why.add_theme_color_override("font_color", UIKit.RUST if bad != null else Color("2f6b3a"))
				b.disabled = bad != null
			opt.item_selected.connect(func(_i): check.call())
			check.call()
			var id: String = def.id
			b.pressed.connect(func():
				if _hours_blocked(): return
				if opt.item_count == 0: return
				Game.dispatch({"type": "DELIVER_ORDER", "id": id, "uid": opt.get_item_metadata(opt.selected)})
				var order = Model._order_state(Game.state,id)
				if order != null and order.status == "done":
					shell.sound("coin", -2)
					if not Game.prefs.reduced_motion:
						shell.shake = 0.3)
			v.add_child(UIKit.label("交付核对 / 原物选择", 15, INK_SOFT, true))
			v.add_child(opt)
			v.add_child(why)
			v.add_child(b)
			cols.active.add_child(v.get_parent())
		elif o.status == "done" or o.status == "failed":
			var v := _card(def)
			var done: bool = o.status == "done"
			var stamp := PanelContainer.new()
			stamp.size_flags_horizontal = Control.SIZE_SHRINK_END
			var ink := Color(0.18, 0.45, 0.25, 0.9) if done else Color(0.72, 0.13, 0.1, 0.9)
			stamp.add_theme_stylebox_override("panel", UIKit.box(Color.TRANSPARENT, ink, 5, 3, 8, 0))
			stamp.add_child(UIKit.label("已交付" if done else "已失效", 26, ink))
			stamp.rotation = -0.12
			v.add_child(stamp)
			cols.closed.add_child(v.get_parent())
	for k in cols:
		if shell.mobile_mode():
			for card in cols[k].get_children():
				var content: VBoxContainer = card.get_child(0)
				var details: VBoxContainer = card.get_meta("mobile_details")
				for action in content.get_children().slice(2):
					content.remove_child(action)
					details.add_child(action)
		counts[k] = cols[k].get_child_count()
		tabs[k].text = "%s %d" % [{"open":"可接","active":"进行","closed":"记录"}[k],counts[k]] if shell.portrait_mode() else "%s  %02d" % [STATUS_LABELS[k], counts[k]]
		if counts[k] == 0:
			_empty_state(k)
	_select_status(selected_status)
	relayout()

func on_changed(_p: Dictionary, _n: Dictionary, _a: Dictionary) -> void:
	_refresh()
