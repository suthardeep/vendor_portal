import { useQuery, useMutation } from "@tanstack/react-query";
import { CatalogProduct, CategoryOption, ProductHeaderData } from "../types/addProduct.types";

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

export const useGetCategories = () => {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async (): Promise<CategoryOption[]> => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      return MOCK_CATEGORIES;
    },
  });
};

export const useGetProductDetails = (productId: string) => {
  return useQuery({
    queryKey: ["product", productId],
    queryFn: async (): Promise<ProductHeaderData> => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return {
        id: productId,
        productName: "Allen Solly Men's 100% Cotton Regular Fit T-Shirt",
        brandName: "Allen Solly",
        brandLogo: "https://picsum.photos/600/400",
        categories: ["Clothing", "Men's Apparel", "Tops", "T-Shirts"],
        status: "active",
      };
    },
    enabled: !!productId,
  });
};

// --- Mutations ---

export const useCreateProduct = () => {
  return useMutation({
    mutationFn: async (data: any) => {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      return { id: "new_prod_123", ...data };
    },
  });
};