import { Input } from "@/components/base/Input";
import { getCityStateFromPincode } from "@/api/external-api/getCityStateFromPincode";
import { MediaPicker } from "@/components/media-picker/MediaPicker";
import { BusinessDetailsStepProps } from "../../../types/registration.types";

const BusinessDetailsSection: React.FC<BusinessDetailsStepProps> = ({ data, onChange, errors }) => {
  const handleAreaDetectionFromPincode = async (value: string) => {
    if (value.length !== 6) return;

    const result = await getCityStateFromPincode(value);
    if (result?.city && result?.state) {
      onChange({ ...data, pinCode: value, city: result.city, state: result.state });
    }
  };

  return (
    <div className="bg-base-1 rounded-lg flex flex-col md:grid md:grid-cols-2 gap-y-4 gap-x-2 ">
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
        onChange={(e) => {
          handleAreaDetectionFromPincode(e.target.value);
          onChange({ ...data, pinCode: e.target.value });
        }}
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

      <MediaPicker
        label="PAN Card"
        urls={data.panCard}
        onChange={(items) => {
          const selectedItem = items.length > 0 ? items[items.length - 1] : null;
          onChange({
            ...data,
            panCard: selectedItem?.s3Url || "",
          });
        }}
        maxFiles={1}
        itemClassName="w-full"
        required
        error={errors.panCard}
      />

      <MediaPicker
        label="Business Registration"
        urls={data.registrationCertificate}
        onChange={(items) => {
          const selectedItem = items.length > 0 ? items[items.length - 1] : null;
          onChange({
            ...data,
            registrationCertificate: selectedItem?.s3Url || "",
          });
        }}
        maxFiles={1}
        itemClassName="w-full"
        required
        error={errors.registrationCertificate}
      />
    </div>
  );
};

export default BusinessDetailsSection;
