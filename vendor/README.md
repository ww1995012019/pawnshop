# Cocos browser support assets

`cc-builtin-effects.json` is generated from the MIT-licensed official Cocos Creator 3.8.8 engine test fixtures (`builtin-effects.ts` and `builtin-glsl4.ts`) at commit `411f98df047c25902f93440d4b22925c2fb65461`.

The browser CI build adapts the fixture GLSL4 uniform-binding qualifiers to WebGL2 and WebGL1 source. It registers those real Cocos EffectAsset/Material resources before rendering the programmatic UI. A normal Creator editor build uses the editor's built-in resource bundle instead.

Run `npm run engine:prepare -- --force` to reproduce the engine ESM, API declarations, and these assets. The source and generated runtime are cached under `.cache/cocos/`; no generated `cc` shim is used. Keep `COCOS-LICENSE.txt` with distributed engine support assets.
