extends SceneTree
## Real inspector waits while a player hides stock and then confirms the search.
var failures := 0
func _initialize() -> void: call_deferred("run")
func frames() -> void:
	for i in 12: await process_frame
func check(ok: bool, message: String) -> void:
	print("INSPECTION UI ","PASS " if ok else "FAIL ",message)
	if not ok: failures += 1
func button(node: Node, text: String) -> Button:
	if node is Button and node.text.contains(text) and not node.is_queued_for_deletion(): return node
	for child in node.get_children():
		var found := button(child,text)
		if found != null: return found
	return null
static func fixture() -> Dictionary:
	for n in 5000:
		var s := Model.create("PREPARE-SEARCH-%d" % n)
		s.day = 4
		s.risk = 100
		NightCrime.ensure_day(s)
		if NightCrime.inspection_pending(s):
			s.inventory = []
			s.ap = 0
			s.cash = 200
			for options in [{"stolen":true,"sourceVerified":false},{"stolen":true,"sourceVerified":false,"location":"isolation","sealed":true},{"stolen":true,"sourceVerified":false},{"authentic":false,"sourceVerified":false}]:
				var item := Model.new_item(s,"WCH-002",options)
				s.inventory.append(item)
			return s
	return {}
func run() -> void:
	var game = root.get_node("Game")
	game.prefs.reduced_motion = true
	game.prefs.sound = false
	game.state = fixture()
	check(not game.state.is_empty(),"natural daily draw supplies a real inspection")
	if game.state.is_empty(): quit(1); return
	var hidden_uid: String = game.state.inventory[0].uid
	var original_hidden: String = game.state.inventory[1].uid
	var found_uid: String = game.state.inventory[2].uid
	var fake_uid: String = game.state.inventory[3].uid
	game.dispatch({"type":"ARRIVE_INSPECTION"})
	var shell = load("res://main.tscn").instantiate()
	root.add_child(shell)
	await frames()
	shell._close_title()
	await frames()
	var prepare := button(shell.page.actions,"先整理物品")
	check(prepare != null,"inspector offers preparation before searching")
	if prepare == null:
		shell.queue_free(); await frames(); quit(1); return
	prepare.pressed.emit()
	await frames()
	check(shell.workspace_open() and shell.workspace_shell.page_name == "warehouse","preparation opens the real warehouse")
	check(game.state.cash == 200 and game.state.inventory.size() == 4 and game.state.nightCrime.lastInspection.is_empty(),"entering the warehouse does not auto-inspect")
	shell.workspace_shell.page.select(hidden_uid)
	await frames()
	var isolate := button(shell.workspace_shell.page,"放入隔离柜")
	check(isolate != null and not isolate.disabled,"a real isolation action is available at zero AP")
	if isolate != null: isolate.pressed.emit()
	await frames()
	check(Model.find_inventory(game.state,hidden_uid).location == "isolation" and game.state.cash == 200,"player can hide an original while officer waits")
	shell.close_workspace()
	await frames()
	var search := button(shell.page.actions,"整理好了，开始检查")
	check(search != null and not search.disabled,"returning exposes explicit search confirmation")
	if search != null: search.pressed.emit()
	await frames()
	check(game.state.cash == 170 and game.state.ap == 0,"one confirmed inspection assesses a flat30 with no AP")
	check(Model.find_inventory(game.state,found_uid) == null and Model.find_inventory(game.state,hidden_uid) != null and Model.find_inventory(game.state,original_hidden) != null and Model.find_inventory(game.state,fake_uid) != null,"only visible stolen stock is confiscated")
	shell.queue_free()
	await frames()
	print("INSPECTION UI failures=",failures)
	quit(1 if failures else 0)
