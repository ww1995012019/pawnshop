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
const STATUS_LABELS := {"open": "可接订单", "active": "进行中", "closed": "已结束"}

func scene_name() -> String:
	return "warehouse"

func hint_text() -> String:
	return "接取订单后，从库存挑选合格原物交付（1 AP）；委修单必须交还顾客原物。"

func enter() -> void:
	board = UIKit.plate()
	add_child(board)
	var surface := UIKit.vbox(16)
	board.add_child(surface)
	var heading := UIKit.hbox(12)
	heading.add_child(UIKit.label("委托终端", 30, UIKit.AMBER))
	heading.add_child(UIKit.spacer(false))
	heading.add_child(UIKit.label("接单 · 备货 · 交付", 20, UIKit.MUTED))
	surface.add_child(heading)
	var tab_row := UIKit.hbox(10)
	surface.add_child(tab_row)
	for status in ["open", "active", "closed"]:
		var key: String = status
		var tab := UIKit.button("", "secondary", Vector2(210, 56), 22)
		tab.pressed.connect(func(): _select_status(key))
		tab_row.add_child(tab)
		tabs[key] = tab
	surface.add_child(UIKit.rule())
	status_note = UIKit.label("", 19, UIKit.MUTED)
	surface.add_child(status_note)
	for key in ["open", "active", "closed"]:
		var sc := ScrollContainer.new()
		sc.size_flags_vertical = Control.SIZE_EXPAND_FILL
		sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
		sc.follow_focus = true
		var list := UIKit.grid(2, 16)
		list.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		sc.add_child(list)
		surface.add_child(sc)
		cols[key] = list
		scrollers[key] = sc
	_refresh()
	relayout()

func relayout() -> void:
	if not is_instance_valid(board):
		return
	var r: Rect2 = shell.content_rect()
	var width := minf(1640.0, r.size.x)
	board.position = Vector2(r.position.x + (r.size.x - width) * 0.5, r.position.y)
	board.size = Vector2(width, r.size.y)
	for key in cols:
		cols[key].columns = 2 if width >= 1200.0 and counts.get(key, 0) > 0 else 1

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

func _card(def: Dictionary) -> VBoxContainer:
	var card := UIKit.plate(UIKit.box(Color("202b30"), Color("556461"), 2, 1, 20, 0))
	card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var v := UIKit.vbox(12)
	card.add_child(v)
	var head := UIKit.hbox(10)
	var pic := TextureRect.new()
	pic.texture = UIKit.item_icon(def.itemId)
	pic.custom_minimum_size = Vector2(92, 92)
	pic.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	pic.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	head.add_child(pic)
	var hv := UIKit.vbox(2)
	hv.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hv.add_child(UIKit.label(def.name, 26, UIKit.TEXT, false, true))
	hv.add_child(UIKit.label("报酬 %s · 第 %s 天前 · %s" % [UIKit.money(def.reward), Model.jnum(def.dueDay), {"station": "站务", "salvage": "拾荒", "merchant": "商会"}[def.faction]], 20, UIKit.AMBER, false, true))
	head.add_child(hv)
	v.add_child(head)
	v.add_child(UIKit.label(def.description, 21, UIKit.TEXT, false, true))
	var req := "需要：%s · 品相≥%s%s%s" % [GameData.def(def.itemId).name, UIKit.pct(def.minCondition), " · 须修复" if def.needsRepair else "", " · 顾客原物" if def.get("customerOwned", false) else ""]
	v.add_child(UIKit.label(req, 19, UIKit.MUTED, false, true))
	card.set_meta("v", v)
	return v

func _refresh() -> void:
	for k in cols:
		UIKit.clear(cols[k])
	var s := Game.state
	for def in Model.available_orders(s):
		var v := _card(def)
		var b := UIKit.button("接取订单", "primary", Vector2(0, 56), 22)
		var id: String = def.id
		b.pressed.connect(func():
			if Game.dispatch({"type": "TAKE_ORDER", "id": id}):
				_select_status("active"))
		v.add_child(b)
		cols.open.add_child(v.get_parent())
	for o in s.orders:
		var def := GameData.order(o.id)
		if o.status == "active":
			var v := _card(def)
			var opt := OptionButton.new()
			opt.custom_minimum_size = Vector2(0, 46)
			opt.add_theme_font_size_override("font_size", 20)
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
			var why := UIKit.label("", 19, UIKit.AMBER, false, true)
			var b := UIKit.button("交付（1 AP）", "good", Vector2(0, 56), 22)
			var check := func():
				if opt.item_count == 0:
					why.text = "库存里还没有这件货。"
					b.disabled = true
					return
				var it = Game.item(opt.get_item_metadata(opt.selected))
				var bad = Model.order_item_valid(s, def.id, it)
				why.text = bad if bad != null else "可以交付。"
				b.disabled = bad != null
			opt.item_selected.connect(func(_i): check.call())
			check.call()
			var id: String = def.id
			b.pressed.connect(func():
				if Game.dispatch({"type": "DELIVER_ORDER", "id": id, "uid": opt.get_item_metadata(opt.selected)}):
					shell.sound("coin", -2)
					if not Game.prefs.reduced_motion:
						shell.shake = 0.3)
			v.add_child(opt)
			v.add_child(why)
			v.add_child(b)
			cols.active.add_child(v.get_parent())
		elif o.status == "done" or o.status == "failed":
			var v := _card(def)
			v.add_child(UIKit.label("✓ 已交付" if o.status == "done" else "✗ 已过期/失败", 18, UIKit.GOOD if o.status == "done" else UIKit.DANGER))
			cols.closed.add_child(v.get_parent())
	for k in cols:
		counts[k] = cols[k].get_child_count()
		tabs[k].text = "%s  %02d" % [STATUS_LABELS[k], counts[k]]
		if counts[k] == 0:
			_empty_state(k)
	_select_status(selected_status)
	relayout()

func on_changed(_p: Dictionary, _n: Dictionary, _a: Dictionary) -> void:
	_refresh()
