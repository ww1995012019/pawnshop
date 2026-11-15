extends SceneTree
var failures:=0
func _initialize():call_deferred("run")
func check(value: bool,message: String):
 print("REFERENCE ","PASS " if value else "FAIL ",message)
 if not value:failures+=1
func run():
 var source=Image.load_from_file("res://assets/comic/approved-reference.png")
 check(source.get_size()==Vector2i(1671,941),"reference uses the actual supplied dimensions")
 var portrait=load("res://scripts/ui/comic_assets.gd").portrait("CHR-021").get_image()
 check(portrait.get_size()==Vector2i(383,362),"resident is the original-size source cutout, not a replacement painting")
 if portrait.get_size()==Vector2i(383,362):
  for p in [Vector2i(180,90),Vector2i(200,140),Vector2i(150,300)]:check(portrait.get_pixelv(p)==source.get_pixelv(p+Vector2i(474,94)),"source artwork pixels are preserved at "+str(p))
 var ref=load("res://scripts/ui/reference_atlas.gd")
 var paper=ref.paper_skin().get_image()
 var fragments=0
 for y in range(180,600):
  for x in [16,17,18,19,20,466,467,468,469,470]:
   var c=paper.get_pixel(x,y)
   if c.r>c.g*1.4 and c.r>.35:fragments+=1
 check(fragments==0,"reusable paper interior contains no old red action or ribbon fragments")
 var environment=ref.environment().get_image()
 check(environment.get_pixel(83,213)!=source.get_pixel(83,213),"room does not retain a painted cabinet original behind the live original")
 check(environment.get_pixel(500,696)!=source.get_pixel(500,696),"room does not retain painted tabletop prices")
 check(environment.get_pixel(1100,430)==source.get_pixel(1100,430),"uncovered original environment pixels remain unchanged")
 for p in [Vector2i(535,160),Vector2i(750,165),Vector2i(840,442),Vector2i(766,242)]:check(environment.get_pixelv(p)==ref.clean_source().get_pixelv(p),"departed-visitor bounds contain only clean scenery at "+str(p))
 check(environment.get_pixel(1300,500).a==0.0,"room contains no screenshot transaction UI")
 quit(1 if failures else 0)
