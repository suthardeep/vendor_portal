import React, { useState } from "react";
import { BankDetailsStepProps } from "../../types/registration.types";
import StepContainer from "../StepContainer";
import { Input } from "@/components/base/Input";
// import { Icon } from "@/components/base/Icon";
import { MediaPicker } from "@/components/media-picker/MediaPicker";

const BankDetailsStep: React.FC<BankDetailsStepProps> = ({ data, onChange, errors }) => {
  // const [isDocumentVerified, setIsDocumentVerified] = useState(false);
  return (
    <StepContainer>
      <div className="space-y-4">
        <Input
          label="Bank Account number"
          placeholder="Type here"
          // UPDATED KEY: bankAccountNumber -> accountNumber
          value={data.accountNumber}
          onChange={(e) => onChange({ ...data, accountNumber: e.target.value.replace(/\D/g, "") })}
          error={errors.accountNumber}
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

        <MediaPicker
          // value={[{id:data.bankProofDocumentId ?? "", s3Url: data.bankProofDocument ?? "" }]}
          label="Upload cancelled cheque/bank proof"
          ids={data.bankProofDocumentId}
          urls={data.bankProofDocument}
          onChange={(items) => {
            const selectedItem = items.length > 0 ? items[items.length - 1] : null;
            onChange({
              ...data,
              bankProofDocumentId: selectedItem?.id || "",
              bankProofDocument: selectedItem?.s3Url || "",
            });
          }}
          maxFiles={1}
          itemClassName="max-h-[20dvh] w-full"
          orientation="vertical"
          required
          error={errors.bankProofDocumentId}
        />

        {/* A visual indicator that bank is verified (Static for demo) */}
        {/* {!isDocumentVerified && (
          <div className="flex justify-end">
            
          </div>
        )} */}
      </div>
    </StepContainer>
  );
};

export default BankDetailsStep;
