import { EffectAsset, Material, builtinResMgr, game, Game, Color } from "cc";
export async function registerBuiltins(effectsUrl = "./builtin-effects.json") {
  const effects = await (await fetch(effectsUrl)).json();
  game.on(Game.EVENT_POST_SUBSYSTEM_INIT, () => {
    for (const data of effects) {
      const e = Object.assign(new EffectAsset(), data);
      e.hideInEditor = true;
      e.onLoaded();
    }
    const definitions: Array<[string, string, Record<string, boolean>]> = [
      ["missing-effect-material", "builtin-unlit", { USE_COLOR: true }],
      ["missing-material", "builtin-unlit", { USE_COLOR: true }],
      [
        "default-clear-stencil",
        "builtin-clear-stencil",
        { USE_TEXTURE: false },
      ],
      ["ui-base-material", "builtin-sprite", { USE_TEXTURE: false }],
      [
        "ui-sprite-material",
        "builtin-sprite",
        { USE_TEXTURE: true, CC_USE_EMBEDDED_ALPHA: false, IS_GRAY: false },
      ],
      [
        "ui-alpha-test-material",
        "builtin-sprite",
        {
          USE_TEXTURE: true,
          USE_ALPHA_TEST: true,
          CC_USE_EMBEDDED_ALPHA: false,
          IS_GRAY: false,
        },
      ],
      [
        "ui-sprite-gray-material",
        "builtin-sprite",
        { USE_TEXTURE: true, CC_USE_EMBEDDED_ALPHA: false, IS_GRAY: true },
      ],
      [
        "ui-sprite-alpha-sep-material",
        "builtin-sprite",
        { USE_TEXTURE: true, CC_USE_EMBEDDED_ALPHA: true, IS_GRAY: false },
      ],
      [
        "ui-sprite-gray-alpha-sep-material",
        "builtin-sprite",
        { USE_TEXTURE: true, CC_USE_EMBEDDED_ALPHA: true, IS_GRAY: true },
      ],
      ["ui-graphics-material", "builtin-graphics", {}],
    ];
    for (const [name, effectName, defines] of definitions) {
      const material = new Material();
      material._uuid = name;
      material.initialize({ effectName, defines });
      builtinResMgr.addAsset(name, material);
    }
  });
}
