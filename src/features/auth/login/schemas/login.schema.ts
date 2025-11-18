
import z from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .email({ message: "Invalid Email Address" }),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(12, "Password must be less than 12 characters"),
phoneNumber: z.string().regex(/^\d{10}$/, "Invalid phone number"),
  date: z
    .string() // Change this to string since DateTimeInput returns string
    .refine(
      (value) => {
        if (!value) return false;
        const date = new Date(value);
        return date > new Date("2025-11-17");
      },
      { message: "Date must be after 17 Nov 2025" }
    ),

terms: z.boolean().refine(val => val === true, {
  message: "You must accept the terms"
})


});
export type LoginSchema = z.infer<typeof loginSchema>;
