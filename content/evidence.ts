/**
 * THE RESEARCH BEHIND "WHY VISUAL LEARNING WORKS", AND THE ONLY PLACE IT IS WRITTEN.
 * `/why-visual-learning` renders all of it; the home page shows three findings from it (`HOME_EVIDENCE`).
 *
 * ⚠️ THE RULES FOR A ROW HERE (founder, 2026-11-22):
 *   1. A real source: a peer-reviewed paper, or a university or government page. No blog, no vendor, no infographic.
 *   2. Somebody OPENED it and read the sentence we rely on. The abstract is the minimum; most of these were read as
 *      the abstract (PubMed / the publisher page), and the claim is written no stronger than that abstract.
 *   3. Every number is copied from the source, with its unit and its comparison. No rounding up, no "up to".
 *   4. Every finding carries its LIMIT beside it: the sample, the setting, what the study did not show.
 *   5. Never the "learning styles" claim, and never the "80% of what we see" / "60,000 times faster" numbers.
 * ⚠️ A source here is a fact about a paper, not about our products. No sentence may say the research tested Radlor.
 *
 * Checked on CHECKED_ON. A source that moves or changes is stale until somebody opens it again.
 */
export const CHECKED_ON = '22 November 2026'

type Source = { short: string; cite: string; url: string }

export const SOURCES = {
  hoffler2007: {
    short: 'Höffler & Leutner, 2007',
    cite: 'Höffler TN, Leutner D. Instructional animation versus static pictures: a meta-analysis. Learning and Instruction. 2007;17(6):722–738.',
    url: 'https://doi.org/10.1016/j.learninstruc.2007.09.013',
  },
  berney2016: {
    short: 'Berney & Bétrancourt, 2016',
    cite: 'Berney S, Bétrancourt M. Does animation enhance learning? A meta-analysis. Computers & Education. 2016;101:150–167.',
    url: 'https://archive-ouverte.unige.ch/unige:92234',
  },
  tversky2002: {
    short: 'Tversky et al., 2002',
    cite: 'Tversky B, Morrison JB, Bétrancourt M. Animation: can it facilitate? International Journal of Human-Computer Studies. 2002;57(4):247–262.',
    url: 'https://doi.org/10.1006/ijhc.2002.1017',
  },
  ayres2009: {
    short: 'Ayres et al., 2009',
    cite: 'Ayres P, Marcus N, Chan C, Qian N. Learning hand manipulative tasks: when instructional animations are superior to equivalent static representations. Computers in Human Behavior. 2009;25(2):348–353.',
    url: 'https://doi.org/10.1016/j.chb.2008.12.013',
  },
  watson2010: {
    short: 'Watson et al., 2010',
    cite: 'Watson G, Butterfield J, Curran R, Craig C. Do dynamic work instructions provide an advantage over static instructions in a small scale assembly task? Learning and Instruction. 2010;20(1):84–93.',
    url: 'https://eric.ed.gov/?id=EJ863665',
  },
  arguel2009: {
    short: 'Arguel & Jamet, 2009',
    cite: 'Arguel A, Jamet É. Using video and static pictures to improve learning of procedural contents. Computers in Human Behavior. 2009;25(2):354–359.',
    url: 'https://doi.org/10.1016/j.chb.2008.12.014',
  },
  heiser2004: {
    short: 'Heiser et al., 2004',
    cite: 'Heiser J, Phan D, Agrawala M, Tversky B, Hanrahan P. Identification and validation of cognitive design principles for automated generation of assembly instructions. Proceedings of the Working Conference on Advanced Visual Interfaces (AVI ’04). ACM; 2004:311–319.',
    url: 'https://doi.org/10.1145/989863.989917',
  },
  noetel2021: {
    short: 'Noetel et al., 2021',
    cite: 'Noetel M, Griffith S, Delaney O, et al. Video improves learning in higher education: a systematic review. Review of Educational Research. 2021;91(2):204–236.',
    url: 'https://eric.ed.gov/?id=EJ1290063',
  },
  vandermeij2014: {
    short: 'van der Meij & van der Meij, 2014',
    cite: 'van der Meij H, van der Meij J. A comparison of paper-based and video tutorials for software learning. Computers & Education. 2014;78:150–159.',
    url: 'https://doi.org/10.1016/j.compedu.2014.06.003',
  },
  rey2019: {
    short: 'Rey et al., 2019',
    cite: 'Rey GD, Beege M, Nebel S, Wirzberger M, Schmitt TH, Schneider S. A meta-analysis of the segmenting effect. Educational Psychology Review. 2019;31(2):389–419.',
    url: 'https://eric.ed.gov/?id=EJ1217373',
  },
  guo2014: {
    short: 'Guo et al., 2014',
    cite: 'Guo PJ, Kim J, Rubin R. How video production affects student engagement: an empirical study of MOOC videos. Proceedings of the First ACM Conference on Learning @ Scale (L@S ’14). ACM; 2014:41–50.',
    url: 'https://doi.org/10.1145/2556325.2566239',
  },
  ies2021: {
    short: 'IES practice guide, 2021',
    cite: 'Fuchs LS, Newman-Gonchar R, Schumacher R, et al. Assisting Students Struggling with Mathematics: Intervention in the Elementary Grades (WWC 2021006). Institute of Education Sciences, US Department of Education; 2021.',
    url: 'https://ies.ed.gov/ncee/wwc/PracticeGuide/26',
  },
  ies2012: {
    short: 'IES practice guide, 2012',
    cite: 'Woodward J, Beckmann S, Driscoll M, et al. Improving Mathematical Problem Solving in Grades 4 Through 8 (NCEE 2012-4055). Institute of Education Sciences, US Department of Education; 2012.',
    url: 'https://ies.ed.gov/ncee/wwc/PracticeGuide/16',
  },
  mayer2023: {
    short: 'Mayer, 2023',
    cite: 'Mayer RE. Research-based principles for designing multimedia instruction. In: Overson CE, Hakala CM, Kordonowy LL, Benassi VA, eds. In Their Own Words: What Scholars and Teachers Want You to Know About Why and How to Apply the Science of Learning in Your Academic Setting. Society for the Teaching of Psychology; 2023:143–157.',
    url: 'https://www.unh.edu/teaching-learning-resource-hub/sites/default/files/media/2023-06/itow-research-based-principles-for-designing-multimedia-instruction-mayer.pdf',
  },
  clarkPaivio1991: {
    short: 'Clark & Paivio, 1991',
    cite: 'Clark JM, Paivio A. Dual coding theory and education. Educational Psychology Review. 1991;3(3):149–210.',
    url: 'https://doi.org/10.1007/BF01320076',
  },
  paivio1991: {
    short: 'Paivio, 1991',
    cite: 'Paivio A. Dual coding theory: retrospect and current status. Canadian Journal of Psychology. 1991;45(3):255–287.',
    url: 'https://doi.org/10.1037/h0084295',
  },
  standing1973: {
    short: 'Standing, 1973',
    cite: 'Standing L. Learning 10,000 pictures. Quarterly Journal of Experimental Psychology. 1973;25(2):207–222.',
    url: 'https://doi.org/10.1080/14640747308400340',
  },
  brady2008: {
    short: 'Brady et al., 2008',
    cite: 'Brady TF, Konkle T, Alvarez GA, Oliva A. Visual long-term memory has a massive storage capacity for object details. Proceedings of the National Academy of Sciences. 2008;105(38):14325–14329.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC2533687/',
  },
  cowan2001: {
    short: 'Cowan, 2001',
    cite: 'Cowan N. The magical number 4 in short-term memory: a reconsideration of mental storage capacity. Behavioral and Brain Sciences. 2001;24(1):87–114.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/11515286/',
  },
  mayerMoreno2003: {
    short: 'Mayer & Moreno, 2003',
    cite: 'Mayer RE, Moreno R. Nine ways to reduce cognitive load in multimedia learning. Educational Psychologist. 2003;38(1):43–52.',
    url: 'https://doi.org/10.1207/S15326985EP3801_6',
  },
  pashler2008: {
    short: 'Pashler et al., 2008',
    cite: 'Pashler H, McDaniel M, Rohrer D, Bjork R. Learning styles: concepts and evidence. Psychological Science in the Public Interest. 2008;9(3):105–119.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/26162104/',
  },
  subramony2014: {
    short: 'Subramony et al., 2014',
    cite: 'Subramony DP, Molenda M, Betrus AK, Thalheimer W. The mythical retention chart and the corruption of Dale’s Cone of Experience. Educational Technology. 2014;54(6):6–16. ERIC record EJ1057239.',
    url: 'https://eric.ed.gov/?id=EJ1057239',
  },
  houts2006: {
    short: 'Houts et al., 2006',
    cite: 'Houts PS, Doak CC, Doak LG, Loscalzo MJ. The role of pictures in improving health communication: a review of research on attention, comprehension, recall, and adherence. Patient Education and Counseling. 2006;61(2):173–190.',
    url: 'https://doi.org/10.1016/j.pec.2005.05.004',
  },
  austin1995: {
    short: 'Austin et al., 1995',
    cite: 'Austin PE, Matlack R, Dunn KA, Kesler C, Brown CK. Discharge instructions: do illustrations help our patients understand them? Annals of Emergency Medicine. 1995;25(3):317–320.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/7532382/',
  },
  delp1996: {
    short: 'Delp & Jones, 1996',
    cite: 'Delp C, Jones J. Communicating information to patients: the use of cartoon illustrations to improve comprehension of instructions. Academic Emergency Medicine. 1996;3(3):264–270.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/8673784/',
  },
  yin2008: {
    short: 'Yin et al., 2008',
    cite: 'Yin HS, Dreyer BP, van Schaick L, Foltin GL, Dinglas C, Mendelsohn AL. Randomized controlled trial of a pictogram-based intervention to reduce liquid medication dosing errors and improve adherence among caregivers of young children. Archives of Pediatrics & Adolescent Medicine. 2008;162(9):814–822.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/18762597/',
  },
  katz2006: {
    short: 'Katz et al., 2006',
    cite: 'Katz MG, Kripalani S, Weiss BD. Use of pictorial aids in medication instructions: a review of the literature. American Journal of Health-System Pharmacy. 2006;63(23):2391–2397.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/17106013/',
  },
  schubbe2020: {
    short: 'Schubbe et al., 2020',
    cite: 'Schubbe D, Scalia P, Yen RW, et al. Using pictures to convey health information: a systematic review and meta-analysis of the effects on patient and consumer health behaviors and outcomes. Patient Education and Counseling. 2020;103(10):1935–1960.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/32466864/',
  },
  hoek2020: {
    short: 'Hoek et al., 2020',
    cite: 'Hoek AE, Anker SCP, van Beeck EF, Burdorf A, Rood PPM, Haagsma JA. Patient discharge instructions in the emergency department and their effects on comprehension and recall of discharge instructions: a systematic review and meta-analysis. Annals of Emergency Medicine. 2020;75(3):435–444.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/31439363/',
  },
  tuong2014: {
    short: 'Tuong et al., 2014',
    cite: 'Tuong W, Larsen ER, Armstrong AW. Videos to influence: a systematic review of effectiveness of video-based education in modifying health behaviors. Journal of Behavioral Medicine. 2014;37(2):218–233.',
    url: 'https://pubmed.ncbi.nlm.nih.gov/23188480/',
  },
  ahrq: {
    short: 'AHRQ, Health Literacy Toolkit',
    cite: 'Agency for Healthcare Research and Quality (US). Assess, Select, and Create Easy-to-Understand Materials: Tool 11. Health Literacy Universal Precautions Toolkit, 3rd edition.',
    url: 'https://www.ahrq.gov/health-literacy/improve/precautions/tool11.html',
  },
  cdc: {
    short: 'CDC Clear Communication Index',
    cite: 'Centers for Disease Control and Prevention (US). The CDC Clear Communication Index: item on visuals that support the main message.',
    url: 'https://www.cdc.gov/ccindex/tool/page-4.html',
  },
  grady1998: {
    short: 'Grady et al., 1998',
    cite: 'Grady CL, McIntosh AR, Rajah MN, Craik FIM. Neural correlates of the episodic encoding of pictures and words. Proceedings of the National Academy of Sciences. 1998;95(5):2703–2708.',
    url: 'https://pmc.ncbi.nlm.nih.gov/articles/PMC19469/',
  },
} satisfies Record<string, Source>

export type SourceId = keyof typeof SOURCES

type Finding = { title: string; body: string; refs: readonly SourceId[]; limit: string }
type Section = { id: string; nav: string; eyebrow: string; title: string; intro: string; findings: Finding[] }

const MIND: Section = {
  id: 'mind',
  nav: 'The mind',
  eyebrow: 'Cognitive psychology',
  title: 'Words and pictures together beat words alone.',
  intro:
    'Psychologists have tested this for more than fifty years. The strongest result is not “pictures are better”. It is that a picture and the words that explain it work best together.',
  findings: [
    {
      title: 'The multimedia principle',
      body: 'In 13 experimental comparisons, students who learned from words and graphics did much better on a test that asked them to use the idea in a new problem than students who learned from words alone. The median effect size was d = 1.35, a large effect.',
      refs: ['mayer2023'],
      limit: 'Most of these were short lessons for college students in one research group, tested soon after the lesson. Mayer also says that not all graphics are equally useful.',
    },
    {
      title: 'Two channels: one for words, one for pictures',
      body: 'Dual coding theory says that the mind keeps verbal and image-based representations, and that these two kinds work together. Multimedia learning research assumes that each channel can only process a small amount at a time.',
      refs: ['clarkPaivio1991', 'paivio1991', 'mayerMoreno2003'],
      limit: 'Dual coding is a theory, and it has critics: some researchers argue that all knowledge is stored in one abstract form.',
    },
    {
      title: 'Picture memory is very large',
      body: 'People who saw 10,000 pictures once, a few seconds each, still recognized most of them about two days later. Memory for pictures was better than memory for words. In a later study, adults who saw 2,500 object pictures picked the right one from a pair 87% to 92% of the time, even when the other picture was very similar.',
      refs: ['standing1973', 'brady2008'],
      limit: 'These tests asked “have you seen this before?”, which is easier than understanding or using an idea. The groups were small (5 to 14 people).',
    },
    {
      title: 'Working memory is small',
      body: 'Adults hold only about three to five chunks of new information in mind at one time, about four on average.',
      refs: ['cowan2001'],
      limit: 'The number depends on the task, and other researchers debate it. It is the reason we teach one idea or one step at a time.',
    },
    {
      title: 'Design matters as much as the picture',
      body: 'The same research found that people learn better when extra material is removed (18 of 19 tests), when spoken words come at the same time as the picture (8 of 8), when words sit next to the part they describe (9 of 9) and when a lesson is split into learner-paced parts (7 of 7).',
      refs: ['mayer2023'],
      limit: 'A picture that is decorative, crowded or out of step with the words can make learning worse, not better. The effects are medians from one research group.',
    },
  ],
}

const MOTION: Section = {
  id: 'video',
  nav: 'Video and animation',
  eyebrow: 'Video, animation and how-to tasks',
  title: 'Moving pictures help most when you must do something.',
  intro:
    'Is a video better than a still picture? On average a little. The gain is much larger for physical, step-by-step tasks, which is what how-to and support videos teach.',
  findings: [
    {
      title: 'Animation beats still pictures, most for how-to tasks',
      body: 'A meta-analysis of 26 studies found a medium-sized advantage of instructional animations over static pictures (d = 0.37). The advantage was much larger when people learned a procedural-motor skill, something they must do with their hands (d = 1.06), and when the animation was realistic, for example video (d = 0.76).',
      refs: ['hoffler2007', 'berney2016'],
      limit: 'A later and larger meta-analysis (61 studies, 7,036 learners) found a smaller overall advantage (g = 0.226).',
    },
    {
      title: 'Hand tasks: knots and puzzle rings',
      body: 'In two experiments, students who learned to tie knots or solve puzzle rings from an animation learned more than students who saw the same steps as a series of still diagrams.',
      refs: ['ayres2009', 'watson2010'],
      limit: 'Small laboratory experiments with students. In an assembly study, animated instructions made the first build faster, but the advantage was gone by the third build.',
    },
    {
      title: 'Clear step-by-step drawings cut assembly time',
      body: 'In a furniture-assembly study, step-by-step instructions designed with cognitive principles (one clear action per step) cut assembly time by 35% on average and errors by 50%, compared with factory instructions.',
      refs: ['heiser2004'],
      limit: 'These were still diagrams, not video. The study shows that clear steps matter; it does not test video.',
    },
    {
      title: 'Video helps students, most when it adds to teaching',
      body: 'A review of 105 randomized trials with 7,776 university students found small gains when video replaced other teaching (g = 0.28) and strong gains when video was added to it (g = 0.80). In a study with 111 pupils in grades 5 and 6, a video tutorial beat a paper tutorial for a software task.',
      refs: ['noetel2021', 'vandermeij2014'],
      limit: 'The review is about university students, and adding video also adds study time. The pupils’ study is one task, and all groups improved, the paper group too.',
    },
    {
      title: 'Short, segmented videos',
      body: 'A meta-analysis of 56 investigations found that people learn better when a lesson comes in segments than as one continuous unit. In a study of 6.9 million video sessions, the median watch time was at most 6 minutes, whatever the length of the video.',
      refs: ['rey2019', 'guo2014'],
      limit: 'Segments also make learning take longer. The watch-time study measured attention, not learning, in adult online courses.',
    },
    {
      title: 'The sceptical view, and the best answer to it',
      body: 'A well-known review found that many wins for animation came from unequal comparisons: the animation showed more information or let the learner interact. Video works best together with a few still key pictures, according to another study.',
      refs: ['tversky2002', 'arguel2009'],
      limit: 'This is why we do not claim that motion itself teaches. Content, clear steps and control over the pace do much of the work.',
    },
  ],
}

const MATH: Section = {
  id: 'math',
  nav: 'Math in school',
  eyebrow: 'Education',
  title: 'US education research recommends visual math.',
  intro: 'The US Institute of Education Sciences reviews the research and writes guides for teachers. Two of its math guides give visual representations a strong rating.',
  findings: [
    {
      title: 'Drawings, diagrams and number lines',
      body: 'For elementary students who struggle with math, the guide recommends a well-chosen set of concrete and semi-concrete representations, and the number line. It rates the evidence for both as strong.',
      refs: ['ies2021'],
      limit: 'The guide is about small-group teaching led by a teacher, not about apps or video.',
    },
    {
      title: 'Teach students to use visual representations',
      body: 'For problem solving in grades 4 to 8, the guide recommends that teachers show students how to use visual representations such as tables and diagrams. It rates the evidence as strong.',
      refs: ['ies2012'],
      limit: 'The recommendation is that students learn to draw and use the visuals themselves, not only watch them.',
    },
  ],
}

const MEDICINE: Section = {
  id: 'medicine',
  nav: 'Medicine',
  eyebrow: 'Medicine and health',
  title: 'Patients follow instructions better with pictures.',
  intro:
    'Doctors and nurses give instructions that people must follow at home, often under stress. This is one of the best-tested places for pictures and video.',
  findings: [
    {
      title: 'Pictures linked to the text raise attention and recall',
      body: 'A review of health-communication research found that pictures closely linked to written or spoken text can markedly increase attention to and recall of health information, compared with text alone. People with low literacy are especially likely to benefit.',
      refs: ['houts2006'],
      limit: 'A narrative review with no pooled numbers. Pictures can also change adherence in either direction, because the emotional response to a picture matters.',
    },
    {
      title: 'Cartoons on wound-care sheets',
      body: 'In a randomized study of 234 emergency patients, those who got wound-care instructions with cartoons more often read them (98% vs 79%), answered all wound-care questions correctly (46% vs 6%) and did their daily wound care (77% vs 54%).',
      refs: ['delp1996', 'austin1995'],
      limit: 'One hospital, cuts only, and wound care was self-reported by telephone three days later. An earlier study of 101 patients found a smaller gain: 65% vs 43% gave five or more correct answers out of 10.',
    },
    {
      title: 'Picture-based medicine instructions cut dosing errors',
      body: 'In a randomized trial with 245 caregivers of young children, plain-language instructions with pictograms cut dosing errors for a daily liquid medicine from 47.8% to 5.4%.',
      refs: ['yin2008'],
      limit: 'The pictograms came together with plain language and counselling, so the effect of the pictures alone is not known. One hospital emergency department.',
    },
    {
      title: 'The overall picture: a moderate gain, and it varies',
      body: 'A meta-analysis of randomized trials found that pictures in health information moderately improved knowledge and recall, with a larger gain for people with lower health literacy. A separate review found that pictures help most when they are used together with written or spoken instructions.',
      refs: ['schubbe2020', 'katz2006'],
      limit: 'The results differ a lot from study to study, and the authors ask readers to interpret them with caution. Some icons, for example clock faces, were too complex to help.',
    },
    {
      title: 'Video instructions: promising, not proven',
      body: 'Across emergency-department studies, patients correctly recalled on average 47% of spoken discharge instructions, 58% of written ones and 67% of video ones.',
      refs: ['hoek2020', 'tuong2014'],
      limit: 'These differences were not statistically significant, and only 7 of 51 studies used video. A review of video health education found that it changed some health behaviors but not others.',
    },
    {
      title: 'US health agencies tell writers to use visuals',
      body: 'The US Agency for Healthcare Research and Quality says videos are useful to demonstrate self-care, such as how to use an inhaler. The CDC scores health materials on whether they have at least one visual that supports the main message.',
      refs: ['ahrq', 'cdc'],
      limit: 'This is guidance, not a study. Both agencies also warn that a visual that is unclear or unrelated to the words can confuse people, and AHRQ says not to drop paper materials.',
    },
  ],
}

const BRAIN: Section = {
  id: 'brain',
  nav: 'The brain',
  eyebrow: 'Neuroscience',
  title: 'The brain stores a picture differently from a word.',
  intro: 'Brain-imaging research gives one explanation of why pictures are easier to remember. It is an explanation, not proof.',
  findings: [
    {
      title: 'Pictures use the visual memory areas more',
      body: 'In a brain-imaging study, memorizing pictures used visual and memory areas of the brain more than memorizing words did. The authors suggest that this may explain why pictures are remembered better than words.',
      refs: ['grady1998'],
      limit: 'A small study of young adults with single objects and single words, not lessons or videos. “May explain” is the authors’ wording.',
    },
  ],
}

export const SECTIONS: Section[] = [MIND, MOTION, MATH, MEDICINE, BRAIN]

export const NOT_CLAIMED: { title: string; body: string; refs: readonly SourceId[] }[] = [
  {
    title: 'We do not say there are “visual learners”',
    body: 'The idea that each person has a learning style, and learns best when teaching matches it, is not supported by evidence. A major review found no adequate evidence base for using learning-style tests in education. Visuals help most learners; they are not for one type of person.',
    refs: ['pashler2008'],
  },
  {
    title: 'We do not use the “10% of what we read, 80% of what we see” numbers',
    body: 'These percentages are not research findings. A study of where they came from found that they do not make sense as data and were added later to Edgar Dale’s “cone of experience”, which had no numbers.',
    refs: ['subramony2014'],
  },
  {
    title: 'We do not say the brain reads pictures “60,000 times faster”',
    body: 'We could not find any study behind this number, so we do not use it. One classic study even found that people retrieve words faster than pictures.',
    refs: ['standing1973'],
  },
  {
    title: 'We do not say pictures always help',
    body: 'Decorative or confusing pictures can distract. Health agencies give the same warning. The research supports pictures that show the idea, close to the words that explain it.',
    refs: ['mayer2023', 'cdc'],
  },
]

/** Three findings for the home page. Each restates a finding above, with the same source. */
export const HOME_EVIDENCE: { title: string; body: string; source: SourceId }[] = [
  {
    title: 'Words and pictures beat words alone',
    body: 'In 13 experiments, students who learned from words and graphics did much better at using the idea than students who learned from words alone.',
    source: 'mayer2023',
  },
  {
    title: 'Animation helps most with how-to tasks',
    body: 'Across 26 studies, animations beat still pictures, and the gain was largest for skills that people do with their hands.',
    source: 'hoffler2007',
  },
  {
    title: 'Pictures cut medicine errors',
    body: 'In a randomized trial with 245 caregivers, picture-based instructions cut dosing errors for a daily liquid medicine from 47.8% to 5.4%.',
    source: 'yin2008',
  },
]

/** Number the sources in the order the page first cites them, then any that only the home page cites. */
function sourceOrder(): SourceId[] {
  const seen: SourceId[] = []
  const add = (id: SourceId) => { if (!seen.includes(id)) seen.push(id) }
  SECTIONS.forEach(s => s.findings.forEach(f => f.refs.forEach(add)))
  NOT_CLAIMED.forEach(n => n.refs.forEach(add))
  HOME_EVIDENCE.forEach(h => add(h.source))
  return seen
}
/** The order of the numbered source list. */
export const SOURCE_ORDER: SourceId[] = sourceOrder()
