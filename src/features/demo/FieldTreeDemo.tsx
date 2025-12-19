import FieldTree, { FieldNode } from '@/components/base/FieldTree';
import React, { useState } from 'react';

const ProductAttributesForm = () => {
  // Initial State: "Size" field pre-populated
  const [attributes, setAttributes] = useState<FieldNode[]>([
    { 
      id: '1', 
      value: 'Size', 
      children: [
        { id: '1-1', value: 'Small', children: [] },
        { id: '1-2', value: 'Large', children: [] }
      ] 
    }
  ]);

  return (
    <div className="p-8 max-w-3xl bg-base-1 rounded-xl shadow-sm border border-base-200">
      <h2 className="text-xl font-bold mb-6">Product Configuration</h2>

      <FieldTree
        data={attributes}
        onChange={setAttributes}
        maxDepth={2} // Only allow Attribute Name -> Attribute Values
        levelConfigs={{
          // --- LEVEL 0: The Category (e.g., Size, Color) ---
          0: {
            label: "Attribute Name",
            placeholder: "e.g. Size, Color, Material",
            maxItems: 5, // Can only have 5 attributes max
            inputClassName: "font-semibold text-lg", // Bigger text for parent
            inputProps: {
              variant: "filled",
              inputSize: "lg"
            }
          },
          // --- LEVEL 1: The Values (e.g., Small, Red, Cotton) ---
          1: {
            label: "Options",
            placeholder: "Value (e.g. Small)",
            maxItems: 10, // Can have 10 options per attribute
            childrenContainerClassName: "border-l-primary/20", // Custom indent color
            inputClassName: "text-sm",
            inputProps: {
              variant: "outlined",
              inputSize: "sm"
            }
          }
        }}
      />

      {/* Debugging Output to show you the data structure */}
      <div className="mt-8 p-4 bg-gray-900 text-gray-100 rounded text-xs font-mono whitespace-pre-wrap">
        {JSON.stringify(attributes, null, 2)}
      </div>
    </div>
  );
};

export default ProductAttributesForm;