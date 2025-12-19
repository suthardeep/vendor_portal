import React, { useState } from "react";
import { X, Check, Tag, User, Package, Star } from "lucide-react";
import { DropdownWithChips } from "@/components/base/DropdownWithChips";

/* ------------------ MOCK DATA ------------------ */

const mockTags = [
  { id: "summer", name: "Summer Collection", color: "#FF6B6B" },
  { id: "men", name: "Men Clothes", color: "#4ECDC4" },
  { id: "tshirt", name: "T-Shirt", color: "#45B7D1" },
  { id: "winter", name: "Winter Sale", color: "#96CEB4" },
  { id: "women", name: "Women Fashion", color: "#FFEAA7" },
];

const mockUsers = [
  { id: "alice", name: "Alice Johnson" },
  { id: "bob", name: "Bob Smith" },
  { id: "charlie", name: "Charlie Brown" },
  { id: "diana", name: "Diana Prince" },
];

const mockProducts = Array.from({ length: 50 }, (_, i) => ({
  id: `product-${i + 1}`,
  name: `Product ${i + 1}`,
}));

/* ------------------ FAKE API ------------------ */

const simulateFetch = (query: string, data: any[]) =>
  new Promise<any[]>((resolve) => {
    setTimeout(() => {
      resolve(
        data.filter((d) =>
          d.name.toLowerCase().includes(query.toLowerCase())
        )
      );
    }, 600);
  });

/* ------------------ DEMO ------------------ */

export default function DropdownWithChipsDemo() {
  const [basic, setBasic] = useState<string[]>([]);
  const [colored, setColored] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [limited, setLimited] = useState<string[]>([]);
  const [products, setProducts] = useState<string[]>([]);
  const [errorValue, setErrorValue] = useState<string[]>([]);
  const [successValue, setSuccessValue] = useState<string[]>(["Summer Collection"]);

  const [visibleProducts, setVisibleProducts] = useState(mockProducts.slice(0, 10));
  const [page, setPage] = useState(1);

  const loadMoreProducts = () => {
    const next = page + 1;
    setVisibleProducts(mockProducts.slice(0, next * 10));
    setPage(next);
  };

  return (
    <div className="p-10 space-y-10 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-center">
        DropdownWithChips – Updated Demo ✅
      </h1>

      {/* 1. BASIC */}
      <DropdownWithChips
        label="Basic Usage"
        options={mockTags}
        labelAccessor="name"
        value={basic}
        onChange={setBasic}
        helperText="Simple static dropdown"
      />

      {/* 2. CUSTOM CHIP RENDER */}
      <DropdownWithChips
        label="Colored Chips"
        options={mockTags}
        labelAccessor="name"
        value={colored}
        onChange={setColored}
        renderChip={(value, onRemove) => {
          const tag = mockTags.find((t) => t.name === value);
          return (
            <div
              className="flex items-center gap-2 px-3 py-1 rounded-full text-white text-sm"
              style={{ backgroundColor: tag?.color || "#000" }}
            >
              {value}
              <button onClick={onRemove}>
                <X size={12} />
              </button>
            </div>
          );
        }}
      />

      {/* 3. ASYNC SEARCH */}
      <DropdownWithChips
        label="Async Users"
        fetchOptions={(q) => simulateFetch(q, mockUsers)}
        labelAccessor="name"
        value={users}
        onChange={setUsers}
        helperText="Debounced API search"
      />

      {/* 4. MAX CHIPS */}
      <DropdownWithChips
        label="Max 2 Tags"
        options={mockTags}
        labelAccessor="name"
        value={limited}
        onChange={setLimited}
        maxChips={2}
      />

      {/* 5. INFINITE SCROLL */}
      <DropdownWithChips
        label="Products"
        options={visibleProducts}
        labelAccessor="name"
        value={products}
        onChange={setProducts}
        hasMore={visibleProducts.length < mockProducts.length}
        onLoadMore={loadMoreProducts}
      />

      {/* 6. ERROR */}
      <DropdownWithChips
        label="Error Example"
        options={mockTags}
        labelAccessor="name"
        value={errorValue}
        onChange={setErrorValue}
        error="At least one tag is required"
      />

      {/* 7. SUCCESS */}
      <DropdownWithChips
        label="Success Example"
        options={mockTags}
        labelAccessor="name"
        value={successValue}
        onChange={setSuccessValue}
        success
        helperText="Looks good!"
      />
    </div>
  );
}
