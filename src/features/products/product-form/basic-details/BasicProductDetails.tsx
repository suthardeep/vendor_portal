import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "@/components/toast/Sonner";

// Components
import { Input } from "@/components/base/Input";
import { Textarea } from "@/components/base/Textarea";
import { Dropdown } from "@/components/base/Dropdown";
import { Button } from "@/components/base/Button";
import { MediaPicker } from "@/components/media-picker/MediaPicker";

// Shared API
// import { useProductDetailsQuery } from "../../api/queryHooks"; // Shared hook (GetById)
import { basicDetailsSchema } from "./schemas/basicDetails.schema";
import { MinimalMediaProps } from "@/components/media-picker/types/media.types";
import { useProductDetailsQuery } from "../product-header/api/queryHooks";

interface Props {
  productId: string;
}

interface BasicDetailsState {
  description: string;
  bulletPoints: string[];
  media: MinimalMediaProps[];
  modelNumber: string;
  modelName: string;
  isFragile: boolean;
  manufacturerName: string;
  packerDetails: string;
  importerDetails: string;
  tags: string[];
  hsnCode: string;
  gstTaxSlab: string;
  cessCode: string;
  targetGender: string;
  targetAgeGroup: string;
  totalStockQty: string;
}

export const BasicProductDetails = ({ productId }: Props) => {
  const navigate = useNavigate();

  // 1. Fetch existing data
  const { data: productData, isLoading } = useProductDetailsQuery(productId);

  // 2. Local State
  const [formData, setFormData] = useState<BasicDetailsState>({
    description: "",
    bulletPoints: [],
    media: [],
    modelNumber: "",
    modelName: "",
    isFragile: false,
    manufacturerName: "",
    packerDetails: "",
    importerDetails: "",
    tags: [],
    hsnCode: "",
    gstTaxSlab: "",
    cessCode: "",
    targetGender: "",
    targetAgeGroup: "",
    totalStockQty: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 3. Prefill Form
  useEffect(() => {
    if (productData) {
      setFormData((prev) => ({
        ...prev,
        ...productData, // Spread API data onto state
      }));
    }
  }, [productData]);

  // 4. Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleValueChange = (key: keyof BasicDetailsState, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrors({});

    // Manual Zod Validation
    const result = basicDetailsSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      setIsSubmitting(false);
      toast.error("Please check the form for errors");
      return;
    }

    try {
      // Simulate API Call (Replace with mutation later)
      console.log("Saving payload:", result.data);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Details saved successfully");

      // Navigate to Variations Step
      navigate({ to: `/products/product-form/${productId}/variations` });
    } catch (error) {
      toast.error("Failed to save details");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>Loading product details...</div>;

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      {/* Left Column */}
      <div className="lg:col-span-2 space-y-6">
        {/* General Details Box */}
        <div className="bg-base-1 rounded-xl p-5 shadow-sm space-y-4 border border-base-content/10">
          <Textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            label="Description"
            error={errors.description}
            rows={4}
            required
          />

          <MediaPicker
            ids={formData.media.map((file: MinimalMediaProps) => file.id)}
            urls={formData.media.map((file: MinimalMediaProps) => file.s3Url)}
            value={formData.media}
            onChange={(items) => handleValueChange("media", items)}
            label="Product Images"
            error={errors.media}
            orientation="grid"
            maxFiles={5}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Dropdown
              label="Target Gender"
              options={[
                { label: "Male", value: "Male" },
                { label: "Female", value: "Female" },
                { label: "Unisex", value: "Unisex" },
              ]}
              value={formData.targetGender}
              onChange={(val) => handleValueChange("targetGender", val)}
              placeholder="Select Gender"
              error={errors.targetGender}
            />
            <Input
              name="targetAgeGroup"
              value={formData.targetAgeGroup}
              onChange={handleInputChange}
              label="Target Age Group"
              placeholder="e.g. 18-35"
              error={errors.targetAgeGroup}
            />
          </div>
        </div>

        {/* Manufacturer Info (Optional, but kept for completeness based on schema) */}
        <div className="bg-base-1 rounded-xl p-5 shadow-sm space-y-4 border border-base-content/10">
          <h3 className="font-semibold text-base-content">Manufacturer Details</h3>
          <Input
            name="manufacturerName"
            value={formData.manufacturerName}
            onChange={handleInputChange}
            label="Manufacturer Name"
            fullWidth
          />
        </div>
      </div>

      {/* Right Column */}
      <div className="lg:col-span-1 space-y-6">
        <div className="bg-base-1 rounded-xl p-5 shadow-sm space-y-4 border border-base-content/10">
          <h3 className="font-semibold text-base-content">Inventory & Legal</h3>
          <Input
            name="totalStockQty"
            value={formData.totalStockQty}
            onChange={handleInputChange}
            label="Total Stock Qty"
            type="number"
            error={errors.totalStockQty}
            required
          />
          <Input
            name="hsnCode"
            value={formData.hsnCode}
            onChange={handleInputChange}
            label="HSN Code"
            error={errors.hsnCode}
            required
          />
          <Dropdown
            label="GST Tax Slab"
            options={[
              { label: "5%", value: "5" },
              { label: "12%", value: "12" },
              { label: "18%", value: "18" },
            ]}
            value={formData.gstTaxSlab}
            onChange={(val) => handleValueChange("gstTaxSlab", val)}
            error={errors.gstTaxSlab}
          />
        </div>
      </div>

      {/* Footer Actions */}
      <div className="col-span-full flex justify-end gap-3 pt-4">
        <Button variant="outline" type="button" onClick={() => navigate({ to: ".." })}>
          Previous
        </Button>
        <Button type="submit" isLoading={isSubmitting}>
          Save & Next
        </Button>
      </div>
    </form>
  );
};
