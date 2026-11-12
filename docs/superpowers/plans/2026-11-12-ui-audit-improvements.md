# UI Audit Improvements Implementation Plan

**Goal:** Improve the counter, management and workbench readability while retaining the painted space-station identity and existing gameplay.
**Architecture:** Adjust existing Godot controls and responsive containers, using current state and navigation. Keep actions and save data unchanged.
**Tech Stack:** Godot 4.6.3, GDScript, native UI regression tests.

1. Add a responsive management overview with distinct actionable status cards; test its content at desktop and phone sizes.
2. Clarify counter workflow and fixture discovery without covering scene art or removing actions; verify counter and phone regressions.
3. Improve inspection, storage, and repair information hierarchy and legibility while preserving their existing behaviors; run workbench regressions.
4. Run the project test suite and inspect the running desktop UI. Record any environment limitations.
