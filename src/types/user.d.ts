// export interface Brand {
//   website: string;
//   brandName: string;
//   socialMedia: string;
//   brandDocumentIds: string[];
//   natureOfBusiness: string;
//   selectedCategories: string[];
// }

import { BrandDetailsType } from "@/features/auth/business-registration/schemas/registration.schema";

export interface OnboardingStep {
  step: number;
  name: string;
  description: string;
  completed: boolean;
  required: boolean;
  missingRequirements: string[];
  completedAt?: string;
}

export interface Onboarding {
  isCompleted: boolean;
  currentStep: number;
  totalSteps: number;
  steps: OnboardingStep[];
  completionPercentage: number;
  nextStep: string;
  canProceedToVerification: boolean;
}

export interface BusinessDetails {
  name: string;
  addressLine1: string;
  addressLine2?: string;
  pinCode: string;
  city: string;
  state: string;
  panCard: string;
  panCardId: string;
  registrationCertificate: string;
  registrationCertificateId: string;
}

export interface AuthorisedPersonDetails {
  name: string;
  mobileNumber: string;
  email: string;
  panCard: string;
  panCardId: string;
  aadharCard: string;
  aadharCardId: string;
}

export interface BankDetails {
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
  bankProofDocumentId?: string;
  bankProofDocument?: string;
  // API response uses different field names
  bankProofId?: string;
  bankProof?: string;
}

export interface User {
  id?: string;
  aavakUserId: string;
  phone: string; 
  email: string | null;
  fullName: string | null;
  businessName?: string | null;
  businessDetails?: BusinessDetails;
  authorisedPersonDetails?: AuthorisedPersonDetails;
  gstNumber?: string | null;
  gstCertificate?: string | null;
  gstCertificateId?: string | null;
  selfDeclared?: boolean;
  taxId?: string | null;
  panNumber?: string | null;
  brands?: BrandDetailsType;
  bankDetails?: BankDetails;
  businessAddress?: string | null;
  verificationStatus?: string;
  platforms: string[];
  phoneVerified: boolean;
  emailVerified: boolean; 
  isActive: boolean;
  deviceId: string | null;
  fcmToken: string | null;
  hashToken: string;
  isNewProfile?: boolean;
  hasVendorProfile?: boolean;
  onboarding?: Onboarding;
  rejectionStep?: string | null;
  rejectionReason?: string | null;
  rejectionHistory?: any | null;
  lastRejectionAt?: string | null;
  isCompleted?: boolean;
  onboardingStep?: number;
  createdAt: string;
  updatedAt: string;
}