import { Input } from "@/components/base/Input";
import { BusinessDetailsType } from "../../../schemas/registration.schema";
import { MobileNumberInput } from "@/components/base/MobileNumberInput";
import { Checkbox } from "@/components/base/Checkbox";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import { MediaPicker } from "@/components/media-picker/MediaPicker";
import { BusinessDetailsStepProps } from "../../../types/registration.types";
import { MediaItem } from "@/components/media-picker/types/media.types";

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

      <MediaPicker
        // value={[{id: data.authorisedPersonPanCardId ?? '', s3Url: data.authorisedPersonPanCard ?? ''}]}
        label="Upload PAN Card"
        ids={data.authorisedPersonPanCardId}
        urls={data.authorisedPersonPanCard}
        onChange={(items) => {
          const selectedItem = items.length > 0 ? items[items.length - 1] : null;
          onChange({
            ...data,
            authorisedPersonPanCardId: selectedItem?.id || "",
            authorisedPersonPanCard: selectedItem?.s3Url || "",
          });
        }}
        maxFiles={1}
        itemClassName="max-h-[20dvh] w-full"
        orientation="vertical"
        required
        error={errors.authorisedPersonPanCardId}
        // iconConfig={{size:"xs"}}
        // gridConfig={}
      />

      <MediaPicker
        // value={[{id: data.authorisedPersonAadharCardId ?? '', s3Url: data.authorisedPersonAadharCard ?? ''}]}
        label="Upload Aadhar Card"
        ids={data.authorisedPersonAadharCardId}
        urls={data.authorisedPersonAadharCard}
        onChange={(items) => {
          const selectedItem = items.length > 0 ? items[items.length - 1] : null;
          onChange({
            ...data,
            authorisedPersonAadharCardId: selectedItem?.id || "",
            authorisedPersonAadharCard: selectedItem?.s3Url || "",
          });
        }}
        maxFiles={1}
        itemClassName="max-h-[20dvh] w-full"
        orientation="vertical"
        required
        error={errors.authorisedPersonAadharCardId}
      />
    </div>
  );
};

export default AuthorisedPersonSection;
