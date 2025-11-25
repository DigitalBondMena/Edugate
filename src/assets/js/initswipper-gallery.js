
const initGalleryImagesSwiper = () => {
  const gallerySwiper = document.querySelector(".gallery-swiper-btn");
  if(!gallerySwiper) return;
  requestAnimationFrame(()=>{
      new Swiper(".gallery-swiper", {
        slidesPerView: 1,
        loop: true,
        speed: 600,
        observer:true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
          dynamicBullets: true,   
          dynamicMainBullets: 3, 
        }
      });
  })
};

function initSwiperBtnGallery() {
  const gallerySwiperBtn = document.querySelector(".gallery-swiper-btn");
  if (!gallerySwiperBtn)return;
  requestAnimationFrame(() => {
      new Swiper(".gallery-swiper-btn", {
        slidesPerView: 1,
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
        },
      });
  });

  const buttons = document.querySelectorAll(".tab-btn");
  const tabContentArea = document.getElementById("tab-content-area");

  // Cache store
  const cacheStore = new Map();

  function loadTab(tabId) {
    tabContentArea.innerHTML = "";

    // Check cache
    if (cacheStore.has(tabId)) {
      const cachedNode = cacheStore.get(tabId).cloneNode(true);
      tabContentArea.appendChild(cachedNode);
      return;
    }

    // First time load
    const originalContent = document.querySelector(`#tabs-cache > #${tabId}`);
    if (!originalContent) return;

    const cloned = originalContent.cloneNode(true);
    cacheStore.set(tabId, cloned);

    originalContent.remove();

    tabContentArea.appendChild(cloned.cloneNode(true));
  }

  function activateButton(btn) {
    buttons.forEach((b) => b.classList.remove("bg-primary-text-color!","hover:bg-primary-text-color/80")); 
    btn.classList.add("bg-primary-text-color!", "hover:bg-primary-text-color/80!");
  }

  // Setup click events
  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.target;
      if (!tabId) return;
      activateButton(btn);
      loadTab(tabId);
      console.log("load image");
      
      initGalleryImagesSwiper();
    });
  });

  // Load first tab by default
  if (buttons.length > 0) {
    buttons[0].click();
  }
}
document.addEventListener("DOMContentLoaded",function() {
  initSwiperBtnGallery();
})