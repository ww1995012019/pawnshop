extends SceneTree
var failures:=0
func _initialize():call_deferred("run")
func frames():
 for i in 15:await process_frame
func check(ok: bool,label: String):
 print("DEBUG UI ","PASS " if ok else "FAIL ",label)
 if not ok:failures+=1
func run():
 var game=root.get_node("Game")
 game.new_game("DEBUG-UI")
 game.prefs.sound=false;game.prefs.reduced_motion=true
 root.size=Vector2i(1440,900)
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
 for dimensions in [Vector2i(1440,900),Vector2i(844,390),Vector2i(390,844),Vector2i(320,568)]:
  root.size=dimensions;shell.phone_override=dimensions.x<1000;await frames()
  shell.open_debug_values();await frames()
  var panel=shell.modal_layer.find_child("DebugValuesPanel",true,false)
  check(panel!=null,"debug panel opens at "+str(dimensions))
  if panel==null:continue
  var sheet=shell.modal_layer.find_child("ModalSheet",true,false)
  check(sheet.size.x<=shell.safe_area().size.x+1 and sheet.size.y<=shell.safe_area().size.y+1,"debug sheet stays within the display")
  check(panel.get_combined_minimum_size().x<=sheet.size.x,"debug controls fit without horizontal scrolling")
  panel.search.text="cash";panel.refresh();await frames()
  check(panel.all_rows.any(func(row):return row.path==["cash"]),"search exposes the money field")
  panel.select_field(["cash"]);panel.value_edit.text="6543";panel.apply_selected();await frames()
  check(game.state.cash==6543 and panel.current_label.text.contains("6543"),"applying a value refreshes the live game and editor")
  panel.scope="data";panel.search.text="WCH-001";panel.refresh();await frames()
  check(not panel.all_rows.is_empty(),"definition search supports original model ids")
  shell.close_top_modal();await frames()
 shell.phone_override=false;root.size=Vector2i(1440,900);await frames()
 var shortcut=InputEventKey.new();shortcut.keycode=KEY_F8;shortcut.pressed=true
 shell._input(shortcut);await frames()
 check(shell.modal_layer.find_child("DebugValuesPanel",true,false)!=null,"F8 opens the debug panel")
 shell._input(shortcut);await frames()
 check(shell.modal_layer.find_child("DebugValuesPanel",true,false)==null,"F8 closes the debug panel")
 var debug=load("res://scripts/app/debug_values.gd")
 game.state.police.wanted=["WNT-001"]
 debug.begin_session()
 debug.apply("state",["police","issued"],"true")
 debug.apply("state",["police","paper","visible"],"true");await frames()
 check(is_instance_valid(shell.wanted_notice) and shell.wanted_notice.visible,"debug edits refresh the wanted notice immediately")
 debug.apply("data",["wanted_profiles",0,"reward"],"777");await frames()
 var card=shell.wanted_notice.find_child("case_WNT-001",true,false)
 check(card!=null and card.get_child(0).get_children().any(func(node):return node is Label and node.text.contains("777 Cr")),"definition edits refresh the displayed reward")
 debug.restore();await frames()
 check(not is_instance_valid(shell.wanted_notice) or not shell.wanted_notice.visible,"restoring the backup refreshes notice visibility")
 shell.open_settings();await frames()
 check(shell.modal_layer.find_child("open_debug_values",true,false)!=null,"settings exposes a discoverable debug entry")
 shell.queue_free();await frames()
 print("DEBUG UI failures=",failures);quit(1 if failures else 0)
