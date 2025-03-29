import { LeaderboardEntry } from './types';

// Mock leaderboard data
const mockLeaderboardEntries: LeaderboardEntry[] = [
  {
    id: "1",
    username: "johnsmith",
    fullName: "John Smith",
    profileImage: "https://i.pravatar.cc/300?img=1",
    rank: 1,
    rating: 2850,
    problemsSolved: 378,
    country: "United States",
    countryCode: "us",
    user: {
      id: "1",
      username: "johnsmith", 
      fullName: "John Smith",
      profileImage: "https://i.pravatar.cc/300?img=1",
      country: "United States",
      countryCode: "us"
    },
    score: 9856,
    contestsParticipated: 78,
    streakDays: 145
  },
  {
    id: "2",
    username: "emilydavis",
    fullName: "Emily Davis",
    profileImage: "https://i.pravatar.cc/300?img=2",
    rank: 2,
    rating: 2790,
    problemsSolved: 365,
    country: "Canada",
    countryCode: "ca",
    user: {
      id: "2",
      username: "emilydavis",
      fullName: "Emily Davis",
      profileImage: "https://i.pravatar.cc/300?img=2",
      country: "Canada",
      countryCode: "ca"
    },
    score: 9723,
    contestsParticipated: 82,
    streakDays: 120
  },
  {
    id: "3",
    username: "alexanderwang",
    fullName: "Alexander Wang",
    profileImage: "https://i.pravatar.cc/300?img=3",
    rank: 3,
    rating: 2750,
    problemsSolved: 350,
    country: "China",
    countryCode: "cn",
    user: {
      id: "3",
      username: "alexanderwang",
      fullName: "Alexander Wang",
      profileImage: "https://i.pravatar.cc/300?img=3",
      country: "China",
      countryCode: "cn"
    },
    score: 9600,
    contestsParticipated: 70,
    streakDays: 110
  },
  {
    id: "4",
    username: "mariagarcia",
    fullName: "Maria Garcia",
    profileImage: "https://i.pravatar.cc/300?img=4",
    rank: 4,
    rating: 2700,
    problemsSolved: 340,
    country: "Spain",
    countryCode: "es",
    user: {
      id: "4",
      username: "mariagarcia",
      fullName: "Maria Garcia",
      profileImage: "https://i.pravatar.cc/300?img=4",
      country: "Spain",
      countryCode: "es"
    },
    score: 9450,
    contestsParticipated: 75,
    streakDays: 100
  },
  {
    id: "5",
    username: "davidlee",
    fullName: "David Lee",
    profileImage: "https://i.pravatar.cc/300?img=5",
    rank: 5,
    rating: 2650,
    problemsSolved: 330,
    country: "Australia",
    countryCode: "au",
    user: {
      id: "5",
      username: "davidlee",
      fullName: "David Lee",
      profileImage: "https://i.pravatar.cc/300?img=5",
      country: "Australia",
      countryCode: "au"
    },
    score: 9300,
    contestsParticipated: 68,
    streakDays: 90
  },
  {
    id: "6",
    username: "jessicabrown",
    fullName: "Jessica Brown",
    profileImage: "https://i.pravatar.cc/300?img=6",
    rank: 6,
    rating: 2600,
    problemsSolved: 320,
    country: "United Kingdom",
    countryCode: "gb",
    user: {
      id: "6",
      username: "jessicabrown",
      fullName: "Jessica Brown",
      profileImage: "https://i.pravatar.cc/300?img=6",
      country: "United Kingdom",
      countryCode: "gb"
    },
    score: 9150,
    contestsParticipated: 65,
    streakDays: 80
  },
  {
    id: "7",
    username: "kevinnguyen",
    fullName: "Kevin Nguyen",
    profileImage: "https://i.pravatar.cc/300?img=7",
    rank: 7,
    rating: 2550,
    problemsSolved: 310,
    country: "Vietnam",
    countryCode: "vn",
    user: {
      id: "7",
      username: "kevinnguyen",
      fullName: "Kevin Nguyen",
      profileImage: "https://i.pravatar.cc/300?img=7",
      country: "Vietnam",
      countryCode: "vn"
    },
    score: 9000,
    contestsParticipated: 62,
    streakDays: 70
  },
  {
    id: "8",
    username: "laurachen",
    fullName: "Laura Chen",
    profileImage: "https://i.pravatar.cc/300?img=8",
    rank: 8,
    rating: 2500,
    problemsSolved: 300,
    country: "Germany",
    countryCode: "de",
    user: {
      id: "8",
      username: "laurachen",
      fullName: "Laura Chen",
      profileImage: "https://i.pravatar.cc/300?img=8",
      country: "Germany",
      countryCode: "de"
    },
    score: 8850,
    contestsParticipated: 60,
    streakDays: 60
  },
  {
    id: "9",
    username: "robertperez",
    fullName: "Robert Perez",
    profileImage: "https://i.pravatar.cc/300?img=9",
    rank: 9,
    rating: 2450,
    problemsSolved: 290,
    country: "Mexico",
    countryCode: "mx",
    user: {
      id: "9",
      username: "robertperez",
      fullName: "Robert Perez",
      profileImage: "https://i.pravatar.cc/300?img=9",
      country: "Mexico",
      countryCode: "mx"
    },
    score: 8700,
    contestsParticipated: 58,
    streakDays: 50
  },
  {
    id: "10",
    username: "sangeetakumar",
    fullName: "Sangeeta Kumar",
    profileImage: "https://i.pravatar.cc/300?img=10",
    rank: 10,
    rating: 2400,
    problemsSolved: 280,
    country: "India",
    countryCode: "in",
    user: {
      id: "10",
      username: "sangeetakumar",
      fullName: "Sangeeta Kumar",
      profileImage: "https://i.pravatar.cc/300?img=10",
      country: "India",
      countryCode: "in"
    },
    score: 8550,
    contestsParticipated: 55,
    streakDays: 40
  }
];

// Simulate API call to fetch leaderboard data
export const getLeaderboard = async (options: { page: number; limit: number; period: 'all' | 'monthly' | 'weekly'; }) => {
  return new Promise(resolve => {
    const start = (options.page - 1) * options.limit;
    const end = start + options.limit;
    const entries = mockLeaderboardEntries.slice(start, end);
    
    setTimeout(() => resolve({
      leaderboard: entries, 
      total: mockLeaderboardEntries.length
    }), 500);
  });
};

// Simulate API call to fetch friends leaderboard data
export const getFriendsLeaderboard = async (): Promise<LeaderboardEntry[]> => {
  return new Promise(resolve => {
    // Filter the mock data to only include friends (based on some criteria)
    const friendsLeaderboard = mockLeaderboardEntries.slice(0, 5); // Example: top 5 are friends
    setTimeout(() => resolve(friendsLeaderboard), 500);
  });
};
