import { Palette, Shield, Database, Gamepad2, Calculator, Zap, MonitorPlay, Code, Rocket, MessageSquare } from 'lucide-react';

export type TeamMode = 'Individual' | 'Duo' | 'Squad';

export interface SubGame {
  id: string;
  title: string;
  description: string;
  mode: TeamMode;
  prize: string;
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
  subGames?: SubGame[];
}

export const modules: Module[] = [
  {
    id: 'website-designing',
    title: 'Website Designing',
    description: 'Love pretty things? Join us to craft stunning, responsive, and buttery-smooth user experiences that people actually enjoy using.',
    icon: Palette,
    category: 'Design',
    mode: 'Duo',
    prize: 'PKR 60K',
    longDescription: 'Hey there, creative! In this challenge, you\'ll flex your frontend muscles to build a futuristic landing page. We\'re looking for that perfect mix of "wow" factor and rock-solid usability. No boring sites allowed!'
  },
  {
    id: 'capture-the-flag',
    title: 'Capture The Flag',
    description: 'Think you can hack it? Test your cybersecurity chops in a fast-paced hunt for vulnerabilities. Let\'s see who finds the flags first!',
    icon: Shield,
    category: 'Tech',
    mode: 'Squad',
    prize: 'PKR 75K',
    longDescription: 'Calling all ethical hackers! This is a 6-hour marathon where your squad will dive deep into systems, find hidden flaws, and exploit them. It\'s fast, it\'s intense, and it\'s the ultimate test of your digital defense skills.'
  },
  {
    id: 'database-designing',
    title: 'Database Designing',
    description: 'Are you a data wiz? Come architect efficient and perfectly normalized databases that can handle whatever global scale throws at them.',
    icon: Database,
    category: 'Tech',
    mode: 'Duo',
    prize: 'PKR 50K',
    longDescription: 'Design high-performance schemas that stay lightning-fast even with billions of rows. We want to see how you handle complex queries and normalization while keeping everything scalable. Show us your inner architect!'
  },
  {
    id: 'esports-competition',
    title: 'Esports Competition',
    description: 'Ready to dominate the arena? Grab your gear and battle it out in PUBG, Tekken, and FIFA. The crown is waiting for you!',
    icon: Gamepad2,
    category: 'Gaming',
    mode: 'Individual',
    prize: 'PKR 70K',
    longDescription: 'Welcome to the Technova Esports Arena! This is where local legends become champions. We\'ve picked the hottest titles to test your reflexes and strategy. Whether you\'re carrying your squad or fighting solo, the energy is going to be electric.',
    subGames: [
      {
        id: 'pubg-mobile',
        title: 'PUBG Mobile',
        description: 'Squad-based battle royale action. Drop in, loot up, and be the last team standing. Winner Winner Chicken Dinner!',
        mode: 'Squad',
        prize: 'PKR 40K'
      },
      {
        id: 'tekken-8',
        title: 'Tekken 8',
        description: 'The King of Iron Fist Tournament returns. Master your combos and timing to dominate 1v1 tactical combat.',
        mode: 'Individual',
        prize: 'PKR 15K'
      },
      {
        id: 'fifa-25',
        title: 'FIFA 25',
        description: 'Think you\'re the best on the pitch? Control your team and lead them to glory in this pro football simulation.',
        mode: 'Individual',
        prize: 'PKR 15K'
      }
    ]
  },
  {
    id: 'maths-mania',
    title: 'Maths Mania',
    description: 'Love a good brain teaser? Put your logic and quantitative reasoning to the test. It\'s not just about numbers, it\'s about creative thinking!',
    icon: Calculator,
    category: 'Tech',
    mode: 'Individual',
    prize: 'PKR 40K',
    longDescription: 'Enter the world of numbers where logic is king. Challenge your brain with puzzles that require more than just a calculator—they require a spark of genius. Ready to prove you\'re the master of the variable?'
  },
  {
    id: 'speed-programming',
    title: 'Speed Programming',
    description: 'The clock is ticking! Write hyper-efficient algorithms against time and prove you\'re the fastest coder in the room.',
    icon: Zap,
    category: 'Tech',
    mode: 'Individual',
    prize: 'PKR 65K',
    longDescription: 'This is the ultimate test for competitive programmers. You\'ll be solving complex algorithmic challenges under extreme time constraints using C++, Python, or Java. May the fastest algorithm win!'
  },
  {
    id: 'fyp-displays',
    title: 'FYP Showcase',
    description: 'Got a project you\'re proud of? Pitch your innovative Final Year Project to industry experts and jumpstart your career.',
    icon: MonitorPlay,
    category: 'Innovation',
    mode: 'Squad',
    prize: 'PKR 75K',
    longDescription: 'The pinnacle of your academic journey is here. Present your Final Year Project to a panel of industry veterans and academic experts. This is your chance to shine, network, and maybe even get recruited!'
  },
  {
    id: 'startup-launchpad',
    title: 'Startup Launchpad',
    description: 'Got a billion-dollar vision? Pitch your startup idea to real-world investors and see if you have what it takes to be the next unicorn.',
    icon: Rocket,
    category: 'Innovation',
    mode: 'Squad',
    prize: 'PKR 100K',
    longDescription: 'Do you have what it takes to disrupt the market? Pitch your business model, prototype, and growth strategy to a room full of potential investors. It\'s time to turn that idea into a reality.'
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering',
    description: 'Are you an AI whisperer? Master the art of prompting to generate mind-blowing outputs and lead the future of engineering.',
    icon: MessageSquare,
    category: 'AI',
    mode: 'Individual',
    prize: 'PKR 55K',
    longDescription: 'In the age of AI, the one who knows how to talk to the machines wins. You\'ll be solving creative and technical tasks using the latest LLMs and image generation models. Show us how you prompt!'
  }
];

export const getFees = (mode: TeamMode, moduleId?: string) => {
  if (moduleId === 'esports-competition' && mode === 'Squad') {
    return 3000;
  }
  switch (mode) {
    case 'Individual': return 1000;
    case 'Duo': return 2000;
    case 'Squad': return 3500;
    default: return 0;
  }
};
