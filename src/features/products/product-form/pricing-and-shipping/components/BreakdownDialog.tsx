import React from "react";
import { X } from "lucide-react";

interface BreakdownItem {
  label: string;
  local?: string | number;
  regional?: string | number;
  national?: string | number;
}

interface BreakdownDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  items: BreakdownItem[];
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
}

const BreakdownDialog: React.FC<BreakdownDialogProps> = ({
  isOpen,
  onClose,
  title = "Price Breakdown",
  items = [],
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
  if (!isOpen) return null;

  const formatValue = (value: string | number | undefined) => {
    if (value === undefined || value === null || value === "") return `${currency} 0`;
    return `${currency} ${value}`;
  };

  const activeColumns = Object.entries(columns).filter(([_, isActive]) => isActive);
  const gridCols = activeColumns.length === 1 ? "grid-cols-2" : activeColumns.length === 2 ? "grid-cols-3" : "grid-cols-4";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Dialog */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl mx-4 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Column Headers */}
          <div className={`grid ${gridCols} gap-4 mb-4`}>
            <div className="text-sm font-medium text-gray-500"></div>
            {columns.local && (
              <div className="text-sm font-semibold text-gray-700 text-center">
                {columnLabels.local}
              </div>
            )}
            {columns.regional && (
              <div className="text-sm font-semibold text-gray-700 text-center">
                {columnLabels.regional}
              </div>
            )}
            {columns.national && (
              <div className="text-sm font-semibold text-gray-700 text-center">
                {columnLabels.national}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200" />

          {/* Data Rows */}
          <div className="space-y-0">
            {items.map((item, index) => {
              const isLastRow = index === items.length - 1;
              const isSettlementRow = item.label.toLowerCase().includes("settlement");
              
              return (
                <div key={index}>
                  <div
                    className={`grid ${gridCols} gap-4 py-4 ${
                      index % 2 === 0 ? "bg-gray-50" : "bg-white"
                    } ${isSettlementRow ? "font-semibold" : ""}`}
                  >
                    <div className={`text-sm ${isSettlementRow ? "font-semibold text-gray-900" : "text-gray-700"} px-4`}>
                      {item.label}
                    </div>
                    {columns.local && (
                      <div className={`text-sm ${isSettlementRow ? "font-semibold text-gray-900" : "text-gray-600"} text-center`}>
                        {formatValue(item.local)}
                      </div>
                    )}
                    {columns.regional && (
                      <div className={`text-sm ${isSettlementRow ? "font-semibold text-gray-900" : "text-gray-600"} text-center`}>
                        {formatValue(item.regional)}
                      </div>
                    )}
                    {columns.national && (
                      <div className={`text-sm ${isSettlementRow ? "font-semibold text-gray-900" : "text-gray-600"} text-center`}>
                        {formatValue(item.national)}
                      </div>
                    )}
                  </div>
                  {isLastRow && <div className="border-t border-gray-300 mt-0" />}
                  {!isLastRow && <div className="border-t border-gray-200" />}
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        {showOkayButton && (
          <div className="flex justify-end px-6 py-4 bg-gray-50 border-t border-gray-200">
            <button
              onClick={onClose}
              className="px-8 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors"
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

// Example usage:
/*
const exampleItems = [
  {
    label: "Selling Price",
    local: 780,
    regional: 770,
    national: 760,
  },
  {
    label: "Customer will be charged for shipping",
    local: 0,
    regional: 0,
    national: 0,
  },
  {
    label: "Fees & Taxes",
    local: 0,
    regional: 0,
    national: 0,
  },
  {
    label: "TDS/TCS",
    local: 0,
    regional: 0,
    national: 0,
  },
  {
    label: "Shipping Charges",
    local: 0,
    regional: 0,
    national: 0,
  },
  {
    label: "Praised Aavak Coins",
    local: 0,
    regional: 0,
    national: 0,
  },
  {
    label: "Settlement Price",
    local: 780,
    regional: 770,
    national: 760,
  },
];

<BreakdownDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  items={exampleItems}
/>

// Custom configuration example:
<BreakdownDialog
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Custom Breakdown"
  items={customItems}
  currency="$"
  columns={{
    local: true,
    regional: false,
    national: true,
  }}
  columnLabels={{
    local: "DOMESTIC",
    national: "INTERNATIONAL",
  }}
  okayButtonText="Close"
/>
*/