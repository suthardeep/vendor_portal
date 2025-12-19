import React from "react";
import { Dropdown } from "@/components/base/Dropdown";
import { Button } from "@/components/base/Button";
import { useSearchCatalog } from "../api/mockApi";
import { useNavigate } from "@tanstack/react-router";
import { Icon } from "@/components/base/Icon";

export const FindInAavakCatalogTab = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedProduct, setSelectedProduct] = React.useState<string | null>(null);

  const { data: options = [], isLoading } = useSearchCatalog(searchQuery);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleContinue = () => {
    if (selectedProduct) {
      // In a real app, you might pass this ID to the next step or create a draft
      navigate({ to: `/products/add-product/${selectedProduct}/basic-details` });
    }
  };

  const dropdownOptions = options.map((opt) => ({
    label: opt.name,
    value: opt.id,
  }));

  return (
    <div className="flex h-full flex-col gap-6 justify-between">
      <div className="text-base-content font-medium text-lg">
        Utilize Aavak's catalog to locate your product by entering the product title or relevant keywords.
      </div>
      <Dropdown
        label="Search Product In Aavak's Catalog"
        placeholder="Enter product title, keywords or category"
        searchable
        searchPlaceholder="Type to search..."
        onSearch={handleSearch}
        options={dropdownOptions}
        value={selectedProduct}
        onChange={setSelectedProduct}
        isLoading={isLoading}
        fullWidth
        inputSize="lg"
        noOptionsText={searchQuery ? "No products found" : "Type to search"}
        className="relative z-10001"
        required
        // containerClassName="relative z-10001"
      />

      <div className="flex justify-end items-center gap-2">
        <Button className="min-w-44" variant="outline" >
          Previous
        </Button>
        <Button className="min-w-44">
          Next
        </Button>
      </div>
    </div>
  );
};
