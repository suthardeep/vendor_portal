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

// API payload schemas (number inputs)
export const dimensionsSchema = z.object({
  length: z.number().min(0.1, "Length must be greater than 0"),
  width: z.number().min(0.1, "Width must be greater than 0"),
  height: z.number().min(0.1, "Height must be greater than 0"),
  weight: z.number().min(0.01, "Weight must be greater than 0"),
});

export const variantPricingSchema = z.object({
  variantId: z.string().min(1, "Variant ID is required"),
  mrp: z.number().min(1, "MRP must be greater than 0"),
  sellingPrice: z.number().min(1, "Selling price must be greater than 0"),
  aavakCoinsPrice: z.number().min(0, "Aavak coins price cannot be negative"),
  localCost: z.number().min(0, "Local cost cannot be negative"),
  regionalCost: z.number().min(0, "Regional cost cannot be negative"),
  nationalCost: z.number().min(0, "National cost cannot be negative"),
  dimensions: dimensionsSchema,
});

export const updateVariantsPricingSchema = z.object({
  variants: z.array(variantPricingSchema).min(1, "At least one variant is required"),
});

// Type exports
export type VariantPricingFormInputData = z.infer<typeof variantPricingFormSchema>;
export type VariantPricingFormData = z.infer<typeof variantPricingSchema>;
export type UpdateVariantsPricingFormData = z.infer<typeof updateVariantsPricingSchema>;

// Validation function
export const validateVariantPricingForm = (data: unknown) => {
  return variantPricingFormSchema.safeParse(data);
};