import React, { useEffect, useRef } from 'react';
import { IClose } from './Icons';

export default function TeacherNotes({ onClose }) {
  const ref = useRef(null);
  useEffect(() => { ref.current && ref.current.focus(); }, []);
  return (
    <div className="sheet-scrim center" onClick={onClose}>
      <div className="dialog card" role="dialog" aria-modal="true" aria-labelledby="tn-h" onClick={e => e.stopPropagation()} tabIndex={-1} ref={ref}>
        <button className="icon-btn dlg-x" onClick={onClose} aria-label="Close"><IClose /></button>
        <p className="kicker">For the teacher · not shown on the projected screen</p>
        <h2 id="tn-h">Running Voice Lab</h2>
        <p className="lead">Eleven short units, about ten minutes each. The aim is <strong>intelligibility, not a native accent</strong>: speech many listeners can follow with less effort.</p>

        <h3>The order</h3>
        <ul className="sq-list">
          <li><strong>The music first</strong> (Units 1–5): word stress, big and small words in a sentence, thought groups, linking, numbers. Stress, rhythm and grouping do the most for how easily people understand spontaneous speech, and they are where Bangla and English differ most.</li>
          <li><strong>Then the sounds</strong> (Units 6–10), in order of how often they change meaning for Bangla speakers: vowel length, voice and air, the puff, clusters. TH comes last and is taught for recognition.</li>
          <li><strong>Then the accent question</strong> (Unit 11): British and American are both correct; what students train is clarity. It is a good closing lesson — or an opening one, if students ask “which accent should I learn?”</li>
        </ul>

        <h3>Each unit is one page</h3>
        <ul className="sq-list">
          <li>Students scroll down through <strong>Hear → Say → Play</strong>. There is no Next button; the bar at the top shows where they are and jumps to a step.</li>
          <li><strong>Hear</strong> on the projector. The pictures are drawn from the recordings: the brush line is the voice’s real pitch (thick on the big beat), the ball bounces from beat to beat, small words shrink. In the sound units a front and a side view of the mouth move with each recording; for long and short vowels the cheek muscles pull tight (coral) or let go (blue).</li>
          <li><strong>Say</strong> in pairs on one phone: listen, then say it three to five times. <em>Record me</em> draws the student’s own pitch line over the model. There is no score.</li>
          <li><strong>Play</strong>: hear, choose, see why. Nothing is locked.</li>
        </ul>

        <h3>Two voices</h3>
        <p>Every recording comes in two voices: <strong>Alice</strong> (British) and <strong>Brian</strong> (American). Choose one at the top, or press <kbd>V</kbd>. After any sound, a small bar at the bottom offers it again: tap a voice, or <em>Both voices ×2</em> to hear each say it twice. The pictures follow whoever is speaking. A pair that is compared on screen (team / Tim) always plays in one voice; where Brian has not recorded both words, the pair stays with Alice.</p>

        <h3>On the projector</h3>
        <p>Press <kbd>P</kbd> or the TV button for large type. <kbd>→</kbd> or <kbd>Space</kbd> scrolls to the next section, <kbd>←</kbd> back. With “Play sound as I scroll” on, a listening section plays once when it reaches the middle of the screen.</p>

        <h3>Things to know</h3>
        <ul className="sq-list">
          <li>The “melody off” sentence in Unit 3 is the same recording with its melody squashed by computer. It keeps the small natural wobble of the voice, so it sounds like a person speaking in a monotone.</li>
          <li><em>desert / dessert</em> (Unit 6) has no recording yet: say both aloud. Add <code>dec-desert.mp3</code> and <code>dec-dessert.mp3</code> to the audio folder (and measure them) and play buttons appear.</li>
          <li>Listening training works better with many different voices. Two is a start; recordings from more speakers — a Bangladeshi teacher’s clear English among them — would make it stronger.</li>
          <li>Brian has not recorded about twenty words yet (bet, wet, hard, bit, about, supply, agree, baby, bed, go, hopping, sunset, transport, this, that, those, street, the greenhouse / hotdog nouns, and the phone number). They play in Alice’s voice until he does.</li>
          <li>The Bangla explanations should be checked by a native speaker before wide use.</li>
          <li>No phone or data? Print the one-page cheat sheet from the menu.</li>
        </ul>
        <button className="btn primary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
