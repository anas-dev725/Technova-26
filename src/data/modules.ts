import { Palette, Shield, Database, Gamepad2, Calculator, Zap, MonitorPlay, Code, Rocket, MessageSquare, Bot, BarChart3, Layout } from 'lucide-react';

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
    id: 'fyp-warriors',
    title: 'FYP Warriors',
    description: 'Got a project you\'re proud of? Pitch your innovative Final Year Project to industry experts and jumpstart your career.',
    icon: MonitorPlay,
    category: 'Innovation',
    mode: 'Squad',
    prize: 'TBD',
    longDescription: 'The pinnacle of your academic journey is here. Present your Final Year Project to a panel of industry veterans and academic experts. This is your chance to shine, network, and maybe even get recruited!'
  },
  {
    id: 'startup-launchpad',
    title: 'Startup launchpad',
    description: 'Have a unique idea? Share your vision and get feedback from experienced mentors to help turn your innovative concepts into something real.',
    icon: Rocket,
    category: 'Innovation',
    mode: 'Squad',
    prize: 'TBD',
    longDescription: 'Do you see a way to make a difference? Share your business concepts and prototypes with a supportive community. It\'s a fantastic platform to learn, grow, and take the first steps toward bringing your ideas to life.'
  },
  {
    id: 'capture-the-flag',
    title: 'Capture the flag',
    description: 'Step into the world of cybersecurity. Work with your squad to discover vulnerabilities and learn to secure digital environments in a fun, collaborative challenge.',
    icon: Shield,
    category: 'Tech',
    mode: 'Squad',
    prize: 'TBD',
    longDescription: 'Calling all tech enthusiasts! This is a 6-hour journey where your squad will dive into systems, uncovering how they work and learning to protect them. It\'s an engaging test of your curiosity and problem-solving skills.'
  },
  {
    id: 'agentic-ai-arena',
    title: 'Agentic AI Arena',
    description: 'Welcome to the future of autonomy. Design and deploy AI agents that can solve complex tasks and compete in dynamic environments.',
    icon: Bot,
    category: 'AI',
    mode: 'Duo',
    prize: 'TBD',
    longDescription: 'Step into the Agentic AI Arena, where the goal is to build autonomous agents that can think, act, and reason. Whether it\'s task automation or strategy-based competition, show us how your agents handle the pressure of the arena.'
  },
  {
    id: 'datathon',
    title: 'Datathon',
    description: 'Data is the new oil, and you\'re the refinery. Dive deep into datasets to uncover hidden patterns and build predictive models.',
    icon: BarChart3,
    category: 'Tech',
    mode: 'Duo',
    prize: 'TBD',
    longDescription: 'Join the Datathon to showcase your data science skills. From exploratory data analysis to complex machine learning models, your goal is to extract meaningful insights from raw data and solve real-world problems.'
  },
  {
    id: 'prompt-engineering',
    title: 'Prompt Engineering',
    description: 'Are you an AI whisperer? Master the art of prompting to generate mind-blowing outputs and lead the future of engineering.',
    icon: MessageSquare,
    category: 'AI',
    mode: 'Individual',
    prize: 'TBD',
    longDescription: 'In the age of AI, the one who knows how to talk to the machines wins. You\'ll be solving creative and technical tasks using the latest LLMs and image generation models. Show us how you prompt!'
  },
  {
    id: 'esports-competition',
    title: 'Esports Competition',
    description: 'Unleash your gaming passion. Join fellow enthusiasts to showcase your strategy and skills in some of the most popular titles in a lively, community-focused arena.',
    icon: Gamepad2,
    category: 'Gaming',
    mode: 'Individual',
    prize: 'TBD',
    longDescription: 'Welcome to the Technova Esports Arena! This is where passion meets play. We\'ve picked the hottest titles to celebrate your strategy and reflexes. Whether you\'re teaming up with your squad or playing solo, come share the excitement and show us your best moves.',
    subGames: [
      {
        id: 'pubg-mobile',
        title: 'PUBG Mobile',
        description: 'Squad-based action and strategy. Drop in, explore, and work with your team to navigate the arena in this fan-favorite title.',
        mode: 'Squad',
        prize: 'TBD'
      }
    ]
  },
  {
    id: 'webforces',
    title: 'Webforces',
    description: 'Love pretty things? Join us to craft stunning, responsive, and buttery-smooth user experiences that people actually enjoy using.',
    icon: Palette,
    category: 'Design',
    mode: 'Duo',
    prize: 'TBD',
    longDescription: 'Hey there, creative! In this challenge, you\'ll flex your frontend muscles to build a futuristic landing page. We\'re looking for that perfect mix of "wow" factor and rock-solid usability. No boring sites allowed!'
  },
  {
    id: 'digital-dash',
    title: 'Digital Dash (UI/UX)',
    description: 'Race against time to design the perfect user journey. Show us your intuition for design systems and user-centric flows.',
    icon: Layout,
    category: 'Design',
    mode: 'Individual',
    prize: 'TBD',
    longDescription: 'Digital Dash is a high-speed UI/UX design challenge. You\'ll be given a problem statement and a set of constraints to design a functional and aesthetic solution in record time. Efficiency and elegance are key!'
  },
  {
    id: 'maths-mania',
    title: 'Maths Mania',
    description: 'Love a good brain teaser? Put your logic and quantitative reasoning to the test. It\'s not just about numbers, it\'s about creative thinking!',
    icon: Calculator,
    category: 'Tech',
    mode: 'Individual',
    prize: 'TBD',
    longDescription: 'Enter the world of numbers where logic is king. Challenge your brain with puzzles that require more than just a calculator—they require a spark of genius. Ready to prove you\'re the master of the variable?'
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
