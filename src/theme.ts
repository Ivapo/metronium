export type ThemeName = "nium" | "dark" | "light" | "3.1" | "tui";

const STORAGE_KEY = "metronium_theme";
const THEME_ORDER: ThemeName[] = ["nium", "dark", "light", "3.1", "tui"];

export function getTheme(): ThemeName {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (THEME_ORDER.includes(stored as ThemeName)) {
    return stored as ThemeName;
  }
  return "nium";
}

export function setTheme(theme: ThemeName): void {
  localStorage.setItem(STORAGE_KEY, theme);
  if (theme === "nium") {
    document.documentElement.removeAttribute("data-theme");
  } else {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

export function cycleTheme(): ThemeName {
  const current = getTheme();
  const idx = THEME_ORDER.indexOf(current);
  const next = THEME_ORDER[(idx + 1) % THEME_ORDER.length]!;
  setTheme(next);
  return next;
}

export function initTheme(): void {
  setTheme(getTheme());
}
