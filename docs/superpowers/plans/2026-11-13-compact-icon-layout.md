# Compact icon layout implementation plan

**Goal:** Apply the approved whole-product icon layout audit, preserving all transactions and physical originals.
**Spec:** https://chatgpt.com/space/page_9cf1b2a2b83481919889ee33e938ac99
**Architecture:** Keep Godot pages and reducers. Replace repetitive selection lists with responsive icon grids and shared selection details. Keep accounting, contracts, process order and destructive warnings textual.
**Execution:** Independent file domains in parallel, then one integration and fresh code review. Existing work branch isolates changes from main; publishing follows prior user authorization.

## Tasks

- [x] Merchant: compact material cards; three categories; watch icon selection and separate sale action. Verify batch stock/cash/AP, selected UID and mobile control reachability.
- [x] Benches/storage: horizontal inspection tools, repair icon selection/material counts, consistent square cabinet slots and content-aware display height. Verify drag, rotation and four screen sizes.
- [x] Management: compact orders, report entry row, parallel plan cards and bulk icons, settings/help entries. Verify financial totals and irreversible wording.
- [x] Integrate: register regressions, run full native suite, build/export smoke, fresh browser screenshots at1440x900,844x390,390x844 and merchant transaction/persistence checks.
- [ ] Review current diff against audit, fix important findings, commit main source and publish verified package to gh-pages; verify exact deployment SHA success.

## Review focus

- Phone controls remain visible without nested scrolling or horizontal overflow.
- Selection never spends funds; explicit transaction retains price, count, AP and identity.
- Rebuilds preserve focus and do not reference freed controls.
- Optional/empty sections do not fill entire workspace with unused boxes.
- Original trading, source verification, contract delivery and save semantics remain intact.
