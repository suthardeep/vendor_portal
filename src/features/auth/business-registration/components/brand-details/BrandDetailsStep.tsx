import React from "react";
import { BrandDetailsStepProps } from "../../types/registration.types";
import StepContainer from "../StepContainer";
import { Input } from "@/components/base/Input";
import { RadioGroup } from "@/components/base/RadioGroup";
import {Dropdown} from "@/components/base/Dropdown";
import {Separator}  from "@/components/base/Separator";
import { SingleBrandType } from "../../schemas/registration.schema";
import { Button } from "@/components/base/Button";
import { MediaPicker } from "@/components/media-picker/MediaPicker";
import { MediaItem } from "@/components/media-picker/MediaGallery";
import { cn } from "@/utils/helpers";
import { useBrandDetailsRegistration } from "../../api/queryHooks";

export const initialBrandState: SingleBrandType = {
  brandName: "",
  natureOfBusiness: "Brand Owner",
  selectedCategories: [], 
  brandDocumentIds: [], 
  website: "", 
  socialMedia: "",
};

const convertIdsToMediaItems = (ids: (string | null | undefined)[]): MediaItem[] => {
  return ids
    .filter((id): id is string => !!id)
    .map(id => ({
      id,
      name: `Document ${id.substring(0, 4)}`,
      type: 'file',
      createdAt: new Date().toISOString()
    }));
};

const BrandDetailsStep: React.FC<BrandDetailsStepProps> = ({ data, onChange, errors }) => {
  const handleBrandChange = (index: number, field: keyof SingleBrandType, value: any) => {
    const updatedBrands = [...data];
    updatedBrands[index] = { ...updatedBrands[index], [field]: value };
    onChange(updatedBrands);
  };

  const handleAddBrand = () => {
    onChange([...data, { ...initialBrandState }]);
  };





  const handleRemoveBrand = (index: number) => {
    if (data.length === 1) return;
    const updatedBrands = data.filter((_, i) => i !== index);
    onChange(updatedBrands);
  };

  const categoryOptions = [
    { label: "Electronics", value: "Electronics & Gadgets" },
    { label: "Fashion", value: "Fashion" },
    { label: "Home & Kitchen", value: "Home & Kitchen" },
    { label: "Beauty", value: "Beauty" },
  ];
  
  const getSingleCategoryValue = (brand: SingleBrandType): string => {
    return brand.selectedCategories?.[0] || "";
  }

  return (
    <StepContainer>
      <div className="space-y-2">
        {data.map((brand, index) => {
          const brandErrors = errors?.[index] || {};

          return (
            <div
              key={index}
              className="bg-base-1 rounded-xl p-1 md:p-2 md:py-0 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
            >
              {data.length > 1 && (
                <div className={cn("flex items-center", index === 0 ? "justify-end" : "justify-between")}>
                  {index > 0 && (
                    <h3 className="text-xl font-semibold text-base-content">{`Brand ${index + 1}`}</h3>
                  )}
                  {data.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      color="danger"
                      onClick={() => handleRemoveBrand(index)}
                      startIcon="Trash2"
                      startIconClassname="text-error"
                    >
                      Remove
                    </Button>
                  )}
                </div>
              )}

              <Input
                label="Brand Name"
                placeholder="Type here"
                value={brand.brandName}
                onChange={(e) => handleBrandChange(index, "brandName", e.target.value)}
                error={brandErrors.brandName?.message || brandErrors.brandName} // Handle Zod structure
                required
              />

              <div className="space-y-2">
                <RadioGroup
                  name={`nature-${index}`}
                  label="Nature of Business"
                  options={[
                    { label: "Brand Owner", value: "brandowner" },
                    { label: "Manufacturer", value: "manufacturer" },
                    { label: "Importer", value: "importer" },
                  ]}
                  value={brand.natureOfBusiness}
                  onChange={(val) => handleBrandChange(index, "natureOfBusiness", val)}
                  orientation="horizontal"
                  required
                />
              </div>

              <Dropdown
                label="Category"
                placeholder="Select Category"
                options={categoryOptions}
                // Use helper to get the single selected value for UI
                value={getSingleCategoryValue(brand)} 
                onChange={(val) => {
                  // CONVERSION LOGIC: Store the single string value as a single-element array
                  handleBrandChange(index, "selectedCategories", val ? [val] : []);
                }}
                // Note: Error key points to selectedCategories now
                error={brandErrors.selectedCategories?.message || brandErrors.selectedCategories} 
                searchable
                required
              />

              {/* Start Documents MediaPicker Integration */}
              <div className="w-full">
                <label className="label pt-0 pb-1.5 flex items-center justify-start gap-1">
                  <span className="label-text font-semibold text-base-content">Upload Documents</span>
                  <span className="text-error">*</span>
                </label>
                <p className="text-xs text-body-content/60 mb-2">Upload brand authorization letter or trademark certificate</p>
                <MediaPicker
                  // Convert array of IDs to array of minimal MediaItems
                  value={convertIdsToMediaItems(brand.brandDocumentIds)}
                  // Convert array of MediaItems back to array of IDs
                  onChange={(items) => handleBrandChange(index, "brandDocumentIds", items.map(item => item.id))}
                  maxFiles={5}
                  containerClassName={brandErrors.brandDocumentIds ? "h-auto p-0 border-error" : "h-auto p-0"}
                  previewGridClassName="grid-cols-4 gap-2"
                  itemClassName="h-20"
                  maxHeight="max-h-[120px]"
                />
                {brandErrors.brandDocumentIds && <p className="text-xs text-error mt-1">{brandErrors.brandDocumentIds}</p>}
              </div>
              {/* End Documents MediaPicker Integration */}

              <Input
                label="Website"
                placeholder="Type here"
                value={brand.website}
                onChange={(e) => handleBrandChange(index, "website", e.target.value)}
              />

              <Input
                label="Social Media"
                placeholder="Type here"
                value={brand.socialMedia}
                onChange={(e) => handleBrandChange(index, "socialMedia", e.target.value)}
              />

              {index < data.length - 1 && <Separator variant={"dashed"} className="my-6 text-primary" />}
            </div>
          );
        })}

        <Button
          variant="outline"
          fullWidth
          onClick={handleAddBrand}
          startIcon="Plus"
          startIconClassname="text-primary"
          className="mt-4 border-dashed border-2"
        >
          Add Another Brand
        </Button>
      </div>
    </StepContainer>
  );
};

export default BrandDetailsStep;