import { z } from "zod";

// Form validation schema for pricing and shipping (string inputs)
export const variantPricingFormSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  mrp: z.string().min(1, "MRP is required").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "MRP must be a positive number"),
  sellingPrice: z.string().min(1, "Selling Price is required").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Selling Price must be a positive number"),
  aavakCoinsPrice: z.string().refine((val) => {
    if (!val) return true; // optional
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, "Aavak Coins Price must be a positive number or zero"),
  localCost: z.string().refine((val) => {
    if (!val) return true; // optional
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, "Local Cost must be a positive number or zero"),
  regionalCost: z.string().refine((val) => {
    if (!val) return true; // optional
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, "Regional Cost must be a positive number or zero"),
  nationalCost: z.string().refine((val) => {
    if (!val) return true; // optional
    const num = parseFloat(val);
    return !isNaN(num) && num >= 0;
  }, "National Cost must be a positive number or zero"),
  length: z.string().min(1, "Length is required").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Length must be a positive number"),
  width: z.string().min(1, "Width is required").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Width must be a positive number"),
  height: z.string().min(1, "Height is required").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Height must be a positive number"),
  weight: z.string().min(1, "Weight is required").refine((val) => {
    const num = parseFloat(val);
    return !isNaN(num) && num > 0;
  }, "Weight must be a positive number"),
}).refine((data) => {
  // Custom validation: Selling price should not be greater than MRP
  const mrp = parseFloat(data.mrp);
  const sellingPrice = parseFloat(data.sellingPrice);
  return sellingPrice <= mrp;
}, {
  message: "Selling Price cannot be greater than MRP",
  path: ["sellingPrice"],
});

// Type exports
export type VariantPricingFormData = z.infer<typeof variantPricingFormSchema>;

// Validation function
export const validateVariantPricingForm = (data: unknown) => {
  return variantPricingFormSchema.safeParse(data);
};
