extends FloatingDocument
## Test-only instrument at the cross-runtime boundary, never part of game UI.
var css_reads := 0
func _css_scale() -> float:
 css_reads += 1
 return super._css_scale()
