extends Object
## Player estimates use public catalogue data and recorded physical observations.
## Normal logo/serial/mass readings cannot prove originality or a working movement.

const TOOLS := ["TOL-001", "TOL-002", "TOL-005"]
const OBSERVATION_SCHEMA := 1

static func _physical_observation(it: Dictionary, tool: String) -> Dictionary:
	var observed := {"schema":OBSERVATION_SCHEMA, "modelId":String(it.defId),
		"condition":snappedf(float(it.condition), 0.000001), "tool":tool}
	# A legacy item without physical data has no invented reading. In particular,
	# do not initialize a physical watch from its hidden authenticity during pricing.
	if not it.has("watch"):
		observed.unknown = true
		return observed
	match tool:
		"TOL-001": observed.logo_variant = WatchRules.logo_variant(it)
		"TOL-002": observed.serial = WatchRules.serial(it)
		"TOL-005": observed.mass = snappedf(WatchRules.mass(it), 0.1)
	observed.reading = WatchRules.reading(it, tool)
	observed.trace = WatchForgery.trace(it, tool)
	return observed

static func revision(it: Dictionary) -> String:
	var signature: Array = [String(it.defId), snappedf(float(it.condition), 0.000001),
		float(GameData.def(it.defId).value)]
	for tool in TOOLS:
		signature.append(_physical_observation(it, tool))
	return JSON.stringify(signature)

static func observation(it: Dictionary, tool: String) -> Dictionary:
	var observed := _physical_observation(it, tool)
	if not observed.get("unknown", false): observed.publicModel = WatchForgery.appearance_id(it)
	if tool == "TOL-001" and not observed.get("unknown", false):
		observed.logoMark = WatchForgery.logo_id(it)
		observed.appearanceModel = WatchForgery.appearance_id(it)
		observed.strapModel = WatchForgery.strap_id(it)
		observed.surfaceTrace = WatchRefurbishment.trace(it)
	return {"appraisalRevision":revision(it), "appraisalChannelRevision":channel_revision(it, tool),
		"appraisalObservation":observed}

## Per-tool freshness never depends on another tool, recorded wear, hidden
## authenticity/function, or catalogue money. The aggregate revision above
## remains available for old saves and callers that need a combined change key.
static func channel_revision(it: Dictionary, tool: String) -> String:
	if not TOOLS.has(tool): return ""
	var observed := _physical_observation(it, tool)
	var signature: Array = [String(it.defId), tool, bool(observed.get("unknown", false))]
	if observed.get("unknown", false): return JSON.stringify(signature)
	match tool:
		"TOL-001": signature.append_array([int(observed.logo_variant), WatchForgery.logo_id(it),
			WatchForgery.appearance_id(it), WatchForgery.strap_id(it), String(observed.trace), WatchRefurbishment.trace(it)])
		"TOL-002": signature.append_array([String(observed.serial), String(observed.trace)])
		"TOL-005": signature.append_array([float(observed.mass), String(observed.trace)])
	return JSON.stringify(signature)

static func _surface_signature(reading: String) -> Array:
	# The first safe schema saved the loupe's surface notes inside its reading.
	# Recover just those physical notes, ignoring any unrelated saved suffix.
	return [reading.contains("替换表壳："), reading.contains("替换表带："),
		reading.contains("表壳可见方向一致的细抛光纹")]

static func channel_current(it: Dictionary, tool: String) -> bool:
	if not TOOLS.has(tool) or not it.get("evidence", []).has(tool) or not it.has("watch"):
		return false
	var facts: Dictionary = it.get("inspectionFacts", {}).get(tool, {})
	var observed: Dictionary = facts.get("appraisalObservation", {})
	if observed.get("schema", 0) != OBSERVATION_SCHEMA or observed.get("unknown", false) \
		or observed.get("modelId", "") != it.defId or observed.get("tool", "") != tool:
		return false
	if facts.has("appraisalChannelRevision") and facts.appraisalChannelRevision != channel_revision(it, tool):
		return false
	# Safe first-batch records had an aggregate fingerprint. Compare their
	# corresponding recorded physical field instead of upgrading old money facts.
	if String(observed.get("trace", "")) != WatchForgery.trace(it, tool): return false
	match tool:
		"TOL-001":
			if not observed.has("logo_variant") or int(observed.logo_variant) != WatchRules.logo_variant(it): return false
			# Earlier safe snapshots did not record the displayed case/strap
			# identity. They cannot certify a later non-original exterior merely
			# because an earlier logo trace masks the case-work trace in text.
			if (not observed.has("appearanceModel") or not observed.has("strapModel")) \
				and WatchForgery.treatments(it).has("case"): return false
			if String(observed.get("appearanceModel", it.defId)) != WatchForgery.appearance_id(it) \
				or String(observed.get("strapModel", it.defId)) != WatchForgery.strap_id(it): return false
			if observed.has("logoMark"):
				if String(observed.logoMark) != WatchForgery.logo_id(it): return false
			elif not String(observed.get("reading", "")).begins_with(WatchRules.logo_note(it)):
				return false
			var surface: String = observed.get("surfaceTrace", observed.get("reading", ""))
			return _surface_signature(surface) == _surface_signature(WatchRefurbishment.trace(it))
		"TOL-002": return observed.has("serial") and String(observed.serial) == WatchRules.serial(it)
		"TOL-005": return observed.has("mass") and is_equal_approx(float(observed.mass), snappedf(WatchRules.mass(it), 0.1))
	return false

static func _mismatch(observed: Dictionary) -> bool:
	if observed.get("unknown", false): return false
	if not String(observed.get("trace", "")).is_empty(): return true
	var ref := WatchRules.model_reference(String(observed.modelId))
	match String(observed.tool):
		"TOL-001": return int(observed.get("logo_variant", 0)) != 0
		"TOL-002":
			return not String(observed.get("serial", "")).begins_with("%s %s " % [ref.serial_prefix, ref.model])
		"TOL-005":
			return absf(float(observed.get("mass", ref.nominal_mass)) - float(ref.nominal_mass)) > float(ref.tolerance)
	return false

static func estimate(it: Dictionary) -> Dictionary:
	var base := float(GameData.def(it.defId).value)
	var low := maxf(1, floor(base * 0.05))
	var high := maxf(low + 1, ceil(base))
	var count := 0
	var condition := 1.0
	var condition_current := false
	var mismatch := false
	for tool in TOOLS:
		var facts: Dictionary = it.get("inspectionFacts", {}).get(tool, {})
		var observed: Dictionary = facts.get("appraisalObservation", {})
		# Wear is its own recorded observation. A later change to that tool's
		# physical mark does not erase the wear the player already inspected.
		if it.get("evidence", []).has(tool) and observed.get("schema", 0) == OBSERVATION_SCHEMA \
			and not observed.get("unknown", false) and observed.get("modelId", "") == it.defId \
			and observed.get("tool", "") == tool and observed.has("condition") \
			and is_equal_approx(float(observed.condition), snappedf(float(it.condition), 0.000001)):
			condition = clampf(float(observed.condition), 0.35, 1.0)
			condition_current = true
		if not channel_current(it, tool):
			continue
		count += 1
		mismatch = mismatch or _mismatch(observed)
	if count > 0 and condition_current:
		# Current recorded wear constrains the catalogue ceiling. Authenticity,
		# function and hidden parts remain unresolved even after all three tools.
		high = maxf(2, ceil(base * condition))
		low = maxf(1, floor(base * condition * (0.05 if mismatch else 0.255)))
		low = minf(low, high - 1)
	return {"low":low, "high":high, "exact":false, "count":count, "conditionCurrent":condition_current}
