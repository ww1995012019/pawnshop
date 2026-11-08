class_name Util
## Small factories shared by the slice: soft light textures, lit canvas textures.

static var _cache := {}

## Radial falloff used by lights, glows, shadows and particles.
static func radial(size := 256, soft := 0.45) -> GradientTexture2D:
	var key := "radial:%d:%f" % [size, soft]
	if _cache.has(key):
		return _cache[key]
	var g := Gradient.new()
	g.offsets = PackedFloat32Array([0.0, soft, 1.0])
	g.colors = PackedColorArray([Color(1, 1, 1, 1), Color(0.42, 0.42, 0.42, 0.42), Color(0, 0, 0, 0)])
	var t := GradientTexture2D.new()
	t.gradient = g
	t.fill = GradientTexture2D.FILL_RADIAL
	t.fill_from = Vector2(0.5, 0.5)
	t.fill_to = Vector2(1.0, 0.5)
	t.width = size
	t.height = size
	_cache[key] = t
	return t

## Light texture: black edge so ADD blending contributes nothing outside the cone.
static func light_tex(size := 512) -> GradientTexture2D:
	var key := "light:%d" % size
	if _cache.has(key):
		return _cache[key]
	var g := Gradient.new()
	g.offsets = PackedFloat32Array([0.0, 0.25, 0.6, 1.0])
	g.colors = PackedColorArray([Color(1, 1, 1), Color(0.72, 0.72, 0.72), Color(0.22, 0.22, 0.22), Color(0, 0, 0)])
	var t := GradientTexture2D.new()
	t.gradient = g
	t.fill = GradientTexture2D.FILL_RADIAL
	t.fill_from = Vector2(0.5, 0.5)
	t.fill_to = Vector2(1.0, 0.5)
	t.width = size
	t.height = size
	_cache[key] = t
	return t

## Diffuse + normal map (+ uniform specular) so 2D lights shade the paint.
static func lit(diffuse: String, normal := "", specular := 0.0, shininess := 0.5) -> CanvasTexture:
	var c := CanvasTexture.new()
	c.diffuse_texture = load(diffuse)
	if normal != "":
		c.normal_texture = load(normal)
	c.specular_color = Color(specular, specular, specular)
	c.specular_shininess = shininess
	return c

static func white(size := 8) -> ImageTexture:
	var key := "white:%d" % size
	if _cache.has(key):
		return _cache[key]
	var img := Image.create(size, size, false, Image.FORMAT_RGBA8)
	img.fill(Color.WHITE)
	var t := ImageTexture.create_from_image(img)
	_cache[key] = t
	return t

static func add_material() -> CanvasItemMaterial:
	var m := CanvasItemMaterial.new()
	m.blend_mode = CanvasItemMaterial.BLEND_MODE_ADD
	m.light_mode = CanvasItemMaterial.LIGHT_MODE_UNSHADED
	return m

static func unshaded() -> CanvasItemMaterial:
	var m := CanvasItemMaterial.new()
	m.light_mode = CanvasItemMaterial.LIGHT_MODE_UNSHADED
	return m
