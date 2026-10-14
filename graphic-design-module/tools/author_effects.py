"""Independent visual uses and literary effects; examples are not paired subtype equivalences."""
from pathlib import Path
import json
P=Path(__file__).parent
D={k:{'visual':[],'written':[]} for k in ['line','color','shape','texture','form','space','typography','contrast','hierarchy','alignment','balance','proximity','repetition','simplicity','function']}
def v(k,label,art,effect,notice,**extra):
 D[k]['visual'].append(dict(id=k+'-v-'+str(len(D[k]['visual'])),label=label,clip=art if art in CLIPS else None,native=None if art in CLIPS else art,effect=effect,notice=notice,**extra))
def w(k,label,graphic,example,effect,notice,**extra):
 D[k]['written'].append(dict(id=k+'-w-'+str(len(D[k]['written'])),label=label,graphic=graphic,example=example,effect=effect,notice=notice,**extra))
CLIPS=json.loads((P/'effect-clips.json').read_text())
# Visual choices: labels name a use, and the notice points to evidence in the actual guide crop.
for args in [
('Connect and map','line-connect','Branches show relationships.','Follow the shared trunk to the separate icons.'),
('Emphasise','line-emphasise','A rule singles out words.','The underline makes a selected phrase stand apart.'),
('Frame','line-frame','A border encloses one message.','The double frame gives the content a boundary.'),
('Organise','line-structure','Rules organise a sequence.','Each chapter number belongs beside its horizontal rule.'),
('Divide','line-divide','Rules separate editorial areas.','The news page uses lines between its sections.'),
('Decorate and direct','line-decorate','Repeated diagonals create rhythm and lead the eye.','The diagonal strokes occupy corners without enclosing the body text.')]:v('line',*args)
for args in [
('Monochromatic','color-mono','One hue varies in tint, shade, or lightness.','Each strip stays within one colour family.'),
('Analogous','color-analogous','Neighbouring hues create related variation.','The selected hues lie next to each other on this traditional wheel.'),
('Complementary','color-complementary','Opposite hues create a strong relationship of difference.','The wheel joins opposite sides. Intensity still depends on the chosen tones.'),
('Triadic','color-triadic','Three spaced hues distribute colour variety.','Three selected points form a triangle around the wheel.'),
('Warm and cool','color-warm-cool','Hue groups offer different palette directions.','Reds and oranges sit opposite blues and blue-greens; mood depends on context.'),
('Saturation','saturation','Muted and vivid colours have different intensity.','The hue stays while saturation changes.'),
('Value','value','Dark and light values change legibility and focus.','The hue stays while the swatches get lighter.')]:v('color',*args)
for args in [
('Outline, fill, and cut-out','shape-boundaries','A shape can be drawn by its edge, its filled area, or the surrounding space.','The same circular outline appears in three different ways.'),
('Geometric shapes','shape-geometric','Regular shapes provide recognisable building blocks.','Look for straight edges, circles, repeated angles, and symmetry.'),
('Organic shapes','shape-organic','Irregular curves create varied silhouettes.','These contours resemble flowing or natural forms rather than regular polygons.'),
('Shape as a symbol','shape-symbol','A silhouette can carry a recognisable identity.','The marks remain distinct even without colour. Familiarity also matters.'),
('Text as a silhouette','shape-silhouette','Many small marks build one larger outline.','The digits follow the outer circular contour.'),
('Build an illustration','shape-build','Facets combine into a recognisable figure.','Small geometric areas together suggest the head and torso.'),
('Decorative construction','shape-decorate','Simple parts build a more elaborate sign.','Bars, circles, and arcs become a decorative numeral.'),
('Shape as pattern','shape-pattern','A repeated shape makes a surface pattern.','The same angular unit tiles across the field.')]:v('shape',*args)
for args in [
('Environmental surfaces','texture-environment','A depicted surface suggests a material or environment.','Cloud, grain, cracks, and particles have different visible marks.'),
('Biological surfaces','texture-biological','Marks suggest living surfaces.','Stripes, spots, feather lines, and leaf veins organise the surface differently.'),
('Made textures','texture-made','Designed marks can suggest a material or process.','Compare a swirl, camouflage, halftone dots, and brush marks.'),
('Natural pattern','texture-natural-pattern','Repeated structures can come from living or environmental forms.','The wing, cells, clustered forms, and scales repeat in different ways.'),
('Designed pattern','texture-made-pattern','A repeat unit creates regular texture.','Check the repeated checks, tiles, and ornaments.'),
('A repeating motif','texture-motif','One repeat unit links the whole field.','Trace one houndstooth unit before looking at the complete pattern.')]:v('texture',*args)
for args in [
('Figure and ground','space-figure-ground','Occupied and empty areas can define the same silhouette.','Compare the dark capsule with the capsule-shaped opening.'),
('Separate and gather','space-proximity','Gaps change which marks belong together.','The separated marks become a gathered arrangement.'),
('Overlap','space-overlap','Shared areas imply layers and relationships.','Crossing bars create different occupied and empty spaces.'),
('Transparency','space-opacity','Partial transparency reveals shared areas.','Overlaps remain visible through the translucent marks.'),
('Shadow and layer','space-shadow','Shadows suggest which shape sits above another.','The shadow separates the front crossbar from the vertical bar.'),
('Depth through scale','space-depth','Changing size and value can suggest distance.','The bars decrease in size or contrast across the sequence.')]:v('space',*args)
for args in [
('Flat shape to form','form-flat-depth','Shaded faces make a flat outline suggest volume.','The second triangular figure has separate light and dark planes.'),
('Geometric forms','form-geometric','Planes and regular volumes suggest solid construction.','Look at the block letters and faceted structures.'),
('Organic forms','form-organic','Curving volumes suggest softer or irregular solids.','Highlights and shading follow the curved surfaces.'),
('Facets','form-facet','Changes in tone distinguish planes.','Adjacent triangular faces have different values.'),
('Surface ribs','form-ribbed','Repeated shading follows the object’s curvature.','The ribs wrap around the volume rather than lying flat.'),
('Type with depth','form-type','Extrusion and shading turn a letter into an object.','The B has a front face, side faces, and a cast shadow.')]:v('form',*args)
for args in [
('Sans serif','type-sans','Plain finishing strokes create one type treatment.','This R has no serif at the ends of its strokes.'),
('Serif','type-serif','Finishing strokes change the letter’s detail.','Notice the serifs on the R’s stem.'),
('Slab serif','type-slab','Broad serifs give the letter a different texture and weight.','The finishing strokes are thick and block-like.'),
('Rounded','type-rounded','Rounded corners soften the contour of the letter.','The outside and inside corners are rounded.'),
('Script','type-script','Connected, flowing strokes suggest a written gesture.','The R uses a looping stroke rather than a plain stem.'),
('Blackletter','type-blackletter','Broken and angular strokes create a dense type texture.','The R is built from sharp transitions and ornamental strokes.'),
('Decorative and abstract','type-decorative','A letter can also act as an expressive image.','Decoration changes the inside and outside of the R.'),
('Anatomy','type-anatomy','Named letter parts help us describe typography precisely.','The guides identify the stem, counter, serif, and reference lines.'),
('Functional typography','type-functional','Type organises reading as well as displaying words.','Headings, columns, and scale give these pages different reading routes.'),
('Creative typography','type-creative','Type can become a composition or image.','The letter forms are rotated, layered, or given depth.')]:v('typography',*args)
for args in [
('Shape difference','contrast-shape','Unlike contours make a comparison visible.','A smooth circle sits above an angular shape.'),
('Value difference','contrast-value','Light and dark values distinguish marks.','The darker central form stands apart from the lighter surrounding marks.'),
('Scale difference','contrast-scale','A size difference changes emphasis.','The same horizontal direction remains while stroke size changes.'),
('Order and disorder','contrast-layout','An arrangement can contrast with another arrangement.','The upper squares form a grid; the lower squares are scattered.'),
('Type contrast','contrast-type','Differences in type treatment separate text roles.','Compare headings, body copy, and the quotation.'),
('Direction and type','contrast-direction','Rotation and scale create strong visual differences.','Large horizontal words contrast with smaller rotated text.')]:v('contrast',*args)
for args in [
('Scale leads','hierarchy-scale','Large marks can lead attention before small ones.','Follow the descending widths and weights.'),
('Colour leads','hierarchy-color','A tonal difference can prioritise selected marks.','The darker horizontal bars stand apart from the lighter vertical ones.'),
('Layer leads','hierarchy-layer','Overlap and shadow distinguish foreground from background.','The crossbar appears in front of the vertical shape.'),
('Perspective leads','hierarchy-perspective','Depth cues arrange relative prominence.','The nearby-looking bars have more visual presence.'),
('Value leads','hierarchy-value','One darker item gains emphasis in a field of lighter items.','Locate the dark dot before scanning the rest.'),
('Depth leads','hierarchy-depth','Sharpness and shadow separate one focus from the surrounding field.','The sharply visible bar contrasts with more distant-looking marks.')]:v('hierarchy',*args)
for args in [
('Grid','alignment-grid','Shared guides organise several kinds of content.','Compare the empty grid with the page placed on it.'),
('Text columns','alignment-columns','Common edges help the eye enter and leave lines consistently.','The prose blocks follow the same column boundaries.'),
('Rotated axis','alignment-rotation','A composition can share an angled guide.','The headline and related material follow the same rotated direction.'),
('Vertical type','alignment-vertical','Aligned directions can also be vertical.','The tall words form related columns.'),
('Shared baseline','baseline','Different letters can share one reference line.','The letter sizes differ, but their bases meet the same guide.')]:v('alignment',*args)
for args in [
('Symmetrical balance','balance-symmetric','Visual weight is organised around a corresponding structure.','Inspect both sides and the larger page structure; they need not contain identical wording.'),
('Asymmetrical balance','balance-asymmetric','Different objects can distribute visual weight without mirroring.','Compare the large image with the smaller type and objects.'),
('Radial balance','balance-radial','Objects are organised around a centre.','The repeated images lead around the central point.'),
('Weight through size','weight','Size changes the distribution of visual weight.','A large circle has more presence than a small one in this example.'),
('Balance around an axis','axis','A shared axis makes a distribution easy to compare.','Inspect the corresponding forms on either side of the guide.')]:v('balance',*args)
for args in [
('Grouped editorial content','proximity-related','Related items form readable clusters.','Pictures, labels, and text have local relationships.'),
('Clear picture–caption relations','proximity-clear','Close placement supports the intended reading relationship.','The picture names sit near the matching pictures.'),
('Crowded without a clear order','proximity-confused','Closeness alone does not guarantee clarity.','Different items share space without a consistent relationship.'),
('Scattered relations','proximity-scattered','Distance can make the intended association difficult to find.','The text and pictures are dispersed across the page.'),
('Gap between groups','group','A small inside gap and larger outside gap define groups.','Read the two clusters separately.')]:v('proximity',*args)
for args in [
('Repeat a motif','motif','One recurring mark links a field.','A repeated circle is the shared visual unit.'),
('Regular rhythm','regular','Equal intervals create a steady sequence.','The recurring objects have similar spacing.'),
('Alternation','alternating','Two recurring units create an alternating pattern.','Follow the change between green and gold.'),
('Progression','progressive','A repeated unit can change in a systematic way.','The circles grow while remaining circles.'),
('Consistent identity','identity','Repeated style links different messages.','Colour, heading treatment, and divider position recur across the cards.')]:v('repetition',*args)
for args in [
('Remove decoration','clutter','Extra decoration can compete with necessary information.','Compare the ornament with the event details.'),
('Keep essentials','essential','A useful reduction preserves the message’s job.','The event, time, place, and action are retained.'),
('Too little information','too-little','A minimal design can still fail its purpose.','The headline alone does not give the time or place.'),
('One clear route','purposeful','One relevant path can explain a journey clearly.','The line leads from the entrance to the library.'),
('Purposeful whitespace','margin','Room around the content can help its important parts stand out.','The surrounding area separates the message from the edge.')]:v('simplicity',*args)
for args in [
('Inform','inform','A timetable helps someone find information.','The session names, times, and rooms answer practical questions.'),
('Guide','guide','A direction sign helps someone navigate.','The arrow and place name work together.'),
('Invite','invite','An invitation needs details that make attendance possible.','Find the event, time, location, and next action.'),
('Prompt an action','act','A clear control makes the next step apparent.','The button wording identifies an action.'),
('Fit the viewing context','context','A visual must work where and how it will be read.','Consider the size, distance, and information needed.')]:v('function',*args)
# Written uses: short, original English examples and a graphic showing the actual feature.
w('line','Short sentences','stops',['Rain fell.','Leaves shook.','We ran.'],'Each full stop separates a complete movement.','The three stops create a distinct pace; brevity does not always mean excitement.')
w('line','A cumulative sentence','cumulative',['We reached the river,','tired from the climb,','hungry after the long walk.'],'The main clause arrives first; added details extend it.','The sentence is already complete at the first comma.')
w('line','A periodic sentence','periodic',['After the rain stopped,','when the path was clear,','we crossed the bridge.'],'The main clause is delayed until the end.','The first two pieces prepare the reader; the last supplies the main action.')
w('line','Coordination','coordination',['Mina opened the window,','and cool air filled the room.'],'A conjunction connects two independent clauses.','Each side can stand as a sentence; and joins their movements.')
w('line','Subordination','subordinate',['Although it was late,','we stayed.'],'A dependent clause gives the main clause a condition or contrast.','Although introduces a clause that depends on the main statement.')
w('line','A deliberate fragment','fragment',['Footsteps.','Closer now.'],'A fragment can isolate an impression in narrative or dialogue.','These are intentional fragments, not models of complete sentences for every task.')
w('line','A question','question',['Did she hear us?'],'A question opens an unresolved route for the reader.','The question mark identifies the sentence’s job; the text does not supply its answer.')
# Sentence functions from the prototype, shown with one familiar situation.
w('line','A statement','statement',['The door is open.'],'A statement gives the reader information.','The full stop closes a complete statement.')
w('line','An instruction','instruction',['Open the door.'],'An instruction asks someone to do something.','Open names the action. The subject you is understood.',features=['Open'])
w('line','An exclamation','exclamation',['The door is open!'],'An exclamation adds a strong reaction to a statement.','The words give the same information; the exclamation mark adds surprise in this example.')
w('color','Intensity','word-pair',['bright','radiant'],'Radiant suggests light spreading out with greater intensity.','The word art expands in light and detail.',pair='bright')
w('color','Size made precise','word-pair',['small','tiny'],'Tiny narrows the description toward a very small size.','The richer word contracts rather than becoming bigger.',pair='small')
w('color','Connotation','word-pair',['empty','deserted'],'Deserted can suggest absence or abandonment in this scene.','The wording adds an association beyond an unoccupied space.',pair='empty')
w('color','A more specific verb','heavy-word',['walked','trudged'],'Trudged describes walking with effort.','The heavier, downward movement visualises the added sense of effort.')
w('color','Sound in a reporting verb','whisper-word',['said','whispered'],'Whispered tells us how the words were spoken.','The lower, quieter presentation shows the added information; this is a choice about delivery, not just decoration.')
w('color','Register','register',['I need a hand.','I need assistance.'],'Different wording can suit different situations and voices.','Assistance sounds more formal here; the central request remains close.')
for label,form,effect,notice in [
('Letter','letter','Date, greeting, body, closing, and signature give a letter a familiar form.','The placeholder words can change while the layout stays recognisable.'),
('Haiku template','haiku','A compact three-line layout makes a haiku-style template visible.','This shows layout. The traditional English 5–7–5 syllable pattern needs real words; three lines alone do not identify every haiku.'),
('Limerick template','limerick','Five lines, with shorter third and fourth lines, suggest the limerick’s familiar outline.','AABBA is a rhyme plan. Placeholder text demonstrates the planned shape, not actual rhyme or metre.'),
('CV','cv','A name, contact line, and organised experience sections make a CV recognisable.','Repeated entries and dates give the information a scannable shape; CV conventions vary.'),
('Advertisement','ad','A headline, focal image, brief message, and action line create one common ad layout.','This is one useful template, rather than a single required form for all ads.'),
('Newspaper article','newspaper','Headline, deck, byline, and columns give this article a news-page shape.','The wide headline sits above narrower continuous reading columns.'),
('Scientific article','journal','Title, authors, abstract, and organised sections create one journal-article template.','This IMRaD-style layout is common in empirical research, but journal and discipline conventions vary.'),
('Dramatic dialogue','dialogue','Speaker names and turns make a script recognisable.','Indentation and repeated speaker positions distinguish turns from prose narration.'),
('Concrete poem','concrete','The arrangement of words makes a visible silhouette.','The words widen through light and narrow toward here, making a leaf-like silhouette.'),
('Oulipo snowball','snowball','A rule makes each successive word one letter longer.','Our original six-line example grows through 1, 2, 3, 4, 5, and 6 letters; punctuation is not counted.')]:
 w('shape',label,'document' if form not in ['snowball'] else 'snowball',[],effect,notice,form=form)
D['shape']['written'][-1]['example']=['I','am','now','just','small','enough']
w('texture','Alliteration','sound',['Silver streams slide slowly.'],'Repeated initial /s/ sounds link the words.','The highlighted beginnings return like notes.',sound='s',features=['S','s'])
w('texture','Assonance','sound',['Low moans rolled over the road.'],'The repeated vowel sound in low, moans, and rolled links the phrase.','Listen for the shared /oʊ/ sound in a common pronunciation.',features=['Low','moans','rolled'],sound='oʊ')
w('texture','Consonance','sound',['Tap, step, stop.'],'The repeated final /p/ sound links words with different vowels.','The ends, rather than only the beginnings, carry the repeated consonant.',features=['p'],sound='p')
w('texture','Abrupt clusters','rough-sound',['Cracked carts clattered.'],'Stops and consonant clusters make this particular phrase sound abrupt.','The /kr/ and /kl/ beginnings require a different articulation from long flowing vowels.')
w('texture','Flowing phrasing','smooth-sound',['Low waves rolled away.'],'Longer vowels and connected phrasing support flow in this example.','The connected word strips travel over one continuous wave.')
w('texture','Onomatopoeia','sound-words',['Tap.','Tap.','Crack!'],'Sound-evoking words make the event audible in imagination.','The typography distinguishes small repeated taps from the sharper final sound.')
w('texture','Phrase cadence','cadence',['The rain stopped,','the clouds opened,','and sunlight reached the path.'],'Phrase boundaries organise the sentence into a cadence.','The returns follow the phrase groups, rather than a claim that all prose has a musical metre.')
# Form teaches the organisation beneath the document's surface shape.
w('form','Story arc','story-arc',['The radio stopped.','Ben could not fix it.','He asked his friend for help.','They found a loose wire.','The music played again.'],'A problem, growing difficulty, turning point, and outcome give events an underlying arc.','The request changes what happens next; the ending answers the opening problem.',roles=['Problem','Difficulty','Turning point','Response','Outcome'])
w('form','Chiasm','chiasm',['Ben was afraid.','He called for help.','His friend came.','His friend helped him.','Ben was not afraid.'],'Themes return in reverse order around a central event: A–B–X–B′–A′.','Afraid returns as not afraid; help returns as helped. The story remains in logical order.',features=['afraid','help','helped'],roles=['A','B','X','B′','A′'])
w('form','Framed narrative','frame-story',['I told my friend about the storm.','The rain came through our roof.','We moved the beds and stayed together.','My friend listened without speaking.'],'An outer situation encloses the story being told.','The telling and listening frame the remembered events.',roles=['Outer frame','Inner story','Inner story','Outer frame'])
w('form','Flashback','flashback',['Mina found the old key.','Years ago, her father had given it to her.','Now she knew which door to try.'],'A return to the past gives a present event new significance.','Years ago moves back in story time; now brings the reader to the present.',roles=['Present','Past','Present'])
w('form','Parallel story strands','story-strands',['Mina waited by the gate.','Ben searched for the key.','Mina heard footsteps.','Ben ran toward the gate.','They met at last.'],'Alternating strands let separate actions develop before they converge.','Mina and Ben occupy different strands until the shared final event.',roles=['Mina','Ben','Mina','Ben','Together'],groups=[0,1,0,1,2])
w('form','Turning point','turning-point',['Ben planned to leave.','Then he heard a child crying.','He stayed to help.'],'A decisive event changes the direction of the action.','The middle event turns leaving into staying; it is not simply a decorative central line.',roles=['Before','Change','After'])
w('space','Ellipsis: trailing off','ellipsis',['“I thought you might…”'],'An ellipsis can leave a spoken thought unfinished.','The three dots allow the sentence to trail away; they do not state the missing ending.')
w('space','Dash: interruption','interruption',['“I was going to—”','“We have to leave.”'],'A dash can mark an abrupt cut-off.','The second voice enters before the first thought is completed.')
w('space','Paragraph break','paragraph-gap',['He heard a voice inside. His hand fell.','He waited.'],'A blank interval can give the last action room and attention.','The words stay in order; the gap changes their grouping and pace.')
w('space','Scene break','scene-break',['The last train left the city.','At dawn, Mina woke beside the sea.'],'A marked gap can signal a change of time or scene.','The separated blocks belong to different moments.')
w('space','End-stopped line','end-stop',['The door was closed.','The room was still.'],'A line ending and punctuation can work together as a stop.','Each line ends with a completed sentence.')
w('space','Enjambment','enjambment',['She held the cup','until her hands grew warm.'],'A grammatical thought can continue over the line break.','The line break does not end the sentence; the connection crosses it.')
w('space','Omitted reply','omission',['“Will you come back?”','He looked at the road.'],'An unanswered question leaves a meaningful gap.','The action is given, but his answer is withheld; several interpretations remain possible.')
w('space','Parenthetical pause','parenthesis',['She came','as she had promised','before dark.'],'An aside can momentarily step out of the main sentence.','The parenthetical remark adds information while the main sentence continues.')
w('space','Reading between the lines','ghost',['Mina glances at her guest’s coat.','“You’re leaving already?”'],'Literal words can support more than one possible implication.','The context supports possible wishes or concerns; no one ghost thought is guaranteed.',ghosts=['I hoped you’d stay.','I thought we had more time.','Have I upset you?'])
w('space','Gesture and words','ghost',['“I’m fine,” Mina said.','She folded the letter again.'],'An action can complicate the spoken message.','The repeated folding may invite concern, but it does not prove what she feels.',ghosts=['I’m worried.','I don’t want to discuss it.'])
w('space','Indirect request','ghost',['The window stood open.','“It’s cold in here,” Mina said.'],'Context can make a statement function as a request.','Please close the window is a plausible inference, rather than the literal wording.',ghosts=['Could you close the window?'])
w('space','Possible irony','ghost',['Rain flooded the road.','“Wonderful weather,” Mina said.'],'The situation can make apparently positive words ironic.','Tone would help confirm whether she is being ironic.',ghosts=['This weather is awful.'])
w('space','Understatement','understatement',['Water covered the floor.','“It’s a little wet,” Mina said.'],'The wording deliberately presents less intensity than the situation suggests.','A little contrasts with the large amount of water shown in the context.')
w('space','Different knowledge','knowledge',['The key is inside the coat.','“The key is gone,” Mina said.'],'A reader can know something that a character does not.','The separate layers show reader knowledge and character belief.',ghosts=['The reader knows where it is.'])
w('typography','Contrastive stress','stress',['She said she had seen HIM leave.'],'Stress can correct which person was seen.','The noun/pronoun is foregrounded; a different stressed word would change the contrast.',features=['HIM'])
w('typography','Italics for inner thought','inner-thought',['She smiled.','Not again, she thought.'],'A writer can use a type treatment to distinguish a thought from narration.','This is one convention for presenting thought, not a compulsory format.')
w('typography','Emphatic repetition','stress',['No. No. NO.'],'A growing type treatment can represent increasing emphasis.','The words repeat while their presentation becomes more forceful.',features=['NO'])
w('typography','Different voices','voices',['“Stay,” Mina said.','“Only a moment,” Leo replied.'],'Distinct presentation can help a reader distinguish speakers.','Turn position and type treatment mark the voices; fonts do not determine personality.')
w('typography','Quoted words','quotation',['Mina read the note:','“Meet me at dawn.”'],'Quotation marks identify words presented as someone’s wording.','The quoted message is framed inside the surrounding narration.')
w('typography','Headings and emphasis','heading',['Before the journey','Mina packed a map, water, and a torch.'],'A heading signals the topic and makes a section easier to find.','The headline and body have distinct jobs; bold type alone does not supply an argument.')
w('contrast','Antithesis','antithesis',['Her pockets were empty;','her notebook was full.'],'Opposed ideas in a matching clause pattern make the contrast clear.','Empty and full occupy corresponding positions.',features=['empty','full'])
w('contrast','Juxtaposition','juxtaposition',['A busy road ran beside a quiet garden.'],'Adjacent unlike images invite comparison.','Busy and quiet are put close enough for the reader to compare them.',features=['busy','quiet'])
w('contrast','Long, then short','long-short',['We walked along the wet path, past the empty houses, and down toward the river.','Then we stopped.'],'A short sentence can land differently after a longer one.','The unequal sentence lengths make the change of pace visible.')
w('contrast','Although','subordinate',['Although the room was crowded,','Mina felt alone.'],'A concessive clause contrasts an expectation with what happens.','Crowded and alone describe different sides of the situation.')
w('contrast','However','turn',['The map was clear.','However, the path had disappeared.'],'A connective marks a turn between statements.','However signals that the second statement complicates the first.')
w('contrast','Expectation and reversal','reversal',['She opened the large gift.','Inside was a tiny key.'],'A reveal can contrast with a reader’s expectation.','Large and tiny are arranged as setup and reveal, rather than as a universal rule about surprises.')
w('hierarchy','Point before support','argument',['Trees can cool a street.','Their leaves provide shade.','The path beneath this tree feels cooler.'],'A main point gives the supporting information a place to belong.','The point, reason, and example have distinct roles.',roles=['Point','Reason','Example'])
w('hierarchy','Delayed main point','periodic',['After three missed buses,','after a long walk in the rain,','Mina finally reached home.'],'The main event can arrive after its preparation.','The last part supplies the action that the opening has held back.')
w('hierarchy','Background and foreground','background',['While the room grew darker,','Mina lit a candle.'],'A subordinate clause can supply background for the main action.','The background remains visible while the main action gains emphasis.')
w('hierarchy','Known to new','theme-chain',['A tree shaded the path.','The path led to a house.','The house had a red door.'],'A returning element can carry the reader toward new information.','Path and house return as the next sentence’s starting points.',features=['path','house'])
w('hierarchy','End-weight','end-weight',['Mina carried','a heavy wooden box filled with old maps.'],'A short opening can lead toward a longer information group.','The longer object phrase sits at the end; this is one useful arrangement, not the only correct one.')
w('hierarchy','Section headings','heading',['A place to wait','The station had one small room and a bench beside the window.'],'A heading prepares the reader for the section beneath it.','The section marker has more prominence than its supporting detail.')
w('alignment','Parallel verbs','parallel',['She wanted to read the story,','understand the ending,','and explain the characters.'],'Matching grammatical forms organise a series.','Read, understand, and explain share the same verb form.',features=['read','understand','explain'])
w('alignment','Parallel clauses','parallel',['We came to listen.','We stayed to learn.'],'Corresponding clause patterns make a relationship easy to follow.','The subjects and verbs sit in corresponding positions.',features=['We','to'])
w('alignment','Related meaning','semantic-pair',['The sea became calm.','The waves lay still.'],'Different words can develop a related image.','Calm and still correspond in meaning without being identical grammar.',features=['calm','still'])
w('alignment','Contrasting parallels','semantic-pair',['Mina spoke in a whisper.','Leo answered with a shout.'],'Corresponding positions can carry opposing meanings.','The voices differ, but the two clauses form a related pattern.',features=['whisper','shout'])
w('alignment','Stanza correspondence','stanza',['The sea saw it and ran away.','The Jordan River turned back.','The mountains jumped like rams.','The hills jumped like lambs.','Sea, why did you run away?','Jordan River, why did you turn back?','Mountains, why did you jump like rams?','Hills, why did you jump like lambs?'],'Descriptions return as questions about the same four images.','The short adaptation and two-stanza teaching layout use Psalm 114:3–6; the source and context remain in the lesson.')
w('alignment','A consistent list','parallel',['reading reports,','writing summaries,','presenting findings.'],'A series can share a consistent grammatical shape.','The three -ing forms begin their items in the same way.',features=['reading','writing','presenting'])
w('balance','Colon: explanation','colon',['The room grew quiet','everyone had left.'],'A colon can introduce an explanation of a complete statement.','The second clause explains why the room grew quiet; clause lengths need not be equal.')
w('balance','Semicolon: related statements','semicolon',['The river rose','the bridge disappeared.'],'A semicolon can join related independent clauses.','Each side is complete; the mark shows a close relationship without supplying a conjunction.')
w('balance','Paired clause pattern','balanced-clauses',['She kept the map','he kept the key.'],'A matching grammatical pattern can balance two related actions.','The parallel clauses distribute the actions between two people.')
w('balance','Comma after a dependent opening','subordinate',['Although it rained,','we continued.'],'A comma can mark the boundary before the main clause.','The first clause depends on the second. A comma does not always join two independent clauses.')
w('balance','Dash: a reveal','dash-reveal',['We found one thing','the missing key.'],'A dash can foreground an added reveal.','The second piece identifies the thing; it need not be a complete clause.')
w('balance','Periods: separate statements','stops',['The lamp went out.','Its battery was empty.'],'Separate sentences give each statement its own stop.','This version is grammatical. It presents two statements rather than explicitly introducing an explanation.')
w('proximity','Paragraph focus','groups',['Mist covered the river.','The water was still.','The boat’s paint was peeling.','A rope lay beside the oar.'],'A paragraph gathers details with a shared focus.','Water details and boat details form two local groups.',groups=[0,0,1,1],names=['Water','Boat'])
w('proximity','Parenthesis','parenthesis',['Mina returned','to everyone’s relief','before dark.'],'Parentheses place an aside inside its host sentence.','The paired marks keep the extra comment together while the main sentence continues.')
w('proximity','Square brackets','brackets',['“She','Mina','closed the door.”'],'Square brackets can identify an editor’s inserted clarification.','This original teaching quotation shows [Mina] clarifying she; the addition is visibly marked.')
w('proximity','Apposition','apposition',['Leo,','Mina’s brother,','held the door.'],'An adjacent noun phrase can rename or explain a person.','Mina’s brother identifies Leo. The phrase stays next to the person it explains.')
w('proximity','Pronoun and antecedent','reference',['Mina found a boat.','It lay beside the river.'],'A pronoun links back to an earlier noun.','It refers to a boat; the highlight makes the relationship visible.',features=['a boat','It'])
w('proximity','A footnote','footnote',['Mina marked the path¹ on her map.','1. The route beside the river.'],'A reference marker links the reading to a nearby note.','The matching 1 carries the association even when the note sits outside the sentence.')
w('proximity','Quotation and commentary','quote-comment',['“Meet me at dawn,” the note said.','Mina put it beside her bag.'],'Related commentary helps a quoted message stay in its local context.','The quote and immediate response form one short reading group.')
w('repetition','Anaphora','anaphora',['She remembered the path.','She remembered the bench.','She remembered the house.'],'A repeated beginning links separate statements.','She remembered returns at the start.',features=['She remembered'])
w('repetition','Epistrophe','epistrophe',['She waited by the river.','She searched by the river.','She rested by the river.'],'A repeated ending links separate statements.','By the river returns at the end.',features=['by the river'])
w('repetition','Anadiplosis','theme-chain',['The wait brought fear.','Fear brought silence.'],'An ending returns as the next beginning.','Fear makes the link between the two sentences.',features=['fear','Fear'])
w('repetition','Refrain','refrain',['The wind rose.','Still, we continued.','The rain fell.','Still, we continued.'],'A line returns at intervals.','Still, we continued is the returning line.',features=['Still, we continued.'])
w('repetition','Inclusio / bookends','bookends',['We left the river at dawn.','We walked through the hills.','At last, we returned to the river.'],'A returning image frames the passage.','The river occurs at both the opening and the close.',features=['river'])
w('repetition','Motif','motif-text',['A red ribbon tied the box.','Later, a red ribbon marked the door.','She kept a red ribbon in her pocket.'],'A recurring detail can connect different parts of a story.','The ribbon returns in different situations; its larger meaning depends on the story.',features=['red ribbon'])
w('repetition','Polysyndeton','conjunctions',['We waited and listened and watched and hoped.'],'Repeated conjunctions can give each action a returning beat.','And links every item, rather than appearing only before the last.',features=['and'])
w('simplicity','Cut filler','cut',['It is important to note that','the gate is closed.'],'Removing an unnecessary opening brings the useful fact forward.','The essential information remains.',remove=[0])
w('simplicity','Remove overlap','cut',['We planned','ahead for the future.'],'Overlapping wording can repeat information already present.','Planned already points ahead in this short example.',remove=[1])
w('simplicity','One precise verb','replace',['She made a quick movement towards the door.','She rushed to the door.'],'A precise verb can replace a longer description.','Rushed combines movement and speed; it also makes the description more specific.')
w('simplicity','Direct actor and action','replace',['The door was opened by Mina.','Mina opened the door.'],'A direct subject–verb route can foreground the actor.','The active version puts Mina first. Passive wording can be useful when the door is the focus.')
w('simplicity','Grammatical ellipsis','omitted-verb',['Mina carried a map;','Leo, a torch.'],'A recoverable verb can be omitted from a parallel clause.','The second clause borrows carried from the first; this compact form suits some contexts.')
w('simplicity','Keep the necessary reason','keep-purpose',['He took a deep breath','to calm himself.'],'A concise sentence should still retain the information the task needs.','Removing the purpose would change what the reader understands.')
w('simplicity','Oulipo lipogram','lipogram',['Rain taps on old tin roofs.'],'A chosen letter is excluded from the text.','This original sentence contains no e. The restriction is a creative design rule, rather than a general rule of good writing.',exclude='e')
w('function','Narrative','sequence',['Mina turned the key.','The door opened.','She stepped inside.'],'A narrative follows particular events.','The sequence forms a story route.')
w('function','Explanation','cause',['The power failed.','The lamp went out.'],'An explanation connects a cause and an effect.','The causal arrow explains the relationship rather than only presenting two events.')
w('function','Description','description',['Light rested on a chipped blue cup.'],'Description develops the qualities of a person, place, or object.','The words add light, surface, and colour to one object.',features=['Light','chipped','blue'])
w('function','Argument','argument',['Keep the library open later.','Evening access could help students after work.'],'An argument gives a position and supporting reason.','The first sentence proposes a choice; the second supports it.',roles=['Position','Reason'])
w('function','Instruction','instructions',['Open the lid.','Place the battery inside.','Close the lid.'],'Instructions organise actions for someone to carry out.','Numbering and imperative verbs provide a practical route.')
w('function','Reflection','reflection',['I used to rush.','Now I notice the small details.'],'Reflection can compare an earlier view with a changed understanding.','Used to and now distinguish the two perspectives.')
w('function','Inquiry','question',['Why had the path disappeared?'],'An inquiry opens a question to investigate.','The question asks for an explanation; it does not already provide one.')
# Shape teaches the visible page form; Form teaches underlying literary structure.
D['shape_core']={
 'goal':'Recognise how visual outlines and document layouts give a message a form.',
 'labs':[
 {'label':'Letter','form':'letter','text':['Date, greeting, body paragraphs, closing, and signature.'],'effect':'The page groups a message around familiar letter conventions.'},
 {'label':'Haiku template','form':'haiku','text':['Three compact lines. A traditional English haiku template often uses 5–7–5 syllables.'],'effect':'The line pattern is visible. Placeholder text alone does not establish syllables or poetic content.'},
 {'label':'CV','form':'cv','text':['Name and contact details, followed by grouped experience and education.'],'effect':'Headings, dates, and repeated entries make the information easy to scan.'}],
 'manipulate':{'kind':'match','prompt':'Match each document name to its placeholder-text template. Use the arrangement, rather than the words.','left':['Letter','Haiku template','CV','Advertisement','Newspaper article','Scientific article'],'right':['Letter layout','Three-line layout','CV layout','Advertisement layout','Newspaper layout','Scientific article layout'],'rightForms':['letter','haiku','cv','ad','newspaper','journal'],'answer':[0,1,2,3,4,5],'reason':'Dates and a signature identify the letter; three compact lines give the haiku template; dated sections give the CV; headline and action give the ad; columns give the news page; abstract and sections give the journal template.'},
 'transfer':{'kind':'choose','prompt':'Which page shape would best organise work experience, education, and contact details?','tiles':['A three-line poem template','A CV template','An advertisement template'],'optionForms':['haiku','cv','ad'],'answer':1,'reason':'The CV template groups experience and education under headings and places contact information near the name. The other shapes serve different jobs.'}
}
D['form_core']={
 'goal':'Trace how an underlying story structure gives events depth and direction.',
 'labs':[
  {'label':'Story arc','visual':'structure-arc','value':0,'text':['The radio stopped.','Ben could not fix it.','He asked his friend for help.','They found a loose wire.','The music played again.'],'effect':'The request is a turning point; the outcome resolves the opening problem.'},
  {'label':'Thematic chiasm','visual':'structure-chiasm','value':50,'text':['Ben was afraid.','He called for help.','His friend came.','His friend helped him.','Ben was not afraid.'],'effect':'A–B–X–B′–A′: afraid and help return around the friend’s arrival.'},
  {'label':'A story within a story','visual':'structure-frame','value':100,'text':['I told my friend about the storm.','The rain came through our roof.','We moved the beds and stayed together.','My friend listened without speaking.'],'effect':'The present act of telling frames the remembered events.'}],
 'manipulate':{'kind':'order','prompt':'Build this short story: problem → difficulty → request for help → response → outcome.','tiles':['The radio stopped.','Ben could not fix it.','He asked his friend for help.','They found a loose wire.','The music played again.'],'answer':[0,1,2,3,4],'reason':'The request changes the situation. The response finds the cause; the outcome answers the opening problem.'},
 'transfer':{'kind':'choose','prompt':'In this five-step chiasm, which sentence is the centre around which afraid and help return?','case':['Eva was afraid.','She asked for help.','Her friend arrived.','Her friend helped her.','Eva was not afraid.'],'tiles':['Eva was afraid.','Her friend arrived.','Eva was not afraid.'],'answer':1,'reason':'The arrival is the central event. Afraid returns as not afraid; help returns as helped on either side.'}
}
(P/'effects-curriculum.json').write_text(json.dumps(D,ensure_ascii=False,indent=2)+'\n')
print('Authored',sum(len(x['visual']) for x in D.values() if 'visual' in x),'visual uses and',sum(len(x['written']) for x in D.values() if 'written' in x),'written effects.')
