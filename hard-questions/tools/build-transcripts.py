"""Prepare original-recording captions and a phrase-aligned motion storyboard.

Input: cached local faster-whisper small.en word timestamps (not estimated WPM).
The two editorial fixes are documented below. No recording is changed.
"""
import json, re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
raw = json.loads((ROOT / 'production/word-timings.json').read_text())
voices = json.loads((ROOT / 'voices.json').read_text())
# (word index, composition, short visual anchor, plain-English visual meaning)
scenes = {
 'kamille': [(0,'diagnosis','Finding answers','Medical records can be hard to understand.'),(22,'waiting','Six years','Kamille waited a long time for a diagnosis.'),(44,'diagnosis','Could answers come sooner?','She wonders whether AI could help doctors find answers sooner.')],
 'robert': [(0,'family','A father’s question','Robert is raising a young son.'),(13,'control','Who is in control?','He asks who should oversee how AI is used.'),(29,'infrastructure','What does AI need?','He wants openness about data centers and local impact.')],
 'larissa': [(0,'compass','What is the mission?','She asks what drives AI companies.'),(14,'thinking','Keep thinking','She wants her son to develop his own thinking skills.'),(47,'writing','Partner or replacement?','She wonders whether AI can support her writing and ideas.')],
 'daniel': [(0,'work','What stays human?','He asks which parts of work should stay human.'),(31,'research','A future in physics','He worries about his daughter’s future research work.'),(61,'tasks','Less tedious work?','He asks whether AI could take over unwanted repetitive jobs.')],
 'scott': [(0,'growing','Growing up with AI','His children will grow up in a world with AI.'),(30,'creativity','Room to create','He wonders how AI could affect children’s imagination.'),(54,'time','More time together?','He hopes for more time with his daughters.')],
 'tiffany': [(0,'isolation','Stay connected','She worries that technology could isolate people.'),(16,'empathy','Our shared humanity','She wants people to keep caring for one another.'),(29,'access','A place for everyone','She asks whether everyone can access the benefits.')],
 'danielle': [(0,'empathy','The human part','She values empathy and the beautiful parts of life.'),(48,'family','Lives that feel fulfilled','She hopes AI will help loved ones and future generations.'),(77,'connection','Could AI bring us closer?','She wonders whether AI could help humans show more empathy.')],
 'gwen': [(0,'environment','The cost to our world','She worries about environmental and community harm.'),(16,'balance','Finding a balance','She asks how technology and community safety can coexist.'),(31,'nature','Help instead of harm?','She wonders whether AI could help the environment.')],
 'sarah': [(0,'independence','Growing into independence','She hopes tools can support her son as he becomes an adult.'),(25,'path','A life of his own','She asks how AI could support an independent life.'),(43,'support','Support in everyday life','She wonders whether AI could help her as a teacher and parent.')]
}

def stamp(t, separator=','):
 n = round(t * 1000)
 return f'{n//3600000:02}:{n//60000%60:02}:{n//1000%60:02}{separator}{n%1000:03}'

result = {}
for voice in voices:
 key = voice['id']
 words = raw[key]['words']
 if key == 'scott': words[54]['w'] = 'Will'  # question, also corroborated by source quote
 if key == 'robert':
  words[9:12] = [{'w':'five-year-old','s':words[9]['s'],'e':words[11]['e']}]
  scene_specs = [(0,*scenes[key][0][1:]),(11,*scenes[key][1][1:]),(27,*scenes[key][2][1:])]
 else: scene_specs = scenes[key]
 duration = voice['duration']
 for i,w in enumerate(words):
  # Give occasional zero-width ASR words a visible span without overlapping the next.
  w['e'] = min(words[i+1]['s'] if i+1<len(words) else duration,max(w['e'],w['s']+.04))
 cues=[]; start=0
 for i,w in enumerate(words):
  count=i-start+1
  if re.search(r'[.?!,]$',w['w']) or count>=9 or i==len(words)-1:
   cues.append({'start':words[start]['s'],'end':w['e'],'first':start,'last':i,'text':' '.join(v['w'] for v in words[start:i+1])})
   start=i+1
 timeline=[]
 for j,(index,kind,title,meaning) in enumerate(scene_specs):
  timeline.append({'start':words[index]['s'],'end':words[scene_specs[j+1][0]]['s'] if j+1<len(scene_specs) else duration,'kind':kind,'title':title,'meaning':meaning})
 result[key]={'duration':duration,'name':voice['name'],'words':words,'cues':cues,'scenes':timeline}
 srt='\n\n'.join(f"{i+1}\n{stamp(c['start'])} --> {stamp(c['end'])}\n{c['text']}" for i,c in enumerate(cues))+'\n'
 (ROOT/'subtitles'/f'{key}.srt').write_text(srt)
 vtt='\n\n'.join(f"{i+1}\n{stamp(c['start'],'.')} --> {stamp(c['end'],'.')}\n{c['text']}" for i,c in enumerate(cues))+'\n'
 (ROOT/'subtitles'/f'{key}.vtt').write_text('WEBVTT\n\n'+vtt)
(ROOT/'transcripts.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(f'Built {len(result)} transcripts, {sum(len(x["words"]) for x in result.values())} timed words, 27 scenes, SRT + VTT.')
