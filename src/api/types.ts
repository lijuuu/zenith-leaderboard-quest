
export interface Problem {
  id: string;
  title: string;
  slug: string;
  difficulty: "Easy" | "Medium" | "Hard";
  tags: string[];
  acceptanceRate: number;
  solved: boolean;
  description: string;
  examples: {
    input: string;
    output: string;
    explanation?: string;
  }[];
  constraints: string[];
  hints?: string[];
  testcase_run?: {
    run: {
      id: string;
      input: string;
      expected: string;
    }[];
  };
  supported_languages?: string[];
  placeholder_maps?: { [key: string]: string };
}

export interface Submission {
  id: string;
  problemId: string;
  problemTitle: string;
  userId: string;
  language: string;
  code: string;
  status: string;
  runtime?: string;
  memory?: string;
  timestamp: string;
  testCases: {
    passed: number;
    total: number;
  };
  difficulty?: string;
  problem?: Problem;
  submittedAt?: string;
}

export interface CompileRequest {
  language: string;
  code: string;
}

export interface CompileResponse {
  output?: string;
  error?: string;
  success?: boolean;
  execution_time?: number;
  status_message?: string;
}

// Add missing interfaces referenced in the codebase
export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  profileImage?: string;
  location?: string;
  bio?: string;
  isOnline?: boolean;
  avatar?: string;
  name?: string;
}

export interface UserProfile {
  id: string;
  username: string;
  fullName: string;
  email: string;
  profileImage?: string;
  location?: string;
  bio?: string;
  joinedDate?: string;
  problemsSolved: number;
  dayStreak: number;
  ranking: number;
  globalRank?: number;
  currentRating?: number;
  badges?: Badge[];
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
}

export interface Friend {
  id: string;
  username: string;
  fullName?: string;
  profileImage?: string;
  isOnline?: boolean;
  lastActive?: string;
}

export interface Badge {
  id: string;
  name: string;
  description: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  earnedDate: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  isPrivate: boolean;
  participants?: number;
  createdAt: string;
  participantUsers?: {
    id?: string;
    name?: string;
    avatar?: string;
  }[];
}

export interface ChatChannel {
  id: string;
  name: string;
  type: "direct" | "group" | "public";
  participants: User[];
  lastMessage?: {
    content: string;
    timestamp: string;
    sender: string;
  };
  unreadCount: number;
}

export interface ChatMessage {
  id: string;
  channelId: string;
  sender?: User;
  content: string;
  timestamp: string;
  isCurrentUser?: boolean;
  liked?: boolean;
  likeCount?: number;
}

export interface LeaderboardEntry {
  id: string;
  username: string;
  fullName?: string;
  profileImage?: string;
  rank: number;
  rating: number;
  problemsSolved: number;
  country?: string;
  countryCode?: string;
  isFriend?: boolean;
}

export interface AuthResponse {
  token: string;
  user: User;
  expiresIn: number;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  fullName: string;
}

export interface GenericResponse<T = any> {
  success: boolean;
  status: number;
  payload: T;
  error?: {
    errorType: string;
    message: string;
  };
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  adminID?: string;
  message?: string;
}

export interface UsersResponse {
  users: User[];
  totalCount: number;
  nextPageToken?: string;
}

export interface AdminState {
  user: {
    id: string;
    username: string;
    role: string;
  } | null;
  isAuthenticated: boolean;
  accessToken: string | null;
  error: string | null;
}
