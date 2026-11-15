extends "res://tests/night_crime_ui_test.gd"
func run():
 root.size=Vector2i(1920,1080)
 var game=root.get_node("Game");game.prefs.reduced_motion=true;game.prefs.sound=false
 game.new_game("REFERENCE-STATES");game.state.phase="closed"
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
 var page=shell.page;var view=page.strict_view
 check(view.get_node_or_null("StrictLetterbox")!=null,"desktop letterboxing has its own comic canvas rather than the legacy room")
 check(view.muted_paper.visible and view.muted_symbol.visible,"muted preference has a matching visible sound indicator")
 check(view.meta_cover.visible and not view.get_node("StrictEvidence").visible,"empty desk hides item-only icons and inactive evidence target")
 var business=view.get_node_or_null("StrictBusinessState")
 check(business!=null and business.text=="休息","closed counter does not retain painted open status")
 game.state.phase="open";game.state.day=3
 var uid:String=game.state.inventory[0].uid;game.item(uid).listPrice=321;game.item(uid).sourceVerified=true
 page._refresh();await frames();page.showroom.select_original(uid);await frames()
 var caption=view.get_node_or_null("StrictAskCaption")
 check(caption!=null and caption.text=="挂牌" and view.ask.text=="321 Cr","own-original ribbon shows the real list price rather than arrival count")
 await click(button(view,"放大镜 · 查看标识"));await frames()
 shell.close_workspace();await frames()
 await click(button(view,"放回原位"));await frames()
 check(game.state.counterPreviewUid=="","visible return control releases the original after closing its tool")
 game.state.day=7;Landlord.ensure(game.state);page._refresh();await frames()
 check(view.rent.text.contains("待"),"due day states rent is outstanding rather than seven days away")
 game.dispatch({"type":"CALL_LANDLORD"});await frames()
 check(caption!=null and caption.text=="租金","landlord ribbon describes rent rather than an item ask")
 check(view.cost.get_minimum_size().x<=434 and view.cost.get_global_rect().end.x<=view.get_global_rect().end.x-20,"long special-visit explanation stays inside the transaction folio")
 game.dispatch({"type":"PAY_RENT","tradeId":game.state.trade.id});await frames()
 check(view.rent.text.contains("已交"),"rent receipt updates the actual HUD state")
 shell.queue_free();await frames();quit(1 if failures else 0)
