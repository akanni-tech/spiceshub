import React from "react";

export function CategoryCardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-lg aspect-square bg-gray-100 border border-gray-200 animate-pulse">
      {/* Image placeholder */}
      <div className="absolute inset-0 bg-gray-200" />

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
        {/* Category name placeholder */}
        <div className="h-4 w-2/3 bg-gray-300 rounded mb-2" />
        {/* "Explore" placeholder */}
        <div className="h-3 w-1/3 bg-gray-400 rounded" />
      </div>
    </div>
  );
}
