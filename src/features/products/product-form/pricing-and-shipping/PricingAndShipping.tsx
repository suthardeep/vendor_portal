import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Ruler, Package, Pencil, Weight, Eye } from "lucide-react";
import { Input } from "@/components/base/Input";
import { Button } from "@/components/base/Button";
import { toast } from "@/components/compound/Sonner";
import CurrencyDisplay from "@/components/compound/CurrencyDisplay";
import {
  useGetVariantsPricingQuery,
  useUpdateVariantsPricingMutation,
  useSubmitProductMutation,
} from "./api/queryHooks";
import BreakdownDialog from "./components/BreakdownDialog";
import { useGetVariantsQuery } from "../variations/api/queryHooks";
import { useProductDetailsQuery } from "../product-header/api/queryHooks";
import { VariantItem } from "../variations/types/variations.types";
import { validateVariantPricingForm } from "./schemas/pricing.schema";

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

interface SettlementPrice {
  id: string;
  aavakSku: string;
  sellerSku: string;
  attributes: any;
  mrp: number;
  sellingPrice: number;
  aavakCoinsPrice: number;
  deliveryCharges: {
    local: { unitDelivered: number; cost: number };
    regional: { unitDelivered: number; cost: number };
    national: { unitDelivered: number; cost: number };
  };
  dimensions: {
    length: number;
    width: number;
    height: number;
    weight: number;
  };
  calculatedSettlement: {
    platformFee: number;
    closingFee: number;
    referralFee: number;
    vendorPayout: number;
  };
}

const PricingAndShipping: React.FC<PricingAndShippingProps> = ({ productId }) => {
  const navigate = useNavigate();

  // API hooks
  const { data: productDetails, isLoading: isLoadingDetails } = useProductDetailsQuery(productId);
  const { data: variantsData, isLoading: isLoadingVariants } = useGetVariantsQuery(productId);
  const updateMutation = useUpdateVariantsPricingMutation(productId);
  const submitMutation = useSubmitProductMutation(productId);

  const hasVariants = productDetails?.hasVariants ?? false;

  // Prefer product details variants over API variants
  const variants = productDetails?.variants || variantsData?.data?.variants || [];
  const isLoading = isLoadingDetails || isLoadingVariants;

  // Form state
  const [formData, setFormData] = useState<VariantFormData[]>([]);
  const [settlementPrices, setSettlementPrices] = useState<SettlementPrice[]>([]);
  const [showSettlementSection, setShowSettlementSection] = useState(false);
  const [errors, setErrors] = useState<{ [variantIndex: number]: { [field: string]: string } }>({});

  // Track which variants have settlement prices visible
  const [expandedVariants, setExpandedVariants] = useState<Set<string>>(new Set());

  // Dialog state
  const [breakdownDialog, setBreakdownDialog] = useState<{
    isOpen: boolean;
    variantId?: string;
    title?: string;
  }>({ isOpen: false });

  // Initialize form data from API - prefill with existing data if available
  useEffect(() => {
    if (variants.length > 0) {
      const initialFormData = variants.map((variant: any) => ({
        variantId: variant.id,
        // Prefill pricing data if available (convert from paise to rupees if numeric)
        mrp: variant.mrp ? (typeof variant.mrp === "number" ? String(variant.mrp / 100) : variant.mrp) : "",
        sellingPrice: variant.sellingPrice
          ? typeof variant.sellingPrice === "number"
            ? String(variant.sellingPrice)
            : variant.sellingPrice
          : "",
        aavakCoinsPrice: variant.aavakCoinsPrice
          ? typeof variant.aavakCoinsPrice === "number"
            ? String(variant.aavakCoinsPrice)
            : String(variant.aavakCoinsPrice)
          : "",
        // Prefill delivery charges if available (convert from paise to rupees)
        localCost: variant.deliveryCharges?.local?.cost ? String(variant.deliveryCharges.local.cost) : "",
        regionalCost: variant.deliveryCharges?.regional?.cost
          ? String(variant.deliveryCharges.regional.cost)
          : "",
        nationalCost: variant.deliveryCharges?.national?.cost
          ? String(variant.deliveryCharges.national.cost)
          : "",
        // Prefill dimensions if available
        length: variant.dimensions?.length ? String(variant.dimensions.length) : "",
        width: variant.dimensions?.width ? String(variant.dimensions.width) : "",
        height: variant.dimensions?.height ? String(variant.dimensions.height) : "",
        weight: variant.dimensions?.weight ? String(variant.dimensions.weight) : "",
      }));
      setFormData(initialFormData);
    }
  }, [variants]);

  const handleInputChange = (index: number, field: string, value: string) => {
    const newData = [...formData];
    newData[index] = { ...newData[index], [field]: value };
    setFormData(newData);

    // Clear field-specific error when user starts typing
    if (errors[index] && errors[index][field]) {
      const newErrors = { ...errors };
      delete newErrors[index][field];
      if (Object.keys(newErrors[index] || {}).length === 0) {
        delete newErrors[index];
      }
      setErrors(newErrors);
    }
  };

  const formatVariantTitle = (variant: VariantItem) => {
    const parts: string[] = [];
    const attributes = variant.attributes || {};

    Object.keys(attributes).forEach((key) => {
      const value = attributes[key];
      const displayValue = typeof value === "object" && value.name ? value.name : String(value);
      parts.push(displayValue);
    });

    return parts.join(" / ");
  };

  const handleViewSettlementPrice = (variantId: string) => {
    // Toggle the expanded state for this variant
    const newExpanded = new Set(expandedVariants);
    if (newExpanded.has(variantId)) {
      newExpanded.delete(variantId);
    } else {
      newExpanded.add(variantId);
    }
    setExpandedVariants(newExpanded);
  };

  const handleSaveAndNext = () => {
    // Validate all variants using Zod
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
        mrp: Math.round(Number(data.mrp)), // Convert to paise
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

        // Show settlement prices section
        if (response?.data?.variants) {
          setSettlementPrices(response.data.variants);
          setShowSettlementSection(true);
        }
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to save pricing details");
      },
    });
  };

  const handleSubmitForApproval = () => {
    submitMutation.mutate(undefined, {
      onSuccess: (response: any) => {
        console.log("Submit response:", response);
        toast.success("Product is under approval");
        navigate({ to: "/products/active-products" });
      },
      onError: (error: any) => {
        toast.error(error.message || "Failed to submit for approval");
      },
    });
  };

  const renderVariantAttributes = (variant: any) => {
    const attributes: React.ReactNode[] = [];

    // Handle size with label
    if (variant.size) {
      const sizeValue = typeof variant.size === "object" ? variant.size.name : variant.size;
      attributes.push(
        <div
          key="size"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-t-blue/10 text-t-blue rounded-lg border border-t-blue/20"
        >
          <span className="text-xs font-medium">Size:</span>
          <span className="text-sm font-semibold">{sizeValue}</span>
        </div>
      );
    }

    // Handle color with color dot and label
    if (variant.color) {
      const colorValue =
        typeof variant.color === "object" ? variant.color : { name: variant.color, value: variant.color };
      attributes.push(
        <div
          key="color"
          className="flex items-center gap-1.5 px-3 py-1.5 bg-t-violet/10 text-t-violet rounded-lg border border-t-violet/20"
        >
          <span className="text-xs font-medium">Color:</span>
          <div
            className="w-3 h-3 rounded-full border border-nl-300 dark:border-nd-500 shadow-sm"
            style={{ backgroundColor: colorValue.value || colorValue.name }}
          />
          <span className="text-sm font-semibold">{colorValue.name}</span>
        </div>
      );
    }

    // Handle other attributes with labels
    Object.keys(variant).forEach((key, keyIndex) => {
      if (key !== "size" && key !== "color" && key !== "id" && key !== "aavakSku" && key !== "pricing") {
        const value = variant[key];
        if (value) {
          const displayValue = typeof value === "object" && value.name ? value.name : String(value);
          if (displayValue.trim() !== "") {
            const capitalizedKey = key.charAt(0).toUpperCase() + key.slice(1);
            attributes.push(
              <div
                key={`${key}-${keyIndex}`}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-t-gray/10 text-t-gray rounded-lg border border-t-gray/20"
              >
                <span className="text-xs font-medium">{capitalizedKey}:</span>
                <span className="text-sm font-semibold">{displayValue}</span>
              </div>
            );
          }
        }
      }
    });

    // If no attributes, show default
    if (attributes.length === 0) {
      return (
        <div className="px-3 py-1.5 bg-nl-100 dark:bg-nd-700 text-nl-600 dark:text-nd-300 rounded-lg border border-nl-200 dark:border-nd-600">
          <span className="text-sm">No attributes defined</span>
        </div>
      );
    }

    return <div className="flex items-center gap-2 flex-wrap">{attributes}</div>;
  };

  if (isLoading) {
    return <div className="shimmer h-96 w-full rounded-xl" />;
  }

  console.log("Variants data : ", variants);

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
          const title = formatVariantTitle(variant);
          const variantErrors = errors[index] || {};
          const calculatedPricing =
            variant.calculatedPricing ??
            variantsData?.data?.variants?.find((v) => v.id === variant.id)?.calculatedPricing;

          return (
            <div key={variant.id} className="px-6 py-6">
              {/* Variant Header */}
              <div className="mb-6">
                <div className="flex flex-col gap-3 p-4 bg-nl-50 rounded-xl bg-base-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-nl-600 dark:text-nd-300 uppercase tracking-wide">
                      Product Variant
                    </span>
                    <Button
                      onClick={() => handleViewSettlementPrice(variant.id)}
                      variant="outline"
                      className="py-1 max-w-1/3"
                      endIcon={expandedVariants.has(variant.id) ? "EyeOff" : "Eye"}
                      endIconClassname="h-4 w-4 rounded-full"
                    >
                      <span>
                        {expandedVariants.has(variant.id) ? "Hide Settlement Price" : "View Settlement Price"}
                      </span>
                    </Button>
                  </div>
                  {renderVariantAttributes(variant?.attributes || {})}
                </div>
              </div>

              {/* Form Fields */}
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
                  label="Aavak Coins Price"
                  value={data.aavakCoinsPrice || ""}
                  onChange={(e) => handleInputChange(index, "aavakCoinsPrice", e.target.value)}
                  placeholder="Enter aavak coin price"
                  type="number"
                  error={variantErrors.aavakCoinsPrice}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <Input
                  label="Local Cost"
                  value={data.localCost || ""}
                  onChange={(e) => handleInputChange(index, "localCost", e.target.value)}
                  placeholder="Enter local shipping cost"
                  type="number"
                  error={variantErrors.localCost}
                />

                <Input
                  label="Regional Cost"
                  value={data.regionalCost || ""}
                  onChange={(e) => handleInputChange(index, "regionalCost", e.target.value)}
                  placeholder="Enter regional shipping cost"
                  type="number"
                  error={variantErrors.regionalCost}
                />

                <Input
                  label="National Cost"
                  value={data.nationalCost || ""}
                  onChange={(e) => handleInputChange(index, "nationalCost", e.target.value)}
                  placeholder="Enter national shipping cost"
                  type="number"
                  error={variantErrors.nationalCost}
                />
              </div>

              <div className="grid grid-cols-4 gap-4 mt-4">
                <Input
                  label="Length (cm)"
                  value={data.length || ""}
                  onChange={(e) => handleInputChange(index, "length", e.target.value)}
                  placeholder="Enter length"
                  type="number"
                  leftElement={<Ruler className="w-4 h-4 text-nl-400 dark:text-nd-400" />}
                  required
                  error={variantErrors.length}
                />

                <Input
                  label="Width (cm)"
                  value={data.width || ""}
                  onChange={(e) => handleInputChange(index, "width", e.target.value)}
                  placeholder="Enter width"
                  type="number"
                  leftElement={<Package className="w-4 h-4 text-nl-400 dark:text-nd-400" />}
                  required
                  error={variantErrors.width}
                />

                <Input
                  label="Height (cm)"
                  value={data.height || ""}
                  onChange={(e) => handleInputChange(index, "height", e.target.value)}
                  placeholder="Enter height"
                  type="number"
                  leftElement={<Pencil className="w-4 h-4 text-nl-400 dark:text-nd-400" />}
                  required
                  error={variantErrors.height}
                />

                <Input
                  label="Weight (kg)"
                  value={data.weight || ""}
                  onChange={(e) => handleInputChange(index, "weight", e.target.value)}
                  placeholder="Enter weight"
                  type="number"
                  leftElement={<Weight className="w-4 h-4 text-nl-400 dark:text-nd-400" />}
                  required
                  error={variantErrors.weight}
                />

              </div>

              {/* Settlement Prices Section - Expanded below this variant */}
              {expandedVariants.has(variant.id) && calculatedPricing && (
                <div className="mt-6 p-5 bg-t-green/5 dark:bg-t-green/10 rounded-xl border border-t-green/20">
                  <h4 className="text-sm font-semibold text-nl-800 dark:text-nd-100 mb-4 flex items-center gap-2">
                    Settlement Price Breakdown
                  </h4>
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 bg-nl-50 dark:bg-nd-800 rounded-lg border border-nl-200 dark:border-nd-600">
                      <p className="text-xs text-nl-600 dark:text-nd-400 mb-1 font-medium">Local Delivery</p>
                      <p className="text-lg font-bold text-nl-800 dark:text-nd-100">
                        <CurrencyDisplay amount={calculatedPricing.onLocal / 100} />
                      </p>
                    </div>
                    <div className="p-4 bg-nl-50 dark:bg-nd-800 rounded-lg border border-nl-200 dark:border-nd-600">
                      <p className="text-xs text-nl-600 dark:text-nd-400 mb-1 font-medium">
                        Regional Delivery
                      </p>
                      <p className="text-lg font-bold text-nl-800 dark:text-nd-100">
                        <CurrencyDisplay amount={calculatedPricing.onRegional / 100} />
                      </p>
                    </div>
                    <div className="p-4 bg-nl-50 dark:bg-nd-800 rounded-lg border border-nl-200 dark:border-nd-600">
                      <p className="text-xs text-nl-600 dark:text-nd-400 mb-1 font-medium">
                        National Delivery
                      </p>
                      <p className="text-lg font-bold text-nl-800 dark:text-nd-100">
                        <CurrencyDisplay amount={calculatedPricing.onNational / 100} />
                      </p>
                    </div>
                    <div className="p-4 bg-t-green/10 dark:bg-t-green/20 rounded-lg border border-t-green/30">
                      <p className="text-xs text-t-green mb-1 font-bold">User Gets (Coins)</p>
                      <p className="text-lg font-bold text-t-green">{calculatedPricing.userGets}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Settlement Prices Section */}
      {showSettlementSection && settlementPrices.length > 0 && (
        <div className="px-6 py-6 border-t border-body-content/40">
          <h3 className="text-base font-semibold text-base-content mb-4">Settlement Prices</h3>
          <div className="space-y-4">
            {settlementPrices.map((settlement) => {
              const variant = variants.find((v) => v.id === settlement.id);
              const title = variant ? formatVariantTitle(variant?.attributes || {}) : settlement.aavakSku;

              return (
                <div
                  key={settlement.id}
                  className="p-5 bg-nl-50 dark:bg-nd-800 rounded-xl border border-nl-200 dark:border-nd-600"
                >
                  {/* Variant Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <h4 className="text-sm font-semibold text-nl-800 dark:text-nd-100">{title}</h4>
                      <span className="text-xs font-medium text-nl-600 dark:text-nd-300 bg-nl-100 dark:bg-nd-700 px-2 py-1 rounded-lg">
                        {settlement.aavakSku}
                      </span>
                    </div>
                  </div>

                  {/* Settlement Details Grid */}
                  <div className="grid grid-cols-4 gap-4">
                    <div className="p-4 bg-nl-100 dark:bg-nd-700 rounded-lg">
                      <p className="text-xs text-nl-600 dark:text-nd-300 mb-1">Platform Fee</p>
                      <p className="text-base font-semibold text-nl-800 dark:text-nd-100">
                        <CurrencyDisplay amount={settlement.calculatedSettlement.platformFee / 100} />
                      </p>
                    </div>
                    <div className="p-4 bg-nl-100 dark:bg-nd-700 rounded-lg">
                      <p className="text-xs text-nl-600 dark:text-nd-300 mb-1">Closing Fee</p>
                      <p className="text-base font-semibold text-nl-800 dark:text-nd-100">
                        <CurrencyDisplay amount={settlement.calculatedSettlement.closingFee / 100} />
                      </p>
                    </div>
                    <div className="p-4 bg-nl-100 dark:bg-nd-700 rounded-lg">
                      <p className="text-xs text-nl-600 dark:text-nd-300 mb-1">Referral Fee</p>
                      <p className="text-base font-semibold text-nl-800 dark:text-nd-100">
                        <CurrencyDisplay amount={settlement.calculatedSettlement.referralFee / 100} />
                      </p>
                    </div>
                    <div className="p-4 bg-t-green/10 dark:bg-t-green/20 rounded-lg border border-t-green/30">
                      <p className="text-xs text-t-green mb-1 font-medium">Vendor Payout</p>
                      <p className="text-base font-bold text-t-green">
                        <CurrencyDisplay amount={settlement.calculatedSettlement.vendorPayout / 100} />
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Footer Actions */}
      <div className="p-6 flex justify-end gap-3">
        <Button
          className="w-44"
          variant="outline"
          onClick={() => {
            if (hasVariants) {
              navigate({ to: `/products/product-form/${productId}/variations` });
            } else {
              navigate({ to: `/products/product-form/${productId}/basic-details` });
            }
          }}
        >
          Previous
        </Button>
        <Button
          className="w-44"
          onClick={showSettlementSection ? handleSubmitForApproval : handleSaveAndNext}
          isLoading={showSettlementSection ? submitMutation.isPending : updateMutation.isPending}
        >
          {showSettlementSection ? "Submit for Approval" : "Save & Next"}
        </Button>
      </div>

      {/* Breakdown Dialog */}
      <BreakdownDialog
        isOpen={breakdownDialog.isOpen}
        onClose={() => setBreakdownDialog({ isOpen: false })}
        title={breakdownDialog.title || "Price Breakdown"}
        variantId={breakdownDialog.variantId}
        productId={productId}
      />
    </div>
  );
};

export default PricingAndShipping;
