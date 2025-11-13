import { useToggle } from "@/hooks/useToggle";
import { useBlocker } from "@tanstack/react-router";
import { useEffect } from "react";
import Dialog from "./Dialog";
import { Button } from "../base/Button";

interface NavBlockerProps {
  shouldBlock: boolean;
}

const NavBlocker: React.FC<NavBlockerProps> = (props) => {
  const { shouldBlock } = props;
  const { isOpen, open, close } = useToggle();

  const { proceed, reset, status } = useBlocker({
    shouldBlockFn: () => shouldBlock,
    withResolver: true,
  });

  useEffect(() => {
    if (status === "blocked") {
      open();
    }
  }, [status]);

  const handleClose = () => {
    close();
    if (reset) {
      reset();
    }
  };

  const handleConfirm = () => {
    close();
    if (proceed) {
      proceed();
    }
  };

  return (
    <Dialog
      isOpen={isOpen}
      close={handleClose}
      title="Are you sure you want to leave?"
    >
      <div className="mt-2 space-y-4">
        <p className="text-nl-600 dark:text-nd-100">
          You might lose unsaved data if you proceed to leave
        </p>
        <div className="flex justify-end gap-2">
          <Button onClick={handleClose} color="neutral">
            Stay
          </Button>
          <Button onClick={handleConfirm} color="danger">
            Leave
          </Button>
        </div>
      </div>
    </Dialog>
  );
};

export default NavBlocker;
