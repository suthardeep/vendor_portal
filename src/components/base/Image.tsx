import React, { useState, useEffect, useRef, useCallback, forwardRef } from "react";
import { Loader2, ZoomIn, ZoomOut, RefreshCw, Download, Maximize2 } from "lucide-react";

interface ImageProps {
  // Core props
  src: string;
  alt: string;
  
  // Ref
  ref?: React.Ref<HTMLImageElement>;
  
  // Dimensions
  width?: string | number;
  height?: string | number;
  aspectRatio?: string;
  
  // Styling
  className?: string;
  objectFit?: "contain" | "cover" | "fill" | "none" | "scale-down";
  rounded?: boolean | "none" | "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "full";
  border?: boolean;
  borderColor?: string;
  shadow?: "none" | "sm" | "md" | "lg" | "xl" | "2xl";
  
  // Loading & Error handling
  lazyLoad?: boolean;
  loading?: "lazy" | "eager";
  placeholder?: string;
  fallbackSrc?: string;
  showLoadingSpinner?: boolean;
  showErrorState?: boolean;
  retryOnError?: boolean;
  maxRetries?: number;
  
  // Interactive features
  zoomable?: boolean;
  draggable?: boolean;
  expandOnClick?: boolean;
  downloadable?: boolean;
  selectable?: boolean;
  
  // Overlay & Effects
  overlay?: React.ReactNode;
  overlayOnHover?: boolean;
  grayscale?: boolean;
  blur?: number;
  brightness?: number;
  contrast?: number;
  saturate?: number;
  
  // Callbacks
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (event: React.SyntheticEvent<HTMLImageElement>) => void;
  onClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onDoubleClick?: (event: React.MouseEvent<HTMLDivElement>) => void;
  onContextMenu?: (event: React.MouseEvent<HTMLDivElement>) => void;
  
  // Additional features
  caption?: string;
  badge?: React.ReactNode;
  watermark?: string;
  crossOrigin?: "anonymous" | "use-credentials" | "";
  decoding?: "async" | "auto" | "sync";
  
  // Accessibility
  title?: string;
  role?: string;
  ariaLabel?: string;
  ariaDescribedby?: string;
  
  // Performance
  priority?: boolean;
  srcSet?: string;
  sizes?: string;
  
  // Animation
  fadeIn?: boolean;
  fadeInDuration?: number;
  scaleOnHover?: boolean;
  rotateOnHover?: boolean;
}

const DynamicImage = forwardRef<HTMLImageElement, ImageProps>(({
  src,
  alt,
  width,
  height,
  aspectRatio,
  className = "",
  objectFit = "cover",
  rounded = false,
  border = false,
  borderColor = "border-gray-300",
  shadow = "none",
  lazyLoad = true,
  loading = "lazy",
  placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23f3f4f6' width='400' height='300'/%3E%3C/svg%3E",
  fallbackSrc = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 300'%3E%3Crect fill='%23e5e7eb' width='400' height='300'/%3E%3Ctext x='50%25' y='50%25' fill='%239ca3af' text-anchor='middle' dy='.3em' font-family='system-ui' font-size='18'%3EImage Not Found%3C/text%3E%3C/svg%3E",
  showLoadingSpinner = true,
  showErrorState = true,
  retryOnError = true,
  maxRetries = 3,
  zoomable = false,
  draggable = false,
  expandOnClick = false,
  downloadable = false,
  selectable = true,
  overlay,
  overlayOnHover = false,
  grayscale = false,
  blur = 0,
  brightness = 100,
  contrast = 100,
  saturate = 100,
  onLoad,
  onError,
  onClick,
  onDoubleClick,
  onContextMenu,
  caption,
  badge,
  watermark,
  crossOrigin = "anonymous",
  decoding = "async",
  title,
  role,
  ariaLabel,
  ariaDescribedby,
  priority = false,
  srcSet,
  sizes,
  fadeIn = true,
  fadeInDuration = 300,
  scaleOnHover = false,
  rotateOnHover = false,
}, ref) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [currentSrc, setCurrentSrc] = useState<string>(placeholder);
  const [isZoomed, setIsZoomed] = useState<boolean>(false);
  const [retryCount, setRetryCount] = useState<number>(0);
  const [isHovered, setIsHovered] = useState<boolean>(false);
  const [dragPosition, setDragPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  // const [showModal, setShowModal] = useState<boolean>(false);
  
  const internalImageRef = useRef<HTMLImageElement>(null);
  const imageRef = (ref as React.RefObject<HTMLImageElement>) || internalImageRef;
  const containerRef = useRef<HTMLDivElement>(null);

  // Preload image
  useEffect(() => {
    if (!src) return;

    setIsLoading(true);
    setIsError(false);
    setCurrentSrc(placeholder);

    const img = new Image();
    img.src = src;
    if (srcSet) img.srcset = srcSet;
    if (sizes) img.sizes = sizes;

    img.onload = (e) => {
      setIsLoading(false);
      setCurrentSrc(src);
      if (onLoad) onLoad(e as any);
    };

    img.onerror = (e) => {
      setIsLoading(false);
      setIsError(true);
      setCurrentSrc(fallbackSrc);
      if (onError) onError(e as any);
    };

    return () => {
      img.onload = null;
      img.onerror = null;
    };
  }, [src, srcSet, sizes, placeholder, fallbackSrc]);

  const handleRetry = useCallback(() => {
    if (retryCount >= maxRetries) return;

    setIsLoading(true);
    setIsError(false);
    setRetryCount(prev => prev + 1);

    const img = new Image();
    img.src = src;

    img.onload = (e) => {
      setIsLoading(false);
      setIsError(false);
      setCurrentSrc(src);
      if (onLoad) onLoad(e as any);
    };

    img.onerror = (e) => {
      setIsLoading(false);
      setIsError(true);
      setCurrentSrc(fallbackSrc);
      if (onError) onError(e as any);
    };
  }, [src, retryCount, maxRetries, fallbackSrc, onLoad, onError]);

  const handleImageClick = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (expandOnClick) {
      // setShowModal(true);
      console.log("Expand modal would open here");
    } else if (zoomable) {
      setIsZoomed(prev => !prev);
    }
    if (onClick) onClick(e);
  }, [expandOnClick, zoomable, onClick]);

  const handleDownload = useCallback(async (e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      const response = await fetch(currentSrc);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = alt || 'image';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Download failed:', error);
    }
  }, [currentSrc, alt]);

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    if (!draggable || !isZoomed) return;
    setIsDragging(true);
    setDragStart({
      x: e.clientX - dragPosition.x,
      y: e.clientY - dragPosition.y,
    });
  }, [draggable, isZoomed, dragPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setDragPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Generate class names
  const getRoundedClass = () => {
    if (!rounded) return "";
    if (rounded === true) return "rounded-md";
    if (rounded === "none") return "";
    return `rounded-${rounded}`;
  };

  const getShadowClass = () => {
    if (shadow === "none") return "";
    return `shadow-${shadow}`;
  };

  const getBorderClass = () => {
    return border ? `border-2 ${borderColor}` : "";
  };

  // Style calculations
  const containerStyle: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
    aspectRatio: aspectRatio,
  };

  const imageFilters = `
    ${grayscale ? 'grayscale(100%)' : ''}
    ${blur ? `blur(${blur}px)` : ''}
    ${brightness !== 100 ? `brightness(${brightness}%)` : ''}
    ${contrast !== 100 ? `contrast(${contrast}%)` : ''}
    ${saturate !== 100 ? `saturate(${saturate}%)` : ''}
  `.trim();

  const imageStyle: React.CSSProperties = {
    filter: imageFilters || undefined,
    transform: `
      scale(${isZoomed ? 1.5 : 1})
      ${isDragging ? `translate(${dragPosition.x}px, ${dragPosition.y}px)` : ''}
    `,
    cursor: isZoomed ? (draggable ? 'move' : 'zoom-out') : (zoomable ? 'zoom-in' : 'default'),
    transition: isDragging ? 'none' : `all ${fadeInDuration}ms ease`,
    userSelect: selectable ? 'auto' : 'none',
  };

  const objectFitClass = `object-${objectFit}`;
  const roundedClass = getRoundedClass();
  const shadowClass = getShadowClass();
  const borderClass = getBorderClass();

  const hoverClasses = `
    ${scaleOnHover ? 'hover:scale-105' : ''}
    ${rotateOnHover ? 'hover:rotate-1' : ''}
  `.trim();

  return (
    <div
      ref={containerRef}
      className={`relative inline-block ${shadowClass}`}
      style={containerStyle}
      onClick={handleImageClick}
      onDoubleClick={onDoubleClick}
      onContextMenu={onContextMenu}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      role={role}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedby}
    >
      <div
        className={`relative overflow-hidden ${roundedClass} ${borderClass} ${hoverClasses} transition-transform duration-300`}
      >
        <img
          ref={imageRef}
          src={currentSrc}
          alt={alt}
          title={title || alt}
          loading={priority ? "eager" : (lazyLoad ? loading : "eager")}
          decoding={decoding}
          crossOrigin={crossOrigin}
          srcSet={srcSet}
          sizes={sizes}
          className={`w-full h-full ${objectFitClass} ${roundedClass} ${className} ${
            fadeIn && !isLoading ? 'opacity-100' : 'opacity-0'
          }`}
          style={imageStyle}
          draggable={false}
        />

        {/* Loading State */}
        {isLoading && showLoadingSpinner && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100/80 backdrop-blur-sm">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        )}

        {/* Error State */}
        {isError && showErrorState && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-100 p-4">
            <p className="text-sm text-gray-600 mb-3 text-center">Failed to load image</p>
            {retryOnError && retryCount < maxRetries && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleRetry();
                }}
                className="flex items-center gap-2 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md text-sm transition-colors"
              >
                <RefreshCw className="h-4 w-4" />
                Retry ({retryCount}/{maxRetries})
              </button>
            )}
          </div>
        )}

        {/* Overlay */}
        {overlay && !isLoading && !isError && (
          <div className={`absolute inset-0 ${overlayOnHover ? (isHovered ? 'opacity-100' : 'opacity-0') : 'opacity-100'} transition-opacity duration-300`}>
            {overlay}
          </div>
        )}

        {/* Zoom Control */}
        {zoomable && !isLoading && !isError && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsZoomed(prev => !prev);
            }}
            className="absolute bottom-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all backdrop-blur-sm"
            aria-label={isZoomed ? "Zoom out" : "Zoom in"}
          >
            {isZoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
          </button>
        )}

        {/* Download Button */}
        {downloadable && !isLoading && !isError && (
          <button
            onClick={handleDownload}
            className="absolute top-3 right-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all backdrop-blur-sm"
            aria-label="Download image"
          >
            <Download className="h-4 w-4" />
          </button>
        )}

        {/* Expand Button */}
        {expandOnClick && !isLoading && !isError && (
          <button
            className="absolute bottom-3 left-3 bg-black/60 hover:bg-black/80 text-white p-2 rounded-full transition-all backdrop-blur-sm"
            aria-label="Expand image"
          >
            <Maximize2 className="h-4 w-4" />
          </button>
        )}

        {/* Badge */}
        {badge && !isLoading && (
          <div className="absolute top-3 left-3">
            {badge}
          </div>
        )}

        {/* Watermark */}
        {watermark && !isLoading && !isError && (
          <div className="absolute bottom-3 left-3 text-white/70 text-xs font-medium bg-black/40 px-2 py-1 rounded backdrop-blur-sm">
            {watermark}
          </div>
        )}
      </div>

      {/* Caption */}
      {caption && !isLoading && !isError && (
        <p className="text-sm text-gray-600 mt-2 px-1">{caption}</p>
      )}

      {/* Media Modal - Commented out for now */}
      {/* {showModal && (
        <MediaModal 
          open={showModal} 
          onClose={() => setShowModal(false)} 
          src={currentSrc}
        />
      )} */}
    </div>
  );
});

DynamicImage.displayName = "DynamicImage";

export default DynamicImage;

// Demo Component
// const ImageDemo = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-8">
//       <div className="max-w-7xl mx-auto">
//         <h1 className="text-4xl font-bold text-gray-800 mb-2">Advanced Dynamic Image Component</h1>
//         <p className="text-gray-600 mb-8">Comprehensive image component with multiple features</p>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//           {/* Basic Usage */}
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold mb-4">Basic Image</h3>
//             <DynamicImage
//               src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
//               alt="Mountain landscape"
//               width="100%"
//               aspectRatio="16/9"
//               rounded="lg"
//             />
//           </div>

//           {/* With Caption */}
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold mb-4">With Caption</h3>
//             <DynamicImage
//               src="https://images.unsplash.com/photo-1469474968028-56623f02e42e"
//               alt="Forest"
//               width="100%"
//               aspectRatio="16/9"
//               rounded="lg"
//               caption="Beautiful forest landscape"
//               shadow="lg"
//             />
//           </div>

//           {/* Zoomable */}
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold mb-4">Zoomable & Draggable</h3>
//             <DynamicImage
//               src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e"
//               alt="Nature"
//               width="100%"
//               aspectRatio="16/9"
//               rounded="lg"
//               zoomable
//               draggable
//               border
//               borderColor="border-blue-400"
//             />
//           </div>

//           {/* With Badge */}
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold mb-4">With Badge</h3>
//             <DynamicImage
//               src="https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05"
//               alt="Nature sunset"
//               width="100%"
//               aspectRatio="16/9"
//               rounded="lg"
//               badge={
//                 <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-semibold">
//                   NEW
//                 </span>
//               }
//               watermark="© 2025"
//             />
//           </div>

//           {/* Downloadable */}
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold mb-4">Downloadable</h3>
//             <DynamicImage
//               src="https://images.unsplash.com/photo-1426604966848-d7adac402bff"
//               alt="Mountain peak"
//               width="100%"
//               aspectRatio="16/9"
//               rounded="lg"
//               downloadable
//               expandOnClick
//             />
//           </div>

//           {/* With Filters */}
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold mb-4">With Filters</h3>
//             <DynamicImage
//               src="https://images.unsplash.com/photo-1501594907352-04cda38ebc29"
//               alt="Sunset"
//               width="100%"
//               aspectRatio="16/9"
//               rounded="lg"
//               saturate={150}
//               contrast={110}
//               shadow="xl"
//             />
//           </div>

//           {/* Scale on Hover */}
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold mb-4">Interactive Hover</h3>
//             <DynamicImage
//               src="https://images.unsplash.com/photo-1475924156734-496f6cac6ec1"
//               alt="Beach"
//               width="100%"
//               aspectRatio="16/9"
//               rounded="lg"
//               scaleOnHover
//               shadow="md"
//             />
//           </div>

//           {/* Circular */}
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold mb-4">Circular Avatar</h3>
//             <div className="flex justify-center">
//               <DynamicImage
//                 src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
//                 alt="Profile"
//                 width={200}
//                 height={200}
//                 rounded="full"
//                 border
//                 borderColor="border-purple-500"
//                 objectFit="cover"
//               />
//             </div>
//           </div>

//           {/* With Overlay */}
//           <div className="bg-white p-6 rounded-xl shadow-md">
//             <h3 className="text-lg font-semibold mb-4">Hover Overlay</h3>
//             <DynamicImage
//               src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4"
//               alt="Mountain view"
//               width="100%"
//               aspectRatio="16/9"
//               rounded="lg"
//               overlayOnHover
//               overlay={
//                 <div className="flex items-center justify-center bg-black/50 backdrop-blur-sm h-full">
//                   <p className="text-white font-semibold text-lg">View Details</p>
//                 </div>
//               }
//             />
//           </div>
//         </div>

//         <div className="mt-12 bg-white p-8 rounded-xl shadow-md">
//           <h2 className="text-2xl font-bold mb-4">Features</h2>
//           <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 text-sm text-gray-700">
//             <li>✅ Lazy loading with placeholder</li>
//             <li>✅ Error handling with retry</li>
//             <li>✅ Zoom & drag functionality</li>
//             <li>✅ Download capability</li>
//             <li>✅ Custom overlays</li>
//             <li>✅ Badges & watermarks</li>
//             <li>✅ Image filters (blur, grayscale, etc.)</li>
//             <li>✅ Responsive sizing</li>
//             <li>✅ Accessibility support</li>
//             <li>✅ Multiple border radius options</li>
//             <li>✅ Shadow variations</li>
//             <li>✅ Hover effects</li>
//             <li>✅ Caption support</li>
//             <li>✅ Aspect ratio control</li>
//             <li>✅ CrossOrigin & srcSet support</li>
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ImageDemo;