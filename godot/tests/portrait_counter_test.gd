extends SceneTree
## Native counterpart of upright-browser landscape-only presentation.
var failures := 0
func _initialize(): call_deferred("run")
func frames():
 for i in 12: await process_frame
func check(ok, message):
 print("ORIENTATION ", "PASS " if ok else "FAIL ", message)
 if not ok: failures += 1
func run():
 root.size = Vector2i(390,844)
 var game = root.get_node("Game")
 game.prefs.sound = false
 game.prefs.reduced_motion = true
 game.new_game("LANDSCAPE-ONLY")
 var shell = load("res://main.tscn").instantiate()
 root.add_child(shell)
 await frames()
 check(not shell.portrait_mode(), "a narrow desktop window never selects the retired mobile portrait flow")
 # Native mobile OS supplies a landscape window; Web rotates its effective canvas.
 root.size = Vector2i(844,390)
 shell.phone_override = true
 shell._fit()
 await frames()
 shell._close_title()
 await frames()
 var mobile = shell.page.find_child("LandscapeCounter",true,false)
 check(mobile != null and mobile.is_visible_in_tree(), "phone uses the landscape counter")
 check(shell.landscape_mode() and not shell.portrait_mode(), "phone has one landscape presentation")
 check(is_equal_approx(shell.touch_scale(),1.0), "native mobile logical units correspond to physical touch pixels")
 shell.page._ring()
 await frames()
 check(game.state.trade != null, "landscape primary opens a real visitor trade")
 for phone_size in [Vector2i(568,320),Vector2i(640,360),Vector2i(844,390),Vector2i(932,430)]:
  root.size = phone_size
  await frames()
  check(shell.landscape_mode() and not shell.portrait_mode(), "landscape persists at "+str(phone_size))
  check(shell.get_viewport().get_visible_rect().size.is_equal_approx(Vector2(phone_size)), "landscape logical canvas matches effective dimensions "+str(phone_size))
 root.size = Vector2i(844,390)
 await frames()
 shell.go("inspect")
 await frames()
 check(shell.workspace_open(), "inspection opens from landscape counter")
 var uid: String = shell.workspace_shell.page.it_uid
 var selected_tool: String = shell.workspace_shell.page.tool
 root.size = Vector2i(932,430)
 await frames()
 check(shell.workspace_shell.page.it_uid == uid and shell.workspace_shell.page.tool == selected_tool, "resize preserves inspection item and selected instrument")
 check(shell.workspace_logical_size.x > shell.workspace_logical_size.y, "inspection uses a landscape logical viewport")
 check(shell.workspace_shell.landscape_mode(), "nested workspace shares landscape presentation")
 check(shell.workspace_shell.touch_scale() > .5, "nested viewport retains readable physical touch scale")
 shell.close_workspace()
 await frames()
 check(not shell.workspace_open() and game.state.trade != null, "close preserves active visitor")
 for destination in ["warehouse","repair","orders","report"]:
  shell.go(destination)
  await frames()
  check(shell.workspace_shell.landscape_mode() and shell.workspace_logical_size.x > shell.workspace_logical_size.y, destination+" uses landscape viewport")
  shell.close_workspace()
  await frames()
 root.size = Vector2i(1440,900)
 shell.phone_override = false
 shell._fit()
 await frames()
 check(not shell.mobile_mode(), "desktop restores its original presentation")
 shell.queue_free()
 await frames()
 quit(1 if failures else 0)
