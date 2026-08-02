/* ===================================================== */
/* =============== STOREFRONT THEMES =================== */
/* ===================================================== */

export const THEMES = [
  {
    value: "default",
    label: "Classic Rose",
    btn: "bg-rose-500 hover:bg-rose-600",
    banner:
      "bg-gradient-to-r from-rose-500/70 via-pink-500/50 to-black/40",
  },
  {
    value: "royal",
    label: "Royal Purple",
    btn: "bg-purple-700 hover:bg-purple-800",
    banner:
      "bg-gradient-to-r from-purple-800/70 via-indigo-600/50 to-black/40",
  },
  {
    value: "emerald",
    label: "Emerald",
    btn: "bg-emerald-600 hover:bg-emerald-700",
    banner:
      "bg-gradient-to-r from-emerald-700/70 via-teal-500/50 to-black/40",
  },
  {
    value: "midnight",
    label: "Midnight",
    btn: "bg-indigo-700 hover:bg-indigo-800",
    banner:
      "bg-gradient-to-r from-indigo-900/80 via-slate-800/50 to-black/40",
  },
];

export const getTheme = (value) =>

  THEMES.find(
    (theme) => theme.value === value
  ) || THEMES[0];
