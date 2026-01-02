// ============================================================================
// VARIATIONS COMPONENT
// ============================================================================

import ColorPickerDialog, { ColorData } from "@/components/compound/ColorPickerDialog";
import CustomSizeChartDialog from "./CustomSizeChartDialog";
import { useEffect, useState } from "react";
import { ChevronDown, ChevronUp, Edit2 } from "lucide-react";
import { cn } from "@/utils/helpers";
import { ADDITIONAL_VARIATIONS, DEFAULT_SIZES } from "../../../constants/staticData";
import { Switch } from "@/components/base/Switch";
import { Separator } from "@/components/base/Separator";
import { Button } from "@/components/base/Button";
import { CustomSizeChart, VariationCreationState, ColorValue, SizeObject } from "../../../types/variations.types";

const Chip = ({
  children,
  className,
  isSelected,
  onClick,
  onEdit,
}: {
  children: React.ReactNode;
  className?: string;
  isSelected: boolean;
  onClick: () => void;
  onEdit?: (e: React.MouseEvent) => void;
}) => {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 px-3 py-1 text-sm rounded-md transition-all border group",
        isSelected
          ? "bg-primary/10 border-primary text-primary"
          : "bg-secondary/10 border-transparent hover:bg-secondary/20 text-body-content",
        // className
      )}
      onClick={onClick}
    >
        <button className={cn("flex-1 group-hover:cursor-pointer text-left", className)}>
            {children}
        </button>
        {onEdit && (
            <button 
                onClick={onEdit} 
                className="p-0.5 rounded-full hover:bg-primary/20 text-current opacity-60 hover:opacity-100 transition-opacity"
                title="Edit Chart"
            >
                <Edit2 size={15} className="m-1" />
            </button>
        )}
    </div>
  );
};

interface VariationsProps {
    variations: VariationCreationState;
    onUpdate: (val: VariationCreationState) => void;
}

const Variations = ({ variations, onUpdate }: VariationsProps) => {
  const [colorPickerOpen, setColorPickerOpen] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const [editingChart, setEditingChart] = useState<CustomSizeChart | null>(null);
  const [showMoreVariations, setShowMoreVariations] = useState(false);
  const [savedCharts, setSavedCharts] = useState<CustomSizeChart[]>([]);

  // Load custom charts from local storage on mount
  useEffect(() => {
    const customSizes = localStorage.getItem("customSizeCharts");
    if (customSizes) {
      setSavedCharts(JSON.parse(customSizes));
    }
  }, []);

  const toggleVariation = (key: string) => {
    onUpdate({
      ...variations,
      [key]: { ...variations[key], enabled: !variations[key].enabled },
    });
  };

  const toggleSelection = (key: string, item: any) => {
    const current = variations[key].selected || [];
    // Handle objects (like sizes/colors) vs primitives
    const itemName = typeof item === "object" ? item.name : item;
    const isSelected = current.some((s: any) => (typeof s === "object" ? s.name : s) === itemName);

    let newSelected;
    if (isSelected) {
      newSelected = current.filter((s: any) => (typeof s === "object" ? s.name : s) !== itemName);
    } else {
      newSelected = [...current, item];
    }

    onUpdate({
      ...variations,
      [key]: { ...variations[key], selected: newSelected },
    });
  };

  // --- Size Chart Logic ---

  const handleCustomSizeChartSave = (chartData: CustomSizeChart) => {
    const updatedCharts = [...savedCharts];
    const index = updatedCharts.findIndex((c) => c.chartName === chartData.chartName);

    if (index >= 0) {
      updatedCharts[index] = chartData;
    } else {
      updatedCharts.push(chartData);
    }

    setSavedCharts(updatedCharts);
    localStorage.setItem("customSizeCharts", JSON.stringify(updatedCharts));

    // If this chart was currently selected, we need to update the size objects in 'variations.size.selected'
    const activeCharts = variations.size.activeCharts || [];
    if (activeCharts.includes(chartData.chartName)) {
        // Re-calculate all selected sizes based on currently active charts
        updateSelectedSizesBasedOnCharts(activeCharts, updatedCharts);
    }
  };

  const handleCustomSizeChartDelete = (chartName: string) => {
      const updatedCharts = savedCharts.filter(c => c.chartName !== chartName);
      setSavedCharts(updatedCharts);
      localStorage.setItem("customSizeCharts", JSON.stringify(updatedCharts));

      // Remove from active charts if it was active
      const activeCharts = variations.size.activeCharts || [];
      if (activeCharts.includes(chartName)) {
          const newActiveCharts = activeCharts.filter(n => n !== chartName);
          updateSelectedSizesBasedOnCharts(newActiveCharts, updatedCharts);
      }
  };

  const toggleChartSelection = (chartName: string) => {
      const activeCharts = variations.size.activeCharts || [];
      let newActiveCharts: string[] = [];

      if (activeCharts.includes(chartName)) {
          newActiveCharts = activeCharts.filter(c => c !== chartName);
      } else {
          newActiveCharts = [...activeCharts, chartName];
      }
      
      updateSelectedSizesBasedOnCharts(newActiveCharts, savedCharts);
  };

  const updateSelectedSizesBasedOnCharts = (activeChartNames: string[], allCharts: CustomSizeChart[]) => {
      let aggregatedSizes: SizeObject[] = [];
      
      activeChartNames.forEach(name => {
          const chart = allCharts.find(c => c.chartName === name);
          if (chart) {
              aggregatedSizes = [...aggregatedSizes, ...chart.sizeObjects];
          }
      });

      // Update parent state
      onUpdate({
          ...variations,
          size: {
              ...variations.size,
              selected: aggregatedSizes,
              activeCharts: activeChartNames
          }
      });
  };

  const openCreateModal = () => {
    setEditingChart(null);
    setSizeChartOpen(true);
  };

  const openEditModal = (e: React.MouseEvent, chart: CustomSizeChart) => {
    e.stopPropagation();
    setEditingChart(chart);
    setSizeChartOpen(true);
  };

  // --- Color Logic ---

  const handleCustomColor = (colorData: ColorData) => {
    const customColors = localStorage.getItem("customColors");
    const colors = customColors ? JSON.parse(customColors) : [];

    const colorIndex = colors.findIndex((c: ColorValue) => c.name === colorData.name);
    if (colorIndex >= 0) {
      colors[colorIndex] = colorData;
    } else {
      colors.push(colorData);
    }

    localStorage.setItem("customColors", JSON.stringify(colors));

    const newColor = { name: colorData.name, value: colorData.color };
    // Add to available values and select it
    onUpdate({
      ...variations,
      color: {
        ...variations.color,
        values: [...(variations.color.values || []), newColor],
        selected: [...(variations.color.selected || []), newColor],
      },
    });

    setColorPickerOpen(false);
  };

  return (
    <div className="bg-base-1 shadow-card rounded-xl ">
      <h2 className="text-lg p-4 font-medium text-base-content">Define Variations</h2>
      <Separator />

      <div className="space-y-4 p-5">
        {/* Size Variation */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Switch
              size="sm"
              checked={variations.size.enabled}
              onCheckedChange={() => toggleVariation("size")}
            />
            <span className="text-base font-medium text-base-content">Size</span>
          </div>

          {variations.size.enabled && (
            <div className="flex items-center justify-between space-y-3">
              <div className="max-w-3/4 flex flex-wrap gap-2">
                {savedCharts.length > 0 ? (
                    // Display Custom Charts as Chips
                    savedCharts.map((chart, idx) => {
                        const isSelected = (variations.size.activeCharts || []).includes(chart.chartName);
                        return (
                            <Chip 
                                key={idx} 
                                isSelected={isSelected} 
                                onClick={() => toggleChartSelection(chart.chartName)}
                                onEdit={(e) => openEditModal(e, chart)}
                            >
                                {chart.chartName}
                            </Chip>
                        );
                    })
                ) : (
                  // Display Default Sizes if no custom charts exist
                  DEFAULT_SIZES.map((size, idx) => {
                    const isSelected = variations.size.selected.some((s: any) => s.name === size.name);
                    return (
                      <Chip key={idx} isSelected={isSelected} onClick={() => toggleSelection("size", size)}>
                        {size.name}
                      </Chip>
                    );
                  })
                )}
              </div>
              <Button
                onClick={openCreateModal}
                variant="outline"
                className="py-1 max-w-1/3"
                endIcon="ArrowRight"
                endIconClassname="h-4 w-4 rotate-320 rounded-full border border-primary"
              >
                Create Custom Size Chart
              </Button>
            </div>
          )}
        </div>

        {/* Color Variation */}
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Switch
              size="sm"
              checked={variations.color.enabled}
              onCheckedChange={() => toggleVariation("color")}
            />
            <span className="text-sm font-medium text-body-content">Colour</span>
          </div>

          {variations.color.enabled && (
            <div className="flex items-center justify-between space-y-3">
              <div className="max-w-3/4 flex flex-wrap gap-2">
                {variations.color.values?.map((color: any, idx: number) => {
                  const isSelected = variations.color.selected.some((s: any) => s.name === color.name);
                  return (
                    <Chip
                      key={idx}
                      isSelected={isSelected}
                      onClick={() =>
                        toggleSelection("color", { name: color.name, value: color.value })
                      }
                      className="flex items-center justify-around gap-2"
                    >
                      <div
                        className="w-3 h-3 rounded-full border border-body-content/20"
                        style={{ backgroundColor: color.value }}
                      />
                      {color.name}
                    </Chip>
                  );
                })}
              </div>
              <Button
                onClick={() => setColorPickerOpen(true)}
                variant="outline"
                className="py-1 max-w-1/3"
                endIcon="ArrowRight"
                endIconClassname="h-4 w-4 rotate-320 rounded-full border border-primary"
              >
                Choose Custom Color
              </Button>
            </div>
          )}
        </div>

        {/* Additional Variations Dropdown */}
        <div className="space-y-3">
          <button
            onClick={() => setShowMoreVariations(!showMoreVariations)}
            className="flex items-center gap-2 text-sm font-medium text-body-content hover:text-primary transition-colors"
          >
            {showMoreVariations ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            More Variations ({ADDITIONAL_VARIATIONS.filter((v) => variations[v.key]?.enabled).length}{" "}
            selected)
          </button>

          {showMoreVariations && (
            <div className="ml-6 space-y-4 border-l-2 border-input-border pl-4">
              {ADDITIONAL_VARIATIONS.map((variation) => (
                <div key={variation.key} className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Switch
                      size="sm"
                      checked={variations[variation.key]?.enabled || false}
                      onCheckedChange={() => toggleVariation(variation.key)}
                    />
                    <span className="text-sm font-medium text-body-content">{variation.label}</span>
                  </div>

                  {variations[variation.key]?.enabled && (
                    <div className="">
                      <div className="flex flex-wrap gap-2">
                        {variation.values.map((value, idx) => {
                          const isSelected = variations[variation.key]?.selected?.includes(value);
                          return (
                            <Chip
                              key={idx}
                              isSelected={isSelected}
                              onClick={() => toggleSelection(variation.key, value)}
                            >
                              {value}
                            </Chip>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <CustomSizeChartDialog
        isOpen={sizeChartOpen}
        onClose={() => setSizeChartOpen(false)}
        onSave={handleCustomSizeChartSave}
        onDelete={handleCustomSizeChartDelete}
        existingChart={editingChart}
      />

      <ColorPickerDialog
        isOpen={colorPickerOpen}
        onClose={() => setColorPickerOpen(false)}
        onSave={handleCustomColor}
      />
    </div>
  );
};

export default Variations;