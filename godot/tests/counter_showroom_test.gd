extends SceneTree
var failures := 0
func _initialize(): call_deferred("run")
func check(ok: bool, label: String):
 print("SHOWROOM ", "PASS " if ok else "FAIL ", label)
 if not ok: failures += 1
func run():
 var game = root.get_node("Game")
 game.new_game("SHOWROOM")
 game.prefs.sound = false
 game.prefs.reduced_motion = true
 game.state.inventory = []
 var it = Model.new_item(game.state,"WCH-007",{"location":"display"})
 game.state.inventory.append(it)
 var uid: String = it.uid
 var cash = game.state.cash
 var ap = game.state.ap
 game.dispatch({"type":"COUNTER_PREVIEW","uid":uid})
 check(game.state.get("counterPreviewUid","") == uid,"taking an original records its UID")
 check(game.state.inventory.size()==1 and game.item(uid).location=="display" and game.state.cash==cash and game.state.ap==ap,"preview never duplicates goods or changes economics")
 game.save()
 var restored = JSON.parse_string(FileAccess.get_file_as_string(game.SAVE_PATH))
 check(restored.get("counterPreviewUid","")==uid,"selection survives save")
 game.dispatch({"type":"COUNTER_PREVIEW","uid":"missing"})
 check(game.state.get("counterPreviewUid","")==uid,"invalid selection preserves held original")
 game.dispatch({"type":"COUNTER_PREVIEW","uid":""})
 check(game.state.get("counterPreviewUid","")=="","return clears selection")
 game.item(uid).sealed = true
 game.dispatch({"type":"COUNTER_PREVIEW","uid":uid})
 check(game.state.get("counterPreviewUid","")=="","sealed goods cannot be taken")
 game.item(uid).sealed = false
 game.item(uid).location = "isolation"
 game.dispatch({"type":"COUNTER_PREVIEW","uid":uid})
 check(game.state.get("counterPreviewUid","")=="","isolated goods cannot be taken")
 game.item(uid).location = "display"
 var shell = load("res://main.tscn").instantiate()
 root.add_child(shell)
 for i in 8: await process_frame
 shell._close_title()
 for i in 4: await process_frame
 check(shell.page.get("showroom") != null,"PC showroom is attached")
 if shell.page.get("showroom") != null:
  var room = shell.page.showroom
  room.select_original(uid)
  for i in 4: await process_frame
  check(room.selected_uid==uid and room.preview.visible,"selected watch appears on counter")
  var displayed = shell.page.display_goods.find_child("stock_recommend_"+uid,true,false)
  check(displayed.disabled,"held original cannot be picked twice from cabinet")
  check(room.has_method("flip_original"),"counter watch supports physical flip")
  if room.has_method("flip_original"):
   room.flip_original()
   check(room.preview_back,"reduced-motion flip shows the back immediately")
  room.open_tool("TOL-001")
  for i in 8: await process_frame
  check(shell.workspace_open() and shell.workspace_shell.page.it_uid==uid and shell.workspace_shell.page.tool=="TOL-001","tool opens on the exact original")
  room.return_original()
  check(room.selected_uid==uid,"workspace blocks counter actions")
  shell.close_workspace(true)
  for i in 8: await process_frame
  room.return_original()
  for i in 4: await process_frame
  check(room.selected_uid=="" and not room.preview.visible,"return restores empty inspection mat")
  game.item(uid).sealed = true
  shell.page._stock_clicked(uid,false,null)
  for i in 6: await process_frame
  check(shell.workspace_open() and shell.workspace_shell.page_name=="warehouse","restricted goods retain warehouse management access")
  if shell.workspace_open(): shell.close_workspace(true)
  for i in 6: await process_frame
  game.item(uid).sealed = false
  game.prefs.reduced_motion = false
  room.select_original(uid)
  check(room.selected_uid==uid,"animated selection begins on original")
  room.select_original(uid)
  await create_timer(.5).timeout
  check(room.preview.position.is_equal_approx(Vector2(1100,490)),"rapid input settles watch animation")
  room.flip_original()
  room.flip_original()
  await create_timer(.4).timeout
  check(room.preview_back and is_equal_approx(room.preview.scale.x,1.0),"animated flip rejects overlapping clicks and settles")
  game.state.inventory.clear()
  room.refresh()
  check(room.selected_uid=="","removed originals leave no stale preview")
 shell.queue_free()
 for i in 3: await process_frame
 quit(1 if failures else 0)
