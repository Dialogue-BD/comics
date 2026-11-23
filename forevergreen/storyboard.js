(() => {
  "use strict";

  const ROOT = document.getElementById("storyboard");
  const get = (id) => ROOT.querySelector(`#storyboard-${id}`);
  const els = {
    activity: get("activity"),
    loading: get("loading"),
    scene: get("scene"),
    progress: get("progress"),
    image: get("image"),
    act: get("act"),
    board: get("board"),
    sentences: get("sentences"),
    bank: get("bank"),
    answer: get("answer"),
    answerText: get("answer-text"),
    check: get("check"),
    reset: get("reset"),
    return: get("return"),
    status: get("status"),
    prev: get("prev"),
    next: get("next")
  };

  function shuffledCards(count) {
    const order = Array.from({ length: count }, (_, index) => index);
    for (let index = order.length - 1; index > 0; index -= 1) {
      const other = Math.floor(Math.random() * (index + 1));
      [order[index], order[other]] = [order[other], order[index]];
    }
    // Keep the two-column card bank from displaying an already assembled sentence.
    if ([0, 2].some((index) => order[index] % 2 === 0 && order[index + 1] === order[index] + 1)) {
      [order[1], order[3]] = [order[3], order[1]];
    }
    return order;
  }

  function init(scenes) {
    const states = scenes.map(({ sentences }) => {
      const cards = sentences.flat();
      return { cards, order: shuffledCards(cards.length), slots: cards.map(() => null), checked: false, solved: false };
    });
    let current = 0;
    let selected = null;
    let dragged = null;
    const state = () => states[current];
    const slotAt = (target) => target.closest("[data-slot]");
    const cardAt = (target) => target.closest("[data-card]");

    function makeCard(id, slot) {
      const sceneState = state();
      const button = document.createElement("button");
      button.type = "button";
      button.className = slot === undefined ? "storyboard-card" : "storyboard-slot";
      if (slot !== undefined) button.dataset.slot = slot;
      if (id !== null) {
        button.dataset.card = id;
        button.draggable = true;
        button.setAttribute("aria-pressed", String(id === selected));
      }
      button.textContent = id === null ? "Place card here" : sceneState.cards[id];
      if (slot !== undefined) {
        let label = `Sentence ${Math.floor(slot / 2) + 1}, space ${slot % 2 + 1}: ${button.textContent}`;
        if (sceneState.checked) {
          const correct = id === slot;
          button.dataset.result = correct ? "correct" : "retry";
          label += correct ? ", correct" : ", try again";
        }
        button.setAttribute("aria-label", label);
      }
      return button;
    }

    function renderBoard() {
      const sceneState = state();
      els.board.hidden = sceneState.solved;
      els.answer.hidden = !sceneState.solved;
      els.check.hidden = sceneState.solved;
      els.return.hidden = selected === null || !sceneState.slots.includes(selected);
      els.progress.textContent = `${states.filter(({ solved }) => solved).length} of ${scenes.length} complete`;

      if (sceneState.solved) {
        els.answerText.textContent = sceneState.cards.join(" ");
        return;
      }

      const sentenceRows = scenes[current].sentences.map((_, index) => {
        const row = document.createElement("fieldset");
        row.className = "storyboard-sentence";
        const label = document.createElement("legend");
        label.textContent = `Sentence ${index + 1}`;
        const first = index * 2;
        row.append(label, makeCard(sceneState.slots[first], first), makeCard(sceneState.slots[first + 1], first + 1));
        return row;
      });
      els.sentences.replaceChildren(...sentenceRows);
      const cards = sceneState.order
        .filter((id) => !sceneState.slots.includes(id))
        .map((id) => makeCard(id));
      els.bank.replaceChildren(...cards);
      if (cards.length === 0) els.bank.textContent = "All cards placed.";
    }

    function showScene(index) {
      current = index;
      selected = null;
      dragged = null;
      const scene = scenes[current];
      els.scene.value = String(current);
      els.image.src = `storyboard/scene-${String(current + 1).padStart(2, "0")}.jpg`;
      els.image.alt = scene.imageAlt;
      els.act.textContent = `Act ${scene.act} · ${FOREVERGREEN_STORY.acts[scene.act - 1].title}`;
      els.prev.disabled = current === 0;
      els.next.disabled = current === scenes.length - 1;
      els.status.textContent = "";
      renderBoard();
    }

    function place(id, slot) {
      const sceneState = state();
      const previous = sceneState.slots.indexOf(id);
      if (previous >= 0) sceneState.slots[previous] = slot === null ? null : sceneState.slots[slot];
      if (slot !== null) sceneState.slots[slot] = id;
      sceneState.checked = false;
      selected = null;
      renderBoard();
      if (slot === null) {
        els.bank.querySelector(`[data-card="${id}"]`).focus();
        els.status.textContent = "Card returned.";
      } else {
        els.sentences.querySelector(`[data-slot="${slot}"]`).focus();
        els.status.textContent = "";
      }
    }

    els.board.addEventListener("click", (event) => {
      const slot = slotAt(event.target);
      const card = cardAt(event.target);
      if (slot && selected !== null && Number(slot.dataset.card) !== selected) {
        place(selected, Number(slot.dataset.slot));
      } else if (card) {
        const id = Number(card.dataset.card);
        selected = selected === id ? null : id;
        renderBoard();
        els.board.querySelector(`[data-card="${id}"]`).focus();
        els.status.textContent = selected === null ? "" : "Card selected. Choose a space.";
      }
    });

    els.board.addEventListener("dragstart", (event) => {
      const card = cardAt(event.target);
      if (!card) return;
      dragged = Number(card.dataset.card);
      event.dataTransfer.setData("text/plain", String(dragged));
      event.dataTransfer.effectAllowed = "move";
    });
    els.board.addEventListener("dragend", () => { dragged = null; });
    els.board.addEventListener("dragover", (event) => {
      if (dragged === null || !(slotAt(event.target) || event.target.closest("#storyboard-bank"))) return;
      event.preventDefault();
      event.dataTransfer.dropEffect = "move";
    });
    els.board.addEventListener("drop", (event) => {
      const slot = slotAt(event.target);
      const bank = event.target.closest("#storyboard-bank");
      if (dragged === null || !(slot || bank)) return;
      event.preventDefault();
      const id = dragged;
      dragged = null;
      place(id, slot ? Number(slot.dataset.slot) : null);
    });

    els.return.addEventListener("click", () => place(selected, null));
    els.check.addEventListener("click", () => {
      const sceneState = state();
      if (sceneState.slots.includes(null)) {
        els.status.textContent = "Fill each space, then check the order.";
        return;
      }
      const correct = sceneState.slots.filter((id, slot) => id === slot).length;
      sceneState.checked = true;
      sceneState.solved = correct === sceneState.slots.length;
      renderBoard();
      if (sceneState.solved) {
        els.answer.querySelector("h3").focus();
        els.status.textContent = states.every(({ solved }) => solved)
          ? "You completed the whole storyboard!"
          : "Both sentences are in order.";
      } else {
        els.status.textContent = `${correct} of ${sceneState.slots.length} cards are in the right place. Move the cards marked ↻ and try again.`;
      }
    });
    els.reset.addEventListener("click", () => {
      const sceneState = state();
      sceneState.slots.fill(null);
      sceneState.checked = false;
      sceneState.solved = false;
      selected = null;
      renderBoard();
      els.status.textContent = "Scene reset.";
    });

    scenes.forEach(({ title }, index) => {
      els.scene.add(new Option(`${index + 1}. ${title}`, String(index)));
    });
    els.scene.addEventListener("change", () => showScene(Number(els.scene.value)));
    els.prev.addEventListener("click", () => {
      showScene(current - 1);
      els.scene.focus();
    });
    els.next.addEventListener("click", () => {
      showScene(current + 1);
      els.scene.focus();
    });

    showScene(0);
    els.loading.hidden = true;
    els.activity.hidden = false;
  }

  fetch("storyboard/scenes.json?v=1")
    .then((response) => {
      if (!response.ok) throw new Error(`Storyboard request failed (${response.status})`);
      return response.json();
    })
    .then(init)
    .catch(() => { els.loading.textContent = "The scenes couldn’t load. Refresh the page to try again."; });
})();
