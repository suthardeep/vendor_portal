import { Input } from "@/components/base/Input";

const BrandDetailsStep: React.FC<AddressDetailsStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  return (
    <StepContainer
      // title="Address Information"
      // description="Please provide your residential address details."
    >
      <Input
        label="Street Address"
        placeholder="Enter your street address"
        value={data.street}
        onChange={(e) => onChange({ ...data, street: e.target.value })}
        error={errors.street}
        required
        fullWidth
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Input
          label="City"
          placeholder="Enter your city"
          value={data.city}
          onChange={(e) => onChange({ ...data, city: e.target.value })}
          error={errors.city}
          required
          fullWidth
        />
        <Input
          label="State"
          placeholder="Enter your state"
          value={data.state}
          onChange={(e) => onChange({ ...data, state: e.target.value })}
          error={errors.state}
          required
          fullWidth
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Input
          label="Zip Code"
          placeholder="Enter zip code"
          value={data.zipCode}
          onChange={(e) => onChange({ ...data, zipCode: e.target.value })}
          error={errors.zipCode}
          required
          fullWidth
        />
        <Input
          label="Country"
          placeholder="Enter your country"
          value={data.country}
          onChange={(e) => onChange({ ...data, country: e.target.value })}
          error={errors.country}
          required
          fullWidth
        />
      </div>
    </StepContainer>
  );
};

export default BrandDetailsStep;