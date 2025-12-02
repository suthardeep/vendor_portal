import { Input } from "@/components/base/Input";
import {FileUploadField}  from "@/components/base/FileUploadField";
import { BusinessDetailsStepProps } from "../../../types/registration.types";

const GSTDetailsSection: React.FC<BusinessDetailsStepProps> = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-4 bg-base-1 rounded-lg">
      {/* <h4 className="font-semibold text-base-content">GST Information</h4> */}
      <Input
        label="GST Number"
        tooltip="Yo brother enter your gst "
        placeholder="Enter your GST number"
        value={data.gstNumber || ""}
        onChange={(e) => onChange({ ...data, gstNumber: e.target.value })}
        error={errors.gstNumber}
        fullWidth
        required
      />

      <FileUploadField
        label="Upload GST Certificate"
        onChange={(files) => onChange({ ...data, gstCertificate: files[0] || null })}
        error={errors.gstCertificate}
        fullWidth
        required
      />
    </div>
  );
};

export default GSTDetailsSection;
