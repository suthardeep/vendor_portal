import React, { useState } from 'react';
import { Save, ArrowLeft } from 'lucide-react';
import { MediaPicker } from './MediaPicker'; // Adjust path
import { type MediaItem } from './MediaGallery'; // Adjust path

export default function DemoProductPage() {
  // --- State Management ---
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
  });

  const [featuredImage, setFeaturedImage] = useState<MediaItem[]>([]);
  const [galleryImages, setGalleryImages] = useState<MediaItem[]>([]);

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column: Media Managers */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Case 1: Featured Image (Single File Logic) */}
            <div className="bg-base-1 rounded-2xl shadow-sm border border-input-border p-6">
              <h3 className="font-bold text-base-content mb-1">Featured Image</h3>
              <p className="text-xs text-base-content/50 mb-4">Used for thumbnails and banners.</p>
              
              <MediaPicker 
                value={featuredImage}
                onChange={(items) => {
                  // Logic to enforce single selection: always take the last added item
                  setFeaturedImage(items.length > 0 ? [items[items.length - 1]] : []);
                }}
                // Custom Styling to look like a single upload box
                containerClassName="h-auto"
                previewGridClassName="grid-cols-1" 
                itemClassName="aspect-video" // Make it rectangular
                maxHeight="max-h-none"
              />
            </div>

            {/* Case 2: Product Gallery (Multi File) */}
            <div className="bg-base-1 rounded-2xl shadow-sm border border-input-border p-6">
              <div className="flex items-center justify-between mb-1">
                <h3 className="font-bold text-base-content">Product Gallery</h3>
                <span className="badge badge-sm badge-ghost">{galleryImages.length} items</span>
              </div>
              <p className="text-xs text-base-content/50 mb-4">Add additional images, videos or PDFs.</p>
              
              <MediaPicker 
                value={galleryImages}
                onChange={setGalleryImages}
                // Custom Grid Layout for Gallery
                previewGridClassName="grid-cols-3 gap-2"
                itemClassName="rounded-lg"
                maxHeight="max-h-[300px]"
              />
            </div>
          </div>

          {/* Right Column: Basic Info */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-base-1 rounded-2xl shadow-sm border border-input-border p-8">
              <h3 className="text-lg font-bold mb-6 pb-4 border-b border-input-border">General Information</h3>
              
              <div className="space-y-5">
                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold">Product Title</span>
                  </label>
                  <input 
                    type="text" 
                    placeholder="e.g. Premium Cotton T-Shirt" 
                    className="input input-bordered w-full bg-base-1 focus:input-primary" 
                    value={formData.title}
                    onChange={(e) => setFormData({...formData, title: e.target.value})}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-semibold">Price ($)</span>
                    </label>
                    <input 
                      type="number" 
                      placeholder="0.00" 
                      className="input input-bordered w-full bg-base-1 focus:input-primary"
                      value={formData.price}
                      onChange={(e) => setFormData({...formData, price: e.target.value})}
                    />
                  </div>
                  <div className="form-control w-full">
                    <label className="label">
                      <span className="label-text font-semibold">SKU</span>
                    </label>
                    <input type="text" placeholder="PROD-001" className="input input-bordered w-full bg-base-1 focus:input-primary" />
                  </div>
                </div>

                <div className="form-control w-full">
                  <label className="label">
                    <span className="label-text font-semibold">Description</span>
                  </label>
                  <textarea 
                    className="textarea textarea-bordered h-32 bg-base-1 focus:textarea-primary" 
                    placeholder="Describe your product..."
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                  ></textarea>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}