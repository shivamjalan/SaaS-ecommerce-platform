import { forwardRef } from "react";
import { cva } from "class-variance-authority";

import { cn } from "../../lib/utils";

/* ===================================================== */
/* ================== BUTTON PRIMITIVE ================= */
/* ===================================================== */

const buttonVariants = cva(
  [
    "inline-flex items-center justify-center gap-2",
    "rounded-xl font-medium text-sm",
    "transition-all duration-200 ease-out",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-50",
    "active:scale-[0.98]",
  ],
  {
    variants: {

      variant: {
        primary: [
          "gradient-bg text-white",
          "shadow-sm hover:shadow-accent hover:-translate-y-0.5 hover:brightness-110",
        ],
        secondary: [
          "bg-muted text-foreground",
          "hover:bg-muted/70 hover:-translate-y-0.5",
        ],
        outline: [
          "border border-border bg-transparent text-foreground",
          "hover:border-accent/30 hover:shadow-sm hover:-translate-y-0.5",
        ],
        ghost: [
          "bg-transparent text-muted-foreground",
          "hover:text-foreground hover:bg-muted",
        ],
        danger: [
          "bg-red-600 text-white",
          "hover:bg-red-700 hover:-translate-y-0.5",
        ],
      },

      size: {
        sm: "h-9 px-4",
        md: "h-12 px-6",
        lg: "h-14 px-8 text-base",
        icon: "h-11 w-11",
      },

    },

    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
);

export const Button = forwardRef(
  (
    { className, variant, size, ...props },
    ref
  ) => (
    <button
      ref={ref}
      className={cn(
        buttonVariants({ variant, size }),
        className
      )}
      {...props}
    />
  )
);

Button.displayName = "Button";
