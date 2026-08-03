import Skeleton from "../ui/skeleton";

/* ===================================================== */
/* ============ PRODUCT CARD LOADING SKELETON ========== */
/* ===================================================== */

const ProductCardSkeleton = () => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
    <div className="relative">
      <Skeleton className="h-72 w-full rounded-none" />

      <Skeleton className="absolute top-4 left-4 h-8 w-24 rounded-full" />

    </div>

    <div className="p-6 space-y-3">
      <Skeleton className="h-6 w-3/4" />

      <Skeleton className="h-4 w-full" />

      <Skeleton className="h-4 w-2/3" />

      <div className="flex items-center justify-between pt-3">
        <div className="space-y-2">
          <Skeleton className="h-3 w-20" />

          <Skeleton className="h-7 w-24" />

        </div>

        <Skeleton className="h-12 w-12 rounded-2xl" />

      </div>
    </div>
  </div>
);

export default ProductCardSkeleton;
