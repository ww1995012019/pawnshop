# Debug values editor

Open Settings → 调试系统 · 数值编辑, or press F8 on desktop. Select a source, search by field/path, model ID or name, select a field, then apply explicitly. Opening, searching and selecting do not change game values.

The editor discovers every existing numeric/boolean leaf of the complete save, preferences and all five runtime JSON definition sources. Save schema is protected. Text identifiers, missing fields and compiled rule constants are outside this editor's scope. Definition overrides are local to the current device/browser, persist across restarts and rebuild runtime indexes/caches. Derived values can be recalculated by subsequent gameplay.

The first edit in each panel session creates a persistent pre-edit backup. Writes use staged temporary files and retain previous versions until the batch commits. Restoration checks all save/config/preference writes before changing live values or resetting the backup flag. A handled write failure leaves the prior valid files and live state available.

Validation:

- `npm test`: 107/107 native groups plus asset, packaging, font and loading-layout checks passed before review fixes.
- Final targeted regressions: debug backend, debug UI, wanted UI, watch artwork and mobile density passed; the debug UI and wanted UI were rerun after the last display-refresh fix.
- Backend checks cover nested array/dictionary edits, decimal and boolean values, invalid/nonfinite inputs, protected schema, untouched neighbors, persistence, all independent definition caches, blocked staging, blocked restoration and backup recovery.
- UI checks cover 1440×900, 844×390, 390×844 and 320×568, F8, Settings entry, live values, wanted notice visibility and displayed rewards.
- Native visual inspection confirmed the panel layout and cash search/selection. This environment's browser lacks WebGL2, so game rendering was inspected in native Godot.
