import React from 'react';

export function ProductCardSkeleton() {
  return (
    <div className="animate-pulse group cursor-pointer">
      <div className="relative overflow-hidden rounded-lg mb-3 bg-[#FEFAE0]/60 border border-[#BC6C25]/20 shadow-md">
        {/* Image placeholder */}
        <div className="w-full aspect-[3/4] bg-gray-200"></div>

        {/* Badges placeholder */}
        <div className="absolute top-3 left-3 flex flex-col gap-2">
          <div className="h-5 w-10 bg-gray-300 rounded-full"></div>
          <div className="h-5 w-12 bg-gray-300 rounded-full"></div>
        </div>

        {/* Quick actions placeholder */}
        <div className="absolute top-3 right-3 flex flex-col gap-2">
          <div className="h-9 w-9 bg-gray-200 rounded-full"></div>
          <div className="h-9 w-9 bg-gray-200 rounded-full"></div>
        </div>

        {/* Add to cart placeholder */}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <div className="h-10 w-full bg-gray-300 rounded-lg"></div>
        </div>
      </div>

      {/* Info section */}
      <div className="p-1 space-y-2">
        <div className="h-4 w-1/4 bg-gray-300 rounded"></div>
        <div className="h-5 w-3/4 bg-gray-300 rounded"></div>
        <div className="h-5 w-2/3 bg-gray-300 rounded"></div>

        <div className="flex items-center gap-2 mt-2">
          <div className="h-5 w-20 bg-gray-300 rounded"></div>
          <div className="h-4 w-10 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  );
}
