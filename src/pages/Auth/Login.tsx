
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppSelector";
import { loginUser, setAuthLoading } from "@/store/slices/authSlice";
import Cookies from "js-cookie";
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
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import Footer from "@/components/Footer";
import Loader1 from "@/components/ui/loader1";
import SimpleHeader from "@/components/sub/AuthHeader";

// --- Loader Overlay Component ---
const LoaderOverlay: React.FC<{ onCancel: () => void }> = ({ onCancel }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121212] bg-opacity-95 z-50">
    <Loader1 className="w-12 h-12 mr-10 text-[#3CE7B2]" />
    <div className="text-white text-xl opacity-80 font-coinbase-sans mt-24">
      Logging in...
    </div>
    <button
      onClick={onCancel}
      className="text-gray-400 text-sm font-coinbase-sans mt-4 underline hover:text-[#3CE7B2] transition-colors duration-200"
    >
      Cancel
    </button>
  </div>
);

const formSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  code: z.string().optional(),
  rememberMe: z.boolean().default(false),
});

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { error, loading, userProfile, successMessage, isAuthenticated } = useAppSelector((state) => state.auth);

  // Check if already authenticated
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  // Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      code: "",
      rememberMe: false,
    },
  });

  // Watch email to check for 2FA
  const email = form.watch("email");

  // Check if 2FA is enabled for this email
  useEffect(() => {
    if (email && email.includes("@") && email.includes(".")) {
      const check2FA = async () => {
        try {
          const response = await fetch(`http://localhost:7000/api/v1/auth/2fa/status?email=${email}`);
          const data = await response.json();
          setTwoFactorEnabled(data.payload.isEnabled);
        } catch (err) {
          setTwoFactorEnabled(false);
        }
      };
      check2FA();
    }
  }, [email]);

  // Handle auth state and navigation
  useEffect(() => {
    if (isAuthenticated && userProfile?.isVerified && !loading) {
      navigate("/dashboard");
      toast.success(successMessage || "Login successful!", { 
        style: { background: "#1D1D1D", color: "#3CE7B2" } 
      });
    } else if (error && !loading) {
      if (error?.type === "ERR_LOGIN_NOT_VERIFIED") {
        Cookies.set("emailtobeverified", email);
        navigate("/verify-info");
      } else {
        toast.error(error.message || "An error occurred", { 
          style: { background: "#1D1D1D", color: "#FFFFFF" } 
        });
      }
    }
  }, [error, loading, userProfile, isAuthenticated, successMessage, navigate]);

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    dispatch(loginUser({
      email: data.email,
      password: data.password,
      code: data.code
    }));
  };

  return (
    <div className="min-h-screen bg-[#121212] text-white">
      <div className="bg-[#3CE7B2] h-2" style={{ width: "100%" }} />
      <SimpleHeader page="/signup" name="Sign Up" />

      <main className="flex-grow pt-24 pb-16">
        <div className="max-w-md mx-auto px-4">
          {loading && <LoaderOverlay onCancel={() => dispatch(setAuthLoading(false))} />}
          
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold font-coinbase-display tracking-tight mb-2">
              Login to your account
            </h1>
            <p className="text-gray-400 font-coinbase-sans">
              Enter your credentials to access your account
            </p>
          </div>

          <div className="bg-[#1D1D1D] border border-[#2C2C2C] rounded-xl p-6 shadow-lg hover:border-gray-700 transition-all duration-300">
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

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel className="text-white font-coinbase-sans">Password</FormLabel>
                        <Link
                          to="/forgot-password"
                          className="text-sm text-gray-400 hover:text-[#3CE7B2] transition-colors duration-200"
                        >
                          Forgot password?
                        </Link>
                      </div>
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

                {twoFactorEnabled && (
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white font-coinbase-sans">2FA Code</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter 6-digit code from your authenticator app"
                            className="bg-[#2C2C2C] border border-[#2C2C2C] text-white placeholder:text-gray-500 focus:border-[#3CE7B2] focus:ring-[#3CE7B2]"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-[#3CE7B2]" />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="rememberMe"
                  render={({ field }) => (
                    <FormItem className="flex items-start space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-[#3CE7B2] data-[state=checked]:border-[#3CE7B2]"
                        />
                      </FormControl>
                      <FormLabel className="text-sm text-gray-400 font-coinbase-sans cursor-pointer">
                        Remember me for 30 days
                      </FormLabel>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full bg-[#3CE7B2] text-[#121212] hover:bg-[#27A98B] py-3 rounded-md transition-colors duration-200 font-coinbase-sans"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>

            <div className="mt-6 text-center text-sm">
              <p className="text-gray-400 font-coinbase-sans">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="font-medium text-white hover:text-[#3CE7B2] hover:underline transition-colors"
                >
                  Sign up now
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

export default Login;
