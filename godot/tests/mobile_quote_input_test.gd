extends SceneTree
var failures := 0
func _initialize(): call_deferred("run")
func frames(n := 8):
 for i in n: await process_frame
func check(ok: bool, message: String):
 print("MOBILE QUOTE ","PASS " if ok else "FAIL ",message)
 if not ok: failures += 1
func run():
 root.size = Vector2i(844,390)
 var game = root.get_node("Game")
 game.new_game("MOBILE-QUOTE")
 game.prefs.sound = false
 game.prefs.reduced_motion = true
 var shell = load("res://main.tscn").instantiate()
 shell.phone_override = true
 root.add_child(shell)
 await frames()
 shell._close_title()
 await frames()
 shell.page._ring()
 await create_timer(2.5).timeout
 var desk = shell.page
 var adapter = desk.find_child("PortraitCounter",true,false)
 adapter._quote_popup()
 await frames()
 var quote: SpinBox = adapter.quote
 var original: int = desk.dial.value
 quote.value = original + 5
 await frames()
 check(desk.dial.value == original+5,"stepper updates actual quote behind the modal")
 var editor: LineEdit = quote.get_line_edit()
 editor.grab_focus()
 await frames()
 check(editor.has_focus(),"numeric editor retains focus inside the modal")
 editor.text = str(original+12)
 editor.text_submitted.emit(editor.text)
 await frames()
 check(desk.dial.value == original+12,"typed amount updates actual quote")
 shell.close_top_modal()
 await frames()
 adapter._quote_popup()
 await frames()
 check(int(adapter.quote.value)==original+12,"quote draft survives reopening")
 shell.queue_free()
 await frames()
 quit(1 if failures else 0)
