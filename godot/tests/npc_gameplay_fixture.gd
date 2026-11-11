extends SceneTree
func _initialize() -> void: call_deferred("run")
func run() -> void:
	var s := Model.create("NPC-GAMEPLAY-WEB")
	s.day = 7
	s.cash = 2000
	s.ap = 0
	s.inspection = "cleared"
	NightCrime.ensure_day(s)
	s.nightCrime.days["7"].inspection = false
	s.nightCrime.days["7"].inspectionDone = true
	s.nightCrime.days["7"].fenceDone = true
	s.cursor = VisitSchedule.landlord_slot(s)
	load("res://tests/fixture_output.gd").write_json("res://../work/npc-gameplay/rent-fixture.json",s)
	quit()
