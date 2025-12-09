import { Input } from "@/components/base/Input";
import { getCityStateFromPincode } from "@/api/external-api/getCityStateFromPincode";
import { MediaPicker } from "@/components/media-picker/MediaPicker";
import { MediaItem } from "@/components/media-picker/MediaGallery";
import { BusinessDetailsStepProps } from "../../../types/registration.types";

// Helper function to create a minimal MediaItem for the picker's value prop
const createMinimalMediaItem = (id: string, name: string): MediaItem[] => {
  if (!id) return [];
  return [{ id, name, type: 'file', createdAt: new Date().toISOString() }];
};

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
      
      {/* Start PAN Card MediaPicker Integration */}
      <div className="w-full">
        <label className="label pt-0 pb-1.5 flex items-center justify-start gap-1">
          <span className="label-text font-semibold text-base-content">PAN Card</span>
          <span className="text-error">*</span>
        </label>
        <MediaPicker
          value={createMinimalMediaItem(data.panCardId || "", "Business PAN Card")}
          onChange={(items) => {
            const selectedItem = items.length > 0 ? items[items.length - 1] : null;
            onChange({
              ...data,
              panCardId: selectedItem?.id || "",
              panCard: selectedItem?.url || "",
            });
          }}
          maxFiles={1}
          containerClassName={errors.panCardId ? "h-auto p-0 border-error" : "h-auto p-0"}
          previewGridClassName="grid-cols-1"
          itemClassName="aspect-video h-20"
          maxHeight="max-h-none"
        />
        {errors.panCardId && <p className="text-xs text-error mt-1">{errors.panCardId}</p>}
      </div>
      {/* End PAN Card MediaPicker Integration */}

      {/* Start Business Registration MediaPicker Integration */}
      <div className="w-full">
        <label className="label pt-0 pb-1.5 flex items-center justify-start gap-1">
          <span className="label-text font-semibold text-base-content">Business Registration</span>
          <span className="text-error">*</span>
        </label>
        <MediaPicker
          value={createMinimalMediaItem(data.registrationCertificateId || "", "Registration Certificate")}
          onChange={(items) => {
            const selectedItem = items.length > 0 ? items[items.length - 1] : null;
            onChange({
              ...data,
              registrationCertificateId: selectedItem?.id || "",
              registrationCertificate: selectedItem?.url || "",
            });
          }}
          maxFiles={1}
          containerClassName={errors.registrationCertificateId ? "h-auto p-0 border-error" : "h-auto p-0"}
          previewGridClassName="grid-cols-1"
          itemClassName="aspect-video h-20"
          maxHeight="max-h-none"
        />
        {errors.registrationCertificateId && <p className="text-xs text-error mt-1">{errors.registrationCertificateId}</p>}
      </div>
      {/* End Business Registration MediaPicker Integration */}
    </div>
  );
};

export default BusinessDetailsSection;