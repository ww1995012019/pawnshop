extends SceneTree
const Commerce=preload("res://scripts/model/commerce.gd")
var failures:=0
func _initialize():call_deferred("run")
func frames(n:=10):
 for i in n:await process_frame
func check(ok:bool,text:String):
 print("COUNTER STORAGE ","PASS " if ok else "FAIL ",text)
 if not ok:failures+=1
func fixture(display:=true)->Dictionary:
 var s=Model.create("TABLE-STORAGE");s.inventory=[];s.ap=12;s.cash=10000
 var own=Model.new_item(s,"WCH-001",{"condition":1.0,"authentic":true,"working":true,"sourceVerified":true})
 own.location="display" if display else "warehouse";own.x=0;own.y=0;s.inventory.append(own)
 var visitor=Model.new_item(s,"WCH-002",{"owner":"npc","condition":1.0,"authentic":true,"working":true,"sourceVerified":true})
 s.trade={"id":"storage-visit","npcId":"CHR-019","kind":"buy","item":visitor,"price":100,"rounds":0,"locked":false,"evidenceUsed":[],"line":"请看看。"}
 s=CounterDialogue.begin(s)
 s=Commerce.reduce(s,{"type":"SELECT_TRADE","uid":own.uid})
 preload("res://scripts/model/showroom_layout.gd").ensure(s)
 return s
func store_action(s:Dictionary,uid:String)->Dictionary:
 return {"type":"COUNTER_STORE","tradeId":s.trade.id,"uid":uid,"version":TradeSession.session(s).version}
func facts(it:Dictionary)->Dictionary:
 var out=it.duplicate(true)
 for key in ["location","x","y"]:out.erase(key)
 return out
func fill(s:Dictionary):
 for n in 100:
  var it=Model.new_item(s,"WCH-001",{"condition":1.0,"authentic":true,"working":true,"sourceVerified":true})
  var point=Model.empty_cell(s,it)
  if point==null:return
  it.location="warehouse";it.x=point.x;it.y=point.y;s.inventory.append(it)
func run():
 var game=root.get_node("Game");game.prefs.sound=false;game.prefs.reduced_motion=true
 for displayed in [true,false]:
  var s=fixture(displayed);var uid:String=s.inventory[0].uid
  TradeSession.row(s,uid).selected=true;TradeSession.row(s,uid).status="confirmed"
  var before=s.inventory[0].duplicate(true)
  check(TradeSession.row(s,uid).get("included",false),"fixture offers the actual shop original")
  var next=Commerce.reduce(s,store_action(s,uid));var original=Model.find_inventory(next,uid)
  check(original.location=="warehouse" and not TradeSession.row(next,uid).get("included",false),"table return withdraws the offered original and stores it (display=%s)"%displayed)
  check(facts(original)==facts(before) and next.cash==s.cash and next.ap==s.ap and next.trade.id==s.trade.id,"return preserves UID, item facts, cash, AP and visitor")
  var stale=store_action(s,uid);stale.version-=1
  var rejected=Commerce.reduce(s,stale)
  check(rejected.inventory==s.inventory and TradeSession.row(rejected,uid)==TradeSession.row(s,uid),"stale drag cannot withdraw a newly changed offer")
  var visitor_uid:String=TradeSession.session(s).goods[0].uid
  rejected=Commerce.reduce(s,store_action(s,visitor_uid))
  check(rejected.inventory==s.inventory and rejected.cash==s.cash and rejected.ap==s.ap,"visitor original cannot become shop stock through dragging")
 var full=fixture();var full_uid:String=full.inventory[0].uid;fill(full)
 var full_before=full.inventory.duplicate(true);var offered=TradeSession.row(full,full_uid).duplicate(true)
 var rejected=Commerce.reduce(full,store_action(full,full_uid))
 check(rejected.inventory==full_before and TradeSession.row(rejected,full_uid)==offered,"full storage rejects atomically and keeps the original offer")
 for restriction in ["sealed","order","isolation","opened","custody","closed"]:
  var limited=fixture();var limited_uid:String=limited.inventory[0].uid
  match restriction:
   "sealed":limited.inventory[0].sealed=true
   "order":limited.inventory[0].orderId="reserved-order"
   "isolation":limited.inventory[0].location="isolation"
   "opened":limited.inventory[0].service.opened=true
   "custody":limited.inventory[0].owner="consignment"
   "closed":limited.phase="report"
  rejected=Commerce.reduce(limited,store_action(limited,limited_uid))
  check(rejected.inventory==limited.inventory and TradeSession.row(rejected,limited_uid)==TradeSession.row(limited,limited_uid) and rejected.ap==limited.ap and rejected.cash==limited.cash,"restricted original remains unchanged: "+restriction)
 root.size=Vector2i(1920,1080);game.new_game("THREE-COLUMN-SHELVES");game.state.inventory=[]
 for n in 6:
  var it=Model.new_item(game.state,"WCH-001",{"condition":1.0,"authentic":true,"working":true,"sourceVerified":true})
  it.location="display";game.state.inventory.append(it)
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
 var view=shell.page.strict_view
 check(view._display_position(3).y==view._display_position(5).y and view._display_position(3).x<view._display_position(4).x and view._display_position(4).x<view._display_position(5).x,"second shelf has three positions in the same row")
 var sixth:Control=view.find_child("strict_stock_"+game.state.inventory[5].uid,true,false)
 check(sixth!=null and sixth.position.y+sixth.size.y<=view.display_scroll.size.y,"sixth watch is visible in the first two shelves")
 var visible_shelf:Rect2=view.display_scroll.get_global_rect()
 var bar:Control=view.display_scroll.get_v_scroll_bar()
 if bar.is_visible_in_tree():visible_shelf.size.x=bar.get_global_rect().position.x-visible_shelf.position.x
 var price:Label=sixth.find_children("*","Label",true,false)[0]
 check(visible_shelf.encloses(price.get_global_rect()),"third-column price is fully visible beside the scroll bar")
 var sixth_uid:String=game.state.inventory[5].uid
 game.state.inventory.remove_at(5);preload("res://scripts/model/showroom_layout.gd").ensure(game.state);view._inventory()
 check(view.shelves.has_node("strict_empty_display_5"),"five watches leave a usable third target on the second shelf")
 var uid:String=game.state.inventory[0].uid;shell.page.showroom.select_original(uid);await frames()
 var at:Vector2=view.stock_art.position+Vector2(28,28)
 var data={"kind":"showroom_original","uid":uid}
 check(view._can_drop_data(at,data),"stock header accepts a table return, just like its cells")
 var cash:float=game.state.cash;var ap:float=game.state.ap
 view._drop_data(at,data);await frames()
 check(game.item(uid).location=="warehouse" and str(game.state.get("counterPreviewUid",""))=="","dropping on stock stores the same original and clears the table")
 check(game.state.cash==cash and game.state.ap==ap and game.state.inventory.size()==5 and game.item(sixth_uid)==null,"direct return does not duplicate goods or charge money/AP")
 shell.queue_free();await frames()
 for displayed in [true,false]:
  game.state=fixture(displayed)
  shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
  view=shell.page.strict_view;uid=game.state.inventory[0].uid
  var offered_data={"kind":"strict_trade","uid":uid,"trade_id":game.state.trade.id,"version":TradeSession.session(game.state).version}
  at=view.stock_art.position+Vector2(100,28)
  check(view._can_drop_data(at,offered_data),"stock frame accepts the shop original during a visit (display=%s)"%displayed)
  var visitor_uid:String=TradeSession.session(game.state).goods[0].uid
  var visitor_data=offered_data.duplicate();visitor_data.uid=visitor_uid
  check(not view._can_drop_data(at,visitor_data),"stock frame rejects the visitor's physical original")
  view._drop_data(at,offered_data);await frames();await create_timer(.35).timeout
  check(game.item(uid).location=="warehouse" and not view.table.has_node("strict_table_"+uid),"real counter action removes the offered picture and stores its exact UID")
  check(game.state.cash==10000 and game.state.ap==12,"return during negotiation is not a checkout")
  shell.queue_free();await frames()
 game.state=fixture(false);game.state.trade=null
 var table_uid:String=game.state.inventory[0].uid
 var other=Model.new_item(game.state,"WCH-002",{"condition":1.0,"authentic":true,"working":true,"sourceVerified":true})
 check(Model.put_in(game.state,other),"second warehouse original fits")
 shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title();await frames()
 shell.page.showroom.select_original(table_uid);await frames();view=shell.page.strict_view
 view._drop_data(view.stock_art.position+Vector2(40,28),{"kind":"showroom_original","uid":other.uid});await frames()
 check(str(game.state.get("counterPreviewUid",""))==table_uid and view.table.has_node("strict_table_"+table_uid) and game.item(other.uid).location=="warehouse","dragging stock B to its own cabinet never returns lifted original A")
 shell.queue_free();await frames()
 print("COUNTER STORAGE failures=",failures);quit(1 if failures else 0)
