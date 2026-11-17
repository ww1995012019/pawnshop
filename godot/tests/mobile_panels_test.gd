extends SceneTree
var failures := 0
func _initialize(): call_deferred("run")
func frames(n := 8):
 for i in n: await process_frame
func check(ok: bool, message: String):
 print("MOBILE PANELS ","PASS " if ok else "FAIL ",message)
 if not ok: failures+=1
func check_close(key:Button,kind:String):
 var projected:Rect2=(key.get_viewport().get_screen_transform()*key.get_global_transform_with_canvas())*Rect2(Vector2.ZERO,key.size)
 check(key.text=="" and key.icon!=null,kind+" close is icon only")
 check(projected.size.x>=43.9 and projected.size.y>=43.9,kind+" close has a real 44-pixel touch target")
func run():
 root.size=Vector2i(844,390)
 var game=root.get_node("Game")
 game.new_game("MOBILE-PANELS")
 game.prefs.sound=false
 game.prefs.reduced_motion=true
 var shell=load("res://main.tscn").instantiate()
 shell.phone_override=true
 root.add_child(shell)
 await frames()
 shell._close_title()
 await frames()
 var adapter=shell.page.find_child("PortraitCounter",true,false)
 var view=adapter.landscape
 check(view.find_child("DialogueScroll",true,false)!=null,"counter dialogue has an internal scroller")
 adapter._goods_popup()
 await frames()
 var grid=shell.modal_layer.find_child("table_goods_grid",true,false)
 check(grid is GridContainer,"goods use icon tiles rather than full-width rows")
 var close=shell.modal_layer.find_child("modal_close",true,false)
 check_close(close,"modal")
 shell.close_top_modal()
 await frames()
 shell.go("inspect",game.state.inventory[0].uid)
 await frames()
 var page=shell.workspace_shell.page
 check_close(shell.workspace_close,"workbench")
 check(page.picker.size.y<=32 and page.picker.get_theme_font_size("font_size")<=14,"inspection picker uses compact mobile metrics")
 shell.open_watch_manual(game.state.inventory[0].defId)
 await frames()
 var paper=shell.root_ui.find_child("inspection_guide",false,false)
 check(paper.scale==Vector2.ONE,"manual reflows at native text size rather than shrinking a desktop paper")
 check(paper.size.y<=390 and paper.size.x>480,"manual fits the landscape viewport")
 check_close(paper.close_button,"manual")
 shell.queue_free()
 await frames()
 quit(1 if failures else 0)
