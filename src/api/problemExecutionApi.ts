
import { getProblem } from './problemApi';
import { ProblemMetadata, ExecutionResult, GenericResponse } from './types/problem-execution';

// Mock fetch problem API - uses our existing getProblem function
export const fetchProblemByIdAPI = async (id: string): Promise<ProblemMetadata> => {
  const problem = await getProblem(id);
  
  if (!problem) {
    throw new Error('Problem not found');
  }
  
  // Convert our Problem type to ProblemMetadata type
  return {
    problem_id: problem.id,
    title: problem.title,
    description: problem.description,
    tags: problem.tags,
    testcase_run: {
      run: problem.examples.map((ex, index) => ({
        id: `test-${index}`,
        input: ex.input,
        expected: ex.output
      }))
    },
    difficulty: problem.difficulty,
    supported_languages: ['javascript', 'python', 'go'],
    validated: true,
    placeholder_maps: {
      javascript: 'function solution() {\n  // Type your code\n  return [];\n}',
      python: 'def solution():\n  # Type your code\n  return []',
      go: 'func solution() []interface{} {\n  // Type your code\n  return nil\n}'
    }
  };
};

// Mock execution API
export const executeCode = async (
  problemId: string,
  language: string,
  code: string,
  isRunMode: boolean = true
): Promise<GenericResponse> => {
  const randomSuccess = Math.random() > 0.2; // 80% success rate
  const problem = await getProblem(problemId);
  
  if (!problem) {
    throw new Error('Problem not found');
  }
  
  const totalCases = problem.examples.length;
  const passedCases = randomSuccess ? totalCases : Math.floor(Math.random() * totalCases);
  
  // Create mock execution result
  const executionResult: ExecutionResult = {
    totalTestCases: totalCases,
    passedTestCases: passedCases,
    failedTestCases: totalCases - passedCases,
    overallPass: passedCases === totalCases,
    syntaxError: randomSuccess ? undefined : (Math.random() > 0.8 ? "Syntax error" : undefined)
  };
  
  // Add a failed test case if not all passed
  if (passedCases < totalCases) {
    const failedIndex = Math.floor(Math.random() * totalCases);
    executionResult.failedTestCase = {
      testCaseIndex: failedIndex,
      input: problem.examples[failedIndex].input,
      expected: problem.examples[failedIndex].output,
      received: `Incorrect result: ${Math.random().toString(36).substring(7)}`,
      passed: false
    };
  }
  
  // Simulate a delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  return {
    success: randomSuccess, 
    status: randomSuccess ? 200 : 400,
    payload: {
      problem_id: problemId,
      language,
      is_run_testcase: isRunMode,
      rawoutput: executionResult
    },
    error: randomSuccess ? undefined : {
      errorType: 'ExecutionError',
      message: 'Code execution failed'
    }
  };
};
