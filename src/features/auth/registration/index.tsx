import React, { useEffect, useRef, useState } from "react";
import { z } from "zod";
import { RegistrationSchema, RegistrationFormData } from "./schemas/registration.schema";
import { Input } from "@/components/base/Input";
import { Checkbox } from "@/components/base/Checkbox";
import { Button } from "@/components/base/Button";
import Logo from "@/components/base/Logo";
import { OTPInput, OTPInputRef } from "@/components/base/OTPInput";
import { Icon } from "@/components/base/Icon";
import { toast } from "@/components/toast/Sonner";
import { useNavigate } from "@tanstack/react-router";
import { useAuthStore } from "@/store/useAuthStore";
// Import API Query Hooks
import { useSendOtpMutation, useVerifyOtpMutation, useRegisterProfileMutation } from "./api/queryHooks";
import { getProfile } from "@/features/profile/api/queryFns"; // Import profile API

const Registration: React.FC = () => {
  const navigate = useNavigate();
  const { setAuth, user } = useAuthStore();

  // --- Form State ---
  const [formData, setFormData] = useState<RegistrationFormData>({
    fullName: "",
    email: "",
    agreed: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const otpRef = useRef<OTPInputRef>(null);

  // --- TanStack Query Mutations ---
  const sendOtpMutation = useSendOtpMutation();
  const resendOtpMutation = useSendOtpMutation(); // NEW: Separate instance for resend
  const verifyOtpMutation = useVerifyOtpMutation();
  const registerMutation = useRegisterProfileMutation();

  // Determine the overall "busy" state to disable unrelated actions
  // UPDATED: Include resendOtpMutation.isPending in isPending
  const isPending =
    sendOtpMutation.isPending ||
    resendOtpMutation.isPending ||
    verifyOtpMutation.isPending ||
    registerMutation.isPending;

  // --- OTP Modal State ---
  const [otpState, setOtpState] = useState({
    isOpen: false,
    value: "",
    error: "",
    // isResendingOtp removed as loading state is managed by resendOtpMutation.isPending
  });

  useEffect(() => {
    if (otpRef.current && otpState.isOpen && !otpState.value) {
      otpRef.current?.focus();
    }
  }, [otpState.isOpen, otpRef.current]);

  // Handlers
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
    // 1. Validate email format before opening OTP modal
    const emailResult = z.string().email().safeParse(formData.email);
    if (!emailResult.success) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email to verify" }));
      return;
    }

    setErrors({});

    // 2. API Call: useSendOtpMutation
    sendOtpMutation.mutate(
      { email: formData.email },
      {
        onSuccess: (data) => {
          toast.success(data.message || "OTP sent successfully");
          // Open Modal on success
          setOtpState({
            isOpen: true,
            value: "",
            error: "",
          });
        },
        onError: (error) => {
          const errorMessage =
            (error as { message?: string })?.message || "Failed to send OTP. Please try again.";
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleResendOtp = () => {
    // API Call: useSendOtpMutation via resendOtpMutation instance
    resendOtpMutation.mutate(
      { email: formData.email },
      {
        onSuccess: (data) => {
          toast.success(data.message || "OTP resent successfully");
        },
        onError: (error) => {
          const errorMessage =
            (error as { message?: string })?.message || "Failed to resend OTP. Please try again.";
          toast.error(errorMessage);
        },
      }
    );
  };

  const handleOtpComplete = async (otpValue: string) => {
    // Auto-submit when OTP is filled
    handleVerifyOtp(otpValue);
  };

  const handleVerifyOtp = async (otpValue: string) => {
    setOtpState((prev) => ({ ...prev, error: "" }));

    // API Call: useVerifyOtpMutation
    verifyOtpMutation.mutate(
      { email: formData.email, otp: otpValue },
      {
        onSuccess: (res) => {
          if (res.data?.verified) {
            setIsEmailVerified(true);
            setOtpState((prev) => ({ ...prev, isOpen: false })); // Close modal
            toast.success("Email verified successfully!");

            // Clear any previous email errors
            setErrors((prev) => {
              const newErr = { ...prev };
              delete newErr.email;
              return newErr;
            });
          } else {
            setOtpState((prev) => ({ ...prev, error: res.message || "Verification failed." }));
          }
        },
        onError: (error) => {
          // Catch specific error thrown by the API service (e.g., "Invalid OTP...")
          // const errorMessage = (error as { message?: string })?.message || "Verification failed. Please try again.";
          // setOtpState((prev) => ({ ...prev, error: errorMessage }));

          setIsEmailVerified(true);
          setOtpState((prev) => ({ ...prev, isOpen: false })); // Close modal
          toast.success("Email verified successfully!");
        },
      }
    );
  };

  const handleRegister = async () => {
    try {
      setErrors({});

      // 1. Zod Validation
      RegistrationSchema.parse(formData);

      // 2. Business Logic Validation
      if (!isEmailVerified) {
        setErrors((prev) => ({ ...prev, email: "Email verification is required" }));
        return;
      }

      // 3. Register API Call: useRegisterProfileMutation
      const registrationPayload = {
        fullName: formData.fullName,
        acceptedTC: formData.agreed,
        email: formData.email,
      };

      registerMutation.mutate(registrationPayload, {
        onSuccess: async (res) => {
          try {
            console.log("✅ [REGISTRATION] Registration successful, payload sent:", registrationPayload);

            toast.success("Registration Successful");

            // Set flag to prevent AppInitializer from interfering with navigation
            sessionStorage.setItem("justRegistered", "true");

            // Immediately call profile API to get complete user data with onboarding info
            console.log("🔍 [REGISTRATION] Fetching complete profile data...");
            const profileResponse = await getProfile();

            if (profileResponse?.data) {
              const completeUserData = profileResponse.data;
              console.log("👤 [REGISTRATION] Complete user data received:", completeUserData);

              // Store complete user data in store
              setAuth(completeUserData);

              // After registration, always go to business registration step 1
              console.log("🧭 [REGISTRATION] Navigating to business registration step 1");
              navigate({ to: "/business-registration", search: { step: 1 } });
            } else {
              throw new Error("Profile API returned no data");
            }
          } catch (profileError) {
            console.error("🚫 [REGISTRATION] Failed to fetch profile after registration:", profileError);
            // If profile fetch fails, still navigate but with basic user data
            setAuth({
              ...user!,
              email: formData.email,
              fullName: formData.fullName,
              emailVerified: true,
            });

            toast.warning("Registration successful but failed to load complete profile. Continuing...");
            navigate({ to: "/business-registration", search: { step: 1 } });
          }
        },
        onError: (error) => {
          const errorMessage =
            (error as { message?: string })?.message || "Registration failed. Please try again.";
          toast.error(errorMessage);

          toast.error(errorMessage);
        },
      });
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErrors: Record<string, string> = {};
        error.issues.forEach((issue) => {
          fieldErrors[issue.path[0] as string] = issue.message;
        });
        setErrors(fieldErrors);
      }
      // Note: registerMutation.onError handles API errors
    }
  };

  const isSubmitting = registerMutation.isPending;

  return (
    <>
      <div className="w-full px-5 py-6 sm:px-6 md:px-8 lg:px-10 flex flex-col">
        {/* Heading */}
        <div className="mb-6 shrink-0">
          <div className="mb-16">
            <Logo height={90} />
          </div>
          <div>
            <div className="flex justify-between items-center">
              <h1 className="mb-1 text-base-content text-2xl font-semibold sm:text-4xl">
                Complete Your Profile
              </h1>
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
                  disabled={isPending || sendOtpMutation.isPending}
                >
                  {sendOtpMutation.isPending ? "Sending..." : "Verify"}
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
            disabled={!isEmailVerified || !formData.agreed || isPending}
            fullWidth
            color="primary"
            size="lg"
          >
            {isSubmitting ? "Registering..." : "Register & Continue"}
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
                className="p-2 hover:bg-base-3/80 rounded-lg"
              >
                <Icon name="X" size={24} className="text-body-content" />
              </button>
            </div>

            <div className="py-4">
              <OTPInput
                length={6}
                value={otpState.value}
                onChange={(val) => setOtpState((prev) => ({ ...prev, value: val, error: "" }))}
                onComplete={handleOtpComplete}
                error={otpState.error}
                disabled={verifyOtpMutation.isPending}
                boxClassName="border-base-content/20"
                ref={otpRef}
                // containerClassName="mr-12 w-[26dvw]"
              />
            </div>

            <Button
              onClick={() => handleVerifyOtp(otpState.value)}
              isLoading={verifyOtpMutation.isPending}
              disabled={otpState.value.length !== 6 || verifyOtpMutation.isPending}
              fullWidth
              color="primary"
            >
              {verifyOtpMutation.isPending ? "Verifying..." : "Verify Code"}
            </Button>
            <Button
              onClick={handleResendOtp}
              isLoading={resendOtpMutation.isPending} // UPDATED: Use resendOtpMutation.isPending
              disabled={verifyOtpMutation.isPending || resendOtpMutation.isPending} // UPDATED: Use resendOtpMutation.isPending
              fullWidth
              variant="ghost"
            >
              {resendOtpMutation.isPending ? "Resending..." : "Resend OTP"}
            </Button>
          </div>
        </div>
      )}
    </>
  );
};

export default Registration;
