import Skeleton from "../ui/skeleton";

/* ===================================================== */
/* ========== PRODUCT DETAIL LOADING SKELETON ========== */
/* ===================================================== */

const ProductDetailSkeleton = () => (
  <div className="min-h-screen bg-background">
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Skeleton className="h-5 w-28" />

      <div className="grid md:grid-cols-2 gap-12 mt-8">
        <div className="space-y-4">
          <Skeleton className="h-[28rem] w-full rounded-[2rem]" />

          <div className="flex gap-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-20 w-20 rounded-xl"
              />
            ))}
          </div>
        </div>

        <div className="space-y-5">
          <Skeleton className="h-5 w-24 rounded-full" />

          <Skeleton className="h-10 w-2/3" />

          <Skeleton className="h-8 w-32" />

          <Skeleton className="h-4 w-full" />

          <Skeleton className="h-4 w-full" />

          <Skeleton className="h-4 w-3/4" />

          <Skeleton className="mt-8 h-14 w-48 rounded-xl" />

        </div>
      </div>
    </div>
  </div>
);

export default ProductDetailSkeleton;
