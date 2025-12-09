import { Input } from "@/components/base/Input";
import { MediaPicker } from "@/components/media-picker/MediaPicker";
import { MediaItem } from "@/components/media-picker/MediaGallery";
import { BusinessDetailsStepProps } from "../../../types/registration.types";

// Helper function to create a minimal MediaItem for the picker's value prop
const createMinimalMediaItem = (id: string, name: string): MediaItem[] => {
  if (!id) return [];
  return [{ id, name, type: 'file', createdAt: new Date().toISOString() }];
};

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
      
      {/* Start MediaPicker Integration */}
      <div className="w-full">
        <label className="label pt-0 pb-1.5 flex items-center justify-start gap-1">
          <span className="label-text font-semibold text-base-content">Upload GST Certificate</span>
          <span className="text-error">*</span>
        </label>
        <MediaPicker
          value={createMinimalMediaItem(data.gstCertificateId ?? "", "GST Certificate")}
          onChange={(items) => {
            const selectedItem = items.length > 0 ? items[items.length - 1] : null;
            onChange({
              ...data,
              gstCertificateId: selectedItem?.id || "",
              gstCertificate: selectedItem?.url || "",
            });
          }}
          maxFiles={1}
          containerClassName={errors.gstCertificateId ? "h-auto p-0 border-error" : "h-auto p-0"}
          previewGridClassName="grid-cols-1"
          itemClassName="aspect-video h-20"
          maxHeight="max-h-none"
        />
        {errors.gstCertificateId && <p className="text-xs text-error mt-1">{errors.gstCertificateId}</p>}
      </div>
      {/* End MediaPicker Integration */}
    </div>
  );
};

export default GSTDetailsSection;