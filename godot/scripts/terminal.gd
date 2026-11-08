class_name Terminal
extends Control
## The till: a curved CRT read-out rendered from a SubViewport, a brass offer
## dial you turn by dragging, and physical keys that travel when pressed.

signal offer(value: int)
signal accept
signal dismiss

var mono: Font = load("res://assets/fonts/orbital-mono.ttf")
var screen: SubViewport
var crt: TextureRect
var head: Label
var price: Label
var unit: Label
var info: Label
var patience_label: Label
var note: Label
var knob: Knob
var keys: Array[Button] = []
var shown_price := 0.0
var target_price := 0.0

func _init() -> void:
	size = Vector2(440, 560)
	var frame := NinePatchRect.new()
	frame.texture = load("res://assets/ui/orbital-ui-surfaces.png")
	frame.region_rect = Rect2(512, 512, 512, 512)
	frame.patch_margin_left = 96
	frame.patch_margin_right = 96
	frame.patch_margin_top = 96
	frame.patch_margin_bottom = 96
	frame.position = Vector2(-18, -18)
	frame.size = size + Vector2(36, 36)
	frame.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(frame)
	screen = SubViewport.new()
	screen.size = Vector2i(400, 220)
	screen.transparent_bg = false
	screen.render_target_update_mode = SubViewport.UPDATE_ALWAYS
	add_child(screen)
	var bg := ColorRect.new()
	bg.color = Color("041010")
	bg.size = Vector2(400, 220)
	screen.add_child(bg)
	head = _label("来客报价", Vector2(22, 14), 20, Color("7fe6dc"))
	price = _label("—", Vector2(18, 40), 78, Color("ffc27a"), true)
	unit = _label("Cr", Vector2(330, 74), 30, Color("ffc27a"), true)
	info = _label("", Vector2(22, 140), 19, Color("7fe6dc"))
	patience_label = _label("", Vector2(22, 176), 19, Color("ffb48a"))
	note = _label("", Vector2(210, 176), 19, Color("7fe6dc"))
	crt = TextureRect.new()
	crt.texture = screen.get_texture()
	crt.position = Vector2(20, 20)
	crt.size = Vector2(400, 220)
	var m := ShaderMaterial.new()
	m.shader = load("res://shaders/crt.gdshader")
	crt.material = m
	crt.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(crt)
	knob = Knob.new()
	knob.position = Vector2(20, 256)
	knob.size = Vector2(400, 150)
	knob.mono = mono
	add_child(knob)
	_key("出价", Vector2(20, 420), Vector2(196, 64), true, func(): offer.emit(knob.value))
	_key("接受报价", Vector2(224, 420), Vector2(196, 64), false, func(): accept.emit())
	_key("请回吧", Vector2(20, 492), Vector2(400, 48), false, func(): dismiss.emit())
	set_active(false)

func _label(text: String, pos: Vector2, size_px: int, color: Color, is_mono := false) -> Label:
	var l := Label.new()
	l.text = text
	l.position = pos
	l.add_theme_font_size_override("font_size", size_px)
	l.add_theme_color_override("font_color", color)
	if is_mono:
		l.add_theme_font_override("font", mono)
	screen.add_child(l)
	return l

func _style(fill: Color, edge: Color, pressed := false) -> StyleBoxFlat:
	var s := StyleBoxFlat.new()
	s.bg_color = fill
	s.border_color = edge
	s.set_border_width_all(2)
	s.border_width_bottom = 2 if pressed else 6
	s.set_corner_radius_all(8)
	s.shadow_color = Color(0, 0, 0, 0.55)
	s.shadow_size = 2 if pressed else 8
	s.shadow_offset = Vector2(0, 1 if pressed else 4)
	s.content_margin_top = 4 if pressed else 0
	return s

func _key(text: String, pos: Vector2, sz: Vector2, gold: bool, fn: Callable) -> void:
	var b := Button.new()
	b.text = text
	b.position = pos
	b.size = sz
	b.pivot_offset = sz * 0.5
	b.focus_mode = Control.FOCUS_NONE
	b.add_theme_font_size_override("font_size", 26 if sz.y > 50 else 22)
	var fill := Color("8a5226") if gold else Color("1f2b31")
	var edge := Color("f0b56a") if gold else Color("6f7d7f")
	b.add_theme_stylebox_override("normal", _style(fill, edge))
	b.add_theme_stylebox_override("hover", _style(fill.lightened(0.15), edge.lightened(0.2)))
	b.add_theme_stylebox_override("pressed", _style(fill.darkened(0.25), edge, true))
	b.add_theme_stylebox_override("disabled", _style(Color("151b1e"), Color("3a4446")))
	b.add_theme_color_override("font_color", Color("fff1dc") if gold else Color("e4e6df"))
	b.add_theme_color_override("font_disabled_color", Color("5f6766"))
	b.button_down.connect(func(): create_tween().tween_property(b, "scale", Vector2(0.96, 0.93), 0.05))
	b.button_up.connect(func(): create_tween().tween_property(b, "scale", Vector2.ONE, 0.16).set_trans(Tween.TRANS_BACK).set_ease(Tween.EASE_OUT))
	b.pressed.connect(fn)
	add_child(b)
	keys.append(b)

func set_active(on: bool) -> void:
	for k in keys:
		k.disabled = not on
	knob.enabled = on

func show_idle(text: String) -> void:
	head.text = "柜台待机"
	target_price = 0
	price.text = "----"
	unit.visible = false
	info.text = text
	patience_label.text = ""
	note.text = ""

func show_quote(ask: int, low: int, high: int, evidence: int, total: int, patience: int, remark := "") -> void:
	head.text = "来客报价"
	unit.visible = true
	target_price = ask
	info.text = "估值 %d–%d Cr · 物证 %d/%d" % [low, high, evidence, total]
	patience_label.text = "耐心 " + "●".repeat(patience) + "○".repeat(3 - patience)
	note.text = remark

func _process(delta: float) -> void:
	if unit.visible:
		shown_price = lerpf(shown_price, target_price, 1.0 - exp(-delta * 9.0))
		price.text = "%d" % roundi(shown_price)
