extends SceneTree
var failures:=0
func _initialize() -> void: call_deferred("run")
func check(ok:bool,message:String)->void:
 print("COUNTER LIFECYCLE ","PASS " if ok else "FAIL ",message)
 if not ok: failures+=1
func frames()->void:
 for i in 8: await process_frame
func run()->void:
 var game=root.get_node("Game")
 game.prefs.sound=false;game.prefs.reduced_motion=false
 game.state=load("res://tests/counter_lifecycle_fixture.gd").build().arrest
 var shell=load("res://main.tscn").instantiate();root.add_child(shell)
 await frames()
 shell.page._conversation_wait=0
 shell.page._process(30)
 check(game.state.trade.get("talkLog",[]).is_empty(),"title overlay pauses automatic visitor chatter")
 shell._close_title();await frames()
 var page=shell.page
 check(page.counter_table.sprites.size()>=2,"multi-original arrest setup")
 var report_id: String=game.state.trade.id
 var owner_id: String=game.state.trade.npcId
 var original_uids: Array=[]
 for it in TradeSession.session(game.state).goods: original_uids.append(it.uid)
 var report_ap=game.state.ap
 game.dispatch({"type":"REPORT_VISITOR","tradeId":report_id})
 var reward_cash=game.state.cash
 game.dispatch({"type":"REPORT_VISITOR","tradeId":report_id})
 check(game.state.cash==reward_cash and game.state.ap==report_ap and game.state.police.reports.size()==1,"repeated report cannot duplicate reward or spend AP")
 for uid in original_uids:
  check(game.state.npcTrade[owner_id].owned.any(func(it):return it.uid==uid),"police visual cleanup preserves canonical original "+uid)
 await create_timer(1.4).timeout
 check(not page.bubble.visible,"patrol faces remain visible without bulky result bubble")
 check(page.counter_table.sprites.values().all(func(sprite):return is_instance_valid(sprite)),"police detaches original sprites before freeing them")
 await create_timer(6.6).timeout
 check(not page.busy and game.state.trade==null,"animated arrest completes and unlocks")
 await create_timer(2).timeout
 page._ring();await create_timer(3).timeout
 check(game.state.trade!=null and not page.busy,"next visitor is served after every tween")
 shell.queue_free();await frames()
 # A terminal quantity refusal must depart, while pending agreements remain safe.
 game.prefs.reduced_motion=true
 game.state=load("res://tests/counter_lifecycle_fixture.gd").build().arrest
 shell=load("res://main.tscn").instantiate();root.add_child(shell);shell.page.set_process(false);await frames();shell._close_title();await frames()
 page=shell.page;page.set_process(false)
 check(page.bubble_label.tooltip_text=="","spoken dialogue does not duplicate itself as tooltip")
 check(page.bubble.mouse_filter==Control.MOUSE_FILTER_STOP,"whole dialogue owns its pointer region")
 var se=TradeSession.session(game.state)
 se.want_count=0
 var original=game.state.inventory.filter(func(it):return TradeSession._stock_problem(game.state,it,"sell")=="")[0]
 game.dispatch({"type":"SELECT_TRADE","uid":original.uid});await frames()
 check(CounterDialogue.current(game.state).status=="rejected","quantity limit produces real terminal refusal")
 var ap=game.state.ap;var cash=game.state.cash
 page._process(2.9);await frames()
 check(game.state.trade!=null,"refusal remains readable for three seconds")
 page._process(.2);await create_timer(2).timeout
 check(game.state.trade==null and game.state.ap==ap and game.state.cash==cash and game.item(original.uid)!=null,"terminal refusal auto departs without money AP or original loss")
 shell.queue_free();await frames()
 # New discussion resets an old timer; workspace pauses it; next arrival is isolated.
 var fixtures=load("res://tests/counter_lifecycle_fixture.gd").build()
 game.state=fixtures.capacity.duplicate(true)
 shell=load("res://main.tscn").instantiate();root.add_child(shell);shell.page.set_process(false);await frames()
 shell.page._process(30)
 check(game.state.trade!=null,"title overlay pauses restored terminal departure until Start")
 shell._close_title();await frames()
 page=shell.page;page.set_process(false)
 page._process(2.9)
 var next_uid: String=TradeSession.session(game.state).goods[0].uid
 game.dispatch({"type":"COUNTER_FOCUS","tradeId":game.state.trade.id,"uid":next_uid});await frames()
 page._process(10)
 check(game.state.trade!=null and CounterDialogue.departure_reason(game.state)=="","deliberate next-original discussion cancels departure")
 game.state=fixtures.capacity.duplicate(true);page._refresh()
 page.workspace_state_changed(true);page._process(20)
 check(game.state.trade!=null,"workspace prevents automatic departure")
 page.workspace_state_changed(false);page._process(2.9)
 check(game.state.trade!=null,"closing workspace grants full fresh reading delay")
 game.state=fixtures.pending.duplicate(true);page._refresh();page._process(30)
 check(game.state.trade!=null and TradeSession.summary(game.state).buy_count==1,"undelivered agreement suppresses terminal departure")
 game.state=fixtures.arrest.duplicate(true);page._refresh();page._process(30)
 check(game.state.trade!=null,"unprocessed natural multi-item session remains open")
 game.state=fixtures.capacity.duplicate(true);page._refresh();page._process(2.9)
 game.state=fixtures.arrest.duplicate(true);game.state.trade.id="different-next-visitor";page._refresh();page._process(30)
 check(game.state.trade!=null and game.state.trade.id=="different-next-visitor","stale timer cannot close a different visitor")
 # Actual motion over both text and note margin must not create a tooltip or world hover.
 var point=page.bubble.get_global_rect().get_center()
 var motion=InputEventMouseMotion.new();motion.position=root.get_final_transform()*point;motion.global_position=motion.position
 Input.parse_input_event(motion);await frames();await create_timer(.7).timeout
 page._process(.1)
 check(page._dialogue_owns_pointer() and page.world_cursor_shape(shell.world_mouse())==Input.CURSOR_ARROW,"real hover over dialogue suppresses world pointer affordance")
 check(root.find_children("*","PopupPanel",true,false).is_empty(),"real dialogue hover opens no duplicate tooltip popup")
 check(not page.dialogue_put_aside.disabled,"dialogue response remains enabled")
 # Detected forgery is terminal and leaves the true unsold original untouched.
 game.state=fixtures.forgery.duplicate(true);page._refresh()
 var fake=Model.trade_item(game.state);var fake_before=fake.duplicate(true)
 check(CounterDialogue.current(game.state).status=="rejected" and CounterDialogue.current(game.state).reason.contains("识破"),"expert fixture is rejected through real detection reducer")
 var before_ap=game.state.ap;var before_cash=game.state.cash;var before_risk=game.state.risk
 page._process(3.1);await create_timer(2).timeout
 check(game.state.trade==null and game.item(fake.uid)==fake_before and game.state.ap==before_ap and game.state.cash==before_cash and game.state.risk==before_risk,"forgery refusal leaves automatically with no repeated penalty or original loss")
 shell.queue_free();await frames()
 # A completed interaction with no further valid originals is terminal.
 var finished=fixtures.arrest.duplicate(true)
 var se_done=TradeSession.session(finished)
 for row in se_done.lines: row.status="done";row.selected=false
 se_done.goods=[];se_done.had_deal=true;se_done.bought=se_done.want_count;se_done.focus=""
 check(CounterDialogue.departure_reason(finished)=="completed","finished visit becomes terminal once no originals or demand remain")
 # Reading time begins after typing, and a delivered officer document finishes too.
 game.state=fixtures.capacity.duplicate(true)
 shell=load("res://main.tscn").instantiate();root.add_child(shell);shell.page.set_process(false);await frames();shell._close_title();await frames()
 page=shell.page;page.bubble_label.visible_ratio=.5;page._process(30)
 check(game.state.trade!=null,"long refusal cannot depart before typewriter finishes")
 page.bubble_label.visible_ratio=1;page._process(2.9)
 check(game.state.trade!=null,"finished typewriter still grants full reading delay")
 game.state=Model.create("OFFICER-EXIT");game.state.day=2;game.state.trade=WantedCases.new_officer_trade(game.state)
 page._refresh()
 check(CounterDialogue.departure_reason(game.state)=="","officer does not leave before delivering notice")
 game.dispatch({"type":"ISSUE_WANTED","tradeId":game.state.trade.id});await frames()
 page._process(3.1);await create_timer(2).timeout
 check(game.state.trade==null and WantedCases.has_notice(game.state) and game.state.documents.size()==1,"officer automatically leaves after document delivery without withdrawing notice")
 shell.queue_free();await frames()
 # Closing the shell during an animated goods transfer cannot resume stale work.
 game.prefs.reduced_motion=false;game.state=fixtures.arrest.duplicate(true)
 shell=load("res://main.tscn").instantiate();root.add_child(shell);shell.page.set_process(false);await frames();shell._close_title();await frames()
 game.dispatch({"type":"REPORT_VISITOR","tradeId":game.state.trade.id})
 await create_timer(1.45).timeout
 shell.page.leave();shell.queue_free();await frames();await create_timer(3).timeout
 check(true,"closing mid-transfer survives beyond all outstanding animations")
 for player in root.find_children("*","AudioStreamPlayer",true,false): player.stop();player.stream=null
 await process_frame
 print("COUNTER LIFECYCLE failures=",failures)
 quit(1 if failures else 0)
