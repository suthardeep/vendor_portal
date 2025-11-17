import { Link } from "@tanstack/react-router";
import { ChevronRightIcon } from "lucide-react";
import React from "react";

export type BreadcrumbItem = {
  label: string;
  to: string;
};

interface BreadcrumbsProps {
  breadcrumbs: BreadcrumbItem[];
}

const Breadcrumbs: React.FC<BreadcrumbsProps> = (props) => {
  const { breadcrumbs } = props;

  return (
    <ol className={`flex h-6 flex-wrap space-x-1`}>
      {breadcrumbs.map((breadcrumb, index) => {
        return (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <ChevronRightIcon
                className="text-base-2 dark:text-base-2 mr-0.5"
                size={14}
              />
            )}
            <Link
              to={breadcrumb.to}
              className={`truncate text-sm transition-colors ${breadcrumbs.length === index + 1 ? "text-base-3 dark:text-neutral-content font-medium" : "text-base-2 hover:text-base-3 dark:text-base-2 hover:dark:text-neutral-content"}`}
            >
              {breadcrumb.label}
            </Link>
          </li>
        );
      })}
    </ol>
  );
};

export default Breadcrumbs;
