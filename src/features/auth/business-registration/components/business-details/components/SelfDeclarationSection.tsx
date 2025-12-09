import {Checkbox}  from "@/components/base/Checkbox";
import { BusinessDetailsStepProps } from "../../../types/registration.types";

const SelfDeclarationSection: React.FC<BusinessDetailsStepProps> = ({ data, onChange, errors }) => {
  return (
    <div className="space-y-4 mt-2 bg-base-1 rounded-lg">
      {/* <div className="flex flex-col gap-2"> */}
        {/* <Label className="font-semibold text-base-content" required>
          Self Declaration
        </Label> */}
        <p className="text-body-content">
          Businesses not registered under the Goods and Services Tax (GST) are restricted to selling their
          products solely within the same state. Furthermore, to be eligible, your annual business turnover
          must not exceed 40 lakhs. It is crucial to meticulously monitor your sales to ensure compliance with
          this threshold and avoid any potential regulatory issues.
        </p>
      {/* </div> */}

      <Checkbox
        label="Yes, I accept the above terms."
        // RENAMED
        checked={data.selfDeclared || false}
        onChange={(checked) => onChange({ ...data, selfDeclared: checked })}
        required
        error={errors?.selfDeclared}
      />
    </div>
  );
};

export default SelfDeclarationSection;