extends "res://tests/night_crime_ui_test.gd"
func run() -> void:
 root.size=Vector2i(1440,900)
 var game=root.get_node("Game");game.prefs.reduced_motion=true;game.prefs.sound=false
 game.new_game("PHYSICAL-TABLE");game.dispatch({"type":"ARRIVE"})
 var se=TradeSession.session(game.state)
 while se.goods.size()<3: se.goods.append(Model.new_item(game.state,"WCH-002",{"owner":"npc","sourceVerified":true,"working":true}))
 game.state=CounterDialogue.begin(game.state)
 for it in game.state.inventory: it.sourceVerified=true;it.authentic=true;it.working=true;it.condition=0.9
 TradeSession.session(game.state).cash=5000;TradeSession.session(game.state).want_count=6
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
 var page=shell.page
 var table=page.get("counter_table")
 check(table!=null,"counter has a physical multi-original surface")
 if table==null: shell.queue_free();await frames();quit(1);return
 check(table.sprites.size()==3,"all three NPC originals are already laid out without asking next")
 var first: String=game.state.inventory[0].uid;var second: String=game.state.inventory[1].uid
 await click(button_named(page,"stock_recommend_"+first));await click(button_named(page,"stock_recommend_"+second))
 check(table.sprites.size()==5 and table.sprites.has(first) and table.sprites.has(second),"two player originals join three NPC originals on the same desk")
 var old_sprite=table.sprites[first]
 var before: float=game.state.cash
 await point(table.sprites[first].global_position)
 check(TradeSession.session(game.state).focus==first and table.sprites[first]==old_sprite and table.sprites.size()==5 and game.state.cash==before,"click focuses an existing physical original without replacing or buying others")
 var first_back: bool=table.sprites[first].back
 var second_back: bool=table.sprites[second].back
 await point(table.sprites[second].global_position,MOUSE_BUTTON_RIGHT)
 check(table.sprites[second].back!=second_back and table.sprites[first].back==first_back,"right-click flips the pointed original without changing the other one")
 check(table.sprites[second].get_meta("display_height",0.0)>=140,"focused original is large enough to inspect on the desk")
 check(table.sprites[second].position.distance_to(Vector2(990,585))<1,"focused original occupies central work mat")
 check(is_instance_valid(page.focus_inspect) and page.focus_inspect.is_visible_in_tree(),"central original has a direct instrument key")
 check(page.find_child("dialogue_next_goods",true,false)==null,"normal table needs no next-item dialogue button")
 page._focus_table(first);await frames()
 page.focus_inspect.pressed.emit();await frames()
 check(shell.workspace_open() and shell.active_shell().page.it_uid==first,"instrument key inspects the selected original")
 shell.close_workspace();await frames()
 table=page.get("counter_table")
 check(table.sprites.size()==5 and table.sprites.has(first) and table.sprites.has(second),"inspection return retains the full tabletop")
 # Six player lots and three NPC lots have independent usable hit regions.
 for i in 4:
  var lot=Model.new_item(game.state,"WCH-002",{"sourceVerified":true,"working":true,"authentic":true,"condition":0.9});Model.put_in(game.state,lot)
  page._stock_clicked(lot.uid,true,null);await frames()
 check(table.sprites.size()==9,"maximum six player plus three NPC originals are simultaneously visible")
 for uid in table.sprites:
  var sprite=table.sprites[uid]
  check(table.hit_test(sprite.global_position)==uid,"each original has a distinct physical hit target: "+uid)
 # Focus and confirm only two of the nine; the rest stay on the desk.
 game.dispatch({"type":"COUNTER_FOCUS","tradeId":game.state.trade.id,"uid":first});await frames()
 game.dispatch(CounterDialogue.action_for(game.state,"ACCEPT"));await frames()
 await point(table.sprites[second].global_position)
 var npc_uid: String=TradeSession.session(game.state).goods[0].uid
 game.dispatch({"type":"COUNTER_FOCUS","tradeId":game.state.trade.id,"uid":npc_uid});await frames()
 game.dispatch(CounterDialogue.action_for(game.state,"ACCEPT"));await frames()
 game.dispatch(CounterDialogue.action_for(game.state,"DELIVER"));await idle(page)
 check(table.sprites.size()==7 and not table.sprites.has(first) and not table.sprites.has(npc_uid) and table.sprites.has(second),"partial settlement moves only two agreed originals and leaves seven on the desk")
 check(page.handover_history.size()==2 and game.state.trade!=null,"each agreed original changes hands and the same NPC stays")
 var extra=Model.new_item(game.state,"WCH-002",{"sourceVerified":true,"working":true,"authentic":true,"condition":0.9});Model.put_in(game.state,extra)
 page._stock_clicked(extra.uid,true,null);await frames()
 for uid in table.sprites: check(table.hit_test(table.sprites[uid].global_position)==uid,"adding after partial checkout leaves separate original hit targets: "+uid)
 game.prefs.reduced_motion=false
 var animated=table.sprites[extra.uid]
 var home: Vector2=animated.position
 for repeat in 2:
  animated.position=home+Vector2(20,0)
  table.sync(game.state)
  await create_timer(.3).timeout
  check(animated.position.distance_to(home)<.5,"normal animation settles into the same saved slot on move "+str(repeat+1))
 game.prefs.reduced_motion=true
 game.dispatch({"type":"REFUSE"});await idle(page)
 check(table.sprites.is_empty() and game.state.trade==null,"send-off clears all visible originals without phantom copies")
 shell.queue_free();await frames();print("TABLE UI failures=",failures);quit(1 if failures else 0)
func button_named(node: Node,key: String) -> Button:
 for b in node.find_children("*","Button",true,false):
  if b.name==key and b.is_visible_in_tree(): return b
 return null
func point(position: Vector2,mouse_button:=MOUSE_BUTTON_LEFT) -> void:
 var p=root.get_screen_transform()*root.get_canvas_transform()*position
 var motion=InputEventMouseMotion.new();motion.position=p;Input.parse_input_event(motion)
 for pressed in [true,false]:
  var event=InputEventMouseButton.new();event.position=p;event.global_position=p;event.button_index=mouse_button;event.pressed=pressed;Input.parse_input_event(event);await frames()
