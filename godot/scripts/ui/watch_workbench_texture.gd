extends RefCounted
## The physical instruments use a 256px cell with a fixed dial centre and mark.
## Fit the counter painting to that cell before adding instance-specific parts.
const Comic = preload("res://scripts/ui/comic_assets.gd")
const Reference = preload("res://scripts/ui/reference_atlas.gd")
const CELL := Vector2i(256, 256)
# Include one untouched texel around the ink for linear filtering at the edge.
const DIAL_PATCH := Rect2i(103, 87, 50, 34)
static var cache := {}
static var order: Array[String] = []

static func _pixels(texture: Texture2D) -> Image:
	var image: Image = texture.get_image().duplicate()
	if image.is_compressed(): image.decompress()
	image.convert(Image.FORMAT_RGBA8)
	return image

static func _paint(id: String, back: bool) -> Image:
	if id == "WCH-001":
		var base := _pixels(UIKit.tex("res://assets/comic/n01-workbench.svg"))
		if back:
			var plate := _pixels(UIKit.tex("res://assets/comic/n01-caseback.svg"))
			base.blend_rect(plate, Rect2i(Vector2i.ZERO, plate.get_size()), Vector2i(72,72))
		return base
	var source := _pixels(Comic.watch({"defId":id}, back))
	var axis := Vector2(64,96)
	var radius := 48.0
	if not back and Reference.STYLE_IDS.has(id) and id != "WCH-016":
		var dial: Vector4 = Reference.WATCHES[Reference.STYLE_IDS[id]][1]
		axis = Vector2(dial.x, dial.y)
		radius = dial.w
	var result := Image.create(CELL.x, CELL.y, false, Image.FORMAT_RGBA8)
	# Preserve case proportions. Fit each end of the band separately because
	# reference crops can end just below the lugs or show the entire strap.
	var boundaries := [0, roundi(axis.y-radius), roundi(axis.y+radius), source.get_height()]
	var destination := [16, 64, 192, 240]
	var scale_factor := 64.0 / radius
	for i in 3:
		var height: int = boundaries[i+1]-boundaries[i]
		var section := source.get_region(Rect2i(0,boundaries[i],source.get_width(),height))
		section.resize(roundi(section.get_width()*scale_factor),destination[i+1]-destination[i],Image.INTERPOLATE_LANCZOS)
		result.blit_rect(section,Rect2i(Vector2i.ZERO,section.get_size()),Vector2i(roundi(128-axis.x*scale_factor),destination[i]))
	return result

static func texture(item: Dictionary, back: bool) -> ImageTexture:
	var shell := WatchForgery.appearance_id(item)
	var strap := WatchForgery.strap_id(item)
	var logo := WatchForgery.logo_id(item)
	var variant := WatchRules.logo_variant(item)
	var key := JSON.stringify([shell, strap, logo, variant, back])
	if cache.has(key): return cache[key]
	var image := _paint(shell, back)
	if strap != shell:
		var band := _paint(strap, back)
		for area in [Rect2i(0,0,256,54), Rect2i(0,206,256,50)]:
			image.blit_rect(band,area,area.position)
	var unmarked_dial: ImageTexture
	if not back:
		unmarked_dial = ImageTexture.create_from_image(image.get_region(DIAL_PATCH))
		var ink := Color(WatchLogo.art(shell).get("ink","#40382d"))
		for point in WatchLogo.pixels(logo,variant):
			image.fill_rect(Rect2i(104+int(point[0])*2,88+int(point[1])*2,2,2),ink)
	var result := ImageTexture.create_from_image(image)
	if unmarked_dial != null: result.set_meta("unmarked_dial",unmarked_dial)
	cache[key] = result
	order.append(key)
	if order.size() > 32: cache.erase(order.pop_front())
	return result
