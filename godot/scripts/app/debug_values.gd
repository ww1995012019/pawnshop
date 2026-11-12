extends RefCounted
## Numeric/boolean edits only. Paths carry real dictionary keys and array indices.
const DATA_PATH := "user://orbital-debug-data.json"
const BACKUP_PATH := "user://orbital-debug-backup.json"
static var backed_up := false
const LABELS := {"cash":"现金","ap":"行动力 AP","day":"天数","risk":"风险／关注","relations":"关系","materials":"材料库存","inventory":"库存原物","trade":"当前交易","condition":"品相","value":"基础价值","price":"价格","cost":"成本","listPrice":"挂牌价","working":"功能正常","authentic":"真品","sourceVerified":"来源核验","reward":"报酬","minCondition":"最低品相","nextId":"下个物品编号","cursor":"今日已接待","tutorial":"教学进度","content":"基础配置","itemDefs":"物品定义","orderDefs":"订单定义","recipes":"配方","tools":"检验工具","npcs":"顾客","extra_npcs":"扩展顾客","new_residents":"新居民","station":"站务","salvage":"拾荒","merchant":"商会"}

static func begin_session() -> void:
 backed_up=false

static func snapshot(scope: String) -> Dictionary:
 if scope=="state": return Game.state
 if scope=="prefs": return Game.prefs
 if scope!="data": return {}
 var data := GameData.debug_snapshot()
 data["wanted_profiles"]=WantedCases.profiles().duplicate(true)
 WatchLogo.art("WCH-001")
 data["watch_art"]=WatchLogo._art.duplicate(true)
 return data

static func _apply_data(data: Dictionary) -> void:
 GameData.apply_debug_data(data)
 if data.get("wanted_profiles") is Array: WantedCases._profiles=data.wanted_profiles.duplicate(true)
 if data.get("watch_art") is Dictionary: WatchLogo._art=data.watch_art.duplicate(true)

static func fields(scope: String, query := "") -> Array:
 var rows: Array=[]
 _walk(snapshot(scope),[],rows,0)
 var term := query.strip_edges().to_lower()
 if term=="": return rows
 return rows.filter(func(row):return (row.caption+" "+row.key+" "+row.context+" "+str(row.value)).to_lower().contains(term))

static func _walk(value, path: Array, rows: Array, depth: int, context := "") -> void:
 if depth>64: return
 if typeof(value) in [TYPE_INT,TYPE_FLOAT,TYPE_BOOL]:
  var parts: Array[String]=[]
  for part in path:
   var label: String="[%d]" % int(part) if part is int else LABELS.get(String(part),String(part))
   if part is String and part.begins_with("MAT-"):
    label += " "+String(GameData.material(part).get("name",""))
   parts.append(label)
  rows.append({"path":path.duplicate(),"key":JSON.stringify(path),"caption":" / ".join(parts),"context":context,"value":value})
 elif value is Dictionary:
  var keys: Array=value.keys();keys.sort_custom(func(a,b):return str(a)<str(b))
  var detail: String=context
  if value.has("id") or value.has("uid") or value.has("name"):
   detail += " " + str(value.get("id",value.get("uid",""))) + " " + str(value.get("name",""))
  if value.has("defId") and GameData.items.has(value.defId):
   detail += " "+String(value.defId)+" "+String(GameData.def(value.defId).get("name",""))
  for key in keys: _walk(value[key],path+[key],rows,depth+1,detail)
 elif value is Array:
  for i in value.size(): _walk(value[i],path+[i],rows,depth+1,context)

static func _resolve(root: Dictionary, path: Array) -> Dictionary:
 if path.is_empty(): return {"ok":false}
 var node: Variant=root
 for part in path:
  if node is Dictionary and node.has(part): node=node[part]
  elif node is Array and part is int and part>=0 and part<node.size(): node=node[part]
  else: return {"ok":false}
 return {"ok":true,"value":node}

static func read(scope: String, path: Array) -> Dictionary:
 return _resolve(snapshot(scope),path)

static func _cleanup(staged: Array) -> void:
 for entry in staged:
  if FileAccess.file_exists(entry.temp): DirAccess.remove_absolute(entry.temp)
  if not entry.get("keep_previous",false) and FileAccess.file_exists(entry.previous): DirAccess.remove_absolute(entry.previous)

## Stage every destination before replacing any file. Keep the prior files until
## the whole batch commits, so failed restores can roll back partial replacements.
static func _write_many(values: Dictionary) -> bool:
 var staged: Array=[]
 for path in values:
  var target := ProjectSettings.globalize_path(path)
  var entry := {"target":target,"temp":target+".debug-tmp","previous":target+".debug-previous","existed":FileAccess.file_exists(target),"committed":false}
  staged.append(entry)
  if DirAccess.dir_exists_absolute(target) or DirAccess.dir_exists_absolute(entry.temp) or DirAccess.dir_exists_absolute(entry.previous):
   _cleanup(staged);return false
  if entry.existed and DirAccess.copy_absolute(target,entry.previous)!=OK:
   _cleanup(staged);return false
  var file=FileAccess.open(entry.temp,FileAccess.WRITE)
  if file==null: _cleanup(staged);return false
  file.store_string(JSON.stringify(values[path]))
  file.flush()
  var ok := file.get_error()==OK
  file.close()
  if not ok: _cleanup(staged);return false
 for entry in staged:
  if DirAccess.rename_absolute(entry.temp,entry.target)!=OK:
   for done in staged:
    if not done.committed: continue
    var error := DirAccess.rename_absolute(done.previous,done.target) if done.existed else DirAccess.remove_absolute(done.target)
    if error!=OK:
     done.keep_previous=true
     push_warning("调试写入回滚失败，已保留 .debug-previous 与调试备份。")
   _cleanup(staged);return false
  entry.committed=true
 _cleanup(staged)
 return true

static func _write(path: String, data: Dictionary) -> bool:
 return _write_many({path:data})

static func _backup() -> bool:
 if backed_up: return true
 if not _write(BACKUP_PATH,{"state":Game.state.duplicate(true),"data":snapshot("data"),"prefs":Game.prefs.duplicate(true),"time":Time.get_datetime_string_from_system()}): return false
 backed_up=true
 return true

static func apply(scope: String, path: Array, text: String) -> Dictionary:
 if scope not in ["state","data","prefs"]: return {"ok":false,"message":"未知数据分类。"}
 if scope=="state" and path==["schema"]: return {"ok":false,"message":"存档格式版本不可改，避免存档无法加载。"}
 var found := read(scope,path)
 if not found.ok: return {"ok":false,"message":"字段不存在，请刷新列表。"}
 var value: Variant
 var input := text.strip_edges()
 if typeof(found.value)==TYPE_BOOL:
  if input.to_lower() not in ["true","false","1","0"]: return {"ok":false,"message":"开关只接受 true / false 或 1 / 0。"}
  value=input.to_lower() in ["true","1"]
 elif typeof(found.value) in [TYPE_INT,TYPE_FLOAT]:
  if not input.is_valid_float(): return {"ok":false,"message":"请输入有效数字，可使用小数或科学计数法。"}
  var number := input.to_float()
  if not is_finite(number) or absf(number)>9007199254740991.0: return {"ok":false,"message":"数值必须有限且在安全整数范围以内。"}
  value=int(number) if number==floor(number) else number
 else: return {"ok":false,"message":"此面板仅修改数字与布尔开关。"}
 var next := snapshot(scope).duplicate(true)
 var target: Variant=next
 for part in path.slice(0,path.size()-1): target=target[part]
 target[path[-1]]=value
 if not _backup(): return {"ok":false,"message":"备份写入失败，未执行修改。"}
 var previous: Dictionary=Game.state.duplicate(true)
 var path_to_save: String={"state":Game.SAVE_PATH,"data":DATA_PATH,"prefs":Game.PREFS_PATH}[scope]
 if not _write(path_to_save,next): return {"ok":false,"message":"保存失败，未执行修改。"}
 if scope=="data": _apply_data(next)
 if scope=="state":
  Game.state=next
  Game.has_save=true
 if scope=="prefs":
  Game.prefs=next
  Game.prefs_changed.emit()
 Game.changed.emit(previous,Game.state,{"type":"DEBUG_EDIT","scope":scope})
 return {"ok":true,"message":"已应用并保存。派生数值可能在下一次游戏计算时更新。"}

static func load_overrides() -> void:
 if not FileAccess.file_exists(DATA_PATH): return
 var data=JSON.parse_string(FileAccess.get_file_as_string(DATA_PATH))
 if data is Dictionary and data.get("content") is Dictionary and data.get("extra_npcs") is Array and data.get("new_residents") is Array:
  if data.content.has_all(["itemDefs","tools","materials","npcs","recipes","orderDefs","orderEarliest","stationEvents","contentClues","functionFaults","itemArt"]): _apply_data(data)

static func restore() -> Dictionary:
 if not FileAccess.file_exists(BACKUP_PATH): return {"ok":false,"message":"还没有调试备份。首次修改时会自动建立。"}
 var backup=JSON.parse_string(FileAccess.get_file_as_string(BACKUP_PATH))
 if not backup is Dictionary or not backup.get("state") is Dictionary or backup.state.get("schema")!=4 or not backup.get("data") is Dictionary: return {"ok":false,"message":"备份无法读取。"}
 var writes := {DATA_PATH:backup.data,Game.SAVE_PATH:backup.state}
 if backup.get("prefs") is Dictionary: writes[Game.PREFS_PATH]=backup.prefs
 if not _write_many(writes): return {"ok":false,"message":"恢复保存失败，未执行恢复；原调试备份仍保留。"}
 var previous: Dictionary=Game.state.duplicate(true)
 _apply_data(backup.data)
 if backup.get("prefs") is Dictionary:
  Game.prefs=backup.prefs.duplicate(true)
  Game.prefs_changed.emit()
 Game.state=backup.state.duplicate(true)
 Game.has_save=true
 Game.changed.emit(previous,Game.state,{"type":"DEBUG_RESTORE"})
 backed_up=false
 return {"ok":true,"message":"已恢复到本次调试修改前的备份。"}
