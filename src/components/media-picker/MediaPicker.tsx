// MediaPicker.tsx
import React, { useState } from "react";
import { File, FileText, Plus, Video, X, RefreshCw } from "lucide-react";
import { getMediaPickerValue, MediaValue } from "./utils/getMediaPickerValue";
import { MediaItem, MinimalMediaProps } from "./types/media.types";
import { cn, getFileType } from "@/utils/helpers";
import { MediaGallery } from "./components/MediaGallery";
import { Button } from "../base/Button";
import { cva, type VariantProps } from "class-variance-authority";
import { Label } from "../base/Label";
import { ErrorText } from "../base/ErrorText";
import { useMediaDialogStore } from "@/store/useMediaDialogStore";

// Layout Configuration Types
type LayoutOrientation = "horizontal" | "vertical" | "grid";
type ScrollDirection = "horizontal" | "vertical" | "both" | "none";

interface GridConfig {
  cols?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  colsSm?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  colsMd?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  colsLg?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  colsXl?: 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12;
  gap?: "gap-0" | "gap-1" | "gap-2" | "gap-3" | "gap-4" | "gap-5" | "gap-6" | "gap-8";
  autoFit?: boolean;
  minItemWidth?: string;
}

interface SizeConfig {
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  minWidth?: string;
  minHeight?: string;
  aspectRatio?: "square" | "video" | "portrait" | "landscape" | "auto" | string;
}

interface IconConfig {
  size?: "xs" | "sm" | "md" | "lg" | "xl" | "auto";
  customSize?: string;
}

interface TextConfig {
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  customSize?: string;
  show?: boolean;
}

// CVA Variants
const iconVariants = cva("transition-all duration-300", {
  variants: {
    size: {
      xs: "w-3 h-3",
      sm: "w-4 h-4",
      md: "w-5 h-5",
      lg: "w-6 h-6",
      xl: "w-8 h-8",
      auto: "w-6 h-6",
    },
  },
  defaultVariants: {
    size: "auto",
  },
});

const textVariants = cva("font-semibold tracking-wide", {
  variants: {
    size: {
      xs: "text-[9px]",
      sm: "text-xs",
      md: "text-sm",
      lg: "text-base",
      xl: "text-lg",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

const aspectRatioVariants = cva("", {
  variants: {
    ratio: {
      square: "aspect-square",
      video: "aspect-video",
      portrait: "aspect-[3/4]",
      landscape: "aspect-[4/3]",
      auto: "",
    },
  },
  defaultVariants: {
    ratio: "square",
  },
});

// const defaultHeight = "h-[20dvh]";

interface MediaPickerProps {
  label?: string;
  value?: MinimalMediaProps[];
  ids: MediaValue;
  urls: MediaValue;
  onChange: (items: MinimalMediaProps[]) => void;

  // Layout Configuration
  orientation?: LayoutOrientation;
  gridConfig?: GridConfig;
  sizeConfig?: SizeConfig;
  scroll?: ScrollDirection;

  // Item Configuration
  itemClassName?: string;
  itemSizeConfig?: SizeConfig;

  // Icon & Text Configuration
  iconConfig?: IconConfig;
  textConfig?: TextConfig;

  // Existing Props
  className?: string;
  containerClassName?: string;
  maxFiles?: number;
  addButtonWidthPercent?: number;
  required?: boolean;
  error?: string;
}

export const MediaPicker: React.FC<MediaPickerProps> = ({
  label = "Upload File",
  value = [],
  ids,
  urls,
  onChange,

  // Layout defaults
  orientation = "horizontal",
  gridConfig = {
    cols: 3,
    gap: "gap-3",
  },
  sizeConfig = {
    width: "w-full",
    maxHeight: "max-h-[20dvh]",
  },
  scroll = "vertical",

  // Item defaults
  itemClassName,
  itemSizeConfig = {
    aspectRatio: "square",
  },

  // Icon & Text defaults
  iconConfig = {
    size: "auto",
  },
  textConfig = {
    size: "sm",
    show: true,
  },

  // Existing props
  className,
  containerClassName,
  maxFiles = Infinity,
  addButtonWidthPercent = 50,
  required = false,
  error,
}) => {
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);
  const cleanedValue = value.length > 0 ? value : getMediaPickerValue(ids, urls);
  const mediaDialog = useMediaDialogStore();


  const handleRemove = (s3Url: string) => {
    onChange(cleanedValue.filter((i) => i.s3Url !== s3Url));
  };

  const handlePreview = (item: MinimalMediaProps, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!item.s3Url) return;
    // find index of clicked item among displayItems (only files when inside folder)
    const files = (value as MinimalMediaProps[]).filter((i) => !!i && (i as any).id);
    const idx = files.findIndex((f) => f.id === item.id);

    const fileType = getFileType(item.s3Url);

    // Build items array (filter out entries without s3Url) and preserve each item's own type
    const items = files
      .filter((f) => f.s3Url)
      .map((f) => ({
        src: f.s3Url,
        type:
          fileType === "image" || fileType === "video" || fileType === "pdf"
            ? (fileType as any)
            : ("image" as any),
        alt: f.s3Url,
        title: f.s3Url,
      }));

    // If clicked item not found in the current list, open dialog with clicked item first
    if (idx === -1) {
      mediaDialog.openDialog([
        { src: item.s3Url, type: fileType as any, alt: item.s3Url, title: item.s3Url },
        ...items,
      ]);
      return;
    }

    // Rotate items so clicked item becomes first in the preview (circular)
    const rotateIndex = items.findIndex((it) => it.src === item.s3Url);
    const start = rotateIndex >= 0 ? rotateIndex : 0;
    const ordered = [...items.slice(start), ...items.slice(0, start)];

    mediaDialog.openDialog(ordered);
  };

  const handleConfirm = (newItems: MediaItem[]) => {
    const existingUrls = new Set(cleanedValue.map((v) => v.s3Url));
    console.log("exisrting urls", existingUrls)
    const uniqueNew = newItems.filter((i) => !existingUrls.has(i.s3Url));
    const combinedItems = [...cleanedValue, ...uniqueNew];
    const limitedItems = maxFiles !== Infinity ? combinedItems.slice(0, maxFiles) : combinedItems;
    onChange(limitedItems);
    setIsGalleryOpen(false);
  };

  const hasSelection = cleanedValue.length > 0;
  const canAddMore = cleanedValue.length < maxFiles;
  const isSingleMode = maxFiles === 1;

  // Build size classes safely
  const buildSizeClasses = (config: SizeConfig): string => {
    const classes: string[] = [];

    if (config.width) classes.push(config.width);
    if (config.height) classes.push(config.height);
    if (config.maxWidth) classes.push(config.maxWidth);
    if (config.maxHeight) classes.push(config.maxHeight);
    if (config.minWidth) classes.push(config.minWidth);
    if (config.minHeight) classes.push(config.minHeight);

    // Handle aspect ratio
    if (config.aspectRatio) {
      if (["square", "video", "portrait", "landscape", "auto"].includes(config.aspectRatio)) {
        classes.push(
          aspectRatioVariants({
            ratio: config.aspectRatio as "square" | "video" | "portrait" | "landscape" | "auto",
          })
        );
      } else {
        classes.push(config.aspectRatio);
      }
    }

    return classes.join(" ");
  };

  // Build scroll classes
  const getScrollClasses = (): string => {
    const scrollMap: Record<ScrollDirection, string> = {
      horizontal: "overflow-x-auto overflow-y-hidden",
      vertical: "overflow-y-auto overflow-x-hidden",
      both: "overflow-auto",
      none: "overflow-hidden",
    };
    return scrollMap[scroll];
  };

  // Build grid classes
  const getGridClasses = (): string => {
    if (orientation !== "grid") return "";

    const { cols, colsSm, colsMd, colsLg, colsXl, gap, autoFit, minItemWidth } = gridConfig;

    if (autoFit && minItemWidth) {
      return cn("grid", gap || "gap-3");
    }

    const gridCols: string[] = [];
    if (cols) gridCols.push(`grid-cols-${cols}`);
    if (colsSm) gridCols.push(`sm:grid-cols-${colsSm}`);
    if (colsMd) gridCols.push(`md:grid-cols-${colsMd}`);
    if (colsLg) gridCols.push(`lg:grid-cols-${colsLg}`);
    if (colsXl) gridCols.push(`xl:grid-cols-${colsXl}`);

    return cn("grid", ...gridCols, gap || "gap-3");
  };

  // Get icon classes
  const getIconClasses = (defaultSize?: string): string => {
    if (iconConfig.customSize) return iconConfig.customSize;
    return iconVariants({ size: iconConfig.size || "auto" });
  };

  // Get text classes
  const getTextClasses = (): string => {
    if (textConfig.customSize) return textConfig.customSize;
    return textVariants({ size: textConfig.size || "sm" });
  };

  // Container wrapper class
  const getContainerWrapperClass = (): string => {
    if (orientation === "horizontal") {
      return cn("flex", gridConfig.gap || "gap-3");
    }
    if (orientation === "vertical") {
      return cn("flex flex-col", gridConfig.gap || "gap-3");
    }
    return getGridClasses();
  };

  // Render item content
  const renderItemContent = (item: MinimalMediaProps) => {
    const fileType = getFileType(item.s3Url);

    if (fileType === "image") {
      return (
        <img
          src={item.s3Url}
          onClick={(e:any)=>handlePreview(item, e)}
          alt={item.s3Url || "Selected media"}
          className="w-full h-full rounded-2xl object-cover transition-transform duration-300 group-hover:scale-105"
        />
      );
    }

    return (
      <div onClick={(e:any)=>handlePreview(item, e)} className="w-full h-full rounded-2xl flex flex-col items-center justify-center p-4 text-center bg-linear-to-br from-gray-100 via-gray-50 to-gray-100">
        <div className="w-16 h-16 rounded-xl bg-linear-to-br from-white to-gray-200 flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform duration-300">
          {fileType === "video" && <Video className={cn(getIconClasses(), "text-primary")} />}
          {fileType === "pdf" && <FileText className={cn(getIconClasses(), "text-red-500")} />}
          {(!fileType || fileType === "other") && <File className={cn(getIconClasses(), "text-gray-400")} />}
        </div>
        {textConfig.show && (
          <span
            className={cn(
              getTextClasses(),
              "uppercase tracking-wide text-gray-600 bg-white/80 px-3 py-1.5 rounded-full backdrop-blur-sm"
            )}
          >
            {fileType || "file"}
          </span>
        )}
      </div>
    );
  };

  // Single mode with horizontal layout
  // if (isSingleMode && hasSelection && orientation === "horizontal") {
  //   const selectedWidthPercent = 100 - addButtonWidthPercent;

  //   return (
  //     <div className="space-y-1">
  //       {label && <Label required={required}>{label}</Label>}
  //       <div className={cn(buildSizeClasses(sizeConfig), className)}>
  //         <div className={cn(getScrollClasses(), buildSizeClasses(sizeConfig), containerClassName)}>
  //           <div className={cn("flex", gridConfig.gap || "gap-3")}>
  //             {/* Selected Item */}
  //             <div
  //               className={cn(
  //                 "relative group rounded-2xl border border-gray-300 overflow-hidden bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-xl",
  //                 buildSizeClasses(itemSizeConfig),
  //                 itemClassName
  //               )}
  //               style={{ width: `${selectedWidthPercent}%` }}
  //             >
  //               <div className={itemSizeConfig.aspectRatio ? "" : "w-full h-full"}>
  //                 {renderItemContent(cleanedValue[0])}
  //               </div>

  //               <Button
  //                 onClick={() => handleRemove(cleanedValue[0].id)}
  //                 className="absolute top-2 right-2 p-1.5 bg-white/95 backdrop-blur-sm text-red-500 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-red-500 hover:text-white active:scale-95"
  //                 aria-label="Remove item"
  //               >
  //                 <X className={getIconClasses()} />
  //               </Button>
  //             </div>

  //             {/* Replace Button */}
  //             <button
  //               type="button"
  //               onClick={() => setIsGalleryOpen(true)}
  //               className={cn(
  //                 "rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:bg-primary-50 transition-all duration-300 text-gray-500 hover:text-primary cursor-pointer bg-gradient-to-br from-gray-50 via-white to-gray-50 group hover:shadow-lg active:scale-95",
  //                 gridConfig.gap || "gap-2"
  //               )}
  //               style={{ width: `${addButtonWidthPercent}%` }}
  //             >
  //               <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary-200 transition-all duration-300">
  //                 <RefreshCw className={cn(getIconClasses(), "text-primary")} />
  //               </div>
  //               {textConfig.show && <span className={getTextClasses()}>Replace</span>}
  //             </button>
  //           </div>
  //         </div>

  //         <MediaGallery
  //           isOpen={isGalleryOpen}
  //           onClose={() => setIsGalleryOpen(false)}
  //           onConfirm={handleConfirm}
  //         />
  //       </div>
  //       {error && <ErrorText>{error}</ErrorText>}
  //     </div>
  //   );
  // }

  // Normal layout (grid, horizontal, vertical)
  return (
    <div className="space-y-1">
      {label && <Label required={required}>{label}</Label>}

      <div className={cn(buildSizeClasses(sizeConfig), className)}>
        <div className={cn(getScrollClasses(), buildSizeClasses(sizeConfig), containerClassName)}>
          <div
            className={getContainerWrapperClass()}
            style={
              gridConfig.autoFit && gridConfig.minItemWidth
                ? {
                    gridTemplateColumns: `repeat(auto-fit, minmax(${gridConfig.minItemWidth}, 1fr))`,
                  }
                : undefined
            }
          >
            {/* Selected Items */}
            {cleanedValue.map((item) => {
              return (
                <div
                  key={item.id}
                  className={cn(
                    "relative group rounded-2xl overflow-hidden border border-gray-300 bg-gray-50 transition-all duration-300 shadow-sm hover:shadow-xl ",
                    "h-[20dvh]",
                    buildSizeClasses(itemSizeConfig),
                    itemClassName,
                    orientation === "horizontal" && !itemSizeConfig.width && "shrink-0",
                    orientation === "vertical" && !itemSizeConfig.height && "shrink-0"
                  )}
                >
                  {renderItemContent(item)}

                  <Button
                    onClick={() => handleRemove(item.s3Url)}
                    className="absolute top-2 right-2 p-0.5 bg-white/95 backdrop-blur-sm text-red-100 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg hover:shadow-xl hover:bg-red-100 hover:text-white active:scale-95"
                    aria-label="Remove item"
                  >
                    <X className={cn("group-hover:text-error", getIconClasses())} />
                  </Button>
                </div>
              );
            })}

            {/* Add Button */}
            {canAddMore && (
              <button
                type="button"
                onClick={() => setIsGalleryOpen(true)}
                className={cn(
                  "rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center hover:border-primary hover:bg-primary-50 transition-all duration-300 text-gray-500 hover:text-primary cursor-pointer bg-linear-to-br from-gray-50 via-white to-gray-50 group hover:shadow-lg active:scale-95",
                  "h-[20dvh]",
                  buildSizeClasses(itemSizeConfig),
                  itemClassName,
                  !hasSelection && orientation === "grid" && "col-span-full",
                  gridConfig.gap || "gap-2",
                  orientation === "horizontal" && !itemSizeConfig.width && "shrink-0",
                  orientation === "vertical" && !itemSizeConfig.height && "shrink-0"
                )}
              >
                <div className="w-12 h-12 rounded-full bg-primary-100 flex items-center justify-center group-hover:scale-110 group-hover:bg-primary-200 transition-all duration-300">
                  <Plus className={cn(getIconClasses(), "text-primary")} />
                </div>
                {textConfig.show && <span className={getTextClasses()}>Add Media</span>}
              </button>
            )}
          </div>
        </div>

        <MediaGallery
          isOpen={isGalleryOpen}
          onClose={() => setIsGalleryOpen(false)}
          onConfirm={handleConfirm}
          maxFiles={maxFiles-cleanedValue.length}
        />
      </div>
      {error && <ErrorText>{error}</ErrorText>}
    </div>
  );
};
