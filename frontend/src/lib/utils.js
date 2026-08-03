import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/* ===================================================== */
/* ================ CLASS MERGE HELPER ================= */
/* ===================================================== */

export const cn = (
  ...inputs
) => twMerge(clsx(inputs));
