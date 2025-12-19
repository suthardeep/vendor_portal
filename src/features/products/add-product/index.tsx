import { useState } from "react";
import { FindInAavakCatalogTab } from "./components/FindInAavakCatalogTab";
import { CreateNewProductTab } from "./components/CreateNewProductTab";
import { cn } from "@/utils/helpers";
import { Icon } from "@/components/base/Icon";
import { Separator } from "@/components/base/Separator";

type Tab = "catalog" | "new";

const ProductCreation = () => {
  const [activeTab, setActiveTab] = useState<Tab>("catalog");

  return (
    <div className="h-full">
      <div className="rounded-2xl shadow-card h-full bg-base-1">
        <div className="w-full p-4">
          <h1 className="text-xl md:text-2xl font-semibold text-base-content">Add Product</h1>
        </div>

        <Separator />

        <div className="p-4 space-y-6">
          <div className="">
            <h2 className="text-lg font-semibold text-base-content mb-4">Submit Your Product for Listing</h2>

            {/* Custom Tab Switcher */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setActiveTab("catalog")}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left sm:text-center flex-1",
                  activeTab === "catalog"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-base-content/20 bg-transparent text-base-content/60 hover:bg-base-2"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-md",
                    activeTab === "catalog" ? "bg-primary text-white" : "bg-base-3 text-base-content"
                  )}
                >
                  <Icon
                    name="Database"
                    className={cn(activeTab === "catalog" ? "text-white" : "text-base-content")}
                    size={20}
                  />
                </div>
                <span className="font-medium text-base">Find in Aavak's Catalog</span>
              </button>

              <button
                onClick={() => setActiveTab("new")}
                className={cn(
                  "flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left sm:text-center flex-1",
                  activeTab === "new"
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-base-content/20 bg-transparent text-base-content/60 hover:bg-base-2"
                )}
              >
                <div
                  className={cn(
                    "p-2 rounded-md",
                    activeTab === "new" ? "bg-primary text-white" : "bg-base-3 text-base-content"
                  )}
                >
                  <Icon
                    name="PlusSquare"
                    className={cn(activeTab === "new" ? "text-white" : "text-base-content")}
                    size={20}
                  />
                </div>
                <span className="font-medium text-base">Create a New Product</span>
              </button>
            </div>
          </div>

          <div className="">
            {activeTab === "catalog" ? <FindInAavakCatalogTab /> : <CreateNewProductTab />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCreation;
