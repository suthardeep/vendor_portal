import { useEffect, useRef, useCallback, useState } from 'react';

interface UseInfiniteScrollOptions {
  /** Callback fired when user scrolls near the bottom */
  onLoadMore: () => void | Promise<void>;
  /** Whether more items can be loaded */
  hasMore: boolean;
  /** Whether currently loading */
  isLoading: boolean;
  /** Distance from bottom (in px) to trigger load. Default: 200 */
  threshold?: number;
  /** Root element for intersection observer. Default: viewport */
  root?: Element | null;
  /** Root margin for intersection observer. Default: '0px' */
  rootMargin?: string;
}

interface UseInfiniteScrollReturn {
  /** Ref to attach to the sentinel/trigger element at the bottom of your list */
  sentinelRef: (node: HTMLElement | null) => void;
  /** Manual trigger for loading more (useful for "Load More" buttons) */
  loadMore: () => void;
}

/**
 * Hook for implementing infinite scroll with Intersection Observer
 * 
 * @example
 * ```tsx
 * const { sentinelRef } = useInfiniteScroll({
 *   onLoadMore: fetchNextPage,
 *   hasMore: hasNextPage,
 *   isLoading: isFetching,
 *   threshold: 200
 * });
 * 
 * return (
 *   <div>
 *     {items.map(item => <Item key={item.id} {...item} />)}
 *     <div ref={sentinelRef} />
 *   </div>
 * );
 * ```
 */
export function useInfiniteScroll({
  onLoadMore,
  hasMore,
  isLoading,
  threshold = 200,
  root = null,
  rootMargin = '0px',
}: UseInfiniteScrollOptions): UseInfiniteScrollReturn {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);

  // Memoized load more function to prevent unnecessary re-execution
  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore || isExecuting) return;

    setIsExecuting(true);
    try {
      await onLoadMore();
    } finally {
      setIsExecuting(false);
    }
  }, [onLoadMore, isLoading, hasMore, isExecuting]);

  // Callback ref for the sentinel element
  const sentinelRef = useCallback(
    (node: HTMLElement | null) => {
      // Cleanup previous observer
      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      // Don't observe if conditions aren't met
      if (!node || isLoading || !hasMore) return;

      // Create new observer
      const observer = new IntersectionObserver(
        (entries) => {
          const [entry] = entries;
          if (entry.isIntersecting) {
            loadMore();
          }
        },
        {
          root,
          rootMargin: `${threshold}px`,
          threshold: 0.1,
        }
      );

      observer.observe(node);
      observerRef.current = observer;
    },
    [loadMore, isLoading, hasMore, root, threshold]
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { sentinelRef, loadMore };
}