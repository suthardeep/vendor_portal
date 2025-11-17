import type { ReactNode } from "react";
import Dialog from "./Dialog";

interface DeleteDialogProps {
  title?: string;
  name?: string;
  isOpen: boolean;
  close: () => void;
  onDelete: () => void;
  content?: ReactNode;
  isDeleting: boolean;
}

const DeleteDialog: React.FC<DeleteDialogProps> = (props) => {
  const {
    close,
    isOpen,
    title = "Delete",
    name,
    onDelete,
    content,
    isDeleting,
  } = props;

  return (
    <Dialog
      title={title}
      isOpen={isOpen}
      close={close}
      actions={{
        primary: {
          label: "Delete",
          onClick: onDelete,
          loading: isDeleting,
          color: "danger",
        },
        secondary: {
          label: "Cancel",
          onClick: close,
          variant: "filled",
          color: "neutral",
        },
      }}
    >
      <h6 className="text-base-3 dark:text-neutral-content">
        Are you sure you want to delete{" "}
        <span className="text-base-3 dark:text-neutral-content !text-base font-semibold">
          {" "}
          {name}{" "}
        </span>
        ?
      </h6>
      {content && content}
    </Dialog>
  );
};

export default DeleteDialog;
