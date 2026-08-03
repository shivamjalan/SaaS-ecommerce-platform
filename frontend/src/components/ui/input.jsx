import { forwardRef } from "react";

import { cn } from "../../lib/utils";

/* ===================================================== */
/* =================== INPUT PRIMITIVE ================= */
/* ===================================================== */

export const Input = forwardRef(
  (
    { className, ...props },
    ref
  ) => (
    <input
      ref={ref}
      className={cn(
        "h-12 w-full rounded-xl border border-border bg-transparent px-4 text-sm text-foreground",
        "placeholder:text-muted-foreground/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);

Input.displayName = "Input";

/* ===================================================== */
/* ================== TEXTAREA PRIMITIVE =============== */
/* ===================================================== */

export const Textarea = forwardRef(
  (
    { className, ...props },
    ref
  ) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-xl border border-border bg-transparent px-4 py-3 text-sm text-foreground",
        "placeholder:text-muted-foreground/50",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        "disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    />
  )
);

Textarea.displayName = "Textarea";
