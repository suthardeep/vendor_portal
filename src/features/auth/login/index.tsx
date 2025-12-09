import React, { useState } from "react";
import { z } from "zod";
import { LoginSchema, LoginFormData } from "./schemas/login.schema";
import { Input } from "@/components/base/Input";
import { Button } from "@/components/base/Button";
import Logo from "@/components/base/Logo";
import { OTPInput } from "@/components/base/OTPInput";
import { toast } from "@/components/toast/Sonner";
import { useNavigate } from "@tanstack/react-router";
import { MobileNumberInput } from "@/components/base/MobileNumberInput";

const Login: React.FC = () => {
  const navigate = useNavigate();

  // --- State ---
  const [step, setStep] = useState<"INPUT_MOBILE" | "INPUT_OTP">("INPUT_MOBILE");
  const [mobileNumber, setMobileNumber] = useState("");
  const [otp, setOtp] = useState("");
  
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- Helpers ---
  const fakeApiCall = async (time?: number) => {
    await new Promise((resolve) => setTimeout(resolve, time ?? 2000));
  };

  // --- Handlers ---

  const handleMobileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setMobileNumber(value);
    if (errors.mobileNumber) {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr.mobileNumber;
        return newErr;
      });
    }
  };

  const handleGetOtp = async () => {
    // 1. Validate Mobile
    const result = LoginSchema.safeParse({ mobileNumber });
    if (!result.success) {
      setErrors({ mobileNumber: result.error.issues[0].message });
      return;
    }

    // 2. API Call
    setIsLoading(true);
    try {
      await fakeApiCall(1500); // Simulate network
      toast.success(`OTP sent to ${mobileNumber}`);
      setStep("INPUT_OTP");
    } catch (error) {
      toast.error("Failed to send OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChangeNumber = () => {
    setStep("INPUT_MOBILE");
    setOtp("");
    setErrors({});
  };

  const handleResendOtp = async () => {
    setIsResending(true);
    try {
      await fakeApiCall(1500);
      toast.success("OTP sent successfully");
    } catch (error) {
      toast.error("Failed to resend OTP");
    } finally {
      setIsResending(false);
    }
  };

  const handleLogin = async () => {
    // 1. Validate OTP presence
    if (otp.length !== 6) {
      setErrors({ otp: "Please enter a valid 6-digit OTP" });
      return;
    }

    // 2. API Call
    setIsLoading(true);
    setErrors({});
    
    try {
      await fakeApiCall(2000);

      // Mock Check: Accept "123456"
      if (otp === "123456") {
        toast.success("Login Successful!");
        console.log("Logged in user:", mobileNumber);
        // Navigate to dashboard or home
        // there will be conditional navigation here , 
        navigate({ to: "/dashboard" }); 
      } else {
        setErrors({ otp: "Invalid OTP. Try 123456" });
        toast.error("Invalid credentials");
      }
    } catch (error) {
      toast.error("Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleOtpComplete = (val: string) => {
     // Optional: Auto-trigger login when 6 digits are filled
     // setOtp(val); 
     // We usually wait for button click in Login screens, 
     // but you can call handleLogin() here if desired.
  };

  return (
    <div className="w-full px-5 py-6 sm:px-6 md:px-8 lg:px-10 flex flex-col">
      {/* --- Heading Section --- */}
      <div className="mb-6 shrink-0">
        <div className="mb-16">
            <Logo height={90} />
        </div>
        <div>
          <h1 className="mb-2 text-base-content text-2xl font-semibold sm:text-4xl">
            Log In
          </h1>
          <p className="text-sm sm:text-base font-normal text-body-content/80">
            Establish your business and connect with millions throughout India.
          </p>
        </div>
      </div>

      <div className="space-y-6">
        {step === "INPUT_MOBILE" ? (
          /* --- Step 1: Mobile Input --- */
          <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-300">
            <MobileNumberInput
              label="Mobile Number"
              placeholder="Enter number"
              value={mobileNumber}
              onChange={handleMobileChange}
              error={errors.mobileNumber}
              maxLength={10}
              required
              isVerified={false}
              showStatus={false}
              

            />

            <Button
              onClick={handleGetOtp}
              isLoading={isLoading}
              disabled={mobileNumber.length < 10}
              fullWidth
              color="primary"
              size="lg"
            >
              Get OTP
            </Button>
          </div>
        ) : (
          /* --- Step 2: OTP Input --- */
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Display Number & Change Link */}
            <div className="text-sm sm:text-base text-base-content">
              Register Mobile number{" "}
              <span className="font-semibold text-base-content mx-1">
                +91 {mobileNumber}
              </span>
              <button
                onClick={handleChangeNumber}
                className="text-disabled-content underline hover:text-primary transition-colors ml-1 text-sm"
              >
                change?
              </button>
            </div>

            {/* OTP Boxes */}
            <OTPInput
              length={6}
              value={otp}
              onChange={(val) => {
                setOtp(val);
                setErrors((prev) => { const n = {...prev}; delete n.otp; return n; });
              }}
              onComplete={handleOtpComplete}
              error={errors.otp}
              disabled={isLoading}
              // Adjusting size to match screenshot look
              size="lg" 
              boxClassName="border-base-content/20 rounded-lg h-12 w-12 sm:h-14 sm:w-14"
            />

            <Button
              onClick={handleLogin}
              isLoading={isLoading}
              disabled={otp.length !== 6}
              fullWidth
              color="primary"
              size="lg"
            >
              Login
            </Button>

            <div className="w-full flex justify-center">
              <Button
                variant="ghost"
                onClick={handleResendOtp}
                isLoading={isResending}
                disabled={isLoading}
                className="text-primary hover:bg-transparent hover:underline"
              >
                Resend OTP
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;