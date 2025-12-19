import { ColorValue } from "../types/variations.types";

// ============================================================================
// DEFAULT DATA
// ============================================================================

export const DEFAULT_SIZES = [
  { name: "XS", chest: "34-36", shoulder: 16.5, waist: "28-30", length_outseam: 27 },
  { name: "S", chest: "36-38", shoulder: 17.5, waist: "30-32", length_outseam: 28 },
  { name: "M", chest: "38-40", shoulder: 18.5, waist: "32-34", length_outseam: 29 },
  { name: "L", chest: "40-42", shoulder: 19.5, waist: "34-36", length_outseam: 30 },
  { name: "XL", chest: "42-44", shoulder: 20.5, waist: "36-38", length_outseam: 31 },
  { name: "XXL", chest: "44-46", shoulder: 21.5, waist: "38-40", length_outseam: 32 },
];

export const DEFAULT_COLORS: ColorValue[] = [
  { name: "Black", value: "#000000" },
  { name: "White", value: "#FFFFFF" },
  { name: "Red", value: "#EF4444" },
  { name: "Green", value: "#10B981" },
  { name: "Orange", value: "#F97316" },
  { name: "Pink", value: "#EC4899" },
  { name: "Gray", value: "#6B7280" },
  { name: "Blue", value: "#3B82F6" },
];

export const ADDITIONAL_VARIATIONS = [
  {
    key: "material",
    label: "Material",
    values: ["Cotton", "Polyester", "Silk", "Wool", "Linen", "Denim"],
  },
  {
    key: "pattern",
    label: "Pattern",
    values: ["Solid", "Striped", "Checkered", "Floral", "Geometric", "Abstract"],
  },
  {
    key: "fit",
    label: "Fit",
    values: ["Slim Fit", "Regular Fit", "Loose Fit", "Oversized"],
  },
  {
    key: "sleeve",
    label: "Sleeve Length",
    values: ["Sleeveless", "Short Sleeve", "3/4 Sleeve", "Long Sleeve"],
  },
  {
    key: "neckline",
    label: "Neckline",
    values: ["Crew Neck", "V-Neck", "Round Neck", "Collar", "Turtleneck"],
  },
  {
    key: "style",
    label: "Style",
    values: ["Casual", "Formal", "Sport", "Business", "Evening"],
  },
  {
    key: "season",
    label: "Season",
    values: ["Spring", "Summer", "Fall", "Winter", "All Season"],
  },
  {
    key: "wash",
    label: "Wash Type",
    values: ["Light Wash", "Medium Wash", "Dark Wash", "Stone Wash", "Acid Wash"],
  },
];