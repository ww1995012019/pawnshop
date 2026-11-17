extends SceneTree
## Full-text speech geometry and stable, proportional counter portraits.
## Captured from the real begin/checkout browser fixture, including model prose.
const CHECKOUT_DIALOGUE := "北辰 N02 日历我先不收。这几只我都带来了，表带和机芯的情况要分别看。\n有的在旧船坞用了几年，有的只是换班时戴。\n你可以逐件核对标识、编号和重量，合适的再一起结算。\n没谈妥的先放一边，钱和原物都按各自的记录走。 先把已经说好的货物交割，其他的可以再谈。"
var failures := 0
func _initialize() -> void:call_deferred("run")
func check(ok: bool,caption: String) -> void:
 print("DIALOGUE ACTOR ","PASS " if ok else "FAIL ",caption)
 if not ok:failures+=1
func frames(count:=4) -> void:
 for i in count:await process_frame
func set_speech(view,text: String) -> void:
 if view.has_method("_sync_speech"):view._sync_speech(text)
 else:view.speech.text=text
func run() -> void:
 root.size=Vector2i(1920,1080)
 var game=root.get_node("Game");game.prefs.sound=false;game.prefs.reduced_motion=false
 game.new_game("COUNTER-DIALOGUE-ACTOR");game.state.cursor=4;game.dispatch({"type":"ARRIVE"})
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames(8);shell._close_title();await frames(8)
 var page=shell.page;var view=page.strict_view;page.set_process(false);view.set_process(false)
 var cash:float=game.state.cash;var ap:float=game.state.ap;var goods=game.state.inventory.duplicate(true)
 var short="这只表，95 Cr。\n你看看。"
 var long="本次采购：我想找品相好的旧表，请挑几件来看看。你先检查实物，价格合适咱们再谈。"
 for extent in [Vector2i(1920,1080),Vector2i(1440,900),Vector2i(1160,700)]:
  root.size=extent;await frames();view._layout_desktop()
  for text in [long,short,"这趟带了常用耗材，也收多余零件。稀罕货要看运气。",long+" 每件原物的来源、品相和价格都要说清楚。",long.repeat(4),CHECKOUT_DIALOGUE]:
   set_speech(view,text);await frames(2)
   var bubble:Rect2=view.get_node("StrictSpeechBubble").get_rect()
   check(view.speech.get_content_height()<=view.speech.size.y and not view.speech.get_v_scroll_bar().visible,"full dialogue fits without a scrollbar at %s (%d characters)"%[extent,text.length()])
   check(bubble.encloses(view.speech.get_rect()) and bubble.end.x<=view.get_node("StrictTradePaper").position.x-12 and bubble.end.y<view._table_project(Vector2(700,451)).y,"speech and its bubble remain inside the open counter area")
   check(view.speech.get_theme_font_size("normal_font_size")>=18,"dialogue keeps its readable font size")
   if text==CHECKOUT_DIALOGUE:
    var hud_bottom=view.hud_art.position.y+view.hud_art.size.y
    check(bubble.position.y<157 and bubble.position.y>=hud_bottom+12 and bubble.end.y<=view._table_project(Vector2(700,451)).y-14,"real checkout dialogue grows upward below the HUD while its tail stays above the table")
    check(view.speech.get_content_height()<=view.speech.size.y and not view.speech.scroll_active,"real fixture final sentence is visible without scrolling (content=%s, area=%s)"%[view.speech.get_content_height(),view.speech.size.y])
  set_speech(view,short);await frames(2)
  check(is_equal_approx(view.get_node("StrictSpeechBubble").position.y,157.0),"ordinary short speech returns to its original anchor")
  set_speech(view,long);await frames(2)
  var full_rect:Rect2=view.speech.get_rect();var full_bubble:Rect2=view.get_node("StrictSpeechBubble").get_rect()
  page.bubble_label.visible_ratio=.35;view.speech.visible_ratio=.35
  if view.has_method("_layout_dialogue_actors"):view._layout_dialogue_actors()
  await frames(2)
  check(is_equal_approx(view.speech.visible_ratio,.35) and view.speech.get_rect()==full_rect and view.get_node("StrictSpeechBubble").get_rect()==full_bubble,"typewriter progress preserves full-text geometry and remains partially revealed")
  set_speech(view,short);await frames(2)
  check(view.speech.get_v_scroll_bar().value==0.0 and view.get_node("StrictSpeechBubble").size.y<full_bubble.size.y,"switching from long to short dialogue shrinks the bubble and clears old scrolling")
 root.size=Vector2i(1920,1080);await frames();view._layout_desktop()
 view.motion_ready=false
 var shapes_ok=true;var anchors_ok=true;var cropped_ok=true;var unstable=[]
 var actors=GameData.people().duplicate()
 if not actors.any(func(npc):return npc.id==Landlord.NPC_ID):actors.append(GameData.npc(Landlord.NPC_ID))
 for npc in actors:
  var trade=game.state.trade.duplicate(true);trade.id="actor/"+npc.id;trade.npcId=npc.id
  view._sync_visitor(trade)
  if view.has_method("_update_visitor_pose"):view._update_visitor_pose()
  var source:Vector2=view.face.texture.get_size();var rect:Rect2=view.face.get_rect()
  shapes_ok=shapes_ok and absf(rect.size.x/rect.size.y-source.x/source.y)<.001
  anchors_ok=anchors_ok and is_equal_approx(rect.end.y,456.0) and is_equal_approx(rect.get_center().x,665.5)
  var image=view.face.texture.get_image()
  if image.is_compressed():image.decompress()
  var used=image.get_used_rect()
  cropped_ok=cropped_ok and used.position==Vector2i.ZERO and used.size==image.get_size()
  var at_rest:Vector2=view.face.position
  page.customer.gesture.nod=11;page.customer.gesture.lean=14
  if view.has_method("_update_visitor_pose"):view._update_visitor_pose()
  else:view.dirty=false;view.period=0;view._process(0)
  if view.face.position!=at_rest:unstable.append(npc.id)
 check(shapes_ok,"every NPC preserves the cropped artwork's aspect ratio")
 check(anchors_ok,"every NPC shares the counter baseline and horizontal center")
 check(cropped_ok,"every NPC removes transparent outer padding")
 check(unstable.is_empty(),"nod and lean never move the whole standing portrait: "+str(unstable))
 # The frame hook must keep the same baseline when the old rig updates.
 view.dirty=false;view.period=0;page.customer.gesture.nod=-11;page.customer.gesture.lean=-16
 var standing_rect:Rect2=view.face.get_rect();view._process(0)
 check(view.face.get_rect()==standing_rect,"the integrated frame update never applies old rig gestures to the cutout")
 for reduced in [false,true]:
  game.prefs.reduced_motion=reduced;view.motion_ready=true
  var trade=game.state.trade.duplicate(true);trade.id="transition/"+str(reduced);trade.npcId="CHR-010"
  view._sync_visitor(trade)
  var baseline:float=view.face.position.y+view.face.size.y
  check(view.visitor_phase=="entering" and view.face.modulate.a<1.0,"visit entrance retains visible feedback with reduced motion "+str(reduced))
  await create_timer(.07).timeout
  if view.has_method("_update_visitor_pose"):view._update_visitor_pose()
  check(is_equal_approx(view.face.position.y+view.face.size.y,baseline),"entrance never moves the portrait vertically")
  await create_timer(.5).timeout;view._sync_visitor(trade)
  view._start_visible_departure();var outgoing=view.departing_face
  check(outgoing.mouse_filter==Control.MOUSE_FILTER_IGNORE and outgoing.size==view.face.size,"departure copies the fitted portrait without interaction")
  view._advance_visible_departure();await create_timer(.06).timeout
  check(is_instance_valid(outgoing) and is_equal_approx(outgoing.position.y+outgoing.size.y,baseline),"outgoing portrait retains the same stable baseline")
  trade.id+="/same-npc";view._sync_visitor(trade);await frames(2)
  check(view.last_visit==trade.id and view.visitor_phase=="entering" and not is_instance_valid(outgoing) and not is_instance_valid(view.departing_face),"same-NPC revisit cancels and cleans the previous departure")
  await create_timer(.5).timeout
 check(game.state.cash==cash and game.state.ap==ap and game.state.inventory==goods,"layout and transitions preserve cash, AP and all original facts")
 shell.queue_free();await frames();await create_timer(.5).timeout
 for player in root.find_children("*","AudioStreamPlayer",true,false):player.stop();player.stream=null
 await process_frame
 print("DIALOGUE ACTOR failures=",failures);quit(1 if failures else 0)
