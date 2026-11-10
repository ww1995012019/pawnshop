extends SceneTree
var failures := 0
var shell
func _initialize(): call_deferred("run")
func settle():
	for i in 6: await process_frame
func check(ok: bool, message: String):
	print("MOBILE GESTURE ","PASS " if ok else "FAIL ",message)
	if not ok: failures += 1
func screen(world: Vector2) -> Vector2:
	return root.get_final_transform() * (shell.workspace_container.global_position + shell.active_shell().world_to_ui(world))
func contact(at: Vector2, pressed: bool):
	var event := InputEventScreenTouch.new()
	event.index = 0
	event.position = screen(at)
	event.pressed = pressed
	Input.parse_input_event(event)
	await settle()
func drag(from: Vector2, to: Vector2):
	var event := InputEventScreenDrag.new()
	event.index = 0
	event.position = screen(to)
	event.relative = screen(to)-screen(from)
	Input.parse_input_event(event)
	await settle()
func run():
	var game = root.get_node("Game")
	game.prefs.sound = false
	game.prefs.reduced_motion = true
	game.state = Model.create("MOBILE-GESTURES")
	shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await settle()
	shell._close_title()
	shell.go("inspect")
	await settle()
	var active = shell.active_shell()
	var page = active.page
	# Buttons and receipt faces inside scroll areas must pass the held pointer
	# to the scroller. Native Godot handles drag distance, inertia and cancelling
	# the button once the scroll starts.
	var scroll := ScrollContainer.new()
	scroll.position = Vector2(60,60)
	scroll.size = Vector2(320,200)
	scroll.z_index = 200
	shell.root_ui.add_child(scroll)
	var kit = load("res://scripts/app/ui_kit.gd")
	var card = kit.plate()
	card.custom_minimum_size = Vector2(280,600)
	scroll.add_child(card)
	var contents := VBoxContainer.new()
	card.add_child(contents)
	var pick = kit.button("选择手表")
	contents.add_child(pick)
	var events := {"down":0,"motion":0}
	scroll.gui_input.connect(func(event):
		if event is InputEventMouseButton and event.pressed: events.down += 1
		if event is InputEventMouseMotion: events.motion += 1)
	await settle()
	var at: Vector2 = root.get_final_transform() * pick.get_global_rect().get_center()
	var hover := InputEventMouseMotion.new()
	hover.position = at
	Input.parse_input_event(hover)
	await settle()
	events.motion = 0
	var down := InputEventMouseButton.new()
	down.button_index = MOUSE_BUTTON_LEFT
	down.pressed = true
	down.position = at
	Input.parse_input_event(down)
	await settle()
	var move := InputEventMouseMotion.new()
	move.button_mask = MOUSE_BUTTON_MASK_LEFT
	move.relative = root.get_final_transform().basis_xform(Vector2(0,-3))
	move.position = at+move.relative
	Input.parse_input_event(move)
	await settle()
	down.pressed = false
	down.position = move.position
	Input.parse_input_event(down)
	await settle()
	check(events.down==1 and events.motion>0,"scrolling can start over a button and pass through its printed card")
	scroll.queue_free()
	await settle()
	for id in ["TOL-001","TOL-002"]:
		page._set_tool(id)
		await create_timer(0.6).timeout
		var node = page.lens if id == "TOL-001" else page.wand
		var a: Vector2 = active.ui_to_world(page.mat_rect.get_center()+Vector2(-90,40))
		var b: Vector2 = active.ui_to_world(page.mat_rect.get_center()+Vector2(90,40))
		var c: Vector2 = active.ui_to_world(page.mat_rect.get_center()+Vector2(-40,-70))
		await contact(a,true)
		await drag(a,b)
		check(node.global_position.distance_to(b)<2,id+" follows the finger during the same touch gesture")
		await drag(b,c)
		check(node.global_position.distance_to(c)<2,id+" follows successive drag positions without requiring another tap")
		await contact(c,false)
		await settle()
		check(node.global_position.distance_to(c)<2,id+" stays at the final observation point after release")
	page._set_tool("TOL-001")
	await create_timer(0.6).timeout
	var it = game.item(page.it_uid)
	it.evidence = []
	it.inspectedPaid = false
	game.state.ap = 0
	var calls := {"check":0}
	game.changed.connect(func(_old,_next,action):
		if action.type=="CHECK": calls.check += 1)
	page.optical_fixed = true
	page.optical_position = page.item.logo_world_position()
	for i in 12: page._process(1.0)
	check(calls.check==1,"a denied observation triggers one notice/save rather than repeating every frame")
	game.state.ap = 1
	page._process(0.1)
	check(game.item(page.it_uid).evidence.has("TOL-001") and game.state.ap==0,"observation retries when AP becomes available and charges once")
	for i in 12: page._process(0.1)
	check(calls.check==2,"successful observation does not rebuild and save on subsequent frames")
	shell.queue_free()
	await settle()
	quit(1 if failures else 0)
