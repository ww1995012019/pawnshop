# Interactive PC counter implementation plan

> Execute inline using superpowers:executing-plans.

Goal: Make real watches directly selectable on the PC counter and cabinet, with animated doors, lifting, return, and direct access to existing inspection tools and trading.
Architecture: Preserve canonical inventory and existing trade reducers. A persisted preview UID records the temporarily lifted original without changing ownership/location. A PC-only showroom controller renders trays, cabinet glass and a selected-original inspector, delegates all economics to existing actions, and suspends during trading/workspaces.
Tech stack: Godot 4.6 GDScript, existing art and native test runner.
Spec: User approved the visible cabinet/counter concept and interactive flow in chat, then explicitly requested implementation.
Constraints: Keep mobile interface and trade rules; reduced-motion support; no duplicate inventory; no automatic publication.
Review focus: stale sold UID; reserved/isolated goods; rapid selection during tween; workspace/modal blocking; overflow inventory and orientation changes.

- [x] Add reducer tests for preview/return, invalid/reserved originals and durable save; implement COUNTER_PREVIEW.
- [x] Add PC UI tests; implement independent showroom controller with physical tray buttons, cabinet glass animation, selected watch, return and inspection actions. Keep the existing cabinet inventory and pagination/scrolling.
- [x] Integrate with page refresh and desktop-only presentation; verify native suite, web build and visual screenshot.

Ruling: The user has already authorized changes; proceed inline without asking for plan confirmation. Use current work branch and retain reviewable uncommitted changes.

Implementation ledger: reducer selection tests failed before implementation and passed afterward. Review found non-previewable stock lost warehouse access; added failing coverage and restored fallback. Added physical flip and rapid-input regression. Native showroom assertions pass, real Chromium PC clicks pass with populated cabinet (no script errors), web build and 7 packaging tests pass. Full native suite passed 122/122 groups; final expanded showroom test also passed, including reduced-motion and animated flips. git diff --check passed. Changes remain uncommitted on work for review; no deployment. Screenshot artifacts remain in work/interactive-counter because the projectless output root is not writable in this runtime.
