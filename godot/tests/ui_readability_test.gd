extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func frames() -> void:
 for i in 15: await process_frame
func check(ok: bool, message: String) -> void:
 print("READABILITY ","PASS " if ok else "FAIL ",message)
 if not ok: failures+=1
func run() -> void:
 var game=root.get_node("Game")
 game.new_game("UI-READABILITY")
 game.prefs.reduced_motion=true
 game.prefs.sound=false
 root.size=Vector2i(1440,900)
 var shell=load("res://main.tscn").instantiate()
 root.add_child(shell);await frames();shell._close_title();await frames()
 for dimensions in [Vector2i(1440,900),Vector2i(844,390),Vector2i(390,844)]:
  shell.phone_override=dimensions.x<1000
  root.size=dimensions;await frames()
  shell.go("warehouse");await frames()
  var page=shell.active_shell().page
  page.cabinet_buttons.materials.pressed.emit();await frames()
  var stock=page.materials_view
  check(stock!=null and stock.visible,"material stock is available from its independent cabinet at "+str(dimensions))
  if stock!=null:
   for label in stock.find_children("*","Label",true,false):
    if label.text.contains("×"):
     check(label.size.x>=80 and label.get_line_count()<=2,"material name and quantity remain readable: "+label.text)
  shell.close_workspace();await frames()
 shell.phone_override=false;root.size=Vector2i(1440,900);await frames()
 shell.go("orders");await frames()
 var orders=shell.active_shell().page
 var toggle: Button=orders.find_child("OrderSummary",true,false)
 check(toggle!=null,"order brief can be inspected from its summary without accepting")
 if toggle!=null:
  var details: VBoxContainer=toggle.get_parent().get_parent().get_meta("mobile_details")
  var brief: Label=details.get_child(0)
  check(not brief.text.is_empty() and not brief.is_visible_in_tree(),"order brief starts collapsed")
  var before=JSON.stringify(game.state)
  toggle.button_pressed=true;await frames()
  check(brief.is_visible_in_tree(),"selecting an order summary exposes its brief")
  check(JSON.stringify(game.state)==before,"inspecting a brief does not accept or change an order")
  toggle.button_pressed=false;await frames()
  check(not brief.is_visible_in_tree() and JSON.stringify(game.state)==before,"folding order details does not accept or change an order")
 shell.queue_free();await frames()
 print("READABILITY failures=",failures)
 quit(1 if failures else 0)
