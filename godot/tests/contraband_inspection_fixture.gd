extends SceneTree
func _initialize() -> void:
	var state := preload("res://tests/contraband_inspection_ui_test.gd").fixture()
	if state.is_empty(): quit(1); return
	state = preload("res://scripts/model/commerce.gd").reduce(state,{"type":"ARRIVE_INSPECTION"})
	var result := preload("res://tests/fixture_output.gd").write_json("res://../work/inspection/browser-fixture.json",state)
	quit(0 if result == OK else 1)
