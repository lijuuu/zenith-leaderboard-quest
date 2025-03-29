
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { loginUser, clearAuthState, setAuthLoading } from "@/store/slices/authSlice";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppSelector";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import Cookies from "js-cookie";
import Loader1 from "@/components/ui/loader1";
import SimpleHeader from "@/components/sub/AuthHeader";
import axiosInstance from "@/axios/axiosInstance";
import { handleError, handleInfo } from "@/components/sub/ErrorToast";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

// Loader Overlay Component
const LoaderOverlay: React.FC<{ onCancel: () => void }> = ({ onCancel }) => (
  <div className="absolute inset-0 flex flex-col items-center justify-center bg-zinc-950 bg-opacity-95 z-50">
    <Loader1 className="w-12 h-12 mr-10 text-green-500" />
    <div className="text-white text-xl opacity-80 font-medium mt-24">
      Logging in...
    </div>
    <button
      onClick={onCancel}
      className="text-gray-400 text-sm mt-4 underline hover:text-green-500 transition-colors duration-200"
    >
      Cancel
    </button>
  </div>
);

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const { error, loading, userProfile, successMessage, isAuthenticated } = 
    useAppSelector((state) => state.auth);

  const loginSchema = z.object({
    email: z.string().min(1, "Email is required").email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    code: twoFactorEnabled
      ? z.string().min(6, "Code must be 6 characters").max(6, "Code must be 6 characters")
      : z.string().optional(),
  });

  type LoginFormData = z.infer<typeof loginSchema>;

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      code: '',
    },
  });

  const { watch } = form;
  const formEmail = watch("email");

  const onSubmit = (data: LoginFormData) => {
    console.log("Form Data:", data);
    if (rememberMe) {
      localStorage.setItem("rememberedEmail", data.email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }
    dispatch(loginUser(data));
  };

  // Check for 2FA status when email changes
  useEffect(() => {
    if (formEmail && formEmail.includes("@") && formEmail.includes(".")) {
      axiosInstance
        .get(`/auth/2fa/status?email=${formEmail}`)
        .then((res) => {
          setTwoFactorEnabled(res.data.payload.isEnabled);
        })
        .catch(() => {
          setTwoFactorEnabled(false);
        });
    } else {
      setTwoFactorEnabled(false);
    }
  }, [formEmail]);

  // Handle authentication state changes
  useEffect(() => {
    if (isAuthenticated && userProfile?.isVerified && !loading && !error) {
      navigate("/dashboard");
      toast.success(successMessage || "Login successful!", { 
        style: { background: "#1D1D1D", color: "#3CE7B2" } 
      });
    } else if (error && !loading) {
      if (error?.type === "ERR_LOGIN_NOT_VERIFIED") {
        Cookies.set("emailtobeverified", formEmail);
        navigate("/verify-email");
        handleInfo(error);
      } else {
        handleError(error);
      }
      dispatch(clearAuthState());
    }
  }, [error, loading, userProfile, isAuthenticated, successMessage, formEmail, dispatch, navigate]);

  // Check for existing session on mount
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    
    if (rememberedEmail) {
      form.setValue("email", rememberedEmail);
      setRememberMe(true);
    }
    
    if (accessToken) {
      navigate("/dashboard");
      toast.success("Already logged in!", { 
        style: { background: "#1D1D1D", color: "#3CE7B2" } 
      });
    }
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-zinc-950 text-white">
      <div className="bg-green-500 h-2 w-full" />
      <SimpleHeader page="/signup" name="Sign Up" />
      <div className="flex justify-center items-center flex-1 px-4">
        {loading && <LoaderOverlay onCancel={() => dispatch(setAuthLoading(false))} />}
        <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl shadow-lg p-6 hover:border-zinc-700 transition-all duration-300">
          <div className="space-y-1">
            <h2 className="text-2xl text-center font-bold text-white">
              Login to your account
            </h2>
            <p className="text-zinc-400 text-center text-sm">
              Enter your email below to login to your account
            </p>
          </div>
          
          <div className="pt-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="email@example.com"
                          className="bg-zinc-800 border-zinc-700 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-green-500" />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex justify-between items-center">
                        <FormLabel>Password</FormLabel>
                        <a
                          href="/forgot-password"
                          className="text-xs text-zinc-400 hover:text-green-500 transition-colors duration-200"
                        >
                          Forgot password?
                        </a>
                      </div>
                      <FormControl>
                        <Input
                          type="password"
                          className="bg-zinc-800 border-zinc-700 text-white"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-green-500" />
                    </FormItem>
                  )}
                />

                {twoFactorEnabled && (
                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Two-Factor Authentication Code</FormLabel>
                        <div className="mt-1 text-center text-xs mb-2 text-zinc-400">
                          <p>Please enter the code from your authenticator app.</p>
                        </div>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter 6-digit code"
                            className="bg-zinc-800 border-zinc-700 text-white"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-green-500" />
                      </FormItem>
                    )}
                  />
                )}

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="remember-me" 
                    checked={rememberMe}
                    onCheckedChange={(checked) => setRememberMe(checked as boolean)}
                  />
                  <label
                    htmlFor="remember-me"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-zinc-300"
                  >
                    Remember me
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full bg-green-500 text-zinc-900 hover:bg-green-600 py-3 rounded-md transition-colors duration-200"
                  disabled={loading}
                >
                  {loading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>

            <div className="mt-4 text-center text-xs text-zinc-500">OR</div>
            
            <div className="mt-4 space-y-3">
              <Button
                type="button"
                className="w-full h-11 bg-zinc-800 text-white hover:bg-green-500 hover:text-zinc-900 rounded-md flex items-center justify-center transition-all duration-200"
              >
                Sign in with Google
              </Button>
              <Button
                type="button"
                className="w-full h-11 bg-zinc-800 text-white hover:bg-green-500 hover:text-zinc-900 rounded-md flex items-center justify-center transition-all duration-200"
              >
                Sign in with GitHub
              </Button>
            </div>

            <div className="mt-4 text-center text-sm text-zinc-400">
              <span>Don't have an account? </span>
              <button
                type="button"
                onClick={() => navigate("/signup")}
                className="text-green-500 underline underline-offset-4 hover:text-green-400 transition-colors duration-200"
              >
                Sign up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
