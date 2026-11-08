extends Node2D
## The shop around every screen: painted rooms with real 2D lights, the HUD,
## navigation dock, notices, modals, title and the day shutter.

const K := 1920.0 / 1672.0 * 1.04
const CENTER := Vector2(960, 540)
const PAGES := {
	"counter": "res://scripts/pages/counter_page.gd",
	"inspect": "res://scripts/pages/inspect_page.gd",
	"repair": "res://scripts/pages/repair_page.gd",
	"warehouse": "res://scripts/pages/warehouse_page.gd",
	"orders": "res://scripts/pages/orders_page.gd",
	"report": "res://scripts/pages/report_page.gd",
}
const NAV := [["counter", "柜台", "counter"], ["inspect", "鉴定", "inspect"], ["repair", "维修", "repair"], ["warehouse", "仓储", "warehouse"], ["orders", "订单", "orders"], ["report", "日结", "report"]]

var cam: Camera2D
var ambient: CanvasModulate
var ambient_base := Color(0.56, 0.57, 0.66)
var ambient_target := Color(0.56, 0.57, 0.66)
var layers := {}
var scene_nodes: Array[Node] = []
var flickers: Array = []
var bg: Sprite2D
var scene := ""
var ui: CanvasLayer
var fx: CanvasLayer
var root_ui: Control
var page_host: Control
var hud: Control
var nav: Control
var toast_box: VBoxContainer
var hint_label: Label
var modal_layer: Control
var page: Page
var page_name := ""
var nav_buttons := {}
var gauges := {}
var shown_cash := 0.0
var event_badge: Label
var shake := 0.0
var zoom_base := 1.0
var focus_point := CENTER
var focus := 0.0
var sounds := {}
var title: Control
var capture_dir := ""
var world_cursor := Input.CURSOR_ARROW

# A drawer gets its own isolated canvas/camera but shares the persistent Game.
# Only the root Shell owns a customer, the opening screen and ambient audio.
var workspace_mode := false
var workspace_parent: Node
var initial_page := "counter"
var workspace_shell: Node
var workspace_overlay: Control
var workspace_frame: PanelContainer
var workspace_container: SubViewportContainer
var workspace_title: Label
var workspace_close: Button
var workspace_origin: Control
var workspace_suspended_focus: Array = []
const WORKSPACE_LABELS := {"inspect": "鉴定台", "repair": "维修工作台", "warehouse": "货物抽屉", "orders": "委托终端", "report": "营业账本"}

func art(u: float, v: float) -> Vector2:
	return CENTER + (Vector2(u, v) - Vector2(836, 470.5)) * K

func _exit_tree() -> void:
	if not workspace_mode:
		preload("res://scripts/ui/cursor_art.gd").uninstall()

func _ready() -> void:
	if not workspace_mode:
		preload("res://scripts/ui/cursor_art.gd").install()
	UIKit.ensure()
	_build_world()
	_build_ui()
	_build_audio()
	get_viewport().size_changed.connect(_fit)
	_fit()
	get_viewport().gui_focus_changed.connect(_keyboard_focus_changed)
	Game.changed.connect(_on_changed)
	shown_cash = Game.state.cash
	go(initial_page)
	_refresh_hud()
	hud.hide()
	nav.hide()
	if workspace_mode:
		hint_label.show()
		return
	hint_label.hide()
	for a in OS.get_cmdline_user_args():
		if a.begins_with("--capture="):
			capture_dir = a.substr(10)
	if OS.get_cmdline_user_args().has("--inputtest"):
		var t = load("res://tests/input_test.gd").new()
		add_child(t)
		t.run(self)
	elif capture_dir != "":
		var cap = load("res://scripts/app/capture.gd").new()
		add_child(cap)
		cap.run(self, capture_dir)
	else:
		_show_title()

# ---------------------------------------------------------------- world

func _layer(n: String, z: int) -> Node2D:
	var l := Node2D.new()
	l.name = n
	l.z_index = z
	add_child(l)
	layers[n] = l
	return l

func layer(n: String) -> Node2D:
	return layers[n]

func _build_world() -> void:
	cam = Camera2D.new()
	cam.position = CENTER
	add_child(cam)
	ambient = CanvasModulate.new()
	ambient.color = ambient_base
	add_child(ambient)
	_layer("bg", 0)
	_layer("mid", 10)
	_layer("fg", 20)
	_layer("top", 40)
	bg = Sprite2D.new()
	bg.position = CENTER
	bg.scale = Vector2.ONE
	layers.bg.add_child(bg)

func _scene_node(n: Node, parent: Node) -> Node:
	parent.add_child(n)
	scene_nodes.append(n)
	return n

func set_scene(name: String) -> void:
	if name == scene:
		return
	scene = name
	for n in scene_nodes:
		if is_instance_valid(n):
			n.queue_free()
	scene_nodes.clear()
	flickers.clear()
	# The counter page plays inside the painted room: the visitor stands
	# behind the counter front (fg), fixtures sit on the walls and counter.
	if name == "counter" and not workspace_mode:
		bg.texture = UIKit.tex("res://assets/scene/shop_pixel.png")
		bg.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		bg.material = Util.unshaded()
		bg.self_modulate = Color.WHITE
		bg.show()
		return
	bg.hide()
	var surface := preload("res://scripts/ui/workspace_surface.gd").new()
	surface.material = Util.unshaded()
	_scene_node(surface, layers.bg)
	var warm := Color(1.0, 0.74, 0.45)
	var teal := Color(0.45, 0.95, 1.0)
	match name:
		"workbench":
			_light(art(482, 30), teal, 0.6, 3.6, 120, 0.3, 1.2, "tube")
			_light(art(1245, 30), teal, 0.55, 3.2, 120, 0.3, 1.1, "tube")
			_light(art(340, 195), warm, 1.1, 4.0, 90, 0.4, 0.8, "lamp")
			_light(art(1095, 233), Color(0.72, 0.42, 1.0), 0.8, 2.0, 50, 0.35, 0.6, "pulse")
			_light(art(1440, 195), Color(0.4, 1.0, 0.8), 0.55, 1.8, 50, 0.3, 0.6, "pulse")
			_light(art(880, 95), Color(0.5, 0.65, 1.0), 0.45, 4.0, 200)
			_light(art(836, 560), Color(1.0, 0.9, 0.78), 0.35, 9.0, 420)
		"warehouse":
			_light(art(210, 160), teal, 0.6, 3.6, 120, 0.3, 1.1, "tube")
			_light(art(685, 190), teal, 0.55, 3.2, 120, 0.3, 1.0, "tube")
			_light(art(925, 228), warm, 0.7, 2.2, 60, 0.45, 0.4, "lamp")
			_light(art(1625, 140), warm, 0.65, 2.2, 60, 0.45, 0.4)
			_light(art(1070, 318), warm, 0.6, 2.4, 50, 0.3, 0.7)
			_light(art(1533, 226), Color(0.75, 0.42, 1.0), 0.75, 2.0, 50, 0.35, 0.6, "pulse")
			_light(art(1450, 360), teal, 0.5, 3.0, 60, 0.0, 1.0, "pulse")
			_light(art(1280, 80), Color(0.5, 0.65, 1.0), 0.4, 4.0, 200)
			_light(art(836, 620), Color(1.0, 0.9, 0.78), 0.3, 9.0, 420)
	var dust := _particles(layers.mid, Vector2(900, 520), 80, 10.0, Color(1.0, 0.9, 0.75, 0.3))
	dust.emission_shape = CPUParticles2D.EMISSION_SHAPE_RECTANGLE
	dust.emission_rect_extents = Vector2(900, 360)
	dust.direction = Vector2(0.3, -1)
	dust.spread = 180
	dust.gravity = Vector2(0, -3)
	dust.initial_velocity_min = 4
	dust.initial_velocity_max = 12
	dust.scale_amount_min = 0.03
	dust.scale_amount_max = 0.07
	dust.preprocess = 10

func _light(pos: Vector2, color: Color, energy: float, scale: float, height := 60.0, glow := 0.0, glow_size := 1.0, kind := "steady") -> PointLight2D:
	var l := PointLight2D.new()
	l.texture = Util.light_tex()
	l.texture_scale = scale
	l.position = pos
	l.color = color
	l.energy = energy
	l.height = height
	_scene_node(l, self)
	var g: Sprite2D = null
	if glow > 0.0 and not workspace_mode:
		g = Sprite2D.new()
		g.texture = Util.radial(256, 0.3)
		g.position = pos
		g.modulate = Color(color.r, color.g, color.b, glow)
		g.scale = Vector2.ONE * glow_size
		g.material = Util.add_material()
		g.z_index = 30
		_scene_node(g, self)
	flickers.append([l, g, energy, kind, randf() * 10.0])
	return l

func _particles(parent: Node, pos: Vector2, amount: int, life: float, color: Color) -> CPUParticles2D:
	var p := CPUParticles2D.new()
	p.position = pos
	p.amount = amount
	p.lifetime = life
	p.texture = Util.radial(64, 0.4)
	p.color = color
	p.material = Util.add_material()
	p.gravity = Vector2.ZERO
	p.emitting = not Game.prefs.reduced_motion
	_scene_node(p, parent)
	return p

func dust_burst(at: Vector2, parent: Node2D) -> void:
	if Game.prefs.reduced_motion:
		return
	var p := CPUParticles2D.new()
	p.position = parent.to_local(at)
	p.amount = 26
	p.lifetime = 0.7
	p.one_shot = true
	p.explosiveness = 0.95
	p.texture = Util.radial(64, 0.4)
	p.color = Color(0.9, 0.85, 0.75, 0.5)
	p.emission_shape = CPUParticles2D.EMISSION_SHAPE_RECTANGLE
	p.emission_rect_extents = Vector2(110, 6)
	p.direction = Vector2(0, -1)
	p.spread = 80
	p.initial_velocity_min = 40
	p.initial_velocity_max = 110
	p.gravity = Vector2(0, 160)
	p.scale_amount_min = 0.12
	p.scale_amount_max = 0.3
	p.material = Util.unshaded()
	parent.add_child(p)
	p.emitting = true
	get_tree().create_timer(1.5).timeout.connect(p.queue_free)

# ---------------------------------------------------------------- UI frame

func _build_ui() -> void:
	ui = CanvasLayer.new()
	ui.layer = 10
	add_child(ui)
	fx = CanvasLayer.new()
	fx.layer = 30
	add_child(fx)
	root_ui = Control.new()
	root_ui.set_anchors_preset(Control.PRESET_FULL_RECT)
	root_ui.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root_ui.theme = UIKit.build_theme()
	root_ui.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	ui.add_child(root_ui)
	page_host = Control.new()
	page_host.set_anchors_preset(Control.PRESET_FULL_RECT)
	page_host.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root_ui.add_child(page_host)
	_build_hud()
	_build_nav()
	hint_label = UIKit.label("", 20, Color("e7dcc4"))
	hint_label.add_theme_color_override("font_outline_color", Color(0, 0, 0, 0.9))
	hint_label.add_theme_constant_override("outline_size", 6)
	hint_label.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	hint_label.set_anchors_preset(Control.PRESET_CENTER_BOTTOM)
	hint_label.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root_ui.add_child(hint_label)
	toast_box = UIKit.vbox(8)
	toast_box.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root_ui.add_child(toast_box)
	modal_layer = Control.new()
	modal_layer.set_anchors_preset(Control.PRESET_FULL_RECT)
	modal_layer.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root_ui.add_child(modal_layer)

func _build_hud() -> void:
	hud = UIKit.hbox(10)
	hud.position = Vector2(20, 14)
	hud.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root_ui.add_child(hud)
	var name_plate := UIKit.plate()
	name_plate.add_theme_stylebox_override("panel", _hud_style())
	var nv := UIKit.vbox(0)
	nv.add_child(UIKit.label("轨道旧货局", 22, Color("f6ebd4")))
	nv.add_child(UIKit.label("回环九号 · 下层旧港", 13, UIKit.MUTED))
	name_plate.add_child(nv)
	hud.add_child(name_plate)
	var g := UIKit.plate()
	g.add_theme_stylebox_override("panel", _hud_style())
	var row := UIKit.hbox(18)
	g.add_child(row)
	gauges.day = _gauge(row, "day", "营业日")
	gauges.ap = _gauge(row, "energy", "行动点")
	gauges.cash = _gauge(row, "credits", "现金")
	gauges.risk = _gauge(row, "alert", "站务关注")
	hud.add_child(g)
	hud.add_child(UIKit.spacer(false))
	var keys := UIKit.hbox(6)
	var ev := _hud_key("speech", "每日站内消息", func(): open_events())
	event_badge = UIKit.label("!", 16, Color("1a1006"))
	var bs := UIKit.box(UIKit.AMBER, Color.TRANSPARENT, 10, 0, 4, 0)
	var badge := PanelContainer.new()
	badge.add_theme_stylebox_override("panel", bs)
	badge.add_child(event_badge)
	badge.position = Vector2(39, -6)
	badge.mouse_filter = Control.MOUSE_FILTER_IGNORE
	ev.add_child(badge)
	event_badge.set_meta("panel", badge)
	keys.add_child(ev)
	keys.add_child(_hud_key("handbook", "人物档案", func(): open_people()))
	keys.add_child(_hud_key("help", "经营手册", func(): open_help()))
	var snd := _hud_key("soundOn" if Game.prefs.sound else "soundOff", "声音", func():
		Game.prefs.sound = not Game.prefs.sound
		Game.save_prefs()
		_apply_sound())
	snd.name = "sound-key"
	keys.add_child(snd)
	keys.add_child(_hud_key("settings", "设置", func(): open_settings()))
	hud.add_child(keys)

func _hud_style() -> StyleBox:
	var s := UIKit.skin("graphite", "sm", 12.0)
	s.content_margin_top = 7
	s.content_margin_bottom = 7
	s.content_margin_left = 12
	s.content_margin_right = 12
	return s

func _gauge(row: HBoxContainer, icon: String, caption: String) -> Label:
	var h := UIKit.hbox(6)
	var ic := TextureRect.new()
	ic.texture = UIKit.icon(icon)
	ic.custom_minimum_size = Vector2(32, 32)
	ic.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	ic.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	h.add_child(ic)
	var v := UIKit.vbox(0)
	v.add_child(UIKit.label(caption, 12, UIKit.MUTED))
	var val := UIKit.label("", 22, UIKit.AMBER, true)
	v.add_child(val)
	h.add_child(v)
	row.add_child(h)
	return val

func _hud_key(icon: String, tip: String, fn: Callable) -> Button:
	var b := UIKit.button("", "secondary", Vector2(52, 52), 18)
	b.icon = UIKit.icon(icon)
	b.expand_icon = true
	b.tooltip_text = tip
	b.add_theme_constant_override("icon_max_width", 32)
	b.pressed.connect(func():
		sound("click", -6)
		fn.call())
	return b

func _build_nav() -> void:
	nav = UIKit.plate()
	var s := UIKit.skin("rail", "sm", 8.0)
	s.content_margin_top = 6
	s.content_margin_bottom = 6
	s.content_margin_left = 8
	s.content_margin_right = 8
	nav.add_theme_stylebox_override("panel", s)
	var row := UIKit.hbox(6)
	nav.add_child(row)
	for spec in NAV:
		var b := UIKit.button(spec[1], "secondary", Vector2(128, 50), 19, spec[2])
		var id: String = spec[0]
		b.pressed.connect(func():
			sound("page", -8)
			go(id))
		row.add_child(b)
		nav_buttons[id] = b
	root_ui.add_child(nav)

func _fit() -> void:
	var vis := get_viewport().get_visible_rect().size
	zoom_base = 1.0
	hud.size.x = vis.x - 40
	nav.reset_size()
	nav.position = Vector2((vis.x - nav.size.x) * 0.5, vis.y - nav.size.y - 14)
	hint_label.size = Vector2(vis.x - 48, 42)
	hint_label.position = Vector2(24, vis.y - 48)
	if workspace_open():
		_layout_workspace()
	if page != null and page.has_method("relayout"):
		page.call("relayout")
	_place_toasts()

## Each page names a free spot for notices so they never cover its controls.
func _place_toasts() -> void:
	var r: Rect2 = page.toast_rect() if page != null else Rect2()
	if r.size == Vector2.ZERO:
		# Default: a strip under the HUD, over the room's back wall.
		var vis := get_viewport().get_visible_rect().size
		r = Rect2(vis.x * 0.5 - 330, 96, 660, 200)
	# Narrow existing notices first: a Control cannot shrink below its
	# children's minimum size, so resizing the box first kept the old width.
	for c in toast_box.get_children():
		var l: Label = c.get_child(0)
		l.custom_minimum_size.x = r.size.x - 36
		(c as Control).reset_size()
	toast_box.position = r.position
	toast_box.reset_size()
	toast_box.size = r.size
	toast_box.alignment = BoxContainer.ALIGNMENT_END if r.position.y > 300 else BoxContainer.ALIGNMENT_BEGIN

## Content area between HUD and dock, in UI coordinates.
func content_rect() -> Rect2:
	var vis := get_viewport().get_visible_rect().size
	return Rect2(16, 16, vis.x - 32, vis.y - 80) if workspace_mode else Rect2(20, 20, vis.x - 40, vis.y - 40)

# ---------------------------------------------------------------- pages

func go(name: String, focus_uid := "") -> void:
	if not PAGES.has(name):
		return
	if workspace_mode and name == "counter":
		workspace_parent.close_workspace()
		return
	if not workspace_mode:
		if name != "counter":
			open_workspace(name, focus_uid)
			return
		if workspace_open():
			close_workspace()
			return
	if focus_uid != "":
		Game.focus_uid = focus_uid
	if page != null:
		page.leave()
		page.queue_free()
	page_name = name
	var script: GDScript = load(PAGES[name])
	page = script.new()
	page.shell = self
	page_host.add_child(page)
	set_scene(page.scene_name())
	ambient_target = Color.WHITE if name == "counter" else ambient_base
	focus = 0.0
	page.enter()
	_place_toasts()
	if not Game.prefs.reduced_motion:
		page.modulate.a = 0.0
		var final_position := page.position
		page.position.y += 12.0
		var transition := create_tween().set_parallel(true)
		transition.tween_property(page, "position", final_position, 0.24).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
		transition.tween_property(page, "modulate:a", 1.0, 0.2)
	for k in nav_buttons:
		var b: Button = nav_buttons[k]
		b.add_theme_stylebox_override("normal", UIKit.key_style("primary" if k == name else "secondary", "normal"))
	_refresh_hud()
	hint(page.hint_text())
	if workspace_mode:
		workspace_parent._workspace_heading(name)

func workspace_open() -> bool:
	return is_instance_valid(workspace_shell) and is_instance_valid(workspace_overlay) and not workspace_overlay.is_queued_for_deletion()

func active_shell() -> Node:
	return workspace_shell if workspace_open() else self

func open_workspace(name: String, focus_uid := "") -> void:
	if focus_uid != "":
		Game.focus_uid = focus_uid
	if workspace_open():
		workspace_shell.go(name, focus_uid)
		_workspace_heading(name)
		return
	workspace_origin = get_viewport().gui_get_focus_owner()
	workspace_suspended_focus.clear()
	_suspend_home_focus()
	if page.has_method("workspace_state_changed"):
		page.workspace_state_changed(true)
	workspace_overlay = Control.new()
	workspace_overlay.set_anchors_preset(Control.PRESET_FULL_RECT)
	workspace_overlay.mouse_filter = Control.MOUSE_FILTER_STOP
	root_ui.add_child(workspace_overlay)
	root_ui.move_child(modal_layer, -1)
	var dim := ColorRect.new()
	dim.color = Color(0.07, 0.06, 0.09, 0.38)
	dim.set_anchors_preset(Control.PRESET_FULL_RECT)
	dim.mouse_filter = Control.MOUSE_FILTER_IGNORE
	workspace_overlay.add_child(dim)
	workspace_frame = UIKit.plate(UIKit.skin("rail", "lg", 16))
	workspace_overlay.add_child(workspace_frame)
	var body := UIKit.vbox(12)
	workspace_frame.add_child(body)
	var header := UIKit.hbox(12)
	workspace_title = UIKit.label("", 27, UIKit.AMBER)
	workspace_title.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	header.add_child(workspace_title)
	header.add_child(UIKit.label("店内操作  /  ESC 收起", 18, UIKit.MUTED))
	workspace_close = UIKit.button("收起", "secondary", Vector2(108, 48), 20, "close")
	workspace_close.pressed.connect(close_workspace)
	header.add_child(workspace_close)
	body.add_child(header)
	workspace_container = SubViewportContainer.new()
	workspace_container.custom_minimum_size = Vector2(1600, 900)
	workspace_container.stretch = true
	workspace_container.mouse_filter = Control.MOUSE_FILTER_STOP
	body.add_child(workspace_container)
	var viewport := SubViewport.new()
	viewport.size = Vector2i(1600, 900)
	viewport.world_2d = World2D.new()
	viewport.render_target_update_mode = SubViewport.UPDATE_ALWAYS
	viewport.handle_input_locally = true
	workspace_container.add_child(viewport)
	workspace_shell = load("res://main.tscn").instantiate()
	workspace_shell.workspace_mode = true
	workspace_shell.workspace_parent = self
	workspace_shell.initial_page = name
	viewport.add_child(workspace_shell)
	_layout_workspace()
	workspace_close.call_deferred("grab_focus")
	sound("page", -8)
	if not Game.prefs.reduced_motion:
		var destination := workspace_frame.position
		workspace_frame.position.y += 28
		workspace_frame.modulate.a = 0
		var tw := workspace_frame.create_tween().set_parallel(true)
		tw.tween_property(workspace_frame, "position", destination, 0.2).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
		tw.tween_property(workspace_frame, "modulate:a", 1.0, 0.16)

func _suspend_home_focus() -> void:
	for control in page.find_children("*", "Control", true, false):
		if control.focus_mode != Control.FOCUS_NONE:
			workspace_suspended_focus.append([control, control.focus_mode])
			control.focus_mode = Control.FOCUS_NONE

func _layout_workspace() -> void:
	workspace_frame.reset_size()
	workspace_frame.position = ((get_viewport().get_visible_rect().size - workspace_frame.size) * 0.5).floor()

func _workspace_heading(name: String) -> void:
	if is_instance_valid(workspace_title):
		workspace_title.text = WORKSPACE_LABELS.get(name, "店内设备")

func close_workspace() -> void:
	if not workspace_open():
		return
	# Stop processing before queue_free, so Escape cannot close two layers.
	workspace_shell.set_process_input(false)
	workspace_overlay.hide()
	workspace_overlay.queue_free()
	workspace_shell = null
	workspace_overlay = null
	for entry in workspace_suspended_focus:
		if is_instance_valid(entry[0]):
			entry[0].focus_mode = entry[1]
	workspace_suspended_focus.clear()
	if page.has_method("workspace_state_changed"):
		page.workspace_state_changed(false)
	if is_instance_valid(workspace_origin) and workspace_origin.is_visible_in_tree():
		workspace_origin.grab_focus()
	sound("page", -12, 0.85)

func _on_changed(prev: Dictionary, next: Dictionary, action: Dictionary) -> void:
	if action.type == "NEW_GAME":
		if workspace_mode:
			return
		close_workspace()
		Game.set_meta("counter_offer_drafts", {})
		go("counter")
		_refresh_hud()
		return
	if not workspace_open() and next.notice != "" and (next.notice != prev.notice or action.type != "OFFER"):
		toast(next.notice)
	var spent: float = prev.ap - next.ap
	if spent > 0 and hud.visible:
		float_text("−%s AP" % Model.jnum(spent), gauges.ap.get_global_rect().get_center() + Vector2(-10, 70), UIKit.CYAN)
	if page != null:
		page.on_changed(prev, next, action)
	if workspace_open():
		_suspend_home_focus()
	_refresh_hud()
	hint(page.hint_text() if page else "")
	if action.type == "NEXT" and next.phase == "open" and not workspace_mode:
		close_workspace()
		shutter(next.day)

func _refresh_hud() -> void:
	var s := Game.state
	gauges.day.text = "%02d/21" % int(s.day)
	gauges.ap.text = "%d/12" % int(s.ap)
	gauges.risk.text = "%d" % int(s.risk)
	gauges.risk.add_theme_color_override("font_color", UIKit.DANGER if s.risk >= 60 else UIKit.AMBER)
	var panel: Control = event_badge.get_meta("panel")
	panel.visible = s.phase == "open" and not Game.event_done() and Game.today_event() != null
	var b: Button = root_ui.find_child("sound-key", true, false)
	if b:
		b.icon = UIKit.icon("soundOn" if Game.prefs.sound else "soundOff")

func hint(text: String) -> void:
	if hint_label.text == text:
		return
	hint_label.text = text
	if Game.prefs.reduced_motion:
		hint_label.modulate.a = 1.0
		return
	hint_label.modulate.a = 0.0
	create_tween().tween_property(hint_label, "modulate:a", 1.0, 0.3)

# ---------------------------------------------------------------- feedback

func toast(text: String, tone := "info") -> void:
	# The same notice twice in a row (e.g. arriving and then opening the
	# workbench) only refreshes the one already shown.
	if toast_box.get_child_count() > 0:
		var last := toast_box.get_child(toast_box.get_child_count() - 1)
		if not last.is_queued_for_deletion() and (last.get_child(0) as Label).text == text:
			return
	var p := UIKit.plate(UIKit.paper_style(14))
	var l := UIKit.label(text, 20, UIKit.INK if tone == "info" else UIKit.RUST, false, true)
	l.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	l.custom_minimum_size = Vector2(toast_box.size.x - 36, 0)
	p.add_child(l)
	toast_box.add_child(p)
	while toast_box.get_child_count() > 2:
		var old := toast_box.get_child(0)
		toast_box.remove_child(old)
		old.queue_free()
	if Game.prefs.reduced_motion:
		var hold := p.create_tween()
		hold.tween_interval(4.0)
		hold.tween_callback(p.queue_free)
		return
	p.modulate.a = 0.0
	var tw := p.create_tween()
	tw.tween_property(p, "modulate:a", 1.0, 0.18)
	tw.tween_interval(3.6)
	tw.tween_property(p, "modulate:a", 0.0, 0.4)
	tw.tween_callback(p.queue_free)

func float_text(text: String, at: Vector2, color := UIKit.AMBER) -> void:
	var l := UIKit.label(text, 26, color, true)
	l.add_theme_color_override("font_outline_color", Color(0, 0, 0, 0.9))
	l.add_theme_constant_override("outline_size", 6)
	fx.add_child(l)
	l.position = at - Vector2(40, 0)
	if Game.prefs.reduced_motion:
		var hold := l.create_tween()
		hold.tween_interval(1.2)
		hold.tween_callback(l.queue_free)
		return
	var tw := l.create_tween()
	tw.tween_property(l, "position:y", at.y - 50, 0.9).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
	tw.parallel().tween_property(l, "modulate:a", 0.0, 0.9).set_delay(0.3)
	tw.tween_callback(l.queue_free)

func sound(k: String, db := 0.0, pitch := 1.0) -> void:
	var p: AudioStreamPlayer = sounds.get(k)
	if p and Game.prefs.sound:
		p.volume_db = db
		p.pitch_scale = pitch
		p.play()

func _build_audio() -> void:
	for k in ["click", "coin", "check", "page", "drop", "open", "reject", "ambient_loop"]:
		var p := AudioStreamPlayer.new()
		p.stream = load("res://assets/audio/%s.wav" % k)
		add_child(p)
		sounds[k] = p
	var amb: AudioStreamPlayer = sounds.ambient_loop
	amb.volume_db = -18.0
	amb.finished.connect(func():
		if Game.prefs.sound and not workspace_mode:
			amb.play())
	_apply_sound()

func _apply_sound() -> void:
	var amb: AudioStreamPlayer = sounds.ambient_loop
	if Game.prefs.sound and not workspace_mode and not amb.playing:
		amb.play()
	elif not Game.prefs.sound or workspace_mode:
		amb.stop()
	_refresh_hud()

var last_screen := Vector2(960, 540)
var pointer_override: Variant = null

## Pointer in world space, tracked from input events (reliable on the web too).
func world_mouse() -> Vector2:
	if pointer_override != null:
		return pointer_override
	return get_viewport().get_canvas_transform().affine_inverse() * last_screen

# A viewport owns its own GUI focus. Keep one focus owner across the drawer
# boundary and traverse only the currently visible interaction layer.
func _focusable_controls(node: Node) -> Array[Control]:
	var controls: Array[Control] = []
	if node is SubViewport or node.is_queued_for_deletion():
		return controls
	if node is Control:
		var control := node as Control
		if not control.is_visible_in_tree():
			return controls
		if control.focus_mode == Control.FOCUS_ALL and not (control is BaseButton and control.disabled):
			controls.append(control)
	for child in node.get_children():
		controls.append_array(_focusable_controls(child))
	return controls

func _modal_controls() -> Array[Control]:
	for index in range(modal_layer.get_child_count() - 1, -1, -1):
		var dim := modal_layer.get_child(index)
		# An exiting sheet still blocks input until it has left the tree.
		if dim.has_meta("closing"):
			return []
		return _focusable_controls(dim)
	return []

func _keyboard_controls() -> Array[Control]:
	if modal_open():
		return _modal_controls()
	if workspace_open():
		if workspace_shell.modal_open():
			return workspace_shell._modal_controls()
		var controls: Array[Control] = [workspace_close]
		controls.append_array(workspace_shell._focusable_controls(workspace_shell.page))
		return controls
	return []

func _keyboard_owner() -> Control:
	var owner := get_viewport().gui_get_focus_owner()
	if owner == null and workspace_open():
		owner = workspace_shell.get_viewport().gui_get_focus_owner()
	return owner

func _focus_keyboard(control: Control) -> void:
	get_viewport().gui_release_focus()
	if workspace_open():
		workspace_shell.get_viewport().gui_release_focus()
	if is_instance_valid(control) and control.is_visible_in_tree() and not control.is_queued_for_deletion():
		control.grab_focus()

func _keyboard_focus_changed(control: Control) -> void:
	if workspace_mode:
		workspace_parent._keyboard_focus_changed(control)
		return
	if control == null or not (modal_open() or workspace_open()):
		return
	var controls := _keyboard_controls()
	if not controls.has(control):
		_focus_keyboard(controls[0] if not controls.is_empty() else null)
		return
	if not workspace_open():
		return
	# Pointer focus transfers must also retire the other viewport's owner.
	if control.get_viewport() == get_viewport():
		workspace_shell.get_viewport().gui_release_focus()
	else:
		get_viewport().gui_release_focus()

func _restore_keyboard_focus(previous: Variant) -> void:
	if workspace_mode:
		workspace_parent._restore_keyboard_focus(previous)
		return
	if modal_open() or workspace_open():
		var controls := _keyboard_controls()
		if controls.has(previous):
			_focus_keyboard(previous)
		elif not controls.is_empty():
			_focus_keyboard(controls[0])
	elif is_instance_valid(previous) and previous.is_visible_in_tree():
		_focus_keyboard(previous)

func _route_layer_key(event: InputEventKey) -> bool:
	if workspace_mode or not (modal_open() or workspace_open()):
		return false
	var controls := _keyboard_controls()
	var owner := _keyboard_owner()
	if event.keycode == KEY_TAB:
		if event.pressed and not event.echo and not controls.is_empty():
			var index := controls.find(owner)
			var next := (controls.size() - 1 if event.shift_pressed else 0) if index < 0 else posmod(index + (-1 if event.shift_pressed else 1), controls.size())
			_focus_keyboard(controls[next])
		get_viewport().set_input_as_handled()
		return true
	if not controls.has(owner):
		_focus_keyboard(controls[0] if not controls.is_empty() else null)
		owner = _keyboard_owner()
	if owner == null:
		get_viewport().set_input_as_handled()
		return true
	if owner.get_viewport() != get_viewport():
		# Forward real key events to Godot's GUI machinery, including releases,
		# so buttons, sliders and selectors retain native activation behavior.
		get_viewport().set_input_as_handled()
		owner.get_viewport().push_input(event, true)
		return true
	return false

func _input(e: InputEvent) -> void:
	if e is InputEventKey and e.keycode != KEY_ESCAPE and _route_layer_key(e):
		return
	if e is InputEventMouse:
		last_screen = (e as InputEventMouse).position
	elif e is InputEventKey and e.pressed and not e.echo and (e as InputEventKey).keycode == KEY_ESCAPE:
		if modal_open():
			close_top_modal()
		elif workspace_open():
			if workspace_shell.modal_open():
				workspace_shell.close_top_modal()
			else:
				close_workspace()
		elif workspace_mode:
			workspace_parent.close_workspace()
		else:
			return
		get_viewport().set_input_as_handled()

## Godot controls choose their own cursor on hover. Only select a world cursor
## when the pointer is over the world, so panels and modals retain precedence.
func _workspace_pointer_inside() -> bool:
	return workspace_open() and workspace_container.get_global_rect().has_point(last_screen) and not modal_open()

func _update_cursor() -> void:
	if _workspace_pointer_inside():
		return
	if workspace_mode and not workspace_parent._workspace_pointer_inside():
		return
	var hovering := get_viewport().gui_get_hovered_control()
	var shape := Input.CURSOR_ARROW
	if hovering is BaseButton:
		var button := hovering as BaseButton
		button.mouse_default_cursor_shape = Control.CURSOR_FORBIDDEN if button.disabled else Control.CURSOR_POINTING_HAND
		shape = Input.CURSOR_FORBIDDEN if button.disabled else Input.CURSOR_POINTING_HAND
	elif hovering is HSlider:
		shape = Input.CURSOR_HSIZE
	elif hovering is VSlider:
		shape = Input.CURSOR_VSIZE
	elif hovering != null:
		var local_point := hovering.get_global_transform_with_canvas().affine_inverse() * last_screen
		shape = hovering.call("cursor_at", local_point) if hovering.has_method("cursor_at") else hovering.get_cursor_shape(local_point)
	if is_instance_valid(page) and not modal_open() and not workspace_open():
		var candidate: int = page.world_cursor_shape(world_mouse())
		# A held world item remains a drag even when crossing a UI panel.
		if hovering == null or candidate == Input.CURSOR_DRAG:
			shape = candidate
	if shape != world_cursor or shape != Input.get_current_cursor_shape():
		world_cursor = shape
		Input.set_default_cursor_shape(shape)
		# A world drag is not captured by a Control. Keep its closed-hand shape
		# even while crossing an interactive panel until the mouse is released.
		if shape == Input.CURSOR_DRAG and hovering != null:
			DisplayServer.cursor_set_shape(DisplayServer.CURSOR_DRAG)

func world_to_ui(p: Vector2) -> Vector2:
	return get_viewport().get_canvas_transform() * p

# ---------------------------------------------------------------- modals

## A centred sheet; returns [content VBox, close Callable].
func modal(title_text: String, width := 900.0) -> Array:
	var focus_host: Node = workspace_parent if workspace_mode else self
	var previous_focus: Control = focus_host._keyboard_owner()
	focus_host._focus_keyboard(null)
	var dim := ColorRect.new()
	dim.color = Color(0.01, 0.02, 0.03, 0.62)
	dim.set_anchors_preset(Control.PRESET_FULL_RECT)
	dim.mouse_filter = Control.MOUSE_FILTER_STOP
	modal_layer.add_child(dim)
	dim.tree_exited.connect(func(): focus_host.call_deferred("_restore_keyboard_focus", previous_focus))
	var center := CenterContainer.new()
	center.set_anchors_preset(Control.PRESET_FULL_RECT)
	dim.add_child(center)
	var sheet := UIKit.plate()
	sheet.custom_minimum_size = Vector2(minf(width, get_viewport().get_visible_rect().size.x - 48.0), 0)
	center.add_child(sheet)
	var v := UIKit.vbox(12)
	sheet.add_child(v)
	var status_line := HBoxContainer.new()
	status_line.add_theme_constant_override("separation", 4)
	status_line.mouse_filter = Control.MOUSE_FILTER_IGNORE
	for i in 18:
		var segment := ColorRect.new()
		segment.color = UIKit.AMBER_DEEP if i % 2 == 0 else UIKit.INSET
		segment.custom_minimum_size = Vector2(0, 4)
		segment.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		status_line.add_child(segment)
	v.add_child(status_line)
	var head := UIKit.hbox()
	var t := UIKit.label(title_text, 30, UIKit.AMBER)
	t.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	head.add_child(t)
	var close := func():
		if not is_instance_valid(dim) or dim.has_meta("closing"):
			return
		dim.set_meta("closing", true)
		if dim.has_meta("opening_tween"):
			var opening: Tween = dim.get_meta("opening_tween")
			if opening.is_valid():
				opening.kill()
		if Game.prefs.reduced_motion:
			dim.queue_free()
			return
		var tw := dim.create_tween().set_parallel(true)
		tw.tween_property(sheet, "scale", Vector2(0.98, 0.98), 0.14).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_IN)
		tw.tween_property(dim, "modulate:a", 0.0, 0.14)
		tw.chain().tween_callback(dim.queue_free)
	var x := UIKit.button("", "secondary", Vector2(52, 52))
	x.icon = UIKit.icon("close")
	x.expand_icon = true
	x.pressed.connect(close)
	head.add_child(x)
	focus_host.call_deferred("_restore_keyboard_focus", x)
	v.add_child(head)
	v.add_child(UIKit.rule())
	var body := UIKit.vbox(14)
	v.add_child(body)
	# Esc (see _input) and a click on the dimmed backdrop both dismiss the sheet.
	dim.set_meta("close", close)
	dim.gui_input.connect(func(ev: InputEvent):
		if ev is InputEventMouseButton and ev.pressed and (ev as InputEventMouseButton).button_index == MOUSE_BUTTON_LEFT \
				and not sheet.get_global_rect().has_point(dim.get_global_mouse_position()):
			close.call())
	if not Game.prefs.reduced_motion:
		sheet.pivot_offset = Vector2(sheet.custom_minimum_size.x * 0.5, 200)
		sheet.scale = Vector2(0.98, 0.98)
		dim.modulate.a = 0.0
		var tw := dim.create_tween().set_parallel(true)
		dim.set_meta("opening_tween", tw)
		tw.tween_property(sheet, "scale", Vector2.ONE, 0.2).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)
		tw.tween_property(dim, "modulate:a", 1.0, 0.16)
	return [body, close]

func modal_open() -> bool:
	return modal_layer.get_child_count() > 0

func close_top_modal() -> void:
	for i in range(modal_layer.get_child_count() - 1, -1, -1):
		var dim := modal_layer.get_child(i)
		if dim.has_meta("close") and not dim.has_meta("closing"):
			(dim.get_meta("close") as Callable).call()
			return

## Irreversible actions ask first; nothing is dispatched until the player agrees.
func confirm(title_text: String, message: String, ok_text: String, fn: Callable) -> void:
	var m := modal(title_text, 640)
	var body: VBoxContainer = m[0]
	body.add_child(UIKit.label(message, 21, UIKit.TEXT, false, true))
	var row := UIKit.hbox(12)
	var cancel := UIKit.button("取消", "secondary", Vector2(0, 56), 21)
	cancel.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	cancel.pressed.connect(func(): m[1].call())
	row.add_child(cancel)
	var ok := UIKit.button(ok_text, "danger", Vector2(0, 56), 21)
	ok.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	ok.pressed.connect(func():
		m[1].call()
		fn.call())
	row.add_child(ok)
	body.add_child(row)
	cancel.call_deferred("grab_focus")

func open_events() -> void:
	var event = Game.today_event()
	var m := modal("每日站内消息 · 第 %d 天" % int(Game.state.day), 1100)
	var body: VBoxContainer = m[0]
	if event == null:
		body.add_child(UIKit.label("今天没有站务消息。", 22, UIKit.MUTED))
		return
	var head := UIKit.hbox(18)
	var face := TextureRect.new()
	face.texture = UIKit.npc_icon(event.speakerId)
	face.custom_minimum_size = Vector2(120, 120)
	face.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	face.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	face.size_flags_vertical = Control.SIZE_SHRINK_BEGIN
	head.add_child(face)
	var hv := UIKit.vbox(6)
	hv.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	hv.add_child(UIKit.label(event.title, 28, Color("f3e6cc")))
	var d := UIKit.label(event.description, 20, UIKit.TEXT, false, true)
	hv.add_child(d)
	head.add_child(hv)
	body.add_child(head)
	var done := Game.event_done()
	var chosen := ""
	for r in Game.state.events:
		if r.day == Game.state.day:
			chosen = r.choiceId
	var row := UIKit.hbox(14)
	for c in event.choices:
		var card := UIKit.plate(UIKit.inset_style(16))
		card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		var cv := UIKit.vbox(8)
		card.add_child(cv)
		cv.add_child(UIKit.label(c.label, 23, UIKit.AMBER, false, true))
		cv.add_child(UIKit.label("消耗：" + c.costText, 18, UIKit.DANGER, false, true))
		cv.add_child(UIKit.label("得到：" + c.rewardText, 18, UIKit.GOOD, false, true))
		cv.add_child(UIKit.spacer())
		var why = Model.event_availability(Game.state, c)
		var b := UIKit.button("已选择" if chosen == c.id else "选择这项", "primary" if chosen == c.id else "secondary", Vector2(0, 52), 20)
		b.disabled = done or why != null
		if why != null and not done:
			b.tooltip_text = why
			cv.add_child(UIKit.label(why, 16, UIKit.MUTED, false, true))
		var cid: String = c.id
		b.pressed.connect(func():
			if Game.dispatch({"type": "CHOOSE_EVENT", "eventId": event.id, "choiceId": cid}):
				sound("check")
				m[1].call())
		cv.add_child(b)
		row.add_child(card)
	body.add_child(row)

## Residents' dossier: a roster of headshots on the left, the selected
## resident's full portrait and file on the right. No scrolling, nothing
## stretched; opens on the visitor the player clicked.
func open_people(npc_id := "") -> void:
	var m := modal("旧港人物档案", 1240)
	var body: VBoxContainer = m[0]
	var row := UIKit.hbox(20)
	body.add_child(row)
	var roster := UIKit.grid(3, 10)
	roster.size_flags_vertical = Control.SIZE_SHRINK_BEGIN
	row.add_child(roster)
	var file := UIKit.plate(UIKit.inset_style(20))
	file.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	file.custom_minimum_size = Vector2(0, 600)
	row.add_child(file)
	var detail := UIKit.hbox(22)
	file.add_child(detail)
	var keys := {}
	var show := func(id: String) -> void:
		UIKit.clear(detail)
		var n := GameData.npc(id)
		var frame := UIKit.plate(UIKit.skin("socket", "sm", 8.0))
		frame.size_flags_vertical = Control.SIZE_SHRINK_BEGIN
		var art := TextureRect.new()
		art.texture = UIKit.npc_portrait(id)
		art.custom_minimum_size = Vector2(300, 520)
		art.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		art.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
		frame.add_child(art)
		detail.add_child(frame)
		var v := UIKit.vbox(10)
		v.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		v.add_child(UIKit.label(n.name, 34, Color("f3e6cc")))
		v.add_child(UIKit.label(n.title, 19, UIKit.AMBER, false, true))
		v.add_child(UIKit.rule())
		var bio := UIKit.label(String(n.get("bio", n.line)), 19, UIKit.TEXT, false, true)
		bio.custom_minimum_size.x = 380
		v.add_child(bio)
		if id != "CHR-001":
			var need := UIKit.plate(UIKit.paper_style(14))
			var nl := UIKit.label("来店需求：" + Model.customer_need(id), 17, UIKit.INK, false, true)
			nl.custom_minimum_size.x = 350
			need.add_child(nl)
			v.add_child(need)
			if n.has("line"):
				var quote := UIKit.label("「%s」" % String(n.line), 17, UIKit.MUTED, false, true)
				quote.custom_minimum_size.x = 380
				v.add_child(quote)
		else:
			v.add_child(UIKit.label("这是你。", 17, UIKit.MUTED))
		detail.add_child(v)
		for k in keys:
			UIKit.compact(keys[k], "primary" if k == id else "secondary")
	for n in GameData.npcs:
		var b := UIKit.button("", "secondary", Vector2(120, 150), 15)
		b.icon = UIKit.npc_icon(n.id)
		b.expand_icon = true
		b.icon_alignment = HORIZONTAL_ALIGNMENT_CENTER
		b.vertical_icon_alignment = VERTICAL_ALIGNMENT_TOP
		b.add_theme_constant_override("icon_max_width", 96)
		b.text = n.name
		b.tooltip_text = "%s · %s" % [n.name, n.title]
		var id: String = n.id
		b.pressed.connect(func():
			sound("page", -10)
			show.call(id))
		roster.add_child(b)
		keys[id] = b
	var first: String = npc_id if npc_id != "" else String(GameData.npcs[1].id if GameData.npcs.size() > 1 else GameData.npcs[0].id)
	show.call(first)

func open_help() -> void:
	var m := modal("经营手册", 1000)
	var body: VBoxContainer = m[0]
	var text := "• 柜台：按服务铃请客人进来。收购时先鉴定再出价；销售时从仓储挑选合格的自有货。客人有 3 轮耐心，接受报价只锁价，确认交割才付钱拿货（1 AP）。\n• 鉴定：六种仪器各取一条物证，首次鉴定一件物品消耗 1 AP。两条独立物证后估值收窄。\n• 维修：清洁排故、换件连接、负载复测三道工序，最后确认时才扣材料与 AP。\n• 仓储：10×6 占格后仓，拖动摆放、右键旋转。上架需要两条物证和已核验来源；来源不明的货物要扫描、登记或隔离。\n• 订单：接单后交付合格原物，委修单必须交还顾客原物。\n• 日结：每日维护 20 Cr，第 7/14/21 天交租金。第 3 天起可选一项设备升级。撑满 21 天即可。"
	body.add_child(UIKit.label(text, 21, UIKit.TEXT, false, true))

func open_settings() -> void:
	var m := modal("设置", 640)
	var body: VBoxContainer = m[0]
	body.add_child(UIKit.switch_row("声音", Game.prefs.sound, func(on: bool):
		Game.prefs.sound = on
		Game.save_prefs()
		_apply_sound()))
	body.add_child(UIKit.switch_row("减少动态效果", Game.prefs.reduced_motion, func(on: bool):
		Game.prefs.reduced_motion = on
		Game.save_prefs()))
	body.add_child(UIKit.rule())
	var fs := UIKit.button("切换全屏", "secondary", Vector2(0, 56))
	fs.pressed.connect(func():
		var full := DisplayServer.window_get_mode() == DisplayServer.WINDOW_MODE_FULLSCREEN
		DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_WINDOWED if full else DisplayServer.WINDOW_MODE_FULLSCREEN))
	body.add_child(fs)
	var reset := UIKit.button("新开一家店（清除当前进度）", "danger", Vector2(0, 56))
	reset.pressed.connect(func():
		m[1].call()
		confirm("新开一家店", "当前存档（第 %d 天）的现金、库存和订单都会清除，无法恢复。" % int(Game.state.day), "清除并新开", func():
			Game.new_game()
			shutter(1)))
	body.add_child(reset)

# ---------------------------------------------------------------- title & shutter

func _close_title() -> void:
	if is_instance_valid(title):
		title.queue_free()
	page_host.show()
	hud.hide()
	nav.hide()
	hint_label.visible = workspace_mode

func _show_title() -> void:
	if is_instance_valid(title):
		title.queue_free()
	for control in [page_host, hud, nav, hint_label]:
		control.hide()
	title = Control.new()
	title.set_anchors_preset(Control.PRESET_FULL_RECT)
	title.mouse_filter = Control.MOUSE_FILTER_STOP
	root_ui.add_child(title)
	# Help and settings must appear above the opening screen too.
	root_ui.move_child(modal_layer, -1)
	var dim := ColorRect.new()
	dim.color = Color(0.05, 0.04, 0.07, 0.62)
	dim.set_anchors_preset(Control.PRESET_FULL_RECT)
	title.add_child(dim)
	var center := CenterContainer.new()
	center.set_anchors_preset(Control.PRESET_FULL_RECT)
	title.add_child(center)
	var panel := UIKit.plate()
	panel.custom_minimum_size = Vector2(620, 0)
	center.add_child(panel)
	var v := UIKit.vbox(20)
	panel.add_child(v)
	var station := UIKit.label("回环九号  /  下层旧港", 19, UIKit.MUTED)
	station.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v.add_child(station)
	v.add_child(UIKit.rule())
	var t := UIKit.label("轨道旧货局", 64, UIKit.TEXT)
	t.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v.add_child(t)
	var sub := UIKit.label("每件旧物，都有下一程。", 24, UIKit.AMBER)
	sub.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v.add_child(sub)
	var intro := UIKit.label("鉴定旧物 · 商议价格 · 经营你的柜台", 19, UIKit.MUTED)
	intro.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v.add_child(intro)
	v.add_child(UIKit.rule())
	var cont := UIKit.button("继续营业 · 第 %d 天" % int(Game.state.day) if Game.has_save else "开门营业", "primary", Vector2(0, 66), 26)
	cont.pressed.connect(func():
		sound("open")
		_close_title()
		shutter(int(Game.state.day)))
	v.add_child(cont)
	if Game.has_save:
		var fresh := UIKit.button("新开一家店", "secondary", Vector2(0, 52), 21)
		fresh.pressed.connect(func():
			confirm("新开一家店", "当前存档（第 %d 天）的现金、库存和订单都会清除，无法恢复。" % int(Game.state.day), "清除并新开", func():
				_close_title()
				Game.new_game()
				shutter(1)))
		v.add_child(fresh)
	var hb := UIKit.hbox(12)
	for spec in [["玩法说明", open_help], ["设置", open_settings]]:
		var button := UIKit.button(spec[0], "secondary", Vector2(0, 50), 20)
		button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		button.pressed.connect(spec[1])
		hb.add_child(button)
	v.add_child(hb)
	cont.call_deferred("grab_focus")

## Metal shutter that rolls down, shows the day plate, and rolls back up.
func shutter(day: int) -> void:
	var door := Control.new()
	door.set_anchors_preset(Control.PRESET_FULL_RECT)
	door.mouse_filter = Control.MOUSE_FILTER_STOP
	fx.add_child(door)
	var vis := get_viewport().get_visible_rect().size
	var plate := ShutterDoor.new()
	plate.size = vis
	plate.day = day
	door.add_child(plate)
	if Game.prefs.reduced_motion:
		get_tree().create_timer(0.6).timeout.connect(door.queue_free)
		return
	plate.position.y = -vis.y
	var tw := create_tween()
	tw.tween_property(plate, "position:y", 0.0, 0.45).set_trans(Tween.TRANS_BOUNCE).set_ease(Tween.EASE_OUT)
	tw.tween_callback(func():
		shake = 0.35
		sound("drop", -2, 0.6))
	tw.tween_interval(0.9)
	tw.tween_callback(func(): sound("open", -4))
	tw.tween_property(plate, "position:y", -vis.y, 0.7).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN)
	tw.tween_callback(door.queue_free)

# ---------------------------------------------------------------- frame

func _process(delta: float) -> void:
	_update_cursor()
	var t := Time.get_ticks_msec() / 1000.0
	ambient.color = ambient.color.lerp(ambient_target, 1.0 - exp(-delta * 6.0))
	cam.zoom = Vector2.ONE * zoom_base * (1.0 + 0.14 * focus)
	cam.position = CENTER.lerp(focus_point, focus * 0.55)
	shake = maxf(0.0, shake - delta * 1.6)
	cam.offset = Vector2(randf_range(-1, 1), randf_range(-1, 1)) * shake * shake * 22.0
	var still: bool = Game.prefs.reduced_motion
	var uv := ambient_target.r < 0.3
	for f in flickers:
		var l: PointLight2D = f[0]
		if not is_instance_valid(l):
			continue
		var s: float = f[4]
		var k := 1.0
		if not still:
			match f[3]:
				"lamp": k = 0.93 + 0.05 * sin(t * 13.0 + s) * sin(t * 7.3) + (-0.45 if randf() < 0.003 else 0.0)
				"tube": k = 0.0 if fmod(t + s, 11.0) < 0.16 and sin(t * 60.0) > 0.0 else 0.95 + 0.05 * sin(t * 2.0 + s)
				"pulse": k = 0.75 + 0.25 * sin(t * 1.6 + s)
				"beacon": k = 1.0 if sin(t * 2.4 + s) > 0.1 else 0.35
		if uv:
			k *= 0.3
		l.energy = f[2] * k
		if f[1] and is_instance_valid(f[1]):
			(f[1] as Sprite2D).self_modulate.a = clampf(k, 0.0, 1.2)
	shown_cash = lerpf(shown_cash, float(Game.state.cash), 1.0 - exp(-delta * 8.0))
	if absf(shown_cash - Game.state.cash) < 0.5:
		shown_cash = Game.state.cash
	gauges.cash.text = Model.jnum(snappedf(shown_cash, 0.01)) if shown_cash != floor(shown_cash) else "%d" % int(shown_cash)


class ShutterDoor extends Control:
	var day := 1
	func _draw() -> void:
		var w := size.x
		var h := size.y
		draw_rect(Rect2(0, 0, w, h), Color("161d21"))
		for y in range(0, int(h), 54):
			draw_rect(Rect2(0, y, w, 50), Color("222b2f"))
			draw_rect(Rect2(0, y + 46, w, 4), Color("0e1315"))
			draw_rect(Rect2(0, y + 2, w, 2), Color(1, 1, 1, 0.05))
		for x in range(0, int(w), 96):
			draw_rect(Rect2(x, h - 40, 48, 40), Color("c9913f"))
			draw_rect(Rect2(x + 48, h - 40, 48, 40), Color("1a1a1a"))
		var plate := Rect2(w * 0.5 - 220, h * 0.5 - 90, 440, 180)
		draw_rect(plate.grow(8), Color("0e1315"))
		draw_rect(plate, Color("3b2414"))
		draw_rect(plate.grow(-6), Color("5a3a1e"), false, 3.0)
		var f: Font = UIKit.font
		draw_string(f, Vector2(plate.position.x, plate.position.y + 100), "第 %d 天" % day, HORIZONTAL_ALIGNMENT_CENTER, plate.size.x, 72, Color("ffc98f"))
		draw_string(f, Vector2(plate.position.x, plate.position.y + 150), "回环九号 · 下层旧港", HORIZONTAL_ALIGNMENT_CENTER, plate.size.x, 24, Color("d9c4a2"))
