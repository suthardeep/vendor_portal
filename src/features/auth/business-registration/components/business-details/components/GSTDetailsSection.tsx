import { Input } from "@/components/base/Input";
import { MediaPicker } from "@/components/media-picker/MediaPicker";
import { BusinessDetailsStepProps } from "../../../types/registration.types";

const GSTDetailsSection: React.FC<BusinessDetailsStepProps> = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-4 bg-base-1 rounded-lg">
      {/* <h4 className="font-semibold text-base-content">GST Information</h4> */}
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
        // value={[{id: data.gstCertificateId ?? '', s3Url: data.gstCertificate ?? ''}]}
        label="Upload GST Certificate"
        required
        ids={data.gstCertificateId}
        urls={data.gstCertificate}
        onChange={(items) => {
          const selectedItem = items.length > 0 ? items[items.length - 1] : null;
          onChange({
            ...data,
            gstCertificateId: selectedItem?.id || "",
            gstCertificate: selectedItem?.s3Url || "",
          });
        }}
        maxFiles={1}
        itemClassName="max-h-[25dvh] w-full"
        orientation="vertical"
        error={errors.gstCertificateId}
      />
    </div>
  );
};

export default GSTDetailsSection;
