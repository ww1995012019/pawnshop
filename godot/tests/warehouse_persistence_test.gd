extends SceneTree
var failures:=0
func _initialize():call_deferred("run")
func check(ok: bool,label: String):
 print("WAREHOUSE SAVE ","PASS " if ok else "FAIL ",label)
 if not ok:failures+=1
func run():
 var game=root.get_node("Game")
 game.new_game("WAREHOUSE-PERSISTENCE");game.state.day=3;game.state.cash=1000;game.state.inventory=[]
 var uids:Array=[]
 for id in ["WCH-007","WCH-008"]:
  var it:=Model.new_item(game.state,id,{"condition":1.0,"working":true});it.watch.missing_part="";Model.put_in(game.state,it);uids.append(it.uid)
 game.save()
 var original_text:=FileAccess.get_file_as_string(game.SAVE_PATH)
 var staged:=ProjectSettings.globalize_path(game.SAVE_PATH)+".debug-tmp"
 DirAccess.make_dir_absolute(staged)
 check(not game.dispatch({"type":"EXPAND_WAREHOUSE","level":1,"uids":uids}) and game.state.cash==1000 and game.state.inventory.size()==2,"failed persistence retains live cash and selected originals")
 check(FileAccess.get_file_as_string(game.SAVE_PATH)==original_text,"failed persistence keeps the previous durable save intact")
 DirAccess.remove_absolute(staged)
 check(game.dispatch({"type":"EXPAND_WAREHOUSE","level":1,"uids":uids}) and game.state.cash==800 and game.state.inventory.is_empty(),"successful checked save commits the entire upgrade")
 var restored:Dictionary=JSON.parse_string(FileAccess.get_file_as_string(game.SAVE_PATH))
 check(restored.cash==800 and restored.inventory.is_empty() and WarehouseExpansion.columns(restored)==20,"reloaded save retains paid upgrade and consumed original UIDs")
 game.state=restored
 check(game.dispatch({"type":"BUY_PAWN_SLOTS","quantity":5,"requestId":"five-permanent"}) and game.state.cash==775,"permanent slots use the same checked settlement")
 restored=JSON.parse_string(FileAccess.get_file_as_string(game.SAVE_PATH));restored.day+=1;restored.nightCrime.policies={};WarehouseExpansion.ensure(restored)
 check(WarehouseExpansion.capacity(restored,"pawn")==25,"expiry of all insurance policies cannot reclaim purchased slots")
 var s:=Model.create("CABINET-CAPACITY");s.inventory=[]
 for i in 20:
  var it:=Model.new_item(s,"WCH-001",{"location":"display"});s.inventory.append(it)
 var spare:=Model.new_item(s,"WCH-007",{"evidence":["TOL-001","TOL-002"]});Model.put_in(s,spare)
 var rejected:Dictionary=WarehouseExpansion.reduce(s,{"type":"STORE_ITEM","uid":spare.uid,"location":"display"})
 check(Model.find_inventory(rejected,spare.uid).location=="warehouse" and rejected.inventory.size()==21,"full display drop preserves original warehouse location")
 s.storageExpansion.displayCapacity=32
 var moved:Dictionary=WarehouseExpansion.reduce(s,{"type":"STORE_ITEM","uid":spare.uid,"location":"display"})
 check(Model.find_inventory(moved,spare.uid).location=="display" and moved.inventory.size()==21,"expanded display accepts the same UID without duplication")
 var same:Dictionary=WarehouseExpansion.reduce(moved,{"type":"STORE_ITEM","uid":spare.uid,"location":"display"})
 check(Model.find_inventory(same,spare.uid).location=="display","dropping an already displayed original never toggles it back to warehouse")
 var back:Dictionary=WarehouseExpansion.reduce(moved,{"type":"STORE_ITEM","uid":spare.uid,"location":"warehouse","x":9,"y":4})
 check(Model.find_inventory(back,spare.uid).location=="warehouse" and Model.find_inventory(back,spare.uid).x==9,"cabinet drag returns the original to its requested legal warehouse cell")
 s.materials={"MAT-001":1};s.storageExpansion.materialCapacity=1
 var blocked:Dictionary=Model.reduce(s,{"type":"BUY_MATERIAL","id":"MAT-002","qty":1})
 check(not blocked.materials.has("MAT-002") and blocked.cash==s.cash,"full material-kind capacity rejects a new kind without spending")
 var stacked:Dictionary=Model.reduce(s,{"type":"BUY_MATERIAL","id":"MAT-001","qty":1})
 check(stacked.materials["MAT-001"]==2 and stacked.cash<s.cash,"existing material kinds still stack when kind capacity is full")
 print("WAREHOUSE SAVE failures=",failures);quit(1 if failures else 0)
