extends SceneTree
## Isolated browser saves generated through ordinary reducers and observers.
var game

func _initialize() -> void: call_deferred("run")

func fresh(seed: String) -> Dictionary:
	var s := Model.create(seed)
	s.inventory=[]
	s.ap=100
	s.cash=10000
	s.risk=0
	for id in s.materials: s.materials[id]=50
	game.ensure_shop_state(s)
	return s

func act(s: Dictionary, action: Dictionary) -> Dictionary:
	game.state=s
	game.dispatch(action)
	return game.state

func repair(s: Dictionary, uid: String) -> Dictionary:
	s=act(s,{"type":"SERVICE_BEGIN","uid":uid})
	for step in 12:
		var task := WatchService.current(Model.find_inventory(s,uid))
		if task=="": break
		s=act(s,{"type":"SERVICE_PROGRESS","uid":uid,"task":task,"progress":{"complete":true,"opened":false}})
		s=act(s,{"type":"SERVICE_COMPLETE","uid":uid,"task":task})
	return act(s,{"type":"SERVICE_FINISH","uid":uid})

func run() -> void:
	game=root.get_node("Game")
	var quote := fresh("SECOND-BATCH-QUOTE")
	var contract: Dictionary=ServiceContracts.contracts(quote)[0]
	quote=act(quote,{"type":"TAKE_SERVICE_CONTRACT","id":contract.id})
	var uid: String=ServiceContracts.contracts(quote)[0].uid
	quote=act(quote,{"type":"CHECK","uid":uid,"tool":"TOL-001"})
	var evidence := fresh("SECOND-BATCH-EVIDENCE")
	var original := Model.new_item(evidence,"WCH-001",{"condition":0.7,"owner":"shop","sourceVerified":true})
	Model.put_in(evidence,original)
	for tool in ["TOL-001","TOL-002","TOL-005"]:
		evidence=act(evidence,{"type":"CHECK","uid":original.uid,"tool":tool})
	WatchForgery.apply(Model.find_inventory(evidence,original.uid),"logo")
	assert(Model.estimate(Model.find_inventory(evidence,original.uid)).count==2)
	var ending := fresh("SECOND-BATCH-ENDING")
	ending.day=21
	ending.relations.merchant=100
	ending.relations.salvage=0
	for index in 3:
		var it := Model.new_item(ending,"WCH-001",{"working":false,"authentic":true,"sourceVerified":true})
		Model.put_in(ending,it)
		ending=repair(ending,it.uid)
	ending=act(ending,{"type":"CALL_LANDLORD"})
	ending=act(ending,{"type":"PAY_RENT","tradeId":ending.trade.id})
	ending=act(ending,{"type":"REFUSE"})
	ending=act(ending,{"type":"SETTLE"})
	assert(ending.phase=="report" and ending.outcome=="可信赖维修店")
	assert(ending.report.evaluation.repairsCompleted==3)
	var result := {"quote":quote,"evidence":evidence,"ending":ending}
	var error := preload("res://tests/fixture_output.gd").write_json("res://../work/gameplay-second-batch/fixtures.json",result)
	print("SECOND BATCH FIXTURES ","PASS" if error==OK else "FAIL")
	quit(0 if error==OK else 1)
