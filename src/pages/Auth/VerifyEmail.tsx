import { useState } from "react";
import { Link } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Mail, CheckCircle2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const VerifyEmail = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isVerified, setIsVerified] = useState(false);
  const [otp, setOtp] = useState("");
  const { toast } = useToast();

  const handleVerify = async () => {
    if (otp.length !== 6) {
      toast({
        variant: "destructive",
        title: "Invalid code",
        description: "Please enter the complete 6-digit code.",
      });
      return;
    }

    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Email verified",
        description: "Your email has been successfully verified.",
      });
      setIsVerified(true);
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Verification failed",
        description: "Invalid verification code. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsLoading(true);
      await new Promise((resolve) => setTimeout(resolve, 1000));
      toast({
        title: "Code resent",
        description: "A new verification code has been sent to your email.",
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Failed to resend code",
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
                Verify Your Email
              </h1>
              <p className="text-muted-foreground">
                We've sent a verification code to your email
              </p>
            </div>

            <div className="bg-white/80 dark:bg-zinc-900/80 backdrop-blur-lg rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 p-6 shadow-sm">
              {isVerified ? (
                <div className="text-center py-4">
                  <div className="mb-4 flex justify-center">
                    <CheckCircle2 className="h-12 w-12 text-accent-color" />
                  </div>
                  <h2 className="text-xl font-medium mb-2">Email Verified</h2>
                  <p className="text-muted-foreground mb-4">
                    Your email has been successfully verified.
                  </p>
                  <Button className="accent-color mt-2" asChild>
                    <Link to="/">Continue to Homepage</Link>
                  </Button>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex justify-center mb-2">
                    <Mail className="h-10 w-10 text-accent-color" />
                  </div>

                  <div className="text-center mb-4">
                    <p className="text-sm text-muted-foreground">
                      Enter the 6-digit code sent to your email address
                    </p>
                  </div>

                  <div className="flex justify-center">
                    <InputOTP
                      maxLength={6}
                      value={otp}
                      onChange={(value) => setOtp(value)}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </div>

                  <Button
                    onClick={handleVerify}
                    className="w-full accent-color"
                    disabled={isLoading || otp.length !== 6}
                  >
                    {isLoading ? "Verifying..." : "Verify Email"}
                  </Button>

                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">
                      Didn't receive a code?{" "}
                      <button
                        type="button"
                        onClick={handleResendCode}
                        className="font-medium text-foreground hover:underline"
                        disabled={isLoading}
                      >
                        Resend code
                      </button>
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default VerifyEmail;