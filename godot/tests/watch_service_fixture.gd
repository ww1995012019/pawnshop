extends SceneTree
## A normal save fixture for browser input tests; no production test command.
func _initialize() -> void: call_deferred("run")
func run() -> void:
	var state := Model.create("SERVICE-BROWSER-25")
	state.inventory = []
	state.trade = null
	state.ap = 100
	state.cash = 10000
	for material in GameData.materials: state.materials[material.id] = 30
	var mechanical := ""
	for def in GameData.item_list:
		if def.watch.movement == "mechanical":
			mechanical = def.id
			break
	var serial := 0
	for spec in [["WCH-001",true,0.6], ["WCH-002",false,0.8], [mechanical,false,0.8], ["WCH-015",false,0.8]]:
		var ref := WatchRules.model_reference(spec[0])
		var it := Model.new_item(state,spec[0],{"condition":spec[2],"working":spec[1],"authentic":false if serial == 3 else true,"sourceVerified":true})
		it.watch.mass = ref.nominal_mass - (6.2 if serial == 3 else 0.0)
		it.watch.missing_part = ""
		it.watch.part_mass = 0.0
		it.watch.logo_variant = 1 if serial == 3 else 0
		it.erase("service")
		WatchService.ensure(it,state.seed)
		Model.put_in(state,it)
		serial += 1
	var out := FileAccess.open("res://../work/watch-repair/browser-fixture.json",FileAccess.WRITE)
	out.store_string(JSON.stringify(state))
	out.close()
	print("BROWSER FIXTURE ",state.inventory.size()," watches")
	quit()
