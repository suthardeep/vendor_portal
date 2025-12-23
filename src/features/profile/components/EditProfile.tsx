import { useState } from "react";
import { z } from "zod";
import { useSendOtpMutation, useVerifyOtpMutation } from "../../auth/registration/api/queryHooks";
import { MediaPicker } from "@/components/media-picker/MediaPicker";
import { MinimalMediaProps } from "@/components/media-picker/types/media.types";
import { Input } from "@/components/base/Input";
import { Button } from "@/components/base/Button";
import { OTPInput } from "@/components/base/OTPInput";
import { Separator } from "@/components/base/Separator";
import { useNavigate } from "@tanstack/react-router";

const useUpdateProfileMutation = () => ({
  mutate: (data: any, callbacks: any) => {
    setTimeout(() => callbacks.onSuccess({ data }), 1000);
  },
  isPending: false,
});

// EditProfile.tsx
export const EditProfile = ({ onBack, profile }: any) => {
  const [formData, setFormData] = useState({
    fullName: profile?.fullName || "",
    email: profile?.email || "",
    profilePic: profile?.profilePic || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isEmailVerified, setIsEmailVerified] = useState(profile?.emailVerified || false);
  const [originalEmail] = useState(profile?.email || "");
  const [otpState, setOtpState] = useState({
    isOpen: false,
    value: "",
    error: "",
  });

  const sendOtpMutation = useSendOtpMutation();
  const verifyOtpMutation = useVerifyOtpMutation();
  const updateProfileMutation = useUpdateProfileMutation();

  const navigate = useNavigate();

  const isPending =
    sendOtpMutation.isPending || verifyOtpMutation.isPending || updateProfileMutation.isPending;

  const handleInputChange = (field: string, value: any) => {
    console.log("Value; ", value);
    if (field === "email" && value !== originalEmail) {
      setIsEmailVerified(false);
    }
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleVerifyClick = () => {
    const emailResult = z.string().email().safeParse(formData.email);
    if (!emailResult.success) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email to verify" }));
      return;
    }

    sendOtpMutation.mutate(
      { email: formData.email },
      {
        onSuccess: () => {
          setOtpState({ isOpen: true, value: "", error: "" });
        },
      }
    );
  };

  const handleChangePassword = () => {
    navigate({ to: ".", search: { step: "password" } });
  };

  const handleVerifyOtp = (otpValue: string) => {
    verifyOtpMutation.mutate(
      { email: formData.email, otp: otpValue },
      {
        onSuccess: (res) => {
          if (res.data?.verified) {
            setIsEmailVerified(true);
            setOtpState((prev) => ({ ...prev, isOpen: false }));
          }
        },
      }
    );
  };

  const handleSave = () => {
    if (formData.email !== originalEmail && !isEmailVerified) {
      setErrors((prev) => ({ ...prev, email: "Email verification is required" }));
      return;
    }

    const payload = {
      fullName: formData.fullName,
      profilePic: formData.profilePic,
    };

    updateProfileMutation.mutate(payload, {
      onSuccess: () => {
        alert("Profile updated successfully!");
        onBack();
      },
    });
  };

  return (
    <div className="bg-base-1 rounded-2xl pb-4">
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-semibold text-base-content">Edit Profile</h1>
      </div>

      <Separator />

      <div className="p-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col gap-4 justify-center lg:col-span-1">
            <MediaPicker
              label="Profile picture"
              ids={formData.profilePic}
              urls={formData.profilePic}
              maxFiles={1}
              onChange={(items: MinimalMediaProps[]) => handleInputChange("profilePic", items[0]?.s3Url)}
              itemSizeConfig={{ width: "w-full" }}
            />
            <Button
              onClick={handleChangePassword}
              size="md"
              variant="outline"
            >
              Reset password
            </Button>
          </div>

          <div className="lg:col-span-2 space-y-4">
            <Input
              label="Full Name"
              placeholder="Type here"
              value={formData.fullName}
              onChange={(e: any) => handleInputChange("fullName", e.target.value)}
              error={errors.fullName}
              required
            />

            <Input
              label="Email ID"
              placeholder="Type here"
              value={formData.email}
              onChange={(e: any) => handleInputChange("email", e.target.value)}
              error={errors.email}
              required
              isVerified={isEmailVerified}
              showStatus={true}
              verifiedText="Verified"
              unverifiedText="Need verification"
              rightElement={
                !isEmailVerified && formData.email !== originalEmail ? (
                  <button
                    type="button"
                    onClick={handleVerifyClick}
                    className="text-primary text-sm font-semibold hover:underline"
                    disabled={isPending}
                  >
                    {sendOtpMutation.isPending ? "Sending..." : "Verify"}
                  </button>
                ) : undefined
              }
            />

            {/* <Input
              label="Password"
              type="password"
              required
              togglePassword
            /> */}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6">
          <Button className="w-32" variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="w-32"
            isLoading={updateProfileMutation.isPending}
            disabled={isPending || (formData.email !== originalEmail && !isEmailVerified)}
          >
            Save
          </Button>
        </div>
      </div>

      {otpState.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-white w-full max-w-md rounded-2xl p-6 shadow-2xl border border-gray-200">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Verify Email</h3>
                <p className="text-sm text-gray-600 mt-1">
                  Enter the code sent to <span className="font-semibold">{formData.email}</span>
                </p>
              </div>
              <button
                onClick={() => setOtpState((prev) => ({ ...prev, isOpen: false }))}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="py-4">
              <OTPInput
                length={6}
                value={otpState.value}
                onChange={(val: string) => setOtpState((prev) => ({ ...prev, value: val, error: "" }))}
                onComplete={handleVerifyOtp}
                error={otpState.error}
                disabled={verifyOtpMutation.isPending}
              />
            </div>

            <Button
              onClick={() => handleVerifyOtp(otpState.value)}
              isLoading={verifyOtpMutation.isPending}
              disabled={otpState.value.length !== 6}
            >
              Verify Code
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
