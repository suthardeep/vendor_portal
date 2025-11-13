const BentoSkeleton = () => {
  return (
    <div className="mt-4 flex h-[83dvh] items-start gap-6">
      <div className="flex h-full w-[70%] flex-col gap-6">
        <div className="shimmer h-3/4 w-full" />
        <div className="shimmer h-3/12 w-full" />
      </div>
      <div className="flex h-full w-[30%] flex-col gap-5">
        <div className="shimmer h-3/5 w-full" />
        <div className="shimmer h-1/5 w-full flex-1" />
      </div>
    </div>
  );
};

export default BentoSkeleton;
