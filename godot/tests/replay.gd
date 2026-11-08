extends SceneTree
## Replays TypeScript reducer traces (tools/trace.mjs) through the GDScript
## port and reports the first divergence per trace.
## godot --headless --path godot --script res://tests/replay.gd

func _init() -> void:
	GameData.ensure()
	var dir := DirAccess.open("res://tests/traces")
	if dir == null:
		print("no traces: run node godot/tools/trace.mjs")
		quit(2)
		return
	var files := Array(dir.get_files()).filter(func(f): return f.ends_with(".json"))
	files.sort()
	var failed := 0
	var steps := 0
	for f in files:
		var data: Dictionary = JSON.parse_string(FileAccess.get_file_as_string("res://tests/traces/" + f))
		var rows: Array = data.rows
		var s := Model.create(data.seed)
		var diff := _diff(s, rows[0].state, "init")
		if diff != "":
			print("%s initial state differs: %s" % [f, diff])
			failed += 1
			continue
		for i in range(1, rows.size()):
			s = Model.reduce(s, rows[i].action)
			steps += 1
			diff = _diff(s, rows[i].state, "")
			if diff != "":
				print("%s step %d %s -> %s" % [f, i, JSON.stringify(rows[i].action), diff])
				failed += 1
				break
	print("replayed %d steps across %d traces, %d diverged" % [steps, files.size(), failed])
	quit(1 if failed else 0)

func _diff(a, b, path: String) -> String:
	if (typeof(a) == TYPE_INT or typeof(a) == TYPE_FLOAT) and (typeof(b) == TYPE_INT or typeof(b) == TYPE_FLOAT):
		return "" if absf(float(a) - float(b)) <= 1e-9 * maxf(1.0, absf(float(b))) else "%s: %s != %s" % [path, a, b]
	if typeof(a) != typeof(b):
		return "%s: type %s != %s (%s vs %s)" % [path, type_string(typeof(a)), type_string(typeof(b)), str(a).left(80), str(b).left(80)]
	if a is Dictionary:
		for k in b:
			if not a.has(k):
				return "%s.%s missing in Godot" % [path, k]
		for k in a:
			if not b.has(k):
				return "%s.%s extra in Godot (%s)" % [path, k, str(a[k]).left(60)]
			var d := _diff(a[k], b[k], "%s.%s" % [path, k])
			if d != "":
				return d
		return ""
	if a is Array:
		if a.size() != b.size():
			return "%s: length %d != %d" % [path, a.size(), b.size()]
		for i in a.size():
			var d := _diff(a[i], b[i], "%s[%d]" % [path, i])
			if d != "":
				return d
		return ""
	return "" if a == b else "%s: %s != %s" % [path, str(a).left(120), str(b).left(120)]
