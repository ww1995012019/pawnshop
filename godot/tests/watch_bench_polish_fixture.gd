extends SceneTree
## Normal isolated save: one real oval watch, ready for ordinary service and forgery UI.
func _initialize() -> void: call_deferred("run")
func run() -> void:
	var state := Model.create("BENCH-OVAL-POLISH")
	state.inventory=[]
	state.trade=null
	state.cash=100000
	state.ap=100
	for material in GameData.materials: state.materials[material.id]=30
	var it := Model.new_item(state,"WCH-075",{"condition":0.95,"working":false,"authentic":false,"sourceVerified":true})
	it.watch.missing_part=""
	it.watch.part_mass=0.0
	it.erase("service")
	WatchService.ensure(it,state.seed)
	Model.put_in(state,it)
	if preload("res://tests/fixture_output.gd").write_json("res://../work/watch-expansion/task-3-fixture.json",state) != OK:
		quit(1);return
	print("BENCH POLISH FIXTURE ",it.uid," ",GameData.def(it.defId).name)
	quit()
