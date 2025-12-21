export interface VendorProfile {
  id: string;
  aavakUserId: string;
  phone: string;
  email: string;
  fullName: string;
  phoneVerified: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
  businessName: string;
  gstNumber: string;
  selfDeclared: boolean;
  gstCertificate: string;
  gstCertificateId: string;
  brands: Array<{
    website: string;
    brandName: string;
    socialMedia: string;
    brandDocuments: string[];
    brandDocumentIds: string[];
    natureOfBusiness: string;
    selectedCategories: string[];
  }>;
  verificationStatus: string;
  isActive: boolean;
  isCompleted: boolean;
  onboardingStep: number;
  businessAddress: {
    name: string;
    addressLine1: string;
    addressLine2: string | null;
    pinCode: string;
    city: string;
    state: string;
    panCard: string;
    panCardId: string;
    registrationCertificate: string;
    registrationCertificateId: string;
  };
  authorisedPersonDetails: {
    name: string;
    mobileNumber: string;
    email: string;
    panCard: string;
    panCardId: string;
    aadharCard: string;
    aadharCardId: string;
  };
  bankDetails: {
    accountNumber: string;
    ifscCode: string;
    accountHolderName: string;
    bankProof: string;
    bankProofId: string;
  };
  rejectionStep: string | null;
  rejectionReason: string | null;
  rejectionHistory: any | null;
  lastRejectionAt: string | null;
  hasVendorProfile: boolean;
  onboarding: {
    isCompleted: boolean;
    currentStep: number;
    completedSteps: number;
    totalSteps: number;
    steps: Array<{
      step: number;
      name: string;
      description: string;
      completed: boolean;
      required: boolean;
      missingRequirements: string[];
      completedAt?: string;
    }>;
    completionPercentage: number;
    nextStep: string;
    canProceedToVerification: boolean;
  };
  platforms: any[];
  deviceId: string | null;
  fcmToken: string | null;
  hashToken: string | null;
  isNewProfile: boolean;
}

export interface GetProfileResponse {
  statusCode: number;
  message: string;
  data: VendorProfile;
}