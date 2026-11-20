extends SceneTree

var failures := 0
var game: Node

func _initialize() -> void:
	call_deferred("run")

func check(passed: bool, label: String) -> void:
	print("STORY90 ", "PASS " if passed else "FAIL ", label)
	if not passed:
		failures += 1

func setup_story() -> void:
	game.new_game("STORY90-ORBITAL", "story90")

func choose(beat: String, option: String, day: int) -> void:
	game.dispatch({"type":"CAMPAIGN_STORY_CHOOSE", "beatId":beat, "choiceId":option, "day":day})

func dossier() -> Dictionary:
	return game.state.get("campaignStory", {})

func decision(beat: String) -> Dictionary:
	return dossier().get("decisions", {}).get(beat, {})

func day_fixture(day: int) -> void:
	game.state.day = day
	game.state.phase = "open"
	game.state.trade = null
	game.state.cursor = 0

func content_is_valid() -> bool:
	var data = JSON.parse_string(FileAccess.get_file_as_string("res://data/campaign_90.json"))
	if not data is Dictionary or data.get("version") != 1 or data.get("beats", []).size() != 11:
		return false
	var seen := {}
	var last := 0
	for beat in data.beats:
		if seen.has(beat.id) or int(beat.firstDay) <= last or int(beat.lastDay) < int(beat.firstDay) or int(beat.lastDay) > 90:
			return false
		if GameData.npc(beat.npcId).is_empty() or String(beat.lines.get("default", "")).is_empty():
			return false
		var choices: Array = beat.choices.map(func(option): return option.id)
		if choices.is_empty() or choices.size() > 3 or Model.uniq(choices).size() != choices.size():
			return false
		seen[beat.id] = true
		last = int(beat.lastDay)
	return true

func run() -> void:
	game = root.get_node("Game")
	setup_story()
	check(content_is_valid(), "the eleven authored windows have ordered dates, known speakers and unique choices")
	game.dispatch({"type":"ARRIVE"})
	var originals: Array = TradeSession.session(game.state).get("goods", [])
	check(originals.map(func(lot): return lot.defId) == ["WCH-001", "WCH-002"],
		"a new story shop opens with the actual stopped watch and one comparison watch")
	if originals.size() < 1:
		quit(1)
		return
	var uid: String = originals[0].uid
	check(dossier().get("opening", {}).get("uid", "") == uid,
		"the dossier follows the exact first visitor original, rather than a model")
	game.dispatch(CounterDialogue.action_for(game.state, "ACCEPT"))
	check(dossier().get("opening", {}).get("receiptId", "") == "",
		"locking the price does not record a purchase")
	var before_ap: float = game.state.ap
	game.dispatch({"type":"CHECK", "uid":uid, "tool":"TOL-002"})
	check(game.state.ap == before_ap - 1 and dossier().get("readings", []).size() == 1,
		"a real UV check records one structured reading at the existing price")
	game.dispatch({"type":"CHECK", "uid":uid, "tool":"TOL-002"})
	check(dossier().get("readings", []).size() == 1 and game.state.ap == before_ap - 1,
		"repeating the same successful reading is financially and narratively idempotent")
	if not bool(game.state.trade.get("locked", false)):
		game.dispatch(CounterDialogue.action_for(game.state, "ACCEPT"))
	game.dispatch(CounterDialogue.action_for(game.state, "DELIVER"))
	var bought: Dictionary = game.state.duplicate(true)
	check(Model.find_inventory(bought, uid) != null and dossier().get("opening", {}).get("receiptId", "") != "",
		"the opening purchase links a real receipt for the transferred original")
	game.dispatch({"type":"REFUSE"})
	game.dispatch({"type":"SETTLE"})
	game.dispatch({"type":"NEXT"})
	var cash: float = game.state.cash
	var ap: float = game.state.ap
	choose("CW-02", "note", 1)
	check(decision("CW-02").is_empty(), "a stale action cannot sign tomorrow's scene")
	choose("CW-02", "note", 2)
	choose("CW-02", "leave", 2)
	check(decision("CW-02").get("choiceId") == "note" and game.state.cash == cash and game.state.ap == ap,
		"a current story action records precisely one choice without consuming cash or AP")
	day_fixture(21)
	game.state.risk = 0
	game.dispatch({"type":"CALL_LANDLORD"})
	var landlord_visit: String = game.state.trade.id
	game.dispatch({"type":"PAY_RENT", "tradeId":landlord_visit})
	game.dispatch({"type":"LANDLORD_LATER", "tradeId":landlord_visit})
	game.dispatch({"type":"SETTLE"})
	var checkpoint: Dictionary = CampaignLife.checkpoint(game.state, 21).get("storySummary", {})
	check(checkpoint.get("custody") == "held" and checkpoint.get("purchaseReceiptId") == dossier().opening.receiptId
		and checkpoint.get("decisions", {}).get("CW-02", {}).get("choiceId") == "note",
		"the day 21 snapshot freezes the actual original and first-act choices")
	game.dispatch({"type":"NEXT"})
	check(game.today_event() == null, "today has no procedural station event to displace the chapter opening")
	var story_path := "res://scripts/model/campaign_story.gd"
	if not ResourceLoader.exists(story_path):
		check(false, "the day 22 scene can route to the purchased original")
		quit(1)
		return
	var story = load(story_path)
	var snapshot: Dictionary = game.state.duplicate(true)
	var scene: Dictionary = story.current(game.state)
	check(scene.get("id") == "CW-22" and scene.get("navigation", []).any(func(route): return route.page == "inspect" and route.uid == uid)
		and game.state == snapshot,
		"day 22 offers the actual watch and merely reading the scene is inert")
	day_fixture(26)
	choose("CW-28", "record_reading", 26)
	var archive: Array = story.history(game.state)
	check(archive.any(func(row): return row.id == "CW-28" and "第 1 天" in row.detail and dossier().readings[0].text in row.detail),
		"the casebook reopens the actual archived reading with its observation date")
	day_fixture(38)
	choose("CW-38", "compare", 38)
	check(decision("CW-38").get("evidenceStatus") == "matched_current",
		"at the comparison window an actual current serial supports a public fact")
	day_fixture(79)
	choose("CW-79", "role_only", 79)
	day_fixture(89)
	choose("CW-89", "public", 89)
	check(decision("CW-89").get("choiceId") == "public", "the matched record can be designated for anonymous publication")
	# A verified change to the actual original before the final decision takes effect.
	var changed = Model.find_inventory(game.state, uid)
	changed.watch.serial = "BC N1 2400 999999"
	game.dispatch({"type":"CHECK", "uid":uid, "tool":"TOL-002"})
	day_fixture(90)
	game.state.risk = 0
	game.dispatch({"type":"SETTLE"})
	var ending: Dictionary = dossier().get("final", {})
	check(game.state.phase == "report" and ending.get("destination") == "shop" and ending.get("choiceId") == "public",
		"a later contradictory observed reading protects the record at settlement without rewriting the original choice")
	check(ending.get("evidenceStatus") == "mismatch" and decision("CW-38").get("evidenceStatus") == "matched_current",
		"the ending reports the conflict separately from the historical match")
	game.state = bought.duplicate(true)
	game.dispatch({"type":"REFUSE"})
	day_fixture(38)
	Model.find_inventory(game.state, uid).watch.serial = "BC N1 2400 999999"
	game.dispatch({"type":"CHECK", "uid":uid, "tool":"TOL-002"})
	choose("CW-38", "compare", 38)
	day_fixture(89)
	Model.find_inventory(game.state, uid).watch.serial = dossier().opening.registrySerial
	game.dispatch({"type":"CHECK", "uid":uid, "tool":"TOL-002"})
	choose("CW-89", "station", 89)
	day_fixture(90)
	game.state.risk = 0
	game.dispatch({"type":"SETTLE"})
	ending = dossier().get("final", {})
	check(ending.get("destination") == "station" and decision("CW-38").get("evidenceStatus") == "mismatch"
		and "复测的编号有出入" not in ending.get("detail", ""),
		"correcting a mismatched serial keeps the historical discrepancy without calling the later reading adverse")

	# An actual resale retains only the prior reading and journal receipt.
	game.state = bought.duplicate(true)
	game.dispatch({"type":"REFUSE"})
	game.dispatch({"type":"ARRIVE"})
	game.dispatch({"type":"SELECT_TRADE", "uid":uid})
	if game.state.trade != null:
		game.dispatch(CounterDialogue.action_for(game.state, "ACCEPT"))
		game.dispatch(CounterDialogue.action_for(game.state, "DELIVER"))
	check(Model.find_inventory(game.state, uid) == null, "the fixture really sold the same original")
	if game.state.trade != null:
		game.dispatch({"type":"REFUSE"})
	day_fixture(22)
	scene = story.current(game.state)
	check(not scene.get("navigation", []).any(func(route): return route.page == "inspect") and "转" in scene.get("line", ""),
		"the sold watch is not reopened on the appraisal bench")
	day_fixture(38)
	choose("CW-38", "compare", 38)
	check(decision("CW-38").get("evidenceStatus") == "matched_historical",
		"a valid recorded serial from before transfer is explicitly historical")
	day_fixture(89)
	choose("CW-89", "public", 89)
	day_fixture(90)
	game.state.risk = 0
	game.dispatch({"type":"SETTLE"})
	ending = dossier().get("final", {})
	check(ending.get("destination") == "public" and "转手" in ending.get("detail", "") and "季棠" not in ending.get("detail", ""),
		"the anonymous public ending retains the watch's actual custody")

	setup_story()
	day_fixture(22)
	scene = story.current(game.state)
	check(scene.get("id") == "CW-22" and scene.get("navigation", []).is_empty() and dossier().get("opening", {}).is_empty(),
		"skipping the first customer still yields a follow-up without a fake original or receipt")
	day_fixture(30)
	var optional_event = game.today_event()
	check(optional_event != null and story.current(game.state).is_empty(), "a quiet date can carry an optional station event")
	day_fixture(20)
	check(not String(game.today_event().description).contains("你帮过"), "the lamp scene does not invent earlier help")
	setup_story()
	game.dispatch({"type":"CHOOSE_EVENT", "eventId":"EVT-001", "choiceId":"EVT-001-repair"})
	day_fixture(20)
	var lights: Dictionary = game.today_event()
	check(lights.id == "EVT-020" and String(lights.description).contains("你帮过") and String(lights.description).contains("交接簿"),
		"the real visiting lamp worker recalls the first paid action and introduces the next chapter")
	day_fixture(89)
	choose("CW-89", "public", 89)
	check(decision("CW-89").is_empty(), "the public option requires a recorded comparison")
	day_fixture(90)
	game.dispatch({"type":"SETTLE"})
	check(dossier().get("final", {}).get("destination") == "shop", "if all story scenes are skipped, the last day still settles with private records")
	setup_story()
	day_fixture(90)
	game.state.risk = 0
	game.dispatch({"type":"SETTLE"})
	check(dossier().get("final", {}).get("npcId") == "", "the fallback ending does not attribute a new quote to a customer the player did not meet")
	setup_story()
	game.dispatch({"type":"ARRIVE"})
	originals = TradeSession.session(game.state).goods
	var opening_uid: String = originals[0].uid
	var contrast_uid: String = originals[1].uid
	game.dispatch({"type":"CHECK", "uid":opening_uid, "tool":"TOL-002"})
	game.dispatch({"type":"CHECK", "uid":contrast_uid, "tool":"TOL-002"})
	game.dispatch({"type":"TRADE_CONFIRM", "tradeId":game.state.trade.id, "uid":contrast_uid})
	game.dispatch({"type":"TRADE_CHECKOUT", "tradeId":game.state.trade.id, "version":TradeSession.summary(game.state).version, "batch":"contrast-only"})
	game.dispatch({"type":"REFUSE"})
	check(Model.find_inventory(game.state, contrast_uid) != null and Model.find_inventory(game.state, opening_uid) == null
		and dossier().opening.receiptId == "" and dossier().readings.size() == 1 and dossier().readings[0].uid == opening_uid,
		"buying the comparison watch does not manufacture custody or evidence for the opening watch")
	day_fixture(38)
	choose("CW-38", "compare", 38)
	check(decision("CW-38").is_empty(), "the declined original follows the bottom-slip path even after a quick look on day one")
	day_fixture(22)
	game.state.nightCrime.days["22"] = {"inspection":true, "inspectionDone":false}
	choose("CW-22", "note", 22)
	check(decision("CW-22").is_empty(), "a queued police visit has priority over any story choice, including stale button calls")
	print("STORY90 failures=", failures)
	quit(1 if failures else 0)
