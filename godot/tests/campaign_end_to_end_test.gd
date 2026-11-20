extends SceneTree
## Play the whole calendar through Game.dispatch. Fixed liquidity isolates
## progression and accounting from the separate player-economy trials.

class CalendarGame extends "res://scripts/app/game.gd":
	func save() -> void:
		pass # Avoid rewriting a browser-sized file for each calendar test action.

func _initialize() -> void:
	call_deferred("run")

func fail(message: String) -> void:
	printerr("CAMPAIGN 90 FAIL ", message)
	quit(1)

func settle(game: CalendarGame) -> bool:
	if NightCrime.inspection_pending(game.state):
		game.dispatch({"type":"ARRIVE_INSPECTION"})
		if not game.state.trade is Dictionary:
			return false
		game.dispatch({"type":"RESOLVE_INSPECTION","tradeId":game.state.trade.id})
	if Landlord.outstanding(game.state) > 0:
		game.dispatch({"type":"CALL_LANDLORD"})
		if not game.state.trade is Dictionary or game.state.trade.kind != "landlord":
			return false
		var visit: String = game.state.trade.id
		game.dispatch({"type":"PAY_RENT","tradeId":visit})
		game.dispatch({"type":"LANDLORD_LATER","tradeId":visit})
	return game.dispatch({"type":"SETTLE"}) and game.state.phase == "report"

func run() -> void:
	var game := CalendarGame.new()
	game.new_game("CALENDAR90-E2E", "story90")
	game.state.cash = 20000
	game.state.risk = 0
	for day in range(1,91):
		if int(game.state.day) != day or game.state.phase != "open":
			game.free()
			fail("day %d did not open" % day)
			return
		if not settle(game):
			var notice: String = game.state.notice
			game.free()
			fail("day %d did not settle: %s" % [day,notice])
			return
		if day == 21 and (game.state.has("outcome") or not game.state.report.has("evaluation")):
			game.free()
			fail("day 21 is a checkpoint instead of a terminal outcome")
			return
		if day < 90:
			game.dispatch({"type":"NEXT"})
	var rent_rows: Array = game.state.ledger.filter(func(row): return row.kind == "rent")
	var rent := 0.0
	for row in rent_rows:
		rent -= row.amount
	var final: Dictionary = game.state.get("campaignStory",{}).get("final",{})
	if rent_rows.size() != 12 or rent != 8747 or game.state.cash != 9813 or final.get("destination") != "shop":
		game.free()
		fail("twelve dated rent receipts, 90 daily costs and the optional-story default must reconcile")
		return
	var snapshot: Dictionary = game.state.report.duplicate(true)
	game.dispatch({"type":"NEXT"})
	if game.state.day != 90 or game.state.phase != "ending":
		game.free()
		fail("ordinary NEXT cannot bypass the final report")
		return
	game.dispatch({"type":"CONTINUE_CAMPAIGN"})
	game.dispatch({"type":"CONTINUE_CAMPAIGN"})
	if game.state.day != 91 or game.state.cash != 9813 or Landlord.outstanding(game.state) != 900 or game.state.campaignStory.final != snapshot.storyFinal:
		game.free()
		fail("explicit continuation opens the next rent day once with the complete saved ending")
		return
	game.free()
	print("CAMPAIGN 90 PASS real actions across 90 settlements, one continuation and twelve rent receipts")
	quit(0)
