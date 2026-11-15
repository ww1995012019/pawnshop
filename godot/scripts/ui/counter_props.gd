extends Control
## Physical PC fixtures; visual state never changes cash, AP or item ownership.
var desk
var lamp_on := true
var lamp_shade: Polygon2D
var lamp_glow: Sprite2D
var lamp_key: Button
var lamp_tween: Tween
var drawer_open := false
var drawer_progress := 0.0
var drawer_tween: Tween
var screen_flash: ColorRect
var screen_tween: Tween
var payment_active := false
var drawer_key: Button
var ledger_key: Button

func setup(page) -> void:
 desk=page
 name="CounterSceneProps"
 mouse_filter=Control.MOUSE_FILTER_IGNORE
 set_anchors_and_offsets_preset(Control.PRESET_FULL_RECT)
 lamp_on=bool(Game.prefs.get("shop_lamp",true))
 lamp_glow=Sprite2D.new()
 lamp_glow.texture=Util.radial(256,.45)
 lamp_glow.position=Vector2(1698,332)
 lamp_glow.scale=Vector2(1.5,1.0)
 lamp_glow.modulate=Color(1,.7,.25,.18 if lamp_on else 0.0)
 lamp_glow.material=Util.add_material()
 add_child(lamp_glow)
 lamp_shade=Polygon2D.new()
 lamp_shade.polygon=PackedVector2Array([Vector2(1705,207),Vector2(1748,212),Vector2(1795,280),Vector2(1670,249)])
 lamp_shade.color=Color("2a2630")
 lamp_shade.modulate.a=0.0 if lamp_on else .72
 add_child(lamp_shade)
 lamp_key=UIKit.button("台灯 · 开" if lamp_on else "台灯 · 关","chip",Vector2(108,30),16)
 lamp_key.name="CounterLampSwitch"
 lamp_key.position=Vector2(1693,276)
 lamp_key.tooltip_text="开关工作灯 · 不影响鉴定结果"
 lamp_key.pressed.connect(toggle_lamp)
 add_child(lamp_key)
 screen_flash=ColorRect.new()
 screen_flash.position=Vector2(1486,280)
 screen_flash.size=Vector2(140,90)
 screen_flash.color=Color(.5,1,.75,.0)
 screen_flash.mouse_filter=Control.MOUSE_FILTER_IGNORE
 add_child(screen_flash)
 drawer_key=UIKit.button("钱箱","chip",Vector2(56,24),14)
 drawer_key.name="CounterDrawerToggle"
 drawer_key.position=Vector2(452,116)
 drawer_key.pressed.connect(toggle_drawer)
 desk.cash_tray.get_parent().add_child(drawer_key)
 ledger_key=UIKit.button("流水","chip",Vector2(56,24),14)
 ledger_key.name="CounterLedger"
 ledger_key.position=Vector2(392,116)
 ledger_key.pressed.connect(func():
  if allowed(): desk.shell.open_campaign_ledger())
 desk.cash_tray.get_parent().add_child(ledger_key)

func allowed() -> bool:
 return is_visible_in_tree() and not desk.busy and not desk._scene_blocked()

func toggle_lamp() -> void:
 if not allowed(): return
 lamp_on=not lamp_on
 Game.prefs.shop_lamp=lamp_on
 Game.save_prefs()
 lamp_key.text="台灯 · 开" if lamp_on else "台灯 · 关"
 if is_instance_valid(lamp_tween): lamp_tween.kill()
 var alpha:=0.0 if lamp_on else .72
 var glow:=.18 if lamp_on else 0.0
 if Game.prefs.reduced_motion:
  lamp_shade.modulate.a=alpha;lamp_glow.modulate.a=glow
 else:
  lamp_tween=create_tween().set_parallel(true)
  lamp_tween.tween_property(lamp_shade,"modulate:a",alpha,.22)
  lamp_tween.tween_property(lamp_glow,"modulate:a",glow,.22)
 desk.shell.sound("click",-15)

func toggle_drawer() -> void:
 if not allowed() or payment_active: return
 _set_drawer(not drawer_open)
 desk.shell.sound("page",-12)

func _set_drawer(opened: bool) -> void:
 drawer_open=opened
 if is_instance_valid(drawer_tween): drawer_tween.kill()
 var target:=1.0 if opened else 0.0
 if Game.prefs.reduced_motion: _drawer_frame(target)
 else:
  drawer_tween=create_tween()
  drawer_tween.tween_method(_drawer_frame,drawer_progress,target,.28).set_trans(Tween.TRANS_CUBIC).set_ease(Tween.EASE_OUT)

func _drawer_frame(progress: float) -> void:
 drawer_progress=progress
 desk.cash_tray.drawer_progress=progress
 desk.cash_tray.queue_redraw()

func payment_started() -> void:
 payment_active=true
 _set_drawer(true)

func payment_finished() -> void:
 payment_active=false
 _set_drawer(false)

func activate(key: String) -> void:
 if key not in ["orders","people","report","repair","inspect","warehouse"]: return
 if is_instance_valid(screen_tween): screen_tween.kill()
 screen_flash.color.a=.18
 if Game.prefs.reduced_motion:
  screen_flash.color.a=0.0
 else:
  screen_tween=create_tween()
  screen_tween.tween_property(screen_flash,"color:a",0.0,.32)

func refresh_controls() -> void:
 drawer_key.visible=desk.cash_tray.visible and not desk.shell.mobile_mode()
 ledger_key.visible=drawer_key.visible
