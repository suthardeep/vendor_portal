import { z } from "zod";

export const RegistrationSchema = z.object({
  fullName: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().email("Invalid email address"),
  // Validation strictly checks if true
  agreed: z.boolean().refine((val) => val === true, "You must agree to the Terms & Privacy Policy"),
});

export type RegistrationFormData = z.infer<typeof RegistrationSchema>;

// Schema specifically for the OTP input (6 digits)
export const OtpSchema = z.string().length(6, "OTP must be 6 digits");