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

func art(u: float, v: float) -> Vector2:
	return CENTER + (Vector2(u, v) - Vector2(836, 470.5)) * K

func _ready() -> void:
	UIKit.ensure()
	_build_world()
	_build_ui()
	_build_audio()
	get_viewport().size_changed.connect(_fit)
	_fit()
	Game.changed.connect(_on_changed)
	shown_cash = Game.state.cash
	go("counter")
	_refresh_hud()
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
	bg.scale = Vector2.ONE * K / 1.5
	layers.bg.add_child(bg)
	var post := CanvasLayer.new()
	post.layer = 5
	add_child(post)
	var bb := BackBufferCopy.new()
	bb.copy_mode = BackBufferCopy.COPY_MODE_VIEWPORT
	post.add_child(bb)
	var rect := ColorRect.new()
	rect.set_anchors_preset(Control.PRESET_FULL_RECT)
	rect.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var pm := ShaderMaterial.new()
	pm.shader = load("res://shaders/post.gdshader")
	rect.material = pm
	post.add_child(rect)

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
	bg.texture = Util.lit("res://assets/scene/%s_bg.png" % name, "res://assets/scene/%s_bg_n.png" % name, 0.25, 0.4)
	var warm := Color(1.0, 0.74, 0.45)
	var teal := Color(0.45, 0.95, 1.0)
	match name:
		"counter":
			var fg := Sprite2D.new()
			fg.texture = Util.lit("res://assets/scene/counter_fg.png", "res://assets/scene/counter_fg_n.png", 0.5, 0.75)
			fg.position = CENTER
			fg.scale = Vector2.ONE * K / 1.5
			_scene_node(fg, layers.fg)
			layers.fg.move_child(fg, 0)
			_light(art(218, 352), warm, 1.35, 3.4, 70, 0.55, 0.75, "lamp")
			_light(art(780, 250), Color(0.45, 0.62, 1.0), 0.6, 7.0, 260)
			_light(art(880, 520), Color(1.0, 0.86, 0.72), 0.32, 8.0, 380)
			_light(art(740, 58), Color(0.6, 0.95, 1.0), 0.55, 3.2, 120, 0.35, 1.3, "tube")
			_light(art(1000, 98), Color(0.6, 0.95, 1.0), 0.45, 2.8, 120, 0.3, 1.1, "tube")
			_light(art(1420, 290), teal, 0.7, 3.4, 90, 0.0, 1.0, "tube")
			_light(art(1200, 290), Color(0.75, 0.42, 1.0), 0.9, 2.2, 60, 0.4, 0.9, "pulse")
			_light(art(1605, 560), Color(0.35, 1.0, 0.85), 0.6, 1.6, 50, 0.35, 0.6, "pulse")
			_light(art(1195, 36), warm, 0.7, 2.0, 60, 0.5, 0.45)
			_light(art(1600, 26), warm, 0.6, 2.0, 60, 0.45, 0.42)
			_light(art(355, 280), warm, 0.45, 1.2, 40, 0.4, 0.25, "beacon")
			var glass := Polygon2D.new()
			var pts := PackedVector2Array()
			for p in [Vector2(470, 132), Vector2(560, 118), Vector2(905, 118), Vector2(1072, 140), Vector2(1090, 175), Vector2(1062, 352), Vector2(470, 352)]:
				pts.append(art(p.x, p.y))
			glass.polygon = pts
			glass.clip_children = CanvasItem.CLIP_CHILDREN_ONLY
			_scene_node(glass, layers.bg)
			var sky := Traffic.new()
			sky.area = Rect2(art(470, 118), art(1090, 352) - art(470, 118))
			glass.add_child(sky)
			var bub := _particles(layers.bg, art(1200, 318), 26, 1.8, Color(0.85, 0.72, 1.0, 0.8))
			bub.emission_shape = CPUParticles2D.EMISSION_SHAPE_RECTANGLE
			bub.emission_rect_extents = Vector2(16, 6)
			bub.direction = Vector2(0, -1)
			bub.spread = 6
			bub.initial_velocity_min = 30
			bub.initial_velocity_max = 55
			bub.scale_amount_min = 0.05
			bub.scale_amount_max = 0.11
			var steam := _particles(layers.fg, art(166, 534), 16, 2.8, Color.WHITE)
			steam.direction = Vector2(0, -1)
			steam.spread = 10
			steam.gravity = Vector2(6, -14)
			steam.initial_velocity_min = 16
			steam.initial_velocity_max = 28
			steam.scale_amount_min = 0.25
			steam.scale_amount_max = 0.4
			var grow := Curve.new()
			grow.add_point(Vector2(0, 0.35))
			grow.add_point(Vector2(1, 1.0))
			steam.scale_amount_curve = grow
			var fade := Gradient.new()
			fade.offsets = PackedFloat32Array([0.0, 0.25, 1.0])
			fade.colors = PackedColorArray([Color(1, 1, 1, 0), Color(1, 1, 1, 0.16), Color(1, 1, 1, 0)])
			steam.color_ramp = fade
			steam.material = Util.unshaded()
			steam.preprocess = 3
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
	if glow > 0.0:
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
	hud = UIKit.hbox(16)
	hud.position = Vector2(24, 18)
	hud.mouse_filter = Control.MOUSE_FILTER_IGNORE
	root_ui.add_child(hud)
	var name_plate := UIKit.plate()
	name_plate.add_theme_stylebox_override("panel", _hud_style())
	var nv := UIKit.vbox(0)
	nv.add_child(UIKit.label("轨道旧货局", 28, Color("f6ebd4")))
	nv.add_child(UIKit.label("回环九号 · 下层旧港", 15, UIKit.MUTED))
	name_plate.add_child(nv)
	hud.add_child(name_plate)
	var g := UIKit.plate()
	g.add_theme_stylebox_override("panel", _hud_style())
	var row := UIKit.hbox(28)
	g.add_child(row)
	gauges.day = _gauge(row, "day", "营业日")
	gauges.ap = _gauge(row, "energy", "行动点")
	gauges.cash = _gauge(row, "credits", "现金")
	gauges.risk = _gauge(row, "alert", "站务关注")
	hud.add_child(g)
	hud.add_child(UIKit.spacer(false))
	var keys := UIKit.hbox(10)
	var ev := _hud_key("speech", "每日站内消息", func(): open_events())
	event_badge = UIKit.label("!", 16, Color("1a1006"))
	var bs := UIKit.box(UIKit.AMBER, Color.TRANSPARENT, 10, 0, 4, 0)
	var badge := PanelContainer.new()
	badge.add_theme_stylebox_override("panel", bs)
	badge.add_child(event_badge)
	badge.position = Vector2(48, -6)
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

func _hud_style() -> StyleBoxFlat:
	var s := UIKit.plate_style()
	s.content_margin_top = 10
	s.content_margin_bottom = 10
	s.content_margin_left = 18
	s.content_margin_right = 18
	return s

func _gauge(row: HBoxContainer, icon: String, caption: String) -> Label:
	var h := UIKit.hbox(10)
	var ic := TextureRect.new()
	ic.texture = UIKit.icon(icon)
	ic.custom_minimum_size = Vector2(42, 42)
	ic.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	ic.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	h.add_child(ic)
	var v := UIKit.vbox(0)
	v.add_child(UIKit.label(caption, 14, UIKit.MUTED))
	var val := UIKit.label("", 28, UIKit.AMBER, true)
	v.add_child(val)
	h.add_child(v)
	row.add_child(h)
	return val

func _hud_key(icon: String, tip: String, fn: Callable) -> Button:
	var b := UIKit.button("", "secondary", Vector2(66, 66), 18)
	b.icon = UIKit.icon(icon)
	b.expand_icon = true
	b.tooltip_text = tip
	b.add_theme_constant_override("icon_max_width", 40)
	b.pressed.connect(func():
		sound("click", -6)
		fn.call())
	return b

func _build_nav() -> void:
	nav = UIKit.plate()
	var s := UIKit.plate_style()
	s.content_margin_top = 10
	s.content_margin_bottom = 10
	s.content_margin_left = 12
	s.content_margin_right = 12
	nav.add_theme_stylebox_override("panel", s)
	var row := UIKit.hbox(10)
	nav.add_child(row)
	for spec in NAV:
		var b := UIKit.button(spec[1], "secondary", Vector2(150, 64), 22, spec[2])
		var id: String = spec[0]
		b.pressed.connect(func():
			sound("page", -8)
			go(id))
		row.add_child(b)
		nav_buttons[id] = b
	root_ui.add_child(nav)

func _fit() -> void:
	var vis := get_viewport().get_visible_rect().size
	zoom_base = maxf(1.0, maxf(vis.x / 1960.0, vis.y / 1100.0))
	hud.size.x = vis.x - 48
	nav.reset_size()
	nav.position = Vector2((vis.x - nav.size.x) * 0.5, vis.y - nav.size.y - 14)
	hint_label.size = Vector2(1200, 30)
	hint_label.position = Vector2(vis.x * 0.5 - 600, nav.position.y - 40)
	_place_toasts()

## Each page names a free spot for notices so they never cover its controls.
func _place_toasts() -> void:
	var r: Rect2 = page.toast_rect() if page != null else Rect2()
	if r.size == Vector2.ZERO:
		var vis := get_viewport().get_visible_rect().size
		r = Rect2(vis.x * 0.5 - 330, 116, 660, 300)
	toast_box.position = r.position
	toast_box.size = r.size
	toast_box.alignment = BoxContainer.ALIGNMENT_END if r.position.y > 300 else BoxContainer.ALIGNMENT_BEGIN
	for c in toast_box.get_children():
		var l: Label = c.get_child(0)
		l.custom_minimum_size.x = r.size.x - 36

## Content area between HUD and dock, in UI coordinates.
func content_rect() -> Rect2:
	var vis := get_viewport().get_visible_rect().size
	return Rect2(24, 116, vis.x - 48, nav.position.y - 116 - 50)

# ---------------------------------------------------------------- pages

func go(name: String, focus_uid := "") -> void:
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
	ambient_target = ambient_base
	focus = 0.0
	page.enter()
	_place_toasts()
	if not Game.prefs.reduced_motion:
		page.modulate.a = 0.0
		create_tween().tween_property(page, "modulate:a", 1.0, 0.2)
	for k in nav_buttons:
		var b: Button = nav_buttons[k]
		b.add_theme_stylebox_override("normal", UIKit.key_style("primary" if k == name else "secondary", "normal"))
	_refresh_hud()
	hint(page.hint_text())

func _on_changed(prev: Dictionary, next: Dictionary, action: Dictionary) -> void:
	if action.type == "NEW_GAME":
		go("counter")
		_refresh_hud()
		return
	if next.notice != "" and (next.notice != prev.notice or action.type != "OFFER"):
		toast(next.notice)
	var spent: float = prev.ap - next.ap
	if spent > 0:
		float_text("−%s AP" % Model.jnum(spent), gauges.ap.get_global_rect().get_center() + Vector2(-10, 70), UIKit.CYAN)
	if page != null:
		page.on_changed(prev, next, action)
	_refresh_hud()
	hint(page.hint_text() if page else "")
	if action.type == "NEXT" and next.phase == "open":
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
	hint_label.modulate.a = 0.0
	create_tween().tween_property(hint_label, "modulate:a", 1.0, 0.3)

# ---------------------------------------------------------------- feedback

func toast(text: String, tone := "info") -> void:
	var p := UIKit.plate(UIKit.paper_style(14))
	var l := UIKit.label(text, 20, UIKit.INK if tone == "info" else UIKit.RUST, false, true)
	l.custom_minimum_size = Vector2(toast_box.size.x - 36, 0)
	p.add_child(l)
	toast_box.add_child(p)
	while toast_box.get_child_count() > 3:
		var old := toast_box.get_child(0)
		toast_box.remove_child(old)
		old.queue_free()
	p.modulate.a = 0.0
	var tw := create_tween()
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
	var tw := create_tween()
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
		if Game.prefs.sound:
			amb.play())
	_apply_sound()

func _apply_sound() -> void:
	var amb: AudioStreamPlayer = sounds.ambient_loop
	if Game.prefs.sound and not amb.playing:
		amb.play()
	elif not Game.prefs.sound:
		amb.stop()
	_refresh_hud()

var last_screen := Vector2(960, 540)
var pointer_override: Variant = null

## Pointer in world space, tracked from input events (reliable on the web too).
func world_mouse() -> Vector2:
	if pointer_override != null:
		return pointer_override
	return get_viewport().get_canvas_transform().affine_inverse() * last_screen

func _input(e: InputEvent) -> void:
	if e is InputEventMouse:
		last_screen = (e as InputEventMouse).position

func world_to_ui(p: Vector2) -> Vector2:
	return get_viewport().get_canvas_transform() * p

# ---------------------------------------------------------------- modals

## A centred sheet; returns [content VBox, close Callable].
func modal(title_text: String, width := 900.0) -> Array:
	var dim := ColorRect.new()
	dim.color = Color(0.01, 0.02, 0.03, 0.62)
	dim.set_anchors_preset(Control.PRESET_FULL_RECT)
	dim.mouse_filter = Control.MOUSE_FILTER_STOP
	modal_layer.add_child(dim)
	var center := CenterContainer.new()
	center.set_anchors_preset(Control.PRESET_FULL_RECT)
	dim.add_child(center)
	var sheet := UIKit.plate()
	sheet.custom_minimum_size = Vector2(width, 0)
	center.add_child(sheet)
	var v := UIKit.vbox(16)
	sheet.add_child(v)
	var head := UIKit.hbox()
	var t := UIKit.label(title_text, 30, UIKit.AMBER)
	t.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	head.add_child(t)
	var close := func():
		if is_instance_valid(dim):
			dim.queue_free()
	var x := UIKit.button("", "secondary", Vector2(52, 52))
	x.icon = UIKit.icon("close")
	x.expand_icon = true
	x.pressed.connect(close)
	head.add_child(x)
	v.add_child(head)
	v.add_child(UIKit.rule())
	var body := UIKit.vbox(14)
	v.add_child(body)
	if not Game.prefs.reduced_motion:
		sheet.pivot_offset = Vector2(width * 0.5, 200)
		sheet.scale = Vector2(0.96, 0.96)
		sheet.modulate.a = 0.0
		var tw := create_tween()
		tw.tween_property(sheet, "scale", Vector2.ONE, 0.18).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
		tw.parallel().tween_property(sheet, "modulate:a", 1.0, 0.15)
	return [body, close]

func modal_open() -> bool:
	return modal_layer.get_child_count() > 0

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

func open_people(npc_id := "") -> void:
	var m := modal("旧港人物档案", 1200)
	var body: VBoxContainer = m[0]
	var g := UIKit.grid(3, 14)
	for n in GameData.npcs:
		var card := UIKit.plate(UIKit.inset_style(14))
		card.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		var h := UIKit.hbox(14)
		var face := TextureRect.new()
		face.texture = UIKit.npc_icon(n.id)
		face.custom_minimum_size = Vector2(96, 96)
		face.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
		h.add_child(face)
		var v := UIKit.vbox(4)
		v.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		v.add_child(UIKit.label("%s · %s" % [n.name, n.title], 21, UIKit.AMBER if n.id == npc_id else Color("f3e6cc"), false, true))
		var need := Model.customer_need(n.id) if n.id != "CHR-001" else "店主"
		v.add_child(UIKit.label(String(n.get("bio", n.line)), 16, UIKit.TEXT, false, true))
		v.add_child(UIKit.label("需求：" + need, 16, UIKit.CYAN, false, true))
		h.add_child(v)
		card.add_child(h)
		card.custom_minimum_size = Vector2(360, 0)
		g.add_child(card)
	var sc := ScrollContainer.new()
	sc.custom_minimum_size = Vector2(0, 640)
	sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	g.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	sc.add_child(g)
	body.add_child(sc)

func open_help() -> void:
	var m := modal("经营手册", 1000)
	var body: VBoxContainer = m[0]
	var text := "• 柜台：按服务铃请客人进来。收购时先鉴定再出价；销售时从仓储挑选合格的自有货。客人有 3 轮耐心，接受报价只锁价，确认交割才付钱拿货（1 AP）。\n• 鉴定：六种仪器各取一条物证，首次鉴定一件物品消耗 1 AP。两条独立物证后估值收窄。\n• 维修：清洁排故、换件连接、负载复测三道工序，最后确认时才扣材料与 AP。\n• 仓储：10×6 占格后仓，拖动摆放、右键旋转。上架需要两条物证和已核验来源；来源不明的货物要扫描、登记或隔离。\n• 订单：接单后交付合格原物，委修单必须交还顾客原物。\n• 日结：每日维护 20 Cr，第 7/14/21 天交租金。第 3 天起可选一项设备升级。撑满 21 天即可。"
	body.add_child(UIKit.label(text, 21, UIKit.TEXT, false, true))

func open_settings() -> void:
	var m := modal("设置", 640)
	var body: VBoxContainer = m[0]
	var snd := CheckButton.new()
	snd.text = "声音"
	snd.button_pressed = Game.prefs.sound
	snd.toggled.connect(func(on):
		Game.prefs.sound = on
		Game.save_prefs()
		_apply_sound())
	body.add_child(snd)
	var rm := CheckButton.new()
	rm.text = "减少动态效果"
	rm.button_pressed = Game.prefs.reduced_motion
	rm.toggled.connect(func(on):
		Game.prefs.reduced_motion = on
		Game.save_prefs())
	body.add_child(rm)
	body.add_child(UIKit.rule())
	var fs := UIKit.button("切换全屏", "secondary", Vector2(0, 56))
	fs.pressed.connect(func():
		var full := DisplayServer.window_get_mode() == DisplayServer.WINDOW_MODE_FULLSCREEN
		DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_WINDOWED if full else DisplayServer.WINDOW_MODE_FULLSCREEN))
	body.add_child(fs)
	var reset := UIKit.button("新开一家店（清除当前进度）", "danger", Vector2(0, 56))
	reset.pressed.connect(func():
		m[1].call()
		Game.new_game()
		shutter(1))
	body.add_child(reset)

# ---------------------------------------------------------------- title & shutter

func _show_title() -> void:
	title = Control.new()
	title.set_anchors_preset(Control.PRESET_FULL_RECT)
	title.mouse_filter = Control.MOUSE_FILTER_STOP
	root_ui.add_child(title)
	var dim := ColorRect.new()
	dim.color = Color(0.02, 0.03, 0.05, 0.55)
	dim.set_anchors_preset(Control.PRESET_FULL_RECT)
	title.add_child(dim)
	var center := CenterContainer.new()
	center.set_anchors_preset(Control.PRESET_FULL_RECT)
	title.add_child(center)
	var v := UIKit.vbox(18)
	v.alignment = BoxContainer.ALIGNMENT_CENTER
	center.add_child(v)
	var t := UIKit.label("轨道旧货局", 96, Color("f6ebd4"))
	t.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	t.add_theme_color_override("font_outline_color", Color(0, 0, 0, 0.8))
	t.add_theme_constant_override("outline_size", 12)
	v.add_child(t)
	var sub := UIKit.label("每件旧物，都有下一程。", 30, UIKit.AMBER)
	sub.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v.add_child(sub)
	v.add_child(UIKit.spacer())
	var cont := UIKit.button("继续营业 · 第 %d 天" % int(Game.state.day) if Game.has_save else "开门营业", "primary", Vector2(420, 72), 28)
	cont.pressed.connect(func():
		sound("open")
		title.queue_free()
		shutter(int(Game.state.day)))
	v.add_child(cont)
	if Game.has_save:
		var fresh := UIKit.button("新开一家店", "secondary", Vector2(420, 60), 22)
		fresh.pressed.connect(func():
			title.queue_free()
			Game.new_game()
			shutter(1))
		v.add_child(fresh)
	var hb := UIKit.hbox(12)
	var help := UIKit.button("玩法说明", "secondary", Vector2(204, 56), 20)
	help.pressed.connect(open_help)
	hb.add_child(help)
	var st := UIKit.button("设置", "secondary", Vector2(204, 56), 20)
	st.pressed.connect(open_settings)
	hb.add_child(st)
	v.add_child(hb)
	var note := UIKit.label("Godot 4 版 · 完整 Cocos 旧版在网站 /play/", 16, UIKit.MUTED)
	note.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v.add_child(note)

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


class Traffic extends Node2D:
	var area := Rect2()
	var ships: Array = []
	var stars: Array = []
	var next := 1.5
	func _ready() -> void:
		for i in 40:
			stars.append([Vector2(randf(), randf() * 0.45), randf_range(0.6, 2.2), randf() * 6.0])
		material = Util.unshaded()
	func _process(delta: float) -> void:
		next -= delta
		if next <= 0.0:
			next = randf_range(5.0, 11.0)
			ships.append({"p": 0.0, "dir": 1.0 if randf() < 0.5 else -1.0, "y": randf_range(0.25, 0.75), "s": randf_range(0.8, 1.6), "v": randf_range(0.05, 0.09)})
		for s in ships:
			s.p += s.v * delta
		ships = ships.filter(func(s): return s.p < 1.0)
		queue_redraw()
	func _draw() -> void:
		var t := Time.get_ticks_msec() / 1000.0
		for st in stars:
			var a: float = 0.25 + 0.75 * maxf(0.0, sin(t * st[1] + st[2]))
			draw_circle(area.position + st[0] * area.size, 1.6, Color(0.9, 0.95, 1.0, a))
		for s in ships:
			var x: float = area.position.x + (s.p if s.dir > 0 else 1.0 - s.p) * area.size.x
			var y: float = area.position.y + s.y * area.size.y
			var k: float = s.s
			var d: float = s.dir
			draw_line(Vector2(x - d * 18 * k, y), Vector2(x - d * 90 * k, y - 3 * k), Color(0.5, 0.85, 1.0, 0.3), 3.0 * k)
			draw_circle(Vector2(x - d * 18 * k, y), 6.0 * k, Color(0.6, 0.9, 1.0, 0.7))
			var hull := PackedVector2Array([Vector2(x - 20 * k, y - 4 * k), Vector2(x + 20 * k, y - 5 * k), Vector2(x + 26 * k, y), Vector2(x + 20 * k, y + 5 * k), Vector2(x - 20 * k, y + 4 * k)])
			draw_colored_polygon(hull, Color(0.32, 0.37, 0.43))
			draw_rect(Rect2(x - 8 * k, y - 9 * k, 16 * k, 5 * k), Color(0.42, 0.47, 0.53))
			for i in 3:
				draw_circle(Vector2(x - 8 * k + i * 8 * k, y), 1.3 * k, Color(1.0, 0.84, 0.6))


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
