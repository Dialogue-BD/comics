from pathlib import Path
import json,base64
from urllib.parse import quote
ROOT=Path(__file__).resolve().parents[2]
SRC=Path(__file__).resolve().parent
html=(SRC/'module.template.html').read_text()
html=html.replace('__FAVICON__','data:image/svg+xml,'+quote(json.loads((SRC/'icons.json').read_text())['Palette']))
html=html.replace('__ICONS__',(SRC/'icons.json').read_text()).replace('__LOGO__','data:image/png;base64,'+base64.b64encode((SRC/'dialogue-primary.png').read_bytes()).decode())
logos=[]
for title,file in [('Nike','nike-11.svg'),('Apple','apple-14.svg'),("McDonald’s",'mcdonalds-5.svg'),('Coca-Cola','coca-cola-2021.svg'),('Amazon','logo-amazon.svg'),('Google','google-1-1.svg'),('Microsoft','microsoft-5.svg'),('Toyota','toyota-car-logo.svg'),('Mercedes-Benz','mercedes-benz-9.svg'),('Facebook','facebook-2020-2-1.svg'),('Adidas','adidas-logo-adidas-icon-free-free-vector.jpg'),('Samsung','Samsung.avif')]:
 p=ROOT/'graphic-design-handoff/reference/famous-brand-logos'/file
 mime={'.svg':'image/svg+xml','.jpg':'image/jpeg','.avif':'image/avif'}[p.suffix]
 logos.append({'title':title,'src':'data:'+mime+';base64,'+base64.b64encode(p.read_bytes()).decode()})
html=html.replace('__LOGOS__',json.dumps(logos))
html=html.replace('__LANGUAGE_CSS__',(SRC/'language.css').read_text()+'\n'+(SRC/'typographic-reveals.css').read_text()+'\n'+(SRC/'engagement.css').read_text()+'\n'+(SRC/'journey.css').read_text()+'\n'+(SRC/'learner-refinements.css').read_text()+'\n'+(SRC/'design-lessons.css').read_text())
html=html.replace('__LANGUAGE_CODE__',(SRC/'language.js').read_text().replace('__LANGUAGE_DATA__',(SRC/'language-curriculum.json').read_text()))
html=html.replace('__FOUNDATION_CODE__',(SRC/'foundations.js').read_text()+'\n'+(SRC/'typographic-reveals.js').read_text().replace('__SPACE_WORDMARK__',(SRC/'space-wordmark.json').read_text())+'\n'+(SRC/'design-visuals.js').read_text()+'\n'+(SRC/'design-lessons.js').read_text().replace('__DESIGN_LESSONS__',(SRC/'design-lessons.json').read_text()))
audio={}
for item in json.loads((SRC/'audio-manifest.json').read_text())+json.loads((SRC/'definition-audio-manifest.json').read_text()):
 audio[item['id']]={**item,'src':'data:audio/mpeg;base64,'+base64.b64encode((ROOT/'graphic-design-module/audio'/(item['id']+'.mp3')).read_bytes()).decode()}
html=html.replace('__LISTENING_CODE__',(SRC/'listening.js').read_text().replace('__LISTENING_DATA__',(SRC/'listening-curriculum.json').read_text()).replace('__AUDIO_DATA__',json.dumps(audio,ensure_ascii=False))+'\n'+(SRC/'engagement.js').read_text()+'\n'+(SRC/'grammar-lessons.js').read_text().replace('__GRAMMAR_DATA__',(SRC/'grammar-lessons.json').read_text())+'\n'+(SRC/'learner-media.js').read_text()+'\n'+(SRC/'journey.js').read_text())
(ROOT/'graphic-design-module.html').write_text(html)
print('Built',ROOT/'graphic-design-module.html',len(html),'characters')
