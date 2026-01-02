import { fileSchema } from "@/schema/fileSchema";
import z from "zod";

export const BusinessDetailsSchema = z.object({
  hasGST: z.boolean(),
  gstNumber: z.string().trim().length(15, "Valid 15-digit GST number is required"),

  // 1. GST Certificate
  gstCertificate: z.url("Valid GST certificate document is required").optional().nullable(),

  businessName: z.string().trim().min(1, "Valid business name is required"),
  addressLine1: z.string().trim().min(5, "Address Line 1 is required"),
  addressLine2: z.string().optional(),
  pinCode: z.string().regex(/^[0-9]{5,6}$/, "Valid pin code is required"),
  city: z.string().trim().min(2, "City is required"),
  state: z.string().trim().min(2, "State is required"),

  // 2. Business PAN Card
  panCard: z.url("Company's valid Pan card is required").optional().nullable(),

  // 3. Business Registration Certificate
  registrationCertificate: z
    .url("Company's valid registration certificate is required")
    .optional()
    .nullable(),

  authorisedPersonName: z.string().trim().min(2, "Authorised person's name is required"),
  authorisedPersonEmail: z.string().email("Invalid email address"),
  authorisedPersonPhoneNumber: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),

  authorisedPersonPanCard: z.url("Pan card for authorised person is required").optional().nullable(),
  authorisedPersonAadharCard: z.url("Aadhar card for authorised person is required").optional().nullable(),

  selfDeclared: z.boolean().refine((val) => val === true, "You must agree to the self-declaration"),
});

// Schema for businesses WITH GST
export const businessDetailsWithGSTSchema = BusinessDetailsSchema.omit({
  selfDeclared: true,
}).extend({
  // Make files mandatory for the with-GST flow
  gstCertificate: z.url("GST certificate is required"),
  panCard: z.url("Company's Pan card is required"),
  registrationCertificate: z.url("Registration certificate is required"),
  authorisedPersonPanCard: z.url("Pan card for authorised person is required"),
  authorisedPersonAadharCard: z.url("Aadhar card for authorised person is required"),
  hasGST: z.literal(true),
});

// Schema for businesses WITHOUT GST (Requires all business/person details + declaration)
export const businessDetailsWithoutGSTSchema = BusinessDetailsSchema.omit({
  gstNumber: true,
  gstCertificate: true,
}).extend({
  // Make files mandatory for non-GST flow
  panCard: z.url("Company's Pan card is required"),
  registrationCertificate: z.url("Registration certificate is required"),
  authorisedPersonPanCard: z.url("Pan card for authorised person is required"),
  authorisedPersonAadharCard: z.url("Aadhar card for authorised person is required"),
  hasGST: z.literal(false),
});

// =================================================== BRANDS SCHEMA ===================================================
export const RequiredBrandDocuments = z.object({
  name: z.string(),
  url: z.url("This brand document is required"),
});

export const RequiredBrandDocumentsGroup = z.object({
  groupName: z.string(),
  documents: z.array(RequiredBrandDocuments, "This document is required"),
});

export const SingleBrandSchema = z.object({
  brandName: z.string().trim().min(1, "Brand name is required"),
  natureOfBusiness: z.enum(["brandowner", "manufacturer", "importer"], "Nature of business is required"), // Radio string
  selectedCategoryIds: z.array(z.string()).min(1, "At least one category is required"),
  brandLogo: z.url("Brand logo is required"),
  website: z.url("Website must be a valid URL (https://...)").optional().or(z.literal("")),
  socialMedia: z.string().optional(),
  brandDocuments: z.array(RequiredBrandDocumentsGroup, "Documents are required"),
});

export const BrandDetailsSchema = z
  .array(SingleBrandSchema)
  .min(1, "At least one brand is required")
  .superRefine((brands, ctx) => {
    const seen = new Map<string, number>();

    brands.forEach((brand, index) => {
      const name = brand.brandName.trim().toLowerCase();

      if (seen.has(name)) {
        ctx.addIssue({
          code: "custom",
          message: "Brand name already exists",
          path: [index, "brandName"], // 👈 error shows on exact field
        });
      } else {
        seen.set(name, index);
      }
    });
  });

export const BankDetailsSchema = z.object({
  accountNumber: z.string().min(8, "Invalid account number").max(18, "Invalid account number"),
  ifscCode: z.string().regex(/^[A-Z]{4}0[A-Z0-9]{6}$/, "Invalid IFSC Code"),
  accountHolderName: z.string().min(2, "Account holder name is required"),
  bankProof: z.url("Bank proof is required"),
});

export const DeclarationSchema = z.object({
  agreed: z.boolean().refine((val) => val === true, "You must accept the terms and conditions"),
});

export type BusinessDetailsType = z.infer<typeof BusinessDetailsSchema>;
export type SingleBrandType = z.infer<typeof SingleBrandSchema>;
export type BrandDetailsType = z.infer<typeof BrandDetailsSchema>;
export type BankDetailsType = z.infer<typeof BankDetailsSchema>;
export type DeclarationType = z.infer<typeof DeclarationSchema>;
