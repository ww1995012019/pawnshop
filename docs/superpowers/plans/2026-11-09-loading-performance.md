# Faster Web Entry Implementation Plan

**Goal:** Implement the user's approved first three loading improvements and publish to the existing GitHub Pages address.
**Architecture:** A small page-scoped transport fetches explicit gzip siblings, validates content and stores immutable engine/game/music responses in CacheStorage. Only exact release assets are intercepted; no vendor runtime modifications or service-worker lifecycle. Four room themes are loaded after entry via HTTPRequest. A deterministic font subset retains all supported game text and the original font is preserved outside the exported project.
**Tech Stack:** Godot 4.6.3, browser Fetch/DecompressionStream/CacheStorage, Python fontTools.
**Spec:** User-approved three priorities in this conversation: compressed first load, persistent repeat-load cache, deferred music and font reduction.

## Constraints and review focus
- Keep the existing URL, game saves, native audio and all Chinese game text.
- Private/cache-denied browsers must still run; unsupported decompression uses normal host fetch.
- Failed/corrupt downloads must never poison persistent caches; updates cannot reuse stale content.
- Slow music must never block entry; rapid room changes must not play a late old theme.
- Retain previous release assets for old tabs; cache pruning must not affect saves or other sites.

### Task 1: Compressed transport and persistent cache
- [x] Add release contracts and real-browser tests for static hosts without gzip negotiation, cache hits, corruption and cache denial; observe failures.
- [x] Add `godot/web/asset-loader.js`, package a hashed loader, inject an allowlisted asset manifest into the shell. Use explicit `.gz`, stream progress, validate SHA-256, gracefully fall back to normal assets/cache-free operation.
- [x] Verify cold/reload actual network requests and byte counts.

### Task 2: Deferred music and reduced font
- [x] Add packaging contracts for external four-theme files, and font coverage/size tests; observe failures.
- [x] Exclude four themes from the Web pack; export hashed Ogg URLs. Load them asynchronously in Audio, with cached streams and stale-response guards; keep native behavior.
- [x] Preserve font master in art-source/fonts; generate deterministic subset from game source/data plus Latin and punctuation; regenerate before export/import and enforce coverage.
- [x] Run packaging, font, native, exported assets and real-browser audio/phone tests.

### Task 3: Publish
- [x] Compare transfer bytes and controlled cold/repeat timings with baseline; review changes.
- [ ] Commit/push main, build deployment retaining previous release, push gh-pages and await successful Pages deployment.

## Verification record
- Native game regressions: 23/23 groups; packaging: 7/7; font coverage: 1/1; exported watch assets: pass.
- Real Chromium on a plain static host (no automatic HTTP gzip): compressed first download 11,360,483 bytes versus prior 15,399,470 compressed bytes (26.2% reduction). Cached revisit transfers zero engine/PCK bytes. Controlled local entry 3.22 seconds cold, 2.68 seconds cached; these are not production-network promises.
- Browser contracts cover all four deferred room themes, failed-theme retry, corrupted gzip fallback, corrupted cache repair, fatal pack/WASM retry UI, cache-denied mode, and browsers without DecompressionStream.
- Independent review identified same-room music retry and swallowed vendor WASM rejection. Both reproduced with failing browser checks and fixed without editing pinned engine files.
- Existing merchant browser test tried to tap a button clipped below the custody-pane scroller. Updated the test to scroll the actual pane and assert the button is within the phone viewport before tapping.
- Author decisions: retain existing hosting and use page-scoped Fetch transport rather than a service worker (avoids update-control races); keep the full font master outside the export and deterministically regenerate supported game glyphs before builds.
