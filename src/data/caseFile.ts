// Everything the site says about Shreshtha lives here, so content edits never touch layout code.
// Source of truth: the latest resume (R:\Downloads\Placement\Shreshtha Garg,IIITM Gwalior.pdf).
import buyMeAChaiShot from '../assets/projects/buymeachai.webp'
import clickonShot from '../assets/projects/clickon.webp'
import hostelGrievancesShot from '../assets/projects/hostelmate-grievances.webp'
import hostelWardenShot from '../assets/projects/hostelmate-warden.webp'
import regenixShot from '../assets/projects/regenix.webp'

export type SectionId = 'about' | 'projects' | 'experience' | 'achievements' | 'research' | 'contact'

/** Pins on the board that red strings can attach to. */
export type Anchor =
  | 'about'
  | 'projects.clickon'
  | 'projects.hostelmate'
  | 'projects.archive'
  | 'experience'
  | 'achievements'
  | 'research.trojan'
  | 'research.rag'
  | 'contact'

export interface Section {
  id: SectionId
  label: string
  path: string
  key: string
}

export const SECTIONS: Section[] = [
  { id: 'about', label: 'About', path: '/about', key: '1' },
  { id: 'projects', label: 'Projects', path: '/projects', key: '2' },
  { id: 'experience', label: 'Experience', path: '/experience', key: '3' },
  { id: 'achievements', label: 'Achievements', path: '/achievements', key: '4' },
  { id: 'research', label: 'Research', path: '/research', key: '5' },
  { id: 'contact', label: 'Contact', path: '/contact', key: '6' },
]

export const sectionIndex = (id: SectionId) => SECTIONS.findIndex((s) => s.id === id)
export const sectionById = (id: SectionId) => SECTIONS[sectionIndex(id)]

/** The section `step` places after (or before, if negative) `id`, wrapping around. */
export function neighbour(id: SectionId, step: number): Section {
  const n = SECTIONS.length
  return SECTIONS[(sectionIndex(id) + step + n) % n]
}

export function sectionFromPath(pathname: string): SectionId | null {
  const clean = pathname.replace(/\/+$/, '') || '/'
  return SECTIONS.find((s) => s.path === clean)?.id ?? null
}

/** The board item an anchor sits on, e.g. 'projects.clickon' is on 'projects'. */
export const anchorSection = (a: Anchor) => a.split('.')[0] as SectionId

export interface ExternalLink {
  label: string
  href: string
}

export interface Shot {
  src: string
  alt: string
  caption: string
  width: number
  height: number
}

export interface Fact {
  value: string
  label: string
}

export const LINKS = {
  github: 'https://github.com/Shreshtha-Garg',
  linkedin: 'https://www.linkedin.com/in/shreshth-garg-3ba629208',
  leetcode: 'https://leetcode.com/u/ShreshthaGarg037/',
  codeforces: 'https://codeforces.com/profile/ShreshthaGarg037',
  codechef: 'https://www.codechef.com/users/raghavgarg037',
}

/** Formspree endpoint for the tip line (the same form the old site used). */
export const TIP_FORM_ENDPOINT = 'https://formspree.io/f/mldloyyv'

export const PROFILE = {
  name: 'Shreshtha Garg',
  role: 'Full Stack Developer & Competitive Programmer',
  titles: ['Full Stack Developer', 'Competitive Programmer'],
  caseNo: '#2027',
  email: 'raghavgarg037@gmail.com',
  resume: '/Shreshtha-Garg-Resume.pdf',
  openTo: 'SDE roles, remote or relocation',
  aliases: 'Knight (LeetCode), Expert (Codeforces), 4★ (CodeChef)',
  /** Each paragraph opens with a bold lead line. */
  bio: [
    {
      lead: 'I build products end to end, and I care most about the parts users never see.',
      text: 'React up front, Node.js and Express in the middle, MongoDB, Redis or SQL underneath, tuned until the numbers move: a dashboard API made 20% faster, OTP checks that skip the database entirely. My latest build, ClickON, turns a shopper’s vague goal into a ready-to-buy cart, and it took our team to the national semifinals of Amazon HackOn.',
    },
    {
      lead: 'And I like problems that fight back.',
      text: 'I’m a Knight on LeetCode (2067), an Expert on Codeforces and a 4★ coder on CodeChef, with 1600+ problems solved on LeetCode and Codeforces. The same hunt for the faster answer runs through my M.Tech research: teaching LLM retrieval to judge how much evidence is enough.',
    },
  ],
  education: [
    {
      school: 'ABV-IIITM Gwalior',
      detail: 'Integrated M.Tech, Information Technology',
      when: '2022 – 2027',
      score: 'CGPA 9.00',
    },
    { school: 'SDS Convent School', detail: 'Class 12, CBSE (Non-Medical)', when: '2020 – 2021', score: '96.4%' },
  ],
  skills: [
    { group: 'Languages', items: ['C++', 'Java', 'JavaScript', 'Python', 'SQL', 'HTML', 'CSS'] },
    { group: 'Frameworks', items: ['React', 'Next.js', 'Node.js', 'Express', 'Tailwind CSS'] },
    { group: 'Data', items: ['MongoDB', 'MySQL', 'PostgreSQL', 'Redis'] },
    { group: 'Tools', items: ['Generative AI', 'AWS', 'Docker', 'Git', 'REST APIs', 'JWT auth'] },
  ],
}

export interface NewsStory {
  id: 'clickon' | 'hostelmate'
  kicker: string
  headline: string
  deck: string
  body: string[]
  facts: Fact[]
  images: Shot[]
  stack: string[]
  links: ExternalLink[]
}

export const STORIES: NewsStory[] = [
  {
    id: 'clickon',
    kicker: 'Amazon HackOn national semifinalist · ClickON · June 2026',
    headline: 'Intent to cart in a blink',
    deck: 'ClickON is an AI quick-commerce engine: type, say or snap what you’re trying to do, and get a cart you can buy.',
    body: [
      'Shoppers usually know the goal, not the exact items. ClickON takes that goal as text, voice or a photo and uses the Gemini API to turn it into a cart that is ready to buy.',
      'Two checkout flows, Flash and Quick, cut decision fatigue: each one assembles three fixed tiers, Budget, Balanced and Premium, with an O(K log K) value sort. A zero-input discovery feed suggests bundles before anyone types, using live weather, time of day, purchase history and what nearby shoppers are ordering.',
      'Product retrieval runs on MongoDB ESR (Equality, Sort, Range) indexes for O(log N) lookups, and the transactional cart logic is kept strictly apart from the non-deterministic LLM pipeline.',
    ],
    facts: [
      { value: '3', label: 'input types: text, voice and image' },
      { value: '2', label: 'checkout flows: Flash and Quick' },
      { value: '3', label: 'price tiers in every cart' },
      { value: 'O(log N)', label: 'product lookups with ESR indexes' },
    ],
    images: [
      {
        src: clickonShot,
        alt: 'ClickON home screen with Quick and Flash modes, a search box with voice and camera input, and personalised bundles',
        caption: 'ClickON’s live demo: describe a goal, then pick Quick or Flash.',
        width: 1200,
        height: 677,
      },
    ],
    stack: ['Node.js', 'Express', 'JavaScript', 'MongoDB', 'Gemini API'],
    links: [
      { label: 'Live demo', href: 'https://hackon-zeta.vercel.app/' },
      { label: 'GitHub (team repo)', href: 'https://github.com/aashudhakad/hackon' },
    ],
  },
  {
    id: 'hostelmate',
    kicker: 'HostelMate · November 2024',
    headline: 'HostelMate takes hostel complaints real-time',
    deck: 'A grievance portal where students, wardens and admins settle issues over live chat.',
    body: [
      'HostelMate is a real-time grievance portal for hostels. Students raise complaints and talk them through with wardens and admins in a live chat, while status updates reach everyone instantly over Socket.io.',
      'Role-based authentication covers the three user types and protects more than 12 API routes by permission. Login uses OTP verification backed by Redis, which takes database reads out of token validation and cuts login latency.',
      'Nodemailer sends email notifications, and the interface is responsive React with Tailwind CSS.',
    ],
    facts: [
      { value: '3', label: 'roles: Student, Warden and Admin' },
      { value: '12+', label: 'API routes behind role checks' },
      { value: 'Live', label: 'chat and status updates over Socket.io' },
    ],
    images: [
      {
        src: hostelWardenShot,
        alt: 'HostelMate warden portal with grievance counts, staff overview and recent activity',
        caption: 'The warden portal: every grievance and its status at a glance.',
        width: 900,
        height: 585,
      },
      {
        src: hostelGrievancesShot,
        alt: 'A student’s grievances in HostelMate, each with a priority, a category and a status',
        caption: 'A student’s grievances, each with its priority and status.',
        width: 1200,
        height: 536,
      },
    ],
    stack: ['MongoDB', 'Express', 'React', 'Node.js', 'Tailwind CSS', 'Redis', 'Socket.io'],
    links: [
      { label: 'Live demo', href: 'https://hostel-mate-psi.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/Shreshtha-Garg/HostelMate' },
    ],
  },
]

export interface ArchiveStory {
  id: string
  /** The classified-ad heading the project runs under. */
  ad: string
  name: string
  when: string
  summary: string
  stack: string[]
  links: ExternalLink[]
  note?: string
  image: Shot
}

export const ARCHIVE: ArchiveStory[] = [
  {
    id: 'buymeachai',
    ad: 'Creators wanted',
    name: 'Buy Me a Chai',
    when: 'July 2024',
    summary: 'A crowdfunding platform for creators, with Razorpay payments and GitHub or password sign-in through NextAuth.',
    stack: ['Next.js 14', 'MongoDB', 'Razorpay', 'NextAuth', 'Tailwind CSS'],
    links: [
      { label: 'Live demo', href: 'https://buy-me-a-chai-ten.vercel.app/' },
      { label: 'GitHub', href: 'https://github.com/Shreshtha-Garg/Buy-Me-A-Chai' },
    ],
    image: {
      src: buyMeAChaiShot,
      alt: 'A creator page on Buy Me a Chai showing payments received and the amount raised',
      caption: 'A creator page with its supporters.',
      width: 720,
      height: 481,
    },
  },
  {
    id: 'regenix',
    ad: 'Trainer on call',
    name: 'ReGeniX backend',
    when: 'April 2025',
    summary:
      'The backend for an AI fitness coach that checks exercise form through the camera: JWT auth, REST APIs and session analytics, with no video stored.',
    stack: ['Node.js', 'Express', 'MongoDB', 'JWT'],
    links: [],
    note: 'Team project',
    image: {
      src: regenixShot,
      alt: 'ReGeniX landing page: train smarter with AI-powered exercise guidance',
      caption: 'The ReGeniX app the backend serves.',
      width: 1000,
      height: 401,
    },
  },
]

export const EXPERIENCE = {
  company: 'Firstbench.ai',
  title: 'Software Developer Intern',
  period: 'Aug 2024 – Feb 2025',
  place: 'Remote',
  bullets: [
    'Shipped 4 new features for a customer-facing web app, building 20+ reusable React components and 7 new REST API endpoints.',
    'Worked in a cross-functional agile team of frontend, backend, UI/UX and AI engineers with a product manager, in two-week sprints.',
    'Refactored database queries to cut the main dashboard’s average API response time by about 20%.',
  ],
}

export type StopId = 'jee' | 'iiitm' | 'firstbench' | 'hackon' | 'next'

export interface JourneyStop {
  id: StopId
  when: string
  /** The short date printed under the stop's name on the map. */
  years?: string
  title: string
  detail: string
}

/** Stops on the journey map, in order. */
export const JOURNEY: JourneyStop[] = [
  { id: 'jee', when: '2022', years: '2022', title: 'JEE Advanced', detail: 'AIR 8707 in JEE Advanced and AIR 10494 in JEE Main.' },
  {
    id: 'iiitm',
    when: '2022 – 2027',
    years: '2022 – 2027',
    title: 'ABV-IIITM Gwalior',
    detail: 'Integrated M.Tech in Information Technology, with a CGPA of 9.00.',
  },
  {
    id: 'firstbench',
    when: 'Aug 2024 – Feb 2025',
    years: '2024 – 25',
    title: 'Firstbench.ai',
    detail: 'Software Developer Intern, remote. Shipped 4 features, 20+ React components and 7 REST endpoints.',
  },
  {
    id: 'hackon',
    when: 'June 2026',
    years: '2026',
    title: 'Amazon HackOn',
    detail: 'National semifinalist, in the top 300 teams across India, with ClickON, an AI quick-commerce engine.',
  },
  { id: 'next', when: 'Next', title: 'Your team?', detail: 'Looking for SDE roles, remote or with relocation.' },
]

export const RATINGS = [
  { site: 'LeetCode', rating: '2067', title: 'Knight', detail: '1040+ problems solved', href: LINKS.leetcode },
  { site: 'Codeforces', rating: '1640', title: 'Expert', detail: '400+ problems solved', href: LINKS.codeforces },
  { site: 'CodeChef', rating: '1866', title: '4 star', detail: 'Rated contests', href: LINKS.codechef },
]

/** Best global finishes in rated contests, 2025–26. */
export const CONTESTS = [
  { contest: 'LeetCode Weekly 524 (latest)', rank: 327 },
  { contest: 'LeetCode Weekly 495', rank: 318 },
  { contest: 'LeetCode Weekly 462', rank: 657 },
  { contest: 'LeetCode Biweekly 179', rank: 677 },
  { contest: 'Codeforces Round 1093', rank: 805 },
  { contest: 'Codeforces Round 1118', rank: 993 },
]

export const CLIPPINGS = [
  {
    when: 'June 2026',
    headline: 'National semifinalist at Amazon HackOn',
    detail: 'In the top 300 teams across India, with ClickON.',
  },
  {
    when: 'Flipkart GRiD 8.0',
    headline: 'National semifinalist at Flipkart GRiD 8.0',
    detail: 'Through to the national semifinals of Flipkart’s engineering challenge for students.',
  },
  { when: '2024', headline: 'Fifth in the institute at ICPC qualifiers', detail: 'Institute rank 5 in the ICPC 2024 Qualifiers.' },
  { when: '2022', headline: 'JEE Advanced: all-India rank 8707', detail: 'Also AIR 10494 in JEE Main.' },
  { when: '2019', headline: 'District rank 7 in Class 10 boards', detail: 'CBSE Class 10 board examinations.' },
]

export const TROJAN = {
  kicker: 'Case HT-321 · July 2026',
  title: 'Maximal concurrent rare-node activation for Hardware Trojan detection',
  summary:
    'A hardware Trojan hides inside a chip and fires only when a rare combination of internal signals lines up, which ordinary test patterns almost never produce. This framework searches for test patterns that activate as many rare nodes at the same time as possible, so hidden triggers are much more likely to be exercised during testing.',
  activations: { value: '321', label: 'rare nodes activated at once on the ISCAS85 c3540 benchmark' },
  patterns: { before: 2744, after: 172, change: '93.7% fewer test patterns' },
  triggers: { before: { base: '1.3', exp: 28 }, after: { base: '5.11', exp: 96 } },
  bullets: [
    'Built a multi-threshold ATPG (automatic test pattern generation) framework for concurrent rare-node activation.',
    'Designed a four-stage ATPG pipeline for multi-threshold sweeping, pattern compaction and targeted deep search, using DFS and backtracking.',
  ],
  stack: ['C++', 'ATPG', 'DFS', 'Backtracking', 'ISCAS85'],
}

export interface PipelineStep {
  step: string
  note?: string
  decision?: boolean
}

export const RAG = {
  kicker: 'M.Tech thesis · 2026–27',
  title: 'Adaptive evidence-aware RAG for multi-aspect queries',
  summary:
    'Real questions often have several aspects, and each one needs a different amount of evidence. A fixed top-K retrieval either misses evidence for some aspects or floods the model with noise. This thesis makes retrieval depth adaptive and checks the answer against the evidence before it is returned.',
  pipeline: [
    { step: 'Question' },
    { step: 'Split into aspects' },
    { step: 'Retrieve per aspect', note: 'K adapts to each aspect' },
    { step: 'Enough evidence?', note: 'If not, widen K and retrieve again', decision: true },
    { step: 'Answer and self-correct', note: 'Revised against the evidence' },
    { step: 'Validate the correction', note: 'Keep the original if it fails' },
  ] satisfies PipelineStep[],
  status: 'Implementation in progress',
  stack: ['Python', 'LLMs', 'Vector retrieval'],
}

export interface Skill {
  id: string
  label: string
  targets: Anchor[]
}

/** The sticky notes along the top of the board, and the evidence each one connects to. */
export const SKILLS: Skill[] = [
  { id: 'cpp', label: 'C++ & algorithms', targets: ['achievements', 'research.trojan', 'projects.clickon'] },
  { id: 'node', label: 'Node.js & Express', targets: ['projects.clickon', 'projects.hostelmate', 'experience'] },
  { id: 'react', label: 'React & Next.js', targets: ['projects.hostelmate', 'projects.archive', 'experience'] },
  { id: 'data', label: 'MongoDB & Redis', targets: ['projects.clickon', 'projects.hostelmate'] },
  { id: 'ai', label: 'GenAI & RAG', targets: ['projects.clickon', 'research.rag'] },
]
