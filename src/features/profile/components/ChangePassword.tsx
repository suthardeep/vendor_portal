import { Button } from "@/components/base/Button";
import { Input } from "@/components/base/Input";
import { Separator } from "@/components/base/Separator";
import { useState } from "react";

const useChangePasswordMutation = () => ({
  mutate: (data: any, callbacks: any) => {
    setTimeout(() => callbacks.onSuccess({ message: "Password changed successfully" }), 1000);
  },
  isPending: false,
});

// ChangePassword.tsx
export const ChangePassword = ({ onBack }: any) => {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const changePasswordMutation = useChangePasswordMutation();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSave = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) newErrors.currentPassword = "Current password is required";
    if (!formData.newPassword) newErrors.newPassword = "New password is required";
    if (formData.newPassword.length < 8) newErrors.newPassword = "Password must be at least 8 characters";
    if (formData.newPassword !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    changePasswordMutation.mutate(
      {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      },
      {
        onSuccess: () => {
          alert("Password changed successfully!");
          onBack();
        },
      }
    );
  };

  return (
    <div className="bg-base-1 rounded-2xl pb-4">
      <div className="p-4 flex items-center justify-between">
        <h1 className="text-lg md:text-xl font-semibold text-base-content">Change Password</h1>
      </div>

      <Separator />

      <div className="p-4">
        <div className="space-y-4 mb-6">
          <Input
            label="Current Password"
            type="password"
            placeholder="********"
            value={formData.currentPassword}
            onChange={(e: any) => handleInputChange("currentPassword", e.target.value)}
            togglePassword
            error={errors.currentPassword}
            required
          />

          <Input
            label="New Password"
            type="password"
            placeholder="********"
            value={formData.newPassword}
            onChange={(e: any) => handleInputChange("newPassword", e.target.value)}
            error={errors.newPassword}
            togglePassword
            required
          />

          <Input
            label="Confirm New Password"
            type="password"
            placeholder="********"
            value={formData.confirmPassword}
            onChange={(e: any) => handleInputChange("confirmPassword", e.target.value)}
            error={errors.confirmPassword}
            togglePassword
            required
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-end pt-6 ">
          <Button className="w-32" variant="outline" onClick={onBack}>
            Cancel
          </Button>
          <Button className="w-32" onClick={handleSave} isLoading={changePasswordMutation.isPending}>
            Save
          </Button>
        </div>
      </div>
    </div>
  );
};
