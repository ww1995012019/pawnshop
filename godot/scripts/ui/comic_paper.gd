extends StyleBox
## Texture grain plus a native ink outline, including on 24px price tags.
var paper: Texture2D
var bg_color := Color("f7e5c3")
var border_color := Color("20241e")
var shadow_color := Color(0,0,0,.15)
var shadow_size := 0
var shadow_offset := Vector2.ZERO
var border := 2
var radius := 8
var surface: StyleBoxTexture
var outline := StyleBoxFlat.new()
func _init() -> void:
 surface=StyleBoxTexture.new();surface.texture=preload("res://scripts/ui/reference_atlas.gd").paper_skin()
 for side in [SIDE_LEFT,SIDE_TOP,SIDE_RIGHT,SIDE_BOTTOM]:surface.set_texture_margin(side,22)
func set_border_width_all(value: int) -> void:border=value
func set_corner_radius_all(value: int) -> void:radius=value
func _draw(canvas: RID,rect: Rect2) -> void:
 surface.draw(canvas,rect)
 if border>0:
  outline.bg_color=Color.TRANSPARENT;outline.border_color=border_color
  outline.set_border_width_all(border);outline.set_corner_radius_all(radius)
  pass # The approved paper already contains its complete ink frame.
