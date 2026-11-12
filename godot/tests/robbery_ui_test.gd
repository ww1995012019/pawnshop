extends "res://tests/night_crime_ui_test.gd"
func run() -> void:
 var game=root.get_node("Game")
 game.prefs.reduced_motion=true;game.prefs.sound=false
 var state:Dictionary=load("res://tests/robbery_fixture.gd").fence()
 game.state=state.duplicate(true)
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
 for dimensions in [Vector2i(1440,900),Vector2i(568,320),Vector2i(390,844)]:
  game.state=state.duplicate(true)
  shell.phone_override=dimensions.x<1000;root.size=dimensions
  shell.go("counter");await frames()
  var page=shell.active_shell().page
  check(text_of(shell).contains("本店被抢物品"),"robbery mark is visible at %s"%dimensions)
  if dimensions.y>dimensions.x:
   var portrait=page.find_child("PortraitCounter",true,false)
   check(portrait.item_hint.text.contains("本店被抢物品"),"portrait original visibly identifies robbery without hidden desktop labels")
  check(not page.alarm_button.disabled,"alarm is enabled without wanted notice or evidence")
  page.call("_confirm_alarm");await frames()
  var alarm:=button(shell,"报警并追回")
  check(alarm!=null,"marked original opens direct recovery confirmation")
  await click(alarm);await idle(page)
  check(game.state.trade==null and game.state.cash==state.cash,"direct alarm preserves cash and dismisses arrested visitor")
  check(game.state.inventory.size()==1,"original recovered once")
 shell.go("report");await frames()
 shell.open_story_book();await frames()
 var book=shell.modal_layer.find_child("StoryBook",true,false)
 book.filters.archive.pressed.emit();await frames()
 check(text_of(shell).contains("抢劫案件"),"robbery is recorded in event book")
 shell.close_top_modal();await frames()
 shell.queue_free();await frames()
 print("ROBBERY UI failures=",failures);quit(1 if failures else 0)
