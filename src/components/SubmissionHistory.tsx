
import { useState } from 'react';
import { format } from 'date-fns';
import { Check, X, ChevronRight, Code, Clock, Calendar } from 'lucide-react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

// Sample submission data
const sampleSubmissions = [
  {
    id: 1,
    problemId: 'two-sum',
    problemTitle: 'Two Sum',
    language: 'javascript',
    status: 'Accepted',
    runtime: '68ms',
    memory: '42.5MB',
    date: new Date(2023, 6, 15, 14, 30),
    code: `function twoSum(nums, target) {
  const map = {};
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map[complement] !== undefined) {
      return [map[complement], i];
    }
    map[nums[i]] = i;
  }
}`,
  },
  {
    id: 2,
    problemId: 'valid-parentheses',
    problemTitle: 'Valid Parentheses',
    language: 'python',
    status: 'Wrong Answer',
    runtime: '32ms',
    memory: '14.2MB',
    date: new Date(2023, 6, 14, 10, 15),
    code: `def isValid(s):
    stack = []
    mapping = {")": "(", "}": "{", "]": "["}
    for char in s:
        if char in mapping:
            top_element = stack.pop() if stack else '#'
            if mapping[char] != top_element:
                return False
        else:
            stack.append(char)
    return not stack`,
  },
  {
    id: 3,
    problemId: 'merge-two-sorted-lists',
    problemTitle: 'Merge Two Sorted Lists',
    language: 'java',
    status: 'Time Limit Exceeded',
    runtime: '500ms',
    memory: '39.5MB',
    date: new Date(2023, 6, 13, 9, 45),
    code: `public ListNode mergeTwoLists(ListNode l1, ListNode l2) {
    if (l1 == null) return l2;
    if (l2 == null) return l1;
    if (l1.val < l2.val) {
        l1.next = mergeTwoLists(l1.next, l2);
        return l1;
    } else {
        l2.next = mergeTwoLists(l1, l2.next);
        return l2;
    }
}`,
  },
  {
    id: 4,
    problemId: 'fibonacci-number',
    problemTitle: 'Fibonacci Number',
    language: 'cpp',
    status: 'Accepted',
    runtime: '0ms',
    memory: '5.9MB',
    date: new Date(2023, 6, 12, 16, 20),
    code: `int fib(int n) {
    if (n <= 1) return n;
    
    int prev1 = 1;
    int prev2 = 0;
    int current;
    
    for (int i = 2; i <= n; i++) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    
    return prev1;
}`,
  },
  {
    id: 5,
    problemId: 'reverse-linked-list',
    problemTitle: 'Reverse Linked List',
    language: 'typescript',
    status: 'Accepted',
    runtime: '72ms',
    memory: '44.9MB',
    date: new Date(2023, 6, 11, 11, 5),
    code: `function reverseList(head: ListNode | null): ListNode | null {
    let prev: ListNode | null = null;
    let current: ListNode | null = head;
    
    while (current !== null) {
        const next = current.next;
        current.next = prev;
        prev = current;
        current = next;
    }
    
    return prev;
};`,
  },
];

interface SubmissionHistoryProps {
  userData?: {
    id: string;
    username: string;
  };
}

const SubmissionHistory: React.FC<SubmissionHistoryProps> = ({ userData }) => {
  const [expandedSubmission, setExpandedSubmission] = useState<number | null>(null);
  const [submissions, setSubmissions] = useState(sampleSubmissions);
  const { toast } = useToast();

  const toggleExpand = (id: number) => {
    if (expandedSubmission === id) {
      setExpandedSubmission(null);
    } else {
      setExpandedSubmission(id);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Accepted':
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 flex gap-1 items-center">
            <Check className="h-3 w-3" />
            Accepted
          </Badge>
        );
      case 'Wrong Answer':
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100 flex gap-1 items-center">
            <X className="h-3 w-3" />
            Wrong Answer
          </Badge>
        );
      case 'Time Limit Exceeded':
        return (
          <Badge className="bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-100 flex gap-1 items-center">
            <Clock className="h-3 w-3" />
            TLE
          </Badge>
        );
      default:
        return (
          <Badge className="bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100">
            {status}
          </Badge>
        );
    }
  };

  const getLanguageBadge = (language: string) => {
    const colors: Record<string, string> = {
      javascript: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      python: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
      java: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      cpp: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
      typescript: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
    };

    return (
      <Badge className={cn("font-mono lowercase", colors[language] || "bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-100")}>
        {language}
      </Badge>
    );
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Submission History</h2>
        <Button 
          variant="outline" 
          size="sm"
          className="text-xs"
        >
          View All
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Problem</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Language</TableHead>
              <TableHead>Runtime</TableHead>
              <TableHead>Memory</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="w-[60px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {submissions.map((submission) => (
              <>
                <TableRow 
                  key={submission.id}
                  className={cn(
                    "hover:bg-zinc-50 dark:hover:bg-zinc-900/50 cursor-pointer transition-colors",
                    expandedSubmission === submission.id && "bg-zinc-50 dark:bg-zinc-900/50"
                  )}
                  onClick={() => toggleExpand(submission.id)}
                >
                  <TableCell className="font-medium">{submission.problemTitle}</TableCell>
                  <TableCell>{getStatusBadge(submission.status)}</TableCell>
                  <TableCell>{getLanguageBadge(submission.language)}</TableCell>
                  <TableCell>{submission.runtime}</TableCell>
                  <TableCell>{submission.memory}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      {format(submission.date, 'MMM dd, yyyy')}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={cn(
                        "h-8 w-8 transition-transform",
                        expandedSubmission === submission.id && "rotate-90"
                      )}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
                
                {expandedSubmission === submission.id && (
                  <TableRow className="bg-zinc-50 dark:bg-zinc-900/50">
                    <TableCell colSpan={7} className="p-0">
                      <div className="p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Code className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">Solution Code</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigator.clipboard.writeText(submission.code);
                              toast({
                                title: "Code copied to clipboard",
                                description: "You can now paste it in your editor",
                              });
                            }}
                          >
                            Copy Code
                          </Button>
                        </div>
                        <pre className="p-4 bg-zinc-100 dark:bg-zinc-900 rounded-lg overflow-x-auto text-sm font-mono">
                          {submission.code}
                        </pre>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default SubmissionHistory;
