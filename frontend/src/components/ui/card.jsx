import { forwardRef } from "react";

import { cn } from "../../lib/utils";

/* ===================================================== */
/* =================== CARD PRIMITIVE ================== */
/* ===================================================== */

export const Card = forwardRef(
  (
    { className, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "rounded-2xl border border-border bg-card shadow-md",
        className
      )}
      {...props}
    />
  )
);

Card.displayName = "Card";

/* ===================================================== */
/* ================ FEATURED GRADIENT CARD ============= */
/* ===================================================== */

export const FeaturedCard = forwardRef(
  (
    { className, ...props },
    ref
  ) => (
    <div
      ref={ref}
      className={cn(
        "gradient-border rounded-2xl p-[2px] shadow-accent-lg",
        className
      )}
    >
      <div
        className="h-full w-full rounded-[calc(1rem-2px)] bg-card"
        {...props}
      />
    </div>
  )
);

FeaturedCard.displayName = "FeaturedCard";
