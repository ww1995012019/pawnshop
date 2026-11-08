class_name UIKit
## One visual language for every screen: colours, spacing, panels, keys, icons,
## and item/character art lookup. Layouts use containers so edges line up.

const BG := Color("0b1118")
const PLATE := Color(0.075, 0.082, 0.09, 0.97)
const PLATE_EDGE := Color("58615f")
const INSET := Color(0.035, 0.042, 0.047, 0.97)
const AMBER := Color("ffc27a")
const AMBER_DEEP := Color("8a5226")
const CYAN := Color("7fe6dc")
const TEXT := Color("ece7d9")
const MUTED := Color("9aa8a5")
const PAPER := Color("eee5d0")
const INK := Color("2a241c")
const RUST := Color("9a4a1f")
const DANGER := Color("d98a78")
const GOOD := Color("98d6a8")
const GAP := 12
const PAD := 20

const HUD_ICONS := ["credits", "energy", "day", "settings", "handbook", "alert", "soundOn", "soundOff",
	"counter", "inspect", "repair", "warehouse", "orders", "report", "close", "speech",
	"check", "lock", "save", "rotate", "flip", "recentre", "plus", "minus",
	"help", "next", "tip", "goal"]

static var font: Font
static var mono: Font
static var _cache := {}

static func ensure() -> void:
	if font == null:
		font = load("res://assets/fonts/orbital-sans.ttf")
		mono = load("res://assets/fonts/orbital-mono.ttf")

# ---------------------------------------------------------------- styles

static func box(fill: Color, edge := Color.TRANSPARENT, radius := 8, border := 2, pad := PAD, shadow := 10) -> StyleBoxFlat:
	var s := StyleBoxFlat.new()
	s.bg_color = fill
	s.border_color = edge
	s.set_border_width_all(border if edge.a > 0.0 else 0)
	s.set_corner_radius_all(radius)
	s.shadow_color = Color(0, 0, 0, 0.45)
	s.shadow_size = shadow
	s.shadow_offset = Vector2(0, 3)
	s.set_content_margin_all(pad)
	s.anti_aliasing = true
	return s

static func plate_style() -> StyleBoxFlat:
	var s := box(PLATE, PLATE_EDGE, 2, 2, PAD, 8)
	# A small bevel reads as a painted metal rim without increasing the panel's
	# padding or obscuring its content.
	s.border_blend = true
	return s

static func inset_style(pad := 14) -> StyleBoxFlat:
	return box(INSET, Color("394443"), 2, 1, pad, 0)

static func paper_style(pad := 18) -> StyleBoxFlat:
	return box(PAPER, Color("a8987a"), 4, 1, pad, 8)

static func key_style(kind: String, state: String) -> StyleBoxFlat:
	var fill := {"primary": AMBER_DEEP, "secondary": Color("1f2a30"), "danger": Color("3d2a28"), "good": Color("1f3a33"), "chip": Color("16201f")}.get(kind, Color("1f2a30")) as Color
	var edge := {"primary": Color("f0b56a"), "secondary": Color("66777a"), "danger": Color("b47a6c"), "good": Color("6fc0a6"), "chip": Color("3d4c4b")}.get(kind, Color("66777a")) as Color
	match state:
		"hover":
			fill = fill.lightened(0.13)
			edge = edge.lightened(0.2)
		"pressed":
			fill = fill.darkened(0.25)
		"disabled":
			fill = Color("12181b")
			edge = Color("2c3537")
	var s := box(fill, edge, 2, 1, 0, 3 if state != "pressed" else 1)
	s.border_width_bottom = 1 if state == "pressed" else 3
	s.content_margin_left = 12
	s.content_margin_right = 12
	s.content_margin_top = 6 + (1 if state == "pressed" else 0)
	s.content_margin_bottom = 6
	return s

static func build_theme() -> Theme:
	ensure()
	var t := Theme.new()
	t.default_font = font
	t.default_font_size = 22
	t.set_color("font_color", "Label", TEXT)
	t.set_stylebox("panel", "PanelContainer", plate_style())
	t.set_stylebox("panel", "Panel", plate_style())
	for st in ["normal", "hover", "pressed", "disabled", "focus"]:
		var s := key_style("secondary", st if st != "focus" else "hover")
		if st == "focus":
			s.draw_center = false
			s.border_color = AMBER
			s.set_border_width_all(2)
			s.set_expand_margin_all(3)
		t.set_stylebox(st, "Button", s)
	t.set_color("font_color", "Button", TEXT)
	t.set_color("font_hover_color", "Button", Color.WHITE)
	t.set_color("font_pressed_color", "Button", AMBER)
	t.set_color("font_disabled_color", "Button", Color("5f6766"))
	t.set_font_size("font_size", "Button", 22)
	t.set_stylebox("panel", "TooltipPanel", box(Color("16110c"), Color("e0a16c"), 6, 1, 10, 4))
	t.set_color("font_color", "TooltipLabel", Color("f4e7cf"))
	t.set_font_size("font_size", "TooltipLabel", 18)
	var grab := box(AMBER, Color("3a2412"), 10, 2, 0, 2)
	t.set_stylebox("grabber_area", "HSlider", box(Color("8a5226"), Color.TRANSPARENT, 4, 0, 0, 0))
	t.set_stylebox("slider", "HSlider", box(Color("101618"), Color("2f3b3c"), 4, 1, 4, 0))
	t.set_stylebox("panel", "ScrollContainer", StyleBoxEmpty.new())
	t.set_stylebox("normal", "OptionButton", key_style("secondary", "normal"))
	t.set_stylebox("hover", "OptionButton", key_style("secondary", "hover"))
	t.set_stylebox("pressed", "OptionButton", key_style("secondary", "pressed"))
	t.set_stylebox("panel", "PopupMenu", box(Color("121a1d"), PLATE_EDGE, 6, 1, 6, 8))
	t.set_font_size("font_size", "PopupMenu", 20)
	t.set_constant("separation", "VBoxContainer", GAP)
	t.set_constant("separation", "HBoxContainer", GAP)
	t.set_constant("h_separation", "GridContainer", GAP)
	t.set_constant("v_separation", "GridContainer", GAP)
	var _unused := grab
	return t

# ---------------------------------------------------------------- widgets

static func label(text: String, size := 22, color := TEXT, is_mono := false, wrap := false) -> Label:
	ensure()
	var l := Label.new()
	l.text = text
	l.add_theme_font_size_override("font_size", size)
	l.add_theme_color_override("font_color", color)
	if is_mono:
		l.add_theme_font_override("font", mono)
	if wrap:
		l.autowrap_mode = TextServer.AUTOWRAP_ARBITRARY
	return l

static func button(text: String, kind := "secondary", min_size := Vector2(0, 58), size := 22, icon_name := "") -> Button:
	var b := Button.new()
	b.text = text
	b.custom_minimum_size = min_size
	b.focus_mode = Control.FOCUS_ALL
	b.add_theme_font_size_override("font_size", size)
	for st in ["normal", "hover", "pressed", "disabled"]:
		b.add_theme_stylebox_override(st, key_style(kind, st))
	if kind == "primary":
		b.add_theme_color_override("font_color", Color("fff1dc"))
	if icon_name != "":
		b.icon = icon(icon_name)
		b.expand_icon = true
		b.add_theme_constant_override("icon_max_width", 34)
	b.mouse_entered.connect(func(): _button_rest_feedback(b))
	b.mouse_exited.connect(func(): _button_rest_feedback(b))
	b.focus_entered.connect(func(): _button_rest_feedback(b))
	b.focus_exited.connect(func(): _button_rest_feedback(b))
	b.button_down.connect(func(): _button_feedback(b, Vector2(0.98, 0.97), Color.WHITE))
	b.button_up.connect(func(): _button_rest_feedback(b))
	return b

static func _button_rest_feedback(b: Button) -> void:
	var active := not b.disabled and (b.is_hovered() or b.has_focus())
	_button_feedback(b, Vector2.ONE, Color(1.08, 1.08, 1.08) if active else Color.WHITE)

## Replace an in-flight tween so rapid hover and press changes cannot leave a
## key stuck at the wrong scale. Reduced motion keeps the static theme states.
static func _button_feedback(b: Button, target_scale: Vector2, target_color: Color) -> void:
	var previous: Tween = b.get_meta("feedback_tween") if b.has_meta("feedback_tween") else null
	if previous != null and previous.is_valid():
		previous.kill()
	if Game.prefs.reduced_motion:
		b.scale = Vector2.ONE
		b.modulate = Color.WHITE
		return
	b.pivot_offset = b.size * 0.5
	var tw := b.create_tween().set_parallel(true)
	b.set_meta("feedback_tween", tw)
	tw.tween_property(b, "scale", target_scale, 0.12).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)
	tw.tween_property(b, "modulate", target_color, 0.12).set_trans(Tween.TRANS_SINE).set_ease(Tween.EASE_OUT)

static func plate(style: StyleBox = null) -> PanelContainer:
	var p: PanelContainer = IndustrialPlate.new() if style == null else PanelContainer.new()
	p.add_theme_stylebox_override("panel", style if style != null else plate_style())
	return p

## The details stay in the rim, leaving the panel's content and hit area
## untouched. Integer coordinates and square corners echo the shop's hardware.
class IndustrialPlate extends PanelContainer:
	func _draw() -> void:
		if size.x < 48 or size.y < 36:
			return
		var highlight := Color("77847c")
		highlight.a = 0.65
		var dark := Color("090d10")
		var screw := Color("ad9978")
		screw.a = 0.75
		draw_line(Vector2(14, 4), Vector2(size.x - 14, 4), highlight, 1.0)
		draw_line(Vector2(14, size.y - 4), Vector2(size.x - 14, size.y - 4), dark, 1.0)
		for pt in [Vector2(7, 7), Vector2(size.x - 7, 7), Vector2(7, size.y - 7), Vector2(size.x - 7, size.y - 7)]:
			draw_rect(Rect2(pt - Vector2(2, 2), Vector2(4, 4)), dark)
			draw_rect(Rect2(pt - Vector2(1, 1), Vector2(2, 2)), screw)

static func vbox(sep := GAP) -> VBoxContainer:
	var v := VBoxContainer.new()
	v.add_theme_constant_override("separation", sep)
	return v

static func hbox(sep := GAP) -> HBoxContainer:
	var h := HBoxContainer.new()
	h.add_theme_constant_override("separation", sep)
	return h

static func grid(cols: int, sep := GAP) -> GridContainer:
	var g := GridContainer.new()
	g.columns = cols
	g.add_theme_constant_override("h_separation", sep)
	g.add_theme_constant_override("v_separation", sep)
	return g

static func spacer(v := true) -> Control:
	var c := Control.new()
	if v:
		c.size_flags_vertical = Control.SIZE_EXPAND_FILL
	else:
		c.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	return c

static func rule() -> ColorRect:
	var r := ColorRect.new()
	r.color = Color(0.64, 0.54, 0.39, 0.38)
	r.custom_minimum_size = Vector2(0, 1)
	return r

static func clear(n: Node) -> void:
	for c in n.get_children():
		n.remove_child(c)
		c.queue_free()

static func money(n) -> String:
	return "%s Cr" % Model.jnum(n)

static func pct(n: float) -> String:
	return "%d%%" % roundi(n * 100)

# ---------------------------------------------------------------- art

static func tex(path: String) -> Texture2D:
	if not _cache.has(path):
		_cache[path] = load(path)
	return _cache[path]

static func icon(name: String) -> AtlasTexture:
	var key := "icon:" + name
	if _cache.has(key):
		return _cache[key]
	var i := HUD_ICONS.find(name)
	var a := AtlasTexture.new()
	a.atlas = tex("res://assets/ui/orbital-hud.png")
	a.region = Rect2((i % 8) * 128, (i / 8) * 128, 128, 128)
	_cache[key] = a
	return a

## Atlas key and pixel region of an item face.
static func item_cell(def_id: String, back := false) -> Dictionary:
	var art = GameData.art.get(def_id, GameData.art.get("ITM-026"))
	var key: String = art.back if back else art.front
	var img := tex("res://assets/atlas/%s.png" % key)
	var cw := img.get_width() / float(art.columns)
	var ch := img.get_height() / float(art.rows)
	var inset: float = art.inset
	var x := (int(art.index) % int(art.columns)) * cw
	var y := (int(art.index) / int(art.columns)) * ch
	return {"key": key, "region": Rect2(x + cw * inset, y + ch * inset, cw * (1 - inset * 2), ch * (1 - inset * 2))}

static func item_icon(def_id: String, back := false) -> AtlasTexture:
	var key := "item:%s:%s" % [def_id, back]
	if _cache.has(key):
		return _cache[key]
	var c := item_cell(def_id, back)
	var a := AtlasTexture.new()
	a.atlas = tex("res://assets/atlas/%s.png" % c.key)
	a.region = c.region
	_cache[key] = a
	return a

## Lit (normal-mapped) atlas for world sprites; pair with item_cell().region.
static func lit_atlas(key: String) -> CanvasTexture:
	var k := "lit:" + key
	if _cache.has(k):
		return _cache[k]
	var c := CanvasTexture.new()
	c.diffuse_texture = tex("res://assets/atlas/%s.png" % key)
	c.normal_texture = tex("res://assets/atlas/%s_n.png" % key)
	c.specular_color = Color(0.45, 0.45, 0.45)
	c.specular_shininess = 0.6
	_cache[k] = c
	return c

## Portrait cell for an NPC and mood; moods exist for the first five residents.
static func npc_cell(npc_id: String, mood := "neutral") -> Dictionary:
	var n := GameData.npc(npc_id)
	var key := "orbital-characters"
	var cols := 5
	var rows := 1
	var index := int(n.get("sprite", 0))
	if n.has("art") and n.art != null:
		key = n.art.key
		cols = n.art.columns
		rows = n.art.rows
		index = n.art.index
	elif mood != "neutral":
		key = "orbital-characters-%s" % mood
	var img := tex("res://assets/atlas/%s.png" % key)
	var cw := img.get_width() / float(cols)
	var ch := img.get_height() / float(rows)
	var inset := 0.012
	return {"key": key, "region": Rect2((index % cols) * cw + cw * inset, (index / cols) * ch + ch * inset, cw * (1 - inset * 2), ch * (1 - inset * 2))}

static func npc_icon(npc_id: String) -> AtlasTexture:
	var c := npc_cell(npc_id)
	var a := AtlasTexture.new()
	a.atlas = tex("res://assets/atlas/%s.png" % c.key)
	var r: Rect2 = c.region
	a.region = Rect2(r.position + Vector2(r.size.x * 0.18, r.size.y * 0.04), Vector2(r.size.x * 0.64, r.size.x * 0.64))
	return a

static func tool_icon(tool_id: String) -> AtlasTexture:
	var key := "tool:" + tool_id
	if _cache.has(key):
		return _cache[key]
	var i := int(tool_id.substr(4)) - 1
	var a := AtlasTexture.new()
	a.atlas = tex("res://assets/atlas/orbital-tools.png")
	a.region = Rect2((i % 3) * 512 + 20, (i / 3) * 512 + 20, 472, 472)
	_cache[key] = a
	return a
