const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const ctx={window:{}};vm.createContext(ctx);
for(const f of ['content.js','workflows.js','visual-data.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,f),'utf8'),ctx);
const W=ctx.window.WORKFLOWS,D=ctx.window.FLUENCY;
const key=qs=>qs.map(q=>`${q[0]}\n${q[1].map((o,i)=>`${String.fromCharCode(65+i)}. ${o}`).join('\n')}\nWorked answer: ${q[1][q[2]]}\nWhy: ${q[3]}`).join('\n\n');
const V=ctx.window.VISUAL_CASES;
const text=`AI FLUENCY LAB — VISUAL TEACHING GUIDE
B1–B2 · one 45-minute workflow per lesson · optional Bangla support

TEACH FIRST: 5 MINUTES
Open Start here. Six short slides show:
1. The deliverable: an unchecked and a better example.
2. Delegation: Human / AI draft / Human + AI.
3. Description: Product = what to make; Process = how to work; Performance = how AI behaves as a collaborator.
4. Discernment: skim headings, scan for a detail, then compare the whole claim.
5. Diligence: protect information, explain assistance, check before use.
6. Deliverables: a clear target, a better AI message, and a spoken explanation.

THE READING DEMONSTRATION
Press Watch the steps. The document view changes depth; attention moves from headings to a detail and then to the source/output mismatch. Pause, replay, or choose each step manually. Reduced-motion users get the same steps without camera motion. Skimming and scanning locate evidence; they do not verify meaning on their own. Read the action, condition, relationship, and surrounding meaning closely.

GUIDED ACTIVITIES: 40 MINUTES
1. See the goal (3m): choose a visible output, then build three success criteria. No blank writing box.
2. Place the jobs (4m): put a short task under Human, AI draft, or Human + AI. Feedback explains the division.
3. Build the brief (5m): choose Product, Process, and Performance instructions. The three-part message appears in the simulated chat. Explore all three interface styles.
4. Compare evidence (7m): skim, scan, tap an output phrase, and classify it as supported, changed meaning, or no evidence. Correct checks expose the exact contrast and build a spoken explanation.
5. Repair and say it (5m): choose a factual correction; arrange four sentence chunks; listen and say the result.
6. Check before use (3m): resolve a privacy, transparency, and release decision. The document case stays on HOLD until missing details are confirmed.
7. New situation (8m): guided choices build a new brief. An optional editable sentence appears only after successful practice.
8. Your results (5m): use the built explanation, point to evidence, swap speakers, and download the learning record.

PAIR ROUTINE
A points and chooses. B checks and says why. Swap roles at the next station. Begin with pointing and selection, then rehearse the visible sentence, then try saying it while looking away. Avoid requiring an open-ended written explanation before the learner has enough language and a concrete example.

FEEDBACK
An activity stamp records completion, not proficiency. Wrong choices give a brief retry cue; they do not deduct points. Spoken-practice buttons are self-report. Device speech is optional and may be unavailable. No microphone recording or automatic speaking assessment occurs. Supported claims may be checked at any matching phrase; changed claims accept alternative valid error locations.

ASSESS TWO THINGS SEPARATELY
Each criterion: 0 not demonstrated; 1 with support; 2 independently with evidence.
AI /8: sensible division; clear brief; evidence-based checking/revision; responsibility before use.
English /8: accurate vocabulary; connected reason; useful question/response; a revision preserving meaning.
Use observed speech and the visible result. Do not equate activity completion with mastery.

CLASSROOM USE
Classroom mode enlarges teaching content. The onboarding deck and activity steps are controllable rather than timed slides. The teacher can pause and ask learners to point, predict, compare, and explain. One workflow per lesson. Use a station URL to direct phones; there is no live synchronisation.

${W.map(w=>{const d=V[w.id];return `WORKFLOW: ${w.title.toUpperCase()}
Goal: ${d.noun} for ${d.audience}.
English: ${w.focus}

VISIBLE EXAMPLES
Unchecked: ${d.bad.join(' | ')}
Better: ${d.good.join(' | ')}

GOOD RESULT — THREE CRITERIA
${d.qualities.map(x=>x.join(': ')).join('\n')}

DELEGATION KEY
${d.sort.map(x=>`${x[0]} → ${x[1]}. ${x[2]}`).join('\n')}

THREE-P BRIEF
${['Product','Process','Performance'].map((p,i)=>`${p}: ${d.parts[i][0]}`).join('\n')}

EVIDENCE PRACTICE
${d.compare.map((c,i)=>`${i+1}. ${c.heading}\nSource: ${c.source.join(' ')}\nOutput: ${c.output.join(' ')}\nCheck: ${c.verdict} — ${c.label}\nAcceptable anchors: ${c.verdict==='same'?'any matching phrase':(c.targets||[c.target]).map(n=>c.output[n]).join('; ')}\nCorrection: ${c.repair}`).join('\n\n')}

SENTENCE TO BUILD
${d.sentence.join(' ')}
Teacher language note: ${w.language.notice}

DILIGENCE KEY
${d.gates.map(g=>`${g[0]} → ${g[1]}`).join('\n')}

TRANSFER
${d.transfer.brief}
Target: ${d.transfer.next}
Include: ${d.transfer.keep}
Avoid: ${d.transfer.avoid}
Check: ${d.transfer.check[0]}
Built sentence: ${d.transfer.sentence}

OPTIONAL LESS-SUPPORTED EXTENSION
${w.transfer}
One defensible approach: ${w.transferModel}

COMPLETE REVISED OUTPUT
${w.improved}

PROCESS NOTE
${w.disclosure}`}).join('\n\n============================================================\n\n')}

SOURCES AND LICENSE
Framework: Rick Dakan, Joseph Feller, and Anthropic (2025).
https://www.anthropic.com/ai-fluency/overview
Course-based lesson adaptation © 2026 Dialogue, CC BY-NC-SA 4.0. All cases are fictional. Product styles are teaching simulations, not actual model replies or evidence of vendor performance. Real new chats need the relevant context again. The older practical overview was consulted but is not reproduced or modified.
`;
fs.writeFileSync(path.join(__dirname,'teacher-guide.txt'),text);
console.log(`Visual teacher guide generated: ${W.length} workflows.`);
