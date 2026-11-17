extends SceneTree
var failures := 0
var checkpoints := 0
func _initialize(): call_deferred("run")
func frames():
 for i in 8: await process_frame
func check(ok: bool, label: String):
 print("REFURB PERF ", "PASS " if ok else "FAIL ", label)
 if not ok: failures += 1
func run():
 var game = root.get_node("Game")
 game.state = load("res://tests/watch_cleaning_performance_test.gd").fixture()
 game.prefs.sound = false
 game.prefs.reduced_motion = false
 game.changed.connect(func(_prev, _next, action):
  if action.type == "REFURB_PROGRESS": checkpoints += 1)
 var shell = load("res://main.tscn").instantiate()
 root.add_child(shell)
 await frames()
 shell._close_title()
 var uid: String = game.state.inventory[0].uid
 shell.go("repair",uid)
 await frames()
 var page = shell.active_shell().page
 page.open_refurb("blow")
 await frames()
 page.art.set_process(false)
 page.set_process(false)
 page.art.advance()
 checkpoints = 0
 for i in 45:
  page.operation_clock += 1.0/60.0
  page.art._process(1.0/60.0)
 check(checkpoints == 0,"continuous tool movement never serializes the whole inventory")
 var expected: Dictionary = page.art.progress_snapshot()
 page._save_operation()
 check(game.item(uid).refurbishment.operations.blow == expected,"pausing persists the latest exact tool position")
 page.art._process(10.0)
 check(game.item(uid).refurbishment.operations.blow.phase == "idle","end of segment automatically checkpoints progress")
 shell.queue_free()
 await frames()
 quit(1 if failures else 0)
