import { User } from "@/types/user";
import { FormData } from "../types/registration.types";
import { initialBrandState } from "../components/brand-details/BrandDetailsStep";

/**
 * Transforms profile API response data back to form structure
 * Used to prefill forms when user returns to previously completed steps
 */
export const prefillFormFromProfile = (profileData: User): FormData => {
  const businessDetails = profileData.businessDetails;
  const authorisedPersonDetails = profileData.authorisedPersonDetails;
  const brands = profileData.brands?.length ? profileData.brands : [initialBrandState];
  const bankDetails = profileData.bankDetails;

  return {
    businessDetails: {
      // Basic business info - if selfDeclared is true, user chose "without GST"
      hasGST: profileData.selfDeclared ? false : !!profileData.gstNumber,
      gstNumber: profileData.gstNumber || "",
      gstCertificate: profileData.gstCertificate || "",

      businessName: businessDetails?.name || "",
      addressLine1: businessDetails?.addressLine1 || "",
      addressLine2: businessDetails?.addressLine2 || "",
      pinCode: businessDetails?.pinCode || "",
      city: businessDetails?.city || "",
      state: businessDetails?.state || "",

      // Business documents
      panCard: businessDetails?.panCard || "",
      registrationCertificate: businessDetails?.registrationCertificate || "",

      // Authorised person info
      authorisedPersonName: authorisedPersonDetails?.name || "",
      authorisedPersonEmail: authorisedPersonDetails?.email || "",
      authorisedPersonPhoneNumber: authorisedPersonDetails?.mobileNumber || "",

      // Authorised person documents
      authorisedPersonPanCard: authorisedPersonDetails?.panCard || "",
      authorisedPersonAadharCard: authorisedPersonDetails?.aadharCard || "",

      selfDeclared: profileData.selfDeclared || false,
    },

    brandDetails: brands.map((brand) => ({
      brandName: brand.brandName || "",
      natureOfBusiness: brand.natureOfBusiness || "",
      selectedCategoryIds: brand.selectedCategoryIds || [],
      brandLogo: brand.brandLogo || "",
      website: brand.website || "",
      socialMedia: brand.socialMedia || "",
      brandDocuments: brand.brandDocuments || [],
    })),

    bankDetails: {
      accountNumber: bankDetails?.accountNumber || "",
      ifscCode: bankDetails?.ifscCode || "",
      accountHolderName: bankDetails?.accountHolderName || "",
      bankProof: bankDetails?.bankProof || "",
    },

    declaration: {
      agreed: profileData.onboarding?.isCompleted || false, // Always start as false for declaration
    },
  };
};
