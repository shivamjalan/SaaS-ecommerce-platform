import { cn } from "../../lib/utils";

/* ===================================================== */
/* ================ SECTION LABEL / BADGE ============== */
/* ===================================================== */

export const SectionLabel = (
  { children, className, pulse = true }
) => (
  <div
    className={cn(
      "inline-flex items-center gap-3 rounded-full border border-accent/30 bg-accent/5 px-5 py-2",
      className
    )}
  >
    <span
      className={cn(
        "h-2 w-2 rounded-full bg-accent",
        pulse && "animate-pulse-dot"
      )}
    />

    <span className="font-mono text-xs uppercase tracking-[0.15em] text-accent">
      {children}
    </span>
  </div>
);

/* ===================================================== */
/* ================== STATUS BADGE ===================== */
/* ===================================================== */

export const Badge = (
  { children, className }
) => (
  <span
    className={cn(
      "inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold",
      className
    )}
  >
    {children}
  </span>
);
