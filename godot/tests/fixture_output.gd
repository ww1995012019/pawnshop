extends RefCounted
## Test fixtures must work before ignored output directories exist.
static func write_json(path: String, value: Variant) -> Error:
 var error := DirAccess.make_dir_recursive_absolute(ProjectSettings.globalize_path(path.get_base_dir()))
 if error != OK:
  push_error("Cannot create fixture directory: %s (%s)" % [path.get_base_dir(),error_string(error)])
  return error
 var file := FileAccess.open(path,FileAccess.WRITE)
 if file == null:
  error=FileAccess.get_open_error()
  push_error("Cannot open fixture: %s (%s)" % [path,error_string(error)])
  return error
 file.store_string(JSON.stringify(value))
 file.flush()
 error=file.get_error()
 file.close()
 if error != OK: push_error("Cannot write fixture: %s (%s)" % [path,error_string(error)])
 return error
