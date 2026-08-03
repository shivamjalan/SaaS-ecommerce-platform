import Skeleton from "../ui/skeleton";

import ProductCardSkeleton from "./ProductCardSkeleton";

/* ===================================================== */
/* ============ STORE PAGE LOADING SKELETON ============ */
/* ===================================================== */

const StorePageSkeleton = () => (
  <div className="bg-background min-h-screen">
    {/* banner skeleton */}

    <div className="relative h-96 overflow-hidden">
      <Skeleton className="h-full w-full rounded-none" />

      <div className="absolute bottom-0 left-0 w-full p-16 px-6 max-w-6xl mx-auto">
        <Skeleton className="h-4 w-16 mb-4" />

        <Skeleton className="h-14 w-2/3 max-w-md" />

        <Skeleton className="mt-4 h-5 w-1/2 max-w-sm" />

      </div>
    </div>

    <div className="max-w-6xl mx-auto py-16 px-6">
      <Skeleton className="h-5 w-32 mb-10" />

      <div className="flex flex-col lg:flex-row gap-4 mb-10">
        <Skeleton className="h-12 w-full max-w-md rounded-xl" />

        <div className="flex flex-wrap gap-2">
          {[...Array(4)].map((_, i) => (
            <Skeleton
              key={i}
              className="h-9 w-20 rounded-full"
            />
          ))}
        </div>

        <Skeleton className="h-12 w-44 rounded-xl lg:ml-auto" />

      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    </div>
  </div>
);

export default StorePageSkeleton;
