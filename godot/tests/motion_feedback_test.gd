extends SceneTree
## Run against the animated scene with an isolated XDG_DATA_HOME.
var failures := 0
var game
var shell

func _initialize() -> void:
	call_deferred("run")

func check(ok: bool, message: String) -> void:
	print("MOTION ", "PASS " if ok else "FAIL ", message)
	if not ok:
		failures += 1

func frames(count: int) -> void:
	for i in count:
		await process_frame

func run() -> void:
	game = root.get_node("Game")
	check_preferences()
	root.size = Vector2i(1280,720)
	game.prefs.sound = false
	game.prefs.reduced_motion = true
	game.new_game("MOTION-AUDIT-221126")
	shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames(8)
	shell._close_title()
	await check_inspection()
	await check_evidence()
	for mobile in [false,true]:
		for selling in [false,true]:
			await check_checkout(mobile,selling)
	shell.queue_free()
	await frames(3)
	print("MOTION failures=",failures)
	quit(1 if failures else 0)

func check_preferences() -> void:
	var path: String = game.PREFS_PATH
	if not game.has_method("_load_preferences") or not game.has_method("set_reduced_motion"):
		check(false,"fresh system preference and a player choice can be loaded separately")
		return
	var previous := FileAccess.get_file_as_string(path) if FileAccess.file_exists(path) else ""
	DirAccess.remove_absolute(ProjectSettings.globalize_path(path))
	game._load_preferences(true)
	check(game.prefs.reduced_motion,"fresh player inherits reduce")
	game.save_prefs()
	game._load_preferences(false)
	check(not game.prefs.reduced_motion,"saving volume or sound keeps the system preference automatic")
	game.set_reduced_motion(false)
	game._load_preferences(true)
	check(not game.prefs.reduced_motion,"explicit off survives reload on an OS requesting reduce")
	game.set_reduced_motion(true)
	game._load_preferences(false)
	check(game.prefs.reduced_motion,"explicit on survives reload on an OS allowing motion")
	FileAccess.open(path,FileAccess.WRITE).store_string('{"sound":true,"reduced_motion":false}')
	game._load_preferences(true)
	check(not game.prefs.reduced_motion,"a legacy saved off is preserved")
	FileAccess.open(path,FileAccess.WRITE).store_string('{"music_volume":0.3}')
	game._load_preferences(true)
	check(game.prefs.reduced_motion,"a legacy save without motion follows the OS")
	if previous.is_empty():
		DirAccess.remove_absolute(ProjectSettings.globalize_path(path))
	else:
		FileAccess.open(path,FileAccess.WRITE).store_string(previous)

func check_inspection() -> void:
	var stock = game.state.inventory[0]
	shell.go("inspect",stock.uid)
	await frames(20)
	var item = shell.workspace_shell.page.item
	var rest: Vector2 = item.global_position
	var base: Vector2 = item.body.scale
	var drops := [0]
	item.dropped.connect(func(): drops[0] += 1)
	shell.workspace_shell.pointer_override = rest
	item.begin_drag(rest)
	await frames(24)
	check(item.body.position.is_zero_approx() and item.body.scale.is_equal_approx(base),"stationary inspection press keeps its geometry")
	check(item.mat.get_shader_parameter("held_outline") == true,"reduced press shows a fixed outline")
	item.end_drag()
	var steady := true
	var release_time := 0.0
	while release_time < .5:
		await process_frame
		release_time += item.get_process_delta_time()
		steady = steady and item.body.scale.is_equal_approx(base) and item.body.position.is_zero_approx()
	check(steady and drops[0] == 1,"release stays the same size and delivers exactly one drop")
	item.begin_drag(rest)
	var target := rest + Vector2(24,16)
	shell.workspace_shell.pointer_override = target
	await frames(2)
	check(item.global_position.is_equal_approx(target) and is_zero_approx(item.body.rotation),"watch follows the pointer without tilt")
	item.end_drag()
	check(item.mat.get_shader_parameter("held_outline") == false and drops[0] == 2,"release clears the outline and completes the drag")
	shell.workspace_shell.pointer_override = null
	shell.close_workspace()
	await frames(5)

func check_checkout(mobile: bool, selling: bool) -> void:
	shell.phone_override = mobile
	root.size = Vector2i(1024,510) if mobile else Vector2i(1280,720)
	shell._fit_view()
	game.prefs.reduced_motion = false
	game.new_game("MOTION-AUDIT-221126")
	if selling:
		game.state.cursor = 1
	game.state = Model.reduce(game.state,{"type":"ARRIVE"})
	game.state.trade.npcId = "CHR-004"
	if selling:
		var stock: Dictionary = game.state.inventory[0]
		stock.condition = 1.0
		stock.working = true
		stock.sourceVerified = true
		game.state = Model.reduce(game.state,{"type":"SELECT_TRADE","uid":stock.uid})
	shell.go("counter")
	await frames(14)
	var page = shell.page
	var strict = page.strict_view
	var label := ("%s %s" % ["phone" if mobile else "desktop","receive" if selling else "pay"])
	var tills: Rect2 = page.cash_tray.get_global_rect() if mobile else strict.money.get_global_rect()
	var hand: Vector2
	if mobile:
		var actor = page.customer
		hand = shell.world_to_ui(actor.to_global(actor.size * Vector2(.03,-.10)))
	else:
		hand = strict.face.get_global_transform() * (strict.face.size * Vector2(.53,.93))
	var face_rect: Rect2 = strict.face.get_rect()
	if not mobile:
		check(reaction(strict) <= 0.0,label+" portrait is quiet before confirmation")
		game.prefs.reduced_motion = selling
	game.dispatch(CounterDialogue.action_for(game.state,"ACCEPT"))
	await create_timer(.12).timeout
	if not mobile:
		var first := reaction(strict)
		await create_timer(.09).timeout
		check(first > .1 and (not selling or is_equal_approx(first,reaction(strict))),label+" lock gives the painted visitor a readable reaction")
		check(face_rect.is_equal_approx(strict.face.get_rect()),label+" head reacts above a fixed counter baseline")
	game.prefs.reduced_motion = false
	game.dispatch(CounterDialogue.action_for(game.state,"DELIVER"))
	var bill = page.get_node_or_null("cash_bill_0")
	check(bill != null,label+" creates the first note")
	if bill != null:
		var start: Vector2 = bill.get_global_transform() * bill.pivot_offset
		check(start.distance_to(hand) < 24.0 if selling else tills.has_point(start),label+" starts on the visible source")
		var reached := false
		var elapsed := 0.0
		while is_instance_valid(bill) and elapsed < 2.0:
			var point: Vector2 = bill.get_global_transform() * bill.pivot_offset
			reached = reached or (tills.has_point(point) if selling else point.distance_to(hand) < 24.0)
			await process_frame
			elapsed += page.get_process_delta_time()
		check(reached,label+" reaches the visible recipient")
	var elapsed := 0.0
	while page.busy and elapsed < 6.0:
		await process_frame
		elapsed += page.get_process_delta_time()

func check_evidence() -> void:
	game.prefs.reduced_motion = true
	var state := Model.create("MOTION-PROOF")
	var watch := Model.new_item(state,"WCH-001",{"owner":"npc","sourceVerified":true,"condition":.65})
	watch.evidence = ["TOL-001"]
	Model.record_inspection(watch,"TOL-001")
	state.trade = {"id":"motion-proof","npcId":"CHR-004","kind":"buy","item":watch,
		"price":80,"rounds":0,"locked":false,"evidenceUsed":[],"line":"请验货。"}
	game.state = CounterDialogue.begin(state)
	shell.go("counter")
	await frames(8)
	var page = shell.page
	var strict = page.strict_view
	var proof := {"price":35,"evidence":"TOL-001"}
	game.dispatch(CounterDialogue.action_for(game.state,"OFFER",proof))
	await frames(2)
	check(game.state.trade.evidenceUsed.has("TOL-001") and not game.state.trade.locked and reaction(strict) > .1,"new evidence alone changes the visible pose")
	await create_timer(.95).timeout
	game.dispatch(CounterDialogue.action_for(game.state,"OFFER",proof))
	await frames(2)
	check(is_zero_approx(reaction(strict)),"repeating the same evidence leaves the portrait at rest")
	game.dispatch(CounterDialogue.action_for(game.state,"ACCEPT"))
	await create_timer(.95).timeout
	game.dispatch(CounterDialogue.action_for(game.state,"DELIVER"))
	await frames(2)
	check(reaction(strict) > .1 and page.find_children("cash_bill*","Control",true,false).is_empty(),"reduced checkout acknowledges delivery in a still pose without flying notes")

func reaction(view) -> float:
	if view.face.material is ShaderMaterial:
		var amount = view.face.material.get_shader_parameter("nod")
		if amount != null: return float(amount)
	return 0.0
