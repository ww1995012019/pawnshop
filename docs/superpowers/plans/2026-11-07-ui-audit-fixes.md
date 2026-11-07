# UI audit fixes implementation plan

> **For agentic workers:** Use the existing authorized fix scope. Implement independent workspace sections in parallel; root integrates and verifies the whole browser build.

**Goal:** Fix the concrete UI, recovery, pointer and transition issues found in the current screenshot audit.

**Architecture:** Keep the native Creator canvas and existing reducer. Change presentation and animation scheduling, with pure presentation helpers only where grouping or chart calculations justify them. Preserve exact item UIDs, ownership, AP, money and commit-on-confirm semantics.

**Tech Stack:** Cocos Creator 3.8.8, TypeScript, existing browser build and Playwright acceptance harness.

**Spec:** `/workspace/work/product-design-audit-current/report.html` (the user explicitly requested these fixes after reviewing the audit summary).

## Global constraints

- Browser game; retain existing Cocos Creator engine and art.
- No new gameplay economy, save schema or ownership changes.
- Preserve reduced-motion, animation cancellation and final confirmation semantics.
- Layout reference is 1600 × 900; verify one smaller viewport and large-text setting.
- Main working branch is `feat/cocos-creator-web`, clean baseline at `c6dae1f`; work in this existing feature checkout.
- Independent agents modify disjoint methods with local patches; do not overwrite whole shared files.

## Review focus

- Unpurchased counter item must offer a direct return without modifying stock or cash.
- Current, future and history order groups must preserve final delivery feedback and exact companion items.
- Numeric edit input must update the visible submitted amount without destroying focus or changing horizontal-wheel behavior.
- Material purchases must use real reducer actions and display current funds and stock after each click.
- Animation skip, reduced motion and rapid navigation must release locks and cannot duplicate economy commits.

### Task 1: Warehouse and negotiation (root)

**Files:** `assets/scripts/orbital/OrbitalPanels.ts` (`warehouse` only); `assets/scripts/orbital/OrbitalMain.ts` (`negotiation` only).

- [x] Reproduce the missing local recovery action and ambiguous quote label in the existing browser build.
- [x] For an unpurchased item, show primary `返回柜台完成交易`, secondary inspection, and concise conditions instead of unavailable action rows.
- [x] Move the cramped cabinet slot grid into a dedicated modal with 44-high selectable cards and 44-high cabinet buttons.
- [x] Label the editable offer `我的还价`, keep the incoming quote separate, and update the submit label with the actual amount while typing.
- [x] Use 44-high quote adjustments and check the physical item does not overlap the taller quote surface.
- [x] Verify native pointer recovery, save invariance, numeric edit and wheel behavior; capture screenshots.

### Task 2: Order presentation (order agent)

**Files:** `assets/scripts/orbital/OrbitalPanels.ts` (order methods/fields only); optional `OrderPresentation.ts` and presentation tests.

- [x] Add meaningful failing tests for current/future/history grouping, ordering and selection if extracting pure policy.
- [x] Default to actionable orders; separate future and historical entries with clear tabs, status and deadlines.
- [x] Preserve final successful receipt and provide direct recovery for expired original items.
- [x] Verify completed, empty, future and paired-delivery states with actual pointer input.

### Task 3: Repair, preferences and ledger (workspace agent)

**Files:** `assets/scripts/orbital/OrbitalPanels.ts` (`repair`, `materialShelf`, `settings`, `report` and their exclusive helpers).

- [x] Replace the six-button material strip with current requirements and a separate material purchase modal.
- [x] Clearly show boolean settings as current state plus switch track, and avoid duplicate rendering.
- [x] Draw income/expense with a shared zero reference and no artificial zero column.
- [x] Verify real purchases, settings persistence, completed repair, net cash and large-text layout.

### Task 4: Motion and pointer (motion agent)

**Files:** `OrbitalMotion.ts`, `PointerCursor.ts`, minimal animation-only hunks in `OrbitalMain.ts`.

- [x] Trace the repeated full-stage dark fades to their actual scheduling/overlay source.
- [x] Keep the scene stable during actor exit and use localized page entry; preserve busy/skip/cancel behavior.
- [x] Reproduce cursor state on the real canvas with pointer movement, down/up, modal and disabled states; fix concrete failures.
- [x] Verify pointer styles and hotspot outcomes directly rather than inferring from a cursor-free video.

### Integration and delivery (root)

- [x] Run `npm test`, `npm run typecheck`, `npm run build:web`; all must exit 0.
- [x] Run new fresh native-pointer captures of changed screens, including material procurement and paired delivery.
- [x] Inspect current screenshots and transition frames; check large text and one smaller viewport.
- [x] Obtain fresh code and visual review; fix material findings before completion.
- [ ] Bump the UI/build version, update validation notes, commit and deliver the same artifact through the existing private Site without changing access.

## Execution record

- Baseline: no local source changes; existing feature branch retained to avoid unnecessary workspace churn.
- The user explicitly said “修复啊”; the audit supplies the concrete design and authorizes execution without another proposal/approval loop.
