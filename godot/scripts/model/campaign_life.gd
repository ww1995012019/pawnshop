class_name CampaignLife
extends RefCounted
## An explicit opt-in after the original campaign assessment. Ordinary NEXT
## remains the single place that opens a day and applies saved night outcomes.

const SUCCESS_OUTCOMES := ["高风险转运站","稀有收藏行","可信赖维修店"]

static func ensure(s: Dictionary) -> void:
	if not s.get("campaignLife") is Dictionary:
		s.campaignLife = {"version":1,"endless":false,"assessments":[]}
	var defaults := {"version":1,"endless":false,"assessments":[]}
	for key in defaults:
		if not s.campaignLife.has(key): s.campaignLife[key] = defaults[key]
	if not s.campaignLife.assessments is Array: s.campaignLife.assessments = []

static func is_endless(s: Dictionary) -> bool:
	return s.get("campaignLife") is Dictionary and bool(s.campaignLife.get("endless",false))

static func continue_problem(s: Dictionary) -> String:
	if is_endless(s): return "持续经营已经开启。"
	if int(s.get("day",0)) < 21: return "第21日经营评估后可选择继续。"
	if s.get("trade") != null: return "请先结束当前来客的接待。"
	if s.has("outcome") and not SUCCESS_OUTCOMES.has(s.outcome): return "本次清算无法继续经营。"
	if s.get("phase","") == "ending":
		return "" if int(s.day) == 21 and SUCCESS_OUTCOMES.has(s.get("outcome","")) else "本次结局无法继续经营。"
	if s.get("phase","") != "report": return "请先完成当日日结。"
	if not s.get("report") is Dictionary or int(s.report.get("day",0)) != int(s.day): return "没有当前营业日的日结记录。"
	return ""

static func _outcome(s: Dictionary) -> String:
	if SUCCESS_OUTCOMES.has(s.get("outcome","")): return s.outcome
	return "高风险转运站" if s.risk >= 60 else ("稀有收藏行" if s.relations.merchant > s.relations.salvage else "可信赖维修店")

static func reduce(previous: Dictionary, action: Dictionary) -> Variant:
	if action.get("type","") != "CONTINUE_CAMPAIGN": return null
	if continue_problem(previous) != "": return previous
	var s := previous.duplicate(true)
	ensure(s)
	if s.campaignLife.assessments.is_empty():
		s.campaignLife.assessments.append({"day":int(s.day),"outcome":_outcome(s),"report":s.report.duplicate(true) if s.get("report") is Dictionary else null})
	s.campaignLife.endless = true
	s.erase("outcome")
	s.phase = "report"
	return Model.reduce(s,{"type":"NEXT"})

static func summary(s: Dictionary) -> Dictionary:
	var assessments: Array = s.get("campaignLife",{}).get("assessments",[])
	var day := maxi(1,int(s.get("day",1)))
	return {"mode":"endless" if is_endless(s) else "campaign","endless":is_endless(s),"day":day,
		"week":1+int((day-1)/7),"milestone":7*(1+int((day-1)/7)),
		"firstAssessment":assessments[0].duplicate(true) if not assessments.is_empty() else null}
