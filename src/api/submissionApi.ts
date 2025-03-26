
import { Submission } from './types';

// Mock data for submissions
const mockSubmissions: Submission[] = [
  {
    id: "s1",
    problemId: "p1",
    problemTitle: "Two Sum",
    userId: "1",
    language: "JavaScript",
    code: "function twoSum(nums, target) { /* ... */ }",
    status: "Accepted",
    runtime: "56ms",
    memory: "42MB",
    timestamp: "2023-04-05T09:23:45Z",
    testCases: {
      passed: 30,
      total: 30
    }
  },
  {
    id: "s2",
    problemId: "p2",
    problemTitle: "Reverse Integer",
    userId: "1",
    language: "Python",
    code: "def reverse(x): # ...",
    status: "Wrong Answer",
    runtime: "48ms",
    memory: "38MB",
    timestamp: "2023-04-04T14:30:22Z",
    testCases: {
      passed: 28,
      total: 32
    }
  },
  {
    id: "s3",
    problemId: "p3",
    problemTitle: "Valid Parentheses",
    userId: "1",
    language: "TypeScript",
    code: "function isValid(s: string): boolean { /* ... */ }",
    status: "Accepted",
    runtime: "60ms",
    memory: "44MB",
    timestamp: "2023-04-03T18:12:05Z",
    testCases: {
      passed: 25,
      total: 25
    }
  }
];

export const getUserSubmissions = async (userId: string): Promise<Submission[]> => {
  return new Promise(resolve => {
    // Filter submissions by userId in a real application
    const userSubmissions = [...mockSubmissions];
    setTimeout(() => resolve(userSubmissions), 600);
  });
};

export const getSubmission = async (id: string): Promise<Submission | null> => {
  return new Promise(resolve => {
    const submission = mockSubmissions.find(s => s.id === id) || null;
    setTimeout(() => resolve(submission), 500);
  });
};

export const submitSolution = async (data: { 
  problemId: string, 
  language: string, 
  code: string 
}): Promise<Submission> => {
  return new Promise(resolve => {
    const newSubmission: Submission = {
      id: `s${Date.now()}`,
      problemId: data.problemId,
      problemTitle: "Sample Problem",
      userId: "1", // Assume current user
      language: data.language,
      code: data.code,
      status: "Accepted", // Simulate successful submission
      runtime: "62ms",
      memory: "40MB",
      timestamp: new Date().toISOString(),
      testCases: {
        passed: 20,
        total: 20
      }
    };
    
    setTimeout(() => resolve(newSubmission), 800);
  });
};
