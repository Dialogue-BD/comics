'use strict';

const $ = selector => document.querySelector(selector);
const chooser = $('#chooser');
const deck = $('#deck');
const slide = $('#slide');
const stage = $('.demo-stage');
const visual = $('#visual');
const screen = $('#screen');
const caption = $('#scene-caption');
const jumps = $('#scene-jumps');
const scenePicker = $('#scene-picker');
const chapterJump = $('#chapter-jump');
const gearTrack = $('#gear-track');
const back = $('#back');
const next = $('#next');
const phoneActions = $('#phone-actions');
const effects = $('#effects');
const replay = $('#replay');
const fullscreen = $('#fullscreen');
const missionTabs = document.querySelectorAll('[data-mission-tab]');
const joinAppSentences = parts => parts.join('\n');
let current = null;
let phase = 'scene';
let sounds = true;
let endPlanStream = null;
FX.on = () => sounds;

function go(index) {
  const {id, chapters} = current;
  if (index >= 0 && index < chapters.length) location.hash = index ? id + '/' + (index + 1) : id;
}

function isLastGear() {
  return current.index === current.chapters.length - 2;
}

function updateNext() {
  const {page, index, chapters} = current;
  next.disabled = index === chapters.length - 1 || (!!page.gear && phase === 'scene');
  if (phase === 'result') next.textContent = 'Reveal the gear →';
  else if (next.disabled && page.gear) next.textContent = 'Finish the scene first';
  else if (phase === 'finale') next.textContent = 'Full exercise →';
  else if (phase === 'gear' && isLastGear()) next.textContent = 'Mission finale →';
  else if (phase === 'gear' && chapters[index + 1]?.gear !== page.gear) {
    const upcoming = D4.META[chapters[index + 1]?.gear]?.n;
    next.textContent = upcoming ? `Next: ${upcoming} →` : 'Next chapter →';
  } else next.textContent = 'Next chapter →';
}

function evidenceCard(detail) {
  if (!detail) return '';
  const entries = detail.items.map(([label,text,icon='doc'],index)=>{
    const arrow = detail.flow && index > 0 ? '<span class="evidence-arrow" aria-hidden="true">→</span>' : '';
    return `<div style="--reveal:${index}"><dt>${arrow}${AFL.ico(icon)}${AFL.esc(label)}</dt><dd>${AFL.esc(text)}</dd></div>`;
  }).join('');
  return `<section class="evidence-card${detail.flow?' evidence-flow':''}" aria-label="${AFL.esc(detail.heading)}">
    <h2>${AFL.esc(detail.heading)}</h2><dl>${entries}</dl>
  </section>`;
}

function wordHelp(words) {
  if (!words?.length) return '';
  return `<details class="word-help"><summary>Word help</summary><dl>${words.map(([word,meaning])=>
    `<div><dt>${AFL.esc(word)}</dt><dd>${AFL.esc(meaning)}</dd></div>`).join('')}</dl></details>`;
}

function sceneVisual(icon, label) {
  return `<div class="scene-visual">${AFL.ico(icon)}<strong>${AFL.esc(label)}</strong></div>`;
}

function missionMap(id) {
  return `<ol class="mission-map" aria-label="What we’ll do">${missionMaps[id].map(([icon,label],index)=>
    `<li>${index?'<span class="map-arrow" aria-hidden="true">→</span>':''}
      ${AFL.ico(icon)}<span>${AFL.esc(label)}</span></li>`).join('')}</ol>`;
}

function helpExample(mode) {
  return `<ol class="help-steps" role="list" aria-label="${AFL.esc(mode.title)} example">${mode.steps.map(([icon,action,example],index)=>
    `<li>${index?'<span class="map-arrow" aria-hidden="true">→</span>':''}
      ${AFL.ico(icon)}<strong>${AFL.esc(action)}</strong><span>${AFL.esc(example)}</span></li>`).join('')}</ol>`;
}

function helpComparison() {
  return `<section class="help-comparison" aria-labelledby="help-modes-title">
    <h2 id="help-modes-title">One deadline, three kinds of help</h2>
    <div class="help-switch">${helpModes.map(({title,icon,cue},index)=>
      `<button type="button" data-help-mode="${index}" aria-pressed="${index===0}" aria-controls="help-example">
        ${AFL.ico(icon)}<strong>${AFL.esc(title)}</strong><span>${AFL.esc(cue)}</span></button>`).join('')}</div>
    <div id="help-example" aria-live="polite">${helpExample(helpModes[0])}</div>
  </section>`;
}

function agreedJobsGraphic() {
  return `<section class="agreed-jobs" aria-labelledby="agreed-jobs-title">
    <h2 id="agreed-jobs-title">Jobs agreed</h2>
    <div class="job-split">${agreedJobs.map(([icon,owner,jobs])=>`
      <section>
        <h3>${AFL.ico(icon)}${AFL.esc(owner)}</h3>
        <ul role="list">${jobs.map(([symbol,job])=>`<li>${AFL.ico(symbol)}<span>${AFL.esc(job)}</span></li>`).join('')}</ul>
      </section>`).join('')}</div>
  </section>`;
}

function practiceLine(frame, phrase) {
  if (!phrase) return '';
  const markedFrame = frame?.split('___').map(AFL.esc).join('<span class="say-blank" aria-label="blank">___</span>');
  return `<details class="projector-say">
    <summary>Practise one line in English</summary>
    ${frame ? `<p>${markedFrame}</p><details><summary>Show a model</summary><p>${AFL.esc(phrase)}</p></details>`
      : `<p>${AFL.esc(phrase)}</p>`}
  </details>`;
}

function showGearTrack() {
  const {page, chapters, index} = current;
  const covered = chapters.slice(0,index).map(chapter=>chapter.gear);
  gearTrack.innerHTML = D4.ORDER.map(id=>{
    const {n,v} = D4.META[id];
    const active = page.gear === id;
    const done = phase === 'finale' || covered.includes(id) || (phase === 'gear' && active);
    return `<li class="d-${id}" ${active?'aria-current="step"':''}>
      ${D4.icon(id)}<div><strong>${n}</strong><span>${v}</span></div>${done?'<span class="gear-check" aria-label="Covered">✓</span>':''}</li>`;
  }).join('');
}

function showResult(label) {
  phase = 'result';
  slide.dataset.phase = phase;
  caption.textContent = 'Result · '+label;
  updateNext();
  next.focus({preventScroll:true});
}

const workIcons = {del:'share', des:'send', dis:'search', dil:'shield'};
const promptParts = {
  Context: {icon:'person', cue:'Who and why?'},
  Product: {icon:'doc', cue:'What should it make?'},
  Process: {icon:'steps', cue:'What steps should it follow?'},
  Performance: {icon:'shield', cue:'How should it act?'}
};

function promptPartLabel(label, icon = promptParts[label].icon) {
  return `<span class="prompt-part-name">${AFL.ico(icon)}${AFL.esc(label)}</span>`;
}

function gearWork({gear, outcome, work}) {
  const [action, before, after] = work;
  const card = ([icon, label, detail]) => {
    const content = Array.isArray(detail)
      ? `<ul class="gear-work-parts" role="list">${detail.map(part =>
        `<li class="pp-${AFL.esc(part)}">${promptPartLabel(part)}</li>`).join('')}</ul>`
      : `<strong>${AFL.esc(detail)}</strong>`;
    return `<div class="gear-work-card">
      ${AFL.ico(icon)}
      <span>${AFL.esc(label)}</span>
      ${content}
    </div>`;
  };
  return `
    <figure class="gear-work">
      <div class="gear-work-scene">
        ${card(before)}
        <div class="gear-work-action">${AFL.ico(workIcons[gear])}<b>${AFL.esc(action)}</b></div>
        ${card(after)}
      </div>
      <figcaption class="gear-outcome">${AFL.esc(outcome)}</figcaption>
    </figure>`;
}

function showGear() {
  if (phase !== 'result') return;
  const {page, chapters, index} = current;
  const gear = D4.META[page.gear];
  const used = Object.fromEntries(chapters.slice(0, index + 1)
    .filter(chapter => chapter.gear).map(chapter => [chapter.gear, true]));
  phase = 'gear';
  slide.dataset.phase = phase;
  slide.innerHTML = `
    <div class="lvl projector-level d-${page.gear}">
      <div class="lvl-gear">${D4.svg({loops:true,sweet:true,on:page.gear,used})}</div>
      <h1 id="slide-title" tabindex="-1">${gear.n}</h1>
      ${gearWork(page)}
      ${practiceLine(page.speak,page.phrase)}
    </div>`;
  updateNext();
  showGearTrack();
  FX.gearTurned(slide, page.gear);
  $('#slide-title').focus({preventScroll:true});
}

function showFinale() {
  phase = 'finale';
  slide.dataset.phase = phase;
  slide.innerHTML = `
    <div class="res projector-finale">
      <p class="lvl-k">Mission complete</p>
      <h1 id="slide-title" tabindex="-1">All four gears turned</h1>
      <div class="res-gears">${D4.svg({loops:true,sweet:true,on:'all'})}</div>
      <div class="finale-loops">
        <p><strong>Decide who does what</strong> <span aria-hidden="true">↔</span> Take responsibility</p>
        <p><strong>Give a clear instruction</strong> <span aria-hidden="true">↔</span> Check the result</p>
      </div>
    </div>`;
  updateNext();
  showGearTrack();
  FX.missionDone(slide);
  $('#slide-title').focus({preventScroll:true});
}

function forward() {
  if (next.disabled) return;
  if (sounds) FX.unlock();
  if (phase === 'result') showGear();
  else if (phase === 'gear' && isLastGear()) showFinale();
  else go(current.index + 1);
}

function playStudioPlan() {
  const lines = [...screen.querySelectorAll('[data-mid="plan1"] .think p')];
  const contents = lines.map(line => line.textContent);
  const words = contents.map(text => text.split(' '));
  const scroller = lines[0]?.closest('.scroll');
  let lineIndex = 0;
  let wordIndex = 0;
  let timer;
  for (const line of lines) {
    line.hidden = true;
    line.textContent = '';
  }
  function typeWord() {
    const line = lines[lineIndex];
    if (!line) return;
    line.hidden = false;
    line.classList.add('studio-plan-writing');
    line.textContent += (wordIndex ? ' ' : '') + words[lineIndex][wordIndex++];
    if (scroller) {
      const overflow = line.getBoundingClientRect().bottom - scroller.getBoundingClientRect().bottom + 12;
      if (overflow > 0) scroller.scrollTop += overflow;
    }
    const finishedLine = wordIndex === words[lineIndex].length;
    if (finishedLine) {
      line.classList.remove('studio-plan-writing');
      lineIndex++;
      wordIndex = 0;
    }
    timer = setTimeout(typeWord, finishedLine ? 850 : 370);
  }
  typeWord();
  return () => {
    clearTimeout(timer);
    return {
      lines:lines.map(line => line.textContent).filter(Boolean),
      sawDrift:lines.some(line => line.dataset.planDrift && line.textContent.includes(line.dataset.planDrift))
    };
  };
}

function setActions(page, scene, index, filled) {
  const actions = (scene.fill || scene.assign) && !filled
    ? [{label:scene.assign ? 'Assign the jobs' : 'Fill in the message', to:'fill'}]
    : scene.actions || (index < page.frames.length - 1 ? [{label:page.frames[index + 1].label}] : []);
  phoneActions.replaceChildren();
  const active = [];
  for (const action of actions) {
    let control = action.selector && screen.querySelector(action.selector);
    if (!control || control.disabled) {
      control = document.createElement('button');
      control.type = 'button';
      control.textContent = action.label;
      phoneActions.append(control);
    } else if (!control.matches('button')) {
      control.setAttribute('role', 'button');
      control.addEventListener('keydown', event => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault();
          control.click();
        }
      });
    }
    control.classList.add('projector-action');
    control.setAttribute('aria-label', action.label);
    control.tabIndex = 0;
    control.addEventListener('click', event => {
      event.preventDefault();
      if (sounds) FX.unlock();
      if (scene.buildPrompt && current.prompt.key === 'desc' && current.prompt.ready) {
        current.sentBrief = joinAppSentences(current.prompt.completed);
      }
      if (scene.streamPlan) {
        current.stoppedPlan = endPlanStream?.();
        endPlanStream = null;
      }
      if (action.to === 'celebrate') {
        phoneActions.replaceChildren();
        phoneActions.hidden = true;
        showResult(scene.label);
      }
      else if (action.to === 'fill') {
        const animateJobs = scene.assign && matchMedia('(prefers-reduced-motion: no-preference)').matches;
        const before = animateJobs && new Map([...screen.querySelectorAll('[data-demo-job]')].map(tile=>
          [tile.dataset.demoJob, tile.getBoundingClientRect()]));
        showFrame(index, {filled:true, focus:true});
        if (before) animateJobAssignments(before);
      }
      else showFrame(action.to ?? index + 1, {focus:true});
    });
    active.push(control);
  }
  phoneActions.hidden = !phoneActions.childElementCount;
  return active;
}

function animateJobAssignments(before) {
  for (const tile of screen.querySelectorAll('[data-demo-job]')) {
    const origin = before.get(tile.dataset.demoJob);
    if (!origin) continue;
    const destination = tile.getBoundingClientRect();
    tile.animate([
      {transform:`translate(${origin.left - destination.left}px, ${origin.top - destination.top}px)`},
      {transform:'translate(0, 0)'}
    ], {duration:460, delay:Number(tile.dataset.demoJob)*55, easing:'ease-out', fill:'backwards'});
  }
}

function showPromptBuilder({key,parts}, frameIndex, scene) {
  const rules = key === 'rules';
  const appBrief = key === 'desc';
  const bugReport = key === 'bug';
  const buildVisuals = appBrief ? AFL.LESSONS.build.appBriefVisuals : bugReport ? AFL.LESSONS.build.bugReportVisuals : null;
  const visuals = rules ? AFL.LESSONS.agent.ruleVisuals : buildVisuals || promptParts;
  const groupLabel = rules ? 'Agent rules' : appBrief ? 'App prompt parts' : bugReport ? 'Bug report parts' : 'Prompt parts';
  const readyTitle = rules ? 'Orbit’s rules are ready' : appBrief ? 'The app brief is ready' : bugReport ? 'The bug report is ready' : 'All four parts are ready';
  const partClass = label => rules ? 'projector-rule' : buildVisuals ? 'projector-app-part' : 'pp-'+label;
  const panel = document.createElement('section');
  panel.className = 'projector-builder';
  if (rules) panel.dataset.rules = '';
  if (appBrief) panel.dataset.appBrief = '';
  if (bugReport) panel.dataset.bugReport = '';
  panel.setAttribute('aria-label', groupLabel);
  slide.append(panel);
  const state = current.prompt;
  state.key = key;
  const labels = [...new Set(parts.map(part=>part.tag))];
  const textarea = screen.querySelector('#cmp');
  const promptBox = document.createElement('div');
  promptBox.className = 'projector-prompt-text';
  promptBox.setAttribute('role', 'region');
  promptBox.setAttribute('aria-label', rules ? 'Orbit’s rules' : bugReport ? 'Ayesha’s bug report' : 'Ayesha’s prompt');
  promptBox.tabIndex = 0;
  textarea?.replaceWith(promptBox);
  const send = screen.querySelector('[data-hit="send"]');

  function draw(focus = false) {
    const {completed, picked} = state;
    const part = parts[completed.length];
    const done = !part;
    const markedParts = labels.flatMap(label=>{
      const text = completed.filter((_,index)=>parts[index].tag===label).join(' ');
      return text ? [{label, html:`<mark class="${partClass(label)}">${AFL.esc(text)}</mark>`}] : [];
    });
    promptBox.innerHTML = markedParts.length
      ? markedParts.map(({label,html})=>`<p><span class="projector-part-heading ${partClass(label)}">
        ${promptPartLabel(label, visuals[label].icon)}</span>${html}</p>`).join('')
      : `<p class="projector-prompt-placeholder">${AFL.esc(textarea?.placeholder || 'Ask Sathi AI')}</p>`;
    promptBox.scrollTop = done ? 0 : promptBox.scrollHeight;
    if (send) send.disabled = !done;
    const progress = labels.map(label=>{
      const ready = parts.every((item,index)=>item.tag!==label||index<completed.length);
      const active = part?.tag === label;
      const {icon, cue} = visuals[label];
      return `<li class="${partClass(label)}" ${active?'aria-current="step"':''} ${ready?'data-complete':''}>
        ${promptPartLabel(label, icon)}<span class="prompt-part-cue">${AFL.esc(cue)}</span>
        ${ready?'<span class="prompt-part-status" role="img" aria-label="Complete">✓</span>':''}</li>`;
    }).join('');
    if (done) {
      state.ready = true;
      panel.innerHTML = `<ol class="builder-parts" aria-label="${groupLabel}">${progress}</ol>
        <h2>${readyTitle}</h2><p>Read ${rules?'the rules':bugReport?'the report':'the prompt'} together, then tap Send.</p>
        <details><summary>${rules?'Read all six rules':'Read the full prompt'}</summary><dl class="builder-completed">${markedParts.map(({label,html})=>
          `<dt class="${partClass(label)}">${promptPartLabel(label, visuals[label].icon)}</dt><dd>${html}</dd>`).join('')}</dl></details>`;
      const active = setActions(current.page, scene, frameIndex, false);
      if (focus) active[0]?.focus({preventScroll:true});
      return;
    }

    const {answer,trap,full} = part.check(picked);
    const step = parts.slice(0,completed.length+1).filter(item=>item.tag===part.tag).length;
    const total = parts.filter(item=>item.tag===part.tag).length;
    panel.innerHTML = `
      <ol class="builder-parts" aria-label="${groupLabel}">${progress}</ol>
      ${total>1?`<p class="builder-explainer"><strong>${AFL.esc(part.tag)}</strong>
        ${total>1?` · Build ${step} of ${total}`:''}</p>`:''}
      ${part.example?`<details data-tailor ${state.showTailor?'open':''}><summary>How would you tell a tailor?</summary>
        <p>“${AFL.esc(part.example.tailor)}”</p></details>`:''}
      <h2>${AFL.esc(part.goal)}</h2>
      <p class="builder-line" aria-live="polite">${picked.length?AFL.esc(answer?.t ?? part.preview(picked)):'Tap the pieces in order.'}</p>
      ${trap?`<div class="builder-feedback" role="status"><strong>${rules?'Orbit follows that rule':'Sathi follows that instruction'}</strong>${trap.ai}
        <details><summary>Why did that happen?</summary><p>${trap.why}</p></details></div>`:
        full&&!answer?`<p class="builder-feedback" role="status">${AFL.esc(part.tip)}</p>`:''}
      ${!full?`<div class="builder-tiles">${part.pool.filter(tile=>!picked.includes(tile.i)).map(tile=>
        `<button type="button" data-piece="${tile.i}">${AFL.esc(tile.t)}</button>`).join('')}</div>`:''}
      <div class="builder-tools">
        ${picked.length?'<button type="button" data-build="undo">Undo last piece</button>':''}
        ${answer?`<button type="button" class="builder-add" data-build="add">Add to ${bugReport?'report':'prompt'} →</button>`:''}
      </div>`;
    panel.querySelector('[data-tailor]')?.addEventListener('toggle', event=>{state.showTailor=event.target.open;});
    if (focus) panel.querySelector('[data-build="add"], [data-piece], [data-build="undo"]')?.focus({preventScroll:true});
  }

  panel.addEventListener('click', event=>{
    const button = event.target.closest('button');
    if (!button) return;
    const part = parts[state.completed.length];
    if (!part) return;
    const {answer,full} = part.check(state.picked);
    if (button.dataset.build === 'undo') state.picked.pop();
    else if (button.dataset.build === 'add' && answer) {
      state.completed.push(answer.t);
      state.picked = [];
    } else if (button.dataset.piece !== undefined && !full) {
      state.picked.push(Number(button.dataset.piece));
    }
    draw(true);
  });
  draw();
  return panel;
}

function showFrame(index, {filled=false, focus=false}={}) {
  endPlanStream?.();
  endPlanStream = null;
  const {id, page} = current;
  if (phase !== 'scene') renderNotes();
  const frame = page.frames[index];
  const stoppedPlan = frame.reviewPlan && current.stoppedPlan;
  const stoppedEarly = stoppedPlan && !stoppedPlan.sawDrift;
  const scene = stoppedEarly ? {
    ...frame,
    label:'Stopped early',
    focus:lens('Try the plan again', ['Listen for', 'A feature Ayesha did not ask for', 'search']),
    target:'[data-mid="plan1s"]',
    actions:[act('Replay Studio’s plan',null,0)]
  } : frame;
  if (scene.streamPlan) current.stoppedPlan = null;
  const support = slide.querySelector('.scene-support');
  support.innerHTML = (!page.gear && index===0 ? missionMap(id) : '') +
    (scene.compareHelp ? helpComparison() : '') + (scene.jobSplit ? agreedJobsGraphic() : '') +
    (scene.focus ? evidenceCard(scene.focus) : scene.visual ? sceneVisual(scene.visual, scene.label) : '') +
    wordHelp(scene.words);
  const comparison = support.querySelector('.help-comparison');
  comparison?.addEventListener('click', event => {
    const selected = event.target.closest('[data-help-mode]');
    if (!selected) return;
    for (const button of comparison.querySelectorAll('[data-help-mode]')) {
      button.setAttribute('aria-pressed', String(button === selected));
    }
    comparison.querySelector('#help-example').innerHTML = helpExample(helpModes[Number(selected.dataset.helpMode)]);
  });
  const {key, ready, completed} = current.prompt;
  const values = {...scene.values};
  if (id === 'build') {
    values.projectorBrief = true;
    if (current.sentBrief) values.desc = current.sentBrief;
  }
  if (stoppedPlan) values.stoppedPlan = stoppedPlan.lines;
  if (ready) {
    values[key] = key === 'desc' || key === 'bug' ? joinAppSentences(completed) : completed.join(' ');
    if (key === 'rules') values.demoRules = completed;
  }
  slide.querySelector('.projector-builder')?.remove();
  const {html, app, scrollTo, promptBuilder} = AFL.demoFrame(id, {
    ...scene, values, fill:scene.fill && filled, unsolved:scene.assign && !filled
  });
  screen.innerHTML = html;
  screen.dataset.app = app;
  screen.toggleAttribute('data-compose', !!scene.fill && filled);
  for (const control of screen.querySelectorAll('button, input, textarea, a, [tabindex]')) {
    control.tabIndex = -1;
    if (control.matches('input, textarea')) control.readOnly = true;
  }
  for (const input of screen.querySelectorAll('.composer textarea')) {
    input.style.height = Math.min(input.scrollHeight, 200) + 'px';
  }
  if (promptBuilder) {
    phoneActions.replaceChildren();
    phoneActions.hidden = true;
  }
  const builder = promptBuilder && showPromptBuilder(promptBuilder, index, scene);
  const active = builder ? [] : setActions(page, scene, index, filled);
  const target = (scrollTo && screen.querySelector(scrollTo)) || active.find(control => screen.contains(control));
  if (target) {
    const scroller = target.closest('.scroll,.sheet,.preview');
    if (scroller) {
      const align = () => {
        scroller.scrollTop += target.getBoundingClientRect().top - scroller.getBoundingClientRect().top - 12;
      };
      align();
      const image = target.closest('.zoombox')?.querySelector('img');
      if (image && !image.complete) image.addEventListener('load', align, {once:true});
    }
    target.classList.add('projector-spot');
  }
  if (scene.streamPlan) endPlanStream = playStudioPlan();
  jumps.value = String(index);
  const reachedGear = page.gear && index === page.frames.length - 1 &&
    (!(scene.fill || scene.assign) || filled);
  caption.textContent = scene.label;
  if (reachedGear && !stoppedEarly) showResult(scene.label);
  else if (focus) {
    const destination = builder?.querySelector('button') || active[0] || next;
    destination.focus({preventScroll:true});
    if (screen.contains(destination)) destination.scrollIntoView({block:'nearest',inline:'nearest'});
  }
}

function renderNotes() {
  const {id, page} = current;
  const lesson = AFL.LESSONS[id];
  phase = 'scene';
  slide.dataset.phase = phase;
  slide.innerHTML = `
    <p class="eyebrow">${lesson.title}</p>
    <h1 id="slide-title" tabindex="-1">${page.title}</h1>
    ${page.question ? `<p class="lesson-question">${AFL.esc(page.question)}</p>` : ''}
    <div class="scene-support"></div>
    ${page.link ? `<p class="handoff">Try the mission on Ayesha’s phone. Choose Alone or Pair work.${id === 'cv' ? '' : ' Finish Mission 1 to unlock this exercise.'}</p>
      <a class="action" href="${page.link}">${AFL.ico('phone')}Open the exercise</a>` : ''}
  `;
  updateNext();
  showGearTrack();
}

function render() {
  endPlanStream?.();
  endPlanStream = null;
  const [, id, step] = location.hash.match(/^#([a-z]+)(?:\/(\d{1,2}))?$/) || [];
  const isMission = AFL.ORDER.includes(id) && Object.hasOwn(missions, id);
  for (const tab of missionTabs) {
    const mission = tab.dataset.missionTab;
    const active = mission === (isMission ? id : '');
    tab.href = active && isMission ? location.hash : '#'+mission;
    if (active) tab.setAttribute('aria-current', 'page');
    else tab.removeAttribute('aria-current');
  }
  const wasInDeck = !!current;
  chooser.hidden = isMission;
  deck.hidden = !isMission;
  if (!isMission) {
    current = null;
    if (wasInDeck) $('#chooser-title').focus();
    return;
  }

  const chapters = [
    ...missions[id],
    {title:'Make the choices yourself', question:'Which gear would you use first, and why?', link:'index.html#'+id+'/0'}
  ];
  const index = Math.max(0, Math.min(chapters.length - 1, Number(step || 1) - 1));
  const page = chapters[index];
  const sentBrief = current?.id === id ? current.sentBrief : undefined;
  current = {id, chapters, index, page, sentBrief, prompt:{completed:[],picked:[],showTailor:false}};
  stage.classList.toggle('handoff-stage', !page.frames);
  visual.hidden = !page.frames;
  renderNotes();
  chapterJump.innerHTML = chapters.map((chapter,i)=>
    `<option value="${i}">${i+1}. ${AFL.esc(chapter.title)}</option>`).join('');
  chapterJump.value = String(index);
  back.disabled = index === 0;
  replay.hidden = !page.frames;
  scenePicker.hidden = !page.frames || page.frames.length < 2;
  if (page.frames) {
    jumps.innerHTML = page.frames.map((scene,i)=>
      `<option value="${i}">${i+1}. ${AFL.esc(scene.label)}</option>`).join('');
    showFrame(0);
  }
  $('#slide-title').focus();
}

screen.addEventListener('click', event => {
  if (event.target.closest('button, a, input, textarea')) event.preventDefault();
});
chapterJump.addEventListener('change', () => go(Number(chapterJump.value)));
jumps.addEventListener('change', () => showFrame(Number(jumps.value)));
back.addEventListener('click', () => go(current.index - 1));
next.addEventListener('click', forward);
replay.addEventListener('click', () => {
  current.prompt = {completed:[],picked:[],showTailor:false};
  showFrame(0, {focus:true});
});
// Capture the click before a mission link changes the hash and replaces its chapter.
document.addEventListener('click', () => { if (sounds) FX.unlock(); }, {capture:true});
effects.addEventListener('click', () => {
  sounds = !sounds;
  effects.setAttribute('aria-pressed', String(sounds));
  if (sounds) FX.unlock();
});
document.addEventListener('keydown', event => {
  if (event.target.closest?.('select, input, textarea')) return;
  if (!current || event.altKey || event.ctrlKey || event.metaKey || event.shiftKey) return;
  if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') {
    event.preventDefault();
    if (event.key === 'ArrowRight') forward();
    else go(current.index - 1);
  }
});
if (document.fullscreenEnabled) {
  fullscreen.hidden = false;
  fullscreen.addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await document.documentElement.requestFullscreen();
    } catch { /* The browser can still enter full screen through its menu. */ }
  });
  document.addEventListener('fullscreenchange', () => {
    fullscreen.textContent = document.fullscreenElement ? 'Exit full screen' : 'Full screen';
  });
}

for (const icon of chooser.querySelectorAll('[data-preview-icon]')) {
  icon.innerHTML = AFL.ico(icon.dataset.previewIcon);
}
window.addEventListener('hashchange', render);
render();
