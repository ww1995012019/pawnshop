extends Node2D
## The inside of the equipment drawer. All gauges, goods and tools stay live.
var mat_rect := Rect2()
var viewport_size := Vector2.ZERO

func set_mat(rect: Rect2) -> void:
	mat_rect = rect
	queue_redraw()

func _process(_delta: float) -> void:
	global_transform = get_viewport().get_canvas_transform().affine_inverse()
	var next_size := get_viewport_rect().size
	if next_size != viewport_size:
		viewport_size = next_size
		queue_redraw()

func _draw() -> void:
	draw_rect(Rect2(Vector2.ZERO, viewport_size), Color("242c2b"))
	for y in range(0, int(viewport_size.y), 108):
		draw_rect(Rect2(0, y, viewport_size.x, 3), Color("303c37"))
		for x in range(24, int(viewport_size.x), 216):
			draw_rect(Rect2(x, y+18, 4, 4), Color("706853"))
	if mat_rect.size == Vector2.ZERO:
		return
	draw_rect(mat_rect, Color("171c23"))
	draw_rect(mat_rect.grow(-3), Color("b29a6c"), false, 3)
	draw_rect(mat_rect.grow(-5), Color("151f1c"), false, 2)
	var mat := mat_rect.grow(-8)
	draw_rect(mat, Color("354a43"))
	for x in range(int(mat.position.x + 16), int(mat.end.x), 32):
		draw_line(Vector2(x, mat.position.y), Vector2(x, mat.end.y), Color("40554d"), 1)
	for y in range(int(mat.position.y + 16), int(mat.end.y), 32):
		draw_line(Vector2(mat.position.x, y), Vector2(mat.end.x, y), Color("40554d"), 1)
	for x in range(int(mat.position.x+24),int(mat.end.x-24),16):
		draw_line(Vector2(x,mat.position.y+4),Vector2(x,mat.position.y+(11 if (x-int(mat.position.x+24))%64==0 else 7)),Color("879780"),1)
	for y in range(int(mat.position.y+24),int(mat.end.y-24),16):
		draw_line(Vector2(mat.position.x+4,y),Vector2(mat.position.x+8,y),Color("879780"),1)
	for corner in [mat.position + Vector2(14, 14), Vector2(mat.end.x - 32, mat.position.y + 14), Vector2(mat.position.x + 14, mat.end.y - 32), mat.end - Vector2(32, 32)]:
		draw_rect(Rect2(corner, Vector2(18, 4)), Color("b2aa84"))
		draw_rect(Rect2(corner, Vector2(4, 18)), Color("b2aa84"))
