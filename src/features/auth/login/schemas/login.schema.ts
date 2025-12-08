import { z } from "zod";

// Mobile number regex for Indian numbers (starts with 6-9 and is 10 digits)
const mobileRegex = /^[6-9]\d{9}$/;

export const LoginSchema = z.object({
  mobileNumber: z.string().regex(mobileRegex, "Please enter a valid 10-digit mobile number"),
});

export const OtpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;