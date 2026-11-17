extends SceneTree
func _initialize() -> void: call_deferred("run")
func run() -> void:
	var state := Model.create("LANDSCAPE-UI-BROWSER")
	state.day = 22
	state.cash = 10000
	state.inventory = []
	state.storageExpansion = WarehouseExpansion.default_state(5)
	for i in 48:
		var item := Model.new_item(state,["WCH-001","WCH-007","WCH-008","WCH-014"][i%4],{"condition":0.6,"working":false,"sourceVerified":true})
		Model.put_in(state,item)
	NightCrime.ensure(state)
	for day in range(18,23):
		state.nightCrime.mornings.append({"day":day,"night":day-1,"losses":[],"payout":0,"acknowledged":true,"chanceBp":300})
	state.ledger = [{"id":"ui-buy","day":22,"kind":"purchase","label":"收购原表","amount":-180,"cost":180}]
	var destination := ProjectSettings.globalize_path("res://../work/landscape-ui")
	DirAccess.make_dir_recursive_absolute(destination)
	var file := FileAccess.open(destination+"/fixture.json",FileAccess.WRITE)
	file.store_string(JSON.stringify(state))
	file.close()
	quit()
