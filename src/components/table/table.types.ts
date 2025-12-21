
import { ReactNode } from 'react';
import { IconName } from '../base/Icon';
import { ChipColor } from "../base/Chip";
import { PaginationMeta } from '@/types/baseApi';


export interface SubColumnDef<T = any> {
  key: string;
  header: string | ReactNode;
  width?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  cellClassName?: string;
  subColumns?: SubColumnDef<T>[];
  render?: (row: T, index: number) => ReactNode;
  cellType?: 'text' | 'image' | 'badge' | 'rating' | 'input' | 'custom';
  imageConfig?: ImageCellConfig;
  badgeConfig?: BadgeCellConfig;
  ratingConfig?: RatingCellConfig;
  inputConfig?: InputCellConfig;
}

export interface ColumnDef<T = any> {
  key: string;
  header: string | ReactNode;
  width?: string;
  sortable?: boolean;
  align?: 'left' | 'center' | 'right';
  cellClassName?: string;
  subColumns?: SubColumnDef<T>[];
  render?: (row: T, index: number) => ReactNode;
  cellType?: 'text' | 'image' | 'badge' | 'rating' | 'input' | 'custom';
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


export interface PaginationConfig {
  meta: PaginationMeta;
  onPageChange: (page: number) => void;
  showTotal?: boolean;
}




export interface FilterChip {
  key: string;
  label: string;
  defaultActive?: boolean;
  activeColor?: ChipColor;
  onChange?: (isActive: boolean) => void;
}


export type FilterType = 'dropdown' | 'date' | 'daterange' | 'search' | 'number';

export interface BaseFilterConfig {
  key: string;
  label: string;
  value: any;
  onChange?: (value: any) => void;
  icon?: IconName; // Custom icon for each filter
}

export interface DropdownFilterConfig extends BaseFilterConfig {
  type: 'dropdown';
  options: Array<{ label: string; value: string }>;
}

export interface DateFilterConfig extends BaseFilterConfig {
  type: 'date';
  minDate?: Date;
  maxDate?: Date;
}

export interface DateRangeFilterConfig extends BaseFilterConfig {
  type: 'daterange';
  value: { start: Date | null; end: Date | null };
  minDate?: Date;
  maxDate?: Date;
}

export interface SearchFilterConfig extends BaseFilterConfig {
  type: 'search';
  placeholder?: string;
}

export interface NumberFilterConfig extends BaseFilterConfig {
  type: 'number';
  min?: number;
  max?: number;
  placeholder?: string;
}

export type FilterConfig = 
  | DropdownFilterConfig 
  | DateFilterConfig 
  | DateRangeFilterConfig
  | SearchFilterConfig
  | NumberFilterConfig;


export interface ActionButton {
  label: string;
  icon?: string;
  variant?: 'primary' | 'secondary' | 'outlined';
  onClick?: () => void;
  className?:string
}

export interface BreadcrumbConfig {
  items: string[];
  label?: string;
  showSeparator?: boolean;
  onItemClick?: (item: string, index: number) => void;
  heading?: string;
}



export interface ActionMenuItem {
  label: string;
  icon?: string;
  onClick?: (row: any) => void;
  variant?: 'default' | 'danger';
}

export interface ExpandedRowConfig<T> {
  shouldExpand?: (row: T) => boolean;
  render: (row: T) => ReactNode;
}


export interface TableProps<T = any> {
  data: T[];
  columns: ColumnDef<T>[];
  
  title?: string;
  breadcrumbs?: BreadcrumbConfig; 
  searchable?: boolean;
  searchPlaceholder?: string;
  onSearch?: (value: string) => void;
  filters?: FilterConfig[];
  actions?: ActionButton[];
  
  selectable?: boolean;
  selectedRows?: Set<any>;
  onSelectionChange?: (selected: Set<any>) => void;
  rowKey?: keyof T | ((row: T) => string | number);
  onRowClick?: (row: T) => void;
  rowActions?: ActionMenuItem[];
  
  sortable?: boolean;
  onSort?: (key: string, direction: 'asc' | 'desc') => void;
  
  
  striped?: boolean;
  hoverable?: boolean;
  bordered?: boolean;
  className?: string;
  
  loading?: boolean;
  emptyMessage?: string;
  emptyIcon?: string;
  singleIcon?: string;
  
  showFooter?: boolean;
  footerActions?: ActionButton[];
    pagination?: PaginationConfig;  

  
  expandedRowConfig?: ExpandedRowConfig<T>;


  filterChips?:FilterChip[]

  containsAction?:boolean

  stickyPagination?: boolean;

  maxHeight?: string;
}