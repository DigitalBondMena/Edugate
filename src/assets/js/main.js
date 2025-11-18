const closeLoadingScreen = () => {
  const loadingScreen = document.getElementById("loading-screen");
  if (loadingScreen) {
    loadingScreen.remove();
  }
  document.body.style.overflow = "auto";
};

// BFCache handling
window.addEventListener("pageshow", (event) => {
  if (event.persisted) {
    closeLoadingScreen();
    initNavbar();
  }
});

// Hide loading screen on load
window.addEventListener("load", () => {
  closeLoadingScreen();
});

// ==================== Floating Buttons Scroll Optimization ====================
const whatsappBtn = document.querySelector(".whatsapp-btn");
const scrollTopBtn = document.getElementById("scroll-to-top");

let ticking = false;
let lastScrollPosition = 0;

const handleScroll = () => {
  const scrollThreshold = 300;
  const scrollPosition =
    window.pageYOffset || document.documentElement.scrollTop;

  if (Math.abs(scrollPosition - lastScrollPosition) < 50) return;

  lastScrollPosition = scrollPosition;

  const shouldShow = scrollPosition > scrollThreshold;

  if (whatsappBtn) {
    whatsappBtn.classList.toggle("show", shouldShow);
  }
  if (scrollTopBtn) {
    scrollTopBtn.classList.toggle("show", shouldShow);
  }
};

const onScroll = () => {
  if (!ticking) {
    window.requestAnimationFrame(() => {
      handleScroll();
      ticking = false;
    });
    ticking = true;
  }
};

window.addEventListener("scroll", onScroll, { passive: true });

// Scroll to top
if (scrollTopBtn) {
  scrollTopBtn.addEventListener("click", () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  });
}

// ==================== DOMContentLoaded ====================
document.addEventListener("DOMContentLoaded", () => {
  // Language Dropdown
  const langButton = document.querySelector(
    '[data-dropdown-toggle="language-dropdown-menu"]'
  );
  const langDropdown = document.getElementById("language-dropdown-menu");

  if (langButton && langDropdown) {
    langDropdown.classList.add("dropdown-closed", "hidden");

    langButton.addEventListener("click", (e) => {
      e.stopPropagation();

      const isOpen = langDropdown.classList.contains("dropdown-open");

      if (isOpen) {
        langButton.classList.remove("active");
        langDropdown.classList.remove("dropdown-open");
        langDropdown.classList.add("dropdown-closed");
        setTimeout(() => langDropdown.classList.add("hidden"), 200);
      } else {
        langButton.classList.add("active");
        langDropdown.classList.remove("hidden", "dropdown-closed");
        void langDropdown.offsetWidth;
        langDropdown.classList.add("dropdown-open");
      }
    });

    // Close on outside click
    document.addEventListener("click", (e) => {
      if (
        !langDropdown.contains(e.target) &&
        !langButton.contains(e.target)
      ) {
        if (langDropdown.classList.contains("dropdown-open")) {
          langButton.classList.remove("active");
          langDropdown.classList.remove("dropdown-open");
          langDropdown.classList.add("dropdown-closed");
          setTimeout(() => langDropdown.classList.add("hidden"), 200);
        }
      }
    });

    // Close on option click
    langDropdown.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        langButton.classList.remove("active");
        langDropdown.classList.remove("dropdown-open");
        langDropdown.classList.add("dropdown-closed");
        setTimeout(() => langDropdown.classList.add("hidden"), 200);
      });
    });

    // Close on Esc key
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && langDropdown.classList.contains("dropdown-open")) {
        langButton.classList.remove("active");
        langDropdown.classList.remove("dropdown-open");
        langDropdown.classList.add("dropdown-closed");
        setTimeout(() => langDropdown.classList.add("hidden"), 200);
      }
    });
  }

  // Navbar active state
  initNavbar();

  // Page-specific
  const path = window.location.pathname;

  // Form validation
  const initBlogDetailsForm = async () => {
    await import("./style/validation.css");
    const module = await import("./ts/form-validation.js");

    try {
      module.default({ formSelector: 'form[data-validate="true"]' });
    } catch {}
  };

  if (path.includes("blog-details")) {
    initBlogDetailsForm();
  }

  // Text editor
  const initBlogDetailsTextEditor = async () => {
    await import("./style/text-editor.css");
    const module = await import("./ts/text-editor.js");
    module.initializeTextEditor();
  };

  if (path.includes("blog-details")) {
    initBlogDetailsTextEditor();
  }

  // requestIdleCallback fallback
  const scheduleTask = (callback) => {
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
    scheduleTask(async () => {
      const module = await import("./ts/init-swiper-home.js");
      module.initSwiperHome();
    });
  } else if (path.includes("about-us")) {
    scheduleTask(async () => {
      const module = await import("./ts/init-swiper-about-us.js");
      module.initSwiperAbout();
    });
  } else if (path.includes("gallery")) {
    scheduleTask(async () => {
      const module = await import("./ts/initswipper-gallery.js");
      module.initSwiperGallery();
    });
  }

  // ==================== Mobile Menu ====================  
  const openBtn = document.getElementById("mobile-menu-btn");
  const mobileMenu = document.getElementById("mobile-menu");
  const overlay = document.getElementById("menu-overlay");

  if (openBtn && mobileMenu && overlay) {
    const openMenu = () => {
      mobileMenu.classList.remove("ltr:-translate-x-full", "translate-x-full");
      overlay.classList.remove("hidden");
    };

    const closeMenu = () => {
      mobileMenu.classList.add("ltr:-translate-x-full", "translate-x-full");
      overlay.classList.add("hidden");
    };

    openBtn.addEventListener("click", openMenu);
    overlay.addEventListener("click", closeMenu);
  }

  // Mobile dropdowns
  const mobileDropdownTriggers = document.querySelectorAll(
    "#mobile-menu .group\\/menui-1 > a, #mobile-menu .group\\/menui-2 > a, #mobile-menu .group\\/menui-3 > a"
  );

  mobileDropdownTriggers.forEach((trigger) => {
    trigger.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();

      const parent = trigger.parentElement;
      const dropdown = trigger.nextElementSibling;

      if (dropdown && parent) {
        const isActive = parent.classList.contains("active");

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
// navbar

function setActiveNavLink() {
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


  // Select all navbar links (both desktop and mobile)
  const navLinks = document.querySelectorAll(
    "nav a[href], #mobile-menu a[href], .nav-link"
  );

  navLinks.forEach((link) => {
    link.classList.remove("active-link");

    const linkHref = link.getAttribute("href");
    if (!linkHref) return;

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
function initNavbar() {
  setActiveNavLink();
  window.addEventListener("popstate", setActiveNavLink);
}
