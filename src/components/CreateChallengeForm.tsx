
import { useState, useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { 
  Loader2, 
  ListChecks, 
  Shuffle,
  Clock, 
  Users,
  Eye,
  EyeOff,
  Plus,
  Lock,
  Unlock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CreateChallengeOptions, createChallenge } from "@/api/challengeApi";
import { getProblems } from "@/api/problemApi";
import { Problem } from "@/api/types";

const formSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(50, "Title must be at most 50 characters"),
  difficulty: z.enum(["Easy", "Medium", "Hard"]),
  selectionType: z.enum(["manual", "random"]),
  problemCount: z.number().min(1).max(10),
  timeLimit: z.number().min(10).max(120),
  isPrivate: z.boolean().default(false),
  selectedProblems: z.array(z.string()).optional(),
});

type ChallengeFormValues = z.infer<typeof formSchema>;

interface CreateChallengeFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (challenge: any) => void;
}

const CreateChallengeForm: React.FC<CreateChallengeFormProps> = ({ isOpen, onClose, onSuccess }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [problems, setProblems] = useState<Problem[]>([]);
  const [problemsLoading, setProblemsLoading] = useState(false);
  const [randomProblems, setRandomProblems] = useState<Problem[]>([]);
  
  const form = useForm<ChallengeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      difficulty: "Medium",
      selectionType: "manual",
      problemCount: 3,
      timeLimit: 30,
      isPrivate: false,
      selectedProblems: [],
    },
  });
  
  const watchSelectionType = form.watch("selectionType");
  const watchDifficulty = form.watch("difficulty");
  const watchProblemCount = form.watch("problemCount");
  
  // Fixed this: changed useState to useEffect
  useEffect(() => {
    const loadProblems = async () => {
      setProblemsLoading(true);
      try {
        const data = await getProblems({ difficulty: watchDifficulty });
        setProblems(data);
      } catch (error) {
        console.error("Failed to load problems:", error);
        toast({
          title: "Error",
          description: "Failed to load problems. Please try again.",
          variant: "destructive",
        });
      } finally {
        setProblemsLoading(false);
      }
    };
    
    if (isOpen) {
      loadProblems();
    }
  }, [isOpen, watchDifficulty, toast]);
  
  // Fixed this: changed useState to useEffect
  useEffect(() => {
    if (watchSelectionType === "random" && problems.length > 0) {
      generateRandomProblems();
    }
  }, [watchSelectionType, watchDifficulty, watchProblemCount, problems]);
  
  const generateRandomProblems = () => {
    const filteredProblems = problems.filter(p => p.difficulty === watchDifficulty);
    
    // Shuffle and take the first n problems
    const shuffled = [...filteredProblems].sort(() => 0.5 - Math.random());
    const selected = shuffled.slice(0, watchProblemCount);
    
    setRandomProblems(selected);
  };
  
  const onSubmit = async (data: ChallengeFormValues) => {
    setLoading(true);
    
    try {
      let problemIds: string[] = [];
      
      if (data.selectionType === "manual") {
        problemIds = data.selectedProblems || [];
      } else {
        problemIds = randomProblems.map(p => p.id);
      }
      
      if (problemIds.length === 0) {
        toast({
          title: "Error",
          description: "Please select at least one problem",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }
      
      const challengeData: CreateChallengeOptions = {
        title: data.title,
        difficulty: data.difficulty,
        problemIds,
        isPrivate: data.isPrivate,
        timeLimit: data.timeLimit,
      };
      
      const result = await createChallenge(challengeData);
      
      toast({
        title: "Success",
        description: `Challenge "${result.title}" created successfully!`,
      });
      
      if (onSuccess) {
        onSuccess(result);
      }
      
      onClose();
    } catch (error) {
      console.error("Failed to create challenge:", error);
      toast({
        title: "Error",
        description: "Failed to create challenge. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Challenge</DialogTitle>
          <DialogDescription>
            Create your custom coding challenge to test your skills or compete with friends.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Challenge Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a catchy title for your challenge" {...field} />
                  </FormControl>
                  <FormDescription>
                    This title will be visible to participants.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="difficulty"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select 
                      onValueChange={field.onChange} 
                      defaultValue={field.value}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Easy">Easy</SelectItem>
                        <SelectItem value="Medium">Medium</SelectItem>
                        <SelectItem value="Hard">Hard</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      This affects the types of problems in your challenge.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="timeLimit"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Time Limit (minutes)</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Slider
                          className="flex-1"
                          min={10}
                          max={120}
                          step={5}
                          defaultValue={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                        <span className="min-w-16 text-center bg-zinc-100 dark:bg-zinc-800 rounded-md py-1 px-2">
                          {field.value} min
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      The time participants have to complete the challenge.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <FormField
              control={form.control}
              name="isPrivate"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="flex items-center gap-2">
                      {field.value ? (
                        <>
                          <Lock className="h-4 w-4 text-amber-500" />
                          Private Challenge
                        </>
                      ) : (
                        <>
                          <Unlock className="h-4 w-4 text-green-500" />
                          Public Challenge
                        </>
                      )}
                    </FormLabel>
                    <FormDescription>
                      {field.value 
                        ? "Only users with an access code can join this challenge."
                        : "Anyone can view and participate in this challenge."
                      }
                    </FormDescription>
                  </div>
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="selectionType"
              render={({ field }) => (
                <FormItem className="space-y-3">
                  <FormLabel>Problem Selection</FormLabel>
                  <FormControl>
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className="flex flex-col space-y-1"
                    >
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="manual" id="manual" />
                        <label htmlFor="manual" className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          <ListChecks className="h-4 w-4" />
                          Manual Selection
                        </label>
                      </div>
                      <FormDescription className="ml-6">
                        Handpick specific problems for your challenge.
                      </FormDescription>
                      
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="random" id="random" />
                        <label htmlFor="random" className="flex items-center gap-2 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                          <Shuffle className="h-4 w-4" />
                          Random Selection
                        </label>
                      </div>
                      <FormDescription className="ml-6">
                        Let the system choose random problems based on difficulty.
                      </FormDescription>
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            {watchSelectionType === "random" && (
              <FormField
                control={form.control}
                name="problemCount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Number of Problems</FormLabel>
                    <FormControl>
                      <div className="flex items-center gap-4">
                        <Slider
                          className="flex-1"
                          min={1}
                          max={10}
                          step={1}
                          defaultValue={[field.value]}
                          onValueChange={(vals) => field.onChange(vals[0])}
                        />
                        <span className="min-w-8 text-center bg-zinc-100 dark:bg-zinc-800 rounded-md py-1 px-2">
                          {field.value}
                        </span>
                      </div>
                    </FormControl>
                    <FormDescription>
                      Number of random problems to include.
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}
            
            <Tabs defaultValue={watchSelectionType}>
              <TabsList className="hidden">
                <TabsTrigger value="manual">Manual Selection</TabsTrigger>
                <TabsTrigger value="random">Random Selection</TabsTrigger>
              </TabsList>
              
              <TabsContent value="manual" className={watchSelectionType !== "manual" ? "hidden" : ""}>
                <div className="border rounded-md p-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <ListChecks className="h-4 w-4" />
                    Select Problems
                  </h4>
                  
                  {problemsLoading ? (
                    <div className="flex justify-center py-8">
                      <Loader2 className="h-8 w-8 animate-spin text-zinc-500" />
                    </div>
                  ) : problems.length > 0 ? (
                    <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                      <FormField
                        control={form.control}
                        name="selectedProblems"
                        render={() => (
                          <FormItem>
                            {problems
                              .filter(problem => problem.difficulty === watchDifficulty)
                              .map((problem) => (
                                <FormField
                                  key={problem.id}
                                  control={form.control}
                                  name="selectedProblems"
                                  render={({ field }) => {
                                    return (
                                      <FormItem
                                        key={problem.id}
                                        className="flex flex-row items-start space-x-3 space-y-0 py-2 border-b last:border-0"
                                      >
                                        <FormControl>
                                          <Checkbox
                                            checked={field.value?.includes(problem.id)}
                                            onCheckedChange={(checked) => {
                                              return checked
                                                ? field.onChange([...field.value || [], problem.id])
                                                : field.onChange(
                                                    field.value?.filter(
                                                      (value) => value !== problem.id
                                                    )
                                                  );
                                            }}
                                          />
                                        </FormControl>
                                        <div className="space-y-1 leading-none">
                                          <FormLabel className="font-normal">
                                            {problem.title}
                                          </FormLabel>
                                          <div className="flex items-center gap-2 text-xs text-zinc-500">
                                            <span className={`px-2 py-0.5 rounded-full text-xs ${
                                              problem.difficulty === "Easy"
                                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                                : problem.difficulty === "Medium"
                                                ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                                                : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                            }`}>
                                              {problem.difficulty}
                                            </span>
                                            <span>Acceptance: {problem.acceptanceRate.toFixed(1)}%</span>
                                          </div>
                                        </div>
                                      </FormItem>
                                    );
                                  }}
                                />
                              ))}
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  ) : (
                    <div className="text-center py-8 text-zinc-500">
                      No problems found for this difficulty level.
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="random" className={watchSelectionType !== "random" ? "hidden" : ""}>
                <div className="border rounded-md p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-medium flex items-center gap-2">
                      <Shuffle className="h-4 w-4" />
                      Random Problems
                    </h4>
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="sm"
                      onClick={generateRandomProblems}
                    >
                      <Shuffle className="h-3 w-3 mr-2" />
                      Shuffle
                    </Button>
                  </div>
                  
                  {randomProblems.length > 0 ? (
                    <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                      {randomProblems.map((problem, index) => (
                        <div 
                          key={problem.id}
                          className="flex justify-between items-center p-2 border rounded-md"
                        >
                          <div className="flex items-center gap-2">
                            <span className="h-6 w-6 flex items-center justify-center bg-zinc-100 dark:bg-zinc-800 rounded-full text-xs">
                              {index + 1}
                            </span>
                            <span>{problem.title}</span>
                          </div>
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            problem.difficulty === "Easy"
                              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                              : problem.difficulty === "Medium"
                              ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                              : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                          }`}>
                            {problem.difficulty}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-zinc-500">
                      No problems generated yet.
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Create Challenge
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateChallengeForm;
