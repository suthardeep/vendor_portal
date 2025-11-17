// ============================================================================
// MAGNIFYING IMAGE COMPONENT - Use only when zoom is needed
// ============================================================================

import { forwardRef, useRef, useState } from "react";
import { Image, ImageProps } from "../base/Image";

interface MagnifyingImageProps extends Omit<ImageProps, "expandOnClick"> {
  zoomLevel?: number;
  zoomWindowSize?: number;
}

export const MagnifyingImage = forwardRef<HTMLImageElement, MagnifyingImageProps>(
  ({ src, alt, zoomLevel = 3, zoomWindowSize = 800, ...imageProps }, ref) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const imgRef = useRef<HTMLImageElement>(null);
    const [pos, setPos] = useState({ x: 0, y: 0 });
    const [showZoom, setShowZoom] = useState(false);

    const handleMouseMove = (e: React.MouseEvent) => {
      const rect = containerRef.current?.getBoundingClientRect();
      if (!rect) return;
      setPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
    };

    const getClampedTransform = () => {
      if (!imgRef.current) return { x: 0, y: 0 };

    //   console.log("imgRef.current.width:", imgRef.current.width); // 600
    //   console.log("imgRef.current.height:", imgRef.current.height); // 600

      const zoomedWidth = imgRef.current.width * zoomLevel;
      const zoomedHeight = imgRef.current.height * zoomLevel;

    //   console.log("zoomedWidth:", zoomedWidth); // 1800
    //   console.log("zoomedHeight:", zoomedHeight); // 1800

      const viewportWidth = window.innerWidth * 0.5;
      const viewportHeight = window.innerHeight ;

    //   console.log("viewportWidth:", viewportWidth); // e.g., 576
    //   console.log("viewportHeight:", viewportHeight); // e.g., 622.4

      let translateX = -pos.x * zoomLevel + viewportWidth / 2;
      let translateY = -pos.y * zoomLevel + viewportHeight / 2;

    //   console.log("translateX before clamp:", translateX);
    //   console.log("translateY before clamp:", translateY);

      const minX = -(zoomedWidth - viewportWidth);
    //   console.log("minX:", minX);
      const maxX = 0;
      translateX = Math.max(minX, Math.min(maxX, translateX));
    //   console.log("translateX after clamp:", translateX);

      const minY = -(zoomedHeight - viewportHeight);
    //   console.log("minY:", minY);
      const maxY = 0;
      translateY = Math.max(minY, Math.min(maxY, translateY));
    //   console.log("translateY after clamp:", translateY);

      return { x: translateX, y: translateY };
    };

    const transform = getClampedTransform();
    // console.log("Final transform:", transform);
    const boxSize = 220;

    return (
      <>
        <div
          ref={containerRef}
          className="relative inline-block"
          onMouseEnter={() => setShowZoom(true)}
          onMouseLeave={() => setShowZoom(false)}
          onMouseMove={handleMouseMove}
        >
          <Image objectFit="contain" ref={imgRef} src={src} alt={alt} {...imageProps} />

          {showZoom && (
            <div
              className="absolute pointer-events-none border-2 border-blue-500 bg-blue-500/10"
              style={{
                width: boxSize,
                height: boxSize,
                left: pos.x - boxSize / 2,
                top: pos.y - boxSize / 2,
              }}
            />
          )}
        </div>

        {showZoom && (
          <div
            className="fixed z-9999 top-[1vh] right-0 border-l-4 border-blue-500 overflow-hidden bg-white shadow-2xl"
            style={{
              left: "50%",
              width: (imgRef?.current?.width || 700) * zoomLevel,
              height: (imgRef?.current?.height || 700) * zoomLevel,
            }}
          >
            <img
              src={src}
              alt={`${alt} - Zoomed`}
              className="pointer-events-none"
              style={{
                width: `${imgRef.current?.width ? imgRef.current.width * zoomLevel : 0}px`,
                height: `${imgRef.current?.height ? imgRef.current.height * zoomLevel : 0}px`,
                transform: `translate(${transform.x}px, ${transform.y}px)`,
              }}
            />
          </div>
        )}
      </>
    );
  }
);

MagnifyingImage.displayName = "MagnifyingImage";

export default MagnifyingImage;
