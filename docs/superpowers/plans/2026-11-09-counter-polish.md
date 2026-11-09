# Counter and luxury watch polish

User request: mark expensive watches with a noble identifying decoration, put visible money in the marked quotation-console space, and make transaction animation continuous.

Keep the existing pixel art, original brand logos, item IDs, economic rules, and pending ledger layout fix. All nine luxury model definitions get a gold crest in their physical artwork and UI badges. Tier decoration identifies the model and never proves authenticity.

Use the currently empty right side of the quotation controls for a visible banknote stack when the price dial is not active (idle, awaiting selection, locked payment, merchant). During price adjustment preserve the existing controls and evidence buttons. The stack is the payment animation anchor; its appearance follows cash, including empty at zero.

Fix sequencing by waiting for actual bill and item tweens. Initialize bill positions before the first render, use matching banknote artwork at source and in flight, update only the visual cash stack during counting, then finish item transfer before the customer walks away. Reduced-motion mode completes the same logical transaction without flight animation. Effects belong to the counter page and are cleaned up on navigation.

- [x] Add failing crest, cash-placement and payment/item/departure ordering checks.
- [x] Add shared gold crest pixels to generator and reference/UI badges; preserve brand/variant logo behavior.
- [x] Add a cash tray and share its banknote drawing with flying notes; sequence payment and handover through tween completion.
- [x] Run relevant and complete tests, regenerate font subset, build Web, inspect screenshots and a recorded transaction.

## Follow-up: inspection usability

User requested flat full-width button rows and automatic back-side UV viewing. Scale and item actions now each use four expanding columns. Optical activation selects the back for UV and the front for the magnifier, queues the latest request during an in-progress turn, preserves manual flipping, and does not record evidence or charge AP.

The user explicitly chose to preserve the existing genuine-only first day. No counterfeit rates or tutorial inventory were changed. A runtime probe of 1,991 later incoming watches found 375 copies (18.8%) with no authenticity propagation mismatch.

Verification: inspection usability and optical face safety checks pass; full suite 27/27 native groups, 7 packaging tests and font coverage pass.
