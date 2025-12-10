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
  const brands = profileData.brands || [initialBrandState];
  const bankDetails = profileData.bankDetails;

  return {
    businessDetails: {
      // Basic business info - if selfDeclared is true, user chose "without GST"
      hasGST: profileData.selfDeclared ? false : !!profileData.gstNumber,
      gstNumber: profileData.gstNumber || "",
      gstCertificateId: profileData.gstCertificateId || "",
      gstCertificate: profileData.gstCertificate || "",
      
      businessName: businessDetails?.name || "",
      addressLine1: businessDetails?.addressLine1 || "",
      addressLine2: businessDetails?.addressLine2 || "",
      pinCode: businessDetails?.pinCode || "",
      city: businessDetails?.city || "",
      state: businessDetails?.state || "",
      
      // Business documents
      panCardId: businessDetails?.panCardId || "",
      panCard: businessDetails?.panCard || "",
      registrationCertificateId: businessDetails?.registrationCertificateId || "",
      registrationCertificate: businessDetails?.registrationCertificate || "",
      
      // Authorised person info
      authorisedPersonName: authorisedPersonDetails?.name || "",
      authorisedPersonEmail: authorisedPersonDetails?.email || "",
      authorisedPersonPhoneNumber: authorisedPersonDetails?.mobileNumber || "",
      
      // Authorised person documents
      authorisedPersonPanCardId: authorisedPersonDetails?.panCardId || "",
      authorisedPersonPanCard: authorisedPersonDetails?.panCard || "",
      authorisedPersonAadharCardId: authorisedPersonDetails?.aadharCardId || "",
      authorisedPersonAadharCard: authorisedPersonDetails?.aadharCard || "",
      
      selfDeclared: profileData.selfDeclared || false,
    },
    
    brandDetails: brands.map(brand => ({
      brandName: brand.brandName || "",
      natureOfBusiness: brand.natureOfBusiness || "",
      selectedCategories: brand.selectedCategories || [],
      brandDocumentIds: brand.brandDocumentIds || [],
      website: brand.website || "",
      socialMedia: brand.socialMedia || "",
    })),
    
    bankDetails: {
      accountNumber: bankDetails?.accountNumber || "",
      ifscCode: bankDetails?.ifscCode || "",
      accountHolderName: bankDetails?.accountHolderName || "",
      bankProofDocumentId: (bankDetails as any)?.bankProofId || "",
      bankProofDocument: (bankDetails as any)?.bankProof || "",
    },
    
    declaration: {
      agreed: false, // Always start as false for declaration
    },
  };
};