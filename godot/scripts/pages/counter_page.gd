extends Page
## The counter: visitors walk in behind the counter, hand over or ask for goods,
## and haggle through the till. Every model change is played out on stage.

const MAT_POS := Vector2(1000, 800)
const STAND := Vector2(900, 1015)
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
var trade_id := ""

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
	return Rect2(24, 430, 560, 300)

func enter() -> void:
	bell = ServiceBell.new()
	bell.position = Vector2(340, 800)
	bell.material = Util.unshaded()
	add_world(bell, "fg")
	_build_terminal()
	_build_bubble()
	_sync_world()
	_refresh()

# ---------------------------------------------------------------- world

func _sync_world() -> void:
	_build_shelf()
	var t = Game.state.trade
	if t == null:
		return
	trade_id = t.id
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
	customer.scale = Vector2.ONE * (850.0 / h)
	customer.position = STAND
	add_world(customer, "mid")
	if walk:
		customer.walk_in(2350.0)

func _spawn_mat_item(it: Dictionary, animate: bool, from := Vector2.ZERO) -> void:
	if mat_item != null and is_instance_valid(mat_item):
		mat_item.queue_free()
	mat_item = ItemSprite.new()
	mat_item.setup(it.defId, it.uid, 300.0)
	mat_item.bounds = Rect2(520, 700, 940, 170)
	mat_item.position = MAT_POS
	mat_item.dropped.connect(func():
		shell.sound("drop", -4.0, randf_range(0.9, 1.1))
		shell.dust_burst(mat_item.global_position + Vector2(0, 80), shell.layer("fg"))
		shell.shake = maxf(shell.shake, 0.22))
	mat_item.flipped.connect(func(_b): shell.sound("page", -6.0))
	add_world(mat_item, "fg")
	if animate and not Game.prefs.reduced_motion:
		var start := from
		var dest := MAT_POS
		mat_item.position = start
		mat_item.body.rotation = -0.4
		var tw := create_tween()
		tw.tween_method(func(p: float):
			mat_item.position = start.lerp(dest, p)
			mat_item.lift = sin(p * PI) * 120.0 + (1.0 - p) * 30.0
			mat_item.body.rotation = lerpf(-0.4, 0.0, p), 0.0, 1.0, 0.55).set_trans(Tween.TRANS_SINE)
		tw.tween_callback(func(): mat_item.land())

# ---------------------------------------------------------------- terminal

func _build_terminal() -> void:
	var panel := side_panel(480)
	var v := UIKit.vbox(14)
	panel.add_child(v)
	screen = SubViewport.new()
	screen.size = Vector2i(440, 230)
	screen.render_target_update_mode = SubViewport.UPDATE_ALWAYS
	add_child(screen)
	var bgc := ColorRect.new()
	bgc.color = Color("041010")
	bgc.size = Vector2(440, 230)
	screen.add_child(bgc)
	scr.head = _scr_label(Vector2(22, 14), 20, UIKit.CYAN)
	scr.price = _scr_label(Vector2(18, 40), 76, UIKit.AMBER, true)
	scr.line1 = _scr_label(Vector2(22, 136), 19, UIKit.CYAN)
	scr.line2 = _scr_label(Vector2(22, 168), 19, Color("ffb48a"))
	scr.line3 = _scr_label(Vector2(22, 196), 17, UIKit.MUTED)
	var crt := TextureRect.new()
	crt.texture = screen.get_texture()
	crt.custom_minimum_size = Vector2(440, 230)
	crt.stretch_mode = TextureRect.STRETCH_SCALE
	var m := ShaderMaterial.new()
	m.shader = load("res://shaders/crt.gdshader")
	crt.material = m
	var frame := UIKit.plate(UIKit.inset_style(0))
	frame.add_child(crt)
	v.add_child(frame)
	var offer := UIKit.plate(UIKit.inset_style(12))
	var oh := UIKit.hbox(16)
	offer.add_child(oh)
	dial = Dial.new()
	dial.changed.connect(func(val):
		offer_label.text = UIKit.money(val)
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
	v.add_child(UIKit.spacer())
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
	var s := Game.state
	var t = s.trade
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
			if trade_id != t.id or dial.value > dial.max_value:
				dial.set_value(int(t.price * (0.8 if buy else 1.15)), false)
				trade_id = t.id
			offer_label.text = UIKit.money(dial.value)
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
			_act("出价 " + UIKit.money(dial.value), "primary", func(): _offer())
			_act("接受报价", "good", func(): Game.dispatch({"type": "ACCEPT"}))
			_act("拿去鉴定", "secondary", func(): shell.go("inspect", it.uid))
			if buy:
				_act("签抵押合同", "secondary", func(): Game.dispatch({"type": "PAWN", "tradeId": t.id}), Model.evidence_count(it) >= 2, false, "需两条物证；付估值约 40% 本金，3 天赎期")
			else:
				_act("换一件", "secondary", _pick_goods)
			_act("送客", "danger", func(): Game.dispatch({"type": "REFUSE"}))
		footer.text = "%s：%s" % [npc.name, Model.customer_need(t.npcId)]
	dial.enabled = dial_on and not busy
	chips.get_parent().visible = dial_on
	for k in ["line1", "line2", "line3"]:
		var l: Label = scr[k]
		if l.text.length() > 21:
			l.text = l.text.left(20) + "…"
	dial.queue_redraw()

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
	bubble = UIKit.plate(UIKit.paper_style(16))
	bubble.custom_minimum_size = Vector2(470, 0)
	bubble.modulate.a = 0.0
	bubble.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(bubble)
	bubble_label = UIKit.label("", 25, UIKit.INK, false, true)
	bubble.add_child(bubble_label)

func _say(text: String, type := true, mood := "") -> void:
	if customer == null or not is_instance_valid(customer):
		return
	if mood != "":
		customer.set_mood(mood)
	bubble_label.text = text
	bubble.reset_size()
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
	var p: Vector2 = shell.world_mouse()
	if mat_item != null and is_instance_valid(mat_item):
		if mat_item.dragging:
			mat_item.drag_to(p)
		mat_item.hover = lerpf(mat_item.hover, 1.0 if mat_item.contains(p) or mat_item.dragging else 0.0, 0.2)
	for s in shelf:
		if is_instance_valid(s):
			var over: bool = s.contains(p)
			s.hover = lerpf(s.hover, 1.0 if over else 0.0, 0.2)
			s.lift = lerpf(s.lift, 8.0 if over else 0.0, 0.2)
	if customer != null and is_instance_valid(customer):
		customer.look = clampf((p.x - customer.global_position.x) / 700.0, -1.0, 1.0)
		var mouth: Vector2 = shell.world_to_ui(customer.mouth())
		var r: Rect2 = shell.content_rect()
		var want := mouth + Vector2(50, -bubble.size.y - 10)
		want.x = minf(want.x, r.end.x - 480 - bubble.size.x - 20)
		want.y = maxf(want.y, r.position.y)
		bubble.position = bubble.position.lerp(want, 0.25)
