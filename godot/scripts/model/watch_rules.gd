class_name WatchRules
extends Object
## Stable physical facts. Tool readings describe evidence, never a diagnosis.

static func model_reference(def_id: String) -> Dictionary:
	return GameData.def(def_id).get("watch", {})

static func _hash(value: String) -> int:
	var result := 2166136261
	for character in value.length():
		result = ((result ^ value.unicode_at(character)) * 16777619) & 0xFFFFFFFF
	return result

static func initialize(it: Dictionary, seed := "") -> void:
	if it.has("watch"):
		return
	var ref := model_reference(it.defId)
	var draw := _hash(seed + "/" + String(it.uid) + "/" + String(it.defId) + "/physical-watch-v1")
	var missing := draw % 7 == 0
	var mass_offset := (float((draw >> 8) % 17) - 8.0) / 10.0
	# Original watches may lack parts; some copies match reference mass exactly.
	if not it.authentic and draw % 3 == 0:
		mass_offset = 0.0
	elif not it.authentic:
		mass_offset += -4.2 if draw % 2 == 0 else 3.6
	var loss := float(ref.get("link_mass", 3.1)) if ref.strap == "金属带" else 6.2
	it.watch = {"mass": snappedf(float(ref.nominal_mass) + mass_offset - (loss if missing else 0.0), 0.1),
		"serial": "%s %s %04d %06d" % [ref.serial_prefix, ref.model, 2400 + (draw % 26), draw % 1000000],
		"logo_variant": 1 if not it.authentic and draw % 4 != 0 else 0,
		"missing_part": ("一节可拆表节" if ref.strap == "金属带" else "内侧固定部件") if missing else "",
		"part_mass": loss if missing else 0.0}
	if not it.authentic and draw % 2 == 1:
		it.watch.serial = "%s X00 %04d %06d" % [ref.serial_prefix, 2400 + draw % 26, draw % 1000000]

static func mass(it: Dictionary) -> float:
	initialize(it)
	return float(it.watch.mass) + WatchForgery.mass_delta(it) + (float(WatchForgery.treatments(it).weight.get("ballast", 0)) if WatchForgery.active(it, "weight") else 0.0)

static func serial(it: Dictionary) -> String:
	initialize(it)
	return String(WatchForgery.treatments(it).serial.serial) if WatchForgery.active(it, "serial") else String(it.watch.serial)

static func logo_variant(it: Dictionary) -> int:
	initialize(it)
	return 0 if WatchForgery.active(it, "logo") else int(it.watch.logo_variant)

static func logo_note(it: Dictionary) -> String:
	var ref := model_reference(WatchForgery.logo_id(it))
	if logo_variant(it) and ref.has("logo_altered"):
		return "可见标识：%s。" % ref.logo_altered
	var altered := ["星标下方短横缺失", "星标下方短横缺失", "星标下方短横缺失", "双浪线中段相连", "双浪线中段相连", "双浪线中段相连", "方框右上角封闭", "月标小点偏到右侧", "方框右上角封闭", "中峰偏低", "中峰偏低且基线偏短", "盾框内中峰偏低", "船锚右侧横臂偏短", "年份末字缺一笔", "船锚右侧横臂偏短"]
	var index := clampi(String(it.defId).get_slice("-", 1).to_int() - 1, 0, 14)
	return "可见标识：%s。" % altered[index] if logo_variant(it) else "可见标识：%s。边缘有使用磨痕。" % ref.logo

static func reading(it: Dictionary, tool: String) -> String:
	var text := ""
	match tool:
		"TOL-001": text = logo_note(it)
		"TOL-002": text = "后盖紫外编号：%s。" % serial(it)
		"TOL-005": text = "稳定质量：%.1f g。按实际表带配置与说明书比较。" % mass(it)
	var trace := WatchForgery.trace(it, tool)
	return text + (" " + trace if trace != "" else "") + (" " + WatchRefurbishment.trace(it) if tool == "TOL-001" else "")

static func restore_parts(it: Dictionary) -> void:
	initialize(it)
	it.watch.mass = snappedf(float(it.watch.mass) + float(it.watch.get("part_mass", 0)), 0.1)
	if WatchForgery.active(it, "weight"):
		it.forgery.methods.weight.removed = true
	it.watch.missing_part = ""
	it.watch.part_mass = 0.0
