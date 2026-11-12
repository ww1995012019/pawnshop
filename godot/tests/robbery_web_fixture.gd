extends SceneTree
func _initialize() -> void:call_deferred("run")
func run() -> void:
 var s:Dictionary=load("res://tests/robbery_fixture.gd").fence()
 var recovered:Dictionary=load("res://scripts/model/commerce.gd").reduce(s,{"type":"REPORT_LOST_ITEM","tradeId":s.trade.id})
 recovered.robbery.entries[0].revenge={"day":int(recovered.day)+1,"percent":8,"done":false}
 recovered.phase="report";recovered.cash=1
 var closed:=Model.reduce(recovered,{"type":"NEXT"})
 var path:="res://../work/robbery"
 DirAccess.make_dir_recursive_absolute(path)
 var f:=FileAccess.open(path+"/fixtures.json",FileAccess.WRITE)
 f.store_string(JSON.stringify({"fence":s,"closed":closed}));f.close()
 quit()
