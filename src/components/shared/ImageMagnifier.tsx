import { useRef, useState } from "react";
import DynamicImage from "../base/Image";

export default function ImageMagnifier() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [showZoom, setShowZoom] = useState(false);

  const ZOOM_LEVEL = 3; // magnification factor
  const ZOOM_WINDOW_SIZE = 400; // size of the zoom window

  function handleMouseMove(e: React.MouseEvent) {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;

    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setPos({ x, y });
  }

  // Calculate clamped transform values
  function getClampedTransform() {
    if (!imgRef.current) return { x: 0, y: 0 };

    const zoomedWidth = imgRef.current.width * ZOOM_LEVEL;
    const zoomedHeight = imgRef.current.height * ZOOM_LEVEL;
    const viewportWidth = window.innerWidth * 0.5; // 50dvw
    const viewportHeight = window.innerHeight * 0.9; // 90dvh

    // Calculate desired position (cursor at center of viewport)
    let translateX = -pos.x * ZOOM_LEVEL + viewportWidth / 2;
    let translateY = -pos.y * ZOOM_LEVEL + viewportHeight / 2;

    // Clamp X: don't let left edge go past 0, don't let right edge expose white space
    const minX = -(zoomedWidth - viewportWidth);
    const maxX = 0;
    translateX = Math.max(minX, Math.min(maxX, translateX));

    // Clamp Y: don't let top edge go past 0, don't let bottom edge expose white space
    const minY = -(zoomedHeight - viewportHeight);
    const maxY = 0;
    translateY = Math.max(minY, Math.min(maxY, translateY));

    return { x: translateX, y: translateY };
  }

  const transform = getClampedTransform();

  return (
    <div className="flex items-center justify-center">
      {/* Main Image */}
      <div
        ref={containerRef}
        className="relative inline-block"
        onMouseEnter={() => setShowZoom(true)}
        onMouseLeave={() => setShowZoom(false)}
        onMouseMove={handleMouseMove}
      >
        <DynamicImage
          ref={imgRef}
          src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400"
          alt="Sample"
          className="block max-w-md"
        />

        {/* Hover indicator */}
        {showZoom && (
          <div
            className="absolute pointer-events-none rounded-full border-2 border-white/80 shadow-lg"
            style={{
              width: ZOOM_WINDOW_SIZE / ZOOM_LEVEL,
              height: ZOOM_WINDOW_SIZE / ZOOM_LEVEL,
              left: pos.x - ZOOM_WINDOW_SIZE / ZOOM_LEVEL / 2,
              top: pos.y - ZOOM_WINDOW_SIZE / ZOOM_LEVEL / 2,
            }}
          />
        )}
      </div>

      {/* Zoomed Image Window - Fixed to right side */}
      {showZoom && (
        <div
          className="fixed z-[1000] top-[5vh] right-0 border-l-2 border-gray-300 overflow-hidden bg-white shadow-xl"
          style={{
            width: '50vw',
            height: '90vh',
          }}
        >
          <img
            src="https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1500"
            alt="Zoomed"
            className="pointer-events-none"
            style={{
              width: `${imgRef.current?.width ? imgRef.current.width * ZOOM_LEVEL : 0}px`,
              height: `${imgRef.current?.height ? imgRef.current.height * ZOOM_LEVEL : 0}px`,
              transform: `translate(${transform.x}px, ${transform.y}px)`,
            }}
          />
        </div>
      )}
    </div>
  );
}