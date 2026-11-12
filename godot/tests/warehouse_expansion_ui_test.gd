extends SceneTree
var failures:=0
func _initialize():call_deferred("run")
func frames(n:=12):
 for i in n:await process_frame
func check(ok: bool,label: String):
 print("WAREHOUSE UI ","PASS " if ok else "FAIL ",label)
 if not ok:failures+=1
func drag_original(page,from:Vector2,to:Vector2):
 var viewport=page.get_viewport()
 var press:=InputEventMouseButton.new();press.button_index=MOUSE_BUTTON_LEFT;press.button_mask=MOUSE_BUTTON_MASK_LEFT;press.pressed=true;press.position=from;press.global_position=from
 viewport.push_input(press,true);await frames(2)
 var start:=from+(to-from).normalized()*18.0
 var first:=InputEventMouseMotion.new();first.position=start;first.global_position=start;first.relative=start-from;first.button_mask=MOUSE_BUTTON_MASK_LEFT
 viewport.push_input(first,true);await frames(2)
 var motion:=InputEventMouseMotion.new();motion.position=to;motion.global_position=to;motion.relative=to-start;motion.button_mask=MOUSE_BUTTON_MASK_LEFT
 viewport.push_input(motion,true);await frames(3)
 var release:=InputEventMouseButton.new();release.button_index=MOUSE_BUTTON_LEFT;release.pressed=false;release.position=to;release.global_position=to
 viewport.push_input(release,true);await frames()
func click_control(control:Control):
 var viewport=control.get_viewport();var point:Vector2=control.get_global_transform_with_canvas()*(control.size*0.5)
 var hover:=InputEventMouseMotion.new();hover.position=point;hover.global_position=point
 viewport.push_input(hover,true);await frames(3)
 var down:=InputEventMouseButton.new();down.button_index=MOUSE_BUTTON_LEFT;down.button_mask=MOUSE_BUTTON_MASK_LEFT;down.pressed=true;down.position=point;down.global_position=point
 viewport.push_input(down,true);await create_timer(0.25).timeout
 var up:=InputEventMouseButton.new();up.button_index=MOUSE_BUTTON_LEFT;up.pressed=false;up.position=point;up.global_position=point
 viewport.push_input(up,true);await frames()
func run():
 var game=root.get_node("Game")
 game.new_game("WAREHOUSE-UI");game.state.day=3;game.state.cash=1000
 game.prefs.sound=false;game.prefs.reduced_motion=true
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title()
 for dimensions in [Vector2i(1440,900),Vector2i(844,390),Vector2i(568,320),Vector2i(390,844)]:
  root.size=dimensions;shell.phone_override=dimensions.x<1000;await frames();shell.go("warehouse");await frames()
  var page=shell.active_shell().page
  var entry=page.find_child("warehouse_expand",true,false)
  check(entry!=null,"fixed expansion entry is available at "+str(dimensions))
  if entry==null:shell.queue_free();await frames();quit(1);return
  check(entry.size.x>=56,"expansion icon and caption retain visible width")
  for key in page.cabinet_buttons.values():check(key.size.x>=40,"cabinet captions retain readable touch width")
  check(page.display_panel.get_global_rect().end.x<=page.holder.get_global_rect().position.x+2,"display stands to the left of the warehouse")
  for box in [page.display_panel,page.holder,page.detail_panel]:
   check(shell.active_shell().content_rect().grow(2).encloses(box.get_global_rect()),"drawer module stays within the workspace: "+str(dimensions)+" "+String(box.name)+" "+str(box.get_global_rect()))
  for kind in ["materials","isolation","pawn","warehouse"]:
   page.cabinet_buttons[kind].pressed.emit();await frames()
   check(page.cabinet_mode==kind,"right-side cabinet button switches to "+kind)
   check(shell.active_shell().content_rect().grow(2).encloses(page.holder.get_global_rect()),"switched cabinet stays within workspace: "+kind)
   if not shell.portrait_mode():check(page.holder.get_global_rect().end.x<=page.detail_panel.get_global_rect().position.x+2,"cabinet never overlaps item details: "+kind)
   if kind=="isolation":check(page.storage_header.get_child(1).text.contains("0 / 20"),"isolation cabinet prints used and total capacity")
   if kind=="pawn":
    var purchase=page.find_child("buy_pawn_slots",true,false)
    check(purchase!=null and page.cabinet_scroll.get_global_rect().has_point(purchase.get_global_rect().get_center()),"pawn slot purchase starts inside the visible cabinet")
  entry.pressed.emit();await frames()
  var panel=shell.modal_layer.find_child("WarehouseExpansionPanel",true,false)
  check(panel!=null,"expansion entry opens the requirements selector")
  if panel!=null:
   var sheet=shell.modal_layer.find_child("ModalSheet",true,false)
   check(sheet.size.x<=shell.safe_area().size.x+1 and sheet.size.y<=shell.safe_area().size.y+1,"expansion conditions fit the screen")
   check(panel.apply_button.disabled,"unselected watches cannot be consumed")
  shell.close_top_modal();await frames()
  var original_capacity:Dictionary=game.state.storageExpansion.duplicate(true)
  game.state.storageExpansion=WarehouseExpansion.default_state(5);page._refresh();await frames()
  page.grid_scroll.scroll_horizontal=100000;await frames()
  var final_cell:Vector2=page.grid.get_global_transform_with_canvas()*Vector2(page.CELL*49.5,page.CELL*0.5)
  check(page.grid_scroll.scroll_horizontal>0 and page.warehouse_drop_rect().has_point(final_cell),"horizontal scrolling reaches the50th column at "+str(dimensions))
  game.state.storageExpansion=original_capacity;page._refresh();await frames()
  shell.close_workspace();await frames()
 root.size=Vector2i(1440,900);shell.phone_override=false;await frames()
 game.state.inventory=[]
 var selected:Array=[]
 for id in ["WCH-007","WCH-008"]:
  var it:=Model.new_item(game.state,id,{"condition":1.0,"working":true});it.watch.missing_part="";it.evidence=["TOL-001","TOL-002"]
  Model.put_in(game.state,it);selected.append(it.uid)
 shell.go("warehouse");await frames()
 var page=shell.active_shell().page
 page.find_child("warehouse_expand",true,false).pressed.emit();await frames()
 var panel=shell.modal_layer.find_child("WarehouseExpansionPanel",true,false)
 panel.set_selection(0,selected[0]);panel.set_selection(1,selected[1]);await frames()
 check(not panel.apply_button.disabled,"two distinct qualifying originals enable confirmation")
 game.prefs.reduced_motion=false
 await click_control(panel.apply_button)
 game.prefs.reduced_motion=true
 var confirm:Button
 for key in shell.modal_layer.find_children("*","Button",true,false):
  if key.text=="确认交付并扩仓":confirm=key
 check(confirm!=null,"consumption confirmation identifies the final action")
 if confirm!=null:confirm.pressed.emit();await frames()
 check(game.state.cash==800 and game.state.inventory.is_empty() and WarehouseExpansion.columns(game.state)==20,"UI confirmation consumes selected watches and200 cash")
 shell.close_workspace();await frames()
 for i in 25:
  var it:=Model.new_item(game.state,"WCH-007",{"location":"display"});game.state.inventory.append(it)
 var hidden:=Model.new_item(game.state,"WCH-008");Model.put_in(game.state,hidden)
 shell.go("counter");await frames()
 var stream=shell.page.display_goods.find_child("CounterDisplayGrid",true,false)
 check(stream!=null and stream.get_child_count()==25,"counter cabinet shows all25 displayed originals and excludes warehouse stock")
 check(shell.page.display_goods is ScrollContainer and shell.page.display_goods.get_v_scroll_bar().max_value>shell.page.display_goods.size.y,"counter display has its own scrolling beyond20 visible originals")
 shell.go("warehouse");await frames()
 page=shell.active_shell().page
 var original_slot=page.display_grid.get_child(0)
 var original_uid:String=original_slot.uid
 await drag_original(page,original_slot.get_global_rect().get_center(),page.grid.get_global_rect().position+Vector2(page.CELL*2.5,page.CELL*0.5))
 check(game.item(original_uid).location=="warehouse" and game.item(original_uid).x==2,"pointer drag moves a displayed original to the requested warehouse cell")
 await drag_original(page,page.grid.get_global_rect().position+Vector2(page.CELL*2.5,page.CELL*0.5),page.cabinet_buttons.pawn.get_global_rect().get_center())
 check(game.item(original_uid).x==2 and game.item(original_uid).y==0,"dropping over cabinet controls cannot move an original into invisible warehouse columns")
 shell.close_workspace();await frames()
 shell.go("report");await frames()
 var purchase=shell.active_shell().page.find_child("PawnSlotPurchase",true,false)
 check(purchase!=null,"insurance section offers permanent pawn slots")
 if purchase!=null:
  purchase.quantity.value=5;purchase.buy.pressed.emit();await frames()
  check(game.state.cash==775 and WarehouseExpansion.capacity(game.state,"pawn")==25,"insurance-page slot purchase charges25 cash and adds5 permanent places")
 shell.queue_free();await frames();print("WAREHOUSE UI failures=",failures);quit(1 if failures else 0)
