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

export const brandDetailsSchema = z.array(z.object({
  brandName: z.string().trim().min(1, "Enter a valid name"),
  natureOfBusiness: z.enum(['Brand Owner', 'Manufacturer', 'Importer']),
  category: z.string().trim().min(1, "Category is required"),
  documents: z.array(fileSchema('Add valid documents')).max(5, "No more than 5 documents are allowed"),
  website: z.string().optional(),
  socialMedia: z.string().optional(),
}));


export const PersonalDetailsSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.email("Invalid email address"),
  phone: z.string().regex(/^[0-9]{10}$/, "Phone must be 10 digits"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
});

export const AddressDetailsSchema = z.object({
  street: z.string().min(5, "Street address is required"),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipCode: z.string().regex(/^[0-9]{5,6}$/, "Valid zip code is required"),
  country: z.string().min(2, "Country is required"),
});

// This is the self declaration for vendors who opt for GST, Declaration is last step for them.
export const SelfDeclarationSchema = z.object({
  selfDeclaration: z.boolean().refine((val) => val === true, "You must agree to the self-declaration"),
});

export const DocumentsSchema = z.object({
  documents: z.array(fileSchema("Enter valid files")).min(1, "At least one document is required"),
});


export type BusinessDetailsType = z.infer<typeof BusinessDetailsSchema>;
export type BrandDetailsType = z.infer<typeof brandDetailsSchema>;

export type PersonalDetailsType = z.infer<typeof PersonalDetailsSchema>;
export type AddressDetailsType = z.infer<typeof AddressDetailsSchema>;
export type DocumentsType = z.infer<typeof DocumentsSchema>;
