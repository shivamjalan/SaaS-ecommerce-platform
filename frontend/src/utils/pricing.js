/* ===================================================== */
/* ==================== PRICING HELPERS ================ */
/* ===================================================== */

// Matches the backend GST calculation (subtotal + 5%, rounded)
export const GST_RATE = 0.05;

export const GST_RATE_PERCENT = 5;

export const roundGstTotal = (subtotal) =>
  Math.round(subtotal * (1 + GST_RATE));
