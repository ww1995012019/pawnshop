# Portrait Counter Implementation Plan

**Goal:** Implement the approved portrait counter concept in the existing Godot game.
**Architecture:** A dedicated portrait presentation uses the existing counter controller and reducer. Portrait canvas sizing is independent of landscape framing. Existing artwork and game state remain authoritative.
**Tech Stack:** Godot 4.6, GDScript, existing Web canvas shell.
**Spec:** Approved 掌上柜台 concept in this conversation: customer above, large object center, tools and transaction controls below, four destination navigation.

## Global Constraints
- Existing saves, trading rules and desktop layout remain supported.
- Portrait controls target at least 44 CSS px; normal text targets at least 14 CSS px.
- No deployment requested. Deliver a running local preview and captures.

## Review Focus
- Portrait/landscape resize must restore the appropriate presentation.
- No duplicated transactions: actions delegate to existing enabled buttons.
- Empty counter, visitors without goods and locked trades need usable states.
- Workspace tools and back navigation must remain reachable.
- Updated by the user: the main counter never scrolls; detailed content belongs in explicitly closable sheets. Only sheet contents may scroll.

### Task 1: Portrait presentation and canvas
- [x] Add failing portrait regression: upright viewport, readable counter, arrival and navigation.
- [x] Remove forced rotation and landscape fullscreen lock on upright phones.
- [x] Add native portrait counter presentation with existing textures, real customer and goods, quote and trade delegation, and four navigation destinations.
- [x] Adapt title, workspaces, and inspection layout to narrow viewports.
- [x] Verify native regressions and Web interaction at 390×844 and a short phone viewport; verify desktop.
- [x] Save screenshots and review the result against the approved concept.

## Verification record
Native full suite initially 66/68; both failing cleaning-input groups fixed and rerun passing. Eight focused groups pass. Touch transaction and five workspace browser checks pass. Review performed by the implementer; no independent reviewer. See design-qa.md for evidence and remaining art polish.

## Visual polish follow-up
User authorized continued visual refinement after reviewing the first screenshots. Replaced stretched room crops with dedicated mobile nine-slice artwork; enlarged tool artwork; added labeled navigation icons; retained the approved hierarchy, live text, controls and rules. Verification uses the existing portrait regression plus real touch transaction/workspace checks and matching 390×844 screenshot comparison.

## Fixed-screen follow-up
User requested a non-scrolling main page with clear close buttons. Removed the main ScrollContainer; allowed the watch illustration to flex while keeping controls at touch size. Long dialogue and item details, tool selection, multiple goods and quotation inputs now use separate sheets. Main actions remain visible in one row. Added text close buttons to portrait sheets/workspaces and regression coverage for 320/360/390/430 px screens, long dialogue, closing without trading and real swipes on the main screen.
