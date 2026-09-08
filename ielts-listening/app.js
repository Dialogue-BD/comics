(function () {
  'use strict';

  var $ = function (s, root) { return (root || document).querySelector(s); };
  var $$ = function (s, root) { return Array.prototype.slice.call((root || document).querySelectorAll(s)); };

  var TRACKS = {
    harper: { src: 'assets/audio/s1-harper.m4a', title: 'Harper Holiday Job Agency', duration: '2:04' },
    travel: { src: 'assets/audio/s1-travel-agent.mp3', title: 'The Travel Depot', duration: '7:26', start: 120 },
    tour: { src: 'assets/audio/s1-london-tour.mp3', title: 'Booking a London tour', duration: '4:29' },
    trains: { src: 'assets/audio/s2-trains.mp3', title: 'A Story of Trains', duration: '6:44' },
    property: { src: 'assets/audio/s2-property.mp3', title: 'Property investment talk', duration: '5:40' },
    alice: { src: 'assets/audio/s3-alice-tom.m4a', title: 'Alice and Tom divide the tasks', duration: '1:10' },
    solar: { src: 'assets/audio/s3-solar.mp3', title: 'Solar power presentation', duration: '7:21' },
    vegetarian: { src: 'assets/audio/s3-vegetarian.mp3', title: 'Helen the Vegetarian', duration: '6:25' },
    osteopathy: { src: 'assets/audio/s4-osteopathy.mp3', title: 'Discussion about Osteopathy', duration: '6:12' },
    dolphins: { src: 'assets/audio/s4-dolphins.mp3', title: 'Behaviour of Dolphins', duration: '5:09' }
  };

  var PRINT_PDFS = {
    harper: 'assets/worksheets/part1-harper-form-2up.pdf',
    tour: 'assets/worksheets/part1-london-tour-2up.pdf',
    travel: 'assets/worksheets/part1-travel-depot-2up.pdf',
    trains: 'assets/worksheets/part2-story-of-trains-2up.pdf',
    property: 'assets/worksheets/part2-property-talk-2up.pdf',
    alice: 'assets/worksheets/part3-alice-tom-2up.pdf',
    vegetarian: 'assets/worksheets/part3-vegetarian-research-2up.pdf',
    solar: 'assets/worksheets/part3-solar-presentation-2up.pdf',
    dolphins: 'assets/worksheets/part4-dolphin-lecture-2up.pdf',
    osteopathy: 'assets/worksheets/part4-osteopathy-talk-2up.pdf'
  };

  function gap(n, prompt, answers, maxWords, hint) {
    return { n: n, type: 'gap', prompt: prompt, answers: answers, maxWords: maxWords || 3, hint: hint || '' };
  }
  function mc(n, prompt, options, answer) {
    return { n: n, type: 'mc', prompt: prompt, options: options, answer: answer };
  }
  function multi(n, prompt, options, answers) {
    return { n: n, type: 'multi', prompt: prompt, options: options, answers: answers, points: answers.length };
  }
  function match(n, prompt, options, answer) {
    return { n: n, type: 'match', prompt: prompt, options: options, answer: answer };
  }

  var ABC = function () { return Array.prototype.slice.call(arguments); };
  var SETS = {
    harper: {
      id: 'harper', title: 'Harper Holiday Job Agency', short: 'Harper form', part: 1, track: 'harper', skill: 'precision',
      instruction: 'Complete the application. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.',
      groups: [{ title: 'Application for temporary work', questions: [
        gap(1, 'Surname: Lily ______', ['claremont'], 1, 'A name will be spelled.'),
        gap(2, 'Date of birth: ______ (dd/mm/yy)', ['23/04/89', '23-04-89', '23 04 89', '23/4/89', '23-4-89'], 1, 'Listen for a correction or comparison.'),
        gap(3, 'Work wanted from June to ______', ['august'], 1),
        gap(4, 'Where work wanted: ______', ['scotland'], 1),
        gap(5, 'Another possible location: ______', ['abroad', 'overseas'], 1)
      ]}]
    },
    tour: {
      id: 'tour', title: 'Booking a London Tour', short: 'London tour', part: 1, track: 'tour', skill: 'distractors',
      instruction: 'Questions 1–5: complete the form. Questions 6–8: choose THREE letters. Questions 9–10: choose one answer.',
      groups: [
        { title: 'Customer and tour details', questions: [
          gap(1, 'They will be coming to London on ______', ['10 july', '10th july', 'july 10', 'july 10th', '10/07'], 2),
          gap(2, 'He is going with his sister and his ______', ['parents'], 1),
          gap(3, 'Adult ticket: £ ______', ['29', '£29'], 1),
          gap(4, 'Child ticket: £ ______', ['14', '£14'], 1),
          gap(5, 'Tours finish at ______', ['6pm', '6 pm', '18:00', '6.00 pm'], 2)
        ]},
        { title: 'Places and booking', questions: [
          multi('6–8', 'Which THREE places would the tourist like to see?', ABC('A. Buckingham Palace', 'B. Big Ben', 'C. Harrods', 'D. Houses of Parliament', 'E. Hyde Park Corner', 'F. St Paul’s Cathedral', 'G. London Eye'), ['B', 'D', 'G']),
          mc(9, 'How will the tourist buy the tickets?', ABC('A. By phone', 'B. Online', 'C. On the bus'), 'B'),
          mc(10, 'How long before he leaves should he buy his tickets?', ABC('A. 1 week', 'B. 6 weeks', 'C. 3 months'), 'A')
        ]}
      ]
    },
    travel: {
      id: 'travel', title: 'The Travel Depot', short: 'Travel Depot', part: 1, track: 'travel', start: 120, skill: 'distractors',
      instruction: 'Choose one answer for Questions 1–2. Complete Questions 3–10 using NO MORE THAN TWO WORDS OR A NUMBER.',
      groups: [
        { title: 'Choose the precise statement', questions: [
          mc(1, 'The travel agent…', ABC('A. thinks Europe is a good destination', 'B. can personally recommend Vancouver', 'C. does not think America is a good choice'), 'B'),
          mc(2, 'The customer…', ABC('A. is going to Europe next year', 'B. knows people living in Canada', 'C. wants to go to the warmest place'), 'B')
        ]},
        { title: 'Flight reservation form', questions: [
          gap(3, 'Customer’s name: Jim ______', ['jackson'], 1),
          gap(4, 'Home contact number: 0151 ______', ['433398', '433 398'], 1),
          gap(5, 'Flight number: ______', ['vn217', 'vn 217'], 1),
          gap(6, 'Length of stay: ______ nights', ['20', 'twenty'], 1)
        ]},
        { title: 'Insurance and total', questions: [
          gap(7, 'The agent recommends ______ cover for peace of mind.', ['travel insurance', 'insurance'], 2),
          gap(8, 'The best cover is offered with the ______ Star policy.', ['gold'], 1),
          gap(9, 'A theatre play costs $ ______', ['54', '$54'], 1),
          gap(10, 'The flight and insurance together cost £ ______', ['433', '£433'], 1)
        ]}
      ]
    },
    trains: {
      id: 'trains', title: 'A Story of Trains', short: 'Story of trains', part: 2, track: 'trains', skill: 'prediction',
      instruction: 'Write NO MORE THAN TWO WORDS AND/OR A NUMBER. If there is no information, write X.',
      groups: [
        { title: 'Train table', questions: [
          gap(11, 'Overlander — distance: ______ km', ['681'], 1),
          gap(12, 'Transalpine — highlight: 16 ______', ['tunnels'], 1),
          gap(13, 'Transalpine — time: ______ hours', ['5', 'five'], 1),
          gap(14, 'Transcoastal — distance: ______', ['x'], 1, 'The instructions allow X.'),
          gap(15, 'Transcoastal — highlight: ______', ['whale watching', 'whalewatching'], 2)
        ]},
        { title: 'Journey summary', questions: [
          gap(16, 'Taking three days, the ______ is one of the world’s longest train journeys.', ['indian pacific', 'the indian pacific'], 2),
          gap(17, 'The Ghan passes through towns built by the ______', ['early settlers', 'settlers'], 2),
          gap(18, 'A sculpture marks the laying of the ______ concrete sleeper.', ['millionth'], 1),
          gap(19, 'The Overland first travelled between two ______', ['states'], 1),
          gap(20, 'It is the oldest journey of its kind on ______', ['the continent', 'continent'], 2)
        ]}
      ]
    },
    property: {
      id: 'property', title: 'Property Investment Talk', short: 'Property talk', part: 2, track: 'property', skill: 'monologue',
      instruction: 'Choose one answer for Questions 11–15. Answer Questions 16–20 using NO MORE THAN THREE WORDS OR A NUMBER.',
      groups: [
        { title: 'Multiple choice', questions: [
          mc(11, 'Who is the speaker addressing?', ABC('A. Property agents', 'B. People selling houses', 'C. People in the countryside', 'D. People buying second homes'), 'D'),
          mc(12, 'Rental property in the city…', ABC('A. is very easy to find', 'B. is becoming more difficult to find', 'C. is an investment opportunity', 'D. is often the only option'), 'B'),
          mc(13, 'Lisa Brown believes…', ABC('A. most people will own their home at some time', 'B. there is a psychological factor in owning a home', 'C. most young people need a deposit before they can buy'), 'B'),
          mc(14, 'Country property is more popular because…', ABC('A. people want to escape the city', 'B. city areas are overcrowded', 'C. home offices mean some people need not commute', 'D. public transport now serves outlying areas'), 'C'),
          mc(15, 'What kind of properties does the speaker specialise in?', ABC('A. Commercial', 'B. Investment', 'C. First homes', 'D. Rural'), 'B')
        ]},
        { title: 'Short answers', questions: [
          gap(16, 'What end of the market are the properties?', ['cheaper end', 'the cheaper end', 'cheaper'], 3),
          gap(17, 'What does the speaker compare buying houses with?', ['having a pension', 'a pension', 'pensions', 'pension'], 3),
          gap(18, 'What kind of equity can result from buying when the market is high?', ['negative', 'negative equity'], 2),
          gap(19, 'How does she describe careful but successful investment?', ['enormously satisfying'], 2),
          gap(20, 'How can you ask the speaker a question?', ['raise your hand', 'raise hand'], 3)
        ]}
      ]
    },
    alice: {
      id: 'alice', title: 'Alice and Tom Divide the Tasks', short: 'Alice & Tom', part: 3, track: 'alice', skill: 'speakers',
      instruction: 'Who will do each task? Choose A Alice, B Tom, or C Both Alice and Tom.',
      groups: [{ title: 'Project roles', questions: [
        match(1, 'Take photographs', ABC('A. Alice', 'B. Tom', 'C. Both Alice and Tom'), 'B'),
        match(2, 'Interview shop owners', ABC('A. Alice', 'B. Tom', 'C. Both Alice and Tom'), 'A'),
        match(3, 'Do a survey with shoppers', ABC('A. Alice', 'B. Tom', 'C. Both Alice and Tom'), 'C'),
        match(4, 'Analyse data', ABC('A. Alice', 'B. Tom', 'C. Both Alice and Tom'), 'B')
      ]}]
    },
    vegetarian: {
      id: 'vegetarian', title: 'Helen the Vegetarian', short: 'Vegetarian research', part: 3, track: 'vegetarian', skill: 'speakers',
      instruction: 'Choose one answer for Question 21. Use NO MORE THAN TWO WORDS for 22–24 and 25–26. Label the diagram with NO MORE THAN THREE WORDS.',
      groups: [
        { title: 'Viewpoint and facts', questions: [
          mc(21, 'Helen became a vegetarian…', ABC('A. sixteen years ago', 'B. because of family influences', 'C. for personal reasons'), 'C'),
          gap(22, 'What is the most important food source for vegetarians?', ['soya', 'soya bean', 'soy', 'soy bean'], 2),
          gap(23, 'What do most countries do to vegetables?', ['overcook them', 'overcook'], 2),
          gap(24, 'People wrongly believe vegetarians are ______', ['unhealthy'], 1),
          gap(25, 'Beef consumption per head in Europe: ______ kg/year', ['21'], 1),
          gap(26, 'Beef consumption per head in America: ______ kg/year', ['44'], 1)
        ]},
        { title: 'Food pyramid labels', visual: 'assets/images/food-pyramid.jpg', visualAlt: 'Food pyramid with blanks numbered 27 to 30', questions: [
          gap(27, 'Base of the food pyramid', ['cereals'], 1),
          gap(28, 'Foods above vegetables and fruit', ['dairy', 'dairy foods'], 2),
          gap(29, 'Fish and ______', ['white meat'], 2),
          gap(30, '______ and potatoes', ['red meat'], 2)
        ]}
      ]
    },
    solar: {
      id: 'solar', title: 'Solar Power Presentation', short: 'Solar presentation', part: 3, track: 'solar', skill: 'speakers',
      instruction: 'Choose A–C for Questions 21–25. Label the water-heater diagram using NO MORE THAN TWO WORDS AND/OR A NUMBER.',
      groups: [
        { title: 'Presentation focus', questions: [
          mc(21, 'Lyn is having difficulty completing her project because…', ABC('A. she lacks information', 'B. she cannot organise her presentation', 'C. she lacks time'), 'B'),
          mc(22, 'Her presentation will focus on…', ABC('A. solar power in America', 'B. solar-powered water heaters', 'C. alternative energy technology'), 'B'),
          mc(23, 'Why look for alternative energy sources?', ABC('A. Fossil fuels are expensive', 'B. Fossil fuels affect the environment', 'C. Fossil fuels are limited'), 'C'),
          mc(24, 'Solar power is a good alternative because…', ABC('A. it can be harnessed with simple technology', 'B. it is infinite', 'C. it works equally well in every country'), 'A')
        ]},
        { title: 'Choose the graph', visual: 'assets/images/solar-graphs.png', visualAlt: 'Three monthly bar graphs labelled A, B and C', questions: [
          mc(25, 'Which graph best indicates what Lyn describes?', ABC('A. Graph A', 'B. Graph B', 'C. Graph C'), 'A')
        ]},
        { title: 'Solar water-heater diagram', visual: 'assets/images/solar-heater.png', visualAlt: 'Diagram of a solar water heater with blanks 26 to 30', questions: [
          gap(26, 'Minimum tank capacity: ______', ['40 litres', '40 liters', '40l', '40 l'], 2),
          gap(27, 'Coiled component inside the tank: ______', ['solar coil'], 2),
          gap(28, 'Lower temperature: ______ degrees', ['20'], 1),
          gap(29, 'Upper temperature: ______ degrees', ['65'], 1),
          gap(30, '80 mm ______ insulation', ['rigid foam'], 2)
        ]}
      ]
    },
    dolphins: {
      id: 'dolphins', title: 'Behaviour of Dolphins', short: 'Dolphin lecture', part: 4, track: 'dolphins', skill: 'lecture',
      instruction: 'Complete the notes. Write NO MORE THAN THREE WORDS AND/OR A NUMBER for each answer.',
      groups: [
        { title: 'Overview and socialising', questions: [
          gap(31, 'Almost 40 species are found ______', ['worldwide', 'around the world'], 3),
          gap(32, 'Super-pods may have more than ______ dolphins', ['1000', '1,000', 'one thousand'], 2),
          gap(33, 'Moko helped a whale and calf escape from ______', ['shallow water', 'shallow waters'], 2)
        ]},
        { title: 'Culture and aggression', questions: [
          gap(34, 'Young bottlenose dolphins learn to ______', ['use tools'], 2),
          gap(35, 'Primates pass knowledge to ______', ['both sexes'], 2),
          gap(36, 'Aggression can come from disagreements over ______', ['companions'], 1)
        ]},
        { title: 'Food and play', questions: [
          gap(37, 'Some feeding methods are ______ to one population', ['exclusive', 'exlusive'], 1),
          gap(38, 'Methods include ______ or strand feeding', ['beach', 'beaching'], 1),
          gap(39, 'A playful dolphin may be ______ away from another dolphin', ['taking it'], 2),
          gap(40, 'Play may include other ______ such as humans', ['animal species', 'species'], 2)
        ]}
      ]
    },
    osteopathy: {
      id: 'osteopathy', title: 'Discussion about Osteopathy', short: 'Osteopathy talk', part: 4, track: 'osteopathy', skill: 'lecture',
      instruction: 'Use ONE WORD for 31–32, NO MORE THAN THREE WORDS for 33–36 and 39–40, and choose A–C for 37–38.',
      groups: [
        { title: 'Natural therapy', questions: [
          gap(31, 'East feels ______ therapy is better than “alternative”.', ['natural'], 1),
          gap(32, 'Osteopathy manipulates ______ to remove stresses and strains.', ['muscles'], 1),
          gap(33, 'What must be considered when treating a patient?', ['the whole body', 'whole body'], 3),
          gap(34, 'What originally caused the baby’s discomfort?', ['a difficult birth', 'difficult birth'], 3),
          gap(35, 'How does East describe drugs and operations?', ['invasive'], 1),
          gap(36, 'Natural remedies cost what percentage of western medicine?', ['10%', '10 percent', 'ten percent'], 2)
        ]},
        { title: 'Views and examples', questions: [
          mc(37, 'East believes western medicine…', ABC('A. is unsuitable for the young', 'B. has not had enough trials', 'C. is overly influenced by pharmaceutical companies'), 'C'),
          mc(38, 'Natural remedies…', ABC('A. are sometimes used indiscriminately', 'B. can be used with patients of any age', 'C. do not affect diet or lifestyle'), 'B'),
          gap(39, 'What example does East give of western medicine’s benefits?', ['emergency surgery'], 2),
          gap(40, 'Who is next week’s guest?', ['dr moore', 'doctor moore', 'moore'], 2)
        ]}
      ]
    }
  };

  var MOCKS = {
    A: ['tour', 'trains', 'vegetarian', 'dolphins'],
    B: ['travel', 'property', 'solar', 'osteopathy']
  };

  var SKILLS = {
    prediction: { label: 'Prediction & preview', fix: 'Redo Station 1 and the train table. Say the answer type before Play.' },
    precision: { label: 'Spelling & precision', fix: 'Redo the Harper form. Check letters, dates, plurals, and word limits.' },
    distractors: { label: 'Corrections & distractors', fix: 'Redo Part 1. Hold the first possible answer and wait for confirmation.' },
    monologue: { label: 'Following one speaker', fix: 'Redo the property talk. Use headings and question order as signposts.' },
    speakers: { label: 'Speakers & attitudes', fix: 'Redo Alice and Tom, then one Part 3 set. Track the final decision, not the first suggestion.' },
    lecture: { label: 'Lecture structure', fix: 'Redo the dolphin notes. Keep your place with headings even when vocabulary is unfamiliar.' },
    pacing: { label: 'Full-test pacing', fix: 'Redo one full run in exam mode. If an answer is lost, guess and move with the recording.' },
    recall: { label: 'Method recall', fix: 'Redo the six-move method card, close it, then take the retrieval quiz again from memory.' }
  };

  function totalPoints(set) {
    return set.groups.reduce(function (sum, group) {
      return sum + group.questions.reduce(function (s, q) { return s + (q.points || 1); }, 0);
    }, 0);
  }

  function allQuestions(set) {
    var list = [];
    set.groups.forEach(function (g) { g.questions.forEach(function (q) { list.push(q); }); });
    return list;
  }

  function esc(value) {
    return String(value).replace(/[&<>'"]/g, function (c) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[c];
    });
  }

  function optionCode(text) {
    var m = String(text).match(/^([A-Z])\./);
    return m ? m[1] : text;
  }

  function normalize(value) {
    return String(value || '').toLowerCase().trim()
      .replace(/[’‘]/g, "'")
      .replace(/\b(the|a|an)\b/g, ' ')
      .replace(/[£$,.]/g, '')
      .replace(/[()]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function wordCount(value) {
    return String(value || '').trim().split(/\s+/).filter(Boolean).length;
  }

  function answerDisplay(q) {
    if (q.type === 'mc' || q.type === 'match') return q.answer;
    if (q.type === 'multi') return q.answers.join(', ');
    return q.answers[0];
  }

  function renderQuestion(q, index, context) {
    var control = '';
    var id = context + '-q' + index;
    if (q.type === 'gap') {
      control = '<input class="q-input" id="' + id + '" type="text" autocomplete="off" inputmode="text" aria-label="Question ' + esc(q.n) + ' answer">';
    } else if (q.type === 'mc' || q.type === 'match') {
      control = '<div class="mc-options">' + q.options.map(function (o, oi) {
        var code = optionCode(o);
        return '<label class="mc-option"><input type="radio" name="' + id + '" value="' + esc(code) + '"><span>' + esc(o) + '</span></label>';
      }).join('') + '</div>';
    } else if (q.type === 'multi') {
      control = '<div class="multi-options">' + q.options.map(function (o) {
        var code = optionCode(o);
        return '<label class="mc-option"><input type="checkbox" name="' + id + '" value="' + esc(code) + '"><span>' + esc(o) + '</span></label>';
      }).join('') + '</div>';
    }
    return '<div class="question" data-q-index="' + index + '">' +
      '<div class="q-num">' + esc(q.n) + '</div>' +
      '<div class="q-body"><p class="q-prompt">' + esc(q.prompt) + (q.hint ? '<span class="q-hint">' + esc(q.hint) + '</span>' : '') + '</p>' + control + '<div class="q-result" aria-live="polite"></div></div></div>';
  }

  function renderSet(root, set, context, opts) {
    opts = opts || {};
    var qi = 0;
    var html = '';
    set.groups.forEach(function (group) {
      html += '<div class="question-group"><div class="group-title">' + esc(group.title) + '</div>';
      if (group.visual) html += '<figure class="visual-question"><img src="' + esc(group.visual) + '" alt="' + esc(group.visualAlt || '') + '"></figure>';
      group.questions.forEach(function (q) { html += renderQuestion(q, qi++, context); });
      html += '</div>';
    });
    if (!opts.hideActions) {
      html += '<div class="exercise-actions no-print"><button class="btn check-set" type="button">Check answers</button><button class="btn secondary reset-set" type="button">Clear</button><a class="btn ghost print-set" href="' + esc(PRINT_PDFS[set.id]) + '">🖨 Open 2-up PDF</a><span class="score-pill set-score">0 / ' + totalPoints(set) + '</span></div>';
      html += '<div class="exercise-summary"></div>';
      html += '<div class="answer-key"><b>Answer key:</b><ol class="answer-key-list">' + allQuestions(set).map(function (q) { return '<li value="' + parseInt(q.n, 10) + '">' + esc(answerDisplay(q)) + '</li>'; }).join('') + '</ol></div>';
    }
    root.innerHTML = html;
    root.dataset.setId = set.id;
    root.dataset.context = context;
    root.dataset.skill = set.skill;
    hydrateAnswers(root, set, context);
    bindAnswerSaving(root, set, context);
    if (!opts.hideActions) {
      $('.check-set', root).addEventListener('click', function () { checkSet(root, set, true); });
      $('.reset-set', root).addEventListener('click', function () { resetSet(root, set, context); });
    }
  }

  function storageKey(context) { return 'ielts-listening-answers-' + context; }
  function collectAnswers(root, set) {
    var values = {};
    allQuestions(set).forEach(function (q, index) {
      var row = $('[data-q-index="' + index + '"]', root);
      if (q.type === 'gap') values[index] = $('.q-input', row).value;
      else if (q.type === 'multi') values[index] = $$('input:checked', row).map(function (i) { return i.value; });
      else { var picked = $('input:checked', row); values[index] = picked ? picked.value : ''; }
    });
    return values;
  }

  function bindAnswerSaving(root, set, context) {
    function save() {
      try { localStorage.setItem(storageKey(context), JSON.stringify(collectAnswers(root, set))); } catch (e) {}
      if (context.indexOf('mock-') === 0) updateMockAnswered();
    }
    root.addEventListener('input', save);
    root.addEventListener('change', save);
  }

  function hydrateAnswers(root, set, context) {
    var saved = null;
    try { saved = JSON.parse(localStorage.getItem(storageKey(context)) || 'null'); } catch (e) {}
    if (!saved) return;
    allQuestions(set).forEach(function (q, index) {
      var row = $('[data-q-index="' + index + '"]', root);
      var value = saved[index];
      if (!row || value === undefined) return;
      if (q.type === 'gap') $('.q-input', row).value = value;
      else if (q.type === 'multi') $$('input', row).forEach(function (i) { i.checked = Array.isArray(value) && value.indexOf(i.value) >= 0; });
      else { var input = $('input[value="' + value + '"]', row); if (input) input.checked = true; }
    });
  }

  function evaluateQuestion(row, q, reveal) {
    var correct = false, given = '', earned = 0, possible = q.points || 1;
    if (q.type === 'gap') {
      var input = $('.q-input', row);
      given = input.value;
      correct = q.answers.some(function (a) { return normalize(a) === normalize(given); });
      if (wordCount(given) > q.maxWords) correct = false;
      if (reveal) {
        input.classList.toggle('correct', correct);
        input.classList.toggle('wrong', !correct);
      }
      earned = correct ? 1 : 0;
    } else if (q.type === 'multi') {
      var picked = $$('input:checked', row).map(function (i) { return i.value; }).sort();
      given = picked.join(',');
      var wanted = q.answers.slice().sort();
      earned = wanted.reduce(function (n, answer) { return n + (picked.indexOf(answer) >= 0 ? 1 : 0); }, 0);
      earned -= picked.reduce(function (n, answer) { return n + (wanted.indexOf(answer) < 0 ? 1 : 0); }, 0);
      earned = Math.max(0, earned);
      correct = earned === possible && picked.length === wanted.length;
      if (reveal) $$('input', row).forEach(function (input) {
        var label = input.closest('label');
        label.classList.toggle('correct', wanted.indexOf(input.value) >= 0);
        label.classList.toggle('wrong', input.checked && wanted.indexOf(input.value) < 0);
      });
    } else {
      var selected = $('input:checked', row);
      given = selected ? selected.value : '';
      correct = given === q.answer;
      earned = correct ? 1 : 0;
      if (reveal) $$('input', row).forEach(function (input) {
        var label = input.closest('label');
        label.classList.toggle('correct', input.value === q.answer);
        label.classList.toggle('wrong', input.checked && input.value !== q.answer);
      });
    }
    if (reveal) {
      var result = $('.q-result', row);
      result.className = 'q-result ' + (correct ? 'good' : 'bad');
      result.textContent = correct ? '✓ Correct' : 'Answer: ' + answerDisplay(q) + (given ? '' : ' · left blank');
    }
    return { earned: earned, possible: possible, answered: q.type === 'multi' ? given.length > 0 : String(given).trim().length > 0 };
  }

  function evaluateSet(root, set, reveal) {
    var result = { score: 0, total: 0, answered: 0 };
    allQuestions(set).forEach(function (q, index) {
      var row = $('[data-q-index="' + index + '"]', root);
      var r = evaluateQuestion(row, q, reveal);
      result.score += r.earned;
      result.total += r.possible;
      if (r.answered) result.answered += r.possible;
    });
    return result;
  }

  function checkSet(root, set, record) {
    var result = evaluateSet(root, set, true);
    var pill = $('.set-score', root);
    if (pill) pill.textContent = result.score + ' / ' + result.total;
    var summary = $('.exercise-summary', root);
    if (summary) {
      var pct = Math.round(result.score / result.total * 100);
      var message = pct >= 80 ? 'Ready to increase the difficulty.' : pct >= 60 ? 'Close. Replay once with the answer key and locate each distractor.' : 'Slow down the preview. Predict the answer type before replaying.';
      summary.className = 'exercise-summary show';
      summary.innerHTML = '<b>' + result.score + ' / ' + result.total + '</b> · ' + pct + '%. ' + message;
    }
    if (record) Progress.record('practice-' + set.id, set.skill, result.score, result.total);
    return result;
  }

  function resetSet(root, set, context) {
    try { localStorage.removeItem(storageKey(context)); } catch (e) {}
    renderSet(root, set, context, { hideActions: context.indexOf('mock-') === 0 });
  }

  var Progress = (function () {
    var key = 'ielts-listening-progress-v1';
    var data = {};
    try { data = JSON.parse(localStorage.getItem(key) || '{}') || {}; } catch (e) { data = {}; }
    function save() { try { localStorage.setItem(key, JSON.stringify(data)); } catch (e) {} }
    return {
      record: function (id, skill, score, total) { data[id] = { skill: skill, score: score, total: total, at: Date.now() }; save(); renderScorecard(); },
      values: function () { return data; },
      reset: function () { data = {}; save(); renderScorecard(); }
    };
  })();

  $$('.exercise-slot[data-exercise]').forEach(function (slot) {
    var id = slot.dataset.exercise;
    renderSet(slot, SETS[id], 'practice-' + id);
  });

  var problemItems = [
    ['topic', 'I am lost when the topic is unfamiliar.'],
    ['noise', 'Background noise makes the whole recording collapse.'],
    ['attitude', 'I hear the words but miss the speaker’s attitude.'],
    ['speed', 'The speakers feel too fast.'],
    ['visual', 'Without faces or gestures, I understand less.'],
    ['accent', 'A new accent takes too long to adjust to.'],
    ['chunks', 'False starts and incomplete sentences confuse me.'],
    ['keywords', 'I do not know which words matter.']
  ];
  var selectedProblems = [];
  $('#problemGrid').innerHTML = problemItems.map(function (p) { return '<button class="problem" type="button" data-problem="' + p[0] + '">' + esc(p[1]) + '</button>'; }).join('');
  $$('.problem').forEach(function (button) {
    button.addEventListener('click', function () {
      button.classList.toggle('selected');
      selectedProblems = $$('.problem.selected').map(function (b) { return b.dataset.problem; });
      var out = $('#problemDiagnosis');
      if (!selectedProblems.length) { out.textContent = 'Choose at least one statement.'; return; }
      var map = { topic: 'prediction', noise: 'focus', attitude: 'attitude', speed: 'keywords', visual: 'prediction', accent: 'accent flexibility', chunks: 'chunking', keywords: 'question focus' };
      var skills = selectedProblems.map(function (p) { return map[p]; }).filter(function (v, i, a) { return a.indexOf(v) === i; });
      out.innerHTML = '<b>Your practice targets:</b> ' + skills.join(', ') + '. Keep this prediction; Station 9 will compare it with your scores.';
    });
  });

  var PARTS = [
    { n: 1, h: 'Social conversation', p: 'Two speakers arrange or request something in everyday life.', r: 'Listen for names, dates, numbers, places, spelling and corrections.' },
    { n: 2, h: 'Social monologue', p: 'One speaker gives information about a service, place, event or journey.', r: 'Use headings, maps and tables to follow the speaker’s route.' },
    { n: 3, h: 'Academic discussion', p: 'Two to four speakers discuss study, research, feedback or a project.', r: 'Track who speaks, agreement, hesitation and the final decision.' },
    { n: 4, h: 'Academic lecture', p: 'One speaker gives a structured talk on an academic topic.', r: 'Follow signposts and note headings; do not chase unknown vocabulary.' }
  ];
  $('#partGrid').innerHTML = PARTS.map(function (p) {
    return '<button class="part-card" type="button"><span class="part-n">' + p.n + '</span><h3>' + p.h + '</h3><p>' + p.p + '</p><span class="part-reveal"><b>Your job:</b> ' + p.r + '</span></button>';
  }).join('');
  $$('.part-card').forEach(function (b) { b.addEventListener('click', function () { b.classList.toggle('open'); }); });

  var predictionItems = [
    ['Surname: Lily ___', ['place', 'surname', 'number'], 'surname'],
    ['Date of birth ___ (dd/mm/yy)', ['date', 'price', 'person'], 'date'],
    ['from June to ___', ['month', 'country', 'verb'], 'month'],
    ['Where work wanted: ___', ['adjective', 'place', 'time'], 'place'],
    ['minimum tank capacity ___ litres', ['number', 'material', 'person'], 'number'],
    ['built by the ___', ['verb', 'noun phrase', 'percentage'], 'noun phrase']
  ];
  renderMiniQuiz($('#predictionQuiz'), predictionItems, 'prediction', $('#predictionScore'));
  $('#predictionReset').addEventListener('click', function () { renderMiniQuiz($('#predictionQuiz'), predictionItems, 'prediction', $('#predictionScore')); });

  var methodMoves = [
    { icon: '👀', title: 'Preview', label: 'Move 1 · before Play', text: 'Read the heading, instruction, and question block. Do not read every option equally; find what changes between them.' },
    { icon: '◯', title: 'Predict the answer type', label: 'Move 2 · shape the gap', text: 'Name, number, place, plural noun, adjective? Grammar narrows what your ears need to catch.' },
    { icon: '⌖', title: 'Mark the anchor', label: 'Move 3 · know where to wait', text: 'Underline the stable content words around the gap. They tell you when the answer zone is arriving.' },
    { icon: '▶', title: 'Follow the question', label: 'Move 4 · while listening', text: 'Answers normally come in order. Keep your eyes on the current and next question, not the one you lost.' },
    { icon: '↪', title: 'Wait through the turn', label: 'Move 5 · survive the trap', text: 'A speaker can correct, reject, or replace the first possible answer. Hold it lightly until the idea closes.' },
    { icon: '✓', title: 'Write, check, move', label: 'Move 6 · secure the mark', text: 'Write exact spelling, obey the word limit, check singular/plural, then move your eyes to the next item immediately.' }
  ];
  var methodStep = 0;
  function drawMethod() {
    $('#methodRail').innerHTML = methodMoves.map(function (m, i) { return '<div class="method-dot ' + (i === methodStep ? 'active' : i < methodStep ? 'done' : '') + '"><b>' + (i + 1) + '</b>' + m.title + '</div>'; }).join('');
    var m = methodMoves[methodStep];
    $('#methodStage').innerHTML = '<div class="method-icon">' + m.icon + '</div><div class="method-copy"><div class="move-label">' + m.label + '</div><h3>' + m.title + '</h3><p>' + m.text + '</p></div>';
    $('#methodPrev').disabled = methodStep === 0;
    $('#methodNext').disabled = methodStep === methodMoves.length - 1;
    $('#methodNext').textContent = methodStep === methodMoves.length - 1 ? 'Method complete' : 'Next move →';
  }
  drawMethod();
  $('#methodPrev').addEventListener('click', function () { if (methodStep) methodStep--; drawMethod(); });
  $('#methodNext').addEventListener('click', function () { if (methodStep < methodMoves.length - 1) methodStep++; drawMethod(); });
  $('#methodRestart').addEventListener('click', function () { methodStep = 0; drawMethod(); });

  var previewTimer = null, previewLeft = 30;
  $('#previewStart').addEventListener('click', function () {
    clearInterval(previewTimer); previewLeft = 30; $('#previewTimer').textContent = '0:30';
    previewTimer = setInterval(function () {
      previewLeft--; $('#previewTimer').textContent = '0:' + String(previewLeft).padStart(2, '0');
      if (previewLeft <= 0) { clearInterval(previewTimer); toast('Preview finished — eyes to Question 1.'); }
    }, 1000);
  });
  $('#previewCheck').addEventListener('click', function () {
    var correct = 0;
    $$('[data-preview-answer]').forEach(function (s) { var ok = s.value === s.dataset.previewAnswer; s.classList.toggle('correct', ok); s.classList.toggle('wrong', !ok); if (ok) correct++; });
    var f = $('#previewFeedback'); f.className = 'feedback show ' + (correct === 4 ? 'good' : 'bad'); f.textContent = correct + ' / 4. Dates and months count as numbers; locations are places.';
  });

  function renderMiniQuiz(root, items, skill, scoreEl) {
    root.innerHTML = items.map(function (item, i) {
      return '<div class="quiz-item" data-mini="' + i + '"><p>' + esc((i + 1) + '. ' + item[0]) + '</p><div class="option-row">' + item[1].map(function (o) { return '<button type="button" class="option" data-value="' + esc(o) + '">' + esc(o) + '</button>'; }).join('') + '</div></div>';
    }).join('');
    scoreEl.textContent = '0 / ' + items.length;
    $$('.option', root).forEach(function (button) {
      button.addEventListener('click', function () {
        var itemEl = button.closest('.quiz-item'); var index = Number(itemEl.dataset.mini); var wanted = items[index][2];
        $$('.option', itemEl).forEach(function (o) { o.classList.remove('selected', 'correct', 'wrong'); });
        button.classList.add('selected', button.dataset.value === wanted ? 'correct' : 'wrong');
        if (button.dataset.value !== wanted) { var right = $('.option[data-value="' + wanted + '"]', itemEl); if (right) right.classList.add('correct'); }
        var score = $$('.option.selected.correct', root).length;
        scoreEl.textContent = score + ' / ' + items.length;
        if ($$('.option.selected', root).length === items.length) Progress.record('mini-' + skill, skill, score, items.length);
      });
    });
  }

  $$('[data-tab-group]').forEach(function (button) {
    button.addEventListener('click', function () {
      var group = button.dataset.tabGroup, target = button.dataset.tabTarget;
      $$('[data-tab-group="' + group + '"]').forEach(function (b) { b.classList.toggle('active', b === button); });
      $$('[data-tab-panel="' + group + '"]').forEach(function (p) { p.classList.toggle('active', p.dataset.panel === target); });
    });
  });

  var audio = $('#audio'), dock = $('.audio-dock'), dockPlay = $('#dockPlay'), dockTitle = $('#dockTitle'), dockTime = $('#dockTime'), dockSeek = $('#dockSeek');
  var currentTrack = null, pendingStart = 0, mockActive = false, mockQueue = [], mockQueueIndex = -1;
  function timeText(seconds) { if (!isFinite(seconds)) return '0:00'; var m = Math.floor(seconds / 60), s = Math.floor(seconds % 60); return m + ':' + String(s).padStart(2, '0'); }
  function loadTrack(id, start, title, autoplay) {
    if (mockActive && (!MOCKS[currentMock] || MOCKS[currentMock].indexOf(id) < 0)) { toast('Finish or reset the active test before changing recordings.'); return; }
    var tr = TRACKS[id]; if (!tr) return;
    currentTrack = id; pendingStart = Number(start !== undefined ? start : tr.start || 0);
    audio.src = tr.src; audio.load(); dockTitle.textContent = title || tr.title; dock.classList.add('open');
    if (autoplay) playWhenReady();
  }
  function playWhenReady() {
    function go() { if (pendingStart) audio.currentTime = pendingStart; pendingStart = 0; audio.play().catch(function () { toast('Tap Play once more to allow audio on this device.'); }); }
    if (audio.readyState >= 1) go(); else audio.addEventListener('loadedmetadata', go, { once: true });
  }
  $$('.listen-btn').forEach(function (b) { b.addEventListener('click', function () { loadTrack(b.dataset.track, b.dataset.start, b.dataset.title, true); }); });
  dockPlay.addEventListener('click', function () { if (!audio.src && currentTrack === null) return; if (audio.paused) audio.play(); else audio.pause(); });
  audio.addEventListener('play', function () { dockPlay.textContent = '❚❚'; });
  audio.addEventListener('pause', function () { dockPlay.textContent = '▶'; });
  audio.addEventListener('timeupdate', function () { dockSeek.value = audio.duration ? Math.round(audio.currentTime / audio.duration * 1000) : 0; dockTime.textContent = timeText(audio.currentTime) + ' / ' + timeText(audio.duration); });
  dockSeek.addEventListener('input', function () { if (!mockActive && audio.duration) audio.currentTime = Number(dockSeek.value) / 1000 * audio.duration; });
  $('#back5').addEventListener('click', function () { if (!mockActive) audio.currentTime = Math.max(0, audio.currentTime - 5); });
  $('#forward5').addEventListener('click', function () { if (!mockActive) audio.currentTime = Math.min(audio.duration || Infinity, audio.currentTime + 5); });
  $('#speedSelect').addEventListener('change', function () { if (!mockActive) audio.playbackRate = Number($('#speedSelect').value); });
  audio.addEventListener('ended', function () { if (mockActive) advanceMockAudio(); });

  var currentMock = 'A', mockSeconds = 1800, mockTimer = null;
  function renderMock() {
    var ids = MOCKS[currentMock];
    $('#mockParts').innerHTML = ids.map(function (id, i) {
      var set = SETS[id];
      return '<section class="mock-section" data-mock-set="' + id + '"><div class="mock-section-head"><div><h3>Part ' + (i + 1) + ' · ' + esc(set.title) + '</h3><p>' + esc(set.instruction) + '</p></div><button class="btn secondary mock-play no-print" type="button" data-mock-play="' + id + '">Play Part ' + (i + 1) + '</button></div><div class="mock-set-slot"></div></section>';
    }).join('');
    $$('.mock-section').forEach(function (section) {
      var id = section.dataset.mockSet; renderSet($('.mock-set-slot', section), SETS[id], 'mock-' + currentMock + '-' + id, { hideActions: true });
    });
    $$('[data-mock-play]').forEach(function (b) { b.addEventListener('click', function () { if ($('#examMode').checked) { toast('Use Start Test in exam mode.'); return; } var s = SETS[b.dataset.mockPlay]; loadTrack(s.track, s.start, s.title, true); }); });
    $('#mockPart').textContent = '—'; $('#mockAnswered').textContent = countMockAnswered() + ' / 40'; $('#mockScore').textContent = '—'; $('#mockResult').className = 'mock-result';
    $('#mockStart').textContent = 'Start Test ' + currentMock;
  }
  renderMock();
  $$('[data-mock]').forEach(function (button) {
    button.addEventListener('click', function () {
      if (mockActive) { toast('Reset the running test before switching papers.'); return; }
      currentMock = button.dataset.mock;
      $$('[data-mock]').forEach(function (b) { b.classList.toggle('active', b === button); });
      renderMock();
    });
  });
  function countMockAnswered() {
    return $$('.mock-set-slot').reduce(function (n, root) { var set = SETS[root.closest('.mock-section').dataset.mockSet]; return n + evaluateSet(root, set, false).answered; }, 0);
  }
  function updateMockAnswered() { if ($('#mockAnswered')) $('#mockAnswered').textContent = countMockAnswered() + ' / 40'; }
  function startMock() {
    clearInterval(mockTimer); mockSeconds = 1800; mockQueue = MOCKS[currentMock].slice(); mockQueueIndex = -1; mockActive = true;
    dock.classList.add('locked'); $('#examMode').checked = true; $('#mockStart').disabled = true;
    mockTimer = setInterval(function () { mockSeconds--; $('#mockClock').textContent = timeText(mockSeconds); if (mockSeconds <= 0) finishMock(); }, 1000);
    advanceMockAudio();
    $('#fullrun').scrollIntoView({ block: 'start' });
  }
  function advanceMockAudio() {
    mockQueueIndex++;
    if (mockQueueIndex >= mockQueue.length) { finishMock(); return; }
    var set = SETS[mockQueue[mockQueueIndex]];
    $('#mockPart').textContent = (mockQueueIndex + 1) + ' / 4';
    var section = $('[data-mock-set="' + set.id + '"]'); if (section) section.scrollIntoView({ block: 'start' });
    loadTrack(set.track, set.start, 'Test ' + currentMock + ' · Part ' + (mockQueueIndex + 1) + ' · ' + set.title, true);
  }
  function finishMock() {
    if (!mockActive && !$$('.mock-set-slot').length) return;
    clearInterval(mockTimer); audio.pause(); mockActive = false; dock.classList.remove('locked'); $('#mockStart').disabled = false;
    var totalScore = 0, total = 0, details = [];
    $$('.mock-section').forEach(function (section, i) {
      var set = SETS[section.dataset.mockSet], root = $('.mock-set-slot', section), r = evaluateSet(root, set, true);
      totalScore += r.score; total += r.total; details.push('P' + (i + 1) + ' ' + r.score + '/10');
      Progress.record('mock-' + currentMock + '-p' + (i + 1), set.skill, r.score, r.total);
    });
    Progress.record('mock-' + currentMock, 'pacing', totalScore, total);
    $('#mockScore').textContent = totalScore + ' / ' + total;
    var bandHint = totalScore >= 35 ? 'approximately Band 8 territory' : totalScore >= 30 ? 'approximately Band 7 territory' : totalScore >= 23 ? 'approximately Band 6 territory' : 'below an approximate Band 6 threshold';
    var out = $('#mockResult'); out.className = 'mock-result show'; out.innerHTML = '<h3>Test ' + currentMock + ': ' + totalScore + ' / 40</h3><p>' + details.join(' · ') + '</p><p>This is ' + bandHint + '. Exact conversions can vary slightly by test version; use the part scores to choose the next practice station.</p>';
  }
  function resetMock() {
    clearInterval(mockTimer); audio.pause(); mockActive = false; dock.classList.remove('locked'); $('#mockStart').disabled = false; mockSeconds = 1800; $('#mockClock').textContent = '30:00';
    MOCKS[currentMock].forEach(function (id) { try { localStorage.removeItem(storageKey('mock-' + currentMock + '-' + id)); } catch (e) {} });
    renderMock();
  }
  $('#mockStart').addEventListener('click', startMock);
  $('#mockCheck').addEventListener('click', finishMock);
  $('#mockReset').addEventListener('click', resetMock);

  var recallItems = [
    ['What do you do before the recording begins?', ['preview the questions', 'close the questions', 'write every possible word'], 'preview the questions'],
    ['You hear a possible answer, then “actually…”. What do you do?', ['write the first answer', 'wait for the completed idea', 'skip two questions'], 'wait for the completed idea'],
    ['You miss Question 12. Where should your eyes go?', ['back to Question 11', 'the transcript', 'Question 13'], 'Question 13'],
    ['What keeps you oriented in a Part 4 lecture?', ['unknown vocabulary', 'headings and signposts', 'the speaker’s accent'], 'headings and signposts'],
    ['What wording should a completion answer use?', ['your paraphrase', 'exact words from the recording', 'a full sentence'], 'exact words from the recording'],
    ['What should you do with a blank before time ends?', ['leave it', 'guess', 'cross out the question'], 'guess']
  ];
  renderMiniQuiz($('#recallQuiz'), recallItems, 'recall', $('#recallScore'));
  $('#recallReset').addEventListener('click', function () { renderMiniQuiz($('#recallQuiz'), recallItems, 'recall', $('#recallScore')); });

  function renderScorecard() {
    var data = Progress.values(), bySkill = {};
    Object.keys(data).forEach(function (id) { var r = data[id]; if (!bySkill[r.skill]) bySkill[r.skill] = { score: 0, total: 0 }; bySkill[r.skill].score += r.score; bySkill[r.skill].total += r.total; });
    $('#scoreGrid').innerHTML = Object.keys(SKILLS).map(function (key) {
      var r = bySkill[key], pct = r ? Math.round(r.score / r.total * 100) : 0;
      return '<div class="score-row"><span class="label">' + SKILLS[key].label + '</span><div class="score-track"><div class="score-fill" style="width:' + pct + '%"></div></div><span class="value">' + (r ? pct + '%' : '—') + '</span></div>';
    }).join('');
    var attempted = Object.keys(bySkill);
    if (!attempted.length) {
      $('#scoreHeadline').textContent = 'Nothing scored yet'; $('#scoreDiagnosis').textContent = 'Complete and check one exercise to receive a diagnosis.';
      $('#shotAccuracy').textContent = '—'; $('#shotStrong').textContent = '—'; $('#shotWeak').textContent = '—'; $('#shotFix').textContent = 'Complete a set above.'; return;
    }
    attempted.sort(function (a, b) { return bySkill[a].score / bySkill[a].total - bySkill[b].score / bySkill[b].total; });
    var weak = attempted[0], strong = attempted[attempted.length - 1];
    var totals = attempted.reduce(function (a, k) { a.score += bySkill[k].score; a.total += bySkill[k].total; return a; }, { score: 0, total: 0 });
    var accuracy = Math.round(totals.score / totals.total * 100);
    $('#scoreHeadline').textContent = accuracy + '% across ' + totals.total + ' scored marks';
    $('#scoreDiagnosis').innerHTML = '<b>Your bottleneck is ' + SKILLS[weak].label.toLowerCase() + '.</b> ' + SKILLS[weak].fix;
    $('#shotAccuracy').textContent = accuracy + '%'; $('#shotStrong').textContent = SKILLS[strong].label; $('#shotWeak').textContent = SKILLS[weak].label; $('#shotFix').textContent = SKILLS[weak].fix;
  }
  renderScorecard();

  function printableQuestion(q) {
    var body = '<p>' + esc(q.prompt) + '</p>';
    if (q.type === 'gap') body += '<span class="print-answer-line"></span>';
    else body += '<div class="print-options">' + q.options.map(function (o) { return '<span><i class="print-multi-box"></i>' + esc(o) + '</span>'; }).join('') + '</div>';
    return '<div class="print-question"><span class="n">' + esc(q.n) + '</span><div>' + body + '</div></div>';
  }
  function printCopyHtml(set) {
    var qs = '';
    set.groups.forEach(function (g) {
      qs += '<div class="print-group"><strong>' + esc(g.title) + '</strong>';
      if (g.visual) qs += '<div class="print-visual"><img src="' + esc(g.visual) + '" alt=""></div>';
      g.questions.forEach(function (q) { qs += printableQuestion(q); });
      qs += '</div>';
    });
    var answerBoxes = answerNumbers(set).map(function (n) { return '<div><b>' + esc(n) + '</b><span></span></div>'; }).join('');
    return '<div class="print-copy"><div class="print-head"><strong>IELTS Listening Focus · Part ' + set.part + '</strong><span>Dialogue Language Center</span></div><div class="print-meta"><span>Name __________________________</span><span>Date ______________</span></div><p class="print-instructions"><b>' + esc(set.title) + '</b> · ' + esc(set.instruction) + '</p><div class="print-questions">' + qs + '</div><div class="print-answer-grid">' + answerBoxes + '</div><div class="print-foot">Classroom practice · recording supplied separately · not an official IELTS paper</div></div>';
  }
  function answerNumbers(set) {
    var nums = [];
    allQuestions(set).forEach(function (q) {
      if ((q.points || 1) > 1) {
        var start = parseInt(q.n, 10);
        for (var i = 0; i < q.points; i++) nums.push(start + i);
      } else nums.push(q.n);
    });
    return nums;
  }
  function doPrint(html) {
    $('#printRoot').innerHTML = html;
    requestAnimationFrame(function () { window.print(); });
  }
  function printSet(set) { doPrint('<div class="print-sheet two-up">' + printCopyHtml(set) + printCopyHtml(set) + '</div>'); }
  function printMethod() {
    var cards = methodMoves.map(function (m, i) { return '<div><b>' + (i + 1) + ' · ' + esc(m.title) + '</b><p>' + esc(m.text) + '</p></div>'; }).join('');
    function copy() { return '<div class="print-copy"><div class="print-head"><strong>Listening Focus · six-move method</strong><span>Dialogue IELTS</span></div><div class="print-meta"><span>Name __________________________</span><span>Target band ______</span></div><div class="method-print">' + cards + '</div><p class="print-instructions"><b>One-play rule:</b> preview → predict → mark the anchor → follow the question → wait through the turn → write, check, move.</p><div class="print-foot">Keep this card with your IELTS notes</div></div>'; }
    doPrint('<div class="print-sheet two-up">' + copy() + copy() + '</div>');
  }
  function printMock(letter) {
    var html = '<div class="print-mock">';
    MOCKS[letter].forEach(function (id, i) {
      var set = SETS[id], qs = '';
      set.groups.forEach(function (g) { qs += '<h4>' + esc(g.title) + '</h4>'; if (g.visual) qs += '<div class="print-visual"><img src="' + esc(g.visual) + '" alt=""></div>'; g.questions.forEach(function (q) { qs += printableQuestion(q); }); });
      html += '<section class="mock-print-part"><div class="print-head"><strong>Listening Test ' + letter + ' · Part ' + (i + 1) + '</strong><span>Questions ' + (i * 10 + 1) + '–' + (i * 10 + 10) + '</span></div><div class="print-meta"><span>Name __________________________</span><span>Date ______________</span></div><p class="print-instructions"><b>' + esc(set.title) + '</b> · ' + esc(set.instruction) + '</p><div class="print-questions">' + qs + '</div><div class="print-answer-grid">' + answerNumbers(set).map(function (n) { return '<div><b>' + esc(n) + '</b><span></span></div>'; }).join('') + '</div><div class="print-foot">Dialogue classroom mock · not an official IELTS paper</div></section>';
    });
    html += '</div>'; doPrint(html);
  }
  var printSetIds = ['harper', 'tour', 'travel', 'trains', 'property', 'alice', 'vegetarian', 'solar', 'dolphins', 'osteopathy'];
  $('#worksheetGrid').innerHTML = printSetIds.map(function (id) { var s = SETS[id]; return '<a class="worksheet-option" href="' + esc(PRINT_PDFS[id]) + '"><b>' + esc(s.short) + '</b><span>Part ' + s.part + ' · ' + totalPoints(s) + ' marks</span><em>Open 2-up PDF →</em></a>'; }).join('');

  var TRANSLATIONS = {
    skip: 'প্রথম স্টেশনে যান', eyebrow: 'IELTS লিসেনিং · একবার শোনা, চারটি অংশ',
    lede: 'প্রতিটি শব্দ ধরতে হবে না। সামনে কী আসছে তা বুঝুন, প্রশ্নের সাথে থাকুন, বিভ্রান্তি এড়িয়ে ঠিক উত্তরটি লিখুন।',
    s0h: 'শোনার সময় কোথায় সমস্যা হয়?', s0s: 'অনুশীলনের আগে সমস্যাটির নাম দিন। “লিসেনিং খারাপ” কোনো নির্দিষ্ট রোগনির্ণয় নয়।',
    s1h: 'চার অংশ। শোনার চারটি আলাদা কাজ।', s1s: 'কঠিনতা বাড়ে, কিন্তু কাঠামো অনুমান করা যায়। রেকর্ডিং শুরুর আগেই এটি কাজে লাগান।',
    s2h: 'শোনার ছয় ধাপের চক্র', s2s: 'Play চাপার আগেই কাজ শুরু হয়। প্রতিটি বিরতি ও নতুন প্রশ্নের অংশে এই চক্রটি চালান।',
    s3h: 'নাম, তারিখ, সংশোধন', s3s: 'Part 1-এর উত্তরগুলো তথ্যভিত্তিক। বানান, ফরম্যাট ও তাড়াহুড়োয় এগুলো সহজেই হারায়।',
    s4h: 'Part 1 · সংশোধনের ভেতর থেকে তথ্য', s4s: 'দুটি পূর্ণ অনুশীলন। ফর্ম দেখুন, ক্রম অনুসরণ করুন, সংশোধন শেষ হওয়া পর্যন্ত অপেক্ষা করুন।',
    s5h: 'Part 2 · একজন বক্তার পথ অনুসরণ', s5s: 'দ্বিতীয় কণ্ঠ মনোযোগ ফেরায় না। শিরোনাম ও বিন্যাসই আপনার পথচিহ্ন।',
    s6h: 'Part 3 · কে কী ভাবছে?', s6s: 'একাডেমিক আলোচনার উত্তর থাকে সম্মতি, দ্বিধা, সংশোধন ও বদলে যাওয়া সিদ্ধান্তের ভেতর।',
    s7h: 'Part 4 · কাঠামোই ভরসা', s7s: 'অজানা শব্দ জরুরি সমস্যা নয়। লেকচারের শিরোনাম হারিয়ে ফেলাই সমস্যা।',
    s8h: 'পূর্ণ পরীক্ষা · চার অংশ, বিরতি নেই', s8s: 'Test A বা B বাছুন। প্লেয়ার চারটি রেকর্ডিং চালাবে; আপনার কাজ পরের প্রশ্নের সাথে থাকা।',
    s9h: 'স্কোরকার্ড, স্মরণ ও প্রিন্ট লাইব্রেরি', s9s: 'মোট নম্বর ফল জানায়। এটি বলে পরেরবার কী অনুশীলন করবেন।'
  };
  var lang = 'en';
  function applyLanguage(next) {
    lang = next; document.body.dataset.lang = lang;
    $$('[data-i18n]').forEach(function (el) { var key = el.dataset.i18n; if (!el.dataset.en) el.dataset.en = el.textContent; el.textContent = lang === 'bn' && TRANSLATIONS[key] ? TRANSLATIONS[key] : el.dataset.en; });
    $('#langBtn').textContent = lang === 'bn' ? 'English' : 'বাংলা'; $('#langBtn').classList.toggle('on', lang === 'bn');
  }
  $('#langBtn').addEventListener('click', function () { applyLanguage(lang === 'en' ? 'bn' : 'en'); toast(lang === 'bn' ? 'নির্দেশনা বাংলায় · পরীক্ষার প্রশ্ন ইংরেজিতে থাকবে' : 'Instructions are back in English.'); });
  $('#themeBtn').addEventListener('click', function () { var dark = document.documentElement.dataset.theme === 'dark'; document.documentElement.dataset.theme = dark ? 'light' : 'dark'; $('#themeBtn').textContent = dark ? '🌙 Dark' : '☀ Light'; $('#themeBtn').classList.toggle('on', !dark); });
  $('#projectorBtn').addEventListener('click', function () { document.body.classList.toggle('projector'); $('#projectorBtn').classList.toggle('on', document.body.classList.contains('projector')); toast(document.body.classList.contains('projector') ? 'Projector mode: larger type for the back row.' : 'Projector mode off.'); });
  $('#notesBtn').addEventListener('click', function () { document.body.classList.toggle('show-notes'); $('#notesBtn').classList.toggle('on', document.body.classList.contains('show-notes')); toast(document.body.classList.contains('show-notes') ? 'Teaching notes shown.' : 'Teaching notes hidden.'); });
  $('#keysBtn').addEventListener('click', function () { document.body.classList.toggle('show-keys'); $('#keysBtn').classList.toggle('on', document.body.classList.contains('show-keys')); toast(document.body.classList.contains('show-keys') ? 'Answer keys revealed.' : 'Answer keys hidden.'); });
  $('#resetBtn').addEventListener('click', function () {
    Object.keys(localStorage).forEach(function (k) { if (k.indexOf('ielts-listening-') === 0) localStorage.removeItem(k); });
    Progress.reset(); selectedProblems = []; $$('.problem').forEach(function (b) { b.classList.remove('selected'); }); $('#problemDiagnosis').textContent = 'Choose at least one statement.';
    $$('.exercise-slot[data-exercise]').forEach(function (slot) { var id = slot.dataset.exercise; renderSet(slot, SETS[id], 'practice-' + id); });
    resetMock(); renderMiniQuiz($('#predictionQuiz'), predictionItems, 'prediction', $('#predictionScore')); renderMiniQuiz($('#recallQuiz'), recallItems, 'recall', $('#recallScore'));
    toast('Every answer and score is cleared for the next class.'); $('#diagnostic').scrollIntoView({ block: 'start' });
  });

  var stationInfo = [
    ['diagnostic', '0', 'Diagnose', 'Name the problem'], ['paper', '1', 'The paper', 'Map four parts'], ['method', '2', 'The method', 'Six listening moves'],
    ['precision', '3', 'Precision', 'Names, dates, corrections'], ['section1', '4', 'Part 1', 'Two complete sets'], ['section2', '5', 'Part 2', 'Two monologues'],
    ['section3', '6', 'Part 3', 'Speakers and attitudes'], ['section4', '7', 'Part 4', 'Lecture structure'], ['fullrun', '8', 'Full run', 'Two 40-question tests'], ['scorecard', '9', 'Results & print', 'Diagnosis and worksheets']
  ];
  $('#jumpList').innerHTML = stationInfo.map(function (s) { return '<a href="#' + s[0] + '"><b>' + s[1] + '</b><span><strong>' + s[2] + '</strong><br>' + s[3] + '</span></a>'; }).join('');
  function closeJump() { $('#jumpSheet').classList.remove('open'); $('#jumpBtn').setAttribute('aria-expanded', 'false'); }
  $('#jumpBtn').addEventListener('click', function () { $('#jumpSheet').classList.add('open'); $('#jumpBtn').setAttribute('aria-expanded', 'true'); });
  $('#jumpClose').addEventListener('click', closeJump); $$('#jumpList a').forEach(function (a) { a.addEventListener('click', closeJump); });
  $('#jumpSheet').addEventListener('click', function (e) { if (e.target === $('#jumpSheet')) closeJump(); });

  var navLinks = $$('#navLinks a');
  if ('IntersectionObserver' in window) {
    var observer = new IntersectionObserver(function (entries) { entries.forEach(function (entry) { if (entry.isIntersecting) navLinks.forEach(function (a) { a.classList.toggle('current', a.getAttribute('href') === '#' + entry.target.id); }); }); }, { rootMargin: '-42% 0px -52% 0px' });
    stationInfo.forEach(function (s) { observer.observe($('#' + s[0])); });
  }
  var toastTimer = null;
  function toast(message) { var el = $('#toast'); el.textContent = message; el.classList.add('show'); clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.classList.remove('show'); }, 2800); }

  $('#soundReady').addEventListener('change', function () { if ($('#soundReady').checked && $('#onePlayReady').checked) toast('Sound check complete. You are ready for Station 1.'); });
  $('#onePlayReady').addEventListener('change', function () { if ($('#soundReady').checked && $('#onePlayReady').checked) toast('Sound check complete. You are ready for Station 1.'); });
})();
