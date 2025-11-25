import { RadioGroup } from "@/components/base/RadioGroup";
import { BusinessDetailsStepProps } from "../../types/registration.types";
import StepContainer from "../StepContainer";
import Separator from "@/components/base/Separator";
import GSTDetailsSection from "./components/GSTDetailsSection";
import BusinessDetailsSection from "./components/BusinessDetailsSection";
import AuthorisedPersonSection from "./components/AuthorizedPersonSection";
import SelfDeclarationSection from "./components/SelfDeclarationSection";

const BusinessDetailsStep: React.FC<BusinessDetailsStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  return (
    <StepContainer
      // title="Business Details"
      // description="Please provide your business information."
    >
      <RadioGroup
        name="hasGST"
        label="Is your business currently registered for Goods and Services Tax (GST) compliance?"
        required
        value={data.hasGST ? 'yes' : 'no'}
        onValueChange={(value) => onChange({ ...data, hasGST: value === 'yes' })}
        error={errors.hasGST}
        groupClassName="mb-2"
        options={[
          { label: 'Yes', value: 'yes' },
          { label: 'No', value: 'no' },
        ]}
        orientation="horizontal"
      />

      {data.hasGST && (
        <div className="space-y-4">
          <Separator legend="GST Details" legendPosition="center" />
          <GSTDetailsSection data={data} onChange={onChange} errors={errors} />
          <Separator legend="Business Information" legendPosition="center" />
          <BusinessDetailsSection data={data} onChange={onChange} errors={errors} />
          <Separator legend="Authorised Person Details" legendPosition="center" />
          <AuthorisedPersonSection data={data} onChange={onChange} errors={errors} />
        </div>
      )}

      {!data.hasGST && (
        <div>
          <Separator legend="Self Declaration" legendPosition="center" />
          <SelfDeclarationSection data={data} onChange={onChange} />
        </div>
      )}
    </StepContainer>
  );
};

export default BusinessDetailsStep;