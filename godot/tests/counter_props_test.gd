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
 var room=page.showroom
 var uid: String=game.state.inventory[0].uid
 room.place_original(uid,"warehouse",4)
 await frames()
 check(game.state.showroomLayout.warehouse[uid]==4,"watch placement remains available")
 shell.queue_free();await frames();quit(1 if failures else 0)
