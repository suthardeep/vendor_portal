/**
 * Common types used across multiple components
 */

// Theme configuration type
export type ThemeColors = [string, string]; // Primary, Secondary

// Validation options
export interface ValidationOptions {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  custom?: (value: any) => boolean | string;
  errorMessages?: {
    required?: string;
    min?: string;
    max?: string;
    minLength?: string;
    maxLength?: string;
    pattern?: string;
    custom?: string;
  };
}

// Size variants
export type SizeVariant = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

// Common animation types
export type AnimationType = 'none' | 'fade' | 'scale' | 'slide' | 'bounce';

// Option type for select inputs
export interface SelectOption {
  label: string;
  value: string | number;
  disabled?: boolean;
}

// File type for media modal
export type FileType = 'image' | 'pdf' | 'video';

// Media file interface
export interface MediaFile {
  src: string;
  type: FileType;
  alt?: string;
  title?: string;
}



//
import { ReactNode } from 'react';

export interface ColumnDef<T = any> {
  key: string;
  header: string | ReactNode;
  width?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  
  // Cell rendering
  render?: (row: T, index: number) => ReactNode;
  cellType?: 'text' | 'image' | 'badge' | 'rating' | 'input' | 'custom';
  
  // Type-specific configs
  imageConfig?: ImageCellConfig;
  badgeConfig?: BadgeCellConfig;
  ratingConfig?: RatingCellConfig;
  inputConfig?: InputCellConfig;
}

export interface ImageCellConfig {
  srcKey?: string;
  altKey?: string;
  size?: 'sm' | 'md' | 'lg';
  fallback?: string;
  rounded?: boolean;
}

export interface BadgeCellConfig {
  colorMap?: Record<string, string>;
  variant?: 'filled' | 'outlined' | 'soft';
}

export interface RatingCellConfig {
  icon?: 'star' | 'heart';
  showCount?: boolean;
  countKey?: string;
}

export interface InputCellConfig {
  type?: 'text' | 'number';
  placeholder?: string;
  onChange?: (value: any, row: any) => void;
  disabled?: boolean;
}

export interface FilterConfig {
  key: string;
  label: string;
  options: { label: string; value: string }[];
  value?: string;
  onChange?: (value: string) => void;
}

export interface ActionButton {
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'outlined';
  onClick?: () => void;
}

export interface PaginationConfig {
  currentPage?: number;
  pageSize?: number;
  totalItems?: number;
  onPageChange?: (page: number) => void;
  showTotal?: boolean;
}

export interface ActionMenuItem {
  label: string;
  icon?: string;
  onClick?: (row: any) => void;
  variant?: 'default' | 'danger';
}

export interface TableProps<T = any> {
  // Data
  data: T[];
  columns: ColumnDef<T>[];
  
  // Header
  title?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  filters?: FilterConfig[];
  actions?: ActionButton[];
  
  // Row features
  selectable?: boolean;
  selectedRows?: Set<any>;
  onSelectionChange?: (selected: Set<any>) => void;
  rowKey?: keyof T | ((row: T) => string | number);
  onRowClick?: (row: T) => void;
  rowActions?: ActionMenuItem[];
  
  // Sorting
  sortable?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  
  // Pagination
  pagination?: PaginationConfig;
  
  // Styling
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  className?: string;
  
  // States
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
}