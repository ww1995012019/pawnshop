extends SceneTree
func _initialize(): call_deferred("run")
func run():
 var game=root.get_node("Game")
 game.new_game("TITLE-SIZE")
 game.has_save=true
 var shell=load("res://main.tscn").instantiate()
 shell.phone_override=true
 root.size=Vector2i(844,290)
 root.add_child(shell)
 for i in 12: await process_frame
 var panel=shell.title.find_child("MobileTitlePanel",true,false)
 if panel==null:
  print("TITLE FAIL no landscape-sized opening panel");quit(1);return
 for dims in [Vector2i(844,290),Vector2i(568,320),Vector2i(844,390)]:
  root.size=dims
  for i in 12:await process_frame
  assert(shell.get_viewport().get_visible_rect().encloses(panel.get_global_rect()),str(panel.get_global_rect()))
  for b in panel.find_children("*","Button",true,false):
   assert(b.size.y>=44 and b.size.y<=48,str(b.size))
   assert(b.get_theme_font_size("font_size")<=17)
 print("TITLE PASS saved-game opening fits all short landscape viewports")
 shell.queue_free()
 await process_frame
 quit()
