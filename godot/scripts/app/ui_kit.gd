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
	s.set_corner_radius_all(0)
	s.shadow_color = Color(0, 0, 0, 0.45)
	s.shadow_size = shadow
	s.shadow_offset = Vector2(0, 3)
	s.set_content_margin_all(pad)
	s.anti_aliasing = false
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

static func skin(name: String, size := "lg", pad := -1.0, tint := Color.WHITE) -> StyleBox:
	var fills := {"glass": Color("243d38"), "strip": Color("34362f"), "amber": Color("97653a"), "graphite": Color("3b4442"), "socket": Color("1a2525"), "rail": Color("2d3331"), "paper": Color("e8d9b7"), "screen": Color("142c29")}
	var edges := {"glass": Color("64877b"), "strip": Color("837961"), "amber": Color("d8a76a"), "graphite": Color("78877f"), "socket": Color("566960"), "rail": Color("9c8064"), "paper": Color("b09a73"), "screen": Color("5f8172")}
	var surface = load("res://scripts/ui/retro_surface.gd").new()
	surface.kind = name
	surface.fill = fills.get(name,PLATE)
	surface.edge = edges.get(name,PLATE_EDGE)
	surface.tint = tint
	surface.compact = size == "xs"
	surface.set_content_margin_all((18.0 if size == "lg" else 12.0 if size == "sm" else 8.0) if pad < 0 else pad)
	return surface

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
	t.set_color("font_disabled_color", "Button", Color("b9b0a1"))
	t.set_font_size("font_size", "Button", 22)
	t.set_stylebox("panel", "TooltipPanel", paper_style(12))
	t.set_color("font_color", "TooltipLabel", INK)
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
	b.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
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
		b.add_theme_constant_override("outline_size", 2)
	else:
		b.add_theme_color_override("font_outline_color", Color(0, 0, 0, 0.55))
		b.add_theme_constant_override("outline_size", 1)
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
	b.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
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
	p.texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	p.add_theme_stylebox_override("panel", style if style != null else plate_style())
	return p

## A small engraved heading; keeps hierarchy without adding another big panel.
static func module_header(title: String, subtitle := "", serial := "") -> VBoxContainer:
	var v := vbox(5)
	var row := hbox(10)
	var caption := label(title,22,AMBER,false,true)
	caption.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	row.add_child(caption)
	if serial != "": row.add_child(label(serial,14,MUTED,true))
	v.add_child(row)
	if subtitle != "": v.add_child(label(subtitle,16,MUTED,false,true))
	v.add_child(rule())
	return v

static func record_card(title: String, text: String, serial := "", tone := "paper") -> PanelContainer:
	var paper := tone == "paper"
	var card := plate(paper_style(14) if paper else screen_style(14))
	# Passive receipt faces must let touch drags reach their enclosing scroller.
	card.mouse_filter = Control.MOUSE_FILTER_PASS
	var v := vbox(7)
	var row := hbox(8)
	var heading := label(title,17,RUST if paper else CYAN,false,true)
	heading.size_flags_horizontal = Control.SIZE_EXPAND_FILL
	row.add_child(heading)
	if serial != "": row.add_child(label(serial,13,Color("897551") if paper else MUTED,true))
	v.add_child(row)
	var line := ColorRect.new()
	line.color = Color(0.40,0.29,0.16,.22) if paper else Color(.37,.58,.49,.35)
	line.custom_minimum_size.y = 1
	line.mouse_filter = Control.MOUSE_FILTER_IGNORE
	v.add_child(line)
	v.add_child(label(text,18,INK if paper else TEXT,false,true))
	card.add_child(v)
	return card

static func note_card(title: String, text: String, tone := "screen") -> PanelContainer:
	return record_card(title,text,"",tone)

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
	GameData.ensure()
	var art: Dictionary = GameData.art.get(def_id, GameData.art["WCH-001"])
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
	var pixel_item := key.begins_with("watches-") or key.begins_with("shop-residents") or key.begins_with("orbital-items-") or key.begins_with("orbital-expansion-") or key.begins_with("orbital-annex-")
	c.specular_color = Color(0.05, 0.05, 0.05) if pixel_item else Color(0.45, 0.45, 0.45)
	c.specular_shininess = 0.1 if pixel_item else 0.6
	_cache[k] = c
	return c

## Instance logo variants are baked into the same lit body texture, so the mark
## receives identical light, normal mapping and instrument shader effects.
static func watch_variant_texture(def_id: String) -> CanvasTexture:
	var key := "watch-variant:" + def_id
	if _cache.has(key):
		return _cache[key]
	GameData.ensure()
	var art: Dictionary = GameData.art.get(def_id, GameData.art["WCH-001"])
	var atlas: Image = tex("res://assets/atlas/%s.png" % art.front).get_image()
	var cell_size := Vector2i(atlas.get_width() / int(art.columns), atlas.get_height() / int(art.rows))
	var index := int(art.index)
	var source_rect := Rect2i(Vector2i(index % int(art.columns), index / int(art.columns)) * cell_size, cell_size)
	var image := atlas.get_region(source_rect)
	var background := image.get_pixel(104, 88)
	var first: Array = WatchLogo.pixels(def_id, 0)[0]
	var ink := image.get_pixel(104 + int(first[0]) * 2, 88 + int(first[1]) * 2)
	image.fill_rect(Rect2i(104, 88, 48, 32), background)
	for pixel in WatchLogo.pixels(def_id, 1):
		image.fill_rect(Rect2i(104 + int(pixel[0]) * 2, 88 + int(pixel[1]) * 2, 2, 2), ink)
	var canvas := CanvasTexture.new()
	canvas.diffuse_texture = ImageTexture.create_from_image(image)
	var normal := tex("res://assets/atlas/%s_n.png" % art.front).get_image().get_region(source_rect)
	canvas.normal_texture = ImageTexture.create_from_image(normal)
	canvas.specular_color = Color(0.05, 0.05, 0.05)
	canvas.specular_shininess = 0.1
	_cache[key] = canvas
	return canvas

## Portrait cell for an NPC and mood; moods exist for the first five residents.
static func npc_cell(npc_id: String, _mood := "neutral") -> Dictionary:
	var index := maxi(int(npc_id.trim_prefix("CHR-")) - 1, 0)
	if index >= 13 and index < 33:
		index -= 13
		return {"key":"shop-residents-new","region":Rect2(index % 5 * 256,index / 5 * 256,256,256)}
	if index >= 9 and index < 13:
		index -= 9
		return {"key": "shop-residents-extra", "region": Rect2((index % 2) * 256, (index / 2) * 256, 256, 256)}
	index = mini(index, 8)
	return {"key": "shop-residents", "region": Rect2((index % 3) * 256, (index / 3) * 256, 256, 256)}

## Square headshot from the top of the portrait (always drawn square, so
## containers never stretch it).
static func npc_icon(npc_id: String) -> AtlasTexture:
	var key := "npc_icon:" + npc_id
	if _cache.has(key):
		return _cache[key]
	var c := npc_cell(npc_id)
	var a := AtlasTexture.new()
	a.atlas = tex("res://assets/atlas/%s.png" % c.key)
	var r: Rect2 = c.region
	var side := r.size.x * 0.56
	a.region = Rect2(r.position + Vector2((r.size.x - side) * 0.5, r.size.y * 0.03), Vector2(side, side))
	_cache[key] = a
	return a

## The whole painted portrait of a resident.
static func npc_portrait(npc_id: String) -> AtlasTexture:
	var c := npc_cell(npc_id)
	var a := AtlasTexture.new()
	a.atlas = tex("res://assets/atlas/%s.png" % c.key)
	a.region = c.region
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

## Player-facing presentation follows the installed shell, never an unfinished target.
## These helpers do not change item truth or disclose anything to a visitor.
static func presentation_id(it: Dictionary) -> String:
	return WatchForgery.appearance_id(it)

static func presentation_tier(it: Dictionary) -> String:
	return String(GameData.def(presentation_id(it)).get("tier", ""))

## Completed treatments remain player knowledge after parts are removed/restored.
static func is_modified(it: Dictionary) -> bool:
	return not WatchForgery.treatments(it).is_empty()

## Small corner marks leave the physical silhouette and selection glow untouched.
## Safe to call again when an item changes; the decoration never consumes input.
static func decorate_item(control: Control, it: Dictionary, side := 18.0) -> void:
	var id := presentation_id(it)
	var modified := is_modified(it)
	var signature := "%s:%s:%s" % [id, modified, side]
	if control.get_meta("item_decoration_signature", "") == signature: return
	control.set_meta("item_decoration_signature", signature)
	var previous := control.get_node_or_null("item_decoration")
	if previous != null:
		control.remove_child(previous)
		previous.queue_free()
	var marks := Control.new()
	marks.name = "item_decoration"
	marks.mouse_filter = Control.MOUSE_FILTER_IGNORE
	control.add_child(marks)
	marks.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	if presentation_tier(it) in ["luxury","ultra"]:
		var crest := tier_badge(id, side)
		crest.name = "tier_crest"
		marks.add_child(crest)
		crest.set_anchors_preset(Control.PRESET_TOP_RIGHT)
		crest.offset_left = -side - 2
		crest.offset_top = 2
		crest.offset_right = -2
		crest.offset_bottom = side + 2
	if modified:
		var badge := label("改", roundi(side), AMBER)
		badge.name = "modified_badge"
		badge.mouse_filter = Control.MOUSE_FILTER_IGNORE
		badge.add_theme_color_override("font_outline_color", Color("101618"))
		badge.add_theme_constant_override("outline_size", 5)
		marks.add_child(badge)
		badge.set_anchors_preset(Control.PRESET_BOTTOM_LEFT)
		badge.offset_left = 3
		badge.grow_vertical = Control.GROW_DIRECTION_BEGIN
		badge.offset_top = -ceilf(side * 1.6) - 4
		badge.offset_right = side + 7
		badge.offset_bottom = -2

## The same decorative crest is used on the physical luxury model and its cards.
static func tier_badge(def_id: String, side := 24.0) -> Control:
	var badge := WatchLogo.new()
	badge.setup_crest(def_id, side)
	return badge

static func wanted_portrait(profile: Dictionary) -> AtlasTexture:
	if profile.get("npcId", "") != "": return npc_icon(profile.npcId)
	var index := int(profile.get("faceIndex",0))
	var face := AtlasTexture.new()
	face.atlas = tex("res://assets/atlas/wanted-faces.png")
	face.region = Rect2(index % 8 * 160,index / 8 * 160,160,160)
	return face

## A target's shell and a separately painted mark never replace the true item ID.
static func physical_texture(it: Dictionary, back := false) -> CanvasTexture:
	var shell_id := WatchForgery.appearance_id(it)
	var logo_id := WatchForgery.logo_id(it)
	var variant := WatchRules.logo_variant(it)
	var strap_id := shell_id
	if WatchForgery.target_active(it,"case"):
		strap_id=String(it.defId) if WatchForgery.treatments(it).case.get("strap_removed",false) else WatchForgery.target_id(it)
	var key := "physical:"+JSON.stringify([shell_id,strap_id,logo_id,variant,back])
	if _cache.has(key): return _cache[key]
	var cell := item_cell(shell_id,back)
	var atlas: Image=tex("res://assets/atlas/%s.png" % cell.key).get_image()
	var start := Vector2i(cell.region.position-Vector2.ONE*8.96)
	var image := atlas.get_region(Rect2i(start,Vector2i(256,256)))
	if strap_id!=shell_id:
		var strap_cell := item_cell(strap_id,back)
		var strap_atlas: Image=tex("res://assets/atlas/%s.png" % strap_cell.key).get_image()
		var strap_start := Vector2i(strap_cell.region.position-Vector2.ONE*8.96)
		# Authored new cases/lugs begin at y54; preserve the shipped33 blend contract.
		var strap_top := 54 if int(GameData.def(shell_id).sprite)>=33 else 65
		for band in [Rect2i(0,0,256,strap_top),Rect2i(0,206,256,50)]:
			image.blit_rect(strap_atlas,Rect2i(strap_start+band.position,band.size),band.position)
	if not back:
		var background := image.get_pixel(104,88)
		var mark: Array=WatchLogo.pixels(shell_id,0)
		var first: Array=mark[0]
		var ink := image.get_pixel(104+int(first[0])*2,88+int(first[1])*2)
		image.fill_rect(Rect2i(104,88,48,32),background)
		for pixel in WatchLogo.pixels(logo_id,variant): image.fill_rect(Rect2i(104+int(pixel[0])*2,88+int(pixel[1])*2,2,2),ink)
	var result := CanvasTexture.new()
	result.diffuse_texture=ImageTexture.create_from_image(image)
	var normal: Image=tex("res://assets/atlas/%s_n.png" % cell.key).get_image().get_region(Rect2i(start,Vector2i(256,256)))
	result.normal_texture=ImageTexture.create_from_image(normal)
	result.specular_color=Color(0.05,0.05,0.05)
	result.specular_shininess=0.1
	_cache[key]=result
	return result

static func physical_icon(it: Dictionary, back := false) -> Texture2D:
	if WatchForgery.target_id(it)=="": return item_icon(it.defId,back)
	var result := AtlasTexture.new()
	result.atlas=physical_texture(it,back).diffuse_texture
	result.region=Rect2(8.96,8.96,238.08,238.08)
	return result
