extends Page
## Orders board: open requests, active commissions with a delivery tray, and
## the history. Validity text comes straight from the rules.

var cols := {}

func scene_name() -> String:
	return "warehouse"

func hint_text() -> String:
	return "接取订单后，从库存挑选合格原物交付（1 AP）；委修单必须交还顾客原物。"

func enter() -> void:
	var r: Rect2 = shell.content_rect()
	var row := UIKit.hbox(16)
	row.position = r.position
	row.size = r.size
	add_child(row)
	for spec in [["open", "可接订单"], ["active", "进行中"], ["closed", "已结束"]]:
		var p := UIKit.plate()
		p.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		p.size_flags_stretch_ratio = 1.25 if spec[0] == "active" else 1.0
		var v := UIKit.vbox(10)
		p.add_child(v)
		v.add_child(UIKit.label(spec[1], 24, UIKit.AMBER))
		var sc := ScrollContainer.new()
		sc.size_flags_vertical = Control.SIZE_EXPAND_FILL
		sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
		var list := UIKit.vbox(10)
		list.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		sc.add_child(list)
		v.add_child(sc)
		row.add_child(p)
		cols[spec[0]] = list
	_refresh()

func _card(def: Dictionary) -> VBoxContainer:
	var card := UIKit.plate(UIKit.paper_style(14))
	var v := UIKit.vbox(6)
	card.add_child(v)
	var head := UIKit.hbox(10)
	var pic := TextureRect.new()
	pic.texture = UIKit.item_icon(def.itemId)
	pic.custom_minimum_size = Vector2(72, 72)
	pic.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	pic.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	head.add_child(pic)
	var hv := UIKit.vbox(2)
	hv.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hv.add_child(UIKit.label(def.name, 21, UIKit.INK, false, true))
	hv.add_child(UIKit.label("报酬 %s · 第 %s 天前 · %s" % [UIKit.money(def.reward), Model.jnum(def.dueDay), {"station": "站务", "salvage": "拾荒", "merchant": "商会"}[def.faction]], 16, UIKit.RUST))
	head.add_child(hv)
	v.add_child(head)
	v.add_child(UIKit.label(def.description, 16, UIKit.INK, false, true))
	var req := "需要：%s · 品相≥%s%s%s" % [GameData.def(def.itemId).name, UIKit.pct(def.minCondition), " · 须修复" if def.needsRepair else "", " · 顾客原物" if def.get("customerOwned", false) else ""]
	v.add_child(UIKit.label(req, 15, Color("6f6352"), false, true))
	card.set_meta("v", v)
	return v

func _refresh() -> void:
	for k in cols:
		UIKit.clear(cols[k])
	var s := Game.state
	for def in Model.available_orders(s):
		var v := _card(def)
		var b := UIKit.button("接取订单", "primary", Vector2(0, 48), 19)
		var id: String = def.id
		b.pressed.connect(func(): Game.dispatch({"type": "TAKE_ORDER", "id": id}))
		v.add_child(b)
		cols.open.add_child(v.get_parent())
	for o in s.orders:
		var def := GameData.order(o.id)
		if o.status == "active":
			var v := _card(def)
			var opt := OptionButton.new()
			opt.custom_minimum_size = Vector2(0, 46)
			opt.add_theme_font_size_override("font_size", 17)
			var cands := []
			for it in s.inventory:
				if it.defId == def.itemId:
					cands.append(it)
			for i in cands.size():
				var it: Dictionary = cands[i]
				opt.add_item("%s · 品相 %s · 物证 %d%s" % [GameData.def(it.defId).name, UIKit.pct(it.condition), Model.evidence_count(it), " · 顾客原物" if it.owner == "customer" else ""])
				opt.set_item_metadata(i, it.uid)
			var why := UIKit.label("", 15, UIKit.RUST, false, true)
			var b := UIKit.button("交付（1 AP）", "good", Vector2(0, 48), 19)
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
					shell.shake = 0.3)
			v.add_child(opt)
			v.add_child(why)
			v.add_child(b)
			cols.active.add_child(v.get_parent())
		elif o.status == "done" or o.status == "failed":
			var v := _card(def)
			v.add_child(UIKit.label("✓ 已交付" if o.status == "done" else "✗ 已过期/失败", 18, Color("2f6b3d") if o.status == "done" else UIKit.RUST))
			cols.closed.add_child(v.get_parent())
	for k in cols:
		if cols[k].get_child_count() == 0:
			cols[k].add_child(UIKit.label("暂无", 18, UIKit.MUTED))

func on_changed(_p: Dictionary, _n: Dictionary, _a: Dictionary) -> void:
	_refresh()
