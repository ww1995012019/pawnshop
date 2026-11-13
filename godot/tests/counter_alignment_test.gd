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
  # Measure the painted front face directly, independently of page constants.
  # At source x=90 it begins below the light tabletop edge and ends at the
  # dark underside. The 480px artwork is displayed at four times its size.
  var texture:Texture2D=load("res://assets/scene/shop_pixel.png")
  var image:Image=texture.get_image()
  var first := -1
  var last := -1
  for y in range(160,180):
   var pixel:=image.get_pixel(90,y)
   if pixel.g>0.32 and pixel.g<0.48 and pixel.r>0.25 and pixel.r<0.45:
    if first<0:first=y
    last=y
  check(first>=0 and last>first,"painted front face is measurable")
  var rail_top:=float(first*4)
  var rail_bottom:=float((last+1)*4)
  for button in [report,page.alarm_button]:
   var rect:Rect2=button.get_rect()
   var top_gap:=rect.position.y-rail_top
   var bottom_gap:=rail_bottom-rect.end.y
   print("RAIL ",button.name," upper/lower padding=",top_gap,"/",bottom_gap)
   check(top_gap>=0 and bottom_gap>=0,"button stays inside painted front face")
   check(absf(top_gap-bottom_gap)<0.1,"button is vertically centered on painted front face")
  check(page.actions.position.is_equal_approx(Vector2(54,245)),"terminal actions use device-local recess")
  check(page.actions.get_child_count()>0,"idle terminal actions exist")
  for button in page.actions.get_children():
   var r:Rect2=button.get_rect()
   check(r.position.y>=0 and r.end.y<=32.1,"terminal key stays inside inset action rail")
 print("MOUNT failures=",failures)
 quit(1 if failures else 0)
