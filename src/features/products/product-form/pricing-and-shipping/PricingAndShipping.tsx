import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/base/Input";
import { Button } from "@/components/base/Button";
import { toast } from "@/components/compound/Sonner";
import CurrencyDisplay from "@/components/compound/CurrencyDisplay";
import {
  useUpdateVariantsPricingMutation,
  useSubmitProductMutation,
} from "./api/queryHooks";
import BreakdownDialog from "./components/BreakdownDialog";
import { useGetVariantsQuery } from "../variations/api/queryHooks";
import { validateVariantPricingForm } from "./schemas/pricing.schema";
import { Separator } from "@/components/base/Separator";
import { formatCurrencyINR } from "@/utils/helpers";

interface PricingAndShippingProps {
  productId: string;
}

interface VariantFormData {
  variantId: string;
  mrp: string;
  sellingPrice: string;
  aavakCoinsPrice: string;
  localCost: string;
  regionalCost: string;
  nationalCost: string;
  length: string;
  width: string;
  height: string;
  weight: string;
}

interface CalculatedPricing {
  onLocal: number;
  onRegional: number;
  onNational: number;
  userGets: number;
}

const PricingAndShipping: React.FC<PricingAndShippingProps> = ({ productId }) => {
  const navigate = useNavigate();

  // API hooks
  const { data: variantsData, isLoading } = useGetVariantsQuery(productId);
  const updateMutation = useUpdateVariantsPricingMutation(productId);
  const submitMutation = useSubmitProductMutation(productId);

  const variants = variantsData?.data?.variants || [];

  // Form state
  const [formData, setFormData] = useState<VariantFormData[]>([]);
  const [errors, setErrors] = useState<{ [variantIndex: number]: { [field: string]: string } }>({});
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(new Set());
  const [loadingVariants, setLoadingVariants] = useState<Set<string>>(new Set());
  const [calculatedPricing, setCalculatedPricing] = useState<Record<string, CalculatedPricing>>({});
  const [showAllSettlements, setShowAllSettlements] = useState(false);

  // Dialog state
  const [breakdownDialog, setBreakdownDialog] = useState<{
    isOpen: boolean;
    variantId?: string;
  }>({ isOpen: false });

  // Initialize form data from API
  useEffect(() => {
    if (variants.length > 0) {
      const initialFormData = variants.map((variant: any) => ({
        variantId: variant.id,
        mrp: variant.mrp || "",
        sellingPrice: variant.sellingPrice || "",
        aavakCoinsPrice: variant.aavakCoinsPrice ? String(variant.aavakCoinsPrice) : "",
        localCost: variant.deliveryCharges?.local?.cost ? String(variant.deliveryCharges.local.cost) : "",
        regionalCost: variant.deliveryCharges?.regional?.cost ? String(variant.deliveryCharges.regional.cost) : "",
        nationalCost: variant.deliveryCharges?.national?.cost ? String(variant.deliveryCharges.national.cost) : "",
        length: variant.dimensions?.length ? String(variant.dimensions.length) : "",
        width: variant.dimensions?.width ? String(variant.dimensions.width) : "",
        height: variant.dimensions?.height ? String(variant.dimensions.height) : "",
        weight: variant.dimensions?.weight ? String(variant.dimensions.weight) : "",
      }));
      setFormData(initialFormData);

      // Initialize calculated pricing from existing data
      const pricing: Record<string, CalculatedPricing> = {};
      variants.forEach((variant: any) => {
        if (variant.calculatedPricing) {
          pricing[variant.id] = variant.calculatedPricing;
        }
      });
      setCalculatedPricing(pricing);
    }
  }, [variants]);

  const handleInputChange = (index: number, field: string, value: string) => {
    const newData = [...formData];
    newData[index] = { ...newData[index], [field]: value };
    setFormData(newData);

    // Clear field-specific error
    if (errors[index]?.[field]) {
      const newErrors = { ...errors };
      delete newErrors[index][field];
      if (Object.keys(newErrors[index] || {}).length === 0) {
        delete newErrors[index];
      }
      setErrors(newErrors);
    }
  };

  const handleViewSettlementPrice = async (variantId: string, index: number) => {
    const isExpanded = expandedVariants.has(variantId);

    if (isExpanded) {
      // Close the settlement section
      const newExpanded = new Set(expandedVariants);
      newExpanded.delete(variantId);
      setExpandedVariants(newExpanded);
    } else {
      // Open and fetch pricing if not already calculated
      if (!calculatedPricing[variantId]) {
        const data = formData[index];

        // Validate before making API call
        const validation = validateVariantPricingForm(data);
        if (!validation.success) {
          toast.error("Please fill all required fields before viewing settlement price");
          return;
        }

        setLoadingVariants(prev => new Set(prev).add(variantId));

        const payload = {
          variants: [{
            variantId: data.variantId,
            mrp: Math.round(Number(data.mrp)),
            sellingPrice: Math.round(Number(data.sellingPrice)),
            aavakCoinsPrice: Math.round(Number(data.aavakCoinsPrice || 0)),
            localCost: Math.round(Number(data.localCost || 0)),
            regionalCost: Math.round(Number(data.regionalCost || 0)),
            nationalCost: Math.round(Number(data.nationalCost || 0)),
            dimensions: {
              length: Number(data.length),
              width: Number(data.width),
              height: Number(data.height),
              weight: Number(data.weight),
            },
          }]
        };

        updateMutation.mutate(payload, {
          onSuccess: (response: any) => {
            if (response?.data?.variants?.[0]?.calculatedSettlement) {
              const settlement = response.data.variants[0].calculatedSettlement;
              const pricing: CalculatedPricing = {
                onLocal: settlement.vendorPayout,
                onRegional: settlement.vendorPayout - 50, // Slight variation for demo
                onNational: settlement.vendorPayout - 100,
                userGets: Math.round(Number(data.aavakCoinsPrice || 0))
              };
              setCalculatedPricing(prev => ({ ...prev, [variantId]: pricing }));
            }
            setLoadingVariants(prev => {
              const next = new Set(prev);
              next.delete(variantId);
              return next;
            });
            setExpandedVariants(prev => new Set(prev).add(variantId));
          },
          onError: () => {
            setLoadingVariants(prev => {
              const next = new Set(prev);
              next.delete(variantId);
              return next;
            });
            toast.error("Failed to calculate settlement price");
          },
        });
      } else {
        // Already calculated, just toggle
        setExpandedVariants(prev => new Set(prev).add(variantId));
      }
    }
  };

  const handleSaveAndNext = () => {
    // Validate all variants
    const validationErrors: { [variantIndex: number]: { [field: string]: string } } = {};
    let hasErrors = false;

    formData.forEach((data, index) => {
      const validation = validateVariantPricingForm(data);
      if (!validation.success) {
        hasErrors = true;
        validationErrors[index] = {};
        validation.error.issues.forEach((issue) => {
          const fieldName = issue.path[0] as string;
          validationErrors[index][fieldName] = issue.message;
        });
      }
    });

    if (hasErrors) {
      setErrors(validationErrors);
      toast.error("Please fix the validation errors before proceeding");
      return;
    }

    // Transform form data to API payload
    const payload = {
      variants: formData.map((data) => ({
        variantId: data.variantId,
        mrp: Math.round(Number(data.mrp)),
        sellingPrice: Math.round(Number(data.sellingPrice)),
        aavakCoinsPrice: Math.round(Number(data.aavakCoinsPrice || 0)),
        localCost: Math.round(Number(data.localCost || 0)),
        regionalCost: Math.round(Number(data.regionalCost || 0)),
        nationalCost: Math.round(Number(data.nationalCost || 0)),
        dimensions: {
          length: Number(data.length),
          width: Number(data.width),
          height: Number(data.height),
          weight: Number(data.weight),
        },
      })),
    };

    updateMutation.mutate(payload, {
      onSuccess: (response: any) => {
        toast.success("Pricing and shipping details saved successfully");

        // Update calculated pricing for all variants
        if (response?.data?.variants) {
          const pricing: Record<string, CalculatedPricing> = {};
          response.data.variants.forEach((variant: any) => {
            if (variant.calculatedSettlement) {
              pricing[variant.id] = {
                onLocal: variant.calculatedSettlement.vendorPayout,
                onRegional: variant.calculatedSettlement.vendorPayout - 50,
                onNational: variant.calculatedSettlement.vendorPayout - 100,
                userGets: variant.aavakCoinsPrice
              };
            }
          });
          setCalculatedPricing(pricing);
        }

        // Show all settlements
        setShowAllSettlements(true);
        const allVariantIds = new Set(variants.map((v: any) => v.id));
        setExpandedVariants(allVariantIds);
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to save pricing details");
      },
    });
  };

  const handleSubmitForApproval = () => {
    submitMutation.mutate(undefined, {
      onSuccess: () => {
        toast.success("Product is under approval");
        navigate({ to: "/products/active-products" });
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to submit for approval");
      },
    });
  };

  const renderVariantAttributes = (attributes: any) => {
    if (!attributes) return null;

    const attributeElements: React.ReactNode[] = [];

    Object.entries(attributes).forEach(([key, value]: [string, any]) => {
      if (key === "size") {
        attributeElements.push(
          <div
            key={key}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-t-blue/10 text-t-blue rounded-lg border border-t-blue/20"
          >
            <span className="text-xs font-medium">Size:</span>
            <span className="text-sm font-semibold">{value}</span>
          </div>
        );
      } else if (key === "color") {
        attributeElements.push(
          <div
            key={key}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-t-violet/10 text-t-violet rounded-lg border border-t-violet/20"
          >
            <span className="text-xs font-medium">Color:</span>
            <div
              className="w-3 h-3 rounded-full border border-nl-300 dark:border-nd-500 shadow-sm"
              style={{ backgroundColor: value }}
            />
            <span className="text-sm font-semibold">{value}</span>
          </div>
        );
      }
    });

    return <div className="flex items-center gap-2 flex-wrap">{attributeElements}</div>;
  };

  if (isLoading) {
    return <div className="shimmer h-96 w-full rounded-xl" />;
  }

  return (
    <div className="w-full bg-base-1 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-body-content/40">
        <h2 className="text-lg font-semibold text-base-content">Pricing & Shipping Details</h2>
      </div>

      {/* Variants List */}
      <div className="divide-y divide-body-content/80">
        {variants.map((variant: any, index: number) => {
          const data = formData[index] || {};
          const variantErrors = errors[index] || {};
          const pricing = calculatedPricing[variant.id];
          const isExpanded = expandedVariants.has(variant.id);
          const isLoading = loadingVariants.has(variant.id);

          return (
            <div key={variant.id} className="px-6 pt-6">
              {/* LEVEL 1: Variant Header */}
              <div className="mb-6">
                <div className="flex flex-col gap-3 p-4 bg-base-2 rounded-xl">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-body-content uppercase tracking-wide">
                      Product Variant
                    </span>
                    <Button
                      onClick={() => handleViewSettlementPrice(variant.id, index)}
                      variant="outline"
                      size="sm"
                      endIcon={isExpanded ? "EyeOff" : "Eye"}
                      endIconClassname="h-4 w-4"
                      disabled={isLoading}
                    >
                      {isLoading ? "Loading..." : isExpanded ? "Hide Settlement Price" : "View Settlement Price"}
                    </Button>
                  </div>
                  {renderVariantAttributes(variant.attributes)}
                </div>
              </div>

              {/* LEVEL 2: Input Fields (Split into Pricing Details & Shipment Data) */}
              <div className="flex gap-6 mb-6">
                {/* Left Section: Pricing Details (3/4 width) */}
                <div className="w-3/4">
                  <h3 className="text-base font-medium text-base-content mb-4">Pricing Details</h3>
                  <div className="grid grid-cols-3 gap-4">
                    <Input
                      label="MRP"
                      value={data.mrp || ""}
                      onChange={(e) => handleInputChange(index, "mrp", e.target.value)}
                      placeholder="Enter MRP"
                      type="number"
                      required
                      error={variantErrors.mrp}
                    />
                    <Input
                      label="Selling Price"
                      value={data.sellingPrice || ""}
                      onChange={(e) => handleInputChange(index, "sellingPrice", e.target.value)}
                      placeholder="Enter selling price"
                      type="number"
                      required
                      error={variantErrors.sellingPrice}
                    />
                    <Input
                      label="Aavak Coins"
                      value={data.aavakCoinsPrice || ""}
                      onChange={(e) => handleInputChange(index, "aavakCoinsPrice", e.target.value)}
                      placeholder="Enter coins"
                      type="number"
                      error={variantErrors.aavakCoinsPrice}
                    />
                    <Input
                      label="Local Cost"
                      value={data.localCost || ""}
                      onChange={(e) => handleInputChange(index, "localCost", e.target.value)}
                      placeholder="Enter local cost"
                      type="number"
                      error={variantErrors.localCost}
                    />
                    <Input
                      label="Regional Cost"
                      value={data.regionalCost || ""}
                      onChange={(e) => handleInputChange(index, "regionalCost", e.target.value)}
                      placeholder="Enter regional cost"
                      type="number"
                      error={variantErrors.regionalCost}
                    />
                    <Input
                      label="National Cost"
                      value={data.nationalCost || ""}
                      onChange={(e) => handleInputChange(index, "nationalCost", e.target.value)}
                      placeholder="Enter national cost"
                      type="number"
                      error={variantErrors.nationalCost}
                    />
                  </div>
                </div>

                <Separator orientation={"vertical"} className="h-[23dvh] m-0" />

                {/* Right Section: Shipment Data (1/4 width) */}
                <div className="w-1/4">
                  <h3 className="text-base font-medium text-base-content mb-4">Shipment Data</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Length (cm)"
                      value={data.length || ""}
                      onChange={(e) => handleInputChange(index, "length", e.target.value)}
                      placeholder="Length"
                      type="number"
                      required
                      error={variantErrors.length}
                    />
                    <Input
                      label="Width (cm)"
                      value={data.width || ""}
                      onChange={(e) => handleInputChange(index, "width", e.target.value)}
                      placeholder="Width"
                      type="number"
                      required
                      error={variantErrors.width}
                    />
                    <Input
                      label="Height (cm)"
                      value={data.height || ""}
                      onChange={(e) => handleInputChange(index, "height", e.target.value)}
                      placeholder="Height"
                      type="number"
                      required
                      error={variantErrors.height}
                    />
                    <Input
                      label="Weight (kg)"
                      value={data.weight || ""}
                      onChange={(e) => handleInputChange(index, "weight", e.target.value)}
                      placeholder="Weight"
                      type="number"
                      required
                      error={variantErrors.weight}
                    />
                  </div>
                </div>
              </div>

              {/* LEVEL 3: Settlement Prices (Expandable) */}
              {isExpanded && (
                <div className="my-4 p-4 bg-base-2 rounded-xl border border-body-content/20">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="shimmer h-6 w-full rounded-lg" />
                    </div>
                  ) : pricing ? (
                    <>
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-primary">Settlement Price Breakdown</h4>
                        <Button
                          onClick={() => setBreakdownDialog({ isOpen: true, variantId: variant.id })}
                          variant="outline"
                          size="sm"
                        >
                          View Breakdown
                        </Button>
                      </div>
                      <div className="grid grid-cols-4 gap-3">
                        <div className="p-3 bg-base-1 rounded-lg shadow-md text-center">
                          <p className="text-xs text-body-content mb-1 font-medium">Local Delivery</p>
                          <p className="text-base font-bold text-primary w-full flex justify-center">
                            {formatCurrencyINR(Number(pricing.onLocal))}
                          </p>
                        </div>
                        <div className="p-3 bg-base-1 rounded-lg shadow-md text-center">
                          <p className="text-xs text-body-content mb-1 font-medium">Regional Delivery</p>
                          <p className="text-base font-bold text-primary w-full flex justify-center">
                            {formatCurrencyINR(Number(pricing.onRegional))}
                          </p>
                        </div>
                        <div className="p-3 bg-base-1 rounded-lg shadow-md text-center">
                          <p className="text-xs text-body-content mb-1 font-medium">National Delivery</p>
                          <p className="text-base font-bold text-primary w-full flex justify-center">
                            {formatCurrencyINR(Number(pricing.onNational))}
                          </p>
                        </div>
                        <div className="p-3 bg-base-1 rounded-lg shadow-md text-center">
                          <p className="text-xs text-body-content mb-1 font-medium">User Gets (Coins)</p>
                          <p className="text-base font-bold text-primary w-full flex justify-center">{pricing.userGets}</p>
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-6 flex justify-end gap-3">
        <Button
          className="w-44"
          variant="outline"
          onClick={() => navigate({ to: `/products/product-form/${productId}/variations` })}
        >
          Previous
        </Button>
        <Button
          className="w-44"
          onClick={showAllSettlements ? handleSubmitForApproval : handleSaveAndNext}
          isLoading={showAllSettlements ? submitMutation.isPending : updateMutation.isPending}
        >
          {showAllSettlements ? "Submit for Approval" : "Save & Next"}
        </Button>
      </div>

      {/* Breakdown Dialog */}
      <BreakdownDialog
        isOpen={breakdownDialog.isOpen}
        onClose={() => setBreakdownDialog({ isOpen: false })}
        title="Price Breakdown"
      />
    </div>
  );
};

export default PricingAndShipping;
