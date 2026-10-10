"""Assemble the retained opening and short replacement takes reproducibly."""
import hashlib,json,subprocess,tempfile
from pathlib import Path
R=Path(__file__).resolve().parent.parent
FF=['ffmpeg','-hide_banner','-loglevel','error','-y']
def duration(p):return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(p)]))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
source=R/'audio/_originals/lost-son-narration.wav'
reaction=R/'audio/_originals/lost-son-father-reaction.wav'
closing=R/'audio/_originals/lost-son-closing.wav'
short=json.loads((R/'production/short-take-plan.json').read_text())
sources=[source,reaction]+[R/p['file'] for p in short]+[closing]
target=R/'audio/lost-son-story.mp3'
# Cut in observed pauses, retaining lines 0–30 from the original long take.
cut_a=(31.68+32.78)/2
cut_b=(37.88+38.68)/2
cut_c=(199.88+200.84)/2
normalization='loudnorm=I=-16:TP=-1.5:LRA=11'
with tempfile.TemporaryDirectory(prefix='lost-son-mix-',dir='/private/tmp') as temp:
 norm=[]
 for i,p in enumerate(sources):
  out=Path(temp)/f'take-{i}.wav'
  subprocess.run(FF+['-i',str(p),'-af',normalization,'-ar','48000','-c:a','pcm_s16le',str(out)],check=True)
  norm.append(out)
 filters=f'[0:a]atrim=end={cut_a},asetpts=PTS-STARTPTS[prefix];[0:a]atrim=start={cut_b}:end={cut_c},asetpts=PTS-STARTPTS[middle];[prefix][1:a][middle]'+''.join(f'[{i}:a]' for i in range(2,len(norm)))+f'concat=n={len(norm)+1}:v=0:a=1,alimiter=limit=0.841395:level=false[out]'
 inputs=sum((['-i',str(p)] for p in norm),[])
 subprocess.run(FF+inputs+['-filter_complex',filters,'-map','[out]','-ar','48000','-codec:a','libmp3lame','-b:a','128k',str(target)],check=True)
placements=[];at=0
for p,start,end in [(source,0,cut_a),(reaction,0,duration(reaction)),(source,cut_b,cut_c)]+[(p,0,duration(p)) for p in sources[2:]]:
 placements.append(dict(source=str(p.relative_to(R)),start=start,end=end,at=at,sha256=sha(p)));at+=end-start
build=dict(delivery='audio/lost-son-story.mp3',delivery_sha256=sha(target),source=str(source.relative_to(R)),source_sha256=sha(source),duration=duration(target),voice='Gacrux',model='Gemini 2.5 Pro Preview TTS',route='signed-in Google AI Studio browser; no API key',normalization=normalization,master='alimiter=limit=0.841395:level=false',ambience='none',takePlacements=placements,pauseEvidence=dict(first=[31.68,32.78],afterReaction=[37.88,38.68],beforeReturn=[199.88,200.84]),repair=dict(method='replace long-take lines 31–59 with five short takes; retain fresh closing',direction='production/short-take-direction.txt',reason='listener still found grating speech after measured spectral cleanup',spectral_filtering='none on replacement takes'))
(R/'production/audio-build.json').write_text(json.dumps(build,indent=2)+'\n')
print(f'Assembled {build["duration"]:.2f}s from {len(sources)} preserved takes.')
