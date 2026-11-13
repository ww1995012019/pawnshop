extends SceneTree
var failures:=0
func _initialize():call_deferred("run")
func check(ok:bool,label:String):
 print("COMPACT ","PASS " if ok else "FAIL ",label)
 if not ok:failures+=1
func frames():
 for i in 14:await process_frame
func run():
 var game=root.get_node("Game");game.new_game("COMPACT");game.prefs.sound=false;game.prefs.reduced_motion=true
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title()
 shell.go("inspect");await frames()
 var page=shell.active_shell().page
 check(not page.instrument_panel.visible,"inspection removes tall sidebar")
 var keys:Array=page.tool_buttons.values()
 check(keys[0].get_parent() is HBoxContainer,"inspection tools share horizontal toolbar")
 for key in keys:
  check(key.icon!=null and key.text!="" and key.size.y<=60,"inspection retains tool icons and short captions")
  check(key.get_global_rect().end.y<=page.mat_rect.position.y,"inspection toolbar sits above physical workbench")
 shell.go("repair");await frames();page=shell.active_shell().page
 check(page.list_box.columns>=2,"desktop repair selection has multiple columns")
 var supplies=page.info.find_child("RepairSupplies",true,false)
 check(supplies is GridContainer,"repair supplies form icon quantity grid")
 if supplies!=null:
  check(supplies.get_child_count()==GameData.materials.size(),"all supplies retain visible quantities")
 game.state.storageExpansion=WarehouseExpansion.default_state(1)
 shell.go("warehouse");await frames();page=shell.active_shell().page
 check(page.display_grid.get_child_count()==32,"display includes all 32 expanded slots")
 page.display_scroll.scroll_vertical=100000;await frames()
 var final_slot:Control=page.display_grid.get_child(31)
 check(page.display_scroll.get_global_rect().encloses(final_slot.get_global_rect()),"32nd display slot remains reachable")
 check(page.display_panel.size.y<shell.active_shell().content_rect().size.y-40,"small display cabinet shrinks to content")
 for mode in ["isolation","pawn"]:
  page.switch_cabinet(mode);await frames()
  var key=page.cabinet_grid.get_child(0)
  check(absf(key.size.x-key.size.y)<2,"%s slots stay square"%mode)
  check(page.cabinet_grid.columns==10,"%s slots use compact material grid density"%mode)
 for dimensions in [Vector2i(844,390),Vector2i(390,844)]:
  shell.close_workspace();root.size=dimensions;shell.phone_override=true;await frames()
  shell.go("warehouse");await frames();page=shell.active_shell().page
  for mode in ["isolation","pawn"]:
   page.switch_cabinet(mode);await frames()
   var key=page.cabinet_grid.get_child(0)
   check(absf(key.size.x-key.size.y)<2,"mobile %s slots remain square"%mode)
   check(not page.cabinet_scroll.get_h_scroll_bar().visible,"mobile %s has no horizontal overflow"%mode)
  shell.go("repair");await frames();page=shell.active_shell().page
  check(not page.list_box.get_parent().get_h_scroll_bar().visible,"mobile repair tiles avoid horizontal overflow")
  supplies=page.info.find_child("RepairSupplies",true,false)
  check(supplies!=null and supplies.get_combined_minimum_size().x<=page.detail_panel.size.x,"mobile supplies fit details width")
 shell.queue_free();await frames();quit(1 if failures else 0)
