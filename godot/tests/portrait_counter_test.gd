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
  for phone_size in [Vector2i(320,568),Vector2i(360,640),Vector2i(390,844),Vector2i(430,932)]:
   root.size = phone_size
   await frames()
   # The hidden landscape UI now has an allowed dialogue-only scroller.
   check(mobile.layout.find_children("*","ScrollContainer",true,false).is_empty(), "main counter never scrolls at "+str(phone_size))
   var bounds := Rect2(Vector2.ZERO,shell.get_viewport().get_visible_rect().size)
   check(bounds.encloses(mobile.primary.get_global_rect()) and bounds.encloses(mobile.more.get_global_rect()), "trade controls fit without swiping at "+str(phone_size))
  root.size = Vector2i(390,844)
  await frames()
  shell.page.bubble_label.text = "这件旧物的完整来历和交易说明。".repeat(60)
  mobile._refresh()
  await frames()
  check(mobile.layout.size.y <= shell.get_viewport().get_visible_rect().size.y+1, "long dialogue cannot grow the main screen")
  mobile.primary.pressed.emit()
  await frames()
  check(shell.modal_open(), "negotiation opens a separate sheet")
  var close = shell.modal_layer.find_child("modal_close",true,false)
  check(close is Button and close.is_visible_in_tree(), "negotiation has a visible close control")
  if close is Button:
   check(Rect2(Vector2.ZERO,shell.get_viewport().get_visible_rect().size).encloses(close.get_global_rect()), "close stays on screen")
   close.pressed.emit()
  else: shell.close_top_modal()
  await frames()
  check(not shell.modal_open(), "close returns to fixed counter without submitting")
  shell.go("inspect")
  await frames()
  check(shell.workspace_open(), "inspection opens from mobile")
  check(shell.workspace_logical_size.x < 600, "workspace uses portrait logical width")
  root.size = Vector2i(1440,900)
  await frames()
  check(shell.workspace_shell.page.portrait_tools.visible and not shell.workspace_shell.page.instrument_panel.visible, "open inspection restores desktop toolbar on rotation")
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
