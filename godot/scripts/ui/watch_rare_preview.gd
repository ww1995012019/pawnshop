extends TextureRect
## Only the selected reference moves; icon cards always use static atlas crops.
var elapsed := 0.0
var effect := 0
var last_active := -1
func configure(id: String, back := false) -> void:
	texture = UIKit.item_icon(id,back)
	expand_mode = TextureRect.EXPAND_IGNORE_SIZE
	stretch_mode = TextureRect.STRETCH_KEEP_ASPECT_CENTERED
	custom_minimum_size = Vector2(140,170)
	effect = int(WatchLogo.art(id).get("animation",0)) if not back else 0
	var shader := ShaderMaterial.new()
	shader.shader = load("res://shaders/item.gdshader")
	var icon := texture as AtlasTexture
	var size := icon.atlas.get_size()
	shader.set_shader_parameter("region",Vector4(icon.region.position.x/size.x,icon.region.position.y/size.y,icon.region.size.x/size.x,icon.region.size.y/size.y))
	shader.set_shader_parameter("logo_rect",Vector4(0.5-24.0/238.08,0.5-40.0/238.08,48.0/238.08,32.0/238.08))
	shader.set_shader_parameter("back_face",1.0 if back else 0.0)
	material=shader
	_process(0.0)
func _process(delta: float) -> void:
	if material == null: return
	var active := effect if not Game.prefs.reduced_motion else 0
	if active > 0: elapsed += delta
	if active != last_active:
		material.set_shader_parameter("rare_effect",active)
		last_active = active
	if active > 0: material.set_shader_parameter("rare_time",elapsed)
