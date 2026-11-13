extends SceneTree
var failures:=0
func _initialize():call_deferred("run")
func check(ok:bool,label:String):
 print("VERTICAL ","PASS " if ok else "FAIL ",label)
 if not ok:failures+=1
func frames():
 for i in 12:await process_frame
func run():
 var game=root.get_node("Game");game.new_game("VERTICAL");game.prefs.sound=false;game.prefs.reduced_motion=true
 game.state.storageExpansion=WarehouseExpansion.default_state(5)
 check(WarehouseExpansion.columns(game.state)==10 and WarehouseExpansion.rows(game.state)==30,"max storage grows down to 300 cells")
 var old:=Model.create("OLD-VERTICAL");old.inventory=[]
 old.storageExpansion={"version":1,"level":5,"columns":50,"rows":6,"displayCapacity":130,"materialCapacity":130,"isolationCapacity":150,"pawnCapacity":27,"completedOrderIds":[]}
 for x in 50:
  var it:=Model.new_item(old,"WCH-001");it.x=x;it.y=4;old.inventory.append(it)
 WarehouseExpansion.ensure(old)
 check(WarehouseExpansion.columns(old)==10 and WarehouseExpansion.rows(old)==30 and old.inventory.size()==50,"wide saves migrate without losing originals")
 check(old.inventory.all(func(it):return Model.can_place(old,it.uid,it.x,it.y)),"migrated originals stay in bounds without overlap")
 var serialized:=JSON.stringify(old);WarehouseExpansion.ensure(old)
 check(JSON.stringify(old)==serialized,"migration is idempotent")
 for width in [10,20,25,30,35,50]:
  var full:=Model.create("FULL-"+str(width));full.inventory=[]
  full.storageExpansion={"version":1,"level":0,"columns":width,"rows":6,"pawnCapacity":27}
  for y in [0,2,4]:
   for x in width:
    var it:=Model.new_item(full,"WCH-001");it.x=x;it.y=y;full.inventory.append(it)
  var cash:float=full.cash;var ids:Array=full.inventory.map(func(it):return it.uid)
  WarehouseExpansion.ensure(full)
  check(full.inventory.map(func(it):return it.uid)==ids and full.cash==cash and WarehouseExpansion.capacity(full,"pawn")==27,"full legacy cabinet preserves originals, cash and permanent slots")
  check(full.inventory.all(func(it):return Model.can_place(full,it.uid,it.x,it.y)),"full legacy cabinet repacks every original without overlap: "+str(width))
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title()
 for dimensions in [Vector2i(1440,900),Vector2i(844,390),Vector2i(390,844)]:
  root.size=dimensions;shell.phone_override=dimensions.x<1000;await frames();shell.go("warehouse");await frames()
  var page=shell.active_shell().page
  check(page.display_panel.size.y<=shell.active_shell().content_rect().size.y,"display cabinet fits workspace height")
  for key in page.cabinet_buttons.values():check(key.get_global_rect().end.y<=page.grid_scroll.get_global_rect().position.y,"category tabs sit above the grid")
  check(page.grid_scroll.size.x-page.grid.custom_minimum_size.x<=22,"grid fills width without a side toolbar gap")
  check(page.expand_button.text=="" and page.expand_button.icon!=null,"expansion is icon only")
  check(not page.grid_scroll.get_h_scroll_bar().visible,"no horizontal storage scrolling")
  page.grid_scroll.scroll_vertical=100000;await frames()
  check(page.grid_scroll.scroll_vertical>0,"vertical scroll reaches expanded rows")
  var final_cell:Vector2=page.grid.get_global_transform_with_canvas()*Vector2(page.grid.size.x-5,page.grid.size.y-5)
  check(page.warehouse_drop_rect().has_point(final_cell),"last storage cell can be reached")
  for mode in ["materials","isolation","pawn","warehouse"]:
   page.switch_cabinet(mode);await frames()
   for key in page.cabinet_buttons.values():check(key.is_visible_in_tree() and page.holder.get_global_rect().encloses(key.get_global_rect()),"category controls stay visible")
   check(page.cabinet_buttons[mode].button_pressed,"active category remains selected")
   if mode=="materials":
    var slots=page.materials_view.find_child("MaterialSlots",true,false)
    check(slots!=null and slots is GridContainer,"materials use a slot grid")
  game.state.storageExpansion=WarehouseExpansion.default_state();page._refresh();await frames()
  check(page.holder.size.y<=maxf(page.grid.size.y,page.cabinet_rail.size.y)+180 or page.grid_scroll.get_v_scroll_bar().visible,"no large blank area under storage")
  game.state.storageExpansion=WarehouseExpansion.default_state(5)
  shell.close_workspace();await frames()
 shell.queue_free();await frames();quit(1 if failures else 0)
