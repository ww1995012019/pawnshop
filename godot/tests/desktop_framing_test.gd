extends "res://tests/night_crime_ui_test.gd"
## Actual screen transforms must contain the complete desktop art and controls.
func run() -> void:
 var game=root.get_node("Game");game.prefs.reduced_motion=true;game.prefs.sound=false
 game.new_game("DESKTOP-FRAMING")
 var shell=load("res://main.tscn").instantiate();root.add_child(shell)
 await frames();shell._close_title();await frames()
 for extent in [Vector2i(1920,1080),Vector2i(2048,1018),Vector2i(1920,900),Vector2i(2560,1080),Vector2i(1440,900)]:
  root.size=extent;await frames();shell._fit_view();await frames()
  var view=shell.page.strict_view
  var transform=root.get_screen_transform()*view.get_global_transform_with_canvas()
  var top=transform*Vector2.ZERO;var bottom=transform*view.size
  check(top.x>=-.5 and top.y>=-.5 and bottom.x<=extent.x+.5 and bottom.y<=extent.y+.5,"complete comic desktop fits "+str(extent)+": "+str(Rect2(top,bottom-top)))
  for key in [view.day,view.get_node("StrictNav_gauge-high")]:
   var screen=root.get_screen_transform()*key.get_global_transform_with_canvas()
   var first=screen*Vector2.ZERO;var last=screen*key.size
   check(first.y>=-.5 and last.y<=extent.y+.5,"upper/lower control stays fully visible at "+str(extent)+": "+str(key.name))
 shell.queue_free();await frames();quit(1 if failures else 0)
