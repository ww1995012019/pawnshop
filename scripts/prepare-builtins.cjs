/* Generated from the MIT-licensed Cocos Creator engine's own test fixtures.
 * The conversions remove Vulkan uniform-binding qualifiers for WebGL2,
 * and flatten uniform blocks/attributes for WebGL1. Engine shader metadata
 * and the original shader source remain from the pinned Cocos engine. */
const fs = require("fs"),
  path = require("path"),
  vm = require("vm");
const engine = path.resolve(process.argv[2] || path.join(__dirname, "engine"));
const destination = path.resolve(
  process.argv[3] || path.join(__dirname, "web-test/builtin-effects.json"),
);
function read(name, file) {
  const context = {};
  vm.createContext(context);
  vm.runInContext(
    fs
      .readFileSync(path.join(engine, "tests/fixtures", file), "utf8")
      .replace("export const " + name, "globalThis." + name),
    context,
  );
  return context[name];
}
const effects = read("effects", "builtin-effects.ts"),
  sources = read("glsl4", "builtin-glsl4.ts");
const uniformChunks =
  fs.readFileSync(
    path.join(engine, "editor/assets/chunks/builtin/uniforms/cc-global.chunk"),
    "utf8",
  ) +
  "\n" +
  fs.readFileSync(
    path.join(engine, "editor/assets/chunks/builtin/uniforms/cc-local.chunk"),
    "utf8",
  );
const uniformBlocks = {};
for (const m of uniformChunks.matchAll(
  /layout\s*\([^)]*\)\s*uniform\s+(CCGlobal|CCCamera|CCLocal)\s*\{[\s\S]*?\};/g,
))
  uniformBlocks[m[1]] = m[0];
function alignUniforms(s) {
  return s
    .replace(
      /layout\s*\([^)]*\)\s*uniform\s+(CCGlobal|CCCamera|CCLocal)\s*\{[\s\S]*?\};/g,
      (m, n) => uniformBlocks[n] || m,
    )
    .replace(/cc_debug_view_composite_pack_[123]/g, "vec4(0.0)");
}
const needed = [
  "builtin-sprite",
  "builtin-graphics",
  "builtin-clear-stencil",
  "builtin-unlit",
  "builtin-geometry-renderer",
];
const glsl3 = (s) =>
  s
    .replace(/layout\s*\([^)]*\)\s*/g, "")
    .replace(/uniform\s+(\w+)\s*\{/g, "layout(std140) uniform $1 {");
function glsl1(source, stage) {
  let s = glsl3(source).replace(/layout\s*\([^)]*\)\s*/g, "");
  s = s.replace(/uniform\s+(\w+)\s*\{([\s\S]*?)\};/g, (_, name, body) =>
    body
      .replace(/\/\/[^\n]*/g, "")
      .split(";")
      .filter((v) => v.trim())
      .map((v) => "uniform " + v.trim() + ";")
      .join("\n"),
  );
  s = s
    .replace(
      /^([ \t]*)in\s+/gm,
      stage === "vert" ? "$1attribute " : "$1varying ",
    )
    .replace(/^([ \t]*)out\s+/gm, "$1varying ");
  if (stage === "frag")
    s = s
      .replace(/varying\s+vec4\s+cc_FragColor\s*;/g, "")
      .replace(/\bcc_FragColor\b/g, "gl_FragColor");
  s = s.replace(/\btexture\(/g, "texture2D(");
  if (stage === "frag" && /\b(?:fwidth|dFdx|dFdy)\s*\(/.test(s))
    s = "#extension GL_OES_standard_derivatives : enable\n" + s;
  return s;
}
const output = [];
effects.forEach((effect, i) => {
  if (!needed.includes(effect.name)) return;
  effect.shaders.forEach((shader, j) => {
    shader.glsl4 = {
      vert: alignUniforms(sources[i][j].vert),
      frag: alignUniforms(sources[i][j].frag),
    };
    shader.glsl3 = {
      vert: glsl3(shader.glsl4.vert),
      frag: glsl3(shader.glsl4.frag),
    };
    shader.glsl1 = {
      vert: glsl1(shader.glsl4.vert, "vert"),
      frag: glsl1(shader.glsl4.frag, "frag"),
    };
  });
  output.push(effect);
});
fs.mkdirSync(path.dirname(destination), { recursive: true });
fs.writeFileSync(destination + ".tmp", JSON.stringify(output));
fs.renameSync(destination + ".tmp", destination);
console.log("Cocos builtin shader bundle:", destination);
