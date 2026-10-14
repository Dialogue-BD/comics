from pathlib import Path
import json,base64,re
from urllib.parse import quote
ROOT=Path(__file__).resolve().parents[2];SRC=Path(__file__).parent
read=lambda n:(SRC/n).read_text()
data=lambda n:json.loads(read(n))
uri=lambda p,m:'data:'+m+';base64,'+base64.b64encode(p.read_bytes()).decode()
icons=data('icons.json');html=read('foundations.template.html')
UI=ROOT/'graphic-design-module/ui'
ui_code=(UI/'dist/entry.js').read_text().replace('</script','<\\/script')
ui_css=(UI/'dist/entry.css').read_text()
# The archived full learning map remains source material for future separate activities.
lang={'foundations':data('language-curriculum.json')['foundations']}
ids={t['id'] for t in lang['foundations']}|{'definition-'+t['concept'] for t in lang['foundations']}
audio={}
for a in data('audio-manifest.json')+data('definition-audio-manifest.json'):
 if a['id'] in ids:audio[a['id']]={**a,'src':uri(ROOT/'graphic-design-module/audio'/(a['id']+'.mp3'),'audio/mpeg')}
assert len(audio)==32
metadata=data('guide-pages.json')
guide={'title':metadata['title'],'author':metadata['author'],'units':{},'prompts':{}}
prompts={'line':'Find a divider, a border, and a path that guides your eye. What does each line do?', 'color':'Compare the hue relationships. Look for one hue, neighboring hues, and opposite hues.', 'shape':'Compare geometric and organic outlines, then see how the shapes work in marks and compositions.', 'texture':'Compare natural surfaces with made patterns. Describe how each one looks.', 'space':'Compare occupied and empty areas. Notice how overlap, spacing, and shading change relationships.', 'form':'Compare flat shapes with illustrations that suggest volume, then explore geometric and organic forms.', 'typography':'Compare letter anatomy, type categories, and functional versus decorative arrangements.', 'contrast':'Find a difference in shape, scale, color, or type. Explain what stands out.', 'hierarchy':'Follow the order of attention. Notice changes in scale, color, space, and perspective.', 'alignment':'Follow shared edges and guides. Compare the visible grid with the resulting layout.', 'balance':'Compare symmetrical, asymmetrical, and radial arrangements. Point to the visual weight on each side.', 'proximity':'Compare the same content in four layouts. Which caption belongs to which image?'}
captions={11:'Lines divide, emphasize, structure, and decorate.',12:'Traditional color wheel and visible spectrum.',13:'Color relationships and palette families.',14:'Shape in outlines, color, and negative space.',15:'Geometric and organic shapes.',16:'Shapes used in familiar marks.',17:'Shapes build compositions, illustrations, and patterns.',19:'Environmental, biological, and made textures.',20:'Patterns in natural and made surfaces.',21:'Positive and negative space.',22:'Spacing, overlap, opacity, light, and perspective.',23:'Shape and suggested three-dimensional form.',24:'Geometric and organic forms.',25:'Letter construction and type anatomy.',26:'Different categories of type.',27:'Functional and decorative typography.',29:'Contrasts in shape, color, scale, type, and arrangement.',31:'Hierarchy through scale, color, space, and perspective.',32:'Hierarchy in editorial layouts.',34:'Grids and approaches to alignment.',36:'Symmetrical, asymmetrical, and radial balance.',38:'The same content with different proximity relationships.'}
for id,ps in metadata['units'].items():
 if id not in prompts:continue
 guide['prompts'][id]=prompts[id]
 guide['units'][id]=[{**p,'src':uri(ROOT/'graphic-design-module/guide-pages'/p['file'],'image/webp'),'caption':captions[p['page']],'alt':f"Gareth David / TastyTuts guide page {p['page']}: {captions[p['page']]}"} for p in ps]
# Reuse the established brand styles and the carefully refined code-native word graphics.
base=read('module.template.html').split('<style>',1)[1].split('__LANGUAGE_CSS__',1)[0]
css=base+'\n'+'\n'.join(read(n) for n in ['typographic-reveals.css','journey.css','design-lessons.css','foundation-english.css','paired-lessons.css'])+'\n'+ui_css+'\n'+read('literary-motion.css')+'\n'+read('paper-craft.css')+'\n'+read('physical-paper.css')+'\n'+read('parallel-poetry.css')+'\n'+read('diction-word-art.css')+'\n'+read('merged-curriculum.css')+'\n'+read('effects-gallery.css')+'\n'+read('visual-first.css')
css+='\n@font-face{font-family:PaperHand;src:url('+uri(ROOT/'graphic-design-module/assets/caveat.ttf','font/ttf')+') format("truetype");font-weight:400 700;font-display:swap}'
material=ROOT/'graphic-design-module/assets/paper-texture.png'
if material.exists():css+='\n:root{--paper-material:url('+uri(material,'image/png')+')}'
app=read('foundations-app.js').replace('__ICONS__',json.dumps(icons)).replace('__FOUNDATIONS_DATA__',json.dumps(lang,ensure_ascii=False)).replace('__AUDIO_DATA__',json.dumps(audio,ensure_ascii=False)).replace('__GUIDE_DATA__',json.dumps(guide,ensure_ascii=False))
visuals=read('foundations.js').split('function foundationVisual(',1)[0].replace("if(!Array.isArray(state.foundationNames))state.foundationNames=[];",'')
visuals+=read('typographic-reveals.js').replace('__SPACE_WORDMARK__',read('space-wordmark.json'))+'\n'+read('design-visuals.js')
english=read('foundation-english.js').replace('__FOUNDATION_ENGLISH__',read('foundation-english.json'))
lessons=read('diction-word-art.js')+'\n'+read('literary-motion.js')+'\n'+read('parallel-poetry.js')+'\n'+read('design-lessons.js').replace('__DESIGN_LESSONS__',read('design-lessons.json'))+'\n'+read('paired-lessons.js').replace('__PAIRINGS__',read('pairings.json'))+'\n'+ui_code+'\n'+read('entry-controller.js')+'\n'+read('merged-curriculum.js').replace('__MERGED_LESSONS__',read('merged-curriculum.json'))
clips={id:{**c,'src':uri(ROOT/'graphic-design-module/guide-crops'/c['file'],'image/webp')} for id,c in data('effect-clips.json').items()}
lessons+='\n'+read('document-forms.js')+'\n'+read('writing-effects.js')+'\n'+read('effects-gallery.js').replace('__EFFECTS_CURRICULUM__',read('effects-curriculum.json')).replace('__EFFECTS_CLIPS__',json.dumps(clips,ensure_ascii=False))+'\n'+read('visual-first.js')
for key,v in {'CSS':css,'APP':app,'VISUALS':visuals,'ENGLISH':english,'LESSONS':lessons,'LOGO':uri(SRC/'dialogue-primary.png','image/png'),'FAVICON':'data:image/svg+xml,'+quote(icons['Palette']),'MOON':icons['Moon'],'TEACHER':icons['GraduationCap'],'PRESENT':icons['Maximize']}.items():html=html.replace('__'+key+'__',v)
assert not re.search(r'__(?:CSS|APP|VISUALS|ENGLISH|LESSONS|LOGO|FAVICON|MOON|TEACHER|PRESENT|PAIRINGS|DESIGN_LESSONS|SPACE_WORDMARK|FOUNDATION_ENGLISH|MERGED_LESSONS|EFFECTS_CURRICULUM|EFFECTS_CLIPS)__',html)
notices=((UI/'dist/THIRD-PARTY-NOTICES.txt').read_text()+'\nCaveat handwriting font\n'+(ROOT/'graphic-design-module/assets/CAVEAT-OFL.txt').read_text()).replace('--','—')
html=html.replace('</body>', '<!-- Third-party software notices\n'+notices+'\n-->\n</body>')
(ROOT/'graphic-design-module.html').write_text(html)
print(f'Built Design: 15 visual/textual pairings + finale, {len(audio)} recordings, {sum(map(len,guide["units"].values()))} original guide pages; {len(html):,} characters')
