import { useState, useEffect } from "react";
import { CombinationItem, VariationsProp, ColorValue } from "../../types/variations.types";
import { ADDITIONAL_VARIATIONS, DEFAULT_COLORS } from "../../constants/staticData";
import Variations from "./components/Variations";
import CombinationsPreview from "./components/CombinationsPreview";
import { useGenerateCombinationsMutation } from "../../api/queryHooks";
import { Button } from "@/components/base/Button";
import { toast } from "@/components/compound/Sonner";

interface Props {
  productId: string;
  onSuccess: () => void;
}
// ============================================================================
// MAIN COMPONENT - VARIATION STEP 1
// ============================================================================

export default function VariationStep1({ productId, onSuccess }: Props) {
  const mutation = useGenerateCombinationsMutation(productId);
  const [variations, setVariations] = useState<VariationsProp>(() => {
    const initialState: VariationsProp = {
      size: {
        enabled: true,
        selected: [],
        label: "Size",
        activeCharts: [], // New field to track active size charts
      },
      color: {
        enabled: true,
        selected: [],
        values: DEFAULT_COLORS,
        label: "Colour",
      },
    };

    ADDITIONAL_VARIATIONS.forEach((v) => {
      initialState[v.key] = {
        enabled: false,
        selected: [],
        label: v.label,
        values: v.values,
      };
    });

    return initialState;
  });

  const [removedCombinationIds, setRemovedCombinationIds] = useState<string[]>([]);

  useEffect(() => {
    const customColors = localStorage.getItem("customColors");

    if (customColors) {
      const colors = JSON.parse(customColors);
      setVariations((prev) => ({
        ...prev,
        color: {
          ...prev.color,
          values: [
            ...DEFAULT_COLORS,
            ...colors.map((c: ColorValue) => ({ name: c.name, value: c.value || (c as any).color })),
          ],
        },
      }));
    }
  }, []);

  const handleRemoveCombination = (id: string) => {
    setRemovedCombinationIds((prev) => [...prev, id]);
  };

  const getFinalCombinations = () => {
    const enabledVariations = Object.entries(variations)
      .filter(([_, v]) => v.enabled && v.selected && v.selected.length > 0)
      .map(([key, v]) => ({ key, values: v.selected }));

    if (enabledVariations.length === 0) return [];

    // Helper to create a unique ID for a combination
    const generateId = (combo: any) => {
      // Sort keys to ensure consistent order, though iteration order usually follows insertion
      const keys = Object.keys(combo).sort();
      return keys
        .map((k) => {
          const val = combo[k];
          return typeof val === "object" ? val.name : val;
        })
        .join("-");
    };

    let combinations: Array<CombinationItem> = [{ _id: "" }];

    enabledVariations.forEach(({ key, values }) => {
      const newCombinations: Array<CombinationItem> = [];
      combinations.forEach((combo) => {
        values.forEach((value: any) => {
          const formattedValue =
            (key === "size" || key === "color") && typeof value === "object"
              ? { name: value.name, ...value }
              : value;

          // Remove _id from the combo using destructuring
          const { _id: _unused, ...newComboBase } = combo;

          const newCombo = { ...newComboBase, [key]: formattedValue };

          // Generate ID for this step
          const newId = generateId(newCombo);

          newCombinations.push({ ...newCombo, _id: newId });
        });
      });
      combinations = newCombinations;
    });

    // Filter out removed combinations by ID, not index
    return combinations.filter((combo) => !removedCombinationIds.includes(combo._id));
  };

  const finalCombinations = getFinalCombinations();

  const handleSaveAndNext = () => {
    if (finalCombinations.length === 0) {
      toast.error("Please create at least one combination before proceeding");
      return;
    }

    // Transform combinations to the correct backend format
    const backendPayload = {
      variants: finalCombinations.map((combo) => {
        const variant: any = {};
        
        // Transform combination data for backend
        Object.keys(combo).forEach(key => {
          if (key === '_id') {
            // Skip _id, don't send to backend
            return;
          } else if (key === 'size') {
            // Send only name of size
            variant.size = typeof combo[key] === 'object' ? combo[key].name : combo[key];
          } else if (key === 'color') {
            // Send only hex value of color
            variant.color = typeof combo[key] === 'object' ? combo[key].value : combo[key];
          } else if (key !== 'id') {
            // Include other attributes as-is (material, pattern, fit, etc.)
            variant[key] = typeof combo[key] === 'object' ? combo[key].name : combo[key];
          }
        });
        
        return variant;
      })
    };

    mutation.mutate({ productId, variants: backendPayload.variants }, {
      onSuccess: () => {
        toast.success("Variants created successfully");
        onSuccess();
      },
      onError: (error) => {
        toast.error(error.message || "Failed to create variants");
      },
    });
  };

  return (
    <div className="">
      <div className="mx-auto space-y-4 mb-4">
        <Variations variations={variations} onUpdate={setVariations} />
        <CombinationsPreview
          combinations={finalCombinations}
          variations={variations}
          onRemoveCombination={handleRemoveCombination}
        />

        {finalCombinations.length > 0 && (
          <div className="flex justify-end pt-4">
            <Button 
              onClick={handleSaveAndNext} 
              isLoading={mutation.isPending}
              className="px-8"
            >
              Save & Next
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
