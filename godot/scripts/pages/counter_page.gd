extends Page
## Every action belongs to a piece of equipment in the painted shop.
## Coordinates are the final 1920 x 1080 scene, not the former art transform.

const CUSTOMER_HEIGHT := 320.0
const CRATE_COLS := 10
# Mounting strips measured on the 1920×1080 shop illustration. Labels belong
# to these physical rails/bezel faces, independently of the equipment hit area.
const FIXTURE_MOUNTS := {
	"report": Rect2(218, 675, 244, 28),
	"warehouse": Rect2(212, 1003, 300, 28),
	"display": Rect2(180, 533, 370, 28),
	"repair": Rect2(1596, 1003, 204, 28),
	"inspect": Rect2(1417, 818, 146, 28),
	"orders": Rect2(1460, 384, 172, 26),
	"people": Rect2(1703, 382, 110, 26),
	"bell": Rect2(488, 675, 105, 28),
}
const Commerce = preload("res://scripts/model/commerce.gd")
var MAT_POS := Vector2(990, 575)
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
var alarm_button: Button
var _conversation_wait := 6.0
var cash_tray: Control
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
var status_panel: Control
var status_values := {}
var tag: PanelContainer
var tag_name: Label
var tag_info: Label
var idle_label: Label
var idle_jobs: Label
var offer_button: Button
var multi_trade_button: Button
var stage_root: Node2D
var back_root: Node2D
var resident_window: Control
var mat_rect := Rect2(600, 490, 710, 175)
var drag_rect := Rect2(660, 545, 600, 67)
var bubble_rect := Rect2(1032, 180, 283, 270)

## Extra counter depth in the room's original sage palette. The extension is
## behind all goods and controls, with stepped highlights like the painted desk.
class CounterExtension extends Node2D:
	func _draw() -> void:
		var shape := PackedVector2Array([Vector2(620,490), Vector2(1552,490), Vector2(1820,590), Vector2(210,590), Vector2(280,565), Vector2(610,565)])
		draw_colored_polygon(shape, Color("889374"))
		draw_colored_polygon(PackedVector2Array([Vector2(620,490),Vector2(680,490),Vector2(610,565)]), Color("869171"))
		draw_colored_polygon(PackedVector2Array([Vector2(1444,490),Vector2(1552,490),Vector2(1820,590),Vector2(1700,590)]), Color("8a9576"))
		draw_line(Vector2(620,491), Vector2(1552,491), Color("a1ab8c"), 3)
		draw_line(Vector2(620,491), Vector2(610,565), Color("7a8068"), 3)
		draw_line(Vector2(610,565), Vector2(280,565), Color("7a8068"), 3)
		draw_line(Vector2(280,565), Vector2(210,590), Color("7a8068"), 3)
		draw_line(Vector2(1552,491), Vector2(1820,590), Color("77826b"), 3)
		# Sparse horizontal pixel wear, kept behind the working surface.
		var random := RandomNumberGenerator.new()
		random.seed = 8142
		for i in 72:
			var x := random.randi_range(640, 1460)
			var y := random.randi_range(503, 580)
			var w := random.randi_range(3, 15)
			var col := Color(0.7, 0.74, 0.6, 0.10) if i % 2 == 0 else Color(0.32, 0.38, 0.3, 0.08)
			draw_rect(Rect2(x, y, w, 2), col)

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

## Equipment stays painted at rest. Each nameplate has a measured mounting
## strip; hover/focus decorates that plate without outlining adjacent objects.
class FixtureButton extends Button:
	var caption := ""
	var accent := Color("e7ba70")
	var permanent := true
	var caption_region := Rect2()
	func _ready() -> void:
		mouse_entered.connect(queue_redraw)
		mouse_exited.connect(queue_redraw)
		focus_entered.connect(queue_redraw)
		focus_exited.connect(queue_redraw)
	func _draw() -> void:
		var active := is_hovered() or has_focus()
		if caption == "":
			if active:
				draw_rect(Rect2(Vector2(3, 3), size - Vector2(6, 6)), accent, false, 2)
			return
		if not permanent and not active:
			return
		var font_size := mini(20, floori(caption_region.size.y - 8))
		while font_size > 14 and (UIKit.font.get_height(font_size) > caption_region.size.y - 2 or UIKit.font.get_string_size(caption, HORIZONTAL_ALIGNMENT_LEFT, -1, font_size).x > caption_region.size.x - 22):
			font_size -= 1
		var text_width := UIKit.font.get_string_size(caption, HORIZONTAL_ALIGNMENT_LEFT, -1, font_size).x
		var w := minf(caption_region.size.x, ceilf(text_width) + 22)
		var box := Rect2(caption_region.position + Vector2(floorf((caption_region.size.x - w) * 0.5), 0), Vector2(w, caption_region.size.y))
		# All trim, fasteners and focus marks are inset inside the mounting strip.
		draw_rect(box, Color("354b43") if active else Color("3d4239"))
		draw_rect(box, accent if active else Color("8f876c"), false, 1)
		draw_line(box.position + Vector2(2, 2), box.position + Vector2(w - 3, 2), Color("b2a380") if active else Color("6f7560"), 1)
		draw_line(box.position + Vector2(2, box.size.y - 2), box.end - Vector2(2, 2), Color("242b27"), 1)
		for x in [box.position.x + 4, box.end.x - 6]:
			draw_rect(Rect2(Vector2(x, box.position.y + floorf(box.size.y * 0.5) - 1), Vector2(2, 2)), accent if active else Color("a69c7d"))
		var baseline := floorf((box.size.y - UIKit.font.get_height(font_size)) * 0.5 + UIKit.font.get_ascent(font_size))
		draw_string(UIKit.font, box.position + Vector2(floorf((w - text_width) * 0.5), baseline), caption, HORIZONTAL_ALIGNMENT_LEFT, w - 20, font_size, Color("f0dfbd"))

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
	return Rect2(666, 42, 630, 76)

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
	back_root.add_child(CounterExtension.new())
	stage_root = Node2D.new()
	stage_root.material = Util.unshaded()
	add_world(stage_root, "top")
	_align_stage()
	# The importer lifts the original painted bell out of the background.
	# This is its sole visible copy, at the exact source coordinates.
	bell = ServiceBell.new()
	bell.position = Vector2(540, 650)
	stage_root.add_child(bell)
	_build_board()
	_build_terminal()
	_build_tag()
	_build_strip()
	_build_crate()
	_build_equipment()
	_build_police_controls()
	Game.prefs_changed.connect(_refresh_utility_icons)
	_refresh_utility_icons()
	# The till stands in front of the counter fixtures, like the illustration.
	move_child(terminal, -1)
	_build_bubble()
	relayout()
	_sync_world()
	_refresh()

func _align_stage() -> void:
	var inv := get_viewport().get_canvas_transform().affine_inverse() * Transform2D(0.0, shell.counter_offset())
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
		if TradeSession.session(Game.state).get("return_to_list",false): call_deferred("_open_trade_list")

func _crate_point() -> Vector2:
	return get_viewport().get_canvas_transform().affine_inverse() * crate.get_global_rect().get_center() if is_instance_valid(crate) else Vector2(940, 860)

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
	mat_item.setup(it.defId, it.uid, 105.0)
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
	if FIXTURE_MOUNTS.has(key):
		b.caption_region = Rect2(FIXTURE_MOUNTS[key].position - rect.position, FIXTURE_MOUNTS[key].size)
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
	_fixture("report", Rect2(200, 670, 270, 40), "日结账本 · 打烊", func(): shell.go("report"))

func _build_tag() -> void:
	tag = UIKit.plate(_flat(Color("d8c9a8"), Color("887859"), 4))
	tag.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(tag)
	var v := UIKit.hbox(10)
	v.mouse_filter = Control.MOUSE_FILTER_IGNORE
	tag.add_child(v)
	tag_name = UIKit.label("", 16, Color("322b2f"))
	tag_info = UIKit.label("", 13, Color("805041"))
	v.add_child(tag_name)
	v.add_child(tag_info)
	for label in [tag_name, tag_info]:
		label.mouse_filter = Control.MOUSE_FILTER_IGNORE
		label.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
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
	multi_trade_button=UIKit.button("多件买卖清单","primary",Vector2(200,44),18)
	multi_trade_button.name="multi_trade_open"
	multi_trade_button.pressed.connect(func():
		if not _scene_blocked(): call_deferred("_open_trade_list"))
	head.add_child(multi_trade_button)
	v.add_child(head)
	var sc := ScrollContainer.new()
	sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	sc.size_flags_vertical = Control.SIZE_EXPAND_FILL
	v.add_child(sc)
	stock_grid = UIKit.grid(CRATE_COLS, 6)
	sc.add_child(stock_grid)

func _build_equipment() -> void:
	_fixture("warehouse", Rect2(200, 735, 320, 300), "仓储 · 隔离柜", func(): shell.go("warehouse"))
	_fixture("display", Rect2(170, 220, 386, 344), "陈列柜 · 选货", func(): shell.go("warehouse"), false)
	display_goods = Control.new()
	display_goods.position = Vector2(170, 220)
	display_goods.size = Vector2(386, 314)
	display_goods.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(display_goods)
	_fixture("repair", Rect2(1410, 730, 400, 305), "维修工作台", func(): _open_instrument("repair"))
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
	_fixture("bell", Rect2(488, 575, 105, 132), "接客铃", _bell_clicked, false)
	_build_status()

func _build_status() -> void:
	var wall_unit := preload("res://scripts/ui/wall_status.gd")
	status_panel = wall_unit.new()
	status_panel.position = Vector2(1440, 48)
	status_panel.size = Vector2(432, 112)
	add_child(status_panel)
	var stats := UIKit.hbox(16)
	stats.position = Vector2(32, 20)
	stats.size = Vector2(368, 28)
	stats.mouse_filter = Control.MOUSE_FILTER_IGNORE
	status_panel.add_child(stats)
	for key in ["cash", "ap", "risk"]:
		var value := UIKit.label("", 20 if key == "cash" else 18, Color("c4d1a5"), true)
		value.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		value.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		value.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
		value.mouse_filter = Control.MOUSE_FILTER_IGNORE
		stats.add_child(value)
		status_values[key] = value
	var utilities := UIKit.hbox(16)
	utilities.position = Vector2(28, 64)
	utilities.size = Vector2(376, 32)
	utilities.alignment = BoxContainer.ALIGNMENT_CENTER
	status_panel.add_child(utilities)
	for spec in [["help", "手册", "help"], ["sound", "声音", "soundOn"], ["settings", "设置", "settings"]]:
		var key: String = spec[0]
		var b := Button.new()
		b.text = spec[1]
		b.custom_minimum_size = Vector2(112, 32)
		b.add_theme_font_size_override("font_size", 16)
		b.size_flags_horizontal = Control.SIZE_SHRINK_CENTER
		b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
		b.tooltip_text = spec[1]
		b.pressed.connect(func(): _utility_clicked(key, b))
		utilities.add_child(b)
		wall_unit.fit_key(b)
		# Godot aligns a Button's built-in icon independently of its text. Use
		# one centered row instead, while retaining the button text for a11y.
		for color in ["font_color", "font_hover_color", "font_pressed_color", "font_focus_color", "font_disabled_color"]:
			b.add_theme_color_override(color, Color.TRANSPARENT)
		var center := CenterContainer.new()
		center.name = "content"
		center.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
		center.mouse_filter = Control.MOUSE_FILTER_IGNORE
		b.add_child(center)
		var content := UIKit.hbox(5)
		content.name = "row"
		content.mouse_filter = Control.MOUSE_FILTER_IGNORE
		center.add_child(content)
		var icon := TextureRect.new()
		icon.name = "icon"
		icon.texture = UIKit.icon(spec[2])
		icon.custom_minimum_size = Vector2(18, 18)
		icon.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		icon.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		icon.size_flags_vertical = Control.SIZE_SHRINK_CENTER
		icon.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		icon.mouse_filter = Control.MOUSE_FILTER_IGNORE
		content.add_child(icon)
		var caption := UIKit.label(spec[1], 16, Color("3d3428"))
		caption.name = "caption"
		caption.vertical_alignment = VERTICAL_ALIGNMENT_CENTER
		caption.mouse_filter = Control.MOUSE_FILTER_IGNORE
		content.add_child(caption)
		fixture_buttons[key] = b

func _refresh_utility_icons() -> void:
	if fixture_buttons.has("sound"):
		fixture_buttons.sound.get_node("content/row/icon").texture = UIKit.icon("soundOn" if Game.prefs.sound else "soundOff")

func _bell_clicked() -> void:
	_ring()

func _utility_clicked(key: String, _button: Button) -> void:
	if _scene_blocked():
		return
	match key:
		"help": shell.open_help()
		"settings": shell.open_settings()
		"sound":
			Game.prefs.sound = not Game.prefs.sound
			Game.save_prefs()
			shell._apply_sound()
			_refresh_utility_icons()

func _open_instrument(which: String) -> void:
	var it = Model.trade_item(Game.state) if Game.state.trade != null else null
	shell.go(which, it.uid if it != null else "")

func relayout() -> void:
	if not is_instance_valid(terminal) or not is_instance_valid(crate):
		return
	_align_stage()
	terminal.position = Vector2(1385, 420)
	terminal.size = Vector2(580, 336)
	terminal.scale = Vector2(0.84, 0.84)
	crate.position = Vector2(604, 759)
	crate.size = Vector2(672, 224)
	actions.position = Vector2(54, 245)
	actions.size = Vector2(472, 44)
	bubble.position = bubble_rect.position
	bubble.size = bubble_rect.size
	bubble_name.position = Vector2(12, 10)
	bubble_name.size = Vector2(bubble_rect.size.x - 24, 27)
	bubble_label.position = Vector2(12, 43)
	bubble_label.size = Vector2(bubble_rect.size.x - 24, bubble_rect.size.y - 105)
	footer.position = Vector2(12, bubble_rect.size.y - 56)
	footer.size = Vector2(bubble_rect.size.x - 24, 46)
	call_deferred("_layout_bubble_content")
	tag.position = Vector2(640, 610)
	tag.size = Vector2(402, 32)
	tag_name.custom_minimum_size.x = 124
	tag_info.custom_minimum_size.x = 246
	idle_label.position = Vector2(692, 590)
	idle_label.size = Vector2(610, 56)
	if is_instance_valid(customer) and not customer.walking:
		customer.position = STAND - resident_window.position
	if is_instance_valid(mat_item):
		mat_item.bounds = drag_rect

func _refresh_board() -> void:
	var s := Game.state
	var day := int(s.day)
	board_day.text = "第 %02d 天 · %s" % [day, "营业" if s.phase == "open" else "休息"]
	var rent_day := mini(int(ceil(day / 7.0)) * 7, 21)
	board_rent.text = "今晚缴租 · 点此看事件" if rent_day == day else "租期余 %d 天 · 事件" % (rent_day - day)
	fixture_buttons.events.tooltip_text = "今日事件 · " + ("已处理" if Game.event_done() else "待查看")
	status_values.cash.text = "%s Cr" % Model.jnum(s.cash)
	status_values.ap.text = "AP %d" % int(s.ap)
	status_values.risk.text = "关注 %d" % int(s.risk)
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
	slot.icon = UIKit.physical_icon(it)
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
	if def.get("tier") == "luxury":
		if not picking:
			slot.add_theme_stylebox_override("normal", _flat(Color(0.27, 0.22, 0.12, 0.25), Color("bd995b"), 2))
		var crest := UIKit.tier_badge(it.defId, 18.0)
		crest.position = Vector2(slot.custom_minimum_size.x - 20, 1)
		slot.add_child(crest)
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
	stock_count.text = "%d 件 · 点击选货" % (items.size()+ (1 if WantedCases.has_notice(s) else 0))
	var t = s.trade
	var picking: bool = t != null and t.kind == "sell" and not t.has("selectedUid") and not t.locked
	var stock_total := items.size() + (1 if WantedCases.has_notice(s) else 0)
	for i in maxi(CRATE_COLS * 3, ceili(stock_total / float(CRATE_COLS)) * CRATE_COLS):
		if i < items.size():
			stock_grid.add_child(_stock_slot(items[i], picking))
		elif i == items.size() and WantedCases.has_notice(s):
			var document := UIKit.button("","secondary",Vector2(58,58),16)
			document.icon = load("res://assets/ui/wanted-document.svg")
			document.expand_icon = true
			document.name="wanted_inventory"
			document.tooltip_text="库存档案 · 取出或收起通缉名单"
			document.pressed.connect(func(): shell.toggle_wanted_notice())
			stock_grid.add_child(document)
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
		tag_name.text = WatchForgery.sale_name(it)
		tag_info.text = "%s · %s · 物证 %d" % [UIKit.pct(it.condition), "本店维护" if it.repaired else "状态待对照", Model.evidence_count(it)]
	idle_label.visible = it == null
	idle_jobs.visible = t == null
	if t == null:
		idle_label.text = "按左侧服务铃 · 接待下一位来客" if s.phase == "open" and s.cursor < Model.daily_visit_limit() else "预约已接待完 · 打开日结账本"
	else:
		idle_label.text = "巡警到店 · 领取协查名单，听巡警说明" if t.kind == "police" else "商人到店 · 在报价台查看商品" if t.kind == "merchant" else "请从陈列柜或下方抽屉选货"

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
	cash_tray = preload("res://scripts/ui/cash_tray.gd").new()
	cash_tray.name = "cash_tray"
	cash_tray.position = Vector2(392, 142)
	cash_tray.size = Vector2(116, 64)
	cash_tray.mouse_filter = Control.MOUSE_FILTER_STOP
	cash_tray.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	cash_tray.tooltip_text = "查看本局总流水"
	cash_tray.gui_input.connect(func(event: InputEvent):
		if event is InputEventMouseButton and event.button_index == MOUSE_BUTTON_LEFT and event.pressed and not busy and not _scene_blocked():
			shell.open_campaign_ledger()
			cash_tray.accept_event())
	content.add_child(cash_tray)
	# Live readouts sit in the painted LCD, not on an extra rectangular plate.
	scr.head = _terminal_label(content, Vector2(107, 48), Vector2(223, 23), 18, Color("a7cbbb"))
	scr.price = _terminal_label(content, Vector2(338, 42), Vector2(144, 36), 28, Color("f0d49b"), true)
	scr.line1 = _terminal_label(content, Vector2(107, 75), Vector2(371, 22), 18, Color("d0d4b6"))
	scr.line2 = _terminal_label(content, Vector2(107, 98), Vector2(371, 20), 16, Color("9bb8a8"))
	scr.line3 = _terminal_label(content, Vector2(92, 218), Vector2(408, 24), 17, Color("f0dfbd"))
	scr.line3.add_theme_stylebox_override("normal", _flat(Color("243b35")))
	scr.line3.visible = false
	offer_panel = UIKit.plate(_flat(Color.TRANSPARENT))
	offer_panel.position = Vector2(56, 139)
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
	offer_label = UIKit.label("—", 30, Color("f0dfb3"), true)
	offer_label.position = Vector2(82, 10)
	offer_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	offer_label.add_theme_color_override("font_shadow_color", Color("333a34"))
	offer_label.add_theme_constant_override("shadow_offset_y", 2)
	controls.add_child(offer_label)
	var nudges := UIKit.hbox(4)
	nudges.position = Vector2(252, 10)
	for d in [-10, -1, 1, 10]:
		var k := UIKit.button(("+%d" % d) if d > 0 else ("−%d" % -d), "chip", Vector2(46, 30), 18)
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
	footer = UIKit.label("", 16, Color("79523c"), false, true)
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
	var b := UIKit.button(caption, kind, Vector2(70, 42), 18)
	_till_key(b, kind)
	b.disabled = not enabled or busy
	b.tooltip_text = tip
	b.pressed.connect(func():
		if _scene_blocked():
			return
		shell.sound("click", -6)
		# Deferred: most actions refresh the console, which frees this button
		# while it is still emitting its pressed signal.
		fn.call_deferred())
	actions.add_child(b)
	return b

func _refresh() -> void:
	_refresh_desk()
	var s := Game.state
	var t = s.trade
	multi_trade_button.visible=t!=null and t.get("kind","") in ["buy","sell","merchant"]
	offer_button = null
	UIKit.clear(actions)
	UIKit.clear(chips)
	var dial_on := false
	var quote_problem := StoreCosts.device_problem(s, "quote_terminal")
	if t == null:
		var closed: bool = s.cursor >= Model.daily_visit_limit()
		scr.head.text = "今日营业中" if s.phase == "open" else "已打烊"
		scr.price.text = "%d/%d" % [mini(int(s.cursor) + 1, Model.daily_visit_limit()), Model.daily_visit_limit()]
		var nid := Commerce.next_visitor(s)
		if closed:
			scr.line1.text = "六位预约已处理"
			scr.line2.text = "整理仓储、维修或履约后可以打烊"
		else:
			scr.line1.text = "下一位：%s · %s" % [GameData.npc(nid).name, GameData.npc(nid).title]
			if nid == Commerce.MERCHANT_ID:
				scr.line2.text = "来售：维修材料与补给"
			elif int(s.cursor) % 2 == 0:
				var pv := Model.stock_preview(s)
				scr.line2.text = "来售：%s · 约 %s–%s Cr" % [GameData.def(pv.defId).name, Model.jnum(pv.priceBand[0]), Model.jnum(pv.priceBand[1])]
			else:
				scr.line2.text = "来购：" + Model.customer_need(nid).left(22)
		scr.line3.text = "按服务铃接客 · 每笔交割 1 AP"
		offer_label.text = "—"
		_act("接待下一位来客", "primary", func(): _ring(), s.phase == "open" and not closed and (s.ap >= 1 or Commerce.merchant_due(s) or Commerce.next_visitor(s) == WantedCases.OFFICER_ID))
		_act("打烊结算", "secondary", func(): shell.go("report"))
		var shown := 0
		for i in s.inventory:
			if i.location == "display":
				shown += 1
		footer.text = "陈列架：%d 件 · 可在仓储上架" % shown
	elif t.kind == "police":
		scr.head.text="巡警到访 · 衡岚"
		scr.price.text="协查档案"
		scr.line1.text="六张照片 · 留意外貌与交谈细节"
		scr.line2.text="正确报警有报酬，多次误报会处罚"
		scr.line3.text="名单在库存中，可随时取出贴放"
		_act("领取通缉名单" if not WantedCases.has_notice(s) else "展开名单","primary",func():
			if WantedCases.has_notice(Game.state): shell.toggle_wanted_notice()
			else: Game.dispatch({"type":"ISSUE_WANTED","tradeId":t.id}))
		_act("送警官离开","secondary",func(): Game.dispatch({"type":"REFUSE"}))
		footer.text="对照头像，不要只认一顶帽子。"
	elif t.kind == "merchant":
		var npc := GameData.npc(t.npcId)
		scr.head.text = "流动商人 · " + npc.name
		scr.price.text = "物资买卖"
		scr.line1.text = "常用维修材料"
		scr.line2.text = "稀有货物有概率出现"
		scr.line3.text = "可买材料，也可出售闲置物资"
		offer_label.text = "—"
		_act("查看商品", "primary", _merchant_shop)
		_act("送客", "secondary", func(): Game.dispatch({"type": "REFUSE"}))
		footer.text = "商人在店时才能购买维修材料"
	else:
		if not TradeSession.session(s).is_empty():
			var totals=TradeSession.summary(s)
			scr.head.text="双向买卖 · "+GameData.npc(t.npcId).name
			scr.price.text="多件清单"
			scr.line1.text="逐件议价与确认 · 统一交割"
			scr.line2.text="已确认售出%d件 / 买入%d件" % [totals.sell_count,totals.buy_count]
			scr.line3.text="收入%s · 支出%s · 差额%s Cr" % [Model.jnum(totals.income),Model.jnum(totals.expense),Model.jnum(totals.net)]
			_act("打开多件清单", "primary", _open_trade_list)
			_act("结束接待", "secondary", func(): Game.dispatch({"type":"TRADE_END","tradeId":t.id}))
			offer_panel.visible=false
			footer.text="交割后可继续商谈，结束接待才送客。"
			return
		var it = Model.trade_item(s)
		var npc := GameData.npc(t.npcId)
		var buy: bool = t.kind == "buy"
		scr.head.text = ("来客报价 · " if buy else "顾客出价 · ") + npc.name
		scr.price.text = Model.jnum(t.price) + " Cr" if it != null else "待选货"
		if it != null:
			var e := Model.estimate(it)
			scr.line1.text = "%s · %s %s" % [WatchForgery.sale_name(it).left(8), "估价", "%s–%s" % [Model.jnum(e.low), Model.jnum(e.high)]]
			scr.line2.text = "物证 %d · 议价 %d/3%s" % [Model.evidence_count(it), int(t.rounds), " · 已锁价" if t.locked else ""]
		else:
			scr.line1.text = "需求：" + Model.customer_need(t.npcId).left(20)
			scr.line2.text = "在货箱里挑一件合格的自有货"
		var cash_after: float = s.cash + (-float(t.price) if buy else float(t.price))
		scr.line3.text = "%s %s · 余 %s · 1 AP" % ["支出" if buy else "收入", UIKit.money(t.price), UIKit.money(cash_after)] if it != null else "选定货物后核对金额"
		scr.line3.tooltip_text = scr.line3.text
		if t.locked:
			_act(("支付 " if buy else "收款 ") + UIKit.money(t.price) + " 并交割", "primary", func(): Game.dispatch({"type": "DELIVER", "tradeId": t.id}), s.ap >= 1)
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
				if not GameData.relevant_tool(it.defId, e):
					continue
				var chip := UIKit.button(GameData.evidence_short(it.defId, e), "primary" if chosen_evidence == e else "chip", Vector2(0, 26), 17)
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
			offer_button = _act("出价 " + UIKit.money(dial.value), "primary", func(): _offer(), quote_problem == "", false, quote_problem)
			_act("接受 " + UIKit.money(t.price), "good", func(): Game.dispatch({"type": "ACCEPT"}), s.ap >= 1 and (not buy or s.cash >= t.price) and quote_problem == "", false, quote_problem)
			_act("拿去鉴定", "secondary", func(): shell.go("inspect", it.uid))
			if buy:
				var pawn_ok := Model.evidence_count(it) >= 2
				_act("签抵押合同" if pawn_ok else "抵押（需 2 条物证）", "secondary", func(): Game.dispatch({"type": "PAWN", "tradeId": t.id}), pawn_ok, false, "需两条物证；付估值约 40% 本金，3 天赎期")
			else:
				_act("换一件", "secondary", _pick_goods)
			_act("送客", "danger", func(): Game.dispatch({"type": "REFUSE"}))
		footer.text = Model.customer_need(t.npcId)
	var alarm_reason := WantedCases.report_reason(s)
	alarm_button.disabled = busy or alarm_reason != ""
	alarm_button.tooltip_text = alarm_reason if alarm_reason != "" else "核对当前来客后呼叫巡警；错误报警会记录次数"
	if dial_on and quote_problem != "":
		scr.line3.text = quote_problem
		scr.line3.tooltip_text = quote_problem
		footer.text = quote_problem
	dial.enabled = dial_on and quote_problem == "" and not busy and not _scene_blocked()
	for k in nudge_keys:
		(k as Button).disabled = not dial.enabled
	# The tray occupies the empty payment space. During active negotiation the
	# existing price/evidence controls retain their full touch targets.
	cash_tray.visible = not dial_on
	if not busy: cash_tray.set_cash(float(s.cash))
	offer_panel.visible = dial_on
	evidence_box.visible = dial_on
	scr.line3.visible = t != null
	footer.visible = t != null
	footer.tooltip_text = footer.text
	call_deferred("_layout_bubble_content")
	for k in ["line1", "line2"]:
		var l: Label = scr[k]
		if l.text.length() > 21:
			l.text = l.text.left(20) + "…"
	dial.queue_redraw()

func _merchant_shop() -> void:
	if Game.state.trade == null or Game.state.trade.kind != "merchant":
		return
	var panel: Array = shell.modal("流动商人的补给", 1100)
	var body: VBoxContainer = panel[0]
	var scroll := ScrollContainer.new()
	scroll.custom_minimum_size = Vector2(1000, 620)
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	body.add_child(scroll)
	var contents := UIKit.vbox(10)
	contents.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.add_child(contents)
	_populate_merchant(contents)

func _merchant_transaction(action: Dictionary, contents: VBoxContainer) -> void:
	Game.dispatch(action)
	call_deferred("_populate_merchant", contents)

func _populate_merchant(contents: VBoxContainer) -> void:
	if not is_instance_valid(contents) or contents.is_queued_for_deletion():
		return
	var current_focus := get_viewport().gui_get_focus_owner()
	var focus_key := ""
	if is_instance_valid(current_focus) and contents.is_ancestor_of(current_focus):
		focus_key = String(current_focus.get_meta("merchant_focus", ""))
	var focus_targets := {}
	UIKit.clear(contents)
	var s := Game.state
	var t = s.trade
	if t == null or t.kind != "merchant":
		contents.add_child(UIKit.label("商人已经离开。", 20, UIKit.MUTED))
		return
	contents.add_child(UIKit.label("现金 %s · 维修材料交易不消耗 AP" % UIKit.money(s.cash), 19, UIKit.AMBER))
	contents.add_child(UIKit.label("常用材料：商人离店后不能购买", 20, UIKit.TEXT))
	for material in GameData.materials:
		var row := UIKit.hbox(10)
		var id: String = material.id
		var name: String = material.name
		var available: int = int(t.stock.get(id, 0))
		var owned: int = int(s.materials.get(id, 0))
		var description := UIKit.label("%s  ·  商人 %d / 持有 %d" % [name, available, owned], 18, UIKit.TEXT)
		description.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		row.add_child(description)
		var buy := UIKit.button("购买 %s · %s" % [name, UIKit.money(material.price)], "primary", Vector2(220, 50), 17)
		buy.set_meta("merchant_focus", "buy:" + id)
		focus_targets["buy:" + id] = buy
		buy.disabled = available < 1 or s.cash < material.price
		buy.pressed.connect(func(): _merchant_transaction({"type": "BUY_MATERIAL", "id": id, "qty": 1}, contents))
		row.add_child(buy)
		var sell_price := maxi(1, floori(float(material.price) * 0.5))
		var sell := UIKit.button("出售 · %s" % UIKit.money(sell_price), "secondary", Vector2(135, 50), 17)
		sell.set_meta("merchant_focus", "sell:" + id)
		focus_targets["sell:" + id] = sell
		sell.disabled = owned < 1
		sell.pressed.connect(func(): _merchant_transaction({"type": "SELL_MATERIAL", "id": id, "qty": 1}, contents))
		row.add_child(sell)
		contents.add_child(row)
	contents.add_child(UIKit.rule())
	var rare = t.get("rare", null)
	if rare is Dictionary and rare.get("available", false):
		var rare_row := UIKit.hbox(10)
		var rare_name: String = GameData.def(rare.defId).name
		var label := UIKit.label("稀有货：%s · 入后仓" % rare_name, 19, UIKit.AMBER)
		label.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		rare_row.add_child(label)
		var buy_rare := UIKit.button("购买稀有货 · %s · 1 AP" % UIKit.money(rare.price), "good", Vector2(270, 50), 17)
		buy_rare.set_meta("merchant_focus", "rare")
		focus_targets["rare"] = buy_rare
		buy_rare.disabled = s.cash < rare.price or s.ap < 1
		buy_rare.pressed.connect(func(): _merchant_transaction({"type": "BUY_RARE_ITEM"}, contents))
		rare_row.add_child(buy_rare)
		contents.add_child(rare_row)
	else:
		contents.add_child(UIKit.label("本次没有可购买的稀有货。", 18, UIKit.MUTED))
	contents.add_child(UIKit.rule())
	contents.add_child(UIKit.label("出售手表 · 商人按自己的判断报价，每件消耗1 AP", 19, UIKit.TEXT))
	var eligible := 0
	for item in s.inventory:
		if item.owner != "shop" or item.has("orderId") or item.sealed or item.location == "isolation" or not item.sourceVerified:
			continue
		eligible += 1
		var uid: String = item.uid
		var price := Commerce.recovery_price(Game.state, item)
		var sell_item := UIKit.button("出售旧物 %s · 收 %s" % [WatchForgery.sale_name(item), UIKit.money(price)], "secondary", Vector2(0, 50), 17)
		sell_item.set_meta("merchant_focus", "item:" + uid)
		focus_targets["item:" + uid] = sell_item
		sell_item.disabled = s.ap < 1 or Commerce.forgery_rejected(s, item)
		if Commerce.forgery_rejected(s, item): sell_item.tooltip_text = "本轮商人已识破这只表的加工，不接受反复出售。"
		sell_item.pressed.connect(func(): _merchant_transaction({"type": "SELL_MERCHANT_ITEM", "uid": uid}, contents))
		contents.add_child(sell_item)
	if eligible == 0:
		contents.add_child(UIKit.label("没有可回收的自有货物。", 18, UIKit.MUTED))
	if focus_key != "":
		var target = focus_targets.get(focus_key, null)
		if target == null or target.disabled:
			for candidate in focus_targets.values():
				if not candidate.disabled:
					target = candidate
					break
		if target != null and not target.disabled:
			target.call_deferred("grab_focus")

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
		pic.texture = UIKit.physical_icon(it)
		pic.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		pic.custom_minimum_size = Vector2(0, 120)
		pic.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		pic.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		cv.add_child(pic)
		cv.add_child(UIKit.label(WatchForgery.sale_name(it), 19, UIKit.TEXT))
		cv.add_child(UIKit.label("品相 %s · %s · 物证 %d" % [UIKit.pct(it.condition), "本店维护" if it.repaired else "状态待对照", Model.evidence_count(it)], 15, UIKit.MUTED))
		var est := Model.estimate(it)
		cv.add_child(UIKit.label("挂牌 %s · 成本 %s" % [UIKit.money(it.listPrice), UIKit.money(it.cost)], 15, UIKit.AMBER))
		cv.add_child(UIKit.label("估值 %s" % ("%s–%s Cr" % [Model.jnum(est.low), Model.jnum(est.high)]), 15, UIKit.CYAN))
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
	footer.reparent(bubble)

func _layout_bubble_content() -> void:
	if not is_instance_valid(bubble) or not is_instance_valid(bubble_label) or not is_instance_valid(footer):
		return
	# Keep the purchase note next to the spoken line, while reserving room for
	# longer dialogue and retaining a bounded, scrollable text area.
	var top := 43.0
	var content_height := maxf(26.0, bubble_label.get_content_height())
	var note_y := minf(bubble_rect.size.y - 56.0, top + content_height + 10.0)
	bubble_label.size.y = note_y - top - 8.0
	footer.position.y = note_y
	bubble.size.y = note_y + 56.0

func _say(text: String, type := true, mood := "") -> void:
	# Leave time to read this line before the visitor volunteers another detail.
	_conversation_wait = maxf(6.0, text.length() * 0.16 + 3.0)
	if customer == null or not is_instance_valid(customer):
		return
	if mood != "":
		customer.set_mood(mood)
	var npc := GameData.npc(customer.npc_id)
	bubble_name.text = "%s · %s" % [npc.name, npc.title]
	# Purchase requirements live in the note below the dialogue, so long
	# arrival lines don't repeat the same text or run under the counter.
	var spoken := text
	var purchase := spoken.find(" 这次采购：")
	if purchase >= 0:
		spoken = spoken.left(purchase)
	bubble_label.text = spoken
	bubble_label.tooltip_text = spoken
	bubble_label.scroll_to_line(0)
	call_deferred("_layout_bubble_content")
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
	if busy or _scene_blocked():
		return
	var s := Game.state
	if s.trade != null or s.phase != "open" or (s.ap < 1 and not Commerce.merchant_due(s) and Commerce.next_visitor(s) != WantedCases.OFFICER_ID):
		return
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
			elif nt != null and customer != null and String(nt.line).contains("识破"):
				if is_instance_valid(mat_item):
					mat_item.queue_free()
					mat_item = null
				chosen_evidence = ""
				customer.shake_head()
				_say(nt.line, true, "reject")
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
		"REFUSE", "TRADE_END":
			if pt != null:
				await _leave_with_goods(pt, "tired")
		"DELIVER", "PAWN":
			if pt != null and nt == null:
				var sold = Model.trade_item(prev)
				await _deal(pt, a.type == "PAWN", WatchForgery.sale_name(sold) if sold != null else "货物")
		"ISSUE_WANTED", "ASK_VISITOR":
			if nt != null: _say(nt.line,true,"focused")
		"REPORT_VISITOR":
			if pt != null and nt == null: await _police_response(pt)
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

func _cash_point() -> Vector2:
	return cash_tray.note_center()

func _deal(t: Dictionary, pawn: bool, item_name: String) -> void:
	busy = true
	_refresh()
	var buy: bool = t.kind == "buy"
	var price: float = absf(Game.state.ledger[-1].amount) if pawn and not Game.state.ledger.is_empty() else float(t.price)
	var cash_change := -price if buy else price
	var before_cash: float = float(Game.state.cash) - cash_change
	cash_tray.set_cash(before_cash)
	if not is_instance_valid(customer):
		cash_tray.set_cash(float(Game.state.cash))
		busy = false
		_refresh()
		return
	customer.cheer()
	_say("痛快！东西归你了。" if buy else "好东西，钱给你点清。", true, "happy")
	var till := _cash_point()
	var hand: Vector2 = shell.world_to_ui(customer.hands())
	if not Game.prefs.reduced_motion:
		var bills := clampi(ceili(price / 50.0), 3, 8)
		var last_bill: Tween
		for i in bills:
			var balance := before_cash + cash_change * float(i + 1) / float(bills)
			last_bill = _bill(till if buy else hand, hand if buy else till, i, balance)
		await last_bill.finished
	cash_tray.set_cash(float(Game.state.cash))
	# The receipt can print while the goods change hands. Departure waits for
	# the actual item tween, rather than a shorter, unrelated timer.
	_receipt(t, price, pawn, item_name)
	customer.nod()
	if is_instance_valid(mat_item):
		var item := mat_item
		item.draggable = false
		if not Game.prefs.reduced_motion:
			var start := item.global_position
			var dest: Vector2 = _crate_point() if buy else customer.hands()
			var tw := create_tween()
			tw.tween_method(func(p: float):
				item.global_position = start.lerp(dest, p) + Vector2(0, -sin(p * PI) * 80.0)
				item.scale = Vector2.ONE * lerpf(1.0, 0.25 if buy else 0.6, p)
				item.modulate.a = 1.0 - smoothstep(0.75, 1.0, p), 0.0, 1.0, 0.6).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)
			await tw.finished
		item.queue_free()
		mat_item = null
	_hide_bubble()
	customer.walk_out(-500.0)
	await customer.left
	customer.queue_free()
	customer = null
	busy = false
	_refresh()

func _bill(from: Vector2, to: Vector2, i: int, landing_cash: float) -> Tween:
	var b := preload("res://scripts/ui/cash_tray.gd").new()
	b.name = "cash_bill_%d" % i
	b.single_bill = true
	b.size = Vector2(68, 30)
	b.pivot_offset = b.size * 0.5
	# Initialize before adding it to the scene: no first-frame flash at (0,0).
	b.position = from - b.size * 0.5
	add_child(b)
	var ctrl := (from + to) * 0.5 + Vector2(0, -70)
	var tw := create_tween()
	tw.tween_interval(0.075 * i)
	tw.tween_method(func(p: float):
		var q := from.lerp(ctrl, p).lerp(ctrl.lerp(to, p), p)
		b.position = q - b.size * 0.5
		b.rotation = lerpf(-0.04, 0.035, p) + sin(p * PI) * 0.06,
		0.0, 1.0, 0.52).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)
	tw.tween_callback(func():
		cash_tray.set_cash(landing_cash)
		shell.sound("coin", -10.0, 1.0)
		b.queue_free())
	return tw

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
				_bell_clicked()
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

func _process(delta: float) -> void:
	_align_stage()
	if _scene_blocked():
		if is_instance_valid(mat_item) and mat_item.dragging:
			mat_item.end_drag()
		return
	_advance_conversation(delta)
	var p: Vector2 = shell.world_mouse()
	if is_instance_valid(mat_item):
		if mat_item.dragging:
			mat_item.drag_to(p)
		mat_item.hover = lerpf(mat_item.hover, 1.0 if mat_item.contains(p) or mat_item.dragging else 0.0, 0.2)
	if is_instance_valid(customer):
		customer.look = clampf((p.x - customer.global_position.x) / 700.0, -1.0, 1.0)

# ------------------------------------------------ police / conversations
func _build_police_controls() -> void:
	alarm_button=UIKit.button("报警 · 呼叫巡警","danger",Vector2(280,44),18,"alert")
	alarm_button.name="alarm_button"
	alarm_button.position=Vector2(650,673)
	alarm_button.pressed.connect(func():
		if not busy and not _scene_blocked(): _confirm_alarm())
	add_child(alarm_button)

func _confirm_alarm() -> void:
	var reason:=WantedCases.report_reason(Game.state)
	if reason!="": shell.toast(reason);return
	var trade_id: String=Game.state.trade.id
	var npc_id: String=Game.state.trade.npcId
	var modal: Array=shell.modal("报警前核对来客",820)
	var body: VBoxContainer=modal[0]
	var photo:=TextureRect.new()
	photo.texture=UIKit.npc_icon(npc_id)
	photo.custom_minimum_size=Vector2(150,150)
	photo.expand_mode=TextureRect.EXPAND_IGNORE_SIZE
	photo.stretch_mode=TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	body.add_child(photo)
	body.add_child(UIKit.label("请先对照通缉照片、外貌和口供。前两次误报提醒，第三次起处罚60 Cr，之后逐次增加20 Cr。",20,UIKit.TEXT,false,true))
	var notice:=UIKit.button("拿出通缉名单对照","secondary",Vector2(0,48),19)
	notice.pressed.connect(func():
		modal[1].call()
		if not WantedCases.case_state(Game.state).paper.visible: shell.toggle_wanted_notice())
	body.add_child(notice)
	var confirm:=UIKit.button("确认报警，请巡警核对","danger",Vector2(0,54),20)
	confirm.name="confirm_alarm"
	confirm.pressed.connect(func():
		modal[1].call()
		Game.dispatch({"type":"REPORT_VISITOR","tradeId":trade_id}))
	body.add_child(confirm)

func _advance_conversation(delta: float) -> void:
	var trade = Game.state.trade
	if busy or _scene_blocked() or trade == null or not is_instance_valid(customer):
		return
	if Game.state.phase != "open" or trade.get("locked", false):
		return
	_conversation_wait -= delta
	if _conversation_wait > 0.0:
		return
	var log: Array = trade.get("talkLog", [])
	for topic in WantedCases.TOPICS:
		if not log.any(func(entry): return entry.topic == topic):
			Game.dispatch({"type":"ASK_VISITOR", "tradeId":trade.id, "topic":topic})
			return

func _police_response(previous_trade: Dictionary) -> void:
	busy=true
	_refresh()
	var result: Dictionary=WantedCases.case_state(Game.state).lastResult
	var patrol:=Customer.new()
	patrol.setup(WantedCases.OFFICER_ID)
	patrol.scale=Vector2.ONE*(CUSTOMER_HEIGHT/patrol.size.y)
	patrol.position=Vector2(530,STAND.y-resident_window.position.y)
	resident_window.add_child(patrol)
	patrol.walk_in(920)
	await patrol.arrived
	if is_instance_valid(customer):
		_say(result.get("text","巡警已完成核对。"),false,"focused")
		bubble_name.text="衡岚 · 旧港巡警"
		customer.talking=0
	patrol.say(1.2)
	if is_instance_valid(mat_item):
		var goods:=mat_item
		goods.draggable=false
		if not Game.prefs.reduced_motion:
			var from:=goods.global_position
			var to: Vector2=_crate_point() if previous_trade.kind=="sell" else patrol.hands() if result.get("arrested",false) else customer.hands() if is_instance_valid(customer) else _crate_point()
			var transfer:=create_tween()
			transfer.tween_method(func(p:float):
				goods.global_position=from.lerp(to,p)+Vector2(0,-sin(p*PI)*50)
				goods.modulate.a=1.0-smoothstep(.75,1,p),0.0,1.0,.4)
			await transfer.finished
		goods.queue_free()
		mat_item=null
	if not Game.prefs.reduced_motion: await get_tree().create_timer(1.3).timeout
	if is_instance_valid(customer):
		customer.walk_out(-500)
		await customer.left
		customer.queue_free()
		customer=null
	patrol.walk_out(-500)
	await patrol.left
	patrol.queue_free()
	_hide_bubble()
	busy=false
	_refresh()

func _open_trade_list() -> void:
	load("res://scripts/ui/trade_list.gd").open(shell)
