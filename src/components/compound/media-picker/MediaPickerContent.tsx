// MediaPickerContent.tsx
import { useState, type ReactNode } from "react";
import ToggleButtonGroup, {
  type ToggleButtonListItem,
} from "../ToggleButtonGroup";
import FileUploader from "./FileUploader";
import MediaGallery from "./MediaGallery";
import { Button } from "@/components/base/Button";
import { usePermissionStore } from "@/store/usePermissions";
import { getFeaturePermissions } from "@/utils/rbac";
import { PermissionFeaturesEnum } from "@/features/settings/roles-permissions/types";
import Unauthorized from "../../empty-states/Unauthorized";
import { MediaPickerModes } from "@/features/media-picker/types";
import type { UploadResult } from "@/types/uploader.types";
import MediaUploaderSelect from "./MediaUploaderSelect";
import type { SelectOption } from "@/components/base/Select";
import SearchInput from "../SearchInput";

interface MediaPickerContentProps {
  acceptedFormats?: string[];
  maxSizeMB?: number;
  multiple?: boolean;
  onError?: (error: string) => void;
  onMediaSelect?: (media: UploadResult | UploadResult[]) => void;
  onUploadComplete?: (media: UploadResult[]) => void;
  close: () => void;
  variant?: "dialog" | "screen";
  selectedMedia: UploadResult[];
  setSelectedMedia: React.Dispatch<React.SetStateAction<UploadResult[]>>;
  footer?: ReactNode;
}

const MediaPickerContent: React.FC<MediaPickerContentProps> = ({
  acceptedFormats,
  maxSizeMB,
  multiple,
  onError,
  onUploadComplete,
  onMediaSelect,
  close,
  variant,
  selectedMedia,
  setSelectedMedia,
  footer,
}) => {
  const [mode, setMode] = useState<ToggleButtonListItem<MediaPickerModes>>(
    toggleButtonList[0],
  );
  const [searchVal, setSearchVal] = useState<string>("");
  const [selectedUploader, setSelectedUploader] = useState<SelectOption>({
    label: "Staff",
    value: "staff",
  });
  const permissions = usePermissionStore((s) => s.permissions);

  const { canRead, canWrite } = getFeaturePermissions(
    PermissionFeaturesEnum.gallery,
    permissions,
  );

  const onButtonChange = (button: ToggleButtonListItem<MediaPickerModes>) => {
    setMode(button);
    setSelectedMedia([]);
  };

  const handleImageClick = (media: UploadResult) => {
    setSelectedMedia((prev) => {
      const exists = prev.find((m) => m.path === media.path);
      if (multiple) {
        return exists
          ? prev.filter((m) => m.path !== media.path)
          : [...prev, media];
      } else {
        return exists ? [] : [media];
      }
    });
  };

  const handleConfirmSelection = () => {
    if (selectedMedia.length > 0) {
      onMediaSelect?.(multiple ? selectedMedia : selectedMedia[0]);
      onUploadComplete?.(selectedMedia);
      setSelectedMedia([]);
      close();
    }
  };

  const handleCancel = () => {
    setSelectedMedia([]);
    close();
  };

  const isGallery = mode.value === MediaPickerModes.gallery;

  if (!canRead) return <UnauthorizedGallery />;

  return (
    <>
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div className="w-full md:max-w-[20rem]">
          <ToggleButtonGroup
            buttonList={toggleButtonList}
            onChange={onButtonChange}
            selected={mode}
            fullWidth
          />
        </div>
        {isGallery && (
          <div className="flex items-center gap-2">
            <SearchInput setVal={setSearchVal} val={searchVal} />
            <MediaUploaderSelect
              selected={selectedUploader}
              setSelected={setSelectedUploader}
            />
          </div>
        )}
      </div>

      <div className="mt-6">
        {isGallery ? (
          <MediaGallery
            onImageClick={handleImageClick}
            multiple={multiple}
            selectedMedia={selectedMedia}
            selectedUploader={selectedUploader.value}
            searchVal={searchVal}
          />
        ) : canWrite ? (
          <FileUploader
            acceptedFormats={acceptedFormats}
            maxSizeMB={maxSizeMB}
            multiple={multiple}
            onError={onError}
            onUploadComplete={onUploadComplete}
          />
        ) : (
          <UnauthorizedGallery />
        )}
      </div>

      {isGallery && (
        <div className="mt-4 flex items-center gap-2">
          {selectedMedia.length > 0 && (
            <p className="text-nl-700 dark:text-nd-200 text-sm">
              {selectedMedia.length} {multiple ? "items" : "item"} selected
            </p>
          )}
          {variant === "dialog"
            ? true
            : variant === "screen" &&
              selectedMedia?.length > 0 && (
                <Button
                  color="neutral"
                  className="ml-auto"
                  onClick={handleCancel}
                >
                  Cancel
                </Button>
              )}
          {variant === "dialog" && (
            <Button
              onClick={handleConfirmSelection}
              disabled={selectedMedia.length === 0}
              className="ml-auto"
            >
              Select {selectedMedia.length > 0 && `(${selectedMedia.length})`}
            </Button>
          )}
          {footer && footer}
        </div>
      )}
    </>
  );
};

export default MediaPickerContent;

const toggleButtonList: ToggleButtonListItem<MediaPickerModes>[] = [
  { label: "Gallery", value: MediaPickerModes.gallery },
  { label: "Upload", value: MediaPickerModes.uploader },
];

const UnauthorizedGallery = () => (
  <div className="dark:bg-nd-600 rounded-xl bg-blue-50 p-5">
    <Unauthorized hideIcon hideCta />
  </div>
);
