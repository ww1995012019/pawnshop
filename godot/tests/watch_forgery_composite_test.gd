extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	if not ok:
		push_error(message)
		failures+=1
func run() -> void:
	var state := Model.create("COMPOSITE-CONTOUR")
	var kit = load("res://scripts/app/ui_kit.gd")
	for id in ["WCH-075","WCH-033"]:
		var it := Model.new_item(state,"WCH-023")
		it.forgery={"targetId":id,"methods":{}}
		WatchForgery.apply(it,"case")
		WatchForgery.restore_exterior(it,"strap")
		check(WatchForgery.appearance_id(it)==id and WatchForgery.strap_id(it)=="WCH-023","fixture restores strap while retaining target shell")
		for back in [false,true]:
			var composite: Image=kit.physical_texture(it,back).diffuse_texture.get_image()
			var cell: Dictionary = kit.item_cell(id,back)
			var start := Vector2i(cell.region.position-Vector2.ONE*8.96)
			var target: Image=kit.watch_cell_image(id,back)
			if id=="WCH-075":
				check(composite.get_region(Rect2i(0,54,256,11)).get_data()==target.get_region(Rect2i(0,54,256,11)).get_data(),"restoring original strap preserves new oval case/lugs at y54..64")
			var source_cell: Dictionary = kit.item_cell("WCH-023",back)
			var source_start := Vector2i(source_cell.region.position-Vector2.ONE*8.96)
			var source: Image=kit.watch_cell_image("WCH-023",back)
			var restored_height := 65 if id=="WCH-033" else 54
			check(composite.get_region(Rect2i(0,0,256,restored_height)).get_data()==source.get_region(Rect2i(0,0,256,restored_height)).get_data(),"restored top strap uses actual source; original33 band stays unchanged")
	for player in root.find_children("*","AudioStreamPlayer",true,false):
		player.stop()
		player.stream=null
	await process_frame
	print("WATCH FORGERY COMPOSITE failures=",failures)
	quit(1 if failures else 0)
