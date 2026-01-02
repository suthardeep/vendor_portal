import { Input } from "@/components/base/Input";
import { MediaPicker } from "@/components/media-picker/MediaPicker";
import { BusinessDetailsStepProps } from "../../../types/registration.types";

const GSTDetailsSection: React.FC<BusinessDetailsStepProps> = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-4 bg-base-1 rounded-lg">
      <Input
        label="GST Number"
        placeholder="Enter your GST number"
        value={data.gstNumber || ""}
        onChange={(e) => onChange({ ...data, gstNumber: e.target.value })}
        error={errors.gstNumber}
        fullWidth
        required
      />

      <MediaPicker
        label="Upload GST Certificate"
        required
        urls={data.gstCertificate}
        onChange={(items) => {
          const selectedItem = items.length > 0 ? items[items.length - 1] : null;
          onChange({
            ...data,
            gstCertificate: selectedItem?.s3Url || "",
          });
        }}
        maxFiles={1}
        itemClassName="w-full"
        error={errors.gstCertificate}
      />
    </div>
  );
};

export default GSTDetailsSection;
