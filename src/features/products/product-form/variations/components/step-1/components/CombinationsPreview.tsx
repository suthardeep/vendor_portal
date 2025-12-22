import { Trash2 } from "lucide-react";
import { Separator } from "@/components/base/Separator";
import { VariationsProp, CombinationItem } from "../../../types/variations.types";

// ============================================================================
// COMBINATIONS PREVIEW COMPONENT
// ============================================================================

interface CombinationsPreviewProps {
  variations: VariationsProp;
  combinations: CombinationItem[];
  onRemoveCombination: (id: string) => void;
}

const CombinationsPreview = ({
  variations,
  combinations,
  onRemoveCombination,
}: CombinationsPreviewProps) => {

  const formatValue = (key: string, value: any) => {
    if (key === "color" && typeof value === "object") {
      return value;
    }
    if (key === "size" && typeof value === "object") {
      return value.name;
    }
    return value;
  };

  const renderValue = (key: string, value: any) => {
    const formattedValue = formatValue(key, value);

    if (key === "color" && typeof formattedValue === "object") {
      return (
        <div className="flex items-center gap-2">
          <div
            className="w-4 h-4 rounded-full border-2 border-base-content/10 shadow-sm"
            style={{ backgroundColor: formattedValue.value }}
          />
          <span className="text-base-content text-sm font-medium">{formattedValue.name}</span>
        </div>
      );
    }

    return <span className="text-base-content text-sm font-medium">{formattedValue}</span>;
  };

  if (combinations.length === 0) {
    return (
      <div className="bg-base-1 shadow-card rounded-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-lg p-4 font-medium text-base-content">Product Combinations</h2>
        </div>

        <Separator />
        <div className=" p-12 bg-linear-to-br from-base-2 to-base-1 rounded-2xl text-center">
          <div className="max-w-md mx-auto">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-base-300 flex items-center justify-center">
              <svg
                className="w-8 h-8 text-base-content/40"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-base-content mb-2">No Combinations Yet</h3>
            <p className="text-base-content/60">
              Select variations from the options above to generate product combinations.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Filter out internal keys like _id and id for header display
  const variationKeys = Object.keys(combinations[0]).filter(k => k !== '_id' && k !== 'id');

  return (
    <div className="bg-base-1 shadow-card rounded-xl">
      <div className="flex items-center justify-between">
        <h2 className="text-lg p-4 font-medium text-base-content">Product Combinations</h2>
      </div>

      <Separator />

      <div className="bg-base-1 border border-body-content/20  shadow-sm overflow-hidden">
        {/* Table Header */}
        <div className="bg-base-2 border-b border-body-content/40">
          <div
            className="grid gap-4 px-6 py-4"
            style={{
              gridTemplateColumns: `repeat(${variationKeys.length}, minmax(120px, 1fr)) 80px`,
            }}
          >
            {variationKeys.map((key) => (
              <div key={key} className="flex items-center">
                <span className="text-sm font-bold text-base-content/70 uppercase tracking-wider">
                  {variations[key]?.label || key}
                </span>
              </div>
            ))}
            <div className="flex items-center justify-center">
              <span className="text-sm font-bold text-base-content/70 uppercase tracking-wider">Action</span>
            </div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-body-content/40">
          {combinations.map((combo) => (
            <div
              key={combo._id}
              className="grid gap-4 px-6 py-4 hover:bg-base-2/50 transition-colors"
              style={{
                gridTemplateColumns: `repeat(${variationKeys.length}, minmax(120px, 1fr)) 80px`,
              }}
            >
              {variationKeys.map((key) => (
                <div key={key} className="flex items-center min-w-0">
                  {renderValue(key, combo[key])}
                </div>
              ))}
              <div className="flex items-center justify-center">
                <button
                  onClick={() => onRemoveCombination(combo._id)}
                  className="p-2 rounded-lg text-error hover:bg-error/10 transition-all duration-200 hover:scale-110 active:scale-95"
                  title="Remove combination"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Summary Footer */}
      <div className="mt-4 p-4 bg-base-200/50 rounded-lg border border-base-3">
        <p className="text-sm text-base-content/70">
          Total combinations generated:{" "}
          <span className="font-semibold text-base-content">{combinations.length}</span>
        </p>
      </div>
    </div>
  );
};

export default CombinationsPreview;