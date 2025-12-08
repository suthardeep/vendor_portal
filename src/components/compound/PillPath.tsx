// PillPath.tsx

import React from 'react';
import { cva } from 'class-variance-authority'; 
import { cn } from '@/utils/helpers';

const COLOR_MAP = [
  'primary',
  'error',
  'accent',
  'success',
  'warning',
] as const;

const pillVariants = cva(
  `
    px-3 py-1 
    text-sm 
    rounded-lg 
    
    md:px-4 md:py-2 
    md:text-base
    md:rounded-xl 
    
    font-medium 
    whitespace-nowrap 
    transition-colors 
    duration-200
  `,
  {
    variants: {
      variant: {
        primary: 'text-primary bg-primary/10 hover:bg-primary/20',
        error: 'text-error bg-error/10 hover:bg-error/20',
        accent: 'text-accent bg-accent/10 hover:bg-accent/20',
        success: 'text-success bg-success/10 hover:bg-success/20',
        warning: 'text-warning bg-warning/10 hover:bg-warning/20',
      },
    },
    defaultVariants: {
      variant: 'primary',
    },
  },
);

const separatorVariants = cva(
  'text-base-content text-lg md:text-xl leading-none select-none shrink-0'
);

interface PillPathProps {
  items: string[];
  label?: string;
  /** 👇 NEW — Controls if > separator is shown */
  showSeparator?: boolean;
}

const PillPath: React.FC<PillPathProps> = ({ items, label, showSeparator = false }) => {
  if (!items || items.length === 0) return null;

  return (
    <div className="p-3 md:p-4 bg-white shadow-lg rounded-xl max-w-full">
      <h2 className="text-gray-700 text-base md:text-lg font-semibold mb-3">
        {label || "Categories"}
      </h2>

      <div className="flex flex-row flex-wrap items-center gap-y-2 gap-x-2">

        {items.map((item, index) => {
          const colorVariant = COLOR_MAP[index % COLOR_MAP.length];
          const showArrow = showSeparator && index < items.length - 1;

          return (
            <React.Fragment key={index}>
              <div 
                className={cn(pillVariants({ variant: colorVariant }))}
                title={item}
              >
                {item}
              </div>

              {showArrow && (
                <div className={cn(separatorVariants())}>
                  &gt;
                </div>
              )}
            </React.Fragment>
          );
        })}

      </div>
    </div>
  );
};

export default PillPath;
