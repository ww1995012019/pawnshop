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
 check(page.get("props")!=null,"independent scene props exist")
 if page.get("props")!=null:
  var props=page.props
  props.toggle_lamp()
  check(not props.lamp_on and props.lamp_shade.modulate.a>0.5,"lamp off visibly dims the painted lamp")
  props.toggle_lamp()
  check(props.lamp_on and props.lamp_shade.modulate.a==0,"lamp on restores warm light")
  var toggle=page.find_child("CounterDrawerToggle",true,false)
  var point=root.get_final_transform()*toggle.get_global_rect().get_center()
  var motion:=InputEventMouseMotion.new();motion.position=point;motion.global_position=point;Input.parse_input_event(motion);await frames()
  for pressed in [true,false]:
   var event:=InputEventMouseButton.new();event.position=point;event.global_position=point;event.button_index=MOUSE_BUTTON_LEFT;event.button_mask=MOUSE_BUTTON_MASK_LEFT if pressed else 0;event.pressed=pressed
   Input.parse_input_event(event);await frames()
  check(props.drawer_open,"physical mouse reaches drawer button")
  if not props.drawer_open: props.toggle_drawer()
  check(props.drawer_open and props.drawer_progress==1.0,"cash drawer opens with reduced motion")
  props.toggle_drawer()
  check(not props.drawer_open and props.drawer_progress==0.0,"cash drawer closes")
  page.workspace_state_changed(true)
  props.toggle_lamp();props.toggle_drawer()
  check(props.lamp_on and not props.drawer_open,"workspace guards scene props")
  page.workspace_state_changed(false)
  game.prefs.reduced_motion=false
  props.toggle_drawer();props.toggle_drawer();props.toggle_lamp();props.toggle_lamp()
  await create_timer(.5).timeout
  check(props.drawer_progress<.01 and props.lamp_shade.modulate.a<.01,"rapid opposite inputs settle cleanly")
  props.payment_started()
  await create_timer(.4).timeout
  check(props.drawer_open,"payment opens drawer")
  props.payment_finished()
  await create_timer(.4).timeout
  check(not props.drawer_open,"payment closes drawer")
  var room=page.showroom
  var uid: String=game.state.inventory[0].uid
  var data={"kind":"showroom_original","uid":uid}
  check(room.can_place(data,"warehouse",1),"valid stock supports drop")
  room.toggle_door()
  check(not room.can_place(data,"display",1),"closed cabinet rejects drop")
  game.item(uid).location="display"
  room.select_original(uid)
  check(room.selected_uid=="","closed door blocks drawer shortcut to a displayed original")
  check(not room.can_place(data,"warehouse",1),"closed source cabinet rejects stale drag")
  game.item(uid).location="warehouse"
  room.toggle_door()
  check(not room.can_place({"kind":"showroom_original","uid":"sold"},"warehouse",0),"stale sold payload rejected")
  room.place_original(uid,"warehouse",4)
  await frames()
  check(game.state.showroomLayout.warehouse[uid]==4,"UI drop reaches canonical layout")
 shell.queue_free();await frames();quit(1 if failures else 0)
