extends SceneTree
var failures := 0
func _initialize() -> void:
	call_deferred("run")
func check(ok: bool, message: String) -> void:
	print("CLEANING ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func run() -> void:
	var script = load("res://scripts/model/watch_cleaning.gd")
	if script == null:
		check(false, "persistent actual-alpha cleaning model exists")
		quit(1)
		return
	var alpha := Image.create(64, 64, false, Image.FORMAT_RGBA8)
	alpha.fill(Color.TRANSPARENT)
	for y in range(12, 52):
		for x in range(22, 42): alpha.set_pixel(x, y, Color.WHITE)
	var cleaning = script.new()
	cleaning.configure(alpha, "test-item", {})
	check(cleaning.remaining() > 0.99, "initial grime covers only visible material")
	var empty_before: Dictionary = cleaning.serialize()
	cleaning.stroke(Vector2(0, 0), Vector2(1, 0), 0.07)
	check(cleaning.serialize() == empty_before, "transparent margin cannot inflate or consume progress")
	cleaning.stroke(Vector2(0.5, 0.4), Vector2(0.5, 0.4), 0.08)
	check(cleaning.serialize() == empty_before, "holding still is not a wiping motion")
	for y in range(10, 55, 3):
		cleaning.stroke(Vector2(0.25, y/64.0), Vector2(0.75, y/64.0), 0.08)
	check(cleaning.remaining() == 0.0 and cleaning.complete(), "continuous fast strokes clear every visible dirty pixel and finish together")
	var restored = script.new()
	restored.configure(alpha, "test-item", JSON.parse_string(JSON.stringify(cleaning.serialize())))
	check(restored.complete() and restored.remaining() == 0, "JSON reload preserves finished mask")
	var partial = script.new()
	partial.configure(alpha, "partial", {})
	partial.stroke(Vector2(0.2, 0.3), Vector2(0.8, 0.3), 0.07)
	var saved: Dictionary = partial.serialize()
	restored.configure(alpha, "partial", JSON.parse_string(JSON.stringify(saved)))
	check(is_equal_approx(partial.remaining(), restored.remaining()), "partial progress survives page recreation")
	var one = script.new()
	var many = script.new()
	one.configure(alpha, "frame-rate", {})
	many.configure(alpha, "frame-rate", {})
	one.stroke(Vector2(0.2, 0.5), Vector2(0.8, 0.5), 0.08)
	for i in range(12):
		many.stroke(Vector2(0.2+i*0.05, 0.5), Vector2(0.25+i*0.05, 0.5), 0.08)
	check(absf(one.remaining()-many.remaining()) < 0.025, "subdividing the same wipe across frames preserves cleaning amount")
	var kit = load("res://scripts/app/ui_kit.gd")
	for i in range(1, 34):
		var id := "WCH-%03d" % i
		var texture: Texture2D = kit.item_icon(id)
		var visible := texture.get_image()
		var mask_model = script.new()
		mask_model.configure(visible, id, {})
		for row in range(0, 65, 3):
			mask_model.stroke(Vector2(-0.05,row/64.0),Vector2(1.05,row/64.0),0.09)
		check(mask_model.complete(), id + " actual silhouette can be fully cleaned")
	quit(1 if failures else 0)
