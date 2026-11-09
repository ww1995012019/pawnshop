extends SceneTree
## Run against the exported PCK, not the source tree, to catch missing dynamic art.
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	if not ok:
		failures += 1
		push_error(message)
func run() -> void:
	GameData.ensure()
	# External --script files compile before exported autoload globals are
	# registered. Resolve the UI script after the deferred run has begun.
	var kit = load("res://scripts/app/ui_kit.gd")
	kit.ensure()
	for id in GameData.items:
		check(not GameData.inspection_profile(id).is_empty(), "Missing exported item-specific inspection: " + id)
		check(GameData.motion_profile(id).get("actions", []).size() == 3, "Missing exported inspection motions: " + id)
		for back in [false, true]:
			var icon = kit.item_icon(id, back)
			check(icon != null and icon.atlas != null, "Missing exported item face: " + id)
			var cell = kit.item_cell(id, back)
			check(kit.lit_atlas(cell.key).normal_texture != null, "Missing item normal: " + cell.key)
	for npc in GameData.npcs:
		check(kit.npc_portrait(npc.id).atlas != null, "Missing resident: " + npc.id)
	for tool in GameData.tools:
		check(kit.tool_icon(tool.id).atlas != null, "Missing instrument: " + tool.id)
	for path in ["res://assets/scene/shop_pixel.png", "res://assets/scene/shop_side_wall.png", "res://assets/ui/quotation-console.png"]:
		check(load(path) != null, "Missing room/UI: " + path)
	check(not ResourceLoader.exists("res://assets/scene/counter_bg.png"), "Legacy counter art should not ship")
	check(not ResourceLoader.exists("res://assets/atlas/orbital-characters.png"), "Unused legacy residents should not ship")
	print("EXPORTED ASSETS: ", GameData.items.size(), " items, ", GameData.npcs.size(), " residents, ", GameData.tools.size(), " instruments; failures=", failures)
	quit(1 if failures else 0)
