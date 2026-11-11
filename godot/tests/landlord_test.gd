extends SceneTree
## Rent must be an explicit, guarded counter transaction, never a silent SETTLE debit.
var failures := 0
const Commerce = preload("res://scripts/model/commerce.gd")
func _initialize() -> void: call_deferred("run")
func check(ok: bool, message: String) -> void:
	print("LANDLORD ", "PASS " if ok else "FAIL ", message)
	if not ok: failures += 1
func fixture(day: int) -> Dictionary:
	var s := Model.create("RENT-COUNTER")
	s.day = day
	s.cash = 2000
	s.inspection = "cleared"
	NightCrime.ensure_day(s)
	s.nightCrime.days[str(day)].inspection = false
	s.nightCrime.days[str(day)].inspectionDone = true
	return s
func rent_entries(s: Dictionary) -> int:
	var count := 0
	for entry in s.ledger:
		if entry.kind == "rent" and int(entry.day) == int(s.day): count += 1
	return count
func run() -> void:
	check(ResourceLoader.exists("res://scripts/model/landlord.gd"), "landlord collection service exists")
	if not ResourceLoader.exists("res://scripts/model/landlord.gd"):
		quit(1)
		return
	var rent = load("res://scripts/model/landlord.gd")
	var s := fixture(7)
	var cash: float = s.cash
	s = Commerce.reduce(s, {"type":"SETTLE"})
	check(s.phase == "open" and s.trade != null and s.trade.kind == "landlord" and s.cash == cash, "settlement invites the landlord without charging")
	var trade_id: String = s.trade.id
	var unchanged := Commerce.reduce(s,{"type":"PAY_RENT","tradeId":"old-visit"})
	check(unchanged.cash == cash and rent_entries(unchanged) == 0, "stale rent controls cannot pay")
	var ap: float = s.ap
	s = Commerce.reduce(s,{"type":"PAY_RENT","tradeId":trade_id})
	check(s.cash == cash-450 and rent_entries(s) == 1 and s.ap == ap and rent.outstanding(s) == 0, "explicit rent payment records one 450 Cr transfer without AP")
	s = Commerce.reduce(s,{"type":"PAY_RENT","tradeId":trade_id})
	check(s.cash == cash-450 and rent_entries(s) == 1, "repeated payment cannot duplicate rent")
	s = JSON.parse_string(JSON.stringify(s))
	s = Commerce.reduce(s,{"type":"REFUSE"})
	var before_settle: float = s.cash
	var costs: float = StoreCosts.quote(s).total
	s = Commerce.reduce(s,{"type":"SETTLE"})
	check(s.phase == "report" and s.cash == before_settle-costs and rent_entries(s) == 1, "day settlement charges operating costs only after rent is paid")
	check(s.report.rent == 450 and s.report.get("settlementRent",-1) == 0, "report distinguishes paid rent from the current settlement payment")
	var poor := fixture(14)
	poor.cash = 1
	poor.ap = 0
	poor = Commerce.reduce(poor,{"type":"CALL_LANDLORD"})
	var poor_id: String = poor.trade.id
	poor = Commerce.reduce(poor,{"type":"PAY_RENT","tradeId":poor_id})
	check(poor.cash == 1 and poor.phase == "open" and rent_entries(poor) == 0, "insufficient cash does not charge or end the game")
	poor = Commerce.reduce(poor,{"type":"LANDLORD_LATER","tradeId":poor_id})
	var cursor: float = poor.cursor
	check(poor.trade == null and rent.outstanding(poor) == 495, "landlord can leave while the player raises funds today")
	poor = Commerce.reduce(poor,{"type":"CALL_LANDLORD"})
	check(poor.trade != null and poor.trade.kind == "landlord", "zero AP and a prior visit do not prevent rent collection")
	poor.cash = 1000
	poor = Commerce.reduce(poor,{"type":"PAY_RENT","tradeId":poor.trade.id})
	poor = Commerce.reduce(poor,{"type":"REFUSE"})
	check(poor.cursor == cursor and poor.cash == 505, "the same landlord returning to collect is not an extra NPC visit")
	var old := fixture(7)
	Model.ledger(old,"rent-day-7","rent","旧档租金",-450)
	old.erase("rent")
	check(rent.outstanding(old) == 0, "an old rent ledger entry is accepted as paid")
	var last := fixture(21)
	last = Commerce.reduce(last,{"type":"SETTLE"})
	check(last.phase == "open" and not last.has("outcome") and last.trade.kind == "landlord", "day21 ending waits for interactive rent")
	last = Commerce.reduce(last,{"type":"PAY_RENT","tradeId":last.trade.id})
	last = Commerce.reduce(last,{"type":"REFUSE"})
	last = Commerce.reduce(last,{"type":"SETTLE"})
	check(last.phase == "report" and last.has("outcome") and rent_entries(last) == 1, "day21 can conclude after paying rent once")
	print("LANDLORD failures=", failures)
	quit(1 if failures else 0)
