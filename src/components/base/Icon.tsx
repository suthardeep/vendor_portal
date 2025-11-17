// Icon.tsx
import { cn } from "@/utils/helpers";
import { Save, Search, Menu, X, LucideIcon, Monitor, Check } from "lucide-react";

const iconRegistry = {
  Save,
  Search,
  Menu,
  X,
  Monitor,
  Check
} satisfies Record<string, LucideIcon>;

export type IconName = keyof typeof iconRegistry;
type Size = "xs" | "sm" | "md" | "lg" | "xl";

interface IconProps {
  name: IconName;
  size?: Size | number;
  className?: string;
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
}

export default function Icon({ name, className, size }: IconProps) {
  const Component = iconRegistry[name];
  const iconSize = typeof size === "string" ? getIconSize(size) : size;

  return <Component className={cn("text-primary-content",className)} size={iconSize} />;
}
