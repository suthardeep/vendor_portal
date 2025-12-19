export interface SizeChartRow {
  sizeName: string;
  values: Record<string, string>;
}

export interface SizeObject {
  name: string;
  [key: string]: string | number;
}

export interface CustomSizeChart {
  chartName: string;
  unit: string;
  columns: string[];
  rows: SizeChartRow[];
  sizeObjects: SizeObject[];
}

export interface ColorValue {
  name: string;
  value: string;
}

export interface Variation {
  enabled: boolean;
  // Selected can hold strings (simple values) or objects (like sizes/colors)
  selected: (string | SizeObject | ColorValue)[];
  label: string;
  values?: (string | ColorValue)[];
  // Helper to track which custom charts are currently active/selected
  activeCharts?: string[]; 
}

export interface VariationsProp {
  [key: string]: Variation;
}

// Helper for combination structure
export interface CombinationItem {
  _id: string; // Added for reliable deletion
  id: string; // Added for reliable deletion
  [key: string]: any;
}

export interface VariationsApiResponse {
  productId: string;
  combinations: CombinationItem[];
}