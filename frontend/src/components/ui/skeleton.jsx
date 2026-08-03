import { cn } from "../../lib/utils";

/* ===================================================== */
/* ================= SKELETON PRIMITIVE ================ */
/* ===================================================== */

const Skeleton = ({
  className,
}) => (
  <div
    className={cn(
      "relative overflow-hidden rounded-xl bg-muted",
      className
    )}
  >
    <div className="absolute inset-0 animate-shimmer bg-gradient-to-r from-transparent via-white/70 to-transparent" />

  </div>
);

export default Skeleton;
