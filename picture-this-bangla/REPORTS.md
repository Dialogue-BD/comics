# Picture This Bangla — problem reports

Nurturers report card problems from the deck's **⚑ Report a problem** button: a
step-by-step wizard in English or বাংলা. Reports are stored in the site
database and read at `/picture-this-bangla/reports.html` (people) or through
the API below (Codex's weekly correction run).

## What a report contains
Every report is a snapshot of the card **at the time it was sent**, so it stays
meaningful after the card changes or the deck grows:

| field | meaning |
|---|---|
| `id`, `status`, `created_at` | report number; `open` · `in-progress` · `resolved` · `wont-fix` |
| `card.number`, `card.slug`, `card.title` | the card (slug is the stable key; numbers can shift) |
| `target.kind` | `item` (a picture), `question`, `title`, or `card` |
| `target.index` | picture 1–6 (grid order) or question 1–6 |
| `target.id` | item id (= audio filename), or `q1`–`q6`, `title`, `card` |
| `target.label`, `target.gloss`, `target.question` | what the card said then |
| `target.audio_source` | `gemini:…` or `edge:…` (which recording they heard) |
| `category` | `pronunciation`, `spelling`, `wrong-word`, `uncommon-word`, `better-word`, `english-meaning`, `picture`, `question-unclear`, `question-grammar`, `question-unnatural`, `question-too-hard`, `question-sensitive`, `title`, `other` |
| `details.faults` | ticked boxes, e.g. `s_endVowel`, `s_extraVowel`, `s_rr`, `s_vowel`, `s_consonant`, `s_stress`, `s_robotic`, `s_differentWord`; `p_differentObject`, `p_strange`, `p_notBd`, `p_culture`, `p_hard`, `p_mismatch` |
| `details.usage`, `details.region` | for word suggestions: `u_everyday`, `u_formal`, `u_regional`, `u_family` |
| `suggestion` | correct spelling / better word / how it should sound / better question |
| `description` | free notes (Bangla or English) |
| `reporter.role`, `reporter.name` | `bangla-speaker` or `learner`; name optional |
| `has_audio`, `audio_url` | the reporter's own recording of how it should sound |

## API (token: `PTB_REPORTS_TOKEN` secret, or `TTS_UPLOAD_TOKEN` if not set)
```
GET  https://dialogue-bd.com/api/ptb/reports?status=open        # or in-progress, resolved, wont-fix, all, or a comma list
GET  https://dialogue-bd.com/api/ptb/reports/<id>/audio         # the reporter's recording
POST https://dialogue-bd.com/api/ptb/reports/status
     {"ids": [12, 13], "status": "resolved", "resolution": "what changed (commit abc1234)", "by": "codex"}
```
Send the token as `Authorization: Bearer <token>`.

## Weekly correction run (Codex)
1. `GET …/reports?status=open`. Mark the batch `in-progress` (so a person
   looking at reports.html sees it is being handled).
2. For each report, find the card by `card.slug` (not the number) and the item
   by `target.id`. If the card already differs from the snapshot, check whether
   the problem is already fixed.
3. Decide, then fix in the card source (`cards/NNN-slug/card.json`, artwork,
   questions):
   - spelling / wrong-word / better-word / uncommon-word / title → change the
     **label** (never the id). Keep the old word as an alias if it is still
     correct. Weigh `details.usage` and `details.region`: prefer everyday
     Bangladeshi speech.
   - english-meaning → fix `english_gloss`.
   - question-* → rewrite the question; keep the set's simple-to-open order.
   - picture → regenerate or replace the artwork for that item.
   - pronunciation → the word itself may be fine. Delete `audio/<id>.mp3` and
     its `audio/sources.json` entry so the word gets a fresh recording; note
     the reporter's suggestion/recording in the resolution so the next Gemini
     take can follow it.
4. Any label change also means: delete `audio/<id>.mp3` + its sources entry.
5. Rebuild the web deck and fill audio (see the card-creation skill):
   `build_web.py --source …`, `edge_backup.py`, `build_web.py --audio-only`.
6. Commit, then `POST …/reports/status` for each report: `resolved` with a
   one-line note of what changed and the commit hash, or `wont-fix` with the
   reason. Leave anything needing a human decision `open` with a note.
7. Summarise for Tim: fixed, won't-fix, still open (and why).

## Adding a new problem type
Add it in three places, with the same code: `CATEGORIES` in `/ptb_reports.py`,
`PROBLEMS` (and its strings in both languages) in `report-wizard.js`, and
`CATEGORY` in `reports.html`.
