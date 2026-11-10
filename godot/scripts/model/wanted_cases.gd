class_name WantedCases
extends RefCounted
## Saved police cases, guarded rewards and public dialogue. No UI truth labels.
const OFFICER_ID := "CHR-014"
const DOCUMENT_ID := "DOC-WANTED"
const TOPICS := {"identity":"怎么称呼？", "origin":"从哪里过来？", "goods":"东西是什么来路？", "destination":"接下来去哪里？"}
static var _profiles: Array = []

static func profiles() -> Array:
	if _profiles.is_empty():
		_profiles = JSON.parse_string(FileAccess.get_file_as_string("res://data/wanted_profiles.json"))
	return _profiles

static func profile(id: String) -> Dictionary:
	for entry in profiles():
		if entry.id == id: return entry
	return {}

static func default_state() -> Dictionary:
	return {"issued":false,"wanted":[],"caught":[],"reports":[],"falseReports":0,"revision":0,
		"paper":{"visible":false,"position":[0.08,0.12],"scale":1.0},"lastResult":{}}

static func ensure(s: Dictionary) -> void:
	if not s.has("police") or not s.police is Dictionary: s.police = default_state()
	for key in default_state():
		if not s.police.has(key): s.police[key] = default_state()[key]
	if not s.police.paper is Dictionary: s.police.paper = default_state().paper
	for key in default_state().paper:
		if not s.police.paper.has(key): s.police.paper[key] = default_state().paper[key]
	if not s.has("documents") or not s.documents is Array: s.documents = []

static func case_state(s: Dictionary) -> Dictionary:
	return s.get("police", default_state())

static func has_notice(s: Dictionary) -> bool:
	return bool(case_state(s).issued)

static func officer_slot(s: Dictionary, reserved_slot: int) -> int:
	var day := int(s.day)
	if day < 2 or s.phase != "open": return -1
	var first := 2 + Model.fnv(String(s.seed) + "/first-patrol") % 2
	var draw := Model.fnv("%s/patrol/%d" % [s.seed,day])
	if not has_notice(s):
		if day < first or (day != first and draw % 3 != 0): return -1
	elif draw % 3 != 0:
		return -1
	var slot := 4 + int(draw % 2) if day <= 3 else int(draw % 6)
	if slot == reserved_slot: slot = (slot + 1) % 6
	return slot

static func live_candidates(s: Dictionary) -> Array:
	var result := []
	var caught: Array = case_state(s).caught
	for npc in GameData.new_residents:
		if npc.id == OFFICER_ID: continue
		var arrested := false
		for id in caught:
			if profile(id).get("npcId", "") == npc.id: arrested = true; break
		if not arrested: result.append(npc.id)
	return result

static func visitor_override(s: Dictionary, reserved_slot: int) -> String:
	if int(s.cursor) == officer_slot(s,reserved_slot): return OFFICER_ID
	if not has_notice(s) or int(s.day) < 2: return ""
	var key := "%s/suspect/%d/%d" % [s.seed,int(s.day),int(s.cursor)]
	if Model.fnv(key) % 5 != 0: return ""
	var ids := []
	for id in case_state(s).wanted:
		var p := profile(id)
		if p.get("npcId", "") != "": ids.append(p.npcId)
	return "" if ids.is_empty() else String(ids[Model.fnv(key+"/person") % ids.size()])

static func new_officer_trade(s: Dictionary) -> Dictionary:
	return {"id":Model.next_id(s,"patrol"),"npcId":OFFICER_ID,"kind":"police","item":null,
		"price":0,"rounds":0,"locked":false,"evidenceUsed":[],"talkLog":[],
		"line":"例行巡查。给你留一份带照片的协查名单，认人要看细节，不要只凭一顶帽子。"}

static func _choose(s: Dictionary, excluded: Array, salt: String, mode := "any") -> String:
	var candidates := []
	for p in profiles():
		if excluded.has(p.id) or case_state(s).caught.has(p.id): continue
		if mode == "live" and p.npcId == "": continue
		if mode == "offstage" and p.npcId != "": continue
		candidates.append(p.id)
	if candidates.is_empty(): return ""
	var key := "%s/notice/%d/%s" % [s.seed,int(case_state(s).revision),salt]
	return candidates[Model.fnv(key) % candidates.size()]

static func _issue(s: Dictionary) -> void:
	if s.police.issued: return
	s.police.issued = true
	s.police.wanted = []
	# Include both a visitable lead and an offstage file; remaining entries are random.
	for i in 6:
		var mode := "live" if i == 0 else "offstage" if i == 1 else "any"
		s.police.wanted.append(_choose(s,s.police.wanted,"initial-%d" % i,mode))
	s.documents.append({"uid":DOCUMENT_ID,"kind":"wanted_notice","name":"旧港通缉协查名单","owner":"shop"})
	s.police.revision += 1

static func report_reason(s: Dictionary) -> String:
	if s.phase != "open": return "营业期间才可呼叫警官。"
	if not has_notice(s): return "先向巡警领取带照片的通缉名单。"
	if s.trade == null: return "柜台没有需要核对的来客。"
	if s.trade.kind in ["police","merchant"]: return "巡警和补给商不是这次核对的目标。"
	for report in case_state(s).reports:
		if report.tradeId == s.trade.id: return "这次来访已经核对过。"
	return ""

static func current_case(s: Dictionary) -> Dictionary:
	if s.trade == null: return {}
	for id in case_state(s).wanted:
		var p := profile(id)
		if p.npcId != "" and p.npcId == s.trade.npcId: return p
	return {}

static func dialogue(s: Dictionary, topic: String) -> String:
	var npc := GameData.npc(s.trade.npcId)
	if s.trade.kind == "police":
		return {"identity":"衡岚，旧港巡警。失窃案卷和报警回执都由我核对。", "origin":"刚查过二号栈桥。照片、衣着和口供要交叉看，相似的帽子不是证据。", "goods":"名单是协查线索，不是见人就定罪。认对有报酬，前两次误报提醒，多次误报要处罚。", "destination":"接到报警会回来核对。确认抓获后会收回整份名单；下次巡查再给你一份新的六人名单，已抓获的人不会再列入。"}.get(topic, "有细节不确定，可以多问来客几句。")
	var wanted := current_case(s)
	if not wanted.is_empty():
		match topic:
			"identity": return "大家叫我%s。做%s，平时不爱留全名。" % [wanted.alias,npc.title]
			"origin": return "我从%s过来。那边在交接班，侧门有人开着。你这儿陈列的表不少。" % wanted.lastSeen
			"goods": return "朋友托我带的，回执一时找不到。表没有问题，不用再追问是谁的。"
			"destination": return "刚说去北侧客运站？记错了，我去南边旧船坞，不等北侧那班船。"
	var lines: Dictionary = npc.get("conversations",{})
	if lines.has(topic): return String(lines[topic])
	return {"identity":"我叫%s，做%s。今天顺路来旧货局看看。" % [npc.name,npc.title],"origin":"从生活舱过来，换班的人太多，走到这里才松口气。","goods":"旧表用了一阵子，来路和回执该核对就核对，我不急着催你。","destination":"先去食堂买份热饭，再回自己的舱位。你慢慢看表。"}.get(topic, npc.get("line","今天有什么新鲜事？"))

static func reduce(previous: Dictionary, action: Dictionary):
	var type: String = action.get("type", "")
	if type not in ["ISSUE_WANTED","REPORT_VISITOR","ASK_VISITOR","TOGGLE_NOTICE","MOVE_NOTICE","RESIZE_NOTICE"]: return null
	var s := previous.duplicate(true)
	ensure(s)
	if type == "TOGGLE_NOTICE":
		if not has_notice(s): return previous
		s.police.paper.visible = bool(action.get("visible",not s.police.paper.visible))
		return s
	if type == "RESIZE_NOTICE":
		if not has_notice(s): return previous
		var zoom = action.get("scale",null)
		if not (zoom is int or zoom is float) or not is_finite(float(zoom)): return previous
		s.police.paper.scale = clampf(float(zoom),0.35,1.6)
		return s
	if type == "MOVE_NOTICE":
		if not has_notice(s): return previous
		var point = action.get("position",null)
		if not point is Array or point.size() != 2: return previous
		for value in point:
			if not (value is int or value is float) or not is_finite(float(value)): return previous
		s.police.paper.position = [clampf(float(point[0]),0,1),clampf(float(point[1]),0,1)]
		return s
	if s.phase != "open" or s.trade == null or action.get("tradeId", "") != s.trade.id: return previous
	if type == "ASK_VISITOR":
		var topic: String = action.get("topic", "")
		if not TOPICS.has(topic): return previous
		var answer := dialogue(s,topic)
		if not s.trade.has("talkLog"): s.trade.talkLog = []
		if not s.trade.talkLog.any(func(entry): return entry.topic == topic):
			s.trade.talkLog.append({"topic":topic,"question":TOPICS[topic],"answer":answer})
		s.trade.line = answer
		return s
	if type == "ISSUE_WANTED":
		if s.trade.kind != "police": return previous
		_issue(s)
		s.police.paper.visible = true
		s.trade.line = "这份名单放进你的库存了。随时展开贴在柜台；X只是收起。对照头像，也要听姓名、来路和去向。"
		return Model.notice(s,"已收到六人协查名单，可从库存随时取出、拖动和收起。")
	if type == "REPORT_VISITOR":
		if report_reason(s) != "": return previous
		var trade_id: String = s.trade.id
		var npc_id: String = s.trade.npcId
		var wanted := current_case(s)
		var reward := 0
		var fine := 0
		var text := ""
		if not wanted.is_empty():
			reward = mini(int(wanted.reward),maxi(0,int(1000000000.0 - s.cash)))
			Model.ledger(s,"bounty-"+wanted.id,"bounty","协查抓获 · "+wanted.name,reward)
			s.police.caught.append(wanted.id)
			s.police.issued = false
			s.police.wanted = []
			s.police.paper.visible = false
			s.documents = s.documents.filter(func(doc): return doc.get("uid","") != DOCUMENT_ID)
			s.relations.station = Model.clampn(s.relations.station + 3)
			s.risk = Model.clampn(s.risk - 3)
			text = "衡岚：照片、特征和案卷核对一致，已带走%s。协查报酬%d Cr已入账。这份名单已收回，下次巡查会送来新的六人协查名单。" % [wanted.name,reward]
		else:
			s.police.falseReports += 1
			if int(s.police.falseReports) >= 3:
				fine = mini(int(s.cash),60+20*(int(s.police.falseReports)-3))
				Model.ledger(s,"false-report-"+trade_id,"fine","多次误报处罚",-fine)
			s.relations.station = Model.clampn(s.relations.station - 2)
			s.risk = Model.clampn(s.risk + 3)
			text = "衡岚：核对后不是名单中的人。累计误报%d次，%s。先问清来路，再对照照片；相似衣服不能定罪。" % [int(s.police.falseReports),"本次处罚%d Cr" % fine if int(s.police.falseReports)>=3 else "本次提醒，不扣款"]
		s.police.reports.append({"tradeId":trade_id,"npcId":npc_id,"arrested":not wanted.is_empty(),"reward":reward,"fine":fine})
		s.police.lastResult = {"tradeId":trade_id,"npcId":npc_id,"arrested":not wanted.is_empty(),"text":text,"reward":reward,"fine":fine}
		return Model.finish_trade(s,text)
	return previous
