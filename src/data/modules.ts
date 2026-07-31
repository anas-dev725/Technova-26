import { Palette, Shield, Database, Gamepad2, Calculator, Zap, MonitorPlay, Code, Rocket, MessageSquare, Bot, BarChart3, Layout } from 'lucide-react';

export type TeamMode = 'Individual' | 'Duo' | 'Squad';

export interface SubGame {
  id: string;
  title: string;
  description: string;
  mode: TeamMode;
  prize: string;
}

export interface ModuleHead {
  name: string;
  role: string;
  designation?: string;
  email?: string;
  linkedin?: string;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  icon: any;
  category: string;
  mode: TeamMode;
  prize: string;
  longDescription: string;
  challengeName?: string;
  skills?: string[];
  rulesList?: string[];
  heads?: ModuleHead[];
  subGames?: SubGame[];
  isFilled?: boolean;
  targetAudience?: string;
}

export const modules: Module[] = [
  {
    id: 'fyp-warriors',
    title: 'FYP Warriors',
    description: 'Got a project you\'re proud of? Pitch your innovative Final Year Project to industry experts and jumpstart your career.',
    icon: MonitorPlay,
    category: 'Innovation',
    mode: 'Squad',
    prize: 'TBD',
    isFilled: true,
    challengeName: 'The Final Defense',
    longDescription: 'The pinnacle of your academic and technical journey meets the ultimate pressure test. FYP Warriors is a specialized platform for final year students to pitch their capstone projects, software prototypes, or hardware inventions to industry veterans and experienced researchers.\n\nDefend your research, demonstrate your software architectures, and prove the real-world scalability of your solutions. This is not just a standard academic presentation: it is an evaluation by leading tech executives looking for exceptional talent, industrial innovation, and market readiness.',
    skills: ['System Architecture', 'Technical Defense', 'Academic Research', 'Product Scalability'],
    rulesList: [
      'Open specifically to final year undergraduate projects and capstone teams.',
      'Present either your final year project ideas, ongoing systems, or completed software/hardware projects.',
      'Teams must bring their own devices, demonstration kits, and socket extensions.',
      'You must install and showcase your own custom roll-up standees and technical posters in your assigned presentation cubicle.',
      'Every participant in the team must actively participate in delivering the pitch and responding to technical Q&As.',
      'Presentations must be restricted to 8 minutes, followed by a detailed technical defense of 5 minutes.',
      'Integrity is paramount: any intellectual theft, copying code from existing open-source repositories without citation, or misrepresentation will result in immediate disqualification.',
      'Evaluation is conducted by a distinguished jury from both academia and industry. Their decision is absolute.'
    ],
    heads: [
      { name: 'Sarah Khan', role: 'Module Lead', designation: 'AI Security Engineer', linkedin: 'https://www.linkedin.com/in/sarah-khan-4b85bb392' },
      { name: 'Sania Partab', role: 'Module Lead', designation: 'Cyber Security Analyst', linkedin: 'https://www.linkedin.com/in/sania-partab-1b1591372/' },
      { name: 'Marhaba Ansari', role: 'Module Lead', designation: 'Cyber Security Analyst', linkedin: 'https://www.linkedin.com/in/marhaba-ansari-893217363/' },
      { name: 'Khizra Hassan', role: 'Module Lead', designation: 'Aspiring ML Engineer', linkedin: 'https://www.linkedin.com/in/khizra-hassan--/' },
      { name: 'Bisma Zakir', role: 'Module Lead', designation: 'Data Analyst', linkedin: 'https://www.linkedin.com/in/bisma-zakir-a5bb6b202/' },
      { name: 'Alishba Asghar', role: 'Module Lead', designation: 'Data analyst', linkedin: 'https://www.linkedin.com/in/alishba-asghar-7a38843a0/' }
    ]
  },
  {
    id: 'startup-launchpad',
    title: 'Startup launchpad',
    description: 'Have a unique idea? Share your vision and get feedback from experienced mentors to help turn your innovative concepts into something real.',
    icon: Rocket,
    category: 'Innovation',
    mode: 'Squad',
    prize: 'Upto 100K PKR',
    isFilled: true,
    challengeName: 'The Pitch Arena',
    longDescription: 'Do you have a game-changing product, prototype, or software solution waiting to be discovered? Startup Launchpad is the ultimate arena to pitch your vision. Here, you will showcase your innovative concepts, functional minimum viable products (MVPs), or full-fledged software directly to our panel of seasoned judges and industry mentors.\n\nFlesh out your business model, prepare your decks, and prepare to deliver a high-energy presentation. Convince the judges that your team has what it takes to scale, disrupt, and capture the market.',
    skills: ['Entrepreneurial Pitching', 'Product Strategy', 'Business Modeling', 'Persuasive Delivery'],
    rulesList: [
      'Teams of 2 to 4 partners.',
      'Pitch your raw business idea, tangible prototype, or fully functional software product.',
      'Teams must present live in front of the jury panels within their designated slot.',
      'You must bring your own devices (laptops, test setups) and custom promotional standees to showcase at your booth.',
      'Participants must bring their own socket extensions to ensure uninterrupted power supply for their demo equipment.',
      'The standard pitch window is strictly 8 minutes, followed by a 4-minute interactive Q&A session.',
      'Plagiarism, copycat models, or submitting stolen academic/startup intellectual property results in immediate disqualification.',
      'All decisions of the jury and mentors are final.'
    ],
    heads: [
      { name: 'Waniya', role: 'Module Lead', designation: 'Incubation Program Lead', linkedin: 'https://linkedin.com' },
      { name: 'Ammara', role: 'Module Lead', designation: 'Venture Capital Analyst', linkedin: 'https://linkedin.com' },
      { name: 'Vania', role: 'Module Lead', designation: 'Product Strategy Specialist', linkedin: 'https://linkedin.com' }
    ]
  },
  {
    id: 'capture-the-flag',
    title: 'Capture the flag',
    description: 'Step into the world of cybersecurity. Work with your team to discover vulnerabilities and learn to secure digital environments in a fun, collaborative challenge.',
    icon: Shield,
    category: 'Tech',
    mode: 'Duo',
    prize: 'Upto 70K PKR',
    isFilled: true,
    challengeName: 'Zero Signal',
    longDescription: 'The signal is gone. The galaxy is under attack. Zero Signal is a Capture the Flag cyber warfare challenge set across a live galaxy map, where every flag you capture claims territory, and every second you\'re slow, some other crew takes it.\n\nSix planets. Six attack surfaces. Each one is a different fight: crack the challenge, plant your flag, and watch the map shift in real time. The scoreboard is live, and everyone can see it.\n\nThis is not a quiz. It is a war zone.',
    skills: ['Digital Sleuthing', 'Strategic Thinking', 'Pattern Recognition', 'Cybersecurity Fundamentals'],
    rulesList: [
      'Teams of 2 to 3 members are allowed.',
      'All challenges must be accessed exclusively through the official competition platform.',
      'AI tools and LLMs are permitted and encouraged: use every tool at your disposal.',
      'Collaboration between crews is strictly prohibited: your signal, your glory.',
      'Bring your own personal laptop: the platform is web-based and requires no special installation.',
      'Participants may only interact with challenges assigned to their crew. Interfering with another crew\'s session is prohibited.',
      'No real-world exploits may be deployed against competition infrastructure. All hacking is contained within the simulated environment.',
      'The flag format is strictly ZEROSIG{...}: submissions outside this format will be rejected.',
      'Sharing flag answers or solutions with rival crews results in immediate disqualification of both parties.',
      'Organizers reserve the right to adapt rules in response to unforeseen circumstances. Their decision is final.'
    ],
    heads: [
      { name: 'Elisha Tejani', role: 'Module Lead', designation: 'Data security analyst', linkedin: 'https://www.linkedin.com/in/elisha-tejani/' },
      { name: 'Ainab shaikh', role: 'Module Lead', designation: 'Cybersecurity Analyst', linkedin: 'https://www.linkedin.com/in/ainab-shaikh-bb0a39310/' },
      { name: 'Hussam', role: 'Module Lead', designation: 'Network Defense Engineer', linkedin: 'https://linkedin.com' }
    ]
  },
  {
    id: 'agentic-ai-arena',
    title: 'Agentic AI Arena',
    description: 'Welcome to the future of autonomy. Design and deploy AI agents that can solve complex tasks and compete in dynamic environments.',
    icon: Bot,
    category: 'AI',
    mode: 'Duo',
    prize: 'Upto 70K PKR',
    isFilled: true,
    challengeName: 'The Trust Arena',
    longDescription: 'Build agents that think. Let them compete. Watch trust emerge. The Trust Arena is a multi-agent strategy tournament built on the Prisoner\'s Dilemma, focusing on the foundational problems of cooperation, deception, and emergent trust in AI systems.\n\nYou design and engineer an intelligent agent that perceives its environment, reasons autonomously, communicates with opponents, and decides when to cooperate and when to betray.\n\nEvery round, every decision, every message shapes the outcome. The arena rewards those who read the room.\n\nPerceive, Reason, Communicate, and Act.',
    skills: ['Logic and Automation', 'Strategic Decision Making', 'Game Theory', 'Behavioral Design'],
    rulesList: [
      'Teams of 2 to 3 participants.',
      'Competition will be held on our systems as the platform is web-based.',
      'Agents must be written in Python 3.9+.',
      'Only free-tier LLM APIs are permitted. No paid plans or credits allowed.',
      'AI coding assistants (ChatGPT, Claude, Copilot, Cursor) are permitted and encouraged.',
      'LangChain, AutoGen, and CrewAI may not serve as the core architecture: reasoning and memory must be your own code.',
      'Agents must respond within 25 seconds per round. Timeouts default to cooperate.',
      'Prompt injection via opponent messages is strictly prohibited. All match communications are logged and subject to audit. Confirmed violations result in immediate disqualification',
      'No code, strategy, or agent logic sharing between teams during active competition.',
      'Plagiarism, code copying, or agent interference results in immediate disqualification.',
      'Organizers reserve the right to adapt rules. All decisions are final.'
    ],
    heads: [
      { name: 'Sameed Khan', role: 'Module Lead', designation: 'Multi-Agent Frameworks Lead', linkedin: 'https://linkedin.com' },
      { name: 'Hamza Afzal', role: 'Module Lead', designation: 'AI Systems Architect', linkedin: 'https://linkedin.com' },
      { name: 'Abdul Wasay Baig', role: 'Module Lead', designation: 'Game Theory Analyst', linkedin: 'https://linkedin.com' }
    ]
  },
  {
    id: 'datathon',
    title: 'Datathon',
    description: 'Data is the new oil, and you\'re the refinery. Dive deep into datasets to uncover hidden patterns and build predictive models.',
    icon: BarChart3,
    category: 'Tech',
    mode: 'Duo',
    prize: 'TBD',
    isFilled: true,
    challengeName: 'Ghost in the Protocol',
    longDescription: 'A crime has been committed. The evidence is buried in a database. Ghost in the Protocol is a data forensics challenge where you step into the role of a digital investigator, piecing together a criminal conspiracy hidden inside rows, tables, and transactions.\n\nYou\'ll dig through access logs, trace money trails, and expose the suspect hiding in plain sight. The deeper you go, the more the story unravels, and the harder it gets.\n\nIt\'s not just about the data. It\'s about thinking like a detective.',
    skills: ['Data Analysis', 'Problem Solving', 'Critical Thinking', 'Investigative Logic'],
    rulesList: [
      'Teams of 2 to 3 participants.',
      'Competition will be held on our systems as the platform is web-based.',
      'No generative AI tools permitted: no ChatGPT, Claude, Copilot, or any LLM coding assistant.',
      'No mobile devices allowed during the competition.',
      'Absolute team isolation, you may only communicate within your duo. Cross-team communication is strictly prohibited.',
      'The provided database is read-only. Any attempt to modify, inject, or corrupt it results in immediate disqualification.',
      'Code similarity beyond the allowed threshold will be flagged and may result in disqualification.',
      'Any misconduct, external assistance, or attempt to sabotage rival teams leads to immediate disqualification.'
    ],
    heads: [
      { name: 'Areej Mazhar', role: 'Module Lead', designation: 'Software Engineer', linkedin: 'https://www.linkedin.com/in/areej-mazhar/' },
      { name: 'Javeria Sameen', role: 'Module Lead', designation: 'Software Engineer', linkedin: 'https://www.linkedin.com/in/javeria-sameen-100a9430b/' },
      { name: 'Abdur Rafay', role: 'Module Lead', designation: 'Behavioral Data Engineer', linkedin: 'https://linkedin.com' }
    ]
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering',
    description: 'Are you an AI whisperer? Master the art of prompting to generate mind-blowing outputs and lead the future of engineering.',
    icon: MessageSquare,
    category: 'AI',
    mode: 'Individual',
    prize: 'TBD',
    isFilled: true,
    challengeName: 'Crack the Code',
    longDescription: 'The AI does not want to talk. Your job is to make it. Crack the Code is an AI adversarial challenge where you go head-to-head against a language model that has been given a secret and told never to reveal it.\n\nYour only weapon is language. Through careful reasoning, creative misdirection, and precision prompt construction, you must engineer your way past the AI\'s defenses and extract what lies beneath.\n\nThree phases with escalating resistance.\n\nOne objective: make it talk, probe, engineer, and conquer.',
    skills: ['AI Communication', 'Creative Communication', 'Logical Reasoning', 'Lateral Thinking'],
    rulesList: [
      'Solo participation only.',
      'All interactions with the AI must occur exclusively through the official competition platform. No external API access is permitted.',
      'All AI tools and LLMs are permitted to assist in crafting prompts: use every tool at your disposal.',
      'Sharing prompts, strategies, or extracted secrets with other participants during the event is strictly prohibited.',
      'Competition will be held on our systems as the platform is web-based.',
      'Each participant may only interact with the challenge assigned to them. Probing or interfering with other participants\' instances is prohibited.',
      'The hidden system prompt is server-side and inaccessible. Accessing it through technical means outside the platform is a violation.',
      'Organizers reserve the right to adapt rules in response to unforeseen circumstances. All decisions are final.'
    ],
    heads: [
      { name: 'Nimra Yousuf', role: 'Module Lead', designation: 'AI engineer', linkedin: 'https://www.linkedin.com/in/nimra-yousuf-1b7173326/' },
      { name: 'Syed Ayaan Nadeem', role: 'Module Lead', designation: 'AI Alignment Analyst', linkedin: 'https://linkedin.com' },
      { name: 'Huzaifa Ahmed', role: 'Module Lead', designation: 'Adversarial Prompt Engineer', linkedin: 'https://linkedin.com' }
    ]
  },
  {
    id: 'maths-mania',
    title: 'Maths Mania (Advanced)',
    description: 'Face the ultimate analytical challenge. Prove your mastery over advanced mathematics, complex calculus, structural algebra, and stochastic logic.',
    icon: Calculator,
    category: 'Tech',
    mode: 'Duo',
    prize: 'TBD',
    isFilled: true,
    targetAudience: 'For University Students',
    challengeName: 'The Variable Matrix (Advanced)',
    skills: ['Algebra', 'Number Theory', 'Statistics and Probability', 'Calculus'],
    longDescription: 'Step up to the advanced tier of Maths Mania. Designed for seasoned problem solvers, this module pushes the boundaries of your mathematical intellect. Test your capabilities against high-difficulty proof-oriented structures, differential paradigms, advanced probability distributions, and structural matrix algebra under strict speed limits.\n\n**Topics Covered**\nThe following topics will be part of the competition:\n\n• **Algebra**: Arithmetic, fractions, linear and quadratic equations, inequalities, sequences and series, functions and their properties.\n\n• **Number theory**: Divisibility, prime numbers, GCD and LCM, counting principle, and Sudoku.\n\n• **Statistics and Probability**: Descriptive Statistics, permutations and combinations, elementary probability\n\n• **Calculus**: Differentiation, integration, and related theorems.\n\n**Competition format**\n\nThe competition consists of 4 rounds, conducted in paper-based format. The details are as follows:\n\n**Round 1**: First Round: Paper-based\n**Round 2**: Second Round: Paper-based\n**Round 3**: Third Round: Paper-based\n**Round 4**: Final Round: Paper-based',
    rulesList: [
      'Teams of 2 to 3 members are allowed.',
      'Calculators may or may not be permitted depending on the round specifications.',
      'No secondary devices, mobile phones, smartwatches, or notebooks are allowed inside the testing hall.',
      'All 4 rounds are strictly paper-based examinations.',
      'Any form of academic dishonesty, communication outside your team, or internet scouting during testing results in immediate disqualification.'
    ]
  },
  {
    id: 'maths-mania-advanced',
    title: 'Maths Mania (Junior)',
    description: 'Love a good brain teaser? Put your logic and quantitative reasoning to the test. It\'s not just about numbers, it\'s about creative thinking!',
    icon: Calculator,
    category: 'Tech',
    mode: 'Duo',
    prize: 'TBD',
    isFilled: true,
    targetAudience: 'For College Students',
    challengeName: 'The Variable Matrix (Junior)',
    skills: ['Arithmetic', 'Basic Algebra', 'Geometry & Measurement', 'Number Systems'],
    longDescription: 'Enter the world of numbers where logic is king. Challenge your brain with puzzles that require more than just a calculator: they require a spark of genius. Ready to prove you\'re the master of the variable?\n\nTOPICS COVERED\nThe following mathematical topics will be tested during the competition:\n• **Arithmetic**: Fractions and Decimals, Percentage, Ratio and Proportion, Averages, Simple and Compound Interest.\n• **Algebra**: Simplifying expressions, Solving equations and inequalities, Word problems involving unknowns.\n• **Geometry and Measurement**: Properties of shapes, Perimeter, Area, Volume, Ages and Trends.\n• **Number Systems**: Even/Odd, Prime/Composite numbers, Factors and Multiples, HCF and LCM.\n• **Data Interpretations and Analysis**: Reading Graphs, Tables, Calculating Averages, Trends, Ratios from Data, Understanding and Comparing data sets.\n• **Word Problems**: Real life problems solving, Time, Speed and Distance, Work and wages, Age Problems.\n• **Logical and Analytical Reasoning (Quant-Based)**: Pattern Recognition, Sequences and Series, Deductive logic using numbers.\n\nCOMPETITION ROUNDS\n• **Round 1**: Mathematical Foundations\n• **Round 2**: Algebra and Problem Solving\n• **Round 3**: Geometry and Data Analysis\n• **Round 4**: Logical Reasoning and Championship Round',
    rulesList: [
      'Question Format: Multiple Choice Questions (MCQs) and True/False.',
      'Teams of 2 to 3 members are allowed.',
      'Calculators may or may not be permitted depending on the round specifications.',
      'No secondary devices, smartwatches, or notebooks are allowed inside the testing hall.',
      'Any form of academic dishonesty, communication outside your team, or internet scouting during testing results in immediate disqualification.'
    ]
  }
];

export const getFees = (mode: TeamMode, moduleId?: string) => {
  switch (mode) {
    case 'Individual': return 1500;
    case 'Duo': return 2500;
    case 'Squad': return 4000;
    default: return 0;
  }
};

export const isDiscountEligible = (moduleId?: string, moduleTitle?: string): boolean => {
  if (!moduleId && !moduleTitle) return false;
  if (moduleId === 'maths-mania-advanced') return true;
  if (moduleTitle && moduleTitle.toLowerCase().includes('junior')) return true;
  return false;
};
