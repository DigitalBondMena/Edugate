
export function setActiveNavLink() {
  const currentPath = window.location.pathname;

  const pathParts = currentPath.split("/").filter((part) => part !== "");

  // Find the page identifier (skip language folder)
  let currentPageFolder = "";

  // Check if path includes language folder (en/ar)
  if (pathParts.length >= 2) {
    // Path like: /en/about-us/index.html or /ar/contact/index.html
    currentPageFolder = pathParts[1]; // Gets "about-us" or "contact"
  } else if (pathParts.length === 1) {
    // Path like: /en/ or /ar/ (home page)
    currentPageFolder = "home";
  }

  // If path is root or just index.html, it's home
  if (
    !currentPageFolder ||
    currentPath === "/" ||
    (currentPath.endsWith("index.html") && pathParts.length <= 1)
  ) {
    currentPageFolder = "home";
  }

  console.log("Current page folder:", currentPageFolder); // Debug log

  // Select all navbar links (both desktop and mobile)
  const navLinks = document.querySelectorAll<HTMLAnchorElement>(
    "nav a[href], #mobile-menu a[href], .nav-link"
  );

  navLinks.forEach((link) => {
    link.classList.remove("active-link");

    const linkHref = link.getAttribute("href");
    if (!linkHref) return;

    // Extract page identifier from link href
    // Examples:
    // - "../about-us/index.html" or "about-us/index.html" → "about-us"
    // - "en/contact/index.html" → "contact"
    // - "/" or "index.html" → "home"

    let linkPageFolder = "";

    if (
      linkHref === "/" ||
      linkHref === "./index.html" ||
      linkHref === "../index.html" ||
      linkHref === "index.html" ||
      linkHref.endsWith("/en/") ||
      linkHref.endsWith("/ar/")
    ) {
      linkPageFolder = "home";
    } else {
      // Extract folder name from href
      const hrefParts = linkHref
        .split("/")
        .filter(
          (part) =>
            part !== "" &&
            part !== "." &&
            part !== ".." &&
            part !== "index.html"
        );

      // Get the last meaningful part (the page folder)
      if (hrefParts.length > 0) {
        // Remove language folder if present
        const lastPart = hrefParts[hrefParts.length - 1];
        linkPageFolder =
          lastPart === "en" || lastPart === "ar"
            ? hrefParts[hrefParts.length - 2] || "home"
            : lastPart;
      }
    }

    // Add active class if folders match
    if (linkPageFolder === currentPageFolder) {
      link.classList.add("active-link");
      console.log("Active link:", linkHref, "(matched:", linkPageFolder, ")"); // Debug log
    }
  });
}

/**
 * Initialize navbar functionality
 * Automatically sets the active link for the current page
 * Should be called after DOM is ready
 */
export function initNavbar() {
  setActiveNavLink();

  // Re-check active link after browser back/forward navigation
  window.addEventListener("popstate", setActiveNavLink);
}
