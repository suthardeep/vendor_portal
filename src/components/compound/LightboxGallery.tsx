import { cn } from "@/utils/helpers";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { IconButton } from "../base/IconButton";
import { type DialogProps } from "./Dialog";
import ImageComponent from "./ImageComponent";
import { createPortal } from "react-dom";

export type LightboxGalleryProps = Pick<
  DialogProps,
  "isOpen" | "close" | "disableBackdropClose"
> & {
  images: string[];
  imageAction?: (image: string, index: number) => ReactNode;
};

const LightboxGallery: React.FC<LightboxGalleryProps> = (props) => {
  const { images, close, isOpen, disableBackdropClose, imageAction } = props;
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [shouldRenderContent, setShouldRenderContent] = useState(false);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const goToPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "ArrowRight") goToNext();
    if (e.key === "ArrowLeft") goToPrev();
  };

  useEffect(() => {
    if (images.length < 2) return;
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const handleBackdropClick = () => {
    if (!disableBackdropClose) {
      setCurrentIndex(0);
      close();
    }
  };

  useEffect(() => {
    if (isOpen) {
      setShouldRenderContent(true);
      if (document) {
        document.body.style.overflow = "hidden";
      }
    } else {
      const timeout = setTimeout(() => setShouldRenderContent(false), 200);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    if (images.length === 0) {
      setCurrentIndex(0);
      close();
    }
  }, [images]);

  useEffect(() => {
    if (currentIndex >= images.length) {
      setCurrentIndex(Math.max(images.length - 1, 0));
    }
  }, [images, currentIndex]);

  const content = (
    <div
      aria-label="light-box-gallery"
      className={cn(
        `fall fixed inset-0 z-[101] bg-black/90 backdrop-blur-[1.5px] transition-all duration-200`,
        isOpen
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-4 opacity-0",
      )}
      onClick={handleBackdropClick}
    >
      {shouldRenderContent && (
        <div onClick={(e) => e.stopPropagation()}>
          <div className="flex h-[80dvh] w-full max-w-3xl items-center justify-center">
            <div>
              <ImageComponent
                key={images[currentIndex]}
                src={images[currentIndex]}
                alt={`Image ${currentIndex + 1}`}
                className="fade-in max-h-[72dvh] max-w-full rounded-lg shadow-xl"
                disableZoom
              />
              {imageAction && imageAction(images[currentIndex], currentIndex)}
            </div>

            <IconButton
              icon={ChevronLeft}
              onClick={goToPrev}
              className="absolute left-8"
              iconClassName="text-white"
              strokeWidth={2}
              size={20}
              noDefaultFill
              disabled={images.length < 2}
            />
            <IconButton
              icon={ChevronRight}
              onClick={goToNext}
              className="absolute right-8"
              iconClassName="text-white"
              strokeWidth={2}
              size={20}
              noDefaultFill
              disabled={images.length < 2}
            />
          </div>

          <div className="mt-6 flex justify-center gap-1.5 overflow-x-auto">
            {images.map((img, index) => (
              <button
                key={img}
                type="button"
                onClick={() => setCurrentIndex(index)}
                className={`fall rounded-lg border-2 p-0.5 hover:opacity-85 ${
                  currentIndex === index
                    ? "border-white"
                    : "border-transparent opacity-60"
                }`}
              >
                <ImageComponent
                  src={img}
                  alt={`Thumbnail ${index + 1}`}
                  className="size-12 cursor-pointer rounded-md object-cover"
                  disableZoom
                />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (typeof document !== "undefined") {
    return createPortal(content, document.body);
  }

  return null;
};

export default LightboxGallery;
