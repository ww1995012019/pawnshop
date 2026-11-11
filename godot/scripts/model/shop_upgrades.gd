class_name ShopUpgrades
extends RefCounted
## One permanent campaign extension; lamp and shelf remain independent.
const VERSION := 1
const CARDS := [
	{"id":"storage","name":"扩建仓储区","cost":240,"effect":"仓库从6行扩为8行（10列不变）。本轮经营只能选择一项扩建，购买后永久生效，不能更换。"},
	{"id":"workshop","name":"扩建维修工坊","cost":300,"effect":"从下一营业日起，每日行动点从12 AP提高到14 AP。本轮经营只能选择一项扩建，购买后永久生效，不能更换。"},
	{"id":"display","name":"扩建精品展区","cost":280,"effect":"来源已核验的合法自有货物，新顾客购买预算提高8%。本轮经营只能选择一项扩建，购买后永久生效，不能更换。"}]

static func ensure(s: Dictionary) -> void:
	if not s.get("shopUpgrades") is Dictionary: s.shopUpgrades = {"version":VERSION,"extension":""}
	if not s.shopUpgrades.has("version"): s.shopUpgrades.version = VERSION
	if not s.shopUpgrades.has("extension"): s.shopUpgrades.extension = ""

static func _extension(s: Dictionary) -> String:
	return String(s.get("shopUpgrades",{}).get("extension",""))

static func _problem(s: Dictionary, card: Dictionary) -> String:
	if s.get("phase","") == "ending" or s.has("outcome"): return "本轮经营已结束，不能再扩建店铺。"
	if int(s.get("day",1)) < 3: return "店铺扩建从第3天开放。"
	if s.get("trade") != null: return "请先结束当前来客的业务，再安排店铺扩建。"
	if s.get("phase","") != "open" and not (s.get("phase","") == "report" and s.get("report") is Dictionary): return "仅可在营业期间或已结算的日结页安排扩建。"
	if _extension(s) != "": return "本轮已永久选择一项扩建，不能重复购买或更换。"
	if float(s.get("cash",0)) < int(card.cost): return "扩建需要%d Cr，现金不足。" % int(card.cost)
	return ""

static func options(s: Dictionary) -> Array:
	var cards := CARDS.duplicate(true)
	for card in cards:
		card.problem = _problem(s,card)
		card.availability = card.problem == ""
	return cards

static func reduce(previous: Dictionary, action: Dictionary) -> Variant:
	if action.get("type","") != "BUY_SHOP_EXTENSION": return null
	var selected: Dictionary = {}
	for card in CARDS:
		if card.id == action.get("id",""): selected = card
	var s := previous.duplicate(true)
	if selected.is_empty(): return Model.notice(s,"请选择仓储区、维修工坊或精品展区中的一项扩建。")
	var problem := _problem(s,selected)
	if problem != "": return Model.notice(s,problem)
	# The fixed posting identity is an extra guard against a replayed command.
	if not Model.ledger(s,"shop-extension","upgrade",selected.name,-float(selected.cost)):
		return Model.notice(previous.duplicate(true),"本轮店铺扩建已入账，不能重复购买。")
	ensure(s)
	s.shopUpgrades.extension = selected.id
	if s.get("report") is Dictionary: s.report.cash = s.cash
	return Model.notice(s,"%s已完成。%s" % [selected.name,selected.effect])

static func storage_rows(s: Dictionary) -> int:
	return 8 if _extension(s) == "storage" else 6

static func daily_ap(s: Dictionary) -> int:
	return 14 if _extension(s) == "workshop" else 12

static func sale_multiplier(s: Dictionary, it: Dictionary) -> float:
	if _extension(s) != "display": return 1.0
	if it.get("owner","") != "shop" or not it.get("sourceVerified",false) or it.get("sealed",false) or it.get("location","") == "isolation" or it.has("orderId") or it.get("graySale",false): return 1.0
	return 1.08
