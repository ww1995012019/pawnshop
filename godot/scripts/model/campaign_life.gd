class_name CampaignLife
extends RefCounted
## Campaign boundaries and saved assessments. NEXT opens the next business day.

const LEGACY21 := "legacy21"
const STORY90 := "story90"
const ENDLESS := "endless"
const SUCCESS_OUTCOMES := ["高风险转运站","稀有收藏行","可信赖维修店","稳健旧货铺"]
const Evaluation = preload("res://scripts/model/campaign_evaluation.gd")

static func mode(s: Dictionary) -> String:
	var saved = s.get("campaignLife")
	if saved is Dictionary:
		var explicit: String = str(saved.get("mode",""))
		if explicit in [LEGACY21,STORY90,ENDLESS]: return explicit
		if saved.get("endless",false): return ENDLESS
	return LEGACY21

static func is_endless(s: Dictionary) -> bool:
	return mode(s) == ENDLESS

static func is_story(s: Dictionary) -> bool:
	return mode(s) == STORY90

static func end_day(s: Dictionary) -> int:
	match mode(s):
		STORY90: return 90
		ENDLESS: return 0
		_: return 21

static func ensure(s: Dictionary) -> void:
	if not s.get("campaignLife") is Dictionary: s.campaignLife = {}
	var saved: Dictionary = s.campaignLife
	if not saved.has("version"): saved.version = 1
	saved.mode = mode(s)
	saved.endless = saved.mode == ENDLESS
	if not saved.get("assessments") is Array: saved.assessments = []
	if not saved.get("checkpoints") is Dictionary: saved.checkpoints = {}
	var first: Variant = _first_assessment(s)
	if first is Dictionary and int(first.get("day",0)) == 21:
		if not saved.checkpoints.has("21"): saved.checkpoints["21"] = first.duplicate(true)
		if saved.assessments.is_empty(): saved.assessments.append(first.duplicate(true))

static func set_mode(s: Dictionary, selected: String) -> void:
	ensure(s)
	if selected not in [LEGACY21,STORY90,ENDLESS]: return
	s.campaignLife.mode = selected
	s.campaignLife.endless = selected == ENDLESS

static func _checkpoints(s: Dictionary) -> Dictionary:
	var saved = s.get("campaignLife")
	return saved.checkpoints if saved is Dictionary and saved.get("checkpoints") is Dictionary else {}

static func checkpoint(s: Dictionary, day: int) -> Dictionary:
	var saved = _checkpoints(s).get(str(day))
	return saved.duplicate(true) if saved is Dictionary else {}

static func _first_assessment(s: Dictionary) -> Variant:
	var saved = s.get("campaignLife")
	if not saved is Dictionary: return null
	var assessments = saved.get("assessments")
	if assessments is Array and not assessments.is_empty() and assessments[0] is Dictionary:
		return assessments[0]
	return _checkpoints(s).get("21")

static func report_is_current(s: Dictionary) -> bool:
	var report = s.get("report")
	var day = s.get("day")
	return (day is int or day is float) and report is Dictionary and report.get("day") == day

static func _failed(s: Dictionary) -> bool:
	return s.has("outcome") and not SUCCESS_OUTCOMES.has(s.outcome)

static func _ready_report(s: Dictionary) -> bool:
	return s.get("phase","") == "report" and s.get("trade") == null and report_is_current(s) and not _failed(s)

static func pending_closed_checkpoint(s: Dictionary) -> bool:
	var day := int(s.get("day",0))
	return is_story(s) and day in [21,90] and _ready_report(s) and s.report.get("closed",false) and not _checkpoints(s).has(str(day))

static func can_advance(s: Dictionary) -> bool:
	var boundary := end_day(s)
	return _ready_report(s) and not pending_closed_checkpoint(s) and (boundary == 0 or (int(s.day) < boundary and not s.has("outcome")))

static func _has_story_final(s: Dictionary) -> bool:
	var saved = _checkpoints(s).get("90")
	return int(s.day) == 90 and saved is Dictionary and saved.get("day") == s.day and saved.get("evaluation") is Dictionary and SUCCESS_OUTCOMES.has(s.get("outcome",""))

static func can_view_ending(s: Dictionary) -> bool:
	if not _ready_report(s) or is_endless(s): return false
	if is_story(s): return _has_story_final(s)
	return int(s.day) >= 21 or SUCCESS_OUTCOMES.has(s.get("outcome",""))

static func continue_problem(s: Dictionary) -> String:
	if is_endless(s): return "持续经营已经开启。"
	var day := int(s.get("day",0))
	var boundary := end_day(s)
	if day < boundary: return "第%d日经营评估后可选择继续。" % boundary
	if s.get("trade") != null: return "请先结束当前来客的接待。"
	if _failed(s): return "本次清算无法继续经营。"
	var phase = s.get("phase","")
	if phase not in ["report","ending"]: return "请先完成当日日结。"
	if is_story(s) and not _has_story_final(s): return "请先完成第90天经营评估。"
	if phase == "ending" and not is_story(s):
		if day != 21 or not SUCCESS_OUTCOMES.has(s.get("outcome","")): return "本次结局无法继续经营。"
		# Some successful day-21 saves retain the result but no report details.
		if s.get("report") == null: return ""
	if not report_is_current(s): return "没有当前营业日的日结记录。"
	return ""

static func start_story_problem(s: Dictionary) -> String:
	if mode(s) != LEGACY21 or int(s.get("day",0)) != 21: return "第21天完成评估的旧档可续接故事。"
	return continue_problem(s)

static func _assessment(s: Dictionary, result: String) -> Dictionary:
	var report = s.get("report")
	var assessment := {"day":int(s.day),"outcome":result,"report":report.duplicate(true) if report is Dictionary else null}
	if report is Dictionary and report.get("evaluation") is Dictionary:
		assessment.evaluation = report.evaluation.duplicate(true)
	return assessment

static func _remember_first(s: Dictionary, assessment: Dictionary) -> void:
	if s.campaignLife.assessments.is_empty(): s.campaignLife.assessments.append(assessment.duplicate(true))
	if assessment.day == 21 and not s.campaignLife.checkpoints.has("21"):
		s.campaignLife.checkpoints["21"] = assessment

static func record_settlement(s: Dictionary) -> void:
	var day := int(s.day)
	var boundary := end_day(s)
	if boundary == 0 or day not in [21,boundary] or s.has("outcome") or not _ready_report(s): return
	ensure(s)
	if s.campaignLife.checkpoints.has(str(day)): return
	s.report.evaluation = Evaluation.summary(s)
	if day == boundary: s.outcome = s.report.evaluation.outcome
	var assessment := _assessment(s,s.report.evaluation.outcome)
	if day == 21: _remember_first(s,assessment)
	else: s.campaignLife.checkpoints[str(day)] = assessment

static func reduce(previous: Dictionary, action: Dictionary) -> Variant:
	var type = action.get("type","")
	if type not in ["CONTINUE_CAMPAIGN","START_STORY_90"]: return null
	var start_story: bool = type == "START_STORY_90"
	var problem := start_story_problem(previous) if start_story else continue_problem(previous)
	if problem != "": return previous
	var s := previous.duplicate(true)
	ensure(s)
	if mode(s) == LEGACY21 and s.campaignLife.assessments.is_empty():
		var result: String = s.get("outcome","")
		if result == "" and s.get("report") is Dictionary and s.report.get("evaluation") is Dictionary:
			result = s.report.evaluation.get("outcome","")
		if result == "": result = Evaluation.outcome(s)
		_remember_first(s,_assessment(s,result))
	set_mode(s,STORY90 if start_story else ENDLESS)
	if start_story: s.campaignStory = {"startDay":22}
	s.erase("outcome")
	s.phase = "report"
	if s.get("report") == null: s.report = {"day":s.day}
	return Model.reduce(s,{"type":"NEXT"})

static func summary(s: Dictionary) -> Dictionary:
	var first: Variant = _first_assessment(s)
	var day := maxi(1,int(s.get("day",1)))
	var week := 1+int((day-1)/7)
	var saved := checkpoint(s,day)
	return {"mode":mode(s),"endless":is_endless(s),"day":day,"endDay":end_day(s),"week":week,"milestone":week*7,
		"checkpoint":saved if not saved.is_empty() else null,
		"firstAssessment":first.duplicate(true) if first is Dictionary else null}
