import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { Ruler, Package, Pencil, Weight, Eye } from "lucide-react";
import { Input } from "@/components/base/Input";
import { Button } from "@/components/base/Button";
import { toast } from "@/components/compound/Sonner";
import CurrencyDisplay from "@/components/compound/CurrencyDisplay";
import { useGetVariantsPricingQuery, useUpdateVariantsPricingMutation } from "./api/queryHooks";
import BreakdownDialog from "./components/BreakdownDialog";
import { useGetVariantsQuery } from "../variations/api/queryHooks";
import { VariantItem } from "../variations/types/variations.types";

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
  quantity: string;
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
  const { data: variantsData, isLoading } = useGetVariantsQuery(productId);
  const updateMutation = useUpdateVariantsPricingMutation(productId);

  // Form state
  const [formData, setFormData] = useState<VariantFormData[]>([]);
  const [settlementPrices, setSettlementPrices] = useState<SettlementPrice[]>([]);
  const [showSettlementSection, setShowSettlementSection] = useState(false);

  // Dialog state
  const [breakdownDialog, setBreakdownDialog] = useState<{
    isOpen: boolean;
    variantId?: string;
    title?: string;
  }>({ isOpen: false });

  // Initialize form data from API
  useEffect(() => {
    if (variantsData?.data?.variants) {
      const initialFormData = variantsData.data?.variants.map((variant: VariantItem) => ({
        variantId: variant.id,
        mrp: "",
        sellingPrice: "",
        aavakCoinsPrice: "",
        localCost: "",
        regionalCost: "",
        nationalCost: "",
        length: "",
        width: "",
        height: "",
        weight: "",
        quantity: "",
      }));
      setFormData(initialFormData);
    }
  }, [variantsData]);

  const handleInputChange = (index: number, field: string, value: string) => {
    const newData = [...formData];
    newData[index] = { ...newData[index], [field]: value };
    setFormData(newData);
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

  const handleViewSettlementPrice = (variantId: string, variantTitle: string) => {
    setBreakdownDialog({
      isOpen: true,
      variantId,
      title: `Price Breakdown - ${variantTitle}`,
    });
  };

  const handleSaveAndNext = () => {
    // Validate required fields
    const hasErrors = formData.some(
      (data) => !data.mrp || !data.sellingPrice || !data.length || !data.width || !data.height || !data.weight
    );

    if (hasErrors) {
      toast.error("Please fill in all required fields");
      return;
    }

    // Transform form data to API payload
    const payload = {
      variants: formData.map((data) => ({
        variantId: data.variantId,
        mrp: Math.round(Number(data.mrp) * 100), // Convert to paise
        sellingPrice: Math.round(Number(data.sellingPrice) * 100),
        aavakCoinsPrice: Math.round(Number(data.aavakCoinsPrice || 0) * 100),
        localCost: Math.round(Number(data.localCost || 0) * 100),
        regionalCost: Math.round(Number(data.regionalCost || 0) * 100),
        nationalCost: Math.round(Number(data.nationalCost || 0) * 100),
        dimensions: {
          length: Number(data.length),
          width: Number(data.width),
          height: Number(data.height),
          weight: Number(data.weight),
        },
        quantity: Number(data.quantity) || 0,
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

  const handleSubmitForApproval = async () => {
    // Dummy API call for now
    try {
      toast.success("Product submitted for approval successfully");
      // Navigate to products list or dashboard
      navigate({ to: "/products/all" });
    } catch (error) {
      toast.error("Failed to submit for approval");
    }
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

  const variants = variantsData?.data?.variants || [];
  console.log("Variants data : ", variantsData);

  return (
    <div className="w-full bg-base-1 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-body-content/40">
        <h2 className="text-lg font-semibold text-base-content">Pricing & Shipping Details</h2>
      </div>

      {/* Variants List */}
      <div className="divide-y divide-body-content/80">
        {variants.map((variant: VariantItem, index: number) => {
          const data = formData[index] || {};
          const title = formatVariantTitle(variant);

          return (
            <div key={variant.id} className="px-6 py-6">
              {/* Variant Header */}
              <div className="mb-6">
                <div className="flex flex-col gap-3 p-4 bg-nl-50 rounded-xl border border-body-content/40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-nl-600 dark:text-nd-300 uppercase tracking-wide">
                      Product Variant
                    </span>
                    <Button
                      onClick={() => handleViewSettlementPrice(variant.id, title)}
                      variant="outline"
                      className="py-1 max-w-1/3"
                      endIcon="Eye"
                      endIconClassname="h-4 w-4 rounded-full"
                      // className="flex items-center gap-2 text-sm text-pl-600 dark:text-pd-400 hover:text-pl-700 dark:hover:text-pd-300 transition-colors"
                    >
                      {/* <Eye className="w-4 h-4" /> */}
                      <span>View Settlement Price</span>
                    </Button>
                  </div>
                  {renderVariantAttributes(variant || {})}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="MRP*"
                  value={data.mrp || ""}
                  onChange={(e) => handleInputChange(index, "mrp", e.target.value)}
                  placeholder="Enter MRP"
                  type="number"
                  required
                />

                <Input
                  label="Selling Price*"
                  value={data.sellingPrice || ""}
                  onChange={(e) => handleInputChange(index, "sellingPrice", e.target.value)}
                  placeholder="Enter selling price"
                  type="number"
                  required
                />

                <Input
                  label="Aavak Coins Price"
                  value={data.aavakCoinsPrice || ""}
                  onChange={(e) => handleInputChange(index, "aavakCoinsPrice", e.target.value)}
                  placeholder="Enter aavak coin price"
                  type="number"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <Input
                  label="Local Cost"
                  value={data.localCost || ""}
                  onChange={(e) => handleInputChange(index, "localCost", e.target.value)}
                  placeholder="Enter local shipping cost"
                  type="number"
                />

                <Input
                  label="Regional Cost"
                  value={data.regionalCost || ""}
                  onChange={(e) => handleInputChange(index, "regionalCost", e.target.value)}
                  placeholder="Enter regional shipping cost"
                  type="number"
                />

                <Input
                  label="National Cost"
                  value={data.nationalCost || ""}
                  onChange={(e) => handleInputChange(index, "nationalCost", e.target.value)}
                  placeholder="Enter national shipping cost"
                  type="number"
                />
              </div>

              <div className="grid grid-cols-5 gap-4 mt-4">
                <Input
                  label="Length (cm)*"
                  value={data.length || ""}
                  onChange={(e) => handleInputChange(index, "length", e.target.value)}
                  placeholder="Enter length"
                  type="number"
                  leftElement={<Ruler className="w-4 h-4 text-nl-400 dark:text-nd-400" />}
                  required
                />

                <Input
                  label="Width (cm)*"
                  value={data.width || ""}
                  onChange={(e) => handleInputChange(index, "width", e.target.value)}
                  placeholder="Enter width"
                  type="number"
                  leftElement={<Package className="w-4 h-4 text-nl-400 dark:text-nd-400" />}
                  required
                />

                <Input
                  label="Height (cm)*"
                  value={data.height || ""}
                  onChange={(e) => handleInputChange(index, "height", e.target.value)}
                  placeholder="Enter height"
                  type="number"
                  leftElement={<Pencil className="w-4 h-4 text-nl-400 dark:text-nd-400" />}
                  required
                />

                <Input
                  label="Weight (kg)*"
                  value={data.weight || ""}
                  onChange={(e) => handleInputChange(index, "weight", e.target.value)}
                  placeholder="Enter weight"
                  type="number"
                  leftElement={<Weight className="w-4 h-4 text-nl-400 dark:text-nd-400" />}
                  required
                />

                <Input
                  label="Quantity"
                  value={data.quantity || ""}
                  onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                  placeholder="Enter quantity"
                  type="number"
                />
              </div>
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
              const title = variant ? formatVariantTitle(variant) : settlement.aavakSku;

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
          onClick={() => navigate({ to: `/products/product-form/${productId}/variations` })}
        >
          Previous
        </Button>
        <Button
          className="w-44"
          onClick={showSettlementSection ? handleSubmitForApproval : handleSaveAndNext}
          isLoading={updateMutation.isPending}
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
