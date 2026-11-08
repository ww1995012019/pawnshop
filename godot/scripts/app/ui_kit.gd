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
		# The digital face has Latin glyphs only. Fall back to the sans face so
		# receipts, instrument read-outs and UV marks never render CJK as boxes.
		var digits := FontVariation.new()
		digits.base_font = load("res://assets/fonts/orbital-mono.ttf")
		digits.fallbacks = [font]
		mono = digits

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

# ---------------------------------------------------------------- skin
# Painted nine-patch surfaces (tools/make_ui_skin.py): riveted metal plates,
# a copper key, a heavy socket frame, thermal paper and a CRT glass.

const SKIN_SCALE := {"lg": 0.45, "sm": 0.2, "xs": 0.13}
## Rim (texture margin) and transparent outer edge of each 512 px source cell.
const SKIN_CAP := {"glass": 84, "strip": 70, "amber": 84, "graphite": 84, "socket": 96, "rail": 70, "paper": 40, "screen": 76}
const SKIN_EDGE := {"glass": 22, "strip": 22, "amber": 22, "graphite": 22, "socket": 22, "rail": 22, "paper": 8, "screen": 6}

## Painted rim thickness per side (left, top, right, bottom) in the 512 px
## source cell, measured from the art. The nine-patch border must cover the
## whole rim, or part of the decoration lands in the stretched centre and the
## plate looks warped as it grows.
const SKIN_RIM := {"glass": [49, 50, 41, 63], "strip": [27, 32, 27, 53], "amber": [46, 58, 54, 70],
	"graphite": [53, 44, 44, 69], "socket": [74, 74, 74, 97], "rail": [30, 54, 38, 83],
	"paper": [9, 9, 9, 9], "screen": [41, 41, 41, 49]}

static func skin(name: String, size := "lg", pad := -1.0, tint := Color.WHITE) -> StyleBoxTexture:
	var s := StyleBoxTexture.new()
	s.texture = tex("res://assets/ui/skin/%s_%s.png" % [name, size])
	var k: float = SKIN_SCALE[size]
	var rim: Array = SKIN_RIM[name]
	var sides := [SIDE_LEFT, SIDE_TOP, SIDE_RIGHT, SIDE_BOTTOM]
	for i in 4:
		# Border: the full rim (and at least the corner ornament), so only
		# plain plate is ever stretched.
		s.set_texture_margin(sides[i], ceilf(maxf(float(SKIN_CAP[name]), float(rim[i]) + 6.0) * k))
		# Content: clear of the rim on that side, never less than asked for.
		var inner := ceilf(float(rim[i]) * k) + 6.0
		s.set_content_margin(sides[i], maxf(inner, pad) if pad >= 0.0 else inner + 6.0)
	s.modulate_color = tint
	return s

static func plate_style() -> StyleBox:
	return skin("rail", "lg", PAD + 6)

static func inset_style(pad := 14) -> StyleBox:
	return skin("socket", "xs", pad)

static func paper_style(pad := 18) -> StyleBox:
	return skin("paper", "sm", pad)

static func screen_style(pad := 10) -> StyleBox:
	return skin("screen", "sm", pad)

const KEY_SKIN := {"primary": "amber", "secondary": "graphite", "danger": "graphite", "good": "glass", "chip": "socket"}
const KEY_TINT := {"primary": Color(1, 1, 1), "secondary": Color(0.92, 0.95, 1.0), "danger": Color(1.25, 0.72, 0.66), "good": Color(0.8, 1.2, 0.95), "chip": Color(1, 1, 1)}

## compact: icon-only keys and small tiles use the thin xs rim and tight
## padding, so the icon or label fills the key instead of a heavy frame.
static func key_style(kind: String, state: String, compact := false) -> StyleBox:
	var tint: Color = KEY_TINT.get(kind, Color.WHITE)
	match state:
		"hover":
			tint = tint * Color(1.18, 1.18, 1.18)
		"pressed":
			tint = tint * Color(0.78, 0.78, 0.78)
		"disabled":
			tint = Color(0.42, 0.44, 0.46, 0.85)
	var s := skin(KEY_SKIN.get(kind, "graphite"), "xs" if kind == "chip" or compact else "sm", 0.0, tint)
	s.content_margin_left = 6 if compact else 16
	s.content_margin_right = 6 if compact else 16
	s.content_margin_top = 6 + (2 if state == "pressed" else 0)
	s.content_margin_bottom = 6 - (2 if state == "pressed" else 0)
	return s

static func focus_style() -> StyleBoxFlat:
	var s := box(Color.TRANSPARENT, AMBER, 4, 2, 0, 0)
	s.draw_center = false
	s.set_expand_margin_all(3)
	return s

static func build_theme() -> Theme:
	ensure()
	var t := Theme.new()
	t.default_font = font
	t.default_font_size = 22
	t.set_color("font_color", "Label", TEXT)
	t.set_stylebox("panel", "PanelContainer", plate_style())
	t.set_stylebox("panel", "Panel", plate_style())
	for st in ["normal", "hover", "pressed", "disabled"]:
		t.set_stylebox(st, "Button", key_style("secondary", st))
	t.set_stylebox("focus", "Button", focus_style())
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
		# Word-smart breaking keeps CJK punctuation off the start of a line
		# and numbers like "9–90" in one piece.
		l.autowrap_mode = TextServer.AUTOWRAP_WORD_SMART
	return l

static func button(text: String, kind := "secondary", min_size := Vector2(0, 58), size := 22, icon_name := "") -> Button:
	var b := Button.new()
	b.text = text
	b.custom_minimum_size = min_size
	b.focus_mode = Control.FOCUS_ALL
	b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	b.add_theme_font_size_override("font_size", size)
	var compact := text == ""
	for st in ["normal", "hover", "pressed", "disabled"]:
		b.add_theme_stylebox_override(st, key_style(kind, st, compact))
	if kind == "primary":
		# Cream lettering with a burnt outline stays legible on the copper key.
		for c in ["font_color", "font_hover_color", "font_focus_color"]:
			b.add_theme_color_override(c, Color("fff3df"))
		b.add_theme_color_override("font_pressed_color", Color("ffe2b8"))
		b.add_theme_color_override("font_outline_color", Color(0.22, 0.08, 0.0, 0.9))
		b.add_theme_constant_override("outline_size", 5)
	else:
		b.add_theme_color_override("font_outline_color", Color(0, 0, 0, 0.55))
		b.add_theme_constant_override("outline_size", 3)
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

## A settings row: the whole plate toggles, with a drawn switch at the right.
static func switch_row(text: String, on: bool, fn: Callable) -> Button:
	var b := Button.new()
	b.toggle_mode = true
	b.button_pressed = on
	b.text = text
	b.alignment = HORIZONTAL_ALIGNMENT_LEFT
	b.custom_minimum_size = Vector2(0, 62)
	b.focus_mode = Control.FOCUS_ALL
	b.mouse_default_cursor_shape = Control.CURSOR_POINTING_HAND
	b.add_theme_font_size_override("font_size", 21)
	for st in ["normal", "hover", "pressed", "disabled", "hover_pressed"]:
		var base := "hover" if st == "hover" or st == "hover_pressed" else "normal"
		var sb := key_style("chip", base)
		sb.content_margin_left = 20
		sb.content_margin_right = 100
		b.add_theme_stylebox_override(st, sb)
	for c in ["font_color", "font_hover_color", "font_pressed_color", "font_hover_pressed_color", "font_focus_color"]:
		b.add_theme_color_override(c, TEXT)
	var sw := SwitchKnob.new()
	sw.mouse_filter = Control.MOUSE_FILTER_IGNORE
	sw.set_anchors_preset(Control.PRESET_FULL_RECT)
	b.add_child(sw)
	b.toggled.connect(func(v: bool):
		sw.queue_redraw()
		fn.call(v))
	return b

class SwitchKnob extends Control:
	func _draw() -> void:
		var on: bool = (get_parent() as Button).button_pressed
		var r := Rect2(size.x - 88, size.y * 0.5 - 16, 64, 32)
		draw_style_box(UIKit.box(Color("8a5226") if on else Color("10171a"), Color("f0b56a") if on else Color("4b5a5a"), 16, 2, 0, 0), r)
		var knob := Vector2(r.end.x - 16 if on else r.position.x + 16, r.get_center().y)
		draw_circle(knob + Vector2(0, 2), 12, Color(0, 0, 0, 0.35))
		draw_circle(knob, 12, Color("fff3df") if on else Color("8b939a"))
		draw_string(UIKit.font, Vector2(r.position.x - 44, r.get_center().y + 7), "开" if on else "关", HORIZONTAL_ALIGNMENT_LEFT, -1, 18, UIKit.AMBER if on else UIKit.MUTED)

## Re-skin an existing key as compact (thin rim, tight padding).
static func compact(b: Button, kind := "secondary") -> void:
	for st in ["normal", "hover", "pressed", "disabled"]:
		b.add_theme_stylebox_override(st, key_style(kind, st, true))

static func plate(style: StyleBox = null) -> PanelContainer:
	var p := PanelContainer.new()
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
