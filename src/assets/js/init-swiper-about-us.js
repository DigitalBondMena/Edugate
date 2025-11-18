import Swiper from "swiper";
// @ts-ignore
import "swiper/css";
// @ts-ignore
import "swiper/css/autoplay";
// @ts-ignore
import "swiper/css/navigation";
import { Autoplay, Navigation } from "swiper/modules";

/**
 * Initialize Swipers used on the About Us page
 */
export function initSwiperAbout(): void {
  requestAnimationFrame(() => {
    const partnersSwiper = document.querySelector(".partners-swiper");
    if (partnersSwiper) {
      new Swiper(".partners-swiper", {
        modules: [Navigation, Autoplay],
        slidesPerView: 1,
        spaceBetween: 30,
        loop: true,
        observer: true,
        observeParents: true,
        watchSlidesProgress: true,
        autoplay: {
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        },
        navigation: {
          nextEl: ".swiper-button-next",
          prevEl: ".swiper-button-prev",
        },
        breakpoints: {
          640: { slidesPerView: 2 },
          768: { slidesPerView: 3 },
          1024: { slidesPerView: 4 },
          1280: { slidesPerView: 5 },
        },
      });
    }
  });
}
