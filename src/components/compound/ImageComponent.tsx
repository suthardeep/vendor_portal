import { useImageZoomStore } from "@/store/useImageZoomStore";
import { cn } from "@/utils/helpers";
import { useState } from "react";
import fallback from "@/assets/react.svg";
import {Icon} from "../base/Icon";

interface ImageComponentProps {
  src: string | File;
  className?: string;
  wrapperClassName?: string;
  alt: string;
  disableZoom?: boolean;
  onRemove?: () => void;
}

const ImageComponent: React.FC<ImageComponentProps> = (props) => {
  const {
    alt,
    src,
    className,
    wrapperClassName,
    disableZoom = false,
    onRemove,
  } = props;

  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const setZoomedImageSrc = useImageZoomStore(
    (state) => state.setZoomedImageSrc,
  );

  const handleLoad = () => {
    setIsLoading(false);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoading(false);
  };

  const shouldZoom = !disableZoom && src && !hasError;
  const getSrc = () => {
    if (typeof src === "string") {
      if (
        src.startsWith("http") ||
        src.startsWith("blob:") ||
        src.startsWith("/")
      ) {
        return src;
      }
      return `${baseUrl}/${src}`;
    } else if (src instanceof File) {
      return URL.createObjectURL(src);
    }
    return "";
  };

  const handleImageClick = (e: React.MouseEvent<HTMLImageElement>) => {
    if (shouldZoom) {
      e.stopPropagation();
      setZoomedImageSrc(getSrc() || "");
    }
  };

  return (
    <div
      className={cn(
        "relative inline-block w-fit overflow-hidden",
        shouldZoom && "group",
        wrapperClassName,
      )}
      aria-label="image-component"
    >
      <img
        src={hasError || !src ? fallback : getSrc()}
        alt={alt}
        onLoad={handleLoad}
        onError={handleError}
        className={cn(
          "object-cover object-center",
          isLoading ? "shimmer" : "",
          isLoading && "cursor-progress",
          className,
        )}
        loading="lazy"
        decoding="async"
      />

      <span
        className={cn(
          "gap-y- absolute top-0.5 right-0.5 hidden flex-col rounded-full bg-black/30 group-hover:flex",
        )}
      >
        <span
          onClick={handleImageClick}
          className={cn(
            shouldZoom && "cursor-zoom-in rounded-full p-1 hover:bg-black/35",
            disableZoom && "hidden",
          )}
        >
          <Icon name="Maximize2" size={12} className="text-white" />
        </span>
        {onRemove && (
          <span
            className={cn("cursor-pointer rounded-full p-1 hover:bg-black/35")}
            onClick={onRemove}
          >
            <Icon name="X" size={12} className="text-white" />
          </span>
        )}
      </span>
    </div>
  );
};

export default ImageComponent;

const baseUrl = import.meta.env.VITE_BACKEND_URL;
