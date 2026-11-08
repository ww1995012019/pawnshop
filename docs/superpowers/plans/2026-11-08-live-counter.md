# Live Counter Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans for root integration. Independent viewport and image-asset work is delegated under superpowers:dispatching-parallel-agents; root owns shared Main/UI integration. Preserve the v16 baseline and use a read-only fresh reviewer at completion.

**Goal:** Fill the user's viewport and deliver one counter with three directly manipulable layered goods.
**Architecture:** A viewport adapter leaves the existing 1600×900 interaction coordinate frame centered inside a full viewport/background. A pure per-UID assembly state and a native layered renderer power the same objects on the counter and inspection pad; business mutations stay in the original reducer.
**Tech Stack:** Cocos 3.8.8, TypeScript, generated transparent parts atlas, Python Playwright.
**Spec:** docs/superpowers/specs/2026-11-08-live-counter-design.md

## Global constraints
- No schema or economic migration, no free item duplication, retain v16 phone workflows and explicit confirmation.
- Three sample definitions: ITM-001 / ITM-002 / ITM-003; stable UID across counter and inspection.
- In-session mechanical state is separate from ownership, AP, money and repaired/working facts.
- All new phone actions remain at least 108 design units high/wide where applicable; honor reduced motion and cancel/blur.

## Review focus
- Responsive orientation and browser fullscreen do not crop controls or shift touch coordinates.
- A held scene object whose inventory membership/eligibility changed cannot still be recorded or inspected.
- Clicking or canceling a part or rack does not bubble into selecting/navigating a different object.
- New render/animation nodes clean up across repeated page switches and reduced motion.
- Observation readiness and normal CHECK fees do not grant free repair/materials or duplicate existing evidence.

### Task 1: Responsive viewport (worker)
Files: new ResponsiveViewport.ts + metadata, web/entry.ts, focused viewport tests.
Exports: configureViewport():void; viewportBounds():{x:number;y:number;width:number;height:number}; bindResponsiveViewport(onChange:()=>void):()=>void; toggleBrowserFullscreen():Promise<boolean>.
- [x] Reproduce old canvas letterboxing at 1920×910.
- [x] Implement fill-canvas policy with centered base coordinates, safe narrow-aspect handling and fullscreen.
- [x] Verify mathematical geometry and a private native browser check; give root exact integration calls.

### Task 2: Layered art (worker)
Files: assets/resources/art/orbital-prop-parts.png + metadata, reproducible packing helper and any source assets/manifest.
Contract: 4 columns × 3 rows. Row 0 water body/cap/filter/knob, row 1 mug body/lid/heater/dial, row 2 lamp base/left leaf/centre leaf/right leaf. Transparent regular cells, padded; report exact atlas dimensions.
- [x] Generate and inspect a coherent parts sheet; import into isolated transparent cells with no labels or neighboring fragments.
- [x] Verify all twelve cells occupied, preserve clear openings/transparency, document component anchors for root.

### Task 3: Root — per-UID mechanics and native counter
Files: new PropMechanics.ts, InteractiveProps.ts, CounterScene.ts and metadata; relevant Main/UI bindings; tests/test-prop-mechanics.mjs and native counter acceptance.
Interfaces: PrototypeState {open:boolean;extracted:boolean;power:boolean;dial:number;leaves:[number,number,number]}; updatePrototype(defId,state,action):PrototypeState; prototypeReading(item,state):{hint:string;tool:ToolId|null;ready:boolean}.
- [x] Write failing eligibility/mechanism/readiness tests and retain the user’s v16 counter screenshot as the visual baseline.
- [x] Implement independent parts, native hit targets, movement and feedback; prepare cannot change economy.
- [x] Render eligible owned goods on a physical rack, support picking/drag cancellation/return, resolve UID on each action.
- [x] Reuse per-UID mechanics in inspection, with responsive hit sizes; commit observation through CHECK only.
- [x] Integrate viewport bleed, native fullscreen UI and cleanup on reset/destroy/blur.

### Task 4: Root — verification and release
- [x] Run complete tests, typecheck, focused native interactions and production phone regression.
- [x] Inspect actual scenes and all three mechanisms, get one fresh code review and fix material findings.
- [x] Build v17/pages, record a continuous real-input demo, push source and Pages preserving archived releases, confirm deployment success.

## Evidence so far
- `scripts/test-prop-mechanics.mjs`: 21 checks for real UID/eligibility, independent assembly, immutability and original CHECK fees.
- `scripts/test-live-counter.py`: native rack drop/cancel; actual part movement; same UID on inspection; first/repeat CHECK; three mechanisms, full-scene bounds and reduced motion. Native filter drag was first reproduced failing and fixed by distinguishing the original release event code from OS cancellation.
- Fresh read-only review independently rechecked that fix at 667×375 touch / 1920×910 mouse and the two-contact modal guards (synthetic DOM events through Cocos). No remaining material findings.
- Final typecheck/build, production regression, seven viewport cases, native fullscreen-button entry/exit and a 45.28 s continuous production recording all passed. Production bundle SHA-256: `264ce03bcb797fef1eb0a0121e49c204c7afb696db4a2fffbaffa23168f5e342`.

- Released source `f6bdab32f88b7a65ae4fbda6494b095903ea98a0` and Pages `9bb5cb5d88333bf49c1d7a905feb3a87c15325dc`; [Pages run 42447724882](https://github.com/ww1995012019/pawnshop/actions/runs/42447724882) completed successfully. All 43 published files match; six archived release trees preserved.
