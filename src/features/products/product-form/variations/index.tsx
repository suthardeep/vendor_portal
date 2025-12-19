import React, { useState, useEffect } from "react";
import { useParams } from "@tanstack/react-router";
import ShimmerBox from "@/components/base/ShimmerBox";

import VariationStep1 from "./components/step-1/VariationStep1";
import VariationStep2 from "./components/step-2/VariationStep2";
import { useGetVariationsQuery } from "./api/queryHooks";

const VariationsAndCombinations = () => {
  const { productId } = useParams({ from: "/_app/products/product-form/$productId/variations" });
  
  // 1 = Create Combinations, 2 = Fill Details
  const [internalStep, setInternalStep] = useState<1 | 2>(2);

  // Use the typed query hook
  const { data: variationsData, isLoading, refetch } = useGetVariationsQuery(productId);

  useEffect(() => {
    // Now TypeScript knows 'combinations' exists on variationsData
    if (variationsData?.combinations && variationsData.combinations.length > 0) {
      setInternalStep(2);
    } else {
      setInternalStep(1);
    }
  }, [variationsData]);

  const handleStep1Success = async () => {
    await refetch(); 
    setInternalStep(2);
  };

  const handleBackToGeneration = () => {
    setInternalStep(1);
  };

  if (isLoading) return <ShimmerBox className="h-96 w-full rounded-xl" />;

  return (
    <>
      {internalStep === 1 ? (
        <VariationStep1 
          productId={productId} 
          onSuccess={handleStep1Success} 
        />
      ) : (
        <VariationStep2 
          productId={productId} 
          // Check for undefined safely
          combinations={variationsData?.combinations || []}
          onBack={handleBackToGeneration}
        />
      )}
    </>
  );
};

export default VariationsAndCombinations;