extends Page
## Day end: today's ledger, electricity/cleaning receipts, the first equipment
## upgrade from day 3, the next day, and the 21-day outcome.

const Life = preload("res://scripts/model/campaign_life.gd")

var body: VBoxContainer
var sheet: PanelContainer
var status_label: Label
var status_text := ""
var status_tone := "info"
var costs_expanded := false
var insurance_expanded := false
var columns: BoxContainer
var upgrades_row: BoxContainer
var totals_panel: PanelContainer

func scene_name() -> String:
	return "counter"

func hint_text() -> String:
	var s := Game.state
	if Life.continue_problem(s) == "":
		return "经营评估已完成：可以保留店铺继续经营，或查看本轮结局。" if s.phase == "report" else "经营评估已完成。可以保留店铺继续经营，或新开一家店。"
	var week := int(Life.summary(s).week)
	if s.phase == "open":
		return ("持续经营 · 第 %d 周。" % week if Life.is_endless(s) else "") + "处理完今天的客人与订单后，打烊结算电费与清洁费，租金由房东上门收取。"
	if s.phase == "report":
		if Life.is_endless(s): return "持续经营 · 第 %d 周日结完成，迎接第 %d 天。" % [week,int(s.day)+1]
		return "日结完成：选择升级（第 3 天起），然后迎接明天。"
	return "经营结束。可以回看账目，或新开一家店。"

## Results belong to the scrollable ledger, directly below its title.
func show_status(text: String, tone := "info") -> void:
	status_text = text
	status_tone = tone
	if is_instance_valid(status_label):
		status_label.text = text
		status_label.visible = text != ""
		status_label.add_theme_color_override("font_color", UIKit.TEXT if tone == "info" else UIKit.DANGER)

func _add_status() -> void:
	status_label = UIKit.label(status_text, 18, UIKit.TEXT if status_tone == "info" else UIKit.DANGER, false, true)
	status_label.name = "report_status"
	status_label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	status_label.visible = status_text != ""
	body.add_child(status_label)

func enter() -> void:
	sheet = UIKit.plate()
	add_child(sheet)
	var sc := ScrollContainer.new()
	sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	sheet.add_child(sc)
	body = UIKit.vbox(12)
	body.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	body.size_flags_vertical = Control.SIZE_EXPAND_FILL
	# Keep printed edges and right-aligned serials clear of the scroll rail.
	var scroll_gutter := MarginContainer.new()
	scroll_gutter.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll_gutter.size_flags_vertical = Control.SIZE_EXPAND_FILL
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
	# The outer equipment drawer already defines the usable area. Filling it
	# avoids a second, smaller fixed-width window floating inside the drawer.
	sheet.position = r.position
	# Stack paperwork in narrow viewports instead of forcing the sheet wider.
	var narrow := r.size.x < 880
	if is_instance_valid(columns): columns.vertical = narrow
	if is_instance_valid(upgrades_row): upgrades_row.vertical = narrow
	if is_instance_valid(totals_panel): totals_panel.custom_minimum_size.x = 0 if narrow else 390
	var receipt_scroll := find_child("ledger_receipt_scroll", true, false) as ScrollContainer
	if receipt_scroll != null: receipt_scroll.custom_minimum_size.y = 0 if shell.mobile_mode() else 400 if r.size.y >= 750 and r.size.x >= 880 else 250
	sheet.size = r.size

func _row(g: GridContainer, k: String, v: String, color := UIKit.INK) -> void:
	var caption := UIKit.label(k, 18, Color("6b5a40"), false, true)
	caption.custom_minimum_size.x = 110 if shell.mobile_mode() else 160
	caption.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	g.add_child(caption)
	var l := UIKit.label(v, 22, color, true)
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	l.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	g.add_child(l)

func _refresh() -> void:
	UIKit.clear(body)
	columns = null
	upgrades_row = null
	totals_panel = null
	var s := Game.state
	var day := int(s.day)
	if s.phase == "ending":
		body.add_child(UIKit.module_header("经营结束 · 第 %d 天" % day, "最终经营账目", "CLOSE / %02d" % day))
		_add_status()
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
		var continuation := _add_continuation(s)
		var again := UIKit.button("新开一家店", "secondary" if continuation != null else "primary", Vector2(0, 64), 24)
		again.pressed.connect(func():
			Game.new_game()
			shell.shutter(1))
		body.add_child(again)
		return
	if Life.is_endless(s):
		var summary := Life.summary(s)
		var subtitle := "第 %d 周 · %s" % [int(summary.week),"日结报告" if s.phase == "report" else "营业账目"]
		if summary.firstAssessment is Dictionary: subtitle += " · 首次评估：" + String(summary.firstAssessment.outcome)
		body.add_child(UIKit.module_header("持续经营 · 第 %d 天" % day, subtitle, "ENDLESS / %02d" % day))
	else:
		body.add_child(UIKit.module_header("第 %d 天 · %s" % [day, "日结报告" if s.phase == "report" else "营业中"], "营业账目", "LEDGER / %02d" % day))
	_add_status()
	if not shell.mobile_mode(): _add_night_controls(s)
	var today := []
	for r in s.ledger:
		if r.day == s.day:
			today.append(r)
	var cols := BoxContainer.new()
	cols.add_theme_constant_override("separation", 16)
	columns = cols
	cols.size_flags_vertical = Control.SIZE_EXPAND_FILL
	var receipt := UIKit.plate(UIKit.paper_style(16))
	receipt.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	var left := UIKit.vbox(8)
	left.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	left.size_flags_vertical = Control.SIZE_EXPAND_FILL
	receipt.add_child(left)
	left.add_child(UIKit.label("今日流水 / TRANSACTIONS", 18, UIKit.INK, true))
	left.add_child(UIKit.label("第 %02d 营业日 · %02d 笔记录" % [day, today.size()], 15, Color("6b5a40")))
	var sc := ScrollContainer.new()
	sc.name = "ledger_receipt_scroll"
	sc.custom_minimum_size = Vector2(0, 250)
	sc.size_flags_vertical = Control.SIZE_EXPAND_FILL
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
	# This is a separate scroll area from the whole sheet: reserve its own
	# gutter so the last amount never touches the thumb or track.
	var entries_gutter := MarginContainer.new()
	entries_gutter.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	entries_gutter.add_theme_constant_override("margin_right", 24)
	entries_gutter.add_child(lv)
	sc.add_child(entries_gutter)
	left.add_child(sc)
	cols.add_child(receipt)
	var totals := UIKit.plate(UIKit.paper_style(16))
	totals_panel = totals
	totals.custom_minimum_size = Vector2(390, 0)
	var right := UIKit.vbox(10)
	totals.add_child(right)
	right.add_child(UIKit.label("结算联 / TOTALS", 18, UIKit.INK, true))
	var g := UIKit.grid(2, 8)
	var due := Landlord.outstanding(s)
	var paid: bool = s.phase == "report" and s.report != null
	# Historic reports preserve the old single charge; never recalculate them.
	var costs: Dictionary = s.report.get("costs", {"legacy":true,"maintenance":s.report.get("maintenance",20),"electricity":0,"cleaning":0,"total":s.report.get("maintenance",20),"details":{}}) if paid else StoreCosts.quote(s)
	if paid:
		_row(g, "收入", UIKit.money(s.report.income), Color("2f6b3a"))
		_row(g, "营业支出\n不含本次日结费用", UIKit.money(s.report.expenses), UIKit.RUST)
	else:
		_row(g, "当前现金", UIKit.money(s.cash), UIKit.RUST)
	if costs.legacy:
		_row(g, "旧版能源维护", UIKit.money(costs.maintenance))
	else:
		_row(g, "店铺电费" if paid else "预计电费", UIKit.money(costs.electricity))
		_row(g, "店铺清洁费" if paid else "固定清洁费", UIKit.money(costs.cleaning))
	var rent: float = s.report.get("settlementRent",s.report.rent) if paid else due
	_row(g, "本期租金已交房东" if Landlord.paid(s) else "待交房东的租金", UIKit.money(Model.rent_due(s.day)))
	_row(g, "本次支付" if paid else "本次日结预计支付", UIKit.money(costs.total + (rent if paid else 0)), UIKit.RUST)
	_row(g, "结余现金" if paid else "支付后现金", UIKit.money(s.report.cash if paid else s.cash - costs.total), UIKit.RUST)
	if not paid:
		_row(g, "剩余行动点", "%d AP" % int(s.ap))
	right.add_child(g)
	_add_cost_details(right, costs)
	cols.add_child(totals)
	if shell.mobile_mode():
		cols.move_child(totals,0)
		receipt.visible = false
		sc.vertical_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
		sc.custom_minimum_size.y = 0
		var receipt_toggle := UIKit.button("展开今日流水 · %d笔" % today.size(),"secondary",Vector2(0,44),16)
		receipt_toggle.toggle_mode = true
		receipt_toggle.toggled.connect(func(open: bool):
			receipt.visible = open
			receipt_toggle.text = ("收起" if open else "展开") + "今日流水 · %d笔" % today.size())
		cols.add_child(receipt_toggle)
		cols.move_child(receipt_toggle,1)
	body.add_child(cols)
	body.add_child(UIKit.rule())
	if s.phase == "open":
		var rent_pending := Landlord.outstanding(s) > 0
		var b := UIKit.button("请房东上门收租" if rent_pending else "打烊结算", "primary", Vector2(0, 64), 24)
		b.disabled = s.trade != null or bool(NightCrime.public_report(s).inspection.pending)
		if s.trade != null:
			body.add_child(UIKit.label("柜台还有客人：先交割或送客。", 18, UIKit.DANGER))
		b.pressed.connect(func():
			shell.sound("drop", -4, 0.8)
			if rent_pending:
				var host = shell.workspace_parent if shell.workspace_mode else shell
				host.close_workspace()
				Game.dispatch({"type":"CALL_LANDLORD"})
			else:
				Game.dispatch({"type":"SETTLE"}))
		body.add_child(b)
		if shell.mobile_mode(): body.move_child(b,2)
	elif s.phase == "report":
		if day >= 3 and not s.report.upgraded:
			var up := BoxContainer.new()
			up.add_theme_constant_override("separation", 14)
			upgrades_row = up
			for spec in [["lamp", "可变焦工作灯 · 120 Cr", "每天第一次鉴定不耗 AP；次日起用电 +1 Cr/日", s.upgrades.lamp], ["shelf", "模组陈列架 · 160 Cr", "合法货物陈列价提高 5%", s.upgrades.shelf]]:
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
		var continuation := _add_continuation(s)
		var next := UIKit.button("迎接第 %d 天" % (day + 1) if day < 21 or Life.is_endless(s) else "查看结局", "secondary" if continuation != null else "primary", Vector2(0, 64), 24)
		next.pressed.connect(func():
			if Game.dispatch({"type": "NEXT"}) and Game.state.phase == "open":
				shell.go("counter"))
		body.add_child(next)
		if shell.mobile_mode():
			body.move_child(next,2)
			if continuation != null: body.move_child(continuation,2)
	if shell.mobile_mode(): _add_night_controls(s)

func _add_continuation(s: Dictionary) -> VBoxContainer:
	if Life.continue_problem(s) != "": return null
	var choice := UIKit.vbox(8)
	choice.name = "campaign_continuation"
	choice.add_child(UIKit.label("继续后保留现金、库存、耗材、关系与账本，未完成委托照常履行。",18,UIKit.TEXT,false,true))
	var resume := UIKit.button("保留店铺，继续经营","primary",Vector2(0,64),24)
	resume.name = "continue_campaign"
	resume.pressed.connect(func():
		if Game.dispatch({"type":"CONTINUE_CAMPAIGN"}) and Game.state.phase == "open":
			shell.go("counter"))
	choice.add_child(resume)
	body.add_child(choice)
	return choice

func _add_cost_details(parent: VBoxContainer, costs: Dictionary) -> void:
	if costs.legacy:
		parent.add_child(UIKit.label("旧版账单保留原 20 Cr 能源维护；新费率从存档记录的启用日生效。", 16, UIKit.MUTED, false, true))
		return
	var toggle := UIKit.button(("收起" if costs_expanded else "展开") + "电费明细", "secondary", Vector2(0, 48), 18)
	toggle.name = "electricity_details_toggle"
	parent.add_child(toggle)
	var details := UIKit.vbox(6)
	details.name = "electricity_details"
	details.visible = costs_expanded
	parent.add_child(details)
	toggle.pressed.connect(func():
		costs_expanded = not costs_expanded
		details.visible = costs_expanded
		toggle.text = ("收起" if costs_expanded else "展开") + "电费明细")
	var receipt: Dictionary = costs.get("details", {})
	details.add_child(UIKit.label("设备每日费用 · 按首次启用时状态留存", 16, UIKit.INK, false, true))
	var groups := {}
	for entry in receipt.get("devices", []):
		var key: String = String(entry.get("type", "")) + ":" + String(entry.get("status", "normal"))
		if not groups.has(key): groups[key] = {"name":entry.name,"status":entry.status,"count":0,"cents":0}
		groups[key].count += int(entry.get("count", 1))
		groups[key].cents += int(entry.cents)
	for group in groups.values():
		details.add_child(UIKit.label("%s ×%d · %s · %s Cr/日" % [group.name, group.count, _device_status(group.status), Model.jnum(float(group.cents) / 100.0)], 16, UIKit.INK, false, true))
	details.add_child(UIKit.label("有效作业用电", 16, UIKit.INK, false, true))
	var usage_groups := {}
	for entry in receipt.get("usage", []):
		var key: String = String(entry.get("type", "")) + ":" + String(entry.get("key", "")).get_slice("|", 0) + ":" + String(entry.get("status", "normal"))
		if not usage_groups.has(key): usage_groups[key] = {"name":entry.name,"key":entry.get("key", ""),"status":entry.status,"count":0,"cents":0}
		usage_groups[key].count += int(entry.get("count", 1))
		usage_groups[key].cents += int(entry.get("cents", round(float(entry.get("cr", 0)) * 100)))
	for group in usage_groups.values():
		details.add_child(UIKit.label("%s · %s ×%d · %s Cr" % [group.name, _usage_label(group.key), group.count, Model.jnum(float(group.cents) / 100.0)], 16, UIKit.INK, false, true))
	if usage_groups.is_empty(): details.add_child(UIKit.label("今天尚无有效用电作业。", 16, UIKit.MUTED, false, true))
	details.add_child(UIKit.label("设备 %s + 作业 %s = %s Cr；仅电费总额向上取整一次，日结统一支付。清洁费固定 8 Cr/营业日。" % [Model.jnum(float(receipt.get("dailyCents", 0)) / 100.0), Model.jnum(float(receipt.get("usageCents", 0)) / 100.0), Model.jnum(float(receipt.get("totalCents", 0)) / 100.0)], 16, UIKit.MUTED, false, true))

func _device_status(status: String) -> String:
	return {"normal":"正常", "maintenance":"待维护（+20%）", "broken":"故障停机", "repair":"送修"}.get(status, status)

func _usage_label(key: String) -> String:
	return {"check":"检验", "scan":"来源扫描", "service":"维修复核", "forge":"加工复核"}.get(key.get_slice("|", 0), "有效读数/复核")

func on_changed(_p: Dictionary, _n: Dictionary, _a: Dictionary) -> void:
	_refresh()
	call_deferred("relayout")

## Exact values are published by the policy, without adding appraisal evidence.
func _add_night_controls(s: Dictionary) -> void:
	var q := NightCrime.insurance_quote(s)
	var section := UIKit.vbox(10)
	section.name = "night_insurance"
	body.add_child(section)
	section.add_child(UIKit.module_header("今晚失窃保险", "仅保今晚 · 每天主动购买，不自动续保", "NIGHT / %02d" % int(s.day)))
	var risk_text := "当前失窃概率 %.2f%%。" % (NightCrime.theft_chance_bp(s)/100.0)
	if int(s.day)<3:
		risk_text="前两晚享受保护，今晚不会发生夜间失窃。"
	elif int(s.day)>20 and not Life.is_endless(s):
		risk_text="夜间失窃时段已结束。"
	elif not s.inventory.any(func(item):return NightCrime.stealable(s,item)):
		risk_text="暂无可被盗的店铺自有库存，今晚无失窃损失。"
	elif NightCrime.thieves(s).is_empty():
		risk_text="在逃窃贼均已落网，今晚无失窃损失。"
	elif s.phase!="open":
		var snapshot: Dictionary=s.get("nightCrime",{}).get("nights",{}).get(str(int(s.day)),{})
		risk_text="今晚已结算，结算时失窃概率 %.2f%%。" % (int(snapshot.get("effectiveChanceBp",snapshot.get("chanceBp",NightCrime.theft_chance_bp(s))))/100.0)
	section.add_child(UIKit.label(risk_text+" 基础 3% + 每件名贵 0.08% + 每件珍稀 0.10%（最高 100%）；仅计可被盗库存，按可见型号档次计算。",17,UIKit.TEXT,false,true))
	var inspection: Dictionary = NightCrime.public_report(s).inspection
	section.add_child(UIKit.label("今日抽查概率 %.2f%% · 关注度×0.03%%。警官到场后可先整理，隔离箱不查；现场查到赃物合计罚30 Cr。" % float(inspection.get("chancePercent",NightCrime.inspection_chance(s.risk))),17,UIKit.TEXT,false,true))
	var history := UIKit.button("夜间失窃与查货记录", "secondary", Vector2(0, 52), 20)
	history.pressed.connect(func(): shell.open_night_report())
	section.add_child(history)
	section.add_child(UIKit.label("第 %d 晚 · 当前报价 %s · 已付 %s · 本次补付 %s" % [q.day, UIKit.money(q.premium), UIKit.money(q.paid), UIKit.money(q.due)], 19, UIKit.TEXT, false, true))
	var details := UIKit.vbox(10)
	details.visible = insurance_expanded
	var toggle := UIKit.button("收起保障明细" if insurance_expanded else "查看保障明细与承保清单", "secondary", Vector2(0,48), 18)
	toggle.pressed.connect(func():
		insurance_expanded = not insurance_expanded
		details.visible = insurance_expanded
		toggle.text = "收起保障明细" if insurance_expanded else "查看保障明细与承保清单")
	section.add_child(toggle)
	section.add_child(details)
	details.add_child(UIKit.label("保费 = max(5，向上取整(总市价 × 0.5% + 最高单件 × 3%))。100% 核定市价赔付，每件不超过已确认承保值。", 17, UIKit.TEXT, false, true))
	var paper := UIKit.plate(UIKit.paper_style(12))
	var rows := UIKit.vbox(8)
	paper.add_child(rows)
	for item in q.items:
		rows.add_child(UIKit.label("%s · %s\n当前核定 %s · %s" % [item.name, item.uid, UIKit.money(item.value), "已确认承保 " + UIKit.money(item.confirmedValue) if item.covered else "尚未承保，购买或更新后生效"], 18, UIKit.INK, false, true))
	if q.items.is_empty(): rows.add_child(UIKit.label("暂无可承保库存。", 18, UIKit.INK))
	details.add_child(paper)
	details.add_child(UIKit.label("仅店铺自有、来源已核且可存放的手表可保。顾客原物、抵押、订单、隔离封存、未完工作不保。新增商品及维修增值须更新保障；移出或降值不退费。", 17, UIKit.TEXT, false, true))
	details.add_child(UIKit.label(q.disclaimer, 17, UIKit.DANGER, false, true))
	var reason := NightCrime.insurance_problem(s)
	var needs_update: bool = not q.purchased
	for item in q.items:
		if not item.covered or item.value > item.confirmedValue: needs_update = true
	var purchase := UIKit.button("更新保障" if q.purchased else "购买今晚保险", "primary", Vector2(0, 56), 21)
	purchase.disabled = reason != "" or not needs_update
	purchase.pressed.connect(func(): Game.dispatch({"type":"UPDATE_INSURANCE" if q.purchased else "BUY_INSURANCE"}))
	section.add_child(purchase)
	section.add_child(UIKit.label(reason if reason != "" else "保障已确认；目前无需更新。" if not needs_update else "确认后立即支付 " + UIKit.money(q.due) + "，不消耗 AP。", 17, UIKit.DANGER if reason != "" else UIKit.TEXT, false, true))
	if bool(NightCrime.public_report(s).inspection.pending):
		section.add_child(UIKit.label("打烊前须完成查货；接待与核对不消耗 AP。", 18, UIKit.DANGER, false, true))
		var arrive := UIKit.button("接待查货警察", "primary", Vector2(0, 56), 21)
		arrive.disabled = s.trade != null
		arrive.pressed.connect(func():
			Game.dispatch({"type":"ARRIVE_INSPECTION"})
			shell.go("counter"))
		section.add_child(arrive)
