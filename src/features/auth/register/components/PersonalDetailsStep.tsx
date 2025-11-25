import { Input } from "@/components/base/Input";
import { PersonalDetailsStepProps } from "../types/registration.types";
import StepContainer from "./StepContainer";

const PersonalDetailsStep: React.FC<PersonalDetailsStepProps> = ({
  data,
  onChange,
  errors,
}) => {
  return (
    <StepContainer
      // title="Personal Details"
      // description="Please provide your basic information to get started."
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Input
          label="First Name"
          placeholder="Enter your first name"
          value={data.firstName}
          onChange={(e) => onChange({ ...data, firstName: e.target.value })}
          error={errors.firstName}
          required
          fullWidth
        />
        <Input
          label="Last Name"
          placeholder="Enter your last name"
          value={data.lastName}
          onChange={(e) => onChange({ ...data, lastName: e.target.value })}
          error={errors.lastName}
          required
          fullWidth
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <Input
          label="Email Address"
          type="email"
          placeholder="your.email@example.com"
          value={data.email}
          onChange={(e) => onChange({ ...data, email: e.target.value })}
          error={errors.email}
          required
          fullWidth
        />
        <Input
          label="Phone Number"
          type="tel"
          placeholder="Enter 10-digit phone number"
          value={data.phone}
          onChange={(e) => onChange({ ...data, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
          error={errors.phone}
          required
          fullWidth
        />
      </div>

      <Input
        label="Date of Birth"
        type="date"
        value={data.dateOfBirth}
        onChange={(e) => onChange({ ...data, dateOfBirth: e.target.value })}
        error={errors.dateOfBirth}
        required
        fullWidth
      />
    </StepContainer>
  );
};

export default PersonalDetailsStep;