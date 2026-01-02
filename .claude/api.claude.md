# API Implementation Guide

## Quick Start - Read First

**MANDATORY READING ORDER:**
1. `src/api/apiService.ts` - Core API service
2. `src/api/apiPaths.ts` - Endpoint definitions
3. Feature's `types/` folder - Data structures
4. Feature's `schemas/` folder - Validation (if exists)
5. Similar feature's `api/` folder - Reference implementation

---

## Core Architecture

### 1. API Service (`src/api/apiService.ts`)

Centralized API wrapper with automatic auth token injection and error handling.

**Interface:**
```typescript
interface ApiServiceProps {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  endpoint: string;    // From apiPaths
  data?: any;          // Request body
  params?: any;        // Query params (?key=value)
  headers?: Record<string, string>;
  config?: AxiosRequestConfig;
}
```

**Usage:**
```typescript
import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";

const response = await apiService({
  method: "POST",
  endpoint: apiPaths.products.create,
  data: payload,
});
```

### 2. API Paths (`src/api/apiPaths.ts`)

Centralized endpoint management. **NEVER hardcode URLs.**

```typescript
export const apiPaths = {
  auth: {
    login: "auth/login",                                    // Static
    sendOtp: "auth/send-otp",
  },
  products: {
    create: "products",                                     // Static
    getById: (id: string) => `products/${id}`,              // Dynamic
    basicDetails: (productId: string) => `products/${productId}/basic-details`,
  },
} as const;
```

### 3. Query Client (`src/lib/queryClient.ts`)

TanStack Query configuration. Import when invalidating cache.

```typescript
import { queryClient } from "@/lib/queryClient";

// Use in onSuccess for mutations
queryClient.invalidateQueries({ queryKey: ["product", id] });
```

---

## Folder Structure

**Standard pattern for every feature:**
```
feature/
├── api/
│   ├── queryFunctions.ts    # Pure API functions (no React)
│   └── queryHooks.ts         # React Query hooks
├── types/
│   └── feature.types.ts      # All TypeScript interfaces
├── schemas/
│   └── feature.schema.ts     # Zod schemas (optional)
└── components/
```

---

## Implementation Steps

### STEP 1: Define Types (`types/feature.types.ts`)

**Always define these three:**

```typescript
import { BaseResponse } from "@/api/types/response.types";
import { z } from "zod";
import { featureSchema } from "../schemas/feature.schema";

// 1. Form types (from Zod schema)
export type FeatureFormValues = z.infer<typeof featureSchema>;

// 2. Request payload (what you send to API)
export interface CreateFeaturePayload {
  name: string;
  description: string;
}

// 3. Response data (what API returns)
export interface FeatureData {
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

// 4. Wrapped response (using BaseResponse)
export interface FeatureApiResponse extends BaseResponse<FeatureData> {}
```

**BaseResponse structure:**
```typescript
{
  statusCode: number;
  message: string;
  data: T;
}
```

---

### STEP 2: Add Endpoints (`src/api/apiPaths.ts`)

Add to appropriate namespace:

```typescript
yourFeature: {
  list: "your-feature/list",
  getById: (id: string) => `your-feature/${id}`,
  create: "your-feature/create",
  update: (id: string) => `your-feature/${id}`,
},
```

---

### STEP 3: Write Query Functions (`api/queryFunctions.ts`)

Pure functions that call the API. **No React hooks here.**

```typescript
import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { CreateFeaturePayload, FeatureApiResponse } from "../types/feature.types";

// GET
export const getFeature = async (id: string): Promise<FeatureApiResponse> => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.yourFeature.getById(id),
  });
};

// POST
export const createFeature = async (
  data: CreateFeaturePayload
): Promise<FeatureApiResponse> => {
  return apiService({
    method: "POST",
    data,
    endpoint: apiPaths.yourFeature.create,
  });
};

// PATCH
export const updateFeature = async (
  id: string,
  data: CreateFeaturePayload
): Promise<FeatureApiResponse> => {
  return apiService({
    method: "PATCH",
    data,
    endpoint: apiPaths.yourFeature.update(id),
  });
};

// GET with query params
export const listFeatures = async (params: ListParams): Promise<FeatureApiResponse> => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.yourFeature.list,
    params, // Becomes ?page=1&status=active
  });
};
```

---

### STEP 4: Write React Query Hooks (`api/queryHooks.ts`)

React hooks using TanStack Query.

```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { getFeature, createFeature, updateFeature } from "./queryFunctions";
import { CreateFeaturePayload, FeatureApiResponse } from "../types/feature.types";
import { queryClient } from "@/lib/queryClient";

// ============================================================================
// QUERIES (GET)
// ============================================================================

export const useGetFeatureQuery = (id: string) => {
  return useQuery({
    queryKey: ["feature", id],
    queryFn: () => getFeature(id),
    enabled: !!id,
    retry: false,
  });
};

// With data transformation
export const useGetFeatureDetailsQuery = (id: string) => {
  return useQuery({
    queryKey: ["feature-details", id],
    queryFn: () => getFeature(id),
    enabled: !!id,
    select: (response) => response.data, // Extract just .data
  });
};

// ============================================================================
// MUTATIONS (POST, PUT, PATCH, DELETE)
// ============================================================================

// CREATE
export const useCreateFeatureMutation = () => {
  return useMutation<FeatureApiResponse, Error, CreateFeaturePayload>({
    mutationFn: (data) => createFeature(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
  });
};

// UPDATE (with ID parameter)
export const useUpdateFeatureMutation = (id: string) => {
  return useMutation<FeatureApiResponse, Error, CreateFeaturePayload>({
    mutationFn: (data) => updateFeature(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature", id] });
      queryClient.invalidateQueries({ queryKey: ["features"] });
    },
  });
};
```

**Mutation Generic Types:**
```typescript
useMutation<ResponseType, ErrorType, PayloadType>({...})
```

---

## Key Patterns

### Query Keys
```typescript
// Static data
["brands"]

// Single item
["product", productId]

// List with filters
["products", { status: "active", page: 1 }]

// Nested resources
["product", productId, "variants"]
```

### Cache Invalidation
```typescript
onSuccess: () => {
  // Specific item
  queryClient.invalidateQueries({ queryKey: ["product", id] });

  // Related lists
  queryClient.invalidateQueries({ queryKey: ["products"] });
  queryClient.invalidateQueries({ queryKey: ["variants", productId] });
}
```

### Query Options
```typescript
useQuery({
  queryKey: ["feature", id],
  queryFn: () => getFeature(id),
  enabled: !!id,              // Only run if condition is true
  retry: false,               // Don't retry on error
  select: (res) => res.data,  // Transform data before returning
})
```

---

## Type Patterns

### Request vs Response
```typescript
// What you SEND
export interface CreateProductPayload {
  name: string;
  categoryId: string;
}

// What you RECEIVE
export interface ProductData {
  id: string;
  name: string;
  categoryId: string;
  status: string;
  createdAt: string;
}

export interface ProductApiResponse extends BaseResponse<ProductData> {}
```

### Re-exporting Shared Types (DRY)
```typescript
// In pricing/types/pricing.types.ts
export type {
  VariantItem,
  VariantDimensions,
} from "../../variations/types/variations.types";

// Now import from either location
```

---

## Best Practices

### ✅ DO
- Use `apiService` for all API calls
- Define all endpoints in `apiPaths`
- Put all types in `types/` folder
- Separate `queryFunctions.ts` and `queryHooks.ts`
- Use `BaseResponse<T>` for all responses
- Specify return types explicitly
- Invalidate queries after mutations
- Include dynamic params in query keys

### ❌ DON'T
- Hardcode API URLs
- Mix React hooks with pure functions
- Define types inline
- Skip type definitions
- Forget to invalidate cache after updates
- Use generic query keys like `["data"]`

---

## Common Mistakes

**1. Missing return type:**
```typescript
// ❌ Wrong
export const getProduct = async (id: string) => { ... }

// ✅ Correct
export const getProduct = async (id: string): Promise<ProductApiResponse> => { ... }
```

**2. Hardcoded URL:**
```typescript
// ❌ Wrong
endpoint: "products/123/details"

// ✅ Correct
endpoint: apiPaths.products.getById("123")
```

**3. Incomplete query key:**
```typescript
// ❌ Wrong
queryKey: ["product"] // Which product?

// ✅ Correct
queryKey: ["product", productId]
```

**4. No cache invalidation:**
```typescript
// ❌ Wrong
useMutation({
  mutationFn: updateProduct,
  // Missing onSuccess!
})

// ✅ Correct
useMutation({
  mutationFn: (data) => updateProduct(id, data),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["product", id] });
  },
})
```

---

## Quick Reference

### File Template: queryFunctions.ts
```typescript
import apiService from "@/api/apiService";
import { apiPaths } from "@/api/apiPaths";
import { PayloadType, ResponseType } from "../types/feature.types";

export const functionName = async (
  param: string,
  data: PayloadType
): Promise<ResponseType> => {
  return apiService({
    method: "METHOD",
    endpoint: apiPaths.feature.endpoint(param),
    data,
  });
};
```

### File Template: queryHooks.ts
```typescript
import { useQuery, useMutation } from "@tanstack/react-query";
import { functionName } from "./queryFunctions";
import { PayloadType, ResponseType } from "../types/feature.types";
import { queryClient } from "@/lib/queryClient";

export const useFeatureQuery = (id: string) => {
  return useQuery({
    queryKey: ["feature", id],
    queryFn: () => functionName(id),
    enabled: !!id,
  });
};

export const useFeatureMutation = (id: string) => {
  return useMutation<ResponseType, Error, PayloadType>({
    mutationFn: (data) => functionName(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["feature", id] });
    },
  });
};
```

### File Template: types.ts
```typescript
import { BaseResponse } from "@/api/types/response.types";

export interface FeaturePayload {
  // Fields sent to API
}

export interface FeatureData {
  // Fields received from API
}

export interface FeatureApiResponse extends BaseResponse<FeatureData> {}
```

---

## Implementation Checklist

**When creating new API integration:**

1. **Types** (`types/feature.types.ts`)
   - [ ] Define request payload interface
   - [ ] Define response data interface
   - [ ] Wrap response with `BaseResponse<T>`

2. **Endpoints** (`src/api/apiPaths.ts`)
   - [ ] Add to appropriate namespace
   - [ ] Use functions for dynamic parameters

3. **Functions** (`api/queryFunctions.ts`)
   - [ ] Import `apiService` and `apiPaths`
   - [ ] Import types from `../types/`
   - [ ] Write pure functions with return types
   - [ ] Export all functions

4. **Hooks** (`api/queryHooks.ts`)
   - [ ] Import from `./queryFunctions`
   - [ ] Import types and `queryClient`
   - [ ] Write `useQuery` for GET
   - [ ] Write `useMutation` for POST/PATCH/DELETE
   - [ ] Add cache invalidation in `onSuccess`
   - [ ] Use proper generic types

5. **Verify**
   - [ ] No TypeScript errors
   - [ ] No hardcoded URLs
   - [ ] All types properly defined
   - [ ] Query keys include dynamic params

---

## For AI Assistants

**When asked to implement API:**

1. **Read these files first:**
   - `src/api/apiService.ts`
   - `src/api/apiPaths.ts`
   - Feature's `types/` and `schemas/` folders
   - Similar feature's `api/` folder for reference

2. **Follow this order:**
   - Create types in `types/feature.types.ts`
   - Add endpoints to `src/api/apiPaths.ts`
   - Write functions in `api/queryFunctions.ts`
   - Write hooks in `api/queryHooks.ts`

3. **Always:**
   - Use patterns from this guide
   - Match existing code style
   - Add proper TypeScript types
   - Include cache invalidation
   - Follow folder structure exactly

4. **Never:**
   - Hardcode URLs
   - Mix hooks and pure functions
   - Skip type definitions
   - Ignore existing patterns

---

## Summary

**Golden Rules:**
1. Types first, always
2. Use `apiService` + `apiPaths` + `BaseResponse<T>`
3. Separate `queryFunctions.ts` (pure) and `queryHooks.ts` (React)
4. Include all params in query keys
5. Invalidate cache after mutations

**File Structure:**
```
feature/api/queryFunctions.ts  → Pure API calls
feature/api/queryHooks.ts      → React Query hooks
feature/types/feature.types.ts → TypeScript types
```

**Every API needs:**
- Request type (payload)
- Response type (data + BaseResponse wrapper)
- Endpoint in apiPaths
- Query function with return type
- React Query hook with proper generics
