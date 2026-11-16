extends "res://tests/night_crime_ui_test.gd"
## Regressions for the measured comic UI, using real input and reducer actions.
func run() -> void:
 # Source-coordinate checks need the measured desktop resolution. Headless
 # Godot otherwise starts at 64×64, which correctly gets a taller layout.
 root.size=Vector2i(1920,1080)
 var game=root.get_node("Game");game.prefs.reduced_motion=true;game.prefs.sound=false
 game.new_game("STRICT-QUOTE")
 game.state.trade={"id":"strict-quote","npcId":"CHR-002","kind":"buy","item":Model.new_item(game.state,"WCH-002",{"owner":"npc","sourceVerified":true}),"price":100,"rounds":0,"locked":false,"evidenceUsed":[],"line":"请报价。"}
 game.state=CounterDialogue.begin(game.state)
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
 var page=shell.page;var view=page.strict_view
 check(view.visible and not page.find_child("DesktopCounter",true,false).visible,"PC uses the measured comic counter")
 var paper=view.get_node("StrictTradePaper")
 check(paper.position==Vector2(1186,68) and paper.size==Vector2(485,791),"transaction folio retains source coordinates")
 check(view.get_node("StrictSpeechBubble") is TextureRect,"dialogue uses the independent tailed bubble asset")
 var quote_paper=Color("f7e5c3")
 check(contrast(view.quote.get_theme_color("font_uneditable_color"),quote_paper)>=4.5,"confirmed quote digits remain readable on paper")
 var selection=quote_paper.blend(view.quote.get_theme_color("selection_color"))
 check(contrast(view.quote.get_theme_color("font_selected_color"),selection)>=4.5,"selected quote digits retain readable contrast")
 check(contrast(view.quote.get_theme_color("caret_color"),quote_paper)>=3.0,"quote caret remains visible on paper")
 var stock_button=view.find_child("strict_stock_"+str(game.state.inventory[0].uid),true,false)
 page._refresh();await frames()
 check(is_instance_valid(stock_button),"quote refresh retains inventory button identity during pointer gestures")
 var actions=[]
 game.changed.connect(func(_before,_after,action):actions.append(action.duplicate(true)))
 var price=clampi(int(page.dial.value)+11,int(page.dial.min_value),int(page.dial.max_value))
 if price==page.dial.value:price=maxi(int(page.dial.min_value),price-11)
 var cash:float=game.state.cash;var ap:float=game.state.ap
 await click(view.quick_list.find_child("quick_offer_"+str(TradeSession.session(game.state).focus),true,false));await frames()
 var editor=view.quick_list.find_child("QuickOfferValue",true,false)
 editor.text=str(price)
 await click(view.quick_list.find_child("QuickOfferSubmit",true,false));await frames()
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
 shell.queue_free();await frames()
 for hole in [false,true]:
  game.state=preload("res://tests/strict_multi_counter_fixture.gd").build(hole)
  shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
  check(CounterDialogue.table_items(game.state).size()==(15 if hole else 16),"dense fixture retains every original after partial checkout" if hole else "dense fixture reaches eight originals on each side")
  _check_table_readability(shell.page.strict_view)
  if hole:
   var moving:String=TradeSession.session(game.state).goods[4].uid
   var original_x:float=shell.page.strict_view.table.get_node("strict_table_"+moving).position.x
   shell.page.strict_view._drop_data(Vector2(940,501),{"kind":"strict_trade","uid":moving});await frames()
   var stored=TradeSession.session(game.state).table_positions[moving]
   check(Vector2(float(stored[0]),float(stored[1]))==Vector2(1104,508) and shell.page.strict_view.table.get_node("strict_table_"+moving).position.x>original_x+40,"dragging into the empty slot uses the same visible-to-canonical mapping")
  shell.queue_free();await frames()
 print("STRICT UI failures=",failures);quit(1 if failures else 0)

func _check_table_readability(view) -> void:
 var safe=Rect2(470,451,704,294);var tags:Array[Rect2]=[];var hits:Array[Rect2]=[]
 var within=true;var separated=true;var distinct=true;var fitted=true
 var inverse=view.get_global_transform().affine_inverse()
 for key in view.table.get_children():
  var label=key.find_children("*","Label",true,false)[0]
  var tag:Rect2=inverse*label.get_global_rect();var hit:Rect2=inverse*key.get_global_rect()
  within=within and safe.encloses(tag) and safe.encloses(hit)
  for previous in tags:separated=separated and not tag.grow(3).intersects(previous.grow(3))
  for previous in hits:distinct=distinct and not hit.intersects(previous)
  fitted=fitted and hit.encloses(tag) and label.get_theme_font("font").get_string_size(label.text,HORIZONTAL_ALIGNMENT_LEFT,-1,label.get_theme_font_size("font_size")).x<=tag.size.x-4
  tags.append(tag);hits.append(hit)
 check(within,"all originals and prices remain inside the counter, clear of the bell and folio")
 check(separated,"dense price tags retain at least six pixels of space")
 check(distinct,"upper and lower originals retain separate pointer targets")
 check(fitted,"every displayed price fits its own tag")
 check(view.speech.get_theme_font_size("normal_font_size")<=20 and view.speech.get_content_height()<=view.speech.size.y,"ordinary dialogue fits the smaller three-line speech area")

func contrast(front: Color,back: Color) -> float:
 var shown=back.blend(front).srgb_to_linear();var background=back.srgb_to_linear()
 var a=.2126*shown.r+.7152*shown.g+.0722*shown.b
 var b=.2126*background.r+.7152*background.g+.0722*background.b
 return (maxf(a,b)+.05)/(minf(a,b)+.05)
