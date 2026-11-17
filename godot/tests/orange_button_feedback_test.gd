extends SceneTree
## Painted controls must expose native hover/press/focus without moving their hits.
var failures := 0
func _initialize() -> void: call_deferred("run")
func frames(count := 8) -> void:
 for i in count: await process_frame
func check(ok: bool, message: String) -> void:
 print("ORANGE FEEDBACK ","PASS " if ok else "FAIL ",message)
 if not ok: failures += 1
func contrast(front: Color,back: Color) -> float:
 var a := front.srgb_to_linear().get_luminance()
 var b := back.srgb_to_linear().get_luminance()
 return (maxf(a,b)+.05)/(minf(a,b)+.05)
func warm(c: Color) -> bool:
 return c.r>c.g and c.g>c.b and c.s>.28
func pointer(point: Vector2,pressed: Variant = null) -> void:
 var event: InputEventMouse
 if pressed == null:
  event = InputEventMouseMotion.new()
 else:
  event = InputEventMouseButton.new()
  event.button_index = MOUSE_BUTTON_LEFT
  event.pressed = pressed
 event.position = root.get_final_transform()*point
 event.global_position = event.position
 Input.parse_input_event(event)
 await frames()
func run() -> void:
 var kit = load("res://scripts/app/ui_kit.gd")
 kit.ensure()
 check(warm(kit.context_style().bg_color),"temporary menu paper uses warm orange rather than green")
 check(warm(kit.notice_style("info").bg_color),"ordinary notices share the warm auxiliary palette")
 check(kit.notice_style("error").bg_color.h<.04,"errors retain their distinct brick-red treatment")
 for kind in ["primary","header","secondary","danger"]:
  var b := Button.new()
  kit.context_button(b,kind)
  for state in ["normal","hover","pressed","disabled"]:
   var color_key: String = "font_color" if state=="normal" else "font_"+state+"_color"
   check(contrast(b.get_theme_color(color_key),b.get_theme_stylebox(state).bg_color)>=4.5,"menu "+kind+" remains readable in "+state)
  b.free()
 check(warm(kit.key_style("primary","normal").bg_color) and kit.key_style("primary","normal").bg_color.s>.4,"primary tool keys are visibly orange")
 var paper = load("res://scripts/ui/comic_paper.gd").new()
 var canvas := RenderingServer.canvas_item_create()
 paper.draw(canvas,Rect2(0,0,80,60))
 check(paper.surface.modulate_color==Color.WHITE,"default paper draw preserves the original grain colors")
 paper.bg_color = Color("9a5326")
 paper.draw(canvas,Rect2(0,0,80,60))
 check(paper.surface.modulate_color!=Color.WHITE and paper.surface.modulate_color.r<1,"paper draw actually consumes its requested background tint")
 RenderingServer.free_rid(canvas)
 var art_source := Image.create(3,1,false,Image.FORMAT_RGBA8)
 art_source.set_pixel(0,0,Color("b84e37"))
 art_source.set_pixel(1,0,Color("fff3d8"))
 art_source.set_pixel(2,0,Color("20241e"))
 var art := ImageTexture.create_from_image(art_source)
 check(kit.has_method("orange_art"),"painted red actions have an actual orange artwork conversion")
 if kit.has_method("orange_art"):
  var painted: Image = kit.orange_art(art).get_image()
  check(painted.get_pixel(0,0).h>art_source.get_pixel(0,0).h+.02,"painted red pigment visibly shifts toward burnt orange")
  check(painted.get_pixel(1,0)==art_source.get_pixel(1,0) and painted.get_pixel(2,0)==art_source.get_pixel(2,0),"artwork conversion preserves cream lettering and dark ink")
  check(kit.orange_art(art)==kit.orange_art(art),"repeated presentation refreshes reuse converted artwork")
 root.size=Vector2i(1920,1080)
 var game=root.get_node("Game")
 game.new_game("ORANGE-FEEDBACK");game.prefs.sound=false;game.prefs.reduced_motion=true
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames(12);shell._close_title();await frames()
 var view=shell.page.strict_view
 # Hold the current visible fixture so controller polling cannot re-enable it
 # while disabled-state ownership is being exercised with actual pointer input.
 view.set_process(false)
 check(view.has_method("_bind_button_feedback"),"counter exposes feedback for original-card and table hooks")
 var hover_wash := Color.TRANSPARENT
 var press_wash := Color.TRANSPARENT
 for name in ["StrictNav_sun","StrictOrders","StrictPeople","StrictTradeAction_0"]:
  var b: Button = view.find_child(name,true,false)
  var overlay: Panel = b.get_node_or_null("InteractionFeedback")
  check(overlay!=null and overlay.mouse_filter==Control.MOUSE_FILTER_IGNORE and overlay.z_index>0,name+" feedback draws above later-painted children without owning input")
  if overlay==null: continue
  var child_count := b.get_child_count()
  view._bind_button_feedback(b);view._bind_button_feedback(b)
  check(b.get_child_count()==child_count,name+" feedback binding is idempotent")
  b.disabled=false
  var hit := b.get_global_rect()
  var center := hit.get_center()
  await pointer(Vector2(1000,830));b.release_focus();await frames()
  await pointer(center)
  check(overlay.visible and overlay.get_theme_stylebox("panel").bg_color.a>.05,name+" gets a visible native hover")
  var hover_alpha: float = overlay.get_theme_stylebox("panel").bg_color.a
  hover_wash=overlay.get_theme_stylebox("panel").bg_color
  await pointer(center,true)
  check(overlay.visible and overlay.get_theme_stylebox("panel").bg_color.a>hover_alpha,name+" has a stronger held press")
  press_wash=overlay.get_theme_stylebox("panel").bg_color
  await pointer(Vector2(1000,830));await pointer(Vector2(1000,830),false)
  b.grab_focus();await frames()
  check(overlay.visible and overlay.get_theme_stylebox("panel").bg_color.a==0,name+" keyboard focus is an outline without an opaque plate")
  b.disabled=true;await frames();await pointer(center)
  check(not overlay.visible,name+" disabled control has no clickable hover feedback")
  check(b.get_global_rect()==hit,name+" feedback never moves or resizes the real hit target")
  b.disabled=false;b.release_focus()
 var quick=view.quick_list
 var check_key := Button.new()
 for selected in [false,true]:
  quick.skin(check_key,true,selected)
  check(warm(check_key.get_theme_stylebox("normal").bg_color),"quick checkout and selected controls share warm orange")
  for state in ["normal","hover","pressed","disabled"]:
   var color_key: String = "font_color" if state=="normal" else "font_"+state+"_color"
   check(contrast(check_key.get_theme_color(color_key),check_key.get_theme_stylebox(state).bg_color)>=4.5,"quick control state stays readable: "+state)
   var wash := hover_wash if state=="hover" else press_wash if state=="pressed" else Color.TRANSPARENT
   check(contrast(check_key.get_theme_color(color_key).blend(wash),check_key.get_theme_stylebox(state).bg_color.blend(wash))>=4.5,"painted feedback preserves actual composite text contrast: "+state)
 check_key.free()
 shell.queue_free();await frames()
 for player in root.find_children("*","AudioStreamPlayer",true,false):
  player.stop();player.stream=null
 await create_timer(.12).timeout
 print("ORANGE FEEDBACK failures=",failures)
 quit(1 if failures else 0)
