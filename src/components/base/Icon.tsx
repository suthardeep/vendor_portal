import React from "react";
import { cn } from "@/utils/helpers";
// Tree-shakeable: import only what you use
import {
  Save,
  Search,
  SearchIcon,
  Menu,
  X,
  Monitor,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronRightIcon,
  Download,
  Image,
  File,
  FileText,
  Music,
  Archive,
  Upload,
  ChevronDown,
  EyeOff,
  Eye,
  CheckCircle2,
  AlertTriangle,
  CircleCheck,
  Info,
  XCircle,
  Calendar,
  Maximize2,
  Minus,
  Plus,
  Clock5,
  MoveDown,
  MoveUp,
  Bike,
  ImageIcon,
  ChevronsRight,
  Trash2,
  Move,
} from "lucide-react";

import { customIconRegistry, type CustomIconName } from "@/assets/icons";
import { Chevron } from "react-day-picker";

// ============================================================================
// TYPES
// ============================================================================

const lucideIconRegistry = {
  Save,
  Search,
  SearchIcon,
  Menu,
  X,
  Monitor,
  Check,
  Loader2,
  ChevronLeft,
  ChevronRight,
  ChevronRightIcon,
  Download,
  Image,
  File,
  FileText,
  Music,
  Archive,
  Upload,
  ChevronDown,
  EyeOff,
  Eye,
  CheckCircle2,
  AlertTriangle,
  CircleCheck,
  Info,
  XCircle,
  Calendar,
  Maximize2,
  Minus,
  Plus,
  Clock5,
  MoveDown,
  MoveUp,
  Bike,
  ImageIcon,
  ChevronsRight,
  Trash2,
  Move
}

export type LucideIconName = keyof typeof lucideIconRegistry;

// All icon names (Lucide + Custom)
export type IconName = LucideIconName | CustomIconName;

// Universal icon component type
type IconComponent = React.ComponentType<any>;

type Size = "xs" | "sm" | "md" | "lg" | "xl";

interface IconBaseProps extends React.HTMLAttributes<HTMLSpanElement> {
  name: IconName;
  size?: Size | number;
  // Lucide-specific props that work with both types
  strokeWidth?: number;
  fill?: string;
  color?: string;
  stroke?: string;
}

// ============================================================================
// REGISTRY
// ============================================================================

const iconRegistry: Record<string, IconComponent | string> = { // string for custom SVGs
  // Lucide icons - only what's imported
  ...(lucideIconRegistry as Record<LucideIconName, IconComponent>),
  // Custom SVG icons
  ...(customIconRegistry as Record<CustomIconName,  IconComponent|string>), // Type assertion to satisfy TS, svg are treated as string by default
};

// ============================================================================
// UTILITIES
// ============================================================================

const getIconSize = (size: Size): number => {
  const sizeMap: Record<Size, number> = {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22,
  };
  return sizeMap[size];
};

// ============================================================================
// COMPONENT
// ============================================================================

function Icon({
  name,
  size = "md",
  className,
  strokeWidth,
  fill,
  color,
  stroke,
  style,
  ...props
}: IconBaseProps) {
  const Component = iconRegistry[name];

  if (!Component) {
    console.warn(`Icon "${name}" not found in registry`);
    return null;
  }

  const iconSize = typeof size === "string" ? getIconSize(size) : size;

  // Build props for the icon component
  const iconProps: Record<string, any> = {
    size: iconSize,
    className: cn(className),
    // Common attributes
    ...props,
  };

  // Add Lucide-specific props if provided
  if (strokeWidth !== undefined) {
    iconProps.strokeWidth = strokeWidth;
  }
  if (fill !== undefined) {
    iconProps.fill = fill;
  }
  if (color !== undefined) {
    iconProps.color = color;
  }
  if (stroke !== undefined) {
    iconProps.stroke = stroke;
  }

  // // Merge styles
  // const mergedStyle: React.CSSProperties = {
  //   width: iconSize,
  //   height: iconSize,
  //   ...style,
  // };

  return (
    // <span style={mergedStyle} {...props}>
      <Component {...iconProps} />
    // </span>
  );
}

export {Icon}