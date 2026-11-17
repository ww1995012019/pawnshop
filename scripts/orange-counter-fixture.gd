extends SceneTree
## Browser-only normal saves. No production hooks or alternative game rules.
const Commerce=preload("res://scripts/model/commerce.gd")
const Layout=preload("res://scripts/model/showroom_layout.gd")
var failures:=0
func _initialize() -> void:call_deferred("run")
func check(ok:bool,text:String) -> void:
 print("ORANGE FIXTURE ","PASS " if ok else "FAIL ",text)
 if not ok:failures+=1
func issue_desk_document(state:Dictionary) -> Dictionary:
 # Preserve the real visit (including session version and all original goods)
 # while using the actual officer-issue reducer to create its separate document.
 var saved_trade=state.trade.duplicate(true) if state.trade is Dictionary else null
 state.trade=WantedCases.new_officer_trade(state)
 var issued=Commerce.reduce(state,{"type":"ISSUE_WANTED","tradeId":state.trade.id})
 issued=Commerce.reduce(issued,{"type":"TOGGLE_NOTICE","visible":false})
 issued.trade=saved_trade
 return issued
func idle_fixture() -> Dictionary:
 var s=Model.create("ORANGE-COUNTER-BROWSER-IDLE")
 s.phase="open";s.day=29;s.cash=10000;s.ap=100;s.inventory=[];s.trade=null;s.counterPreviewUid=""
 for material in GameData.materials:s.materials[material.id]=30
 var definitions=["WCH-001","WCH-007","WCH-059","WCH-010","WCH-008","WCH-057","WCH-058","WCH-062","WCH-064","WCH-076","WCH-004","WCH-002","WCH-014"]
 var all_uids:Array=[]
 for id in definitions:
  var item=Model.new_item(s,id,{"owner":"shop","condition":.95,"authentic":true,"working":true,"sourceVerified":true,"evidence":["TOL-001","TOL-002"]})
  item.watch.missing_part="";item.watch.part_mass=0.0
  Model.put_in(s,item);all_uids.append(item.uid)
 for index in 5:s=Model.reduce(s,{"type":"DISPLAY","uid":all_uids[index]})
 root.get_node("Game").ensure_shop_state(s)
 s=issue_desk_document(s);Layout.ensure(s)
 var display:Array=[];var warehouse:Array=[]
 for item in s.inventory:
  if item.location=="display":display.append(item.uid)
  elif item.location=="warehouse":warehouse.append(item.uid)
 check(display.size()==5 and warehouse.size()==8,"idle has five real display originals and eight warehouse originals")
 check(s.trade==null and s.counterPreviewUid=="" and s.phase=="open" and s.day==29,"idle has no visit, table preview or closed-hours restriction")
 check(WantedCases.has_notice(s) and s.police.wanted.size()==6 and not s.police.paper.visible,"idle owns a real six-person notice folded on the desk")
 check(s.documents.size()==1 and s.inventory.size()==13,"desk document does not consume a watch slot")
 check(s.showroomLayout.display.values().size()==5 and not s.showroomLayout.display.values().has(5),"sixth display target is genuinely unoccupied")
 var check_shelving=Model.reduce(s,{"type":"DISPLAY","uid":warehouse[0]})
 check(Model.find_inventory(check_shelving,warehouse[0]).location=="display","idle warehouse original passes the real display eligibility rule")
 return {"state":s,"display_uids":display,"warehouse_uids":warehouse}
func trade_fixture() -> Dictionary:
 var s=load("res://tests/strict_multi_counter_fixture.gd").build(false)
 s.phase="open";s.day=29;s.counterPreviewUid=""
 for item in s.inventory:
  item.sourceVerified=true;item.evidence=["TOL-001","TOL-002"]
 var session=TradeSession.session(s)
 var canceled_uid:=""
 for line in session.lines:
  var item=Model.find_inventory(s,String(line.uid))
  if line.direction=="sell" and line.get("included",false) and item!=null and item.location=="warehouse":
   canceled_uid=line.uid;break
 check(canceled_uid!="","dense visit contains a genuine warehouse offer to withdraw")
 s=Commerce.reduce(s,{"type":"COUNTER_FOCUS","tradeId":s.trade.id,"uid":canceled_uid})
 s=Commerce.reduce(s,CounterDialogue.action_for(s,"COUNTER_CANCEL"))
 check(not TradeSession.row(s,canceled_uid).get("included",false),"real cancellation frees one of the eight shop offer positions")
 var shop_uid:String=s.inventory.filter(func(item):return item.owner=="shop" and item.location=="display")[0].uid
 s=Commerce.reduce(s,{"type":"SELECT_TRADE","uid":shop_uid})
 var included=TradeSession.row(s,shop_uid)
 check(included.get("included",false) and included.direction=="sell","real SELECT_TRADE offers a display original in the freed position")
 var npc_uid:String=TradeSession.session(s).goods[0].uid
 var visitor_line=TradeSession.row(s,npc_uid)
 visitor_line.context.price=maxf(float(visitor_line.context.price),float(Model.trade_terms(s,visitor_line.context,TradeSession.item(s,npc_uid)).floor))
 s=Commerce.reduce(s,{"type":"COUNTER_FOCUS","tradeId":s.trade.id,"uid":npc_uid})
 s=Commerce.reduce(s,CounterDialogue.action_for(s,"ACCEPT"))
 check(TradeSession.row(s,npc_uid).selected and TradeSession.row(s,npc_uid).status=="confirmed","real ACCEPT prepares one visitor row for checkout-button input")
 var version:int=TradeSession.session(s).version
 s=issue_desk_document(s);Layout.ensure(s)
 session=TradeSession.session(s)
 var speech_uid:=""
 for row in session.lines:
  if row.direction=="sell" and row.uid!=shop_uid and row.get("included",false):
   speech_uid=row.uid;row.status="rejected";row.selected=false
   row.reason="这几只我都带来了，表带和机芯的情况要分别看。\n有的在旧船坞用了几年，有的只是换班时戴。\n你可以逐件核对标识、编号和重量，合适的再一起结算。\n没谈妥的先放一边，钱和原物都按各自的记录走。"
   break
 s=Commerce.reduce(s,{"type":"COUNTER_FOCUS","tradeId":s.trade.id,"uid":speech_uid})
 session=TradeSession.session(s)
 var expected_dialogue_line:String=s.trade.line
 var reloaded=CounterDialogue.begin(s.duplicate(true))
 check(reloaded.trade.line==expected_dialogue_line and expected_dialogue_line.count("\n")==3,"long presentation-only sell reason survives the real begin/reply reload path")
 check(session.version==version and session.goods.size()==8,"officer-document preparation preserves the complete dense transaction version and visitor goods")
 check(CounterDialogue.table_items(s).size()==16,"trade still displays sixteen physical originals")
 check(TradeSession.checkout_problem(s)=="","confirmed visitor original enables the real checkout action")
 check(WantedCases.has_notice(s) and s.police.wanted.size()==6 and not s.police.paper.visible,"trade owns the real folded six-person desk document")
 var shop=Model.find_inventory(s,shop_uid)
 check(shop!=null and shop.location=="display" and shop.owner=="shop","shop UID identifies the offered display original")
 check(TradeSession.item(s,npc_uid).owner=="npc" and Model.find_inventory(s,npc_uid)==null,"NPC UID remains exclusively owned by the visitor session")
 return {"state":s,"shop_uid":shop_uid,"npc_uid":npc_uid,"expected_dialogue_line":expected_dialogue_line}
func run() -> void:
 var fixtures={"idle":idle_fixture(),"trade":trade_fixture()}
 if failures>0:quit(1);return
 var error=preload("res://tests/fixture_output.gd").write_json("res://../work/orange-counter-tools/browser-fixtures.json",fixtures)
 if error!=OK:quit(1);return
 print("ORANGE FIXTURE wrote browser-fixtures.json: ",JSON.stringify({"display_uids":fixtures.idle.display_uids,"warehouse_uids":fixtures.idle.warehouse_uids,"shop_uid":fixtures.trade.shop_uid,"npc_uid":fixtures.trade.npc_uid}))
 quit()
