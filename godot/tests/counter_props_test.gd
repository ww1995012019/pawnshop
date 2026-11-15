extends SceneTree
var failures:=0
func _initialize():call_deferred("run")
func check(ok:bool,label:String):
 print("PROPS ","PASS " if ok else "FAIL ",label)
 if not ok:failures+=1
func frames():
 for i in 8:await process_frame
func run():
 root.size=Vector2i(1920,1080)
 var game=root.get_node("Game")
 game.new_game("COUNTER-PROPS");game.prefs.sound=false;game.prefs.reduced_motion=true
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
 var page=shell.page
 for control_name in ["CounterSceneProps","ShowroomDoor","CounterLampSwitch","CounterDrawerToggle"]:
  check(page.find_child(control_name,true,false)==null,"removed fixture control: "+control_name)
 check(not page.display_goods.get_v_scroll_bar().visible,"cabinet hides scrollbar when goods fit")
 var grid=page.display_goods.find_child("CounterDisplayGrid",true,false)
 for key in grid.get_children():
  if String(key.name).begins_with("showroom_empty_display_"):
   check(key.text=="" and key.get_theme_stylebox("normal").bg_color.a==0,"empty cabinet slots have no plus or frame")
 var room=page.showroom
 var uid: String=game.state.inventory[0].uid
 room.place_original(uid,"warehouse",4)
 await frames()
 check(game.state.showroomLayout.warehouse[uid]==4,"watch placement remains available")
 shell.queue_free();await frames();quit(1 if failures else 0)
