class_name PortraitSkin
extends RefCounted
## Dedicated mobile artwork; slice the generated atlas once at display density.
const ATLAS := "res://assets/ui/portrait-atlas.png"
const PANELS := {
	"wine": Rect2i(32,34,454,445),
	"felt": Rect2i(544,34,454,445),
	"amber": Rect2i(1041,187,481,139),
}
const TOOLS := {"TOL-001":Rect2(36,540,450,450),"TOL-002":Rect2(532,638,475,235),"TOL-005":Rect2(1050,602,465,334)}
static var textures := {}

static func texture(kind: String) -> Texture2D:
	if textures.has(kind): return textures[kind]
	var source: Image = UIKit.tex(ATLAS).get_image()
	var frame := source.get_region(PANELS[kind])
	frame.resize(128,40 if kind == "amber" else 128,Image.INTERPOLATE_LANCZOS)
	var result := ImageTexture.create_from_image(frame)
	textures[kind] = result
	return result

static func panel(kind := "wine", pad := 12.0, tint := Color.WHITE) -> StyleBoxTexture:
	var style := StyleBoxTexture.new()
	style.texture = texture(kind)
	style.set_texture_margin_all(11 if kind == "amber" else 12)
	style.set_content_margin_all(pad)
	style.modulate_color = tint
	return style

static func tool(id: String) -> Texture2D:
	var key := "tool:"+id
	if textures.has(key): return textures[key]
	if not TOOLS.has(id): return UIKit.tool_icon(id)
	var result := AtlasTexture.new()
	result.atlas = UIKit.tex(ATLAS)
	result.region = TOOLS[id]
	textures[key] = result
	return result

static func button(key: Button, primary := false) -> void:
	for state in ["normal","hover","pressed","disabled"]:
		var tint := Color.WHITE
		if state == "hover": tint = Color(1.12,1.10,1.04)
		elif state == "pressed": tint = Color(0.78,0.76,0.72)
		elif state == "disabled": tint = Color(0.55,0.55,0.55,0.8)
		key.add_theme_stylebox_override(state,panel("amber" if primary else "wine",8,tint))
	if primary:
		for state in ["font_color","font_hover_color","font_focus_color","font_pressed_color"]:
			key.add_theme_color_override(state,Color("382113"))
		key.add_theme_constant_override("outline_size",0)
