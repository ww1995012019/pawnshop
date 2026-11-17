extends SceneTree

var failures := 0

func _initialize() -> void:
	call_deferred("run")

func check(ok: bool, message: String) -> void:
	print("EVIDENCE APPRAISAL ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1

func record_all(it: Dictionary) -> void:
	for tool in ["TOL-001", "TOL-002", "TOL-005"]:
		if not it.evidence.has(tool): it.evidence.append(tool)
		Model.record_inspection(it, tool)

func run() -> void:
	var s := Model.create("EVIDENCE-APPRAISAL")
	var ref := WatchRules.model_reference("WCH-001")
	var it := Model.new_item(s, "WCH-001", {"condition":0.7, "watch":{
		"mass":ref.nominal_mass, "serial":"%s %s 2400 123456" % [ref.serial_prefix, ref.model],
		"logo_variant":0, "missing_part":"", "part_mass":0.0}})
	it.evidence.append("TOL-001")
	Model.record_inspection(it, "TOL-001")
	var one_tool := Model.estimate(it)
	record_all(it)
	var observed := Model.estimate(it)
	check(observed.low == one_tool.low and observed.high == one_tool.high,
		"additional normal serial and weight records need not narrow a normal logo estimate")
	var revision := Model.appraisal_revision(it)
	var hidden := it.duplicate(true)
	hidden.authentic = false
	hidden.working = false
	hidden.watch.missing_part = "unobserved internal part"
	hidden.watch.part_mass = 17.3
	hidden.service.faults = [{"id":"movement_part", "resolved":false}]
	check(Model.appraisal_revision(hidden) == revision, "hidden truth cannot change appraisal freshness")
	check(Model.estimate(hidden) == observed, "equal recorded observations have equal estimates across hidden truth")
	record_all(hidden)
	check(Model.estimate(hidden) == observed, "fresh normal readings cannot reveal hidden fake, stopped or missing parts")
	check(observed.count == 3 and not observed.exact and observed.low < observed.high,
		"three normal tools retain authenticity and function uncertainty")
	check(observed.low <= Model.item_value(hidden) and observed.high >= Model.item_value(it),
		"normal observations retain both low-value and authentic-working possibilities")
	var poisoned := it.duplicate(true)
	for tool in poisoned.inspectionFacts:
		poisoned.inspectionFacts[tool].appraisalValue = 999999999
	check(Model.estimate(poisoned) == observed, "poisoned legacy appraisalValue cannot alter bounds")
	check(Model.estimate(JSON.parse_string(JSON.stringify(poisoned))) == observed,
		"safe observations and ignored legacy prices survive JSON reload")
	var fresh_facts: Dictionary = Model.record_inspection(it, "TOL-001")
	check(not fresh_facts.has("appraisalValue"), "new inspections never store hidden actual value")
	var legacy := it.duplicate(true)
	for tool in legacy.inspectionFacts:
		legacy.inspectionFacts[tool].erase("appraisalObservation")
		legacy.inspectionFacts[tool].appraisalValue = 1
	var legacy_price := Model.estimate(legacy)
	for tool in legacy.inspectionFacts:
		legacy.inspectionFacts[tool].appraisalValue = 999999999
	check(Model.estimate(legacy) == legacy_price and legacy_price.count == 0,
		"legacy prices cannot silently upgrade old readings into current observations")
	s.inventory.append(legacy)
	var ap: float = s.ap
	var old_reading: String = Model.displayed_clue(legacy, "TOL-001")
	check(not old_reading.is_empty(), "legacy recorded readings remain readable")
	s = Model.reduce(s, {"type":"CHECK", "uid":legacy.uid, "tool":"TOL-001"})
	legacy = Model.find_inventory(s, legacy.uid)
	check(s.ap == ap and Model.estimate(legacy).count == 1,
		"legacy inspection recheck refreshes safe observations without AP charge")
	var changed := it.duplicate(true)
	var before_reading: String = Model.displayed_clue(changed, "TOL-005")
	changed.watch.mass += 10.0
	check(Model.appraisal_revision(changed) != revision and Model.estimate(changed).count == 2,
		"changed mass requires explicit recheck while preserving logo and serial observations")
	check(Model.displayed_clue(changed, "TOL-005") == before_reading,
		"physical changes do not rewrite the player's old recorded reading")
	record_all(changed)
	check(Model.estimate(changed).low < observed.low and Model.estimate(changed).high == observed.high,
		"recorded mass mismatch increases uncertainty without diagnosing authenticity or function")
	var repeated := Model.estimate(changed)
	record_all(changed)
	check(Model.estimate(changed) == repeated, "repeating the same evidence cannot mechanically narrow bounds")
	var repaired := it.duplicate(true)
	repaired.condition = 0.95
	check(Model.estimate(repaired).count == 3 and not Model.estimate(repaired).conditionCurrent,
		"changed public wear preserves physical channels and makes only recorded condition stale")
	record_all(repaired)
	check(Model.estimate(repaired).high > observed.high, "newly recorded better wear raises the public catalogue ceiling")
	var no_physical := it.duplicate(true)
	no_physical.erase("watch")
	var old_no_physical := Model.estimate(no_physical)
	var no_physical_revision := Model.appraisal_revision(no_physical)
	no_physical.authentic = false
	no_physical.working = false
	check(Model.estimate(no_physical) == old_no_physical and Model.appraisal_revision(no_physical) == no_physical_revision,
		"legacy items lacking physical observations do not synthesize appraisals from hidden truth")
	check(not no_physical.has("watch"), "estimating a legacy item does not invent physical evidence")
	print("EVIDENCE APPRAISAL failures=", failures)
	quit(1 if failures else 0)
