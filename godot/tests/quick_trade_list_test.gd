extends "res://tests/night_crime_ui_test.gd"
func named(node: Node,key: String) -> Button:
 return node.find_child(key,true,false) as Button
func run():
 root.size=Vector2i(1920,1080)
 var game=root.get_node("Game");game.prefs.reduced_motion=true;game.prefs.sound=false
 game.state=preload("res://tests/strict_multi_counter_fixture.gd").build(false)
 var se=TradeSession.session(game.state);se.goods.resize(2)
 var ids=se.goods.map(func(it):return it.uid)
 se.lines=se.lines.filter(func(line):return line.uid in ids)
 for line in se.lines:line.context.price=minf(Model.trade_terms(game.state,line.context,TradeSession.item(game.state,line.uid)).marketCap,ceil(Model.trade_terms(game.state,line.context,TradeSession.item(game.state,line.uid)).floor*1.5))
 game.state=CounterDialogue.begin(game.state)
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
 var view=shell.page.strict_view;var list=view.get_node_or_null("QuickTradeList")
 check(list!=null and list.is_visible_in_tree(),"ordinary customer opens the direct item quick list")
 if list==null:shell.queue_free();await frames();quit(1);return
 var cash:float=game.state.cash;var ap:float=game.state.ap
 var first:String=ids[0];var second:String=ids[1]
 var retained=named(list,"quick_select_"+second)
 await click(named(list,"quick_select_"+first));await click(named(list,"quick_select_"+second));await frames()
 check(TradeSession.summary(game.state).buy_count==2 and game.state.cash==cash and game.state.ap==ap,"selecting two originals locks their prices without paying or consuming AP")
 check(is_instance_valid(retained) and retained==named(list,"quick_select_"+second),"row controls survive confirmation and focus refreshes")
 await click(named(list,"quick_select_"+first));await frames()
 check(not TradeSession.row(game.state,first).selected and TradeSession.row(game.state,second).selected,"canceling one choice retains the other original and its agreement")
 await click(named(list,"quick_more_"+first));await frames()
 check(button(list,"抵押合同")!=null or list.popup!=null and list.popup.visible,"row extras retain the existing per-original actions")
 list.close_popup();await frames()
 await click(named(list,"quick_offer_"+first));await frames()
 var edit=list.find_child("QuickOfferValue",true,false)
 check(edit!=null and edit.is_visible_in_tree(),"row negotiation opens the quote editor for this original")
 var agreed=TradeSession.row(game.state,first).context.price+5
 var untouched=game.state.duplicate(true)
 if edit!=null:
  edit.text="abc";await click(named(list,"QuickOfferSubmit"));await frames()
  check(game.state==untouched and is_instance_valid(edit),"invalid price stays in the editor without changing the quote")
 if edit!=null:
  edit.text=str(int(agreed));await click(named(list,"QuickOfferSubmit"));await frames()
 check(TradeSession.row(game.state,first).selected and TradeSession.row(game.state,first).context.price==agreed,"quote submit uses the typed price and exact row UID")
 var stable=game.state.duplicate(true)
 view._quick_action("toggle",second,game.state.trade.id,int(TradeSession.session(game.state).version)-1,TradeSession.row(game.state,second).context.price)
 check(game.state==stable,"stale list version cannot change a selection")
 view._quick_action("toggle",second,"old-visitor",int(TradeSession.session(game.state).version),TradeSession.row(game.state,second).context.price)
 check(game.state==stable,"stale visitor callback cannot act on the current encounter")
 view._quick_action("toggle",second,game.state.trade.id,int(TradeSession.session(game.state).version),TradeSession.row(game.state,second).context.price+1)
 check(game.state==stable,"changed displayed quote cannot select an unseen price")
 await click(named(list,"quick_inspect_"+second));await frames()
 check(shell.workspace_open() and shell.workspace_shell.page.item.uid==second,"row inspection opens the exact original")
 stable=game.state.duplicate(true)
 view._quick_action("toggle",first,game.state.trade.id,int(TradeSession.session(game.state).version),TradeSession.row(game.state,first).context.price)
 check(game.state==stable,"a workspace blocks retained quick-list actions")
 shell.close_workspace();await frames()
 var due:float=TradeSession.summary(game.state).expense
 for resource in ["cash","ap"]:
  var original:float=game.state[resource];game.state[resource]=0;list.refresh(game.state);await frames()
  check(list.checkout.disabled and list.balance.text!="","insufficient "+resource+" disables checkout with a reason")
  var before=game.state.duplicate(true)
  view._quick_action("checkout","",game.state.trade.id,int(TradeSession.session(game.state).version),TradeSession.summary(game.state).net);await frames()
  check(game.state.cash==before.cash and game.state.ap==before.ap and TradeSession.summary(game.state).buy_count==2,"retained checkout cannot bypass "+resource+" eligibility")
  game.state[resource]=original;list.refresh(game.state);await frames()
 var version:int=TradeSession.session(game.state).version
 var trade_id:String=game.state.trade.id
 await click(named(list,"QuickCheckout"));await idle(shell.page)
 check(game.state.cash==cash-due and game.state.ap==ap-1,"two-original batch checkout deducts the actual total and exactly one AP")
 check(game.state.inventory.filter(func(it):return it.uid in ids).size()==2,"checkout transfers each selected original exactly once")
 view._quick_action("checkout","",trade_id,version,-due);await frames()
 check(game.state.cash==cash-due and game.state.ap==ap-1,"replayed checkout cannot charge money or AP twice")
 game.state=preload("res://tests/strict_multi_counter_fixture.gd").build(false)
 var risk_session=TradeSession.session(game.state);risk_session.goods.resize(1)
 var risk_uid:String=risk_session.goods[0].uid;risk_session.goods[0].sourceVerified=false
 risk_session.lines=risk_session.lines.filter(func(line):return line.uid==risk_uid)
 risk_session.lines[0].context.price=Model.trade_terms(game.state,risk_session.lines[0].context,risk_session.goods[0]).marketCap
 game.state=CounterDialogue.begin(game.state);shell.page._refresh();await frames()
 cash=game.state.cash;ap=game.state.ap
 await click(named(list,"quick_select_"+risk_uid));await frames()
 check(shell.modal_open() and not TradeSession.row(game.state,risk_uid).selected,"unverified source still requires the existing per-original risk consent")
 await click(button(shell,"承担风险并锁价"));await frames()
 check(TradeSession.row(game.state,risk_uid).selected and game.state.cash==cash and game.state.ap==ap,"source consent only locks this price and never settles automatically")
 # Shop originals distinguish unselecting a settlement from withdrawing a presentation.
 game.state=preload("res://tests/strict_multi_counter_fixture.gd").build(false)
 var shop_lines=TradeSession.session(game.state).lines.filter(func(line):return line.direction=="sell")
 var shop_uid:String=shop_lines[0].uid;var other_uid:String=shop_lines[1].uid
 for line in shop_lines:line.context.price=1
 shell.page._refresh();await frames()
 var before_position=TradeSession.session(game.state).table_positions[shop_uid].duplicate()
 cash=game.state.cash;ap=game.state.ap
 await click(named(list,"quick_select_"+other_uid));await click(named(list,"quick_select_"+shop_uid));await frames()
 check(TradeSession.row(game.state,shop_uid).selected and TradeSession.row(game.state,other_uid).selected,"shop originals can join the same selected settlement")
 await click(named(list,"quick_select_"+shop_uid));await frames()
 check(TradeSession.row(game.state,shop_uid).included and not TradeSession.row(game.state,shop_uid).selected and CounterDialogue.table_items(game.state).any(func(info):return info.uid==shop_uid) and TradeSession.session(game.state).table_positions.get(shop_uid,[])==before_position,"unselecting preserves the shop original, list row and exact table position")
 check(TradeSession.row(game.state,other_uid).selected and game.state.cash==cash and game.state.ap==ap,"shop unselection preserves other agreements, money and AP")
 if named(list,"quick_select_"+shop_uid)!=null:
  await click(named(list,"quick_select_"+shop_uid));await frames()
  check(TradeSession.row(game.state,shop_uid).selected,"an unselected shop original can be reselected in place")
  await click(named(list,"quick_select_"+shop_uid));await frames()
 # Force the unselected original's real reducer status to rejected; withdrawal is
 # still available even though the selection button cannot be used as a workaround.
 var rejected_uid:String=shop_lines[2].uid
 var rejected=TradeSession.row(game.state,rejected_uid);rejected.status="rejected";rejected.selected=false;rejected.reason="本次先不收。"
 shell.page._refresh();await frames()
 check(CounterDialogue.table_items(game.state).filter(func(info):return info.direction=="sell").size()==8,"withdrawal fixture presents the full eight shop originals")
 await click(named(list,"quick_more_"+rejected_uid));await frames()
 var withdraw=button(list,"收回本件")
 check(withdraw!=null and not withdraw.disabled,"rejected and unselected originals retain explicit withdrawal in More")
 await click(withdraw);await frames()
 check(not TradeSession.row(game.state,rejected_uid).included and not CounterDialogue.table_items(game.state).any(func(info):return info.uid==rejected_uid) and TradeSession.row(game.state,other_uid).selected and game.state.cash==cash and game.state.ap==ap,"explicit withdrawal frees a full presentation slot without paying or canceling other selections")
 shell.queue_free();await frames();print("QUICK LIST failures=",failures);quit(1 if failures else 0)
