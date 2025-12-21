import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "@/components/toast/Sonner";

import { Dropdown } from "@/components/base/Dropdown";
import { Input } from "@/components/base/Input";
import { Textarea } from "@/components/base/Textarea";
import { MediaPicker } from "@/components/media-picker/MediaPicker";
import { Button } from "@/components/base/Button"; // Added Button import

import { useUpdateVariationsMutation } from "../../api/queryHooks"; // Added Hook import
import { CombinationItem } from "../../types/variations.types"; // Added Type import

interface CombinationData {
  aavakSku: string;
  sellerSku?: string;
  eanUpc?: string;
  description?: string;
  targetAge?: string;
  targetGender?: string;
  unitQuantity?: string;
  mediaIds?: any[];
  mediaUrls?: any[];
  [key: string]: any;
}

interface VariationStep2Props {
  productId: string; // NEW: Needed for API
  combinations: CombinationItem[];
  onBack: () => void; // NEW: Needed for navigation
}

const VariationStep2: React.FC<VariationStep2Props> = ({
  productId,
  combinations = [], // Default to empty array if undefined
  onBack,
}) => {
  const navigate = useNavigate();
  const mutation = useUpdateVariationsMutation();

  // Initialize state based on the passed combinations
  const [formData, setFormData] = useState<CombinationData[]>([]);

  useEffect(() => {
    if (combinations.length > 0) {
      setFormData(
        combinations.map((combo, idx) => ({
          ...combo, // Preserve original variation keys (size, color, etc.)
          // Initialize fields if they don't exist
          aavakSku: combo.aavakSku || `SKU-${idx + 1}`, // Simple default or empty
          sellerSku: combo.sellerSku || "",
          eanUpc: combo.eanUpc || "",
          description: combo.description || "",
          targetAge: combo.targetAge || "",
          targetGender: combo.targetGender || "",
          unitQuantity: String(combo.unitQuantity || ""),
          mediaIds: combo.mediaIds || [],
          mediaUrls: combo.mediaUrls || [],
        }))
      );
    }
  }, [combinations]);

  const genderOptions = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
    { value: "unisex", label: "Unisex" },
    { value: "other", label: "Other" },
  ];

  const handleInputChange = (index: number, field: string, value: any) => {
    const newData = [...formData];
    newData[index] = { ...newData[index], [field]: value };
    setFormData(newData);
  };

  const handleMediaChange = (index: number, items: any[]) => {
    const newData = [...formData];
    newData[index] = {
      ...newData[index],
      mediaIds: items,
      mediaUrls: items,
    };
    setFormData(newData);
  };

  // --- New Save Handler ---
  const handleSaveAndNext = () => {
    mutation.mutate(
      { productId, variations: formData },
      {
        onSuccess: () => {
          toast.success("Variations saved successfully");
          // Navigate to Pricing & Shipping
          navigate({
            to: `/products/product-form/${productId}/pricing-shipping`,
          });
        },
        onError: () => {
          toast.error("Failed to save variations");
        },
      }
    );
  };

  // --- UI Helper Functions ---

  const getColorDotClass = (color: string) => {
    // Handle cases where color might be undefined or an object
    if (!color || typeof color !== "string") return "bg-gray-400";

    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      red: "bg-red-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      pink: "bg-pink-500",
      orange: "bg-orange-500",
      black: "bg-black",
      white: "bg-white border border-gray-300",
    };

    const normalizedColor = color.toLowerCase().replace("custom ", "");
    return colorMap[normalizedColor] || "bg-gray-400";
  };

  const formatCombinationTitle = (combo: any) => {
    const parts: string[] = [];
    const keys = Object.keys(combo).filter(
      (k) =>
        ![
          "aavakSku",
          "sellerSku",
          "eanUpc",
          "description",
          "targetAge",
          "targetGender",
          "unitQuantity",
          "mediaIds",
          "mediaUrls",
          "id", // Exclude ID
          "_id", // Exclude ID
        ].includes(k)
    );

    for (const key of keys) {
      const value = combo[key];
      // Handle potential object values (like {name: 'Red', value: '#F00'})
      const displayValue =
        typeof value === "object" && value.name ? value.name : String(value);

      if (key === "size") {
        parts.push(displayValue.replace("Custom size ", ""));
      } else {
        parts.push(displayValue.replace("Custom ", ""));
      }
    }

    return parts.join(" / ");
  };

  return (
    <div className="w-full bg-base-1 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">
          Combination details
        </h2>
      </div>

      {/* Combinations List */}
      <div className="divide-y divide-gray-200">
        {formData.map((data, index) => {
          // Use original combination data for title generation
          const originalCombo = combinations[index] || {};
          const title = formatCombinationTitle(originalCombo);

          // Safe access for color/size display in header
          const colorVal =
            originalCombo.color || originalCombo.colour || originalCombo.Color;
          const sizeVal = originalCombo.size || originalCombo.Size;
          const displayColor =
            typeof colorVal === "object" ? colorVal.name : colorVal;
          const displaySize =
            typeof sizeVal === "object" ? sizeVal.name : sizeVal;

          return (
            <div key={index} className="px-6 py-6">
              {/* Combination Header */}
              <div className="flex items-center gap-3 mb-4">
                <h3 className="text-base font-semibold text-gray-900">
                  {title}
                </h3>

                <div className="flex items-center gap-2">
                  {originalCombo.unit && (
                    <span className="text-sm text-gray-600">
                      {originalCombo.unit}
                    </span>
                  )}

                  {displayColor && (
                    <>
                      <div
                        className={`w-4 h-4 rounded-full ${getColorDotClass(String(displayColor))}`}
                      />
                      <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                        {String(displayColor).replace("Custom ", "")}
                      </span>
                    </>
                  )}

                  {displaySize && (
                    <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                      {String(displaySize).replace("Custom size ", "")}
                    </span>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-3 gap-4">
                {/* Row 1 */}
                <Input
                  label="Aavak SKU"
                  value={data.aavakSku}
                  onChange={(e) =>
                    handleInputChange(index, "aavakSku", e.target.value)
                  }
                  placeholder="Enter SKU"
                />
                <Input
                  label="Seller SKU (Optional)"
                  value={data.sellerSku}
                  onChange={(e) =>
                    handleInputChange(index, "sellerSku", e.target.value)
                  }
                  placeholder="Enter SKU"
                />
                <Input
                  label="EAN/UPC (Optional)"
                  value={data.eanUpc}
                  onChange={(e) =>
                    handleInputChange(index, "eanUpc", e.target.value)
                  }
                  placeholder="Enter EAN/UPC"
                />
              </div>

              <div className="grid grid-cols-2 gap-4 mt-4">
                {/* Row 2 */}
                <Textarea
                  label="Description"
                  value={data.description}
                  onChange={(e) =>
                    handleInputChange(index, "description", e.target.value)
                  }
                  placeholder="Product description"
                  rows={5}
                />
                <MediaPicker
                  label="Upload Videos/Images"
                  value={data.mediaIds}
                  ids={data.mediaIds}
                  urls={data.mediaUrls}
                  onChange={(items) => handleMediaChange(index, items)}
                  maxFiles={5}
                  itemClassName="max-h-[15dvh] w-full"
                  containerClassName={
                    data?.mediaUrls?.length
                      ? "p-2 border border-body-content/20 rounded-2xl"
                      : ""
                  }
                  iconConfig={{ size: "xs" }}
                  orientation="grid"
                />
              </div>

              <div className="grid grid-cols-3 gap-4 mt-4">
                {/* Row 3 */}
                <Input
                  label="Target by Age"
                  value={data.targetAge}
                  onChange={(e) =>
                    handleInputChange(index, "targetAge", e.target.value)
                  }
                  placeholder="Enter age"
                />
                <Dropdown
                  label="Target bt Gender"
                  placeholder="Select gender"
                  options={genderOptions}
                  value={data.targetGender}
                  onChange={(value) =>
                    handleInputChange(index, "targetGender", value)
                  }
                />
                <Input
                  label="Unit Quantity"
                  value={data.unitQuantity}
                  onChange={(e) =>
                    handleInputChange(index, "unitQuantity", e.target.value)
                  }
                  placeholder="23"
                  type="number"
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer Actions */}
      <div className="p-6 flex justify-end gap-3 border-t border-gray-200">
        <Button variant="outline" onClick={onBack}>
          Back to Generator
        </Button>
        <Button onClick={handleSaveAndNext} isLoading={mutation.isPending}>
          Save & Next
        </Button>
      </div>
    </div>
  );
};

export default VariationStep2;
