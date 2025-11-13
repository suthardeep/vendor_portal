import { cn } from "@/utils/helpers";
import { X } from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Button, type ButtonProps } from "../base/Button";
import { IconButton } from "../base/IconButton";

export interface SheetAction {
  label: string;
  onClick: () => void;
  disabled?: boolean;
  startIcon?: ButtonProps["startIcon"];
  endIcon?: ButtonProps["endIcon"];
  fullWidth?: boolean;
  isLoading?: boolean;
  className?: string;
  size?: ButtonProps["size"];
  variant?: ButtonProps["variant"];
  color?: ButtonProps["color"];
}

interface SheetProps {
  close: () => void;
  isOpen: boolean;
  children: ReactNode;
  title: string;
  subTitle?: ReactNode;
  footer?: ReactNode;
  actions?: SheetAction[];
  disableBackdropClose?: boolean;
  size?: "sm" | "md" | "lg" | "xl" | "full";
}

const Sheet: React.FC<SheetProps> = (props) => {
  const {
    children,
    isOpen,
    title,
    subTitle,
    footer,
    close,
    actions,
    disableBackdropClose = false,
    size = "md",
  } = props;
  const [shouldRenderContent, setShouldRenderContent] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRenderContent(true);
      if (document) {
        document.body.style.overflow = "hidden";
      }
    } else {
      const timeout = setTimeout(() => setShouldRenderContent(false), 300);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  const handleBackdropClick = () => {
    if (!disableBackdropClose) {
      close();
    }
  };

  return (
    <div
      className={cn(
        `fixed inset-0 z-50 bg-black/80 backdrop-blur-[1.5px] transition-opacity duration-300`,
        isOpen ? "opacity-100" : "pointer-events-none opacity-0",
      )}
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          `fixed top-0 right-0 flex h-full w-full min-w-xs transform justify-end p-2 shadow-sm transition-transform duration-300`,
          isOpen ? "translate-x-0" : "translate-x-full",
          sizeMap[size],
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={cn(
            `dark:bg-nd-800 flex h-[98dvh] w-full flex-col rounded-[10px] border border-b bg-white`,
            borderColorClass,
          )}
        >
          {shouldRenderContent && (
            <>
              {title && (
                <div
                  className={cn(
                    "flex shrink-0 items-center justify-between border-b",
                    borderColorClass,
                    paddingClass,
                  )}
                >
                  <div className="flex flex-col">
                    {title && (
                      <h6 className="text-nl-700 dark:text-nd-50 font-medium">
                        {title}
                      </h6>
                    )}
                    {subTitle && (
                      <p className="text-nl-400 dark:text-nd-300">{subTitle}</p>
                    )}
                  </div>
                  <IconButton
                    icon={X}
                    size={"xs"}
                    onClick={close}
                    iconClassName="text-nl-700 dark:text-nd-200"
                  />
                </div>
              )}

              <div className={cn("flex-1 overflow-hidden")}>
                <div className="no-scrollbar h-full overflow-y-auto [&>div]:px-5 [&>div]:py-4">
                  {children}
                </div>
              </div>

              {footer && (
                <div
                  className={cn(
                    "shrink-0 border-t",
                    paddingClass,
                    borderColorClass,
                  )}
                >
                  {footer}
                </div>
              )}
              {actions && actions.length > 0 && (
                <div
                  className={cn(
                    "flex shrink-0 gap-x-2 border-t",
                    paddingClass,
                    borderColorClass,
                  )}
                >
                  {actions?.map((item, index) => {
                    const { label, ...rest } = item;
                    return (
                      <div
                        className="flex w-full items-center gap-x-1"
                        key={index}
                      >
                        <Button {...rest} key={index} className="grow">
                          {label}
                        </Button>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

const borderColorClass = `border-nl-200 dark:border-nd-500`;
const paddingClass = `px-4.5 py-3.5`;

export default Sheet;

const sizeMap = {
  sm: "max-w-lg",
  md: "max-w-2xl",
  lg: "max-w-4xl",
  xl: "max-w-7xl",
  full: "w-[98%]",
};
