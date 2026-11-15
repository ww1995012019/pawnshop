extends "res://tests/night_crime_ui_test.gd"
## Regressions for the measured comic UI, using real input and reducer actions.
func run() -> void:
 var game=root.get_node("Game");game.prefs.reduced_motion=true;game.prefs.sound=false
 game.new_game("STRICT-QUOTE")
 game.state.trade={"id":"strict-quote","npcId":"CHR-002","kind":"buy","item":Model.new_item(game.state,"WCH-002",{"owner":"npc","sourceVerified":true}),"price":100,"rounds":0,"locked":false,"evidenceUsed":[],"line":"请报价。"}
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
 var page=shell.page;var view=page.strict_view
 check(view.visible and not page.find_child("DesktopCounter",true,false).visible,"PC uses the measured comic counter")
 var paper=view.get_node("StrictTradePaper")
 check(paper.position==Vector2(1186,68) and paper.size==Vector2(485,791),"transaction folio retains source coordinates")
 check(view.get_node("StrictSpeechBubble") is TextureRect,"dialogue uses the independent tailed bubble asset")
 var stock_button=view.find_child("strict_stock_"+str(game.state.inventory[0].uid),true,false)
 page._refresh();await frames()
 check(is_instance_valid(stock_button),"quote refresh retains inventory button identity during pointer gestures")
 var actions=[]
 game.changed.connect(func(_before,_after,action):actions.append(action.duplicate(true)))
 var price=clampi(int(page.dial.value)+11,int(page.dial.min_value),int(page.dial.max_value))
 if price==page.dial.value:price=maxi(int(page.dial.min_value),price-11)
 var cash:float=game.state.cash;var ap:float=game.state.ap
 view.quote.text=str(price);view.quote.text_changed.emit(view.quote.text)
 await click(view.trade_buttons[0]);await frames()
 var sent=actions.filter(func(action):return action.get("type","")=="OFFER")
 check(not sent.is_empty() and int(sent.back().get("price",-1))==price,"typing then clicking Offer submits the typed amount without Enter")
 check(game.state.cash==cash and game.state.ap==ap,"quoting does not transfer cash or consume AP")
 # Special visits have no trade row: stock must open storage, not SELECT_TRADE.
 shell.queue_free();await frames()
 game.new_game("STRICT-MERCHANT");game.state.cursor=4;game.dispatch({"type":"ARRIVE"})
 check(game.state.trade.kind=="merchant","special-visit fixture reaches the real merchant")
 shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
 page=shell.page;view=page.strict_view
 var uid:String=game.state.inventory[0].uid
 cash=game.state.cash;ap=game.state.ap
 await click(view.find_child("strict_stock_"+uid,true,false));await frames()
 check(shell.workspace_open() and shell.workspace_shell.page_name=="warehouse","merchant stock click opens the original's storage workspace")
 check(game.state.trade.kind=="merchant" and not game.state.trade.has("selectedUid") and game.state.cash==cash and game.state.ap==ap,"special-visit browsing preserves visitor, ownership, cash and AP")
 shell.queue_free();await frames()
 game.new_game("STRICT-SLOTS")
 var lots=game.state.inventory.filter(func(it):return it.location=="warehouse")
 while lots.size()<2:
  var lot=Model.new_item(game.state,"WCH-002",{"sourceVerified":false});Model.put_in(game.state,lot);lots.append(lot)
 game.ensure_shop_state(game.state)
 shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
 page=shell.page;view=page.strict_view
 var first:String=lots[0].uid;var second:String=lots[1].uid
 var old_first=view.find_child("strict_stock_"+first,true,false).position
 var old_second=view.find_child("strict_stock_"+second,true,false).position
 var destination:int=game.state.showroomLayout.warehouse[second]
 game.dispatch({"type":"SHOWROOM_PLACE","uid":first,"location":"warehouse","slot":destination});await frames()
 var moved=view.find_child("strict_stock_"+first,true,false)
 var swapped=view.find_child("strict_stock_"+second,true,false)
 check(moved.position==old_second and swapped.position==old_first and moved.slot==destination,"same-cabinet swaps update rendered order and subsequent drop addresses")
 # Keep the old button alive while replacing the item dictionary, as reducers do.
 game.state=game.state.duplicate(true)
 game.item(first).sourceVerified=true;game.item(first).service={"opened":false}
 game.state.trade={"id":"strict-current-item","npcId":"CHR-002","kind":"sell","item":null,"price":100,"rounds":0,"locked":false,"evidenceUsed":[],"line":"请选货。"}
 moved.pressed.emit();await frames()
 check(game.state.trade.get("selectedUid","")==first,"a retained stock control checks the current item after verification or sealing")
 shell.queue_free();await frames()
 game.new_game("PHYSICAL-TABLE");game.dispatch({"type":"ARRIVE"})
 var se=TradeSession.session(game.state)
 while se.goods.is_empty():se.goods.append(Model.new_item(game.state,"WCH-002",{"owner":"npc","sourceVerified":true}))
 game.state=CounterDialogue.begin(game.state)
 shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
 page=shell.page;view=page.strict_view
 var moving_uid:String=se.goods[0].uid
 var before_position=view.table.get_node("strict_table_"+moving_uid).position
 cash=game.state.cash;ap=game.state.ap
 view._drop_data(Vector2(780,510),{"kind":"strict_trade","uid":moving_uid});await frames()
 check(view.table.get_node("strict_table_"+moving_uid).position!=before_position and TradeSession.session(game.state).get("table_positions",{}).has(moving_uid),"table dragging immediately renders the saved canonical position")
 check(game.state.cash==cash and game.state.ap==ap,"table placement preserves cash, AP and ownership")
 shell.queue_free();await frames();print("STRICT UI failures=",failures);quit(1 if failures else 0)
