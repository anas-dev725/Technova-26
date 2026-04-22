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
    description: 'Step into the world of cybersecurity. Work with your squad to discover vulnerabilities and learn to secure digital environments in a fun, collaborative challenge.',
    icon: Shield,
    category: 'Tech',
    mode: 'Squad',
    prize: 'PKR 75K',
    longDescription: 'Calling all tech enthusiasts! This is a 6-hour journey where your squad will dive into systems, uncovering how they work and learning to protect them. It\'s an engaging test of your curiosity and problem-solving skills.'
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
    description: 'Unleash your gaming passion. Join fellow enthusiasts to showcase your strategy and skills in some of the most popular titles in a lively, community-focused arena.',
    icon: Gamepad2,
    category: 'Gaming',
    mode: 'Individual',
    prize: 'PKR 70K',
    longDescription: 'Welcome to the Technova Esports Arena! This is where passion meets play. We\'ve picked the hottest titles to celebrate your strategy and reflexes. Whether you\'re teaming up with your squad or playing solo, come share the excitement and show us your best moves.',
    subGames: [
      {
        id: 'pubg-mobile',
        title: 'PUBG Mobile',
        description: 'Squad-based action and strategy. Drop in, explore, and work with your team to navigate the arena in this fan-favorite title.',
        mode: 'Squad',
        prize: 'PKR 40K'
      },
      {
        id: 'counter-strike',
        title: 'Counter-Strike',
        description: 'A masterpiece of tactical play. Use your precision and teamwork to navigate challenges in this iconic game.',
        mode: 'Individual',
        prize: 'PKR 40K'
      },
      {
        id: 'tekken-8',
        title: 'Tekken 8',
        description: 'Master your favorite characters and showcase your timing in friendly 1v1 tactical matches.',
        mode: 'Individual',
        prize: 'PKR 15K'
      },
      {
        id: 'fifa-25',
        title: 'FIFA 25',
        description: 'Showcase your football knowledge and lead your team with skill in this immersive pro simulation.',
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
    description: 'Put your logic to the test. Work through engaging algorithmic puzzles and see how elegantly you can solve challenges in a supportive atmosphere.',
    icon: Zap,
    category: 'Tech',
    mode: 'Individual',
    prize: 'PKR 65K',
    longDescription: 'This is an exciting opportunity for coding enthusiasts. You\'ll be solving intriguing algorithmic puzzles using C++, Python, or Java. It\'s a great way to showcase your thinking and build your coding confidence!'
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
    description: 'Have a unique idea? Share your vision and get feedback from experienced mentors to help turn your innovative concepts into something real.',
    icon: Rocket,
    category: 'Innovation',
    mode: 'Squad',
    prize: 'PKR 100K',
    longDescription: 'Do you see a way to make a difference? Share your business concepts and prototypes with a supportive community. It\'s a fantastic platform to learn, grow, and take the first steps toward bringing your ideas to life.'
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
