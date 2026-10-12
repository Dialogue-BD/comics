// One A4 side, single-sided: the cheat sheet for students without a phone or data.
import React from 'react';
import { UNITS } from '../content/units';

const EX = {
  'word-stress': [<><b>PHO</b>·to·graph → pho·to·<b>GRAPH</b>·ic · un·<b>HAP</b>·py (un- stays light)</>, <>a·<b>BOUT</b> · <b>SO</b>·fa · sup·<b>PLY</b> <span className="pm">(weak = ə)</span></>, <>a <b>BLACK</b>board (one thing) · a black <b>BOARD</b> (a board that is black)</>],
  'sentence-stress': [<>Big words big, small words rush: turn off the <b>LIGHT</b>.</>, <>the, a, to, for, and, my, was → quick and quiet.</>, <>One news word in each group: after the long <b>MEET</b>ing…</>],
  linking: [<>go‿on · an‿apple · come‿in (“co-min”)</>, <>pick‿it‿up (“pi-cki-tup”) · turn‿off the light</>, <>Don’t stop after every word. Carry the sound across.</>],
  numbers: [<>19 | 94 → nineteen ninety-<b>FOUR</b> · 20 | 26 → twenty twenty-<b>SIX</b></>, <>017 · 12 · 345 · 678 — small groups, small pauses</>, <>October twelfth · fourteen thousand taka · five thirty · four<b>TEEN</b> ≠ <b>FOR</b>ty</>],
  melody: [<>After the long <b>MEET</b>ing <i>//</i> I went straight <b>HOME</b> <i>//</i> and slept for <b>HOURS</b>.</>, <>Let’s eat, <i>//</i> Grandma! <span className="pm">≠</span> Let’s eat Grandma!</>, <>Hum the tune first: mm-<b>MM</b>-mm. Then say it.</>],
  vowels: [<>Long = tense, stretch and hold: team · beat · fool · pool. Short = relaxed: Tim · bit · full · pull</>, <>Open syllable → long: me, go, <b>ba</b>·by</>, <>Closed → short: cat, bed, <b>hop</b>·ping · <b>DES</b>ert (sand) ≠ des<b>SERT</b> (sweet)</>],
  'voice-air': [<>air: f s · buzz: v z — fan / van · sip / zip</>, <>At the end, the vowel is longer before v, z: safe / save · price / prize</>, <>p pops · f hisses · w rounds — pin / fin · west / best</>, <>“er”: earth, earn, herd — tongue bunched in the middle (herd ≠ hard)</>],
  puff: [<>Hand test: <b>p</b>in / spin · <b>t</b>op / stop · <b>k</b>ey / ski</>, <><span lang="bn">ভ</span> ≠ v: teeth on lip, keep buzzing — van</>],
  clusters: [<>school (not <span lang="bn">ইস্কুল</span>) · street · splash · spring</>, <>Start on the s. No vowel before it.</>],
  th: [<>θ air: think · three · thank — ð buzz: this · that · those</>, <>think / sink · three / tree · thank / sank — use the context.</>],
  accent: [<>Accent = shared and clear: ca(r) · wa<b>t</b>er / “wader” · d<b>a</b>nce · <b>sch</b>edule — British or American, both correct.</>, <>Clarity problem = the word gets harder to recognise: “watar” · “eschool” · “sitreet”.</>, <>Keep any accent; train ship ≠ sheep, <b>PHO</b>tograph, school (no extra vowel), thought groups.</>],
};

export default function PrintSheet() {
  return (
    <div className="print-sheet" aria-hidden="true">
      <header className="ps-h">
        <img src="../brand/dialogue-logo.png" alt="" />
        <div>
          <p className="ps-k">PRONUNCIATION PRACTICE · CHEAT SHEET</p>
          <h1>Voice Lab — the music of English</h1>
          <p className="ps-bn" lang="bn">ইংরেজির সুর — উচ্চারণের সহায়িকা</p>
        </div>
      </header>
      <div className="ps-key">
        <span><b>↗</b> height = pitch <i lang="bn">সুর</i></span>
        <span><b>●</b> big circle = big beat <i lang="bn">জোর</i></span>
        <span><b>▬</b> width = time <i lang="bn">সময়</i></span>
        <span><b>//</b> = pause <i lang="bn">বিরতি</i></span>
        <span><b>∿</b> buzz · <b>⋯</b> air</span>
      </div>
      <div className="ps-grid">
        {UNITS.map(u => (
          <section key={u.id} className="ps-unit">
            <h2><span>{u.n}</span>{u.title.en} <em lang="bn">{u.title.bn}</em></h2>
            <p className="ps-take">{u.takeaway.en} <span lang="bn">{u.takeaway.bn}</span></p>
            <ul>{(EX[u.id] || []).map((e, i) => <li key={i}>{e}</li>)}</ul>
          </section>
        ))}
        <section className="ps-unit ps-routine">
          <h2><span>✓</span>Every day, 5 minutes</h2>
          <ul>
            <li><b>Hear</b> one word or sentence. Notice the big beat.</li>
            <li><b>Say</b> it 5 times. Make the big beat big, the small beats small.</li>
            <li><b>Use</b> it in your own sentence today.</li>
          </ul>
          <p className="ps-take" lang="bn">শুনুন → ৫ বার বলুন → নিজের বাক্যে ব্যবহার করুন।</p>
        </section>
      </div>
      <footer className="ps-f">Dialogue English &amp; Skills Center · Rajshahi · dialogue-bd.com/pronunciation</footer>
    </div>
  );
}
