import Swiper from "swiper";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/autoplay";
// @ts-ignore
import "swiper/css/navigation";
import { Autoplay, Navigation,Pagination } from "swiper/modules";

/**
 * Initialize Swipers used on the About Us page
 */
const initGalleryImagesSwiper = () => {
    new Swiper(".gallery-swiper", {
    modules: [Navigation, Pagination, Autoplay],
    slidesPerView: 1,
    loop: true,
    // autoplay: {
    //   delay: 3500,
    //   disableOnInteraction: false,
    // },
    speed: 600,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    }
  });
}
type TabID = string;
type CacheMap = Map<TabID, HTMLElement>;
export function initSwiperGallery(): void {
  requestAnimationFrame(() => {
    const gallerySwiper = document.querySelector(".gallery-swiper");
    if (gallerySwiper) {
      new Swiper(".gallery-swiper", {
        modules: [Navigation, Autoplay],
        slidesPerView: 1,
        // autoplay: {
        //   delay: 3000,
        //   disableOnInteraction: false,
        //   pauseOnMouseEnter: true,
        // },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
        },
      });
    }
    initGalleryImagesSwiper()
  });
const buttons: NodeListOf<HTMLButtonElement> = document.querySelectorAll(".tab-btn");
const tabContentArea = document.getElementById("tab-content-area") as HTMLElement;
const cacheStore: CacheMap = new Map<TabID, HTMLElement>();

function loadTab(tabId: TabID): void {
  // Clear displayed content
  tabContentArea.innerHTML = "";

  // If tab content is already cached → reuse it
  if (cacheStore.has(tabId)) {
    const cachedNode = cacheStore.get(tabId)!.cloneNode(true) as HTMLElement;
    tabContentArea.appendChild(cachedNode);
    return;
  }

  // First time loading: get the hidden original element
  const originalContent = document.querySelector(`#tabs-cache > #${tabId}`) as HTMLElement | null;

  if (!originalContent) return;

  // Cache a cloned copy
  const cloned = originalContent.cloneNode(true) as HTMLElement;
  cacheStore.set(tabId, cloned);
   originalContent.remove();
  // Display one copy
  tabContentArea.appendChild(cloned.cloneNode(true));
}

function activateButton(btn: HTMLButtonElement): void {
  buttons.forEach((b) =>
    b.classList.remove("bg-primary-text-color/80", "scale-105")
  );
  btn.classList.add("bg-primary-text-color/80", "scale-105");
}

// Setup click events
buttons.forEach((btn: HTMLButtonElement) => {
  btn.addEventListener("click", () => {
    const tabId = btn.dataset.target;
    if (!tabId) return;
    activateButton(btn);
    loadTab(tabId);
  });
});

// Load first tab by default
if (buttons.length > 0) {
  buttons[0].click();
}
}

