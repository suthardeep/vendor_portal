import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "@/components/compound/Sonner";

import { Dropdown } from "@/components/base/Dropdown";
import { Input } from "@/components/base/Input";
import { Textarea } from "@/components/base/Textarea";
import { MediaPicker } from "@/components/media-picker/MediaPicker";
import { Button } from "@/components/base/Button";

import { useUpdateVariantDetailsMutation } from "../../api/queryHooks";
import { validateVariantDetails } from "../../schemas/variations.schema";
import { genderOptions } from "@/constants/genderOptions";

interface VariantData {
  id: string;
  aavakSku: string;
  sellerSku?: string;
  eanUpc?: string;
  description?: string;
  targetAge?: string;
  targetGender?: string;
  // quantity?: string;
  mediaUrls?: any[];
  attributes: {
    size?: string;
    color?: string;
    [key: string]: any;
  };
}

interface VariationStep2Props {
  productId: string;
  variants: any[];
  onBack: () => void;
}

const VariationStep2: React.FC<VariationStep2Props> = ({ productId, variants = [], onBack }) => {
  const navigate = useNavigate();
  const mutation = useUpdateVariantDetailsMutation(productId);
  const STORAGE_KEY = `variant_form_${productId}`;

  // const [formData, setFormData] = useState<VariantData[]>([]);
  const [formData, setFormData] = useState<VariantData[]>(() => {
    const saved = sessionStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  const [errors, setErrors] = useState<{ [variantIndex: number]: { [field: string]: string } }>({});

  // 3. Effect to initialize from props only if storage is empty
  // useEffect(() => {
  //   const saved = sessionStorage.getItem(STORAGE_KEY);
  //   if (!saved && variants.length > 0) {
  //     const initialData = variants.map((variant) => ({
  //       id: variant.id,
  //       aavakSku: variant.aavakSku || "",
  //       sellerSku: variant.sellerSku || "",
  //       eanUpc: variant.eanUpc || "",
  //       description: variant.description || "",
  //       targetAge: variant.targetAge || "",
  //       targetGender: variant.targetGender || "",
  //       quantity: String(variant.quantity || ""),
  //       mediaUrls: variant.mediaUrls || [],
  //       attributes: variant.attributes || {},
  //     }));
  //     setFormData(initialData);
  //   }
  // }, [variants, productId]);

  // 4. Effect to persist data to Session Storage whenever it changes
  // useEffect(() => {
  //   if (formData.length > 0) {
  //     sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  //   }
  // }, [formData, productId]);

  useEffect(() => {
    if (variants.length > 0) {
      setFormData(
        variants.map((variant) => ({
          id: variant.id,
          aavakSku: variant.aavakSku || "",
          sellerSku: variant.sellerSku || "",
          eanUpc: variant.eanUpc || "",
          description: variant.description || "",
          targetAge: variant.targetAge || "",
          targetGender: variant.targetGender || "",
          quantity: String(variant.quantity || ""),
          mediaUrls: variant.mediaUrls || [],
          attributes: variant.attributes || {},
        }))
      );
    }
  }, [variants]);

  const handleInputChange = (index: number, field: string, value: any) => {
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

  const handleMediaChange = (index: number, items: any[]) => {
    console.log("Items:", items)
    const newData = [...formData];
    newData[index] = {
      ...newData[index],
      mediaUrls: items.map((item) => item.s3Url),
    };
    setFormData(newData);
  };

  const handleSaveAndNext = () => {
    // Validate all variants
    const validationErrors: { [variantIndex: number]: { [field: string]: string } } = {};
    let hasErrors = false;

    formData.forEach((data, index) => {
      const validation = validateVariantDetails(data);
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

    // Transform to new API payload format
    try {
      const apiPayload = {
        variants: formData.map((data) => ({
          variantId: data.id,
          sellerSku: data.sellerSku || "",
          targetAge: data.targetAge || "",
          targetGender: data.targetGender || undefined,
          eanUpc: data.eanUpc || undefined,
          description: data.description || "",
          mediaUrls: data.mediaUrls || [],
        })),
      };

      mutation.mutate(apiPayload, {
        onSuccess: () => {
          toast.success("Variant details saved successfully");
          sessionStorage.removeItem(STORAGE_KEY); // Clean up
          navigate({
            to: `/products/product-form/${productId}/pricing-and-shipping`,
          });
        },
        onError: (error) => {
          toast.error(error.message || "Failed to save variant details");
        },
      });
    } catch (error) {
      toast.error("Error processing form data");
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

  return (
    <div className="w-full bg-base-1 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-body-content/40">
        <h2 className="text-lg font-semibold text-base-content">Variant Details</h2>
      </div>

      {/* Variants List */}
      <div className="divide-y divide-body-content/80">
        {formData.map((data, index) => {
          const originalVariant = variants[index] || {};
          const variantErrors = errors[index] || {};

          return (
            <div key={index} className="px-6 py-6">
              {/* Variant Header */}
              <div className="mb-6">
                <div className="flex flex-col gap-3 p-4 bg-nl-50  rounded-xl  bg-base-2">
                  <span className="text-xs font-semibold text-nl-600 dark:text-nd-300 uppercase tracking-wide">
                    Product Variant
                  </span>
                  {renderVariantAttributes(originalVariant?.attributes || {})}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-3 gap-4">
                <Input
                  label="Aavak SKU"
                  value={data.aavakSku}
                  onChange={(e) => handleInputChange(index, "aavakSku", e.target.value)}
                  placeholder="Enter SKU"
                  required
                  disabled
                  error={variantErrors.aavakSku}
                />
                <Input
                  label="Seller SKU"
                  value={data.sellerSku}
                  onChange={(e) => handleInputChange(index, "sellerSku", e.target.value)}
                  placeholder="Enter SKU"
                  required
                  error={variantErrors.sellerSku}
                />
                <Input
                  label="EAN/UPC"
                  value={data.eanUpc}
                  onChange={(e) => handleInputChange(index, "eanUpc", e.target.value)}
                  placeholder="Enter EAN/UPC"
                  error={variantErrors.eanUpc}
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                <Textarea
                  label="Description"
                  value={data.description}
                  onChange={(e) => handleInputChange(index, "description", e.target.value)}
                  placeholder="Product description"
                  rows={5}
                  error={variantErrors.description}
                />
                <MediaPicker
                  label="Upload Videos/Images"
                  // value={data.mediaIds}
                  ids={data.mediaUrls}
                  urls={data.mediaUrls}
                  onChange={(items) => handleMediaChange(index, items)}
                  maxFiles={5}
                  required
                  itemClassName="max-h-[15dvh] w-full"
                  containerClassName={
                    data?.mediaUrls?.length ? "p-2 border border-base-content/20 rounded-2xl" : ""
                  }
                  orientation="grid"
                  error={variantErrors.mediaUrls}
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                <Input
                  label="Target by Age"
                  value={data.targetAge}
                  onChange={(e) => handleInputChange(index, "targetAge", e.target.value)}
                  placeholder="Enter age"
                  error={variantErrors.targetAge}
                />
                <Dropdown
                  label="Target by Gender"
                  placeholder="Select gender"
                  options={genderOptions}
                  value={data.targetGender}
                  onChange={(value) => handleInputChange(index, "targetGender", value)}
                  error={variantErrors.targetGender}
                />
                {/* <Input
                  label="Quantity"
                  value={data.quantity}
                  onChange={(e) => handleInputChange(index, "quantity", e.target.value)}
                  placeholder="0"
                  required
                  type="number"
                  error={variantErrors.quantity}
                /> */}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-6 flex justify-end gap-3">
        <Button className="w-44" variant="outline" onClick={onBack}>
          Previous
        </Button>
        <Button className="w-44" onClick={handleSaveAndNext} isLoading={mutation.isPending}>
          Save & Next
        </Button>
      </div>
    </div>
  );
};

export default VariationStep2;
