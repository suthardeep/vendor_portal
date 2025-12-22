import React from "react";
import { useNavigate, useLocation } from "@tanstack/react-router";
import { Icon } from "@/components/base/Icon";
import PillPath from "@/components/compound/PillPath";
import { cn } from "@/utils/helpers";
import { Separator } from "@/components/base/Separator";
import ShimmerBox from "@/components/base/ShimmerBox";
import { useProductDetailsQuery } from "./api/queryHooks";

interface ProductHeaderProps {
  title?: string;
  showSteps?: boolean;
  enableStepClick?: boolean;
  actionButtons?: React.ReactNode[];
  productId: string;
}

const STEPS_WITH_VARIATIONS = [
  { id: "basic-details", label: "Basic Details", number: 1 },
  { id: "variations", label: "Variations", number: 2 },
  { id: "pricing-and-shipping", label: "Pricing & Shipping", number: 3 },
];

const STEPS_WITHOUT_VARIATIONS = [
  { id: "basic-details", label: "Basic Details", number: 1 },
  { id: "pricing-and-shipping", label: "Pricing & Shipping", number: 2 },
];

export const ProductHeader: React.FC<ProductHeaderProps> = ({
  title = "Add Product",
  showSteps = false,
  enableStepClick = false,
  actionButtons,
  productId,
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { data: product, isLoading } = useProductDetailsQuery(productId);
  const hasVariants = product?.hasVariants ?? false;

  const STEPS = hasVariants ? STEPS_WITH_VARIATIONS : STEPS_WITHOUT_VARIATIONS;
  console.log("Steps: ", STEPS)

  const currentStepId = STEPS.find((step) => location.pathname.includes(step.id))?.id || "basic-details";
console.log("currentStepId: ", location.pathname)
  // Show shimmer loading state
  if (!productId || isLoading) {
    return <LoadingSkeleton />;
  }

  const handleStepClick = (stepId: string) => {
    if (enableStepClick && productId) {
      navigate({ to: `/products/product-form/${productId}/${stepId}` });
    }
  };

  return (
    <div className="bg-base-1 shadow-card rounded-xl mb-4">
      <div className="flex flex-col gap-4 p-4 md:p-5 md:pb-0">
        {/* Top Row: Title + Steps */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
          <h1 className="text-xl sm:text-2xl font-semibold text-base-content">{title}</h1>

          {showSteps && (
            <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 lg:pb-0 scrollbar-hide">
              {STEPS.map((step) => {
                const isActive = step.id === currentStepId;
                return (
                  <div
                    key={step.id}
                    onClick={() => handleStepClick(step.id)}
                    className={cn(
                      "flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition-all duration-200 select-none shrink-0",
                      enableStepClick && "hover:scale-[1.02] active:scale-[0.98]",
                      enableStepClick ? "cursor-pointer" : "cursor-default",
                      isActive ? "bg-primary/10 shadow-sm" : "bg-base-2 hover:bg-base-2/80"
                    )}
                  >
                    <span
                      className={cn(
                        "flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold border transition-all duration-200",
                        isActive
                          ? "bg-primary text-primary-content border-primary"
                          : "bg-transparent text-base-content/60 border-base-content/30"
                      )}
                    >
                      {step.number}
                    </span>
                    <span
                      className={cn(
                        "text-xs sm:text-sm font-medium whitespace-nowrap",
                        isActive ? "text-primary" : "text-base-content/60"
                      )}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <Separator />

        {/* Product Details Row (Only if ID exists) */}
        {product && (
          <div className="flex flex-col gap-2">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex items-center gap-3">
                <h2 className="text-base sm:text-lg font-medium text-base-content">{product.name}</h2>
              </div>

              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                {actionButtons?.map((btn, idx) => (
                  <React.Fragment key={idx}>{btn}</React.Fragment>
                ))}
              </div>
            </div>

            <div className="w-full flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between ">
              {/* Brand Card */}
              {product.brandName && (
                <div className="flex items-center gap-2 sm:gap-3 px-3 py-2 bg-base-2 rounded-lg border border-base-content/10 shrink-0 w-full sm:w-auto">
                  {product.brandLogo ? (
                    <img
                      src={product.brandLogo}
                      alt={product.brandName ?? "Brand Logo"}
                      className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
                    />
                  ) : (
                    <Icon name="Tag" className="w-4 h-4 sm:w-5 sm:h-5 text-base-content/50" />
                  )}
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] uppercase text-base-content/50 leading-tight">Brand</span>
                    <span className="text-sm font-medium leading-tight truncate">{product.brandName}</span>
                  </div>
                </div>
              )}

              {/* Categories */}
              <div className="w-2/3 overflow-hidden ">
                <PillPath
                  label="Product Categories"
                  items={product.categoryPath}
                  showSeparator
                  separatorClassname="xl:text-sm px-1"
                  mainContainerClassname={cn(!product.brandName && "md:pl-0 pl-0")}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

//Shimmer
const LoadingSkeleton: React.FC = () => (
  <div className="bg-base-1 shadow-card rounded-xl mb-4">
    <div className="flex flex-col gap-4 p-4 sm:p-6">
      {/* Title and Steps Row */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
        {/* Title Shimmer */}
        <ShimmerBox className="h-8 w-48 sm:w-64" />

        {/* Steps Shimmer */}
        <div className="flex items-center gap-2 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0">
          {[1, 2, 3].map((i) => (
            <ShimmerBox key={i} className="h-10 w-40 shrink-0" />
          ))}
        </div>
      </div>

      <Separator />

      {/* Product Details Shimmer */}
      <div className="flex flex-col gap-4">
        {/* Product Name and Actions */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <ShimmerBox className="h-7 w-56 sm:w-80" />
          <div className="flex items-center gap-3">
            <ShimmerBox className="h-9 w-20" />
            <ShimmerBox className="h-9 w-24" />
          </div>
        </div>

        {/* Brand and Categories */}
        <div className="flex flex-col xl:flex-row gap-4 xl:items-center xl:justify-between">
          {/* Brand Shimmer */}
          <ShimmerBox className="h-16 w-full sm:w-48 xl:shrink-0" />

          {/* Categories Shimmer */}
          <div className="flex items-center gap-2 overflow-x-auto w-full">
            <ShimmerBox className="h-8 w-32 shrink-0" />
            <ShimmerBox className="h-8 w-24 shrink-0" />
            <ShimmerBox className="h-8 w-28 shrink-0" />
          </div>
        </div>
      </div>
    </div>
  </div>
);
