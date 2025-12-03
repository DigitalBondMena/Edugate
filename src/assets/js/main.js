// ==================== PERFORMANCE OPTIMIZATIONS ====================
const performanceConfig = {
  scrollThrottle: 16, // ~60fps
  scrollThreshold: 300,
  animationTimeout: 200,
  idleCallbackTimeout: 2000,
};

// ==================== LOADING SCREEN MANAGEMENT ====================
class LoadingScreenManager {
  constructor() {
    this.loadingScreen = document.getElementById("loading-screen");
    this.init();
  }
  isSafari() {
    const ua = navigator.userAgent.toLowerCase();
    return (
      ua.includes("safari") && !ua.includes("chrome") && !ua.includes("android")
    );
  }
  isIOS() {
    return /iphone|ipad|ipod/i.test(navigator.userAgent);
  }
  init() {
    if (window.PerformanceObserver && !this.isSafari() && !this.isIOS()){
      new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          requestAnimationFrame(() => this.close());
        }
      }).observe({ type: "largest-contentful-paint", buffered: true });
    } else {
      window.addEventListener("load", this.close());
    }
  }
  close() {
    if (this.loadingScreen) {
      this.loadingScreen.classList.add("hidden");
      setTimeout(() => {
        this.loadingScreen.remove();
      }, 600);
    }
  }
}

// ==================== FLOATING BUTTONS MANAGER ====================
class FloatingButtonsManager {
  constructor() {
    this.whatsappBtn = document.querySelector(".whatsapp-btn");
    this.scrollTopBtn = document.getElementById("scroll-to-top");
    this.lastScrollPosition = 0;
    this.ticking = false;

    this.init();
  }

  init() {
    this.bindScrollEvents();
    this.bindClickEvents();
  }

  bindScrollEvents() {
    window.addEventListener("scroll", this.throttleScroll.bind(this), {
      passive: true,
    });
  }

  bindClickEvents() {
    if (this.scrollTopBtn) {
      this.scrollTopBtn.addEventListener("click", () => {
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        });
      });
    }
  }

  throttleScroll() {
    if (!this.ticking) {
      requestAnimationFrame(() => {
        this.handleScroll();
        this.ticking = false;
      });
      this.ticking = true;
    }
  }

  handleScroll() {
    const scrollPosition =
      window.pageYOffset || document.documentElement.scrollTop;

    // Avoid unnecessary DOM operations
    if (Math.abs(scrollPosition - this.lastScrollPosition) < 50) return;

    this.lastScrollPosition = scrollPosition;
    const shouldShow = scrollPosition > performanceConfig.scrollThreshold;

    // Batch DOM operations
    [this.whatsappBtn, this.scrollTopBtn].forEach((btn) => {
      if (btn) btn.classList.toggle("show", shouldShow);
    });
  }
}

// ==================== DROPDOWN MANAGER ====================
class DropdownManager {
  constructor(buttonSelector, dropdownId) {
    this.button = document.querySelector(buttonSelector);
    this.dropdown = document.getElementById(dropdownId);
    this.isOpen = false;

    if (this.button && this.dropdown) {
      this.init();
    }
  }

  init() {
    this.dropdown.classList.add("dropdown-closed", "hidden");
    this.bindEvents();
  }

  bindEvents() {
    this.button.addEventListener("click", this.toggle.bind(this));

    document.addEventListener("click", this.handleOutsideClick.bind(this));
    document.addEventListener("keydown", this.handleEscapeKey.bind(this));

    // Close on option click
    this.dropdown.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", this.close.bind(this));
    });
  }

  toggle(e) {
    e.stopPropagation();
    this.isOpen ? this.close() : this.open();
  }

  open() {
    this.isOpen = true;
    this.button.classList.add("active");
    this.dropdown.classList.remove("hidden", "dropdown-closed");

    // Force reflow
    void this.dropdown.offsetWidth;

    this.dropdown.classList.add("dropdown-open");
  }

  close() {
    this.isOpen = false;
    this.button.classList.remove("active");
    this.dropdown.classList.remove("dropdown-open");
    this.dropdown.classList.add("dropdown-closed");

    setTimeout(() => {
      if (!this.isOpen) {
        this.dropdown.classList.add("hidden");
      }
    }, performanceConfig.animationTimeout);
  }

  handleOutsideClick(e) {
    if (!this.dropdown.contains(e.target) && !this.button.contains(e.target)) {
      this.close();
    }
  }

  handleEscapeKey(e) {
    if (e.key === "Escape" && this.isOpen) {
      this.close();
    }
  }
}

// ==================== MOBILE MENU MANAGER ====================
class MobileMenuManager {
  constructor() {
    this.openBtn = document.getElementById("mobile-menu-btn");
    this.mobileMenu = document.getElementById("mobile-menu");
    this.overlay = document.getElementById("menu-overlay");

    if (this.openBtn && this.mobileMenu && this.overlay) {
      this.init();
    }
  }

  init() {
    this.bindEvents();
    this.initMobileDropdowns();
  }

  bindEvents() {
    this.openBtn.addEventListener("click", this.open.bind(this));
    this.overlay.addEventListener("click", this.close.bind(this));
  }

  open() {
    this.mobileMenu.classList.remove(
      "ltr:-translate-x-full",
      "translate-x-full"
    );
    this.overlay.classList.remove("hidden");
  }

  close() {
    this.mobileMenu.classList.add("ltr:-translate-x-full", "translate-x-full");
    this.overlay.classList.add("hidden");

    // Close all dropdowns when menu closes
    this.closeAllDropdowns();
  }

  initMobileDropdowns() {
    const dropdownTriggers = document.querySelectorAll(
      "#mobile-menu .group\\/menui-1 > a, #mobile-menu .group\\/menui-2 > a, #mobile-menu .group\\/menui-3 > a"
    );

    dropdownTriggers.forEach((trigger) => {
      trigger.addEventListener("click", this.handleDropdownClick.bind(this));
    });
  }

  handleDropdownClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const parent = e.currentTarget.parentElement;
    const dropdown = e.currentTarget.nextElementSibling;

    if (!dropdown || !parent) return;

    const isActive = parent.classList.contains("active");

    // Close other dropdowns
    this.closeAllDropdowns(parent);

    // Toggle current dropdown
    if (isActive) {
      parent.classList.remove("active");
      dropdown.classList.remove("show");
    } else {
      parent.classList.add("active");
      dropdown.classList.add("show");
    }
  }

  closeAllDropdowns(exceptParent = null) {
    document
      .querySelectorAll(
        "#mobile-menu .group\\/menui-1, #mobile-menu .group\\/menui-2, #mobile-menu .group\\/menui-3"
      )
      .forEach((item) => {
        if (item !== exceptParent) {
          item.classList.remove("active");
          const dropdown = item.querySelector("ul");
          if (dropdown) dropdown.classList.remove("show");
        }
      });
  }
}

// ==================== NAVIGATION MANAGER ====================
class NavigationManager {
  constructor() {
    this.currentPath = window.location.pathname;
  }

  setActiveNavLink() {
    const currentPageFolder = this.getCurrentPageFolder();
    const navLinks = document.querySelectorAll(
      "nav a[href], #mobile-menu a[href], .nav-link"
    );

    navLinks.forEach((link) => {
      link.classList.remove("active-link");
      const linkPageFolder = this.getLinkPageFolder(link);

      if (linkPageFolder === currentPageFolder) {
        link.classList.add("active-link");
      }
    });
  }

  getCurrentPageFolder() {
    const pathParts = this.currentPath.split("/").filter((part) => part !== "");

    if (pathParts.length >= 2) {
      return pathParts[1]; // Gets "about-us", "contact", etc.
    } else if (pathParts.length === 1) {
      return "home";
    }

    // Root path or index.html
    if (
      !pathParts.length ||
      this.currentPath === "/" ||
      (this.currentPath.endsWith("index.html") && pathParts.length <= 1)
    ) {
      return "home";
    }

    return pathParts[pathParts.length - 1] || "home";
  }

  getLinkPageFolder(link) {
    const linkHref = link.getAttribute("href");
    if (!linkHref) return "";

    // Home page links
    if (this.isHomeLink(linkHref)) {
      return "home";
    }

    // Extract folder name from href
    const hrefParts = linkHref
      .split("/")
      .filter(
        (part) =>
          part !== "" && part !== "." && part !== ".." && part !== "index.html"
      );

    if (!hrefParts.length) return "home";

    const lastPart = hrefParts[hrefParts.length - 1];
    return lastPart === "en" || lastPart === "ar"
      ? hrefParts[hrefParts.length - 2] || "home"
      : lastPart;
  }

  isHomeLink(linkHref) {
    return (
      linkHref === "/" ||
      linkHref === "./index.html" ||
      linkHref === "../index.html" ||
      linkHref === "index.html" ||
      linkHref.endsWith("/en/") ||
      linkHref.endsWith("/ar/")
    );
  }

  init() {
    this.setActiveNavLink();
    window.addEventListener("popstate", () => {
      this.currentPath = window.location.pathname;
      this.setActiveNavLink();
    });
  }
}

// ==================== PAGE SPECIFIC LOADER ====================
// class PageSpecificLoader {
//     constructor() {
//         this.path = window.location.pathname;
//     }

//     async loadPageSpecificAssets() {
//         const tasks = [];

//         // Swiper initialization based on page
//         if (this.isHomePage()) {
//             tasks.push(this.loadSwiper("./ts/init-swiper-home.js"));
//         } else if (this.path.includes("about-us")) {
//             tasks.push(this.loadSwiper("./ts/init-swiper-about-us.js"));
//         } else if (this.path.includes("gallery")) {
//             tasks.push(this.loadSwiper("./ts/initswipper-gallery.js"));
//         }

//         // Execute tasks during idle time
//         if (tasks.length > 0) {
//             this.scheduleIdleTask(async () => {
//                 await Promise.allSettled(tasks);
//             });
//         }
//     }

//     async loadSwiper(modulePath) {
//         try {
//             const module = await import(modulePath);
//             if (module.initSwiperHome || module.initSwiperAbout || module.initSwiperGallery) {
//                 Object.values(module)[0](); // Call the first function export
//             }
//         } catch (error) {
//             console.warn(`Swiper module ${modulePath} loading failed:`, error);
//         }
//     }

//     isHomePage() {
//         return this.path === "/ar/index.html" ||
//                this.path === "/en/index.html" ||
//                this.path === "/en" ||
//                this.path === "/ar" ||
//                this.path === "/";
//     }

//     scheduleIdleTask(callback) {
//         if ("requestIdleCallback" in window) {
//             requestIdleCallback(callback, { timeout: performanceConfig.idleCallbackTimeout });
//         } else {
//             setTimeout(callback, 1);
//         }
//     }
// }

// ==================== MAIN APPLICATION INITIALIZATION ====================
class App {
  constructor() {
    this.components = {};
  }

  async initialize() {
    // Initialize core components
    this.components.loadingManager = new LoadingScreenManager();
    this.components.floatingButtons = new FloatingButtonsManager();
    this.components.navigation = new NavigationManager();
    // this.components.pageLoader = new PageSpecificLoader();

    // Wait for DOM to be ready for interactive components
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.initInteractiveComponents()
      );
    } else {
      this.initInteractiveComponents();
    }

    // Load page-specific assets
    // this.components.pageLoader.loadPageSpecificAssets();
  }

  initInteractiveComponents() {
    // Language dropdown
    this.components.languageDropdown = new DropdownManager(
      '[data-dropdown-toggle="language-dropdown-menu"]',
      "language-dropdown-menu"
    );

    // Mobile menu
    this.components.mobileMenu = new MobileMenuManager();

    // Navigation
    this.components.navigation.init();
  }
}

// ==================== APPLICATION START ====================
// Initialize the application
const app = new App();

// Start the app with error handling
app.initialize().catch((error) => {
  console.error("Application initialization failed:", error);
});

// Export for potential debugging
if (typeof window !== "undefined") {
  window.app = app;
}
