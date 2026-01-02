import React, { useState, useEffect } from "react";
import { useNavigate } from "@tanstack/react-router";
import { toast } from "@/components/toast/Sonner";

// --- Components ---
import { Input } from "@/components/base/Input";
import { Textarea } from "@/components/base/Textarea";
import { Dropdown } from "@/components/base/Dropdown";
import { DropdownWithChips } from "@/components/base/DropdownWithChips";
import { Switch } from "@/components/base/Switch";
import { Button } from "@/components/base/Button";
import { MediaPicker } from "@/components/media-picker/MediaPicker";
import { Icon } from "@/components/base/Icon";
import { Separator } from "@/components/base/Separator";

// --- Types & API ---
import { basicDetailsSchema } from "./schemas/basicDetails.schema";
import { MinimalMediaProps } from "@/components/media-picker/types/media.types";
import { useGetBasicDetailsQuery, useSaveBasicDetailsMutation } from "./api/queryHooks";
import { BasicDetailsFormValues } from "./types/basicDetails.types";
import { useProductDetailsQuery } from "../product-header/api/queryHooks";
import { useGetCategoryRequirementsQuery } from "@/features/category/api/queryHooks";
import { cn } from "@/utils/helpers";
import { genderOptions } from "@/constants/genderOptions";

// --- Constants ---
const TAX_SLABS = [
  { label: "0%", value: "0" },
  { label: "5%", value: "5" },
  { label: "12%", value: "12" },
  { label: "18%", value: "18" },
  { label: "28%", value: "28" },
];

const MOCK_TAGS = [
  { id: "summer", name: "Summer Collection", color: "#FF6B6B" },
  { id: "men", name: "Men Clothes", color: "#4ECDC4" },
  { id: "tshirt", name: "T-Shirt", color: "#45B7D1" },
  { id: "winter", name: "Winter Sale", color: "#96CEB4" },
  { id: "women", name: "Women Fashion", color: "#FFEAA7" },
];

const GENDER_OPTIONS = genderOptions

interface Props {
  productId: string;
}

// Local State Interface (Form View Model)
interface BasicDetailsState {
  description: string;
  bulletPoints: string[];
  mediaUrls: string[];
  modelNumber: string;
  modelName: string;
  isFragile: boolean;
  targetGender: string;
  targetAge: string;
  manufacturerName: string;
  packerDetails: string;
  importerDetails: string;
  tags: string[];
  hsnCode: string;
  gstTaxSlab: string;
  cessCode: string;
  customFields: Array<{
    groupName: string;
    fields: Record<string, string>;
  }>;
}

export const BasicProductDetails = ({ productId }: Props) => {
  const navigate = useNavigate();
  const STORAGE_KEY = `basic_details_draft_${productId}`;

  // 1. API Hooks
  const { data: apiData, isLoading } = useProductDetailsQuery(productId);
  const hasVariants = apiData?.hasVariants ?? false;

  // Fetch category requirements for mandatory fields
  const categoryId = apiData?.categories?.[0]?.id;
  const { data: categoryRequirements } = useGetCategoryRequirementsQuery(categoryId ? [categoryId] : []);

  const saveMutation = useSaveBasicDetailsMutation(productId);

  // 2. Local State
  const [formData, setFormData] = useState<BasicDetailsState>({
    description: "",
    bulletPoints: [],
    mediaUrls: [],
    modelNumber: "",
    modelName: "",
    isFragile: false,
    targetGender: "",
    targetAge: "",
    manufacturerName: "",
    packerDetails: "",
    importerDetails: "",
    tags: [],
    hsnCode: "",
    gstTaxSlab: "",
    cessCode: "",
    customFields: [],
  });

  const [bulletInput, setBulletInput] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  // 3. Prefill Logic - handle both new products and existing products
  useEffect(() => {
    if (apiData) {
      // Transform customFields from API format to form format
      const transformedCustomFields = apiData.customFields
        ? apiData.customFields.map((group) => ({
            groupName: group.groupName,
            fields: group?.fields,
          }))
        : [];

      setFormData({
        description: apiData.description || "",
        bulletPoints: apiData.bulletPoints || [],
        mediaUrls: apiData.mediaUrls || [],
        modelNumber: apiData.modelNumber || "",
        modelName: apiData.modelName || "",
        isFragile: apiData.isFragile || false,
        targetGender: apiData.variants?.[0]?.targetGender || "",
        targetAge: apiData.variants?.[0]?.targetAge || "",
        manufacturerName: apiData.manufacturerName || "",
        packerDetails: apiData.packerDetails || "",
        importerDetails: apiData.importerDetails || "",
        tags: apiData.tags || [],
        hsnCode: apiData.hsnCode || "",
        gstTaxSlab: apiData.gstRate?.toString() ?? "",
        cessCode: apiData.cessCode || "",
        customFields: transformedCustomFields,
      });
    }
  }, [apiData]);

  // 4. Initialize customFields structure when category requirements are fetched (for new products)
  useEffect(() => {
    if (categoryRequirements?.mandatoryProductFields && !apiData?.customFields) {
      const initialCustomFields = categoryRequirements.mandatoryProductFields.map((group) => ({
        groupName: group.groupName,
        fields: group.fieldNames.reduce(
          (acc, fieldName) => {
            acc[fieldName] = "";
            return acc;
          },
          {} as Record<string, string>
        ),
      }));
      setFormData((prev) => ({ ...prev, customFields: initialCustomFields }));
    }
  }, [categoryRequirements?.mandatoryProductFields, apiData?.customFields]);

  // 3. Prefill Logic with Session Storage check
  // useEffect(() => {
  //   if (apiData) {
  //     const storedData = sessionStorage.getItem(STORAGE_KEY);

  //     // Prioritize persisted session data over server data for unsaved changes
  //     if (storedData) {
  //       try {
  //         const parsed = JSON.parse(storedData);
  //         setFormData(parsed);
  //         return;
  //       } catch (e) {
  //         console.error("Failed to parse persisted basic details", e);
  //       }
  //     }

  //     setFormData({
  //       description: apiData.description || "",
  //       bulletPoints: apiData.bulletPoints || [],
  //       media: apiData.media || [],
  //       modelNumber: apiData.modelNumber || "",
  //       modelName: apiData.modelName || "",
  //       isFragile: apiData.isFragile || false,
  //       targetGender: apiData.targetGender || "",
  //       targetAge: apiData.targetAge || "",
  //       manufacturerName: apiData.manufacturerName || "",
  //       packerDetails: apiData.packerDetails || "",
  //       importerDetails: apiData.importerDetails || "",
  //       tags: apiData.tags || [],
  //       totalStockQty: apiData.totalStockQty ? String(apiData.totalStockQty) : "",
  //       hsnCode: apiData.hsnCode || "",
  //       gstTaxSlab: apiData.gstTaxSlab || "",
  //       cessCode: apiData.cessCode || "",
  //     });
  //   }
  // }, [apiData, STORAGE_KEY]);

  // 4. Persistence Side Effect: Save to Session Storage on every change
  // useEffect(() => {
  //   if (!isLoading) {
  //     sessionStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  //   }
  // }, [formData, STORAGE_KEY, isLoading]);

  // 4. Handlers
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    clearError(name);
  };

  const handleValueChange = (key: keyof BasicDetailsState, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    clearError(key);
  };

  const clearError = (key: string) => {
    if (errors[key]) {
      setErrors((prev) => {
        const newErr = { ...prev };
        delete newErr[key];
        return newErr;
      });
    }
  };

  const addBulletPoint = () => {
    if (bulletInput.trim() && formData.bulletPoints.length < 5) {
      setFormData((prev) => ({
        ...prev,
        bulletPoints: [...prev.bulletPoints, bulletInput.trim()],
      }));
      setBulletInput("");
    }
  };

  const removeBulletPoint = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      bulletPoints: prev.bulletPoints.filter((_, i) => i !== index),
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Zod Validation
    const result = basicDetailsSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.issues.forEach((issue) => {
        if (issue.path[0]) fieldErrors[issue.path[0] as string] = issue.message;
      });
      setErrors(fieldErrors);
      console.log(fieldErrors);
      toast.error("Please fix the errors in the form.");
      return;
    }

    const validData = result.data as BasicDetailsFormValues;

    // Prepare Payload for API
    const payload: any = {
      description: validData.description,
      bulletPoints: validData.bulletPoints,
      mediaUrls: validData.mediaUrls,
      modelNumber: validData.modelNumber,
      modelName: validData.modelName,
      isFragile: validData.isFragile,
      manufacturerName: validData.manufacturerName,
      packerDetails: validData.packerDetails,
      importerDetails: validData.importerDetails,
      tags: validData.tags,
      hsnCode: validData.hsnCode,
      gstRate: Number(validData?.gstTaxSlab?.replace("%", "") || 0),
      cessCode: validData.cessCode || "",
    };

    // Add variants array only if hasVariants is false
    if (!hasVariants) {
      payload.variants = [
        {
          targetAge: validData.targetAge,
          targetGender: validData.targetGender,
        },
      ];
    }

    // Add customFields if present
    if (validData.customFields && validData.customFields.length > 0) {
      payload.customFields = validData.customFields;
    }

    saveMutation.mutate(payload, {
      onSuccess: () => {
        toast.success("Product details saved successfully");
        if (hasVariants) {
          navigate({ to: `/products/product-form/${productId}/variations` });
        } else {
          navigate({ to: `/products/product-form/${productId}/pricing-and-shipping` });
        }
      },
      onError: (err) => {
        toast.error(err.message || "Failed to save details");
      },
    });
  };

  if (isLoading) return <div className="p-10 text-center">Loading details...</div>;

  return (
    <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-4 animate-fade-in">
      {/* --- LEFT COLUMN (General Info) --- */}
      <div className="lg:col-span-2 space-y-6">
        {/* General Details Box */}
        <div className="bg-base-1 rounded-xl shadow-sm border border-base-content/10">
          <h3 className="p-5 font-semibold text-base text-base-content">General Details</h3>
          <Separator className="p-0 m-0" />

          <div className="w-full p-5 space-y-5">
            <Textarea
              name="description"
              label="Description"
              placeholder="Detailed product description..."
              value={formData.description}
              onChange={handleInputChange}
              rows={4}
              fullWidth
              required
              error={errors.description}
            />

            {/* Bullet Points */}
            <div className="space-y-2">
              <Input
                label="Bullet Points"
                placeholder="Type and press enter (Max 5)"
                value={bulletInput}
                required
                onChange={(e) => setBulletInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addBulletPoint();
                  }
                }}
                helperText={
                  formData.bulletPoints.length < 5
                    ? `You can add up to ${5 - formData.bulletPoints.length} more points`
                    : "Maximum bullet points reached."
                }
                rightElement={
                  <button
                    type="button"
                    onClick={addBulletPoint}
                    className="text-primary hover:cursor-pointer hover:text-primary-focus transition-colors"
                    disabled={formData.bulletPoints.length >= 5}
                  >
                    <Icon name="Plus" size={18} />
                  </button>
                }
                fullWidth
                error={errors.bulletPoints}
              />

              {formData.bulletPoints.length > 0 && (
                <ul className="space-y-2 mt-2">
                  {formData.bulletPoints.map((point, index) => (
                    <li
                      key={index}
                      className="flex items-center gap-2 text-sm bg-base-2 p-2 rounded-lg animate-in fade-in"
                    >
                      <span className="text-primary">•</span>
                      <span className="flex-1 text-xs text-base-content/80">{point}</span>
                      <button
                        type="button"
                        onClick={() => removeBulletPoint(index)}
                        className="text-error hover:text-error/80 hover:bg-error/10 rounded-md hover:cursor-pointer p-1"
                      >
                        <Icon name="X" size={14} />
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <MediaPicker
              label="Upload Videos/Images"
              // Pass IDs and URLs derived from the state objects
              ids={formData.mediaUrls}
              urls={formData.mediaUrls}
              // value={formData.mediaUrls}
              onChange={(items) =>
                handleValueChange(
                  "mediaUrls",
                  items.map((item) => item.s3Url)
                )
              }
              maxFiles={5}
              itemClassName="max-h-[16dvh] w-full"
              containerClassName={
                formData.mediaUrls.length > 0 ? "p-2 border border-body-content/20 rounded-2xl" : ""
              }
              orientation="grid"
              // gridConfig={{ cols: 3, gap: "gap-4" }}
              error={errors.mediaUrls}
              required
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                name="modelNumber"
                label="Model Number"
                value={formData.modelNumber}
                onChange={handleInputChange}
                fullWidth
              />
              <Input
                name="modelName"
                label="Model Name"
                value={formData.modelName}
                onChange={handleInputChange}
                fullWidth
              />
            </div>

            <Switch
              label="Is this a fragile product?"
              checked={formData.isFragile}
              onCheckedChange={(checked) => handleValueChange("isFragile", checked)}
              labelPosition="right"
              required
            />
          </div>
        </div>

        {/* Manufacturer Details */}
        <div className="bg-base-1 rounded-xl shadow-sm border border-base-content/10">
          <h3 className="p-5 font-semibold text-base text-base-content">Manufacture Details</h3>
          <Separator className="p-0 m-0" />

          <div className="p-5 space-y-4">
            <Input
              name="manufacturerName"
              label="Manufacturer Name"
              value={formData.manufacturerName}
              onChange={handleInputChange}
              fullWidth
            />
            <Input
              name="packerDetails"
              label="Packer Details"
              value={formData.packerDetails}
              onChange={handleInputChange}
              fullWidth
            />
            <Input
              name="importerDetails"
              label="Importer Details"
              value={formData.importerDetails}
              onChange={handleInputChange}
              fullWidth
            />
          </div>
        </div>
      </div>

      {/* --- RIGHT COLUMN (Tags, Audience, Legal) --- */}
      <div className="lg:col-span-1 space-y-6">
        {/* Target Audience */}
        {!hasVariants && (
          <div className="bg-base-1 rounded-xl shadow-sm border border-base-content/10">
            <h3 className="p-5 font-semibold text-base text-base-content">Target Audience</h3>
            <Separator className="p-0 m-0" />
            <div className="p-5 space-y-4">
              <Dropdown
                label="Target Gender"
                options={GENDER_OPTIONS}
                value={formData.targetGender}
                onChange={(val) => handleValueChange("targetGender", val)}
                placeholder="Select Gender"
                fullWidth
                error={errors.targetGender}
              />
              <Input
                name="targetAge"
                label="Target Age"
                placeholder="e.g. 18-35"
                value={formData.targetAge}
                onChange={handleInputChange}
                fullWidth
                error={errors.targetAge}
              />
            </div>
          </div>
        )}

        {/* Tags */}
        <div className="bg-base-1 rounded-xl shadow-sm border border-base-content/10">
          <h3 className="p-5 font-semibold text-base text-base-content">Tags</h3>
          <Separator className="p-0 m-0" />
          <div className="p-5">
            <DropdownWithChips
              label="Add Tags"
              placeholder="Select or type tags"
              options={MOCK_TAGS}
              value={formData.tags}
              onChange={(tags) => handleValueChange("tags", tags)}
              allowCustomInput
              fullWidth
              error={errors.tags}
            />
          </div>
        </div>

        {/* Legal Information */}
        <div className="bg-base-1 rounded-xl shadow-sm border border-base-content/10">
          <h3 className="p-5 font-semibold text-base text-base-content">Legal Information</h3>
          <Separator className="p-0 m-0" />

          <div className="p-5 space-y-4">
            <Input
              name="hsnCode"
              label="HSN Code"
              type="number"
              value={formData.hsnCode}
              onChange={handleInputChange}
              fullWidth
              required
              error={errors.hsnCode}
            />

            <Dropdown
              label="GST Tax Slab"
              options={TAX_SLABS}
              value={formData.gstTaxSlab}
              onChange={(val) => handleValueChange("gstTaxSlab", val)}
              placeholder="Select Slab"
              fullWidth
              error={errors.gstTaxSlab}
            />

            <Input
              name="cessCode"
              label="CESS Code"
              value={formData.cessCode}
              onChange={handleInputChange}
              fullWidth
            />
          </div>
        </div>

        {/* --- CUSTOM FIELDS SECTION (Full Width) --- */}
        {categoryRequirements?.mandatoryProductFields &&
          categoryRequirements.mandatoryProductFields.length > 0 && (
            <div className="bg-base-1 rounded-xl shadow-sm border border-base-content/10">
              <h3 className="p-5 font-semibold text-base text-base-content">Additional Mandatory Fields</h3>
              <Separator className="p-0 m-0" />

              <div className={cn("p-5 space-y-6 overflow-y-auto", hasVariants ? "max-h[45dvh]" : "max-h-[70dvh]")}>
                {formData.customFields.map((group, groupIndex) => (
                  <div key={groupIndex} className="space-y-4">
                    <h4 className="font-semibold text-sm text-base-content bg-base-2 p-2 rounded-md border-l-4 border-primary">
                      {group.groupName}
                    </h4>
                    <div className="space-y-4">
                      {Object.keys(group.fields).map((fieldName) => (
                        <Input
                          key={fieldName}
                          label={fieldName}
                          placeholder={`Enter ${fieldName}`}
                          value={group.fields[fieldName]}
                          onChange={(e) => {
                            const newCustomFields = [...formData.customFields];
                            newCustomFields[groupIndex].fields[fieldName] = e.target.value;
                            setFormData((prev) => ({ ...prev, customFields: newCustomFields }));
                          }}
                          fullWidth
                          required
                          error={errors[`customFields.${groupIndex}.fields.${fieldName}`]}
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
      </div>

      {/* --- FOOTER ACTION --- */}
      <div className="col-span-full flex justify-end gap-3 pt-4 pb-10">
        <Button className="w-40" variant="outline" type="button" onClick={() => navigate({ to: ".." })}>
          Previous
        </Button>
        <Button className="w-40" type="submit" isLoading={saveMutation.isPending}>
          Save & Next
        </Button>
      </div>
    </form>
  );
};
