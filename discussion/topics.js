window.FGD_PHASES = [
  { id: "lobby", label: "Join", short: "Join your room", prompt: "Meet your group and place any available phone where everyone can see it. Your topic appears when the teacher starts.", icon: "👋" },
  { id: "understand", label: "Understand", short: "Clarify the question", prompt: "Agree on what the question means. Open the language guide only when someone needs support.", icon: "🔎" },
  { id: "first-voices", label: "First voices", short: "Everyone speaks", prompt: "Go around the group. Each person shares an initial view and one reason.", icon: "🗣️" },
  { id: "explore", label: "Explore", short: "Go deeper", prompt: "Discuss causes, effects, examples, and the people affected. Ask follow-up questions.", icon: "🧭" },
  { id: "challenge", label: "Challenge", short: "Change the lens", prompt: "Consider the perspective card. Respectfully test your group’s assumptions.", icon: "🔄" },
  { id: "decide", label: "Decide", short: "Find the group view", prompt: "Identify agreements, disagreements, and the most realistic recommendation.", icon: "🤝" },
  { id: "report", label: "Report", short: "Capture the discussion", prompt: "Draft the group summary together, read it aloud, and check that it represents the discussion fairly.", icon: "📝" },
  { id: "reflect", label: "Reflect", short: "Notice what helped", prompt: "Optionally notice an idea that changed and a facilitation move that helped more people contribute.", icon: "🌱" },
  { id: "ended", label: "Finished", short: "Session complete", prompt: "Thank your group. Your teacher has ended this discussion.", icon: "✓" }
];

window.FGD_SOCRATIC_QUESTIONS = [
  { label: "Clarify", question: "What exactly do we mean by that claim or key word?" },
  { label: "Reasons", question: "Why do we think that, and which reason is strongest?" },
  { label: "Evidence", question: "What example or evidence supports it? What evidence would change our minds?" },
  { label: "Assumptions", question: "What are we taking for granted? Is that always true?" },
  { label: "Perspectives", question: "Who might experience this differently, and why?" },
  { label: "Consequences", question: "If we acted on this view, what might happen next—including unintended effects?" },
  { label: "Alternatives", question: "What is the strongest reasonable objection or alternative explanation?" },
  { label: "Synthesis", question: "What conclusion is justified, under what conditions, and what remains uncertain?" }
];

window.FGD_TEAMWORK_PROTOCOLS = {
  understand: { name: "Choose a useful risk", text: "Pick language that stretches you slightly—not language so difficult that it stops you speaking." },
  "first-voices": { name: "Step up, step back", text: "Status, age, and gender do not determine the speaking order. Nobody speaks twice before everyone is invited; anyone may decline and be invited again later." },
  explore: { name: "Listen → Link → Ask", text: "Show that you heard the previous idea, connect your response to it, then ask a genuine follow-up question." },
  challenge: { name: "Paraphrase before disagreement", text: "First say what you understood. Let the speaker confirm. Then challenge the idea—not the person." },
  decide: { name: "Consent, not forced agreement", text: "Name the shared ground and preserve an important minority concern. A fair decision does not erase disagreement." },
  report: { name: "Represent every voice fairly", text: "The report must include the group’s strongest agreement and one unresolved or minority view." },
  reflect: { name: "Notice what helped", text: "Name one specific moment when an idea or facilitation move made the group’s thinking stronger." }
};

window.FGD_PHRASE_BANK = {
  basic: [
    { intent: "Give a view", phrase: "I think ___ because ___." },
    { intent: "Give an example", phrase: "For example, ___." },
    { intent: "Agree", phrase: "I agree with ___ because ___." },
    { intent: "Disagree", phrase: "I understand, but I think ___." },
    { intent: "Ask", phrase: "Why do you think that?" },
    { intent: "Invite", phrase: "What do you think, ___?" },
    { intent: "Summarize", phrase: "Our group thinks ___." }
  ],
  developing: [
    { intent: "Give a view", phrase: "From my perspective, ___ is important because ___." },
    { intent: "Build", phrase: "I’d like to build on that point by adding ___." },
    { intent: "Example", phrase: "A good example from student life is ___." },
    { intent: "Disagree", phrase: "I see your point; however, we should also consider ___." },
    { intent: "Clarify", phrase: "When you say ___, do you mean ___?" },
    { intent: "Cause", phrase: "This can lead to ___, which means ___." },
    { intent: "Summarize", phrase: "We seem to agree that ___, although ___." }
  ],
  confident: [
    { intent: "Qualify", phrase: "To some extent that is true, particularly when ___." },
    { intent: "Challenge", phrase: "That assumes ___; what if ___?" },
    { intent: "Reframe", phrase: "Perhaps the deeper issue is not ___ but ___." },
    { intent: "Evidence", phrase: "Anecdotally we see ___, but we would need evidence about ___." },
    { intent: "Trade-off", phrase: "The main trade-off is between ___ and ___." },
    { intent: "Synthesize", phrase: "Taken together, these points suggest ___, provided that ___." },
    { intent: "Minority view", phrase: "Most of us believe ___; a significant concern remains ___." }
  ]
};

window.FGD_TOPICS = [
  {
    id: 1,
    category: "Technology & Digital Culture",
    title: "Short videos, attention, and student life",
    question: "How does short-form social media affect students’ attention, reading habits, relationships, and learning? What limits, if any, would be fair?",
    bn: "স্বল্পদৈর্ঘ্যের সোশ্যাল মিডিয়া ভিডিও শিক্ষার্থীদের মনোযোগ, পড়ার অভ্যাস, সম্পর্ক ও শেখার ওপর কী প্রভাব ফেলে? কোনো সীমা নির্ধারণ করা হলে তা কেমন হওয়া উচিত?",
    context: "Reels and short videos can entertain, teach, and connect people. They can also interrupt concentration and encourage long periods of automatic scrolling. The group’s task is to explore both experiences and propose realistic habits.",
    vocabulary: [
      ["attention span", "মনোযোগের ব্যাপ্তি", "the length of time someone can concentrate", "Constant notifications can shorten my attention span."],
      ["algorithm", "অ্যালগরিদম", "a system that chooses what content to show", "The algorithm learns what keeps a user watching."],
      ["habit-forming", "অভ্যাস তৈরি করে এমন", "likely to become a repeated, hard-to-stop behavior", "Endless scrolling can be habit-forming."],
      ["distraction", "মনোযোগের ব্যাঘাত", "something that takes attention away", "My phone becomes a distraction while I study."],
      ["moderation", "পরিমিত ব্যবহার", "keeping an activity within sensible limits", "Social media may be helpful when used in moderation."],
      ["digital wellbeing", "ডিজিটাল সুস্থতা", "healthy and balanced use of technology", "Schools could teach digital wellbeing."],
      ["sustain", "বজায় রাখা", "to continue something over time", "Reading helps students sustain concentration."],
      ["self-regulation", "আত্মনিয়ন্ত্রণ", "managing one’s own behavior and impulses", "App timers can support self-regulation."]
    ],
    collocations: ["scroll mindlessly", "sustain attention", "limit screen time", "consume content", "break a habit", "constant notifications", "educational content", "healthy boundaries"],
    grammar: [
      ["Cause and effect", "___ can lead to ___, which means ___.", "Late-night scrolling can lead to poor sleep, which means students feel tired in class."],
      ["Hedging", "___ may / tends to / can sometimes ___.", "Short videos may affect some students more than others."],
      ["Second conditional", "If students ___, they might ___.", "If students disabled notifications, they might concentrate better."]
    ],
    topicChunks: ["protect study time", "set a daily limit", "design persuasive features", "replace deep reading", "use a phone intentionally"],
    questions: ["When are short videos genuinely useful?", "How do they affect your study routine?", "Who should set limits—students, families, schools, or platforms?", "Would a campus ban solve the problem?", "Are all students affected in the same way?", "What is one realistic healthy habit?"],
    perspectives: ["A student who learns useful skills from short videos", "A teacher noticing weaker sustained attention", "A parent worried about sleep", "A content creator earning an income"],
    finalTask: "Agree on three realistic digital habits that students could actually maintain."
  },
  {
    id: 2,
    category: "Education & Student Life",
    title: "Private coaching and classroom learning",
    question: "Why do students depend on private coaching, and how could schools improve learning without harming students who need extra support?",
    bn: "শিক্ষার্থীরা কেন প্রাইভেট কোচিংয়ের ওপর নির্ভরশীল, এবং অতিরিক্ত সহায়তা প্রয়োজন এমন শিক্ষার্থীদের ক্ষতি না করে বিদ্যালয়ের শিক্ষা কীভাবে উন্নত করা যায়?",
    context: "Private coaching may provide individual attention and exam preparation, but it can be expensive and may reduce trust in regular classes. Discuss the causes of dependence before deciding what should change.",
    vocabulary: [
      ["dependence", "নির্ভরতা", "the state of needing something in order to succeed", "Heavy dependence on coaching increases family costs."],
      ["individual attention", "ব্যক্তিগত মনোযোগ", "support focused on one learner’s needs", "Large classes make individual attention difficult."],
      ["access", "সুযোগ", "the ability or opportunity to use something", "Rural learners may have less access to good tutors."],
      ["afford", "সামর্থ্য থাকা", "to have enough money for something", "Not every family can afford several coaching subjects."],
      ["accountability", "জবাবদিহি", "responsibility for the quality of work", "Schools need systems for teacher accountability."],
      ["exam-oriented", "পরীক্ষামুখী", "focused mainly on passing examinations", "Coaching is often exam-oriented rather than exploratory."],
      ["learning gap", "শেখার ঘাটতি", "a difference between expected and actual learning", "Tutoring can help close a learning gap."],
      ["supplement", "পরিপূরক হওয়া", "to add to something rather than replace it", "Coaching should supplement classroom teaching."]
    ],
    collocations: ["attend coaching", "pay tuition fees", "close a learning gap", "receive feedback", "classroom engagement", "exam preparation", "unequal access", "place pressure on families"],
    grammar: [
      ["Explaining causes", "One reason students ___ is that ___.", "One reason students attend coaching is that classes are crowded."],
      ["Obligation", "Schools should / need to / must ___.", "Schools should provide extra help before exams."],
      ["Contrast", "While ___, ___.", "While coaching can help some learners, it can deepen inequality."]
    ],
    topicChunks: ["strengthen regular classes", "offer remedial support", "reduce financial pressure", "prepare for competitive exams", "ensure equal access"],
    questions: ["What needs does coaching meet?", "How does coaching affect poorer families?", "Would banning coaching improve classrooms?", "What responsibilities do schools have?", "Could peer tutoring be an alternative?", "What would a fair support system include?"],
    perspectives: ["A student preparing for a competitive exam", "A family paying several coaching fees", "A classroom teacher with 50 learners", "A student in a rural area"],
    finalTask: "Design a fair three-part plan for improving school learning and optional extra support."
  },
  {
    id: 3,
    category: "Technology & Education",
    title: "Generative AI in English learning",
    question: "When do tools such as ChatGPT support English learning, and when do they weaken independent writing or critical thinking?",
    bn: "ChatGPT-এর মতো টুল কখন ইংরেজি শেখায় সহায়তা করে, আর কখন স্বাধীন লেখালেখি বা সমালোচনামূলক চিন্তাকে দুর্বল করে?",
    context: "Generative AI can explain language, suggest ideas, and give feedback. It can also produce inaccurate information or do the thinking for a learner. Focus on responsible uses rather than treating every use as good or bad.",
    vocabulary: [
      ["generate", "তৈরি করা", "to produce text, images, or ideas", "The tool can generate several example sentences."],
      ["plagiarism", "লেখাচুরি", "presenting another source’s work as your own", "Submitting AI text unchanged may be plagiarism."],
      ["critical thinking", "সমালোচনামূলক চিন্তা", "careful analysis used to form a judgment", "Students need critical thinking to check an answer."],
      ["verify", "যাচাই করা", "to check whether something is true or accurate", "Always verify facts from reliable sources."],
      ["prompt", "নির্দেশনা", "an instruction given to an AI system", "A precise prompt usually produces a clearer response."],
      ["feedback", "প্রতিক্রিয়া", "information that helps someone improve", "AI feedback is useful when the learner revises the work."],
      ["authentic", "নিজস্ব ও আসল", "genuine and truly belonging to the person", "The final paragraph should reflect the student’s authentic voice."],
      ["overreliance", "অতিরিক্ত নির্ভরতা", "depending on something too much", "Overreliance may weaken independent problem-solving."]
    ],
    collocations: ["check accuracy", "generate ideas", "revise a draft", "cite a source", "independent thinking", "responsible use", "academic integrity", "personalized feedback"],
    grammar: [
      ["Permission and limits", "Students should be allowed to ___, but not to ___.", "Students should be allowed to request feedback, but not to submit generated essays."],
      ["Passive voice", "AI should be used to ___, not to ___.", "AI should be used to support revision, not to replace thinking."],
      ["Provided that", "___ can be helpful, provided that ___.", "AI can be helpful, provided that students verify its advice."]
    ],
    topicChunks: ["retain your own voice", "verify an output", "brainstorm possible ideas", "outsource the thinking", "use AI transparently"],
    questions: ["Which AI uses actually teach the learner something?", "How can a teacher know whose writing it is?", "Should students disclose AI assistance?", "What skills could become weaker?", "What about students who cannot access paid tools?", "What rules would be clear and enforceable?"],
    perspectives: ["A learner asking for grammar feedback", "A teacher assessing original writing", "A student without reliable internet", "A future employer expecting AI literacy"],
    finalTask: "Write four classroom rules separating acceptable AI support from unacceptable substitution."
  },
  {
    id: 4,
    category: "Technology & Student Life",
    title: "Smartphones on campus",
    question: "How should schools manage personal smartphones while preserving their useful educational and safety functions?",
    bn: "শিক্ষা ও নিরাপত্তায় স্মার্টফোনের উপকারী ভূমিকা বজায় রেখে বিদ্যালয়গুলো কীভাবে ব্যক্তিগত স্মার্টফোন ব্যবহার নিয়ন্ত্রণ করবে?",
    context: "Phones provide dictionaries, cameras, emergency contact, and learning resources. They can also enable cheating, distraction, bullying, and unauthorized recording. Consider rules that could work in a real campus.",
    vocabulary: [
      ["restriction", "বিধিনিষেধ", "a rule that limits an action", "A restriction could apply only during lessons."],
      ["enforce", "কার্যকর করা", "to make sure a rule is obeyed", "A policy is useless if staff cannot enforce it fairly."],
      ["unauthorized", "অননুমোদিত", "done without permission", "Unauthorized recording can violate privacy."],
      ["emergency contact", "জরুরি যোগাযোগ", "communication during an urgent situation", "Families value phones for emergency contact."],
      ["digital distraction", "ডিজিটাল বিভ্রান্তি", "loss of focus caused by digital devices", "Digital distraction can interrupt a whole class."],
      ["confiscate", "জব্দ করা", "to take an item away temporarily under authority", "Should teachers be allowed to confiscate a phone?"],
      ["exception", "ব্যতিক্রম", "a case not covered by the usual rule", "Medical needs may require an exception."],
      ["proportionate", "আনুপাতিক", "appropriate in size or seriousness", "The consequence should be proportionate to the behavior."]
    ],
    collocations: ["enforce a policy", "silence a phone", "educational purpose", "violate privacy", "emergency access", "during lesson time", "reasonable exception", "consistent consequence"],
    grammar: [
      ["Rules", "Students may / may not / must ___.", "Students may use phones when a teacher gives permission."],
      ["Exceptions", "Unless ___, students should ___.", "Unless there is an emergency, students should keep phones away."],
      ["Proportionality", "The more ___, the more ___.", "The more serious the misuse, the stronger the consequence should be."]
    ],
    topicChunks: ["keep phones out of sight", "use a device for learning", "respond to an emergency", "apply rules consistently", "protect student privacy"],
    questions: ["When is a phone genuinely needed at school?", "What problems occur most often?", "Would total bans be enforceable?", "Who should hold a confiscated device?", "Which exceptions are reasonable?", "How should repeated misuse be handled?"],
    perspectives: ["A student commuting alone", "A teacher whose lesson is interrupted", "A parent needing emergency contact", "A student recorded without permission"],
    finalTask: "Create a five-point smartphone policy that is useful, fair, and enforceable."
  },
  {
    id: 5,
    category: "Career & Future of Youth",
    title: "University degrees and vocational skills",
    question: "How should young people balance university education, vocational training, and practical digital skills when planning a career?",
    bn: "ক্যারিয়ার পরিকল্পনায় তরুণদের বিশ্ববিদ্যালয় শিক্ষা, কারিগরি প্রশিক্ষণ ও ব্যবহারিক ডিজিটাল দক্ষতার মধ্যে কীভাবে ভারসাম্য রাখা উচিত?",
    context: "Different careers require different combinations of theory, credentials, experience, and practical skill. Social status and family expectations can influence choices as strongly as employment evidence.",
    vocabulary: [
      ["vocational", "কারিগরি", "connected with practical training for a job", "Vocational courses often include workplace practice."],
      ["credential", "যোগ্যতার সনদ", "an official qualification or certificate", "Some employers require a university credential."],
      ["employability", "কর্মসংস্থানের যোগ্যতা", "the skills and qualities needed to get work", "Communication skills improve employability."],
      ["hands-on", "ব্যবহারিক", "learned through direct practical experience", "The diploma provides hands-on electrical training."],
      ["transferable skill", "স্থানান্তরযোগ্য দক্ষতা", "a skill useful in many different jobs", "Teamwork is a transferable skill."],
      ["labor market", "শ্রমবাজার", "the supply of workers and demand for jobs", "Training should respond to the local labor market."],
      ["career pathway", "পেশাগত পথ", "a sequence of education and work choices", "There is more than one career pathway into technology."],
      ["social status", "সামাজিক মর্যাদা", "the respect associated with a position", "Social status should not determine educational value."]
    ],
    collocations: ["gain experience", "develop employable skills", "earn a qualification", "meet labor-market needs", "career prospects", "practical training", "family expectations", "professional status"],
    grammar: [
      ["Comparison", "___ offers more / less ___ than ___.", "A diploma may offer more practical training than a general degree."],
      ["Depends on", "The best option depends on ___.", "The best option depends on the career and the learner’s strengths."],
      ["Balanced recommendation", "Rather than choosing only ___, students could ___.", "Rather than choosing only theory, students could add an internship."]
    ],
    topicChunks: ["match training to a career", "gain hands-on experience", "challenge social attitudes", "combine theory with practice", "make an informed choice"],
    questions: ["Why do some qualifications receive more respect?", "Which skills are employers actually seeking?", "When is a degree essential?", "How can students test a career interest?", "What opportunities exist locally?", "How should families advise young people?"],
    perspectives: ["A parent who values a prestigious degree", "A diploma holder with strong practical skills", "An employer hiring entry-level staff", "A student unsure about a career"],
    finalTask: "Design a career-planning checklist that works for several different educational pathways."
  },
  {
    id: 6,
    category: "Environment & Climate in Barind",
    title: "Extreme heat and the academic calendar",
    question: "How should schools and colleges in Rajshahi respond to increasingly severe heatwaves?",
    bn: "ক্রমবর্ধমান তীব্র তাপপ্রবাহ মোকাবিলায় রাজশাহীর স্কুল ও কলেজগুলোর কীভাবে সাড়া দেওয়া উচিত?",
    context: "Extreme heat can affect health, attendance, concentration, transport, and examination schedules. Calendar changes may help, but buildings, water, electricity, and unequal home conditions also matter.",
    vocabulary: [
      ["heatwave", "তাপপ্রবাহ", "a prolonged period of unusually hot weather", "Rajshahi experiences dangerous heatwaves before the monsoon."],
      ["heat-related illness", "তাপজনিত অসুস্থতা", "sickness caused by excessive heat", "Clean water helps prevent heat-related illness."],
      ["ventilation", "বায়ু চলাচল", "movement of fresh air through a space", "Many classrooms need better ventilation."],
      ["academic calendar", "শিক্ষাবর্ষের সময়সূচি", "the yearly schedule of teaching and holidays", "The academic calendar could avoid the hottest weeks."],
      ["adaptation", "অভিযোজন", "a change made to cope with new conditions", "Earlier classes are one form of climate adaptation."],
      ["infrastructure", "অবকাঠামো", "basic buildings, systems, and services", "Cooling requires reliable electricity infrastructure."],
      ["vulnerable", "ঝুঁকিপূর্ণ", "more likely to be harmed", "Younger children may be especially vulnerable."],
      ["disruption", "ব্যাঘাত", "an interruption to normal activity", "Sudden closures create learning disruption."]
    ],
    collocations: ["extreme heat", "adjust the calendar", "ensure safe drinking water", "improve ventilation", "disrupt learning", "health risk", "early-morning classes", "climate adaptation"],
    grammar: [
      ["Priority", "The most urgent step is to ___ because ___.", "The most urgent step is to ensure drinking water because dehydration is dangerous."],
      ["Concession", "Even if ___, schools still need to ___.", "Even if the calendar changes, schools still need better ventilation."],
      ["Future consequence", "Unless ___, ___ will ___.", "Unless buildings improve, heat will continue to disrupt learning."]
    ],
    topicChunks: ["protect student health", "shift class times", "upgrade school buildings", "avoid learning loss", "respond to local conditions"],
    questions: ["How does heat affect different students?", "Should class hours or holidays change?", "What low-cost changes are possible now?", "Could online learning help during closures?", "Who should fund building improvements?", "How can schools make decisions consistently?"],
    perspectives: ["A student traveling far by bus", "A teacher in a crowded classroom", "A school with limited electricity", "A parent who works during the day"],
    finalTask: "Choose one immediate, one medium-term, and one long-term response to extreme heat."
  },
  {
    id: 7,
    category: "Student Wellbeing",
    title: "Mental-health support in colleges",
    question: "What kind of mental-health support should colleges provide, and how can students use it without stigma or loss of privacy?",
    bn: "কলেজগুলো কী ধরনের মানসিক স্বাস্থ্য সহায়তা দেবে, এবং শিক্ষার্থীরা কীভাবে সামাজিক কলঙ্ক বা গোপনীয়তা হারানোর ভয় ছাড়া তা ব্যবহার করতে পারে?",
    context: "Students may experience academic pressure, family concerns, loneliness, or serious mental-health conditions. A counseling center can help only when it is trustworthy, accessible, and connected to appropriate professional care.",
    vocabulary: [
      ["counseling", "পরামর্শসেবা", "professional support through confidential conversation", "Counseling can help a student understand possible next steps."],
      ["stigma", "সামাজিক কলঙ্ক", "negative judgment attached to a condition or action", "Stigma prevents some students from asking for help."],
      ["confidential", "গোপনীয়", "kept private and not shared without permission", "Students need a confidential place to speak."],
      ["wellbeing", "সুস্থতা", "a state of physical and emotional health", "Sleep and belonging affect student wellbeing."],
      ["referral", "বিশেষজ্ঞের কাছে প্রেরণ", "sending someone to a more suitable professional", "Serious cases may require a medical referral."],
      ["accessible", "সহজলভ্য", "easy for people to reach and use", "Support should be accessible outside class hours."],
      ["early intervention", "প্রাথমিক পর্যায়ে সহায়তা", "help provided before a problem becomes more severe", "Early intervention can prevent a crisis."],
      ["peer support", "সহপাঠী সহায়তা", "organized support from people of a similar age or experience", "Trained peer support can reduce isolation."]
    ],
    collocations: ["seek help", "protect confidentiality", "reduce stigma", "emotional wellbeing", "trained counselor", "make a referral", "academic pressure", "support network"],
    grammar: [
      ["Purpose", "Colleges should ___ so that students can ___.", "Colleges should protect privacy so that students can speak honestly."],
      ["Distinguishing needs", "For ___, students need ___; whereas for ___, they may need ___.", "For everyday stress, students may need peer support; whereas for a crisis, they need a professional."],
      ["Cautious claim", "This could help, but only if ___.", "A counseling center could help, but only if staff are properly trained."]
    ],
    topicChunks: ["ask for support", "maintain confidentiality", "recognize warning signs", "refer a serious case", "normalize help-seeking"],
    questions: ["What prevents students from asking for help?", "Who should provide counseling?", "What must remain confidential?", "When can confidentiality be broken for safety?", "Could trained peers contribute?", "How would students learn that support exists?"],
    perspectives: ["A student afraid of being judged", "A trained counselor", "A teacher noticing a sudden change", "A college with a limited budget"],
    finalTask: "Propose a trustworthy college support system with clear privacy and referral rules."
  },
  {
    id: 8,
    category: "Health & Student Life",
    title: "Food choices in school canteens",
    question: "Should school canteens restrict junk food and soft drinks, or should students be free to choose what they buy?",
    bn: "স্কুল ক্যান্টিনে জাঙ্ক ফুড ও কোমল পানীয় সীমিত করা উচিত, নাকি শিক্ষার্থীরা কী কিনবে তা বেছে নেওয়ার স্বাধীনতা থাকা উচিত?",
    context: "Schools influence daily habits and have a duty of care, but healthy choices must also be affordable, appealing, and available. A simple ban may create different problems outside the school gate.",
    vocabulary: [
      ["nutritious", "পুষ্টিকর", "containing substances needed for health", "A nutritious lunch supports concentration."],
      ["processed food", "প্রক্রিয়াজাত খাবার", "food changed industrially and often containing additives", "Highly processed food may contain excess salt."],
      ["restrict", "সীমিত করা", "to control or limit something", "The school could restrict large sugary drinks."],
      ["affordable", "সাশ্রয়ী", "reasonably priced for people to buy", "Healthy meals must be affordable for students."],
      ["incentive", "উৎসাহমূলক সুবিধা", "something that encourages a choice", "Lower prices are an incentive to choose fruit."],
      ["portion", "খাবারের পরিমাণ", "the amount of food served to one person", "Smaller portions could reduce excessive sugar."],
      ["balanced diet", "সুষম খাদ্য", "a suitable variety of foods for good health", "One snack does not determine a balanced diet."],
      ["consumer choice", "ভোক্তার পছন্দ", "a buyer’s freedom to select a product", "Students value consumer choice."]
    ],
    collocations: ["balanced diet", "high in sugar", "healthy alternative", "affordable meal", "restrict sales", "make an informed choice", "long-term health", "canteen vendor"],
    grammar: [
      ["Rather than", "Rather than ___, schools could ___.", "Rather than banning every snack, schools could make healthy food cheaper."],
      ["Responsibility", "It is the responsibility of ___ to ___.", "It is the responsibility of schools to provide safe options."],
      ["Not only", "___ not only ___ but also ___.", "Good food not only protects health but also supports learning."]
    ],
    topicChunks: ["offer a healthy alternative", "influence eating habits", "preserve freedom of choice", "reduce sugar intake", "set nutrition standards"],
    questions: ["What do students actually buy and why?", "Should schools sell products known to be unhealthy?", "Would a ban move sales outside the gate?", "How important is price?", "Who should decide the menu?", "What changes would students accept?"],
    perspectives: ["A student with a small lunch budget", "A canteen vendor", "A parent concerned about health", "A school administrator"],
    finalTask: "Create a canteen policy that improves health while remaining affordable and realistic."
  },
  {
    id: 9,
    category: "Career & Community",
    title: "Youth migration and opportunity",
    question: "How does migration from Rajshahi affect young people, their families, and the local community? What would make staying a genuine choice?",
    bn: "রাজশাহী থেকে তরুণদের স্থানান্তর তাদের নিজেদের, পরিবার ও স্থানীয় সমাজের ওপর কী প্রভাব ফেলে? থেকে যাওয়াকে বাস্তবসম্মত পছন্দ করতে কী প্রয়োজন?",
    context: "Migration can bring education, income, experience, and international connections. It can also separate families and remove skills from local institutions. Avoid blaming migrants; examine the opportunities available in different places.",
    vocabulary: [
      ["migration", "স্থানান্তর", "movement from one place to live or work in another", "Graduate migration may be temporary or permanent."],
      ["brain drain", "মেধাপাচার", "loss of educated people from a region", "Hospitals may suffer when specialists leave."],
      ["remittance", "প্রবাসী আয়", "money sent home by someone working elsewhere", "Remittances can support education and housing."],
      ["opportunity", "সুযোগ", "a favorable situation for progress", "Young people move when local opportunity is limited."],
      ["retain", "ধরে রাখা", "to keep someone or something", "Competitive jobs can help the region retain graduates."],
      ["diaspora", "প্রবাসী জনগোষ্ঠী", "people from one place living in other countries", "The diaspora can invest in local businesses."],
      ["quality of life", "জীবনমান", "overall wellbeing in daily living", "Cost, safety, and family affect quality of life."],
      ["returnee", "ফিরে আসা ব্যক্তি", "someone who returns after living elsewhere", "A returnee may bring new skills and networks."]
    ],
    collocations: ["seek opportunity", "leave one’s hometown", "send remittances", "retain skilled workers", "local investment", "quality of life", "return migration", "professional network"],
    grammar: [
      ["Multiple effects", "___ benefits ___ by ___, but it may also ___.", "Migration benefits families through remittances, but it may also create separation."],
      ["Necessary condition", "Young people are more likely to stay if ___.", "Young people are more likely to stay if meaningful jobs exist."],
      ["Avoiding overgeneralization", "Not every ___; some ___, while others ___.", "Not every migrant leaves permanently; some return, while others invest from abroad."]
    ],
    topicChunks: ["pursue better opportunities", "contribute from abroad", "create meaningful local work", "maintain family ties", "bring skills back"],
    questions: ["Why do young people leave?", "What do families gain and lose?", "When does migration become brain drain?", "Can people contribute without returning?", "Which local opportunities matter most?", "Should anyone feel obligated to stay?"],
    perspectives: ["A graduate offered a job abroad", "An aging parent", "A local employer needing skilled staff", "A returnee starting a business"],
    finalTask: "Identify three changes that could make Rajshahi attractive without restricting anyone’s freedom to move."
  },
  {
    id: 10,
    category: "Technology & Access",
    title: "Cashless payments for student fees",
    question: "Should educational institutions require digital payments for student fees, or must cash remain an option?",
    bn: "শিক্ষাপ্রতিষ্ঠানে শিক্ষার্থীদের ফি ডিজিটালভাবে দেওয়া বাধ্যতামূলক করা উচিত, নাকি নগদ অর্থের বিকল্প রাখা দরকার?",
    context: "Digital payments can create records and reduce cash handling. They also depend on phones, accounts, connectivity, fees, and digital confidence. The group should distinguish encouraging a service from making it compulsory.",
    vocabulary: [
      ["cashless", "নগদবিহীন", "completed without physical money", "A cashless office may process payments faster."],
      ["transaction", "লেনদেন", "an exchange or payment", "The app records each transaction."],
      ["receipt", "রসিদ", "proof that a payment was made", "Students should receive a digital receipt immediately."],
      ["transparency", "স্বচ্ছতা", "openness that makes actions easy to check", "Payment records can improve transparency."],
      ["digital exclusion", "ডিজিটাল বঞ্চনা", "being unable to participate because of technology barriers", "Mandatory apps may create digital exclusion."],
      ["service charge", "সেবা ফি", "an extra amount charged for a service", "Who should pay the service charge?"],
      ["fraud", "প্রতারণা", "dishonest action intended to gain money", "Clear verification can reduce fraud."],
      ["contingency", "বিকল্প ব্যবস্থা", "a plan for an unexpected problem", "The office needs a contingency for network failure."]
    ],
    collocations: ["make a payment", "issue a receipt", "transaction record", "service charge", "network failure", "protect personal data", "reduce corruption", "cash alternative"],
    grammar: [
      ["Distinction", "There is a difference between encouraging ___ and requiring ___.", "There is a difference between encouraging digital payment and requiring an app."],
      ["Contingency", "In case of ___, students should be able to ___.", "In case of network failure, students should be able to pay later without penalty."],
      ["Fairness", "A policy would be unfair to students who ___.", "A digital-only policy would be unfair to students who lack an account."]
    ],
    topicChunks: ["keep a reliable record", "pay a service charge", "exclude some families", "provide a cash alternative", "protect financial data"],
    questions: ["What problems could digital payments solve?", "Who might be excluded?", "How reliable is connectivity?", "Who pays transaction fees?", "How should mistakes be corrected?", "Would a hybrid system work?"],
    perspectives: ["A student without a personal smartphone", "An accounts officer handling cash", "A parent unfamiliar with apps", "An institution trying to reduce missing records"],
    finalTask: "Recommend a payment system with clear accessibility, receipt, fee, and backup rules."
  },
  {
    id: 11,
    category: "Society & Student Life",
    title: "School uniforms and equality",
    question: "Do standard school uniforms reduce economic differences, or do they limit identity without solving inequality?",
    bn: "একই ধরনের স্কুল ইউনিফর্ম কি অর্থনৈতিক বৈষম্য কমায়, নাকি বৈষম্য সমাধান না করে ব্যক্তিগত পরিচয় প্রকাশে বাধা দেয়?",
    context: "Uniforms may create belonging and reduce visible clothing competition. Their cost, comfort, gender rules, climate suitability, and enforcement can still affect students unequally.",
    vocabulary: [
      ["uniform", "ইউনিফর্ম", "standard clothing worn by members of a group", "The uniform identifies students from the same school."],
      ["inequality", "বৈষম্য", "an unfair difference in resources or treatment", "Uniforms cannot remove every form of inequality."],
      ["belonging", "অন্তর্ভুক্তির অনুভূতি", "feeling accepted as part of a group", "Shared clothing may strengthen belonging."],
      ["self-expression", "আত্মপ্রকাশ", "showing one’s personality or identity", "Some students value clothing as self-expression."],
      ["affordability", "ক্রয়সাধ্যতা", "the quality of being reasonably priced", "Affordability depends on the required supplier."],
      ["dress code", "পোশাকবিধি", "rules about acceptable clothing", "A flexible dress code could replace a single uniform."],
      ["inclusive", "অন্তর্ভুক্তিমূলক", "designed to include different people and needs", "An inclusive uniform offers practical options."],
      ["enforcement", "নিয়ম প্রয়োগ", "the act of making sure a rule is followed", "Harsh enforcement can embarrass poorer students."]
    ],
    collocations: ["wear a uniform", "sense of belonging", "economic difference", "express individuality", "enforce a dress code", "affordable option", "school identity", "financial assistance"],
    grammar: [
      ["Extent", "___ may reduce ___, but it cannot eliminate ___.", "Uniforms may reduce clothing competition, but they cannot eliminate inequality."],
      ["Evaluation", "The policy is effective only when ___.", "The policy is effective only when uniforms are affordable."],
      ["Alternative", "A more flexible approach would be to ___.", "A more flexible approach would be to allow several approved items."]
    ],
    topicChunks: ["create a shared identity", "hide visible differences", "express individuality", "offer financial assistance", "apply the rule sensitively"],
    questions: ["What problems are uniforms intended to solve?", "How expensive are required items?", "Do uniforms affect behavior or learning?", "Which forms of flexibility matter?", "How should violations be handled?", "What would an inclusive policy look like?"],
    perspectives: ["A family buying uniforms for several children", "A student who values self-expression", "A teacher enforcing the dress code", "A student needing a religious or disability accommodation"],
    finalTask: "Design an inclusive clothing policy that balances belonging, cost, comfort, and choice."
  },
  {
    id: 12,
    category: "Society, Culture & Ethics",
    title: "Community service and graduation",
    question: "Should community service be required for graduation, or does compulsory volunteering contradict the idea of service?",
    bn: "স্নাতক হওয়ার জন্য সমাজসেবা বাধ্যতামূলক করা উচিত, নাকি বাধ্যতামূলক স্বেচ্ছাসেবা সেবার মূল ধারণার সঙ্গে বিরোধী?",
    context: "Community service can build empathy, experience, and local connections. A requirement may also burden students who work, care for family, live far away, or cannot access safe placements.",
    vocabulary: [
      ["community service", "সমাজসেবা", "unpaid work intended to benefit the community", "Tutoring younger children can be community service."],
      ["voluntary", "স্বেচ্ছামূলক", "done freely rather than by force", "Some argue that meaningful service must be voluntary."],
      ["prerequisite", "পূর্বশর্ত", "something required before another thing is allowed", "Service could become a graduation prerequisite."],
      ["civic responsibility", "নাগরিক দায়িত্ব", "a person’s duty toward the wider community", "Education can develop civic responsibility."],
      ["placement", "কাজের স্থান নির্ধারণ", "an assigned opportunity to gain experience", "The college should check that each placement is safe."],
      ["accommodation", "বিশেষ ব্যবস্থা", "a change made to meet someone’s particular need", "Working students may need a flexible accommodation."],
      ["meaningful", "অর্থবহ", "having real purpose or value", "Counting attendance alone does not make service meaningful."],
      ["reflection", "পর্যালোচনামূলক চিন্তা", "careful thought about an experience", "Reflection helps connect service with learning."]
    ],
    collocations: ["serve the community", "complete service hours", "civic responsibility", "meaningful contribution", "safe placement", "reflect on experience", "meet a requirement", "flexible schedule"],
    grammar: [
      ["Principle and practice", "In principle ___; in practice ___.", "In principle service benefits everyone; in practice access may be unequal."],
      ["Making exceptions", "Students who ___ should be allowed to ___.", "Students who care for relatives should be allowed to count that work."],
      ["Preventing tokenism", "To ensure that ___ is meaningful, colleges should ___.", "To ensure that service is meaningful, colleges should require reflection."]
    ],
    topicChunks: ["make a meaningful contribution", "complete required hours", "connect service with learning", "recognize existing responsibilities", "provide safe placements"],
    questions: ["What should count as community service?", "Does requiring it reduce its moral value?", "Who might find the requirement difficult?", "How many hours would be reasonable?", "How can colleges prevent fake participation?", "What should students learn from the experience?"],
    perspectives: ["A student with a part-time job", "A local organization needing volunteers", "A college responsible for student safety", "A student already caring for relatives"],
    finalTask: "Create a fair service-learning proposal, including alternatives and accommodations."
  }
];
