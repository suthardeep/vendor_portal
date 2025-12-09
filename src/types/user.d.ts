export interface Brand {
  website: string;
  brandName: string;
  socialMedia: string;
  brandDocumentIds: string[];
  natureOfBusiness: string;
  selectedCategories: string[];
}

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

export interface User {
  id?: string;
  aavakUserId: string;
  phone: string; 
  email: string | null;
  fullName: string | null;
  businessName?: string | null;
  taxId?: string | null;
  gstNumber?: string | null;
  panNumber?: string | null;
  brands?: Brand[];
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