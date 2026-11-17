extends SceneTree
## Migrated windows retain their original close connections and selected goods.
var failures := 0
func _initialize() -> void: call_deferred("run")
func frames(n := 8) -> void:
 for i in n: await process_frame
func check(ok: bool, message: String) -> void:
 print("SHARED CLOSE INTEGRATION ","PASS " if ok else "FAIL ",message)
 if not ok: failures += 1
func is_close(button: Button) -> bool:
 return button.text=="" and button.icon_alignment==HORIZONTAL_ALIGNMENT_CENTER and button.vertical_icon_alignment==VERTICAL_ALIGNMENT_CENTER and button.accessibility_name=="关闭"
func run() -> void:
 root.size = Vector2i(1920,1080)
 var game = root.get_node("Game")
 game.new_game("SHARED-CLOSE-INTEGRATION")
 game.prefs.sound = false
 game.prefs.reduced_motion = true
 var shell = load("res://main.tscn").instantiate()
 root.add_child(shell)
 await frames(15)
 shell._close_title()
 shell.open_watch_manual("WCH-001")
 await frames()
 var doc = shell.root_ui.find_child("inspection_guide",true,false)
 check(doc != null and is_close(doc.close_button),"floating document uses the centered accessible close")
 if doc != null:
  var closed := [0]
  doc.closed.connect(func(): closed[0] += 1)
  doc.close_button.pressed.emit()
  check(not doc.visible and closed[0]==1,"floating document still hides and emits one close event")
 shell.go("warehouse")
 await frames(15)
 var page = shell.active_shell().page
 var uid: String = game.state.inventory[0].uid
 page.open_item_menu(uid,page.shell.content_rect().get_center())
 await frames()
 var popup: Control = page.find_child("WarehouseItemMenu",true,false)
 var closes: Array[Node] = popup.find_children("*","Button",true,false).filter(func(b): return b.text=="" and b.tooltip_text=="关闭")
 check(closes.size()==1 and is_close(closes[0]),"independent warehouse menu uses shared icon-only close")
 var before := JSON.stringify(game.state)
 if closes.size()==1:
  closes[0].pressed.emit()
  await frames()
  check(page.find_child("WarehouseItemMenu",true,false)==null and page.selected==uid,"warehouse close dismisses only the menu and preserves selected UID")
 check(JSON.stringify(game.state)==before,"close does not alter inventory or business state")
 shell.queue_free()
 await frames()
 print("SHARED CLOSE INTEGRATION failures=",failures)
 quit(1 if failures else 0)
