import React from "react";

export function DashboardProductCardSkeleton() {
  return (
    <div className="border border-[#F0F0F0] rounded-lg bg-white animate-pulse">
      {/* Image placeholder */}
      <div className="relative aspect-square bg-gray-200 rounded-t-lg" />

      {/* Product Info */}
      <div className="p-4 space-y-3">
        <div>
          {/* Name + Status */}
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="h-4 w-3/4 bg-gray-300 rounded" />
            <div className="h-4 w-12 bg-gray-300 rounded-full" />
          </div>
          {/* Category */}
          <div className="h-3 w-1/2 bg-gray-200 rounded" />
        </div>

        {/* Price + Stock */}
        <div className="flex items-center justify-between pt-2 border-t border-[#F0F0F0]">
          <div className="space-y-1">
            <div className="h-4 w-16 bg-gray-300 rounded" />
            <div className="h-3 w-10 bg-gray-200 rounded" />
          </div>
          <div className="text-right space-y-1">
            <div className="h-3 w-10 bg-gray-200 rounded ml-auto" />
            <div className="h-4 w-8 bg-gray-300 rounded ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
