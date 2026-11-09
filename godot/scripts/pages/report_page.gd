extends Page
## Day end: today's ledger, settle (maintenance and rent), the first equipment
## upgrade from day 3, the next day, and the 21-day outcome.

var body: VBoxContainer
var sheet: PanelContainer

func scene_name() -> String:
	return "counter"

func hint_text() -> String:
	var s := Game.state
	if s.phase == "open":
		return "处理完今天的客人与订单后，打烊结算维护费与租金。"
	if s.phase == "report":
		return "日结完成：选择升级（第 3 天起），然后迎接明天。"
	return "经营结束。可以回看账目，或新开一家店。"

func toast_rect() -> Rect2:
	var r: Rect2 = shell.content_rect()
	return Rect2(r.position.x, r.end.y - 160.0, 640, 140)

func enter() -> void:
	sheet = UIKit.plate()
	add_child(sheet)
	var sc := ScrollContainer.new()
	sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	sheet.add_child(sc)
	body = UIKit.vbox(12)
	body.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	# Keep printed edges and right-aligned serials clear of the scroll rail.
	var scroll_gutter := MarginContainer.new()
	scroll_gutter.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll_gutter.add_theme_constant_override("margin_right", 14)
	scroll_gutter.add_child(body)
	sc.add_child(scroll_gutter)
	_refresh()
	relayout()
	call_deferred("relayout")

## Keep the ledger usable when a shorter window cannot show every upgrade.
func relayout() -> void:
	if not is_instance_valid(sheet):
		return
	var r: Rect2 = shell.content_rect()
	var width := minf(1100.0, r.size.x)
	var max_height := minf(760.0, r.size.y)
	var style: StyleBox = sheet.get_theme_stylebox("panel")
	var pad := style.get_content_margin(SIDE_TOP) + style.get_content_margin(SIDE_BOTTOM)
	var height := minf(max_height, maxf(360.0, body.get_combined_minimum_size().y + pad + 4.0))
	sheet.position = Vector2(r.position.x + (r.size.x - width) * 0.5, r.position.y)
	sheet.size = Vector2(width, height)

func _row(g: GridContainer, k: String, v: String, color := UIKit.INK) -> void:
	g.add_child(UIKit.label(k, 20, Color("6b5a40")))
	var l := UIKit.label(v, 22, color, true)
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	l.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	g.add_child(l)

func _refresh() -> void:
	UIKit.clear(body)
	var s := Game.state
	var day := int(s.day)
	if s.phase == "ending":
		body.add_child(UIKit.module_header("经营结束 · 第 %d 天" % day, "最终经营账目", "CLOSE / 21"))
		body.add_child(UIKit.record_card("结业记录", String(s.get("outcome", "旧货局的灯熄了。")), "FINAL"))
		var final_sheet := UIKit.plate(UIKit.paper_style(18))
		var g := UIKit.grid(2, 10)
		_row(g, "期末现金", UIKit.money(s.cash), UIKit.RUST)
		_row(g, "完成交易", "%d 笔" % s.completedTrades.size())
		var done := 0
		for o in s.orders:
			if o.status == "done":
				done += 1
		_row(g, "履约订单", "%d 张" % done)
		_row(g, "站务关注", "%d / 100" % int(s.risk))
		final_sheet.add_child(g)
		body.add_child(final_sheet)
		var again := UIKit.button("新开一家店", "primary", Vector2(0, 64), 24)
		again.pressed.connect(func():
			Game.new_game()
			shell.shutter(1))
		body.add_child(again)
		return
	body.add_child(UIKit.module_header("第 %d 天 · %s" % [day, "日结报告" if s.phase == "report" else "营业中"], "营业账目", "LEDGER / %02d" % day))
	var today := []
	for r in s.ledger:
		if r.day == s.day:
			today.append(r)
	var cols := UIKit.hbox(16)
	var receipt := UIKit.plate(UIKit.paper_style(16))
	receipt.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var left := UIKit.vbox(8)
	left.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	receipt.add_child(left)
	left.add_child(UIKit.label("今日流水 / TRANSACTIONS", 18, UIKit.INK, true))
	left.add_child(UIKit.label("第 %02d 营业日 · %02d 笔记录" % [day, today.size()], 15, Color("6b5a40")))
	var sc := ScrollContainer.new()
	sc.custom_minimum_size = Vector2(0, 250)
	sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	var lv := UIKit.vbox(4)
	lv.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	for r in today:
		var row := UIKit.hbox(8)
		var l := UIKit.label(String(r.label), 18, UIKit.INK)
		l.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		l.clip_text = true
		row.add_child(l)
		row.add_child(UIKit.label(("+" if r.amount > 0 else "") + Model.jnum(r.amount), 18, Color("2f6b3a") if r.amount > 0 else UIKit.RUST, true))
		lv.add_child(row)
	if today.is_empty():
		lv.add_child(UIKit.label("今天还没有流水。", 18, Color("6b5a40")))
	sc.add_child(lv)
	left.add_child(sc)
	cols.add_child(receipt)
	var totals := UIKit.plate(UIKit.paper_style(16))
	totals.custom_minimum_size = Vector2(390, 0)
	var right := UIKit.vbox(10)
	totals.add_child(right)
	right.add_child(UIKit.label("结算联 / TOTALS", 18, UIKit.INK, true))
	var g := UIKit.grid(2, 8)
	var due := Model.rent_due(s.day)
	if s.phase == "report" and s.report != null:
		_row(g, "收入", UIKit.money(s.report.income), Color("2f6b3a"))
		_row(g, "支出", UIKit.money(s.report.expenses), UIKit.RUST)
		_row(g, "能源维护", UIKit.money(s.report.maintenance))
		_row(g, "租金", UIKit.money(s.report.rent))
		_row(g, "结余现金", UIKit.money(s.report.cash), UIKit.RUST)
	else:
		_row(g, "当前现金", UIKit.money(s.cash), UIKit.RUST)
		_row(g, "今晚维护", UIKit.money(20))
		_row(g, "今晚租金", UIKit.money(due) if due > 0 else "无（第 7/14/21 天收取）")
		_row(g, "剩余行动点", "%d AP" % int(s.ap))
	right.add_child(g)
	cols.add_child(totals)
	body.add_child(cols)
	body.add_child(UIKit.rule())
	if s.phase == "open":
		var b := UIKit.button("打烊结算", "primary", Vector2(0, 64), 24)
		b.disabled = s.trade != null
		if s.trade != null:
			body.add_child(UIKit.label("柜台还有客人：先交割或送客。", 18, UIKit.DANGER))
		b.pressed.connect(func():
			shell.sound("drop", -4, 0.8)
			Game.dispatch({"type": "SETTLE"}))
		body.add_child(b)
	elif s.phase == "report":
		if day >= 3 and not s.report.upgraded:
			var up := UIKit.hbox(14)
			for spec in [["lamp", "可变焦工作灯 · 120 Cr", "每天第一次鉴定不耗 AP", s.upgrades.lamp], ["shelf", "模组陈列架 · 160 Cr", "合法货物陈列价提高 5%", s.upgrades.shelf]]:
				var card := UIKit.plate(UIKit.inset_style(14))
				card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
				var cv := UIKit.vbox(6)
				card.add_child(cv)
				cv.add_child(UIKit.module_header(spec[1], spec[2], "UPGRADE"))
				var b := UIKit.button("已安装" if spec[3] else "安装", "good", Vector2(0, 50), 19)
				b.disabled = spec[3]
				var id: String = spec[0]
				b.pressed.connect(func(): Game.dispatch({"type": "UPGRADE", "id": id}))
				cv.add_child(b)
				up.add_child(card)
			body.add_child(up)
		var next := UIKit.button("迎接第 %d 天" % (day + 1) if day < 21 else "查看结局", "primary", Vector2(0, 64), 24)
		next.pressed.connect(func():
			if Game.dispatch({"type": "NEXT"}) and Game.state.phase == "open":
				shell.go("counter"))
		body.add_child(next)

func on_changed(_p: Dictionary, _n: Dictionary, _a: Dictionary) -> void:
	_refresh()
	call_deferred("relayout")
