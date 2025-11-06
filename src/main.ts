// Lazy load Font Awesome only
const loadFontAwesome = () =>
  import("@fortawesome/fontawesome-free/css/all.min.css");

import "./style/rtl.css";
import { initSwiperAbout } from "./ts/init-swiper-about-us";
import { initSwiperHome } from "./ts/init-swiper-home";
import { attachLangToggle, initLangFromPath } from "./ts/lang";
import { initNavbar } from "./ts/navbar";

// BFCache: Handle page restoration
window.addEventListener("pageshow", (event: PageTransitionEvent) => {
  if (event.persisted) {
    // Reinitialize any necessary components
    const loadingScreen = document.getElementById("loading-screen");
    if (loadingScreen) {
      loadingScreen.classList.add("hidden");
    }

    // Re-set active navbar link when page is restored from cache
    initNavbar();
  }
});

// Hide loading screen when page is fully loaded
window.addEventListener("load", () => {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    // Use requestAnimationFrame for smooth transition
    requestAnimationFrame(() => {
      loadingScreen.classList.add("hidden");
      // Remove from DOM after transition completes to free up memory
      setTimeout(() => {
        loadingScreen.remove();
      }, 300);
    });
  }

  // Load Font Awesome after page load
  loadFontAwesome();
});

// Floating Action Buttons - Show/Hide on Scroll with Performance Optimization
const whatsappBtn = document.querySelector(".whatsapp-btn") as HTMLElement;
const scrollTopBtn = document.getElementById(
  "scroll-to-top"
) as HTMLButtonElement;

let ticking = false;
let lastScrollPosition = 0;

const handleScroll = (): void => {
  const scrollThreshold = 300; // Show buttons after scrolling 300px
  const scrollPosition =
    window.pageYOffset || document.documentElement.scrollTop;

  // Only update if scroll position changed significantly (reduces reflows)
  if (Math.abs(scrollPosition - lastScrollPosition) < 50) {
    return;
  }

  lastScrollPosition = scrollPosition;

  // Use a single class toggle to reduce DOM operations
  const shouldShow = scrollPosition > scrollThreshold;

  if (whatsappBtn) {
    whatsappBtn.classList.toggle("show", shouldShow);
  }
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle("show", shouldShow);
  }
};

// Throttle scroll event using requestAnimationFrame for better performance
const onScroll = (): void => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
};

// Scroll to top functionality
const scrollToTop = (): void => {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};

// Add event listeners with passive flag for better scroll performance
window.addEventListener("scroll", onScroll, { passive: true });
scrollTopBtn?.addEventListener("click", scrollToTop);

document.addEventListener("DOMContentLoaded", () => {
  // ==================== Language Initialization ====================
  initLangFromPath();
  attachLangToggle(document.getElementById("language-dropdown-menu"));

  // ==================== Language Dropdown Toggle ====================
  const langButton = document.querySelector(
    '[data-dropdown-toggle="language-dropdown-menu"]'
  ) as HTMLElement;
  const langDropdown = document.getElementById("language-dropdown-menu");

  if (langButton && langDropdown) {
    // Initialize dropdown as hidden
    langDropdown.classList.add("dropdown-closed", "hidden");

    // Toggle dropdown on button click with animation
    langButton.addEventListener("click", (e) => {
      e.stopPropagation();

      const isOpen = langDropdown.classList.contains("dropdown-open");

      if (isOpen) {
        // Close dropdown
        langButton.classList.remove("active");
        langDropdown.classList.remove("dropdown-open");
        langDropdown.classList.add("dropdown-closed");
        setTimeout(() => langDropdown.classList.add("hidden"), 200);
      } else {
        // Open dropdown
        langButton.classList.add("active");
        langDropdown.classList.remove("hidden", "dropdown-closed");
        // Force reflow to trigger transition
        void langDropdown.offsetWidth;
        langDropdown.classList.add("dropdown-open");
      }
    });

    // Close dropdown when clicking outside
    document.addEventListener("click", (e) => {
      if (
        !langDropdown.contains(e.target as Node) &&
        !langButton.contains(e.target as Node)
      ) {
        if (langDropdown.classList.contains("dropdown-open")) {
          langButton.classList.remove("active");
          langDropdown.classList.remove("dropdown-open");
          langDropdown.classList.add("dropdown-closed");
          setTimeout(() => langDropdown.classList.add("hidden"), 200);
        }
      }
    });

    // Close dropdown when clicking a language option
    langDropdown.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        langButton.classList.remove("active");
        langDropdown.classList.remove("dropdown-open");
        langDropdown.classList.add("dropdown-closed");
        setTimeout(() => langDropdown.classList.add("hidden"), 200);
      });
    });

    // Close dropdown on Escape key
    document.addEventListener("keydown", (e) => {
      if (
        e.key === "Escape" &&
        langDropdown.classList.contains("dropdown-open")
      ) {
        langButton.classList.remove("active");
        langDropdown.classList.remove("dropdown-open");
        langDropdown.classList.add("dropdown-closed");
        setTimeout(() => langDropdown.classList.add("hidden"), 200);
      }
    });
  }

  // ==================== Navbar Active State ====================
  initNavbar();

  // ==================== Page-Specific Features ====================
  const path = window.location.pathname;

  // Use requestIdleCallback for non-critical initialization (with fallback)
  const scheduleTask = (callback: () => void) => {
    if ("requestIdleCallback" in window) {
      requestIdleCallback(callback, { timeout: 2000 });
    } else {
      setTimeout(callback, 1);
    }
  };

  if (
    path === "/ar/index.html" ||
    path === "/en/index.html" ||
    path === "/en" ||
    path === "/ar" ||
    path === "/"
  ) {
    scheduleTask(() => {
      initSwiperHome();
    });
  } else if (path.includes("about-us")) {
    scheduleTask(() => {
      initSwiperAbout();
    });
  }

  // ==================== Mobile Menu ====================
  const openBtn = document.getElementById(
    "mobile-menu-btn"
  ) as HTMLButtonElement | null;
  const mobileMenu = document.getElementById(
    "mobile-menu"
  ) as HTMLDivElement | null;
  const overlay = document.getElementById(
    "menu-overlay"
  ) as HTMLDivElement | null;

  if (openBtn && mobileMenu && overlay) {
    const openMenu = (): void => {
      const isRtl = document.documentElement.dir === "rtl";
      if (isRtl) {
        mobileMenu.classList.remove("translate-x-full");
      } else {
        mobileMenu.classList.remove("-translate-x-full");
      }
      overlay.classList.remove("hidden");
    };

    const closeMenu = (): void => {
      const isRtl = document.documentElement.dir === "rtl";
      if (isRtl) {
        mobileMenu.classList.add("translate-x-full");
      } else {
        mobileMenu.classList.add("-translate-x-full");
      }
      overlay.classList.add("hidden");
    };

    openBtn.addEventListener("click", openMenu);
    overlay.addEventListener("click", closeMenu);
  }

  // Mobile offcanvas dropdown functionality
  const mobileDropdownTriggers = document.querySelectorAll(
    "#mobile-menu .group\\/menui-1 > a, #mobile-menu .group\\/menui-2 > a, #mobile-menu .group\\/menui-3 > a"
  );

  mobileDropdownTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const parent = trigger.parentElement as HTMLElement;
      const dropdown = trigger.nextElementSibling as HTMLElement;

      if (dropdown && parent) {
        const isActive = parent.classList.contains("active");

        // Close all other dropdowns
        document
          .querySelectorAll(
            "#mobile-menu .group\\/menui-1, #mobile-menu .group\\/menui-2, #mobile-menu .group\\/menui-3"
          )
          .forEach((item) => {
            if (item !== parent) {
              item.classList.remove("active");
              const otherDropdown = item.querySelector("ul");
              if (otherDropdown) {
                otherDropdown.classList.remove("show");
              }
            }
          });

        // Toggle current dropdown
        if (isActive) {
          parent.classList.remove("active");
          dropdown.classList.remove("show");
        } else {
          parent.classList.add("active");
          dropdown.classList.add("show");
        }
      }
    });
  });
});
