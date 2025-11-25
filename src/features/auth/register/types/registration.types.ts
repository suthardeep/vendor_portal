import { IconName } from "@/components/base/Icon";
import { AddressDetailsType, BrandDetailsType, BusinessDetailsType, DocumentsType, PersonalDetailsType } from "../schemas/registration.schema";

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
}

export interface StepContainerProps {
  // title: string;
  // description?: string;
  children: React.ReactNode;
}

export interface PersonalDetailsStepProps {
  data: PersonalDetailsType;
  onChange: (data: PersonalDetailsType) => void;
  errors: Record<string, string>;
}

export interface AddressDetailsStepProps {
  data: AddressDetailsType;
  onChange: (data: AddressDetailsType) => void;
  errors: Record<string, string>;
}

export interface BusinessDetailsStepProps {
  data: BusinessDetailsType;
  onChange: (data: BusinessDetailsType) => void;
  errors: Record<string, string>;
}

export interface BrandDetailsStepProps {
  data: BusinessDetailsType;
  onChange: (data: BusinessDetailsType) => void;
  errors: Record<string, string>;
}

export interface DocumentsStepProps {
  data: DocumentsType;
  onChange: (data: DocumentsType) => void;
  errors: Record<string, string>;
}

export interface FormData {
  businessDetails: BusinessDetailsType;
  brandDetails: BrandDetailsType;
  personalDetails: PersonalDetailsType;
  addressDetails: AddressDetailsType;
  selfDeclaration: boolean;
  documents: DocumentsType;
}