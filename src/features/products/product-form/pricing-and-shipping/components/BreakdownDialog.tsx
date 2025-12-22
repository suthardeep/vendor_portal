import React, { useMemo } from "react";
import { X } from "lucide-react";

interface BreakdownDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
}

// Generate random price data for breakdown
const generateRandomBreakdown = () => {
  const sellingPrice = Math.floor(Math.random() * 5000) + 1000; // 1000-6000
  const customerShippingCharge = Math.floor(Math.random() * 200) + 50; // 50-250
  const feesAndTaxes = Math.floor(sellingPrice * 0.15); // 15% of selling price
  const tdsTcs = Math.floor(sellingPrice * 0.01); // 1% of selling price

  const localShipping = Math.floor(Math.random() * 100) + 30; // 30-130
  const regionalShipping = Math.floor(Math.random() * 150) + 80; // 80-230
  const nationalShipping = Math.floor(Math.random() * 200) + 120; // 120-320

  const aavakCoins = Math.floor(Math.random() * 200) + 10; // 10-210

  return {
    sellingPrice,
    customerShippingCharge,
    feesAndTaxes,
    tdsTcs,
    localShipping,
    regionalShipping,
    nationalShipping,
    aavakCoins,
    local: {
      total: sellingPrice + customerShippingCharge - feesAndTaxes - tdsTcs - localShipping - aavakCoins
    },
    regional: {
      total: sellingPrice + customerShippingCharge - feesAndTaxes - tdsTcs - regionalShipping - aavakCoins
    },
    national: {
      total: sellingPrice + customerShippingCharge - feesAndTaxes - tdsTcs - nationalShipping - aavakCoins
    }
  };
};

const BreakdownDialog: React.FC<BreakdownDialogProps> = ({
  isOpen,
  onClose,
  title = "Price Breakdown",
}) => {
  // Generate random data and memoize it - regenerate only when dialog opens
  const breakdownData = useMemo(() => {
    if (isOpen) return generateRandomBreakdown();
    return null;
  }, [isOpen]);

  if (!isOpen || !breakdownData) return null;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
      minimumFractionDigits: 2,
    }).format(amount);
  };

  const rows = [
    { label: "Selling Price", local: breakdownData.sellingPrice, regional: breakdownData.sellingPrice, national: breakdownData.sellingPrice, isAddition: true },
    { label: "Customer's Charge for Shipping", local: breakdownData.customerShippingCharge, regional: breakdownData.customerShippingCharge, national: breakdownData.customerShippingCharge, isAddition: true },
    { label: "Fees and Taxes", local: breakdownData.feesAndTaxes, regional: breakdownData.feesAndTaxes, national: breakdownData.feesAndTaxes, isDeduction: true },
    { label: "TDS/TCS", local: breakdownData.tdsTcs, regional: breakdownData.tdsTcs, national: breakdownData.tdsTcs, isDeduction: true },
    { label: "Shipping Charges", local: breakdownData.localShipping, regional: breakdownData.regionalShipping, national: breakdownData.nationalShipping, isDeduction: true },
    { label: "Praised Aavak Coins", local: breakdownData.aavakCoins, regional: breakdownData.aavakCoins, national: breakdownData.aavakCoins, isDeduction: true },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-base-1 rounded-2xl shadow-2xl w-full max-w-5xl mx-4 overflow-hidden flex flex-col max-h-[94vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-body-content/20 bg-base-1 sticky top-0 z-10">
          <div>
            <h2 className="text-lg font-bold text-primary">{title}</h2>
            <p className="text-xs text-body-content mt-1">Detailed breakdown of pricing across delivery zones</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-base-2 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-body-content" />
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto">
          <div className="border border-body-content/20 rounded-xl overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-4 gap-4 bg-base-2 px-6 py-4 border-b border-body-content/20">
              <div className="text-sm font-bold text-base-content uppercase tracking-wider"></div>
              <div className="text-sm font-bold text-base-content text-center uppercase tracking-wider">Local</div>
              <div className="text-sm font-bold text-base-content text-center uppercase tracking-wider">Regional</div>
              <div className="text-sm font-bold text-base-content text-center uppercase tracking-wider">National</div>
            </div>

            {/* Table Rows */}
            <div className="divide-y divide-body-content/20">
              {rows.map((row, index) => (
                <div
                  key={index}
                  className="grid grid-cols-4 gap-4 px-6 py-4 transition-colors hover:bg-base-2/50"
                >
                  <div className={`text-sm font-semibold text-base-content `}>
                    {row.label}
                  </div>
                  <div className={`text-sm text-center ${row.isDeduction ? 'text-dl-500' : 'text-sl-600'}`}>
                    {row.isDeduction && '- '}{formatCurrency(row.local)}
                  </div>
                  <div className={`text-sm text-center  ${row.isDeduction ? 'text-dl-500' : 'text-sl-600'}`}>
                    {row.isDeduction && '- '}{formatCurrency(row.regional)}
                  </div>
                  <div className={`text-sm text-center {row.isDeduction ? 'text-dl-500' : 'text-sl-600'}`}>
                    {row.isDeduction && '- '}{formatCurrency(row.national)}
                  </div>
                </div>
              ))}

              {/* Settlement Price Row */}
              <div className="grid grid-cols-4 gap-4 px-6 py-4 bg-pl-50 dark:bg-pd-900/20 border-t border-base-content">
                <div className="text-sm font-semibold text-base-content uppercase tracking-wide">
                  Settlement Price
                </div>
                <div className="text-base text-center font-bold text-base-content">
                  {formatCurrency(breakdownData.local.total)}
                </div>
                <div className="text-base text-center font-bold text-base-content">
                  {formatCurrency(breakdownData.regional.total)}
                </div>
                <div className="text-base text-center font-bold text-base-content">
                  {formatCurrency(breakdownData.national.total)}
                </div>
              </div>
            </div>
          </div>

          {/* Info Note */}
          <div className="mt-4 mb-1 p-4 bg-base-2  border border-body-content/20">
            <p className="text-xs text-body-content">
              <span className="font-semibold text-primary">Note:</span> This breakdown shows how the final settlement price is calculated for different delivery zones. Deductions include platform fees, taxes, shipping costs, and promotional discounts.
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
