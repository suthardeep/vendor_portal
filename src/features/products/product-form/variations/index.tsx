import { useState, useEffect } from "react";
import ShimmerBox from "@/components/base/ShimmerBox";

import VariationStep1 from "./components/step-1/VariationStep1";
import VariationStep2 from "./components/step-2/VariationStep2";
import { useGetVariantsQuery } from "./api/queryHooks";
import { useProductDetailsQuery } from "../product-header/api/queryHooks";
import { useNavigate, useRouter } from "@tanstack/react-router";

const VariationsAndCombinations = ({ productId }: { productId: string }) => {
  // 1 = Create Combinations, 2 = Fill Details
  const [internalStep, setInternalStep] = useState<1 | 2>(2);
  const navigate = useNavigate();
  const router = useRouter();

  // Fetch product details (includes variants with full data for prefilling)
  const { data: productDetails, isLoading: isLoadingDetails } = useProductDetailsQuery(productId);

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

  if (!productDetails?.hasVariants) {
  return (
    <div className="w-full min-h-[60vh] flex items-center justify-center p-6">
      <div className="max-w-md w-full text-center">
        <div className="mb-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gray-100 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
              />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Variants Available
          </h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            This product does not have any variants configured. Product variants allow you to offer different versions of the same product, such as different sizes, colors, or materials.
          </p>
        </div>
        
        <button
          onClick={() => router.history.back()}
          className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Go Back
        </button>
      </div>
    </div>
  );
}

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
