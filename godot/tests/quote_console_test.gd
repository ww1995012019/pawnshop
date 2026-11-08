extends SceneTree
## Every quotation/trade control must remain inside its physical till.
var failures := 0
var shell
func _initialize() -> void: call_deferred("run")
func check(ok: bool, label: String) -> void:
	print("CONSOLE ","PASS " if ok else "FAIL ",label)
	if not ok: failures += 1
func frame() -> void:
	await process_frame
	await process_frame
func audit(label: String) -> void:
	await frame()
	var page = shell.page
	var bounds: Rect2 = page.terminal.get_global_rect()
	var buttons: Array = page.actions.get_children()
	for button in buttons:
		check(bounds.encloses(button.get_global_rect()),label+": "+button.text+" sits inside the device")
	for chip in page.chips.get_children():
		check(bounds.encloses(chip.get_global_rect()),label+": evidence control stays inside the device")
		for nudge in page.nudge_keys:
			check(not chip.get_global_rect().intersects(nudge.get_global_rect()),label+": evidence stays clear of price keys")
	for i in buttons.size():
		for j in range(i+1,buttons.size()):
			check(not buttons[i].get_global_rect().intersects(buttons[j].get_global_rect()),label+": action keys do not overlap")
func run() -> void:
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frame()
	shell._close_title()
	game.new_game("ORBITAL-P0")
	await audit("idle")
	var motion := InputEventMouseMotion.new()
	motion.position = root.get_final_transform() * (Vector2(1490,744) + shell.counter_offset())
	motion.global_position = motion.position
	Input.parse_input_event(motion)
	await frame()
	check(root.gui_get_hovered_control() == shell.page.fixture_buttons.inspect,"visible inspection equipment remains clickable through transparent till margin")
	for key in ["orders","people"]:
		check(shell.page.fixture_buttons[key].get_global_rect().end.y <= shell.page.terminal.get_global_rect().position.y,key+" nameplate remains visible above the till")
	game.state = Model.reduce(game.state,{"type":"ARRIVE"})
	shell.go("counter")
	await audit("buy")
	var lot = Model.trade_item(game.state)
	lot.evidence = GameData.def(lot.defId).tools.duplicate()
	shell.page._refresh()
	await audit("evidence")
	game.state = Model.reduce(game.state,{"type":"ACCEPT"})
	shell.go("counter")
	await audit("locked")
	game.new_game("ORBITAL-P0")
	game.state.cursor = 1
	game.state = Model.reduce(game.state,{"type":"ARRIVE"})
	shell.go("counter")
	await audit("sale waiting for stock")
	var stock: Dictionary = game.state.inventory[0]
	stock.working = true
	stock.condition = 1.0
	stock.sourceVerified = true
	stock.evidence = GameData.def(stock.defId).tools.duplicate()
	game.state = Model.reduce(game.state,{"type":"SELECT_TRADE","uid":stock.uid})
	shell.go("counter")
	await audit("sale selected")
	print("CONSOLE failures=",failures)
	shell.queue_free()
	await frame()
	quit(1 if failures else 0)
