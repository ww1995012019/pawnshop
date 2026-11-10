extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
 print("CLOSED FEEDBACK ","PASS " if ok else "FAIL ",message)
 if not ok: failures += 1
func labels(node: Node) -> String:
 var out: String = node.text+"\n" if node is Label else ""
 for child in node.get_children(): out += labels(child)
 return out
func button(node: Node, text: String):
 for child in node.get_children():
  if child is Button and child.text.contains(text): return child
  var found = button(child,text)
  if found != null:return found
 return null
func settle() -> void:
 for frame in 8: await process_frame
func run() -> void:
 var closed := Model.create("CLOSED-FEEDBACK")
 closed.phase = "report"
 var id: String = Model.available_orders(closed)[0].id
 for kind in ["TAKE_ORDER","DELIVER_ORDER","CHECK","DISPLAY"]:
  var result := Model.reduce(closed,{"type":kind,"id":id,"uid":closed.inventory[0].uid,"tool":"TOL-001"})
  check(result.notice.contains("打烊") and result.notice != closed.notice,"closed "+kind+" explains the rejection instead of silently returning")
  check(result.orders == closed.orders and result.inventory == closed.inventory and result.ap == closed.ap,"rejected "+kind+" cannot mutate orders, goods or AP")
 var game = root.get_node("Game")
 game.state = closed
 game.prefs.reduced_motion = true
 game.prefs.sound = false
 var shell = load("res://main.tscn").instantiate()
 root.add_child(shell)
 await settle()
 shell._close_title()
 shell.go("orders")
 await settle()
 var page = shell.active_shell().page
 check(page.status_note.text.contains("打烊"),"closed orders board persistently shows why business is unavailable")
 var accept = button(page.cols.open,"接单")
 if accept == null:accept = button(page.cols.open,"接取订单")
 check(accept != null,"closed board keeps an explanatory accept control")
 if accept != null:
  accept.pressed.emit()
  await settle()
  check(page.selected_status == "open" and page.counts.active == 0,"closed accept stays on the available list and creates no commission")
  var notices = shell.active_shell().toast_box
  check(notices.get_child_count() > 0 and labels(notices).contains("打烊"),"clicking the closed accept control visibly explains the restriction")
 shell.queue_free()
 await settle()
 var open := Model.create("DELIVERY-AP")
 open = Model.reduce(open,{"type":"TAKE_ORDER","id":Model.available_orders(open)[0].id})
 var order: Dictionary = open.orders[0]
 var it = Model.find_inventory(open,order.get("uid",""))
 if it != null:
  it.condition = 1.0; it.working = true; it.repaired = true; it.evidence = ["TOL-001","TOL-002"]
  open.ap = 0
  game.state = open
  shell = load("res://main.tscn").instantiate();root.add_child(shell)
  await settle();shell._close_title();shell.go("orders");await settle()
  page = shell.active_shell().page
  page._select_status("active")
  check(labels(page.cols.active).contains("行动点"),"delivery with insufficient AP shows its own actionable reason")
  shell.queue_free();await settle()
 print("CLOSED FEEDBACK failures=",failures)
 quit(1 if failures else 0)
