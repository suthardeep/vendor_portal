import { Input } from "@/components/base/Input";
import { BusinessDetailsType } from "../../../schemas/registration.schema";
import { MobileNumberInput } from "@/components/base/MobileNumberInput";
import {Checkbox}  from "@/components/base/Checkbox";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { MediaPicker } from "@/components/media-picker/MediaPicker";
import { MediaItem } from "@/components/media-picker/MediaGallery";
import { BusinessDetailsStepProps } from "../../../types/registration.types";

// Helper function to create a minimal MediaItem for the picker's value prop
const createMinimalMediaItem = (id: string, name: string): MediaItem[] => {
  if (!id) return [];
  return [{ id, name, type: 'file', createdAt: new Date().toISOString() }];
};

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
        authorisedPersonPhoneNumber: user?.phone?.replace('+91', '') ?? "", 
      });
    } else {
      onChange({
        ...data,
        authorisedPersonName: "",
        authorisedPersonEmail: "",
        authorisedPersonPhoneNumber: "",
      });
    }
  };

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 gap-y-4 gap-x-2">
      <Checkbox
        label="Same as before"
        onChange={handleSameAsBeforeClick}
        checked={isSameAsBeforeChecked}
        // containerClassName="col-span-2"
        required
      />
      <Input
        label="Name"
        placeholder="Enter authorised person name"
        value={data.authorisedPersonName || ""}
        onChange={(e) => onChange({ ...data, authorisedPersonName: e.target.value })}
        error={errors.authorisedPersonName}
        containerClassName="col-span-2"
        required
      />
      <MobileNumberInput
        label="Mobile Number"
        placeholder="Enter mobile number"
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
        value={data.authorisedPersonEmail || ""}
        onChange={(e) => onChange({ ...data, authorisedPersonEmail: e.target.value })}
        error={errors.authorisedPersonEmail}
        fullWidth
        required
      />
      
      {/* Start PAN Card MediaPicker Integration */}
      <div className="w-full">
        <label className="label pt-0 pb-1.5 flex items-center justify-start gap-1">
          <span className="label-text font-semibold text-base-content">Upload PAN Card</span>
          <span className="text-error">*</span>
        </label>
        <MediaPicker
          value={createMinimalMediaItem(data.authorisedPersonPanCard ?? "", "Authorised Person PAN")}
          onChange={(items) => onChange({
            ...data,
            authorisedPersonPanCard: items.length > 0 ? items[items.length - 1].id : "",
          })}
          maxFiles={1}
          containerClassName={errors.authorisedPersonPanCard ? "h-auto p-0 border-error" : "h-auto p-0"}
          previewGridClassName="grid-cols-1"
          itemClassName="aspect-video h-20"
          maxHeight="max-h-none"
        />
        {errors.authorisedPersonPanCard && <p className="text-xs text-error mt-1">{errors.authorisedPersonPanCard}</p>}
      </div>
      {/* End PAN Card MediaPicker Integration */}

      {/* Start Aadhar Card MediaPicker Integration */}
      <div className="w-full">
        <label className="label pt-0 pb-1.5 flex items-center justify-start gap-1">
          <span className="label-text font-semibold text-base-content">Upload Aadhar Card</span>
          <span className="text-error">*</span>
        </label>
        <MediaPicker
          value={createMinimalMediaItem(data.authorisedPersonAadharCard ?? "", "Authorised Person Aadhar")}
          onChange={(items) => onChange({
            ...data,
            authorisedPersonAadharCard: items.length > 0 ? items[items.length - 1].id : "",
          })}
          maxFiles={1}
          containerClassName={errors.authorisedPersonAadharCard ? "h-auto p-0 border-error" : "h-auto p-0"}
          previewGridClassName="grid-cols-1"
          itemClassName="aspect-video h-20"
          maxHeight="max-h-none"
        />
        {errors.authorisedPersonAadharCard && <p className="text-xs text-error mt-1">{errors.authorisedPersonAadharCard}</p>}
      </div>
      {/* End Aadhar Card MediaPicker Integration */}
    </div>
  );
};

export default AuthorisedPersonSection;