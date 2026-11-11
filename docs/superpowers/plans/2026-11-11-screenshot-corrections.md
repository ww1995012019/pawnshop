# Screenshot corrections

User requested three concrete corrections to the deployed mobile UI:

- [x] Show the goods picker as four equal-width cards per row, using the common phone scroller. Keep first-row recommendation controls visible on short screens.
- [x] Reapply the landscape header's phone surface and font metrics when it becomes visible after desktop initialization; separate title and balance into non-overlapping columns.
- [x] Render the total ledger as Date / Type / Description / Amount (Cr), with consistent columns, alternating rows, wrapping descriptions and right-aligned signed amounts.
- [x] Add a native regression covering all three screenshots, initialization and rotation, and four phone sizes.
- [x] Verify the Web build, the project test command (82/82 native groups plus packaging/font/layout checks), 109 focused layout assertions, and actual day-21 browser fixtures at 945×514, 844×390, 568×320 and 390×844.

The independent code review found no actionable issues. User's prior deployment request applies to these corrections; publish to the existing GitHub Pages site after verification.
