import { cn } from "@/utils/helpers";
import React, { type ReactNode } from "react";

const Bento: BentoComponent = ({
  children,
  className,
  ratio = "70-30",
  gap = 16,
}) => {
  const cols = React.Children.toArray(children).map((child, idx) => {
    if (!React.isValidElement(child)) return child;

    const spans = ratioToClasses[ratio];
    const spanClass = spans[idx as 0 | 1] ?? "lg:col-span-6";

    const childWithProps = child as React.ReactElement<{
      className?: string;
      gap?: BentoProps["gap"];
    }>;

    return React.cloneElement(childWithProps, {
      className: `${childWithProps.props.className ?? ""} col-span-12 ${spanClass}`,
      gap,
    });
  });

  return (
    <div
      className={cn(`grid grid-cols-12`, className)}
      aria-label="Bento layout"
      style={{
        gap,
      }}
    >
      {cols}
    </div>
  );
};

type Ratio = "50-50" | "70-30" | "30-70" | "75-25" | "25-75";

interface BentoProps {
  children: ReactNode;
  ratio?: Ratio;
  gap?: number;
  className?: string;
}

interface BentoColumnProps {
  children: ReactNode;
  className?: string;
  gap?: BentoProps["gap"];
}

const Col1: React.FC<BentoColumnProps> = ({ children, className, gap }) => (
  <div
    data-col="1"
    style={{
      gap,
    }}
    className={cn("flex flex-col", className)}
  >
    {children}
  </div>
);

const Col2: React.FC<BentoColumnProps> = ({ children, className, gap }) => (
  <div
    data-col="2"
    style={{
      gap,
    }}
    className={cn("flex flex-col", className)}
  >
    {children}
  </div>
);

interface BentoComponent extends React.FC<BentoProps> {
  Col1: typeof Col1;
  Col2: typeof Col2;
}

const ratioToClasses: Record<Ratio, [string, string]> = {
  "50-50": ["lg:col-span-6", "lg:col-span-6"],
  "70-30": ["lg:col-span-8", "lg:col-span-4"],
  "30-70": ["lg:col-span-4", "lg:col-span-8"],
  "75-25": ["lg:col-span-9", "lg:col-span-3"],
  "25-75": ["lg:col-span-3", "lg:col-span-9"],
};

Bento.Col1 = Col1;
Bento.Col2 = Col2;

export default Bento;
