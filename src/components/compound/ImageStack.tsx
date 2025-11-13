import { cn } from "@/utils/helpers";
import Label from "../base/Label";
import ImageComponent from "./ImageComponent";
import LightboxGallery, { type LightboxGalleryProps } from "./LightboxGallery";
import { useToggle } from "@/hooks/useToggle";

export type ImageStackProps = Pick<LightboxGalleryProps, "imageAction"> & {
  images: string[];
  altPrefix?: string;
  label?: string;
  className?: string;
};

const ImageStack: React.FC<ImageStackProps> = (props) => {
  const {
    images = [],
    altPrefix = "",
    className = "",
    label = "",
    imageAction,
  } = props;
  const { open: open, isOpen: isOpen, close: close } = useToggle();
  if (!images || images.length === 0) return null;
  const count = images.length;
  const displayImages = count > 4 ? images.slice(0, 4) : images;

  return (
    <div>
      {label && <Label className="mb-1.5"> {label} </Label>}
      <div
        className={cn(
          `relative grid size-32 w-fit cursor-pointer gap-1 overflow-hidden rounded-lg ${
            count === 1
              ? "grid-cols-1"
              : count === 2
                ? "grid-cols-2"
                : "grid-cols-2"
          }`,
          className,
        )}
        onClick={open}
      >
        {displayImages.map((src, idx) => (
          <ImageComponent
            key={idx}
            src={src}
            alt={`${altPrefix} ${idx + 1}`}
            className={cn("h-full w-full rounded-lg object-cover")}
            disableZoom
          />
        ))}
        {count > 4 && (
          <div className="fall absolute top-0 left-0 h-full w-full bg-black/80 backdrop-blur-[1.5px] dark:bg-black/90">
            <p className="text-nl-200 font-medium text-shadow-md">
              {" "}
              {count} images{" "}
            </p>
          </div>
        )}
      </div>
      <LightboxGallery
        images={images}
        close={close}
        isOpen={isOpen}
        imageAction={imageAction}
      />
    </div>
  );
};

export default ImageStack;
