extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	if not ok:
		push_error(message)
		failures += 1
func parameter(sprite: Node, key: String) -> float:
	var value = sprite.mat.get_shader_parameter(key)
	return float(value) if value != null else 0.0
func run() -> void:
	var game = root.get_node("Game")
	game.new_game("RARE-ART")
	game.prefs.reduced_motion = false
	var sprite_script = load("res://scripts/world/item_sprite.gd")
	var bench_script = load("res://scripts/ui/watch_bench_art.gd")
	for definition in GameData.item_list:
		var bench = bench_script.new()
		root.add_child(bench)
		bench.configure(Model.new_item(game.state,definition.id),"open")
		if int(definition.sprite)>=33:
			var appearance: Dictionary = bench.appearance_signature()
			var metadata: Dictionary = WatchLogo.art(definition.id)
			check(appearance.case_shape==metadata.shape,definition.id+" bench preserves authored case silhouette")
			check(appearance.strap_color==metadata.strap_color,definition.id+" bench uses its own strap palette")
			check(appearance.case_color==metadata.case_color,definition.id+" bench uses its own case material")
		bench.free()
	var modes := {}
	var silhouettes := {}
	for index in range(74,79):
		var id := "WCH-%03d" % index
		if not GameData.items.has(id):
			check(false, id + " rare model exists")
			continue
		var shape: String = WatchLogo.art(id).get("shape", "")
		check(not shape.is_empty() and not silhouettes.has(shape),id+" individually recognizable case silhouette")
		silhouettes[shape]=true
		var mode := int(WatchLogo.art(id).get("animation",0))
		check(mode > 0 and not modes.has(mode), id + " distinct authored effect")
		modes[mode] = true
		for variant in [0,1]:
			var it := Model.new_item(game.state,id,{"authentic":variant==0,"watch":{"logo_variant":variant}})
			check(bool(it.authentic)==(variant==0),"physical truth fixture differs")
			Model.put_in(game.state,it)
			var sprite = sprite_script.new()
			root.add_child(sprite)
			sprite.setup(id,it.uid)
			sprite._process(0.25)
			check(int(parameter(sprite,"rare_effect"))==mode,id + " same visible effect for genuine and fake")
			check(float(parameter(sprite,"rare_time"))>0,id + " active cosmetic clock")
			check(float(parameter(sprite,"logo_hidden"))==1,"unobserved rare logo stays masked")
			game.prefs.reduced_motion=true
			sprite._process(0.25)
			check(int(parameter(sprite,"rare_effect"))==0,"reduced motion stops rare effect")
			game.prefs.reduced_motion=false
			sprite.back=true
			sprite._apply_face()
			sprite._process(0.25)
			check(int(parameter(sprite,"rare_effect"))==0,"back face remains static")
			sprite.free()
	if GameData.items.has("WCH-074"):
		var forged := Model.new_item(game.state,"WCH-023")
		forged.forgery={"targetId":"WCH-074","methods":{}}
		WatchForgery.apply(forged,"case")
		Model.put_in(game.state,forged)
		var sprite = sprite_script.new()
		root.add_child(sprite)
		sprite.setup(forged.defId,forged.uid)
		sprite._process(0.25)
		check(int(parameter(sprite,"rare_effect"))==1,"forged rare exterior has target animation")
		forged.forgery.methods.case.case_removed=true
		sprite._apply_face()
		sprite._process(0.25)
		check(int(parameter(sprite,"rare_effect"))==0,"removed rare shell removes its cosmetic effect")
		sprite.free()
	print("WATCH RARE ANIMATION failures=",failures)
	for player in root.find_children("*", "AudioStreamPlayer", true, false):
		player.stop()
		player.stream = null
	await process_frame
	quit(1 if failures else 0)
