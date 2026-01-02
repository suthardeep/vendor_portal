import React, { useEffect, useState } from "react";
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
import { Icon } from "@/components/base/Icon";
import { CategoryRequirementsResponse } from "@/features/category/types.category";
import { useCategoriesQuery, useGetCategoryRequirementsMutation } from "@/features/category/api/queryHooks";

export const initialBrandState: SingleBrandType = {
  brandName: "",
  natureOfBusiness: "brandowner",
  selectedCategoryIds: [],
  brandLogo: "",
  website: "",
  socialMedia: "",
  brandDocuments: [], // Initialized as empty, populated dynamically
};

// to update one value at a time
type BrandChangeSingle = (index: number, field: keyof SingleBrandType, value: any) => void;

// to update multiple values at a time
type BrandChangeMulti = (index: number, updates: Partial<SingleBrandType>) => void;

const BrandDetailsStep: React.FC<BrandDetailsStepProps> = ({ data, onChange, errors }) => {
  const [requirementsMap, setRequirementsMap] = useState<
    Record<number, CategoryRequirementsResponse["requiredVendorDocuments"]>
  >({});

  const { mutateAsync: fetchRequirements, isPending: isFetchingRequirements } =
    useGetCategoryRequirementsMutation();
  const { data: mainCategoriesData } = useCategoriesQuery("MAIN");

  // Helper to merge new requirements with existing data to preserve uploads
  const mergeRequirementsWithData = (
    existingBrandDocs: SingleBrandType["brandDocuments"],
    requirements: CategoryRequirementsResponse["requiredVendorDocuments"]
  ) => {
    if (!requirements) return existingBrandDocs || [];

    return requirements.map((reqGroup) => {
      // Find existing group if it exists
      const existingGroup = existingBrandDocs?.find((g) => g.groupName === reqGroup.groupName);

      const documents = reqGroup.documents.map((reqDocName) => {
        // Find existing doc in that group
        const existingDoc = existingGroup?.documents?.find((d) => d.name === reqDocName);
        return {
          name: reqDocName,
          url: existingDoc?.url || "", // Preserve URL or init empty
        };
      });

      return {
        groupName: reqGroup.groupName,
        documents,
      };
    });
  };

  // Fetch requirements on mount for existing data (Edit/Back flow)
  useEffect(() => {
    data.forEach((brand, index) => {
      const hasCategories = brand.selectedCategoryIds.length > 0;
      const noRequirementsLoaded = !requirementsMap[index];

      if (hasCategories && noRequirementsLoaded) {
        fetchRequirements(brand.selectedCategoryIds)
          .then((res) => {
            if (res?.data?.requiredVendorDocuments) {
              setRequirementsMap((prev) => ({
                ...prev,
                [index]: res?.data?.requiredVendorDocuments,
              }));

              // Ensure data structure exists for validation even if user hasn't touched it yet
              const mergedDocs = mergeRequirementsWithData(
                brand.brandDocuments,
                res?.data?.requiredVendorDocuments
              );

              // Only update if different to avoid infinite loops
              if (JSON.stringify(mergedDocs) !== JSON.stringify(brand.brandDocuments)) {
                handleBrandChange(index, "brandDocuments", mergedDocs);
              }
            }
          })
          .catch((err) => console.error("Failed to load initial requirements", err));
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run once on mount

  const handleBrandChange: BrandChangeSingle & BrandChangeMulti = async (
    index: number,
    fieldOrUpdates: any,
    value?: any
  ) => {
    const updatedBrands = data.map((brand, i) =>
      i !== index
        ? brand
        : typeof fieldOrUpdates === "object"
          ? { ...brand, ...fieldOrUpdates }
          : { ...brand, [fieldOrUpdates]: value }
    );

    onChange(updatedBrands);

    // Handle Category Selection & API Fetch
    if (fieldOrUpdates === "selectedCategoryIds") {
      const ids = value as string[];

      if (ids && ids.length > 0) {
        try {
          const res = await fetchRequirements(ids);
          const reqs = res?.data?.requiredVendorDocuments || [];

          setRequirementsMap((prev) => ({
            ...prev,
            [index]: reqs,
          }));

          // Re-initialize documents structure based on new requirements
          // This clears old unrelated docs but keeps structure clean
          const newDocsStructure = reqs.map((group) => ({
            groupName: group.groupName,
            documents: group.documents.map((name) => ({ name, url: "" })),
          }));

          // Update the specific brand with new empty document structure
          const brandsWithNewDocs = updatedBrands.map((b, i) =>
            i === index ? { ...b, brandDocuments: newDocsStructure } : b
          );
          onChange(brandsWithNewDocs);
        } catch (error) {
          console.error("Failed to fetch requirements", error);
        }
      } else {
        // Clear requirements if categories removed
        setRequirementsMap((prev) => {
          const copy = { ...prev };
          delete copy[index];
          return copy;
        });
        // Clear documents data
        const brandsCleared = updatedBrands.map((b, i) => (i === index ? { ...b, brandDocuments: [] } : b));
        onChange(brandsCleared);
      }
    }
  };

  const handleDocumentChange = (brandIndex: number, groupName: string, docName: string, url: string) => {
    const brand = data[brandIndex];
    const currentGroups = brand.brandDocuments || [];

    // Deep clone to safely mutate
    const newGroups = currentGroups.map((group) => {
      if (group.groupName !== groupName) return group;

      return {
        ...group,
        documents: group.documents.map((doc) => {
          if (doc.name !== docName) return doc;
          return { ...doc, url: url };
        }),
      };
    });

    handleBrandChange(brandIndex, "brandDocuments", newGroups);
  };

  const handleAddBrand = () => {
    onChange([...data, { ...initialBrandState }]);
  };

  const handleRemoveBrand = (index: number) => {
    if (data.length === 1) return;
    const updatedBrands = data.filter((_, i) => i !== index);
    onChange(updatedBrands);

    setRequirementsMap((prev) => {
      const copy = { ...prev };
      delete copy[index];
      // We need to shift keys if we remove an index in the middle,
      // but simpler to just let them reload or handle clean up.
      // For now, this is a basic cleanup.
      return copy;
    });
  };

  const mapCategories = (data: any) =>
    data?.data?.data?.map((c: any) => ({ label: c.name, value: c.id })) || [];

  console.log("data: ", data)

  return (
    <StepContainer>
      {isFetchingRequirements && (
        <div className="absolute inset-0 bg-base-1/50 z-50 flex items-center justify-center rounded-lg backdrop-blur-sm">
          <div className="flex flex-col items-center gap-2">
            <Icon name="Loader2" className="animate-spin text-primary" size={32} />
            <span className="font-semibold text-base-content">Fetching Requirements...</span>
          </div>
        </div>
      )}

      <div className={cn("space-y-2", isFetchingRequirements && "opacity-50 pointer-events-none")}>
        {data?.map((brand, index) => {
          const brandErrors = errors?.[index] || {};
          const currentRequirements = requirementsMap[index];

          return (
            <div
              key={index}
              className="bg-base-1 rounded-xl p-1 md:p-2 md:py-0 space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300"
            >
              {data.length > 1 && (
                <div className={cn("flex items-center justify-between border-b border-base-content/50 py-1")}>
                  {data.length > 1 && (
                    <h3 className="text-lg fxont-semibold text-base-content">{`Brand ${index + 1}`}</h3>
                  )}
                  {data.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      color="danger"
                      onClick={() => handleRemoveBrand(index)}
                    >
                      <Icon name="Trash2" className="text-error" size={16} />
                    </Button>
                  )}
                </div>
              )}

              <Input
                label="Brand Name"
                placeholder="Type here"
                value={brand.brandName}
                onChange={(e) => handleBrandChange(index, "brandName", e.target.value)}
                error={brandErrors.brandName?.message || brandErrors.brandName}
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
                options={mapCategories(mainCategoriesData)}
                value={brand.selectedCategoryIds?.[0] || ""}
                onChange={(val) => {
                  handleBrandChange(index, "selectedCategoryIds", val ? [val] : []);
                }}
                error={brandErrors.selectedCategories?.message || brandErrors.selectedCategories}
                searchable
                required
              />

              {/* Dynamic Requirements Section */}
              {currentRequirements && currentRequirements.length > 0 && (
                <div className="space-y-6 pt-2">
                  <div className="flex items-center gap-2">
                    <Separator className="flex-1" legend="Required Documents" />
                    {/* <span className="text-sm font-medium text-body-content">Required Documents</span>
                    <Separator className="flex-1" /> */}
                  </div>

                  {currentRequirements.map((group, groupIndex) => (
                    <div key={`${index}-group-${groupIndex}`} className="space-y-3">
                      <h4 className="font-semibold text-base-content text-sm bg-base-2 p-2 rounded-md border-l-4 border-primary">
                        {group.groupName}
                      </h4>
                      <div className={cn("grid gap-4", group.documents.length === 1 ? "grid-cols-1" : "grid-cols-2")}>
                        {group.documents.map((docName, docIndex) => {
                          // Locate the current value in the form data structure
                          const currentGroupData = brand.brandDocuments?.find(
                            (bg) => bg.groupName === group.groupName
                          );
                          const currentDocData = currentGroupData?.documents?.find((d) => d.name === docName);

                          // Locate error for this specific field
                          // errors structure: brandErrors.brandDocuments[groupIndex].documents[docIndex].url
                          const fieldError =
                            brandErrors?.brandDocuments?.[groupIndex]?.documents?.[docIndex]?.url;
                            console.log("fieldError1", fieldError)
                            console.log("fieldError2", brandErrors)

                          return (
                            <MediaPicker
                              key={`${index}-${group.groupName}-${docName}`}
                              label={docName}
                              required
                              maxFiles={1}
                              orientation="vertical"
                              itemClassName="w-full"
                              // Use the actual URL if present
                              ids={currentDocData?.url}
                              urls={currentDocData?.url}
                              onChange={(items) => {
                                const s3Url = items.length > 0 ? items[0].s3Url : "";
                                handleDocumentChange(index, group.groupName, docName, s3Url);
                              }}
                              error={fieldError}
                            />
                          );
                        })}
                      </div>
                    </div>
                  ))}
                  <Separator variant="dashed" />
                </div>
              )}

              <MediaPicker
                label="Upload Brand Logo"
                ids={brand.brandLogo ? ["uploaded-logo"] : []}
                urls={brand.brandLogo ? [brand.brandLogo] : []}
                onChange={(items) => {
                  const url = items.length > 0 ? items[0].s3Url : "";
                  handleBrandChange(index, "brandLogo", url);
                }}
                maxFiles={1}
                itemClassName="w-full"
                required
                error={brandErrors.brandLogo}
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

              {index < data.length - 1 && <Separator variant={"dashed"} className="my-6 text-base-content" />}
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
