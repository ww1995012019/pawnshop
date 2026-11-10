class_name WatchSupply
extends RefCounted
## Roll only when creating a fresh physical watch, never when loading originals.
## Separate hash domains keep model, rarity and authenticity independent.
static func _draw(seed: String, key: String, purpose: String) -> int:
	return (JSON.stringify(["watch-supply-v1",seed,key,purpose]).sha256_buffer()).decode_u32(0)

static func pick(seed: String, key: String, pool: Array = []) -> String:
	GameData.ensure()
	var ordinary := []
	var ultra := []
	for candidate in (GameData.item_list if pool.is_empty() else pool):
		var definition: Dictionary = candidate if candidate is Dictionary else GameData.def(String(candidate))
		if definition.get("tier","")=="ultra": ultra.append(definition.id)
		else: ordinary.append(definition.id)
	var candidates: Array = ultra if not ultra.is_empty() and (_draw(seed,key,"rarity")%10000<50 or ordinary.is_empty()) else ordinary
	return String(candidates[_draw(seed,key,"model")%candidates.size()])

static func authentic(seed: String, key: String) -> bool:
	return _draw(seed,key,"authenticity")%10000 >= 2000
