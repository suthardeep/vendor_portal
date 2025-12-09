import { z } from "zod";

const mobileRegex = /^[6-9]\d{9}$/;

export const LoginSchema = z.object({
  phone: z.string().regex(mobileRegex, "Please enter a valid 10-digit mobile number"), 
});

export const OtpSchema = z.object({
  otp: z.string().length(6, "OTP must be 6 digits"),
});

export type LoginFormData = z.infer<typeof LoginSchema>;