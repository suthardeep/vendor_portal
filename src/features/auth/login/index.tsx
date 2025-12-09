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

// --- Hypothetical Imports (Assuming these exist in the project) ---
import { ROUTES } from "@/constants/routes"; 


// -----------------------------------------------------------------

import {TokenUtil} from '@/utils/tokenUtil'

import { useSendOtpMutation, useVerifyOtpMutation } from "./api/queryHooks";
import { useAuthStore } from "@/store/useAuthStore"; // NEW: Import Auth Store


const Login: React.FC = () => {
  const navigate = useNavigate();

  // NEW: Get the setUser function from the Auth Store
  const { setUser } = useAuthStore(); 
  
  // --- State ---
  const [step, setStep] = useState<"INPUT_MOBILE" | "INPUT_OTP">("INPUT_MOBILE");
  const [phone, setPhone] = useState(""); 
  const [otp, setOtp] = useState("");
  
  // Local error state for form validation
  const [errors, setErrors] = useState<Record<string, string>>({});

  // --- TanStack Query Mutations ---
  const sendOtpMutation = useSendOtpMutation();
  const resendOtpMutation = useSendOtpMutation(); 
  const verifyOtpMutation = useVerifyOtpMutation();

  // Determine the overall "busy" state to disable unrelated actions
  const isPending = sendOtpMutation.isPending || verifyOtpMutation.isPending;


  // --- Handlers ---

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(value); 
    if (errors.phone) { 
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr.phone; 
        return newErr;
      });
    }
  };

  const handleGetOtp = () => {
    // 1. Validate Mobile
    const result = LoginSchema.safeParse({ phone }); 
    if (!result.success) {
      setErrors({ phone: result.error.issues[0].message }); 
      return;
    }

    // 2. API Call (Send OTP)
    setErrors({}); 
    
    sendOtpMutation.mutate(
      { phone: phone }, 
      {
        onSuccess: (data) => {
          toast.success(data.message || `OTP sent to +91 ${phone}`); 
          setStep("INPUT_OTP");
        },
        onError: (error) => {
          const errorMessage = (error as { message?: string })?.message || "Failed to send OTP. Please try again.";
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleChangeNumber = () => {
    setStep("INPUT_MOBILE");
    setOtp("");
    setErrors({});
    sendOtpMutation.reset();
    resendOtpMutation.reset();
    verifyOtpMutation.reset();
  };

  const handleResendOtp = () => {
    // 1. Validate Mobile
    const result = LoginSchema.safeParse({ phone }); 
    if (!result.success) {
      toast.error("Invalid phone number.");
      return;
    }
    
    // 2. API Call (Resend OTP)
    resendOtpMutation.mutate(
        { phone: phone }, 
        {
            onSuccess: (data) => {
                toast.success(data.message || "OTP resent successfully");
            },
            onError: (error) => {
                const errorMessage = (error as { message?: string })?.message || "Failed to resend OTP. Please try again.";
                toast.error(errorMessage);
            }
        }
    );
  };

  const handleLogin = () => {
    // 1. Validate OTP presence
    const otpResult = z.object({ otp: z.string().length(6, "OTP must be 6 digits") }).safeParse({ otp });
    
    if (!otpResult.success) {
      setErrors({ otp: otpResult.error.issues[0].message });
      return;
    }
    
    // 2. API Call (Verify OTP / Login)
    setErrors({});

    verifyOtpMutation.mutate(
      { phone: phone, otp: otp }, 
      {
        onSuccess: (res) => {
            
            const userData = res.data.user;
            
            // 3. Store Access Token



            console.log("accessToken" , res.data.access_token)
            TokenUtil.setToken(res.data.access_token); 
            
            // 4. Store user details in Zustand store
            setUser(userData); // NEW: Storing user data
            
            toast.success("Login Successful!");
            console.log("Logged in user:", userData.phone);
            
            // 5. Conditional Navigation
            if (userData.emailVerified === false) {
                navigate({ to: ROUTES.REGISTRATION }); 
            } else {
                navigate({ to: ROUTES.DASHBOARD });
            }
        },
        onError: (error) => {
            const errorMessage = (error as { message?: string })?.message || "Invalid credentials or login failed.";
            setErrors({ otp: "Invalid OTP" });
            toast.error(errorMessage);
        },
      }
    );
  };

  const handleOtpComplete = (val: string) => {
     // We wait for button click.
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
              value={phone} 
              onChange={handlePhoneChange} 
              error={errors.phone} 
              maxLength={10}
              required
              isVerified={false}
              showStatus={false}
              

            />

            <Button
              onClick={handleGetOtp}
              isLoading={sendOtpMutation.isPending} 
              disabled={phone.length < 10 || isPending}
              fullWidth
              color="primary"
              size="lg"
            >
              {sendOtpMutation.isPending ? "Sending OTP..." : "Get OTP"}
            </Button>
          </div>
        ) : (
          /* --- Step 2: OTP Input --- */
          <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
            {/* Display Number & Change Link */}
            <div className="text-sm sm:text-base text-base-content">
              Registered Mobile Number{" "}
              <span className="font-semibold text-base-content mx-1">
                +91 {phone} 
              </span>
              <button
                onClick={handleChangeNumber}
                className="text-disabled-content underline hover:text-primary transition-colors ml-1 text-sm  hover:cursor-pointer"
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
              disabled={isPending}
              // Adjusting size to match screenshot look
              size="lg" 
              boxClassName="border-base-content/20 rounded-lg h-12 w-12 sm:h-14 sm:w-14"
            />

            <Button
              onClick={handleLogin}
              isLoading={verifyOtpMutation.isPending} 
              disabled={otp.length !== 6 || isPending}
              fullWidth
              color="primary"
              size="lg"
            >
              {verifyOtpMutation.isPending ? "Verifying..." : "Login"}
            </Button>

            <div className="w-full flex justify-center">
              <Button
                variant="ghost"
                onClick={handleResendOtp}
                isLoading={resendOtpMutation.isPending} 
                disabled={isPending || resendOtpMutation.isPending}
                className="text-primary hover:bg-transparent hover:underline"
              >
                {resendOtpMutation.isPending ? "Resending..." : "Resend OTP"}
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;