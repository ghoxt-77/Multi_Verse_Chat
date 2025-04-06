export interface Message {
  id: string;
  text: string;
  userId: string;
  timestamp: string;
  type?: 'text' | 'audio' | 'image';
  audioUrl?: string;
  imageUrl?: string;
}

export interface User {
  id: string;
  name: string;
  avatar: string;
  isOnline: boolean;
}

export interface Channel {
  id: string;
  name: string;
  icon: string;
  description: string;
  messages: Message[];
}

export interface Category {
  id: string;
  name: string;
  channels: Channel[];
}

export const users: User[] = [
  {
    id: "user-1",
    name: "GameMaster",
    avatar: "https://i.pravatar.cc/100?img=1",
    isOnline: true,
  },
  {
    id: "user-2",
    name: "Pixel_Wizard",
    avatar: "https://i.pravatar.cc/100?img=2",
    isOnline: true,
  },
  {
    id: "user-3",
    name: "NerdQueen",
    avatar: "https://i.pravatar.cc/100?img=3",
    isOnline: false,
  },
  {
    id: "user-4",
    name: "RPG_Lover",
    avatar: "https://i.pravatar.cc/100?img=4",
    isOnline: true,
  },
  {
    id: "user-5",
    name: "TechGuru",
    avatar: "https://i.pravatar.cc/100?img=5",
    isOnline: true,
  },
];

export const categories: Category[] = [
  {
    id: "cat-1",
    name: "Mundo Geek",
    channels: [
      {
        id: "channel-1",
        name: "Quadrinhos e Mangás",
        icon: "📚",
        description: "Discussões sobre histórias em quadrinhos, mangás e graphic novels",
        messages: [
          {
            id: "msg-1",
            text: "Quem está acompanhando o novo arco de One Piece?",
            userId: "user-1",
            timestamp: "2023-04-05T14:30:00Z",
          },
          {
            id: "msg-2",
            text: "Eu estou! A saga de Wano está incrível, mal posso esperar para ver como termina!",
            userId: "user-2",
            timestamp: "2023-04-05T14:32:00Z",
          },
          {
            id: "msg-3",
            text: "Vocês viram os últimos lançamentos da DC? Estou adorando as novas histórias do Batman.",
            userId: "user-3",
            timestamp: "2023-04-05T14:35:00Z",
          },
        ],
      },
      {
        id: "channel-2",
        name: "Filmes e Séries",
        icon: "🎬",
        description: "Cinema, séries de TV e streaming",
        messages: [
          {
            id: "msg-4",
            text: "O que acharam da nova temporada de The Witcher?",
            userId: "user-4",
            timestamp: "2023-04-05T15:10:00Z",
          },
          {
            id: "msg-5",
            text: "Preferi os livros, mas a série também está bem legal. A caracterização dos monstros está incrível!",
            userId: "user-5",
            timestamp: "2023-04-05T15:15:00Z",
          },
        ],
      },
      {
        id: "channel-3",
        name: "Cosplay",
        icon: "👘",
        description: "Compartilhe suas criações e dicas de cosplay",
        messages: [],
      },
    ],
  },
  {
    id: "cat-2",
    name: "Jogos",
    channels: [
      {
        id: "channel-4",
        name: "RPG",
        icon: "🎲",
        description: "Role-Playing Games de todos os tipos",
        messages: [
          {
            id: "msg-6",
            text: "Alguém jogando o novo Baldur's Gate?",
            userId: "user-2",
            timestamp: "2023-04-05T16:00:00Z",
          },
          {
            id: "msg-7",
            text: "Estou jogando! O sistema baseado em D&D 5e está fantástico!",
            userId: "user-1",
            timestamp: "2023-04-05T16:05:00Z",
          },
        ],
      },
      {
        id: "channel-5",
        name: "FPS",
        icon: "🔫",
        description: "First-Person Shooters",
        messages: [
          {
            id: "msg-8",
            text: "Vamos montar um squad para jogar Valorant hoje à noite?",
            userId: "user-3",
            timestamp: "2023-04-05T17:00:00Z",
          },
        ],
      },
      {
        id: "channel-6",
        name: "Estratégia",
        icon: "♟️",
        description: "Jogos de estratégia e táticas",
        messages: [],
      },
      {
        id: "channel-7",
        name: "Indie Games",
        icon: "🎮",
        description: "Joias independentes e hidden gems",
        messages: [],
      },
    ],
  },
  {
    id: "cat-3",
    name: "Desenvolvedores",
    channels: [
      {
        id: "channel-8",
        name: "EA Games",
        icon: "🏈",
        description: "Notícias e discussões sobre EA Games",
        messages: [
          {
            id: "msg-9",
            text: "O que esperar do próximo FIFA?",
            userId: "user-4",
            timestamp: "2023-04-05T18:00:00Z",
          },
        ],
      },
      {
        id: "channel-9",
        name: "Nintendo",
        icon: "🍄",
        description: "Tudo sobre a Nintendo e seus títulos",
        messages: [
          {
            id: "msg-10",
            text: "Quando vocês acham que teremos notícias do próximo Zelda?",
            userId: "user-5",
            timestamp: "2023-04-05T19:00:00Z",
          },
          {
            id: "msg-11",
            text: "Espero que em breve! Mal posso esperar para ver o que vem depois de Tears of the Kingdom.",
            userId: "user-1",
            timestamp: "2023-04-05T19:05:00Z",
          },
        ],
      },
      {
        id: "channel-10",
        name: "Sony",
        icon: "🎮",
        description: "PlayStation e estúdios da Sony",
        messages: [],
      },
      {
        id: "channel-11",
        name: "Indie Studios",
        icon: "🧩",
        description: "Estúdios independentes e seus projetos",
        messages: [],
      },
    ],
  },
];

export const currentUser: User = {
  id: "current",
  name: "Você",
  avatar: "https://i.pravatar.cc/100?img=68",
  isOnline: true,
};

export const initialState = {
  currentCategory: categories[0],
  currentChannel: categories[0].channels[0],
  categories,
  users,
  currentUser,
};
