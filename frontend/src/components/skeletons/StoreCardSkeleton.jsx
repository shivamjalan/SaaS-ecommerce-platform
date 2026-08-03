import Skeleton from "../ui/skeleton";

/* ===================================================== */
/* ============ STORE CARD LOADING SKELETON ============ */
/* ===================================================== */

const StoreCardSkeleton = () => (
  <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm">
    <Skeleton className="h-56 w-full rounded-none" />

    <div className="p-6 space-y-3">
      <Skeleton className="h-6 w-1/2" />

      <Skeleton className="h-4 w-full" />

      <Skeleton className="h-4 w-3/4" />

      <Skeleton className="mt-5 h-5 w-28" />

    </div>
  </div>
);

export default StoreCardSkeleton;
