
import { Problem, Submission, CompileRequest, CompileResponse } from './types';

// Mock data from the API response
const apiMockProblems = {
  "success": true,
  "status": 200,
  "payload": {
    "page": 1,
    "page_size": 100,
    "problems": [
      {
        "problem_id": "67d96452d3fe6af39801337b",
        "title": "Two Sum",
        "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to the target.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\n## Examples\n\n### Example 1:\n- **Input**: `nums = [2,7,11,15]`, `target = 9`\n- **Output**: `[0,1]`\n- **Explanation**: Because `nums[0] + nums[1] == 9`, we return `[0, 1]`\n\n### Example 2:\n- **Input**: `nums = [3,2,4]`, `target = 6`\n- **Output**: `[1,2]`\n\n## Constraints\n- `2 <= nums.length <= 10⁴`\n- `-10⁹ <= nums[i] <= 10⁹`\n- `-10⁹ <= target <= 10⁹`\n- Only one valid answer exists\n\n## Follow-up\nCan you come up with an algorithm that is less than `O(n²)` time complexity?",
        "tags": [
          "Array",
          "Hash Table",
          "String",
          "Linked List"
        ],
        "testcase_run": {
          "run": [
            {
              "id": "67e16a5a48ec539e82f1622c",
              "input": "{ \"nums\": [2,7,11,15], \"target\": 9 }",
              "expected": "[0,1]"
            },
            {
              "id": "67e216734e8f4ccb4fda6635",
              "input": "{   \"nums\": [2, 7, 11, 15],   \"target\": 9 }",
              "expected": "[0,1]"
            }
          ]
        },
        "difficulty": "E",
        "supported_languages": [
          "go",
          "python",
          "javascript"
        ],
        "validated": true,
        "placeholder_maps": {
          "go": "func twoSum(nums []int, target int) []int {\n\t//Type your code\n\treturn []int{}\n}",
          "javascript": "function twoSum(nums, target) {\n    // Type your code\n    return [];\n}",
          "python": "def two_sum(nums, target):\n    # Type your code\n    return []"
          }
      },
      {
        "problem_id": "67b96452d3fe6af39801337d",
        "title": "Reverse a String",
        "description": "Write a function that reverses a given string. You must return the string with its characters in reverse order.\n\n## Examples\n\n### Example 1:\n- **Input**: `\"hello\"`\n- **Output**: `\"olleh\"`\n- **Explanation**: The string \"hello\" is reversed to \"olleh\".\n\n### Example 2:\n- **Input**: `\"world\"`\n- **Output**: `\"dlrow\"`\n\n## Constraints\n- `1 <= s.length <= 10⁴`\n- `s` consists of printable ASCII characters.",
        "tags": [
          "String",
          "Array"
        ],
        "testcase_run": {
          "run": [
            {
              "id": "67e16a5a48ec539e82f16232",
              "input": "\"hello\"",
              "expected": "\"olleh\""
            },
            {
              "id": "67e16a5a48ec539e82f16233",
              "input": "\"world\"",
              "expected": "\"dlrow\""
            }
          ]
        },
        "difficulty": "E",
        "supported_languages": [
          "go",
          "python",
          "javascript"
        ],
        "validated": true,
        "placeholder_maps": {
          "go": "func reverseString(s string) string {\n\t// Type your code\n\treturn \"\"\n}",
          "javascript": "function reverseString(s) {\n    // Type your code\n    return \"\";\n}",
          "python": "def reverse_string(s):\n    # Type your code\n    return \"\""
        }
      },
      {
        "problem_id": "67e1a5b2c9f8d3e4a201b48f",
        "title": "Add Two Numbers",
        "description": "Write a function that takes two integers and returns their sum.\n\n## Examples\n\n### Example 1:\n- **Input**: `a = 3, b = 5`\n- **Output**: `8`\n- **Explanation**: `3 + 5 = 8`\n\n### Example 2:\n- **Input**: `a = -2, b = 7`\n- **Output**: `5`\n\n## Constraints\n- `-10⁹ <= a, b <= 10⁹`",
        "tags": [
          "Math",
          "Basic"
        ],
        "testcase_run": {
          "run": [
            {
              "id": "67e16a5a48ec539e82f16238",
              "input": "{\"a\": 3, \"b\": 5}",
              "expected": "8"
            },
            {
              "id": "67e16a5a48ec539e82f16239",
              "input": "{\"a\": -2, \"b\": 7}",
              "expected": "5"
            }
          ]
        },
        "difficulty": "E",
        "supported_languages": [
          "go",
          "python",
          "javascript"
        ],
        "validated": true,
        "placeholder_maps": {
          "go": "func addTwoNumbers(a int, b int) int {\n\t// Type your code\n\treturn 0\n}",
          "javascript": "function addTwoNumbers(a, b) {\n    // Type your code\n    return 0;\n}",
          "python": "def add_two_numbers(a, b):\n    # Type your code\n    return 0"
        }
      }
    ],
    "total_count": 3
  }
};

// Mock data for the Two Sum problem detail
const apiMockProblemDetail = {
  "success": true,
  "status": 200,
  "payload": {
    "problem_id": "67d96452d3fe6af39801337b",
    "title": "Two Sum",
    "description": "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to the target.\n\nYou may assume that each input would have **exactly one solution**, and you may not use the same element twice.\n\nYou can return the answer in any order.\n\n## Examples\n\n### Example 1:\n- **Input**: `nums = [2,7,11,15]`, `target = 9`\n- **Output**: `[0,1]`\n- **Explanation**: Because `nums[0] + nums[1] == 9`, we return `[0, 1]`\n\n### Example 2:\n- **Input**: `nums = [3,2,4]`, `target = 6`\n- **Output**: `[1,2]`\n\n## Constraints\n- `2 <= nums.length <= 10⁴`\n- `-10⁹ <= nums[i] <= 10⁹`\n- `-10⁹ <= target <= 10⁹`\n- Only one valid answer exists\n\n## Follow-up\nCan you come up with an algorithm that is less than `O(n²)` time complexity?",
    "tags": [
      "Array",
      "Hash Table",
      "String",
      "Linked List"
    ],
    "testcase_run": {
      "run": [
        {
          "id": "67e16a5a48ec539e82f1622c",
          "input": "{ \"nums\": [2,7,11,15], \"target\": 9 }",
          "expected": "[0,1]"
        },
        {
          "id": "67e216734e8f4ccb4fda6635",
          "input": "{   \"nums\": [2, 7, 11, 15],   \"target\": 9 }",
          "expected": "[0,1]"
        }
      ]
    },
    "difficulty": "E",
    "supported_languages": [
      "go",
      "python",
      "javascript"
    ],
    "validated": true,
    "placeholder_maps": {
      "go": "func twoSum(nums []int, target int) []int {\n\t//Type your code\n\treturn []int{}\n}",
      "javascript": "function twoSum(nums, target) {\n    // Type your code\n    return [];\n}",
      "python": "def two_sum(nums, target):\n    # Type your code\n    return []"
    }
  }
};

// Original mock data for problems
const mockProblems: Problem[] = [
  {
    id: "p1",
    title: "Two Sum",
    slug: "two-sum",
    difficulty: "Easy",
    tags: ["Array", "Hash Table", "String"],
    acceptanceRate: 78,
    solved: true,
    description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.\n\nYou can return the answer in any order.",
    examples: [
      {
        input: "nums = [2,7,11,15], target = 9",
        output: "[0,1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]."
      },
      {
        input: "nums = [3,2,4], target = 6",
        output: "[1,2]"
      },
      {
        input: "nums = [3,3], target = 6",
        output: "[0,1]"
      }
    ],
    constraints: [
      "2 <= nums.length <= 10^4",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists."
    ],
    hints: [
      "A really brute force way would be to search for all possible pairs of numbers but that would be too slow.",
      "Try to use the fact that the complement of the number we need is already in the hash table."
    ]
  },
  {
    id: "p2",
    title: "Reverse a String",
    slug: "reverse-string",
    difficulty: "Easy",
    tags: ["String", "Array"],
    acceptanceRate: 82,
    solved: false,
    description: "Write a function that reverses a string. The input string is given as an array of characters s.\n\nYou must do this by modifying the input array in-place with O(1) extra memory.",
    examples: [
      {
        input: 's = ["h","e","l","l","o"]',
        output: '["o","l","l","e","h"]'
      },
      {
        input: 's = ["H","a","n","n","a","h"]',
        output: '["h","a","n","n","a","H"]'
      }
    ],
    constraints: [
      "1 <= s.length <= 10^5",
      "s[i] is a printable ascii character."
    ]
  },
  {
    id: "p3",
    title: "Add Two Numbers",
    slug: "add-two-numbers",
    difficulty: "Medium",
    tags: ["Linked List", "Math", "Recursion"],
    acceptanceRate: 68,
    solved: true,
    description: "You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.\n\nYou may assume the two numbers do not contain any leading zero, except the number 0 itself.",
    examples: [
      {
        input: "l1 = [2,4,3], l2 = [5,6,4]",
        output: "[7,0,8]",
        explanation: "342 + 465 = 807."
      },
      {
        input: "l1 = [0], l2 = [0]",
        output: "[0]"
      },
      {
        input: "l1 = [9,9,9,9,9,9,9], l2 = [9,9,9,9]",
        output: "[8,9,9,9,0,0,0,1]"
      }
    ],
    constraints: [
      "The number of nodes in each linked list is in the range [1, 100].",
      "0 <= Node.val <= 9",
      "It is guaranteed that the list represents a number that does not have leading zeros."
    ]
  },
  {
    id: "p4",
    title: "Longest Palindromic Substring",
    slug: "longest-palindromic-substring",
    difficulty: "Medium",
    tags: ["String", "Dynamic Programming"],
    acceptanceRate: 56,
    solved: false,
    description: "Given a string s, return the longest palindromic substring in s.",
    examples: [
      {
        input: 's = "babad"',
        output: '"bab"',
        explanation: '"aba" is also a valid answer.'
      },
      {
        input: 's = "cbbd"',
        output: '"bb"'
      }
    ],
    constraints: [
      "1 <= s.length <= 1000",
      "s consist of only digits and English letters."
    ]
  },
  {
    id: "p5",
    title: "Valid Parentheses",
    slug: "valid-parentheses",
    difficulty: "Easy",
    tags: ["Stack", "String"],
    acceptanceRate: 74,
    solved: false,
    description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.\n\nAn input string is valid if:\n\n1. Open brackets must be closed by the same type of brackets.\n2. Open brackets must be closed in the correct order.\n3. Every close bracket has a corresponding open bracket of the same type.",
    examples: [
      {
        input: 's = "()"',
        output: "true"
      },
      {
        input: 's = "()[]{}"',
        output: "true"
      },
      {
        input: 's = "(]"',
        output: "false"
      }
    ],
    constraints: [
      "1 <= s.length <= 10^4",
      "s consists of parentheses only '()[]{}'."
    ]
  },
  {
    id: "p6",
    title: "Merge Two Sorted Lists",
    slug: "merge-two-sorted-lists",
    difficulty: "Medium",
    tags: ["Linked List", "Recursion"],
    acceptanceRate: 71,
    solved: false,
    description: "You are given the heads of two sorted linked lists list1 and list2.\n\nMerge the two lists in a one sorted list. The list should be made by splicing together the nodes of the first two lists.\n\nReturn the head of the merged linked list.",
    examples: [
      {
        input: "list1 = [1,2,4], list2 = [1,3,4]",
        output: "[1,1,2,3,4,4]"
      },
      {
        input: "list1 = [], list2 = []",
        output: "[]"
      },
      {
        input: "list1 = [], list2 = [0]",
        output: "[0]"
      }
    ],
    constraints: [
      "The number of nodes in both lists is in the range [0, 50].",
      "-100 <= Node.val <= 100",
      "Both list1 and list2 are sorted in non-decreasing order."
    ]
  },
  {
    id: "p7",
    title: "Longest Substring Without Repeating Characters",
    slug: "longest-substring-without-repeating-characters",
    difficulty: "Medium",
    tags: ["Hash Table", "String", "Sliding Window"],
    acceptanceRate: 64,
    solved: false,
    description: "Given a string s, find the length of the longest substring without repeating characters.",
    examples: [
      {
        input: 's = "abcabcbb"',
        output: "3",
        explanation: "The answer is 'abc', with the length of 3."
      },
      {
        input: 's = "bbbbb"',
        output: "1",
        explanation: "The answer is 'b', with the length of 1."
      },
      {
        input: 's = "pwwkew"',
        output: "3",
        explanation: "The answer is 'wke', with the length of 3. Notice that the answer must be a substring, 'pwke' is a subsequence and not a substring."
      }
    ],
    constraints: [
      "0 <= s.length <= 5 * 10^4",
      "s consists of English letters, digits, symbols and spaces."
    ]
  },
  {
    id: "p8",
    title: "Median of Two Sorted Arrays",
    slug: "median-of-two-sorted-arrays",
    difficulty: "Hard",
    tags: ["Array", "Binary Search", "Divide and Conquer"],
    acceptanceRate: 35,
    solved: false,
    description: "Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays.\n\nThe overall run time complexity should be O(log (m+n)).",
    examples: [
      {
        input: "nums1 = [1,3], nums2 = [2]",
        output: "2.00000",
        explanation: "merged array = [1,2,3] and median is 2."
      },
      {
        input: "nums1 = [1,2], nums2 = [3,4]",
        output: "2.50000",
        explanation: "merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5."
      }
    ],
    constraints: [
      "nums1.length == m",
      "nums2.length == n",
      "0 <= m <= 1000",
      "0 <= n <= 1000",
      "1 <= m + n <= 2000",
      "-10^6 <= nums1[i], nums2[i] <= 10^6"
    ]
  },
  {
    id: "p9",
    title: "Regular Expression Matching",
    slug: "regular-expression-matching",
    difficulty: "Hard",
    tags: ["String", "Dynamic Programming", "Recursion"],
    acceptanceRate: 28,
    solved: false,
    description: "Given an input string s and a pattern p, implement regular expression matching with support for '.' and '*' where:\n\n'.' Matches any single character.\n'*' Matches zero or more of the preceding element.\nThe matching should cover the entire input string (not partial).",
    examples: [
      {
        input: 's = "aa", p = "a"',
        output: "false",
        explanation: '"a" does not match the entire string "aa".'
      },
      {
        input: 's = "aa", p = "a*"',
        output: "true",
        explanation: '"a*" means zero or more of the preceding element, "a". Therefore, by repeating "a" once, it becomes "aa".'
      },
      {
        input: 's = "ab", p = ".*"',
        output: "true",
        explanation: '".*" means "zero or more (*) of any character (.)".'
      }
    ],
    constraints: [
      "1 <= s.length <= 20",
      "1 <= p.length <= 30",
      "s contains only lowercase English letters.",
      "p contains only lowercase English letters, '.', and '*'.",
      "It is guaranteed for each appearance of the character '*', there will be a previous valid character to match."
    ]
  }
];

// API functions
export const getProblems = async (filters?: { difficulty?: string; tags?: string[]; solved?: boolean; search?: string }): Promise<Problem[]> => {
  return new Promise(resolve => {
    try {
      // Try to use the API mock data first
      if (apiMockProblems && apiMockProblems.success) {
        console.log("Using API mock data for problems list");
        
        // Map the API format to our internal format
        const mappedProblems = apiMockProblems.payload.problems.map(p => ({
          id: p.problem_id,
          title: p.title,
          slug: p.title.toLowerCase().replace(/\s+/g, '-'),
          difficulty: mapDifficulty(p.difficulty),
          tags: p.tags,
          acceptanceRate: Math.floor(Math.random() * 30) + 60, // Random between 60-90%
          solved: Math.random() > 0.5, // Randomly set as solved or not
          description: p.description,
          examples: p.testcase_run.run.map(ex => ({
            input: ex.input,
            output: ex.expected,
            explanation: "" // Not provided in the API data
          })),
          constraints: p.description.includes("## Constraints") 
            ? p.description.split("## Constraints")[1].split(/\n##|\n\n/)[0].split("\n").filter(line => line.trim().startsWith("-")).map(line => line.trim())
            : []
        }));
        
        // Apply any filters
        let filteredProblems = [...mappedProblems];
        
        if (filters) {
          if (filters.difficulty) {
            filteredProblems = filteredProblems.filter(p => p.difficulty === filters.difficulty);
          }
          
          if (filters.tags && filters.tags.length > 0) {
            filteredProblems = filteredProblems.filter(p => 
              filters.tags!.some(tag => p.tags.includes(tag))
            );
          }
          
          if (filters.solved !== undefined) {
            filteredProblems = filteredProblems.filter(p => p.solved === filters.solved);
          }
          
          if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filteredProblems = filteredProblems.filter(p => 
              p.title.toLowerCase().includes(searchLower) || 
              p.description.toLowerCase().includes(searchLower)
            );
          }
        }
        
        setTimeout(() => resolve(filteredProblems), 600);
        return;
      }
    } catch (error) {
      console.error("Error processing API mock data:", error);
      // Fall back to the original mock data if anything goes wrong
    }
    
    // Fall back to original implementation with existing mock data
    let filteredProblems = [...mockProblems];
    
    if (filters) {
      if (filters.difficulty) {
        filteredProblems = filteredProblems.filter(p => p.difficulty === filters.difficulty);
      }
      
      if (filters.tags && filters.tags.length > 0) {
        filteredProblems = filteredProblems.filter(p =>
          filters.tags!.some(tag => p.tags.includes(tag))
        );
      }
      
      if (filters.solved !== undefined) {
        filteredProblems = filteredProblems.filter(p => p.solved === filters.solved);
      }
      
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProblems = filteredProblems.filter(p =>
          p.title.toLowerCase().includes(searchLower) ||
          p.description.toLowerCase().includes(searchLower)
        );
      }
    }
    
    setTimeout(() => resolve(filteredProblems), 600);
  });
};

export const getProblem = async (idOrSlug: string): Promise<Problem | null> => {
  return new Promise(resolve => {
    try {
      // Check if we're looking for the Two Sum problem specifically
      if (idOrSlug === "67d96452d3fe6af39801337b" || idOrSlug === "two-sum" || idOrSlug === "p1") {
        console.log("Using API mock data for Two Sum problem detail");
        
        // Format the API response to match our internal format
        const apiProblem = apiMockProblemDetail.payload;
        const problem: Problem = {
          id: apiProblem.problem_id,
          title: apiProblem.title,
          slug: apiProblem.title.toLowerCase().replace(/\s+/g, '-'),
          difficulty: mapDifficulty(apiProblem.difficulty),
          tags: apiProblem.tags,
          acceptanceRate: Math.floor(Math.random() * 30) + 60, // Random between 60-90%
          solved: Math.random() > 0.5, // Randomly set as solved or not
          description: apiProblem.description,
          examples: apiProblem.testcase_run.run.map(ex => ({
            input: ex.input,
            output: ex.expected,
            explanation: "" // Not provided in the API data
          })),
          constraints: apiProblem.description.includes("## Constraints") 
            ? apiProblem.description.split("## Constraints")[1].split(/\n##|\n\n/)[0].split("\n").filter(line => line.trim().startsWith("-")).map(line => line.trim())
            : []
        };
        
        setTimeout(() => resolve(problem), 500);
        return;
      }
      
      // For other problems, check the problems list
      for (const apiProblem of apiMockProblems.payload.problems) {
        if (apiProblem.problem_id === idOrSlug || 
            apiProblem.title.toLowerCase().replace(/\s+/g, '-') === idOrSlug) {
          
          console.log(`Using API mock data for problem: ${apiProblem.title}`);
          
          const problem: Problem = {
            id: apiProblem.problem_id,
            title: apiProblem.title,
            slug: apiProblem.title.toLowerCase().replace(/\s+/g, '-'),
            difficulty: mapDifficulty(apiProblem.difficulty),
            tags: apiProblem.tags,
            acceptanceRate: Math.floor(Math.random() * 30) + 60, // Random between 60-90%
            solved: Math.random() > 0.5, // Randomly set as solved or not
            description: apiProblem.description,
            examples: apiProblem.testcase_run.run.map(ex => ({
              input: ex.input,
              output: ex.expected,
              explanation: "" // Not provided in the API data
            })),
            constraints: apiProblem.description.includes("## Constraints") 
              ? apiProblem.description.split("## Constraints")[1].split(/\n##|\n\n/)[0].split("\n").filter(line => line.trim().startsWith("-")).map(line => line.trim())
              : []
          };
          
          setTimeout(() => resolve(problem), 500);
          return;
        }
      }
    } catch (error) {
      console.error("Error processing API mock data for problem detail:", error);
      // Fall back to the original implementation if anything goes wrong
    }
    
    // Fall back to the original implementation
    const problem = mockProblems.find(p => 
      p.id === idOrSlug || p.slug === idOrSlug
    ) || null;
    
    setTimeout(() => resolve(problem), 500);
  });
};

// Helper function to map difficulty codes to strings
const mapDifficulty = (difficulty: string): "Easy" | "Medium" | "Hard" => {
  const difficultyMap: Record<string, "Easy" | "Medium" | "Hard"> = {
    "1": "Easy",
    "2": "Medium",
    "3": "Hard",
    "E": "Easy",
    "M": "Medium",
    "H": "Hard",
  };
  return difficultyMap[difficulty] || "Medium";
};

// Mock submissions
const mockSubmissions: Submission[] = [
  {
    id: "s1",
    problemId: "p1",
    problemTitle: "Two Sum",
    userId: "1",
    language: "javascript",
    code: "function twoSum(nums, target) {\n  const map = new Map();\n  \n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    \n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    \n    map.set(nums[i], i);\n  }\n  \n  return [];\n}",
    status: "Accepted",
    runtime: "76 ms",
    memory: "42.4 MB",
    timestamp: "2023-03-20T15:30:00Z",
    testCases: {
      passed: 29,
      total: 29
    }
  },
  {
    id: "s2",
    problemId: "p3",
    problemTitle: "Add Two Numbers",
    userId: "1",
    language: "python",
    code: "def addTwoNumbers(l1, l2):\n    dummy = ListNode(0)\n    current = dummy\n    carry = 0\n    \n    while l1 or l2 or carry:\n        x = l1.val if l1 else 0\n        y = l2.val if l2 else 0\n        \n        sum = x + y + carry\n        carry = sum // 10\n        \n        current.next = ListNode(sum % 10)\n        current = current.next\n        \n        if l1: l1 = l1.next\n        if l2: l2 = l2.next\n    \n    return dummy.next",
    status: "Accepted",
    runtime: "68 ms",
    memory: "14.2 MB",
    timestamp: "2023-03-18T10:15:00Z",
    testCases: {
      passed: 1568,
      total: 1568
    }
  }
];

export const submitSolution = async (submission: Omit<Submission, 'id' | 'timestamp' | 'status' | 'runtime' | 'memory' | 'testCases'>): Promise<Submission> => {
  return new Promise(resolve => {
    // Simulate backend validation and testing
    const problem = mockProblems.find(p => p.id === submission.problemId);
    const isCorrect = Math.random() > 0.3; // 70% chance of success
    
    const newSubmission: Submission = {
      id: `s${Date.now()}`,
      ...submission,
      status: isCorrect ? "Accepted" : "Wrong Answer",
      runtime: isCorrect ? `${Math.floor(Math.random() * 100 + 50)} ms` : undefined,
      memory: isCorrect ? `${(Math.random() * 50 + 10).toFixed(1)} MB` : undefined,
      timestamp: new Date().toISOString(),
      testCases: {
        passed: isCorrect ? problem?.examples.length || 0 : Math.floor(Math.random() * (problem?.examples.length || 1)),
        total: problem?.examples.length || 0
      }
    };
    
    setTimeout(() => resolve(newSubmission), 1500);
  });
};

export const compileAndRun = async (request: CompileRequest): Promise<CompileResponse> => {
  return new Promise(resolve => {
    // Simulate compiler output
    const hasError = Math.random() > 0.8; // 20% chance of error
    
    if (hasError) {
      setTimeout(() => resolve({
        output: "",
        error: `Compilation error in ${request.language}:\nSyntax error`,
        success: false
      } as CompileResponse), 1000);
    } else {
      // Simulate successful execution
      const output = `Running ${request.language} code...\n> Program executed successfully!\n> Output:\n${request.code.length % 2 === 0 ? "Even" : "Odd"} number of characters in your code.`;
      
      setTimeout(() => resolve({
        output,
        error: undefined,
        success: true,
        execution_time: Math.floor(Math.random() * 500)
      } as CompileResponse), 1000);
    }
  });
};
