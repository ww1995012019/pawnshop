extends RefCounted
## Small hardware cursors use native pointer hotspots and work on desktop and Web.

const CURSORS := [
	["arrow", Input.CURSOR_ARROW, Vector2(2, 0)],
	["pointing_hand", Input.CURSOR_POINTING_HAND, Vector2(12, 2)],
	["can_drop", Input.CURSOR_CAN_DROP, Vector2(8, 0)],
	["drag", Input.CURSOR_DRAG, Vector2(16, 16)],
	["cross", Input.CURSOR_CROSS, Vector2(16, 16)],
	["vsize", Input.CURSOR_VSIZE, Vector2(16, 16)],
	["hsize", Input.CURSOR_HSIZE, Vector2(16, 16)],
	["forbidden", Input.CURSOR_FORBIDDEN, Vector2(2, 0)],
	["ibeam", Input.CURSOR_IBEAM, Vector2(16, 16)],
]

const DIAGONAL_SHAPES := [Input.CURSOR_FDIAGSIZE,Input.CURSOR_BDIAGSIZE]
static var installed := false

static func diagonal_texture(shape: int) -> ImageTexture:
	# Pixel hardware arrows use the same cream face, dark outline and teal bevel.
	var mask := {}
	for i in range(6,26):
		for width in range(-1,2): mask[Vector2i(i,i+width)] = true
	for i in range(10):
		for width in range(-1,2):
			mask[Vector2i(6+i,6+width)] = true
			mask[Vector2i(6+width,6+i)] = true
			mask[Vector2i(25-i,25+width)] = true
			mask[Vector2i(25+width,25-i)] = true
	var image := Image.create(32,32,false,Image.FORMAT_RGBA8)
	image.fill(Color.TRANSPARENT)
	for point in mask:
		for y in range(-1,2):
			for x in range(-1,2):
				var p: Vector2i = point+Vector2i(x,y)
				if shape == Input.CURSOR_BDIAGSIZE: p.x = 31-p.x
				image.set_pixelv(p,Color("132323"))
	for point in mask:
		var p: Vector2i = point
		if shape == Input.CURSOR_BDIAGSIZE: p.x = 31-p.x
		image.set_pixelv(p,Color("e9d8af") if point.y <= point.x else Color("91aaa0"))
	return ImageTexture.create_from_image(image)

static func install() -> void:
	if installed:
		return
	installed = true
	for spec in CURSORS:
		var texture: Texture2D = load("res://assets/ui/cursors/%s.png" % spec[0])
		if texture == null:
			push_warning("Missing cursor texture: %s" % spec[0])
			continue
		Input.set_custom_mouse_cursor(texture, spec[1], spec[2])
	for shape in DIAGONAL_SHAPES:
		Input.set_custom_mouse_cursor(diagonal_texture(shape),shape,Vector2(16,16))

static func uninstall() -> void:
	if not installed:
		return
	for spec in CURSORS:
		Input.set_custom_mouse_cursor(null, spec[1])
	for shape in DIAGONAL_SHAPES: Input.set_custom_mouse_cursor(null,shape)
	Input.set_default_cursor_shape(Input.CURSOR_ARROW)
	installed = false
