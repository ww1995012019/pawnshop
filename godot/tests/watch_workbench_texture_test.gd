extends SceneTree

var failures := 0

func _initialize() -> void:
	call_deferred("run")

func check(ok: bool, message: String) -> void:
	if not ok:
		push_error(message)
		failures += 1

func run() -> void:
	var art = load("res://scripts/ui/watch_workbench_texture.gd")
	var state := Model.create("WORKBENCH-PAINT")
	for definition in GameData.item_list:
		var item := Model.new_item(state, definition.id)
		for back in [false,true]:
			var image: Image = art.texture(item,back).get_image()
			check(image.get_size() == Vector2i(256,256),definition.id+" keeps the instrument coordinate field")
			check(image.get_pixel(128,128).a > .9,definition.id+" keeps an opaque dial/plate at the work target")
		var mark_area := Rect2i(104,88,48,32)
		item.watch.logo_variant = 0
		var original: Image = art.texture(item,false).get_image().duplicate()
		item.watch.logo_variant = 1
		var altered: Image = art.texture(item,false).get_image().duplicate()
		check(original.get_region(mark_area).get_data() != altered.get_region(mark_area).get_data(), definition.id+" retains its physical instance mark")
		original.fill_rect(mark_area,Color.BLACK)
		altered.fill_rect(mark_area,Color.BLACK)
		check(original.get_data() == altered.get_data(),definition.id+" confines both marks to the instrument mask")
	var n01 := Model.new_item(state,"WCH-001")
	var front: Image = art.texture(n01,false).get_image()
	var back: Image = art.texture(n01,true).get_image()
	check(front.get_pixel(128,32).r > front.get_pixel(128,32).b+.3,"N01 wears the counter's orange leather")
	check(front.get_pixel(195,125).a > .95,"N01 crown extends from its brass case")
	check(front.get_region(Rect2i(0,0,256,64)).get_data() == back.get_region(Rect2i(0,0,256,64)).get_data(),"turning the N01 retains its strap")
	check(front.get_pixel(128,128) != back.get_pixel(128,128),"turning the N01 exposes its caseback")
	print("WORKBENCH PAINT failures=",failures)
	quit(1 if failures else 0)
