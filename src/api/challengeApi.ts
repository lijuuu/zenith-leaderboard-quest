
import { Challenge } from './types';

// Mock data for challenges
const mockChallenges: Challenge[] = [
  {
    id: "c1",
    title: "Algorithm Sprint",
    difficulty: "Medium",
    createdBy: {
      id: "3",
      username: "mchen",
      profileImage: "https://i.pravatar.cc/300?img=3"
    },
    participants: 4,
    problemCount: 3,
    createdAt: "2023-04-02T12:00:00Z",
    isActive: true,
    problems: ["p1", "p3", "p7"]
  },
  {
    id: "c2",
    title: "Data Structure Masters",
    difficulty: "Hard",
    createdBy: {
      id: "4",
      username: "sophie",
      profileImage: "https://i.pravatar.cc/300?img=9"
    },
    participants: 6,
    problemCount: 5,
    createdAt: "2023-04-01T15:00:00Z",
    isActive: true,
    problems: ["p4", "p5", "p6", "p8", "p9"]
  },
  {
    id: "c3",
    title: "Weekly Contest #42",
    difficulty: "Medium",
    createdBy: {
      id: "1",
      username: "admin",
      profileImage: "https://i.pravatar.cc/300?img=68"
    },
    participants: 128,
    problemCount: 4,
    createdAt: "2023-03-28T10:00:00Z",
    isActive: false,
    problems: ["p2", "p3", "p4", "p8"]
  }
];

// API functions
export const getChallenges = async (filters?: { active?: boolean; participated?: boolean }): Promise<Challenge[]> => {
  return new Promise(resolve => {
    let filteredChallenges = [...mockChallenges];
    
    if (filters) {
      if (filters.active !== undefined) {
        filteredChallenges = filteredChallenges.filter(c => c.isActive === filters.active);
      }
      
      // In a real app, this would filter challenges the current user has participated in
      if (filters.participated) {
        filteredChallenges = filteredChallenges.filter(c => c.id === "c1");
      }
    }
    
    setTimeout(() => resolve(filteredChallenges), 600);
  });
};

export const getChallenge = async (id: string): Promise<Challenge | null> => {
  return new Promise(resolve => {
    const challenge = mockChallenges.find(c => c.id === id) || null;
    setTimeout(() => resolve(challenge), 500);
  });
};

export const createChallenge = async (data: { title: string; difficulty: string; problemIds: string[] }): Promise<Challenge> => {
  return new Promise(resolve => {
    const newChallenge: Challenge = {
      id: `c${Date.now()}`,
      title: data.title,
      difficulty: data.difficulty as "Easy" | "Medium" | "Hard",
      createdBy: {
        id: "1",
        username: "johndoe",
        profileImage: "https://i.pravatar.cc/300?img=1"
      },
      participants: 1,
      problemCount: data.problemIds.length,
      createdAt: new Date().toISOString(),
      isActive: true,
      problems: data.problemIds
    };
    
    setTimeout(() => resolve(newChallenge), 800);
  });
};

export const joinChallenge = async (id: string): Promise<{ success: boolean }> => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ success: true }), 500);
  });
};

export const leaveChallenge = async (id: string): Promise<{ success: boolean }> => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ success: true }), 500);
  });
};

export const inviteToChallenge = async (challengeId: string, userIds: string[]): Promise<{ success: boolean; invitedCount: number }> => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ 
      success: true,
      invitedCount: userIds.length
    }), 600);
  });
};

export const getChallengeInvites = async (): Promise<{ challengeId: string; challengeTitle: string; invitedBy: string }[]> => {
  return new Promise(resolve => {
    setTimeout(() => resolve([
      {
        challengeId: "c2",
        challengeTitle: "Data Structure Masters",
        invitedBy: "sophie"
      }
    ]), 500);
  });
};

export const respondToInvite = async (challengeId: string, accept: boolean): Promise<{ success: boolean }> => {
  return new Promise(resolve => {
    setTimeout(() => resolve({ success: true }), 400);
  });
};
