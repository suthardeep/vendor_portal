import React from "react";
import {Checkbox}  from "@/components/base/Checkbox";
import {Icon} from "@/components/base/Icon";
import { DeclarationStepProps } from "../../types/registration.types";
import StepContainer from "../StepContainer";

const DeclarationStep: React.FC<DeclarationStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  return (
    <StepContainer>
      <div className="space-y-3">
        <div className="flex gap-4 p-2 bg-primary-50 dark:bg-primary-900/20 rounded-xl border border-primary-100 dark:border-primary-800">
            <div className="shrink-0">
                <div className="w-10 h-10 rounded-full bg-primary text-white flex items-center justify-center">
                    <Icon name="FileText" className="text-primary-content" size={20} />
                </div>
            </div>
            <div>
                <h3 className="font-semibold text-lg text-base-content">Terms & Declaration</h3>
                <p className="text-sm text-body-content mt-1">
                    Please review the terms carefully before submitting your application.
                </p>
            </div>
        </div>

        <div className="prose prose-sm dark:prose-invert max-w-none text-body-content bg-base-2 p-4 rounded-lg max-h-80 overflow-y-auto border border-base-3">
          <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. 
            Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, 
            when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
            It has survived not only five centuries, but also the leap into electronic typesetting, 
            remaining essentially unchanged.
          </p>
          <p className="mt-4">
            It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, 
            and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
          </p>
          <p className="mt-4">
            By clicking submit, you agree that all information provided is accurate and you are authorized 
            to act on behalf of the business entity listed in this application.
          </p>
        </div>

        <div className="pt-2">
            <Checkbox
            label="Yes, I accept the above terms."
            checked={data.agreed || false}
            onChange={(checked) => onChange({ ...data, agreed: checked })}
            error={errors.agreed}
            className="font-medium"
            required
            />
        </div>
      </div>
    </StepContainer>
  );
};

export default DeclarationStep;