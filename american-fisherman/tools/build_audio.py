"""Trim the source track announcement, normalize, and preserve voice performances."""
import hashlib,json,subprocess
from pathlib import Path
ROOT=Path(__file__).resolve().parent.parent
source=ROOT/'audio/_originals/american-fisherman-source.mp3'
target=ROOT/'audio/fisherman-story.mp3'
filters='atrim=start=7,asetpts=PTS-STARTPTS,loudnorm=I=-16:TP=-1.5:LRA=11'
subprocess.run(['ffmpeg','-hide_banner','-loglevel','error','-y','-i',str(source),'-af',filters,'-ar','48000','-codec:a','libmp3lame','-b:a','128k',str(target)],check=True)
duration=float(subprocess.check_output(['ffprobe','-v','error','-show_entries','format=duration','-of','default=nw=1:nk=1',str(target)]))
build=dict(source=str(source.relative_to(ROOT)),delivery=str(target.relative_to(ROOT)),source_sha256=hashlib.sha256(source.read_bytes()).hexdigest(),delivery_sha256=hashlib.sha256(target.read_bytes()).hexdigest(),filters=filters,trimStart=7,trimEnd='none',ambience='original only; no added ambience',duration=duration,voice='all original source actors; no substitutions',model='source model unknown')
(ROOT/'production/audio-build.json').write_text(json.dumps(build,indent=2)+'\n')
print(duration)
