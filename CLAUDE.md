# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a React 19 + TypeScript admin panel built with Vite, TanStack Router (file-based routing), TanStack Query (React Query), and Tailwind CSS. The application implements comprehensive RBAC (Role-Based Access Control) and follows a feature-first architecture.

## Development Commands

```bash
npm run dev        # Start development server (Vite)
npm run build      # TypeScript check + production build
npm run lint       # Run ESLint
npm run preview    # Preview production build
```

## Core Architecture

### Feature-First Structure

Features are self-contained modules under `src/features/[feature]/`:

```
features/
└── [feature]/
    ├── components/          # Feature-specific components
    ├── types/              # Feature types
    ├── [feature]Service.ts # Raw API calls
    └── [feature]Queries.ts # React Query setup
```

### Routing System (TanStack Router)

File-based routing with auto-generated route tree (`src/routeTree.gen.ts`). Routes are organized in:

- `routes/_auth/` - Unauthenticated routes (login, signup, verify-otp, reset-password etc)
- `routes/_protected/` - Authenticated routes
- `routes/_public/` - Public routes (unauthorized page)

Route files use:

- `staticData.pageTitle` for dynamic page titles
- `beforeLoad` for auth checks and data prefetching
- Zod schemas for search param validation
- Type-safe navigation via `useNavigate()`

///////// DOUBT /////////////
**IMPORTANT**: Keep page logic directly in route files. DO NOT create separate page-level components (e.g., `CreateOrderPage`, `EditUserPage`). The `RouteComponent` function should contain the main page logic. Only extract smaller, reusable part-level components (e.g., `OrderItemsList`, `CustomerInfoSection`) when needed.

After creating new routes, run `npm run dev` to regenerate `routeTree.gen.ts`.

### Data Fetching Pattern (Service + Query Layer)

1. **Service Layer** (`[feature]Service.ts`) - API calls using typed axios wrappers:

   ```typescript
   export const getItems = () => getData<ItemResponse>("/api/items");
   ```

2. **Query Layer** (`[feature]Queries.ts`) - React Query configuration:

   ```typescript
   export const itemKeys = {
     all: ["items"] as const,
     list: () => [...itemKeys.all, "list"] as const,
   };

   export const useItemsQuery = () =>
     useQuery({
       queryKey: itemKeys.list(),
       queryFn: getItems,
     });
   ```

3. **Component Usage** - Consume via hooks:
   ```typescript
   const { data, isLoading } = useItemsQuery();
   ```

### API Client (`src/api/axiosInstance.ts`)

Centralized axios instance with:

- Automatic token injection via interceptor
- Typed wrappers: `getData<T>()`, `postData<T>()`, `putData<T>()`, `patchData<T>()`, `deleteData<T>()`, `getPaginatedData<T>()`
- Base URL from `VITE_SERVER_URL` environment variable
- Error handling with Sentry integration

Always use these wrappers instead of raw axios calls.

### State Management

- **Global State**: Zustand stores in `src/store/`
  - `useAuthStore` - Authentication state
  - `usePermissionStore` - RBAC permissions
  - `useTheme` - Theme state
- **Server State**: TanStack Query (React Query)
- **Form State**: React Hook Form + Zod

### RBAC (Role-Based Access Control)

Permission system integrated throughout the app:

**Permission Check Utilities** (`src/utils/rbac.ts`):

```typescript
hasAccess(PermissionFeaturesEnum.ORDERS, PermissionTypeEnum.WRITE);
getFeaturePermissions(PermissionFeaturesEnum.STORES);
```

**Permission Types**:

- `read` - View/list access
- `write` - Create/edit access
- `delete` - Delete access

**Enums**:

- `PermissionFeaturesEnum` - Feature names (ORDERS, STORES, etc.)
- `PermissionTypeEnum` - Permission levels (read, write, delete)

Use RBAC checks in:

- Route `beforeLoad` functions for route-level protection
- Components for conditional rendering (buttons, actions)
- Table action columns for row-level actions

### Forms Pattern

React Hook Form + Zod validation:

```typescript
const schema = z.object({
  name: z.string().min(1, "Required"),
});

type FormFields = z.infer<typeof schema>;

const {
  register,
  handleSubmit,
  formState: { errors },
} = useForm<FormFields>({
  resolver: zodResolver(schema),
});
```

Common form components in `src/components/common-form-fields/`.

### Route Constants Pattern

Routes defined in `src/constants/routes.ts` as nested object:

```typescript
export const ROUTES = {
  ORDERS: {
    ALL: "/orders/all",
    DETAILS: (orderId: string) => `/orders/details/${orderId}`, // Dynamic routes as functions
  },
};
```

Update both `routes.ts` AND `navItems.ts` when adding new navigable routes.

### Component Organization

- `components/base/` - Atomic UI primitives (Button, Input, etc.)
- `components/compound/` - Complex reusable components (Table, Dialog, DatePicker)
- `components/common-form-fields/` - Reusable form fields
- `components/query-selectors/` - Select components that fetch data via React Query
- `components/shared/` - Layout components (Header, Sidebar)

Use base components for consistency. Extend with Tailwind classes as needed.

### Modular Component Architecture

**IMPORTANT**: Always prefer a modular component structure over monolithic components. Break down complex components into smaller, focused, reusable pieces.

**Principles:**

- **Single Responsibility**: Each component should have one clear purpose
- **Separation of Concerns**: Separate container logic from presentation
- **Reusability**: Extract repeated patterns into standalone components
- **Maintainability**: Smaller components are easier to test, debug, and modify

**When to Modularize:**

- Component exceeds ~200 lines
- Contains repeated JSX patterns (e.g., form fields, list items, cards)
- Has distinct logical sections (e.g., sections within a form)
- Similar patterns appear in multiple places

**Benefits:**

- ✅ Easier to understand and navigate
- ✅ Better code organization and separation of concerns
- ✅ Components can be tested independently
- ✅ Reduces cognitive load when making changes
- ✅ Enables component reuse across the application
- ✅ Simplifies debugging and maintenance

## UI Design Principles & Style Guide

### Core Philosophy

**Minimal, Sleek, Human-Scaled** — Clean interfaces with purposeful spacing, subtle interactions, and no overwhelming visual elements.

---

### 1. Design System Foundation

#### Use Semantic Theme Variables (ALWAYS)

**CRITICAL**: Never use arbitrary colors. Always use the predefined theme variables.

**Color Palette Structure:**

- **Primary**: `pl-*` (light) / `pd-*` (dark) — Brand colors (900→50)
- **Neutral**: `nl-*` (light) / `nd-*` (dark) — Text, borders, backgrounds (900→50)
- **Danger**: `dl-*` (light) / `dd-*` (dark) — Errors, destructive actions (400-600)
- **Success**: `sl-*` (light) / `sd-*` (dark) — Success states (400-600)
- **Tints**: `t-violet`, `t-blue`, `t-indigo`, `t-amber`, `t-pink`, `t-peach`, `t-yellow`, `t-green`, `t-gray`, `t-orange`, `t-purple`

**Usage Examples:**

```tsx
// ✅ CORRECT - Use theme variables
<div className="bg-nl-50 dark:bg-nd-900 text-nl-800 dark:text-nd-100">
<button className="bg-pl-600 dark:bg-pd-500 hover:bg-pl-700">

// ❌ WRONG - Never use arbitrary colors
<div className="bg-gray-50 dark:bg-gray-900 text-gray-800">
<button className="bg-blue-600 hover:bg-blue-700">
```

#### Pre-built Utility Classes

- **Typography**: Headings (`<h1>`-`<h6>`), `<p>`, `<small>` are pre-styled — use semantic HTML
- **Cards**: Use `.card` class for consistent card styling
- **Centering**: Use `.fall` for flex center alignment
- **Icons**: Lucide icons automatically themed (`nl-600` / `nd-200`)
- **Skeleton Loaders**: Use `.shimmer` class for loading states (animated gradient effect, auto-themed for dark/light mode)

#### Rounded Design System

The application follows a rounded design system. Almost all UI elements should use rounded corners:

- **Cards and containers**: `rounded-xl` or `rounded-2xl`
- **Buttons and inputs**: `rounded-lg` or `rounded-xl`
- **Badges and chips**: `rounded-lg` or `rounded-xl`
- **Modal and sheet content**: `rounded-xl`
- **Avoid sharp corners** (no `rounded-none` or `rounded-sm`) unless specifically required

---

### 2. Spacing & Sizing

**Human-Scaled Proportions** — Nothing feels too large or cramped.

- **Component padding**: `p-4` to `p-8` (16px-32px)
- **Card padding**: `p-6` (24px)
- **Gap between elements**: `gap-4` to `gap-6` (16px-24px)
- **Section spacing**: `mb-8` to `mb-12` (32px-48px)
- **Max widths**: `max-w-md` (448px) to `max-w-4xl` (896px)
- **Vertical rhythm**: Consistent spacing (multiples of 4)

---

### 3. Typography

**Semantic HTML First** — Pre-styled heading and text elements.

- Use `<h1>` through `<h6>`, `<p>`, and `<small>` — they're already styled
- **Weight hierarchy**: `font-bold` for emphasis, `font-medium` for interactive elements
- **Muted/secondary text**: Use `text-nl-500 dark:text-nd-400` for less important text, `text-nl-600 dark:text-nd-300` for secondary content, and `text-nl-800 dark:text-nd-100` for important text

---

### 4. Interactive Elements

**Subtle, Responsive, Purposeful**

#### Hover States

Always provide subtle interaction feedback. Choose subtle interactions where appropriate:

```tsx
// Subtle scale + opacity
<div className="hover:scale-[1.02] hover:opacity-90 transition-all duration-300">

// Background change
<button className="hover:bg-nl-100 dark:hover:bg-nd-700 transition-colors">

// Border highlight
<div className="hover:border-pl-500 dark:hover:border-pd-400 transition-colors">
```

#### Transitions

- **Default**: `transition-all duration-300`
- **Use**: `ease-in-out` for smooth feel
- **Apply to**: hover states, focus states, color changes, transforms

---

### 5. Dark Mode (Default)

**Dark First, Light Compatible** — The application defaults to dark mode. Always design with both modes in mind.

**Color Usage by Text Importance:**

- **Primary/Important text**: `text-nl-800 dark:text-nd-100`
- **Secondary text**: `text-nl-600 dark:text-nd-300`
- **Muted text**: `text-nl-500 dark:text-nd-400`
- **Borders** (most cases): `border-nl-200 dark:border-nd-500`
- **Backgrounds**:
  - Cards: `bg-nl-50 dark:bg-nd-800`
  - Page backgrounds: `bg-nl-100 dark:bg-nd-900`
- **Lucide icons**: Auto-theme with `.lucide` class

**IMPORTANT**: Every component should have proper styling for both themes. Test components in both modes to ensure readability and visual consistency.

---

### 6. Layout Principles

- **Vertical rhythm**: Consistent spacing (multiples of 4)
- **Centered content**: `.fall` or `flex items-center justify-center`
- **Responsive grids**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Max-width containers**: Keep content readable, not full-bleed
- **Responsive breakpoints**: Mobile-first approach with `md:` and `lg:` breakpoints

---

### 7. Skeleton Loading States

**IMPORTANT**: Always use the `.shimmer` class for skeleton loaders instead of `animate-pulse` or custom background colors.

**Why `.shimmer`:**
- ✅ Consistent animated gradient effect across the application
- ✅ Automatically themed for both dark and light modes
- ✅ Smoother, more professional loading animation
- ✅ No need to specify background colors (`bg-nl-200 dark:bg-nd-700`)

**Usage:**

```tsx
// ✅ CORRECT - Use shimmer class
<div className="shimmer h-10 w-32 rounded-lg" />
<div className="shimmer h-12 w-full rounded-xl" />

// ❌ WRONG - Don't use animate-pulse with background colors
<div className="h-10 w-32 animate-pulse rounded-lg bg-nl-200 dark:bg-nd-700" />
```

**Best Practices:**
- Match skeleton shapes to actual content (same height, width, border-radius)
- Use proper rounded classes (`rounded-lg`, `rounded-xl`) consistent with design system
- Group related skeleton elements in containers that match the final layout
- The shimmer class automatically handles visibility, colors, and animation

**Example Skeleton Component:**

```tsx
const UserCardSkeleton = () => (
  <div className="card p-6 space-y-4">
    <div className="shimmer h-6 w-32 rounded-lg" /> {/* Title */}
    <div className="flex gap-4">
      <div className="shimmer size-12 rounded-full" /> {/* Avatar */}
      <div className="flex-1 space-y-2">
        <div className="shimmer h-4 w-24 rounded-lg" /> {/* Name */}
        <div className="shimmer h-4 w-full rounded-lg" /> {/* Description */}
      </div>
    </div>
  </div>
);
```

---

### 8. Button Component Conventions

When using primary color buttons with `filled` variant and icons (`startIcon` or `endIcon`), apply white color to the icon using `startIconClassname` or `endIconClassname` respectively:

```typescript
<Button
  variant="filled"
  color="primary"
  startIcon="User"
  startIconClassname="text-white"
>
  Change Customer
</Button>
```

---

### 9. Common Pitfalls to Avoid

❌ **Never** use arbitrary colors (`bg-gray-800`, `text-white`, `bg-blue-500`)
❌ **Never** ignore theme variables — always use `pl-*`, `nl-*`, `pd-*`, `nd-*`, etc.
❌ **Never** make components too large — keep them human-scaled
❌ **Never** skip hover states — always provide feedback on interactive elements
❌ **Never** forget responsive design — mobile-first approach
❌ **Never** use sharp corners — follow the rounded design system
❌ **Never** design for only one theme — always consider both dark and light modes
❌ **Never** use `animate-pulse` for skeletons — always use `.shimmer` class

---

### 10. Implementation Checklist

Before finalizing any component, verify:

- [ ] All colors use theme variables (`pl-*`, `nl-*`, `pd-*`, `nd-*`, tints, etc.)
- [ ] Used `.card`, `.fall`, `.shimmer`, or semantic HTML where applicable
- [ ] Hover states and transitions included for interactive elements
- [ ] Spacing follows consistent scale (multiples of 4)
- [ ] Responsive breakpoints implemented (`md:`, `lg:`)
- [ ] Both dark and light mode styles properly implemented
- [ ] No arbitrary colors or magic numbers
- [ ] Follows rounded design system (`rounded-lg`, `rounded-xl`, `rounded-2xl`)
- [ ] Text hierarchy uses appropriate color variants based on importance
- [ ] Skeleton loaders use `.shimmer` class instead of `animate-pulse`

### Table Pattern

Reusable `Table` component (`src/components/compound/table/Table.tsx`):

```typescript
<Table<ItemType>
  columns={[
    { header: 'Name', accessor: 'name' },
    { header: 'Status', accessor: 'status', render: (value) => <Badge>{value}</Badge> },
  ]}
  data={items}
  isLoading={isLoading}
  actionColumn={{
    onEdit: hasAccess(FEATURE, WRITE) ? (row) => navigate(ROUTES.EDIT(row.id)) : undefined,
    onDelete: hasAccess(FEATURE, DELETE) ? handleDelete : undefined,
  }}
/>
```

### Type Patterns

- **Shared types**: `src/types/`
- **Feature types**: `features/[feature]/types/`
- **Base API types**: `BaseApiResponse<T>`, `PaginatedResponse<T>`, `BaseApiErrorResponse`
- Always export types through `index.ts` in type directories

### Query Key Factory Pattern

Consistent query key structure for cache management:

```typescript
export const featureKeys = {
  all: ["feature"] as const,
  lists: () => [...featureKeys.all, "list"] as const,
  list: (filters: Filters) => [...featureKeys.lists(), filters] as const,
  details: () => [...featureKeys.all, "detail"] as const,
  detail: (id: string) => [...featureKeys.details(), id] as const,
};
```

## Key Libraries & Patterns

- **Styling**: Tailwind CSS v4 (use utility classes)
- **Icons**: Lucide React (`import { IconName } from 'lucide-react'`)
- **Toasts**: Custom toast wrapper from `@/components/compound/Sonner` (`toast.success()`, `toast.error()`, `toast.warning()`, `toast.info()`). **IMPORTANT**: Always import `toast` from `@/components/compound/Sonner`, NOT from `sonner` directly.
- **Currency Display**: Use `CurrencyDisplay` component from `@/components/compound/CurrencyDisplay` for displaying currency values. It automatically formats amounts in INR format and supports optional strike-through pricing (`<CurrencyDisplay amount={100} strikeThroughPrice={150} />`).
- **Date Formatting**: Use `prettyDate()` from `@/utils/formatDateTime` for formatting dates. It accepts timestamps (in milliseconds) and provides flexible options:
  - Default: Shows date, day, year, and time (e.g., "31 OCT 25 (THU) - 02:30 PM")
  - Date only: `prettyDate(timestamp, { showTime: false })` (e.g., "31 OCT 25 (THU)")
  - Custom options: `{ showDate, showDay, showTime, showYear }`
  - Also available: `prettyDateRange()` for date ranges
- **Number Formatting**: Use `prettyNumber()` from `@/utils/helpers` for formatting numbers with thousand separators. It formats numbers in Indian numbering system (e.g., `prettyNumber(40000)` → "40,000"). Returns `undefined` for null/undefined/NaN values.
- **Images**: Use `ImageComponent` from `@/components/compound/ImageComponent` for displaying images. **IMPORTANT**: Always use `ImageComponent` instead of `<img>` tags. It provides automatic fallback handling, lazy loading, zoom functionality, and supports both string URLs and File objects. Example: `<ImageComponent src={imageUrl} alt="Description" className="size-20" />`.
- **Drag & Drop**: DND Kit
- **Rich Text**: TipTap editor
- **Maps**: Google Maps React API wrapper

## Important Conventions

1. **Always use typed axios wrappers** from `src/api/axiosInstance.ts`
2. **Separate service and query layers** - don't mix API calls with React Query setup
3. **Use query key factories** for consistent cache management
4. **Check RBAC permissions** before showing actions or allowing navigation
5. **Define routes in ROUTES constant** before creating route files
6. **Use Zod schemas** for form validation and route search params
7. **Follow feature-first organization** for new features
8. **Use base components** for UI consistency
9. **Regenerate route tree** after adding/modifying routes (happens automatically in dev mode)
10. **Export types through index.ts** for clean imports
11. **Use useDebounce hook** for API search inputs to optimize performance and reduce unnecessary API calls
12. **Use phoneSchema from `src/utils/validators.ts`** for phone number validation (validates 10-digit Indian mobile numbers starting with 6-9)

## Environment Variables

Required variables in `.env`:

- `VITE_SERVER_URL` - Backend API base URL
- `VITE_GOOGLE_MAPS_API_KEY` - Google Maps API key

## Error Handling

- API errors caught by axios interceptor
- User-friendly error messages via `showErrorToasts` utility
- Production errors tracked with Sentry
- Error boundaries with `GlobalNotFound` component
