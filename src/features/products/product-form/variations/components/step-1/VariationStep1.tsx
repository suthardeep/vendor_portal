import { useState, useEffect } from "react";
import { CombinationItem, VariationsProp, ColorValue } from "../../types/variations.types";
import { ADDITIONAL_VARIATIONS, DEFAULT_COLORS } from "../../constants/staticData";
import Variations from "./components/Variations";
import CombinationsPreview from "./components/CombinationsPreview";
import { useGenerateCombinationsMutation } from "../../api/queryHooks";

interface Props {
  productId: string;
  onSuccess: () => void;
}
// ============================================================================
// MAIN COMPONENT - VARIATION STEP 1
// ============================================================================

export default function VariationStep1({ productId, onSuccess }: Props) {
  const mutation = useGenerateCombinationsMutation();
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

    let combinations: Array<CombinationItem> = [{ _id: "", id: "" }];

    enabledVariations.forEach(({ key, values }) => {
      const newCombinations: Array<CombinationItem> = [];
      combinations.forEach((combo) => {
        values.forEach((value: any) => {
          const formattedValue =
            (key === "size" || key === "color") && typeof value === "object"
              ? { name: value.name, ...value }
              : value;

          // SOLUTION: Use destructuring to remove _id instead of delete operator
          // This avoids the "operand of delete must be optional" error and is cleaner
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

  return (
    <div className="">
      <div className="mx-auto space-y-4 mb-4">
        <Variations variations={variations} onUpdate={setVariations} />
        <CombinationsPreview
          combinations={finalCombinations}
          variations={variations}
          onRemoveCombination={handleRemoveCombination}
        />

        {/* <div className="mt-8 p-6 bg-base-1 rounded-2xl">
          <h3 className="text-lg font-semibold text-body-content mb-4">Final Data (for backend)</h3>
          <pre className="text-xs bg-base-2 p-4 rounded-lg overflow-auto max-h-96 text-body-content">
            {JSON.stringify(finalCombinations, null, 2)}
          </pre>
          <p className="mt-4 text-sm text-body-content/70">
            Total combinations: <span className="font-bold text-primary">{finalCombinations.length}</span>
          </p>
        </div> */}
      </div>
    </div>
  );
}
