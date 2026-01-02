import { Input } from "@/components/base/Input";
import { MobileNumberInput } from "@/components/base/MobileNumberInput";
import { Checkbox } from "@/components/base/Checkbox";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { MediaPicker } from "@/components/media-picker/MediaPicker";
import { BusinessDetailsStepProps } from "../../../types/registration.types";

const AuthorisedPersonSection: React.FC<BusinessDetailsStepProps> = ({ data, onChange, errors }) => {
  // Fetch user object from the global store
  const { user } = useAuthStore();
  const [isSameAsBeforeChecked, setIsSameAsBeforeChecked] = useState(false);

  const handleSameAsBeforeClick = (checked: boolean) => {
    setIsSameAsBeforeChecked(checked);

    if (checked) {
      // Map user details from the store (user is optional, fields can be null)
      onChange({
        ...data,
        authorisedPersonName: user?.fullName ?? "", // Mapping user.fullName to name
        authorisedPersonEmail: user?.email ?? "",
        // Mapping user.phone to authorisedPersonPhoneNumber. Stripping '+91' if present.
        authorisedPersonPhoneNumber: user?.phone?.replace("+91", "") ?? "",
      });
    } else {
      onChange({
        ...data,
        authorisedPersonName: user?.authorisedPersonDetails?.name ??  "",
        authorisedPersonEmail: user?.authorisedPersonDetails?.email ??  "",
        authorisedPersonPhoneNumber: user?.authorisedPersonDetails?.mobileNumber.replace("+91", "")  ??  "",
      });
    }
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 gap-y-4 gap-x-2">
      <Checkbox
        label="Same as before"
        onChange={handleSameAsBeforeClick}
        checked={isSameAsBeforeChecked}
        required
      />
      <Input
        label="Name"
        placeholder="Enter authorised person name"
        value={data.authorisedPersonName || ""}
        disabled={isSameAsBeforeChecked}
        onChange={(e) => onChange({ ...data, authorisedPersonName: e.target.value })}
        error={errors.authorisedPersonName}
        containerClassName="col-span-2"
        required
      />
      <MobileNumberInput
        label="Mobile Number"
        placeholder="Enter mobile number"
        disabled={isSameAsBeforeChecked}
        value={data.authorisedPersonPhoneNumber || ""}
        onChange={(e) => onChange({ ...data, authorisedPersonPhoneNumber: e.target.value })}
        error={errors.authorisedPersonPhoneNumber}
        required
        isVerified={false}
        showStatus={false}
      />
      <Input
        label="Email ID"
        placeholder="Enter email"
        type="email"
        disabled={isSameAsBeforeChecked}
        value={data.authorisedPersonEmail || ""}
        onChange={(e) => onChange({ ...data, authorisedPersonEmail: e.target.value })}
        error={errors.authorisedPersonEmail}
        fullWidth
        required
      />

      <MediaPicker
        label="Upload PAN Card"
        urls={data.authorisedPersonPanCard}
        onChange={(items) => {
          const selectedItem = items.length > 0 ? items[items.length - 1] : null;
          onChange({
            ...data,
            authorisedPersonPanCard: selectedItem?.s3Url || "",
          });
        }}
        maxFiles={1}
        itemClassName="max-h-[20dvh] w-full"
        orientation="vertical"
        required
        error={errors.authorisedPersonPanCard}
      />

      <MediaPicker
        label="Upload Aadhar Card"
        urls={data.authorisedPersonAadharCard}
        onChange={(items) => {
          const selectedItem = items.length > 0 ? items[items.length - 1] : null;
          onChange({
            ...data,
            authorisedPersonAadharCard: selectedItem?.s3Url || "",
          });
        }}
        maxFiles={1}
        itemClassName="max-h-[20dvh] w-full"
        orientation="vertical"
        required
        error={errors.authorisedPersonAadharCard}
      />
    </div>
  );
};

export default AuthorisedPersonSection;
