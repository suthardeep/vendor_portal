import { fileSchema } from "@/schema/fileSchema";
import z from "zod";

// Schema for file IDs and URLs (both required for backend payload)
export const FileIdSchema = z.string().trim().min(1, "A document ID is required for this field");
export const FileUrlSchema = z.string().url("A valid document URL is required");

export const BusinessDetailsSchema = z.object({
  hasGST: z.boolean(),
  gstNumber: z.string().trim().length(15, "Valid 15-digit GST number is required"),

  // 1. GST Certificate
  gstCertificateId: FileIdSchema.optional().nullable(),
  gstCertificate: FileUrlSchema.optional().nullable(),

  businessName: z.string().trim().min(1, "Valid business name is required"),
  addressLine1: z.string().trim().min(5, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  pinCode: z.string().regex(/^[0-9]{5,6}$/, "Valid pin code is required"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),

  // 2. Business PAN Card
  panCardId: FileIdSchema.optional().nullable(),
  panCard: FileUrlSchema.optional().nullable(),

  // 3. Business Registration Certificate
  registrationCertificateId: FileIdSchema.optional().nullable(),
  registrationCertificate: FileUrlSchema.optional().nullable(),

  authorisedPersonName: z.string().trim().min(2, "Authorised person's name is required"),
  authorisedPersonEmail: z.string().email("Invalid email address"),
  authorisedPersonPhoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),

  // 4. Authorised Person PAN Card
  authorisedPersonPanCardId: FileIdSchema.optional().nullable(),
  authorisedPersonPanCard: FileUrlSchema.optional().nullable(),

  // 5. Authorised Person Aadhar Card
  authorisedPersonAadharCardId: FileIdSchema.optional().nullable(),
  authorisedPersonAadharCard: FileUrlSchema.optional().nullable(),

  selfDeclared: z.boolean().refine((val) => val === true, "You must agree to the self-declaration"),
});

// Schema for businesses WITH GST
export const businessDetailsWithGSTSchema = BusinessDetailsSchema.omit({
  selfDeclared: true,
}).extend({
  // Make file IDs and URLs mandatory for the with-GST flow
  gstCertificateId: FileIdSchema,
  gstCertificate: FileUrlSchema,
  panCardId: FileIdSchema,
  panCard: FileUrlSchema,
  registrationCertificateId: FileIdSchema,
  registrationCertificate: FileUrlSchema,
  authorisedPersonPanCardId: FileIdSchema,
  authorisedPersonPanCard: FileUrlSchema,
  authorisedPersonAadharCardId: FileIdSchema,
  authorisedPersonAadharCard: FileUrlSchema,
  hasGST: z.literal(true),
});

// Schema for businesses WITHOUT GST (Requires all business/person details + declaration)
export const businessDetailsWithoutGSTSchema = BusinessDetailsSchema.omit({
    gstNumber: true,
    gstCertificateId: true,
    gstCertificate: true,
}).extend({
    // Make file IDs and URLs mandatory for non-GST flow
    panCardId: FileIdSchema,
    panCard: FileUrlSchema,
    registrationCertificateId: FileIdSchema,
    registrationCertificate: FileUrlSchema,
    authorisedPersonPanCardId: FileIdSchema,
    authorisedPersonPanCard: FileUrlSchema,
    authorisedPersonAadharCardId: FileIdSchema,
    authorisedPersonAadharCard: FileUrlSchema,
    hasGST: z.literal(false),
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
  accountNumber: z.string().min(8, "Invalid account number").max(18, "Invalid account number"),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code"),
  accountHolderName: z.string().min(2, "Account holder name is required"),
  
  // 6. Bank Proof Document - Both ID and URL required
  bankProofDocumentId: FileIdSchema,
  bankProofDocument: FileUrlSchema,
});


export const DeclarationSchema = z.object({
  agreed: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
});


export type BusinessDetailsType = z.infer<typeof BusinessDetailsSchema>;
export type SingleBrandType = z.infer<typeof SingleBrandSchema>;
export type BrandDetailsType = z.infer<typeof BrandDetailsSchema>;
export type BankDetailsType = z.infer<typeof BankDetailsSchema>;
export type DeclarationType = z.infer<typeof DeclarationSchema>;