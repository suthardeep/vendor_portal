export interface ProductHeaderData {
  id: string;
  productName: string;
  brandName: string;
  brandLogo?: string;
  categories: string[];
  status: "active" | "draft" | "inactive";
}