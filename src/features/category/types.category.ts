export interface Category {
  id: string;
  name: string;
  slug: string;
  level: "MAIN" | "SUB" | "CHILD";
  parentId?: string;
  subcategoryCount: number;
  childCategoryCount: number;
  isActive: boolean;
}

export interface CategoryApiResponse {
  statusCode: number;
  message: string;
  data: {
    data: Category[];
    meta: {
      currentPage: string;
      totalPages: number;
      totalRows: number;
    };
  };
}

export interface CategoryRequirementDocument {
  groupName: string;
  documents: string[];
}

export interface CategoryRequirementField {
  groupName: string;
  fieldNames: string[];
}

export interface CategoryRequirementsResponse {
  requiredVendorDocuments: CategoryRequirementDocument[];
  mandatoryProductFields: CategoryRequirementField[];
  returnPolicy: string;
  returnReplacePeriodDays: number;
  pricing: any;
  charges: any;
}

