import { BaseResponse } from "@/api/types/response.types";
import type {
  VariantCalculatedPricing,
  VariantDimensions,
  VariantItem,
} from "../../variations/types/variations.types";

// ============================================================================
// SHARED TYPES (Re-exported from variations for convenience)
// ============================================================================

export type {
  VariantCalculatedPricing,
  VariantDimensions,
  VariantItem,
};

// ============================================================================
// FORM DATA TYPES
// ============================================================================

export interface VariantFormData {
  variantId: string;
  mrp: string;
  sellingPrice: string;
  aavakCoinsPrice: string;
  localCost: string;
  regionalCost: string;
  nationalCost: string;
  length: string;
  width: string;
  height: string;
  weight: string;
}

export interface VariantSettlementData {
  pricing: VariantCalculatedPricing;
  detailedTable: DetailedBreakdownTable;
}

// ============================================================================
// UPDATE VARIANT PRICING TYPES (PATCH /products/:id/variants/details)
// ============================================================================

export interface VariantPricingData {
  variantId: string;
  mrp: number;
  sellingPrice: number;
  aavakCoinsPrice: number;
  localCost: number;
  regionalCost: number;
  nationalCost: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
}

export interface UpdateVariantsPricingPayload {
  variants: VariantPricingData[];
}

// ============================================================================
// CALCULATE SETTLEMENT PRICE TYPES (POST /products/variants/calculate-pricing)
// ============================================================================

export interface CalculatePricingRequest {
  variantId: string;
  mrp: number;
  sellingPrice: number;
  aavakCoinsPrice: number;
  localCost: number;
  regionalCost: number;
  nationalCost: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
}

export interface RegionalPrices {
  local: number;
  regional: number;
  national: number;
}

export interface DetailedBreakdownTable {
  sellingPrice: RegionalPrices;
  customerShipping: RegionalPrices;
  feesAndTaxes: RegionalPrices;
  tdsTcs: RegionalPrices;
  shippingCharges: RegionalPrices;
  praisedAavakCoins: RegionalPrices;
  settlementPrice: RegionalPrices;
}

export interface CalculatePricingData {
  mrp: string;
  sellingPrice: string;
  aavakCoinsPrice: number;
  localCost: number;
  regionalCost: number;
  nationalCost: number;
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  calculatedPrices: {
    onLocal: number;
    onRegional: number;
    onNational: number;
    userGets: number;
  };
  detailedTable: DetailedBreakdownTable;
}

export interface CalculatePricingResponse extends BaseResponse<CalculatePricingData> {}

// ============================================================================
// UPDATE PRICING RESPONSE WITH BREAKDOWN
// ============================================================================

export interface VariantPricingBreakdown {
  variantId: string;
  aavakSku: string;
  breakdown: {
    mrp: string;
    sellingPrice: string;
    aavakCoinsPrice: number;
    localCost: number;
    regionalCost: number;
    nationalCost: number;
    dimensions: {
      length: number;
      width: number;
      height: number;
      weight: number;
    };
    calculatedPrices: {
      onLocal: number;
      onRegional: number;
      onNational: number;
      userGets: number;
    };
    detailedTable: DetailedBreakdownTable;
  };
}

export interface UpdateVariantsPricingResponseData {
  variantsUpdated: number;
  variants: VariantPricingBreakdown[];
}

export interface UpdateVariantsPricingResponse extends BaseResponse<UpdateVariantsPricingResponseData> {}
