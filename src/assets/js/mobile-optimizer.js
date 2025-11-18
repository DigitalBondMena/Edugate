class ResponsiveDomOptimizer {
  constructor(breakpoint = 992) {
    this.breakpoint = breakpoint;
    this.elementsMap = new Map();
    this.init();
  }

  init() {
    this.checkScreen();
    window.addEventListener("resize", () => this.checkScreen());
  }

  checkScreen() {
    if (window.innerWidth <= this.breakpoint) {
      this.hideForMobile();
    } else {
      this.restoreForDesktop();
    }
  }

  hideForMobile() {
    document.querySelectorAll("[data-hide-mobile]").forEach((el) => {
      if (!this.elementsMap.has(el)) {
        this.elementsMap.set(el, {
          parent: el.parentNode,
          next: el.nextSibling
        });
      }
      el.remove(); // يشيل العنصر فعليًا من الـ DOM
    });
  }

  restoreForDesktop() {
    this.elementsMap.forEach((ref, el) => {
      if (!ref.parent.contains(el)) {
        if (ref.next) {
          ref.parent.insertBefore(el, ref.next);
        } else {
          ref.parent.appendChild(el);
        }
      }
    });
  }
}

new ResponsiveDomOptimizer(1024);
