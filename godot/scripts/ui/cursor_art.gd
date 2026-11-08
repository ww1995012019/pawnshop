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

static var installed := false

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

static func uninstall() -> void:
	if not installed:
		return
	for spec in CURSORS:
		Input.set_custom_mouse_cursor(null, spec[1])
	Input.set_default_cursor_shape(Input.CURSOR_ARROW)
	installed = false
