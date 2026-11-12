extends VBoxContainer
const Debug = preload("res://scripts/app/debug_values.gd")
const PAGE_SIZE := 16
var host
var scope := "state"
var page_index := 0
var selected_path: Array=[]
var all_rows: Array=[]
var list: VBoxContainer
var search: LineEdit
var path_label: Label
var current_label: Label
var value_edit: LineEdit
var bool_edit: CheckButton
var message: Label
var counter: Label
var previous: Button
var following: Button
var source_picker: OptionButton
var apply_button: Button
var applying := false

func setup(shell) -> void:
 host=shell
 Debug.begin_session()
 size_flags_horizontal=Control.SIZE_EXPAND_FILL
 add_theme_constant_override("separation",6)
 var sources := UIKit.hbox(6)
 add_child(sources)
 source_picker=UIKit.option_button()
 source_picker.name="debug_source"
 source_picker.add_item("完整存档状态")
 source_picker.add_item("基础数据配置")
 source_picker.add_item("偏好设置")
 source_picker.size_flags_horizontal=Control.SIZE_EXPAND_FILL
 source_picker.item_selected.connect(func(index):
  scope=["state","data","prefs"][index]
  page_index=0;selected_path=[];search.text="";refresh())
 sources.add_child(source_picker)
 var refresh_key := UIKit.button("刷新","secondary",Vector2(0,36),16)
 refresh_key.pressed.connect(refresh)
 sources.add_child(refresh_key)
 var shortcuts := UIKit.grid(3 if shell.mobile_mode() else 6,4)
 add_child(shortcuts)
 for spec in [["现金","cash"],["行动力","ap"],["天数","day"],["风险","risk"],["关系","relations"],["材料","materials"]]:
  var field: String=spec[1]
  var key := UIKit.button(spec[0],"secondary",Vector2(0,34),15)
  key.size_flags_horizontal=Control.SIZE_EXPAND_FILL
  key.pressed.connect(func():
   scope="state";source_picker.select(0);page_index=0;search.text=field
   refresh()
   if not all_rows.is_empty(): select_field(all_rows[0].path))
  shortcuts.add_child(key)
 search=LineEdit.new()
 search.name="debug_search"
 search.placeholder_text="搜索字段、物品编号或名称，如 cash / 品相 / WCH-001"
 search.custom_minimum_size.y=36
 search.size_flags_horizontal=Control.SIZE_EXPAND_FILL
 search.add_theme_font_size_override("font_size",16)
 search.text_changed.connect(func(_text):page_index=0;selected_path=[];refresh())
 add_child(search)
 var scroll := ScrollContainer.new()
 scroll.name="DebugFieldScroll"
 scroll.custom_minimum_size.y=120 if shell.mobile_mode() else 230
 scroll.horizontal_scroll_mode=ScrollContainer.SCROLL_MODE_DISABLED
 scroll.follow_focus=true
 add_child(scroll)
 list=UIKit.vbox(3)
 list.size_flags_horizontal=Control.SIZE_EXPAND_FILL
 scroll.add_child(list)
 var pages := UIKit.hbox(4)
 add_child(pages)
 previous=UIKit.button("上一页","secondary",Vector2(0,32),14)
 previous.pressed.connect(func():page_index-=1;_render_rows())
 pages.add_child(previous)
 counter=UIKit.label("",14,UIKit.MUTED,false,true)
 counter.size_flags_horizontal=Control.SIZE_EXPAND_FILL
 counter.horizontal_alignment=HORIZONTAL_ALIGNMENT_CENTER
 pages.add_child(counter)
 following=UIKit.button("下一页","secondary",Vector2(0,32),14)
 following.pressed.connect(func():page_index+=1;_render_rows())
 pages.add_child(following)
 path_label=UIKit.label("选择一个字段",14,UIKit.CYAN,false,true)
 path_label.name="debug_field_path"
 add_child(path_label)
 current_label=UIKit.label("",15,UIKit.TEXT,false,true)
 add_child(current_label)
 var edit_row := UIKit.hbox(5)
 add_child(edit_row)
 value_edit=LineEdit.new()
 value_edit.name="debug_value"
 value_edit.custom_minimum_size=Vector2(0,40)
 value_edit.size_flags_horizontal=Control.SIZE_EXPAND_FILL
 value_edit.placeholder_text="输入新数值"
 value_edit.add_theme_font_size_override("font_size",18)
 value_edit.text_submitted.connect(func(_text):apply_selected())
 edit_row.add_child(value_edit)
 bool_edit=CheckButton.new()
 bool_edit.name="debug_boolean"
 bool_edit.text="启用 / true"
 bool_edit.size_flags_horizontal=Control.SIZE_EXPAND_FILL
 edit_row.add_child(bool_edit)
 apply_button = UIKit.button("应用并保存","primary",Vector2(0,40),16)
 apply_button.name="debug_apply"
 apply_button.pressed.connect(apply_selected)
 edit_row.add_child(apply_button)
 message=UIKit.label("首次修改前自动备份；品相通常为 0–1。基础配置会保存在本设备。",14,UIKit.MUTED,false,true)
 message.name="debug_message"
 add_child(message)
 var restore_key := UIKit.button("恢复修改前备份","secondary",Vector2(0,36),15)
 restore_key.name="debug_restore"
 restore_key.pressed.connect(func():host.confirm("恢复调试备份","将恢复首次调试修改前的存档与基础配置。","恢复备份",func():
  var result: Dictionary=Debug.restore()
  message.text=result.message
  refresh()))
 add_child(restore_key)
 refresh()

func refresh() -> void:
 all_rows=Debug.fields(scope,search.text)
 var total := maxi(1,ceili(float(all_rows.size())/PAGE_SIZE))
 page_index=clampi(page_index,0,total-1)
 _render_rows()
 _sync_editor()

func _render_rows() -> void:
 UIKit.clear(list)
 var count := maxi(1,ceili(float(all_rows.size())/PAGE_SIZE))
 page_index=clampi(page_index,0,count-1)
 counter.text="%d / %d 页 · %d 项" % [page_index+1,count,all_rows.size()]
 previous.disabled=page_index==0
 following.disabled=page_index>=count-1
 for row in all_rows.slice(page_index*PAGE_SIZE,(page_index+1)*PAGE_SIZE):
  var path: Array=row.path.duplicate()
  var text: String=row.caption+" = "+str(row.value)
  if row.context.strip_edges()!="":text+=" · "+row.context.strip_edges()
  var key := UIKit.button(text,"primary" if path==selected_path else "secondary",Vector2(0,34),15)
  key.name="debug_field"
  key.size_flags_horizontal=Control.SIZE_EXPAND_FILL
  key.clip_text=true
  key.alignment=HORIZONTAL_ALIGNMENT_LEFT
  key.text_overrun_behavior=TextServer.OVERRUN_TRIM_ELLIPSIS
  key.tooltip_text=row.key+"\n"+row.context
  key.pressed.connect(func():select_field(path))
  list.add_child(key)
 if all_rows.is_empty():list.add_child(UIKit.label("没有匹配的数字或开关。",16,UIKit.MUTED,false,true))

func select_field(path: Array) -> void:
 selected_path=path.duplicate()
 _render_rows()
 _sync_editor()

func _sync_editor() -> void:
 var result: Dictionary=Debug.read(scope,selected_path)
 var valid: bool=result.ok
 path_label.text=({"state":"状态 ","data":"配置 ","prefs":"偏好 "}.get(scope,""))+JSON.stringify(selected_path) if valid else "选择一个字段"
 current_label.text="当前值："+str(result.value) if valid else "可搜索完整存档与基础数据的数字、布尔开关。"
 var is_bool: bool=valid and typeof(result.value)==TYPE_BOOL
 bool_edit.visible=is_bool
 value_edit.visible=not is_bool
 value_edit.editable=valid
 apply_button.disabled=not valid or (scope=="state" and selected_path==["schema"])
 if is_bool:bool_edit.set_pressed_no_signal(result.value)
 elif valid:value_edit.text=Model.jnum(result.value)
 else:value_edit.text=""

func apply_selected() -> void:
 if applying:return
 var found: Dictionary=Debug.read(scope,selected_path)
 if not found.ok:message.text="请先选择一个字段。";return
 applying=true
 var input := str(bool_edit.button_pressed).to_lower() if typeof(found.value)==TYPE_BOOL else value_edit.text
 var result: Dictionary=Debug.apply(scope,selected_path,input)
 message.text=result.message
 message.add_theme_color_override("font_color",UIKit.GOOD if result.ok else UIKit.DANGER)
 if result.ok:refresh()
 applying=false
