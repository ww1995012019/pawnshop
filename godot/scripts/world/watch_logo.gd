class_name WatchLogo
extends Control
## One physical pixel mark, shared by the dial, magnifier and reference manual.
## No authentication result is encoded in the artwork or accessible label.
var def_id := "WCH-001"
var variant := 0
var physical_patch := false
var crest_only := false
static var _art: Dictionary = {}

static func art(id: String) -> Dictionary:
	if _art.is_empty():
		_art = JSON.parse_string(FileAccess.get_file_as_string("res://data/watch_art.json"))
	return _art.get(id, _art.get("WCH-001", {}))

static func pixels(id: String, logo_variant := 0) -> Array:
	return art(id).get("pixels", [[], []])[clampi(logo_variant, 0, 1)]

func setup(id: String, logo_variant := 0) -> void:
	def_id = id
	variant = logo_variant
	mouse_filter = Control.MOUSE_FILTER_IGNORE
	custom_minimum_size = Vector2(120, 80)
	queue_redraw()

func setup_crest(id: String, side := 24.0) -> void:
	setup(id)
	crest_only = true
	custom_minimum_size = Vector2.ONE * side
	size = custom_minimum_size

func _draw() -> void:
	var data := art(def_id)
	if data.is_empty():
		return
	if crest_only:
		var crest_unit := minf(size.x, size.y) / 16.0
		var origin := (size - Vector2.ONE * 16.0 * crest_unit) * 0.5
		var mount := Rect2(origin, Vector2.ONE * 16.0 * crest_unit)
		draw_rect(mount, Color("353b31"))
		draw_rect(mount, Color("90784c"), false, maxf(1.0, crest_unit * 0.5))
		for pixel in data.get("crest", []):
			draw_rect(Rect2(origin + Vector2(pixel[0], pixel[1]) * crest_unit, Vector2.ONE * crest_unit), Color("e4c375"))
		return
	var unit := minf(size.x / 24.0, size.y / 16.0)
	var origin := (size - Vector2(24, 16) * unit) * 0.5
	if physical_patch:
		draw_rect(Rect2(origin, Vector2(24, 16) * unit), Color(data.face))
	var ink := Color(data.ink) if physical_patch else Color("d8c79e")
	for pixel in pixels(def_id, variant):
		draw_rect(Rect2(origin + Vector2(pixel[0], pixel[1]) * unit, Vector2.ONE * unit), ink)
