extends Page
## The counter is the room itself: the visitor stands behind the painted
## counter, the lot lies on the mat, and every control is a fixture of the
## shop — a wall board for today's events, a till console, the action keys
## along the counter edge, the stock crate and the archive box below it.

var MAT_POS := Vector2(1000, 760)
var STAND := Vector2(840, 830)
const CUSTOMER_HEIGHT := 640.0
const SIDE := 24.0
const TERMINAL_W := 420.0
const CRATE_W := 470.0
const CRATE_COLS := 7

var customer: Customer
var mat_item: ItemSprite
var bell: ServiceBell
var bubble: PanelContainer
var bubble_name: Label
var bubble_label: Label
var screen: SubViewport
var scr := {}
var dial: Dial
var offer_label: Label
var nudge_keys: Array = []
var chips: HFlowContainer
var actions: HBoxContainer
var footer: Label
var chosen_evidence := ""
var busy := false
var terminal: PanelContainer
var offer_panel: PanelContainer
var evidence_box: VBoxContainer
var board: PanelContainer
var board_day: Label
var board_rent: Label
var board_title: Label
var board_state: Label
var crate: PanelContainer
var stock_grid: GridContainer
var stock_count: Label
var archive: PanelContainer
var orders_tile: Button
var tag: PanelContainer
var tag_name: Label
var tag_info: Label
var idle_label: Label
var offer_button: Button
var stage_root: Node2D
var back_root: Node2D
var mat_rect := Rect2()
var drag_rect := Rect2()
var bubble_rect := Rect2()

func scene_name() -> String:
	return "counter"

func hint_text() -> String:
	var s := Game.state
	if s.phase != "open":
		return "今日已打烊，去日结页迎接明天。"
	if s.trade == null:
		return "按柜台上的服务铃，请下一位客人进来。" if s.cursor < Model.daily_visit_limit() else "今天的预约都接待完了：去维修、整理仓储或打烊。"
	var t: Dictionary = s.trade
	if t.locked:
		return "价格已锁定：确认钱货交割（1 AP）。"
	if t.kind == "sell" and not t.has("selectedUid"):
		return "顾客想买东西：在左下货箱里点一件合格的自有货推荐给他。"
	return "拖动实物、右键翻面；拿去鉴定取证，再转动终端旋钮出价。"

## Notices rise in the open room between the visitor and the till.
func toast_rect() -> Rect2:
	if bubble_rect.size == Vector2.ZERO:
		return Rect2()
	return Rect2(bubble_rect.position.x, 330, bubble_rect.size.x, mat_rect.position.y - 350)

func enter() -> void:
	# The visitor stands in the room, behind the painted counter front (fg).
	back_root = Node2D.new()
	add_world(back_root, "mid")
	stage_root = Node2D.new()
	stage_root.material = Util.unshaded()
	add_world(stage_root, "top")
	_align_stage()
	bell = ServiceBell.new()
	bell.material = Util.unshaded()
	stage_root.add_child(bell)
	_build_board()
	_build_terminal()
	_build_tag()
	_build_strip()
	_build_crate()
	_build_archive()
	_build_bubble()
	relayout()
	_sync_world()
	_refresh()

func _align_stage() -> void:
	var inv := get_viewport().get_canvas_transform().affine_inverse()
	if stage_root != null:
		stage_root.global_transform = inv
	if back_root != null:
		back_root.global_transform = inv

## Painted-art coordinates (the 1672×941 counter plate) in UI space, through
## the resting camera. The live camera may still carry another page's zoom or
## a shake when the page lays out, which used to push the fixtures off place.
func _art_ui(u: float, v: float) -> Vector2:
	var vis := get_viewport().get_visible_rect().size
	return (shell.art(u, v) - shell.CENTER) * shell.zoom_base + vis * 0.5

func _crate_point() -> Vector2:
	return stage_root.to_global(crate.get_global_rect().get_center()) if is_instance_valid(crate) else Vector2(-200, 900)

# ---------------------------------------------------------------- world

func _sync_world() -> void:
	var t = Game.state.trade
	if t == null:
		return
	_spawn_customer(t.npcId, false)
	var it = Model.trade_item(Game.state)
	if it != null:
		_spawn_mat_item(it, false)
	_say(t.line, false)

func _spawn_customer(npc_id: String, walk: bool) -> void:
	if customer != null and is_instance_valid(customer):
		customer.queue_free()
	customer = Customer.new()
	customer.setup(npc_id)
	customer.scale = Vector2.ONE * (CUSTOMER_HEIGHT / customer.size.y)
	customer.position = STAND
	back_root.add_child(customer)
	if walk:
		customer.walk_in(2350.0)

func _spawn_mat_item(it: Dictionary, animate: bool, from := Vector2.ZERO) -> void:
	if mat_item != null and is_instance_valid(mat_item):
		mat_item.queue_free()
	mat_item = ItemSprite.new()
	mat_item.setup(it.defId, it.uid, 250.0)
	mat_item.bounds = drag_rect
	mat_item.position = MAT_POS
	mat_item.dropped.connect(func():
		shell.sound("drop", -4.0, randf_range(0.9, 1.1))
		shell.dust_burst(mat_item.global_position + Vector2(0, 70), shell.layer("fg"))
		shell.shake = maxf(shell.shake, 0.22))
	mat_item.flipped.connect(func(_b): shell.sound("page", -6))
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

# ---------------------------------------------------------------- fixtures

## A small metal sign: what happens today, and when rent falls due.
func _build_board() -> void:
	board = UIKit.plate(_fixture_style(Color("15100b"), Color("a8763e")))
	board.mouse_filter = Control.MOUSE_FILTER_STOP
	board.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	board.tooltip_text = "打开今日站内消息"
	board.gui_input.connect(func(e: InputEvent):
		if e is InputEventMouseButton and e.pressed and (e as InputEventMouseButton).button_index == MOUSE_BUTTON_LEFT:
			shell.sound("click", -6)
			shell.open_events())
	add_child(board)
	var v := UIKit.vbox(6)
	v.mouse_filter = Control.MOUSE_FILTER_IGNORE
	board.add_child(v)
	var head := UIKit.hbox(8)
	head.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var title := UIKit.label("今日事件", 22, UIKit.AMBER)
	head.add_child(title)
	head.add_child(UIKit.spacer(false))
	board_day = UIKit.label("", 20, UIKit.AMBER, true)
	head.add_child(board_day)
	v.add_child(head)
	v.add_child(UIKit.rule())
	board_title = UIKit.label("", 20, UIKit.TEXT, false, true)
	v.add_child(board_title)
	board_state = UIKit.label("", 16, UIKit.MUTED)
	v.add_child(board_state)
	board_rent = UIKit.label("", 16, UIKit.CYAN)
	v.add_child(board_rent)
	for c in [title, board_day, board_title, board_state, board_rent]:
		(c as Control).mouse_filter = Control.MOUSE_FILTER_IGNORE

func _fixture_style(fill: Color, edge: Color, pad := 16) -> StyleBoxFlat:
	var s := UIKit.box(fill, edge, 3, 2, pad, 10)
	s.bg_color.a = 0.94
	return s

## A paper tag laid on the counter next to the lot.
func _build_tag() -> void:
	tag = UIKit.plate(UIKit.paper_style(12))
	tag.mouse_filter = Control.MOUSE_FILTER_IGNORE
	tag.rotation = -0.035
	add_child(tag)
	var v := UIKit.vbox(2)
	v.mouse_filter = Control.MOUSE_FILTER_IGNORE
	tag.add_child(v)
	tag_name = UIKit.label("", 20, UIKit.INK, false, true)
	tag_info = UIKit.label("", 15, UIKit.RUST, false, true)
	v.add_child(tag_name)
	v.add_child(tag_info)
	idle_label = UIKit.label("", 24, Color("d9cdb4"))
	idle_label.add_theme_color_override("font_outline_color", Color(0, 0, 0, 0.85))
	idle_label.add_theme_constant_override("outline_size", 6)
	idle_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	idle_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(idle_label)

## Action keys set into the counter edge, under the mat.
func _build_strip() -> void:
	actions = HBoxContainer.new()
	actions.add_theme_constant_override("separation", 8)
	actions.alignment = BoxContainer.ALIGNMENT_CENTER
	add_child(actions)

## The stock crate: what the shop holds. During a sale, a click recommends.
func _build_crate() -> void:
	crate = UIKit.plate(_fixture_style(Color("10181a"), Color("5d6b66"), 12))
	add_child(crate)
	var v := UIKit.vbox(8)
	crate.add_child(v)
	var head := UIKit.hbox(8)
	head.add_child(UIKit.label("货箱", 20, UIKit.AMBER))
	stock_count = UIKit.label("", 16, UIKit.MUTED)
	stock_count.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	head.add_child(stock_count)
	head.add_child(UIKit.spacer(false))
	var open_stock := UIKit.button("整理仓储", "chip", Vector2(0, 32), 15, "warehouse")
	open_stock.add_theme_constant_override("icon_max_width", 20)
	open_stock.pressed.connect(func(): shell.go("warehouse"))
	head.add_child(open_stock)
	v.add_child(head)
	var sc := ScrollContainer.new()
	sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	sc.size_flags_vertical = Control.SIZE_EXPAND_FILL
	v.add_child(sc)
	stock_grid = UIKit.grid(CRATE_COLS, 6)
	sc.add_child(stock_grid)

## The archive box: the shop's paperwork, one drawer each.
func _build_archive() -> void:
	archive = UIKit.plate(_fixture_style(Color("161310"), Color("7a6650"), 12))
	add_child(archive)
	var v := UIKit.vbox(8)
	archive.add_child(v)
	v.add_child(UIKit.label("档案箱", 20, UIKit.AMBER))
	var row := UIKit.hbox(8)
	v.add_child(row)
	for spec in [["订单委托", "orders"], ["人物档案", "handbook"], ["经营手册", "help"], ["今日账本", "report"], ["站内消息", "speech"]]:
		var b := UIKit.button(spec[0], "secondary", Vector2(78, 0), 14, spec[1])
		b.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		b.size_flags_vertical = Control.SIZE_EXPAND_FILL
		b.vertical_icon_alignment = VERTICAL_ALIGNMENT_TOP
		b.icon_alignment = HORIZONTAL_ALIGNMENT_CENTER
		b.add_theme_constant_override("icon_max_width", 34)
		var drawer: String = spec[1]
		b.pressed.connect(func(): _open_drawer(drawer))
		row.add_child(b)
		if spec[1] == "orders":
			orders_tile = b
	row.size_flags_vertical = Control.SIZE_EXPAND_FILL

func _open_drawer(drawer: String) -> void:
	shell.sound("page", -8)
	match drawer:
		"orders": shell.go("orders")
		"handbook": shell.open_people()
		"help": shell.open_help()
		"report": shell.go("report")
		"speech": shell.open_events()

func relayout() -> void:
	if not is_instance_valid(terminal) or not is_instance_valid(crate):
		return
	_align_stage()
	var vis := get_viewport().get_visible_rect().size
	var top := 96.0
	var a := _art_ui(250, 594)
	var b := _art_ui(1500, 736)
	mat_rect = Rect2(a, b - a)
	var counter_top := _art_ui(0, 586).y
	# Fixtures along the walls.
	board.position = Vector2(SIDE, top)
	board_title.custom_minimum_size.x = 408
	board.reset_size()
	terminal.position = Vector2(vis.x - SIDE - TERMINAL_W, top)
	footer.custom_minimum_size.x = TERMINAL_W - 36
	terminal.reset_size()
	# Visitor and speech in the room.
	STAND = Vector2(lerpf(a.x, b.x, 0.36), counter_top + 150.0)
	if is_instance_valid(customer) and not customer.walking:
		customer.position = STAND
	var bx := STAND.x + 200.0
	bubble_rect = Rect2(bx, 150, terminal.position.x - 24 - bx, 0)
	bubble.position = bubble_rect.position
	# Wrapping labels need a real width, or they measure one glyph per line
	# and the plate grows to the bottom of the screen.
	bubble_label.custom_minimum_size.x = bubble_rect.size.x - 32
	bubble.size = Vector2(bubble_rect.size.x, 0)
	bubble.reset_size()
	# The mat: lot, bell, paper tag.
	MAT_POS = Vector2(lerpf(a.x, b.x, 0.56), mat_rect.position.y + 52.0)
	drag_rect = Rect2(Vector2(a.x + 330, mat_rect.position.y + 20), Vector2(maxf(80, mat_rect.size.x - 470), maxf(30, mat_rect.size.y - 70)))
	bell.position = Vector2(a.x + 96, mat_rect.end.y - 26)
	tag.position = Vector2(a.x + 170, mat_rect.position.y + 18)
	tag_name.custom_minimum_size.x = 226
	tag_info.custom_minimum_size.x = 226
	tag.reset_size()
	idle_label.position = Vector2(a.x, mat_rect.get_center().y - 18)
	idle_label.size = Vector2(mat_rect.size.x, 40)
	if is_instance_valid(mat_item):
		mat_item.bounds = drag_rect
		if not mat_item.dragging:
			mat_item.position = MAT_POS
	# Under the counter: crate, keys, archive.
	var low := mat_rect.end.y + 14.0
	crate.position = Vector2(SIDE, low)
	crate.size = Vector2(CRATE_W, vis.y - 14 - low)
	archive.position = Vector2(vis.x - SIDE - CRATE_W, low)
	archive.size = Vector2(CRATE_W, vis.y - 14 - low)
	var strip_x := SIDE + CRATE_W + 16
	actions.position = Vector2(strip_x, low)
	actions.size = Vector2(vis.x - 2 * strip_x, 58)

func _refresh_board() -> void:
	var s := Game.state
	var day := int(s.day)
	board_day.text = "第%02d天" % day
	var event = Game.today_event()
	board_title.text = event.title if event != null else "今天没有站务消息"
	if event == null:
		board_state.text = "整理货物，准备迎接来客"
	else:
		board_state.text = "[已处理]" if Game.event_done() else "[待处理 · 点此查看]"
	board_state.add_theme_color_override("font_color", UIKit.AMBER if event != null and not Game.event_done() else UIKit.MUTED)
	var rent_day := int(ceil(day / 7.0)) * 7
	if rent_day > 21:
		board_rent.text = "本期租约已到最后一天"
	else:
		var left := rent_day - day
		board_rent.text = "租金 %s · %s" % [UIKit.money(Model.rent_due(rent_day)), "今晚结算" if left == 0 else "%d 天后到期" % left]

func _refresh_desk() -> void:
	if crate == null:
		return
	_refresh_board()
	UIKit.clear(stock_grid)
	var s := Game.state
	var items: Array = s.inventory
	stock_count.text = "在库 %d 件" % items.size()
	var t = s.trade
	var picking: bool = t != null and t.kind == "sell" and not t.has("selectedUid") and not t.locked
	for i in maxi(CRATE_COLS * 3, ceili(items.size() / float(CRATE_COLS)) * CRATE_COLS):
		var slot := UIKit.button("", "chip", Vector2(56, 56), 14)
		slot.tooltip_text = "空货位"
		if i < items.size():
			var it: Dictionary = items[i]
			var def := GameData.def(it.defId)
			slot.icon = UIKit.item_icon(it.defId)
			slot.expand_icon = true
			slot.add_theme_constant_override("icon_max_width", 46)
			var why = Model.sale_eligibility(it, t.npcId) if picking and it.owner == "shop" else null
			var line := "%s · 品相%s%s" % [def.name, UIKit.pct(it.condition), " · 陈列中" if it.location == "display" else ""]
			if picking:
				if it.owner != "shop":
					why = "不是店铺自有货"
				slot.tooltip_text = line + ("\n点击推荐给顾客" if why == null else "\n" + String(why))
				slot.add_theme_stylebox_override("normal", UIKit.key_style("primary" if why == null else "chip", "normal"))
				if why != null:
					slot.modulate = Color(1, 1, 1, 0.45)
			else:
				slot.tooltip_text = line + "\n点击在仓储查看"
				if it.location == "display":
					slot.add_theme_stylebox_override("normal", UIKit.key_style("good", "normal"))
			var uid: String = it.uid
			var reason = why
			slot.pressed.connect(func(): _stock_clicked(uid, picking, reason))
		else:
			slot.disabled = true
		stock_grid.add_child(slot)
	var active := 0
	for o in s.orders:
		if o.status == "active":
			active += 1
	orders_tile.text = "订单委托" if active == 0 else "订单 · %d" % active
	if busy and t == null:
		# The model has already closed the trade, but the visitor and the lot are
		# still on stage until the exit animation finishes.
		return
	var it = Model.trade_item(s) if t != null else null
	tag.visible = it != null
	if it != null:
		tag_name.text = GameData.def(it.defId).name
		tag_info.text = "品相 %s · %s · 取证 %d/6" % [UIKit.pct(it.condition), "正常运转" if it.working else "存在故障", Model.evidence_count(it)]
		tag.reset_size()
	idle_label.visible = it == null
	if t == null:
		idle_label.text = "按服务铃接待下一位来客" if s.phase == "open" and s.cursor < Model.daily_visit_limit() else "今天的预约都接待完了"
	else:
		idle_label.text = "从左下货箱挑一件货推荐给 %s" % GameData.npc(t.npcId).name

func _stock_clicked(uid: String, picking: bool, why) -> void:
	if busy:
		return
	if not picking:
		shell.go("warehouse", uid)
		return
	if why != null:
		shell.toast(String(why))
		return
	shell.sound("click", -6)
	Game.dispatch({"type": "SELECT_TRADE", "uid": uid})

# ---------------------------------------------------------------- terminal

func _build_terminal() -> void:
	terminal = UIKit.plate(_fixture_style(Color("141c1e"), Color("65716b")))
	add_child(terminal)
	var v := UIKit.vbox(10)
	terminal.add_child(v)
	v.add_child(UIKit.label("交易终端", 22, UIKit.AMBER))
	screen = SubViewport.new()
	screen.size = Vector2i(440, 190)
	screen.render_target_update_mode = SubViewport.UPDATE_ALWAYS
	add_child(screen)
	var bgc := ColorRect.new()
	bgc.color = Color("041010")
	bgc.size = Vector2(440, 190)
	screen.add_child(bgc)
	scr.head = _scr_label(Vector2(22, 8), 20, UIKit.CYAN)
	scr.price = _scr_label(Vector2(18, 28), 60, UIKit.AMBER, true)
	scr.line1 = _scr_label(Vector2(22, 100), 19, UIKit.CYAN)
	scr.line2 = _scr_label(Vector2(22, 128), 19, Color("ffb48a"))
	scr.line3 = _scr_label(Vector2(22, 156), 17, UIKit.MUTED)
	var crt := TextureRect.new()
	crt.texture = screen.get_texture()
	crt.custom_minimum_size = Vector2(384, 166)
	crt.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	crt.stretch_mode = TextureRect.STRETCH_SCALE
	var frame := UIKit.plate(UIKit.inset_style(0))
	frame.add_child(crt)
	v.add_child(frame)
	offer_panel = UIKit.plate(UIKit.inset_style(10))
	var oh := UIKit.hbox(12)
	offer_panel.add_child(oh)
	dial = Dial.new()
	dial.custom_minimum_size = Vector2(118, 118)
	dial.tooltip_text = "上下拖动旋钮调价 · 滚轮 ±5"
	dial.changed.connect(func(val):
		_update_offer_value(val)
		shell.sound("click", -20, 1.7))
	oh.add_child(dial)
	var ov := UIKit.vbox(4)
	ov.alignment = BoxContainer.ALIGNMENT_CENTER
	ov.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	ov.add_child(UIKit.label("我的出价", 16, UIKit.MUTED))
	offer_label = UIKit.label("—", 40, UIKit.AMBER, true)
	ov.add_child(offer_label)
	# Exact steps for players who find the knob too coarse or too fiddly.
	var nudges := UIKit.hbox(5)
	for d in [-10, -1, 1, 10]:
		var k := UIKit.button(("+%d" % d) if d > 0 else ("−%d" % -d), "chip", Vector2(50, 36), 16)
		var step: int = d
		k.pressed.connect(func():
			dial.set_value(dial.value + step)
			dial.queue_redraw())
		nudges.add_child(k)
		nudge_keys.append(k)
	ov.add_child(nudges)
	oh.add_child(ov)
	v.add_child(offer_panel)
	evidence_box = UIKit.vbox(6)
	evidence_box.add_child(UIKit.label("援引物证（可选）", 15, UIKit.MUTED))
	chips = HFlowContainer.new()
	chips.add_theme_constant_override("h_separation", 6)
	chips.add_theme_constant_override("v_separation", 6)
	evidence_box.add_child(chips)
	v.add_child(evidence_box)
	footer = UIKit.label("", 16, UIKit.MUTED, false, true)
	v.add_child(footer)

func _scr_label(pos: Vector2, size: int, color: Color, is_mono := false) -> Label:
	var l := UIKit.label("", size, color, is_mono)
	l.position = pos
	screen.add_child(l)
	return l

const ACTION_ICONS := {"出价": "credits", "接受报价": "check", "拿去鉴定": "inspect", "签抵押合同": "lock", "抵押（需 2 条物证）": "lock",
	"换一件": "warehouse", "挑选货物": "warehouse", "送客": "close", "取消交易": "close", "确认钱货交割": "credits",
	"接待下一位来客": "next", "打烊结算": "report"}

func _act(text: String, kind: String, fn: Callable, enabled := true, _wide := false, tip := "") -> Button:
	var icon := ""
	for k in ACTION_ICONS:
		if text.begins_with(k):
			icon = ACTION_ICONS[k]
	var b := UIKit.button(text, kind, Vector2(0, 58), 20, icon)
	b.custom_minimum_size.x = 150
	b.add_theme_constant_override("icon_max_width", 28)
	b.disabled = not enabled or busy
	b.tooltip_text = tip
	b.pressed.connect(func():
		shell.sound("click", -6)
		fn.call())
	actions.add_child(b)
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
		scr.line3.text = "按服务铃接客 · 每笔交割 1 AP"
		offer_label.text = "—"
		_act("接待下一位来客", "primary", func(): _ring(), s.phase == "open" and not closed and s.ap >= 1)
		_act("打烊结算", "secondary", func(): shell.go("report"))
		var shown := 0
		for i in s.inventory:
			if i.location == "display":
				shown += 1
		footer.text = "陈列架：%d 件 · 可在仓储上架" % shown
	else:
		var it = Model.trade_item(s)
		var npc := GameData.npc(t.npcId)
		var buy: bool = t.kind == "buy"
		scr.head.text = ("来客报价 · " if buy else "顾客出价 · ") + npc.name
		scr.price.text = Model.jnum(t.price) + " Cr" if it != null else "待选货"
		if it != null:
			var e := Model.estimate(it)
			scr.line1.text = "%s · 估值 %s" % [GameData.def(it.defId).name.left(8), Model.jnum(e.low) if e.exact else "%s–%s" % [Model.jnum(e.low), Model.jnum(e.high)]]
			scr.line2.text = "物证 %d · 议价 %d/3%s" % [Model.evidence_count(it), int(t.rounds), " · 已锁价" if t.locked else ""]
		else:
			scr.line1.text = "需求：" + Model.customer_need(t.npcId).left(20)
			scr.line2.text = "在货箱里挑一件合格的自有货"
		scr.line3.text = "现金 %s · 行动 %d AP" % [UIKit.money(s.cash), int(s.ap)]
		if t.locked:
			_act("确认钱货交割", "primary", func(): Game.dispatch({"type": "DELIVER", "tradeId": t.id}), s.ap >= 1)
			_act("取消交易", "secondary", func(): Game.dispatch({"type": "REFUSE"}))
		elif it == null:
			_act("挑选货物", "primary", _pick_goods)
			_act("送客", "danger", func(): Game.dispatch({"type": "REFUSE"}))
		else:
			dial_on = true
			var bnd := Model.offer_bounds(s, t, it)
			dial.min_value = 1
			dial.max_value = int(maxf(1, bnd.max))
			var drafts: Dictionary = Game.get_meta("counter_offer_drafts", {})
			var initial := int(t.price * (0.8 if buy else 1.15))
			dial.set_value(int(drafts.get(t.id, initial)), false)
			_update_offer_value(dial.value)
			for e in it.evidence:
				if not GameData.def(it.defId).tools.has(e):
					continue
				var chip := UIKit.button(GameData.tool(e).short, "primary" if chosen_evidence == e else "chip", Vector2(0, 36), 16)
				var eid: String = e
				chip.pressed.connect(func():
					chosen_evidence = "" if chosen_evidence == eid else eid
					_refresh())
				chips.add_child(chip)
			if chips.get_child_count() == 0:
				chips.add_child(UIKit.label("还没有相关物证：先拿去鉴定。", 15, UIKit.MUTED))
			offer_button = _act("出价 " + UIKit.money(dial.value), "primary", func(): _offer())
			_act("接受报价", "good", func(): Game.dispatch({"type": "ACCEPT"}))
			_act("拿去鉴定", "secondary", func(): shell.go("inspect", it.uid))
			if buy:
				var pawn_ok := Model.evidence_count(it) >= 2
				_act("签抵押合同" if pawn_ok else "抵押（需 2 条物证）", "secondary", func(): Game.dispatch({"type": "PAWN", "tradeId": t.id}), pawn_ok, false, "需两条物证；付估值约 40% 本金，3 天赎期")
			else:
				_act("换一件", "secondary", _pick_goods)
			_act("送客", "danger", func(): Game.dispatch({"type": "REFUSE"}))
		footer.text = "%s：%s" % [npc.name, Model.customer_need(t.npcId)]
	dial.enabled = dial_on and not busy
	for k in nudge_keys:
		(k as Button).disabled = not dial.enabled
	offer_panel.visible = dial_on
	evidence_box.visible = dial_on
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

## Full list with prices; the crate offers the same choice by direct click.
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
		var est := Model.estimate(it)
		cv.add_child(UIKit.label("挂牌 %s · 成本 %s · 估值 %s" % [UIKit.money(it.listPrice), UIKit.money(it.cost), Model.jnum(est.low) if est.exact else "%s–%s" % [Model.jnum(est.low), Model.jnum(est.high)]], 15, UIKit.AMBER, false, true))
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
	bubble = UIKit.plate(UIKit.box(Color(0.93, 0.9, 0.82, 0.97), Color("8c7a5c"), 10, 2, 16, 10))
	bubble.modulate.a = 0.0
	bubble.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(bubble)
	var v := UIKit.vbox(4)
	v.mouse_filter = Control.MOUSE_FILTER_IGNORE
	bubble.add_child(v)
	bubble_name = UIKit.label("", 17, UIKit.RUST)
	bubble_name.mouse_filter = Control.MOUSE_FILTER_IGNORE
	v.add_child(bubble_name)
	bubble_label = UIKit.label("", 22, UIKit.INK, false, true)
	bubble_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	bubble_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	v.add_child(bubble_label)

func _say(text: String, type := true, mood := "") -> void:
	if customer == null or not is_instance_valid(customer):
		return
	if mood != "":
		customer.set_mood(mood)
	var npc := GameData.npc(customer.npc_id)
	bubble_name.text = "%s · %s" % [npc.name, npc.title]
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
					_spawn_mat_item(nt.item, true, customer.hands())
					await get_tree().create_timer(0.6).timeout
				busy = false
				_say(nt.line)
		"SELECT_TRADE":
			var it = Model.trade_item(next)
			if it != null:
				_spawn_mat_item(it, true, _crate_point())
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
		var dest: Vector2 = _crate_point() if keep else customer.hands()
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
	var till: Vector2 = terminal.get_global_rect().get_center()
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
		var dest: Vector2 = _crate_point() if buy else customer.hands()
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
	var paper := UIKit.plate(UIKit.paper_style(18))
	paper.custom_minimum_size = Vector2(340, 0)
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
	paper.position = Vector2(terminal.position.x - paper.size.x - 24, 300)
	paper.rotation = -0.03
	paper.modulate.a = 0.0
	var tw := create_tween()
	tw.tween_property(paper, "modulate:a", 1.0, 0.15)
	tw.parallel().tween_property(paper, "position:y", paper.position.y + 30, 0.6).set_trans(Tween.TRANS_SINE)
	tw.tween_callback(func():
		var stamp := UIKit.label("已抵押" if pawn else ("已收购" if t.kind == "buy" else "已售出"), 52, Color(0.75, 0.12, 0.1, 0.85))
		stamp.position = Vector2(150, 120)
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

func world_cursor_shape(p: Vector2) -> int:
	if is_instance_valid(mat_item) and mat_item.dragging:
		return Input.CURSOR_DRAG
	if busy or shell.modal_open():
		return Input.CURSOR_ARROW
	if is_instance_valid(mat_item) and mat_item.draggable and not mat_item.busy and mat_item.contains(p):
		return Input.CURSOR_CAN_DROP
	if is_instance_valid(bell) and bell.hit_test(p):
		return Input.CURSOR_POINTING_HAND
	if is_instance_valid(customer) and Game.state.trade != null and _over_customer(p):
		return Input.CURSOR_POINTING_HAND
	return Input.CURSOR_ARROW

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
	# Container minimum sizes settle over a few frames after content changes;
	# keep the console hugging its contents instead of keeping an old height.
	if is_instance_valid(terminal) and terminal.size.y > terminal.get_combined_minimum_size().y + 1.0:
		terminal.reset_size()
	var p: Vector2 = shell.world_mouse()
	if mat_item != null and is_instance_valid(mat_item):
		if mat_item.dragging:
			mat_item.drag_to(p)
		mat_item.hover = lerpf(mat_item.hover, 1.0 if mat_item.contains(p) or mat_item.dragging else 0.0, 0.2)
	if customer != null and is_instance_valid(customer):
		customer.look = clampf((p.x - customer.global_position.x) / 700.0, -1.0, 1.0)
