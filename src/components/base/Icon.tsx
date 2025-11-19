// Icon.tsx
import { cn } from "@/utils/helpers";
import {
  Save,
  Search,
  Menu,
  X,
  LucideIcon,
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
  SearchIcon,
  LucideProps
} from "lucide-react";

const iconRegistry = {
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
  ImageIcon
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconRegistry;
type Size = "xs" | "sm" | "md" | "lg" | "xl";

interface IconProps extends Omit<LucideProps, "size"> {
  name: IconName;
  size?: Size | number;
}

const getIconSize = (size: Size) => {
  const sizeMap: Record<Size, number> = {
    xs: 14,
    sm: 16,
    md: 18,
    lg: 20,
    xl: 22,
  };
  return sizeMap[size] || sizeMap["md"];
};

export default function Icon({ name, size, className, ...props }: IconProps) {
  const Component = iconRegistry[name];
  const iconSize = typeof size === "string" ? getIconSize(size) : size;

  return <Component size={iconSize} className={cn(className)} {...props} />;
}
