extends Page
## Every action belongs to a piece of equipment in the painted shop.
## Coordinates are the final 1920 x 1080 scene, not the former art transform.

const CUSTOMER_HEIGHT := 320.0
const CRATE_COLS := 10
var MAT_POS := Vector2(990, 610)
var STAND := Vector2(880, 490)
var fixture_buttons: Dictionary = {}
var customer: Customer
var mat_item: ItemSprite
var bell: ServiceBell
var bubble: Panel
var bubble_name: Label
var bubble_label: RichTextLabel
var scr := {}
var dial: Dial
var offer_label: Label
var nudge_keys: Array = []
var chips: HFlowContainer
var actions: HBoxContainer
var footer: Label
var chosen_evidence := ""
var busy := false
var _workspace_suspended := false
var _last_offer_value := 100
var terminal: PanelContainer
var offer_panel: PanelContainer
var evidence_box: VBoxContainer
var board: Control
var board_day: Label
var board_rent: Label
var crate: PanelContainer
var stock_grid: GridContainer
var stock_count: Label
var display_goods: Control
var orders_readout: Label
var status_readout: Label
var tag: PanelContainer
var tag_name: Label
var tag_info: Label
var idle_label: Label
var idle_jobs: Label
var offer_button: Button
var stage_root: Node2D
var back_root: Node2D
var resident_window: Control
var mat_rect := Rect2(650, 550, 665, 115)
var drag_rect := Rect2(740, 605, 490, 12)
var bubble_rect := Rect2(1040, 190, 275, 245)

## Only the painted machine can intercept the mouse. Transparent feet/gutters
## leave the real equipment below reachable, including on the Web build.
class QuotationBody extends PanelContainer:
	var silhouette: Image
	func _has_point(point: Vector2) -> bool:
		if not Rect2(Vector2.ZERO, size).has_point(point):
			return false
		if silhouette == null:
			return true
		var pixel := Vector2i(point / size * Vector2(silhouette.get_size()))
		return silhouette.get_pixelv(pixel).a >= 0.5

## Transparent equipment buttons retain the illustration at rest. Hover and
## keyboard focus add crisp pixel corner marks and a compact nameplate.
class FixtureButton extends Button:
	var caption := ""
	var accent := Color("e7ba70")
	var permanent := true
	func _ready() -> void:
		mouse_entered.connect(queue_redraw)
		mouse_exited.connect(queue_redraw)
		focus_entered.connect(queue_redraw)
		focus_exited.connect(queue_redraw)
	func _draw() -> void:
		var active := is_hovered() or has_focus()
		if active:
			var r := Rect2(Vector2(3, 3), size - Vector2(6, 6))
			for c in [r.position, Vector2(r.end.x, r.position.y), r.end, Vector2(r.position.x, r.end.y)]:
				var dx := 1.0 if c.x == r.position.x else -1.0
				var dy := 1.0 if c.y == r.position.y else -1.0
				draw_rect(Rect2(c + Vector2(minf(0, dx * 16), 0), Vector2(18, 3)), accent)
				draw_rect(Rect2(c + Vector2(0, minf(0, dy * 16)), Vector2(3, 18)), accent)
		if caption == "" or (not permanent and not active):
			return
		var w := minf(size.x - 10, UIKit.font.get_string_size(caption, HORIZONTAL_ALIGNMENT_LEFT, -1, 20).x + 22)
		var box := Rect2(Vector2((size.x - w) * 0.5, size.y - 32), Vector2(w, 28))
		draw_rect(box, Color("233536") if active else Color("29242c"))
		draw_rect(Rect2(box.position, Vector2(w, 2)), accent)
		draw_string(UIKit.font, box.position + Vector2(11, 21), caption, HORIZONTAL_ALIGNMENT_LEFT, w - 20, 20, Color("f0dfbd"))

func scene_name() -> String:
	return "counter"

func hint_text() -> String:
	var s := Game.state
	if s.phase != "open":
		return "今日已打烊，打开日结账本迎接明天。"
	if s.trade == null:
		return "按柜台上的服务铃，请下一位客人进来。" if s.cursor < Model.daily_visit_limit() else "今天的预约都接待完了：去维修、整理仓储或打烊。"
	var t: Dictionary = s.trade
	if t.locked:
		return "价格已锁定：确认钱货交割（1 AP）。"
	if t.kind == "sell" and not t.has("selectedUid"):
		return "在陈列柜或下方货物抽屉里，点一件合格的自有货推荐给顾客。"
	return "拖动实物、右键翻面；点击鉴定仪取证，再转动报价旋钮出价。"

func toast_rect() -> Rect2:
	return Rect2(666, 126, 630, 70)

func enter() -> void:
	back_root = Node2D.new()
	back_root.material = Util.unshaded()
	add_world(back_root, "mid")
	resident_window = Control.new()
	resident_window.position = Vector2(644, 124)
	resident_window.size = Vector2(690, 366)
	resident_window.clip_contents = true
	resident_window.mouse_filter = Control.MOUSE_FILTER_IGNORE
	back_root.add_child(resident_window)
	stage_root = Node2D.new()
	stage_root.material = Util.unshaded()
	add_world(stage_root, "top")
	_align_stage()
	# The bell is already painted in the master scene. Keep its physical hit
	# and ringing API while the transparent scene target supplies focus/hover.
	bell = ServiceBell.new()
	bell.position = Vector2(540, 650)
	bell.visible = false
	stage_root.add_child(bell)
	_build_board()
	_build_terminal()
	_build_tag()
	_build_strip()
	_build_crate()
	_build_equipment()
	Game.prefs_changed.connect(_refresh_utility_icons)
	_refresh_utility_icons()
	# The till stands in front of the counter fixtures, like the illustration.
	move_child(terminal, -1)
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

func _scene_blocked() -> bool:
	return _workspace_suspended or shell.modal_open() or (shell.has_method("workspace_open") and shell.workspace_open())

## Shell calls this synchronously at the workspace boundary. A Control with
## an existing GUI drag can retain pointer capture even behind the new sheet.
func workspace_state_changed(opened: bool) -> void:
	_workspace_suspended = opened
	if opened:
		if is_instance_valid(dial):
			dial.cancel_drag()
			dial.enabled = false
			dial.queue_redraw()
		for key in nudge_keys:
			(key as Button).disabled = true
		if is_instance_valid(mat_item) and mat_item.dragging:
			mat_item.end_drag()
	else:
		_refresh()

func _crate_point() -> Vector2:
	return stage_root.to_global(crate.get_global_rect().get_center()) if is_instance_valid(crate) else Vector2(940, 860)

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
	customer.position = STAND - resident_window.position
	resident_window.add_child(customer)
	if walk:
		customer.walk_in(920.0)

func _spawn_mat_item(it: Dictionary, animate: bool, from := Vector2.ZERO) -> void:
	if mat_item != null and is_instance_valid(mat_item):
		mat_item.queue_free()
	mat_item = ItemSprite.new()
	mat_item.setup(it.defId, it.uid, 135.0)
	mat_item.bounds = drag_rect
	mat_item.position = MAT_POS
	mat_item.dropped.connect(func():
		shell.sound("drop", -4.0, randf_range(0.9, 1.1))
		shell.dust_burst(mat_item.global_position + Vector2(0, 35), shell.layer("fg"))
		shell.shake = maxf(shell.shake, 0.12))
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
			mat_item.lift = sin(p * PI) * 65.0 + (1.0 - p) * 20.0
			mat_item.body.rotation = lerpf(-0.4, 0.0, p), 0.0, 1.0, 0.55).set_trans(Tween.TRANS_SINE)
		tw.tween_callback(func(): mat_item.land())

func _flat(fill: Color, edge := Color.TRANSPARENT, pad := 0) -> StyleBoxFlat:
	var style := StyleBoxFlat.new()
	style.bg_color = fill
	style.border_color = edge
	style.set_border_width_all(2 if edge.a > 0 else 0)
	style.set_content_margin_all(pad)
	style.anti_aliasing = false
	return style

func _fixture(key: String, rect: Rect2, caption: String, fn: Callable, permanent := true, accent := Color("e7ba70")) -> Button:
	var b := FixtureButton.new()
	b.name = "fixture_" + key
	b.position = rect.position
	b.size = rect.size
	b.caption = caption
	b.permanent = permanent
	b.accent = accent
	b.tooltip_text = caption + " · 点击打开操作面板"
	b.focus_mode = Control.FOCUS_ALL
	b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	for state in ["normal", "hover", "pressed", "focus"]:
		b.add_theme_stylebox_override(state, StyleBoxEmpty.new())
	b.pressed.connect(func():
		if _scene_blocked() or busy:
			return
		shell.sound("click", -6)
		fn.call())
	add_child(b)
	fixture_buttons[key] = b
	return b

func _build_board() -> void:
	_fixture("events", Rect2(330, 60, 230, 112), "", func(): shell.open_events())
	board = Control.new()
	board.position = Vector2(352, 80)
	board.size = Vector2(185, 70)
	board.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(board)
	board_day = UIKit.label("", 22, Color("392b30"), true)
	board_day.position = Vector2(2, 4)
	board.add_child(board_day)
	board_rent = UIKit.label("", 17, Color("694335"))
	board_rent.position = Vector2(2, 37)
	board.add_child(board_rent)
	for label in [board_day, board_rent]:
		label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	_fixture("report", Rect2(292, 673, 246, 52), "日结账本 · 打烊", func(): shell.go("report"))

func _build_tag() -> void:
	tag = UIKit.plate(_flat(Color("d8c9a8"), Color("887859"), 5))
	tag.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(tag)
	var v := UIKit.vbox(1)
	v.mouse_filter = Control.MOUSE_FILTER_IGNORE
	tag.add_child(v)
	tag_name = UIKit.label("", 19, Color("322b2f"))
	tag_info = UIKit.label("", 15, Color("805041"))
	v.add_child(tag_name)
	v.add_child(tag_info)
	for label in [tag_name, tag_info]:
		label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	idle_label = UIKit.label("", 21, Color("eadbb9"), false, true)
	idle_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	idle_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	idle_label.add_theme_color_override("font_outline_color", Color("342c30"))
	idle_label.add_theme_constant_override("outline_size", 3)
	add_child(idle_label)
	idle_jobs = UIKit.label("", 24, Color("dfcfad"), false, true)
	idle_jobs.position = Vector2(697, 207)
	idle_jobs.size = Vector2(570, 250)
	idle_jobs.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	idle_jobs.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	idle_jobs.mouse_filter = Control.MOUSE_FILTER_IGNORE
	idle_jobs.add_theme_color_override("font_outline_color", Color("211c26"))
	idle_jobs.add_theme_constant_override("outline_size", 3)
	add_child(idle_jobs)

func _build_strip() -> void:
	actions = HBoxContainer.new()
	actions.add_theme_constant_override("separation", 4)
	actions.alignment = BoxContainer.ALIGNMENT_CENTER
	terminal.get_child(0).add_child(actions)

func _build_crate() -> void:
	# The copper drawer frame and dark interior are supplied by the scene art.
	crate = UIKit.plate(_flat(Color.TRANSPARENT, Color.TRANSPARENT, 0))
	add_child(crate)
	var v := UIKit.vbox(5)
	crate.add_child(v)
	var head := UIKit.hbox(8)
	head.add_child(UIKit.label("在库货物", 19, UIKit.AMBER))
	stock_count = UIKit.label("", 17, UIKit.MUTED)
	head.add_child(stock_count)
	head.add_child(UIKit.spacer(false))
	var open_stock := UIKit.button("整理抽屉", "chip", Vector2(100, 28), 16)
	_till_key(open_stock, "secondary")
	open_stock.pressed.connect(func():
		if not _scene_blocked():
			shell.go("warehouse"))
	head.add_child(open_stock)
	v.add_child(head)
	var sc := ScrollContainer.new()
	sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	sc.size_flags_vertical = Control.SIZE_EXPAND_FILL
	v.add_child(sc)
	stock_grid = UIKit.grid(CRATE_COLS, 6)
	sc.add_child(stock_grid)

func _build_equipment() -> void:
	_fixture("warehouse", Rect2(200, 735, 312, 280), "仓储 · 隔离柜", func(): shell.go("warehouse"))
	_fixture("display", Rect2(170, 220, 386, 314), "陈列柜 · 选货", func(): shell.go("warehouse"), false)
	display_goods = Control.new()
	display_goods.position = Vector2(170, 220)
	display_goods.size = Vector2(386, 314)
	display_goods.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(display_goods)
	_fixture("repair", Rect2(1410, 730, 400, 290), "维修工作台", func(): _open_instrument("repair"))
	# The gauge takes precedence over the surrounding repair station.
	_fixture("inspect", Rect2(1414, 730, 151, 158), "鉴定仪", func(): _open_instrument("inspect"), true, Color("a3d6c4"))
	_fixture("orders", Rect2(1420, 240, 240, 172), "订单终端", func(): shell.go("orders"))
	orders_readout = UIKit.label("", 19, Color("a6d9ba"), true)
	orders_readout.position = Vector2(1486, 280)
	orders_readout.size = Vector2(140, 105)
	orders_readout.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	orders_readout.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
	orders_readout.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(orders_readout)
	_fixture("people", Rect2(1700, 320, 115, 92), "人物档案", func(): shell.open_people())
	_fixture("bell", Rect2(488, 575, 105, 85), "接客铃", _bell_clicked, false)
	status_readout = UIKit.label("", 20, Color("ecdabb"), true)
	status_readout.position = Vector2(1394, 185)
	status_readout.size = Vector2(435, 32)
	status_readout.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	status_readout.add_theme_color_override("font_outline_color", Color("261d28"))
	status_readout.add_theme_constant_override("outline_size", 4)
	status_readout.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(status_readout)
	var x := 1637.0
	for spec in [["help", "手册", "help"], ["sound", "声音", "soundOn"], ["settings", "设置", "settings"]]:
		var key: String = spec[0]
		var b := UIKit.button("", "chip", Vector2(48, 42), 17, spec[2])
		b.position = Vector2(x, 112)
		b.tooltip_text = spec[1]
		b.add_theme_constant_override("icon_max_width", 26)
		b.pressed.connect(func(): _utility_clicked(key, b))
		add_child(b)
		fixture_buttons[key] = b
		x += 60

func _refresh_utility_icons() -> void:
	if fixture_buttons.has("sound"):
		fixture_buttons.sound.icon = UIKit.icon("soundOn" if Game.prefs.sound else "soundOff")

func _bell_clicked() -> void:
	if Game.state.trade == null and Game.state.phase == "open":
		_ring()
	else:
		shell.sound("check", -8, 1.3)

func _utility_clicked(key: String, button: Button) -> void:
	if _scene_blocked():
		return
	match key:
		"help": shell.open_help()
		"settings": shell.open_settings()
		"sound":
			Game.prefs.sound = not Game.prefs.sound
			Game.save_prefs()
			shell._apply_sound()
			button.icon = UIKit.icon("soundOn" if Game.prefs.sound else "soundOff")

func _open_instrument(which: String) -> void:
	var it = Model.trade_item(Game.state) if Game.state.trade != null else null
	shell.go(which, it.uid if it != null else "")

func relayout() -> void:
	if not is_instance_valid(terminal) or not is_instance_valid(crate):
		return
	_align_stage()
	terminal.position = Vector2(1310, 414)
	terminal.size = Vector2(580, 336)
	crate.position = Vector2(604, 759)
	crate.size = Vector2(672, 224)
	actions.position = Vector2(54, 237)
	actions.size = Vector2(472, 44)
	bubble.position = bubble_rect.position
	bubble.size = bubble_rect.size
	bubble_name.position = Vector2(12, 10)
	bubble_name.size = Vector2(251, 27)
	bubble_label.position = Vector2(12, 43)
	bubble_label.size = Vector2(251, 188)
	tag.position = Vector2(666, 572)
	tag.size = Vector2(222, 58)
	tag_name.custom_minimum_size.x = 210
	tag_info.custom_minimum_size.x = 210
	idle_label.position = Vector2(692, 590)
	idle_label.size = Vector2(610, 56)
	if is_instance_valid(customer) and not customer.walking:
		customer.position = STAND - resident_window.position
	if is_instance_valid(mat_item):
		mat_item.bounds = drag_rect
		if not mat_item.dragging:
			mat_item.position = MAT_POS

func _refresh_board() -> void:
	var s := Game.state
	var day := int(s.day)
	board_day.text = "第 %02d 天 · %s" % [day, "营业" if s.phase == "open" else "休息"]
	var rent_day := mini(int(ceil(day / 7.0)) * 7, 21)
	board_rent.text = "今晚缴租 · 点此看事件" if rent_day == day else "租期余 %d 天 · 事件" % (rent_day - day)
	fixture_buttons.events.tooltip_text = "今日事件 · " + ("已处理" if Game.event_done() else "待查看")
	status_readout.text = "%s Cr   AP %d   关注 %d" % [Model.jnum(s.cash), int(s.ap), int(s.risk)]
	var active := 0
	for order in s.orders:
		if order.status == "active":
			active += 1
	orders_readout.text = "委托订单\n%d 笔待办" % active
	var event = Game.today_event()
	idle_jobs.text = "轨道旧货局 · 今日营业\n\n" + (event.title + "\n点左上日牌查看站内消息" if event != null and not Game.event_done() else "整理陈列 · 鉴定旧物 · 维修履约") + "\n\n服务铃就在柜台左侧"

func _stock_slot(it: Dictionary, picking: bool, display := false) -> Button:
	var def := GameData.def(it.defId)
	var t = Game.state.trade
	var why = Model.sale_eligibility(it, t.npcId) if picking and it.owner == "shop" else null
	if picking and it.owner != "shop":
		why = "不是店铺自有货"
	var slot := UIKit.button("", "chip", Vector2(76, 78) if display else Vector2(58, 58), 14)
	slot.icon = UIKit.item_icon(it.defId)
	slot.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	slot.expand_icon = true
	slot.add_theme_constant_override("icon_max_width", 74 if display else 52)
	if display:
		slot.add_theme_stylebox_override("normal", _flat(Color.TRANSPARENT))
		slot.add_theme_stylebox_override("hover", _flat(Color(0.6, 0.8, 0.7, 0.12), Color("e7ba70")))
	else:
		slot.add_theme_stylebox_override("normal", _flat(Color("29222d"), Color("65524e"), 2))
	if picking and why == null:
		slot.add_theme_stylebox_override("normal", _flat(Color(0.24, 0.48, 0.4, 0.3), Color("8db99d"), 2))
	elif picking:
		slot.modulate.a = 0.45
	slot.tooltip_text = "%s · 品相 %s%s" % [def.name, UIKit.pct(it.condition), " · 陈列中" if it.location == "display" else ""]
	slot.tooltip_text += ("\n点击推荐给顾客" if why == null else "\n" + String(why)) if picking else "\n点击在仓储查看"
	var uid: String = it.uid
	var reason = why
	slot.pressed.connect(func(): _stock_clicked(uid, picking, reason))
	return slot

func _refresh_desk() -> void:
	if crate == null:
		return
	_refresh_board()
	UIKit.clear(stock_grid)
	UIKit.clear(display_goods)
	var s := Game.state
	var items: Array = s.inventory
	stock_count.text = "%d 件 · 点击选货" % items.size()
	var t = s.trade
	var picking: bool = t != null and t.kind == "sell" and not t.has("selectedUid") and not t.locked
	for i in maxi(CRATE_COLS * 3, ceili(items.size() / float(CRATE_COLS)) * CRATE_COLS):
		if i < items.size():
			stock_grid.add_child(_stock_slot(items[i], picking))
		else:
			var empty := Control.new()
			empty.custom_minimum_size = Vector2(58, 58)
			empty.mouse_filter = Control.MOUSE_FILTER_IGNORE
			stock_grid.add_child(empty)
	# Actual shop-owned goods populate the painted shelves, display goods first.
	var shown: Array = []
	for it in items:
		if it.owner == "shop" and it.location == "display":
			shown.append(it)
	for it in items:
		if it.owner == "shop" and it.location != "display":
			shown.append(it)
	for i in mini(shown.size(), 9):
		var slot := _stock_slot(shown[i], picking, true)
		slot.position = Vector2(30 + (i % 3) * 124, 17 + (i / 3) * 103)
		display_goods.add_child(slot)
	if shown.is_empty():
		var empty := UIKit.label("陈列架暂空\n点击整理仓储", 21, UIKit.MUTED)
		empty.position = Vector2(56, 109)
		empty.mouse_filter = Control.MOUSE_FILTER_IGNORE
		display_goods.add_child(empty)
	if busy and t == null:
		return
	var it = Model.trade_item(s) if t != null else null
	tag.visible = it != null
	if it != null:
		tag_name.text = GameData.def(it.defId).name
		tag_info.text = "%s · %s · 物证 %d" % [UIKit.pct(it.condition), "运转" if it.working else "故障", Model.evidence_count(it)]
	idle_label.visible = it == null
	idle_jobs.visible = t == null
	if t == null:
		idle_label.text = "按左侧服务铃 · 接待下一位来客" if s.phase == "open" and s.cursor < Model.daily_visit_limit() else "预约已接待完 · 打开日结账本"
	else:
		idle_label.text = "请从陈列柜或下方抽屉选货"

func _stock_clicked(uid: String, picking: bool, why) -> void:
	if busy or _scene_blocked():
		return
	if not picking:
		shell.go("warehouse", uid)
		return
	if why != null:
		shell.toast(String(why))
		return
	shell.sound("click", -6)
	Game.dispatch({"type": "SELECT_TRADE", "uid": uid})

func _build_terminal() -> void:
	terminal = QuotationBody.new()
	terminal.silhouette = UIKit.tex("res://assets/ui/quotation-console.png").get_image()
	terminal.add_theme_stylebox_override("panel", _flat(Color.TRANSPARENT))
	add_child(terminal)
	var content := Control.new()
	content.custom_minimum_size = Vector2(580, 336)
	content.mouse_filter = Control.MOUSE_FILTER_IGNORE
	terminal.add_child(content)
	var housing := TextureRect.new()
	housing.texture = UIKit.tex("res://assets/ui/quotation-console.png")
	housing.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	housing.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	housing.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	housing.mouse_filter = Control.MOUSE_FILTER_IGNORE
	content.add_child(housing)
	# Live readouts sit in the painted LCD, not on an extra rectangular plate.
	scr.head = _terminal_label(content, Vector2(107, 48), Vector2(238, 23), 15, Color("a7cbbb"))
	scr.price = _terminal_label(content, Vector2(350, 43), Vector2(128, 33), 25, Color("e1c487"), true)
	scr.line1 = _terminal_label(content, Vector2(107, 75), Vector2(371, 22), 16, Color("d0d4b6"))
	scr.line2 = _terminal_label(content, Vector2(107, 98), Vector2(371, 20), 14, Color("9bb8a8"))
	scr.line3 = _terminal_label(content, Vector2.ZERO, Vector2.ZERO, 14, UIKit.MUTED)
	scr.line3.visible = false
	offer_panel = UIKit.plate(_flat(Color.TRANSPARENT))
	offer_panel.position = Vector2(56, 146)
	offer_panel.size = Vector2(466, 71)
	content.add_child(offer_panel)
	var controls := Control.new()
	controls.custom_minimum_size = Vector2(466, 71)
	controls.mouse_filter = Control.MOUSE_FILTER_IGNORE
	offer_panel.add_child(controls)
	dial = Dial.new()
	dial.position = Vector2(0, 0)
	dial.tooltip_text = "上下拖动旋钮调价 · 滚轮 ±5；也可用精确加减按钮"
	dial.changed.connect(func(val):
		if _scene_blocked():
			dial.set_value(_last_offer_value, false)
			return
		_update_offer_value(val)
		shell.sound("click", -20, 1.7))
	controls.add_child(dial)
	dial.custom_minimum_size = Vector2(68, 68)
	dial.set_deferred("size", Vector2(68, 68))
	var printed_label := UIKit.label("我的还价", 13, Color("363e36"))
	printed_label.position = Vector2(82, -7)
	printed_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	controls.add_child(printed_label)
	offer_label = UIKit.label("—", 26, Color("f0dfb3"), true)
	offer_label.position = Vector2(82, 10)
	offer_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	offer_label.add_theme_color_override("font_shadow_color", Color("333a34"))
	offer_label.add_theme_constant_override("shadow_offset_y", 2)
	controls.add_child(offer_label)
	var nudges := UIKit.hbox(4)
	nudges.position = Vector2(252, 10)
	for d in [-10, -1, 1, 10]:
		var k := UIKit.button(("+%d" % d) if d > 0 else ("−%d" % -d), "chip", Vector2(46, 30), 16)
		_till_key(k, "secondary")
		var step: int = d
		k.pressed.connect(func():
			if not _scene_blocked():
				dial.set_value(dial.value + step)
				dial.queue_redraw())
		nudges.add_child(k)
		nudge_keys.append(k)
	controls.add_child(nudges)
	evidence_box = UIKit.vbox(0)
	evidence_box.position = Vector2(82, 45)
	evidence_box.size = Vector2(384, 24)
	controls.add_child(evidence_box)
	chips = HFlowContainer.new()
	chips.add_theme_constant_override("h_separation", 4)
	chips.add_theme_constant_override("v_separation", 2)
	evidence_box.add_child(chips)
	footer = UIKit.label("", 16, Color("d0c6ad"), false, true)
	footer.position = Vector2(1046, 443)
	footer.size = Vector2(268, 43)
	footer.mouse_filter = Control.MOUSE_FILTER_IGNORE
	footer.visible = false
	add_child(footer)

## Restrained physical keycaps only for this worn metal device.
func _till_key(button: Button, kind: String) -> void:
	var fills := {"primary": Color("8d6e43"), "good": Color("496b5a"), "danger": Color("6a4c46"), "secondary": Color("565e53")}
	for state in ["normal", "hover", "pressed", "disabled"]:
		var fill: Color = fills.get(kind, fills.secondary)
		if state == "hover": fill = fill.lightened(0.12)
		elif state == "pressed": fill = fill.darkened(0.15)
		elif state == "disabled": fill = Color("40473f")
		var cap := _flat(fill, Color("282f2c"), 5)
		cap.border_width_bottom = 4 if state != "pressed" else 2
		cap.shadow_color = Color(0.07, 0.09, 0.08, 0.6)
		cap.shadow_size = 1
		cap.shadow_offset = Vector2(0, 2)
		cap.content_margin_top = 4
		cap.content_margin_bottom = 4
		button.add_theme_stylebox_override(state, cap)
	for state in ["font_color", "font_hover_color", "font_focus_color", "font_pressed_color"]:
		button.add_theme_color_override(state, Color("eee0bb"))
	button.add_theme_color_override("font_disabled_color", Color("858975"))
	button.add_theme_constant_override("outline_size", 0)

func _terminal_label(parent: Control, pos: Vector2, extent: Vector2, font_size: int, color: Color, mono := false) -> Label:
	var l := UIKit.label("", font_size, color, mono)
	l.position = pos
	l.size = extent
	l.clip_text = true
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	parent.add_child(l)
	return l

func _act(text: String, kind: String, fn: Callable, enabled := true, _wide := false, tip := "") -> Button:
	var caption := "抵押合同" if text.begins_with("抵押（") or text == "签抵押合同" else text
	var b := UIKit.button(caption, kind, Vector2(70, 42), 17)
	_till_key(b, kind)
	b.disabled = not enabled or busy
	b.tooltip_text = tip
	b.pressed.connect(func():
		if _scene_blocked():
			return
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
				var chip := UIKit.button(GameData.tool(e).short, "primary" if chosen_evidence == e else "chip", Vector2(0, 26), 15)
				var eid: String = e
				_till_key(chip, "primary" if chosen_evidence == e else "secondary")
				chip.pressed.connect(func():
					if _scene_blocked():
						return
					chosen_evidence = "" if chosen_evidence == eid else eid
					_refresh())
				chips.add_child(chip)
			if chips.get_child_count() == 0:
				chips.add_child(UIKit.label("物证插槽 · 先在鉴定仪取证", 13, Color("36463e")))
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
	dial.enabled = dial_on and not busy and not _scene_blocked()
	for k in nudge_keys:
		(k as Button).disabled = not dial.enabled
	offer_panel.visible = dial_on
	evidence_box.visible = dial_on
	footer.visible = t != null
	footer.tooltip_text = footer.text
	for k in ["line1", "line2", "line3"]:
		var l: Label = scr[k]
		if l.text.length() > 21:
			l.text = l.text.left(20) + "…"
	dial.queue_redraw()

func _update_offer_value(value: int) -> void:
	_last_offer_value = value
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
		pic.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		pic.custom_minimum_size = Vector2(0, 120)
		pic.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		pic.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		cv.add_child(pic)
		cv.add_child(UIKit.label(GameData.def(it.defId).name, 19, UIKit.TEXT))
		cv.add_child(UIKit.label("品相 %s · %s · 物证 %d" % [UIKit.pct(it.condition), "正常" if it.working else "故障", Model.evidence_count(it)], 15, UIKit.MUTED))
		var est := Model.estimate(it)
		cv.add_child(UIKit.label("挂牌 %s · 成本 %s" % [UIKit.money(it.listPrice), UIKit.money(it.cost)], 15, UIKit.AMBER))
		cv.add_child(UIKit.label("估值 %s" % (UIKit.money(est.low) if est.exact else "%s–%s Cr" % [Model.jnum(est.low), Model.jnum(est.high)]), 15, UIKit.CYAN))
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
	# A plain Panel deliberately does not inherit the wrapped text's minimum
	# height. Long dialogue scrolls inside the fixed service-window note.
	bubble = Panel.new()
	bubble.add_theme_stylebox_override("panel", _flat(Color("ded0ac"), Color("8e775c"), 0))
	bubble.clip_contents = true
	bubble.modulate.a = 0.0
	bubble.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(bubble)
	bubble_name = UIKit.label("", 17, UIKit.RUST)
	bubble_name.clip_text = true
	bubble_name.mouse_filter = Control.MOUSE_FILTER_IGNORE
	bubble.add_child(bubble_name)
	bubble_label = RichTextLabel.new()
	bubble_label.fit_content = false
	bubble_label.bbcode_enabled = false
	bubble_label.scroll_active = true
	bubble_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	bubble_label.add_theme_font_override("normal_font", UIKit.font)
	bubble_label.add_theme_font_size_override("normal_font_size", 21)
	bubble_label.add_theme_color_override("default_color", Color("332d32"))
	bubble_label.mouse_filter = Control.MOUSE_FILTER_STOP
	bubble.add_child(bubble_label)

func _say(text: String, type := true, mood := "") -> void:
	if customer == null or not is_instance_valid(customer):
		return
	if mood != "":
		customer.set_mood(mood)
	var npc := GameData.npc(customer.npc_id)
	bubble_name.text = "%s · %s" % [npc.name, npc.title]
	bubble_label.text = text
	bubble_label.tooltip_text = text
	bubble_label.scroll_to_line(0)
	var dur := text.length() * 0.035
	customer.say(dur + 0.2)
	bubble.modulate.a = 1.0
	if type and not Game.prefs.reduced_motion:
		bubble_label.visible_ratio = 0.0
		create_tween().tween_property(bubble_label, "visible_ratio", 1.0, dur)
		# Typewriter ticks run on a tween owned by this page, so leaving the
		# counter mid-sentence stops them instead of calling into a freed page.
		var ticks := create_tween()
		for i in int(text.length() / 4):
			ticks.tween_callback(func(): shell.sound("click", -26.0, randf_range(1.8, 2.3)))
			ticks.tween_interval(0.14)
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

## A thermal-paper slip prints out of the till, gets stamped and is torn
## off. It belongs to this page, so leaving the counter takes it away too.
func _receipt(t: Dictionary, price: float, pawn: bool, item_name: String) -> void:
	var kind := "抵押凭据" if pawn else ("收购凭据" if t.kind == "buy" else "销售凭据")
	var paper := UIKit.plate(UIKit.paper_style(20))
	paper.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var v := UIKit.vbox(6)
	v.custom_minimum_size.x = 300
	paper.add_child(v)
	var head := UIKit.hbox(8)
	head.add_child(UIKit.label("轨道旧货局", 20, UIKit.INK))
	head.add_child(UIKit.spacer(false))
	head.add_child(UIKit.label("No.%04d" % Game.state.completedTrades.size(), 16, Color("6b5a40"), true))
	v.add_child(head)
	v.add_child(UIKit.label("回环九号 · 下层旧港 · %s" % kind, 14, Color("6b5a40")))
	v.add_child(_dashes())
	var item_label := UIKit.label(item_name, 22, UIKit.INK, false, true)
	item_label.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	item_label.custom_minimum_size.x = 300
	v.add_child(item_label)
	var row := UIKit.hbox(8)
	row.add_child(UIKit.label("本金" if pawn else "成交", 18, Color("6b5a40")))
	row.add_child(UIKit.spacer(false))
	row.add_child(UIKit.label(UIKit.money(price), 30, UIKit.RUST, true))
	v.add_child(row)
	v.add_child(_dashes())
	v.add_child(UIKit.label("来客  %s · 第 %d 天" % [GameData.npc(t.npcId).name, int(Game.state.day)], 15, Color("6b5a40")))
	# Room for the stamp so it never lands on the text.
	var stamp_room := Control.new()
	stamp_room.custom_minimum_size = Vector2(0, 54)
	v.add_child(stamp_room)
	paper.set_meta("stamp_room", stamp_room)
	for c in v.find_children("*", "Control", true, false):
		(c as Control).mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(paper)
	paper.reset_size()
	# Prints below the till, clear of the visitor's speech.
	var final_pos := Vector2(1030, 700)
	paper.pivot_offset = Vector2(paper.size.x * 0.5, 0)
	if Game.prefs.reduced_motion:
		paper.position = final_pos
		_stamp(paper, pawn, t, false)
		var hold := paper.create_tween()
		hold.tween_interval(3.2)
		hold.tween_callback(paper.queue_free)
		return
	# Print: the slip feeds out of the till edge, line by line.
	paper.position = final_pos + Vector2(40, -20)
	paper.rotation = 0.06
	paper.scale = Vector2(1, 0.05)
	shell.sound("click", -12, 2.4)
	var tw := create_tween()
	tw.tween_property(paper, "scale", Vector2.ONE, 0.45).set_trans(Tween.TRANS_QUART).set_ease(Tween.EASE_OUT)
	tw.parallel().tween_property(paper, "position", final_pos, 0.45).set_trans(Tween.TRANS_QUART).set_ease(Tween.EASE_OUT)
	tw.parallel().tween_property(paper, "rotation", -0.035, 0.5).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	tw.tween_callback(func(): _stamp(paper, pawn, t, true))
	tw.tween_interval(2.4)
	# Torn off and filed: slide down toward the crate and fade.
	tw.tween_property(paper, "position", final_pos + Vector2(-60, 140), 0.45).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN)
	tw.parallel().tween_property(paper, "rotation", -0.18, 0.45)
	tw.parallel().tween_property(paper, "modulate:a", 0.0, 0.45)
	tw.tween_callback(paper.queue_free)

func _dashes() -> Control:
	var l := UIKit.label("- ".repeat(60), 14, Color("a8987a"))
	l.clip_text = true
	return l

func _stamp(paper: Control, pawn: bool, t: Dictionary, animate: bool) -> void:
	if not is_instance_valid(paper):
		return
	var text := "已抵押" if pawn else ("已收购" if t.kind == "buy" else "已售出")
	var stamp := PanelContainer.new()
	stamp.add_theme_stylebox_override("panel", UIKit.box(Color(0, 0, 0, 0), Color(0.72, 0.13, 0.1, 0.85), 6, 3, 8, 0))
	var l := UIKit.label(text, 30, Color(0.72, 0.13, 0.1, 0.9))
	stamp.add_child(l)
	stamp.mouse_filter = Control.MOUSE_FILTER_IGNORE
	# A plain Control does not lay out its children, so the stamp keeps the
	# spot reserved for it at the slip's bottom-right corner.
	var room: Control = paper.get_meta("stamp_room")
	room.add_child(stamp)
	stamp.reset_size()
	stamp.position = Vector2(room.size.x - stamp.size.x - 4, room.size.y - stamp.size.y + 6)
	stamp.pivot_offset = stamp.size * 0.5
	stamp.rotation = -0.2
	if not animate:
		return
	stamp.scale = Vector2.ONE * 2.2
	stamp.modulate.a = 0.0
	var st := create_tween()
	st.tween_property(stamp, "scale", Vector2.ONE, 0.12).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)
	st.parallel().tween_property(stamp, "modulate:a", 1.0, 0.08)
	st.tween_callback(func():
		shell.shake = 0.35
		shell.sound("drop", 0.0, 0.7))

# ---------------------------------------------------------------- input & frame

func world_cursor_shape(p: Vector2) -> int:
	if busy or _scene_blocked():
		return Input.CURSOR_ARROW
	if is_instance_valid(mat_item) and mat_item.dragging:
		return Input.CURSOR_DRAG
	if is_instance_valid(mat_item) and mat_item.draggable and not mat_item.busy and mat_item.contains(p):
		return Input.CURSOR_CAN_DROP
	if is_instance_valid(bell) and bell.hit_test(p):
		return Input.CURSOR_POINTING_HAND
	if is_instance_valid(customer) and Game.state.trade != null and _over_customer(p):
		return Input.CURSOR_POINTING_HAND
	return Input.CURSOR_ARROW

func _unhandled_input(e: InputEvent) -> void:
	if _scene_blocked() or busy:
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
	if _scene_blocked():
		if is_instance_valid(mat_item) and mat_item.dragging:
			mat_item.end_drag()
		return
	var p: Vector2 = shell.world_mouse()
	if is_instance_valid(mat_item):
		if mat_item.dragging:
			mat_item.drag_to(p)
		mat_item.hover = lerpf(mat_item.hover, 1.0 if mat_item.contains(p) or mat_item.dragging else 0.0, 0.2)
	if is_instance_valid(customer):
		customer.look = clampf((p.x - customer.global_position.x) / 700.0, -1.0, 1.0)
