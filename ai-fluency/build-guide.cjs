const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const ctx={window:{}};vm.createContext(ctx);
for(const f of ['content.js','workflows.js'])vm.runInContext(fs.readFileSync(path.join(__dirname,f),'utf8'),ctx);
const W=ctx.window.WORKFLOWS,D=ctx.window.FLUENCY;
const key=qs=>qs.map(q=>`${q[0]}\n${q[1].map((o,i)=>`${String.fromCharCode(65+i)}. ${o}`).join('\n')}\nWorked answer: ${q[1][q[2]]}\nWhy: ${q[3]}`).join('\n\n');
const text=`AI FLUENCY LAB — TEACHER GUIDE AND ANSWER KEY
Six 45-minute workshops · B1–B2 · optional Bangla support

Use one complete workflow per lesson. Six workshops total 4.5 hours.
All students, organisations, opportunities, notices and events in these cases are fictional.

RUNNING ORDER
${D.stages.map((s,i)=>`${i+1}. ${s.short}: ${s.mins} minutes`).join('\n')}

TEACHING ROUTINE
Partners read separate role cards, exchange missing information, negotiate decisions, write a brief and a follow-up, check evidence, improve a sentence, and report. Require reasons and actual language production, not only selected answers. Reveal worked solutions after discussion. Alternatives are acceptable when justified against the brief.

On one phone: A privately opens role A, closes it, then passes to B for role B. Partners exchange the information orally. Swap driver/checker at each station. In Classroom mode, project one station at a time and use teacher cues; ask for predictions before revealing. Navigation is not synchronised across phones. Printed role cards can be handed out separately.

For B1, offer frames, vocabulary, brief Bangla clarification and rehearsal. Require the final reason in English. For B2, remove frames, ask for counterarguments and require a defensible alternative. Correct language after understanding meaning; have the learner use the improved form again.

TWO SEPARATE RUBRICS
Each criterion: 0 = not yet demonstrated; 1 = with support; 2 = independently with concrete evidence.
AI judgement / 8: justified delegation; specific description; evidence-based discernment and revision; responsibility before use.
English / 8: task vocabulary; connected reasons; useful questions and responses; meaningful revision preserving facts.
Assess spoken explanations and created messages. Multiple-choice feedback is practice, not a certificate or automatic writing assessment.

FRAMEWORK
${D.ds.map(d=>`${d[0]}: ${d[1]}\n${d[2]}`).join('\n\n')}

Delegation: problem, platform and task awareness. Description: product, process and performance. Discernment: product, process and performance. Diligence: creation, transparency and deployment. Delegation–Diligence frames the collaboration; Description–Discernment is a repeated conversation. All four recur through each case.

SIMULATIONS
ChatGPT-, Claude-, and Gemini-style views use the same authored examples; these are not real responses or claims about model quality. Saving a learner message does not generate a reply. No microphone or real file access. The corrected calculator is local authored code. Learner input is never executed as code. In a real new chat or product, re-establish the goal, relevant evidence and decisions; context does not transfer automatically.

TRANSFER ROUTINE
2 minutes plan, 4 minutes create, 2 minutes challenge, 2 minutes revise and report. Every pair writes: (1) division of work with reasons; (2) actual prompt or mini-output; (3) two evidence checks or test cases; (4) responsibilities before use; (5) one revised sentence after peer feedback.

EXIT ROUTINE
Each student gives a 45-second pitch: Our goal was ___. We gave AI ___ and kept ___. We noticed ___ because ___. We changed ___. Before use, we would ___. Partner gives one strength and one specific next step. Download the learning record before closing the tab.

${W.map(w=>`WORKFLOW: ${w.title.toUpperCase()}
${w.student}
English goal: ${w.focus}

PARTNER A — HAND OUT SEPARATELY
${w.roleA}

PARTNER B — HAND OUT SEPARATELY
${w.roleB}

SUCCESS CRITERION
${w.goal}

CASE EVIDENCE
${w.facts.join('\n')}

VOCABULARY
${w.words.map(v=>`${v[0]}: ${v[1]} | ${v[2]} | ${v[3]}`).join('\n')}

SPEAKING FRAMES
${w.frames.join('\n')}

DELEGATION DECISIONS AND KEY
${key(w.delegation)}

BRIEF COMPONENTS
${Object.entries(w.brief).map(([k,v])=>`${k}: ${v}`).join('\n')}

WORKED FIRST MESSAGE
${w.prompt}

AI CLARIFICATION
${w.clarification}

HUMAN ANSWER
${w.humanReply}

INTENTIONALLY FLAWED DRAFT
${w.draft}

AUDIT QUESTIONS AND KEY
${key(w.audits)}

WORKED FOLLOW-UP
${w.repair}

REVISED OUTPUT
${w.improved}

WHY IT IMPROVED
${w.evidence}

LANGUAGE NOTICING AND PRACTICE
Before: ${w.language.before}
After: ${w.language.after}
${w.language.notice}
${w.language.bn}
Practice: ${w.language.task}
One natural version: ${w.language.model}

RELEASE REVIEW
${w.release.map(t=>`[ ] Explain how: ${t}`).join('\n')}
${w.id==='document'?'Correct readiness decision: NOT READY until the organiser confirms the missing contact and emergency procedure.':''}

SAMPLE AI PROCESS NOTE
${w.disclosure}

NEW TRANSFER TASK
${w.transfer}

ONE DEFENSIBLE APPROACH
${w.transferModel}

EXIT QUESTION AND KEY
${key([w.exit])}`).join('\n\n============================================================\n\n')}

SOURCES AND CREDITS
Framework and course: Rick Dakan, Joseph Feller, and Anthropic (2025).
https://www.anthropic.com/ai-fluency/overview
Source course materials: CC BY-NC-SA 4.0. Original course-based lesson adaptation © 2026 Dialogue, CC BY-NC-SA 4.0. The older practical overview PDF was consulted but is not reproduced or modified. No endorsement by product vendors or universities is implied.
Product references consulted 7 September 2026:
https://learn.chatgpt.com/docs/use-chatgpt
https://support.claude.com/en/articles/8241126-upload-files-to-claude
https://support.google.com/gemini/answer/14903178
Illustration generated with built-in imagegen; fictional people. Prompt recorded in assets/illustration-prompt.txt.
`;
fs.writeFileSync(path.join(__dirname,'teacher-guide.txt'),text);
console.log(`Teacher guide generated: ${W.length} complete workflows.`);
