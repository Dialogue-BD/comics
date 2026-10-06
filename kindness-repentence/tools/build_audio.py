"""Assemble audited dry takes, normalize once and preserve the complete build."""
import hashlib,json,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
plan=json.loads((ROOT/'production/audio-edit-plan.json').read_text())
sources=[ROOT/path for path in plan['sources']]
target=ROOT/'audio/kindness-story.mp3'
filters=[]
for i,piece in enumerate(plan['pieces']):
 if 'silence' in piece:
  filters.append(f"anullsrc=r=24000:cl=mono,atrim=duration={piece['silence']},asetpts=PTS-STARTPTS[a{i}]")
 else:
  trim=f"atrim=start={piece['start']}"+(f":end={piece['end']}" if piece.get('end') is not None else '')
  filters.append(f"[{piece['source']}:a]{trim},asetpts=PTS-STARTPTS[a{i}]")
filters.append(''.join(f'[a{i}]' for i in range(len(plan['pieces'])))+f"concat=n={len(plan['pieces'])}:v=0:a=1,loudnorm=I=-16:TP=-1.5:LRA=11[out]")
graph=';'.join(filters)
args=['ffmpeg','-hide_banner','-loglevel','error','-y']
for source in sources:args+=['-i',str(source)]
subprocess.run(args+['-filter_complex',graph,'-map','[out]','-ar','48000','-codec:a','libmp3lame','-b:a','128k',str(target)],check=True)
duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(target)]))
build=dict(sources=[dict(path=str(p.relative_to(ROOT)),sha256=hashlib.sha256(p.read_bytes()).hexdigest()) for p in sources],delivery=str(target.relative_to(ROOT)),delivery_sha256=hashlib.sha256(target.read_bytes()).hexdigest(),pieces=plan['pieces'],filters=graph,ambience='none',duration=duration,voice='Gacrux',model='Gemini 2.5 Pro Preview TTS',accent='neutral General American English',local_pronunciation='native Bangladeshi Bengali requested for waz mahfil, mahfil, mastan, hujur and Dhaka')
(ROOT/'production/audio-build.json').write_text(json.dumps(build,indent=2)+'\n')
print(f'Built {duration:.2f} seconds from {len(sources)} preserved dry takes.')
