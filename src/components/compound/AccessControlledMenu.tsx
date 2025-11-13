import { IconButton, type IconButtonProps } from "@/components/base/IconButton";
import {
  PermissionTypeEnum,
  type PermissionFeaturesEnum,
} from "@/features/settings/roles-permissions/types";
import * as LucideIcons from "lucide-react";
import MenuItem from "./MenuItem";
import { Popover } from "./Popover";

type PermissionsMap = {
  [feature in PermissionFeaturesEnum]: {
    [permission in PermissionTypeEnum]?: boolean;
  };
};

export const hasPermission = (
  permissions: PermissionsMap,
  feature: PermissionFeaturesEnum,
  type: PermissionTypeEnum,
): boolean => {
  return permissions?.[feature]?.[type] ?? false;
};

export interface ExtraItemsMenuItem {
  label: string;
  icon: keyof typeof LucideIcons;
  onClick: () => void;
  permission?: PermissionTypeEnum;
}

export interface AccessControlledMenuProps {
  feature: PermissionFeaturesEnum;
  permissions: Record<
    PermissionFeaturesEnum,
    Partial<Record<PermissionTypeEnum, boolean>>
  >;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onGoToDetails?: () => void;

  extraItems?: ExtraItemsMenuItem[];

  generalPermission?: PermissionTypeEnum;
  noDefaultFill?: boolean;
  size?: IconButtonProps["size"];
}

const AccessControlledMenu = ({
  feature,
  permissions,
  extraItems = [],
  generalPermission = PermissionTypeEnum.read,
  noDefaultFill,
  size,
  onView,
  onEdit,
  onDelete,
  onGoToDetails,
}: AccessControlledMenuProps) => {
  const items: {
    label: string;
    icon: keyof typeof LucideIcons;
    onClick: () => void;
  }[] = [];

  if (onView && hasPermission(permissions, feature, PermissionTypeEnum.read)) {
    items.push({ label: "View", icon: "Eye", onClick: onView });
  }

  if (onEdit && hasPermission(permissions, feature, PermissionTypeEnum.write)) {
    items.push({ label: "Edit", icon: "Pencil", onClick: onEdit });
  }

  if (
    onDelete &&
    hasPermission(permissions, feature, PermissionTypeEnum.delete)
  ) {
    items.push({ label: "Delete", icon: "Trash", onClick: onDelete });
  }

  if (
    onGoToDetails &&
    hasPermission(permissions, feature, PermissionTypeEnum.read)
  ) {
    items.push({
      label: "View Details",
      icon: "ExternalLink",
      onClick: onGoToDetails,
    });
  }

  for (const item of extraItems) {
    const effectivePerm = item.permission ?? generalPermission;
    if (hasPermission(permissions, feature, effectivePerm)) {
      items.push(item);
    }
  }

  if (items.length === 0) return null;

  return (
    <Popover
      trigger={
        <IconButton
          icon={LucideIcons.Ellipsis}
          noDefaultFill={noDefaultFill}
          size={size}
        />
      }
    >
      <div className="menu-items">
        {items.map(({ label, onClick, icon }, i) => {
          return (
            <MenuItem key={i} onClick={onClick} startIcon={icon}>
              {label}
            </MenuItem>
          );
        })}
      </div>
    </Popover>
  );
};

export default AccessControlledMenu;
