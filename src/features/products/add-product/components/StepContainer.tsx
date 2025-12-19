import { cn } from "@/utils/helpers";
import React from "react";

interface StepContainerProps {
  children: React.ReactNode;
  className?: string;
  actionButtons: React.ReactNode[];
}

const StepContainer = ({ children, className, actionButtons }: StepContainerProps) => {
  return (
    <div className="flex flex-col gap-2 justify-between">
      <div className={cn("flex flex-col gap-6 ", className)}>
        {children}
      </div>
      <div className="flex justify-end items-center gap-2">
        {actionButtons?.map((btn, idx) => (
          <React.Fragment key={idx}>{btn}</React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default StepContainer;
