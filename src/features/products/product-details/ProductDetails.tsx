import Dropdown from "@/components/base/Dropdown";
import React, { useState } from "react";
import { useProductDetailsQuery } from "../product-form/product-header/api/queryHooks";

// Image Gallery Component
const ImageGallery: React.FC<{ images: string[] }> = ({ images }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images || images.length === 0) {
    return (
      <div className="w-full aspect-square bg-gray-200 rounded-lg flex items-center justify-center">
        <span className="text-gray-400">No images available</span>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Main Image */}
      <div className="w-full aspect-square bg-gray-200 rounded-lg overflow-hidden">
        <img
          src={images[selectedImage]}
          alt="Product"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Thumbnail Strip */}
      <div className="flex gap-2 overflow-x-auto">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelectedImage(index)}
            className={`w-20 h-20 flex-shrink-0 rounded-lg overflow-hidden border-2 transition-all ${
              selectedImage === index
                ? "border-primary"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <img
              src={img}
              alt={`Thumbnail ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

// Info Row Component
const InfoRow: React.FC<{ label: string; value: string | React.ReactNode; className?: string }> = ({
  label,
  value,
  className = "",
}) => (
  <div className={`flex items-center justify-between py-2 ${className}`}>
    <span className="text-sm text-gray-600">{label}</span>
    <span className="text-sm font-medium text-gray-900">{value}</span>
  </div>
);

// Section Card Component
const SectionCard: React.FC<{ children: React.ReactNode; className?: string }> = ({
  children,
  className = "",
}) => (
  <div className={`bg-gray-50 rounded-xl p-4 space-y-2 ${className}`}>
    {children}
  </div>
);

// Main Product Details Component
interface ProductDetailsProps {
  productId: string;
  product?: any; // Replace with your actual product type
  isLoading?: boolean;
}

const ProductDetails = ({ productId }: {productId:string}) => {
  const [selectedVariantId, setSelectedVariantId] = useState<string>("");
  const [isBreakdownOpen, setIsBreakdownOpen] = useState(false);

  const {data: product, isLoading} = useProductDetailsQuery(productId)

  // Initialize selected variant
  React.useEffect(() => {
    if (product?.variants && product.variants.length > 0 && !selectedVariantId) {
      setSelectedVariantId(product.variants[0].id);
    }
  }, [product, selectedVariantId]);

  if (isLoading) {
    return <div className="w-full h-96 bg-gray-100 animate-pulse rounded-xl" />;
  }

  if (!product) {
    return (
      <div className="w-full p-6 text-center text-gray-500">
        Product not found
      </div>
    );
  }

  // Get selected variant
  const selectedVariant = product.variants?.find((v: any) => v.id === selectedVariantId) || product.variants?.[0];

  // Build variant options for dropdown
  const variantOptions = product.variants?.map((variant: any) => {
    const attributes = variant.attributes || {};
    const labels: string[] = [];
    
    // Build label from attributes
    Object.entries(attributes).forEach(([key, val]: [string, any]) => {
      const displayValue = typeof val === "object" && val?.name ? val.name : String(val);
      labels.push(displayValue);
    });

    return {
      value: variant.id,
      label: labels.length > 0 ? labels.join(" / ") : variant.aavakSku || "Variant",
    };
  }) || [];

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

  // Get color from variant attributes
  const getColorInfo = () => {
    if (!selectedVariant?.attributes?.color) return null;
    const color = selectedVariant.attributes.color;
    return typeof color === "object" ? color : { name: color, value: color };
  };

  const colorInfo = getColorInfo();

  // Build breakdown items from selected variant
//   const breakdownItems = selectedVariant
//     ? [
//         {
//           label: "Selling Price",
//           local: (selectedVariant.sellingPrice || 0) / 100,
//           regional: (selectedVariant.sellingPrice || 0) / 100,
//           national: (selectedVariant.sellingPrice || 0) / 100,
//         },
//         {
//           label: "Customer will be charged for shipping",
//           local: (selectedVariant.deliveryCharges?.local?.cost || 0) / 100,
//           regional: (selectedVariant.deliveryCharges?.regional?.cost || 0) / 100,
//           national: (selectedVariant.deliveryCharges?.national?.cost || 0) / 100,
//         },
//         {
//           label: "Settlement Price",
//           local: (selectedVariant.calculatedPricing?.onLocal || 0) / 100,
//           regional: (selectedVariant.calculatedPricing?.onRegional || 0) / 100,
//           national: (selectedVariant.calculatedPricing?.onNational || 0) / 100,
//         },
//       ]
//     : [];

  return (
    <div className="w-full bg-white p-6">
      <div className="grid grid-cols-[280px,1fr,320px] gap-6">
        {/* Left Column - Image Gallery */}
        <div>
          <ImageGallery images={product.mediaUrls || []} />
        </div>

        {/* Middle Column - Product Details */}
        <div className="space-y-4">
          {/* Variations Dropdown */}
          {product.hasVariants && variantOptions.length > 0 && (
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">Variations</label>
              <Dropdown
                options={variantOptions}
                value={selectedVariantId}
                onChange={setSelectedVariantId}
                placeholder="Select variation"
              />
            </div>
          )}

          {/* Product Name */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
            <div className="flex items-center gap-2">
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                product.status === "approved" ? "bg-green-100 text-green-700" :
                product.status === "rejected" ? "bg-red-100 text-red-700" :
                "bg-gray-100 text-gray-700"
              }`}>
                {product.status}
              </span>
            </div>
          </div>

          {/* Model & SKU */}
          {(product.modelNumber || selectedVariant?.aavakSku) && (
            <SectionCard>
              {product.modelNumber && <InfoRow label="Model Number" value={product.modelNumber} />}
              {selectedVariant?.aavakSku && <InfoRow label="Aavak SKU" value={selectedVariant.aavakSku} />}
            </SectionCard>
          )}

          {/* Variant Size & Color */}
          {selectedVariant && (selectedVariant.attributes?.size || colorInfo) && (
            <SectionCard>
              {selectedVariant.attributes?.size && (
                <InfoRow 
                  label="Size" 
                  value={typeof selectedVariant.attributes.size === "object" ? selectedVariant.attributes.size : selectedVariant.attributes.size} 
                />
              )}
              {colorInfo && (
                <InfoRow
                  label="Colour"
                  value={
                    <div className="flex items-center gap-2">
                      <div 
                        className="w-4 h-4 rounded-full border border-gray-300" 
                        style={{ backgroundColor: colorInfo.value || colorInfo.name }}
                      />
                      <span>{colorInfo.name}</span>
                    </div>
                  }
                />
              )}
            </SectionCard>
          )}

          {/* Fragile & Quantity */}
          {(product.isFragile !== undefined || selectedVariant?.quantity !== undefined) && (
            <SectionCard>
              <InfoRow label="Fragile Product" value={product.isFragile ? "YES" : "NO"} />
              {selectedVariant?.quantity !== undefined && (
                <InfoRow label="Quantity" value={String(selectedVariant.quantity)} />
              )}
            </SectionCard>
          )}

          {/* Brand Info */}
          {product.hasBrand && product.brandName && (
            <SectionCard>
              <div className="flex items-start gap-3">
                {product.brandLogoUrl ? (
                  <img 
                    src={product.brandLogoUrl} 
                    alt={product.brandName}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-gray-300 flex items-center justify-center text-gray-600 font-semibold text-xs">
                    {product.brandName.substring(0, 2).toUpperCase()}
                  </div>
                )}
                <div className="flex-1">
                  <InfoRow label="Brand Name" value={product.brandName} />
                </div>
              </div>
            </SectionCard>
          )}

          {/* Manufacturer Info */}
          {(product.manufacturerName || product.packerDetails) && (
            <SectionCard>
              {product.manufacturerName && (
                <InfoRow label="Manufacturer Name" value={product.manufacturerName} />
              )}
              {product.packerDetails && (
                <InfoRow label="Packer Details" value={product.packerDetails} />
              )}
            </SectionCard>
          )}

          {/* Dates */}
          <SectionCard>
            <InfoRow label="Created At" value={formatDate(product.createdAt)} />
            <InfoRow label="Updated At" value={formatDate(product.updatedAt)} />
            {product.approvedAt && (
              <InfoRow label="Approved At" value={formatDate(product.approvedAt)} />
            )}
          </SectionCard>

          {/* Importer Details */}
          {product.importerDetails && (
            <SectionCard>
              <InfoRow label="Importer Details" value={product.importerDetails} />
            </SectionCard>
          )}

          {/* Description */}
          {product.description && (
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-2 block">Description</label>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600 leading-relaxed">{product.description}</p>
              </div>
            </div>
          )}

          {/* Bullet Points */}
          {product.bulletPoints && product.bulletPoints.length > 0 && (
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-2 block">Key Features</label>
              <div className="bg-gray-50 rounded-xl p-4">
                <ul className="space-y-2">
                  {product.bulletPoints.map((point: string, index: number) => (
                    <li key={index} className="text-sm text-gray-600 flex items-start gap-2">
                      <span className="text-primary mt-1">•</span>
                      <span className="flex-1">{point}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-2 block">Tags</label>
              <div className="flex flex-wrap gap-2">
                {product.tags.map((tag: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1.5 bg-gray-100 text-sm text-gray-700 rounded-lg"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Category Path */}
          {product.categoryPath && product.categoryPath.length > 0 && (
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-2 block">Category</label>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-600">
                  {product.categoryPath.join(" > ")}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Codes & Pricing */}
        <div className="space-y-4">
          {/* External SKU & CESS */}
          {(product.externalSku || product.cessCode) && (
            <SectionCard>
              {product.externalSku && <InfoRow label="External SKU" value={product.externalSku} />}
              {product.cessCode && <InfoRow label="CESS Code" value={product.cessCode} />}
            </SectionCard>
          )}

          {/* HSN & GST */}
          {(product.hsnCode || product.gstRate !== null) && (
            <SectionCard>
              {product.hsnCode && <InfoRow label="HSN Code" value={product.hsnCode} />}
              {product.gstRate !== null && <InfoRow label="GST Rate" value={`${product.gstRate}%`} />}
            </SectionCard>
          )}

          {/* Variant External SKU */}
          {selectedVariant?.sellerSku && (
            <SectionCard>
              <InfoRow label="Variant SKU" value={selectedVariant.sellerSku} />
            </SectionCard>
          )}

          {/* Pricing Information */}
          {selectedVariant && (selectedVariant.mrp || selectedVariant.sellingPrice) && (
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-3 block">
                Pricing Information
              </label>
              <SectionCard>
                {selectedVariant.mrp && (
                  <InfoRow label="MRP" value={`₹ ${(Number(selectedVariant.mrp)).toFixed(2)}`} />
                )}
                {selectedVariant.sellingPrice && (
                  <InfoRow label="Selling Price" value={`₹ ${(Number(selectedVariant.sellingPrice)).toFixed(2)}`} />
                )}
                {selectedVariant.aavakCoinsPrice && (
                  <InfoRow label="Aavak Coins Price" value={`₹ ${(selectedVariant.aavakCoinsPrice / 100).toFixed(2)}`} />
                )}
              </SectionCard>
            </div>
          )}

          {/* Shipping Charges */}
          {selectedVariant?.deliveryCharges && (
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-3 block">
                Delivery Charges
              </label>
              <SectionCard>
                <InfoRow 
                  label="Local" 
                  value={`₹ ${(selectedVariant.deliveryCharges.local?.cost || 0) / 100}`} 
                />
                <InfoRow 
                  label="Regional" 
                  value={`₹ ${(selectedVariant.deliveryCharges.regional?.cost || 0) / 100}`} 
                />
                <InfoRow 
                  label="National" 
                  value={`₹ ${(selectedVariant.deliveryCharges.national?.cost || 0) / 100}`} 
                />
              </SectionCard>
            </div>
          )}

          {/* Dimensions */}
          {selectedVariant?.dimensions && (
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-3 block">
                Dimensions
              </label>
              <SectionCard>
                <InfoRow label="Length" value={`${selectedVariant.dimensions.length} cm`} />
                <InfoRow label="Width" value={`${selectedVariant.dimensions.width} cm`} />
                <InfoRow label="Height" value={`${selectedVariant.dimensions.height} cm`} />
                <InfoRow label="Weight" value={`${selectedVariant.dimensions.weight} kg`} />
              </SectionCard>
            </div>
          )}

          {/* Settlement Price */}
          {/* {selectedVariant?.calculatedPricing && (
            <div>
              <div className="flex items-center justify-between mb-3">
                <label className="text-sm font-semibold text-gray-900">Settlement Price</label>
                <button
                  onClick={() => setIsBreakdownOpen(true)}
                  className="text-sm text-primary hover:underline flex items-center gap-1"
                >
                  Breakdown
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </button>
              </div>
              <SectionCard>
                <InfoRow 
                  label="Local" 
                  value={`₹ ${(selectedVariant.calculatedPricing.onLocal / 100).toFixed(2)}`} 
                />
                <InfoRow 
                  label="Regional" 
                  value={`₹ ${(selectedVariant.calculatedPricing.onRegional / 100).toFixed(2)}`} 
                />
                <InfoRow 
                  label="National" 
                  value={`₹ ${(selectedVariant.calculatedPricing.onNational / 100).toFixed(2)}`} 
                />
                {selectedVariant.calculatedPricing.userGets !== undefined && (
                  <InfoRow 
                    label="User Gets (Coins)" 
                    value={String(selectedVariant.calculatedPricing.userGets)} 
                  />
                )}
              </SectionCard>
            </div>
          )} */}

          {/* Admin Notes */}
          {product.adminNotes && (
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-3 block">Admin Notes</label>
              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
                <p className="text-sm text-gray-700">{product.adminNotes}</p>
              </div>
            </div>
          )}

          {/* Rejection Info */}
          {product.status === "rejected" && product.rejectionReason && (
            <div>
              <label className="text-sm font-semibold text-gray-900 mb-3 block">Rejection Details</label>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 space-y-2">
                <p className="text-sm text-red-700">{product.rejectionReason}</p>
                {product.rejectedFields && product.rejectedFields.length > 0 && (
                  <div className="pt-2 border-t border-red-200">
                    <p className="text-xs font-medium text-red-600 mb-1">Rejected Fields:</p>
                    <div className="flex flex-wrap gap-1">
                      {product.rejectedFields.map((field: string, index: number) => (
                        <span key={index} className="px-2 py-0.5 bg-red-100 text-xs text-red-700 rounded">
                          {field}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Breakdown Dialog */}
      {/* <BreakdownDialog
        isOpen={isBreakdownOpen}
        onClose={() => setIsBreakdownOpen(false)}
        items={breakdownItems}
      /> */}
    </div>
  );
};

export default ProductDetails;