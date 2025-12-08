import React, { useState } from 'react';
import { FileIcon, FileText, Plus, Video, X } from 'lucide-react';
import { cn } from '@/utils/helpers';
import { MediaGallery, type MediaItem } from './MediaGallery';

interface MediaPickerProps {
  // Data
  value?: MediaItem[];
  onChange: (items: MediaItem[]) => void;
  
  // Appearance
  className?: string;
  containerClassName?: string;
  previewGridClassName?: string; // e.g. "grid-cols-2 md:grid-cols-4"
  itemClassName?: string;
  
  // Config
  maxFiles?: number;
  maxHeight?: string; // e.g. "max-h-[300px]"
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  value = [],
  onChange,
  className,
  containerClassName,
  previewGridClassName = "grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
  itemClassName,
  maxHeight = "max-h-[400px]",
}) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  const handleRemove = (id: string) => {
    onChange(value.filter(i => i.id !== id));
  };

  const handleConfirm = (newItems: MediaItem[]) => {
    // Append or Replace? Usually append in these pickers, but let's filter duplicates
    const existingIds = new Set(value.map(v => v.id));
    const uniqueNew = newItems.filter(i => !existingIds.has(i.id));
    onChange([...value, ...uniqueNew]);
    setIsGalleryOpen(false);
  };

  // MediaPicker Component - Return Statement Only

return (
  <div className={cn("w-full", className)}>
    <div 
      className={cn(
        "w-full overflow-y-auto p-2", 
        maxHeight,
        containerClassName
      )}
    >
      <div className={cn("grid gap-3", previewGridClassName)}>
        {/* Selected Items */}
        {value.map((item) => (
          <div 
            key={item.id} 
            className={cn(
              "relative group aspect-square rounded-xl border-2 border-input-border overflow-hidden bg-base-2 hover:border-primary/50 transition-all shadow-sm hover:shadow-md",
              itemClassName
            )}
          >
            {/* Media Preview */}
            {item.mediaType === 'image' ? (
              <img 
                src={item.url} 
                alt={item.name} 
                className="w-full h-full object-cover" 
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center bg-gradient-to-br from-base-2 to-base-3">
                <div className="w-12 h-12 rounded-lg bg-base-1 flex items-center justify-center mb-2">
                  {item.mediaType === 'video' && <Video className="w-6 h-6 text-blue-500" />}
                  {item.mediaType === 'pdf' && <FileText className="w-6 h-6 text-red-500" />}
                  {!item.mediaType && <FileIcon className="w-6 h-6 text-body-content/50" />}
                </div>
                <span className="text-[10px] font-bold uppercase text-body-content/60 bg-base-2 px-2 py-1 rounded-full">{item.mediaType || 'file'}</span>
              </div>
            )}
            
            {/* File Name Tooltip on Hover */}
            <div className="absolute inset-x-0 bottom-0 p-2 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
              <p className="text-white text-[10px] font-medium truncate">{item.name}</p>
            </div>

            {/* Remove Button */}
            <button 
              onClick={() => handleRemove(item.id)}
              className="absolute top-2 right-2 p-1.5 bg-error text-error-content rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-lg hover:scale-110"
              aria-label="Remove item"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}

        {/* Add Button */}
        <button
          type="button"
          onClick={() => setIsGalleryOpen(true)}
          className={cn(
            "aspect-square rounded-xl border-2 border-dashed border-input-border flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all text-body-content/50 hover:text-primary cursor-pointer bg-gradient-to-br from-base-2 to-base-3 group",
            itemClassName
          )}
        >
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
            <Plus className="w-6 h-6 text-primary" />
          </div>
          <span className="text-xs font-semibold">Add Media</span>
        </button>
      </div>
    </div>

    <MediaGallery 
      isOpen={isGalleryOpen} 
      onClose={() => setIsGalleryOpen(false)} 
      onConfirm={handleConfirm}
    />
  </div>
);
};