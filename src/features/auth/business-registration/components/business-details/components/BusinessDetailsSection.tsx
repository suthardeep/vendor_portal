import { Input } from "@/components/base/Input";
import { getCityStateFromPincode } from "@/api/external-api/getCityStateFromPincode";
import {FileUploadField}  from "@/components/base/FileUploadField";
import { BusinessDetailsStepProps } from "../../../types/registration.types";

const BusinessDetailsSection: React.FC<BusinessDetailsStepProps> = ({ data, onChange, errors }) => {
  const handlePincodeBlur = async () => {
    const result = await getCityStateFromPincode(data.pinCode);
    if (result?.city && result?.state) {
      onChange({ ...data, city: result.city, state: result.state });
    }
  };

  return (
    <div className="bg-base-1 rounded-lg flex flex-col md:grid md:grid-cols-2 gap-y-4 gap-x-2 ">
      {/* <h4 className="font-semibold text-base-content">Business Information</h4> */}
      <Input
        label="Business Name"
        placeholder="Enter your business name"
        value={data.businessName || ""}
        onChange={(e) => onChange({ ...data, businessName: e.target.value })}
        error={errors.businessName}
        containerClassName="col-span-2"
        required
      />
      <Input
        label="Address Line 1"
        placeholder="Enter address line 1"
        value={data.addressLine1 || ""}
        onChange={(e) => onChange({ ...data, addressLine1: e.target.value })}
        error={errors.addressLine1}
        containerClassName="col-span-2"
        required
      />
      <Input
        label="Address Line 2"
        placeholder="Enter address line 2"
        value={data.addressLine2 || ""}
        onChange={(e) => onChange({ ...data, addressLine2: e.target.value })}
        error={errors.addressLine2}
      />
      <Input
        label="Pin Code"
        placeholder="Enter your pin code"
        type="number"
        value={data.pinCode || ""}
        onChange={(e) => onChange({ ...data, pinCode: e.target.value })}
        onBlur={handlePincodeBlur}
        error={errors.pinCode}
        required
      />
      <Input
        label="City"
        placeholder="Enter your city"
        value={data.city || ""}
        onChange={(e) => onChange({ ...data, city: e.target.value })}
        error={errors.city}
        required
      />
      <Input
        label="State"
        placeholder="Enter your state"
        value={data.state || ""}
        onChange={(e) => onChange({ ...data, state: e.target.value })}
        error={errors.state}
        required
      />
      <FileUploadField
        label="PAN Card"
        onChange={(files) => onChange({ ...data, panCard: files[0] || null })}
        error={errors.panCard}
        // containerClassName="flex flex-col"
        // dropzoneClassName="mt-auto"
        required
      />
      <FileUploadField
        label="Business Registration"
        onChange={(files) => onChange({ ...data, businessRegistrationCertificate: files[0] || null })}
        error={errors.businessRegistrationCertificate}
        // containerClassName="flex flex-col"
        // dropzoneClassName="mt-auto"
        required
      />
    </div>
  );
};

export default BusinessDetailsSection;
