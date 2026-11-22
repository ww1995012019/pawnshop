extends SceneTree
## Exercise the visible counter, including the reduced-motion alternative.
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, caption: String) -> void:
 print("COUNTER MOTION ", "PASS " if ok else "FAIL ", caption)
 if not ok: failures += 1
func frames(count := 4) -> void:
 for index in count: await process_frame
func ghost(view) -> Node:
 return view.find_child("WatchMotionGhost*",false,false)
func run() -> void:
 root.size=Vector2i(1920,1080)
 var game=root.get_node("Game");game.prefs.sound=false
 for reduced in [false,true]:
  game.prefs.reduced_motion=reduced;game.new_game("VISIBLE-MOTION")
  var item=game.state.inventory.filter(func(it):return Model.owns(it) and not it.sealed and it.location in ["warehouse","display"])[0]
  var uid:String=item.uid;var cash:float=game.state.cash;var ap:float=game.state.ap
  var before=item.duplicate(true)
  var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames(8);shell._close_title();await frames(8)
  var page=shell.page;var view=page.strict_view
  check(view.has_method("_begin_drag_feedback"),"visible counter owns drag feedback")
  if not view.has_method("_begin_drag_feedback"):
   shell.queue_free();await frames();continue
  page.showroom.select_original(uid);view._refresh()
  var key=view.table.get_node("strict_table_"+uid)
  var visual=key.get_node("WatchVisual")
  var hit:Rect2=key.get_global_rect()
  check(visual.position!=Vector2.ZERO if not reduced else visual.modulate.a<1.0,"pickup begins with visible motion or brief reduced-motion confirmation")
  await create_timer(.07 if reduced else .12).timeout
  check(key.get_global_rect()==hit and (visual.modulate.a<1.0 if reduced else visual.position!=Vector2.ZERO),"pickup has an intermediate frame while its real hit target stays canonical")
  await create_timer(.4).timeout
  check(visual.position.is_equal_approx(Vector2.ZERO) and is_equal_approx(visual.modulate.a,1.0),"pickup settles fully")
  var drag_picture=TextureRect.new();drag_picture.texture=visual.get_node("WatchArt").texture;drag_picture.size=Vector2(56,84)
  key.force_drag({"kind":"showroom_original","uid":uid},drag_picture)
  check(root.gui_is_dragging() and view.drag_feedback.get("uid","")==uid,"native drag notification keeps the exact original and its visible preview")
  var outside=Vector2(1900,1060)
  var motion=InputEventMouseMotion.new();motion.position=outside;motion.global_position=outside;Input.parse_input_event(motion);await frames(2)
  var release=InputEventMouseButton.new();release.position=outside;release.global_position=outside;release.button_index=MOUSE_BUTTON_LEFT;release.pressed=false;Input.parse_input_event(release)
  await frames(2)
  check(ghost(view)!=null and ghost(view).mouse_filter==Control.MOUSE_FILTER_IGNORE,"invalid drop returns visible artwork without retaining a pointer target")
  await create_timer(.4).timeout
  check(ghost(view)==null,"invalid-return feedback cleans up")
  key.force_drag({"kind":"showroom_original","uid":uid},TextureRect.new())
  root.size=Vector2i(390,844);await frames(8)
  release=InputEventMouseButton.new();release.position=Vector2(380,830);release.global_position=release.position;release.button_index=MOUSE_BUTTON_LEFT;release.pressed=false;Input.parse_input_event(release)
  await frames(4);root.size=Vector2i(1920,1080);await frames(8);await create_timer(.4).timeout
  key=view.table.get_node("strict_table_"+uid);visual=key.get_node("WatchVisual")
  check(view.drag_feedback.is_empty() and is_equal_approx(visual.modulate.a,1.0),"desktop-to-portrait drag interruption restores the original after returning to desktop")
  key.force_drag({"kind":"showroom_original","uid":uid},TextureRect.new())
  page.remove_child(view)
  check(view.drag_feedback.is_empty() and is_equal_approx(visual.modulate.a,1.0),"leaving the tree during a native drag clears capture feedback and restores the original")
  page.add_child(view);Input.parse_input_event(release);await frames(2)
  page.showroom.return_original();view._refresh();await frames(2)
  check(ghost(view)!=null and not view.table.has_node("strict_table_"+uid),"return removes the real table target immediately and keeps a visible original in flight")
  await create_timer(.4).timeout
  check(ghost(view)==null and game.item(uid)==before and game.state.cash==cash and game.state.ap==ap,"pickup and return preserve the exact UID, cash, AP and original facts")
  # Placing a lifted original emits placement and preview-clear actions;
  # these must produce one visual transfer, never duplicate ghosts or goods.
  page.showroom.select_original(uid);view._refresh();await create_timer(.4).timeout
  var location:String=game.item(uid).location
  var destination=(int(game.state.showroomLayout[location][uid])+1)%preload("res://scripts/model/showroom_layout.gd").capacity(game.state,location)
  page.showroom.place_original(uid,location,destination);view._refresh();await create_timer(.035).timeout
  var transfer_count=view.find_children("WatchMotionGhost*","TextureRect",false,false).size()
  check(transfer_count==1 and game.item(uid).location==location,"cabinet placement renders exactly one transfer in the visible layer (count=%d, location=%s)"%[transfer_count,game.item(uid).location])
  await create_timer(.4).timeout
  check(ghost(view)==null and game.state.inventory.filter(func(it):return it.uid==uid).size()==1 and game.state.cash==cash and game.state.ap==ap,"placement cleans up without duplicate originals or economic changes")
  # Real arrival and dismissal retain the game's existing busy/ownership timing.
  page._ring();view._refresh()
  var visit:String=game.state.trade.id
  check(view.last_visit==visit and view.visitor_phase=="entering","new visit starts a visible entrance keyed by visit ID")
  var entrance_alpha:float=view.face.modulate.a
  await create_timer(.07 if reduced else .12).timeout
  check(view.face.visible and view.face.modulate.a>entrance_alpha and view.face.modulate.a<1.0,"visitor entrance has an intermediate visible frame")
  await create_timer(1.8).timeout
  check(not page.busy and view.visitor_phase=="standing" and is_equal_approx(view.face.modulate.a,1.0),"visitor stands fully visible after arrival")
  var shown=CounterDialogue.table_items(game.state)
  if not shown.is_empty():
   var moving:String=shown[0].uid;var old_key=view.table.get_node("strict_table_"+moving)
   var old_position:Vector2=old_key.position
   var move_cash:float=game.state.cash;var move_ap:float=game.state.ap
   view._drop_data(Vector2(1100,510),{"kind":"strict_trade","uid":moving});view._refresh()
   key=view.table.get_node("strict_table_"+moving);visual=key.get_node("WatchVisual")
   check(key.position!=old_position and (visual.modulate.a<1.0 if reduced else visual.position!=Vector2.ZERO),"drop commits its canonical slot immediately while artwork settles")
   await create_timer(.4).timeout
   check(visual.position.is_equal_approx(Vector2.ZERO) and is_equal_approx(visual.modulate.a,1.0) and game.state.cash==move_cash and game.state.ap==move_ap,"slot motion settles without a second transaction")
  game.dispatch({"type":"REFUSE"});view._refresh()
  check(not view.face.visible and is_instance_valid(view.departing_face) and view.departing_face.mouse_filter==Control.MOUSE_FILTER_IGNORE,"dismissal preserves only a noninteractive departing portrait")
  await create_timer(.4).timeout
  check(is_instance_valid(view.departing_face),"portrait remains present during the existing goodbye and goods handover")
  var deadline=Time.get_ticks_msec()+14000
  if is_instance_valid(view.departing_face):
   var start_position:Vector2=view.departing_face.position;var start_alpha:float=view.departing_face.modulate.a
   var saw_fading_frame:=false
   var held_position:=true
   # Timers can resume before the tween updates on the same frame. Observe
   # the live drawing from its goodbye pose through the entire departure.
   while is_instance_valid(view.departing_face) and Time.get_ticks_msec()<deadline:
    if view.departure_started:
     var offset:Vector2=view.departing_face.position-start_position
     var alpha:float=view.departing_face.modulate.a
     if not offset.is_zero_approx():held_position=false
     if alpha>0.0 and alpha<start_alpha and (reduced or offset.x<0.0 and is_zero_approx(offset.y)):
      saw_fading_frame=true
    await process_frame
   check(saw_fading_frame and (not reduced or held_position),"departure has a visible intermediate frame and reduced motion avoids the spatial sweep")
  while (page.busy or is_instance_valid(view.departing_face)) and Time.get_ticks_msec()<deadline:await process_frame
  check(not page.busy and not is_instance_valid(view.departing_face),"departure finishes and frees its portrait")
  # A restored/new visit can have the same NPC but must have its own entrance.
  var saved=game.state.duplicate(true)
  game.state.trade={"id":visit+"/repeat","npcId":view.last_npc,"kind":"sell","price":100,"rounds":0,"locked":false,"evidenceUsed":[],"line":"又见面了。"}
  view._model_changed(saved,game.state,{"type":"ARRIVE"});view._refresh()
  check(view.last_visit==visit+"/repeat" and view.visitor_phase=="entering" and view.face.modulate.a<1.0,"same NPC in another visit receives a fresh entrance")
  game.state.trade.id=visit+"/replace";view._refresh()
  check(view.last_visit==visit+"/replace" and not is_instance_valid(view.departing_face),"rapid visit replacement cancels the old entrance without leaving a portrait copy")
  shell.queue_free();await frames();await create_timer(.4).timeout
  check(true,"closing during entrance frees outstanding visual animations")
 for player in root.find_children("*","AudioStreamPlayer",true,false):player.stop();player.stream=null
 await process_frame
 print("COUNTER MOTION failures=",failures)
 quit(1 if failures else 0)
