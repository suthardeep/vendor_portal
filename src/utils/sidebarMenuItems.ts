import { MenuItem } from "@/components/base/Sidebar";

export const sidebarMenuItems: MenuItem[] = [
  {
    label: "Dashboard",
    icon: "Home",
    path: "/app/dashboard",
  },
  {
    label: "Orders",
    icon: "Package",
    subItems: [
      { label: "All Orders", path: "/app/orders" },
      { label: "Pending", path: "/app/orders/pending" },
      { label: "Completed", path: "/app/orders/completed" },
    ],
    badge: 8,
  },
  {
    label: "Products",
    icon: "Box",
    subItems: [
      { label: "All Products", path: "/app/products" },
      { label: "Add Product", path: "/app/products/create" },
      { label: "Categories", path: "/app/products/categories" },
    ],
  },
  {
    label: "Customers",
    icon: "Target", // Using ONLY available icons
    path: "/app/customers",
  },
  {
    label: "Analytics",
    icon: "BarChart3",
    path: "/app/analytics",
  },
  {
    label: "Settings",
    icon: "Info", 
    subItems: [
      { label: "General", path: "/app/settings/general" },
      { label: "Billing", path: "/app/settings/billing" },
      { label: "Security", path: "/app/settings/security" },
    ],
  },
];
