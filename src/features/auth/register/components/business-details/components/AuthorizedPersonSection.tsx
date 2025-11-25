import { Input } from "@/components/base/Input";
import { BusinessDetailsType } from "../../../schemas/registration.schema";
import { MobileNumberInput } from "@/components/base/MobileNumberInput";
import Checkbox from "@/components/base/Checkbox";
import { useAuthStore } from "@/store/useAuthStore";
import { useState } from "react";
import FileUploadField from "@/components/base/FileUploadField";

const AuthorisedPersonSection: React.FC<{
  data: BusinessDetailsType;
  onChange: (data: BusinessDetailsType) => void;
  errors: Record<string, string>;
}> = ({ data, onChange, errors }) => {

  const {user} = useAuthStore();
  const [isSameAsBeforeChecked, setIsSameAsBeforeChecked] =  useState(false);

  const handleSameAsBeforeClick = (checked: boolean) => {
    setIsSameAsBeforeChecked(checked);
    if (checked) {
      onChange({
        ...data,
        authorisedPersonName: user?.name ?? "",
        authorisedPersonEmail: user?.email ?? "",
        authorisedPersonPhoneNumber: user?.phoneNumber ?? "",
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
      <FileUploadField
        label="Upload PAN Card"
        onChange={(files) => onChange({ ...data, authorisedPersonPanCard: files[0] || null })}
        error={errors.authorisedPersonPanCard}
        required
      />
      <FileUploadField
        label="Upload Aadhar Card"
        onChange={(files) => onChange({ ...data, authorisedPersonAadharCard: files[0] || null })}
        error={errors.authorisedPersonAadharCard}
        required
      />
    </div>
  );
};

export default AuthorisedPersonSection;
