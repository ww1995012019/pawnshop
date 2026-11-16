extends SceneTree
var failures:=0
func _initialize():call_deferred("run")
func check(value:bool,message:String):
 print("PAPER ","PASS " if value else "FAIL ",message)
 if not value:failures+=1
func run():
 var ref=load("res://scripts/ui/reference_atlas.gd")
 var grain=ref.paper_skin().get_image()
 if grain.is_compressed():grain.decompress()
 var ink=0
 # Grain is reused inside headers, records and other panels. It must carry no
 # painted frame of its own, otherwise nesting creates extra parallel rules.
 for x in range(0,grain.get_width(),3):
  for y in [8,grain.get_height()-9]:
   var c=grain.get_pixel(x,y)
   if c.a>.5 and c.get_luminance()<.35:ink+=1
 check(ink==0,"shared paper grain contains no baked black frame")
 var stock=ref.stock_frame().get_image();ink=0
 for y in range(70,250,3):
  for x in range(22,400,3):
   if stock.get_pixel(x,y).get_luminance()<.35:ink+=1
 check(ink==0,"stock paper contains no painted items or old cell lines")
 var paper=ref.quick_list_paper().get_image()
 if paper.is_compressed():paper.decompress()
 DirAccess.make_dir_recursive_absolute(ProjectSettings.globalize_path("res://../work/continuous-paper"))
 paper.save_png("res://../work/continuous-paper/paper-current.png")
 quit(1 if failures else 0)
