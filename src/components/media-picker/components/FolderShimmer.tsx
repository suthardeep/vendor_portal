export const FolderShimmer = () => {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-4">
      {Array.from({ length: 12 }).map((_, idx) => (
        <div
          key={idx}
          className="h-28 bg-gray-200 rounded-xl animate-pulse"
        />
      ))}
    </div>
  );
};
