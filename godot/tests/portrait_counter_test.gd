extends SceneTree
var failures := 0
func _initialize(): call_deferred("run")
func frames():
 for i in 12: await process_frame
func check(ok, message):
 print("PORTRAIT ", "PASS " if ok else "FAIL ", message)
 if not ok: failures += 1
func run():
 root.size = Vector2i(390,844)
 var game = root.get_node("Game")
 game.prefs.sound = false
 game.prefs.reduced_motion = true
 game.new_game("PORTRAIT")
 var shell = load("res://main.tscn").instantiate()
 root.add_child(shell)
 await frames()
 shell._close_title()
 await frames()
 var mobile = shell.page.get_node_or_null("PortraitCounter")
 check(mobile != null and mobile.is_visible_in_tree(), "portrait has its own upright counter presentation")
 if mobile != null:
  check(mobile.get_node("Layout/Header").size.x <= 480, "header stays within portrait width")
  mobile.primary.pressed.emit()
  await frames()
  check(game.state.trade != null, "service action opens real visitor trade")
  check(mobile.item_name.text != "", "trade has a readable goods or visitor state")
  shell.go("inspect")
  await frames()
  check(shell.workspace_open(), "inspection opens from mobile")
  check(shell.workspace_logical_size.x < 600, "workspace uses portrait logical width")
  root.size = Vector2i(1440,900)
  await frames()
  check(shell.workspace_shell.page.instrument_panel.visible, "open inspection restores desktop tools on rotation")
  root.size = Vector2i(390,844)
  await frames()
  check(shell.workspace_shell.page.portrait_tools.get_child_count() == 3, "open inspection restores portrait tools on rotation")
  shell.close_workspace()
  await frames()
  for destination in ["warehouse","repair","orders","report"]:
   shell.go(destination)
   await frames()
   check(shell.workspace_logical_size.x < 600, destination+" keeps portrait viewport")
   if destination == "orders":
    check(shell.workspace_shell.page.board.get_combined_minimum_size().x <= shell.workspace_shell.content_rect().size.x, "order tabs fit portrait width")
   shell.close_workspace()
   await frames()
 root.size = Vector2i(1440,900)
 await frames()
 if mobile != null:
  check(not mobile.visible, "desktop returns to original counter")
  check(shell.page.bubble.visible, "rotation preserves active customer dialogue")
 shell.queue_free()
 await frames()
 quit(1 if failures else 0)
