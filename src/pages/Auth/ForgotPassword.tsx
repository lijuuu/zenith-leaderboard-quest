
import { useState } from "react";
import { Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      // In a real application, this would call an API to send a password reset email
      // For mock purposes, we'll just simulate success
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast({
        title: "Password reset email sent",
        description: "Check your inbox for further instructions.",
      });
      
      setIsSubmitted(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to send reset email",
        description: "An error occurred. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="animate-page-in min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-zinc-300/20 via-white to-white dark:from-zinc-800/20 dark:via-zinc-900 dark:to-zinc-900 foggy-grain">
      <Navbar isAuthenticated={false} />

      <main className="flex-grow pt-24 pb-16">
        <div className="page-container">
          <div className="max-w-md mx-auto">
            <div className="mb-8 text-center">
              <h1 className="text-3xl font-bold font-display tracking-tight mb-2">
                Forgot Password
              </h1>
              <p className="text-muted-foreground">
                Enter your email to receive a password reset link
              </p>
            </div>

            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 p-6 shadow-sm">
              {isSubmitted ? (
                <div className="text-center py-4">
                  <div className="mb-4 flex justify-center">
                    <Mail className="h-12 w-12 text-accent-color" />
                  </div>
                  <h2 className="text-xl font-medium mb-2">Check your email</h2>
                  <p className="text-muted-foreground mb-4">
                    We've sent a password reset link to your email address.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => setIsSubmitted(false)}
                  >
                    Try a different email
                  </Button>
                </div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder="example@email.com"
                                className="pl-10"
                                {...field}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full accent-color"
                      disabled={isLoading}
                    >
                      {isLoading ? "Sending..." : "Send reset link"}
                    </Button>
                  </form>
                </Form>
              )}

              <div className="mt-6 text-center text-sm">
                <p className="text-muted-foreground">
                  Remember your password?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-foreground hover:underline"
                  >
                    Back to login
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
