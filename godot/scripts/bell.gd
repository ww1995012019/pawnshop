class_name ServiceBell
extends Node2D
## Original painted counter bell, lifted from the scene by the art importer.
## Its resting pose reconstructs the source artwork; no second bell is drawn.

signal rung
const ART = preload("res://assets/scene/service_bell.png")
const ART_RECT := Rect2(-52, -74, 112, 84)
var enabled := true
var motion: Tween

func hit_test(global_point: Vector2) -> bool:
	return ART_RECT.has_point(to_local(global_point))

func strike() -> void:
	if not enabled:
		return
	if motion != null and motion.is_valid():
		motion.kill()
	scale = Vector2.ONE
	rotation = 0.0
	modulate = Color.WHITE
	motion = create_tween()
	if Game.prefs.reduced_motion:
		# Brief color feedback retains the exact resting silhouette.
		modulate = Color(1.15, 1.10, 1.0)
		motion.tween_property(self, "modulate", Color.WHITE, 0.15)
	else:
		motion.tween_property(self, "scale", Vector2(1.025, 0.88), 0.05)
		motion.tween_property(self, "rotation", 0.065, 0.085).set_trans(Tween.TRANS_SINE)
		motion.parallel().tween_property(self, "scale", Vector2.ONE, 0.085)
		motion.tween_property(self, "rotation", -0.042, 0.10).set_trans(Tween.TRANS_SINE)
		motion.tween_property(self, "rotation", 0.023, 0.10).set_trans(Tween.TRANS_SINE)
		motion.tween_property(self, "rotation", -0.010, 0.10).set_trans(Tween.TRANS_SINE)
		motion.tween_property(self, "rotation", 0.0, 0.12).set_trans(Tween.TRANS_SINE)
	rung.emit()

func _draw() -> void:
	draw_texture_rect(ART, ART_RECT, false)
