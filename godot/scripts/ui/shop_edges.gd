extends Node2D
## Mirror only the extreme wall/ceiling edges into the area revealed by a
## non-16:9 window. The central shop and all sprites retain their proportions.
var texture: Texture2D
var side_wall: Texture2D
func _ready() -> void:
	material = Util.unshaded()
	texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	texture = UIKit.tex("res://assets/scene/shop_pixel.png")
	side_wall = UIKit.tex("res://assets/scene/shop_side_wall.png")
	get_viewport().size_changed.connect(queue_redraw)

func _slice(dest: Rect2, src: Rect2, flip_x: bool, flip_y: bool) -> void:
	var origin := dest.position + Vector2(dest.size.x if flip_x else 0, dest.size.y if flip_y else 0)
	draw_set_transform(origin, 0.0, Vector2(-1 if flip_x else 1, -1 if flip_y else 1))
	draw_texture_rect_region(texture, Rect2(Vector2.ZERO, dest.size), src)

func _draw() -> void:
	if texture == null:
		return
	# Margin also covers camera shake at the screen edge.
	var visible := get_viewport().get_visible_rect().size
	var dx := maxf(80.0, (visible.x - 1920.0) * 0.5 + 80.0)
	var dy := maxf(80.0, (visible.y - 1080.0) * 0.5 + 80.0)
	# Sample only the outermost wall and floor strips: mirroring a broad
	# slice would repeat the lamps and create fake interactive equipment.
	var sx := 24.0
	var sy := 20.0
	# Blank modular walls avoid repeating shop fixtures. Keep their 1:1 pixel
	# density and extend the original floor at the bottom of each side.
	var wall_width := minf(dx, 1080.0)
	draw_set_transform(Vector2.ZERO)
	draw_texture_rect_region(side_wall, Rect2(-dx, 0, dx, 1030), Rect2(1080-wall_width, 0, wall_width, 1030))
	draw_texture_rect_region(side_wall, Rect2(1920, 0, dx, 1030), Rect2(0, 0, wall_width, 1030))
	_slice(Rect2(-dx, 1030, dx, 50), Rect2(0, 1030, sx, 50), true, false)
	_slice(Rect2(1920, 1030, dx, 50), Rect2(1920-sx, 1030, sx, 50), true, false)
	_slice(Rect2(0, -dy, 1920, dy), Rect2(0, 0, 1920, sy), false, true)
	_slice(Rect2(0, 1080, 1920, dy), Rect2(0, 1080-sy, 1920, sy), false, true)
	_slice(Rect2(-dx, -dy, dx, dy), Rect2(0, 0, sx, sy), true, true)
	_slice(Rect2(1920, -dy, dx, dy), Rect2(1920-sx, 0, sx, sy), true, true)
	_slice(Rect2(-dx, 1080, dx, dy), Rect2(0, 1080-sy, sx, sy), true, true)
	_slice(Rect2(1920, 1080, dx, dy), Rect2(1920-sx, 1080-sy, sx, sy), true, true)
	draw_set_transform(Vector2.ZERO)
