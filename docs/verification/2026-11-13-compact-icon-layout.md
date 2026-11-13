# Compact icon layout verification

Approved audit: https://chatgpt.com/space/page_9cf1b2a2b83481919889ee33e938ac99

Merchant categories now separate materials, rare stock and physical watch selection. Material and watch grids retain original transaction reducers, explicit actions, quantities, prices and AP. Mobile action footers reserve usable widths and desktop sheets fit natural content up to440 logical pixels.

Inspection tools use horizontal buttons; repair stock/supplies use icons; cabinet slots are square and display height follows capacity. Orders collapse into icon summaries; report actions, plan objects/upgrades, settings/help entries use parallel controls. Process order, financial tables, contracts and destructive warnings remain textual.

- New merchant and bench native regressions cover selection without transfer, selected original sale, keyboard focus, mobile action widths, toolbar traversal, square slots and32 display places.
- Initial113-group native run passed109 groups. Four failures were investigated: order brief test used replaced entry; workspace first-tool focus needed a real toolbar-order fix; rotation test used obsolete fixed-cell coordinates; night insurance test needed to open the new entry. All four groups were subsequently rerun successfully with their state/ownership assertions retained.
- Packaging7 tests, font test and loading-layout2 tests pass; exported assets load78 items,33 residents and3 instruments.
- Fresh browser tests at1440x900,844x390,390x844 cover material selection/purchase, selection of a non-default watch, explicit sale, exact quote/cash/AP and remaining UID set, IndexedDB persistence and reload; capture warehouse, inspection, repair, orders and report.
- Separate screenshots cover all plan tabs, help, settings and manual. Original26-shot audit remains on the Page above.
- Fresh read-only review found no critical or important transaction regressions. Browser verification additionally caught collapsed mobile footer buttons; explicit width regressions now cover that fix.

Some existing Godot tests still log resource-at-exit warnings; the runner treats those separately from script/parse errors.

## Published release

Source: ba8a70a2bb515c91470ca017152c9d946ed35cca. Pages commit: b8338adeb3e3c5b4d3643c1abc5bba4c5c51ccd8. Release3c74952a9b51496b; pack workbench-f535d8fca4369dfa.pck. Exact Pages deployment43359351589 completed successfully. All three final browser viewport runs pass, including exact cash/AP/remaining-original identities and reload. Previous release assets remain available.
