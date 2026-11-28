/* Picture This Bangla — "Report a problem" wizard.
 *
 * A step-by-step, bilingual (English / বাংলা) problem report for the card on
 * screen. Everything it shows comes from deck-data.js and audio-index.js, so
 * new cards need no changes here. Reports go to POST /api/ptb/report; if the
 * device is offline they wait in this browser and are sent next time.
 *
 * The deck page exposes window.ptbCurrentCardIndex() and window.ptbPlayItem().
 */
(function () {
  "use strict";
  const DECK = (window.PTB_DECK && window.PTB_DECK.cards) || [];
  const AUDIO = window.PTB_AUDIO || { ids: [], sources: {} };
  const ENDPOINT = "../api/ptb/report";
  const QUEUE_KEY = "ptb-report-queue-v1";
  const PREF_KEY = "ptb-report-reporter-v1";
  const MAX_RECORD_MS = 20000;

  // ---------------------------------------------------------------- strings
  const T = {
    en: {
      button: "Report a problem", title: "Report a problem", card: "Card", close: "Close", back: "Back", next: "Next",
      step: "Step {n} of {t}",
      whoQ: "Who is reporting?", whoNative: "I speak Bangla as my first language", whoLearner: "I am learning Bangla",
      nameLabel: "Your name (optional)", namePh: "So we can ask you if we have a question",
      partQ: "Which part of this card has the problem?", partPicture: "A picture", partTitle: "The card's title",
      partQuestion: "A question on the back", partCard: "The whole card / something else",
      pickPicture: "Tap the picture with the problem.", pickQuestion: "Tap the question with the problem.",
      problemQ: "What is the problem?",
      c_pronunciation: "The recording doesn't sound right", c_spelling: "The word is spelled wrong",
      c_wrongWord: "The word doesn't match the picture", c_uncommon: "The word is correct, but people don't usually say it",
      c_better: "I know a better or more common word", c_english: "The English meaning is wrong",
      c_picture: "The picture is wrong or strange", c_qUnclear: "The question doesn't make sense",
      c_qGrammar: "Spelling or grammar mistake in the question", c_qUnnatural: "People wouldn't say it this way",
      c_qHard: "Too hard for beginners", c_qSensitive: "It could upset or offend someone",
      c_title: "The title is wrong or unnatural", c_titleSpelling: "The title is spelled wrong", c_other: "Something else",
      detailsQ: "Tell us more",
      listen: "Play the recording", whatWrongSound: "What sounds wrong? (tick any)",
      s_endVowel: "A sound is missing at the end (e.g. a final ও)", s_extraVowel: "An extra sound in the middle",
      s_rr: "ড় or ঢ় sounds like ড or ঢ", s_vowel: "A vowel sounds wrong", s_consonant: "A consonant sounds wrong",
      s_stress: "The rhythm or stress is wrong", s_robotic: "It sounds robotic, cut off or noisy", s_differentWord: "It says a different word",
      howShouldSound: "How should it sound? Write it the way it is said (optional)",
      recordYours: "Record how you would say it (optional)", recStart: "● Record", recStop: "■ Stop", recAgain: "Record again",
      recPlay: "Play your recording", recNoMic: "This device can't record here. You can still send the report.",
      correctSpelling: "Correct spelling", correctWord: "The word it should be", betterWord: "Your suggested word",
      whereUsed: "Where is your word used?", u_everyday: "Everyday speech in Bangladesh", u_formal: "Formal or written Bangla",
      u_regional: "One region or district", u_family: "In families / with children", regionPh: "Which region? (optional)",
      correctEnglish: "The correct English meaning",
      whatWrongPicture: "What is wrong with the picture? (tick any)",
      p_differentObject: "It shows a different thing", p_strange: "Strange details (hands, faces, extra parts, odd text)",
      p_notBd: "It doesn't look like it does in Bangladesh", p_culture: "It isn't culturally appropriate",
      p_hard: "It's hard to recognise", p_mismatch: "It doesn't match the word",
      betterQuestion: "A better way to ask it (optional)", describe: "Describe the problem", anythingElse: "Anything else? (optional)",
      describePh: "Write in English or Bangla", required: "Please fill this in.", pickOne: "Please choose one.",
      reviewQ: "Check and send", reviewPart: "Part", reviewProblem: "Problem", reviewDetails: "Details", reviewSuggest: "Suggestion",
      reviewRecording: "Voice recording attached", send: "Send report", sending: "Sending…",
      thanks: "Thank you! Report #{id} was sent.", thanksQueued: "You seem to be offline. The report is saved on this device and will be sent next time you open the deck.",
      sendFailed: "The report couldn't be sent: {e}", another: "Report another problem", queuedSent: "{n} saved report(s) sent.",
      noAudio: "(no recording yet)", picture: "Picture", question: "Question", titlePart: "Title", wholeCard: "Whole card",
    },
    bn: {
      button: "সমস্যা জানান", title: "সমস্যা জানান", card: "কার্ড", close: "বন্ধ করুন", back: "পেছনে", next: "পরের ধাপ",
      step: "ধাপ {n} / {t}",
      whoQ: "কে জানাচ্ছেন?", whoNative: "বাংলা আমার মাতৃভাষা", whoLearner: "আমি বাংলা শিখছি",
      nameLabel: "আপনার নাম (না দিলেও চলবে)", namePh: "কিছু জানার দরকার হলে যেন আপনাকে জিজ্ঞেস করতে পারি",
      partQ: "কার্ডের কোন অংশে সমস্যা?", partPicture: "একটা ছবি", partTitle: "কার্ডের শিরোনাম",
      partQuestion: "পেছনের একটা প্রশ্ন", partCard: "পুরো কার্ড / অন্য কিছু",
      pickPicture: "যে ছবিতে সমস্যা, সেটায় চাপ দিন।", pickQuestion: "যে প্রশ্নে সমস্যা, সেটায় চাপ দিন।",
      problemQ: "সমস্যাটা কী?",
      c_pronunciation: "রেকর্ডিংয়ের উচ্চারণ ঠিক নেই", c_spelling: "শব্দের বানান ভুল",
      c_wrongWord: "শব্দটা ছবির সাথে মেলে না", c_uncommon: "শব্দটা ঠিক, কিন্তু মানুষ সাধারণত এভাবে বলে না",
      c_better: "আমি এর চেয়ে ভালো বা বেশি চলতি শব্দ জানি", c_english: "ইংরেজি অর্থ ভুল",
      c_picture: "ছবিটা ভুল বা অদ্ভুত", c_qUnclear: "প্রশ্নটার মানে বোঝা যায় না",
      c_qGrammar: "প্রশ্নে বানান বা ব্যাকরণের ভুল", c_qUnnatural: "মানুষ এভাবে বলে না",
      c_qHard: "নতুন শিক্ষার্থীদের জন্য খুব কঠিন", c_qSensitive: "কেউ কষ্ট পেতে বা অসন্তুষ্ট হতে পারেন",
      c_title: "শিরোনাম ভুল বা অস্বাভাবিক", c_titleSpelling: "শিরোনামের বানান ভুল", c_other: "অন্য কিছু",
      detailsQ: "আরেকটু বলুন",
      listen: "রেকর্ডিংটা শুনুন", whatWrongSound: "কোথায় ভুল শোনাচ্ছে? (যতগুলো খাটে, টিক দিন)",
      s_endVowel: "শেষে একটা ধ্বনি বাদ পড়েছে (যেমন শেষের ও)", s_extraVowel: "মাঝখানে বাড়তি একটা ধ্বনি এসেছে",
      s_rr: "ড় বা ঢ় শুনতে ড বা ঢ-এর মতো লাগছে", s_vowel: "একটা স্বরধ্বনি ভুল", s_consonant: "একটা ব্যঞ্জনধ্বনি ভুল",
      s_stress: "ছন্দ বা জোর ভুল জায়গায়", s_robotic: "যান্ত্রিক, কাটা কাটা বা অস্পষ্ট শোনাচ্ছে", s_differentWord: "অন্য একটা শব্দ বলছে",
      howShouldSound: "কীভাবে বলা উচিত? যেভাবে উচ্চারণ হয়, সেভাবে লিখুন (না দিলেও চলবে)",
      recordYours: "আপনি নিজে কীভাবে বলেন, রেকর্ড করুন (না দিলেও চলবে)", recStart: "● রেকর্ড", recStop: "■ থামান", recAgain: "আবার রেকর্ড করুন",
      recPlay: "আপনার রেকর্ডিং শুনুন", recNoMic: "এই ডিভাইসে এখানে রেকর্ড করা যাচ্ছে না। তবু রিপোর্টটা পাঠাতে পারবেন।",
      correctSpelling: "সঠিক বানান", correctWord: "যে শব্দটা হওয়া উচিত", betterWord: "আপনার প্রস্তাবিত শব্দ",
      whereUsed: "আপনার শব্দটা কোথায় চলে?", u_everyday: "বাংলাদেশে প্রতিদিনের কথাবার্তায়", u_formal: "আনুষ্ঠানিক বা লেখার ভাষায়",
      u_regional: "কোনো একটা অঞ্চল বা জেলায়", u_family: "পরিবারে / বাচ্চাদের সাথে", regionPh: "কোন অঞ্চল? (না দিলেও চলবে)",
      correctEnglish: "সঠিক ইংরেজি অর্থ",
      whatWrongPicture: "ছবিতে কী সমস্যা? (যতগুলো খাটে, টিক দিন)",
      p_differentObject: "অন্য একটা জিনিস দেখাচ্ছে", p_strange: "অদ্ভুত কিছু আছে (হাত, মুখ, বাড়তি অংশ, অদ্ভুত লেখা)",
      p_notBd: "বাংলাদেশে জিনিসটা এমন দেখতে না", p_culture: "সাংস্কৃতিকভাবে মানানসই না",
      p_hard: "চেনা কঠিন", p_mismatch: "শব্দের সাথে মেলে না",
      betterQuestion: "আরও ভালোভাবে প্রশ্নটা কীভাবে করা যায় (না দিলেও চলবে)", describe: "সমস্যাটা লিখুন", anythingElse: "আর কিছু? (না দিলেও চলবে)",
      describePh: "বাংলা বা ইংরেজিতে লিখুন", required: "এটা লিখতে হবে।", pickOne: "একটা বেছে নিন।",
      reviewQ: "দেখে নিয়ে পাঠান", reviewPart: "অংশ", reviewProblem: "সমস্যা", reviewDetails: "বিস্তারিত", reviewSuggest: "প্রস্তাব",
      reviewRecording: "কণ্ঠের রেকর্ডিং যুক্ত আছে", send: "রিপোর্ট পাঠান", sending: "পাঠানো হচ্ছে…",
      thanks: "ধন্যবাদ! রিপোর্ট নম্বর {id} পাঠানো হয়েছে।", thanksQueued: "মনে হচ্ছে ইন্টারনেট নেই। রিপোর্টটা এই ডিভাইসে রাখা হয়েছে, পরের বার ডেক খুললে পাঠানো হবে।",
      sendFailed: "রিপোর্টটা পাঠানো যায়নি: {e}", another: "আরেকটা সমস্যা জানান", queuedSent: "রাখা {n}টি রিপোর্ট পাঠানো হয়েছে।",
      noAudio: "(এখনও রেকর্ডিং নেই)", picture: "ছবি", question: "প্রশ্ন", titlePart: "শিরোনাম", wholeCard: "পুরো কার্ড",
    },
  };

  // problem types per card part: [category code sent to the server, string key]
  const PROBLEMS = {
    item: [["pronunciation", "c_pronunciation"], ["spelling", "c_spelling"], ["wrong-word", "c_wrongWord"],
           ["uncommon-word", "c_uncommon"], ["better-word", "c_better"], ["picture", "c_picture"],
           ["english-meaning", "c_english"], ["other", "c_other"]],
    question: [["question-unclear", "c_qUnclear"], ["question-grammar", "c_qGrammar"], ["question-unnatural", "c_qUnnatural"],
               ["question-too-hard", "c_qHard"], ["question-sensitive", "c_qSensitive"], ["other", "c_other"]],
    title: [["title", "c_title"], ["spelling", "c_titleSpelling"], ["other", "c_other"]],
    card: [["picture", "c_picture"], ["other", "c_other"]],
  };
  const SOUND_FAULTS = ["s_endVowel", "s_extraVowel", "s_rr", "s_vowel", "s_consonant", "s_stress", "s_robotic", "s_differentWord"];
  const PICTURE_FAULTS = ["p_differentObject", "p_strange", "p_notBd", "p_culture", "p_hard", "p_mismatch"];
  const USAGE = ["u_everyday", "u_formal", "u_regional", "u_family"];

  // ------------------------------------------------------------------ state
  let lang = "en";
  try { lang = (JSON.parse(localStorage.getItem(PREF_KEY) || "{}").ui) || (navigator.language || "").startsWith("bn") && "bn" || "en"; } catch (_) {}
  let s = null;            // the report being built
  let step = 0;
  let recorder = null, recChunks = [], recTimer = null;
  const t = (key, vars) => {
    let str = (T[lang] && T[lang][key]) || T.en[key] || key;
    if (vars) Object.keys(vars).forEach(k => { str = str.replace("{" + k + "}", vars[k]); });
    return str;
  };
  const el = (tag, attrs, ...kids) => {
    const node = document.createElement(tag);
    Object.entries(attrs || {}).forEach(([k, v]) => {
      if (v == null || v === false) return;
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v === true ? "" : v);
    });
    kids.flat().forEach(kid => kid != null && node.append(kid.nodeType ? kid : document.createTextNode(kid)));
    return node;
  };

  function currentCard() {
    const index = typeof window.ptbCurrentCardIndex === "function" ? window.ptbCurrentCardIndex() : 0;
    return DECK[index] || DECK[0];
  }
  function hasAudio(item) { return item && (AUDIO.ids || []).includes(item.id); }
  function audioSource(item) { return (item && AUDIO.sources && AUDIO.sources[item.id]) || ""; }

  function freshReport() {
    let reporter = {};
    try { reporter = JSON.parse(localStorage.getItem(PREF_KEY) || "{}"); } catch (_) {}
    const card = currentCard();
    return {
      card, role: reporter.role || "", name: reporter.name || "",
      kind: "", index: -1, category: "", faults: [], usage: [], region: "",
      suggestion: "", description: "", extra: "", audioBlob: null, audioMime: "",
    };
  }

  // ------------------------------------------------------------------- shell
  const style = el("style", { text: `
    .ptbr-backdrop{position:fixed;inset:0;z-index:2147483000;background:rgba(15,23,42,.48);display:flex;align-items:center;justify-content:center;padding:12px}
    .ptbr-backdrop[hidden]{display:none}
    .ptbr{width:min(640px,100%);max-height:calc(100dvh - 24px);overflow:auto;background:var(--surface);color:var(--ink);border:1px solid var(--border);
      border-radius:20px;box-shadow:0 24px 60px rgba(0,0,0,.45);font-size:15px;line-height:1.45}
    .ptbr *{box-sizing:border-box}
    .ptbr :focus-visible{outline:2px solid var(--primary);outline-offset:2px}
    .ptbr-head{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:10px;padding:14px 16px;background:var(--surface);border-bottom:1px solid var(--border)}
    .ptbr-head h2{margin:0;font-size:1.05rem;flex:1;min-width:0}
    .ptbr-head .ptbr-sub{display:block;font-size:.72rem;font-weight:700;color:var(--primary);letter-spacing:.04em}
    .ptbr-lang{display:flex;border:1px solid var(--border);border-radius:999px;overflow:hidden}
    .ptbr-lang button{border:0;background:transparent;color:var(--ink);padding:6px 11px;font:inherit;font-size:.8rem;font-weight:800;cursor:pointer}
    .ptbr-lang button[aria-pressed="true"]{background:var(--sky-soft);color:var(--ink)}
    .ptbr-x{border:0;background:var(--surface-soft);color:var(--ink);width:34px;height:34px;border-radius:50%;font-size:1.2rem;cursor:pointer}
    .ptbr-body{padding:16px}
    .ptbr-body h3{margin:0 0 12px;font-size:1.15rem}
    .ptbr-bn{font-family:"Noto Sans Bengali","Kohinoor Bangla","Hind Siliguri",system-ui,sans-serif}
    .ptbr-opts{display:grid;gap:8px}
    .ptbr-opt{display:flex;align-items:center;gap:10px;width:100%;text-align:left;padding:12px 14px;border:1px solid var(--border);border-radius:14px;
      background:var(--surface-soft);color:inherit;font:inherit;cursor:pointer}
    .ptbr-opt:hover{border-color:var(--sky-soft)}.ptbr-opt[aria-pressed="true"]{background:var(--sky-soft);border-color:var(--primary)}
    .ptbr-opt input{width:18px;height:18px;accent-color:var(--primary);flex:none}
    .ptbr-tiles{display:grid;grid-template-columns:repeat(3,1fr);gap:8px}
    .ptbr-tile{position:relative;aspect-ratio:1;border:2px solid var(--border);border-radius:14px;overflow:hidden;background:#fff;cursor:pointer;padding:0}
    .ptbr-tile[aria-pressed="true"]{border-color:var(--primary);box-shadow:0 0 0 3px var(--sky-border)}
    .ptbr-tile i{position:absolute;inset:0;background-repeat:no-repeat;background-size:208.334% 416.667%}
    .ptbr-tile b{position:absolute;left:5px;right:5px;bottom:5px;padding:3px 4px;border-radius:8px;background:var(--glass);color:var(--ink);font-size:.82rem;text-align:center}
    .ptbr-field{display:block;margin:14px 0 6px;font-weight:700}
    .ptbr input[type=text],.ptbr textarea{width:100%;padding:11px 12px;border-radius:12px;border:1px solid var(--border);background:var(--surface);color:var(--ink);font:inherit;font-size:1rem}
    .ptbr textarea{min-height:80px;resize:vertical}
    .ptbr-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:8px 0}
    .ptbr-btn{border:1px solid var(--border);background:var(--surface-soft);color:var(--ink);padding:10px 14px;border-radius:12px;font:inherit;font-weight:800;cursor:pointer}
    .ptbr-btn.primary{background:var(--primary);color:#fff;border-color:transparent}.ptbr-btn[disabled]{opacity:.5;cursor:default}
    .ptbr-btn.rec{background:#fff1f2;border-color:#fda4af;color:#9f1239}
    .ptbr-foot{position:sticky;bottom:0;display:flex;gap:8px;justify-content:space-between;padding:12px 16px;background:var(--surface);border-top:1px solid var(--border)}
    .ptbr-err{min-height:1.2em;margin:8px 0 0;color:#9f1239;font-weight:700}
    .ptbr-note{margin:6px 0;color:var(--muted);font-size:.86rem}
    .ptbr-review{display:grid;grid-template-columns:auto 1fr;gap:6px 12px;margin:0}
    .ptbr-review dt{color:var(--primary);font-weight:800}.ptbr-review dd{margin:0}
    .ptbr-q{white-space:normal}
    #ptb-report-button{white-space:nowrap}
    @media (max-width:520px){.ptbr-backdrop{padding:0;align-items:stretch}.ptbr{border-radius:0;max-height:100dvh;height:100dvh;display:flex;flex-direction:column}.ptbr-body{flex:1}.ptbr-head{flex-wrap:wrap;justify-content:flex-end}.ptbr-head h2{order:3;flex-basis:100%}}
  ` });
  const backdrop = el("div", { class: "ptbr-backdrop", hidden: true, role: "dialog", "aria-modal": "true", "aria-labelledby": "ptbr-title" });
  const panel = el("div", { class: "ptbr" });
  backdrop.append(panel);
  backdrop.addEventListener("click", e => { if (e.target === backdrop) close(); });
  document.addEventListener("keydown", e => { if (e.key === "Escape" && !backdrop.hidden) close(); });

  // which steps apply to this report
  function steps() {
    const list = ["who", "part"];
    if (s.kind === "item" || s.kind === "question") list.push("pick");
    list.push("problem", "details", "review");
    return list;
  }

  function render(errorText) {
    const list = steps();
    const name = list[step];
    panel.replaceChildren();
    const langToggle = el("div", { class: "ptbr-lang", role: "group", "aria-label": "Language / ভাষা" },
      el("button", { type: "button", "aria-pressed": String(lang === "en"), onclick: () => setLang("en") }, "English"),
      el("button", { type: "button", "aria-pressed": String(lang === "bn"), class: "ptbr-bn", onclick: () => setLang("bn") }, "বাংলা"));
    panel.append(el("div", { class: "ptbr-head" },
      el("h2", { id: "ptbr-title" }, el("span", { class: "ptbr-sub" }, `${t("card")} ${s.card.number} · ${t("step", { n: step + 1, t: list.length })}`),
        el("span", { class: "ptbr-bn" }, s.card.title)),
      langToggle,
      el("button", { type: "button", class: "ptbr-x", "aria-label": t("close"), onclick: close }, "×")));
    const body = el("div", { class: "ptbr-body" + (lang === "bn" ? " ptbr-bn" : "") });
    panel.append(body);
    ({ who: renderWho, part: renderPart, pick: renderPick, problem: renderProblem, details: renderDetails, review: renderReview, done: () => {} }[name] || (() => {}))(body);
    body.append(el("p", { class: "ptbr-err", role: "alert" }, errorText || ""));
    if (name !== "done") {
      panel.append(el("div", { class: "ptbr-foot" },
        el("button", { type: "button", class: "ptbr-btn", disabled: step === 0, onclick: () => go(-1) }, t("back")),
        name === "review"
          ? el("button", { type: "button", class: "ptbr-btn primary", id: "ptbr-send", onclick: send }, t("send"))
          : el("button", { type: "button", class: "ptbr-btn primary", onclick: () => go(1) }, t("next"))));
    }
  }

  function option(label, pressed, onclick, extraClass) {
    return el("button", { type: "button", class: "ptbr-opt" + (extraClass ? " " + extraClass : ""), "aria-pressed": String(!!pressed), onclick }, label);
  }
  function checkbox(label, checked, onchange) {
    const input = el("input", { type: "checkbox" }); input.checked = !!checked;
    input.addEventListener("change", () => onchange(input.checked));
    return el("label", { class: "ptbr-opt" }, input, el("span", {}, label));
  }
  function textField(labelKey, value, oninput, opts = {}) {
    const id = "ptbr-" + labelKey;
    const field = opts.multiline
      ? el("textarea", { id, lang: "bn", placeholder: opts.placeholder || t("describePh") })
      : el("input", { id, type: "text", lang: "bn", placeholder: opts.placeholder || "" });
    field.value = value || "";
    field.addEventListener("input", () => oninput(field.value));
    return [el("label", { class: "ptbr-field", for: id }, t(labelKey)), field];
  }
  function tileFor(item, index, pressed, onclick) {
    const x = index % 2 === 0 ? "1.923%" : "98.077%";
    const y = ["10.526%", "42.105%", "73.684%"][Math.floor(index / 2)];
    const img = el("i", {}); img.style.backgroundImage = `url("${s.card.front}")`; img.style.backgroundPosition = `${x} ${y}`;
    return el("button", { type: "button", class: "ptbr-tile", "aria-pressed": String(!!pressed), "aria-label": item.label, onclick },
      img, el("b", { class: "ptbr-bn" }, item.label));
  }

  function renderWho(body) {
    body.append(el("h3", {}, t("whoQ")), el("div", { class: "ptbr-opts" },
      option(t("whoNative"), s.role === "bangla-speaker", () => { s.role = "bangla-speaker"; render(); }),
      option(t("whoLearner"), s.role === "learner", () => { s.role = "learner"; render(); })),
      ...textField("nameLabel", s.name, v => { s.name = v; }, { placeholder: t("namePh") }));
  }

  function renderPart(body) {
    const pick = kind => () => { if (s.kind !== kind) { s.kind = kind; s.index = -1; s.category = ""; } render(); };
    body.append(el("h3", {}, t("partQ")), el("div", { class: "ptbr-opts" },
      option(t("partPicture"), s.kind === "item", pick("item")),
      option(t("partTitle"), s.kind === "title", pick("title")),
      (s.card.questions || []).length ? option(t("partQuestion"), s.kind === "question", pick("question")) : null,
      option(t("partCard"), s.kind === "card", pick("card"))));
  }

  function renderPick(body) {
    if (s.kind === "item") {
      body.append(el("h3", {}, t("pickPicture")), el("div", { class: "ptbr-tiles" },
        s.card.items.map((item, i) => tileFor(item, i, s.index === i, () => { s.index = i; render(); }))));
    } else {
      body.append(el("h3", {}, t("pickQuestion")), el("div", { class: "ptbr-opts" },
        (s.card.questions || []).map((q, i) => option(`${i + 1}. ${q}`, s.index === i, () => { s.index = i; render(); }, "ptbr-bn ptbr-q"))));
    }
  }

  function renderProblem(body) {
    let choices = PROBLEMS[s.kind] || PROBLEMS.card;
    if (s.kind === "item" && !hasAudio(s.card.items[s.index])) choices = choices.filter(c => c[0] !== "pronunciation");
    body.append(el("h3", {}, t("problemQ")));
    if (s.kind === "item") {
      const item = s.card.items[s.index];
      body.append(el("p", { class: "ptbr-note" }, el("b", { class: "ptbr-bn" }, item.label), ` — ${item.gloss}`));
    }
    body.append(el("div", { class: "ptbr-opts" },
      choices.map(([code, key]) => option(t(key), s.category === code, () => { s.category = code; s.faults = []; render(); }))));
  }

  function renderDetails(body) {
    const item = s.kind === "item" ? s.card.items[s.index] : null;
    body.append(el("h3", {}, t("detailsQ")));
    if (item) body.append(el("p", { class: "ptbr-note" }, el("b", { class: "ptbr-bn" }, item.label), ` — ${item.gloss}`));
    if (s.kind === "question") body.append(el("p", { class: "ptbr-note ptbr-bn" }, `${s.index + 1}. ${s.card.questions[s.index]}`));
    const toggle = (list, key) => on => { const i = s[list].indexOf(key); if (on && i < 0) s[list].push(key); if (!on && i >= 0) s[list].splice(i, 1); };
    switch (s.category) {
      case "pronunciation":
        body.append(el("div", { class: "ptbr-row" },
          el("button", { type: "button", class: "ptbr-btn", onclick: () => window.ptbPlayItem && window.ptbPlayItem(s.card.id, s.index) }, "🔊 " + t("listen"))),
          el("label", { class: "ptbr-field" }, t("whatWrongSound")),
          el("div", { class: "ptbr-opts" }, SOUND_FAULTS.map(k => checkbox(t(k), s.faults.includes(k), toggle("faults", k)))),
          ...textField("howShouldSound", s.suggestion, v => { s.suggestion = v; }),
          recorderBlock());
        break;
      case "spelling":
        body.append(...textField("correctSpelling", s.suggestion, v => { s.suggestion = v; }));
        break;
      case "wrong-word":
      case "uncommon-word":
      case "better-word":
        body.append(...textField(s.category === "better-word" ? "betterWord" : "correctWord", s.suggestion, v => { s.suggestion = v; }),
          el("label", { class: "ptbr-field" }, t("whereUsed")),
          el("div", { class: "ptbr-opts" }, USAGE.map(k => checkbox(t(k), s.usage.includes(k), toggle("usage", k)))),
          ...textField("regionPh", s.region, v => { s.region = v; }, { placeholder: t("regionPh") }),
          recorderBlock());
        break;
      case "english-meaning":
        body.append(...textField("correctEnglish", s.suggestion, v => { s.suggestion = v; }, { placeholder: "" }));
        break;
      case "picture":
        body.append(el("label", { class: "ptbr-field" }, t("whatWrongPicture")),
          el("div", { class: "ptbr-opts" }, PICTURE_FAULTS.map(k => checkbox(t(k), s.faults.includes(k), toggle("faults", k)))));
        break;
      case "question-unclear": case "question-grammar": case "question-unnatural":
      case "question-too-hard": case "question-sensitive":
        body.append(...textField("betterQuestion", s.suggestion, v => { s.suggestion = v; }, { multiline: true }));
        break;
      case "title":
        body.append(...textField("correctWord", s.suggestion, v => { s.suggestion = v; }));
        break;
    }
    const mustDescribe = s.category === "other" || s.kind === "card";
    body.append(...textField(mustDescribe ? "describe" : "anythingElse", s.description, v => { s.description = v; }, { multiline: true }));
  }

  function recorderBlock() {
    const wrap = el("div", {});
    wrap.append(el("label", { class: "ptbr-field" }, t("recordYours")));
    if (!(navigator.mediaDevices && window.MediaRecorder)) {
      wrap.append(el("p", { class: "ptbr-note" }, t("recNoMic")));
      return wrap;
    }
    const row = el("div", { class: "ptbr-row" });
    const recording = !!recorder;
    row.append(el("button", { type: "button", class: "ptbr-btn" + (recording ? " rec" : ""), onclick: recording ? stopRecording : startRecording },
      recording ? t("recStop") : (s.audioBlob ? t("recAgain") : t("recStart"))));
    if (s.audioBlob && !recording) {
      row.append(el("button", { type: "button", class: "ptbr-btn", onclick: () => new Audio(URL.createObjectURL(s.audioBlob)).play() }, "▶ " + t("recPlay")));
    }
    wrap.append(row);
    return wrap;
  }

  async function startRecording() {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = ["audio/webm;codecs=opus", "audio/mp4", "audio/ogg;codecs=opus", "audio/webm"].find(m => MediaRecorder.isTypeSupported && MediaRecorder.isTypeSupported(m)) || "";
      recorder = new MediaRecorder(stream, mime ? { mimeType: mime } : undefined);
      recChunks = [];
      recorder.ondataavailable = e => e.data.size && recChunks.push(e.data);
      recorder.onstop = () => {
        stream.getTracks().forEach(track => track.stop());
        s.audioMime = (recorder.mimeType || mime || "audio/webm");
        s.audioBlob = new Blob(recChunks, { type: s.audioMime });
        recorder = null; clearTimeout(recTimer); render();
      };
      recorder.start();
      recTimer = setTimeout(stopRecording, MAX_RECORD_MS);
      render();
    } catch (_) {
      recorder = null; render(t("recNoMic"));
    }
  }
  function stopRecording() { if (recorder && recorder.state !== "inactive") recorder.stop(); }

  function partLabel() {
    if (s.kind === "item") return `${t("picture")} ${s.index + 1}: ${s.card.items[s.index].label} (${s.card.items[s.index].gloss})`;
    if (s.kind === "question") return `${t("question")} ${s.index + 1}: ${s.card.questions[s.index]}`;
    if (s.kind === "title") return `${t("titlePart")}: ${s.card.title}`;
    return t("wholeCard");
  }
  function problemLabel() {
    const found = (PROBLEMS[s.kind] || []).find(c => c[0] === s.category);
    return found ? t(found[1]) : s.category;
  }

  function renderReview(body) {
    const details = [...s.faults, ...s.usage].map(k => t(k));
    if (s.region) details.push(s.region);
    body.append(el("h3", {}, t("reviewQ")), el("dl", { class: "ptbr-review" },
      el("dt", {}, t("reviewPart")), el("dd", { class: "ptbr-bn" }, partLabel()),
      el("dt", {}, t("reviewProblem")), el("dd", {}, problemLabel()),
      details.length ? [el("dt", {}, t("reviewDetails")), el("dd", {}, details.join(" · "))] : null,
      s.suggestion ? [el("dt", {}, t("reviewSuggest")), el("dd", { class: "ptbr-bn" }, s.suggestion)] : null,
      s.description ? [el("dt", {}, "✎"), el("dd", { class: "ptbr-bn" }, s.description)] : null,
      s.audioBlob ? [el("dt", {}, "🎙"), el("dd", {}, t("reviewRecording"))] : null));
  }

  // ------------------------------------------------------------- navigation
  function validate(name) {
    if (name === "who" && !s.role) return t("pickOne");
    if (name === "part" && !s.kind) return t("pickOne");
    if (name === "pick" && s.index < 0) return t("pickOne");
    if (name === "problem" && !s.category) return t("pickOne");
    if (name === "details") {
      const needsSuggestion = ["spelling", "better-word", "english-meaning"].includes(s.category);
      if (needsSuggestion && !s.suggestion.trim()) return t("required");
      if ((s.category === "other" || s.kind === "card") && !s.description.trim()) return t("required");
      if (["pronunciation", "picture"].includes(s.category) && !s.faults.length && !s.description.trim() && !s.suggestion.trim() && !s.audioBlob) return t("pickOne");
    }
    return "";
  }
  function go(delta) {
    stopRecording();
    const list = steps();
    if (delta > 0) {
      const error = validate(list[step]);
      if (error) { render(error); return; }
      if (list[step] === "who") savePrefs();
    }
    step = Math.max(0, Math.min(steps().length - 1, step + delta));
    render();
  }
  function savePrefs() {
    try { localStorage.setItem(PREF_KEY, JSON.stringify({ role: s.role, name: s.name, ui: lang })); } catch (_) {}
  }
  function setLang(next) { lang = next; savePrefs(); render(); }

  // ------------------------------------------------------------------ send
  function blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result).split(",")[1] || "");
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  }
  async function buildPayload() {
    const item = s.kind === "item" ? s.card.items[s.index] : null;
    const payload = {
      schema: 1,
      card: { number: s.card.number, slug: s.card.id, title: s.card.title },
      target: {
        kind: s.kind, index: s.index >= 0 ? s.index + 1 : null,
        id: item ? item.id : (s.kind === "question" ? `q${s.index + 1}` : s.kind),
        label: item ? item.label : (s.kind === "title" ? s.card.title : ""),
        gloss: item ? item.gloss : "",
        question: s.kind === "question" ? s.card.questions[s.index] : "",
        audio_source: item ? audioSource(item) : "",
      },
      category: s.category,
      details: { faults: s.faults.slice(), usage: s.usage.slice(), region: s.region },
      suggestion: s.suggestion.trim(), description: s.description.trim(),
      reporter: { role: s.role, name: s.name.trim(), ui_language: lang },
      deck: { audio_version: AUDIO.version || "", cards: DECK.length },
      page: location.pathname + location.search, user_agent: navigator.userAgent.slice(0, 200),
      sent_at: new Date().toISOString(),
    };
    if (s.audioBlob) payload.audio = { mime: s.audioMime, data: await blobToBase64(s.audioBlob) };
    return payload;
  }
  async function post(payload) {
    const response = await fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
    let reply = {};
    try { reply = await response.json(); } catch (_) {}
    if (!response.ok) { const err = new Error(reply.error || response.status); err.http = true; throw err; }
    return reply;
  }
  async function send() {
    const button = document.querySelector("#ptbr-send");
    if (button) { button.disabled = true; button.textContent = t("sending"); }
    const payload = await buildPayload();
    try {
      const reply = await post(payload);
      finish(t("thanks", { id: reply.id ?? "" }));
    } catch (err) {
      if (err.http) { render(t("sendFailed", { e: err.message })); return; }
      try {
        const queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]");
        queue.push(payload); localStorage.setItem(QUEUE_KEY, JSON.stringify(queue.slice(-20)));
        finish(t("thanksQueued"));
      } catch (_) { render(t("sendFailed", { e: "offline" })); }
    }
  }
  function finish(message) {
    step = steps().length; // past the end
    panel.replaceChildren(el("div", { class: "ptbr-body" + (lang === "bn" ? " ptbr-bn" : "") },
      el("h3", {}, "✓"), el("p", { role: "status" }, message),
      el("div", { class: "ptbr-row" },
        el("button", { type: "button", class: "ptbr-btn primary", onclick: () => open() }, t("another")),
        el("button", { type: "button", class: "ptbr-btn", onclick: close }, t("close")))));
  }
  async function flushQueue() {
    let queue = [];
    try { queue = JSON.parse(localStorage.getItem(QUEUE_KEY) || "[]"); } catch (_) { return; }
    if (!queue.length || !navigator.onLine) return;
    const left = [];
    for (const payload of queue) {
      try { await post(payload); } catch (err) { if (!err.http) left.push(payload); }
    }
    try { localStorage.setItem(QUEUE_KEY, JSON.stringify(left)); } catch (_) {}
  }

  // ------------------------------------------------------------------ open
  function open() {
    s = freshReport();
    step = s.role ? 1 : 0;
    backdrop.hidden = false;
    render();
    panel.focus?.();
  }
  function close() {
    stopRecording();
    backdrop.hidden = true;
  }

  function init() {
    document.head.append(style);
    document.body.append(backdrop);
    const games = document.querySelector("#game-menu-button");
    const button = el("button", { type: "button", class: "view-toggle", id: "ptb-report-button", title: "Report a problem / সমস্যা জানান",
      "aria-label": "Report a problem with this card / এই কার্ডের সমস্যা জানান", onclick: open },
      el("span", { class: "icon", "aria-hidden": "true" }, "⚑"), el("span", { class: "text" }, T.en.button));
    if (games && games.parentNode) games.parentNode.insertBefore(button, games.nextSibling);
    else document.body.append(button);
    flushQueue();
    window.addEventListener("online", flushQueue);
    window.ptbOpenReport = open;
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init); else init();
})();
