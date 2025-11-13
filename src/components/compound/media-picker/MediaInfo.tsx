import type { UploadResult } from "@/types/uploader.types";
import ImageComponent from "../ImageComponent";
import Chip from "@/components/base/Chip";
import { ListItem } from "../ListItem";
import { prettyDate } from "@/utils/formatDateTime";

interface MediaInfoProps {
  media: UploadResult;
}

const MediaInfo: React.FC<MediaInfoProps> = (props) => {
  const { media } = props;
  const { createdDate, group, name, path, size, type, uniqueId, uploader } =
    media || {};

  return (
    <div className="flex gap-7">
      <ImageComponent
        src={path}
        alt={`media-info-${name}`}
        wrapperClassName="size-72 shrink-0 max-w-1/2"
        className="h-full w-full rounded-md"
      />
      <div className="w-full">
        <h5 className="text-nl-700 dark:text-nd-100 font-medium"> {name} </h5>
        <Chip label={type} color="gray" />
        <div className="card mt-4 flex flex-col gap-y-3 rounded-lg p-2">
          <ListItem label="File size" value={size} startIcon="HardDrive" />
          <ListItem label="Uploader" value={uploader} startIcon="User" />
          <ListItem label="Folder" value={group} startIcon="Folder" />
          <ListItem label="ID" value={uniqueId} startIcon="Hash" />
          <ListItem
            label="Created"
            value={prettyDate(createdDate)}
            startIcon="Calendar"
          />
        </div>
        <div className="mt-5">
          <p className="text-nl-500 dark:text-nd-300"> File path: </p>
          <code className="text-nl-700 dark:text-nd-100 mt-2 text-sm break-all">
            {path}
          </code>
        </div>
      </div>
    </div>
  );
};

export default MediaInfo;
