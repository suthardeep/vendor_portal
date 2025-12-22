import { useState, useEffect } from "react";
import ShimmerBox from "@/components/base/ShimmerBox";

import VariationStep1 from "./components/step-1/VariationStep1";
import VariationStep2 from "./components/step-2/VariationStep2";
import { useGetVariantsQuery } from "./api/queryHooks";

const VariationsAndCombinations = ({ productId } : { productId: string }) => {
  
  // 1 = Create Combinations, 2 = Fill Details
  const [internalStep, setInternalStep] = useState<1 | 2>(2);

  // Use the new variants API
  const { data: variantsData, isLoading, refetch } = useGetVariantsQuery(productId);

  useEffect(() => {
    // Check if variants exist to determine which step to show
    if (variantsData?.data?.variants && variantsData.data.variants.length > 0) {
      setInternalStep(2);
    } else {
      setInternalStep(1);
    }
  }, [variantsData]);

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
          // Pass the variants data to Step 2
          variants={variantsData?.data?.variants || []}
          onBack={handleBackToGeneration}
        />
      )}
    </>
  );
};

export default VariationsAndCombinations;