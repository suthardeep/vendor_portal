import React, { useState } from "react";
import { Ruler, Package, Pencil, Weight } from "lucide-react";
import { Input } from "@/components/base/Input";

interface CombinationData {
    mrp?: string;
    sellingPrice?: string;
    aavakCoinsPrice?: string;
    localCost?: string;
    regionalCost?: string;
    nationalCost?: string;
    height?: string;
    width?: string;
    length?: string;
    weight?: string;
    [key: string]: string | number | undefined;
}

interface PricingAndShippingProps {
  combinations?: Array<{ [key: string]: string | number }>;
  onDataChange?: (data: CombinationData[]) => void;
}

const PricingAndShipping: React.FC<PricingAndShippingProps> = ({
  combinations = [
    { unit: "23", colour: "Custom blue", size: "Custom size 1" },
    { unit: "15", colour: "Green", size: "L" },
    { unit: "18", colour: "Red", size: "M" },
  ],
  onDataChange,
}) => {
  const [formData, setFormData] = useState<CombinationData[]>(
    combinations.map(() => ({
      mrp: "",
      sellingPrice: "",
      aavakCoinsPrice: "",
      localCost: "",
      regionalCost: "",
      nationalCost: "",
      height: "",
      width: "",
      length: "",
      weight: "",
    }))
  );

  const handleInputChange = (index: number, field: string, value: any) => {
    const newData = [...formData];
    newData[index] = { ...newData[index], [field]: value };
    setFormData(newData);
    onDataChange?.(newData);
  };

  const getColorDotClass = (color: string) => {
    const colorMap: { [key: string]: string } = {
      blue: "bg-blue-500",
      green: "bg-green-500",
      red: "bg-red-500",
      yellow: "bg-yellow-500",
      purple: "bg-purple-500",
      pink: "bg-pink-500",
      orange: "bg-orange-500",
      black: "bg-black",
      white: "bg-white border border-gray-300",
    };

    const normalizedColor = color.toLowerCase().replace("custom ", "");
    return colorMap[normalizedColor] || "bg-gray-400";
  };

  const formatCombinationTitle = (combo: any) => {
    const parts: string[] = [];
    const keys = Object.keys(combo).filter(
      (k) =>
        ![
          "mrp",
          "sellingPrice",
          "aavakCoinsPrice",
          "localCost",
          "regionalCost",
          "nationalCost",
          "height",
          "width",
          "length",
          "weight",
        ].includes(k)
    );

    for (const key of keys) {
      const value = combo[key];
      if (key === "size") {
        const sizeValue = String(value).replace("Custom size ", "");
        parts.push(sizeValue);
      } else {
        parts.push(String(value).replace("Custom ", ""));
      }
    }

    return parts.join(" ");
  };

  return (
    <div className="w-full bg-white">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold text-gray-900">Combination details</h2>
        <div className="flex items-center gap-4 text-sm text-gray-600">
          <span className="font-medium">Unit</span>
          <span className="font-medium">Colour</span>
          <span className="font-medium">Size</span>
        </div>
      </div>

      {/* Combinations List */}
      <div className="divide-y divide-gray-200">
        {combinations.map((combo, index) => {
          const data = formData[index];
          const title = formatCombinationTitle(combo);

          return (
            <div key={index} className="px-6 py-6">
              {/* Combination Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">{combo.unit}</span>
                    <div className={`w-4 h-4 rounded-full ${getColorDotClass(String(combo.colour))}`} />
                    <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                      {String(combo.colour).replace("Custom ", "")}
                    </span>
                    <span className="text-xs font-medium text-gray-700 bg-gray-100 px-2 py-1 rounded">
                      {String(combo.size).replace("Custom size ", "")}
                    </span>
                  </div>
                </div>
                <button className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700">
                  <span>View Settlement Price</span>
                  <svg
                    className="w-4 h-4"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 16v-4M12 8h.01" />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-[1fr,auto,1fr] gap-6">
                {/* Pricing Details Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Pricing Details</h4>

                  <Input
                    label="MRP"
                    value={data.mrp}
                    onChange={(e) => handleInputChange(index, "mrp", e.target.value)}
                    placeholder="Enter MRP"
                    type="number"
                  />

                  <Input
                    label="Selling Price"
                    value={data.sellingPrice}
                    onChange={(e) => handleInputChange(index, "sellingPrice", e.target.value)}
                    placeholder="Enter selling price"
                    type="number"
                  />

                  <Input
                    label="Aavak Coins Price (Optional)"
                    value={data.aavakCoinsPrice}
                    onChange={(e) => handleInputChange(index, "aavakCoinsPrice", e.target.value)}
                    placeholder="Enter aavak coin"
                    type="number"
                  />

                  <Input
                    label="Local cost (Optional)"
                    value={data.localCost}
                    onChange={(e) => handleInputChange(index, "localCost", e.target.value)}
                    placeholder="Enter local shipping cost"
                    type="number"
                  />

                  <Input
                    label="Regional cost (Optional)"
                    value={data.regionalCost}
                    onChange={(e) => handleInputChange(index, "regionalCost", e.target.value)}
                    placeholder="Enter regional shipping cost"
                    type="number"
                  />

                  <Input
                    label="National cost (Optional)"
                    value={data.nationalCost}
                    onChange={(e) => handleInputChange(index, "nationalCost", e.target.value)}
                    placeholder="Enter national shipping cost"
                    type="number"
                  />
                </div>

                {/* Vertical Divider */}
                <div className="w-px bg-gray-200" />

                {/* Shipment Data Section */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-4">Shipment Data</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Height (cm)"
                      value={data.height}
                      onChange={(e) => handleInputChange(index, "height", e.target.value)}
                      placeholder="Type h..."
                      type="number"
                      leftElement={<Ruler className="w-4 h-4 text-gray-400" />}
                    />

                    <Input
                      label="Width (cm)"
                      value={data.width}
                      onChange={(e) => handleInputChange(index, "width", e.target.value)}
                      placeholder="Type h..."
                      type="number"
                      leftElement={<Package className="w-4 h-4 text-gray-400" />}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <Input
                      label="Length (cm)"
                      value={data.length}
                      onChange={(e) => handleInputChange(index, "length", e.target.value)}
                      placeholder="Type h..."
                      type="number"
                      leftElement={<Pencil className="w-4 h-4 text-gray-400" />}
                    />

                    <Input
                      label="Weight (kg)"
                      value={data.weight}
                      onChange={(e) => handleInputChange(index, "weight", e.target.value)}
                      placeholder="Type h..."
                      type="number"
                      leftElement={<Weight className="w-4 h-4 text-gray-400" />}
                    />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PricingAndShipping;
