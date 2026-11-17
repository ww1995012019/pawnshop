extends SceneTree
## Dense storage must keep polling cheap and update only the moved original.
var failures := 0
func _initialize(): call_deferred("run")
func frames():
 for i in 8: await process_frame
func check(ok: bool, label: String):
 print("WAREHOUSE DRAG PERF ","PASS " if ok else "FAIL ",label)
 if not ok: failures += 1
static func fixture() -> Dictionary:
 var s: Dictionary = load("res://tests/merchant_snapshot_performance_test.gd").fixture()
 s.trade = null
 s.storageExpansion = WarehouseExpansion.default_state(5)
 var originals: Array = s.inventory.duplicate()
 s.inventory = []
 for it in originals: Model.put_in(s,it)
 return s
func run():
 var game = root.get_node("Game")
 game.prefs.sound = false
 game.prefs.reduced_motion = true
 game.state = fixture()
 var shell = load("res://main.tscn").instantiate()
 root.add_child(shell); await frames(); shell._close_title()
 shell.go("warehouse"); await frames()
 var page = shell.active_shell().page
 var uid: String = game.state.inventory[0].uid
 page.select(uid); await frames()
 var bridge = load("res://scripts/app/web_touch.gd").new()
 root.add_child(bridge); bridge.setup(shell)
 var start := Time.get_ticks_usec()
 var first: Dictionary = bridge.snapshot()
 var cold := Time.get_ticks_usec()-start
 start = Time.get_ticks_usec()
 var latest: Dictionary
 for i in 20: latest = bridge.snapshot()
 var warm := (Time.get_ticks_usec()-start)/20.0
 print("WAREHOUSE SNAPSHOT cold=%.3fms warm=%.3fms" % [cold/1000.0,warm/1000.0])
 check(warm<maxf(1000.0,cold*0.25),"unchanged status polling reuses the rotation search")
 check(latest.warehouse_can_rotate and latest.warehouse_can_rotate==first.warehouse_can_rotate,"cached permission preserves the real answer")
 var tile = weakref(page.grid.tiles[uid])
 var other_uid: String = game.state.inventory[1].uid
 var other_tile = weakref(page.grid.tiles[other_uid])
 var cabinet = weakref(page.display_grid.get_child(0))
 var counter_tile = weakref(shell.page.stock_grid.get_child(0))
 var cash: float = game.state.cash
 var ap: float = game.state.ap
 check(game.dispatch({"type":"MOVE","uid":uid,"x":0,"y":27,"rotated":false}),"a valid drop still uses the model reducer")
 await frames()
 check(is_instance_valid(tile.get_ref()) and is_instance_valid(other_tile.get_ref()),"moving one watch keeps existing warehouse controls")
 check(is_instance_valid(cabinet.get_ref()) and is_instance_valid(counter_tile.get_ref()),"a warehouse move does not rebuild display or hidden counter controls")
 check(page.grid.tiles[uid].position.is_equal_approx(Vector2(0,27)*page.cell_size+Vector2(4,4)),"the original tile follows the committed position")
 var saved = JSON.parse_string(FileAccess.get_file_as_string(game.SAVE_PATH))
 check(Model.find_inventory(saved,uid).y==27 and game.state.cash==cash and game.state.ap==ap,"drop persists position without charging cash or AP")
 game.dispatch({"type":"MOVE","uid":uid,"x":1,"y":0,"rotated":false})
 check(game.item(uid).y==27,"overlapping drop remains rejected")
 # A full warehouse cannot accommodate the selected 2x1 rotation.
 game.dispatch({"type":"MOVE","uid":uid,"x":0,"y":0,"rotated":false})
 while game.state.inventory.size()<150:
  var it := Model.new_item(game.state,"WCH-001")
  if not Model.put_in(game.state,it): break
 page._refresh(); await frames()
 check(not page.can_rotate_selected(),"a full warehouse reports rotation blocked")
 game.dispatch({"type":"STORE_ITEM","uid":other_uid,"location":"isolation"})
 check(page.can_rotate_selected(),"moving an original out invalidates the blocked rotation result")
 shell.queue_free(); bridge.queue_free(); await frames()
 quit(1 if failures else 0)
