import { BaseResponse } from "@/api/types/response.types";

// ============================================================================
// SIZE CHART TYPES
// ============================================================================

export interface SizeChartRow {
  sizeName: string;
  values: Record<string, string>;
}

export interface SizeObject {
  name: string;
  [key: string]: string | number;
}

export interface CustomSizeChart {
  chartName: string;
  unit: string;
  columns: string[];
  rows: SizeChartRow[];
  sizeObjects: SizeObject[];
}

// ============================================================================
// VARIATION CREATION TYPES (Step 1 - Variation Selection)
// ============================================================================

export interface ColorValue {
  name: string;
  value: string;
}

export interface VariationCreationProp {
  enabled: boolean;
  // Selected can hold strings (simple values) or objects (like sizes/colors)
  selected: (string | SizeObject | ColorValue)[];
  label: string;
  values?: (string | ColorValue)[];
  // Helper to track which custom charts are currently active/selected
  activeCharts?: string[];
}

export interface VariationCreationState {
  [key: string]: VariationCreationProp;
}

// ============================================================================
// COMBINATION TYPES (Generated from variations)
// ============================================================================

export interface CombinationItem {
  _id: string; // Added for reliable deletion
  [key: string]: any;
}

export interface VariationsApiResponse {
  productId: string;
  combinations: CombinationItem[];
}

// ============================================================================
// VARIANT TYPES (Step 2 - Individual Variant Details)
// ============================================================================

export interface VariantAttributes {
  size?: string;
  color?: string;
  [key: string]: any; // For any additional attributes
}

export interface VariantDimensions {
  width: number;
  height: number;
  length: number;
  weight: number;
}

export interface VariantDeliveryCharges {
  local: {
    cost: number;
    unitDelivered: number;
  };
  regional: {
    cost: number;
    unitDelivered: number;
  };
  national: {
    cost: number;
    unitDelivered: number;
  };
}

export interface VariantCalculatedPricing {
  onLocal: number;
  onRegional: number;
  onNational: number;
  userGets: number;
}

export interface VariantItem {
  id: string;
  aavakSku: string;
  sellerSku: string;
  targetAge: string;
  targetGender: string;
  eanUpc: string;
  description: string;
  mediaUrls: string[];
  attributes: VariantAttributes;
  mrp: string;
  sellingPrice: string;
  aavakCoinsPrice: number;
  deliveryCharges: VariantDeliveryCharges;
  dimensions: VariantDimensions;
  calculatedPricing: VariantCalculatedPricing;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// ============================================================================
// API RESPONSE TYPES
// ============================================================================

export interface VariantionApiData {
  productId: string;
  productName: string;
  variants: VariantItem[];
}

export interface VariantsApiResponse extends BaseResponse<VariantionApiData> {}
