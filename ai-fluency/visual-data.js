/* Short, paired evidence extracts for demonstration and guided practice.
 * Each comparison names exactly which output chunk to inspect. */
window.VISUAL_CASES={
cv:{
 noun:'a one-page CV',audience:'a local employer',brief:'Nusrat needs an internship.',bn:'নুসরাতের একটি ইন্টার্নশিপ দরকার।',
 good:['NUSRAT JAHAN','English student · graduation 2027','Tutored 3 school students','Checked in 45 attendees'],bad:['NUSRAT JAHAN','Award-winning graduate','Led 45 volunteers','Improved marks by 40%'],
 qualities:[['True facts','45 attendees → 45 attendees'],['Relevant experience','Tutoring → student communication'],['One readable page','Short headings + clear bullets']],wrong:['Impressive invented awards','Every detail about her life'],
 sort:[['Confirm her experience','Human','Nusrat knows what she did.'],['Suggest clearer wording','AI draft','AI can suggest words.'],['Review wording against the facts','Human + AI','AI suggests; Nusrat checks and decides.']],
 parts:[['Draft a one-page CV.','Write anything impressive.'],['Ask about missing facts first.','Fill gaps with guesses.'],['Be an honest editor.','Agree with every claim.']],
 compare:[
 {key:'45',heading:'EVENT EXPERIENCE',source:['Checked in','45','attendees'],output:['Led a team of','45','volunteers'],target:0,targets:[0,2],verdict:'changed',label:'Same number. A different job.',bn:'সংখ্যা একই। কিন্তু কাজটি বদলে গেছে।',repair:'Checked in 45 attendees.'},
 {key:'3',heading:'TUTORING',source:['Tutored','3','school students'],output:['Tutored','3','school students'],target:0,verdict:'same',label:'The work and number match.',bn:'কাজ ও সংখ্যা দুটোই মিলেছে।',repair:'Tutored 3 school students.'},
 {key:'marks',heading:'TUTORING RESULTS',source:['No measured result','recorded','for tutoring'],output:['Improved marks','by 40%','through tutoring'],target:1,verdict:'missing',label:'40% has no supporting evidence.',bn:'৪০% দাবির পক্ষে কোনো তথ্য নেই।',repair:'Remove the 40% claim.'}],
 sentence:['Tutored','3 school students','in English','from January to June 2026.'],
 gates:[['Passport scan in the prompt','Use experience + placeholders','Upload it anyway'],['“AI wrote nothing”','Describe the editing honestly','Hide the assistance'],['Email and phone still blank','Add and check them yourself','Submit the placeholders']],
 transfer:{brief:'New audience: a summer programme abroad.',old:'One-page local internship CV',next:'70-word teamwork profile',keep:'6-slide group project',avoid:'Invented IELTS score',sentence:'We need a 70-word profile showing real teamwork.',check:['Match every claim to her facts.','Check whether it sounds impressive only.']}
},
research:{
 noun:'an evidence-based comparison',audience:'Rafi',brief:'Rafi has BDT 8,000 and exams in June.',bn:'রাফির বাজেট ৮,০০০ টাকা। জুনে তার পরীক্ষা।',
 good:['OPPORTUNITY CHECK','A · July · eligible','No fee; travel costs unknown','B · June · not eligible'],bad:['BEST OPTION: ABROAD','All costs paid!','85% chance of selection','No need to check dates'],
 qualities:[['Source-backed claims','Notice A → column A'],['Check the dates','Exams ↔ programme dates'],['Show unknown costs','Not stated → ask']],wrong:['Choose abroad automatically','Treat a link as proof'],
 sort:[['Set budget and priorities','Human','Rafi sets his limits.'],['Make a comparison table','AI draft','AI can organise supplied facts.'],['Check eligibility and choose','Human + AI','AI compares; Rafi verifies and decides.']],
 parts:[['Compare dates, costs and eligibility.','Choose the most exciting country.'],['Use the notices; label missing facts.','Guess any missing costs.'],['Be cautious about unknowns.','Sound completely certain.']],
 compare:[
 {key:'fee',heading:'FUNDING',source:['Participation fee','waived','Travel conditional'],output:['All costs','paid','Travel guaranteed'],target:0,targets:[0,2],verdict:'changed',label:'A fee waiver is not all costs.',bn:'ফি মওকুফ মানে সব খরচ দেওয়া নয়।',repair:'Fee waived; travel support is conditional.'},
 {key:'July',heading:'NOTICE A · DATES',source:['Internship','1–30 July','No fee'],output:['Internship','1–30 July','No fee'],target:1,verdict:'same',label:'The dates match the notice.',bn:'তারিখ বিজ্ঞপ্তির সঙ্গে মিলেছে।',repair:'Keep 1–30 July.'},
 {key:'selection',heading:'SELECTION',source:['Selection chance','not stated','in either notice'],output:['Selection chance','85%','for Rafi'],target:1,verdict:'missing',label:'No source gives 85%.',bn:'কোনো উৎসে ৮৫% বলা নেই।',repair:'Selection chance: not stated.'}],
 sentence:['According to notice A,','there is no participation fee,','but travel','is not reimbursed.'],
 gates:[['Only an AI summary available','Check the organiser’s notice','Trust the summary'],['Some costs not stated','Label them as unknown','Call it fully funded'],['Rafi must choose','Explain the trade-offs to him','Let AI decide his priorities']],
 transfer:{brief:'New option: an online teamwork project.',old:'Local internship · travel costs',next:'Online · BDT 2,000 · 5–25 July',keep:'All university years eligible',avoid:'Assume internet is free and reliable',sentence:'The online project may fit, but we must check the connection needs.',check:['Ask whether meetings must be live.','Assume online means no extra costs.']}
},
email:{
 noun:'a short placement enquiry',audience:'Dr Sen',brief:'Mehedi wants a remote research placement.',bn:'মেহেদি দূর থেকে গবেষণার কাজ শিখতে চায়।',
 good:['JULY PLACEMENT ENQUIRY','Dear Dr Sen,','Interviewed 6 classmates','Could you let me know whether…'],bad:['URGENT ACCEPTANCE REQUIRED','World-famous Professor!','I am a published expert','Confirm my funding immediately'],
 qualities:[['One clear request','Could you let me know…?'],['True experience','Class project ≠ publication'],['Real availability','4 hours per week']],wrong:['Excessive praise','Demand immediate acceptance'],
 sort:[['Choose real availability','Human','Mehedi commits his own time.'],['Suggest a polite structure','AI draft','AI can suggest a draft.'],['Check the email before sending','Human + AI','AI edits; Mehedi checks and sends.']],
 parts:[['Draft a short placement enquiry.','Demand a confirmed place.'],['Use my facts; ask what is missing.','Invent a connection to the professor.'],['Use polite, natural English.','Use impressive praise everywhere.']],
 compare:[
 {key:'6',heading:'EXPERIENCE',source:['Course project:','interviewed 6 classmates','No publication'],output:['Published research:','interviewed 6 classmates','Expert researcher'],target:0,targets:[0,2],verdict:'changed',label:'A class project became a publication.',bn:'ক্লাসের প্রকল্পকে প্রকাশিত গবেষণা বলা হয়েছে।',repair:'For a course project, I interviewed 6 classmates.'},
 {key:'July',heading:'AVAILABILITY',source:['Remote','4 hours a week','in July'],output:['Remote','4 hours a week','in July'],target:1,verdict:'same',label:'This is the time he can offer.',bn:'সে সত্যিই এই সময় দিতে পারবে।',repair:'Keep four hours a week in July.'},
 {key:'funding',heading:'PLACEMENT NOTICE',source:['Placement enquiries','welcome','Funding not stated'],output:['Your funded place','is confirmed','Apply now'],target:1,verdict:'missing',label:'An enquiry is not an offer.',bn:'তথ্য চাওয়া মানে সুযোগ নিশ্চিত হওয়া নয়।',repair:'Ask whether placements are available.'}],
 sentence:['Could you let me know','whether','you accept','remote students?'],
 gates:[['Recipient address guessed','Check the official address','Send to the guessed address'],['Email claims no AI help','Keep an honest editing record','Pretend it was unaided'],['Availability says “full-time”','Restore 4 hours per week','Promise full-time work']],
 transfer:{brief:'New reader: a local NGO.',old:'Remote research placement abroad',next:'Local fieldwork internship',keep:'Interviewed 6 classmates in Bangla',avoid:'Claim professional research experience',sentence:'My Bangla interview project may be relevant to your local fieldwork.',check:['Check the NGO’s required availability.','Reuse the old hours without checking.']}
},
document:{
 noun:'a one-page volunteer brief',audience:'student volunteers',brief:'Tania needs volunteers to know what to do.',bn:'স্বেচ্ছাসেবকদের কাজ বোঝাতে তানিয়ার নির্দেশনা দরকার।',
 good:['VOLUNTEER BRIEF','9:30 · Room 204','1. Arrive and confirm your role','Missing name? Ask the organiser'],bad:['VOLUNTEER GALA BLUEPRINT','10:00 · Room 402','Refuse people not on the list','Share a photo of the list'],
 qualities:[['Correct logistics','9:30 · Room 204'],['Clear steps','1 → 2 → 3'],['Readable on a phone','Short headings · one column']],wrong:['Tiny decorative text','Invent missing instructions'],
 sort:[['Confirm the room and time','Human','The organiser knows the logistics.'],['Draft short numbered steps','AI draft','AI can arrange confirmed notes.'],['Check the final page','Human + AI','AI suggests; Tania checks the export.']],
 parts:[['Make a one-page volunteer brief.','Make a decorative four-page brochure.'],['Use confirmed notes; flag gaps.','Invent any missing instructions.'],['Keep instructions short and clear.','Use complicated formal English.']],
 compare:[
 {key:'Room',heading:'WHERE',source:['Room','204','Volunteer arrival 9:30'],output:['Room','402','Volunteer arrival 10:00'],target:1,targets:[1,2],verdict:'changed',label:'The room number changed.',bn:'কক্ষের নম্বর বদলে গেছে।',repair:'Room 204; volunteers arrive at 9:30.'},
 {key:'Two',heading:'ROLES',source:['Two','check names','One guides attendees'],output:['Two','check names','One guides attendees'],target:1,verdict:'same',label:'These roles match the notes.',bn:'কাজের ভাগ নির্দেশনার সঙ্গে মিলেছে।',repair:'Keep the role split.'},
 {key:'Contact',heading:'UNCONFIRMED DETAILS',source:['Contact number','not provided','Ask the organiser'],output:['Contact number','confirmed','Ready to circulate'],target:1,verdict:'missing',label:'A missing detail cannot be confirmed.',bn:'না পাওয়া তথ্যকে নিশ্চিত বলা যায় না।',repair:'Contact number: confirm with organiser.'}],
 sentence:['If a name is missing,','ask the organiser','before','taking action.'],
 gates:[['Registration list photographed','Remove the photo; use task notes','Share it in the group'],['AI helped draft the brief','Tell the organiser what AI changed','Hide the changes'],['Emergency plan still missing','Hold the draft; ask the organiser','Circulate it now']],
 transfer:{brief:'New document: a checklist for an intern.',old:'Workshop volunteer briefing',next:'New-intern checklist',keep:'Reception 9:00 · bring a notebook',avoid:'Invent a dress code',sentence:'Arrive at reception at 9:00 and bring a notebook.',check:['Ask the supervisor about missing rules.','Fill missing rules from a similar company.']}
},
image:{
 noun:'a square workshop poster',audience:'students on WhatsApp',brief:'Sadia needs a clear, honest event poster.',bn:'সাদিয়ার স্পষ্ট ও সঠিক তথ্যের একটি পোস্টার দরকার।',
 good:['CAREER STEPS','Free peer-led workshop','18 November · Room 105','Compare your next steps'],bad:['CAREER STEPS','Guaranteed jobs & visas!','Official university recruitment','Success is certain'],
 qualities:[['Honest event details','Workshop ≠ guaranteed job'],['Readable on a phone','Large, high-contrast text'],['Fictional, labelled artwork','AI illustration · no real faces']],wrong:['An invented university logo','Guaranteed visas'],
 sort:[['Confirm event text and permission','Human','The organiser confirms the offer.'],['Create fictional artwork','AI draft','Image AI can create an illustration.'],['Add text and check the poster','Human + AI','Human adds facts; checks the image too.']],
 parts:[['Create a square student-workshop illustration.','Create an official university recruitment photo.'],['No text; I will add verified details.','Invent text and a QR code inside the image.'],['Show fictional students as equal collaborators.','Copy real students’ faces without permission.']],
 compare:[
 {key:'workshop',heading:'WHAT IS OFFERED',source:['Free','peer-led workshop','Compare opportunities'],output:['Guaranteed','jobs and visas','Official recruitment'],target:1,targets:[0,1,2],verdict:'changed',label:'A workshop became a job promise.',bn:'কর্মশালাকে চাকরির নিশ্চয়তা বলা হয়েছে।',repair:'Free peer-led workshop: compare opportunities.'},
 {key:'18',heading:'WHEN',source:['18 November','3:00–4:30 pm','Room 105'],output:['18 November','3:00–4:30 pm','Room 105'],target:0,verdict:'same',label:'The event details match.',bn:'অনুষ্ঠানের তথ্য মিলেছে।',repair:'Keep the date, time and room.'},
 {key:'university',heading:'PERMISSION',source:['University logo','not authorised','No endorsement'],output:['Official university','recruitment event','Endorsed'],target:0,verdict:'missing',label:'No permission supports “official”.',bn:'“অফিশিয়াল” দাবির পক্ষে অনুমতি নেই।',repair:'Remove official university branding.'}],
 sentence:['Use high-contrast text','so that','students can read it','on a small phone.'],
 gates:[['Real students’ faces copied','Use a fictional illustration','Use the faces without asking'],['Artwork looks like a real event','Label it as an AI illustration','Present it as an event photo'],['Poster text says guaranteed visas','Replace it with the real offer','Publish the promise']],
 transfer:{brief:'New poster: a café conversation evening.',old:'Career workshop',next:'Friday · 5 pm · conversation practice',keep:'Free practice; drinks sold separately',avoid:'Suggest free drinks',sentence:'Join free conversation practice. Drinks are sold separately.',check:['Check text at phone size and get approval.','Check only how attractive it looks.']}
},
code:{
 noun:'a tested cost calculator',audience:'student organisers',brief:'Arif needs to split workshop costs.',bn:'আরিফ কর্মশালার খরচ ভাগ করতে চায়।',
 good:['WORKSHOP COST','Total costs: BDT 1,000 · 5 people','Correct grouping: (600 + 400) ÷ 5','BDT 200 each'],bad:['WORKSHOP COST','600 + (400 ÷ 5)','BDT 680 each','0 people → Infinity'],
 qualities:[['Correct calculation','(600 + 400) ÷ 5 = 200'],['Useful error messages','0 people → ask for at least 1'],['Only needed inputs','Costs + people · no personal data']],wrong:['A confident “perfect” claim','Collect payments automatically'],
 sort:[['Decide the formula and expected result','Human','Arif defines what correct means.'],['Draft a small calculator','AI draft','AI can write a bounded first version.'],['Test and improve the calculator','Human + AI','AI helps fix; Arif verifies behaviour.']],
 parts:[['Build a phone-friendly cost calculator.','Build accounts, profiles and payments.'],['Confirm the formula, then test edge cases.','Skip tests if the screen looks good.'],['Explain assumptions in plain English.','Call the first version perfect.']],
 compare:[
 {key:'5',heading:'NORMAL TEST',source:['(600 + 400) ÷ 5','should give','200'],output:['600 + (400 ÷ 5)','actually gives','680'],target:2,targets:[0,2],verdict:'changed',label:'Expected 200. Actual 680.',bn:'হওয়ার কথা ২০০। এসেছে ৬৮০।',repair:'Divide the whole sum by attendees.'},
 {key:'3',heading:'ROUNDING TEST',source:['1000 ÷ 3','round up','334'],output:['1000 ÷ 3','round up','334'],target:2,verdict:'same',label:'The rounded result is correct.',bn:'রাউন্ড করার ফল সঠিক।',repair:'Keep rounding up to a whole taka.'},
 {key:'tested',heading:'TEST RECORD',source:['Tests run:','one normal case','No edge-case results'],output:['All cases','tested and passed','No more checks needed'],target:0,verdict:'missing',label:'One test cannot prove all cases.',bn:'একটি পরীক্ষা দিয়ে সব ক্ষেত্র প্রমাণ হয় না।',repair:'Run zero, blank and negative-input tests.'}],
 sentence:['If I enter 0 attendees,','the tool should ask for at least 1,','but','it shows Infinity.'],
 gates:[['Only costs are needed','Use costs and attendee count','Add names and phone numbers'],['AI drafted code','Keep an honest test and assistance record','Claim every line was unaided'],['Zero attendees not tested','Run the zero-attendee test','Share it because it looks finished']],
 transfer:{brief:'New tool: divide study time between tasks.',old:'Workshop costs ÷ attendees',next:'90 minutes ÷ 3 tasks = 30 minutes',keep:'0 tasks → a helpful error',avoid:'Divide by zero',sentence:'If there are 3 tasks and 90 minutes, show 30 minutes per task.',check:['Test normal, zero and negative inputs.','Only test the normal example.']}
}
};
