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
  quantity: number;
}

export interface UpdateVariantsPricingPayload {
  variants: VariantPricingData[];
}

export interface VariantPricingLimits {
  onLocal: number;
  onRegional: number;
  onNational: number;
  userGets: number;
}

// export interface VariantWithPricing {
//   id: string;
//   aavakSku: string;
//   attributes: {
//     size?: string;
//     color?: string;
//     [key: string]: any;
//   };
//   pricing: VariantPricingLimits;
// }

export interface PriceBreakdownItem {
  label: string;
  local?: number;
  regional?: number;
  national?: number;
}

export interface VariantPriceBreakdown {
  variantId: string;
  aavakSku: string;
  breakdown: {
    mrp: number;
    sellingPrice: number;
    aavakCoinsPrice: number;
    deliveryCosts: {
      local: number;
      regional: number;
      national: number;
    };
    calculatedPrices: {
      onLocal: number;
      onRegional: number;
      onNational: number;
      userGets: number;
    };
  };
}

export interface VariantsPriceBreakdownResponse {
  data: VariantPriceBreakdown[];
}

export interface VariantsPricingApiResponse {
  variants: VariantWithPricing[];
  productId: string;
  productName: string;
}