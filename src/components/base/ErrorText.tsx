import { cn } from "@/utils/helpers";
import type { ReactNode } from "react";

interface ErrorTextProps {
  className?: string;
  children: ReactNode;
}

const ErrorText: React.FC<ErrorTextProps> = (props) => {
  const { className, children } = props;

  return (
    <p className={cn("text-base-3 dark:text-neutral-500", className)}>{children}</p>
  );
};

export default ErrorText;
