extends RefCounted
## A read-only cash book. Ledger amounts are postings; cost is not another cash movement.

const KIND_LABELS := {
	"purchase": "收购支出", "sale": "售货收入", "pawn-principal": "抵押本金支出",
	"pawn-return": "抵押本金收回", "pawn-fee": "抵押服务费", "registration": "来源登记费",
	"order": "订单收入", "service": "服务收入", "materials": "材料采购",
	"material-sale": "材料出售", "maintenance": "旧版能源维护", "electricity": "店铺电费", "cleaning": "店铺清洁费", "rent": "租金",
	"upgrade": "设备升级", "clearance": "应急清仓", "relief-window": "救济记录", "rent-relief": "筹租记录",
	"station-event": "站务事件", "bounty": "协查赏金", "fine": "处罚支出", "insurance-premium":"失窃保险保费", "insurance-payout":"失窃保险赔款"
}

static func summary(state: Dictionary) -> Dictionary:
	var income := 0.0
	var expenses := 0.0
	var net := 0.0
	for entry in state.get("ledger", []):
		var amount := float(entry.get("amount", 0.0))
		net += amount
		if amount > 0:
			income += amount
		elif amount < 0:
			expenses -= amount
	var cash := float(state.get("cash", 0.0))
	return {"income": income, "expenses": expenses, "net": net, "opening": cash - net, "cash": cash}

static func filtered_entries(state: Dictionary, day := -1, kind := "") -> Array:
	var source: Array = state.get("ledger", [])
	var indices: Array[int] = []
	for i in source.size():
		var entry: Dictionary = source[i]
		if day != -1 and int(entry.get("day", 0)) != day:
			continue
		if kind != "" and String(entry.get("kind", "")) != kind:
			continue
		indices.append(i)
	indices.sort_custom(func(a: int, b: int) -> bool:
		var a_day := int(source[a].get("day", 0))
		var b_day := int(source[b].get("day", 0))
		return a > b if a_day == b_day else a_day > b_day)
	var result: Array = []
	for index in indices:
		result.append(source[index].duplicate(true))
	return result

static func open(shell: Node) -> void:
	var sheet: Array = shell.modal("总流水", 1000)
	var body: VBoxContainer = sheet[0]
	# A snapshot makes the modal independent of ongoing world/UI refreshes.
	var state: Dictionary = Game.state.duplicate(true)
	var totals := summary(state)
	var scroll := ScrollContainer.new()
	scroll.name = "ledger_scroll"
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	scroll.custom_minimum_size = Vector2(0, clampf(shell.get_viewport().get_visible_rect().size.y - 260.0, 140.0, 640.0))
	scroll.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.follow_focus = true
	body.add_child(scroll)
	var gutter := MarginContainer.new()
	gutter.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	gutter.add_theme_constant_override("margin_right", 18)
	scroll.add_child(gutter)
	var content := UIKit.vbox(12)
	content.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	gutter.add_child(content)
	content.add_child(UIKit.module_header("全经营期现金账簿", "从开店至今 · 按入账顺序倒序查阅", "CASH BOOK"))
	var stats := HFlowContainer.new()
	stats.add_theme_constant_override("h_separation", 10)
	stats.add_theme_constant_override("v_separation", 10)
	content.add_child(stats)
	for field in [["cash", "当前现金"], ["income", "累计收入"], ["expenses", "累计支出"], ["net", "净现金流"], ["opening", "期初余额"]]:
		var card := UIKit.plate(UIKit.paper_style(10))
		card.custom_minimum_size.x = 155
		var column := UIKit.vbox(4)
		card.add_child(column)
		column.add_child(UIKit.label(field[1], 17, UIKit.INK))
		var amount := UIKit.label(UIKit.money(totals[field[0]]), 22, UIKit.RUST, true)
		amount.name = "ledger_" + field[0]
		column.add_child(amount)
		stats.add_child(card)
	content.add_child(UIKit.label("净现金流 = 累计收入 − 累计支出；含抵押本金，不代表利润。期初余额 + 净现金流 = 当前现金。", 17, UIKit.MUTED, false, true))
	var filters := HFlowContainer.new()
	filters.add_theme_constant_override("h_separation", 12)
	filters.add_theme_constant_override("v_separation", 8)
	content.add_child(filters)
	var day_picker := _picker("ledger_day", "日期：全部营业日", -1)
	var kind_picker := _picker("ledger_kind", "类型：全部流水", "")
	var days: Array[int] = []
	var kinds: Array[String] = []
	for entry in state.get("ledger", []):
		var day := int(entry.get("day", 0))
		var kind := String(entry.get("kind", ""))
		if not days.has(day): days.append(day)
		if not kinds.has(kind): kinds.append(kind)
	days.sort()
	days.reverse()
	kinds.sort()
	for day in days:
		day_picker.add_item("第 %02d 天" % day)
		day_picker.set_item_metadata(day_picker.item_count - 1, day)
	for kind in kinds:
		kind_picker.add_item(_kind_label(kind))
		kind_picker.set_item_metadata(kind_picker.item_count - 1, kind)
	filters.add_child(day_picker)
	filters.add_child(kind_picker)
	var count_label := UIKit.label("", 17, UIKit.MUTED)
	content.add_child(count_label)
	var paper := UIKit.plate(UIKit.paper_style(14))
	paper.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	content.add_child(paper)
	var entries := UIKit.vbox(10)
	entries.name = "ledger_entries"
	entries.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	paper.add_child(entries)
	var refresh := func(_index: int = 0) -> void:
		UIKit.clear(entries)
		var rows := filtered_entries(state, int(day_picker.get_item_metadata(day_picker.selected)), String(kind_picker.get_item_metadata(kind_picker.selected)))
		count_label.text = "显示 %d / %d 笔 · 日期 / 类型 / 摘要 / 金额（Cr）" % [rows.size(), state.get("ledger", []).size()]
		if rows.is_empty():
			entries.add_child(UIKit.label("还没有流水记录。" if state.get("ledger", []).is_empty() else "没有符合筛选条件的流水。", 20, UIKit.INK, false, true))
		for entry in rows:
			var row := UIKit.hbox(10)
			row.add_child(_cell("第 %02d 天" % int(entry.get("day", 0)), 80))
			row.add_child(_cell(_kind_label(String(entry.get("kind", ""))), 140))
			var description := UIKit.label(String(entry.get("label", "")), 18, UIKit.INK, false, true)
			description.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			row.add_child(description)
			var amount := float(entry.get("amount", 0.0))
			var value := _cell(("+" if amount > 0 else "") + UIKit.money(amount), 110)
			value.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
			value.add_theme_color_override("font_color", Color("2f6b3a") if amount > 0 else UIKit.RUST if amount < 0 else UIKit.INK)
			row.add_child(value)
			entries.add_child(row)
	day_picker.item_selected.connect(refresh)
	kind_picker.item_selected.connect(refresh)
	refresh.call()

static func _kind_label(kind: String) -> String:
	return String(KIND_LABELS.get(kind, kind if kind != "" else "其他记录"))

static func _picker(node_name: String, caption: String, metadata: Variant) -> OptionButton:
	var picker := OptionButton.new()
	picker.name = node_name
	picker.custom_minimum_size = Vector2(230, 48)
	picker.add_theme_font_size_override("font_size", 19)
	picker.add_item(caption)
	picker.set_item_metadata(0, metadata)
	picker.select(0)
	return picker

static func _cell(text: String, width: float) -> Label:
	var cell := UIKit.label(text, 18, UIKit.INK, false, true)
	cell.custom_minimum_size.x = width
	return cell
