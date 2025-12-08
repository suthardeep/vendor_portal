import React from "react";
import { BrandDetailsStepProps } from "../../types/registration.types";
import StepContainer from "../StepContainer";
import { Input } from "@/components/base/Input";
import { RadioGroup } from "@/components/base/RadioGroup";
import {Dropdown} from "@/components/base/Dropdown";
import {Separator}  from "@/components/base/Separator";
import { SingleBrandType } from "../../schemas/registration.schema";
import { Button } from "@/components/base/Button";
import {FileUploadField}  from "@/components/base/FileUploadField";
import { cn } from "@/utils/helpers";

// Initial state for a new brand
export const initialBrandState: SingleBrandType = {
  brandName: "",
  natureOfBusiness: "Brand Owner",
  category: "",
  documents: [],
  website: "", //optional
  socialMedia: "", //optional
};

const BrandDetailsStep: React.FC<BrandDetailsStepProps> = ({ data, onChange, errors }) => {
  // Helper to update a specific field in a specific brand index
  const handleBrandChange = (index: number, field: keyof SingleBrandType, value: any) => {
    const updatedBrands = [...data];
    updatedBrands[index] = { ...updatedBrands[index], [field]: value };
    onChange(updatedBrands);
  };

  const handleAddBrand = () => {
    onChange([...data, { ...initialBrandState }]);
  };

  const handleRemoveBrand = (index: number) => {
    if (data.length === 1) return; // Prevent deleting the last one
    const updatedBrands = data.filter((_, i) => i !== index);
    onChange(updatedBrands);
  };

  // Mock Categories (Replace with API call in useEffect)
  const categoryOptions = [
    { label: "Electronics", value: "electronics" },
    { label: "Fashion", value: "fashion" },
    { label: "Home & Kitchen", value: "home" },
    { label: "Beauty", value: "beauty" },
  ];

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
              {/* Header for multiple brands */}
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
                    { label: "Brand Owner", value: "Brand Owner" },
                    { label: "Manufacturer", value: "Manufacturer" },
                    { label: "Importer", value: "Importer" },
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
                value={brand.category}
                onChange={(val) => handleBrandChange(index, "category", val)}
                error={brandErrors.category?.message || brandErrors.category}
                searchable
                required
              />

              <FileUploadField
                label="Upload Documents"
                helperText="Upload brand authorization letter or trademark certificate"
                multiple
                maxFiles={5}
                value={brand.documents.filter((doc): doc is File => doc !== null)}
                onChange={(files) => handleBrandChange(index, "documents", files)}
                error={brandErrors.documents?.message || brandErrors.documents}
                showPreview
                required
              />

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
