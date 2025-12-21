import { MenuItem } from "@/components/base/Sidebar";

export const sidebarMenuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: "Home",
    path: "/dashboard",
  },
  {
    label: "Orders",
    icon: "Package",
    subItems: [
      { label: "All Orders", path: "/orders" },
      { label: "New Orders", path: "/orders/new-orders" },
    ],
    badge: 8,
  },
  {
    label: "Products",
    icon: "Box",
    subItems: [
      { label: "All Products", path: "/products" },
      { label: "Active Products", path: "/active-products" },
      { label: "Products Under Approval", path: "/products-under-approval" },
      { label: "Add Product", path: "/products/add-product" },
      { label: "Drafts", path: "/drafts" },
      { label: "Categories", path: "/products/categories" },
    ],
  },
  {
    label: "Customers",
    icon: "Target",
    path: "/customers",
  },
  {
    label: "Analytics",
    icon: "BarChart3",
    path: "/analytics",
  },
  {
    label: "Settings",
    icon: "Info", 
    subItems: [
      { label: "General", path: "/settings/general" },
      { label: "Billing", path: "/settings/billing" },
      { label: "Security", path: "/settings/security" },
    ],
  },
];
