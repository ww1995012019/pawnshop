extends SceneTree
func _initialize():call_deferred("run")
func run():
 var game=root.get_node("Game");game.new_game("WAREHOUSE-BROWSER")
 game.state.day=3;game.state.cash=5000;game.state.inventory=[];game.state.trade=null
 for i in 24:
  var models: Array=["WCH-007","WCH-008","WCH-014","WCH-028","WCH-002","WCH-010"]
  var it:=Model.new_item(game.state,models[i%models.size()],{"condition":1.0,"working":true,"evidence":["TOL-001","TOL-002"]})
  it.watch.missing_part=""
  if i<10:it.location="display";game.state.inventory.append(it)
  else:Model.put_in(game.state,it)
 game.ensure_shop_state(game.state)
 var directory:=ProjectSettings.globalize_path("res://../work/warehouse-expansion")
 DirAccess.make_dir_recursive_absolute(directory)
 var file=FileAccess.open(directory+"/fixture.json",FileAccess.WRITE)
 file.store_string(JSON.stringify(game.state));file.close();quit()
