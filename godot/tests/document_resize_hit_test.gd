extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
 print("DOCUMENT GRIPS ","PASS " if ok else "FAIL ",message)
 if not ok: failures += 1
func frames() -> void:
 for frame in 6: await process_frame
func mouse(point: Vector2, down: bool) -> void:
 var event := InputEventMouseButton.new()
 event.button_index = MOUSE_BUTTON_LEFT
 event.pressed = down
 event.position = root.get_final_transform()*point
 event.global_position = event.position
 Input.parse_input_event(event)
 await frames()
func run() -> void:
 root.size = Vector2i(1920,1080)
 var game = root.get_node("Game")
 game.prefs.sound = false
 game.prefs.reduced_motion = true
 game.new_game("DOCUMENT-GRIPS")
 var shell = load("res://main.tscn").instantiate()
 root.add_child(shell)
 await frames()
 shell._close_title()
 shell.open_watch_manual("WCH-001")
 await frames()
 var doc = shell.root_ui.find_child("inspection_guide",true,false)
 for zoom in [0.35,0.7,1.0]:
  doc.set_document_zoom(zoom,false)
  doc.move_document(Vector2(220,140))
  await frames()
  var tr: Control = doc.find_child("document_corner_tr",true,false)
  var projected: Vector2 = (root.get_final_transform()*tr.get_global_transform()).get_scale()*tr.size
  check(projected.x >= 44 and projected.y >= 44,"resize hit area stays finger-sized at zoom "+str(zoom))
  var tip: Vector2 = doc.position + Vector2(doc.size.x*doc.scale.x,0)
  var outside: Vector2 = tip+Vector2(9,-9)/root.get_final_transform().get_scale()
  await mouse(outside,true)
  check(doc.resizing,"a real press just outside the paper corner begins resizing at zoom "+str(zoom))
  await mouse(outside,false)
  check(not doc.resizing,"releasing outside the paper ends the resize")
 doc.set_document_zoom(0.35,false)
 doc.move_document(Vector2(220,140))
 await frames()
 var close: Rect2 = doc.close_button.get_global_rect()
 var point := close.position+Vector2(close.size.x-1,1)
 await mouse(point,true)
 await mouse(point,false)
 check(not doc.visible and not doc.resizing,"expanded top-right hot zone never steals the close button")
 shell.queue_free()
 await frames()
 print("DOCUMENT GRIPS failures=",failures)
 quit(1 if failures else 0)
