extends SceneTree
var failures := 0
func _initialize() -> void:
	call_deferred("run")
func check(ok: bool, text: String) -> void:
	print("WATCH EVIDENCE ", "PASS " if ok else "FAIL ", text)
	if not ok: failures += 1
func run() -> void:
	var s := Model.create("EVIDENCE-REFRESH")
	var a := Model.new_item(s, "WCH-008", {"condition":0.6,"watch":{"mass":65.8,"serial":"HG A02 2400 123456","logo_variant":0,"missing_part":"固定部件","part_mass":6.2}})
	Model.put_in(s,a)
	s = Model.reduce(s,{"type":"CHECK","uid":a.uid,"tool":"TOL-005"})
	a = Model.find_inventory(s,a.uid)
	var t := {"id":"refresh","npcId":"CHR-002","kind":"sell","evidenceUsed":["TOL-005"],"selectedUid":a.uid,"locked":false,"rounds":0,"price":1,"item":null}
	Model.disclose_evidence(t,a,"TOL-005")
	var known_old: Dictionary = t.npcKnowledge.duplicate(true)
	var old_reading := Model.displayed_clue(a,"TOL-005")
	s = Model.reduce(s,{"type":"SERVICE_BEGIN","uid":a.uid})
	for step in 6:
		var task := WatchService.current(Model.find_inventory(s,a.uid))
		if task == "": break
		s = Model.reduce(s,{"type":"SERVICE_PROGRESS","uid":a.uid,"task":task,"progress":{"complete":true}})
		s = Model.reduce(s,{"type":"SERVICE_COMPLETE","uid":a.uid,"task":task})
	s = Model.reduce(s,{"type":"SERVICE_FINISH","uid":a.uid})
	a = Model.find_inventory(s,a.uid)
	check(Model.displayed_clue(a,"TOL-005") == old_reading,"repair preserves player pre-retest recorded reading")
	Model.disclose_evidence(t,a,"TOL-005")
	check(t.npcKnowledge == known_old,"redisclosing old record cannot leak repaired mass or wear")
	var ap: float = s.ap
	s = Model.reduce(s,{"type":"CHECK","uid":a.uid,"tool":"TOL-005"})
	a = Model.find_inventory(s,a.uid)
	check(Model.displayed_clue(a,"TOL-005").contains("72.0") and s.ap == ap,"explicit repeat CHECK refreshes snapshot without charging AP")
	check(t.npcKnowledge == known_old,"private reweigh leaves NPC belief unchanged")
	s.trade = t
	var floor_price := int(Model.trade_terms(s,t,a).opening)
	s = Model.reduce(s,{"type":"OFFER","price":floor_price,"evidence":"TOL-005"})
	check(s.trade != null and s.trade.npcKnowledge[a.uid].risk < 0 and is_equal_approx(s.trade.npcKnowledge[a.uid].condition,a.condition),"reused OFFER tool replaces outdated risk and visible wear")
	var updated: Dictionary = s.trade.npcKnowledge.duplicate(true)
	Model.disclose_evidence(s.trade,Model.find_inventory(s,a.uid),"TOL-005")
	check(s.trade.npcKnowledge == updated,"unchanged repeated disclosure never stacks adjustment")
	quit(1 if failures else 0)
