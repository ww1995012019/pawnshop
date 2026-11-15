extends Control
## A physical cash stack and the matching notes used during payment.
var cash := 0.0
var single_bill := false
var drawer_progress := 0.0

func _ready() -> void:
	if name != "cash_tray": mouse_filter = Control.MOUSE_FILTER_IGNORE
	texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST

func set_cash(amount: float) -> void:
	cash = maxf(0.0, amount)
	queue_redraw()

func _note(rect: Rect2) -> void:
	draw_rect(rect.grow(1), Color("263f32"))
	draw_rect(rect, Color("a4b68c"))
	draw_rect(rect.grow(-3), Color("526d4e"), false, 1)
	var medallion := rect.get_center()
	draw_circle(medallion, minf(7.0, rect.size.y * 0.2), Color("73875c"))
	draw_line(medallion + Vector2(-3, 0), medallion + Vector2(3, 0), Color("d2d2a3"), 2)
	for x in [rect.position.x + 6, rect.end.x - 13]:
		draw_rect(Rect2(x, rect.position.y + 6, 7, 2), Color("3f5f45"))
		draw_rect(Rect2(x, rect.end.y - 8, 7, 2), Color("3f5f45"))

func note_center() -> Vector2:
	var notes := clampi(ceili(cash / 250.0), 1, 6)
	var center := Vector2(7 + (notes - 1) * 2, 18 - (notes - 1) * 2) + Vector2((size.x - 29) * 0.5, 15)
	return get_global_transform() * (center + Vector2(0, drawer_progress * 8))

func _draw() -> void:
	if single_bill:
		_note(Rect2(Vector2.ONE * 2, size - Vector2.ONE * 4))
		return
	var travel := drawer_progress * 8.0
	if drawer_progress > 0.0:
		draw_rect(Rect2(1,7,size.x-2,size.y-8+travel),Color("1a2021"))
	var tray := Rect2(1, 7 + travel, size.x - 2, size.y - 8)
	draw_rect(tray, Color("3f493b"))
	draw_rect(tray, Color("b4a778"), false, 2)
	draw_rect(tray.grow(-3), Color("5c6650"), false, 1)
	if drawer_progress > .01:
		draw_rect(Rect2(size.x*.35,size.y+travel-4,size.x*.3,3),Color("d5bb81"))
	if cash <= 0:
		return
	var notes := clampi(ceili(cash / 250.0), 1, 6)
	for index in notes:
		var offset := Vector2(7 + index * 2, 18 - index * 2 + travel)
		draw_rect(Rect2(offset + Vector2(2, 3), Vector2(size.x - 29, 30)), Color(0.08, 0.12, 0.08, 0.4))
		_note(Rect2(offset, Vector2(size.x - 29, 30)))
