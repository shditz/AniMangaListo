"use client";

export default function SkeletonLoader() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
      {[...Array(20)].map((_, i) => (
        <div
          key={i}
          className="animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg h-60 md:h-50 xl:h-90"
        ></div>
      ))}
    </div>
  );
}
