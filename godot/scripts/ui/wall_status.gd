extends Control
## Refit the shop's painted wall unit; its worn bezel is part of the room art.

static var bezel_texture: Texture2D

func _ready() -> void:
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	texture_filter = CanvasItem.TEXTURE_FILTER_NEAREST
	var bezel := NinePatchRect.new()
	if bezel_texture == null:
		var image := UIKit.tex("res://assets/scene/shop_pixel.png").get_image().get_region(Rect2i(412,12,56,28))
		image.resize(224,112,Image.INTERPOLATE_NEAREST)
		bezel_texture = ImageTexture.create_from_image(image)
	bezel.texture = bezel_texture
	bezel.draw_center = false
	for side in [SIDE_LEFT, SIDE_TOP, SIDE_RIGHT, SIDE_BOTTOM]:
		bezel.set_patch_margin(side, 24)
	bezel.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	bezel.mouse_filter = Control.MOUSE_FILTER_IGNORE
	add_child(bezel)

func _draw() -> void:
	# Four-pixel paint chips and inset glass follow the scene's pixel scale.
	draw_rect(Rect2(12, 12, size.x - 24, size.y - 24), Color("a58d64"))
	for x in range(28, int(size.x) - 24, 44):
		draw_rect(Rect2(x, 56, 12, 4), Color("b19a73"))
		draw_rect(Rect2(x + 12, 96, 8, 4), Color("8c7957"))
	draw_rect(Rect2(20, 12, size.x - 40, 44), Color("5f5743"))
	draw_rect(Rect2(24, 16, size.x - 48, 36), Color("1d3836"))
	draw_rect(Rect2(24, 16, size.x - 48, 4), Color("142a2a"))
	for y in range(24, 52, 4):
		draw_rect(Rect2(28, y, size.x - 56, 1), Color(0.62, 0.75, 0.61, 0.045))

static func fit_key(button: Button) -> void:
	for state in ["normal", "hover", "pressed", "disabled", "focus"]:
		button.add_theme_stylebox_override(state, StyleBoxEmpty.new())
	button.add_theme_color_override("font_color", Color("3d3428"))
	button.add_theme_color_override("font_hover_color", Color("29261e"))
	button.add_theme_color_override("font_pressed_color", Color("29261e"))
	button.add_theme_constant_override("outline_size", 0)
	var face := KeyFace.new()
	face.show_behind_parent = true
	face.set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
	face.mouse_filter = Control.MOUSE_FILTER_IGNORE
	button.add_child(face)
	for signal_name in ["mouse_entered", "mouse_exited", "focus_entered", "focus_exited", "button_down", "button_up"]:
		button.connect(signal_name, face.queue_redraw)

class KeyFace extends Control:
	func _draw() -> void:
		var key: Button = get_parent()
		var down := key.is_pressed()
		var active := key.is_hovered() or key.has_focus()
		var y := 4 if down else 0
		draw_rect(Rect2(0, 4, size.x, size.y - 4), Color("62563f"))
		draw_rect(Rect2(0, y, size.x - 4, size.y - 4), Color("8d7c58"))
		draw_rect(Rect2(4, 4 + y, size.x - 12, size.y - 12), Color("b3a078") if active else Color("a6936c"))
		draw_rect(Rect2(0, y, size.x - 4, 4), Color("c2ad80"))
		draw_rect(Rect2(4, 4 + y, 12, 4), Color("c2ad80"))
		if active:
			draw_rect(Rect2(size.x - 16, 8 + y, 4, 4), Color("b9d8ae"))
