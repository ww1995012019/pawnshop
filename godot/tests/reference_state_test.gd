extends "res://tests/night_crime_ui_test.gd"
func run():
 root.size=Vector2i(1920,1080)
 var game=root.get_node("Game");game.prefs.reduced_motion=true;game.prefs.sound=false
 game.new_game("REFERENCE-STATES");game.state.phase="closed"
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
 var page=shell.page;var view=page.strict_view
 check(view.get_node_or_null("StrictLetterbox")!=null,"desktop letterboxing has its own comic canvas rather than the legacy room")
 check(view.utility_buttons.sound.icon==load("res://scripts/ui/comic_assets.gd").icon("volume-xmark"),"muted preference has one matching sound button icon")
 check(view.meta_cover.visible and not view.detail_layer.get_node("StrictEvidence").visible,"empty desk hides item-only icons and inactive evidence target")
 var business=view.get_node_or_null("StrictBusinessState")
 check(business!=null and business.text=="休息","closed counter does not retain painted open status")
 game.state.phase="report";view._refresh(true)
 check(business.text=="已打烊","daily closing has its own state instead of the campaign ending")
 var lighting = view.scenery[1].material as ShaderMaterial
 check(lighting!=null and lighting.get_shader_parameter("after_hours")==1.0,"closed shop switches off the painted lamp with reduced motion")
 game.state.phase="open";game.state.day=3
 view._refresh(true)
 check(lighting!=null and lighting.get_shader_parameter("after_hours")==0.0,"next business day restores the open counter lighting")
 var uid:String=game.state.inventory[0].uid;game.item(uid).listPrice=321;game.item(uid).sourceVerified=true
 page._refresh();await frames();page.showroom.select_original(uid);await frames()
 var caption=view.detail_layer.get_node_or_null("StrictAskCaption")
 check(caption!=null and caption.text=="挂牌" and view.ask.text=="321 Cr","own-original ribbon shows the real list price rather than arrival count")
 var preview_tag=view.table.get_child(0).find_children("*","Label",true,false)[0]
 check(preview_tag.get_visible_line_count()>=1 and preview_tag.size.y>=preview_tag.get_theme_font("font").get_height(preview_tag.get_theme_font_size("font_size")),"single-original price has room for its complete text line")
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
 for id in ["CHR-008","CHR-019","CHR-034"]:
  game.state.trade.npcId=id;page._refresh();await frames()
  var painted=view.face.texture.get_image()
  if painted.is_compressed():painted.decompress()
  var contact=painted.get_height()-1
  for y in range(painted.get_height()-1,-1,-1):
   var opaque=0
   for x in painted.get_width():
    if painted.get_pixel(x,y).a>.5:opaque+=1
   if opaque>=maxi(8,int(painted.get_width()*.03)):contact=y;break
  var base=view.face.position.y+float(contact+1)/painted.get_height()*view.face.size.y
  check(absf(base-456)<2.0,"painted visitor base meets the counter without transparent foot padding: "+id)
 shell.queue_free();await frames();quit(1 if failures else 0)
