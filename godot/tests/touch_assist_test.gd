extends SceneTree
## Phones frame the working shop and give small buttons finger-sized targets.
const TouchAssist = preload("res://scripts/app/touch_assist.gd")
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	print("TOUCH ASSIST ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func frame() -> void:
	await process_frame
	await process_frame
func button(node: Node, text: String) -> Button:
	for child in node.get_children():
		if child is Button and (child as Button).text == text and (child as Button).is_visible_in_tree():
			return child
		var found := button(child, text)
		if found != null:
			return found
	return null
func run() -> void:
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	game.state = Model.create("TOUCH-ASSIST")
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frame()
	shell._close_title()
	await frame()
	# A 430 x 733 pt phone shows roughly 0.4 CSS px per shop unit.
	var scale := 0.4
	shell.touch_scale_override = scale
	var greet := button(shell, "接待下一位来客")
	var close := button(shell, "打烊结算")
	check(greet != null and close != null, "the idle till shows its two small buttons")
	var rect := greet.get_global_rect()
	check(rect.size.y * scale < 20.0, "the till button is far below finger size on a phone")
	var above := Vector2(rect.get_center().x, rect.position.y - 25.0)
	check(rect.has_point(TouchAssist.snap(above, shell.root_ui, scale)), "a touch 10 CSS px above a small button lands on it")
	var far := Vector2(rect.get_center().x, rect.position.y - 60.0)
	check(TouchAssist.snap(far, shell.root_ui, scale) == far, "a touch well away from the button stays where it is")
	var inside := close.get_global_rect().get_center()
	check(TouchAssist.snap(inside, shell.root_ui, scale) == inside, "a touch inside a neighbouring button is never moved")
	var near_close := Vector2(close.get_global_rect().position.x + 4.0, close.get_global_rect().position.y - 20.0)
	check(close.get_global_rect().has_point(TouchAssist.snap(near_close, shell.root_ui, scale)), "between two buttons the nearer one receives the touch")
	var bell: Button = null
	for candidate in shell.root_ui.find_children("*", "Button", true, false):
		if (candidate as Button).tooltip_text.begins_with("接客铃"):
			bell = candidate
	var beside_bell := bell.get_global_rect().position - Vector2(12, 12)
	check(TouchAssist.snap(beside_bell, shell.root_ui, scale) == beside_bell, "finger-sized fixtures do not attract nearby touches")
	check(TouchAssist.snap(above, shell.root_ui, 1.0) == above, "at desktop scale the same touch is left alone")
	close.disabled = true
	check(TouchAssist.snap(near_close, shell.root_ui, scale) == near_close, "a disabled button does not pass its touch to a neighbour")
	close.disabled = false
	check(greet.get_global_rect().has_point(shell.place_touch(above)), "the shell places a near miss on the till button")
	shell.go("report")
	for i in 20:
		await process_frame
	var inner = shell.workspace_shell
	inner.touch_scale_override = scale
	var small: Button = null
	for candidate in inner.root_ui.find_children("*", "Button", true, false):
		var b := candidate as Button
		if b.is_visible_in_tree() and not b.disabled and b.size.y * scale < 30.0 and b.size.y > 8.0:
			small = b
			break
	check(small != null, "the drawer has a small button")
	if small != null:
		var inner_rect := small.get_global_rect()
		var to_outer: Transform2D = shell.workspace_container.get_global_transform_with_canvas()
		var ratio: Vector2 = shell.workspace_logical_size / shell.workspace_container.size
		var miss: Vector2 = to_outer * (Vector2(inner_rect.get_center().x, inner_rect.position.y - 10.0) / ratio)
		var landed: Vector2 = (to_outer.affine_inverse() * shell.place_touch(miss)) * ratio
		check(inner_rect.has_point(landed), "a near miss inside an open drawer lands on the drawer's own button")
	shell.close_workspace()
	await frame()
	# Phones frame the working shop instead of the whole wall.
	root.size = Vector2i(733, 430)
	shell.phone_override = true
	shell._fit()
	await frame()
	var visible := root.get_visible_rect().size
	check(visible.x < 1800.0 and visible.x >= shell.PHONE_VIEW.size.x - 1.0, "a phone enlarges the shop beyond the full 1920 wide picture")
	var left: float = shell.CENTER.x + shell.view_shift.x - visible.x * 0.5
	var top: float = shell.CENTER.y + shell.view_shift.y - visible.y * 0.5
	var shown := Rect2(left, top, visible.x, visible.y).grow(1.0)
	check(shown.encloses(shell.PHONE_VIEW), "every fixture and readout stays on the phone screen")
	var offset: Vector2 = shell.counter_offset()
	for control in shell.root_ui.find_children("*", "BaseButton", true, false):
		var b := control as BaseButton
		if b.is_visible_in_tree() and shell.page.is_ancestor_of(b):
			var where := b.get_global_rect()
			if not Rect2(Vector2.ZERO, visible).grow(1.0).encloses(where):
				check(false, "counter control is cut off on a phone: %s %s %s" % [b.get("text"), b.tooltip_text, where])
	check(offset.x < 0.0, "the counter controls follow the enlarged picture")
	quit(1 if failures else 0)
