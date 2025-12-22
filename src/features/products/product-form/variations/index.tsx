import { useState, useEffect } from "react";
import ShimmerBox from "@/components/base/ShimmerBox";

import VariationStep1 from "./components/step-1/VariationStep1";
import VariationStep2 from "./components/step-2/VariationStep2";
import { useGetVariantsQuery } from "./api/queryHooks";
import { useProductDetailsQuery } from "../product-header/api/queryHooks";
import { useNavigate } from "@tanstack/react-router";

const VariationsAndCombinations = ({ productId }: { productId: string }) => {
  // 1 = Create Combinations, 2 = Fill Details
  const [internalStep, setInternalStep] = useState<1 | 2>(2);
  const navigate = useNavigate();

  // Fetch product details (includes variants with full data for prefilling)
  const { data: productDetails, isLoading: isLoadingDetails } = useProductDetailsQuery(productId);
console.log("products data : ", productDetails)
  // Use the variants API as fallback
  const { data: variantsData, isLoading: isLoadingVariants, refetch } = useGetVariantsQuery(productId);

  // Prefer product details variants over API variants for prefilling
  const variants = productDetails?.variants || variantsData?.data?.variants || [];
  const isLoading = isLoadingDetails || isLoadingVariants;

  useEffect(() => {
    // Check if variants exist to determine which step to show
    if (variants.length > 0) {
      setInternalStep(2);
    } else {
      setInternalStep(1);
    }
  }, [variants]);

  const handleStep1Success = async () => {
    await refetch();
    setInternalStep(2);
  };

  const handleBackToGeneration = () => {
    // setInternalStep(1);
    navigate({ to: `/products/product-form/${productId}/basic-details` });
  };

if (isLoading) {
  return (
    <div className="space-y-6 rounded-xl border border-gray-200 bg-white p-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <ShimmerBox className="h-6 w-48 rounded-md" />
        <ShimmerBox className="h-9 w-32 rounded-md" />
      </div>

      {/* Form fields */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <ShimmerBox className="h-4 w-24 rounded" />
          <ShimmerBox className="h-10 w-full rounded-md" />
        </div>

        <div className="space-y-2">
          <ShimmerBox className="h-4 w-28 rounded" />
          <ShimmerBox className="h-10 w-full rounded-md" />
        </div>

        <div className="space-y-2 md:col-span-2">
          <ShimmerBox className="h-4 w-32 rounded" />
          <ShimmerBox className="h-24 w-full rounded-md" />
        </div>
      </div>

      {/* Footer buttons */}
      <div className="flex justify-end gap-3 pt-4">
        <ShimmerBox className="h-10 w-24 rounded-md" />
        <ShimmerBox className="h-10 w-32 rounded-md" />
      </div>
    </div>
  );
}

  return (
    <>
      {internalStep === 1 ? (
        <VariationStep1 productId={productId} onSuccess={handleStep1Success} />
      ) : (
        <VariationStep2
          productId={productId}
          // Pass the variants data to Step 2 (from product details or fallback)
          variants={variants}
          onBack={handleBackToGeneration}
        />
      )}
    </>
  );
};

export default VariationsAndCombinations;
