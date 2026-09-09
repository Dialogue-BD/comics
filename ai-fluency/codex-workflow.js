/* Authored, deterministic workflow simulation. No code execution or model calls. */
(() => {
  const scenarios = {
    2: {
      title: 'Two bookings. One appointment.',
      request: 'Fix TutorTime: two different customers booked the same 16:00 appointment.',
      file: 'server/reserve.ts',
      evidence: ['Two different phones used the same slot.', 'The button turns green.', 'The page uses a loading animation.'],
      relevant: 0,
      steering: ['Reserve the shared slot in one server operation. Test two accounts at once.', 'Disable the button for longer.', 'Hide the second confirmation.'],
      correct: 0,
      notes: [
        'I’ll inspect the booking handler and reproduce the report.',
        'Both requests read “available” before either saves. I’ll inspect the client too.',
        'I’ll disable the booking button after the first click. That should prevent duplicates.',
        'The single-customer test passes. I’m calling the fix complete.'
      ],
      files: ['server/reserve.ts', 'ui/BookButton.tsx', 'tests/booking.test.ts'],
      original: 'if (slot.available) {\n  await saveBooking(slot, customer);\n}',
      weak: '- <button onClick={book}>Book</button>\n+ <button disabled={busy} onClick={book}>\n+   Book\n+ </button>',
      repaired: '+ reserveIfAvailable(slot, customer)\n+ // one atomic server operation\n+ // enforce one reservation per slot\n+ // otherwise return “unavailable”',
      steps: ['Opened booking handler', 'Reproduced simultaneous requests', 'Edited the client button', 'Ran the single-customer test'],
      logs: ['$ test booking --single\nPASS: one click → one booking'],
      failed: 'FAIL: 2 confirmations · 1 slot\nCustomer A → confirmed\nCustomer B → confirmed',
      passed: 'PASS: 1 confirmation · 1 slot\nCustomer A → confirmed\nCustomer B → unavailable\nStored booking records: 1',
      test: 'Run two customers at once',
      contrast: ['A: confirmed', 'B: confirmed'],
      fixed: ['A: confirmed', 'B: unavailable'],
      question: 'What evidence would justify accepting this repair?',
      accept: 'One reservation under simultaneous requests, with a clear refusal for the other customer.',
      limited: 'This test supports the booking repair. Payments, permissions and recovery still need separate checks.'
    },
    4: {
      title: 'A clean screen. A hidden failure.',
      request: 'When the database is offline, customers see “No bookings”. Fix this without losing their records.',
      file: 'server/loadBookings.ts',
      evidence: ['The heading is small.', 'An offline database and an empty account show the same message.', 'The loading spinner is green.'],
      relevant: 1,
      steering: ['Show a success tick even on failure.', 'Distinguish load failure from empty results. Preserve records; test recovery.', 'Catch the error and return an empty list.'],
      correct: 1,
      notes: [
        'I’ll compare an empty account with a database outage.',
        'The request fails during the outage. I’ll inspect how that error reaches the screen.',
        'I’ll catch the error and return an empty list so the page always looks clean.',
        'The page renders without throwing. I’m calling the fix complete.'
      ],
      files: ['server/loadBookings.ts', 'ui/BookingList.tsx', 'tests/recovery.test.ts'],
      original: 'const bookings = await database.list(user);\nreturn bookings;',
      weak: '+ try { return await database.list(user); }\n+ catch { return []; }\n// [] displays “No bookings”',
      repaired: '+ return { status: "unavailable" };\n+ // show a temporary load error\n+ // preserve the existing records\n+ // allow retry after recovery',
      steps: ['Opened the load handler', 'Reproduced a database outage', 'Changed error handling', 'Ran a render-only test'],
      logs: ['$ test page-renders\nPASS: no uncaught exception'],
      failed: 'FAIL: outage shown as empty account\nExisting customer → “No bookings”\nNew customer → “No bookings”',
      passed: 'PASS: outage → “Cannot load yet”\nPASS: restored → original bookings return\nPASS: empty account → “No bookings”',
      test: 'Test outage, recovery and empty account',
      contrast: ['Outage: no bookings', 'Empty: no bookings'],
      fixed: ['Outage: cannot load', 'Empty: no bookings'],
      question: 'What evidence would justify accepting this repair?',
      accept: 'The three states differ correctly, and original bookings return after recovery.',
      limited: 'This test supports the recovery behavior. It does not establish the reliability of the whole service.'
    }
  };

  window.renderCodexWorkflow = ({index, state, persist, render, session, bangla}) => {
    const c = scenarios[index];
    const root = document.querySelector('#app');
    const esc = value => String(value ?? '').replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));
    if (!state.workspace) state.done = false;
    const w = state.workspace || (state.workspace = {phase:0, trail:[]});
    const phase = w.phase;
    const fixed = !!w.repaired;
    const tested = !!w.tested;
    const button = (id,label,cls='') => `<button id="${id}" class="${cls}">${label}</button>`;
    const weakCode = w.weakSteer===undefined ? c.weak : index===2 ? (w.weakSteer===1 ? '+ setBusy(true);\n+ setTimeout(() => setBusy(false), 10000);\n// shared reservation code is unchanged' : '+ if (duplicateConfirmation) return null;\n// hide the message; booking records unchanged') : (w.weakSteer===0 ? '+ catch { showSuccessTick(); }\n// load failure still looks successful' : c.weak);
    const code = phase < 2 ? c.original : fixed ? c.repaired : weakCode;
    const note = fixed ? 'I’ll repair the underlying behavior and run the test you requested.' : c.notes[Math.min(phase,3)];
    root.innerHTML = `
      <div class="toolbar">
        ${button('cw-back','← Lesson stages')}
        <span class="muted">Session 3 · Stage ${index+1}/8 · ${session.steps[index].minutes} min</span>
        ${button('cw-restart','↺ Replay this workflow')}
      </div>
      <div class="workflow-heading"><small>Discernment → description → diligence</small><h1>${c.title}</h1>
        <p>You supervise Codex. Watch its actions. Interrupt when the fix drifts.</p>${bangla?'<p class="bn" lang="bn">AI-এর কাজ দেখুন। ভুল পথে গেলে থামান। প্রমাণ দেখিয়ে নতুন নির্দেশ দিন।</p>':''}
        <p class="muted">A runs the next action. B checks the evidence. Swap after the first test.</p>
      </div>
      <section class="codex-workspace" aria-label="Codex practice workspace">
        <header class="cw-title"><b>⌘ Codex <span>· TutorTime</span></b><span class="cw-label">Authored simulation · no live code</span></header>
        <div class="cw-request"><small>Your request</small><p>${c.request}</p></div>
        <div class="cw-grid">
          <aside class="cw-files"><small>Project files</small>${c.files.map((f,i)=>`<div class="${i=== (phase>=2&&!fixed&&index===2?1:0)?'active':''}">▤ ${f}</div>`).join('')}<p>Teaching excerpts; not a complete implementation.</p></aside>
          <div class="cw-main" id="screen">
            <div class="cw-progress" role="status"><span>${w.stopped?'■ Interrupted':tested?'● Test result':phase===0?'● Ready':'● Working'}</span><span>Action ${Math.min(phase+1,4)} / 4</span></div>
            <div class="cw-note"><b>Codex · work update</b><p>${note}</p></div>
            <div class="cw-diff"><small>${phase>=2&&!fixed?(index===2?'ui/BookButton.tsx':'server/loadBookings.ts'):c.file}</small><pre>${esc(code)}</pre></div>
            ${phase>=1||tested?`<div class="cw-terminal"><small>Terminal · simulated test output</small><pre>${esc(tested?(fixed?c.passed:c.failed):phase<3?(index===2?'Reproduction: A and B both read available.':'Reproduction: database offline → request failed.'):c.logs[0])}</pre></div>`:''}
            ${tested?`<div class="cw-preview ${fixed?'fixed':'failed'}"><small>TutorTime · customer screens</small><div>${(fixed?c.fixed:c.contrast).map(t=>`<strong>${t}</strong>`).join('')}</div><b>${fixed?'✓ Behavior matches this test':'✕ The customer problem remains'}</b></div>`:''}
            ${!w.stopped&&!fixed&&!tested?`<div class="cw-controls">${button('cw-next',phase<3?'Run next action →':'Challenge the “complete” claim','primary')}${button('cw-stop','■ Interrupt & steer','stop')}</div>`:''}
            ${tested&&!fixed&&!w.stopped?`<div class="feedback bad">The easy test passed. The real failure survived.</div>${button('cw-stop','■ Reopen & steer','primary')}`:''}
            ${w.stopped?`<div class="cw-steering"><b>What did you notice?</b><p>Pin one piece of evidence.</p><div class="options">${c.evidence.map((e,i)=>`<button data-cw-evidence="${i}" aria-pressed="${w.evidence===i}">⌕ ${e}</button>`).join('')}</div>
              <b>Send a direction to Codex</b><div class="options">${c.steering.map((e,i)=>`<button data-cw-steer="${i}" aria-pressed="${w.steer===i}">${e}</button>`).join('')}</div>
              ${button('cw-send','Send direction ↑','primary')}${w.message?`<p role="status" class="feedback">${w.message}</p>`:''}</div>`:''}
            ${fixed&&!tested?button('cw-test',c.test,'primary'):''}
            ${fixed&&tested&&!state.done?`<div class="cw-accept"><b>${c.question}</b><div class="options">${button('cw-accept',c.accept)}${button('cw-trust','Codex says the whole app is now ready to launch.')}</div>${w.message?`<p class="feedback" role="status">${w.message}</p>`:''}</div>`:''}
            ${state.done&&fixed&&tested?`<div class="complete"><b>✓ You supervised a repair</b><p>${c.limited}</p></div><div class="speech">Say it without reading: “The first fix changed ___. I asked for ___. The test showed ___.”</div>`:''}
          </div>
        </div>
        <details class="cw-history"><summary>Your session history · ${w.trail.length} actions</summary><ol>${w.trail.map(t=>`<li>${esc(t)}</li>`).join('')}</ol></details>
      </section>
      <p class="muted">Work updates are authored summaries of observable actions, not a model’s private reasoning. Step at your own pace; there is no speed penalty.</p>
      <div class="nav">${button('cw-prev','← Previous stage')}${button('cw-forward','Next stage →','primary')}</div>`;
    const on=(id,fn)=>{const e=document.getElementById(id);if(e)e.onclick=fn};
    const save=()=>{persist();render()};
    on('cw-back',()=>location.hash='build/1');
    on('cw-prev',()=>location.hash='build/'+index);
    on('cw-forward',()=>location.hash='build/'+(index+2));
    on('cw-restart',()=>{if(confirm('Replay this workflow and clear its decisions?')){state.workspace={phase:0,trail:[]};state.done=false;save()}});
    on('cw-next',()=>{if(phase<3){w.trail.push(c.steps[phase]);w.phase++}else{w.tested=true;w.trail.push('Challenged the easy test → real failure reproduced')}save()});
    on('cw-stop',()=>{w.stopped=true;w.message='';w.trail.push('Student interrupted at action '+(phase+1));save()});
    document.querySelectorAll('[data-cw-evidence]').forEach(b=>b.onclick=()=>{w.evidence=Number(b.dataset.cwEvidence);save()});
    document.querySelectorAll('[data-cw-steer]').forEach(b=>b.onclick=()=>{w.steer=Number(b.dataset.cwSteer);save()});
    on('cw-send',()=>{
      if(w.evidence===undefined||w.steer===undefined){w.message='Choose evidence and a direction before sending.';return save()}
      if(w.evidence!==c.relevant){w.message='Point to evidence that explains the customer failure. The appearance alone does not explain it.';return save()}
      w.trail.push('Student: '+c.steering[w.steer]);
      w.stopped=false;w.tested=false;w.phase=3;w.message='';state.done=false;
      if(w.steer===c.correct){w.repaired=true;w.trail.push('Codex changed the underlying behavior; awaiting a meaningful test')}
      else {w.repaired=false;w.weakSteer=w.steer;w.trail.push('Codex followed the superficial direction; the easy test still passes')}
      save();
    });
    on('cw-test',()=>{w.tested=true;w.trail.push(c.passed);save()});
    on('cw-accept',()=>{state.done=true;w.trail.push('Student accepted only the behavior demonstrated by the test');save()});
    on('cw-trust',()=>{w.message=c.limited;save()});
    document.querySelector('#teacher').innerHTML='<h3>Supervise the workflow</h3><p>'+session.steps[index].teacher+'</p><p>First pass: predict before running. Second pass: interrupt and pin evidence. A weak direction is followed and keeps the failure alive. A useful direction changes the patch and unlocks a meaningful test. Ask each student to explain the scope of the evidence before accepting.</p>';
  };
})();
