extends SceneTree
const Commerce=preload("res://scripts/model/commerce.gd")
var failures:=0
func _initialize():call_deferred("run")
func frames():
 for i in 8:await process_frame
func check(ok:bool,label:String):
 print("MERCHANT PERF ","PASS " if ok else "FAIL ",label)
 if not ok:failures+=1
static func fixture()->Dictionary:
 var s:=Model.create("MERCHANT-81");s.day=20;s.cash=100000;s.ap=100;s.inventory=[]
 preload("res://scripts/model/shop_journal.gd").ensure(s)
 s.storageExpansion=WarehouseExpansion.default_state(5);s.storageExpansion.columns=50
 for i in 81:
  var it:=Model.new_item(s,"WCH-%03d"%(i%78+1),{"owner":"shop","sourceVerified":true,"working":true,"condition":0.8})
  Model.put_in(s,it)
  s.shopJournal.receipts.append({"id":"perf-%d"%i,"day":19,"entries":[{"uid":it.uid,"name":GameData.def(it.defId).name}]})
 s.trade=Commerce._new_merchant(s)
 return s
func run():
 var game=root.get_node("Game");game.prefs.sound=false;game.prefs.reduced_motion=true;game.state=fixture()
 if OS.get_cmdline_user_args().has("--fixture"):
  if preload("res://tests/fixture_output.gd").write_json("res://../work/merchant-performance/fixture.json",game.state)!=OK:quit(1);return
 var shell=load("res://main.tscn").instantiate();root.add_child(shell);await frames();shell._close_title()
 var bridge=load("res://scripts/app/web_touch.gd").new();root.add_child(bridge);bridge.setup(shell)
 var start:=Time.get_ticks_usec();var first:Dictionary=bridge.snapshot();var cold:=Time.get_ticks_usec()-start
 start=Time.get_ticks_usec()
 var latest:Dictionary
 for i in 5:latest=bridge.snapshot()
 var warm:float=float(Time.get_ticks_usec()-start)/5
 print("MERCHANT SNAPSHOT 81 items: cold=%.2fms repeated=%.2fms"%[cold/1000.0,warm/1000.0])
 check(first.merchant_items.size()==81,"all 81 sale quotes remain available")
 check(warm<maxf(5000,cold*0.25),"idle status polling does not keep repricing the full inventory")
 check(latest.merchant_items==first.merchant_items,"unchanged state keeps the same quotes")
 var sold_uid:String=game.state.inventory[0].uid
 check(game.dispatch({"type":"SELL_MERCHANT_ITEM","uid":sold_uid}),"merchant sale dispatch succeeds")
 var after:Dictionary=bridge.snapshot()
 check(after.merchant_items.size()==80 and not after.merchant_items.any(func(row):return row.uid==sold_uid),"a completed sale invalidates cached inventory immediately")
 check(first.merchant_items.size()==81,"a refreshed snapshot does not mutate earlier results")
 for row in after.merchant_items.slice(0,3):
  check(row.price==Commerce.recovery_price(game.state,Model.find_inventory(game.state,row.uid)),"updated quote matches the actual settlement rule")
 var replacement:Dictionary=game.state.duplicate(true)
 replacement.inventory[0].condition=0.35
 game.state=replacement
 var replaced:Dictionary=bridge.snapshot()
 var first_item:Dictionary=replacement.inventory[0]
 check(replaced.merchant_items[0].price==Commerce.recovery_price(replacement,first_item),"loading a replacement state cannot reuse a stale quote")
 var debug=load("res://scripts/app/debug_values.gd")
 debug.begin_session()
 var index:=int(first_item.defId.get_slice("-",1))-1
 var original_value:float=GameData.def(first_item.defId).value
 var edited:Dictionary=debug.apply("data",["content","itemDefs",index,"value"],str(original_value*2+100))
 check(edited.ok,"live definition edit succeeds without replacing the game state")
 var updated:Dictionary=bridge.snapshot()
 check(not is_same(updated.merchant_items,replaced.merchant_items),"definition-change signal invalidates the cached quote list")
 check(updated.merchant_items[0].price==Commerce.recovery_price(game.state,game.state.inventory[0]),"edited item value is reflected by the next poll")
 debug.restore()
 print("MERCHANT PERF failures=",failures)
 shell.queue_free();bridge.queue_free();await frames();quit(1 if failures else 0)
