extends SceneTree

var failures := 0

func _initialize() -> void:
	call_deferred("run")

func check(ok: bool, message: String) -> void:
	print("INSPECTION CHANNELS ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1

func record_all(it: Dictionary) -> void:
	for tool in ["TOL-001", "TOL-002", "TOL-005"]:
		if not it.evidence.has(tool): it.evidence.append(tool)
		Model.record_inspection(it, tool)

func fixture(s: Dictionary) -> Dictionary:
	var ref := WatchRules.model_reference("WCH-001")
	var it := Model.new_item(s, "WCH-001", {"condition":0.7, "watch":{
		"mass":ref.nominal_mass, "serial":"%s %s 2400 123456" % [ref.serial_prefix, ref.model],
		"logo_variant":0, "missing_part":"", "part_mass":0.0}})
	record_all(it)
	return it

func run() -> void:
	var s := Model.create("INSPECTION-CHANNELS")
	var it := fixture(s)
	var normal := Model.estimate(it)
	check(normal.count == 3 and normal.get("conditionCurrent", false), "three observations include separately current recorded wear")
	for method in ["logo", "serial", "weight"]:
		var changed := it.duplicate(true)
		var tool: String = WatchForgery.TOOLS[method]
		var old: Dictionary = changed.evidenceReadings.duplicate(true)
		WatchForgery.apply(changed, method)
		check(Model.estimate(changed).count == 2, method + " invalidates only its physical channel")
		check(changed.evidenceReadings == old, method + " preserves the old recorded readings")
		s.inventory = [changed]
		var ap: float = s.ap
		s = Model.reduce(s, {"type":"CHECK", "uid":changed.uid, "tool":tool})
		changed = Model.find_inventory(s, changed.uid)
		check(Model.estimate(changed).count == 3 and s.ap == ap, method + " needs one free channel recheck")
		check(Model.estimate(JSON.parse_string(JSON.stringify(changed))) == Model.estimate(changed), method + " independent observations survive reload")
	var wear := it.duplicate(true)
	wear.condition = 0.95
	var stale_wear := Model.estimate(wear)
	check(stale_wear.count == 3 and not stale_wear.get("conditionCurrent", true), "changed wear preserves three channels but invalidates the recorded condition")
	check(stale_wear.high > normal.high and stale_wear.low < normal.low, "unrecorded current wear returns broad bounds")
	for tool in ["TOL-001", "TOL-002", "TOL-005"]:
		var refreshed := wear.duplicate(true)
		s.inventory = [refreshed]
		var ap: float = s.ap
		s = Model.reduce(s, {"type":"CHECK", "uid":refreshed.uid, "tool":tool})
		refreshed = Model.find_inventory(s, refreshed.uid)
		var estimate := Model.estimate(refreshed)
		check(estimate.count == 3 and estimate.get("conditionCurrent", false) and s.ap == ap,
			tool + " alone refreshes wear without charging AP")
		check(estimate.high == ceil(float(GameData.def(refreshed.defId).value) * 0.95), tool + " refresh uses new recorded wear rather than old records from other tools")
	var old_safe := it.duplicate(true)
	for tool in old_safe.inspectionFacts:
		# Exact safe schema from the first batch: aggregate revision, with only
		# the corresponding physical reading and trace inside the observation.
		old_safe.inspectionFacts[tool].erase("appraisalChannelRevision")
		old_safe.inspectionFacts[tool].appraisalObservation.erase("surfaceTrace")
		old_safe.inspectionFacts[tool].appraisalObservation.erase("logoMark")
		old_safe.inspectionFacts[tool].appraisalObservation.erase("appearanceModel")
		old_safe.inspectionFacts[tool].appraisalObservation.erase("strapModel")
		old_safe.inspectionFacts[tool].appraisalObservation.erase("publicModel")
		old_safe.inspectionFacts[tool].appraisalObservation.reading += " unrelated saved reading suffix"
	old_safe.watch.mass += 5.0
	check(Model.estimate(old_safe).count == 2, "safe first-batch facts migrate per physical field independent of unrelated reading suffixes")
	var old_polished := old_safe.duplicate(true)
	old_polished.refurbishment = {"done":["polish"]}
	check(Model.estimate(old_polished).count == 1, "safe first-batch loupe detects newly visible polishing while preserving serial")
	var polished := it.duplicate(true)
	polished.refurbishment = {"done":["polish"]}
	check(Model.estimate(polished).count == 2, "visible refurbishment trace affects loupe only")
	var targeted := it.duplicate(true)
	var targets := WatchForgery.compatible_targets(targeted)
	check(not targets.is_empty(), "logo identity fixture has a compatible public target model")
	if not targets.is_empty():
		var case_changed := it.duplicate(true)
		case_changed.forgery = {"targetId":targets[0], "methods":{}}
		WatchForgery.apply(case_changed, "logo")
		record_all(case_changed)
		var case_before: String = Model.WatchAppraisal.channel_revision(case_changed, "TOL-001")
		WatchForgery.apply(case_changed, "case")
		check(case_changed.inspectionFacts["TOL-001"].appraisalObservation.publicModel == it.defId,
			"case change does not rewrite the model from an earlier actual inspection")
		check(Model.WatchAppraisal.channel_revision(case_changed, "TOL-001") != case_before \
			and Model.estimate(case_changed).count == 1,
			"target case after repaint invalidates visible exterior and mass even when logo trace masks case trace")
		record_all(case_changed)
		check(case_changed.inspectionFacts["TOL-001"].appraisalObservation.publicModel == targets[0] \
			and case_changed.inspectionFacts["TOL-002"].appraisalObservation.publicModel == targets[0] \
			and case_changed.inspectionFacts["TOL-005"].appraisalObservation.publicModel == targets[0],
			"an actual recheck stamps the currently public model for each inspected channel")
		case_changed.inspectionFacts["TOL-001"].erase("appraisalChannelRevision")
		for field in ["appearanceModel", "strapModel", "logoMark", "surfaceTrace"]:
			case_changed.inspectionFacts["TOL-001"].appraisalObservation.erase(field)
		WatchForgery.restore_exterior(case_changed, "case")
		WatchForgery.restore_exterior(case_changed, "strap")
		check(not Model.WatchAppraisal.channel_current(case_changed, "TOL-001"),
			"legacy loupe with unknown exterior cannot certify restoration from a target case")
		targeted.forgery = {"targetId":targets[0], "methods":{}}
		WatchForgery.apply(targeted, "logo")
		Model.record_inspection(targeted, "TOL-001")
		var visible_logo_revision: String = Model.WatchAppraisal.channel_revision(targeted, "TOL-001")
		check(Model.estimate(targeted).count == 3, "targeted glyph can be explicitly recorded")
		var other_targets: Array = targets.slice(1)
		if not other_targets.is_empty():
			targeted.forgery.targetId = other_targets[0]
			targeted.forgery.methods.logo.targetId = other_targets[0]
			check(Model.WatchAppraisal.channel_revision(targeted, "TOL-001") != visible_logo_revision \
				and Model.estimate(targeted).count == 2, "changing the visible target glyph invalidates loupe even with the same variant and trace")
	var independent_wear := wear.duplicate(true)
	Model.record_inspection(independent_wear, "TOL-001")
	WatchForgery.apply(independent_wear, "logo")
	check(Model.estimate(independent_wear).count == 2 and Model.estimate(independent_wear).conditionCurrent,
		"later logo change does not erase separately recorded current wear")
	var legacy := old_safe.duplicate(true)
	for tool in legacy.inspectionFacts:
		legacy.inspectionFacts[tool].erase("appraisalObservation")
		legacy.inspectionFacts[tool].appraisalValue = 999999999
	check(Model.estimate(legacy).count == 0, "earlier hidden-price facts never become safe channel observations")
	var hidden := it.duplicate(true)
	hidden.authentic = not hidden.authentic
	hidden.working = not hidden.working
	hidden.watch.missing_part = "hidden internal fault"
	hidden.watch.part_mass = 19.3
	hidden.service.faults = [{"id":"movement_part", "resolved":false}]
	check(Model.estimate(hidden) == normal, "hidden truth cannot change channel freshness or bounds")
	var changed := it.duplicate(true)
	changed.watch.mass += 8.0
	var reloaded: Dictionary = JSON.parse_string(JSON.stringify(changed))
	check(Model.estimate(reloaded).count == 2 and reloaded.evidenceReadings == it.evidenceReadings,
		"reload preserves stale recorded mass and two unaffected channels")
	var buyer := {"id":"independent-share", "npcId":"CHR-002", "kind":"sell", "evidenceUsed":[]}
	Model.disclose_evidence(buyer, changed, "TOL-005")
	var known: Dictionary = buyer.npcKnowledge.duplicate(true)
	Model.record_inspection(changed, "TOL-005")
	check(buyer.npcKnowledge == known, "private single-channel recheck leaves NPC knowledge unchanged")
	Model.disclose_evidence(buyer, changed, "TOL-005")
	check(buyer.npcKnowledge != known, "NPC learns the refreshed mass only after explicit disclosure")
	known = buyer.npcKnowledge.duplicate(true)
	Model.disclose_evidence(buyer, changed, "TOL-005")
	check(buyer.npcKnowledge == known, "repeating an unchanged disclosure has no additional effect")
	print("INSPECTION CHANNELS failures=", failures)
	quit(1 if failures else 0)
