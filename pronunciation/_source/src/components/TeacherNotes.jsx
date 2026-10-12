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
        <p className="lead">Seven short units, about ten minutes each. The aim is <strong>intelligibility, not a native accent</strong>: speech many listeners can follow with less effort.</p>

        <h3>The order</h3>
        <ul className="sq-list">
          <li><strong>The music first</strong> (Units 1–2). Word stress, thought groups and pauses do the most for comprehensibility in spontaneous speech, and they are where Bangla and English differ most.</li>
          <li><strong>Then the sounds</strong> (Units 3–7), in order of how often they change meaning for Bangla speakers: vowel length, voicing, aspiration, clusters. TH comes last and is taught for recognition only.</li>
        </ul>

        <h3>Each unit: Hear → Say → Play</h3>
        <ul className="sq-list">
          <li><strong>Hear</strong> on the projector. Each picture is drawn from the recording itself: the line is the voice’s real pitch, the gold circles are the stressed syllables, the bars are loudness. Teach students to read the picture once — the four symbols on the opening page — and then let the sound and motion do the explaining.</li>
          <li><strong>Say</strong> in pairs on one phone. Students listen, then say each item three to five times. <em>Record me</em> is optional: it draws the student’s own pitch line in blue over the model so they can compare the shape. There is no score — a machine score is not a fair judge of pronunciation.</li>
          <li><strong>Play</strong> alone or in pairs: hear a word, choose. Every step can be skipped; nothing is locked.</li>
        </ul>

        <h3>On the projector</h3>
        <p>Press <kbd>P</kbd> or the TV button for large type. <kbd>→</kbd> or <kbd>Space</kbd> moves on, <kbd>←</kbd> goes back. With “Play sound automatically” on, each listening screen counts down 3–2–1 and plays; tap the countdown to cancel.</p>

        <h3>Things to know</h3>
        <ul className="sq-list">
          <li>The “melody off” sentence in Unit 2 is the same recording with its pitch flattened by computer, so only the melody changes.</li>
          <li>The recordings come from the Voice Lab prototypes and use very few voices. Research on listening training favours many different voices, so recordings from other speakers would make this stronger.</li>
          <li>The Bangla explanations should be checked by a native speaker before wide use.</li>
          <li>No phone or data? Print the one-page cheat sheet from the menu.</li>
        </ul>
        <button className="btn primary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
