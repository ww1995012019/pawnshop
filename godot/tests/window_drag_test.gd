extends SceneTree
var failures := 0
var shell
func _initialize(): call_deferred("run")
func frames():
	for i in 10: await process_frame
func check(ok: bool, label: String):
	print("WINDOW DRAG ", "PASS " if ok else "FAIL ", label)
	if not ok: failures += 1
func screen_point(control: Control, point: Vector2) -> Vector2:
	return control.get_viewport().get_screen_transform() * control.get_global_transform_with_canvas() * point
func point_event(point: Vector2, pressed: bool):
	var event := InputEventMouseButton.new()
	event.position = point
	event.button_index = MOUSE_BUTTON_LEFT
	event.pressed = pressed
	Input.parse_input_event(event)
	await frames()
func move(point: Vector2):
	var event := InputEventMouseMotion.new()
	event.position = point
	Input.parse_input_event(event)
	await frames()
func drag(handle: Control, delta: Vector2):
	var point := screen_point(handle,Vector2(90,handle.size.y*0.5))
	await move(point)
	await point_event(point,true)
	await move(point+delta)
	await point_event(point+delta,false)
func title(node: Node, text: String) -> Control:
	for label in node.find_children("*","Label",true,false):
		if label.text == text: return label.get_parent()
	return null
func run():
	var kit = load("res://scripts/app/ui_kit.gd")
	root.size = Vector2i(1440,900)
	var game = root.get_node("Game")
	game.prefs.sound = false
	game.prefs.reduced_motion = true
	game.new_game("MOVABLE-WINDOWS")
	shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	var cash: float = game.state.cash
	var ap: float = game.state.ap
	for name in ["warehouse","inspect","repair","orders","report"]:
		shell.go(name)
		await frames()
		var frame: Control = shell.workspace_frame
		var before := screen_point(frame,Vector2.ZERO)
		await drag(shell.workspace_title.get_parent(),Vector2(110,60))
		var delta := screen_point(frame,Vector2.ZERO)-before
		check(delta.distance_to(Vector2(110,60)) < 2, name + " moves with the title bar at the rendered scale")
		var saved := frame.position
		shell._layout_workspace()
		await frames()
		check(frame.position.distance_to(saved)<1,name + " keeps its position after relayout")
		if name == "warehouse":
			shell.go("repair")
			await frames()
			shell.close_workspace()
			await frames()
			check(shell.workspace_frame == frame and frame.position.distance_to(saved)<1,"linked workspace Close restores the original dragged position")
		shell.go("counter")
		await frames()
	# Root and embedded modals must move without a CenterContainer snapping back.
	for embedded in [false,true]:
		if embedded:
			shell.go("warehouse")
			await frames()
		var active = shell.active_shell()
		var panel: Array = active.modal("可移动弹窗",560)
		var body: VBoxContainer = panel[0]
		var sheet: Control = active.modal_layer.find_child("ModalSheet",true,false)
		var action: Button = kit.button("内容操作","secondary",Vector2(180,44),16)
		var clicks := [0]
		action.pressed.connect(func():clicks[0]+=1)
		body.add_child(action)
		await frames()
		var before := screen_point(sheet,Vector2.ZERO)
		await drag(title(sheet,"可移动弹窗"),Vector2(75,45))
		check((screen_point(sheet,Vector2.ZERO)-before).distance_to(Vector2(75,45))<2,"modal moves in " + ("embedded" if embedded else "root") + " viewport")
		var moved := sheet.position
		body.add_child(kit.label("新增内容",18,kit.TEXT))
		await frames()
		check(sheet.position.distance_to(moved)<1,"modal content refresh preserves dragged position")
		var button_point := screen_point(action,action.size*0.5)
		await move(button_point)
		await point_event(button_point,true)
		await point_event(button_point,false)
		check(clicks[0]==1 and sheet.position.distance_to(moved)<1,"content buttons still activate without dragging the window")
		var close: Button = sheet.find_child("modal_close",true,false)
		var close_point := screen_point(close,close.size*0.5)
		await move(close_point)
		await point_event(close_point,true)
		await point_event(close_point,false)
		check(not active.modal_open(),"close button remains usable after dragging")
		if active.modal_open(): active.close_top_modal()
		shell.go("counter")
		await frames()
	shell.go("orders")
	await frames()
	await drag(shell.workspace_title.get_parent(),Vector2(10000,10000))
	var title_rect: Rect2 = shell.workspace_title.get_parent().get_global_rect()
	var visible: Rect2 = title_rect.intersection(shell.safe_area())
	check(visible.size.x>=120 and visible.size.y>=title_rect.size.y-1,"dragging to screen edges leaves a reachable title bar")
	root.size = Vector2i(390,844)
	shell.phone_override = true
	shell._fit()
	await frames()
	title_rect = shell.workspace_title.get_parent().get_global_rect()
	visible = title_rect.intersection(shell.safe_area())
	check(visible.size.x>=120 and visible.size.y>=title_rect.size.y-1,"viewport resize keeps a moved window reachable")
	check(game.state.cash==cash and game.state.ap==ap,"moving windows never spends cash or action points")
	shell.queue_free()
	await frames()
	quit(1 if failures else 0)
