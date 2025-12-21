import React from "react";
import { cn } from "@/utils/helpers";
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
  ChevronUp,
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
  ChevronsLeft,
  Trash2,
  Move,
  BarChart3,
  BarChart2,
  Home,
  Package,
  Tag,
  Wallet,
  Target,
  Box,
  Bell,
  MoreVertical,
  TrendingUp,
  IndianRupee,
  TrendingDown,
  Star,
  SquareChevronRight,
  Copy,
  SlidersHorizontal,
  User,
  Key,
  LogOut,
  Folder,
  ArrowRight,
  CircleArrowDown,
  AlertCircle,
  Triangle,
  Store,
  LayoutGrid,
  PlayCircle,
  CircleDollarSign,
  Percent,
  Megaphone,
  UserCog,
  CheckSquare,
  Inbox,
  FileTextIcon,
  Heart,
  Circle,
  ClipboardList,
  Users,
  Truck,
  ShoppingCart,
  Map,
  Palette,
  MapPin,
  Globe,
  LucideIcon,
  LucideProps,
  Database,
  PlusSquare,
   Clock ,
  Sparkles ,
  Rocket
} from "lucide-react";

import { customIconRegistry, type CustomIconName } from "@/assets/icons";


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
  ChevronUp,
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
  ChevronsLeft,
  Trash2,
  Move,
  BarChart3,
  BarChart2,
  Home,
  Package,
  Tag,
  Wallet,
  Target,
  Box,
  Bell,
  MoreVertical,
  TrendingUp,
  IndianRupee,
  TrendingDown,
  Star,
  SquareChevronRight,
  Copy,
  SlidersHorizontal,
  User,
  Key,
  LogOut,
  Folder,
  ArrowRight,
  CircleArrowDown,
  AlertCircle,
  Triangle,
  Store,
  Grid: LayoutGrid,
  LayoutGrid,
  PlayCircle,
  CircleDollarSign,
  Percent,
  Megaphone,
  BarChart: BarChart2,
  UserCog,
  CheckSquare,
  Inbox,
  FileTextIcon,
  Heart,
  Circle,
  ClipboardList,
  Users,
  Truck,
  ShoppingCart,
  Map,
  Palette,
  MapPin,
  Globe,
  Database,
  PlusSquare,
  Clock ,
  Sparkles ,
  Rocket
} satisfies Record<string, LucideIcon>;

export type LucideIconName = keyof typeof lucideIconRegistry;

export type IconName = LucideIconName | CustomIconName;

type IconComponent = React.ComponentType<any>;

type Size = "xs" | "sm" | "md" | "lg" | "xl";

interface IconBaseProps extends Omit<LucideProps, "size"> {
  name: IconName;
  size?: Size | number;
}



const iconRegistry: Record<string, IconComponent | string> = {
  ...(lucideIconRegistry as Record<LucideIconName, IconComponent>),
  ...(customIconRegistry as Record<CustomIconName, IconComponent | string>),
};


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


export default function Icon({
  name,
  size = "md",
  className,
  ...props
}: IconBaseProps) {
  const Component = iconRegistry[name];

  if (!Component) {
    console.warn(`Icon "${name}" not found in registry`);
    return null;
  }

  const iconSize = typeof size === "string" ? getIconSize(size) : size;

  return <Component size={iconSize} className={cn(className)} {...props} />;
}

export { Icon };