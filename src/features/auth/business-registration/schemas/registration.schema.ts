// ============================================================================
// SCHEMAS - Zod Validation Schemas for each step
// ============================================================================

import { fileSchema } from "@/schema/fileSchema";
import z from "zod";

// STEP-1 This is the full schema for Business Details of vendor
export const BusinessDetailsSchema = z.object({
  hasGST: z.boolean(),
  gstNumber: z.string().trim().length(15, "Valid 15-digit GST number is required"),
  gstCertificate: fileSchema("GST Certificate is required"),
  businessName: z.string().trim().min(1, "Valid business name is required"),
  addressLine1: z.string().trim().min(5, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  pinCode: z.string().regex(/^[0-9]{5,6}$/, "Valid pin code is required"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),
  panCard: fileSchema("PAN Card is required"),
  businessRegistrationCertificate: fileSchema("Business Registration Certificate is required"),
  authorisedPersonName: z.string().trim().min(2, "Authorised person's name is required"),
  authorisedPersonEmail: z.email("Invalid email address"),
  authorisedPersonPhoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  authorisedPersonPanCard: fileSchema("Authorised person's PAN Card is required"),
  authorisedPersonAadharCard: fileSchema("Authorised person's Aadhar Card is required"),
  selfDeclaration: z.boolean().refine((val) => val === true, "You must agree to the self-declaration"),
});

// STEP-1.1 This is the zod schema for vendors who opt for GST, Declaration is last step for them so we omit it here.
export const businessDetailsWithGSTSchema = BusinessDetailsSchema.omit({
  selfDeclaration: true,
})

// STEP-1.2 This is the zod schema for vendors who havent opt for GST, Declaration is the only thing for them.
export const businessDetailsWithoutGSTSchema = BusinessDetailsSchema.pick({
  hasGST: true,
  selfDeclaration: true,
});

// --- STEP 2: BRAND DETAILS (Array) ---
export const SingleBrandSchema = z.object({
  brandName: z.string().trim().min(1, "Brand name is required"),
  natureOfBusiness: z.string().min(1, "Nature of business is required"), // Radio string
  category: z.string().min(1, "Category is required"),
  documents: z.array(fileSchema('Valid document required', false)).max(5, "Max 5 documents"),
  website: z.string().optional(),
  socialMedia: z.string().optional(),
});

export const BrandDetailsSchema = z.array(SingleBrandSchema).min(1, "At least one brand is required");


// --- STEP 3: BANK DETAILS ---
export const BankDetailsSchema = z.object({
  bankAccountNumber: z.string().min(8, "Invalid account number").max(18, "Invalid account number"),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code"),
  accountHolderName: z.string().min(2, "Account holder name is required"),
  cancellationProof: fileSchema("Cancelled cheque/proof is required", false),
});


// --- STEP 4: DECLARATION (Only for GST users) ---
export const DeclarationSchema = z.object({
  agreed: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
});


// --- TYPES ---
export type BusinessDetailsType = z.infer<typeof BusinessDetailsSchema>;
export type SingleBrandType = z.infer<typeof SingleBrandSchema>;
export type BrandDetailsType = z.infer<typeof BrandDetailsSchema>;
export type BankDetailsType = z.infer<typeof BankDetailsSchema>;
export type DeclarationType = z.infer<typeof DeclarationSchema>;