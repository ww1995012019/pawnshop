extends Node2D
## The shop around every screen: painted rooms with real 2D lights, the HUD,
## navigation dock, notices, modals, title and the day shutter.

const K := 1920.0 / 1672.0 * 1.04
const CrimeEvents = preload("res://scripts/model/crime_events.gd")
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
var work_surface
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
var wanted_notice: Control
var workspace_mode := false
var workspace_parent: Node
var initial_page := "counter"
var workspace_shell: Node
var workspace_overlay: Control
var workspace_frame: PanelContainer
var workspace_container: SubViewportContainer
var workspace_host: Control
var workspace_title: Label
var workspace_close: Button
var workspace_origin: Control
var workspace_suspended_focus: Array = []
var workspace_logical_size := Vector2(1600, 900)
const WORKSPACE_LABELS := {"inspect": "鉴定台", "repair": "维修工作台", "warehouse": "货物抽屉", "orders": "委托终端", "report": "营业账本"}
const WORKSPACE_SIZE := Vector2(1600, 900)

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
		hint_label.visible = not mobile_mode()
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
	_sync_wanted_notice()
	add_child(preload("res://scripts/app/touch_scroll.gd").new())
	if OS.has_feature("web"):
		var touch := preload("res://scripts/app/web_touch.gd").new()
		add_child(touch)
		touch.setup(self)

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
	work_surface = null
	# The counter page plays inside the painted room: the visitor stands
	# behind the counter front (fg), fixtures sit on the walls and counter.
	if name == "counter" and not workspace_mode:
		bg.texture = UIKit.tex("res://assets/scene/shop_pixel.png")
		bg.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
		bg.material = Util.unshaded()
		bg.self_modulate = Color.WHITE
		bg.show()
		var edges := preload("res://scripts/ui/shop_edges.gd").new()
		_scene_node(edges, layers.bg)
		layers.bg.move_child(edges, 0)
		return
	bg.hide()
	work_surface = preload("res://scripts/ui/workspace_surface.gd").new()
	work_surface.material = Util.unshaded()
	_scene_node(work_surface, layers.bg)
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

func counter_offset() -> Vector2:
	if workspace_mode or mobile_mode():
		return Vector2.ZERO
	return ((get_viewport().get_visible_rect().size - Vector2(1920, 1080)) * 0.5).floor() - view_shift

## The shop is limited by the screen height on wide screens and leaves blank
## wall at both sides, so the whole picture is enlarged there, hiding only the
## ceiling and floor strips that carry no controls. Phones are small: they also
## give up the bare wall beside the fixtures and frame just the working shop.
const WIDE_VIEW := Rect2(0, 40, 1920, 1000)
const PHONE_VIEW := Rect2(130, 45, 1755, 990)
var view_shift := Vector2.ZERO
const TouchAssist := preload("res://scripts/app/touch_assist.gd")

var workspace_layout_deferred := false
var presentation_orientation := ""
var counter_layout_deferred := false
func _counter_layout_busy() -> bool:
	return page != null and page_name == "counter" and (page.busy or is_instance_valid(page.mat_item) and page.mat_item.busy)

func portrait_mode() -> bool:
	if workspace_mode:
		if workspace_parent.workspace_layout_deferred: return presentation_orientation == "portrait"
		return workspace_parent.portrait_mode()
	if _counter_layout_busy() and presentation_orientation != "": return presentation_orientation == "portrait"
	return _physical_portrait()

func _physical_portrait() -> bool:
	var pixels := Vector2(get_window().size)
	var ratio := float(JavaScriptBridge.eval("devicePixelRatio || 1", true)) if OS.has_feature("web") else 1.0
	return pixels.y > pixels.x and pixels.x / maxf(ratio,1.0) <= 600

func landscape_mode() -> bool:
	if workspace_mode:
		if workspace_parent.workspace_layout_deferred: return presentation_orientation == "landscape"
		return workspace_parent.landscape_mode()
	return not portrait_mode() and _landscape_phone()

func safe_area() -> Rect2:
	var area := get_viewport().get_visible_rect()
	if not OS.has_feature("web") or not mobile_mode(): return area
	var inset = JSON.parse_string(str(JavaScriptBridge.eval("JSON.stringify(window.OrbitalTouch?.safeInsets || [0,0,0,0])",true)))
	if inset is Array and inset.size() == 4:
		area.position = Vector2(float(inset[0]),float(inset[1]))
		area.size -= Vector2(float(inset[0])+float(inset[2]),float(inset[1])+float(inset[3]))
	return area

func mobile_mode() -> bool:
	return portrait_mode() or landscape_mode()

func _fit_view() -> void:
	var window := get_window()
	var physical := "portrait" if _physical_portrait() else "landscape" if _landscape_phone() else "desktop"
	if _counter_layout_busy() and presentation_orientation != "" and physical != presentation_orientation:
		counter_layout_deferred = true
		window.content_scale_aspect = Window.CONTENT_SCALE_ASPECT_KEEP
		return
	counter_layout_deferred = false
	presentation_orientation = physical
	window.content_scale_aspect = Window.CONTENT_SCALE_ASPECT_EXPAND
	if landscape_mode():
		var ratio := float(JavaScriptBridge.eval("devicePixelRatio || 1", true)) if OS.has_feature("web") else 1.0
		var logical := Vector2i(Vector2(window.size) / maxf(ratio,1.0))
		if window.content_scale_size != logical: window.content_scale_size = logical
		window.content_scale_factor = 1.0
		view_shift = Vector2.ZERO
		return
	if portrait_mode():
		var portrait_size := Vector2i(390, roundi(390.0 * window.size.y / maxf(window.size.x,1)))
		if window.content_scale_size != portrait_size: window.content_scale_size = portrait_size
		if window.content_scale_factor != 1.0: window.content_scale_factor = 1.0
		view_shift = Vector2.ZERO
		return
	if window.content_scale_size != Vector2i(1920,1080): window.content_scale_size = Vector2i(1920,1080)
	var pixels := Vector2(window.size)
	if pixels.x <= 0.0 or pixels.y <= 0.0:
		return
	var view := PHONE_VIEW if _landscape_phone() else WIDE_VIEW
	var base := minf(pixels.x / 1920.0, pixels.y / 1080.0)
	var factor := maxf(1.0, minf(pixels.x / view.size.x, pixels.y / view.size.y) / base)
	if not is_equal_approx(window.content_scale_factor, factor):
		window.content_scale_factor = factor
	# Move the picture only as far as the framed part needs to stay on screen.
	var half := pixels / (base * factor) * 0.5
	var low := view.end - half - CENTER
	var high := view.position + half - CENTER
	view_shift = Vector2(clampf(0.0, minf(low.x, high.x), maxf(low.x, high.x)),
		clampf(0.0, minf(low.y, high.y), maxf(low.y, high.y))).round()

## CSS pixels per unit of this shell's viewport, for finger-sized targets.
var touch_scale_override := 0.0
func touch_scale() -> float:
	if touch_scale_override > 0.0:
		return touch_scale_override
	if workspace_mode:
		return workspace_parent.touch_scale() * workspace_parent.workspace_frame.scale.x
	var ratio := float(JavaScriptBridge.eval("devicePixelRatio || 1", true)) if OS.has_feature("web") else 1.0
	return absf(get_viewport().get_final_transform().get_scale().x) / maxf(ratio, 0.1)

func _touch_root() -> Control:
	if modal_open():
		return modal_layer
	if is_instance_valid(title) and not title.is_queued_for_deletion():
		return title
	if not workspace_mode and workspace_open():
		return workspace_overlay
	return root_ui

## Where a touch at `point` (this shell's viewport) should land.
func place_touch(point: Vector2) -> Vector2:
	if not modal_open():
		for key in ["inspection_guide","wanted_notice"]:
			var paper := root_ui.find_child(key,false,false) as Control
			if is_instance_valid(paper) and paper.is_visible_in_tree() and paper.get_global_rect().has_point(point):
				return TouchAssist.snap(point,paper,touch_scale())
	if not workspace_mode and workspace_open() and not modal_open():
		# The drawer is its own viewport: decide there, in its coordinates.
		var to_screen := workspace_container.get_global_transform_with_canvas()
		var inside := to_screen.affine_inverse() * point
		if Rect2(Vector2.ZERO, workspace_container.size).has_point(inside):
			var ratio := workspace_logical_size / workspace_container.size
			return to_screen * (workspace_shell.place_touch(inside * ratio) / ratio)
	return TouchAssist.snap(point, _touch_root(), touch_scale())

func _fit() -> void:
	if not workspace_mode:
		_fit_view()
	var vis := get_viewport().get_visible_rect().size
	if workspace_mode:
		cam.position = vis * 0.5
		cam.force_update_scroll()
	var pad := counter_offset()
	page_host.offset_left = pad.x
	page_host.offset_right = -pad.x
	page_host.offset_top = pad.y
	page_host.offset_bottom = -pad.y
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
	if r.size != Vector2.ZERO and not workspace_mode and page_name == "counter":
		r.position += counter_offset()
	if r.size == Vector2.ZERO:
		# Default: a strip under the HUD, over the room's back wall.
		var vis := get_viewport().get_visible_rect().size
		r = Rect2(vis.x * 0.5 - 330, 96, 660, 200)
	if portrait_mode():
		var visible := get_viewport().get_visible_rect().size
		r = Rect2(12,80,visible.x-24,120)
	if landscape_mode():
		var visible := get_viewport().get_visible_rect().size
		r = Rect2(visible.x*.28,4,visible.x*.45,36)
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
	if workspace_mode and landscape_mode(): return Rect2(8,8,vis.x-16,vis.y-16)
	return Rect2(16, 16, vis.x - 32, vis.y - 80) if workspace_mode else Rect2(20, 20, vis.x - 40, vis.y - 40)

# ---------------------------------------------------------------- pages

func go(name: String, focus_uid := "") -> void:
	if workspace_mode and mobile_mode() and page != null:
		if workspace_parent.workspace_close_pending: return
		if page.has_method("can_close_workspace") and not page.can_close_workspace():
			if name == "counter": workspace_parent.close_workspace()
			else: toast("请等当前动作落稳后切换")
			return
	if not PAGES.has(name):
		return
	if name == "report":
		_clear_toasts()
		if workspace_mode and is_instance_valid(workspace_parent): workspace_parent._clear_toasts()
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
	if work_surface != null:
		work_surface.set_mat(Rect2())
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
	workspace_frame = UIKit.plate(PortraitSkin.panel("wine",12) if mobile_mode() else UIKit.skin("rail", "lg", 16))
	workspace_overlay.add_child(workspace_frame)
	var body := UIKit.vbox(4 if landscape_mode() else 12)
	workspace_frame.add_child(body)
	var header_mount := UIKit.plate(UIKit.skin("strip", "sm", 0 if landscape_mode() else 8))
	var header := UIKit.hbox(12)
	header_mount.add_child(header)
	workspace_title = UIKit.label("", 20 if mobile_mode() else 27, UIKit.AMBER)
	workspace_title.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	workspace_title.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	header.add_child(workspace_title)
	if not mobile_mode(): header.add_child(UIKit.label("店内操作  /  ESC 收起", 18, UIKit.MUTED))
	workspace_close = UIKit.button("关闭" if mobile_mode() else "收起", "secondary", Vector2(108,44 if landscape_mode() else 54 if mobile_mode() else 48),20,"close")
	workspace_close.tooltip_text = "关闭并返回柜台"
	workspace_close.pressed.connect(close_workspace)
	header.add_child(workspace_close)
	body.add_child(header_mount)
	# The drawer's logical size remains fixed. Render its viewport at the
	# display's pixel scale so text is rasterized at the final resolution.
	workspace_host = Control.new()
	workspace_host.custom_minimum_size = WORKSPACE_SIZE
	workspace_host.mouse_filter = Control.MOUSE_FILTER_IGNORE
	body.add_child(workspace_host)
	workspace_container = SubViewportContainer.new()
	workspace_container.size = WORKSPACE_SIZE
	workspace_container.stretch = true
	workspace_container.mouse_filter = Control.MOUSE_FILTER_STOP
	workspace_host.add_child(workspace_container)
	var viewport := SubViewport.new()
	viewport.size = Vector2i(WORKSPACE_SIZE)
	viewport.size_2d_override = Vector2i(WORKSPACE_SIZE)
	viewport.size_2d_override_stretch = true
	viewport.world_2d = World2D.new()
	viewport.render_target_update_mode = SubViewport.UPDATE_ALWAYS
	viewport.handle_input_locally = true
	workspace_container.add_child(viewport)
	workspace_shell = load("res://main.tscn").instantiate()
	workspace_shell.workspace_mode = true
	workspace_shell.workspace_parent = self
	workspace_shell.presentation_orientation = "portrait" if portrait_mode() else "landscape" if landscape_mode() else "desktop"
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
	var area := safe_area()
	var visible := area.size
	var phone := _landscape_phone()
	var target := WORKSPACE_SIZE
	if portrait_mode():
		target = Vector2(visible.x - 32, visible.y - 130)
	elif landscape_mode():
		target = Vector2(visible.x-44,visible.y-96)
	elif phone:
		# A phone is much wider than the desktop drawer after the touch bar is
		# reserved. Use that width instead of shrinking a 16:9 sheet into it.
		var desired_height := (WORKSPACE_SIZE.x + 32.0) * visible.y / maxf(visible.x, 1.0) - 110.0
		target.y = clampf(desired_height, 600.0, WORKSPACE_SIZE.y)
	workspace_layout_deferred = workspace_shell.page != null and workspace_shell.page.has_method("can_close_workspace") and not workspace_shell.page.can_close_workspace()
	if workspace_layout_deferred:
		target = workspace_logical_size
	else:
		workspace_shell.presentation_orientation = "portrait" if portrait_mode() else "landscape" if landscape_mode() else "desktop"
	workspace_logical_size = target.round()
	workspace_host.custom_minimum_size = workspace_logical_size
	var viewport := workspace_container.get_child(0) as SubViewport
	viewport.size_2d_override = Vector2i(workspace_logical_size)
	workspace_frame.reset_size()
	var frame_size := workspace_frame.get_combined_minimum_size()
	workspace_frame.size = frame_size
	var fit := minf((visible.x - 20.0) / frame_size.x, (visible.y - 20.0) / frame_size.y) if phone or portrait_mode() else 1.0
	workspace_frame.scale = Vector2.ONE * fit
	workspace_frame.position = area.position + ((visible - frame_size * fit) * 0.5).floor()
	var output_scale := get_viewport().get_final_transform().get_scale()
	_set_workspace_render_scale(maxf(absf(output_scale.x), absf(output_scale.y)) * fit)

var phone_override := false
func _landscape_phone() -> bool:
	if phone_override or (workspace_mode and workspace_parent.phone_override):
		return true
	if not OS.has_feature("web"):
		return false
	return bool(JavaScriptBridge.eval("!!(window.OrbitalTouch && window.OrbitalTouch.phone())", true))

func _set_workspace_render_scale(output_scale: float) -> void:
	if not is_instance_valid(workspace_container):
		return
	# Keep the render target within common WebGL texture limits on very large
	# displays; the container scale keeps its visible size and input unchanged.
	var factor := clampf(output_scale, 0.5, 2.0)
	var pixels := (workspace_logical_size * factor).round()
	workspace_container.size = pixels
	workspace_container.scale = workspace_logical_size / pixels

func _workspace_heading(name: String) -> void:
	Audio.music_for(name)
	if is_instance_valid(workspace_title):
		workspace_title.text = WORKSPACE_LABELS.get(name, "店内设备")

var workspace_close_pending := false
func close_workspace() -> void:
	if not workspace_open(): return
	if mobile_mode() and workspace_shell.page.has_method("can_close_workspace") and not workspace_shell.page.can_close_workspace():
		workspace_shell.page.request_close_workspace()
		workspace_close_pending = true
		workspace_close.text = "稍后关闭"
		workspace_close.disabled = true
		workspace_title.text = "当前动作结束后关闭 · 进度会保存"
		return
	workspace_close_pending = false
	workspace_layout_deferred = false
	# Stop this subtree synchronously: queue_free alone would allow one more
	# animation tick (and possibly a completion) after the save boundary.
	workspace_shell.process_mode = Node.PROCESS_MODE_DISABLED
	# Explicitly save/release before the viewport is queued for deletion.
	if workspace_shell.page.has_method("prepare_close_workspace"):
		workspace_shell.page.prepare_close_workspace()
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
	Audio.music_for("report" if Game.state.phase != "open" else "counter")
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
		_sync_wanted_notice()
		return
	_sync_wanted_notice()
	var quiet_save: bool = action.type in ["SERVICE_PROGRESS", "SERVICE_BEGIN"] and next.notice == prev.notice
	if not workspace_open() and not quiet_save and next.notice != "" and (next.notice != prev.notice or action.type != "OFFER"):
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

func _clear_toasts() -> void:
	for notice in toast_box.get_children():
		toast_box.remove_child(notice)
		notice.queue_free()

func toast(text: String, tone := "info") -> void:
	var active := active_shell()
	if active.page_name == "report" and active.page != null:
		_clear_toasts()
		active.page.show_status(text, tone)
		return
	if landscape_mode() and workspace_open() and is_instance_valid(workspace_title):
		workspace_title.text = text.left(30)
		workspace_title.tooltip_text = text
		workspace_title.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
		var shown := workspace_title.text
		get_tree().create_timer(3.6).timeout.connect(func():
			if workspace_open() and not workspace_close_pending and workspace_title.text == shown: _workspace_heading(workspace_shell.page_name))
		return
	if workspace_mode and landscape_mode():
		workspace_parent.toast(text,tone)
		return
	# The same notice twice in a row (e.g. arriving and then opening the
	# workbench) only refreshes the one already shown.
	if toast_box.get_child_count() > 0:
		var last := toast_box.get_child(toast_box.get_child_count() - 1)
		if not last.is_queued_for_deletion() and (last.get_child(0) as Label).text == text:
			return
	var p := UIKit.plate(UIKit.paper_style(6 if landscape_mode() else 14))
	p.mouse_filter = Control.MOUSE_FILTER_IGNORE
	var l := UIKit.label(text, 14 if landscape_mode() else 18, UIKit.INK if tone == "info" else UIKit.RUST, false, true)
	l.mouse_filter = Control.MOUSE_FILTER_IGNORE
	l.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	l.max_lines_visible = 1 if landscape_mode() else 2
	l.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
	l.tooltip_text = text
	l.custom_minimum_size = Vector2(toast_box.size.x - 36, 0)
	p.add_child(l)
	toast_box.add_child(p)
	while toast_box.get_child_count() > 1:
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
	Audio.sfx(k, db, pitch)

## Mixer, music and ambience live in the Audio autoload (shared by the
## embedded workspace shell); the shell only tells it where the player is.
func _build_audio() -> void:
	pass

func _apply_sound() -> void:
	Audio.apply_prefs()
	_refresh_hud()

var last_screen := Vector2(960, 540)
var pointer_override: Variant = null

## Pointer in world space, tracked from input events (reliable on the web too).
func world_mouse() -> Vector2:
	if pointer_override != null:
		return pointer_override
	return get_viewport().get_canvas_transform().affine_inverse() * last_screen

## Root papers can stop input before it reaches an embedded workbench viewport.
## Its last mouse coordinate is then stale; GUI ownership comes from both views.
func world_pointer_available() -> bool:
	if modal_open(): return false
	if workspace_mode and not workspace_parent._workspace_pointer_inside(): return false
	return get_viewport().gui_get_hovered_control() == null

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
		if is_instance_valid(previous) and controls.has(previous):
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
	if not workspace_open() or not workspace_container.get_global_rect().has_point(last_screen) or modal_open(): return false
	var hovered := get_viewport().gui_get_hovered_control()
	# Root floating papers sit above the drawer and own their own cursors.
	return hovered == null or hovered == workspace_container or workspace_container.is_ancestor_of(hovered)

func _active_document_cursor() -> int:
	if modal_open(): return -1
	for child in root_ui.get_children():
		if child is FloatingDocument and child.is_visible_in_tree():
			if child.resizing: return child.resize_cursor_shape()
			if child.dragging: return Input.CURSOR_DRAG
	return -1

func _update_cursor() -> void:
	var document_cursor := _active_document_cursor()
	if document_cursor >= 0:
		world_cursor = document_cursor
		Input.set_default_cursor_shape(document_cursor)
		DisplayServer.cursor_set_shape(document_cursor)
		return
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

func ui_to_world(p: Vector2) -> Vector2:
	return get_viewport().get_canvas_transform().affine_inverse() * p

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
	# The opener may be rebuilt while the sheet is open (e.g. after a purchase),
	# so hold it weakly; a freed opener falls back to the first control.
	var previous_ref: WeakRef = weakref(previous_focus) if previous_focus != null else null
	dim.tree_exited.connect(func(): focus_host.call_deferred("_restore_keyboard_focus", previous_ref.get_ref() if previous_ref != null else null))
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
	var t := UIKit.label(title_text,24 if mobile_mode() else 30,UIKit.AMBER)
	t.text_overrun_behavior = TextServer.OVERRUN_TRIM_ELLIPSIS
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
	var x := UIKit.button("关闭" if mobile_mode() else "", "secondary", Vector2(100,54) if mobile_mode() else Vector2(52,52),18)
	x.name = "modal_close"
	x.icon = UIKit.icon("close")
	x.expand_icon = true
	x.add_theme_constant_override("icon_max_width",24)
	x.tooltip_text = "关闭"
	x.pressed.connect(close)
	head.add_child(x)
	focus_host.call_deferred("_restore_keyboard_focus", x)
	v.add_child(head)
	v.add_child(UIKit.rule())
	var body := UIKit.vbox(14)
	if mobile_mode():
		var scroll := ScrollContainer.new()
		scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_AUTO
		scroll.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		body.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		scroll.add_child(body)
		v.add_child(scroll)
		body.minimum_size_changed.connect(func():
			scroll.custom_minimum_size.y = minf(body.get_combined_minimum_size().y,get_viewport().get_visible_rect().size.y-180))
	else:
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
	var message_body := night_scroll(body, 240) if title_text.contains("灰色") or title_text.contains("本店失物") else body
	message_body.add_child(UIKit.label(message, 21, UIKit.TEXT, false, true))
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
		var why = CrimeEvents.availability(Game.state, c)
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
	var roster_scroll := ScrollContainer.new()
	roster_scroll.custom_minimum_size = Vector2(420, 600)
	roster_scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	row.add_child(roster_scroll)
	var roster := UIKit.grid(3, 10)
	roster.size_flags_vertical = Control.SIZE_SHRINK_BEGIN
	roster_scroll.add_child(roster)
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
		var skills: Dictionary = Model.watch_expertise(id)
		var strengths := []
		for field in [["logo", "标识辨认"], ["serial", "编号理解"], ["structure", "结构与缺件"], ["market", "行情"]]:
			if float(skills.get(field[0], 0)) >= 65:
				strengths.append(field[1])
		v.add_child(UIKit.label("熟悉：" + "、".join(strengths) if not strengths.is_empty() else "主要凭佩戴经验和个人喜好判断，细节需解释。", 17, UIKit.MUTED, false, true))

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
	for n in GameData.people():
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

func open_watch_manual(def_id := "") -> void:
	load("res://scripts/ui/watch_manual.gd").open(self, def_id)

func open_watch_catalogue() -> void:
	if workspace_mode:
		workspace_parent.open_watch_catalogue()
		return
	load("res://scripts/ui/watch_catalogue.gd").open(self)

func open_campaign_ledger() -> void:
	load("res://scripts/ui/campaign_ledger.gd").open(self)

func export_legacy_backup() -> void:
	var text: String = Game.legacy_save_text()
	if text == "":
		return
	if OS.has_feature("web"):
		JavaScriptBridge.eval("(()=>{const blob=new Blob([%s],{type:'application/json'});const link=document.createElement('a');link.href=URL.createObjectURL(blob);link.download='orbital-legacy-backup.json';document.body.appendChild(link);link.click();link.remove();setTimeout(()=>URL.revokeObjectURL(link.href),1000)})()" % JSON.stringify(text))
	else:
		var dialog := FileDialog.new()
		dialog.file_mode = FileDialog.FILE_MODE_SAVE_FILE
		dialog.access = FileDialog.ACCESS_FILESYSTEM
		dialog.current_file = "orbital-legacy-backup.json"
		dialog.add_filter("*.json", "经营档案")
		add_child(dialog)
		dialog.file_selected.connect(func(path: String):
			var f := FileAccess.open(path, FileAccess.WRITE)
			if f: f.store_string(text)
			dialog.queue_free())
		dialog.canceled.connect(dialog.queue_free)
		dialog.popup_centered(Vector2i(800, 500))

func open_help() -> void:
	var m := modal("经营手册", 1000)
	var body: VBoxContainer = m[0]
	var manual := UIKit.button("打开手表检验说明书", "primary", Vector2(0, 56))
	manual.pressed.connect(func(): open_watch_manual())
	body.add_child(manual)
	var text := "• 柜台：按服务铃请下一位来客。每天随机安排3–10位，开店前三天为教学保留必要名额。同一客人看多件货或分批交割只算一次接待。报价只代表对方的认识与预算；检测不会自动改变对方的开价。\n• 检验：只用放大镜、紫外线、称重。对照说明书查看 logo、编号与重量，记录物证；每项缩小估价范围，三项当前检验完成后仍保留估价区间，成交价需自行议定。\n• 多件买卖：就在原来的柜台对话中，从抽屉拿货给来客看，他会当场接受、还价或拒绝。问“你还带了别的货吗”可继续看他带来的旧货；不必进入其他交易界面。每只表各自议价，谈妥的几件会记着，原报价台可以一起交割1 AP；交割后客人仍在，送客才结束接待。\n• 议价：不再限制三次还价。NPC根据已知来源、主动出示的证据、报价差距和实际让步决定继续谈、拒绝本件或离开。可以主动出示物证。维修师、收藏者和普通人理解同一条证据的能力不同，相关专家85%概率独立准确估价，普通客人20%概率接近市价；你的私下检验不会自动更新对方认知。\n• 造假：在修表台选择外形与机芯兼容、目录价更高的目标款，分别仿制标识、换目标外壳、覆印编号和校准配重。编号与配重需先换壳，各项独立操作与结算，内部故障仍保留。相似度越高，未识破的顾客越接近按目标款估价；专家可识破加工痕迹并拒收，关注+10、阵营关系-8。同一轮不重复处罚。\n• 维修：依本件故障安排除尘、开盖、洗件、换件、润滑回装与走时复核；机械表与石英表操作不同。完成对应工序时扣费，进度可保存。材料等流动商人到店购买。独立翻新可自由选择吹灰、擦拭、抛光、换壳或换表带，分别结算；提升品相但不修复机芯，更换件保留可鉴定痕迹。\n• 仓储与订单：保管每一只原表，核验来源，按订单要求交还同一实物。\n• 收租与日结：第7、14、21天房东梁叔上门收取450、495、545 Cr租金，核对后确认付款并保留回执，日结不再重复扣租。现金不足可先筹钱，再从账本请房东过来；收租不消耗AP。账本日结支付设备电费与固定清洁费8 Cr，继续经营21天。电费只在成功记录新读数或提交用电工序时计次；手工清洁、移动镜片和查看旧结果不收费。账本可展开设备状态、台数与作业明细；工作灯一次性 120 Cr，安装后从次日起用电 +1 Cr/日。"
	var scroll := ScrollContainer.new()
	scroll.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	scroll.custom_minimum_size.y = clampf(get_viewport().get_visible_rect().size.y - 300, 180, 450)
	body.add_child(scroll)
	var instructions := UIKit.label(text, 21, UIKit.TEXT, false, true)
	instructions.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	scroll.add_child(instructions)

## One mixer channel: name, slider and percentage; saves when released.
func _volume_row(text: String, key: String, fallback: float) -> Control:
	var row := UIKit.hbox(14)
	row.custom_minimum_size = Vector2(0, 46)
	var caption := UIKit.label(text, 20, UIKit.TEXT)
	caption.custom_minimum_size.x = 110
	row.add_child(caption)
	var slider := HSlider.new()
	slider.min_value = 0
	slider.max_value = 100
	slider.step = 5
	slider.value = roundf(float(Game.prefs.get(key, fallback)) * 100.0)
	slider.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	slider.size_flags_vertical = Control.SIZE_SHRINK_CENTER
	slider.custom_minimum_size = Vector2(0, 30)
	slider.focus_mode = Control.FOCUS_ALL
	row.add_child(slider)
	var pct := UIKit.label("%d%%" % int(slider.value), 18, UIKit.AMBER, true)
	pct.custom_minimum_size.x = 64
	pct.horizontal_alignment = HORIZONTAL_ALIGNMENT_RIGHT
	row.add_child(pct)
	slider.value_changed.connect(func(v: float):
		pct.text = "%d%%" % int(v)
		Game.prefs[key] = v / 100.0
		Audio.apply_prefs()
		if key == "sfx_volume":
			sound("click", -4))
	slider.drag_ended.connect(func(_changed: bool): Game.save_prefs())
	slider.focus_exited.connect(func(): Game.save_prefs())
	return row

func open_settings() -> void:
	var m := modal("设置", 640)
	var body: VBoxContainer = m[0]
	body.add_child(UIKit.switch_row("声音", Game.prefs.sound, func(on: bool):
		Game.prefs.sound = on
		Game.save_prefs()
		_apply_sound()))
	for spec in [["音乐", "music_volume", 0.6], ["音效", "sfx_volume", 0.8]]:
		body.add_child(_volume_row(spec[0], spec[1], spec[2]))
	body.add_child(UIKit.switch_row("减少动态效果", Game.prefs.reduced_motion, func(on: bool):
		Game.prefs.reduced_motion = on
		Game.save_prefs()))
	body.add_child(UIKit.rule())
	var fs := UIKit.button("切换全屏", "secondary", Vector2(0, 56))
	fs.pressed.connect(func():
		var full := DisplayServer.window_get_mode() == DisplayServer.WINDOW_MODE_FULLSCREEN
		DisplayServer.window_set_mode(DisplayServer.WINDOW_MODE_WINDOWED if full else DisplayServer.WINDOW_MODE_FULLSCREEN))
	body.add_child(fs)
	var catalogue := UIKit.button("全图鉴 · 全部手表", "secondary", Vector2(0,56))
	catalogue.name = "all_watch_catalogue"
	catalogue.pressed.connect(func():
		m[1].call()
		open_watch_catalogue())
	body.add_child(catalogue)
	var reset := UIKit.button("新开一家店（清除当前进度）", "danger", Vector2(0, 56))
	reset.pressed.connect(func():
		m[1].call()
		confirm("新开一家店", "当前存档（第 %d 天）的现金、库存和订单都会清除，无法恢复。" % int(Game.state.day), "清除并新开", func():
			Game.new_game()
			shutter(1)))
	body.add_child(reset)
	if Game.legacy_save_text() != "":
		body.add_child(UIKit.label("旧版经营档案已保留，手表新店使用独立进度。", 17, UIKit.MUTED, false, true))
		var legacy := UIKit.button("导出旧版经营档案备份", "secondary", Vector2(0, 52))
		legacy.pressed.connect(export_legacy_backup)
		body.add_child(legacy)

# ---------------------------------------------------------------- title & shutter

func _close_title() -> void:
	if is_instance_valid(title):
		title.queue_free()
	page_host.show()
	hud.hide()
	nav.hide()
	hint_label.visible = workspace_mode and not mobile_mode()
	call_deferred("_sync_wanted_notice")

func _show_title() -> void:
	if is_instance_valid(title):
		title.queue_free()
	if not workspace_mode:
		Audio.music_for("title")
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
	panel.custom_minimum_size = Vector2(360 if portrait_mode() else 620, 0)
	center.add_child(panel)
	var v := UIKit.vbox(20)
	panel.add_child(v)
	var station := UIKit.label("回环九号  /  下层旧港", 19, UIKit.MUTED)
	station.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v.add_child(station)
	v.add_child(UIKit.rule())
	var t := UIKit.label("轨道旧货局", 38 if portrait_mode() else 64, UIKit.TEXT)
	t.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v.add_child(t)
	var sub := UIKit.label("每件旧物，都有下一程。", 24, UIKit.AMBER)
	sub.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	v.add_child(sub)
	var intro := UIKit.label("鉴定旧物 · 商议价格 · 经营你的柜台", 15 if portrait_mode() else 19, UIKit.MUTED)
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
	for spec in [["检验说明书", open_watch_manual], ["玩法说明", open_help], ["设置", open_settings]]:
		var button := UIKit.button(spec[0], "secondary", Vector2(0, 50), 14 if portrait_mode() else 20)
		button.size_flags_horizontal = Control.SIZE_EXPAND_FILL
		button.pressed.connect(spec[1])
		hb.add_child(button)
	v.add_child(hb)
	cont.call_deferred("grab_focus")

## Metal shutter that rolls down, shows the day plate, and rolls back up.
func shutter(day: int) -> void:
	if not workspace_mode:
		Audio.music_for("counter")
		Audio.day_opened(day)
	var door := Control.new()
	door.set_meta("blocks_shop_input", true)
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
	if counter_layout_deferred and not _counter_layout_busy(): _fit()
	if workspace_layout_deferred and workspace_open() and workspace_shell.page.can_close_workspace():
		_layout_workspace()
		workspace_shell._fit()
	if workspace_close_pending and workspace_open() and workspace_shell.page.can_close_workspace(): close_workspace()
	_poll_night_report()
	_update_cursor()
	var t := Time.get_ticks_msec() / 1000.0
	ambient.color = ambient.color.lerp(ambient_target, 1.0 - exp(-delta * 6.0))
	cam.zoom = Vector2.ONE if workspace_mode else Vector2.ONE * zoom_base * (1.0 + 0.14 * focus)
	cam.position = get_viewport().get_visible_rect().size * 0.5 if workspace_mode else (CENTER + view_shift).lerp(focus_point, focus * 0.55)
	shake = maxf(0.0, shake - delta * 1.6)
	cam.offset = Vector2.ZERO if workspace_mode else Vector2(randf_range(-1, 1), randf_range(-1, 1)) * shake * shake * 22.0
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

# The inventory paper stays in the outer viewport, above equipment drawers.
func _sync_wanted_notice() -> void:
	if workspace_mode: return
	if not WantedCases.has_notice(Game.state):
		if is_instance_valid(wanted_notice): wanted_notice.hide()
		return
	if not is_instance_valid(wanted_notice):
		wanted_notice=preload("res://scripts/ui/wanted_notice.gd").new()
		root_ui.add_child(wanted_notice)
		wanted_notice.setup(self)
	wanted_notice.refresh()
	if is_instance_valid(title) and not title.is_queued_for_deletion(): wanted_notice.hide()
	if wanted_notice.visible:
		root_ui.move_child(wanted_notice,-1)
		root_ui.move_child(modal_layer,-1)

func toggle_wanted_notice() -> void:
	if workspace_mode:
		workspace_parent.toggle_wanted_notice()
		return
	if not WantedCases.has_notice(Game.state):
		toast("先向巡警领取通缉名单。")
		return
	Game.dispatch({"type":"TOGGLE_NOTICE"})

# Suppress repeated automatic opening after X for this session; ACK is saved.
var night_report_seen := ""
func _poll_night_report() -> void:
	if workspace_mode or NightCrime.pending_morning(Game.state).is_empty(): return
	if is_instance_valid(title) and not title.is_queued_for_deletion(): return
	if modal_open() or workspace_open(): return
	for effect in fx.get_children():
		if effect.get_meta("blocks_shop_input", false) and not effect.is_queued_for_deletion(): return
	var key := String(Game.state.seed) + "/" + str(Game.state.day)
	if night_report_seen == key: return
	night_report_seen = key
	open_night_report(false)

## Scroll only the records; confirmation always remains on screen.
func night_scroll(body: VBoxContainer, height := 430.0) -> VBoxContainer:
	var sc := ScrollContainer.new()
	sc.horizontal_scroll_mode = ScrollContainer.SCROLL_MODE_DISABLED
	sc.custom_minimum_size.y = minf(height, maxf(140, get_viewport().get_visible_rect().size.y - 310))
	sc.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	sc.mouse_filter = Control.MOUSE_FILTER_PASS
	body.add_child(sc)
	var gutter := MarginContainer.new()
	gutter.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	gutter.add_theme_constant_override("margin_right", 18)
	sc.add_child(gutter)
	var records := UIKit.vbox(12)
	records.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	gutter.add_child(records)
	return records

func open_night_report(manual := true) -> void:
	if workspace_mode:
		workspace_parent.open_night_report(manual)
		return
	if not manual and NightCrime.pending_morning(Game.state).is_empty(): return
	if manual: Game.dispatch({"type":"OPEN_NIGHT_REPORT"})
	night_report_seen = String(Game.state.seed) + "/" + str(Game.state.day)
	var report := NightCrime.public_report(Game.state)
	var m := modal("夜间失窃与查货记录" if manual else "昨夜失窃记录", 940)
	var body: VBoxContainer = m[0]
	var records := night_scroll(body)
	if manual: records.add_child(UIKit.label("有效协警 %d 次 · 本次查货宽容概率 %d%%" % [report.cooperation, report.leniencyChance], 21, UIKit.TEXT, true, true))
	if report.mornings.is_empty(): records.add_child(UIKit.label("尚无夜间记录。", 19, UIKit.TEXT))
	var mornings: Array = report.mornings.duplicate() if manual else [NightCrime.pending_morning(Game.state)]
	mornings.reverse()
	for morning in mornings:
		var card := UIKit.plate(UIKit.paper_style(14))
		var rows := UIKit.vbox(10)
		card.add_child(rows)
		rows.add_child(UIKit.label("第 %d 天开门 · 昨夜%s" % [morning.day, "无失窃" if morning.losses.is_empty() else "失窃 %d 件" % morning.losses.size()], 22, UIKit.INK, true, true))
		if morning.has("chanceBp"):
			rows.add_child(UIKit.label("结算时失窃概率 %.2f%% · 按当晚可被盗库存计算。" % (int(morning.get("effectiveChanceBp",morning.chanceBp))/100.0),18,UIKit.INK,false,true))
		for loss in morning.losses:
			var row := UIKit.hbox(12)
			var image := TextureRect.new()
			image.texture = UIKit.item_icon(loss.defId)
			image.custom_minimum_size = Vector2(64,64)
			image.expand_mode = TextureRect.EXPAND_IGNORE_SIZE
			image.stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
			row.add_child(image)
			var caption := UIKit.label("%s · %s\n品相 %s · %s · 核定市价 %s\n%s · 承保上限 %s · 赔款 %s\n案件 %s · %s" % [loss.name, loss.uid, UIKit.pct(loss.condition), {"display":"陈列架","warehouse":"后仓"}.get(loss.location,loss.location), UIKit.money(loss.value), "已承保" if loss.covered else "未承保", UIKit.money(loss.confirmedValue), UIKit.money(loss.payout), loss.caseId, loss.claimReason], 18, UIKit.INK, false, true)
			caption.size_flags_horizontal = Control.SIZE_EXPAND_FILL
			row.add_child(caption)
			rows.add_child(row)
		rows.add_child(UIKit.label("保险赔款 %s 已自动入账；重开记录不会重复理赔。已赔付原物追回后移交保险方。" % UIKit.money(morning.payout), 18, UIKit.INK, false, true))
		records.add_child(card)
	for case in report.cases if manual else []:
		var details := "案件 %s · 第 %d 天 · %s" % [case.id, case.lossDay, "已抓获" if case.arrested else "待核对线索"]
		if case.has("suspect"): details += " · " + String(case.suspect)
		for item in case.items: details += "\n%s · %s · %s%s" % [item.name, item.uid, item.recovery if item.recovery != "" else "尚未追回", " · 曾获赔，追回归保险方" if item.paid else ""]
		records.add_child(UIKit.label(details, 18, UIKit.TEXT, false, true))
	if manual and not report.lastInspection.is_empty():
		var receipt: Dictionary = report.lastInspection
		records.add_child(UIKit.label("第 %d 天查货回执\n%s\n追回编号：%s\n应罚 %s · 实缴 %s · %s\n有效协警 %d 次" % [receipt.day, receipt.text, "、".join(receipt.confiscated) if not receipt.confiscated.is_empty() else "无", UIKit.money(receipt.fineDue), UIKit.money(receipt.finePaid), "本次宽容免罚" if receipt.waived else "按规定处置", receipt.cooperation], 19, UIKit.TEXT, false, true))
	var ack := UIKit.button("确认夜间记录", "primary", Vector2(0,56), 22)
	ack.pressed.connect(func():
		Game.dispatch({"type":"ACK_NIGHT_REPORT"})
		m[1].call())
	body.add_child(ack)
