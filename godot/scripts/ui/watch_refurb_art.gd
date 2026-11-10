extends "res://scripts/ui/watch_bench_art.gd"
## Independent exterior jobs reuse the same watch, anchored tools and saved phases.
func _initial_state() -> Dictionary:
 var state := super._initial_state()
 state["refurb_progress"] = 0.0
 state.parts["module"] = _arr(CENTER)
 state.parts["case_old"] = _arr(CENTER)
 state.parts["case_new"] = [555.0,272.0]
 state.parts["strap_old"] = _arr(CENTER)
 state.parts["strap_new"] = [555.0,272.0]
 return state

func _build_plan() -> void:
 if not _task.begins_with("refurb_") and _task!="forge_case":
  super._build_plan()
  return
 _plan.clear()
 match _task:
  "refurb_blow":
   for p in [Vector2(204,168),Vector2(297,218),Vector2(235,290)]:
    _action("blow_surface_%d" % _plan.size(),"吹净浮灰 · 区域 %d" % (_plan.size()+1),"气嘴靠近表面，观察浮灰随气流离开；油污和划痕仍会保留", "blower",p,"blow",1.05)
  "refurb_clean":
   for p in [Vector2(211,172),Vector2(290,228),Vector2(229,285)]:
    _action("wipe_surface_%d" % _plan.size(),"擦拭污渍 · 区域 %d" % (_plan.size()+1),"清洁棉沿表面来回擦，不把使用划痕当成污渍", "swab",p,"wash",1.15)
  "refurb_polish":
   for p in [Vector2(178,145),Vector2(354,227),Vector2(218,335)]:
    _action("polish_rim_%d" % _plan.size(),"轻抛壳体 · 区域 %d" % (_plan.size()+1),"只抛壳体边缘，保留表盘标识和后盖编号", "swab",p,"wash",1.1)
  "refurb_case", "forge_case":
   _safe_action()
   _open_actions()
   _transfer("lift_module","取出原机芯与表盘总成","夹持总成外缘，平稳放入右下软垫，不触碰指针", "module",CENTER,Vector2(515,350))
   _transfer("remove_case","卸下旧壳并留存","旧壳移入旧件格，不改变型号或隐藏故障", "case_old",CENTER,Vector2(476,272))
   _transfer("seat_case","安装匹配替换壳","新壳对准表座落稳，原机芯继续使用；目标套件带匹配后盖与完整表带" if _task=="forge_case" else "新壳对准表座落稳，原后盖与机芯继续使用", "case_new",Vector2(555,272),CENTER)
   _transfer("return_module","回装原机芯与表盘","将原总成对准壳内定位，保留原来的走时状态", "module",Vector2(515,350),CENTER)
   if _task=="forge_case":
    _action("install_target_strap","安装目标款完整表带","对准生耳与带端，保留内部机芯故障", "springbar",Vector2(283,345),"lever",1.1)
    var source_cover: String=_profile.caseback
    _profile.caseback=GameData.def(WatchForgery.target_id(_item)).watch.caseback
    _close_actions()
    _profile.caseback=source_cover
   else: _close_actions()
   _action("check_case_fit","检查壳耳与盖缘贴合","复核装配后交工；替换壳接缝会留下可鉴定痕迹", "probe",Vector2(365,227),"settle",1.0)
  "refurb_strap":
   _action("release_upper_bar","释放上侧生耳","生耳批压住肩位，表带与表壳分离", "springbar",Vector2(283,112),"lever",0.9)
   _action("release_lower_bar","释放下侧生耳","保留表壳与机芯，只释放下侧带端", "springbar",Vector2(283,345),"lever",0.9)
   _transfer("remove_strap","收妥旧表带","旧表带移入旧件格，保留更换记录", "strap_old",CENTER,Vector2(476,272))
   _transfer("seat_strap","装入匹配替换表带","带端朝向一致，对准同规格生耳孔", "strap_new",Vector2(555,272),CENTER)
   _action("secure_strap","扣稳生耳并拉力检查","确认两端固定，再记录替换表带的装配痕迹", "springbar",Vector2(283,345),"lever",1.1)

func _transfer_guide(a: Dictionary) -> Dictionary:
 if not _task.begins_with("refurb_") and _task!="forge_case": return super._transfer_guide(a)
 var names := {"module":"原机芯总成","case_old":"旧表壳","case_new":"新表壳","strap_old":"旧表带","strap_new":"新表带"}
 var places := {"lift_module":"右下软垫","remove_case":"旧件格","seat_case":"表座中心","return_module":"新壳定位座","remove_strap":"旧件格","seat_strap":"表带连接位"}
 if names.has(a.get("part","")):
  return {"part":names[a.part],"destination":places.get(a.id,"对应工位")}
 return super._transfer_guide(a)

func _update_visual_effect(a: Dictionary, t: float) -> void:
 super._update_visual_effect(a,t)
 if _task.begins_with("refurb_") or _task=="forge_case": _state.refurb_progress = (float(_state.step)+t)/maxf(1.0,_plan.size())

func _apply_effect(a: Dictionary) -> void:
 super._apply_effect(a)
 if _task.begins_with("refurb_") or _task=="forge_case": _state.refurb_progress = (float(_state.step)+1.0)/maxf(1.0,_plan.size())

func _part_scale(p: Vector2) -> float:
 return lerpf(1.0,0.28,clampf((p.x-CENTER.x)/200.0,0.0,1.0))

func _part_transform(p: Vector2, ratio: float) -> void:
 var rect := stage_working_rect()
 var unit := rect.size.x/SURFACE.x
 draw_set_transform(rect.position+(p-CENTER*ratio)*unit,0,Vector2.ONE*unit*ratio)

func _surface_transform() -> void:
 var rect := stage_working_rect()
 draw_set_transform(rect.position,0,Vector2.ONE*rect.size.x/SURFACE.x)

func _case_at(p: Vector2, fresh: bool) -> void:
 _part_transform(p,_part_scale(p))
 var original: String = _appearance.case_color
 if fresh: _appearance.case_color = "bda064" if _task=="forge_case" else Color(original).lightened(0.13).to_html(false)
 _draw_case()
 _appearance.case_color = original
 _surface_transform()

func _strap_at(p: Vector2, fresh: bool) -> void:
 _part_transform(p,_part_scale(p))
 var original: String = _appearance.strap_color
 if fresh: _appearance.strap_color = Color(original).lightened(0.14).to_html(false)
 _draw_strap()
 _appearance.strap_color = original
 _surface_transform()

func _draw() -> void:
 if not _task.begins_with("refurb_") and _task!="forge_case":
  super._draw()
  return
 if _state.is_empty() or _font == null or size.x <= 0 or size.y <= 0: return
 _surface_transform()
 _draw_mat()
 _draw_tray()
 _draw_holder()
 var done: Array = _item.get("refurbishment",{}).get("done",[])
 if _task == "refurb_strap":
  _strap_at(_v(_state.parts.strap_old),false)
  if replacement_visible("strap_new","MAT-012"): _strap_at(_v(_state.parts.strap_new),true)
 else:
  if _task=="forge_case" and int(_state.step)>=6:
   var previous: String=_appearance.strap
   var target_template := WatchForgery.template(WatchForgery.target_id(_item))
   _appearance.strap=STRAP_TYPES[target_template]
   _strap_at(CENTER,true)
   _appearance.strap=previous
  else: _strap_at(CENTER,done.has("strap"))
 if _task in ["refurb_case", "forge_case"]:
  _case_at(_v(_state.parts.case_old),false)
  if replacement_visible("case_new","MAT-011"): _case_at(_v(_state.parts.case_new),true)
  var p := _v(_state.parts.module)
  _part_transform(p,_part_scale(p))
  _draw_dial()
  _surface_transform()
  if _v(_state.parts.cover).x > 420: _draw_cover(_v(_state.parts.cover))
 else:
  _case_at(CENTER,done.has("case"))
  _draw_dial()
 _draw_finish()
 _draw_rack()
 _draw_contact()
 _draw_tool()
 _draw_labels()
 draw_set_transform(Vector2.ZERO)

func _draw_finish() -> void:
 var progress := clampf(float(_state.refurb_progress),0,1)
 if _task in ["refurb_blow","refurb_clean"]:
  for i in range(85):
   var angle := float(i)*2.39996
   var radius := sqrt(float(i)/85.0)*93.0
   var p := CENTER+Vector2.from_angle(angle)*radius
   var fade := clampf(1.0-progress*1.3-float(i%7)*0.035,0,1)
   if _task == "refurb_blow": p += Vector2(36,-21)*progress*float(i%5+1)
   draw_circle(p,1.1+float(i%3)*0.55,Color(0.61,0.51,0.32,fade*0.85))
 if _task == "refurb_polish":
  for i in range(7):
   var at := CENTER+Vector2.from_angle(-2.5+i*0.58)*114
   draw_line(at+Vector2(-3,-1),at+Vector2(3,1),Color(0.91,0.89,0.73,0.65*(1-progress)),1,true)
  draw_arc(CENTER,115,-2.9,-2.9+progress*1.7,40,Color(0.99,0.95,0.77,progress*0.75),2.2,true)

func _draw_labels() -> void:
 if not _task.begins_with("refurb_") and _task!="forge_case":
  super._draw_labels()
  return
 var job := _task.trim_prefix("refurb_")
 _text(Vector2(29,34),WatchRefurbishment.LABELS.get(job,"独立翻新"),19,INK)
 _text(Vector2(30,49),"独立项目 / 原机芯与真实身份保留",10,MUTED)
 _text(Vector2(469,36),"%02d / %02d" % [mini(int(_state.step)+1,_plan.size()),_plan.size()],18,GOLD,true)
 _text(Vector2(520,52),"已交工" if _state.complete else ("已暂停" if not interaction_allowed else ("待操作" if _state.phase == "idle" else "操作中")),11,CYAN)

func _result_text() -> String:
 if _task.begins_with("refurb_") or _task=="forge_case": return "本项翻新已完成 · 原机芯状态与真伪保留"
 return super._result_text()

func _draw_rack() -> void:
 if _task.begins_with("refurb_") and not _state.is_empty() and _state.complete:
  _panel(Rect2(31,398,578,47),Color("132320"),Color("52665c"),5)
  _text(Vector2(49,426),"本项翻新已完成 · 工具已收妥",14,CYAN)
 else:
  super._draw_rack()
