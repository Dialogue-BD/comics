import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { createRequire } from "node:module";
import test from "node:test";

const require = createRequire(import.meta.url);
const nextRequire = createRequire(require.resolve("eslint-config-next"));
const pluginRequire = createRequire(nextRequire.resolve("@next/eslint-plugin-next"));
const fastGlob = pluginRequire("fast-glob");
const globRequire = createRequire(pluginRequire.resolve("fast-glob"));
const micromatchRequire = createRequire(globRequire.resolve("micromatch"));
const braces = micromatchRequire("braces");

test("locks every affected dependency to a patched release", async () => {
  const lock = JSON.parse(
    await readFile(new URL("../package-lock.json", import.meta.url), "utf8"),
  );
  const minimums = {
    next: "16.3.8",
    "js-yaml": "4.3.2",
    "fast-uri": "3.1.8",
    "source-map-js": "1.2.2",
    browserslist: "4.28.7",
    fflate: "0.7.5",
    undici: "7.29.1",
    sharp: "0.35.5",
    "baseline-browser-mapping": "2.11.0",
  };
  const seen = new Set();
  for (const [path, pkg] of Object.entries(lock.packages)) {
    const name = path.split("node_modules/").at(-1);
    let minimum = minimums[name];
    if (name === "brace-expansion") {
      minimum = Number(pkg.version.split(".")[0]) >= 4 ? "5.0.12" : "1.1.21";
    }
    if (name === "braces") {
      assert.equal(pkg.name, "@dieub/braces-depth-guard", path);
      assert.equal(pkg.version, "3.0.3-pn.0", path);
      seen.add(name);
    }
    if (!minimum) continue;
    const actual = pkg.version.split(".").map(Number);
    const expected = minimum.split(".").map(Number);
    const difference = actual.map((value, index) => value - expected[index]).find(Boolean) ?? 0;
    assert.ok(difference >= 0, `${path}: ${pkg.version} must be >= ${minimum}`);
    seen.add(name);
  }
  for (const name of [...Object.keys(minimums), "braces", "brace-expansion"]) {
    assert.ok(seen.has(name), `${name} was not checked`);
  }
});

test("the guarded braces replacement preserves ordinary expansion and compilation", () => {
  assert.deepEqual(braces.expand("app/{page,layout}.{ts,tsx}"), [
    "app/page.ts", "app/page.tsx", "app/layout.ts", "app/layout.tsx",
  ]);
  assert.deepEqual(braces.expand("{1..3}"), ["1", "2", "3"]);
  assert.equal(braces.compile(braces.parse("{a,b}")), "(a|b)");
  assert.equal(braces.stringify(braces.parse("{a,b}")), "{a,b}");
  assert.deepEqual(
    fastGlob.sync("app/{page,layout}.{ts,tsx}", {
      cwd: new URL("..", import.meta.url).pathname,
    }).sort(),
    ["app/layout.tsx", "app/page.tsx"],
  );
});

test("deeply nested brace and parenthesis input is rejected before AST traversal", () => {
  for (const pattern of [
    "{".repeat(3200) + "a,b" + "}".repeat(3200),
    "{a,".repeat(2000) + "z" + "}".repeat(2000),
    "(".repeat(3200) + "a" + ")".repeat(3200),
  ]) {
    for (const operation of [
      () => braces(pattern),
      () => braces.parse(pattern),
      () => braces.expand(pattern),
      () => braces.compile(pattern),
    ]) {
      assert.throws(operation, { name: "SyntaxError", message: /exceeds max depth/ });
    }
  }
});

test("all recursive walkers reject oversized caller-supplied ASTs", () => {
  let ast = { type: "text", value: "a" };
  for (let index = 0; index < 150; index++) {
    const parent = { type: "brace", nodes: [ast] };
    ast.parent = parent;
    ast = parent;
  }
  const root = { type: "root", nodes: [ast] };
  ast.parent = root;
  for (const operation of [braces.compile, braces.expand, braces.stringify]) {
    assert.throws(() => operation(root), { name: "RangeError", message: /exceeds max depth/ });
  }
});
