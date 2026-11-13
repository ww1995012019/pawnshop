extends SceneTree
var failures := 0
func _initialize(): call_deferred("run")
func check(ok:bool,label:String):
 if not ok: failures+=1;print("MOUNT FAIL ",label)
func run():
 var game=root.get_node("Game");game.prefs.sound=false;game.prefs.reduced_motion=true;game.new_game("MOUNTS")
 var shell=load("res://main.tscn").instantiate();root.add_child(shell)
 for i in 8:await process_frame
 shell._close_title()
 for viewport_size in [Vector2i(1580,710),Vector2i(1440,900)]:
  root.size=viewport_size
  for i in 8:await process_frame
  var page=shell.page
  var report:Button=page.fixture_buttons.report
  check(report.position.is_equal_approx(Vector2(218,684)) and report.size.is_equal_approx(Vector2(244,28)),"ledger fits counter front rail")
  check(page.alarm_button.position.is_equal_approx(Vector2(650,684)) and page.alarm_button.size.is_equal_approx(Vector2(280,28)),"alarm fits counter front rail")
  check(page.actions.position.is_equal_approx(Vector2(54,245)),"terminal actions use device-local recess")
  check(page.actions.get_child_count()>0,"idle terminal actions exist")
  for button in page.actions.get_children():
   var r:Rect2=button.get_rect()
   check(r.position.y>=0 and r.end.y<=32.1,"terminal key stays inside inset action rail")
 print("MOUNT failures=",failures)
 quit(1 if failures else 0)
