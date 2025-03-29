
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppSelector";
import { resendEmail, setAuthLoading } from "@/store/slices/authSlice";
import Cookies from "js-cookie";
import { motion } from "framer-motion";
import Loader1 from "@/components/ui/loader1";
import { Mail } from "lucide-react";

const VerifyInfo = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [emailToVerify, setEmailToVerify] = useState("");

  const { successMessage, error, expiryAt, loading } = useAppSelector((state) => state.auth);

  // Set email from cookie on mount
  useEffect(() => {
    const email = Cookies.get("emailtobeverified");
    if (!email) {
      navigate("/login");
    } else {
      setEmailToVerify(email);
    }
  }, [navigate]);

  // Update remaining time based on expiryAt
  useEffect(() => {
    if (expiryAt) {
      const updateCountdown = () => {
        const currentTime = Math.floor(Date.now() / 1000);
        const timeLeft = expiryAt - currentTime;
        setRemainingTime(timeLeft > 0 ? timeLeft : 0);
      };

      updateCountdown();
      const interval = setInterval(updateCountdown, 1000);
      return () => clearInterval(interval);
    }
  }, [expiryAt]);

  // Handle success and error messages
  useEffect(() => {
    if (successMessage && !loading) {
      toast.success(successMessage, { 
        style: { background: "#1D1D1D", color: "#3CE7B2" } 
      });
    }
    
    if (error && !loading) {
      toast.error(error.message || "Failed to send email", { 
        style: { background: "#1D1D1D", color: "#FFFFFF" } 
      });
    }
  }, [successMessage, error, loading]);

  const handleResendEmail = () => {
    if (emailToVerify) {
      dispatch(resendEmail({ email: emailToVerify }) as any);
    }
  };

  // Redirect if already authenticated
  useEffect(() => {
    const accessToken = Cookies.get("accessToken");
    if (accessToken) {
      navigate("/dashboard");
    }
  }, [navigate]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <div className="min-h-screen bg-[#121212] flex flex-col items-center justify-center px-4 relative">
      {loading && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#121212] bg-opacity-95 z-50">
          <Loader1 className="w-12 h-12 mr-10 text-[#3CE7B2]" />
          <div className="text-white text-xl opacity-80 font-coinbase-sans mt-24">
            Sending verification email...
          </div>
          <button
            onClick={() => dispatch(setAuthLoading(false))}
            className="text-gray-400 text-sm font-coinbase-sans mt-4 underline hover:text-[#3CE7B2] transition-colors duration-200"
          >
            Cancel
          </button>
        </div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-[#1D1D1D] border border-[#2C2C2C] rounded-xl p-8 text-center shadow-lg hover:border-gray-700 transition-all duration-300"
      >
        <div className="mb-6 mx-auto w-20 h-20 rounded-full bg-[#2C2C2C] flex items-center justify-center">
          <Mail className="h-10 w-10 text-[#3CE7B2]" />
        </div>
        
        <h1 className="text-3xl font-bold text-white mb-4 font-coinbase-display">
          Verify Your Email
        </h1>
        
        <p className="text-gray-400 mb-2 font-coinbase-sans">
          We've sent a verification link to:
        </p>
        
        <p className="text-white text-lg mb-4 font-medium font-coinbase-sans break-all">
          {emailToVerify}
        </p>
        
        <p className="text-gray-400 mb-6 text-sm font-coinbase-sans">
          Check your inbox and click the verification link to complete your registration.
        </p>

        {remainingTime !== null && remainingTime > 0 ? (
          <p className="text-gray-400 mb-6 font-coinbase-sans">
            You can resend the email in <span className="text-[#3CE7B2] font-medium">{formatTime(remainingTime)}</span>
          </p>
        ) : (
          <button
            className="px-6 py-2 bg-[#3CE7B2] text-[#121212] rounded-md hover:bg-[#27A98B] transition-colors duration-200 font-coinbase-sans w-full"
            onClick={handleResendEmail}
            disabled={loading}
          >
            Resend Verification Email
          </button>
        )}
        
        <div className="mt-6 flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-4 text-sm font-coinbase-sans">
          <button
            onClick={() => navigate("/login")}
            className="text-gray-400 hover:text-[#3CE7B2] transition-colors duration-200"
          >
            Back to Login
          </button>
          
          <button
            onClick={() => window.open("https://mail.google.com", "_blank")}
            className="text-gray-400 hover:text-[#3CE7B2] transition-colors duration-200"
          >
            Open Gmail
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyInfo;
