extends "res://tests/night_crime_ui_test.gd"
const TouchAssist = preload("res://scripts/app/touch_assist.gd")

func pointer_at(point: Vector2) -> void:
 var motion=InputEventMouseMotion.new();motion.position=point;Input.parse_input_event(motion)
 for down in [true,false]:
  var event=InputEventMouseButton.new();event.position=point;event.global_position=point
  event.button_index=MOUSE_BUTTON_LEFT;event.pressed=down;Input.parse_input_event(event)
  await frames()

func run() -> void:
 var game=root.get_node("Game")
 var Art=load("res://scripts/ui/comic_assets.gd")
 var Reference=load("res://scripts/ui/reference_atlas.gd")
 game.prefs.reduced_motion=true;game.prefs.sound=false
 game.new_game("UTILITY-TOPBAR")
 # Explicit exact targets preserve their surrounding gaps even when small.
 var isolated=Control.new();root.add_child(isolated)
 var exact=Button.new();exact.position=Vector2(100,100);exact.size=Vector2(60,30)
 exact.set_meta("touch_assist_no_expand",true);isolated.add_child(exact)
 var gap=Vector2(130,94)
 check(TouchAssist.snap(gap,isolated,.5)==gap,"explicit no-expansion control leaves nearby gap inactive")
 exact.remove_meta("touch_assist_no_expand")
 check(exact.get_global_rect().has_point(TouchAssist.snap(gap,isolated,.5)),"ordinary small controls retain touch assistance")
 isolated.queue_free();await frames()
 var shell=load("res://main.tscn").instantiate();root.add_child(shell)
 await frames();shell._close_title();await frames()
 var view=shell.page.strict_view
 var utilities:Array[Button]=[]
 for caption in ["手册","经营","声音","设置"]:
  utilities.append(button(view,caption))
 for extent in [Vector2i(1000,700),Vector2i(1280,720),Vector2i(1440,900),Vector2i(1920,1080),Vector2i(2560,1080)]:
  root.size=extent;shell._fit_view();await frames()
  for i in utilities.size():
   var key=utilities[i]
   check(key!=null,"utility exists "+str(i))
   if key==null:continue
   var transform=root.get_screen_transform()*key.get_global_transform_with_canvas()
   var screen_rect=transform*Rect2(Vector2.ZERO,key.size)
   check(screen_rect.size.x>=43.99 and screen_rect.size.y>=43.99,"utility target >=44 CSS at "+str(extent)+" "+key.text+" "+str(screen_rect.size))
   check(key.icon!=null and key.get_theme_stylebox("normal") is not StyleBoxEmpty,"utility owns visible icon and bounds "+key.text)
   var local_css=screen_rect.size/key.size
   check(key.get_theme_font_size("font_size")*local_css.y>=12.99,"utility caption remains readable "+key.text)
   if key.icon!=null:
    var font=key.get_theme_font("font")
    var caption=font.get_string_size(key.text,HORIZONTAL_ALIGNMENT_LEFT,-1,key.get_theme_font_size("font_size"))
    check(caption.x+key.get_theme_constant("icon_max_width")+key.get_theme_constant("h_separation")<=key.size.x,"utility icon and text fit their shared visible bounds "+key.text)
   check(Rect2(Vector2.ZERO,Vector2(extent)).grow(.5).encloses(screen_rect),"utility remains on screen "+key.text)
   if i>0:
    var previous=utilities[i-1].get_global_rect();var current=key.get_global_rect()
    check(not previous.intersects(current),"adjacent utility hit rectangles are disjoint "+key.text+" at "+str(extent))
    if previous.end.x<current.position.x:
     var middle=Vector2((previous.end.x+current.position.x)*.5,current.get_center().y)
     check(TouchAssist.snap(middle,shell.root_ui,.4)==middle,"utility gap does not snap at "+str(extent))
 # Every pixel formerly containing utility ink is replaced by the donor paper.
 var hud=Reference.hud().get_image();var source=Reference.source()
 var ink_left=0
 for y in range(6,54):
  for x in range(1290,1665):
   if source.get_pixel(x,y).r<.65 and hud.get_pixel(x,y)==source.get_pixel(x,y):ink_left+=1
 check(ink_left==0,"HUD has no baked utility ink beneath real controls")
 var sound=utilities[2]
 if sound!=null:
  check(sound.icon==Art.icon("volume-xmark"),"muted sound has exactly its off icon")
  await click(sound);view._refresh()
  check(game.prefs.sound and sound.icon==Art.icon("volume-high"),"one sound click switches to on once")
  var sound_transform=root.get_screen_transform()*sound.get_global_transform_with_canvas()
  var edge=sound_transform*Vector2(1,sound.size.y*.5)
  await pointer_at(edge);view._refresh()
  check(not game.prefs.sound,"sound edge click invokes exactly its own action")
  var previous=utilities[1].get_global_rect();var current=sound.get_global_rect()
  var gap_point=Vector2((previous.end.x+current.position.x)*.5,current.get_center().y)
  await pointer_at(root.get_screen_transform()*gap_point)
  check(not game.prefs.sound and not shell.modal_open(),"raw click in utility gap performs no action")
  await click(sound);view._refresh()
  shell.page.busy=true;sound.pressed.emit();shell.page.busy=false
  check(game.prefs.sound,"busy guard blocks utility activation")
  shell.open_settings();await frames();var count=shell.modal_layer.get_child_count()
  for key in utilities:key.pressed.emit()
  check(game.prefs.sound and shell.modal_layer.get_child_count()==count,"modal guard blocks all underlying utilities")
  for modal in shell.modal_layer.get_children():modal.queue_free()
  await frames()
  for i in [0,1,3]:
   await click(utilities[i])
   check(shell.modal_open(),"utility opens existing destination "+utilities[i].text)
   for modal in shell.modal_layer.get_children():modal.queue_free()
   await frames()
 shell.phone_override=true
 for extent in [Vector2i(667,375),Vector2i(844,390),Vector2i(1000,500)]:
  root.size=extent;shell._fit_view();await frames()
  var native=shell.page.find_child("LandscapeCounter",true,false)
  check(native!=null and native.is_visible_in_tree(),"landscape counter is active "+str(extent))
  if native!=null:
   for i in native.dock_keys.size():
    var key=native.dock_keys[i]
    var transform=root.get_screen_transform()*key.get_global_transform_with_canvas()
    var rect=transform*Rect2(Vector2.ZERO,key.size)
    check(rect.size.x>=43.99 and rect.size.y>=43.99,"landscape dock utility has >=44 CSS target "+key.name)
    check(Rect2(Vector2.ZERO,Vector2(extent)).grow(.5).encloses(rect),"landscape dock utility stays visible "+key.name)
    if i>0:
     var previous=native.dock_keys[i-1].get_global_rect();var current=key.get_global_rect()
     check(not previous.intersects(current),"landscape dock targets are disjoint")
     var middle=Vector2((previous.end.x+current.position.x)*.5,current.get_center().y)
     check(TouchAssist.snap(middle,shell.root_ui,.5)==middle,"landscape dock gap does not snap "+str(extent)+" "+str(i)+" "+str(middle)+" -> "+str(TouchAssist.snap(middle,shell.root_ui,.5)))
 shell.queue_free();await frames()
 print("UTILITY TOPBAR failures=",failures)
 quit(1 if failures else 0)
