
import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff, Lock } from "lucide-react";
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
        Resetting password...
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

const formSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{6,}$/,
        "Password must have uppercase, lowercase, number, and special character"
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const ResetPassword = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(true);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  // Check if user is already logged in or if token/email is missing
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    
    if (accessToken) {
      navigate("/dashboard");
      return;
    }
    
    if (!token || !email) {
      setIsTokenValid(false);
      toast.error("Invalid or expired reset link", {
        style: { background: "#1D1D1D", color: "#FFFFFF" },
      });
    }
  }, [navigate, token, email]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!isTokenValid || !token || !email) {
      toast.error("Invalid reset link", {
        style: { background: "#1D1D1D", color: "#FFFFFF" },
      });
      return;
    }
    
    try {
      setIsLoading(true);
      
      const response = await axiosInstance.post("/auth/password/reset", {
        email,
        token,
        newPassword: values.password,
        confirmPassword: values.confirmPassword,
      });
      
      toast.success("Password reset successful", {
        style: { background: "#1D1D1D", color: "#3CE7B2" },
      });
      
      setTimeout(() => navigate("/login"), 2000);
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.error?.message || "Failed to reset password. Please try again.";
      
      toast.error(errorMessage, {
        style: { background: "#1D1D1D", color: "#FFFFFF" },
      });
      console.error("Reset password error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="bg-[#3CE7B2] h-2" style={{ width: "100%" }} />
      <SimpleHeader page="/login" name="Login" />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-md mx-auto px-4">
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold font-coinbase-display tracking-tight mb-2">
              Reset Password
            </h1>
            <p className="text-gray-400 font-coinbase-sans">
              Create a new password for your account
            </p>
          </div>

          <div className="bg-[#1D1D1D] border border-[#2C2C2C] rounded-xl p-6 shadow-lg hover:border-gray-700 transition-all duration-300">
            {isLoading && <LoaderOverlay onCancel={() => setIsLoading(false)} />}
            
            {!isTokenValid ? (
              <div className="text-center py-4">
                <div className="mb-4 flex justify-center">
                  <Lock className="h-12 w-12 text-[#3CE7B2]" />
                </div>
                <h2 className="text-xl font-medium mb-2 font-coinbase-display">Invalid Reset Link</h2>
                <p className="text-gray-400 mb-4 font-coinbase-sans">
                  The password reset link is invalid or has expired.
                </p>
                <Button
                  className="mt-2 bg-[#3CE7B2] text-[#121212] hover:bg-[#27A98B]"
                  onClick={() => navigate("/forgot-password")}
                >
                  Request New Link
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-coinbase-sans">New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              type={showPassword ? "text" : "password"}
                              className="pl-10 bg-[#2C2C2C] border border-[#2C2C2C] text-white placeholder:text-gray-500 focus:border-[#3CE7B2] focus:ring-[#3CE7B2]"
                              {...field}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-3"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-[#3CE7B2]" />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-coinbase-sans">Confirm New Password</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                            <Input
                              type={showConfirmPassword ? "text" : "password"}
                              className="pl-10 bg-[#2C2C2C] border border-[#2C2C2C] text-white placeholder:text-gray-500 focus:border-[#3CE7B2] focus:ring-[#3CE7B2]"
                              {...field}
                            />
                            <button
                              type="button"
                              className="absolute right-3 top-3"
                              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            >
                              {showConfirmPassword ? (
                                <EyeOff className="h-4 w-4 text-gray-400" />
                              ) : (
                                <Eye className="h-4 w-4 text-gray-400" />
                              )}
                            </button>
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
                    {isLoading ? "Resetting password..." : "Reset Password"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ResetPassword;
