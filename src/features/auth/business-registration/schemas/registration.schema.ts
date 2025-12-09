import { fileSchema } from "@/schema/fileSchema";
import z from "zod";

// New schema for file IDs (string, since only the ID from the media gallery is passed)
export const FileIdSchema = z.string().trim().min(1, "A document ID is required for this field");

export const BusinessDetailsSchema = z.object({
  hasGST: z.boolean(),
  gstNumber: z.string().trim().length(15, "Valid 15-digit GST number is required"),
  // RENAMED and TYPE CHANGED to ID
  gstCertificateId: FileIdSchema.optional().nullable(),
  businessName: z.string().trim().min(1, "Valid business name is required"),
  addressLine1: z.string().trim().min(5, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  pinCode: z.string().regex(/^[0-9]{5,6}$/, "Valid pin code is required"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  // TYPE CHANGED to ID
  panCard: FileIdSchema.optional().nullable(),
  // RENAMED and TYPE CHANGED to ID
  registrationCertificate: FileIdSchema.optional().nullable(),
  authorisedPersonName: z.string().trim().min(2, "Authorised person's name is required"),
  authorisedPersonEmail: z.email("Invalid email address"),
  authorisedPersonPhoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  // TYPE CHANGED to ID
  authorisedPersonPanCard: FileIdSchema.optional().nullable(),
  // TYPE CHANGED to ID
  authorisedPersonAadharCard: FileIdSchema.optional().nullable(),
  // RENAMED
  selfDeclared: z.boolean().refine((val) => val === true, "You must agree to the self-declaration"),
});

// Schema for businesses WITH GST
export const businessDetailsWithGSTSchema = BusinessDetailsSchema.omit({
  selfDeclared: true,
}).extend({
  // Make file IDs mandatory for the with-GST flow
  gstCertificateId: FileIdSchema,
  panCard: FileIdSchema,
  registrationCertificate: FileIdSchema,
  authorisedPersonPanCard: FileIdSchema,
  authorisedPersonAadharCard: FileIdSchema,
  hasGST: z.literal(true), // Explicitly ensure hasGST is true
});

// Schema for businesses WITHOUT GST (Requires all business/person details + declaration)
export const businessDetailsWithoutGSTSchema = BusinessDetailsSchema.omit({
    gstNumber: true,
    gstCertificateId: true,
}).extend({
    // Make file IDs mandatory for non-GST flow (based on UI sections being shown)
    panCard: FileIdSchema,
    registrationCertificate: FileIdSchema,
    authorisedPersonPanCard: FileIdSchema,
    authorisedPersonAadharCard: FileIdSchema,
    hasGST: z.literal(false), // Explicitly ensure hasGST is false
});


export const SingleBrandSchema = z.object({
  brandName: z.string().trim().min(1, "Brand name is required"),
  natureOfBusiness: z.string().min(1, "Nature of business is required"), // Radio string
selectedCategories: z
  .array(z.string())
  .min(1, "At least one category is required"),
  brandDocumentIds: z.array(z.string()).max(5, "Max 5 documents"),
  website: z.string().optional(),
  socialMedia: z.string().optional(),
});

export const BrandDetailsSchema = z.array(SingleBrandSchema).min(1, "At least one brand is required");


export const BankDetailsSchema = z.object({
  // RENAMED: from bankAccountNumber to accountNumber
  accountNumber: z.string().min(8, "Invalid account number").max(18, "Invalid account number"),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code"),
  accountHolderName: z.string().min(2, "Account holder name is required"),
  // RENAMED: from cancellationProof to bankProofDocumentId
  bankProofDocumentId: FileIdSchema.optional().nullable(),
}).extend({
  // Ensure it is required
  bankProofDocumentId: FileIdSchema, 
});


export const DeclarationSchema = z.object({
  agreed: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
});


export type BusinessDetailsType = z.infer<typeof BusinessDetailsSchema>;
export type SingleBrandType = z.infer<typeof SingleBrandSchema>;
export type BrandDetailsType = z.infer<typeof BrandDetailsSchema>;
export type BankDetailsType = z.infer<typeof BankDetailsSchema>;
export type DeclarationType = z.infer<typeof DeclarationSchema>;