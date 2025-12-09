import React, { useState } from "react";
import { BankDetailsStepProps } from "../../types/registration.types";
import StepContainer from "../StepContainer";
import { Input } from "@/components/base/Input";
import {Icon} from "@/components/base/Icon";
import { MediaPicker } from "@/components/media-picker/MediaPicker";
import { MediaItem } from "@/components/media-picker/MediaGallery";

// Helper function to create a minimal MediaItem for the picker's value prop
const createMinimalMediaItem = (id: string, name: string): MediaItem[] => {
  if (!id) return [];
  return [{ id, name, type: 'file', createdAt: new Date().toISOString() }];
};

const BankDetailsStep: React.FC<BankDetailsStepProps> = ({ data, onChange, errors }) => {
  const [isDocumentVerified, setIsDocumentVerified] = useState(false);
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

        {/* Start Cancellation Proof MediaPicker Integration */}
        <div className="w-full">
          <label className="label pt-0 pb-1.5 flex items-center justify-start gap-1">
            <span className="label-text font-semibold text-base-content">Upload cancelled cheque/bank proof</span>
            <span className="text-error">*</span>
          </label>
          <p className="text-xs text-body-content/60 mb-2">Upload a clear image of cancelled cheque or passbook front page</p>
          <MediaPicker
            // UPDATED KEY: cancellationProof -> bankProofDocumentId
            value={createMinimalMediaItem(data.bankProofDocumentId, "Cancelled Cheque/Proof")}
            onChange={(items) => onChange({
              ...data,
              // UPDATED KEY: cancellationProof -> bankProofDocumentId
              bankProofDocumentId: items.length > 0 ? items[items.length - 1].id : "",
            })}
            maxFiles={1}
            // UPDATED ERROR KEY: cancellationProof -> bankProofDocumentId
            containerClassName={errors.bankProofDocumentId ? "h-auto p-0 border-error" : "h-auto p-0"}
            previewGridClassName="grid-cols-1"
            itemClassName="aspect-video h-20"
            maxHeight="max-h-none"
          />
          {errors.bankProofDocumentId && <p className="text-xs text-error mt-1">{errors.bankProofDocumentId}</p>}
        </div>
        {/* End Cancellation Proof MediaPicker Integration */}

        {!isDocumentVerified && (
          <div className="flex justify-end">
            {/* A visual indicator that bank is verified (Static for demo) */}
            
          </div>
        )}
      </div>
    </StepContainer>
  );
};

export default BankDetailsStep;