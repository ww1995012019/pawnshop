extends RefCounted

const INSPECT_CAPTION := "拿起停表看看"

static func first_counter(s: Dictionary) -> bool:
	return s.day == 1 and s.phase == "open" and s.cursor == 0 and s.trade == null

static func inspect_original(s: Dictionary) -> bool:
	if s.day != 1 or not CounterDialogue.active(s):
		return false
	var uid: String = s.trade.get("campaignOpeningUid", "")
	var line := CounterDialogue.current(s)
	if uid.is_empty() or line.get("uid", "") != uid or line.status != "ready" or s.trade.locked or int(s.trade.rounds) > 0:
		return false
	var original = TradeSession.item(s, uid)
	return original != null and Model.evidence_count(original) == 0
