extends RefCounted
## Display decisions affect fresh sale quotes, never an NPC's independent appraisal.
const Extensions = preload("res://scripts/model/shop_upgrades.gd")

static func _display_eligible(it: Dictionary) -> bool:
 return it.get("owner","") == "shop" and it.get("sourceVerified",false) and not it.get("sealed",false) and it.get("location","") == "display" and not it.has("orderId") and not it.get("graySale",false) and not it.get("service",{}).get("opened",false)

static func sale_multiplier(s: Dictionary, it: Dictionary) -> float:
 var multiplier := Extensions.sale_multiplier(s,it)
 if s.get("upgrades",{}).get("shelf",false) and _display_eligible(it): multiplier *= 1.05
 return multiplier

static func listed_ask(it: Dictionary) -> float:
 var ask = it.get("listPrice",0)
 return float(ask) if _display_eligible(it) and Model.valid_price(ask) else 0.0

static func initial_quote(_s: Dictionary, t: Dictionary, it: Dictionary, terms: Dictionary) -> float:
 if t.get("kind","") != "sell": return maxf(float(terms.floor),ceil(float(terms.value)*1.1))
 # Read the economic snapshot, including a zero/absent ask in an old saved
 # snapshot. A live tag can never refresh that visitor's frozen first ask.
 var ask: float = t.get("shopPriceFactors",{}).get(it.uid,{}).get("listedAsk",0.0)
 if t.get("npcId","") != "CHR-010" and Model.valid_price(ask) and ask <= float(terms.ceiling) and ask <= float(terms.marketCap): return ask
 return float(terms.opening)
