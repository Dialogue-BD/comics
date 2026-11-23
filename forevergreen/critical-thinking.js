(() => {
  "use strict";

  const root = document.getElementById("critical-thinking");
  const navigation = root.querySelector("nav");
  const article = root.querySelector("article");
  const loading = root.querySelector("[role=status]");
  const mediaFolder = "critical-thinking/";

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function formatTime(seconds) {
    return `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, "0")}`;
  }

  function resourceLink({ label, url }) {
    const link = element("a", label);
    link.href = url;
    if (url.startsWith("https:")) {
      link.target = "_blank";
      link.rel = "noopener";
    }
    return link;
  }

  function makeFrame(frame) {
    const figure = element("figure");
    const image = element("img");
    image.src = frame.file || `${mediaFolder}frame-${frame.time}.jpg`;
    image.alt = frame.alt;
    image.width = 864;
    image.height = 362;
    const caption = element("figcaption", frame.label);
    if (frame.fullSize) {
      const link = element("a", "Enlarge");
      link.href = image.src;
      link.target = "_blank";
      link.rel = "noopener";
      link.setAttribute("aria-label", `Enlarge still: ${frame.label}`);
      caption.append(link);
    }
    caption.append(element("span", formatTime(frame.time)));
    figure.append(image, caption);
    return figure;
  }

  function makeMedia(media) {
    const isVideo = media.kind === "video";
    const item = element("div", "", "thinking-media-item");
    const title = `${media.label} · ${formatTime(media.start)}–${formatTime(media.end)}`;
    const player = element(media.kind);
    player.src = `${mediaFolder}clip-${media.start}.${isVideo ? "mp4" : "mp3"}`;
    player.preload = "none";
    player.controls = true;
    player.setAttribute("aria-label", title);

    if (isVideo) {
      player.playsInline = true;
      player.poster = media.poster;
      player.id = `thinking-clip-${media.start}`;
      player.hidden = true;
      const button = element("button", title, "ghost-btn-sm");
      button.type = "button";
      button.setAttribute("aria-controls", player.id);
      button.setAttribute("aria-expanded", "false");
      button.addEventListener("click", () => {
        const opening = player.hidden;
        player.hidden = !opening;
        button.textContent = opening ? "Close clip" : title;
        button.setAttribute("aria-expanded", String(opening));
        if (opening) {
          player.currentTime = 0;
          player.play().catch(() => {});
        } else {
          player.pause();
        }
      });
      item.append(button, player);
    } else {
      item.append(element("p", title, "thinking-media-label"), player);
    }
    return item;
  }

  function renderAnswer(topic) {
    const details = element("details", "", "thinking-answer");
    const body = element("div", "", "thinking-answer-body");
    if (topic.readings) {
      const list = element("dl", "", "thinking-readings");
      topic.readings.forEach(({ name, text }) => {
        list.append(element("dt", name), element("dd", text));
      });
      body.append(list);
    } else {
      body.append(element("p", topic.answer));
    }
    const followup = element("aside", "", "thinking-followup");
    followup.append(element("h4", "Keep thinking"), element("p", topic.followup));
    body.append(followup);
    if (topic.sources) {
      const sources = element("ul", "", "thinking-sources");
      topic.sources.forEach((source) => {
        const entry = element("li");
        entry.append(resourceLink(source));
        sources.append(entry);
      });
      body.append(sources);
    }
    details.append(element("summary", "Read a sample answer"), body);
    return details;
  }

  function init(topics) {
    const buttons = [];

    function render(topic, moveFocus) {
      article.querySelectorAll("audio, video").forEach((player) => player.pause());
      buttons.forEach((button) => {
        button.setAttribute("aria-pressed", String(button.dataset.topic === topic.id));
      });
      const heading = element("h3", topic.question);
      heading.tabIndex = -1;
      const prompt = element("p", topic.prompt, "thinking-prompt");
      const frames = element("div", "", "thinking-frames");
      frames.append(...topic.frames.map(makeFrame));
      article.replaceChildren(heading, prompt, frames);
      if (topic.media) {
        const media = element("div", "", "thinking-media");
        media.append(...topic.media.map(makeMedia));
        article.append(media);
      }
      if (topic.watch) {
        const link = resourceLink(topic.watch);
        link.className = "ghost-btn-sm thinking-watch";
        article.append(link);
      }
      article.append(renderAnswer(topic));
      if (moveFocus) heading.focus({ preventScroll: true });
    }

    topics.forEach((topic) => {
      const button = element("button", topic.label);
      button.type = "button";
      button.dataset.topic = topic.id;
      button.setAttribute("aria-controls", article.id);
      button.addEventListener("click", () => {
        if (button.getAttribute("aria-pressed") !== "true") render(topic, true);
      });
      navigation.append(button);
      buttons.push(button);
    });

    article.addEventListener("play", (event) => {
      article.querySelectorAll("audio, video").forEach((player) => {
        if (player !== event.target) player.pause();
      });
    }, true);
    render(topics[0], false);
    loading.hidden = true;
    navigation.hidden = false;
    article.hidden = false;
  }

  // Load the discussion material and replay assets only when the student opens the activity.
  const visibility = new MutationObserver(showTopics);
  visibility.observe(root, { attributes: true, attributeFilter: ["hidden"] });
  showTopics();

  function showTopics() {
    if (root.hidden) return;
    visibility.disconnect();
    fetch(`${mediaFolder}topics.json?v=1`)
      .then((response) => {
        if (!response.ok) throw new Error(`Topics request failed (${response.status})`);
        return response.json();
      })
      .then(init)
      .catch(() => { loading.textContent = "The discussion topics couldn’t load. Refresh the page to try again."; });
  }
})();
