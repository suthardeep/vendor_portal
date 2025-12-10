import React, { useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { MediaPicker } from '../MediaPicker'; 
import { MediaItem, MinimalMediaProps } from '@/components/media-picker/types/media.types';

// Create a client
// const queryClient = new QueryClient();

// export default function DemoProductPageWrapper() {
//   return (
//     <QueryClientProvider client={queryClient}>
//       <DemoProductPage />
//     </QueryClientProvider>
//   );
// }

export default function DemoProductPage() {
  // --- State Management ---
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });

  const [featuredImage, setFeaturedImage] = useState<MinimalMediaProps[]>([]);
  const [galleryImages, setGalleryImages] = useState<MinimalMediaProps[]>([]);

  // --- Handlers ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form Submitted:", {
      ...formData,
      featuredImage: featuredImage[0] || null,
      gallery: galleryImages
    });
    alert("Check console for form data!");
  };

  return (
    <div className="min-h-screen bg-base-2 p-4 md:p-8 font-sans text-base-content">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button className="btn btn-circle btn-ghost btn-sm">
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-base-content">Add New Product</h1>
              <p className="text-sm text-base-content/60">Create a new item for your store</p>
            </div>
          </div>
          <div className="flex gap-2">
            <button className="btn btn-ghost">Discard</button>
            <button onClick={handleSubmit} className="btn btn-primary gap-2">
              <Save className="w-4 h-4" /> Save Product
            </button>
          </div>
        </div>

        <div className="">
          {/* Left Column: Media Managers */}
          <div className="flex justify-between">
            
            {/* Case 1: Featured Image */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-input-border p-6">
              <h3 className="font-bold text-base-content mb-1">Featured Image</h3>
              <p className="text-xs text-base-content/50 mb-4">Used for thumbnails and banners.</p>
              
              <MediaPicker 
                value={featuredImage}
                onChange={(items) => {
                  setFeaturedImage(items.length > 0 ? [items[items.length - 1]] : []);
                }}
                containerClassName="h-auto"
                previewGridClassName="grid-cols-1" 
                itemClassName="aspect-video"
                maxHeight="max-h-none"
              />
            </div>

            {/* Case 2: Product Gallery */}
            <div className="bg-white dark:bg-neutral-800 rounded-2xl shadow-sm border border-input-border p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-base-content">Product Gallery</h3>
                <span className="badge badge-sm badge-ghost">{galleryImages.length} items</span>
              </div>
              <p className="text-xs text-base-content/50 mb-4">Add additional images, videos or PDFs.</p>
              
              <MediaPicker 
                value={galleryImages}
                onChange={setGalleryImages}
                previewGridClassName="grid-cols-3 gap-2"
                itemClassName="rounded-lg"
                maxHeight="max-h-[300px]"
              />
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}