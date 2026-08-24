import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request("http://localhost/", {
      headers: { accept: "text/html" },
    }),
    {
      ASSETS: {
        fetch: async () => new Response("Not found", { status: 404 }),
      },
    },
    {
      waitUntil() {},
      passThroughOnException() {},
    },
  );
}

test("redirects the application root to the static emotions client", async () => {
  const response = await render();
  assert.equal(response.status, 307);
  assert.equal(response.headers.get("location"), "/index.html");
});

test("keeps the static emotions client available at the redirect target", async () => {
  const [page, html] = await Promise.all([
    readFile(new URL("../app/page.tsx", import.meta.url), "utf8"),
    readFile(new URL("../public/index.html", import.meta.url), "utf8"),
  ]);

  assert.match(page, /redirect\(["']\/index\.html["']\)/);
  assert.match(html, /<title>How Are You Feeling\? · English Club<\/title>/);
  assert.match(html, /id="emotion-wheel"/);
  assert.match(html, /<script src="app\.js\?v=[^"]+"><\/script>/);
});
