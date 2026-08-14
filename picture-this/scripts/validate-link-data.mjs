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
    errors.push(`${cardId}: expected exactly 3 audited puzzles`);
    continue;
  }

  const words = new Set();
  const answers = new Set();
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
    } else {
      puzzle.answers.forEach(answer => {
        const answerKey = String(answer).toLocaleLowerCase();
        if (answers.has(answerKey)) errors.push(`${prefix}: accepted answer is reused by another puzzle`);
        answers.add(answerKey);
      });
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

    if (!/only two/i.test(String(puzzle.explanation || ""))) {
      errors.push(`${prefix}: explanation must state why these are the only two matching items`);
    }
    if (puzzle.audit !== "exclusive-among-six-v1") {
      errors.push(`${prefix}: missing exclusive-among-six semantic audit marker`);
    }
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
const puzzleCount = Object.values(links).reduce((total, puzzles) => total + puzzles.length, 0);
const coveredCards = Object.values(links).filter(puzzles => puzzles.length).length;
if (puzzleCount !== cardCount * 3) {
  console.error(`Expected ${cardCount * 3} puzzles but found ${puzzleCount}.`);
  process.exit(1);
}
console.log(`PASS: ${puzzleCount} exclusive link puzzles; exactly 3 on each of ${coveredCards} audited cards.`);
