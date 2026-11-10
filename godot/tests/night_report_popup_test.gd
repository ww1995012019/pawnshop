extends "res://tests/night_crime_ui_test.gd"
func run() -> void:
 var game=root.get_node("Game");game.prefs.sound=false;game.prefs.reduced_motion=true
 game.state=Fixture.fresh("QUIET-NIGHT");game.state.day=19
 NightCrime.ensure(game.state)
 game.state.nightCrime.reportOpen=true
 game.state.nightCrime.mornings=[{"day":18,"night":17,"losses":[],"payout":0,"acknowledged":true},{"day":19,"night":18,"losses":[],"payout":0,"acknowledged":true}]
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames();shell._poll_night_report();await frames()
 check(not shell.modal_open(),"no-loss night cannot auto-open a report even with a stale open flag")
 if shell.modal_open(): await click(button(shell,"确认夜间记录"))
 shell.open_night_report();await frames()
 check(shell.modal_open() and text_of(shell.modal_layer).contains("第 18 天开门"),"full history remains available on explicit request")
 await click(button(shell,"确认夜间记录"))
 var fixture=Fixture.build()
 game.state=fixture.insured_report.duplicate(true)
 game.state.nightCrime.mornings.append({"day":3,"night":2,"losses":[],"payout":0,"acknowledged":true})
 game.dispatch({"type":"NEXT"});await create_timer(3).timeout;await frames()
 check(shell.modal_open(),"real theft opens the previous-night report on the next morning")
 var report=NightCrime.public_report(game.state)
 check(text_of(shell.modal_layer).contains("第 %d 天开门" % report.morning.day),"automatic report shows the just-ended night")
 check(not text_of(shell.modal_layer).contains("第 %d 天开门" % (int(report.morning.day)-1)),"automatic theft report does not include earlier quiet nights")
 await click(button(shell,"确认夜间记录"));await frames()
 check(not shell.modal_open() and NightCrime.pending_morning(game.state).is_empty(),"acknowledgement prevents repeated automatic opening")
 game.state.day+=1;game.state.nightCrime.reportOpen=true
 for receipt in game.state.nightCrime.mornings: receipt.acknowledged=false
 shell.night_report_seen="";shell._poll_night_report();await frames()
 check(not shell.modal_open(),"unread theft from an older night cannot pop up on a later day")
 game.state.nightCrime.nights[str(int(game.state.day)-1)]={"applied":false,"losses":[],"policy":{}}
 NightCrime.morning(game.state,int(game.state.day)-1)
 check(not game.state.nightCrime.reportOpen and game.state.nightCrime.mornings.back().acknowledged,"quiet morning clears an inherited report flag")
 shell.queue_free();await frames()
 print("NIGHT POPUP failures=",failures);quit(1 if failures else 0)
