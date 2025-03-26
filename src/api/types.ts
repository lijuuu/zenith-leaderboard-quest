
// User related types
export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  profileImage?: string;
  bio?: string;
  website?: string;
  githubProfile?: string;
  location?: string;
  joinedDate: string;
  problemsSolved: number;
  dayStreak: number;
  ranking: number;
  isBanned: boolean;
  isVerified: boolean;
  following?: number;
  followers?: number;
  is2FAEnabled?: boolean;
}

export interface UserProfile extends User {
  stats: {
    easy: { solved: number; total: number };
    medium: { solved: number; total: number };
    hard: { solved: number; total: number };
  };
  achievements: {
    weeklyContests: number;
    monthlyContests: number;
    specialEvents: number;
  };
  badges: Badge[];
  activityHeatmap: HeatmapData;
}

export interface Friend {
  id: string;
  username: string;
  fullName: string;
  profileImage?: string;
  status: 'online' | 'offline' | 'in-match' | 'coding';
  lastActive?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  icon: string;
  earnedDate: string;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
}

export interface HeatmapData {
  startDate: string;
  data: { date: string; count: number; present: boolean }[];
}

// Problem related types
export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  tags: string[];
  acceptanceRate: number;
  solved?: boolean;
  description: string;
  examples: ProblemExample[];
  constraints: string[];
  hints?: string[];
  similarProblems?: { id: string; title: string; difficulty: string }[];
  solutions?: Solution[];
}

export interface ProblemExample {
  input: string;
  output: string;
  explanation?: string;
}

export interface Solution {
  id: string;
  authorId: string;
  authorName: string;
  language: string;
  code: string;
  runtime: string;
  memory: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  comments: Comment[];
}

export interface Comment {
  id: string;
  authorId: string;
  authorName: string;
  authorImage?: string;
  content: string;
  createdAt: string;
  upvotes: number;
  downvotes: number;
  replies?: Comment[];
}

// Challenge related types
export interface Challenge {
  id: string;
  title: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  createdBy: {
    id: string;
    username: string;
    profileImage?: string;
  };
  participants: number;
  problemCount: number;
  createdAt: string;
  isActive: boolean;
  problems?: string[];
}

// Chat related types
export interface ChatChannel {
  id: string;
  name: string;
  description?: string;
  type: 'public' | 'private' | 'direct';
  participants?: User[];
  unreadCount?: number;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  sender: {
    id: string;
    username: string;
    profileImage?: string;
  };
  content: string;
  timestamp: string;
  isCurrentUser?: boolean;
  attachments?: {
    type: 'image' | 'code' | 'link';
    content: string;
  }[];
}

// Leaderboard related types
export interface LeaderboardEntry {
  rank: number;
  user: {
    id: string;
    username: string;
    fullName: string;
    profileImage?: string;
    country?: string;
    countryCode?: string;
  };
  score: number;
  problemsSolved: number;
  contestsParticipated: number;
  streakDays: number;
}

// Auth related types
export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
  code?: string; // For 2FA
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

// Submission related types
export interface Submission {
  id: string;
  problemId: string;
  problemTitle: string;
  userId: string;
  language: string;
  code: string;
  status: 'Accepted' | 'Wrong Answer' | 'Time Limit Exceeded' | 'Memory Limit Exceeded' | 'Runtime Error' | 'Compilation Error';
  runtime?: string;
  memory?: string;
  timestamp: string;
  testCases?: {
    passed: number;
    total: number;
    results?: {
      input: string;
      expectedOutput: string;
      actualOutput?: string;
      passed: boolean;
      error?: string;
    }[];
  };
}

// Compiler related types
export interface CompileRequest {
  language: string;
  code: string;
  input?: string;
}

export interface CompileResponse {
  output: string;
  error?: string;
  executionTime?: string;
  memory?: string;
}
