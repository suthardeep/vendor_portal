# Pricing and Shipping Module Refactoring Guide

## Overview
This document outlines the requirements for refactoring the pricing-and-shipping module to integrate new API endpoints and enhance the settlement price calculation workflow. The existing UI remains unchanged; modifications are limited to data flow, API integration, and business logic.

---

## Prerequisites

### Step 1: Code Analysis
Thoroughly read and understand the following:
- All files in `product-form/pricing-and-shipping/` folder
- Type definitions in `variations/types/`
- Type definitions in `product-header/types/`
- API hooks in `variations/api/apiHooks.ts`

### Step 2: API Understanding
Review the new API payloads and responses detailed in the [API Specifications](#api-specifications) section below.

---

## Implementation Requirements

### 1. Data Fetching Strategy

**Current State:**
- Uses `useGetVariantsPricingQuery` to fetch variant pricing data

**Required Changes:**
- **Replace** `useGetVariantsPricingQuery` with `useGetVariantsQuery` from `variations/api/apiHooks.ts`
- Both hooks return similar data; consolidate to use a single source of truth
- Analyze types from `variations/types/` and ensure compatibility
- Remove redundant API hooks and related code from `pricing-and-shipping/api/`

**Data Prefilling:**
- If variant data exists, prefill all form fields with existing values
- If no data exists, leave fields empty
- Handle both scenarios gracefully without errors

---

### 2. Settlement Price Calculation Feature

#### 2.1 Button State Management

The "View Settlement Price" button has three states based on user interaction:

| State | Button Text | Trigger |
|-------|-------------|---------|
| **Collapsed** | "View Settlement Price" | Initial state or after hiding |
| **Expanded (Clean)** | "Hide Settlement Price" | Clicked to view, no changes made |
| **Expanded (Dirty)** | "Refresh Settlement Price" | Any field changed in the variant |

**State Transition Logic:**
1. **Initial State:** Button shows "View Settlement Price"
2. **User clicks button:** Fetch settlement data, expand section, change text to "Hide Settlement Price"
3. **User modifies any field:** Immediately change button text to "Refresh Settlement Price"
4. **User clicks "Refresh":** Re-fetch with updated values, change text back to "Hide Settlement Price"
5. **User clicks "Hide":** Collapse section, reset button text to "View Settlement Price"

#### 2.2 Settlement Price API Integration

**Endpoint:** `products/variants/calculate-pricing`

**Request Payload:**
```json
{
  "variantId": "7f6e304d-8106-46c2-8704-ffeb63a53c42",
  "mrp": 2499900,
  "sellingPrice": 2199900,
  "aavakCoinsPrice": 500,
  "localCost": 5000,
  "regionalCost": 8000,
  "nationalCost": 12000,
  "dimensions": {
    "length": 30,
    "width": 25,
    "height": 5,
    "weight": 0.3
  }
}
```

**Response Structure:**
```json
{
  "statusCode": 200,
  "message": "Operation completed successfully",
  "data": {
    "mrp": "2499900.00",
    "sellingPrice": "2199900.00",
    "aavakCoinsPrice": 500,
    "localCost": 5000,
    "regionalCost": 8000,
    "nationalCost": 12000,
    "dimensions": {
      "length": 30,
      "width": 25,
      "height": 5,
      "weight": 0.3
    },
    "calculatedPrices": {
      "onLocal": 2494900,
      "onRegional": 2491900,
      "onNational": 2487900,
      "userGets": 500
    },
    "detailedTable": {
      "sellingPrice": {
        "local": 2199900,
        "regional": 2199900,
        "national": 2199900
      },
      "customerShipping": {
        "local": 0,
        "regional": 0,
        "national": 0
      },
      "feesAndTaxes": {
        "local": 219990,
        "regional": 219990,
        "national": 219990
      },
      "tdsTcs": {
        "local": 21999,
        "regional": 21999,
        "national": 21999
      },
      "shippingCharges": {
        "local": 5000,
        "regional": 8000,
        "national": 12000
      },
      "praisedAavakCoins": {
        "local": 500,
        "regional": 500,
        "national": 500
      },
      "settlementPrice": {
        "local": 2494900,
        "regional": 2491900,
        "national": 2487900
      }
    }
  }
}
```

**Implementation Steps:**
1. Add endpoint to `src/api/apiPaths.ts`
2. Create API function in `pricing-and-shipping/api/queryFunctions.ts`
3. Create React Query hook in `pricing-and-shipping/api/queryHooks.ts`
4. Define TypeScript types for request/response
5. Trigger API call on "View" and "Refresh" button clicks

#### 2.3 Settlement Price Display

**Display Location:** Expanded section below variant pricing fields

**Data to Display:**
```typescript
calculatedPrices: {
  onLocal: number;      // Settlement price for local delivery
  onRegional: number;   // Settlement price for regional delivery
  onNational: number;   // Settlement price for national delivery
  userGets: number;     // Aavak coins the user receives
}
```

**UI Requirements:**
- Display all four values clearly with appropriate labels
- Format currency values properly (convert from paisa to rupees for display)
- Update display when "Refresh" is triggered with new values

---

### 3. Breakdown Dialog Enhancement

**Current State:**
- `BreakdownDialog.tsx` generates random/mock data for price breakdown

**Required Changes:**
- Accept `detailedTable` data from the settlement price API response
- Display actual calculated values instead of mock data

**Data Structure:**
```typescript
detailedTable: {
  sellingPrice: { local: number; regional: number; national: number; }
  customerShipping: { local: number; regional: number; national: number; }
  feesAndTaxes: { local: number; regional: number; national: number; }
  tdsTcs: { local: number; regional: number; national: number; }
  shippingCharges: { local: number; regional: number; national: number; }
  praisedAavakCoins: { local: number; regional: number; national: number; }
  settlementPrice: { local: number; regional: number; national: number; }
}
```

**Table Structure:**

|  | Local | Regional | National |
|---|-------|----------|----------|
| **Selling Price** | ₹2199.00 | ₹2199.00 | ₹2199.00 |
| **Customer Shipping** | ₹0.00 | ₹0.00 | ₹0.00 |
| **Fees & Taxes** | ₹219.90 | ₹219.90 | ₹219.90 |
| **TDS/TCS** | ₹21.99 | ₹21.99 | ₹21.99 |
| **Shipping Charges** | ₹50.00 | ₹80.00 | ₹120.00 |
| **Praised Aavak Coins** | 500 | 500 | 500 |
| **Settlement Price** | ₹2494.00 | ₹2491.00 | ₹2487.00 |

**Implementation:**
- Modify `BreakdownDialog.tsx` to accept `detailedTable` as a prop
- Remove mock data generation logic
- Map `detailedTable` values to table rows
- Format currency properly (paisa to rupees conversion)
- Ensure responsive table design

---

### 4. Save & Submit Workflow

#### 4.1 Save and Next API

**Endpoint:** `products/variants/update-pricing` (or similar - verify existing endpoint)

**Request Payload:**
```json
{
  "variants": [
    {
      "variantId": "ac7a2b21-1a62-4fde-8f1c-ba0bad4ad60f",
      "mrp": 199900,
      "sellingPrice": 149900,
      "aavakCoinsPrice": 1000,
      "localCost": 5000,
      "regionalCost": 10000,
      "nationalCost": 15000,
      "dimensions": {
        "length": 30,
        "width": 25,
        "height": 5,
        "weight": 0.3
      }
    }
  ]
}
```

**Response Structure:**
```json
{
  "statusCode": 200,
  "message": "Variant pricing updated successfully",
  "data": {
    "variantsUpdated": 1,
    "variants": [
      {
        "variantId": "ac7a2b21-1a62-4fde-8f1c-ba0bad4ad60f",
        "aavakSku": "AAVK-65C8A877--WHT-NGBB",
        "breakdown": {
          "mrp": "199900.00",
          "sellingPrice": "149900.00",
          "aavakCoinsPrice": 1000,
          "localCost": 5000,
          "regionalCost": 10000,
          "nationalCost": 15000,
          "dimensions": {
            "length": 30,
            "width": 25,
            "height": 5,
            "weight": 0.3
          },
          "calculatedPrices": {
            "onLocal": 194900,
            "onRegional": 189900,
            "onNational": 184900,
            "userGets": 1000
          },
          "detailedTable": {
            "sellingPrice": { "local": 149900, "regional": 149900, "national": 149900 },
            "customerShipping": { "local": 0, "regional": 0, "national": 0 },
            "feesAndTaxes": { "local": 14990, "regional": 14990, "national": 14990 },
            "tdsTcs": { "local": 1499, "regional": 1499, "national": 1499 },
            "shippingCharges": { "local": 5000, "regional": 10000, "national": 15000 },
            "praisedAavakCoins": { "local": 1000, "regional": 1000, "national": 1000 },
            "settlementPrice": { "local": 194900, "regional": 189900, "national": 184900 }
          }
        }
      }
    ]
  }
}
```

#### 4.2 Button State Logic

| Scenario | Button Text |
|----------|-------------|
| **Initial State** | "Save and Next" |
| **After Successful Save** | "Submit" |
| **After Any Field Change** | "Save and Next" |

**Post-Save Behavior:**
1. On successful save response, automatically expand settlement price sections for ALL variants
2. Display the `calculatedPrices` data returned in the response
3. Change button text from "Save and Next" to "Submit"
4. If user modifies any field in any variant, revert button text to "Save and Next"

---

### 5. Code Cleanup

#### 5.1 Remove Deprecated Hooks

Delete the following hooks and their related query functions:

```typescript
// ❌ DELETE THESE
export const useGetVariantsPriceBreakdownQuery = (productId: string) => {
  return useQuery({
    queryKey: ["variants-price-breakdown", productId],
    queryFn: () => getVariantsPriceBreakdown(productId),
    retry: false,
    enabled: !!productId,
  });
};

export const useGetVariantPriceBreakdownByIdQuery = (variantId: string, enabled = false) => {
  return useQuery({
    queryKey: ["variant-price-breakdown", variantId],
    queryFn: () => getVariantPriceBreakdownById(variantId),
    retry: false,
    enabled: !!variantId && enabled,
  });
};
```

#### 5.2 Type System Cleanup

**DRY Principle Enforcement:**
- Since both `variations/` and `pricing-and-shipping/` now use `useGetVariantsQuery`, consolidate shared types
- Move common types to a shared location (e.g., `variations/types/`)
- Remove duplicate type definitions in `pricing-and-shipping/types/`
- Ensure all variant-related types are single-source-of-truth

**Files to Review for Duplication:**
- `variations/types/*.ts`
- `pricing-and-shipping/types/*.ts`
- `product-header/types/*.ts`

**Action Items:**
1. Identify duplicate type definitions
2. Consolidate into shared type files
3. Update imports across all components
4. Remove unused type files

#### 5.3 Unused Code Removal

**Files/Folders to Audit:**
- `pricing-and-shipping/api/` - Remove old query functions and hooks
- `pricing-and-shipping/types/` - Remove unused type definitions
- `pricing-and-shipping/utils/` - Remove unused utility functions
- Any mock data generators or temporary helpers

---

## Edge Cases to Handle

### Scenario 1: No Pricing Data on Initial Load
- Form fields should be empty
- Settlement price section should be collapsed
- Button should show "View Settlement Price"
- No errors should be displayed

### Scenario 2: Pricing Data Exists on Load
- Prefill all form fields with existing values
- Settlement price section should be collapsed initially
- User can expand to view existing settlement data
- Clicking "View" should fetch fresh settlement calculation

### Scenario 3: API Errors
- Handle network errors gracefully
- Display user-friendly error messages
- Allow retry for failed requests
- Maintain form state on error

### Scenario 4: Partial Data
- Handle cases where some variants have pricing data and others don't
- Each variant should be independently manageable

---

## API Specifications

### API 1: Calculate Settlement Price
- **Endpoint:** `POST /products/variants/calculate-pricing`
- **Purpose:** Calculate settlement price based on current form values
- **Trigger:** "View Settlement Price" or "Refresh Settlement Price" button click
- **Payload:** Current variant pricing values (see section 2.2)
- **Response:** Calculated prices and detailed breakdown (see section 2.2)

### API 2: Update Variant Pricing
- **Endpoint:** `PATCH /products/variants/details`  (hook : useUpdateVariantsPricingMutation)
- **Purpose:** Save variant pricing data
- **Trigger:** "Save and Next" or "Submit" button click
- **Payload:** Array of variant pricing data (see section 4.1)
- **Response:** Updated variants with breakdown data (see section 4.1)

### API 3: Get Variants
- **Hook:** `useGetVariantsQuery` from `variations/api/apiHooks.ts`
- **Purpose:** Fetch all variants with existing pricing data
- **Trigger:** Component mount
- **Response:** Variant data including pricing if previously saved

---

## Type Definitions Template

Create/update types to match the new API structure:

```typescript
// Settlement Price Calculation Types
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

export interface CalculatedPrices {
  onLocal: number;
  onRegional: number;
  onNational: number;
  userGets: number;
}

export interface DetailedTable {
  sellingPrice: RegionalPrices;
  customerShipping: RegionalPrices;
  feesAndTaxes: RegionalPrices;
  tdsTcs: RegionalPrices;
  shippingCharges: RegionalPrices;
  praisedAavakCoins: RegionalPrices;
  settlementPrice: RegionalPrices;
}

export interface CalculatePricingResponse {
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
  calculatedPrices: CalculatedPrices;
  detailedTable: DetailedTable;
}

// Update Pricing Types
export interface UpdateVariantPricingRequest {
  variants: Array<{
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
  }>;
}

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
    calculatedPrices: CalculatedPrices;
    detailedTable: DetailedTable;
  };
}

export interface UpdateVariantPricingResponse {
  variantsUpdated: number;
  variants: VariantPricingBreakdown[];
}
```

---

## Implementation Checklist

### Phase 1: API Integration
- [ ] Add new endpoints to `src/api/apiPaths.ts`
- [ ] Create query functions in `pricing-and-shipping/api/queryFunctions.ts`
- [ ] Create React Query hooks in `pricing-and-shipping/api/queryHooks.ts`
- [ ] Define TypeScript types for all API requests/responses
- [ ] Test API integration with mock data

### Phase 2: Settlement Price Feature
- [ ] Implement button state management (View/Hide/Refresh)
- [ ] Add change detection for form fields
- [ ] Integrate calculate pricing API
- [ ] Display calculated prices in expanded section
- [ ] Handle loading and error states

### Phase 3: Breakdown Dialog
- [ ] Update `BreakdownDialog.tsx` to accept `detailedTable` prop
- [ ] Remove mock data generation
- [ ] Implement table rendering with actual data
- [ ] Format currency values correctly
- [ ] Test with various data scenarios

### Phase 4: Save & Submit Flow
- [ ] Implement save API integration
- [ ] Auto-expand settlement prices on save success
- [ ] Handle button text transitions (Save and Next ↔ Submit)
- [ ] Implement change detection to revert to "Save and Next"
- [ ] Handle save errors gracefully

### Phase 5: Code Cleanup
- [ ] Replace `useGetVariantsPricingQuery` with `useGetVariantsQuery`
- [ ] Remove deprecated hooks (listed in section 5.1)
- [ ] Consolidate duplicate types between folders
- [ ] Delete unused API functions and files
- [ ] Update all imports

### Phase 6: Testing
- [ ] Test with no existing pricing data
- [ ] Test with existing pricing data (prefill)
- [ ] Test settlement price calculation
- [ ] Test refresh settlement price on field change
- [ ] Test breakdown dialog with actual data
- [ ] Test save and submit workflow
- [ ] Test button state transitions
- [ ] Test error scenarios

---

## Success Criteria

✅ All deprecated code removed
✅ Single source of truth for variant data (`useGetVariantsQuery`)
✅ No duplicate types between modules
✅ Settlement price calculation working correctly
✅ Breakdown dialog displays actual calculated data
✅ Button states transition correctly based on user actions
✅ Save and submit workflow functions as specified
✅ Both "no data" and "existing data" scenarios handled
✅ All error cases handled gracefully
✅ MAIN UI remains unchanged (only data flow modifications)

---

## Notes

- **Currency Format:** All API values are in rupees , no conversion required any where, just show data as it and send data as it is. no need to multiply or divive by 100 for conversion.
- **Validation:** Ensure all required fields are validated before API calls
- **Loading States:** Show appropriate loading indicators during API calls
- **Error Handling:** Display user-friendly messages; log detailed errors for debugging
- **State Management:** DONT USE React Hook Form or similar for form state management
- **Performance:** Debounce change detection to avoid excessive "Refresh" button state changes
