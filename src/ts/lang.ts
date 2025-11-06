// src/lang.ts
/**
 * Small helper for language detection & toggle using the path.
 * Exports:
 *  - initLangFromPath()     -> runs detection and applies <html lang> and dir
 *  - attachLangToggle(btn)  -> attach to a button element to switch languages
 */

export type Lang = "ar" | "en";

export function getLangFromPath(): Lang {
  const p = window.location.pathname.toLowerCase();
  // Check for /ar/ or /ar (with or without trailing slash)
  if (p.includes("/ar")) return "ar";
  if (p.includes("/en")) return "en";
  // default language when not explicit in path
  return "ar";
}

export function initLangFromPath(): void {
  getLangFromPath();
}

/**
 * Attempt to switch the current page from /ar to /en and vice versa,
 * works with or without trailing slashes.
 */
export function toggleLangUrl(): void {
  const path = window.location.pathname;

  // Handle paths with /ar/ or /ar
  if (path.includes("/ar")) {
    window.location.href = path.replace("/ar", "/en");
    return;
  }

  // Handle paths with /en/ or /en
  if (path.includes("/en")) {
    window.location.href = path.replace("/en", "/ar");
    return;
  }

  // Fallback: determine current language and switch
  const currentLang = getLangFromPath();
  if (currentLang === "ar") {
    window.location.href = "/en";
  } else {
    window.location.href = "/ar";
  }
}

export function attachLangToggle(button: HTMLElement | null): void {
  if (!button) return;
  button.addEventListener("click", (e) => {
    e.preventDefault();
    toggleLangUrl();
  });
}
