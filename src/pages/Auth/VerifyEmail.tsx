
import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppSelector";
import { verifyEmail } from "@/store/slices/authSlice";
import { motion } from "framer-motion";
import Loader1 from "@/components/ui/loader1";

const VerifyEmail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useAppDispatch();

  const { loading, successMessage, error, isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    // Extract email and token from URL query parameters
    const queryParams = new URLSearchParams(location.search);
    const email = queryParams.get("email");
    const token = queryParams.get("token");
    
    if (!email || !token) {
      toast.error("Invalid verification link", { 
        style: { background: "#1D1D1D", color: "#FFFFFF" } 
      });
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    // Dispatch verifyEmail thunk with email and token
    dispatch(verifyEmail({ email, token }) as any);
  }, [dispatch, location.search, navigate]);

  useEffect(() => {
    if (successMessage && !loading) {
      toast.success(successMessage, { 
        style: { background: "#1D1D1D", color: "#3CE7B2" },
        duration: 2000 
      });
      setTimeout(() => navigate("/login"), 2000);
    }
    
    if (error && !loading) {
      toast.error(error.message || "Verification failed", { 
        style: { background: "#1D1D1D", color: "#FFFFFF" },
        duration: 3000 
      });
    }
  }, [successMessage, error, loading, navigate, isAuthenticated]);

  if (!location.search.includes("email=") || !location.search.includes("token=")) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] px-4 text-center">
        <h1 className="text-3xl font-bold text-white mb-4 font-coinbase-display">
          Invalid Verification Link
        </h1>
        <p className="text-gray-400 mb-6 font-coinbase-sans max-w-md">
          The verification link appears to be missing required parameters.
          Please check your email for a valid verification link.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="px-6 py-2 bg-[#3CE7B2] text-[#121212] rounded-md hover:bg-[#27A98B] transition-colors duration-200 font-coinbase-sans"
        >
          Back to Login
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#121212] px-4 text-center">
      {loading ? (
        <div className="space-y-6">
          <Loader1 className="w-16 h-16 mx-auto text-[#3CE7B2] mr-10" />
          <h1 className="text-3xl font-bold text-white mb-2 font-coinbase-display">
            Verifying Your Email
          </h1>
          <p className="text-gray-400 font-coinbase-sans max-w-md">
            Please wait while we verify your email address...
          </p>
        </div>
      ) : error ? (
        <div className="space-y-4">
          <h1 className="text-3xl font-bold text-white mb-2 font-coinbase-display">
            Verification Failed
          </h1>
          <p className="text-gray-400 mb-6 font-coinbase-sans max-w-md">
            {error.message || "We couldn't verify your email. The link may be expired or invalid."}
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-[#3CE7B2] text-[#121212] rounded-md hover:bg-[#27A98B] transition-colors duration-200 font-coinbase-sans"
          >
            Back to Login
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 0.8, repeat: Infinity, repeatType: "reverse" }}
            className="text-[#3CE7B2] text-7xl mb-6"
          >
            ✓
          </motion.div>
          <h1 className="text-3xl font-bold text-white mb-2 font-coinbase-display">
            Email Verified!
          </h1>
          <p className="text-gray-400 mb-6 font-coinbase-sans max-w-md">
            Your email has been successfully verified. You'll be redirected to the login page shortly.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 bg-[#3CE7B2] text-[#121212] rounded-md hover:bg-[#27A98B] transition-colors duration-200 font-coinbase-sans"
          >
            Login Now
          </button>
        </div>
      )}
    </div>
  );
};

export default VerifyEmail;
