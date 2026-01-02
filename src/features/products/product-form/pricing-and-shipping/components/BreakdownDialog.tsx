import React from "react";
import { X } from "lucide-react";
import { DetailedBreakdownTable } from "../types/pricing.types";

interface BreakdownDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  detailedTable?: DetailedBreakdownTable;
}

const BreakdownDialog: React.FC<BreakdownDialogProps> = ({
  isOpen,
  onClose,
  title = "Price Breakdown",
  detailedTable,
}) => {
  if (!isOpen) return null;

  // If no detailed table data, show a message
  if (!detailedTable) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />
        <div className="relative bg-base-1 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-6">
          <p className="text-center text-body-content">
            No breakdown data available. Please calculate settlement price first.
          </p>
          <button
            onClick={onClose}
            className="mt-4 w-full px-10 py-2.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const rows = [
    {
      label: "Selling Price",
      local: detailedTable.sellingPrice.local,
      regional: detailedTable.sellingPrice.regional,
      national: detailedTable.sellingPrice.national,
      isAddition: true,
      formatCurrency: true,
    },
    {
      label: "Customer's Charge for Shipping",
      local: detailedTable.customerShipping.local,
      regional: detailedTable.customerShipping.regional,
      national: detailedTable.customerShipping.national,
      isAddition: true,
      formatCurrency: true,
    },
    {
      label: "Fees and Taxes",
      local: detailedTable.feesAndTaxes.local,
      regional: detailedTable.feesAndTaxes.regional,
      national: detailedTable.feesAndTaxes.national,
      isDeduction: true,
      formatCurrency: true,
    },
    {
      label: "TDS/TCS",
      local: detailedTable.tdsTcs.local,
      regional: detailedTable.tdsTcs.regional,
      national: detailedTable.tdsTcs.national,
      isDeduction: true,
      formatCurrency: true,
    },
    {
      label: "Shipping Charges",
      local: detailedTable.shippingCharges.local,
      regional: detailedTable.shippingCharges.regional,
      national: detailedTable.shippingCharges.national,
      isDeduction: true,
      formatCurrency: true,
    },
    {
      label: "Praised Aavak Coins",
      local: detailedTable.praisedAavakCoins.local,
      regional: detailedTable.praisedAavakCoins.regional,
      national: detailedTable.praisedAavakCoins.national,
      formatCurrency: false,
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="relative bg-base-1 rounded-2xl shadow-2xl w-full max-w-5xl mx-4 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-body-content/20 bg-base-1 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-primary">{title}</h2>
            <p className="text-xs text-body-content mt-1">
              Detailed breakdown of pricing across delivery zones
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-base-2 rounded-full transition-colors">
            <X className="w-5 h-5 text-body-content" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto">
          <div className="border border-body-content/20 rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 bg-base-2 px-6 py-4 border-b border-body-content/20">
              <div className="text-sm font-bold text-base-content uppercase tracking-wider"></div>
              <div className="text-sm font-bold text-base-content text-center uppercase tracking-wider">
                Local
              </div>
              <div className="text-sm font-bold text-base-content text-center uppercase tracking-wider">
                Regional
              </div>
              <div className="text-sm font-bold text-base-content text-center uppercase tracking-wider">
                National
              </div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-body-content/20">
              {rows.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4 px-6 py-4 transition-colors hover:bg-base-2/50"
                >
                  <div className={`text-sm font-semibold text-base-content `}>{row.label}</div>
                  <div className={`text-sm text-center ${row.isDeduction ? "text-dl-500" : "text-sl-600"}`}>
                    {row.isDeduction && "- "}
                    {row.formatCurrency ? formatCurrency(row.local) : row.local}
                  </div>
                  <div className={`text-sm text-center  ${row.isDeduction ? "text-dl-500" : "text-sl-600"}`}>
                    {row.isDeduction && "- "}
                    {row.formatCurrency ? formatCurrency(row.regional) : row.regional}{" "}
                  </div>
                  <div className={`text-sm text-center {row.isDeduction ? 'text-dl-500' : 'text-sl-600'}`}>
                    {row.isDeduction && "- "}
                    {row.formatCurrency ? formatCurrency(row.national) : row.national}{" "}
                  </div>
                </div>
              ))}

              {/* Settlement Price Row */}
              <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-pl-50 dark:bg-pd-900/20 border-t border-base-content">
                <div className="text-sm font-semibold text-base-content uppercase tracking-wide">
                  Settlement Price
                </div>
                <div className="text-base text-center font-bold text-base-content">
                  {formatCurrency(detailedTable.settlementPrice.local)}
                </div>
                <div className="text-base text-center font-bold text-base-content">
                  {formatCurrency(detailedTable.settlementPrice.regional)}
                </div>
                <div className="text-base text-center font-bold text-base-content">
                  {formatCurrency(detailedTable.settlementPrice.national)}
                </div>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="mt-4 mb-1 p-4 bg-base-2  border border-body-content/20">
            <p className="text-xs text-body-content">
              <span className="font-semibold text-primary">Note:</span> This breakdown shows how the final
              settlement price is calculated for different delivery zones. Deductions include platform fees,
              taxes, shipping costs, and promotional discounts.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 bg-base-2 border-t border-body-content/20">
          <button
            onClick={onClose}
            className="px-10 py-2.5 bg-primary text-white rounded-xl font-bold hover:opacity-90 transition-all active:scale-95"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default BreakdownDialog;
