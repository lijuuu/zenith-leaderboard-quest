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
