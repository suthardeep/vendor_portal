import React from "react";
import { BrandDetailsStepProps } from "../../types/registration.types";
import StepContainer from "../StepContainer";
import { Input } from "@/components/base/Input";
import { RadioGroup } from "@/components/base/RadioGroup";
import { Dropdown } from "@/components/base/Dropdown";
import { Separator } from "@/components/base/Separator";
import { SingleBrandType } from "../../schemas/registration.schema";
import { Button } from "@/components/base/Button";
import { MediaPicker } from "@/components/media-picker/MediaPicker";
import { cn } from "@/utils/helpers";
// import { useBrandDetailsRegistration } from "../../api/queryHooks";

export const initialBrandState: SingleBrandType = {
  brandName: "",
  natureOfBusiness: "Brand Owner",
  selectedCategories: [],
  brandDocumentIds: [],
  brandDocuments: [],
  brandLogoId: "",
  brandLogo: "",
  website: "",
  socialMedia: "",
};

// to update one value at a time
type BrandChangeSingle = (index: number, field: keyof SingleBrandType, value: any) => void;

// to update multiple values at a time
type BrandChangeMulti = (index: number, updates: Partial<SingleBrandType>) => void;

// const getMinimalMediaItem = (documentId: string[] = [], documentUrls: string[] = []) => {
//   const maxLen = Math.max(documentId?.length || 0, documentUrls?.length || 0);
//   const result: { id: string; s3Url: string }[] = [];

//   for (let i = 0; i < maxLen; i++) {
//     const id = documentId?.[i] ?? "";
//     const s3Url = documentUrls?.[i] ?? "";
//     // include only if at least one of the values exists
//     if (id || s3Url) result.push({ id, s3Url });
//   }

//   return result;
// };

const BrandDetailsStep: React.FC<BrandDetailsStepProps> = ({ data, onChange, errors }) => {
  const handleBrandChange: BrandChangeSingle & BrandChangeMulti = (
    index: number,
    fieldOrUpdates: any,
    value?: any
  ) => {
    const updatedBrands = data.map(
      (brand, i) =>
        i !== index
          ? brand
          : typeof fieldOrUpdates === "object"
            ? { ...brand, ...fieldOrUpdates } // multi-field update
            : { ...brand, [fieldOrUpdates]: value } // single-field update
    );

    onChange(updatedBrands); // pass array (matches prop type)
  };

  console.log("BRAND-DATA", data);

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
  };

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
                  error={brandErrors.natureOfBusiness}
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

              <MediaPicker
                // Convert array of IDs to array of minimal MediaItems
                // value={getMinimalMediaItem(data[index].brandDocumentIds, data[index].brandDocuments)}
                label="Upload Brand Documents"
                ids={data[index].brandDocumentIds}
                urls={data[index].brandDocuments}
                // Convert array of MediaItems back to array of IDs
                onChange={(items) => {
                  const ids = items.map((item) => item.id);
                  const urls = items.map((item) => item.s3Url);

                  // to update both data together
                  handleBrandChange(index, { brandDocumentIds: ids, brandDocuments: urls });
                }}
                maxFiles={5}
                itemClassName="max-h-[16dvh] w-full"
                containerClassName={
                  data[index].brandDocuments.length ? "p-2 border border-body-content/20 rounded-2xl" : ""
                }
                iconConfig={{ size: "xs" }}
                orientation="grid"
                required
                error={brandErrors.brandDocumentIds}
              />

              <MediaPicker
                label="Upload Brand Logo"
                ids={data[index].brandLogoId}
                urls={data[index].brandLogo}
                // Convert array of MediaItems back to array of IDs
                onChange={(items) => {
                  const ids = items.map((item) => item.id);
                  const urls = items.map((item) => item.s3Url);

                  // to update both data together
                  handleBrandChange(index, { brandLogoId: ids[0], brandLogo: urls[0] });
                }}
                maxFiles={1}
                itemClassName="max-h-[16dvh] w-full"
                // containerClassName={
                //   data[index].brandDocuments.length ? "p-2 border border-body-content/20 rounded-2xl" : ""
                // }
                iconConfig={{ size: "xs" }}
                orientation="horizontal"
                required
                error={brandErrors.brandLogoId}
              />

              <Input
                label="Website"
                placeholder="Type here"
                error={brandErrors.website}
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
