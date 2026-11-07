/** Reproducible browser runtime build from the real, pinned Cocos Creator engine.
 * Cocos Creator editor is the normal scene/import/build workflow. This headless
 * source-engine build lets CI preview the same project components without a
 * installed Creator editor. It does not replace the editor asset pipeline.
 */
import fs from "node:fs";
import path from "node:path";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { execFileSync } from "node:child_process";
const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const cache = path.resolve(
  process.env.COCOS_CACHE_DIR || path.join(root, ".cache/cocos"),
);
const engine = path.join(cache, "engine");
const runtime = path.join(cache, "runtime");
const types = path.join(cache, "types");
const PIN = "411f98df047c25902f93440d4b22925c2fb65461";
const VERSION = "3.8.8";
const FEATURES = [
  "base",
  "gfx-webgl",
  "gfx-webgl2",
  "2d",
  "ui",
  "graphics",
  "mask",
  "rich-text",
  "tween",
  "animation",
  "audio",
  "legacy-pipeline",
];
const require = createRequire(import.meta.url);
const { buildEngine, StatsQuery } = require("@cocos/ccbuild");
const ts = require("@cocos/typescript");
const force = process.argv.includes("--force");
const supportSource = path.join(cache, "effect-source");
function refreshSupport(source) {
  run(process.execPath, [
    path.join(root, "scripts/prepare-builtins.cjs"),
    source,
    path.join(root, "vendor/cc-builtin-effects.json"),
  ]);
  fs.copyFileSync(
    path.join(source, "LICENSE.md"),
    path.join(root, "vendor/COCOS-LICENSE.txt"),
  );
}
function cacheSupport() {
  for (const relative of [
    "tests/fixtures/builtin-effects.ts",
    "tests/fixtures/builtin-glsl4.ts",
    "editor/assets/chunks/builtin/uniforms/cc-global.chunk",
    "editor/assets/chunks/builtin/uniforms/cc-local.chunk",
    "LICENSE.md",
  ]) {
    const target = path.join(supportSource, relative);
    fs.mkdirSync(path.dirname(target), { recursive: true });
    fs.copyFileSync(path.join(engine, relative), target);
  }
}
fs.mkdirSync(cache, { recursive: true });
function run(command, args, cwd = root) {
  execFileSync(command, args, { cwd, stdio: "inherit" });
}
function generateDebugMap() {
  const content = fs.readFileSync(
    path.join(engine, "EngineErrorMap.md"),
    "utf8",
  );
  const matches = [...content.matchAll(/### (\d+)/g)],
    data = {};
  for (let i = 0; i < matches.length; i++) {
    const m = matches[i],
      body = content
        .slice(m.index + m[0].length, matches[i + 1]?.index ?? content.length)
        .replaceAll(String.fromCharCode(96).repeat(3), " ")
        .trim();
    if (!body.includes("<!-- DEPRECATED -->")) data[m[1]] = body;
  }
  fs.writeFileSync(
    path.join(engine, "DebugInfos.json"),
    JSON.stringify(data, null, 2),
  );
}
async function emitTypes() {
  fs.mkdirSync(types, { recursive: true });
  const stats = await StatsQuery.create(engine);
  fs.writeFileSync(
    path.join(engine, "@types/consts.d.ts"),
    stats.constantManager.genInternalConstants(),
  );
  const selected = FEATURES.filter((x) => !x.startsWith("gfx-"));
  const entry = path.join(engine, "runtime-types.ts");
  fs.writeFileSync(
    entry,
    selected.map((x) => `export * from './exports/${x}';`).join("\n"),
  );
  const roots = [
    entry,
    ...fs
      .readdirSync(path.join(engine, "@types"))
      .filter((x) => x.endsWith(".d.ts"))
      .map((x) => path.join(engine, "@types", x)),
    ...fs
      .readdirSync(path.join(engine, "@types/pal"))
      .filter((x) => x.endsWith(".d.ts"))
      .map((x) => path.join(engine, "@types/pal", x)),
  ];
  const options = {
    rootDir: engine,
    outDir: types,
    declaration: true,
    emitDeclarationOnly: true,
    noEmitOnError: false,
    skipLibCheck: true,
    target: ts.ScriptTarget.ES2020,
    module: ts.ModuleKind.ESNext,
    moduleResolution: ts.ModuleResolutionKind.NodeJs,
    experimentalDecorators: true,
    allowSyntheticDefaultImports: true,
    esModuleInterop: true,
    strict: false,
    types: [],
    baseUrl: engine,
    paths: {
      cc: ["runtime-types.ts"],
      "cc.decorator": ["cocos/core/data/decorators/index.ts"],
    },
  };
  const program = ts.createProgram(roots, options);
  const result = program.emit();
  const diagnostics = ts
    .getPreEmitDiagnostics(program)
    .concat(result.diagnostics);
  fs.writeFileSync(
    path.join(cache, "engine-type-diagnostics.log"),
    ts.formatDiagnostics(diagnostics, {
      getCanonicalFileName: (x) => x,
      getCurrentDirectory: () => engine,
      getNewLine: () => "\n",
    }),
  );
  if (!fs.existsSync(path.join(types, "runtime-types.d.ts")))
    throw Error("Official engine declarations were not emitted.");
  console.log(
    `Official engine declarations emitted (${diagnostics.length} optional/native engine diagnostics logged; project typecheck uses declarations with skipLibCheck).`,
  );
}
const cached = path.join(runtime, "build-info.json");
let info;
try {
  info = JSON.parse(fs.readFileSync(cached, "utf8"));
} catch {}
if (
  !force &&
  info?.commit === PIN &&
  fs.existsSync(path.join(runtime, "cc.js")) &&
  fs.existsSync(path.join(types, "runtime-types.d.ts")) &&
  fs.existsSync(path.join(supportSource, "LICENSE.md"))
) {
  refreshSupport(supportSource);
  console.log(
    `Using cached genuine Cocos Creator ${VERSION} runtime (${PIN.slice(0, 8)}).`,
  );
  process.exit(0);
}
if (!fs.existsSync(path.join(engine, ".git"))) {
  run("git", [
    "clone",
    "--depth",
    "1",
    "--branch",
    "v3.8.8",
    "https://github.com/cocos/cocos-engine.git",
    engine,
  ]);
}
const head = execFileSync("git", ["rev-parse", "HEAD"], {
  cwd: engine,
  encoding: "utf8",
}).trim();
if (head !== PIN) {
  run("git", ["fetch", "--depth", "1", "origin", PIN], engine);
  run("git", ["checkout", "--detach", PIN], engine);
}
generateDebugMap();
fs.mkdirSync(runtime, { recursive: true });
const oldCwd = process.cwd();
try {
  process.chdir(engine);
  await buildEngine({
    engine,
    out: runtime,
    moduleFormat: "esm",
    mode: "BUILD",
    platform: "HTML5",
    features: FEATURES,
    flags: { DEBUG: false },
    compress: false,
    sourceMap: false,
    split: false,
    assetURLFormat: "relative-from-chunk",
  });
} finally {
  process.chdir(oldCwd);
}
if (!fs.existsSync(path.join(runtime, "cc.js")))
  throw Error("Official ccbuild did not produce cc.js.");
await emitTypes();
cacheSupport();
refreshSupport(supportSource);
fs.writeFileSync(
  cached,
  JSON.stringify(
    {
      engine: "Cocos Creator",
      version: VERSION,
      commit: PIN,
      builder: "@cocos/ccbuild@2.3.23",
      features: FEATURES,
      format: "esm",
    },
    null,
    2,
  ),
);
console.log("Cocos Creator browser runtime and true API declarations ready.");
