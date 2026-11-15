extends SceneTree
func _initialize():call_deferred("run")
func run():
 var game=root.get_node("Game");game.new_game("STRICT-REFERENCE")
 game.state.day=25;game.state.cash=979081;game.state.ap=10;game.state.risk=100
 game.state.inventory=[]
 var models=["WCH-001","WCH-007","WCH-059","WCH-010","WCH-008","WCH-001","WCH-059","WCH-020","WCH-007","WCH-023","WCH-010","WCH-024","WCH-016","WCH-059","WCH-014","WCH-008","WCH-020"]
 var prices=[90,123,213,143,107]
 for i in 33:
  var it=Model.new_item(game.state,models[i%models.size()],{"condition":.82,"authentic":true,"working":true,"sourceVerified":true,"evidence":["TOL-001"]})
  if i<5:it.location="display";it.listPrice=prices[i];game.state.inventory.append(it)
  else:Model.put_in(game.state,it)
 game.ensure_shop_state(game.state)
 game.dispatch({"type":"ARRIVE"})
 var t=game.state.trade
 t.npcId="CHR-021";t.price=170;t.rounds=0;t.line="这只表，170 Cr。\n你看看。"
 var se=TradeSession.session(game.state)
 var original=Model.new_item(game.state,"WCH-059",{"condition":.82,"authentic":true,"working":true,"sourceVerified":true,"owner":"npc","evidence":["TOL-001"]})
 se.goods=[original];se.lines=[];se.focus=original.uid
 var buy=TradeSession._new_row(game.state,original,"buy");buy.context.npcId="CHR-021";buy.context.price=170;se.lines.append(buy)
 var front_models=["WCH-004","WCH-002","WCH-005","WCH-013","WCH-014","WCH-059","WCH-015"]
 var sale_prices=[202,102,25,380,191,95,714]
 for i in 7:
  var it=game.state.inventory[i+17]
  var replacement=Model.new_item(game.state,front_models[i],{"condition":.82,"authentic":true,"working":true,"sourceVerified":true,"evidence":["TOL-001"]})
  if i==0:replacement.forgery={"methods":{"logo":{"removed":true}}}
  replacement.uid=it.uid;replacement.x=it.x;replacement.y=it.y;game.state.inventory[i+17]=replacement;it=replacement
  var line=TradeSession._new_row(game.state,it,"sell");line.status="ready";line.context.price=sale_prices[i];se.lines.append(line)
 se.want_count=8;se.cash=5000
 t.selectedUid=original.uid;t.item=null
 var directory=ProjectSettings.globalize_path("res://../work/strict-reference")
 DirAccess.make_dir_recursive_absolute(directory)
 var f=FileAccess.open(directory+"/fixture.json",FileAccess.WRITE);f.store_string(JSON.stringify(game.state));f.close()
 # Real reducer-created edge states for screenshot review, in isolated saves.
 game.new_game("STRICT-CLOSED");game.state.phase="closed"
 _save_variant(directory,"closed",game.state)
 game.new_game("STRICT-MERCHANT");game.state.cursor=4;game.dispatch({"type":"ARRIVE"})
 _save_variant(directory,"merchant",game.state)
 game.new_game("STRICT-LANDLORD");game.state.day=7;Landlord.ensure(game.state);game.dispatch({"type":"CALL_LANDLORD"})
 _save_variant(directory,"landlord",game.state)
 print("STRICT REFERENCE fixture written")
 quit()
func _save_variant(directory: String,key: String,state: Dictionary):
 var f=FileAccess.open(directory+"/fixture-"+key+".json",FileAccess.WRITE)
 f.store_string(JSON.stringify(state));f.close()
