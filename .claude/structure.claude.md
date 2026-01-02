# Project Structure Guide - Vendor UI

## Overview
This document explains the complete folder structure and organization patterns of the Vendor UI project. Follow these conventions when creating new features or routes.

---

## Quick Reference

```
src/
├── api/              # API configuration & types
├── assets/           # Static assets (images, icons)
├── components/       # Reusable UI components
├── features/         # Feature-based modules (business logic)
├── routes/           # TanStack Router route definitions
├── hooks/            # Custom React hooks
├── lib/              # Third-party library configs
├── store/            # Global state management
├── types/            # Global TypeScript types
├── utils/            # Utility functions
├── constants/        # App-wide constants
├── schema/           # Global Zod schemas
└── styles/           # Global styles
```

**Key Principle:** Features contain **business logic**, Routes contain **page definitions**. They work together but are separate.

---

## Core Folder Structure

### 1. `/src/api` - API Configuration

```
api/
├── apiService.ts        # Core API service (Axios wrapper)
├── apiPaths.ts          # All API endpoints (centralized)
├── types/
│   └── response.types.ts  # BaseResponse<T> and common types
└── external-api/        # Third-party API integrations
```

**Purpose:** Centralized API configuration.
**Reference:** See [api.claude.md](api.claude.md) for API implementation guide.

---

### 2. `/src/components` - Reusable Components

```
components/
├── base/                      # Primitive components (Button, Input, etc.)
│   ├── Button.tsx
│   ├── Input.tsx
│   ├── Dropdown.tsx
│   └── ... (35+ base components)
│
├── compound/                  # Composed components
│   ├── cards/
│   ├── spinner/
│   └── time-range/
│
├── table/                     # Table components
│   ├── Table.tsx
│   ├── TableHead.tsx
│   ├── TableBody.tsx
│   └── cells/                # Custom table cells
│
├── controlled-form-components/  # Form-specific wrappers
│
├── media-picker/              # Media picker (complex component)
│   ├── api/
│   ├── components/
│   ├── types/
│   └── utils/
│
├── header/                    # App header
├── sidebar/                   # App sidebar
├── shared/                    # Shared feature components
├── empty-states/              # Empty state components
└── utils/                     # Component utilities
```

**Pattern:**
- `base/` → Primitive, reusable components (Button, Input)
- `compound/` → Composed from base components
- Feature-specific folders → Complex components with own API/types

**When to Create Component Here:**
- ✅ Used across multiple features
- ✅ Pure UI component (no business logic)
- ❌ Feature-specific logic → Put in feature's `components/`

---

### 3. `/src/features` - Feature Modules ⭐

**This is where most development happens.**

```
features/
├── auth/
│   ├── login/
│   ├── registration/
│   └── business-registration/
│
├── products/
│   ├── add-product/
│   ├── active-products/
│   ├── drafts/
│   ├── under-approval/
│   ├── inactive-products/
│   ├── product-details/
│   └── product-form/
│       ├── basic-details/
│       ├── variations/
│       ├── pricing-and-shipping/
│       └── product-header/
│
├── dashboard/
├── orders/
├── profile/
└── category/
```

#### Feature Structure Pattern

**Every feature follows this structure:**

```
feature-name/
├── api/                    # API integration (if needed)
│   ├── queryFunctions.ts   # Pure API functions
│   └── queryHooks.ts       # React Query hooks
│
├── components/             # Feature-specific components
│   └── FeatureComponent.tsx
│
├── types/                  # TypeScript types
│   └── feature.types.ts
│
├── schemas/                # Zod validation schemas
│   └── feature.schema.ts
│
├── hooks/                  # Feature-specific hooks (optional)
│   └── useFeature.ts
│
├── constants/              # Feature constants (optional)
│   └── constants.ts
│
├── utils/                  # Feature utilities (optional)
│   └── helpers.ts
│
├── pages/                  # Sub-pages (for list features)
│   └── feature-list/
│       └── FeatureList.tsx
│
└── index.tsx              # Main component export
```

#### Feature Organization Examples

**1. Simple Feature (Login):**
```
login/
├── api/
│   ├── queryFunctions.ts
│   └── queryHooks.ts
├── components/
│   └── LoginForm.tsx
├── types/
│   └── login.ts
├── schemas/
│   └── login.schema.ts
├── hooks/
│   └── useLogin.ts
└── index.tsx
```

**2. Complex Feature (Product Form - Multi-step):**
```
product-form/
├── basic-details/
│   ├── api/
│   ├── types/
│   ├── schemas/
│   └── BasicProductDetails.tsx
│
├── variations/
│   ├── api/
│   ├── types/
│   ├── schemas/
│   ├── components/
│   │   ├── step-1/
│   │   │   ├── components/
│   │   │   └── VariationStep1.tsx
│   │   └── step-2/
│   ├── constants/
│   └── VariationStep2.tsx
│
├── pricing-and-shipping/
│   ├── api/
│   ├── types/
│   ├── schemas/
│   ├── components/
│   │   └── BreakdownDialog.tsx
│   └── PricingAndShipping.tsx
│
└── product-header/
    ├── api/
    ├── types/
    └── ProductHeader.tsx
```

**3. List Feature (Active Products):**
```
active-products/
├── api/
│   ├── queryFunctions.ts
│   └── queryHooks.ts
├── types/
│   └── activeProduct.d.ts
└── pages/
    └── active-products-list/
        └── ActiveProductsList.tsx
```

---

### 4. `/src/routes` - Route Definitions ⭐

**TanStack Router file-based routing.**

```
routes/
├── _app/                  # Protected routes (requires auth)
│   ├── layout.tsx         # App layout (sidebar, header)
│   ├── route.tsx          # App route wrapper
│   │
│   ├── dashboard/
│   │   └── index.tsx      # /dashboard
│   │
│   ├── products/
│   │   ├── route.tsx      # /products (layout)
│   │   ├── add-product/
│   │   │   └── index.tsx  # /products/add-product
│   │   │
│   │   ├── active-products/
│   │   │   └── route.tsx  # /products/active-products
│   │   │
│   │   ├── drafts/
│   │   │   └── index.tsx  # /products/drafts
│   │   │
│   │   ├── under-approval/
│   │   │   └── index.tsx  # /products/under-approval
│   │   │
│   │   ├── $productId/    # Dynamic route
│   │   │   └── route.tsx  # /products/:productId
│   │   │
│   │   └── product-form/
│   │       └── $productId/
│   │           ├── route.tsx              # Layout for form
│   │           ├── basic-details/
│   │           │   └── route.tsx          # /products/product-form/:id/basic-details
│   │           ├── variations/
│   │           │   └── route.tsx          # /products/product-form/:id/variations
│   │           └── pricing-and-shipping/
│   │               └── route.tsx          # /products/product-form/:id/pricing-and-shipping
│   │
│   ├── orders/
│   ├── profile/
│   ├── analytics/
│   ├── customers/
│   └── settings/
│
├── _auth/                 # Public routes (login, registration)
│   ├── layout.tsx         # Auth layout
│   ├── route.tsx          # Auth route wrapper
│   ├── login/
│   │   └── index.tsx      # /login
│   ├── registration/
│   │   └── index.tsx      # /registration
│   └── business-registration/
│       └── index.tsx      # /business-registration
│
├── demo/                  # Demo routes
│   └── index.tsx
│
└── __root.tsx             # Root layout
```

#### Route File Patterns

**1. Index Route (`index.tsx`):**
```typescript
// /routes/_app/dashboard/index.tsx
import { createFileRoute } from "@tanstack/react-router";
import DashboardPage from "@/features/dashboard";

export const Route = createFileRoute("/_app/dashboard/")({
  component: DashboardPage,
});
```

**2. Layout Route (`route.tsx`):**
```typescript
// /routes/_app/products/route.tsx
import { createFileRoute, Outlet } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/products")({
  component: () => <Outlet />, // Renders child routes
});
```

**3. Dynamic Route (`$param`):**
```typescript
// /routes/_app/products/$productId/route.tsx
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/_app/products/$productId")({
  component: ProductDetailsPage,
});

// Access param: const { productId } = Route.useParams();
```

**4. Route with Data Loading:**
```typescript
// /routes/_app/products/product-form/$productId/basic-details/route.tsx
import { createFileRoute } from "@tanstack/react-router";
import BasicDetailsPage from "@/features/products/product-form/basic-details";

export const Route = createFileRoute(
  "/_app/products/product-form/$productId/basic-details"
)({
  component: BasicDetailsPage,
});
```

#### Route Naming Conventions

| Pattern | Example | URL |
|---------|---------|-----|
| `index.tsx` | `/dashboard/index.tsx` | `/dashboard` |
| `route.tsx` | `/products/route.tsx` | `/products` (layout) |
| `$param` | `/products/$productId/route.tsx` | `/products/123` |
| Nested | `/products/add-product/index.tsx` | `/products/add-product` |
| Multi-param | `/$userId/posts/$postId/route.tsx` | `/user123/posts/456` |

---

## Feature ↔ Route Connection

**Features and Routes are separate but connected:**

### Pattern 1: Simple Feature
```
Feature:  /features/dashboard/index.tsx
Route:    /routes/_app/dashboard/index.tsx

// Route imports and renders Feature
import DashboardPage from "@/features/dashboard";
export const Route = createFileRoute("/_app/dashboard/")({
  component: DashboardPage,
});
```

### Pattern 2: Multi-step Feature
```
Features: /features/products/product-form/
          ├── basic-details/BasicProductDetails.tsx
          ├── variations/Variations.tsx
          └── pricing-and-shipping/PricingAndShipping.tsx

Routes:   /routes/_app/products/product-form/$productId/
          ├── basic-details/route.tsx      (imports BasicProductDetails)
          ├── variations/route.tsx          (imports Variations)
          └── pricing-and-shipping/route.tsx (imports PricingAndShipping)
```

### Pattern 3: List Feature
```
Feature:  /features/products/active-products/pages/active-products-list/
          └── ActiveProductsList.tsx

Route:    /routes/_app/products/active-products/route.tsx
          (imports and renders ActiveProductsList)
```

---

## Creating a New Feature - Step by Step

### Example: Creating "Orders" Feature

#### Step 1: Plan Your Structure

**Questions to answer:**
- Is it a simple page or multi-step? → Simple list
- Does it need API calls? → Yes
- Does it have sub-pages? → Yes (order details)
- Where does it fit in navigation? → Under `_app`

#### Step 2: Create Feature Folder

```bash
mkdir -p src/features/orders/order-list/{api,types,pages/order-list-page}
```

**Structure:**
```
features/orders/
└── order-list/
    ├── api/
    │   ├── queryFunctions.ts
    │   └── queryHooks.ts
    ├── types/
    │   └── order.types.ts
    └── pages/
        └── order-list-page/
            └── OrderListPage.tsx
```

#### Step 3: Create Types (`types/order.types.ts`)

```typescript
import { BaseResponse } from "@/api/types/response.types";

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  total: number;
  status: string;
  createdAt: string;
}

export interface OrdersData {
  orders: Order[];
  totalOrders: number;
}

export interface OrdersApiResponse extends BaseResponse<OrdersData> {}
```

#### Step 4: Add API Endpoint (`src/api/apiPaths.ts`)

```typescript
export const apiPaths = {
  // ... existing paths
  orders: {
    list: "orders/list",
    getById: (id: string) => `orders/${id}`,
  },
} as const;
```

#### Step 5: Create API Functions & Hooks

**See [api.claude.md](api.claude.md) for detailed API implementation.**

```typescript
// api/queryFunctions.ts
export const getOrders = async (): Promise<OrdersApiResponse> => {
  return apiService({
    method: "GET",
    endpoint: apiPaths.orders.list,
  });
};

// api/queryHooks.ts
export const useGetOrdersQuery = () => {
  return useQuery({
    queryKey: ["orders"],
    queryFn: getOrders,
  });
};
```

#### Step 6: Create Component (`pages/order-list-page/OrderListPage.tsx`)

```typescript
import { useGetOrdersQuery } from "../../api/queryHooks";

const OrderListPage = () => {
  const { data, isLoading } = useGetOrdersQuery();

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Orders</h1>
      {/* Render order list */}
    </div>
  );
};

export default OrderListPage;
```

#### Step 7: Create Route (`routes/_app/orders/index.tsx`)

```typescript
import { createFileRoute } from "@tanstack/react-router";
import OrderListPage from "@/features/orders/order-list/pages/order-list-page/OrderListPage";

export const Route = createFileRoute("/_app/orders/")({
  component: OrderListPage,
});
```

#### Step 8: Add to Navigation

Update `src/components/sidebar/sidebarMenuItems.ts`:
```typescript
export const sidebarMenuItems = [
  // ... existing items
  {
    label: "Orders",
    icon: "ShoppingBag",
    path: "/orders",
  },
];
```

---

## Folder Structure Patterns

### When to Create What

| Type | Location | Example |
|------|----------|---------|
| **Reusable UI Component** | `/components/base/` | Button, Input, Card |
| **Feature Component** | `/features/{feature}/components/` | LoginForm, ProductCard |
| **Business Logic** | `/features/{feature}/` | Entire feature module |
| **API Integration** | `/features/{feature}/api/` | Query hooks, functions |
| **Types** | `/features/{feature}/types/` | TypeScript interfaces |
| **Page Route** | `/routes/_app/{feature}/` | Route definition |
| **Shared Utility** | `/utils/` | formatDate, helpers |
| **Feature Utility** | `/features/{feature}/utils/` | Feature-specific helpers |
| **Global Hook** | `/hooks/` | useAuth, useTheme |
| **Feature Hook** | `/features/{feature}/hooks/` | useProductForm |

### Feature Complexity Guide

**Simple Feature (< 500 lines):**
```
feature/
├── api/
├── types/
└── index.tsx
```

**Medium Feature (500-2000 lines):**
```
feature/
├── api/
├── types/
├── schemas/
├── components/
│   ├── Component1.tsx
│   └── Component2.tsx
└── index.tsx
```

**Complex Feature (> 2000 lines):**
```
feature/
├── sub-feature-1/
│   ├── api/
│   ├── types/
│   └── index.tsx
├── sub-feature-2/
│   ├── api/
│   ├── types/
│   └── index.tsx
└── shared/
    └── components/
```

---

## File Naming Conventions

### Components
- **PascalCase:** `ProductCard.tsx`, `OrderList.tsx`
- **Index files:** `index.tsx` (exports main component)

### Types
- **camelCase.types.ts:** `product.types.ts`, `order.types.ts`
- **Global types:** `user.d.ts` (in `/types/`)

### API Files
- **camelCase:** `queryFunctions.ts`, `queryHooks.ts`

### Schemas
- **camelCase.schema.ts:** `product.schema.ts`, `login.schema.ts`

### Routes
- **kebab-case folders:** `active-products/`, `product-form/`
- **index.tsx or route.tsx**
- **Dynamic:** `$productId/`, `$userId/`

### Utilities
- **camelCase:** `helpers.ts`, `formatters.ts`

---

## Best Practices

### ✅ DO
- Keep features isolated and self-contained
- Put business logic in features, not routes
- Use `api.claude.md` for all API implementations
- Follow the folder structure patterns
- Create types before writing code
- Use BaseResponse<T> for all API responses
- Name files and folders consistently

### ❌ DON'T
- Mix feature logic with route definitions
- Create deeply nested folder structures (max 3-4 levels)
- Put feature-specific components in `/components/base/`
- Hardcode API URLs (use apiPaths)
- Create one-off utilities (use existing or create shared)
- Skip type definitions

---

## Common Patterns

### Multi-Step Forms
```
feature/
├── step-1/
│   ├── api/
│   ├── types/
│   └── Step1.tsx
├── step-2/
│   ├── api/
│   ├── types/
│   └── Step2.tsx
└── step-3/
    ├── api/
    ├── types/
    └── Step3.tsx
```

### List + Detail Pages
```
feature/
├── feature-list/
│   ├── api/
│   ├── types/
│   └── pages/
│       └── FeatureListPage.tsx
└── feature-details/
    ├── api/
    ├── types/
    └── pages/
        └── FeatureDetailsPage.tsx
```

### Shared Components Within Feature
```
feature/
├── components/
│   ├── shared/
│   │   ├── FeatureHeader.tsx
│   │   └── FeatureCard.tsx
│   ├── step-1/
│   └── step-2/
└── index.tsx
```

---

## Quick Checklist for New Feature

**Planning:**
- [ ] Identify feature type (simple/medium/complex)
- [ ] Plan folder structure
- [ ] Identify API requirements
- [ ] Plan routes needed

**Implementation:**
1. [ ] Create feature folder structure
2. [ ] Define types in `types/` folder
3. [ ] Add API endpoints to `apiPaths.ts`
4. [ ] Create API functions and hooks (see [api.claude.md](api.claude.md))
5. [ ] Create Zod schemas if needed
6. [ ] Build components
7. [ ] Create route files
8. [ ] Add to navigation (if needed)
9. [ ] Test functionality

**Verification:**
- [ ] No TypeScript errors
- [ ] Follows naming conventions
- [ ] API uses apiPaths (no hardcoded URLs)
- [ ] Types are properly defined
- [ ] Route is accessible

---

## Summary

### Key Principles
1. **Features** = Business logic and components
2. **Routes** = URL definitions and page wrappers
3. **Separation** = Keep them separate but connected
4. **Consistency** = Follow existing patterns
5. **API** = Always use [api.claude.md](api.claude.md) guide

### Folder Structure Hierarchy
```
Features → Contain logic
Routes → Define URLs and import Features
Components → Reusable UI (no business logic)
API → Centralized via apiService + apiPaths
```

### Creating New Feature
1. Create in `/features/` with proper structure
2. Define types first
3. Implement API (use api.claude.md)
4. Build components
5. Create route in `/routes/`
6. Connect feature to route
7. Add to navigation if needed

---

## For AI Assistants

**When creating a new feature:**

1. **Read first:**
   - This file (`structure.claude.md`)
   - [api.claude.md](api.claude.md) for API patterns
   - Similar existing features for reference

2. **Follow this order:**
   - Plan folder structure based on complexity
   - Create feature folder in `/features/`
   - Define types in `types/` folder
   - Implement API (follow api.claude.md)
   - Create components
   - Create routes in `/routes/`
   - Connect feature to route

3. **Always:**
   - Match existing patterns
   - Keep features self-contained
   - Use proper naming conventions
   - Follow the folder structure exactly
   - Reference api.claude.md for API

4. **Never:**
   - Mix feature logic in routes
   - Create custom folder structures
   - Skip type definitions
   - Ignore existing patterns
