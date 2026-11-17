extends SceneTree
## Shared close geometry and actual expanded PopupMenu, independent of business UI.
var failures := 0
func _initialize() -> void: call_deferred("run")
func frames(n := 5) -> void:
 for i in n: await process_frame
func check(ok: bool, message: String) -> void:
 print("SHARED CONTROLS ","PASS " if ok else "FAIL ",message)
 if not ok: failures += 1
func contrast(front: Color, back: Color) -> float:
 var a := front.srgb_to_linear().get_luminance()
 var b := back.srgb_to_linear().get_luminance()
 return (maxf(a,b)+.05)/(minf(a,b)+.05)
func pointer(point: Vector2, pressed: bool) -> void:
 var event := InputEventMouseButton.new()
 event.button_index = MOUSE_BUTTON_LEFT
 event.pressed = pressed
 event.position = root.get_final_transform()*point
 event.global_position = event.position
 Input.parse_input_event(event)
 await frames()
func scroller(node: Node) -> ScrollContainer:
 if node is ScrollContainer: return node
 for child in node.get_children(true):
  var found := scroller(child)
  if found != null: return found
 return null
func menu_key(menu: PopupMenu, code: Key) -> void:
 var event := InputEventKey.new()
 event.keycode = code
 event.physical_keycode = code
 event.pressed = true
 Input.parse_input_event(event)
 await frames()
func run() -> void:
 root.size = Vector2i(844,390)
 root.gui_embed_subwindows = true
 var kit = load("res://scripts/app/ui_kit.gd")
 kit.mobile_ui = true
 kit.mobile_wide = true
 var game = root.get_node("Game")
 game.prefs.sound = false
 game.prefs.reduced_motion = true
 var host := Control.new()
 host.theme = kit.build_theme()
 root.add_child(host)
 check(kit.has_method("close_button"),"dedicated close factory exists")
 if kit.has_method("close_button"):
  var calls := [0]
  var close: Button = kit.close_button(Vector2(20,20))
  close.pressed.connect(func(): calls[0] += 1)
  host.add_child(close)
  check(not close.is_processing(),"idle close sizing never polls the browser per frame")
  check(close.text == "" and close.icon != null,"close contains only its X icon")
  check(close.tooltip_text == "关闭" and close.accessibility_name == "关闭","close has tooltip and accessible name")
  check(close.icon_alignment == HORIZONTAL_ALIGNMENT_CENTER and close.vertical_icon_alignment == VERTICAL_ALIGNMENT_CENTER,"X is centered on both axes")
  for state in ["normal","hover","pressed","hover_pressed","disabled"]:
   var style := close.get_theme_stylebox(state)
   check(style.content_margin_left == style.content_margin_right and style.content_margin_top == style.content_margin_bottom,"close padding is symmetric in "+state)
  for scale_value in [1.0,.6,.35]:
   host.scale = Vector2.ONE*scale_value
   await frames()
   var projected := root.get_screen_transform()*close.get_global_transform_with_canvas()
   var extent := Vector2(projected.x.length(),projected.y.length())*close.size
   check(extent.x>=43.99 and extent.y>=43.99,"real close target remains 44px at scale "+str(scale_value))
  await pointer(close.get_global_rect().get_center(),true)
  await pointer(close.get_global_rect().get_center(),false)
  check(calls[0] == 1,"one real pointer press closes exactly once")
  host.scale = Vector2.ONE
  close.queue_free()
 var business: Button = kit.button("保存","primary",Vector2(120,44),18,"save")
 check(business.text == "保存" and business.icon != null and business.icon_alignment == HORIZONTAL_ALIGNMENT_LEFT,"text plus icon business factory retains semantics")
 business.free()
 var picker: OptionButton = kit.option_button(150)
 picker.position = Vector2(30,60)
 host.add_child(picker)
 for i in 60:
  picker.add_item("物品 %02d" % i,700+i)
  picker.set_item_metadata(i,"UID-%02d" % i)
 picker.set_item_disabled(1,true)
 picker.select(3)
 await frames()
 var menu := picker.get_popup()
 menu.popup()
 await frames()
 check(menu.visible,"real PopupMenu is expanded")
 for state in ["normal","hover","pressed","hover_pressed","focus","disabled"]:
  var key: String = "font_color" if state == "normal" else "font_"+state+"_color"
  var background: Color = picker.get_theme_stylebox("normal" if state=="focus" else state).bg_color
  check(contrast(picker.get_theme_color(key),background)>=4.5,"OptionButton text readable in "+state)
 for key in ["font_color","font_hover_color","font_disabled_color","font_accelerator_color","font_separator_color"]:
  var background: Color = menu.get_theme_stylebox("hover" if key=="font_hover_color" else "panel").bg_color
  check(contrast(menu.get_theme_color(key),background)>=4.5,"expanded menu readable: "+key)
 check(menu.get_theme_color("font_disabled_color") != menu.get_theme_color("font_color"),"disabled entries remain visibly distinct")
 check(menu.has_theme_stylebox_override("hover"),"native keyboard focus and hover have explicit selected-row surface")
 for key in ["radio_checked","radio_unchecked","radio_checked_disabled","radio_unchecked_disabled"]:
  check(menu.has_theme_icon_override(key),"actual menu defines selection marker "+key)
 check(menu.is_item_radio_checkable(3) and menu.is_item_checked(3),"selected item retains native radio selection")
 menu.set_focused_item(0)
 await menu_key(menu,KEY_DOWN)
 check(menu.get_focused_item()==2,"native keyboard traversal skips disabled entry")
 menu.set_focused_item(59)
 menu.scroll_to_item(59)
 await frames()
 check(menu.get_focused_item()==59 and menu.size.y<=menu.max_size.y and menu.max_size.y<=root.get_visible_rect().size.y-16,"last item focus scrolls inside viewport-bounded menu")
 var scroll := scroller(menu)
 check(scroll != null and scroll.scroll_vertical>0 and scroll.get_v_scroll_bar().value+scroll.get_v_scroll_bar().page>=scroll.get_v_scroll_bar().max_value-8,"expanded native list actually scrolls to the final row")
 # Activate through the real PopupMenu keyboard input path.
 await menu_key(menu,KEY_ENTER)
 check(picker.selected==59 and picker.get_item_metadata(picker.selected)=="UID-59","selecting last entry preserves ID/index mapping and UID")
 check(picker.is_item_disabled(1) and menu.is_item_disabled(1),"refresh and popup retain disabled semantics")
 menu.hide()
 host.queue_free()
 await frames()
 print("SHARED CONTROLS failures=",failures)
 quit(1 if failures else 0)
