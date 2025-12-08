import React, { useState } from "react";
import { z } from "zod";
import { RegistrationSchema, RegistrationFormData } from "./schemas/registration.schema";
import { Input } from "@/components/base/Input";
import { Checkbox } from "@/components/base/Checkbox";
import { Button } from "@/components/base/Button";
import Logo from "@/components/base/Logo";
import { OTPInput } from "@/components/base/OTPInput";
import { Icon } from "@/components/base/Icon";
import { toast } from "@/components/toast/Sonner";
import { useNavigate } from "@tanstack/react-router";

const Registration: React.FC = () => {
  // --- Form State ---
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: "",
    email: "",
    agreed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const fakeApiCall = async (time?: number) => {
    await new Promise((resolve) => setTimeout(resolve, time ?? 2000));
  };

  // --- OTP Modal State ---
  const [otpState, setOtpState] = useState({
    isOpen: false,
    value: "",
    error: "",
    isLoading: false,
    isResendingOtp: false,
  });

  // --- Handlers ---

  const handleInputChange = (field: keyof RegistrationFormData, value: any) => {
    // Edge Case: If email is changed after verification, revoke verification
    if (field === "email" && isEmailVerified) {
      setIsEmailVerified(false);
    }

    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear specific field error
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleVerifyClick = () => {
    // Validate email format before opening OTP modal
    const emailResult = z.string().email().safeParse(formData.email);
    if (!emailResult.success) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email to verify" }));
      return;
    }

    fakeApiCall(100).then(() => {
      toast.success("Otp sent successfully");
      setOtpState({
        isOpen: true,
        value: "",
        error: "",
        isLoading: false,
        isResendingOtp: false,
      });
    });

    // Open Modal
  };

  const handleResendOtp = () => {
    setOtpState({
      isOpen: true,
      value: "",
      error: "",
      isLoading: false,
      isResendingOtp: true,
    });

    fakeApiCall().then(() => {
      toast.success("Otp sent successfully");
      setOtpState((prev) => ({ ...prev, isResendingOtp: false }));
    });
  };

  const handleOtpComplete = async (otpValue: string) => {
    // Auto-submit when OTP is filled
    handleVerifyOtp(otpValue);
  };

  const handleVerifyOtp = async (otpValue: string) => {
    setOtpState((prev) => ({ ...prev, isLoading: true, error: "" }));

    try {
      // DUMMY API CALL for OTP Verification
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // Mock Check: Accept "123456" as valid OTP
      if (otpValue === "123456") {
        setIsEmailVerified(true);
        setOtpState((prev) => ({ ...prev, isOpen: false })); // Close modal

        // Clear any previous email errors
        setErrors((prev) => {
          const newErr = { ...prev };
          delete newErr.email;
          return newErr;
        });
      } else {
        // Keep modal open, show error
        setOtpState((prev) => ({ ...prev, error: "Invalid OTP entered. Try 123456." }));
      }
    } catch (e) {
      setOtpState((prev) => ({ ...prev, error: "Verification failed. Please try again." }));
    } finally {
      setOtpState((prev) => ({ ...prev, isLoading: false }));
    }
  };

  const handleRegister = async () => {
    try {
      setErrors({});
      setIsSubmitting(true);

      // 1. Zod Validation
      RegistrationSchema.parse(formData);

      // 2. Business Logic Validation
      if (!isEmailVerified) {
        setErrors((prev) => ({ ...prev, email: "Email verification is required" }));
        setIsSubmitting(false);
        return;
      }

      // 3. Register API Call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      console.log("Payload sent:", { fullName: formData.fullName });
      toast.success("Registration Successful");
      navigate({ to: "/business-registration", search: { step: 1 } });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          fieldErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(fieldErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="w-full px-5 py-6 sm:px-6 md:px-8 lg:px-10 flex flex-col">
        {/* Heading */}
        <div className="mb-6 shrink-0">
          <div className="mb-10">
            <Logo height={90} />
          </div>
          <div>
            <div className="flex justify-between items-center">
              <h1 className="mb-1 text-base-content text-2xl font-semibold sm:text-4xl">Registration</h1>
            </div>
            <p className="text-sm sm:text-base font-normal text-body-content/80">
              Establish your business and connect with millions throughout India.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          {/* Full Name Input */}
          <Input
            label="Full Name"
            placeholder="Type here"
            value={formData.fullName}
            onChange={(e) => handleInputChange("fullName", e.target.value)}
            error={errors.fullName}
            fullWidth
            required
          />

          {/* Email Input with Verification Logic */}
          <Input
            label="Email Address"
            placeholder="Type here"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            error={errors.email}
            fullWidth
            required
            // Status Props
            isVerified={isEmailVerified}
            showStatus={true} // Shows "Need verification" or "Verified" text at bottom
            verifiedText="Verified"
            unverifiedText="Need verification"
            // Right Element Logic:
            // If NOT verified, show a clickable "Verify" button inside the input
            // If verified, pass undefined (Input.tsx handles the CheckCircle icon internally when isVerified=true)
            rightElement={
              !isEmailVerified && formData.email ? (
                <button
                  type="button"
                  onClick={handleVerifyClick}
                  className="text-primary text-sm font-semibold hover:underline mr-1"
                >
                  Verify
                </button>
              ) : undefined
            }
          />

          {/* Checkbox */}
          <div className="pt-2">
            <Checkbox
              label={
                <span className="text-sm">
                  By continuing, I agree to{" "}
                  <a href="#" className="text-primary underline">
                    Terms of Use
                  </a>{" "}
                  &{" "}
                  <a href="#" className="text-primary underline">
                    Privacy Policy
                  </a>
                </span>
              }
              checked={formData.agreed}
              onChange={(checked) => handleInputChange("agreed", checked)}
              error={errors.agreed}
              required
            />
          </div>

          {/* Submit Button */}
          <Button
            onClick={handleRegister}
            isLoading={isSubmitting}
            // Disable if email not verified or terms not agreed
            disabled={!isEmailVerified || !formData.agreed}
            fullWidth
            color="primary"
            size="lg"
          >
            Register & Continue
          </Button>
        </div>
      </div>

      {/* --- OTP Dialog / Modal --- */}
      {otpState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-base-1 w-full max-w-md rounded-2xl p-6 shadow-2xl border border-base-content/10 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold text-base-content">Verify Email</h3>
                <p className="text-sm text-body-content mt-1">
                  Enter the code sent to{" "}
                  <span className="font-semibold text-base-content">{formData.email}</span>
                </p>
              </div>
              <button
                onClick={() => setOtpState((prev) => ({ ...prev, isOpen: false }))}
                className="text-base-content/50 hover:text-base-content"
              >
                <Icon name="X" size={24} />
              </button>
            </div>

            <div className="py-4">
              <OTPInput
                length={6}
                value={otpState.value}
                onChange={(val) => setOtpState((prev) => ({ ...prev, value: val, error: "" }))}
                onComplete={handleOtpComplete}
                error={otpState.error}
                disabled={otpState.isLoading}
                boxClassName="border-base-content/20"
              />
            </div>

            <Button
              onClick={() => handleVerifyOtp(otpState.value)}
              isLoading={otpState.isLoading}
              disabled={otpState.value.length !== 6}
              fullWidth
              color="primary"
            >
              Verify Code
            </Button>
            <Button
              onClick={handleResendOtp}
              isLoading={otpState.isResendingOtp}
              //   disabled={otpState.isLoading || otpState.isResendingOtp}
              fullWidth
              variant="ghost"
            >
              Resend OTP
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Registration;
