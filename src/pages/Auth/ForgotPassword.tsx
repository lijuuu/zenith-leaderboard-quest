
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail } from "lucide-react";
import Cookies from "js-cookie";
import axiosInstance from "@/utils/axiosInstance";
import { toast } from "sonner";
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
import Footer from "@/components/Footer";
import MainNavbar from "@/components/MainNavbar";
import Loader1 from "@/components/ui/loader1";
import SimpleHeader from "@/components/sub/AuthHeader";

// --- Loader Overlay Component ---
const LoaderOverlay: React.FC<{ onCancel: () => void }> = ({ onCancel }) => (
  <div className="absolute inset-0 flex items-center justify-center bg-[#121212] bg-opacity-95 z-50">
    <div className="flex flex-col items-center justify-center space-y-4">
      <Loader1 className="w-12 h-12 text-[#3CE7B2] mr-10 mb-8" />
      <div className="text-white text-xl opacity-80 mt-8 font-coinbase-sans">
        Sending reset link...
      </div>
      <button
        onClick={onCancel}
        className="text-gray-400 text-sm font-coinbase-sans underline hover:text-[#3CE7B2] transition-colors duration-200"
      >
        Cancel
      </button>
    </div>
  </div>
);

const formSchema = z.object({
  email: z.string().email("Invalid email address"),
});

const ForgotPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  // Check if user is already logged in
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsLoading(true);
      
      const response = await axiosInstance.post(
        `/auth/password/forgot`,
        { email: values.email }
      );
      
      toast.success("Password reset link sent successfully", {
        style: { background: "#1D1D1D", color: "#3CE7B2" },
      });
      
      setIsSubmitted(true);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || "Failed to send reset link. Please try again.";
      
      toast.error(errorMessage, {
        style: { background: "#1D1D1D", color: "#FFFFFF" },
      });
      console.error("Forgot password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="bg-[#3CE7B2] h-2" style={{ width: "100%" }} />
      <SimpleHeader page="/signup" name="Sign Up" />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-md mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold font-coinbase-display tracking-tight mb-2">
              Forgot Password
            </h1>
            <p className="text-gray-400 font-coinbase-sans">
              Enter your email to receive a password reset link
            </p>
          </div>

          <div className="bg-[#1D1D1D] border border-[#2C2C2C] rounded-xl p-6 shadow-lg hover:border-gray-700 transition-all duration-300">
            {isLoading && <LoaderOverlay onCancel={() => setIsLoading(false)} />}
            
            {isSubmitted ? (
              <div className="text-center py-4">
                <div className="mb-4 flex justify-center">
                  <Mail className="h-12 w-12 text-[#3CE7B2]" />
                </div>
                <h2 className="text-xl font-medium mb-2 font-coinbase-display">Check your email</h2>
                <p className="text-gray-400 mb-4 font-coinbase-sans">
                  We've sent a password reset link to your email address.
                </p>
                <Button
                  variant="outline"
                  className="mt-2 border-[#2C2C2C] text-white hover:bg-[#3CE7B2] hover:text-[#121212]"
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
                        <FormLabel className="text-white font-coinbase-sans">Email</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="example@email.com"
                              className="pl-10 bg-[#2C2C2C] border border-[#2C2C2C] text-white placeholder:text-gray-500 focus:border-[#3CE7B2] focus:ring-[#3CE7B2]"
                              {...field}
                            />
                          </div>
                        </FormControl>
                        <FormMessage className="text-[#3CE7B2]" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-[#3CE7B2] text-[#121212] hover:bg-[#27A98B] py-3 rounded-md transition-colors duration-200 font-coinbase-sans"
                    disabled={isLoading}
                  >
                    {isLoading ? "Sending..." : "Send reset link"}
                  </Button>
                </form>
              </Form>
            )}

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-400 font-coinbase-sans">
                Remember your password?{" "}
                <Link
                  to="/login"
                  className="font-medium text-white hover:text-[#3CE7B2] hover:underline transition-colors"
                >
                  Back to login
                </Link>
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
