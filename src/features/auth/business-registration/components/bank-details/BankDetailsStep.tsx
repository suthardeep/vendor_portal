import React, { useState } from "react";
import { BankDetailsStepProps } from "../../types/registration.types";
import StepContainer from "../StepContainer";
import { Input } from "@/components/base/Input";
import {Icon} from "@/components/base/Icon";
import {FileUploadField}  from "@/components/base/FileUploadField";

const BankDetailsStep: React.FC<BankDetailsStepProps> = ({ data, onChange, errors }) => {
  const [isDocumentVerified, setIsDocumentVerified] = useState(false);
  return (
    <StepContainer>
      <div className="space-y-4">
        <Input
          label="Bank Account number"
          placeholder="Type here"
          value={data.bankAccountNumber}
          onChange={(e) => onChange({ ...data, bankAccountNumber: e.target.value.replace(/\D/g, "") })}
          error={errors.bankAccountNumber}
          required
          type="password" // Masked for security usually, or text if preferred
          fullWidth
        />

        <Input
          label="IFSC Code"
          placeholder="Type here"
          value={data.ifscCode}
          onChange={(e) => onChange({ ...data, ifscCode: e.target.value.toUpperCase() })}
          error={errors.ifscCode}
          required
          fullWidth
          maxLength={11}
        />

        <Input
          label="Account Holder Name"
          placeholder="Type here"
          value={data.accountHolderName}
          onChange={(e) => onChange({ ...data, accountHolderName: e.target.value })}
          error={errors.accountHolderName}
          required
          fullWidth
        />

        <FileUploadField
          label="Upload cancelled cheque/bank proof"
          helperText="Upload a clear image of cancelled cheque or passbook front page"
          value={data.cancellationProof ? [data.cancellationProof] : []}
          onChange={(files) => onChange({ ...data, cancellationProof: files[0] || null })}
          error={errors.cancellationProof}
          required
          fullWidth
          maxFiles={1}
          showPreview
        />

        {!isDocumentVerified && (
          <div className="flex justify-end">
            {/* A visual indicator that bank is verified (Static for demo) */}
            <div className="flex items-center gap-1 text-success text-sm font-medium">
              <Icon name="CheckCircle2" className="text-success" /> Verified
            </div>
          </div>
        )}
      </div>
    </StepContainer>
  );
};

export default BankDetailsStep;
