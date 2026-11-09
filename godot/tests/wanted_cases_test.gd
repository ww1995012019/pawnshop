extends SceneTree
var failures := 0
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	print("WANTED ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func visitor(id: String, npc: String) -> Dictionary:
	return {"id": id, "npcId": npc, "kind": "sell", "item": null, "price": 0, "rounds": 0, "locked": false, "evidenceUsed": [], "line": "来看看。"}
func run() -> void:
	if not FileAccess.file_exists("res://scripts/model/wanted_cases.gd"):
		check(false, "linked police and wanted cases reducer exists")
		quit(1)
		return
	var cases = load("res://scripts/model/wanted_cases.gd")
	GameData.ensure()
	var profiles: Array = JSON.parse_string(FileAccess.get_file_as_string("res://data/wanted_profiles.json"))
	var residents: Array = JSON.parse_string(FileAccess.get_file_as_string("res://data/new_residents.json"))
	check(profiles.size() == 50 and residents.size() == 20, "50 wanted profiles and 20 new residents")
	check(profiles.filter(func(p): return p.npcId == "").size() == 31, "31 profiles belong to people outside the live cast")
	var s := Model.create("WANTED-CASES")
	cases.ensure(s)
	check(not s.police.issued and s.documents.is_empty(), "old or new watch save starts without magically owned notice")
	check(cases.reduce(s,{"type":"ISSUE_WANTED","tradeId":"none"}) == s, "only a present officer can give a notice")
	s.trade = cases.new_officer_trade(s)
	var old_json := JSON.stringify(s)
	var issued: Dictionary = cases.reduce(s,{"type":"ISSUE_WANTED","tradeId":s.trade.id})
	check(JSON.stringify(s) == old_json, "issuing does not mutate prior state")
	check(issued.police.issued and issued.police.wanted.size() == 6 and Model.uniq(issued.police.wanted).size() == 6, "notice has six unique saved people")
	check(issued.documents.size() == 1 and issued.inventory == s.inventory, "paper is inventory document without consuming or corrupting watch slots")
	var again: Dictionary = cases.reduce(issued,{"type":"ISSUE_WANTED","tradeId":issued.trade.id})
	check(again.documents.size() == 1 and again.police.wanted == issued.police.wanted, "repeated issue never duplicates or reshuffles the paper")
	var faces: Array = issued.police.wanted.duplicate()
	issued = cases.reduce(issued,{"type":"TOGGLE_NOTICE","visible":true})
	issued = cases.reduce(issued,{"type":"MOVE_NOTICE","position":[0.32,0.21]})
	issued = cases.reduce(issued,{"type":"TOGGLE_NOTICE","visible":false})
	var loaded: Dictionary = JSON.parse_string(JSON.stringify(issued))
	cases.ensure(loaded)
	check(loaded.police.wanted == faces and is_equal_approx(float(loaded.police.paper.position[0]),.32) and loaded.documents.size() == 1, "reopen and save preserve the same six people and placement")
	var target := ""
	for id in faces:
		if cases.profile(id).npcId != "": target = id; break
	check(target != "", "notice always has at least one possible live visitor")
	if target != "":
		loaded.trade = visitor("arrest-1", cases.profile(target).npcId)
		var before: float = loaded.cash
		var arrested: Dictionary = cases.reduce(loaded,{"type":"REPORT_VISITOR","tradeId":"arrest-1"})
		check(arrested.cash > before and arrested.trade == null and arrested.police.caught.has(target), "correct identification pays bounty and ends the encounter")
		var kept := 0
		for id in faces: if arrested.police.wanted.has(id): kept += 1
		check(kept == 5 and arrested.police.wanted.size() == 6 and not arrested.police.wanted.has(target), "arrest replaces exactly one entry and keeps the other five")
		var repeated: Dictionary = cases.reduce(arrested,{"type":"REPORT_VISITOR","tradeId":"arrest-1"})
		check(repeated.cash == arrested.cash and repeated.police.wanted == arrested.police.wanted, "retry cannot pay twice or replace another entry")
		loaded = arrested
	for i in 4:
		loaded.trade = visitor("false-%d" % i,"CHR-004")
		var before_cash: float = loaded.cash
		var old_faces: Array = loaded.police.wanted.duplicate()
		loaded = cases.reduce(loaded,{"type":"REPORT_VISITOR","tradeId":loaded.trade.id})
		check(loaded.cash == before_cash if i < 2 else loaded.cash < before_cash, "false report %d warning/penalty threshold" % (i+1))
		check(loaded.police.wanted == old_faces, "false report never changes the wanted list")
	loaded.cash = 5
	loaded.trade = visitor("false-poor","CHR-004")
	loaded = cases.reduce(loaded,{"type":"REPORT_VISITOR","tradeId":loaded.trade.id})
	check(loaded.cash == 0, "fine never makes cash negative")
	loaded.trade = visitor("talk-1","CHR-015")
	var ap: float = loaded.ap
	var money: float = loaded.cash
	var talked: Dictionary = cases.reduce(loaded,{"type":"ASK_VISITOR","tradeId":"talk-1","topic":"origin"})
	check(talked.trade.get("talkLog",[]).size() == 1 and talked.ap == ap and talked.cash == money, "conversation adds inspectable clues without charges")
	var full:=Model.create("FULL-WAREHOUSE")
	cases.ensure(full)
	for i in 40:
		var item:=Model.new_item(full,"WCH-001")
		if not Model.put_in(full,item):break
	var full_count:int=full.inventory.size()
	full.trade=cases.new_officer_trade(full)
	full=cases.reduce(full,{"type":"ISSUE_WANTED","tradeId":full.trade.id})
	check(full.documents.size()==1 and full.inventory.size()==full_count,"full watch storage can receive a separate inventory document")
	var commerce=load("res://scripts/model/commerce.gd")
	var exhausted:=Model.create("NO-AP-PATROL")
	exhausted.day=2+Model.fnv(exhausted.seed+"/first-patrol")%2
	exhausted.ap=0
	exhausted.cursor=cases.officer_slot(exhausted,commerce.merchant_slot(exhausted))
	exhausted=commerce.reduce(exhausted,{"type":"ARRIVE"})
	check(exhausted.trade!=null and exhausted.trade.kind=="police","zero AP does not block the free patrol visit")
	var officer_slots := {}
	var seen_live := {}
	for n in 50:
		var state := Model.create("PATROL-%d" % n)
		cases.ensure(state)
		state.day = 2 + Model.fnv(state.seed + "/first-patrol") % 2
		var slot: int = cases.officer_slot(state,4)
		officer_slots[slot] = true
		check(slot != 4 and slot >= 0 and slot < 6, "police reservation never replaces merchant")
		state.police = issued.police.duplicate(true)
		state.day = 5
		for cursor in 6:
			state.cursor = cursor
			var id: String = cases.visitor_override(state,-1)
			if id != "" and id != cases.OFFICER_ID: seen_live[id] = true
	check(not seen_live.is_empty(), "wanted people really appear among random customers")
	print("WANTED failures=",failures)
	for player in root.find_children("*","AudioStreamPlayer",true,false):
		player.stop(); player.stream=null
	await process_frame
	quit(1 if failures else 0)
