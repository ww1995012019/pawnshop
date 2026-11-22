extends ShaderMaterial
## Only the painted shop changes shifts. Documents, people and button labels keep their own lighting.

var previous_phase := ""
var previous_day := -1
var transition: Tween

func _init() -> void:
	shader = preload("res://shaders/station_window.gdshader")

func show_shift(view: Control, state: Dictionary, still: bool) -> void:
	var phase: String = state.phase
	var day: int = state.day
	var immediate := still or not view.is_visible_in_tree()
	if day == previous_day and phase == previous_phase and not (immediate and transition and transition.is_running()):
		return
	var dark := 0.0 if phase == "open" else 1.0
	var lamps := Vector2.RIGHT if (day + int(dark)) % 2 == 1 else Vector2.DOWN
	if transition:
		transition.kill()
		transition = null
	if immediate or previous_day == -1:
		set_shader_parameter("after_hours", dark)
		set_shader_parameter("shift_lights", lamps)
	else:
		transition = view.create_tween().set_parallel(true).set_trans(Tween.TRANS_SINE)
		transition.tween_property(self, "shader_parameter/after_hours", dark, 0.5)
		transition.tween_property(self, "shader_parameter/shift_lights", lamps, 0.5)
	previous_phase = phase
	previous_day = day
