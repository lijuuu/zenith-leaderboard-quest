
import { ChatChannel, ChatMessage } from './types';

// Mock data for chat channels
const mockChannels: ChatChannel[] = [
  {
    id: "general",
    name: "General",
    description: "Community chat for all topics",
    type: "public"
  },
  {
    id: "easy-problems",
    name: "Easy Problems",
    description: "Discussion for easy difficulty problems",
    type: "public"
  },
  {
    id: "medium-problems",
    name: "Medium Problems",
    description: "Discussion for medium difficulty problems",
    type: "public"
  },
  {
    id: "hard-problems",
    name: "Hard Problems",
    description: "Discussion for hard difficulty problems",
    type: "public"
  },
  {
    id: "contests",
    name: "Contests",
    description: "Discussions about contests and competitions",
    type: "public"
  },
  {
    id: "job-hunting",
    name: "Job Hunting",
    description: "Career advice and job opportunities",
    type: "public"
  },
  {
    id: "interviews",
    name: "Interviews",
    description: "Interview preparation and experiences",
    type: "public"
  }
];

// Mock message data for the general channel
const mockMessages: ChatMessage[] = [
  {
    id: "m1",
    channelId: "general",
    sender: {
      id: "4",
      username: "Alice",
      profileImage: "https://i.pravatar.cc/300?img=5"
    },
    content: "Hey, anyone working on the Two Sum problem?",
    timestamp: "2023-04-02T12:47:00Z"
  },
  {
    id: "m2",
    channelId: "general",
    sender: {
      id: "5",
      username: "Bob",
      profileImage: "https://i.pravatar.cc/300?img=8"
    },
    content: "Yeah, I solved it using a hash map. What approach are you using?",
    timestamp: "2023-04-02T12:52:00Z"
  },
  {
    id: "m3",
    channelId: "general",
    sender: {
      id: "1",
      username: "Me",
      profileImage: "https://i.pravatar.cc/300?img=1"
    },
    content: "I'm struggling with the time complexity. My brute force approach is O(n²) but I think there's a more efficient way.",
    timestamp: "2023-04-02T12:57:00Z",
    isCurrentUser: true
  },
  {
    id: "m4",
    channelId: "general",
    sender: {
      id: "4",
      username: "Alice",
      profileImage: "https://i.pravatar.cc/300?img=5"
    },
    content: "Try using a hash map to store the elements you've seen. It can reduce time complexity to O(n).",
    timestamp: "2023-04-02T13:02:00Z"
  },
  {
    id: "m5",
    channelId: "general",
    sender: {
      id: "5",
      username: "Bob",
      profileImage: "https://i.pravatar.cc/300?img=8"
    },
    content: "Exactly. As you iterate through the array, check if the complement (target - current element) exists in the hash map. If it does, you've found your pair.",
    timestamp: "2023-04-02T13:07:00Z"
  }
];

// API functions
export const getChannels = async (): Promise<ChatChannel[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve(mockChannels), 500);
  });
};

export const getMessages = async (channelId: string, options?: { limit?: number; before?: string }): Promise<ChatMessage[]> => {
  return new Promise(resolve => {
    let messages = mockMessages.filter(m => m.channelId === channelId);
    
    if (options?.before) {
      const beforeIndex = messages.findIndex(m => m.id === options.before);
      if (beforeIndex !== -1) {
        messages = messages.slice(0, beforeIndex);
      }
    }
    
    if (options?.limit && messages.length > options.limit) {
      messages = messages.slice(messages.length - options.limit);
    }
    
    setTimeout(() => resolve(messages), 600);
  });
};

export const sendMessage = async (channelId: string, content: string): Promise<ChatMessage> => {
  return new Promise(resolve => {
    const newMessage: ChatMessage = {
      id: `m${Date.now()}`,
      channelId,
      sender: {
        id: "1",
        username: "Me",
        profileImage: "https://i.pravatar.cc/300?img=1"
      },
      content,
      timestamp: new Date().toISOString(),
      isCurrentUser: true
    };
    
    setTimeout(() => resolve(newMessage), 300);
  });
};

export const createDirectChannel = async (userId: string): Promise<ChatChannel> => {
  return new Promise((resolve, reject) => {
    // In a real app, this would create or retrieve an existing DM channel
    setTimeout(() => resolve({
      id: `dm-${userId}`,
      name: "Direct Message",
      type: "direct",
      participants: [
        {
          id: "1",
          username: "johndoe",
          fullName: "John Doe",
          email: "john.doe@example.com",
          profileImage: "https://i.pravatar.cc/300?img=1",
          joinedDate: "2022-01-15",
          problemsSolved: 147,
          dayStreak: 26,
          ranking: 354,
          isBanned: false,
          isVerified: true
        },
        {
          id: userId,
          username: userId === "4" ? "Alice" : "Bob",
          fullName: userId === "4" ? "Alice Johnson" : "Bob Smith",
          email: userId === "4" ? "alice@example.com" : "bob@example.com",
          profileImage: `https://i.pravatar.cc/300?img=${userId === "4" ? "5" : "8"}`,
          joinedDate: "2022-02-20",
          problemsSolved: 120,
          dayStreak: 15,
          ranking: 450,
          isBanned: false,
          isVerified: true
        }
      ]
    }), 700);
  });
};
