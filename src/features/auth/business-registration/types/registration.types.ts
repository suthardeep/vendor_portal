import { IconName } from "@/components/base/Icon";
import { 
  BankDetailsType, 
  BrandDetailsType, 
  BusinessDetailsType, 
  DeclarationType 
} from "../schemas/registration.schema";

export interface SidebarStep {
  id: number;
  title: string;
  description?: string;
  icon: IconName;
}

export interface RegistrationSidebarProps {
  currentStep: number;
  onStepClick: (stepId: number) => void;
  completedSteps: number[];
  steps: SidebarStep[]; // Made dynamic
}

export interface StepContainerProps {
  children: React.ReactNode;
}

export interface BusinessDetailsStepProps {
  data: BusinessDetailsType;
  onChange: (data: BusinessDetailsType) => void;
  errors: Record<string, string>;
}

export interface BrandDetailsStepProps {
  data: BrandDetailsType;
  onChange: (data: BrandDetailsType) => void;
  errors: Record<string, any>; 
}

export interface BankDetailsStepProps {
  data: BankDetailsType;
  onChange: (data: BankDetailsType) => void;
  errors: Record<string, string>;
}

export interface DeclarationStepProps {
  data: DeclarationType;
  onChange: (data: DeclarationType) => void;
  errors: Record<string, string>;
}

export interface FormData {
  businessDetails: BusinessDetailsType;
  brandDetails: BrandDetailsType;
  bankDetails: BankDetailsType;
  declaration: DeclarationType;
}