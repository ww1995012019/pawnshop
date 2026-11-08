extends Page
## Day end: today's ledger, settle (maintenance and rent), the first equipment
## upgrade from day 3, the next day, and the 21-day outcome.

var body: VBoxContainer

func scene_name() -> String:
	return "counter"

func hint_text() -> String:
	var s := Game.state
	if s.phase == "open":
		return "处理完今天的客人与订单后，打烊结算维护费与租金。"
	if s.phase == "report":
		return "日结完成：选择升级（第 3 天起），然后迎接明天。"
	return "经营结束。可以回看账目，或新开一家店。"

func enter() -> void:
	var r: Rect2 = shell.content_rect()
	var center := CenterContainer.new()
	center.position = r.position
	center.size = r.size
	add_child(center)
	var p := UIKit.plate()
	p.custom_minimum_size = Vector2(1100, 0)
	center.add_child(p)
	body = UIKit.vbox(14)
	p.add_child(body)
	_refresh()

func _row(g: GridContainer, k: String, v: String, color := UIKit.TEXT) -> void:
	g.add_child(UIKit.label(k, 20, UIKit.MUTED))
	var l := UIKit.label(v, 22, color, true)
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	l.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	g.add_child(l)

func _refresh() -> void:
	UIKit.clear(body)
	var s := Game.state
	var day := int(s.day)
	if s.phase == "ending":
		body.add_child(UIKit.label("经营结束 · 第 %d 天" % day, 34, UIKit.AMBER))
		body.add_child(UIKit.label(String(s.get("outcome", "旧货局的灯熄了。")), 28, Color("f3e6cc"), false, true))
		var g := UIKit.grid(2, 10)
		_row(g, "期末现金", UIKit.money(s.cash), UIKit.AMBER)
		_row(g, "完成交易", "%d 笔" % s.completedTrades.size())
		var done := 0
		for o in s.orders:
			if o.status == "done":
				done += 1
		_row(g, "履约订单", "%d 张" % done)
		_row(g, "站务关注", "%d / 100" % int(s.risk))
		body.add_child(g)
		var again := UIKit.button("新开一家店", "primary", Vector2(0, 64), 24)
		again.pressed.connect(func():
			Game.new_game()
			shell.shutter(1))
		body.add_child(again)
		return
	body.add_child(UIKit.label("第 %d 天 · %s" % [day, "日结报告" if s.phase == "report" else "营业中"], 32, UIKit.AMBER))
	var today := []
	for r in s.ledger:
		if r.day == s.day:
			today.append(r)
	var cols := UIKit.hbox(24)
	var left := UIKit.vbox(8)
	left.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	left.add_child(UIKit.label("今日流水", 20, UIKit.MUTED))
	var sc := ScrollContainer.new()
	sc.custom_minimum_size = Vector2(0, 300)
	sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	var lv := UIKit.vbox(4)
	lv.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	for r in today:
		var row := UIKit.hbox(8)
		var l := UIKit.label(String(r.label), 18, UIKit.TEXT)
		l.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		l.clip_text = true
		row.add_child(l)
		row.add_child(UIKit.label(("+" if r.amount > 0 else "") + Model.jnum(r.amount), 18, UIKit.GOOD if r.amount > 0 else UIKit.DANGER, true))
		lv.add_child(row)
	if today.is_empty():
		lv.add_child(UIKit.label("今天还没有流水。", 18, UIKit.MUTED))
	sc.add_child(lv)
	left.add_child(sc)
	cols.add_child(left)
	var right := UIKit.vbox(10)
	right.custom_minimum_size = Vector2(440, 0)
	var g := UIKit.grid(2, 8)
	var due := Model.rent_due(s.day)
	if s.phase == "report" and s.report != null:
		_row(g, "收入", UIKit.money(s.report.income), UIKit.GOOD)
		_row(g, "支出", UIKit.money(s.report.expenses), UIKit.DANGER)
		_row(g, "能源维护", UIKit.money(s.report.maintenance))
		_row(g, "租金", UIKit.money(s.report.rent))
		_row(g, "结余现金", UIKit.money(s.report.cash), UIKit.AMBER)
	else:
		_row(g, "当前现金", UIKit.money(s.cash), UIKit.AMBER)
		_row(g, "今晚维护", UIKit.money(20))
		_row(g, "今晚租金", UIKit.money(due) if due > 0 else "无（第 7/14/21 天收取）")
		_row(g, "剩余行动点", "%d AP" % int(s.ap))
	right.add_child(g)
	cols.add_child(right)
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
				cv.add_child(UIKit.label(spec[1], 21, UIKit.AMBER))
				cv.add_child(UIKit.label(spec[2], 17, UIKit.TEXT))
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
