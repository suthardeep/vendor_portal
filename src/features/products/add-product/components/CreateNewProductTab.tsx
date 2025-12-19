import React, { useState } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "@/components/toast/Sonner";

import { Input } from "@/components/base/Input";
import { Dropdown } from "@/components/base/Dropdown";
import { Switch } from "@/components/base/Switch";
import { Button } from "@/components/base/Button";

import { createProductSchema } from "../schemas/addProduct.schema";
import { useCategoriesQuery, useCreateProductMutation, useBrandsQuery } from "../api/queryHooks";
import { BrandData } from "../types/addProduct.types";

// Define local state interface matching the form fields
interface CreateProductState {
  productName: string;
  mainCategoryId: string;
  subCategoryId: string;
  childCategoryId: string;
  externalSku: string;
  hasVariants: boolean;
  hasBrandName: boolean;
  brandId: string;
}

export const CreateNewProductTab = () => {
  const navigate = useNavigate();
  const mutation = useCreateProductMutation();

  // 1. Local State Management
  const [formData, setFormData] = useState<CreateProductState>({
    productName: "",
    mainCategoryId: "",
    subCategoryId: "",
    childCategoryId: "",
    externalSku: "",
    hasVariants: false,
    hasBrandName: false,
    brandId: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // 2. Queries (Dependent on State)

  // Level 0: Main Categories (Always fetch)
  const { data: mainCategoriesData, isLoading: loadingMain } = useCategoriesQuery("MAIN");

  // Level 1: Sub Categories (Fetch when main selected)
  const { data: subCategoriesData, isLoading: loadingSub } = useCategoriesQuery(
    "SUB",
    formData.mainCategoryId,
    !!formData.mainCategoryId
  );

  // Level 2: Child Categories (Fetch when sub selected)
  const { data: childCategoriesData, isLoading: loadingChild } = useCategoriesQuery(
    "CHILD",
    formData.subCategoryId,
    !!formData.subCategoryId
  );

  // Brands (Fetch if switch is on)
  const { data: brandsData, isLoading: loadingBrands } = useBrandsQuery(formData.hasBrandName);

  const transformedBrandsData = brandsData?.data.map((brand: BrandData) => ({
    label: brand.brandName,
    value: brand.brandId,
  }));

  // 3. Handlers

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const handleValueChange = (key: keyof CreateProductState, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    clearError(key);
  };

  // Logic to clear downstream categories when upstream changes
  const handleMainCategoryChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      mainCategoryId: val,
      subCategoryId: "", // Reset Sub
      childCategoryId: "", // Reset Child
    }));
    clearError("mainCategoryId");
  };

  const handleSubCategoryChange = (val: string) => {
    setFormData((prev) => ({
      ...prev,
      subCategoryId: val,
      childCategoryId: "", // Reset Child
    }));
    clearError("subCategoryId");
  };

  const clearError = (field: string) => {
    if (errors[field]) {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[field];
        return newErr;
      });
    }
  };

  // 4. Submit & Validation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Validating against the Zod Schema manually
    const result = createProductSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) {
          fieldErrors[issue.path[0] as string] = issue.message;
        }
      });
      setErrors(fieldErrors);
      // toast.error("Please fill in all required fields.");
      return;
    }

    const validData = result.data;

    // Determine the most specific category ID
    const finalCategoryId = validData.childCategoryId || validData.subCategoryId || validData.mainCategoryId;

    mutation.mutate(
      {
        name: validData.productName,
        categoryId: finalCategoryId,
        externalSku: validData.externalSku,
        hasVariants: validData.hasVariants,
        brandId: validData.hasBrandName ? validData.brandId : undefined,
      },
      {
        onSuccess: (res) => {
          toast.success("Product draft created!");
          navigate({
            to: `/products/product-form/${res.data.id}/basic-details`,
          });
        },
        onError: (err) => {
          toast.error(err.message || "Failed to create product");
        },
      }
    );
  };

  // Helper to map API data
  const mapCategories = (data: any) =>
    data?.data?.data?.map((c: any) => ({ label: c.name, value: c.id })) || [];

  return (
    <form className="flex flex-col justify-between gap-4 pb-4" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-6 mb-4">
        <h2 className="text-lg font-medium text-base-content">Create a New Product</h2>

        <Input
          name="productName"
          label="Product Name"
          placeholder="Enter product name"
          value={formData.productName}
          onChange={handleInputChange}
          error={errors.productName}
          fullWidth
          required
        />

        {/* Dependent Categories */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Dropdown
            label="Category"
            options={mapCategories(mainCategoriesData)}
            value={formData.mainCategoryId}
            onChange={handleMainCategoryChange}
            isLoading={loadingMain}
            placeholder="Select Category"
            fullWidth
            required
            error={errors.mainCategoryId}
          />

          {/* Show Sub Category if options exist (and main is selected) */}
          {formData.mainCategoryId && mapCategories(subCategoriesData).length > 0 && (
            <Dropdown
              label="Sub Category"
              options={mapCategories(subCategoriesData)}
              value={formData.subCategoryId}
              onChange={handleSubCategoryChange}
              isLoading={loadingSub}
              placeholder="Select Sub Category"
              required
              fullWidth
            />
          )}

          {/* Show Child Category if options exist (and sub is selected) */}
          {formData.subCategoryId && mapCategories(childCategoriesData).length > 0 && (
            <Dropdown
              label="Child Category"
              options={mapCategories(childCategoriesData)}
              value={formData.childCategoryId}
              onChange={(val) => handleValueChange("childCategoryId", val)}
              isLoading={loadingChild}
              placeholder="Select Child Category"
              required
              fullWidth
            />
          )}
        </div>

        <Input
          name="externalSku"
          label="External Product SKU"
          placeholder="Enter SKU"
          value={formData.externalSku}
          onChange={handleInputChange}
          error={errors.externalSku}
          fullWidth
          required
        />

        <div className="flex flex-col gap-4">
          <Switch
            label="Does this product offers variety of options?"
            checked={formData.hasVariants}
            onCheckedChange={(checked) => handleValueChange("hasVariants", checked)}
            size="sm"
          />

          <Switch
            label="Does this product has a brand name?"
            checked={formData.hasBrandName}
            onCheckedChange={(checked) => handleValueChange("hasBrandName", checked)}
            size="sm"
          />
        </div>

        {formData.hasBrandName && (
          <Dropdown
            label="Brand Name"
            options={transformedBrandsData || []}
            value={formData.brandId}
            onChange={(val) => handleValueChange("brandId", val)}
            placeholder="Select Brand"
            isLoading={loadingBrands}
            fullWidth
            required
            error={errors.brandId}
          />
        )}
      </div>

      <div className="flex justify-end items-center gap-2">
        <Button className="min-w-52" variant="outline" type="button" onClick={() => navigate({ to: ".." })}>
          Cancel
        </Button>
        <Button className="min-w-52" type="submit" isLoading={mutation.isPending}>
          Create
        </Button>
      </div>
    </form>
  );
};
