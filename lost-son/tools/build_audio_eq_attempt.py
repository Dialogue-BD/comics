"""Reproducibly assemble corrected narration from untouched Gemini dry takes."""
import hashlib,json,subprocess,tempfile
from clean_audio import blend
from pathlib import Path
R=Path(__file__).resolve().parent.parent
FF=['ffmpeg','-hide_banner','-loglevel','error','-y']
def duration(p):return float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(p)]))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
source=R/'audio/_originals/lost-son-narration.wav'
reaction=R/'audio/_originals/lost-son-father-reaction.wav'
closing=R/'audio/_originals/lost-son-closing.wav'
target=R/'audio/lost-son-story.mp3'
# Midpoints of observed acoustic pauses, not word timing interpolation.
# Original sons ends 31.68; next The begins 32.78.
# Original for ends 37.88; next The begins 38.68.
# Original celebration ends 379.68; next He begins 380.80.
cut_a=(31.68+32.78)/2
cut_b=(37.88+38.68)/2
cut_c=(379.68+380.80)/2
normalization='loudnorm=I=-16:TP=-1.5:LRA=11'
with tempfile.TemporaryDirectory(prefix='lost-son-mix-',dir='/private/tmp') as temp:
 norm=[]
 for i,p in enumerate([source,reaction,closing]):
  out=Path(temp)/f'take-{i}.wav'
  subprocess.run(FF+['-i',str(p),'-af',normalization,'-ar','48000','-c:a','pcm_s16le',str(out)],check=True)
  norm.append(out)
 filters=f'[0:a]atrim=end={cut_a},asetpts=PTS-STARTPTS[prefix];[0:a]atrim=start={cut_b}:end={cut_c},asetpts=PTS-STARTPTS[middle];[prefix][1:a][middle][2:a]concat=n=4:v=0:a=1,alimiter=limit=0.841395:level=false[out]'
 unclean=Path(temp)/'assembled-before.wav'
 filtered=Path(temp)/'filtered.wav'
 cleaned=Path(temp)/'cleaned.wav'
 subprocess.run(FF+['-i',str(norm[0]),'-i',str(norm[1]),'-i',str(norm[2]),'-filter_complex',filters,'-map','[out]','-ar','48000','-c:a','pcm_s16le',str(unclean)],check=True)
 # Measured late narrow peaks around 9.05, 9.33, 9.92 and 10.86 kHz.
 cleanup='equalizer=f=9050:t=q:w=30:g=-16,equalizer=f=9330:t=q:w=30:g=-16,equalizer=f=9920:t=q:w=30:g=-14,equalizer=f=10860:t=q:w=30:g=-16,highshelf=f=4500:g=-3,lowpass=f=8500:p=2'
 subprocess.run(FF+['-i',str(unclean),'-af',cleanup,'-c:a','pcm_s16le',str(filtered)],check=True)
 repair=blend(unclean,filtered,cleaned)
 subprocess.run(FF+['-i',str(cleaned),'-codec:a','libmp3lame','-b:a','128k',str(target)],check=True)
reaction_d=duration(reaction);closing_d=duration(closing)
build=dict(delivery='audio/lost-son-story.mp3',delivery_sha256=sha(target),source='audio/_originals/lost-son-narration.wav',source_sha256=sha(source),duration=duration(target),voice='Gacrux',model='Gemini 2.5 Pro Preview TTS',route='signed-in Google AI Studio browser; no API key',normalization=normalization,master='alimiter=limit=0.841395:level=false',ambience='none',takePlacements=[dict(source=str(source.relative_to(R)),start=0,end=cut_a,at=0),dict(source=str(reaction.relative_to(R)),start=0,end=reaction_d,at=cut_a,sha256=sha(reaction)),dict(source=str(source.relative_to(R)),start=cut_b,end=cut_c,at=cut_a+reaction_d),dict(source=str(closing.relative_to(R)),start=0,end=closing_d,at=cut_a+reaction_d+cut_c-cut_b,sha256=sha(closing))],pauseEvidence=dict(first=[31.68,32.78],afterReaction=[37.88,38.68],beforeClosing=[379.68,380.80]))
build['cleanup']=dict(filters=cleanup,**repair)
(R/'production/audio-build.json').write_text(json.dumps(build,indent=2)+'\n')
print(f'Assembled {build["duration"]:.2f}s from three preserved takes.')
