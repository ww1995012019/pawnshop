extends Node2D
## The inside of the equipment drawer. All gauges, goods and tools stay live.
func _draw() -> void:
	draw_rect(Rect2(0, 0, 1920, 1080), Color("302b35"))
	for y in range(0, 1080, 108):
		draw_rect(Rect2(0, y, 1920, 3), Color("493e48"))
		for x in range(24, 1920, 216):
			draw_rect(Rect2(x, y+18, 4, 4), Color("73645f"))
	var mat := Rect2(440, 170, 680, 560)
	draw_rect(mat.grow(10), Color("171c23"))
	draw_rect(mat.grow(5), Color("83745b"), false, 4)
	draw_rect(mat, Color("394e4d"))
	for x in range(456, 1120, 32):
		draw_line(Vector2(x, 180), Vector2(x, 720), Color("405756"), 1)
	for y in range(186, 730, 32):
		draw_line(Vector2(450, y), Vector2(1110, y), Color("405756"), 1)
	for corner in [Vector2(460,190),Vector2(1080,190),Vector2(460,690),Vector2(1080,690)]:
		draw_rect(Rect2(corner,Vector2(18,4)), Color("b2aa84"))
		draw_rect(Rect2(corner,Vector2(4,18)), Color("b2aa84"))
