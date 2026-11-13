extends SceneTree
var failures := 0
func _initialize():call_deferred("run")
func frames():
 for i in 12:await process_frame
func check(ok:bool,label:String):
 print("COMPACT ","PASS " if ok else "FAIL ",label)
 if not ok:failures+=1
func find_button(node:Node,text:String)->Button:
 for child in node.get_children():
  if child is Button and child.text==text:return child
  var found:=find_button(child,text)
  if found!=null:return found
 return null
func run():
 root.size=Vector2i(1595,860)
 var game=root.get_node("Game");game.prefs.sound=false;game.prefs.reduced_motion=true;game.new_game("COMPACT")
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title()
 shell.go("orders");await frames()
 var page=shell.active_shell().page
 check(shell.workspace_logical_size.x<=1040,"orders use a compact desktop window")
 page._select_status("active");await frames()
 check(shell.workspace_logical_size.y<=400,"empty orders do not reserve a full-height board")
 check(page.toast_rect().size.x>=200 and page.board.get_rect().encloses(page.toast_rect()),"notices keep readable width inside the smaller order board")
 var next:=find_button(page,"查看可接订单")
 check(next!=null,"empty state retains a direct action")
 if next!=null:
  check(next.size.y<=42,"empty-state action has compact height")
  check(page.board.get_global_rect().encloses(next.get_global_rect().grow(3)),"button and focus border stay inside the board")
  next.pressed.emit();await frames()
  check(page.selected_status=="open" and page.counts.open>0,"compact empty-state action opens available orders")
  check(shell.workspace_logical_size.y>400,"populated order list gets more room")
 shell.go("report");await frames()
 check(shell.workspace_logical_size.x<=1120 and shell.workspace_logical_size.y<=720,"ledger uses a smaller desktop window")
 for order in game.state.orders:
  order.status="failed"
 shell.go("orders");await frames()
 page=shell.active_shell().page
 check(page.counts.open==0 and shell.workspace_logical_size.y<=400,"no available orders use the same compact empty state")
 var warehouse_action:=find_button(page,"整理仓储")
 check(warehouse_action!=null,"no available orders retain the warehouse action")
 if warehouse_action!=null:
  warehouse_action.pressed.emit();await frames()
  check(shell.active_shell().page_name=="warehouse","empty-state warehouse button opens the correct module")
 for target in ["inspect","repair","warehouse"]:
  shell.go(target);await frames()
  check(shell.workspace_logical_size.x<=1440 and shell.workspace_logical_size.y<=800,"compact "+target+" retains an operating area")
 shell.go("counter");await frames()
 var button:Button=shell.page.fixture_buttons.report
 game.prefs.reduced_motion=false
 var bounds:=button.get_global_rect()
 button.button_down.emit()
 await create_timer(0.2).timeout
 check(button.get_global_rect().is_equal_approx(bounds),"pressing a flat button keeps its geometry aligned")
 game.prefs.reduced_motion=true
 shell.phone_override=true
 for viewport_size in [Vector2i(390,844),Vector2i(844,390)]:
  root.size=viewport_size;shell._fit();await frames()
  shell.go("orders");await frames()
  page=shell.active_shell().page;page._select_status("active");await frames()
  var mobile_action:=find_button(page,"查看可接订单")
  check(mobile_action!=null and mobile_action.size.x>=160,"mobile empty-state button retains readable width at "+str(viewport_size))
 print("COMPACT failures=",failures)
 quit(1 if failures else 0)
