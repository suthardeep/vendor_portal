import { useMediaDialogStore } from "@/store/useMediaDialogStore";
import React, { useState, forwardRef } from "react";
import {Icon} from "./Icon";

// ============================================================================
// BASE IMAGE COMPONENT - Lightweight, use everywhere
// ============================================================================

export interface ImageProps {
  src: string;
  alt: string;
  width?: string | number;
  height?: string | number;
  aspectRatio?: string;
  className?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  rounded?: boolean | "sm" | "md" | "lg" | "xl" | "full";
  loading?: "lazy" | "eager";
  showLoadingSpinner?: boolean;
  expandOnClick?: boolean;
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  fadeIn?: boolean;
  scaleOnHover?: boolean;
}

export const Image = forwardRef<HTMLImageElement, ImageProps>(({
  src,
  alt,
  width,
  height,
  aspectRatio,
  className = "",
  objectFit = "cover",
  rounded = false,
  loading = "lazy",
  showLoadingSpinner = true,
  expandOnClick = false,
  onLoad,
  onError,
  onClick,
  fadeIn = true,
  scaleOnHover = false,
}, ref) => {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const { openDialog } = useMediaDialogStore();

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    onLoad?.(e);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setIsLoading(false);
    setHasError(true);
    onError?.(e);
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (expandOnClick) {
      openDialog([{ src, type: "image", alt }]);
    }
    onClick?.(e);
  };

  const getRoundedClass = () => {
    if (!rounded) return "";
    if (rounded === true) return "rounded-md";
    return `rounded-${rounded}`;
  };

  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    aspectRatio: aspectRatio,
  };

  const roundedClass = getRoundedClass();

  return (
    <div
      className={`relative inline-block ${roundedClass}`}
      style={containerStyle}
      onClick={handleClick}
    >
      <img
        ref={ref}
        src={src}
        alt={alt}
        loading={loading}
        onLoad={handleImageLoad}
        onError={handleImageError}
        className={`
          w-full h-full object-${objectFit} ${roundedClass} ${className}
          transition-all duration-300
          ${fadeIn ? (isLoading ? 'opacity-0' : 'opacity-100') : ''}
          ${scaleOnHover ? 'hover:scale-105' : ''}
          ${expandOnClick ? 'cursor-pointer' : ''}
        `}
        draggable={false}
      />

      {isLoading && showLoadingSpinner && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80">
          <Icon name="Loader2" className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {hasError && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100 p-4">
          <p className="text-sm text-gray-600 text-center">Failed to load image</p>
        </div>
      )}
    </div>
  );
});

Image.displayName = "Image";
