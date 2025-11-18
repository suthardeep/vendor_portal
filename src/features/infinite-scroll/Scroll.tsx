import { PhoneNumberInput } from '@/components/base/MobileNumberInput';
import { useInfiniteScroll } from '@/hooks/useInfiniteScrolling';
import { useEffect, useRef, useCallback, useState } from 'react';




export function ExampleInfiniteList() {
  const [items, setItems] = useState<string[]>(Array.from({ length: 20 }, (_, i) => `Item ${i + 1}`));
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);

  const loadMore = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newItems = Array.from({ length: 20 }, (_, i) => `Item ${page * 20 + i + 1}`);
    setItems(prev => [...prev, ...newItems]);
    setPage(prev => prev + 1);
    
    // Stop after 5 pages
    if (page >= 4) setHasMore(false);
    
    setIsLoading(false);
  };

  const { sentinelRef } = useInfiniteScroll({
    onLoadMore: loadMore,
    hasMore,
    isLoading,
    threshold: 200,
  });

  return (
    <div style={{ padding: '20px' }}>
      <h2>Infinite Scroll Example</h2>
      {/* <div>
        {items.map((item, idx) => (
          <div key={idx} style={{ padding: '10px', border: '1px solid #ccc', margin: '10px 0' }}>
            {item}
          </div>
        ))}
      </div> */}
      
      {/* {hasMore && (
        <div ref={sentinelRef} style={{ padding: '20px', textAlign: 'center' }}>
          {isLoading ? 'Loading...' : 'Scroll for more'}
        </div>
      )} */}
      
      {/* {!hasMore && (
        <div style={{ padding: '20px', textAlign: 'center', color: '#666' }}>
          No more items to load
        </div>
      )} */}

      <PhoneNumberInput></PhoneNumberInput>
    </div>
  );
}