# Debug values system

- Add a searchable, paginated editor for every numeric and boolean leaf in the full game state and in loaded game definitions (including extra residents).
- Include all five runtime JSON sources: core game data, extra residents, new residents, wanted profiles and watch artwork; also expose preference numbers and switches.
- Provide common state shortcuts, exact field paths, explicit apply, input validation, persistent definition overrides and automatic pre-edit backup with restore. Keep schema version protected so saves remain loadable.
- Expose the panel through Settings and F8 on desktop; use the existing responsive modal system on phones.
- Verify nested dictionary/array edits, numeric precision, rejected invalid input, untouched neighboring fields, persisted values, definition reindexing, backup restoration, and desktop/phone modal layouts. Build, commit and publish after validation.
