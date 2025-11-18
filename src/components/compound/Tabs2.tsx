import React, { useState } from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/utils/helpers';

// Tab variants using CVA
const tabVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-medium transition-all duration-200 ease-in-out cursor-pointer select-none whitespace-nowrap",
  {
    variants: {
      size: {
        sm: "text-xs px-3 py-1.5 min-h-[32px]",
        md: "text-sm px-4 py-2 min-h-[40px]",
        lg: "text-base px-5 py-2.5 min-h-[48px]",
        xl: "text-lg px-6 py-3 min-h-[56px]",
        "2xl": "text-xl px-7 py-3.5 min-h-[64px]",
      },
      variant: {
        default: "bg-white text-gray-700 border-2 border-gray-200 hover:border-gray-300",
        selected: "bg-indigo-50 text-indigo-600 border-2 border-indigo-500 shadow-sm",
        disabled: "bg-gray-100 text-gray-400 border-2 border-gray-200 cursor-not-allowed opacity-60",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  }
);

// Icon wrapper variants
const iconVariants = cva(
  "flex items-center justify-center shrink-0",
  {
    variants: {
      size: {
        sm: "w-4 h-4",
        md: "w-5 h-5",
        lg: "w-6 h-6",
        xl: "w-7 h-7",
        "2xl": "w-8 h-8",
      },
    },
    defaultVariants: {
      size: "md",
    },
  }
);

export interface TabItem {
  id: string | number;
  label: string;
  value: any;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  disabled?: boolean;
  color?: string;
  className?: string;
}

export interface TabsProps extends VariantProps<typeof tabVariants> {
  tabs: TabItem[];
  selectedValue?: any | any[];
  multiSelect?: boolean;
  onChange?: (value: any | any[]) => void;
  onTabClick?: (tab: TabItem, index: number) => void;
  onLeftIconClick?: (tab: TabItem, index: number, event: React.MouseEvent) => void;
  onRightIconClick?: (tab: TabItem, index: number, event: React.MouseEvent) => void;
  className?: string;
  tabClassName?: string;
  textClassName?: string;
  iconClassName?: string;
  containerClassName?: string;
  allowDeselect?: boolean;
  fullWidth?: boolean;
  justify?: 'start' | 'center' | 'end' | 'between' | 'around' | 'evenly';
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  selectedValue,
  multiSelect = false,
  onChange,
  onTabClick,
  onLeftIconClick,
  onRightIconClick,
  size = "md",
  className,
  tabClassName,
  textClassName,
  iconClassName,
  containerClassName,
  allowDeselect = false,
  fullWidth = false,
  justify = 'start',
}) => {
  const [internalSelected, setInternalSelected] = useState<any | any[]>(
    multiSelect ? [] : null
  );

  const selected = selectedValue !== undefined ? selectedValue : internalSelected;

  const isSelected = (value: any): boolean => {
    if (multiSelect) {
      return Array.isArray(selected) && selected.includes(value);
    }
    return selected === value;
  };

  const handleTabClick = (tab: TabItem, index: number) => {
    if (tab.disabled) return;

    let newSelected: any | any[];

    if (multiSelect) {
      const currentSelected = Array.isArray(selected) ? selected : [];
      if (currentSelected.includes(tab.value)) {
        newSelected = currentSelected.filter((v) => v !== tab.value);
      } else {
        newSelected = [...currentSelected, tab.value];
      }
    } else {
      if (allowDeselect && selected === tab.value) {
        newSelected = null;
      } else {
        newSelected = tab.value;
      }
    }

    if (selectedValue === undefined) {
      setInternalSelected(newSelected);
    }

    onChange?.(newSelected);
    onTabClick?.(tab, index);
  };

  const handleLeftIconClick = (tab: TabItem, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tab.disabled) return;
    onLeftIconClick?.(tab, index, e);
  };

  const handleRightIconClick = (tab: TabItem, index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (tab.disabled) return;
    onRightIconClick?.(tab, index, e);
  };

  const justifyClasses = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
    evenly: 'justify-evenly',
  };

  return (
    <div
      className={cn(
        "w-full flex flex-wrap gap-2 md:gap-3",
        justifyClasses[justify],
        containerClassName
      )}
    >
      {tabs.map((tab, index) => {
        const selected = isSelected(tab.value);
        const variant = tab.disabled ? "disabled" : selected ? "selected" : "default";

        return (
          <button
            key={tab.id}
            onClick={() => handleTabClick(tab, index)}
            disabled={tab.disabled}
            className={cn(
              tabVariants({ size, variant }),
              fullWidth && "flex-1 min-w-[120px]",
              !fullWidth && "shrink-0",
              tab.className,
              tabClassName,
              className
            )}
            style={tab.color && selected ? { 
              backgroundColor: `${tab.color}15`,
              borderColor: tab.color,
              color: tab.color 
            } : undefined}
          >
            {tab.leftIcon && (
              <span
                onClick={(e) => handleLeftIconClick(tab, index, e)}
                className={cn(
                  iconVariants({ size }),
                  onLeftIconClick && !tab.disabled && "cursor-pointer hover:opacity-70",
                  iconClassName
                )}
              >
                {tab.leftIcon}
              </span>
            )}
            
            <span className={cn("flex-1 text-center", textClassName)}>
              {tab.label}
            </span>
            
            {tab.rightIcon && (
              <span
                onClick={(e) => handleRightIconClick(tab, index, e)}
                className={cn(
                  iconVariants({ size }),
                  onRightIconClick && !tab.disabled && "cursor-pointer hover:opacity-70",
                  iconClassName
                )}
              >
                {tab.rightIcon}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
};

// Demo Component
const Tabs2Demo = () => {
  const [sizeSelected, setSizeSelected] = useState("md");
  const [colorSelected, setColorSelected] = useState(["white"]);
  const [customSelected, setCustomSelected] = useState<any[]>([]);

  const sizeIcons: Record<string, string> = {
    sm: "S",
    md: "M",
    lg: "L",
    xl: "XL",
    "2xl": "2XL",
  };

  const sizeTabs: TabItem[] = Object.keys(sizeIcons).map((size) => ({
    id: size,
    label: sizeIcons[size],
    value: size,
  }));

  sizeTabs.push({
    id: 'custom1',
    label: 'Custom size 1',
    value: 'custom1',
  });

  const colorCircle = (color: string) => (
    <div 
      className="w-5 h-5 rounded-full border-2 border-gray-200"
      style={{ backgroundColor: color }}
    />
  );

  const colorTabs: TabItem[] = [
    { id: 1, label: "Black", value: "black", leftIcon: colorCircle("#000000") },
    { id: 2, label: "White", value: "white", leftIcon: colorCircle("#FFFFFF") },
    { id: 3, label: "Red", value: "red", leftIcon: colorCircle("#EF4444") },
    { id: 4, label: "Green", value: "green", leftIcon: colorCircle("#22C55E") },
    { id: 5, label: "Orange", value: "orange", leftIcon: colorCircle("#F97316") },
    { id: 6, label: "Pink", value: "pink", leftIcon: colorCircle("#EC4899") },
    { id: 7, label: "Gray", value: "gray", leftIcon: colorCircle("#6B7280") },
    { id: 8, label: "Custom black", value: "custom-black", leftIcon: colorCircle("#1a1a1a") },
  ];

  const customColorTabs: TabItem[] = [
    { 
      id: 10, 
      label: "Custom blue", 
      value: "custom-blue", 
      leftIcon: colorCircle("#3B82F6"),
      color: "#3B82F6"
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">
            Dynamic Tabs Component
          </h1>
          <p className="text-gray-600 mb-6">
            Fully responsive tabs with single/multi-select, custom icons, and flexible sizing
          </p>

          {/* Size Selection - Single Select */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Size Selection (Single)
            </h2>
            <Tabs
              tabs={sizeTabs}
              selectedValue={sizeSelected}
              onChange={setSizeSelected}
              size="md"
              onTabClick={(tab) => console.log("Tab clicked:", tab)}
            />
            <p className="mt-2 text-sm text-gray-500">
              Selected: <span className="font-medium">{sizeSelected}</span>
            </p>
          </div>

          {/* Color Selection - Multi Select */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Color Selection (Multi)
            </h2>
            <Tabs
              tabs={colorTabs}
              selectedValue={colorSelected}
              onChange={setColorSelected}
              multiSelect
              size="md"
              onLeftIconClick={(tab, _index, _e) => {
                console.log("Left icon clicked:", tab.label);
              }}
            />
            <p className="mt-2 text-sm text-gray-500">
              Selected: <span className="font-medium">{colorSelected.join(", ") || "None"}</span>
            </p>
          </div>

          {/* Custom Color with Dynamic Color */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Custom Colored Tabs (Multi)
            </h2>
            <Tabs
              tabs={customColorTabs}
              selectedValue={customSelected}
              onChange={setCustomSelected}
              multiSelect
              size="md"
            />
          </div>

          {/* Different Sizes Demo */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              Size Variants
            </h2>
            
            <div>
              <p className="text-sm text-gray-600 mb-2">Small</p>
              <Tabs
                tabs={[
                  { id: 1, label: "Option 1", value: "1" },
                  { id: 2, label: "Option 2", value: "2" },
                  { id: 3, label: "Option 3", value: "3" },
                ]}
                size="sm"
              />
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Large</p>
              <Tabs
                tabs={[
                  { id: 1, label: "Option 1", value: "1" },
                  { id: 2, label: "Option 2", value: "2" },
                  { id: 3, label: "Option 3", value: "3" },
                ]}
                size="lg"
              />
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">2XL</p>
              <Tabs
                tabs={[
                  { id: 1, label: "Option 1", value: "1" },
                  { id: 2, label: "Option 2", value: "2" },
                ]}
                size="2xl"
              />
            </div>
          </div>

          {/* With Icons */}
          <div className="mt-8">
            <h2 className="text-lg font-semibold text-gray-700 mb-3">
              With Right Icons
            </h2>
            <Tabs
              tabs={[
                { 
                  id: 1, 
                  label: "Home", 
                  value: "home",
                  leftIcon: <span>🏠</span>
                },
                { 
                  id: 2, 
                  label: "Settings", 
                  value: "settings",
                  leftIcon: <span>⚙️</span>,
                  rightIcon: <span className="text-xs">⨯</span>
                },
                { 
                  id: 3, 
                  label: "Profile", 
                  value: "profile",
                  leftIcon: <span>👤</span>
                },
              ]}
              size="md"
              onRightIconClick={(tab) => console.log("Close:", tab.label)}
            />
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Features</h2>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Fully responsive with flex-wrap</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Single and multi-select modes</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Left and right icon support with click handlers</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>CVA for variant management</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Extensive className props for customization</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Disabled state support</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-green-500 mt-1">✓</span>
              <span>Custom colors per tab</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Tabs2Demo;