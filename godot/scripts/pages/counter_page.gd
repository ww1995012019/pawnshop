extends Page
## The counter: visitors walk in behind the counter, hand over or ask for goods,
## and haggle through the till. Every model change is played out on stage.

var MAT_POS := Vector2(960, 680)
var STAND := Vector2(650, 400)
const SHELF_SLOTS := [[1322, 302, 74], [1462, 278, 74], [1532, 278, 70], [1322, 380, 64], [1462, 368, 70], [1532, 368, 66], [1322, 457, 58]]

var customer: Customer
var mat_item: ItemSprite
var bell: ServiceBell
var shelf: Array = []
var bubble: PanelContainer
var bubble_label: Label
var screen: SubViewport
var scr := {}
var dial: Dial
var offer_label: Label
var chips: HFlowContainer
var actions: GridContainer
var footer: Label
var chosen_evidence := ""
var busy := false
var desk: Control
var stock_panel: PanelContainer
var terminal: PanelContainer
var offer_panel: PanelContainer
var event_title: Label
var event_description: Label
var event_state: Label
var event_button: Button
var stock_grid: GridContainer
var stock_count: Label
var event_panel: PanelContainer
var stage_root: Node2D
var surface: WorkSurface
var stage_header: Label
var stage_status: Label
var item_caption: Label
var item_details: Label
var idle_label: Label
var visitor_label: Label
var offer_button: Button
var stock_scroll: ScrollContainer
var bench_rect := Rect2()
var stage_rect := Rect2()
var drag_rect := Rect2()

func scene_name() -> String:
	return "counter"

func hint_text() -> String:
	var s := Game.state
	if s.phase != "open":
		return "今日已打烊，去日结页迎接明天。"
	if s.trade == null:
		return "按柜台左侧的服务铃，请下一位客人进来。" if s.cursor < Model.daily_visit_limit() else "今天的预约都接待完了：去维修、整理仓储或打烊。"
	var t: Dictionary = s.trade
	if t.locked:
		return "价格已锁定：确认钱货交割（1 AP）。"
	if t.kind == "sell" and not t.has("selectedUid"):
		return "顾客想买东西：在终端点「挑选货物」，推荐一件合格的自有货。"
	return "拖动实物、右键翻面；拿去鉴定取证，再转动旋钮出价。"

func toast_rect() -> Rect2:
	var r: Rect2 = shell.content_rect()
	return Rect2(r.position.x + 16, r.end.y - 150, 490, 135)

func enter() -> void:
	stage_root = Node2D.new()
	stage_root.material = Util.unshaded()
	add_world(stage_root, "top")
	_align_stage()
	surface = WorkSurface.new()
	surface.material = Util.unshaded()
	stage_root.add_child(surface)
	bell = ServiceBell.new()
	bell.material = Util.unshaded()
	stage_root.add_child(bell)
	_build_terminal()
	_build_desk()
	_build_bubble()
	relayout()
	_sync_world()
	_refresh()

func _align_stage() -> void:
	if stage_root != null:
		stage_root.global_transform = get_viewport().get_canvas_transform().affine_inverse()

func _stage_world(p: Vector2) -> Vector2:
	return stage_root.to_global(p)

# ---------------------------------------------------------------- world

func _sync_world() -> void:
	_build_shelf()
	var t = Game.state.trade
	if t == null:
		return
	_spawn_customer(t.npcId, false)
	var it = Model.trade_item(Game.state)
	if it != null:
		_spawn_mat_item(it, false)
	_say(t.line, false)

func _build_shelf() -> void:
	for n in shelf:
		if is_instance_valid(n):
			n.queue_free()
	shelf.clear()
	var shown := []
	for it in Game.state.inventory:
		if it.location == "display":
			shown.append(it)
	for i in mini(shown.size(), SHELF_SLOTS.size()):
		var slot: Array = SHELF_SLOTS[i]
		var it: Dictionary = shown[i]
		var s := ItemSprite.new()
		s.setup(it.defId, it.uid, slot[2] * shell.K)
		s.draggable = false
		s.position = shell.art(slot[0], slot[1]) - Vector2(0, slot[2] * shell.K * 0.42)
		s.body.modulate = Color(0.92, 0.95, 0.98)
		add_world(s, "mid")
		shelf.append(s)

func _spawn_customer(npc_id: String, walk: bool) -> void:
	if customer != null and is_instance_valid(customer):
		customer.queue_free()
	customer = Customer.new()
	customer.setup(npc_id)
	var h: float = customer.size.y
	customer.scale = Vector2.ONE * (164.0 / h)
	customer.position = STAND
	stage_root.add_child(customer)
	if walk:
		customer.walk_in(2350.0)

func _spawn_mat_item(it: Dictionary, animate: bool, from := Vector2.ZERO) -> void:
	if mat_item != null and is_instance_valid(mat_item):
		mat_item.queue_free()
	mat_item = ItemSprite.new()
	mat_item.setup(it.defId, it.uid, 290.0)
	mat_item.bounds = drag_rect
	mat_item.position = MAT_POS
	mat_item.dropped.connect(func():
		shell.sound("drop", -4.0, randf_range(0.9, 1.1))
		shell.dust_burst(mat_item.global_position + Vector2(0, 80), shell.layer("fg"))
		shell.shake = maxf(shell.shake, 0.22))
	mat_item.flipped.connect(func(_b): shell.sound("page", -6.0))
	stage_root.add_child(mat_item)
	if animate and not Game.prefs.reduced_motion:
		var start := stage_root.to_local(from)
		var dest := MAT_POS
		mat_item.position = start
		mat_item.body.rotation = -0.4
		var tw := create_tween()
		tw.tween_method(func(p: float):
			mat_item.position = start.lerp(dest, p)
			mat_item.lift = sin(p * PI) * 120.0 + (1.0 - p) * 30.0
			mat_item.body.rotation = lerpf(-0.4, 0.0, p), 0.0, 1.0, 0.55).set_trans(Tween.TRANS_SINE)
		tw.tween_callback(func(): mat_item.land())

# ---------------------------------------------------------------- counter desk

## One continuous operating surface keeps stock, the physical lot, and
## negotiation together while the room stays at the edges.
func _build_desk() -> void:
	desk = Control.new()
	desk.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(desk)
	event_panel = UIKit.plate(UIKit.box(Color("202a2b"), Color("65716b"), 2, 1, 16, 0))
	desk.add_child(event_panel)
	var event_row := UIKit.hbox(20)
	event_panel.add_child(event_row)
	var marker := UIKit.vbox(2)
	marker.custom_minimum_size.x = 150
	marker.add_child(UIKit.label("今日站内消息", 21, UIKit.AMBER))
	event_state = UIKit.label("", 17, UIKit.MUTED)
	marker.add_child(event_state)
	event_row.add_child(marker)
	var summary := UIKit.vbox(2)
	summary.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	event_title = UIKit.label("", 23, UIKit.TEXT)
	event_description = UIKit.label("", 18, UIKit.MUTED)
	event_description.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	summary.add_child(event_title)
	summary.add_child(event_description)
	event_row.add_child(summary)
	event_button = UIKit.button("处理消息", "secondary", Vector2(158, 52), 20, "speech")
	event_button.pressed.connect(func(): shell.open_events())
	event_row.add_child(event_button)

	stock_panel = UIKit.plate(UIKit.box(Color("182123"), Color("53625f"), 2, 1, 18, 0))
	desk.add_child(stock_panel)
	var sv := UIKit.vbox(12)
	stock_panel.add_child(sv)
	var sh := UIKit.hbox(8)
	sh.add_child(UIKit.label("在库货物", 25, UIKit.TEXT))
	sh.add_child(UIKit.spacer(false))
	stock_count = UIKit.label("", 18, UIKit.MUTED)
	sh.add_child(stock_count)
	sv.add_child(sh)
	sv.add_child(UIKit.rule())
	sv.add_child(UIKit.label("点击货物查看详情", 17, UIKit.MUTED))
	stock_scroll = ScrollContainer.new()
	stock_scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	stock_scroll.size_flags_vertical = Control.SIZE_EXPAND_FILL
	stock_scroll.follow_focus = true
	sv.add_child(stock_scroll)
	stock_grid = UIKit.grid(4, 7)
	stock_scroll.add_child(stock_grid)
	var open_stock := UIKit.button("整理仓储", "secondary", Vector2(0, 52), 20, "warehouse")
	open_stock.pressed.connect(func(): shell.go("warehouse"))
	sv.add_child(open_stock)

	stage_header = UIKit.label("柜台工作区", 27, UIKit.AMBER)
	stage_header.mouse_filter = Control.MOUSE_FILTER_IGNORE
	desk.add_child(stage_header)
	stage_status = UIKit.label("01 接待  /  02 鉴定  /  03 议价  /  04 交割", 18, UIKit.MUTED)
	stage_status.mouse_filter = Control.MOUSE_FILTER_IGNORE
	desk.add_child(stage_status)
	visitor_label = UIKit.label("暂无来客", 22, UIKit.TEXT)
	visitor_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	desk.add_child(visitor_label)
	item_caption = UIKit.label("当前交易物件", 25, UIKit.TEXT)
	item_caption.mouse_filter = Control.MOUSE_FILTER_IGNORE
	desk.add_child(item_caption)
	item_details = UIKit.label("", 18, UIKit.MUTED)
	item_details.mouse_filter = Control.MOUSE_FILTER_IGNORE
	desk.add_child(item_details)
	idle_label = UIKit.label("按服务铃接待下一位来客", 23, UIKit.MUTED)
	idle_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	idle_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	desk.add_child(idle_label)

func relayout() -> void:
	if desk == null or surface == null:
		return
	_align_stage()
	var r: Rect2 = shell.content_rect()
	bench_rect = Rect2(r.position + Vector2(12, 8), r.size - Vector2(24, 8))
	var body_top := bench_rect.position.y + 104.0
	var body_h := bench_rect.size.y - 104.0
	var left_w := 330.0
	var right_w := 500.0
	stage_rect = Rect2(bench_rect.position.x + left_w + 14, body_top, bench_rect.size.x - left_w - right_w - 28, body_h)
	event_panel.position = bench_rect.position
	event_panel.size = Vector2(bench_rect.size.x, 90)
	stock_panel.position = Vector2(bench_rect.position.x, body_top)
	stock_panel.size = Vector2(left_w, body_h)
	terminal.position = Vector2(bench_rect.end.x - right_w, body_top)
	terminal.size = Vector2(right_w, body_h)
	stage_header.position = stage_rect.position + Vector2(24, 18)
	stage_status.position = stage_rect.position + Vector2(24, 60)
	visitor_label.position = stage_rect.position + Vector2(192, 108)
	visitor_label.size = Vector2(stage_rect.size.x - 218, 32)
	item_caption.position = stage_rect.position + Vector2(24, 272)
	item_details.position = stage_rect.position + Vector2(24, 310)
	item_details.size = Vector2(stage_rect.size.x - 48, 32)
	idle_label.position = stage_rect.position + Vector2(24, 390)
	idle_label.size = Vector2(stage_rect.size.x - 48, 90)
	STAND = stage_rect.position + Vector2(100, 252)
	MAT_POS = Vector2(stage_rect.get_center().x + 28, stage_rect.position.y + 525)
	drag_rect = Rect2(stage_rect.position + Vector2(160, 400), Vector2(maxf(80, stage_rect.size.x - 300), maxf(35, body_h - 500)))
	MAT_POS.y = minf(MAT_POS.y, stage_rect.end.y - 120)
	bell.position = Vector2(stage_rect.position.x + 84, stage_rect.end.y - 48)
	if is_instance_valid(customer) and not customer.walking:
		customer.position = STAND
	if is_instance_valid(mat_item):
		mat_item.bounds = drag_rect
		if not mat_item.dragging:
			mat_item.position = MAT_POS
	if bubble != null:
		bubble.position = stage_rect.position + Vector2(192, 147)
		bubble.custom_minimum_size = Vector2(stage_rect.size.x - 216, 100)
		bubble.size = Vector2(stage_rect.size.x - 216, 100)
	surface.area = bench_rect
	surface.stage = stage_rect
	surface.queue_redraw()

func _refresh_desk() -> void:
	if desk == null:
		return
	var event = Game.today_event()
	var state_text := "无事件" if event == null else ("已处理" if Game.event_done() else "待处理")
	event_state.text = "第 %02d 天 · %s" % [int(Game.state.day), state_text]
	event_state.add_theme_color_override("font_color", UIKit.AMBER if event != null and not Game.event_done() else UIKit.MUTED)
	event_title.text = event.title if event != null else "今日营业准备"
	event_description.text = event.description if event != null else "整理货物，准备迎接下一位来客。"
	event_button.disabled = event == null
	event_button.text = "查看消息" if Game.event_done() else "处理消息"
	UIKit.clear(stock_grid)
	var items: Array = Game.state.inventory
	stock_count.text = "%02d 件" % items.size()
	for i in maxi(20, ceili(items.size() / 4.0) * 4):
		var slot := UIKit.button("", "chip", Vector2(67, 76), 14)
		slot.tooltip_text = "空货位"
		if i < items.size():
			var it: Dictionary = items[i]
			slot.icon = UIKit.item_icon(it.defId)
			slot.expand_icon = true
			slot.add_theme_constant_override("icon_max_width", 58)
			slot.tooltip_text = "%s · 品相%s" % [GameData.def(it.defId).name, UIKit.pct(it.condition)]
			var uid: String = it.uid
			slot.pressed.connect(func(): shell.go("warehouse", uid))
		else:
			slot.disabled = true
		stock_grid.add_child(slot)
	var t = Game.state.trade
	var it = Model.trade_item(Game.state) if t != null else null
	visitor_label.text = (GameData.npc(t.npcId).name + " · " + GameData.npc(t.npcId).title) if t != null else "柜台空闲 · 等待来客"
	item_caption.text = GameData.def(it.defId).name if it != null else "当前交易物件"
	item_details.text = ("品相 %s  ·  %s  ·  已取证 %d/6" % [UIKit.pct(it.condition), "正常运转" if it.working else "存在故障", Model.evidence_count(it)]) if it != null else "来客交来的货物将在这里展示"
	idle_label.visible = it == null
	idle_label.text = "先挑选一件货物推荐给顾客" if t != null else "按服务铃接待下一位来客"

# ---------------------------------------------------------------- terminal

func _build_terminal() -> void:
	terminal = UIKit.plate(UIKit.box(Color("182123"), Color("65716b"), 2, 1, 18, 0))
	add_child(terminal)
	var panel := terminal
	var v := UIKit.vbox(12)
	panel.add_child(v)
	v.add_child(UIKit.label("交易终端", 25, UIKit.AMBER))
	screen = SubViewport.new()
	screen.size = Vector2i(440, 190)
	screen.render_target_update_mode = SubViewport.UPDATE_ALWAYS
	add_child(screen)
	var bgc := ColorRect.new()
	bgc.color = Color("041010")
	bgc.size = Vector2(440, 190)
	screen.add_child(bgc)
	scr.head = _scr_label(Vector2(22, 14), 20, UIKit.CYAN)
	scr.price = _scr_label(Vector2(18, 36), 60, UIKit.AMBER, true)
	scr.line1 = _scr_label(Vector2(22, 108), 19, UIKit.CYAN)
	scr.line2 = _scr_label(Vector2(22, 138), 19, Color("ffb48a"))
	scr.line3 = _scr_label(Vector2(22, 166), 17, UIKit.MUTED)
	var crt := TextureRect.new()
	crt.texture = screen.get_texture()
	crt.custom_minimum_size = Vector2(440, 190)
	crt.stretch_mode = TextureRect.STRETCH_SCALE
	var frame := UIKit.plate(UIKit.inset_style(0))
	frame.add_child(crt)
	v.add_child(frame)
	offer_panel = UIKit.plate(UIKit.inset_style(12))
	var offer := offer_panel
	var oh := UIKit.hbox(16)
	offer.add_child(oh)
	dial = Dial.new()
	dial.custom_minimum_size = Vector2(134, 134)
	dial.changed.connect(func(val):
		_update_offer_value(val)
		shell.sound("click", -20, 1.7))
	oh.add_child(dial)
	var ov := UIKit.vbox(4)
	ov.alignment = BoxContainer.ALIGNMENT_CENTER
	ov.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	ov.add_child(UIKit.label("我的出价", 18, UIKit.MUTED))
	offer_label = UIKit.label("—", 46, UIKit.AMBER, true)
	ov.add_child(offer_label)
	ov.add_child(UIKit.label("上下拖动旋钮 · 滚轮 ±5", 15, UIKit.MUTED))
	oh.add_child(ov)
	v.add_child(offer)
	var ev := UIKit.vbox(6)
	ev.name = "evidence-row"
	ev.add_child(UIKit.label("援引物证（可选）", 16, UIKit.MUTED))
	chips = HFlowContainer.new()
	chips.add_theme_constant_override("h_separation", 8)
	chips.add_theme_constant_override("v_separation", 8)
	ev.add_child(chips)
	v.add_child(ev)
	actions = UIKit.grid(2, 10)
	v.add_child(actions)
	footer = UIKit.label("", 17, UIKit.MUTED, false, true)
	v.add_child(footer)

func _scr_label(pos: Vector2, size: int, color: Color, is_mono := false) -> Label:
	var l := UIKit.label("", size, color, is_mono)
	l.position = pos
	screen.add_child(l)
	return l

func _act(text: String, kind: String, fn: Callable, enabled := true, wide := false, tip := "") -> Button:
	var b := UIKit.button(text, kind, Vector2(0, 58), 21)
	b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	b.disabled = not enabled or busy
	b.tooltip_text = tip
	b.pressed.connect(func():
		shell.sound("click", -6)
		fn.call())
	actions.add_child(b)
	if wide:
		var pad := Control.new()
		actions.add_child(pad)
		b.size_flags_stretch_ratio = 2
	return b

func _refresh() -> void:
	_refresh_desk()
	var s := Game.state
	var t = s.trade
	offer_button = null
	UIKit.clear(actions)
	UIKit.clear(chips)
	var dial_on := false
	if t == null:
		var closed: bool = s.cursor >= Model.daily_visit_limit()
		scr.head.text = "今日营业中" if s.phase == "open" else "已打烊"
		scr.price.text = "%d/%d" % [mini(int(s.cursor) + 1, Model.daily_visit_limit()), Model.daily_visit_limit()]
		var nid := Model.market_npc_id(s)
		if closed:
			scr.line1.text = "六位预约已处理"
			scr.line2.text = "整理仓储、维修或履约后可以打烊"
		else:
			scr.line1.text = "下一位：%s · %s" % [GameData.npc(nid).name, GameData.npc(nid).title]
			if int(s.cursor) % 2 == 0:
				var pv := Model.stock_preview(s)
				scr.line2.text = "来售：%s · 约 %s–%s Cr" % [GameData.def(pv.defId).name, Model.jnum(pv.priceBand[0]), Model.jnum(pv.priceBand[1])]
			else:
				scr.line2.text = "来购：" + Model.customer_need(nid).left(22)
		scr.line3.text = "按服务铃接客 · 每位消耗交割 1 AP"
		offer_label.text = "—"
		_act("接待下一位来客", "primary", func(): _ring(), s.phase == "open" and not closed and s.ap >= 1)
		_act("打烊结算", "secondary", func(): shell.go("report"))
		footer.text = "柜台陈列：%d 件 · 可在仓储上架" % shelf.size()
	else:
		var it = Model.trade_item(s)
		var npc := GameData.npc(t.npcId)
		var buy: bool = t.kind == "buy"
		scr.head.text = ("来客报价 · " if buy else "顾客出价 · ") + npc.name
		scr.price.text = Model.jnum(t.price) + " Cr"
		if it != null:
			var e := Model.estimate(it)
			scr.line1.text = "%s · 估值 %s" % [GameData.def(it.defId).name.left(8), Model.jnum(e.low) if e.exact else "%s–%s" % [Model.jnum(e.low), Model.jnum(e.high)]]
			scr.line2.text = "物证 %d · 议价 %d/3%s" % [Model.evidence_count(it), int(t.rounds), " · 已锁价" if t.locked else ""]
		else:
			scr.line1.text = "需求：" + Model.customer_need(t.npcId).left(20)
			scr.line2.text = "请挑选一件合格的自有货推荐"
		scr.line3.text = "现金 %s · 行动 %d AP" % [UIKit.money(s.cash), int(s.ap)]
		if t.locked:
			_act("确认钱货交割", "primary", func(): Game.dispatch({"type": "DELIVER", "tradeId": t.id}), s.ap >= 1)
			_act("取消交易", "secondary", func(): Game.dispatch({"type": "REFUSE"}))
		elif it == null:
			_act("挑选货物", "primary", _pick_goods)
			_act("送客", "secondary", func(): Game.dispatch({"type": "REFUSE"}))
		else:
			dial_on = true
			var b := Model.offer_bounds(s, t, it)
			dial.min_value = 1
			dial.max_value = int(maxf(1, b.max))
			var drafts: Dictionary = Game.get_meta("counter_offer_drafts", {})
			var initial := int(t.price * (0.8 if buy else 1.15))
			dial.set_value(int(drafts.get(t.id, initial)), false)
			_update_offer_value(dial.value)
			for e in it.evidence:
				if not GameData.def(it.defId).tools.has(e):
					continue
				var chip := UIKit.button(GameData.tool(e).short, "primary" if chosen_evidence == e else "chip", Vector2(0, 40), 17)
				var eid: String = e
				chip.pressed.connect(func():
					chosen_evidence = "" if chosen_evidence == eid else eid
					_refresh())
				chips.add_child(chip)
			if chips.get_child_count() == 0:
				chips.add_child(UIKit.label("还没有相关物证：先拿去鉴定。", 16, UIKit.MUTED))
			offer_button = _act("出价 " + UIKit.money(dial.value), "primary", func(): _offer())
			_act("接受报价", "good", func(): Game.dispatch({"type": "ACCEPT"}))
			_act("拿去鉴定", "secondary", func(): shell.go("inspect", it.uid))
			if buy:
				_act("签抵押合同", "secondary", func(): Game.dispatch({"type": "PAWN", "tradeId": t.id}), Model.evidence_count(it) >= 2, false, "需两条物证；付估值约 40% 本金，3 天赎期")
			else:
				_act("换一件", "secondary", _pick_goods)
			_act("送客", "danger", func(): Game.dispatch({"type": "REFUSE"}))
		footer.text = "%s：%s" % [npc.name, Model.customer_need(t.npcId)]
	dial.enabled = dial_on and not busy
	offer_panel.visible = dial_on
	chips.get_parent().visible = dial_on
	for k in ["line1", "line2", "line3"]:
		var l: Label = scr[k]
		if l.text.length() > 21:
			l.text = l.text.left(20) + "…"
	dial.queue_redraw()

func _update_offer_value(value: int) -> void:
	offer_label.text = UIKit.money(value)
	if is_instance_valid(offer_button):
		offer_button.text = "出价 " + UIKit.money(value)
	var t = Game.state.trade
	if t != null:
		var drafts: Dictionary = Game.get_meta("counter_offer_drafts", {})
		drafts[t.id] = value
		Game.set_meta("counter_offer_drafts", drafts)

func _offer() -> void:
	var a := {"type": "OFFER", "price": dial.value}
	if chosen_evidence != "":
		a.evidence = chosen_evidence
	Game.dispatch(a)

func _pick_goods() -> void:
	var t = Game.state.trade
	var m: Array = shell.modal("为 %s 挑选货物" % GameData.npc(t.npcId).name, 1180)
	var body: VBoxContainer = m[0]
	body.add_child(UIKit.label("需求：" + Model.customer_need(t.npcId), 20, UIKit.CYAN, false, true))
	var g := UIKit.grid(4, 12)
	for it in Game.state.inventory:
		if it.owner != "shop":
			continue
		var why = Model.sale_eligibility(it, t.npcId)
		var card := UIKit.plate(UIKit.inset_style(10))
		card.custom_minimum_size = Vector2(266, 0)
		var cv := UIKit.vbox(6)
		card.add_child(cv)
		var pic := TextureRect.new()
		pic.texture = UIKit.item_icon(it.defId)
		pic.custom_minimum_size = Vector2(0, 120)
		pic.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		pic.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		cv.add_child(pic)
		cv.add_child(UIKit.label(GameData.def(it.defId).name, 19, UIKit.TEXT))
		cv.add_child(UIKit.label("品相 %s · %s · 物证 %d" % [UIKit.pct(it.condition), "正常" if it.working else "故障", Model.evidence_count(it)], 15, UIKit.MUTED))
		var b := UIKit.button("推荐这件" if why == null else "不符合", "primary" if why == null else "chip", Vector2(0, 44), 17)
		b.disabled = why != null
		if why != null:
			b.tooltip_text = why
			cv.add_child(UIKit.label(why, 14, UIKit.DANGER, false, true))
		var uid: String = it.uid
		b.pressed.connect(func():
			m[1].call()
			Game.dispatch({"type": "SELECT_TRADE", "uid": uid}))
		cv.add_child(b)
		g.add_child(card)
	var sc := ScrollContainer.new()
	sc.custom_minimum_size = Vector2(0, 620)
	sc.add_child(g)
	body.add_child(sc)

# ---------------------------------------------------------------- bubble

func _build_bubble() -> void:
	bubble = UIKit.plate(UIKit.box(Color("232e2e"), Color("52635d"), 2, 1, 14, 0))
	bubble.custom_minimum_size = Vector2(500, 100)
	bubble.modulate.a = 0.0
	bubble.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(bubble)
	bubble_label = UIKit.label("", 22, UIKit.TEXT, false, true)
	bubble_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	bubble.add_child(bubble_label)

func _say(text: String, type := true, mood := "") -> void:
	if customer == null or not is_instance_valid(customer):
		return
	if mood != "":
		customer.set_mood(mood)
	bubble_label.text = text
	var dur := text.length() * 0.035
	customer.say(dur + 0.2)
	bubble.modulate.a = 1.0
	if type and not Game.prefs.reduced_motion:
		bubble_label.visible_ratio = 0.0
		create_tween().tween_property(bubble_label, "visible_ratio", 1.0, dur)
		for i in int(text.length() / 4):
			get_tree().create_timer(i * 0.14).timeout.connect(func(): shell.sound("click", -26.0, randf_range(1.8, 2.3)))
	else:
		bubble_label.visible_ratio = 1.0

func _hide_bubble() -> void:
	if Game.prefs.reduced_motion:
		bubble.modulate.a = 0.0
	else:
		create_tween().tween_property(bubble, "modulate:a", 0.0, 0.2)

# ---------------------------------------------------------------- flow

func _ring() -> void:
	bell.strike()
	shell.sound("check", -2.0, 1.25)
	Game.dispatch({"type": "ARRIVE"})

func on_changed(prev: Dictionary, next: Dictionary, a: Dictionary) -> void:
	var pt = prev.trade
	var nt = next.trade
	match a.type:
		"ARRIVE":
			if pt == null and nt != null:
				busy = true
				_refresh()
				await get_tree().create_timer(0.35).timeout
				shell.sound("open", -6)
				_spawn_customer(nt.npcId, true)
				await customer.arrived
				customer.lean_in()
				if nt.kind == "buy" and nt.item != null:
					await get_tree().create_timer(0.2).timeout
					_spawn_mat_item(nt.item, true, shell.layer("fg").to_local(customer.hands()))
					await get_tree().create_timer(0.6).timeout
				busy = false
				_say(nt.line)
		"SELECT_TRADE":
			var it = Model.trade_item(next)
			if it != null:
				_spawn_mat_item(it, true, Vector2(-200, 760))
				_say(nt.line, true, "focused")
		"OFFER":
			if nt == null:
				await _leave_with_goods(pt, "reject")
			elif nt.locked:
				customer.cheer()
				_say(nt.line, true, "happy")
			else:
				var insulting: bool = String(nt.line).begins_with("这个数太离谱")
				if insulting:
					customer.shake_head()
					customer.lean_back()
					shell.sound("reject", -3)
					shell.shake = 0.25
					_say(nt.line, true, "reject")
				else:
					customer.lean_in()
					_say(nt.line, true, "question")
		"ACCEPT":
			if nt != null and nt.locked:
				customer.nod()
				_say(nt.line, true, "happy")
		"REFUSE":
			if pt != null:
				await _leave_with_goods(pt, "tired")
		"DELIVER", "PAWN":
			if pt != null and nt == null:
				var sold = Model.trade_item(prev)
				await _deal(pt, a.type == "PAWN", GameData.def(sold.defId).name if sold != null else "货物")
		"CHECK":
			if nt != null and customer != null:
				customer.set_mood("focused")
	_refresh()
	_build_shelf_if_changed(prev, next)

func _build_shelf_if_changed(prev: Dictionary, next: Dictionary) -> void:
	var count := func(s: Dictionary) -> int:
		var n := 0
		for it in s.inventory:
			if it.location == "display":
				n += 1
		return n
	if count.call(prev) != count.call(next):
		_build_shelf()

func _leave_with_goods(t: Dictionary, mood: String) -> void:
	busy = true
	_refresh()
	if customer == null:
		busy = false
		return
	_say(Game.state.notice.split(" ")[0] if Game.state.notice != "" else "改天再谈。", true, mood)
	if mood == "reject":
		customer.shake_head()
	await get_tree().create_timer(1.3).timeout
	if mat_item != null and is_instance_valid(mat_item):
		var keep: bool = t.kind == "sell"
		var start := mat_item.global_position
		var dest: Vector2 = Vector2(-200, 760) if keep else customer.hands()
		var tw := create_tween()
		tw.tween_method(func(p: float):
			mat_item.global_position = start.lerp(dest, p) + Vector2(0, -sin(p * PI) * 120.0)
			mat_item.modulate.a = 1.0 - p * p, 0.0, 1.0, 0.5)
		await tw.finished
		mat_item.queue_free()
	_hide_bubble()
	customer.walk_out(-500.0)
	await customer.left
	customer.queue_free()
	busy = false
	_refresh()

func _deal(t: Dictionary, pawn: bool, item_name: String) -> void:
	busy = true
	_refresh()
	var buy: bool = t.kind == "buy"
	customer.cheer()
	_say("痛快！东西归你了。" if buy else "好东西，钱给你点清。", true, "happy")
	var till: Vector2 = Vector2(shell.content_rect().end.x - 240, shell.content_rect().position.y + 140)
	var hand: Vector2 = shell.world_to_ui(customer.hands())
	var price: float = absf(Game.state.ledger[-1].amount) if not Game.state.ledger.is_empty() else t.price
	var bills := clampi(int(price / 20), 3, 9)
	for i in bills:
		get_tree().create_timer(0.08 * i).timeout.connect(_bill.bind(till if buy else hand, hand if buy else till, i))
	await get_tree().create_timer(0.08 * bills + 0.5).timeout
	_receipt(t, price, pawn, item_name)
	await get_tree().create_timer(1.1).timeout
	customer.nod()
	if mat_item != null and is_instance_valid(mat_item):
		var start := mat_item.global_position
		var dest: Vector2 = shell.art(1470, 250) if buy else customer.hands()
		var tw := create_tween()
		tw.tween_method(func(p: float):
			mat_item.global_position = start.lerp(dest, p) + Vector2(0, -sin(p * PI) * 160.0)
			mat_item.scale = Vector2.ONE * lerpf(1.0, 0.25 if buy else 0.6, p)
			mat_item.modulate.a = 1.0 - smoothstep(0.7, 1.0, p), 0.0, 1.0, 0.8).set_trans(Tween.TRANS_SINE)
		tw.tween_callback(mat_item.queue_free)
	await get_tree().create_timer(0.5).timeout
	_hide_bubble()
	customer.walk_out(-500.0)
	await customer.left
	customer.queue_free()
	busy = false
	_refresh()

func _bill(from: Vector2, to: Vector2, i: int) -> void:
	var b := PanelContainer.new()
	b.add_theme_stylebox_override("panel", UIKit.box(Color("9fc7a2"), Color("3f6a4b"), 3, 2, 6, 3))
	var l := UIKit.label("20 Cr", 18, Color("1d3a28"), true)
	b.add_child(l)
	shell.fx.add_child(b)
	b.reset_size()
	b.pivot_offset = b.size * 0.5
	var ctrl := (from + to) * 0.5 + Vector2(randf_range(-80, 80), -260)
	var tw := create_tween()
	tw.tween_method(func(p: float):
		var q := from.lerp(ctrl, p).lerp(ctrl.lerp(to, p), p)
		b.position = q - b.size * 0.5
		b.rotation = sin(p * PI * 2.0 + i) * 0.6
		b.scale = Vector2.ONE * (1.0 - p * 0.35), 0.0, 1.0, 0.55).set_trans(Tween.TRANS_SINE)
	tw.tween_callback(func():
		shell.sound("coin", -5.0, randf_range(0.95, 1.15))
		b.queue_free())

func _receipt(t: Dictionary, price: float, pawn: bool, item_name: String) -> void:
	var r: Rect2 = shell.content_rect()
	var paper := UIKit.plate(UIKit.paper_style(18))
	paper.custom_minimum_size = Vector2(380, 0)
	var v := UIKit.vbox(4)
	paper.add_child(v)
	v.add_child(UIKit.label("回环九号 · 轨道旧货局", 18, UIKit.INK))
	v.add_child(UIKit.label(("抵押凭据" if pawn else ("收购凭据" if t.kind == "buy" else "销售凭据")) + "  No.%04d" % Game.state.completedTrades.size(), 18, UIKit.INK))
	v.add_child(UIKit.label("———————————————", 16, Color("8c7a5c")))
	v.add_child(UIKit.label(item_name, 22, UIKit.INK))
	v.add_child(UIKit.label(("本金 " if pawn else "成交 ") + UIKit.money(price), 24, UIKit.RUST, true))
	v.add_child(UIKit.label("来客  " + GameData.npc(t.npcId).name, 18, UIKit.INK))
	shell.fx.add_child(paper)
	paper.reset_size()
	paper.position = Vector2(r.end.x - 480 - paper.size.x - 20, r.position.y + 40)
	paper.rotation = -0.03
	paper.modulate.a = 0.0
	var tw := create_tween()
	tw.tween_property(paper, "modulate:a", 1.0, 0.15)
	tw.parallel().tween_property(paper, "position:y", paper.position.y + 30, 0.6).set_trans(Tween.TRANS_SINE)
	tw.tween_callback(func():
		var stamp := UIKit.label("已抵押" if pawn else ("已收购" if t.kind == "buy" else "已售出"), 52, Color(0.75, 0.12, 0.1, 0.85))
		stamp.position = Vector2(170, 120)
		stamp.pivot_offset = Vector2(80, 30)
		stamp.rotation = -0.22
		stamp.scale = Vector2.ONE * 2.4
		stamp.modulate.a = 0.0
		paper.add_child(stamp)
		var st := create_tween()
		st.tween_property(stamp, "scale", Vector2.ONE, 0.12).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)
		st.parallel().tween_property(stamp, "modulate:a", 1.0, 0.08)
		st.tween_callback(func():
			shell.shake = 0.5
			shell.sound("drop", 0.0, 0.7)))
	tw.tween_interval(2.6)
	tw.tween_property(paper, "modulate:a", 0.0, 0.5)
	tw.tween_callback(paper.queue_free)

# ---------------------------------------------------------------- input & frame

func _unhandled_input(e: InputEvent) -> void:
	if shell.modal_open() or busy:
		return
	var p: Vector2 = shell.world_mouse()
	if e is InputEventMouseButton and e.pressed:
		var mb := e as InputEventMouseButton
		if mb.button_index == MOUSE_BUTTON_LEFT:
			if bell.hit_test(p):
				if Game.state.trade == null and Game.state.phase == "open":
					_ring()
				else:
					bell.strike()
					shell.sound("check", -8, 1.3)
				return
			if mat_item != null and is_instance_valid(mat_item) and mat_item.contains(p):
				mat_item.begin_drag(p)
				shell.sound("click", -10, 0.8)
				return
			for s in shelf:
				if is_instance_valid(s) and s.contains(p):
					shell.go("inspect", s.uid)
					return
			if customer != null and is_instance_valid(customer) and Game.state.trade != null and _over_customer(p):
				shell.open_people(Game.state.trade.npcId)
		elif mb.button_index == MOUSE_BUTTON_RIGHT and mat_item != null and is_instance_valid(mat_item):
			mat_item.flip()
	elif e is InputEventMouseButton and not e.pressed and mat_item != null and is_instance_valid(mat_item):
		mat_item.end_drag()
	elif e is InputEventKey and e.pressed and (e as InputEventKey).keycode == KEY_F and mat_item != null and is_instance_valid(mat_item):
		mat_item.flip()

func _over_customer(p: Vector2) -> bool:
	var local := customer.to_local(p)
	return absf(local.x) < customer.size.x * 0.4 and local.y < -customer.size.y * 0.4 and local.y > -customer.size.y

func _process(_delta: float) -> void:
	_align_stage()
	var p: Vector2 = shell.world_mouse()
	if mat_item != null and is_instance_valid(mat_item):
		if mat_item.dragging:
			mat_item.drag_to(p)
		mat_item.hover = lerpf(mat_item.hover, 1.0 if mat_item.contains(p) or mat_item.dragging else 0.0, 0.2)
	if customer != null and is_instance_valid(customer):
		customer.look = clampf((p.x - customer.global_position.x) / 700.0, -1.0, 1.0)


class WorkSurface extends Node2D:
	var area := Rect2()
	var stage := Rect2()
	func _draw() -> void:
		draw_style_box(UIKit.box(Color("10191c"), Color("7e8a80"), 3, 2, 0, 0), area.grow(8))
		draw_rect(stage, Color("1c2b2e"))
		draw_rect(Rect2(stage.position, Vector2(stage.size.x, 94)), Color("263537"))
		draw_rect(Rect2(stage.position + Vector2(16, 98), Vector2(stage.size.x - 32, 164)), Color("132022"))
		var mat := Rect2(stage.position + Vector2(18, 354), Vector2(stage.size.x - 36, maxf(80, stage.size.y - 374)))
		draw_rect(mat, Color("223c3e"))
		draw_rect(mat.grow(-5), Color("3d5552"), false, 1)
		for x in range(int(mat.position.x + 28), int(mat.end.x - 10), 40):
			for y in range(int(mat.position.y + 28), int(mat.end.y - 10), 40):
				draw_circle(Vector2(x,y), 1, Color(0.5,0.7,0.66,0.1))
		for corner in [area.position, Vector2(area.end.x, area.position.y), area.end, Vector2(area.position.x, area.end.y)]:
			draw_circle(corner, 3, Color("9caa9d"))
