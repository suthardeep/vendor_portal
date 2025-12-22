import { useQuery, useMutation } from "@tanstack/react-query";
import { CatalogProduct, CategoryOption } from "../types/addProduct.types";
import { ProductData } from "../../product-form/product-header/types/productHeader.types";

// Mock Data
const MOCK_CATEGORIES: CategoryOption[] = [
  { id: "cat_1", name: "Clothing" },
  { id: "cat_2", name: "Electronics" },
  { id: "cat_3", name: "Home & Kitchen" },
];

const MOCK_CATALOG: CatalogProduct[] = [
  { id: "cp_1", name: "Allen Solly Men's Cotton T-Shirt", category: "Clothing" },
  { id: "cp_2", name: "Samsung Galaxy S24", category: "Electronics" },
  { id: "cp_3", name: "Nike Air Jordan", category: "Clothing" },
];

// --- Queries ---

export const useSearchCatalog = (query: string) => {
  return useQuery({
    queryKey: ["catalog", query],
    queryFn: async (): Promise<CatalogProduct[]> => {
      await new Promise((resolve) => setTimeout(resolve, 800)); // Simulate delay
      if (!query) return [];
      return MOCK_CATALOG.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      );
    },
    enabled: true, // In real app, might want to debounce this
  });
};
