import React from "react";
import FallbackView, {
  type FallbackViewProps,
} from "@/components/empty-states/FallbackView";
import Spinner from "./spinner/Spinner";
import type { UseQueryResult } from "@tanstack/react-query";

function QueryStateHandler({
  query,
  loadingSkeleton = null,
  errorFallback,
  emptyFallback,
  emptyTitle = "",
  children,
  fallbackIcon,
  isEmpty = false,
  isLoading: isAdditionalLoading = false,
}: QueryStateHandlerProps) {
  const { isLoading, isError, error, data } = query;

  if (isLoading || isAdditionalLoading) {
    return <>{loadingSkeleton || <Spinner />}</>;
  }

  if (isError) {
    if (errorFallback) return <>{errorFallback(error)}</>;

    return (
      <FallbackView
        title={error?.message || "An unknown error occurred"}
        icon={fallbackIcon}
      />
    );
  }

  const computedEmpty =
    typeof isEmpty === "boolean"
      ? isEmpty // user-defined boolean wins
      : (() => {
          const items = Array.isArray((data as any)?.data)
            ? (data as any).data
            : Array.isArray(data)
              ? data
              : [];
          return items.length === 0;
        })();

  if (computedEmpty) {
    if (emptyFallback) return <>{emptyFallback}</>;
    return (
      <FallbackView
        title={emptyTitle || "No data found"}
        icon={fallbackIcon}
        classname="m-4"
      />
    );
  }

  return children;
}

export default QueryStateHandler;

interface QueryStateHandlerProps {
  query: UseQueryResult<unknown, Error>;
  loadingSkeleton: React.ReactNode;
  errorFallback?: (error: unknown) => React.ReactNode;
  emptyFallback?: React.ReactNode;
  emptyTitle: string;
  children: React.ReactNode;
  fallbackIcon?: FallbackViewProps["icon"];
  isEmpty?: boolean;
  isLoading?: boolean;
}
