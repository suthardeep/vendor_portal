import React from "react";
import { X } from "lucide-react";
import { useGetVariantPriceBreakdownByIdQuery } from "../api/queryHooks";

interface BreakdownItem {
  label: string;
  local?: string | number;
  regional?: string | number;
  national?: string | number;
  isHeader?: boolean;
}

interface BreakdownDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  variantId?: string;
  currency?: string;
  columns?: {
    local?: boolean;
    regional?: boolean;
    national?: boolean;
  };
  columnLabels?: {
    local?: string;
    regional?: string;
    national?: string;
  };
  okayButtonText?: string;
  showOkayButton?: boolean;
  productId?: string;
}

const BreakdownDialog: React.FC<BreakdownDialogProps> = ({
  isOpen,
  onClose,
  title = "Price Breakdown",
  variantId,
  currency = "₹",
  columns = {
    local: true,
    regional: true,
    national: true,
  },
  columnLabels = {
    local: "LOCAL",
    regional: "REGIONAL",
    national: "NATIONAL",
  },
  okayButtonText = "Okay",
  showOkayButton = true,
}) => {
  // Pass skip logic to the query hook if supported, otherwise handle locally
  const { data: apiResponse, isLoading } = useGetVariantPriceBreakdownByIdQuery(
    variantId || "",
    !isOpen || !variantId
  );

  if (!isOpen) return null;

  // Use API data if available, otherwise fallback to null (or show loading)
  const data = (apiResponse as any)?.data;

  // Helper to safely parse and format prices (API returns strings for some, numbers for others)
  const parsePrice = (val: string | number | undefined) => {
    if (val === undefined || val === null) return 0;
    return typeof val === "string" ? parseFloat(val) : val;
  };

  const formatValue = (value: string | number | undefined) => {
    const numericValue = parsePrice(value);
    // Assuming API values are in paise/cents based on /100 in your original code
    // If API returns actual currency units, remove the / 100
    const displayValue = (numericValue / 100).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
    return `${currency} ${displayValue}`;
  };

  // Construct items list from the actual API "data" object
  const items: BreakdownItem[] = data ? [
    {
      label: "Market Retail Price (MRP)",
      local: data.breakdown.mrp,
      regional: data.breakdown.mrp,
      national: data.breakdown.mrp,
    },
    {
      label: "Selling Price",
      local: data.breakdown.sellingPrice,
      regional: data.breakdown.sellingPrice,
      national: data.breakdown.sellingPrice,
    },
    {
      label: "Aavak Coins Discount",
      local: data.breakdown.aavakCoinsPrice,
      regional: data.breakdown.aavakCoinsPrice,
      national: data.breakdown.aavakCoinsPrice,
    },
    {
      label: "Shipping Charges (Cost to Platform)",
      local: data.breakdown.deliveryCosts.local,
      regional: data.breakdown.deliveryCosts.regional,
      national: data.breakdown.deliveryCosts.national,
    },
    {
      label: "Final Settlement Price",
      local: data.breakdown.calculatedPrices.onLocal,
      regional: data.breakdown.calculatedPrices.onRegional,
      national: data.breakdown.calculatedPrices.onNational,
    },
    {
      label: "User Earns (Coins)",
      local: data.breakdown.calculatedPrices.userGets,
      regional: data.breakdown.calculatedPrices.userGets,
      national: data.breakdown.calculatedPrices.userGets,
    }
  ] : [];

  const activeColumnsCount = Object.values(columns).filter(Boolean).length;
  const gridCols = `grid-cols-${activeColumnsCount + 1}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />
      
      <div className="relative bg-white dark:bg-nd-800 rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-nl-200 dark:border-nd-500 bg-white dark:bg-nd-800 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-nl-800 dark:text-nd-100">{title}</h2>
            {data?.aavakSku && (
              <p className="text-xs text-nl-500 font-mono mt-1">{data.aavakSku}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-nl-100 dark:hover:bg-nd-700 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-nl-500 dark:text-nd-400" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
          {isLoading ? (
            <div className="space-y-4 py-10">
              <div className="h-8 bg-nl-200 dark:bg-nd-700 animate-pulse rounded w-full" />
              <div className="h-32 bg-nl-100 dark:bg-nd-700/50 animate-pulse rounded w-full" />
            </div>
          ) : (
            <div className="border border-nl-200 dark:border-nd-600 rounded-xl overflow-hidden">
              {/* Table Header */}
              <div className={`grid ${gridCols} gap-4 bg-nl-100 dark:bg-nd-900 px-4 py-3 border-b border-nl-200 dark:border-nd-600`}>
                <div className="text-xs font-bold text-nl-500 dark:text-nd-400 uppercase tracking-wider">Breakdown Item</div>
                {columns.local && <div className="text-xs font-bold text-nl-700 dark:text-nd-200 text-center uppercase tracking-wider">{columnLabels.local}</div>}
                {columns.regional && <div className="text-xs font-bold text-nl-700 dark:text-nd-200 text-center uppercase tracking-wider">{columnLabels.regional}</div>}
                {columns.national && <div className="text-xs font-bold text-nl-700 dark:text-nd-200 text-center uppercase tracking-wider">{columnLabels.national}</div>}
              </div>

              {/* Rows */}
              <div className="divide-y divide-nl-200 dark:divide-nd-600">
                {items.map((item, index) => {
                  const isSettlement = item.label.includes("Settlement");
                  return (
                    <div 
                      key={index} 
                      className={`grid ${gridCols} gap-4 px-4 py-4 transition-colors hover:bg-nl-50 dark:hover:bg-nd-700/30 ${isSettlement ? 'bg-pl-50/50 dark:bg-pd-900/20' : ''}`}
                    >
                      <div className={`text-sm ${isSettlement ? "font-bold text-pl-700 dark:text-pd-400" : "font-medium text-nl-700 dark:text-nd-200"}`}>
                        {item.label}
                      </div>
                      {columns.local && (
                        <div className={`text-sm text-center ${isSettlement ? "font-bold" : "text-nl-600 dark:text-nd-300"}`}>
                          {formatValue(item.local)}
                        </div>
                      )}
                      {columns.regional && (
                        <div className={`text-sm text-center ${isSettlement ? "font-bold" : "text-nl-600 dark:text-nd-300"}`}>
                          {formatValue(item.regional)}
                        </div>
                      )}
                      {columns.national && (
                        <div className={`text-sm text-center ${isSettlement ? "font-bold" : "text-nl-600 dark:text-nd-300"}`}>
                          {formatValue(item.national)}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {showOkayButton && (
          <div className="flex justify-end px-6 py-4 bg-nl-50 dark:bg-nd-900 border-t border-nl-200 dark:border-nd-600">
            <button
              onClick={onClose}
              className="px-10 py-2.5 bg-black dark:bg-white text-white dark:text-black rounded-xl font-bold hover:opacity-90 transition-all active:scale-95"
            >
              {okayButtonText}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default BreakdownDialog;