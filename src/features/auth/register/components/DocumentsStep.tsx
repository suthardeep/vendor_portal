import { FileUploadField } from "demaze-ui-lib/components";
import { DocumentsStepProps } from "../types/registration.types";
import StepContainer from "./StepContainer";

const DocumentsStep: React.FC<DocumentsStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  return (
    <StepContainer
      // title="Upload Documents"
      // description="Please upload the required documents for verification."
    >
      <FileUploadField
        label="Upload Documents"
        helperText="Supported formats: PDF, JPG, PNG, DOC. Max 10MB per file."
        error={errors.documents}
        multiple
        maxFileSize={10}
        maxFiles={5}
        allowedFileTypes={['image/*', '.pdf', '.doc', '.docx']}
        value={data.documents}
        onChange={(files) => onChange({ documents: files })}
        required
        fullWidth
        showPreview
        filesPerRow={4}
      />
    </StepContainer>
  );
};

export default DocumentsStep;