/* Plain-language teaching beats for the original, timed transcript scenes.
   Times are transcript seconds; this module never changes audio or cue timing. */
export const semanticTimeline = {
  kamille: [
    { visual: 'diagnosis', people: ['Kamille', 'doctor'], moments: [
      [0, 'Many fields can use AI', 'statement', 'records'],
      [4.04, 'Could AI help doctors diagnose faster?', 'question', 'question'],
      [6.2, 'Could AI help doctors diagnose faster?', 'question', 'question']
    ] },
    { visual: 'waiting', people: ['Kamille', 'doctor'], moments: [
      [6.7, 'Kamille describes her diagnosis', 'statement', 'patient'],
      [8.96, 'Doctors took six years to find the cause', 'contrast', 'six-years'],
      [10.88, 'They finally found what she had', 'statement', 'answer']
    ] },
    { visual: 'diagnosis', people: ['Kamille', 'doctor'], moments: [
      [12, 'She imagines a different past', 'uncertain', 'question'],
      [14.7, 'Would earlier AI have helped her?', 'question', 'possible'],
      [17.48, 'She hopes for a quicker diagnosis', 'hope', 'possible']
    ] }
  ],
  robert: [
    { visual: 'family', people: ['Robert', 'young son'], moments: [
      [0, 'Robert says he is medically retired', 'statement', 'father'],
      [3.68, 'He is raising his five-year-old son', 'statement', 'care']
    ] },
    { visual: 'control', people: ['Robert', 'AI system'], moments: [
      [5.84, 'Who should control AI?', 'question', 'question'],
      [6.9, 'Who oversees how it is used?', 'question', 'oversight'],
      [9, 'Who prevents misuse?', 'question', 'oversight']
    ] },
    { visual: 'infrastructure', people: ['Robert', 'community'], moments: [
      [12.76, 'Should companies explain what AI needs?', 'question', 'question'],
      [15.46, 'Data centers need infrastructure', 'statement', 'data-center'],
      [18.38, 'What happens to local economies?', 'question', 'community']
    ] }
  ],
  larissa: [
    { visual: 'mission', people: ['Larissa', 'AI company'], moments: [
      [0, 'Larissa asks AI companies about their purpose', 'question', 'question'],
      [2.72, 'What is your mission?', 'question', 'mission'],
      [3.76, 'What drives you?', 'question', 'mission']
    ] },
    { visual: 'thinking', people: ['Larissa', 'son'], moments: [
      [5.82, 'Could AI take learning opportunities away?', 'question', 'concern'],
      [8.94, 'She wants her son to think for himself', 'concern', 'learning'],
      [12.78, 'He needs to practice his thinking', 'statement', 'learning'],
      [14.1, 'He should analyze ideas at college', 'statement', 'learning']
    ] },
    { visual: 'writing', people: ['Larissa', 'AI writing tool'], moments: [
      [18.76, 'Will AI replace her writing work?', 'question', 'replace'],
      [23.06, 'Could AI work beside her instead?', 'contrast', 'partner'],
      [26.98, 'Could AI suggest ideas and help her think?', 'hope', 'ideas'],
      [30.2, 'She asks; the outcome is not known', 'uncertain', 'ideas']
    ] }
  ],
  daniel: [
    { visual: 'work', people: ['Daniel', 'AI system'], moments: [
      [0, 'Where might people be replaced?', 'question', 'question'],
      [4.76, 'Which parts of work should stay human?', 'question', 'human-work'],
      [8.06, 'Daniel wants some work to remain human', 'statement', 'human-work']
    ] },
    { visual: 'research', people: ['Daniel', 'daughter'], moments: [
      [11.84, 'His daughter has finished her junior year', 'statement', 'daughter'],
      [14.02, 'She wants to study physics for a PhD', 'hope', 'physics'],
      [16.36, 'Could AI make research jobs obsolete?', 'question', 'question']
    ] },
    { visual: 'tasks', people: ['Daniel', 'worker'], moments: [
      [21.96, 'Could AI remove tedious jobs?', 'question', 'tedious'],
      [25.66, 'He is asking about unwanted tasks', 'question', 'tedious']
    ] }
  ],
  scott: [
    { visual: 'growing', people: ['Scott', 'children'], moments: [
      [0, 'Scott wonders how AI will affect his children', 'question', 'question'],
      [2.6, 'Children are growing up with AI', 'statement', 'generation'],
      [7.66, 'He thinks of his own children', 'statement', 'family']
    ] },
    { visual: 'creativity', people: ['Scott', 'children'], moments: [
      [8.66, 'How might AI affect creativity?', 'question', 'question'],
      [11.2, 'How will they understand the world?', 'question', 'world'],
      [13.06, 'How will they use information?', 'question', 'information'],
      [15.3, 'Could AI help them create more?', 'hope', 'create']
    ] },
    { visual: 'time', people: ['Scott', 'daughters'], moments: [
      [17.28, 'Could AI give Scott more family time?', 'question', 'family-time'],
      [18.98, 'He hopes for time with his girls', 'hope', 'family-time']
    ] }
  ],
  tiffany: [
    { visual: 'isolation', people: ['Tiffany', 'neighbors'], moments: [
      [0, 'Tiffany feels unsure about the technology', 'concern', 'hesitant'],
      [3.5, 'She worries people may become isolated', 'concern', 'apart'],
      [6.8, 'She wants people to remember one another', 'contrast', 'together']
    ] },
    { visual: 'empathy', people: ['Tiffany', 'neighbors'], moments: [
      [7.32, 'People share a common humanity', 'statement', 'together'],
      [10.54, 'She calls them brothers and sisters', 'statement', 'together']
    ] },
    { visual: 'access', people: ['Tiffany', 'community members'], moments: [
      [13.2, 'Will everyone have equal access?', 'question', 'question'],
      [18.64, 'She names people with disabilities', 'statement', 'disability'],
      [20.14, 'She includes elderly people', 'statement', 'elderly'],
      [21.16, 'She includes underserved people', 'statement', 'included']
    ] }
  ],
  danielle: [
    { visual: 'empathy', people: ['Danielle', 'neighbor'], moments: [
      [0, 'She wants people to keep life’s human parts', 'concern', 'human'],
      [4.1, 'Some feelings are hard to put into words', 'statement', 'feelings'],
      [6.84, 'Can a machine feel empathy?', 'question', 'question'],
      [9.56, 'She believes machines cannot feel empathy', 'contrast', 'human']
    ] },
    { visual: 'family', people: ['Danielle', 'loved ones'], moments: [
      [14.16, 'Will AI improve life for people she loves?', 'question', 'question'],
      [18.84, 'Will people live happy, fulfilled lives?', 'question', 'possible']
    ] },
    { visual: 'connection', people: ['Danielle', 'neighbors'], moments: [
      [22.46, 'Could AI help people care for one another?', 'hope', 'together'],
      [24.6, 'She imagines AI as a possible catalyst', 'uncertain', 'possible']
    ] }
  ],
  gwen: [
    { visual: 'environment', people: ['Gwen', 'community'], moments: [
      [0, 'Gwen is concerned about environmental harm', 'concern', 'impact'],
      [2.08, 'She worries about marginalized residents', 'concern', 'residents']
    ] },
    { visual: 'balance', people: ['Gwen', 'community'], moments: [
      [5.26, 'Can technology and community safety be balanced?', 'question', 'question'],
      [9.54, 'She asks about stability and safety', 'question', 'safety']
    ] },
    { visual: 'nature', people: ['Gwen', 'community'], moments: [
      [12.48, 'Could AI help nature instead of harming it?', 'question', 'contrast'],
      [16.28, 'This is a question, not a proven result', 'uncertain', 'possible']
    ] }
  ],
  sarah: [
    { visual: 'independence', people: ['Sarah', 'teenage son'], moments: [
      [0, 'Sarah’s youngest son has autism', 'statement', 'son'],
      [1.62, 'He is thirteen', 'statement', 'son'],
      [2.34, 'She thinks about his adult life', 'hope', 'future'],
      [3.92, 'What technology could help him live independently?', 'question', 'question']
    ] },
    { visual: 'path', people: ['Sarah', 'teenage son'], moments: [
      [8.3, 'She wants him to be as independent as possible', 'hope', 'independence'],
      [10.16, 'She imagines him growing into his own life', 'hope', 'future']
    ] },
    { visual: 'support', people: ['Sarah', 'family'], moments: [
      [13.12, 'She is thinking about children with special needs', 'statement', 'children'],
      [15.54, 'Could AI help her teach?', 'question', 'question'],
      [17.68, 'She hopes to support her family well', 'hope', 'family']
    ] }
  ]
};

export function semanticAt(id, sceneIndex, time) {
  const scene = semanticTimeline[id]?.[sceneIndex];
  if (!scene) return null;
  let current = scene.moments[0];
  for (const moment of scene.moments) {
    if (moment[0] <= time) current = moment;
    else break;
  }
  return { visual: scene.visual, people: scene.people, at: current[0], label: current[1], status: current[2], action: current[3] };
}
