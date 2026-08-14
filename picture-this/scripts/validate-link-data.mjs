#!/usr/bin/env node
import fs from "node:fs";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const sandbox = { window: {} };
vm.runInNewContext(fs.readFileSync(new URL("game-data.js", root), "utf8"), sandbox);
vm.runInNewContext(fs.readFileSync(new URL("link-data.js", root), "utf8"), sandbox);

const cards = sandbox.window.PICTURE_THIS_GAME_DATA;
const links = sandbox.window.PICTURE_THIS_LINK_DATA;
const errors = [];
const singleWord = /^[\p{L}\p{N}]+(?:[-’'][\p{L}\p{N}]+)*$/u;

for (const cardId of Object.keys(cards)) {
  const puzzles = links[cardId];
  if (!Array.isArray(puzzles) || puzzles.length !== 3) {
    errors.push(`${cardId}: expected exactly 3 puzzles`);
    continue;
  }

  const words = new Set();
  const pairs = new Set();
  puzzles.forEach((puzzle, position) => {
    const prefix = `${cardId} puzzle ${position + 1}`;
    if (!singleWord.test(puzzle.word || "")) errors.push(`${prefix}: invalid one-word link`);
    const wordKey = String(puzzle.word).toLocaleLowerCase();
    if (words.has(wordKey)) errors.push(`${prefix}: repeated displayed word`);
    words.add(wordKey);

    if (!Array.isArray(puzzle.answers) || !puzzle.answers.includes(puzzle.word)) {
      errors.push(`${prefix}: answers must include the displayed word`);
    } else if (puzzle.answers.some(answer => !singleWord.test(answer))) {
      errors.push(`${prefix}: every accepted answer must be one word`);
    }

    if (!Array.isArray(puzzle.items)
      || puzzle.items.length !== 2
      || new Set(puzzle.items).size !== 2
      || puzzle.items.some(index => !Number.isInteger(index) || index < 0 || index > 5)) {
      errors.push(`${prefix}: invalid item pair`);
    } else {
      const pairKey = [...puzzle.items].sort((left, right) => left - right).join("-");
      if (pairs.has(pairKey)) errors.push(`${prefix}: repeated item pair`);
      pairs.add(pairKey);
    }

    if (!String(puzzle.explanation || "").trim()) errors.push(`${prefix}: missing explanation`);
  });
}

for (const cardId of Object.keys(links)) {
  if (!cards[cardId]) errors.push(`${cardId}: link data has no matching card`);
}

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}

const cardCount = Object.keys(cards).length;
console.log(`PASS: ${cardCount} cards × 3 distinct link puzzles = ${cardCount * 3} puzzles.`);
