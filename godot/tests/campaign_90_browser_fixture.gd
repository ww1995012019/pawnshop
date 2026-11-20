extends SceneTree
## The opening is a normal new shop. Later UI fixtures replay the intervening
## business days from the actual browser save with a tagged operating float.

const FixtureOutput = preload("res://tests/fixture_output.gd")
const SEED := "ORBITAL-90-UI-012"
const FLOAT_ID := "campaign-90-browser-fixture-float"

func _initialize() -> void:
	call_deferred("run")

func run() -> void:
	var args := OS.get_cmdline_user_args()
	var game = root.get_node("Game")
	if args.size() == 2 and args[0] == "opening":
		game.new_game(SEED,"story90")
	elif args.size() == 4 and args[0] == "advance":
		var saved = JSON.parse_string(FileAccess.get_file_as_string(args[2]))
		var day := int(args[3])
		if not saved is Dictionary or saved.get("schema") != 4 or saved.get("seed") != SEED or saved.get("campaignLife",{}).get("mode") != "story90" or day not in [20,84,90] or int(saved.day) >= day or saved.trade != null:
			fail("Expected an idle campaign browser save before day %d." % day)
			return
		game.state = saved
		Model.ledger(game.state,FLOAT_ID,"fixture-float","浏览器日结测试周转金",12000)
		if not advance(game,day):
			fail("Could not advance fixture to day %d from day %d: %s" % [day,int(game.state.day),game.state.notice])
			return
	else:
		fail("Expected opening <out> or advance <out> <input> <day>.")
		return
	if FixtureOutput.write_json(args[1],game.state) != OK:
		quit(1)
		return
	print("CAMPAIGN BROWSER FIXTURE ",game.state.seed," day=",game.state.day," phase=",game.state.phase)
	quit()

func advance(game, target: int) -> bool:
	while int(game.state.day) < target:
		var day := int(game.state.day)
		if game.state.phase == "open" and not settle(game): return false
		if game.state.phase != "report" or int(game.state.report.day) != day: return false
		game.dispatch({"type":"NEXT"})
		if int(game.state.day) != day + 1: return false
	return game.state.phase == "open" and game.state.trade == null

func settle(game) -> bool:
	if NightCrime.inspection_pending(game.state):
		game.dispatch({"type":"ARRIVE_INSPECTION"})
		if game.state.trade == null: return false
		var trade_id = game.state.trade.id
		game.dispatch({"type":"PREPARE_INSPECTION","tradeId":trade_id})
		game.dispatch({"type":"RESOLVE_INSPECTION","tradeId":trade_id})
	if Landlord.due_now(game.state):
		game.dispatch({"type":"CALL_LANDLORD"})
		if game.state.trade == null or game.state.trade.kind != "landlord": return false
		game.dispatch({"type":"PAY_RENT","tradeId":game.state.trade.id})
		if Landlord.outstanding(game.state) != 0: return false
		game.dispatch({"type":"REFUSE"})
	game.dispatch({"type":"SETTLE"})
	return game.state.phase == "report"

func fail(message: String) -> void:
	push_error(message)
	quit(1)
