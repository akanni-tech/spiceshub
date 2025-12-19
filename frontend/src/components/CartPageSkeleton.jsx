import React from "react";

export default function CartPageSkeleton() {
  // Reusable Tailwind skeleton utility
  const Skeleton = ({ className }) => (
    <div className={`bg-gray-200 rounded-md ${className} animate-pulse`} />
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 font-sans">
      {/* Page title */}
      <Skeleton className="h-10 w-64 mb-8" />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2 space-y-6">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 bg-white rounded-lg border border-[#DDA15E]/50 shadow-sm"
            >
              {/* Image */}
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded bg-[#FEFAE0] flex-shrink-0 overflow-hidden border border-[#DDA15E]/20">
                <Skeleton className="w-full h-full" />
              </div>

              {/* Info */}
              <div className="flex-1 flex flex-col justify-between">
                <div>
                  <Skeleton className="h-5 w-2/3 mb-2" />
                  <Skeleton className="h-5 w-24" />
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-3 mt-3">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <Skeleton className="h-6 w-6" />
                  <Skeleton className="h-8 w-8 rounded-md" />
                </div>
              </div>

              {/* Right section: remove + price */}
              <div className="flex flex-col items-end justify-between ml-4">
                <Skeleton className="h-8 w-8 rounded-md" />
                <Skeleton className="h-5 w-16" />
              </div>
            </div>
          ))}

          <Skeleton className="h-4 w-72 mt-4" />
          <Skeleton className="h-10 w-48 mt-2" />
        </div>

        {/* Right: Order Summary */}
        <div>
          <div className="bg-[#FEFAE0] rounded-lg p-6 sticky top-24 border border-[#DDA15E]/50 space-y-5">
            <Skeleton className="h-8 w-48 mb-4" />

            {/* Subtotal + shipping */}
            <div className="space-y-3">
              <div className="flex justify-between">
                <Skeleton className="h-5 w-24" />
                <Skeleton className="h-5 w-20" />
              </div>
              <div className="flex justify-between">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-5 w-16" />
              </div>
              <Skeleton className="h-4 w-48 mt-3" />
            </div>

            {/* Total */}
            <div className="pt-4 border-t border-[#DDA15E]/30">
              <div className="flex justify-between items-center">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-6 w-24" />
              </div>
            </div>

            {/* Checkout button */}
            <Skeleton className="h-10 w-full mt-4 rounded-md" />

            {/* Taxes note */}
            <Skeleton className="h-3 w-32 mx-auto mt-2" />
          </div>
        </div>
      </div>
    </div>
  );
}
