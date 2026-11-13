extends SceneTree
var failures := 0
func _initialize(): call_deferred("run")
func run():
 var game = root.get_node("Game")
 game.prefs.sound=false
 game.prefs.reduced_motion=true
 game.new_game("ALIGNMENT")
 var shell=load("res://main.tscn").instantiate()
 root.add_child(shell)
 for i in 8: await process_frame
 shell._close_title()
 for viewport_size in [Vector2i(1580,710),Vector2i(1440,900)]:
  root.size=viewport_size
  for i in 8: await process_frame
  var page=shell.page
  var report:Rect2=page.fixture_buttons.report.get_global_rect()
  var alarm:Rect2=page.alarm_button.get_global_rect()
  if page.actions.get_child_count()==0:
   failures+=1;print("ALIGN FAIL missing idle actions")
  for button in page.actions.get_children():
   var action:Rect2=button.get_global_rect()
   if absf(action.position.y-report.position.y)>1 or absf(action.end.y-report.end.y)>1:
    failures+=1;print("ALIGN FAIL action/report ",action," ",report)
   if absf(button.get_theme_font_size("font_size")*page.terminal.scale.y-page.fixture_buttons.report.get_theme_font_size("font_size"))>0.1:
    failures+=1;print("ALIGN FAIL scaled action font")
  if absf(alarm.position.y-report.position.y)>1 or absf(alarm.end.y-report.end.y)>1:
   failures+=1;print("ALIGN FAIL alarm/report ",alarm," ",report)
 print("ALIGN failures=",failures)
 quit(1 if failures else 0)
