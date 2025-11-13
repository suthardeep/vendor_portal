import { useToggle } from "@/hooks/useToggle";
import { cn } from "@/utils/helpers";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface CollapsibleProps {
  trigger: ReactNode;
  children: ReactNode;
  classname?: string;
  bodyClassname?: string;
  triggerClassname?: string;
  defaultOpen?: boolean;
  hideIcon?: boolean;
  isOpen?: boolean;
  toggle?: () => void;
  dynamicHeight?: boolean;
}

const Collapsible: React.FC<CollapsibleProps> = (props) => {
  const {
    children,
    classname,
    trigger,
    defaultOpen = false,
    hideIcon = false,
    bodyClassname,
    dynamicHeight = false,
    triggerClassname = "",
  } = props;

  const internalToggle = useToggle(defaultOpen || false);
  const isControlled = props.isOpen !== undefined && props.toggle !== undefined;
  const isOpen = isControlled ? props.isOpen : internalToggle.isOpen;
  const toggle = isControlled ? props.toggle : internalToggle.toggle;
  const [maxHeight, setMaxHeight] = useState("0px");
  const contentRef = useRef<HTMLDivElement>(null);
  const [hasBeenOpened, setHasBeenOpened] = useState(defaultOpen);

  useEffect(() => {
    if (!dynamicHeight || !contentRef.current) return;

    const observer = new ResizeObserver(() => {
      if (isOpen && contentRef.current) {
        const newHeight = contentRef.current.scrollHeight;
        setMaxHeight(`${newHeight}px`);
      }
    });

    observer.observe(contentRef.current);

    return () => observer.disconnect();
  }, [isOpen, dynamicHeight]);

  useEffect(() => {
    if (isOpen) {
      setHasBeenOpened(true);
    }
  }, [isOpen]);

  return (
    <div className={cn(classname)}>
      <div
        onClick={toggle}
        className={cn("flex items-center gap-x-3", triggerClassname)}
      >
        {trigger}
        {hideIcon === false && (
          <ChevronDown
            size={16}
            className={cn(
              "ml-auto cursor-pointer transition-all",
              isOpen ? "-scale-y-100" : "scale-100",
            )}
          />
        )}
      </div>
      <div
        className={cn(
          "overflow-hidden transition-all duration-200 ease-in-out",
          bodyClassname,
        )}
        style={{
          maxHeight: isOpen
            ? dynamicHeight
              ? maxHeight
              : `${contentRef.current?.scrollHeight || 1000}px`
            : "0px",
        }}
      >
        <div ref={contentRef}> {hasBeenOpened && children} </div>
      </div>
    </div>
  );
};

export default Collapsible;
