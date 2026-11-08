extends Node2D
## Counter vertical slice: one visitor, one object, two instruments, a haggle and
## a deal — built to judge look and feel, not the full economy.

const K := 1920.0 / 1672.0 * 1.04   # painted source px -> world px
const CENTER := Vector2(960, 540)
const SEAM_UV := Vector2(0.62, 0.52)

var cam: Camera2D
var layers := {}
var depth := {"bg": 0.22, "mid": 0.5, "fg": 1.0}
var ambient: CanvasModulate
var ambient_base := Color(0.56, 0.57, 0.66)
var flickers: Array = []          # [light, glow, base_energy, kind, seed]
var lamp: PointLight2D
var uv_light: PointLight2D
var customer: Customer
var item: PawnItem
var bell: ServiceBell
var terminal: Terminal
var ui: CanvasLayer
var fx: CanvasLayer
var bubble: PanelContainer
var bubble_label: Label
var cash_label: Label
var hint: Label
var evidence_box: VBoxContainer
var tool_buttons := {}
var lens: Node2D
var lens_glass: Sprite2D
var wand: Node2D
var ring: Node2D
var tool := "hand"
var progress := 0.0
var evidence: Array[String] = []
var state := "idle"
var ask := 134
var floor_price := 118
var patience := 3
var cash := 1200
var shown_cash := 1200.0
var low := 34
var high := 320
var pointer_override: Variant = null
var shake := 0.0
var zoom_base := 1.0
var focus := 0.0
var sounds := {}
var end_panel: Control

func art(u: float, v: float) -> Vector2:
	return CENTER + (Vector2(u, v) - Vector2(836, 470.5)) * K

func _ready() -> void:
	randomize()
	_build_world()
	_build_ambient()
	_build_ui()
	_build_audio()
	get_viewport().size_changed.connect(_fit)
	_fit()
	terminal.show_idle("按一下柜台上的服务铃")
	_hint("按一下柜台左边的服务铃，请下一位客人进来。")
	for a in OS.get_cmdline_user_args():
		if a.begins_with("--capture="):
			_capture(a.substr(10))
		elif a.begins_with("--dragtest="):
			_drag_test(a.substr(11))

# ---------------------------------------------------------------- world

func _layer(name: String, z: int) -> Node2D:
	var n := Node2D.new()
	n.name = name
	n.z_index = z
	add_child(n)
	layers[name] = n
	return n

func _build_world() -> void:
	cam = Camera2D.new()
	cam.position = CENTER
	add_child(cam)
	ambient = CanvasModulate.new()
	ambient.color = ambient_base
	add_child(ambient)
	var bg := _layer("bg", 0)
	var mid := _layer("mid", 10)
	var fg := _layer("fg", 20)
	var bg_sprite := Sprite2D.new()
	bg_sprite.texture = Util.lit("res://assets/scene/counter_bg.png", "res://assets/scene/counter_bg_n.png", 0.25, 0.4)
	bg_sprite.position = CENTER
	bg_sprite.scale = Vector2.ONE * K / 1.5
	bg.add_child(bg_sprite)
	customer = Customer.new()
	customer.position = Vector2(930, 1015)
	customer.scale = Vector2.ONE * 1.17
	customer.visible = false
	mid.add_child(customer)
	var fg_sprite := Sprite2D.new()
	fg_sprite.texture = Util.lit("res://assets/scene/counter_fg.png", "res://assets/scene/counter_fg_n.png", 0.5, 0.75)
	fg_sprite.position = CENTER
	fg_sprite.scale = Vector2.ONE * K / 1.5
	fg.add_child(fg_sprite)
	bell = ServiceBell.new()
	bell.position = Vector2(340, 800)
	bell.material = Util.unshaded()
	fg.add_child(bell)
	item = PawnItem.new()
	item.position = Vector2(1030, 800)
	item.visible = false
	fg.add_child(item)
	item.dropped.connect(func():
		_sound("drop", -4.0, randf_range(0.9, 1.1))
		_dust(item.global_position + Vector2(0, 70))
		shake = maxf(shake, 0.25))
	item.flipped.connect(func(back: bool):
		_sound("page", -6.0)
		_hint("背面：机腹喷了新漆。试试紫外灯（3）。" if back else "正面：外壳有磕碰。试试放大镜（2）。"))
	_build_tools(fg)

func _build_tools(fg: Node2D) -> void:
	lens = Node2D.new()
	lens.z_index = 60
	lens.visible = false
	fg.add_child(lens)
	var handle := Line2D.new()
	handle.points = PackedVector2Array([Vector2(80, 80), Vector2(190, 190)])
	handle.width = 26
	handle.default_color = Color("3a2a1b")
	handle.begin_cap_mode = Line2D.LINE_CAP_ROUND
	handle.end_cap_mode = Line2D.LINE_CAP_ROUND
	handle.material = Util.unshaded()
	lens.add_child(handle)
	var grip := Line2D.new()
	grip.points = PackedVector2Array([Vector2(110, 110), Vector2(186, 186)])
	grip.width = 16
	grip.default_color = Color("8a5a2b")
	grip.end_cap_mode = Line2D.LINE_CAP_ROUND
	grip.material = Util.unshaded()
	lens.add_child(grip)
	lens_glass = Sprite2D.new()
	lens_glass.texture = Util.white(8)
	lens_glass.scale = Vector2.ONE * 240.0 / 8.0
	var lm := ShaderMaterial.new()
	lm.shader = load("res://shaders/lens.gdshader")
	lens_glass.material = lm
	lens.add_child(lens_glass)
	ring = ProgressRing.new()
	lens.add_child(ring)
	wand = Node2D.new()
	wand.z_index = 60
	wand.visible = false
	fg.add_child(wand)
	var w := Sprite2D.new()
	w.texture = load("res://assets/tools/uv.png")
	w.scale = Vector2.ONE * 0.42
	w.rotation = -0.5
	w.position = Vector2(80, 120)
	w.material = Util.unshaded()
	wand.add_child(w)
	var tip := Sprite2D.new()
	tip.texture = Util.radial(128, 0.3)
	tip.modulate = Color(0.7, 0.4, 1.0, 0.8)
	tip.scale = Vector2.ONE * 1.4
	tip.material = Util.add_material()
	wand.add_child(tip)
	var ring2 := ProgressRing.new()
	ring2.radius = 70.0
	ring2.name = "ring"
	wand.add_child(ring2)
	uv_light = PointLight2D.new()
	uv_light.texture = Util.light_tex()
	uv_light.texture_scale = 1.1
	uv_light.color = Color(0.62, 0.36, 1.0)
	uv_light.energy = 0.0
	uv_light.height = 80
	add_child(uv_light)

func _light(pos: Vector2, color: Color, energy: float, scale: float, height := 60.0, glow := 0.0, glow_size := 1.0, kind := "steady") -> PointLight2D:
	var l := PointLight2D.new()
	l.texture = Util.light_tex()
	l.texture_scale = scale
	l.position = pos
	l.color = color
	l.energy = energy
	l.height = height
	add_child(l)
	var g: Sprite2D = null
	if glow > 0.0:
		g = Sprite2D.new()
		g.texture = Util.radial(256, 0.3)
		g.position = pos
		g.modulate = Color(color.r, color.g, color.b, glow)
		g.scale = Vector2.ONE * glow_size
		g.material = Util.add_material()
		g.z_index = 30
		add_child(g)
	flickers.append([l, g, energy, kind, randf() * 10.0])
	return l

func _build_ambient() -> void:
	lamp = _light(art(218, 352), Color(1.0, 0.74, 0.45), 1.35, 3.4, 70, 0.55, 0.75, "lamp")
	_light(art(780, 250), Color(0.45, 0.62, 1.0), 0.6, 7.0, 260)
	_light(art(880, 520), Color(1.0, 0.86, 0.72), 0.32, 8.0, 380)
	_light(art(740, 58), Color(0.6, 0.95, 1.0), 0.55, 3.2, 120, 0.35, 1.3, "tube")
	_light(art(1000, 98), Color(0.6, 0.95, 1.0), 0.45, 2.8, 120, 0.3, 1.1, "tube")
	_light(art(1420, 290), Color(0.4, 0.95, 1.0), 0.65, 3.4, 90, 0.0, 1.0, "tube")
	_light(art(1200, 290), Color(0.75, 0.42, 1.0), 0.9, 2.2, 60, 0.4, 0.9, "pulse")
	_light(art(1605, 560), Color(0.35, 1.0, 0.85), 0.6, 1.6, 50, 0.35, 0.6, "pulse")
	_light(art(1195, 36), Color(1.0, 0.75, 0.45), 0.7, 2.0, 60, 0.5, 0.45)
	_light(art(1600, 26), Color(1.0, 0.75, 0.45), 0.6, 2.0, 60, 0.45, 0.42)
	_light(art(355, 280), Color(1.0, 0.75, 0.45), 0.45, 1.2, 40, 0.4, 0.25, "beacon")
	# Window: traffic and stars clipped to the glass.
	var glass := Polygon2D.new()
	var pts := PackedVector2Array()
	for p in [Vector2(470, 132), Vector2(560, 118), Vector2(905, 118), Vector2(1072, 140), Vector2(1090, 175), Vector2(1062, 352), Vector2(470, 352)]:
		pts.append(art(p.x, p.y))
	glass.polygon = pts
	glass.clip_children = CanvasItem.CLIP_CHILDREN_ONLY
	layers.bg.add_child(glass)
	var sky := Traffic.new()
	sky.area = Rect2(art(470, 118), art(1090, 352) - art(470, 118))
	glass.add_child(sky)
	# Bubbles in the specimen tube.
	var bub := _particles(layers.bg, art(1200, 318), 26, 1.8, Color(0.85, 0.72, 1.0, 0.8))
	bub.emission_shape = CPUParticles2D.EMISSION_SHAPE_RECTANGLE
	bub.emission_rect_extents = Vector2(16, 6)
	bub.direction = Vector2(0, -1)
	bub.spread = 6
	bub.initial_velocity_min = 30
	bub.initial_velocity_max = 55
	bub.scale_amount_min = 0.05
	bub.scale_amount_max = 0.11
	# Dust drifting through the lamp light and window glow.
	var dust := _particles(layers.mid, Vector2(820, 520), 90, 10.0, Color(1.0, 0.9, 0.75, 0.32))
	dust.emission_shape = CPUParticles2D.EMISSION_SHAPE_RECTANGLE
	dust.emission_rect_extents = Vector2(820, 330)
	dust.direction = Vector2(0.3, -1)
	dust.spread = 180
	dust.gravity = Vector2(0, -3)
	dust.initial_velocity_min = 4
	dust.initial_velocity_max = 12
	dust.scale_amount_min = 0.03
	dust.scale_amount_max = 0.07
	dust.preprocess = 10
	# Steam over the mug.
	var steam := _particles(layers.fg, art(166, 534), 16, 2.8, Color(1, 1, 1, 0.16))
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
	steam.color = Color.WHITE
	steam.material = Util.unshaded()
	steam.preprocess = 3
	# Post: vignette, colour split, grain. Fresh back-buffer so the loupe shows.
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

func _particles(parent: Node, pos: Vector2, amount: int, life: float, color: Color) -> CPUParticles2D:
	var p := CPUParticles2D.new()
	p.position = pos
	p.amount = amount
	p.lifetime = life
	p.texture = Util.radial(64, 0.4)
	p.color = color
	p.material = Util.add_material()
	p.gravity = Vector2.ZERO
	parent.add_child(p)
	return p

func _dust(at: Vector2) -> void:
	var p := _particles(layers.fg, layers.fg.to_local(at), 26, 0.7, Color(0.9, 0.85, 0.75, 0.5))
	p.one_shot = true
	p.explosiveness = 0.95
	p.emission_shape = CPUParticles2D.EMISSION_SHAPE_RECTANGLE
	p.emission_rect_extents = Vector2(120, 6)
	p.direction = Vector2(0, -1)
	p.spread = 80
	p.initial_velocity_min = 40
	p.initial_velocity_max = 110
	p.gravity = Vector2(0, 160)
	p.scale_amount_min = 0.12
	p.scale_amount_max = 0.3
	p.material = Util.unshaded()
	p.emitting = true
	get_tree().create_timer(1.5).timeout.connect(p.queue_free)

# ---------------------------------------------------------------- UI

func _panel_style(fill: Color, edge: Color, radius := 10) -> StyleBoxFlat:
	var s := StyleBoxFlat.new()
	s.bg_color = fill
	s.border_color = edge
	s.set_border_width_all(2)
	s.set_corner_radius_all(radius)
	s.shadow_color = Color(0, 0, 0, 0.5)
	s.shadow_size = 10
	s.shadow_offset = Vector2(0, 4)
	s.content_margin_left = 18
	s.content_margin_right = 18
	s.content_margin_top = 12
	s.content_margin_bottom = 12
	return s

func _build_ui() -> void:
	ui = CanvasLayer.new()
	ui.layer = 10
	add_child(ui)
	fx = CanvasLayer.new()
	fx.layer = 20
	add_child(fx)
	var mono: Font = load("res://assets/fonts/orbital-mono.ttf")
	# HUD plate.
	var hud := PanelContainer.new()
	hud.add_theme_stylebox_override("panel", _panel_style(Color(0.06, 0.08, 0.09, 0.86), Color("6f5a3d")))
	hud.position = Vector2(28, 24)
	ui.add_child(hud)
	var row := HBoxContainer.new()
	row.add_theme_constant_override("separation", 26)
	hud.add_child(row)
	var name_l := Label.new()
	name_l.text = "轨道旧货局  ·  第 1 天"
	name_l.add_theme_font_size_override("font_size", 28)
	name_l.add_theme_color_override("font_color", Color("f3e6cc"))
	row.add_child(name_l)
	cash_label = Label.new()
	cash_label.add_theme_font_override("font", mono)
	cash_label.add_theme_font_size_override("font_size", 34)
	cash_label.add_theme_color_override("font_color", Color("ffc27a"))
	row.add_child(cash_label)
	# Terminal on the right.
	terminal = Terminal.new()
	terminal.set_anchors_preset(Control.PRESET_BOTTOM_RIGHT)
	terminal.position = Vector2(1920 - 440 - 40, 1080 - 560 - 36)
	ui.add_child(terminal)
	terminal.offer.connect(_on_offer)
	terminal.accept.connect(func(): _deal(ask))
	terminal.dismiss.connect(func(): _send_away("行吧，我找别家问问。", "tired"))
	terminal.knob.changed.connect(func(_v): _sound("click", -18.0, 1.6))
	# Tool tray.
	var tray := HBoxContainer.new()
	tray.position = Vector2(36, 1080 - 132)
	tray.add_theme_constant_override("separation", 14)
	ui.add_child(tray)
	for spec in [["hand", "手", "", "1 · 拿取与摆放"], ["lens", "", "res://assets/tools/lens.png", "2 · 放大镜：找补漆接缝"], ["uv", "", "res://assets/tools/uv.png", "3 · 紫外灯：照出旧编号"], ["flip", "翻面", "", "F · 翻到另一面"]]:
		var b := Button.new()
		b.custom_minimum_size = Vector2(104, 104)
		b.focus_mode = Control.FOCUS_NONE
		b.tooltip_text = spec[3]
		b.text = spec[1]
		b.add_theme_font_size_override("font_size", 28)
		if spec[2] != "":
			b.icon = load(spec[2])
			b.expand_icon = true
			b.icon_alignment = HORIZONTAL_ALIGNMENT_CENTER
		b.add_theme_stylebox_override("normal", _panel_style(Color(0.09, 0.11, 0.12, 0.92), Color("5d6a6b"), 52))
		b.add_theme_stylebox_override("hover", _panel_style(Color(0.15, 0.17, 0.17, 0.95), Color("c9a46a"), 52))
		b.add_theme_stylebox_override("pressed", _panel_style(Color(0.2, 0.14, 0.08, 0.95), Color("ffb35c"), 52))
		b.add_theme_stylebox_override("disabled", _panel_style(Color(0.05, 0.06, 0.07, 0.8), Color("2f3638"), 52))
		var id: String = spec[0]
		b.pressed.connect(func(): _flip() if id == "flip" else _set_tool(id))
		tray.add_child(b)
		tool_buttons[id] = b
	# Evidence cards slide in on the left.
	evidence_box = VBoxContainer.new()
	evidence_box.position = Vector2(30, 140)
	evidence_box.add_theme_constant_override("separation", 12)
	ui.add_child(evidence_box)
	# Speech bubble.
	bubble = PanelContainer.new()
	var paper := _panel_style(Color("efe6d2"), Color("8a7a5c"), 12)
	paper.content_margin_left = 22
	paper.content_margin_right = 22
	bubble.add_theme_stylebox_override("panel", paper)
	bubble.custom_minimum_size = Vector2(460, 0)
	bubble.modulate.a = 0.0
	ui.add_child(bubble)
	bubble_label = Label.new()
	bubble_label.autowrap_mode = TextServer.AUTOWRAP_ARBITRARY
	bubble_label.add_theme_font_size_override("font_size", 27)
	bubble_label.add_theme_color_override("font_color", Color("2a241c"))
	bubble.add_child(bubble_label)
	# Hint strip.
	hint = Label.new()
	hint.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	hint.position = Vector2(560, 1080 - 64)
	hint.size = Vector2(800, 40)
	hint.add_theme_font_size_override("font_size", 22)
	hint.add_theme_color_override("font_color", Color("e7dcc4"))
	hint.add_theme_color_override("font_outline_color", Color(0, 0, 0, 0.85))
	hint.add_theme_constant_override("outline_size", 6)
	ui.add_child(hint)
	_tools_enabled(false)

func _build_audio() -> void:
	for k in ["click", "coin", "check", "page", "drop", "open", "reject", "ambient_loop"]:
		var p := AudioStreamPlayer.new()
		p.stream = load("res://assets/audio/%s.wav" % k)
		add_child(p)
		sounds[k] = p
	var amb: AudioStreamPlayer = sounds["ambient_loop"]
	amb.volume_db = -16.0
	amb.finished.connect(amb.play)
	amb.play()

func _sound(k: String, db := 0.0, pitch := 1.0) -> void:
	var p: AudioStreamPlayer = sounds.get(k)
	if p:
		p.volume_db = db
		p.pitch_scale = pitch
		p.play()

func _hint(text: String) -> void:
	hint.text = text
	hint.modulate.a = 0.0
	create_tween().tween_property(hint, "modulate:a", 1.0, 0.3)

func _tools_enabled(on: bool) -> void:
	for k in tool_buttons:
		(tool_buttons[k] as Button).disabled = not on

func _fit() -> void:
	var vis := get_viewport().get_visible_rect().size
	zoom_base = maxf(1.0, maxf(vis.x / 1960.0, vis.y / 1100.0))
	terminal.position = Vector2(vis.x - 440 - 40, vis.y - 560 - 36)
	hint.position = Vector2(vis.x * 0.5 - 400, vis.y - 64)

# ---------------------------------------------------------------- input

var last_screen := Vector2(960, 560)

func pointer() -> Vector2:
	return pointer_override if pointer_override != null else _world(last_screen)

## Viewport event position -> world, through the camera.
func _world(pos: Vector2) -> Vector2:
	return get_viewport().get_canvas_transform().affine_inverse() * pos

func _input(e: InputEvent) -> void:
	# Track the pointer from events (also over UI) so tools follow it everywhere.
	if e is InputEventMouse:
		last_screen = (e as InputEventMouse).position

func _unhandled_input(e: InputEvent) -> void:
	if e is InputEventMouseButton:
		var mb := e as InputEventMouseButton
		if mb.button_index == MOUSE_BUTTON_LEFT and mb.pressed:
			_press(_world(mb.position))
		elif mb.button_index == MOUSE_BUTTON_LEFT and not mb.pressed:
			item.end_drag()
		elif mb.button_index == MOUSE_BUTTON_RIGHT and mb.pressed:
			_flip()
	elif e is InputEventKey and e.pressed and not e.echo:
		match (e as InputEventKey).keycode:
			KEY_1: _set_tool("hand")
			KEY_2: _set_tool("lens")
			KEY_3: _set_tool("uv")
			KEY_F, KEY_SPACE: _flip()

func _press(p: Vector2) -> void:
	if state == "idle" and bell.hit_test(p):
		_ring()
	elif state == "open" and tool == "hand" and item.visible and item.contains(p):
		item.begin_drag(p)
		_sound("click", -10.0, 0.8)
	elif bell.hit_test(p):
		bell.strike()
		_sound("check", -8.0, 1.3)

func _set_tool(id: String) -> void:
	if state != "open" or id == tool:
		return
	tool = id
	_sound("click", -6.0, 1.2 if id != "hand" else 0.9)
	lens.visible = id == "lens"
	wand.visible = id == "uv"
	var tw := create_tween()
	tw.tween_property(ambient, "color", Color(0.17, 0.15, 0.27) if id == "uv" else ambient_base, 0.35)
	tw.parallel().tween_property(uv_light, "energy", 2.4 if id == "uv" else 0.0, 0.35)
	Input.set_default_cursor_shape(Input.CURSOR_CROSS if id != "hand" else Input.CURSOR_ARROW)
	for k in tool_buttons:
		var b: Button = tool_buttons[k]
		b.modulate = Color(1.25, 1.1, 0.9) if k == id else Color.WHITE
	match id:
		"lens": _hint("把放大镜移到实物上，停在可疑的位置。")
		"uv": _hint("关灯了。用紫外灯扫一遍，背面会更清楚。" if not item.back else "用紫外灯扫机腹，旧编号会发光。")
		_: _hint("拖动实物，右键或 F 翻面。")

func _flip() -> void:
	if state == "open" and item.visible:
		item.flip()

# ---------------------------------------------------------------- flow

func _ring() -> void:
	bell.strike()
	_sound("check", -2.0, 1.25)
	state = "arriving"
	_hint("")
	terminal.show_idle("来客进店中…")
	await get_tree().create_timer(0.45).timeout
	_sound("open", -6.0)
	customer.visible = true
	customer.modulate.a = 1.0
	customer.set_mood("neutral")
	customer.walk_in(2350.0)
	await customer.arrived
	customer.lean_in()
	await get_tree().create_timer(0.25).timeout
	_hand_over()
	await get_tree().create_timer(0.7).timeout
	_say("旧航道捞回来的折叠巡检蜂，机臂展开有点迟。134，拿走。")
	terminal.show_quote(ask, low, high, 0, 2, patience)
	terminal.set_active(true)
	state = "open"
	_tools_enabled(true)
	_hint("拖动实物，右键或 F 翻面；2 放大镜 · 3 紫外灯。")

func _hand_over() -> void:
	var start: Vector2 = layers.fg.to_local(customer.hands())
	var dest := Vector2(1030, 800)
	item.visible = true
	item.position = start
	item.lift = 0.0
	item.body.rotation = -0.4
	var tw := create_tween()
	tw.tween_method(func(p: float):
		item.position = start.lerp(dest, p)
		item.lift = sin(p * PI) * 120.0 + (1.0 - p) * 40.0
		item.body.rotation = lerpf(-0.4, 0.0, p), 0.0, 1.0, 0.55).set_trans(Tween.TRANS_SINE)
	tw.tween_callback(func(): item.land())

func _say(text: String, mood := "") -> void:
	if mood != "":
		customer.set_mood(mood)
	bubble_label.text = text
	bubble_label.visible_ratio = 0.0
	var dur := text.length() * 0.04
	customer.say(dur + 0.2)
	bubble.modulate.a = 1.0
	bubble.scale = Vector2(0.92, 0.92)
	create_tween().tween_property(bubble, "scale", Vector2.ONE, 0.18).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)
	var tw := create_tween()
	tw.tween_property(bubble_label, "visible_ratio", 1.0, dur)
	for i in int(text.length() / 3):
		get_tree().create_timer(i * 0.12).timeout.connect(func(): _sound("click", -24.0, randf_range(1.8, 2.3)))

func _find(id: String) -> void:
	if evidence.has(id):
		return
	evidence.append(id)
	progress = 0.0
	_sound("check", -2.0)
	shake = 0.2
	var title := "侧光 · 补漆接缝" if id == "seam" else "紫外 · 旧编号 HX-0417"
	var body := "机臂根部有一道新漆接缝，下面是撞击裂痕，一臂转速延迟。" if id == "seam" else "机腹新漆下是港务登记号 HX-0417，来源需核对。"
	_card(title, body)
	if id == "seam":
		item.mat.set_shader_parameter("found_seam", 1.0)
		low = 34
		high = 180
		floor_price = 96
		customer.lean_back()
		_say("看出补漆了？嘿，外壳磕过，不影响飞。", "focused")
	else:
		low = 40 if evidence.size() == 1 else 50
		high = 130 if evidence.size() == 2 else 160
		floor_price = 72 if evidence.size() == 2 else 88
		customer.shake_head()
		_say("那串编号……捡的时候就有，我可不清楚来历。", "question")
	ask = maxi(floor_price + 20, ask - 18)
	terminal.show_quote(ask, low, high, evidence.size(), 2, patience, "已降价")

func _card(title: String, body: String) -> void:
	var c := PanelContainer.new()
	c.add_theme_stylebox_override("panel", _panel_style(Color("e9dfc9"), Color("8a7a5c"), 6))
	c.custom_minimum_size = Vector2(400, 0)
	var v := VBoxContainer.new()
	c.add_child(v)
	var t := Label.new()
	t.text = title
	t.add_theme_font_size_override("font_size", 24)
	t.add_theme_color_override("font_color", Color("9a4a1f"))
	v.add_child(t)
	var b := Label.new()
	b.text = body
	b.autowrap_mode = TextServer.AUTOWRAP_ARBITRARY
	b.custom_minimum_size = Vector2(360, 0)
	b.add_theme_font_size_override("font_size", 19)
	b.add_theme_color_override("font_color", Color("2a241c"))
	v.add_child(b)
	evidence_box.add_child(c)
	c.pivot_offset = Vector2(0, 40)
	c.modulate.a = 0.0
	c.rotation = -0.08
	var tw := create_tween()
	tw.tween_property(c, "modulate:a", 1.0, 0.2)
	tw.parallel().tween_property(c, "rotation", 0.012 * (1 if evidence.size() % 2 else -1), 0.35).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT)

func _on_offer(value: int) -> void:
	if state != "open":
		return
	if value >= ask:
		_deal(value)
	elif value >= floor_price:
		customer.cheer()
		_deal(value)
	elif value >= floor_price * 0.75 and patience > 1:
		patience -= 1
		ask = maxi(floor_price, int(round((ask + value) * 0.5 / 5.0)) * 5)
		_sound("page", -4.0, 0.9)
		customer.lean_in()
		_say("再加点吧，%d 怎么样？" % ask, "question")
		terminal.show_quote(ask, low, high, evidence.size(), 2, patience, "还价 %d" % ask)
	else:
		patience -= 1
		_sound("reject", -3.0)
		customer.shake_head()
		customer.lean_back()
		shake = 0.25
		if patience <= 0:
			_send_away("算了，这价我宁可带回船上。", "reject")
			return
		_say("这价也太黑了。", "reject")
		terminal.show_quote(ask, low, high, evidence.size(), 2, patience, "客人不满")

func _deal(price: int) -> void:
	if state != "open":
		return
	state = "deal"
	_set_tool("hand")
	terminal.set_active(false)
	_tools_enabled(false)
	_hint("")
	customer.cheer()
	_say("痛快！东西归你了。", "happy")
	terminal.show_quote(price, low, high, evidence.size(), 2, patience, "成交")
	# Pay out bill by bill from the till into the visitor's hand.
	var from := terminal.global_position + Vector2(220, 140)
	var to := get_viewport().get_canvas_transform() * customer.hands()
	var bills := clampi(price / 20, 3, 8)
	for i in bills:
		get_tree().create_timer(0.08 * i).timeout.connect(_bill.bind(from, to, i))
	var tw := create_tween()
	tw.tween_property(self, "cash", cash - price, 0.08 * bills + 0.4)
	await get_tree().create_timer(0.08 * bills + 0.5).timeout
	_receipt(price)
	await get_tree().create_timer(1.2).timeout
	customer.nod()
	await get_tree().create_timer(0.5).timeout
	customer.walk_out(-500.0)
	_to_shelf()
	await customer.left
	_end("收购完成 · %d Cr" % price)

func _bill(from: Vector2, to: Vector2, i: int) -> void:
	var b := Panel.new()
	var s := StyleBoxFlat.new()
	s.bg_color = Color("9fc7a2")
	s.border_color = Color("3f6a4b")
	s.set_border_width_all(2)
	s.set_corner_radius_all(3)
	b.add_theme_stylebox_override("panel", s)
	b.size = Vector2(92, 46)
	b.pivot_offset = b.size * 0.5
	var l := Label.new()
	l.text = "20 Cr"
	l.add_theme_font_override("font", load("res://assets/fonts/orbital-mono.ttf"))
	l.add_theme_font_size_override("font_size", 20)
	l.add_theme_color_override("font_color", Color("1d3a28"))
	l.position = Vector2(14, 8)
	b.add_child(l)
	fx.add_child(b)
	var ctrl := (from + to) * 0.5 + Vector2(randf_range(-80, 80), -260)
	var tw := create_tween()
	tw.tween_method(func(p: float):
		var q := from.lerp(ctrl, p).lerp(ctrl.lerp(to, p), p)
		b.position = q - b.size * 0.5
		b.rotation = sin(p * PI * 2.0 + i) * 0.6
		b.scale = Vector2.ONE * (1.0 - p * 0.35), 0.0, 1.0, 0.55).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)
	tw.tween_callback(func():
		_sound("coin", -5.0, randf_range(0.95, 1.15))
		b.queue_free())

func _receipt(price: int) -> void:
	var holder := Control.new()
	holder.clip_contents = true
	holder.position = terminal.global_position + Vector2(-400, 40)
	holder.size = Vector2(370, 0)
	holder.rotation = -0.03
	fx.add_child(holder)
	var paper := PanelContainer.new()
	paper.add_theme_stylebox_override("panel", _panel_style(Color("f1ead9"), Color("b9a989"), 2))
	paper.size = Vector2(370, 300)
	paper.position = Vector2(0, -300)
	holder.add_child(paper)
	var lab := Label.new()
	lab.text = "回环九号 · 轨道旧货局\n收购凭据  No.0001\n——————————————\n折叠巡检蜂 ×1\n成交  %d Cr\n物证  %s\n来客  栗叔（拾荒船长）" % [price, "、".join(evidence.map(func(e): return "补漆接缝" if e == "seam" else "旧编号")) if evidence.size() else "无"]
	lab.add_theme_font_size_override("font_size", 21)
	lab.add_theme_color_override("font_color", Color("2a241c"))
	paper.add_child(lab)
	_sound("page", -2.0, 0.8)
	var tw := create_tween()
	tw.tween_property(holder, "size:y", 300.0, 0.9).set_trans(Tween.TRANS_SINE)
	tw.parallel().tween_property(paper, "position:y", 0.0, 0.9).set_trans(Tween.TRANS_SINE)
	tw.tween_callback(func():
		var stamp := Label.new()
		stamp.text = "已收购"
		stamp.add_theme_font_size_override("font_size", 54)
		stamp.add_theme_color_override("font_color", Color(0.75, 0.12, 0.1, 0.85))
		stamp.add_theme_color_override("font_outline_color", Color(0.75, 0.12, 0.1, 0.6))
		stamp.add_theme_constant_override("outline_size", 4)
		stamp.position = Vector2(196, 214)
		stamp.pivot_offset = Vector2(80, 30)
		stamp.rotation = -0.22
		stamp.scale = Vector2.ONE * 2.4
		stamp.modulate.a = 0.0
		paper.add_child(stamp)
		var st := create_tween()
		st.tween_property(stamp, "scale", Vector2.ONE, 0.12).set_trans(Tween.TRANS_QUAD).set_ease(Tween.EASE_IN)
		st.parallel().tween_property(stamp, "modulate:a", 1.0, 0.08)
		st.tween_callback(func():
			shake = 0.5
			_sound("drop", 0.0, 0.7)))

func _to_shelf() -> void:
	var start := item.global_position
	var dest := art(1462, 262)
	var tw := create_tween()
	tw.tween_method(func(p: float):
		item.global_position = start.lerp(dest, p) + Vector2(0, -sin(p * PI) * 160.0)
		item.scale = Vector2.ONE * lerpf(1.0, 0.24, p), 0.0, 1.0, 0.8).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_IN_OUT)
	tw.tween_callback(func():
		item.reparent(layers.mid)
		layers.mid.move_child(item, 0)
		item.global_position = dest
		_sound("drop", -8.0, 1.3))

func _send_away(line: String, mood: String) -> void:
	if state != "open":
		return
	state = "leaving"
	_set_tool("hand")
	terminal.set_active(false)
	_tools_enabled(false)
	_say(line, mood)
	await get_tree().create_timer(1.4).timeout
	var start := item.global_position
	var tw := create_tween()
	tw.tween_method(func(p: float):
		item.global_position = start.lerp(customer.hands(), p) + Vector2(0, -sin(p * PI) * 120.0)
		item.modulate.a = 1.0 - p * p, 0.0, 1.0, 0.5)
	await tw.finished
	customer.walk_out(-500.0)
	await customer.left
	_end("客人带着货走了")

func _end(title: String) -> void:
	state = "done"
	bubble.modulate.a = 0.0
	terminal.show_idle(title)
	end_panel = PanelContainer.new()
	end_panel.add_theme_stylebox_override("panel", _panel_style(Color(0.05, 0.07, 0.08, 0.93), Color("c9a46a")))
	var v := VBoxContainer.new()
	v.add_theme_constant_override("separation", 14)
	end_panel.add_child(v)
	var l := Label.new()
	l.text = "%s\n切片演示到这里结束。" % title
	l.horizontal_alignment = HORIZONTAL_ALIGNMENT_CENTER
	l.add_theme_font_size_override("font_size", 30)
	v.add_child(l)
	var b := Button.new()
	b.text = "再来一次"
	b.add_theme_font_size_override("font_size", 26)
	b.pressed.connect(func(): get_tree().reload_current_scene())
	v.add_child(b)
	ui.add_child(end_panel)
	end_panel.position = get_viewport().get_visible_rect().size * Vector2(0.5, 0.3) - Vector2(220, 90)
	end_panel.modulate.a = 0.0
	create_tween().tween_property(end_panel, "modulate:a", 1.0, 0.4)

# ---------------------------------------------------------------- frame

func _process(delta: float) -> void:
	var t := Time.get_ticks_msec() / 1000.0
	var vis := get_viewport().get_visible_rect().size
	var screen: Vector2 = last_screen if pointer_override == null else get_viewport().get_canvas_transform() * (pointer_override as Vector2)
	var m := ((screen - vis * 0.5) / (vis * 0.5)).clamp(Vector2(-1, -1), Vector2(1, 1))
	for k in layers:
		var n: Node2D = layers[k]
		n.position = n.position.lerp(-m * depth[k] * 20.0, 1.0 - exp(-delta * 4.0))
	# Camera: lean in on the object while an instrument is out; shake on impacts.
	var want := 1.0 if tool != "hand" and state == "open" else 0.0
	focus = lerpf(focus, want, 1.0 - exp(-delta * 5.0))
	cam.zoom = Vector2.ONE * zoom_base * (1.0 + 0.16 * focus)
	cam.position = CENTER.lerp(item.global_position + Vector2(0, -120), focus * 0.55)
	shake = maxf(0.0, shake - delta * 1.6)
	cam.offset = Vector2(randf_range(-1, 1), randf_range(-1, 1)) * shake * shake * 22.0
	# Light flicker.
	for f in flickers:
		var l: PointLight2D = f[0]
		var e: float = f[2]
		var s: float = f[4]
		var k := 1.0
		match f[3]:
			"lamp": k = 0.93 + 0.05 * sin(t * 13.0 + s) * sin(t * 7.3) + (-0.45 if randf() < 0.004 else 0.0)
			"tube": k = 0.0 if fmod(t + s, 9.0) < 0.18 and sin(t * 60.0) > 0.0 else 0.95 + 0.05 * sin(t * 2.0 + s)
			"pulse": k = 0.75 + 0.25 * sin(t * 1.6 + s)
			"beacon": k = 1.0 if sin(t * 2.4 + s) > 0.1 else 0.35
		if tool == "uv":
			k *= 0.35
		l.energy = e * k
		if f[1]:
			(f[1] as Sprite2D).self_modulate.a = clampf(k, 0.0, 1.2)
	# Instruments follow the pointer.
	var p := pointer()
	lens.position = lens.position.lerp(layers.fg.to_local(p), 1.0 - exp(-delta * 18.0))
	wand.position = wand.position.lerp(layers.fg.to_local(p), 1.0 - exp(-delta * 18.0))
	uv_light.global_position = wand.global_position
	var mat := item.mat
	mat.set_shader_parameter("lens_pos", lens.global_position if lens.visible else Vector2(-9999, -9999))
	mat.set_shader_parameter("lens_r", 120.0 if lens.visible else 0.0)
	mat.set_shader_parameter("uv_pos", wand.global_position if wand.visible else Vector2(-9999, -9999))
	mat.set_shader_parameter("uv_r", 230.0 if wand.visible else 0.0)
	var rm := item.serial.material as ShaderMaterial
	rm.set_shader_parameter("uv_pos", wand.global_position if wand.visible else Vector2(-9999, -9999))
	rm.set_shader_parameter("uv_r", 230.0 if wand.visible else 0.0)
	# Evidence: hold the instrument over the right spot.
	var target := -1.0
	if state == "open" and item.visible and not item.busy:
		if tool == "lens" and not item.back and not evidence.has("seam"):
			target = lens.global_position.distance_to(item.uv_global(SEAM_UV))
		elif tool == "uv" and item.back and not evidence.has("serial"):
			target = wand.global_position.distance_to(item.serial_center())
	if target >= 0.0 and target < 75.0:
		progress += delta / 0.9
		if progress >= 1.0:
			_find("seam" if tool == "lens" else "serial")
	else:
		progress = maxf(0.0, progress - delta * 2.0)
	(ring as ProgressRing).value = progress if tool == "lens" else 0.0
	(wand.get_node("ring") as ProgressRing).value = progress if tool == "uv" else 0.0
	# Hover feedback on the object and the bell.
	var over_item: bool = state == "open" and tool == "hand" and item.visible and item.contains(p)
	item.hover = lerpf(item.hover, 1.0 if over_item or item.dragging else 0.0, 1.0 - exp(-delta * 12.0))
	if item.dragging:
		item.drag_to(p)
	if pointer_override == null:
		var over_bell := bell.hit_test(p)
		Input.set_default_cursor_shape(Input.CURSOR_DRAG if item.dragging else Input.CURSOR_POINTING_HAND if over_item or (over_bell and state == "idle") else Input.CURSOR_CROSS if tool != "hand" else Input.CURSOR_ARROW)
	customer.look = clampf((p.x - customer.global_position.x) / 700.0, -1.0, 1.0)
	# Speech bubble tracks the visitor's mouth; HUD cash rolls.
	var mouth := get_viewport().get_canvas_transform() * customer.mouth()
	bubble.position = bubble.position.lerp(mouth + Vector2(40, -bubble.size.y - 10), 1.0 - exp(-delta * 10.0))
	shown_cash = lerpf(shown_cash, float(cash), 1.0 - exp(-delta * 8.0))
	cash_label.text = "%d Cr" % roundi(shown_cash)

# ---------------------------------------------------------------- capture

## `godot -- --capture=DIR` plays a scripted session and saves screenshots.
func _capture(dir: String) -> void:
	DirAccess.make_dir_recursive_absolute(dir)
	pointer_override = Vector2(960, 560)
	var shot := func(name: String):
		await RenderingServer.frame_post_draw
		get_viewport().get_texture().get_image().save_png("%s/%s.png" % [dir, name])
		print("captured ", name)
	await get_tree().create_timer(1.5).timeout
	await shot.call("01_idle")
	pointer_override = bell.global_position + Vector2(0, -26)
	_press(pointer_override)
	await get_tree().create_timer(1.0).timeout
	await shot.call("02_walk_in")
	await get_tree().create_timer(2.6).timeout
	await shot.call("03_arrived")
	_set_tool("lens")
	pointer_override = item.uv_global(SEAM_UV) + Vector2(-90, -40)
	await get_tree().create_timer(0.6).timeout
	await shot.call("04_lens_search")
	pointer_override = item.uv_global(SEAM_UV)
	await get_tree().create_timer(1.6).timeout
	await shot.call("05_lens_found")
	_set_tool("hand")
	_flip()
	await get_tree().create_timer(0.8).timeout
	_set_tool("uv")
	pointer_override = item.serial_center()
	await get_tree().create_timer(1.6).timeout
	await shot.call("06_uv_found")
	_set_tool("hand")
	terminal.knob.set_value(60)
	_on_offer(60)
	await get_tree().create_timer(1.2).timeout
	await shot.call("07_lowball")
	terminal.knob.set_value(90)
	_on_offer(90)
	await get_tree().create_timer(0.45).timeout
	await shot.call("08_bills")
	await get_tree().create_timer(1.6).timeout
	await shot.call("09_receipt")
	await get_tree().create_timer(3.0).timeout
	await shot.call("10_end")
	get_tree().quit()


## Real input path: synthesised mouse events go through GUI and _unhandled_input.
func _drag_test(dir: String) -> void:
	DirAccess.make_dir_recursive_absolute(dir)
	var ct := func(w: Vector2) -> Vector2: return get_viewport().get_canvas_transform() * w
	var send := func(pos: Vector2, pressed: Variant) -> void:
		if pressed == null:
			var mm := InputEventMouseMotion.new()
			mm.position = pos
			mm.global_position = pos
			mm.button_mask = MOUSE_BUTTON_MASK_LEFT
			Input.parse_input_event(mm)
		else:
			var mb := InputEventMouseButton.new()
			mb.button_index = MOUSE_BUTTON_LEFT
			mb.pressed = pressed
			mb.position = pos
			mb.global_position = pos
			Input.parse_input_event(mb)
	await get_tree().create_timer(1.0).timeout
	send.call(ct.call(bell.global_position + Vector2(0, -26)), true)
	send.call(ct.call(bell.global_position + Vector2(0, -26)), false)
	await get_tree().create_timer(4.5).timeout
	print("state after bell: ", state)
	var a: Vector2 = ct.call(item.global_position)
	send.call(a, true)
	await get_tree().process_frame
	print("dragging=", item.dragging)
	for i in 20:
		send.call(a.lerp(a + Vector2(-300, -40), i / 19.0), null)
		await get_tree().process_frame
	await get_tree().create_timer(0.4).timeout
	await RenderingServer.frame_post_draw
	get_viewport().get_texture().get_image().save_png(dir + "/drag_hold.png")
	send.call(a + Vector2(-300, -40), false)
	await get_tree().create_timer(0.8).timeout
	print("item now at ", item.global_position)
	await RenderingServer.frame_post_draw
	get_viewport().get_texture().get_image().save_png(dir + "/drag_drop.png")
	get_tree().quit()


class ProgressRing extends Node2D:
	var value := 0.0
	var radius := 132.0
	func _process(_d: float) -> void:
		queue_redraw()
	func _draw() -> void:
		if value <= 0.01:
			return
		draw_arc(Vector2.ZERO, radius, -PI * 0.5, -PI * 0.5 + TAU * value, 48, Color(1, 0.75, 0.4, 0.9), 6.0, true)


class Traffic extends Node2D:
	## Barges crossing the window and twinkling stars, drawn behind the glass clip.
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
			var d := 1.0 if randf() < 0.5 else -1.0
			ships.append({"p": 0.0, "dir": d, "y": randf_range(0.25, 0.75), "s": randf_range(0.8, 1.6), "v": randf_range(0.05, 0.09)})
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
			if sin(t * 6.0 + s.y * 9.0) > 0.3:
				draw_circle(Vector2(x + d * 24 * k, y), 1.8 * k, Color(1.0, 0.35, 0.3))
