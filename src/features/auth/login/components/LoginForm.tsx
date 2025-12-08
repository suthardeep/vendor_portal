import Icon from "@/components/base/Icon";
import Sidebar from "@/components/base/Sidebar";

const LoginForm = () => {
  return (
    <div className="flex h-dvh bg-gray-50 overflow-hidden">
      <Sidebar
        logo="aavak-logo.svg"
        userRole="Vendor"
        userName="Jeel Thumar"
        userAvatar="profile.jpg"
        activePath="/orders/active"
        menuItems={[
          { 
            label: "Dashboard", 
            icon: "Home", 
            path: "/dashboard" 
          },
          { 
            label: "Products", 
            icon: "Package", 
            subItems: [
              { label: "All Products", path: "/products/all" },
              { label: "Add Product", path: "/products/add" },
              { label: "Categories", path: "/products/categories" }
            ]
          },
          { 
            label: "Discounts & Offers", 
            icon: "Tag", 
            subItems: [
              { label: "Active Offers", path: "/discounts/active" },
              { label: "Create Offer", path: "/discounts/create" }
            ]
          },
          { 
            label: "Orders", 
            icon: "Box", 
            subItems: [
              { label: "Active Orders", path: "/orders/active" },
              { label: "Returns Orders", path: "/orders/returns" },
              { label: "Cancel Orders", path: "/orders/cancel" }
            ]
          },
          { 
            label: "Inventory", 
            icon: "Archive", 
            path: "/inventory" 
          },
          { 
            label: "UGC Campaigns", 
            icon: "Target", 
            path: "/ugc-campaigns" 
          },
          { 
            label: "My Finance", 
            icon: "Wallet", 
            path: "/finance" 
          },
          { 
            label: "Warehouse", 
            icon: "Warehouse", 
            path: "/warehouse" 
          },
       
          { 
            label: "Inbox", 
            icon: "Inbox", 
            path: "/inbox",
            badge: 3
          },
          { 
            label: "Reports & Analytics", 
            icon: "BarChart3", 
            path: "/reports" 
          },
          { 
            label: "My Shipment", 
            icon: "Truck", 
            path: "/shipment" 
          }
        ]}
        onNavigate={(path) => {
          console.log("Navigating to:", path);
          // router.push(path) or your navigation logic
        }}
      />
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {/* Your page content here */}
      </div>
    </div>
  );
};

export default LoginForm;